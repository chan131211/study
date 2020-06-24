
export const Debounce = (fun, delay) => {
    var timer;
    return function () {
        var _this = this
        var args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(function () {
            fun.apply(_this, args) // 绑定到调用debounce的对象上 相当于_this.fun(args)
        }, delay)
    }
}