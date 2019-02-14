export function Plugin(Vue, options) {
    Vue.prototype.$timeBack = function (time, callback) {
        var day, hour, min, sec, left_hour, needType;
        var parseTime = function (_timeBack) {
            day = Math.floor((_timeBack / 60 / 60) / 24);
            hour = Math.floor(_timeBack / 60 / 60);
            min = Math.floor((_timeBack - hour * 60 * 60) / 60);
            sec = Math.floor(_timeBack - hour * 60 * 60 - min * 60);
            left_hour = Math.floor((_timeBack - day * 24 * 60 * 60) / 60 / 60);
            if (day > 0) {
                callback(day + ' дней ');
            }
            else {
                callback(left_hour + ':' + (String(min).length > 1 ? min : '0' + min) + ':' + (String(sec).length > 1 ? sec : '0' + sec));
            }
        };
        var interval = setInterval(function () {
            time = time - 1;
            if (time < 0)
                clearInterval(interval);
            parseTime(time);
        }, 1000);
    };
    Vue.prototype.$textLength = function (_text, _length) {
        var sliced = _text.slice(0, _length);
        if (sliced.length < _text.length) {
            return sliced += '...';
        }
        return sliced;
    };
}
//# sourceMappingURL=vue-prototype.js.map