//获取滚动条滚动距离(全兼容)
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    } else {
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}
//获取浏览器视口尺寸(全兼容,包含标准/怪异模式)
function getViewportOffset() {
    if (window.innerWidth) {
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    } else {
        if (document.compatMode === "BackCompat") {
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight
            }
        } else {
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight
            }
        }
    }

}
//获取元素属性(全兼容)
function getStyle(elem, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(elem, null)[prop];
    } else {
        return elem.currentStyle[prop];
    }
}
//事件绑定函数(全兼容)
function addEvent(elem, type, handle) {
    if (elem.addEventListener) {
        elem.addEventListener(type, handle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + type, function () {
            handle.call(elem);
        })
    } else {
        elem['on' + type] = handle;
    }
}
//取消事件冒泡(全兼容)
function stopBubble(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}
//阻止默认事件(全兼容)
function cancelHandler(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}
//异步加载(全兼容)
function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function () { //IE
            if (script.readyState == "complete" || script.readyState == "loaded") {
                callback();
            }
        }
    } else {
        scirpt.onload = function () { //Safari chrome firefox opera
            callback();
        }
    }
    script.src = url;
    document.head.appendChild(script);
}
/*
    异步加载方法调用
    loadScript('demo.js',function(){
        test();   //方法名
    })
*/

// 查找所有的兄弟节点
function getSiblings(node) {
    //转成数组
    var elements = [].slice.call(node.parentNode.children);
    return elements.filter(function (ele) {
        return ele != node; //返回除了自己以外的dom节点
    })
}

// 数组去重 hash哈希方式
Array.prototype.unique = function () {
    var temp = {},
        arr = [],
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (!temp[this[i]]) { // temp对象中有没有这个值,为false时,!false=true进入判断条件
            temp[this[i]] = 'abc'; // 让这个值做为temp对象的属性名
            arr.push(this[i]); // 然后把这个值放入新数组中返回
        }
    }
    return arr;
}

// typeof 原理
function type(target) {
    var ret = typeof (target);
    var template = {
        "[object Array]": "array",
        "[object Object]": "object",
        "[object Number]": "number - object",
        "[object Boolean]": "boolean - object",
        "[object String]": "string - object"
    }
    if (target === null) {
        return "null";
    } else if (ret == "object") {
        var str = Object.prototype.toString.call(target);
        return template[str];
    } else {
        return ret;
    }
}

// 数组forEach方法 原理
Array.prototype.myforEach = function (func) {
    //this - > arrobj 谁调用this指向谁
    var len = this.length;
    for (var i = 0; i < len; i++) {
        //i = 0; this arrobj[0]
        func(this[i], i, this); //每次循环都这行这个函数,就是下面的arrobj.myforEach(function)
    }
}

// 数组filter方法 原理
Array.prototype.myFilter = function (func) {
    var arr = [];
    var len = this.length;
    var _this = arguments[1] || window;
    for (var i = 0; i < len; i++) {
        func.apply(_this, [this[i], i, this]) && arr.push(this[i]);
    }

    return arr;
}

// 数组map方法 原理
Array.prototype.myMap = function (func) {
    var arr = [];
    var len = this.length;
    var _this = arguments[1] || window;
    for (var i = 0; i < len; i++) {
        arr.push(func.call(_this, this[i], i, this));
    }
    return arr;
}

// 数组every方法 原理
Array.prototype.myEvery = function (func) {
    var flag = true;
    var len = this.length;
    var _this = arguments[1] || window;
    for (var i = 0; i < len; i++) {
        if (func.apply(_this, [this[i], i, this]) == false) {
            flag = false;
            break;
        }
    }
    return flag;
}

// 封装 Ajax
function ajax(url, success) {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHttp");
    }
    xhr.open("get", url, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            success && success(data);
        }
    }
    xhr.send();
}

