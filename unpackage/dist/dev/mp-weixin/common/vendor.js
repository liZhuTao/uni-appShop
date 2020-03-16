(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name);
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({});



var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属
  var parentVm = $children.find(function (childVm) {return childVm.$scope._$vueId === vuePid;});
  if (parentVm) {
    return parentVm;
  }
  // 反向递归查找
  for (var i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var componentOptions = {
    options: {
      multipleSlots: true,
      addGlobalClass: true },

    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 118:
/*!*************************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/static/tab/sousuo.svg ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/sousuo.b192c18e.svg";

/***/ }),

/***/ 128:
/*!**********************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/static/tab/man.png ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 129:
/*!************************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/static/tab/weman.png ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 130:
/*!***********************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/static/tab/book.png ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 131:
/*!***********************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/static/tab/life.png ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIEAYAAAD9yHLdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAGxZJREFUeNrt3XlYU2e+B/Dve5KwiCKCRcWt4r6iAayCBa+t27hUa7nPHW3V2ulotSPjXK12bL2VUevMtHOlrdfaemeqPqVWZqwdtYvjglKpC4lbcWMZxYKIiFQWMSR57x8ZrlWByjHJSfT7+SePOW9yfueY8M17znnfAxARERERERERERERERERERERERERERERERERERERERERERHdN6F1AUTeS1H6vx1VFVU1aJCQMkWmDBuG61iDNWFhGIUpmGKxiEVyq9yanS3Hy/Fy/PbtR+cfnX90/oULWldO5AwMEKJGGPDWgLcGvBUXJy4rXZWu77yD3UhCUkTET77wRczETLsdmzEYg1NS7Ett12zXfvObY3HH4o7FXbmi9XYRqcEAIboHxi7GLsYuzz8vs3AO5z74QAwW0SJar1f9hqGIQcyFC7bzykJl4YgRx88caXek3blzWm8nUWMoWhdA5MmMLxtfNr48bJjTgqNWMTKQ0bGj7h3bKdupbdtiQ2JDYkOaNdN6e4kaQ6d1AUSeKCEhISEhQae7FlY2vmz8tm3iVfGceK5Vqzvb6fV6vV4PTJo0adKkScCzzz777LPPAgMHDhw4cCBQXV1dXV0NFBYWFhYW1rGiXWK32B0SUtPaGmQNslqLLl66dOnS3r1abz/RveAhLHKJeBkv46Vef72wMrgy+De/wQV7gb1gxgzxgZgn5nXqhBPIRKaPj9Z13qUfohBlsaAIPvC5dKm2p3BnM4PBYDAYgLVr33///feBiIiIiLrOhEgppZTAO++8++677wIbNmzYsGFDHet9FIMw6MqVzrrw4vDiNm1SU1NTU1NtNq13B1FDGCDkAopiLDIWGYu2bMHPxBgx5qmntK7I2Z59dsqUKVOAefPmzZs376fbW61Wq9UKPP20o6dSUFBQUFBQV0sppYyKMpvNZrPZZNJ6O4kawnMg5FTGUGOoMXTy5Ac1OGpFRkZGRkbee/vaQ10DBvTv379//e2EEEKI9u213j6ie8EAIee6JmaJWU8/XX8DRTEYACEMBn9/z3sEFOVeTpEHBQUFBQXd+rfFcvFicTFw/vyMGcuXA4WFSUl//jMA2O1S/vh1LVq0aFH/+8pEmSgTAwK0/m8kuhf3fzUJ0Y/NxGAMbt0aGdiBHXcv9vePjJwzB1AUf/+WLbUu9m52e0XFpUvAjRtm8+rV9/66H37YsSMjA6iqOn48J+fWY0jI5MkjRgC+vl26tGun9dYRORd7IORce7Ebu0UD59aE0Hn0tX9CKCq+FVLW1Fitdz9vt1ssdT1P9CBggBARkSoMECIiUoXnQMitLJacnG3bAECnc+coECEcJ8cVpVmzdu0Ag6F16+hoAFAUzz6kRuS5GCDkVjZbaam2Mz5dvnzsGGCzXbny3XeAn19ExAsvOJYIjooiahQGCLlF69aAry/QoQPg5+f+9VdWAjYbkJUFVFQANtsPP5w/D1itV6+ePQvo9SEhPXpovZeIvAsDhJxrBIZiqF6PfdiLH83o9NRTQGgoMGSIlD8eP+EuVVWOAElMFOLsWaC62vFvKW/eLCvTeqcReScGCDnXTqQhzWqF7+1Pr10LXLwIrF0rxMWLWhdZO+Ib0OkCAzt00LoaIu/EAKGHjGOch8Hw6KNPPgkoStOmYWFa10TknRgg5FY+Pl26jBvnmNDEnRN2SOm42kqncwSGEL6+zZtrvTeIvBsDhNxKpwsO7tYNUBQ/v4bmhCIiz8eBhEREpAoDhIiIVOEhLHKr2oGEUrr3HAig1/v6Ok6at2njmL69aVOt9waRd2OAkFvdmspEK47ZgH18wsNHjgQMhrZtY2K03itE3omHsOghI6XNBtTU5OV9+eWt+38QUeOxB0LOVc9I9BdekLJtWyA6GtDi8tmbN4Ww24GFC4HsbKC62hEkNtv16xcu3Dq0RUT3jgFCTiX2iQyRYbNJSPzoTq746ishrl4FTp50zEXlbtXVgN1+awqTWorC8SBEajFAyKnkTWmRFinvnMqkoMDxx7v2UWuKEhjYvr1jXEr37lpXQ+SdGCDkVrUDCd1/PxBAURz3AwkLAwyGsLBBgxxL1NzClogYIORmt6Yy4Uh0Im/H315ERKQKA4SIiFRhgBARkSo8B0JuVV1tNq9eDThu6eTONTtGoCtKQECbNoCPT+fOo0cDitKkSWio1nuFyDsxQMitpLRatbyM12azWLKzgRs3jh+/dAlo0iQ6eu5cQAi9vkkTrfcOkXdhgJBzZYh0ka4o+LfbBxIOHgwEBQE9e0rp3kkUHW7ccAwg/PRTIS5fBuz2mpqKCsBmu3r17FlAr2/VasAArXcekXdhgJBTycX239p/K4SASBJJt54PCAB0uluP7qbXO8aC1K7bbv//iuWPR6YT0b1jgJBTib0iXaTbbHeORN+1C7h6Fdi1yzGlidaE0Ov9/DgSneh+MEDooeEYje6YNNHHp0uXsWMBIXx8mjXTujIi78QAIbfy8zMa58xxTGIYFOS+9Qqh0xkMAKAoen7qiZyCXyVyq9pDR0IYDP7+WldDRPeDAwmJiEgVBggREanCACEiIlUYIEREpApPopNzJcnBcrDdjuVir9h792IpLZbyckBKnc7PT+ti66+PiH4aA4Sc6zIu43J+vuMfMTF3Lq6uPnbsgw+0LpKInIGHsMipxHgxXozfuFHrOojI9Rgg5FSmdqZ2pnZffIFSfIkvV63Suh4ich0ewiKXMJ83hZpC580zzjMmG5P378fr4oq4MmMGKvAFvujSRZrkAXnAx0frOu8kEsWr4tWbN3EG6UgPCkI7AGjTRuu6iDwRA4RcypxoTjQnfvaZ41+1jwAGwB8ePBLdaIhcErlkyxa0ww7smDhR63qIPBEPYRERkSoMECIiUoUBQkREqjBAiIhIFQYIkVMIUfezilL3EiLvxwAhcoKAgOjoXr0c9znR6wEfn3btQkMBH5+OHVu31ro6ItfgZbxEThAQ8NhjvXoB3brt3LlqFaAo/v6+vrcChehBxI82kRPpdIGBAQFaV0HkHjyERUREqrAH4qEGXRx0cdBFf39LpCXSEtm1qzALszC3ayczZIbMCA3FSqzESs+bCuRBIX8nF8gFjz4qXhc7xI67l6elpaWlpQE5OTk5OTn3/r7Z2dnZ2dkNNChGMYqHDTMajUaj0Xv6MnKyEqaE3biBjrZptmmFhRiFURhVWNhlRpcZXWacO5eampqammqzaV0nORevD9FYvIyX8VKvr4iqiKqI+vd/lycwBmOeeQbh2IEdI0ciAACaNNG6TiJVHsUgDLpyBTGyk+y0bZv9F0oPpccnnxwLyhybOXbXLq3Lo/vDANGIMdmYbEyeOBHzxHqxfsUK9IeA6NFD67qI3EFuAoC9ezHd7mv3feWVoxlHM45mZGZqXRc1DgPETXpt7rW512YfH798v3y//DVrkCI+EZ/MmKF1XURaku/JNXKNzYbt4rQ4vXjx0RWmaaZpv/+91nXRvWGAuNjA7IHZA7MDA2t8bf9h+48dO8QEABgy5KdepyiKoihA3759+vTpA3To0LFjx45AcHCLFi1aAEIIwQFq5CmsVpvNZgNKS0tLS0uBs2fPnDlzBsjNzcvLy7v395GTISHXrTs632Q2mX/5y389K7XePqob/wS5SEJCQkJCgk6X0zt3de7qv/9d/F2MFqN/9rP62jdt2rRp06bAtGlTp06dCkyYMGHChAlAcHBwcHCw1ltDpE5+fn5+fj7w8ccff/zxx8Bnn23dunUrYLM5Aqc+0g8Afve7oxkmk8m0ZInW20F1Y4C4yIBxkZGRkW++KQoAYNGi+tpFRkZGRkYCv//9ypUrVwItWjh6GEQPotqr0P7zP+fPnz8fKCgoKCgoqKOhEZGIlBJ9ZW/Ze9Kk2+8rQ56CAeJk/ef2n9t/bteuyh7dAd2BrCz4AIDBcGe7J54YNmzYMGDFihUrVqwA9Hq9niOW6WFRVlZWVlYG/PKXM2fOnAnk5ubm5ubW0TAXAPLzm5U1zWya2b37PrFP7BPV1VrXTw4cSOhk4gndN7pvli+vLzi6d+/evXt3ICkpKSkpicFBD6egoKCgoCDgv//7T3/605+AwMDAwMDAOhp2BoAOHcrTy9PL019+Weu66XYMECd5LOWxlMdSWrUShZiFWZMm3bm89qT3okULFy5cCPj5+fn5+WldNZG22rZt27ZtW2DmTEdPpF5polAUzpmjdb10OwaIk9QE1ATUBIwfjw+xFmuVu/brkCFDhgwZAvTr169fv35aV0vkWZ55ZtKkSZOAVq1CQ0ND62iwFX/EHx99dIBhgGGAISJC63rJgQdPnOUZYRKm0aPRt+7Fw4cPHz58uHblVVZWV1utgN0uJS+KpPoYDDqdogB+fj4+Op371lt7KHfo0KFDhw4FPv108+bNm+9up/RT+in9Ro+GCSaYjh/Xen897BggTiK3Njx3UnR0VFRUlOvW/89/FhVVVABff52ZWVAAfPvtqVNXrgAFBSUlVVWAxWK12u1a7yXyFv7+vr46HdC5c5s2zZoBsbG9e4eGAqNHDxzYti0QHNysma+v89cbHR0dHR1df4BIiVSkduoEIBzhWu8lYoA4icgSW8XWtm3vfF6n0+l0OqBly5YtW7Z03voqKm7cqKkB3nvv88/PnAG++urIkcJC9jDIOW7cuHnTZgO+++78+bKyW4/r1//jH7m5wJQpw4aFhwPPPffkk+HhjoGvzhjY2qpVq1atWjXQIAd/xp/DwrTeP+TAcyDOsgGrsOruERy1AwRrR5bfr4KCq1erqoBZs5KTDx4Evvji8OGCAgYHuUd1tcViswH/+79ffZWdDSxcuG6dyQRUVd28abXe//s3b+64OqteUxGL2JAQrfcDOTBAnESa5BF55O7fYM6acqS83NHjWLDggw8yM4H8/OLiykqtt5oedocOnTlTUgL813+tX3/sGGC32+3380PmJ78re7EbuzmJj6dggHiJt97avDkrC/j++ytXqqq0robodrVBkpqann7hgtbVkLswQDzcqVMXLpSVAWlpJ04UFWldDVHDNmzYuTM391aPmR5sDBAPt23bwYPffw/wDAd5g9rg2Lv32DH+4HnwMUA8XEZGVlZxsdZVEDUOP7cPBwaIh7p+vaqqpga4dq2iwmLRuhqixrlwgRd5PAwYIB7q2rXy8ps3ta6CSJ2rV69f5+f3wccA8VA1NTYbz3qQt7JabTbOfPDgY4AQEZEqDBAiIlKFc2ERkfeowl7s7dnTmGJMMab84x8uX181qlFdVSXPi9VidUEBAvESXioslAPFY+Kx9PSu73ZK6pT0zTepqampqakN3eX9wcQAISLv0QIAmjfHW+Jt8faTT7prtT+aO2UN1gAiRa6Ra4Dc4jyZJ0tKjG8Y3zC+sWmTLkuXpctavvxI6pHUI6kP/kgYHsIiIlIrFAKiZUv8XWwT215+2eZrD7GH5OQYDxsPGw8vWZKQkJCQkODOO6u4FwOEiMhZTuEIjgQEYJZ4Sby0dGnO4ry8vLwvvujbt2/fvn3vnq3b2/EQFhF5DT8/Pz8/P2Ddug8//PBD16/ParVarVbg6tXS0tJS4NSprKysLCAtbd++ffuA3Nzc3Nzc+l8vZgDAiBGGPxj+YPhDenrEqIhREaOGDDkujovjoqxM6/15vxggROQ1au+r07Nnz549e7p//UOHxsfHxwOzZ8+ePXs2cOBARkZGBpCcnJycnNxAoCwWr4nXevfWTdOn69M3bXIc2hozxttPvvMQFhGRSrGxMTExMcDGjRs2bNgAjBo1cuTIkQ28oB2+xtcjR+bl5eXl5f32t1rXf78YIERE98nX19fX1xdYtmzZsmXLgFGjRo0aNar+9nIq5mDOK69EJ0QnRCe0bq11/WoxQIiInKT2DqRLlrz++uuvA507h4eHh9fRcD1WY3XTprZltmW2Zd7bE2GAEBE5WW2PJDExMTExsf52sinCET55cryMl/FS73XnpBkgREQuEhsbGxsbW39PRIwTg8SgkJDy58qfK39u8GCt620sBggRkYsNHTp06NCh9S+Xa5S/Kn+Ni9O6zsZigBARuViPHj169OjRQIM/yt6yd9u2WtfZWAwQIiIXCw0NDQ0NrX+5mC13yB1hYVrX2VgMECIiF/P39/f392+gwR7swZ6AAK3rbCwGCBERqcIAISIiVRggRESkCgOEiIhUYYAQEZEqDBAiIlKFAUJERKowQIiISBUGCBERqcIAISIiVRggRESkCgOEiIhUYYAQEZEqDBAiIlKFAUJERKowQIiISBUGCBERqcIAISIiVRggRESkCgOEiMjF7Ha73W6vf7ksxAiMkFLrOhuLAUJE5GKlpdeuXbvWQIOZ4n/E/xQXa11nYzFAiIhc7PLloqKiogYaZKA5ml+6pHWdjcUAISJysYMHDx48eLCBBlbxkfgoJ0frOhuLAUJE5CIVFRUVFRXAN98cOHDgQB0NjIhEpJRWoWxWNu/YoXW9jcUAISJykb/85aOPPvoIqKysrKysrKPBODlGjsnMPPmzw10Pd/3+e63rbSwGCBGRk508efLkyZNASkpKSkpK/e1EkkgSSatWaV2vWnqtCyAielBcuJCfn58PzJ+/YMGCBYDFYrFYLHe3k/sAwGw2NzOZTKZNm7SuWy32QIiI7lN6enp6ejowffr06dOnAyUlJSUlJXU0nIGX8NLNmyJBPiIfmTPH8WRDI0Q8G3sgRET3yGaz2Ww2wGw2m81mYP36DRs2bAC+/fbbb7/99h7eYJVcKVe+9JI5x5xjzmnwuiyvwAAhIq9Re0ho+fIVK1ascP36bt6srq6uBi5fLi4uLgbOnTt37tw54Pr169evX7+HN3gRMzHTbhfrsBZrFy825ZhzzDl/+YvW+9FZGCAeytfXYFB4gJG8lK+vwaDTOf99rVar1WoFtmzZsmXLFq23sgHTMAdzKipgkeWyfOpUk8lsMps++0zrspyNAeKhWrYMDPTz07oKInVatmze/KH6/P6rpyHD8D7e/9vf7OOtz1uff+WV4+K4OC7On9e6PFdhgHgof39fX50OaN06ONjfHygqKi29cUPrqojuTXh4mzZNm2pdhQs9gSVYcvy4/APGY/zWrUoUohC1aZPZZDKbzGfOABAQWhfpegwQDzdkSO/eoaHAX/+ann7hgtbVEN2bxx/v06dVKxe88VgswqLsbLEdb+LNxYtdvR22PSJJJF27hhPWQGtgYaF8XD4uHy8sdPQsysrwR1dX4NkYIB5u4sQhQzp0ALZuzcjIzwesVpvN+yZ9pofFI484Dl0NGdKnT2ioC1bwNxzCoatXTVkms8mcmuryDQrCWIx1+Vq8Fk/Terj27R95JCAAeOqpmJgOHbSuhqhhs2aNHdutG+Dn5+PjipPo5FkYIF5i9uzx47t3ByIiOncODta6GqLbTZwYG9uhAzB8eGRkWJjW1ZC7MEC8hMGg0ykKsHz5888PGAAYjV27hoRoXRU97GoPsc6dO3Fiz55aV0PuxgDxMoGBTZoYDMDbb8+cGRUFzJw5Zky3bkBAgJ+fnme0yMVqrwp8442pUyMigHnznn66Vy9Ap1MU8RBcdUS3458cL1X7hZ0y5YknwsOBceMGD27fHti378SJoiLg0KHTp0tKgIsXr1yprASuXauosFgcUzHwJDzVx2DQ6xUFCAkJDPT1BTp3btOmWTMgJqZ370ceAWJjHVcF1rajhxsD5AFR2zMZN27QoPbtbz0SEbkKf0MQEZEqDBAiIlKFAUJERKowQIiISBUGCBERqcIAISIiVRggRESkCgOEiIhUYYAQEZEqDBAiIlKFAUJERKowQIiISBUGCBERqcIAISIiVRggRESkCgOEiIhUYYAQEZEqDBAiIlKFAUJERKowQIiISBUGCBERqcIAISIiVRggTiKmijliTkXFnc9XVVVVVVUBUkoppdZVEnm2ysrKysrK+pfLj7EXe69f17pOcmCAOEtnDMfwwsI7n7ZYLBaLBSgvLy8vL9e6SCLPVlJSUlJS0kCDQwBw6ZLWdZIDA8RJZLCMk3EFBfUtP3nyu++++07rKok828mTJ0+ePFn/cnFSDpaDv/9e6zrJgQHiJCIG53Bu7976lqelpaWlpWldJZFn+6nviYyX8TK+/u8ZuRcDxEnsVrvVbv388/qWb9++ffv27cDly5cvX76sdbVEnuXAgQMHDhwAzp49d+7cuToadMVADCwrU95U3lTe3L9f63rJgQHiJMfijsUdizt1CvFYiqWZmXcurz0XkpycnJycrHW1RJ6hurq6uroaWLWq4e+FfA2d0CklxWQ2mU3mmhqt6yYHBoiTyRj7DfuNRYvqW/711zt37twJbNy4cePGjVpXS6SN2qsS33hj6dKlS4G8vLy8vLw6GvZCNKIrK5Xp+BSfLlumdd10O53WBTxoilKLUotS//nPNpVhL4S9EBWFYOQgp1u3O9sdOnT48OHDgM1mt9vtQFRUZGRkJCCEEEJovRVErlF7Wfvixa+99tprwO7du3fv3l1/e1GCQhQuW2YymUwm044dWtdPt2MPxEV8sgwzDTOnTcNpSMjc3DuX1/4CW7du3bp164Bf/OLFF1988aevQiHyJrWf8127du3atQv4+c8nT548GdizZ8+ePXsaeOGvZaJM/PLL8PDw8PDwFSu03g6qG3/rulj//f3399/fq5cyWfdr3a/37UMoBETLlj/1um7dunXr1g2Ii4uLi4sDOnbs0KFDByAkJCQkJARw9FW03joiB5vNarVagdLS0tLSUuD06dOnT58G9u3bv3//fuDSpUuX7mn0hg/iEHfihLBgH/bFxTnOefzwg9bbR3XjnyA3idoetT1qe3i4rYl9qH3o55+L+SJexPfpo3VdRB7hXz0OsUqsEqt+/nMGh3fgISw3yRybOTZzbF5ekwT/jv4dY2IwXo6T4957DxYA4FUl9JCZgrmYe+2aoxc9f755qnmqeerYsQwO78IeiMYGZAzIGJDRpYvIEBki49VXZWcMwqAJE8TvRKJIDA7Wuj4ip5iABVhw/rzsiRKUfPKJ7yDDU4an3nrrYPuD7Q+2Ly3VujxShwHiYeJlvIyXen35r8p/Vf6ruDg5R9mibImIEBvt0+3T27eXvcXX4utWrdAUEtJg0LpeIgAQ/eVn8rMbN+TL4mnxdGEhXhXXxfWCAt0itEGbAwcy92fuz9x/9KjWdRIRERERERERERERERERERERERERERERERERERERERERERGRx/k/ph4eFU251AMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDMtMTBUMTQ6NDg6MjMrMDg6MDBgraaBAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTAzLTEwVDE0OjQ4OjIzKzA4OjAwEfAePQAAAER0RVh0c3ZnOmJhc2UtdXJpAGZpbGU6Ly8vaG9tZS9hZG1pbi9pY29uLWZvbnQvdG1wL2ljb25fZ2FoeWxvMmN1aGIvLS5zdmd0LUjAAAAAAElFTkSuQmCC"

/***/ }),

