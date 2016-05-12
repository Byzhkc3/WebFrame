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

    function getArrJsonItem(obj, key, value) {
        var k = (typeof (key) == "string" && key != "") ? key : null;
        var v = (typeof (value) != "undefined") ? value : null;
        if (typeof (obj) == "object" && obj != null && k != null) {
            for (var item in obj) {
                if (v != null) {
                    if (obj[item][k] === v || obj[item][k].is(v)) {
                        return {index: item, item: obj[item]};
                        break;
                    }
                }
                else {
                    if (obj[item].hasOwnProperty(k)) {
                        return {index: item, item: obj[item]};
                        break;
                    }
                }
            }
        }
        return {index: -1, item: null};
    }

    function getObjPosition(obj, position, width, height) {

        var _top = (typeof (position) == "string" && (position).toLowerCase() == "top") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "center") ? (obj.outerHeight() - height) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "bottom") ? obj.outerHeight() - height
            : (typeof (position) == "string" && (position).toLowerCase() == "topleft") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "centerleft") ? (obj.outerHeight() - height) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "bottomleft") ? obj.outerHeight() - height
            : (typeof (position) == "string" && (position).toLowerCase() == "topright") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "centerright") ? (obj.outerHeight() - height) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "bottomright") ? obj.outerHeight() - height
            : (typeof (position) == "object" && position != null) ? (position.top > 0 ? position.top : 0)
            : (obj.outerHeight() - height) / 2;

        var _left = (typeof (position) == "string" && (position).toLowerCase() == "top") ? (obj.outerWidth() - width) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "center") ? (obj.outerWidth() - width) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "bottom") ? (obj.outerWidth() - width) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "topleft") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "centerleft") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "bottomleft") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "topright") ? obj.outerWidth() - width
            : (typeof (position) == "string" && (position).toLowerCase() == "centerright") ? obj.outerWidth() - width
            : (typeof (position) == "string" && (position).toLowerCase() == "bottomright") ? obj.outerWidth() - width
            : (typeof (position) == "object" && position != null) ? (position.left > 0 ? position.left : 0)
            : (obj.outerWidth() - width) / 2;

        return {
            top: _top
            , left: _left
        };
    }


    function getJqueryEventString(arrayObj) {
        var s = "";
        $.each(arrayObj, function (index, item) {
            var thisItem = (item.toLowerCase() === 'click') ? 'click'
                : (item.toLowerCase() === 'hover') ? 'hover'
                : (item.toLowerCase() === 'dblclick') ? 'dblclick'
                : (item.toLowerCase() === 'mousedown') ? 'mousedown'
                : (item.toLowerCase() === 'mousemove') ? 'mousemove'
                : (item.toLowerCase() === 'mouseout') ? 'mouseout'
                : (item.toLowerCase() === 'mouseover') ? 'mouseover'
                : (item.toLowerCase() === 'mouseup') ? 'mouseup'
                : (item.toLowerCase() === 'change') ? 'change'
                : (item.toLowerCase() === 'input') ? 'input propertychange'
                : (item.toLowerCase() === 'keydown') ? 'keydown'
                : (item.toLowerCase() === 'keypress') ? 'keypress'
                : (item.toLowerCase() === 'reset') ? 'reset'
                : (item.toLowerCase() === 'resize') ? 'resize'
                : (item.toLowerCase() === 'select') ? 'select'
                : (item.toLowerCase() === 'submit') ? 'submit'
                : (item.toLowerCase() === 'unload') ? 'unload'
                : "";
            if (index < arrayObj.length - 1 && thisItem != "") {
                thisItem += " ";
            }

            s += thisItem;
        });
        return s;
    }

    var notykitDate = [];

    var template = '<div class="noty_message"><div class="noty_title"></div><div class="noty_text"></div><div class="noty_foot"></div></div>';

    var NotyKitObj = {
        options: {
            id: ""
            , obj: $('body')
            , width: 600
            , height: 400
            , background: "rgba(0,0,0,.1)"
            , shade: true
            , layout: 'center'
            , template: template
            , title: ''
            , text: 'sdafsafsdafds'
            , closeItem: [{
                container: 'noty_title'//noty_message,noty_title,noty_text,noty_foot,notykit_content,notykit_container
                , closeWith: ['click']
                , text: '关闭'//当 text 不为空时候下面配置生效
                , layout: 'centerright'
                , addClass: 'close'
            }]
            , callback: {
                onShow: function (notykit) {

                }
                , afterShow: function (notykit) {

                }
                , onClose: function (notykit) {

                }
                , afterClose: function (notykit) {

                }
            }
            , buttons: [{
                container:''//noty_message,noty_title,noty_text,noty_foot,notykit_content,notykit_container
                ,addClass:''
                ,closeWith:['click']
                ,text:''
                ,callback:{
                    onButton:function (notykit) {
                        
                    }
                    ,afterButton:function (notykit) {
                        
                    }
                }
            }]

            , theme: 'defaultTheme'
            , type: 'alert'
            , dismissQueue: true
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
        },
        init: function (options) {
            options = (typeof (options) == "object" && options != null) ? options : this.options;
            var _id = "notykit_" + (new Date().getTime() * Math.floor(Math.random() * 1000000));
            var _container = options.obj ? options.obj : $('body');
            var _width = options.width > 0 ? options.width : this.options.width;
            var _height = options.height > 0 ? options.height : this.options.height;
            var _background = (typeof (options.background) != "undefined" && options.background.indexOf("rgba(") != -1) ? options.background : this.options.background;
            var _shade = (typeof (options.shade) != "undefined" && !options.shade) ? false : this.options.shade;
            var _layout = (typeof (options.layout) != "undefined" && options.layout !== "") ? options.layout : this.options.layout;
            var _template = (typeof (options.template) != "undefined" && options.template !== "") ? options.template : this.options.template;
            var _title = (typeof (options.title) != "undefined" && options.title !== "") ? options.title : this.options.title;
            var _text = (typeof (options.text) != "undefined" && options.text !== "") ? options.text : this.options.text;
            var _closeItem = (typeof (options.closeItem) != "undefined" && options.closeItem === "object") ? options.closeItem : this.options.closeItem;
            var _callback = (typeof (options.callback) != "undefined" && options.callback === "object") ? options.callback : this.options.callback;


            this.options.id = _id;
            this.options.obj = _container;
            this.options.width = _width;
            this.options.height = _height;
            this.options.background = (!_shade) ? 'transparent' : _background;
            this.options.shade = _shade;
            this.options.layout = _layout;
            this.options.template = _template;
            this.options.title = _title;
            this.options.text = _text;
            this.options.closeItem = _closeItem;
            this.options.callback = _callback;


            // var store = {};
            // store[this.options.id] = this.options;
            notykitDate.push({
                id: this.options.id
                , notykit: this.options
            });

            this.build();
        },
        build: function () {

            var callbackObj = (typeof this.options.callback === "object" && this.options.callback != null) ? this.options.callback : null;
            var onShowFn = (typeof callbackObj.onShow === "function") ? callbackObj.onShow : function () {
            };
            var afterShowFn = (typeof callbackObj.afterShow === "function") ? callbackObj.afterShow : function () {
            };


            if (typeof onShowFn === "function") {
                onShowFn(this.options);
            }

            var _html = $("<div class='notykit_container'><div class='notykit_content'></div></div>");
            this.options.obj.append(_html.attr("id", this.options.id));
            this.options.obj.find("#" + this.options.id + " .notykit_content").html(this.options.template);
            this.options.obj.find("#" + this.options.id + " .noty_title").html(this.options.title);
            this.options.obj.find("#" + this.options.id + " .noty_text").html(this.options.text);

            this.options.obj.find("#" + this.options.id).css({
                "position": "absolute"
                , "z-index": getmaxZindex() + 1
                , "background-color": this.options.background
            });

            //noty_message,noty_title,noty_text,noty_foot,notykit_content,notykit_container
            this.options.obj.find("#" + this.options.id + " .notykit_content").css({
                "position": "relative"
            });
            this.options.obj.find("#" + this.options.id + " .noty_message").css({
                "position": "relative"
            });
            this.options.obj.find("#" + this.options.id + " .noty_message > *").css({
                "position": "relative"
            });

            this.options.obj.find("#" + this.options.id + " .notykit_content").css({
                "width": this.options.width + "px"
                , "height": this.options.height + "px"
                , "overflow": "hidden"
            });

            this.resize_noty(this.options);
            //添加关闭
            this.addCloseEvent(this.options, this.options.closeItem);

            $(window).on("resize", function () {
                $.each(notykitDate, function (index, item) {
                    NotyKitObj.resize_noty(item.notykit);
                });
            });

            if (typeof afterShowFn === "function") {
                afterShowFn(this.options);
            }
        },
        addCloseEvent: function (notykit, closeItem) {
            var obj = notykit.obj.find("#" + this.options.id);
            if (obj.length > 0) {
                $.each(closeItem, function (index, item) {
                    var container = (typeof (item.container) != "undefined" && item.container !== "") ? item.container : "";
                    container = container.toLowerCase() === "noty_message" ? "noty_message"
                        : container.toLowerCase() === "noty_title" ? "noty_title"
                        : container.toLowerCase() === "noty_text" ? "noty_text"
                        : container.toLowerCase() === "noty_foot" ? "noty_foot"
                        : container.toLowerCase() === "notykit_content" ? "notykit_content"
                        : "notykit_container";

                    var layout = (typeof (item.layout) != "undefined" && item.layout !== "") ? item.layout : "centerleft";
                    var addClass = (typeof (item.addClass) != "undefined" && item.addClass !== "") ? item.addClass : "";
                    var text = (typeof (item.text) != "undefined" && item.text !== "") ? item.text : "";
                    var closeWith = (typeof (item.closeWith) != "undefined" && item.closeWith !== "") ?
                        ((getJqueryEventString(item.closeWith) !== '') ? getJqueryEventString(item.closeWith) : ""
                        ) : "";
                    if (container != "" && closeWith != "") {
                        var thisObj = obj.find("." + container);
                        if (container === "notykit_container")
                            thisObj = obj;

                        if (text != "") {
                            var closeTextObj = $("<div>" + text + "</div>");
                            if (addClass != "") {
                                closeTextObj.addClass(addClass);
                            }
                            closeTextObj.css({
                                "position": "absolute"
                            });

                            thisObj.append(closeTextObj);

                            NotyKitObj.resize_close(thisObj, layout, closeTextObj);

                            $(window).on("resize", function () {
                                NotyKitObj.resize_close(thisObj, layout, closeTextObj);
                            });

                            closeTextObj.off(closeWith);
                            closeTextObj.on(closeWith, function () {
                                NotyKitObj.close(notykit);
                            });
                        }
                        else {
                            thisObj.off(closeWith);
                            thisObj.on(closeWith, function () {
                                NotyKitObj.close(notykit);
                            });
                        }

                    }
                });
            }
        },
        resize_close: function (appendObj, layout, closeObj) {
            var thisPosition = getObjPosition(appendObj, layout, closeObj.outerWidth(), closeObj.outerHeight());
            var _top = thisPosition.top;
            var _left = thisPosition.left;

            _top = (_top < 0 && (_top + appendObj.offset().top) < 0) ? -appendObj.offset().top : _top;
            _left = (_left < 0 && (_left + appendObj.offset().left) < 0) ? -appendObj.offset().left : _left;
            closeObj.css({
                "top": _top + "px"
                , "left": _left + "px"
            });
        },
        resize_noty: function (options) {
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
                    var thisPosition = getObjPosition(obj, options.layout, options.width, options.height);
                    _top = thisPosition.top;
                    _left = thisPosition.left;

                    _top = (_top < 0 && (_top + obj.offset().top) < 0) ? -obj.offset().top : _top;
                    _left = (_left < 0 && (_left + obj.offset().left) < 0) ? -obj.offset().left : _left;
                }
                else {
                    var thisPosition = getObjPosition(obj.find("#" + _id), options.layout, options.width, options.height);
                    _top = thisPosition.top;
                    _left = thisPosition.left;

                    _top = _top < 0 ? 0 : _top;
                    _left = _left < 0 ? 0 : _left;
                }

                obj.find("#" + _id + " .notykit_content").css({
                    "top": _top + "px"
                    , "left": _left + "px"
                });
            }
        },
        close: function (notykit) {
            var id = notykit.id;
            var obj = notykit.obj;
            var callbackObj = (typeof notykit.callback === "object" && notykit.callback != null) ? notykit.callback : null;
            var onCloseFn = (typeof callbackObj.onClose === "function") ? callbackObj.onClose : function () {

            };

            var afterCloseFn = (typeof callbackObj.afterClose === "function") ? callbackObj.afterClose : function () {

            };

            if (typeof onCloseFn === "function") {
                onCloseFn(notykit);
            }

            if (obj.length > 0) {
                var hasNotykitObj = getArrJsonItem(notykitDate, "id", id);
                var hasNotykitIndex = hasNotykitObj.index;
                if (hasNotykitIndex != -1) {
                    notykitDate.splice(hasNotykitIndex);
                    obj.find("#" + id).remove();
                    if (typeof afterCloseFn === "function") {
                        afterCloseFn(notykit);
                    }
                }
            }
        },

    }

    exports.show = function (options) {
        Object.create(NotyKitObj).init(options);
    };

    exports.close=function (notykit) {
        Object.create(NotyKitObj).close(notykit);
    };

    exports.closeAll=function () {
        //Object.create(NotyKitObj).close(notykit);
    };

}));