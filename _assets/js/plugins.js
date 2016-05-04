// Avoid `console` errors in browsers that lack a console.
//解决的console调试的时候报错
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

(function () {
    Modernizr.load([{
        load: {
            'jquery':'https://cdn.jsdelivr.net/jquery/1.12.3/jquery.min.js'//jquery
            ,'lodash':'https://cdn.jsdelivr.net/lodash/4.11.2/lodash.min.js'//基础库
            ,'html5media':'_assets/js/public/html5media/html5media-1.1.8.min.js'//多媒体
            ,'moment':'https://cdn.jsdelivr.net/g/momentjs@2.13.0(moment.min.js+locales.min.js)'//日期
            ,'validator':'https://cdn.jsdelivr.net/validator/5.2.0/validator.min.js'//验证
            ,'spink':'_assets/js/module/spinkit/spinkit.js'//加载动画
        },
        callback:function (url, result, key) {
            //alert(url);
        },
        complete: function () {
            //moment.locale('zh-cn');
            $("#aaaa").html(moment().add(7,'y').format('LLLL'));

            SpinKit.show($("#bbbb"),{
                "background":"rgba(188,188,10,.1)"
                ,width:80
                ,height:80
                ,spin:"double-bounce"
            });
            SpinKit.show($("#cccc"),{
                "position":{
                    top:50
                    ,left:80
                }
                ,color:"#202D90"

            });

            // setTimeout(function () {
            //     SpinKit.hidden($("#cccc"));
            // },2000);

        }
    }]);
}());