/***/ 132:
/*!************************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/static/tab/phone.png ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 14:
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 15:
/*!************************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/pages/store/store.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 16));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

_vue.default.use(_vuex.default);





//首页tab切换传输的值
var alist = {
  listing: []

  //tab切换状态
};var load = {
  loading: '' };


var navmin = {
  loading: '',
  naving: 'recomment',
  pageid: 0,
  uniload: '',
  nonedata: ''


  //tab切换没有数据的提示
};var nonemin = {
  nonedata: ''


  //城市选择页面跳转到攻略页面
};var city = {
  citying: ''


  //选择城市页面跳转到发表页面
};var travecity = {
  traveing: ''



  //数据仓库
};var state = {
  alist: alist,
  load: load,
  navmin: navmin,
  nonemin: nonemin,
  city: city,
  travecity: travecity };var _default =



new _vuex.default.Store({
  state: state,
  //同步操作
  mutations: {
    listmuta: function listmuta(state, listdata) {
      state.alist = {
        listing: listdata };

    },
    //tab切换的loading状态
    loadmuat: function loadmuat(state, loading) {
      state.load = {
        loading: loading };

    },
    //以对象传过来的参数
    navmuta: function navmuta(state, pullobj) {
      // console.log(pullobj)
      state.navmin = {
        loading: pullobj.loading,
        naving: pullobj.nav,
        pageid: pullobj.pageid,
        uniload: pullobj.uniload,
        nonedata: pullobj.nonedata };

    },
    //tab切换没有数据的提示
    nonemuta: function nonemuta(state, noneion) {
      console.log(noneion);
      state.nonemin = {
        nonedata: noneion };

    },
    //城市选择页面跳转到攻略页面
    citymuta: function citymuta(state, cityion) {
      console.log(cityion);
      state.city = {
        citying: cityion };

    },
    //城市选择跳转到发表页面
    travemuta: function travemuta(state, cityion) {
      console.log(cityion);
      state.travecity = {
        traveing: cityion };

    } } });exports.default = _default;

/***/ }),

/***/ 16:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 17:
/*!****************************************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/node_modules/animate.css/animate.css ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.10
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.10';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    console.error(err);
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope) {
        return this.$scope[method](args)
      }
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 24:
/*!******************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/common/list.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.login = exports.preview = exports.addressdata = void 0; // 引入SDK核心类
var QQMapWX = __webpack_require__(/*! ./qqmap-wx-jssdk.js */ 25);
var qqmapsdk;

var addressdata = function addressdata() {
  return new Promise(function (resolve, reject) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'D2PBZ-MXJED-JDA4V-PQJNF-45NEJ-7LFXR' });

    qqmapsdk.reverseGeocoder({
      success: function success(res) {
        resolve(res);
      },
      fail: function fail(err) {
        reject(err);
      } });

  });
};

//公用预览图片
exports.addressdata = addressdata;var preview = function preview(index, imglist) {
  return new Promise(function (resolve, reject) {
    uni.previewImage({
      current: index,
      urls: imglist,
      longPressActions: {
        itemList: ['发送给朋友', '保存图片', '收藏'] } }).


    then(function (res) {
      resolve(res);
    }).
    catch(function (err) {
      reject(err);
    });
  });
};

