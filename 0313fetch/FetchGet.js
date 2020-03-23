/**
 * 获取数据
 * @param url   资源地址
 * @param options   资源对象
 */
function FetchGet(url,options,callback) {
    //post  put  delete
    var option  = {method:"GET"};
    if(option.method === "GET" && options.param){
        var arrParam = [];//存放转换之后的格式
        //对象  citykey=101210101
        Object.keys(options.param).forEach(function (key) {
            arrParam.push(key+"="+options.param[key]);
        });
        console.log(arrParam);
        if(url.search(/\?/) === -1){
            url += "?" + arrParam.join("&");
        }else {
            url += "&" + arrParam.join("&");
        }
    }
    fetch(url,option).then(function (res) {
        console.log(res);
        return res.text();
    }).then(function (data) {
        // console.log("读取本地文件:"+data);//这样做合适吗？
        callback(data);
    }).catch(function (error) {
        console.log(error);
    })
}