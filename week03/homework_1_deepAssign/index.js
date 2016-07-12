"use strict"

Object.defineProperty(Object, "deepAssign",
{
  value: function deepAssign(to, from) {
    function isObject(value) {
      return value === Object(value);
    };

    function isSpecialObject(obj) {
      //or maybe it'll be better to use constructor.name 
      var construstorName = Object.prototype.toString.call(obj).slice(8,-1);
      return  construstorName == 'Date' || 
              construstorName == 'RegExp' || 
              construstorName == 'Map' || 
              construstorName == 'WeakMap' || 
              construstorName == 'Set' || 
              construstorName == 'WeakSet';
    }

    var to = arguments[0];
    
    if (to == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    to = Object(to);

    for(var i = 1, len = arguments.length; i < len; i++) {
      var fromItem = arguments[i];
      
      if(fromItem == null) continue;

      var ownEnumKeys = Object.keys(Object(fromItem));
      
      if(Object.getOwnPropertySymbols){
        ownEnumKeys = ownEnumKeys.concat(Object.getOwnPropertySymbols(fromItem));
      }

      ownEnumKeys.forEach(function(prop) {
        if (isSpecialObject(fromItem[prop])) {
          to[prop] = new fromItem[prop].constructor(fromItem[prop]);
        } 
        else if (to.hasOwnProperty(prop) && isObject(fromItem[prop])) {
          deepAssign(to[prop], fromItem[prop]);
        }
        else {
          to[prop] = fromItem[prop];
        }
      });
    }
    return to;
  },
  writable: true,
  configurable: true
})