//公用存储用户登录数据
exports.preview = preview;var login = function login(user) {
  return new Promise(function (resolve, reject) {
    var db = wx.cloud.database();
    var users = db.collection('user');
    users.add({
      data: user }).

    then(function (res) {
      resolve(res);
    }).
    catch(function (err) {
      reject(err);
    });
  });
};exports.login = login;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 25:
/*!****************************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/common/qqmap-wx-jssdk.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * 微信小程序JavaScriptSDK
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @version 1.2
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @date 2019-03-06
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @author v_ylyue@tencent.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

var ERROR_CONF = {
  KEY_ERR: 311,
  KEY_ERR_MSG: 'key格式错误',
  PARAM_ERR: 310,
  PARAM_ERR_MSG: '请求参数信息有误',
  SYSTEM_ERR: 600,
  SYSTEM_ERR_MSG: '系统错误',
  WX_ERR_CODE: 1000,
  WX_OK_CODE: 200 };

var BASE_URL = 'https://apis.map.qq.com/ws/';
var URL_SEARCH = BASE_URL + 'place/v1/search';
var URL_SUGGESTION = BASE_URL + 'place/v1/suggestion';
var URL_GET_GEOCODER = BASE_URL + 'geocoder/v1/';
var URL_CITY_LIST = BASE_URL + 'district/v1/list';
var URL_AREA_LIST = BASE_URL + 'district/v1/getchildren';
var URL_DISTANCE = BASE_URL + 'distance/v1/';
var URL_DIRECTION = BASE_URL + 'direction/v1/';
var MODE = {
  driving: 'driving',
  transit: 'transit' };

var EARTH_RADIUS = 6378136.49;
var Utils = {
  /**
              * md5加密方法
              * 版权所有©2011 Sebastian Tschan，https：//blueimp.net
              */
  safeAdd: function safeAdd(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xffff;
  },
  bitRotateLeft: function bitRotateLeft(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
  },
  md5cmn: function md5cmn(q, a, b, x, s, t) {
    return this.safeAdd(this.bitRotateLeft(this.safeAdd(this.safeAdd(a, q), this.safeAdd(x, t)), s), b);
  },
  md5ff: function md5ff(a, b, c, d, x, s, t) {
    return this.md5cmn(b & c | ~b & d, a, b, x, s, t);
  },
  md5gg: function md5gg(a, b, c, d, x, s, t) {
    return this.md5cmn(b & d | c & ~d, a, b, x, s, t);
  },
  md5hh: function md5hh(a, b, c, d, x, s, t) {
    return this.md5cmn(b ^ c ^ d, a, b, x, s, t);
  },
  md5ii: function md5ii(a, b, c, d, x, s, t) {
    return this.md5cmn(c ^ (b | ~d), a, b, x, s, t);
  },
  binlMD5: function binlMD5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << len % 32;
    x[(len + 64 >>> 9 << 4) + 14] = len;

    var i;
    var olda;
    var oldb;
    var oldc;
    var oldd;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (i = 0; i < x.length; i += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;

      a = this.md5ff(a, b, c, d, x[i], 7, -680876936);
      d = this.md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = this.md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = this.md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = this.md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = this.md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = this.md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = this.md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = this.md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = this.md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = this.md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = this.md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = this.md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = this.md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = this.md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = this.md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = this.md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = this.md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = this.md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = this.md5gg(b, c, d, a, x[i], 20, -373897302);
      a = this.md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = this.md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = this.md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = this.md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = this.md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = this.md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = this.md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = this.md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = this.md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = this.md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = this.md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = this.md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = this.md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = this.md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = this.md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = this.md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = this.md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = this.md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = this.md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = this.md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = this.md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = this.md5hh(d, a, b, c, x[i], 11, -358537222);
      c = this.md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = this.md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = this.md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = this.md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = this.md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = this.md5hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = this.md5ii(a, b, c, d, x[i], 6, -198630844);
      d = this.md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = this.md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = this.md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = this.md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = this.md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = this.md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = this.md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = this.md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = this.md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = this.md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = this.md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = this.md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = this.md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = this.md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = this.md5ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = this.safeAdd(a, olda);
      b = this.safeAdd(b, oldb);
      c = this.safeAdd(c, oldc);
      d = this.safeAdd(d, oldd);
    }
    return [a, b, c, d];
  },
  binl2rstr: function binl2rstr(input) {
    var i;
    var output = '';
    var length32 = input.length * 32;
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xff);
    }
    return output;
  },
  rstr2binl: function rstr2binl(input) {
    var i;
    var output = [];
    output[(input.length >> 2) - 1] = undefined;
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0;
    }
    var length8 = input.length * 8;
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
    }
    return output;
  },
  rstrMD5: function rstrMD5(s) {
    return this.binl2rstr(this.binlMD5(this.rstr2binl(s), s.length * 8));
  },
  rstrHMACMD5: function rstrHMACMD5(key, data) {
    var i;
    var bkey = this.rstr2binl(key);
    var ipad = [];
    var opad = [];
    var hash;
    ipad[15] = opad[15] = undefined;
    if (bkey.length > 16) {
      bkey = this.binlMD5(bkey, key.length * 8);
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5c5c5c5c;
    }
    hash = this.binlMD5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
    return this.binl2rstr(this.binlMD5(opad.concat(hash), 512 + 128));
  },
  rstr2hex: function rstr2hex(input) {
    var hexTab = '0123456789abcdef';
    var output = '';
    var x;
    var i;
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i);
      output += hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f);
    }
    return output;
  },
  str2rstrUTF8: function str2rstrUTF8(input) {
    return unescape(encodeURIComponent(input));
  },
  rawMD5: function rawMD5(s) {
    return this.rstrMD5(this.str2rstrUTF8(s));
  },
  hexMD5: function hexMD5(s) {
    return this.rstr2hex(this.rawMD5(s));
  },
  rawHMACMD5: function rawHMACMD5(k, d) {
    return this.rstrHMACMD5(this.str2rstrUTF8(k), str2rstrUTF8(d));
  },
  hexHMACMD5: function hexHMACMD5(k, d) {
    return this.rstr2hex(this.rawHMACMD5(k, d));
  },

  md5: function md5(string, key, raw) {
    if (!key) {
      if (!raw) {
        return this.hexMD5(string);
      }
      return this.rawMD5(string);
    }
    if (!raw) {
      return this.hexHMACMD5(key, string);
    }
    return this.rawHMACMD5(key, string);
  },
  /**
      * 得到md5加密后的sig参数
      * @param {Object} requestParam 接口参数
      * @param {String} sk签名字符串
      * @param {String} featrue 方法名
      * @return 返回加密后的sig参数
      */
  getSig: function getSig(requestParam, sk, feature, mode) {
    var sig = null;
    var requestArr = [];
    Object.keys(requestParam).sort().forEach(function (key) {
      requestArr.push(key + '=' + requestParam[key]);
    });
    if (feature == 'search') {
      sig = '/ws/place/v1/search?' + requestArr.join('&') + sk;
    }
    if (feature == 'suggest') {
      sig = '/ws/place/v1/suggestion?' + requestArr.join('&') + sk;
    }
    if (feature == 'reverseGeocoder') {
      sig = '/ws/geocoder/v1/?' + requestArr.join('&') + sk;
    }
    if (feature == 'geocoder') {
      sig = '/ws/geocoder/v1/?' + requestArr.join('&') + sk;
    }
    if (feature == 'getCityList') {
      sig = '/ws/district/v1/list?' + requestArr.join('&') + sk;
    }
    if (feature == 'getDistrictByCityId') {
      sig = '/ws/district/v1/getchildren?' + requestArr.join('&') + sk;
    }
    if (feature == 'calculateDistance') {
      sig = '/ws/distance/v1/?' + requestArr.join('&') + sk;
    }
    if (feature == 'direction') {
      sig = '/ws/direction/v1/' + mode + '?' + requestArr.join('&') + sk;
    }
    sig = this.md5(sig);
    return sig;
  },
  /**
      * 得到终点query字符串
      * @param {Array|String} 检索数据
      */
  location2query: function location2query(data) {
    if (typeof data == 'string') {
      return data;
    }
    var query = '';
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      if (!!query) {
        query += ';';
      }
      if (d.location) {
        query = query + d.location.lat + ',' + d.location.lng;
      }
      if (d.latitude && d.longitude) {
        query = query + d.latitude + ',' + d.longitude;
      }
    }
    return query;
  },

  /**
      * 计算角度
      */
  rad: function rad(d) {
    return d * Math.PI / 180.0;
  },
  /**
      * 处理终点location数组
      * @return 返回终点数组
      */
  getEndLocation: function getEndLocation(location) {
    var to = location.split(';');
    var endLocation = [];
    for (var i = 0; i < to.length; i++) {
      endLocation.push({
        lat: parseFloat(to[i].split(',')[0]),
        lng: parseFloat(to[i].split(',')[1]) });

    }
    return endLocation;
  },

  /**
      * 计算两点间直线距离
      * @param a 表示纬度差
      * @param b 表示经度差
      * @return 返回的是距离，单位m
      */
  getDistance: function getDistance(latFrom, lngFrom, latTo, lngTo) {
    var radLatFrom = this.rad(latFrom);
    var radLatTo = this.rad(latTo);
    var a = radLatFrom - radLatTo;
    var b = this.rad(lngFrom) - this.rad(lngTo);
    var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLatFrom) * Math.cos(radLatTo) * Math.pow(Math.sin(b / 2), 2)));
    distance = distance * EARTH_RADIUS;
    distance = Math.round(distance * 10000) / 10000;
    return parseFloat(distance.toFixed(0));
  },
  /**
      * 使用微信接口进行定位
      */
  getWXLocation: function getWXLocation(success, fail, complete) {
    wx.getLocation({
      type: 'gcj02',
      success: success,
      fail: fail,
      complete: complete });

  },

  /**
      * 获取location参数
      */
  getLocationParam: function getLocationParam(location) {
    if (typeof location == 'string') {
      var locationArr = location.split(',');
      if (locationArr.length === 2) {
        location = {
          latitude: location.split(',')[0],
          longitude: location.split(',')[1] };

      } else {
        location = {};
      }
    }
    return location;
  },

  /**
      * 回调函数默认处理
      */
  polyfillParam: function polyfillParam(param) {
    param.success = param.success || function () {};
    param.fail = param.fail || function () {};
    param.complete = param.complete || function () {};
  },

  /**
      * 验证param对应的key值是否为空
      * 
      * @param {Object} param 接口参数
      * @param {String} key 对应参数的key
      */
  checkParamKeyEmpty: function checkParamKeyEmpty(param, key) {
    if (!param[key]) {
      var errconf = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + key + '参数格式有误');
      param.fail(errconf);
      param.complete(errconf);
      return true;
    }
    return false;
  },

  /**
      * 验证参数中是否存在检索词keyword
      * 
      * @param {Object} param 接口参数
      */
  checkKeyword: function checkKeyword(param) {
    return !this.checkParamKeyEmpty(param, 'keyword');
  },

  /**
      * 验证location值
      * 
      * @param {Object} param 接口参数
      */
  checkLocation: function checkLocation(param) {
    var location = this.getLocationParam(param.location);
    if (!location || !location.latitude || !location.longitude) {
      var errconf = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + ' location参数格式有误');
      param.fail(errconf);
      param.complete(errconf);
      return false;
    }
    return true;
  },

  /**
      * 构造错误数据结构
      * @param {Number} errCode 错误码
      * @param {Number} errMsg 错误描述
      */
  buildErrorConfig: function buildErrorConfig(errCode, errMsg) {
    return {
      status: errCode,
      message: errMsg };

  },

  /**
      * 
      * 数据处理函数
      * 根据传入参数不同处理不同数据
      * @param {String} feature 功能名称
      * search 地点搜索
      * suggest关键词提示
      * reverseGeocoder逆地址解析
      * geocoder地址解析
      * getCityList获取城市列表：父集
      * getDistrictByCityId获取区县列表：子集
      * calculateDistance距离计算
      * @param {Object} param 接口参数
      * @param {Object} data 数据
      */
  handleData: function handleData(param, data, feature) {
    if (feature == 'search') {
      var searchResult = data.data;
      var searchSimplify = [];
      for (var i = 0; i < searchResult.length; i++) {
        searchSimplify.push({
          id: searchResult[i].id || null,
          title: searchResult[i].title || null,
          latitude: searchResult[i].location && searchResult[i].location.lat || null,
          longitude: searchResult[i].location && searchResult[i].location.lng || null,
          address: searchResult[i].address || null,
          category: searchResult[i].category || null,
          tel: searchResult[i].tel || null,
          adcode: searchResult[i].ad_info && searchResult[i].ad_info.adcode || null,
          city: searchResult[i].ad_info && searchResult[i].ad_info.city || null,
          district: searchResult[i].ad_info && searchResult[i].ad_info.district || null,
          province: searchResult[i].ad_info && searchResult[i].ad_info.province || null });

      }
      param.success(data, {
        searchResult: searchResult,
        searchSimplify: searchSimplify });

    } else if (feature == 'suggest') {
      var suggestResult = data.data;
      var suggestSimplify = [];
      for (var i = 0; i < suggestResult.length; i++) {
        suggestSimplify.push({
          adcode: suggestResult[i].adcode || null,
          address: suggestResult[i].address || null,
          category: suggestResult[i].category || null,
          city: suggestResult[i].city || null,
          district: suggestResult[i].district || null,
          id: suggestResult[i].id || null,
          latitude: suggestResult[i].location && suggestResult[i].location.lat || null,
          longitude: suggestResult[i].location && suggestResult[i].location.lng || null,
          province: suggestResult[i].province || null,
          title: suggestResult[i].title || null,
          type: suggestResult[i].type || null });

      }
      param.success(data, {
        suggestResult: suggestResult,
        suggestSimplify: suggestSimplify });

    } else if (feature == 'reverseGeocoder') {
      var reverseGeocoderResult = data.result;
      var reverseGeocoderSimplify = {
        address: reverseGeocoderResult.address || null,
        latitude: reverseGeocoderResult.location && reverseGeocoderResult.location.lat || null,
        longitude: reverseGeocoderResult.location && reverseGeocoderResult.location.lng || null,
        adcode: reverseGeocoderResult.ad_info && reverseGeocoderResult.ad_info.adcode || null,
        city: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.city || null,
        district: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.district || null,
        nation: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.nation || null,
        province: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.province || null,
        street: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.street || null,
        street_number: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.street_number || null,
        recommend: reverseGeocoderResult.formatted_addresses && reverseGeocoderResult.formatted_addresses.recommend || null,
        rough: reverseGeocoderResult.formatted_addresses && reverseGeocoderResult.formatted_addresses.rough || null };

      if (reverseGeocoderResult.pois) {//判断是否返回周边poi
        var pois = reverseGeocoderResult.pois;
        var poisSimplify = [];
        for (var i = 0; i < pois.length; i++) {
          poisSimplify.push({
            id: pois[i].id || null,
            title: pois[i].title || null,
            latitude: pois[i].location && pois[i].location.lat || null,
            longitude: pois[i].location && pois[i].location.lng || null,
            address: pois[i].address || null,
            category: pois[i].category || null,
            adcode: pois[i].ad_info && pois[i].ad_info.adcode || null,
            city: pois[i].ad_info && pois[i].ad_info.city || null,
            district: pois[i].ad_info && pois[i].ad_info.district || null,
            province: pois[i].ad_info && pois[i].ad_info.province || null });

        }
        param.success(data, {
          reverseGeocoderResult: reverseGeocoderResult,
          reverseGeocoderSimplify: reverseGeocoderSimplify,
          pois: pois,
          poisSimplify: poisSimplify });

      } else {
        param.success(data, {
          reverseGeocoderResult: reverseGeocoderResult,
          reverseGeocoderSimplify: reverseGeocoderSimplify });

      }
    } else if (feature == 'geocoder') {
      var geocoderResult = data.result;
      var geocoderSimplify = {
        title: geocoderResult.title || null,
        latitude: geocoderResult.location && geocoderResult.location.lat || null,
        longitude: geocoderResult.location && geocoderResult.location.lng || null,
        adcode: geocoderResult.ad_info && geocoderResult.ad_info.adcode || null,
        province: geocoderResult.address_components && geocoderResult.address_components.province || null,
        city: geocoderResult.address_components && geocoderResult.address_components.city || null,
        district: geocoderResult.address_components && geocoderResult.address_components.district || null,
        street: geocoderResult.address_components && geocoderResult.address_components.street || null,
        street_number: geocoderResult.address_components && geocoderResult.address_components.street_number || null,
        level: geocoderResult.level || null };

      param.success(data, {
        geocoderResult: geocoderResult,
        geocoderSimplify: geocoderSimplify });

    } else if (feature == 'getCityList') {
      var provinceResult = data.result[0];
      var cityResult = data.result[1];
      var districtResult = data.result[2];
      param.success(data, {
        provinceResult: provinceResult,
        cityResult: cityResult,
        districtResult: districtResult });

    } else if (feature == 'getDistrictByCityId') {
      var districtByCity = data.result[0];
      param.success(data, districtByCity);
    } else if (feature == 'calculateDistance') {
      var calculateDistanceResult = data.result.elements;
      var distance = [];
      for (var i = 0; i < calculateDistanceResult.length; i++) {
        distance.push(calculateDistanceResult[i].distance);
      }
      param.success(data, {
        calculateDistanceResult: calculateDistanceResult,
        distance: distance });

    } else if (feature == 'direction') {
      var direction = data.result.routes;
      param.success(data, direction);
    } else {
      param.success(data);
    }
  },

  /**
      * 构造微信请求参数，公共属性处理
      * 
      * @param {Object} param 接口参数
      * @param {Object} param 配置项
      * @param {String} feature 方法名
      */
  buildWxRequestConfig: function buildWxRequestConfig(param, options, feature) {
    var that = this;
    options.header = { "content-type": "application/json" };
    options.method = 'GET';
    options.success = function (res) {
      var data = res.data;
      if (data.status === 0) {
        that.handleData(param, data, feature);
      } else {
        param.fail(data);
      }
    };
    options.fail = function (res) {
      res.statusCode = ERROR_CONF.WX_ERR_CODE;
      param.fail(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
    };
    options.complete = function (res) {
      var statusCode = +res.statusCode;
      switch (statusCode) {
        case ERROR_CONF.WX_ERR_CODE:{
            param.complete(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
            break;
          }
        case ERROR_CONF.WX_OK_CODE:{
            var data = res.data;
            if (data.status === 0) {
              param.complete(data);
            } else {
              param.complete(that.buildErrorConfig(data.status, data.message));
            }
            break;
          }
        default:{
            param.complete(that.buildErrorConfig(ERROR_CONF.SYSTEM_ERR, ERROR_CONF.SYSTEM_ERR_MSG));
          }}


    };
    return options;
  },

  /**
      * 处理用户参数是否传入坐标进行不同的处理
      */
  locationProcess: function locationProcess(param, locationsuccess, locationfail, locationcomplete) {
    var that = this;
    locationfail = locationfail || function (res) {
      res.statusCode = ERROR_CONF.WX_ERR_CODE;
      param.fail(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
    };
    locationcomplete = locationcomplete || function (res) {
      if (res.statusCode == ERROR_CONF.WX_ERR_CODE) {
        param.complete(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
      }
    };
    if (!param.location) {
      that.getWXLocation(locationsuccess, locationfail, locationcomplete);
    } else if (that.checkLocation(param)) {
      var location = Utils.getLocationParam(param.location);
      locationsuccess(location);
    }
  } };var



QQMapWX = /*#__PURE__*/function () {

  /**
                                     * 构造函数
                                     * 
                                     * @param {Object} options 接口参数,key 为必选参数
                                     */
  function QQMapWX(options) {_classCallCheck(this, QQMapWX);
    if (!options.key) {
      throw Error('key值不能为空');
    }
    this.key = options.key;
  }_createClass(QQMapWX, [{ key: "search",

    /**
                                            * POI周边检索
                                            *
                                            * @param {Object} options 接口参数对象
                                            * 
                                            * 参数对象结构可以参考
                                            * @see http://lbs.qq.com/webservice_v1/guide-search.html
                                            */value: function search(
    options) {
      var that = this;
      options = options || {};

      Utils.polyfillParam(options);

      if (!Utils.checkKeyword(options)) {
        return;
      }

      var requestParam = {
        keyword: options.keyword,
        orderby: options.orderby || '_distance',
        page_size: options.page_size || 10,
        page_index: options.page_index || 1,
        output: 'json',
        key: that.key };


      if (options.address_format) {
        requestParam.address_format = options.address_format;
      }

      if (options.filter) {
        requestParam.filter = options.filter;
      }

      var distance = options.distance || "1000";
      var auto_extend = options.auto_extend || 1;
      var region = null;
      var rectangle = null;

      //判断城市限定参数
      if (options.region) {
        region = options.region;
      }

      //矩形限定坐标(暂时只支持字符串格式)
      if (options.rectangle) {
        rectangle = options.rectangle;
      }

      var locationsuccess = function locationsuccess(result) {
        if (region && !rectangle) {
          //城市限定参数拼接
          requestParam.boundary = "region(" + region + "," + auto_extend + "," + result.latitude + "," + result.longitude + ")";
          if (options.sig) {
            requestParam.sig = Utils.getSig(requestParam, options.sig, 'search');
          }
        } else if (rectangle && !region) {
          //矩形搜索
          requestParam.boundary = "rectangle(" + rectangle + ")";
          if (options.sig) {
            requestParam.sig = Utils.getSig(requestParam, options.sig, 'search');
          }
        } else {
          requestParam.boundary = "nearby(" + result.latitude + "," + result.longitude + "," + distance + "," + auto_extend + ")";
          if (options.sig) {
            requestParam.sig = Utils.getSig(requestParam, options.sig, 'search');
          }
        }
        wx.request(Utils.buildWxRequestConfig(options, {
          url: URL_SEARCH,
          data: requestParam },
        'search'));
      };
      Utils.locationProcess(options, locationsuccess);
    } }, { key: "getSuggestion",

    /**
                                  * sug模糊检索
                                  *
                                  * @param {Object} options 接口参数对象
                                  * 
                                  * 参数对象结构可以参考
                                  * http://lbs.qq.com/webservice_v1/guide-suggestion.html
                                  */value: function getSuggestion(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);

      if (!Utils.checkKeyword(options)) {
        return;
      }

      var requestParam = {
        keyword: options.keyword,
        region: options.region || '全国',
        region_fix: options.region_fix || 0,
        policy: options.policy || 0,
        page_size: options.page_size || 10, //控制显示条数
        page_index: options.page_index || 1, //控制页数
        get_subpois: options.get_subpois || 0, //返回子地点
        output: 'json',
        key: that.key };

      //长地址
      if (options.address_format) {
        requestParam.address_format = options.address_format;
      }
      //过滤
      if (options.filter) {
        requestParam.filter = options.filter;
      }
      //排序
      if (options.location) {
        var locationsuccess = function locationsuccess(result) {
          requestParam.location = result.latitude + ',' + result.longitude;
          if (options.sig) {
            requestParam.sig = Utils.getSig(requestParam, options.sig, 'suggest');
          }
          wx.request(Utils.buildWxRequestConfig(options, {
            url: URL_SUGGESTION,
            data: requestParam },
          "suggest"));
        };
        Utils.locationProcess(options, locationsuccess);
      } else {
        if (options.sig) {
          requestParam.sig = Utils.getSig(requestParam, options.sig, 'suggest');
        }
        wx.request(Utils.buildWxRequestConfig(options, {
          url: URL_SUGGESTION,
          data: requestParam },
        "suggest"));
      }
    } }, { key: "reverseGeocoder",

    /**
                                    * 逆地址解析
                                    *
                                    * @param {Object} options 接口参数对象
                                    * 
                                    * 请求参数结构可以参考
                                    * http://lbs.qq.com/webservice_v1/guide-gcoder.html
                                    */value: function reverseGeocoder(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);
      var requestParam = {
        coord_type: options.coord_type || 5,
        get_poi: options.get_poi || 0,
        output: 'json',
        key: that.key };

      if (options.poi_options) {
        requestParam.poi_options = options.poi_options;
      }

      var locationsuccess = function locationsuccess(result) {
        requestParam.location = result.latitude + ',' + result.longitude;
        if (options.sig) {
          requestParam.sig = Utils.getSig(requestParam, options.sig, 'reverseGeocoder');
        }
        wx.request(Utils.buildWxRequestConfig(options, {
          url: URL_GET_GEOCODER,
          data: requestParam },
        'reverseGeocoder'));
      };
      Utils.locationProcess(options, locationsuccess);
    } }, { key: "geocoder",

    /**
                             * 地址解析
                             *
                             * @param {Object} options 接口参数对象
                             * 
                             * 请求参数结构可以参考
                             * http://lbs.qq.com/webservice_v1/guide-geocoder.html
                             */value: function geocoder(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);

      if (Utils.checkParamKeyEmpty(options, 'address')) {
        return;
      }

      var requestParam = {
        address: options.address,
        output: 'json',
        key: that.key };


      //城市限定
      if (options.region) {
        requestParam.region = options.region;
      }

      if (options.sig) {
        requestParam.sig = Utils.getSig(requestParam, options.sig, 'geocoder');
      }

      wx.request(Utils.buildWxRequestConfig(options, {
        url: URL_GET_GEOCODER,
        data: requestParam },
      'geocoder'));
    } }, { key: "getCityList",


    /**
                                * 获取城市列表
                                *
                                * @param {Object} options 接口参数对象
                                * 
                                * 请求参数结构可以参考
                                * http://lbs.qq.com/webservice_v1/guide-region.html
                                */value: function getCityList(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);
      var requestParam = {
        output: 'json',
        key: that.key };


      if (options.sig) {
        requestParam.sig = Utils.getSig(requestParam, options.sig, 'getCityList');
      }

      wx.request(Utils.buildWxRequestConfig(options, {
        url: URL_CITY_LIST,
        data: requestParam },
      'getCityList'));
    } }, { key: "getDistrictByCityId",

    /**
                                        * 获取对应城市ID的区县列表
                                        *
                                        * @param {Object} options 接口参数对象
                                        * 
                                        * 请求参数结构可以参考
                                        * http://lbs.qq.com/webservice_v1/guide-region.html
                                        */value: function getDistrictByCityId(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);

      if (Utils.checkParamKeyEmpty(options, 'id')) {
        return;
      }

      var requestParam = {
        id: options.id || '',
        output: 'json',
        key: that.key };


      if (options.sig) {
        requestParam.sig = Utils.getSig(requestParam, options.sig, 'getDistrictByCityId');
      }

      wx.request(Utils.buildWxRequestConfig(options, {
        url: URL_AREA_LIST,
        data: requestParam },
      'getDistrictByCityId'));
    } }, { key: "calculateDistance",

    /**
                                      * 用于单起点到多终点的路线距离(非直线距离)计算：
                                      * 支持两种距离计算方式：步行和驾车。
                                      * 起点到终点最大限制直线距离10公里。
                                      *
                                      * 新增直线距离计算。
                                      * 
                                      * @param {Object} options 接口参数对象
                                      * 
                                      * 请求参数结构可以参考
                                      * http://lbs.qq.com/webservice_v1/guide-distance.html
                                      */value: function calculateDistance(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);

      if (Utils.checkParamKeyEmpty(options, 'to')) {
        return;
      }

      var requestParam = {
        mode: options.mode || 'walking',
        to: Utils.location2query(options.to),
        output: 'json',
        key: that.key };


      if (options.from) {
        options.location = options.from;
      }

      //计算直线距离
      if (requestParam.mode == 'straight') {
        var locationsuccess = function locationsuccess(result) {
          var locationTo = Utils.getEndLocation(requestParam.to); //处理终点坐标
          var data = {
            message: "query ok",
            result: {
              elements: [] },

            status: 0 };

          for (var i = 0; i < locationTo.length; i++) {
            data.result.elements.push({ //将坐标存入
              distance: Utils.getDistance(result.latitude, result.longitude, locationTo[i].lat, locationTo[i].lng),
              duration: 0,
              from: {
                lat: result.latitude,
                lng: result.longitude },

              to: {
                lat: locationTo[i].lat,
                lng: locationTo[i].lng } });


          }
          var calculateResult = data.result.elements;
          var distanceResult = [];
          for (var i = 0; i < calculateResult.length; i++) {
            distanceResult.push(calculateResult[i].distance);
          }
          return options.success(data, {
            calculateResult: calculateResult,
            distanceResult: distanceResult });

        };

        Utils.locationProcess(options, locationsuccess);
      } else {
        var locationsuccess = function locationsuccess(result) {
          requestParam.from = result.latitude + ',' + result.longitude;
          if (options.sig) {
            requestParam.sig = Utils.getSig(requestParam, options.sig, 'calculateDistance');
          }
          wx.request(Utils.buildWxRequestConfig(options, {
            url: URL_DISTANCE,
            data: requestParam },
          'calculateDistance'));
        };

        Utils.locationProcess(options, locationsuccess);
      }
    } }, { key: "direction",

    /**
                              * 路线规划：
                              * 
                              * @param {Object} options 接口参数对象
                              * 
                              * 请求参数结构可以参考
                              * https://lbs.qq.com/webservice_v1/guide-road.html
                              */value: function direction(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);

      if (Utils.checkParamKeyEmpty(options, 'to')) {
        return;
      }

      var requestParam = {
        output: 'json',
        key: that.key };


      //to格式处理
      if (typeof options.to == 'string') {
        requestParam.to = options.to;
      } else {
        requestParam.to = options.to.latitude + ',' + options.to.longitude;
      }
      //初始化局部请求域名
      var SET_URL_DIRECTION = null;
      //设置默认mode属性
      options.mode = options.mode || MODE.driving;

      //设置请求域名
      SET_URL_DIRECTION = URL_DIRECTION + options.mode;

      if (options.from) {
        options.location = options.from;
      }

      if (options.mode == MODE.driving) {
        if (options.from_poi) {
          requestParam.from_poi = options.from_poi;
        }
        if (options.heading) {
          requestParam.heading = options.heading;
        }
        if (options.speed) {
          requestParam.speed = options.speed;
        }
        if (options.accuracy) {
          requestParam.accuracy = options.accuracy;
        }
        if (options.road_type) {
          requestParam.road_type = options.road_type;
        }
        if (options.to_poi) {
          requestParam.to_poi = options.to_poi;
        }
        if (options.from_track) {
          requestParam.from_track = options.from_track;
        }
        if (options.waypoints) {
          requestParam.waypoints = options.waypoints;
        }
        if (options.policy) {
          requestParam.policy = options.policy;
        }
        if (options.plate_number) {
          requestParam.plate_number = options.plate_number;
        }
      }

      if (options.mode == MODE.transit) {
        if (options.departure_time) {
          requestParam.departure_time = options.departure_time;
        }
        if (options.policy) {
          requestParam.policy = options.policy;
        }
      }

      var locationsuccess = function locationsuccess(result) {
        requestParam.from = result.latitude + ',' + result.longitude;
        if (options.sig) {
          requestParam.sig = Utils.getSig(requestParam, options.sig, 'direction', options.mode);
        }
        wx.request(Utils.buildWxRequestConfig(options, {
          url: SET_URL_DIRECTION,
          data: requestParam },
        'direction'));
      };

      Utils.locationProcess(options, locationsuccess);
    } }]);return QQMapWX;}();
