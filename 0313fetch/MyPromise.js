
function MyPromise(fn) {
    var callbacks = [];
     this.then = function (success) {
         callbacks.push(success);
     }
     function resolve(value) {
         callbacks.forEach(function (callback) {
             callback(value);
         })
     }
    fn(resolve);
}