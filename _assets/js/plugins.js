// Avoid `console` errors in browsers that lack a console.
//解决的console调试的时候报错
(function () {
    var method;
    var noop = function () {
    };
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
            'jquery': '_assets/js/public/jquery/jquery-1.12.3.min.js'//jquery
            , 'lodash': '_assets/js/public/underscore/underscore.js'//基础库
            , 'html5media': '_assets/js/public/html5media/html5media-1.1.8.min.js'//多媒体
            , 'moment': '_assets/js/public/moment/moment-local-2.1.3.min.js'//日期
            , 'validator': '_assets/js/public/validator/validator-5.2.0.min.js'//验证
            , 'common': '_assets/js/module/common/common.js'//加载动画
            , 'spink': '_assets/js/module/spinkit/spinkit.js'//加载动画
            , 'noty': '_assets/js/module/notykit/notykit.js'//对话框
            , 'tabskit': '_assets/js/module/tabskit/tabskit.js'//对话框
        },
        callback: function (url, result, key) {
            //alert(url);
        },
        complete: function () {
            moment.locale('zh-cn');

            var tabskitobj=TabsKit.Create({
                obj:$("#2")
                ,id:'asdsdfs001'
                ,tabs:[
                    {
                        id:'011'
                        ,html:'测试一'
                        ,normal:'tabsClass'
                        ,active:'activeTabs'
                        ,fn:function () {
                            //alert('01');
                        }
                        ,content:'sadfsdafsd00111'
                    },{
                        id:'012'
                        ,html:'测试二'
                        ,normal:'tabsClass'
                        ,active:'activeTabs'
                        ,fn:function () {
                            //alert('02');
                        }
                        ,content:'sadfsdafsd00222'
                    },{
                        id:'013'
                        ,html:'测试三'
                        ,normal:'tabsClass'
                        ,active:'activeTabs'
                        ,fn:function () {
                            //alert('03');
                        }
                        ,content:'sadfsdafsd00333'
                    }
                ]
                ,showtabs:'012'
                ,direct:''
                ,autowidth:true
                ,container:$("#3")
                ,storge:true
            });

            var aa='';

        }
    }]);
}());