;

module.exports = QQMapWX;

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 4:
/*!**************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/pages.json ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 42:
/*!**********************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/common/cloudfun.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.homeList = exports.home = void 0; // promise封装
var db = wx.cloud.database(); //指定要操作的数据库
//请求轮播
var home = function home(banner) {
  return new Promise(function (resolve, reject) {
    var banners = db.collection(banner); //指定请求的数据集合
    banners.get().
    then(function (res) {
      resolve(res);
    }).
    catch(function (err) {
      reject(err);
    });
  });
};

//攻略列表的数据
exports.home = home;var homeList = function homeList(listing, pageid) {
  return new Promise(function (resolve, reject) {
    var listdata = db.collection(listing) //指定请求的数据集合
    .limit(6) //开始拉取的数据
    .skip(pageid * 6); //拉取数据的索引
    listdata.get().
    then(function (res) {
      resolve(res);
    }).
    catch(function (err) {
      reject(err);
    });
  });
};exports.homeList = homeList;

/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    packName = uni.getAccountInfoSync().miniProgram.appId || '';
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@next","_id":"@dcloudio/uni-stat@2.0.0-23320190923002","_inBundle":false,"_integrity":"sha512-MnftsvgOac3q1FCOBPzivbFn8GNQFo7D2DY325HeEZyFCWgx5GEwHpGYjT1PQU6v7DaDn0ruxa3ObdpUIYbmZw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@next","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"next","saveSpec":null,"fetchSpec":"next"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-23320190923002.tgz","_shasum":"0c400c140ca0b3c05f52d25f11583cf05a0c4e9a","_spec":"@dcloudio/uni-stat@next","_where":"/Users/fxy/Documents/DCloud/HbuilderX-plugins/release/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"fed4c73fb9142a1b277dd79313939cad90693d3e","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-23320190923002"};

/***/ }),

/***/ 7:
/*!*******************************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/pages.json?{"type":"style"} ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/travels/travels": { "navigationBarTitleText": "发布页面" }, "pages/strategy/strategy": { "navigationBarTitleText": "二手社区" }, "pages/index/index": { "navigationBarTitleText": "湖工二手购" }, "pages/cart/cart": { "navigationBarTitleText": "购物车" }, "pages/my/my": { "navigationBarTitleText": "我的" }, "pages/city/city": { "navigationBarTitleText": "我的" } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "湖工二手购", "navigationBarBackgroundColor": "#FFD300", "backgroundColor": "#FFD300" } };exports.default = _default;

/***/ }),

