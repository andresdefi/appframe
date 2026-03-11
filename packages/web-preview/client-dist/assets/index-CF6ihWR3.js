(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const _ of document.querySelectorAll('link[rel="modulepreload"]'))f(_);new MutationObserver(_=>{for(const m of _)if(m.type==="childList")for(const c of m.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&f(c)}).observe(document,{childList:!0,subtree:!0});function i(_){const m={};return _.integrity&&(m.integrity=_.integrity),_.referrerPolicy&&(m.referrerPolicy=_.referrerPolicy),_.crossOrigin==="use-credentials"?m.credentials="include":_.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function f(_){if(_.ep)return;_.ep=!0;const m=i(_);fetch(_.href,m)}})();function Kd(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Ia={exports:{}},Pl={},Ra={exports:{}},Oe={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _d;function Mm(){if(_d)return Oe;_d=1;var r=Symbol.for("react.element"),a=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),f=Symbol.for("react.strict_mode"),_=Symbol.for("react.profiler"),m=Symbol.for("react.provider"),c=Symbol.for("react.context"),w=Symbol.for("react.forward_ref"),C=Symbol.for("react.suspense"),H=Symbol.for("react.memo"),R=Symbol.for("react.lazy"),x=Symbol.iterator;function p(P){return P===null||typeof P!="object"?null:(P=x&&P[x]||P["@@iterator"],typeof P=="function"?P:null)}var v={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},F=Object.assign,I={};function N(P,U,Ne){this.props=P,this.context=U,this.refs=I,this.updater=Ne||v}N.prototype.isReactComponent={},N.prototype.setState=function(P,U){if(typeof P!="object"&&typeof P!="function"&&P!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,P,U,"setState")},N.prototype.forceUpdate=function(P){this.updater.enqueueForceUpdate(this,P,"forceUpdate")};function D(){}D.prototype=N.prototype;function Y(P,U,Ne){this.props=P,this.context=U,this.refs=I,this.updater=Ne||v}var T=Y.prototype=new D;T.constructor=Y,F(T,N.prototype),T.isPureReactComponent=!0;var A=Array.isArray,g=Object.prototype.hasOwnProperty,Q={current:null},ue={key:!0,ref:!0,__self:!0,__source:!0};function te(P,U,Ne){var ze,Be={},Ae=null,Ke=null;if(U!=null)for(ze in U.ref!==void 0&&(Ke=U.ref),U.key!==void 0&&(Ae=""+U.key),U)g.call(U,ze)&&!ue.hasOwnProperty(ze)&&(Be[ze]=U[ze]);var Ye=arguments.length-2;if(Ye===1)Be.children=Ne;else if(1<Ye){for(var Ze=Array(Ye),jt=0;jt<Ye;jt++)Ze[jt]=arguments[jt+2];Be.children=Ze}if(P&&P.defaultProps)for(ze in Ye=P.defaultProps,Ye)Be[ze]===void 0&&(Be[ze]=Ye[ze]);return{$$typeof:r,type:P,key:Ae,ref:Ke,props:Be,_owner:Q.current}}function ae(P,U){return{$$typeof:r,type:P.type,key:U,ref:P.ref,props:P.props,_owner:P._owner}}function Te(P){return typeof P=="object"&&P!==null&&P.$$typeof===r}function le(P){var U={"=":"=0",":":"=2"};return"$"+P.replace(/[=:]/g,function(Ne){return U[Ne]})}var fe=/\/+/g;function L(P,U){return typeof P=="object"&&P!==null&&P.key!=null?le(""+P.key):U.toString(36)}function z(P,U,Ne,ze,Be){var Ae=typeof P;(Ae==="undefined"||Ae==="boolean")&&(P=null);var Ke=!1;if(P===null)Ke=!0;else switch(Ae){case"string":case"number":Ke=!0;break;case"object":switch(P.$$typeof){case r:case a:Ke=!0}}if(Ke)return Ke=P,Be=Be(Ke),P=ze===""?"."+L(Ke,0):ze,A(Be)?(Ne="",P!=null&&(Ne=P.replace(fe,"$&/")+"/"),z(Be,U,Ne,"",function(jt){return jt})):Be!=null&&(Te(Be)&&(Be=ae(Be,Ne+(!Be.key||Ke&&Ke.key===Be.key?"":(""+Be.key).replace(fe,"$&/")+"/")+P)),U.push(Be)),1;if(Ke=0,ze=ze===""?".":ze+":",A(P))for(var Ye=0;Ye<P.length;Ye++){Ae=P[Ye];var Ze=ze+L(Ae,Ye);Ke+=z(Ae,U,Ne,Ze,Be)}else if(Ze=p(P),typeof Ze=="function")for(P=Ze.call(P),Ye=0;!(Ae=P.next()).done;)Ae=Ae.value,Ze=ze+L(Ae,Ye++),Ke+=z(Ae,U,Ne,Ze,Be);else if(Ae==="object")throw U=String(P),Error("Objects are not valid as a React child (found: "+(U==="[object Object]"?"object with keys {"+Object.keys(P).join(", ")+"}":U)+"). If you meant to render a collection of children, use an array instead.");return Ke}function ne(P,U,Ne){if(P==null)return P;var ze=[],Be=0;return z(P,ze,"","",function(Ae){return U.call(Ne,Ae,Be++)}),ze}function se(P){if(P._status===-1){var U=P._result;U=U(),U.then(function(Ne){(P._status===0||P._status===-1)&&(P._status=1,P._result=Ne)},function(Ne){(P._status===0||P._status===-1)&&(P._status=2,P._result=Ne)}),P._status===-1&&(P._status=0,P._result=U)}if(P._status===1)return P._result.default;throw P._result}var ce={current:null},$={transition:null},Z={ReactCurrentDispatcher:ce,ReactCurrentBatchConfig:$,ReactCurrentOwner:Q};function re(){throw Error("act(...) is not supported in production builds of React.")}return Oe.Children={map:ne,forEach:function(P,U,Ne){ne(P,function(){U.apply(this,arguments)},Ne)},count:function(P){var U=0;return ne(P,function(){U++}),U},toArray:function(P){return ne(P,function(U){return U})||[]},only:function(P){if(!Te(P))throw Error("React.Children.only expected to receive a single React element child.");return P}},Oe.Component=N,Oe.Fragment=i,Oe.Profiler=_,Oe.PureComponent=Y,Oe.StrictMode=f,Oe.Suspense=C,Oe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Z,Oe.act=re,Oe.cloneElement=function(P,U,Ne){if(P==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+P+".");var ze=F({},P.props),Be=P.key,Ae=P.ref,Ke=P._owner;if(U!=null){if(U.ref!==void 0&&(Ae=U.ref,Ke=Q.current),U.key!==void 0&&(Be=""+U.key),P.type&&P.type.defaultProps)var Ye=P.type.defaultProps;for(Ze in U)g.call(U,Ze)&&!ue.hasOwnProperty(Ze)&&(ze[Ze]=U[Ze]===void 0&&Ye!==void 0?Ye[Ze]:U[Ze])}var Ze=arguments.length-2;if(Ze===1)ze.children=Ne;else if(1<Ze){Ye=Array(Ze);for(var jt=0;jt<Ze;jt++)Ye[jt]=arguments[jt+2];ze.children=Ye}return{$$typeof:r,type:P.type,key:Be,ref:Ae,props:ze,_owner:Ke}},Oe.createContext=function(P){return P={$$typeof:c,_currentValue:P,_currentValue2:P,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},P.Provider={$$typeof:m,_context:P},P.Consumer=P},Oe.createElement=te,Oe.createFactory=function(P){var U=te.bind(null,P);return U.type=P,U},Oe.createRef=function(){return{current:null}},Oe.forwardRef=function(P){return{$$typeof:w,render:P}},Oe.isValidElement=Te,Oe.lazy=function(P){return{$$typeof:R,_payload:{_status:-1,_result:P},_init:se}},Oe.memo=function(P,U){return{$$typeof:H,type:P,compare:U===void 0?null:U}},Oe.startTransition=function(P){var U=$.transition;$.transition={};try{P()}finally{$.transition=U}},Oe.unstable_act=re,Oe.useCallback=function(P,U){return ce.current.useCallback(P,U)},Oe.useContext=function(P){return ce.current.useContext(P)},Oe.useDebugValue=function(){},Oe.useDeferredValue=function(P){return ce.current.useDeferredValue(P)},Oe.useEffect=function(P,U){return ce.current.useEffect(P,U)},Oe.useId=function(){return ce.current.useId()},Oe.useImperativeHandle=function(P,U,Ne){return ce.current.useImperativeHandle(P,U,Ne)},Oe.useInsertionEffect=function(P,U){return ce.current.useInsertionEffect(P,U)},Oe.useLayoutEffect=function(P,U){return ce.current.useLayoutEffect(P,U)},Oe.useMemo=function(P,U){return ce.current.useMemo(P,U)},Oe.useReducer=function(P,U,Ne){return ce.current.useReducer(P,U,Ne)},Oe.useRef=function(P){return ce.current.useRef(P)},Oe.useState=function(P){return ce.current.useState(P)},Oe.useSyncExternalStore=function(P,U,Ne){return ce.current.useSyncExternalStore(P,U,Ne)},Oe.useTransition=function(){return ce.current.useTransition()},Oe.version="18.3.1",Oe}var hd;function Dl(){return hd||(hd=1,Ra.exports=Mm()),Ra.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var gd;function zm(){if(gd)return Pl;gd=1;var r=Dl(),a=Symbol.for("react.element"),i=Symbol.for("react.fragment"),f=Object.prototype.hasOwnProperty,_=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,m={key:!0,ref:!0,__self:!0,__source:!0};function c(w,C,H){var R,x={},p=null,v=null;H!==void 0&&(p=""+H),C.key!==void 0&&(p=""+C.key),C.ref!==void 0&&(v=C.ref);for(R in C)f.call(C,R)&&!m.hasOwnProperty(R)&&(x[R]=C[R]);if(w&&w.defaultProps)for(R in C=w.defaultProps,C)x[R]===void 0&&(x[R]=C[R]);return{$$typeof:a,type:w,key:p,ref:v,props:x,_owner:_.current}}return Pl.Fragment=i,Pl.jsx=c,Pl.jsxs=c,Pl}var yd;function Om(){return yd||(yd=1,Ia.exports=zm()),Ia.exports}var l=Om(),S=Dl();const Zd=Kd(S);var Us={},$a={exports:{}},Zt={},Ma={exports:{}},za={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xd;function Dm(){return xd||(xd=1,(function(r){function a($,Z){var re=$.length;$.push(Z);e:for(;0<re;){var P=re-1>>>1,U=$[P];if(0<_(U,Z))$[P]=Z,$[re]=U,re=P;else break e}}function i($){return $.length===0?null:$[0]}function f($){if($.length===0)return null;var Z=$[0],re=$.pop();if(re!==Z){$[0]=re;e:for(var P=0,U=$.length,Ne=U>>>1;P<Ne;){var ze=2*(P+1)-1,Be=$[ze],Ae=ze+1,Ke=$[Ae];if(0>_(Be,re))Ae<U&&0>_(Ke,Be)?($[P]=Ke,$[Ae]=re,P=Ae):($[P]=Be,$[ze]=re,P=ze);else if(Ae<U&&0>_(Ke,re))$[P]=Ke,$[Ae]=re,P=Ae;else break e}}return Z}function _($,Z){var re=$.sortIndex-Z.sortIndex;return re!==0?re:$.id-Z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var m=performance;r.unstable_now=function(){return m.now()}}else{var c=Date,w=c.now();r.unstable_now=function(){return c.now()-w}}var C=[],H=[],R=1,x=null,p=3,v=!1,F=!1,I=!1,N=typeof setTimeout=="function"?setTimeout:null,D=typeof clearTimeout=="function"?clearTimeout:null,Y=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function T($){for(var Z=i(H);Z!==null;){if(Z.callback===null)f(H);else if(Z.startTime<=$)f(H),Z.sortIndex=Z.expirationTime,a(C,Z);else break;Z=i(H)}}function A($){if(I=!1,T($),!F)if(i(C)!==null)F=!0,se(g);else{var Z=i(H);Z!==null&&ce(A,Z.startTime-$)}}function g($,Z){F=!1,I&&(I=!1,D(te),te=-1),v=!0;var re=p;try{for(T(Z),x=i(C);x!==null&&(!(x.expirationTime>Z)||$&&!le());){var P=x.callback;if(typeof P=="function"){x.callback=null,p=x.priorityLevel;var U=P(x.expirationTime<=Z);Z=r.unstable_now(),typeof U=="function"?x.callback=U:x===i(C)&&f(C),T(Z)}else f(C);x=i(C)}if(x!==null)var Ne=!0;else{var ze=i(H);ze!==null&&ce(A,ze.startTime-Z),Ne=!1}return Ne}finally{x=null,p=re,v=!1}}var Q=!1,ue=null,te=-1,ae=5,Te=-1;function le(){return!(r.unstable_now()-Te<ae)}function fe(){if(ue!==null){var $=r.unstable_now();Te=$;var Z=!0;try{Z=ue(!0,$)}finally{Z?L():(Q=!1,ue=null)}}else Q=!1}var L;if(typeof Y=="function")L=function(){Y(fe)};else if(typeof MessageChannel<"u"){var z=new MessageChannel,ne=z.port2;z.port1.onmessage=fe,L=function(){ne.postMessage(null)}}else L=function(){N(fe,0)};function se($){ue=$,Q||(Q=!0,L())}function ce($,Z){te=N(function(){$(r.unstable_now())},Z)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function($){$.callback=null},r.unstable_continueExecution=function(){F||v||(F=!0,se(g))},r.unstable_forceFrameRate=function($){0>$||125<$?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ae=0<$?Math.floor(1e3/$):5},r.unstable_getCurrentPriorityLevel=function(){return p},r.unstable_getFirstCallbackNode=function(){return i(C)},r.unstable_next=function($){switch(p){case 1:case 2:case 3:var Z=3;break;default:Z=p}var re=p;p=Z;try{return $()}finally{p=re}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function($,Z){switch($){case 1:case 2:case 3:case 4:case 5:break;default:$=3}var re=p;p=$;try{return Z()}finally{p=re}},r.unstable_scheduleCallback=function($,Z,re){var P=r.unstable_now();switch(typeof re=="object"&&re!==null?(re=re.delay,re=typeof re=="number"&&0<re?P+re:P):re=P,$){case 1:var U=-1;break;case 2:U=250;break;case 5:U=1073741823;break;case 4:U=1e4;break;default:U=5e3}return U=re+U,$={id:R++,callback:Z,priorityLevel:$,startTime:re,expirationTime:U,sortIndex:-1},re>P?($.sortIndex=re,a(H,$),i(C)===null&&$===i(H)&&(I?(D(te),te=-1):I=!0,ce(A,re-P))):($.sortIndex=U,a(C,$),F||v||(F=!0,se(g))),$},r.unstable_shouldYield=le,r.unstable_wrapCallback=function($){var Z=p;return function(){var re=p;p=Z;try{return $.apply(this,arguments)}finally{p=re}}}})(za)),za}var vd;function Fm(){return vd||(vd=1,Ma.exports=Dm()),Ma.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bd;function Bm(){if(bd)return Zt;bd=1;var r=Dl(),a=Fm();function i(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var f=new Set,_={};function m(e,t){c(e,t),c(e+"Capture",t)}function c(e,t){for(_[e]=t,e=0;e<t.length;e++)f.add(t[e])}var w=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),C=Object.prototype.hasOwnProperty,H=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,R={},x={};function p(e){return C.call(x,e)?!0:C.call(R,e)?!1:H.test(e)?x[e]=!0:(R[e]=!0,!1)}function v(e,t,n,o){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function F(e,t,n,o){if(t===null||typeof t>"u"||v(e,t,n,o))return!0;if(o)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function I(e,t,n,o,s,u,d){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=s,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=u,this.removeEmptyString=d}var N={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){N[e]=new I(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];N[t]=new I(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){N[e]=new I(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){N[e]=new I(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){N[e]=new I(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){N[e]=new I(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){N[e]=new I(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){N[e]=new I(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){N[e]=new I(e,5,!1,e.toLowerCase(),null,!1,!1)});var D=/[\-:]([a-z])/g;function Y(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(D,Y);N[t]=new I(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(D,Y);N[t]=new I(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(D,Y);N[t]=new I(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){N[e]=new I(e,1,!1,e.toLowerCase(),null,!1,!1)}),N.xlinkHref=new I("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){N[e]=new I(e,1,!1,e.toLowerCase(),null,!0,!0)});function T(e,t,n,o){var s=N.hasOwnProperty(t)?N[t]:null;(s!==null?s.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(F(t,n,s,o)&&(n=null),o||s===null?p(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):s.mustUseProperty?e[s.propertyName]=n===null?s.type===3?!1:"":n:(t=s.attributeName,o=s.attributeNamespace,n===null?e.removeAttribute(t):(s=s.type,n=s===3||s===4&&n===!0?"":""+n,o?e.setAttributeNS(o,t,n):e.setAttribute(t,n))))}var A=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,g=Symbol.for("react.element"),Q=Symbol.for("react.portal"),ue=Symbol.for("react.fragment"),te=Symbol.for("react.strict_mode"),ae=Symbol.for("react.profiler"),Te=Symbol.for("react.provider"),le=Symbol.for("react.context"),fe=Symbol.for("react.forward_ref"),L=Symbol.for("react.suspense"),z=Symbol.for("react.suspense_list"),ne=Symbol.for("react.memo"),se=Symbol.for("react.lazy"),ce=Symbol.for("react.offscreen"),$=Symbol.iterator;function Z(e){return e===null||typeof e!="object"?null:(e=$&&e[$]||e["@@iterator"],typeof e=="function"?e:null)}var re=Object.assign,P;function U(e){if(P===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);P=t&&t[1]||""}return`
`+P+e}var Ne=!1;function ze(e,t){if(!e||Ne)return"";Ne=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(B){var o=B}Reflect.construct(e,[],t)}else{try{t.call()}catch(B){o=B}e.call(t.prototype)}else{try{throw Error()}catch(B){o=B}e()}}catch(B){if(B&&o&&typeof B.stack=="string"){for(var s=B.stack.split(`
`),u=o.stack.split(`
`),d=s.length-1,b=u.length-1;1<=d&&0<=b&&s[d]!==u[b];)b--;for(;1<=d&&0<=b;d--,b--)if(s[d]!==u[b]){if(d!==1||b!==1)do if(d--,b--,0>b||s[d]!==u[b]){var j=`
`+s[d].replace(" at new "," at ");return e.displayName&&j.includes("<anonymous>")&&(j=j.replace("<anonymous>",e.displayName)),j}while(1<=d&&0<=b);break}}}finally{Ne=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?U(e):""}function Be(e){switch(e.tag){case 5:return U(e.type);case 16:return U("Lazy");case 13:return U("Suspense");case 19:return U("SuspenseList");case 0:case 2:case 15:return e=ze(e.type,!1),e;case 11:return e=ze(e.type.render,!1),e;case 1:return e=ze(e.type,!0),e;default:return""}}function Ae(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ue:return"Fragment";case Q:return"Portal";case ae:return"Profiler";case te:return"StrictMode";case L:return"Suspense";case z:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case le:return(e.displayName||"Context")+".Consumer";case Te:return(e._context.displayName||"Context")+".Provider";case fe:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ne:return t=e.displayName||null,t!==null?t:Ae(e.type)||"Memo";case se:t=e._payload,e=e._init;try{return Ae(e(t))}catch{}}return null}function Ke(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ae(t);case 8:return t===te?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Ye(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ze(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function jt(e){var t=Ze(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var s=n.get,u=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(d){o=""+d,u.call(this,d)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return o},setValue:function(d){o=""+d},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function an(e){e._valueTracker||(e._valueTracker=jt(e))}function Ur(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=Ze(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}function En(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function tr(e,t){var n=t.checked;return re({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Xr(e,t){var n=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;n=Ye(t.value!=null?t.value:n),e._wrapperState={initialChecked:o,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function No(e,t){t=t.checked,t!=null&&T(e,"checked",t,!1)}function nr(e,t){No(e,t);var n=Ye(t.value),o=t.type;if(n!=null)o==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?An(e,t.type,n):t.hasOwnProperty("defaultValue")&&An(e,t.type,Ye(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Re(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function An(e,t,n){(t!=="number"||En(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Wn=Array.isArray;function Tt(e,t,n,o){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&o&&(e[n].defaultSelected=!0)}else{for(n=""+Ye(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,o&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function or(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(i(91));return re({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Nn(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(i(92));if(Wn(n)){if(1<n.length)throw Error(i(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Ye(n)}}function Pn(e,t){var n=Ye(t.value),o=Ye(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),o!=null&&(e.defaultValue=""+o)}function Vr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Qr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function rr(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Qr(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var tt,Fl=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,o,s){MSApp.execUnsafeLocalFunction(function(){return e(t,n,o,s)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(tt=tt||document.createElement("div"),tt.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=tt.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Et(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var lo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Po=["Webkit","ms","Moz","O"];Object.keys(lo).forEach(function(e){Po.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),lo[t]=lo[e]})});function lr(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||lo.hasOwnProperty(e)&&lo[e]?(""+t).trim():t+"px"}function Bl(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var o=n.indexOf("--")===0,s=lr(n,t[n],o);n==="float"&&(n="cssFloat"),o?e.setProperty(n,s):e[n]=s}}var Al=re({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Lo(e,t){if(t){if(Al[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(i(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(i(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(i(61))}if(t.style!=null&&typeof t.style!="object")throw Error(i(62))}}function To(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var sr=null;function ir(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Gr=null,Ln=null,Yn=null;function Kr(e){if(e=pl(e)){if(typeof Gr!="function")throw Error(i(280));var t=e.stateNode;t&&(t=ss(t),Gr(e.stateNode,e.type,t))}}function Hn(e){Ln?Yn?Yn.push(e):Yn=[e]:Ln=e}function ut(){if(Ln){var e=Ln,t=Yn;if(Yn=Ln=null,Kr(e),t)for(e=0;e<t.length;e++)Kr(t[e])}}function Un(e,t){return e(t)}function qt(){}var wt=!1;function Wl(e,t,n){if(wt)return e(t,n);wt=!0;try{return Un(e,t,n)}finally{wt=!1,(Ln!==null||Yn!==null)&&(qt(),ut())}}function Io(e,t){var n=e.stateNode;if(n===null)return null;var o=ss(n);if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(i(231,t,typeof n));return n}var Zr=!1;if(w)try{var un={};Object.defineProperty(un,"passive",{get:function(){Zr=!0}}),window.addEventListener("test",un,un),window.removeEventListener("test",un,un)}catch{Zr=!1}function de(e,t,n,o,s,u,d,b,j){var B=Array.prototype.slice.call(arguments,3);try{t.apply(n,B)}catch(J){this.onError(J)}}var Yt=!1,Ie=null,Ro=!1,ar=null,Yl={onError:function(e){Yt=!0,Ie=e}};function Hl(e,t,n,o,s,u,d,b,j){Yt=!1,Ie=null,de.apply(Yl,arguments)}function gn(e,t,n,o,s,u,d,b,j){if(Hl.apply(this,arguments),Yt){if(Yt){var B=Ie;Yt=!1,Ie=null}else throw Error(i(198));Ro||(Ro=!0,ar=B)}}function pt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function ur(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Jr(e){if(pt(e)!==e)throw Error(i(188))}function Nt(e){var t=e.alternate;if(!t){if(t=pt(e),t===null)throw Error(i(188));return t!==e?null:e}for(var n=e,o=t;;){var s=n.return;if(s===null)break;var u=s.alternate;if(u===null){if(o=s.return,o!==null){n=o;continue}break}if(s.child===u.child){for(u=s.child;u;){if(u===n)return Jr(s),e;if(u===o)return Jr(s),t;u=u.sibling}throw Error(i(188))}if(n.return!==o.return)n=s,o=u;else{for(var d=!1,b=s.child;b;){if(b===n){d=!0,n=s,o=u;break}if(b===o){d=!0,o=s,n=u;break}b=b.sibling}if(!d){for(b=u.child;b;){if(b===n){d=!0,n=u,o=s;break}if(b===o){d=!0,o=u,n=s;break}b=b.sibling}if(!d)throw Error(i(189))}}if(n.alternate!==o)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function Tn(e){return e=Nt(e),e!==null?Qe(e):null}function Qe(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Qe(e);if(t!==null)return t;e=e.sibling}return null}var cr=a.unstable_scheduleCallback,cn=a.unstable_cancelCallback,Ul=a.unstable_shouldYield,so=a.unstable_requestPaint,rt=a.unstable_now,ii=a.unstable_getCurrentPriorityLevel,qr=a.unstable_ImmediatePriority,dr=a.unstable_UserBlockingPriority,$o=a.unstable_NormalPriority,Mo=a.unstable_LowPriority,el=a.unstable_IdlePriority,Xn=null,It=null;function fr(e){if(It&&typeof It.onCommitFiberRoot=="function")try{It.onCommitFiberRoot(Xn,e,void 0,(e.current.flags&128)===128)}catch{}}var en=Math.clz32?Math.clz32:Xl,io=Math.log,yn=Math.LN2;function Xl(e){return e>>>=0,e===0?32:31-(io(e)/yn|0)|0}var xn=64,Dt=4194304;function vn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function In(e,t){var n=e.pendingLanes;if(n===0)return 0;var o=0,s=e.suspendedLanes,u=e.pingedLanes,d=n&268435455;if(d!==0){var b=d&~s;b!==0?o=vn(b):(u&=d,u!==0&&(o=vn(u)))}else d=n&~s,d!==0?o=vn(d):u!==0&&(o=vn(u));if(o===0)return 0;if(t!==0&&t!==o&&(t&s)===0&&(s=o&-o,u=t&-t,s>=u||s===16&&(u&4194240)!==0))return t;if((o&4)!==0&&(o|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)n=31-en(t),s=1<<n,o|=e[n],t&=~s;return o}function mr(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Vl(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,s=e.expirationTimes,u=e.pendingLanes;0<u;){var d=31-en(u),b=1<<d,j=s[d];j===-1?((b&n)===0||(b&o)!==0)&&(s[d]=mr(b,t)):j<=t&&(e.expiredLanes|=b),u&=~b}}function ao(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function tl(){var e=xn;return xn<<=1,(xn&4194240)===0&&(xn=64),e}function zo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Oo(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-en(t),e[t]=n}function Ql(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<n;){var s=31-en(n),u=1<<s;t[s]=0,o[s]=-1,e[s]=-1,n&=~u}}function pr(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-en(n),s=1<<o;s&t|e[o]&t&&(e[o]|=t),n&=~s}}var We=0;function Ge(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var nl,_r,Gl,ol,Do,Fo=!1,Bo=[],xt=null,Rn=null,$n=null,Vn=new Map,Mn=new Map,tn=[],ai="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Kl(e,t){switch(e){case"focusin":case"focusout":xt=null;break;case"dragenter":case"dragleave":Rn=null;break;case"mouseover":case"mouseout":$n=null;break;case"pointerover":case"pointerout":Vn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Mn.delete(t.pointerId)}}function nn(e,t,n,o,s,u){return e===null||e.nativeEvent!==u?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:u,targetContainers:[s]},t!==null&&(t=pl(t),t!==null&&_r(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function rl(e,t,n,o,s){switch(t){case"focusin":return xt=nn(xt,e,t,n,o,s),!0;case"dragenter":return Rn=nn(Rn,e,t,n,o,s),!0;case"mouseover":return $n=nn($n,e,t,n,o,s),!0;case"pointerover":var u=s.pointerId;return Vn.set(u,nn(Vn.get(u)||null,e,t,n,o,s)),!0;case"gotpointercapture":return u=s.pointerId,Mn.set(u,nn(Mn.get(u)||null,e,t,n,o,s)),!0}return!1}function hr(e){var t=Wo(e.target);if(t!==null){var n=pt(t);if(n!==null){if(t=n.tag,t===13){if(t=ur(n),t!==null){e.blockedOn=t,Do(e.priority,function(){Gl(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function gr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=X(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);sr=o,n.target.dispatchEvent(o),sr=null}else return t=pl(n),t!==null&&_r(t),e.blockedOn=n,!1;t.shift()}return!0}function Qn(e,t,n){gr(e)&&n.delete(t)}function yr(){Fo=!1,xt!==null&&gr(xt)&&(xt=null),Rn!==null&&gr(Rn)&&(Rn=null),$n!==null&&gr($n)&&($n=null),Vn.forEach(Qn),Mn.forEach(Qn)}function uo(e,t){e.blockedOn===t&&(e.blockedOn=null,Fo||(Fo=!0,a.unstable_scheduleCallback(a.unstable_NormalPriority,yr)))}function co(e){function t(s){return uo(s,e)}if(0<Bo.length){uo(Bo[0],e);for(var n=1;n<Bo.length;n++){var o=Bo[n];o.blockedOn===e&&(o.blockedOn=null)}}for(xt!==null&&uo(xt,e),Rn!==null&&uo(Rn,e),$n!==null&&uo($n,e),Vn.forEach(t),Mn.forEach(t),n=0;n<tn.length;n++)o=tn[n],o.blockedOn===e&&(o.blockedOn=null);for(;0<tn.length&&(n=tn[0],n.blockedOn===null);)hr(n),n.blockedOn===null&&tn.shift()}var Gn=A.ReactCurrentBatchConfig,Ao=!0;function Zl(e,t,n,o){var s=We,u=Gn.transition;Gn.transition=null;try{We=1,k(e,t,n,o)}finally{We=s,Gn.transition=u}}function h(e,t,n,o){var s=We,u=Gn.transition;Gn.transition=null;try{We=4,k(e,t,n,o)}finally{We=s,Gn.transition=u}}function k(e,t,n,o){if(Ao){var s=X(e,t,n,o);if(s===null)wi(e,t,o,W,n),Kl(e,o);else if(rl(s,e,t,n,o))o.stopPropagation();else if(Kl(e,o),t&4&&-1<ai.indexOf(e)){for(;s!==null;){var u=pl(s);if(u!==null&&nl(u),u=X(e,t,n,o),u===null&&wi(e,t,o,W,n),u===s)break;s=u}s!==null&&o.stopPropagation()}else wi(e,t,o,null,n)}}var W=null;function X(e,t,n,o){if(W=null,e=ir(o),e=Wo(e),e!==null)if(t=pt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=ur(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return W=e,null}function V(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ii()){case qr:return 1;case dr:return 4;case $o:case Mo:return 16;case el:return 536870912;default:return 16}default:return 16}}var G=null,he=null,_e=null;function be(){if(_e)return _e;var e,t=he,n=t.length,o,s="value"in G?G.value:G.textContent,u=s.length;for(e=0;e<n&&t[e]===s[e];e++);var d=n-e;for(o=1;o<=d&&t[n-o]===s[u-o];o++);return _e=s.slice(e,1<o?1-o:void 0)}function Pe(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function we(){return!0}function Ee(){return!1}function ke(e){function t(n,o,s,u,d){this._reactName=n,this._targetInst=s,this.type=o,this.nativeEvent=u,this.target=d,this.currentTarget=null;for(var b in e)e.hasOwnProperty(b)&&(n=e[b],this[b]=n?n(u):u[b]);return this.isDefaultPrevented=(u.defaultPrevented!=null?u.defaultPrevented:u.returnValue===!1)?we:Ee,this.isPropagationStopped=Ee,this}return re(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=we)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=we)},persist:function(){},isPersistent:we}),t}var je={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ge=ke(je),ht=re({},je,{view:0,detail:0}),gt=ke(ht),on,lt,ft,$e=re({},ht,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:di,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ft&&(ft&&e.type==="mousemove"?(on=e.screenX-ft.screenX,lt=e.screenY-ft.screenY):lt=on=0,ft=e),on)},movementY:function(e){return"movementY"in e?e.movementY:lt}}),Me=ke($e),Rt=re({},$e,{dataTransfer:0}),st=ke(Rt),Ht=re({},ht,{relatedTarget:0}),Ut=ke(Ht),xr=re({},je,{animationName:0,elapsedTime:0,pseudoElement:0}),ui=ke(xr),Jl=re({},je,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),ci=ke(Jl),hf=re({},je,{data:0}),lu=ke(hf),gf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},yf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},xf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function vf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=xf[e])?!!t[e]:!1}function di(){return vf}var bf=re({},ht,{key:function(e){if(e.key){var t=gf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Pe(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?yf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:di,charCode:function(e){return e.type==="keypress"?Pe(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Pe(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),wf=ke(bf),kf=re({},$e,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),su=ke(kf),Sf=re({},ht,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:di}),Cf=ke(Sf),jf=re({},je,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ef=ke(jf),Nf=re({},$e,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Pf=ke(Nf),Lf=[9,13,27,32],fi=w&&"CompositionEvent"in window,ll=null;w&&"documentMode"in document&&(ll=document.documentMode);var Tf=w&&"TextEvent"in window&&!ll,iu=w&&(!fi||ll&&8<ll&&11>=ll),au=" ",uu=!1;function cu(e,t){switch(e){case"keyup":return Lf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function du(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var vr=!1;function If(e,t){switch(e){case"compositionend":return du(t);case"keypress":return t.which!==32?null:(uu=!0,au);case"textInput":return e=t.data,e===au&&uu?null:e;default:return null}}function Rf(e,t){if(vr)return e==="compositionend"||!fi&&cu(e,t)?(e=be(),_e=he=G=null,vr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return iu&&t.locale!=="ko"?null:t.data;default:return null}}var $f={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function fu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!$f[e.type]:t==="textarea"}function mu(e,t,n,o){Hn(o),t=os(t,"onChange"),0<t.length&&(n=new ge("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var sl=null,il=null;function Mf(e){Tu(e,0)}function ql(e){var t=Cr(e);if(Ur(t))return e}function zf(e,t){if(e==="change")return t}var pu=!1;if(w){var mi;if(w){var pi="oninput"in document;if(!pi){var _u=document.createElement("div");_u.setAttribute("oninput","return;"),pi=typeof _u.oninput=="function"}mi=pi}else mi=!1;pu=mi&&(!document.documentMode||9<document.documentMode)}function hu(){sl&&(sl.detachEvent("onpropertychange",gu),il=sl=null)}function gu(e){if(e.propertyName==="value"&&ql(il)){var t=[];mu(t,il,e,ir(e)),Wl(Mf,t)}}function Of(e,t,n){e==="focusin"?(hu(),sl=t,il=n,sl.attachEvent("onpropertychange",gu)):e==="focusout"&&hu()}function Df(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ql(il)}function Ff(e,t){if(e==="click")return ql(t)}function Bf(e,t){if(e==="input"||e==="change")return ql(t)}function Af(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var bn=typeof Object.is=="function"?Object.is:Af;function al(e,t){if(bn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var s=n[o];if(!C.call(t,s)||!bn(e[s],t[s]))return!1}return!0}function yu(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function xu(e,t){var n=yu(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=yu(n)}}function vu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?vu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function bu(){for(var e=window,t=En();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=En(e.document)}return t}function _i(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Wf(e){var t=bu(),n=e.focusedElem,o=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&vu(n.ownerDocument.documentElement,n)){if(o!==null&&_i(n)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var s=n.textContent.length,u=Math.min(o.start,s);o=o.end===void 0?u:Math.min(o.end,s),!e.extend&&u>o&&(s=o,o=u,u=s),s=xu(n,u);var d=xu(n,o);s&&d&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==d.node||e.focusOffset!==d.offset)&&(t=t.createRange(),t.setStart(s.node,s.offset),e.removeAllRanges(),u>o?(e.addRange(t),e.extend(d.node,d.offset)):(t.setEnd(d.node,d.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Yf=w&&"documentMode"in document&&11>=document.documentMode,br=null,hi=null,ul=null,gi=!1;function wu(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;gi||br==null||br!==En(o)||(o=br,"selectionStart"in o&&_i(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),ul&&al(ul,o)||(ul=o,o=os(hi,"onSelect"),0<o.length&&(t=new ge("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=br)))}function es(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var wr={animationend:es("Animation","AnimationEnd"),animationiteration:es("Animation","AnimationIteration"),animationstart:es("Animation","AnimationStart"),transitionend:es("Transition","TransitionEnd")},yi={},ku={};w&&(ku=document.createElement("div").style,"AnimationEvent"in window||(delete wr.animationend.animation,delete wr.animationiteration.animation,delete wr.animationstart.animation),"TransitionEvent"in window||delete wr.transitionend.transition);function ts(e){if(yi[e])return yi[e];if(!wr[e])return e;var t=wr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ku)return yi[e]=t[n];return e}var Su=ts("animationend"),Cu=ts("animationiteration"),ju=ts("animationstart"),Eu=ts("transitionend"),Nu=new Map,Pu="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function fo(e,t){Nu.set(e,t),m(t,[e])}for(var xi=0;xi<Pu.length;xi++){var vi=Pu[xi],Hf=vi.toLowerCase(),Uf=vi[0].toUpperCase()+vi.slice(1);fo(Hf,"on"+Uf)}fo(Su,"onAnimationEnd"),fo(Cu,"onAnimationIteration"),fo(ju,"onAnimationStart"),fo("dblclick","onDoubleClick"),fo("focusin","onFocus"),fo("focusout","onBlur"),fo(Eu,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),m("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),m("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),m("onBeforeInput",["compositionend","keypress","textInput","paste"]),m("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),m("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),m("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var cl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Xf=new Set("cancel close invalid load scroll toggle".split(" ").concat(cl));function Lu(e,t,n){var o=e.type||"unknown-event";e.currentTarget=n,gn(o,t,void 0,e),e.currentTarget=null}function Tu(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],s=o.event;o=o.listeners;e:{var u=void 0;if(t)for(var d=o.length-1;0<=d;d--){var b=o[d],j=b.instance,B=b.currentTarget;if(b=b.listener,j!==u&&s.isPropagationStopped())break e;Lu(s,b,B),u=j}else for(d=0;d<o.length;d++){if(b=o[d],j=b.instance,B=b.currentTarget,b=b.listener,j!==u&&s.isPropagationStopped())break e;Lu(s,b,B),u=j}}}if(Ro)throw e=ar,Ro=!1,ar=null,e}function nt(e,t){var n=t[Ni];n===void 0&&(n=t[Ni]=new Set);var o=e+"__bubble";n.has(o)||(Iu(t,e,2,!1),n.add(o))}function bi(e,t,n){var o=0;t&&(o|=4),Iu(n,e,o,t)}var ns="_reactListening"+Math.random().toString(36).slice(2);function dl(e){if(!e[ns]){e[ns]=!0,f.forEach(function(n){n!=="selectionchange"&&(Xf.has(n)||bi(n,!1,e),bi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ns]||(t[ns]=!0,bi("selectionchange",!1,t))}}function Iu(e,t,n,o){switch(V(t)){case 1:var s=Zl;break;case 4:s=h;break;default:s=k}n=s.bind(null,t,n,e),s=void 0,!Zr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),o?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function wi(e,t,n,o,s){var u=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var d=o.tag;if(d===3||d===4){var b=o.stateNode.containerInfo;if(b===s||b.nodeType===8&&b.parentNode===s)break;if(d===4)for(d=o.return;d!==null;){var j=d.tag;if((j===3||j===4)&&(j=d.stateNode.containerInfo,j===s||j.nodeType===8&&j.parentNode===s))return;d=d.return}for(;b!==null;){if(d=Wo(b),d===null)return;if(j=d.tag,j===5||j===6){o=u=d;continue e}b=b.parentNode}}o=o.return}Wl(function(){var B=u,J=ir(n),ee=[];e:{var K=Nu.get(e);if(K!==void 0){var me=ge,ye=e;switch(e){case"keypress":if(Pe(n)===0)break e;case"keydown":case"keyup":me=wf;break;case"focusin":ye="focus",me=Ut;break;case"focusout":ye="blur",me=Ut;break;case"beforeblur":case"afterblur":me=Ut;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":me=Me;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":me=st;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":me=Cf;break;case Su:case Cu:case ju:me=ui;break;case Eu:me=Ef;break;case"scroll":me=gt;break;case"wheel":me=Pf;break;case"copy":case"cut":case"paste":me=ci;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":me=su}var xe=(t&4)!==0,_t=!xe&&e==="scroll",M=xe?K!==null?K+"Capture":null:K;xe=[];for(var E=B,O;E!==null;){O=E;var oe=O.stateNode;if(O.tag===5&&oe!==null&&(O=oe,M!==null&&(oe=Io(E,M),oe!=null&&xe.push(fl(E,oe,O)))),_t)break;E=E.return}0<xe.length&&(K=new me(K,ye,null,n,J),ee.push({event:K,listeners:xe}))}}if((t&7)===0){e:{if(K=e==="mouseover"||e==="pointerover",me=e==="mouseout"||e==="pointerout",K&&n!==sr&&(ye=n.relatedTarget||n.fromElement)&&(Wo(ye)||ye[Kn]))break e;if((me||K)&&(K=J.window===J?J:(K=J.ownerDocument)?K.defaultView||K.parentWindow:window,me?(ye=n.relatedTarget||n.toElement,me=B,ye=ye?Wo(ye):null,ye!==null&&(_t=pt(ye),ye!==_t||ye.tag!==5&&ye.tag!==6)&&(ye=null)):(me=null,ye=B),me!==ye)){if(xe=Me,oe="onMouseLeave",M="onMouseEnter",E="mouse",(e==="pointerout"||e==="pointerover")&&(xe=su,oe="onPointerLeave",M="onPointerEnter",E="pointer"),_t=me==null?K:Cr(me),O=ye==null?K:Cr(ye),K=new xe(oe,E+"leave",me,n,J),K.target=_t,K.relatedTarget=O,oe=null,Wo(J)===B&&(xe=new xe(M,E+"enter",ye,n,J),xe.target=O,xe.relatedTarget=_t,oe=xe),_t=oe,me&&ye)t:{for(xe=me,M=ye,E=0,O=xe;O;O=kr(O))E++;for(O=0,oe=M;oe;oe=kr(oe))O++;for(;0<E-O;)xe=kr(xe),E--;for(;0<O-E;)M=kr(M),O--;for(;E--;){if(xe===M||M!==null&&xe===M.alternate)break t;xe=kr(xe),M=kr(M)}xe=null}else xe=null;me!==null&&Ru(ee,K,me,xe,!1),ye!==null&&_t!==null&&Ru(ee,_t,ye,xe,!0)}}e:{if(K=B?Cr(B):window,me=K.nodeName&&K.nodeName.toLowerCase(),me==="select"||me==="input"&&K.type==="file")var ve=zf;else if(fu(K))if(pu)ve=Bf;else{ve=Df;var Se=Of}else(me=K.nodeName)&&me.toLowerCase()==="input"&&(K.type==="checkbox"||K.type==="radio")&&(ve=Ff);if(ve&&(ve=ve(e,B))){mu(ee,ve,n,J);break e}Se&&Se(e,K,B),e==="focusout"&&(Se=K._wrapperState)&&Se.controlled&&K.type==="number"&&An(K,"number",K.value)}switch(Se=B?Cr(B):window,e){case"focusin":(fu(Se)||Se.contentEditable==="true")&&(br=Se,hi=B,ul=null);break;case"focusout":ul=hi=br=null;break;case"mousedown":gi=!0;break;case"contextmenu":case"mouseup":case"dragend":gi=!1,wu(ee,n,J);break;case"selectionchange":if(Yf)break;case"keydown":case"keyup":wu(ee,n,J)}var Ce;if(fi)e:{switch(e){case"compositionstart":var Le="onCompositionStart";break e;case"compositionend":Le="onCompositionEnd";break e;case"compositionupdate":Le="onCompositionUpdate";break e}Le=void 0}else vr?cu(e,n)&&(Le="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(Le="onCompositionStart");Le&&(iu&&n.locale!=="ko"&&(vr||Le!=="onCompositionStart"?Le==="onCompositionEnd"&&vr&&(Ce=be()):(G=J,he="value"in G?G.value:G.textContent,vr=!0)),Se=os(B,Le),0<Se.length&&(Le=new lu(Le,e,null,n,J),ee.push({event:Le,listeners:Se}),Ce?Le.data=Ce:(Ce=du(n),Ce!==null&&(Le.data=Ce)))),(Ce=Tf?If(e,n):Rf(e,n))&&(B=os(B,"onBeforeInput"),0<B.length&&(J=new lu("onBeforeInput","beforeinput",null,n,J),ee.push({event:J,listeners:B}),J.data=Ce))}Tu(ee,t)})}function fl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function os(e,t){for(var n=t+"Capture",o=[];e!==null;){var s=e,u=s.stateNode;s.tag===5&&u!==null&&(s=u,u=Io(e,n),u!=null&&o.unshift(fl(e,u,s)),u=Io(e,t),u!=null&&o.push(fl(e,u,s))),e=e.return}return o}function kr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Ru(e,t,n,o,s){for(var u=t._reactName,d=[];n!==null&&n!==o;){var b=n,j=b.alternate,B=b.stateNode;if(j!==null&&j===o)break;b.tag===5&&B!==null&&(b=B,s?(j=Io(n,u),j!=null&&d.unshift(fl(n,j,b))):s||(j=Io(n,u),j!=null&&d.push(fl(n,j,b)))),n=n.return}d.length!==0&&e.push({event:t,listeners:d})}var Vf=/\r\n?/g,Qf=/\u0000|\uFFFD/g;function $u(e){return(typeof e=="string"?e:""+e).replace(Vf,`
`).replace(Qf,"")}function rs(e,t,n){if(t=$u(t),$u(e)!==t&&n)throw Error(i(425))}function ls(){}var ki=null,Si=null;function Ci(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ji=typeof setTimeout=="function"?setTimeout:void 0,Gf=typeof clearTimeout=="function"?clearTimeout:void 0,Mu=typeof Promise=="function"?Promise:void 0,Kf=typeof queueMicrotask=="function"?queueMicrotask:typeof Mu<"u"?function(e){return Mu.resolve(null).then(e).catch(Zf)}:ji;function Zf(e){setTimeout(function(){throw e})}function Ei(e,t){var n=t,o=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(o===0){e.removeChild(s),co(t);return}o--}else n!=="$"&&n!=="$?"&&n!=="$!"||o++;n=s}while(n);co(t)}function mo(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function zu(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Sr=Math.random().toString(36).slice(2),zn="__reactFiber$"+Sr,ml="__reactProps$"+Sr,Kn="__reactContainer$"+Sr,Ni="__reactEvents$"+Sr,Jf="__reactListeners$"+Sr,qf="__reactHandles$"+Sr;function Wo(e){var t=e[zn];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Kn]||n[zn]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=zu(e);e!==null;){if(n=e[zn])return n;e=zu(e)}return t}e=n,n=e.parentNode}return null}function pl(e){return e=e[zn]||e[Kn],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Cr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(i(33))}function ss(e){return e[ml]||null}var Pi=[],jr=-1;function po(e){return{current:e}}function ot(e){0>jr||(e.current=Pi[jr],Pi[jr]=null,jr--)}function qe(e,t){jr++,Pi[jr]=e.current,e.current=t}var _o={},$t=po(_o),Xt=po(!1),Yo=_o;function Er(e,t){var n=e.type.contextTypes;if(!n)return _o;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var s={},u;for(u in n)s[u]=t[u];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=s),s}function Vt(e){return e=e.childContextTypes,e!=null}function is(){ot(Xt),ot($t)}function Ou(e,t,n){if($t.current!==_o)throw Error(i(168));qe($t,t),qe(Xt,n)}function Du(e,t,n){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return n;o=o.getChildContext();for(var s in o)if(!(s in t))throw Error(i(108,Ke(e)||"Unknown",s));return re({},n,o)}function as(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||_o,Yo=$t.current,qe($t,e),qe(Xt,Xt.current),!0}function Fu(e,t,n){var o=e.stateNode;if(!o)throw Error(i(169));n?(e=Du(e,t,Yo),o.__reactInternalMemoizedMergedChildContext=e,ot(Xt),ot($t),qe($t,e)):ot(Xt),qe(Xt,n)}var Zn=null,us=!1,Li=!1;function Bu(e){Zn===null?Zn=[e]:Zn.push(e)}function em(e){us=!0,Bu(e)}function ho(){if(!Li&&Zn!==null){Li=!0;var e=0,t=We;try{var n=Zn;for(We=1;e<n.length;e++){var o=n[e];do o=o(!0);while(o!==null)}Zn=null,us=!1}catch(s){throw Zn!==null&&(Zn=Zn.slice(e+1)),cr(qr,ho),s}finally{We=t,Li=!1}}return null}var Nr=[],Pr=0,cs=null,ds=0,dn=[],fn=0,Ho=null,Jn=1,qn="";function Uo(e,t){Nr[Pr++]=ds,Nr[Pr++]=cs,cs=e,ds=t}function Au(e,t,n){dn[fn++]=Jn,dn[fn++]=qn,dn[fn++]=Ho,Ho=e;var o=Jn;e=qn;var s=32-en(o)-1;o&=~(1<<s),n+=1;var u=32-en(t)+s;if(30<u){var d=s-s%5;u=(o&(1<<d)-1).toString(32),o>>=d,s-=d,Jn=1<<32-en(t)+s|n<<s|o,qn=u+e}else Jn=1<<u|n<<s|o,qn=e}function Ti(e){e.return!==null&&(Uo(e,1),Au(e,1,0))}function Ii(e){for(;e===cs;)cs=Nr[--Pr],Nr[Pr]=null,ds=Nr[--Pr],Nr[Pr]=null;for(;e===Ho;)Ho=dn[--fn],dn[fn]=null,qn=dn[--fn],dn[fn]=null,Jn=dn[--fn],dn[fn]=null}var rn=null,ln=null,it=!1,wn=null;function Wu(e,t){var n=hn(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Yu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,rn=e,ln=mo(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,rn=e,ln=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Ho!==null?{id:Jn,overflow:qn}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=hn(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,rn=e,ln=null,!0):!1;default:return!1}}function Ri(e){return(e.mode&1)!==0&&(e.flags&128)===0}function $i(e){if(it){var t=ln;if(t){var n=t;if(!Yu(e,t)){if(Ri(e))throw Error(i(418));t=mo(n.nextSibling);var o=rn;t&&Yu(e,t)?Wu(o,n):(e.flags=e.flags&-4097|2,it=!1,rn=e)}}else{if(Ri(e))throw Error(i(418));e.flags=e.flags&-4097|2,it=!1,rn=e}}}function Hu(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;rn=e}function fs(e){if(e!==rn)return!1;if(!it)return Hu(e),it=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ci(e.type,e.memoizedProps)),t&&(t=ln)){if(Ri(e))throw Uu(),Error(i(418));for(;t;)Wu(e,t),t=mo(t.nextSibling)}if(Hu(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(i(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ln=mo(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ln=null}}else ln=rn?mo(e.stateNode.nextSibling):null;return!0}function Uu(){for(var e=ln;e;)e=mo(e.nextSibling)}function Lr(){ln=rn=null,it=!1}function Mi(e){wn===null?wn=[e]:wn.push(e)}var tm=A.ReactCurrentBatchConfig;function _l(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(i(309));var o=n.stateNode}if(!o)throw Error(i(147,e));var s=o,u=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===u?t.ref:(t=function(d){var b=s.refs;d===null?delete b[u]:b[u]=d},t._stringRef=u,t)}if(typeof e!="string")throw Error(i(284));if(!n._owner)throw Error(i(290,e))}return e}function ms(e,t){throw e=Object.prototype.toString.call(t),Error(i(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Xu(e){var t=e._init;return t(e._payload)}function Vu(e){function t(M,E){if(e){var O=M.deletions;O===null?(M.deletions=[E],M.flags|=16):O.push(E)}}function n(M,E){if(!e)return null;for(;E!==null;)t(M,E),E=E.sibling;return null}function o(M,E){for(M=new Map;E!==null;)E.key!==null?M.set(E.key,E):M.set(E.index,E),E=E.sibling;return M}function s(M,E){return M=So(M,E),M.index=0,M.sibling=null,M}function u(M,E,O){return M.index=O,e?(O=M.alternate,O!==null?(O=O.index,O<E?(M.flags|=2,E):O):(M.flags|=2,E)):(M.flags|=1048576,E)}function d(M){return e&&M.alternate===null&&(M.flags|=2),M}function b(M,E,O,oe){return E===null||E.tag!==6?(E=ja(O,M.mode,oe),E.return=M,E):(E=s(E,O),E.return=M,E)}function j(M,E,O,oe){var ve=O.type;return ve===ue?J(M,E,O.props.children,oe,O.key):E!==null&&(E.elementType===ve||typeof ve=="object"&&ve!==null&&ve.$$typeof===se&&Xu(ve)===E.type)?(oe=s(E,O.props),oe.ref=_l(M,E,O),oe.return=M,oe):(oe=Os(O.type,O.key,O.props,null,M.mode,oe),oe.ref=_l(M,E,O),oe.return=M,oe)}function B(M,E,O,oe){return E===null||E.tag!==4||E.stateNode.containerInfo!==O.containerInfo||E.stateNode.implementation!==O.implementation?(E=Ea(O,M.mode,oe),E.return=M,E):(E=s(E,O.children||[]),E.return=M,E)}function J(M,E,O,oe,ve){return E===null||E.tag!==7?(E=qo(O,M.mode,oe,ve),E.return=M,E):(E=s(E,O),E.return=M,E)}function ee(M,E,O){if(typeof E=="string"&&E!==""||typeof E=="number")return E=ja(""+E,M.mode,O),E.return=M,E;if(typeof E=="object"&&E!==null){switch(E.$$typeof){case g:return O=Os(E.type,E.key,E.props,null,M.mode,O),O.ref=_l(M,null,E),O.return=M,O;case Q:return E=Ea(E,M.mode,O),E.return=M,E;case se:var oe=E._init;return ee(M,oe(E._payload),O)}if(Wn(E)||Z(E))return E=qo(E,M.mode,O,null),E.return=M,E;ms(M,E)}return null}function K(M,E,O,oe){var ve=E!==null?E.key:null;if(typeof O=="string"&&O!==""||typeof O=="number")return ve!==null?null:b(M,E,""+O,oe);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case g:return O.key===ve?j(M,E,O,oe):null;case Q:return O.key===ve?B(M,E,O,oe):null;case se:return ve=O._init,K(M,E,ve(O._payload),oe)}if(Wn(O)||Z(O))return ve!==null?null:J(M,E,O,oe,null);ms(M,O)}return null}function me(M,E,O,oe,ve){if(typeof oe=="string"&&oe!==""||typeof oe=="number")return M=M.get(O)||null,b(E,M,""+oe,ve);if(typeof oe=="object"&&oe!==null){switch(oe.$$typeof){case g:return M=M.get(oe.key===null?O:oe.key)||null,j(E,M,oe,ve);case Q:return M=M.get(oe.key===null?O:oe.key)||null,B(E,M,oe,ve);case se:var Se=oe._init;return me(M,E,O,Se(oe._payload),ve)}if(Wn(oe)||Z(oe))return M=M.get(O)||null,J(E,M,oe,ve,null);ms(E,oe)}return null}function ye(M,E,O,oe){for(var ve=null,Se=null,Ce=E,Le=E=0,Ct=null;Ce!==null&&Le<O.length;Le++){Ce.index>Le?(Ct=Ce,Ce=null):Ct=Ce.sibling;var Xe=K(M,Ce,O[Le],oe);if(Xe===null){Ce===null&&(Ce=Ct);break}e&&Ce&&Xe.alternate===null&&t(M,Ce),E=u(Xe,E,Le),Se===null?ve=Xe:Se.sibling=Xe,Se=Xe,Ce=Ct}if(Le===O.length)return n(M,Ce),it&&Uo(M,Le),ve;if(Ce===null){for(;Le<O.length;Le++)Ce=ee(M,O[Le],oe),Ce!==null&&(E=u(Ce,E,Le),Se===null?ve=Ce:Se.sibling=Ce,Se=Ce);return it&&Uo(M,Le),ve}for(Ce=o(M,Ce);Le<O.length;Le++)Ct=me(Ce,M,Le,O[Le],oe),Ct!==null&&(e&&Ct.alternate!==null&&Ce.delete(Ct.key===null?Le:Ct.key),E=u(Ct,E,Le),Se===null?ve=Ct:Se.sibling=Ct,Se=Ct);return e&&Ce.forEach(function(Co){return t(M,Co)}),it&&Uo(M,Le),ve}function xe(M,E,O,oe){var ve=Z(O);if(typeof ve!="function")throw Error(i(150));if(O=ve.call(O),O==null)throw Error(i(151));for(var Se=ve=null,Ce=E,Le=E=0,Ct=null,Xe=O.next();Ce!==null&&!Xe.done;Le++,Xe=O.next()){Ce.index>Le?(Ct=Ce,Ce=null):Ct=Ce.sibling;var Co=K(M,Ce,Xe.value,oe);if(Co===null){Ce===null&&(Ce=Ct);break}e&&Ce&&Co.alternate===null&&t(M,Ce),E=u(Co,E,Le),Se===null?ve=Co:Se.sibling=Co,Se=Co,Ce=Ct}if(Xe.done)return n(M,Ce),it&&Uo(M,Le),ve;if(Ce===null){for(;!Xe.done;Le++,Xe=O.next())Xe=ee(M,Xe.value,oe),Xe!==null&&(E=u(Xe,E,Le),Se===null?ve=Xe:Se.sibling=Xe,Se=Xe);return it&&Uo(M,Le),ve}for(Ce=o(M,Ce);!Xe.done;Le++,Xe=O.next())Xe=me(Ce,M,Le,Xe.value,oe),Xe!==null&&(e&&Xe.alternate!==null&&Ce.delete(Xe.key===null?Le:Xe.key),E=u(Xe,E,Le),Se===null?ve=Xe:Se.sibling=Xe,Se=Xe);return e&&Ce.forEach(function($m){return t(M,$m)}),it&&Uo(M,Le),ve}function _t(M,E,O,oe){if(typeof O=="object"&&O!==null&&O.type===ue&&O.key===null&&(O=O.props.children),typeof O=="object"&&O!==null){switch(O.$$typeof){case g:e:{for(var ve=O.key,Se=E;Se!==null;){if(Se.key===ve){if(ve=O.type,ve===ue){if(Se.tag===7){n(M,Se.sibling),E=s(Se,O.props.children),E.return=M,M=E;break e}}else if(Se.elementType===ve||typeof ve=="object"&&ve!==null&&ve.$$typeof===se&&Xu(ve)===Se.type){n(M,Se.sibling),E=s(Se,O.props),E.ref=_l(M,Se,O),E.return=M,M=E;break e}n(M,Se);break}else t(M,Se);Se=Se.sibling}O.type===ue?(E=qo(O.props.children,M.mode,oe,O.key),E.return=M,M=E):(oe=Os(O.type,O.key,O.props,null,M.mode,oe),oe.ref=_l(M,E,O),oe.return=M,M=oe)}return d(M);case Q:e:{for(Se=O.key;E!==null;){if(E.key===Se)if(E.tag===4&&E.stateNode.containerInfo===O.containerInfo&&E.stateNode.implementation===O.implementation){n(M,E.sibling),E=s(E,O.children||[]),E.return=M,M=E;break e}else{n(M,E);break}else t(M,E);E=E.sibling}E=Ea(O,M.mode,oe),E.return=M,M=E}return d(M);case se:return Se=O._init,_t(M,E,Se(O._payload),oe)}if(Wn(O))return ye(M,E,O,oe);if(Z(O))return xe(M,E,O,oe);ms(M,O)}return typeof O=="string"&&O!==""||typeof O=="number"?(O=""+O,E!==null&&E.tag===6?(n(M,E.sibling),E=s(E,O),E.return=M,M=E):(n(M,E),E=ja(O,M.mode,oe),E.return=M,M=E),d(M)):n(M,E)}return _t}var Tr=Vu(!0),Qu=Vu(!1),ps=po(null),_s=null,Ir=null,zi=null;function Oi(){zi=Ir=_s=null}function Di(e){var t=ps.current;ot(ps),e._currentValue=t}function Fi(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function Rr(e,t){_s=e,zi=Ir=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Qt=!0),e.firstContext=null)}function mn(e){var t=e._currentValue;if(zi!==e)if(e={context:e,memoizedValue:t,next:null},Ir===null){if(_s===null)throw Error(i(308));Ir=e,_s.dependencies={lanes:0,firstContext:e}}else Ir=Ir.next=e;return t}var Xo=null;function Bi(e){Xo===null?Xo=[e]:Xo.push(e)}function Gu(e,t,n,o){var s=t.interleaved;return s===null?(n.next=n,Bi(t)):(n.next=s.next,s.next=n),t.interleaved=n,eo(e,o)}function eo(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var go=!1;function Ai(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Ku(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function to(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function yo(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Ue&2)!==0){var s=o.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),o.pending=t,eo(e,n)}return s=o.interleaved,s===null?(t.next=t,Bi(o)):(t.next=s.next,s.next=t),o.interleaved=t,eo(e,n)}function hs(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,pr(e,n)}}function Zu(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var s=null,u=null;if(n=n.firstBaseUpdate,n!==null){do{var d={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};u===null?s=u=d:u=u.next=d,n=n.next}while(n!==null);u===null?s=u=t:u=u.next=t}else s=u=t;n={baseState:o.baseState,firstBaseUpdate:s,lastBaseUpdate:u,shared:o.shared,effects:o.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function gs(e,t,n,o){var s=e.updateQueue;go=!1;var u=s.firstBaseUpdate,d=s.lastBaseUpdate,b=s.shared.pending;if(b!==null){s.shared.pending=null;var j=b,B=j.next;j.next=null,d===null?u=B:d.next=B,d=j;var J=e.alternate;J!==null&&(J=J.updateQueue,b=J.lastBaseUpdate,b!==d&&(b===null?J.firstBaseUpdate=B:b.next=B,J.lastBaseUpdate=j))}if(u!==null){var ee=s.baseState;d=0,J=B=j=null,b=u;do{var K=b.lane,me=b.eventTime;if((o&K)===K){J!==null&&(J=J.next={eventTime:me,lane:0,tag:b.tag,payload:b.payload,callback:b.callback,next:null});e:{var ye=e,xe=b;switch(K=t,me=n,xe.tag){case 1:if(ye=xe.payload,typeof ye=="function"){ee=ye.call(me,ee,K);break e}ee=ye;break e;case 3:ye.flags=ye.flags&-65537|128;case 0:if(ye=xe.payload,K=typeof ye=="function"?ye.call(me,ee,K):ye,K==null)break e;ee=re({},ee,K);break e;case 2:go=!0}}b.callback!==null&&b.lane!==0&&(e.flags|=64,K=s.effects,K===null?s.effects=[b]:K.push(b))}else me={eventTime:me,lane:K,tag:b.tag,payload:b.payload,callback:b.callback,next:null},J===null?(B=J=me,j=ee):J=J.next=me,d|=K;if(b=b.next,b===null){if(b=s.shared.pending,b===null)break;K=b,b=K.next,K.next=null,s.lastBaseUpdate=K,s.shared.pending=null}}while(!0);if(J===null&&(j=ee),s.baseState=j,s.firstBaseUpdate=B,s.lastBaseUpdate=J,t=s.shared.interleaved,t!==null){s=t;do d|=s.lane,s=s.next;while(s!==t)}else u===null&&(s.shared.lanes=0);Go|=d,e.lanes=d,e.memoizedState=ee}}function Ju(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],s=o.callback;if(s!==null){if(o.callback=null,o=n,typeof s!="function")throw Error(i(191,s));s.call(o)}}}var hl={},On=po(hl),gl=po(hl),yl=po(hl);function Vo(e){if(e===hl)throw Error(i(174));return e}function Wi(e,t){switch(qe(yl,t),qe(gl,e),qe(On,hl),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:rr(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=rr(t,e)}ot(On),qe(On,t)}function $r(){ot(On),ot(gl),ot(yl)}function qu(e){Vo(yl.current);var t=Vo(On.current),n=rr(t,e.type);t!==n&&(qe(gl,e),qe(On,n))}function Yi(e){gl.current===e&&(ot(On),ot(gl))}var ct=po(0);function ys(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Hi=[];function Ui(){for(var e=0;e<Hi.length;e++)Hi[e]._workInProgressVersionPrimary=null;Hi.length=0}var xs=A.ReactCurrentDispatcher,Xi=A.ReactCurrentBatchConfig,Qo=0,dt=null,vt=null,kt=null,vs=!1,xl=!1,vl=0,nm=0;function Mt(){throw Error(i(321))}function Vi(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!bn(e[n],t[n]))return!1;return!0}function Qi(e,t,n,o,s,u){if(Qo=u,dt=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,xs.current=e===null||e.memoizedState===null?sm:im,e=n(o,s),xl){u=0;do{if(xl=!1,vl=0,25<=u)throw Error(i(301));u+=1,kt=vt=null,t.updateQueue=null,xs.current=am,e=n(o,s)}while(xl)}if(xs.current=ks,t=vt!==null&&vt.next!==null,Qo=0,kt=vt=dt=null,vs=!1,t)throw Error(i(300));return e}function Gi(){var e=vl!==0;return vl=0,e}function Dn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return kt===null?dt.memoizedState=kt=e:kt=kt.next=e,kt}function pn(){if(vt===null){var e=dt.alternate;e=e!==null?e.memoizedState:null}else e=vt.next;var t=kt===null?dt.memoizedState:kt.next;if(t!==null)kt=t,vt=e;else{if(e===null)throw Error(i(310));vt=e,e={memoizedState:vt.memoizedState,baseState:vt.baseState,baseQueue:vt.baseQueue,queue:vt.queue,next:null},kt===null?dt.memoizedState=kt=e:kt=kt.next=e}return kt}function bl(e,t){return typeof t=="function"?t(e):t}function Ki(e){var t=pn(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var o=vt,s=o.baseQueue,u=n.pending;if(u!==null){if(s!==null){var d=s.next;s.next=u.next,u.next=d}o.baseQueue=s=u,n.pending=null}if(s!==null){u=s.next,o=o.baseState;var b=d=null,j=null,B=u;do{var J=B.lane;if((Qo&J)===J)j!==null&&(j=j.next={lane:0,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null}),o=B.hasEagerState?B.eagerState:e(o,B.action);else{var ee={lane:J,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null};j===null?(b=j=ee,d=o):j=j.next=ee,dt.lanes|=J,Go|=J}B=B.next}while(B!==null&&B!==u);j===null?d=o:j.next=b,bn(o,t.memoizedState)||(Qt=!0),t.memoizedState=o,t.baseState=d,t.baseQueue=j,n.lastRenderedState=o}if(e=n.interleaved,e!==null){s=e;do u=s.lane,dt.lanes|=u,Go|=u,s=s.next;while(s!==e)}else s===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Zi(e){var t=pn(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var o=n.dispatch,s=n.pending,u=t.memoizedState;if(s!==null){n.pending=null;var d=s=s.next;do u=e(u,d.action),d=d.next;while(d!==s);bn(u,t.memoizedState)||(Qt=!0),t.memoizedState=u,t.baseQueue===null&&(t.baseState=u),n.lastRenderedState=u}return[u,o]}function ec(){}function tc(e,t){var n=dt,o=pn(),s=t(),u=!bn(o.memoizedState,s);if(u&&(o.memoizedState=s,Qt=!0),o=o.queue,Ji(rc.bind(null,n,o,e),[e]),o.getSnapshot!==t||u||kt!==null&&kt.memoizedState.tag&1){if(n.flags|=2048,wl(9,oc.bind(null,n,o,s,t),void 0,null),St===null)throw Error(i(349));(Qo&30)!==0||nc(n,t,s)}return s}function nc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=dt.updateQueue,t===null?(t={lastEffect:null,stores:null},dt.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function oc(e,t,n,o){t.value=n,t.getSnapshot=o,lc(t)&&sc(e)}function rc(e,t,n){return n(function(){lc(t)&&sc(e)})}function lc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!bn(e,n)}catch{return!0}}function sc(e){var t=eo(e,1);t!==null&&jn(t,e,1,-1)}function ic(e){var t=Dn();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:bl,lastRenderedState:e},t.queue=e,e=e.dispatch=lm.bind(null,dt,e),[t.memoizedState,e]}function wl(e,t,n,o){return e={tag:e,create:t,destroy:n,deps:o,next:null},t=dt.updateQueue,t===null?(t={lastEffect:null,stores:null},dt.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e)),e}function ac(){return pn().memoizedState}function bs(e,t,n,o){var s=Dn();dt.flags|=e,s.memoizedState=wl(1|t,n,void 0,o===void 0?null:o)}function ws(e,t,n,o){var s=pn();o=o===void 0?null:o;var u=void 0;if(vt!==null){var d=vt.memoizedState;if(u=d.destroy,o!==null&&Vi(o,d.deps)){s.memoizedState=wl(t,n,u,o);return}}dt.flags|=e,s.memoizedState=wl(1|t,n,u,o)}function uc(e,t){return bs(8390656,8,e,t)}function Ji(e,t){return ws(2048,8,e,t)}function cc(e,t){return ws(4,2,e,t)}function dc(e,t){return ws(4,4,e,t)}function fc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function mc(e,t,n){return n=n!=null?n.concat([e]):null,ws(4,4,fc.bind(null,t,e),n)}function qi(){}function pc(e,t){var n=pn();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Vi(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function _c(e,t){var n=pn();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Vi(t,o[1])?o[0]:(e=e(),n.memoizedState=[e,t],e)}function hc(e,t,n){return(Qo&21)===0?(e.baseState&&(e.baseState=!1,Qt=!0),e.memoizedState=n):(bn(n,t)||(n=tl(),dt.lanes|=n,Go|=n,e.baseState=!0),t)}function om(e,t){var n=We;We=n!==0&&4>n?n:4,e(!0);var o=Xi.transition;Xi.transition={};try{e(!1),t()}finally{We=n,Xi.transition=o}}function gc(){return pn().memoizedState}function rm(e,t,n){var o=wo(e);if(n={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null},yc(e))xc(t,n);else if(n=Gu(e,t,n,o),n!==null){var s=Bt();jn(n,e,o,s),vc(n,t,o)}}function lm(e,t,n){var o=wo(e),s={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null};if(yc(e))xc(t,s);else{var u=e.alternate;if(e.lanes===0&&(u===null||u.lanes===0)&&(u=t.lastRenderedReducer,u!==null))try{var d=t.lastRenderedState,b=u(d,n);if(s.hasEagerState=!0,s.eagerState=b,bn(b,d)){var j=t.interleaved;j===null?(s.next=s,Bi(t)):(s.next=j.next,j.next=s),t.interleaved=s;return}}catch{}finally{}n=Gu(e,t,s,o),n!==null&&(s=Bt(),jn(n,e,o,s),vc(n,t,o))}}function yc(e){var t=e.alternate;return e===dt||t!==null&&t===dt}function xc(e,t){xl=vs=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function vc(e,t,n){if((n&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,pr(e,n)}}var ks={readContext:mn,useCallback:Mt,useContext:Mt,useEffect:Mt,useImperativeHandle:Mt,useInsertionEffect:Mt,useLayoutEffect:Mt,useMemo:Mt,useReducer:Mt,useRef:Mt,useState:Mt,useDebugValue:Mt,useDeferredValue:Mt,useTransition:Mt,useMutableSource:Mt,useSyncExternalStore:Mt,useId:Mt,unstable_isNewReconciler:!1},sm={readContext:mn,useCallback:function(e,t){return Dn().memoizedState=[e,t===void 0?null:t],e},useContext:mn,useEffect:uc,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,bs(4194308,4,fc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return bs(4194308,4,e,t)},useInsertionEffect:function(e,t){return bs(4,2,e,t)},useMemo:function(e,t){var n=Dn();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var o=Dn();return t=n!==void 0?n(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=rm.bind(null,dt,e),[o.memoizedState,e]},useRef:function(e){var t=Dn();return e={current:e},t.memoizedState=e},useState:ic,useDebugValue:qi,useDeferredValue:function(e){return Dn().memoizedState=e},useTransition:function(){var e=ic(!1),t=e[0];return e=om.bind(null,e[1]),Dn().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var o=dt,s=Dn();if(it){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),St===null)throw Error(i(349));(Qo&30)!==0||nc(o,t,n)}s.memoizedState=n;var u={value:n,getSnapshot:t};return s.queue=u,uc(rc.bind(null,o,u,e),[e]),o.flags|=2048,wl(9,oc.bind(null,o,u,n,t),void 0,null),n},useId:function(){var e=Dn(),t=St.identifierPrefix;if(it){var n=qn,o=Jn;n=(o&~(1<<32-en(o)-1)).toString(32)+n,t=":"+t+"R"+n,n=vl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=nm++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},im={readContext:mn,useCallback:pc,useContext:mn,useEffect:Ji,useImperativeHandle:mc,useInsertionEffect:cc,useLayoutEffect:dc,useMemo:_c,useReducer:Ki,useRef:ac,useState:function(){return Ki(bl)},useDebugValue:qi,useDeferredValue:function(e){var t=pn();return hc(t,vt.memoizedState,e)},useTransition:function(){var e=Ki(bl)[0],t=pn().memoizedState;return[e,t]},useMutableSource:ec,useSyncExternalStore:tc,useId:gc,unstable_isNewReconciler:!1},am={readContext:mn,useCallback:pc,useContext:mn,useEffect:Ji,useImperativeHandle:mc,useInsertionEffect:cc,useLayoutEffect:dc,useMemo:_c,useReducer:Zi,useRef:ac,useState:function(){return Zi(bl)},useDebugValue:qi,useDeferredValue:function(e){var t=pn();return vt===null?t.memoizedState=e:hc(t,vt.memoizedState,e)},useTransition:function(){var e=Zi(bl)[0],t=pn().memoizedState;return[e,t]},useMutableSource:ec,useSyncExternalStore:tc,useId:gc,unstable_isNewReconciler:!1};function kn(e,t){if(e&&e.defaultProps){t=re({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ea(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:re({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ss={isMounted:function(e){return(e=e._reactInternals)?pt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var o=Bt(),s=wo(e),u=to(o,s);u.payload=t,n!=null&&(u.callback=n),t=yo(e,u,s),t!==null&&(jn(t,e,s,o),hs(t,e,s))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=Bt(),s=wo(e),u=to(o,s);u.tag=1,u.payload=t,n!=null&&(u.callback=n),t=yo(e,u,s),t!==null&&(jn(t,e,s,o),hs(t,e,s))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Bt(),o=wo(e),s=to(n,o);s.tag=2,t!=null&&(s.callback=t),t=yo(e,s,o),t!==null&&(jn(t,e,o,n),hs(t,e,o))}};function bc(e,t,n,o,s,u,d){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,u,d):t.prototype&&t.prototype.isPureReactComponent?!al(n,o)||!al(s,u):!0}function wc(e,t,n){var o=!1,s=_o,u=t.contextType;return typeof u=="object"&&u!==null?u=mn(u):(s=Vt(t)?Yo:$t.current,o=t.contextTypes,u=(o=o!=null)?Er(e,s):_o),t=new t(n,u),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ss,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=u),t}function kc(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&Ss.enqueueReplaceState(t,t.state,null)}function ta(e,t,n,o){var s=e.stateNode;s.props=n,s.state=e.memoizedState,s.refs={},Ai(e);var u=t.contextType;typeof u=="object"&&u!==null?s.context=mn(u):(u=Vt(t)?Yo:$t.current,s.context=Er(e,u)),s.state=e.memoizedState,u=t.getDerivedStateFromProps,typeof u=="function"&&(ea(e,t,u,n),s.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(t=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),t!==s.state&&Ss.enqueueReplaceState(s,s.state,null),gs(e,n,s,o),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function Mr(e,t){try{var n="",o=t;do n+=Be(o),o=o.return;while(o);var s=n}catch(u){s=`
Error generating stack: `+u.message+`
`+u.stack}return{value:e,source:t,stack:s,digest:null}}function na(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function oa(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var um=typeof WeakMap=="function"?WeakMap:Map;function Sc(e,t,n){n=to(-1,n),n.tag=3,n.payload={element:null};var o=t.value;return n.callback=function(){Ts||(Ts=!0,ya=o),oa(e,t)},n}function Cc(e,t,n){n=to(-1,n),n.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var s=t.value;n.payload=function(){return o(s)},n.callback=function(){oa(e,t)}}var u=e.stateNode;return u!==null&&typeof u.componentDidCatch=="function"&&(n.callback=function(){oa(e,t),typeof o!="function"&&(vo===null?vo=new Set([this]):vo.add(this));var d=t.stack;this.componentDidCatch(t.value,{componentStack:d!==null?d:""})}),n}function jc(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new um;var s=new Set;o.set(t,s)}else s=o.get(t),s===void 0&&(s=new Set,o.set(t,s));s.has(n)||(s.add(n),e=km.bind(null,e,t,n),t.then(e,e))}function Ec(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Nc(e,t,n,o,s){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=to(-1,1),t.tag=2,yo(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=s,e)}var cm=A.ReactCurrentOwner,Qt=!1;function Ft(e,t,n,o){t.child=e===null?Qu(t,null,n,o):Tr(t,e.child,n,o)}function Pc(e,t,n,o,s){n=n.render;var u=t.ref;return Rr(t,s),o=Qi(e,t,n,o,u,s),n=Gi(),e!==null&&!Qt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,no(e,t,s)):(it&&n&&Ti(t),t.flags|=1,Ft(e,t,o,s),t.child)}function Lc(e,t,n,o,s){if(e===null){var u=n.type;return typeof u=="function"&&!Ca(u)&&u.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=u,Tc(e,t,u,o,s)):(e=Os(n.type,null,o,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(u=e.child,(e.lanes&s)===0){var d=u.memoizedProps;if(n=n.compare,n=n!==null?n:al,n(d,o)&&e.ref===t.ref)return no(e,t,s)}return t.flags|=1,e=So(u,o),e.ref=t.ref,e.return=t,t.child=e}function Tc(e,t,n,o,s){if(e!==null){var u=e.memoizedProps;if(al(u,o)&&e.ref===t.ref)if(Qt=!1,t.pendingProps=o=u,(e.lanes&s)!==0)(e.flags&131072)!==0&&(Qt=!0);else return t.lanes=e.lanes,no(e,t,s)}return ra(e,t,n,o,s)}function Ic(e,t,n){var o=t.pendingProps,s=o.children,u=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},qe(Or,sn),sn|=n;else{if((n&1073741824)===0)return e=u!==null?u.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,qe(Or,sn),sn|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=u!==null?u.baseLanes:n,qe(Or,sn),sn|=o}else u!==null?(o=u.baseLanes|n,t.memoizedState=null):o=n,qe(Or,sn),sn|=o;return Ft(e,t,s,n),t.child}function Rc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ra(e,t,n,o,s){var u=Vt(n)?Yo:$t.current;return u=Er(t,u),Rr(t,s),n=Qi(e,t,n,o,u,s),o=Gi(),e!==null&&!Qt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,no(e,t,s)):(it&&o&&Ti(t),t.flags|=1,Ft(e,t,n,s),t.child)}function $c(e,t,n,o,s){if(Vt(n)){var u=!0;as(t)}else u=!1;if(Rr(t,s),t.stateNode===null)js(e,t),wc(t,n,o),ta(t,n,o,s),o=!0;else if(e===null){var d=t.stateNode,b=t.memoizedProps;d.props=b;var j=d.context,B=n.contextType;typeof B=="object"&&B!==null?B=mn(B):(B=Vt(n)?Yo:$t.current,B=Er(t,B));var J=n.getDerivedStateFromProps,ee=typeof J=="function"||typeof d.getSnapshotBeforeUpdate=="function";ee||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(b!==o||j!==B)&&kc(t,d,o,B),go=!1;var K=t.memoizedState;d.state=K,gs(t,o,d,s),j=t.memoizedState,b!==o||K!==j||Xt.current||go?(typeof J=="function"&&(ea(t,n,J,o),j=t.memoizedState),(b=go||bc(t,n,b,o,K,j,B))?(ee||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount()),typeof d.componentDidMount=="function"&&(t.flags|=4194308)):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=j),d.props=o,d.state=j,d.context=B,o=b):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{d=t.stateNode,Ku(e,t),b=t.memoizedProps,B=t.type===t.elementType?b:kn(t.type,b),d.props=B,ee=t.pendingProps,K=d.context,j=n.contextType,typeof j=="object"&&j!==null?j=mn(j):(j=Vt(n)?Yo:$t.current,j=Er(t,j));var me=n.getDerivedStateFromProps;(J=typeof me=="function"||typeof d.getSnapshotBeforeUpdate=="function")||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(b!==ee||K!==j)&&kc(t,d,o,j),go=!1,K=t.memoizedState,d.state=K,gs(t,o,d,s);var ye=t.memoizedState;b!==ee||K!==ye||Xt.current||go?(typeof me=="function"&&(ea(t,n,me,o),ye=t.memoizedState),(B=go||bc(t,n,B,o,K,ye,j)||!1)?(J||typeof d.UNSAFE_componentWillUpdate!="function"&&typeof d.componentWillUpdate!="function"||(typeof d.componentWillUpdate=="function"&&d.componentWillUpdate(o,ye,j),typeof d.UNSAFE_componentWillUpdate=="function"&&d.UNSAFE_componentWillUpdate(o,ye,j)),typeof d.componentDidUpdate=="function"&&(t.flags|=4),typeof d.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof d.componentDidUpdate!="function"||b===e.memoizedProps&&K===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||b===e.memoizedProps&&K===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=ye),d.props=o,d.state=ye,d.context=j,o=B):(typeof d.componentDidUpdate!="function"||b===e.memoizedProps&&K===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||b===e.memoizedProps&&K===e.memoizedState||(t.flags|=1024),o=!1)}return la(e,t,n,o,u,s)}function la(e,t,n,o,s,u){Rc(e,t);var d=(t.flags&128)!==0;if(!o&&!d)return s&&Fu(t,n,!1),no(e,t,u);o=t.stateNode,cm.current=t;var b=d&&typeof n.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&d?(t.child=Tr(t,e.child,null,u),t.child=Tr(t,null,b,u)):Ft(e,t,b,u),t.memoizedState=o.state,s&&Fu(t,n,!0),t.child}function Mc(e){var t=e.stateNode;t.pendingContext?Ou(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Ou(e,t.context,!1),Wi(e,t.containerInfo)}function zc(e,t,n,o,s){return Lr(),Mi(s),t.flags|=256,Ft(e,t,n,o),t.child}var sa={dehydrated:null,treeContext:null,retryLane:0};function ia(e){return{baseLanes:e,cachePool:null,transitions:null}}function Oc(e,t,n){var o=t.pendingProps,s=ct.current,u=!1,d=(t.flags&128)!==0,b;if((b=d)||(b=e!==null&&e.memoizedState===null?!1:(s&2)!==0),b?(u=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),qe(ct,s&1),e===null)return $i(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(d=o.children,e=o.fallback,u?(o=t.mode,u=t.child,d={mode:"hidden",children:d},(o&1)===0&&u!==null?(u.childLanes=0,u.pendingProps=d):u=Ds(d,o,0,null),e=qo(e,o,n,null),u.return=t,e.return=t,u.sibling=e,t.child=u,t.child.memoizedState=ia(n),t.memoizedState=sa,e):aa(t,d));if(s=e.memoizedState,s!==null&&(b=s.dehydrated,b!==null))return dm(e,t,d,o,b,s,n);if(u){u=o.fallback,d=t.mode,s=e.child,b=s.sibling;var j={mode:"hidden",children:o.children};return(d&1)===0&&t.child!==s?(o=t.child,o.childLanes=0,o.pendingProps=j,t.deletions=null):(o=So(s,j),o.subtreeFlags=s.subtreeFlags&14680064),b!==null?u=So(b,u):(u=qo(u,d,n,null),u.flags|=2),u.return=t,o.return=t,o.sibling=u,t.child=o,o=u,u=t.child,d=e.child.memoizedState,d=d===null?ia(n):{baseLanes:d.baseLanes|n,cachePool:null,transitions:d.transitions},u.memoizedState=d,u.childLanes=e.childLanes&~n,t.memoizedState=sa,o}return u=e.child,e=u.sibling,o=So(u,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=n),o.return=t,o.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=o,t.memoizedState=null,o}function aa(e,t){return t=Ds({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Cs(e,t,n,o){return o!==null&&Mi(o),Tr(t,e.child,null,n),e=aa(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function dm(e,t,n,o,s,u,d){if(n)return t.flags&256?(t.flags&=-257,o=na(Error(i(422))),Cs(e,t,d,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(u=o.fallback,s=t.mode,o=Ds({mode:"visible",children:o.children},s,0,null),u=qo(u,s,d,null),u.flags|=2,o.return=t,u.return=t,o.sibling=u,t.child=o,(t.mode&1)!==0&&Tr(t,e.child,null,d),t.child.memoizedState=ia(d),t.memoizedState=sa,u);if((t.mode&1)===0)return Cs(e,t,d,null);if(s.data==="$!"){if(o=s.nextSibling&&s.nextSibling.dataset,o)var b=o.dgst;return o=b,u=Error(i(419)),o=na(u,o,void 0),Cs(e,t,d,o)}if(b=(d&e.childLanes)!==0,Qt||b){if(o=St,o!==null){switch(d&-d){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=(s&(o.suspendedLanes|d))!==0?0:s,s!==0&&s!==u.retryLane&&(u.retryLane=s,eo(e,s),jn(o,e,s,-1))}return Sa(),o=na(Error(i(421))),Cs(e,t,d,o)}return s.data==="$?"?(t.flags|=128,t.child=e.child,t=Sm.bind(null,e),s._reactRetry=t,null):(e=u.treeContext,ln=mo(s.nextSibling),rn=t,it=!0,wn=null,e!==null&&(dn[fn++]=Jn,dn[fn++]=qn,dn[fn++]=Ho,Jn=e.id,qn=e.overflow,Ho=t),t=aa(t,o.children),t.flags|=4096,t)}function Dc(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),Fi(e.return,t,n)}function ua(e,t,n,o,s){var u=e.memoizedState;u===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:s}:(u.isBackwards=t,u.rendering=null,u.renderingStartTime=0,u.last=o,u.tail=n,u.tailMode=s)}function Fc(e,t,n){var o=t.pendingProps,s=o.revealOrder,u=o.tail;if(Ft(e,t,o.children,n),o=ct.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Dc(e,n,t);else if(e.tag===19)Dc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(qe(ct,o),(t.mode&1)===0)t.memoizedState=null;else switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&ys(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),ua(t,!1,s,n,u);break;case"backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&ys(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}ua(t,!0,n,null,u);break;case"together":ua(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function js(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function no(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Go|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=So(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=So(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function fm(e,t,n){switch(t.tag){case 3:Mc(t),Lr();break;case 5:qu(t);break;case 1:Vt(t.type)&&as(t);break;case 4:Wi(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,s=t.memoizedProps.value;qe(ps,o._currentValue),o._currentValue=s;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(qe(ct,ct.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Oc(e,t,n):(qe(ct,ct.current&1),e=no(e,t,n),e!==null?e.sibling:null);qe(ct,ct.current&1);break;case 19:if(o=(n&t.childLanes)!==0,(e.flags&128)!==0){if(o)return Fc(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),qe(ct,ct.current),o)break;return null;case 22:case 23:return t.lanes=0,Ic(e,t,n)}return no(e,t,n)}var Bc,ca,Ac,Wc;Bc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},ca=function(){},Ac=function(e,t,n,o){var s=e.memoizedProps;if(s!==o){e=t.stateNode,Vo(On.current);var u=null;switch(n){case"input":s=tr(e,s),o=tr(e,o),u=[];break;case"select":s=re({},s,{value:void 0}),o=re({},o,{value:void 0}),u=[];break;case"textarea":s=or(e,s),o=or(e,o),u=[];break;default:typeof s.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=ls)}Lo(n,o);var d;n=null;for(B in s)if(!o.hasOwnProperty(B)&&s.hasOwnProperty(B)&&s[B]!=null)if(B==="style"){var b=s[B];for(d in b)b.hasOwnProperty(d)&&(n||(n={}),n[d]="")}else B!=="dangerouslySetInnerHTML"&&B!=="children"&&B!=="suppressContentEditableWarning"&&B!=="suppressHydrationWarning"&&B!=="autoFocus"&&(_.hasOwnProperty(B)?u||(u=[]):(u=u||[]).push(B,null));for(B in o){var j=o[B];if(b=s!=null?s[B]:void 0,o.hasOwnProperty(B)&&j!==b&&(j!=null||b!=null))if(B==="style")if(b){for(d in b)!b.hasOwnProperty(d)||j&&j.hasOwnProperty(d)||(n||(n={}),n[d]="");for(d in j)j.hasOwnProperty(d)&&b[d]!==j[d]&&(n||(n={}),n[d]=j[d])}else n||(u||(u=[]),u.push(B,n)),n=j;else B==="dangerouslySetInnerHTML"?(j=j?j.__html:void 0,b=b?b.__html:void 0,j!=null&&b!==j&&(u=u||[]).push(B,j)):B==="children"?typeof j!="string"&&typeof j!="number"||(u=u||[]).push(B,""+j):B!=="suppressContentEditableWarning"&&B!=="suppressHydrationWarning"&&(_.hasOwnProperty(B)?(j!=null&&B==="onScroll"&&nt("scroll",e),u||b===j||(u=[])):(u=u||[]).push(B,j))}n&&(u=u||[]).push("style",n);var B=u;(t.updateQueue=B)&&(t.flags|=4)}},Wc=function(e,t,n,o){n!==o&&(t.flags|=4)};function kl(e,t){if(!it)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function zt(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,o|=s.subtreeFlags&14680064,o|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,o|=s.subtreeFlags,o|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function mm(e,t,n){var o=t.pendingProps;switch(Ii(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return zt(t),null;case 1:return Vt(t.type)&&is(),zt(t),null;case 3:return o=t.stateNode,$r(),ot(Xt),ot($t),Ui(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(fs(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,wn!==null&&(ba(wn),wn=null))),ca(e,t),zt(t),null;case 5:Yi(t);var s=Vo(yl.current);if(n=t.type,e!==null&&t.stateNode!=null)Ac(e,t,n,o,s),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(i(166));return zt(t),null}if(e=Vo(On.current),fs(t)){o=t.stateNode,n=t.type;var u=t.memoizedProps;switch(o[zn]=t,o[ml]=u,e=(t.mode&1)!==0,n){case"dialog":nt("cancel",o),nt("close",o);break;case"iframe":case"object":case"embed":nt("load",o);break;case"video":case"audio":for(s=0;s<cl.length;s++)nt(cl[s],o);break;case"source":nt("error",o);break;case"img":case"image":case"link":nt("error",o),nt("load",o);break;case"details":nt("toggle",o);break;case"input":Xr(o,u),nt("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!u.multiple},nt("invalid",o);break;case"textarea":Nn(o,u),nt("invalid",o)}Lo(n,u),s=null;for(var d in u)if(u.hasOwnProperty(d)){var b=u[d];d==="children"?typeof b=="string"?o.textContent!==b&&(u.suppressHydrationWarning!==!0&&rs(o.textContent,b,e),s=["children",b]):typeof b=="number"&&o.textContent!==""+b&&(u.suppressHydrationWarning!==!0&&rs(o.textContent,b,e),s=["children",""+b]):_.hasOwnProperty(d)&&b!=null&&d==="onScroll"&&nt("scroll",o)}switch(n){case"input":an(o),Re(o,u,!0);break;case"textarea":an(o),Vr(o);break;case"select":case"option":break;default:typeof u.onClick=="function"&&(o.onclick=ls)}o=s,t.updateQueue=o,o!==null&&(t.flags|=4)}else{d=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Qr(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=d.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=d.createElement(n,{is:o.is}):(e=d.createElement(n),n==="select"&&(d=e,o.multiple?d.multiple=!0:o.size&&(d.size=o.size))):e=d.createElementNS(e,n),e[zn]=t,e[ml]=o,Bc(e,t,!1,!1),t.stateNode=e;e:{switch(d=To(n,o),n){case"dialog":nt("cancel",e),nt("close",e),s=o;break;case"iframe":case"object":case"embed":nt("load",e),s=o;break;case"video":case"audio":for(s=0;s<cl.length;s++)nt(cl[s],e);s=o;break;case"source":nt("error",e),s=o;break;case"img":case"image":case"link":nt("error",e),nt("load",e),s=o;break;case"details":nt("toggle",e),s=o;break;case"input":Xr(e,o),s=tr(e,o),nt("invalid",e);break;case"option":s=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},s=re({},o,{value:void 0}),nt("invalid",e);break;case"textarea":Nn(e,o),s=or(e,o),nt("invalid",e);break;default:s=o}Lo(n,s),b=s;for(u in b)if(b.hasOwnProperty(u)){var j=b[u];u==="style"?Bl(e,j):u==="dangerouslySetInnerHTML"?(j=j?j.__html:void 0,j!=null&&Fl(e,j)):u==="children"?typeof j=="string"?(n!=="textarea"||j!=="")&&Et(e,j):typeof j=="number"&&Et(e,""+j):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(_.hasOwnProperty(u)?j!=null&&u==="onScroll"&&nt("scroll",e):j!=null&&T(e,u,j,d))}switch(n){case"input":an(e),Re(e,o,!1);break;case"textarea":an(e),Vr(e);break;case"option":o.value!=null&&e.setAttribute("value",""+Ye(o.value));break;case"select":e.multiple=!!o.multiple,u=o.value,u!=null?Tt(e,!!o.multiple,u,!1):o.defaultValue!=null&&Tt(e,!!o.multiple,o.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=ls)}switch(n){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return zt(t),null;case 6:if(e&&t.stateNode!=null)Wc(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(i(166));if(n=Vo(yl.current),Vo(On.current),fs(t)){if(o=t.stateNode,n=t.memoizedProps,o[zn]=t,(u=o.nodeValue!==n)&&(e=rn,e!==null))switch(e.tag){case 3:rs(o.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&rs(o.nodeValue,n,(e.mode&1)!==0)}u&&(t.flags|=4)}else o=(n.nodeType===9?n:n.ownerDocument).createTextNode(o),o[zn]=t,t.stateNode=o}return zt(t),null;case 13:if(ot(ct),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(it&&ln!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Uu(),Lr(),t.flags|=98560,u=!1;else if(u=fs(t),o!==null&&o.dehydrated!==null){if(e===null){if(!u)throw Error(i(318));if(u=t.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(i(317));u[zn]=t}else Lr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;zt(t),u=!1}else wn!==null&&(ba(wn),wn=null),u=!0;if(!u)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(ct.current&1)!==0?bt===0&&(bt=3):Sa())),t.updateQueue!==null&&(t.flags|=4),zt(t),null);case 4:return $r(),ca(e,t),e===null&&dl(t.stateNode.containerInfo),zt(t),null;case 10:return Di(t.type._context),zt(t),null;case 17:return Vt(t.type)&&is(),zt(t),null;case 19:if(ot(ct),u=t.memoizedState,u===null)return zt(t),null;if(o=(t.flags&128)!==0,d=u.rendering,d===null)if(o)kl(u,!1);else{if(bt!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(d=ys(e),d!==null){for(t.flags|=128,kl(u,!1),o=d.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=n,n=t.child;n!==null;)u=n,e=o,u.flags&=14680066,d=u.alternate,d===null?(u.childLanes=0,u.lanes=e,u.child=null,u.subtreeFlags=0,u.memoizedProps=null,u.memoizedState=null,u.updateQueue=null,u.dependencies=null,u.stateNode=null):(u.childLanes=d.childLanes,u.lanes=d.lanes,u.child=d.child,u.subtreeFlags=0,u.deletions=null,u.memoizedProps=d.memoizedProps,u.memoizedState=d.memoizedState,u.updateQueue=d.updateQueue,u.type=d.type,e=d.dependencies,u.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return qe(ct,ct.current&1|2),t.child}e=e.sibling}u.tail!==null&&rt()>Dr&&(t.flags|=128,o=!0,kl(u,!1),t.lanes=4194304)}else{if(!o)if(e=ys(d),e!==null){if(t.flags|=128,o=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),kl(u,!0),u.tail===null&&u.tailMode==="hidden"&&!d.alternate&&!it)return zt(t),null}else 2*rt()-u.renderingStartTime>Dr&&n!==1073741824&&(t.flags|=128,o=!0,kl(u,!1),t.lanes=4194304);u.isBackwards?(d.sibling=t.child,t.child=d):(n=u.last,n!==null?n.sibling=d:t.child=d,u.last=d)}return u.tail!==null?(t=u.tail,u.rendering=t,u.tail=t.sibling,u.renderingStartTime=rt(),t.sibling=null,n=ct.current,qe(ct,o?n&1|2:n&1),t):(zt(t),null);case 22:case 23:return ka(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(sn&1073741824)!==0&&(zt(t),t.subtreeFlags&6&&(t.flags|=8192)):zt(t),null;case 24:return null;case 25:return null}throw Error(i(156,t.tag))}function pm(e,t){switch(Ii(t),t.tag){case 1:return Vt(t.type)&&is(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return $r(),ot(Xt),ot($t),Ui(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Yi(t),null;case 13:if(ot(ct),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));Lr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ot(ct),null;case 4:return $r(),null;case 10:return Di(t.type._context),null;case 22:case 23:return ka(),null;case 24:return null;default:return null}}var Es=!1,Ot=!1,_m=typeof WeakSet=="function"?WeakSet:Set,pe=null;function zr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(o){mt(e,t,o)}else n.current=null}function da(e,t,n){try{n()}catch(o){mt(e,t,o)}}var Yc=!1;function hm(e,t){if(ki=Ao,e=bu(),_i(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var o=n.getSelection&&n.getSelection();if(o&&o.rangeCount!==0){n=o.anchorNode;var s=o.anchorOffset,u=o.focusNode;o=o.focusOffset;try{n.nodeType,u.nodeType}catch{n=null;break e}var d=0,b=-1,j=-1,B=0,J=0,ee=e,K=null;t:for(;;){for(var me;ee!==n||s!==0&&ee.nodeType!==3||(b=d+s),ee!==u||o!==0&&ee.nodeType!==3||(j=d+o),ee.nodeType===3&&(d+=ee.nodeValue.length),(me=ee.firstChild)!==null;)K=ee,ee=me;for(;;){if(ee===e)break t;if(K===n&&++B===s&&(b=d),K===u&&++J===o&&(j=d),(me=ee.nextSibling)!==null)break;ee=K,K=ee.parentNode}ee=me}n=b===-1||j===-1?null:{start:b,end:j}}else n=null}n=n||{start:0,end:0}}else n=null;for(Si={focusedElem:e,selectionRange:n},Ao=!1,pe=t;pe!==null;)if(t=pe,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,pe=e;else for(;pe!==null;){t=pe;try{var ye=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(ye!==null){var xe=ye.memoizedProps,_t=ye.memoizedState,M=t.stateNode,E=M.getSnapshotBeforeUpdate(t.elementType===t.type?xe:kn(t.type,xe),_t);M.__reactInternalSnapshotBeforeUpdate=E}break;case 3:var O=t.stateNode.containerInfo;O.nodeType===1?O.textContent="":O.nodeType===9&&O.documentElement&&O.removeChild(O.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(i(163))}}catch(oe){mt(t,t.return,oe)}if(e=t.sibling,e!==null){e.return=t.return,pe=e;break}pe=t.return}return ye=Yc,Yc=!1,ye}function Sl(e,t,n){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var s=o=o.next;do{if((s.tag&e)===e){var u=s.destroy;s.destroy=void 0,u!==void 0&&da(t,n,u)}s=s.next}while(s!==o)}}function Ns(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var o=n.create;n.destroy=o()}n=n.next}while(n!==t)}}function fa(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Hc(e){var t=e.alternate;t!==null&&(e.alternate=null,Hc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[zn],delete t[ml],delete t[Ni],delete t[Jf],delete t[qf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Uc(e){return e.tag===5||e.tag===3||e.tag===4}function Xc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Uc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ma(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ls));else if(o!==4&&(e=e.child,e!==null))for(ma(e,t,n),e=e.sibling;e!==null;)ma(e,t,n),e=e.sibling}function pa(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(pa(e,t,n),e=e.sibling;e!==null;)pa(e,t,n),e=e.sibling}var Pt=null,Sn=!1;function xo(e,t,n){for(n=n.child;n!==null;)Vc(e,t,n),n=n.sibling}function Vc(e,t,n){if(It&&typeof It.onCommitFiberUnmount=="function")try{It.onCommitFiberUnmount(Xn,n)}catch{}switch(n.tag){case 5:Ot||zr(n,t);case 6:var o=Pt,s=Sn;Pt=null,xo(e,t,n),Pt=o,Sn=s,Pt!==null&&(Sn?(e=Pt,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Pt.removeChild(n.stateNode));break;case 18:Pt!==null&&(Sn?(e=Pt,n=n.stateNode,e.nodeType===8?Ei(e.parentNode,n):e.nodeType===1&&Ei(e,n),co(e)):Ei(Pt,n.stateNode));break;case 4:o=Pt,s=Sn,Pt=n.stateNode.containerInfo,Sn=!0,xo(e,t,n),Pt=o,Sn=s;break;case 0:case 11:case 14:case 15:if(!Ot&&(o=n.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){s=o=o.next;do{var u=s,d=u.destroy;u=u.tag,d!==void 0&&((u&2)!==0||(u&4)!==0)&&da(n,t,d),s=s.next}while(s!==o)}xo(e,t,n);break;case 1:if(!Ot&&(zr(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=n.memoizedProps,o.state=n.memoizedState,o.componentWillUnmount()}catch(b){mt(n,t,b)}xo(e,t,n);break;case 21:xo(e,t,n);break;case 22:n.mode&1?(Ot=(o=Ot)||n.memoizedState!==null,xo(e,t,n),Ot=o):xo(e,t,n);break;default:xo(e,t,n)}}function Qc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new _m),t.forEach(function(o){var s=Cm.bind(null,e,o);n.has(o)||(n.add(o),o.then(s,s))})}}function Cn(e,t){var n=t.deletions;if(n!==null)for(var o=0;o<n.length;o++){var s=n[o];try{var u=e,d=t,b=d;e:for(;b!==null;){switch(b.tag){case 5:Pt=b.stateNode,Sn=!1;break e;case 3:Pt=b.stateNode.containerInfo,Sn=!0;break e;case 4:Pt=b.stateNode.containerInfo,Sn=!0;break e}b=b.return}if(Pt===null)throw Error(i(160));Vc(u,d,s),Pt=null,Sn=!1;var j=s.alternate;j!==null&&(j.return=null),s.return=null}catch(B){mt(s,t,B)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Gc(t,e),t=t.sibling}function Gc(e,t){var n=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Cn(t,e),Fn(e),o&4){try{Sl(3,e,e.return),Ns(3,e)}catch(xe){mt(e,e.return,xe)}try{Sl(5,e,e.return)}catch(xe){mt(e,e.return,xe)}}break;case 1:Cn(t,e),Fn(e),o&512&&n!==null&&zr(n,n.return);break;case 5:if(Cn(t,e),Fn(e),o&512&&n!==null&&zr(n,n.return),e.flags&32){var s=e.stateNode;try{Et(s,"")}catch(xe){mt(e,e.return,xe)}}if(o&4&&(s=e.stateNode,s!=null)){var u=e.memoizedProps,d=n!==null?n.memoizedProps:u,b=e.type,j=e.updateQueue;if(e.updateQueue=null,j!==null)try{b==="input"&&u.type==="radio"&&u.name!=null&&No(s,u),To(b,d);var B=To(b,u);for(d=0;d<j.length;d+=2){var J=j[d],ee=j[d+1];J==="style"?Bl(s,ee):J==="dangerouslySetInnerHTML"?Fl(s,ee):J==="children"?Et(s,ee):T(s,J,ee,B)}switch(b){case"input":nr(s,u);break;case"textarea":Pn(s,u);break;case"select":var K=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!u.multiple;var me=u.value;me!=null?Tt(s,!!u.multiple,me,!1):K!==!!u.multiple&&(u.defaultValue!=null?Tt(s,!!u.multiple,u.defaultValue,!0):Tt(s,!!u.multiple,u.multiple?[]:"",!1))}s[ml]=u}catch(xe){mt(e,e.return,xe)}}break;case 6:if(Cn(t,e),Fn(e),o&4){if(e.stateNode===null)throw Error(i(162));s=e.stateNode,u=e.memoizedProps;try{s.nodeValue=u}catch(xe){mt(e,e.return,xe)}}break;case 3:if(Cn(t,e),Fn(e),o&4&&n!==null&&n.memoizedState.isDehydrated)try{co(t.containerInfo)}catch(xe){mt(e,e.return,xe)}break;case 4:Cn(t,e),Fn(e);break;case 13:Cn(t,e),Fn(e),s=e.child,s.flags&8192&&(u=s.memoizedState!==null,s.stateNode.isHidden=u,!u||s.alternate!==null&&s.alternate.memoizedState!==null||(ga=rt())),o&4&&Qc(e);break;case 22:if(J=n!==null&&n.memoizedState!==null,e.mode&1?(Ot=(B=Ot)||J,Cn(t,e),Ot=B):Cn(t,e),Fn(e),o&8192){if(B=e.memoizedState!==null,(e.stateNode.isHidden=B)&&!J&&(e.mode&1)!==0)for(pe=e,J=e.child;J!==null;){for(ee=pe=J;pe!==null;){switch(K=pe,me=K.child,K.tag){case 0:case 11:case 14:case 15:Sl(4,K,K.return);break;case 1:zr(K,K.return);var ye=K.stateNode;if(typeof ye.componentWillUnmount=="function"){o=K,n=K.return;try{t=o,ye.props=t.memoizedProps,ye.state=t.memoizedState,ye.componentWillUnmount()}catch(xe){mt(o,n,xe)}}break;case 5:zr(K,K.return);break;case 22:if(K.memoizedState!==null){Jc(ee);continue}}me!==null?(me.return=K,pe=me):Jc(ee)}J=J.sibling}e:for(J=null,ee=e;;){if(ee.tag===5){if(J===null){J=ee;try{s=ee.stateNode,B?(u=s.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none"):(b=ee.stateNode,j=ee.memoizedProps.style,d=j!=null&&j.hasOwnProperty("display")?j.display:null,b.style.display=lr("display",d))}catch(xe){mt(e,e.return,xe)}}}else if(ee.tag===6){if(J===null)try{ee.stateNode.nodeValue=B?"":ee.memoizedProps}catch(xe){mt(e,e.return,xe)}}else if((ee.tag!==22&&ee.tag!==23||ee.memoizedState===null||ee===e)&&ee.child!==null){ee.child.return=ee,ee=ee.child;continue}if(ee===e)break e;for(;ee.sibling===null;){if(ee.return===null||ee.return===e)break e;J===ee&&(J=null),ee=ee.return}J===ee&&(J=null),ee.sibling.return=ee.return,ee=ee.sibling}}break;case 19:Cn(t,e),Fn(e),o&4&&Qc(e);break;case 21:break;default:Cn(t,e),Fn(e)}}function Fn(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Uc(n)){var o=n;break e}n=n.return}throw Error(i(160))}switch(o.tag){case 5:var s=o.stateNode;o.flags&32&&(Et(s,""),o.flags&=-33);var u=Xc(e);pa(e,u,s);break;case 3:case 4:var d=o.stateNode.containerInfo,b=Xc(e);ma(e,b,d);break;default:throw Error(i(161))}}catch(j){mt(e,e.return,j)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function gm(e,t,n){pe=e,Kc(e)}function Kc(e,t,n){for(var o=(e.mode&1)!==0;pe!==null;){var s=pe,u=s.child;if(s.tag===22&&o){var d=s.memoizedState!==null||Es;if(!d){var b=s.alternate,j=b!==null&&b.memoizedState!==null||Ot;b=Es;var B=Ot;if(Es=d,(Ot=j)&&!B)for(pe=s;pe!==null;)d=pe,j=d.child,d.tag===22&&d.memoizedState!==null?qc(s):j!==null?(j.return=d,pe=j):qc(s);for(;u!==null;)pe=u,Kc(u),u=u.sibling;pe=s,Es=b,Ot=B}Zc(e)}else(s.subtreeFlags&8772)!==0&&u!==null?(u.return=s,pe=u):Zc(e)}}function Zc(e){for(;pe!==null;){var t=pe;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Ot||Ns(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!Ot)if(n===null)o.componentDidMount();else{var s=t.elementType===t.type?n.memoizedProps:kn(t.type,n.memoizedProps);o.componentDidUpdate(s,n.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var u=t.updateQueue;u!==null&&Ju(t,u,o);break;case 3:var d=t.updateQueue;if(d!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Ju(t,d,n)}break;case 5:var b=t.stateNode;if(n===null&&t.flags&4){n=b;var j=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":j.autoFocus&&n.focus();break;case"img":j.src&&(n.src=j.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var B=t.alternate;if(B!==null){var J=B.memoizedState;if(J!==null){var ee=J.dehydrated;ee!==null&&co(ee)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(i(163))}Ot||t.flags&512&&fa(t)}catch(K){mt(t,t.return,K)}}if(t===e){pe=null;break}if(n=t.sibling,n!==null){n.return=t.return,pe=n;break}pe=t.return}}function Jc(e){for(;pe!==null;){var t=pe;if(t===e){pe=null;break}var n=t.sibling;if(n!==null){n.return=t.return,pe=n;break}pe=t.return}}function qc(e){for(;pe!==null;){var t=pe;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ns(4,t)}catch(j){mt(t,n,j)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var s=t.return;try{o.componentDidMount()}catch(j){mt(t,s,j)}}var u=t.return;try{fa(t)}catch(j){mt(t,u,j)}break;case 5:var d=t.return;try{fa(t)}catch(j){mt(t,d,j)}}}catch(j){mt(t,t.return,j)}if(t===e){pe=null;break}var b=t.sibling;if(b!==null){b.return=t.return,pe=b;break}pe=t.return}}var ym=Math.ceil,Ps=A.ReactCurrentDispatcher,_a=A.ReactCurrentOwner,_n=A.ReactCurrentBatchConfig,Ue=0,St=null,yt=null,Lt=0,sn=0,Or=po(0),bt=0,Cl=null,Go=0,Ls=0,ha=0,jl=null,Gt=null,ga=0,Dr=1/0,oo=null,Ts=!1,ya=null,vo=null,Is=!1,bo=null,Rs=0,El=0,xa=null,$s=-1,Ms=0;function Bt(){return(Ue&6)!==0?rt():$s!==-1?$s:$s=rt()}function wo(e){return(e.mode&1)===0?1:(Ue&2)!==0&&Lt!==0?Lt&-Lt:tm.transition!==null?(Ms===0&&(Ms=tl()),Ms):(e=We,e!==0||(e=window.event,e=e===void 0?16:V(e.type)),e)}function jn(e,t,n,o){if(50<El)throw El=0,xa=null,Error(i(185));Oo(e,n,o),((Ue&2)===0||e!==St)&&(e===St&&((Ue&2)===0&&(Ls|=n),bt===4&&ko(e,Lt)),Kt(e,o),n===1&&Ue===0&&(t.mode&1)===0&&(Dr=rt()+500,us&&ho()))}function Kt(e,t){var n=e.callbackNode;Vl(e,t);var o=In(e,e===St?Lt:0);if(o===0)n!==null&&cn(n),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(n!=null&&cn(n),t===1)e.tag===0?em(td.bind(null,e)):Bu(td.bind(null,e)),Kf(function(){(Ue&6)===0&&ho()}),n=null;else{switch(Ge(o)){case 1:n=qr;break;case 4:n=dr;break;case 16:n=$o;break;case 536870912:n=el;break;default:n=$o}n=ud(n,ed.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function ed(e,t){if($s=-1,Ms=0,(Ue&6)!==0)throw Error(i(327));var n=e.callbackNode;if(Fr()&&e.callbackNode!==n)return null;var o=In(e,e===St?Lt:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=zs(e,o);else{t=o;var s=Ue;Ue|=2;var u=od();(St!==e||Lt!==t)&&(oo=null,Dr=rt()+500,Zo(e,t));do try{bm();break}catch(b){nd(e,b)}while(!0);Oi(),Ps.current=u,Ue=s,yt!==null?t=0:(St=null,Lt=0,t=bt)}if(t!==0){if(t===2&&(s=ao(e),s!==0&&(o=s,t=va(e,s))),t===1)throw n=Cl,Zo(e,0),ko(e,o),Kt(e,rt()),n;if(t===6)ko(e,o);else{if(s=e.current.alternate,(o&30)===0&&!xm(s)&&(t=zs(e,o),t===2&&(u=ao(e),u!==0&&(o=u,t=va(e,u))),t===1))throw n=Cl,Zo(e,0),ko(e,o),Kt(e,rt()),n;switch(e.finishedWork=s,e.finishedLanes=o,t){case 0:case 1:throw Error(i(345));case 2:Jo(e,Gt,oo);break;case 3:if(ko(e,o),(o&130023424)===o&&(t=ga+500-rt(),10<t)){if(In(e,0)!==0)break;if(s=e.suspendedLanes,(s&o)!==o){Bt(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=ji(Jo.bind(null,e,Gt,oo),t);break}Jo(e,Gt,oo);break;case 4:if(ko(e,o),(o&4194240)===o)break;for(t=e.eventTimes,s=-1;0<o;){var d=31-en(o);u=1<<d,d=t[d],d>s&&(s=d),o&=~u}if(o=s,o=rt()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*ym(o/1960))-o,10<o){e.timeoutHandle=ji(Jo.bind(null,e,Gt,oo),o);break}Jo(e,Gt,oo);break;case 5:Jo(e,Gt,oo);break;default:throw Error(i(329))}}}return Kt(e,rt()),e.callbackNode===n?ed.bind(null,e):null}function va(e,t){var n=jl;return e.current.memoizedState.isDehydrated&&(Zo(e,t).flags|=256),e=zs(e,t),e!==2&&(t=Gt,Gt=n,t!==null&&ba(t)),e}function ba(e){Gt===null?Gt=e:Gt.push.apply(Gt,e)}function xm(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var o=0;o<n.length;o++){var s=n[o],u=s.getSnapshot;s=s.value;try{if(!bn(u(),s))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function ko(e,t){for(t&=~ha,t&=~Ls,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-en(t),o=1<<n;e[n]=-1,t&=~o}}function td(e){if((Ue&6)!==0)throw Error(i(327));Fr();var t=In(e,0);if((t&1)===0)return Kt(e,rt()),null;var n=zs(e,t);if(e.tag!==0&&n===2){var o=ao(e);o!==0&&(t=o,n=va(e,o))}if(n===1)throw n=Cl,Zo(e,0),ko(e,t),Kt(e,rt()),n;if(n===6)throw Error(i(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Jo(e,Gt,oo),Kt(e,rt()),null}function wa(e,t){var n=Ue;Ue|=1;try{return e(t)}finally{Ue=n,Ue===0&&(Dr=rt()+500,us&&ho())}}function Ko(e){bo!==null&&bo.tag===0&&(Ue&6)===0&&Fr();var t=Ue;Ue|=1;var n=_n.transition,o=We;try{if(_n.transition=null,We=1,e)return e()}finally{We=o,_n.transition=n,Ue=t,(Ue&6)===0&&ho()}}function ka(){sn=Or.current,ot(Or)}function Zo(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Gf(n)),yt!==null)for(n=yt.return;n!==null;){var o=n;switch(Ii(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&is();break;case 3:$r(),ot(Xt),ot($t),Ui();break;case 5:Yi(o);break;case 4:$r();break;case 13:ot(ct);break;case 19:ot(ct);break;case 10:Di(o.type._context);break;case 22:case 23:ka()}n=n.return}if(St=e,yt=e=So(e.current,null),Lt=sn=t,bt=0,Cl=null,ha=Ls=Go=0,Gt=jl=null,Xo!==null){for(t=0;t<Xo.length;t++)if(n=Xo[t],o=n.interleaved,o!==null){n.interleaved=null;var s=o.next,u=n.pending;if(u!==null){var d=u.next;u.next=s,o.next=d}n.pending=o}Xo=null}return e}function nd(e,t){do{var n=yt;try{if(Oi(),xs.current=ks,vs){for(var o=dt.memoizedState;o!==null;){var s=o.queue;s!==null&&(s.pending=null),o=o.next}vs=!1}if(Qo=0,kt=vt=dt=null,xl=!1,vl=0,_a.current=null,n===null||n.return===null){bt=1,Cl=t,yt=null;break}e:{var u=e,d=n.return,b=n,j=t;if(t=Lt,b.flags|=32768,j!==null&&typeof j=="object"&&typeof j.then=="function"){var B=j,J=b,ee=J.tag;if((J.mode&1)===0&&(ee===0||ee===11||ee===15)){var K=J.alternate;K?(J.updateQueue=K.updateQueue,J.memoizedState=K.memoizedState,J.lanes=K.lanes):(J.updateQueue=null,J.memoizedState=null)}var me=Ec(d);if(me!==null){me.flags&=-257,Nc(me,d,b,u,t),me.mode&1&&jc(u,B,t),t=me,j=B;var ye=t.updateQueue;if(ye===null){var xe=new Set;xe.add(j),t.updateQueue=xe}else ye.add(j);break e}else{if((t&1)===0){jc(u,B,t),Sa();break e}j=Error(i(426))}}else if(it&&b.mode&1){var _t=Ec(d);if(_t!==null){(_t.flags&65536)===0&&(_t.flags|=256),Nc(_t,d,b,u,t),Mi(Mr(j,b));break e}}u=j=Mr(j,b),bt!==4&&(bt=2),jl===null?jl=[u]:jl.push(u),u=d;do{switch(u.tag){case 3:u.flags|=65536,t&=-t,u.lanes|=t;var M=Sc(u,j,t);Zu(u,M);break e;case 1:b=j;var E=u.type,O=u.stateNode;if((u.flags&128)===0&&(typeof E.getDerivedStateFromError=="function"||O!==null&&typeof O.componentDidCatch=="function"&&(vo===null||!vo.has(O)))){u.flags|=65536,t&=-t,u.lanes|=t;var oe=Cc(u,b,t);Zu(u,oe);break e}}u=u.return}while(u!==null)}ld(n)}catch(ve){t=ve,yt===n&&n!==null&&(yt=n=n.return);continue}break}while(!0)}function od(){var e=Ps.current;return Ps.current=ks,e===null?ks:e}function Sa(){(bt===0||bt===3||bt===2)&&(bt=4),St===null||(Go&268435455)===0&&(Ls&268435455)===0||ko(St,Lt)}function zs(e,t){var n=Ue;Ue|=2;var o=od();(St!==e||Lt!==t)&&(oo=null,Zo(e,t));do try{vm();break}catch(s){nd(e,s)}while(!0);if(Oi(),Ue=n,Ps.current=o,yt!==null)throw Error(i(261));return St=null,Lt=0,bt}function vm(){for(;yt!==null;)rd(yt)}function bm(){for(;yt!==null&&!Ul();)rd(yt)}function rd(e){var t=ad(e.alternate,e,sn);e.memoizedProps=e.pendingProps,t===null?ld(e):yt=t,_a.current=null}function ld(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=mm(n,t,sn),n!==null){yt=n;return}}else{if(n=pm(n,t),n!==null){n.flags&=32767,yt=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{bt=6,yt=null;return}}if(t=t.sibling,t!==null){yt=t;return}yt=t=e}while(t!==null);bt===0&&(bt=5)}function Jo(e,t,n){var o=We,s=_n.transition;try{_n.transition=null,We=1,wm(e,t,n,o)}finally{_n.transition=s,We=o}return null}function wm(e,t,n,o){do Fr();while(bo!==null);if((Ue&6)!==0)throw Error(i(327));n=e.finishedWork;var s=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(i(177));e.callbackNode=null,e.callbackPriority=0;var u=n.lanes|n.childLanes;if(Ql(e,u),e===St&&(yt=St=null,Lt=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||Is||(Is=!0,ud($o,function(){return Fr(),null})),u=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||u){u=_n.transition,_n.transition=null;var d=We;We=1;var b=Ue;Ue|=4,_a.current=null,hm(e,n),Gc(n,e),Wf(Si),Ao=!!ki,Si=ki=null,e.current=n,gm(n),so(),Ue=b,We=d,_n.transition=u}else e.current=n;if(Is&&(Is=!1,bo=e,Rs=s),u=e.pendingLanes,u===0&&(vo=null),fr(n.stateNode),Kt(e,rt()),t!==null)for(o=e.onRecoverableError,n=0;n<t.length;n++)s=t[n],o(s.value,{componentStack:s.stack,digest:s.digest});if(Ts)throw Ts=!1,e=ya,ya=null,e;return(Rs&1)!==0&&e.tag!==0&&Fr(),u=e.pendingLanes,(u&1)!==0?e===xa?El++:(El=0,xa=e):El=0,ho(),null}function Fr(){if(bo!==null){var e=Ge(Rs),t=_n.transition,n=We;try{if(_n.transition=null,We=16>e?16:e,bo===null)var o=!1;else{if(e=bo,bo=null,Rs=0,(Ue&6)!==0)throw Error(i(331));var s=Ue;for(Ue|=4,pe=e.current;pe!==null;){var u=pe,d=u.child;if((pe.flags&16)!==0){var b=u.deletions;if(b!==null){for(var j=0;j<b.length;j++){var B=b[j];for(pe=B;pe!==null;){var J=pe;switch(J.tag){case 0:case 11:case 15:Sl(8,J,u)}var ee=J.child;if(ee!==null)ee.return=J,pe=ee;else for(;pe!==null;){J=pe;var K=J.sibling,me=J.return;if(Hc(J),J===B){pe=null;break}if(K!==null){K.return=me,pe=K;break}pe=me}}}var ye=u.alternate;if(ye!==null){var xe=ye.child;if(xe!==null){ye.child=null;do{var _t=xe.sibling;xe.sibling=null,xe=_t}while(xe!==null)}}pe=u}}if((u.subtreeFlags&2064)!==0&&d!==null)d.return=u,pe=d;else e:for(;pe!==null;){if(u=pe,(u.flags&2048)!==0)switch(u.tag){case 0:case 11:case 15:Sl(9,u,u.return)}var M=u.sibling;if(M!==null){M.return=u.return,pe=M;break e}pe=u.return}}var E=e.current;for(pe=E;pe!==null;){d=pe;var O=d.child;if((d.subtreeFlags&2064)!==0&&O!==null)O.return=d,pe=O;else e:for(d=E;pe!==null;){if(b=pe,(b.flags&2048)!==0)try{switch(b.tag){case 0:case 11:case 15:Ns(9,b)}}catch(ve){mt(b,b.return,ve)}if(b===d){pe=null;break e}var oe=b.sibling;if(oe!==null){oe.return=b.return,pe=oe;break e}pe=b.return}}if(Ue=s,ho(),It&&typeof It.onPostCommitFiberRoot=="function")try{It.onPostCommitFiberRoot(Xn,e)}catch{}o=!0}return o}finally{We=n,_n.transition=t}}return!1}function sd(e,t,n){t=Mr(n,t),t=Sc(e,t,1),e=yo(e,t,1),t=Bt(),e!==null&&(Oo(e,1,t),Kt(e,t))}function mt(e,t,n){if(e.tag===3)sd(e,e,n);else for(;t!==null;){if(t.tag===3){sd(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(vo===null||!vo.has(o))){e=Mr(n,e),e=Cc(t,e,1),t=yo(t,e,1),e=Bt(),t!==null&&(Oo(t,1,e),Kt(t,e));break}}t=t.return}}function km(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),t=Bt(),e.pingedLanes|=e.suspendedLanes&n,St===e&&(Lt&n)===n&&(bt===4||bt===3&&(Lt&130023424)===Lt&&500>rt()-ga?Zo(e,0):ha|=n),Kt(e,t)}function id(e,t){t===0&&((e.mode&1)===0?t=1:(t=Dt,Dt<<=1,(Dt&130023424)===0&&(Dt=4194304)));var n=Bt();e=eo(e,t),e!==null&&(Oo(e,t,n),Kt(e,n))}function Sm(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),id(e,n)}function Cm(e,t){var n=0;switch(e.tag){case 13:var o=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(i(314))}o!==null&&o.delete(t),id(e,n)}var ad;ad=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Xt.current)Qt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return Qt=!1,fm(e,t,n);Qt=(e.flags&131072)!==0}else Qt=!1,it&&(t.flags&1048576)!==0&&Au(t,ds,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;js(e,t),e=t.pendingProps;var s=Er(t,$t.current);Rr(t,n),s=Qi(null,t,o,e,s,n);var u=Gi();return t.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Vt(o)?(u=!0,as(t)):u=!1,t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,Ai(t),s.updater=Ss,t.stateNode=s,s._reactInternals=t,ta(t,o,e,n),t=la(null,t,o,!0,u,n)):(t.tag=0,it&&u&&Ti(t),Ft(null,t,s,n),t=t.child),t;case 16:o=t.elementType;e:{switch(js(e,t),e=t.pendingProps,s=o._init,o=s(o._payload),t.type=o,s=t.tag=Em(o),e=kn(o,e),s){case 0:t=ra(null,t,o,e,n);break e;case 1:t=$c(null,t,o,e,n);break e;case 11:t=Pc(null,t,o,e,n);break e;case 14:t=Lc(null,t,o,kn(o.type,e),n);break e}throw Error(i(306,o,""))}return t;case 0:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),ra(e,t,o,s,n);case 1:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),$c(e,t,o,s,n);case 3:e:{if(Mc(t),e===null)throw Error(i(387));o=t.pendingProps,u=t.memoizedState,s=u.element,Ku(e,t),gs(t,o,null,n);var d=t.memoizedState;if(o=d.element,u.isDehydrated)if(u={element:o,isDehydrated:!1,cache:d.cache,pendingSuspenseBoundaries:d.pendingSuspenseBoundaries,transitions:d.transitions},t.updateQueue.baseState=u,t.memoizedState=u,t.flags&256){s=Mr(Error(i(423)),t),t=zc(e,t,o,n,s);break e}else if(o!==s){s=Mr(Error(i(424)),t),t=zc(e,t,o,n,s);break e}else for(ln=mo(t.stateNode.containerInfo.firstChild),rn=t,it=!0,wn=null,n=Qu(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Lr(),o===s){t=no(e,t,n);break e}Ft(e,t,o,n)}t=t.child}return t;case 5:return qu(t),e===null&&$i(t),o=t.type,s=t.pendingProps,u=e!==null?e.memoizedProps:null,d=s.children,Ci(o,s)?d=null:u!==null&&Ci(o,u)&&(t.flags|=32),Rc(e,t),Ft(e,t,d,n),t.child;case 6:return e===null&&$i(t),null;case 13:return Oc(e,t,n);case 4:return Wi(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Tr(t,null,o,n):Ft(e,t,o,n),t.child;case 11:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),Pc(e,t,o,s,n);case 7:return Ft(e,t,t.pendingProps,n),t.child;case 8:return Ft(e,t,t.pendingProps.children,n),t.child;case 12:return Ft(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(o=t.type._context,s=t.pendingProps,u=t.memoizedProps,d=s.value,qe(ps,o._currentValue),o._currentValue=d,u!==null)if(bn(u.value,d)){if(u.children===s.children&&!Xt.current){t=no(e,t,n);break e}}else for(u=t.child,u!==null&&(u.return=t);u!==null;){var b=u.dependencies;if(b!==null){d=u.child;for(var j=b.firstContext;j!==null;){if(j.context===o){if(u.tag===1){j=to(-1,n&-n),j.tag=2;var B=u.updateQueue;if(B!==null){B=B.shared;var J=B.pending;J===null?j.next=j:(j.next=J.next,J.next=j),B.pending=j}}u.lanes|=n,j=u.alternate,j!==null&&(j.lanes|=n),Fi(u.return,n,t),b.lanes|=n;break}j=j.next}}else if(u.tag===10)d=u.type===t.type?null:u.child;else if(u.tag===18){if(d=u.return,d===null)throw Error(i(341));d.lanes|=n,b=d.alternate,b!==null&&(b.lanes|=n),Fi(d,n,t),d=u.sibling}else d=u.child;if(d!==null)d.return=u;else for(d=u;d!==null;){if(d===t){d=null;break}if(u=d.sibling,u!==null){u.return=d.return,d=u;break}d=d.return}u=d}Ft(e,t,s.children,n),t=t.child}return t;case 9:return s=t.type,o=t.pendingProps.children,Rr(t,n),s=mn(s),o=o(s),t.flags|=1,Ft(e,t,o,n),t.child;case 14:return o=t.type,s=kn(o,t.pendingProps),s=kn(o.type,s),Lc(e,t,o,s,n);case 15:return Tc(e,t,t.type,t.pendingProps,n);case 17:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),js(e,t),t.tag=1,Vt(o)?(e=!0,as(t)):e=!1,Rr(t,n),wc(t,o,s),ta(t,o,s,n),la(null,t,o,!0,e,n);case 19:return Fc(e,t,n);case 22:return Ic(e,t,n)}throw Error(i(156,t.tag))};function ud(e,t){return cr(e,t)}function jm(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function hn(e,t,n,o){return new jm(e,t,n,o)}function Ca(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Em(e){if(typeof e=="function")return Ca(e)?1:0;if(e!=null){if(e=e.$$typeof,e===fe)return 11;if(e===ne)return 14}return 2}function So(e,t){var n=e.alternate;return n===null?(n=hn(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Os(e,t,n,o,s,u){var d=2;if(o=e,typeof e=="function")Ca(e)&&(d=1);else if(typeof e=="string")d=5;else e:switch(e){case ue:return qo(n.children,s,u,t);case te:d=8,s|=8;break;case ae:return e=hn(12,n,t,s|2),e.elementType=ae,e.lanes=u,e;case L:return e=hn(13,n,t,s),e.elementType=L,e.lanes=u,e;case z:return e=hn(19,n,t,s),e.elementType=z,e.lanes=u,e;case ce:return Ds(n,s,u,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Te:d=10;break e;case le:d=9;break e;case fe:d=11;break e;case ne:d=14;break e;case se:d=16,o=null;break e}throw Error(i(130,e==null?e:typeof e,""))}return t=hn(d,n,t,s),t.elementType=e,t.type=o,t.lanes=u,t}function qo(e,t,n,o){return e=hn(7,e,o,t),e.lanes=n,e}function Ds(e,t,n,o){return e=hn(22,e,o,t),e.elementType=ce,e.lanes=n,e.stateNode={isHidden:!1},e}function ja(e,t,n){return e=hn(6,e,null,t),e.lanes=n,e}function Ea(e,t,n){return t=hn(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Nm(e,t,n,o,s){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=zo(0),this.expirationTimes=zo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=zo(0),this.identifierPrefix=o,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function Na(e,t,n,o,s,u,d,b,j){return e=new Nm(e,t,n,b,j),t===1?(t=1,u===!0&&(t|=8)):t=0,u=hn(3,null,null,t),e.current=u,u.stateNode=e,u.memoizedState={element:o,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ai(u),e}function Pm(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Q,key:o==null?null:""+o,children:e,containerInfo:t,implementation:n}}function cd(e){if(!e)return _o;e=e._reactInternals;e:{if(pt(e)!==e||e.tag!==1)throw Error(i(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Vt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(i(171))}if(e.tag===1){var n=e.type;if(Vt(n))return Du(e,n,t)}return t}function dd(e,t,n,o,s,u,d,b,j){return e=Na(n,o,!0,e,s,u,d,b,j),e.context=cd(null),n=e.current,o=Bt(),s=wo(n),u=to(o,s),u.callback=t??null,yo(n,u,s),e.current.lanes=s,Oo(e,s,o),Kt(e,o),e}function Fs(e,t,n,o){var s=t.current,u=Bt(),d=wo(s);return n=cd(n),t.context===null?t.context=n:t.pendingContext=n,t=to(u,d),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=yo(s,t,d),e!==null&&(jn(e,s,d,u),hs(e,s,d)),d}function Bs(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function fd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Pa(e,t){fd(e,t),(e=e.alternate)&&fd(e,t)}function Lm(){return null}var md=typeof reportError=="function"?reportError:function(e){console.error(e)};function La(e){this._internalRoot=e}As.prototype.render=La.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));Fs(e,t,null,null)},As.prototype.unmount=La.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ko(function(){Fs(null,e,null,null)}),t[Kn]=null}};function As(e){this._internalRoot=e}As.prototype.unstable_scheduleHydration=function(e){if(e){var t=ol();e={blockedOn:null,target:e,priority:t};for(var n=0;n<tn.length&&t!==0&&t<tn[n].priority;n++);tn.splice(n,0,e),n===0&&hr(e)}};function Ta(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ws(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function pd(){}function Tm(e,t,n,o,s){if(s){if(typeof o=="function"){var u=o;o=function(){var B=Bs(d);u.call(B)}}var d=dd(t,o,e,0,null,!1,!1,"",pd);return e._reactRootContainer=d,e[Kn]=d.current,dl(e.nodeType===8?e.parentNode:e),Ko(),d}for(;s=e.lastChild;)e.removeChild(s);if(typeof o=="function"){var b=o;o=function(){var B=Bs(j);b.call(B)}}var j=Na(e,0,!1,null,null,!1,!1,"",pd);return e._reactRootContainer=j,e[Kn]=j.current,dl(e.nodeType===8?e.parentNode:e),Ko(function(){Fs(t,j,n,o)}),j}function Ys(e,t,n,o,s){var u=n._reactRootContainer;if(u){var d=u;if(typeof s=="function"){var b=s;s=function(){var j=Bs(d);b.call(j)}}Fs(t,d,e,s)}else d=Tm(n,t,e,s,o);return Bs(d)}nl=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=vn(t.pendingLanes);n!==0&&(pr(t,n|1),Kt(t,rt()),(Ue&6)===0&&(Dr=rt()+500,ho()))}break;case 13:Ko(function(){var o=eo(e,1);if(o!==null){var s=Bt();jn(o,e,1,s)}}),Pa(e,1)}},_r=function(e){if(e.tag===13){var t=eo(e,134217728);if(t!==null){var n=Bt();jn(t,e,134217728,n)}Pa(e,134217728)}},Gl=function(e){if(e.tag===13){var t=wo(e),n=eo(e,t);if(n!==null){var o=Bt();jn(n,e,t,o)}Pa(e,t)}},ol=function(){return We},Do=function(e,t){var n=We;try{return We=e,t()}finally{We=n}},Gr=function(e,t,n){switch(t){case"input":if(nr(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var s=ss(o);if(!s)throw Error(i(90));Ur(o),nr(o,s)}}}break;case"textarea":Pn(e,n);break;case"select":t=n.value,t!=null&&Tt(e,!!n.multiple,t,!1)}},Un=wa,qt=Ko;var Im={usingClientEntryPoint:!1,Events:[pl,Cr,ss,Hn,ut,wa]},Nl={findFiberByHostInstance:Wo,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Rm={bundleType:Nl.bundleType,version:Nl.version,rendererPackageName:Nl.rendererPackageName,rendererConfig:Nl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:A.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Tn(e),e===null?null:e.stateNode},findFiberByHostInstance:Nl.findFiberByHostInstance||Lm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Hs=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Hs.isDisabled&&Hs.supportsFiber)try{Xn=Hs.inject(Rm),It=Hs}catch{}}return Zt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Im,Zt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ta(t))throw Error(i(200));return Pm(e,t,null,n)},Zt.createRoot=function(e,t){if(!Ta(e))throw Error(i(299));var n=!1,o="",s=md;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=Na(e,1,!1,null,null,n,!1,o,s),e[Kn]=t.current,dl(e.nodeType===8?e.parentNode:e),new La(t)},Zt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(i(188)):(e=Object.keys(e).join(","),Error(i(268,e)));return e=Tn(t),e=e===null?null:e.stateNode,e},Zt.flushSync=function(e){return Ko(e)},Zt.hydrate=function(e,t,n){if(!Ws(t))throw Error(i(200));return Ys(null,e,t,!0,n)},Zt.hydrateRoot=function(e,t,n){if(!Ta(e))throw Error(i(405));var o=n!=null&&n.hydratedSources||null,s=!1,u="",d=md;if(n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(u=n.identifierPrefix),n.onRecoverableError!==void 0&&(d=n.onRecoverableError)),t=dd(t,null,e,1,n??null,s,!1,u,d),e[Kn]=t.current,dl(e),o)for(e=0;e<o.length;e++)n=o[e],s=n._getVersion,s=s(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,s]:t.mutableSourceEagerHydrationData.push(n,s);return new As(t)},Zt.render=function(e,t,n){if(!Ws(t))throw Error(i(200));return Ys(null,e,t,!1,n)},Zt.unmountComponentAtNode=function(e){if(!Ws(e))throw Error(i(40));return e._reactRootContainer?(Ko(function(){Ys(null,null,e,!1,function(){e._reactRootContainer=null,e[Kn]=null})}),!0):!1},Zt.unstable_batchedUpdates=wa,Zt.unstable_renderSubtreeIntoContainer=function(e,t,n,o){if(!Ws(n))throw Error(i(200));if(e==null||e._reactInternals===void 0)throw Error(i(38));return Ys(e,t,n,!1,o)},Zt.version="18.3.1-next-f1338f8080-20240426",Zt}var wd;function Jd(){if(wd)return $a.exports;wd=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(a){console.error(a)}}return r(),$a.exports=Bm(),$a.exports}var kd;function Am(){if(kd)return Us;kd=1;var r=Jd();return Us.createRoot=r.createRoot,Us.hydrateRoot=r.hydrateRoot,Us}var Wm=Am();const Ym={},Sd=r=>{let a;const i=new Set,f=(R,x)=>{const p=typeof R=="function"?R(a):R;if(!Object.is(p,a)){const v=a;a=x??(typeof p!="object"||p===null)?p:Object.assign({},a,p),i.forEach(F=>F(a,v))}},_=()=>a,C={setState:f,getState:_,getInitialState:()=>H,subscribe:R=>(i.add(R),()=>i.delete(R)),destroy:()=>{(Ym?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),i.clear()}},H=a=r(f,_,C);return C},Hm=r=>r?Sd(r):Sd;var Oa={exports:{}},Da={},Fa={exports:{}},Ba={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cd;function Um(){if(Cd)return Ba;Cd=1;var r=Dl();function a(x,p){return x===p&&(x!==0||1/x===1/p)||x!==x&&p!==p}var i=typeof Object.is=="function"?Object.is:a,f=r.useState,_=r.useEffect,m=r.useLayoutEffect,c=r.useDebugValue;function w(x,p){var v=p(),F=f({inst:{value:v,getSnapshot:p}}),I=F[0].inst,N=F[1];return m(function(){I.value=v,I.getSnapshot=p,C(I)&&N({inst:I})},[x,v,p]),_(function(){return C(I)&&N({inst:I}),x(function(){C(I)&&N({inst:I})})},[x]),c(v),v}function C(x){var p=x.getSnapshot;x=x.value;try{var v=p();return!i(x,v)}catch{return!0}}function H(x,p){return p()}var R=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?H:w;return Ba.useSyncExternalStore=r.useSyncExternalStore!==void 0?r.useSyncExternalStore:R,Ba}var jd;function Xm(){return jd||(jd=1,Fa.exports=Um()),Fa.exports}/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ed;function Vm(){if(Ed)return Da;Ed=1;var r=Dl(),a=Xm();function i(H,R){return H===R&&(H!==0||1/H===1/R)||H!==H&&R!==R}var f=typeof Object.is=="function"?Object.is:i,_=a.useSyncExternalStore,m=r.useRef,c=r.useEffect,w=r.useMemo,C=r.useDebugValue;return Da.useSyncExternalStoreWithSelector=function(H,R,x,p,v){var F=m(null);if(F.current===null){var I={hasValue:!1,value:null};F.current=I}else I=F.current;F=w(function(){function D(Q){if(!Y){if(Y=!0,T=Q,Q=p(Q),v!==void 0&&I.hasValue){var ue=I.value;if(v(ue,Q))return A=ue}return A=Q}if(ue=A,f(T,Q))return ue;var te=p(Q);return v!==void 0&&v(ue,te)?(T=Q,ue):(T=Q,A=te)}var Y=!1,T,A,g=x===void 0?null:x;return[function(){return D(R())},g===null?void 0:function(){return D(g())}]},[R,x,p,v]);var N=_(H,F[0],F[1]);return c(function(){I.hasValue=!0,I.value=N},[N]),C(N),N},Da}var Nd;function Qm(){return Nd||(Nd=1,Oa.exports=Vm()),Oa.exports}var Gm=Qm();const Km=Kd(Gm),qd={},{useDebugValue:Zm}=Zd,{useSyncExternalStoreWithSelector:Jm}=Km;let Pd=!1;const qm=r=>r;function ep(r,a=qm,i){(qd?"production":void 0)!=="production"&&i&&!Pd&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),Pd=!0);const f=Jm(r.subscribe,r.getState,r.getServerState||r.getInitialState,a,i);return Zm(f),f}const Ld=r=>{(qd?"production":void 0)!=="production"&&typeof r!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const a=typeof r=="function"?Hm(r):r,i=(f,_)=>ep(a,f,_);return Object.assign(i,a),i},tp=r=>r?Ld(r):Ld,ni={iphone:{w:400,h:868},ipad:{w:500,h:716},mac:{w:640,h:400},watch:{w:205,h:251},android:{w:400,h:711}},oi={iphone:{deviceScale:92,deviceTop:15,deviceAngle:8},ipad:{deviceScale:92,deviceTop:15,deviceAngle:8},mac:{deviceScale:85,deviceTop:20,deviceAngle:0},watch:{deviceScale:80,deviceTop:22,deviceAngle:0},android:{deviceScale:92,deviceTop:15,deviceAngle:8}};function Xs(r,a,i){var m;const f=a.screens[r],_=oi[i]??oi.iphone;return{screenIndex:r,headline:f?f.headline:"New Screen",subtitle:f?f.subtitle??"":"",style:"minimal",layout:"center",font:a.theme.font,fontWeight:a.theme.fontWeight,headlineSize:a.theme.headlineSize??0,subtitleSize:a.theme.subtitleSize??0,headlineRotation:0,subtitleRotation:0,colors:{primary:a.theme.colors.primary,secondary:a.theme.colors.secondary,background:a.theme.colors.background,text:a.theme.colors.text,subtitle:a.theme.colors.subtitle??"#64748B"},frameId:a.frames.ios??a.frames.android??"",deviceColor:a.frames.deviceColor??"",frameStyle:a.frames.style==="3d"?"flat":a.frames.style,composition:"single",deviceScale:_.deviceScale,deviceTop:_.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:_.deviceAngle,deviceTilt:0,headlineGradient:null,subtitleGradient:null,autoSizeHeadline:!0,autoSizeSubtitle:!1,headlineLineHeight:0,headlineLetterSpacing:0,headlineTextTransform:"",headlineFontStyle:"",subtitleOpacity:0,subtitleLetterSpacing:0,subtitleTextTransform:"",spotlight:null,annotations:[],textPositions:{headline:null,subtitle:null},screenshotDataUrl:null,screenshotName:((m=f==null?void 0:f.screenshot)==null?void 0:m.split("/").pop())??null,screenshotDims:null,backgroundType:"solid",backgroundColor:"#ffffff",backgroundGradient:{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"},backgroundImageDataUrl:null,backgroundOverlay:null,deviceShadow:null,borderSimulation:null,cornerRadius:0,loupe:null,callouts:[],overlays:[],extraScreenshots:[]}}const np=50;let Yr=[],ti=[],zl=!1;function At(r){return JSON.parse(JSON.stringify(r))}function jo(r){zl||(Yr.push({screens:At(r.screens),panoramicElements:At(r.panoramicElements),panoramicBackground:At(r.panoramicBackground),selectedScreen:r.selectedScreen,selectedElementIndex:r.selectedElementIndex}),ti=[],Yr.length>np&&Yr.shift())}const q=tp((r,a)=>({config:null,platform:"iphone",previewW:400,previewH:868,selectedScreen:0,activeTab:"design",locale:"default",previewBg:"dark",renderVersion:0,isPanoramic:!1,panoramicFrameCount:5,panoramicBackground:{type:"solid",color:"#000000"},panoramicElements:[],selectedElementIndex:null,fonts:[],frames:[],deviceFamilies:[],koubouAvailable:!1,sizes:{},exportSize:"",exportRenderer:"playwright",screens:[],setConfig:i=>r({config:i}),setPlatform:i=>r({platform:i}),setPreviewSize:(i,f)=>r({previewW:i,previewH:f}),setSelectedScreen:i=>r({selectedScreen:i}),setActiveTab:i=>r({activeTab:i}),setLocale:i=>r({locale:i}),setPreviewBg:i=>r({previewBg:i}),setExportSize:i=>r({exportSize:i}),setExportRenderer:i=>r({exportRenderer:i}),setFonts:i=>r({fonts:i}),setFrames:i=>r({frames:i}),setDeviceFamilies:i=>r({deviceFamilies:i}),setKoubouAvailable:i=>r({koubouAvailable:i}),setSizes:i=>r({sizes:i}),updateScreen:(i,f)=>r(_=>{const m=[..._.screens],c=m[i];return c?(jo(_),m[i]={...c,...f},{screens:m}):_}),triggerRender:()=>r(i=>({renderVersion:i.renderVersion+1})),initScreens:(i,f)=>{const _=i.mode==="panoramic",m=i.screens.length>0?i.screens.map((w,C)=>Xs(C,i,f)):[],c=i.panoramic?{panoramicFrameCount:i.frameCount??5,panoramicBackground:i.panoramic.background,panoramicElements:i.panoramic.elements}:{};r({config:i,isPanoramic:_,screens:m,selectedScreen:0,selectedElementIndex:null,...c})},addScreen:()=>r(i=>{const{screens:f,config:_,platform:m}=i;if(!_)return i;jo(i);const c=f[f.length-1],w=Xs(0,_,m);return w.screenIndex=f.length,w.headline=`Screen ${f.length+1}`,w.subtitle="",c&&(w.style=c.style,w.layout=c.layout,w.font=c.font,w.fontWeight=c.fontWeight,w.colors={...c.colors},w.frameId=c.frameId,w.deviceColor=c.deviceColor,w.frameStyle=c.frameStyle,w.composition=c.composition,w.deviceScale=c.deviceScale,w.deviceTop=c.deviceTop),{screens:[...f,w],selectedScreen:f.length}}),removeScreen:i=>r(f=>{if(f.screens.length<=1)return f;jo(f);const _=f.screens.filter((c,w)=>w!==i).map((c,w)=>({...c,screenIndex:w}));let m=f.selectedScreen;return m>=_.length?m=_.length-1:m>i&&m--,{screens:_,selectedScreen:m}}),moveScreen:(i,f)=>r(_=>{if(f<0||f>=_.screens.length)return _;jo(_);const m=[..._.screens],[c]=m.splice(i,1);return c?(m.splice(f,0,c),{screens:m.map((w,C)=>({...w,screenIndex:C})),selectedScreen:f}):_}),togglePanoramic:()=>r(i=>{var _;if(i.isPanoramic){if(i.screens.length===0&&i.config){const m=i.platform;return i.config.screens.length>0?{isPanoramic:!1,screens:i.config.screens.map((w,C)=>Xs(C,i.config,m)),selectedScreen:0}:{isPanoramic:!1,screens:[Xs(0,i.config,m)],selectedScreen:0}}return{isPanoramic:!1}}const f={isPanoramic:!0,selectedElementIndex:null};if(i.panoramicElements.length===0&&i.config&&i.screens.length>0){const m=i.config.theme.colors,c=i.screens.length;f.panoramicFrameCount=c,f.panoramicBackground={type:"gradient",gradient:{type:"linear",colors:[m.primary,m.secondary??m.background],direction:135,radialPosition:"center"}};const w=[];for(let C=0;C<c;C++){const H=i.screens[C],R=C/c*100,x=R+100/c/2;w.push({type:"device",screenshot:((_=i.config.screens[C])==null?void 0:_.screenshot)??`screenshots/screen-${C+1}.png`,frame:H.frameId||void 0,x:x-6,y:20,width:12,rotation:H.deviceRotation||0,z:5}),H.headline&&w.push({type:"text",content:H.headline,x:R+2,y:3,fontSize:3,color:m.text??"#FFFFFF",fontWeight:i.config.theme.fontWeight??700,fontStyle:"normal",textAlign:"left",lineHeight:1.15,maxWidth:Math.floor(100/c)-4,z:10})}f.panoramicElements=w}else if(i.panoramicElements.length===0&&i.config&&i.panoramicBackground.type==="solid"&&(!i.panoramicBackground.color||i.panoramicBackground.color==="#000000")){const m=i.config.theme.colors;f.panoramicBackground={type:"gradient",gradient:{type:"linear",colors:[m.primary,m.secondary??m.background],direction:135,radialPosition:"center"}}}return f}),setSelectedElement:i=>r({selectedElementIndex:i}),updatePanoramicBackground:i=>r(f=>(jo(f),{panoramicBackground:{...f.panoramicBackground,...i}})),updatePanoramicElement:(i,f)=>r(_=>{const m=[..._.panoramicElements],c=m[i];return c?(jo(_),m[i]={...c,...f},{panoramicElements:m}):_}),addPanoramicElement:i=>r(f=>(jo(f),{panoramicElements:[...f.panoramicElements,i],selectedElementIndex:f.panoramicElements.length})),removePanoramicElement:i=>r(f=>{jo(f);const _=f.panoramicElements.filter((c,w)=>w!==i);let m=f.selectedElementIndex;return m!==null&&(m===i?m=null:m>i&&m--),{panoramicElements:_,selectedElementIndex:m}}),setPanoramicFrameCount:i=>r({panoramicFrameCount:i}),undo:()=>{if(Yr.length===0)return;const i=a();ti.push({screens:At(i.screens),panoramicElements:At(i.panoramicElements),panoramicBackground:At(i.panoramicBackground),selectedScreen:i.selectedScreen,selectedElementIndex:i.selectedElementIndex});const f=Yr.pop();zl=!0,r({screens:At(f.screens),panoramicElements:At(f.panoramicElements),panoramicBackground:At(f.panoramicBackground),selectedScreen:f.selectedScreen,selectedElementIndex:f.selectedElementIndex}),zl=!1},redo:()=>{if(ti.length===0)return;const i=a();Yr.push({screens:At(i.screens),panoramicElements:At(i.panoramicElements),panoramicBackground:At(i.panoramicBackground),selectedScreen:i.selectedScreen,selectedElementIndex:i.selectedElementIndex});const f=ti.pop();zl=!0,r({screens:At(f.screens),panoramicElements:At(f.panoramicElements),panoramicBackground:At(f.panoramicBackground),selectedScreen:f.selectedScreen,selectedElementIndex:f.selectedElementIndex}),zl=!1}})),ro="";async function ef(){const r=await fetch(`${ro}/api/config`);if(!r.ok)throw new Error(`Failed to fetch config: ${r.statusText}`);return r.json()}async function op(){return await fetch(`${ro}/api/reload`,{method:"POST"}),ef()}async function rp(r,a){const i=await fetch(`${ro}/api/preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:a});if(!i.ok)throw new Error(`Preview render failed: ${i.statusText}`);return i.text()}async function lp(){const r=await fetch(`${ro}/api/frames`);if(!r.ok)throw new Error(`Failed to fetch frames: ${r.statusText}`);return r.json()}async function sp(){const r=await fetch(`${ro}/api/fonts`);if(!r.ok)throw new Error(`Failed to fetch fonts: ${r.statusText}`);return r.json()}async function ip(){const r=await fetch(`${ro}/api/koubou-devices`);if(!r.ok)throw new Error(`Failed to fetch koubou devices: ${r.statusText}`);return r.json()}async function ap(){const r=await fetch(`${ro}/api/sizes`);if(!r.ok)throw new Error(`Failed to fetch sizes: ${r.statusText}`);return r.json()}async function up(r,a){const i=await fetch(`${ro}/api/panoramic-preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:a});if(!i.ok)throw new Error(`Panoramic preview failed: ${i.statusText}`);return i.text()}async function Td(r){const a=await fetch(`${ro}/api/export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!a.ok)throw new Error(`Export failed: ${a.statusText}`);return a.blob()}const cp=[{id:"design",label:"Background"},{id:"device",label:"Device"},{id:"text",label:"Text"},{id:"effects",label:"Effects"},{id:"export",label:"Export"}];function dp(){const r=q(i=>i.activeTab),a=q(i=>i.setActiveTab);return l.jsx("div",{className:"flex border-b border-border",children:cp.map(i=>l.jsx("button",{onClick:()=>a(i.id),className:`flex-1 py-2 text-xs font-medium transition-colors ${r===i.id?"text-accent border-b-2 border-accent":"text-text-dim hover:text-text"}`,children:i.label},i.id))})}function si(){const r=q(_=>_.selectedScreen),a=q(_=>_.screens[_.selectedScreen]),i=q(_=>_.updateScreen),f=S.useCallback(_=>{i(r,_)},[r,i]);return{screen:a,selectedScreen:r,update:f}}const Ja=new Map;function Id(r,a){a?Ja.set(r,a):Ja.delete(r)}function fp(r){return Ja.get(r)??null}function nu(){const r=q(c=>c.selectedScreen),a=q(c=>c.previewW),i=S.useCallback(()=>{try{const c=fp(r);return(c==null?void 0:c.contentDocument)??null}catch{return null}},[r]),f=S.useCallback(c=>{const w=i();if(!w)return;const C=w.querySelector(".device-wrapper");if(C){if(c.deviceScale!==void 0){const H=w.querySelector(".canvas");if(H){const R=H.getBoundingClientRect().width;if(C.dataset.origDw||(C.dataset.origDw=String(parseFloat(C.style.width)||C.getBoundingClientRect().width)),!C.dataset.origPerspective){const I=getComputedStyle(C).getPropertyValue("--device-perspective");C.dataset.origPerspective=String(parseFloat(I)||1500)}const x=parseFloat(C.dataset.origDw),p=Math.round(R*c.deviceScale/100),v=p/x;C.style.width=p+"px";const F=parseFloat(C.dataset.origPerspective);C.style.setProperty("--device-perspective",Math.round(F*v)+"px"),C.querySelectorAll(".screenshot-clip").forEach(I=>{const N=I;N.dataset.origLeft||(N.dataset.origLeft=N.style.left,N.dataset.origTop=N.style.top,N.dataset.origWidth=N.style.width,N.dataset.origHeight=N.style.height,N.dataset.origBr=N.style.borderRadius||""),N.style.left=Math.round(parseFloat(N.dataset.origLeft)*v)+"px",N.style.top=Math.round(parseFloat(N.dataset.origTop)*v)+"px",N.style.width=Math.round(parseFloat(N.dataset.origWidth)*v)+"px",N.style.height=Math.round(parseFloat(N.dataset.origHeight)*v)+"px",N.dataset.origBr&&(N.style.borderRadius=Math.round(parseFloat(N.dataset.origBr)*v)+"px")})}}if(c.deviceTop!==void 0){C.style.top=c.deviceTop+"%";for(const H of[".glow-1",".glow-2",".orb-1",".orb-2",".bg-glow",".shape-1",".shape-3",".bg-shape-1"]){const R=w.querySelector(H);R&&(R.style.top=c.deviceTop+"%")}}c.deviceOffsetX!==void 0&&(C.style.left=c.deviceOffsetX?`calc(50% + ${c.deviceOffsetX/100*a}px)`:"50%"),c.deviceRotation!==void 0&&C.style.setProperty("--device-rotation",`${c.deviceRotation}deg`),c.deviceAngle!==void 0&&C.style.setProperty("--device-angle",`${c.deviceAngle}deg`),c.deviceTilt!==void 0&&C.style.setProperty("--device-tilt",`${c.deviceTilt}deg`)}},[i,a]),_=S.useCallback(c=>{const w=i();if(!w)return;const C=w.querySelector(".canvas");if(C){if(c.type==="solid"&&c.color)C.style.background=c.color;else if(c.type==="gradient"&&c.colors){const H=c.colors.join(", ");c.gradientType==="radial"?C.style.background=`radial-gradient(circle at ${c.radialPosition??"center"}, ${H})`:C.style.background=`linear-gradient(${c.direction??135}deg, ${H})`}}},[i]),m=S.useCallback(c=>{const w=i();if(!w)return;const C=a/1290;if(c.headlineSize!==void 0||c.headlineRotation!==void 0){const H=w.querySelector(".headline");if(H&&(c.headlineSize!==void 0&&(H.style.fontSize=`${Math.round(c.headlineSize*C)}px`),c.headlineRotation!==void 0)){const R=["translateX(-50%)"];c.headlineRotation&&R.push(`rotate(${c.headlineRotation}deg)`),H.style.transform=R.join(" ")}}if(c.subtitleSize!==void 0||c.subtitleRotation!==void 0){const H=w.querySelector(".subtitle");if(H&&(c.subtitleSize!==void 0&&(H.style.fontSize=`${Math.round(c.subtitleSize*C)}px`),c.subtitleRotation!==void 0)){const R=["translateX(-50%)"];c.subtitleRotation&&R.push(`rotate(${c.subtitleRotation}deg)`),H.style.transform=R.join(" ")}}},[i,a]);return{patchDevice:f,patchBackground:_,patchText:m}}function Fe({title:r,children:a,hidden:i,tooltip:f}){return i?null:l.jsxs("div",{className:"px-5 py-4 border-b border-border",children:[l.jsxs("div",{className:"text-[11px] uppercase tracking-wide text-text-dim mb-3 flex items-center gap-1.5",children:[r,f&&l.jsxs("span",{className:"relative group",children:[l.jsx("span",{className:"inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-border text-[9px] text-text-dim cursor-help leading-none",children:"?"}),l.jsx("span",{className:"absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-48 px-2.5 py-1.5 text-[10px] normal-case tracking-normal text-text bg-surface-2 border border-border rounded-md shadow-lg z-50 pointer-events-none",children:f})]})]}),a]})}function et({label:r,value:a,onChange:i,onInstant:f,presets:_,onPresetClick:m}){return l.jsxs("div",{className:"mb-2.5",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("label",{className:"text-xs text-text-dim flex-1",children:r}),l.jsx("input",{type:"color",value:a,className:"w-8 h-8 border border-border rounded-md cursor-pointer bg-transparent p-0.5",onInput:c=>{f==null||f(c.target.value)},onChange:c=>{i(c.target.value)}})]}),_&&_.length>0&&l.jsx("div",{className:"flex flex-wrap gap-1 mt-1.5",children:_.map(c=>l.jsx("button",{className:"w-6 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:c},title:c,"aria-label":`Select color ${c}`,onClick:()=>{m==null||m(c),i(c)}},c))})]})}function ie({label:r,value:a,min:i,max:f,step:_=1,formatValue:m,onChange:c,onInstant:w,disabled:C}){const H=m?m(a):String(a),[R,x]=S.useState(!1),[p,v]=S.useState(""),F=S.useRef(null);S.useEffect(()=>{var N;R&&((N=F.current)==null||N.select())},[R]);function I(){x(!1);const N=parseFloat(p);if(Number.isNaN(N))return;const D=Math.min(f,Math.max(i,N)),Y=Math.round(D/_)*_;c(Y)}return l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:r}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("input",{type:"range",min:i,max:f,step:_,value:a,disabled:C,className:"w-full accent-accent",onInput:N=>{const D=Number(N.target.value);w==null||w(D)},onChange:N=>{c(Number(N.target.value))}}),R?l.jsx("input",{ref:F,type:"text",inputMode:"decimal",value:p,onChange:N=>v(N.target.value),onBlur:I,onKeyDown:N=>{N.key==="Enter"&&I(),N.key==="Escape"&&x(!1)},className:"text-xs text-text bg-surface border border-border rounded px-1 py-0 min-w-[40px] w-[48px] text-right shrink-0 outline-none focus:border-accent"}):l.jsx("span",{className:"text-xs text-text-dim min-w-[40px] text-right shrink-0 cursor-text hover:text-text transition-colors",tabIndex:C?void 0:0,role:"button","aria-label":`Edit ${r} value`,onClick:()=>{C||(v(String(a)),x(!0))},onKeyDown:N=>{C||(N.key==="Enter"||N.key===" ")&&(N.preventDefault(),v(String(a)),x(!0))},children:H})]})]})}const Wt=S.memo(function({label:a,checked:i,onChange:f}){return l.jsx("div",{className:"mb-2.5",children:l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"checkbox",checked:i,onChange:_=>f(_.target.checked),className:"accent-accent"}),a]})})}),at=S.memo(function({label:a,value:i,onChange:f,options:_,groups:m,hidden:c}){return c?null:l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:a}),l.jsxs("select",{value:i,onChange:w=>f(w.target.value),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent",children:[_==null?void 0:_.map(w=>l.jsx("option",{value:w.value,disabled:w.disabled,children:w.label},w.value)),m==null?void 0:m.map(w=>l.jsx("optgroup",{label:w.label,children:w.options.map(C=>l.jsx("option",{value:C.value,disabled:C.disabled,children:C.label},C.value))},w.label))]})]})}),tf=["#000000","#1a1a2e","#16213e","#0f3460","#533483","#e94560","#f5f5f5","#fafafa","#2d3436","#636e72","#00b894","#00cec9","#6c5ce7","#fdcb6e","#e17055","#dfe6e9","#b2bec3","#2c3e50","#8e44ad","#2980b9"],ou=[{name:"Sunset",colors:["#ff6b35","#f7c948","#ff3864"],direction:135},{name:"Ocean",colors:["#0052d4","#4364f7","#6fb1fc"],direction:135},{name:"Midnight",colors:["#0f0c29","#302b63","#24243e"],direction:135},{name:"Sky",colors:["#2980b9","#6dd5fa","#ffffff"],direction:180},{name:"Horizon",colors:["#003973","#e5e5be","#f7a600"],direction:180},{name:"Vapor",colors:["#fc5c7d","#ce9ffc","#6a82fb"],direction:135},{name:"Tropical",colors:["#f7971e","#ffd200","#21d4fd"],direction:135},{name:"Dusk Sky",colors:["#2c3e50","#4ca1af","#c4e0e5"],direction:180},{name:"Flamingo",colors:["#ee5a24","#f0932b","#fad390"],direction:135},{name:"Arctic",colors:["#1e3c72","#2a5298","#e8f5e9"],direction:180},{name:"Velvet",colors:["#6a0572","#ab83a1","#f5e6cc"],direction:135},{name:"Lush",colors:["#004e92","#00b4db","#88d8b0"],direction:135},{name:"Aurora",colors:["#00c9ff","#92fe9d"],direction:135},{name:"Coral",colors:["#ff9a9e","#fecfef"],direction:135},{name:"Lavender",colors:["#a18cd1","#fbc2eb"],direction:135},{name:"Emerald",colors:["#11998e","#38ef7d"],direction:135},{name:"Fire",colors:["#f83600","#f9d423"],direction:135},{name:"Berry",colors:["#8e2de2","#4a00e0"],direction:135},{name:"Peach",colors:["#ffecd2","#fcb69f"],direction:135},{name:"Dusk",colors:["#2c3e50","#fd746c"],direction:135},{name:"Mint",colors:["#00b09b","#96c93d"],direction:135},{name:"Rose",colors:["#ee9ca7","#ffdde1"],direction:135},{name:"Indigo",colors:["#667eea","#764ba2"],direction:135},{name:"Candy",colors:["#fc5c7d","#6a82fb"],direction:135},{name:"Forest",colors:["#134e5e","#71b280"],direction:135},{name:"Neon",colors:["#00f260","#0575e6"],direction:135},{name:"Warm",colors:["#f093fb","#f5576c"],direction:135}],nf={"Natural Titanium":"#9a8e7e","Black Titanium":"#3c3c3c","White Titanium":"#e8e5e0","Desert Titanium":"#c4a882","Blue Titanium":"#394e5f",Black:"#1c1c1e",White:"#f5f5f7",Pink:"#f9cdd3",Teal:"#5eb5b5",Ultramarine:"#4a50c7",Blue:"#5b8fb9",Green:"#3f6e4e",Yellow:"#f2d44e",Red:"#c43d40",Purple:"#7c5dab",Midnight:"#2c2c3a",Starlight:"#f0e8d8","Product Red":"#c43d40","Space Black":"#2a2a2c","Space Gray":"#636366",Silver:"#d6d6d6",Gold:"#e3caa5","Deep Purple":"#5e4580",Graphite:"#4f4f4f","Pacific Blue":"#1e5c82","Sierra Blue":"#9fb8cf","Alpine Green":"#3c5e48","Rose Gold":"#e6c0aa"},mp=[{value:"minimal",label:"Minimal"},{value:"bold",label:"Bold"},{value:"glow",label:"Glow"},{value:"playful",label:"Playful"},{value:"clean",label:"Clean"},{value:"branded",label:"Branded"},{value:"editorial",label:"Editorial"}],pp=[{value:"solid",label:"Solid"},{value:"gradient",label:"Gradient"},{value:"image",label:"Image"},{value:"preset",label:"Preset"}],_p=[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}];function of(){const{screen:r,update:a}=si(),i=S.useRef(null),{patchBackground:f}=nu(),_=S.useCallback(p=>f({type:"solid",color:p}),[f]),m=S.useCallback(p=>{if(!r)return;const v=r.backgroundGradient;f({type:"gradient",gradientType:v.type,colors:(p==null?void 0:p.colors)??v.colors,direction:(p==null?void 0:p.direction)??v.direction,radialPosition:v.radialPosition})},[r,f]),[c,w]=S.useState(!1);if(!r)return null;const C=r.backgroundType,H=c||C==="preset"?"preset":C,R=p=>{var I;const v=(I=p.target.files)==null?void 0:I[0];if(!v)return;const F=new FileReader;F.onload=N=>{var D;a({backgroundImageDataUrl:(D=N.target)==null?void 0:D.result})},F.readAsDataURL(v),p.target.value=""},x=()=>{const p=[...r.backgroundGradient.colors];p.length>=5||(p.push("#ffffff"),a({backgroundGradient:{...r.backgroundGradient,colors:p}}))};return l.jsxs(l.Fragment,{children:[l.jsxs(Fe,{title:"Background",tooltip:"Choose between solid colors, gradients, images, or template presets for your screenshot background.",children:[l.jsx("div",{className:"flex gap-3 mb-2.5",children:pp.map(p=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"bg-type",value:p.value,checked:H===p.value,onChange:()=>{p.value==="preset"?w(!0):(w(!1),a({backgroundType:p.value}))},className:"accent-accent"}),p.label]},p.value))}),H==="preset"&&l.jsx(at,{label:"Style Preset",value:C==="preset"?r.style:"",onChange:p=>{a({backgroundType:"preset",style:p})},options:[{value:"",label:"Select a preset..."},...mp]}),H==="solid"&&l.jsx(et,{label:"Color",value:r.backgroundColor,onChange:p=>a({backgroundColor:p}),onInstant:_,presets:tf}),H==="gradient"&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:ou.map(p=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform",style:{background:`linear-gradient(${p.direction}deg, ${p.colors.join(", ")})`},title:p.name,onClick:()=>a({backgroundGradient:{type:"linear",colors:[...p.colors],direction:p.direction,radialPosition:"center"}})},p.name))}),l.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(p=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:r.backgroundGradient.type===p,onChange:()=>a({backgroundGradient:{...r.backgroundGradient,type:p}}),className:"accent-accent"}),p.charAt(0).toUpperCase()+p.slice(1)]},p))}),l.jsx(ie,{label:"Direction",value:r.backgroundGradient.direction,min:0,max:360,formatValue:p=>`${p}°`,onChange:p=>a({backgroundGradient:{...r.backgroundGradient,direction:p}}),onInstant:p=>m({direction:p})}),r.backgroundGradient.type==="radial"&&l.jsx(at,{label:"Center",value:r.backgroundGradient.radialPosition,onChange:p=>a({backgroundGradient:{...r.backgroundGradient,radialPosition:p}}),options:_p}),r.backgroundGradient.colors.map((p,v)=>l.jsx(et,{label:`Stop ${v+1}`,value:p,onChange:F=>{const I=[...r.backgroundGradient.colors];I[v]=F,a({backgroundGradient:{...r.backgroundGradient,colors:I}})}},v)),r.backgroundGradient.colors.length<5&&l.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:x,children:"+ Add Color Stop"})]}),H==="image"&&l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var p;return(p=i.current)==null?void 0:p.click()},children:"Upload Background Image"}),l.jsx("input",{ref:i,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden",onChange:R}),r.backgroundImageDataUrl&&l.jsxs("div",{className:"mt-1.5",children:[l.jsx("img",{src:r.backgroundImageDataUrl,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>a({backgroundImageDataUrl:null}),children:"Remove"})]}),l.jsxs("div",{className:"mt-2",children:[l.jsx(Wt,{label:"Dim Overlay",checked:!!r.backgroundOverlay,onChange:p=>a({backgroundOverlay:p?{color:"#000000",opacity:.3}:null})}),r.backgroundOverlay&&l.jsxs(l.Fragment,{children:[l.jsx(et,{label:"Color",value:r.backgroundOverlay.color,onChange:p=>a({backgroundOverlay:{...r.backgroundOverlay,color:p}})}),l.jsx(ie,{label:"Opacity",value:Math.round(r.backgroundOverlay.opacity*100),min:0,max:100,formatValue:p=>`${p}%`,onChange:p=>a({backgroundOverlay:{...r.backgroundOverlay,opacity:p/100}})})]})]})]})]}),l.jsxs(Fe,{title:"Preset Colors",hidden:C!=="preset",children:[l.jsx(et,{label:"Primary",value:r.colors.primary,onChange:p=>a({colors:{...r.colors,primary:p}})}),l.jsx(et,{label:"Secondary",value:r.colors.secondary,onChange:p=>a({colors:{...r.colors,secondary:p}})}),l.jsx(et,{label:"Background",value:r.colors.background,onChange:p=>a({colors:{...r.colors,background:p}})})]})]})}function Rd(r,a,i){const _=[{name:"nw",x:i.x,y:i.y},{name:"ne",x:i.x+i.w,y:i.y},{name:"sw",x:i.x,y:i.y+i.h},{name:"se",x:i.x+i.w,y:i.y+i.h}];for(const m of _)if(Math.abs(r-m.x)<12&&Math.abs(a-m.y)<12)return m.name;return r>i.x&&r<i.x+i.w&&a>i.y&&a<i.y+i.h?"move":"new"}const hp={nw:"nw-resize",ne:"ne-resize",sw:"sw-resize",se:"se-resize",move:"move",new:"crosshair"};function gp({imageDataUrl:r,onApply:a,onCancel:i}){const f=S.useRef(null),_=S.useRef(null),m=S.useRef(null),c=S.useRef({x:0,y:0,w:0,h:0}),w=S.useRef(1),C=S.useRef({mode:null,startX:0,startY:0,startCrop:{x:0,y:0,w:0,h:0}}),H=S.useCallback(()=>{const p=_.current,v=m.current;if(!p||!v)return;const F=p.getContext("2d");if(!F)return;const I=p.width,N=p.height,D=c.current;F.clearRect(0,0,I,N),F.drawImage(v,0,0,I,N),F.fillStyle="rgba(0,0,0,0.5)",F.fillRect(0,0,I,D.y),F.fillRect(0,D.y+D.h,I,N-D.y-D.h),F.fillRect(0,D.y,D.x,D.h),F.fillRect(D.x+D.w,D.y,I-D.x-D.w,D.h),F.strokeStyle="#fff",F.lineWidth=2,F.strokeRect(D.x,D.y,D.w,D.h);const Y=8;F.fillStyle="#fff";const T=[[D.x,D.y],[D.x+D.w,D.y],[D.x,D.y+D.h],[D.x+D.w,D.y+D.h]];for(const[A,g]of T)F.fillRect(A-Y/2,g-Y/2,Y,Y);F.strokeStyle="rgba(255,255,255,0.25)",F.lineWidth=1;for(let A=1;A<=2;A++)F.beginPath(),F.moveTo(D.x+D.w*A/3,D.y),F.lineTo(D.x+D.w*A/3,D.y+D.h),F.stroke(),F.beginPath(),F.moveTo(D.x,D.y+D.h*A/3),F.lineTo(D.x+D.w,D.y+D.h*A/3),F.stroke()},[]);S.useEffect(()=>{var v;const p=F=>{if(F.key==="Escape"){i();return}if(F.key==="Tab"&&f.current){const I=f.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');if(I.length===0)return;const N=I[0],D=I[I.length-1];F.shiftKey&&document.activeElement===N?(F.preventDefault(),D.focus()):!F.shiftKey&&document.activeElement===D&&(F.preventDefault(),N.focus())}};return window.addEventListener("keydown",p),(v=f.current)==null||v.focus(),()=>window.removeEventListener("keydown",p)},[i]),S.useEffect(()=>{const p=new Image;p.onload=()=>{m.current=p;const v=p.naturalWidth,F=p.naturalHeight,I=window.innerWidth*.8,N=window.innerHeight*.7,D=Math.min(I/v,N/F,1);w.current=D;const Y=Math.round(v*D),T=Math.round(F*D),A=_.current;A&&(A.width=Y,A.height=T,c.current={x:Math.round(Y*.1),y:Math.round(T*.1),w:Math.round(Y*.8),h:Math.round(T*.8)},H())},p.src=r},[r,H]);const R=S.useCallback(p=>{const v=_.current;if(!v)return;const F=v.getBoundingClientRect(),I=p.clientX-F.left,N=p.clientY-F.top,D=Rd(I,N,c.current),Y=c.current;C.current={mode:D==="new"?"se":D,startX:I,startY:N,startCrop:{...Y}},D==="new"&&(c.current={x:I,y:N,w:0,h:0})},[]);S.useEffect(()=>{const p=F=>{const I=_.current;if(!I)return;const N=I.getBoundingClientRect(),D=I.width,Y=I.height,T=C.current;if(!T.mode){const Te=Rd(F.clientX-N.left,F.clientY-N.top,c.current);I.style.cursor=hp[Te]??"crosshair";return}const A=Math.max(0,Math.min(D,F.clientX-N.left)),g=Math.max(0,Math.min(Y,F.clientY-N.top)),Q=A-T.startX,ue=g-T.startY,te=T.startCrop,ae=c.current;T.mode==="move"?(ae.x=Math.max(0,Math.min(D-te.w,te.x+Q)),ae.y=Math.max(0,Math.min(Y-te.h,te.y+ue))):T.mode==="se"?(ae.w=Math.max(10,A-ae.x),ae.h=Math.max(10,g-ae.y)):T.mode==="nw"?(ae.x=Math.min(te.x+te.w-10,te.x+Q),ae.y=Math.min(te.y+te.h-10,te.y+ue),ae.w=te.w-(ae.x-te.x),ae.h=te.h-(ae.y-te.y)):T.mode==="ne"?(ae.y=Math.min(te.y+te.h-10,te.y+ue),ae.w=Math.max(10,te.w+Q),ae.h=te.h-(ae.y-te.y)):T.mode==="sw"&&(ae.x=Math.min(te.x+te.w-10,te.x+Q),ae.w=te.w-(ae.x-te.x),ae.h=Math.max(10,te.h+ue)),H()},v=()=>{C.current.mode=null};return document.addEventListener("mousemove",p),document.addEventListener("mouseup",v),()=>{document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",v)}},[H]);const x=S.useCallback(()=>{const p=m.current;if(!p)return;const v=c.current,F=w.current,I=Math.round(v.x/F),N=Math.round(v.y/F);let D=Math.round(v.w/F),Y=Math.round(v.h/F);D=Math.min(D,p.naturalWidth-I),Y=Math.min(Y,p.naturalHeight-N);const T=document.createElement("canvas");T.width=D,T.height=Y;const A=T.getContext("2d");A&&(A.drawImage(p,I,N,D,Y,0,0,D,Y),a(T.toDataURL("image/png")))},[a]);return l.jsxs("div",{ref:f,tabIndex:-1,className:"fixed inset-0 z-[9999] flex flex-col items-center justify-center outline-none",style:{background:"rgba(0,0,0,0.8)"},children:[l.jsx("div",{className:"text-white text-base font-semibold mb-3",children:"Crop Screenshot"}),l.jsx("canvas",{ref:_,className:"border border-white/30",style:{cursor:"crosshair"},onMouseDown:R}),l.jsxs("div",{className:"flex gap-2 mt-3",children:[l.jsx("button",{className:"px-6 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent-hover",onClick:x,children:"Apply Crop"}),l.jsx("button",{className:"px-6 py-2 text-sm bg-surface-2 text-text-dim border border-border rounded-md hover:text-text",onClick:i,children:"Cancel"})]})]})}const yp={single:{deviceCount:1,slots:[{offsetX:0,offsetY:15,scale:92,rotation:0,angle:0,tilt:0,zIndex:1}]},"peek-right":{deviceCount:1,slots:[{offsetX:48,offsetY:8,scale:95,rotation:5,angle:-8,tilt:0,zIndex:1}]},"peek-left":{deviceCount:1,slots:[{offsetX:-48,offsetY:8,scale:95,rotation:-5,angle:8,tilt:0,zIndex:1}]},"tilt-left":{deviceCount:1,slots:[{offsetX:-25,offsetY:5,scale:105,rotation:-18,angle:15,tilt:3,zIndex:1}]},"tilt-right":{deviceCount:1,slots:[{offsetX:25,offsetY:5,scale:105,rotation:18,angle:-15,tilt:3,zIndex:1}]},"duo-overlap":{deviceCount:2,slots:[{offsetX:-30,offsetY:18,scale:85,rotation:-12,angle:12,tilt:2,zIndex:1},{offsetX:22,offsetY:8,scale:88,rotation:4,angle:0,tilt:0,zIndex:2}]},"duo-split":{deviceCount:2,slots:[{offsetX:-38,offsetY:12,scale:80,rotation:-5,angle:8,tilt:2,zIndex:1},{offsetX:38,offsetY:12,scale:80,rotation:5,angle:-8,tilt:2,zIndex:1}]},"hero-tilt":{deviceCount:2,slots:[{offsetX:-35,offsetY:20,scale:78,rotation:-15,angle:15,tilt:4,zIndex:1},{offsetX:12,offsetY:8,scale:92,rotation:0,angle:0,tilt:0,zIndex:2}]},"fanned-cards":{deviceCount:3,slots:[{offsetX:-35,offsetY:16,scale:68,rotation:-18,angle:0,tilt:0,zIndex:1},{offsetX:0,offsetY:8,scale:72,rotation:0,angle:0,tilt:0,zIndex:3},{offsetX:35,offsetY:16,scale:68,rotation:18,angle:0,tilt:0,zIndex:2}]}},xp=[{value:"center",label:"Center"},{value:"angled-left",label:"Angled Left"},{value:"angled-right",label:"Angled Right"}],vp=[{value:"flat",label:"Flat"},{value:"none",label:"None (frameless)"}],bp=[{value:"single",label:"Single Device"}],wp=[{label:"Edge Bleed (1 device)",options:[{value:"peek-right",label:"Peek Right"},{value:"peek-left",label:"Peek Left"},{value:"tilt-left",label:"Tilt Left"},{value:"tilt-right",label:"Tilt Right"}]},{label:"Multi-Device",options:[{value:"duo-overlap",label:"Duo Overlap (2)"},{value:"duo-split",label:"Duo Split (2)"},{value:"hero-tilt",label:"Hero + Background (2)"},{value:"fanned-cards",label:"Fanned Cards (3)"}]}],kp=[{value:"iphone",label:"iPhone"},{value:"ipad",label:"iPad"},{value:"mac",label:"Mac"},{value:"watch",label:"Apple Watch"},{value:"android",label:"Android"}],Sp={iphone:"iphone",android:"iphone",ipad:"ipad",mac:"mac",watch:"watch"};function Cp(r,a){if(r==="android")return"generic-phone";const i=Sp[r]??"iphone",f=a.filter(_=>_.category===i).sort((_,m)=>m.year-_.year)[0];return f?f.id:i==="ipad"?"ipad-pro-13":"generic-phone"}const $d=.15;function Md(r,a){const i=r.width/r.height;return Math.abs(a-i)/i<$d||Math.abs(a-1/i)/(1/i)<$d}const jp={iphone:["iphone"],android:["iphone"],ipad:["ipad"],mac:["mac"],watch:["watch"]},Ep={iphone:["default-ios","default-android"],android:["default-ios","default-android"],ipad:["default-ipad","fallback-tablet"],mac:[],watch:[]};function Np(r,a,i,f,_){const m=i?i.width/i.height:null,c=!f&&m!==null,w=jp[_]??["iphone"],C=Ep[_]??[],H={};for(const p of r){const v=p.category||"other";if(!f&&!w.includes(v)||c&&!Md(p.screenResolution,m))continue;const F=H[v]??[];F.push({value:p.id,label:p.name}),H[v]=F}const R=Object.entries(H).map(([p,v])=>({label:p.charAt(0).toUpperCase()+p.slice(1),options:v})),x=[];for(const p of a){if(!f&&C.length>0){if(!(p.tags??[]).some(F=>C.includes(F)))continue}else if(!f&&C.length===0)continue;c&&p.screenResolution&&!Md(p.screenResolution,m)||x.push({value:p.id,label:p.name})}return x.length>0&&R.push({label:"SVG Frames",options:x}),R}function Pp(){const{screen:r,update:a}=si(),i=q(L=>L.platform),f=q(L=>L.setPlatform),_=q(L=>L.setPreviewSize),m=q(L=>L.sizes),c=q(L=>L.setExportSize),w=q(L=>L.triggerRender),C=q(L=>L.updateScreen),H=q(L=>L.screens),R=q(L=>L.deviceFamilies),x=q(L=>L.frames),p=S.useRef(null),[v,F]=S.useState(!1),[I,N]=S.useState(!1),{patchDevice:D}=nu(),Y=S.useCallback((L,z)=>D({[L]:z}),[D]),T=L=>{f(L);const z=ni[L]??ni.iphone;_(z.w,z.h);const ne=m[L]??[];ne.length>0&&c(ne[0].key);const se=Cp(L,R);for(let ce=0;ce<H.length;ce++)C(ce,{frameId:se,deviceColor:""});w()};if(!r)return null;const A=R.find(L=>L.id===r.frameId),g=A&&A.colors.length>1,Q=A&&A.screenRect,ue=r.frameStyle==="none",te=r.layout==="angled-left"||r.layout==="angled-right",ae=S.useMemo(()=>Np(R,x,r.screenshotDims,I,i),[R,x,r.screenshotDims,I,i]),Te=L=>{var se;const z=(se=L.target.files)==null?void 0:se[0];if(!z)return;const ne=new FileReader;ne.onload=ce=>{var re;const $=(re=ce.target)==null?void 0:re.result,Z=new Image;Z.onload=()=>{const P={width:Z.naturalWidth,height:Z.naturalHeight};a({screenshotDataUrl:$,screenshotName:z.name,screenshotDims:P})},Z.src=$},ne.readAsDataURL(z),L.target.value=""},le=L=>{F(!1);const z=new Image;z.onload=()=>{const ne={width:z.naturalWidth,height:z.naturalHeight};a({screenshotDataUrl:L,screenshotDims:ne})},z.src=L},fe=oi[i]??oi.iphone;return l.jsxs(l.Fragment,{children:[v&&r.screenshotDataUrl&&l.jsx(gp,{imageDataUrl:r.screenshotDataUrl,onApply:le,onCancel:()=>F(!1)}),l.jsx(Fe,{title:"Platform",children:l.jsx(at,{label:"",value:i,onChange:T,options:kp})}),l.jsxs(Fe,{title:"Screenshot",children:[r.screenshotDataUrl&&l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:r.screenshotDataUrl,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:r.screenshotName||"Custom upload"})]}),!r.screenshotDataUrl&&r.screenshotName&&l.jsx("div",{className:"text-xs text-text-dim mb-2",children:r.screenshotName}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var L;return(L=p.current)==null?void 0:L.click()},children:"Upload Screenshot"}),l.jsx("input",{ref:p,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden",onChange:Te}),r.screenshotDataUrl&&l.jsxs("div",{className:"flex gap-1 mt-1.5",children:[l.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>F(!0),children:"Crop"}),l.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>a({screenshotDataUrl:null,screenshotName:null,screenshotDims:null}),children:"Revert"})]})]}),l.jsxs(Fe,{title:"Device Frame",children:[l.jsx(at,{label:"Device",value:r.frameId,onChange:L=>{const z=R.find(se=>se.id===L);z&&z.screenRect&&r.frameStyle==="none"?a({frameId:L,frameStyle:"flat"}):a({frameId:L})},groups:ae}),r.screenshotDims&&l.jsx(Wt,{label:"Show all frames",checked:I,onChange:N}),g&&l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),l.jsx("div",{className:"flex flex-wrap gap-1",children:A.colors.map(L=>l.jsx("button",{className:`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform ${r.deviceColor===L.name?"border-accent ring-1 ring-accent":"border-border"}`,style:{background:nf[L.name]??"#888888"},title:L.name,onClick:()=>a({deviceColor:L.name})},L.name))})]}),l.jsx(at,{label:"Frame Style",value:r.frameStyle,onChange:L=>a({frameStyle:L}),options:vp,hidden:!!Q}),ue&&l.jsxs(l.Fragment,{children:[l.jsx(Wt,{label:"Border Simulation",checked:!!r.borderSimulation,onChange:L=>a({borderSimulation:L?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:null})}),r.borderSimulation&&l.jsxs(l.Fragment,{children:[l.jsx(ie,{label:"Thickness",value:r.borderSimulation.thickness,min:1,max:20,formatValue:L=>`${L}px`,onChange:L=>a({borderSimulation:{...r.borderSimulation,thickness:L}})}),l.jsx(et,{label:"Color",value:r.borderSimulation.color,onChange:L=>a({borderSimulation:{...r.borderSimulation,color:L}})}),l.jsx(ie,{label:"Radius",value:r.borderSimulation.radius,min:0,max:60,formatValue:L=>`${L}px`,onChange:L=>a({borderSimulation:{...r.borderSimulation,radius:L}})})]})]})]}),l.jsxs(Fe,{title:"Device Layout",children:[l.jsx(Wt,{label:"Fullscreen Screenshot",checked:r.style==="fullscreen",onChange:L=>a({style:L?"fullscreen":"minimal"})}),r.style!=="fullscreen"&&l.jsxs(l.Fragment,{children:[l.jsx(at,{label:"Layout",value:r.layout,onChange:L=>a({layout:L}),options:xp}),l.jsx(ie,{label:"Device Size",value:r.deviceScale,min:50,max:100,formatValue:L=>`${L}%`,onChange:L=>a({deviceScale:L}),onInstant:L=>Y("deviceScale",L)}),l.jsx(ie,{label:"Device Position",value:r.deviceTop,min:-80,max:80,formatValue:L=>`${L}%`,onChange:L=>a({deviceTop:L}),onInstant:L=>Y("deviceTop",L)}),l.jsx(ie,{label:"Horizontal Position",value:r.deviceOffsetX,min:-80,max:80,formatValue:L=>String(L),onChange:L=>a({deviceOffsetX:L}),onInstant:L=>Y("deviceOffsetX",L)}),l.jsx(ie,{label:"Device Rotation",value:r.deviceRotation,min:-180,max:180,formatValue:L=>`${L}°`,onChange:L=>a({deviceRotation:L}),onInstant:L=>Y("deviceRotation",L)}),te&&l.jsx(ie,{label:"Perspective Angle",value:r.deviceAngle,min:2,max:45,formatValue:L=>`${L}°`,onChange:L=>a({deviceAngle:L}),onInstant:L=>Y("deviceAngle",L)}),l.jsx(ie,{label:"3D Tilt",value:r.deviceTilt,min:0,max:40,formatValue:L=>`${L}°`,onChange:L=>a({deviceTilt:L}),onInstant:L=>Y("deviceTilt",L)}),ue&&l.jsx(ie,{label:"Corner Radius",value:r.cornerRadius,min:0,max:50,formatValue:L=>`${L}%`,onChange:L=>a({cornerRadius:L})}),l.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>a({deviceScale:fe.deviceScale,deviceTop:fe.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:fe.deviceAngle,deviceTilt:0,cornerRadius:0}),children:"Reset Device Position"})]})]}),l.jsxs(Fe,{title:"Device Shadow",children:[l.jsx(Wt,{label:"Custom Shadow",checked:!!r.deviceShadow,onChange:L=>a({deviceShadow:L?{opacity:.25,blur:20,color:"#000000",offsetY:10}:null})}),r.deviceShadow&&l.jsxs(l.Fragment,{children:[l.jsx(ie,{label:"Opacity",value:Math.round(r.deviceShadow.opacity*100),min:0,max:100,formatValue:L=>`${L}%`,onChange:L=>a({deviceShadow:{...r.deviceShadow,opacity:L/100}})}),l.jsx(ie,{label:"Blur",value:r.deviceShadow.blur,min:0,max:50,formatValue:L=>`${L}px`,onChange:L=>a({deviceShadow:{...r.deviceShadow,blur:L}})}),l.jsx(et,{label:"Color",value:r.deviceShadow.color,onChange:L=>a({deviceShadow:{...r.deviceShadow,color:L}})}),l.jsx(ie,{label:"Y Offset",value:r.deviceShadow.offsetY,min:0,max:30,formatValue:L=>`${L}px`,onChange:L=>a({deviceShadow:{...r.deviceShadow,offsetY:L}})})]})]}),l.jsxs(Fe,{title:"Composition",children:[l.jsx(at,{label:"Device Arrangement",value:r.composition,onChange:L=>{const z=L,ne=yp[z];if(ne&&ne.deviceCount===1){const se=ne.slots[0];a({composition:z,deviceOffsetX:se.offsetX,deviceTop:se.offsetY,deviceScale:se.scale,deviceRotation:se.rotation,deviceAngle:se.angle,deviceTilt:se.tilt})}else a({composition:z})},options:bp,groups:wp}),l.jsx("span",{className:"text-[10px] text-text-dim leading-tight block -mt-1.5 mb-2",children:"Edge bleed presets overflow screen edges — pair adjacent screens for cross-screen effects."})]})]})}const zd=[{value:"",label:"Auto"},{value:"none",label:"None"},{value:"uppercase",label:"Uppercase"},{value:"lowercase",label:"Lowercase"},{value:"capitalize",label:"Capitalize"}],Lp=[{value:"",label:"Auto"},{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}];function Tp(){const{screen:r,update:a}=si(),i=q(c=>c.fonts),{patchText:f}=nu(),_=S.useCallback((c,w)=>f({[c]:w}),[f]);if(!r)return null;const m=i.map(c=>({value:c.name,label:c.name}));return l.jsxs(l.Fragment,{children:[l.jsxs(Fe,{title:"Text",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Headline"}),l.jsx("textarea",{rows:2,value:r.headline,onChange:c=>a({headline:c.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Subtitle"}),l.jsx("input",{type:"text",value:r.subtitle,onChange:c=>a({subtitle:c.target.value}),placeholder:"Optional subtitle",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent"})]}),l.jsx(et,{label:"Headline Color",value:r.colors.text,onChange:c=>a({colors:{...r.colors,text:c}})}),l.jsx(et,{label:"Subtitle Color",value:r.colors.subtitle,onChange:c=>a({colors:{...r.colors,subtitle:c}})})]}),l.jsxs(Fe,{title:"Typography",children:[l.jsx(at,{label:"Font",value:r.font,onChange:c=>a({font:c}),options:m}),l.jsx(ie,{label:"Font Weight",value:r.fontWeight,min:400,max:800,step:100,formatValue:c=>String(c),onChange:c=>a({fontWeight:c})}),l.jsx(ie,{label:"Headline Size",value:r.headlineSize,min:0,max:200,formatValue:c=>c===0?"Auto":`${c}px`,onChange:c=>a({headlineSize:c}),onInstant:c=>_("headlineSize",c),disabled:r.autoSizeHeadline}),l.jsx(ie,{label:"Subtitle Size",value:r.subtitleSize,min:0,max:120,formatValue:c=>c===0?"Auto":`${c}px`,onChange:c=>a({subtitleSize:c}),onInstant:c=>_("subtitleSize",c),disabled:r.autoSizeSubtitle}),l.jsx(Wt,{label:"Auto-size Headline",checked:r.autoSizeHeadline,onChange:c=>a({autoSizeHeadline:c})}),l.jsx(Wt,{label:"Auto-size Subtitle",checked:r.autoSizeSubtitle,onChange:c=>a({autoSizeSubtitle:c})}),l.jsx(ie,{label:"Headline Rotation",value:r.headlineRotation,min:-30,max:30,formatValue:c=>`${c}°`,onChange:c=>a({headlineRotation:c}),onInstant:c=>_("headlineRotation",c)}),l.jsx(ie,{label:"Subtitle Rotation",value:r.subtitleRotation,min:-30,max:30,formatValue:c=>`${c}°`,onChange:c=>a({subtitleRotation:c}),onInstant:c=>_("subtitleRotation",c)}),l.jsx(ie,{label:"Headline Line Height",value:r.headlineLineHeight,min:80,max:180,formatValue:c=>c===0?"Auto":(c/100).toFixed(2),onChange:c=>a({headlineLineHeight:c})}),l.jsx(ie,{label:"Headline Letter Spacing",value:r.headlineLetterSpacing,min:-5,max:10,formatValue:c=>c===0?"Auto":`${c/100}em`,onChange:c=>a({headlineLetterSpacing:c})}),l.jsxs("div",{className:"flex gap-2 mb-2",children:[l.jsx("div",{className:"flex-1",children:l.jsx(at,{label:"Headline Case",value:r.headlineTextTransform,onChange:c=>a({headlineTextTransform:c}),options:zd})}),l.jsx("div",{className:"flex-1",children:l.jsx(at,{label:"Headline Style",value:r.headlineFontStyle,onChange:c=>a({headlineFontStyle:c}),options:Lp})})]}),l.jsx(ie,{label:"Subtitle Opacity",value:r.subtitleOpacity,min:0,max:100,formatValue:c=>c===0?"Auto":`${c}%`,onChange:c=>a({subtitleOpacity:c})}),l.jsx(ie,{label:"Subtitle Letter Spacing",value:r.subtitleLetterSpacing,min:-5,max:10,formatValue:c=>c===0?"Auto":`${c/100}em`,onChange:c=>a({subtitleLetterSpacing:c})}),l.jsx(at,{label:"Subtitle Case",value:r.subtitleTextTransform,onChange:c=>a({subtitleTextTransform:c}),options:zd})]}),l.jsxs(Fe,{title:"Text Position",children:[l.jsx("span",{className:"text-[11px] text-text-dim leading-tight block mb-1.5",children:"Drag the headline or subtitle in the preview to reposition them."}),l.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>a({textPositions:{headline:null,subtitle:null}}),children:"Reset to Default"})]}),l.jsxs(Fe,{title:"Text Gradient",children:[l.jsx(Wt,{label:"Enable Headline Gradient",checked:!!r.headlineGradient,onChange:c=>a({headlineGradient:c?{colors:["#6366f1","#ec4899"],direction:90}:null})}),r.headlineGradient&&l.jsxs(l.Fragment,{children:[l.jsx(et,{label:"Start",value:r.headlineGradient.colors[0]??"#6366f1",onChange:c=>a({headlineGradient:{...r.headlineGradient,colors:[c,r.headlineGradient.colors[1]??"#ec4899"]}})}),l.jsx(et,{label:"End",value:r.headlineGradient.colors[1]??"#ec4899",onChange:c=>a({headlineGradient:{...r.headlineGradient,colors:[r.headlineGradient.colors[0]??"#6366f1",c]}})}),l.jsx(ie,{label:"Direction",value:r.headlineGradient.direction,min:0,max:360,formatValue:c=>`${c}°`,onChange:c=>a({headlineGradient:{...r.headlineGradient,direction:c}})})]}),l.jsx("div",{className:"mt-2.5",children:l.jsx(Wt,{label:"Enable Subtitle Gradient",checked:!!r.subtitleGradient,onChange:c=>a({subtitleGradient:c?{colors:["#6366f1","#ec4899"],direction:90}:null})})}),r.subtitleGradient&&l.jsxs(l.Fragment,{children:[l.jsx(et,{label:"Start",value:r.subtitleGradient.colors[0]??"#6366f1",onChange:c=>a({subtitleGradient:{...r.subtitleGradient,colors:[c,r.subtitleGradient.colors[1]??"#ec4899"]}})}),l.jsx(et,{label:"End",value:r.subtitleGradient.colors[1]??"#ec4899",onChange:c=>a({subtitleGradient:{...r.subtitleGradient,colors:[r.subtitleGradient.colors[0]??"#6366f1",c]}})}),l.jsx(ie,{label:"Direction",value:r.subtitleGradient.direction,min:0,max:360,formatValue:c=>`${c}°`,onChange:c=>a({subtitleGradient:{...r.subtitleGradient,direction:c}})})]})]})]})}function Aa({title:r,onRemove:a,children:i}){return l.jsxs("div",{className:"border border-border rounded-md p-2 mb-1.5 text-[11px]",children:[l.jsxs("div",{className:"flex justify-between items-center mb-1.5",children:[l.jsx("span",{className:"font-semibold text-text-dim",children:r}),l.jsx("button",{className:"text-text-dim hover:text-red-400 text-sm leading-none px-1",onClick:a,children:"×"})]}),i]})}let Ip=0;function Wa(r){return`${r}-${++Ip}`}function Rp(){const{screen:r,update:a}=si();if(!r)return null;const i=(x,p)=>{const v=r.annotations.map((F,I)=>I===x?{...F,...p}:F);a({annotations:v})},f=x=>{confirm("Remove this annotation?")&&a({annotations:r.annotations.filter((p,v)=>v!==x)})},_=()=>{a({annotations:[...r.annotations,{id:Wa("ann"),shape:"rounded-rect",x:40,y:40,w:20,h:20,strokeColor:"#FF3B30",strokeWidth:4}]})},m=(x,p)=>{const v=r.callouts.map((F,I)=>I===x?{...F,...p}:F);a({callouts:v})},c=x=>{confirm("Remove this callout?")&&a({callouts:r.callouts.filter((p,v)=>v!==x)})},w=()=>{a({callouts:[...r.callouts,{id:Wa("callout"),sourceX:30,sourceY:40,sourceW:40,sourceH:20,displayX:60,displayY:10,displayScale:1,rotation:0,borderRadius:8,shadow:!0,borderWidth:0,borderColor:"#ffffff"}]})},C=(x,p)=>{const v=r.overlays.map((F,I)=>I===x?{...F,...p}:F);a({overlays:v})},H=x=>{confirm("Remove this overlay?")&&a({overlays:r.overlays.filter((p,v)=>v!==x)})},R=()=>{a({overlays:[...r.overlays,{id:Wa("overlay"),type:"shape",x:10,y:10,size:10,rotation:0,opacity:1,shapeType:"circle",shapeColor:"#6366f1",shapeOpacity:.5,shapeBlur:10}]})};return l.jsxs(l.Fragment,{children:[l.jsxs(Fe,{title:"Spotlight / Dimming",tooltip:"Dim the background and highlight a specific area of your screenshot to draw attention.",children:[l.jsx(Wt,{label:"Enable Spotlight",checked:!!r.spotlight,onChange:x=>a({spotlight:x?{x:50,y:50,w:30,h:30,shape:"rectangle",dimOpacity:.6,blur:0}:null})}),r.spotlight&&l.jsxs(l.Fragment,{children:[l.jsx(at,{label:"Shape",value:r.spotlight.shape,onChange:x=>a({spotlight:{...r.spotlight,shape:x}}),options:[{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(ie,{label:"Position X",value:r.spotlight.x,min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({spotlight:{...r.spotlight,x}})}),l.jsx(ie,{label:"Position Y",value:r.spotlight.y,min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({spotlight:{...r.spotlight,y:x}})}),l.jsx(ie,{label:"Width",value:r.spotlight.w,min:5,max:100,formatValue:x=>`${x}%`,onChange:x=>a({spotlight:{...r.spotlight,w:x}})}),l.jsx(ie,{label:"Height",value:r.spotlight.h,min:5,max:100,formatValue:x=>`${x}%`,onChange:x=>a({spotlight:{...r.spotlight,h:x}})}),l.jsx(ie,{label:"Dim Opacity",value:Math.round(r.spotlight.dimOpacity*100),min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({spotlight:{...r.spotlight,dimOpacity:x/100}})}),l.jsx(ie,{label:"Background Blur",value:r.spotlight.blur,min:0,max:30,formatValue:x=>`${x}px`,onChange:x=>a({spotlight:{...r.spotlight,blur:x}})})]})]}),l.jsxs(Fe,{title:"Annotations",children:[l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:_,children:"+ Add Annotation"}),r.annotations.map((x,p)=>l.jsxs(Aa,{title:`Annotation ${p+1}`,onRemove:()=>f(p),children:[l.jsx(at,{label:"Shape",value:x.shape,onChange:v=>i(p,{shape:v}),options:[{value:"rounded-rect",label:"rounded-rect"},{value:"rectangle",label:"rectangle"},{value:"circle",label:"circle"}]}),l.jsx(et,{label:"Color",value:x.strokeColor,onChange:v=>i(p,{strokeColor:v})}),l.jsx(ie,{label:"X",value:x.x,min:0,max:100,formatValue:v=>`${v}%`,onChange:v=>i(p,{x:v})}),l.jsx(ie,{label:"Y",value:x.y,min:0,max:100,formatValue:v=>`${v}%`,onChange:v=>i(p,{y:v})}),l.jsx(ie,{label:"Width",value:x.w,min:1,max:100,formatValue:v=>`${v}%`,onChange:v=>i(p,{w:v})}),l.jsx(ie,{label:"Height",value:x.h,min:1,max:100,formatValue:v=>`${v}%`,onChange:v=>i(p,{h:v})}),l.jsx(ie,{label:"Stroke",value:x.strokeWidth,min:1,max:20,formatValue:v=>`${v}px`,onChange:v=>i(p,{strokeWidth:v})})]},x.id))]}),l.jsxs(Fe,{title:"Loupe / Magnification",tooltip:"Magnify a region of the screenshot and display it enlarged elsewhere on the frame.",children:[l.jsx(Wt,{label:"Enable Loupe",checked:!!r.loupe,onChange:x=>a({loupe:x?{sourceX:50,sourceY:50,displayX:70,displayY:20,size:20,zoom:2.5,borderWidth:3,borderColor:"#ffffff"}:null})}),r.loupe&&l.jsxs(l.Fragment,{children:[l.jsx(ie,{label:"Source X",value:r.loupe.sourceX,min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({loupe:{...r.loupe,sourceX:x}})}),l.jsx(ie,{label:"Source Y",value:r.loupe.sourceY,min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({loupe:{...r.loupe,sourceY:x}})}),l.jsx(ie,{label:"Display X",value:r.loupe.displayX,min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({loupe:{...r.loupe,displayX:x}})}),l.jsx(ie,{label:"Display Y",value:r.loupe.displayY,min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({loupe:{...r.loupe,displayY:x}})}),l.jsx(ie,{label:"Size",value:r.loupe.size,min:5,max:50,formatValue:x=>`${x}%`,onChange:x=>a({loupe:{...r.loupe,size:x}})}),l.jsx(ie,{label:"Zoom",value:Math.round(r.loupe.zoom*100),min:150,max:500,step:10,formatValue:x=>`${(x/100).toFixed(1)}x`,onChange:x=>a({loupe:{...r.loupe,zoom:x/100}})}),l.jsx(ie,{label:"Border Width",value:r.loupe.borderWidth,min:0,max:10,formatValue:x=>`${x}px`,onChange:x=>a({loupe:{...r.loupe,borderWidth:x}})}),l.jsx(et,{label:"Border Color",value:r.loupe.borderColor,onChange:x=>a({loupe:{...r.loupe,borderColor:x}})})]})]}),l.jsxs(Fe,{title:"Callouts",tooltip:"Crop and enlarge a portion of the screenshot, displayed as a floating callout card.",children:[l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:w,children:"+ Add Callout"}),r.callouts.map((x,p)=>l.jsxs(Aa,{title:`Callout ${p+1}`,onRemove:()=>c(p),children:[l.jsx(ie,{label:"Source X",value:x.sourceX,min:0,max:100,formatValue:v=>`${v}%`,onChange:v=>m(p,{sourceX:v})}),l.jsx(ie,{label:"Source Y",value:x.sourceY,min:0,max:100,formatValue:v=>`${v}%`,onChange:v=>m(p,{sourceY:v})}),l.jsx(ie,{label:"Source W",value:x.sourceW,min:1,max:100,formatValue:v=>`${v}%`,onChange:v=>m(p,{sourceW:v})}),l.jsx(ie,{label:"Source H",value:x.sourceH,min:1,max:100,formatValue:v=>`${v}%`,onChange:v=>m(p,{sourceH:v})}),l.jsx(ie,{label:"Display X",value:x.displayX,min:0,max:100,formatValue:v=>`${v}%`,onChange:v=>m(p,{displayX:v})}),l.jsx(ie,{label:"Display Y",value:x.displayY,min:0,max:100,formatValue:v=>`${v}%`,onChange:v=>m(p,{displayY:v})}),l.jsx(ie,{label:"Scale",value:Math.round(x.displayScale*100),min:50,max:300,step:10,formatValue:v=>`${(v/100).toFixed(1)}x`,onChange:v=>m(p,{displayScale:v/100})}),l.jsx(ie,{label:"Rotation",value:x.rotation,min:-45,max:45,formatValue:v=>`${v}°`,onChange:v=>m(p,{rotation:v})}),l.jsx(ie,{label:"Radius",value:x.borderRadius,min:0,max:30,formatValue:v=>`${v}px`,onChange:v=>m(p,{borderRadius:v})})]},x.id))]}),l.jsxs(Fe,{title:"Overlays",tooltip:"Add decorative shapes, stars, icons, or badges floating over the screenshot.",children:[l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:R,children:"+ Add Overlay"}),r.overlays.map((x,p)=>l.jsxs(Aa,{title:`Overlay ${p+1}`,onRemove:()=>H(p),children:[l.jsx(at,{label:"Type",value:x.type,onChange:v=>C(p,{type:v}),options:[{value:"shape",label:"shape"},{value:"star-rating",label:"star-rating"},{value:"icon",label:"icon"},{value:"badge",label:"badge"},{value:"custom",label:"custom"}]}),l.jsx(ie,{label:"X",value:x.x,min:0,max:100,formatValue:v=>`${v}%`,onChange:v=>C(p,{x:v})}),l.jsx(ie,{label:"Y",value:x.y,min:0,max:100,formatValue:v=>`${v}%`,onChange:v=>C(p,{y:v})}),l.jsx(ie,{label:"Size",value:x.size,min:1,max:50,formatValue:v=>`${v}%`,onChange:v=>C(p,{size:v})}),l.jsx(ie,{label:"Rotation",value:x.rotation,min:-180,max:180,formatValue:v=>`${v}°`,onChange:v=>C(p,{rotation:v})}),l.jsx(ie,{label:"Opacity",value:Math.round(x.opacity*100),min:0,max:100,formatValue:v=>`${v}%`,onChange:v=>C(p,{opacity:v/100})}),x.type==="shape"&&l.jsxs(l.Fragment,{children:[l.jsx(at,{label:"Shape",value:x.shapeType??"circle",onChange:v=>C(p,{shapeType:v}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"}]}),l.jsx(et,{label:"Color",value:x.shapeColor??"#6366f1",onChange:v=>C(p,{shapeColor:v})}),l.jsx(ie,{label:"Shape Opacity",value:Math.round((x.shapeOpacity??.5)*100),min:0,max:100,formatValue:v=>`${v}%`,onChange:v=>C(p,{shapeOpacity:v/100})}),l.jsx(ie,{label:"Blur",value:x.shapeBlur??0,min:0,max:50,formatValue:v=>`${v}px`,onChange:v=>C(p,{shapeBlur:v})})]})]},x.id))]})]})}function $p({message:r,onDone:a}){return S.useEffect(()=>{const i=setTimeout(a,3e3);return()=>clearTimeout(i)},[a]),l.jsx("div",{className:"fixed top-4 right-4 z-50 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-in fade-in",children:r})}function rf(){const r=q(z=>z.platform),a=q(z=>z.sizes),i=q(z=>z.exportSize),f=q(z=>z.setExportSize),_=q(z=>z.exportRenderer),m=q(z=>z.setExportRenderer),c=q(z=>z.koubouAvailable),w=q(z=>z.locale),C=q(z=>z.setLocale),H=q(z=>z.previewBg),R=q(z=>z.setPreviewBg),x=q(z=>z.config),p=q(z=>z.initScreens),v=q(z=>z.triggerRender),F=q(z=>z.selectedScreen),I=q(z=>z.screens),[N,D]=S.useState(!1),[Y,T]=S.useState("Ready"),[A,g]=S.useState(null),Q=S.useCallback(()=>g(null),[]),te=(a[r]??[]).map(z=>({value:z.key,label:`${z.name} (${z.width}×${z.height})`})),ae=[{value:"playwright",label:"Playwright (fast)"},{value:"koubou",label:"Koubou (pixel-perfect)",disabled:!c||r==="android"}],Te=[{value:"default",label:"Default"}];if(x!=null&&x.locales)for(const z of Object.keys(x.locales))Te.push({value:z,label:z});const le=async()=>{const z=I[F];if(z){D(!0),T(_==="koubou"?`Rendering screen ${F+1} with Koubou...`:`Exporting screen ${F+1}...`);try{const ne=await Td({screenIndex:z.screenIndex,sizeKey:i,renderer:_,headline:z.headline,subtitle:z.subtitle||void 0,style:z.style,layout:z.layout,colors:z.colors,font:z.font,fontWeight:z.fontWeight,frameId:z.frameId,frameStyle:z.frameStyle,deviceColor:z.deviceColor||void 0,deviceScale:z.deviceScale,deviceTop:z.deviceTop,screenshotDataUrl:z.screenshotDataUrl||void 0}),se=URL.createObjectURL(ne),ce=document.createElement("a");ce.href=se,ce.download=`screenshot-${F+1}.png`,document.body.appendChild(ce),ce.click(),document.body.removeChild(ce),URL.revokeObjectURL(se);const $=Math.round(ne.size/1024);T(`Exported (${$}KB)`),g(`Screen ${F+1} exported (${$}KB)`)}catch(ne){T(`Export error: ${ne instanceof Error?ne.message:"Unknown error"}`)}finally{D(!1)}}},fe=async()=>{if(I.length===0)return;D(!0);let z=0;for(let ne=0;ne<I.length;ne++){const se=I[ne];if(se){T(`Exporting screen ${ne+1} of ${I.length}...`);try{const ce=await Td({screenIndex:se.screenIndex,sizeKey:i,renderer:_,headline:se.headline,subtitle:se.subtitle||void 0,style:se.style,layout:se.layout,colors:se.colors,font:se.font,fontWeight:se.fontWeight,frameId:se.frameId,frameStyle:se.frameStyle,deviceColor:se.deviceColor||void 0,deviceScale:se.deviceScale,deviceTop:se.deviceTop,screenshotDataUrl:se.screenshotDataUrl||void 0}),$=URL.createObjectURL(ce),Z=document.createElement("a");Z.href=$,Z.download=`screenshot-${ne+1}.png`,document.body.appendChild(Z),Z.click(),document.body.removeChild(Z),URL.revokeObjectURL($),z++}catch(ce){T(`Error on screen ${ne+1}: ${ce instanceof Error?ce.message:"Unknown"}`)}}}D(!1),T(`Exported ${z} of ${I.length} screens`),g(`Exported ${z} screenshots`)},L=async()=>{try{const z=await op();p(z,r),v(),T("Config reloaded")}catch(z){T(`Reload error: ${z instanceof Error?z.message:"Unknown error"}`)}};return I.length===0?l.jsx(Fe,{title:"Export",children:l.jsx("p",{className:"text-xs text-text-dim text-center py-4",children:"No screens to export. Add a screen first in the Design tab."})}):l.jsxs(l.Fragment,{children:[A&&l.jsx($p,{message:A,onDone:Q}),l.jsxs(Fe,{title:"Export",children:[l.jsx(at,{label:"Output Size",value:i,onChange:f,options:te}),c&&l.jsx(at,{label:"Renderer",value:_,onChange:m,options:ae}),l.jsx("button",{className:"w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1",onClick:le,disabled:N,children:N?"Exporting...":"Download Screenshot"}),I.length>1&&l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text disabled:opacity-50 mt-1",onClick:fe,disabled:N,children:N?"Exporting...":`Export All ${I.length} Screens`})]}),l.jsx(Fe,{title:"Locale",children:l.jsx(at,{label:"",value:w,onChange:C,options:Te})}),l.jsx(Fe,{title:"Preview Background",children:l.jsx("div",{className:"flex gap-3",children:["dark","light"].map(z=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:H===z,onChange:()=>R(z),className:"accent-accent"}),z.charAt(0).toUpperCase()+z.slice(1)]},z))})}),l.jsxs(Fe,{title:"",children:[l.jsxs("div",{className:"flex gap-2",children:[l.jsx("button",{className:"flex-1 py-2 text-xs bg-accent hover:bg-accent-hover text-white rounded-md",onClick:v,children:"Refresh All"}),l.jsx("button",{className:"flex-1 py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:L,children:"Reload Config"})]}),l.jsx("div",{className:"text-[10px] text-text-dim mt-2",children:Y})]})]})}let lf=null;function Od(r){lf=r}function Mp(){return lf}function sf(){const r=q(w=>w.previewW),a=q(w=>w.previewH),i=q(w=>w.panoramicFrameCount),f=S.useCallback(()=>{try{const w=Mp();return(w==null?void 0:w.contentDocument)??null}catch{return null}},[]),_=r*i,m=S.useCallback(w=>{const C=f();if(!C)return;const H=C.querySelector(".panoramic-canvas");if(H){if(w.type==="solid"&&w.color)H.style.background=w.color;else if(w.type==="gradient"&&w.colors){const R=w.colors.join(", ");w.gradientType==="radial"?H.style.background=`radial-gradient(circle at ${w.radialPosition??"center"}, ${R})`:H.style.background=`linear-gradient(${w.direction??135}deg, ${R})`}}},[f]),c=S.useCallback((w,C)=>{const H=f();if(!H)return;const R=H.querySelector(`[data-index="${w}"]`);R&&(C.x!==void 0&&(R.style.left=`${C.x/100*_}px`),C.y!==void 0&&(R.style.top=`${C.y/100*a}px`),C.width!==void 0&&(R.style.width=`${C.width/100*_}px`),C.height!==void 0&&(R.style.height=`${C.height/100*a}px`),C.rotation!==void 0&&(R.style.transform=`rotate(${C.rotation}deg)`),C.opacity!==void 0&&(R.style.opacity=String(C.opacity)),C.color!==void 0&&(R.classList.contains("pano-decoration")?R.style.background=C.color:R.style.color=C.color),C.fontSize!==void 0&&(R.style.fontSize=`${C.fontSize/100*a}px`),C.fontWeight!==void 0&&(R.style.fontWeight=String(C.fontWeight)))},[f,_,a]);return{patchBackground:m,patchElement:c}}const af={device:"Device",text:"Text",label:"Label",decoration:"Decoration"};function zp(r,a){const i={};for(const m of r){const c=m.category||"other",w=i[c]??[];w.push({value:m.id,label:m.name}),i[c]=w}const f=Object.entries(i).map(([m,c])=>({label:m.charAt(0).toUpperCase()+m.slice(1),options:c})),_=[];for(const m of a)_.push({value:m.id,label:m.name});return _.length>0&&f.push({label:"SVG Frames",options:_}),f}function Op(r,a){return r.map((f,_)=>({z:f.z,i:_})).sort((f,_)=>f.z-_.z).findIndex(f=>f.i===a)}function Dp({index:r}){const a=q(g=>g.panoramicElements[r]),i=q(g=>g.panoramicElements),f=q(g=>g.updatePanoramicElement),_=q(g=>g.removePanoramicElement),m=q(g=>g.config),c=q(g=>g.deviceFamilies),w=q(g=>g.frames),C=q(g=>g.fonts),H=S.useRef(null),{patchElement:R}=sf(),x=S.useMemo(()=>Op(i,r),[i,r]),p=S.useCallback(g=>{f(r,g)},[r,f]),v=S.useCallback(g=>{R(x,g)},[R,x]);if(!a)return null;const F=zp(c,w),I=(m==null?void 0:m.frames.ios)??"",N=a.type==="device"?a.frame??I:"",D=c.find(g=>g.id===N),Y=D&&D.colors.length>1,T=C.map(g=>({value:g.name,label:g.name})),A=g=>{var te;const Q=(te=g.target.files)==null?void 0:te[0];if(!Q)return;const ue=new FileReader;ue.onload=ae=>{var Te;p({screenshot:(Te=ae.target)==null?void 0:Te.result})},ue.readAsDataURL(Q),g.target.value=""};return l.jsxs("div",{children:[l.jsxs("div",{className:"px-5 py-3 border-b border-border flex items-center justify-between",children:[l.jsxs("span",{className:"text-xs font-medium",children:[af[a.type]," #",r+1]}),l.jsx("button",{className:"text-[10px] text-red-400 hover:text-red-300",onClick:()=>{confirm("Remove this element?")&&_(r)},children:"Remove"})]}),l.jsxs(Fe,{title:"Position",children:[l.jsx(ie,{label:"X %",value:a.x,min:-50,max:150,step:.5,formatValue:g=>`${g}%`,onChange:g=>p({x:g}),onInstant:g=>v({x:g})}),l.jsx(ie,{label:"Y %",value:a.y,min:-50,max:150,step:.5,formatValue:g=>`${g}%`,onChange:g=>p({y:g}),onInstant:g=>v({y:g})}),l.jsx(ie,{label:"Z-Index",value:a.z,min:0,max:100,onChange:g=>p({z:g})})]}),a.type==="device"&&l.jsxs(l.Fragment,{children:[l.jsxs(Fe,{title:"Screenshot",children:[a.screenshot.startsWith("data:")?l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:a.screenshot,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:"Custom upload"})]}):l.jsx("div",{className:"text-xs text-text-dim mb-2 truncate",children:a.screenshot}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var g;return(g=H.current)==null?void 0:g.click()},children:"Upload Screenshot"}),l.jsx("input",{ref:H,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden",onChange:A}),a.screenshot.startsWith("data:")&&l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>{var g;return p({screenshot:((g=m==null?void 0:m.screens[0])==null?void 0:g.screenshot)??"screenshots/screen-1.png"})},children:"Revert to File"})]}),l.jsxs(Fe,{title:"Device Frame",children:[l.jsx(at,{label:"Frame",value:N,onChange:g=>p({frame:g}),groups:F}),Y&&l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),l.jsx("div",{className:"flex flex-wrap gap-1",children:D.colors.map(g=>l.jsx("button",{className:"w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform border-border",style:{background:nf[g.name]??"#888888"},title:g.name,onClick:()=>p({deviceColor:g.name})},g.name))})]})]}),l.jsxs(Fe,{title:"Device Size & Position",children:[l.jsx(ie,{label:"Width",value:a.width,min:5,max:60,step:.5,formatValue:g=>`${g}%`,onChange:g=>p({width:g}),onInstant:g=>v({width:g})}),l.jsx(ie,{label:"Rotation",value:a.rotation,min:-180,max:180,formatValue:g=>`${g}°`,onChange:g=>p({rotation:g}),onInstant:g=>v({rotation:g})})]}),l.jsxs(Fe,{title:"Border Simulation",children:[l.jsx(Wt,{label:"Enable Border",checked:!!a.borderSimulation,onChange:g=>p({borderSimulation:g?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:void 0})}),a.borderSimulation&&(()=>{const g=a.borderSimulation;return l.jsxs(l.Fragment,{children:[l.jsx(ie,{label:"Thickness",value:g.thickness,min:1,max:20,formatValue:Q=>`${Q}px`,onChange:Q=>p({borderSimulation:{...g,thickness:Q}})}),l.jsx(et,{label:"Color",value:g.color,onChange:Q=>p({borderSimulation:{...g,color:Q}})}),l.jsx(ie,{label:"Radius",value:g.radius,min:0,max:60,formatValue:Q=>`${Q}px`,onChange:Q=>p({borderSimulation:{...g,radius:Q}})})]})})()]}),l.jsxs(Fe,{title:"Device Shadow",children:[l.jsx(Wt,{label:"Custom Shadow",checked:!!a.shadow,onChange:g=>p({shadow:g?{opacity:.25,blur:30,color:"#000000",offsetY:10}:void 0})}),a.shadow&&l.jsxs(l.Fragment,{children:[l.jsx(ie,{label:"Opacity",value:Math.round(a.shadow.opacity*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>p({shadow:{...a.shadow,opacity:g/100}})}),l.jsx(ie,{label:"Blur",value:a.shadow.blur,min:0,max:80,formatValue:g=>`${g}px`,onChange:g=>p({shadow:{...a.shadow,blur:g}})}),l.jsx(et,{label:"Color",value:a.shadow.color,onChange:g=>p({shadow:{...a.shadow,color:g}})}),l.jsx(ie,{label:"Y Offset",value:a.shadow.offsetY,min:0,max:40,formatValue:g=>`${g}px`,onChange:g=>p({shadow:{...a.shadow,offsetY:g}})})]})]})]}),a.type==="text"&&l.jsxs(l.Fragment,{children:[l.jsxs(Fe,{title:"Content",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Headline"}),l.jsx("textarea",{rows:3,value:a.content,onChange:g=>p({content:g.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),l.jsx(et,{label:"Color",value:a.color,onChange:g=>p({color:g})})]}),l.jsxs(Fe,{title:"Typography",children:[l.jsx(at,{label:"Font",value:a.font??(m==null?void 0:m.theme.font)??"inter",onChange:g=>p({font:g}),options:T}),l.jsx(ie,{label:"Font Size",value:a.fontSize,min:.5,max:20,step:.1,formatValue:g=>`${g}%`,onChange:g=>p({fontSize:g}),onInstant:g=>v({fontSize:g})}),l.jsx(ie,{label:"Font Weight",value:a.fontWeight,min:100,max:900,step:100,formatValue:g=>String(g),onChange:g=>p({fontWeight:g}),onInstant:g=>v({fontWeight:g})}),l.jsx(at,{label:"Alignment",value:a.textAlign,onChange:g=>p({textAlign:g}),options:[{value:"left",label:"Left"},{value:"center",label:"Center"},{value:"right",label:"Right"}]}),l.jsx(ie,{label:"Line Height",value:a.lineHeight,min:.8,max:2,step:.05,formatValue:g=>g.toFixed(2),onChange:g=>p({lineHeight:g})}),l.jsx(at,{label:"Font Style",value:a.fontStyle,onChange:g=>p({fontStyle:g}),options:[{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}]})]}),l.jsxs(Fe,{title:"Text Gradient",children:[l.jsx(Wt,{label:"Enable Gradient",checked:!!a.gradient,onChange:g=>p({gradient:g?{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"}:void 0})}),a.gradient&&(()=>{const g=a.gradient;return l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:ou.map(Q=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform",style:{background:`linear-gradient(${Q.direction}deg, ${Q.colors.join(", ")})`},title:Q.name,onClick:()=>p({gradient:{type:"linear",colors:[...Q.colors],direction:Q.direction,radialPosition:"center"}})},Q.name))}),l.jsx(ie,{label:"Direction",value:g.direction,min:0,max:360,formatValue:Q=>`${Q}°`,onChange:Q=>p({gradient:{...g,direction:Q}})}),g.colors.map((Q,ue)=>l.jsx(et,{label:`Stop ${ue+1}`,value:Q,onChange:te=>{const ae=[...g.colors];ae[ue]=te,p({gradient:{...g,colors:ae}})}},ue))]})})()]}),l.jsxs(Fe,{title:"Layout",children:[l.jsx(Wt,{label:"Limit width",checked:a.maxWidth!==void 0,onChange:g=>p({maxWidth:g?25:void 0})}),a.maxWidth!==void 0&&l.jsx(ie,{label:"Max Width %",value:a.maxWidth,min:5,max:100,step:.5,formatValue:g=>`${g}%`,onChange:g=>p({maxWidth:g})})]})]}),a.type==="label"&&l.jsxs(Fe,{title:"Label",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Content"}),l.jsx("input",{type:"text",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] outline-none focus:border-accent",value:a.content,onChange:g=>p({content:g.target.value})})]}),l.jsx(ie,{label:"Font Size",value:a.fontSize,min:.5,max:10,step:.1,formatValue:g=>`${g}%`,onChange:g=>p({fontSize:g}),onInstant:g=>v({fontSize:g})}),l.jsx(et,{label:"Text Color",value:a.color,onChange:g=>p({color:g})}),l.jsx(et,{label:"Background",value:a.backgroundColor??"#00000033",onChange:g=>p({backgroundColor:g})}),l.jsx(ie,{label:"Padding",value:a.padding,min:0,max:5,step:.1,formatValue:g=>`${g}%`,onChange:g=>p({padding:g})}),l.jsx(ie,{label:"Border Radius",value:a.borderRadius,min:0,max:30,formatValue:g=>`${g}px`,onChange:g=>p({borderRadius:g})})]}),a.type==="decoration"&&l.jsxs(Fe,{title:"Decoration",children:[l.jsx(at,{label:"Shape",value:a.shape,onChange:g=>p({shape:g}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"},{value:"dot-grid",label:"Dot Grid"}]}),l.jsx(ie,{label:"Width",value:a.width,min:.5,max:100,step:.5,formatValue:g=>`${g}%`,onChange:g=>p({width:g}),onInstant:g=>v({width:g})}),a.height!==void 0&&l.jsx(ie,{label:"Height",value:a.height,min:.5,max:100,step:.5,formatValue:g=>`${g}%`,onChange:g=>p({height:g}),onInstant:g=>v({height:g})}),l.jsx(ie,{label:"Opacity",value:a.opacity,min:0,max:1,step:.05,formatValue:g=>`${Math.round(g*100)}%`,onChange:g=>p({opacity:g}),onInstant:g=>v({opacity:g})}),l.jsx(ie,{label:"Rotation",value:a.rotation,min:-180,max:180,formatValue:g=>`${g}°`,onChange:g=>p({rotation:g}),onInstant:g=>v({rotation:g})}),l.jsx(et,{label:"Color",value:a.color,onChange:g=>p({color:g})})]})]})}function Fp({imageDataUrl:r,onUpload:a,onRemove:i}){const f=S.useRef(null),_=m=>{var C;const c=(C=m.target.files)==null?void 0:C[0];if(!c)return;const w=new FileReader;w.onload=H=>{var R;return a((R=H.target)==null?void 0:R.result)},w.readAsDataURL(c),m.target.value=""};return l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var m;return(m=f.current)==null?void 0:m.click()},children:"Upload Background Image"}),l.jsx("input",{ref:f,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden",onChange:_}),r&&l.jsxs("div",{className:"mt-1.5",children:[l.jsx("img",{src:r,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:i,children:"Remove"})]})]})}function Bp(){const r=q(T=>T.panoramicFrameCount),a=q(T=>T.panoramicElements),i=q(T=>T.selectedElementIndex),f=q(T=>T.setSelectedElement),_=q(T=>T.addPanoramicElement),m=q(T=>T.setPanoramicFrameCount),c=q(T=>T.panoramicBackground),w=q(T=>T.updatePanoramicBackground),C=q(T=>T.config),{patchBackground:H}=sf(),R=S.useCallback(T=>H({type:"solid",color:T}),[H]),x=S.useCallback(T=>{const A=c.gradient??{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"};H({type:"gradient",gradientType:A.type,colors:(T==null?void 0:T.colors)??A.colors,direction:(T==null?void 0:T.direction)??A.direction,radialPosition:A.radialPosition})},[c.gradient,H]),p=()=>{var g,Q;const T=a.filter(ue=>ue.type==="device").length,A=((g=C==null?void 0:C.screens[T])==null?void 0:g.screenshot)??((Q=C==null?void 0:C.screens[0])==null?void 0:Q.screenshot)??"screenshots/screen-1.png";_({type:"device",screenshot:A,x:10+T*20,y:15,width:12,rotation:0,z:5})},v=()=>{const T=a.filter(A=>A.type==="text").length;_({type:"text",content:"New headline",x:5+T*20,y:5,fontSize:3.5,color:"#FFFFFF",fontWeight:700,fontStyle:"normal",textAlign:"left",lineHeight:1.15,maxWidth:25,z:10})},F=()=>{_({type:"label",content:"New Label",x:50,y:50,fontSize:1.5,color:"#FFFFFF",backgroundColor:"#00000044",padding:.5,borderRadius:8,z:15})},I=()=>{_({type:"decoration",shape:"circle",x:50,y:50,width:5,height:8,color:(C==null?void 0:C.theme.colors.primary)??"#6366F1",opacity:.15,rotation:0,z:0})},N=c.type,D=c.color??"#000000",Y=c.gradient??{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"};return l.jsxs("div",{children:[l.jsx(Fe,{title:"Canvas",children:l.jsx(ie,{label:"Frame Count",value:r,min:2,max:10,onChange:m})}),l.jsxs(Fe,{title:"Background",children:[l.jsx("div",{className:"flex gap-3 mb-2.5",children:["solid","gradient","image"].map(T=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"pano-bg-type",value:T,checked:N===T,onChange:()=>w({type:T}),className:"accent-accent"}),T.charAt(0).toUpperCase()+T.slice(1)]},T))}),N==="solid"&&l.jsx(et,{label:"Color",value:D,onChange:T=>w({color:T}),onInstant:R,presets:tf}),N==="gradient"&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:ou.map(T=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform",style:{background:`linear-gradient(${T.direction}deg, ${T.colors.join(", ")})`},title:T.name,onClick:()=>w({gradient:{type:"linear",colors:[...T.colors],direction:T.direction,radialPosition:"center"}})},T.name))}),l.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(T=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:Y.type===T,onChange:()=>w({gradient:{...Y,type:T}}),className:"accent-accent"}),T.charAt(0).toUpperCase()+T.slice(1)]},T))}),l.jsx(ie,{label:"Direction",value:Y.direction,min:0,max:360,formatValue:T=>`${T}°`,onChange:T=>w({gradient:{...Y,direction:T}}),onInstant:T=>x({direction:T})}),Y.type==="radial"&&l.jsx(at,{label:"Center",value:Y.radialPosition??"center",onChange:T=>w({gradient:{...Y,radialPosition:T}}),options:[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}]}),Y.colors.map((T,A)=>l.jsx(et,{label:`Stop ${A+1}`,value:T,onChange:g=>{const Q=[...Y.colors];Q[A]=g,w({gradient:{...Y,colors:Q}})}},A)),Y.colors.length<5&&l.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{const T=[...Y.colors,"#ffffff"];w({gradient:{...Y,colors:T}})},children:"+ Add Color Stop"})]}),N==="image"&&l.jsx(Fp,{imageDataUrl:c.image,onUpload:T=>w({image:T}),onRemove:()=>w({image:void 0})})]}),l.jsxs(Fe,{title:`Elements (${a.length})`,children:[l.jsxs("div",{className:"grid grid-cols-4 gap-1 mb-3",children:[l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:p,children:"+ Device"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:v,children:"+ Text"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:F,children:"+ Label"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:I,children:"+ Deco"})]}),a.length===0&&l.jsx("p",{className:"text-xs text-text-dim text-center py-4",children:"Add devices, text, or decorations to build your panoramic layout."}),l.jsx("div",{className:"space-y-1",children:a.map((T,A)=>l.jsxs("button",{className:`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${A===i?"bg-accent/15 text-accent border border-accent/30":"bg-surface-2 border border-border hover:border-accent/30"}`,onClick:()=>f(A===i?null:A),children:[l.jsx("span",{className:"font-medium",children:af[T.type]}),l.jsxs("span",{className:"text-text-dim ml-1",children:["(",Math.round(T.x),"%, ",Math.round(T.y),"%)"]}),T.type==="text"&&l.jsxs("span",{className:"text-text-dim ml-1 truncate",children:["— ",T.content.slice(0,20)]}),T.type==="label"&&l.jsxs("span",{className:"text-text-dim ml-1 truncate",children:["— ",T.content.slice(0,20)]})]},A))})]}),i!==null&&l.jsx(Dp,{index:i}),l.jsx("div",{className:"px-5 py-3 text-[10px] text-text-dim/60",children:"Spotlight, annotations, callouts, and overlays are available in individual mode."})]})}function Ap(r,a,i,f,_,m){var w,C,H,R,x,p;return{screenIndex:r.screenIndex,screenshotDataUrl:r.screenshotDataUrl||void 0,locale:_!=="default"?_:void 0,style:r.style,layout:r.layout,headline:r.headline,subtitle:r.subtitle||void 0,colors:r.colors,font:r.font,fontWeight:r.fontWeight,headlineSize:r.headlineSize||void 0,subtitleSize:r.subtitleSize||void 0,headlineRotation:r.headlineRotation||void 0,subtitleRotation:r.subtitleRotation||void 0,frameId:r.frameId,deviceColor:r.deviceColor||void 0,frameStyle:r.frameStyle,deviceScale:r.deviceScale,deviceTop:r.deviceTop,deviceRotation:r.deviceRotation,deviceOffsetX:r.deviceOffsetX,deviceAngle:r.deviceAngle,deviceTilt:r.deviceTilt,headlineTop:(w=r.textPositions.headline)==null?void 0:w.y,headlineLeft:(C=r.textPositions.headline)==null?void 0:C.x,headlineWidth:(H=r.textPositions.headline)==null?void 0:H.width,subtitleTop:(R=r.textPositions.subtitle)==null?void 0:R.y,subtitleLeft:(x=r.textPositions.subtitle)==null?void 0:x.x,subtitleWidth:(p=r.textPositions.subtitle)==null?void 0:p.width,composition:r.composition||"single",headlineGradient:r.headlineGradient||void 0,subtitleGradient:r.subtitleGradient||void 0,autoSizeHeadline:r.autoSizeHeadline||void 0,autoSizeSubtitle:r.autoSizeSubtitle||void 0,spotlight:r.spotlight||void 0,annotations:r.annotations.length>0?r.annotations:void 0,backgroundType:r.backgroundType!=="preset"?r.backgroundType:void 0,backgroundColor:r.backgroundType==="solid"?r.backgroundColor:void 0,backgroundGradient:r.backgroundType==="gradient"?r.backgroundGradient:void 0,backgroundImageDataUrl:r.backgroundType==="image"?r.backgroundImageDataUrl:void 0,backgroundOverlay:r.backgroundType==="image"&&r.backgroundOverlay?r.backgroundOverlay:void 0,deviceShadow:r.deviceShadow||void 0,borderSimulation:r.borderSimulation||void 0,cornerRadius:r.cornerRadius||void 0,loupe:r.loupe||void 0,callouts:r.callouts.length>0?r.callouts:void 0,overlays:r.overlays.length>0?r.overlays:void 0,headlineLineHeight:r.headlineLineHeight?r.headlineLineHeight/100:void 0,headlineLetterSpacing:r.headlineLetterSpacing?`${r.headlineLetterSpacing/100}em`:void 0,headlineTextTransform:r.headlineTextTransform||void 0,headlineFontStyle:r.headlineFontStyle||void 0,subtitleOpacity:r.subtitleOpacity?r.subtitleOpacity/100:void 0,subtitleLetterSpacing:r.subtitleLetterSpacing?`${r.subtitleLetterSpacing/100}em`:void 0,subtitleTextTransform:r.subtitleTextTransform||void 0,width:i,height:f}}function Wp(r){return{top:r.offsetTop,left:r.offsetLeft,width:r.offsetWidth,height:r.offsetHeight}}function Yp(r,a,i,f,_,m,c,w){const C=S.useRef(null),H=S.useCallback((v,F)=>{var I,N,D,Y;try{const T=(I=r.current)==null?void 0:I.contentDocument;if(!T)return null;const A=T.elementsFromPoint(v,F);let g=null,Q=null,ue=null;for(const te of A){let ae=te;for(;ae&&ae!==T.documentElement;)!g&&((N=ae.classList)!=null&&N.contains("headline"))&&(g=ae),!Q&&((D=ae.classList)!=null&&D.contains("subtitle"))&&(Q=ae),!ue&&((Y=ae.classList)!=null&&Y.contains("device-wrapper"))&&(ue=ae),ae=ae.parentElement}if(g&&Q){const te=g.getBoundingClientRect(),ae=Q.getBoundingClientRect(),Te=te.top+te.height/2,le=ae.top+ae.height/2;return Math.abs(F-Te)<=Math.abs(F-le)?{cls:"headline",el:g,kind:"text"}:{cls:"subtitle",el:Q,kind:"text"}}if(g)return{cls:"headline",el:g,kind:"text"};if(Q)return{cls:"subtitle",el:Q,kind:"text"};if(ue)return{cls:"device-wrapper",el:ue,kind:"device"}}catch{}return null},[r]),R=S.useCallback((v,F)=>{const I=a.current;if(!I)return{x:0,y:0};const N=I.getBoundingClientRect();return{x:(v-N.left)/f,y:(F-N.top)/f}},[a,f]),x=S.useCallback(v=>{if(!i)return;const F=R(v.clientX,v.clientY),I=H(F.x,F.y);if(I){if(v.preventDefault(),I.kind==="device"){C.current={kind:"device",el:I.el,startX:v.clientX,startY:v.clientY,startDeviceTop:i.deviceTop,startDeviceOffsetX:i.deviceOffsetX,offsetX:0,offsetY:0,origWidth:0,scale:f},I.el.style.outline="2px solid rgba(99,102,241,0.5)";const N=Y=>{const T=C.current;if(!T||T.kind!=="device")return;const A=(Y.clientX-T.startX)/T.scale,g=(Y.clientY-T.startY)/T.scale,Q=Math.max(-80,Math.min(80,T.startDeviceOffsetX+Math.round(A/_*100))),ue=Math.max(-80,Math.min(80,T.startDeviceTop+Math.round(g/m*100)));T.el.style.top=ue+"%",T.el.style.left=Q?`calc(50% + ${Q/100*_}px)`:"50%"},D=Y=>{const T=C.current;if(!T||T.kind!=="device")return;T.el.style.outline="none";const A=(Y.clientX-T.startX)/T.scale,g=(Y.clientY-T.startY)/T.scale,Q=Math.max(-80,Math.min(80,T.startDeviceOffsetX+Math.round(A/_*100))),ue=Math.max(-80,Math.min(80,T.startDeviceTop+Math.round(g/m*100)));C.current=null,document.removeEventListener("mousemove",N),document.removeEventListener("mouseup",D),c({deviceTop:ue,deviceOffsetX:Q})};document.addEventListener("mousemove",N),document.addEventListener("mouseup",D)}else if(I.kind==="text"){const N=I.el,D=I.cls,Y=N.getBoundingClientRect(),T=!!(D==="headline"?i.textPositions.headline:i.textPositions.subtitle),A=Y.left+Y.width/2,g=Y.width;if(!T){const te=D==="headline"?i.headlineRotation:i.subtitleRotation,ae=["translateX(-50%)"];te&&ae.push(`rotate(${te}deg)`),N.style.position="fixed",N.style.top=Y.top+"px",N.style.left=A+"px",N.style.transform=ae.join(" "),N.style.zIndex="10",N.style.margin="0",N.style.width=Y.width+"px"}C.current={kind:"text",cls:D,el:N,startX:v.clientX,startY:v.clientY,startDeviceTop:0,startDeviceOffsetX:0,offsetX:F.x-A,offsetY:F.y-Y.top,origWidth:g,scale:f},N.style.outline="2px dashed rgba(99,102,241,0.5)";const Q=te=>{const ae=C.current;if(!ae||ae.kind!=="text")return;const Te=R(te.clientX,te.clientY);ae.el.style.top=Te.y-ae.offsetY+"px",ae.el.style.left=Te.x-ae.offsetX+"px"},ue=()=>{const te=C.current;if(!te||te.kind!=="text")return;te.el.style.outline="none";const ae=Wp(te.el),Te=Math.round(ae.top/m*100*10)/10,le=Math.round(ae.left/_*100*10)/10,fe=Math.round(te.origWidth/_*100*10)/10;C.current=null,document.removeEventListener("mousemove",Q),document.removeEventListener("mouseup",ue),w(te.cls,{x:le,y:Te,width:fe})};document.addEventListener("mousemove",Q),document.addEventListener("mouseup",ue)}}},[i,f,R,H,c,w]),p=S.useCallback((v,F)=>{const I=R(v,F),N=H(I.x,I.y);return N?N.kind==="device"?"move":"grab":"default"},[R,H]);return{onOverlayMouseDown:x,getCursorForPosition:p}}function Hp(){const r=q(Y=>Y.screens),a=q(Y=>Y.selectedScreen),i=q(Y=>Y.setSelectedScreen),f=q(Y=>Y.addScreen),_=q(Y=>Y.removeScreen),m=q(Y=>Y.moveScreen),c=q(Y=>Y.previewW),w=q(Y=>Y.previewH),C=q(Y=>Y.previewBg),H=q(Y=>Y.renderVersion),R=q(Y=>Y.platform),x=q(Y=>Y.locale),p=q(Y=>Y.deviceFamilies),v=S.useRef(null),[F,I]=S.useState(.5),N=S.useCallback(()=>{const Y=v.current;if(!Y)return;const T=Y.clientHeight-120,A=Math.min(T*.85,500),g=400,Q=A/w,ue=g/c;let te=Math.min(Q,ue);te=Math.min(te,1.3),te=Math.max(te,.15),I(te)},[w,c]);S.useEffect(()=>(N(),window.addEventListener("resize",N),()=>window.removeEventListener("resize",N)),[N]);const D=C==="light"?"bg-gray-100":"bg-bg";return l.jsx("div",{ref:v,className:`flex-1 flex flex-col overflow-hidden ${D}`,children:l.jsx("div",{className:"flex-1 overflow-x-auto overflow-y-hidden",children:l.jsxs("div",{className:"flex items-center gap-4 p-6 h-full min-w-min",children:[r.map((Y,T)=>l.jsx(Up,{index:T,selected:T===a,previewW:c,previewH:w,scale:F,headline:Y.headline,canRemove:r.length>1,canMoveLeft:T>0,canMoveRight:T<r.length-1,onSelect:()=>i(T),onRemove:()=>_(T),onMoveLeft:()=>m(T,T-1),onMoveRight:()=>m(T,T+1),renderVersion:H,platform:R,locale:x,deviceFamilies:p},T)),l.jsx("button",{className:"shrink-0 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-text-dim text-xs hover:border-accent hover:text-accent transition-colors cursor-pointer",style:{width:Math.round(c*F*.5),height:Math.round(w*F)},onClick:f,children:"+ Add Screen"})]})})})}function Up({index:r,selected:a,previewW:i,previewH:f,scale:_,canRemove:m,canMoveLeft:c,canMoveRight:w,onSelect:C,onRemove:H,onMoveLeft:R,onMoveRight:x,renderVersion:p,platform:v,locale:F,deviceFamilies:I}){const N=S.useRef(null),D=S.useRef(null),[Y,T]=S.useState(!0),A=S.useRef(null),g=S.useRef(null),Q=q(ne=>ne.screens[r]),ue=q(ne=>ne.updateScreen);S.useEffect(()=>(Id(r,N.current),()=>Id(r,null)),[r]);const te=S.useCallback(ne=>{ue(r,ne)},[r,ue]),ae=S.useCallback((ne,se)=>{const ce={...(Q==null?void 0:Q.textPositions)??{headline:null,subtitle:null}};ce[ne]=se,ue(r,{textPositions:ce})},[r,Q==null?void 0:Q.textPositions,ue]),{onOverlayMouseDown:Te,getCursorForPosition:le}=Yp(N,D,Q,_,i,f,te,ae),[fe,L]=S.useState("default"),z=S.useCallback(ne=>{L(le(ne.clientX,ne.clientY))},[le]);return S.useEffect(()=>{if(Q)return g.current&&clearTimeout(g.current),g.current=setTimeout(()=>{var ce;(ce=A.current)==null||ce.abort();const ne=new AbortController;A.current=ne;const se=Ap(Q,v,i,f,F);rp(se,ne.signal).then($=>{const Z=N.current;if(!Z)return;const re=Z.contentDocument;re?(re.open(),re.write($),re.close()):Z.srcdoc=$,T(!1)}).catch($=>{$ instanceof DOMException&&$.name==="AbortError"||T(!1)})},Y?0:150),()=>{var ne;g.current&&clearTimeout(g.current),(ne=A.current)==null||ne.abort()}},[Q,p,v,i,f,F]),l.jsxs("div",{className:`shrink-0 cursor-pointer rounded-lg overflow-hidden transition-shadow ${a?"ring-2 ring-accent shadow-lg":"hover:ring-1 hover:ring-border"}`,onClick:C,children:[l.jsxs("div",{className:"flex items-center justify-between px-2 py-1 bg-surface text-[10px]",children:[c?l.jsx("button",{className:"text-text-dim hover:text-text px-1",onClick:ne=>{ne.stopPropagation(),R()},title:"Move left",children:"‹"}):l.jsx("span",{className:"w-4"}),l.jsxs("span",{className:"text-text-dim font-medium",children:["Screen ",r+1]}),l.jsxs("div",{className:"flex items-center gap-0.5",children:[w&&l.jsx("button",{className:"text-text-dim hover:text-text px-1",onClick:ne=>{ne.stopPropagation(),x()},title:"Move right",children:"›"}),m&&l.jsx("button",{className:"text-text-dim hover:text-red-400 px-1",onClick:ne=>{ne.stopPropagation(),confirm("Remove this screen?")&&H()},title:"Remove screen",children:"×"})]})]}),l.jsxs("div",{ref:D,className:"relative overflow-hidden",style:{width:i*_,height:f*_},children:[Y&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-bg z-20",children:l.jsx("div",{className:"w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),l.jsx("iframe",{ref:N,className:"border-none block origin-top-left",style:{width:i,height:f,transform:`scale(${_})`},title:`Screen ${r+1}`}),l.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:fe},onMouseDown:Te,onMouseMove:z})]})]})}function Xp(){const r=S.useRef(null),a=S.useRef(null),i=S.useRef(null),f=S.useRef(null),_=S.useRef(null),m=q(le=>le.config),c=q(le=>le.previewW),w=q(le=>le.previewH),C=q(le=>le.previewBg),H=q(le=>le.renderVersion),R=q(le=>le.panoramicFrameCount),x=q(le=>le.panoramicBackground),p=q(le=>le.panoramicElements),v=q(le=>le.selectedElementIndex),F=q(le=>le.setSelectedElement),I=q(le=>le.updatePanoramicElement),[N,D]=S.useState(.3),[Y,T]=S.useState(!0),A=S.useRef(null);S.useEffect(()=>(Od(r.current),()=>Od(null)),[]);const g=c*R,Q=S.useCallback(()=>{const le=a.current;if(!le)return;const fe=le.clientWidth-48,L=le.clientHeight-120,z=fe/g,ne=L/w;let se=Math.min(z,ne);se=Math.min(se,1),se=Math.max(se,.05),D(se)},[g,w]);S.useEffect(()=>(Q(),window.addEventListener("resize",Q),()=>window.removeEventListener("resize",Q)),[Q]),S.useEffect(()=>{if(m)return _.current&&clearTimeout(_.current),_.current=setTimeout(()=>{var L;(L=f.current)==null||L.abort();const le=new AbortController;f.current=le;const fe={frameCount:R,frameWidth:c,frameHeight:w,background:x,elements:p,font:m.theme.font,fontWeight:m.theme.fontWeight,frameStyle:m.frames.style};up(fe,le.signal).then(z=>{const ne=r.current;if(!ne)return;const se=ne.contentDocument;se&&(se.open(),se.write(z),se.close()),T(!1)}).catch(z=>{z instanceof DOMException&&z.name==="AbortError"||(console.error("[PanoramicPreview] fetch failed:",z),T(!1))})},Y?0:200),()=>{var le;_.current&&clearTimeout(_.current),(le=f.current)==null||le.abort()}},[m,R,c,w,x,p,H]);const ue=S.useCallback((le,fe)=>{const L=i.current;if(!L)return null;const z=L.getBoundingClientRect(),ne=(le-z.left)/(g*N)*100,se=(fe-z.top)/(w*N)*100;return{x:ne,y:se}},[g,w,N]),te=S.useCallback((le,fe)=>{const L=ue(le,fe);if(!L)return null;let z=null,ne=-1;for(let se=0;se<p.length;se++){const ce=p[se];let $,Z;ce.type==="device"?($=ce.width,Z=ce.width/100*g*2.1/w*100):ce.type==="text"?($=ce.maxWidth||15,Z=ce.fontSize/100*w*2/w*100):ce.type==="decoration"?($=ce.width,Z=ce.height?ce.height/100*w/w*100:$*g/w):($=10,Z=5),L.x>=ce.x&&L.x<=ce.x+$&&L.y>=ce.y&&L.y<=ce.y+Z&&ce.z>ne&&(ne=ce.z,z=se)}return z},[p,ue,g,w]),ae=S.useCallback(le=>{if(!ue(le.clientX,le.clientY))return;const L=te(le.clientX,le.clientY);if(L!==null){F(L);const z=p[L];A.current={elementIndex:L,startX:le.clientX,startY:le.clientY,origX:z.x,origY:z.y},le.preventDefault()}},[ue,te,p,F]);S.useEffect(()=>{const le=L=>{const z=A.current;if(!z)return;const ne=(L.clientX-z.startX)/N,se=(L.clientY-z.startY)/N,ce=r.current,$=ce==null?void 0:ce.contentDocument;if($){const re=[...p].map((U,Ne)=>({z:U.z,i:Ne})).sort((U,Ne)=>U.z-Ne.z).findIndex(U=>U.i===z.elementIndex),P=$.querySelector(`[data-index="${re}"]`);if(P){const U=p[z.elementIndex],Ne="rotation"in U&&U.rotation?U.rotation:0;P.style.filter="none",P.style.transform=`translate(${ne}px, ${se}px) rotate(${Ne}deg)`}}},fe=L=>{const z=A.current;if(!z)return;const ne=(L.clientX-z.startX)/(g*N)*100,se=(L.clientY-z.startY)/(w*N)*100,ce=Math.round((z.origX+ne)*2)/2,$=Math.round((z.origY+se)*2)/2;I(z.elementIndex,{x:ce,y:$}),A.current=null};return window.addEventListener("mousemove",le),window.addEventListener("mouseup",fe),()=>{window.removeEventListener("mousemove",le),window.removeEventListener("mouseup",fe)}},[g,w,N,p,I]),S.useEffect(()=>{const le=fe=>{var $;if(v===null)return;const L=($=fe.target)==null?void 0:$.tagName;if(L==="INPUT"||L==="TEXTAREA"||L==="SELECT")return;const z=fe.shiftKey?5:.5;let ne=0,se=0;if(fe.key==="ArrowLeft")ne=-z;else if(fe.key==="ArrowRight")ne=z;else if(fe.key==="ArrowUp")se=-z;else if(fe.key==="ArrowDown")se=z;else return;fe.preventDefault();const ce=p[v];ce&&I(v,{x:Math.round((ce.x+ne)*2)/2,y:Math.round((ce.y+se)*2)/2})};return window.addEventListener("keydown",le),()=>window.removeEventListener("keydown",le)},[v,p,I]);const Te=C==="light"?"bg-gray-100":"bg-bg";return l.jsxs("div",{ref:a,className:`flex-1 flex flex-col overflow-hidden ${Te}`,children:[l.jsx("div",{className:"flex items-center justify-between px-6 py-3 border-b border-border bg-surface",children:l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("span",{className:"text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded",children:"Panoramic"}),l.jsxs("span",{className:"text-xs text-text-dim",children:[R," frames · ",g,"×",w]})]})}),l.jsx("div",{className:"flex-1 overflow-auto flex items-center justify-center p-6",children:l.jsxs("div",{className:"relative",children:[Y&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center z-20",children:l.jsx("div",{className:"w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),l.jsx("div",{className:"flex mb-1",style:{width:g*N},children:Array.from({length:R},(le,fe)=>l.jsxs("div",{className:"text-[9px] text-text-dim text-center border-x border-border/30",style:{width:c*N},children:["Frame ",fe+1]},fe))}),l.jsxs("div",{ref:i,className:"relative overflow-hidden rounded border border-border/30",style:{width:g*N,height:w*N},children:[l.jsx("iframe",{ref:r,className:"border-none block origin-top-left",style:{width:g,height:w,transform:`scale(${N})`},title:"Panoramic Preview"}),l.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:A.current?"grabbing":"grab"},onMouseDown:ae})]}),p.map((le,fe)=>{const L=le.x/100*g*N,z=le.y/100*w*N,ne=fe===v;return l.jsx("div",{className:`absolute pointer-events-none ${ne?"w-3 h-3 rounded-full ring-2 ring-accent bg-accent":"w-2 h-2 rounded-full bg-white/40"}`,style:{left:L-(ne?6:4),top:z-(ne?6:4)+18},title:`${le.type} #${fe+1}`},fe)})]})})]})}var Dd=Jd(),Vp=`svg[fill=none] {
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
}`,Qp={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let r=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");r||(r=document.createElement("style"),r.id="feedback-tool-styles-annotation-popup-css-styles",r.textContent=Vp,document.head.appendChild(r))}var Je=Qp,Gp=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",children:l.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),Kp=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",children:l.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),Zp=({size:r=24,style:a={}})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",style:a,children:[l.jsxs("g",{clipPath:"url(#clip0_list_sparkle)",children:[l.jsx("path",{d:"M11.5 12L5.5 12",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M18.5 6.75L5.5 6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M9.25 17.25L5.5 17.25",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})]}),l.jsx("defs",{children:l.jsx("clipPath",{id:"clip0_list_sparkle",children:l.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),Br=({size:r=20})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:[l.jsx("circle",{cx:"10",cy:"10.5",r:"5.25",stroke:"currentColor",strokeWidth:"1.25"}),l.jsx("path",{d:"M8.5 8.75C8.5 7.92 9.17 7.25 10 7.25C10.83 7.25 11.5 7.92 11.5 8.75C11.5 9.58 10.83 10.25 10 10.25V11",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("circle",{cx:"10",cy:"13",r:"0.75",fill:"currentColor"})]}),Fd=({size:r=14})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 14 14",fill:"none",children:[l.jsx("style",{children:`
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
    `}),l.jsx("path",{className:"check-path-animated",d:"M3.9375 7L6.125 9.1875L10.5 4.8125",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),Jp=({size:r=24,copied:a=!1})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .copy-icon, .check-icon {
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
    `}),l.jsxs("g",{className:"copy-icon",style:{opacity:a?0:1,transform:a?"scale(0.8)":"scale(1)",transformOrigin:"center"},children:[l.jsx("path",{d:"M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",stroke:"currentColor",strokeWidth:"1.5"}),l.jsx("path",{d:"M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),l.jsxs("g",{className:"check-icon",style:{opacity:a?1:0,transform:a?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})]}),qp=({size:r=24,state:a="idle"})=>{const i=a==="idle",f=a==="sent",_=a==="failed",m=a==="sending";return l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
        .send-arrow-icon, .send-check-icon, .send-error-icon {
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
      `}),l.jsx("g",{className:"send-arrow-icon",style:{opacity:i?1:m?.5:0,transform:i?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:l.jsx("path",{d:"M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),l.jsxs("g",{className:"send-check-icon",style:{opacity:f?1:0,transform:f?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsxs("g",{className:"send-error-icon",style:{opacity:_?1:0,transform:_?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M12 8V12",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round"}),l.jsx("circle",{cx:"12",cy:"15",r:"0.5",fill:"#ef4444",stroke:"#ef4444",strokeWidth:"1"})]})]})},e_=({size:r=24,isOpen:a=!0})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .eye-open, .eye-closed {
        transition: opacity 0.2s ease;
      }
    `}),l.jsxs("g",{className:"eye-open",style:{opacity:a?1:0},children:[l.jsx("path",{d:"M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsxs("g",{className:"eye-closed",style:{opacity:a?0:1},children:[l.jsx("path",{d:"M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",fill:"currentColor"}),l.jsx("path",{d:"M5 19L19 5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})]}),t_=({size:r=24,isPaused:a=!1})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .pause-bar, .play-triangle {
        transition: opacity 0.15s ease;
      }
    `}),l.jsx("path",{className:"pause-bar",d:"M8 6L8 18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:a?0:1}}),l.jsx("path",{className:"pause-bar",d:"M16 18L16 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:a?0:1}}),l.jsx("path",{className:"play-triangle",d:"M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",stroke:"currentColor",strokeWidth:"1.5",style:{opacity:a?1:0}})]}),n_=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("path",{d:"M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("circle",{cx:"12",cy:"12",r:"2.5",stroke:"currentColor",strokeWidth:"1.5"})]}),o_=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:l.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Ya=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsxs("g",{clipPath:"url(#clip0_2_53)",children:[l.jsx("path",{d:"M16.25 16.25L7.75 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M7.75 16.25L16.25 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsx("defs",{children:l.jsx("clipPath",{id:"clip0_2_53",children:l.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),r_=({size:r=24})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:l.jsx("path",{d:"M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z",fill:"currentColor"})}),l_=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:[l.jsx("path",{d:"M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M10 3.9585V5.05698",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M10 14.9429V16.0414",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M5.7269 5.72656L6.50682 6.50649",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M13.4932 13.4932L14.2731 14.2731",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M3.95834 10H5.05683",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M14.9432 10H16.0417",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M5.7269 14.2731L6.50682 13.4932",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M13.4932 6.50649L14.2731 5.72656",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"})]}),s_=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:l.jsx("path",{d:"M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z",stroke:"currentColor",strokeWidth:"1.13793",strokeLinecap:"round",strokeLinejoin:"round"})}),Bd=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375",stroke:"currentColor",strokeWidth:"0.9",strokeLinecap:"round",strokeLinejoin:"round"})}),i_=({size:r=24})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),a_=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M8.5 3.5L4 8L8.5 12.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),uf=["data-feedback-toolbar","data-annotation-popup","data-annotation-marker"],Ha=uf.flatMap(r=>[`:not([${r}])`,`:not([${r}] *)`]).join(""),qa="feedback-freeze-styles",Ua="__agentation_freeze";function u_(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:a=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const r=window;return r[Ua]||(r[Ua]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),r[Ua]}var De=u_();typeof window<"u"&&!De.installed&&(De.origSetTimeout=window.setTimeout.bind(window),De.origSetInterval=window.setInterval.bind(window),De.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(r,a,...i)=>typeof r=="string"?De.origSetTimeout(r,a):De.origSetTimeout((...f)=>{De.frozen?De.frozenTimeoutQueue.push(()=>r(...f)):r(...f)},a,...i),window.setInterval=(r,a,...i)=>typeof r=="string"?De.origSetInterval(r,a):De.origSetInterval((...f)=>{De.frozen||r(...f)},a,...i),window.requestAnimationFrame=r=>De.origRAF(a=>{De.frozen?De.frozenRAFQueue.push(r):r(a)}),De.installed=!0);var He=De.origSetTimeout,c_=De.origSetInterval;function d_(r){return r?uf.some(a=>{var i;return!!((i=r.closest)!=null&&i.call(r,`[${a}]`))}):!1}function f_(){if(typeof document>"u"||De.frozen)return;De.frozen=!0,De.frozenTimeoutQueue=[],De.frozenRAFQueue=[];let r=document.getElementById(qa);r||(r=document.createElement("style"),r.id=qa),r.textContent=`
    *${Ha},
    *${Ha}::before,
    *${Ha}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `,document.head.appendChild(r),De.pausedAnimations=[];try{document.getAnimations().forEach(a=>{var f;if(a.playState!=="running")return;const i=(f=a.effect)==null?void 0:f.target;d_(i)||(a.pause(),De.pausedAnimations.push(a))})}catch{}document.querySelectorAll("video").forEach(a=>{a.paused||(a.dataset.wasPaused="false",a.pause())})}function Ad(){var i;if(typeof document>"u"||!De.frozen)return;De.frozen=!1;const r=De.frozenTimeoutQueue;De.frozenTimeoutQueue=[];for(const f of r)De.origSetTimeout(()=>{if(De.frozen){De.frozenTimeoutQueue.push(f);return}try{f()}catch(_){console.warn("[agentation] Error replaying queued timeout:",_)}},0);const a=De.frozenRAFQueue;De.frozenRAFQueue=[];for(const f of a)De.origRAF(_=>{if(De.frozen){De.frozenRAFQueue.push(f);return}f(_)});for(const f of De.pausedAnimations)try{f.play()}catch(_){console.warn("[agentation] Error resuming animation:",_)}De.pausedAnimations=[],(i=document.getElementById(qa))==null||i.remove(),document.querySelectorAll("video").forEach(f=>{f.dataset.wasPaused==="false"&&(f.play().catch(()=>{}),delete f.dataset.wasPaused)})}var Wd=S.forwardRef(function({element:a,timestamp:i,selectedText:f,placeholder:_="What should change?",initialValue:m="",submitLabel:c="Add",onSubmit:w,onCancel:C,onDelete:H,style:R,accentColor:x="#3c82f7",isExiting:p=!1,lightMode:v=!1,computedStyles:F},I){const[N,D]=S.useState(m),[Y,T]=S.useState(!1),[A,g]=S.useState("initial"),[Q,ue]=S.useState(!1),[te,ae]=S.useState(!1),Te=S.useRef(null),le=S.useRef(null),fe=S.useRef(null),L=S.useRef(null);S.useEffect(()=>{p&&A!=="exit"&&g("exit")},[p,A]),S.useEffect(()=>{He(()=>{g("enter")},0);const Z=He(()=>{g("entered")},200),re=He(()=>{const P=Te.current;P&&(P.focus(),P.selectionStart=P.selectionEnd=P.value.length,P.scrollTop=P.scrollHeight)},50);return()=>{clearTimeout(Z),clearTimeout(re),fe.current&&clearTimeout(fe.current),L.current&&clearTimeout(L.current)}},[]);const z=S.useCallback(()=>{L.current&&clearTimeout(L.current),T(!0),L.current=He(()=>{var Z;T(!1),(Z=Te.current)==null||Z.focus()},250)},[]);S.useImperativeHandle(I,()=>({shake:z}),[z]);const ne=S.useCallback(()=>{g("exit"),fe.current=He(()=>{C()},150)},[C]),se=S.useCallback(()=>{N.trim()&&w(N.trim())},[N,w]),ce=S.useCallback(Z=>{Z.stopPropagation(),!Z.nativeEvent.isComposing&&(Z.key==="Enter"&&!Z.shiftKey&&(Z.preventDefault(),se()),Z.key==="Escape"&&ne())},[se,ne]),$=[Je.popup,v?Je.light:"",A==="enter"?Je.enter:"",A==="entered"?Je.entered:"",A==="exit"?Je.exit:"",Y?Je.shake:""].filter(Boolean).join(" ");return l.jsxs("div",{ref:le,className:$,"data-annotation-popup":!0,style:R,onClick:Z=>Z.stopPropagation(),children:[l.jsxs("div",{className:Je.header,children:[F&&Object.keys(F).length>0?l.jsxs("button",{className:Je.headerToggle,onClick:()=>{const Z=te;ae(!te),Z&&He(()=>{var re;return(re=Te.current)==null?void 0:re.focus()},0)},type:"button",children:[l.jsx("svg",{className:`${Je.chevron} ${te?Je.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),l.jsx("span",{className:Je.element,children:a})]}):l.jsx("span",{className:Je.element,children:a}),i&&l.jsx("span",{className:Je.timestamp,children:i})]}),F&&Object.keys(F).length>0&&l.jsx("div",{className:`${Je.stylesWrapper} ${te?Je.expanded:""}`,children:l.jsx("div",{className:Je.stylesInner,children:l.jsx("div",{className:Je.stylesBlock,children:Object.entries(F).map(([Z,re])=>l.jsxs("div",{className:Je.styleLine,children:[l.jsx("span",{className:Je.styleProperty,children:Z.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",l.jsx("span",{className:Je.styleValue,children:re}),";"]},Z))})})}),f&&l.jsxs("div",{className:Je.quote,children:["“",f.slice(0,80),f.length>80?"...":"","”"]}),l.jsx("textarea",{ref:Te,className:Je.textarea,style:{borderColor:Q?x:void 0},placeholder:_,value:N,onChange:Z=>D(Z.target.value),onFocus:()=>ue(!0),onBlur:()=>ue(!1),rows:2,onKeyDown:ce}),l.jsxs("div",{className:Je.actions,children:[H&&l.jsx("div",{className:Je.deleteWrapper,children:l.jsx("button",{className:Je.deleteButton,onClick:H,type:"button",children:l.jsx(i_,{size:22})})}),l.jsx("button",{className:Je.cancel,onClick:ne,children:"Cancel"}),l.jsx("button",{className:Je.submit,style:{backgroundColor:x,opacity:N.trim()?1:.4},onClick:se,disabled:!N.trim(),children:c})]})]})});function Hr(r){if(r.parentElement)return r.parentElement;const a=r.getRootNode();return a instanceof ShadowRoot?a.host:null}function Jt(r,a){let i=r;for(;i;){if(i.matches(a))return i;i=Hr(i)}return null}function m_(r,a=4){const i=[];let f=r,_=0;for(;f&&_<a;){const m=f.tagName.toLowerCase();if(m==="html"||m==="body")break;let c=m;if(f.id)c=`#${f.id}`;else if(f.className&&typeof f.className=="string"){const C=f.className.split(/\s+/).find(H=>H.length>2&&!H.match(/^[a-z]{1,2}$/)&&!H.match(/[A-Z0-9]{5,}/));C&&(c=`.${C.split("_")[0]}`)}const w=Hr(f);!f.parentElement&&w&&(c=`⟨shadow⟩ ${c}`),i.unshift(c),f=w,_++}return i.join(" > ")}function ri(r){var f,_,m,c,w,C,H,R;const a=m_(r);if(r.dataset.element)return{name:r.dataset.element,path:a};const i=r.tagName.toLowerCase();if(["path","circle","rect","line","g"].includes(i)){const x=Jt(r,"svg");if(x){const p=Hr(x);if(p instanceof HTMLElement)return{name:`graphic in ${ri(p).name}`,path:a}}return{name:"graphic element",path:a}}if(i==="svg"){const x=Hr(r);if((x==null?void 0:x.tagName.toLowerCase())==="button"){const p=(f=x.textContent)==null?void 0:f.trim();return{name:p?`icon in "${p}" button`:"button icon",path:a}}return{name:"icon",path:a}}if(i==="button"){const x=(_=r.textContent)==null?void 0:_.trim(),p=r.getAttribute("aria-label");return p?{name:`button [${p}]`,path:a}:{name:x?`button "${x.slice(0,25)}"`:"button",path:a}}if(i==="a"){const x=(m=r.textContent)==null?void 0:m.trim(),p=r.getAttribute("href");return x?{name:`link "${x.slice(0,25)}"`,path:a}:p?{name:`link to ${p.slice(0,30)}`,path:a}:{name:"link",path:a}}if(i==="input"){const x=r.getAttribute("type")||"text",p=r.getAttribute("placeholder"),v=r.getAttribute("name");return p?{name:`input "${p}"`,path:a}:v?{name:`input [${v}]`,path:a}:{name:`${x} input`,path:a}}if(["h1","h2","h3","h4","h5","h6"].includes(i)){const x=(c=r.textContent)==null?void 0:c.trim();return{name:x?`${i} "${x.slice(0,35)}"`:i,path:a}}if(i==="p"){const x=(w=r.textContent)==null?void 0:w.trim();return x?{name:`paragraph: "${x.slice(0,40)}${x.length>40?"...":""}"`,path:a}:{name:"paragraph",path:a}}if(i==="span"||i==="label"){const x=(C=r.textContent)==null?void 0:C.trim();return x&&x.length<40?{name:`"${x}"`,path:a}:{name:i,path:a}}if(i==="li"){const x=(H=r.textContent)==null?void 0:H.trim();return x&&x.length<40?{name:`list item: "${x.slice(0,35)}"`,path:a}:{name:"list item",path:a}}if(i==="blockquote")return{name:"blockquote",path:a};if(i==="code"){const x=(R=r.textContent)==null?void 0:R.trim();return x&&x.length<30?{name:`code: \`${x}\``,path:a}:{name:"code",path:a}}if(i==="pre")return{name:"code block",path:a};if(i==="img"){const x=r.getAttribute("alt");return{name:x?`image "${x.slice(0,30)}"`:"image",path:a}}if(i==="video")return{name:"video",path:a};if(["div","section","article","nav","header","footer","aside","main"].includes(i)){const x=r.className,p=r.getAttribute("role"),v=r.getAttribute("aria-label");if(v)return{name:`${i} [${v}]`,path:a};if(p)return{name:`${p}`,path:a};if(typeof x=="string"&&x){const F=x.split(/[\s_-]+/).map(I=>I.replace(/[A-Z0-9]{5,}.*$/,"")).filter(I=>I.length>2&&!/^[a-z]{1,2}$/.test(I)).slice(0,2);if(F.length>0)return{name:F.join(" "),path:a}}return{name:i==="div"?"container":i,path:a}}return{name:i,path:a}}function Ll(r){var m,c,w;const a=[],i=(m=r.textContent)==null?void 0:m.trim();i&&i.length<100&&a.push(i);const f=r.previousElementSibling;if(f){const C=(c=f.textContent)==null?void 0:c.trim();C&&C.length<50&&a.unshift(`[before: "${C.slice(0,40)}"]`)}const _=r.nextElementSibling;if(_){const C=(w=_.textContent)==null?void 0:w.trim();C&&C.length<50&&a.push(`[after: "${C.slice(0,40)}"]`)}return a.join(" ")}function Vs(r){const a=Hr(r);if(!a)return"";const _=(r.getRootNode()instanceof ShadowRoot&&r.parentElement?Array.from(r.parentElement.children):Array.from(a.children)).filter(R=>R!==r&&R instanceof HTMLElement);if(_.length===0)return"";const m=_.slice(0,4).map(R=>{var F;const x=R.tagName.toLowerCase(),p=R.className;let v="";if(typeof p=="string"&&p){const I=p.split(/\s+/).map(N=>N.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(N=>N.length>2&&!/^[a-z]{1,2}$/.test(N));I&&(v=`.${I}`)}if(x==="button"||x==="a"){const I=(F=R.textContent)==null?void 0:F.trim().slice(0,15);if(I)return`${x}${v} "${I}"`}return`${x}${v}`});let w=a.tagName.toLowerCase();if(typeof a.className=="string"&&a.className){const R=a.className.split(/\s+/).map(x=>x.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(x=>x.length>2&&!/^[a-z]{1,2}$/.test(x));R&&(w=`.${R}`)}const C=a.children.length,H=C>m.length+1?` (${C} total in ${w})`:"";return m.join(", ")+H}function Tl(r){const a=r.className;return typeof a!="string"||!a?"":a.split(/\s+/).filter(f=>f.length>0).map(f=>{const _=f.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);return _?_[1]:f}).filter((f,_,m)=>m.indexOf(f)===_).join(", ")}var cf=new Set(["none","normal","auto","0px","rgba(0, 0, 0, 0)","transparent","static","visible"]),p_=new Set(["p","span","h1","h2","h3","h4","h5","h6","label","li","td","th","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","a","time","cite","q"]),__=new Set(["input","textarea","select"]),h_=new Set(["img","video","canvas","svg"]),g_=new Set(["div","section","article","nav","header","footer","aside","main","ul","ol","form","fieldset"]);function Qs(r){if(typeof window>"u")return{};const a=window.getComputedStyle(r),i={},f=r.tagName.toLowerCase();let _;p_.has(f)?_=["color","fontSize","fontWeight","fontFamily","lineHeight"]:f==="button"||f==="a"&&r.getAttribute("role")==="button"?_=["backgroundColor","color","padding","borderRadius","fontSize"]:__.has(f)?_=["backgroundColor","color","padding","borderRadius","fontSize"]:h_.has(f)?_=["width","height","objectFit","borderRadius"]:g_.has(f)?_=["display","padding","margin","gap","backgroundColor"]:_=["color","fontSize","margin","padding","backgroundColor"];for(const m of _){const c=m.replace(/([A-Z])/g,"-$1").toLowerCase(),w=a.getPropertyValue(c);w&&!cf.has(w)&&(i[m]=w)}return i}var y_=["color","backgroundColor","borderColor","fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","textAlign","width","height","padding","margin","border","borderRadius","display","position","top","right","bottom","left","zIndex","flexDirection","justifyContent","alignItems","gap","opacity","visibility","overflow","boxShadow","transform"];function Gs(r){if(typeof window>"u")return"";const a=window.getComputedStyle(r),i=[];for(const f of y_){const _=f.replace(/([A-Z])/g,"-$1").toLowerCase(),m=a.getPropertyValue(_);m&&!cf.has(m)&&i.push(`${_}: ${m}`)}return i.join("; ")}function x_(r){if(!r)return;const a={},i=r.split(";").map(f=>f.trim()).filter(Boolean);for(const f of i){const _=f.indexOf(":");if(_>0){const m=f.slice(0,_).trim(),c=f.slice(_+1).trim();m&&c&&(a[m]=c)}}return Object.keys(a).length>0?a:void 0}function Ks(r){const a=[],i=r.getAttribute("role"),f=r.getAttribute("aria-label"),_=r.getAttribute("aria-describedby"),m=r.getAttribute("tabindex"),c=r.getAttribute("aria-hidden");return i&&a.push(`role="${i}"`),f&&a.push(`aria-label="${f}"`),_&&a.push(`aria-describedby="${_}"`),m&&a.push(`tabindex=${m}`),c==="true"&&a.push("aria-hidden"),r.matches("a, button, input, select, textarea, [tabindex]")&&a.push("focusable"),a.join(", ")}function Zs(r){const a=[];let i=r;for(;i&&i.tagName.toLowerCase()!=="html";){const f=i.tagName.toLowerCase();let _=f;if(i.id)_=`${f}#${i.id}`;else if(i.className&&typeof i.className=="string"){const c=i.className.split(/\s+/).map(w=>w.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(w=>w.length>2);c&&(_=`${f}.${c}`)}const m=Hr(i);!i.parentElement&&m&&(_=`⟨shadow⟩ ${_}`),a.unshift(_),i=m}return a.join(" > ")}var eu="feedback-annotations-",df=7;function li(r){return`${eu}${r}`}function Xa(r){if(typeof window>"u")return[];try{const a=localStorage.getItem(li(r));if(!a)return[];const i=JSON.parse(a),f=Date.now()-df*24*60*60*1e3;return i.filter(_=>!_.timestamp||_.timestamp>f)}catch{return[]}}function ff(r,a){if(!(typeof window>"u"))try{localStorage.setItem(li(r),JSON.stringify(a))}catch{}}function v_(){const r=new Map;if(typeof window>"u")return r;try{const a=Date.now()-df*24*60*60*1e3;for(let i=0;i<localStorage.length;i++){const f=localStorage.key(i);if(f!=null&&f.startsWith(eu)){const _=f.slice(eu.length),m=localStorage.getItem(f);if(m){const w=JSON.parse(m).filter(C=>!C.timestamp||C.timestamp>a);w.length>0&&r.set(_,w)}}}}catch{}return r}function Il(r,a,i){const f=a.map(_=>({..._,_syncedTo:i}));ff(r,f)}var mf="agentation-session-";function ru(r){return`${mf}${r}`}function b_(r){if(typeof window>"u")return null;try{return localStorage.getItem(ru(r))}catch{return null}}function Va(r,a){if(!(typeof window>"u"))try{localStorage.setItem(ru(r),a)}catch{}}function w_(r){if(!(typeof window>"u"))try{localStorage.removeItem(ru(r))}catch{}}var pf=`${mf}toolbar-hidden`;function k_(){if(typeof window>"u")return!1;try{return sessionStorage.getItem(pf)==="1"}catch{return!1}}function S_(r){if(!(typeof window>"u"))try{r&&sessionStorage.setItem(pf,"1")}catch{}}async function Qa(r,a){const i=await fetch(`${r}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:a})});if(!i.ok)throw new Error(`Failed to create session: ${i.status}`);return i.json()}async function Yd(r,a){const i=await fetch(`${r}/sessions/${a}`);if(!i.ok)throw new Error(`Failed to get session: ${i.status}`);return i.json()}async function Js(r,a,i){const f=await fetch(`${r}/sessions/${a}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!f.ok)throw new Error(`Failed to sync annotation: ${f.status}`);return f.json()}async function C_(r,a,i){const f=await fetch(`${r}/annotations/${a}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!f.ok)throw new Error(`Failed to update annotation: ${f.status}`);return f.json()}async function Hd(r,a){const i=await fetch(`${r}/annotations/${a}`,{method:"DELETE"});if(!i.ok)throw new Error(`Failed to delete annotation: ${i.status}`)}var Ve={FunctionComponent:0,ClassComponent:1,IndeterminateComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,Fragment:7,Mode:8,ContextConsumer:9,ContextProvider:10,ForwardRef:11,Profiler:12,SuspenseComponent:13,MemoComponent:14,SimpleMemoComponent:15,LazyComponent:16,IncompleteClassComponent:17,DehydratedFragment:18,SuspenseListComponent:19,ScopeComponent:21,OffscreenComponent:22,LegacyHiddenComponent:23,CacheComponent:24,TracingMarkerComponent:25,HostHoistable:26,HostSingleton:27,IncompleteFunctionComponent:28,Throw:29,ViewTransitionComponent:30,ActivityComponent:31},Ud=new Set(["Component","PureComponent","Fragment","Suspense","Profiler","StrictMode","Routes","Route","Outlet","Root","ErrorBoundaryHandler","HotReload","Hot"]),Xd=[/Boundary$/,/BoundaryHandler$/,/Provider$/,/Consumer$/,/^(Inner|Outer)/,/Router$/,/^Client(Page|Segment|Root)/,/^Server(Root|Component|Render)/,/^RSC/,/Context$/,/^Hot(Reload)?$/,/^(Dev|React)(Overlay|Tools|Root)/,/Overlay$/,/Handler$/,/^With[A-Z]/,/Wrapper$/,/^Root$/],j_=[/Page$/,/View$/,/Screen$/,/Section$/,/Card$/,/List$/,/Item$/,/Form$/,/Modal$/,/Dialog$/,/Button$/,/Nav$/,/Header$/,/Footer$/,/Layout$/,/Panel$/,/Tab$/,/Menu$/];function E_(r){const a=(r==null?void 0:r.mode)??"filtered";let i=Ud;if(r!=null&&r.skipExact){const f=r.skipExact instanceof Set?r.skipExact:new Set(r.skipExact);i=new Set([...Ud,...f])}return{maxComponents:(r==null?void 0:r.maxComponents)??6,maxDepth:(r==null?void 0:r.maxDepth)??30,mode:a,skipExact:i,skipPatterns:r!=null&&r.skipPatterns?[...Xd,...r.skipPatterns]:Xd,userPatterns:(r==null?void 0:r.userPatterns)??j_,filter:r==null?void 0:r.filter}}function N_(r){return r.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/([A-Z])([A-Z][a-z])/g,"$1-$2").toLowerCase()}function P_(r,a=10){const i=new Set;let f=r,_=0;for(;f&&_<a;)f.className&&typeof f.className=="string"&&f.className.split(/\s+/).forEach(m=>{if(m.length>1){const c=m.replace(/[_][a-zA-Z0-9]{5,}.*$/,"").toLowerCase();c.length>1&&i.add(c)}}),f=f.parentElement,_++;return i}function L_(r,a){const i=N_(r);for(const f of a){if(f===i)return!0;const _=i.split("-").filter(c=>c.length>2),m=f.split("-").filter(c=>c.length>2);for(const c of _)for(const w of m)if(c===w||c.includes(w)||w.includes(c))return!0}return!1}function T_(r,a,i,f){if(i.filter)return i.filter(r,a);switch(i.mode){case"all":return!0;case"filtered":return!(i.skipExact.has(r)||i.skipPatterns.some(_=>_.test(r)));case"smart":return i.skipExact.has(r)||i.skipPatterns.some(_=>_.test(r))?!1:!!(f&&L_(r,f)||i.userPatterns.some(_=>_.test(r)));default:return!0}}var Ar=null,I_=new WeakMap;function Ga(r){return Object.keys(r).some(a=>a.startsWith("__reactFiber$")||a.startsWith("__reactInternalInstance$")||a.startsWith("__reactProps$"))}function R_(){if(Ar!==null)return Ar;if(typeof document>"u")return!1;if(document.body&&Ga(document.body))return Ar=!0,!0;const r=["#root","#app","#__next","[data-reactroot]"];for(const a of r){const i=document.querySelector(a);if(i&&Ga(i))return Ar=!0,!0}if(document.body){for(const a of document.body.children)if(Ga(a))return Ar=!0,!0}return Ar=!1,!1}var Rl={map:I_};function $_(r){return Object.keys(r).find(i=>i.startsWith("__reactFiber$")||i.startsWith("__reactInternalInstance$"))||null}function M_(r){const a=$_(r);return a?r[a]:null}function er(r){return r?r.displayName?r.displayName:r.name?r.name:null:null}function z_(r){var _;const{tag:a,type:i,elementType:f}=r;if(a===Ve.HostComponent||a===Ve.HostText||a===Ve.HostHoistable||a===Ve.HostSingleton||a===Ve.Fragment||a===Ve.Mode||a===Ve.Profiler||a===Ve.DehydratedFragment||a===Ve.HostRoot||a===Ve.HostPortal||a===Ve.ScopeComponent||a===Ve.OffscreenComponent||a===Ve.LegacyHiddenComponent||a===Ve.CacheComponent||a===Ve.TracingMarkerComponent||a===Ve.Throw||a===Ve.ViewTransitionComponent||a===Ve.ActivityComponent)return null;if(a===Ve.ForwardRef){const m=f;if(m!=null&&m.render){const c=er(m.render);if(c)return c}return m!=null&&m.displayName?m.displayName:er(i)}if(a===Ve.MemoComponent||a===Ve.SimpleMemoComponent){const m=f;if(m!=null&&m.type){const c=er(m.type);if(c)return c}return m!=null&&m.displayName?m.displayName:er(i)}if(a===Ve.ContextProvider){const m=i;return(_=m==null?void 0:m._context)!=null&&_.displayName?`${m._context.displayName}.Provider`:null}if(a===Ve.ContextConsumer){const m=i;return m!=null&&m.displayName?`${m.displayName}.Consumer`:null}if(a===Ve.LazyComponent){const m=f;return(m==null?void 0:m._status)===1&&m._result?er(m._result):null}return a===Ve.SuspenseComponent||a===Ve.SuspenseListComponent?null:a===Ve.IncompleteClassComponent||a===Ve.IncompleteFunctionComponent||a===Ve.FunctionComponent||a===Ve.ClassComponent||a===Ve.IndeterminateComponent?er(i):null}function O_(r){return r.length<=2||r.length<=3&&r===r.toLowerCase()}function D_(r,a){const i=E_(a),f=i.mode==="all";if(f){const C=Rl.map.get(r);if(C!==void 0)return C}if(!R_()){const C={path:null,components:[]};return f&&Rl.map.set(r,C),C}const _=i.mode==="smart"?P_(r):void 0,m=[];try{let C=M_(r),H=0;for(;C&&H<i.maxDepth&&m.length<i.maxComponents;){const R=z_(C);R&&!O_(R)&&T_(R,H,i,_)&&m.push(R),C=C.return,H++}}catch{const C={path:null,components:[]};return f&&Rl.map.set(r,C),C}if(m.length===0){const C={path:null,components:[]};return f&&Rl.map.set(r,C),C}const w={path:m.slice().reverse().map(C=>`<${C}>`).join(" "),components:m};return f&&Rl.map.set(r,w),w}var $l={FunctionComponent:0,IndeterminateComponent:2,ForwardRef:11,MemoComponent:14,SimpleMemoComponent:15};function F_(r){if(!r||typeof r!="object")return null;const a=Object.keys(r),i=a.find(m=>m.startsWith("__reactFiber$"));if(i)return r[i]||null;const f=a.find(m=>m.startsWith("__reactInternalInstance$"));if(f)return r[f]||null;const _=a.find(m=>{if(!m.startsWith("__react"))return!1;const c=r[m];return c&&typeof c=="object"&&"_debugSource"in c});return _&&r[_]||null}function Ol(r){if(!r.type||typeof r.type=="string")return null;if(typeof r.type=="object"||typeof r.type=="function"){const a=r.type;if(a.displayName)return a.displayName;if(a.name)return a.name}return null}function B_(r,a=50){var _;let i=r,f=0;for(;i&&f<a;){if(i._debugSource)return{source:i._debugSource,componentName:Ol(i)};if((_=i._debugOwner)!=null&&_._debugSource)return{source:i._debugOwner._debugSource,componentName:Ol(i._debugOwner)};i=i.return,f++}return null}function A_(r){let a=r,i=0;const f=50;for(;a&&i<f;){const _=a,m=["_debugSource","__source","_source","debugSource"];for(const c of m){const w=_[c];if(w&&typeof w=="object"&&"fileName"in w)return{source:w,componentName:Ol(a)}}if(a.memoizedProps){const c=a.memoizedProps;if(c.__source&&typeof c.__source=="object"){const w=c.__source;if(w.fileName&&w.lineNumber)return{source:{fileName:w.fileName,lineNumber:w.lineNumber,columnNumber:w.columnNumber},componentName:Ol(a)}}}a=a.return,i++}return null}var qs=new Map;function W_(r){var _;const a=r.tag,i=r.type,f=r.elementType;if(typeof i=="string"||i==null||typeof i=="function"&&((_=i.prototype)!=null&&_.isReactComponent))return null;if((a===$l.FunctionComponent||a===$l.IndeterminateComponent)&&typeof i=="function")return i;if(a===$l.ForwardRef&&f){const m=f.render;if(typeof m=="function")return m}if((a===$l.MemoComponent||a===$l.SimpleMemoComponent)&&f){const m=f.type;if(typeof m=="function")return m}return typeof i=="function"?i:null}function Y_(){const r=Zd,a=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;if(a&&"H"in a)return{get:()=>a.H,set:f=>{a.H=f}};const i=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;if(i){const f=i.ReactCurrentDispatcher;if(f&&"current"in f)return{get:()=>f.current,set:_=>{f.current=_}}}return null}function H_(r){const a=r.split(`
`),i=[/source-location/,/\/dist\/index\./,/node_modules\//,/react-dom/,/react\.development/,/react\.production/,/chunk-[A-Z0-9]+/i,/react-stack-bottom-frame/,/react-reconciler/,/scheduler/,/<anonymous>/],f=/^\s*at\s+(?:.*?\s+\()?(.+?):(\d+):(\d+)\)?$/,_=/^[^@]*@(.+?):(\d+):(\d+)$/;for(const m of a){const c=m.trim();if(!c||i.some(C=>C.test(c)))continue;const w=f.exec(c)||_.exec(c);if(w)return{fileName:w[1],line:parseInt(w[2],10),column:parseInt(w[3],10)}}return null}function U_(r){let a=r;return a=a.replace(/[?#].*$/,""),a=a.replace(/^turbopack:\/\/\/\[project\]\//,""),a=a.replace(/^webpack-internal:\/\/\/\.\//,""),a=a.replace(/^webpack-internal:\/\/\//,""),a=a.replace(/^webpack:\/\/\/\.\//,""),a=a.replace(/^webpack:\/\/\//,""),a=a.replace(/^turbopack:\/\/\//,""),a=a.replace(/^https?:\/\/[^/]+\//,""),a=a.replace(/^file:\/\/\//,"/"),a=a.replace(/^\([^)]+\)\/\.\//,""),a=a.replace(/^\.\//,""),a}function X_(r){const a=W_(r);if(!a)return null;if(qs.has(a))return qs.get(a);const i=Y_();if(!i)return qs.set(a,null),null;const f=i.get();let _=null;try{const m=new Proxy({},{get(){throw new Error("probe")}});i.set(m);try{a({})}catch(c){if(c instanceof Error&&c.message==="probe"&&c.stack){const w=H_(c.stack);w&&(_={fileName:U_(w.fileName),lineNumber:w.line,columnNumber:w.column,componentName:Ol(r)||void 0})}}}finally{i.set(f)}return qs.set(a,_),_}function V_(r,a=15){let i=r,f=0;for(;i&&f<a;){const _=X_(i);if(_)return _;i=i.return,f++}return null}function tu(r){const a=F_(r);if(!a)return{found:!1,reason:"no-fiber",isReactApp:!1,isProduction:!1};let i=B_(a);if(i||(i=A_(a)),i!=null&&i.source)return{found:!0,source:{fileName:i.source.fileName,lineNumber:i.source.lineNumber,columnNumber:i.source.columnNumber,componentName:i.componentName||void 0},isReactApp:!0,isProduction:!1};const f=V_(a);return f?{found:!0,source:f,isReactApp:!0,isProduction:!1}:{found:!1,reason:"no-debug-source",isReactApp:!0,isProduction:!1}}function Q_(r,a="path"){const{fileName:i,lineNumber:f,columnNumber:_}=r;let m=`${i}:${f}`;return _!==void 0&&(m+=`:${_}`),a==="vscode"?`vscode://file${i.startsWith("/")?"":"/"}${m}`:m}function G_(r,a=10){let i=r,f=0;for(;i&&f<a;){const _=tu(i);if(_.found)return _;i=i.parentElement,f++}return tu(r)}var K_=`svg[fill=none] {
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
}`,Z_={toolbar:"styles-module__toolbar___wNsdK",toolbarContainer:"styles-module__toolbarContainer___dIhma",dragging:"styles-module__dragging___xrolZ",entrance:"styles-module__entrance___sgHd8",toolbarEnter:"styles-module__toolbarEnter___u8RRu",hiding:"styles-module__hiding___1td44",toolbarHide:"styles-module__toolbarHide___y8kaT",collapsed:"styles-module__collapsed___Rydsn",expanded:"styles-module__expanded___ofKPx",serverConnected:"styles-module__serverConnected___Gfbou",toggleContent:"styles-module__toggleContent___0yfyP",visible:"styles-module__visible___KHwEW",hidden:"styles-module__hidden___Ae8H4",controlsContent:"styles-module__controlsContent___9GJWU",badge:"styles-module__badge___2XsgF",fadeOut:"styles-module__fadeOut___6Ut6-",badgeEnter:"styles-module__badgeEnter___mVQLj",controlButton:"styles-module__controlButton___8Q0jc",statusShowing:"styles-module__statusShowing___te6iu",buttonBadge:"styles-module__buttonBadge___NeFWb",light:"styles-module__light___r6n4Y",mcpIndicator:"styles-module__mcpIndicator___zGJeL",connected:"styles-module__connected___7c28g",mcpIndicatorPulseConnected:"styles-module__mcpIndicatorPulseConnected___EDodZ",connecting:"styles-module__connecting___uo-CW",mcpIndicatorPulseConnecting:"styles-module__mcpIndicatorPulseConnecting___cCYte",connectionIndicatorWrapper:"styles-module__connectionIndicatorWrapper___L-e-3",connectionIndicator:"styles-module__connectionIndicator___afk9p",connectionIndicatorVisible:"styles-module__connectionIndicatorVisible___C-i5B",connectionIndicatorConnected:"styles-module__connectionIndicatorConnected___IY8pR",connectionPulse:"styles-module__connectionPulse___-Zycw",connectionIndicatorDisconnected:"styles-module__connectionIndicatorDisconnected___kmpaZ",connectionIndicatorConnecting:"styles-module__connectionIndicatorConnecting___QmSLH",buttonWrapper:"styles-module__buttonWrapper___rBcdv",buttonTooltip:"styles-module__buttonTooltip___Burd9",tooltipsInSession:"styles-module__tooltipsInSession___-0lHH",sendButtonWrapper:"styles-module__sendButtonWrapper___UUxG6",sendButtonVisible:"styles-module__sendButtonVisible___WPSQU",shortcut:"styles-module__shortcut___lEAQk",tooltipBelow:"styles-module__tooltipBelow___m6ats",tooltipsHidden:"styles-module__tooltipsHidden___VtLJG",tooltipVisible:"styles-module__tooltipVisible___0jcCv",buttonWrapperAlignLeft:"styles-module__buttonWrapperAlignLeft___myzIp",buttonWrapperAlignRight:"styles-module__buttonWrapperAlignRight___HCQFR",divider:"styles-module__divider___c--s1",overlay:"styles-module__overlay___Q1O9y",hoverHighlight:"styles-module__hoverHighlight___ogakW",enter:"styles-module__enter___WFIki",hoverHighlightIn:"styles-module__hoverHighlightIn___6WYHY",multiSelectOutline:"styles-module__multiSelectOutline___cSJ-m",fadeIn:"styles-module__fadeIn___b9qmf",exit:"styles-module__exit___fyOJ0",singleSelectOutline:"styles-module__singleSelectOutline___QhX-O",hoverTooltip:"styles-module__hoverTooltip___bvLk7",hoverTooltipIn:"styles-module__hoverTooltipIn___FYGQx",hoverReactPath:"styles-module__hoverReactPath___gx1IJ",hoverElementName:"styles-module__hoverElementName___QMLMl",markersLayer:"styles-module__markersLayer___-25j1",fixedMarkersLayer:"styles-module__fixedMarkersLayer___ffyX6",marker:"styles-module__marker___6sQrs",clearing:"styles-module__clearing___FQ--7",markerIn:"styles-module__markerIn___5FaAP",markerOut:"styles-module__markerOut___GU5jX",pending:"styles-module__pending___2IHLC",fixed:"styles-module__fixed___dBMHC",multiSelect:"styles-module__multiSelect___YWiuz",hovered:"styles-module__hovered___ZgXIy",renumber:"styles-module__renumber___nCTxD",renumberRoll:"styles-module__renumberRoll___Wgbq3",markerTooltip:"styles-module__markerTooltip___aLJID",tooltipIn:"styles-module__tooltipIn___0N31w",markerQuote:"styles-module__markerQuote___FHmrz",markerNote:"styles-module__markerNote___QkrrS",markerHint:"styles-module__markerHint___2iF-6",settingsPanel:"styles-module__settingsPanel___OxX3Y",settingsHeader:"styles-module__settingsHeader___pwDY9",settingsBrand:"styles-module__settingsBrand___0gJeM",settingsBrandSlash:"styles-module__settingsBrandSlash___uTG18",settingsVersion:"styles-module__settingsVersion___TUcFq",settingsSection:"styles-module__settingsSection___m-YM2",settingsLabel:"styles-module__settingsLabel___8UjfX",cycleButton:"styles-module__cycleButton___FMKfw",cycleDot:"styles-module__cycleDot___nPgLY",dropdownButton:"styles-module__dropdownButton___16NPz",toggleLabel:"styles-module__toggleLabel___Xm8Aa",customCheckbox:"styles-module__customCheckbox___U39ax",sliderLabel:"styles-module__sliderLabel___U8sPr",slider:"styles-module__slider___GLdxp",helpIcon:"styles-module__helpIcon___xQg56",themeToggle:"styles-module__themeToggle___2rUjA",dark:"styles-module__dark___ILIQf",settingsOption:"styles-module__settingsOption___UNa12",selected:"styles-module__selected___OwRqP",settingsPanelContainer:"styles-module__settingsPanelContainer___Xksv8",transitioning:"styles-module__transitioning___qxzCk",settingsPage:"styles-module__settingsPage___6YfHH",slideLeft:"styles-module__slideLeft___Ps01J",automationsPage:"styles-module__automationsPage___uvCq6",slideIn:"styles-module__slideIn___4-qXe",settingsNavLink:"styles-module__settingsNavLink___wCzJt",settingsNavLinkRight:"styles-module__settingsNavLinkRight___ZWwhj",mcpNavIndicator:"styles-module__mcpNavIndicator___cl9pO",mcpPulse:"styles-module__mcpPulse___uNggr",settingsBackButton:"styles-module__settingsBackButton___bIe2j",automationHeader:"styles-module__automationHeader___InP0r",automationDescription:"styles-module__automationDescription___NKlmo",learnMoreLink:"styles-module__learnMoreLink___8xv-x",autoSendRow:"styles-module__autoSendRow___UblX5",autoSendLabel:"styles-module__autoSendLabel___icDc2",active:"styles-module__active___-zoN6",webhookUrlInput:"styles-module__webhookUrlInput___2375C",settingsSectionExtraPadding:"styles-module__settingsSectionExtraPadding___jdhFV",settingsSectionGrow:"styles-module__settingsSectionGrow___h-5HZ",settingsRow:"styles-module__settingsRow___3sdhc",settingsRowMarginTop:"styles-module__settingsRowMarginTop___zA0Sp",dropdownContainer:"styles-module__dropdownContainer___BVnxe",settingsRowDisabled:"styles-module__settingsRowDisabled___EgS0V",toggleSwitch:"styles-module__toggleSwitch___l4Ygm",cycleButtonText:"styles-module__cycleButtonText___fD1LR",cycleTextIn:"styles-module__cycleTextIn___Q6zJf",cycleDots:"styles-module__cycleDots___LWuoQ",dropdownMenu:"styles-module__dropdownMenu___k73ER",scaleIn:"styles-module__scaleIn___c-r1K",dropdownItem:"styles-module__dropdownItem___ylsLj",settingsLabelMarker:"styles-module__settingsLabelMarker___ewdtV",settingsOptions:"styles-module__settingsOptions___LyrBA",sliderContainer:"styles-module__sliderContainer___ducXj",sliderLabels:"styles-module__sliderLabels___FhLDB",colorOptions:"styles-module__colorOptions___iHCNX",colorOption:"styles-module__colorOption___IodiY",colorOptionRing:"styles-module__colorOptionRing___U2xpo",settingsToggle:"styles-module__settingsToggle___fBrFn",settingsToggleMarginBottom:"styles-module__settingsToggleMarginBottom___MZUyF",checked:"styles-module__checked___mnZLo",toggleSlider:"styles-module__toggleSlider___wprIn",disabled:"styles-module__disabled___332Jw",mcpStatusDot:"styles-module__mcpStatusDot___ibgkc",disconnected:"styles-module__disconnected___cHPxR",mcpPulseError:"styles-module__mcpPulseError___fov9B",helpIconNudgeDown:"styles-module__helpIconNudgeDown___0cqpM",helpIconNoNudge:"styles-module__helpIconNoNudge___abogC","helpIconNudge1-5":"styles-module__helpIconNudge1-5___DM2TQ",helpIconNudge2:"styles-module__helpIconNudge2___TfWgC",dragSelection:"styles-module__dragSelection___kZLq2",dragCount:"styles-module__dragCount___KM90j",highlightsContainer:"styles-module__highlightsContainer___-0xzG",selectedElementHighlight:"styles-module__selectedElementHighlight___fyVlI",themeIconWrapper:"styles-module__themeIconWrapper___LsJIM",themeIcon:"styles-module__themeIcon___lCCmo",themeIconIn:"styles-module__themeIconIn___TU6ML",scaleOut:"styles-module__scaleOut___Wctwz",slideUp:"styles-module__slideUp___kgD36",slideDown:"styles-module__slideDown___zcdje",settingsPanelIn:"styles-module__settingsPanelIn___MGfO8",settingsPanelOut:"styles-module__settingsPanelOut___Zfymi"};if(typeof document<"u"){let r=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");r||(r=document.createElement("style"),r.id="feedback-tool-styles-page-toolbar-css-styles",r.textContent=K_,document.head.appendChild(r))}var y=Z_;function Ka(r,a="filtered"){const{name:i,path:f}=ri(r);if(a==="off")return{name:i,elementName:i,path:f,reactComponents:null};const _=D_(r,{mode:a});return{name:_.path?`${_.path} ${i}`:i,elementName:i,path:f,reactComponents:_.path}}var Vd=!1,Qd={outputDetail:"standard",autoClearAfterCopy:!1,annotationColor:"#3c82f7",blockInteractions:!0,reactEnabled:!0,markerClickBehavior:"edit",webhookUrl:"",webhooksEnabled:!0},Bn=r=>{if(!r||!r.trim())return!1;try{const a=new URL(r.trim());return a.protocol==="http:"||a.protocol==="https:"}catch{return!1}},Ml=[{value:"compact",label:"Compact"},{value:"standard",label:"Standard"},{value:"detailed",label:"Detailed"},{value:"forensic",label:"Forensic"}],J_=[{value:"#AF52DE",label:"Purple"},{value:"#3c82f7",label:"Blue"},{value:"#5AC8FA",label:"Cyan"},{value:"#34C759",label:"Green"},{value:"#FFD60A",label:"Yellow"},{value:"#FF9500",label:"Orange"},{value:"#FF3B30",label:"Red"}];function Wr(r,a){let i=document.elementFromPoint(r,a);if(!i)return null;for(;i!=null&&i.shadowRoot;){const f=i.shadowRoot.elementFromPoint(r,a);if(!f||f===i)break;i=f}return i}function Za(r){let a=r;for(;a&&a!==document.body;){const f=window.getComputedStyle(a).position;if(f==="fixed"||f==="sticky")return!0;a=a.parentElement}return!1}function Eo(r){return r.status!=="resolved"&&r.status!=="dismissed"}function ei(r){const a=tu(r),i=a.found?a:G_(r);if(i.found&&i.source)return Q_(i.source,"path")}function Gd(r,a,i="standard",f="filtered"){if(r.length===0)return"";const _=typeof window<"u"?`${window.innerWidth}×${window.innerHeight}`:"unknown";let m=`## Page Feedback: ${a}
`;return i==="forensic"?(m+=`
**Environment:**
`,m+=`- Viewport: ${_}
`,typeof window<"u"&&(m+=`- URL: ${window.location.href}
`,m+=`- User Agent: ${navigator.userAgent}
`,m+=`- Timestamp: ${new Date().toISOString()}
`,m+=`- Device Pixel Ratio: ${window.devicePixelRatio}
`),m+=`
---
`):i!=="compact"&&(m+=`**Viewport:** ${_}
`),m+=`
`,r.forEach((c,w)=>{i==="compact"?(m+=`${w+1}. **${c.element}**${c.sourceFile?` (${c.sourceFile})`:""}: ${c.comment}`,c.selectedText&&(m+=` (re: "${c.selectedText.slice(0,30)}${c.selectedText.length>30?"...":""}")`),m+=`
`):i==="forensic"?(m+=`### ${w+1}. ${c.element}
`,c.isMultiSelect&&c.fullPath&&(m+=`*Forensic data shown for first element of selection*
`),c.fullPath&&(m+=`**Full DOM Path:** ${c.fullPath}
`),c.cssClasses&&(m+=`**CSS Classes:** ${c.cssClasses}
`),c.boundingBox&&(m+=`**Position:** x:${Math.round(c.boundingBox.x)}, y:${Math.round(c.boundingBox.y)} (${Math.round(c.boundingBox.width)}×${Math.round(c.boundingBox.height)}px)
`),m+=`**Annotation at:** ${c.x.toFixed(1)}% from left, ${Math.round(c.y)}px from top
`,c.selectedText&&(m+=`**Selected text:** "${c.selectedText}"
`),c.nearbyText&&!c.selectedText&&(m+=`**Context:** ${c.nearbyText.slice(0,100)}
`),c.computedStyles&&(m+=`**Computed Styles:** ${c.computedStyles}
`),c.accessibility&&(m+=`**Accessibility:** ${c.accessibility}
`),c.nearbyElements&&(m+=`**Nearby Elements:** ${c.nearbyElements}
`),c.sourceFile&&(m+=`**Source:** ${c.sourceFile}
`),c.reactComponents&&(m+=`**React:** ${c.reactComponents}
`),m+=`**Feedback:** ${c.comment}

`):(m+=`### ${w+1}. ${c.element}
`,m+=`**Location:** ${c.elementPath}
`,c.sourceFile&&(m+=`**Source:** ${c.sourceFile}
`),c.reactComponents&&(m+=`**React:** ${c.reactComponents}
`),i==="detailed"&&(c.cssClasses&&(m+=`**Classes:** ${c.cssClasses}
`),c.boundingBox&&(m+=`**Position:** ${Math.round(c.boundingBox.x)}px, ${Math.round(c.boundingBox.y)}px (${Math.round(c.boundingBox.width)}×${Math.round(c.boundingBox.height)}px)
`)),c.selectedText&&(m+=`**Selected text:** "${c.selectedText}"
`),i==="detailed"&&c.nearbyText&&!c.selectedText&&(m+=`**Context:** ${c.nearbyText.slice(0,100)}
`),m+=`**Feedback:** ${c.comment}

`)}),m.trim()}function q_({demoAnnotations:r,demoDelay:a=1e3,enableDemoMode:i=!1,onAnnotationAdd:f,onAnnotationDelete:_,onAnnotationUpdate:m,onAnnotationsClear:c,onCopy:w,onSubmit:C,copyToClipboard:H=!0,endpoint:R,sessionId:x,onSessionCreated:p,webhookUrl:v,className:F}={}){var Gn,Ao,Zl;const[I,N]=S.useState(!1),[D,Y]=S.useState([]),[T,A]=S.useState(!0),[g,Q]=S.useState(()=>k_()),[ue,te]=S.useState(!1),ae=S.useRef(null);S.useEffect(()=>{const h=W=>{const X=ae.current;X&&X.contains(W.target)&&W.stopPropagation()},k=["mousedown","click","pointerdown"];return k.forEach(W=>document.body.addEventListener(W,h)),()=>{k.forEach(W=>document.body.removeEventListener(W,h))}},[]);const[Te,le]=S.useState(!1),[fe,L]=S.useState(!1),[z,ne]=S.useState(null),[se,ce]=S.useState({x:0,y:0}),[$,Z]=S.useState(null),[re,P]=S.useState(!1),[U,Ne]=S.useState("idle"),[ze,Be]=S.useState(!1),[Ae,Ke]=S.useState(!1),[Ye,Ze]=S.useState(null),[jt,an]=S.useState(null),[Ur,En]=S.useState([]),[tr,Xr]=S.useState(null),[No,nr]=S.useState(null),[Re,An]=S.useState(null),[Wn,Tt]=S.useState(null),[or,Nn]=S.useState([]),[Pn,Vr]=S.useState(0),[Qr,rr]=S.useState(!1),[tt,Fl]=S.useState(!1),[Et,lo]=S.useState(!1),[Po,lr]=S.useState(!1),[Bl,Al]=S.useState(!1),[Lo,To]=S.useState("main"),[sr,ir]=S.useState(!1),[Gr,Ln]=S.useState(!1),[Yn,Kr]=S.useState(!1),Hn=S.useRef(null),[ut,Un]=S.useState([]),qt=S.useRef({cmd:!1,shift:!1}),wt=()=>{Ln(!0)},Wl=()=>{Ln(!1)},Io=()=>{Yn||(Hn.current=setTimeout(()=>Kr(!0),850))},Zr=()=>{Hn.current&&(clearTimeout(Hn.current),Hn.current=null),Kr(!1),Wl()};S.useEffect(()=>()=>{Hn.current&&clearTimeout(Hn.current)},[]);const un=({content:h,children:k})=>{const[W,X]=S.useState(!1),[V,G]=S.useState(!1),[he,_e]=S.useState(!1),[be,Pe]=S.useState({top:0,right:0}),we=S.useRef(null),Ee=S.useRef(null),ke=S.useRef(null),je=()=>{if(we.current){const gt=we.current.getBoundingClientRect();Pe({top:gt.top+gt.height/2,right:window.innerWidth-gt.left+8})}},ge=()=>{X(!0),_e(!0),ke.current&&(clearTimeout(ke.current),ke.current=null),je(),Ee.current=He(()=>{G(!0)},500)},ht=()=>{X(!1),Ee.current&&(clearTimeout(Ee.current),Ee.current=null),G(!1),ke.current=He(()=>{_e(!1)},150)};return S.useEffect(()=>()=>{Ee.current&&clearTimeout(Ee.current),ke.current&&clearTimeout(ke.current)},[]),l.jsxs(l.Fragment,{children:[l.jsx("span",{ref:we,onMouseEnter:ge,onMouseLeave:ht,children:k}),he&&Dd.createPortal(l.jsx("div",{"data-feedback-toolbar":!0,style:{position:"fixed",top:be.top,right:be.right,transform:"translateY(-50%)",padding:"6px 10px",background:"#383838",color:"rgba(255, 255, 255, 0.7)",fontSize:"11px",fontWeight:400,lineHeight:"14px",borderRadius:"10px",width:"180px",textAlign:"left",zIndex:100020,pointerEvents:"none",boxShadow:"0px 1px 8px rgba(0, 0, 0, 0.28)",opacity:V&&!sr?1:0,transition:"opacity 0.15s ease"},children:h}),document.body)]})},[de,Yt]=S.useState(Qd),[Ie,Ro]=S.useState(!0),[ar,Yl]=S.useState(!1),Hl=!1,gn="off",[pt,ur]=S.useState(x??null),Jr=S.useRef(!1),[Nt,Tn]=S.useState(R?"connecting":"disconnected"),[Qe,cr]=S.useState(null),[cn,Ul]=S.useState(!1),[so,rt]=S.useState(null),[ii,qr]=S.useState(0),dr=S.useRef(!1),[$o,Mo]=S.useState(new Set),[el,Xn]=S.useState(new Set),[It,fr]=S.useState(!1),[en,io]=S.useState(!1),[yn,Xl]=S.useState(!1),xn=S.useRef(null),Dt=S.useRef(null),vn=S.useRef(null),In=S.useRef(null),mr=S.useRef(!1),Vl=S.useRef(0),ao=S.useRef(null),tl=S.useRef(null),zo=8,Oo=50,Ql=S.useRef(null),pr=S.useRef(null),We=S.useRef(null),Ge=typeof window<"u"?window.location.pathname:"/";S.useEffect(()=>{if(Po)Al(!0);else{Ln(!1),To("main");const h=He(()=>Al(!1),0);return()=>clearTimeout(h)}},[Po]),S.useEffect(()=>{ir(!0);const h=He(()=>ir(!1),350);return()=>clearTimeout(h)},[Lo]);const nl=I&&T;S.useEffect(()=>{if(nl){L(!1),le(!0),Mo(new Set);const h=He(()=>{Mo(k=>{const W=new Set(k);return D.forEach(X=>W.add(X.id)),W})},350);return()=>clearTimeout(h)}else if(Te){L(!0);const h=He(()=>{le(!1),L(!1)},250);return()=>clearTimeout(h)}},[nl]),S.useEffect(()=>{Fl(!0),Vr(window.scrollY);const h=Xa(Ge);Y(h.filter(Eo)),Vd||(Yl(!0),Vd=!0,He(()=>Yl(!1),750));try{const k=localStorage.getItem("feedback-toolbar-settings");k&&Yt({...Qd,...JSON.parse(k)})}catch{}try{const k=localStorage.getItem("feedback-toolbar-theme");k!==null&&Ro(k==="dark")}catch{}try{const k=localStorage.getItem("feedback-toolbar-position");if(k){const W=JSON.parse(k);typeof W.x=="number"&&typeof W.y=="number"&&cr(W)}}catch{}},[Ge]),S.useEffect(()=>{tt&&localStorage.setItem("feedback-toolbar-settings",JSON.stringify(de))},[de,tt]),S.useEffect(()=>{tt&&localStorage.setItem("feedback-toolbar-theme",Ie?"dark":"light")},[Ie,tt]);const _r=S.useRef(!1);S.useEffect(()=>{const h=_r.current;_r.current=cn,h&&!cn&&Qe&&tt&&localStorage.setItem("feedback-toolbar-position",JSON.stringify(Qe))},[cn,Qe,tt]),S.useEffect(()=>{if(!R||!tt||Jr.current)return;Jr.current=!0,Tn("connecting"),(async()=>{try{const k=b_(Ge),W=x||k;let X=!1;if(W)try{const V=await Yd(R,W);ur(V.id),Tn("connected"),Va(Ge,V.id),X=!0;const G=Xa(Ge),he=new Set(V.annotations.map(be=>be.id)),_e=G.filter(be=>!he.has(be.id));if(_e.length>0){const Pe=`${typeof window<"u"?window.location.origin:""}${Ge}`,Ee=(await Promise.allSettled(_e.map(je=>Js(R,V.id,{...je,sessionId:V.id,url:Pe})))).map((je,ge)=>je.status==="fulfilled"?je.value:(console.warn("[Agentation] Failed to sync annotation:",je.reason),_e[ge])),ke=[...V.annotations,...Ee];Y(ke.filter(Eo)),Il(Ge,ke.filter(Eo),V.id)}else Y(V.annotations.filter(Eo)),Il(Ge,V.annotations.filter(Eo),V.id)}catch(V){console.warn("[Agentation] Could not join session, creating new:",V),w_(Ge)}if(!X){const V=typeof window<"u"?window.location.href:"/",G=await Qa(R,V);ur(G.id),Tn("connected"),Va(Ge,G.id),p==null||p(G.id);const he=v_(),_e=typeof window<"u"?window.location.origin:"",be=[];for(const[Pe,we]of he){const Ee=we.filter(ge=>!ge._syncedTo);if(Ee.length===0)continue;const ke=`${_e}${Pe}`,je=Pe===Ge;be.push((async()=>{try{const ge=je?G:await Qa(R,ke),on=(await Promise.allSettled(Ee.map(lt=>Js(R,ge.id,{...lt,sessionId:ge.id,url:ke})))).map((lt,ft)=>lt.status==="fulfilled"?lt.value:(console.warn("[Agentation] Failed to sync annotation:",lt.reason),Ee[ft])).filter(Eo);if(Il(Pe,on,ge.id),je){const lt=new Set(Ee.map(ft=>ft.id));Y(ft=>{const $e=ft.filter(Me=>!lt.has(Me.id));return[...on,...$e]})}}catch(ge){console.warn(`[Agentation] Failed to sync annotations for ${Pe}:`,ge)}})())}await Promise.allSettled(be)}}catch(k){Tn("disconnected"),console.warn("[Agentation] Failed to initialize session, using local storage:",k)}})()},[R,x,tt,p,Ge]),S.useEffect(()=>{if(!R||!tt)return;const h=async()=>{try{(await fetch(`${R}/health`)).ok?Tn("connected"):Tn("disconnected")}catch{Tn("disconnected")}};h();const k=c_(h,1e4);return()=>clearInterval(k)},[R,tt]),S.useEffect(()=>{if(!R||!tt||!pt)return;const h=new EventSource(`${R}/sessions/${pt}/events`),k=["resolved","dismissed"],W=X=>{var V;try{const G=JSON.parse(X.data);if(k.includes((V=G.payload)==null?void 0:V.status)){const he=G.payload.id;Xn(_e=>new Set(_e).add(he)),He(()=>{Y(_e=>_e.filter(be=>be.id!==he)),Xn(_e=>{const be=new Set(_e);return be.delete(he),be})},150)}}catch{}};return h.addEventListener("annotation.updated",W),()=>{h.removeEventListener("annotation.updated",W),h.close()}},[R,tt,pt]),S.useEffect(()=>{if(!R||!tt)return;const h=tl.current==="disconnected",k=Nt==="connected";tl.current=Nt,h&&k&&(async()=>{try{const X=Xa(Ge);if(X.length===0)return;const G=`${typeof window<"u"?window.location.origin:""}${Ge}`;let he=pt,_e=[];if(he)try{_e=(await Yd(R,he)).annotations}catch{he=null}he||(he=(await Qa(R,G)).id,ur(he),Va(Ge,he));const be=new Set(_e.map(we=>we.id)),Pe=X.filter(we=>!be.has(we.id));if(Pe.length>0){const Ee=(await Promise.allSettled(Pe.map(ge=>Js(R,he,{...ge,sessionId:he,url:G})))).map((ge,ht)=>ge.status==="fulfilled"?ge.value:(console.warn("[Agentation] Failed to sync annotation on reconnect:",ge.reason),Pe[ht])),je=[..._e,...Ee].filter(Eo);Y(je),Il(Ge,je,he)}}catch(X){console.warn("[Agentation] Failed to sync on reconnect:",X)}})()},[Nt,R,tt,pt,Ge]);const Gl=S.useCallback(()=>{ue||(te(!0),lr(!1),N(!1),He(()=>{S_(!0),Q(!0),te(!1)},400))},[ue]);S.useEffect(()=>{if(!i||!tt||!r||r.length===0||D.length>0)return;const h=[];return h.push(He(()=>{N(!0)},a-200)),r.forEach((k,W)=>{const X=a+W*300;h.push(He(()=>{const V=document.querySelector(k.selector);if(!V)return;const G=V.getBoundingClientRect(),{name:he,path:_e}=ri(V),be={id:`demo-${Date.now()}-${W}`,x:(G.left+G.width/2)/window.innerWidth*100,y:G.top+G.height/2+window.scrollY,comment:k.comment,element:he,elementPath:_e,timestamp:Date.now(),selectedText:k.selectedText,boundingBox:{x:G.left,y:G.top+window.scrollY,width:G.width,height:G.height},nearbyText:Ll(V),cssClasses:Tl(V)};Y(Pe=>[...Pe,be])},X))}),()=>{h.forEach(clearTimeout)}},[i,tt,r,a]),S.useEffect(()=>{const h=()=>{Vr(window.scrollY),rr(!0),We.current&&clearTimeout(We.current),We.current=He(()=>{rr(!1)},150)};return window.addEventListener("scroll",h,{passive:!0}),()=>{window.removeEventListener("scroll",h),We.current&&clearTimeout(We.current)}},[]),S.useEffect(()=>{tt&&D.length>0?pt?Il(Ge,D,pt):ff(Ge,D):tt&&D.length===0&&localStorage.removeItem(li(Ge))},[D,Ge,tt,pt]);const ol=S.useCallback(()=>{Et||(f_(),lo(!0))},[Et]),Do=S.useCallback(()=>{Et&&(Ad(),lo(!1))},[Et]),Fo=S.useCallback(()=>{Et?Do():ol()},[Et,ol,Do]),Bo=S.useCallback(()=>{if(ut.length===0)return;const h=ut[0],k=h.element,W=ut.length>1,X=ut.map(V=>V.element.getBoundingClientRect());if(W){const V={left:Math.min(...X.map(ge=>ge.left)),top:Math.min(...X.map(ge=>ge.top)),right:Math.max(...X.map(ge=>ge.right)),bottom:Math.max(...X.map(ge=>ge.bottom))},G=ut.slice(0,5).map(ge=>ge.name).join(", "),he=ut.length>5?` +${ut.length-5} more`:"",_e=X.map(ge=>({x:ge.left,y:ge.top+window.scrollY,width:ge.width,height:ge.height})),Pe=ut[ut.length-1].element,we=X[X.length-1],Ee=we.left+we.width/2,ke=we.top+we.height/2,je=Za(Pe);Z({x:Ee/window.innerWidth*100,y:je?ke:ke+window.scrollY,clientY:ke,element:`${ut.length} elements: ${G}${he}`,elementPath:"multi-select",boundingBox:{x:V.left,y:V.top+window.scrollY,width:V.right-V.left,height:V.bottom-V.top},isMultiSelect:!0,isFixed:je,elementBoundingBoxes:_e,multiSelectElements:ut.map(ge=>ge.element),targetElement:Pe,fullPath:Zs(k),accessibility:Ks(k),computedStyles:Gs(k),computedStylesObj:Qs(k),nearbyElements:Vs(k),cssClasses:Tl(k),nearbyText:Ll(k),sourceFile:ei(k)})}else{const V=X[0],G=Za(k);Z({x:V.left/window.innerWidth*100,y:G?V.top:V.top+window.scrollY,clientY:V.top,element:h.name,elementPath:h.path,boundingBox:{x:V.left,y:G?V.top:V.top+window.scrollY,width:V.width,height:V.height},isFixed:G,fullPath:Zs(k),accessibility:Ks(k),computedStyles:Gs(k),computedStylesObj:Qs(k),nearbyElements:Vs(k),cssClasses:Tl(k),nearbyText:Ll(k),reactComponents:h.reactComponents,sourceFile:ei(k)})}Un([]),ne(null)},[ut]);S.useEffect(()=>{I||(Z(null),An(null),Tt(null),Nn([]),ne(null),lr(!1),Un([]),qt.current={cmd:!1,shift:!1},Et&&Do())},[I,Et,Do]),S.useEffect(()=>()=>{Ad()},[]),S.useEffect(()=>{if(!I)return;const h=document.createElement("style");return h.id="feedback-cursor-styles",h.textContent=`
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
    `,document.head.appendChild(h),()=>{const k=document.getElementById("feedback-cursor-styles");k&&k.remove()}},[I]),S.useEffect(()=>{if(!I||$)return;const h=k=>{const W=k.composedPath()[0]||k.target;if(Jt(W,"[data-feedback-toolbar]")){ne(null);return}const X=Wr(k.clientX,k.clientY);if(!X||Jt(X,"[data-feedback-toolbar]")){ne(null);return}const{name:V,elementName:G,path:he,reactComponents:_e}=Ka(X,gn),be=X.getBoundingClientRect();ne({element:V,elementName:G,elementPath:he,rect:be,reactComponents:_e}),ce({x:k.clientX,y:k.clientY})};return document.addEventListener("mousemove",h),()=>document.removeEventListener("mousemove",h)},[I,$,gn]),S.useEffect(()=>{if(!I)return;const h=k=>{var gt,on;if(mr.current){mr.current=!1;return}const W=k.composedPath()[0]||k.target;if(Jt(W,"[data-feedback-toolbar]")||Jt(W,"[data-annotation-popup]")||Jt(W,"[data-annotation-marker]"))return;if(k.metaKey&&k.shiftKey&&!$&&!Re){k.preventDefault(),k.stopPropagation();const lt=Wr(k.clientX,k.clientY);if(!lt)return;const ft=lt.getBoundingClientRect(),{name:$e,path:Me,reactComponents:Rt}=Ka(lt,gn),st=ut.findIndex(Ht=>Ht.element===lt);st>=0?Un(Ht=>Ht.filter((Ut,xr)=>xr!==st)):Un(Ht=>[...Ht,{element:lt,rect:ft,name:$e,path:Me,reactComponents:Rt??void 0}]);return}const X=Jt(W,"button, a, input, select, textarea, [role='button'], [onclick]");if(de.blockInteractions&&X&&(k.preventDefault(),k.stopPropagation()),$){if(X&&!de.blockInteractions)return;k.preventDefault(),(gt=Ql.current)==null||gt.shake();return}if(Re){if(X&&!de.blockInteractions)return;k.preventDefault(),(on=pr.current)==null||on.shake();return}k.preventDefault();const V=Wr(k.clientX,k.clientY);if(!V)return;const{name:G,path:he,reactComponents:_e}=Ka(V,gn),be=V.getBoundingClientRect(),Pe=k.clientX/window.innerWidth*100,we=Za(V),Ee=we?k.clientY:k.clientY+window.scrollY,ke=window.getSelection();let je;ke&&ke.toString().trim().length>0&&(je=ke.toString().trim().slice(0,500));const ge=Qs(V),ht=Gs(V);Z({x:Pe,y:Ee,clientY:k.clientY,element:G,elementPath:he,selectedText:je,boundingBox:{x:be.left,y:we?be.top:be.top+window.scrollY,width:be.width,height:be.height},nearbyText:Ll(V),cssClasses:Tl(V),isFixed:we,fullPath:Zs(V),accessibility:Ks(V),computedStyles:ht,computedStylesObj:ge,nearbyElements:Vs(V),reactComponents:_e??void 0,sourceFile:ei(V),targetElement:V}),ne(null)};return document.addEventListener("click",h,!0),()=>document.removeEventListener("click",h,!0)},[I,$,Re,de.blockInteractions,gn,ut]),S.useEffect(()=>{if(!I)return;const h=X=>{X.key==="Meta"&&(qt.current.cmd=!0),X.key==="Shift"&&(qt.current.shift=!0)},k=X=>{const V=qt.current.cmd&&qt.current.shift;X.key==="Meta"&&(qt.current.cmd=!1),X.key==="Shift"&&(qt.current.shift=!1);const G=qt.current.cmd&&qt.current.shift;V&&!G&&ut.length>0&&Bo()},W=()=>{qt.current={cmd:!1,shift:!1},Un([])};return document.addEventListener("keydown",h),document.addEventListener("keyup",k),window.addEventListener("blur",W),()=>{document.removeEventListener("keydown",h),document.removeEventListener("keyup",k),window.removeEventListener("blur",W)}},[I,ut,Bo]),S.useEffect(()=>{if(!I||$)return;const h=k=>{const W=k.composedPath()[0]||k.target;Jt(W,"[data-feedback-toolbar]")||Jt(W,"[data-annotation-marker]")||Jt(W,"[data-annotation-popup]")||new Set(["P","SPAN","H1","H2","H3","H4","H5","H6","LI","TD","TH","LABEL","BLOCKQUOTE","FIGCAPTION","CAPTION","LEGEND","DT","DD","PRE","CODE","EM","STRONG","B","I","U","S","A","TIME","ADDRESS","CITE","Q","ABBR","DFN","MARK","SMALL","SUB","SUP"]).has(W.tagName)||W.isContentEditable||(xn.current={x:k.clientX,y:k.clientY})};return document.addEventListener("mousedown",h),()=>document.removeEventListener("mousedown",h)},[I,$]),S.useEffect(()=>{if(!I||$)return;const h=k=>{if(!xn.current)return;const W=k.clientX-xn.current.x,X=k.clientY-xn.current.y,V=W*W+X*X,G=zo*zo;if(!yn&&V>=G&&(Dt.current=xn.current,Xl(!0)),(yn||V>=G)&&Dt.current){if(vn.current){const $e=Math.min(Dt.current.x,k.clientX),Me=Math.min(Dt.current.y,k.clientY),Rt=Math.abs(k.clientX-Dt.current.x),st=Math.abs(k.clientY-Dt.current.y);vn.current.style.transform=`translate(${$e}px, ${Me}px)`,vn.current.style.width=`${Rt}px`,vn.current.style.height=`${st}px`}const he=Date.now();if(he-Vl.current<Oo)return;Vl.current=he;const _e=Dt.current.x,be=Dt.current.y,Pe=Math.min(_e,k.clientX),we=Math.min(be,k.clientY),Ee=Math.max(_e,k.clientX),ke=Math.max(be,k.clientY),je=(Pe+Ee)/2,ge=(we+ke)/2,ht=new Set,gt=[[Pe,we],[Ee,we],[Pe,ke],[Ee,ke],[je,ge],[je,we],[je,ke],[Pe,ge],[Ee,ge]];for(const[$e,Me]of gt){const Rt=document.elementsFromPoint($e,Me);for(const st of Rt)st instanceof HTMLElement&&ht.add(st)}const on=document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav");for(const $e of on)if($e instanceof HTMLElement){const Me=$e.getBoundingClientRect(),Rt=Me.left+Me.width/2,st=Me.top+Me.height/2,Ht=Rt>=Pe&&Rt<=Ee&&st>=we&&st<=ke,Ut=Math.min(Me.right,Ee)-Math.max(Me.left,Pe),xr=Math.min(Me.bottom,ke)-Math.max(Me.top,we),ui=Ut>0&&xr>0?Ut*xr:0,Jl=Me.width*Me.height,ci=Jl>0?ui/Jl:0;(Ht||ci>.5)&&ht.add($e)}const lt=[],ft=new Set(["BUTTON","A","INPUT","IMG","P","H1","H2","H3","H4","H5","H6","LI","LABEL","TD","TH","SECTION","ARTICLE","ASIDE","NAV"]);for(const $e of ht){if(Jt($e,"[data-feedback-toolbar]")||Jt($e,"[data-annotation-marker]"))continue;const Me=$e.getBoundingClientRect();if(!(Me.width>window.innerWidth*.8&&Me.height>window.innerHeight*.5)&&!(Me.width<10||Me.height<10)&&Me.left<Ee&&Me.right>Pe&&Me.top<ke&&Me.bottom>we){const Rt=$e.tagName;let st=ft.has(Rt);if(!st&&(Rt==="DIV"||Rt==="SPAN")){const Ht=$e.textContent&&$e.textContent.trim().length>0,Ut=$e.onclick!==null||$e.getAttribute("role")==="button"||$e.getAttribute("role")==="link"||$e.classList.contains("clickable")||$e.hasAttribute("data-clickable");(Ht||Ut)&&!$e.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")&&(st=!0)}if(st){let Ht=!1;for(const Ut of lt)if(Ut.left<=Me.left&&Ut.right>=Me.right&&Ut.top<=Me.top&&Ut.bottom>=Me.bottom){Ht=!0;break}Ht||lt.push(Me)}}}if(In.current){const $e=In.current;for(;$e.children.length>lt.length;)$e.removeChild($e.lastChild);lt.forEach((Me,Rt)=>{let st=$e.children[Rt];st||(st=document.createElement("div"),st.className=y.selectedElementHighlight,$e.appendChild(st)),st.style.transform=`translate(${Me.left}px, ${Me.top}px)`,st.style.width=`${Me.width}px`,st.style.height=`${Me.height}px`})}}};return document.addEventListener("mousemove",h,{passive:!0}),()=>document.removeEventListener("mousemove",h)},[I,$,yn,zo]),S.useEffect(()=>{if(!I)return;const h=k=>{const W=yn,X=Dt.current;if(yn&&X){mr.current=!0;const V=Math.min(X.x,k.clientX),G=Math.min(X.y,k.clientY),he=Math.max(X.x,k.clientX),_e=Math.max(X.y,k.clientY),be=[];document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th").forEach(je=>{if(!(je instanceof HTMLElement)||Jt(je,"[data-feedback-toolbar]")||Jt(je,"[data-annotation-marker]"))return;const ge=je.getBoundingClientRect();ge.width>window.innerWidth*.8&&ge.height>window.innerHeight*.5||ge.width<10||ge.height<10||ge.left<he&&ge.right>V&&ge.top<_e&&ge.bottom>G&&be.push({element:je,rect:ge})});const we=be.filter(({element:je})=>!be.some(({element:ge})=>ge!==je&&je.contains(ge))),Ee=k.clientX/window.innerWidth*100,ke=k.clientY+window.scrollY;if(we.length>0){const je=we.reduce((ft,{rect:$e})=>({left:Math.min(ft.left,$e.left),top:Math.min(ft.top,$e.top),right:Math.max(ft.right,$e.right),bottom:Math.max(ft.bottom,$e.bottom)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0}),ge=we.slice(0,5).map(({element:ft})=>ri(ft).name).join(", "),ht=we.length>5?` +${we.length-5} more`:"",gt=we[0].element,on=Qs(gt),lt=Gs(gt);Z({x:Ee,y:ke,clientY:k.clientY,element:`${we.length} elements: ${ge}${ht}`,elementPath:"multi-select",boundingBox:{x:je.left,y:je.top+window.scrollY,width:je.right-je.left,height:je.bottom-je.top},isMultiSelect:!0,fullPath:Zs(gt),accessibility:Ks(gt),computedStyles:lt,computedStylesObj:on,nearbyElements:Vs(gt),cssClasses:Tl(gt),nearbyText:Ll(gt),sourceFile:ei(gt)})}else{const je=Math.abs(he-V),ge=Math.abs(_e-G);je>20&&ge>20&&Z({x:Ee,y:ke,clientY:k.clientY,element:"Area selection",elementPath:`region at (${Math.round(V)}, ${Math.round(G)})`,boundingBox:{x:V,y:G+window.scrollY,width:je,height:ge},isMultiSelect:!0})}ne(null)}else W&&(mr.current=!0);xn.current=null,Dt.current=null,Xl(!1),In.current&&(In.current.innerHTML="")};return document.addEventListener("mouseup",h),()=>document.removeEventListener("mouseup",h)},[I,yn]);const xt=S.useCallback(async(h,k,W)=>{const X=de.webhookUrl||v;if(!X||!de.webhooksEnabled&&!W)return!1;try{return(await fetch(X,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:h,timestamp:Date.now(),url:typeof window<"u"?window.location.href:void 0,...k})})).ok}catch(V){return console.warn("[Agentation] Webhook failed:",V),!1}},[v,de.webhookUrl,de.webhooksEnabled]),Rn=S.useCallback(h=>{var W;if(!$)return;const k={id:Date.now().toString(),x:$.x,y:$.y,comment:h,element:$.element,elementPath:$.elementPath,timestamp:Date.now(),selectedText:$.selectedText,boundingBox:$.boundingBox,nearbyText:$.nearbyText,cssClasses:$.cssClasses,isMultiSelect:$.isMultiSelect,isFixed:$.isFixed,fullPath:$.fullPath,accessibility:$.accessibility,computedStyles:$.computedStyles,nearbyElements:$.nearbyElements,reactComponents:$.reactComponents,sourceFile:$.sourceFile,elementBoundingBoxes:$.elementBoundingBoxes,...R&&pt?{sessionId:pt,url:typeof window<"u"?window.location.href:void 0,status:"pending"}:{}};Y(X=>[...X,k]),ao.current=k.id,He(()=>{ao.current=null},300),He(()=>{Mo(X=>new Set(X).add(k.id))},250),f==null||f(k),xt("annotation.add",{annotation:k}),fr(!0),He(()=>{Z(null),fr(!1)},150),(W=window.getSelection())==null||W.removeAllRanges(),R&&pt&&Js(R,pt,k).then(X=>{X.id!==k.id&&(Y(V=>V.map(G=>G.id===k.id?{...G,id:X.id}:G)),Mo(V=>{const G=new Set(V);return G.delete(k.id),G.add(X.id),G}))}).catch(X=>{console.warn("[Agentation] Failed to sync annotation:",X)})},[$,f,xt,R,pt]),$n=S.useCallback(()=>{fr(!0),He(()=>{Z(null),fr(!1)},150)},[]),Vn=S.useCallback(h=>{const k=D.findIndex(X=>X.id===h),W=D[k];(Re==null?void 0:Re.id)===h&&(io(!0),He(()=>{An(null),Tt(null),Nn([]),io(!1)},150)),Xr(h),Xn(X=>new Set(X).add(h)),W&&(_==null||_(W),xt("annotation.delete",{annotation:W})),R&&Hd(R,h).catch(X=>{console.warn("[Agentation] Failed to delete annotation from server:",X)}),He(()=>{Y(X=>X.filter(V=>V.id!==h)),Xn(X=>{const V=new Set(X);return V.delete(h),V}),Xr(null),k<D.length-1&&(nr(k),He(()=>nr(null),200))},150)},[D,Re,_,xt,R]),Mn=S.useCallback(h=>{var k;if(An(h),Ze(null),an(null),En([]),(k=h.elementBoundingBoxes)!=null&&k.length){const W=[];for(const X of h.elementBoundingBoxes){const V=X.x+X.width/2,G=X.y+X.height/2-window.scrollY,he=Wr(V,G);he&&W.push(he)}Nn(W),Tt(null)}else if(h.boundingBox){const W=h.boundingBox,X=W.x+W.width/2,V=h.isFixed?W.y+W.height/2:W.y+W.height/2-window.scrollY,G=Wr(X,V);if(G){const he=G.getBoundingClientRect(),_e=he.width/W.width,be=he.height/W.height;_e<.5||be<.5?Tt(null):Tt(G)}else Tt(null);Nn([])}else Tt(null),Nn([])},[]),tn=S.useCallback(h=>{var k;if(!h){Ze(null),an(null),En([]);return}if(Ze(h.id),(k=h.elementBoundingBoxes)!=null&&k.length){const W=[];for(const X of h.elementBoundingBoxes){const V=X.x+X.width/2,G=X.y+X.height/2-window.scrollY,_e=document.elementsFromPoint(V,G).find(be=>!be.closest("[data-annotation-marker]")&&!be.closest("[data-agentation-root]"));_e&&W.push(_e)}En(W),an(null)}else if(h.boundingBox){const W=h.boundingBox,X=W.x+W.width/2,V=h.isFixed?W.y+W.height/2:W.y+W.height/2-window.scrollY,G=Wr(X,V);if(G){const he=G.getBoundingClientRect(),_e=he.width/W.width,be=he.height/W.height;_e<.5||be<.5?an(null):an(G)}else an(null);En([])}else an(null),En([])},[]),ai=S.useCallback(h=>{if(!Re)return;const k={...Re,comment:h};Y(W=>W.map(X=>X.id===Re.id?k:X)),m==null||m(k),xt("annotation.update",{annotation:k}),R&&C_(R,Re.id,{comment:h}).catch(W=>{console.warn("[Agentation] Failed to update annotation on server:",W)}),io(!0),He(()=>{An(null),Tt(null),Nn([]),io(!1)},150)},[Re,m,xt,R]),Kl=S.useCallback(()=>{io(!0),He(()=>{An(null),Tt(null),Nn([]),io(!1)},150)},[]),nn=S.useCallback(()=>{const h=D.length;if(h===0)return;c==null||c(D),xt("annotations.clear",{annotations:D}),R&&Promise.all(D.map(W=>Hd(R,W.id).catch(X=>{console.warn("[Agentation] Failed to delete annotation from server:",X)}))),Ke(!0),Be(!0);const k=h*30+200;He(()=>{Y([]),Mo(new Set),localStorage.removeItem(li(Ge)),Ke(!1)},k),He(()=>Be(!1),1500)},[Ge,D,c,xt,R]),rl=S.useCallback(async()=>{const h=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Ge,k=Gd(D,h,de.outputDetail,gn);if(k){if(H)try{await navigator.clipboard.writeText(k)}catch{}w==null||w(k),P(!0),He(()=>P(!1),2e3),de.autoClearAfterCopy&&He(()=>nn(),500)}},[D,Ge,de.outputDetail,gn,de.autoClearAfterCopy,nn,H,w]),hr=S.useCallback(async()=>{const h=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Ge,k=Gd(D,h,de.outputDetail,gn);if(!k)return;C&&C(k,D),Ne("sending"),await new Promise(X=>He(X,150));const W=await xt("submit",{output:k,annotations:D},!0);Ne(W?"sent":"failed"),He(()=>Ne("idle"),2500),W&&de.autoClearAfterCopy&&He(()=>nn(),500)},[C,xt,D,Ge,de.outputDetail,gn,de.autoClearAfterCopy,nn]);S.useEffect(()=>{if(!so)return;const h=10,k=X=>{const V=X.clientX-so.x,G=X.clientY-so.y,he=Math.sqrt(V*V+G*G);if(!cn&&he>h&&Ul(!0),cn||he>h){let _e=so.toolbarX+V,be=so.toolbarY+G;const Pe=20,we=297,Ee=44,je=we-(I?Nt==="connected"?297:257:44),ge=Pe-je,ht=window.innerWidth-Pe-we;_e=Math.max(ge,Math.min(ht,_e)),be=Math.max(Pe,Math.min(window.innerHeight-Ee-Pe,be)),cr({x:_e,y:be})}},W=()=>{cn&&(dr.current=!0),Ul(!1),rt(null)};return document.addEventListener("mousemove",k),document.addEventListener("mouseup",W),()=>{document.removeEventListener("mousemove",k),document.removeEventListener("mouseup",W)}},[so,cn,I,Nt]);const gr=S.useCallback(h=>{if(h.target.closest("button")||h.target.closest(`.${y.settingsPanel}`))return;const k=h.currentTarget.parentElement;if(!k)return;const W=k.getBoundingClientRect(),X=(Qe==null?void 0:Qe.x)??W.left,V=(Qe==null?void 0:Qe.y)??W.top,G=(Math.random()-.5)*10;qr(G),rt({x:h.clientX,y:h.clientY,toolbarX:X,toolbarY:V})},[Qe]);if(S.useEffect(()=>{if(!Qe)return;const h=()=>{let V=Qe.x,G=Qe.y;const be=20-(297-(I?Nt==="connected"?297:257:44)),Pe=window.innerWidth-20-297;V=Math.max(be,Math.min(Pe,V)),G=Math.max(20,Math.min(window.innerHeight-44-20,G)),(V!==Qe.x||G!==Qe.y)&&cr({x:V,y:G})};return h(),window.addEventListener("resize",h),()=>window.removeEventListener("resize",h)},[Qe,I,Nt]),S.useEffect(()=>{const h=k=>{const W=k.target,X=W.tagName==="INPUT"||W.tagName==="TEXTAREA"||W.isContentEditable;if(k.key==="Escape"){if(ut.length>0){Un([]);return}$||I&&(wt(),N(!1))}if((k.metaKey||k.ctrlKey)&&k.shiftKey&&(k.key==="f"||k.key==="F")){k.preventDefault(),wt(),N(V=>!V);return}if(!(X||k.metaKey||k.ctrlKey)&&((k.key==="p"||k.key==="P")&&(k.preventDefault(),wt(),Fo()),(k.key==="h"||k.key==="H")&&D.length>0&&(k.preventDefault(),wt(),A(V=>!V)),(k.key==="c"||k.key==="C")&&D.length>0&&(k.preventDefault(),wt(),rl()),(k.key==="x"||k.key==="X")&&D.length>0&&(k.preventDefault(),wt(),nn()),k.key==="s"||k.key==="S")){const V=Bn(de.webhookUrl)||Bn(v||"");D.length>0&&V&&U==="idle"&&(k.preventDefault(),wt(),hr())}};return document.addEventListener("keydown",h),()=>document.removeEventListener("keydown",h)},[I,$,D.length,de.webhookUrl,v,U,hr,Fo,rl,nn,ut]),!tt||g)return null;const Qn=D.length>0,yr=D.filter(h=>!el.has(h.id)&&Eo(h)),uo=D.filter(h=>el.has(h.id)),co=h=>{const G=h.x/100*window.innerWidth,he=typeof h.y=="string"?parseFloat(h.y):h.y,_e={};window.innerHeight-he-22-10<80&&(_e.top="auto",_e.bottom="calc(100% + 10px)");const Pe=G-200/2,we=10;if(Pe<we){const Ee=we-Pe;_e.left=`calc(50% + ${Ee}px)`}else if(Pe+200>window.innerWidth-we){const Ee=Pe+200-(window.innerWidth-we);_e.left=`calc(50% - ${Ee}px)`}return _e};return Dd.createPortal(l.jsxs("div",{ref:ae,style:{display:"contents"},children:[l.jsx("div",{className:`${y.toolbar}${F?` ${F}`:""}`,"data-feedback-toolbar":!0,style:Qe?{left:Qe.x,top:Qe.y,right:"auto",bottom:"auto"}:void 0,children:l.jsxs("div",{className:`${y.toolbarContainer} ${Ie?"":y.light} ${I?y.expanded:y.collapsed} ${ar?y.entrance:""} ${ue?y.hiding:""} ${cn?y.dragging:""} ${!de.webhooksEnabled&&(Bn(de.webhookUrl)||Bn(v||""))?y.serverConnected:""}`,onClick:I?void 0:h=>{if(dr.current){dr.current=!1,h.preventDefault();return}N(!0)},onMouseDown:gr,role:I?void 0:"button",tabIndex:I?-1:0,title:I?void 0:"Start feedback mode",style:{...cn&&{transform:`scale(1.05) rotate(${ii}deg)`,cursor:"grabbing"}},children:[l.jsxs("div",{className:`${y.toggleContent} ${I?y.hidden:y.visible}`,children:[l.jsx(Zp,{size:24}),Qn&&l.jsx("span",{className:`${y.badge} ${I?y.fadeOut:""} ${ar?y.entrance:""}`,style:{backgroundColor:de.annotationColor},children:D.length})]}),l.jsxs("div",{className:`${y.controlsContent} ${I?y.visible:y.hidden} ${Qe&&Qe.y<100?y.tooltipBelow:""} ${Gr||Po?y.tooltipsHidden:""} ${Yn?y.tooltipsInSession:""}`,onMouseEnter:Io,onMouseLeave:Zr,children:[l.jsxs("div",{className:`${y.buttonWrapper} ${Qe&&Qe.x<120?y.buttonWrapperAlignLeft:""}`,children:[l.jsx("button",{className:`${y.controlButton} ${Ie?"":y.light}`,onClick:h=>{h.stopPropagation(),wt(),Fo()},"data-active":Et,children:l.jsx(t_,{size:24,isPaused:Et})}),l.jsxs("span",{className:y.buttonTooltip,children:[Et?"Resume animations":"Pause animations",l.jsx("span",{className:y.shortcut,children:"P"})]})]}),l.jsxs("div",{className:y.buttonWrapper,children:[l.jsx("button",{className:`${y.controlButton} ${Ie?"":y.light}`,onClick:h=>{h.stopPropagation(),wt(),A(!T)},disabled:!Qn,children:l.jsx(e_,{size:24,isOpen:T})}),l.jsxs("span",{className:y.buttonTooltip,children:[T?"Hide markers":"Show markers",l.jsx("span",{className:y.shortcut,children:"H"})]})]}),l.jsxs("div",{className:y.buttonWrapper,children:[l.jsx("button",{className:`${y.controlButton} ${Ie?"":y.light} ${re?y.statusShowing:""}`,onClick:h=>{h.stopPropagation(),wt(),rl()},disabled:!Qn,"data-active":re,children:l.jsx(Jp,{size:24,copied:re})}),l.jsxs("span",{className:y.buttonTooltip,children:["Copy feedback",l.jsx("span",{className:y.shortcut,children:"C"})]})]}),l.jsxs("div",{className:`${y.buttonWrapper} ${y.sendButtonWrapper} ${I&&!de.webhooksEnabled&&(Bn(de.webhookUrl)||Bn(v||""))?y.sendButtonVisible:""}`,children:[l.jsxs("button",{className:`${y.controlButton} ${Ie?"":y.light} ${U==="sent"||U==="failed"?y.statusShowing:""}`,onClick:h=>{h.stopPropagation(),wt(),hr()},disabled:!Qn||!Bn(de.webhookUrl)&&!Bn(v||"")||U==="sending","data-no-hover":U==="sent"||U==="failed",tabIndex:Bn(de.webhookUrl)||Bn(v||"")?0:-1,children:[l.jsx(qp,{size:24,state:U}),Qn&&U==="idle"&&l.jsx("span",{className:`${y.buttonBadge} ${Ie?"":y.light}`,style:{backgroundColor:de.annotationColor},children:D.length})]}),l.jsxs("span",{className:y.buttonTooltip,children:["Send Annotations",l.jsx("span",{className:y.shortcut,children:"S"})]})]}),l.jsxs("div",{className:y.buttonWrapper,children:[l.jsx("button",{className:`${y.controlButton} ${Ie?"":y.light}`,onClick:h=>{h.stopPropagation(),wt(),nn()},disabled:!Qn,"data-danger":!0,children:l.jsx(o_,{size:24})}),l.jsxs("span",{className:y.buttonTooltip,children:["Clear all",l.jsx("span",{className:y.shortcut,children:"X"})]})]}),l.jsxs("div",{className:y.buttonWrapper,children:[l.jsx("button",{className:`${y.controlButton} ${Ie?"":y.light}`,onClick:h=>{h.stopPropagation(),wt(),lr(!Po)},children:l.jsx(n_,{size:24})}),R&&Nt!=="disconnected"&&l.jsx("span",{className:`${y.mcpIndicator} ${Ie?"":y.light} ${y[Nt]} ${Po?y.hidden:""}`,title:Nt==="connected"?"MCP Connected":"MCP Connecting..."}),l.jsx("span",{className:y.buttonTooltip,children:"Settings"})]}),l.jsx("div",{className:`${y.divider} ${Ie?"":y.light}`}),l.jsxs("div",{className:`${y.buttonWrapper} ${Qe&&typeof window<"u"&&Qe.x>window.innerWidth-120?y.buttonWrapperAlignRight:""}`,children:[l.jsx("button",{className:`${y.controlButton} ${Ie?"":y.light}`,onClick:h=>{h.stopPropagation(),wt(),N(!1)},children:l.jsx(r_,{size:24})}),l.jsxs("span",{className:y.buttonTooltip,children:["Exit",l.jsx("span",{className:y.shortcut,children:"Esc"})]})]})]}),l.jsx("div",{className:`${y.settingsPanel} ${Ie?y.dark:y.light} ${Bl?y.enter:y.exit}`,onClick:h=>h.stopPropagation(),style:Qe&&Qe.y<230?{bottom:"auto",top:"calc(100% + 0.5rem)"}:void 0,children:l.jsxs("div",{className:`${y.settingsPanelContainer} ${sr?y.transitioning:""}`,children:[l.jsxs("div",{className:`${y.settingsPage} ${Lo==="automations"?y.slideLeft:""}`,children:[l.jsxs("div",{className:y.settingsHeader,children:[l.jsxs("span",{className:y.settingsBrand,children:[l.jsx("span",{className:y.settingsBrandSlash,style:{color:de.annotationColor,transition:"color 0.2s ease"},children:"/"}),"agentation"]}),l.jsxs("span",{className:y.settingsVersion,children:["v","2.3.1"]}),l.jsx("button",{className:y.themeToggle,onClick:()=>Ro(!Ie),title:Ie?"Switch to light mode":"Switch to dark mode",children:l.jsx("span",{className:y.themeIconWrapper,children:l.jsx("span",{className:y.themeIcon,children:Ie?l.jsx(l_,{size:20}):l.jsx(s_,{size:20})},Ie?"sun":"moon")})})]}),l.jsxs("div",{className:y.settingsSection,children:[l.jsxs("div",{className:y.settingsRow,children:[l.jsxs("div",{className:`${y.settingsLabel} ${Ie?"":y.light}`,children:["Output Detail",l.jsx(un,{content:"Controls how much detail is included in the copied output",children:l.jsx("span",{className:y.helpIcon,children:l.jsx(Br,{size:20})})})]}),l.jsxs("button",{className:`${y.cycleButton} ${Ie?"":y.light}`,onClick:()=>{const k=(Ml.findIndex(W=>W.value===de.outputDetail)+1)%Ml.length;Yt(W=>({...W,outputDetail:Ml[k].value}))},children:[l.jsx("span",{className:y.cycleButtonText,children:(Gn=Ml.find(h=>h.value===de.outputDetail))==null?void 0:Gn.label},de.outputDetail),l.jsx("span",{className:y.cycleDots,children:Ml.map((h,k)=>l.jsx("span",{className:`${y.cycleDot} ${Ie?"":y.light} ${de.outputDetail===h.value?y.active:""}`},h.value))})]})]}),l.jsxs("div",{className:`${y.settingsRow} ${y.settingsRowMarginTop} ${y.settingsRowDisabled}`,children:[l.jsxs("div",{className:`${y.settingsLabel} ${Ie?"":y.light}`,children:["React Components",l.jsx(un,{content:"Disabled — production builds minify component names, making detection unreliable. Use in development mode.",children:l.jsx("span",{className:y.helpIcon,children:l.jsx(Br,{size:20})})})]}),l.jsxs("label",{className:`${y.toggleSwitch} ${y.disabled}`,children:[l.jsx("input",{type:"checkbox",checked:Hl,disabled:!Hl,onChange:()=>Yt(h=>({...h,reactEnabled:!h.reactEnabled}))}),l.jsx("span",{className:y.toggleSlider})]})]}),l.jsxs("div",{className:`${y.settingsRow} ${y.settingsRowMarginTop}`,children:[l.jsxs("div",{className:`${y.settingsLabel} ${Ie?"":y.light}`,children:["Hide Until Restart",l.jsx(un,{content:"Hides the toolbar until you open a new tab",children:l.jsx("span",{className:y.helpIcon,children:l.jsx(Br,{size:20})})})]}),l.jsxs("label",{className:y.toggleSwitch,children:[l.jsx("input",{type:"checkbox",checked:!1,onChange:h=>{h.target.checked&&Gl()}}),l.jsx("span",{className:y.toggleSlider})]})]})]}),l.jsxs("div",{className:y.settingsSection,children:[l.jsx("div",{className:`${y.settingsLabel} ${y.settingsLabelMarker} ${Ie?"":y.light}`,children:"Marker Colour"}),l.jsx("div",{className:y.colorOptions,children:J_.map(h=>l.jsx("div",{role:"button",onClick:()=>Yt(k=>({...k,annotationColor:h.value})),style:{borderColor:de.annotationColor===h.value?h.value:"transparent"},className:`${y.colorOptionRing} ${de.annotationColor===h.value?y.selected:""}`,children:l.jsx("div",{className:`${y.colorOption} ${de.annotationColor===h.value?y.selected:""}`,style:{backgroundColor:h.value},title:h.label})},h.value))})]}),l.jsxs("div",{className:y.settingsSection,children:[l.jsxs("label",{className:y.settingsToggle,children:[l.jsx("input",{type:"checkbox",id:"autoClearAfterCopy",checked:de.autoClearAfterCopy,onChange:h=>Yt(k=>({...k,autoClearAfterCopy:h.target.checked}))}),l.jsx("label",{className:`${y.customCheckbox} ${de.autoClearAfterCopy?y.checked:""}`,htmlFor:"autoClearAfterCopy",children:de.autoClearAfterCopy&&l.jsx(Fd,{size:14})}),l.jsxs("span",{className:`${y.toggleLabel} ${Ie?"":y.light}`,children:["Clear on copy/send",l.jsx(un,{content:"Automatically clear annotations after copying",children:l.jsx("span",{className:`${y.helpIcon} ${y.helpIconNudge2}`,children:l.jsx(Br,{size:20})})})]})]}),l.jsxs("label",{className:`${y.settingsToggle} ${y.settingsToggleMarginBottom}`,children:[l.jsx("input",{type:"checkbox",id:"blockInteractions",checked:de.blockInteractions,onChange:h=>Yt(k=>({...k,blockInteractions:h.target.checked}))}),l.jsx("label",{className:`${y.customCheckbox} ${de.blockInteractions?y.checked:""}`,htmlFor:"blockInteractions",children:de.blockInteractions&&l.jsx(Fd,{size:14})}),l.jsx("span",{className:`${y.toggleLabel} ${Ie?"":y.light}`,children:"Block page interactions"})]})]}),l.jsx("div",{className:`${y.settingsSection} ${y.settingsSectionExtraPadding}`,children:l.jsxs("button",{className:`${y.settingsNavLink} ${Ie?"":y.light}`,onClick:()=>To("automations"),children:[l.jsx("span",{children:"Manage MCP & Webhooks"}),l.jsxs("span",{className:y.settingsNavLinkRight,children:[R&&Nt!=="disconnected"&&l.jsx("span",{className:`${y.mcpNavIndicator} ${y[Nt]}`}),l.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M7.5 12.5L12 8L7.5 3.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]})]})})]}),l.jsxs("div",{className:`${y.settingsPage} ${y.automationsPage} ${Lo==="automations"?y.slideIn:""}`,children:[l.jsxs("button",{className:`${y.settingsBackButton} ${Ie?"":y.light}`,onClick:()=>To("main"),children:[l.jsx(a_,{size:16}),l.jsx("span",{children:"Manage MCP & Webhooks"})]}),l.jsxs("div",{className:y.settingsSection,children:[l.jsxs("div",{className:y.settingsRow,children:[l.jsxs("span",{className:`${y.automationHeader} ${Ie?"":y.light}`,children:["MCP Connection",l.jsx(un,{content:"Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time.",children:l.jsx("span",{className:`${y.helpIcon} ${y.helpIconNudgeDown}`,children:l.jsx(Br,{size:20})})})]}),R&&l.jsx("div",{className:`${y.mcpStatusDot} ${y[Nt]}`,title:Nt==="connected"?"Connected":Nt==="connecting"?"Connecting...":"Disconnected"})]}),l.jsxs("p",{className:`${y.automationDescription} ${Ie?"":y.light}`,style:{paddingBottom:6},children:["MCP connection allows agents to receive and act on annotations."," ",l.jsx("a",{href:"https://agentation.dev/mcp",target:"_blank",rel:"noopener noreferrer",className:`${y.learnMoreLink} ${Ie?"":y.light}`,children:"Learn more"})]})]}),l.jsxs("div",{className:`${y.settingsSection} ${y.settingsSectionGrow}`,children:[l.jsxs("div",{className:y.settingsRow,children:[l.jsxs("span",{className:`${y.automationHeader} ${Ie?"":y.light}`,children:["Webhooks",l.jsx(un,{content:"Send annotation data to any URL endpoint when annotations change. Useful for custom integrations.",children:l.jsx("span",{className:`${y.helpIcon} ${y.helpIconNoNudge}`,children:l.jsx(Br,{size:20})})})]}),l.jsxs("div",{className:y.autoSendRow,children:[l.jsx("span",{className:`${y.autoSendLabel} ${Ie?"":y.light} ${de.webhooksEnabled?y.active:""}`,children:"Auto-Send"}),l.jsxs("label",{className:`${y.toggleSwitch} ${de.webhookUrl?"":y.disabled}`,children:[l.jsx("input",{type:"checkbox",checked:de.webhooksEnabled,disabled:!de.webhookUrl,onChange:()=>Yt(h=>({...h,webhooksEnabled:!h.webhooksEnabled}))}),l.jsx("span",{className:y.toggleSlider})]})]})]}),l.jsx("p",{className:`${y.automationDescription} ${Ie?"":y.light}`,children:"The webhook URL will receive live annotation changes and annotation data."}),l.jsx("textarea",{className:`${y.webhookUrlInput} ${Ie?"":y.light}`,placeholder:"Webhook URL",value:de.webhookUrl,style:{"--marker-color":de.annotationColor},onKeyDown:h=>h.stopPropagation(),onChange:h=>Yt(k=>({...k,webhookUrl:h.target.value}))})]})]})]})})]})}),l.jsxs("div",{className:y.markersLayer,"data-feedback-toolbar":!0,children:[Te&&yr.filter(h=>!h.isFixed).map((h,k)=>{const W=!fe&&Ye===h.id,X=tr===h.id,V=(W||X)&&!Re,G=h.isMultiSelect,he=G?"#34C759":de.annotationColor,_e=D.findIndex(Ee=>Ee.id===h.id),be=!$o.has(h.id),Pe=fe?y.exit:Ae?y.clearing:be?y.enter:"",we=V&&de.markerClickBehavior==="delete";return l.jsxs("div",{className:`${y.marker} ${G?y.multiSelect:""} ${Pe} ${we?y.hovered:""}`,"data-annotation-marker":!0,style:{left:`${h.x}%`,top:h.y,backgroundColor:we?void 0:he,animationDelay:fe?`${(yr.length-1-k)*20}ms`:`${k*20}ms`},onMouseEnter:()=>!fe&&h.id!==ao.current&&tn(h),onMouseLeave:()=>tn(null),onClick:Ee=>{Ee.stopPropagation(),fe||(de.markerClickBehavior==="delete"?Vn(h.id):Mn(h))},onContextMenu:Ee=>{de.markerClickBehavior==="delete"&&(Ee.preventDefault(),Ee.stopPropagation(),fe||Mn(h))},children:[V?we?l.jsx(Ya,{size:G?18:16}):l.jsx(Bd,{size:16}):l.jsx("span",{className:No!==null&&_e>=No?y.renumber:void 0,children:_e+1}),W&&!Re&&l.jsxs("div",{className:`${y.markerTooltip} ${Ie?"":y.light} ${y.enter}`,style:co(h),children:[l.jsxs("span",{className:y.markerQuote,children:[h.element,h.selectedText&&` "${h.selectedText.slice(0,30)}${h.selectedText.length>30?"...":""}"`]}),l.jsx("span",{className:y.markerNote,children:h.comment})]})]},h.id)}),Te&&!fe&&uo.filter(h=>!h.isFixed).map(h=>{const k=h.isMultiSelect;return l.jsx("div",{className:`${y.marker} ${y.hovered} ${k?y.multiSelect:""} ${y.exit}`,"data-annotation-marker":!0,style:{left:`${h.x}%`,top:h.y},children:l.jsx(Ya,{size:k?12:10})},h.id)})]}),l.jsxs("div",{className:y.fixedMarkersLayer,"data-feedback-toolbar":!0,children:[Te&&yr.filter(h=>h.isFixed).map((h,k)=>{const W=yr.filter(ke=>ke.isFixed),X=!fe&&Ye===h.id,V=tr===h.id,G=(X||V)&&!Re,he=h.isMultiSelect,_e=he?"#34C759":de.annotationColor,be=D.findIndex(ke=>ke.id===h.id),Pe=!$o.has(h.id),we=fe?y.exit:Ae?y.clearing:Pe?y.enter:"",Ee=G&&de.markerClickBehavior==="delete";return l.jsxs("div",{className:`${y.marker} ${y.fixed} ${he?y.multiSelect:""} ${we} ${Ee?y.hovered:""}`,"data-annotation-marker":!0,style:{left:`${h.x}%`,top:h.y,backgroundColor:Ee?void 0:_e,animationDelay:fe?`${(W.length-1-k)*20}ms`:`${k*20}ms`},onMouseEnter:()=>!fe&&h.id!==ao.current&&tn(h),onMouseLeave:()=>tn(null),onClick:ke=>{ke.stopPropagation(),fe||(de.markerClickBehavior==="delete"?Vn(h.id):Mn(h))},onContextMenu:ke=>{de.markerClickBehavior==="delete"&&(ke.preventDefault(),ke.stopPropagation(),fe||Mn(h))},children:[G?Ee?l.jsx(Ya,{size:he?18:16}):l.jsx(Bd,{size:16}):l.jsx("span",{className:No!==null&&be>=No?y.renumber:void 0,children:be+1}),X&&!Re&&l.jsxs("div",{className:`${y.markerTooltip} ${Ie?"":y.light} ${y.enter}`,style:co(h),children:[l.jsxs("span",{className:y.markerQuote,children:[h.element,h.selectedText&&` "${h.selectedText.slice(0,30)}${h.selectedText.length>30?"...":""}"`]}),l.jsx("span",{className:y.markerNote,children:h.comment})]})]},h.id)}),Te&&!fe&&uo.filter(h=>h.isFixed).map(h=>{const k=h.isMultiSelect;return l.jsx("div",{className:`${y.marker} ${y.fixed} ${y.hovered} ${k?y.multiSelect:""} ${y.exit}`,"data-annotation-marker":!0,style:{left:`${h.x}%`,top:h.y},children:l.jsx(Gp,{size:k?12:10})},h.id)})]}),I&&l.jsxs("div",{className:y.overlay,"data-feedback-toolbar":!0,style:$||Re?{zIndex:99999}:void 0,children:[(z==null?void 0:z.rect)&&!$&&!Qr&&!yn&&l.jsx("div",{className:`${y.hoverHighlight} ${y.enter}`,style:{left:z.rect.left,top:z.rect.top,width:z.rect.width,height:z.rect.height,borderColor:`${de.annotationColor}80`,backgroundColor:`${de.annotationColor}0A`}}),ut.filter(h=>document.contains(h.element)).map((h,k)=>{const W=h.element.getBoundingClientRect(),X=ut.length>1;return l.jsx("div",{className:X?y.multiSelectOutline:y.singleSelectOutline,style:{position:"fixed",left:W.left,top:W.top,width:W.width,height:W.height,...X?{}:{borderColor:`${de.annotationColor}99`,backgroundColor:`${de.annotationColor}0D`}}},k)}),Ye&&!$&&(()=>{var V;const h=D.find(G=>G.id===Ye);if(!(h!=null&&h.boundingBox))return null;if((V=h.elementBoundingBoxes)!=null&&V.length)return Ur.length>0?Ur.filter(G=>document.contains(G)).map((G,he)=>{const _e=G.getBoundingClientRect();return l.jsx("div",{className:`${y.multiSelectOutline} ${y.enter}`,style:{left:_e.left,top:_e.top,width:_e.width,height:_e.height}},`hover-outline-live-${he}`)}):h.elementBoundingBoxes.map((G,he)=>l.jsx("div",{className:`${y.multiSelectOutline} ${y.enter}`,style:{left:G.x,top:G.y-Pn,width:G.width,height:G.height}},`hover-outline-${he}`));const k=jt&&document.contains(jt)?jt.getBoundingClientRect():null,W=k?{x:k.left,y:k.top,width:k.width,height:k.height}:{x:h.boundingBox.x,y:h.isFixed?h.boundingBox.y:h.boundingBox.y-Pn,width:h.boundingBox.width,height:h.boundingBox.height},X=h.isMultiSelect;return l.jsx("div",{className:`${X?y.multiSelectOutline:y.singleSelectOutline} ${y.enter}`,style:{left:W.x,top:W.y,width:W.width,height:W.height,...X?{}:{borderColor:`${de.annotationColor}99`,backgroundColor:`${de.annotationColor}0D`}}})})(),z&&!$&&!Qr&&!yn&&l.jsxs("div",{className:`${y.hoverTooltip} ${y.enter}`,style:{left:Math.max(8,Math.min(se.x,window.innerWidth-100)),top:Math.max(se.y-(z.reactComponents?48:32),8)},children:[z.reactComponents&&l.jsx("div",{className:y.hoverReactPath,children:z.reactComponents}),l.jsx("div",{className:y.hoverElementName,children:z.elementName})]}),$&&l.jsxs(l.Fragment,{children:[(Ao=$.multiSelectElements)!=null&&Ao.length?$.multiSelectElements.filter(h=>document.contains(h)).map((h,k)=>{const W=h.getBoundingClientRect();return l.jsx("div",{className:`${y.multiSelectOutline} ${It?y.exit:y.enter}`,style:{left:W.left,top:W.top,width:W.width,height:W.height}},`pending-multi-${k}`)}):$.targetElement&&document.contains($.targetElement)?(()=>{const h=$.targetElement.getBoundingClientRect();return l.jsx("div",{className:`${y.singleSelectOutline} ${It?y.exit:y.enter}`,style:{left:h.left,top:h.top,width:h.width,height:h.height,borderColor:`${de.annotationColor}99`,backgroundColor:`${de.annotationColor}0D`}})})():$.boundingBox&&l.jsx("div",{className:`${$.isMultiSelect?y.multiSelectOutline:y.singleSelectOutline} ${It?y.exit:y.enter}`,style:{left:$.boundingBox.x,top:$.boundingBox.y-Pn,width:$.boundingBox.width,height:$.boundingBox.height,...$.isMultiSelect?{}:{borderColor:`${de.annotationColor}99`,backgroundColor:`${de.annotationColor}0D`}}}),(()=>{const h=$.x,k=$.isFixed?$.y:$.y-Pn;return l.jsxs(l.Fragment,{children:[l.jsx("div",{className:`${y.marker} ${y.pending} ${$.isMultiSelect?y.multiSelect:""} ${It?y.exit:y.enter}`,style:{left:`${h}%`,top:k,backgroundColor:$.isMultiSelect?"#34C759":de.annotationColor},children:l.jsx(Kp,{size:12})}),l.jsx(Wd,{ref:Ql,element:$.element,selectedText:$.selectedText,computedStyles:$.computedStylesObj,placeholder:$.element==="Area selection"?"What should change in this area?":$.isMultiSelect?"Feedback for this group of elements...":"What should change?",onSubmit:Rn,onCancel:$n,isExiting:It,lightMode:!Ie,accentColor:$.isMultiSelect?"#34C759":de.annotationColor,style:{left:Math.max(160,Math.min(window.innerWidth-160,h/100*window.innerWidth)),...k>window.innerHeight-290?{bottom:window.innerHeight-k+20}:{top:k+20}}})]})})()]}),Re&&l.jsxs(l.Fragment,{children:[(Zl=Re.elementBoundingBoxes)!=null&&Zl.length?or.length>0?or.filter(h=>document.contains(h)).map((h,k)=>{const W=h.getBoundingClientRect();return l.jsx("div",{className:`${y.multiSelectOutline} ${y.enter}`,style:{left:W.left,top:W.top,width:W.width,height:W.height}},`edit-multi-live-${k}`)}):Re.elementBoundingBoxes.map((h,k)=>l.jsx("div",{className:`${y.multiSelectOutline} ${y.enter}`,style:{left:h.x,top:h.y-Pn,width:h.width,height:h.height}},`edit-multi-${k}`)):(()=>{const h=Wn&&document.contains(Wn)?Wn.getBoundingClientRect():null,k=h?{x:h.left,y:h.top,width:h.width,height:h.height}:Re.boundingBox?{x:Re.boundingBox.x,y:Re.isFixed?Re.boundingBox.y:Re.boundingBox.y-Pn,width:Re.boundingBox.width,height:Re.boundingBox.height}:null;return k?l.jsx("div",{className:`${Re.isMultiSelect?y.multiSelectOutline:y.singleSelectOutline} ${y.enter}`,style:{left:k.x,top:k.y,width:k.width,height:k.height,...Re.isMultiSelect?{}:{borderColor:`${de.annotationColor}99`,backgroundColor:`${de.annotationColor}0D`}}}):null})(),l.jsx(Wd,{ref:pr,element:Re.element,selectedText:Re.selectedText,computedStyles:x_(Re.computedStyles),placeholder:"Edit your feedback...",initialValue:Re.comment,submitLabel:"Save",onSubmit:ai,onCancel:Kl,onDelete:()=>Vn(Re.id),isExiting:en,lightMode:!Ie,accentColor:Re.isMultiSelect?"#34C759":de.annotationColor,style:(()=>{const h=Re.isFixed?Re.y:Re.y-Pn;return{left:Math.max(160,Math.min(window.innerWidth-160,Re.x/100*window.innerWidth)),...h>window.innerHeight-290?{bottom:window.innerHeight-h+20}:{top:h+20}}})()})]}),yn&&l.jsxs(l.Fragment,{children:[l.jsx("div",{ref:vn,className:y.dragSelection}),l.jsx("div",{ref:In,className:y.highlightsContainer})]})]})]}),document.body)}const eh={design:of,device:Pp,text:Tp,effects:Rp,export:rf};function th(){const r=q(A=>A.activeTab),a=q(A=>A.config),i=q(A=>A.isPanoramic),f=q(A=>A.togglePanoramic),_=q(A=>A.initScreens),m=q(A=>A.setPreviewSize),c=q(A=>A.setFonts),w=q(A=>A.setFrames),C=q(A=>A.setDeviceFamilies),H=q(A=>A.setKoubouAvailable),R=q(A=>A.setSizes),x=q(A=>A.setExportSize),p=q(A=>A.selectedScreen),v=q(A=>A.screens),F=q(A=>A.undo),I=q(A=>A.redo),[N,D]=S.useState(null),Y=v[p];if(S.useEffect(()=>{const A=g=>{var te;if(!(g.metaKey||g.ctrlKey)||g.key.toLowerCase()!=="z")return;const ue=(te=g.target)==null?void 0:te.tagName;ue==="INPUT"||ue==="TEXTAREA"||ue==="SELECT"||(g.preventDefault(),g.shiftKey?I():F())};return window.addEventListener("keydown",A),()=>window.removeEventListener("keydown",A)},[F,I]),S.useEffect(()=>{async function A(){try{const[g,Q,ue]=await Promise.all([ef(),sp(),lp()]),te=g.app.platforms[0]??"iphone",ae=ni[te]??ni.iphone;m(ae.w,ae.h),c(Q),w(ue),_(g,te);try{const le=(await ip()).families;C(le),H(!0)}catch{H(!1)}try{const Te=await ap(),le={};for(const[L,z]of Object.entries(Te))le[L]=z;R(le);const fe=le[te];fe&&fe.length>0&&x(fe[0].key)}catch{}}catch(g){D(g instanceof Error?g.message:"Failed to load config")}}A()},[_,m,c,w,C,H,R,x]),N)return l.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-red-400",children:l.jsx("p",{children:N})});if(!a)return l.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-text-dim",children:"Loading..."});const T=i?r==="export"?rf:Bp:eh[r]??of;return l.jsxs("div",{className:"h-dvh flex overflow-hidden",children:[l.jsxs("div",{className:"w-80 min-w-80 bg-surface border-r border-border flex flex-col",children:[l.jsxs("div",{className:"px-5 py-4 border-b border-border",children:[l.jsxs("div",{className:"flex items-center justify-between",children:[l.jsx("h1",{className:"text-base font-semibold",children:"appframe"}),l.jsxs("button",{className:`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border transition-colors ${i?"border-accent/40 bg-accent/10 text-accent":"border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text"}`,onClick:f,title:i?"Switch to individual mode":"Switch to panoramic mode",children:[l.jsx("span",{className:"w-3 h-3 flex items-center justify-center",children:i?l.jsxs("svg",{viewBox:"0 0 12 12",fill:"none",className:"w-full h-full",children:[l.jsx("rect",{x:"0.5",y:"2",width:"11",height:"8",rx:"1",stroke:"currentColor",strokeWidth:"1"}),l.jsx("line",{x1:"3",y1:"2",x2:"3",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"}),l.jsx("line",{x1:"6",y1:"2",x2:"6",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"}),l.jsx("line",{x1:"9",y1:"2",x2:"9",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"})]}):l.jsx("svg",{viewBox:"0 0 12 12",fill:"none",className:"w-full h-full",children:l.jsx("rect",{x:"2",y:"1",width:"8",height:"10",rx:"1",stroke:"currentColor",strokeWidth:"1"})})}),i?"Panoramic":"Individual"]})]}),l.jsxs("div",{className:"flex items-center gap-2 mt-0.5",children:[l.jsx("p",{className:"text-xs text-text-dim",children:a.app.name}),!i&&Y&&l.jsx("span",{className:"text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded",children:p+1})]})]}),i?l.jsx("div",{className:"flex border-b border-border",children:[{id:"panoramic",label:"Panoramic"},{id:"export",label:"Export"}].map(A=>l.jsx("button",{onClick:()=>q.getState().setActiveTab(A.id),className:`flex-1 py-2 text-xs font-medium transition-colors ${r===A.id||A.id==="panoramic"&&r!=="export"?"text-accent border-b-2 border-accent":"text-text-dim hover:text-text"}`,children:A.label},A.id))}):l.jsx(dp,{}),l.jsx("div",{className:"flex-1 overflow-y-auto",children:l.jsx(T,{})})]}),i?l.jsx(Xp,{}):l.jsx(Hp,{}),l.jsx(q_,{endpoint:"http://localhost:4747"})]})}const _f=document.getElementById("root");if(!_f)throw new Error("Root element not found");Wm.createRoot(_f).render(l.jsx(S.StrictMode,{children:l.jsx(th,{})}));
