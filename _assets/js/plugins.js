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
            'jquery': 'https://cdn.jsdelivr.net/jquery/1.12.3/jquery.min.js'//jquery
            , 'lodash': 'https://cdn.jsdelivr.net/lodash/4.11.2/lodash.min.js'//基础库
            , 'html5media': '_assets/js/public/html5media/html5media-1.1.8.min.js'//多媒体
            , 'moment': 'https://cdn.jsdelivr.net/g/momentjs@2.13.0(moment.min.js+locales.min.js)'//日期
            , 'validator': 'https://cdn.jsdelivr.net/validator/5.2.0/validator.min.js'//验证
            , 'common': '_assets/js/module/common/common.js'//加载动画
            , 'spink': '_assets/js/module/spinkit/spinkit.js'//加载动画
            , 'noty': '_assets/js/module/notykit/notykit.js'//对话框
        },
        callback: function (url, result, key) {
            //alert(url);
        },
        complete: function () {
            //moment.locale('zh-cn');

            // SpinKit.show($("#3"), {
            //     size: 200
            // });
            //
            // NotyKit.show({
            //     title:"数据测试"
            //
            // });

            $("input").on("input propertychange",function () {
                var value = $(this).val();
                if (value != "") {
                    $(this).val("asfsad");
                }
            });

            $("#aaaa").html(moment().add(7, 'y').format('LLLL'));
            // noty({
            //     layout: 'center',
            //     type: 'information',
            //     theme: 'relax', // or 'relax'
            //     template: '<div class="noty_close"></div><div style="width: 600px;height: 400px;"><span>关闭窗口</span><span class="noty_text"></span></div>',
            //     text: '<div class="aaa" style="width: 500px;height:200px;">sadasdfasd</div><div>sadasdfasd</div><div>sadasdfasd</div>',
            //     callback: {
            //         onShow: function() {
            //
            //         },
            //         afterShow: function() {},
            //         onClose: function() {},
            //         afterClose: function() {},
            //         onCloseClick: function() {},
            //     },
            //     //buttons: false // an array of buttons
            //     buttons: [
            //         {
            //             addClass: '', text: '<div>X</div>', onClick: function ($noty) {
            //
            //             // this = button element
            //             // $noty = $noty element
            //
            //             $noty.close();
            //             //noty({text: 'You clicked "Ok" button', type: 'success'});
            //         }
            //         },
            //         {
            //             addClass: '', text: '取消', onClick: function ($noty) {
            //             $noty.close();
            //             //noty({text: 'You clicked "Cancel" button', type: 'error'});
            //         }
            //         }
            //     ]
            // });

            // setTimeout(function () {
            //     SpinKit.hidden($("#2"));
            // },2000);

        }
    }]);
}());
