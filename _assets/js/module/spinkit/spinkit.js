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
            if ($(tag + "[" + link + "]").length == 0) {
                $("head").append("<" + tag + attr + link + "></" + tag + ">");
            }
        }
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

    var _html = '<div class="spinner_container">'
        + '    <div class="spinner"></div>'
        + '</div>';


    var _default = {
        spin: "bounce"
        , width: 40
        , height: 40
        , position: "center"
        , background: "rgba(0,0,0,.1)"
        , color: "#ff0000"
    };


    function resize(obj) {
        var thisSpinnerObj = getArrJsonItem(spinnerArr, "obj", obj).item;
        var _id = thisSpinnerObj.id;
        if (thisSpinnerObj != null) {
            thisSpinnerObj = thisSpinnerObj.configs;

            obj.find("#" + _id).css({
                "width": obj.is($('body')) ? ($(window).width() > obj.outerWidth() ? $(window).width() : obj.outerWidth()) : obj.outerWidth() + "px"
                ,
                "height": obj.is($('body')) ? ($(window).height() > obj.outerHeight() ? $(window).height() : obj.outerHeight()) : obj.outerHeight() + "px"
                ,
                "top": obj.offset().top + "px"
                ,
                "left": obj.offset().left + "px"
            });

            var _top = (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "top") ? 0
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "center") ? (obj.find("#" + _id).height() - thisSpinnerObj.height) / 2
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "bottom") ? (obj.find("#" + _id).height() - thisSpinnerObj.height)
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "topleft") ? 0
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "centerleft") ? (obj.find("#" + _id).height() - thisSpinnerObj.height) / 2
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "bottomleft") ? (obj.find("#" + _id).height() - thisSpinnerObj.height)
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "topright") ? 0
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "centerright") ? (obj.find("#" + _id).height() - thisSpinnerObj.height) / 2
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "bottomright") ? (obj.find("#" + _id).height() - thisSpinnerObj.height)
                : (typeof (thisSpinnerObj.position) == "object" && thisSpinnerObj.position != null) ? (thisSpinnerObj.position.top > 0 ? thisSpinnerObj.position.top : 0)
                : (obj.find("#" + _id).height() - thisSpinnerObj.height) / 2;

            var _left = (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "top") ? (obj.find("#" + _id).width() - thisSpinnerObj.width) / 2
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "center") ? (obj.find("#" + _id).width() - thisSpinnerObj.width) / 2
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "bottom") ? (obj.find("#" + _id).width() - thisSpinnerObj.width) / 2
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "topleft") ? 0
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "centerleft") ? 0
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "bottomleft") ? 0
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "topright") ? (obj.find("#" + _id).width() - thisSpinnerObj.width)
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "centerright") ? (obj.find("#" + _id).width() - thisSpinnerObj.width)
                : (typeof (thisSpinnerObj.position) == "string" && (thisSpinnerObj.position).toLowerCase() == "bottomright") ? (obj.find("#" + _id).width() - thisSpinnerObj.width)
                : (typeof (thisSpinnerObj.position) == "object" && thisSpinnerObj.position != null) ? (thisSpinnerObj.position.left > 0 ? thisSpinnerObj.position.left : 0)
                : (obj.find("#" + _id).width() - thisSpinnerObj.width) / 2;

            obj.find("#" + _id + " .spinner").css({
                "top": _top + "px"
                , "left": _left + "px"
            });
        }

    }

    function creatSpin(obj, configs) {

        var _container = obj ? obj : $('body');

        var hasSpinnerObj = getArrJsonItem(spinnerArr, "obj", _container);
        var hasSpinnerIndex = hasSpinnerObj.index;

        if (hasSpinnerIndex != -1) {
            var hasSpinnerObjID = hasSpinnerObj.item.id;
            _container.remove("#" + hasSpinnerObjID);
            spinnerArr.splice(hasSpinnerIndex);
        }

        configs = (typeof (configs) == "object" && configs != null) ? configs : _default;

        var _id = "spinner" + Math.floor(Math.random() * 100000 + 1);
        var _spin = (typeof (configs.spin) != "undefined" && configs.spin != "") ? configs.spin : _default.spin;
        var _width = configs.width > 0 ? configs.width : _default.width;
        var _height = configs.height > 0 ? configs.height : _default.height;
        var _position = (typeof (configs.position) != "undefined" && configs.position != "") ? configs.position : _default.position;
        var _background = (typeof (configs.background) != "undefined" && configs.background.indexOf("rgba(") != -1) ? configs.background : _default.background;
        var _color = (typeof (configs.color) != "undefined" && configs.color.indexOf("#") != -1) ? configs.color : _default.color;

        spinnerArr.push({
            "obj": _container
            , "id": _id
            , "configs": {
                spin: _spin
                , width: _width
                , height: _height
                , position: _position
                , background: _background
            }
        });

        var _spinObj = configs.spin === "circle" ? getArrJsonItem(spinObj, "circle").item
            : configs.spin === "fading-circle" ? getArrJsonItem(spinObj, "fading-circle").item
            : configs.spin === "square" ? getArrJsonItem(spinObj, "square").item
            : configs.spin === "bounce" ? getArrJsonItem(spinObj, "bounce").item
            : configs.spin === "double-bounce" ? getArrJsonItem(spinObj, "double-bounce").item
            : configs.spin === "cube" ? getArrJsonItem(spinObj, "cube").item

            : getArrJsonItem(spinObj, _default.spin).item;

        _container.append($(_html).attr("id", _id));

        _container.find("#" + _id).css({
            "position": "absolute"
            , "z-index": getmaxZindex() + 10
            , "display": "inline-block"
            , "background": _background
        });

        _container.find("#" + _id + " .spinner").css({
            "width": _width + "px"
            , "height": _height + "px"
            , "position": "relative"
            , "display": "inline-block"
            , "overflow": "hidden"
        });

        var thisSpinObj = getArrJsonItem(_spinObj, "html").item;

        var _cssFile = thisSpinObj.css;
        if (_cssFile != "") {
            include("css/" + _cssFile);
        }

        var _spinnerHtml = thisSpinObj.html;
        _spinnerHtml = _spinnerHtml.replace(/{SpinnerObjIDValue}/g, _id);
        _spinnerHtml = _spinnerHtml.replace(/{SpinnerObjColorValue}/g, 'background-color: ' + _color + ';');
        _container.find("#" + _id + " .spinner").html(_spinnerHtml);

        _container.find("#" + _id + " .spinner").css({
            "width": _width + "px"
            , "height": _height + "px"
            , "position": "relative"
            , "display": "inline-block"
            , "overflow": "hidden"
        });

        resize(_container);

        $(window).on("resize", function () {
            $.each(spinnerArr, function (index, item) {
                resize(item.obj);
            });
        });

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
                + '<style>'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-child:before {'
                + '        {SpinnerObjColorValue}'
                + '    }'
                + '</style>'
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
                + '<style>'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle:before {'
                + '        {SpinnerObjColorValue}'
                + '    }'
                + '</style>'
                , "css": "fading-circle.css"
            }
        },
        {
            "square": {
                "html": ''
                + '<style>'
                + '   #{SpinnerObjIDValue} .spinner {'
                + '        {SpinnerObjColorValue}'
                + '        margin:auto;'
                + '        -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;'
                + '        animation: sk-rotateplane 1.2s infinite ease-in-out;'
                + '    }'
                + '</style>'
                , "css": "square.css"
            }
        },
        {
            "bounce": {
                "html": ''
                + '<div class="double-bounce1"></div>'
                + '<div class="double-bounce2"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .spinner {'
                + '        margin:auto;'
                + '        {SpinnerObjColorValue}'
                + '        border-radius: 100%;'
                + '        -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;'
                + '        animation: sk-scaleout 1.0s infinite ease-in-out;'
                + '    }'
                + '</style>'
                , "css": "bounce.css"
            }
        },
        {
            "double-bounce": {
                "html": ''
                + '<div class="double-bounce1"></div>'
                + '<div class="double-bounce2"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .spinner {'
                + '        margin:auto;'
                + '    }'
                + '   #{SpinnerObjIDValue} .double-bounce1,#{SpinnerObjIDValue} .double-bounce2 {'
                + '        {SpinnerObjColorValue}'
                + '    }'
                + '</style>'
                , "css": "double-bounce.css"
            }
        },
        {
            "cube": {
                "html": ''
                + '<div class="cube1"></div>'
                + '<div class="cube2"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .spinner {'
                + '        margin:auto;'
                + '    }'
                + '   #{SpinnerObjIDValue} .cube1,#{SpinnerObjIDValue} .cube2 {'
                + '        {SpinnerObjColorValue}'
                + '    }'
                + '</style>'
                , "css": "cube.css"
            }
        },

    ];

    exports.show = function (obj, configs) {
        creatSpin(obj, configs);
    }

    exports.hidden = function (obj) {
        var hasSpinnerObj = getArrJsonItem(spinnerArr, "obj", obj);
        if (hasSpinnerObj.index != -1) {
            spinnerArr.splice(hasSpinnerObj.index);
            obj.find("#" + hasSpinnerObj.item.id).remove();
        }
    }
    exports.get = function (obj) {
        var hasSpinnerObj = getArrJsonItem(spinnerArr, "obj", obj);
        if (hasSpinnerObj.index != -1) {
            return hasSpinnerObj.item;
        }
        return null;
    }


}));