// 封装 jsonP
var $ = {
    ajax: function (options) {
        var url = options.url;
        var type = options.type;
        var dataType = options.dataType;
        //判断是否同源(协议，域名，端口号)
        var targetProtocol = ""; //获取目标url的域
        var targetHost = ""; //目标接口的host, host是包含域名和端口的
        //如果url不带http，那么访问的一定是相对路径，一定是同源的
        if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
            var targetUrl = new URL(url);
            targetProtocol = targetUrl.protocol;
            targetHost = targetUrl.host;
        } else {
            targetProtocol = location.protocol;
            targetHost = location.host;
        }
        //首先判断是否为jsonp，因为不是jsonp不用做其他判断，直接发ajax

        if (dataType == "jsonp") {
            //要看是否同源
            //同源
            if (location.protocol == targetProtocol && location.host == targetHost) {
                //此处省略。因为同源，jsonp会当作普通的ajax做请求
            } else { //不同源，跨域
                //随机生成一个callback
                var callback = "cb" + Math.floor(Math.random() * 1000000);
                //给window上添加一个方法
                window[callback] = options.success;
                //生成script标签
                var script = document.createElement("script");
                if (url.indexOf("?") > 0) { //表示已经有参数了
                    script.src = url + "&callback=" + callback;
                } else {
                    script.src = url + "?callback=" + callback;
                }
                script.id = callback;
                document.head.appendChild(script);
            }
        }
    }
}

// 深度克隆
function deepClone(origin, target) {
    var target = target || {},
        toStr = Object.prototype.toString,
        arrStr = "[object Array]";
    for (var prop in origin) {
        //避免拿原型链上的属性
        if (origin.hasOwnProperty(prop)) {
            //判断是不是引用值
            if (origin[prop] !== "null" && typeof (origin[prop]) == 'object') {
                //判断是数组还是对象
                if (toStr.call(origin[prop]) == arrStr) {
                    target[prop] = [];
                } else {
                    target[prop] = {};
                }
                deepClone(origin[prop], target[prop]);
                //否则是原始值
            } else {
                target[prop] = origin[prop];
            }
        }
    }
    //如果没传target就把target给返回
    return target;
}

// 圣杯模式继承 (a继承b,且a不影响b)
function inherit(Target, Origin) {
    function F() {};
    F.prototype = Origin.prototype;
    Target.prototype = new F();
    //constructor默认指向他的构造函数
    Target.prototype.constructor = Target; //让son的构造函数指向自己
    //uber超类,查到底继承自谁,此步可有可无
    //Target.prototype.uber = Origin.prototype;
}

// 雅虎圣杯继承
var inherit = (function () {
    var F = function F() {}
    return function () {
        F.prototype = Origin.prototype;
        Target.prototype = new F();
        Target.prototype.constructor = Target;
        Target.prototype.uber = Origin.prototype;
    }
}())

// 冒泡排序
//循环length - 1次
// 避免重复查找，实际上只查询lenght - 1 - i次
function swap(arr, a, b) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

function bubbleSort(nums) {
    for (var i = 0; i < nums.length - 1; i++) {
        for (var j = 0; j <= nums.length - 2 - i; j++) {
            if (nums[j] > nums[j + 1]) {
                swap(nums, j, j + 1);
            }
        }
    }
}

// 选择排序
function swap(nums, i, j) {
    var temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

function selectSort(arrs) {
    for (var i = 0; i < arrs.length - 1; i++) {
        //在 i ~ nums.length - 1范围内找到最小值下标
        var min = Infinity;
        var index;
        for (var j = i; j < arrs.length; j++) {
            //找最小值
            if (arrs[j] < min) {
                min = arrs[j];
                index = j;
            }
        }
        swap(arrs, i, index);
        console.log(arrs.join(","));
    }
}

// 快速排序
function quickSort(arrs) {
    function _quickSort(start, end) {
        if (start >= end || start < 0 || end > arrs.length - 1) {
            //范围有问题
            return;
        }
        var low = start,
            high = end,
            key = arrs[end];
        while (low < high) {
            //低位向高位移动
            while (low < high && arrs[low] <= key) {
                low++;
            }
            arrs[high] = arrs[low];
            //高位向低位移动
            while (low < high && arrs[high] > key) {
                high--;
            }
            arrs[low] = arrs[high];
        }
        //高低位重叠
        arrs[low] = key;
        //让低位范围再来一次
        _quickSort(start, low - 1);
        //让高位范围再来一次
        _quickSort(high + 1, end);
    }
    _quickSort(0, arrs.length - 1);
}

// 二分查找
function twoFind(arr, target) {
    var minIndex = 0,
        maxIndex = arr.length - 1;
    while (minIndex <= maxIndex) {
        var mid = Math.floor((minIndex + maxIndex) / 2);
        if (arr[mid] === target) {
            return true; // 找到了
        } else if (arr[mid] > target) {
            maxIndex = mid - 1;
        } else {
            minIndex = mid + 1;
        }
    }
    return false;
}