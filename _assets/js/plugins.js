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
        },
        callback: function (url, result, key) {
            //alert(url);
        },
        complete: function () {
            moment.locale('zh-cn');

            // SpinKit.show($("#3"), {
            //     size: 200
            // });

            var aaaa1 = NotyKit.Create({
                title: {
                    text: "title数据aaa"
                }
                , obj: $("#4")
                , text: {
                    text: "哈啥说哈是的是的发撒发撒旦法撒旦法打算发"
                }
                ,
                closeItem: [{
                    container: 'noty_title'//noty_message,noty_title,noty_text,noty_foot,notykit_content,notykit_container
                    , closeWith: ['click']
                    , text: '<span class="icon-remove" style="color:#ff0000;"></span>'//当 text 不为空时候下面配置生效
                    , layout: 'topright'
                    , addClass: 'close'
                }]
                ,
                callback: {
                    onClose: function (obj) {
                        //alert(obj.id);
                    }
                }
            });

            common.fn.getInputMoney(32423423.9870,2);


            // var thisNoty = NotyKit.Create({
            //     title: {
            //         text: "safsafsdfsd"
            //     }
            //     , obj: $("#4")
            //     , callback: {
            //         onClose: function (obj) {
            //             //alert(obj.id + "aaaaaaaaaaa");
            //         }
            //     }
            // });

            // setTimeout(function () {
            //     aaaa1.hidden();
            //     setTimeout(function () {
            //         aaaa1.show();
            //     },1000);
            //     // aaaa1.close(function () {
            //     //     alert("对象关闭");
            //     // });
            // },3000);

            aaaa1.AutoSize();
            // aaaa1.SetText("哈啥说哈是的是的发撒发撒旦法撒旦法打算发哈啥说<br/><br/>哈是的是的发撒发撒旦法撒旦法打算发哈啥说<br/><br/>哈是的是的发撒发撒旦法撒旦法打算发哈啥说<br/>哈是的<br/>是的发撒发撒旦法撒旦法打算发");
            //
            // aaaa1.SetClose([{
            //     container: '.notykit_container'//noty_border,noty_title,noty_text,noty_foot,notykit_content,notykit_container,或自定义容器
            //     , closeWith: ['click']
            //     , text: '<span class="icon-remove" style="color:#761c19;font-size: 20px;"></span>'//当 text 不为空时候下面配置生效
            //     , layout: 'centerright'
            //     , addClass: ''
            // }]);
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
