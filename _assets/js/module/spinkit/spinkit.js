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

    function dirname(path) {
        return path.split("/").slice(0, -1).join("/") + "/";
    }
    
    var scriptRoot = (function () {
        var scripts = document.getElementsByTagName("script");
        for (var n = 0; n < scripts.length; n++) {
            var script = scripts[n];
            if (script.src.match(/spinkit(\.min|)\.js/)) {
                return dirname(script.src);
            }
        }
        return "";
    }());

    var spinnerArr=[];

    var html = '<div class="spinner_container">'
        + '<div class="spinner"></div>'
        + '<div class="spinner_bg"></div>'
        + '</div>';

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

    var _default = {
        spin: ""


    };


    exports.show = function (obj, configs) {
        var _container = obj ? obj : $('body');
        _container.append(html);

    }
    exports.hidden = function (obj) {
        obj.find(".spinner").remove();
    }


}));