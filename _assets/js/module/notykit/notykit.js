/**
 * Created by zhangzongshan on 16/5/10.
 */
(function (factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target);
    } else if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(factory);
    } else {
        factory(function () {
        }, window['NotyKit'] = {}, {});
    }
}(function (require, exports, module) {

    var NotyKit = typeof exports !== 'undefined' ? exports : {};

    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {
            }

            F.prototype = o;
            return new F();
        };
    }

    function getmaxZindex(obj, max) {
        obj = (typeof (obj) == "object" && obj.length > 0) ? obj.find("*") : $('body *');
        max = max > 0 ? max + 1 : -1;
        var maxZ = Math.max.apply(null, $.map(obj, function (e, n) {
            if ($(e).css('layout') == 'absolute' || $(e).css('layout') == 'fixed')
                return parseInt($(e).css('z-index')) || 1;
        }));
        maxZ = maxZ == -Infinity ? 1 : maxZ;
        if (max != -1) {
            maxZ = maxZ < max ? maxZ : max;
        }
        return maxZ;
    }

    var notykitDate = [];


    var NotyKitObj = {
        options: {
            id: ""
            , obj: $('body')
            , width: 3000
            , height: 2000
            , background: "rgba(255,255,255,.5)"
            , layout: 'center'
            , theme: 'defaultTheme'
            , type: 'alert'
            , text: ''
            , dismissQueue: true
            , template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>'
            , animation: {
                open: {height: 'toggle'},
                close: {height: 'toggle'},
                easing: 'swing',
                speed: 500,
                fadeSpeed: 'fast',
            }
            , timeout: false
            , force: false
            , modal: false
            , maxVisible: 5
            , killer: false
            , closeWith: ['click']
            , callback: {
                onShow: function () {
                }
                , afterShow: function () {
                }
                , onClose: function () {
                }
                , afterClose: function () {
                }
                , onCloseClick: function () {
                }
            }
            , buttons: false
        },
        init: function (options) {
            options = (typeof (options) == "object" && options != null) ? options : this.options;
            var _id = "notykit_" + (new Date().getTime() * Math.floor(Math.random() * 1000000));
            var _container = options.obj ? options.obj : $('body');
            var _width = options.width > 0 ? options.width : this.options.width;
            var _height = options.height > 0 ? options.height : this.options.height;
            var _background = (typeof (options.background) != "undefined" && options.background.indexOf("rgba(") != -1) ? options.background : this.options.background;
            var _layout = (typeof (options.layout) != "undefined" && options.layout !== "") ? options.layout : this.options.layout;

            this.options.id = _id;
            this.options.obj = _container;
            this.options.width = _width;
            this.options.height = _height;
            this.options.background = _background;
            this.options.layout = _layout;

            this.build();
        },
        build: function () {
            var _html = $("<div class='notykit_container'><div class='notykit_content'></div></div>");
            this.options.obj.append(_html.attr("id", this.options.id));

            this.options.obj.find("#" + this.options.id).css({
                "position": "absolute"
                , "z-index": getmaxZindex() + 1
                , "display": "inline-block"
                , "background-color": this.options.background
            });

            this.options.obj.find("#" + this.options.id + " .notykit_content").css({
                "width": this.options.width + "px"
                , "height": this.options.height + "px"
                , "position": "relative"
                , "display": "inline-block"
                , "overflow": "hidden"
                , "background-color": "#000"
            });


            this.resize(this.options);

        },
        resize: function (options) {
            if (options != null) {
                var _id = options.id;
                var obj = options.obj;


                if (!obj.is($('body'))) {
                    obj.find("#" + _id).css({
                        width: obj.outerWidth() + "px"
                        , height: obj.outerHeight() + "px"
                        , top: obj.offset().top + "px"
                        , left: obj.offset().left + "px"
                    });
                }
                else {
                    var _width = obj.is($('body')) ?
                        ((($(window).width() > obj.outerWidth() ? $(window).width() : obj.outerWidth()) > options.width)
                            ? ($(window).width() > obj.outerWidth() ? $(window).width() : obj.outerWidth())
                            : (options.width))
                        : (obj.outerWidth() > options.width ? obj.outerWidth() : options.width);

                    var _height = obj.is($('body')) ?
                        ((($(window).height() > obj.outerHeight() ? $(window).height() : obj.outerHeight()) > options.height)
                            ? ($(window).height() > obj.outerHeight() ? $(window).height() : obj.outerHeight())
                            : (options.height))
                        : (obj.outerHeight() > options.height ? obj.outerHeight() : options.height);

                    obj.find("#" + _id).css({
                        width: _width + "px"
                        , height: _height + "px"
                        , top: obj.offset().top + "px"
                        , left: obj.offset().left + "px"
                    });
                }

                var _top = 0;
                var _left = 0;
                if (!obj.is($('body'))) {
                    _top = (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "top") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "center") ? (obj.outerHeight() - options.height) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottom") ? obj.outerHeight() - options.height
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "topleft") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "centerleft") ? (obj.outerHeight() - options.height) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottomleft") ? obj.outerHeight() - options.height
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "topright") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "centerright") ? (obj.outerHeight() - options.height) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottomright") ? obj.outerHeight() - options.height
                        : (typeof (options.layout) == "object" && options.layout != null) ? (options.layout.top > 0 ? options.layout.top : 0)
                        : (obj.outerHeight() - options.height) / 2;

                    _left = (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "top") ? (obj.outerWidth() - options.width) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "center") ? (obj.outerWidth() - options.width) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottom") ? (obj.outerWidth() - options.width) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "topleft") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "centerleft") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottomleft") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "topright") ? obj.outerWidth() - options.width
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "centerright") ? obj.outerWidth() - options.width
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottomright") ? obj.outerWidth() - options.width
                        : (typeof (options.layout) == "object" && options.layout != null) ? (options.layout.left > 0 ? options.layout.left : 0)
                        : (obj.outerWidth() - options.width) / 2;

                    _top = (_top < 0 && (_top + obj.offset().top) < 0) ? -obj.offset().top : _top;
                    _left = (_left < 0 && (_left + obj.offset().left) < 0) ? -obj.offset().left : _left;
                }
                else {
                    _top = (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "top") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "center") ? (obj.find("#" + _id).height() - options.height) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottom") ? (obj.find("#" + _id).height() - options.height)
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "topleft") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "centerleft") ? (obj.find("#" + _id).height() - options.height) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottomleft") ? (obj.find("#" + _id).height() - options.height)
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "topright") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "centerright") ? (obj.find("#" + _id).height() - options.height) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottomright") ? (obj.find("#" + _id).height() - options.height)
                        : (typeof (options.layout) == "object" && options.layout != null) ? (options.layout.top > 0 ? options.layout.top : 0)
                        : (obj.find("#" + _id).height() - options.height) / 2;

                    _left = (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "top") ? (obj.find("#" + _id).width() - options.width) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "center") ? (obj.find("#" + _id).width() - options.width) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottom") ? (obj.find("#" + _id).width() - options.width) / 2
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "topleft") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "centerleft") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottomleft") ? 0
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "topright") ? (obj.find("#" + _id).width() - options.width)
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "centerright") ? (obj.find("#" + _id).width() - options.width)
                        : (typeof (options.layout) == "string" && (options.layout).toLowerCase() == "bottomright") ? (obj.find("#" + _id).width() - options.width)
                        : (typeof (options.layout) == "object" && options.layout != null) ? (options.layout.left > 0 ? options.layout.left : 0)
                        : (obj.find("#" + _id).width() - options.width) / 2;

                    _top = _top < 0 ? 0 : _top;
                    _left = _left < 0 ? 0 : _left;
                }

                obj.find("#" + _id + " .notykit_content").css({
                    "top": _top + "px"
                    , "left": _left + "px"
                });
            }
        }
    }

    exports.show = function (options) {
        var notification = Object.create(NotyKitObj).init(options);
        //NotyKitObj.init(obj,options);
    };

}));