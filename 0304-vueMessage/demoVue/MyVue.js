//数据监听
function Observer(value) {
    if(!value || (typeof value !== "object")){
        return;
    }
    //获取data所有属性
    Object.keys(value).forEach((key) =>{
        // console.log(value[key]);
        //拦截
        defineReactive(value,key,value[key]);//?第三个参数 数据描述
    })

}

/**
 * 拦截数据
 * @param obj  源对象
 * @param key  对象key
 * @param val  对象value
 */
function defineReactive(obj,key,val) {
    Object.defineProperty(obj,key,{
        get:function () {
            return val;
        },
        set:function (newValue) {
            if(newValue === val){
                return;
            }
            val = newValue;
            // console.log(val);
            callBack(val);
        }
    });

}

function MyVue(options) {
    this._data = options.data;
    Observer(this._data);
}


