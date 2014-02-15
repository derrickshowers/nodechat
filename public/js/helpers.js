/**
* This is a mini library of helper functions. There is no jQuery being used for this
* project, so needed some helper functions to get some of the easy tasks done.
**/

var dsHelpers = {};

(function() {
  'use strict';

  // hide this element
  var hide = function() {
    for(var i=0; i<arguments.length; i++) {
      document.getElementById(arguments[i]).style.display = 'none'
    }
  }
  dsHelpers.hide = hide;

  // show this element
  var show = function() {
    for(var i=0; i<arguments.length; i++) {
      document.getElementById(arguments[i]).style.display = 'block'
    }
  }
  dsHelpers.show = show;

  // show error
  var showError = function(el) {
    el.style.border = '1px solid #F00';
    el.setAttribute('data-error', 'true');
  }
  dsHelpers.showError = showError

  // validate input fields aren't empty
  var validateInput = function(el) {
    if (el.value === '') return false;
    else return true;
  }
  dsHelpers.validateInput = validateInput;

  // find a sibling
  var findSibling = function(el, tagName) {
    var nextSibling = el.nextSibling;
    if (nextSibling === null) return null;
    if (nextSibling.tagName === tagName.toUpperCase())
      return nextSibling;
    else
      return findSibling(nextSibling, tagName);
  }
  dsHelpers.findSibling = findSibling;

  // find a child
  var findChild = function(el, tagName) {
    var childNodes = el.childNodes;
    if (childNodes === null) return null;
    for (var i=0; i<childNodes.length; i++) {
      if (childNodes[i].tagName === tagName.toUpperCase()) return childNodes[i];
    }
  }
  dsHelpers.findChild = findChild;

})();