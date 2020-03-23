(function(){
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>sheet</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>{htmldata}</body></html>';
    var Excel_URL = 'data:application/vnd.ms-excel;base64,'
    // base64
    var Export ={
        toExcel:function(data){
            // "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
            var isIE = window.navigator.userAgent.toLocaleLowerCase().indexOf('trident')
            if(isIE !== -1){
                // IE 系列的浏览器
                this._IEExport(data)
            }else{
                // 其他浏览器
                this._OtherExport(data)
            }
        },
        _IEExport:function(data){
            // 1 打开excel
            var oXL = new ActiveXObject("Excel.Application")
            // 2 新建工作簿
            var oWB = oXL.Workbooks.Add()
            // 3 激活新建的工作簿
            var oSheet = oWB.ActiveSheet
            
            if(typeof data === "string"){
                // table id
                var table = document.querySelector(data)
                // 创建一个装内容的容器：
                var sel = document.body.createTextRange()
                // 将table 中的内容移入到容器中
                sel.moveToElementText(table)
                // 选中移入的内容
                try {
                    sel.select()
                } catch (error) {
                    console.log(error)
                }
                // 复制容器中的内容
                sel.execCommand("Copy")
                // 粘贴到excel工作簿中
                oSheet.Paste()
            }else{
                // []
                var j = 0
                for(key in data[0]){
                    oSheet.Cells(1,++j).value = data[0][key]
                }
                for(var i =1;i<data.length;i++){
                    j = 0
                    var row = data[i]
                    for(key in row){
                        if(key === "datatime"){
                            oSheet.Cells(i+1,++j) = this._ChangeDate(row[key])
                        }else{
                            oSheet.Cells(i+1,++j) = row[key]
                        }
                    }
                }

            }
            // 设置文件名字
            var filename = oXL.Application.GetSaveAsFilename("weizhuanye.xls","Excel Spreadsheets (*.xls),*.xls")
            // 保存工作簿
            oWB.SaveAs(filename)
            oWB.Close()
            oXL.Quit()

        },
        _OtherExport:function(data){
            var content = ''
            if(typeof data === "string"){
                // 传过来是表格ID
                var ele = document.querySelector(data)
                content = template.replace("{htmldata}",ele.outerHTML)
            }else{
                console.log(data)
                var arr = [];
                var _this = this
                arr.push("<table>")
                data.forEach(function(value,index){
                    arr.push("<tr style='color:red'>")
                    for (key in value){
                        arr.push("<td>" + (key=="datatime" && index!=0?_this.ChangeDate(value[key]):value[key])+"</td>")
                    }
                    arr.push("</tr>")
                })
                arr.push("</table>")
                content = template.replace("{htmldata}",arr.join(''))
            }
            var aEle = document.createElement('a')
            aEle.href = Excel_URL + window.btoa(unescape(encodeURIComponent(content)))
            aEle.download = "wangyi.xls"
            aEle.click()
        },
        _ChangeDate:function(timestamp){
            //2018-11-11
            var date = new Date(timestamp)
            var year = date.getFullYear()
            var month = date.getMonth()+1
            var day = date.getDate()
            return year+ "-" + month + "-" + day
        }
    }
    window.Export = Export
})()