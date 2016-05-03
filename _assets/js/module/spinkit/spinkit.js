/**
 * Created by zhangzongshan on 16/4/29.
 */
"use strict";
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
        }, window['SpinKit'] = {}, {});
    }
}(function (require, exports, module) {
    var SpinKit = typeof exports !== 'undefined' ? exports : {};

    exports.version = "1.0.0";

    var scriptRoot = (function () {
        var scriptName = "spinkit";
        var scripts = document.getElementsByTagName("script");
        for (var n = 0; n < scripts.length; n++) {
            var script = scripts[n];
            if (script.src.match(eval("/" + scriptName + "(\.min|)\.js/"))) {
                return (script.src).split("/").slice(0, -1).join("/") + "/";
            }
        }
        return "";
    }());


    function include(file) {
        var files = typeof file == "string" ? [file] : file;
        for (var i = 0; i < files.length; i++) {
            var name = files[i].replace(/^\s|\s$/g, "");
            var att = name.split('.');
            var ext = att[att.length - 1].toLowerCase();
            var isCSS = ext == "css";
            var tag = isCSS ? "link" : "script";
            var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
            var link = (isCSS ? "href" : "src") + "='" + scriptRoot + name + "'";
            if ($(tag + "[" + link + "]").length == 0) document.write("<" + tag + attr + link + "></" + tag + ">");
        }
    }

    function getArrJsonItem(obj, key, value) {
        var k = (typeof (key) == "string" && key != "") ? key : null;
        var v = (typeof (value) != "undefined") ? value : null;
        if (typeof (obj) == "object" && obj != null && k != null) {
            for (var item in obj) {
                if (v != null) {
                    if (obj[item][k] === v) {
                        return obj[item];
                        break;
                    }
                }
                else {
                    if (obj[item].hasOwnProperty(k)) {
                        return obj[item];
                        break;
                    }
                }
            }
        }
        return null;
    }

    function getmaxZindex(max) {
        max = max > 0 ? max + 1 : 0;
        var maxZ = Math.max.apply(null, $.map($('body > *'), function (e, n) {
            if ($(e).css('position') == 'absolute' || $(e).css('position') == 'fixed')
                return parseInt($(e).css('z-index')) || 1;
        }));
        maxZ = maxZ == -Infinity ? 1 : maxZ;
        maxZ = maxZ < max ? maxZ : max;
        return maxZ;
    }

    var spinnerArr = [];

    var html = '<div class="spinner_container">'
        + '<div class="spinner"></div>'
        + '<div class="spinner_bg"></div>'
        + '</div>';


    var _default = {
        spin: "circle"
        , width: 40
        , height: 40
        , position: {
            "w":""
        }
        , background: "rgba(0,0,0,0.4)"


    };


    function resize(obj) {
        obj.find(".spinner_container").css({
            "width": obj.is($('body')) ? $(window).width() : obj.outerWidth() + "px"
            , "height": obj.is($('body')) ? $(window).height() : obj.outerHeight() + "px"
            , "top": obj.offset().top + "px"
            , "left": obj.offset().left + "px"
        });

        obj.find(".spinner_container .spinner_bg").css({
            "width": "100%"
            , "height": "100%"
        });
    }

    function creatSpin(obj, configs) {

        var _container = obj ? obj : $('body');
        _container.remove(".spinner_container");

        configs = (typeof (value) != "undefined") ? configs : _default;

        var _spinObj = configs.spin === "circle" ? getArrJsonItem(spinObj, "circle")
            : configs.spin === "fading-circle" ? getArrJsonItem(spinObj, "fading-circle")
            : getArrJsonItem(spinObj, _default.spin);

        var _background = configs.background.indexOf("rgba(") != -1 ? configs.background : _default.background;

        _container.append(html);

        _container.find(".spinner_container").css({
            "position": "absolute"
            , "z-index": getmaxZindex() + 10
        });
        _container.find(".spinner_container .spinner_bg").css({
            "background": _background
            , "height": "100%"
        });

        resize(_container);

        $(window).on("resize",function () {
            $.each($.find(".spinner_container"),function () {
                resize($(this).parent());
            });
        });

    }


    exports.show = function (obj, configs) {
        creatSpin(obj, configs);


    }
    exports.hidden = function (obj) {
        obj.find(".spinner").remove();
    }

    var spinObj = [
        {
            "circle": {
                "html": ''
                + '<div class="sk-circle">'
                + '  <div class="sk-circle1 sk-child"></div>'
                + '  <div class="sk-circle2 sk-child"></div>'
                + '  <div class="sk-circle3 sk-child"></div>'
                + '  <div class="sk-circle4 sk-child"></div>'
                + '  <div class="sk-circle5 sk-child"></div>'
                + '  <div class="sk-circle6 sk-child"></div>'
                + '  <div class="sk-circle7 sk-child"></div>'
                + '  <div class="sk-circle8 sk-child"></div>'
                + '  <div class="sk-circle9 sk-child"></div>'
                + '  <div class="sk-circle10 sk-child"></div>'
                + '  <div class="sk-circle11 sk-child"></div>'
                + '  <div class="sk-circle12 sk-child"></div>'
                + '</div>'
                , "css": "circle.css"
            }
        },
        {
            "fading-circle": {
                "html": ''
                + '<div class="sk-fading-circle">'
                + '  <div class="sk-circle1 sk-circle"></div>'
                + '  <div class="sk-circle2 sk-circle"></div>'
                + '  <div class="sk-circle3 sk-circle"></div>'
                + '  <div class="sk-circle4 sk-circle"></div>'
                + '  <div class="sk-circle5 sk-circle"></div>'
                + '  <div class="sk-circle6 sk-circle"></div>'
                + '  <div class="sk-circle7 sk-circle"></div>'
                + '  <div class="sk-circle8 sk-circle"></div>'
                + '  <div class="sk-circle9 sk-circle"></div>'
                + '  <div class="sk-circle10 sk-circle"></div>'
                + '  <div class="sk-circle11 sk-circle"></div>'
                + '  <div class="sk-circle12 sk-circle"></div>'
                + '</div>'
                , "css": "fading-circle.css"
            }
        },
    ];


}));