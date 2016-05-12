﻿/**
 * Created by xuesong on 16/1/25.
 * 文件必须依赖lodash或underscore工具库
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
        }, window['common'] = {}, {});
    }
}(function (require, exports, module) {
    var common = typeof exports !== 'undefined' ? exports : {};

    //字符串处理
    exports.string = {
        /**
         * 字符编码数值对应的存储长度：
         * UCS-2编码(16进制) UTF-8 字节流(二进制)
         * 0000 - 007F       0xxxxxxx （1字节）
         * 0080 - 07FF       110xxxxx 10xxxxxx （2字节）
         * 0800 - FFFF       1110xxxx 10xxxxxx 10xxxxxx （3字节）
         * @str 字符串
         */
        getBytesLength: function (str) {
            var totalLength = 0;
            var charCode;
            for (var i = 0; i < str.length; i++) {
                charCode = str.charCodeAt(i);
                if (charCode < 0x007f) {
                    totalLength++;
                } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                    totalLength += 2;
                } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                    totalLength += 3;
                } else {
                    totalLength += 4;
                }
            }
            return totalLength;
        },

        /**
         *去除前后空格
         * @str 字符串
         */
        trim: function (str, is_global) {
            if (str != null && str != "") {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            }
            return str;
        },
        /**
         *去除前空格
         * @str 字符串
         */
        ltrim: function (str) {
            if (str != null && str != "") {
                return str.replace(/(^\s*)/g, "");
            }
            return str;
        },
        /**
         *去除后空格
         * @str 字符串
         */
        rtrim: function (str) {
            if (str != null && str != "") {
                return str.replace(/(\s*$)/g, "");
            }
            return str;
        },
        /**
         *去除所有空格
         * @str 字符串
         */
        alltrim: function (str) {
            if (str != null && str != "") {
                return str.replace(/\s/g, "");
            }
            return str;
        },

        /**
         *截取字符串
         * @str 字符串
         * @l长度
         * @hasDot省略符号
         */
        subString: function (str, l, hasDot) {
            if (!_.isEmpty(str)) {
                var newLength = 0;
                var newStr = "";
                var chineseRegex = /[^\x00-\xff]/g;
                var singleChar = "";
                var strLength = str.replace(chineseRegex, "**").length;
                for (var i = 0; i < strLength; i++) {
                    singleChar = str.charAt(i).toString();
                    if (singleChar.match(chineseRegex) != null) {
                        newLength += 2;
                    }
                    else {
                        newLength++;
                    }
                    if (newLength > l) {
                        break;
                    }
                    newStr += singleChar;
                }
                if (strLength > l) {
                    if (hasDot && hasDot != "") {
                        newStr += hasDot;
                    }
                }
                return newStr;
            }
            else {
                return str;
            }
        },

        /*
         * Obj 转化为字符串
         * @o: Obj 对象
         * @return{ string}
         * */
        obj2string: function (o) {
            var r = [];
            if (typeof o == "string") {
                return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
            }
            if (typeof o == "object") {
                if (!o.sort) {
                    for (var i in o) {
                        r.push(i + ":" + this.obj2string(o[i]));
                    }
                    if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                        r.push("toString:" + o.toString.toString());
                    }
                    r = "{" + r.join() + "}";
                } else {
                    for (var i = 0; i < o.length; i++) {
                        r.push(this.obj2string(o[i]))
                    }
                    r = "[" + r.join() + "]";
                }
                return r;
            }
            return o.toString();
        },
    }

    //格式化
    exports.formate = {
        /*
         * 格式化金额
         * @money:金额值
         * @n:金额小数位数,默认为2位,最多20位
         * @return{money}
         * */
        formateMoney: function (money, n) {
            n = n > 0 && n <= 20 ? n : 2;
            money = _.isNumber(money) ? money
                : (parseFloat(money) != NaN) ? parseFloat(money)
                : 0;
            money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = money.split(".")[0].split("").reverse(),
                r = money.split(".")[1];
            var t = "";
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        },

        /*
         * 格式化银行卡卡号
         * @bankNo:金额值
         * @return{bankAccount}
         */
        formateBankNo: function (bankNo) {
            if (bankNo == "") return;
            var bankAccount = new String(bankNo);
            bankAccount = bankAccount.substring(0, 40);
            /*帐号的总数, 包括空格在内 */
            if (bankAccount.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
                /* 对照格式 */
                if (bankAccount.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
                        ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
                    var accountNumeric = "", i;
                    var accountChar = "";
                    for (i = 0; i < bankAccount.length; i++) {
                        accountChar = bankAccount.substr(i, 1);
                        if (!isNaN(accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
                    }
                    bankAccount = "";
                    for (i = 0; i < accountNumeric.length; i++) {    /* 可将以下空格改为-,效果也不错 */
                        if (i == 4) bankAccount = bankAccount + " ";
                        if (i == 8) bankAccount = bankAccount + " ";
                        if (i == 12) bankAccount = bankAccount + " ";
                        //添加
                        if (i == 16) bankAccount = bankAccount + " ";
                        if (i == 20) bankAccount = bankAccount + " ";
                        if (i == 24) bankAccount = bankAccount + " ";
                        if (i == 28) bankAccount = bankAccount + " ";

                        bankAccount = bankAccount + accountNumeric.substr(i, 1)
                    }
                }
            }
            else {
                bankAccount = " " + bankAccount.substring(1, 5) + " " + bankAccount.substring(6, 10) + " " + bankAccount.substring(14, 18) + "-" + bankAccount.substring(18, 25);
            }
            if (bankAccount != bankNo) bankNo = bankAccount;

            return bankAccount;
        },
    }

    //通用function
    exports.fn = {
        /*
         * 获取 js 脚本文件地址
         * @scriptName:js 文件名
         * */
        getScriptRoot: function (scriptName) {
            var scripts = document.getElementsByTagName("script");
            for (var n = 0; n < scripts.length; n++) {
                var script = scripts[n];
                if (script.src.match(eval("/" + scriptName + "(\.min|)\.js/"))) {
                    return (script.src).split("/").slice(0, -1).join("/") + "/";
                }
            }
            return "";
        },
        /*
         * 动态加载JS/CSS 文件
         * @scriptRoot:根文件路径
         * @file:文件名/文件名数组
         * */
        includeJsCssFile: function (scriptRoot, file) {
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
        },
        /*
         * 获取页面做大的 z-index
         * @obj:指定对象,默认为$('body *')
         * @max:设置最大值
         * */
        getmaxZindex: function (obj,max) {
            obj = (typeof (obj) == "object" && obj.length > 0) ? obj.find("*") : $('body *');
            max = max > 0 ? max + 1 : -1;
            var maxZ = Math.max.apply(null, $.map(obj, function (e, n) {
                if ($(e).css('position') == 'absolute' || $(e).css('position') == 'fixed')
                    return parseInt($(e).css('z-index')) || 1;
            }));
            maxZ = maxZ == -Infinity ? 1 : maxZ;
            if (max != -1) {
                maxZ = maxZ < max ? maxZ : max;
            }
            return maxZ;
        },
        /*
         *获取localStorage值
         */
        getstorage: function (key) {
            var storage = window.localStorage;
            if (storage) {
                return storage.getItem(key) == "undefined" ? null : storage.getItem(key);
            }
            return null;
        },
        /**
         * 写入localStorage值
         * @returns bool
         */
        writestorage: function (key, value) {
            var storage = window.localStorage;
            if (storage) {
                storage.setItem(key, value);
                return true;
            }
            return false;
        },
        /**
         * 删除localStorage值
         * @returns bool
         */
        delstorage: function (key) {
            var storage = window.localStorage;
            if (storage) {
                storage.removeItem(key);
                return true;
            }
            return false;
        },
        /**
         * 清除localStorage值
         * @returns bool
         */
        clearstorage: function () {
            var storage = window.localStorage;
            if (storage) {
                storage.clear();
                return true;
            }
            return false;
        },

        /*
         生成数据链接
         */
        createObjectURL: function (blob) {
            return window[window.webkitURL ? 'webkitURL' : 'URL']['createObjectURL'](blob);
            this.resolveObjectURL(blob);
        },

        /*
         释放数据链接独占的内存
         */
        resolveObjectURL: function (blob) {
            window[window.webkitURL ? 'webkitURL' : 'URL']['revokeObjectURL'](blob);
        },
        /*
         * 根据key,value获取对象obj:[{key1,values},{key2,values}]的值
         * @obj:对象
         * @key:键
         * @value:值
         * @return:{index,item}
         * */
        getArrJsonItem: function (obj, key, value) {
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


    }

    //转化
    exports.transform = {
        rgb2Hex: function (rgb) {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var that = rgb;
            if (/^(rgb|RGB)/.test(that)) {
                var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
                var strHex = "#";
                for (var i = 0; i < aColor.length; i++) {
                    var hex = Number(aColor[i]).toString(16);
                    if (hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = that;
                }
                return strHex;
            } else if (reg.test(that)) {
                var aNum = that.replace(/#/, "").split("");
                if (aNum.length === 6) {
                    return that;
                } else if (aNum.length === 3) {
                    var numHex = "#";
                    for (var i = 0; i < aNum.length; i += 1) {
                        numHex += (aNum[i] + aNum[i]);
                    }
                    return numHex;
                }
            } else {
                return that;
            }
        },
        hex2Rgb: function (hex) {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var sColor = hex.toLowerCase();
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = "#";
                    for (var i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                var sColorChange = [];
                for (var i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return "RGB(" + sColorChange.join(",") + ")";
            } else {
                return sColor;
            }
        },
    }

    //is判断
    exports.is = {
        /*
         * 判断是否为有效的金额
         * @money:金额值
         * @n:金额小数位数,默认为2位,最多20位
         * @l:金额最大的长度,默认为20位
         * @return{bool}
         * */
        isMoney: function (money, n, l) {
            n = n > 0 && n <= 20 ? n : 2;
            l = l > 0 && l <= 20 ? l : 9;
            var exp = eval("/^([1-9][\d]{0," + l + "}|0)(\.[\d]{1," + n + "})?$/");
            if (exp.test(money)) {
                return true;
            }
            else {
                return false;
            }
        },
    }

}));