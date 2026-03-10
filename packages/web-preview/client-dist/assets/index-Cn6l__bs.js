(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const v of document.querySelectorAll('link[rel="modulepreload"]'))f(v);new MutationObserver(v=>{for(const _ of v)if(_.type==="childList")for(const d of _.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&f(d)}).observe(document,{childList:!0,subtree:!0});function u(v){const _={};return v.integrity&&(_.integrity=v.integrity),v.referrerPolicy&&(_.referrerPolicy=v.referrerPolicy),v.crossOrigin==="use-credentials"?_.credentials="include":v.crossOrigin==="anonymous"?_.credentials="omit":_.credentials="same-origin",_}function f(v){if(v.ep)return;v.ep=!0;const _=u(v);fetch(v.href,_)}})();function Yd(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var ja={exports:{}},jl={},Ea={exports:{}},$e={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ad;function bm(){if(ad)return $e;ad=1;var r=Symbol.for("react.element"),a=Symbol.for("react.portal"),u=Symbol.for("react.fragment"),f=Symbol.for("react.strict_mode"),v=Symbol.for("react.profiler"),_=Symbol.for("react.provider"),d=Symbol.for("react.context"),I=Symbol.for("react.forward_ref"),N=Symbol.for("react.suspense"),V=Symbol.for("react.memo"),$=Symbol.for("react.lazy"),p=Symbol.iterator;function x(j){return j===null||typeof j!="object"?null:(j=p&&j[p]||j["@@iterator"],typeof j=="function"?j:null)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},F=Object.assign,P={};function w(j,A,Ne){this.props=j,this.context=A,this.refs=P,this.updater=Ne||g}w.prototype.isReactComponent={},w.prototype.setState=function(j,A){if(typeof j!="object"&&typeof j!="function"&&j!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,j,A,"setState")},w.prototype.forceUpdate=function(j){this.updater.enqueueForceUpdate(this,j,"forceUpdate")};function Y(){}Y.prototype=w.prototype;function B(j,A,Ne){this.props=j,this.context=A,this.refs=P,this.updater=Ne||g}var Q=B.prototype=new Y;Q.constructor=B,F(Q,w.prototype),Q.isPureReactComponent=!0;var ce=Array.isArray,ge=Object.prototype.hasOwnProperty,ne={current:null},J={key:!0,ref:!0,__self:!0,__source:!0};function ee(j,A,Ne){var Me,Oe={},De=null,Qe=null;if(A!=null)for(Me in A.ref!==void 0&&(Qe=A.ref),A.key!==void 0&&(De=""+A.key),A)ge.call(A,Me)&&!J.hasOwnProperty(Me)&&(Oe[Me]=A[Me]);var Be=arguments.length-2;if(Be===1)Oe.children=Ne;else if(1<Be){for(var Ge=Array(Be),Ct=0;Ct<Be;Ct++)Ge[Ct]=arguments[Ct+2];Oe.children=Ge}if(j&&j.defaultProps)for(Me in Be=j.defaultProps,Be)Oe[Me]===void 0&&(Oe[Me]=Be[Me]);return{$$typeof:r,type:j,key:De,ref:Qe,props:Oe,_owner:ne.current}}function we(j,A){return{$$typeof:r,type:j.type,key:A,ref:j.ref,props:j.props,_owner:j._owner}}function X(j){return typeof j=="object"&&j!==null&&j.$$typeof===r}function Ke(j){var A={"=":"=0",":":"=2"};return"$"+j.replace(/[=:]/g,function(Ne){return A[Ne]})}var Te=/\/+/g;function T(j,A){return typeof j=="object"&&j!==null&&j.key!=null?Ke(""+j.key):A.toString(36)}function Ce(j,A,Ne,Me,Oe){var De=typeof j;(De==="undefined"||De==="boolean")&&(j=null);var Qe=!1;if(j===null)Qe=!0;else switch(De){case"string":case"number":Qe=!0;break;case"object":switch(j.$$typeof){case r:case a:Qe=!0}}if(Qe)return Qe=j,Oe=Oe(Qe),j=Me===""?"."+T(Qe,0):Me,ce(Oe)?(Ne="",j!=null&&(Ne=j.replace(Te,"$&/")+"/"),Ce(Oe,A,Ne,"",function(Ct){return Ct})):Oe!=null&&(X(Oe)&&(Oe=we(Oe,Ne+(!Oe.key||Qe&&Qe.key===Oe.key?"":(""+Oe.key).replace(Te,"$&/")+"/")+j)),A.push(Oe)),1;if(Qe=0,Me=Me===""?".":Me+":",ce(j))for(var Be=0;Be<j.length;Be++){De=j[Be];var Ge=Me+T(De,Be);Qe+=Ce(De,A,Ne,Ge,Oe)}else if(Ge=x(j),typeof Ge=="function")for(j=Ge.call(j),Be=0;!(De=j.next()).done;)De=De.value,Ge=Me+T(De,Be++),Qe+=Ce(De,A,Ne,Ge,Oe);else if(De==="object")throw A=String(j),Error("Objects are not valid as a React child (found: "+(A==="[object Object]"?"object with keys {"+Object.keys(j).join(", ")+"}":A)+"). If you meant to render a collection of children, use an array instead.");return Qe}function ye(j,A,Ne){if(j==null)return j;var Me=[],Oe=0;return Ce(j,Me,"","",function(De){return A.call(Ne,De,Oe++)}),Me}function We(j){if(j._status===-1){var A=j._result;A=A(),A.then(function(Ne){(j._status===0||j._status===-1)&&(j._status=1,j._result=Ne)},function(Ne){(j._status===0||j._status===-1)&&(j._status=2,j._result=Ne)}),j._status===-1&&(j._status=0,j._result=A)}if(j._status===1)return j._result.default;throw j._result}var Ie={current:null},M={transition:null},Z={ReactCurrentDispatcher:Ie,ReactCurrentBatchConfig:M,ReactCurrentOwner:ne};function q(){throw Error("act(...) is not supported in production builds of React.")}return $e.Children={map:ye,forEach:function(j,A,Ne){ye(j,function(){A.apply(this,arguments)},Ne)},count:function(j){var A=0;return ye(j,function(){A++}),A},toArray:function(j){return ye(j,function(A){return A})||[]},only:function(j){if(!X(j))throw Error("React.Children.only expected to receive a single React element child.");return j}},$e.Component=w,$e.Fragment=u,$e.Profiler=v,$e.PureComponent=B,$e.StrictMode=f,$e.Suspense=N,$e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Z,$e.act=q,$e.cloneElement=function(j,A,Ne){if(j==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+j+".");var Me=F({},j.props),Oe=j.key,De=j.ref,Qe=j._owner;if(A!=null){if(A.ref!==void 0&&(De=A.ref,Qe=ne.current),A.key!==void 0&&(Oe=""+A.key),j.type&&j.type.defaultProps)var Be=j.type.defaultProps;for(Ge in A)ge.call(A,Ge)&&!J.hasOwnProperty(Ge)&&(Me[Ge]=A[Ge]===void 0&&Be!==void 0?Be[Ge]:A[Ge])}var Ge=arguments.length-2;if(Ge===1)Me.children=Ne;else if(1<Ge){Be=Array(Ge);for(var Ct=0;Ct<Ge;Ct++)Be[Ct]=arguments[Ct+2];Me.children=Be}return{$$typeof:r,type:j.type,key:Oe,ref:De,props:Me,_owner:Qe}},$e.createContext=function(j){return j={$$typeof:d,_currentValue:j,_currentValue2:j,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},j.Provider={$$typeof:_,_context:j},j.Consumer=j},$e.createElement=ee,$e.createFactory=function(j){var A=ee.bind(null,j);return A.type=j,A},$e.createRef=function(){return{current:null}},$e.forwardRef=function(j){return{$$typeof:I,render:j}},$e.isValidElement=X,$e.lazy=function(j){return{$$typeof:$,_payload:{_status:-1,_result:j},_init:We}},$e.memo=function(j,A){return{$$typeof:V,type:j,compare:A===void 0?null:A}},$e.startTransition=function(j){var A=M.transition;M.transition={};try{j()}finally{M.transition=A}},$e.unstable_act=q,$e.useCallback=function(j,A){return Ie.current.useCallback(j,A)},$e.useContext=function(j){return Ie.current.useContext(j)},$e.useDebugValue=function(){},$e.useDeferredValue=function(j){return Ie.current.useDeferredValue(j)},$e.useEffect=function(j,A){return Ie.current.useEffect(j,A)},$e.useId=function(){return Ie.current.useId()},$e.useImperativeHandle=function(j,A,Ne){return Ie.current.useImperativeHandle(j,A,Ne)},$e.useInsertionEffect=function(j,A){return Ie.current.useInsertionEffect(j,A)},$e.useLayoutEffect=function(j,A){return Ie.current.useLayoutEffect(j,A)},$e.useMemo=function(j,A){return Ie.current.useMemo(j,A)},$e.useReducer=function(j,A,Ne){return Ie.current.useReducer(j,A,Ne)},$e.useRef=function(j){return Ie.current.useRef(j)},$e.useState=function(j){return Ie.current.useState(j)},$e.useSyncExternalStore=function(j,A,Ne){return Ie.current.useSyncExternalStore(j,A,Ne)},$e.useTransition=function(){return Ie.current.useTransition()},$e.version="18.3.1",$e}var ud;function Ml(){return ud||(ud=1,Ea.exports=bm()),Ea.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var cd;function wm(){if(cd)return jl;cd=1;var r=Ml(),a=Symbol.for("react.element"),u=Symbol.for("react.fragment"),f=Object.prototype.hasOwnProperty,v=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,_={key:!0,ref:!0,__self:!0,__source:!0};function d(I,N,V){var $,p={},x=null,g=null;V!==void 0&&(x=""+V),N.key!==void 0&&(x=""+N.key),N.ref!==void 0&&(g=N.ref);for($ in N)f.call(N,$)&&!_.hasOwnProperty($)&&(p[$]=N[$]);if(I&&I.defaultProps)for($ in N=I.defaultProps,N)p[$]===void 0&&(p[$]=N[$]);return{$$typeof:a,type:I,key:x,ref:g,props:p,_owner:v.current}}return jl.Fragment=u,jl.jsx=d,jl.jsxs=d,jl}var dd;function km(){return dd||(dd=1,ja.exports=wm()),ja.exports}var i=km(),C=Ml();const Wd=Yd(C);var As={},Na={exports:{}},Gt={},La={exports:{}},Ta={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var fd;function Sm(){return fd||(fd=1,(function(r){function a(M,Z){var q=M.length;M.push(Z);e:for(;0<q;){var j=q-1>>>1,A=M[j];if(0<v(A,Z))M[j]=Z,M[q]=A,q=j;else break e}}function u(M){return M.length===0?null:M[0]}function f(M){if(M.length===0)return null;var Z=M[0],q=M.pop();if(q!==Z){M[0]=q;e:for(var j=0,A=M.length,Ne=A>>>1;j<Ne;){var Me=2*(j+1)-1,Oe=M[Me],De=Me+1,Qe=M[De];if(0>v(Oe,q))De<A&&0>v(Qe,Oe)?(M[j]=Qe,M[De]=q,j=De):(M[j]=Oe,M[Me]=q,j=Me);else if(De<A&&0>v(Qe,q))M[j]=Qe,M[De]=q,j=De;else break e}}return Z}function v(M,Z){var q=M.sortIndex-Z.sortIndex;return q!==0?q:M.id-Z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var _=performance;r.unstable_now=function(){return _.now()}}else{var d=Date,I=d.now();r.unstable_now=function(){return d.now()-I}}var N=[],V=[],$=1,p=null,x=3,g=!1,F=!1,P=!1,w=typeof setTimeout=="function"?setTimeout:null,Y=typeof clearTimeout=="function"?clearTimeout:null,B=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Q(M){for(var Z=u(V);Z!==null;){if(Z.callback===null)f(V);else if(Z.startTime<=M)f(V),Z.sortIndex=Z.expirationTime,a(N,Z);else break;Z=u(V)}}function ce(M){if(P=!1,Q(M),!F)if(u(N)!==null)F=!0,We(ge);else{var Z=u(V);Z!==null&&Ie(ce,Z.startTime-M)}}function ge(M,Z){F=!1,P&&(P=!1,Y(ee),ee=-1),g=!0;var q=x;try{for(Q(Z),p=u(N);p!==null&&(!(p.expirationTime>Z)||M&&!Ke());){var j=p.callback;if(typeof j=="function"){p.callback=null,x=p.priorityLevel;var A=j(p.expirationTime<=Z);Z=r.unstable_now(),typeof A=="function"?p.callback=A:p===u(N)&&f(N),Q(Z)}else f(N);p=u(N)}if(p!==null)var Ne=!0;else{var Me=u(V);Me!==null&&Ie(ce,Me.startTime-Z),Ne=!1}return Ne}finally{p=null,x=q,g=!1}}var ne=!1,J=null,ee=-1,we=5,X=-1;function Ke(){return!(r.unstable_now()-X<we)}function Te(){if(J!==null){var M=r.unstable_now();X=M;var Z=!0;try{Z=J(!0,M)}finally{Z?T():(ne=!1,J=null)}}else ne=!1}var T;if(typeof B=="function")T=function(){B(Te)};else if(typeof MessageChannel<"u"){var Ce=new MessageChannel,ye=Ce.port2;Ce.port1.onmessage=Te,T=function(){ye.postMessage(null)}}else T=function(){w(Te,0)};function We(M){J=M,ne||(ne=!0,T())}function Ie(M,Z){ee=w(function(){M(r.unstable_now())},Z)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(M){M.callback=null},r.unstable_continueExecution=function(){F||g||(F=!0,We(ge))},r.unstable_forceFrameRate=function(M){0>M||125<M?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):we=0<M?Math.floor(1e3/M):5},r.unstable_getCurrentPriorityLevel=function(){return x},r.unstable_getFirstCallbackNode=function(){return u(N)},r.unstable_next=function(M){switch(x){case 1:case 2:case 3:var Z=3;break;default:Z=x}var q=x;x=Z;try{return M()}finally{x=q}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(M,Z){switch(M){case 1:case 2:case 3:case 4:case 5:break;default:M=3}var q=x;x=M;try{return Z()}finally{x=q}},r.unstable_scheduleCallback=function(M,Z,q){var j=r.unstable_now();switch(typeof q=="object"&&q!==null?(q=q.delay,q=typeof q=="number"&&0<q?j+q:j):q=j,M){case 1:var A=-1;break;case 2:A=250;break;case 5:A=1073741823;break;case 4:A=1e4;break;default:A=5e3}return A=q+A,M={id:$++,callback:Z,priorityLevel:M,startTime:q,expirationTime:A,sortIndex:-1},q>j?(M.sortIndex=q,a(V,M),u(N)===null&&M===u(V)&&(P?(Y(ee),ee=-1):P=!0,Ie(ce,q-j))):(M.sortIndex=A,a(N,M),F||g||(F=!0,We(ge))),M},r.unstable_shouldYield=Ke,r.unstable_wrapCallback=function(M){var Z=x;return function(){var q=x;x=Z;try{return M.apply(this,arguments)}finally{x=q}}}})(Ta)),Ta}var md;function Cm(){return md||(md=1,La.exports=Sm()),La.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _d;function jm(){if(_d)return Gt;_d=1;var r=Ml(),a=Cm();function u(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var f=new Set,v={};function _(e,t){d(e,t),d(e+"Capture",t)}function d(e,t){for(v[e]=t,e=0;e<t.length;e++)f.add(t[e])}var I=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),N=Object.prototype.hasOwnProperty,V=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,$={},p={};function x(e){return N.call(p,e)?!0:N.call($,e)?!1:V.test(e)?p[e]=!0:($[e]=!0,!1)}function g(e,t,n,o){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function F(e,t,n,o){if(t===null||typeof t>"u"||g(e,t,n,o))return!0;if(o)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function P(e,t,n,o,l,s,c){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=s,this.removeEmptyString=c}var w={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){w[e]=new P(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];w[t]=new P(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){w[e]=new P(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){w[e]=new P(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){w[e]=new P(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){w[e]=new P(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){w[e]=new P(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){w[e]=new P(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){w[e]=new P(e,5,!1,e.toLowerCase(),null,!1,!1)});var Y=/[\-:]([a-z])/g;function B(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Y,B);w[t]=new P(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Y,B);w[t]=new P(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Y,B);w[t]=new P(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){w[e]=new P(e,1,!1,e.toLowerCase(),null,!1,!1)}),w.xlinkHref=new P("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){w[e]=new P(e,1,!1,e.toLowerCase(),null,!0,!0)});function Q(e,t,n,o){var l=w.hasOwnProperty(t)?w[t]:null;(l!==null?l.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(F(t,n,l,o)&&(n=null),o||l===null?x(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,o=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,o?e.setAttributeNS(o,t,n):e.setAttribute(t,n))))}var ce=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ge=Symbol.for("react.element"),ne=Symbol.for("react.portal"),J=Symbol.for("react.fragment"),ee=Symbol.for("react.strict_mode"),we=Symbol.for("react.profiler"),X=Symbol.for("react.provider"),Ke=Symbol.for("react.context"),Te=Symbol.for("react.forward_ref"),T=Symbol.for("react.suspense"),Ce=Symbol.for("react.suspense_list"),ye=Symbol.for("react.memo"),We=Symbol.for("react.lazy"),Ie=Symbol.for("react.offscreen"),M=Symbol.iterator;function Z(e){return e===null||typeof e!="object"?null:(e=M&&e[M]||e["@@iterator"],typeof e=="function"?e:null)}var q=Object.assign,j;function A(e){if(j===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);j=t&&t[1]||""}return`
`+j+e}var Ne=!1;function Me(e,t){if(!e||Ne)return"";Ne=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(R){var o=R}Reflect.construct(e,[],t)}else{try{t.call()}catch(R){o=R}e.call(t.prototype)}else{try{throw Error()}catch(R){o=R}e()}}catch(R){if(R&&o&&typeof R.stack=="string"){for(var l=R.stack.split(`
`),s=o.stack.split(`
`),c=l.length-1,y=s.length-1;1<=c&&0<=y&&l[c]!==s[y];)y--;for(;1<=c&&0<=y;c--,y--)if(l[c]!==s[y]){if(c!==1||y!==1)do if(c--,y--,0>y||l[c]!==s[y]){var k=`
`+l[c].replace(" at new "," at ");return e.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",e.displayName)),k}while(1<=c&&0<=y);break}}}finally{Ne=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?A(e):""}function Oe(e){switch(e.tag){case 5:return A(e.type);case 16:return A("Lazy");case 13:return A("Suspense");case 19:return A("SuspenseList");case 0:case 2:case 15:return e=Me(e.type,!1),e;case 11:return e=Me(e.type.render,!1),e;case 1:return e=Me(e.type,!0),e;default:return""}}function De(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case J:return"Fragment";case ne:return"Portal";case we:return"Profiler";case ee:return"StrictMode";case T:return"Suspense";case Ce:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Ke:return(e.displayName||"Context")+".Consumer";case X:return(e._context.displayName||"Context")+".Provider";case Te:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ye:return t=e.displayName||null,t!==null?t:De(e.type)||"Memo";case We:t=e._payload,e=e._init;try{return De(e(t))}catch{}}return null}function Qe(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return De(t);case 8:return t===ee?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Be(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ge(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Ct(e){var t=Ge(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,s=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(c){o=""+c,s.call(this,c)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return o},setValue:function(c){o=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ln(e){e._valueTracker||(e._valueTracker=Ct(e))}function Yr(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=Ge(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}function jn(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function qo(e,t){var n=t.checked;return q({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Wr(e,t){var n=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;n=Be(t.value!=null?t.value:n),e._wrapperState={initialChecked:o,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function jo(e,t){t=t.checked,t!=null&&Q(e,"checked",t,!1)}function er(e,t){jo(e,t);var n=Be(t.value),o=t.type;if(n!=null)o==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Bn(e,t.type,n):t.hasOwnProperty("defaultValue")&&Bn(e,t.type,Be(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Le(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Bn(e,t,n){(t!=="number"||jn(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var An=Array.isArray;function Pt(e,t,n,o){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&o&&(e[n].defaultSelected=!0)}else{for(n=""+Be(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,o&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function tr(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(u(91));return q({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function En(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(u(92));if(An(n)){if(1<n.length)throw Error(u(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Be(n)}}function Nn(e,t){var n=Be(t.value),o=Be(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),o!=null&&(e.defaultValue=""+o)}function Hr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Ur(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function nr(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Ur(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var qe,$l=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,o,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,o,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(qe=qe||document.createElement("div"),qe.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=qe.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function jt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var oo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Eo=["Webkit","ms","Moz","O"];Object.keys(oo).forEach(function(e){Eo.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),oo[t]=oo[e]})});function or(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||oo.hasOwnProperty(e)&&oo[e]?(""+t).trim():t+"px"}function zl(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var o=n.indexOf("--")===0,l=or(n,t[n],o);n==="float"&&(n="cssFloat"),o?e.setProperty(n,l):e[n]=l}}var Ol=q({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function No(e,t){if(t){if(Ol[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(u(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(u(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(u(61))}if(t.style!=null&&typeof t.style!="object")throw Error(u(62))}}function Lo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var rr=null;function lr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Xr=null,Ln=null,Yn=null;function Vr(e){if(e=dl(e)){if(typeof Xr!="function")throw Error(u(280));var t=e.stateNode;t&&(t=ns(t),Xr(e.stateNode,e.type,t))}}function Wn(e){Ln?Yn?Yn.push(e):Yn=[e]:Ln=e}function st(){if(Ln){var e=Ln,t=Yn;if(Yn=Ln=null,Vr(e),t)for(e=0;e<t.length;e++)Vr(t[e])}}function Hn(e,t){return e(t)}function Zt(){}var xt=!1;function Dl(e,t,n){if(xt)return e(t,n);xt=!0;try{return Hn(e,t,n)}finally{xt=!1,(Ln!==null||Yn!==null)&&(Zt(),st())}}function To(e,t){var n=e.stateNode;if(n===null)return null;var o=ns(n);if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(u(231,t,typeof n));return n}var Qr=!1;if(I)try{var sn={};Object.defineProperty(sn,"passive",{get:function(){Qr=!0}}),window.addEventListener("test",sn,sn),window.removeEventListener("test",sn,sn)}catch{Qr=!1}function te(e,t,n,o,l,s,c,y,k){var R=Array.prototype.slice.call(arguments,3);try{t.apply(n,R)}catch(U){this.onError(U)}}var At=!1,Ee=null,Po=!1,sr=null,Fl={onError:function(e){At=!0,Ee=e}};function Bl(e,t,n,o,l,s,c,y,k){At=!1,Ee=null,te.apply(Fl,arguments)}function pn(e,t,n,o,l,s,c,y,k){if(Bl.apply(this,arguments),At){if(At){var R=Ee;At=!1,Ee=null}else throw Error(u(198));Po||(Po=!0,sr=R)}}function dt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function ir(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Gr(e){if(dt(e)!==e)throw Error(u(188))}function Et(e){var t=e.alternate;if(!t){if(t=dt(e),t===null)throw Error(u(188));return t!==e?null:e}for(var n=e,o=t;;){var l=n.return;if(l===null)break;var s=l.alternate;if(s===null){if(o=l.return,o!==null){n=o;continue}break}if(l.child===s.child){for(s=l.child;s;){if(s===n)return Gr(l),e;if(s===o)return Gr(l),t;s=s.sibling}throw Error(u(188))}if(n.return!==o.return)n=l,o=s;else{for(var c=!1,y=l.child;y;){if(y===n){c=!0,n=l,o=s;break}if(y===o){c=!0,o=l,n=s;break}y=y.sibling}if(!c){for(y=s.child;y;){if(y===n){c=!0,n=s,o=l;break}if(y===o){c=!0,o=s,n=l;break}y=y.sibling}if(!c)throw Error(u(189))}}if(n.alternate!==o)throw Error(u(190))}if(n.tag!==3)throw Error(u(188));return n.stateNode.current===n?e:t}function Tn(e){return e=Et(e),e!==null?Xe(e):null}function Xe(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Xe(e);if(t!==null)return t;e=e.sibling}return null}var ar=a.unstable_scheduleCallback,an=a.unstable_cancelCallback,Al=a.unstable_shouldYield,ro=a.unstable_requestPaint,nt=a.unstable_now,ti=a.unstable_getCurrentPriorityLevel,Kr=a.unstable_ImmediatePriority,ur=a.unstable_UserBlockingPriority,Ro=a.unstable_NormalPriority,Io=a.unstable_LowPriority,Zr=a.unstable_IdlePriority,Un=null,Rt=null;function cr(e){if(Rt&&typeof Rt.onCommitFiberRoot=="function")try{Rt.onCommitFiberRoot(Un,e,void 0,(e.current.flags&128)===128)}catch{}}var Jt=Math.clz32?Math.clz32:Yl,lo=Math.log,hn=Math.LN2;function Yl(e){return e>>>=0,e===0?32:31-(lo(e)/hn|0)|0}var gn=64,Dt=4194304;function yn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Pn(e,t){var n=e.pendingLanes;if(n===0)return 0;var o=0,l=e.suspendedLanes,s=e.pingedLanes,c=n&268435455;if(c!==0){var y=c&~l;y!==0?o=yn(y):(s&=c,s!==0&&(o=yn(s)))}else c=n&~l,c!==0?o=yn(c):s!==0&&(o=yn(s));if(o===0)return 0;if(t!==0&&t!==o&&(t&l)===0&&(l=o&-o,s=t&-t,l>=s||l===16&&(s&4194240)!==0))return t;if((o&4)!==0&&(o|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)n=31-Jt(t),l=1<<n,o|=e[n],t&=~l;return o}function dr(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Wl(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,l=e.expirationTimes,s=e.pendingLanes;0<s;){var c=31-Jt(s),y=1<<c,k=l[c];k===-1?((y&n)===0||(y&o)!==0)&&(l[c]=dr(y,t)):k<=t&&(e.expiredLanes|=y),s&=~y}}function so(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Jr(){var e=gn;return gn<<=1,(gn&4194240)===0&&(gn=64),e}function Mo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function $o(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Jt(t),e[t]=n}function Hl(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-Jt(n),s=1<<l;t[l]=0,o[l]=-1,e[l]=-1,n&=~s}}function fr(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-Jt(n),l=1<<o;l&t|e[o]&t&&(e[o]|=t),n&=~l}}var Fe=0;function Ve(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var qr,mr,Ul,el,zo,Oo=!1,Do=[],gt=null,Rn=null,In=null,Xn=new Map,Mn=new Map,qt=[],ni="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Xl(e,t){switch(e){case"focusin":case"focusout":gt=null;break;case"dragenter":case"dragleave":Rn=null;break;case"mouseover":case"mouseout":In=null;break;case"pointerover":case"pointerout":Xn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Mn.delete(t.pointerId)}}function en(e,t,n,o,l,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:s,targetContainers:[l]},t!==null&&(t=dl(t),t!==null&&mr(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function tl(e,t,n,o,l){switch(t){case"focusin":return gt=en(gt,e,t,n,o,l),!0;case"dragenter":return Rn=en(Rn,e,t,n,o,l),!0;case"mouseover":return In=en(In,e,t,n,o,l),!0;case"pointerover":var s=l.pointerId;return Xn.set(s,en(Xn.get(s)||null,e,t,n,o,l)),!0;case"gotpointercapture":return s=l.pointerId,Mn.set(s,en(Mn.get(s)||null,e,t,n,o,l)),!0}return!1}function _r(e){var t=Bo(e.target);if(t!==null){var n=dt(t);if(n!==null){if(t=n.tag,t===13){if(t=ir(n),t!==null){e.blockedOn=t,zo(e.priority,function(){Ul(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function pr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=O(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);rr=o,n.target.dispatchEvent(o),rr=null}else return t=dl(n),t!==null&&mr(t),e.blockedOn=n,!1;t.shift()}return!0}function Vn(e,t,n){pr(e)&&n.delete(t)}function hr(){Oo=!1,gt!==null&&pr(gt)&&(gt=null),Rn!==null&&pr(Rn)&&(Rn=null),In!==null&&pr(In)&&(In=null),Xn.forEach(Vn),Mn.forEach(Vn)}function io(e,t){e.blockedOn===t&&(e.blockedOn=null,Oo||(Oo=!0,a.unstable_scheduleCallback(a.unstable_NormalPriority,hr)))}function ao(e){function t(l){return io(l,e)}if(0<Do.length){io(Do[0],e);for(var n=1;n<Do.length;n++){var o=Do[n];o.blockedOn===e&&(o.blockedOn=null)}}for(gt!==null&&io(gt,e),Rn!==null&&io(Rn,e),In!==null&&io(In,e),Xn.forEach(t),Mn.forEach(t),n=0;n<qt.length;n++)o=qt[n],o.blockedOn===e&&(o.blockedOn=null);for(;0<qt.length&&(n=qt[0],n.blockedOn===null);)_r(n),n.blockedOn===null&&qt.shift()}var Qn=ce.ReactCurrentBatchConfig,Fo=!0;function Vl(e,t,n,o){var l=Fe,s=Qn.transition;Qn.transition=null;try{Fe=1,b(e,t,n,o)}finally{Fe=l,Qn.transition=s}}function m(e,t,n,o){var l=Fe,s=Qn.transition;Qn.transition=null;try{Fe=4,b(e,t,n,o)}finally{Fe=l,Qn.transition=s}}function b(e,t,n,o){if(Fo){var l=O(e,t,n,o);if(l===null)hi(e,t,o,z,n),Xl(e,o);else if(tl(l,e,t,n,o))o.stopPropagation();else if(Xl(e,o),t&4&&-1<ni.indexOf(e)){for(;l!==null;){var s=dl(l);if(s!==null&&qr(s),s=O(e,t,n,o),s===null&&hi(e,t,o,z,n),s===l)break;l=s}l!==null&&o.stopPropagation()}else hi(e,t,o,null,n)}}var z=null;function O(e,t,n,o){if(z=null,e=lr(o),e=Bo(e),e!==null)if(t=dt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=ir(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return z=e,null}function D(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ti()){case Kr:return 1;case ur:return 4;case Ro:case Io:return 16;case Zr:return 536870912;default:return 16}default:return 16}}var W=null,se=null,le=null;function _e(){if(le)return le;var e,t=se,n=t.length,o,l="value"in W?W.value:W.textContent,s=l.length;for(e=0;e<n&&t[e]===l[e];e++);var c=n-e;for(o=1;o<=c&&t[n-o]===l[s-o];o++);return le=l.slice(e,1<o?1-o:void 0)}function Se(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function pe(){return!0}function ke(){return!1}function he(e){function t(n,o,l,s,c){this._reactName=n,this._targetInst=l,this.type=o,this.nativeEvent=s,this.target=c,this.currentTarget=null;for(var y in e)e.hasOwnProperty(y)&&(n=e[y],this[y]=n?n(s):s[y]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?pe:ke,this.isPropagationStopped=ke,this}return q(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=pe)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=pe)},persist:function(){},isPersistent:pe}),t}var be={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ie=he(be),_t=q({},be,{view:0,detail:0}),pt=he(_t),tn,ot,ut,Pe=q({},_t,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:li,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ut&&(ut&&e.type==="mousemove"?(tn=e.screenX-ut.screenX,ot=e.screenY-ut.screenY):ot=tn=0,ut=e),tn)},movementY:function(e){return"movementY"in e?e.movementY:ot}}),Re=he(Pe),It=q({},Pe,{dataTransfer:0}),rt=he(It),Yt=q({},_t,{relatedTarget:0}),Wt=he(Yt),gr=q({},be,{animationName:0,elapsedTime:0,pseudoElement:0}),oi=he(gr),Ql=q({},be,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),ri=he(Ql),tf=q({},be,{data:0}),Ja=he(tf),nf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},of={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},rf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function lf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=rf[e])?!!t[e]:!1}function li(){return lf}var sf=q({},_t,{key:function(e){if(e.key){var t=nf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Se(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?of[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:li,charCode:function(e){return e.type==="keypress"?Se(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Se(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),af=he(sf),uf=q({},Pe,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),qa=he(uf),cf=q({},_t,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:li}),df=he(cf),ff=q({},be,{propertyName:0,elapsedTime:0,pseudoElement:0}),mf=he(ff),_f=q({},Pe,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),pf=he(_f),hf=[9,13,27,32],si=I&&"CompositionEvent"in window,nl=null;I&&"documentMode"in document&&(nl=document.documentMode);var gf=I&&"TextEvent"in window&&!nl,eu=I&&(!si||nl&&8<nl&&11>=nl),tu=" ",nu=!1;function ou(e,t){switch(e){case"keyup":return hf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ru(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var yr=!1;function yf(e,t){switch(e){case"compositionend":return ru(t);case"keypress":return t.which!==32?null:(nu=!0,tu);case"textInput":return e=t.data,e===tu&&nu?null:e;default:return null}}function vf(e,t){if(yr)return e==="compositionend"||!si&&ou(e,t)?(e=_e(),le=se=W=null,yr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return eu&&t.locale!=="ko"?null:t.data;default:return null}}var xf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function lu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!xf[e.type]:t==="textarea"}function su(e,t,n,o){Wn(o),t=ql(t,"onChange"),0<t.length&&(n=new ie("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var ol=null,rl=null;function bf(e){Su(e,0)}function Gl(e){var t=kr(e);if(Yr(t))return e}function wf(e,t){if(e==="change")return t}var iu=!1;if(I){var ii;if(I){var ai="oninput"in document;if(!ai){var au=document.createElement("div");au.setAttribute("oninput","return;"),ai=typeof au.oninput=="function"}ii=ai}else ii=!1;iu=ii&&(!document.documentMode||9<document.documentMode)}function uu(){ol&&(ol.detachEvent("onpropertychange",cu),rl=ol=null)}function cu(e){if(e.propertyName==="value"&&Gl(rl)){var t=[];su(t,rl,e,lr(e)),Dl(bf,t)}}function kf(e,t,n){e==="focusin"?(uu(),ol=t,rl=n,ol.attachEvent("onpropertychange",cu)):e==="focusout"&&uu()}function Sf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Gl(rl)}function Cf(e,t){if(e==="click")return Gl(t)}function jf(e,t){if(e==="input"||e==="change")return Gl(t)}function Ef(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var vn=typeof Object.is=="function"?Object.is:Ef;function ll(e,t){if(vn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var l=n[o];if(!N.call(t,l)||!vn(e[l],t[l]))return!1}return!0}function du(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function fu(e,t){var n=du(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=du(n)}}function mu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?mu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function _u(){for(var e=window,t=jn();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=jn(e.document)}return t}function ui(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Nf(e){var t=_u(),n=e.focusedElem,o=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&mu(n.ownerDocument.documentElement,n)){if(o!==null&&ui(n)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,s=Math.min(o.start,l);o=o.end===void 0?s:Math.min(o.end,l),!e.extend&&s>o&&(l=o,o=s,s=l),l=fu(n,s);var c=fu(n,o);l&&c&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==c.node||e.focusOffset!==c.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),s>o?(e.addRange(t),e.extend(c.node,c.offset)):(t.setEnd(c.node,c.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Lf=I&&"documentMode"in document&&11>=document.documentMode,vr=null,ci=null,sl=null,di=!1;function pu(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;di||vr==null||vr!==jn(o)||(o=vr,"selectionStart"in o&&ui(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),sl&&ll(sl,o)||(sl=o,o=ql(ci,"onSelect"),0<o.length&&(t=new ie("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=vr)))}function Kl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var xr={animationend:Kl("Animation","AnimationEnd"),animationiteration:Kl("Animation","AnimationIteration"),animationstart:Kl("Animation","AnimationStart"),transitionend:Kl("Transition","TransitionEnd")},fi={},hu={};I&&(hu=document.createElement("div").style,"AnimationEvent"in window||(delete xr.animationend.animation,delete xr.animationiteration.animation,delete xr.animationstart.animation),"TransitionEvent"in window||delete xr.transitionend.transition);function Zl(e){if(fi[e])return fi[e];if(!xr[e])return e;var t=xr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in hu)return fi[e]=t[n];return e}var gu=Zl("animationend"),yu=Zl("animationiteration"),vu=Zl("animationstart"),xu=Zl("transitionend"),bu=new Map,wu="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function uo(e,t){bu.set(e,t),_(t,[e])}for(var mi=0;mi<wu.length;mi++){var _i=wu[mi],Tf=_i.toLowerCase(),Pf=_i[0].toUpperCase()+_i.slice(1);uo(Tf,"on"+Pf)}uo(gu,"onAnimationEnd"),uo(yu,"onAnimationIteration"),uo(vu,"onAnimationStart"),uo("dblclick","onDoubleClick"),uo("focusin","onFocus"),uo("focusout","onBlur"),uo(xu,"onTransitionEnd"),d("onMouseEnter",["mouseout","mouseover"]),d("onMouseLeave",["mouseout","mouseover"]),d("onPointerEnter",["pointerout","pointerover"]),d("onPointerLeave",["pointerout","pointerover"]),_("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),_("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),_("onBeforeInput",["compositionend","keypress","textInput","paste"]),_("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),_("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),_("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var il="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Rf=new Set("cancel close invalid load scroll toggle".split(" ").concat(il));function ku(e,t,n){var o=e.type||"unknown-event";e.currentTarget=n,pn(o,t,void 0,e),e.currentTarget=null}function Su(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],l=o.event;o=o.listeners;e:{var s=void 0;if(t)for(var c=o.length-1;0<=c;c--){var y=o[c],k=y.instance,R=y.currentTarget;if(y=y.listener,k!==s&&l.isPropagationStopped())break e;ku(l,y,R),s=k}else for(c=0;c<o.length;c++){if(y=o[c],k=y.instance,R=y.currentTarget,y=y.listener,k!==s&&l.isPropagationStopped())break e;ku(l,y,R),s=k}}}if(Po)throw e=sr,Po=!1,sr=null,e}function et(e,t){var n=t[wi];n===void 0&&(n=t[wi]=new Set);var o=e+"__bubble";n.has(o)||(Cu(t,e,2,!1),n.add(o))}function pi(e,t,n){var o=0;t&&(o|=4),Cu(n,e,o,t)}var Jl="_reactListening"+Math.random().toString(36).slice(2);function al(e){if(!e[Jl]){e[Jl]=!0,f.forEach(function(n){n!=="selectionchange"&&(Rf.has(n)||pi(n,!1,e),pi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Jl]||(t[Jl]=!0,pi("selectionchange",!1,t))}}function Cu(e,t,n,o){switch(D(t)){case 1:var l=Vl;break;case 4:l=m;break;default:l=b}n=l.bind(null,t,n,e),l=void 0,!Qr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),o?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function hi(e,t,n,o,l){var s=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var c=o.tag;if(c===3||c===4){var y=o.stateNode.containerInfo;if(y===l||y.nodeType===8&&y.parentNode===l)break;if(c===4)for(c=o.return;c!==null;){var k=c.tag;if((k===3||k===4)&&(k=c.stateNode.containerInfo,k===l||k.nodeType===8&&k.parentNode===l))return;c=c.return}for(;y!==null;){if(c=Bo(y),c===null)return;if(k=c.tag,k===5||k===6){o=s=c;continue e}y=y.parentNode}}o=o.return}Dl(function(){var R=s,U=lr(n),G=[];e:{var H=bu.get(e);if(H!==void 0){var oe=ie,ae=e;switch(e){case"keypress":if(Se(n)===0)break e;case"keydown":case"keyup":oe=af;break;case"focusin":ae="focus",oe=Wt;break;case"focusout":ae="blur",oe=Wt;break;case"beforeblur":case"afterblur":oe=Wt;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":oe=Re;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":oe=rt;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":oe=df;break;case gu:case yu:case vu:oe=oi;break;case xu:oe=mf;break;case"scroll":oe=pt;break;case"wheel":oe=pf;break;case"copy":case"cut":case"paste":oe=ri;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":oe=qa}var ue=(t&4)!==0,ft=!ue&&e==="scroll",E=ue?H!==null?H+"Capture":null:H;ue=[];for(var S=R,L;S!==null;){L=S;var K=L.stateNode;if(L.tag===5&&K!==null&&(L=K,E!==null&&(K=To(S,E),K!=null&&ue.push(ul(S,K,L)))),ft)break;S=S.return}0<ue.length&&(H=new oe(H,ae,null,n,U),G.push({event:H,listeners:ue}))}}if((t&7)===0){e:{if(H=e==="mouseover"||e==="pointerover",oe=e==="mouseout"||e==="pointerout",H&&n!==rr&&(ae=n.relatedTarget||n.fromElement)&&(Bo(ae)||ae[Gn]))break e;if((oe||H)&&(H=U.window===U?U:(H=U.ownerDocument)?H.defaultView||H.parentWindow:window,oe?(ae=n.relatedTarget||n.toElement,oe=R,ae=ae?Bo(ae):null,ae!==null&&(ft=dt(ae),ae!==ft||ae.tag!==5&&ae.tag!==6)&&(ae=null)):(oe=null,ae=R),oe!==ae)){if(ue=Re,K="onMouseLeave",E="onMouseEnter",S="mouse",(e==="pointerout"||e==="pointerover")&&(ue=qa,K="onPointerLeave",E="onPointerEnter",S="pointer"),ft=oe==null?H:kr(oe),L=ae==null?H:kr(ae),H=new ue(K,S+"leave",oe,n,U),H.target=ft,H.relatedTarget=L,K=null,Bo(U)===R&&(ue=new ue(E,S+"enter",ae,n,U),ue.target=L,ue.relatedTarget=ft,K=ue),ft=K,oe&&ae)t:{for(ue=oe,E=ae,S=0,L=ue;L;L=br(L))S++;for(L=0,K=E;K;K=br(K))L++;for(;0<S-L;)ue=br(ue),S--;for(;0<L-S;)E=br(E),L--;for(;S--;){if(ue===E||E!==null&&ue===E.alternate)break t;ue=br(ue),E=br(E)}ue=null}else ue=null;oe!==null&&ju(G,H,oe,ue,!1),ae!==null&&ft!==null&&ju(G,ft,ae,ue,!0)}}e:{if(H=R?kr(R):window,oe=H.nodeName&&H.nodeName.toLowerCase(),oe==="select"||oe==="input"&&H.type==="file")var fe=wf;else if(lu(H))if(iu)fe=jf;else{fe=Sf;var ve=kf}else(oe=H.nodeName)&&oe.toLowerCase()==="input"&&(H.type==="checkbox"||H.type==="radio")&&(fe=Cf);if(fe&&(fe=fe(e,R))){su(G,fe,n,U);break e}ve&&ve(e,H,R),e==="focusout"&&(ve=H._wrapperState)&&ve.controlled&&H.type==="number"&&Bn(H,"number",H.value)}switch(ve=R?kr(R):window,e){case"focusin":(lu(ve)||ve.contentEditable==="true")&&(vr=ve,ci=R,sl=null);break;case"focusout":sl=ci=vr=null;break;case"mousedown":di=!0;break;case"contextmenu":case"mouseup":case"dragend":di=!1,pu(G,n,U);break;case"selectionchange":if(Lf)break;case"keydown":case"keyup":pu(G,n,U)}var xe;if(si)e:{switch(e){case"compositionstart":var je="onCompositionStart";break e;case"compositionend":je="onCompositionEnd";break e;case"compositionupdate":je="onCompositionUpdate";break e}je=void 0}else yr?ou(e,n)&&(je="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(je="onCompositionStart");je&&(eu&&n.locale!=="ko"&&(yr||je!=="onCompositionStart"?je==="onCompositionEnd"&&yr&&(xe=_e()):(W=U,se="value"in W?W.value:W.textContent,yr=!0)),ve=ql(R,je),0<ve.length&&(je=new Ja(je,e,null,n,U),G.push({event:je,listeners:ve}),xe?je.data=xe:(xe=ru(n),xe!==null&&(je.data=xe)))),(xe=gf?yf(e,n):vf(e,n))&&(R=ql(R,"onBeforeInput"),0<R.length&&(U=new Ja("onBeforeInput","beforeinput",null,n,U),G.push({event:U,listeners:R}),U.data=xe))}Su(G,t)})}function ul(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ql(e,t){for(var n=t+"Capture",o=[];e!==null;){var l=e,s=l.stateNode;l.tag===5&&s!==null&&(l=s,s=To(e,n),s!=null&&o.unshift(ul(e,s,l)),s=To(e,t),s!=null&&o.push(ul(e,s,l))),e=e.return}return o}function br(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function ju(e,t,n,o,l){for(var s=t._reactName,c=[];n!==null&&n!==o;){var y=n,k=y.alternate,R=y.stateNode;if(k!==null&&k===o)break;y.tag===5&&R!==null&&(y=R,l?(k=To(n,s),k!=null&&c.unshift(ul(n,k,y))):l||(k=To(n,s),k!=null&&c.push(ul(n,k,y)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var If=/\r\n?/g,Mf=/\u0000|\uFFFD/g;function Eu(e){return(typeof e=="string"?e:""+e).replace(If,`
`).replace(Mf,"")}function es(e,t,n){if(t=Eu(t),Eu(e)!==t&&n)throw Error(u(425))}function ts(){}var gi=null,yi=null;function vi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var xi=typeof setTimeout=="function"?setTimeout:void 0,$f=typeof clearTimeout=="function"?clearTimeout:void 0,Nu=typeof Promise=="function"?Promise:void 0,zf=typeof queueMicrotask=="function"?queueMicrotask:typeof Nu<"u"?function(e){return Nu.resolve(null).then(e).catch(Of)}:xi;function Of(e){setTimeout(function(){throw e})}function bi(e,t){var n=t,o=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(o===0){e.removeChild(l),ao(t);return}o--}else n!=="$"&&n!=="$?"&&n!=="$!"||o++;n=l}while(n);ao(t)}function co(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Lu(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var wr=Math.random().toString(36).slice(2),$n="__reactFiber$"+wr,cl="__reactProps$"+wr,Gn="__reactContainer$"+wr,wi="__reactEvents$"+wr,Df="__reactListeners$"+wr,Ff="__reactHandles$"+wr;function Bo(e){var t=e[$n];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Gn]||n[$n]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Lu(e);e!==null;){if(n=e[$n])return n;e=Lu(e)}return t}e=n,n=e.parentNode}return null}function dl(e){return e=e[$n]||e[Gn],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function kr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(u(33))}function ns(e){return e[cl]||null}var ki=[],Sr=-1;function fo(e){return{current:e}}function tt(e){0>Sr||(e.current=ki[Sr],ki[Sr]=null,Sr--)}function Je(e,t){Sr++,ki[Sr]=e.current,e.current=t}var mo={},Mt=fo(mo),Ht=fo(!1),Ao=mo;function Cr(e,t){var n=e.type.contextTypes;if(!n)return mo;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var l={},s;for(s in n)l[s]=t[s];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function Ut(e){return e=e.childContextTypes,e!=null}function os(){tt(Ht),tt(Mt)}function Tu(e,t,n){if(Mt.current!==mo)throw Error(u(168));Je(Mt,t),Je(Ht,n)}function Pu(e,t,n){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return n;o=o.getChildContext();for(var l in o)if(!(l in t))throw Error(u(108,Qe(e)||"Unknown",l));return q({},n,o)}function rs(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||mo,Ao=Mt.current,Je(Mt,e),Je(Ht,Ht.current),!0}function Ru(e,t,n){var o=e.stateNode;if(!o)throw Error(u(169));n?(e=Pu(e,t,Ao),o.__reactInternalMemoizedMergedChildContext=e,tt(Ht),tt(Mt),Je(Mt,e)):tt(Ht),Je(Ht,n)}var Kn=null,ls=!1,Si=!1;function Iu(e){Kn===null?Kn=[e]:Kn.push(e)}function Bf(e){ls=!0,Iu(e)}function _o(){if(!Si&&Kn!==null){Si=!0;var e=0,t=Fe;try{var n=Kn;for(Fe=1;e<n.length;e++){var o=n[e];do o=o(!0);while(o!==null)}Kn=null,ls=!1}catch(l){throw Kn!==null&&(Kn=Kn.slice(e+1)),ar(Kr,_o),l}finally{Fe=t,Si=!1}}return null}var jr=[],Er=0,ss=null,is=0,un=[],cn=0,Yo=null,Zn=1,Jn="";function Wo(e,t){jr[Er++]=is,jr[Er++]=ss,ss=e,is=t}function Mu(e,t,n){un[cn++]=Zn,un[cn++]=Jn,un[cn++]=Yo,Yo=e;var o=Zn;e=Jn;var l=32-Jt(o)-1;o&=~(1<<l),n+=1;var s=32-Jt(t)+l;if(30<s){var c=l-l%5;s=(o&(1<<c)-1).toString(32),o>>=c,l-=c,Zn=1<<32-Jt(t)+l|n<<l|o,Jn=s+e}else Zn=1<<s|n<<l|o,Jn=e}function Ci(e){e.return!==null&&(Wo(e,1),Mu(e,1,0))}function ji(e){for(;e===ss;)ss=jr[--Er],jr[Er]=null,is=jr[--Er],jr[Er]=null;for(;e===Yo;)Yo=un[--cn],un[cn]=null,Jn=un[--cn],un[cn]=null,Zn=un[--cn],un[cn]=null}var nn=null,on=null,lt=!1,xn=null;function $u(e,t){var n=_n(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function zu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,nn=e,on=co(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,nn=e,on=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Yo!==null?{id:Zn,overflow:Jn}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=_n(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,nn=e,on=null,!0):!1;default:return!1}}function Ei(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Ni(e){if(lt){var t=on;if(t){var n=t;if(!zu(e,t)){if(Ei(e))throw Error(u(418));t=co(n.nextSibling);var o=nn;t&&zu(e,t)?$u(o,n):(e.flags=e.flags&-4097|2,lt=!1,nn=e)}}else{if(Ei(e))throw Error(u(418));e.flags=e.flags&-4097|2,lt=!1,nn=e}}}function Ou(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;nn=e}function as(e){if(e!==nn)return!1;if(!lt)return Ou(e),lt=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!vi(e.type,e.memoizedProps)),t&&(t=on)){if(Ei(e))throw Du(),Error(u(418));for(;t;)$u(e,t),t=co(t.nextSibling)}if(Ou(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){on=co(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}on=null}}else on=nn?co(e.stateNode.nextSibling):null;return!0}function Du(){for(var e=on;e;)e=co(e.nextSibling)}function Nr(){on=nn=null,lt=!1}function Li(e){xn===null?xn=[e]:xn.push(e)}var Af=ce.ReactCurrentBatchConfig;function fl(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(u(309));var o=n.stateNode}if(!o)throw Error(u(147,e));var l=o,s=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===s?t.ref:(t=function(c){var y=l.refs;c===null?delete y[s]:y[s]=c},t._stringRef=s,t)}if(typeof e!="string")throw Error(u(284));if(!n._owner)throw Error(u(290,e))}return e}function us(e,t){throw e=Object.prototype.toString.call(t),Error(u(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Fu(e){var t=e._init;return t(e._payload)}function Bu(e){function t(E,S){if(e){var L=E.deletions;L===null?(E.deletions=[S],E.flags|=16):L.push(S)}}function n(E,S){if(!e)return null;for(;S!==null;)t(E,S),S=S.sibling;return null}function o(E,S){for(E=new Map;S!==null;)S.key!==null?E.set(S.key,S):E.set(S.index,S),S=S.sibling;return E}function l(E,S){return E=wo(E,S),E.index=0,E.sibling=null,E}function s(E,S,L){return E.index=L,e?(L=E.alternate,L!==null?(L=L.index,L<S?(E.flags|=2,S):L):(E.flags|=2,S)):(E.flags|=1048576,S)}function c(E){return e&&E.alternate===null&&(E.flags|=2),E}function y(E,S,L,K){return S===null||S.tag!==6?(S=xa(L,E.mode,K),S.return=E,S):(S=l(S,L),S.return=E,S)}function k(E,S,L,K){var fe=L.type;return fe===J?U(E,S,L.props.children,K,L.key):S!==null&&(S.elementType===fe||typeof fe=="object"&&fe!==null&&fe.$$typeof===We&&Fu(fe)===S.type)?(K=l(S,L.props),K.ref=fl(E,S,L),K.return=E,K):(K=Is(L.type,L.key,L.props,null,E.mode,K),K.ref=fl(E,S,L),K.return=E,K)}function R(E,S,L,K){return S===null||S.tag!==4||S.stateNode.containerInfo!==L.containerInfo||S.stateNode.implementation!==L.implementation?(S=ba(L,E.mode,K),S.return=E,S):(S=l(S,L.children||[]),S.return=E,S)}function U(E,S,L,K,fe){return S===null||S.tag!==7?(S=Zo(L,E.mode,K,fe),S.return=E,S):(S=l(S,L),S.return=E,S)}function G(E,S,L){if(typeof S=="string"&&S!==""||typeof S=="number")return S=xa(""+S,E.mode,L),S.return=E,S;if(typeof S=="object"&&S!==null){switch(S.$$typeof){case ge:return L=Is(S.type,S.key,S.props,null,E.mode,L),L.ref=fl(E,null,S),L.return=E,L;case ne:return S=ba(S,E.mode,L),S.return=E,S;case We:var K=S._init;return G(E,K(S._payload),L)}if(An(S)||Z(S))return S=Zo(S,E.mode,L,null),S.return=E,S;us(E,S)}return null}function H(E,S,L,K){var fe=S!==null?S.key:null;if(typeof L=="string"&&L!==""||typeof L=="number")return fe!==null?null:y(E,S,""+L,K);if(typeof L=="object"&&L!==null){switch(L.$$typeof){case ge:return L.key===fe?k(E,S,L,K):null;case ne:return L.key===fe?R(E,S,L,K):null;case We:return fe=L._init,H(E,S,fe(L._payload),K)}if(An(L)||Z(L))return fe!==null?null:U(E,S,L,K,null);us(E,L)}return null}function oe(E,S,L,K,fe){if(typeof K=="string"&&K!==""||typeof K=="number")return E=E.get(L)||null,y(S,E,""+K,fe);if(typeof K=="object"&&K!==null){switch(K.$$typeof){case ge:return E=E.get(K.key===null?L:K.key)||null,k(S,E,K,fe);case ne:return E=E.get(K.key===null?L:K.key)||null,R(S,E,K,fe);case We:var ve=K._init;return oe(E,S,L,ve(K._payload),fe)}if(An(K)||Z(K))return E=E.get(L)||null,U(S,E,K,fe,null);us(S,K)}return null}function ae(E,S,L,K){for(var fe=null,ve=null,xe=S,je=S=0,kt=null;xe!==null&&je<L.length;je++){xe.index>je?(kt=xe,xe=null):kt=xe.sibling;var He=H(E,xe,L[je],K);if(He===null){xe===null&&(xe=kt);break}e&&xe&&He.alternate===null&&t(E,xe),S=s(He,S,je),ve===null?fe=He:ve.sibling=He,ve=He,xe=kt}if(je===L.length)return n(E,xe),lt&&Wo(E,je),fe;if(xe===null){for(;je<L.length;je++)xe=G(E,L[je],K),xe!==null&&(S=s(xe,S,je),ve===null?fe=xe:ve.sibling=xe,ve=xe);return lt&&Wo(E,je),fe}for(xe=o(E,xe);je<L.length;je++)kt=oe(xe,E,je,L[je],K),kt!==null&&(e&&kt.alternate!==null&&xe.delete(kt.key===null?je:kt.key),S=s(kt,S,je),ve===null?fe=kt:ve.sibling=kt,ve=kt);return e&&xe.forEach(function(ko){return t(E,ko)}),lt&&Wo(E,je),fe}function ue(E,S,L,K){var fe=Z(L);if(typeof fe!="function")throw Error(u(150));if(L=fe.call(L),L==null)throw Error(u(151));for(var ve=fe=null,xe=S,je=S=0,kt=null,He=L.next();xe!==null&&!He.done;je++,He=L.next()){xe.index>je?(kt=xe,xe=null):kt=xe.sibling;var ko=H(E,xe,He.value,K);if(ko===null){xe===null&&(xe=kt);break}e&&xe&&ko.alternate===null&&t(E,xe),S=s(ko,S,je),ve===null?fe=ko:ve.sibling=ko,ve=ko,xe=kt}if(He.done)return n(E,xe),lt&&Wo(E,je),fe;if(xe===null){for(;!He.done;je++,He=L.next())He=G(E,He.value,K),He!==null&&(S=s(He,S,je),ve===null?fe=He:ve.sibling=He,ve=He);return lt&&Wo(E,je),fe}for(xe=o(E,xe);!He.done;je++,He=L.next())He=oe(xe,E,je,He.value,K),He!==null&&(e&&He.alternate!==null&&xe.delete(He.key===null?je:He.key),S=s(He,S,je),ve===null?fe=He:ve.sibling=He,ve=He);return e&&xe.forEach(function(xm){return t(E,xm)}),lt&&Wo(E,je),fe}function ft(E,S,L,K){if(typeof L=="object"&&L!==null&&L.type===J&&L.key===null&&(L=L.props.children),typeof L=="object"&&L!==null){switch(L.$$typeof){case ge:e:{for(var fe=L.key,ve=S;ve!==null;){if(ve.key===fe){if(fe=L.type,fe===J){if(ve.tag===7){n(E,ve.sibling),S=l(ve,L.props.children),S.return=E,E=S;break e}}else if(ve.elementType===fe||typeof fe=="object"&&fe!==null&&fe.$$typeof===We&&Fu(fe)===ve.type){n(E,ve.sibling),S=l(ve,L.props),S.ref=fl(E,ve,L),S.return=E,E=S;break e}n(E,ve);break}else t(E,ve);ve=ve.sibling}L.type===J?(S=Zo(L.props.children,E.mode,K,L.key),S.return=E,E=S):(K=Is(L.type,L.key,L.props,null,E.mode,K),K.ref=fl(E,S,L),K.return=E,E=K)}return c(E);case ne:e:{for(ve=L.key;S!==null;){if(S.key===ve)if(S.tag===4&&S.stateNode.containerInfo===L.containerInfo&&S.stateNode.implementation===L.implementation){n(E,S.sibling),S=l(S,L.children||[]),S.return=E,E=S;break e}else{n(E,S);break}else t(E,S);S=S.sibling}S=ba(L,E.mode,K),S.return=E,E=S}return c(E);case We:return ve=L._init,ft(E,S,ve(L._payload),K)}if(An(L))return ae(E,S,L,K);if(Z(L))return ue(E,S,L,K);us(E,L)}return typeof L=="string"&&L!==""||typeof L=="number"?(L=""+L,S!==null&&S.tag===6?(n(E,S.sibling),S=l(S,L),S.return=E,E=S):(n(E,S),S=xa(L,E.mode,K),S.return=E,E=S),c(E)):n(E,S)}return ft}var Lr=Bu(!0),Au=Bu(!1),cs=fo(null),ds=null,Tr=null,Ti=null;function Pi(){Ti=Tr=ds=null}function Ri(e){var t=cs.current;tt(cs),e._currentValue=t}function Ii(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function Pr(e,t){ds=e,Ti=Tr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Xt=!0),e.firstContext=null)}function dn(e){var t=e._currentValue;if(Ti!==e)if(e={context:e,memoizedValue:t,next:null},Tr===null){if(ds===null)throw Error(u(308));Tr=e,ds.dependencies={lanes:0,firstContext:e}}else Tr=Tr.next=e;return t}var Ho=null;function Mi(e){Ho===null?Ho=[e]:Ho.push(e)}function Yu(e,t,n,o){var l=t.interleaved;return l===null?(n.next=n,Mi(t)):(n.next=l.next,l.next=n),t.interleaved=n,qn(e,o)}function qn(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var po=!1;function $i(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Wu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function eo(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function ho(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Ye&2)!==0){var l=o.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),o.pending=t,qn(e,n)}return l=o.interleaved,l===null?(t.next=t,Mi(o)):(t.next=l.next,l.next=t),o.interleaved=t,qn(e,n)}function fs(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,fr(e,n)}}function Hu(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var l=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var c={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?l=s=c:s=s.next=c,n=n.next}while(n!==null);s===null?l=s=t:s=s.next=t}else l=s=t;n={baseState:o.baseState,firstBaseUpdate:l,lastBaseUpdate:s,shared:o.shared,effects:o.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function ms(e,t,n,o){var l=e.updateQueue;po=!1;var s=l.firstBaseUpdate,c=l.lastBaseUpdate,y=l.shared.pending;if(y!==null){l.shared.pending=null;var k=y,R=k.next;k.next=null,c===null?s=R:c.next=R,c=k;var U=e.alternate;U!==null&&(U=U.updateQueue,y=U.lastBaseUpdate,y!==c&&(y===null?U.firstBaseUpdate=R:y.next=R,U.lastBaseUpdate=k))}if(s!==null){var G=l.baseState;c=0,U=R=k=null,y=s;do{var H=y.lane,oe=y.eventTime;if((o&H)===H){U!==null&&(U=U.next={eventTime:oe,lane:0,tag:y.tag,payload:y.payload,callback:y.callback,next:null});e:{var ae=e,ue=y;switch(H=t,oe=n,ue.tag){case 1:if(ae=ue.payload,typeof ae=="function"){G=ae.call(oe,G,H);break e}G=ae;break e;case 3:ae.flags=ae.flags&-65537|128;case 0:if(ae=ue.payload,H=typeof ae=="function"?ae.call(oe,G,H):ae,H==null)break e;G=q({},G,H);break e;case 2:po=!0}}y.callback!==null&&y.lane!==0&&(e.flags|=64,H=l.effects,H===null?l.effects=[y]:H.push(y))}else oe={eventTime:oe,lane:H,tag:y.tag,payload:y.payload,callback:y.callback,next:null},U===null?(R=U=oe,k=G):U=U.next=oe,c|=H;if(y=y.next,y===null){if(y=l.shared.pending,y===null)break;H=y,y=H.next,H.next=null,l.lastBaseUpdate=H,l.shared.pending=null}}while(!0);if(U===null&&(k=G),l.baseState=k,l.firstBaseUpdate=R,l.lastBaseUpdate=U,t=l.shared.interleaved,t!==null){l=t;do c|=l.lane,l=l.next;while(l!==t)}else s===null&&(l.shared.lanes=0);Vo|=c,e.lanes=c,e.memoizedState=G}}function Uu(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],l=o.callback;if(l!==null){if(o.callback=null,o=n,typeof l!="function")throw Error(u(191,l));l.call(o)}}}var ml={},zn=fo(ml),_l=fo(ml),pl=fo(ml);function Uo(e){if(e===ml)throw Error(u(174));return e}function zi(e,t){switch(Je(pl,t),Je(_l,e),Je(zn,ml),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:nr(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=nr(t,e)}tt(zn),Je(zn,t)}function Rr(){tt(zn),tt(_l),tt(pl)}function Xu(e){Uo(pl.current);var t=Uo(zn.current),n=nr(t,e.type);t!==n&&(Je(_l,e),Je(zn,n))}function Oi(e){_l.current===e&&(tt(zn),tt(_l))}var it=fo(0);function _s(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Di=[];function Fi(){for(var e=0;e<Di.length;e++)Di[e]._workInProgressVersionPrimary=null;Di.length=0}var ps=ce.ReactCurrentDispatcher,Bi=ce.ReactCurrentBatchConfig,Xo=0,at=null,yt=null,bt=null,hs=!1,hl=!1,gl=0,Yf=0;function $t(){throw Error(u(321))}function Ai(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!vn(e[n],t[n]))return!1;return!0}function Yi(e,t,n,o,l,s){if(Xo=s,at=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ps.current=e===null||e.memoizedState===null?Xf:Vf,e=n(o,l),hl){s=0;do{if(hl=!1,gl=0,25<=s)throw Error(u(301));s+=1,bt=yt=null,t.updateQueue=null,ps.current=Qf,e=n(o,l)}while(hl)}if(ps.current=vs,t=yt!==null&&yt.next!==null,Xo=0,bt=yt=at=null,hs=!1,t)throw Error(u(300));return e}function Wi(){var e=gl!==0;return gl=0,e}function On(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return bt===null?at.memoizedState=bt=e:bt=bt.next=e,bt}function fn(){if(yt===null){var e=at.alternate;e=e!==null?e.memoizedState:null}else e=yt.next;var t=bt===null?at.memoizedState:bt.next;if(t!==null)bt=t,yt=e;else{if(e===null)throw Error(u(310));yt=e,e={memoizedState:yt.memoizedState,baseState:yt.baseState,baseQueue:yt.baseQueue,queue:yt.queue,next:null},bt===null?at.memoizedState=bt=e:bt=bt.next=e}return bt}function yl(e,t){return typeof t=="function"?t(e):t}function Hi(e){var t=fn(),n=t.queue;if(n===null)throw Error(u(311));n.lastRenderedReducer=e;var o=yt,l=o.baseQueue,s=n.pending;if(s!==null){if(l!==null){var c=l.next;l.next=s.next,s.next=c}o.baseQueue=l=s,n.pending=null}if(l!==null){s=l.next,o=o.baseState;var y=c=null,k=null,R=s;do{var U=R.lane;if((Xo&U)===U)k!==null&&(k=k.next={lane:0,action:R.action,hasEagerState:R.hasEagerState,eagerState:R.eagerState,next:null}),o=R.hasEagerState?R.eagerState:e(o,R.action);else{var G={lane:U,action:R.action,hasEagerState:R.hasEagerState,eagerState:R.eagerState,next:null};k===null?(y=k=G,c=o):k=k.next=G,at.lanes|=U,Vo|=U}R=R.next}while(R!==null&&R!==s);k===null?c=o:k.next=y,vn(o,t.memoizedState)||(Xt=!0),t.memoizedState=o,t.baseState=c,t.baseQueue=k,n.lastRenderedState=o}if(e=n.interleaved,e!==null){l=e;do s=l.lane,at.lanes|=s,Vo|=s,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Ui(e){var t=fn(),n=t.queue;if(n===null)throw Error(u(311));n.lastRenderedReducer=e;var o=n.dispatch,l=n.pending,s=t.memoizedState;if(l!==null){n.pending=null;var c=l=l.next;do s=e(s,c.action),c=c.next;while(c!==l);vn(s,t.memoizedState)||(Xt=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),n.lastRenderedState=s}return[s,o]}function Vu(){}function Qu(e,t){var n=at,o=fn(),l=t(),s=!vn(o.memoizedState,l);if(s&&(o.memoizedState=l,Xt=!0),o=o.queue,Xi(Zu.bind(null,n,o,e),[e]),o.getSnapshot!==t||s||bt!==null&&bt.memoizedState.tag&1){if(n.flags|=2048,vl(9,Ku.bind(null,n,o,l,t),void 0,null),wt===null)throw Error(u(349));(Xo&30)!==0||Gu(n,t,l)}return l}function Gu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=at.updateQueue,t===null?(t={lastEffect:null,stores:null},at.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Ku(e,t,n,o){t.value=n,t.getSnapshot=o,Ju(t)&&qu(e)}function Zu(e,t,n){return n(function(){Ju(t)&&qu(e)})}function Ju(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!vn(e,n)}catch{return!0}}function qu(e){var t=qn(e,1);t!==null&&Sn(t,e,1,-1)}function ec(e){var t=On();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:yl,lastRenderedState:e},t.queue=e,e=e.dispatch=Uf.bind(null,at,e),[t.memoizedState,e]}function vl(e,t,n,o){return e={tag:e,create:t,destroy:n,deps:o,next:null},t=at.updateQueue,t===null?(t={lastEffect:null,stores:null},at.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e)),e}function tc(){return fn().memoizedState}function gs(e,t,n,o){var l=On();at.flags|=e,l.memoizedState=vl(1|t,n,void 0,o===void 0?null:o)}function ys(e,t,n,o){var l=fn();o=o===void 0?null:o;var s=void 0;if(yt!==null){var c=yt.memoizedState;if(s=c.destroy,o!==null&&Ai(o,c.deps)){l.memoizedState=vl(t,n,s,o);return}}at.flags|=e,l.memoizedState=vl(1|t,n,s,o)}function nc(e,t){return gs(8390656,8,e,t)}function Xi(e,t){return ys(2048,8,e,t)}function oc(e,t){return ys(4,2,e,t)}function rc(e,t){return ys(4,4,e,t)}function lc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function sc(e,t,n){return n=n!=null?n.concat([e]):null,ys(4,4,lc.bind(null,t,e),n)}function Vi(){}function ic(e,t){var n=fn();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Ai(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function ac(e,t){var n=fn();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Ai(t,o[1])?o[0]:(e=e(),n.memoizedState=[e,t],e)}function uc(e,t,n){return(Xo&21)===0?(e.baseState&&(e.baseState=!1,Xt=!0),e.memoizedState=n):(vn(n,t)||(n=Jr(),at.lanes|=n,Vo|=n,e.baseState=!0),t)}function Wf(e,t){var n=Fe;Fe=n!==0&&4>n?n:4,e(!0);var o=Bi.transition;Bi.transition={};try{e(!1),t()}finally{Fe=n,Bi.transition=o}}function cc(){return fn().memoizedState}function Hf(e,t,n){var o=xo(e);if(n={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null},dc(e))fc(t,n);else if(n=Yu(e,t,n,o),n!==null){var l=Bt();Sn(n,e,o,l),mc(n,t,o)}}function Uf(e,t,n){var o=xo(e),l={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null};if(dc(e))fc(t,l);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var c=t.lastRenderedState,y=s(c,n);if(l.hasEagerState=!0,l.eagerState=y,vn(y,c)){var k=t.interleaved;k===null?(l.next=l,Mi(t)):(l.next=k.next,k.next=l),t.interleaved=l;return}}catch{}finally{}n=Yu(e,t,l,o),n!==null&&(l=Bt(),Sn(n,e,o,l),mc(n,t,o))}}function dc(e){var t=e.alternate;return e===at||t!==null&&t===at}function fc(e,t){hl=hs=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function mc(e,t,n){if((n&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,fr(e,n)}}var vs={readContext:dn,useCallback:$t,useContext:$t,useEffect:$t,useImperativeHandle:$t,useInsertionEffect:$t,useLayoutEffect:$t,useMemo:$t,useReducer:$t,useRef:$t,useState:$t,useDebugValue:$t,useDeferredValue:$t,useTransition:$t,useMutableSource:$t,useSyncExternalStore:$t,useId:$t,unstable_isNewReconciler:!1},Xf={readContext:dn,useCallback:function(e,t){return On().memoizedState=[e,t===void 0?null:t],e},useContext:dn,useEffect:nc,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,gs(4194308,4,lc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return gs(4194308,4,e,t)},useInsertionEffect:function(e,t){return gs(4,2,e,t)},useMemo:function(e,t){var n=On();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var o=On();return t=n!==void 0?n(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=Hf.bind(null,at,e),[o.memoizedState,e]},useRef:function(e){var t=On();return e={current:e},t.memoizedState=e},useState:ec,useDebugValue:Vi,useDeferredValue:function(e){return On().memoizedState=e},useTransition:function(){var e=ec(!1),t=e[0];return e=Wf.bind(null,e[1]),On().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var o=at,l=On();if(lt){if(n===void 0)throw Error(u(407));n=n()}else{if(n=t(),wt===null)throw Error(u(349));(Xo&30)!==0||Gu(o,t,n)}l.memoizedState=n;var s={value:n,getSnapshot:t};return l.queue=s,nc(Zu.bind(null,o,s,e),[e]),o.flags|=2048,vl(9,Ku.bind(null,o,s,n,t),void 0,null),n},useId:function(){var e=On(),t=wt.identifierPrefix;if(lt){var n=Jn,o=Zn;n=(o&~(1<<32-Jt(o)-1)).toString(32)+n,t=":"+t+"R"+n,n=gl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Yf++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Vf={readContext:dn,useCallback:ic,useContext:dn,useEffect:Xi,useImperativeHandle:sc,useInsertionEffect:oc,useLayoutEffect:rc,useMemo:ac,useReducer:Hi,useRef:tc,useState:function(){return Hi(yl)},useDebugValue:Vi,useDeferredValue:function(e){var t=fn();return uc(t,yt.memoizedState,e)},useTransition:function(){var e=Hi(yl)[0],t=fn().memoizedState;return[e,t]},useMutableSource:Vu,useSyncExternalStore:Qu,useId:cc,unstable_isNewReconciler:!1},Qf={readContext:dn,useCallback:ic,useContext:dn,useEffect:Xi,useImperativeHandle:sc,useInsertionEffect:oc,useLayoutEffect:rc,useMemo:ac,useReducer:Ui,useRef:tc,useState:function(){return Ui(yl)},useDebugValue:Vi,useDeferredValue:function(e){var t=fn();return yt===null?t.memoizedState=e:uc(t,yt.memoizedState,e)},useTransition:function(){var e=Ui(yl)[0],t=fn().memoizedState;return[e,t]},useMutableSource:Vu,useSyncExternalStore:Qu,useId:cc,unstable_isNewReconciler:!1};function bn(e,t){if(e&&e.defaultProps){t=q({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Qi(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:q({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var xs={isMounted:function(e){return(e=e._reactInternals)?dt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var o=Bt(),l=xo(e),s=eo(o,l);s.payload=t,n!=null&&(s.callback=n),t=ho(e,s,l),t!==null&&(Sn(t,e,l,o),fs(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=Bt(),l=xo(e),s=eo(o,l);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=ho(e,s,l),t!==null&&(Sn(t,e,l,o),fs(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Bt(),o=xo(e),l=eo(n,o);l.tag=2,t!=null&&(l.callback=t),t=ho(e,l,o),t!==null&&(Sn(t,e,o,n),fs(t,e,o))}};function _c(e,t,n,o,l,s,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,s,c):t.prototype&&t.prototype.isPureReactComponent?!ll(n,o)||!ll(l,s):!0}function pc(e,t,n){var o=!1,l=mo,s=t.contextType;return typeof s=="object"&&s!==null?s=dn(s):(l=Ut(t)?Ao:Mt.current,o=t.contextTypes,s=(o=o!=null)?Cr(e,l):mo),t=new t(n,s),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=xs,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=s),t}function hc(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&xs.enqueueReplaceState(t,t.state,null)}function Gi(e,t,n,o){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},$i(e);var s=t.contextType;typeof s=="object"&&s!==null?l.context=dn(s):(s=Ut(t)?Ao:Mt.current,l.context=Cr(e,s)),l.state=e.memoizedState,s=t.getDerivedStateFromProps,typeof s=="function"&&(Qi(e,t,s,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&xs.enqueueReplaceState(l,l.state,null),ms(e,n,l,o),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function Ir(e,t){try{var n="",o=t;do n+=Oe(o),o=o.return;while(o);var l=n}catch(s){l=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:t,stack:l,digest:null}}function Ki(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Zi(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Gf=typeof WeakMap=="function"?WeakMap:Map;function gc(e,t,n){n=eo(-1,n),n.tag=3,n.payload={element:null};var o=t.value;return n.callback=function(){Es||(Es=!0,fa=o),Zi(e,t)},n}function yc(e,t,n){n=eo(-1,n),n.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var l=t.value;n.payload=function(){return o(l)},n.callback=function(){Zi(e,t)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Zi(e,t),typeof o!="function"&&(yo===null?yo=new Set([this]):yo.add(this));var c=t.stack;this.componentDidCatch(t.value,{componentStack:c!==null?c:""})}),n}function vc(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new Gf;var l=new Set;o.set(t,l)}else l=o.get(t),l===void 0&&(l=new Set,o.set(t,l));l.has(n)||(l.add(n),e=um.bind(null,e,t,n),t.then(e,e))}function xc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function bc(e,t,n,o,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=eo(-1,1),t.tag=2,ho(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var Kf=ce.ReactCurrentOwner,Xt=!1;function Ft(e,t,n,o){t.child=e===null?Au(t,null,n,o):Lr(t,e.child,n,o)}function wc(e,t,n,o,l){n=n.render;var s=t.ref;return Pr(t,l),o=Yi(e,t,n,o,s,l),n=Wi(),e!==null&&!Xt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,to(e,t,l)):(lt&&n&&Ci(t),t.flags|=1,Ft(e,t,o,l),t.child)}function kc(e,t,n,o,l){if(e===null){var s=n.type;return typeof s=="function"&&!va(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=s,Sc(e,t,s,o,l)):(e=Is(n.type,null,o,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,(e.lanes&l)===0){var c=s.memoizedProps;if(n=n.compare,n=n!==null?n:ll,n(c,o)&&e.ref===t.ref)return to(e,t,l)}return t.flags|=1,e=wo(s,o),e.ref=t.ref,e.return=t,t.child=e}function Sc(e,t,n,o,l){if(e!==null){var s=e.memoizedProps;if(ll(s,o)&&e.ref===t.ref)if(Xt=!1,t.pendingProps=o=s,(e.lanes&l)!==0)(e.flags&131072)!==0&&(Xt=!0);else return t.lanes=e.lanes,to(e,t,l)}return Ji(e,t,n,o,l)}function Cc(e,t,n){var o=t.pendingProps,l=o.children,s=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Je($r,rn),rn|=n;else{if((n&1073741824)===0)return e=s!==null?s.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Je($r,rn),rn|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=s!==null?s.baseLanes:n,Je($r,rn),rn|=o}else s!==null?(o=s.baseLanes|n,t.memoizedState=null):o=n,Je($r,rn),rn|=o;return Ft(e,t,l,n),t.child}function jc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Ji(e,t,n,o,l){var s=Ut(n)?Ao:Mt.current;return s=Cr(t,s),Pr(t,l),n=Yi(e,t,n,o,s,l),o=Wi(),e!==null&&!Xt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,to(e,t,l)):(lt&&o&&Ci(t),t.flags|=1,Ft(e,t,n,l),t.child)}function Ec(e,t,n,o,l){if(Ut(n)){var s=!0;rs(t)}else s=!1;if(Pr(t,l),t.stateNode===null)ws(e,t),pc(t,n,o),Gi(t,n,o,l),o=!0;else if(e===null){var c=t.stateNode,y=t.memoizedProps;c.props=y;var k=c.context,R=n.contextType;typeof R=="object"&&R!==null?R=dn(R):(R=Ut(n)?Ao:Mt.current,R=Cr(t,R));var U=n.getDerivedStateFromProps,G=typeof U=="function"||typeof c.getSnapshotBeforeUpdate=="function";G||typeof c.UNSAFE_componentWillReceiveProps!="function"&&typeof c.componentWillReceiveProps!="function"||(y!==o||k!==R)&&hc(t,c,o,R),po=!1;var H=t.memoizedState;c.state=H,ms(t,o,c,l),k=t.memoizedState,y!==o||H!==k||Ht.current||po?(typeof U=="function"&&(Qi(t,n,U,o),k=t.memoizedState),(y=po||_c(t,n,y,o,H,k,R))?(G||typeof c.UNSAFE_componentWillMount!="function"&&typeof c.componentWillMount!="function"||(typeof c.componentWillMount=="function"&&c.componentWillMount(),typeof c.UNSAFE_componentWillMount=="function"&&c.UNSAFE_componentWillMount()),typeof c.componentDidMount=="function"&&(t.flags|=4194308)):(typeof c.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=k),c.props=o,c.state=k,c.context=R,o=y):(typeof c.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{c=t.stateNode,Wu(e,t),y=t.memoizedProps,R=t.type===t.elementType?y:bn(t.type,y),c.props=R,G=t.pendingProps,H=c.context,k=n.contextType,typeof k=="object"&&k!==null?k=dn(k):(k=Ut(n)?Ao:Mt.current,k=Cr(t,k));var oe=n.getDerivedStateFromProps;(U=typeof oe=="function"||typeof c.getSnapshotBeforeUpdate=="function")||typeof c.UNSAFE_componentWillReceiveProps!="function"&&typeof c.componentWillReceiveProps!="function"||(y!==G||H!==k)&&hc(t,c,o,k),po=!1,H=t.memoizedState,c.state=H,ms(t,o,c,l);var ae=t.memoizedState;y!==G||H!==ae||Ht.current||po?(typeof oe=="function"&&(Qi(t,n,oe,o),ae=t.memoizedState),(R=po||_c(t,n,R,o,H,ae,k)||!1)?(U||typeof c.UNSAFE_componentWillUpdate!="function"&&typeof c.componentWillUpdate!="function"||(typeof c.componentWillUpdate=="function"&&c.componentWillUpdate(o,ae,k),typeof c.UNSAFE_componentWillUpdate=="function"&&c.UNSAFE_componentWillUpdate(o,ae,k)),typeof c.componentDidUpdate=="function"&&(t.flags|=4),typeof c.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof c.componentDidUpdate!="function"||y===e.memoizedProps&&H===e.memoizedState||(t.flags|=4),typeof c.getSnapshotBeforeUpdate!="function"||y===e.memoizedProps&&H===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=ae),c.props=o,c.state=ae,c.context=k,o=R):(typeof c.componentDidUpdate!="function"||y===e.memoizedProps&&H===e.memoizedState||(t.flags|=4),typeof c.getSnapshotBeforeUpdate!="function"||y===e.memoizedProps&&H===e.memoizedState||(t.flags|=1024),o=!1)}return qi(e,t,n,o,s,l)}function qi(e,t,n,o,l,s){jc(e,t);var c=(t.flags&128)!==0;if(!o&&!c)return l&&Ru(t,n,!1),to(e,t,s);o=t.stateNode,Kf.current=t;var y=c&&typeof n.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&c?(t.child=Lr(t,e.child,null,s),t.child=Lr(t,null,y,s)):Ft(e,t,y,s),t.memoizedState=o.state,l&&Ru(t,n,!0),t.child}function Nc(e){var t=e.stateNode;t.pendingContext?Tu(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Tu(e,t.context,!1),zi(e,t.containerInfo)}function Lc(e,t,n,o,l){return Nr(),Li(l),t.flags|=256,Ft(e,t,n,o),t.child}var ea={dehydrated:null,treeContext:null,retryLane:0};function ta(e){return{baseLanes:e,cachePool:null,transitions:null}}function Tc(e,t,n){var o=t.pendingProps,l=it.current,s=!1,c=(t.flags&128)!==0,y;if((y=c)||(y=e!==null&&e.memoizedState===null?!1:(l&2)!==0),y?(s=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),Je(it,l&1),e===null)return Ni(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(c=o.children,e=o.fallback,s?(o=t.mode,s=t.child,c={mode:"hidden",children:c},(o&1)===0&&s!==null?(s.childLanes=0,s.pendingProps=c):s=Ms(c,o,0,null),e=Zo(e,o,n,null),s.return=t,e.return=t,s.sibling=e,t.child=s,t.child.memoizedState=ta(n),t.memoizedState=ea,e):na(t,c));if(l=e.memoizedState,l!==null&&(y=l.dehydrated,y!==null))return Zf(e,t,c,o,y,l,n);if(s){s=o.fallback,c=t.mode,l=e.child,y=l.sibling;var k={mode:"hidden",children:o.children};return(c&1)===0&&t.child!==l?(o=t.child,o.childLanes=0,o.pendingProps=k,t.deletions=null):(o=wo(l,k),o.subtreeFlags=l.subtreeFlags&14680064),y!==null?s=wo(y,s):(s=Zo(s,c,n,null),s.flags|=2),s.return=t,o.return=t,o.sibling=s,t.child=o,o=s,s=t.child,c=e.child.memoizedState,c=c===null?ta(n):{baseLanes:c.baseLanes|n,cachePool:null,transitions:c.transitions},s.memoizedState=c,s.childLanes=e.childLanes&~n,t.memoizedState=ea,o}return s=e.child,e=s.sibling,o=wo(s,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=n),o.return=t,o.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=o,t.memoizedState=null,o}function na(e,t){return t=Ms({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function bs(e,t,n,o){return o!==null&&Li(o),Lr(t,e.child,null,n),e=na(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Zf(e,t,n,o,l,s,c){if(n)return t.flags&256?(t.flags&=-257,o=Ki(Error(u(422))),bs(e,t,c,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(s=o.fallback,l=t.mode,o=Ms({mode:"visible",children:o.children},l,0,null),s=Zo(s,l,c,null),s.flags|=2,o.return=t,s.return=t,o.sibling=s,t.child=o,(t.mode&1)!==0&&Lr(t,e.child,null,c),t.child.memoizedState=ta(c),t.memoizedState=ea,s);if((t.mode&1)===0)return bs(e,t,c,null);if(l.data==="$!"){if(o=l.nextSibling&&l.nextSibling.dataset,o)var y=o.dgst;return o=y,s=Error(u(419)),o=Ki(s,o,void 0),bs(e,t,c,o)}if(y=(c&e.childLanes)!==0,Xt||y){if(o=wt,o!==null){switch(c&-c){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(o.suspendedLanes|c))!==0?0:l,l!==0&&l!==s.retryLane&&(s.retryLane=l,qn(e,l),Sn(o,e,l,-1))}return ya(),o=Ki(Error(u(421))),bs(e,t,c,o)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=cm.bind(null,e),l._reactRetry=t,null):(e=s.treeContext,on=co(l.nextSibling),nn=t,lt=!0,xn=null,e!==null&&(un[cn++]=Zn,un[cn++]=Jn,un[cn++]=Yo,Zn=e.id,Jn=e.overflow,Yo=t),t=na(t,o.children),t.flags|=4096,t)}function Pc(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),Ii(e.return,t,n)}function oa(e,t,n,o,l){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:l}:(s.isBackwards=t,s.rendering=null,s.renderingStartTime=0,s.last=o,s.tail=n,s.tailMode=l)}function Rc(e,t,n){var o=t.pendingProps,l=o.revealOrder,s=o.tail;if(Ft(e,t,o.children,n),o=it.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Pc(e,n,t);else if(e.tag===19)Pc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(Je(it,o),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&_s(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),oa(t,!1,l,n,s);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&_s(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}oa(t,!0,n,null,s);break;case"together":oa(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ws(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function to(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Vo|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(u(153));if(t.child!==null){for(e=t.child,n=wo(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=wo(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Jf(e,t,n){switch(t.tag){case 3:Nc(t),Nr();break;case 5:Xu(t);break;case 1:Ut(t.type)&&rs(t);break;case 4:zi(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,l=t.memoizedProps.value;Je(cs,o._currentValue),o._currentValue=l;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(Je(it,it.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Tc(e,t,n):(Je(it,it.current&1),e=to(e,t,n),e!==null?e.sibling:null);Je(it,it.current&1);break;case 19:if(o=(n&t.childLanes)!==0,(e.flags&128)!==0){if(o)return Rc(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),Je(it,it.current),o)break;return null;case 22:case 23:return t.lanes=0,Cc(e,t,n)}return to(e,t,n)}var Ic,ra,Mc,$c;Ic=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},ra=function(){},Mc=function(e,t,n,o){var l=e.memoizedProps;if(l!==o){e=t.stateNode,Uo(zn.current);var s=null;switch(n){case"input":l=qo(e,l),o=qo(e,o),s=[];break;case"select":l=q({},l,{value:void 0}),o=q({},o,{value:void 0}),s=[];break;case"textarea":l=tr(e,l),o=tr(e,o),s=[];break;default:typeof l.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=ts)}No(n,o);var c;n=null;for(R in l)if(!o.hasOwnProperty(R)&&l.hasOwnProperty(R)&&l[R]!=null)if(R==="style"){var y=l[R];for(c in y)y.hasOwnProperty(c)&&(n||(n={}),n[c]="")}else R!=="dangerouslySetInnerHTML"&&R!=="children"&&R!=="suppressContentEditableWarning"&&R!=="suppressHydrationWarning"&&R!=="autoFocus"&&(v.hasOwnProperty(R)?s||(s=[]):(s=s||[]).push(R,null));for(R in o){var k=o[R];if(y=l!=null?l[R]:void 0,o.hasOwnProperty(R)&&k!==y&&(k!=null||y!=null))if(R==="style")if(y){for(c in y)!y.hasOwnProperty(c)||k&&k.hasOwnProperty(c)||(n||(n={}),n[c]="");for(c in k)k.hasOwnProperty(c)&&y[c]!==k[c]&&(n||(n={}),n[c]=k[c])}else n||(s||(s=[]),s.push(R,n)),n=k;else R==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,y=y?y.__html:void 0,k!=null&&y!==k&&(s=s||[]).push(R,k)):R==="children"?typeof k!="string"&&typeof k!="number"||(s=s||[]).push(R,""+k):R!=="suppressContentEditableWarning"&&R!=="suppressHydrationWarning"&&(v.hasOwnProperty(R)?(k!=null&&R==="onScroll"&&et("scroll",e),s||y===k||(s=[])):(s=s||[]).push(R,k))}n&&(s=s||[]).push("style",n);var R=s;(t.updateQueue=R)&&(t.flags|=4)}},$c=function(e,t,n,o){n!==o&&(t.flags|=4)};function xl(e,t){if(!lt)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function zt(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,o|=l.subtreeFlags&14680064,o|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,o|=l.subtreeFlags,o|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function qf(e,t,n){var o=t.pendingProps;switch(ji(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return zt(t),null;case 1:return Ut(t.type)&&os(),zt(t),null;case 3:return o=t.stateNode,Rr(),tt(Ht),tt(Mt),Fi(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(as(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,xn!==null&&(pa(xn),xn=null))),ra(e,t),zt(t),null;case 5:Oi(t);var l=Uo(pl.current);if(n=t.type,e!==null&&t.stateNode!=null)Mc(e,t,n,o,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(u(166));return zt(t),null}if(e=Uo(zn.current),as(t)){o=t.stateNode,n=t.type;var s=t.memoizedProps;switch(o[$n]=t,o[cl]=s,e=(t.mode&1)!==0,n){case"dialog":et("cancel",o),et("close",o);break;case"iframe":case"object":case"embed":et("load",o);break;case"video":case"audio":for(l=0;l<il.length;l++)et(il[l],o);break;case"source":et("error",o);break;case"img":case"image":case"link":et("error",o),et("load",o);break;case"details":et("toggle",o);break;case"input":Wr(o,s),et("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!s.multiple},et("invalid",o);break;case"textarea":En(o,s),et("invalid",o)}No(n,s),l=null;for(var c in s)if(s.hasOwnProperty(c)){var y=s[c];c==="children"?typeof y=="string"?o.textContent!==y&&(s.suppressHydrationWarning!==!0&&es(o.textContent,y,e),l=["children",y]):typeof y=="number"&&o.textContent!==""+y&&(s.suppressHydrationWarning!==!0&&es(o.textContent,y,e),l=["children",""+y]):v.hasOwnProperty(c)&&y!=null&&c==="onScroll"&&et("scroll",o)}switch(n){case"input":ln(o),Le(o,s,!0);break;case"textarea":ln(o),Hr(o);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(o.onclick=ts)}o=l,t.updateQueue=o,o!==null&&(t.flags|=4)}else{c=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Ur(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=c.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=c.createElement(n,{is:o.is}):(e=c.createElement(n),n==="select"&&(c=e,o.multiple?c.multiple=!0:o.size&&(c.size=o.size))):e=c.createElementNS(e,n),e[$n]=t,e[cl]=o,Ic(e,t,!1,!1),t.stateNode=e;e:{switch(c=Lo(n,o),n){case"dialog":et("cancel",e),et("close",e),l=o;break;case"iframe":case"object":case"embed":et("load",e),l=o;break;case"video":case"audio":for(l=0;l<il.length;l++)et(il[l],e);l=o;break;case"source":et("error",e),l=o;break;case"img":case"image":case"link":et("error",e),et("load",e),l=o;break;case"details":et("toggle",e),l=o;break;case"input":Wr(e,o),l=qo(e,o),et("invalid",e);break;case"option":l=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},l=q({},o,{value:void 0}),et("invalid",e);break;case"textarea":En(e,o),l=tr(e,o),et("invalid",e);break;default:l=o}No(n,l),y=l;for(s in y)if(y.hasOwnProperty(s)){var k=y[s];s==="style"?zl(e,k):s==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,k!=null&&$l(e,k)):s==="children"?typeof k=="string"?(n!=="textarea"||k!=="")&&jt(e,k):typeof k=="number"&&jt(e,""+k):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(v.hasOwnProperty(s)?k!=null&&s==="onScroll"&&et("scroll",e):k!=null&&Q(e,s,k,c))}switch(n){case"input":ln(e),Le(e,o,!1);break;case"textarea":ln(e),Hr(e);break;case"option":o.value!=null&&e.setAttribute("value",""+Be(o.value));break;case"select":e.multiple=!!o.multiple,s=o.value,s!=null?Pt(e,!!o.multiple,s,!1):o.defaultValue!=null&&Pt(e,!!o.multiple,o.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=ts)}switch(n){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return zt(t),null;case 6:if(e&&t.stateNode!=null)$c(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(u(166));if(n=Uo(pl.current),Uo(zn.current),as(t)){if(o=t.stateNode,n=t.memoizedProps,o[$n]=t,(s=o.nodeValue!==n)&&(e=nn,e!==null))switch(e.tag){case 3:es(o.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&es(o.nodeValue,n,(e.mode&1)!==0)}s&&(t.flags|=4)}else o=(n.nodeType===9?n:n.ownerDocument).createTextNode(o),o[$n]=t,t.stateNode=o}return zt(t),null;case 13:if(tt(it),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(lt&&on!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Du(),Nr(),t.flags|=98560,s=!1;else if(s=as(t),o!==null&&o.dehydrated!==null){if(e===null){if(!s)throw Error(u(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(u(317));s[$n]=t}else Nr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;zt(t),s=!1}else xn!==null&&(pa(xn),xn=null),s=!0;if(!s)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(it.current&1)!==0?vt===0&&(vt=3):ya())),t.updateQueue!==null&&(t.flags|=4),zt(t),null);case 4:return Rr(),ra(e,t),e===null&&al(t.stateNode.containerInfo),zt(t),null;case 10:return Ri(t.type._context),zt(t),null;case 17:return Ut(t.type)&&os(),zt(t),null;case 19:if(tt(it),s=t.memoizedState,s===null)return zt(t),null;if(o=(t.flags&128)!==0,c=s.rendering,c===null)if(o)xl(s,!1);else{if(vt!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(c=_s(e),c!==null){for(t.flags|=128,xl(s,!1),o=c.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=n,n=t.child;n!==null;)s=n,e=o,s.flags&=14680066,c=s.alternate,c===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=c.childLanes,s.lanes=c.lanes,s.child=c.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=c.memoizedProps,s.memoizedState=c.memoizedState,s.updateQueue=c.updateQueue,s.type=c.type,e=c.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return Je(it,it.current&1|2),t.child}e=e.sibling}s.tail!==null&&nt()>zr&&(t.flags|=128,o=!0,xl(s,!1),t.lanes=4194304)}else{if(!o)if(e=_s(c),e!==null){if(t.flags|=128,o=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),xl(s,!0),s.tail===null&&s.tailMode==="hidden"&&!c.alternate&&!lt)return zt(t),null}else 2*nt()-s.renderingStartTime>zr&&n!==1073741824&&(t.flags|=128,o=!0,xl(s,!1),t.lanes=4194304);s.isBackwards?(c.sibling=t.child,t.child=c):(n=s.last,n!==null?n.sibling=c:t.child=c,s.last=c)}return s.tail!==null?(t=s.tail,s.rendering=t,s.tail=t.sibling,s.renderingStartTime=nt(),t.sibling=null,n=it.current,Je(it,o?n&1|2:n&1),t):(zt(t),null);case 22:case 23:return ga(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(rn&1073741824)!==0&&(zt(t),t.subtreeFlags&6&&(t.flags|=8192)):zt(t),null;case 24:return null;case 25:return null}throw Error(u(156,t.tag))}function em(e,t){switch(ji(t),t.tag){case 1:return Ut(t.type)&&os(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Rr(),tt(Ht),tt(Mt),Fi(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Oi(t),null;case 13:if(tt(it),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(u(340));Nr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return tt(it),null;case 4:return Rr(),null;case 10:return Ri(t.type._context),null;case 22:case 23:return ga(),null;case 24:return null;default:return null}}var ks=!1,Ot=!1,tm=typeof WeakSet=="function"?WeakSet:Set,re=null;function Mr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(o){ct(e,t,o)}else n.current=null}function la(e,t,n){try{n()}catch(o){ct(e,t,o)}}var zc=!1;function nm(e,t){if(gi=Fo,e=_u(),ui(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var o=n.getSelection&&n.getSelection();if(o&&o.rangeCount!==0){n=o.anchorNode;var l=o.anchorOffset,s=o.focusNode;o=o.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var c=0,y=-1,k=-1,R=0,U=0,G=e,H=null;t:for(;;){for(var oe;G!==n||l!==0&&G.nodeType!==3||(y=c+l),G!==s||o!==0&&G.nodeType!==3||(k=c+o),G.nodeType===3&&(c+=G.nodeValue.length),(oe=G.firstChild)!==null;)H=G,G=oe;for(;;){if(G===e)break t;if(H===n&&++R===l&&(y=c),H===s&&++U===o&&(k=c),(oe=G.nextSibling)!==null)break;G=H,H=G.parentNode}G=oe}n=y===-1||k===-1?null:{start:y,end:k}}else n=null}n=n||{start:0,end:0}}else n=null;for(yi={focusedElem:e,selectionRange:n},Fo=!1,re=t;re!==null;)if(t=re,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,re=e;else for(;re!==null;){t=re;try{var ae=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(ae!==null){var ue=ae.memoizedProps,ft=ae.memoizedState,E=t.stateNode,S=E.getSnapshotBeforeUpdate(t.elementType===t.type?ue:bn(t.type,ue),ft);E.__reactInternalSnapshotBeforeUpdate=S}break;case 3:var L=t.stateNode.containerInfo;L.nodeType===1?L.textContent="":L.nodeType===9&&L.documentElement&&L.removeChild(L.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(u(163))}}catch(K){ct(t,t.return,K)}if(e=t.sibling,e!==null){e.return=t.return,re=e;break}re=t.return}return ae=zc,zc=!1,ae}function bl(e,t,n){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var l=o=o.next;do{if((l.tag&e)===e){var s=l.destroy;l.destroy=void 0,s!==void 0&&la(t,n,s)}l=l.next}while(l!==o)}}function Ss(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var o=n.create;n.destroy=o()}n=n.next}while(n!==t)}}function sa(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Oc(e){var t=e.alternate;t!==null&&(e.alternate=null,Oc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[$n],delete t[cl],delete t[wi],delete t[Df],delete t[Ff])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Dc(e){return e.tag===5||e.tag===3||e.tag===4}function Fc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Dc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ia(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ts));else if(o!==4&&(e=e.child,e!==null))for(ia(e,t,n),e=e.sibling;e!==null;)ia(e,t,n),e=e.sibling}function aa(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(aa(e,t,n),e=e.sibling;e!==null;)aa(e,t,n),e=e.sibling}var Nt=null,wn=!1;function go(e,t,n){for(n=n.child;n!==null;)Bc(e,t,n),n=n.sibling}function Bc(e,t,n){if(Rt&&typeof Rt.onCommitFiberUnmount=="function")try{Rt.onCommitFiberUnmount(Un,n)}catch{}switch(n.tag){case 5:Ot||Mr(n,t);case 6:var o=Nt,l=wn;Nt=null,go(e,t,n),Nt=o,wn=l,Nt!==null&&(wn?(e=Nt,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Nt.removeChild(n.stateNode));break;case 18:Nt!==null&&(wn?(e=Nt,n=n.stateNode,e.nodeType===8?bi(e.parentNode,n):e.nodeType===1&&bi(e,n),ao(e)):bi(Nt,n.stateNode));break;case 4:o=Nt,l=wn,Nt=n.stateNode.containerInfo,wn=!0,go(e,t,n),Nt=o,wn=l;break;case 0:case 11:case 14:case 15:if(!Ot&&(o=n.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){l=o=o.next;do{var s=l,c=s.destroy;s=s.tag,c!==void 0&&((s&2)!==0||(s&4)!==0)&&la(n,t,c),l=l.next}while(l!==o)}go(e,t,n);break;case 1:if(!Ot&&(Mr(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=n.memoizedProps,o.state=n.memoizedState,o.componentWillUnmount()}catch(y){ct(n,t,y)}go(e,t,n);break;case 21:go(e,t,n);break;case 22:n.mode&1?(Ot=(o=Ot)||n.memoizedState!==null,go(e,t,n),Ot=o):go(e,t,n);break;default:go(e,t,n)}}function Ac(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new tm),t.forEach(function(o){var l=dm.bind(null,e,o);n.has(o)||(n.add(o),o.then(l,l))})}}function kn(e,t){var n=t.deletions;if(n!==null)for(var o=0;o<n.length;o++){var l=n[o];try{var s=e,c=t,y=c;e:for(;y!==null;){switch(y.tag){case 5:Nt=y.stateNode,wn=!1;break e;case 3:Nt=y.stateNode.containerInfo,wn=!0;break e;case 4:Nt=y.stateNode.containerInfo,wn=!0;break e}y=y.return}if(Nt===null)throw Error(u(160));Bc(s,c,l),Nt=null,wn=!1;var k=l.alternate;k!==null&&(k.return=null),l.return=null}catch(R){ct(l,t,R)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Yc(t,e),t=t.sibling}function Yc(e,t){var n=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(kn(t,e),Dn(e),o&4){try{bl(3,e,e.return),Ss(3,e)}catch(ue){ct(e,e.return,ue)}try{bl(5,e,e.return)}catch(ue){ct(e,e.return,ue)}}break;case 1:kn(t,e),Dn(e),o&512&&n!==null&&Mr(n,n.return);break;case 5:if(kn(t,e),Dn(e),o&512&&n!==null&&Mr(n,n.return),e.flags&32){var l=e.stateNode;try{jt(l,"")}catch(ue){ct(e,e.return,ue)}}if(o&4&&(l=e.stateNode,l!=null)){var s=e.memoizedProps,c=n!==null?n.memoizedProps:s,y=e.type,k=e.updateQueue;if(e.updateQueue=null,k!==null)try{y==="input"&&s.type==="radio"&&s.name!=null&&jo(l,s),Lo(y,c);var R=Lo(y,s);for(c=0;c<k.length;c+=2){var U=k[c],G=k[c+1];U==="style"?zl(l,G):U==="dangerouslySetInnerHTML"?$l(l,G):U==="children"?jt(l,G):Q(l,U,G,R)}switch(y){case"input":er(l,s);break;case"textarea":Nn(l,s);break;case"select":var H=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!s.multiple;var oe=s.value;oe!=null?Pt(l,!!s.multiple,oe,!1):H!==!!s.multiple&&(s.defaultValue!=null?Pt(l,!!s.multiple,s.defaultValue,!0):Pt(l,!!s.multiple,s.multiple?[]:"",!1))}l[cl]=s}catch(ue){ct(e,e.return,ue)}}break;case 6:if(kn(t,e),Dn(e),o&4){if(e.stateNode===null)throw Error(u(162));l=e.stateNode,s=e.memoizedProps;try{l.nodeValue=s}catch(ue){ct(e,e.return,ue)}}break;case 3:if(kn(t,e),Dn(e),o&4&&n!==null&&n.memoizedState.isDehydrated)try{ao(t.containerInfo)}catch(ue){ct(e,e.return,ue)}break;case 4:kn(t,e),Dn(e);break;case 13:kn(t,e),Dn(e),l=e.child,l.flags&8192&&(s=l.memoizedState!==null,l.stateNode.isHidden=s,!s||l.alternate!==null&&l.alternate.memoizedState!==null||(da=nt())),o&4&&Ac(e);break;case 22:if(U=n!==null&&n.memoizedState!==null,e.mode&1?(Ot=(R=Ot)||U,kn(t,e),Ot=R):kn(t,e),Dn(e),o&8192){if(R=e.memoizedState!==null,(e.stateNode.isHidden=R)&&!U&&(e.mode&1)!==0)for(re=e,U=e.child;U!==null;){for(G=re=U;re!==null;){switch(H=re,oe=H.child,H.tag){case 0:case 11:case 14:case 15:bl(4,H,H.return);break;case 1:Mr(H,H.return);var ae=H.stateNode;if(typeof ae.componentWillUnmount=="function"){o=H,n=H.return;try{t=o,ae.props=t.memoizedProps,ae.state=t.memoizedState,ae.componentWillUnmount()}catch(ue){ct(o,n,ue)}}break;case 5:Mr(H,H.return);break;case 22:if(H.memoizedState!==null){Uc(G);continue}}oe!==null?(oe.return=H,re=oe):Uc(G)}U=U.sibling}e:for(U=null,G=e;;){if(G.tag===5){if(U===null){U=G;try{l=G.stateNode,R?(s=l.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(y=G.stateNode,k=G.memoizedProps.style,c=k!=null&&k.hasOwnProperty("display")?k.display:null,y.style.display=or("display",c))}catch(ue){ct(e,e.return,ue)}}}else if(G.tag===6){if(U===null)try{G.stateNode.nodeValue=R?"":G.memoizedProps}catch(ue){ct(e,e.return,ue)}}else if((G.tag!==22&&G.tag!==23||G.memoizedState===null||G===e)&&G.child!==null){G.child.return=G,G=G.child;continue}if(G===e)break e;for(;G.sibling===null;){if(G.return===null||G.return===e)break e;U===G&&(U=null),G=G.return}U===G&&(U=null),G.sibling.return=G.return,G=G.sibling}}break;case 19:kn(t,e),Dn(e),o&4&&Ac(e);break;case 21:break;default:kn(t,e),Dn(e)}}function Dn(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Dc(n)){var o=n;break e}n=n.return}throw Error(u(160))}switch(o.tag){case 5:var l=o.stateNode;o.flags&32&&(jt(l,""),o.flags&=-33);var s=Fc(e);aa(e,s,l);break;case 3:case 4:var c=o.stateNode.containerInfo,y=Fc(e);ia(e,y,c);break;default:throw Error(u(161))}}catch(k){ct(e,e.return,k)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function om(e,t,n){re=e,Wc(e)}function Wc(e,t,n){for(var o=(e.mode&1)!==0;re!==null;){var l=re,s=l.child;if(l.tag===22&&o){var c=l.memoizedState!==null||ks;if(!c){var y=l.alternate,k=y!==null&&y.memoizedState!==null||Ot;y=ks;var R=Ot;if(ks=c,(Ot=k)&&!R)for(re=l;re!==null;)c=re,k=c.child,c.tag===22&&c.memoizedState!==null?Xc(l):k!==null?(k.return=c,re=k):Xc(l);for(;s!==null;)re=s,Wc(s),s=s.sibling;re=l,ks=y,Ot=R}Hc(e)}else(l.subtreeFlags&8772)!==0&&s!==null?(s.return=l,re=s):Hc(e)}}function Hc(e){for(;re!==null;){var t=re;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Ot||Ss(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!Ot)if(n===null)o.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:bn(t.type,n.memoizedProps);o.componentDidUpdate(l,n.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var s=t.updateQueue;s!==null&&Uu(t,s,o);break;case 3:var c=t.updateQueue;if(c!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Uu(t,c,n)}break;case 5:var y=t.stateNode;if(n===null&&t.flags&4){n=y;var k=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":k.autoFocus&&n.focus();break;case"img":k.src&&(n.src=k.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var R=t.alternate;if(R!==null){var U=R.memoizedState;if(U!==null){var G=U.dehydrated;G!==null&&ao(G)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(u(163))}Ot||t.flags&512&&sa(t)}catch(H){ct(t,t.return,H)}}if(t===e){re=null;break}if(n=t.sibling,n!==null){n.return=t.return,re=n;break}re=t.return}}function Uc(e){for(;re!==null;){var t=re;if(t===e){re=null;break}var n=t.sibling;if(n!==null){n.return=t.return,re=n;break}re=t.return}}function Xc(e){for(;re!==null;){var t=re;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ss(4,t)}catch(k){ct(t,n,k)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var l=t.return;try{o.componentDidMount()}catch(k){ct(t,l,k)}}var s=t.return;try{sa(t)}catch(k){ct(t,s,k)}break;case 5:var c=t.return;try{sa(t)}catch(k){ct(t,c,k)}}}catch(k){ct(t,t.return,k)}if(t===e){re=null;break}var y=t.sibling;if(y!==null){y.return=t.return,re=y;break}re=t.return}}var rm=Math.ceil,Cs=ce.ReactCurrentDispatcher,ua=ce.ReactCurrentOwner,mn=ce.ReactCurrentBatchConfig,Ye=0,wt=null,ht=null,Lt=0,rn=0,$r=fo(0),vt=0,wl=null,Vo=0,js=0,ca=0,kl=null,Vt=null,da=0,zr=1/0,no=null,Es=!1,fa=null,yo=null,Ns=!1,vo=null,Ls=0,Sl=0,ma=null,Ts=-1,Ps=0;function Bt(){return(Ye&6)!==0?nt():Ts!==-1?Ts:Ts=nt()}function xo(e){return(e.mode&1)===0?1:(Ye&2)!==0&&Lt!==0?Lt&-Lt:Af.transition!==null?(Ps===0&&(Ps=Jr()),Ps):(e=Fe,e!==0||(e=window.event,e=e===void 0?16:D(e.type)),e)}function Sn(e,t,n,o){if(50<Sl)throw Sl=0,ma=null,Error(u(185));$o(e,n,o),((Ye&2)===0||e!==wt)&&(e===wt&&((Ye&2)===0&&(js|=n),vt===4&&bo(e,Lt)),Qt(e,o),n===1&&Ye===0&&(t.mode&1)===0&&(zr=nt()+500,ls&&_o()))}function Qt(e,t){var n=e.callbackNode;Wl(e,t);var o=Pn(e,e===wt?Lt:0);if(o===0)n!==null&&an(n),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(n!=null&&an(n),t===1)e.tag===0?Bf(Qc.bind(null,e)):Iu(Qc.bind(null,e)),zf(function(){(Ye&6)===0&&_o()}),n=null;else{switch(Ve(o)){case 1:n=Kr;break;case 4:n=ur;break;case 16:n=Ro;break;case 536870912:n=Zr;break;default:n=Ro}n=nd(n,Vc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Vc(e,t){if(Ts=-1,Ps=0,(Ye&6)!==0)throw Error(u(327));var n=e.callbackNode;if(Or()&&e.callbackNode!==n)return null;var o=Pn(e,e===wt?Lt:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=Rs(e,o);else{t=o;var l=Ye;Ye|=2;var s=Kc();(wt!==e||Lt!==t)&&(no=null,zr=nt()+500,Go(e,t));do try{im();break}catch(y){Gc(e,y)}while(!0);Pi(),Cs.current=s,Ye=l,ht!==null?t=0:(wt=null,Lt=0,t=vt)}if(t!==0){if(t===2&&(l=so(e),l!==0&&(o=l,t=_a(e,l))),t===1)throw n=wl,Go(e,0),bo(e,o),Qt(e,nt()),n;if(t===6)bo(e,o);else{if(l=e.current.alternate,(o&30)===0&&!lm(l)&&(t=Rs(e,o),t===2&&(s=so(e),s!==0&&(o=s,t=_a(e,s))),t===1))throw n=wl,Go(e,0),bo(e,o),Qt(e,nt()),n;switch(e.finishedWork=l,e.finishedLanes=o,t){case 0:case 1:throw Error(u(345));case 2:Ko(e,Vt,no);break;case 3:if(bo(e,o),(o&130023424)===o&&(t=da+500-nt(),10<t)){if(Pn(e,0)!==0)break;if(l=e.suspendedLanes,(l&o)!==o){Bt(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=xi(Ko.bind(null,e,Vt,no),t);break}Ko(e,Vt,no);break;case 4:if(bo(e,o),(o&4194240)===o)break;for(t=e.eventTimes,l=-1;0<o;){var c=31-Jt(o);s=1<<c,c=t[c],c>l&&(l=c),o&=~s}if(o=l,o=nt()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*rm(o/1960))-o,10<o){e.timeoutHandle=xi(Ko.bind(null,e,Vt,no),o);break}Ko(e,Vt,no);break;case 5:Ko(e,Vt,no);break;default:throw Error(u(329))}}}return Qt(e,nt()),e.callbackNode===n?Vc.bind(null,e):null}function _a(e,t){var n=kl;return e.current.memoizedState.isDehydrated&&(Go(e,t).flags|=256),e=Rs(e,t),e!==2&&(t=Vt,Vt=n,t!==null&&pa(t)),e}function pa(e){Vt===null?Vt=e:Vt.push.apply(Vt,e)}function lm(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var o=0;o<n.length;o++){var l=n[o],s=l.getSnapshot;l=l.value;try{if(!vn(s(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function bo(e,t){for(t&=~ca,t&=~js,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Jt(t),o=1<<n;e[n]=-1,t&=~o}}function Qc(e){if((Ye&6)!==0)throw Error(u(327));Or();var t=Pn(e,0);if((t&1)===0)return Qt(e,nt()),null;var n=Rs(e,t);if(e.tag!==0&&n===2){var o=so(e);o!==0&&(t=o,n=_a(e,o))}if(n===1)throw n=wl,Go(e,0),bo(e,t),Qt(e,nt()),n;if(n===6)throw Error(u(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Ko(e,Vt,no),Qt(e,nt()),null}function ha(e,t){var n=Ye;Ye|=1;try{return e(t)}finally{Ye=n,Ye===0&&(zr=nt()+500,ls&&_o())}}function Qo(e){vo!==null&&vo.tag===0&&(Ye&6)===0&&Or();var t=Ye;Ye|=1;var n=mn.transition,o=Fe;try{if(mn.transition=null,Fe=1,e)return e()}finally{Fe=o,mn.transition=n,Ye=t,(Ye&6)===0&&_o()}}function ga(){rn=$r.current,tt($r)}function Go(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,$f(n)),ht!==null)for(n=ht.return;n!==null;){var o=n;switch(ji(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&os();break;case 3:Rr(),tt(Ht),tt(Mt),Fi();break;case 5:Oi(o);break;case 4:Rr();break;case 13:tt(it);break;case 19:tt(it);break;case 10:Ri(o.type._context);break;case 22:case 23:ga()}n=n.return}if(wt=e,ht=e=wo(e.current,null),Lt=rn=t,vt=0,wl=null,ca=js=Vo=0,Vt=kl=null,Ho!==null){for(t=0;t<Ho.length;t++)if(n=Ho[t],o=n.interleaved,o!==null){n.interleaved=null;var l=o.next,s=n.pending;if(s!==null){var c=s.next;s.next=l,o.next=c}n.pending=o}Ho=null}return e}function Gc(e,t){do{var n=ht;try{if(Pi(),ps.current=vs,hs){for(var o=at.memoizedState;o!==null;){var l=o.queue;l!==null&&(l.pending=null),o=o.next}hs=!1}if(Xo=0,bt=yt=at=null,hl=!1,gl=0,ua.current=null,n===null||n.return===null){vt=1,wl=t,ht=null;break}e:{var s=e,c=n.return,y=n,k=t;if(t=Lt,y.flags|=32768,k!==null&&typeof k=="object"&&typeof k.then=="function"){var R=k,U=y,G=U.tag;if((U.mode&1)===0&&(G===0||G===11||G===15)){var H=U.alternate;H?(U.updateQueue=H.updateQueue,U.memoizedState=H.memoizedState,U.lanes=H.lanes):(U.updateQueue=null,U.memoizedState=null)}var oe=xc(c);if(oe!==null){oe.flags&=-257,bc(oe,c,y,s,t),oe.mode&1&&vc(s,R,t),t=oe,k=R;var ae=t.updateQueue;if(ae===null){var ue=new Set;ue.add(k),t.updateQueue=ue}else ae.add(k);break e}else{if((t&1)===0){vc(s,R,t),ya();break e}k=Error(u(426))}}else if(lt&&y.mode&1){var ft=xc(c);if(ft!==null){(ft.flags&65536)===0&&(ft.flags|=256),bc(ft,c,y,s,t),Li(Ir(k,y));break e}}s=k=Ir(k,y),vt!==4&&(vt=2),kl===null?kl=[s]:kl.push(s),s=c;do{switch(s.tag){case 3:s.flags|=65536,t&=-t,s.lanes|=t;var E=gc(s,k,t);Hu(s,E);break e;case 1:y=k;var S=s.type,L=s.stateNode;if((s.flags&128)===0&&(typeof S.getDerivedStateFromError=="function"||L!==null&&typeof L.componentDidCatch=="function"&&(yo===null||!yo.has(L)))){s.flags|=65536,t&=-t,s.lanes|=t;var K=yc(s,y,t);Hu(s,K);break e}}s=s.return}while(s!==null)}Jc(n)}catch(fe){t=fe,ht===n&&n!==null&&(ht=n=n.return);continue}break}while(!0)}function Kc(){var e=Cs.current;return Cs.current=vs,e===null?vs:e}function ya(){(vt===0||vt===3||vt===2)&&(vt=4),wt===null||(Vo&268435455)===0&&(js&268435455)===0||bo(wt,Lt)}function Rs(e,t){var n=Ye;Ye|=2;var o=Kc();(wt!==e||Lt!==t)&&(no=null,Go(e,t));do try{sm();break}catch(l){Gc(e,l)}while(!0);if(Pi(),Ye=n,Cs.current=o,ht!==null)throw Error(u(261));return wt=null,Lt=0,vt}function sm(){for(;ht!==null;)Zc(ht)}function im(){for(;ht!==null&&!Al();)Zc(ht)}function Zc(e){var t=td(e.alternate,e,rn);e.memoizedProps=e.pendingProps,t===null?Jc(e):ht=t,ua.current=null}function Jc(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=qf(n,t,rn),n!==null){ht=n;return}}else{if(n=em(n,t),n!==null){n.flags&=32767,ht=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{vt=6,ht=null;return}}if(t=t.sibling,t!==null){ht=t;return}ht=t=e}while(t!==null);vt===0&&(vt=5)}function Ko(e,t,n){var o=Fe,l=mn.transition;try{mn.transition=null,Fe=1,am(e,t,n,o)}finally{mn.transition=l,Fe=o}return null}function am(e,t,n,o){do Or();while(vo!==null);if((Ye&6)!==0)throw Error(u(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(u(177));e.callbackNode=null,e.callbackPriority=0;var s=n.lanes|n.childLanes;if(Hl(e,s),e===wt&&(ht=wt=null,Lt=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||Ns||(Ns=!0,nd(Ro,function(){return Or(),null})),s=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||s){s=mn.transition,mn.transition=null;var c=Fe;Fe=1;var y=Ye;Ye|=4,ua.current=null,nm(e,n),Yc(n,e),Nf(yi),Fo=!!gi,yi=gi=null,e.current=n,om(n),ro(),Ye=y,Fe=c,mn.transition=s}else e.current=n;if(Ns&&(Ns=!1,vo=e,Ls=l),s=e.pendingLanes,s===0&&(yo=null),cr(n.stateNode),Qt(e,nt()),t!==null)for(o=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],o(l.value,{componentStack:l.stack,digest:l.digest});if(Es)throw Es=!1,e=fa,fa=null,e;return(Ls&1)!==0&&e.tag!==0&&Or(),s=e.pendingLanes,(s&1)!==0?e===ma?Sl++:(Sl=0,ma=e):Sl=0,_o(),null}function Or(){if(vo!==null){var e=Ve(Ls),t=mn.transition,n=Fe;try{if(mn.transition=null,Fe=16>e?16:e,vo===null)var o=!1;else{if(e=vo,vo=null,Ls=0,(Ye&6)!==0)throw Error(u(331));var l=Ye;for(Ye|=4,re=e.current;re!==null;){var s=re,c=s.child;if((re.flags&16)!==0){var y=s.deletions;if(y!==null){for(var k=0;k<y.length;k++){var R=y[k];for(re=R;re!==null;){var U=re;switch(U.tag){case 0:case 11:case 15:bl(8,U,s)}var G=U.child;if(G!==null)G.return=U,re=G;else for(;re!==null;){U=re;var H=U.sibling,oe=U.return;if(Oc(U),U===R){re=null;break}if(H!==null){H.return=oe,re=H;break}re=oe}}}var ae=s.alternate;if(ae!==null){var ue=ae.child;if(ue!==null){ae.child=null;do{var ft=ue.sibling;ue.sibling=null,ue=ft}while(ue!==null)}}re=s}}if((s.subtreeFlags&2064)!==0&&c!==null)c.return=s,re=c;else e:for(;re!==null;){if(s=re,(s.flags&2048)!==0)switch(s.tag){case 0:case 11:case 15:bl(9,s,s.return)}var E=s.sibling;if(E!==null){E.return=s.return,re=E;break e}re=s.return}}var S=e.current;for(re=S;re!==null;){c=re;var L=c.child;if((c.subtreeFlags&2064)!==0&&L!==null)L.return=c,re=L;else e:for(c=S;re!==null;){if(y=re,(y.flags&2048)!==0)try{switch(y.tag){case 0:case 11:case 15:Ss(9,y)}}catch(fe){ct(y,y.return,fe)}if(y===c){re=null;break e}var K=y.sibling;if(K!==null){K.return=y.return,re=K;break e}re=y.return}}if(Ye=l,_o(),Rt&&typeof Rt.onPostCommitFiberRoot=="function")try{Rt.onPostCommitFiberRoot(Un,e)}catch{}o=!0}return o}finally{Fe=n,mn.transition=t}}return!1}function qc(e,t,n){t=Ir(n,t),t=gc(e,t,1),e=ho(e,t,1),t=Bt(),e!==null&&($o(e,1,t),Qt(e,t))}function ct(e,t,n){if(e.tag===3)qc(e,e,n);else for(;t!==null;){if(t.tag===3){qc(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(yo===null||!yo.has(o))){e=Ir(n,e),e=yc(t,e,1),t=ho(t,e,1),e=Bt(),t!==null&&($o(t,1,e),Qt(t,e));break}}t=t.return}}function um(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),t=Bt(),e.pingedLanes|=e.suspendedLanes&n,wt===e&&(Lt&n)===n&&(vt===4||vt===3&&(Lt&130023424)===Lt&&500>nt()-da?Go(e,0):ca|=n),Qt(e,t)}function ed(e,t){t===0&&((e.mode&1)===0?t=1:(t=Dt,Dt<<=1,(Dt&130023424)===0&&(Dt=4194304)));var n=Bt();e=qn(e,t),e!==null&&($o(e,t,n),Qt(e,n))}function cm(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),ed(e,n)}function dm(e,t){var n=0;switch(e.tag){case 13:var o=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(u(314))}o!==null&&o.delete(t),ed(e,n)}var td;td=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Ht.current)Xt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return Xt=!1,Jf(e,t,n);Xt=(e.flags&131072)!==0}else Xt=!1,lt&&(t.flags&1048576)!==0&&Mu(t,is,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;ws(e,t),e=t.pendingProps;var l=Cr(t,Mt.current);Pr(t,n),l=Yi(null,t,o,e,l,n);var s=Wi();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Ut(o)?(s=!0,rs(t)):s=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,$i(t),l.updater=xs,t.stateNode=l,l._reactInternals=t,Gi(t,o,e,n),t=qi(null,t,o,!0,s,n)):(t.tag=0,lt&&s&&Ci(t),Ft(null,t,l,n),t=t.child),t;case 16:o=t.elementType;e:{switch(ws(e,t),e=t.pendingProps,l=o._init,o=l(o._payload),t.type=o,l=t.tag=mm(o),e=bn(o,e),l){case 0:t=Ji(null,t,o,e,n);break e;case 1:t=Ec(null,t,o,e,n);break e;case 11:t=wc(null,t,o,e,n);break e;case 14:t=kc(null,t,o,bn(o.type,e),n);break e}throw Error(u(306,o,""))}return t;case 0:return o=t.type,l=t.pendingProps,l=t.elementType===o?l:bn(o,l),Ji(e,t,o,l,n);case 1:return o=t.type,l=t.pendingProps,l=t.elementType===o?l:bn(o,l),Ec(e,t,o,l,n);case 3:e:{if(Nc(t),e===null)throw Error(u(387));o=t.pendingProps,s=t.memoizedState,l=s.element,Wu(e,t),ms(t,o,null,n);var c=t.memoizedState;if(o=c.element,s.isDehydrated)if(s={element:o,isDehydrated:!1,cache:c.cache,pendingSuspenseBoundaries:c.pendingSuspenseBoundaries,transitions:c.transitions},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){l=Ir(Error(u(423)),t),t=Lc(e,t,o,n,l);break e}else if(o!==l){l=Ir(Error(u(424)),t),t=Lc(e,t,o,n,l);break e}else for(on=co(t.stateNode.containerInfo.firstChild),nn=t,lt=!0,xn=null,n=Au(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Nr(),o===l){t=to(e,t,n);break e}Ft(e,t,o,n)}t=t.child}return t;case 5:return Xu(t),e===null&&Ni(t),o=t.type,l=t.pendingProps,s=e!==null?e.memoizedProps:null,c=l.children,vi(o,l)?c=null:s!==null&&vi(o,s)&&(t.flags|=32),jc(e,t),Ft(e,t,c,n),t.child;case 6:return e===null&&Ni(t),null;case 13:return Tc(e,t,n);case 4:return zi(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Lr(t,null,o,n):Ft(e,t,o,n),t.child;case 11:return o=t.type,l=t.pendingProps,l=t.elementType===o?l:bn(o,l),wc(e,t,o,l,n);case 7:return Ft(e,t,t.pendingProps,n),t.child;case 8:return Ft(e,t,t.pendingProps.children,n),t.child;case 12:return Ft(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(o=t.type._context,l=t.pendingProps,s=t.memoizedProps,c=l.value,Je(cs,o._currentValue),o._currentValue=c,s!==null)if(vn(s.value,c)){if(s.children===l.children&&!Ht.current){t=to(e,t,n);break e}}else for(s=t.child,s!==null&&(s.return=t);s!==null;){var y=s.dependencies;if(y!==null){c=s.child;for(var k=y.firstContext;k!==null;){if(k.context===o){if(s.tag===1){k=eo(-1,n&-n),k.tag=2;var R=s.updateQueue;if(R!==null){R=R.shared;var U=R.pending;U===null?k.next=k:(k.next=U.next,U.next=k),R.pending=k}}s.lanes|=n,k=s.alternate,k!==null&&(k.lanes|=n),Ii(s.return,n,t),y.lanes|=n;break}k=k.next}}else if(s.tag===10)c=s.type===t.type?null:s.child;else if(s.tag===18){if(c=s.return,c===null)throw Error(u(341));c.lanes|=n,y=c.alternate,y!==null&&(y.lanes|=n),Ii(c,n,t),c=s.sibling}else c=s.child;if(c!==null)c.return=s;else for(c=s;c!==null;){if(c===t){c=null;break}if(s=c.sibling,s!==null){s.return=c.return,c=s;break}c=c.return}s=c}Ft(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,o=t.pendingProps.children,Pr(t,n),l=dn(l),o=o(l),t.flags|=1,Ft(e,t,o,n),t.child;case 14:return o=t.type,l=bn(o,t.pendingProps),l=bn(o.type,l),kc(e,t,o,l,n);case 15:return Sc(e,t,t.type,t.pendingProps,n);case 17:return o=t.type,l=t.pendingProps,l=t.elementType===o?l:bn(o,l),ws(e,t),t.tag=1,Ut(o)?(e=!0,rs(t)):e=!1,Pr(t,n),pc(t,o,l),Gi(t,o,l,n),qi(null,t,o,!0,e,n);case 19:return Rc(e,t,n);case 22:return Cc(e,t,n)}throw Error(u(156,t.tag))};function nd(e,t){return ar(e,t)}function fm(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _n(e,t,n,o){return new fm(e,t,n,o)}function va(e){return e=e.prototype,!(!e||!e.isReactComponent)}function mm(e){if(typeof e=="function")return va(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Te)return 11;if(e===ye)return 14}return 2}function wo(e,t){var n=e.alternate;return n===null?(n=_n(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Is(e,t,n,o,l,s){var c=2;if(o=e,typeof e=="function")va(e)&&(c=1);else if(typeof e=="string")c=5;else e:switch(e){case J:return Zo(n.children,l,s,t);case ee:c=8,l|=8;break;case we:return e=_n(12,n,t,l|2),e.elementType=we,e.lanes=s,e;case T:return e=_n(13,n,t,l),e.elementType=T,e.lanes=s,e;case Ce:return e=_n(19,n,t,l),e.elementType=Ce,e.lanes=s,e;case Ie:return Ms(n,l,s,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case X:c=10;break e;case Ke:c=9;break e;case Te:c=11;break e;case ye:c=14;break e;case We:c=16,o=null;break e}throw Error(u(130,e==null?e:typeof e,""))}return t=_n(c,n,t,l),t.elementType=e,t.type=o,t.lanes=s,t}function Zo(e,t,n,o){return e=_n(7,e,o,t),e.lanes=n,e}function Ms(e,t,n,o){return e=_n(22,e,o,t),e.elementType=Ie,e.lanes=n,e.stateNode={isHidden:!1},e}function xa(e,t,n){return e=_n(6,e,null,t),e.lanes=n,e}function ba(e,t,n){return t=_n(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function _m(e,t,n,o,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Mo(0),this.expirationTimes=Mo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Mo(0),this.identifierPrefix=o,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function wa(e,t,n,o,l,s,c,y,k){return e=new _m(e,t,n,y,k),t===1?(t=1,s===!0&&(t|=8)):t=0,s=_n(3,null,null,t),e.current=s,s.stateNode=e,s.memoizedState={element:o,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},$i(s),e}function pm(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ne,key:o==null?null:""+o,children:e,containerInfo:t,implementation:n}}function od(e){if(!e)return mo;e=e._reactInternals;e:{if(dt(e)!==e||e.tag!==1)throw Error(u(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Ut(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(u(171))}if(e.tag===1){var n=e.type;if(Ut(n))return Pu(e,n,t)}return t}function rd(e,t,n,o,l,s,c,y,k){return e=wa(n,o,!0,e,l,s,c,y,k),e.context=od(null),n=e.current,o=Bt(),l=xo(n),s=eo(o,l),s.callback=t??null,ho(n,s,l),e.current.lanes=l,$o(e,l,o),Qt(e,o),e}function $s(e,t,n,o){var l=t.current,s=Bt(),c=xo(l);return n=od(n),t.context===null?t.context=n:t.pendingContext=n,t=eo(s,c),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=ho(l,t,c),e!==null&&(Sn(e,l,c,s),fs(e,l,c)),c}function zs(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function ld(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ka(e,t){ld(e,t),(e=e.alternate)&&ld(e,t)}function hm(){return null}var sd=typeof reportError=="function"?reportError:function(e){console.error(e)};function Sa(e){this._internalRoot=e}Os.prototype.render=Sa.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(u(409));$s(e,t,null,null)},Os.prototype.unmount=Sa.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Qo(function(){$s(null,e,null,null)}),t[Gn]=null}};function Os(e){this._internalRoot=e}Os.prototype.unstable_scheduleHydration=function(e){if(e){var t=el();e={blockedOn:null,target:e,priority:t};for(var n=0;n<qt.length&&t!==0&&t<qt[n].priority;n++);qt.splice(n,0,e),n===0&&_r(e)}};function Ca(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ds(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function id(){}function gm(e,t,n,o,l){if(l){if(typeof o=="function"){var s=o;o=function(){var R=zs(c);s.call(R)}}var c=rd(t,o,e,0,null,!1,!1,"",id);return e._reactRootContainer=c,e[Gn]=c.current,al(e.nodeType===8?e.parentNode:e),Qo(),c}for(;l=e.lastChild;)e.removeChild(l);if(typeof o=="function"){var y=o;o=function(){var R=zs(k);y.call(R)}}var k=wa(e,0,!1,null,null,!1,!1,"",id);return e._reactRootContainer=k,e[Gn]=k.current,al(e.nodeType===8?e.parentNode:e),Qo(function(){$s(t,k,n,o)}),k}function Fs(e,t,n,o,l){var s=n._reactRootContainer;if(s){var c=s;if(typeof l=="function"){var y=l;l=function(){var k=zs(c);y.call(k)}}$s(t,c,e,l)}else c=gm(n,t,e,l,o);return zs(c)}qr=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=yn(t.pendingLanes);n!==0&&(fr(t,n|1),Qt(t,nt()),(Ye&6)===0&&(zr=nt()+500,_o()))}break;case 13:Qo(function(){var o=qn(e,1);if(o!==null){var l=Bt();Sn(o,e,1,l)}}),ka(e,1)}},mr=function(e){if(e.tag===13){var t=qn(e,134217728);if(t!==null){var n=Bt();Sn(t,e,134217728,n)}ka(e,134217728)}},Ul=function(e){if(e.tag===13){var t=xo(e),n=qn(e,t);if(n!==null){var o=Bt();Sn(n,e,t,o)}ka(e,t)}},el=function(){return Fe},zo=function(e,t){var n=Fe;try{return Fe=e,t()}finally{Fe=n}},Xr=function(e,t,n){switch(t){case"input":if(er(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var l=ns(o);if(!l)throw Error(u(90));Yr(o),er(o,l)}}}break;case"textarea":Nn(e,n);break;case"select":t=n.value,t!=null&&Pt(e,!!n.multiple,t,!1)}},Hn=ha,Zt=Qo;var ym={usingClientEntryPoint:!1,Events:[dl,kr,ns,Wn,st,ha]},Cl={findFiberByHostInstance:Bo,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},vm={bundleType:Cl.bundleType,version:Cl.version,rendererPackageName:Cl.rendererPackageName,rendererConfig:Cl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ce.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Tn(e),e===null?null:e.stateNode},findFiberByHostInstance:Cl.findFiberByHostInstance||hm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Bs=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Bs.isDisabled&&Bs.supportsFiber)try{Un=Bs.inject(vm),Rt=Bs}catch{}}return Gt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ym,Gt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ca(t))throw Error(u(200));return pm(e,t,null,n)},Gt.createRoot=function(e,t){if(!Ca(e))throw Error(u(299));var n=!1,o="",l=sd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=wa(e,1,!1,null,null,n,!1,o,l),e[Gn]=t.current,al(e.nodeType===8?e.parentNode:e),new Sa(t)},Gt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(u(188)):(e=Object.keys(e).join(","),Error(u(268,e)));return e=Tn(t),e=e===null?null:e.stateNode,e},Gt.flushSync=function(e){return Qo(e)},Gt.hydrate=function(e,t,n){if(!Ds(t))throw Error(u(200));return Fs(null,e,t,!0,n)},Gt.hydrateRoot=function(e,t,n){if(!Ca(e))throw Error(u(405));var o=n!=null&&n.hydratedSources||null,l=!1,s="",c=sd;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(c=n.onRecoverableError)),t=rd(t,null,e,1,n??null,l,!1,s,c),e[Gn]=t.current,al(e),o)for(e=0;e<o.length;e++)n=o[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Os(t)},Gt.render=function(e,t,n){if(!Ds(t))throw Error(u(200));return Fs(null,e,t,!1,n)},Gt.unmountComponentAtNode=function(e){if(!Ds(e))throw Error(u(40));return e._reactRootContainer?(Qo(function(){Fs(null,null,e,!1,function(){e._reactRootContainer=null,e[Gn]=null})}),!0):!1},Gt.unstable_batchedUpdates=ha,Gt.unstable_renderSubtreeIntoContainer=function(e,t,n,o){if(!Ds(n))throw Error(u(200));if(e==null||e._reactInternals===void 0)throw Error(u(38));return Fs(e,t,n,!1,o)},Gt.version="18.3.1-next-f1338f8080-20240426",Gt}var pd;function Hd(){if(pd)return Na.exports;pd=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(a){console.error(a)}}return r(),Na.exports=jm(),Na.exports}var hd;function Em(){if(hd)return As;hd=1;var r=Hd();return As.createRoot=r.createRoot,As.hydrateRoot=r.hydrateRoot,As}var Nm=Em();const Lm={},gd=r=>{let a;const u=new Set,f=($,p)=>{const x=typeof $=="function"?$(a):$;if(!Object.is(x,a)){const g=a;a=p??(typeof x!="object"||x===null)?x:Object.assign({},a,x),u.forEach(F=>F(a,g))}},v=()=>a,N={setState:f,getState:v,getInitialState:()=>V,subscribe:$=>(u.add($),()=>u.delete($)),destroy:()=>{(Lm?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),u.clear()}},V=a=r(f,v,N);return N},Tm=r=>r?gd(r):gd;var Pa={exports:{}},Ra={},Ia={exports:{}},Ma={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var yd;function Pm(){if(yd)return Ma;yd=1;var r=Ml();function a(p,x){return p===x&&(p!==0||1/p===1/x)||p!==p&&x!==x}var u=typeof Object.is=="function"?Object.is:a,f=r.useState,v=r.useEffect,_=r.useLayoutEffect,d=r.useDebugValue;function I(p,x){var g=x(),F=f({inst:{value:g,getSnapshot:x}}),P=F[0].inst,w=F[1];return _(function(){P.value=g,P.getSnapshot=x,N(P)&&w({inst:P})},[p,g,x]),v(function(){return N(P)&&w({inst:P}),p(function(){N(P)&&w({inst:P})})},[p]),d(g),g}function N(p){var x=p.getSnapshot;p=p.value;try{var g=x();return!u(p,g)}catch{return!0}}function V(p,x){return x()}var $=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?V:I;return Ma.useSyncExternalStore=r.useSyncExternalStore!==void 0?r.useSyncExternalStore:$,Ma}var vd;function Rm(){return vd||(vd=1,Ia.exports=Pm()),Ia.exports}/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xd;function Im(){if(xd)return Ra;xd=1;var r=Ml(),a=Rm();function u(V,$){return V===$&&(V!==0||1/V===1/$)||V!==V&&$!==$}var f=typeof Object.is=="function"?Object.is:u,v=a.useSyncExternalStore,_=r.useRef,d=r.useEffect,I=r.useMemo,N=r.useDebugValue;return Ra.useSyncExternalStoreWithSelector=function(V,$,p,x,g){var F=_(null);if(F.current===null){var P={hasValue:!1,value:null};F.current=P}else P=F.current;F=I(function(){function Y(ne){if(!B){if(B=!0,Q=ne,ne=x(ne),g!==void 0&&P.hasValue){var J=P.value;if(g(J,ne))return ce=J}return ce=ne}if(J=ce,f(Q,ne))return J;var ee=x(ne);return g!==void 0&&g(J,ee)?(Q=ne,J):(Q=ne,ce=ee)}var B=!1,Q,ce,ge=p===void 0?null:p;return[function(){return Y($())},ge===null?void 0:function(){return Y(ge())}]},[$,p,x,g]);var w=v(V,F[0],F[1]);return d(function(){P.hasValue=!0,P.value=w},[w]),N(w),w},Ra}var bd;function Mm(){return bd||(bd=1,Pa.exports=Im()),Pa.exports}var $m=Mm();const zm=Yd($m),Ud={},{useDebugValue:Om}=Wd,{useSyncExternalStoreWithSelector:Dm}=zm;let wd=!1;const Fm=r=>r;function Bm(r,a=Fm,u){(Ud?"production":void 0)!=="production"&&u&&!wd&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),wd=!0);const f=Dm(r.subscribe,r.getState,r.getServerState||r.getInitialState,a,u);return Om(f),f}const kd=r=>{(Ud?"production":void 0)!=="production"&&typeof r!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const a=typeof r=="function"?Tm(r):r,u=(f,v)=>Bm(a,f,v);return Object.assign(u,a),u},Am=r=>r?kd(r):kd,Ks={iphone:{w:400,h:868},ipad:{w:500,h:716},mac:{w:640,h:400},watch:{w:205,h:251},android:{w:400,h:711}},Zs={iphone:{deviceScale:92,deviceTop:15,deviceAngle:8},ipad:{deviceScale:92,deviceTop:15,deviceAngle:8},mac:{deviceScale:85,deviceTop:20,deviceAngle:0},watch:{deviceScale:80,deviceTop:22,deviceAngle:0},android:{deviceScale:92,deviceTop:15,deviceAngle:8}};function Sd(r,a,u){var _;const f=a.screens[r],v=Zs[u]??Zs.iphone;return{screenIndex:r,headline:f?f.headline:"New Screen",subtitle:f?f.subtitle??"":"",style:"minimal",layout:"center",font:a.theme.font,fontWeight:a.theme.fontWeight,headlineSize:a.theme.headlineSize??0,subtitleSize:a.theme.subtitleSize??0,headlineRotation:0,subtitleRotation:0,colors:{primary:a.theme.colors.primary,secondary:a.theme.colors.secondary,background:a.theme.colors.background,text:a.theme.colors.text,subtitle:a.theme.colors.subtitle??"#64748B"},frameId:a.frames.ios??a.frames.android??"",deviceColor:a.frames.deviceColor??"",frameStyle:a.frames.style==="3d"?"flat":a.frames.style,composition:"single",deviceScale:v.deviceScale,deviceTop:v.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:v.deviceAngle,deviceTilt:0,headlineGradient:null,subtitleGradient:null,autoSizeHeadline:!1,autoSizeSubtitle:!1,headlineLineHeight:0,headlineLetterSpacing:0,headlineTextTransform:"",headlineFontStyle:"",subtitleOpacity:0,subtitleLetterSpacing:0,subtitleTextTransform:"",spotlight:null,annotations:[],textPositions:{headline:null,subtitle:null},screenshotDataUrl:null,screenshotName:((_=f==null?void 0:f.screenshot)==null?void 0:_.split("/").pop())??null,screenshotDims:null,backgroundType:"solid",backgroundColor:"#ffffff",backgroundGradient:{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"},backgroundImageDataUrl:null,backgroundOverlay:null,deviceShadow:null,borderSimulation:null,cornerRadius:0,loupe:null,callouts:[],overlays:[],extraScreenshots:[]}}const de=Am(r=>({config:null,platform:"iphone",previewW:400,previewH:868,selectedScreen:0,activeTab:"design",locale:"default",previewBg:"dark",renderVersion:0,fonts:[],frames:[],deviceFamilies:[],koubouAvailable:!1,sizes:{},exportSize:"",exportRenderer:"playwright",screens:[],setConfig:a=>r({config:a}),setPlatform:a=>r({platform:a}),setPreviewSize:(a,u)=>r({previewW:a,previewH:u}),setSelectedScreen:a=>r({selectedScreen:a}),setActiveTab:a=>r({activeTab:a}),setLocale:a=>r({locale:a}),setPreviewBg:a=>r({previewBg:a}),setExportSize:a=>r({exportSize:a}),setExportRenderer:a=>r({exportRenderer:a}),setFonts:a=>r({fonts:a}),setFrames:a=>r({frames:a}),setDeviceFamilies:a=>r({deviceFamilies:a}),setKoubouAvailable:a=>r({koubouAvailable:a}),setSizes:a=>r({sizes:a}),updateScreen:(a,u)=>r(f=>{const v=[...f.screens],_=v[a];return _?(v[a]={..._,...u},{screens:v}):f}),triggerRender:()=>r(a=>({renderVersion:a.renderVersion+1})),initScreens:(a,u)=>{const f=a.screens.map((v,_)=>Sd(_,a,u));r({screens:f,config:a,selectedScreen:0})},addScreen:()=>r(a=>{const{screens:u,config:f,platform:v}=a;if(!f)return a;const _=u[u.length-1],d=Sd(0,f,v);return d.screenIndex=u.length,d.headline=`Screen ${u.length+1}`,d.subtitle="",_&&(d.style=_.style,d.layout=_.layout,d.font=_.font,d.fontWeight=_.fontWeight,d.colors={..._.colors},d.frameId=_.frameId,d.deviceColor=_.deviceColor,d.frameStyle=_.frameStyle,d.composition=_.composition,d.deviceScale=_.deviceScale,d.deviceTop=_.deviceTop),{screens:[...u,d],selectedScreen:u.length}}),removeScreen:a=>r(u=>{if(u.screens.length<=1)return u;const f=u.screens.filter((_,d)=>d!==a).map((_,d)=>({..._,screenIndex:d}));let v=u.selectedScreen;return v>=f.length?v=f.length-1:v>a&&v--,{screens:f,selectedScreen:v}}),moveScreen:(a,u)=>r(f=>{if(u<0||u>=f.screens.length)return f;const v=[...f.screens],[_]=v.splice(a,1);return _?(v.splice(u,0,_),{screens:v.map((d,I)=>({...d,screenIndex:I})),selectedScreen:u}):f})})),Co="";async function Xd(){const r=await fetch(`${Co}/api/config`);if(!r.ok)throw new Error(`Failed to fetch config: ${r.statusText}`);return r.json()}async function Ym(){return await fetch(`${Co}/api/reload`,{method:"POST"}),Xd()}async function Wm(r,a){const u=await fetch(`${Co}/api/preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:a});if(!u.ok)throw new Error(`Preview render failed: ${u.statusText}`);return u.text()}async function Hm(){const r=await fetch(`${Co}/api/frames`);if(!r.ok)throw new Error(`Failed to fetch frames: ${r.statusText}`);return r.json()}async function Um(){const r=await fetch(`${Co}/api/fonts`);if(!r.ok)throw new Error(`Failed to fetch fonts: ${r.statusText}`);return r.json()}async function Xm(){const r=await fetch(`${Co}/api/koubou-devices`);if(!r.ok)throw new Error(`Failed to fetch koubou devices: ${r.statusText}`);return r.json()}async function Vm(){const r=await fetch(`${Co}/api/sizes`);if(!r.ok)throw new Error(`Failed to fetch sizes: ${r.statusText}`);return r.json()}async function Qm(r){const a=await fetch(`${Co}/api/export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!a.ok)throw new Error(`Export failed: ${a.statusText}`);return a.blob()}const Gm=[{id:"design",label:"Background"},{id:"device",label:"Device"},{id:"text",label:"Text"},{id:"effects",label:"Effects"},{id:"export",label:"Export"}];function Km(){const r=de(u=>u.activeTab),a=de(u=>u.setActiveTab);return i.jsx("div",{className:"flex border-b border-border",children:Gm.map(u=>i.jsx("button",{onClick:()=>a(u.id),className:`flex-1 py-2 text-xs font-medium transition-colors ${r===u.id?"text-accent border-b-2 border-accent":"text-text-dim hover:text-text"}`,children:u.label},u.id))})}function ei(){const r=de(v=>v.selectedScreen),a=de(v=>v.screens[v.selectedScreen]),u=de(v=>v.updateScreen),f=C.useCallback(v=>{u(r,v)},[r,u]);return{screen:a,selectedScreen:r,update:f}}const Xa=new Map;function Cd(r,a){a?Xa.set(r,a):Xa.delete(r)}function Zm(r){return Xa.get(r)??null}function Ka(){const r=de(d=>d.selectedScreen),a=de(d=>d.previewW),u=C.useCallback(()=>{try{const d=Zm(r);return(d==null?void 0:d.contentDocument)??null}catch{return null}},[r]),f=C.useCallback(d=>{const I=u();if(!I)return;const N=I.querySelector(".device-wrapper");if(N){if(d.deviceScale!==void 0){const V=I.querySelector(".canvas");if(V){const $=V.getBoundingClientRect().width;if(N.dataset.origDw||(N.dataset.origDw=String(parseFloat(N.style.width)||N.getBoundingClientRect().width)),!N.dataset.origPerspective){const P=getComputedStyle(N).getPropertyValue("--device-perspective");N.dataset.origPerspective=String(parseFloat(P)||1500)}const p=parseFloat(N.dataset.origDw),x=Math.round($*d.deviceScale/100),g=x/p;N.style.width=x+"px";const F=parseFloat(N.dataset.origPerspective);N.style.setProperty("--device-perspective",Math.round(F*g)+"px"),N.querySelectorAll(".screenshot-clip").forEach(P=>{const w=P;w.dataset.origLeft||(w.dataset.origLeft=w.style.left,w.dataset.origTop=w.style.top,w.dataset.origWidth=w.style.width,w.dataset.origHeight=w.style.height,w.dataset.origBr=w.style.borderRadius||""),w.style.left=Math.round(parseFloat(w.dataset.origLeft)*g)+"px",w.style.top=Math.round(parseFloat(w.dataset.origTop)*g)+"px",w.style.width=Math.round(parseFloat(w.dataset.origWidth)*g)+"px",w.style.height=Math.round(parseFloat(w.dataset.origHeight)*g)+"px",w.dataset.origBr&&(w.style.borderRadius=Math.round(parseFloat(w.dataset.origBr)*g)+"px")})}}if(d.deviceTop!==void 0){N.style.top=d.deviceTop+"%";for(const V of[".glow-1",".glow-2",".orb-1",".orb-2",".bg-glow",".shape-1",".shape-3",".bg-shape-1"]){const $=I.querySelector(V);$&&($.style.top=d.deviceTop+"%")}}d.deviceOffsetX!==void 0&&(N.style.left=d.deviceOffsetX?`calc(50% + ${d.deviceOffsetX/100*a}px)`:"50%"),d.deviceRotation!==void 0&&N.style.setProperty("--device-rotation",`${d.deviceRotation}deg`),d.deviceAngle!==void 0&&N.style.setProperty("--device-angle",`${d.deviceAngle}deg`),d.deviceTilt!==void 0&&N.style.setProperty("--device-tilt",`${d.deviceTilt}deg`)}},[u,a]),v=C.useCallback(d=>{const I=u();if(!I)return;const N=I.querySelector(".canvas");if(N){if(d.type==="solid"&&d.color)N.style.background=d.color;else if(d.type==="gradient"&&d.colors){const V=d.colors.join(", ");d.gradientType==="radial"?N.style.background=`radial-gradient(circle at ${d.radialPosition??"center"}, ${V})`:N.style.background=`linear-gradient(${d.direction??135}deg, ${V})`}}},[u]),_=C.useCallback(d=>{const I=u();if(!I)return;const N=a/1290;if(d.headlineSize!==void 0||d.headlineRotation!==void 0){const V=I.querySelector(".headline");if(V&&(d.headlineSize!==void 0&&(V.style.fontSize=`${Math.round(d.headlineSize*N)}px`),d.headlineRotation!==void 0)){const $=["translateX(-50%)"];d.headlineRotation&&$.push(`rotate(${d.headlineRotation}deg)`),V.style.transform=$.join(" ")}}if(d.subtitleSize!==void 0||d.subtitleRotation!==void 0){const V=I.querySelector(".subtitle");if(V&&(d.subtitleSize!==void 0&&(V.style.fontSize=`${Math.round(d.subtitleSize*N)}px`),d.subtitleRotation!==void 0)){const $=["translateX(-50%)"];d.subtitleRotation&&$.push(`rotate(${d.subtitleRotation}deg)`),V.style.transform=$.join(" ")}}},[u,a]);return{patchDevice:f,patchBackground:v,patchText:_}}function mt({title:r,children:a,hidden:u}){return u?null:i.jsxs("div",{className:"px-5 py-4 border-b border-border",children:[i.jsx("div",{className:"text-[11px] uppercase tracking-wide text-text-dim mb-3",children:r}),a]})}function Tt({label:r,value:a,onChange:u,onInstant:f,presets:v,onPresetClick:_}){return i.jsxs("div",{className:"mb-2.5",children:[i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx("label",{className:"text-xs text-text-dim flex-1",children:r}),i.jsx("input",{type:"color",value:a,className:"w-8 h-8 border border-border rounded-md cursor-pointer bg-transparent p-0.5",onInput:d=>{f==null||f(d.target.value)},onChange:d=>{u(d.target.value)}})]}),v&&v.length>0&&i.jsx("div",{className:"flex flex-wrap gap-1 mt-1.5",children:v.map(d=>i.jsx("button",{className:"w-6 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform",style:{background:d},title:d,onClick:()=>{_==null||_(d),u(d)}},d))})]})}function me({label:r,value:a,min:u,max:f,step:v=1,formatValue:_,onChange:d,onInstant:I,disabled:N}){const V=_?_(a):String(a),[$,p]=C.useState(!1),[x,g]=C.useState(""),F=C.useRef(null);C.useEffect(()=>{var w;$&&((w=F.current)==null||w.select())},[$]);function P(){p(!1);const w=parseFloat(x);if(Number.isNaN(w))return;const Y=Math.min(f,Math.max(u,w)),B=Math.round(Y/v)*v;d(B)}return i.jsxs("div",{className:"mb-2.5",children:[i.jsx("label",{className:"block text-xs text-text-dim mb-1",children:r}),i.jsxs("div",{className:"flex items-center gap-2",children:[i.jsx("input",{type:"range",min:u,max:f,step:v,value:a,disabled:N,className:"w-full accent-accent",onInput:w=>{const Y=Number(w.target.value);I==null||I(Y)},onChange:w=>{d(Number(w.target.value))}}),$?i.jsx("input",{ref:F,type:"text",inputMode:"decimal",value:x,onChange:w=>g(w.target.value),onBlur:P,onKeyDown:w=>{w.key==="Enter"&&P(),w.key==="Escape"&&p(!1)},className:"text-xs text-text bg-surface border border-border rounded px-1 py-0 min-w-[40px] w-[48px] text-right shrink-0 outline-none focus:border-accent"}):i.jsx("span",{className:"text-xs text-text-dim min-w-[40px] text-right shrink-0 cursor-text hover:text-text transition-colors",onClick:()=>{N||(g(String(a)),p(!0))},children:V})]})]})}function Cn({label:r,checked:a,onChange:u}){return i.jsx("div",{className:"mb-2.5",children:i.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[i.jsx("input",{type:"checkbox",checked:a,onChange:f=>u(f.target.checked),className:"accent-accent"}),r]})})}function St({label:r,value:a,onChange:u,options:f,groups:v,hidden:_}){return _?null:i.jsxs("div",{className:"mb-2.5",children:[i.jsx("label",{className:"block text-xs text-text-dim mb-1",children:r}),i.jsxs("select",{value:a,onChange:d=>u(d.target.value),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent",children:[f==null?void 0:f.map(d=>i.jsx("option",{value:d.value,disabled:d.disabled,children:d.label},d.value)),v==null?void 0:v.map(d=>i.jsx("optgroup",{label:d.label,children:d.options.map(I=>i.jsx("option",{value:I.value,disabled:I.disabled,children:I.label},I.value))},d.label))]})]})}const Jm=["#000000","#1a1a2e","#16213e","#0f3460","#533483","#e94560","#f5f5f5","#fafafa","#2d3436","#636e72","#00b894","#00cec9","#6c5ce7","#fdcb6e","#e17055","#dfe6e9","#b2bec3","#2c3e50","#8e44ad","#2980b9"],qm=[{name:"Sunset",colors:["#ff6b35","#f7c948","#ff3864"],direction:135},{name:"Ocean",colors:["#0052d4","#4364f7","#6fb1fc"],direction:135},{name:"Midnight",colors:["#0f0c29","#302b63","#24243e"],direction:135},{name:"Sky",colors:["#2980b9","#6dd5fa","#ffffff"],direction:180},{name:"Horizon",colors:["#003973","#e5e5be","#f7a600"],direction:180},{name:"Vapor",colors:["#fc5c7d","#ce9ffc","#6a82fb"],direction:135},{name:"Tropical",colors:["#f7971e","#ffd200","#21d4fd"],direction:135},{name:"Dusk Sky",colors:["#2c3e50","#4ca1af","#c4e0e5"],direction:180},{name:"Flamingo",colors:["#ee5a24","#f0932b","#fad390"],direction:135},{name:"Arctic",colors:["#1e3c72","#2a5298","#e8f5e9"],direction:180},{name:"Velvet",colors:["#6a0572","#ab83a1","#f5e6cc"],direction:135},{name:"Lush",colors:["#004e92","#00b4db","#88d8b0"],direction:135},{name:"Aurora",colors:["#00c9ff","#92fe9d"],direction:135},{name:"Coral",colors:["#ff9a9e","#fecfef"],direction:135},{name:"Lavender",colors:["#a18cd1","#fbc2eb"],direction:135},{name:"Emerald",colors:["#11998e","#38ef7d"],direction:135},{name:"Fire",colors:["#f83600","#f9d423"],direction:135},{name:"Berry",colors:["#8e2de2","#4a00e0"],direction:135},{name:"Peach",colors:["#ffecd2","#fcb69f"],direction:135},{name:"Dusk",colors:["#2c3e50","#fd746c"],direction:135},{name:"Mint",colors:["#00b09b","#96c93d"],direction:135},{name:"Rose",colors:["#ee9ca7","#ffdde1"],direction:135},{name:"Indigo",colors:["#667eea","#764ba2"],direction:135},{name:"Candy",colors:["#fc5c7d","#6a82fb"],direction:135},{name:"Forest",colors:["#134e5e","#71b280"],direction:135},{name:"Neon",colors:["#00f260","#0575e6"],direction:135},{name:"Warm",colors:["#f093fb","#f5576c"],direction:135}],e_={"Natural Titanium":"#9a8e7e","Black Titanium":"#3c3c3c","White Titanium":"#e8e5e0","Desert Titanium":"#c4a882","Blue Titanium":"#394e5f",Black:"#1c1c1e",White:"#f5f5f7",Pink:"#f9cdd3",Teal:"#5eb5b5",Ultramarine:"#4a50c7",Blue:"#5b8fb9",Green:"#3f6e4e",Yellow:"#f2d44e",Red:"#c43d40",Purple:"#7c5dab",Midnight:"#2c2c3a",Starlight:"#f0e8d8","Product Red":"#c43d40","Space Black":"#2a2a2c","Space Gray":"#636366",Silver:"#d6d6d6",Gold:"#e3caa5","Deep Purple":"#5e4580",Graphite:"#4f4f4f","Pacific Blue":"#1e5c82","Sierra Blue":"#9fb8cf","Alpine Green":"#3c5e48","Rose Gold":"#e6c0aa"},t_=[{value:"minimal",label:"Minimal"},{value:"bold",label:"Bold"},{value:"glow",label:"Glow"},{value:"playful",label:"Playful"},{value:"clean",label:"Clean"},{value:"branded",label:"Branded"},{value:"editorial",label:"Editorial"}],n_=[{value:"solid",label:"Solid"},{value:"gradient",label:"Gradient"},{value:"image",label:"Image"},{value:"preset",label:"Preset"}],o_=[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}];function Vd(){const{screen:r,update:a}=ei(),u=C.useRef(null),{patchBackground:f}=Ka(),v=C.useCallback(x=>f({type:"solid",color:x}),[f]),_=C.useCallback(x=>{if(!r)return;const g=r.backgroundGradient;f({type:"gradient",gradientType:g.type,colors:(x==null?void 0:x.colors)??g.colors,direction:(x==null?void 0:x.direction)??g.direction,radialPosition:g.radialPosition})},[r,f]),[d,I]=C.useState(!1);if(!r)return null;const N=r.backgroundType,V=d||N==="preset"?"preset":N,$=x=>{var P;const g=(P=x.target.files)==null?void 0:P[0];if(!g)return;const F=new FileReader;F.onload=w=>{var Y;a({backgroundImageDataUrl:(Y=w.target)==null?void 0:Y.result})},F.readAsDataURL(g),x.target.value=""},p=()=>{const x=[...r.backgroundGradient.colors];x.length>=5||(x.push("#ffffff"),a({backgroundGradient:{...r.backgroundGradient,colors:x}}))};return i.jsxs(i.Fragment,{children:[i.jsxs(mt,{title:"Background",children:[i.jsx("div",{className:"flex gap-3 mb-2.5",children:n_.map(x=>i.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[i.jsx("input",{type:"radio",name:"bg-type",value:x.value,checked:V===x.value,onChange:()=>{x.value==="preset"?I(!0):(I(!1),a({backgroundType:x.value}))},className:"accent-accent"}),x.label]},x.value))}),V==="preset"&&i.jsx(St,{label:"Style Preset",value:N==="preset"?r.style:"",onChange:x=>{a({backgroundType:"preset",style:x})},options:[{value:"",label:"Select a preset..."},...t_]}),V==="solid"&&i.jsx(Tt,{label:"Color",value:r.backgroundColor,onChange:x=>a({backgroundColor:x}),onInstant:v,presets:Jm}),V==="gradient"&&i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:qm.map(x=>i.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform",style:{background:`linear-gradient(${x.direction}deg, ${x.colors.join(", ")})`},title:x.name,onClick:()=>a({backgroundGradient:{type:"linear",colors:[...x.colors],direction:x.direction,radialPosition:"center"}})},x.name))}),i.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(x=>i.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[i.jsx("input",{type:"radio",checked:r.backgroundGradient.type===x,onChange:()=>a({backgroundGradient:{...r.backgroundGradient,type:x}}),className:"accent-accent"}),x.charAt(0).toUpperCase()+x.slice(1)]},x))}),i.jsx(me,{label:"Direction",value:r.backgroundGradient.direction,min:0,max:360,formatValue:x=>`${x}°`,onChange:x=>a({backgroundGradient:{...r.backgroundGradient,direction:x}}),onInstant:x=>_({direction:x})}),r.backgroundGradient.type==="radial"&&i.jsx(St,{label:"Center",value:r.backgroundGradient.radialPosition,onChange:x=>a({backgroundGradient:{...r.backgroundGradient,radialPosition:x}}),options:o_}),r.backgroundGradient.colors.map((x,g)=>i.jsx(Tt,{label:`Stop ${g+1}`,value:x,onChange:F=>{const P=[...r.backgroundGradient.colors];P[g]=F,a({backgroundGradient:{...r.backgroundGradient,colors:P}})}},g)),r.backgroundGradient.colors.length<5&&i.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:p,children:"+ Add Color Stop"})]}),V==="image"&&i.jsxs(i.Fragment,{children:[i.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var x;return(x=u.current)==null?void 0:x.click()},children:"Upload Background Image"}),i.jsx("input",{ref:u,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden",onChange:$}),r.backgroundImageDataUrl&&i.jsxs("div",{className:"mt-1.5",children:[i.jsx("img",{src:r.backgroundImageDataUrl,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),i.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>a({backgroundImageDataUrl:null}),children:"Remove"})]}),i.jsxs("div",{className:"mt-2",children:[i.jsx(Cn,{label:"Dim Overlay",checked:!!r.backgroundOverlay,onChange:x=>a({backgroundOverlay:x?{color:"#000000",opacity:.3}:null})}),r.backgroundOverlay&&i.jsxs(i.Fragment,{children:[i.jsx(Tt,{label:"Color",value:r.backgroundOverlay.color,onChange:x=>a({backgroundOverlay:{...r.backgroundOverlay,color:x}})}),i.jsx(me,{label:"Opacity",value:Math.round(r.backgroundOverlay.opacity*100),min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({backgroundOverlay:{...r.backgroundOverlay,opacity:x/100}})})]})]})]})]}),i.jsxs(mt,{title:"Preset Colors",hidden:N!=="preset",children:[i.jsx(Tt,{label:"Primary",value:r.colors.primary,onChange:x=>a({colors:{...r.colors,primary:x}})}),i.jsx(Tt,{label:"Secondary",value:r.colors.secondary,onChange:x=>a({colors:{...r.colors,secondary:x}})}),i.jsx(Tt,{label:"Background",value:r.colors.background,onChange:x=>a({colors:{...r.colors,background:x}})})]})]})}function jd(r,a,u){const v=[{name:"nw",x:u.x,y:u.y},{name:"ne",x:u.x+u.w,y:u.y},{name:"sw",x:u.x,y:u.y+u.h},{name:"se",x:u.x+u.w,y:u.y+u.h}];for(const _ of v)if(Math.abs(r-_.x)<12&&Math.abs(a-_.y)<12)return _.name;return r>u.x&&r<u.x+u.w&&a>u.y&&a<u.y+u.h?"move":"new"}const r_={nw:"nw-resize",ne:"ne-resize",sw:"sw-resize",se:"se-resize",move:"move",new:"crosshair"};function l_({imageDataUrl:r,onApply:a,onCancel:u}){const f=C.useRef(null),v=C.useRef(null),_=C.useRef({x:0,y:0,w:0,h:0}),d=C.useRef(1),I=C.useRef({mode:null,startX:0,startY:0,startCrop:{x:0,y:0,w:0,h:0}}),N=C.useCallback(()=>{const p=f.current,x=v.current;if(!p||!x)return;const g=p.getContext("2d");if(!g)return;const F=p.width,P=p.height,w=_.current;g.clearRect(0,0,F,P),g.drawImage(x,0,0,F,P),g.fillStyle="rgba(0,0,0,0.5)",g.fillRect(0,0,F,w.y),g.fillRect(0,w.y+w.h,F,P-w.y-w.h),g.fillRect(0,w.y,w.x,w.h),g.fillRect(w.x+w.w,w.y,F-w.x-w.w,w.h),g.strokeStyle="#fff",g.lineWidth=2,g.strokeRect(w.x,w.y,w.w,w.h);const Y=8;g.fillStyle="#fff";const B=[[w.x,w.y],[w.x+w.w,w.y],[w.x,w.y+w.h],[w.x+w.w,w.y+w.h]];for(const[Q,ce]of B)g.fillRect(Q-Y/2,ce-Y/2,Y,Y);g.strokeStyle="rgba(255,255,255,0.25)",g.lineWidth=1;for(let Q=1;Q<=2;Q++)g.beginPath(),g.moveTo(w.x+w.w*Q/3,w.y),g.lineTo(w.x+w.w*Q/3,w.y+w.h),g.stroke(),g.beginPath(),g.moveTo(w.x,w.y+w.h*Q/3),g.lineTo(w.x+w.w,w.y+w.h*Q/3),g.stroke()},[]);C.useEffect(()=>{const p=new Image;p.onload=()=>{v.current=p;const x=p.naturalWidth,g=p.naturalHeight,F=window.innerWidth*.8,P=window.innerHeight*.7,w=Math.min(F/x,P/g,1);d.current=w;const Y=Math.round(x*w),B=Math.round(g*w),Q=f.current;Q&&(Q.width=Y,Q.height=B,_.current={x:Math.round(Y*.1),y:Math.round(B*.1),w:Math.round(Y*.8),h:Math.round(B*.8)},N())},p.src=r},[r,N]);const V=C.useCallback(p=>{const x=f.current;if(!x)return;const g=x.getBoundingClientRect(),F=p.clientX-g.left,P=p.clientY-g.top,w=jd(F,P,_.current),Y=_.current;I.current={mode:w==="new"?"se":w,startX:F,startY:P,startCrop:{...Y}},w==="new"&&(_.current={x:F,y:P,w:0,h:0})},[]);C.useEffect(()=>{const p=g=>{const F=f.current;if(!F)return;const P=F.getBoundingClientRect(),w=F.width,Y=F.height,B=I.current;if(!B.mode){const we=jd(g.clientX-P.left,g.clientY-P.top,_.current);F.style.cursor=r_[we]??"crosshair";return}const Q=Math.max(0,Math.min(w,g.clientX-P.left)),ce=Math.max(0,Math.min(Y,g.clientY-P.top)),ge=Q-B.startX,ne=ce-B.startY,J=B.startCrop,ee=_.current;B.mode==="move"?(ee.x=Math.max(0,Math.min(w-J.w,J.x+ge)),ee.y=Math.max(0,Math.min(Y-J.h,J.y+ne))):B.mode==="se"?(ee.w=Math.max(10,Q-ee.x),ee.h=Math.max(10,ce-ee.y)):B.mode==="nw"?(ee.x=Math.min(J.x+J.w-10,J.x+ge),ee.y=Math.min(J.y+J.h-10,J.y+ne),ee.w=J.w-(ee.x-J.x),ee.h=J.h-(ee.y-J.y)):B.mode==="ne"?(ee.y=Math.min(J.y+J.h-10,J.y+ne),ee.w=Math.max(10,J.w+ge),ee.h=J.h-(ee.y-J.y)):B.mode==="sw"&&(ee.x=Math.min(J.x+J.w-10,J.x+ge),ee.w=J.w-(ee.x-J.x),ee.h=Math.max(10,J.h+ne)),N()},x=()=>{I.current.mode=null};return document.addEventListener("mousemove",p),document.addEventListener("mouseup",x),()=>{document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",x)}},[N]);const $=C.useCallback(()=>{const p=v.current;if(!p)return;const x=_.current,g=d.current,F=Math.round(x.x/g),P=Math.round(x.y/g);let w=Math.round(x.w/g),Y=Math.round(x.h/g);w=Math.min(w,p.naturalWidth-F),Y=Math.min(Y,p.naturalHeight-P);const B=document.createElement("canvas");B.width=w,B.height=Y;const Q=B.getContext("2d");Q&&(Q.drawImage(p,F,P,w,Y,0,0,w,Y),a(B.toDataURL("image/png")))},[a]);return i.jsxs("div",{className:"fixed inset-0 z-[9999] flex flex-col items-center justify-center",style:{background:"rgba(0,0,0,0.8)"},children:[i.jsx("div",{className:"text-white text-base font-semibold mb-3",children:"Crop Screenshot"}),i.jsx("canvas",{ref:f,className:"border border-white/30",style:{cursor:"crosshair"},onMouseDown:V}),i.jsxs("div",{className:"flex gap-2 mt-3",children:[i.jsx("button",{className:"px-6 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent-hover",onClick:$,children:"Apply Crop"}),i.jsx("button",{className:"px-6 py-2 text-sm bg-surface-2 text-text-dim border border-border rounded-md hover:text-text",onClick:u,children:"Cancel"})]})]})}const s_=[{value:"center",label:"Center"},{value:"angled-left",label:"Angled Left"},{value:"angled-right",label:"Angled Right"}],i_=[{value:"flat",label:"Flat"},{value:"none",label:"None (frameless)"}],a_=[{value:"single",label:"Single Device"}],u_=[{label:"Edge Bleed (1 device)",options:[{value:"peek-right",label:"Peek Right"},{value:"peek-left",label:"Peek Left"},{value:"tilt-left",label:"Tilt Left"},{value:"tilt-right",label:"Tilt Right"}]},{label:"Multi-Device",options:[{value:"duo-overlap",label:"Duo Overlap (2)"},{value:"duo-split",label:"Duo Split (2)"},{value:"hero-tilt",label:"Hero + Background (2)"},{value:"fanned-cards",label:"Fanned Cards (3)"}]}],c_=[{value:"iphone",label:"iPhone"},{value:"ipad",label:"iPad"},{value:"mac",label:"Mac"},{value:"watch",label:"Apple Watch"},{value:"android",label:"Android"}],d_={iphone:"iphone",android:"iphone",ipad:"ipad",mac:"mac",watch:"watch"};function f_(r,a){if(r==="android")return"generic-phone";const u=d_[r]??"iphone",f=a.filter(v=>v.category===u).sort((v,_)=>_.year-v.year)[0];return f?f.id:u==="ipad"?"ipad-pro-13":"generic-phone"}const Ed=.15;function Nd(r,a){const u=r.width/r.height;return Math.abs(a-u)/u<Ed||Math.abs(a-1/u)/(1/u)<Ed}const m_={iphone:["iphone"],android:["iphone"],ipad:["ipad"],mac:["mac"],watch:["watch"]},__={iphone:["default-ios","default-android"],android:["default-ios","default-android"],ipad:["default-ipad","fallback-tablet"],mac:[],watch:[]};function p_(r,a,u,f,v){const _=u?u.width/u.height:null,d=!f&&_!==null,I=m_[v]??["iphone"],N=__[v]??[],V={};for(const x of r){const g=x.category||"other";if(!f&&!I.includes(g)||d&&!Nd(x.screenResolution,_))continue;const F=V[g]??[];F.push({value:x.id,label:x.name}),V[g]=F}const $=Object.entries(V).map(([x,g])=>({label:x.charAt(0).toUpperCase()+x.slice(1),options:g})),p=[];for(const x of a){if(!f&&N.length>0){if(!(x.tags??[]).some(F=>N.includes(F)))continue}else if(!f&&N.length===0)continue;d&&x.screenResolution&&!Nd(x.screenResolution,_)||p.push({value:x.id,label:x.name})}return p.length>0&&$.push({label:"SVG Frames",options:p}),$}function h_(){const{screen:r,update:a}=ei(),u=de(T=>T.platform),f=de(T=>T.setPlatform),v=de(T=>T.setPreviewSize),_=de(T=>T.sizes),d=de(T=>T.setExportSize),I=de(T=>T.triggerRender),N=de(T=>T.updateScreen),V=de(T=>T.screens),$=de(T=>T.deviceFamilies),p=de(T=>T.frames),x=C.useRef(null),[g,F]=C.useState(!1),[P,w]=C.useState(!1),{patchDevice:Y}=Ka(),B=C.useCallback((T,Ce)=>Y({[T]:Ce}),[Y]),Q=T=>{f(T);const Ce=Ks[T]??Ks.iphone;v(Ce.w,Ce.h);const ye=_[T]??[];ye.length>0&&d(ye[0].key);const We=f_(T,$);for(let Ie=0;Ie<V.length;Ie++)N(Ie,{frameId:We,deviceColor:""});I()};if(!r)return null;const ce=$.find(T=>T.id===r.frameId),ge=ce&&ce.colors.length>1,ne=ce&&ce.screenRect,J=r.frameStyle==="none",ee=r.layout==="angled-left"||r.layout==="angled-right",we=C.useMemo(()=>p_($,p,r.screenshotDims,P,u),[$,p,r.screenshotDims,P,u]),X=T=>{var We;const Ce=(We=T.target.files)==null?void 0:We[0];if(!Ce)return;const ye=new FileReader;ye.onload=Ie=>{var q;const M=(q=Ie.target)==null?void 0:q.result,Z=new Image;Z.onload=()=>{const j={width:Z.naturalWidth,height:Z.naturalHeight};a({screenshotDataUrl:M,screenshotName:Ce.name,screenshotDims:j})},Z.src=M},ye.readAsDataURL(Ce),T.target.value=""},Ke=T=>{F(!1);const Ce=new Image;Ce.onload=()=>{const ye={width:Ce.naturalWidth,height:Ce.naturalHeight};a({screenshotDataUrl:T,screenshotDims:ye})},Ce.src=T},Te=Zs[u]??Zs.iphone;return i.jsxs(i.Fragment,{children:[g&&r.screenshotDataUrl&&i.jsx(l_,{imageDataUrl:r.screenshotDataUrl,onApply:Ke,onCancel:()=>F(!1)}),i.jsx(mt,{title:"Platform",children:i.jsx(St,{label:"",value:u,onChange:Q,options:c_})}),i.jsxs(mt,{title:"Screenshot",children:[r.screenshotDataUrl&&i.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[i.jsx("img",{src:r.screenshotDataUrl,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),i.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:r.screenshotName||"Custom upload"})]}),!r.screenshotDataUrl&&r.screenshotName&&i.jsx("div",{className:"text-xs text-text-dim mb-2",children:r.screenshotName}),i.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var T;return(T=x.current)==null?void 0:T.click()},children:"Upload Screenshot"}),i.jsx("input",{ref:x,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden",onChange:X}),r.screenshotDataUrl&&i.jsxs("div",{className:"flex gap-1 mt-1.5",children:[i.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>F(!0),children:"Crop"}),i.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>a({screenshotDataUrl:null,screenshotName:null,screenshotDims:null}),children:"Revert"})]})]}),i.jsxs(mt,{title:"Device Frame",children:[i.jsx(St,{label:"Device",value:r.frameId,onChange:T=>{const Ce=$.find(We=>We.id===T);Ce&&Ce.screenRect&&r.frameStyle==="none"?a({frameId:T,frameStyle:"flat"}):a({frameId:T})},groups:we}),r.screenshotDims&&i.jsx(Cn,{label:"Show all frames",checked:P,onChange:w}),ge&&i.jsxs("div",{className:"mb-2.5",children:[i.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),i.jsx("div",{className:"flex flex-wrap gap-1",children:ce.colors.map(T=>i.jsx("button",{className:`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform ${r.deviceColor===T.name?"border-accent ring-1 ring-accent":"border-border"}`,style:{background:e_[T.name]??"#888888"},title:T.name,onClick:()=>a({deviceColor:T.name})},T.name))})]}),i.jsx(St,{label:"Frame Style",value:r.frameStyle,onChange:T=>a({frameStyle:T}),options:i_,hidden:!!ne}),J&&i.jsxs(i.Fragment,{children:[i.jsx(Cn,{label:"Border Simulation",checked:!!r.borderSimulation,onChange:T=>a({borderSimulation:T?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:null})}),r.borderSimulation&&i.jsxs(i.Fragment,{children:[i.jsx(me,{label:"Thickness",value:r.borderSimulation.thickness,min:1,max:20,formatValue:T=>`${T}px`,onChange:T=>a({borderSimulation:{...r.borderSimulation,thickness:T}})}),i.jsx(Tt,{label:"Color",value:r.borderSimulation.color,onChange:T=>a({borderSimulation:{...r.borderSimulation,color:T}})}),i.jsx(me,{label:"Radius",value:r.borderSimulation.radius,min:0,max:60,formatValue:T=>`${T}px`,onChange:T=>a({borderSimulation:{...r.borderSimulation,radius:T}})})]})]})]}),i.jsxs(mt,{title:"Device Layout",children:[i.jsx(Cn,{label:"Fullscreen Screenshot",checked:r.style==="fullscreen",onChange:T=>a({style:T?"fullscreen":"minimal"})}),r.style!=="fullscreen"&&i.jsxs(i.Fragment,{children:[i.jsx(St,{label:"Layout",value:r.layout,onChange:T=>a({layout:T}),options:s_}),i.jsx(me,{label:"Device Size",value:r.deviceScale,min:50,max:100,formatValue:T=>`${T}%`,onChange:T=>a({deviceScale:T}),onInstant:T=>B("deviceScale",T)}),i.jsx(me,{label:"Device Position",value:r.deviceTop,min:-80,max:80,formatValue:T=>`${T}%`,onChange:T=>a({deviceTop:T}),onInstant:T=>B("deviceTop",T)}),i.jsx(me,{label:"Horizontal Position",value:r.deviceOffsetX,min:-80,max:80,formatValue:T=>String(T),onChange:T=>a({deviceOffsetX:T}),onInstant:T=>B("deviceOffsetX",T)}),i.jsx(me,{label:"Device Rotation",value:r.deviceRotation,min:-180,max:180,formatValue:T=>`${T}°`,onChange:T=>a({deviceRotation:T}),onInstant:T=>B("deviceRotation",T)}),ee&&i.jsx(me,{label:"Perspective Angle",value:r.deviceAngle,min:2,max:45,formatValue:T=>`${T}°`,onChange:T=>a({deviceAngle:T}),onInstant:T=>B("deviceAngle",T)}),i.jsx(me,{label:"3D Tilt",value:r.deviceTilt,min:0,max:40,formatValue:T=>`${T}°`,onChange:T=>a({deviceTilt:T}),onInstant:T=>B("deviceTilt",T)}),J&&i.jsx(me,{label:"Corner Radius",value:r.cornerRadius,min:0,max:50,formatValue:T=>`${T}%`,onChange:T=>a({cornerRadius:T})}),i.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>a({deviceScale:Te.deviceScale,deviceTop:Te.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:Te.deviceAngle,deviceTilt:0,cornerRadius:0}),children:"Reset Device Position"})]})]}),i.jsxs(mt,{title:"Device Shadow",children:[i.jsx(Cn,{label:"Custom Shadow",checked:!!r.deviceShadow,onChange:T=>a({deviceShadow:T?{opacity:.25,blur:20,color:"#000000",offsetY:10}:null})}),r.deviceShadow&&i.jsxs(i.Fragment,{children:[i.jsx(me,{label:"Opacity",value:Math.round(r.deviceShadow.opacity*100),min:0,max:100,formatValue:T=>`${T}%`,onChange:T=>a({deviceShadow:{...r.deviceShadow,opacity:T/100}})}),i.jsx(me,{label:"Blur",value:r.deviceShadow.blur,min:0,max:50,formatValue:T=>`${T}px`,onChange:T=>a({deviceShadow:{...r.deviceShadow,blur:T}})}),i.jsx(Tt,{label:"Color",value:r.deviceShadow.color,onChange:T=>a({deviceShadow:{...r.deviceShadow,color:T}})}),i.jsx(me,{label:"Y Offset",value:r.deviceShadow.offsetY,min:0,max:30,formatValue:T=>`${T}px`,onChange:T=>a({deviceShadow:{...r.deviceShadow,offsetY:T}})})]})]}),i.jsxs(mt,{title:"Composition",children:[i.jsx(St,{label:"Device Arrangement",value:r.composition,onChange:T=>a({composition:T}),options:a_,groups:u_}),i.jsx("span",{className:"text-[10px] text-text-dim leading-tight block -mt-1.5 mb-2",children:"Edge bleed presets overflow screen edges — pair adjacent screens for cross-screen effects."})]})]})}const Ld=[{value:"",label:"Auto"},{value:"none",label:"None"},{value:"uppercase",label:"Uppercase"},{value:"lowercase",label:"Lowercase"},{value:"capitalize",label:"Capitalize"}],g_=[{value:"",label:"Auto"},{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}];function y_(){const{screen:r,update:a}=ei(),u=de(d=>d.fonts),{patchText:f}=Ka(),v=C.useCallback((d,I)=>f({[d]:I}),[f]);if(!r)return null;const _=u.map(d=>({value:d.name,label:d.name}));return i.jsxs(i.Fragment,{children:[i.jsxs(mt,{title:"Text",children:[i.jsxs("div",{className:"mb-2.5",children:[i.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Headline"}),i.jsx("textarea",{rows:2,value:r.headline,onChange:d=>a({headline:d.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),i.jsxs("div",{className:"mb-2.5",children:[i.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Subtitle"}),i.jsx("input",{type:"text",value:r.subtitle,onChange:d=>a({subtitle:d.target.value}),placeholder:"Optional subtitle",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent"})]}),i.jsx(Tt,{label:"Headline Color",value:r.colors.text,onChange:d=>a({colors:{...r.colors,text:d}})}),i.jsx(Tt,{label:"Subtitle Color",value:r.colors.subtitle,onChange:d=>a({colors:{...r.colors,subtitle:d}})})]}),i.jsxs(mt,{title:"Typography",children:[i.jsx(St,{label:"Font",value:r.font,onChange:d=>a({font:d}),options:_}),i.jsx(me,{label:"Font Weight",value:r.fontWeight,min:400,max:800,step:100,formatValue:d=>String(d),onChange:d=>a({fontWeight:d})}),i.jsx(me,{label:"Headline Size",value:r.headlineSize,min:0,max:200,formatValue:d=>d===0?"Auto":`${d}px`,onChange:d=>a({headlineSize:d}),onInstant:d=>v("headlineSize",d),disabled:r.autoSizeHeadline}),i.jsx(me,{label:"Subtitle Size",value:r.subtitleSize,min:0,max:120,formatValue:d=>d===0?"Auto":`${d}px`,onChange:d=>a({subtitleSize:d}),onInstant:d=>v("subtitleSize",d),disabled:r.autoSizeSubtitle}),i.jsx(Cn,{label:"Auto-size Headline",checked:r.autoSizeHeadline,onChange:d=>a({autoSizeHeadline:d})}),i.jsx(Cn,{label:"Auto-size Subtitle",checked:r.autoSizeSubtitle,onChange:d=>a({autoSizeSubtitle:d})}),i.jsx(me,{label:"Headline Rotation",value:r.headlineRotation,min:-30,max:30,formatValue:d=>`${d}°`,onChange:d=>a({headlineRotation:d}),onInstant:d=>v("headlineRotation",d)}),i.jsx(me,{label:"Subtitle Rotation",value:r.subtitleRotation,min:-30,max:30,formatValue:d=>`${d}°`,onChange:d=>a({subtitleRotation:d}),onInstant:d=>v("subtitleRotation",d)}),i.jsx(me,{label:"Headline Line Height",value:r.headlineLineHeight,min:80,max:180,formatValue:d=>d===0?"Auto":(d/100).toFixed(2),onChange:d=>a({headlineLineHeight:d})}),i.jsx(me,{label:"Headline Letter Spacing",value:r.headlineLetterSpacing,min:-5,max:10,formatValue:d=>d===0?"Auto":`${d/100}em`,onChange:d=>a({headlineLetterSpacing:d})}),i.jsxs("div",{className:"flex gap-2 mb-2",children:[i.jsx("div",{className:"flex-1",children:i.jsx(St,{label:"Headline Case",value:r.headlineTextTransform,onChange:d=>a({headlineTextTransform:d}),options:Ld})}),i.jsx("div",{className:"flex-1",children:i.jsx(St,{label:"Headline Style",value:r.headlineFontStyle,onChange:d=>a({headlineFontStyle:d}),options:g_})})]}),i.jsx(me,{label:"Subtitle Opacity",value:r.subtitleOpacity,min:0,max:100,formatValue:d=>d===0?"Auto":`${d}%`,onChange:d=>a({subtitleOpacity:d})}),i.jsx(me,{label:"Subtitle Letter Spacing",value:r.subtitleLetterSpacing,min:-5,max:10,formatValue:d=>d===0?"Auto":`${d/100}em`,onChange:d=>a({subtitleLetterSpacing:d})}),i.jsx(St,{label:"Subtitle Case",value:r.subtitleTextTransform,onChange:d=>a({subtitleTextTransform:d}),options:Ld})]}),i.jsxs(mt,{title:"Text Position",children:[i.jsx("span",{className:"text-[11px] text-text-dim leading-tight block mb-1.5",children:"Drag the headline or subtitle in the preview to reposition them."}),i.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>a({textPositions:{headline:null,subtitle:null}}),children:"Reset to Default"})]}),i.jsxs(mt,{title:"Text Gradient",children:[i.jsx(Cn,{label:"Enable Headline Gradient",checked:!!r.headlineGradient,onChange:d=>a({headlineGradient:d?{colors:["#6366f1","#ec4899"],direction:90}:null})}),r.headlineGradient&&i.jsxs(i.Fragment,{children:[i.jsx(Tt,{label:"Start",value:r.headlineGradient.colors[0]??"#6366f1",onChange:d=>a({headlineGradient:{...r.headlineGradient,colors:[d,r.headlineGradient.colors[1]??"#ec4899"]}})}),i.jsx(Tt,{label:"End",value:r.headlineGradient.colors[1]??"#ec4899",onChange:d=>a({headlineGradient:{...r.headlineGradient,colors:[r.headlineGradient.colors[0]??"#6366f1",d]}})}),i.jsx(me,{label:"Direction",value:r.headlineGradient.direction,min:0,max:360,formatValue:d=>`${d}°`,onChange:d=>a({headlineGradient:{...r.headlineGradient,direction:d}})})]}),i.jsx("div",{className:"mt-2.5",children:i.jsx(Cn,{label:"Enable Subtitle Gradient",checked:!!r.subtitleGradient,onChange:d=>a({subtitleGradient:d?{colors:["#6366f1","#ec4899"],direction:90}:null})})}),r.subtitleGradient&&i.jsxs(i.Fragment,{children:[i.jsx(Tt,{label:"Start",value:r.subtitleGradient.colors[0]??"#6366f1",onChange:d=>a({subtitleGradient:{...r.subtitleGradient,colors:[d,r.subtitleGradient.colors[1]??"#ec4899"]}})}),i.jsx(Tt,{label:"End",value:r.subtitleGradient.colors[1]??"#ec4899",onChange:d=>a({subtitleGradient:{...r.subtitleGradient,colors:[r.subtitleGradient.colors[0]??"#6366f1",d]}})}),i.jsx(me,{label:"Direction",value:r.subtitleGradient.direction,min:0,max:360,formatValue:d=>`${d}°`,onChange:d=>a({subtitleGradient:{...r.subtitleGradient,direction:d}})})]})]})]})}function $a({title:r,onRemove:a,children:u}){return i.jsxs("div",{className:"border border-border rounded-md p-2 mb-1.5 text-[11px]",children:[i.jsxs("div",{className:"flex justify-between items-center mb-1.5",children:[i.jsx("span",{className:"font-semibold text-text-dim",children:r}),i.jsx("button",{className:"text-text-dim hover:text-red-400 text-sm leading-none px-1",onClick:a,children:"×"})]}),u]})}let v_=0;function za(r){return`${r}-${++v_}`}function x_(){const{screen:r,update:a}=ei();if(!r)return null;const u=(p,x)=>{const g=r.annotations.map((F,P)=>P===p?{...F,...x}:F);a({annotations:g})},f=p=>{a({annotations:r.annotations.filter((x,g)=>g!==p)})},v=()=>{a({annotations:[...r.annotations,{id:za("ann"),shape:"rounded-rect",x:40,y:40,w:20,h:20,strokeColor:"#FF3B30",strokeWidth:4}]})},_=(p,x)=>{const g=r.callouts.map((F,P)=>P===p?{...F,...x}:F);a({callouts:g})},d=p=>{a({callouts:r.callouts.filter((x,g)=>g!==p)})},I=()=>{a({callouts:[...r.callouts,{id:za("callout"),sourceX:30,sourceY:40,sourceW:40,sourceH:20,displayX:60,displayY:10,displayScale:1,rotation:0,borderRadius:8,shadow:!0,borderWidth:0,borderColor:"#ffffff"}]})},N=(p,x)=>{const g=r.overlays.map((F,P)=>P===p?{...F,...x}:F);a({overlays:g})},V=p=>{a({overlays:r.overlays.filter((x,g)=>g!==p)})},$=()=>{a({overlays:[...r.overlays,{id:za("overlay"),type:"shape",x:10,y:10,size:10,rotation:0,opacity:1,shapeType:"circle",shapeColor:"#6366f1",shapeOpacity:.5,shapeBlur:10}]})};return i.jsxs(i.Fragment,{children:[i.jsxs(mt,{title:"Spotlight / Dimming",children:[i.jsx(Cn,{label:"Enable Spotlight",checked:!!r.spotlight,onChange:p=>a({spotlight:p?{x:50,y:50,w:30,h:30,shape:"rectangle",dimOpacity:.6,blur:0}:null})}),r.spotlight&&i.jsxs(i.Fragment,{children:[i.jsx(St,{label:"Shape",value:r.spotlight.shape,onChange:p=>a({spotlight:{...r.spotlight,shape:p}}),options:[{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),i.jsx(me,{label:"Position X",value:r.spotlight.x,min:0,max:100,formatValue:p=>`${p}%`,onChange:p=>a({spotlight:{...r.spotlight,x:p}})}),i.jsx(me,{label:"Position Y",value:r.spotlight.y,min:0,max:100,formatValue:p=>`${p}%`,onChange:p=>a({spotlight:{...r.spotlight,y:p}})}),i.jsx(me,{label:"Width",value:r.spotlight.w,min:5,max:100,formatValue:p=>`${p}%`,onChange:p=>a({spotlight:{...r.spotlight,w:p}})}),i.jsx(me,{label:"Height",value:r.spotlight.h,min:5,max:100,formatValue:p=>`${p}%`,onChange:p=>a({spotlight:{...r.spotlight,h:p}})}),i.jsx(me,{label:"Dim Opacity",value:Math.round(r.spotlight.dimOpacity*100),min:0,max:100,formatValue:p=>`${p}%`,onChange:p=>a({spotlight:{...r.spotlight,dimOpacity:p/100}})}),i.jsx(me,{label:"Background Blur",value:r.spotlight.blur,min:0,max:30,formatValue:p=>`${p}px`,onChange:p=>a({spotlight:{...r.spotlight,blur:p}})})]})]}),i.jsxs(mt,{title:"Annotations",children:[i.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:v,children:"+ Add Annotation"}),r.annotations.map((p,x)=>i.jsxs($a,{title:`Annotation ${x+1}`,onRemove:()=>f(x),children:[i.jsx(St,{label:"Shape",value:p.shape,onChange:g=>u(x,{shape:g}),options:[{value:"rounded-rect",label:"rounded-rect"},{value:"rectangle",label:"rectangle"},{value:"circle",label:"circle"}]}),i.jsx(Tt,{label:"Color",value:p.strokeColor,onChange:g=>u(x,{strokeColor:g})}),i.jsx(me,{label:"X",value:p.x,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>u(x,{x:g})}),i.jsx(me,{label:"Y",value:p.y,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>u(x,{y:g})}),i.jsx(me,{label:"Width",value:p.w,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>u(x,{w:g})}),i.jsx(me,{label:"Height",value:p.h,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>u(x,{h:g})}),i.jsx(me,{label:"Stroke",value:p.strokeWidth,min:1,max:20,formatValue:g=>`${g}px`,onChange:g=>u(x,{strokeWidth:g})})]},p.id))]}),i.jsxs(mt,{title:"Loupe / Magnification",children:[i.jsx(Cn,{label:"Enable Loupe",checked:!!r.loupe,onChange:p=>a({loupe:p?{sourceX:50,sourceY:50,displayX:70,displayY:20,size:20,zoom:2.5,borderWidth:3,borderColor:"#ffffff"}:null})}),r.loupe&&i.jsxs(i.Fragment,{children:[i.jsx(me,{label:"Source X",value:r.loupe.sourceX,min:0,max:100,formatValue:p=>`${p}%`,onChange:p=>a({loupe:{...r.loupe,sourceX:p}})}),i.jsx(me,{label:"Source Y",value:r.loupe.sourceY,min:0,max:100,formatValue:p=>`${p}%`,onChange:p=>a({loupe:{...r.loupe,sourceY:p}})}),i.jsx(me,{label:"Display X",value:r.loupe.displayX,min:0,max:100,formatValue:p=>`${p}%`,onChange:p=>a({loupe:{...r.loupe,displayX:p}})}),i.jsx(me,{label:"Display Y",value:r.loupe.displayY,min:0,max:100,formatValue:p=>`${p}%`,onChange:p=>a({loupe:{...r.loupe,displayY:p}})}),i.jsx(me,{label:"Size",value:r.loupe.size,min:5,max:50,formatValue:p=>`${p}%`,onChange:p=>a({loupe:{...r.loupe,size:p}})}),i.jsx(me,{label:"Zoom",value:Math.round(r.loupe.zoom*100),min:150,max:500,step:10,formatValue:p=>`${(p/100).toFixed(1)}x`,onChange:p=>a({loupe:{...r.loupe,zoom:p/100}})}),i.jsx(me,{label:"Border Width",value:r.loupe.borderWidth,min:0,max:10,formatValue:p=>`${p}px`,onChange:p=>a({loupe:{...r.loupe,borderWidth:p}})}),i.jsx(Tt,{label:"Border Color",value:r.loupe.borderColor,onChange:p=>a({loupe:{...r.loupe,borderColor:p}})})]})]}),i.jsxs(mt,{title:"Callouts",children:[i.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:I,children:"+ Add Callout"}),r.callouts.map((p,x)=>i.jsxs($a,{title:`Callout ${x+1}`,onRemove:()=>d(x),children:[i.jsx(me,{label:"Source X",value:p.sourceX,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>_(x,{sourceX:g})}),i.jsx(me,{label:"Source Y",value:p.sourceY,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>_(x,{sourceY:g})}),i.jsx(me,{label:"Source W",value:p.sourceW,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>_(x,{sourceW:g})}),i.jsx(me,{label:"Source H",value:p.sourceH,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>_(x,{sourceH:g})}),i.jsx(me,{label:"Display X",value:p.displayX,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>_(x,{displayX:g})}),i.jsx(me,{label:"Display Y",value:p.displayY,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>_(x,{displayY:g})}),i.jsx(me,{label:"Scale",value:Math.round(p.displayScale*100),min:50,max:300,step:10,formatValue:g=>`${(g/100).toFixed(1)}x`,onChange:g=>_(x,{displayScale:g/100})}),i.jsx(me,{label:"Rotation",value:p.rotation,min:-45,max:45,formatValue:g=>`${g}°`,onChange:g=>_(x,{rotation:g})}),i.jsx(me,{label:"Radius",value:p.borderRadius,min:0,max:30,formatValue:g=>`${g}px`,onChange:g=>_(x,{borderRadius:g})})]},p.id))]}),i.jsxs(mt,{title:"Overlays",children:[i.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:$,children:"+ Add Overlay"}),r.overlays.map((p,x)=>i.jsxs($a,{title:`Overlay ${x+1}`,onRemove:()=>V(x),children:[i.jsx(St,{label:"Type",value:p.type,onChange:g=>N(x,{type:g}),options:[{value:"shape",label:"shape"},{value:"star-rating",label:"star-rating"},{value:"icon",label:"icon"},{value:"badge",label:"badge"},{value:"custom",label:"custom"}]}),i.jsx(me,{label:"X",value:p.x,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>N(x,{x:g})}),i.jsx(me,{label:"Y",value:p.y,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>N(x,{y:g})}),i.jsx(me,{label:"Size",value:p.size,min:1,max:50,formatValue:g=>`${g}%`,onChange:g=>N(x,{size:g})}),i.jsx(me,{label:"Rotation",value:p.rotation,min:-180,max:180,formatValue:g=>`${g}°`,onChange:g=>N(x,{rotation:g})}),i.jsx(me,{label:"Opacity",value:Math.round(p.opacity*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>N(x,{opacity:g/100})}),p.type==="shape"&&i.jsxs(i.Fragment,{children:[i.jsx(St,{label:"Shape",value:p.shapeType??"circle",onChange:g=>N(x,{shapeType:g}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"}]}),i.jsx(Tt,{label:"Color",value:p.shapeColor??"#6366f1",onChange:g=>N(x,{shapeColor:g})}),i.jsx(me,{label:"Shape Opacity",value:Math.round((p.shapeOpacity??.5)*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>N(x,{shapeOpacity:g/100})}),i.jsx(me,{label:"Blur",value:p.shapeBlur??0,min:0,max:50,formatValue:g=>`${g}px`,onChange:g=>N(x,{shapeBlur:g})})]})]},p.id))]})]})}function b_(){const r=de(X=>X.platform),a=de(X=>X.sizes),u=de(X=>X.exportSize),f=de(X=>X.setExportSize),v=de(X=>X.exportRenderer),_=de(X=>X.setExportRenderer),d=de(X=>X.koubouAvailable),I=de(X=>X.locale),N=de(X=>X.setLocale),V=de(X=>X.previewBg),$=de(X=>X.setPreviewBg),p=de(X=>X.config),x=de(X=>X.initScreens),g=de(X=>X.triggerRender),F=de(X=>X.selectedScreen),P=de(X=>X.screens),[w,Y]=C.useState(!1),[B,Q]=C.useState("Ready"),ge=(a[r]??[]).map(X=>({value:X.key,label:`${X.name} (${X.width}×${X.height})`})),ne=[{value:"playwright",label:"Playwright (fast)"},{value:"koubou",label:"Koubou (pixel-perfect)",disabled:!d||r==="android"}],J=[{value:"default",label:"Default"}];if(p!=null&&p.locales)for(const X of Object.keys(p.locales))J.push({value:X,label:X});const ee=async()=>{const X=P[F];if(X){Y(!0),Q(v==="koubou"?`Rendering screen ${F+1} with Koubou...`:`Exporting screen ${F+1}...`);try{const Ke=await Qm({screenIndex:X.screenIndex,sizeKey:u,renderer:v,headline:X.headline,subtitle:X.subtitle||void 0,style:X.style,layout:X.layout,colors:X.colors,font:X.font,fontWeight:X.fontWeight,frameId:X.frameId,frameStyle:X.frameStyle,deviceColor:X.deviceColor||void 0,deviceScale:X.deviceScale,deviceTop:X.deviceTop,screenshotDataUrl:X.screenshotDataUrl||void 0}),Te=URL.createObjectURL(Ke),T=document.createElement("a");T.href=Te,T.download=`screenshot-${F+1}.png`,document.body.appendChild(T),T.click(),document.body.removeChild(T),URL.revokeObjectURL(Te);const Ce=Math.round(Ke.size/1024);Q(`Exported (${Ce}KB)`)}catch(Ke){Q(`Export error: ${Ke instanceof Error?Ke.message:"Unknown error"}`)}finally{Y(!1)}}},we=async()=>{try{const X=await Ym();x(X,r),g(),Q("Config reloaded")}catch(X){Q(`Reload error: ${X instanceof Error?X.message:"Unknown error"}`)}};return i.jsxs(i.Fragment,{children:[i.jsxs(mt,{title:"Export",children:[i.jsx(St,{label:"Output Size",value:u,onChange:f,options:ge}),d&&i.jsx(St,{label:"Renderer",value:v,onChange:_,options:ne}),i.jsx("button",{className:"w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1",onClick:ee,disabled:w,children:w?"Exporting...":"Download Screenshot"})]}),i.jsx(mt,{title:"Locale",children:i.jsx(St,{label:"",value:I,onChange:N,options:J})}),i.jsx(mt,{title:"Preview Background",children:i.jsx("div",{className:"flex gap-3",children:["dark","light"].map(X=>i.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[i.jsx("input",{type:"radio",checked:V===X,onChange:()=>$(X),className:"accent-accent"}),X.charAt(0).toUpperCase()+X.slice(1)]},X))})}),i.jsxs(mt,{title:"",children:[i.jsxs("div",{className:"flex gap-2",children:[i.jsx("button",{className:"flex-1 py-2 text-xs bg-accent hover:bg-accent-hover text-white rounded-md",onClick:g,children:"Refresh All"}),i.jsx("button",{className:"flex-1 py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:we,children:"Reload Config"})]}),i.jsx("div",{className:"text-[10px] text-text-dim mt-2",children:B})]})]})}function w_(r,a,u,f,v,_){var I,N,V,$,p,x;return{screenIndex:r.screenIndex,screenshotDataUrl:r.screenshotDataUrl||void 0,locale:v!=="default"?v:void 0,style:r.style,layout:r.layout,headline:r.headline,subtitle:r.subtitle||void 0,colors:r.colors,font:r.font,fontWeight:r.fontWeight,headlineSize:r.headlineSize||void 0,subtitleSize:r.subtitleSize||void 0,headlineRotation:r.headlineRotation||void 0,subtitleRotation:r.subtitleRotation||void 0,frameId:r.frameId,deviceColor:r.deviceColor||void 0,frameStyle:r.frameStyle,deviceScale:r.deviceScale,deviceTop:r.deviceTop,deviceRotation:r.deviceRotation,deviceOffsetX:r.deviceOffsetX,deviceAngle:r.deviceAngle,deviceTilt:r.deviceTilt,headlineTop:(I=r.textPositions.headline)==null?void 0:I.y,headlineLeft:(N=r.textPositions.headline)==null?void 0:N.x,headlineWidth:(V=r.textPositions.headline)==null?void 0:V.width,subtitleTop:($=r.textPositions.subtitle)==null?void 0:$.y,subtitleLeft:(p=r.textPositions.subtitle)==null?void 0:p.x,subtitleWidth:(x=r.textPositions.subtitle)==null?void 0:x.width,composition:r.composition||"single",headlineGradient:r.headlineGradient||void 0,subtitleGradient:r.subtitleGradient||void 0,autoSizeHeadline:r.autoSizeHeadline||void 0,autoSizeSubtitle:r.autoSizeSubtitle||void 0,spotlight:r.spotlight||void 0,annotations:r.annotations.length>0?r.annotations:void 0,backgroundType:r.backgroundType!=="preset"?r.backgroundType:void 0,backgroundColor:r.backgroundType==="solid"?r.backgroundColor:void 0,backgroundGradient:r.backgroundType==="gradient"?r.backgroundGradient:void 0,backgroundImageDataUrl:r.backgroundType==="image"?r.backgroundImageDataUrl:void 0,backgroundOverlay:r.backgroundType==="image"&&r.backgroundOverlay?r.backgroundOverlay:void 0,deviceShadow:r.deviceShadow||void 0,borderSimulation:r.borderSimulation||void 0,cornerRadius:r.cornerRadius||void 0,loupe:r.loupe||void 0,callouts:r.callouts.length>0?r.callouts:void 0,overlays:r.overlays.length>0?r.overlays:void 0,headlineLineHeight:r.headlineLineHeight?r.headlineLineHeight/100:void 0,headlineLetterSpacing:r.headlineLetterSpacing?`${r.headlineLetterSpacing/100}em`:void 0,headlineTextTransform:r.headlineTextTransform||void 0,headlineFontStyle:r.headlineFontStyle||void 0,subtitleOpacity:r.subtitleOpacity?r.subtitleOpacity/100:void 0,subtitleLetterSpacing:r.subtitleLetterSpacing?`${r.subtitleLetterSpacing/100}em`:void 0,subtitleTextTransform:r.subtitleTextTransform||void 0,width:u,height:f}}function k_(r){return{top:r.offsetTop,left:r.offsetLeft,width:r.offsetWidth,height:r.offsetHeight}}function S_(r,a,u,f,v,_,d,I){const N=C.useRef(null),V=C.useCallback((g,F)=>{var P,w,Y,B;try{const Q=(P=r.current)==null?void 0:P.contentDocument;if(!Q)return null;const ce=Q.elementsFromPoint(g,F);let ge=null,ne=null,J=null;for(const ee of ce){let we=ee;for(;we&&we!==Q.documentElement;)!ge&&((w=we.classList)!=null&&w.contains("headline"))&&(ge=we),!ne&&((Y=we.classList)!=null&&Y.contains("subtitle"))&&(ne=we),!J&&((B=we.classList)!=null&&B.contains("device-wrapper"))&&(J=we),we=we.parentElement}if(ge&&ne){const ee=ge.getBoundingClientRect(),we=ne.getBoundingClientRect(),X=ee.top+ee.height/2,Ke=we.top+we.height/2;return Math.abs(F-X)<=Math.abs(F-Ke)?{cls:"headline",el:ge,kind:"text"}:{cls:"subtitle",el:ne,kind:"text"}}if(ge)return{cls:"headline",el:ge,kind:"text"};if(ne)return{cls:"subtitle",el:ne,kind:"text"};if(J)return{cls:"device-wrapper",el:J,kind:"device"}}catch{}return null},[r]),$=C.useCallback((g,F)=>{const P=a.current;if(!P)return{x:0,y:0};const w=P.getBoundingClientRect();return{x:(g-w.left)/f,y:(F-w.top)/f}},[a,f]),p=C.useCallback(g=>{if(!u)return;const F=$(g.clientX,g.clientY),P=V(F.x,F.y);if(P){if(g.preventDefault(),P.kind==="device"){N.current={kind:"device",el:P.el,startX:g.clientX,startY:g.clientY,startDeviceTop:u.deviceTop,startDeviceOffsetX:u.deviceOffsetX,offsetX:0,offsetY:0,origWidth:0,scale:f},P.el.style.outline="2px solid rgba(99,102,241,0.5)";const w=B=>{const Q=N.current;if(!Q||Q.kind!=="device")return;const ce=(B.clientX-Q.startX)/Q.scale,ge=(B.clientY-Q.startY)/Q.scale,ne=Math.max(-80,Math.min(80,Q.startDeviceOffsetX+Math.round(ce/v*100))),J=Math.max(-80,Math.min(80,Q.startDeviceTop+Math.round(ge/_*100)));Q.el.style.top=J+"%",Q.el.style.left=ne?`calc(50% + ${ne/100*v}px)`:"50%"},Y=B=>{const Q=N.current;if(!Q||Q.kind!=="device")return;Q.el.style.outline="none";const ce=(B.clientX-Q.startX)/Q.scale,ge=(B.clientY-Q.startY)/Q.scale,ne=Math.max(-80,Math.min(80,Q.startDeviceOffsetX+Math.round(ce/v*100))),J=Math.max(-80,Math.min(80,Q.startDeviceTop+Math.round(ge/_*100)));N.current=null,document.removeEventListener("mousemove",w),document.removeEventListener("mouseup",Y),d({deviceTop:J,deviceOffsetX:ne})};document.addEventListener("mousemove",w),document.addEventListener("mouseup",Y)}else if(P.kind==="text"){const w=P.el,Y=P.cls,B=w.getBoundingClientRect(),Q=!!(Y==="headline"?u.textPositions.headline:u.textPositions.subtitle),ce=B.left+B.width/2,ge=B.width;if(!Q){const ee=Y==="headline"?u.headlineRotation:u.subtitleRotation,we=["translateX(-50%)"];ee&&we.push(`rotate(${ee}deg)`),w.style.position="fixed",w.style.top=B.top+"px",w.style.left=ce+"px",w.style.transform=we.join(" "),w.style.zIndex="10",w.style.margin="0",w.style.width=B.width+"px"}N.current={kind:"text",cls:Y,el:w,startX:g.clientX,startY:g.clientY,startDeviceTop:0,startDeviceOffsetX:0,offsetX:F.x-ce,offsetY:F.y-B.top,origWidth:ge,scale:f},w.style.outline="2px dashed rgba(99,102,241,0.5)";const ne=ee=>{const we=N.current;if(!we||we.kind!=="text")return;const X=$(ee.clientX,ee.clientY);we.el.style.top=X.y-we.offsetY+"px",we.el.style.left=X.x-we.offsetX+"px"},J=()=>{const ee=N.current;if(!ee||ee.kind!=="text")return;ee.el.style.outline="none";const we=k_(ee.el),X=Math.round(we.top/_*100*10)/10,Ke=Math.round(we.left/v*100*10)/10,Te=Math.round(ee.origWidth/v*100*10)/10;N.current=null,document.removeEventListener("mousemove",ne),document.removeEventListener("mouseup",J),I(ee.cls,{x:Ke,y:X,width:Te})};document.addEventListener("mousemove",ne),document.addEventListener("mouseup",J)}}},[u,f,$,V,d,I]),x=C.useCallback((g,F)=>{const P=$(g,F),w=V(P.x,P.y);return w?w.kind==="device"?"move":"grab":"default"},[$,V]);return{onOverlayMouseDown:p,getCursorForPosition:x}}function C_(){const r=de(B=>B.screens),a=de(B=>B.selectedScreen),u=de(B=>B.setSelectedScreen),f=de(B=>B.addScreen),v=de(B=>B.removeScreen),_=de(B=>B.moveScreen),d=de(B=>B.previewW),I=de(B=>B.previewH),N=de(B=>B.previewBg),V=de(B=>B.renderVersion),$=de(B=>B.platform),p=de(B=>B.locale),x=de(B=>B.deviceFamilies),g=C.useRef(null),[F,P]=C.useState(.5),w=C.useCallback(()=>{const B=g.current;if(!B)return;const Q=B.clientHeight-120,ce=Math.min(Q*.85,500),ge=400,ne=ce/I,J=ge/d;let ee=Math.min(ne,J);ee=Math.min(ee,1.3),ee=Math.max(ee,.15),P(ee)},[I,d]);C.useEffect(()=>(w(),window.addEventListener("resize",w),()=>window.removeEventListener("resize",w)),[w]);const Y=N==="light"?"bg-gray-100":"bg-bg";return i.jsx("div",{ref:g,className:`flex-1 flex flex-col overflow-hidden ${Y}`,children:i.jsx("div",{className:"flex-1 overflow-x-auto overflow-y-hidden",children:i.jsxs("div",{className:"flex items-center gap-4 p-6 h-full min-w-min",children:[r.map((B,Q)=>i.jsx(j_,{index:Q,selected:Q===a,previewW:d,previewH:I,scale:F,headline:B.headline,canRemove:r.length>1,canMoveLeft:Q>0,canMoveRight:Q<r.length-1,onSelect:()=>u(Q),onRemove:()=>v(Q),onMoveLeft:()=>_(Q,Q-1),onMoveRight:()=>_(Q,Q+1),renderVersion:V,platform:$,locale:p,deviceFamilies:x},Q)),i.jsx("button",{className:"shrink-0 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-text-dim text-xs hover:border-accent hover:text-accent transition-colors cursor-pointer",style:{width:Math.round(d*F*.5),height:Math.round(I*F)},onClick:f,children:"+ Add Screen"})]})})})}function j_({index:r,selected:a,previewW:u,previewH:f,scale:v,canRemove:_,canMoveLeft:d,canMoveRight:I,onSelect:N,onRemove:V,onMoveLeft:$,onMoveRight:p,renderVersion:x,platform:g,locale:F,deviceFamilies:P}){const w=C.useRef(null),Y=C.useRef(null),[B,Q]=C.useState(!0),ce=C.useRef(null),ge=C.useRef(null),ne=de(ye=>ye.screens[r]),J=de(ye=>ye.updateScreen);C.useEffect(()=>(Cd(r,w.current),()=>Cd(r,null)),[r]);const ee=C.useCallback(ye=>{J(r,ye)},[r,J]),we=C.useCallback((ye,We)=>{const Ie={...(ne==null?void 0:ne.textPositions)??{headline:null,subtitle:null}};Ie[ye]=We,J(r,{textPositions:Ie})},[r,ne==null?void 0:ne.textPositions,J]),{onOverlayMouseDown:X,getCursorForPosition:Ke}=S_(w,Y,ne,v,u,f,ee,we),[Te,T]=C.useState("default"),Ce=C.useCallback(ye=>{T(Ke(ye.clientX,ye.clientY))},[Ke]);return C.useEffect(()=>{if(ne)return ge.current&&clearTimeout(ge.current),ge.current=setTimeout(()=>{var Ie;(Ie=ce.current)==null||Ie.abort();const ye=new AbortController;ce.current=ye;const We=w_(ne,g,u,f,F);Wm(We,ye.signal).then(M=>{const Z=w.current;if(!Z)return;const q=Z.contentDocument;q?(q.open(),q.write(M),q.close()):Z.srcdoc=M,Q(!1)}).catch(M=>{M instanceof DOMException&&M.name==="AbortError"||Q(!1)})},B?0:150),()=>{var ye;ge.current&&clearTimeout(ge.current),(ye=ce.current)==null||ye.abort()}},[ne,x,g,u,f,F]),i.jsxs("div",{className:`shrink-0 cursor-pointer rounded-lg overflow-hidden transition-shadow ${a?"ring-2 ring-accent shadow-lg":"hover:ring-1 hover:ring-border"}`,onClick:N,children:[i.jsxs("div",{className:"flex items-center justify-between px-2 py-1 bg-surface text-[10px]",children:[d?i.jsx("button",{className:"text-text-dim hover:text-text px-1",onClick:ye=>{ye.stopPropagation(),$()},title:"Move left",children:"‹"}):i.jsx("span",{className:"w-4"}),i.jsxs("span",{className:"text-text-dim font-medium",children:["Screen ",r+1]}),i.jsxs("div",{className:"flex items-center gap-0.5",children:[I&&i.jsx("button",{className:"text-text-dim hover:text-text px-1",onClick:ye=>{ye.stopPropagation(),p()},title:"Move right",children:"›"}),_&&i.jsx("button",{className:"text-text-dim hover:text-red-400 px-1",onClick:ye=>{ye.stopPropagation(),V()},title:"Remove screen",children:"×"})]})]}),i.jsxs("div",{ref:Y,className:"relative overflow-hidden",style:{width:u*v,height:f*v},children:[B&&i.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-bg z-20",children:i.jsx("div",{className:"w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),i.jsx("iframe",{ref:w,className:"border-none block origin-top-left",style:{width:u,height:f,transform:`scale(${v})`},title:`Screen ${r+1}`}),i.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:Te},onMouseDown:X,onMouseMove:Ce})]})]})}var Td=Hd(),E_=`svg[fill=none] {
  fill: none !important;
}

@keyframes styles-module__popupEnter___AuQDN {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
}
@keyframes styles-module__popupExit___JJKQX {
  from {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
}
@keyframes styles-module__shake___jdbWe {
  0%, 100% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(0);
  }
  20% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-3px);
  }
  40% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(3px);
  }
  60% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-2px);
  }
  80% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(2px);
  }
}
.styles-module__popup___IhzrD {
  position: fixed;
  transform: translateX(-50%);
  width: 280px;
  padding: 0.75rem 1rem 14px;
  background: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  cursor: default;
  z-index: 100001;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  will-change: transform, opacity;
  opacity: 0;
}
.styles-module__popup___IhzrD.styles-module__enter___L7U7N {
  animation: styles-module__popupEnter___AuQDN 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w {
  opacity: 1;
  transform: translateX(-50%) scale(1) translateY(0);
}
.styles-module__popup___IhzrD.styles-module__exit___5eGjE {
  animation: styles-module__popupExit___JJKQX 0.15s ease-in forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w.styles-module__shake___jdbWe {
  animation: styles-module__shake___jdbWe 0.25s ease-out;
}

.styles-module__header___wWsSi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5625rem;
}

.styles-module__element___fTV2z {
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.styles-module__headerToggle___WpW0b {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  flex: 1;
  min-width: 0;
  text-align: left;
}
.styles-module__headerToggle___WpW0b .styles-module__element___fTV2z {
  flex: 1;
}

.styles-module__chevron___ZZJlR {
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}
.styles-module__chevron___ZZJlR.styles-module__expanded___2Hxgv {
  transform: rotate(90deg);
}

.styles-module__stylesWrapper___pnHgy {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.styles-module__stylesWrapper___pnHgy.styles-module__expanded___2Hxgv {
  grid-template-rows: 1fr;
}

.styles-module__stylesInner___YYZe2 {
  overflow: hidden;
}

.styles-module__stylesBlock___VfQKn {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.375rem;
  padding: 0.5rem 0.625rem;
  margin-bottom: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.6875rem;
  line-height: 1.5;
}

.styles-module__styleLine___1YQiD {
  color: rgba(255, 255, 255, 0.85);
  word-break: break-word;
}

.styles-module__styleProperty___84L1i {
  color: #c792ea;
}

.styles-module__styleValue___q51-h {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__timestamp___Dtpsv {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  font-variant-numeric: tabular-nums;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.styles-module__quote___mcMmQ {
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  line-height: 1.45;
}

.styles-module__textarea___jrSae {
  width: 100%;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
}
.styles-module__textarea___jrSae:focus {
  border-color: #3c82f7;
}
.styles-module__textarea___jrSae.styles-module__green___99l3h:focus {
  border-color: #34c759;
}
.styles-module__textarea___jrSae::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
.styles-module__textarea___jrSae::-webkit-scrollbar {
  width: 6px;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-track {
  background: transparent;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.styles-module__actions___D6x3f {
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.styles-module__cancel___hRjnL,
.styles-module__submit___K-mIR {
  padding: 0.4rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.styles-module__cancel___hRjnL {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__cancel___hRjnL:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.styles-module__submit___K-mIR {
  color: white;
}
.styles-module__submit___K-mIR:hover:not(:disabled) {
  filter: brightness(0.9);
}
.styles-module__submit___K-mIR:disabled {
  cursor: not-allowed;
}

.styles-module__deleteWrapper___oSjdo {
  margin-right: auto;
}

.styles-module__deleteButton___4VuAE {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.styles-module__deleteButton___4VuAE:hover {
  background: rgba(255, 59, 48, 0.25);
  color: #ff3b30;
}
.styles-module__deleteButton___4VuAE:active {
  transform: scale(0.92);
}

.styles-module__light___6AaSQ.styles-module__popup___IhzrD {
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.styles-module__light___6AaSQ .styles-module__element___fTV2z {
  color: rgba(0, 0, 0, 0.6);
}
.styles-module__light___6AaSQ .styles-module__timestamp___Dtpsv {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__chevron___ZZJlR {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__stylesBlock___VfQKn {
  background: rgba(0, 0, 0, 0.03);
}
.styles-module__light___6AaSQ .styles-module__styleLine___1YQiD {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__styleProperty___84L1i {
  color: #7c3aed;
}
.styles-module__light___6AaSQ .styles-module__styleValue___q51-h {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__quote___mcMmQ {
  color: rgba(0, 0, 0, 0.55);
  background: rgba(0, 0, 0, 0.04);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae {
  background: rgba(0, 0, 0, 0.03);
  color: #1a1a1a;
  border-color: rgba(0, 0, 0, 0.12);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE:hover {
  background: rgba(255, 59, 48, 0.15);
  color: #ff3b30;
}`,N_={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let r=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");r||(r=document.createElement("style"),r.id="feedback-tool-styles-annotation-popup-css-styles",r.textContent=E_,document.head.appendChild(r))}var Ze=N_,L_=({size:r=16})=>i.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",children:i.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),T_=({size:r=16})=>i.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",children:i.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),P_=({size:r=24,style:a={}})=>i.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",style:a,children:[i.jsxs("g",{clipPath:"url(#clip0_list_sparkle)",children:[i.jsx("path",{d:"M11.5 12L5.5 12",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M18.5 6.75L5.5 6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M9.25 17.25L5.5 17.25",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})]}),i.jsx("defs",{children:i.jsx("clipPath",{id:"clip0_list_sparkle",children:i.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),Dr=({size:r=20})=>i.jsxs("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:[i.jsx("circle",{cx:"10",cy:"10.5",r:"5.25",stroke:"currentColor",strokeWidth:"1.25"}),i.jsx("path",{d:"M8.5 8.75C8.5 7.92 9.17 7.25 10 7.25C10.83 7.25 11.5 7.92 11.5 8.75C11.5 9.58 10.83 10.25 10 10.25V11",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("circle",{cx:"10",cy:"13",r:"0.75",fill:"currentColor"})]}),Pd=({size:r=14})=>i.jsxs("svg",{width:r,height:r,viewBox:"0 0 14 14",fill:"none",children:[i.jsx("style",{children:`
      @keyframes checkDraw {
        0% {
          stroke-dashoffset: 12;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
      @keyframes checkBounce {
        0% {
          transform: scale(0.5);
          opacity: 0;
        }
        50% {
          transform: scale(1.12);
          opacity: 1;
        }
        75% {
          transform: scale(0.95);
        }
        100% {
          transform: scale(1);
        }
      }
      .check-path-animated {
        stroke-dasharray: 12;
        stroke-dashoffset: 0;
        transform-origin: center;
        animation: checkDraw 0.18s ease-out, checkBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    `}),i.jsx("path",{className:"check-path-animated",d:"M3.9375 7L6.125 9.1875L10.5 4.8125",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),R_=({size:r=24,copied:a=!1})=>i.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[i.jsx("style",{children:`
      .copy-icon, .check-icon {
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
    `}),i.jsxs("g",{className:"copy-icon",style:{opacity:a?0:1,transform:a?"scale(0.8)":"scale(1)",transformOrigin:"center"},children:[i.jsx("path",{d:"M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",stroke:"currentColor",strokeWidth:"1.5"}),i.jsx("path",{d:"M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),i.jsxs("g",{className:"check-icon",style:{opacity:a?1:0,transform:a?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[i.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})]}),I_=({size:r=24,state:a="idle"})=>{const u=a==="idle",f=a==="sent",v=a==="failed",_=a==="sending";return i.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[i.jsx("style",{children:`
        .send-arrow-icon, .send-check-icon, .send-error-icon {
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
      `}),i.jsx("g",{className:"send-arrow-icon",style:{opacity:u?1:_?.5:0,transform:u?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:i.jsx("path",{d:"M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),i.jsxs("g",{className:"send-check-icon",style:{opacity:f?1:0,transform:f?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[i.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),i.jsxs("g",{className:"send-error-icon",style:{opacity:v?1:0,transform:v?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[i.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M12 8V12",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round"}),i.jsx("circle",{cx:"12",cy:"15",r:"0.5",fill:"#ef4444",stroke:"#ef4444",strokeWidth:"1"})]})]})},M_=({size:r=24,isOpen:a=!0})=>i.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[i.jsx("style",{children:`
      .eye-open, .eye-closed {
        transition: opacity 0.2s ease;
      }
    `}),i.jsxs("g",{className:"eye-open",style:{opacity:a?1:0},children:[i.jsx("path",{d:"M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),i.jsxs("g",{className:"eye-closed",style:{opacity:a?0:1},children:[i.jsx("path",{d:"M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",fill:"currentColor"}),i.jsx("path",{d:"M5 19L19 5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})]}),$_=({size:r=24,isPaused:a=!1})=>i.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[i.jsx("style",{children:`
      .pause-bar, .play-triangle {
        transition: opacity 0.15s ease;
      }
    `}),i.jsx("path",{className:"pause-bar",d:"M8 6L8 18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:a?0:1}}),i.jsx("path",{className:"pause-bar",d:"M16 18L16 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:a?0:1}}),i.jsx("path",{className:"play-triangle",d:"M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",stroke:"currentColor",strokeWidth:"1.5",style:{opacity:a?1:0}})]}),z_=({size:r=16})=>i.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[i.jsx("path",{d:"M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("circle",{cx:"12",cy:"12",r:"2.5",stroke:"currentColor",strokeWidth:"1.5"})]}),O_=({size:r=16})=>i.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:i.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Oa=({size:r=16})=>i.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[i.jsxs("g",{clipPath:"url(#clip0_2_53)",children:[i.jsx("path",{d:"M16.25 16.25L7.75 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M7.75 16.25L16.25 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),i.jsx("defs",{children:i.jsx("clipPath",{id:"clip0_2_53",children:i.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),D_=({size:r=24})=>i.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:i.jsx("path",{d:"M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z",fill:"currentColor"})}),F_=({size:r=16})=>i.jsxs("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:[i.jsx("path",{d:"M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M10 3.9585V5.05698",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M10 14.9429V16.0414",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M5.7269 5.72656L6.50682 6.50649",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M13.4932 13.4932L14.2731 14.2731",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M3.95834 10H5.05683",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M14.9432 10H16.0417",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M5.7269 14.2731L6.50682 13.4932",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),i.jsx("path",{d:"M13.4932 6.50649L14.2731 5.72656",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"})]}),B_=({size:r=16})=>i.jsx("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:i.jsx("path",{d:"M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z",stroke:"currentColor",strokeWidth:"1.13793",strokeLinecap:"round",strokeLinejoin:"round"})}),Rd=({size:r=16})=>i.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:i.jsx("path",{d:"M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375",stroke:"currentColor",strokeWidth:"0.9",strokeLinecap:"round",strokeLinejoin:"round"})}),A_=({size:r=24})=>i.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:i.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Y_=({size:r=16})=>i.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:i.jsx("path",{d:"M8.5 3.5L4 8L8.5 12.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),Qd=["data-feedback-toolbar","data-annotation-popup","data-annotation-marker"],Da=Qd.flatMap(r=>[`:not([${r}])`,`:not([${r}] *)`]).join(""),Va="feedback-freeze-styles",Fa="__agentation_freeze";function W_(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:a=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const r=window;return r[Fa]||(r[Fa]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),r[Fa]}var ze=W_();typeof window<"u"&&!ze.installed&&(ze.origSetTimeout=window.setTimeout.bind(window),ze.origSetInterval=window.setInterval.bind(window),ze.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(r,a,...u)=>typeof r=="string"?ze.origSetTimeout(r,a):ze.origSetTimeout((...f)=>{ze.frozen?ze.frozenTimeoutQueue.push(()=>r(...f)):r(...f)},a,...u),window.setInterval=(r,a,...u)=>typeof r=="string"?ze.origSetInterval(r,a):ze.origSetInterval((...f)=>{ze.frozen||r(...f)},a,...u),window.requestAnimationFrame=r=>ze.origRAF(a=>{ze.frozen?ze.frozenRAFQueue.push(r):r(a)}),ze.installed=!0);var Ae=ze.origSetTimeout,H_=ze.origSetInterval;function U_(r){return r?Qd.some(a=>{var u;return!!((u=r.closest)!=null&&u.call(r,`[${a}]`))}):!1}function X_(){if(typeof document>"u"||ze.frozen)return;ze.frozen=!0,ze.frozenTimeoutQueue=[],ze.frozenRAFQueue=[];let r=document.getElementById(Va);r||(r=document.createElement("style"),r.id=Va),r.textContent=`
    *${Da},
    *${Da}::before,
    *${Da}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `,document.head.appendChild(r),ze.pausedAnimations=[];try{document.getAnimations().forEach(a=>{var f;if(a.playState!=="running")return;const u=(f=a.effect)==null?void 0:f.target;U_(u)||(a.pause(),ze.pausedAnimations.push(a))})}catch{}document.querySelectorAll("video").forEach(a=>{a.paused||(a.dataset.wasPaused="false",a.pause())})}function Id(){var u;if(typeof document>"u"||!ze.frozen)return;ze.frozen=!1;const r=ze.frozenTimeoutQueue;ze.frozenTimeoutQueue=[];for(const f of r)ze.origSetTimeout(()=>{if(ze.frozen){ze.frozenTimeoutQueue.push(f);return}try{f()}catch(v){console.warn("[agentation] Error replaying queued timeout:",v)}},0);const a=ze.frozenRAFQueue;ze.frozenRAFQueue=[];for(const f of a)ze.origRAF(v=>{if(ze.frozen){ze.frozenRAFQueue.push(f);return}f(v)});for(const f of ze.pausedAnimations)try{f.play()}catch(v){console.warn("[agentation] Error resuming animation:",v)}ze.pausedAnimations=[],(u=document.getElementById(Va))==null||u.remove(),document.querySelectorAll("video").forEach(f=>{f.dataset.wasPaused==="false"&&(f.play().catch(()=>{}),delete f.dataset.wasPaused)})}var Md=C.forwardRef(function({element:a,timestamp:u,selectedText:f,placeholder:v="What should change?",initialValue:_="",submitLabel:d="Add",onSubmit:I,onCancel:N,onDelete:V,style:$,accentColor:p="#3c82f7",isExiting:x=!1,lightMode:g=!1,computedStyles:F},P){const[w,Y]=C.useState(_),[B,Q]=C.useState(!1),[ce,ge]=C.useState("initial"),[ne,J]=C.useState(!1),[ee,we]=C.useState(!1),X=C.useRef(null),Ke=C.useRef(null),Te=C.useRef(null),T=C.useRef(null);C.useEffect(()=>{x&&ce!=="exit"&&ge("exit")},[x,ce]),C.useEffect(()=>{Ae(()=>{ge("enter")},0);const Z=Ae(()=>{ge("entered")},200),q=Ae(()=>{const j=X.current;j&&(j.focus(),j.selectionStart=j.selectionEnd=j.value.length,j.scrollTop=j.scrollHeight)},50);return()=>{clearTimeout(Z),clearTimeout(q),Te.current&&clearTimeout(Te.current),T.current&&clearTimeout(T.current)}},[]);const Ce=C.useCallback(()=>{T.current&&clearTimeout(T.current),Q(!0),T.current=Ae(()=>{var Z;Q(!1),(Z=X.current)==null||Z.focus()},250)},[]);C.useImperativeHandle(P,()=>({shake:Ce}),[Ce]);const ye=C.useCallback(()=>{ge("exit"),Te.current=Ae(()=>{N()},150)},[N]),We=C.useCallback(()=>{w.trim()&&I(w.trim())},[w,I]),Ie=C.useCallback(Z=>{Z.stopPropagation(),!Z.nativeEvent.isComposing&&(Z.key==="Enter"&&!Z.shiftKey&&(Z.preventDefault(),We()),Z.key==="Escape"&&ye())},[We,ye]),M=[Ze.popup,g?Ze.light:"",ce==="enter"?Ze.enter:"",ce==="entered"?Ze.entered:"",ce==="exit"?Ze.exit:"",B?Ze.shake:""].filter(Boolean).join(" ");return i.jsxs("div",{ref:Ke,className:M,"data-annotation-popup":!0,style:$,onClick:Z=>Z.stopPropagation(),children:[i.jsxs("div",{className:Ze.header,children:[F&&Object.keys(F).length>0?i.jsxs("button",{className:Ze.headerToggle,onClick:()=>{const Z=ee;we(!ee),Z&&Ae(()=>{var q;return(q=X.current)==null?void 0:q.focus()},0)},type:"button",children:[i.jsx("svg",{className:`${Ze.chevron} ${ee?Ze.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:i.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),i.jsx("span",{className:Ze.element,children:a})]}):i.jsx("span",{className:Ze.element,children:a}),u&&i.jsx("span",{className:Ze.timestamp,children:u})]}),F&&Object.keys(F).length>0&&i.jsx("div",{className:`${Ze.stylesWrapper} ${ee?Ze.expanded:""}`,children:i.jsx("div",{className:Ze.stylesInner,children:i.jsx("div",{className:Ze.stylesBlock,children:Object.entries(F).map(([Z,q])=>i.jsxs("div",{className:Ze.styleLine,children:[i.jsx("span",{className:Ze.styleProperty,children:Z.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",i.jsx("span",{className:Ze.styleValue,children:q}),";"]},Z))})})}),f&&i.jsxs("div",{className:Ze.quote,children:["“",f.slice(0,80),f.length>80?"...":"","”"]}),i.jsx("textarea",{ref:X,className:Ze.textarea,style:{borderColor:ne?p:void 0},placeholder:v,value:w,onChange:Z=>Y(Z.target.value),onFocus:()=>J(!0),onBlur:()=>J(!1),rows:2,onKeyDown:Ie}),i.jsxs("div",{className:Ze.actions,children:[V&&i.jsx("div",{className:Ze.deleteWrapper,children:i.jsx("button",{className:Ze.deleteButton,onClick:V,type:"button",children:i.jsx(A_,{size:22})})}),i.jsx("button",{className:Ze.cancel,onClick:ye,children:"Cancel"}),i.jsx("button",{className:Ze.submit,style:{backgroundColor:p,opacity:w.trim()?1:.4},onClick:We,disabled:!w.trim(),children:d})]})]})});function Ar(r){if(r.parentElement)return r.parentElement;const a=r.getRootNode();return a instanceof ShadowRoot?a.host:null}function Kt(r,a){let u=r;for(;u;){if(u.matches(a))return u;u=Ar(u)}return null}function V_(r,a=4){const u=[];let f=r,v=0;for(;f&&v<a;){const _=f.tagName.toLowerCase();if(_==="html"||_==="body")break;let d=_;if(f.id)d=`#${f.id}`;else if(f.className&&typeof f.className=="string"){const N=f.className.split(/\s+/).find(V=>V.length>2&&!V.match(/^[a-z]{1,2}$/)&&!V.match(/[A-Z0-9]{5,}/));N&&(d=`.${N.split("_")[0]}`)}const I=Ar(f);!f.parentElement&&I&&(d=`⟨shadow⟩ ${d}`),u.unshift(d),f=I,v++}return u.join(" > ")}function Js(r){var f,v,_,d,I,N,V,$;const a=V_(r);if(r.dataset.element)return{name:r.dataset.element,path:a};const u=r.tagName.toLowerCase();if(["path","circle","rect","line","g"].includes(u)){const p=Kt(r,"svg");if(p){const x=Ar(p);if(x instanceof HTMLElement)return{name:`graphic in ${Js(x).name}`,path:a}}return{name:"graphic element",path:a}}if(u==="svg"){const p=Ar(r);if((p==null?void 0:p.tagName.toLowerCase())==="button"){const x=(f=p.textContent)==null?void 0:f.trim();return{name:x?`icon in "${x}" button`:"button icon",path:a}}return{name:"icon",path:a}}if(u==="button"){const p=(v=r.textContent)==null?void 0:v.trim(),x=r.getAttribute("aria-label");return x?{name:`button [${x}]`,path:a}:{name:p?`button "${p.slice(0,25)}"`:"button",path:a}}if(u==="a"){const p=(_=r.textContent)==null?void 0:_.trim(),x=r.getAttribute("href");return p?{name:`link "${p.slice(0,25)}"`,path:a}:x?{name:`link to ${x.slice(0,30)}`,path:a}:{name:"link",path:a}}if(u==="input"){const p=r.getAttribute("type")||"text",x=r.getAttribute("placeholder"),g=r.getAttribute("name");return x?{name:`input "${x}"`,path:a}:g?{name:`input [${g}]`,path:a}:{name:`${p} input`,path:a}}if(["h1","h2","h3","h4","h5","h6"].includes(u)){const p=(d=r.textContent)==null?void 0:d.trim();return{name:p?`${u} "${p.slice(0,35)}"`:u,path:a}}if(u==="p"){const p=(I=r.textContent)==null?void 0:I.trim();return p?{name:`paragraph: "${p.slice(0,40)}${p.length>40?"...":""}"`,path:a}:{name:"paragraph",path:a}}if(u==="span"||u==="label"){const p=(N=r.textContent)==null?void 0:N.trim();return p&&p.length<40?{name:`"${p}"`,path:a}:{name:u,path:a}}if(u==="li"){const p=(V=r.textContent)==null?void 0:V.trim();return p&&p.length<40?{name:`list item: "${p.slice(0,35)}"`,path:a}:{name:"list item",path:a}}if(u==="blockquote")return{name:"blockquote",path:a};if(u==="code"){const p=($=r.textContent)==null?void 0:$.trim();return p&&p.length<30?{name:`code: \`${p}\``,path:a}:{name:"code",path:a}}if(u==="pre")return{name:"code block",path:a};if(u==="img"){const p=r.getAttribute("alt");return{name:p?`image "${p.slice(0,30)}"`:"image",path:a}}if(u==="video")return{name:"video",path:a};if(["div","section","article","nav","header","footer","aside","main"].includes(u)){const p=r.className,x=r.getAttribute("role"),g=r.getAttribute("aria-label");if(g)return{name:`${u} [${g}]`,path:a};if(x)return{name:`${x}`,path:a};if(typeof p=="string"&&p){const F=p.split(/[\s_-]+/).map(P=>P.replace(/[A-Z0-9]{5,}.*$/,"")).filter(P=>P.length>2&&!/^[a-z]{1,2}$/.test(P)).slice(0,2);if(F.length>0)return{name:F.join(" "),path:a}}return{name:u==="div"?"container":u,path:a}}return{name:u,path:a}}function El(r){var _,d,I;const a=[],u=(_=r.textContent)==null?void 0:_.trim();u&&u.length<100&&a.push(u);const f=r.previousElementSibling;if(f){const N=(d=f.textContent)==null?void 0:d.trim();N&&N.length<50&&a.unshift(`[before: "${N.slice(0,40)}"]`)}const v=r.nextElementSibling;if(v){const N=(I=v.textContent)==null?void 0:I.trim();N&&N.length<50&&a.push(`[after: "${N.slice(0,40)}"]`)}return a.join(" ")}function Ys(r){const a=Ar(r);if(!a)return"";const v=(r.getRootNode()instanceof ShadowRoot&&r.parentElement?Array.from(r.parentElement.children):Array.from(a.children)).filter($=>$!==r&&$ instanceof HTMLElement);if(v.length===0)return"";const _=v.slice(0,4).map($=>{var F;const p=$.tagName.toLowerCase(),x=$.className;let g="";if(typeof x=="string"&&x){const P=x.split(/\s+/).map(w=>w.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(w=>w.length>2&&!/^[a-z]{1,2}$/.test(w));P&&(g=`.${P}`)}if(p==="button"||p==="a"){const P=(F=$.textContent)==null?void 0:F.trim().slice(0,15);if(P)return`${p}${g} "${P}"`}return`${p}${g}`});let I=a.tagName.toLowerCase();if(typeof a.className=="string"&&a.className){const $=a.className.split(/\s+/).map(p=>p.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(p=>p.length>2&&!/^[a-z]{1,2}$/.test(p));$&&(I=`.${$}`)}const N=a.children.length,V=N>_.length+1?` (${N} total in ${I})`:"";return _.join(", ")+V}function Nl(r){const a=r.className;return typeof a!="string"||!a?"":a.split(/\s+/).filter(f=>f.length>0).map(f=>{const v=f.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);return v?v[1]:f}).filter((f,v,_)=>_.indexOf(f)===v).join(", ")}var Gd=new Set(["none","normal","auto","0px","rgba(0, 0, 0, 0)","transparent","static","visible"]),Q_=new Set(["p","span","h1","h2","h3","h4","h5","h6","label","li","td","th","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","a","time","cite","q"]),G_=new Set(["input","textarea","select"]),K_=new Set(["img","video","canvas","svg"]),Z_=new Set(["div","section","article","nav","header","footer","aside","main","ul","ol","form","fieldset"]);function Ws(r){if(typeof window>"u")return{};const a=window.getComputedStyle(r),u={},f=r.tagName.toLowerCase();let v;Q_.has(f)?v=["color","fontSize","fontWeight","fontFamily","lineHeight"]:f==="button"||f==="a"&&r.getAttribute("role")==="button"?v=["backgroundColor","color","padding","borderRadius","fontSize"]:G_.has(f)?v=["backgroundColor","color","padding","borderRadius","fontSize"]:K_.has(f)?v=["width","height","objectFit","borderRadius"]:Z_.has(f)?v=["display","padding","margin","gap","backgroundColor"]:v=["color","fontSize","margin","padding","backgroundColor"];for(const _ of v){const d=_.replace(/([A-Z])/g,"-$1").toLowerCase(),I=a.getPropertyValue(d);I&&!Gd.has(I)&&(u[_]=I)}return u}var J_=["color","backgroundColor","borderColor","fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","textAlign","width","height","padding","margin","border","borderRadius","display","position","top","right","bottom","left","zIndex","flexDirection","justifyContent","alignItems","gap","opacity","visibility","overflow","boxShadow","transform"];function Hs(r){if(typeof window>"u")return"";const a=window.getComputedStyle(r),u=[];for(const f of J_){const v=f.replace(/([A-Z])/g,"-$1").toLowerCase(),_=a.getPropertyValue(v);_&&!Gd.has(_)&&u.push(`${v}: ${_}`)}return u.join("; ")}function q_(r){if(!r)return;const a={},u=r.split(";").map(f=>f.trim()).filter(Boolean);for(const f of u){const v=f.indexOf(":");if(v>0){const _=f.slice(0,v).trim(),d=f.slice(v+1).trim();_&&d&&(a[_]=d)}}return Object.keys(a).length>0?a:void 0}function Us(r){const a=[],u=r.getAttribute("role"),f=r.getAttribute("aria-label"),v=r.getAttribute("aria-describedby"),_=r.getAttribute("tabindex"),d=r.getAttribute("aria-hidden");return u&&a.push(`role="${u}"`),f&&a.push(`aria-label="${f}"`),v&&a.push(`aria-describedby="${v}"`),_&&a.push(`tabindex=${_}`),d==="true"&&a.push("aria-hidden"),r.matches("a, button, input, select, textarea, [tabindex]")&&a.push("focusable"),a.join(", ")}function Xs(r){const a=[];let u=r;for(;u&&u.tagName.toLowerCase()!=="html";){const f=u.tagName.toLowerCase();let v=f;if(u.id)v=`${f}#${u.id}`;else if(u.className&&typeof u.className=="string"){const d=u.className.split(/\s+/).map(I=>I.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(I=>I.length>2);d&&(v=`${f}.${d}`)}const _=Ar(u);!u.parentElement&&_&&(v=`⟨shadow⟩ ${v}`),a.unshift(v),u=_}return a.join(" > ")}var Qa="feedback-annotations-",Kd=7;function qs(r){return`${Qa}${r}`}function Ba(r){if(typeof window>"u")return[];try{const a=localStorage.getItem(qs(r));if(!a)return[];const u=JSON.parse(a),f=Date.now()-Kd*24*60*60*1e3;return u.filter(v=>!v.timestamp||v.timestamp>f)}catch{return[]}}function Zd(r,a){if(!(typeof window>"u"))try{localStorage.setItem(qs(r),JSON.stringify(a))}catch{}}function ep(){const r=new Map;if(typeof window>"u")return r;try{const a=Date.now()-Kd*24*60*60*1e3;for(let u=0;u<localStorage.length;u++){const f=localStorage.key(u);if(f!=null&&f.startsWith(Qa)){const v=f.slice(Qa.length),_=localStorage.getItem(f);if(_){const I=JSON.parse(_).filter(N=>!N.timestamp||N.timestamp>a);I.length>0&&r.set(v,I)}}}}catch{}return r}function Ll(r,a,u){const f=a.map(v=>({...v,_syncedTo:u}));Zd(r,f)}var Jd="agentation-session-";function Za(r){return`${Jd}${r}`}function tp(r){if(typeof window>"u")return null;try{return localStorage.getItem(Za(r))}catch{return null}}function Aa(r,a){if(!(typeof window>"u"))try{localStorage.setItem(Za(r),a)}catch{}}function np(r){if(!(typeof window>"u"))try{localStorage.removeItem(Za(r))}catch{}}var qd=`${Jd}toolbar-hidden`;function op(){if(typeof window>"u")return!1;try{return sessionStorage.getItem(qd)==="1"}catch{return!1}}function rp(r){if(!(typeof window>"u"))try{r&&sessionStorage.setItem(qd,"1")}catch{}}async function Ya(r,a){const u=await fetch(`${r}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:a})});if(!u.ok)throw new Error(`Failed to create session: ${u.status}`);return u.json()}async function $d(r,a){const u=await fetch(`${r}/sessions/${a}`);if(!u.ok)throw new Error(`Failed to get session: ${u.status}`);return u.json()}async function Vs(r,a,u){const f=await fetch(`${r}/sessions/${a}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)});if(!f.ok)throw new Error(`Failed to sync annotation: ${f.status}`);return f.json()}async function lp(r,a,u){const f=await fetch(`${r}/annotations/${a}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)});if(!f.ok)throw new Error(`Failed to update annotation: ${f.status}`);return f.json()}async function zd(r,a){const u=await fetch(`${r}/annotations/${a}`,{method:"DELETE"});if(!u.ok)throw new Error(`Failed to delete annotation: ${u.status}`)}var Ue={FunctionComponent:0,ClassComponent:1,IndeterminateComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,Fragment:7,Mode:8,ContextConsumer:9,ContextProvider:10,ForwardRef:11,Profiler:12,SuspenseComponent:13,MemoComponent:14,SimpleMemoComponent:15,LazyComponent:16,IncompleteClassComponent:17,DehydratedFragment:18,SuspenseListComponent:19,ScopeComponent:21,OffscreenComponent:22,LegacyHiddenComponent:23,CacheComponent:24,TracingMarkerComponent:25,HostHoistable:26,HostSingleton:27,IncompleteFunctionComponent:28,Throw:29,ViewTransitionComponent:30,ActivityComponent:31},Od=new Set(["Component","PureComponent","Fragment","Suspense","Profiler","StrictMode","Routes","Route","Outlet","Root","ErrorBoundaryHandler","HotReload","Hot"]),Dd=[/Boundary$/,/BoundaryHandler$/,/Provider$/,/Consumer$/,/^(Inner|Outer)/,/Router$/,/^Client(Page|Segment|Root)/,/^Server(Root|Component|Render)/,/^RSC/,/Context$/,/^Hot(Reload)?$/,/^(Dev|React)(Overlay|Tools|Root)/,/Overlay$/,/Handler$/,/^With[A-Z]/,/Wrapper$/,/^Root$/],sp=[/Page$/,/View$/,/Screen$/,/Section$/,/Card$/,/List$/,/Item$/,/Form$/,/Modal$/,/Dialog$/,/Button$/,/Nav$/,/Header$/,/Footer$/,/Layout$/,/Panel$/,/Tab$/,/Menu$/];function ip(r){const a=(r==null?void 0:r.mode)??"filtered";let u=Od;if(r!=null&&r.skipExact){const f=r.skipExact instanceof Set?r.skipExact:new Set(r.skipExact);u=new Set([...Od,...f])}return{maxComponents:(r==null?void 0:r.maxComponents)??6,maxDepth:(r==null?void 0:r.maxDepth)??30,mode:a,skipExact:u,skipPatterns:r!=null&&r.skipPatterns?[...Dd,...r.skipPatterns]:Dd,userPatterns:(r==null?void 0:r.userPatterns)??sp,filter:r==null?void 0:r.filter}}function ap(r){return r.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/([A-Z])([A-Z][a-z])/g,"$1-$2").toLowerCase()}function up(r,a=10){const u=new Set;let f=r,v=0;for(;f&&v<a;)f.className&&typeof f.className=="string"&&f.className.split(/\s+/).forEach(_=>{if(_.length>1){const d=_.replace(/[_][a-zA-Z0-9]{5,}.*$/,"").toLowerCase();d.length>1&&u.add(d)}}),f=f.parentElement,v++;return u}function cp(r,a){const u=ap(r);for(const f of a){if(f===u)return!0;const v=u.split("-").filter(d=>d.length>2),_=f.split("-").filter(d=>d.length>2);for(const d of v)for(const I of _)if(d===I||d.includes(I)||I.includes(d))return!0}return!1}function dp(r,a,u,f){if(u.filter)return u.filter(r,a);switch(u.mode){case"all":return!0;case"filtered":return!(u.skipExact.has(r)||u.skipPatterns.some(v=>v.test(r)));case"smart":return u.skipExact.has(r)||u.skipPatterns.some(v=>v.test(r))?!1:!!(f&&cp(r,f)||u.userPatterns.some(v=>v.test(r)));default:return!0}}var Fr=null,fp=new WeakMap;function Wa(r){return Object.keys(r).some(a=>a.startsWith("__reactFiber$")||a.startsWith("__reactInternalInstance$")||a.startsWith("__reactProps$"))}function mp(){if(Fr!==null)return Fr;if(typeof document>"u")return!1;if(document.body&&Wa(document.body))return Fr=!0,!0;const r=["#root","#app","#__next","[data-reactroot]"];for(const a of r){const u=document.querySelector(a);if(u&&Wa(u))return Fr=!0,!0}if(document.body){for(const a of document.body.children)if(Wa(a))return Fr=!0,!0}return Fr=!1,!1}var Tl={map:fp};function _p(r){return Object.keys(r).find(u=>u.startsWith("__reactFiber$")||u.startsWith("__reactInternalInstance$"))||null}function pp(r){const a=_p(r);return a?r[a]:null}function Jo(r){return r?r.displayName?r.displayName:r.name?r.name:null:null}function hp(r){var v;const{tag:a,type:u,elementType:f}=r;if(a===Ue.HostComponent||a===Ue.HostText||a===Ue.HostHoistable||a===Ue.HostSingleton||a===Ue.Fragment||a===Ue.Mode||a===Ue.Profiler||a===Ue.DehydratedFragment||a===Ue.HostRoot||a===Ue.HostPortal||a===Ue.ScopeComponent||a===Ue.OffscreenComponent||a===Ue.LegacyHiddenComponent||a===Ue.CacheComponent||a===Ue.TracingMarkerComponent||a===Ue.Throw||a===Ue.ViewTransitionComponent||a===Ue.ActivityComponent)return null;if(a===Ue.ForwardRef){const _=f;if(_!=null&&_.render){const d=Jo(_.render);if(d)return d}return _!=null&&_.displayName?_.displayName:Jo(u)}if(a===Ue.MemoComponent||a===Ue.SimpleMemoComponent){const _=f;if(_!=null&&_.type){const d=Jo(_.type);if(d)return d}return _!=null&&_.displayName?_.displayName:Jo(u)}if(a===Ue.ContextProvider){const _=u;return(v=_==null?void 0:_._context)!=null&&v.displayName?`${_._context.displayName}.Provider`:null}if(a===Ue.ContextConsumer){const _=u;return _!=null&&_.displayName?`${_.displayName}.Consumer`:null}if(a===Ue.LazyComponent){const _=f;return(_==null?void 0:_._status)===1&&_._result?Jo(_._result):null}return a===Ue.SuspenseComponent||a===Ue.SuspenseListComponent?null:a===Ue.IncompleteClassComponent||a===Ue.IncompleteFunctionComponent||a===Ue.FunctionComponent||a===Ue.ClassComponent||a===Ue.IndeterminateComponent?Jo(u):null}function gp(r){return r.length<=2||r.length<=3&&r===r.toLowerCase()}function yp(r,a){const u=ip(a),f=u.mode==="all";if(f){const N=Tl.map.get(r);if(N!==void 0)return N}if(!mp()){const N={path:null,components:[]};return f&&Tl.map.set(r,N),N}const v=u.mode==="smart"?up(r):void 0,_=[];try{let N=pp(r),V=0;for(;N&&V<u.maxDepth&&_.length<u.maxComponents;){const $=hp(N);$&&!gp($)&&dp($,V,u,v)&&_.push($),N=N.return,V++}}catch{const N={path:null,components:[]};return f&&Tl.map.set(r,N),N}if(_.length===0){const N={path:null,components:[]};return f&&Tl.map.set(r,N),N}const I={path:_.slice().reverse().map(N=>`<${N}>`).join(" "),components:_};return f&&Tl.map.set(r,I),I}var Pl={FunctionComponent:0,IndeterminateComponent:2,ForwardRef:11,MemoComponent:14,SimpleMemoComponent:15};function vp(r){if(!r||typeof r!="object")return null;const a=Object.keys(r),u=a.find(_=>_.startsWith("__reactFiber$"));if(u)return r[u]||null;const f=a.find(_=>_.startsWith("__reactInternalInstance$"));if(f)return r[f]||null;const v=a.find(_=>{if(!_.startsWith("__react"))return!1;const d=r[_];return d&&typeof d=="object"&&"_debugSource"in d});return v&&r[v]||null}function Il(r){if(!r.type||typeof r.type=="string")return null;if(typeof r.type=="object"||typeof r.type=="function"){const a=r.type;if(a.displayName)return a.displayName;if(a.name)return a.name}return null}function xp(r,a=50){var v;let u=r,f=0;for(;u&&f<a;){if(u._debugSource)return{source:u._debugSource,componentName:Il(u)};if((v=u._debugOwner)!=null&&v._debugSource)return{source:u._debugOwner._debugSource,componentName:Il(u._debugOwner)};u=u.return,f++}return null}function bp(r){let a=r,u=0;const f=50;for(;a&&u<f;){const v=a,_=["_debugSource","__source","_source","debugSource"];for(const d of _){const I=v[d];if(I&&typeof I=="object"&&"fileName"in I)return{source:I,componentName:Il(a)}}if(a.memoizedProps){const d=a.memoizedProps;if(d.__source&&typeof d.__source=="object"){const I=d.__source;if(I.fileName&&I.lineNumber)return{source:{fileName:I.fileName,lineNumber:I.lineNumber,columnNumber:I.columnNumber},componentName:Il(a)}}}a=a.return,u++}return null}var Qs=new Map;function wp(r){var v;const a=r.tag,u=r.type,f=r.elementType;if(typeof u=="string"||u==null||typeof u=="function"&&((v=u.prototype)!=null&&v.isReactComponent))return null;if((a===Pl.FunctionComponent||a===Pl.IndeterminateComponent)&&typeof u=="function")return u;if(a===Pl.ForwardRef&&f){const _=f.render;if(typeof _=="function")return _}if((a===Pl.MemoComponent||a===Pl.SimpleMemoComponent)&&f){const _=f.type;if(typeof _=="function")return _}return typeof u=="function"?u:null}function kp(){const r=Wd,a=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;if(a&&"H"in a)return{get:()=>a.H,set:f=>{a.H=f}};const u=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;if(u){const f=u.ReactCurrentDispatcher;if(f&&"current"in f)return{get:()=>f.current,set:v=>{f.current=v}}}return null}function Sp(r){const a=r.split(`
`),u=[/source-location/,/\/dist\/index\./,/node_modules\//,/react-dom/,/react\.development/,/react\.production/,/chunk-[A-Z0-9]+/i,/react-stack-bottom-frame/,/react-reconciler/,/scheduler/,/<anonymous>/],f=/^\s*at\s+(?:.*?\s+\()?(.+?):(\d+):(\d+)\)?$/,v=/^[^@]*@(.+?):(\d+):(\d+)$/;for(const _ of a){const d=_.trim();if(!d||u.some(N=>N.test(d)))continue;const I=f.exec(d)||v.exec(d);if(I)return{fileName:I[1],line:parseInt(I[2],10),column:parseInt(I[3],10)}}return null}function Cp(r){let a=r;return a=a.replace(/[?#].*$/,""),a=a.replace(/^turbopack:\/\/\/\[project\]\//,""),a=a.replace(/^webpack-internal:\/\/\/\.\//,""),a=a.replace(/^webpack-internal:\/\/\//,""),a=a.replace(/^webpack:\/\/\/\.\//,""),a=a.replace(/^webpack:\/\/\//,""),a=a.replace(/^turbopack:\/\/\//,""),a=a.replace(/^https?:\/\/[^/]+\//,""),a=a.replace(/^file:\/\/\//,"/"),a=a.replace(/^\([^)]+\)\/\.\//,""),a=a.replace(/^\.\//,""),a}function jp(r){const a=wp(r);if(!a)return null;if(Qs.has(a))return Qs.get(a);const u=kp();if(!u)return Qs.set(a,null),null;const f=u.get();let v=null;try{const _=new Proxy({},{get(){throw new Error("probe")}});u.set(_);try{a({})}catch(d){if(d instanceof Error&&d.message==="probe"&&d.stack){const I=Sp(d.stack);I&&(v={fileName:Cp(I.fileName),lineNumber:I.line,columnNumber:I.column,componentName:Il(r)||void 0})}}}finally{u.set(f)}return Qs.set(a,v),v}function Ep(r,a=15){let u=r,f=0;for(;u&&f<a;){const v=jp(u);if(v)return v;u=u.return,f++}return null}function Ga(r){const a=vp(r);if(!a)return{found:!1,reason:"no-fiber",isReactApp:!1,isProduction:!1};let u=xp(a);if(u||(u=bp(a)),u!=null&&u.source)return{found:!0,source:{fileName:u.source.fileName,lineNumber:u.source.lineNumber,columnNumber:u.source.columnNumber,componentName:u.componentName||void 0},isReactApp:!0,isProduction:!1};const f=Ep(a);return f?{found:!0,source:f,isReactApp:!0,isProduction:!1}:{found:!1,reason:"no-debug-source",isReactApp:!0,isProduction:!1}}function Np(r,a="path"){const{fileName:u,lineNumber:f,columnNumber:v}=r;let _=`${u}:${f}`;return v!==void 0&&(_+=`:${v}`),a==="vscode"?`vscode://file${u.startsWith("/")?"":"/"}${_}`:_}function Lp(r,a=10){let u=r,f=0;for(;u&&f<a;){const v=Ga(u);if(v.found)return v;u=u.parentElement,f++}return Ga(r)}var Tp=`svg[fill=none] {
  fill: none !important;
}

.styles-module__toolbar___wNsdK :where(button, input, select, textarea, label) {
  background: unset;
  border: unset;
  border-radius: unset;
  padding: unset;
  margin: unset;
  color: unset;
  font: unset;
  letter-spacing: unset;
  text-transform: unset;
  text-decoration: unset;
  box-shadow: unset;
  outline: unset;
}

@keyframes styles-module__toolbarEnter___u8RRu {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
@keyframes styles-module__toolbarHide___y8kaT {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}
@keyframes styles-module__badgeEnter___mVQLj {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleIn___c-r1K {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleOut___Wctwz {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
@keyframes styles-module__slideUp___kgD36 {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes styles-module__slideDown___zcdje {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
}
@keyframes styles-module__markerIn___5FaAP {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes styles-module__markerOut___GU5jX {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
}
@keyframes styles-module__fadeIn___b9qmf {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__fadeOut___6Ut6- {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes styles-module__tooltipIn___0N31w {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(2px) scale(0.891);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(0.909);
  }
}
@keyframes styles-module__hoverHighlightIn___6WYHY {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__hoverTooltipIn___FYGQx {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes styles-module__settingsPanelIn___MGfO8 {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
    filter: blur(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
}
@keyframes styles-module__settingsPanelOut___Zfymi {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    filter: blur(5px);
  }
}
.styles-module__toolbar___wNsdK {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  width: 297px;
  z-index: 100000;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: none;
  transition: left 0s, top 0s, right 0s, bottom 0s;
}

.styles-module__toolbarContainer___dIhma {
  user-select: none;
  margin-left: auto;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  cursor: grab;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toolbarContainer___dIhma.styles-module__dragging___xrolZ {
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: grabbing;
}
.styles-module__toolbarContainer___dIhma.styles-module__entrance___sgHd8 {
  animation: styles-module__toolbarEnter___u8RRu 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
}
.styles-module__toolbarContainer___dIhma.styles-module__hiding___1td44 {
  animation: styles-module__toolbarHide___y8kaT 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
  pointer-events: none;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  padding: 0;
  cursor: pointer;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn svg {
  margin-top: -1px;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #2a2a2a;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:active {
  transform: scale(0.95);
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx {
  height: 44px;
  border-radius: 1.5rem;
  padding: 0.375rem;
  width: 257px;
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx.styles-module__serverConnected___Gfbou {
  width: 297px;
}

.styles-module__toggleContent___0yfyP {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.1s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toggleContent___0yfyP.styles-module__visible___KHwEW {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.styles-module__toggleContent___0yfyP.styles-module__hidden___Ae8H4 {
  opacity: 0;
  pointer-events: none;
}

.styles-module__controlsContent___9GJWU {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: filter 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__controlsContent___9GJWU.styles-module__visible___KHwEW {
  opacity: 1;
  filter: blur(0px);
  transform: scale(1);
  visibility: visible;
  pointer-events: auto;
}
.styles-module__controlsContent___9GJWU.styles-module__hidden___Ae8H4 {
  pointer-events: none;
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.4);
}

.styles-module__badge___2XsgF {
  position: absolute;
  top: -13px;
  right: -13px;
  user-select: none;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #3c82f7;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.2s ease;
  transform: scale(1);
}
.styles-module__badge___2XsgF.styles-module__fadeOut___6Ut6- {
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}
.styles-module__badge___2XsgF.styles-module__entrance___sgHd8 {
  animation: styles-module__badgeEnter___mVQLj 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) 0.4s both;
}

.styles-module__controlButton___8Q0jc {
  position: relative;
  cursor: pointer !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease, opacity 0.2s ease;
}
.styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.styles-module__controlButton___8Q0jc:active:not(:disabled) {
  transform: scale(0.92);
}
.styles-module__controlButton___8Q0jc:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.styles-module__controlButton___8Q0jc[data-active=true] {
  color: #3c82f7;
  background: rgba(60, 130, 247, 0.25);
}
.styles-module__controlButton___8Q0jc[data-error=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.25);
}
.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  background: rgba(255, 59, 48, 0.25);
  color: #ff3b30;
}
.styles-module__controlButton___8Q0jc[data-no-hover=true], .styles-module__controlButton___8Q0jc.styles-module__statusShowing___te6iu {
  cursor: default !important;
  pointer-events: none;
  background: transparent !important;
}
.styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: #34c759;
  background: transparent;
  cursor: default;
}
.styles-module__controlButton___8Q0jc[data-failed=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.25);
}

.styles-module__buttonBadge___NeFWb {
  position: absolute;
  top: 0px;
  right: 0px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #3c82f7;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px #1a1a1a, 0 1px 3px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
.styles-module__buttonBadge___NeFWb.styles-module__light___r6n4Y {
  box-shadow: 0 0 0 2px #fff, 0 1px 3px rgba(0, 0, 0, 0.2);
}

@keyframes styles-module__mcpIndicatorPulseConnected___EDodZ {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(52, 199, 89, 0);
  }
}
@keyframes styles-module__mcpIndicatorPulseConnecting___cCYte {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(245, 166, 35, 0);
  }
}
.styles-module__mcpIndicator___zGJeL {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  transition: background 0.3s ease, opacity 0.15s ease, transform 0.15s ease;
  opacity: 1;
  transform: scale(1);
}
.styles-module__mcpIndicator___zGJeL.styles-module__connected___7c28g {
  background: #34c759;
  animation: styles-module__mcpIndicatorPulseConnected___EDodZ 2.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__connecting___uo-CW {
  background: #f5a623;
  animation: styles-module__mcpIndicatorPulseConnecting___cCYte 1.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__hidden___Ae8H4 {
  opacity: 0;
  transform: scale(0);
  animation: none;
}

@keyframes styles-module__connectionPulse___-Zycw {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}
.styles-module__connectionIndicatorWrapper___L-e-3 {
  width: 8px;
  height: 34px;
  margin-left: 6px;
  margin-right: 6px;
}

.styles-module__connectionIndicator___afk9p {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease, background 0.3s ease;
  cursor: default;
}

.styles-module__connectionIndicatorVisible___C-i5B {
  opacity: 1;
}

.styles-module__connectionIndicatorConnected___IY8pR {
  background: #34c759;
  animation: styles-module__connectionPulse___-Zycw 2.5s ease-in-out infinite;
}

.styles-module__connectionIndicatorDisconnected___kmpaZ {
  background: #ff3b30;
  animation: none;
}

.styles-module__connectionIndicatorConnecting___QmSLH {
  background: #f59e0b;
  animation: styles-module__connectionPulse___-Zycw 1s ease-in-out infinite;
}

.styles-module__buttonWrapper___rBcdv {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) scale(1);
  transition-delay: 0.85s;
}
.styles-module__buttonWrapper___rBcdv:has(.styles-module__controlButton___8Q0jc:disabled):hover .styles-module__buttonTooltip___Burd9 {
  opacity: 0;
  visibility: hidden;
}

.styles-module__tooltipsInSession___-0lHH .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  transition-delay: 0s;
}

.styles-module__sendButtonWrapper___UUxG6 {
  width: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  margin-left: -0.375rem;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1), margin 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6 .styles-module__controlButton___8Q0jc {
  transform: scale(0.8);
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU {
  width: 34px;
  opacity: 1;
  overflow: visible;
  pointer-events: auto;
  margin-left: 0;
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU .styles-module__controlButton___8Q0jc {
  transform: scale(1);
}

.styles-module__buttonTooltip___Burd9 {
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  padding: 6px 10px;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 100001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: opacity 0.135s ease, transform 0.135s ease, visibility 0.135s ease;
}
.styles-module__buttonTooltip___Burd9::after {
  content: "";
  position: absolute;
  top: calc(100% - 4px);
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: #1a1a1a;
  border-radius: 0 0 2px 0;
}

.styles-module__shortcut___lEAQk {
  margin-left: 4px;
  opacity: 0.5;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9 {
  bottom: auto;
  top: calc(100% + 14px);
  transform: translateX(-50%) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9::after {
  top: -4px;
  bottom: auto;
  border-radius: 2px 0 0 0;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-50%) scale(1);
}

.styles-module__tooltipsHidden___VtLJG .styles-module__buttonTooltip___Burd9 {
  opacity: 0 !important;
  visibility: hidden !important;
  transition: none !important;
}

.styles-module__tooltipVisible___0jcCv,
.styles-module__tooltipsHidden___VtLJG .styles-module__tooltipVisible___0jcCv {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) scale(1) !important;
  transition-delay: 0s !important;
}

.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(-12px) scale(0.95);
}
.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9::after {
  left: 16px;
}
.styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9::after {
  left: auto;
  right: 8px;
}
.styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__divider___c--s1 {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 0.125rem;
}

.styles-module__overlay___Q1O9y {
  position: fixed;
  inset: 0;
  z-index: 99997;
  pointer-events: none;
}
.styles-module__overlay___Q1O9y > * {
  pointer-events: auto;
}

.styles-module__hoverHighlight___ogakW {
  position: fixed;
  border: 2px solid rgba(60, 130, 247, 0.5);
  border-radius: 4px;
  pointer-events: none !important;
  background: rgba(60, 130, 247, 0.04);
  box-sizing: border-box;
  will-change: opacity;
  contain: layout style;
}
.styles-module__hoverHighlight___ogakW.styles-module__enter___WFIki {
  animation: styles-module__hoverHighlightIn___6WYHY 0.12s ease-out forwards;
}

.styles-module__multiSelectOutline___cSJ-m {
  position: fixed;
  border: 2px dashed rgba(52, 199, 89, 0.6);
  border-radius: 4px;
  pointer-events: none !important;
  background: rgba(52, 199, 89, 0.05);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__singleSelectOutline___QhX-O {
  position: fixed;
  border: 2px solid rgba(60, 130, 247, 0.6);
  border-radius: 4px;
  pointer-events: none !important;
  background: rgba(60, 130, 247, 0.05);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__hoverTooltip___bvLk7 {
  position: fixed;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.85);
  padding: 0.35rem 0.6rem;
  border-radius: 0.375rem;
  pointer-events: none !important;
  white-space: nowrap;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.styles-module__hoverTooltip___bvLk7.styles-module__enter___WFIki {
  animation: styles-module__hoverTooltipIn___FYGQx 0.1s ease-out forwards;
}

.styles-module__hoverReactPath___gx1IJ {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__hoverElementName___QMLMl {
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markersLayer___-25j1 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__markersLayer___-25j1 > * {
  pointer-events: auto;
}

.styles-module__fixedMarkersLayer___ffyX6 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__fixedMarkersLayer___ffyX6 > * {
  pointer-events: auto;
}

.styles-module__marker___6sQrs {
  position: absolute;
  width: 22px;
  height: 22px;
  background: #3c82f7;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  user-select: none;
  will-change: transform, opacity;
  contain: layout style;
  z-index: 1;
}
.styles-module__marker___6sQrs:hover {
  z-index: 2;
}
.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7) {
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.styles-module__marker___6sQrs.styles-module__enter___WFIki {
  animation: styles-module__markerIn___5FaAP 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.styles-module__marker___6sQrs.styles-module__exit___fyOJ0 {
  animation: styles-module__markerOut___GU5jX 0.2s ease-out both;
  pointer-events: none;
}
.styles-module__marker___6sQrs.styles-module__clearing___FQ--7 {
  animation: styles-module__markerOut___GU5jX 0.15s ease-out both;
  pointer-events: none;
}
.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7):hover {
  transform: translate(-50%, -50%) scale(1.1);
}
.styles-module__marker___6sQrs.styles-module__pending___2IHLC {
  position: fixed;
  background: #3c82f7;
}
.styles-module__marker___6sQrs.styles-module__fixed___dBMHC {
  position: fixed;
}
.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz {
  background: #34c759;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-size: 0.75rem;
}
.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz.styles-module__pending___2IHLC {
  background: #34c759;
}
.styles-module__marker___6sQrs.styles-module__hovered___ZgXIy {
  background: #ff3b30;
}

.styles-module__renumber___nCTxD {
  display: block;
  animation: styles-module__renumberRoll___Wgbq3 0.2s ease-out;
}

@keyframes styles-module__renumberRoll___Wgbq3 {
  0% {
    transform: translateX(-40%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.styles-module__markerTooltip___aLJID {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.909);
  z-index: 100002;
  background: #1a1a1a;
  padding: 8px 0.75rem;
  border-radius: 0.75rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 400;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  min-width: 120px;
  max-width: 200px;
  pointer-events: none;
  cursor: default;
}
.styles-module__markerTooltip___aLJID.styles-module__enter___WFIki {
  animation: styles-module__tooltipIn___0N31w 0.1s ease-out forwards;
}

.styles-module__markerQuote___FHmrz {
  display: block;
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.3125rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markerNote___QkrrS {
  display: block;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 2px;
}

.styles-module__markerHint___2iF-6 {
  display: block;
  font-size: 0.625rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.375rem;
  white-space: nowrap;
}

.styles-module__settingsPanel___OxX3Y {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  z-index: 1;
  overflow: hidden;
  background: #1c1c1c;
  border-radius: 1rem;
  padding: 13px 0 16px;
  min-width: 205px;
  cursor: default;
  opacity: 1;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: background 0.25s ease, box-shadow 0.25s ease;
}
.styles-module__settingsPanel___OxX3Y::before, .styles-module__settingsPanel___OxX3Y::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 2;
  pointer-events: none;
}
.styles-module__settingsPanel___OxX3Y::before {
  left: 0;
  background: linear-gradient(to right, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___OxX3Y::after {
  right: 0;
  background: linear-gradient(to left, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___OxX3Y .styles-module__settingsHeader___pwDY9,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrand___0gJeM,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrandSlash___uTG18,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsVersion___TUcFq,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsSection___m-YM2,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsLabel___8UjfX,
.styles-module__settingsPanel___OxX3Y .styles-module__cycleButton___FMKfw,
.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY,
.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz,
.styles-module__settingsPanel___OxX3Y .styles-module__toggleLabel___Xm8Aa,
.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax,
.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr,
.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp,
.styles-module__settingsPanel___OxX3Y .styles-module__helpIcon___xQg56,
.styles-module__settingsPanel___OxX3Y .styles-module__themeToggle___2rUjA {
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__enter___WFIki {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__exit___fyOJ0 {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf {
  background: #1a1a1a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsLabel___8UjfX {
  color: rgba(255, 255, 255, 0.6);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12 {
  color: rgba(255, 255, 255, 0.85);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12:hover {
  background: rgba(255, 255, 255, 0.1);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__toggleLabel___Xm8Aa {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__settingsPanelContainer___Xksv8 {
  overflow: visible;
  position: relative;
  display: flex;
  padding: 0 1rem;
}
.styles-module__settingsPanelContainer___Xksv8.styles-module__transitioning___qxzCk {
  overflow-x: clip;
  overflow-y: visible;
}

.styles-module__settingsPage___6YfHH {
  min-width: 100%;
  flex-shrink: 0;
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease-out;
  opacity: 1;
}

.styles-module__settingsPage___6YfHH.styles-module__slideLeft___Ps01J {
  transform: translateX(-100%);
  opacity: 0;
}

.styles-module__automationsPage___uvCq6 {
  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  padding: 3px 1rem 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.25s ease-out 0.1s;
  opacity: 0;
}

.styles-module__automationsPage___uvCq6.styles-module__slideIn___4-qXe {
  transform: translateX(-100%);
  opacity: 1;
}

.styles-module__settingsNavLink___wCzJt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___wCzJt:hover {
  color: rgba(255, 255, 255, 0.9);
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y:hover {
  color: rgba(0, 0, 0, 0.8);
}
.styles-module__settingsNavLink___wCzJt svg {
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___wCzJt:hover svg {
  color: #fff;
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y svg {
  color: rgba(0, 0, 0, 0.25);
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y:hover svg {
  color: rgba(0, 0, 0, 0.8);
}

.styles-module__settingsNavLinkRight___ZWwhj {
  display: flex;
  align-items: center;
  gap: 6px;
}

.styles-module__mcpNavIndicator___cl9pO {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpNavIndicator___cl9pO.styles-module__connected___7c28g {
  background: #34c759;
  animation: styles-module__mcpPulse___uNggr 2.5s ease-in-out infinite;
}
.styles-module__mcpNavIndicator___cl9pO.styles-module__connecting___uo-CW {
  background: #f5a623;
  animation: styles-module__mcpPulse___uNggr 1.5s ease-in-out infinite;
}

.styles-module__settingsBackButton___bIe2j {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0 12px 0;
  margin: -6px 0 0.5rem 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.12s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___bIe2j svg {
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___bIe2j:hover {
  border-bottom-color: rgba(255, 255, 255, 0.07);
}
.styles-module__settingsBackButton___bIe2j:hover svg {
  opacity: 1;
}
.styles-module__settingsBackButton___bIe2j.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.85);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}
.styles-module__settingsBackButton___bIe2j.styles-module__light___r6n4Y:hover {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.styles-module__automationHeader___InP0r {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #fff;
}
.styles-module__automationHeader___InP0r .styles-module__helpIcon___xQg56 svg {
  transform: none;
}
.styles-module__automationHeader___InP0r.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__automationDescription___NKlmo {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  line-height: 14px;
}
.styles-module__automationDescription___NKlmo.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__learnMoreLink___8xv-x {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__learnMoreLink___8xv-x:hover {
  color: #fff;
}
.styles-module__learnMoreLink___8xv-x.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
.styles-module__learnMoreLink___8xv-x.styles-module__light___r6n4Y:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__autoSendRow___UblX5 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.styles-module__autoSendLabel___icDc2 {
  font-size: 0.6875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__autoSendLabel___icDc2.styles-module__active___-zoN6 {
  color: #66b8ff;
}
.styles-module__autoSendLabel___icDc2.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__autoSendLabel___icDc2.styles-module__light___r6n4Y.styles-module__active___-zoN6 {
  color: #3c82f7;
}

.styles-module__webhookUrlInput___2375C {
  display: block;
  width: 100%;
  flex: 1;
  min-height: 60px;
  box-sizing: border-box;
  margin-top: 11px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: #fff;
  outline: none;
  resize: none;
  cursor: text !important;
  user-select: text;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}
.styles-module__webhookUrlInput___2375C::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__webhookUrlInput___2375C:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__webhookUrlInput___2375C.styles-module__light___r6n4Y {
  border-color: rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__webhookUrlInput___2375C.styles-module__light___r6n4Y::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.styles-module__webhookUrlInput___2375C.styles-module__light___r6n4Y:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__settingsHeader___pwDY9 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  margin-bottom: 0.5rem;
  padding-bottom: 9px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.styles-module__settingsBrand___0gJeM {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.0094em;
  color: #fff;
}

.styles-module__settingsBrandSlash___uTG18 {
  color: rgba(255, 255, 255, 0.5);
}

.styles-module__settingsVersion___TUcFq {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin-left: auto;
  letter-spacing: -0.0094em;
}

.styles-module__settingsSection___m-YM2 + .styles-module__settingsSection___m-YM2 {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__settingsSection___m-YM2.styles-module__settingsSectionExtraPadding___jdhFV {
  padding-top: calc(0.5rem + 4px);
}

.styles-module__settingsSectionGrow___h-5HZ {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.styles-module__settingsRow___3sdhc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}
.styles-module__settingsRow___3sdhc.styles-module__settingsRowMarginTop___zA0Sp {
  margin-top: 8px;
}

.styles-module__dropdownContainer___BVnxe {
  position: relative;
}

.styles-module__dropdownButton___16NPz {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__dropdownButton___16NPz:hover {
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__dropdownButton___16NPz svg {
  opacity: 0.6;
}

.styles-module__cycleButton___FMKfw {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  letter-spacing: -0.0094em;
}
.styles-module__cycleButton___FMKfw.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__cycleButton___FMKfw:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.styles-module__settingsRowDisabled___EgS0V .styles-module__settingsLabel___8UjfX {
  color: rgba(255, 255, 255, 0.2);
}
.styles-module__settingsRowDisabled___EgS0V .styles-module__settingsLabel___8UjfX.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__settingsRowDisabled___EgS0V .styles-module__toggleSwitch___l4Ygm {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes styles-module__cycleTextIn___Q6zJf {
  0% {
    opacity: 0;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.styles-module__cycleButtonText___fD1LR {
  display: inline-block;
  animation: styles-module__cycleTextIn___Q6zJf 0.2s ease-out;
}

.styles-module__cycleDots___LWuoQ {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.styles-module__cycleDot___nPgLY {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.667);
  transition: background-color 0.25s ease-out, transform 0.25s ease-out;
}
.styles-module__cycleDot___nPgLY.styles-module__active___-zoN6 {
  background: #fff;
  transform: scale(1);
}
.styles-module__cycleDot___nPgLY.styles-module__light___r6n4Y {
  background: rgba(0, 0, 0, 0.2);
}
.styles-module__cycleDot___nPgLY.styles-module__light___r6n4Y.styles-module__active___-zoN6 {
  background: rgba(0, 0, 0, 0.7);
}

.styles-module__dropdownMenu___k73ER {
  position: absolute;
  right: 0;
  top: calc(100% + 0.25rem);
  background: #1a1a1a;
  border-radius: 0.5rem;
  padding: 0.25rem;
  min-width: 120px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 10;
  animation: styles-module__scaleIn___c-r1K 0.15s ease-out;
}

.styles-module__dropdownItem___ylsLj {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.625rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__dropdownItem___ylsLj:hover {
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__dropdownItem___ylsLj.styles-module__selected___OwRqP {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 600;
}

.styles-module__settingsLabel___8UjfX {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 0.125rem;
}
.styles-module__settingsLabel___8UjfX.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__settingsLabelMarker___ewdtV {
  padding-top: 3px;
  margin-bottom: 10px;
}

.styles-module__settingsOptions___LyrBA {
  display: flex;
  gap: 0.25rem;
}

.styles-module__settingsOption___UNa12 {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.styles-module__settingsOption___UNa12:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {
  background: rgba(60, 130, 247, 0.15);
  color: #3c82f7;
}

.styles-module__sliderContainer___ducXj {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.styles-module__slider___GLdxp {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.styles-module__slider___GLdxp::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.styles-module__slider___GLdxp::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.styles-module__slider___GLdxp:hover::-webkit-slider-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.styles-module__slider___GLdxp:hover::-moz-range-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.styles-module__sliderLabels___FhLDB {
  display: flex;
  justify-content: space-between;
}

.styles-module__sliderLabel___U8sPr {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: color 0.15s ease;
}
.styles-module__sliderLabel___U8sPr:hover {
  color: rgba(255, 255, 255, 0.7);
}
.styles-module__sliderLabel___U8sPr.styles-module__active___-zoN6 {
  color: rgba(255, 255, 255, 0.9);
}

.styles-module__colorOptions___iHCNX {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.375rem;
  margin-bottom: 1px;
}

.styles-module__colorOption___IodiY {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
.styles-module__colorOption___IodiY:hover {
  transform: scale(1.15);
}
.styles-module__colorOption___IodiY.styles-module__selected___OwRqP {
  transform: scale(0.83);
}

.styles-module__colorOptionRing___U2xpo {
  display: flex;
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: border-color 0.3s ease;
}
.styles-module__settingsToggle___fBrFn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.styles-module__settingsToggle___fBrFn + .styles-module__settingsToggle___fBrFn {
  margin-top: calc(0.5rem + 6px);
}
.styles-module__settingsToggle___fBrFn input[type=checkbox] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.styles-module__settingsToggle___fBrFn.styles-module__settingsToggleMarginBottom___MZUyF {
  margin-bottom: calc(0.5rem + 6px);
}

.styles-module__customCheckbox___U39ax {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.styles-module__customCheckbox___U39ax svg {
  color: #1a1a1a;
  opacity: 1;
  transition: opacity 0.15s ease;
}
input[type=checkbox]:checked + .styles-module__customCheckbox___U39ax {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgb(255, 255, 255);
}
.styles-module__customCheckbox___U39ax.styles-module__light___r6n4Y {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
.styles-module__customCheckbox___U39ax.styles-module__light___r6n4Y.styles-module__checked___mnZLo {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
.styles-module__customCheckbox___U39ax.styles-module__light___r6n4Y.styles-module__checked___mnZLo svg {
  color: #fff;
}

.styles-module__toggleLabel___Xm8Aa {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.styles-module__toggleLabel___Xm8Aa.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__toggleSwitch___l4Ygm {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 16px;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.styles-module__toggleSwitch___l4Ygm input {
  opacity: 0;
  width: 0;
  height: 0;
}
.styles-module__toggleSwitch___l4Ygm input:checked + .styles-module__toggleSlider___wprIn {
  background: #3c82f7;
}
.styles-module__toggleSwitch___l4Ygm input:checked + .styles-module__toggleSlider___wprIn::before {
  transform: translateX(8px);
}
.styles-module__toggleSwitch___l4Ygm.styles-module__disabled___332Jw {
  opacity: 0.4;
  pointer-events: none;
}
.styles-module__toggleSwitch___l4Ygm.styles-module__disabled___332Jw .styles-module__toggleSlider___wprIn {
  cursor: not-allowed;
}

.styles-module__toggleSlider___wprIn {
  position: absolute;
  cursor: pointer;
  inset: 0;
  border-radius: 16px;
  background: #484848;
}
.styles-module__light___r6n4Y .styles-module__toggleSlider___wprIn {
  background: #dddddd;
}
.styles-module__toggleSlider___wprIn::before {
  content: "";
  position: absolute;
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

@keyframes styles-module__mcpPulse___uNggr {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(52, 199, 89, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0);
  }
}
@keyframes styles-module__mcpPulseError___fov9B {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.5);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(255, 59, 48, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0);
  }
}
.styles-module__mcpStatusDot___ibgkc {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__connecting___uo-CW {
  background: #f5a623;
  animation: styles-module__mcpPulse___uNggr 1.5s infinite;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__connected___7c28g {
  background: #34c759;
  animation: styles-module__mcpPulse___uNggr 2.5s ease-in-out infinite;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__disconnected___cHPxR {
  background: #ff3b30;
  animation: styles-module__mcpPulseError___fov9B 2s infinite;
}

.styles-module__helpIcon___xQg56 {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  margin-left: 0;
}
.styles-module__helpIcon___xQg56 svg {
  display: block;
  transform: translateY(1px);
  color: rgba(255, 255, 255, 0.2);
  transition: color 0.15s ease;
}
.styles-module__helpIcon___xQg56:hover svg {
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNudgeDown___0cqpM svg {
  transform: translateY(1px);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNoNudge___abogC svg {
  transform: translateY(0.5px);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNudge1-5___DM2TQ svg {
  transform: translateY(1.5px);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNudge2___TfWgC svg {
  transform: translateY(2px);
}

.styles-module__dragSelection___kZLq2 {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid rgba(52, 199, 89, 0.6);
  border-radius: 4px;
  background: rgba(52, 199, 89, 0.08);
  pointer-events: none;
  z-index: 99997;
  will-change: transform, width, height;
  contain: layout style;
}

.styles-module__dragCount___KM90j {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #34c759;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
}

.styles-module__highlightsContainer___-0xzG {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99996;
}

.styles-module__selectedElementHighlight___fyVlI {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid rgba(52, 199, 89, 0.5);
  border-radius: 4px;
  background: rgba(52, 199, 89, 0.06);
  pointer-events: none;
  will-change: transform, width, height;
  contain: layout style;
}

.styles-module__light___r6n4Y.styles-module__toolbarContainer___dIhma {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.styles-module__light___r6n4Y.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #f5f5f5;
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-active=true] {
  color: #3c82f7;
  background: rgba(60, 130, 247, 0.15);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-error=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.15);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  background: rgba(255, 59, 48, 0.15);
  color: #ff3b30;
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: #34c759;
  background: transparent;
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-failed=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.15);
}
.styles-module__light___r6n4Y.styles-module__buttonTooltip___Burd9 {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.styles-module__light___r6n4Y.styles-module__buttonTooltip___Burd9::after {
  background: #fff;
}
.styles-module__light___r6n4Y.styles-module__divider___c--s1 {
  background: rgba(0, 0, 0, 0.1);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID {
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID .styles-module__markerQuote___FHmrz {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID .styles-module__markerNote___QkrrS {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID .styles-module__markerHint___2iF-6 {
  color: rgba(0, 0, 0, 0.35);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y::before {
  background: linear-gradient(to right, #fff 0%, transparent 100%);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y::after {
  background: linear-gradient(to left, #fff 0%, transparent 100%);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsHeader___pwDY9 {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrand___0gJeM {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrandSlash___uTG18 {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsVersion___TUcFq {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsSection___m-YM2 {
  border-top-color: rgba(0, 0, 0, 0.08);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsLabel___8UjfX {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__cycleButton___FMKfw {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY {
  background: rgba(0, 0, 0, 0.2);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY.styles-module__active___-zoN6 {
  background: rgba(0, 0, 0, 0.7);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__toggleLabel___Xm8Aa {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax.styles-module__checked___mnZLo {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax.styles-module__checked___mnZLo svg {
  color: #fff;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr:hover {
  color: rgba(0, 0, 0, 0.7);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr.styles-module__active___-zoN6 {
  color: rgba(0, 0, 0, 0.9);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp {
  background: rgba(0, 0, 0, 0.1);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp::-webkit-slider-thumb {
  background: #1a1a1a;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp::-moz-range-thumb {
  background: #1a1a1a;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__helpIcon___xQg56 svg {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__helpIcon___xQg56:hover svg {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__themeToggle___2rUjA {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: 0.5rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.styles-module__themeToggle___2rUjA:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}
.styles-module__light___r6n4Y .styles-module__themeToggle___2rUjA {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y .styles-module__themeToggle___2rUjA:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.7);
}

.styles-module__themeIconWrapper___LsJIM {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 20px;
  height: 20px;
}

.styles-module__themeIcon___lCCmo {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: styles-module__themeIconIn___TU6ML 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes styles-module__themeIconIn___TU6ML {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-30deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}`,Pp={toolbar:"styles-module__toolbar___wNsdK",toolbarContainer:"styles-module__toolbarContainer___dIhma",dragging:"styles-module__dragging___xrolZ",entrance:"styles-module__entrance___sgHd8",toolbarEnter:"styles-module__toolbarEnter___u8RRu",hiding:"styles-module__hiding___1td44",toolbarHide:"styles-module__toolbarHide___y8kaT",collapsed:"styles-module__collapsed___Rydsn",expanded:"styles-module__expanded___ofKPx",serverConnected:"styles-module__serverConnected___Gfbou",toggleContent:"styles-module__toggleContent___0yfyP",visible:"styles-module__visible___KHwEW",hidden:"styles-module__hidden___Ae8H4",controlsContent:"styles-module__controlsContent___9GJWU",badge:"styles-module__badge___2XsgF",fadeOut:"styles-module__fadeOut___6Ut6-",badgeEnter:"styles-module__badgeEnter___mVQLj",controlButton:"styles-module__controlButton___8Q0jc",statusShowing:"styles-module__statusShowing___te6iu",buttonBadge:"styles-module__buttonBadge___NeFWb",light:"styles-module__light___r6n4Y",mcpIndicator:"styles-module__mcpIndicator___zGJeL",connected:"styles-module__connected___7c28g",mcpIndicatorPulseConnected:"styles-module__mcpIndicatorPulseConnected___EDodZ",connecting:"styles-module__connecting___uo-CW",mcpIndicatorPulseConnecting:"styles-module__mcpIndicatorPulseConnecting___cCYte",connectionIndicatorWrapper:"styles-module__connectionIndicatorWrapper___L-e-3",connectionIndicator:"styles-module__connectionIndicator___afk9p",connectionIndicatorVisible:"styles-module__connectionIndicatorVisible___C-i5B",connectionIndicatorConnected:"styles-module__connectionIndicatorConnected___IY8pR",connectionPulse:"styles-module__connectionPulse___-Zycw",connectionIndicatorDisconnected:"styles-module__connectionIndicatorDisconnected___kmpaZ",connectionIndicatorConnecting:"styles-module__connectionIndicatorConnecting___QmSLH",buttonWrapper:"styles-module__buttonWrapper___rBcdv",buttonTooltip:"styles-module__buttonTooltip___Burd9",tooltipsInSession:"styles-module__tooltipsInSession___-0lHH",sendButtonWrapper:"styles-module__sendButtonWrapper___UUxG6",sendButtonVisible:"styles-module__sendButtonVisible___WPSQU",shortcut:"styles-module__shortcut___lEAQk",tooltipBelow:"styles-module__tooltipBelow___m6ats",tooltipsHidden:"styles-module__tooltipsHidden___VtLJG",tooltipVisible:"styles-module__tooltipVisible___0jcCv",buttonWrapperAlignLeft:"styles-module__buttonWrapperAlignLeft___myzIp",buttonWrapperAlignRight:"styles-module__buttonWrapperAlignRight___HCQFR",divider:"styles-module__divider___c--s1",overlay:"styles-module__overlay___Q1O9y",hoverHighlight:"styles-module__hoverHighlight___ogakW",enter:"styles-module__enter___WFIki",hoverHighlightIn:"styles-module__hoverHighlightIn___6WYHY",multiSelectOutline:"styles-module__multiSelectOutline___cSJ-m",fadeIn:"styles-module__fadeIn___b9qmf",exit:"styles-module__exit___fyOJ0",singleSelectOutline:"styles-module__singleSelectOutline___QhX-O",hoverTooltip:"styles-module__hoverTooltip___bvLk7",hoverTooltipIn:"styles-module__hoverTooltipIn___FYGQx",hoverReactPath:"styles-module__hoverReactPath___gx1IJ",hoverElementName:"styles-module__hoverElementName___QMLMl",markersLayer:"styles-module__markersLayer___-25j1",fixedMarkersLayer:"styles-module__fixedMarkersLayer___ffyX6",marker:"styles-module__marker___6sQrs",clearing:"styles-module__clearing___FQ--7",markerIn:"styles-module__markerIn___5FaAP",markerOut:"styles-module__markerOut___GU5jX",pending:"styles-module__pending___2IHLC",fixed:"styles-module__fixed___dBMHC",multiSelect:"styles-module__multiSelect___YWiuz",hovered:"styles-module__hovered___ZgXIy",renumber:"styles-module__renumber___nCTxD",renumberRoll:"styles-module__renumberRoll___Wgbq3",markerTooltip:"styles-module__markerTooltip___aLJID",tooltipIn:"styles-module__tooltipIn___0N31w",markerQuote:"styles-module__markerQuote___FHmrz",markerNote:"styles-module__markerNote___QkrrS",markerHint:"styles-module__markerHint___2iF-6",settingsPanel:"styles-module__settingsPanel___OxX3Y",settingsHeader:"styles-module__settingsHeader___pwDY9",settingsBrand:"styles-module__settingsBrand___0gJeM",settingsBrandSlash:"styles-module__settingsBrandSlash___uTG18",settingsVersion:"styles-module__settingsVersion___TUcFq",settingsSection:"styles-module__settingsSection___m-YM2",settingsLabel:"styles-module__settingsLabel___8UjfX",cycleButton:"styles-module__cycleButton___FMKfw",cycleDot:"styles-module__cycleDot___nPgLY",dropdownButton:"styles-module__dropdownButton___16NPz",toggleLabel:"styles-module__toggleLabel___Xm8Aa",customCheckbox:"styles-module__customCheckbox___U39ax",sliderLabel:"styles-module__sliderLabel___U8sPr",slider:"styles-module__slider___GLdxp",helpIcon:"styles-module__helpIcon___xQg56",themeToggle:"styles-module__themeToggle___2rUjA",dark:"styles-module__dark___ILIQf",settingsOption:"styles-module__settingsOption___UNa12",selected:"styles-module__selected___OwRqP",settingsPanelContainer:"styles-module__settingsPanelContainer___Xksv8",transitioning:"styles-module__transitioning___qxzCk",settingsPage:"styles-module__settingsPage___6YfHH",slideLeft:"styles-module__slideLeft___Ps01J",automationsPage:"styles-module__automationsPage___uvCq6",slideIn:"styles-module__slideIn___4-qXe",settingsNavLink:"styles-module__settingsNavLink___wCzJt",settingsNavLinkRight:"styles-module__settingsNavLinkRight___ZWwhj",mcpNavIndicator:"styles-module__mcpNavIndicator___cl9pO",mcpPulse:"styles-module__mcpPulse___uNggr",settingsBackButton:"styles-module__settingsBackButton___bIe2j",automationHeader:"styles-module__automationHeader___InP0r",automationDescription:"styles-module__automationDescription___NKlmo",learnMoreLink:"styles-module__learnMoreLink___8xv-x",autoSendRow:"styles-module__autoSendRow___UblX5",autoSendLabel:"styles-module__autoSendLabel___icDc2",active:"styles-module__active___-zoN6",webhookUrlInput:"styles-module__webhookUrlInput___2375C",settingsSectionExtraPadding:"styles-module__settingsSectionExtraPadding___jdhFV",settingsSectionGrow:"styles-module__settingsSectionGrow___h-5HZ",settingsRow:"styles-module__settingsRow___3sdhc",settingsRowMarginTop:"styles-module__settingsRowMarginTop___zA0Sp",dropdownContainer:"styles-module__dropdownContainer___BVnxe",settingsRowDisabled:"styles-module__settingsRowDisabled___EgS0V",toggleSwitch:"styles-module__toggleSwitch___l4Ygm",cycleButtonText:"styles-module__cycleButtonText___fD1LR",cycleTextIn:"styles-module__cycleTextIn___Q6zJf",cycleDots:"styles-module__cycleDots___LWuoQ",dropdownMenu:"styles-module__dropdownMenu___k73ER",scaleIn:"styles-module__scaleIn___c-r1K",dropdownItem:"styles-module__dropdownItem___ylsLj",settingsLabelMarker:"styles-module__settingsLabelMarker___ewdtV",settingsOptions:"styles-module__settingsOptions___LyrBA",sliderContainer:"styles-module__sliderContainer___ducXj",sliderLabels:"styles-module__sliderLabels___FhLDB",colorOptions:"styles-module__colorOptions___iHCNX",colorOption:"styles-module__colorOption___IodiY",colorOptionRing:"styles-module__colorOptionRing___U2xpo",settingsToggle:"styles-module__settingsToggle___fBrFn",settingsToggleMarginBottom:"styles-module__settingsToggleMarginBottom___MZUyF",checked:"styles-module__checked___mnZLo",toggleSlider:"styles-module__toggleSlider___wprIn",disabled:"styles-module__disabled___332Jw",mcpStatusDot:"styles-module__mcpStatusDot___ibgkc",disconnected:"styles-module__disconnected___cHPxR",mcpPulseError:"styles-module__mcpPulseError___fov9B",helpIconNudgeDown:"styles-module__helpIconNudgeDown___0cqpM",helpIconNoNudge:"styles-module__helpIconNoNudge___abogC","helpIconNudge1-5":"styles-module__helpIconNudge1-5___DM2TQ",helpIconNudge2:"styles-module__helpIconNudge2___TfWgC",dragSelection:"styles-module__dragSelection___kZLq2",dragCount:"styles-module__dragCount___KM90j",highlightsContainer:"styles-module__highlightsContainer___-0xzG",selectedElementHighlight:"styles-module__selectedElementHighlight___fyVlI",themeIconWrapper:"styles-module__themeIconWrapper___LsJIM",themeIcon:"styles-module__themeIcon___lCCmo",themeIconIn:"styles-module__themeIconIn___TU6ML",scaleOut:"styles-module__scaleOut___Wctwz",slideUp:"styles-module__slideUp___kgD36",slideDown:"styles-module__slideDown___zcdje",settingsPanelIn:"styles-module__settingsPanelIn___MGfO8",settingsPanelOut:"styles-module__settingsPanelOut___Zfymi"};if(typeof document<"u"){let r=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");r||(r=document.createElement("style"),r.id="feedback-tool-styles-page-toolbar-css-styles",r.textContent=Tp,document.head.appendChild(r))}var h=Pp;function Ha(r,a="filtered"){const{name:u,path:f}=Js(r);if(a==="off")return{name:u,elementName:u,path:f,reactComponents:null};const v=yp(r,{mode:a});return{name:v.path?`${v.path} ${u}`:u,elementName:u,path:f,reactComponents:v.path}}var Fd=!1,Bd={outputDetail:"standard",autoClearAfterCopy:!1,annotationColor:"#3c82f7",blockInteractions:!0,reactEnabled:!0,markerClickBehavior:"edit",webhookUrl:"",webhooksEnabled:!0},Fn=r=>{if(!r||!r.trim())return!1;try{const a=new URL(r.trim());return a.protocol==="http:"||a.protocol==="https:"}catch{return!1}},Rl=[{value:"compact",label:"Compact"},{value:"standard",label:"Standard"},{value:"detailed",label:"Detailed"},{value:"forensic",label:"Forensic"}],Rp=[{value:"#AF52DE",label:"Purple"},{value:"#3c82f7",label:"Blue"},{value:"#5AC8FA",label:"Cyan"},{value:"#34C759",label:"Green"},{value:"#FFD60A",label:"Yellow"},{value:"#FF9500",label:"Orange"},{value:"#FF3B30",label:"Red"}];function Br(r,a){let u=document.elementFromPoint(r,a);if(!u)return null;for(;u!=null&&u.shadowRoot;){const f=u.shadowRoot.elementFromPoint(r,a);if(!f||f===u)break;u=f}return u}function Ua(r){let a=r;for(;a&&a!==document.body;){const f=window.getComputedStyle(a).position;if(f==="fixed"||f==="sticky")return!0;a=a.parentElement}return!1}function So(r){return r.status!=="resolved"&&r.status!=="dismissed"}function Gs(r){const a=Ga(r),u=a.found?a:Lp(r);if(u.found&&u.source)return Np(u.source,"path")}function Ad(r,a,u="standard",f="filtered"){if(r.length===0)return"";const v=typeof window<"u"?`${window.innerWidth}×${window.innerHeight}`:"unknown";let _=`## Page Feedback: ${a}
`;return u==="forensic"?(_+=`
**Environment:**
`,_+=`- Viewport: ${v}
`,typeof window<"u"&&(_+=`- URL: ${window.location.href}
`,_+=`- User Agent: ${navigator.userAgent}
`,_+=`- Timestamp: ${new Date().toISOString()}
`,_+=`- Device Pixel Ratio: ${window.devicePixelRatio}
`),_+=`
---
`):u!=="compact"&&(_+=`**Viewport:** ${v}
`),_+=`
`,r.forEach((d,I)=>{u==="compact"?(_+=`${I+1}. **${d.element}**${d.sourceFile?` (${d.sourceFile})`:""}: ${d.comment}`,d.selectedText&&(_+=` (re: "${d.selectedText.slice(0,30)}${d.selectedText.length>30?"...":""}")`),_+=`
`):u==="forensic"?(_+=`### ${I+1}. ${d.element}
`,d.isMultiSelect&&d.fullPath&&(_+=`*Forensic data shown for first element of selection*
`),d.fullPath&&(_+=`**Full DOM Path:** ${d.fullPath}
`),d.cssClasses&&(_+=`**CSS Classes:** ${d.cssClasses}
`),d.boundingBox&&(_+=`**Position:** x:${Math.round(d.boundingBox.x)}, y:${Math.round(d.boundingBox.y)} (${Math.round(d.boundingBox.width)}×${Math.round(d.boundingBox.height)}px)
`),_+=`**Annotation at:** ${d.x.toFixed(1)}% from left, ${Math.round(d.y)}px from top
`,d.selectedText&&(_+=`**Selected text:** "${d.selectedText}"
`),d.nearbyText&&!d.selectedText&&(_+=`**Context:** ${d.nearbyText.slice(0,100)}
`),d.computedStyles&&(_+=`**Computed Styles:** ${d.computedStyles}
`),d.accessibility&&(_+=`**Accessibility:** ${d.accessibility}
`),d.nearbyElements&&(_+=`**Nearby Elements:** ${d.nearbyElements}
`),d.sourceFile&&(_+=`**Source:** ${d.sourceFile}
`),d.reactComponents&&(_+=`**React:** ${d.reactComponents}
`),_+=`**Feedback:** ${d.comment}

`):(_+=`### ${I+1}. ${d.element}
`,_+=`**Location:** ${d.elementPath}
`,d.sourceFile&&(_+=`**Source:** ${d.sourceFile}
`),d.reactComponents&&(_+=`**React:** ${d.reactComponents}
`),u==="detailed"&&(d.cssClasses&&(_+=`**Classes:** ${d.cssClasses}
`),d.boundingBox&&(_+=`**Position:** ${Math.round(d.boundingBox.x)}px, ${Math.round(d.boundingBox.y)}px (${Math.round(d.boundingBox.width)}×${Math.round(d.boundingBox.height)}px)
`)),d.selectedText&&(_+=`**Selected text:** "${d.selectedText}"
`),u==="detailed"&&d.nearbyText&&!d.selectedText&&(_+=`**Context:** ${d.nearbyText.slice(0,100)}
`),_+=`**Feedback:** ${d.comment}

`)}),_.trim()}function Ip({demoAnnotations:r,demoDelay:a=1e3,enableDemoMode:u=!1,onAnnotationAdd:f,onAnnotationDelete:v,onAnnotationUpdate:_,onAnnotationsClear:d,onCopy:I,onSubmit:N,copyToClipboard:V=!0,endpoint:$,sessionId:p,onSessionCreated:x,webhookUrl:g,className:F}={}){var Qn,Fo,Vl;const[P,w]=C.useState(!1),[Y,B]=C.useState([]),[Q,ce]=C.useState(!0),[ge,ne]=C.useState(()=>op()),[J,ee]=C.useState(!1),we=C.useRef(null);C.useEffect(()=>{const m=z=>{const O=we.current;O&&O.contains(z.target)&&z.stopPropagation()},b=["mousedown","click","pointerdown"];return b.forEach(z=>document.body.addEventListener(z,m)),()=>{b.forEach(z=>document.body.removeEventListener(z,m))}},[]);const[X,Ke]=C.useState(!1),[Te,T]=C.useState(!1),[Ce,ye]=C.useState(null),[We,Ie]=C.useState({x:0,y:0}),[M,Z]=C.useState(null),[q,j]=C.useState(!1),[A,Ne]=C.useState("idle"),[Me,Oe]=C.useState(!1),[De,Qe]=C.useState(!1),[Be,Ge]=C.useState(null),[Ct,ln]=C.useState(null),[Yr,jn]=C.useState([]),[qo,Wr]=C.useState(null),[jo,er]=C.useState(null),[Le,Bn]=C.useState(null),[An,Pt]=C.useState(null),[tr,En]=C.useState([]),[Nn,Hr]=C.useState(0),[Ur,nr]=C.useState(!1),[qe,$l]=C.useState(!1),[jt,oo]=C.useState(!1),[Eo,or]=C.useState(!1),[zl,Ol]=C.useState(!1),[No,Lo]=C.useState("main"),[rr,lr]=C.useState(!1),[Xr,Ln]=C.useState(!1),[Yn,Vr]=C.useState(!1),Wn=C.useRef(null),[st,Hn]=C.useState([]),Zt=C.useRef({cmd:!1,shift:!1}),xt=()=>{Ln(!0)},Dl=()=>{Ln(!1)},To=()=>{Yn||(Wn.current=setTimeout(()=>Vr(!0),850))},Qr=()=>{Wn.current&&(clearTimeout(Wn.current),Wn.current=null),Vr(!1),Dl()};C.useEffect(()=>()=>{Wn.current&&clearTimeout(Wn.current)},[]);const sn=({content:m,children:b})=>{const[z,O]=C.useState(!1),[D,W]=C.useState(!1),[se,le]=C.useState(!1),[_e,Se]=C.useState({top:0,right:0}),pe=C.useRef(null),ke=C.useRef(null),he=C.useRef(null),be=()=>{if(pe.current){const pt=pe.current.getBoundingClientRect();Se({top:pt.top+pt.height/2,right:window.innerWidth-pt.left+8})}},ie=()=>{O(!0),le(!0),he.current&&(clearTimeout(he.current),he.current=null),be(),ke.current=Ae(()=>{W(!0)},500)},_t=()=>{O(!1),ke.current&&(clearTimeout(ke.current),ke.current=null),W(!1),he.current=Ae(()=>{le(!1)},150)};return C.useEffect(()=>()=>{ke.current&&clearTimeout(ke.current),he.current&&clearTimeout(he.current)},[]),i.jsxs(i.Fragment,{children:[i.jsx("span",{ref:pe,onMouseEnter:ie,onMouseLeave:_t,children:b}),se&&Td.createPortal(i.jsx("div",{"data-feedback-toolbar":!0,style:{position:"fixed",top:_e.top,right:_e.right,transform:"translateY(-50%)",padding:"6px 10px",background:"#383838",color:"rgba(255, 255, 255, 0.7)",fontSize:"11px",fontWeight:400,lineHeight:"14px",borderRadius:"10px",width:"180px",textAlign:"left",zIndex:100020,pointerEvents:"none",boxShadow:"0px 1px 8px rgba(0, 0, 0, 0.28)",opacity:D&&!rr?1:0,transition:"opacity 0.15s ease"},children:m}),document.body)]})},[te,At]=C.useState(Bd),[Ee,Po]=C.useState(!0),[sr,Fl]=C.useState(!1),Bl=!1,pn="off",[dt,ir]=C.useState(p??null),Gr=C.useRef(!1),[Et,Tn]=C.useState($?"connecting":"disconnected"),[Xe,ar]=C.useState(null),[an,Al]=C.useState(!1),[ro,nt]=C.useState(null),[ti,Kr]=C.useState(0),ur=C.useRef(!1),[Ro,Io]=C.useState(new Set),[Zr,Un]=C.useState(new Set),[Rt,cr]=C.useState(!1),[Jt,lo]=C.useState(!1),[hn,Yl]=C.useState(!1),gn=C.useRef(null),Dt=C.useRef(null),yn=C.useRef(null),Pn=C.useRef(null),dr=C.useRef(!1),Wl=C.useRef(0),so=C.useRef(null),Jr=C.useRef(null),Mo=8,$o=50,Hl=C.useRef(null),fr=C.useRef(null),Fe=C.useRef(null),Ve=typeof window<"u"?window.location.pathname:"/";C.useEffect(()=>{if(Eo)Ol(!0);else{Ln(!1),Lo("main");const m=Ae(()=>Ol(!1),0);return()=>clearTimeout(m)}},[Eo]),C.useEffect(()=>{lr(!0);const m=Ae(()=>lr(!1),350);return()=>clearTimeout(m)},[No]);const qr=P&&Q;C.useEffect(()=>{if(qr){T(!1),Ke(!0),Io(new Set);const m=Ae(()=>{Io(b=>{const z=new Set(b);return Y.forEach(O=>z.add(O.id)),z})},350);return()=>clearTimeout(m)}else if(X){T(!0);const m=Ae(()=>{Ke(!1),T(!1)},250);return()=>clearTimeout(m)}},[qr]),C.useEffect(()=>{$l(!0),Hr(window.scrollY);const m=Ba(Ve);B(m.filter(So)),Fd||(Fl(!0),Fd=!0,Ae(()=>Fl(!1),750));try{const b=localStorage.getItem("feedback-toolbar-settings");b&&At({...Bd,...JSON.parse(b)})}catch{}try{const b=localStorage.getItem("feedback-toolbar-theme");b!==null&&Po(b==="dark")}catch{}try{const b=localStorage.getItem("feedback-toolbar-position");if(b){const z=JSON.parse(b);typeof z.x=="number"&&typeof z.y=="number"&&ar(z)}}catch{}},[Ve]),C.useEffect(()=>{qe&&localStorage.setItem("feedback-toolbar-settings",JSON.stringify(te))},[te,qe]),C.useEffect(()=>{qe&&localStorage.setItem("feedback-toolbar-theme",Ee?"dark":"light")},[Ee,qe]);const mr=C.useRef(!1);C.useEffect(()=>{const m=mr.current;mr.current=an,m&&!an&&Xe&&qe&&localStorage.setItem("feedback-toolbar-position",JSON.stringify(Xe))},[an,Xe,qe]),C.useEffect(()=>{if(!$||!qe||Gr.current)return;Gr.current=!0,Tn("connecting"),(async()=>{try{const b=tp(Ve),z=p||b;let O=!1;if(z)try{const D=await $d($,z);ir(D.id),Tn("connected"),Aa(Ve,D.id),O=!0;const W=Ba(Ve),se=new Set(D.annotations.map(_e=>_e.id)),le=W.filter(_e=>!se.has(_e.id));if(le.length>0){const Se=`${typeof window<"u"?window.location.origin:""}${Ve}`,ke=(await Promise.allSettled(le.map(be=>Vs($,D.id,{...be,sessionId:D.id,url:Se})))).map((be,ie)=>be.status==="fulfilled"?be.value:(console.warn("[Agentation] Failed to sync annotation:",be.reason),le[ie])),he=[...D.annotations,...ke];B(he.filter(So)),Ll(Ve,he.filter(So),D.id)}else B(D.annotations.filter(So)),Ll(Ve,D.annotations.filter(So),D.id)}catch(D){console.warn("[Agentation] Could not join session, creating new:",D),np(Ve)}if(!O){const D=typeof window<"u"?window.location.href:"/",W=await Ya($,D);ir(W.id),Tn("connected"),Aa(Ve,W.id),x==null||x(W.id);const se=ep(),le=typeof window<"u"?window.location.origin:"",_e=[];for(const[Se,pe]of se){const ke=pe.filter(ie=>!ie._syncedTo);if(ke.length===0)continue;const he=`${le}${Se}`,be=Se===Ve;_e.push((async()=>{try{const ie=be?W:await Ya($,he),tn=(await Promise.allSettled(ke.map(ot=>Vs($,ie.id,{...ot,sessionId:ie.id,url:he})))).map((ot,ut)=>ot.status==="fulfilled"?ot.value:(console.warn("[Agentation] Failed to sync annotation:",ot.reason),ke[ut])).filter(So);if(Ll(Se,tn,ie.id),be){const ot=new Set(ke.map(ut=>ut.id));B(ut=>{const Pe=ut.filter(Re=>!ot.has(Re.id));return[...tn,...Pe]})}}catch(ie){console.warn(`[Agentation] Failed to sync annotations for ${Se}:`,ie)}})())}await Promise.allSettled(_e)}}catch(b){Tn("disconnected"),console.warn("[Agentation] Failed to initialize session, using local storage:",b)}})()},[$,p,qe,x,Ve]),C.useEffect(()=>{if(!$||!qe)return;const m=async()=>{try{(await fetch(`${$}/health`)).ok?Tn("connected"):Tn("disconnected")}catch{Tn("disconnected")}};m();const b=H_(m,1e4);return()=>clearInterval(b)},[$,qe]),C.useEffect(()=>{if(!$||!qe||!dt)return;const m=new EventSource(`${$}/sessions/${dt}/events`),b=["resolved","dismissed"],z=O=>{var D;try{const W=JSON.parse(O.data);if(b.includes((D=W.payload)==null?void 0:D.status)){const se=W.payload.id;Un(le=>new Set(le).add(se)),Ae(()=>{B(le=>le.filter(_e=>_e.id!==se)),Un(le=>{const _e=new Set(le);return _e.delete(se),_e})},150)}}catch{}};return m.addEventListener("annotation.updated",z),()=>{m.removeEventListener("annotation.updated",z),m.close()}},[$,qe,dt]),C.useEffect(()=>{if(!$||!qe)return;const m=Jr.current==="disconnected",b=Et==="connected";Jr.current=Et,m&&b&&(async()=>{try{const O=Ba(Ve);if(O.length===0)return;const W=`${typeof window<"u"?window.location.origin:""}${Ve}`;let se=dt,le=[];if(se)try{le=(await $d($,se)).annotations}catch{se=null}se||(se=(await Ya($,W)).id,ir(se),Aa(Ve,se));const _e=new Set(le.map(pe=>pe.id)),Se=O.filter(pe=>!_e.has(pe.id));if(Se.length>0){const ke=(await Promise.allSettled(Se.map(ie=>Vs($,se,{...ie,sessionId:se,url:W})))).map((ie,_t)=>ie.status==="fulfilled"?ie.value:(console.warn("[Agentation] Failed to sync annotation on reconnect:",ie.reason),Se[_t])),be=[...le,...ke].filter(So);B(be),Ll(Ve,be,se)}}catch(O){console.warn("[Agentation] Failed to sync on reconnect:",O)}})()},[Et,$,qe,dt,Ve]);const Ul=C.useCallback(()=>{J||(ee(!0),or(!1),w(!1),Ae(()=>{rp(!0),ne(!0),ee(!1)},400))},[J]);C.useEffect(()=>{if(!u||!qe||!r||r.length===0||Y.length>0)return;const m=[];return m.push(Ae(()=>{w(!0)},a-200)),r.forEach((b,z)=>{const O=a+z*300;m.push(Ae(()=>{const D=document.querySelector(b.selector);if(!D)return;const W=D.getBoundingClientRect(),{name:se,path:le}=Js(D),_e={id:`demo-${Date.now()}-${z}`,x:(W.left+W.width/2)/window.innerWidth*100,y:W.top+W.height/2+window.scrollY,comment:b.comment,element:se,elementPath:le,timestamp:Date.now(),selectedText:b.selectedText,boundingBox:{x:W.left,y:W.top+window.scrollY,width:W.width,height:W.height},nearbyText:El(D),cssClasses:Nl(D)};B(Se=>[...Se,_e])},O))}),()=>{m.forEach(clearTimeout)}},[u,qe,r,a]),C.useEffect(()=>{const m=()=>{Hr(window.scrollY),nr(!0),Fe.current&&clearTimeout(Fe.current),Fe.current=Ae(()=>{nr(!1)},150)};return window.addEventListener("scroll",m,{passive:!0}),()=>{window.removeEventListener("scroll",m),Fe.current&&clearTimeout(Fe.current)}},[]),C.useEffect(()=>{qe&&Y.length>0?dt?Ll(Ve,Y,dt):Zd(Ve,Y):qe&&Y.length===0&&localStorage.removeItem(qs(Ve))},[Y,Ve,qe,dt]);const el=C.useCallback(()=>{jt||(X_(),oo(!0))},[jt]),zo=C.useCallback(()=>{jt&&(Id(),oo(!1))},[jt]),Oo=C.useCallback(()=>{jt?zo():el()},[jt,el,zo]),Do=C.useCallback(()=>{if(st.length===0)return;const m=st[0],b=m.element,z=st.length>1,O=st.map(D=>D.element.getBoundingClientRect());if(z){const D={left:Math.min(...O.map(ie=>ie.left)),top:Math.min(...O.map(ie=>ie.top)),right:Math.max(...O.map(ie=>ie.right)),bottom:Math.max(...O.map(ie=>ie.bottom))},W=st.slice(0,5).map(ie=>ie.name).join(", "),se=st.length>5?` +${st.length-5} more`:"",le=O.map(ie=>({x:ie.left,y:ie.top+window.scrollY,width:ie.width,height:ie.height})),Se=st[st.length-1].element,pe=O[O.length-1],ke=pe.left+pe.width/2,he=pe.top+pe.height/2,be=Ua(Se);Z({x:ke/window.innerWidth*100,y:be?he:he+window.scrollY,clientY:he,element:`${st.length} elements: ${W}${se}`,elementPath:"multi-select",boundingBox:{x:D.left,y:D.top+window.scrollY,width:D.right-D.left,height:D.bottom-D.top},isMultiSelect:!0,isFixed:be,elementBoundingBoxes:le,multiSelectElements:st.map(ie=>ie.element),targetElement:Se,fullPath:Xs(b),accessibility:Us(b),computedStyles:Hs(b),computedStylesObj:Ws(b),nearbyElements:Ys(b),cssClasses:Nl(b),nearbyText:El(b),sourceFile:Gs(b)})}else{const D=O[0],W=Ua(b);Z({x:D.left/window.innerWidth*100,y:W?D.top:D.top+window.scrollY,clientY:D.top,element:m.name,elementPath:m.path,boundingBox:{x:D.left,y:W?D.top:D.top+window.scrollY,width:D.width,height:D.height},isFixed:W,fullPath:Xs(b),accessibility:Us(b),computedStyles:Hs(b),computedStylesObj:Ws(b),nearbyElements:Ys(b),cssClasses:Nl(b),nearbyText:El(b),reactComponents:m.reactComponents,sourceFile:Gs(b)})}Hn([]),ye(null)},[st]);C.useEffect(()=>{P||(Z(null),Bn(null),Pt(null),En([]),ye(null),or(!1),Hn([]),Zt.current={cmd:!1,shift:!1},jt&&zo())},[P,jt,zo]),C.useEffect(()=>()=>{Id()},[]),C.useEffect(()=>{if(!P)return;const m=document.createElement("style");return m.id="feedback-cursor-styles",m.textContent=`
      body * {
        cursor: crosshair !important;
      }
      body p, body span, body h1, body h2, body h3, body h4, body h5, body h6,
      body li, body td, body th, body label, body blockquote, body figcaption,
      body caption, body legend, body dt, body dd, body pre, body code,
      body em, body strong, body b, body i, body u, body s, body a,
      body time, body address, body cite, body q, body abbr, body dfn,
      body mark, body small, body sub, body sup, body [contenteditable],
      body p *, body span *, body h1 *, body h2 *, body h3 *, body h4 *,
      body h5 *, body h6 *, body li *, body a *, body label *, body pre *,
      body code *, body blockquote *, body [contenteditable] * {
        cursor: text !important;
      }
      [data-feedback-toolbar], [data-feedback-toolbar] * {
        cursor: default !important;
      }
      [data-feedback-toolbar] textarea,
      [data-feedback-toolbar] input[type="text"],
      [data-feedback-toolbar] input[type="url"] {
        cursor: text !important;
      }
      [data-feedback-toolbar] button,
      [data-feedback-toolbar] button *,
      [data-feedback-toolbar] label,
      [data-feedback-toolbar] label *,
      [data-feedback-toolbar] a,
      [data-feedback-toolbar] a *,
      [data-feedback-toolbar] [role="button"],
      [data-feedback-toolbar] [role="button"] * {
        cursor: pointer !important;
      }
      [data-annotation-marker], [data-annotation-marker] * {
        cursor: pointer !important;
      }
    `,document.head.appendChild(m),()=>{const b=document.getElementById("feedback-cursor-styles");b&&b.remove()}},[P]),C.useEffect(()=>{if(!P||M)return;const m=b=>{const z=b.composedPath()[0]||b.target;if(Kt(z,"[data-feedback-toolbar]")){ye(null);return}const O=Br(b.clientX,b.clientY);if(!O||Kt(O,"[data-feedback-toolbar]")){ye(null);return}const{name:D,elementName:W,path:se,reactComponents:le}=Ha(O,pn),_e=O.getBoundingClientRect();ye({element:D,elementName:W,elementPath:se,rect:_e,reactComponents:le}),Ie({x:b.clientX,y:b.clientY})};return document.addEventListener("mousemove",m),()=>document.removeEventListener("mousemove",m)},[P,M,pn]),C.useEffect(()=>{if(!P)return;const m=b=>{var pt,tn;if(dr.current){dr.current=!1;return}const z=b.composedPath()[0]||b.target;if(Kt(z,"[data-feedback-toolbar]")||Kt(z,"[data-annotation-popup]")||Kt(z,"[data-annotation-marker]"))return;if(b.metaKey&&b.shiftKey&&!M&&!Le){b.preventDefault(),b.stopPropagation();const ot=Br(b.clientX,b.clientY);if(!ot)return;const ut=ot.getBoundingClientRect(),{name:Pe,path:Re,reactComponents:It}=Ha(ot,pn),rt=st.findIndex(Yt=>Yt.element===ot);rt>=0?Hn(Yt=>Yt.filter((Wt,gr)=>gr!==rt)):Hn(Yt=>[...Yt,{element:ot,rect:ut,name:Pe,path:Re,reactComponents:It??void 0}]);return}const O=Kt(z,"button, a, input, select, textarea, [role='button'], [onclick]");if(te.blockInteractions&&O&&(b.preventDefault(),b.stopPropagation()),M){if(O&&!te.blockInteractions)return;b.preventDefault(),(pt=Hl.current)==null||pt.shake();return}if(Le){if(O&&!te.blockInteractions)return;b.preventDefault(),(tn=fr.current)==null||tn.shake();return}b.preventDefault();const D=Br(b.clientX,b.clientY);if(!D)return;const{name:W,path:se,reactComponents:le}=Ha(D,pn),_e=D.getBoundingClientRect(),Se=b.clientX/window.innerWidth*100,pe=Ua(D),ke=pe?b.clientY:b.clientY+window.scrollY,he=window.getSelection();let be;he&&he.toString().trim().length>0&&(be=he.toString().trim().slice(0,500));const ie=Ws(D),_t=Hs(D);Z({x:Se,y:ke,clientY:b.clientY,element:W,elementPath:se,selectedText:be,boundingBox:{x:_e.left,y:pe?_e.top:_e.top+window.scrollY,width:_e.width,height:_e.height},nearbyText:El(D),cssClasses:Nl(D),isFixed:pe,fullPath:Xs(D),accessibility:Us(D),computedStyles:_t,computedStylesObj:ie,nearbyElements:Ys(D),reactComponents:le??void 0,sourceFile:Gs(D),targetElement:D}),ye(null)};return document.addEventListener("click",m,!0),()=>document.removeEventListener("click",m,!0)},[P,M,Le,te.blockInteractions,pn,st]),C.useEffect(()=>{if(!P)return;const m=O=>{O.key==="Meta"&&(Zt.current.cmd=!0),O.key==="Shift"&&(Zt.current.shift=!0)},b=O=>{const D=Zt.current.cmd&&Zt.current.shift;O.key==="Meta"&&(Zt.current.cmd=!1),O.key==="Shift"&&(Zt.current.shift=!1);const W=Zt.current.cmd&&Zt.current.shift;D&&!W&&st.length>0&&Do()},z=()=>{Zt.current={cmd:!1,shift:!1},Hn([])};return document.addEventListener("keydown",m),document.addEventListener("keyup",b),window.addEventListener("blur",z),()=>{document.removeEventListener("keydown",m),document.removeEventListener("keyup",b),window.removeEventListener("blur",z)}},[P,st,Do]),C.useEffect(()=>{if(!P||M)return;const m=b=>{const z=b.composedPath()[0]||b.target;Kt(z,"[data-feedback-toolbar]")||Kt(z,"[data-annotation-marker]")||Kt(z,"[data-annotation-popup]")||new Set(["P","SPAN","H1","H2","H3","H4","H5","H6","LI","TD","TH","LABEL","BLOCKQUOTE","FIGCAPTION","CAPTION","LEGEND","DT","DD","PRE","CODE","EM","STRONG","B","I","U","S","A","TIME","ADDRESS","CITE","Q","ABBR","DFN","MARK","SMALL","SUB","SUP"]).has(z.tagName)||z.isContentEditable||(gn.current={x:b.clientX,y:b.clientY})};return document.addEventListener("mousedown",m),()=>document.removeEventListener("mousedown",m)},[P,M]),C.useEffect(()=>{if(!P||M)return;const m=b=>{if(!gn.current)return;const z=b.clientX-gn.current.x,O=b.clientY-gn.current.y,D=z*z+O*O,W=Mo*Mo;if(!hn&&D>=W&&(Dt.current=gn.current,Yl(!0)),(hn||D>=W)&&Dt.current){if(yn.current){const Pe=Math.min(Dt.current.x,b.clientX),Re=Math.min(Dt.current.y,b.clientY),It=Math.abs(b.clientX-Dt.current.x),rt=Math.abs(b.clientY-Dt.current.y);yn.current.style.transform=`translate(${Pe}px, ${Re}px)`,yn.current.style.width=`${It}px`,yn.current.style.height=`${rt}px`}const se=Date.now();if(se-Wl.current<$o)return;Wl.current=se;const le=Dt.current.x,_e=Dt.current.y,Se=Math.min(le,b.clientX),pe=Math.min(_e,b.clientY),ke=Math.max(le,b.clientX),he=Math.max(_e,b.clientY),be=(Se+ke)/2,ie=(pe+he)/2,_t=new Set,pt=[[Se,pe],[ke,pe],[Se,he],[ke,he],[be,ie],[be,pe],[be,he],[Se,ie],[ke,ie]];for(const[Pe,Re]of pt){const It=document.elementsFromPoint(Pe,Re);for(const rt of It)rt instanceof HTMLElement&&_t.add(rt)}const tn=document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav");for(const Pe of tn)if(Pe instanceof HTMLElement){const Re=Pe.getBoundingClientRect(),It=Re.left+Re.width/2,rt=Re.top+Re.height/2,Yt=It>=Se&&It<=ke&&rt>=pe&&rt<=he,Wt=Math.min(Re.right,ke)-Math.max(Re.left,Se),gr=Math.min(Re.bottom,he)-Math.max(Re.top,pe),oi=Wt>0&&gr>0?Wt*gr:0,Ql=Re.width*Re.height,ri=Ql>0?oi/Ql:0;(Yt||ri>.5)&&_t.add(Pe)}const ot=[],ut=new Set(["BUTTON","A","INPUT","IMG","P","H1","H2","H3","H4","H5","H6","LI","LABEL","TD","TH","SECTION","ARTICLE","ASIDE","NAV"]);for(const Pe of _t){if(Kt(Pe,"[data-feedback-toolbar]")||Kt(Pe,"[data-annotation-marker]"))continue;const Re=Pe.getBoundingClientRect();if(!(Re.width>window.innerWidth*.8&&Re.height>window.innerHeight*.5)&&!(Re.width<10||Re.height<10)&&Re.left<ke&&Re.right>Se&&Re.top<he&&Re.bottom>pe){const It=Pe.tagName;let rt=ut.has(It);if(!rt&&(It==="DIV"||It==="SPAN")){const Yt=Pe.textContent&&Pe.textContent.trim().length>0,Wt=Pe.onclick!==null||Pe.getAttribute("role")==="button"||Pe.getAttribute("role")==="link"||Pe.classList.contains("clickable")||Pe.hasAttribute("data-clickable");(Yt||Wt)&&!Pe.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")&&(rt=!0)}if(rt){let Yt=!1;for(const Wt of ot)if(Wt.left<=Re.left&&Wt.right>=Re.right&&Wt.top<=Re.top&&Wt.bottom>=Re.bottom){Yt=!0;break}Yt||ot.push(Re)}}}if(Pn.current){const Pe=Pn.current;for(;Pe.children.length>ot.length;)Pe.removeChild(Pe.lastChild);ot.forEach((Re,It)=>{let rt=Pe.children[It];rt||(rt=document.createElement("div"),rt.className=h.selectedElementHighlight,Pe.appendChild(rt)),rt.style.transform=`translate(${Re.left}px, ${Re.top}px)`,rt.style.width=`${Re.width}px`,rt.style.height=`${Re.height}px`})}}};return document.addEventListener("mousemove",m,{passive:!0}),()=>document.removeEventListener("mousemove",m)},[P,M,hn,Mo]),C.useEffect(()=>{if(!P)return;const m=b=>{const z=hn,O=Dt.current;if(hn&&O){dr.current=!0;const D=Math.min(O.x,b.clientX),W=Math.min(O.y,b.clientY),se=Math.max(O.x,b.clientX),le=Math.max(O.y,b.clientY),_e=[];document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th").forEach(be=>{if(!(be instanceof HTMLElement)||Kt(be,"[data-feedback-toolbar]")||Kt(be,"[data-annotation-marker]"))return;const ie=be.getBoundingClientRect();ie.width>window.innerWidth*.8&&ie.height>window.innerHeight*.5||ie.width<10||ie.height<10||ie.left<se&&ie.right>D&&ie.top<le&&ie.bottom>W&&_e.push({element:be,rect:ie})});const pe=_e.filter(({element:be})=>!_e.some(({element:ie})=>ie!==be&&be.contains(ie))),ke=b.clientX/window.innerWidth*100,he=b.clientY+window.scrollY;if(pe.length>0){const be=pe.reduce((ut,{rect:Pe})=>({left:Math.min(ut.left,Pe.left),top:Math.min(ut.top,Pe.top),right:Math.max(ut.right,Pe.right),bottom:Math.max(ut.bottom,Pe.bottom)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0}),ie=pe.slice(0,5).map(({element:ut})=>Js(ut).name).join(", "),_t=pe.length>5?` +${pe.length-5} more`:"",pt=pe[0].element,tn=Ws(pt),ot=Hs(pt);Z({x:ke,y:he,clientY:b.clientY,element:`${pe.length} elements: ${ie}${_t}`,elementPath:"multi-select",boundingBox:{x:be.left,y:be.top+window.scrollY,width:be.right-be.left,height:be.bottom-be.top},isMultiSelect:!0,fullPath:Xs(pt),accessibility:Us(pt),computedStyles:ot,computedStylesObj:tn,nearbyElements:Ys(pt),cssClasses:Nl(pt),nearbyText:El(pt),sourceFile:Gs(pt)})}else{const be=Math.abs(se-D),ie=Math.abs(le-W);be>20&&ie>20&&Z({x:ke,y:he,clientY:b.clientY,element:"Area selection",elementPath:`region at (${Math.round(D)}, ${Math.round(W)})`,boundingBox:{x:D,y:W+window.scrollY,width:be,height:ie},isMultiSelect:!0})}ye(null)}else z&&(dr.current=!0);gn.current=null,Dt.current=null,Yl(!1),Pn.current&&(Pn.current.innerHTML="")};return document.addEventListener("mouseup",m),()=>document.removeEventListener("mouseup",m)},[P,hn]);const gt=C.useCallback(async(m,b,z)=>{const O=te.webhookUrl||g;if(!O||!te.webhooksEnabled&&!z)return!1;try{return(await fetch(O,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:m,timestamp:Date.now(),url:typeof window<"u"?window.location.href:void 0,...b})})).ok}catch(D){return console.warn("[Agentation] Webhook failed:",D),!1}},[g,te.webhookUrl,te.webhooksEnabled]),Rn=C.useCallback(m=>{var z;if(!M)return;const b={id:Date.now().toString(),x:M.x,y:M.y,comment:m,element:M.element,elementPath:M.elementPath,timestamp:Date.now(),selectedText:M.selectedText,boundingBox:M.boundingBox,nearbyText:M.nearbyText,cssClasses:M.cssClasses,isMultiSelect:M.isMultiSelect,isFixed:M.isFixed,fullPath:M.fullPath,accessibility:M.accessibility,computedStyles:M.computedStyles,nearbyElements:M.nearbyElements,reactComponents:M.reactComponents,sourceFile:M.sourceFile,elementBoundingBoxes:M.elementBoundingBoxes,...$&&dt?{sessionId:dt,url:typeof window<"u"?window.location.href:void 0,status:"pending"}:{}};B(O=>[...O,b]),so.current=b.id,Ae(()=>{so.current=null},300),Ae(()=>{Io(O=>new Set(O).add(b.id))},250),f==null||f(b),gt("annotation.add",{annotation:b}),cr(!0),Ae(()=>{Z(null),cr(!1)},150),(z=window.getSelection())==null||z.removeAllRanges(),$&&dt&&Vs($,dt,b).then(O=>{O.id!==b.id&&(B(D=>D.map(W=>W.id===b.id?{...W,id:O.id}:W)),Io(D=>{const W=new Set(D);return W.delete(b.id),W.add(O.id),W}))}).catch(O=>{console.warn("[Agentation] Failed to sync annotation:",O)})},[M,f,gt,$,dt]),In=C.useCallback(()=>{cr(!0),Ae(()=>{Z(null),cr(!1)},150)},[]),Xn=C.useCallback(m=>{const b=Y.findIndex(O=>O.id===m),z=Y[b];(Le==null?void 0:Le.id)===m&&(lo(!0),Ae(()=>{Bn(null),Pt(null),En([]),lo(!1)},150)),Wr(m),Un(O=>new Set(O).add(m)),z&&(v==null||v(z),gt("annotation.delete",{annotation:z})),$&&zd($,m).catch(O=>{console.warn("[Agentation] Failed to delete annotation from server:",O)}),Ae(()=>{B(O=>O.filter(D=>D.id!==m)),Un(O=>{const D=new Set(O);return D.delete(m),D}),Wr(null),b<Y.length-1&&(er(b),Ae(()=>er(null),200))},150)},[Y,Le,v,gt,$]),Mn=C.useCallback(m=>{var b;if(Bn(m),Ge(null),ln(null),jn([]),(b=m.elementBoundingBoxes)!=null&&b.length){const z=[];for(const O of m.elementBoundingBoxes){const D=O.x+O.width/2,W=O.y+O.height/2-window.scrollY,se=Br(D,W);se&&z.push(se)}En(z),Pt(null)}else if(m.boundingBox){const z=m.boundingBox,O=z.x+z.width/2,D=m.isFixed?z.y+z.height/2:z.y+z.height/2-window.scrollY,W=Br(O,D);if(W){const se=W.getBoundingClientRect(),le=se.width/z.width,_e=se.height/z.height;le<.5||_e<.5?Pt(null):Pt(W)}else Pt(null);En([])}else Pt(null),En([])},[]),qt=C.useCallback(m=>{var b;if(!m){Ge(null),ln(null),jn([]);return}if(Ge(m.id),(b=m.elementBoundingBoxes)!=null&&b.length){const z=[];for(const O of m.elementBoundingBoxes){const D=O.x+O.width/2,W=O.y+O.height/2-window.scrollY,le=document.elementsFromPoint(D,W).find(_e=>!_e.closest("[data-annotation-marker]")&&!_e.closest("[data-agentation-root]"));le&&z.push(le)}jn(z),ln(null)}else if(m.boundingBox){const z=m.boundingBox,O=z.x+z.width/2,D=m.isFixed?z.y+z.height/2:z.y+z.height/2-window.scrollY,W=Br(O,D);if(W){const se=W.getBoundingClientRect(),le=se.width/z.width,_e=se.height/z.height;le<.5||_e<.5?ln(null):ln(W)}else ln(null);jn([])}else ln(null),jn([])},[]),ni=C.useCallback(m=>{if(!Le)return;const b={...Le,comment:m};B(z=>z.map(O=>O.id===Le.id?b:O)),_==null||_(b),gt("annotation.update",{annotation:b}),$&&lp($,Le.id,{comment:m}).catch(z=>{console.warn("[Agentation] Failed to update annotation on server:",z)}),lo(!0),Ae(()=>{Bn(null),Pt(null),En([]),lo(!1)},150)},[Le,_,gt,$]),Xl=C.useCallback(()=>{lo(!0),Ae(()=>{Bn(null),Pt(null),En([]),lo(!1)},150)},[]),en=C.useCallback(()=>{const m=Y.length;if(m===0)return;d==null||d(Y),gt("annotations.clear",{annotations:Y}),$&&Promise.all(Y.map(z=>zd($,z.id).catch(O=>{console.warn("[Agentation] Failed to delete annotation from server:",O)}))),Qe(!0),Oe(!0);const b=m*30+200;Ae(()=>{B([]),Io(new Set),localStorage.removeItem(qs(Ve)),Qe(!1)},b),Ae(()=>Oe(!1),1500)},[Ve,Y,d,gt,$]),tl=C.useCallback(async()=>{const m=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Ve,b=Ad(Y,m,te.outputDetail,pn);if(b){if(V)try{await navigator.clipboard.writeText(b)}catch{}I==null||I(b),j(!0),Ae(()=>j(!1),2e3),te.autoClearAfterCopy&&Ae(()=>en(),500)}},[Y,Ve,te.outputDetail,pn,te.autoClearAfterCopy,en,V,I]),_r=C.useCallback(async()=>{const m=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Ve,b=Ad(Y,m,te.outputDetail,pn);if(!b)return;N&&N(b,Y),Ne("sending"),await new Promise(O=>Ae(O,150));const z=await gt("submit",{output:b,annotations:Y},!0);Ne(z?"sent":"failed"),Ae(()=>Ne("idle"),2500),z&&te.autoClearAfterCopy&&Ae(()=>en(),500)},[N,gt,Y,Ve,te.outputDetail,pn,te.autoClearAfterCopy,en]);C.useEffect(()=>{if(!ro)return;const m=10,b=O=>{const D=O.clientX-ro.x,W=O.clientY-ro.y,se=Math.sqrt(D*D+W*W);if(!an&&se>m&&Al(!0),an||se>m){let le=ro.toolbarX+D,_e=ro.toolbarY+W;const Se=20,pe=297,ke=44,be=pe-(P?Et==="connected"?297:257:44),ie=Se-be,_t=window.innerWidth-Se-pe;le=Math.max(ie,Math.min(_t,le)),_e=Math.max(Se,Math.min(window.innerHeight-ke-Se,_e)),ar({x:le,y:_e})}},z=()=>{an&&(ur.current=!0),Al(!1),nt(null)};return document.addEventListener("mousemove",b),document.addEventListener("mouseup",z),()=>{document.removeEventListener("mousemove",b),document.removeEventListener("mouseup",z)}},[ro,an,P,Et]);const pr=C.useCallback(m=>{if(m.target.closest("button")||m.target.closest(`.${h.settingsPanel}`))return;const b=m.currentTarget.parentElement;if(!b)return;const z=b.getBoundingClientRect(),O=(Xe==null?void 0:Xe.x)??z.left,D=(Xe==null?void 0:Xe.y)??z.top,W=(Math.random()-.5)*10;Kr(W),nt({x:m.clientX,y:m.clientY,toolbarX:O,toolbarY:D})},[Xe]);if(C.useEffect(()=>{if(!Xe)return;const m=()=>{let D=Xe.x,W=Xe.y;const _e=20-(297-(P?Et==="connected"?297:257:44)),Se=window.innerWidth-20-297;D=Math.max(_e,Math.min(Se,D)),W=Math.max(20,Math.min(window.innerHeight-44-20,W)),(D!==Xe.x||W!==Xe.y)&&ar({x:D,y:W})};return m(),window.addEventListener("resize",m),()=>window.removeEventListener("resize",m)},[Xe,P,Et]),C.useEffect(()=>{const m=b=>{const z=b.target,O=z.tagName==="INPUT"||z.tagName==="TEXTAREA"||z.isContentEditable;if(b.key==="Escape"){if(st.length>0){Hn([]);return}M||P&&(xt(),w(!1))}if((b.metaKey||b.ctrlKey)&&b.shiftKey&&(b.key==="f"||b.key==="F")){b.preventDefault(),xt(),w(D=>!D);return}if(!(O||b.metaKey||b.ctrlKey)&&((b.key==="p"||b.key==="P")&&(b.preventDefault(),xt(),Oo()),(b.key==="h"||b.key==="H")&&Y.length>0&&(b.preventDefault(),xt(),ce(D=>!D)),(b.key==="c"||b.key==="C")&&Y.length>0&&(b.preventDefault(),xt(),tl()),(b.key==="x"||b.key==="X")&&Y.length>0&&(b.preventDefault(),xt(),en()),b.key==="s"||b.key==="S")){const D=Fn(te.webhookUrl)||Fn(g||"");Y.length>0&&D&&A==="idle"&&(b.preventDefault(),xt(),_r())}};return document.addEventListener("keydown",m),()=>document.removeEventListener("keydown",m)},[P,M,Y.length,te.webhookUrl,g,A,_r,Oo,tl,en,st]),!qe||ge)return null;const Vn=Y.length>0,hr=Y.filter(m=>!Zr.has(m.id)&&So(m)),io=Y.filter(m=>Zr.has(m.id)),ao=m=>{const W=m.x/100*window.innerWidth,se=typeof m.y=="string"?parseFloat(m.y):m.y,le={};window.innerHeight-se-22-10<80&&(le.top="auto",le.bottom="calc(100% + 10px)");const Se=W-200/2,pe=10;if(Se<pe){const ke=pe-Se;le.left=`calc(50% + ${ke}px)`}else if(Se+200>window.innerWidth-pe){const ke=Se+200-(window.innerWidth-pe);le.left=`calc(50% - ${ke}px)`}return le};return Td.createPortal(i.jsxs("div",{ref:we,style:{display:"contents"},children:[i.jsx("div",{className:`${h.toolbar}${F?` ${F}`:""}`,"data-feedback-toolbar":!0,style:Xe?{left:Xe.x,top:Xe.y,right:"auto",bottom:"auto"}:void 0,children:i.jsxs("div",{className:`${h.toolbarContainer} ${Ee?"":h.light} ${P?h.expanded:h.collapsed} ${sr?h.entrance:""} ${J?h.hiding:""} ${an?h.dragging:""} ${!te.webhooksEnabled&&(Fn(te.webhookUrl)||Fn(g||""))?h.serverConnected:""}`,onClick:P?void 0:m=>{if(ur.current){ur.current=!1,m.preventDefault();return}w(!0)},onMouseDown:pr,role:P?void 0:"button",tabIndex:P?-1:0,title:P?void 0:"Start feedback mode",style:{...an&&{transform:`scale(1.05) rotate(${ti}deg)`,cursor:"grabbing"}},children:[i.jsxs("div",{className:`${h.toggleContent} ${P?h.hidden:h.visible}`,children:[i.jsx(P_,{size:24}),Vn&&i.jsx("span",{className:`${h.badge} ${P?h.fadeOut:""} ${sr?h.entrance:""}`,style:{backgroundColor:te.annotationColor},children:Y.length})]}),i.jsxs("div",{className:`${h.controlsContent} ${P?h.visible:h.hidden} ${Xe&&Xe.y<100?h.tooltipBelow:""} ${Xr||Eo?h.tooltipsHidden:""} ${Yn?h.tooltipsInSession:""}`,onMouseEnter:To,onMouseLeave:Qr,children:[i.jsxs("div",{className:`${h.buttonWrapper} ${Xe&&Xe.x<120?h.buttonWrapperAlignLeft:""}`,children:[i.jsx("button",{className:`${h.controlButton} ${Ee?"":h.light}`,onClick:m=>{m.stopPropagation(),xt(),Oo()},"data-active":jt,children:i.jsx($_,{size:24,isPaused:jt})}),i.jsxs("span",{className:h.buttonTooltip,children:[jt?"Resume animations":"Pause animations",i.jsx("span",{className:h.shortcut,children:"P"})]})]}),i.jsxs("div",{className:h.buttonWrapper,children:[i.jsx("button",{className:`${h.controlButton} ${Ee?"":h.light}`,onClick:m=>{m.stopPropagation(),xt(),ce(!Q)},disabled:!Vn,children:i.jsx(M_,{size:24,isOpen:Q})}),i.jsxs("span",{className:h.buttonTooltip,children:[Q?"Hide markers":"Show markers",i.jsx("span",{className:h.shortcut,children:"H"})]})]}),i.jsxs("div",{className:h.buttonWrapper,children:[i.jsx("button",{className:`${h.controlButton} ${Ee?"":h.light} ${q?h.statusShowing:""}`,onClick:m=>{m.stopPropagation(),xt(),tl()},disabled:!Vn,"data-active":q,children:i.jsx(R_,{size:24,copied:q})}),i.jsxs("span",{className:h.buttonTooltip,children:["Copy feedback",i.jsx("span",{className:h.shortcut,children:"C"})]})]}),i.jsxs("div",{className:`${h.buttonWrapper} ${h.sendButtonWrapper} ${P&&!te.webhooksEnabled&&(Fn(te.webhookUrl)||Fn(g||""))?h.sendButtonVisible:""}`,children:[i.jsxs("button",{className:`${h.controlButton} ${Ee?"":h.light} ${A==="sent"||A==="failed"?h.statusShowing:""}`,onClick:m=>{m.stopPropagation(),xt(),_r()},disabled:!Vn||!Fn(te.webhookUrl)&&!Fn(g||"")||A==="sending","data-no-hover":A==="sent"||A==="failed",tabIndex:Fn(te.webhookUrl)||Fn(g||"")?0:-1,children:[i.jsx(I_,{size:24,state:A}),Vn&&A==="idle"&&i.jsx("span",{className:`${h.buttonBadge} ${Ee?"":h.light}`,style:{backgroundColor:te.annotationColor},children:Y.length})]}),i.jsxs("span",{className:h.buttonTooltip,children:["Send Annotations",i.jsx("span",{className:h.shortcut,children:"S"})]})]}),i.jsxs("div",{className:h.buttonWrapper,children:[i.jsx("button",{className:`${h.controlButton} ${Ee?"":h.light}`,onClick:m=>{m.stopPropagation(),xt(),en()},disabled:!Vn,"data-danger":!0,children:i.jsx(O_,{size:24})}),i.jsxs("span",{className:h.buttonTooltip,children:["Clear all",i.jsx("span",{className:h.shortcut,children:"X"})]})]}),i.jsxs("div",{className:h.buttonWrapper,children:[i.jsx("button",{className:`${h.controlButton} ${Ee?"":h.light}`,onClick:m=>{m.stopPropagation(),xt(),or(!Eo)},children:i.jsx(z_,{size:24})}),$&&Et!=="disconnected"&&i.jsx("span",{className:`${h.mcpIndicator} ${Ee?"":h.light} ${h[Et]} ${Eo?h.hidden:""}`,title:Et==="connected"?"MCP Connected":"MCP Connecting..."}),i.jsx("span",{className:h.buttonTooltip,children:"Settings"})]}),i.jsx("div",{className:`${h.divider} ${Ee?"":h.light}`}),i.jsxs("div",{className:`${h.buttonWrapper} ${Xe&&typeof window<"u"&&Xe.x>window.innerWidth-120?h.buttonWrapperAlignRight:""}`,children:[i.jsx("button",{className:`${h.controlButton} ${Ee?"":h.light}`,onClick:m=>{m.stopPropagation(),xt(),w(!1)},children:i.jsx(D_,{size:24})}),i.jsxs("span",{className:h.buttonTooltip,children:["Exit",i.jsx("span",{className:h.shortcut,children:"Esc"})]})]})]}),i.jsx("div",{className:`${h.settingsPanel} ${Ee?h.dark:h.light} ${zl?h.enter:h.exit}`,onClick:m=>m.stopPropagation(),style:Xe&&Xe.y<230?{bottom:"auto",top:"calc(100% + 0.5rem)"}:void 0,children:i.jsxs("div",{className:`${h.settingsPanelContainer} ${rr?h.transitioning:""}`,children:[i.jsxs("div",{className:`${h.settingsPage} ${No==="automations"?h.slideLeft:""}`,children:[i.jsxs("div",{className:h.settingsHeader,children:[i.jsxs("span",{className:h.settingsBrand,children:[i.jsx("span",{className:h.settingsBrandSlash,style:{color:te.annotationColor,transition:"color 0.2s ease"},children:"/"}),"agentation"]}),i.jsxs("span",{className:h.settingsVersion,children:["v","2.3.1"]}),i.jsx("button",{className:h.themeToggle,onClick:()=>Po(!Ee),title:Ee?"Switch to light mode":"Switch to dark mode",children:i.jsx("span",{className:h.themeIconWrapper,children:i.jsx("span",{className:h.themeIcon,children:Ee?i.jsx(F_,{size:20}):i.jsx(B_,{size:20})},Ee?"sun":"moon")})})]}),i.jsxs("div",{className:h.settingsSection,children:[i.jsxs("div",{className:h.settingsRow,children:[i.jsxs("div",{className:`${h.settingsLabel} ${Ee?"":h.light}`,children:["Output Detail",i.jsx(sn,{content:"Controls how much detail is included in the copied output",children:i.jsx("span",{className:h.helpIcon,children:i.jsx(Dr,{size:20})})})]}),i.jsxs("button",{className:`${h.cycleButton} ${Ee?"":h.light}`,onClick:()=>{const b=(Rl.findIndex(z=>z.value===te.outputDetail)+1)%Rl.length;At(z=>({...z,outputDetail:Rl[b].value}))},children:[i.jsx("span",{className:h.cycleButtonText,children:(Qn=Rl.find(m=>m.value===te.outputDetail))==null?void 0:Qn.label},te.outputDetail),i.jsx("span",{className:h.cycleDots,children:Rl.map((m,b)=>i.jsx("span",{className:`${h.cycleDot} ${Ee?"":h.light} ${te.outputDetail===m.value?h.active:""}`},m.value))})]})]}),i.jsxs("div",{className:`${h.settingsRow} ${h.settingsRowMarginTop} ${h.settingsRowDisabled}`,children:[i.jsxs("div",{className:`${h.settingsLabel} ${Ee?"":h.light}`,children:["React Components",i.jsx(sn,{content:"Disabled — production builds minify component names, making detection unreliable. Use in development mode.",children:i.jsx("span",{className:h.helpIcon,children:i.jsx(Dr,{size:20})})})]}),i.jsxs("label",{className:`${h.toggleSwitch} ${h.disabled}`,children:[i.jsx("input",{type:"checkbox",checked:Bl,disabled:!Bl,onChange:()=>At(m=>({...m,reactEnabled:!m.reactEnabled}))}),i.jsx("span",{className:h.toggleSlider})]})]}),i.jsxs("div",{className:`${h.settingsRow} ${h.settingsRowMarginTop}`,children:[i.jsxs("div",{className:`${h.settingsLabel} ${Ee?"":h.light}`,children:["Hide Until Restart",i.jsx(sn,{content:"Hides the toolbar until you open a new tab",children:i.jsx("span",{className:h.helpIcon,children:i.jsx(Dr,{size:20})})})]}),i.jsxs("label",{className:h.toggleSwitch,children:[i.jsx("input",{type:"checkbox",checked:!1,onChange:m=>{m.target.checked&&Ul()}}),i.jsx("span",{className:h.toggleSlider})]})]})]}),i.jsxs("div",{className:h.settingsSection,children:[i.jsx("div",{className:`${h.settingsLabel} ${h.settingsLabelMarker} ${Ee?"":h.light}`,children:"Marker Colour"}),i.jsx("div",{className:h.colorOptions,children:Rp.map(m=>i.jsx("div",{role:"button",onClick:()=>At(b=>({...b,annotationColor:m.value})),style:{borderColor:te.annotationColor===m.value?m.value:"transparent"},className:`${h.colorOptionRing} ${te.annotationColor===m.value?h.selected:""}`,children:i.jsx("div",{className:`${h.colorOption} ${te.annotationColor===m.value?h.selected:""}`,style:{backgroundColor:m.value},title:m.label})},m.value))})]}),i.jsxs("div",{className:h.settingsSection,children:[i.jsxs("label",{className:h.settingsToggle,children:[i.jsx("input",{type:"checkbox",id:"autoClearAfterCopy",checked:te.autoClearAfterCopy,onChange:m=>At(b=>({...b,autoClearAfterCopy:m.target.checked}))}),i.jsx("label",{className:`${h.customCheckbox} ${te.autoClearAfterCopy?h.checked:""}`,htmlFor:"autoClearAfterCopy",children:te.autoClearAfterCopy&&i.jsx(Pd,{size:14})}),i.jsxs("span",{className:`${h.toggleLabel} ${Ee?"":h.light}`,children:["Clear on copy/send",i.jsx(sn,{content:"Automatically clear annotations after copying",children:i.jsx("span",{className:`${h.helpIcon} ${h.helpIconNudge2}`,children:i.jsx(Dr,{size:20})})})]})]}),i.jsxs("label",{className:`${h.settingsToggle} ${h.settingsToggleMarginBottom}`,children:[i.jsx("input",{type:"checkbox",id:"blockInteractions",checked:te.blockInteractions,onChange:m=>At(b=>({...b,blockInteractions:m.target.checked}))}),i.jsx("label",{className:`${h.customCheckbox} ${te.blockInteractions?h.checked:""}`,htmlFor:"blockInteractions",children:te.blockInteractions&&i.jsx(Pd,{size:14})}),i.jsx("span",{className:`${h.toggleLabel} ${Ee?"":h.light}`,children:"Block page interactions"})]})]}),i.jsx("div",{className:`${h.settingsSection} ${h.settingsSectionExtraPadding}`,children:i.jsxs("button",{className:`${h.settingsNavLink} ${Ee?"":h.light}`,onClick:()=>Lo("automations"),children:[i.jsx("span",{children:"Manage MCP & Webhooks"}),i.jsxs("span",{className:h.settingsNavLinkRight,children:[$&&Et!=="disconnected"&&i.jsx("span",{className:`${h.mcpNavIndicator} ${h[Et]}`}),i.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:i.jsx("path",{d:"M7.5 12.5L12 8L7.5 3.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]})]})})]}),i.jsxs("div",{className:`${h.settingsPage} ${h.automationsPage} ${No==="automations"?h.slideIn:""}`,children:[i.jsxs("button",{className:`${h.settingsBackButton} ${Ee?"":h.light}`,onClick:()=>Lo("main"),children:[i.jsx(Y_,{size:16}),i.jsx("span",{children:"Manage MCP & Webhooks"})]}),i.jsxs("div",{className:h.settingsSection,children:[i.jsxs("div",{className:h.settingsRow,children:[i.jsxs("span",{className:`${h.automationHeader} ${Ee?"":h.light}`,children:["MCP Connection",i.jsx(sn,{content:"Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time.",children:i.jsx("span",{className:`${h.helpIcon} ${h.helpIconNudgeDown}`,children:i.jsx(Dr,{size:20})})})]}),$&&i.jsx("div",{className:`${h.mcpStatusDot} ${h[Et]}`,title:Et==="connected"?"Connected":Et==="connecting"?"Connecting...":"Disconnected"})]}),i.jsxs("p",{className:`${h.automationDescription} ${Ee?"":h.light}`,style:{paddingBottom:6},children:["MCP connection allows agents to receive and act on annotations."," ",i.jsx("a",{href:"https://agentation.dev/mcp",target:"_blank",rel:"noopener noreferrer",className:`${h.learnMoreLink} ${Ee?"":h.light}`,children:"Learn more"})]})]}),i.jsxs("div",{className:`${h.settingsSection} ${h.settingsSectionGrow}`,children:[i.jsxs("div",{className:h.settingsRow,children:[i.jsxs("span",{className:`${h.automationHeader} ${Ee?"":h.light}`,children:["Webhooks",i.jsx(sn,{content:"Send annotation data to any URL endpoint when annotations change. Useful for custom integrations.",children:i.jsx("span",{className:`${h.helpIcon} ${h.helpIconNoNudge}`,children:i.jsx(Dr,{size:20})})})]}),i.jsxs("div",{className:h.autoSendRow,children:[i.jsx("span",{className:`${h.autoSendLabel} ${Ee?"":h.light} ${te.webhooksEnabled?h.active:""}`,children:"Auto-Send"}),i.jsxs("label",{className:`${h.toggleSwitch} ${te.webhookUrl?"":h.disabled}`,children:[i.jsx("input",{type:"checkbox",checked:te.webhooksEnabled,disabled:!te.webhookUrl,onChange:()=>At(m=>({...m,webhooksEnabled:!m.webhooksEnabled}))}),i.jsx("span",{className:h.toggleSlider})]})]})]}),i.jsx("p",{className:`${h.automationDescription} ${Ee?"":h.light}`,children:"The webhook URL will receive live annotation changes and annotation data."}),i.jsx("textarea",{className:`${h.webhookUrlInput} ${Ee?"":h.light}`,placeholder:"Webhook URL",value:te.webhookUrl,style:{"--marker-color":te.annotationColor},onKeyDown:m=>m.stopPropagation(),onChange:m=>At(b=>({...b,webhookUrl:m.target.value}))})]})]})]})})]})}),i.jsxs("div",{className:h.markersLayer,"data-feedback-toolbar":!0,children:[X&&hr.filter(m=>!m.isFixed).map((m,b)=>{const z=!Te&&Be===m.id,O=qo===m.id,D=(z||O)&&!Le,W=m.isMultiSelect,se=W?"#34C759":te.annotationColor,le=Y.findIndex(ke=>ke.id===m.id),_e=!Ro.has(m.id),Se=Te?h.exit:De?h.clearing:_e?h.enter:"",pe=D&&te.markerClickBehavior==="delete";return i.jsxs("div",{className:`${h.marker} ${W?h.multiSelect:""} ${Se} ${pe?h.hovered:""}`,"data-annotation-marker":!0,style:{left:`${m.x}%`,top:m.y,backgroundColor:pe?void 0:se,animationDelay:Te?`${(hr.length-1-b)*20}ms`:`${b*20}ms`},onMouseEnter:()=>!Te&&m.id!==so.current&&qt(m),onMouseLeave:()=>qt(null),onClick:ke=>{ke.stopPropagation(),Te||(te.markerClickBehavior==="delete"?Xn(m.id):Mn(m))},onContextMenu:ke=>{te.markerClickBehavior==="delete"&&(ke.preventDefault(),ke.stopPropagation(),Te||Mn(m))},children:[D?pe?i.jsx(Oa,{size:W?18:16}):i.jsx(Rd,{size:16}):i.jsx("span",{className:jo!==null&&le>=jo?h.renumber:void 0,children:le+1}),z&&!Le&&i.jsxs("div",{className:`${h.markerTooltip} ${Ee?"":h.light} ${h.enter}`,style:ao(m),children:[i.jsxs("span",{className:h.markerQuote,children:[m.element,m.selectedText&&` "${m.selectedText.slice(0,30)}${m.selectedText.length>30?"...":""}"`]}),i.jsx("span",{className:h.markerNote,children:m.comment})]})]},m.id)}),X&&!Te&&io.filter(m=>!m.isFixed).map(m=>{const b=m.isMultiSelect;return i.jsx("div",{className:`${h.marker} ${h.hovered} ${b?h.multiSelect:""} ${h.exit}`,"data-annotation-marker":!0,style:{left:`${m.x}%`,top:m.y},children:i.jsx(Oa,{size:b?12:10})},m.id)})]}),i.jsxs("div",{className:h.fixedMarkersLayer,"data-feedback-toolbar":!0,children:[X&&hr.filter(m=>m.isFixed).map((m,b)=>{const z=hr.filter(he=>he.isFixed),O=!Te&&Be===m.id,D=qo===m.id,W=(O||D)&&!Le,se=m.isMultiSelect,le=se?"#34C759":te.annotationColor,_e=Y.findIndex(he=>he.id===m.id),Se=!Ro.has(m.id),pe=Te?h.exit:De?h.clearing:Se?h.enter:"",ke=W&&te.markerClickBehavior==="delete";return i.jsxs("div",{className:`${h.marker} ${h.fixed} ${se?h.multiSelect:""} ${pe} ${ke?h.hovered:""}`,"data-annotation-marker":!0,style:{left:`${m.x}%`,top:m.y,backgroundColor:ke?void 0:le,animationDelay:Te?`${(z.length-1-b)*20}ms`:`${b*20}ms`},onMouseEnter:()=>!Te&&m.id!==so.current&&qt(m),onMouseLeave:()=>qt(null),onClick:he=>{he.stopPropagation(),Te||(te.markerClickBehavior==="delete"?Xn(m.id):Mn(m))},onContextMenu:he=>{te.markerClickBehavior==="delete"&&(he.preventDefault(),he.stopPropagation(),Te||Mn(m))},children:[W?ke?i.jsx(Oa,{size:se?18:16}):i.jsx(Rd,{size:16}):i.jsx("span",{className:jo!==null&&_e>=jo?h.renumber:void 0,children:_e+1}),O&&!Le&&i.jsxs("div",{className:`${h.markerTooltip} ${Ee?"":h.light} ${h.enter}`,style:ao(m),children:[i.jsxs("span",{className:h.markerQuote,children:[m.element,m.selectedText&&` "${m.selectedText.slice(0,30)}${m.selectedText.length>30?"...":""}"`]}),i.jsx("span",{className:h.markerNote,children:m.comment})]})]},m.id)}),X&&!Te&&io.filter(m=>m.isFixed).map(m=>{const b=m.isMultiSelect;return i.jsx("div",{className:`${h.marker} ${h.fixed} ${h.hovered} ${b?h.multiSelect:""} ${h.exit}`,"data-annotation-marker":!0,style:{left:`${m.x}%`,top:m.y},children:i.jsx(L_,{size:b?12:10})},m.id)})]}),P&&i.jsxs("div",{className:h.overlay,"data-feedback-toolbar":!0,style:M||Le?{zIndex:99999}:void 0,children:[(Ce==null?void 0:Ce.rect)&&!M&&!Ur&&!hn&&i.jsx("div",{className:`${h.hoverHighlight} ${h.enter}`,style:{left:Ce.rect.left,top:Ce.rect.top,width:Ce.rect.width,height:Ce.rect.height,borderColor:`${te.annotationColor}80`,backgroundColor:`${te.annotationColor}0A`}}),st.filter(m=>document.contains(m.element)).map((m,b)=>{const z=m.element.getBoundingClientRect(),O=st.length>1;return i.jsx("div",{className:O?h.multiSelectOutline:h.singleSelectOutline,style:{position:"fixed",left:z.left,top:z.top,width:z.width,height:z.height,...O?{}:{borderColor:`${te.annotationColor}99`,backgroundColor:`${te.annotationColor}0D`}}},b)}),Be&&!M&&(()=>{var D;const m=Y.find(W=>W.id===Be);if(!(m!=null&&m.boundingBox))return null;if((D=m.elementBoundingBoxes)!=null&&D.length)return Yr.length>0?Yr.filter(W=>document.contains(W)).map((W,se)=>{const le=W.getBoundingClientRect();return i.jsx("div",{className:`${h.multiSelectOutline} ${h.enter}`,style:{left:le.left,top:le.top,width:le.width,height:le.height}},`hover-outline-live-${se}`)}):m.elementBoundingBoxes.map((W,se)=>i.jsx("div",{className:`${h.multiSelectOutline} ${h.enter}`,style:{left:W.x,top:W.y-Nn,width:W.width,height:W.height}},`hover-outline-${se}`));const b=Ct&&document.contains(Ct)?Ct.getBoundingClientRect():null,z=b?{x:b.left,y:b.top,width:b.width,height:b.height}:{x:m.boundingBox.x,y:m.isFixed?m.boundingBox.y:m.boundingBox.y-Nn,width:m.boundingBox.width,height:m.boundingBox.height},O=m.isMultiSelect;return i.jsx("div",{className:`${O?h.multiSelectOutline:h.singleSelectOutline} ${h.enter}`,style:{left:z.x,top:z.y,width:z.width,height:z.height,...O?{}:{borderColor:`${te.annotationColor}99`,backgroundColor:`${te.annotationColor}0D`}}})})(),Ce&&!M&&!Ur&&!hn&&i.jsxs("div",{className:`${h.hoverTooltip} ${h.enter}`,style:{left:Math.max(8,Math.min(We.x,window.innerWidth-100)),top:Math.max(We.y-(Ce.reactComponents?48:32),8)},children:[Ce.reactComponents&&i.jsx("div",{className:h.hoverReactPath,children:Ce.reactComponents}),i.jsx("div",{className:h.hoverElementName,children:Ce.elementName})]}),M&&i.jsxs(i.Fragment,{children:[(Fo=M.multiSelectElements)!=null&&Fo.length?M.multiSelectElements.filter(m=>document.contains(m)).map((m,b)=>{const z=m.getBoundingClientRect();return i.jsx("div",{className:`${h.multiSelectOutline} ${Rt?h.exit:h.enter}`,style:{left:z.left,top:z.top,width:z.width,height:z.height}},`pending-multi-${b}`)}):M.targetElement&&document.contains(M.targetElement)?(()=>{const m=M.targetElement.getBoundingClientRect();return i.jsx("div",{className:`${h.singleSelectOutline} ${Rt?h.exit:h.enter}`,style:{left:m.left,top:m.top,width:m.width,height:m.height,borderColor:`${te.annotationColor}99`,backgroundColor:`${te.annotationColor}0D`}})})():M.boundingBox&&i.jsx("div",{className:`${M.isMultiSelect?h.multiSelectOutline:h.singleSelectOutline} ${Rt?h.exit:h.enter}`,style:{left:M.boundingBox.x,top:M.boundingBox.y-Nn,width:M.boundingBox.width,height:M.boundingBox.height,...M.isMultiSelect?{}:{borderColor:`${te.annotationColor}99`,backgroundColor:`${te.annotationColor}0D`}}}),(()=>{const m=M.x,b=M.isFixed?M.y:M.y-Nn;return i.jsxs(i.Fragment,{children:[i.jsx("div",{className:`${h.marker} ${h.pending} ${M.isMultiSelect?h.multiSelect:""} ${Rt?h.exit:h.enter}`,style:{left:`${m}%`,top:b,backgroundColor:M.isMultiSelect?"#34C759":te.annotationColor},children:i.jsx(T_,{size:12})}),i.jsx(Md,{ref:Hl,element:M.element,selectedText:M.selectedText,computedStyles:M.computedStylesObj,placeholder:M.element==="Area selection"?"What should change in this area?":M.isMultiSelect?"Feedback for this group of elements...":"What should change?",onSubmit:Rn,onCancel:In,isExiting:Rt,lightMode:!Ee,accentColor:M.isMultiSelect?"#34C759":te.annotationColor,style:{left:Math.max(160,Math.min(window.innerWidth-160,m/100*window.innerWidth)),...b>window.innerHeight-290?{bottom:window.innerHeight-b+20}:{top:b+20}}})]})})()]}),Le&&i.jsxs(i.Fragment,{children:[(Vl=Le.elementBoundingBoxes)!=null&&Vl.length?tr.length>0?tr.filter(m=>document.contains(m)).map((m,b)=>{const z=m.getBoundingClientRect();return i.jsx("div",{className:`${h.multiSelectOutline} ${h.enter}`,style:{left:z.left,top:z.top,width:z.width,height:z.height}},`edit-multi-live-${b}`)}):Le.elementBoundingBoxes.map((m,b)=>i.jsx("div",{className:`${h.multiSelectOutline} ${h.enter}`,style:{left:m.x,top:m.y-Nn,width:m.width,height:m.height}},`edit-multi-${b}`)):(()=>{const m=An&&document.contains(An)?An.getBoundingClientRect():null,b=m?{x:m.left,y:m.top,width:m.width,height:m.height}:Le.boundingBox?{x:Le.boundingBox.x,y:Le.isFixed?Le.boundingBox.y:Le.boundingBox.y-Nn,width:Le.boundingBox.width,height:Le.boundingBox.height}:null;return b?i.jsx("div",{className:`${Le.isMultiSelect?h.multiSelectOutline:h.singleSelectOutline} ${h.enter}`,style:{left:b.x,top:b.y,width:b.width,height:b.height,...Le.isMultiSelect?{}:{borderColor:`${te.annotationColor}99`,backgroundColor:`${te.annotationColor}0D`}}}):null})(),i.jsx(Md,{ref:fr,element:Le.element,selectedText:Le.selectedText,computedStyles:q_(Le.computedStyles),placeholder:"Edit your feedback...",initialValue:Le.comment,submitLabel:"Save",onSubmit:ni,onCancel:Xl,onDelete:()=>Xn(Le.id),isExiting:Jt,lightMode:!Ee,accentColor:Le.isMultiSelect?"#34C759":te.annotationColor,style:(()=>{const m=Le.isFixed?Le.y:Le.y-Nn;return{left:Math.max(160,Math.min(window.innerWidth-160,Le.x/100*window.innerWidth)),...m>window.innerHeight-290?{bottom:window.innerHeight-m+20}:{top:m+20}}})()})]}),hn&&i.jsxs(i.Fragment,{children:[i.jsx("div",{ref:yn,className:h.dragSelection}),i.jsx("div",{ref:Pn,className:h.highlightsContainer})]})]})]}),document.body)}const Mp={design:Vd,device:h_,text:y_,effects:x_,export:b_};function $p(){const r=de(w=>w.activeTab),a=de(w=>w.config),u=de(w=>w.initScreens),f=de(w=>w.setPreviewSize),v=de(w=>w.setFonts),_=de(w=>w.setFrames),d=de(w=>w.setDeviceFamilies),I=de(w=>w.setKoubouAvailable),N=de(w=>w.setSizes),V=de(w=>w.setExportSize),$=de(w=>w.selectedScreen),p=de(w=>w.screens),[x,g]=C.useState(null),F=p[$];if(C.useEffect(()=>{async function w(){try{const[Y,B,Q]=await Promise.all([Xd(),Um(),Hm()]),ce=Y.app.platforms[0]??"iphone",ge=Ks[ce]??Ks.iphone;f(ge.w,ge.h),v(B),_(Q),u(Y,ce);try{const J=(await Xm()).families;d(J),I(!0)}catch{I(!1)}try{const ne=await Vm(),J={};for(const[we,X]of Object.entries(ne))J[we]=X;N(J);const ee=J[ce];ee&&ee.length>0&&V(ee[0].key)}catch{}}catch(Y){g(Y instanceof Error?Y.message:"Failed to load config")}}w()},[u,f,v,_,d,I,N,V]),x)return i.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-red-400",children:i.jsx("p",{children:x})});if(!a)return i.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-text-dim",children:"Loading..."});const P=Mp[r]??Vd;return i.jsxs("div",{className:"h-dvh flex overflow-hidden",children:[i.jsxs("div",{className:"w-80 min-w-80 bg-surface border-r border-border flex flex-col",children:[i.jsxs("div",{className:"px-5 py-4 border-b border-border",children:[i.jsx("h1",{className:"text-base font-semibold",children:"appframe"}),i.jsxs("div",{className:"flex items-center gap-2 mt-0.5",children:[i.jsx("p",{className:"text-xs text-text-dim",children:a.app.name}),F&&i.jsx("span",{className:"text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded",children:$+1})]})]}),i.jsx(Km,{}),i.jsx("div",{className:"flex-1 overflow-y-auto",children:i.jsx(P,{})})]}),i.jsx(C_,{}),i.jsx(Ip,{endpoint:"http://localhost:4747"})]})}const ef=document.getElementById("root");if(!ef)throw new Error("Root element not found");Nm.createRoot(ef).render(i.jsx(C.StrictMode,{children:i.jsx($p,{})}));
