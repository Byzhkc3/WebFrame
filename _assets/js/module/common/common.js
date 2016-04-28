/**
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
            t = "";
            for (i = 0; i < l.length; i++) {
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
            bankAccount = bankAccount.substring(0, 22);
            /*帐号的总数, 包括空格在内 */
            if (bankAccount.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
                /* 对照格式 */
                if (bankAccount.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
                        ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
                    var accountNumeric = accountChar = "", i;
                    for (i = 0; i < bankAccount.length; i++) {
                        accountChar = bankAccount.substr(i, 1);
                        if (!isNaN(accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
                    }
                    bankAccount = "";
                    for (i = 0; i < accountNumeric.length; i++) {    /* 可将以下空格改为-,效果也不错 */
                        if (i == 4) bankAccount = bankAccount + " ";
                        /* 帐号第四位数后加空格 */
                        if (i == 8) bankAccount = bankAccount + " ";
                        /* 帐号第八位数后加空格 */
                        if (i == 12) bankAccount = bankAccount + " ";
                        /* 帐号第十二位后数后加空格 */
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
    exports.fn = {}
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