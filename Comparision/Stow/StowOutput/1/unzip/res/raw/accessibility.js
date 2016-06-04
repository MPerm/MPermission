var goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(name) {
  goog.exportPath_(name)
};
goog.isProvided_ = function(name) {
  return!goog.implicitNamespaces_[name] && !!goog.getObjectByName(name)
};
goog.setTestOnly = function(opt_message) {
  if(!goog.DEBUG) {
    throw opt_message = opt_message || "", Error("Importing test-only code into non-debug environment" + opt_message ? ": " + opt_message : ".");
  }
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split("."), cur = opt_objectToExportTo || goog.global;
  !(parts[0] in cur) && cur.execScript && cur.execScript("var " + parts[0]);
  for(var part;parts.length && (part = parts.shift());) {
    !parts.length && goog.isDef(opt_object) ? cur[part] = opt_object : cur = cur[part] ? cur[part] : cur[part] = {}
  }
};
goog.getObjectByName = function(name, opt_obj) {
  for(var parts = name.split("."), cur = opt_obj || goog.global, part;part = parts.shift();) {
    if(goog.isDefAndNotNull(cur[part])) {
      cur = cur[part]
    }else {
      return null
    }
  }
  return cur
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global, x;
  for(x in obj) {
    global[x] = obj[x]
  }
};
goog.addDependency = function() {
};
goog.useStrictRequires = !1;
goog.require = function() {
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(var_args) {
  return var_args
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    return ctor.instance_ || (ctor.instance_ = new ctor)
  }
};
goog.typeOf = function(value) {
  var s = typeof value;
  if(s == "object") {
    if(value) {
      if(value instanceof Array) {
        return"array"
      }else {
        if(value instanceof Object) {
          return s
        }
      }
      var className = Object.prototype.toString.call(value);
      if(className == "[object Window]") {
        return"object"
      }
      if(className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(s == "function" && typeof value.call == "undefined") {
      return"object"
    }
  }
  return s
};
goog.propertyIsEnumerableCustom_ = function(object, propName) {
  if(propName in object) {
    for(var key in object) {
      if(key == propName && Object.prototype.hasOwnProperty.call(object, propName)) {
        return!0
      }
    }
  }
  return!1
};
goog.propertyIsEnumerable_ = function(object, propName) {
  return object instanceof Object ? Object.prototype.propertyIsEnumerable.call(object, propName) : goog.propertyIsEnumerableCustom_(object, propName)
};
goog.isDef = function(val) {
  return val !== void 0
};
goog.isNull = function(val) {
  return val === null
};
goog.isDefAndNotNull = function(val) {
  return val != null
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array"
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number"
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function"
};
goog.isString = function(val) {
  return typeof val == "string"
};
goog.isBoolean = function(val) {
  return typeof val == "boolean"
};
goog.isNumber = function(val) {
  return typeof val == "number"
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function"
};
goog.isObject = function(val) {
  var type = goog.typeOf(val);
  return type == "object" || type == "array" || type == "function"
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(obj) {
  "removeAttribute" in obj && obj.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete obj[goog.UID_PROPERTY_]
  }catch(ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {}, key;
    for(key in obj) {
      clone[key] = goog.cloneObject(obj[key])
    }
    return clone
  }
  return obj
};
goog.bindNative_ = function(fn) {
  return fn.call.apply(fn.bind, arguments)
};
goog.bindJs_ = function(fn, selfObj) {
  var context = selfObj || goog.global;
  if(arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(context, newArgs)
    }
  }else {
    return function() {
      return fn.apply(context, arguments)
    }
  }
};
goog.bind = function() {
  goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs)
  }
};
goog.mixin = function(target, source) {
  for(var x in source) {
    target[x] = source[x]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(script) {
  if(goog.global.execScript) {
    goog.global.execScript(script, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;"), typeof goog.global._et_ != "undefined" ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(script)
      }else {
        var doc = goog.global.document, scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = !1;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName
  }, renameByParts = function(cssName) {
    for(var parts = cssName.split("-"), mapped = [], i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]))
    }
    return mapped.join("-")
  }, rename;
  rename = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts : function(a) {
    return a
  };
  return opt_modifier ? className + "-" + rename(opt_modifier) : rename(className)
};
goog.setCssNameMapping = function(mapping, style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = style
};
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {}, key;
  for(key in values) {
    var value = ("" + values[key]).replace(/\$/g, "$$$$"), str = str.replace(RegExp("\\{\\$" + key + "\\}", "gi"), value)
  }
  return str
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo)
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor
};
goog.base = function(me, opt_methodName) {
  var caller = arguments.callee.caller;
  if(caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1))
  }
  for(var args = Array.prototype.slice.call(arguments, 2), foundCaller = !1, ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if(ctor.prototype[opt_methodName] === caller) {
      foundCaller = !0
    }else {
      if(foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args)
      }
    }
  }
  if(me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args)
  }else {
    throw Error("goog.base called from a method of one name to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global)
};
goog.MODIFY_FUNCTION_PROTOTYPES = !0;
if(goog.MODIFY_FUNCTION_PROTOTYPES) {
  Function.prototype.bind = Function.prototype.bind || function(selfObj) {
    if(arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      args.unshift(this, selfObj);
      return goog.bind.apply(null, args)
    }else {
      return goog.bind(this, selfObj)
    }
  }, Function.prototype.partial = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this, null);
    return goog.bind.apply(null, args)
  }, Function.prototype.inherits = function(parentCtor) {
    goog.inherits(this, parentCtor)
  }, Function.prototype.mixin = function(source) {
    goog.mixin(this.prototype, source)
  }
}
;var PowerKey = function(context, axsJAX) {
  this.context = context;
  this.cmpDivElement_ = this.listElement_ = this.backgroundDivElement = this.cmpTextElement = this.cmpFloatElement = null;
  this.completionPromptStr_ = "Enter Completion";
  this.noCompletionStr_ = "No completions found";
  this.axsJAX_ = null;
  this.cmpList_ = [];
  this.listPos_ = -1;
  this.managedCmpLists_ = [];
  this.managedCmpListsPos_ = -1;
  this.hideCmdFieldOnBlur_ = !1;
  this.hideOnEsc_ = !0;
  this.showBackgroundDiv_ = !1;
  this.backgroundColor_ = "#000000";
  this.backgroundTransparency_ = 0;
  this.managedCompletionListCallback_ = this.completionHandler_ = this.completionActionMap_ = this.browseCallback_ = null;
  this.nodeMap = {};
  this.indexList_ = {};
  if(axsJAX && PowerKey.isGecko) {
    this.axsJAX_ = axsJAX
  }
  var self = this;
  this.attachHandlerAndListen(window, PowerKey.Event.RESIZE, function(evt) {
    self.onPageResize_.call(self, evt)
  }, null)
};
PowerKey.CMD_PARAM = /^\<[A-Z|a-z|0-9|\-|\_]+\>$/;
PowerKey.LEFT_TRIMMABLE = /^(\s|\r|\n)+/;
PowerKey.RIGHT_TRIMMABLE = /(\s|\r|\n)+$/;
PowerKey.prototype.attachHandlerAndListen = function(target, event$$0, handler, actionMap) {
  PowerKey.isGecko && handler ? target.addEventListener(event$$0, handler, !0) : PowerKey.isIE && handler && target.attachEvent(event$$0, function(event) {
    handler(event)
  });
  if(actionMap) {
    var actionMap = this.expandActionMap(actionMap), handlerObj = new PowerKey.DefaultHandler(actionMap), pkObj = this;
    this.attachHandlerAndListen(target, event$$0, function(evt) {
      handlerObj.handler(evt, handlerObj, pkObj)
    }, null)
  }
};
PowerKey.prototype.expandActionMap = function(map) {
  for(var key in map) {
    var toks = key.split(",");
    if(toks.length > 1) {
      for(var i in toks) {
        map[toks[i]] = map[key]
      }
      map[key] = null
    }
  }
  return map
};
PowerKey.prototype.createCompletionField = function(parent, size, handler, actionMap, completionList, browseOnly) {
  var self = this, floatId, fieldId, oldCmdNode, divId, bgDivId;
  this.cmpFloatElement && this.cmpFloatElement.parentNode.removeChild(this.cmpFloatElement);
  do {
    floatId = "completionField_" + Math.floor(Math.random() * 1001), fieldId = "txt_" + floatId, divId = "div_" + floatId, bgDivId = "bgdiv_" + floatId, oldCmdNode = document.getElementById(floatId)
  }while(oldCmdNode);
  this.backgroundDivElement && this.backgroundDivElement.parentNode.removeChild(this.backgroundDivElement);
  var bgNode = document.createElement("div");
  bgNode.id = bgDivId;
  bgNode.style.display = "none";
  var cmpNode = document.createElement("div");
  cmpNode.id = floatId;
  cmpNode.style.position = "absolute";
  var txtNode = document.createElement("input");
  txtNode.type = "text";
  txtNode.id = fieldId;
  txtNode.size = size;
  txtNode.value = "";
  txtNode.setAttribute("aria-owns", divId);
  txtNode.onkeypress = function(evt) {
    evt.stopPropagation();
    if(evt.keyCode == PowerKey.keyCodes.TAB) {
      return!1
    }
  };
  if(txtNode.readOnly = browseOnly) {
    txtNode.style.fontSize = 0
  }
  var divNode = document.createElement("div");
  divNode.id = divId;
  divNode.setAttribute("tabindex", 0);
  divNode.setAttribute("role", "row");
  cmpNode.appendChild(divNode);
  cmpNode.appendChild(txtNode);
  parent.appendChild(bgNode);
  parent.appendChild(cmpNode);
  this.cmpFloatElement = cmpNode;
  this.cmpTextElement = txtNode;
  this.backgroundDivElement = bgNode;
  this.cmpDivElement_ = divNode;
  this.listElement_ = null;
  this.cmpFloatElement.className = "pkHiddenStatus";
  this.cmpTextElement.className = "pkOpaqueCompletionText";
  this.backgroundDivElement.className = "pkBackgroundHide";
  this.completionActionMap_ = actionMap;
  this.completionHandler_ = handler;
  completionList && (this.addCompletionListByName(this.context, completionList, this.completionPromptStr_), this.setCompletionListByName(this.context));
  this.attachHandlerAndListen(this.cmpTextElement, PowerKey.Event.KEYUP, function(evt) {
    self.handleCompletionKeyUp_.call(self, evt)
  }, null);
  this.attachHandlerAndListen(this.cmpTextElement, PowerKey.Event.KEYDOWN, function(evt) {
    self.handleCompletionKeyDown_.call(self, evt)
  }, null);
  this.attachHandlerAndListen(this.cmpTextElement, PowerKey.Event.BLUR, function() {
    self.hideCmdFieldOnBlur_ && self.updateCompletionField(PowerKey.status.HIDDEN)
  }, null)
};
PowerKey.prototype.setAutoHideCompletionField = function(hide) {
  this.hideCmdFieldOnBlur_ = hide
};
PowerKey.prototype.setBrowseCallback = function(callback) {
  this.browseCallback_ = callback
};
PowerKey.prototype.setCompletionActionMap = function(completionActionMap) {
  this.completionActionMap_ = completionActionMap
};
PowerKey.prototype.setCompletionPromptStr = function(str) {
  this.completionPromptStr_ = str
};
PowerKey.prototype.setCompletionList = function(list) {
  if(list) {
    this.managedCmpListsPos_ = -1;
    this.filterList_ = this.cmpList_ = list;
    this.indexList_ = {};
    for(var i = 0, cmp;cmp = this.cmpList_[i];i++) {
      this.indexList_[cmp.toLowerCase()] = i
    }
    this.listPos_ = -1
  }
};
PowerKey.prototype.addCompletionListByName = function(name, list, prompt) {
  var oldManagedCmpList = this.getManagedCompletionListByName_(name);
  if(oldManagedCmpList) {
    for(var i = 0, item;item = oldManagedCmpList.values[i];i++) {
      this.nodeMap[item] = null
    }
    oldManagedCmpList.list = list;
    oldManagedCmpList.completionPromptStr = prompt
  }else {
    var newManagedCmpList = {};
    newManagedCmpList.values = list;
    newManagedCmpList.name = name;
    newManagedCmpList.completionPromptStr = prompt;
    newManagedCmpList.index = this.managedCmpLists_.length;
    this.managedCmpLists_.push(newManagedCmpList)
  }
};
PowerKey.prototype.setCompletionListByName = function(name) {
  var cmpList = this.getManagedCompletionListByName_(name);
  cmpList && this.setManagedCompletionList_(cmpList.index)
};
PowerKey.prototype.getManagedCompletionListByName_ = function(name) {
  for(var i = 0, list;list = this.managedCmpLists_[i];i++) {
    if(list.name == name) {
      return list
    }
  }
  return null
};
PowerKey.prototype.updateCompletionField = function(status, opt_resize, opt_top, opt_left) {
  if(this.cmpFloatElement) {
    var backgoundShow = this.showBackgroundDiv_, backgroundColor = this.backgroundColor_, backgroundTransparency = this.backgroundTransparency_, managedCmpList = void 0;
    if(this.managedCmpListsPos_ > -1) {
      managedCmpList = this.managedCmpLists_[this.managedCmpListsPos_];
      if(managedCmpList.backgoundShow) {
        backgoundShow = managedCmpList.backgoundShow
      }
      if(managedCmpList.backgroundColor) {
        backgroundColor = managedCmpList.backgroundColor
      }
      if(managedCmpList.backgroundTransparency) {
        managedCmpList.backgroundTransparency = backgroundTransparency
      }
    }
    if(status == PowerKey.status.VISIBLE) {
      if(this.cmpFloatElement.className == "pkHiddenStatus" || this.listPos_ < 0) {
        managedCmpList ? this.setListElement_(managedCmpList.completionPromptStr) : this.setListElement_(this.completionPromptStr_)
      }
      this.showBackground_(backgoundShow, backgroundColor, backgroundTransparency);
      this.cmpFloatElement.className = "pkVisibleStatus";
      var elem = this.cmpTextElement;
      window.setTimeout(function() {
        elem.focus()
      }, 0)
    }else {
      if(status == PowerKey.status.HIDDEN) {
        if(PowerKey.isIE && this.listElement_) {
          this.listElement_.innerText = ""
        }else {
          if(this.listElement_) {
            this.listElement_.textContent = ""
          }
        }
        this.showBackground_(!1, backgroundColor, backgroundTransparency);
        this.cmpFloatElement.className = "pkHiddenStatus";
        this.cmpTextElement.value = "";
        this.listPos_ = -1
      }
    }
    if(opt_resize) {
      var viewportSz = PowerKey.getViewportSize();
      opt_top || (opt_top = viewportSz.height - this.cmpFloatElement.offsetHeight);
      opt_left || (opt_left = 0);
      this.cmpFloatElement.style.top = opt_top;
      this.cmpFloatElement.style.left = opt_left
    }
  }
};
PowerKey.prototype.isVisible = function() {
  return this.cmpFloatElement != null && this.cmpFloatElement.className == "pkVisibleStatus"
};
PowerKey.prototype.hideOnEsc = function(hide) {
  this.hideOnEsc_ = hide
};
PowerKey.prototype.onPageResize_ = function() {
  var self = this;
  window.setTimeout(function() {
    self.showBackgroundDiv_ && self.backgroundDivElement.style.display == "block" && self.showBackground_(self.showBackgroundDiv_, self.backgroundColor_, self.backgroundTransparency_)
  }, 0)
};
PowerKey.prototype.handleCompletionKeyUp_ = function(evt) {
  if(this.cmpTextElement.value.length === 0) {
    this.filterList_ = this.cmpList_
  }
  if(evt.keyCode != PowerKey.keyCodes.ARROWUP && evt.keyCode != PowerKey.keyCodes.ARROWDOWN && evt.keyCode != PowerKey.keyCodes.ARROWLEFT && evt.keyCode != PowerKey.keyCodes.ARROWRIGHT && evt.keyCode != PowerKey.keyCodes.ENTER && evt.keyCode != PowerKey.keyCodes.TAB && evt.keyCode != PowerKey.keyCodes.ESC) {
    if(this.cmpTextElement.value.length) {
      this.filterList_ = this.getWordFilterMatches_(this.cmpList_, this.cmpTextElement.value, 50), this.listPos_ = -1, this.filterList_.length > 0 ? (this.setListElement_(this.filterList_[0]), this.listPos_ = 0) : this.setListElement_(this.noCompletionStr_)
    }else {
      if(this.managedCmpListsPos_ > -1) {
        var managedCmpList = this.managedCmpLists_[this.managedCmpListsPos_];
        this.setListElement_(managedCmpList.completionPromptStr)
      }else {
        this.setListElement_(this.completionPromptStr_)
      }
    }
  }
  if(evt.keyCode == PowerKey.keyCodes.ENTER) {
    if(!this.cmpTextElement.readOnly) {
      this.filterList_ && this.filterList_.length > 0 && this.filterList_[this.listPos_] && this.cmpTextElement.value != this.filterList_[this.listPos_] && (this.filterList_[this.listPos_].indexOf("<") < 0 || this.filterList_[this.listPos_].indexOf("<") >= 0 && this.filterList_[this.listPos_].split(" ").length > this.cmpTextElement.value.split(" ").length) && this.selectCurrentListItem_();
      var str = this.cmpTextElement.value, originalCmd = (PowerKey.isIE ? this.listElement_.innerText : this.listElement_.textContent).toLowerCase(), pos = originalCmd.indexOf("<"), baseCmd;
      pos >= 0 ? (baseCmd = str.substr(0, pos - 1).toLowerCase(), str = baseCmd + " " + str.substr(pos)) : baseCmd = str = str.toLowerCase();
      var handled = !1;
      this.completionActionMap_ && (handled = this.actionHandler_.call(this, str, originalCmd, this.completionActionMap_));
      if(this.completionHandler_ && !handled) {
        var args = this.getArguments_(str, originalCmd);
        this.completionHandler_(baseCmd, this.indexList_[originalCmd], this.nodeMap[originalCmd], args)
      }
      this.cmpTextElement.value = ""
    }
  }else {
    evt.keyCode == PowerKey.keyCodes.ESC && this.hideOnEsc_ && (this.cmpTextElement.blur(), this.updateCompletionField(PowerKey.status.HIDDEN))
  }
};
PowerKey.prototype.handleCompletionKeyDown_ = function(evt) {
  evt.keyCode == PowerKey.keyCodes.ARROWUP && this.filterList_ && this.filterList_.length > 0 ? this.prevListItem_() : evt.keyCode == PowerKey.keyCodes.ARROWDOWN && this.filterList_ && this.filterList_.length > 0 && (this.nextListItem_(), evt.preventDefault && evt.preventDefault());
  evt.keyCode == PowerKey.keyCodes.ARROWLEFT && this.cmpTextElement.readOnly && this.managedCmpLists_.length > 0 ? this.prevManagedCompletionList_() : evt.keyCode == PowerKey.keyCodes.ARROWRIGHT && this.cmpTextElement.readOnly && this.managedCmpLists_.length > 0 ? this.nextManagedCompletionList_() : evt.keyCode == PowerKey.keyCodes.TAB && (this.filterList_ && this.filterList_.length > 0 && this.selectCurrentListItem_(), evt.preventDefault && evt.preventDefault())
};
PowerKey.prototype.showBackground_ = function(show, color, transparency) {
  if(show) {
    this.backgroundDivElement.className = "pkBackgroundShow";
    this.backgroundDivElement.style.display = "block";
    var viewportSz = PowerKey.getViewportSize();
    this.backgroundDivElement.style.width = viewportSz.width + "px";
    this.backgroundDivElement.style.height = viewportSz.height + "px";
    if(color) {
      this.backgroundDivElement.style.backgroundColor = color
    }
    transparency && this.backgroundDivElement.style.setProperty("-moz-opacity", "" + transparency / 100, "")
  }else {
    this.backgroundDivElement.style.display = "none"
  }
};
PowerKey.prototype.getWordFilterMatches_ = function(list, token, maxMatches) {
  for(var matches = list, rows = list, words = token.split(" "), i = 0, word;word = words[i];i++) {
    if(rows = matches, matches = [], word !== "") {
      for(var escapedToken = PowerKey.regExpEscape(word), matcher = RegExp("(^|\\W+)" + escapedToken, "i"), j = 0, row;row = rows[j];j++) {
        String(row).match(matcher) && matches.push(row)
      }
    }
  }
  rows = list;
  for(j = 0;row = rows[j];j++) {
    for(var parts = row.split(" "), cmpArray = [], part, i = 0;part = parts[i];i++) {
      if(part.charAt(0) == "<") {
        break
      }
      cmpArray.push(part)
    }
    var cmp = cmpArray.join(" ");
    token.indexOf(cmp) === 0 && matches.push(row)
  }
  matches.length > maxMatches && matches.slice(0, maxMatches - 1);
  return matches
};
PowerKey.prototype.getArguments_ = function(str, originalCmd) {
  var str = str.replace(/\s+/g, " "), originalCmd = originalCmd.replace(/\s+/g, " "), pos = originalCmd.indexOf("<");
  if(pos < 0) {
    return[]
  }
  var originalCmd = originalCmd.substr(pos), str = str.substr(pos), strTokens = str.split(","), ostrTokens = originalCmd.split(",");
  if(strTokens.length != ostrTokens.length) {
    return[]
  }
  for(var args = [], i = 0, token1, token2;(token1 = strTokens[i]) && (token2 = ostrTokens[i]);i++) {
    token1 = PowerKey.leftTrim(PowerKey.rightTrim(token1)), token2 = PowerKey.leftTrim(PowerKey.rightTrim(token2)), token2.match(PowerKey.CMD_PARAM) && args.push(token1)
  }
  return args
};
PowerKey.prototype.actionHandler_ = function(act, originalCmd, actionMap) {
  var actionObj = actionMap[originalCmd];
  if(actionObj && actionObj[this.context]) {
    var func = actionObj[this.context], args = this.getArguments_(act, originalCmd);
    func instanceof Function ? window.setTimeout(func(args), 0) : window.setTimeout(func + "(args)", 0);
    return!0
  }else {
    return!1
  }
};
PowerKey.prototype.prevListItem_ = function() {
  if(this.listPos_ < 0) {
    this.listPos_ = 0
  }
  this.listPos_ = (this.listPos_ || this.filterList_.length) - 1;
  this.listPos_ >= 0 && this.setListElement_(this.filterList_[this.listPos_])
};
PowerKey.prototype.nextListItem_ = function() {
  this.listPos_ = (this.listPos_ + 1) % this.filterList_.length;
  this.listPos_ < this.filterList_.length && this.setListElement_(this.filterList_[this.listPos_])
};
PowerKey.prototype.prevManagedCompletionList_ = function() {
  var completionListsPos = this.managedCmpListsPos_ - 1;
  completionListsPos < 0 && (completionListsPos = this.managedCmpLists_.length - 1);
  this.setManagedCompletionList_(completionListsPos)
};
PowerKey.prototype.nextManagedCompletionList_ = function() {
  var completionListsPos = this.managedCmpListsPos_ + 1;
  completionListsPos >= this.managedCmpLists_.length && (completionListsPos = 0);
  this.setManagedCompletionList_(completionListsPos)
};
PowerKey.prototype.setManagedCompletionList_ = function(managedCmpListsPos) {
  var managedCmpList = this.managedCmpLists_[managedCmpListsPos];
  this.context = managedCmpList.name;
  this.setCompletionList(managedCmpList.values);
  this.managedCmpListsPos_ = managedCmpListsPos;
  var status = this.cmpFloatElement.className == "pkVisibleStatus" ? PowerKey.status.VISIBLE : PowerKey.status.HIDDEN;
  this.updateCompletionField(status);
  this.managedCompletionListCallback_ && this.managedCompletionListCallback_(managedCmpList.name)
};
PowerKey.prototype.selectCurrentListItem_ = function() {
  this.cmpTextElement.value = this.filterList_[this.listPos_ >= 0 ? this.listPos_ : 0];
  this.filterList_ = this.getWordFilterMatches_(this.cmpList_, this.cmpTextElement.value, 50);
  this.axsJAX_ && PowerKey.isGecko && this.axsJAX_.speakTextViaNode(this.cmpTextElement.value);
  this.listPos_ = 0
};
PowerKey.prototype.setListElement_ = function(text) {
  if(!this.listElement_) {
    this.listElement_ = document.createElement("div"), this.listElement_.id = "listElem_" + Math.floor(Math.random() * 1001), this.cmpDivElement_.appendChild(this.listElement_)
  }
  PowerKey.isIE ? this.listElement_.innerText = text : this.listElement_.textContent = text;
  this.browseCallback_ && this.browseCallback_(text, this.indexList_[text.toLowerCase()]);
  this.axsJAX_ && PowerKey.isGecko && this.axsJAX_.speakNode(this.listElement_, !1)
};
PowerKey.prototype.setDefaultCSSStyle = function() {
  PowerKey.setDefaultCSSStyle()
};
PowerKey.DefaultHandler = function(map) {
  this.actionMap = map
};
PowerKey.DefaultHandler.prototype.handler = function(evt, handlerObj, pkObj) {
  if(handlerObj.actionMap && evt.keyCode) {
    var mapkeyCode = "" + evt.keyCode, mapkeyChar = String.fromCharCode(evt.keyCode).toLowerCase();
    evt.ctrlKey && (mapkeyCode = "Ctrl+" + mapkeyCode, mapkeyChar = "Ctrl+" + mapkeyChar);
    evt.altKey && (mapkeyCode = "Alt+" + mapkeyCode, mapkeyChar = "Alt+" + mapkeyChar);
    evt.shiftKey && (mapkeyCode = "Shift+" + mapkeyCode, mapkeyChar = "Shift+" + mapkeyChar);
    var actionObj = null;
    (actionObj = handlerObj.actionMap[mapkeyChar]) || (actionObj = handlerObj.actionMap[mapkeyCode]);
    if(actionObj) {
      var funcObj = actionObj[pkObj.context] ? actionObj[pkObj.context] : actionObj["*"];
      if(funcObj) {
        var func = funcObj[1];
        if(func && (func(evt), funcObj[0] != "*")) {
          pkObj.context = funcObj[0]
        }
      }
    }
  }
};
PowerKey.ViewportSize = function(width, height) {
  this.width = width ? width : void 0;
  this.height = height ? height : void 0
};
PowerKey.leftTrim = function(str) {
  return str.replace(PowerKey.LEFT_TRIMMABLE, "")
};
PowerKey.rightTrim = function(str) {
  return str.replace(PowerKey.RIGHT_TRIMMABLE, "")
};
PowerKey.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
PowerKey.getViewportSize = function() {
  var myWidth = 0, myHeight = 0;
  if(typeof window.innerWidth == "number") {
    myWidth = window.innerWidth, myHeight = window.innerHeight
  }else {
    if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
      myWidth = document.documentElement.clientWidth, myHeight = document.documentElement.clientHeight
    }else {
      if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
        myWidth = document.body.clientWidth, myHeight = document.body.clientHeight
      }
    }
  }
  return new PowerKey.ViewportSize(myWidth, myHeight)
};
PowerKey.isIE = !1;
PowerKey.isGecko = !1;
PowerKey.setBrowser = function() {
  var agt = navigator.userAgent.toLowerCase();
  PowerKey.isGecko = agt.indexOf("gecko") != -1;
  PowerKey.isIE = agt.indexOf("msie") != -1 && agt.indexOf("opera") == -1
};
PowerKey.setBrowser();
PowerKey.Event = {KEYUP:PowerKey.isIE ? "onkeyup" : "keyup", KEYDOWN:PowerKey.isIE ? "onkeydown" : "keydown", KEYPRESS:PowerKey.isIE ? "onkeypress" : "keypress", CLICK:PowerKey.isIE ? "onclick" : "click", RESIZE:PowerKey.isIE ? "onresize" : "resize", FOCUS:PowerKey.isIE ? "onfocus" : "focus", BLUR:PowerKey.isIE ? "onblur" : "blur"};
PowerKey.cssStr = ".pkHiddenStatus {display: none; position: absolute;}.pkVisibleStatus {display: block; position: absolute; left: 2px; top: 2px; line-height: 1.2em; z-index: 10001; background-color: #000000; padding: 2px; color: #fff; font-family: Arial, Sans-serif; font-size: 20px; filter: alpha(opacity=80); -moz-opacity: .80;}.pkOpaqueCompletionText {border-style: none; background-color:transparent; font-family: Arial, Helvetica, sans-serif; font-size: 35px; font-weight: bold; color: #fff; width: 1000px; height: 50px;}.pkBackgroundShow {position: absolute; width: 0px;height: 0px; background-color: #000000; filter: alpha(opacity=70);  -moz-opacity: .70; left: 0px; top: 0px; z-index: 10000;}";
PowerKey.setDefaultCSSStyle = function() {
  var head, style;
  if(head = document.getElementsByTagName("head")[0]) {
    style = document.createElement("style");
    style.type = "text/css";
    if(PowerKey.isIE) {
      style.innerhtml = PowerKey.cssStr
    }else {
      if(PowerKey.isGecko) {
        style.innerHTML = PowerKey.cssStr
      }
    }
    head.appendChild(style)
  }
};
PowerKey.addCSSStyle = function(cssFile) {
  var headID = document.getElementsByTagName("head")[0], cssNode = document.createElement("link");
  cssNode.type = "text/css";
  cssNode.rel = "stylesheet";
  cssNode.href = cssFile;
  headID.appendChild(cssNode)
};
PowerKey.keyCodes = {ARROWUP:38, ARROWDOWN:40, ARROWLEFT:37, ARROWRIGHT:39, ENTER:13, TAB:9, ESC:27};
PowerKey.str = {DEFAULT_COMPLETION_LIST_NAME:"Completion list", DEFAULT_COMPLETION_PROMPT:"Enter Completion", DEFAULT_NO_COMPLETION:"No completions found"};
PowerKey.status = {VISIBLE:"visible", HIDDEN:"hidden"};
var cvox = {AbstractLogger:function() {
  if(this.logEnabled()) {
    this.debuglog = []
  }
}};
cvox.AbstractLogger.prototype.getName = function() {
  return"AbstractLogger"
};
cvox.AbstractLogger.prototype.logEnabled = function() {
  return!0
};
cvox.AbstractLogger.prototype.log = function(msgString) {
  this.logEnabled() && (this.debuglog.push(msgString), console && console.log(msgString))
};
cvox.AriaUtil = function() {
};
cvox.AriaUtil.MIN = "Min ";
cvox.AriaUtil.MAX = "Max ";
cvox.AriaUtil.WIDGET_ROLE_TO_NAME = {alert:"Alert", alertdialog:"Alert dialog", button:"Button", checkbox:"Check box", combobox:"Combo box", dialog:"Dialog", gridcell:"Grid cell", link:"Link", log:"Log", marquee:"Marquee", menuitem:"Menu item", menuitemcheckbox:"Menu item check box", menuitemradio:"Menu item radio button", option:"Option", progressbar:"Progress bar", radio:"Radio button", radiogroup:"Radio button group", scrollbar:"Scroll bar", slider:"Slider", spinbutton:"Spin button", status:"Status", 
tab:"Tab", tabpanel:"Tab panel", textbox:"Text box", timer:"Timer", toolbar:"Tool bar", tooltip:"Tool tip", treeitem:"Tree item"};
cvox.AriaUtil.STRUCTURE_ROLE_TO_NAME = {article:"Article", columnheader:"Column header", definition:"Definition", directory:"Directory", document:"Document", group:"Group", heading:"Heading", img:"Image", list:"List", listitem:"List item", math:"Math", note:"Note", region:"Region", row:"Row", rowheader:"Row header", separator:"Separator"};
cvox.AriaUtil.ATTRIBUTE_VALUE_TO_STATUS = [{name:"aria-autocomplete", values:{inline:"Autocompletion inline", list:"Autocompletion list", both:"Autocompletion inline and list"}}, {name:"aria-checked", values:{"true":"Checked", "false":"Not checked", mixed:"Partially checked"}}, {name:"aria-disabled", values:{"true":"Disabled"}}, {name:"aria-expanded", values:{"true":"Expanded", "false":"Collapsed"}}, {name:"aria-haspopup", values:{"true":"Has pop up"}}, {name:"aria-invalid", values:{"true":"Invalid input", 
grammar:"Grammatical mistake detected", spelling:"Spelling mistake detected"}}, {name:"aria-multiline", values:{"true":"Multi line"}}, {name:"aria-multiselectable", values:{"true":"Multi select"}}, {name:"aria-pressed", values:{"true":"Pressed", "false":"Not pressed", mixed:"Partially pressed"}}, {name:"aria-readonly", values:{"true":"Read only"}}, {name:"aria-required", values:{"true":"Required"}}, {name:"aria-selected", values:{"true":"Selected", "false":"Not selected"}}];
cvox.AriaUtil.isHidden = function(targetNode) {
  for(;targetNode;) {
    if(targetNode.getAttribute) {
      if(targetNode.getAttribute("role") == "presentation") {
        return!0
      }
      if(targetNode.getAttribute("aria-hidden") == "true") {
        return!0
      }
    }
    targetNode = targetNode.parentNode
  }
  return!1
};
cvox.AriaUtil.getRoleName = function(targetNode) {
  var roleName;
  if(targetNode && targetNode.getAttribute) {
    var role = targetNode.getAttribute("role");
    (roleName = cvox.AriaUtil.WIDGET_ROLE_TO_NAME[role]) || (roleName = cvox.AriaUtil.STRUCTURE_ROLE_TO_NAME[role])
  }
  roleName || (roleName = "");
  return roleName
};
cvox.AriaUtil.getState = function(targetNode) {
  var state = "";
  if(targetNode && targetNode.getAttribute) {
    for(var i = 0, attr;attr = cvox.AriaUtil.ATTRIBUTE_VALUE_TO_STATUS[i];i++) {
      var value = targetNode.getAttribute(attr.name), status = attr.values[value];
      status && (state = state + " " + status)
    }
    targetNode.getAttribute("aria-valuetext") ? state = state + " " + targetNode.getAttribute("aria-valuetext") : targetNode.getAttribute("aria-valuenow") && (state = state + " " + targetNode.getAttribute("aria-valuenow"));
    targetNode.getAttribute("aria-valuemin") && (state = state + " " + cvox.AriaUtil.MIN + targetNode.getAttribute("aria-valuemin"));
    targetNode.getAttribute("aria-valuemax") && (state = state + " " + cvox.AriaUtil.MAX + targetNode.getAttribute("aria-valuemax"))
  }
  return state
};
cvox.AriaUtil.isControlWidget = function(targetNode) {
  if(targetNode && targetNode.getAttribute) {
    var role = targetNode.getAttribute("role");
    switch(role) {
      case "button":
      ;
      case "checkbox":
      ;
      case "combobox":
      ;
      case "menuitemcheckbox":
      ;
      case "menuitemradio":
      ;
      case "radio":
      ;
      case "slider":
      ;
      case "spinbutton":
      ;
      case "textbox":
        return!0
    }
  }
  return!1
};
cvox.AriaUtil.getLiveRegionValue = function(node) {
  if(!node.hasAttribute) {
    return null
  }
  var value = node.getAttribute("aria-live");
  if(value) {
    return value
  }
  var role = node.getAttribute("role");
  switch(role) {
    case "alert":
      return"assertive";
    case "log":
    ;
    case "status":
      return"polite";
    default:
      return null
  }
};
cvox.AriaUtil.getLiveRegions = function(node) {
  var result = [];
  if(node.querySelectorAll) {
    var nodes = node.querySelectorAll('[role="alert"], [role="log"],  [role="marquee"], [role="status"], [role="timer"],  [aria-live]');
    if(nodes) {
      for(var i = 0;i < nodes.length;i++) {
        result.push(nodes[i])
      }
    }
  }
  for(;node;) {
    if(cvox.AriaUtil.getLiveRegionValue(node)) {
      result.push(node);
      break
    }
    node = node.parentElement
  }
  return result
};
cvox.ChromeVox = function() {
};
cvox.ChromeVox.tts = null;
cvox.ChromeVox.lens = null;
cvox.ChromeVox.isActive = !0;
cvox.ChromeVox.traverseContent = null;
cvox.ChromeVox.selectionUtil = null;
cvox.ChromeVox.earcons = null;
cvox.ChromeVox.navigationManager = null;
cvox.ChromeVox.isStickyOn = !1;
cvox.ChromeVox.isChromeOS = navigator.userAgent.indexOf("CrOS") != -1;
cvox.ChromeVox.stickyKeyStr = "Cvox";
cvox.ChromeVox.stickyKeyCode = cvox.ChromeVox.isChromeOS ? 91 : 45;
cvox.ChromeVox.modKeyStr = cvox.ChromeVox.isChromeOS ? "Cvox+Shift" : "Ctrl+Alt";
cvox.ChromeVox.sequenceSwitchKeyCodes = {};
if(!cvox.ChromeVoxJSON) {
  cvox.ChromeVoxJSON = {}
}
JSON.toString() == "[object JSON]" ? cvox.ChromeVoxJSON = JSON : function() {
  function f(n) {
    return n < 10 ? "0" + n : n
  }
  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
      var c = meta[a];
      return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
    }) + '"' : '"' + string + '"'
  }
  function str(key, holder) {
    var i, k, v, length, mind = gap, partial, value = holder[key];
    value && typeof value === "object" && typeof value.toJSON === "function" && (value = value.toJSON(key));
    typeof rep === "function" && (value = rep.call(holder, key, value));
    switch(typeof value) {
      case "string":
        return quote(value);
      case "number":
        return isFinite(value) ? String(value) : "null";
      case "boolean":
      ;
      case "null":
        return String(value);
      case "object":
        if(!value) {
          return"null"
        }
        gap += indent;
        partial = [];
        if(Object.prototype.toString.apply(value) === "[object Array]") {
          length = value.length;
          for(i = 0;i < length;i += 1) {
            partial[i] = str(i, value) || "null"
          }
          v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
          gap = mind;
          return v
        }
        if(rep && typeof rep === "object") {
          length = rep.length;
          for(i = 0;i < length;i += 1) {
            k = rep[i], typeof k === "string" && (v = str(k, value)) && partial.push(quote(k) + (gap ? ": " : ":") + v)
          }
        }else {
          for(k in value) {
            Object.hasOwnProperty.call(value, k) && (v = str(k, value)) && partial.push(quote(k) + (gap ? ": " : ":") + v)
          }
        }
        v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
        gap = mind;
        return v
    }
  }
  if(typeof Date.prototype.toJSON !== "function") {
    Date.prototype.toJSON = function() {
      return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : "null"
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
      return this.valueOf()
    }
  }
  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\u0008":"\\b", "\t":"\\t", "\n":"\\n", "\u000c":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, rep;
  if(typeof cvox.ChromeVoxJSON.stringify !== "function") {
    cvox.ChromeVoxJSON.stringify = function(value, replacer, space) {
      var i;
      indent = gap = "";
      if(typeof space === "number") {
        for(i = 0;i < space;i += 1) {
          indent += " "
        }
      }else {
        typeof space === "string" && (indent = space)
      }
      if((rep = replacer) && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
        throw Error("JSON.stringify");
      }
      return str("", {"":value})
    }
  }
  if(typeof cvox.ChromeVoxJSON.parse !== "function") {
    cvox.ChromeVoxJSON.parse = function(text, reviver) {
      function walk(holder, key) {
        var k, v, value = holder[key];
        if(value && typeof value === "object") {
          for(k in value) {
            Object.hasOwnProperty.call(value, k) && (v = walk(value, k), v !== void 0 ? value[k] = v : delete value[k])
          }
        }
        return reviver.call(holder, key, value)
      }
      var j, text = String(text);
      cx.lastIndex = 0;
      cx.test(text) && (text = text.replace(cx, function(a) {
        return"\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
      }));
      if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
        return j = eval("(" + text + ")"), typeof reviver === "function" ? walk({"":j}, "") : j
      }
      throw new SyntaxError("JSON.parse");
    }
  }
}();
cvox.Interframe = function() {
};
cvox.Interframe.IF_MSG_PREFIX = "cvox.INTERFRAME:";
cvox.Interframe.SET_ID = "cvox.INTERFRAME_SET_ID";
cvox.Interframe.listeners = [];
cvox.Interframe.init = function() {
  cvox.Interframe.messageListener = function(event) {
    if(event.data.indexOf(cvox.Interframe.IF_MSG_PREFIX) == 0) {
      var suffix = event.data.substr(cvox.Interframe.IF_MSG_PREFIX.length), message = cvox.ChromeVoxJSON.parse(suffix, null);
      if(message.command == cvox.Interframe.SET_ID) {
        cvox.Interframe.id = message.id
      }
      for(var i = 0, listener;listener = cvox.Interframe.listeners[i];i++) {
        listener(message)
      }
    }
  };
  window.addEventListener("message", cvox.Interframe.messageListener, !1)
};
cvox.Interframe.shutdown = function() {
  window.removeEventListener("message", cvox.Interframe.messageListener, !1)
};
cvox.Interframe.addListener = function(listener) {
  cvox.Interframe.listeners.push(listener)
};
cvox.Interframe.sendMessageToWindow = function(message, window) {
  var encodedMessage = cvox.Interframe.IF_MSG_PREFIX + cvox.ChromeVoxJSON.stringify(message, null, null);
  window.postMessage(encodedMessage, "*")
};
cvox.Interframe.sendMessageToIFrame = function(message, iframe) {
  cvox.Interframe.sendMessageToWindow(message, iframe.contentWindow)
};
cvox.Interframe.sendMessageToParentWindow = function(message) {
  if(window.parent != window) {
    message.sourceId = cvox.Interframe.id, cvox.Interframe.sendMessageToWindow(message, window.parent)
  }
};
cvox.Interframe.sendIdToIFrame = function(id, iframe) {
  cvox.Interframe.sendMessageToIFrame({command:cvox.Interframe.SET_ID, id:id}, iframe)
};
cvox.Interframe.init();
cvox.KeyUtil = function() {
};
cvox.KeyUtil.modeKeyPressTime = 0;
cvox.KeyUtil.sequencing = !1;
cvox.KeyUtil.sequenceBuffer = [];
cvox.KeyUtil.maxSeqLength = 2;
cvox.KeyUtil.keyEventToString = function(keyEvent) {
  var str = "";
  if(keyEvent.cvoxKey || keyEvent.stickyMode && cvox.ChromeVox.modKeyStr.indexOf("Cvox") >= 0) {
    str && (str += "+"), str += "Cvox"
  }
  if(keyEvent.ctrlKey || keyEvent.keyCode == 17 || keyEvent.stickyMode && cvox.ChromeVox.modKeyStr.indexOf("Ctrl") >= 0 && !keyEvent.cvoxKey) {
    str && (str += "+"), str += "Ctrl"
  }
  if(keyEvent.altKey || keyEvent.keyCode == 18 || keyEvent.stickyMode && cvox.ChromeVox.modKeyStr.indexOf("Alt") >= 0 && !keyEvent.cvoxKey) {
    str && (str += "+"), str += "Alt"
  }
  if(keyEvent.shiftKey || keyEvent.keyCode == 16 || keyEvent.stickyMode && cvox.ChromeVox.modKeyStr.indexOf("Shift") >= 0 && !keyEvent.cvoxKey) {
    str && (str += "+"), str += "Shift"
  }
  if(keyEvent.metaKey || keyEvent.stickyMode && cvox.ChromeVox.modKeyStr.indexOf("Meta") >= 0 && !keyEvent.cvoxKey) {
    str && (str += "+"), str += "Meta"
  }
  var currTime = (new Date).getTime();
  if(str == cvox.ChromeVox.stickyKeyStr && keyEvent.keyCode == cvox.ChromeVox.stickyKeyCode) {
    var prevTime = cvox.KeyUtil.modeKeyPressTime;
    prevTime > 0 && currTime - prevTime < 300 && (str += ">" + cvox.ChromeVox.stickyKeyStr);
    cvox.KeyUtil.modeKeyPressTime = currTime
  }else {
    cvox.KeyUtil.modeKeyPressTime = 0
  }
  str && (str += "+");
  var util = cvox.KeyUtil;
  if(str == cvox.ChromeVox.modKeyStr + "+") {
    if(cvox.KeyUtil.maxSeqLength == util.sequenceBuffer.length) {
      util.sequencing = !1, util.sequenceBuffer = []
    }
    !util.sequencing && util.isSequenceSwitchKeyCode(keyEvent.keyCode) ? (util.sequencing = !0, util.sequenceBuffer.push(keyEvent.keyCode)) : util.sequencing && util.sequenceBuffer.push(keyEvent.keyCode);
    for(var i = 0;i < util.sequenceBuffer.length;i++) {
      str += util.keyCodeToString(util.sequenceBuffer[i]) + (i == util.sequenceBuffer.length - 1 ? "" : ">")
    }
  }else {
    util.sequencing = !1, util.sequenceBuffer = []
  }
  !util.sequencing && !cvox.KeyUtil.isModifierKey(keyEvent.keyCode) && (str += cvox.KeyUtil.keyCodeToString(keyEvent.keyCode));
  return str
};
cvox.KeyUtil.keyCodeToString = function(keyCode) {
  return keyCode >= 65 && keyCode <= 90 ? String.fromCharCode(keyCode) : keyCode >= 48 && keyCode <= 57 ? String.fromCharCode(keyCode) : "#" + keyCode
};
cvox.KeyUtil.isModifierKey = function(keyCode) {
  return keyCode == 16 || keyCode == 17 || keyCode == 18 || keyCode == 91 || keyCode == cvox.ChromeVox.stickyKeyCode
};
cvox.KeyUtil.isSequenceSwitchKeyCode = function(keyCode) {
  var keyStr = cvox.KeyUtil.keyCodeToString(keyCode);
  return cvox.ChromeVox.sequenceSwitchKeyCodes[keyStr] ? !0 : !1
};
cvox.KeyUtil.getReadableNameForKeyCode = function(keyCode) {
  if(keyCode == 0) {
    return"Power button"
  }else {
    if(keyCode == 17) {
      return"Control"
    }else {
      if(keyCode == 18) {
        return"Alt"
      }else {
        if(keyCode == 16) {
          return"Shift"
        }else {
          if(keyCode == 9) {
            return"Tab"
          }else {
            if(keyCode == 91) {
              return cvox.ChromeVox.isChromeOS ? "Search" : "Left Window"
            }else {
              if(keyCode == 8) {
                return"Backspace"
              }else {
                if(keyCode == 32) {
                  return"Space"
                }else {
                  if(keyCode == 37) {
                    return"Left arrow"
                  }else {
                    if(keyCode == 38) {
                      return"Up arrow"
                    }else {
                      if(keyCode == 39) {
                        return"Right arrow"
                      }else {
                        if(keyCode == 40) {
                          return"Down arrow"
                        }else {
                          if(keyCode == 45) {
                            return"Insert"
                          }else {
                            if(keyCode == 13) {
                              return"Enter"
                            }else {
                              if(keyCode == 27) {
                                return"Escape"
                              }else {
                                if(keyCode == 112) {
                                  return cvox.ChromeVox.isChromeOS ? "Back" : "F1"
                                }else {
                                  if(keyCode == 113) {
                                    return cvox.ChromeVox.isChromeOS ? "Forward" : "F2"
                                  }else {
                                    if(keyCode == 114) {
                                      return cvox.ChromeVox.isChromeOS ? "Refresh" : "F3"
                                    }else {
                                      if(keyCode == 115) {
                                        return cvox.ChromeVox.isChromeOS ? "Toggle full screen" : "F4"
                                      }else {
                                        if(keyCode == 186) {
                                          return"Semicolon"
                                        }else {
                                          if(keyCode == 187) {
                                            return"Equal sign"
                                          }else {
                                            if(keyCode == 188) {
                                              return"Comma"
                                            }else {
                                              if(keyCode == 189) {
                                                return"Dash"
                                              }else {
                                                if(keyCode == 190) {
                                                  return"Period"
                                                }else {
                                                  if(keyCode == 191) {
                                                    return"Forward slash"
                                                  }else {
                                                    if(keyCode == 192) {
                                                      return"Grave accent"
                                                    }else {
                                                      if(keyCode == 219) {
                                                        return"Open bracket"
                                                      }else {
                                                        if(keyCode == 220) {
                                                          return"Back slash"
                                                        }else {
                                                          if(keyCode == 221) {
                                                            return"Close bracket"
                                                          }else {
                                                            if(keyCode == 222) {
                                                              return"Single quote"
                                                            }else {
                                                              if(keyCode == 115) {
                                                                return"Toggle full screen"
                                                              }else {
                                                                if(keyCode >= 48 && keyCode <= 90) {
                                                                  return String.fromCharCode(keyCode)
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
cvox.KeyUtil.getReadableNameForStr = function(keyStr) {
  if(keyStr == cvox.ChromeVox.stickyKeyStr) {
    return cvox.KeyUtil.getReadableNameForKeyCode(cvox.ChromeVox.stickyKeyCode)
  }
  return null
};
function Cursor(node, index, text) {
  this.node = node;
  this.index = index;
  this.text = text
}
Cursor.prototype.clone = function() {
  return new Cursor(this.node, this.index, this.text)
};
Cursor.prototype.copyFrom = function(otherCursor) {
  this.node = otherCursor.node;
  this.index = otherCursor.index;
  this.text = otherCursor.text
};
cvox.TraverseUtil = function() {
};
cvox.TraverseUtil.SKIP_CLASS = "Axs_Chrome_Skip";
cvox.TraverseUtil.getNodeText = function(node) {
  return node.constructor == Text ? node.data : ""
};
cvox.TraverseUtil.treatAsLeafNode = function(node) {
  return node.nodeName == "SELECT" || node.nodeName == "OBJECT"
};
cvox.TraverseUtil.isWhitespace = function(c) {
  return c == " " || c == "\n" || c == "\r" || c == "\t"
};
cvox.TraverseUtil.setSelection = function(start, end) {
  var sel = window.getSelection();
  sel.removeAllRanges();
  var range = document.createRange();
  range.setStart(start.node, start.index);
  range.setEnd(end.node, end.index);
  sel.addRange(range);
  return sel
};
cvox.TraverseUtil.isVisible = function(node) {
  if(!node.style) {
    return!0
  }
  var style = window.getComputedStyle(node, null);
  return!!style && style.display != "none" && style.visibility != "hidden"
};
cvox.TraverseUtil.isSkipped = function(node) {
  if(cvox.DomUtil.isDescendantOf(node, null, cvox.TraverseUtil.SKIP_CLASS)) {
    return!0
  }
  return!1
};
cvox.TraverseUtil.forwardsChar = function(cursor, nodesCrossed) {
  for(;;) {
    cursor.node.constructor != Text && nodesCrossed.push(cursor.node);
    var childNode = null;
    if(!cvox.TraverseUtil.treatAsLeafNode(cursor.node)) {
      for(var i = 0;i < cursor.node.childNodes.length;i++) {
        var node = cursor.node.childNodes[i];
        if(cvox.TraverseUtil.isSkipped(node)) {
          nodesCrossed.push(node)
        }else {
          if(cvox.TraverseUtil.isVisible(node)) {
            childNode = node;
            break
          }
        }
      }
    }
    if(childNode) {
      cursor.node = childNode, cursor.index = 0, cursor.text = cvox.TraverseUtil.getNodeText(cursor.node), cursor.node.constructor != Text && nodesCrossed.push(cursor.node)
    }else {
      if(cursor.index < cursor.text.length) {
        return cursor.text[cursor.index++]
      }
      for(;cursor.node != null;) {
        cursor.node.constructor != Text && nodesCrossed.push(cursor.node);
        for(var siblingNode = null, node = cursor.node.nextSibling;node != null;node = node.nextSibling) {
          if(cvox.TraverseUtil.isSkipped(node)) {
            nodesCrossed.push(node)
          }else {
            if(cvox.TraverseUtil.isVisible(node)) {
              siblingNode = node;
              break
            }
          }
        }
        if(siblingNode) {
          cursor.node = siblingNode;
          cursor.text = cvox.TraverseUtil.getNodeText(siblingNode);
          cursor.index = 0;
          break
        }
        if(cursor.node.parentNode && cursor.node.parentNode.constructor != HTMLBodyElement) {
          cursor.node = cursor.node.parentNode, cursor.text = null, cursor.index = 0
        }else {
          return null
        }
      }
    }
  }
};
cvox.TraverseUtil.backwardsChar = function(cursor, nodesCrossed) {
  for(;;) {
    cursor.node.constructor != Text && nodesCrossed.push(cursor.node);
    var childNode = null;
    if(!cvox.TraverseUtil.treatAsLeafNode(cursor.node)) {
      for(var i = cursor.node.childNodes.length - 1;i >= 0;i--) {
        var node = cursor.node.childNodes[i];
        if(cvox.TraverseUtil.isSkipped(node)) {
          nodesCrossed.push(node)
        }else {
          if(cvox.TraverseUtil.isVisible(node)) {
            childNode = node;
            break
          }
        }
      }
    }
    if(childNode) {
      cursor.node = childNode, cursor.text = cvox.TraverseUtil.getNodeText(cursor.node), cursor.index = cursor.text.length, cursor.node.constructor != Text && nodesCrossed.push(cursor.node)
    }else {
      if(cursor.index > 0) {
        return cursor.text[--cursor.index]
      }
      for(;;) {
        cursor.node.constructor != Text && nodesCrossed.push(cursor.node);
        for(var siblingNode = null, node = cursor.node.previousSibling;node != null;node = node.previousSibling) {
          if(cvox.TraverseUtil.isSkipped(node)) {
            nodesCrossed.push(node)
          }else {
            if(cvox.TraverseUtil.isVisible(node)) {
              siblingNode = node;
              break
            }
          }
        }
        if(siblingNode) {
          cursor.node = siblingNode;
          cursor.text = cvox.TraverseUtil.getNodeText(siblingNode);
          cursor.index = cursor.text.length;
          break
        }
        if(cursor.node.parentNode && cursor.node.parentNode.constructor != HTMLBodyElement) {
          cursor.node = cursor.node.parentNode, cursor.text = null, cursor.index = 0
        }else {
          return null
        }
      }
    }
  }
};
cvox.TraverseUtil.getNextChar = function(startCursor, endCursor, nodesCrossed, skipWhitespace) {
  startCursor.copyFrom(endCursor);
  var c = cvox.TraverseUtil.forwardsChar(endCursor, nodesCrossed);
  if(c == null) {
    return null
  }
  for(var initialWhitespace = cvox.TraverseUtil.isWhitespace(c);cvox.TraverseUtil.isWhitespace(c) || cvox.TraverseUtil.isSkipped(endCursor.node);) {
    if(c = cvox.TraverseUtil.forwardsChar(endCursor, nodesCrossed), c == null) {
      return null
    }
  }
  if(skipWhitespace || !initialWhitespace) {
    return startCursor.copyFrom(endCursor), startCursor.index--, c
  }else {
    for(var i = 0;i < nodesCrossed.length;i++) {
      if(cvox.TraverseUtil.isSkipped(nodesCrossed[i])) {
        return endCursor.index--, startCursor.copyFrom(endCursor), startCursor.index--, " "
      }
    }
    endCursor.index--;
    return" "
  }
};
cvox.TraverseUtil.getPreviousChar = function(startCursor, endCursor, nodesCrossed, skipWhitespace) {
  endCursor.copyFrom(startCursor);
  var c = cvox.TraverseUtil.backwardsChar(startCursor, nodesCrossed);
  if(c == null) {
    return null
  }
  for(var initialWhitespace = cvox.TraverseUtil.isWhitespace(c);cvox.TraverseUtil.isWhitespace(c) || cvox.TraverseUtil.isSkipped(startCursor.node);) {
    if(c = cvox.TraverseUtil.backwardsChar(startCursor, nodesCrossed), c == null) {
      return null
    }
  }
  if(skipWhitespace || !initialWhitespace) {
    return endCursor.copyFrom(startCursor), endCursor.index++, c
  }else {
    for(var i = 0;i < nodesCrossed.length;i++) {
      if(cvox.TraverseUtil.isSkipped(nodesCrossed[i])) {
        return startCursor.index++, endCursor.copyFrom(startCursor), endCursor.index++, " "
      }
    }
    startCursor.index++;
    return" "
  }
};
cvox.TraverseUtil.getNextWord = function(startCursor, endCursor, nodesCrossed) {
  var cursor = endCursor.clone(), c = cvox.TraverseUtil.forwardsChar(cursor, nodesCrossed);
  if(c == null) {
    return null
  }
  for(;cvox.TraverseUtil.isWhitespace(c) || cvox.TraverseUtil.isSkipped(cursor.node);) {
    if(c = cvox.TraverseUtil.forwardsChar(cursor, nodesCrossed), c == null) {
      return null
    }
  }
  startCursor.copyFrom(cursor);
  startCursor.index--;
  endCursor.copyFrom(cursor);
  var word = c, newNodesCrossed = [], c = cvox.TraverseUtil.forwardsChar(cursor, newNodesCrossed);
  if(c == null) {
    return word
  }
  for(;!cvox.TraverseUtil.isWhitespace(c) && newNodesCrossed.length == 0;) {
    if(word += c, endCursor.copyFrom(cursor), c = cvox.TraverseUtil.forwardsChar(cursor, newNodesCrossed), c == null) {
      break
    }
  }
  return word
};
cvox.TraverseUtil.getPreviousWord = function(startCursor, endCursor, nodesCrossed) {
  var cursor = startCursor.clone(), c = cvox.TraverseUtil.backwardsChar(cursor, nodesCrossed);
  if(c == null) {
    return null
  }
  for(;cvox.TraverseUtil.isWhitespace(c) || cvox.TraverseUtil.isSkipped(cursor.node);) {
    if(c = cvox.TraverseUtil.backwardsChar(cursor, nodesCrossed), c == null) {
      return null
    }
  }
  endCursor.copyFrom(cursor);
  endCursor.index++;
  startCursor.copyFrom(cursor);
  var word = c, newNodesCrossed = [], c = cvox.TraverseUtil.backwardsChar(cursor, newNodesCrossed);
  if(c == null) {
    return word
  }
  for(;!cvox.TraverseUtil.isWhitespace(c) && newNodesCrossed.length == 0;) {
    if(word = c + word, startCursor.copyFrom(cursor), c = cvox.TraverseUtil.backwardsChar(cursor, newNodesCrossed), c == null) {
      break
    }
  }
  return word
};
cvox.TraverseUtil.getNextSentence = function(startCursor, endCursor, nodesCrossed, breakTags) {
  return cvox.TraverseUtil.getNextString(startCursor, endCursor, nodesCrossed, function(str, word, nodes) {
    if(str.substr(-1) == ".") {
      return!0
    }
    for(var i = 0;i < nodes.length;i++) {
      if(cvox.TraverseUtil.isSkipped(nodes[i])) {
        return!0
      }
      var style = window.getComputedStyle(nodes[i], null);
      if(style && (style.display != "inline" || breakTags[nodes[i].tagName])) {
        return!0
      }
    }
    return!1
  })
};
cvox.TraverseUtil.getPreviousSentence = function(startCursor, endCursor, nodesCrossed, breakTags) {
  return cvox.TraverseUtil.getPreviousString(startCursor, endCursor, nodesCrossed, function(str, word, nodes) {
    if(word.substr(-1) == ".") {
      return!0
    }
    for(var i = 0;i < nodes.length;i++) {
      if(cvox.TraverseUtil.isSkipped(nodes[i])) {
        return!0
      }
      var style = window.getComputedStyle(nodes[i], null);
      if(style && (style.display != "inline" || breakTags[nodes[i].tagName])) {
        return!0
      }
    }
    return!1
  })
};
cvox.TraverseUtil.getNextLine = function(startCursor, endCursor, nodesCrossed, lineLength, breakTags) {
  return cvox.TraverseUtil.getNextString(startCursor, endCursor, nodesCrossed, function(str, word, nodes) {
    if(str.length + word.length + 1 > lineLength) {
      return!0
    }
    for(var i = 0;i < nodes.length;i++) {
      if(cvox.TraverseUtil.isSkipped(nodes[i])) {
        return!0
      }
      var style = window.getComputedStyle(nodes[i], null);
      if(style && (style.display != "inline" || breakTags[nodes[i].tagName])) {
        return!0
      }
    }
    return!1
  })
};
cvox.TraverseUtil.getPreviousLine = function(startCursor, endCursor, nodesCrossed, lineLength, breakTags) {
  return cvox.TraverseUtil.getPreviousString(startCursor, endCursor, nodesCrossed, function(str, word, nodes) {
    if(str.length + word.length + 1 > lineLength) {
      return!0
    }
    for(var i = 0;i < nodes.length;i++) {
      if(cvox.TraverseUtil.isSkipped(nodes[i])) {
        return!0
      }
      var style = window.getComputedStyle(nodes[i], null);
      if(style && (style.display != "inline" || breakTags[nodes[i].tagName])) {
        return!0
      }
    }
    return!1
  })
};
cvox.TraverseUtil.getNextParagraph = function(startCursor, endCursor, nodesCrossed) {
  return cvox.TraverseUtil.getNextString(startCursor, endCursor, nodesCrossed, function(str, word, nodes) {
    for(var i = 0;i < nodes.length;i++) {
      if(cvox.TraverseUtil.isSkipped(nodes[i])) {
        return!0
      }
      var style = window.getComputedStyle(nodes[i], null);
      if(style && style.display != "inline") {
        return!0
      }
    }
    return!1
  })
};
cvox.TraverseUtil.getPreviousParagraph = function(startCursor, endCursor, nodesCrossed) {
  return cvox.TraverseUtil.getPreviousString(startCursor, endCursor, nodesCrossed, function(str, word, nodes) {
    for(var i = 0;i < nodes.length;i++) {
      if(cvox.TraverseUtil.isSkipped(nodes[i])) {
        return!0
      }
      var style = window.getComputedStyle(nodes[i], null);
      if(style && style.display != "inline") {
        return!0
      }
    }
    return!1
  })
};
cvox.TraverseUtil.getNextString = function(startCursor, endCursor, nodesCrossed, breakBefore) {
  var wordStartCursor = endCursor.clone(), wordEndCursor = endCursor.clone(), newNodesCrossed = [], str = "", word = cvox.TraverseUtil.getNextWord(wordStartCursor, wordEndCursor, newNodesCrossed);
  if(word == null) {
    return null
  }
  for(startCursor.copyFrom(wordStartCursor);!str || !breakBefore(str, word, newNodesCrossed);) {
    if(str && (str += " "), str += word, endCursor.copyFrom(wordEndCursor), newNodesCrossed = [], word = cvox.TraverseUtil.getNextWord(wordStartCursor, wordEndCursor, newNodesCrossed), word == null) {
      break
    }
  }
  return str
};
cvox.TraverseUtil.getPreviousString = function(startCursor, endCursor, nodesCrossed, breakBefore) {
  var wordStartCursor = startCursor.clone(), wordEndCursor = startCursor.clone(), newNodesCrossed = [], str = "", word = cvox.TraverseUtil.getPreviousWord(wordStartCursor, wordEndCursor, newNodesCrossed);
  if(word == null) {
    return null
  }
  for(endCursor.copyFrom(wordEndCursor);!str || !breakBefore(str, word, newNodesCrossed);) {
    if(str && (str = " " + str), str = word + str, startCursor.copyFrom(wordStartCursor), newNodesCrossed = [], word = cvox.TraverseUtil.getPreviousWord(wordStartCursor, wordEndCursor, newNodesCrossed), word == null) {
      break
    }
  }
  return str
};
cvox.XpathUtil = function() {
};
cvox.XpathUtil.evalXPath = function(expression, rootNode) {
  try {
    var xpathIterator = rootNode.ownerDocument.evaluate(expression, rootNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
  }catch(err) {
    return[]
  }
  for(var results = [], xpathNode = xpathIterator.iterateNext();xpathNode;xpathNode = xpathIterator.iterateNext()) {
    results.push(xpathNode)
  }
  return results
};
cvox.XpathUtil.getLeafNodes = function(rootNode) {
  try {
    var xpathIterator = rootNode.ownerDocument.evaluate(".//*[count(*)=0]", rootNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
  }catch(err) {
    return[]
  }
  for(var results = [], xpathNode = xpathIterator.iterateNext();xpathNode;xpathNode = xpathIterator.iterateNext()) {
    results.push(xpathNode)
  }
  return results
};
cvox.XpathUtil.xpathSupported = function() {
  if(typeof XPathResult == "undefined") {
    return!1
  }
  return!0
};
cvox.DomUtil = function() {
};
cvox.DomUtil.INPUT_TYPE_TO_INFORMATION_TABLE = {button:"Button", checkbox:"Check box", color:"Color picker", datetime:"Date time control", "datetime-local":"Date time control", date:"Date control", email:"Edit text for email", file:"File selection", hidden:"", image:"Button", month:"Month control", number:"Edit text numeric only", password:"Password edit text", radio:"Radio button", range:"Slider", reset:"Reset", search:"Edit text for search", submit:"Button", tel:"Edit text for telephone number", 
text:"Edit text", url:"Edit text for URL", week:"Week of the year control"};
cvox.DomUtil.TAG_TO_INFORMATION_TABLE = {A:"Link", H1:"Heading 1", H2:"Heading 2", H3:"Heading 3", H4:"Heading 4", H5:"Heading 5", H6:"Heading 6", BUTTON:"Button", SELECT:"Combo box", TABLE:"Table", TEXTAREA:"Text area"};
cvox.DomUtil.isInvisibleStyle = function(style) {
  if(!style) {
    return!1
  }
  if(style.display == "none") {
    return!0
  }
  if(style.visibility == "hidden") {
    return!0
  }
  if(style.opacity == 0) {
    return!0
  }
  return!1
};
cvox.DomUtil.isLeafNode = function(node) {
  if(node.nodeType == 1) {
    var style = document.defaultView.getComputedStyle(node, null);
    if(cvox.DomUtil.isInvisibleStyle(style)) {
      return!0
    }
  }
  if(cvox.AriaUtil.isHidden(node)) {
    return!0
  }
  if(node.tagName) {
    if(node.tagName == "OBJECT") {
      return!0
    }
    if(node.tagName == "EMBED") {
      return!0
    }
    if(node.tagName == "VIDEO") {
      return!0
    }
    if(node.tagName == "AUDIO") {
      return!0
    }
    if(node.tagName == "LABEL") {
      return!0
    }
    if(node.tagName == "IFRAME") {
      return!0
    }
    if(node.tagName == "FRAME") {
      return!0
    }
  }
  if(cvox.DomUtil.isControl(node)) {
    return!0
  }
  if(!node.firstChild) {
    return!0
  }
  return!1
};
cvox.DomUtil.isDescendantOf = function(node, tagName, className) {
  for(;node;) {
    if(tagName && className && node.tagName && node.tagName == tagName && node.className && node.className == className) {
      return!0
    }else {
      if(tagName && !className && node.tagName && node.tagName == tagName) {
        return!0
      }else {
        if(!tagName && className && node.className && node.className == className) {
          return!0
        }
      }
    }
    node = node.parentNode
  }
  return!1
};
cvox.DomUtil.isDescendantOfNode = function(node, ancestor) {
  for(;node && ancestor;) {
    if(node.isSameNode(ancestor)) {
      return!0
    }
    node = node.parentNode
  }
  return!1
};
cvox.DomUtil.getLabel = function(node, useHeuristics) {
  var label = "";
  if(!node) {
    return""
  }
  if(node.hasAttribute && node.hasAttribute("aria-labelledby")) {
    for(var labelNodeIds = node.getAttribute("aria-labelledby").split(" "), labelNodeId, i = 0;labelNodeId = labelNodeIds[i];i++) {
      var labelNode = document.getElementById(labelNodeId);
      label += cvox.DomUtil.getText(labelNode) + " "
    }
  }else {
    if(node && node.id) {
      var labels = cvox.XpathUtil.evalXPath('//label[@for="' + node.id + '"]', document.body);
      labels.length > 0 && (label += cvox.DomUtil.getText(labels[0]) + " ")
    }
  }
  if(label.length < 1 && node.hasAttribute && node.getAttribute("role") == "button") {
    for(var i = 0, child;child = node.childNodes[i];i++) {
      var childStyle = window.getComputedStyle(child, null);
      !cvox.DomUtil.isInvisibleStyle(childStyle) && !cvox.AriaUtil.isHidden(node) && (label += " " + cvox.DomUtil.getText(child))
    }
  }
  if(useHeuristics && label.length < 1) {
    for(var prevNode = cvox.DomUtil.previousLeafNode(node), prevTraversalCount = 0;prevNode && (!cvox.DomUtil.hasContent(prevNode) || cvox.DomUtil.isControl(prevNode));) {
      prevNode = cvox.DomUtil.previousLeafNode(prevNode), prevTraversalCount++
    }
    for(var nextNode = cvox.DomUtil.previousLeafNode(node), nextTraversalCount = 0;nextNode && (!cvox.DomUtil.hasContent(nextNode) || cvox.DomUtil.isControl(nextNode));) {
      nextNode = cvox.DomUtil.nextLeafNode(nextNode), nextTraversalCount++
    }
    var guessedLabelNode;
    if(prevNode && nextNode) {
      for(var parentNode = node, prevCount = 0;parentNode;) {
        if(cvox.DomUtil.isDescendantOfNode(prevNode, parentNode)) {
          break
        }
        parentNode = parentNode.parentNode;
        prevCount++
      }
      for(var parentNode = node, nextCount = 0;parentNode;) {
        if(cvox.DomUtil.isDescendantOfNode(nextNode, parentNode)) {
          break
        }
        parentNode = parentNode.parentNode;
        nextCount++
      }
      guessedLabelNode = nextCount < prevCount ? nextNode : prevNode
    }else {
      guessedLabelNode = prevNode || nextNode
    }
    guessedLabelNode && (label += cvox.DomUtil.getText(guessedLabelNode) + " ")
  }
  return label
};
cvox.DomUtil.getTitle = function(node) {
  if(node.constructor == Text) {
    return node.data
  }else {
    if(node.constructor == HTMLImageElement) {
      return cvox.DomUtil.getImageTitle(node)
    }else {
      if(node.hasAttribute && node.hasAttribute("title")) {
        return node.getAttribute("title")
      }else {
        if(node.constructor == HTMLInputElement) {
          if(node.type == "image") {
            return cvox.DomUtil.getImageTitle(node)
          }else {
            if(node.type == "submit") {
              return node.hasAttribute && node.hasAttribute("value") ? node.getAttribute("value") : "Submit"
            }else {
              if(node.type == "reset") {
                return node.hasAttribute && node.hasAttribute("value") ? node.getAttribute("value") : "Reset"
              }
            }
          }
        }else {
          if(node.constructor == HTMLButtonElement) {
            for(var titleText = "", i = 0, child;child = node.childNodes[i];i++) {
              titleText += cvox.DomUtil.getText(child) + " "
            }
            return titleText
          }
        }
      }
    }
  }
  return""
};
cvox.DomUtil.getValue = function(node) {
  if(node.constructor == HTMLSelectElement) {
    return node.selectedIndex >= 0 && node.selectedIndex < node.options.length ? node.options[node.selectedIndex].text + "" : ""
  }
  if(node.constructor == HTMLTextAreaElement) {
    return node.value
  }
  if(node.constructor == HTMLInputElement) {
    switch(node.type) {
      case "hidden":
      ;
      case "image":
      ;
      case "submit":
      ;
      case "reset":
      ;
      case "checkbox":
      ;
      case "radio":
        break;
      case "password":
        return node.value.replace(/./g, "*");
      default:
        return node.value
    }
  }
  return""
};
cvox.DomUtil.getText = function(node) {
  var title = cvox.DomUtil.getTitle(node), value = cvox.DomUtil.getValue(node);
  title.length == 0 && (title = cvox.DomUtil.getLabel(node, !1));
  var text = "";
  if(title && value) {
    text = value + " " + title
  }else {
    if(title) {
      text = title
    }else {
      if(value) {
        text = value
      }else {
        if(!cvox.DomUtil.isControl(node)) {
          for(var i = 0;i < node.childNodes.length;i++) {
            var child = node.childNodes[i], childStyle = window.getComputedStyle(child, null);
            !cvox.DomUtil.isInvisibleStyle(childStyle) && !cvox.AriaUtil.isHidden(node) && (text += " " + cvox.DomUtil.getText(child))
          }
        }
      }
    }
  }
  return text = text.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "")
};
cvox.DomUtil.getImageTitle = function(node) {
  var text;
  if(node.hasAttribute("alt")) {
    text = node.alt
  }else {
    if(node.hasAttribute("title")) {
      text = node.title
    }else {
      var url = node.src;
      if(url.substring(0, 4) != "data") {
        var filename = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
        text = filename.length >= 1 && filename.length <= 16 ? filename + " Image" : "Image"
      }else {
        text = "Image"
      }
    }
  }
  return text
};
cvox.DomUtil.hasContent = function(node) {
  if(node.nodeType == 8) {
    return!1
  }
  if(cvox.DomUtil.isDescendantOf(node, "HEAD")) {
    return!1
  }
  if(cvox.DomUtil.isDescendantOf(node, "SCRIPT")) {
    return!1
  }
  if(cvox.DomUtil.isDescendantOf(node, "NOSCRIPT")) {
    return!1
  }
  if(cvox.DomUtil.isDescendantOf(node, "STYLE")) {
    return!1
  }
  for(var closestStyledParent = node;closestStyledParent && closestStyledParent.nodeType == 3;) {
    closestStyledParent = closestStyledParent.parentNode
  }
  if(closestStyledParent) {
    var style = document.defaultView.getComputedStyle(closestStyledParent, null);
    if(cvox.DomUtil.isInvisibleStyle(style)) {
      return!1
    }
    for(var tempNode = closestStyledParent;tempNode && tempNode.tagName != "BODY";) {
      style = document.defaultView.getComputedStyle(tempNode, null);
      if(cvox.DomUtil.isInvisibleStyle(style)) {
        return!1
      }
      tempNode = tempNode.parentNode
    }
  }
  if(cvox.AriaUtil.isHidden(node)) {
    return!1
  }
  if(cvox.DomUtil.isControl(node)) {
    return!0
  }
  if(node.tagName == "IFRAME") {
    return!0
  }
  var text = cvox.DomUtil.getText(node);
  if(text === "") {
    return!1
  }
  return!0
};
cvox.DomUtil.getAncestors = function(targetNode) {
  for(var ancestors = [];targetNode;) {
    ancestors.push(targetNode), targetNode = targetNode.parentNode
  }
  for(ancestors.reverse();ancestors.length && !ancestors[0].tagName && !ancestors[0].nodeValue;) {
    ancestors.shift()
  }
  return ancestors
};
cvox.DomUtil.compareAncestors = function(ancestorsA, ancestorsB) {
  for(var i = 0;ancestorsA[i] && ancestorsB[i] && ancestorsA[i] == ancestorsB[i];) {
    i++
  }
  !ancestorsA[i] && !ancestorsB[i] && (i = -1);
  return i
};
cvox.DomUtil.getUniqueAncestors = function(previousNode, currentNode) {
  var prevAncestors = cvox.DomUtil.getAncestors(previousNode), currentAncestors = cvox.DomUtil.getAncestors(currentNode), divergence = cvox.DomUtil.compareAncestors(prevAncestors, currentAncestors);
  return currentAncestors.slice(divergence)
};
cvox.DomUtil.getBasicNodeInformation = function(targetNode) {
  var info = cvox.DomUtil.getBasicNodeRole(targetNode);
  info.length > 0 && (info = info + " " + cvox.DomUtil.getBasicNodeState(targetNode));
  return info
};
cvox.DomUtil.getBasicNodeRole = function(targetNode) {
  var info;
  (info = cvox.AriaUtil.getRoleName(targetNode)) || (info = targetNode.tagName == "INPUT" ? cvox.DomUtil.INPUT_TYPE_TO_INFORMATION_TABLE[targetNode.type] : cvox.DomUtil.TAG_TO_INFORMATION_TABLE[targetNode.tagName]);
  info || (info = "");
  return info
};
cvox.DomUtil.getBasicNodeState = function(targetNode) {
  var info;
  (info = cvox.AriaUtil.getState(targetNode)) ? info += " " : info = "";
  if(targetNode.tagName == "INPUT") {
    if(targetNode.type == "checkbox" || targetNode.type == "radio") {
      info += targetNode.checked ? " checked" : " not checked"
    }
  }else {
    targetNode.tagName == "SELECT" && (info = info + " " + (targetNode.selectedIndex + 1) + " of " + targetNode.options.length)
  }
  return info
};
cvox.DomUtil.getInformationFromAncestors = function(ancestorsArray) {
  for(var info = "", i = 0, node;node = ancestorsArray[i];i++) {
    var nodeInfo = cvox.DomUtil.getBasicNodeInformation(node);
    nodeInfo.length > 0 && (info = info + " " + nodeInfo)
  }
  return info
};
cvox.DomUtil.setFocus = function(targetNode) {
  for(document.activeElement && !cvox.DomUtil.isDescendantOfNode(targetNode, document.activeElement) && document.activeElement.blur();targetNode && (typeof targetNode.tabIndex == "undefined" || targetNode.tabIndex == -1);) {
    if(targetNode.tagName && targetNode.tagName == "LABEL") {
      if(targetNode.htmlFor && document.getElementById(targetNode.htmlFor)) {
        targetNode = document.getElementById(targetNode.htmlFor)
      }else {
        var inputElems = targetNode.getElementsByTagName("INPUT"), targetNode = inputElems && inputElems.length > 0 ? inputElems[0] : targetNode.parentNode
      }
    }else {
      targetNode = targetNode.parentNode
    }
  }
  if(targetNode && typeof targetNode.tabIndex != "undefined" && targetNode.tabIndex != -1) {
    targetNode.focus()
  }else {
    if(document.activeElement && document.activeElement.tagName != "BODY") {
      var sel = window.getSelection();
      if(sel.rangeCount > 0) {
        var range = sel.getRangeAt(0);
        document.activeElement.blur();
        sel.removeAllRanges();
        sel.addRange(range)
      }
    }
  }
};
cvox.DomUtil.isAttachedToDocument = function(targetNode) {
  for(;targetNode;) {
    if(targetNode.tagName && targetNode.tagName == "HTML") {
      return!0
    }
    targetNode = targetNode.parentNode
  }
  return!1
};
cvox.DomUtil.clickElem = function(targetNode, shiftKey) {
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("mousedown", !0, !0, document.defaultView, 1, 0, 0, 0, 0, !1, !1, shiftKey, !1, 0, null);
  try {
    targetNode.dispatchEvent(evt)
  }catch(e) {
  }
  evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("mouseup", !0, !0, document.defaultView, 1, 0, 0, 0, 0, !1, !1, shiftKey, !1, 0, null);
  try {
    targetNode.dispatchEvent(evt)
  }catch(e$$0) {
  }
  evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("click", !0, !0, document.defaultView, 1, 0, 0, 0, 0, !1, !1, shiftKey, !1, 0, null);
  try {
    targetNode.dispatchEvent(evt)
  }catch(e$$1) {
  }
  var href = targetNode.getAttribute("href");
  if(targetNode.tagName == "A" && href && href != "#") {
    shiftKey ? window.open(targetNode.href) : document.location = targetNode.href
  }
};
cvox.DomUtil.isInputTypeText = function(node) {
  if(node.constructor != HTMLInputElement) {
    return!1
  }
  switch(node.type) {
    case "email":
    ;
    case "number":
    ;
    case "password":
    ;
    case "search":
    ;
    case "text":
    ;
    case "tel":
    ;
    case "url":
    ;
    case "":
      return!0;
    default:
      return!1
  }
};
cvox.DomUtil.isControl = function(node) {
  if(cvox.AriaUtil.isControlWidget(node)) {
    return!0
  }
  if(node.tagName) {
    switch(node.tagName) {
      case "BUTTON":
      ;
      case "INPUT":
      ;
      case "TEXTAREA":
      ;
      case "SELECT":
        return!0
    }
  }
  if(node.isContentEditable) {
    return!0
  }
  return!1
};
cvox.DomUtil.nextLeafNode = function(node) {
  for(var tempNode = node;tempNode && !tempNode.nextSibling;) {
    tempNode = tempNode.parentNode
  }
  if(tempNode && tempNode.nextSibling) {
    for(tempNode = tempNode.nextSibling;!cvox.DomUtil.isLeafNode(tempNode);) {
      tempNode = tempNode.firstChild
    }
  }
  return tempNode
};
cvox.DomUtil.previousLeafNode = function(node) {
  for(var tempNode = node;tempNode && !tempNode.previousSibling;) {
    tempNode = tempNode.parentNode
  }
  if(tempNode && tempNode.previousSibling) {
    for(tempNode = tempNode.previousSibling;!cvox.DomUtil.isLeafNode(tempNode);) {
      tempNode = tempNode.lastChild
    }
  }
  return tempNode
};
cvox.DomUtil.getControlValueAndStateString = function(control) {
  var controlValue = cvox.DomUtil.getValue(control), controlState = cvox.DomUtil.getBasicNodeState(control), controlTitle = cvox.DomUtil.getTitle(control), controlLabel = cvox.DomUtil.getLabel(control, !1);
  controlTitle.length < 1 && controlLabel.length < 1 && (controlLabel = cvox.DomUtil.getLabel(control, !0));
  return controlLabel + " " + controlTitle + " " + controlValue + " " + controlState
};
cvox.ChromeVoxEditableTextBase = function(value, start, end, isPassword, tts) {
  this.value = value;
  this.start = start;
  this.end = end;
  this.isPassword = isPassword;
  this.tts = tts
};
cvox.ChromeVoxEditableTextBase.prototype.multiline = !1;
cvox.ChromeVoxEditableTextBase.prototype.cursorIsBlock = !1;
cvox.ChromeVoxEditableTextBase.prototype.maxShortPhraseLen = 60;
cvox.ChromeVoxEditableTextBase.prototype.isPassword = !1;
cvox.ChromeVoxEditableTextBase.prototype.describe = function() {
  this.speak(this.getDescription())
};
cvox.ChromeVoxEditableTextBase.prototype.getDescription = function() {
  var speech = "";
  if(this.multiline) {
    if(speech += "multiline editable text. ", this.start == this.end) {
      var line = this.getLine(this.getLineIndex(this.start));
      speech += line ? line : "blank."
    }
  }else {
    speech += this.node ? cvox.DomUtil.getControlValueAndStateString(this.node) : this.value, speech += speech.length <= this.maxShortPhraseLen ? ", editable text." : "editable text."
  }
  return speech
};
cvox.ChromeVoxEditableTextBase.prototype.getLineIndex = function() {
  return 0
};
cvox.ChromeVoxEditableTextBase.prototype.getLineStart = function() {
  return 0
};
cvox.ChromeVoxEditableTextBase.prototype.getLineEnd = function() {
  return this.value.length
};
cvox.ChromeVoxEditableTextBase.prototype.getLine = function(index) {
  var lineStart = this.getLineStart(index), lineEnd = this.getLineEnd(index), line = this.value.substr(lineStart, lineEnd - lineStart);
  return line.replace(/^\s+|\s+$/g, "")
};
cvox.ChromeVoxEditableTextBase.prototype.isWhitespaceChar = function(ch) {
  return ch == " " || ch == "\n" || ch == "\r" || ch == "\t"
};
cvox.ChromeVoxEditableTextBase.prototype.isWordBreakChar = function(ch) {
  return ch == " " || ch == "\n" || ch == "\r" || ch == "\t" || ch == "," || ch == "." || ch == "/"
};
cvox.ChromeVoxEditableTextBase.prototype.describeChar = function(ch) {
  if(ch.length != 1) {
    return ch
  }
  switch(ch) {
    case " ":
      return"space.";
    case "`":
      return"backtick.";
    case "~":
      return"tilde.";
    case "!":
      return"bang.";
    case "@":
      return"at.";
    case "#":
      return"pound.";
    case "$":
      return"dollar.";
    case "%":
      return"percent.";
    case "^":
      return"caret.";
    case "&":
      return"ampersand.";
    case "*":
      return"asterisk.";
    case "(":
      return"open paren.";
    case ")":
      return"close paren.";
    case "-":
      return"hyphen.";
    case "_":
      return"underscore.";
    case "=":
      return"equals.";
    case "+":
      return"plus.";
    case "[":
      return"left bracket.";
    case "]":
      return"right bracket.";
    case "{":
      return"left brace.";
    case "}":
      return"right brace.";
    case "|":
      return"pipe.";
    case ";":
      return"semicolon.";
    case ":":
      return"colon.";
    case ",":
      return"comma.";
    case ".":
      return"period.";
    case "<":
      return"less than.";
    case ">":
      return"greater than.";
    case "/":
      return"slash.";
    case "?":
      return"question mark.";
    case "\t":
      return"tab.";
    case "\r":
      return"return.";
    case "\n":
      return"return.";
    case "\\":
      return"backslash.";
    default:
      return ch.toUpperCase() + "."
  }
};
cvox.ChromeVoxEditableTextBase.prototype.speak = function(str) {
  str.length == 1 ? this.tts.speak(this.describeChar(str), 0, {}) : str.length > 1 && this.tts.speak(str, 0, {})
};
cvox.ChromeVoxEditableTextBase.prototype.saveState = function() {
  return{value:this.value, start:this.start, end:this.end}
};
cvox.ChromeVoxEditableTextBase.prototype.restoreState = function(state) {
  this.value = state.value;
  this.start = state.start;
  this.end = state.end
};
cvox.ChromeVoxEditableTextBase.prototype.needsUpdate = function() {
  return!1
};
cvox.ChromeVoxEditableTextBase.prototype.changed = function(newValue, newStart, newEnd) {
  if(!(newValue == this.value && newStart == this.start && newEnd == this.end)) {
    newValue == this.value ? this.describeSelectionChanged(newStart, newEnd) : this.describeTextChanged(newValue, newStart, newEnd), this.value = newValue, this.start = newStart, this.end = newEnd
  }
};
cvox.ChromeVoxEditableTextBase.prototype.describeSelectionChanged = function(newStart, newEnd) {
  this.isPassword ? this.speak("*") : newStart == newEnd ? this.start != this.end ? this.speak("Unselected.") : this.getLineIndex(this.start) != this.getLineIndex(newStart) ? this.speak(this.getLine(this.getLineIndex(newStart))) : this.start == newStart + 1 || this.start == newStart - 1 ? this.cursorIsBlock ? newStart == this.value.length ? this.speak("end") : this.speak(this.value.substr(newStart, 1)) : this.speak(this.value.substr(Math.min(this.start, newStart), 1)) : this.speak(this.value.substr(Math.min(this.start, 
  newStart), Math.abs(this.start - newStart))) : this.start + 1 == newStart && this.end == this.value.length && newEnd == this.value.length ? this.speak(this.describeChar(this.value.substr(this.start, 1)) + ", " + this.describeChar(this.value.substr(newStart))) : this.start == this.end ? this.speak(this.describeChar(this.value.substr(newStart, newEnd - newStart)) + ", selected.") : this.start == newStart && this.end < newEnd ? this.speak(this.describeChar(this.value.substr(this.end, newEnd - this.end)) + 
  ", added to selection.") : this.start == newStart && this.end > newEnd ? this.speak(this.describeChar(this.value.substr(newEnd, this.end - newEnd)) + ", removed from selection.") : this.end == newEnd && this.start > newStart ? this.speak(this.describeChar(this.value.substr(newStart, this.start - newStart)) + ", added to selection.") : this.end == newEnd && this.start < newStart ? this.speak(this.describeChar(this.value.substr(this.start, newStart - this.start)) + ", removed from selection.") : 
  this.speak(this.describeChar(this.value.substr(newStart, newEnd - newStart)) + ", selected.")
};
cvox.ChromeVoxEditableTextBase.prototype.describeTextChanged = function(newValue, newStart, newEnd) {
  var value = this.value, len = value.length, newLen = newValue.length, autocompleteSuffix = "";
  newStart < newEnd && newEnd == newLen && (autocompleteSuffix = newValue.substr(newStart), newValue = newValue.substr(0, newStart), newEnd = newStart);
  var prefixLen = this.start, suffixLen = len - this.end;
  if(newLen >= prefixLen + suffixLen + (newEnd - newStart) && newValue.substr(0, prefixLen) == value.substr(0, prefixLen) && newValue.substr(newLen - suffixLen) == value.substr(this.end)) {
    this.describeTextChangedHelper(newValue, newStart, newEnd, prefixLen, suffixLen, autocompleteSuffix)
  }else {
    if(prefixLen = newStart, suffixLen = newLen - newEnd, this.start == this.end && newStart == newEnd && newValue.substr(0, prefixLen) == value.substr(0, prefixLen) && newValue.substr(newLen - suffixLen) == value.substr(len - suffixLen)) {
      this.describeTextChangedHelper(newValue, newStart, newEnd, prefixLen, suffixLen, autocompleteSuffix)
    }else {
      if(newValue += autocompleteSuffix, newLen <= this.maxShortPhraseLen) {
        this.describeTextChangedHelper(newValue, newStart, newEnd, 0, 0, "")
      }else {
        for(prefixLen = 0;prefixLen < len && prefixLen < newLen && value[prefixLen] == newValue[prefixLen];) {
          prefixLen++
        }
        for(;prefixLen > 0 && !this.isWordBreakChar(value[prefixLen - 1]);) {
          prefixLen--
        }
        for(suffixLen = 0;suffixLen < len - prefixLen && suffixLen < newLen - prefixLen && value[len - suffixLen - 1] == newValue[newLen - suffixLen - 1];) {
          suffixLen++
        }
        for(;suffixLen > 0 && !this.isWordBreakChar(value[len - suffixLen]);) {
          suffixLen--
        }
        this.describeTextChangedHelper(newValue, newStart, newEnd, prefixLen, suffixLen, "")
      }
    }
  }
};
cvox.ChromeVoxEditableTextBase.prototype.describeTextChangedHelper = function(newValue, newStart, newEnd, prefixLen, suffixLen, autocompleteSuffix) {
  if(this.isPassword) {
    this.speak("*")
  }else {
    var len = this.value.length, newLen = newValue.length, deletedLen = len - prefixLen - suffixLen, deleted = this.value.substr(prefixLen, deletedLen), insertedLen = newLen - prefixLen - suffixLen, inserted = newValue.substr(prefixLen, insertedLen), utterance = "";
    if(insertedLen > 1) {
      utterance = inserted
    }else {
      if(insertedLen == 1) {
        if(this.isWordBreakChar(inserted) && prefixLen > 0 && !this.isWordBreakChar(newValue.substr(prefixLen - 1, 1))) {
          for(var index = prefixLen;index > 0 && !this.isWordBreakChar(newValue[index - 1]);) {
            index--
          }
          utterance = index < prefixLen ? newValue.substr(index, prefixLen + 1 - index) : this.describeChar(inserted)
        }else {
          utterance = this.describeChar(inserted)
        }
      }else {
        deletedLen > 1 && !autocompleteSuffix ? utterance = deleted + ", deleted." : deletedLen == 1 && (utterance = this.describeChar(deleted))
      }
    }
    autocompleteSuffix && utterance ? utterance += ", " + autocompleteSuffix : autocompleteSuffix && (utterance = autocompleteSuffix);
    this.speak(utterance)
  }
};
cvox.ChromeVoxEditableElement = function() {
  this.justSpokeDescription = !1
};
goog.inherits(cvox.ChromeVoxEditableElement, cvox.ChromeVoxEditableTextBase);
cvox.ChromeVoxEditableElement.prototype.justSpokeDescription = !1;
cvox.ChromeVoxEditableElement.prototype.changed = function(newValue, newStart, newEnd) {
  if(this.justSpokeDescription && this.value == newValue) {
    this.value = newValue, this.start = newStart, this.end = newEnd, this.justSpokeDescription = !1
  }
  cvox.ChromeVoxEditableTextBase.prototype.changed.apply(this, [newValue, newStart, newEnd])
};
cvox.ChromeVoxEditableElement.prototype.getDescription = function() {
  var speech = "";
  this.node.title && (speech = cvox.DomUtil.getTitle(this.node) + ". ");
  speech = cvox.DomUtil.getLabel(this.node, speech.length < 1);
  this.justSpokeDescription = !0;
  return speech + " " + cvox.ChromeVoxEditableTextBase.prototype.getDescription.apply(this)
};
cvox.ChromeVoxEditableHTMLInput = function(node, tts) {
  this.node = node;
  this.value = node.value;
  this.start = node.selectionStart;
  this.end = node.selectionEnd;
  this.tts = tts;
  if(this.node.type == "password") {
    this.value = this.value.replace(/./g, "*")
  }
};
goog.inherits(cvox.ChromeVoxEditableHTMLInput, cvox.ChromeVoxEditableElement);
cvox.ChromeVoxEditableHTMLInput.prototype.update = function() {
  var newValue = this.node.value;
  this.node.type == "password" && (newValue = newValue.replace(/./g, "*"));
  this.changed(newValue, this.node.selectionStart, this.node.selectionEnd)
};
cvox.ChromeVoxEditableHTMLInput.prototype.needsUpdate = function() {
  var newValue = this.node.value;
  this.node.type == "password" && (newValue = newValue.replace(/./g, "*"));
  return this.value != newValue || this.start != this.node.selectionStart || this.end != this.node.selectionEnd
};
cvox.ChromeVoxEditableTextArea = function(node, tts) {
  this.node = node;
  this.value = node.value;
  this.start = node.selectionStart;
  this.end = node.selectionEnd;
  this.tts = tts;
  this.multiline = !0;
  this.shadowIsCurrent = !1;
  this.characterToLineMap = {};
  this.lines = {}
};
goog.inherits(cvox.ChromeVoxEditableTextArea, cvox.ChromeVoxEditableElement);
cvox.ChromeVoxEditableTextArea.prototype.update = function() {
  if(this.node.value != this.value) {
    this.shadowIsCurrent = !1
  }
  this.changed(this.node.value, this.node.selectionStart, this.node.selectionEnd)
};
cvox.ChromeVoxEditableTextArea.prototype.needsUpdate = function() {
  return this.value != this.node.value || this.start != this.node.selectionStart || this.end != this.node.selectionEnd
};
cvox.ChromeVoxEditableTextArea.prototype.getLineIndex = function(index) {
  this.shadowIsCurrent || this.updateShadow();
  return this.characterToLineMap[index]
};
cvox.ChromeVoxEditableTextArea.prototype.getLineStart = function(index) {
  this.shadowIsCurrent || this.updateShadow();
  return this.lines[index].startIndex
};
cvox.ChromeVoxEditableTextArea.prototype.getLineEnd = function(index) {
  this.shadowIsCurrent || this.updateShadow();
  return this.lines[index].endIndex
};
cvox.ChromeVoxEditableTextArea.prototype.updateShadow = function() {
  var shadow = cvox.ChromeVoxEditableTextArea.shadow;
  if(!shadow) {
    shadow = document.createElement("div"), document.body.appendChild(shadow), cvox.ChromeVoxEditableTextArea.shadow = shadow
  }
  for(;shadow.childNodes.length;) {
    shadow.removeChild(shadow.childNodes[0])
  }
  shadow.style.cssText = window.getComputedStyle(this.node, null).cssText;
  shadow.style.visibility = "hidden";
  shadow.style.position = "absolute";
  shadow.style.top = -9999;
  shadow.style.left = -9999;
  var shadowWrap = document.createElement("div");
  shadow.appendChild(shadowWrap);
  for(var text = this.node.value, lastWasWhitespace = !1, currentSpan = null, i = 0;i < text.length;i++) {
    var ch = text[i], isWhitespace = this.isWhitespaceChar(ch);
    if(isWhitespace != lastWasWhitespace || i == 0) {
      currentSpan = document.createElement("span"), currentSpan.startIndex = i, shadowWrap.appendChild(currentSpan)
    }
    currentSpan.innerText += ch;
    currentSpan.endIndex = i;
    lastWasWhitespace = isWhitespace
  }
  currentSpan ? currentSpan.endIndex = text.length : (currentSpan = document.createElement("span"), currentSpan.startIndex = 0, currentSpan.endIndex = 0, shadowWrap.appendChild(currentSpan));
  this.characterToLineMap = {};
  this.lines = {};
  for(var firstSpan = shadowWrap.childNodes[0], lineIndex = -1, lineOffset = -1, n = firstSpan;n;n = n.nextSibling) {
    if(n.offsetTop > lineOffset) {
      lineIndex++, this.lines[lineIndex] = {}, this.lines[lineIndex].startIndex = n.startIndex, lineOffset = n.offsetTop
    }
    this.lines[lineIndex].endIndex = n.endIndex;
    for(var j = n.startIndex;j <= n.endIndex;j++) {
      this.characterToLineMap[j] = lineIndex
    }
  }
  this.shadowIsCurrent = !0
};
cvox.ChromeVoxEditableContentEditable = function(node, tts) {
  this.node = node;
  this.value = node.textContent;
  var sel = window.getSelection();
  this.currentChildNode = sel.anchorNode;
  this.end = this.start = 0;
  this.tts = tts;
  this.multiline = !0;
  this.shadowIsCurrent = !1;
  this.characterToLineMap = {};
  this.lines = {}
};
goog.inherits(cvox.ChromeVoxEditableContentEditable, cvox.ChromeVoxEditableElement);
cvox.ChromeVoxEditableContentEditable.prototype.update = function() {
  var sel = window.getSelection(), cursorNode = sel.anchorNode;
  if(this.currentChildNode != cursorNode) {
    this.currentChildNode = cursorNode, this.end = this.start = 0
  }
  var updatedValue = cursorNode.textContent, updatedSelectionStart = sel.anchorOffset, updatedSelectionEnd = sel.focusOffset, goingBackwards = !1;
  if(updatedSelectionStart > updatedSelectionEnd) {
    updatedSelectionEnd = sel.anchorOffset, updatedSelectionStart = sel.focusOffset, goingBackwards = !0
  }
  if(updatedValue != this.value) {
    this.shadowIsCurrent = !1
  }
  this.changed(updatedValue, updatedSelectionStart, updatedSelectionEnd);
  this.start = goingBackwards ? updatedSelectionStart : updatedSelectionEnd
};
cvox.ChromeVoxEditableContentEditable.prototype.needsUpdate = function() {
  return this.value != this.node.textContent || this.start != this.node.selectionStart || this.end != this.node.selectionEnd
};
cvox.ChromeVoxEditableContentEditable.prototype.getLineIndex = function() {
  this.shadowIsCurrent || this.updateShadow();
  return 0
};
cvox.ChromeVoxEditableContentEditable.prototype.getLineStart = function(index) {
  this.shadowIsCurrent || this.updateShadow();
  return this.lines[index].startIndex
};
cvox.ChromeVoxEditableContentEditable.prototype.getLineEnd = function(index) {
  this.shadowIsCurrent || this.updateShadow();
  return this.lines[index].endIndex
};
cvox.ChromeVoxEditableContentEditable.prototype.updateShadow = function() {
  var shadow = cvox.ChromeVoxEditableContentEditable.shadow;
  if(!shadow) {
    shadow = document.createElement("div"), document.body.appendChild(shadow), cvox.ChromeVoxEditableContentEditable.shadow = shadow
  }
  for(;shadow.childNodes.length;) {
    shadow.removeChild(shadow.childNodes[0])
  }
  shadow.style.cssText = window.getComputedStyle(this.node, null).cssText;
  shadow.style.visibility = "hidden";
  shadow.style.position = "absolute";
  shadow.style.top = -9999;
  shadow.style.left = -9999;
  var shadowWrap = document.createElement("div");
  shadow.appendChild(shadowWrap);
  var text = this.node.value;
  if(!text) {
    text = this.node.textContent
  }
  for(var lastWasWhitespace = !1, currentSpan = null, i = 0;i < text.length;i++) {
    var ch = text[i], isWhitespace = this.isWhitespaceChar(ch);
    if(isWhitespace != lastWasWhitespace || i == 0) {
      currentSpan = document.createElement("span"), currentSpan.startIndex = i, shadowWrap.appendChild(currentSpan)
    }
    currentSpan.innerText += ch;
    currentSpan.endIndex = i;
    lastWasWhitespace = isWhitespace
  }
  currentSpan ? currentSpan.endIndex = text.length : (currentSpan = document.createElement("span"), currentSpan.startIndex = 0, currentSpan.endIndex = 0, shadowWrap.appendChild(currentSpan));
  this.characterToLineMap = {};
  this.lines = {};
  for(var firstSpan = shadowWrap.childNodes[0], lineIndex = -1, lineOffset = -1, n = firstSpan;n;n = n.nextSibling) {
    if(n.offsetTop > lineOffset) {
      lineIndex++, this.lines[lineIndex] = {}, this.lines[lineIndex].startIndex = n.startIndex, lineOffset = n.offsetTop
    }
    this.lines[lineIndex].endIndex = n.endIndex;
    for(var j = n.startIndex;j <= n.endIndex;j++) {
      this.characterToLineMap[j] = lineIndex
    }
  }
  this.shadowIsCurrent = !0
};
cvox.LinearDomWalker = function() {
  this.currentNode = null;
  this.currentAncestors = [];
  this.previousNode = null
};
cvox.LinearDomWalker.prototype.getCurrentNode = function() {
  return this.currentNode
};
cvox.LinearDomWalker.prototype.setCurrentNode = function(node) {
  this.currentNode = node;
  this.currentAncestors = [];
  for(var ancestor = this.currentNode;ancestor;) {
    this.currentAncestors.push(ancestor), ancestor = ancestor.parentNode
  }
  this.currentAncestors.reverse()
};
cvox.LinearDomWalker.prototype.next = function() {
  if((this.previousNode = this.currentNode) && !cvox.DomUtil.isAttachedToDocument(this.currentNode)) {
    for(var i = this.currentAncestors.length - 1, ancestor;ancestor = this.currentAncestors[i];i--) {
      if(cvox.DomUtil.isAttachedToDocument(ancestor)) {
        this.setCurrentNode(ancestor);
        this.previous();
        this.next();
        break
      }
    }
  }
  return this.nextContentNode()
};
cvox.LinearDomWalker.prototype.previous = function() {
  if((this.previousNode = this.currentNode) && !cvox.DomUtil.isAttachedToDocument(this.currentNode)) {
    for(var i = this.currentAncestors.length - 1, ancestor;ancestor = this.currentAncestors[i];i--) {
      if(cvox.DomUtil.isAttachedToDocument(ancestor)) {
        this.setCurrentNode(ancestor);
        this.next();
        this.previous();
        break
      }
    }
  }
  return this.prevContentNode()
};
cvox.LinearDomWalker.prototype.nextNode = function() {
  if(this.currentNode) {
    for(;this.currentNode && !this.currentNode.nextSibling;) {
      this.setCurrentNode(this.currentNode.parentNode)
    }
    this.currentNode && this.currentNode.nextSibling && this.setCurrentNode(this.currentNode.nextSibling)
  }else {
    this.setCurrentNode(document.body)
  }
  if(!this.currentNode) {
    return null
  }
  for(;!this.isLeafNode(this.currentNode);) {
    this.setCurrentNode(this.currentNode.firstChild)
  }
  return this.currentNode
};
cvox.LinearDomWalker.prototype.nextContentNode = function() {
  for(this.nextNode();this.currentNode && !cvox.DomUtil.hasContent(this.currentNode);) {
    this.nextNode()
  }
  return this.currentNode
};
cvox.LinearDomWalker.prototype.prevNode = function() {
  if(this.currentNode) {
    for(;this.currentNode && !this.currentNode.previousSibling;) {
      this.setCurrentNode(this.currentNode.parentNode)
    }
    this.currentNode && this.currentNode.previousSibling && this.setCurrentNode(this.currentNode.previousSibling)
  }else {
    this.setCurrentNode(document.body)
  }
  if(!this.currentNode) {
    return null
  }
  for(;!this.isLeafNode(this.currentNode);) {
    this.setCurrentNode(this.currentNode.lastChild)
  }
  return this.currentNode
};
cvox.LinearDomWalker.prototype.prevContentNode = function() {
  for(this.prevNode();this.currentNode && !cvox.DomUtil.hasContent(this.currentNode);) {
    this.prevNode()
  }
  return this.currentNode
};
cvox.LinearDomWalker.prototype.getUniqueAncestors = function() {
  return cvox.DomUtil.getUniqueAncestors(this.previousNode, this.currentNode)
};
cvox.LinearDomWalker.prototype.isLeafNode = function(targetNode) {
  if(cvox.DomUtil.isLeafNode(targetNode)) {
    return!0
  }
  return!1
};
cvox.SelectionUtil = function() {
};
cvox.SelectionUtil.cleanUpParagraphForward = function(sel) {
  for(;sel.focusNode.nodeType == 3;) {
    var fnode = sel.focusNode, foffset = sel.focusOffset;
    sel.modify("extend", "forward", "sentence");
    if(fnode == sel.focusNode && foffset == sel.focusOffset) {
      return!1
    }
  }
  return!0
};
cvox.SelectionUtil.cleanUpParagraphBack = function(sel) {
  for(var fnode, foffset;sel.focusNode.nodeType == 3;) {
    if(fnode = sel.focusNode, foffset = sel.focusOffset, sel.modify("extend", "backward", "sentence"), fnode == sel.focusNode && foffset == sel.focusOffset) {
      break
    }
  }
  return!0
};
cvox.SelectionUtil.cleanUpSentence = function(sel) {
  for(var expand = !0;expand;) {
    if(sel.focusNode.nodeType == 3) {
      var fnode = sel.focusNode, foffset = sel.focusOffset;
      if(sel.rangeCount > 0 && sel.getRangeAt(0).endOffset > 0) {
        if(fnode.substringData(sel.getRangeAt(0).endOffset - 1, 1) == ".") {
          break
        }else {
          if(fnode.substringData(sel.getRangeAt(0).endOffset - 1, 1) == " ") {
            break
          }else {
            if(sel.modify("extend", "forward", "sentence"), fnode == sel.focusNode && foffset == sel.focusOffset) {
              return!1
            }
          }
        }
      }else {
        break
      }
    }else {
      break
    }
  }
  return!0
};
cvox.SelectionUtil.findSelPosition = function(sel) {
  if(sel.rangeCount == 0) {
    return[0, 0]
  }
  var clientRect = sel.getRangeAt(0).getBoundingClientRect(), top = window.pageYOffset + clientRect.top, left = window.pageXOffset + clientRect.left;
  return[top, left]
};
cvox.SelectionUtil.findTopLeftPosition = function(targetNode) {
  var left = 0, top = 0, obj = targetNode;
  if(obj.offsetParent) {
    left = obj.offsetLeft;
    top = obj.offsetTop;
    for(obj = obj.offsetParent;obj !== null;) {
      left += obj.offsetLeft, top += obj.offsetTop, obj = obj.offsetParent
    }
  }
  return[top, left]
};
cvox.SelectionUtil.isSelectionValid = function(sel) {
  var regExpWhiteSpace = RegExp(/^\s+$/);
  return!(regExpWhiteSpace.test(sel.toString()) || sel.toString() == "")
};
cvox.SelectionUtil.scrollToSelection = function(sel) {
  if(sel.rangeCount != 0) {
    var pos = cvox.SelectionUtil.findSelPosition(sel), top = pos[0], left = pos[1], scrolledVertically = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop, pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight, pageWidth = window.innerWidth || document.documentElement.innerWidth || document.body.clientWidth;
    left < pageWidth && (left = 0);
    if(scrolledVertically + pageHeight < top) {
      var diff = top - pageHeight;
      window.scroll(left, diff + 100)
    }else {
      top < scrolledVertically && window.scroll(left, top - 100)
    }
  }
};
cvox.SelectionUtil.isAllWs = function(node) {
  return!/[^\t\n\r ]/.test(node.data)
};
cvox.SelectionUtil.isIgnorable = function(node) {
  return node.nodeType == 8 || node.nodeType == 3 && cvox.SelectionUtil.isAllWs(node)
};
cvox.SelectionUtil.nodeBefore = function(sib) {
  for(;sib = sib.previousSibling;) {
    if(!cvox.SelectionUtil.isIgnorable(sib)) {
      return sib
    }
  }
  return null
};
cvox.SelectionUtil.nodeAfter = function(sib) {
  for(;sib = sib.nextSibling;) {
    if(!cvox.SelectionUtil.isIgnorable(sib)) {
      return sib
    }
  }
  return null
};
cvox.SelectionUtil.lastChildNode = function(par) {
  for(var res = par.lastChild;res;) {
    if(!cvox.SelectionUtil.isIgnorable(res)) {
      return res
    }
    res = res.previousSibling
  }
  return null
};
cvox.SelectionUtil.firstChildNode = function(par) {
  for(var res = par.firstChild;res;) {
    if(!cvox.SelectionUtil.isIgnorable(res)) {
      return res
    }
    res = res.nextSibling
  }
  return null
};
cvox.SelectionUtil.dataOf = function(txt) {
  var data = txt.data, data = data.replace(/[\t\n\r ]+/g, " ");
  data.charAt(0) == " " && (data = data.substring(1, data.length));
  data.charAt(data.length - 1) == " " && (data = data.substring(0, data.length - 1));
  return data
};
cvox.SelectionUtil.hasContentWithTag = function(sel, tagName) {
  if(!sel || !sel.anchorNode || !sel.focusNode) {
    return!1
  }
  if(sel.anchorNode.tagName && sel.anchorNode.tagName == tagName) {
    return!0
  }
  if(sel.focusNode.tagName && sel.focusNode.tagName == tagName) {
    return!0
  }
  if(sel.anchorNode.parentNode.tagName && sel.anchorNode.parentNode.tagName == tagName) {
    return!0
  }
  if(sel.focusNode.parentNode.tagName && sel.focusNode.parentNode.tagName == tagName) {
    return!0
  }
  var docFrag = sel.getRangeAt(0).cloneContents(), span = document.createElement("span");
  span.appendChild(docFrag);
  return span.getElementsByTagName(tagName).length > 0
};
cvox.SelectionUtil.selectText = function(textNode, start, end) {
  var newRange = document.createRange();
  newRange.setStart(textNode, start);
  newRange.setEnd(textNode, end);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(newRange)
};
cvox.SelectionUtil.selectAllTextInNode = function(node) {
  var newRange = document.createRange();
  newRange.setStart(node, 0);
  newRange.setEndAfter(node);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(newRange)
};
cvox.SelectionUtil.collapseToStart = function(node) {
  var sel = window.getSelection(), cursorNode = sel.anchorNode, cursorOffset = sel.anchorOffset;
  cursorNode == null && (cursorNode = node, cursorOffset = 0);
  var newRange = document.createRange();
  newRange.setStart(cursorNode, cursorOffset);
  newRange.setEnd(cursorNode, cursorOffset);
  sel.removeAllRanges();
  sel.addRange(newRange)
};
cvox.SelectionUtil.collapseToEnd = function(node) {
  var sel = window.getSelection(), cursorNode = sel.focusNode, cursorOffset = sel.focusOffset;
  cursorNode == null && (cursorNode = node, cursorOffset = 0);
  var newRange = document.createRange();
  newRange.setStart(cursorNode, cursorOffset);
  newRange.setEnd(cursorNode, cursorOffset);
  sel.removeAllRanges();
  sel.addRange(newRange)
};
cvox.SelectionUtil.getText = function() {
  var text = "", sel = window.getSelection();
  if(cvox.SelectionUtil.hasContentWithTag(sel, "IMG")) {
    var docFrag = sel.getRangeAt(0).cloneContents(), span = document.createElement("span");
    span.appendChild(docFrag);
    for(var leafNodes = cvox.XpathUtil.getLeafNodes(span), i = 0, node;node = leafNodes[i];i++) {
      text = text + " " + cvox.DomUtil.getText(node)
    }
  }else {
    text += sel
  }
  return text
};
cvox.TableUtil = {};
cvox.TableUtil.checkIfHeader = function(cell) {
  return cell.tagName == "TH" || cell.hasAttribute("scope")
};
cvox.TableUtil.determineColGroups = function(colGroups) {
  var colToColGroup = [];
  if(colGroups.length == 0) {
    return colToColGroup
  }
  for(var colGroupCtr = 0;colGroupCtr < colGroups.length;colGroupCtr++) {
    var currentColGroup = colGroups[colGroupCtr], childCols = cvox.TableUtil.getColNodes(currentColGroup);
    if(childCols.length > 0) {
      for(var colNodeCtr = 0;colNodeCtr < childCols.length;colNodeCtr++) {
        var colElement = childCols[colNodeCtr];
        if(colElement.hasAttribute("span")) {
          for(var span = parseInt(colElement.getAttribute("span"), 10), s = 0;s < span;s++) {
            colToColGroup.push(colGroupCtr)
          }
        }else {
          colToColGroup.push(colGroupCtr)
        }
      }
    }else {
      if(currentColGroup.hasAttribute("span")) {
        span = parseInt(currentColGroup.getAttribute("span"), 10);
        for(s = 0;s < span;s++) {
          colToColGroup.push(colGroupCtr)
        }
      }else {
        colToColGroup.push(colGroupCtr)
      }
    }
  }
  return colToColGroup
};
cvox.TableUtil.pushIfNotContained = function(givenArray, givenElement) {
  givenArray.indexOf(givenElement) == -1 && givenArray.push(givenElement)
};
cvox.TableUtil.getChildRows = function(table) {
  return cvox.XpathUtil.evalXPath("child::tbody/tr | child::thead/tr", table)
};
cvox.TableUtil.getChildCells = function(rowNode) {
  return cvox.XpathUtil.evalXPath("child::td | child::th", rowNode)
};
cvox.TableUtil.getCellWithID = function(table, cellID) {
  return cvox.XpathUtil.evalXPath("id('" + cellID + "')", table)
};
cvox.TableUtil.getColGroups = function(table) {
  return cvox.XpathUtil.evalXPath("child::colgroup", table)
};
cvox.TableUtil.getColNodes = function(colGroupNode) {
  return cvox.XpathUtil.evalXPath("child::col", colGroupNode)
};
cvox.TraverseContent = function(domObj) {
  this.currentDomObj = domObj != null ? domObj : document.body
};
cvox.TraverseContent.prototype.skipWhitespace = !0;
cvox.TraverseContent.prototype.lineLength = 40;
cvox.TraverseContent.prototype.skipInvalidSelections = !0;
cvox.TraverseContent.prototype.breakAtLinks = !1;
cvox.TraverseContent.kCharacter = "character";
cvox.TraverseContent.kWord = "word";
cvox.TraverseContent.kSentence = "sentence";
cvox.TraverseContent.kLine = "line";
cvox.TraverseContent.kParagraph = "paragraph";
cvox.TraverseContent.kAllGrains = [cvox.TraverseContent.kParagraph, cvox.TraverseContent.kSentence, cvox.TraverseContent.kLine, cvox.TraverseContent.kWord, cvox.TraverseContent.kCharacter];
cvox.TraverseContent.prototype.moveNext = function(grain) {
  this.normalizeSelection();
  var selection = window.getSelection(), startCursor = new Cursor(selection.anchorNode, selection.anchorOffset, cvox.TraverseUtil.getNodeText(selection.anchorNode)), endCursor = new Cursor(selection.focusNode, selection.focusOffset, cvox.TraverseUtil.getNodeText(selection.focusNode)), breakTags = this.getBreakTags(), skipWhitespace = this.skipWhitespace;
  cvox.SelectionUtil.isSelectionValid(selection) || (skipWhitespace = !0);
  var nodesCrossed = [], str;
  do {
    if(grain === cvox.TraverseContent.kSentence ? str = cvox.TraverseUtil.getNextSentence(startCursor, endCursor, nodesCrossed, breakTags) : grain === cvox.TraverseContent.kWord ? str = cvox.TraverseUtil.getNextWord(startCursor, endCursor, nodesCrossed) : grain === cvox.TraverseContent.kCharacter ? str = cvox.TraverseUtil.getNextChar(startCursor, endCursor, nodesCrossed, skipWhitespace) : grain === cvox.TraverseContent.kParagraph ? str = cvox.TraverseUtil.getNextParagraph(startCursor, endCursor, 
    nodesCrossed) : grain === cvox.TraverseContent.kLine ? str = cvox.TraverseUtil.getNextLine(startCursor, endCursor, nodesCrossed, this.lineLength, breakTags) : (console.log('Invalid selection granularity: "' + grain + '"'), grain = cvox.TraverseContent.kSentence, str = cvox.TraverseUtil.getNextSentence(startCursor, endCursor, nodesCrossed, breakTags)), selection = cvox.TraverseUtil.setSelection(startCursor, endCursor), str == null) {
      return null
    }
  }while(this.skipInvalidSelections && selection.isCollapsed);
  if(!cvox.DomUtil.isDescendantOfNode(selection.focusNode, selection.anchorNode) && selection.anchorNode.nodeType == 3) {
    return cvox.SelectionUtil.selectText(selection.anchorNode, selection.anchorOffset, selection.anchorNode.textContent.length), window.getSelection()
  }
  return selection
};
cvox.TraverseContent.prototype.movePrev = function(grain) {
  this.normalizeSelection();
  var selection = window.getSelection(), startCursor = new Cursor(selection.anchorNode, selection.anchorOffset, cvox.TraverseUtil.getNodeText(selection.anchorNode)), endCursor = new Cursor(selection.focusNode, selection.focusOffset, cvox.TraverseUtil.getNodeText(selection.focusNode)), breakTags = this.getBreakTags(), skipWhitespace = this.skipWhitespace;
  cvox.SelectionUtil.isSelectionValid(selection);
  var nodesCrossed = [], str;
  do {
    if(grain === cvox.TraverseContent.kSentence ? str = cvox.TraverseUtil.getPreviousSentence(startCursor, endCursor, nodesCrossed, breakTags) : grain === cvox.TraverseContent.kWord ? str = cvox.TraverseUtil.getPreviousWord(startCursor, endCursor, nodesCrossed) : grain === cvox.TraverseContent.kCharacter ? (skipWhitespace = this.skipWhitespace, cvox.SelectionUtil.isSelectionValid(selection) || (skipWhitespace = !0), str = cvox.TraverseUtil.getPreviousChar(startCursor, endCursor, nodesCrossed, skipWhitespace)) : 
    grain === cvox.TraverseContent.kParagraph ? str = cvox.TraverseUtil.getPreviousParagraph(startCursor, endCursor, nodesCrossed) : grain === cvox.TraverseContent.kLine ? str = cvox.TraverseUtil.getPreviousLine(startCursor, endCursor, nodesCrossed, this.lineLength, breakTags) : (console.log('Invalid selection granularity: "' + grain + '"'), grain = cvox.TraverseContent.kSentence, str = cvox.TraverseUtil.getPreviousSentence(startCursor, endCursor, nodesCrossed, breakTags)), selection = cvox.TraverseUtil.setSelection(startCursor, 
    endCursor), str == null) {
      return null
    }
  }while(this.skipInvalidSelections && selection.isCollapsed);
  if(!cvox.DomUtil.isDescendantOfNode(selection.focusNode, selection.anchorNode) && selection.focusNode.nodeType == 3) {
    return cvox.SelectionUtil.selectText(selection.focusNode, 0, selection.focusOffset), window.getSelection()
  }
  return selection
};
cvox.TraverseContent.prototype.getBreakTags = function() {
  return this.breakAtLinks ? {A:!0} : {}
};
cvox.TraverseContent.prototype.nextElement = function(grain, domObj) {
  if(domObj != null) {
    this.currentDomObj = domObj
  }
  grain === "sentence" || grain === "word" || grain === "character" || grain === "paragraph" || (console.log('Invalid selection granularity: "' + grain + '"'), grain = "sentence");
  var sel = this.moveNext(grain);
  if(sel != null && (!cvox.DomUtil.isDescendantOfNode(sel.anchorNode, this.currentDomObj) || !cvox.DomUtil.isDescendantOfNode(sel.focusNode, this.currentDomObj))) {
    return null
  }
  sel != null && cvox.SelectionUtil.scrollToSelection(window.getSelection());
  return sel
};
cvox.TraverseContent.prototype.prevElement = function(grain, domObj) {
  if(domObj != null) {
    this.currentDomObj = domObj
  }
  grain === "sentence" || grain === "word" || grain === "character" || grain === "paragraph" || (console.log('Invalid selection granularity: "' + grain + '"'), grain = "sentence");
  var sel = this.movePrev(grain);
  if(sel != null && (!cvox.DomUtil.isDescendantOfNode(sel.anchorNode, this.currentDomObj) || !cvox.DomUtil.isDescendantOfNode(sel.focusNode, this.currentDomObj))) {
    return null
  }
  sel != null && cvox.SelectionUtil.scrollToSelection(window.getSelection());
  return sel
};
cvox.TraverseContent.prototype.normalizeSelection = function() {
  var selection = window.getSelection();
  if(selection.rangeCount < 1) {
    var range = document.createRange();
    range.setStart(this.currentDomObj, 0);
    range.setEnd(this.currentDomObj, 0);
    selection.removeAllRanges();
    selection.addRange(range)
  }else {
    if(selection.rangeCount > 1) {
      for(var i = 0;i < selection.rangeCount - 1;i++) {
        selection.removeRange(selection.getRangeAt(i))
      }
    }
  }
};
cvox.TraverseContent.prototype.reset = function() {
  window.getSelection().removeAllRanges()
};
cvox.SelectionWalker = function() {
  this.traverseContent = new cvox.TraverseContent;
  this.currentGranularity = 0
};
cvox.SelectionWalker.GRANULARITY_LEVELS = ["sentence", "word", "character"];
cvox.SelectionWalker.prototype.lessGranular = function(forwards) {
  this.currentGranularity -= 1;
  if(this.currentGranularity < 0) {
    return this.currentGranularity = 0, !1
  }
  forwards ? (cvox.SelectionUtil.collapseToStart(this.traverseContent.currentDomObj), this.next()) : (cvox.SelectionUtil.collapseToEnd(this.traverseContent.currentDomObj), this.previous());
  return!0
};
cvox.SelectionWalker.prototype.moreGranular = function(forwards) {
  this.currentGranularity += 1;
  var max = cvox.SelectionWalker.GRANULARITY_LEVELS.length - 1;
  if(this.currentGranularity > max) {
    return this.currentGranularity = max, !1
  }
  forwards ? (cvox.SelectionUtil.collapseToStart(this.traverseContent.currentDomObj), this.next()) : (cvox.SelectionUtil.collapseToEnd(this.traverseContent.currentDomObj), this.previous());
  return!0
};
cvox.SelectionWalker.prototype.next = function() {
  var status = this.traverseContent.nextElement(cvox.SelectionWalker.GRANULARITY_LEVELS[this.currentGranularity]);
  return!!status
};
cvox.SelectionWalker.prototype.previous = function() {
  var status = this.traverseContent.prevElement(cvox.SelectionWalker.GRANULARITY_LEVELS[this.currentGranularity]);
  return!!status
};
cvox.SelectionWalker.prototype.getGranularity = function() {
  return cvox.SelectionWalker.GRANULARITY_LEVELS[this.currentGranularity]
};
cvox.SelectionWalker.prototype.setCurrentNode = function(currentNode) {
  if(currentNode != this.traverseContent.currentDomObj) {
    this.traverseContent = new cvox.TraverseContent(currentNode), this.traverseContent.reset()
  }
};
cvox.SelectionWalker.prototype.getCurrentContent = function() {
  return cvox.SelectionUtil.getText()
};
function ShadowTableNode() {
}
cvox.TraverseTable = function(tableNode) {
  this.activeTable_ = null;
  this.shadowTable_ = [];
  this.candidateHeaders_ = [];
  this.idToShadowNode_ = [];
  this.initialize(tableNode)
};
cvox.TraverseTable.prototype.colCount = null;
cvox.TraverseTable.prototype.rowCount = null;
cvox.TraverseTable.prototype.tableRowHeaders = null;
cvox.TraverseTable.prototype.tableColHeaders = null;
cvox.TraverseTable.prototype.initialize = function(tableNode) {
  this.activeTable_ = tableNode;
  this.currentCellCursor = null;
  this.tableRowHeaders = [];
  this.tableColHeaders = [];
  this.buildShadowTable_();
  this.colCount = this.shadowColCount_();
  this.rowCount = this.countRows_();
  this.findHeaderCells_();
  var self = this;
  this.activeTable_.addEventListener("DOMSubtreeModified", function() {
    self.buildShadowTable_();
    self.colCount = self.shadowColCount_();
    self.rowCount = self.countRows_();
    self.tableRowHeaders = [];
    self.tableColHeaders = [];
    self.findHeaderCells_();
    self.getCell(self.currentCellCursor) == null && self.attachCursorToNearestCell_()
  }, !1)
};
cvox.TraverseTable.prototype.attachCursorToNearestCell_ = function() {
  var currentCursor = this.currentCellCursor, currentRow = this.shadowTable_[currentCursor[0]];
  if(currentRow) {
    this.currentCellCursor = [currentCursor[0], currentRow.length - 1]
  }else {
    var numRows = this.shadowTable_.length;
    if(numRows == 0) {
      this.currentCellCursor = null
    }else {
      var aboveCell = this.shadowTable_[numRows - 1][currentCursor[1]];
      aboveCell ? this.currentCellCursor = [numRows - 1, currentCursor[1]] : this.goToLastCell()
    }
  }
};
cvox.TraverseTable.prototype.buildShadowTable_ = function() {
  this.shadowTable_ = [];
  for(var allRows = cvox.TableUtil.getChildRows(this.activeTable_), currentRowParent = null, currentRowGroup = null, colGroups = cvox.TableUtil.getColGroups(this.activeTable_), colToColGroup = cvox.TableUtil.determineColGroups(colGroups), ctr = 0;ctr < allRows.length;ctr++) {
    this.shadowTable_.push([])
  }
  for(var i = 0;i < allRows.length;i++) {
    for(var childCells = cvox.TableUtil.getChildCells(allRows[i]), activeTableCol = 0, shadowTableCol = 0;activeTableCol < childCells.length;) {
      if(this.shadowTable_[i][shadowTableCol] == null) {
        var activeTableCell = childCells[activeTableCol], colsSpanned = 1, rowsSpanned = 1;
        if(activeTableCell.hasAttribute("colspan") && (colsSpanned = parseInt(activeTableCell.getAttribute("colspan"), 10), isNaN(colsSpanned) || colsSpanned <= 0)) {
          colsSpanned = 1
        }
        if(activeTableCell.hasAttribute("rowspan") && (rowsSpanned = parseInt(activeTableCell.getAttribute("rowspan"), 10), isNaN(rowsSpanned) || rowsSpanned <= 0)) {
          rowsSpanned = 1
        }
        for(var r = 0;r < rowsSpanned;r++) {
          for(var c = 0;c < colsSpanned;c++) {
            var shadowNode = new ShadowTableNode;
            r == 0 && c == 0 ? (shadowNode.spanned = !1, shadowNode.rowSpan = !1, shadowNode.colSpan = !1) : (shadowNode.spanned = !0, shadowNode.rowSpan = rowsSpanned > 1, shadowNode.colSpan = colsSpanned > 1);
            shadowNode.i = i;
            shadowNode.j = shadowTableCol;
            shadowNode.activeCell = activeTableCell;
            shadowNode.rowHeaderCells = [];
            shadowNode.colHeaderCells = [];
            cvox.TableUtil.checkIfHeader(shadowNode.activeCell) ? this.candidateHeaders_.push(shadowNode) : shadowNode.activeCell.hasAttribute("headers") && this.candidateHeaders_.push(shadowNode);
            if(currentRowParent == null) {
              currentRowParent = allRows[i].parentNode, currentRowGroup = 0
            }else {
              if(allRows[i].parentNode != currentRowParent) {
                currentRowParent = allRows[i].parentNode, currentRowGroup += 1
              }
            }
            shadowNode.rowGroup = currentRowGroup;
            shadowNode.colGroup = colToColGroup.length > 0 ? colToColGroup[shadowTableCol] : 0;
            shadowNode.spanned || activeTableCell.id != null && (this.idToShadowNode_[activeTableCell.id] = shadowNode);
            this.shadowTable_[i + r][shadowTableCol + c] = shadowNode
          }
        }
        shadowTableCol += colsSpanned;
        activeTableCol++
      }else {
        shadowTableCol += 1
      }
    }
  }
};
cvox.TraverseTable.prototype.findHeaderCells_ = function() {
  for(var i = 0;i < this.candidateHeaders_.length;i++) {
    var currentShadowNode = this.candidateHeaders_[i], currentCell = currentShadowNode.activeCell, assumedScope = null, specifiedScope = null;
    currentCell.tagName == "TH" && !currentCell.hasAttribute("scope") ? (currentShadowNode.j > 0 ? this.shadowTable_[currentShadowNode.i][currentShadowNode.j - 1].activeCell.tagName == "TH" && (assumedScope = "col") : currentShadowNode.j < this.shadowTable_[currentShadowNode.i].length - 1 ? this.shadowTable_[currentShadowNode.i][currentShadowNode.j + 1].activeCell.tagName == "TH" && (assumedScope = "col") : assumedScope = "col", assumedScope == null && (currentShadowNode.i > 0 ? this.shadowTable_[currentShadowNode.i - 
    1][currentShadowNode.j].activeCell.tagName == "TH" && (assumedScope = "row") : currentShadowNode.i < this.shadowTable_.length - 1 ? this.shadowTable_[currentShadowNode.i + 1][currentShadowNode.j].activeCell.tagName == "TH" && (assumedScope = "row") : assumedScope = "row")) : currentCell.hasAttribute("scope") && (specifiedScope = currentCell.getAttribute("scope"));
    if(specifiedScope == "row" || assumedScope == "row") {
      for(var rightCtr = currentShadowNode.j + 1;rightCtr < this.shadowTable_[currentShadowNode.i].length;rightCtr++) {
        var rightShadowNode = this.shadowTable_[currentShadowNode.i][rightCtr], rightCell = rightShadowNode.activeCell;
        if((rightCell.tagName == "TH" || rightCell.hasAttribute("scope")) && rightCtr < this.shadowTable_[currentShadowNode.i].length - 1) {
          var checkDataCell = this.shadowTable_[currentShadowNode.i][rightCtr + 1];
          if(checkDataCell.activeCell.tagName == "TD") {
            break
          }
        }
        rightShadowNode.rowHeaderCells.push(currentCell)
      }
      currentShadowNode.spanned != !0 && this.tableRowHeaders.push(currentCell)
    }else {
      if(specifiedScope == "col" || assumedScope == "col") {
        for(var downCtr = currentShadowNode.i + 1;downCtr < this.shadowTable_.length;downCtr++) {
          var downShadowNode = this.shadowTable_[downCtr][currentShadowNode.j];
          if(downShadowNode == null) {
            break
          }
          var downCell = downShadowNode.activeCell;
          if((downCell.tagName == "TH" || downCell.hasAttribute("scope")) && downCtr < this.shadowTable_.length - 1) {
            if(checkDataCell = this.shadowTable_[downCtr + 1][currentShadowNode.j], checkDataCell.activeCell.tagName == "TD") {
              break
            }
          }
          downShadowNode.colHeaderCells.push(currentCell)
        }
        currentShadowNode.spanned != !0 && this.tableColHeaders.push(currentCell)
      }else {
        if(specifiedScope == "rowgroup") {
          for(var currentRowGroup = currentShadowNode.rowGroup, cellsInRow = currentShadowNode.j + 1;cellsInRow < this.shadowTable_[currentShadowNode.i].length;cellsInRow++) {
            this.shadowTable_[currentShadowNode.i][cellsInRow].rowHeaderCells.push(currentCell)
          }
          for(downCtr = currentShadowNode.i + 1;downCtr < this.shadowTable_.length;downCtr++) {
            if(this.shadowTable_[downCtr][0].rowGroup != currentRowGroup) {
              break
            }
            for(rightCtr = 0;rightCtr < this.shadowTable_[downCtr].length;rightCtr++) {
              this.shadowTable_[downCtr][rightCtr].rowHeaderCells.push(currentCell)
            }
          }
          currentShadowNode.spanned != !0 && this.tableRowHeaders.push(currentCell)
        }else {
          if(specifiedScope == "colgroup") {
            for(var currentColGroup = currentShadowNode.colGroup, cellsInCol = currentShadowNode.j + 1;cellsInCol < this.shadowTable_[currentShadowNode.i].length;cellsInCol++) {
              this.shadowTable_[currentShadowNode.i][cellsInCol].colGroup == currentColGroup && this.shadowTable_[currentShadowNode.i][cellsInCol].colHeaderCells.push(currentCell)
            }
            for(downCtr = currentShadowNode.i + 1;downCtr < this.shadowTable_.length;downCtr++) {
              for(rightCtr = 0;rightCtr < this.shadowTable_[downCtr].length;rightCtr++) {
                this.shadowTable_[downCtr][rightCtr].colGroup == currentColGroup && this.shadowTable_[downCtr][rightCtr].colHeaderCells.push(currentCell)
              }
            }
            currentShadowNode.spanned != !0 && this.tableColHeaders.push(currentCell)
          }
        }
      }
    }
    currentCell.hasAttribute("headers") && this.findAttrbHeaders_(currentShadowNode)
  }
};
cvox.TraverseTable.prototype.findAttrbHeaders_ = function(currentShadowNode) {
  for(var activeTableCell = currentShadowNode.activeCell, idList = activeTableCell.getAttribute("headers").split(" "), idToken = 0;idToken < idList.length;idToken++) {
    for(var idCellArray = cvox.TableUtil.getCellWithID(this.activeTable_, idList[idToken]), idCtr = 0;idCtr < idCellArray.length;idCtr++) {
      if(idCellArray[idCtr].id == activeTableCell.id) {
        break
      }
      var possibleHeaderNode = this.idToShadowNode_[idCellArray[idCtr].id];
      if(!cvox.TableUtil.checkIfHeader(possibleHeaderNode.activeCell)) {
        var iDiff = Math.abs(possibleHeaderNode.i - currentShadowNode.i), jDiff = Math.abs(possibleHeaderNode.j - currentShadowNode.j);
        iDiff == 0 || iDiff < jDiff ? (cvox.TableUtil.pushIfNotContained(currentShadowNode.rowHeaderCells, possibleHeaderNode.activeCell), cvox.TableUtil.pushIfNotContained(this.tableRowHeaders, possibleHeaderNode.activeCell)) : (cvox.TableUtil.pushIfNotContained(currentShadowNode.colHeaderCells, possibleHeaderNode.activeCell), cvox.TableUtil.pushIfNotContained(this.tableColHeaders, possibleHeaderNode.activeCell))
      }
    }
  }
};
cvox.TraverseTable.prototype.getCell = function() {
  var shadowEntry = this.shadowTable_[this.currentCellCursor[0]][this.currentCellCursor[1]];
  return shadowEntry.activeCell
};
cvox.TraverseTable.prototype.getCellAt = function(index) {
  if(index[0] < this.rowCount && index[0] >= 0 && index[1] < this.colCount && index[1] >= 0) {
    var shadowEntry = this.shadowTable_[index[0]][index[1]];
    if(shadowEntry != null) {
      return shadowEntry.activeCell
    }
  }
  return null
};
cvox.TraverseTable.prototype.getCellRowHeaders = function() {
  var shadowEntry = this.shadowTable_[this.currentCellCursor[0]][this.currentCellCursor[1]];
  return shadowEntry.rowHeaderCells
};
cvox.TraverseTable.prototype.getCellColHeaders = function() {
  var shadowEntry = this.shadowTable_[this.currentCellCursor[0]][this.currentCellCursor[1]];
  return shadowEntry.colHeaderCells
};
cvox.TraverseTable.prototype.isSpanned = function() {
  var shadowEntry = this.shadowTable_[this.currentCellCursor[0]][this.currentCellCursor[1]];
  return shadowEntry.spanned
};
cvox.TraverseTable.prototype.getCol = function() {
  for(var colArray = [], i = 0;i < this.shadowTable_.length;i++) {
    if(this.shadowTable_[i][this.currentCellCursor[1]]) {
      var shadowEntry = this.shadowTable_[i][this.currentCellCursor[1]];
      if(shadowEntry.colSpan && shadowEntry.rowSpan) {
        var prev = colArray[colArray.length - 1];
        prev != shadowEntry.activeCell && colArray.push(shadowEntry.activeCell)
      }else {
        (shadowEntry.colSpan || !shadowEntry.rowSpan) && colArray.push(shadowEntry.activeCell)
      }
    }
  }
  return colArray
};
cvox.TraverseTable.prototype.shadowColCount_ = function() {
  for(var max = 0, i = 0;i < this.shadowTable_.length;i++) {
    if(this.shadowTable_[i].length > max) {
      max = this.shadowTable_[i].length
    }
  }
  return max
};
cvox.TraverseTable.prototype.countRows_ = function() {
  var rowCount = cvox.TableUtil.getChildRows(this.activeTable_);
  return rowCount.length
};
cvox.TraverseTable.prototype.nextRow = function() {
  return this.currentCellCursor ? this.goToRow(this.currentCellCursor[0] + 1) : this.goToRow(0)
};
cvox.TraverseTable.prototype.nextCol = function() {
  return this.currentCellCursor ? this.goToCol(this.currentCellCursor[1] + 1) : this.goToCol(0)
};
cvox.TraverseTable.prototype.goToRow = function(index) {
  return this.shadowTable_[index] != null ? (this.currentCellCursor = this.currentCellCursor == null ? [index, 0] : [index, this.currentCellCursor[1]], !0) : !1
};
cvox.TraverseTable.prototype.goToCol = function(index) {
  if(index < 0 || index >= this.colCount) {
    return!1
  }
  this.currentCellCursor = this.currentCellCursor == null ? [0, index] : [this.currentCellCursor[0], index];
  return!0
};
cvox.TraverseTable.prototype.goToCell = function(index) {
  if(index[0] < this.rowCount && index[0] >= 0 && index[1] < this.colCount && index[1] >= 0) {
    var cell = this.shadowTable_[index[0]][index[1]];
    if(cell != null) {
      return this.currentCellCursor = index, !0
    }
  }
  return!1
};
cvox.TraverseTable.prototype.goToLastCell = function() {
  var numRows = this.shadowTable_.length, lastRow = this.shadowTable_[numRows - 1], lastIndex = [numRows - 1, lastRow.length - 1], cell = this.shadowTable_[lastIndex[0]][lastIndex[1]];
  if(cell != null) {
    return this.currentCellCursor = lastIndex, !0
  }
  return!1
};
cvox.TraverseTable.prototype.goToRowLastCell = function() {
  var currentRow = this.currentCellCursor[0], lastIndex = [currentRow, this.shadowTable_[currentRow].length - 1], cell = this.shadowTable_[lastIndex[0]][lastIndex[1]];
  if(cell != null) {
    return this.currentCellCursor = lastIndex, !0
  }
  return!1
};
cvox.TraverseTable.prototype.goToColLastCell = function() {
  var currentCol = this.getCol(), lastIndex = [currentCol.length - 1, this.currentCellCursor[1]], cell = this.shadowTable_[lastIndex[0]][lastIndex[1]];
  if(cell != null) {
    return this.currentCellCursor = lastIndex, !0
  }
  return!1
};
cvox.SmartDomWalker = function() {
  this.tables = [];
  this.currentTableNavigator = null;
  this.tableMode = this.announceTable = !1
};
goog.inherits(cvox.SmartDomWalker, cvox.LinearDomWalker);
cvox.SmartDomWalker.SMARTNAV_MAX_CHARCOUNT = 1500;
cvox.SmartDomWalker.SMARTNAV_BREAKOUT_XPATH = './/blockquote |.//button |.//code |.//form |.//frame |.//h1 |.//h2 |.//h3 |.//h4 |.//h5 |.//h6 |.//hr |.//iframe |.//input |.//object |.//ol |.//p |.//pre |.//select |.//table |.//tr |.//ul |.//*[@role="alert"] |.//*[@role="alertdialog"] |.//*[@role="button"] |.//*[@role="checkbox"] |.//*[@role="combobox"] |.//*[@role="dialog"] |.//*[@role="log"] |.//*[@role="marquee"] |.//*[@role="menubar"] |.//*[@role="progressbar"] |.//*[@role="radio"] |.//*[@role="radiogroup"] |.//*[@role="scrollbar"] |.//*[@role="slider"] |.//*[@role="spinbutton"] |.//*[@role="status"] |.//*[@role="tab"] |.//*[@role="tabpanel"] |.//*[@role="textbox"] |.//*[@role="toolbar"] |.//*[@role="tooltip"] |.//*[@role="treeitem"] |.//*[@role="article"] |.//*[@role="document"] |.//*[@role="group"] |.//*[@role="heading"] |.//*[@role="img"] |.//*[@role="list"] |.//*[@role="math"] |.//*[@role="region"] |.//*[@role="row"] |.//*[@role="separator"]';
cvox.SmartDomWalker.prototype.enterTable = function() {
  if(this.tableMode) {
    var currentCell = this.currentTableNavigator.getCell(), tableChildren = cvox.XpathUtil.evalXPath(".//TABLE", currentCell);
    return tableChildren.length != 0 ? (this.currentTableNavigator = new cvox.TraverseTable(tableChildren[0]), this.tables.push(this.currentTableNavigator), this.announceTable = !0) : !1
  }else {
    if(cvox.DomUtil.isDescendantOf(this.currentNode, "TABLE")) {
      for(var ancestors = cvox.DomUtil.getAncestors(this.currentNode), i = ancestors.length - 1;i >= 0;i--) {
        if(ancestors[i].tagName == "TABLE") {
          return this.currentTableNavigator = new cvox.TraverseTable(ancestors[i]), this.tables.push(this.currentTableNavigator), this.tableMode = this.announceTable = !0
        }
      }
    }else {
      this.tableMode = !1
    }
    return!1
  }
};
cvox.SmartDomWalker.prototype.exitTable = function() {
  this.tableMode = !1
};
cvox.SmartDomWalker.prototype.goToFirstCell = function() {
  if(this.tableMode && this.currentTableNavigator.goToCell([0, 0])) {
    return this.previousNode = this.currentNode, this.setCurrentNode(this.currentTableNavigator.getCell()), this.currentNode
  }
  return null
};
cvox.SmartDomWalker.prototype.goToLastCell = function() {
  if(this.tableMode && this.currentTableNavigator.goToLastCell()) {
    return this.previousNode = this.currentNode, this.setCurrentNode(this.currentTableNavigator.getCell()), this.currentNode
  }
  return null
};
cvox.SmartDomWalker.prototype.goToRowFirstCell = function() {
  if(this.tableMode) {
    var cursor = this.currentTableNavigator.currentCellCursor;
    if(this.currentTableNavigator.goToCell([cursor[0], 0])) {
      return this.previousNode = this.currentNode, this.setCurrentNode(this.currentTableNavigator.getCell()), this.currentNode
    }
  }
  return null
};
cvox.SmartDomWalker.prototype.goToRowLastCell = function() {
  if(this.tableMode && this.currentTableNavigator.goToRowLastCell()) {
    return this.previousNode = this.currentNode, this.setCurrentNode(this.currentTableNavigator.getCell()), this.currentNode
  }
  return null
};
cvox.SmartDomWalker.prototype.goToColFirstCell = function() {
  if(this.tableMode) {
    var cursor = this.currentTableNavigator.currentCellCursor;
    if(this.currentTableNavigator.goToCell([0, cursor[1]])) {
      return this.previousNode = this.currentNode, this.setCurrentNode(this.currentTableNavigator.getCell()), this.currentNode
    }
  }
  return null
};
cvox.SmartDomWalker.prototype.goToColLastCell = function() {
  if(this.tableMode && this.currentTableNavigator.goToColLastCell()) {
    return this.previousNode = this.currentNode, this.setCurrentNode(this.currentTableNavigator.getCell()), this.currentNode
  }
  return null
};
cvox.SmartDomWalker.prototype.previousRow = function() {
  if(this.tableMode) {
    var activeIndex = this.currentTableNavigator.currentCellCursor;
    if(activeIndex && this.currentTableNavigator.goToCell([activeIndex[0] - 1, activeIndex[1]])) {
      return this.previousNode = this.currentNode, this.setCurrentNode(this.currentTableNavigator.getCell()), this.currentNode
    }
  }
  return null
};
cvox.SmartDomWalker.prototype.nextRow = function() {
  if(this.tableMode) {
    var activeIndex = this.currentTableNavigator.currentCellCursor;
    if(activeIndex && this.currentTableNavigator.goToCell([activeIndex[0] + 1, activeIndex[1]])) {
      return this.previousNode = this.currentNode, this.setCurrentNode(this.currentTableNavigator.getCell()), this.currentNode
    }
  }
  return null
};
cvox.SmartDomWalker.prototype.previousCol = function() {
  if(this.tableMode) {
    var activeIndex = this.currentTableNavigator.currentCellCursor;
    if(activeIndex && this.currentTableNavigator.goToCell([activeIndex[0], activeIndex[1] - 1])) {
      return this.previousNode = this.currentNode, this.setCurrentNode(this.currentTableNavigator.getCell()), this.currentNode
    }
  }
  return null
};
cvox.SmartDomWalker.prototype.nextCol = function() {
  if(this.tableMode) {
    var activeIndex = this.currentTableNavigator.currentCellCursor;
    if(activeIndex && this.currentTableNavigator.goToCell([activeIndex[0], activeIndex[1] + 1])) {
      return this.previousNode = this.currentNode, this.setCurrentNode(this.currentTableNavigator.getCell()), this.currentNode
    }
  }
  return null
};
cvox.SmartDomWalker.prototype.next = function() {
  if((this.previousNode = this.currentNode) && !cvox.DomUtil.isAttachedToDocument(this.currentNode)) {
    for(var i = this.currentAncestors.length - 1, ancestor;ancestor = this.currentAncestors[i];i--) {
      if(cvox.DomUtil.isAttachedToDocument(ancestor)) {
        this.setCurrentNode(ancestor);
        this.previous();
        this.next();
        break
      }
    }
  }
  return this.nextContentNode()
};
cvox.SmartDomWalker.prototype.previous = function() {
  if((this.previousNode = this.currentNode) && !cvox.DomUtil.isAttachedToDocument(this.currentNode)) {
    for(var i = this.currentAncestors.length - 1, ancestor;ancestor = this.currentAncestors[i];i--) {
      if(cvox.DomUtil.isAttachedToDocument(ancestor)) {
        this.setCurrentNode(ancestor);
        this.next();
        this.previous();
        break
      }
    }
  }
  return this.prevContentNode()
};
cvox.SmartDomWalker.prototype.getRowHeaderText = function() {
  var rowHeaderText = "";
  if(this.tableMode) {
    for(var rowHeaders = this.currentTableNavigator.getCellRowHeaders(), i = 0;i < rowHeaders.length;i++) {
      rowHeaderText += cvox.DomUtil.getText(rowHeaders[i])
    }
  }
  return rowHeaderText
};
cvox.SmartDomWalker.prototype.getRowHeaderGuess = function() {
  var rowHeaderText = "";
  if(this.tableMode) {
    var currentCursor = this.currentTableNavigator.currentCellCursor, firstCellInRow = this.currentTableNavigator.getCellAt([currentCursor[0], 0]);
    rowHeaderText += cvox.DomUtil.getText(firstCellInRow)
  }
  return rowHeaderText
};
cvox.SmartDomWalker.prototype.getColHeaderText = function() {
  var colHeaderText = "";
  if(this.tableMode) {
    for(var colHeaders = this.currentTableNavigator.getCellColHeaders(), i = 0;i < colHeaders.length;i++) {
      colHeaderText += cvox.DomUtil.getText(colHeaders[i])
    }
  }
  return colHeaderText
};
cvox.SmartDomWalker.prototype.getColHeaderGuess = function() {
  var colHeaderText = "";
  if(this.tableMode) {
    var currentCursor = this.currentTableNavigator.currentCellCursor, firstCellInCol = this.currentTableNavigator.getCellAt([0, currentCursor[1]]);
    colHeaderText += cvox.DomUtil.getText(firstCellInCol)
  }
  return colHeaderText
};
cvox.SmartDomWalker.prototype.getRowIndex = function() {
  if(this.tableMode) {
    return this.currentTableNavigator.currentCellCursor[0] + 1
  }
  return null
};
cvox.SmartDomWalker.prototype.getColIndex = function() {
  if(this.tableMode) {
    return this.currentTableNavigator.currentCellCursor[1] + 1
  }
  return null
};
cvox.SmartDomWalker.prototype.getRowCount = function() {
  if(this.tableMode) {
    return this.currentTableNavigator.rowCount
  }
  return null
};
cvox.SmartDomWalker.prototype.getColCount = function() {
  if(this.tableMode) {
    return this.currentTableNavigator.colCount
  }
  return null
};
cvox.SmartDomWalker.prototype.getCurrentContent = function() {
  return cvox.DomUtil.getText(this.currentNode)
};
cvox.SmartDomWalker.prototype.getCurrentDescription = function() {
  var description = "";
  if(this.announceTable) {
    description += " " + this.currentTableNavigator.rowCount + " rows, " + this.currentTableNavigator.colCount + " columns", this.announceTable = !1
  }
  var walker = new cvox.LinearDomWalker;
  walker.currentNode = this.currentNode;
  walker.useSmartNav = !1;
  walker.previous();
  walker.next();
  for(var contentStr = "", previousDescriptions = {};cvox.DomUtil.isDescendantOfNode(walker.currentNode, this.currentNode);) {
    contentStr += " " + cvox.DomUtil.getText(walker.currentNode);
    var descp = cvox.DomUtil.getInformationFromAncestors(walker.getUniqueAncestors());
    !previousDescriptions[descp] && descp != "" ? previousDescriptions[descp] = 1 : descp != "" && previousDescriptions[descp]++;
    walker.next()
  }
  this.tableMode && (contentStr == "" && (contentStr = " empty cell"), this.currentTableNavigator.isSpanned() && (contentStr = "spanned " + contentStr));
  for(descp in previousDescriptions) {
    description += descp + " " + (previousDescriptions[descp] > 1 ? "collection " : "")
  }
  return[contentStr, description]
};
cvox.SmartDomWalker.prototype.isLeafNode = function(targetNode) {
  if(cvox.DomUtil.isLeafNode(targetNode)) {
    return!0
  }
  if(!cvox.XpathUtil.xpathSupported()) {
    return!1
  }
  var content = cvox.DomUtil.getText(targetNode);
  if(content.length > cvox.SmartDomWalker.SMARTNAV_MAX_CHARCOUNT) {
    return!1
  }
  if(content.replace(/\s/g, "") === "") {
    return!1
  }
  for(var breakingNodes = cvox.XpathUtil.evalXPath(cvox.SmartDomWalker.SMARTNAV_BREAKOUT_XPATH, targetNode), i = 0, node;node = breakingNodes[i];i++) {
    if(cvox.DomUtil.hasContent(node)) {
      return!1
    }
  }
  return!0
};
cvox.AbstractTts = function() {
  cvox.AbstractLogger.call(this);
  this.ttsProperties = {}
};
goog.inherits(cvox.AbstractTts, cvox.AbstractLogger);
cvox.AbstractTts.prototype.logEnabled = function() {
  return cvox.AbstractTts.DEBUG
};
cvox.AbstractTts.prototype.speak = function(textString, queueMode, properties) {
  this.logEnabled() && this.log("[" + this.getName() + "] speak(" + textString + ", " + queueMode + (properties ? ", " + properties.toString() : "") + ")")
};
cvox.AbstractTts.prototype.isSpeaking = function() {
  this.logEnabled() && this.log("[" + this.getName() + "] isSpeaking()");
  return!1
};
cvox.AbstractTts.prototype.stop = function() {
  this.logEnabled() && this.log("[" + this.getName() + "] stop()")
};
cvox.AbstractTts.prototype.setDefaultTtsProperties = function(ttsProperties) {
  this.ttsProperties = ttsProperties
};
cvox.AbstractTts.prototype.increaseProperty = function(property_name, announce) {
  if(property_name == cvox.AbstractTts.TTS_PROPERTY_RATE) {
    this.ttsProperties.rate = this.increasePropertyValue(this.ttsProperties.rate), announce && this.speak(cvox.AbstractTts.str.increaseRate, 0, this.ttsProperties)
  }else {
    if(property_name == cvox.AbstractTts.TTS_PROPERTY_PITCH) {
      this.ttsProperties.pitch = this.increasePropertyValue(this.ttsProperties.pitch), announce && this.speak(cvox.AbstractTts.str.increasePitch, 0, this.ttsProperties)
    }else {
      if(property_name == cvox.AbstractTts.TTS_PROPERTY_VOLUME) {
        this.ttsProperties.volume = this.increasePropertyValue(this.ttsProperties.volume), announce && this.speak(cvox.AbstractTts.str.increaseVolume, 0, this.ttsProperties)
      }
    }
  }
};
cvox.AbstractTts.prototype.decreaseProperty = function(property_name, announce) {
  if(property_name == cvox.AbstractTts.TTS_PROPERTY_RATE) {
    this.ttsProperties.rate = this.decreasePropertyValue(this.ttsProperties.rate), announce && this.speak(cvox.AbstractTts.str.decreaseRate, 0, this.ttsProperties)
  }else {
    if(property_name == cvox.AbstractTts.TTS_PROPERTY_PITCH) {
      this.ttsProperties.pitch = this.decreasePropertyValue(this.ttsProperties.pitch), announce && this.speak(cvox.AbstractTts.str.decreasePitch, 0, this.ttsProperties)
    }else {
      if(property_name == cvox.AbstractTts.TTS_PROPERTY_VOLUME) {
        this.ttsProperties.volume = this.decreasePropertyValue(this.ttsProperties.volume), announce && this.speak(cvox.AbstractTts.str.decreaseVolume, 0, this.ttsProperties)
      }
    }
  }
};
cvox.AbstractTts.prototype.mergeProperties = function(properties) {
  if(!properties) {
    return this.ttsProperties
  }
  var mergedProperties = {}, p;
  for(p in this.ttsProperties) {
    mergedProperties[p] = this.ttsProperties[p]
  }
  for(p in properties) {
    mergedProperties[p] = properties[p]
  }
  return mergedProperties
};
cvox.AbstractTts.prototype.decreasePropertyValue = function(current_value) {
  return Math.max(0, current_value - 0.1)
};
cvox.AbstractTts.prototype.increasePropertyValue = function(current_value) {
  return Math.min(1, current_value + 0.1)
};
cvox.AbstractTts.TTS_PROPERTY_RATE = "Rate";
cvox.AbstractTts.TTS_PROPERTY_PITCH = "Pitch";
cvox.AbstractTts.TTS_PROPERTY_VOLUME = "Volume";
cvox.AbstractTts.DEBUG = !0;
cvox.AbstractTts.QUEUE_MODE_FLUSH = 0;
cvox.AbstractTts.QUEUE_MODE_QUEUE = 1;
cvox.AbstractTts.str = {increaseRate:"increasing rate", increasePitch:"increasing pitch", increaseVolume:"increasing volume", decreaseRate:"decreasing rate", decreasePitch:"decreasing pitch", decreaseVolume:"decreasing volume"};
cvox.AbstractTtsManager = function() {
  cvox.AbstractTts.call(this)
};
goog.inherits(cvox.AbstractTtsManager, cvox.AbstractTts);
cvox.AbstractTtsManager.prototype.nextTtsEngine = function(announce) {
  this.logEnabled() && this.log("[" + this.getName() + "] nextTtsEngine(" + announce + ")")
};
cvox.AbstractTtsManager.prototype.increaseProperty = function(property_name) {
  this.logEnabled() && this.log("[" + this.getName() + "] increaseProperty(" + property_name + ")")
};
cvox.AbstractTtsManager.prototype.decreaseProperty = function(property_name) {
  this.logEnabled() && this.log("[" + this.getName() + "] decreaseProperty(" + property_name + ")")
};
cvox.AbstractTtsManager.TTS_PROPERTY_RATE = "Rate";
cvox.AbstractTtsManager.TTS_PROPERTY_PITCH = "Pitch";
cvox.AbstractTtsManager.TTS_PROPERTY_VOLUME = "Volume";
cvox.LocalTtsManager = function(ttsEngines, ttsProperties) {
  cvox.AbstractTtsManager.call(this);
  this.ttsEngines = ttsEngines;
  this.initializedTtsEngines = Array(ttsEngines.length);
  this.currentTtsEngineIndex = -1;
  this.nextTtsEngine(!1);
  this.initializeTtsPropertiesToDefault(ttsProperties)
};
goog.inherits(cvox.LocalTtsManager, cvox.AbstractTtsManager);
cvox.LocalTtsManager.prototype.getName = function() {
  return"LocalTtsManager"
};
cvox.LocalTtsManager.prototype.speak = function(textString, queueMode, properties) {
  cvox.LocalTtsManager.superClass_.speak.call(this, textString, queueMode, properties);
  this.currentTtsEngine && this.currentTtsEngine.speak(textString, queueMode, properties)
};
cvox.LocalTtsManager.prototype.isSpeaking = function() {
  cvox.LocalTtsManager.superClass_.isSpeaking.call(this);
  if(!this.currentTtsEngine) {
    return!1
  }
  return this.currentTtsEngine.isSpeaking()
};
cvox.LocalTtsManager.prototype.stop = function() {
  cvox.LocalTtsManager.superClass_.stop.call(this);
  this.currentTtsEngine && this.currentTtsEngine.stop()
};
cvox.LocalTtsManager.prototype.initializeTtsPropertiesToDefault = function(ttsProperties) {
  if(ttsProperties) {
    for(var i = 0;i < this.ttsEngines.length;i++) {
      this.ttsProperties[i] && this.ttsEngines[i].setDefaultTtsProperties(this.ttsProperties[i])
    }
  }
};
cvox.LocalTtsManager.prototype.nextTtsEngine = function(announce) {
  cvox.LocalTtsManager.superClass_.nextTtsEngine.call(this, announce);
  if(this.ttsEngines) {
    this.currentTtsEngine && this.currentTtsEngine.stop();
    this.currentTtsEngineIndex = (this.currentTtsEngineIndex + 1) % this.ttsEngines.length;
    this.currentTtsEngine = null;
    try {
      this.currentTtsEngine = this.initializedTtsEngines[this.currentTtsEngineIndex] || new this.ttsEngines[this.currentTtsEngineIndex], this.initializedTtsEngines[this.currentTtsEngineIndex] = this.currentTtsEngine, this.log("Switching to speech engine: " + this.currentTtsEngine.getName()), announce && this.speak(this.currentTtsEngine.getName(), cvox.AbstractTts.QUEUE_MODE_FLUSH, this.ttsProperties[this.currentTtsEngineIndex])
    }catch(err) {
      this.log("error switching to engine #" + this.currentTtsEngineIndex + " " + err)
    }
  }
};
cvox.LocalTtsManager.prototype.increaseProperty = function(property_name, announce) {
  cvox.LocalTtsManager.superClass_.increaseProperty.call(this, property_name);
  this.currentTtsEngine.increaseProperty(property_name, announce)
};
cvox.LocalTtsManager.prototype.decreaseProperty = function(property_name, announce) {
  cvox.LocalTtsManager.superClass_.decreaseProperty.call(this, property_name);
  this.currentTtsEngine.decreaseProperty(property_name, announce)
};
cvox.RemoteTtsManager = function() {
};
cvox.AbstractEarcons = function() {
  cvox.AbstractLogger.call(this)
};
goog.inherits(cvox.AbstractEarcons, cvox.AbstractLogger);
cvox.AbstractEarcons.prototype.playEarcon = function(earcon) {
  this.logEnabled() && this.log("[" + this.getName() + "] playEarcon(" + this.getEarconName(earcon) + ")")
};
cvox.AbstractEarcons.prototype.getEarconName = function(earcon) {
  if(!this.earconNames) {
    this.earconNames = [], this.earconNames.push("ALERT_MODAL"), this.earconNames.push("ALERT_NONMODAL"), this.earconNames.push("BULLET"), this.earconNames.push("BUSY_PROGRESS_LOOP"), this.earconNames.push("BUSY_WORKING_LOOP"), this.earconNames.push("BUTTON"), this.earconNames.push("CHECK_OFF"), this.earconNames.push("CHECK_ON"), this.earconNames.push("COLLAPSED"), this.earconNames.push("EDITABLE_TEXT"), this.earconNames.push("ELLIPSIS"), this.earconNames.push("EXPANDED"), this.earconNames.push("FONT_CHANGE"), 
    this.earconNames.push("INVALID_KEYPRESS"), this.earconNames.push("LINK"), this.earconNames.push("LISTBOX"), this.earconNames.push("LIST_ITEM"), this.earconNames.push("NEW_MAIL"), this.earconNames.push("OBJECT_CLOSE"), this.earconNames.push("OBJECT_DELETE"), this.earconNames.push("OBJECT_DESELECT"), this.earconNames.push("OBJECT_OPEN"), this.earconNames.push("OBJECT_SELECT"), this.earconNames.push("PARAGRAPH_BREAK"), this.earconNames.push("SEARCH_HIT"), this.earconNames.push("SEARCH_MISS"), this.earconNames.push("SECTION"), 
    this.earconNames.push("TASK_SUCCESS"), this.earconNames.push("WRAP"), this.earconNames.push("WRAP_EDGE")
  }
  return this.earconNames[earcon]
};
cvox.AbstractEarcons.ALERT_MODAL = 0;
cvox.AbstractEarcons.ALERT_NONMODAL = 1;
cvox.AbstractEarcons.BULLET = 2;
cvox.AbstractEarcons.BUSY_PROGRESS_LOOP = 3;
cvox.AbstractEarcons.BUSY_WORKING_LOOP = 4;
cvox.AbstractEarcons.BUTTON = 5;
cvox.AbstractEarcons.CHECK_OFF = 6;
cvox.AbstractEarcons.CHECK_ON = 7;
cvox.AbstractEarcons.COLLAPSED = 8;
cvox.AbstractEarcons.EDITABLE_TEXT = 9;
cvox.AbstractEarcons.ELLIPSIS = 10;
cvox.AbstractEarcons.EXPANDED = 11;
cvox.AbstractEarcons.FONT_CHANGE = 12;
cvox.AbstractEarcons.INVALID_KEYPRESS = 13;
cvox.AbstractEarcons.LINK = 14;
cvox.AbstractEarcons.LISTBOX = 15;
cvox.AbstractEarcons.LIST_ITEM = 16;
cvox.AbstractEarcons.NEW_MAIL = 17;
cvox.AbstractEarcons.OBJECT_CLOSE = 18;
cvox.AbstractEarcons.OBJECT_DELETE = 18;
cvox.AbstractEarcons.OBJECT_DESELECT = 20;
cvox.AbstractEarcons.OBJECT_OPEN = 21;
cvox.AbstractEarcons.OBJECT_SELECT = 22;
cvox.AbstractEarcons.PARAGRAPH_BREAK = 23;
cvox.AbstractEarcons.SEARCH_HIT = 24;
cvox.AbstractEarcons.SEARCH_MISS = 25;
cvox.AbstractEarcons.SECTION = 26;
cvox.AbstractEarcons.TASK_SUCCESS = 27;
cvox.AbstractEarcons.WRAP = 28;
cvox.AbstractEarcons.WRAP_EDGE = 29;
cvox.ChromeVoxChoiceWidget = function() {
  this.powerKey = new PowerKey("main", null);
  this.powerKey.createCompletionField(document.body, 50, null, null, null, !1);
  this.powerKey.setAutoHideCompletionField(!0);
  this.powerKey.setDefaultCSSStyle()
};
cvox.ChromeVoxChoiceWidget.prototype.show = function(descriptions, functions, prompt) {
  this.powerKey.setCompletionList(descriptions);
  for(var completionActionMap = {}, i = 0, description;description = descriptions[i];i++) {
    var action = {};
    action.main = functions[i];
    completionActionMap[description.toLowerCase()] = action
  }
  this.powerKey.setCompletionActionMap(completionActionMap);
  this.powerKey.setCompletionPromptStr(descriptions.toString());
  this.powerKey.setBrowseCallback(function(text) {
    cvox.ChromeVox.tts.speak(text, cvox.AbstractTts.QUEUE_MODE_FLUSH, null)
  });
  this.powerKey.updateCompletionField(PowerKey.status.VISIBLE, !0, 40, 20);
  cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.LISTBOX);
  window.setTimeout(function() {
    cvox.ChromeVox.tts.speak(prompt)
  }, 0)
};
cvox.ChromeVoxNavigationManager = function() {
  this.currentNode = null;
  this.nodeInformationArray = [];
  this.lastUsedNavStrategy = this.currentNavStrategy = 2;
  this.linearDomWalker = new cvox.LinearDomWalker;
  this.smartDomWalker = new cvox.SmartDomWalker;
  this.selectionWalker = new cvox.SelectionWalker;
  this.customWalker = null;
  this.selectionUniqueAncestors = [];
  this.choiceWidget = new cvox.ChromeVoxChoiceWidget;
  this.iframeIdMap = {};
  this.nextIframeId = 1;
  this.addInterframeListener_()
};
cvox.ChromeVoxNavigationManager.STRATEGIES = {SELECTION:0, LINEARDOM:1, SMART:2, CUSTOM:3};
cvox.ChromeVoxNavigationManager.STRATEGY_NAMES = ["SELECTION", "OBJECT", "GROUP", "CUSTOM"];
cvox.ChromeVoxNavigationManager.prototype.next = function(navigateIframes) {
  switch(this.currentNavStrategy) {
    default:
    ;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.CUSTOM:
      var customNode = this.customWalker.next();
      if(navigateIframes && this.tryEnterExitIframe_(customNode, !0)) {
        return!0
      }
      if(customNode) {
        return!0
      }
      return!1;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SMART:
      var smartNode = this.smartDomWalker.next();
      if(navigateIframes && this.tryEnterExitIframe_(smartNode, !0)) {
        return!0
      }
      if(smartNode) {
        return cvox.SelectionUtil.selectAllTextInNode(smartNode), this.currentNode = smartNode, !0
      }
      return!1;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM:
      var node = this.linearDomWalker.next();
      if(navigateIframes && this.tryEnterExitIframe_(node, !0)) {
        return!0
      }
      if(node) {
        return cvox.SelectionUtil.selectAllTextInNode(node), this.currentNode = node, !0
      }
      return!1;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SELECTION:
      this.selectionUniqueAncestors = [];
      var movedOk = this.selectionWalker.next();
      if(!movedOk) {
        var selectionNode = this.linearDomWalker.next();
        if(navigateIframes && this.tryEnterExitIframe_(selectionNode, !0)) {
          return!0
        }
        this.selectionUniqueAncestors = this.linearDomWalker.getUniqueAncestors();
        if(selectionNode) {
          return this.currentNode = selectionNode, this.selectionWalker.setCurrentNode(this.currentNode), this.selectionWalker.next(), !0
        }
        return!1
      }
      return!0
  }
};
cvox.ChromeVoxNavigationManager.prototype.checkCellBoundaries = function() {
  return cvox.DomUtil.isDescendantOfNode(this.currentNode, this.smartDomWalker.currentTableNavigator.getCell())
};
cvox.ChromeVoxNavigationManager.prototype.previous = function(navigateIframes) {
  switch(this.currentNavStrategy) {
    default:
    ;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.CUSTOM:
      var customNode = this.customWalker.previous();
      if(navigateIframes && this.tryEnterExitIframe_(customNode, !1)) {
        return!0
      }
      if(customNode) {
        return!0
      }
      return!1;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SMART:
      var smartNode = this.smartDomWalker.previous();
      if(navigateIframes && this.tryEnterExitIframe_(smartNode, !1)) {
        return!0
      }
      if(smartNode) {
        return cvox.SelectionUtil.selectAllTextInNode(smartNode), this.currentNode = smartNode, !0
      }
      return!1;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM:
      var node = this.linearDomWalker.previous();
      if(navigateIframes && this.tryEnterExitIframe_(node, !1)) {
        return!0
      }
      if(node) {
        return cvox.SelectionUtil.selectAllTextInNode(node), this.currentNode = node, !0
      }
      return!1;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SELECTION:
      this.selectionUniqueAncestors = [];
      var movedOk = this.selectionWalker.previous();
      if(!movedOk) {
        var selectionNode = this.linearDomWalker.previous();
        if(navigateIframes && this.tryEnterExitIframe_(selectionNode, !1)) {
          return!0
        }
        this.selectionUniqueAncestors = this.linearDomWalker.getUniqueAncestors();
        if(selectionNode) {
          return this.currentNode = selectionNode, this.selectionWalker.setCurrentNode(this.currentNode), cvox.SelectionUtil.selectAllTextInNode(this.currentNode), cvox.SelectionUtil.collapseToEnd(this.currentNode), this.selectionWalker.previous(), !0
        }
        return!1
      }
      return!0
  }
};
cvox.ChromeVoxNavigationManager.prototype.up = function() {
  switch(this.currentNavStrategy) {
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SMART:
      if(this.customWalker) {
        this.lastUsedNavStrategy = this.currentNavStrategy, this.currentNavStrategy = cvox.ChromeVoxNavigationManager.STRATEGIES.CUSTOM, this.customWalker.setCurrentNode(this.currentNode), this.customWalker.goToCurrentItem()
      }
      break;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM:
      this.lastUsedNavStrategy = this.currentNavStrategy;
      this.currentNavStrategy = cvox.ChromeVoxNavigationManager.STRATEGIES.SMART;
      for(var node = this.currentNode;node && this.linearDomWalker.isLeafNode(node);) {
        this.currentNode = node, node = node.parentNode
      }
      this.smartDomWalker.setCurrentNode(this.currentNode);
      this.currentNode !== null && this.previous(!1);
      this.next(!1);
      break;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SELECTION:
      var changed = this.selectionWalker.lessGranular(!0);
      if(!changed) {
        this.lastUsedNavStrategy = this.currentNavStrategy, this.currentNavStrategy = cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM, cvox.SelectionUtil.selectAllTextInNode(this.currentNode)
      }
  }
};
cvox.ChromeVoxNavigationManager.prototype.down = function() {
  switch(this.currentNavStrategy) {
    default:
    ;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.CUSTOM:
      this.lastUsedNavStrategy = this.currentNavStrategy;
      this.currentNavStrategy = cvox.ChromeVoxNavigationManager.STRATEGIES.SMART;
      if(this.customWalker.getCurrentNode() != null) {
        this.currentNode = this.customWalker.getCurrentNode(), this.smartDomWalker.setCurrentNode(this.currentNode)
      }
      break;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SMART:
      this.lastUsedNavStrategy = this.currentNavStrategy;
      this.currentNavStrategy = cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM;
      if(this.smartDomWalker.getCurrentNode() != null) {
        this.currentNode = this.smartDomWalker.getCurrentNode(), this.linearDomWalker.setCurrentNode(this.currentNode)
      }
      this.currentNode !== null && this.previous(!1);
      this.next(!1);
      break;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM:
      this.lastUsedNavStrategy = this.currentNavStrategy;
      this.currentNavStrategy = cvox.ChromeVoxNavigationManager.STRATEGIES.SELECTION;
      this.selectionWalker.setCurrentNode(this.currentNode);
      this.currentNode && (cvox.SelectionUtil.selectAllTextInNode(this.currentNode), cvox.SelectionUtil.collapseToStart(this.currentNode));
      this.selectionWalker.next();
      break;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SELECTION:
      this.selectionWalker.moreGranular(!0)
  }
};
cvox.ChromeVoxNavigationManager.prototype.enterTable = function() {
  var originalNavStrategy = this.currentNavStrategy, originalGranularity = this.selectionWalker.currentGranularity;
  this.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART);
  if(this.smartDomWalker.enterTable()) {
    var smartNode = this.smartDomWalker.goToFirstCell();
    if(smartNode) {
      cvox.SelectionUtil.selectAllTextInNode(smartNode), this.currentNode = smartNode
    }
    return!0
  }else {
    return this.switchToStrategy(originalNavStrategy, originalGranularity), !1
  }
};
cvox.ChromeVoxNavigationManager.prototype.exitTable = function() {
  if(this.smartDomWalker.tableMode) {
    var smartNode = this.smartDomWalker.goToLastCell();
    if(smartNode) {
      cvox.SelectionUtil.selectAllTextInNode(smartNode), this.currentNode = smartNode, this.next(!0)
    }
    this.smartDomWalker.exitTable()
  }
};
cvox.ChromeVoxNavigationManager.prototype.previousRow = function() {
  return this.trySwitchToStrategyAndSelect_(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART, this.smartDomWalker.previousRow, this.smartDomWalker)
};
cvox.ChromeVoxNavigationManager.prototype.nextRow = function() {
  return this.trySwitchToStrategyAndSelect_(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART, this.smartDomWalker.nextRow, this.smartDomWalker)
};
cvox.ChromeVoxNavigationManager.prototype.previousCol = function() {
  return this.trySwitchToStrategyAndSelect_(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART, this.smartDomWalker.previousCol, this.smartDomWalker)
};
cvox.ChromeVoxNavigationManager.prototype.nextCol = function() {
  return this.trySwitchToStrategyAndSelect_(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART, this.smartDomWalker.nextCol, this.smartDomWalker)
};
cvox.ChromeVoxNavigationManager.prototype.getRowHeaderText = function() {
  this.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART);
  return this.smartDomWalker.getRowHeaderText()
};
cvox.ChromeVoxNavigationManager.prototype.getRowHeaderGuess = function() {
  this.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART);
  return this.smartDomWalker.getRowHeaderGuess()
};
cvox.ChromeVoxNavigationManager.prototype.getColHeaderText = function() {
  this.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART);
  return this.smartDomWalker.getColHeaderText()
};
cvox.ChromeVoxNavigationManager.prototype.getColHeaderGuess = function() {
  this.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART);
  return this.smartDomWalker.getColHeaderGuess()
};
cvox.ChromeVoxNavigationManager.prototype.getRowIndex = function() {
  this.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART);
  return this.smartDomWalker.getRowIndex()
};
cvox.ChromeVoxNavigationManager.prototype.getColIndex = function() {
  this.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART);
  return this.smartDomWalker.getColIndex()
};
cvox.ChromeVoxNavigationManager.prototype.getRowCount = function() {
  this.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART);
  return this.smartDomWalker.getRowCount()
};
cvox.ChromeVoxNavigationManager.prototype.getColCount = function() {
  this.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART);
  return this.smartDomWalker.getColCount()
};
cvox.ChromeVoxNavigationManager.prototype.goToFirstCell = function() {
  return this.trySwitchToStrategyAndSelect_(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART, this.smartDomWalker.goToFirstCell, this.smartDomWalker)
};
cvox.ChromeVoxNavigationManager.prototype.goToLastCell = function() {
  return this.trySwitchToStrategyAndSelect_(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART, this.smartDomWalker.goToLastCell, this.smartDomWalker)
};
cvox.ChromeVoxNavigationManager.prototype.goToRowFirstCell = function() {
  return this.trySwitchToStrategyAndSelect_(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART, this.smartDomWalker.goToRowFirstCell, this.smartDomWalker)
};
cvox.ChromeVoxNavigationManager.prototype.goToRowLastCell = function() {
  return this.trySwitchToStrategyAndSelect_(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART, this.smartDomWalker.goToRowLastCell, this.smartDomWalker)
};
cvox.ChromeVoxNavigationManager.prototype.goToColFirstCell = function() {
  return this.trySwitchToStrategyAndSelect_(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART, this.smartDomWalker.goToColFirstCell, this.smartDomWalker)
};
cvox.ChromeVoxNavigationManager.prototype.goToColLastCell = function() {
  return this.trySwitchToStrategyAndSelect_(cvox.ChromeVoxNavigationManager.STRATEGIES.SMART, this.smartDomWalker.goToColLastCell, this.smartDomWalker)
};
cvox.ChromeVoxNavigationManager.prototype.trySwitchToStrategyAndSelect_ = function(strategy, functionToTry, obj) {
  var originalNavStrategy = this.currentNavStrategy, originalGranularity = this.selectionWalker.currentGranularity;
  this.switchToStrategy(strategy);
  var smartNode = functionToTry.call(obj);
  return smartNode ? (cvox.SelectionUtil.selectAllTextInNode(smartNode), this.currentNode = smartNode, !0) : (this.switchToStrategy(originalNavStrategy, originalGranularity), !1)
};
cvox.ChromeVoxNavigationManager.prototype.findNext = function(predicate) {
  this.syncPosition();
  for(var node = void 0;;) {
    node = this.linearDomWalker.next();
    if(!node) {
      break
    }
    if(node = predicate(this.linearDomWalker.getUniqueAncestors())) {
      break
    }
  }
  if(node) {
    return cvox.SelectionUtil.selectAllTextInNode(node), this.currentNode = node, this.linearDomWalker.setCurrentNode(this.currentNode), this.smartDomWalker.setCurrentNode(this.currentNode), !0
  }
  return!1
};
cvox.ChromeVoxNavigationManager.prototype.findPrevious = function(predicate) {
  this.syncPosition();
  for(var node = void 0;;) {
    node = this.linearDomWalker.previous();
    if(!node) {
      break
    }
    if(node = predicate(this.linearDomWalker.getUniqueAncestors())) {
      break
    }
  }
  if(node) {
    return cvox.SelectionUtil.selectAllTextInNode(node), this.currentNode = node, this.linearDomWalker.setCurrentNode(this.currentNode), this.smartDomWalker.setCurrentNode(this.currentNode), !0
  }
  return!1
};
cvox.ChromeVoxNavigationManager.prototype.getStrategy = function() {
  return cvox.ChromeVoxNavigationManager.STRATEGY_NAMES[this.currentNavStrategy]
};
cvox.ChromeVoxNavigationManager.prototype.getGranularity = function() {
  return this.selectionWalker.getGranularity()
};
cvox.ChromeVoxNavigationManager.prototype.inTableMode = function() {
  return this.smartDomWalker.tableMode
};
cvox.ChromeVoxNavigationManager.prototype.syncPosition = function() {
  if(!this.currentNode) {
    this.currentNode = document.body
  }
  this.currentNavStrategy != this.lastUsedNavStrategy && (this.lastUsedNavStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM || this.lastUsedNavStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.SMART ? this.syncToNode(this.currentNode) : this.syncToSelection());
  this.lastUsedNavStrategy = this.currentNavStrategy
};
cvox.ChromeVoxNavigationManager.prototype.syncToSelection = function() {
  if(this.currentNavStrategy != cvox.ChromeVoxNavigationManager.STRATEGIES.SMART && window.getSelection() && window.getSelection().anchorNode && !cvox.DomUtil.isDescendantOfNode(this.currentNode, window.getSelection().anchorNode)) {
    this.currentNode = window.getSelection().anchorNode;
    for(var ancestors = cvox.DomUtil.getAncestors(this.currentNode), i = 0, node;node = ancestors[i];i++) {
      if(cvox.DomUtil.isControl(node)) {
        this.currentNode = node;
        break
      }
    }
    this.linearDomWalker.setCurrentNode(this.currentNode);
    this.smartDomWalker.setCurrentNode(this.currentNode)
  }
};
cvox.ChromeVoxNavigationManager.prototype.syncToNode = function(targetNode) {
  if(!cvox.DomUtil.isDescendantOfNode(this.currentNode, targetNode)) {
    this.linearDomWalker.setCurrentNode(targetNode), this.smartDomWalker.setCurrentNode(targetNode), targetNode != null && !cvox.DomUtil.isControl(targetNode) && this.selectionWalker.setCurrentNode(targetNode), this.currentNode = targetNode
  }
};
cvox.ChromeVoxNavigationManager.prototype.getCurrentContent = function() {
  switch(this.currentNavStrategy) {
    default:
    ;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.CUSTOM:
      return this.customWalker.getCurrentContent();
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SMART:
      return this.smartWalker.getCurrentContent();
    case cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM:
      return this.currentNode !== null ? cvox.DomUtil.getText(this.currentNode) : "";
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SELECTION:
      return this.selectionWalker.getCurrentContent()
  }
};
cvox.ChromeVoxNavigationManager.prototype.getCurrentDescription = function() {
  switch(this.currentNavStrategy) {
    default:
    ;
    case cvox.ChromeVoxNavigationManager.STRATEGIES.CUSTOM:
      return this.customWalker.getCurrentDescription();
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SMART:
      return this.smartDomWalker.getCurrentDescription();
    case cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM:
      return[this.getCurrentContent() + " " + cvox.DomUtil.getInformationFromAncestors(this.getChangedAncestors()), ""];
    case cvox.ChromeVoxNavigationManager.STRATEGIES.SELECTION:
      return[this.getCurrentContent() + " " + cvox.DomUtil.getInformationFromAncestors(this.selectionUniqueAncestors), ""]
  }
};
cvox.ChromeVoxNavigationManager.prototype.getChangedAncestors = function() {
  return this.currentNavStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.SMART ? this.smartDomWalker.getUniqueAncestors() : this.linearDomWalker.getUniqueAncestors()
};
cvox.ChromeVoxNavigationManager.prototype.setFocus = function() {
  this.currentNavStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.SMART ? cvox.DomUtil.setFocus(this.smartDomWalker.getCurrentNode()) : cvox.DomUtil.setFocus(this.linearDomWalker.getCurrentNode())
};
cvox.ChromeVoxNavigationManager.prototype.getCurrentNode = function() {
  return this.currentNavStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.SMART ? this.smartDomWalker.getCurrentNode() : this.linearDomWalker.getCurrentNode()
};
cvox.ChromeVoxNavigationManager.prototype.actOnCurrentItem = function() {
  if(this.currentNavStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.CUSTOM) {
    return this.customWalker.actOnCurrentItem()
  }else {
    if(this.currentNavStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.SMART) {
      if(this.currentNode && this.currentNode.tagName && this.currentNode.tagName == "A") {
        return cvox.DomUtil.clickElem(this.currentNode, !1), !0
      }else {
        var aNodes = this.currentNode.getElementsByTagName("A");
        if(aNodes.length == 1) {
          return cvox.DomUtil.clickElem(aNodes[0], !1), !0
        }else {
          if(aNodes.length > 1) {
            for(var descriptions = [], functions = [], i = 0, link;link = aNodes[i];i++) {
              cvox.DomUtil.hasContent(link) && (descriptions.push(cvox.DomUtil.getText(link)), functions.push(cvox.ChromeVoxNavigationManager.createSimpleClickFunction(link)))
            }
            this.choiceWidget.show(descriptions, functions, descriptions.toString());
            return!0
          }
        }
      }
    }
  }
  return!1
};
cvox.ChromeVoxNavigationManager.prototype.canActOnCurrentItem = function() {
  if(this.currentNavStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.CUSTOM) {
    return this.customWalker.canActOnCurrentItem()
  }
  if(this.currentNavStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.SMART) {
    if(this.currentNode && this.currentNode.tagName && this.currentNode.tagName == "A") {
      return!0
    }else {
      var aNodes = this.currentNode.getElementsByTagName("A");
      if(aNodes.length > 0) {
        return!0
      }
    }
  }
  return!1
};
cvox.ChromeVoxNavigationManager.createSimpleClickFunction = function(targetNode) {
  var target = targetNode.cloneNode(!0);
  return function() {
    cvox.DomUtil.clickElem(target, !1)
  }
};
cvox.ChromeVoxNavigationManager.prototype.switchToStrategy = function(newStrategy, opt_newGranularity, opt_forwards) {
  opt_forwards !== !0 && opt_forwards !== !1 && (opt_forwards = !0);
  var currentStrategy = this.currentNavStrategy;
  if(newStrategy < currentStrategy) {
    for(;currentStrategy != newStrategy;) {
      this.down(), currentStrategy = this.currentNavStrategy
    }
  }else {
    if(newStrategy > currentStrategy) {
      if(currentStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.SELECTION) {
        for(var changed = this.selectionWalker.lessGranular(opt_forwards);changed;) {
          changed = this.selectionWalker.lessGranular(opt_forwards)
        }
      }
      for(;currentStrategy != newStrategy;) {
        this.up(), currentStrategy = this.currentNavStrategy
      }
    }
  }
  if(newStrategy == cvox.ChromeVoxNavigationManager.STRATEGIES.SELECTION && opt_newGranularity != void 0) {
    if(!opt_forwards) {
      var node = this.linearDomWalker.getCurrentNode();
      node && (cvox.SelectionUtil.selectAllTextInNode(node), cvox.SelectionUtil.collapseToEnd(node));
      this.selectionWalker.previous()
    }
    var currentGranularity = this.selectionWalker.currentGranularity;
    if(opt_newGranularity < currentGranularity) {
      for(;currentGranularity != opt_newGranularity;) {
        this.selectionWalker.lessGranular(opt_forwards), currentGranularity = this.selectionWalker.currentGranularity
      }
    }else {
      if(opt_newGranularity > currentGranularity) {
        for(;currentGranularity != opt_newGranularity;) {
          this.selectionWalker.moreGranular(opt_forwards), currentGranularity = this.selectionWalker.currentGranularity
        }
      }
    }
  }
};
cvox.ChromeVoxNavigationManager.prototype.syncToHashTagAnchor = function() {
  var hash = document.location.hash;
  if(hash) {
    var hashContentId = hash.substring(1), anchorNode = document.getElementById(hashContentId);
    if(anchorNode) {
      document.location.hash = "", this.syncToNode(anchorNode), anchorNode.scrollIntoView(!0)
    }
  }
};
cvox.ChromeVoxNavigationManager.prototype.addInterframeListener_ = function() {
  var self = this;
  cvox.Interframe.addListener(function(message) {
    if(!(message.command != "enterIframe" && message.command != "exitIframe")) {
      window.focus();
      self.switchToStrategy(cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM);
      if(message.command == "exitIframe") {
        var id = message.sourceId, iframeElement = self.iframeIdMap[id];
        iframeElement && self.syncToNode(iframeElement)
      }else {
        self.syncToNode(null)
      }
      message.forwards ? self.next(!1) : self.previous(!1);
      self.switchToStrategy(message.strategy, message.granularity, message.forwards);
      cvox.ChromeVox.executeUserCommand("speakCurrentPosition")
    }
  })
};
cvox.ChromeVoxNavigationManager.prototype.tryEnterExitIframe_ = function(node, forwards) {
  if(node == null && window.parent != window) {
    cvox.SelectionUtil.collapseToStart(document.body);
    var message = {command:"exitIframe", forwards:forwards, strategy:this.currentNavStrategy, granularity:this.selectionWalker.currentGranularity};
    cvox.Interframe.sendMessageToParentWindow(message);
    return!0
  }
  if(node == null || node.tagName != "IFRAME") {
    return!1
  }
  cvox.SelectionUtil.collapseToStart(document.body);
  var iframeElement = node, iframeId = void 0, id;
  for(id in this.iframeIdMap) {
    if(this.iframeIdMap[id] == iframeElement) {
      iframeId = id;
      break
    }
  }
  if(iframeId == void 0) {
    iframeId = this.nextIframeId, this.nextIframeId++, this.iframeIdMap[iframeId] = iframeElement, cvox.Interframe.sendIdToIFrame(iframeId, iframeElement)
  }
  message = {command:"enterIframe", forwards:forwards, strategy:this.currentNavStrategy, granularity:this.selectionWalker.currentGranularity};
  cvox.Interframe.sendMessageToIFrame(message, iframeElement);
  return!0
};
cvox.ChromeVoxSearch = {};
cvox.ChromeVoxSearch.txtNode = null;
cvox.ChromeVoxSearch.active = !1;
cvox.ChromeVoxSearch.matchNodes = null;
cvox.ChromeVoxSearch.matchNodesIndex = null;
cvox.ChromeVoxSearch.caseSensitive = !1;
cvox.ChromeVoxSearch.init = function() {
  cvox.ChromeVoxSearch.active = !1;
  cvox.ChromeVoxSearch.caseSensitive = !1;
  window.addEventListener("keypress", cvox.ChromeVoxSearch.processKeyPress, !0);
  window.addEventListener("keydown", cvox.ChromeVoxSearch.processKeyDown, !0);
  window.addEventListener("scroll", cvox.ChromeVoxSearch.scrollHandler, !0)
};
cvox.ChromeVoxSearch.isActive = function() {
  return cvox.ChromeVoxSearch.active
};
cvox.ChromeVoxSearch.show = function() {
  cvox.ChromeVoxSearch.txtNode = document.createElement("div");
  cvox.ChromeVoxSearch.txtNode.style.display = "block";
  cvox.ChromeVoxSearch.txtNode.style.position = "absolute";
  cvox.ChromeVoxSearch.txtNode.style.left = "2px";
  cvox.ChromeVoxSearch.txtNode.style.top = window.scrollY + 2 + "px";
  cvox.ChromeVoxSearch.txtNode.style["line-height"] = "1.2em";
  cvox.ChromeVoxSearch.txtNode.style["z-index"] = "10001";
  cvox.ChromeVoxSearch.txtNode.style["font-size"] = "20px";
  document.body.insertBefore(cvox.ChromeVoxSearch.txtNode, document.body.firstChild);
  cvox.ChromeVoxSearch.active = !0
};
cvox.ChromeVoxSearch.scrollHandler = function() {
  cvox.ChromeVoxSearch.active && (cvox.ChromeVoxSearch.txtNode.style.top = window.scrollY + 2 + "px")
};
cvox.ChromeVoxSearch.processKeyDown = function(evt) {
  if(!cvox.ChromeVoxSearch.active) {
    return!1
  }
  if(evt.keyCode == 8) {
    var searchStr = cvox.ChromeVoxSearch.txtNode.textContent;
    searchStr.length > 0 && (searchStr = searchStr.substring(searchStr, searchStr.length - 1), cvox.ChromeVoxSearch.doSearch(searchStr, cvox.ChromeVoxSearch.caseSensitive));
    evt.preventDefault();
    return!0
  }else {
    if(evt.keyCode == 40) {
      return cvox.ChromeVoxSearch.next(), !0
    }else {
      if(evt.keyCode == 38) {
        return cvox.ChromeVoxSearch.prev(), !0
      }else {
        if(evt.ctrlKey && evt.keyCode == 67) {
          return cvox.ChromeVoxSearch.toggleCaseSensitivity(), !0
        }
      }
    }
  }
  return!1
};
cvox.ChromeVoxSearch.processKeyPress = function(evt) {
  if(!cvox.ChromeVoxSearch.active) {
    return!1
  }
  var searchStr = cvox.ChromeVoxSearch.txtNode.textContent + String.fromCharCode(evt.charCode);
  cvox.ChromeVoxSearch.doSearch(searchStr, cvox.ChromeVoxSearch.caseSensitive);
  evt.preventDefault();
  evt.stopPropagation();
  return!0
};
cvox.ChromeVoxSearch.toggleCaseSensitivity = function() {
  cvox.ChromeVoxSearch.caseSensitive ? (cvox.ChromeVoxSearch.caseSensitive = !1, cvox.ChromeVox.tts.speak("Ignoring case", 0, null)) : (cvox.ChromeVoxSearch.caseSensitive = !0, cvox.ChromeVox.tts.speak("Case sensitive", 0, null))
};
cvox.ChromeVoxSearch.doSearch = function(searchStr, caseSensitive) {
  cvox.ChromeVoxSearch.txtNode.textContent = "";
  cvox.ChromeVoxSearch.matchNodes = [];
  var potentialMatchNodes;
  caseSensitive ? potentialMatchNodes = cvox.XpathUtil.evalXPath('.//text()[contains(.,"' + searchStr + '")]', document.body) : (searchStr = searchStr.toLowerCase(), potentialMatchNodes = cvox.XpathUtil.evalXPath('.//text()[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "' + searchStr + '")]', document.body));
  for(var i = 0, node;node = potentialMatchNodes[i];i++) {
    cvox.DomUtil.hasContent(node) && cvox.ChromeVoxSearch.matchNodes.push(node)
  }
  var firstNode = cvox.ChromeVoxSearch.matchNodes[0];
  if(firstNode) {
    var startIndex = cvox.ChromeVoxSearch.matchNodesIndex = 0, startIndex = caseSensitive ? firstNode.textContent.indexOf(searchStr) : firstNode.textContent.toLowerCase().indexOf(searchStr);
    cvox.SelectionUtil.selectText(firstNode, startIndex, startIndex + searchStr.length);
    cvox.ChromeVox.traverseContent.moveNext("sentence");
    var sel = window.getSelection(), range = sel.getRangeAt(0);
    range.setStart(firstNode, startIndex);
    sel.removeAllRanges();
    sel.addRange(range);
    cvox.SelectionUtil.scrollToSelection(sel);
    cvox.ChromeVox.tts.speak(window.getSelection() + "", 0, null)
  }else {
    cvox.ChromeVox.tts.stop(), cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.WRAP)
  }
  cvox.ChromeVoxSearch.txtNode.textContent = searchStr
};
cvox.ChromeVoxSearch.hide = function() {
  if(cvox.ChromeVoxSearch.active) {
    cvox.ChromeVoxSearch.txtNode.parentNode.removeChild(cvox.ChromeVoxSearch.txtNode), cvox.ChromeVoxSearch.txtNode = null, cvox.ChromeVoxSearch.active = !1
  }
};
cvox.ChromeVoxSearch.next = function() {
  if(cvox.ChromeVoxSearch.matchNodes && cvox.ChromeVoxSearch.matchNodes.length > 0) {
    if(cvox.ChromeVoxSearch.matchNodesIndex++, cvox.ChromeVoxSearch.matchNodes.length > cvox.ChromeVoxSearch.matchNodesIndex) {
      var searchStr = cvox.ChromeVoxSearch.txtNode.textContent, targetNode = cvox.ChromeVoxSearch.matchNodes[cvox.ChromeVoxSearch.matchNodesIndex], startIndex = 0, startIndex = cvox.ChromeVoxSearch.caseSensitive ? targetNode.textContent.indexOf(searchStr) : targetNode.textContent.toLowerCase().indexOf(searchStr.toLowerCase());
      cvox.SelectionUtil.selectText(targetNode, startIndex, startIndex + searchStr.length);
      cvox.ChromeVox.traverseContent.moveNext("sentence");
      var sel = window.getSelection(), range = sel.getRangeAt(0);
      range.setStart(targetNode, startIndex);
      sel.removeAllRanges();
      sel.addRange(range);
      cvox.SelectionUtil.scrollToSelection(sel);
      cvox.ChromeVox.tts.speak(window.getSelection() + "", 0, null)
    }else {
      cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.WRAP), cvox.ChromeVoxSearch.matchNodesIndex = -1, cvox.ChromeVoxSearch.next()
    }
  }
};
cvox.ChromeVoxSearch.prev = function() {
  if(cvox.ChromeVoxSearch.matchNodes && cvox.ChromeVoxSearch.matchNodes.length > 0) {
    if(cvox.ChromeVoxSearch.matchNodesIndex--, cvox.ChromeVoxSearch.matchNodesIndex > -1) {
      var searchStr = cvox.ChromeVoxSearch.txtNode.textContent, targetNode = cvox.ChromeVoxSearch.matchNodes[cvox.ChromeVoxSearch.matchNodesIndex], startIndex = 0, startIndex = cvox.ChromeVoxSearch.caseSensitive ? targetNode.textContent.indexOf(searchStr) : targetNode.textContent.toLowerCase().indexOf(searchStr.toLowerCase());
      cvox.SelectionUtil.selectText(targetNode, startIndex, startIndex + searchStr.length);
      cvox.ChromeVox.traverseContent.moveNext("sentence");
      var sel = window.getSelection(), range = sel.getRangeAt(0);
      range.setStart(targetNode, startIndex);
      sel.removeAllRanges();
      sel.addRange(range);
      cvox.SelectionUtil.scrollToSelection(sel);
      cvox.ChromeVox.tts.speak(window.getSelection() + "", 0, null)
    }else {
      cvox.ChromeVox.earcons.playEarcon(cvox.AbstractEarcons.WRAP), cvox.ChromeVoxSearch.matchNodesIndex = cvox.ChromeVoxSearch.matchNodes.length, cvox.ChromeVoxSearch.prev()
    }
  }
};
cvox.AbstractEarconsManager = function() {
  cvox.AbstractEarcons.call(this)
};
goog.inherits(cvox.AbstractEarconsManager, cvox.AbstractEarcons);
cvox.AbstractEarconsManager.prototype.nextEarcons = function(announce) {
  this.logEnabled() && this.log("[" + this.getName() + "] nextEarcons(" + announce + ")")
};
cvox.LocalEarconsManager = function(earcons, ttsManager) {
  cvox.AbstractEarconsManager.call(this);
  this.earcons = earcons;
  this.ttsManager = ttsManager;
  this.currentEarcons = null;
  this.currentEarconsIndex = -1;
  this.nextEarcons(!1)
};
goog.inherits(cvox.LocalEarconsManager, cvox.AbstractEarconsManager);
cvox.LocalEarconsManager.prototype.getName = function() {
  return"LocalEarconsManager"
};
cvox.LocalEarconsManager.prototype.playEarcon = function(earcon) {
  cvox.LocalEarconsManager.superClass_.playEarcon.call(this, earcon);
  this.currentEarcons && this.currentEarcons.playEarcon(earcon)
};
cvox.LocalEarconsManager.prototype.nextEarcons = function(announce) {
  cvox.LocalEarconsManager.superClass_.nextEarcons.call(this, announce);
  if(this.earcons) {
    this.currentEarcons = null;
    this.currentEarconsIndex = (this.currentEarconsIndex + 1) % this.earcons.length;
    try {
      this.currentEarcons = new this.earcons[this.currentEarconsIndex], console.log("Switching to earcons: " + this.currentEarcons.getName()), announce && this.ttsManager.speak(this.currentEarcons.getName())
    }catch(err) {
      console.log("error switching to earcon #" + this.currentEarconsIndex)
    }
  }
};
cvox.BuildDefs = {};
cvox.BuildConfig = {};
goog == void 0 && (cvox = {});
cvox.ExtensionBridge = function() {
};
var chromevis = {};
chromevis.ChromeVisLens = function() {
  this.padding_ = 5;
  this.maxBubbleWidth_ = 700;
  this.minBubbleWidth_ = 25;
  this.isLensDisplayed_ = !1;
  this.isCentered = !0;
  this.multiplier = 1.5;
  this.textColor = "#FFFFFF";
  this.bgColor = "#000000";
  this.isAnchored = !0;
  this.lens = chromevis.ChromeVisLens.ACTIVE_DOC.createElement("span");
  this.initializeLens_()
};
chromevis.ChromeVisLens.EL_ID = "chromeVisBackground2LensDiv";
chromevis.ChromeVisLens.CENTER_ATTRB = "data-isCentered";
chromevis.ChromeVisLens.MULT_ATTRB = "data-textMag";
chromevis.ChromeVisLens.TXT_COLOR_ATTRB = "data-textColor";
chromevis.ChromeVisLens.BG_COLOR_ATTRB = "data-bgColor";
chromevis.ChromeVisLens.ANCHOR_ATTRB = "data-isAnchored";
chromevis.ChromeVisLens.ACTIVE_DOC = window.document;
chromevis.ChromeVisLens.prototype.initializeLens_ = function() {
  this.initializeLensCSS_();
  this.lens.style.display = "none";
  chromevis.ChromeVisLens.ACTIVE_DOC.body.appendChild(this.lens);
  this.setupMessageListener_();
  this.updateAnchorLens()
};
chromevis.ChromeVisLens.prototype.setupMessageListener_ = function() {
};
chromevis.ChromeVisLens.prototype.initializeLensCSS_ = function() {
  this.lens.style.backgroundColor = this.bgColor;
  this.lens.style.borderColor = "#000000";
  this.lens.style.borderWidth = "medium";
  this.lens.style.borderStyle = "groove";
  this.lens.style.position = "absolute";
  this.lens.style.zIndex = 1E11;
  this.lens.style.minHeight = "5px";
  this.lens.style.webkitBorderRadius = "7px";
  this.lens.className = cvox.TraverseUtil.SKIP_CLASS
};
chromevis.ChromeVisLens.prototype.updateAnchorLens = function() {
  this.lens.style.top = window.scrollY + "px";
  this.lens.style.minWidth = window.innerWidth - 50 + "px";
  this.lens.style.maxWidth = window.innerWidth - 50 + "px";
  this.lens.style.left = "10px";
  this.lens.style.right = "100px";
  var bod = document.body, str_ht = window.getComputedStyle(this.lens, null).height, ht = parseInt(str_ht.substr(0, str_ht.length - 2), 10) + 20;
  bod.style.marginTop = ht + "px"
};
chromevis.ChromeVisLens.prototype.updateBubbleLens = function() {
  var sel = window.getSelection(), pos = cvox.SelectionUtil.findSelPosition(sel), top, left;
  top = pos[0];
  left = pos[1];
  this.lens.style.minWidth = 0;
  var parent, maxw;
  if(this.isCentered) {
    for(parent = sel.getRangeAt(0).commonAncestorContainer;!parent.offsetWidth;) {
      parent = parent.parentNode
    }
    maxw = Math.min(this.maxBubbleWidth_, parent.offsetWidth)
  }else {
    maxw = Math.min(this.maxBubbleWidth_, document.body.clientWidth - left - 16)
  }
  this.lens.style.maxWidth = maxw + "px";
  if(this.lens.firstChild.scrollWidth > maxw) {
    var shiftLeft = this.lens.firstChild.scrollWidth - maxw;
    this.lens.style.maxWidth = this.lens.firstChild.scrollWidth + "px";
    this.lens.style.left = left - shiftLeft + "px"
  }else {
    if(this.isCentered) {
      var pleft = 0, obj = parent;
      if(obj.offsetParent) {
        pleft = obj.offsetLeft;
        for(obj = obj.offsetParent;obj !== null;) {
          pleft += obj.offsetLeft, obj = obj.offsetParent
        }
      }
      this.lens.style.left = Math.ceil(pleft + parent.offsetWidth / 2 - this.lens.firstChild.scrollWidth / 2) + "px"
    }else {
      this.lens.style.left = left + "px"
    }
  }
  this.lens.style.right = "auto";
  var str_ht = window.getComputedStyle(this.lens, null).height, ht = parseInt(str_ht.substr(0, str_ht.length - 2), 10) + 20, actualTop = top - ht;
  this.lens.style.top = actualTop < 0 ? "5px" : actualTop + "px"
};
chromevis.ChromeVisLens.prototype.updateText = function() {
  if(this.isLensDisplayed_) {
    chromevis.ChromeVisLens.ACTIVE_DOC = window.document;
    chromevis.ChromeVisLens.ACTIVE_DOC.body.removeChild(this.lens);
    this.lens = chromevis.ChromeVisLens.ACTIVE_DOC.createElement("span");
    this.initializeLensCSS_();
    chromevis.ChromeVisLens.ACTIVE_DOC.body.appendChild(this.lens);
    var sel = window.getSelection(), selectedText = sel.toString();
    for(selectedText == null && (selectedText = "");this.lens.firstChild;) {
      this.lens.removeChild(this.lens.firstChild)
    }
    for(var clonedNode = document.createElement("div"), newSelectedText = "", childNode = document.createElement("div"), i = 0;i < selectedText.length;i++) {
      selectedText.charCodeAt(i) == 10 ? (childNode.textContent = newSelectedText, clonedNode.appendChild(childNode), childNode = document.createElement("div"), newSelectedText = "") : newSelectedText += selectedText.charAt(i)
    }
    childNode.textContent = newSelectedText;
    clonedNode.appendChild(childNode);
    clonedNode.style.fontFamily = "Verdana, Arial, Helvetica, sans-serif";
    clonedNode.style.fontWeight = "normal";
    clonedNode.style.fontStyle = "normal";
    clonedNode.style.color = this.textColor;
    clonedNode.style.textDecoration = "none";
    clonedNode.style.textAlign = "left";
    clonedNode.style.lineHeight = 1.2;
    this.lens.appendChild(clonedNode);
    this.magnifyText_();
    this.padText_();
    this.isAnchored ? this.updateAnchorLens() : this.updateBubbleLens()
  }
};
chromevis.ChromeVisLens.prototype.magnifyText_ = function() {
  var adjustment = this.multiplier * 100 + "%";
  if(this.lens.firstChild && this.lens.firstChild.hasChildNodes()) {
    for(var children = this.lens.firstChild.childNodes, i = 0;i < children.length;i++) {
      children[i].style.fontSize = adjustment
    }
  }
};
chromevis.ChromeVisLens.prototype.padText_ = function() {
  if(!(this.padding_ < 0)) {
    this.lens.style.padding_ = this.padding_ + "px"
  }
};
cvox.ChromeVoxUserCommands = function() {
};
cvox.ChromeVoxUserCommands.commands = {};
cvox.ChromeVoxUserCommands.stickyModeEnabledMessage = "Sticky mode enabled";
cvox.ChromeVoxUserCommands.stickyModeDisabledMessage = "Sticky mode disabled";
cvox.ChromeVoxUserCommands.powerkey = null;
cvox.ChromeVoxUserCommands.powerkeyActionCallback = null;
cvox.ChromeVoxUserCommands.userCommandLevel_ = 0;
cvox.ChromeVoxUserCommands.initPowerKey = function(keyMap, callback) {
  var list = [], cmds = [], key;
  for(key in keyMap) {
    list.push(keyMap[key][1] + " - " + cvox.ChromeVoxUserCommands.getReadableShortcut(key)), cmds.push(key)
  }
  cvox.ChromeVoxUserCommands.powerkey = new PowerKey("main", null);
  PowerKey.setDefaultCSSStyle();
  cvox.ChromeVoxUserCommands.powerkey.setCompletionPromptStr("Search for a keyboard shortcut or use Up/Down arrow keys to browse.");
  cvox.ChromeVoxUserCommands.powerkey.createCompletionField(document.body, 50, cvox.ChromeVoxUserCommands.powerkeyActionHandler, null, list, !1);
  cvox.ChromeVoxUserCommands.powerkey.setAutoHideCompletionField(!0);
  cvox.ChromeVoxUserCommands.powerkey.hideOnEsc(!1);
  cvox.ChromeVoxUserCommands.powerkey.setBrowseCallback(cvox.ChromeVoxUserCommands.powerkeyBrowseHandler);
  cvox.ChromeVoxUserCommands.powerkeyActionCallback = callback;
  return cmds
};
cvox.ChromeVoxUserCommands.getReadableShortcut = function(key) {
  for(var tokens = key.split("+"), i = 0;i < tokens.length;i++) {
    if(tokens[i].charAt(0) == "#" && tokens[i].indexOf(">") == -1) {
      var keyCode = parseInt(tokens[i].substr(1), 10);
      tokens[i] = cvox.KeyUtil.getReadableNameForKeyCode(keyCode)
    }else {
      for(var seqs = tokens[i].split(">"), j = 0;j < seqs.length;j++) {
        seqs[j].charAt(0) == "#" && (keyCode = parseInt(seqs[j].substr(1), 10), seqs[j] = cvox.KeyUtil.getReadableNameForKeyCode(keyCode)), seqs[j] = cvox.KeyUtil.getReadableNameForStr(seqs[j]) || seqs[j]
      }
      tokens[i] = seqs.join(", ")
    }
    tokens[i] = cvox.KeyUtil.getReadableNameForStr(tokens[i]) || tokens[i]
  }
  return tokens.join(" + ").replace(/^[\+\s]*/, "").replace(/[\+\s]*$/, "")
};
cvox.ChromeVoxUserCommands.powerkeyBrowseHandler = function(completion) {
  cvox.ChromeVox.tts.speak(completion, 0, null)
};
cvox.ChromeVoxUserCommands.powerkeyActionHandler = function(completion, index) {
  cvox.ChromeVoxUserCommands.hidePowerKey();
  window.setTimeout(function() {
    cvox.ChromeVoxUserCommands.powerkeyActionCallback && cvox.ChromeVoxUserCommands.powerkeyActionCallback(completion, index)
  }, 1)
};
cvox.ChromeVoxUserCommands.hidePowerKey = function() {
  cvox.ChromeVoxUserCommands.powerkey.isVisible() && (cvox.ChromeVoxUserCommands.powerkey.updateCompletionField(PowerKey.status.HIDDEN), cvox.ChromeVoxUserCommands.savedCurrentNode && window.setTimeout(function() {
    cvox.DomUtil.setFocus(cvox.ChromeVoxUserCommands.savedCurrentNode)
  }, 0))
};
cvox.ChromeVoxUserCommands.commands.showPowerKey = function() {
  cvox.ChromeVoxUserCommands.savedCurrentNode = cvox.ChromeVox.navigationManager.getCurrentNode();
  cvox.ChromeVoxUserCommands.powerkey.updateCompletionField(PowerKey.status.VISIBLE);
  return!1
};
cvox.ChromeVoxUserCommands.commands.hidePowerKey = function() {
  cvox.ChromeVoxUserCommands.hidePowerKey();
  return!1
};
cvox.ChromeVoxUserCommands.commands.stopSpeech = function() {
  cvox.ChromeVox.tts.stop();
  return!1
};
cvox.ChromeVoxUserCommands.commands.toggleStickyMode = function() {
  cvox.ChromeVox.isStickyOn = !cvox.ChromeVox.isStickyOn;
  cvox.ChromeVoxUserCommands.speakAtLowerPitch(cvox.ChromeVox.isStickyOn ? cvox.ChromeVoxUserCommands.stickyModeEnabledMessage : cvox.ChromeVoxUserCommands.stickyModeDisabledMessage);
  return!1
};
cvox.ChromeVoxUserCommands.commands.forward = function() {
  cvox.ChromeVoxUserCommands.markInUserCommand_();
  var navSucceeded = cvox.ChromeVox.navigationManager.next(!0);
  if(cvox.ChromeVox.navigationManager.inTableMode() && !cvox.ChromeVox.navigationManager.checkCellBoundaries()) {
    return navSucceeded = cvox.ChromeVox.navigationManager.previous(!0), cvox.ChromeVoxUserCommands.finishNavCommand("End of cell. "), !navSucceeded
  }
  cvox.ChromeVoxUserCommands.finishNavCommand("");
  return!navSucceeded
};
cvox.ChromeVoxUserCommands.commands.backward = function() {
  cvox.ChromeVoxUserCommands.markInUserCommand_();
  var navSucceeded = cvox.ChromeVox.navigationManager.previous(!0);
  if(cvox.ChromeVox.navigationManager.inTableMode() && !cvox.ChromeVox.navigationManager.checkCellBoundaries()) {
    return navSucceeded = cvox.ChromeVox.navigationManager.next(!0), cvox.ChromeVoxUserCommands.finishNavCommand("End of cell. "), !navSucceeded
  }
  cvox.ChromeVoxUserCommands.finishNavCommand("");
  return!navSucceeded
};
cvox.ChromeVoxUserCommands.commands.previousGranularity = function() {
  cvox.ChromeVox.navigationManager.up();
  var strategy = cvox.ChromeVox.navigationManager.getStrategy();
  strategy == "SELECTION" && (strategy = cvox.ChromeVox.navigationManager.getGranularity());
  cvox.ChromeVoxUserCommands.finishNavCommand(strategy + " ");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextGranularity = function() {
  cvox.ChromeVox.navigationManager.down();
  var strategy = cvox.ChromeVox.navigationManager.getStrategy();
  strategy == "SELECTION" && (strategy = cvox.ChromeVox.navigationManager.getGranularity());
  cvox.ChromeVoxUserCommands.finishNavCommand(strategy + " ");
  return!1
};
cvox.ChromeVoxUserCommands.commands.speakCurrentPosition = function() {
  cvox.ChromeVoxUserCommands.finishNavCommand("");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nop = function() {
  return!1
};
cvox.ChromeVoxUserCommands.finishNavCommand = function(messagePrefixStr) {
  cvox.ChromeVox.lens && cvox.ChromeVox.lens.updateText();
  var descriptionArray = cvox.ChromeVox.navigationManager.getCurrentDescription(), contentStr = descriptionArray[0], descriptionStr = descriptionArray[1], contentStr = contentStr.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, ""), descriptionStr = descriptionStr.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
  setTimeout(function() {
    cvox.ChromeVox.navigationManager.setFocus()
  }, 0);
  cvox.SelectionUtil.scrollToSelection(window.getSelection());
  cvox.ChromeVox.navigationManager.syncToSelection();
  messagePrefixStr != "" && descriptionStr != "" ? (cvox.ChromeVoxUserCommands.speakAtLowerPitch(messagePrefixStr), cvox.ChromeVox.tts.speak(contentStr, 1, null), cvox.ChromeVoxUserCommands.speakAtLowerPitch(descriptionStr, 1)) : messagePrefixStr != "" ? (cvox.ChromeVoxUserCommands.speakAtLowerPitch(messagePrefixStr), cvox.ChromeVox.tts.speak(contentStr, 1, null)) : descriptionStr != "" ? (cvox.ChromeVox.tts.speak(contentStr, 0, null), cvox.ChromeVoxUserCommands.speakAtLowerPitch(descriptionStr, 
  1)) : cvox.ChromeVox.tts.speak(contentStr, 0, null);
  cvox.ChromeVoxUserCommands.playEarcons()
};
cvox.ChromeVoxUserCommands.speakAtLowerPitch = function(lowerPitchStr, queue) {
  cvox.ChromeVox.tts.decreaseProperty("Pitch", !1);
  queue ? cvox.ChromeVox.tts.speak(lowerPitchStr, queue, null) : cvox.ChromeVox.tts.speak(lowerPitchStr, 0, null);
  cvox.ChromeVox.tts.increaseProperty("Pitch", !1)
};
cvox.ChromeVoxUserCommands.playEarcons = function() {
  for(var ancestors = cvox.ChromeVox.navigationManager.getChangedAncestors(), earcons = [], i = 0;i < ancestors.length;i++) {
    var node = ancestors[i];
    if(cvox.AriaUtil.isControlWidget(node)) {
      var role = node.getAttribute("role");
      switch(role) {
        case "button":
          earcons.push(cvox.AbstractEarcons.BUTTON);
          break;
        case "checkbox":
        ;
        case "radio":
        ;
        case "menuitemcheckbox":
        ;
        case "menuitemradio":
          node.getAttribute("aria-checked") ? earcons.push(cvox.AbstractEarcons.CHECK_ON) : earcons.push(cvox.AbstractEarcons.CHECK_OFF);
          break;
        case "combobox":
          earcons.push(cvox.AbstractEarcons.LISTBOX);
          break;
        case "textbox":
          earcons.push(cvox.AbstractEarcons.EDITABLE_TEXT)
      }
    }else {
      switch(node.tagName) {
        case "BUTTON":
          earcons.push(cvox.AbstractEarcons.BUTTON);
          break;
        case "A":
          earcons.push(cvox.AbstractEarcons.LINK);
          break;
        case "LI":
          earcons.push(cvox.AbstractEarcons.LIST_ITEM);
          break;
        case "SELECT":
          earcons.push(cvox.AbstractEarcons.LISTBOX);
          break;
        case "TEXTAREA":
          earcons.push(cvox.AbstractEarcons.EDITABLE_TEXT);
          break;
        case "INPUT":
          switch(node.type) {
            case "submit":
            ;
            case "reset":
              earcons.push(cvox.AbstractEarcons.BUTTON);
              break;
            case "checkbox":
            ;
            case "radio":
              node.value ? earcons.push(cvox.AbstractEarcons.CHECK_ON) : earcons.push(cvox.AbstractEarcons.CHECK_OFF);
              break;
            default:
              cvox.DomUtil.isInputTypeText(node) && earcons.push(cvox.AbstractEarcons.EDITABLE_TEXT)
          }
      }
    }
  }
  for(var j = 0;j < earcons.length;j++) {
    cvox.ChromeVox.earcons.playEarcon(earcons[j])
  }
};
cvox.ChromeVoxUserCommands.findNextAndSpeak_ = function(predicate, errorStr) {
  cvox.ChromeVoxUserCommands.markInUserCommand_();
  cvox.ChromeVox.navigationManager.findNext(predicate) ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch(errorStr)
};
cvox.ChromeVoxUserCommands.findPreviousAndSpeak_ = function(predicate, errorStr) {
  cvox.ChromeVoxUserCommands.markInUserCommand_();
  cvox.ChromeVox.navigationManager.findPrevious(predicate) ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch(errorStr)
};
cvox.ChromeVoxUserCommands.containsTagName_ = function(arr, tagName) {
  for(var i = arr.length;i--;) {
    if(arr[i].tagName == tagName) {
      return arr[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.markInUserCommand_ = function() {
  cvox.ChromeVoxUserCommands.userCommandLevel_ += 1;
  setTimeout(function() {
    cvox.ChromeVoxUserCommands.userCommandLevel_ -= 1
  }, 100)
};
cvox.ChromeVoxUserCommands.isInUserCommand = function() {
  return cvox.ChromeVoxUserCommands.userCommandLevel_ > 0
};
cvox.ChromeVoxUserCommands.commands.handleTab = function() {
  var previousDummySpan = document.getElementById("ChromeVoxTabDummySpan");
  previousDummySpan && previousDummySpan.parentNode.removeChild(previousDummySpan);
  cvox.ChromeVoxSearch.hide();
  var tagName = "A";
  if(document.activeElement.tagName == tagName || cvox.DomUtil.isControl(document.activeElement)) {
    return!0
  }
  var sel = window.getSelection();
  if(sel == null || sel.anchorNode == null || sel.focusNode == null) {
    return!0
  }
  if(sel.anchorNode.tagName && (sel.anchorNode.tagName == tagName || cvox.DomUtil.isControl(sel.anchorNode))) {
    return sel.anchorNode.focus(), !0
  }
  if(sel.focusNode.tagName && (sel.focusNode.tagName == tagName || cvox.DomUtil.isControl(sel.focusNode))) {
    return sel.focusNode.focus(), !0
  }
  if(sel.anchorNode.parentNode.tagName && (sel.anchorNode.parentNode.tagName == tagName || cvox.DomUtil.isControl(sel.anchorNode.parentNode))) {
    return sel.anchorNode.parentNode.focus(), !0
  }
  if(sel.focusNode.parentNode.tagName && (sel.focusNode.parentNode.tagName == tagName || cvox.DomUtil.isControl(sel.focusNode))) {
    return sel.focusNode.parentNode.focus(), !0
  }
  var span = document.createElement("span");
  span.id = "ChromeVoxTabDummySpan";
  sel.anchorNode.parentNode.insertBefore(span, sel.anchorNode);
  span.tabIndex = -1;
  span.focus();
  return!0
};
cvox.ChromeVoxUserCommands.commands.toggleSearchWidget = function() {
  cvox.ChromeVoxSearch.isActive() ? (cvox.ChromeVoxSearch.hide(), cvox.ChromeVoxUserCommands.speakAtLowerPitch("Browse")) : (cvox.ChromeVoxSearch.show(), cvox.ChromeVoxUserCommands.speakAtLowerPitch("Search"));
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextTtsEngine = function() {
  cvox.ChromeVox.tts.nextEngine();
  return!1
};
cvox.ChromeVoxUserCommands.commands.decreaseTtsRate = function() {
  cvox.ChromeVox.tts.decreaseProperty("Rate", !0);
  return!1
};
cvox.ChromeVoxUserCommands.commands.increaseTtsRate = function() {
  cvox.ChromeVox.tts.increaseProperty("Rate", !0);
  return!1
};
cvox.ChromeVoxUserCommands.commands.decreaseTtsPitch = function() {
  cvox.ChromeVox.tts.decreaseProperty("Pitch", !0);
  return!1
};
cvox.ChromeVoxUserCommands.commands.increaseTtsPitch = function() {
  cvox.ChromeVox.tts.increaseProperty("Pitch", !0);
  return!1
};
cvox.ChromeVoxUserCommands.commands.decreaseTtsVolume = function() {
  cvox.ChromeVox.tts.decreaseProperty("Volume", !0);
  return!1
};
cvox.ChromeVoxUserCommands.commands.increaseTtsVolume = function() {
  cvox.ChromeVox.tts.increaseProperty("Volume", !0);
  return!1
};
cvox.ChromeVoxUserCommands.commands.help = function() {
  cvox.ExtensionBridge.send({target:"HelpDocs", action:"open"});
  return!1
};
cvox.ChromeVoxUserCommands.commands.showBookmarkManager = function() {
  cvox.ExtensionBridge.send({target:"BookmarkManager", action:"open"});
  return!1
};
cvox.ChromeVoxUserCommands.commands.showOptionsPage = function() {
  cvox.ExtensionBridge.send({target:"Options", action:"open"});
  return!1
};
cvox.ChromeVoxUserCommands.commands.showKbExplorerPage = function() {
  cvox.ExtensionBridge.send({target:"KbExplorer", action:"open"});
  return!1
};
cvox.ChromeVoxUserCommands.commands.debug = function() {
  alert("ok");
  return!1
};
cvox.ChromeVoxUserCommands.commands.enterTable = function() {
  cvox.ChromeVox.navigationManager.enterTable() ? cvox.ChromeVoxUserCommands.finishNavCommand("Inside table ") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("No table found.")
};
cvox.ChromeVoxUserCommands.commands.exitTable = function() {
  cvox.ChromeVox.navigationManager.exitTable();
  cvox.ChromeVoxUserCommands.finishNavCommand("Leaving table. ")
};
cvox.ChromeVoxUserCommands.commands.previousRow = function() {
  cvox.ChromeVox.navigationManager.inTableMode() ? cvox.ChromeVox.navigationManager.previousRow() ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("No cell above.") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
};
cvox.ChromeVoxUserCommands.commands.nextRow = function() {
  cvox.ChromeVox.navigationManager.inTableMode() ? cvox.ChromeVox.navigationManager.nextRow() ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("No cell below.") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
};
cvox.ChromeVoxUserCommands.commands.previousCol = function() {
  cvox.ChromeVox.navigationManager.inTableMode() ? cvox.ChromeVox.navigationManager.previousCol() ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("No cell on left.") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
};
cvox.ChromeVoxUserCommands.commands.nextCol = function() {
  cvox.ChromeVox.navigationManager.inTableMode() ? cvox.ChromeVox.navigationManager.nextCol() ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("No cell on right.") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
};
cvox.ChromeVoxUserCommands.commands.announceHeaders = function() {
  if(cvox.ChromeVox.navigationManager.inTableMode()) {
    var rowHeader = cvox.ChromeVox.navigationManager.getRowHeaderText(), colHeader = cvox.ChromeVox.navigationManager.getColHeaderText();
    rowHeader != "" && cvox.ChromeVox.tts.speak("Row header: " + rowHeader, 0, null);
    colHeader != "" && cvox.ChromeVox.tts.speak("Column header: " + colHeader, 1, null);
    rowHeader == "" && colHeader == "" && cvox.ChromeVox.tts.speak("No headers", 0, null)
  }else {
    cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
  }
};
cvox.ChromeVoxUserCommands.commands.speakTableLocation = function() {
  if(cvox.ChromeVox.navigationManager.inTableMode()) {
    var description = "";
    description += "Row " + cvox.ChromeVox.navigationManager.getRowIndex() + " of " + cvox.ChromeVox.navigationManager.getRowCount() + ", Column " + cvox.ChromeVox.navigationManager.getColIndex() + " of " + cvox.ChromeVox.navigationManager.getColCount();
    cvox.ChromeVox.tts.speak(description, 0, null)
  }else {
    cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
  }
};
cvox.ChromeVoxUserCommands.commands.guessRowHeader = function() {
  if(cvox.ChromeVox.navigationManager.inTableMode()) {
    var rowHeader = cvox.ChromeVox.navigationManager.getRowHeaderText();
    if(rowHeader != "") {
      cvox.ChromeVox.tts.speak("Row header: " + rowHeader, 0, null)
    }else {
      var guessRowHeader = cvox.ChromeVox.navigationManager.getRowHeaderGuess();
      cvox.ChromeVox.tts.speak("Row header: " + guessRowHeader, 0, null)
    }
  }else {
    cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
  }
};
cvox.ChromeVoxUserCommands.commands.guessColHeader = function() {
  if(cvox.ChromeVox.navigationManager.inTableMode()) {
    var colHeader = cvox.ChromeVox.navigationManager.getColHeaderText();
    if(colHeader != "") {
      cvox.ChromeVox.tts.speak("Col header: " + colHeader, 0, null)
    }else {
      var guessColHeader = cvox.ChromeVox.navigationManager.getColHeaderGuess();
      cvox.ChromeVox.tts.speak("Col header: " + guessColHeader, 0, null)
    }
  }else {
    cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
  }
};
cvox.ChromeVoxUserCommands.commands.skipToBeginning = function() {
  cvox.ChromeVox.navigationManager.goToFirstCell() ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
};
cvox.ChromeVoxUserCommands.commands.skipToEnd = function() {
  cvox.ChromeVox.navigationManager.goToLastCell() ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
};
cvox.ChromeVoxUserCommands.commands.skipToRowBeginning = function() {
  cvox.ChromeVox.navigationManager.goToRowFirstCell() ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
};
cvox.ChromeVoxUserCommands.commands.skipToRowEnd = function() {
  cvox.ChromeVox.navigationManager.goToRowLastCell() ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
};
cvox.ChromeVoxUserCommands.commands.skipToColBeginning = function() {
  cvox.ChromeVox.navigationManager.goToColFirstCell() ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
};
cvox.ChromeVoxUserCommands.commands.skipToColEnd = function() {
  cvox.ChromeVox.navigationManager.goToColLastCell() ? cvox.ChromeVoxUserCommands.finishNavCommand("") : cvox.ChromeVoxUserCommands.speakAtLowerPitch("Not inside table.")
};
cvox.ChromeVoxUserCommands.commands.nextCheckbox = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.checkboxPredicate_, "No next checkbox.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousCheckbox = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.checkboxPredicate_, "No previous checkbox.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextRadio = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.radioPredicate_, "No next radio button.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousRadio = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.radioPredicate_, "No previous radio button.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextSlider = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.sliderPredicate_, "No next slider.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousSlider = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.sliderPredicate_, "No previous slider.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextGraphic = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.graphicPredicate_, "No next graphic.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousGraphic = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.graphicPredicate_, "No previous graphic.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextButton = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.buttonPredicate_, "No next button.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousButton = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.buttonPredicate_, "No previous button.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextComboBox = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.comboBoxPredicate_, "No next combo box.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousComboBox = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.comboBoxPredicate_, "No previous combo box.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextEditText = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.editTextPredicate_, "No next editable text field.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousEditText = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.editTextPredicate_, "No previous editable text field.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextHeading = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.headingPredicate_, "No next heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousHeading = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.headingPredicate_, "No previous heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextHeading1 = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.heading1Predicate_, "No next level 1 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousHeading1 = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.heading1Predicate_, "No previous level 1 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextHeading2 = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.heading2Predicate_, "No next level 2 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousHeading2 = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.heading2Predicate_, "No previous level 2 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextHeading3 = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.heading3Predicate_, "No next level 3 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousHeading3 = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.heading3Predicate_, "No previous level 3 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextHeading4 = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.heading4Predicate_, "No next level 4 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousHeading4 = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.heading4Predicate_, "No previous level 4 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextHeading5 = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.heading5Predicate_, "No next level 5 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousHeading5 = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.heading5Predicate_, "No previous level 5 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextHeading6 = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.heading6Predicate_, "No next level 6 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousHeading6 = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.heading6Predicate_, "No previous level 6 heading.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextNotLink = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.notLinkPredicate_, "No next item that isn't a link.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousNotLink = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.notLinkPredicate_, "No previous item that isn't a link.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextLink = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.linkPredicate_, "No next link.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousLink = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.linkPredicate_, "No previous link.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextTable = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.tablePredicate_, "No next table.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousTable = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.tablePredicate_, "No previous table.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextList = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.listPredicate_, "No next list.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousList = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.listPredicate_, "No previous list.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextListItem = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.listItemPredicate_, "No next list item.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousListItem = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.listItemPredicate_, "No previous list item.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextBlockquote = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.blockquotePredicate_, "No next blockquote.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousBlockquote = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.blockquotePredicate_, "No previous blockquote.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.nextFormField = function() {
  cvox.ChromeVoxUserCommands.findNextAndSpeak_(cvox.ChromeVoxUserCommands.formFieldPredicate_, "No next form field.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.previousFormField = function() {
  cvox.ChromeVoxUserCommands.findPreviousAndSpeak_(cvox.ChromeVoxUserCommands.formFieldPredicate_, "No previous form field.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.actOnCurrentItem = function() {
  var actionTaken = cvox.ChromeVox.navigationManager.actOnCurrentItem();
  actionTaken || cvox.ChromeVoxUserCommands.speakAtLowerPitch("No actions available.");
  return!1
};
cvox.ChromeVoxUserCommands.commands.forceClickOnCurrentItem = function() {
  cvox.ChromeVoxUserCommands.speakAtLowerPitch("Clicked.");
  cvox.DomUtil.clickElem(cvox.ChromeVox.navigationManager.currentNode, !1);
  return!1
};
cvox.ChromeVoxUserCommands.checkboxPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute && nodes[i].getAttribute("role") == "checkbox" || nodes[i].tagName == "INPUT" && nodes[i].type == "checkbox") {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.radioPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute && nodes[i].getAttribute("role") == "radio" || nodes[i].tagName == "INPUT" && nodes[i].type == "radio") {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.sliderPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute && nodes[i].getAttribute("role") == "slider" || nodes[i].tagName == "INPUT" && nodes[i].type == "range") {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.graphicPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].tagName == "IMG" || nodes[i].tagName == "INPUT" && nodes[i].type == "img") {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.buttonPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute && nodes[i].getAttribute("role") == "button" || nodes[i].tagName == "BUTTON" || nodes[i].tagName == "INPUT" && nodes[i].type == "submit" || nodes[i].tagName == "INPUT" && nodes[i].type == "reset") {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.comboBoxPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute && nodes[i].getAttribute("role") == "combobox" || nodes[i].tagName == "SELECT") {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.editTextPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute && nodes[i].getAttribute("role") == "textbox" || nodes[i].tagName == "TEXTAREA" || nodes[i].tagName == "INPUT" && cvox.DomUtil.isInputTypeText(nodes[i])) {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.headingPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute && nodes[i].getAttribute("role") == "heading") {
      return nodes[i]
    }
    switch(nodes[i].tagName) {
      case "H1":
      ;
      case "H2":
      ;
      case "H3":
      ;
      case "H4":
      ;
      case "H5":
      ;
      case "H6":
        return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.heading1Predicate_ = function(nodes) {
  return cvox.ChromeVoxUserCommands.containsTagName_(nodes, "H1")
};
cvox.ChromeVoxUserCommands.heading2Predicate_ = function(nodes) {
  return cvox.ChromeVoxUserCommands.containsTagName_(nodes, "H2")
};
cvox.ChromeVoxUserCommands.heading3Predicate_ = function(nodes) {
  return cvox.ChromeVoxUserCommands.containsTagName_(nodes, "H3")
};
cvox.ChromeVoxUserCommands.heading4Predicate_ = function(nodes) {
  return cvox.ChromeVoxUserCommands.containsTagName_(nodes, "H4")
};
cvox.ChromeVoxUserCommands.heading5Predicate_ = function(nodes) {
  return cvox.ChromeVoxUserCommands.containsTagName_(nodes, "H5")
};
cvox.ChromeVoxUserCommands.heading6Predicate_ = function(nodes) {
  return cvox.ChromeVoxUserCommands.containsTagName_(nodes, "H6")
};
cvox.ChromeVoxUserCommands.notLinkPredicate_ = function(nodes) {
  return cvox.ChromeVoxUserCommands.linkPredicate_(nodes) == null
};
cvox.ChromeVoxUserCommands.linkPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute && nodes[i].getAttribute("role") == "link" || nodes[i].tagName == "A") {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.tablePredicate_ = function(nodes) {
  return cvox.ChromeVoxUserCommands.containsTagName_(nodes, "TABLE")
};
cvox.ChromeVoxUserCommands.listPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute && nodes[i].getAttribute("role") == "list" || nodes[i].tagName == "UL" || nodes[i].tagName == "OL") {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.listItemPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    if(nodes[i].getAttribute && nodes[i].getAttribute("role") == "listitem" || nodes[i].tagName == "LI") {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxUserCommands.blockquotePredicate_ = function(nodes) {
  return cvox.ChromeVoxUserCommands.containsTagName_(nodes, "BLOCKQUOTE")
};
cvox.ChromeVoxUserCommands.formFieldPredicate_ = function(nodes) {
  for(var i = 0;i < nodes.length;i++) {
    var role = "";
    nodes[i].getAttribute && (role = nodes[i].getAttribute("role"));
    if(role == "button" || role == "checkbox" || role == "combobox" || role == "radio" || role == "slider" || role == "spinbutton" || role == "textbox" || nodes[i].tagName == "INPUT" || nodes[i].tagName == "SELECT" || nodes[i].tagName == "BUTTON") {
      return nodes[i]
    }
  }
  return null
};
cvox.ChromeVoxKbHandler = {};
cvox.ChromeVoxKbHandler.keyToFunctionsTable = {};
cvox.ChromeVoxKbHandler.powerkeyShortcuts = [];
cvox.ChromeVoxKbHandler.loadKeyToFunctionsTable = function(keyToFunctionsTable) {
  cvox.ChromeVoxKbHandler.keyToFunctionsTable = keyToFunctionsTable;
  cvox.ChromeVox.sequenceSwitchKeyCodes = cvox.ChromeVoxKbHandler.getSequenceSwitchKeys();
  cvox.ChromeVoxKbHandler.powerkeyShortcuts = cvox.ChromeVoxUserCommands.initPowerKey(cvox.ChromeVoxKbHandler.keyToFunctionsTable, cvox.ChromeVoxKbHandler.powerkeyActionHandler)
};
cvox.ChromeVoxKbHandler.powerkeyActionHandler = function(completion, index) {
  var keyStr = cvox.ChromeVoxKbHandler.powerkeyShortcuts[index], functionName = cvox.ChromeVoxKbHandler.keyToFunctionsTable[keyStr] ? cvox.ChromeVoxKbHandler.keyToFunctionsTable[keyStr][0] : null, func = cvox.ChromeVoxUserCommands.commands[functionName];
  func && (cvox.ChromeVoxSearch.isActive() && (cvox.ChromeVoxSearch.hide(), cvox.ChromeVox.navigationManager.syncToSelection()), func())
};
cvox.ChromeVoxKbHandler.getSequenceSwitchKeys = function() {
  var switchKeys = {}, key;
  for(key in cvox.ChromeVoxKbHandler.keyToFunctionsTable) {
    var tokens = key.split("+");
    if(tokens.length > 0) {
      var seqKeys = tokens[tokens.length - 1].split(">");
      seqKeys.length > 1 && (switchKeys[seqKeys[0]] = 1)
    }
  }
  return switchKeys
};
cvox.ChromeVoxKbHandler.mustPassEnterKey = function() {
  if(!document.activeElement) {
    return!1
  }
  if(document.activeElement.isContentEditable) {
    return!0
  }
  return document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "A" || document.activeElement.tagName == "SELECT" || document.activeElement.tagName == "BUTTON" || document.activeElement.tagName == "TEXTAREA"
};
cvox.ChromeVoxKbHandler.basicKeyDownActionsListener = function(evt) {
  if(evt.keyCode == 13) {
    if(cvox.ChromeVoxKbHandler.mustPassEnterKey()) {
      return window.setTimeout(function() {
        cvox.ChromeVox.navigationManager.syncToHashTagAnchor()
      }, 0), !0
    }
    if(!cvox.ChromeVox.navigationManager.canActOnCurrentItem()) {
      return!0
    }
  }
  var keyStr = cvox.KeyUtil.keyEventToString(evt), functionName = cvox.ChromeVoxKbHandler.keyToFunctionsTable[keyStr] ? cvox.ChromeVoxKbHandler.keyToFunctionsTable[keyStr][0] : null, func = cvox.ChromeVoxUserCommands.commands[functionName];
  if(func && (!cvox.ChromeVoxUserCommands.powerkey || !cvox.ChromeVoxUserCommands.powerkey.isVisible())) {
    return cvox.ChromeVoxSearch.isActive() && (cvox.ChromeVoxSearch.hide(), cvox.ChromeVox.navigationManager.syncToSelection()), func()
  }else {
    if(keyStr.indexOf(cvox.ChromeVox.modKeyStr) == 0) {
      return cvox.ChromeVoxUserCommands.powerkey && cvox.ChromeVoxUserCommands.powerkey.isVisible() && cvox.ChromeVoxUserCommands.hidePowerKey(), !1
    }
  }
  return!0
};
cvox.ChromeVoxEventWatcher = function() {
};
cvox.ChromeVoxEventWatcher.lastFocusedNode = null;
cvox.ChromeVoxEventWatcher.lastFocusedNodeValue = null;
cvox.ChromeVoxEventWatcher.eventToEat = null;
cvox.ChromeVoxEventWatcher.currentTextControl = null;
cvox.ChromeVoxEventWatcher.currentTextHandler = null;
cvox.ChromeVoxEventWatcher.previousTextHandlerState = null;
cvox.ChromeVoxEventWatcher.lastKeypressTime = 0;
cvox.ChromeVoxEventWatcher.listeners_ = [];
cvox.ChromeVoxEventWatcher.TEXT_TIMER_INITIAL_DELAY_MS = 10;
cvox.ChromeVoxEventWatcher.TEXT_TIMER_DELAY_MS = 250;
cvox.ChromeVoxEventWatcher.addEventListeners = function() {
  cvox.ChromeVoxEventWatcher.addEventListener_("keypress", cvox.ChromeVoxEventWatcher.keyPressEventWatcher, !0);
  cvox.ChromeVoxEventWatcher.addEventListener_("keydown", cvox.ChromeVoxEventWatcher.keyDownEventWatcher, !0);
  cvox.ChromeVoxEventWatcher.addEventListener_("keyup", cvox.ChromeVoxEventWatcher.keyUpEventWatcher, !0);
  cvox.ChromeVoxEventWatcher.addEventListener_("focus", cvox.ChromeVoxEventWatcher.focusEventWatcher, !0);
  cvox.ChromeVoxEventWatcher.addEventListener_("blur", cvox.ChromeVoxEventWatcher.blurEventWatcher, !0);
  cvox.ChromeVoxEventWatcher.addEventListener_("change", cvox.ChromeVoxEventWatcher.changeEventWatcher, !0);
  cvox.ChromeVoxEventWatcher.addEventListener_("select", cvox.ChromeVoxEventWatcher.selectEventWatcher, !0);
  cvox.ChromeVoxEventWatcher.addEventListener_("DOMSubtreeModified", cvox.ChromeVoxEventWatcher.subtreeModifiedEventWatcher, !0)
};
cvox.ChromeVoxEventWatcher.removeEventListeners = function() {
  for(var i = 0;i < cvox.ChromeVoxEventWatcher.listeners_.length;i++) {
    var listener = cvox.ChromeVoxEventWatcher.listeners_[i];
    document.removeEventListener(listener.type, listener.listener, listener.useCapture)
  }
  cvox.ChromeVoxEventWatcher.listeners_ = []
};
cvox.ChromeVoxEventWatcher.addEventListener_ = function(type, listener, useCapture) {
  cvox.ChromeVoxEventWatcher.listeners_.push({type:type, listener:listener, useCapture:useCapture});
  document.addEventListener(type, listener, useCapture)
};
cvox.ChromeVoxEventWatcher.getLastFocusedNode = function() {
  return cvox.ChromeVoxEventWatcher.lastFocusedNode
};
cvox.ChromeVoxEventWatcher.focusEventWatcher = function(evt) {
  cvox.ChromeVoxEventWatcher.lastFocusedNode = evt.target;
  if(cvox.ChromeVoxEventWatcher.handleTextChanged(!1)) {
    return!0
  }
  if(evt.target) {
    var target = evt.target;
    cvox.DomUtil.isControl(target) ? (cvox.ChromeVoxEventWatcher.lastFocusedNodeValue = cvox.DomUtil.getControlValueAndStateString(target), cvox.ChromeVoxUserCommands.isInUserCommand() || cvox.ChromeVox.tts.speak(cvox.ChromeVoxEventWatcher.lastFocusedNodeValue, 0, null)) : cvox.ChromeVoxUserCommands.isInUserCommand() || cvox.ChromeVox.tts.speak(cvox.DomUtil.getText(target), 0, null);
    cvox.ChromeVoxUserCommands.isInUserCommand() || cvox.ChromeVox.navigationManager.syncToNode(target)
  }else {
    cvox.ChromeVoxEventWatcher.lastFocusedNodeValue = null
  }
  return!0
};
cvox.ChromeVoxEventWatcher.blurEventWatcher = function() {
  cvox.ChromeVoxEventWatcher.lastFocusedNode = null;
  cvox.ChromeVoxEventWatcher.handleTextChanged(!1);
  return!0
};
cvox.ChromeVoxEventWatcher.keyDownEventWatcher = function(evt) {
  if(cvox.ChromeVoxEventWatcher.currentTextHandler) {
    cvox.ChromeVoxEventWatcher.previousTextHandlerState = cvox.ChromeVoxEventWatcher.currentTextHandler.saveState()
  }
  cvox.ChromeVoxEventWatcher.lastKeypressTime = (new Date).getTime();
  if(evt.keyCode == cvox.ChromeVox.stickyKeyCode) {
    cvox.ChromeVoxEventWatcher.cvoxKey = !0
  }
  evt.cvoxKey = cvox.ChromeVoxEventWatcher.cvoxKey;
  evt.stickyMode = cvox.ChromeVox.isStickyOn;
  cvox.ChromeVoxEventWatcher.eventToEat = null;
  if(!cvox.ChromeVoxKbHandler.basicKeyDownActionsListener(evt) || cvox.ChromeVoxEventWatcher.handleControlAction(evt)) {
    return evt.preventDefault(), evt.stopPropagation(), cvox.ChromeVoxEventWatcher.eventToEat = evt, !1
  }
  cvox.ChromeVoxEventWatcher.handleTextChanged(!0);
  setTimeout(function() {
    document.activeElement == evt.target && cvox.ChromeVoxEventWatcher.handleControlChanged(evt.target)
  }, 0);
  return!0
};
cvox.ChromeVoxEventWatcher.keyPressEventWatcher = function(evt) {
  cvox.ChromeVoxEventWatcher.handleTextChanged(!1);
  if(cvox.ChromeVoxEventWatcher.eventToEat && evt.keyCode == cvox.ChromeVoxEventWatcher.eventToEat.keyCode) {
    return evt.preventDefault(), evt.stopPropagation(), !1
  }
  return!0
};
cvox.ChromeVoxEventWatcher.keyUpEventWatcher = function(evt) {
  if(evt.keyCode == cvox.ChromeVox.stickyKeyCode) {
    cvox.ChromeVoxEventWatcher.cvoxKey = !1
  }
  if(cvox.ChromeVoxEventWatcher.eventToEat && evt.keyCode == cvox.ChromeVoxEventWatcher.eventToEat.keyCode) {
    return evt.stopPropagation(), evt.preventDefault(), !1
  }
  return!0
};
cvox.ChromeVoxEventWatcher.changeEventWatcher = function(evt) {
  if(cvox.ChromeVoxEventWatcher.handleTextChanged(!1)) {
    return!0
  }
  document.activeElement == evt.target && cvox.ChromeVoxEventWatcher.handleControlChanged(evt.target);
  return!0
};
cvox.ChromeVoxEventWatcher.selectEventWatcher = function() {
  cvox.ChromeVoxEventWatcher.handleTextChanged(!1);
  return!0
};
cvox.ChromeVoxEventWatcher.subtreeModifiedEventWatcher = function(evt) {
  if(!evt || !evt.target) {
    return!0
  }
  for(var node = evt.target, regions = cvox.AriaUtil.getLiveRegions(node), i = 0;i < regions.length;i++) {
    cvox.ChromeVoxEventWatcher.speakChangedLiveRegion(regions[i], node)
  }
  return!0
};
cvox.ChromeVoxEventWatcher.speakChangedLiveRegion = function(node, target) {
  var liveRegionValue = cvox.AriaUtil.getLiveRegionValue(node), message = "", message = !target || node.hasAttribute("aria-atomic") && node.getAttribute("aria-atomic") == "true" ? cvox.DomUtil.getText(node) : cvox.DomUtil.getText(target);
  liveRegionValue == "assertive" ? cvox.ChromeVox.tts.speak(message, 0, null) : liveRegionValue == "polite" && cvox.ChromeVox.tts.speak(message, 1, null)
};
cvox.ChromeVoxEventWatcher.handleTextChanged = function(isKeypress) {
  var currentFocus = document.activeElement;
  if(currentFocus != cvox.ChromeVoxEventWatcher.currentTextControl) {
    cvox.ChromeVoxEventWatcher.currentTextControl && (cvox.ChromeVoxEventWatcher.currentTextControl.removeEventListener("input", cvox.ChromeVoxEventWatcher.changeEventWatcher, !1), cvox.ChromeVoxEventWatcher.currentTextControl.removeEventListener("click", cvox.ChromeVoxEventWatcher.changeEventWatcher, !1));
    cvox.ChromeVoxEventWatcher.currentTextControl = null;
    cvox.ChromeVoxEventWatcher.currentTextHandler = null;
    cvox.ChromeVoxEventWatcher.previousTextHandlerState = null;
    if(currentFocus == null) {
      return!1
    }
    if(currentFocus.constructor == HTMLInputElement && cvox.DomUtil.isInputTypeText(currentFocus)) {
      cvox.ChromeVoxEventWatcher.currentTextControl = currentFocus, cvox.ChromeVoxEventWatcher.currentTextHandler = new cvox.ChromeVoxEditableHTMLInput(currentFocus, cvox.ChromeVox.tts)
    }else {
      if(currentFocus.constructor == HTMLTextAreaElement) {
        cvox.ChromeVoxEventWatcher.currentTextControl = currentFocus, cvox.ChromeVoxEventWatcher.currentTextHandler = new cvox.ChromeVoxEditableTextArea(currentFocus, cvox.ChromeVox.tts)
      }else {
        if(currentFocus.isContentEditable) {
          cvox.ChromeVoxEventWatcher.currentTextControl = currentFocus, cvox.ChromeVoxEventWatcher.currentTextHandler = new cvox.ChromeVoxEditableContentEditable(currentFocus, cvox.ChromeVox.tts)
        }
      }
    }
    cvox.ChromeVoxEventWatcher.currentTextControl && (cvox.ChromeVoxEventWatcher.currentTextControl.addEventListener("input", cvox.ChromeVoxEventWatcher.changeEventWatcher, !1), cvox.ChromeVoxEventWatcher.currentTextControl.addEventListener("click", cvox.ChromeVoxEventWatcher.changeEventWatcher, !1), cvox.ChromeVoxEventWatcher.currentTextHandler.describe(), window.setTimeout(cvox.ChromeVoxEventWatcher.textTimer, cvox.ChromeVoxEventWatcher.TEXT_TIMER_INITIAL_DELAY_MS), cvox.ChromeVox.navigationManager.syncToNode(cvox.ChromeVoxEventWatcher.currentTextControl));
    return null != cvox.ChromeVoxEventWatcher.currentTextHandler
  }
  if(cvox.ChromeVoxEventWatcher.currentTextHandler) {
    var handler = cvox.ChromeVoxEventWatcher.currentTextHandler;
    window.setTimeout(function() {
      var now = (new Date).getTime();
      !isKeypress && handler.needsUpdate() && cvox.ChromeVoxEventWatcher.previousTextHandlerState && now - cvox.ChromeVoxEventWatcher.lastKeypressTime < 50 && handler.restoreState(cvox.ChromeVoxEventWatcher.previousTextHandlerState);
      handler.update()
    }, 0);
    return!0
  }
  return!1
};
cvox.ChromeVoxEventWatcher.textTimer = function() {
  cvox.ChromeVoxEventWatcher.currentTextHandler && cvox.ChromeVoxEventWatcher.currentTextHandler.needsUpdate() && cvox.ChromeVoxEventWatcher.handleTextChanged(!1);
  cvox.ChromeVoxEventWatcher.currentTextControl && window.setTimeout(cvox.ChromeVoxEventWatcher.textTimer, cvox.ChromeVoxEventWatcher.TEXT_TIMER_DELAY_MS)
};
cvox.ChromeVoxEventWatcher.handleControlChanged = function(control) {
  var newValue = cvox.DomUtil.getControlValueAndStateString(control);
  if(control != cvox.ChromeVoxEventWatcher.lastFocusedNode) {
    cvox.ChromeVoxEventWatcher.lastFocusedNode = control, cvox.ChromeVoxEventWatcher.lastFocusedNodeValue = newValue
  }else {
    if(newValue != cvox.ChromeVoxEventWatcher.lastFocusedNodeValue) {
      cvox.ChromeVoxEventWatcher.lastFocusedNodeValue = newValue;
      var announceChange = !1;
      control.tagName == "SELECT" && (announceChange = !0);
      if(control.tagName == "INPUT") {
        switch(control.type) {
          case "checkbox":
          ;
          case "color":
          ;
          case "datetime":
          ;
          case "datetime-local":
          ;
          case "date":
          ;
          case "month":
          ;
          case "radio":
          ;
          case "range":
          ;
          case "week":
            announceChange = !0
        }
      }
      announceChange && !cvox.ChromeVoxUserCommands.isInUserCommand() && cvox.ChromeVox.tts.speak(newValue, 0, null)
    }
  }
};
cvox.ChromeVoxEventWatcher.handleControlAction = function(evt) {
  var control = evt.target;
  if(control.tagName == "SELECT" && (evt.keyCode == 13 || evt.keyCode == 32)) {
    return evt.preventDefault(), evt.stopPropagation(), !0
  }
  if(control.tagName == "INPUT" && control.type == "range") {
    var value = parseFloat(control.value), step;
    if(control.step && control.step > 0) {
      step = control.step
    }else {
      if(control.min && control.max) {
        var range = control.max - control.min;
        step = range > 2 && range < 31 ? 1 : (control.max - control.min) / 10
      }else {
        step = 1
      }
    }
    if(evt.keyCode == 37 || evt.keyCode == 38) {
      value -= step
    }else {
      if(evt.keyCode == 39 || evt.keyCode == 40) {
        value += step
      }
    }
    if(control.max && value > control.max) {
      value = control.max
    }
    if(control.min && value < control.min) {
      value = control.min
    }
    control.value = value
  }
  return!1
};
cvox.RemoteEarconsManager = function() {
};
cvox.AndroidEarcons = function() {
  this.audioMap = {}
};
cvox.AndroidEarcons.prototype = new cvox.AbstractEarcons;
cvox.AndroidEarcons.prototype.getName = function() {
  return"Android earcons"
};
cvox.AndroidDevTtsEngine = function() {
  cvox.AbstractTts.call(this);
  this.speech = null;
  this.speaking = !1;
  var theScript = document.createElement("script");
  theScript.type = "text/javascript";
  theScript.src = "http://www.gstatic.com/speech/api/tts/google-network-tts.js";
  document.getElementsByTagName("head")[0].appendChild(theScript);
  var context = this;
  theScript.onload = function() {
    goog.tts = goog.tts || void 0;
    context.speech = goog.tts;
    context.speech.initialize()
  }
};
goog.inherits(cvox.AndroidDevTtsEngine, cvox.AbstractTts);
cvox.AndroidDevTtsEngine.prototype.getName = function() {
  return"Android development engine (Google Network Speech using Flash)"
};
cvox.AndroidDevTtsEngine.prototype.speak = function(textString, queueMode, properties) {
  if(this.speech) {
    cvox.AndroidDevTtsEngine.superClass_.speak.call(this, textString, queueMode, properties);
    this.speaking = !0;
    var queue = queueMode === cvox.AbstractTts.QUEUE_MODE_QUEUE;
    this.speech.speak(textString, function() {
      this.isSpeaking = !1
    }, queue, cvox.AndroidDevTtsEngine.DEFAULT_PROPERTIES_JSON)
  }else {
    console.log(this.getName() + " is not initialized yet.")
  }
};
cvox.AndroidDevTtsEngine.prototype.isSpeaking = function() {
  cvox.AndroidDevTtsEngine.superClass_.isSpeaking.call(this);
  return this.speaking
};
cvox.AndroidDevTtsEngine.prototype.stop = function() {
  if(this.speech) {
    cvox.AndroidDevTtsEngine.superClass_.stop.call(this), this.speaking = !1, this.speech.stopSpeaking()
  }
};
cvox.AndroidDevTtsEngine.DEFAULT_PROPERTIES_JSON = {lang:"en-US"};
cvox.AndroidRelTtsEngine = function() {
  cvox.AbstractTts.call(this);
  this.ttsProperties.rate = 0.5;
  this.ttsProperties.pitch = 0.5;
  this.ttsProperties.volume = 1
};
goog.inherits(cvox.AndroidRelTtsEngine, cvox.AbstractTts);
cvox.AndroidRelTtsEngine.prototype.getName = function() {
  return"Android platform TTS"
};
cvox.AndroidRelTtsEngine.prototype.speak = function(textString, queueMode, properties) {
  cvox.AndroidRelTtsEngine.superClass_.speak.call(this, textString, queueMode, properties);
  var mergedProperties = this.mergeProperties(properties);
  accessibility.speak(textString, queueMode, mergedProperties)
};
cvox.AndroidRelTtsEngine.prototype.isSpeaking = function() {
  cvox.AndroidRelTtsEngine.superClass_.isSpeaking.call(this);
  return accessibility.isSpeaking()
};
cvox.AndroidRelTtsEngine.prototype.stop = function() {
  cvox.AndroidRelTtsEngine.superClass_.stop.call(this);
  accessibility.stop()
};
cvox.ChromeVoxInit = {};
cvox.ChromeVox.init = function() {
  if(goog.isDefAndNotNull(2)) {
    cvox.ChromeVox.isActive = !0;
    cvox.ChromeVox.lens = new chromevis.ChromeVisLens;
    cvox.ChromeVox.traverseContent = new cvox.TraverseContent;
    cvox.ChromeVox.navigationManager = new cvox.ChromeVoxNavigationManager;
    cvox.ChromeVox.tts = cvox.ChromeVox.createTtsManager();
    cvox.ChromeVox.earcons = cvox.ChromeVox.createEarconsManager(cvox.ChromeVox.tts);
    cvox.ChromeVoxSearch.init();
    cvox.ChromeVoxEventWatcher.addEventListeners();
    var enhancementLoaderScript = document.createElement("script");
    enhancementLoaderScript.type = "text/javascript";
    enhancementLoaderScript.src = "https://ssl.gstatic.com/accessibility/javascript/ext/loader.js";
    document.head.appendChild(enhancementLoaderScript);
    cvox.ChromeVox.performBuildTypeSpecificInitialization();
    cvox.ChromeVox.loadKeyBindings();
    cvox.ChromeVox.executeUserCommand = function(commandName) {
      cvox.ChromeVoxUserCommands.commands[commandName]()
    };
    if(window.parent == window) {
      var message = document.title, activeElem = document.activeElement;
      cvox.DomUtil.isControl(activeElem) && (cvox.ChromeVox.navigationManager.syncToNode(activeElem), cvox.ChromeVox.navigationManager.setFocus(), message = message + ". " + cvox.DomUtil.getControlValueAndStateString(activeElem));
      cvox.ChromeVox.tts.speak(message, 0, null)
    }
  }
};
cvox.ChromeVox.createTtsManager = function() {
  return new cvox.LocalTtsManager([cvox.AndroidRelTtsEngine], null)
};
cvox.ChromeVox.createEarconsManager = function(ttsManager) {
  return new cvox.LocalEarconsManager([cvox.AndroidEarcons], ttsManager)
};
cvox.ChromeVox.performBuildTypeSpecificInitialization = function() {
};
cvox.ChromeVox.loadKeyBindings = function() {
  var keyBindings = cvox.ChromeVox.getStringifiedAndroidKeyBindings();
  cvox.ChromeVoxKbHandler.loadKeyToFunctionsTable(cvox.ChromeVoxJSON.parse(keyBindings, null))
};
cvox.ChromeVox.getStringifiedAndroidKeyBindings = function() {
  return cvox.ChromeVoxJSON.stringify({"#17":["stopSpeech", "Stop speaking"], "#38":["backward", "Navigate backward"], "#40":["forward", "Navigate forward"], "Shift+#38":["nop", ""], "Shift+#40":["nop", ""], "#37":["nop", ""], "#39":["nop", ""], "Shift+#37":["previousGranularity", "Decrease navigation granularity"], "Shift+#39":["nextGranularity", "Increase navigation granularity"], "#13":["actOnCurrentItem", "Take action on current item"], "Shift+#16":["nop", ""], "Ctrl+Alt+#191":["toggleSearchWidget", 
  "Toggle search widget"], "Ctrl+Alt+B":["showBookmarkManager", "Open bookmark manager"], "Ctrl+Alt+A":["nextTtsEngine", "Switch to next TTS engine"], "Ctrl+Alt+#189":["decreaseTtsRate", "Decreaste rate of speech"], "Ctrl+Alt+#187":["increaseTtsRate", "Increase rate of speech"], "Ctrl+Alt+Shift+#189":["decreaseTtsPitch", "Decrease pitch"], "Ctrl+Alt+Shift+#187":["increaseTtsPitch", "Increase pitch"], "Ctrl+Alt+#219":["decreaseTtsVolume", "Decrease speech volume"], "Ctrl+Alt+#221":["increaseTtsVolume", 
  "Increase speech volume"], "Ctrl+Alt+1":["nextHeading1", "Next level 1 heading"], "Ctrl+Alt+Shift+1":["previousHeading1", "Previous level 1 heading"], "Ctrl+Alt+2":["nextHeading2", "Next level 2 heading"], "Ctrl+Alt+Shift+2":["previousHeading2", "Previous level 2 heading"], "Ctrl+Alt+3":["nextHeading3", "Next level 3 heading"], "Ctrl+Alt+Shift+3":["previousHeading3", "Previous level 3 heading"], "Ctrl+Alt+4":["nextHeading4", "Next level 4 heading"], "Ctrl+Alt+Shift+4":["previousHeading4", "Previous level 4 heading"], 
  "Ctrl+Alt+5":["nextHeading5", "Next level 5 heading"], "Ctrl+Alt+Shift+5":["previousHeading5", "Previous level 5 heading"], "Ctrl+Alt+6":["nextHeading6", "Next level 6 heading"], "Ctrl+Alt+Shift+6":["previousHeading6", "Previous level 6 heading"], "Ctrl+Alt+C":["nextCheckbox", "Next checkbox"], "Ctrl+Alt+Shift+C":["previousCheckbox", "Previous checkbox"], "Ctrl+Alt+E":["nextEditText", "Next editable text area"], "Ctrl+Alt+Shift+E":["previousEditText", "Previous editable text area"], "Ctrl+Alt+F":["nextFormField", 
  "Next form field"], "Ctrl+Alt+Shift+F":["previousFormField", "Previous form field"], "Ctrl+Alt+G":["nextGraphic", "Next graphic"], "Ctrl+Alt+Shift+G":["previousGraphic", "Previous graphic"], "Ctrl+Alt+H":["nextHeading", "Next heading"], "Ctrl+Alt+Shift+H":["previousHeading", "Previous heading"], "Ctrl+Alt+I":["nextListItem", "Next list item"], "Ctrl+Alt+Shift+I":["previousListItem", "Previous list item"], "Ctrl+Alt+L":["nextLink", "Next link"], "Ctrl+Alt+Shift+L":["previousLink", "Previous link"], 
  "Ctrl+Alt+O":["nextList", "Next list"], "Ctrl+Alt+Shift+O":["previousList", "Previous list"], "Ctrl+Alt+Q":["nextBlockquote", "Next block quote"], "Ctrl+Alt+Shift+Q":["previousBlockquote", "Previous block quote"], "Ctrl+Alt+R":["nextRadio", "Next radio button"], "Ctrl+Alt+Shift+R":["previousRadio", "Previous radio button"], "Ctrl+Alt+S":["nextSlider", "Next slider"], "Ctrl+Alt+Shift+S":["previousSlider", "Previous slider"], "Ctrl+Alt+T":["nextTable", "Next table"], "Ctrl+Alt+Shift+T":["previousTable", 
  "Previous table"], "Ctrl+Alt+U":["nextButton", "Next button"], "Ctrl+Alt+Shift+U":["previousButton", "Previous button"], "Ctrl+Alt+X":["nextComboBox", "Next combo box"], "Ctrl+Alt+Shift+X":["previousComboBox", "Previous combo box"]}, null, null)
};