/***/ 75:
/*!**************************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/static/tab/noimage.png ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVMAAAEtCAMAAACCvXP3AAABC1BMVEVHcEzg4ODu7u7w8PD////m5ubv7+/////q6urt7e3v7+/u7u7u7u7v7+/v7+/v7+/v7+/v7+/s7Ozv7+/t7e3q6urv7+/t7e3u7u7u7u7Z2dnv7+/u7u7v7+/t7e3v7+/j4+Pv7+/i4uLv7+/T09PZ2dnu7u7h4ODV1dXX19bV1NTKysrW1tbMzc3g4OC/vry/rFjiwJT0w2jrnkdiYmG33/b+xz7+vj4caLKa2fshcrr+xi79szr9vy39qi30Zi7+zTD+1TH9tiv9oC/pUST8eHmIy+0mf8VHotlQirZytdj1X1w6kc3I7v37kCxvjZVKxfHcu0GKqJubo3I1Nja3x3a2cmApKSl9VkK7QEQTAAAANnRSTlMA8YjaAg2QAQcVmCTWn89neEYtvzYdfz5XcPLHX6ZOuOSy/qzx/YPb5NbOzbz+vd3+6vH6qd9VzOWHAAAgAElEQVR42tycW08b2RKFox7TNsY2EHOzbIMsS36YhyNNHnIeEBHKvJ///3NO995VtVddtoFwp2zaGKIk82VV1arazXz79kYxVDHwMXpGDKLQf+K3rxdVnqMOZoXnQfkkP+zXDdj+Uef65YiGTDOFCs70oBjBNb0iYSHKWBEtMh1+SZEOHuKJIB8RVcVqroOvJdUhEU2KseXT1FCQ4pPCiZZ+c10Csmbpr/QlBNr/FymJWoGaOEyXWlTY7qmv9Ff4CnJlnoNBFWguj0AzQWN45dPwC1awTrGqbTHXz8zzm+3zHqgWJ/I8p8u5Yuq+ELLdg5Xa1fDT1lLFdGQ8qIOJ2PKlf7pIX86/pE4WDRf/4cj0kyY996aCtIgUE94AJY5H+nqUL+VrhNexDdWa/3DOf1Lq8JP2pmE8JEUCFZqJ22NC6FqwlSLgPOsn5mnKaJzwdZrfzaMCtmf7ANfBZ+Xq5iVtQ113L+rUHPdH+jVAFqqBxYpWwNTVzwLVI62nvPAsLGswz+gjxKvRAteoCGSun4lpFahrSdyMImmenXXPhwIYg2htGTBUff5/ts6kGj0gZYE6npbb5dmlC8fWoTX11alVTMDHFyvtSYhpXaNKocJTs3xMhJolrroK2Mo6kAIw+MBMo840UER1i2eFGpxA7LR/VCJ9K2Cr64DHOhKx+m71obcl2o8aiaJCFc/C0sR1eVznd4quI+uqQKWyWqgfNe95ahppjaqcx4w3QJHjg6HharDgCIIioKHSZPVBmbqzpaAveYUqnNcK59VV9wzi+ipk67EeWbWqwjpQzeoDrp+KRgfVrIecB54iToT5yEC2QNZhPXdYlVhFqx8BbXRwF3SmpFEL9KwArcBcXa1Wq3zNccUv6ZserdNrKa5QApAqrq0/SGEdao0OzNBUJ1oUSsle0hwYUhwf8/V4dWy+Z8meXhu5msrq6+pAa/XDMA0tPrR6XUWdQIsyheJjAsiuIrCEVTUs1KoYVr1d/VijaECUNJobfQDUqdOjW6Qnv+xj67BeWqymrkY7gI+DFER6oEUqWY9Ec8ZrcVqci4ciJAt6PTVYS2EVqkqq7w5VHdqXg5HHEYUKGuA06E76R37S+z1oY6xcWQNrJXdcvPutAG7v7HuTqqNEVHIe62cM8+RxEbAFvXIRgBJAWIMC8N77qninZ3oTa/QMiNqUD4Ce7OF5oV6YaxKxJitcNVYurEFZNduqd2Y68nlPIv2uiQrQ3JEegfOix3fRR76qOMkPr1pTB7gIlMJqpXrwEVoVeP1ApJj2gUaVQKNkrzDMsdvt0lWzvRD1Kq6ElagWrVqqZax6t4qqGj6oVKW9JypJr4EaYWqAmeJu1/QsdxRN/2zy51q6SrCMtYhVUeUCYIrqu0CNjpl13muke4nWcCLBLtIliv4b/At3CiyqlSsrUD0qVH2remuq0cF9rZL6rNcpj3VTaF4wSk2zirXwBdkqrugDFFWQKm+rBu+xq8LmhDI1IvWtqZTRikB3nN9NzLHtHum1i+4iX22aVqNtdgoraXWltFqV6lszjYfRvSJ1RKOOxER3iqjmmZC2mWfT0hOCfo2AFbkK1RVUACvVAyvVNyur8R07wFSJFNJeSXThK2jMMoPU5NpKNAovkyWuRaymAIABeKei2m9t7UmzbU6qN4khBY06fV7kRh4QzY/MtQqzCjlF99uzx7JUQaqHrFW1qn57poErxbzPIsWsXwREIdt3jujDMW7HJvovGK5arKkEYAEIpfp2NdVN+Ad7iJastxpFnq6dZxCVPB8HFGuhuEppZbEKVZFq0KneAGqM9CCupNo+AdATJNp4opVM73HWiU77x7R/TZ96rqlnMdVVsQAsVTcAJFvz+lDDAV/3e273UWtCkVb6eytQHdEWs9vg7IJeOKxgs3sNqGap9qvVBPVArCodq74RUzuOnh9qpE6kYdpXiJo+PuZnOw40SiQVzYJ1yoqVErCDCsAFwOb/YRHq4NWZFh/lVZoTX0R6iiJdBESfINHMM0x6K84YrcaaKgB1qyzVS5P/qqa+cu9nu0+Zr7vT96NApKxRbPW7WKPg4VU5JaIxUBvr7pFeput1esnvkauItaeKUj3TrUqtqd4i90130nnvRQr2qVZGmWhTraKF5TTU5zoFvUBovQLVIlXIfxyq3gIqnOYdjOpIuTmJSBeqM2nvpLJdA7X9aFqRZ8CRY1vArokq1YACdQWu6kiZqlfPfv7ZHEj8EOkpIk0aXfhev5NNCLMMcLIVbQ3K8R6i2/W2xDq9QbDp34WsFVfVBPWaTFVq/4cm/V/t4L/soNXwBEjZQkneL7iUAtEdOnvZhTw4HI2piavCmXAy1C1/JKwKbcIrZUAKQK6qlP/i/11Nfb3RXyFNMi22VLtSFCkhPUGHv4MFXVBC1aDUlrRnE2oLKJMkVVJs6LpRsiWuTDVX1VJUTy9rjeo1Jip79mSHJ1jr6bzH1qRU2lSG9/LAEjo1RHN/Z6aU4QA0PTZ8LWQV1TRaUf8vpqqi1JfPfuNM2eorW4obE0Sa894vSDzXvP7QiT+VrB9DCZ2uS8ZLfiecm+1GkErQG8aaK4CSKpmqfgHooQ5Gr8DUnZDittQg9eM9TE27qkrHFSfqutJam6YtJvyGkKa4kZebm80Nv81YVQHQUFGpB6+nVDgr0Yl/bhq+KqWoUmugfBGlfG/HWEHHgnNM8oQ2v63z7Dl2JG8SzfxhoK5RqghVqJox9UVNlbvN7CBWaSqlVqTBaB+snMZiRTXSvbZJNSSV6gSRriX6bxDVNVKVorpiqNr8j158+C/37Aa+9LtGarpTtIBqjc3HzuRyfqpLaAh0W4BuOc35ijEnsF6ryVUhVJpTXU19UaZmcUKbqKCWHq/CyUkPTc1DW+aghpauxEZePNNGSbQke4E5n/NVuEJZlamKPVWpqc6mvlD2O1+qrH5cS7E37WzaNw+YezfLr61E10qgWwMUhTnHAKoZax6txraoik81U+rLKVWfOx+IjSrTk0K6MEj3FdJobW+IrlGgvi1tC06T4z3P/LRc59yxRKpQVEv616C+hFLVZl95/RjpiaqlzkCVWlpWTi0k/Xi6Z0cSAKUWv8FUtwJ1seHK2v0ryQDQF9VQqYXp6IWZ8pQvxXSfSoM9abAoaR9ciJIR3SqNbtjb5x6/0dl+k7WICJdWrKRmKgCQ/7FSnU19kWoa3BlRQXqCSFW7b/SpiN2M6lOQtbKiRqSqJyFRzHAFc8lP+G6m2hcAbP+s1MvLWvN/JlQ/kmoXJUjFl8bdqWWgTVtL/Km2T9qKJqIbQxRs502pnCjQ5bJ7LjPN/pP0quSapcpOdWe6/3dU6gv1fj0/HZhdlBhTVOmi+Hy+La8t94zpDWlbdaPTWp9n73Sjgd4E3WjODJc56LNCeZ4rbweV+38DUM2SCm9QeQ7UeBd1rmXqTZQZRmmd1+z1pKoxrbHVSx3dgEbVoBS1d5EmY4SYZ76iVe7/49T9Of2D5v9STCvrPYt0pZAaC1VubcQlPhyI1NworEQ3ZVzSFTTs8KxLQxP5ItQN1lRSqupT5/owZfAcpgM3P8GU71W6YKTNbs9dT3Ig0sIqD3pTfA6C65ECNcz3Jas0ihkCRqikVJpTS/pH2T94LtORX5kWpNegUsl8syY13Uk70nGlkCrrRGZULUbmYcazOucK4yyz7D6ZIdU5U5X2z0pdZEcl29RD16eeWU7BmXZQYSS9Do2p6ffGmIZnyixSdPdrSzTNnrmU5hJ6gzSpTnpZzmakzllmK+8FqjjV5P4p/QlqZKie0fvzTz2ORoGNOtvTn0oxbV2/H5OHasf6TETz9Hu8rR7mrUDZfXJTz9BmCuNsxk8iOitUc8OTmroz2W8M1XMW1Or/aKQbVIAUTp7c/U+NXeuZe8fU+AlpD3tR5ZyMC50XqzTXCV9QZoKzFMtSC7iqsqcqUI2jOjdz/58wHX4Lzp80UjL7RaVmt1duuW9Eo/rsDs7s1nqVZ5hCIfUdXjQ6d1mfZUlUM0++MvSl9P8NWipp/jRPaef/Z4bK/AB5NEBJf1ocY+LvGnvWLHc9QTXVZ/Ul87GMSrO321AclOauqWdcWY5Cc4lY8xuhCo2K0z+X1CvoU/E4NXwKUb072dPzlYu6aPCeCGOh9G062OrLKSi1pk0ZQinnN7FziqwSVdDZDPWpdQp0Z5j+DLXvU6WkXpbzqZdgKhs+c1iCSCHzd/auMj2LtmoWHdsxdIuVVJBu1D4UXX2o0KVHhzHR35ZKm6huKlCTSz0HqKPRnzClW6Pc0hTu4dHLKH/vTlNTqdqRikj1VG/3Tk6gzjlBTu+lahWb/jmo/feWCkrq4hhdqjlJeRrTobmRx8r08jEy3bMqLTNT6fek0Q3OTBWJztWkORMXukeX/CKvoNJQqT3UMqTi6bSU1CfqdKh0iio9igYoWJyUzYm2pW28fOYbdLZrvJOkDPYb15eWvozOeFCa/VmUSRVmf7T+mP1Kp48fp4Zm0k+pf364Z8GHUL1Mx63nOVbLp2DZLCqdu7xHnLPZcg/NSa/LCT/onRUrYeWRKjuqSvafl4o6eNouxd0iEbj9a+32zU367k5S8KTcneQuR5zsix/lj6JRdKDi55dSGpcR0Qkl/CRTTWSZ6sSJVbx/zn40VKVNwTTV3/fw6PnJnecHMo02+yrxm+B+HZxFlSFF97QxbnT59z///Pjx478/f97e3t7d3t6nZ/fp3W2K+3t6c9dFutz9vvtN8evXv/92z8kEsJJslanS3n861ePUZQz10cuUof3JR3cCFWY+I1U/4xCc3eNOb+vPmHDZ3BHtaP78ed9Ru+9ppo986d/f31Lc3WbSiejvuwT0V4ezj55oZjohsKTfia4DYv55nUJQ6XhKjaj9j08NaEZ9+nm+pL6so7TbP/GZj3uoyt06dKfO1qc9rErm/0k8syjvszo7kkmV/af3+YMhZ6xZp7dJoncdzxz/+zH56y/AKoKdTMSxcvPPfYqy/0K1KYD6tIqqf0Q3tvsk08X/ObsWpiaSLVzlFE+HuIqs640IFlVytcoVsFgnjVKJlJnJ1CiEx+L//yW3u8+jz+nuCfE2EBLWTi3ffOd859WDomk8pL+qR3PTEWeFaDRJ4gEdnwVD91Qd++Wf+OcT/AGieQaPjqsWUPdJPD0py4BpAJc8blB/YGps/TpIXdF5/29gup4XfVk7UZov9elRTqHiwnNk9zKn33aAfiXkHGoTjx+D6n6QLGCscqdo/OfHjGnh6Fmwd02ECl3qbpaout+//MnJtWjsZCVX4nslaRpp/qNMECUdKVp+qDpH0eieQzRw8QyBnBAvJ5MJ4yyAHrN3PQOmIqQe08OiTJkqAoHAVJn4Q4qKLb9MJZUKVL8pUdL0466eOlSSy58g1ted+3BsKbZ6UnrHUQZq4p9JUk7GE/F6QsQdT84YVk/UryxTzvQL50/RpyI/hTfVPAWi7nLeL7Kpx7H1/w6mCaQRTZ+E2ahoXj9lqWiPRCPjPHkftP694+iYcXOknOA3+hrjA/wXZf0QH0A4BTx17vTcYuo/eBUiqEL1Hw6ETAnr51oKnJ/CbGr9/+ZpRNPncfM5Le5zvzk0SjbjNvMBH7/B1p1g6fE/goCI4gSfT+D1eEIvJuQG4BKgvyCV8kwF4z9EPAtH10LgqmwfqCqC1KhAlUg/jfr8TgN6ccMk04LKDu+E9kjcFQWz3x6e4hq+PyGEBHgSQfl6jE/nd3Zd26+5N36L6NiF/uhOv9l4imhaIJApqmXsUrGTIrXfydQzlfYvW/BPabqhafo6OyPxNnKmSZyfG4WwgJ6ejsSafrDAgEEjaGMF5DgGdn73YRpW297NWaO+Wkgx7D8unCsVHrXQmGrzl9lUqKX89dfTyKNiIXVZTNfXl6JpUuNLY/1kuuRAcHRPAeowdeuOjHoyydFU/Oyudf9ebB21FtYxxFMWVsD04sthARJFmBb83X8xS0M6RQWqPFFDzW+ZtnTmZNlOJtN/pft6gqUaVJojTw6MuIJeguhoitjcTZZZdxbDaeaitDeoUefuwykUktS70wJCgOAJCqywiHSKQNW1lKSQCh71QZquRQf0+wtSOoWKaRq1m+PGvZOmBFGBS/tPlp5yzT/gRYguivMA7dGZyPk/HyKShVJ/whnzKelSdXk671E3JE8X/h3K7LTpIkyzkAZ52lTncMJMmTZ7C0PTtO1UoPoQVe9GPfunHtUbcqj26wQgRZZy4l8AqkWorcbJFMrUIyj5C6LquH+x8VNTfz2iaW5+N6NQ2vDZ7JU3RZL+LQDpalNVtTGVMXUzZd84XwTph7C9qd1Ou92ubkqgXs+x0Ac0LRjBgqRfcDZTSA0elQJ/6vdFWf+ymD4cSL3MFPlEcJrTJw5JXfjEkDS1XZ39sMsBY7oWyTZt+7nKjG47eyHgLeAdar+dQD2/+PbluKBVsjctGGBZUEnL0yLwV8kUhlMrSwi/5OmKKvI9UwfLRKr/hxjcT4pRuvyMHeYDAWnr4eiazkJSId1Mh1LVXl3dZck6DxTvYHdHmLrPFsKqdu5V/4SQZFxJoAJlB7o+PUjSft9GoeJ0IOrDtr8Wpk96TP91TvX5eAnP8EBpX5WfD2R2v0eYdBYDANSo1aL9X11dpWSds99t3e6m8YAaJLplqrsoDtRLp1En+0xRQlU5Uw77S9GEiYi6qaU/6kwt7KDmGtAbi+fM1aFnLfl0vlG6UpzQI5ZZDDoHiWcnwAFMNR141Su/rgWs87v2aspuo3PbgaHe7h20/n2Aqdffvn1OIaWECjjKqMpS6kBmUyFG5QRVxf2Lu9JrOZruRKLf2zNhntL8M5dNoLDHPWZU/CmQtCaJQY5aF2A/O/CKV7jaO59/wmsiud191TCiHlSDb1aj+n/+b6FXGfwpIBog5b7fcJgrpPaGU4sPTcn78qQ0faGrfEl0yreCUwK1uyWiUr+GiIm10Q5IamqiqMfTKbhnqkXlKl1B3Kzd1wFSB2fFTsSDOoshJZ0S4lQIjZI1/+0hZqhbqjUVtVDlzdKWmY7UsydxIMWgcpVPVk7kMJRM7+0iSIGlwYkyWwHUxrvUFFJr+T/AlwKkGDGQ1dOb1KBT+7QkpqE2VRBFyzJNpoaSqCHuT6tTCzCNzj9vLC6fvIybJrE7VZaPkO5xrN84V0qiYmzA3hFRqwoevPq3PTSdel9KLK0bG/MLtrtlI11L1LsTXNqhBo9aRO0p1Zvew+L01mYmnNrYERW/PttP89KdB86YqBb0oySB4u4o10zs/yM7Uzb8uv3h15RM3/O0qhnTxvrNKyfwQFPvTJ03JURpfy0ob68JaL+v8198EUIVav7kBQYDKVNDCSpl/SJBhXBKOtReUNVpqKTK9yJn+nEBZVUecA6IQqgPQ6QDjqI65FU9+kHLGGSpy6yqFkF1aDZ+BZoKaVL7WeeMy6ksUecwMnGScajKr3LHL7Sm2fhR+jWmcnqqx/jDmT01cfo414eSZT7ElI/lcgNqFy1f2r1dp0hTj6lHdfojrBpl3y8gauMp6mDtgul3AVEBqdvvfCsKnSPq7Obi/KdFdT8W/9DvL0qlUqUaoYiJKsKptNyfoNoXnD6Oxs7kwdLQMV3V7hRMX6jTAfVFyZtWgEllvOHahAi+V3JNQfodoG45DzBlb9pJw7f7p+A+0Hk4YBtn/LOLn+e+2pcGqIxmGKXSpZTt4FFVOJUaf49MxZiuLAxOk1k+eVJHyhN3nbCDx6KPkaRxUHT8rK6YphYUH6M2hKkF9YriqMYHpu4L9rv6C+1Hj1x56Z/NnTc9VqovdIppOuBOashPh7ozJcb8IqL2Wb88qL+y2PT1YV2V68vIVPeboYd3SjxrMOdpLBAt6L172pgAaWUiTNn0ax8zQO0E99Nbke9w31qH6dGF9KYykpLSX/CoT1Ly2+s3/p3FYf/aWr4kRXlp9kZ80p/K4r6KTGX/fvsUE3XrHSGObAlI+9JjIhc61A6KJBZbMv1g+7AfhMnDSzz3xt+2zY31pse5wL8sqa4qx9Ok8W+LSko2l4qqqA/dT0LnpS96g9M/376NRD+e25PzetvQPWocTyEatRY7IieImBpkqrHKb5nmEXWK1gVMO45Ma5sAYFpbAabkTl011UVTEU1LIf5lOp0SO1QxPfVW91CSebQcUXv7pT3B6R+J6XM3P8RR4oTTNmPqMMKUySAEjl+AKVkuRFOWpx5TXxxATNuAqKlrrhJ0kueGMJ3F3rSU+l/GTrUcDAbLKf+zeCJlGUyVRD3NBvx/qoBfJKWc5guWuvlcaHNCLlnXRkAKGtOw4RoUKY+pj2QZUwz2qQyNZYIO1SosA5jGok/SX3ATFWqoNJiS5lJQnYLxCTE7tfNAfhrf/iB3aC85qJ8N+GOBeiMONf4NPA0pZFV7W7efPhYaVRITwhRT2JSnpsY83+Hn91MaVqHwW4f6aV/bvdb/QtdRymh6MlZ+MH50qNHUdITpWqZfmjsU8SQJ+GPRlwqFZ0jEEad3aPuh3EHxJET+JkRCjOnM1DPfrbLCNJX9FqS69x9V2B+iKeDpv0W+OFVSSCUq0ypCHST5KQ/4C4e60XsAPXt7nnQ+8pXumoiWqQ6kaHpHypO75Dds+xidkp40yDK9wJ9SKMuYCn9aw8WpWtrPqFLKP7uNBUp2plWqGjf8hgPpUZOwPy74rWUxXe/t6z/N3kkGS/yriUIJww+j+TY0uYW+R1fVsq5vl/ellQj4DWNqeWouj45urEOtOZYi06eCqfelJG/4aECj7veLPFMLmfXL0akyNz6x66uo2viV8qd/Fe23Sqfib2xo0w/jkALSN3zC6f1963naVKLa4X77Vkk24zoFTM2lb5tUne+pQrUAUa1cemtwv5FJmCvBuoxhdv+xB1J6UDGqGkklUGPlf50x/rjZl7+lee9RfRmdijhqVdEUVF8eFx1uf7yfeeNvLRJeXMj0W/alChQf81vnO4f5vbpuQ2oLhWhQKI8pFwn5LVwe1VT3l0XfKuWMT5m604FoobDyq2o/F1HplrMLu3v58ZOXT3pyfYHpVsjz34Q7Q7j16/4SjN+XTWnUwdc7GiaZYaJ2Pjc1M4MDaTd1F4YCDEdSPjZtqkqztAJ32tze3yYc5RRKV1JE5h91+tNUSjlUUUhJjkGnyf7z3Lm9KJJa1QqlMiimqb8XxP39LRh/R2E+l/WsN5SelCXKYlrd4NTk+LIWYwEoT/5aGLGfLw2409v7e0JzP+lLCaoK5Y+H0UmkhEN9nTjU+NbIa1HH9MGD5ZxDvc2xFEt8b7aHh24N+RZ5jGnLlWPg5Y8k1WfTt/90TuPnRyhSo5BAQQQh9/M1acGd3mdFKqBaKF9ayoOTqoUC/VMhUs+zx6WWSfaj+x88SRqmom4qIlOL6OGh767ZR4urOyn6zv5+sxaj/iqACjXUUYxpMwKJugzHIi4bafyGWJrd7/rRTvYDTwspSkWhBqioLS0m/Jioe9loKm6f5jFd6E5fvZL3jBUBfy42PTjYY0Dhuwv1Ptrf75KIyoBWVJfO0HTUWjX/97tbn75/+vnz04wb2SRRvtaCmIp0wTiaTpvZza9fR0mlT9g9gToo5CG/bNi/uwUdFCRqiulaH6YLaqdpcBpYuroZjpBbkjpyMqD7+//xqF5bTDGaCh7VAyByIKO86bSpL7+Ldd2SRw3zFRW0tIzajX1TN9/zpd/mSfTlLHpc7eeCXxJNxQ5VxFJruS70A7XTHE03tzaxHrUn8WRYy3e/7EKijkwtWdVob2i86Duazsx3tS5x1rxhbwp+oq2U6HnRt+706Nv5zy89nlQ3o5Tuy6R/+3+UXW1T28YWHkWdyc2NoJkymd6KZCLe6uRDMsbMcG9QJYwFBEuMXduB8P9/yd3ztnt2tXKoAOPSQvHDc173nEf7vVJKDfcPTaI+a6bnXY+nJCrhApS40yP2pCN6zxFQeCtohIxnby+8FP/iwovbF9++ijf1Mb1pb2+dR75QPZMLj+YtH0XPmqbpY+oTM+0v+OlaSvWm+ARFl/xv4z3Ul7Fzk61KhxGaOkj3R6OQovSQ4DbTmInaBtW9BypPTLTfQkgRVCpQnevoZQwGUgxQ48qAuogU/Hr9zN/x2d3V/X5/up+yqT9ceeot9vxrG6YDI5KuigpbUv9md4qJFKRPRRaAmuRJkRS4TVKuedixVdYqGT/T9YLm+tr5vAepcanM1AtbI9g6QSjb0rjUGiD1MNVHfPZQSi+kxNJ+/1RKZ6jBaL/aQIseQ/9U5NQ1o9VY9Puj3YIR1WRNwAXkCS00ljK5f+uXPY5vPCppiHZzswXUb98uQi9MB6btV6TpEjYl6rqJ9E5kUlJvTaUy3+sPT1F6LTv9vCltMI1M9wY8jZ5CqwZKqMjZb0YjpAe7DGamLR+caZKA7WOWuWLz/Xp77/lR8a/tVkiN9Quordc1kSc8Z93OV7DMVwe2n3lVqW2heusTKkip8lQNo7FD3TKLNnAM7U2ch6b/pz7bszWUYSlk+L4vxfcE2DrFdcayfBBQwCv2Uv1bgXQZh7QzoIpTveuFp2+yJmGcKe6eRPxpZk9NlfW7Az//VNqu9ry3QerXwSAlmG4/Mo1IcjpMg0P9I2P2o6zIAndagC/NE7H9aTldu8Udk4Hq4qe12zx365vBq7VUNZmqzqHuZW/FpKYr2DqtfUxt+yR1ccnzCO5gKupQcWR6oC8doekzj0zZmwadUxrm2ef8yfemCb7BA6/klmW1RqbJWmOLE+T3CmjzJYbv6en7kzz9/v2pI6bOHagG1jvalWjdmmQ7v1+OaZnP86eqX+qN+KiJn10/SoUj0xCkfu0fSvlHUi8Hwn6AaU/m1D8uBUj3CuZo5nGUAn8CPL3iur1ctRqUyCJfyzh+h+speNp13Xr4B6AnvjNlKWrN1JyfFsEunyqhNGd7/rTXQ433+uhM64gAACAASURBVJ3g1MuXfUxfee40hukbz/TF9g2khU2iRs6dIkkxlUrsWm5Vbe4IFITltrcyau0egfwBzx7NZ/O8A0jN+yN/f+zvMYd5IMAU1nhVzp95g32Cp31zOZZSStm3DpVn0eLVqS/kE6FprDKN6XC7TMrQ9AMASu50FMQoiPk58ZQif1mulrDN2IOFF0YMaBbTH+btkTCF64aJylRt9bfTZgRBencPDhVGes9ixyZZvy3ljfnv9mcnjvhQygWp3yMtVA/ToVlet7vn6ciFh/oHo6IXnRIK92D4GKPOLahVOTavet4SLK1ewW8fVtPuRvH0BwHZwZMf3wXRrpuuBNXbr+6758vx2MM0mOfVSapypTZaOZpm3knfwQdVnfL5CQap170Jn581pOnItDcsoQd5EdP3I/CjI85MszBCJfgwYeEIVC1aA6hzhBX5Sp/XYxDgcDx9cv4Unz4ipAgrSEo8rFv5u+C13Jw1DWF6B0GKMc3IoRbiVWUIxRuZ0uVVpld7woO+oIXqBvu3YxqTje73o+2myc7O/qiIRahcMAWaGkytiImx/jliOl9vHtZrA83aPFmx/BHAxtfj09OjJKaPj4g185TlpFYb/vb1ZgyyR3VztkRMMUE1qdQphSiwFrgKqznhb/SkLlb5hyj+Xo9r93HF//rtsO1Hwn40RPmQMk0/ZOJLQ9NPyPQR1omVhQE8NncM6qpUwjt4nXWOqb2UH6/r7pJ1j6Ys0gP6B7gQsThbE6abmWAqeOKVF6mXo7pcNdMnqJm/0e8O+v4Bpr8MdlCGVBDsqMTOwe6oGBFFBVXzOlJKpdCZ4nVqdTeQqOalA6bzsa/AZx4bRdSwiLohy+8WVp7LYkpiUovFRjCFsL8oUg9RfLctaTUymQZiXnqn12aoIaaxij+4BUcsPf1PT/bsz2BU4v1+NnJ2n/VdKX0kxyLEQ8gxUf+3XCHfnHDctOoGQO3E8LuuIZU+k4MKpLy3g5j+bX72ZoXpaRJAah7yvAgKUu1WnU6iilIfwur0uZgONfkDEcnA9Hf24LdQzjSzyX5SOETNSzm/cud1lE8BT5ebqlTKhvCx6OLW3znTnynFQyfQVdeLy2YjgR9TqSTp89Q4gMKFpjRTij6p25fyN3ppwse2+gcS1G2Yvo4Ic6qbGWlMD7JR1ov3xvoNlKnlKbyQ48mUZczIpY7Zoy5XorXJMWpad4Me1dJ0KpZfzqyWFNK0HjtMm2aSJIeapA5VtcWfRoampT7dVwlq2EXZgukvsY60w/RdXAGFIT0y/3OO+gpWhFMZP76eiagcsV6ZeNSNE4ZlqjadNX95VHbfmQhVORVJ5UzrxaKZjWmnijA99kia0yM+KVRe6h/20TmqnPLrdh+3+mXAJyxOfUyHRbqUXMcfXnbK7ZM9Q1MDqM34U1foJ4X2Y+aFOLk9FC0dzy1RWcXUikkuOosqUlZqUob0LxugZkqU1+RShKniqedJCdCc0DVO1WlO7GZBoMp6y6dDCepbJ4wU4Wl0L8qT5/P7fHBocpBJEqV8KUb9xPpTeIAXkl+JuuGVzaccUbXxT88vLSc1P/mqK9SPRgXJikpQCfrNrBpDjLo3PDVf+CsJDd8xNedkVZ9JRVZ6ndTsdkzjtj/Q6VPKnNhA0Wd7JuZj6yTLCleapgmnUYqp+FImJfWlkZGVS/xNHcn6xqUE/2rRxS8Tn2qW6LbqsZScojedYd1LPDW8nSRhjGI46Vnht1MGm/1e0i/HfM/l6ashnvaOohDVnb2RDfra8gsV9dULOi21ZmkFRL0nooqIOWeq8NBcxkHFkK8tf2ZFjk2AspjeLU2dujh2Icp5VOsBMKlSy+d6r7/Xlo5i+tsWng50pEORLr8uNTF/Fwsoa/ypRHwu8TmVyjneHqMU55Wkoqay1EQlRKtSXGsVQ/WyqfxkX0mcLwxNjTMQnp6F2akASzEKPxWF7Ux5Wj6pf8wnyRQVpxFMvSAVL6Nex8sofzYaLV9OS3Rh6jtTvoAuJxOtAmsc4kx71Iq19umjguQfzpIXi0tzEaCLmgT6S8yhPNF4oGlTGw5XD1RHGZ4uJiFNxe5NdpcTXQulOOOn/252QhenL1zSr1Z69K2Pozx1HWlvmlfEOhxN97LChXw42EeuIp5QEgpZ3XUKZn0lkrql8qh4vwKWha+mTnsfobcC/fSfVB5La/KnZPmGpuUD7aguF02TJ/24nwhLc2aqZ/h6aRodAN62Ys/x1BWn/4Cnr2wLhQ5N3/k8VeMnR+BMmac4a2rCFRf6fTjxOjl3ktBkweJRxxjBrf2zTy2Ft4CzZLEsbU5avDVJyEnMB8yl3oeofxgWpsqdErCc/fvd1FTWet3ZqRT8jqfRpfNtti/C8V6T38d058tohJAyojnNnhmCpnKsVxx6uJ4kEyX9HhK11FyVuxhM+bYR8oVKLiUXjzRllmLgA54Cpqd9X5pwxs+Wb2w/z5XolO4DKttX/jQs+J/NU2f7NuXXd4Sl/snBJxrkIUiLj6PRRwAVeJpgfy1NelT9fD61eT006sCjSpTim0AoUXgxdisUz6WTUuCXbB9YOqNalTF9rJs4TS2shKi5skwW0dSbS/xd0v++j6kqpIb9qYtRqsvvNaXoBjE7I8TUXXmBXFWd/cDw4dVMJLGvUPx5Wo3n9wjqhtJ3cgCVdZ6Vu/kG9kpnQtKK7hOBd4nBSCbOg3g6X44Xp36EsmgyR+WR2lSZf5qSus2e/V2/OO03UX7G07ev1HqESk/fqOwUWGosf1ejmmOMQqZSIZWoNh/99ifJSf75XPpPHL9XG+lNz/jGOhZDj6rSMVF2L+rGNbDUWD6lA9Vawj4iehjLpjj4UwUgaaon45mmGlLq9vHYxE8bU9tzqbCMUqd7MMH3KQt4igOn0t4vgvLlBKkxUe4RkRrf39+h8UPIEVTFtarPVI/yfXcqPy9tIIuqiN7Q7DbUX56dAp6HfTRddppzlMqPi1Rrd7vmamD7A5g+i6e/eZjqsR4bob4AjD5PDUuLj7nNUHWSnefG8k9y8/b5vJJSiSL/qmXjrzGaE66zspKaXvCsPE9ay+2hoGVKvpT/GICp+SNtzgyeh0m8fSo8lYQqT1xeqg78NaZ7PIP6YpCnP/Wnri2lMFUzPUcMJaNacNyH0X3w/Im1fcWGBDDNJ5VLPQGx1YYxbegWRRXHGnGvTFbzD2WFXpRb0FSQzprL6+t6RhxG3KHXbX7gGL3pYdA9TTx/Cu8UpbBJlbopX+tQVTJ1cODz9Pdnx33FU4epmD7exhAi1M6+tvpi9FFGpUZuOlL8qL1O8Auf/yspE6fvY4784BQ57ZSWU+mCErvRamal99H0F9fmqivxDeYvBR1EY/rjw8OIM5UsKnE8TSROZR6kqWr3QXEqzb6Qp66OCv1pdKA3xPSNc6dfPo0823c8/QjmD399JoCYPv7mJyfm84Rf/pStdXyHRF1CFbogyyZgyRXMxH9W8q9qV48akl5fXjfsHTBI0fHB+vgw6Rm/mL5FNpcUNXGg6nGqzPal6UQqciDVv6/E1r6Utn0d9V8ENKUKiniaM08RV+ezEE8DLMb+CYJlEyQ+Q1meLQzpNKriOwVYF+v59AlJemm+R/IF+Ll0drimkK9QzfsNv2OJVfgrquN+D1Ed9/WBlJaYVDz9P2Nn3pxGcsZhjyXVehPrSLbs2K24QmZ7NEAYZbCrmK0SBhv4w/K6oIASle//SdLv1df0jNUgBNJaKz383rOPedGb88f+1PX5TIAaXXlAS9oPBVJVpSKgkgAqEWoBMgWyVbMC5yh+1QQVx9SMLVbwgUgXtmqyRm8GitQgXS4fbAz7THPcuyr3o36eKvazgKik/t6hyGeRTnvi/k+YvknY/nXYO70sWzItWahDFKvOCGvGtg84+VcHqNP5Z3KamHXyTP+uXhNTAwqyTQuS1InX2rCTzphC4X+KQzIu8CSwUPLxuzJMBWve0mkmRJXDqgPrp2bVlV/wR0wD25ewf97dP/17kumNhP17cqRXVqVDTE6HCl3pACyf1525TgVCLTCf0sXHxYq8JV7xoQYKf+xO2yUz3awXVpeSOC0+41V2VjyZB3ckilQlSH3GTp95gyqx+jxKTFUwJSVZCe6Nob7fa3/dr21NJXTa6kt16fQi7U/DjB9ketvypyUF/XIgIcqFfYRbANGiIL/6kYybrku6pybqcb0UqFu27pWVJotztaBFUYv5Gm2fZEoO9QHfJnQkTqaANY+aUlmY+BuFok4NVrfB17pUmeVL9KUS81HnibU9Xp//H17OL10p0ul9kOwPOEKpAUf8gcQnL7aiPjnrx8z/44LaSIbpar+jwP/JMl3MzY08pyyGWHlczXfX8/l8a5mi8aP/rQ/w/vyXQGat6tQjKu+2jf1S+IcnT7olqHFfKt4lETP1zpJ9E8ydhDGKvekoDvvl0HpTYMuzkta2nPtCBwBUq/liteK2Cfam/kCmS8JqgC3ggxmu7KVKzZivgSd8c2uRsvGbn3hkmeZnAjVPFKe2FDHs87xwWbSbPXVIbaP/Q7sn/VOdtuf4AqZSmd5jYnrrctMBahWhmvebjJ8XSHLkz9ChmkeO/OZjaqx3xYXSHtOfXb1kqMs5D1AkSpZfmCeNuclwOt0+UI6wP/wgmZLp51noU6NmHxLFYamGCdXrq9eu3v/998sP/or+59r+RTzHF7ZP70wV9UFkeuX3TyDfL5Xkp8o1fjNpqmfoTw1PjWDzKfaSsLBfUTZ1EqZbIQoPghCewN0MYbp0g64UuT7iQmFgRdYfyVR5pZTykBJVbcOUYxpMSH2I5veTi897dptGOrUxynrTUZTvg1RZpLgpIhu4DgU0UAqyes5TzcfSQF1Q8UlRasd8DNOmEUE6VcqLxn536Rk/+t36EZhqlOhZLk7VidOpVGUBURhkUIN46UTQlwrnopObJJ6v0/fSkCZvetvO92kD9CArZY+ZqwGVpKgZOAA2fm0slvylROvdiXW6Bi02Mmb8wn5lLret0+kWlqB9OnAehUAlmUop1TzESHPOoP1TfXx/+m9Pp51r0M79vTyJxhQvP/2nl0xZbxr1+Ac8G8XpKUAduHIF8RYZ3iihQqpAQiI6pqg7Mf45KnHG+NyYo93jsxl6AqfTJSRZx29s+Zm1+7zd5+ckKm8Pif0wSwlY3So0j6l3LEK7fXre2h8VNvqDuegbZvphBCK9dc50UNoIRUJVhNMWppmkpxSgCrJ+k/iTvogqeVQyfhOiWJ4z+tR4cGeeYOeN51C3sDvikWI+etM8D3MpFSZUeZ6EqnU2gN+xKrIBGz8x9Y5C7GlJdzBtresLdGpkessyHZWjkeT7NG8im3ZxvalSFi3ORSmbnFKQKiwLwFp/Z6FuwZ3OZg3f+aGRh0CxvvEv1/V3SKOw0AegZ16YyuPelEozzbh5hqPKgj5/NB3FSyY6mcZHd0QFv81P7+5gYm90hURhDM2gjdAwuYfb9HnXnlf48Z9RkAPg4G/YOlcIVI9WqJu1ITabNcJU6IpOZ066vvE/fUdnimzIneaR+Xu1VBopWr8QhYeBb/tYmr6860356eieVNx/YxdNREyNTDk6jRGpAVwOWau8rxwcACT8rkQBmiRTjk4c+p3Zbrfr7adHFupm01iQ+AQZ4msBKnL1s6kTqPSxEo6c9OdZkKFmtiLtYFpYB0UjC1sotJfnumcZSt/pUlGzj5leQvfkVkRqeKJQeY+pHC2jeO9OWJtyKpW5dEoyJ5OPQjv6BFN9O3KnTqBEVSDzF8gRQCCzxn/aPaLhk0rF3pVyCVRQS+Vdg/TJOq2KatBKpd62rnrUy/QiSqZipi8nEKFGozEzHZbDEVk/FaZ8QM/Aru+WPiVJtbAxH2pUZrqhLqiBg2HqRNnpTEYjQBv2B83MC1vz9cZDiio9I8eYZ6470lo4obJOpLmYfc5sASpMneBsFLZQuq7R8RydSuAXpm/f/mU8uh95g4iOSKlD2bynnFIziVEu3adEtQh0yjXmzkDdnTZzUafHNXxNXhXjFKX9iHRXEc0zMHvXboJ7a11f3j2oyqtskmKX9njL+YNUqs00cX2zaFGvLaTuJuPxWFRqgI4AJ8YpN2+CbT5cLe8m0LmWIrsvpEQNmBIZcKn/WzYxQ7J261tFtqhV7KMg0tMGc30SKTZrNN98qaqsH6lHU6CmuqfverZHvehffe4W9r1H0x+PxogUsZZk+yW6VGqdcpLquqe8lheHcoav4XEZQt0i1B+Px3mTUGcTuAJXW83NPwWkRt+bqVh9IR0R7R69qagedyo69Z1q6XdPEysl420n7QNROPC3ZqMNUyPTEeqUlQoh38iUXSp1+fARDH9gZUpEdYWSEZeqEjolqLu6aas0fCa5FZRSbPcn8xOmHO01ehxtLZ+feIGqR6Z5jNQI1R4y0+5KJbbvdySorcAPBf9LMP2x+NKxOFREOrSVFLVOoBlBzsvyNA9wpyYqpAEJpgx1lh5B9KcCdV8fQaQ7mOtjnYq/0cr5U7x7c1F9Ms0j2wehOqZvb278XSd/TZ6A+svzOlOGKSF1VId4I6q4TFLO5qONu6gLLSoltKoyWM1jHPddI5Sg7pniQxdbiv37+kAipXdmmsuEIjVt4H9uuWqtbPcxf4bt25yqqtRvLuy3jpSOUv70WZ1xkBKmd4FMwfRLyPlZpxCo3HkdFPcpRFQIE/881GllvoiS9f2pfb6sD9++7Y57j+pDmioQxSXWJ0QKOqV5BGfwkV6tW81/DrXyyFblbx0LJY2XjCf4kteOCnbwO6Y3l2PS6ciFfgxSGPiJqXLdU/grhhiZNGm1IoeqBSzXpoFMYdZktj+Y5P9Q75tZp19FiT5hSgqzAxv+KVPs0hY8t6iVC/uSApCn7c+kCGouGarJ+yv9r+RkVCJEtS7G1+VQMZkS06e4X3rmT4PCvxx7Zn79oWf0ij8qRV4V/0JRZiBUSE6fYIr+cKxJrF/aWcCejd440hry/g29H1O7LsvpVPtuFZ7rPqYFOdQonaoqv3n6/vpd3wTfi56DJaPA/x4i1GQsidSYfCl40pIdqhnK3NWQIr2IlDQqEQp4ok91tm91CmJbYCJV03LHHWBtXC2FbA3P45EkajS6N7F/QT9kuZkW7Ew5ELJMNfHU8vJnOvWdKTnUqvRN/zpxXN/5s5hGQer9ZHwvMQpupS/TcugNDXdE6pRaMV7FgHXsTzfLDXdOidzT4fEHTFDvjse6rvdw25snBudBeO7AP2DHb43/HnRakNVrUCNrVFu3ysmV1v3eNIr7YPvVMNrHEzG96D73/NzLUOMgRYnU2KannPVT2k86LYmoVgx0GIT8QK+FubVj1Aa6fGLp9eHw+EPwwRCY8IWDQb13bVT6EZuq4NluP0CxSPkRb/1EyZ96Yd9Q1R3utPOaB/71Ti5epdeiXF9OwPLvJfJLnCrFn5aiUQYrOlXOpVacTylVOZ1uPKibbdO4emm2N5p0HC3ew/Gp3tusn4RKcZ9LjEwHBZTWHlx8nf/E9vMiMv2qas/vSXb6a+I4ae9aR6+6103cTDzbDxNUG6UC2491KmI1jhQTf/M58qcbnIcKE1Nj73DWEZx0RKOGwGXbgFSdNrwc7U+3mqiIYxO7AVIqhqIOkRah8Vdk+9W9505T89CJq8f1t6YM05cTtP17cads/i2imlXK8mxjFapejGKd4rS+1z/BeP8V8H4GxHszmn0Tp/0kVFyJOlUJ0w9KKRZsB9OC79RGQZrsTqvivmu72a8B0l9eJIXqL5bmOal3764naPpeMmWlSlMolqwWqi2eVfwsrE3NfTFvvHaeZFFdhSr1/dn4jVKXWkc4tRZp8iMXVL3xKQ/KffSmrFPv8NO/JZb0ta51REjPuxb3vZ1MwPgtVg5QWJoCzlGoVeGZsH52q/BZVCqBf42m3/gy/YI3uD+0WqmePwWhbrdVUDB5EV/bsE8OtehKTSU/dRUUETU67b4uj7vU0XnfZXhbxn9pdepTHXNbKqCqRa0xUeXlqMBUy+JRWR85X4SFUyTTL4nyFJUKSGEj31T12r3NVnWWMn7rSjk/rRxR0Km/SjIs9l9dhL3TbuMPmF5PJiRUAer1UUZRiLKW3xmnEG4FfamNrU2B6VpmRmyQ+gogv4pa435fI+0ptP7t9hO7UydIlqh29RR9Lw+gFl4NJSGq8pypZWrP6G1dj6/jWpydp00Y4zcRavIfc3NC9YhGkUp0CkrtsH8t/nQjlSmujZ43jdd6To0ALE2h4oKU/3N2bttpHEsYVrCFCTFKYpaPEyIhZAlmRjMC1hIXnk3iha91sff7v8vuOnVVHwYhNwbhmAjm46+qPlR3gUM9INNEp19sB1XGU1+vryOpfo2CvlEpktXp6GROSjr8Z8+Wire9KTB9Nv6mjGdScko1Qu1pwDWwfIn6uxDhN/fwjWn+m85Mw+wApaMB1JSn9aVesMsbdZ6+n888r7UD5eOTazd95fhMj7+X6euc8f9Vs+3X1p+WZhbFRn7uTx3jikPVLz/MvBQyNUP774Eo/812AmShv+PI/3TzJde8SOmfl+xQv9IUlHSfvnpfanqlvpWTcVQ8ykd9P4HynE7PIWvKGz+7U4G6kiBVsvE7hmXeo4pDXcaGf+9t/8c/Vqfh+t53+PM9Mngz2U/LUhij4FQEF6Rw3ST2ADfqY3nykYF+DXqmTPaaOVqui5xMn2F6dEX6z09MtCqlk6pCXWahZrCGE3/cPzVIYf4ksX4ZVH0nwOFEv6ROYEoqMN1EDO1P/95fYDzyxfebRJ3Gm95HIr2/r0wZ3r/7a/JkmPbsk/r48e/b0PhX1vxzw1MdT8m4fxkPpdCfBnEfu/y7XTCz178s9agpVDtOTD9sVZy0vsjRfylc9YMQRXal19fG7nnWJOA6045UZjo6XDJNmI7yZ3d9GidQV94DANEyM0i9sWP/DNgb5GmClLd9hvYf8qLfd2Zhahd0T31GKkX+rR5xQq4ToF5xrF96y186nwrr4ipTCU7Xfs4kQFofrxmZmZNKdHqeRqlP0JtynSm0f6VKSEux/2XUodIgleuo3vywUV+YmqyoxyTBJ06i0BwfcKmHw6u3r66iw1ilWgDvNdQs5F/8iOnaG78ita1Jyxu+O1bbNOr1j9INfTSJ+unzh8FgwmrlMWpZ+UVpcKeg1WUVYlWq1f0y1emPHxYqpe3muqjfMlk+QeYUBf7DnT0hjs+H41qQWmJTdpBfXadavbq4iYm2jT1RLilqrqVOznqD1OswdcKPpWiyH3dHjif1DMA2rkGHNcqfSjurFdFkvXon8E9AFNdNut2uN1nCpPrt9O9ep3BQ59IW17uIahWHrQCqRqjw7Bd49SqkuoqrcCY5PfEU/1Gmvblot3R4DxePoZKmc627K7WM8TTWAj+9abpNdr0NkOIOHulM7az970x2nx/na9IU+9P902H9Ki37fKQVF2+vON/0+uuXK9wFCbelYG1LSJIy/X0tdWAi1OiI6fcVN9dZVM3tHQSlzKWYsa8PrVTpbDYGK3bILYL6xA419KY7M8DXManmocmeHxhIbZTo24wuC39K7IV+1W99RiSf0AMpZ6v7tm2Xczyi74hMrU57mCYe9b3dLaEJ0x8+3PrDOqFC9MQXiCapQlax1yljVZ1e6OajVQAVOlM7FarN59c9EzYl/VHd6Q6NfyMONHCcAdWC0RJB93DX3rf390vPE9vdPS7s+ZrGtz0dqfNMSfNEqaNoB0qwJq2JqCzUoVYy90znVqdTRVoYpBdR9Us6NGfNpr8LIz2HokfN5qe/0o2z+/YHYLqV98gIFXPIFav8IHz3dxbpdHqHnLEWj5/kCwpFR+40G6LiFJ9RLmnyEyei+mNRTCnzxSwQqjd+UatSNdcbgr3b77iHutOEMw3uRLPTPT74yPNSOC19OARvUAR1n71Oi7AR05Ul6j43jp7U8gNvmjH9HqZ0NsrrfFFOf3Sf2c0rQmWfao2fHYCJVEXoxIyWDFTZAWVcZxftNdF9PY/mP3fiUBMnKhAvrCMKuLJOA6TOn4LtI1IJUPGw1K6a9Jl+tjJffi+/7DwdDqPS2wbq1DOdyrVcJH0AdbH4k4b7O+NLdZ7E7+TZGZk+yj8K05XFWVx4VaLdF/kmTPGzUruconapcEQy0n8nxXjO+8elx0P/b/G+niBKjX21WAxTi4VR6iV9yiIKV0UmIlPbdOo3ZfBppvO6rrOx6tHsQAOk0Otf+S8vUmbapvTgXCfMQN3RAccElIpuszO1ASrypiaLv5fpmYF6nh6M9KfZg/Lh1hY25jiFUg08wFTlWqhzNVcZKHfTca/fIus80T1vin40XsDwxtm+4lmYU36Ur3taKE6GirWMESkk8GONaJZp1pu+6bX8eLvEkbRJD3VgC8ZOuEO1sEwv7Yctpj5kqT9Qr1BsBJnG+U7W8OD8k85v4Bfzt0unsNC3ThHKt8nvzvgK/UwBzil+7Dn1otCZCtIjQf/sGFNJnsgWPgo3S5nYrwW41al6riHTBKsV1MXa7oEO7BrbnrB2wd5ezuunwelh48U4JZrseqYnNgbKKh37mK/eNJg9kYPPzk5ken7co9qOfziemov9axcgIDstipQrYvVMdVkElYlHmsNeXzL/rsuCB3+68SZdTIuQ5nGul8TTESWmMy5shM5U+1Fh0H+dXS/tYTo6NkCNheqZ+kFqAHXqx1VK1OjV0l13Gt7NPB6eaX7YrFer9UaOmzDRS8jjQIp+cw/FIsFoPpkIAEQ6t/FJFksl78xW4BudzjTKmX6vRyQEI9QPyjQUauwAIh+QXinBLVmCnb+L/p6eNuw7NsRUHKlShfa0LU4Q5aUSpTHfpVcpGz7PnIAzjS0/mN9Ps/meY5qtKxGc46PHyhuXyoP/RUw14wWiy1+xAlmunfblJfqspqsNnTWzs5NS8OOAvak8QBotnqTnwgAADdxJREFUXwpIYoj3S4lKavYsUm/5v3uZvku6+6NTmHImaia5P7en9/Y2Uupkpn2qHqyX/tqmMeGSYT0GTOno/basqiXmFWzNMTPqc4G9e2W5aorGGvPUPIYt/FTyURcmPDHS3wPLt7t3TgpRQeDvL9TjD/K5DXzq2Nu/d6upEwjxolNocLWgKtfiLPnG60wYohzTZVsuq2XV+jjVmc6rUyn43TWtlNPyTrOaNtMmT5R0CSxJowIUoxMiFWeas3xj+mdnpzI1K/1xkp9uQI3ilE6ozBY0qbIII1aA1l1tY64f2po7oIyJNIhED09tVbXLtnJkq81eTkgKzknaQ5TaVrRiBr+5WTWQOONuQLYxBk4k51FbzBOknwVpZPnckRq9jGkENT0S9XMCdcJe1fvVhCohhSUXTrrCi+dlQ6NTPeuMTt93rQWiFQp1fdjzQVPm+C6I+ijUtgI3QQnI7p3g7lqBjwg23/iTzqirD9shvEqjmG+96alMeSxlc6d+TUr1RMfMEtRgSgXFqljJEdAFkngk+YqRLstq08UNz4+EEPW0bl1zsJwOq+0+EemBV06doB1UeBm8xQo0Klgd0WbuoDaXoThZoKTR1PB1UMrdfRlCjV6f5k01azLQaaaUZHSGn9q/xKpUrMyT09gUaMW39T4m2knnlJg6VHB3xr/v9vFL9zB+hbamF5U1fGtKFKAC1fm8UW1SJF0oUlHpYBAhjbqmx6f3+5ger3v4V9j1D4qcM9UJK5X7Vv7KygYWs2E5u/ZQy7IFVN1eTj3ksw8PXLfw6YBMnT9duVC1Phy6gznSD3/ijAB1EYA+fW2oU5VpQ0AXDYlzvuDetNeoUak4074Adbrp233S/bV5w1P8sEfFU9Rj7VZpd9XdYeUa/wBPtP4a755o60jtGSkHHADFDXUK+mtL8AE4+qeZFXC5+DIc72PbElP3vdVsGN7ymwXc5ougiUGBSJ9BamQ66luBPsY0GPVnikibWpLST1Wt0tqfJztxFyRUG2DJe63omQPgQG3pCN6ORXhAZDgrCitNZPoQfeClOPqnA3v9/AqSBTfxxB615rfjVISGiTYLeoAen+Kc4YLF2PdLfXwy4/xkju9UprpVMh2hpkd3f04qSPt+lagVuS7oyjDVglJZahQSpwpWIj6Gowql9gDqRDcJPrV9OHhRIke680zL0xZeCHuPavj6GGi9qAXlgoNnAJQcKRKl8ISjfAz5Gct/bsnkyGpffjT1MS5/9kdYTFL96thwbRa1WH9DUDEFq3RXj7GnJUBdyMo9bLcY8wEpSdU9XW9d86/xAnXNvRq4Q25XTe+Dt4UTaT2rFzOhumCYYk1IFO1ekFqV5pCeHPW98b/Jhqlcjc4/ZJSaUNWARWL1JDlHEC8cNwoA1TUa/2Er7WH7sFmvmSebfilK5fbf1r3ifw/u4cHd1iJl/OWMs2bjcEAbgDqrJ/XEqDMmGiEVZ/pbZPlvThnoZ61/ZLagmp5/rkjnrZGqOlYZCqAvcLd61ijYSojWqNUS5coA26hViLMU87f/XtEDd7SAaMW/XBpI1AEFpHVMU4ACURRpBqnmnJ2P7A6zFzH1cymhUJM4pcVkvf0brMrVtgmmsBmuIFPSatgAlnAKWmlfo81/P0Gjb3CGd47thqbhSRr9QP1Sg9Rb/nm0ov8ipv3j/sD6Rakm/GPdngBrTHaiLkHFWiPVDNYYoeFnnsUoY66gUOooeZD8oEAFKYj0cxaprj6Pfopp5FF7XGpSo9cX6DadAOGaFy3IdiYkqjrUa5lnXFtVClH/x7ZJPRPL7m1DL1K1+z5fGpSG/Xmm6QQVQ/VFJYMSiACVi/eEYh3a6GUf8ap0rKB+Qei2Vd0mVGv/pE2EOZN+Uf8Xqe89DImSKw1UGjtTY/ovtv2+Iap1qWEledHqYBB6VuthQ58wTC58iMKh/zxU3pO0KR36vePjbtziHI7tR6HPmkHaE/JzG8tfNJwaZV1qDupnhapUYdCKA9ecapXBMLjgUL/EdjgYD/DpgG9DkZu9B9j0Kzvy3oNhQBR6+n1Ig7mTn2Ea7u5BpFmlWvNXrOIB4hbL9gVtbJ+Nf/p/DoEST4r24kqzSH+NO/s/QdSmT8XTfu9jpfrwbz0Ag+2ly/o1kL2i5SGrKoEhzwfZF/T+j/rrB97mI6JBxP9/O+faoyoMhOGNkbMlfgA3opIQPvr/f+I50E7nnekUUEHd5ExdWbktPH3nUmBVw/z8w/vr5KkEKms1cv1H1sP9R3cXRgXhx8L8Z/eHo8WOPzBC7AtYGzaNW+eNenk4rjN5PYvUUqly/GeY8nAq5qlyGVTASqL1kmW6keWkzSze5buIesNacXShM2m01khtle7dY8X+vFBLUVEFqFcPtUKljj9nZHsjtkG5u9vuDrvR5K6tDH2OAr2NPiREmkdayFj6MNMkpM64v09VUqtasDch2zEweNHseGLSoNjsg0gapEMP0VLfXTe5g7CP842OIsTRkSiEUkBa6mJ/ycM89wjVpcmfoHqp+lQVQgDJtVZaNS2o5hbe/JmHGfD5Fj75FaX8/cLYYWH7OBNIDg5Uk8t7oERUI22USoeHTZ9iyrW/U1D5auoINfp/BxFAiXUR2pXtZs+mI2pb9nobaWldM32SqPFAelEW7P1UUgFUTbXVYIeTolegXJ8t3PXkx/OCpTVP6nOtrFUiHf0+q9Knav3s7SnD/W2pEtXANVjdKrwrmYVr3lomKkVK10tVenJPFlETt/yM2t9DBapjBBBqBbB1W2+DdgHGWh5LVWmiJNJ4Q88jLdb0e3UnxRlQo1IxV41iJblqvaJyxdQLOb5Bg3k0EX3T0nsrZtQ8m3ZEOANQXz6lRJNQ6txafg9MlfeLOpWVqqgSU1OyU1bzpM52hblwidEhdaxRjxT8nkLpKqP8KaZSqU1w/4Pyfw8VqYKhaKv2DVaBz3dXdHtUqahLcfy0ClNZpu4z7j9APbFUEesANmUbtBI004ZG1S0tCHNH+lVLk6lOqdQaVZjD/kI8o9ez3w/5/kdX+pjxv1az72/9GAVe+hP5f6QasXZE1ZTs89Y+sE1XMVDh9SDSMeHTP+q5B28/3XvHPwbVBooqzlVCrJJtxW1j60yUESdL9IhEITtFla6an8yYChepKFNBVM1QVZqNgOUknLwnLl+hdfCpA3QJQO/gjLJSQEmiQJQiKZWl+KzZ+kxl6a/S/8AUoypR7XvE2g3R1cD6uFXW79XkJlch0eD1FyZKSAsrlq6OVFyj0lApqB6AKsdVjTaIdkR8pXOlU+62sCurM/IMTp8QjWVp4dzst0ismP2drv6xAGCqiuvVsk6Q7tT88IvXuO8I6ooJ/n4Dub+U5wjURFow0s3cPv1XdJ2pfFAdqaJWg1pRr1cbbULZRwpzPsk8WR3WVDD7SFMQPZ0yIk0r/a2Ypjf90f8xrI4VgKdKWDEOMN5enPfa1o8/4o8eWaKaqE5OzrvkCHRDpPy10zKoxlQVwypo1VCrZeyZAcOVqMeX6gXZDXHtXmFMgEqN5kW6vefr/0ohpcpUxcWqp0pYo1zn2F7F5FHz8ryaNE2iIFJMTmuPnua8n4SKUsUKIGIN1RViHcgOre+P/Xbm939UQMMxSaJapPSF+69iagbVEqTKWtVy1WCP4yn3oh0llmN8N6kd+/4olh/D/CPjZKCC5wTRMHh6iefLL6KJg3+QKsZVm2sSC7ayy/iK/i6A/vgDZKKEtNAifQFS8zJVTFXFNNWhGFBsUwFfoD2E8hL2cdE0GegPEE0CKWWnFyIVw1Srqmq4sAKsJ2UXk23GNCSeF+RorhF4XiTQlKhGikRfypQuqESpYq3KgwA/Cki4snRMguFl45012rHoQzoGdnqf6zVR8Wj5y5gqqvFbE4lqAVSjWE2ygjBHhdPlLhFropeTpMk4A9ADAM2I9G1MY6Uq/J/FClUAxtYc2ZxdDHFPrGXAjPIkhRLSItHo/vEny9dhGjOVTlZUrmqsGuz9gJcZ7RaA/gDRUkg0XoPa798RSvOPqOmwWmBchTpABwI48wHtEro/2fnWPiPOqFAJlOqnWJO+E6g9rDJDQNlouU5ods5OS1c8/MDfQo8XGtUi/f4Eppyq9lmqhmL5jJHC83bwTdP0PBspUQ6kcuD0fqZ8T8UQawlqBa6QuVC4ITbMMT7gogRiipMd3ia6/4xQmrn9Z4UA4Dpi1YJVAQH42KTG+blFGmbw90bzFBLd77e53/zM8N8sAQrEWii5lo2wg2+ex+FBayRL5e/hln1pOb37FIXmCyvnjHwlgms80SY1AcYjbubVmLBs8M+UhalQDqNvKUkXu78uAqRakzig4wGSnYDG8sa1SoPmyLPMAN3rdP/19WFQMQBIqgKr4FpCvAtAGm5LjEA2pfR0LU8PtEid/hORWgHAwCq5KrIyLES0MrWV+ILFjbUbhVMqFJ3+I2rSpVjTIJBw9WgzcB+zYhYn3RH9bJz29SpHzc2CBbz3Iy4CRwicED8ToMLpPxyoFViTmnUerKTrCRcJQ9FSc55m4VyRKvTzXX4aK+dW5xaSLYtFVpq/OlOZwuXdJw2Z7qaKCcvlufq7hA41NkfT5u7TeirOqE8rLf0GpDmu8YzcnBXYJhwbQ2YRh24uy9MZTv97kCqsoFc3GQl4TDuBaLntU5q/UaBzVBMfdFvYHoKnM7PSb2WakjXwatjYcrUYXZ5Ta+dNHcHXf/tvy7x/U9d3bk6t2572XxEJVhyCRmChAAAAAElFTkSuQmCC"

/***/ }),

/***/ 8:
/*!******************************************************************************!*\
  !*** E:/HBuilderProjects/HBuilderxProjects/eShop/pages.json?{"type":"stat"} ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "" };exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map