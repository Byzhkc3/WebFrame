define(function (require, exports, module) {
    var _ = require("_");
    return {
        //获取当前最大的z-index
        getmaxZindex: function (max) {
            max = max > 0 ? max : 0;
            var maxZ = Math.max.apply(null, $.map($('body > *'), function (e, n) {
                if ($(e).css('position') == 'absolute' || $(e).css('position') == 'fixed')
                    return parseInt($(e).css('z-index')) || 1;
            }));
            maxZ = maxZ == -Infinity ? 1 : maxZ;
            maxZ = maxZ < max ? maxZ : max;
            return maxZ;
        },

        colorHex: function (rgb) {
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
        colorRgb: function (hex) {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var sColor = this.toLowerCase();
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
        /*
         *根据key值获取Item
         *@returns {obj}
         */
        getJsonItem: function (obj, key, value) {
            var v = (typeof (value) != "undefined") ? value : null;
            var r = {
                item: null
                , value: null
            };

            for (var item in obj) {
                if (v != null) {
                    if (obj[item][key] == v) {
                        r.item = obj[item];
                        r.value = obj[item][key];
                        break;
                    }
                }
                else {
                    if (obj[item].hasOwnProperty(key)) {
                        r.item = obj[item];
                        r.value = item[key];
                        break;
                    }
                }
            }
            return r;
        },

        //根据key值更新Item
        updateJsonItem: function (obj, key, newobj) {
            var updateflg = false;
            outerloop:
                for (var item in obj) {
                    innerloop:
                        for (var ikey in obj[item]) {
                            if (ikey == key) {
                                updateflg = true;
                                obj[item] = newobj;
                                break outerloop;
                            }
                        }
                }
            if (!updateflg) {
                obj.push(newobj);
            }

            return obj;
        },

        /*移除 JSON对象中指定的值
         * @obj:json 对象
         * @value:要删除的值
         */
        removeJosnItem: function (obj, value) {
            if (typeof (obj) == "object" && obj != null) {
                for (var i = 0; i < Object.keys(obj).length; i++) {
                    if (typeof (obj[Object.keys(obj)[i]]) == "object" && obj[Object.keys(obj)[i]] != null) {
                        obj[Object.keys(obj)[i]] = this.removeJosnItem(obj[Object.keys(obj)[i]], value);
                    }
                    else {
                        if (obj[Object.keys(obj)[i]] == value) {
                            delete obj[Object.keys(obj)[i]];
                        }
                    }
                }
                return obj;
            }
            return null;
        },

        /*
         * Josn 值decodeURIComponent转化
         * */

        encodeURIComponentJosnItem: function (obj) {
            if (typeof (obj) == "object" && obj != null) {
                for (var i = 0; i < Object.keys(obj).length; i++) {
                    if (typeof (obj[Object.keys(obj)[i]]) == "object" && obj[Object.keys(obj)[i]] != null) {
                        obj[Object.keys(obj)[i]] = this.encodeURIComponentJosnItem(obj[Object.keys(obj)[i]]);
                    }
                    else {
                        obj[Object.keys(obj)[i]] = encodeURIComponent(obj[Object.keys(obj)[i]]);
                    }
                }
            }
            return obj;
        },

        /*
         * @tapObj{
         * container:obj 放置TAP容器对象
         * ,active:"activeClass" TAP选中是的样式
         * ,meanWidth:true 是否平均分配宽度,默认为true
         * ,data:[{text:"html" TAP 显示的标签文字,支持html格式
         *         ,click:function(){}  点击TAP时候的函数
         *         },...]
         * }
         *
         * @callback:回调函数
         *
         * */

        setTap: function (tapObj, callback) {
            var tapHtml = "";
            if (!_.isEmpty(tapObj) && !_.isEmpty(tapObj.container)) {

                $.each(tapObj.data, function (index, item) {
                    var text = item.text;
                    tapHtml += "<li>" + text + "</li>";
                });
                tapObj.container.html(tapHtml);

                var meanWidth = tapObj.meanWidth == false ? false : true;
                if (meanWidth) {
                    tapObj.container.find("li").css({
                        "width": 100 / tapObj.data.length + "%"
                        , "list-style": "none"
                    });
                }
                else {
                    tapObj.container.find("li").css({
                        "list-style": "none"
                    });
                }


                tapObj.container.find("li").off("click");
                tapObj.container.find("li").on("click", function () {
                    if (!_.isEmpty(tapObj.active)) {
                        tapObj.container.find("li").removeClass(tapObj.active);
                        $(this).addClass(tapObj.active);
                    }
                    var i = $(this).index();
                    tapObj.data[i].click();
                });

                if (typeof (callback) == "function") {
                    callback();
                }
            }
        },

        /**
         * 获取操作系统
         * @returns {String}
         */
        detectOS: function () {
            var sUserAgent = navigator.userAgent;
            var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
            var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
            if (isMac) return "Mac";
            var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
            if (isUnix) return "Unix";
            var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
            if (isLinux) return "Linux";
            if (isWin) {
                var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
                if (isWin2K) return "Win2000";
                var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
                if (isWinXP) return "WinXP";
                var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
                if (isWin2003) return "Win2003";
                var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
                if (isWinVista) return "WinVista";
                var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
                if (isWin7) return "Win7";
            }
            return "other";
        },

        /**
         * 获取浏览器
         * @returns {String}
         */
        getBrower: function () {
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                return "MSIE";
            }
            if (navigator.userAgent.indexOf("Firefox") > 0) {
                return "Firefox";
            }
            if (navigator.userAgent.indexOf("Chrome") > 0) {
                return "Chrome";
            }
            if (navigator.userAgent.indexOf("Safari") > 0) {
                return "Safari";
            }
            if (navigator.userAgent.indexOf("Camino") > 0) {
                return "Camino";
            }
            if (navigator.userAgent.indexOf("Gecko/") > 0) {
                return "Gecko";
            }
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

        /**
         * 格式化时间
         * @strTime:输入时间
         * @format:格式化["yyyy-MM-dd hh:mm:ss"]
         * @returns {String}
         */
        formatTime: function (strTime, format) {
            var date = new Date(Date.parse(strTime.replace(/-/g, "/")));
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4
                    - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
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
        }


    }
});