(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const m of document.querySelectorAll('link[rel="modulepreload"]'))c(m);new MutationObserver(m=>{for(const h of m)if(h.type==="childList")for(const p of h.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&c(p)}).observe(document,{childList:!0,subtree:!0});function i(m){const h={};return m.integrity&&(h.integrity=m.integrity),m.referrerPolicy&&(h.referrerPolicy=m.referrerPolicy),m.crossOrigin==="use-credentials"?h.credentials="include":m.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function c(m){if(m.ep)return;m.ep=!0;const h=i(m);fetch(m.href,h)}})();function rf(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Mi={exports:{}},Pl={},zi={exports:{}},We={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bd;function Hm(){if(bd)return We;bd=1;var r=Symbol.for("react.element"),a=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),c=Symbol.for("react.strict_mode"),m=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),p=Symbol.for("react.context"),y=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),$=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),T=Symbol.iterator;function _(R){return R===null||typeof R!="object"?null:(R=T&&R[T]||R["@@iterator"],typeof R=="function"?R:null)}var N={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},x=Object.assign,g={};function E(R,F,ie){this.props=R,this.context=F,this.refs=g,this.updater=ie||N}E.prototype.isReactComponent={},E.prototype.setState=function(R,F){if(typeof R!="object"&&typeof R!="function"&&R!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,R,F,"setState")},E.prototype.forceUpdate=function(R){this.updater.enqueueForceUpdate(this,R,"forceUpdate")};function k(){}k.prototype=E.prototype;function J(R,F,ie){this.props=R,this.context=F,this.refs=g,this.updater=ie||N}var ne=J.prototype=new k;ne.constructor=J,x(ne,E.prototype),ne.isPureReactComponent=!0;var le=Array.isArray,re=Object.prototype.hasOwnProperty,ae={current:null},ue={key:!0,ref:!0,__self:!0,__source:!0};function v(R,F,ie){var H,xe={},we=null,Ie=null;if(F!=null)for(H in F.ref!==void 0&&(Ie=F.ref),F.key!==void 0&&(we=""+F.key),F)re.call(F,H)&&!ue.hasOwnProperty(H)&&(xe[H]=F[H]);var $e=arguments.length-2;if($e===1)xe.children=ie;else if(1<$e){for(var Ue=Array($e),Nt=0;Nt<$e;Nt++)Ue[Nt]=arguments[Nt+2];xe.children=Ue}if(R&&R.defaultProps)for(H in $e=R.defaultProps,$e)xe[H]===void 0&&(xe[H]=$e[H]);return{$$typeof:r,type:R,key:we,ref:Ie,props:xe,_owner:ae.current}}function U(R,F){return{$$typeof:r,type:R.type,key:F,ref:R.ref,props:R.props,_owner:R._owner}}function be(R){return typeof R=="object"&&R!==null&&R.$$typeof===r}function K(R){var F={"=":"=0",":":"=2"};return"$"+R.replace(/[=:]/g,function(ie){return F[ie]})}var fe=/\/+/g;function Oe(R,F){return typeof R=="object"&&R!==null&&R.key!=null?K(""+R.key):F.toString(36)}function ze(R,F,ie,H,xe){var we=typeof R;(we==="undefined"||we==="boolean")&&(R=null);var Ie=!1;if(R===null)Ie=!0;else switch(we){case"string":case"number":Ie=!0;break;case"object":switch(R.$$typeof){case r:case a:Ie=!0}}if(Ie)return Ie=R,xe=xe(Ie),R=H===""?"."+Oe(Ie,0):H,le(xe)?(ie="",R!=null&&(ie=R.replace(fe,"$&/")+"/"),ze(xe,F,ie,"",function(Nt){return Nt})):xe!=null&&(be(xe)&&(xe=U(xe,ie+(!xe.key||Ie&&Ie.key===xe.key?"":(""+xe.key).replace(fe,"$&/")+"/")+R)),F.push(xe)),1;if(Ie=0,H=H===""?".":H+":",le(R))for(var $e=0;$e<R.length;$e++){we=R[$e];var Ue=H+Oe(we,$e);Ie+=ze(we,F,ie,Ue,xe)}else if(Ue=_(R),typeof Ue=="function")for(R=Ue.call(R),$e=0;!(we=R.next()).done;)we=we.value,Ue=H+Oe(we,$e++),Ie+=ze(we,F,ie,Ue,xe);else if(we==="object")throw F=String(R),Error("Objects are not valid as a React child (found: "+(F==="[object Object]"?"object with keys {"+Object.keys(R).join(", ")+"}":F)+"). If you meant to render a collection of children, use an array instead.");return Ie}function Le(R,F,ie){if(R==null)return R;var H=[],xe=0;return ze(R,H,"","",function(we){return F.call(ie,we,xe++)}),H}function O(R){if(R._status===-1){var F=R._result;F=F(),F.then(function(ie){(R._status===0||R._status===-1)&&(R._status=1,R._result=ie)},function(ie){(R._status===0||R._status===-1)&&(R._status=2,R._result=ie)}),R._status===-1&&(R._status=0,R._result=F)}if(R._status===1)return R._result.default;throw R._result}var W={current:null},M={transition:null},Y={ReactCurrentDispatcher:W,ReactCurrentBatchConfig:M,ReactCurrentOwner:ae};function V(){throw Error("act(...) is not supported in production builds of React.")}return We.Children={map:Le,forEach:function(R,F,ie){Le(R,function(){F.apply(this,arguments)},ie)},count:function(R){var F=0;return Le(R,function(){F++}),F},toArray:function(R){return Le(R,function(F){return F})||[]},only:function(R){if(!be(R))throw Error("React.Children.only expected to receive a single React element child.");return R}},We.Component=E,We.Fragment=i,We.Profiler=m,We.PureComponent=J,We.StrictMode=c,We.Suspense=f,We.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Y,We.act=V,We.cloneElement=function(R,F,ie){if(R==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+R+".");var H=x({},R.props),xe=R.key,we=R.ref,Ie=R._owner;if(F!=null){if(F.ref!==void 0&&(we=F.ref,Ie=ae.current),F.key!==void 0&&(xe=""+F.key),R.type&&R.type.defaultProps)var $e=R.type.defaultProps;for(Ue in F)re.call(F,Ue)&&!ue.hasOwnProperty(Ue)&&(H[Ue]=F[Ue]===void 0&&$e!==void 0?$e[Ue]:F[Ue])}var Ue=arguments.length-2;if(Ue===1)H.children=ie;else if(1<Ue){$e=Array(Ue);for(var Nt=0;Nt<Ue;Nt++)$e[Nt]=arguments[Nt+2];H.children=$e}return{$$typeof:r,type:R.type,key:xe,ref:we,props:H,_owner:Ie}},We.createContext=function(R){return R={$$typeof:p,_currentValue:R,_currentValue2:R,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},R.Provider={$$typeof:h,_context:R},R.Consumer=R},We.createElement=v,We.createFactory=function(R){var F=v.bind(null,R);return F.type=R,F},We.createRef=function(){return{current:null}},We.forwardRef=function(R){return{$$typeof:y,render:R}},We.isValidElement=be,We.lazy=function(R){return{$$typeof:w,_payload:{_status:-1,_result:R},_init:O}},We.memo=function(R,F){return{$$typeof:$,type:R,compare:F===void 0?null:F}},We.startTransition=function(R){var F=M.transition;M.transition={};try{R()}finally{M.transition=F}},We.unstable_act=V,We.useCallback=function(R,F){return W.current.useCallback(R,F)},We.useContext=function(R){return W.current.useContext(R)},We.useDebugValue=function(){},We.useDeferredValue=function(R){return W.current.useDeferredValue(R)},We.useEffect=function(R,F){return W.current.useEffect(R,F)},We.useId=function(){return W.current.useId()},We.useImperativeHandle=function(R,F,ie){return W.current.useImperativeHandle(R,F,ie)},We.useInsertionEffect=function(R,F){return W.current.useInsertionEffect(R,F)},We.useLayoutEffect=function(R,F){return W.current.useLayoutEffect(R,F)},We.useMemo=function(R,F){return W.current.useMemo(R,F)},We.useReducer=function(R,F,ie){return W.current.useReducer(R,F,ie)},We.useRef=function(R){return W.current.useRef(R)},We.useState=function(R){return W.current.useState(R)},We.useSyncExternalStore=function(R,F,ie){return W.current.useSyncExternalStore(R,F,ie)},We.useTransition=function(){return W.current.useTransition()},We.version="18.3.1",We}var wd;function Fl(){return wd||(wd=1,zi.exports=Hm()),zi.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var kd;function Um(){if(kd)return Pl;kd=1;var r=Fl(),a=Symbol.for("react.element"),i=Symbol.for("react.fragment"),c=Object.prototype.hasOwnProperty,m=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function p(y,f,$){var w,T={},_=null,N=null;$!==void 0&&(_=""+$),f.key!==void 0&&(_=""+f.key),f.ref!==void 0&&(N=f.ref);for(w in f)c.call(f,w)&&!h.hasOwnProperty(w)&&(T[w]=f[w]);if(y&&y.defaultProps)for(w in f=y.defaultProps,f)T[w]===void 0&&(T[w]=f[w]);return{$$typeof:a,type:y,key:_,ref:N,props:T,_owner:m.current}}return Pl.Fragment=i,Pl.jsx=p,Pl.jsxs=p,Pl}var Cd;function Vm(){return Cd||(Cd=1,Mi.exports=Um()),Mi.exports}var l=Vm(),C=Fl();const lf=rf(C);var Vs={},Oi={exports:{}},Zt={},Di={exports:{}},Fi={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sd;function Xm(){return Sd||(Sd=1,(function(r){function a(M,Y){var V=M.length;M.push(Y);e:for(;0<V;){var R=V-1>>>1,F=M[R];if(0<m(F,Y))M[R]=Y,M[V]=F,V=R;else break e}}function i(M){return M.length===0?null:M[0]}function c(M){if(M.length===0)return null;var Y=M[0],V=M.pop();if(V!==Y){M[0]=V;e:for(var R=0,F=M.length,ie=F>>>1;R<ie;){var H=2*(R+1)-1,xe=M[H],we=H+1,Ie=M[we];if(0>m(xe,V))we<F&&0>m(Ie,xe)?(M[R]=Ie,M[we]=V,R=we):(M[R]=xe,M[H]=V,R=H);else if(we<F&&0>m(Ie,V))M[R]=Ie,M[we]=V,R=we;else break e}}return Y}function m(M,Y){var V=M.sortIndex-Y.sortIndex;return V!==0?V:M.id-Y.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;r.unstable_now=function(){return h.now()}}else{var p=Date,y=p.now();r.unstable_now=function(){return p.now()-y}}var f=[],$=[],w=1,T=null,_=3,N=!1,x=!1,g=!1,E=typeof setTimeout=="function"?setTimeout:null,k=typeof clearTimeout=="function"?clearTimeout:null,J=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ne(M){for(var Y=i($);Y!==null;){if(Y.callback===null)c($);else if(Y.startTime<=M)c($),Y.sortIndex=Y.expirationTime,a(f,Y);else break;Y=i($)}}function le(M){if(g=!1,ne(M),!x)if(i(f)!==null)x=!0,O(re);else{var Y=i($);Y!==null&&W(le,Y.startTime-M)}}function re(M,Y){x=!1,g&&(g=!1,k(v),v=-1),N=!0;var V=_;try{for(ne(Y),T=i(f);T!==null&&(!(T.expirationTime>Y)||M&&!K());){var R=T.callback;if(typeof R=="function"){T.callback=null,_=T.priorityLevel;var F=R(T.expirationTime<=Y);Y=r.unstable_now(),typeof F=="function"?T.callback=F:T===i(f)&&c(f),ne(Y)}else c(f);T=i(f)}if(T!==null)var ie=!0;else{var H=i($);H!==null&&W(le,H.startTime-Y),ie=!1}return ie}finally{T=null,_=V,N=!1}}var ae=!1,ue=null,v=-1,U=5,be=-1;function K(){return!(r.unstable_now()-be<U)}function fe(){if(ue!==null){var M=r.unstable_now();be=M;var Y=!0;try{Y=ue(!0,M)}finally{Y?Oe():(ae=!1,ue=null)}}else ae=!1}var Oe;if(typeof J=="function")Oe=function(){J(fe)};else if(typeof MessageChannel<"u"){var ze=new MessageChannel,Le=ze.port2;ze.port1.onmessage=fe,Oe=function(){Le.postMessage(null)}}else Oe=function(){E(fe,0)};function O(M){ue=M,ae||(ae=!0,Oe())}function W(M,Y){v=E(function(){M(r.unstable_now())},Y)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(M){M.callback=null},r.unstable_continueExecution=function(){x||N||(x=!0,O(re))},r.unstable_forceFrameRate=function(M){0>M||125<M?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):U=0<M?Math.floor(1e3/M):5},r.unstable_getCurrentPriorityLevel=function(){return _},r.unstable_getFirstCallbackNode=function(){return i(f)},r.unstable_next=function(M){switch(_){case 1:case 2:case 3:var Y=3;break;default:Y=_}var V=_;_=Y;try{return M()}finally{_=V}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(M,Y){switch(M){case 1:case 2:case 3:case 4:case 5:break;default:M=3}var V=_;_=M;try{return Y()}finally{_=V}},r.unstable_scheduleCallback=function(M,Y,V){var R=r.unstable_now();switch(typeof V=="object"&&V!==null?(V=V.delay,V=typeof V=="number"&&0<V?R+V:R):V=R,M){case 1:var F=-1;break;case 2:F=250;break;case 5:F=1073741823;break;case 4:F=1e4;break;default:F=5e3}return F=V+F,M={id:w++,callback:Y,priorityLevel:M,startTime:V,expirationTime:F,sortIndex:-1},V>R?(M.sortIndex=V,a($,M),i(f)===null&&M===i($)&&(g?(k(v),v=-1):g=!0,W(le,V-R))):(M.sortIndex=F,a(f,M),x||N||(x=!0,O(re))),M},r.unstable_shouldYield=K,r.unstable_wrapCallback=function(M){var Y=_;return function(){var V=_;_=Y;try{return M.apply(this,arguments)}finally{_=V}}}})(Fi)),Fi}var jd;function Qm(){return jd||(jd=1,Di.exports=Xm()),Di.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ed;function Gm(){if(Ed)return Zt;Ed=1;var r=Fl(),a=Qm();function i(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var c=new Set,m={};function h(e,t){p(e,t),p(e+"Capture",t)}function p(e,t){for(m[e]=t,e=0;e<t.length;e++)c.add(t[e])}var y=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),f=Object.prototype.hasOwnProperty,$=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,w={},T={};function _(e){return f.call(T,e)?!0:f.call(w,e)?!1:$.test(e)?T[e]=!0:(w[e]=!0,!1)}function N(e,t,n,o){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function x(e,t,n,o){if(t===null||typeof t>"u"||N(e,t,n,o))return!0;if(o)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function g(e,t,n,o,s,u,d){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=s,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=u,this.removeEmptyString=d}var E={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){E[e]=new g(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];E[t]=new g(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){E[e]=new g(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){E[e]=new g(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){E[e]=new g(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){E[e]=new g(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){E[e]=new g(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){E[e]=new g(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){E[e]=new g(e,5,!1,e.toLowerCase(),null,!1,!1)});var k=/[\-:]([a-z])/g;function J(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(k,J);E[t]=new g(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(k,J);E[t]=new g(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(k,J);E[t]=new g(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){E[e]=new g(e,1,!1,e.toLowerCase(),null,!1,!1)}),E.xlinkHref=new g("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){E[e]=new g(e,1,!1,e.toLowerCase(),null,!0,!0)});function ne(e,t,n,o){var s=E.hasOwnProperty(t)?E[t]:null;(s!==null?s.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(x(t,n,s,o)&&(n=null),o||s===null?_(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):s.mustUseProperty?e[s.propertyName]=n===null?s.type===3?!1:"":n:(t=s.attributeName,o=s.attributeNamespace,n===null?e.removeAttribute(t):(s=s.type,n=s===3||s===4&&n===!0?"":""+n,o?e.setAttributeNS(o,t,n):e.setAttribute(t,n))))}var le=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,re=Symbol.for("react.element"),ae=Symbol.for("react.portal"),ue=Symbol.for("react.fragment"),v=Symbol.for("react.strict_mode"),U=Symbol.for("react.profiler"),be=Symbol.for("react.provider"),K=Symbol.for("react.context"),fe=Symbol.for("react.forward_ref"),Oe=Symbol.for("react.suspense"),ze=Symbol.for("react.suspense_list"),Le=Symbol.for("react.memo"),O=Symbol.for("react.lazy"),W=Symbol.for("react.offscreen"),M=Symbol.iterator;function Y(e){return e===null||typeof e!="object"?null:(e=M&&e[M]||e["@@iterator"],typeof e=="function"?e:null)}var V=Object.assign,R;function F(e){if(R===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);R=t&&t[1]||""}return`
`+R+e}var ie=!1;function H(e,t){if(!e||ie)return"";ie=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(A){var o=A}Reflect.construct(e,[],t)}else{try{t.call()}catch(A){o=A}e.call(t.prototype)}else{try{throw Error()}catch(A){o=A}e()}}catch(A){if(A&&o&&typeof A.stack=="string"){for(var s=A.stack.split(`
`),u=o.stack.split(`
`),d=s.length-1,j=u.length-1;1<=d&&0<=j&&s[d]!==u[j];)j--;for(;1<=d&&0<=j;d--,j--)if(s[d]!==u[j]){if(d!==1||j!==1)do if(d--,j--,0>j||s[d]!==u[j]){var L=`
`+s[d].replace(" at new "," at ");return e.displayName&&L.includes("<anonymous>")&&(L=L.replace("<anonymous>",e.displayName)),L}while(1<=d&&0<=j);break}}}finally{ie=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?F(e):""}function xe(e){switch(e.tag){case 5:return F(e.type);case 16:return F("Lazy");case 13:return F("Suspense");case 19:return F("SuspenseList");case 0:case 2:case 15:return e=H(e.type,!1),e;case 11:return e=H(e.type.render,!1),e;case 1:return e=H(e.type,!0),e;default:return""}}function we(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ue:return"Fragment";case ae:return"Portal";case U:return"Profiler";case v:return"StrictMode";case Oe:return"Suspense";case ze:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case K:return(e.displayName||"Context")+".Consumer";case be:return(e._context.displayName||"Context")+".Provider";case fe:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Le:return t=e.displayName||null,t!==null?t:we(e.type)||"Memo";case O:t=e._payload,e=e._init;try{return we(e(t))}catch{}}return null}function Ie(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return we(t);case 8:return t===v?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function $e(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ue(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Nt(e){var t=Ue(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var s=n.get,u=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(d){o=""+d,u.call(this,d)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return o},setValue:function(d){o=""+d},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function an(e){e._valueTracker||(e._valueTracker=Nt(e))}function Ur(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=Ue(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}function Nn(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function tr(e,t){var n=t.checked;return V({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Vr(e,t){var n=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;n=$e(t.value!=null?t.value:n),e._wrapperState={initialChecked:o,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function No(e,t){t=t.checked,t!=null&&ne(e,"checked",t,!1)}function nr(e,t){No(e,t);var n=$e(t.value),o=t.type;if(n!=null)o==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Yn(e,t.type,n):t.hasOwnProperty("defaultValue")&&Yn(e,t.type,$e(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function De(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Yn(e,t,n){(t!=="number"||Nn(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Hn=Array.isArray;function It(e,t,n,o){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&o&&(e[n].defaultSelected=!0)}else{for(n=""+$e(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,o&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function or(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(i(91));return V({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Pn(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(i(92));if(Hn(n)){if(1<n.length)throw Error(i(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:$e(n)}}function Tn(e,t){var n=$e(t.value),o=$e(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),o!=null&&(e.defaultValue=""+o)}function Xr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Qr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function rr(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Qr(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var nt,Al=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,o,s){MSApp.execUnsafeLocalFunction(function(){return e(t,n,o,s)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(nt=nt||document.createElement("div"),nt.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=nt.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Pt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var so={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Po=["Webkit","ms","Moz","O"];Object.keys(so).forEach(function(e){Po.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),so[t]=so[e]})});function lr(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||so.hasOwnProperty(e)&&so[e]?(""+t).trim():t+"px"}function Bl(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var o=n.indexOf("--")===0,s=lr(n,t[n],o);n==="float"&&(n="cssFloat"),o?e.setProperty(n,s):e[n]=s}}var Wl=V({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function To(e,t){if(t){if(Wl[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(i(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(i(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(i(61))}if(t.style!=null&&typeof t.style!="object")throw Error(i(62))}}function Lo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var sr=null;function ar(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Gr=null,Ln=null,Un=null;function Kr(e){if(e=pl(e)){if(typeof Gr!="function")throw Error(i(280));var t=e.stateNode;t&&(t=as(t),Gr(e.stateNode,e.type,t))}}function Vn(e){Ln?Un?Un.push(e):Un=[e]:Ln=e}function ut(){if(Ln){var e=Ln,t=Un;if(Un=Ln=null,Kr(e),t)for(e=0;e<t.length;e++)Kr(t[e])}}function Xn(e,t){return e(t)}function qt(){}var Ct=!1;function Yl(e,t,n){if(Ct)return e(t,n);Ct=!0;try{return Xn(e,t,n)}finally{Ct=!1,(Ln!==null||Un!==null)&&(qt(),ut())}}function Ro(e,t){var n=e.stateNode;if(n===null)return null;var o=as(n);if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(i(231,t,typeof n));return n}var Zr=!1;if(y)try{var un={};Object.defineProperty(un,"passive",{get:function(){Zr=!0}}),window.addEventListener("test",un,un),window.removeEventListener("test",un,un)}catch{Zr=!1}function ce(e,t,n,o,s,u,d,j,L){var A=Array.prototype.slice.call(arguments,3);try{t.apply(n,A)}catch(te){this.onError(te)}}var Yt=!1,Me=null,Io=!1,ir=null,Hl={onError:function(e){Yt=!0,Me=e}};function Ul(e,t,n,o,s,u,d,j,L){Yt=!1,Me=null,ce.apply(Hl,arguments)}function gn(e,t,n,o,s,u,d,j,L){if(Ul.apply(this,arguments),Yt){if(Yt){var A=Me;Yt=!1,Me=null}else throw Error(i(198));Io||(Io=!0,ir=A)}}function pt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function ur(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Jr(e){if(pt(e)!==e)throw Error(i(188))}function Tt(e){var t=e.alternate;if(!t){if(t=pt(e),t===null)throw Error(i(188));return t!==e?null:e}for(var n=e,o=t;;){var s=n.return;if(s===null)break;var u=s.alternate;if(u===null){if(o=s.return,o!==null){n=o;continue}break}if(s.child===u.child){for(u=s.child;u;){if(u===n)return Jr(s),e;if(u===o)return Jr(s),t;u=u.sibling}throw Error(i(188))}if(n.return!==o.return)n=s,o=u;else{for(var d=!1,j=s.child;j;){if(j===n){d=!0,n=s,o=u;break}if(j===o){d=!0,o=s,n=u;break}j=j.sibling}if(!d){for(j=u.child;j;){if(j===n){d=!0,n=u,o=s;break}if(j===o){d=!0,o=u,n=s;break}j=j.sibling}if(!d)throw Error(i(189))}}if(n.alternate!==o)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function Rn(e){return e=Tt(e),e!==null?Ze(e):null}function Ze(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ze(e);if(t!==null)return t;e=e.sibling}return null}var cr=a.unstable_scheduleCallback,cn=a.unstable_cancelCallback,Vl=a.unstable_shouldYield,ao=a.unstable_requestPaint,lt=a.unstable_now,ca=a.unstable_getCurrentPriorityLevel,qr=a.unstable_ImmediatePriority,dr=a.unstable_UserBlockingPriority,$o=a.unstable_NormalPriority,Mo=a.unstable_LowPriority,el=a.unstable_IdlePriority,Qn=null,$t=null;function fr(e){if($t&&typeof $t.onCommitFiberRoot=="function")try{$t.onCommitFiberRoot(Qn,e,void 0,(e.current.flags&128)===128)}catch{}}var en=Math.clz32?Math.clz32:Xl,io=Math.log,yn=Math.LN2;function Xl(e){return e>>>=0,e===0?32:31-(io(e)/yn|0)|0}var xn=64,At=4194304;function vn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function In(e,t){var n=e.pendingLanes;if(n===0)return 0;var o=0,s=e.suspendedLanes,u=e.pingedLanes,d=n&268435455;if(d!==0){var j=d&~s;j!==0?o=vn(j):(u&=d,u!==0&&(o=vn(u)))}else d=n&~s,d!==0?o=vn(d):u!==0&&(o=vn(u));if(o===0)return 0;if(t!==0&&t!==o&&(t&s)===0&&(s=o&-o,u=t&-t,s>=u||s===16&&(u&4194240)!==0))return t;if((o&4)!==0&&(o|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)n=31-en(t),s=1<<n,o|=e[n],t&=~s;return o}function mr(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ql(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,s=e.expirationTimes,u=e.pendingLanes;0<u;){var d=31-en(u),j=1<<d,L=s[d];L===-1?((j&n)===0||(j&o)!==0)&&(s[d]=mr(j,t)):L<=t&&(e.expiredLanes|=j),u&=~j}}function uo(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function tl(){var e=xn;return xn<<=1,(xn&4194240)===0&&(xn=64),e}function zo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Oo(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-en(t),e[t]=n}function Gl(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<n;){var s=31-en(n),u=1<<s;t[s]=0,o[s]=-1,e[s]=-1,n&=~u}}function pr(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-en(n),s=1<<o;s&t|e[o]&t&&(e[o]|=t),n&=~s}}var He=0;function Je(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var nl,hr,Kl,ol,Do,Fo=!1,Ao=[],bt=null,$n=null,Mn=null,Gn=new Map,zn=new Map,tn=[],da="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Zl(e,t){switch(e){case"focusin":case"focusout":bt=null;break;case"dragenter":case"dragleave":$n=null;break;case"mouseover":case"mouseout":Mn=null;break;case"pointerover":case"pointerout":Gn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":zn.delete(t.pointerId)}}function nn(e,t,n,o,s,u){return e===null||e.nativeEvent!==u?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:u,targetContainers:[s]},t!==null&&(t=pl(t),t!==null&&hr(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function rl(e,t,n,o,s){switch(t){case"focusin":return bt=nn(bt,e,t,n,o,s),!0;case"dragenter":return $n=nn($n,e,t,n,o,s),!0;case"mouseover":return Mn=nn(Mn,e,t,n,o,s),!0;case"pointerover":var u=s.pointerId;return Gn.set(u,nn(Gn.get(u)||null,e,t,n,o,s)),!0;case"gotpointercapture":return u=s.pointerId,zn.set(u,nn(zn.get(u)||null,e,t,n,o,s)),!0}return!1}function _r(e){var t=Wo(e.target);if(t!==null){var n=pt(t);if(n!==null){if(t=n.tag,t===13){if(t=ur(n),t!==null){e.blockedOn=t,Do(e.priority,function(){Kl(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function gr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Q(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);sr=o,n.target.dispatchEvent(o),sr=null}else return t=pl(n),t!==null&&hr(t),e.blockedOn=n,!1;t.shift()}return!0}function Kn(e,t,n){gr(e)&&n.delete(t)}function yr(){Fo=!1,bt!==null&&gr(bt)&&(bt=null),$n!==null&&gr($n)&&($n=null),Mn!==null&&gr(Mn)&&(Mn=null),Gn.forEach(Kn),zn.forEach(Kn)}function co(e,t){e.blockedOn===t&&(e.blockedOn=null,Fo||(Fo=!0,a.unstable_scheduleCallback(a.unstable_NormalPriority,yr)))}function fo(e){function t(s){return co(s,e)}if(0<Ao.length){co(Ao[0],e);for(var n=1;n<Ao.length;n++){var o=Ao[n];o.blockedOn===e&&(o.blockedOn=null)}}for(bt!==null&&co(bt,e),$n!==null&&co($n,e),Mn!==null&&co(Mn,e),Gn.forEach(t),zn.forEach(t),n=0;n<tn.length;n++)o=tn[n],o.blockedOn===e&&(o.blockedOn=null);for(;0<tn.length&&(n=tn[0],n.blockedOn===null);)_r(n),n.blockedOn===null&&tn.shift()}var Zn=le.ReactCurrentBatchConfig,Bo=!0;function Jl(e,t,n,o){var s=He,u=Zn.transition;Zn.transition=null;try{He=1,P(e,t,n,o)}finally{He=s,Zn.transition=u}}function b(e,t,n,o){var s=He,u=Zn.transition;Zn.transition=null;try{He=4,P(e,t,n,o)}finally{He=s,Zn.transition=u}}function P(e,t,n,o){if(Bo){var s=Q(e,t,n,o);if(s===null)Sa(e,t,o,B,n),Zl(e,o);else if(rl(s,e,t,n,o))o.stopPropagation();else if(Zl(e,o),t&4&&-1<da.indexOf(e)){for(;s!==null;){var u=pl(s);if(u!==null&&nl(u),u=Q(e,t,n,o),u===null&&Sa(e,t,o,B,n),u===s)break;s=u}s!==null&&o.stopPropagation()}else Sa(e,t,o,null,n)}}var B=null;function Q(e,t,n,o){if(B=null,e=ar(o),e=Wo(e),e!==null)if(t=pt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=ur(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return B=e,null}function G(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ca()){case qr:return 1;case dr:return 4;case $o:case Mo:return 16;case el:return 536870912;default:return 16}default:return 16}}var q=null,he=null,pe=null;function ke(){if(pe)return pe;var e,t=he,n=t.length,o,s="value"in q?q.value:q.textContent,u=s.length;for(e=0;e<n&&t[e]===s[e];e++);var d=n-e;for(o=1;o<=d&&t[n-o]===s[u-o];o++);return pe=s.slice(e,1<o?1-o:void 0)}function Te(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ce(){return!0}function Pe(){return!1}function Se(e){function t(n,o,s,u,d){this._reactName=n,this._targetInst=s,this.type=o,this.nativeEvent=u,this.target=d,this.currentTarget=null;for(var j in e)e.hasOwnProperty(j)&&(n=e[j],this[j]=n?n(u):u[j]);return this.isDefaultPrevented=(u.defaultPrevented!=null?u.defaultPrevented:u.returnValue===!1)?Ce:Pe,this.isPropagationStopped=Pe,this}return V(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ce)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ce)},persist:function(){},isPersistent:Ce}),t}var Ne={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},_e=Se(Ne),_t=V({},Ne,{view:0,detail:0}),gt=Se(_t),on,st,ft,Ae=V({},_t,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:pa,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ft&&(ft&&e.type==="mousemove"?(on=e.screenX-ft.screenX,st=e.screenY-ft.screenY):st=on=0,ft=e),on)},movementY:function(e){return"movementY"in e?e.movementY:st}}),Be=Se(Ae),Mt=V({},Ae,{dataTransfer:0}),at=Se(Mt),Ht=V({},_t,{relatedTarget:0}),Ut=Se(Ht),xr=V({},Ne,{animationName:0,elapsedTime:0,pseudoElement:0}),fa=Se(xr),ql=V({},Ne,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),ma=Se(ql),Sf=V({},Ne,{data:0}),du=Se(Sf),jf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ef={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Nf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Nf[e])?!!t[e]:!1}function pa(){return Pf}var Tf=V({},_t,{key:function(e){if(e.key){var t=jf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Te(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Ef[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:pa,charCode:function(e){return e.type==="keypress"?Te(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Te(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Lf=Se(Tf),Rf=V({},Ae,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),fu=Se(Rf),If=V({},_t,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:pa}),$f=Se(If),Mf=V({},Ne,{propertyName:0,elapsedTime:0,pseudoElement:0}),zf=Se(Mf),Of=V({},Ae,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Df=Se(Of),Ff=[9,13,27,32],ha=y&&"CompositionEvent"in window,ll=null;y&&"documentMode"in document&&(ll=document.documentMode);var Af=y&&"TextEvent"in window&&!ll,mu=y&&(!ha||ll&&8<ll&&11>=ll),pu=" ",hu=!1;function _u(e,t){switch(e){case"keyup":return Ff.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function gu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var vr=!1;function Bf(e,t){switch(e){case"compositionend":return gu(t);case"keypress":return t.which!==32?null:(hu=!0,pu);case"textInput":return e=t.data,e===pu&&hu?null:e;default:return null}}function Wf(e,t){if(vr)return e==="compositionend"||!ha&&_u(e,t)?(e=ke(),pe=he=q=null,vr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return mu&&t.locale!=="ko"?null:t.data;default:return null}}var Yf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function yu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Yf[e.type]:t==="textarea"}function xu(e,t,n,o){Vn(o),t=rs(t,"onChange"),0<t.length&&(n=new _e("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var sl=null,al=null;function Hf(e){Ou(e,0)}function es(e){var t=Sr(e);if(Ur(t))return e}function Uf(e,t){if(e==="change")return t}var vu=!1;if(y){var _a;if(y){var ga="oninput"in document;if(!ga){var bu=document.createElement("div");bu.setAttribute("oninput","return;"),ga=typeof bu.oninput=="function"}_a=ga}else _a=!1;vu=_a&&(!document.documentMode||9<document.documentMode)}function wu(){sl&&(sl.detachEvent("onpropertychange",ku),al=sl=null)}function ku(e){if(e.propertyName==="value"&&es(al)){var t=[];xu(t,al,e,ar(e)),Yl(Hf,t)}}function Vf(e,t,n){e==="focusin"?(wu(),sl=t,al=n,sl.attachEvent("onpropertychange",ku)):e==="focusout"&&wu()}function Xf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return es(al)}function Qf(e,t){if(e==="click")return es(t)}function Gf(e,t){if(e==="input"||e==="change")return es(t)}function Kf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var bn=typeof Object.is=="function"?Object.is:Kf;function il(e,t){if(bn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var s=n[o];if(!f.call(t,s)||!bn(e[s],t[s]))return!1}return!0}function Cu(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Su(e,t){var n=Cu(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Cu(n)}}function ju(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?ju(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Eu(){for(var e=window,t=Nn();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Nn(e.document)}return t}function ya(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Zf(e){var t=Eu(),n=e.focusedElem,o=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&ju(n.ownerDocument.documentElement,n)){if(o!==null&&ya(n)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var s=n.textContent.length,u=Math.min(o.start,s);o=o.end===void 0?u:Math.min(o.end,s),!e.extend&&u>o&&(s=o,o=u,u=s),s=Su(n,u);var d=Su(n,o);s&&d&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==d.node||e.focusOffset!==d.offset)&&(t=t.createRange(),t.setStart(s.node,s.offset),e.removeAllRanges(),u>o?(e.addRange(t),e.extend(d.node,d.offset)):(t.setEnd(d.node,d.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Jf=y&&"documentMode"in document&&11>=document.documentMode,br=null,xa=null,ul=null,va=!1;function Nu(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;va||br==null||br!==Nn(o)||(o=br,"selectionStart"in o&&ya(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),ul&&il(ul,o)||(ul=o,o=rs(xa,"onSelect"),0<o.length&&(t=new _e("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=br)))}function ts(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var wr={animationend:ts("Animation","AnimationEnd"),animationiteration:ts("Animation","AnimationIteration"),animationstart:ts("Animation","AnimationStart"),transitionend:ts("Transition","TransitionEnd")},ba={},Pu={};y&&(Pu=document.createElement("div").style,"AnimationEvent"in window||(delete wr.animationend.animation,delete wr.animationiteration.animation,delete wr.animationstart.animation),"TransitionEvent"in window||delete wr.transitionend.transition);function ns(e){if(ba[e])return ba[e];if(!wr[e])return e;var t=wr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Pu)return ba[e]=t[n];return e}var Tu=ns("animationend"),Lu=ns("animationiteration"),Ru=ns("animationstart"),Iu=ns("transitionend"),$u=new Map,Mu="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function mo(e,t){$u.set(e,t),h(t,[e])}for(var wa=0;wa<Mu.length;wa++){var ka=Mu[wa],qf=ka.toLowerCase(),em=ka[0].toUpperCase()+ka.slice(1);mo(qf,"on"+em)}mo(Tu,"onAnimationEnd"),mo(Lu,"onAnimationIteration"),mo(Ru,"onAnimationStart"),mo("dblclick","onDoubleClick"),mo("focusin","onFocus"),mo("focusout","onBlur"),mo(Iu,"onTransitionEnd"),p("onMouseEnter",["mouseout","mouseover"]),p("onMouseLeave",["mouseout","mouseover"]),p("onPointerEnter",["pointerout","pointerover"]),p("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var cl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),tm=new Set("cancel close invalid load scroll toggle".split(" ").concat(cl));function zu(e,t,n){var o=e.type||"unknown-event";e.currentTarget=n,gn(o,t,void 0,e),e.currentTarget=null}function Ou(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],s=o.event;o=o.listeners;e:{var u=void 0;if(t)for(var d=o.length-1;0<=d;d--){var j=o[d],L=j.instance,A=j.currentTarget;if(j=j.listener,L!==u&&s.isPropagationStopped())break e;zu(s,j,A),u=L}else for(d=0;d<o.length;d++){if(j=o[d],L=j.instance,A=j.currentTarget,j=j.listener,L!==u&&s.isPropagationStopped())break e;zu(s,j,A),u=L}}}if(Io)throw e=ir,Io=!1,ir=null,e}function ot(e,t){var n=t[La];n===void 0&&(n=t[La]=new Set);var o=e+"__bubble";n.has(o)||(Du(t,e,2,!1),n.add(o))}function Ca(e,t,n){var o=0;t&&(o|=4),Du(n,e,o,t)}var os="_reactListening"+Math.random().toString(36).slice(2);function dl(e){if(!e[os]){e[os]=!0,c.forEach(function(n){n!=="selectionchange"&&(tm.has(n)||Ca(n,!1,e),Ca(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[os]||(t[os]=!0,Ca("selectionchange",!1,t))}}function Du(e,t,n,o){switch(G(t)){case 1:var s=Jl;break;case 4:s=b;break;default:s=P}n=s.bind(null,t,n,e),s=void 0,!Zr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),o?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function Sa(e,t,n,o,s){var u=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var d=o.tag;if(d===3||d===4){var j=o.stateNode.containerInfo;if(j===s||j.nodeType===8&&j.parentNode===s)break;if(d===4)for(d=o.return;d!==null;){var L=d.tag;if((L===3||L===4)&&(L=d.stateNode.containerInfo,L===s||L.nodeType===8&&L.parentNode===s))return;d=d.return}for(;j!==null;){if(d=Wo(j),d===null)return;if(L=d.tag,L===5||L===6){o=u=d;continue e}j=j.parentNode}}o=o.return}Yl(function(){var A=u,te=ar(n),oe=[];e:{var ee=$u.get(e);if(ee!==void 0){var de=_e,ge=e;switch(e){case"keypress":if(Te(n)===0)break e;case"keydown":case"keyup":de=Lf;break;case"focusin":ge="focus",de=Ut;break;case"focusout":ge="blur",de=Ut;break;case"beforeblur":case"afterblur":de=Ut;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":de=Be;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":de=at;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":de=$f;break;case Tu:case Lu:case Ru:de=fa;break;case Iu:de=zf;break;case"scroll":de=gt;break;case"wheel":de=Df;break;case"copy":case"cut":case"paste":de=ma;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":de=fu}var ye=(t&4)!==0,ht=!ye&&e==="scroll",z=ye?ee!==null?ee+"Capture":null:ee;ye=[];for(var I=A,D;I!==null;){D=I;var se=D.stateNode;if(D.tag===5&&se!==null&&(D=se,z!==null&&(se=Ro(I,z),se!=null&&ye.push(fl(I,se,D)))),ht)break;I=I.return}0<ye.length&&(ee=new de(ee,ge,null,n,te),oe.push({event:ee,listeners:ye}))}}if((t&7)===0){e:{if(ee=e==="mouseover"||e==="pointerover",de=e==="mouseout"||e==="pointerout",ee&&n!==sr&&(ge=n.relatedTarget||n.fromElement)&&(Wo(ge)||ge[Jn]))break e;if((de||ee)&&(ee=te.window===te?te:(ee=te.ownerDocument)?ee.defaultView||ee.parentWindow:window,de?(ge=n.relatedTarget||n.toElement,de=A,ge=ge?Wo(ge):null,ge!==null&&(ht=pt(ge),ge!==ht||ge.tag!==5&&ge.tag!==6)&&(ge=null)):(de=null,ge=A),de!==ge)){if(ye=Be,se="onMouseLeave",z="onMouseEnter",I="mouse",(e==="pointerout"||e==="pointerover")&&(ye=fu,se="onPointerLeave",z="onPointerEnter",I="pointer"),ht=de==null?ee:Sr(de),D=ge==null?ee:Sr(ge),ee=new ye(se,I+"leave",de,n,te),ee.target=ht,ee.relatedTarget=D,se=null,Wo(te)===A&&(ye=new ye(z,I+"enter",ge,n,te),ye.target=D,ye.relatedTarget=ht,se=ye),ht=se,de&&ge)t:{for(ye=de,z=ge,I=0,D=ye;D;D=kr(D))I++;for(D=0,se=z;se;se=kr(se))D++;for(;0<I-D;)ye=kr(ye),I--;for(;0<D-I;)z=kr(z),D--;for(;I--;){if(ye===z||z!==null&&ye===z.alternate)break t;ye=kr(ye),z=kr(z)}ye=null}else ye=null;de!==null&&Fu(oe,ee,de,ye,!1),ge!==null&&ht!==null&&Fu(oe,ht,ge,ye,!0)}}e:{if(ee=A?Sr(A):window,de=ee.nodeName&&ee.nodeName.toLowerCase(),de==="select"||de==="input"&&ee.type==="file")var ve=Uf;else if(yu(ee))if(vu)ve=Gf;else{ve=Xf;var je=Vf}else(de=ee.nodeName)&&de.toLowerCase()==="input"&&(ee.type==="checkbox"||ee.type==="radio")&&(ve=Qf);if(ve&&(ve=ve(e,A))){xu(oe,ve,n,te);break e}je&&je(e,ee,A),e==="focusout"&&(je=ee._wrapperState)&&je.controlled&&ee.type==="number"&&Yn(ee,"number",ee.value)}switch(je=A?Sr(A):window,e){case"focusin":(yu(je)||je.contentEditable==="true")&&(br=je,xa=A,ul=null);break;case"focusout":ul=xa=br=null;break;case"mousedown":va=!0;break;case"contextmenu":case"mouseup":case"dragend":va=!1,Nu(oe,n,te);break;case"selectionchange":if(Jf)break;case"keydown":case"keyup":Nu(oe,n,te)}var Ee;if(ha)e:{switch(e){case"compositionstart":var Re="onCompositionStart";break e;case"compositionend":Re="onCompositionEnd";break e;case"compositionupdate":Re="onCompositionUpdate";break e}Re=void 0}else vr?_u(e,n)&&(Re="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(Re="onCompositionStart");Re&&(mu&&n.locale!=="ko"&&(vr||Re!=="onCompositionStart"?Re==="onCompositionEnd"&&vr&&(Ee=ke()):(q=te,he="value"in q?q.value:q.textContent,vr=!0)),je=rs(A,Re),0<je.length&&(Re=new du(Re,e,null,n,te),oe.push({event:Re,listeners:je}),Ee?Re.data=Ee:(Ee=gu(n),Ee!==null&&(Re.data=Ee)))),(Ee=Af?Bf(e,n):Wf(e,n))&&(A=rs(A,"onBeforeInput"),0<A.length&&(te=new du("onBeforeInput","beforeinput",null,n,te),oe.push({event:te,listeners:A}),te.data=Ee))}Ou(oe,t)})}function fl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function rs(e,t){for(var n=t+"Capture",o=[];e!==null;){var s=e,u=s.stateNode;s.tag===5&&u!==null&&(s=u,u=Ro(e,n),u!=null&&o.unshift(fl(e,u,s)),u=Ro(e,t),u!=null&&o.push(fl(e,u,s))),e=e.return}return o}function kr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Fu(e,t,n,o,s){for(var u=t._reactName,d=[];n!==null&&n!==o;){var j=n,L=j.alternate,A=j.stateNode;if(L!==null&&L===o)break;j.tag===5&&A!==null&&(j=A,s?(L=Ro(n,u),L!=null&&d.unshift(fl(n,L,j))):s||(L=Ro(n,u),L!=null&&d.push(fl(n,L,j)))),n=n.return}d.length!==0&&e.push({event:t,listeners:d})}var nm=/\r\n?/g,om=/\u0000|\uFFFD/g;function Au(e){return(typeof e=="string"?e:""+e).replace(nm,`
`).replace(om,"")}function ls(e,t,n){if(t=Au(t),Au(e)!==t&&n)throw Error(i(425))}function ss(){}var ja=null,Ea=null;function Na(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Pa=typeof setTimeout=="function"?setTimeout:void 0,rm=typeof clearTimeout=="function"?clearTimeout:void 0,Bu=typeof Promise=="function"?Promise:void 0,lm=typeof queueMicrotask=="function"?queueMicrotask:typeof Bu<"u"?function(e){return Bu.resolve(null).then(e).catch(sm)}:Pa;function sm(e){setTimeout(function(){throw e})}function Ta(e,t){var n=t,o=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(o===0){e.removeChild(s),fo(t);return}o--}else n!=="$"&&n!=="$?"&&n!=="$!"||o++;n=s}while(n);fo(t)}function po(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Wu(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Cr=Math.random().toString(36).slice(2),On="__reactFiber$"+Cr,ml="__reactProps$"+Cr,Jn="__reactContainer$"+Cr,La="__reactEvents$"+Cr,am="__reactListeners$"+Cr,im="__reactHandles$"+Cr;function Wo(e){var t=e[On];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Jn]||n[On]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Wu(e);e!==null;){if(n=e[On])return n;e=Wu(e)}return t}e=n,n=e.parentNode}return null}function pl(e){return e=e[On]||e[Jn],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Sr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(i(33))}function as(e){return e[ml]||null}var Ra=[],jr=-1;function ho(e){return{current:e}}function rt(e){0>jr||(e.current=Ra[jr],Ra[jr]=null,jr--)}function tt(e,t){jr++,Ra[jr]=e.current,e.current=t}var _o={},zt=ho(_o),Vt=ho(!1),Yo=_o;function Er(e,t){var n=e.type.contextTypes;if(!n)return _o;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var s={},u;for(u in n)s[u]=t[u];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=s),s}function Xt(e){return e=e.childContextTypes,e!=null}function is(){rt(Vt),rt(zt)}function Yu(e,t,n){if(zt.current!==_o)throw Error(i(168));tt(zt,t),tt(Vt,n)}function Hu(e,t,n){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return n;o=o.getChildContext();for(var s in o)if(!(s in t))throw Error(i(108,Ie(e)||"Unknown",s));return V({},n,o)}function us(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||_o,Yo=zt.current,tt(zt,e),tt(Vt,Vt.current),!0}function Uu(e,t,n){var o=e.stateNode;if(!o)throw Error(i(169));n?(e=Hu(e,t,Yo),o.__reactInternalMemoizedMergedChildContext=e,rt(Vt),rt(zt),tt(zt,e)):rt(Vt),tt(Vt,n)}var qn=null,cs=!1,Ia=!1;function Vu(e){qn===null?qn=[e]:qn.push(e)}function um(e){cs=!0,Vu(e)}function go(){if(!Ia&&qn!==null){Ia=!0;var e=0,t=He;try{var n=qn;for(He=1;e<n.length;e++){var o=n[e];do o=o(!0);while(o!==null)}qn=null,cs=!1}catch(s){throw qn!==null&&(qn=qn.slice(e+1)),cr(qr,go),s}finally{He=t,Ia=!1}}return null}var Nr=[],Pr=0,ds=null,fs=0,dn=[],fn=0,Ho=null,eo=1,to="";function Uo(e,t){Nr[Pr++]=fs,Nr[Pr++]=ds,ds=e,fs=t}function Xu(e,t,n){dn[fn++]=eo,dn[fn++]=to,dn[fn++]=Ho,Ho=e;var o=eo;e=to;var s=32-en(o)-1;o&=~(1<<s),n+=1;var u=32-en(t)+s;if(30<u){var d=s-s%5;u=(o&(1<<d)-1).toString(32),o>>=d,s-=d,eo=1<<32-en(t)+s|n<<s|o,to=u+e}else eo=1<<u|n<<s|o,to=e}function $a(e){e.return!==null&&(Uo(e,1),Xu(e,1,0))}function Ma(e){for(;e===ds;)ds=Nr[--Pr],Nr[Pr]=null,fs=Nr[--Pr],Nr[Pr]=null;for(;e===Ho;)Ho=dn[--fn],dn[fn]=null,to=dn[--fn],dn[fn]=null,eo=dn[--fn],dn[fn]=null}var rn=null,ln=null,it=!1,wn=null;function Qu(e,t){var n=_n(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Gu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,rn=e,ln=po(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,rn=e,ln=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Ho!==null?{id:eo,overflow:to}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=_n(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,rn=e,ln=null,!0):!1;default:return!1}}function za(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Oa(e){if(it){var t=ln;if(t){var n=t;if(!Gu(e,t)){if(za(e))throw Error(i(418));t=po(n.nextSibling);var o=rn;t&&Gu(e,t)?Qu(o,n):(e.flags=e.flags&-4097|2,it=!1,rn=e)}}else{if(za(e))throw Error(i(418));e.flags=e.flags&-4097|2,it=!1,rn=e}}}function Ku(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;rn=e}function ms(e){if(e!==rn)return!1;if(!it)return Ku(e),it=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Na(e.type,e.memoizedProps)),t&&(t=ln)){if(za(e))throw Zu(),Error(i(418));for(;t;)Qu(e,t),t=po(t.nextSibling)}if(Ku(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(i(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ln=po(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ln=null}}else ln=rn?po(e.stateNode.nextSibling):null;return!0}function Zu(){for(var e=ln;e;)e=po(e.nextSibling)}function Tr(){ln=rn=null,it=!1}function Da(e){wn===null?wn=[e]:wn.push(e)}var cm=le.ReactCurrentBatchConfig;function hl(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(i(309));var o=n.stateNode}if(!o)throw Error(i(147,e));var s=o,u=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===u?t.ref:(t=function(d){var j=s.refs;d===null?delete j[u]:j[u]=d},t._stringRef=u,t)}if(typeof e!="string")throw Error(i(284));if(!n._owner)throw Error(i(290,e))}return e}function ps(e,t){throw e=Object.prototype.toString.call(t),Error(i(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Ju(e){var t=e._init;return t(e._payload)}function qu(e){function t(z,I){if(e){var D=z.deletions;D===null?(z.deletions=[I],z.flags|=16):D.push(I)}}function n(z,I){if(!e)return null;for(;I!==null;)t(z,I),I=I.sibling;return null}function o(z,I){for(z=new Map;I!==null;)I.key!==null?z.set(I.key,I):z.set(I.index,I),I=I.sibling;return z}function s(z,I){return z=So(z,I),z.index=0,z.sibling=null,z}function u(z,I,D){return z.index=D,e?(D=z.alternate,D!==null?(D=D.index,D<I?(z.flags|=2,I):D):(z.flags|=2,I)):(z.flags|=1048576,I)}function d(z){return e&&z.alternate===null&&(z.flags|=2),z}function j(z,I,D,se){return I===null||I.tag!==6?(I=Pi(D,z.mode,se),I.return=z,I):(I=s(I,D),I.return=z,I)}function L(z,I,D,se){var ve=D.type;return ve===ue?te(z,I,D.props.children,se,D.key):I!==null&&(I.elementType===ve||typeof ve=="object"&&ve!==null&&ve.$$typeof===O&&Ju(ve)===I.type)?(se=s(I,D.props),se.ref=hl(z,I,D),se.return=z,se):(se=Ds(D.type,D.key,D.props,null,z.mode,se),se.ref=hl(z,I,D),se.return=z,se)}function A(z,I,D,se){return I===null||I.tag!==4||I.stateNode.containerInfo!==D.containerInfo||I.stateNode.implementation!==D.implementation?(I=Ti(D,z.mode,se),I.return=z,I):(I=s(I,D.children||[]),I.return=z,I)}function te(z,I,D,se,ve){return I===null||I.tag!==7?(I=qo(D,z.mode,se,ve),I.return=z,I):(I=s(I,D),I.return=z,I)}function oe(z,I,D){if(typeof I=="string"&&I!==""||typeof I=="number")return I=Pi(""+I,z.mode,D),I.return=z,I;if(typeof I=="object"&&I!==null){switch(I.$$typeof){case re:return D=Ds(I.type,I.key,I.props,null,z.mode,D),D.ref=hl(z,null,I),D.return=z,D;case ae:return I=Ti(I,z.mode,D),I.return=z,I;case O:var se=I._init;return oe(z,se(I._payload),D)}if(Hn(I)||Y(I))return I=qo(I,z.mode,D,null),I.return=z,I;ps(z,I)}return null}function ee(z,I,D,se){var ve=I!==null?I.key:null;if(typeof D=="string"&&D!==""||typeof D=="number")return ve!==null?null:j(z,I,""+D,se);if(typeof D=="object"&&D!==null){switch(D.$$typeof){case re:return D.key===ve?L(z,I,D,se):null;case ae:return D.key===ve?A(z,I,D,se):null;case O:return ve=D._init,ee(z,I,ve(D._payload),se)}if(Hn(D)||Y(D))return ve!==null?null:te(z,I,D,se,null);ps(z,D)}return null}function de(z,I,D,se,ve){if(typeof se=="string"&&se!==""||typeof se=="number")return z=z.get(D)||null,j(I,z,""+se,ve);if(typeof se=="object"&&se!==null){switch(se.$$typeof){case re:return z=z.get(se.key===null?D:se.key)||null,L(I,z,se,ve);case ae:return z=z.get(se.key===null?D:se.key)||null,A(I,z,se,ve);case O:var je=se._init;return de(z,I,D,je(se._payload),ve)}if(Hn(se)||Y(se))return z=z.get(D)||null,te(I,z,se,ve,null);ps(I,se)}return null}function ge(z,I,D,se){for(var ve=null,je=null,Ee=I,Re=I=0,Et=null;Ee!==null&&Re<D.length;Re++){Ee.index>Re?(Et=Ee,Ee=null):Et=Ee.sibling;var Qe=ee(z,Ee,D[Re],se);if(Qe===null){Ee===null&&(Ee=Et);break}e&&Ee&&Qe.alternate===null&&t(z,Ee),I=u(Qe,I,Re),je===null?ve=Qe:je.sibling=Qe,je=Qe,Ee=Et}if(Re===D.length)return n(z,Ee),it&&Uo(z,Re),ve;if(Ee===null){for(;Re<D.length;Re++)Ee=oe(z,D[Re],se),Ee!==null&&(I=u(Ee,I,Re),je===null?ve=Ee:je.sibling=Ee,je=Ee);return it&&Uo(z,Re),ve}for(Ee=o(z,Ee);Re<D.length;Re++)Et=de(Ee,z,Re,D[Re],se),Et!==null&&(e&&Et.alternate!==null&&Ee.delete(Et.key===null?Re:Et.key),I=u(Et,I,Re),je===null?ve=Et:je.sibling=Et,je=Et);return e&&Ee.forEach(function(jo){return t(z,jo)}),it&&Uo(z,Re),ve}function ye(z,I,D,se){var ve=Y(D);if(typeof ve!="function")throw Error(i(150));if(D=ve.call(D),D==null)throw Error(i(151));for(var je=ve=null,Ee=I,Re=I=0,Et=null,Qe=D.next();Ee!==null&&!Qe.done;Re++,Qe=D.next()){Ee.index>Re?(Et=Ee,Ee=null):Et=Ee.sibling;var jo=ee(z,Ee,Qe.value,se);if(jo===null){Ee===null&&(Ee=Et);break}e&&Ee&&jo.alternate===null&&t(z,Ee),I=u(jo,I,Re),je===null?ve=jo:je.sibling=jo,je=jo,Ee=Et}if(Qe.done)return n(z,Ee),it&&Uo(z,Re),ve;if(Ee===null){for(;!Qe.done;Re++,Qe=D.next())Qe=oe(z,Qe.value,se),Qe!==null&&(I=u(Qe,I,Re),je===null?ve=Qe:je.sibling=Qe,je=Qe);return it&&Uo(z,Re),ve}for(Ee=o(z,Ee);!Qe.done;Re++,Qe=D.next())Qe=de(Ee,z,Re,Qe.value,se),Qe!==null&&(e&&Qe.alternate!==null&&Ee.delete(Qe.key===null?Re:Qe.key),I=u(Qe,I,Re),je===null?ve=Qe:je.sibling=Qe,je=Qe);return e&&Ee.forEach(function(Ym){return t(z,Ym)}),it&&Uo(z,Re),ve}function ht(z,I,D,se){if(typeof D=="object"&&D!==null&&D.type===ue&&D.key===null&&(D=D.props.children),typeof D=="object"&&D!==null){switch(D.$$typeof){case re:e:{for(var ve=D.key,je=I;je!==null;){if(je.key===ve){if(ve=D.type,ve===ue){if(je.tag===7){n(z,je.sibling),I=s(je,D.props.children),I.return=z,z=I;break e}}else if(je.elementType===ve||typeof ve=="object"&&ve!==null&&ve.$$typeof===O&&Ju(ve)===je.type){n(z,je.sibling),I=s(je,D.props),I.ref=hl(z,je,D),I.return=z,z=I;break e}n(z,je);break}else t(z,je);je=je.sibling}D.type===ue?(I=qo(D.props.children,z.mode,se,D.key),I.return=z,z=I):(se=Ds(D.type,D.key,D.props,null,z.mode,se),se.ref=hl(z,I,D),se.return=z,z=se)}return d(z);case ae:e:{for(je=D.key;I!==null;){if(I.key===je)if(I.tag===4&&I.stateNode.containerInfo===D.containerInfo&&I.stateNode.implementation===D.implementation){n(z,I.sibling),I=s(I,D.children||[]),I.return=z,z=I;break e}else{n(z,I);break}else t(z,I);I=I.sibling}I=Ti(D,z.mode,se),I.return=z,z=I}return d(z);case O:return je=D._init,ht(z,I,je(D._payload),se)}if(Hn(D))return ge(z,I,D,se);if(Y(D))return ye(z,I,D,se);ps(z,D)}return typeof D=="string"&&D!==""||typeof D=="number"?(D=""+D,I!==null&&I.tag===6?(n(z,I.sibling),I=s(I,D),I.return=z,z=I):(n(z,I),I=Pi(D,z.mode,se),I.return=z,z=I),d(z)):n(z,I)}return ht}var Lr=qu(!0),ec=qu(!1),hs=ho(null),_s=null,Rr=null,Fa=null;function Aa(){Fa=Rr=_s=null}function Ba(e){var t=hs.current;rt(hs),e._currentValue=t}function Wa(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function Ir(e,t){_s=e,Fa=Rr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Qt=!0),e.firstContext=null)}function mn(e){var t=e._currentValue;if(Fa!==e)if(e={context:e,memoizedValue:t,next:null},Rr===null){if(_s===null)throw Error(i(308));Rr=e,_s.dependencies={lanes:0,firstContext:e}}else Rr=Rr.next=e;return t}var Vo=null;function Ya(e){Vo===null?Vo=[e]:Vo.push(e)}function tc(e,t,n,o){var s=t.interleaved;return s===null?(n.next=n,Ya(t)):(n.next=s.next,s.next=n),t.interleaved=n,no(e,o)}function no(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var yo=!1;function Ha(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function nc(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function oo(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function xo(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Xe&2)!==0){var s=o.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),o.pending=t,no(e,n)}return s=o.interleaved,s===null?(t.next=t,Ya(o)):(t.next=s.next,s.next=t),o.interleaved=t,no(e,n)}function gs(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,pr(e,n)}}function oc(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var s=null,u=null;if(n=n.firstBaseUpdate,n!==null){do{var d={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};u===null?s=u=d:u=u.next=d,n=n.next}while(n!==null);u===null?s=u=t:u=u.next=t}else s=u=t;n={baseState:o.baseState,firstBaseUpdate:s,lastBaseUpdate:u,shared:o.shared,effects:o.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function ys(e,t,n,o){var s=e.updateQueue;yo=!1;var u=s.firstBaseUpdate,d=s.lastBaseUpdate,j=s.shared.pending;if(j!==null){s.shared.pending=null;var L=j,A=L.next;L.next=null,d===null?u=A:d.next=A,d=L;var te=e.alternate;te!==null&&(te=te.updateQueue,j=te.lastBaseUpdate,j!==d&&(j===null?te.firstBaseUpdate=A:j.next=A,te.lastBaseUpdate=L))}if(u!==null){var oe=s.baseState;d=0,te=A=L=null,j=u;do{var ee=j.lane,de=j.eventTime;if((o&ee)===ee){te!==null&&(te=te.next={eventTime:de,lane:0,tag:j.tag,payload:j.payload,callback:j.callback,next:null});e:{var ge=e,ye=j;switch(ee=t,de=n,ye.tag){case 1:if(ge=ye.payload,typeof ge=="function"){oe=ge.call(de,oe,ee);break e}oe=ge;break e;case 3:ge.flags=ge.flags&-65537|128;case 0:if(ge=ye.payload,ee=typeof ge=="function"?ge.call(de,oe,ee):ge,ee==null)break e;oe=V({},oe,ee);break e;case 2:yo=!0}}j.callback!==null&&j.lane!==0&&(e.flags|=64,ee=s.effects,ee===null?s.effects=[j]:ee.push(j))}else de={eventTime:de,lane:ee,tag:j.tag,payload:j.payload,callback:j.callback,next:null},te===null?(A=te=de,L=oe):te=te.next=de,d|=ee;if(j=j.next,j===null){if(j=s.shared.pending,j===null)break;ee=j,j=ee.next,ee.next=null,s.lastBaseUpdate=ee,s.shared.pending=null}}while(!0);if(te===null&&(L=oe),s.baseState=L,s.firstBaseUpdate=A,s.lastBaseUpdate=te,t=s.shared.interleaved,t!==null){s=t;do d|=s.lane,s=s.next;while(s!==t)}else u===null&&(s.shared.lanes=0);Go|=d,e.lanes=d,e.memoizedState=oe}}function rc(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],s=o.callback;if(s!==null){if(o.callback=null,o=n,typeof s!="function")throw Error(i(191,s));s.call(o)}}}var _l={},Dn=ho(_l),gl=ho(_l),yl=ho(_l);function Xo(e){if(e===_l)throw Error(i(174));return e}function Ua(e,t){switch(tt(yl,t),tt(gl,e),tt(Dn,_l),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:rr(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=rr(t,e)}rt(Dn),tt(Dn,t)}function $r(){rt(Dn),rt(gl),rt(yl)}function lc(e){Xo(yl.current);var t=Xo(Dn.current),n=rr(t,e.type);t!==n&&(tt(gl,e),tt(Dn,n))}function Va(e){gl.current===e&&(rt(Dn),rt(gl))}var ct=ho(0);function xs(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Xa=[];function Qa(){for(var e=0;e<Xa.length;e++)Xa[e]._workInProgressVersionPrimary=null;Xa.length=0}var vs=le.ReactCurrentDispatcher,Ga=le.ReactCurrentBatchConfig,Qo=0,dt=null,wt=null,St=null,bs=!1,xl=!1,vl=0,dm=0;function Ot(){throw Error(i(321))}function Ka(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!bn(e[n],t[n]))return!1;return!0}function Za(e,t,n,o,s,u){if(Qo=u,dt=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,vs.current=e===null||e.memoizedState===null?hm:_m,e=n(o,s),xl){u=0;do{if(xl=!1,vl=0,25<=u)throw Error(i(301));u+=1,St=wt=null,t.updateQueue=null,vs.current=gm,e=n(o,s)}while(xl)}if(vs.current=Cs,t=wt!==null&&wt.next!==null,Qo=0,St=wt=dt=null,bs=!1,t)throw Error(i(300));return e}function Ja(){var e=vl!==0;return vl=0,e}function Fn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return St===null?dt.memoizedState=St=e:St=St.next=e,St}function pn(){if(wt===null){var e=dt.alternate;e=e!==null?e.memoizedState:null}else e=wt.next;var t=St===null?dt.memoizedState:St.next;if(t!==null)St=t,wt=e;else{if(e===null)throw Error(i(310));wt=e,e={memoizedState:wt.memoizedState,baseState:wt.baseState,baseQueue:wt.baseQueue,queue:wt.queue,next:null},St===null?dt.memoizedState=St=e:St=St.next=e}return St}function bl(e,t){return typeof t=="function"?t(e):t}function qa(e){var t=pn(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var o=wt,s=o.baseQueue,u=n.pending;if(u!==null){if(s!==null){var d=s.next;s.next=u.next,u.next=d}o.baseQueue=s=u,n.pending=null}if(s!==null){u=s.next,o=o.baseState;var j=d=null,L=null,A=u;do{var te=A.lane;if((Qo&te)===te)L!==null&&(L=L.next={lane:0,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null}),o=A.hasEagerState?A.eagerState:e(o,A.action);else{var oe={lane:te,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null};L===null?(j=L=oe,d=o):L=L.next=oe,dt.lanes|=te,Go|=te}A=A.next}while(A!==null&&A!==u);L===null?d=o:L.next=j,bn(o,t.memoizedState)||(Qt=!0),t.memoizedState=o,t.baseState=d,t.baseQueue=L,n.lastRenderedState=o}if(e=n.interleaved,e!==null){s=e;do u=s.lane,dt.lanes|=u,Go|=u,s=s.next;while(s!==e)}else s===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function ei(e){var t=pn(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var o=n.dispatch,s=n.pending,u=t.memoizedState;if(s!==null){n.pending=null;var d=s=s.next;do u=e(u,d.action),d=d.next;while(d!==s);bn(u,t.memoizedState)||(Qt=!0),t.memoizedState=u,t.baseQueue===null&&(t.baseState=u),n.lastRenderedState=u}return[u,o]}function sc(){}function ac(e,t){var n=dt,o=pn(),s=t(),u=!bn(o.memoizedState,s);if(u&&(o.memoizedState=s,Qt=!0),o=o.queue,ti(cc.bind(null,n,o,e),[e]),o.getSnapshot!==t||u||St!==null&&St.memoizedState.tag&1){if(n.flags|=2048,wl(9,uc.bind(null,n,o,s,t),void 0,null),jt===null)throw Error(i(349));(Qo&30)!==0||ic(n,t,s)}return s}function ic(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=dt.updateQueue,t===null?(t={lastEffect:null,stores:null},dt.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function uc(e,t,n,o){t.value=n,t.getSnapshot=o,dc(t)&&fc(e)}function cc(e,t,n){return n(function(){dc(t)&&fc(e)})}function dc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!bn(e,n)}catch{return!0}}function fc(e){var t=no(e,1);t!==null&&jn(t,e,1,-1)}function mc(e){var t=Fn();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:bl,lastRenderedState:e},t.queue=e,e=e.dispatch=pm.bind(null,dt,e),[t.memoizedState,e]}function wl(e,t,n,o){return e={tag:e,create:t,destroy:n,deps:o,next:null},t=dt.updateQueue,t===null?(t={lastEffect:null,stores:null},dt.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e)),e}function pc(){return pn().memoizedState}function ws(e,t,n,o){var s=Fn();dt.flags|=e,s.memoizedState=wl(1|t,n,void 0,o===void 0?null:o)}function ks(e,t,n,o){var s=pn();o=o===void 0?null:o;var u=void 0;if(wt!==null){var d=wt.memoizedState;if(u=d.destroy,o!==null&&Ka(o,d.deps)){s.memoizedState=wl(t,n,u,o);return}}dt.flags|=e,s.memoizedState=wl(1|t,n,u,o)}function hc(e,t){return ws(8390656,8,e,t)}function ti(e,t){return ks(2048,8,e,t)}function _c(e,t){return ks(4,2,e,t)}function gc(e,t){return ks(4,4,e,t)}function yc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function xc(e,t,n){return n=n!=null?n.concat([e]):null,ks(4,4,yc.bind(null,t,e),n)}function ni(){}function vc(e,t){var n=pn();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Ka(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function bc(e,t){var n=pn();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Ka(t,o[1])?o[0]:(e=e(),n.memoizedState=[e,t],e)}function wc(e,t,n){return(Qo&21)===0?(e.baseState&&(e.baseState=!1,Qt=!0),e.memoizedState=n):(bn(n,t)||(n=tl(),dt.lanes|=n,Go|=n,e.baseState=!0),t)}function fm(e,t){var n=He;He=n!==0&&4>n?n:4,e(!0);var o=Ga.transition;Ga.transition={};try{e(!1),t()}finally{He=n,Ga.transition=o}}function kc(){return pn().memoizedState}function mm(e,t,n){var o=ko(e);if(n={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null},Cc(e))Sc(t,n);else if(n=tc(e,t,n,o),n!==null){var s=Wt();jn(n,e,o,s),jc(n,t,o)}}function pm(e,t,n){var o=ko(e),s={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null};if(Cc(e))Sc(t,s);else{var u=e.alternate;if(e.lanes===0&&(u===null||u.lanes===0)&&(u=t.lastRenderedReducer,u!==null))try{var d=t.lastRenderedState,j=u(d,n);if(s.hasEagerState=!0,s.eagerState=j,bn(j,d)){var L=t.interleaved;L===null?(s.next=s,Ya(t)):(s.next=L.next,L.next=s),t.interleaved=s;return}}catch{}finally{}n=tc(e,t,s,o),n!==null&&(s=Wt(),jn(n,e,o,s),jc(n,t,o))}}function Cc(e){var t=e.alternate;return e===dt||t!==null&&t===dt}function Sc(e,t){xl=bs=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function jc(e,t,n){if((n&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,pr(e,n)}}var Cs={readContext:mn,useCallback:Ot,useContext:Ot,useEffect:Ot,useImperativeHandle:Ot,useInsertionEffect:Ot,useLayoutEffect:Ot,useMemo:Ot,useReducer:Ot,useRef:Ot,useState:Ot,useDebugValue:Ot,useDeferredValue:Ot,useTransition:Ot,useMutableSource:Ot,useSyncExternalStore:Ot,useId:Ot,unstable_isNewReconciler:!1},hm={readContext:mn,useCallback:function(e,t){return Fn().memoizedState=[e,t===void 0?null:t],e},useContext:mn,useEffect:hc,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ws(4194308,4,yc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ws(4194308,4,e,t)},useInsertionEffect:function(e,t){return ws(4,2,e,t)},useMemo:function(e,t){var n=Fn();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var o=Fn();return t=n!==void 0?n(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=mm.bind(null,dt,e),[o.memoizedState,e]},useRef:function(e){var t=Fn();return e={current:e},t.memoizedState=e},useState:mc,useDebugValue:ni,useDeferredValue:function(e){return Fn().memoizedState=e},useTransition:function(){var e=mc(!1),t=e[0];return e=fm.bind(null,e[1]),Fn().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var o=dt,s=Fn();if(it){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),jt===null)throw Error(i(349));(Qo&30)!==0||ic(o,t,n)}s.memoizedState=n;var u={value:n,getSnapshot:t};return s.queue=u,hc(cc.bind(null,o,u,e),[e]),o.flags|=2048,wl(9,uc.bind(null,o,u,n,t),void 0,null),n},useId:function(){var e=Fn(),t=jt.identifierPrefix;if(it){var n=to,o=eo;n=(o&~(1<<32-en(o)-1)).toString(32)+n,t=":"+t+"R"+n,n=vl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=dm++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},_m={readContext:mn,useCallback:vc,useContext:mn,useEffect:ti,useImperativeHandle:xc,useInsertionEffect:_c,useLayoutEffect:gc,useMemo:bc,useReducer:qa,useRef:pc,useState:function(){return qa(bl)},useDebugValue:ni,useDeferredValue:function(e){var t=pn();return wc(t,wt.memoizedState,e)},useTransition:function(){var e=qa(bl)[0],t=pn().memoizedState;return[e,t]},useMutableSource:sc,useSyncExternalStore:ac,useId:kc,unstable_isNewReconciler:!1},gm={readContext:mn,useCallback:vc,useContext:mn,useEffect:ti,useImperativeHandle:xc,useInsertionEffect:_c,useLayoutEffect:gc,useMemo:bc,useReducer:ei,useRef:pc,useState:function(){return ei(bl)},useDebugValue:ni,useDeferredValue:function(e){var t=pn();return wt===null?t.memoizedState=e:wc(t,wt.memoizedState,e)},useTransition:function(){var e=ei(bl)[0],t=pn().memoizedState;return[e,t]},useMutableSource:sc,useSyncExternalStore:ac,useId:kc,unstable_isNewReconciler:!1};function kn(e,t){if(e&&e.defaultProps){t=V({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function oi(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:V({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ss={isMounted:function(e){return(e=e._reactInternals)?pt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var o=Wt(),s=ko(e),u=oo(o,s);u.payload=t,n!=null&&(u.callback=n),t=xo(e,u,s),t!==null&&(jn(t,e,s,o),gs(t,e,s))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=Wt(),s=ko(e),u=oo(o,s);u.tag=1,u.payload=t,n!=null&&(u.callback=n),t=xo(e,u,s),t!==null&&(jn(t,e,s,o),gs(t,e,s))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Wt(),o=ko(e),s=oo(n,o);s.tag=2,t!=null&&(s.callback=t),t=xo(e,s,o),t!==null&&(jn(t,e,o,n),gs(t,e,o))}};function Ec(e,t,n,o,s,u,d){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,u,d):t.prototype&&t.prototype.isPureReactComponent?!il(n,o)||!il(s,u):!0}function Nc(e,t,n){var o=!1,s=_o,u=t.contextType;return typeof u=="object"&&u!==null?u=mn(u):(s=Xt(t)?Yo:zt.current,o=t.contextTypes,u=(o=o!=null)?Er(e,s):_o),t=new t(n,u),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ss,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=u),t}function Pc(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&Ss.enqueueReplaceState(t,t.state,null)}function ri(e,t,n,o){var s=e.stateNode;s.props=n,s.state=e.memoizedState,s.refs={},Ha(e);var u=t.contextType;typeof u=="object"&&u!==null?s.context=mn(u):(u=Xt(t)?Yo:zt.current,s.context=Er(e,u)),s.state=e.memoizedState,u=t.getDerivedStateFromProps,typeof u=="function"&&(oi(e,t,u,n),s.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(t=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),t!==s.state&&Ss.enqueueReplaceState(s,s.state,null),ys(e,n,s,o),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function Mr(e,t){try{var n="",o=t;do n+=xe(o),o=o.return;while(o);var s=n}catch(u){s=`
Error generating stack: `+u.message+`
`+u.stack}return{value:e,source:t,stack:s,digest:null}}function li(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function si(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var ym=typeof WeakMap=="function"?WeakMap:Map;function Tc(e,t,n){n=oo(-1,n),n.tag=3,n.payload={element:null};var o=t.value;return n.callback=function(){Rs||(Rs=!0,bi=o),si(e,t)},n}function Lc(e,t,n){n=oo(-1,n),n.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var s=t.value;n.payload=function(){return o(s)},n.callback=function(){si(e,t)}}var u=e.stateNode;return u!==null&&typeof u.componentDidCatch=="function"&&(n.callback=function(){si(e,t),typeof o!="function"&&(bo===null?bo=new Set([this]):bo.add(this));var d=t.stack;this.componentDidCatch(t.value,{componentStack:d!==null?d:""})}),n}function Rc(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new ym;var s=new Set;o.set(t,s)}else s=o.get(t),s===void 0&&(s=new Set,o.set(t,s));s.has(n)||(s.add(n),e=Rm.bind(null,e,t,n),t.then(e,e))}function Ic(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function $c(e,t,n,o,s){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=oo(-1,1),t.tag=2,xo(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=s,e)}var xm=le.ReactCurrentOwner,Qt=!1;function Bt(e,t,n,o){t.child=e===null?ec(t,null,n,o):Lr(t,e.child,n,o)}function Mc(e,t,n,o,s){n=n.render;var u=t.ref;return Ir(t,s),o=Za(e,t,n,o,u,s),n=Ja(),e!==null&&!Qt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,ro(e,t,s)):(it&&n&&$a(t),t.flags|=1,Bt(e,t,o,s),t.child)}function zc(e,t,n,o,s){if(e===null){var u=n.type;return typeof u=="function"&&!Ni(u)&&u.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=u,Oc(e,t,u,o,s)):(e=Ds(n.type,null,o,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(u=e.child,(e.lanes&s)===0){var d=u.memoizedProps;if(n=n.compare,n=n!==null?n:il,n(d,o)&&e.ref===t.ref)return ro(e,t,s)}return t.flags|=1,e=So(u,o),e.ref=t.ref,e.return=t,t.child=e}function Oc(e,t,n,o,s){if(e!==null){var u=e.memoizedProps;if(il(u,o)&&e.ref===t.ref)if(Qt=!1,t.pendingProps=o=u,(e.lanes&s)!==0)(e.flags&131072)!==0&&(Qt=!0);else return t.lanes=e.lanes,ro(e,t,s)}return ai(e,t,n,o,s)}function Dc(e,t,n){var o=t.pendingProps,s=o.children,u=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},tt(Or,sn),sn|=n;else{if((n&1073741824)===0)return e=u!==null?u.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,tt(Or,sn),sn|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=u!==null?u.baseLanes:n,tt(Or,sn),sn|=o}else u!==null?(o=u.baseLanes|n,t.memoizedState=null):o=n,tt(Or,sn),sn|=o;return Bt(e,t,s,n),t.child}function Fc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ai(e,t,n,o,s){var u=Xt(n)?Yo:zt.current;return u=Er(t,u),Ir(t,s),n=Za(e,t,n,o,u,s),o=Ja(),e!==null&&!Qt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,ro(e,t,s)):(it&&o&&$a(t),t.flags|=1,Bt(e,t,n,s),t.child)}function Ac(e,t,n,o,s){if(Xt(n)){var u=!0;us(t)}else u=!1;if(Ir(t,s),t.stateNode===null)Es(e,t),Nc(t,n,o),ri(t,n,o,s),o=!0;else if(e===null){var d=t.stateNode,j=t.memoizedProps;d.props=j;var L=d.context,A=n.contextType;typeof A=="object"&&A!==null?A=mn(A):(A=Xt(n)?Yo:zt.current,A=Er(t,A));var te=n.getDerivedStateFromProps,oe=typeof te=="function"||typeof d.getSnapshotBeforeUpdate=="function";oe||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(j!==o||L!==A)&&Pc(t,d,o,A),yo=!1;var ee=t.memoizedState;d.state=ee,ys(t,o,d,s),L=t.memoizedState,j!==o||ee!==L||Vt.current||yo?(typeof te=="function"&&(oi(t,n,te,o),L=t.memoizedState),(j=yo||Ec(t,n,j,o,ee,L,A))?(oe||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount()),typeof d.componentDidMount=="function"&&(t.flags|=4194308)):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=L),d.props=o,d.state=L,d.context=A,o=j):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{d=t.stateNode,nc(e,t),j=t.memoizedProps,A=t.type===t.elementType?j:kn(t.type,j),d.props=A,oe=t.pendingProps,ee=d.context,L=n.contextType,typeof L=="object"&&L!==null?L=mn(L):(L=Xt(n)?Yo:zt.current,L=Er(t,L));var de=n.getDerivedStateFromProps;(te=typeof de=="function"||typeof d.getSnapshotBeforeUpdate=="function")||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(j!==oe||ee!==L)&&Pc(t,d,o,L),yo=!1,ee=t.memoizedState,d.state=ee,ys(t,o,d,s);var ge=t.memoizedState;j!==oe||ee!==ge||Vt.current||yo?(typeof de=="function"&&(oi(t,n,de,o),ge=t.memoizedState),(A=yo||Ec(t,n,A,o,ee,ge,L)||!1)?(te||typeof d.UNSAFE_componentWillUpdate!="function"&&typeof d.componentWillUpdate!="function"||(typeof d.componentWillUpdate=="function"&&d.componentWillUpdate(o,ge,L),typeof d.UNSAFE_componentWillUpdate=="function"&&d.UNSAFE_componentWillUpdate(o,ge,L)),typeof d.componentDidUpdate=="function"&&(t.flags|=4),typeof d.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof d.componentDidUpdate!="function"||j===e.memoizedProps&&ee===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||j===e.memoizedProps&&ee===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=ge),d.props=o,d.state=ge,d.context=L,o=A):(typeof d.componentDidUpdate!="function"||j===e.memoizedProps&&ee===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||j===e.memoizedProps&&ee===e.memoizedState||(t.flags|=1024),o=!1)}return ii(e,t,n,o,u,s)}function ii(e,t,n,o,s,u){Fc(e,t);var d=(t.flags&128)!==0;if(!o&&!d)return s&&Uu(t,n,!1),ro(e,t,u);o=t.stateNode,xm.current=t;var j=d&&typeof n.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&d?(t.child=Lr(t,e.child,null,u),t.child=Lr(t,null,j,u)):Bt(e,t,j,u),t.memoizedState=o.state,s&&Uu(t,n,!0),t.child}function Bc(e){var t=e.stateNode;t.pendingContext?Yu(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Yu(e,t.context,!1),Ua(e,t.containerInfo)}function Wc(e,t,n,o,s){return Tr(),Da(s),t.flags|=256,Bt(e,t,n,o),t.child}var ui={dehydrated:null,treeContext:null,retryLane:0};function ci(e){return{baseLanes:e,cachePool:null,transitions:null}}function Yc(e,t,n){var o=t.pendingProps,s=ct.current,u=!1,d=(t.flags&128)!==0,j;if((j=d)||(j=e!==null&&e.memoizedState===null?!1:(s&2)!==0),j?(u=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),tt(ct,s&1),e===null)return Oa(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(d=o.children,e=o.fallback,u?(o=t.mode,u=t.child,d={mode:"hidden",children:d},(o&1)===0&&u!==null?(u.childLanes=0,u.pendingProps=d):u=Fs(d,o,0,null),e=qo(e,o,n,null),u.return=t,e.return=t,u.sibling=e,t.child=u,t.child.memoizedState=ci(n),t.memoizedState=ui,e):di(t,d));if(s=e.memoizedState,s!==null&&(j=s.dehydrated,j!==null))return vm(e,t,d,o,j,s,n);if(u){u=o.fallback,d=t.mode,s=e.child,j=s.sibling;var L={mode:"hidden",children:o.children};return(d&1)===0&&t.child!==s?(o=t.child,o.childLanes=0,o.pendingProps=L,t.deletions=null):(o=So(s,L),o.subtreeFlags=s.subtreeFlags&14680064),j!==null?u=So(j,u):(u=qo(u,d,n,null),u.flags|=2),u.return=t,o.return=t,o.sibling=u,t.child=o,o=u,u=t.child,d=e.child.memoizedState,d=d===null?ci(n):{baseLanes:d.baseLanes|n,cachePool:null,transitions:d.transitions},u.memoizedState=d,u.childLanes=e.childLanes&~n,t.memoizedState=ui,o}return u=e.child,e=u.sibling,o=So(u,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=n),o.return=t,o.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=o,t.memoizedState=null,o}function di(e,t){return t=Fs({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function js(e,t,n,o){return o!==null&&Da(o),Lr(t,e.child,null,n),e=di(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function vm(e,t,n,o,s,u,d){if(n)return t.flags&256?(t.flags&=-257,o=li(Error(i(422))),js(e,t,d,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(u=o.fallback,s=t.mode,o=Fs({mode:"visible",children:o.children},s,0,null),u=qo(u,s,d,null),u.flags|=2,o.return=t,u.return=t,o.sibling=u,t.child=o,(t.mode&1)!==0&&Lr(t,e.child,null,d),t.child.memoizedState=ci(d),t.memoizedState=ui,u);if((t.mode&1)===0)return js(e,t,d,null);if(s.data==="$!"){if(o=s.nextSibling&&s.nextSibling.dataset,o)var j=o.dgst;return o=j,u=Error(i(419)),o=li(u,o,void 0),js(e,t,d,o)}if(j=(d&e.childLanes)!==0,Qt||j){if(o=jt,o!==null){switch(d&-d){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=(s&(o.suspendedLanes|d))!==0?0:s,s!==0&&s!==u.retryLane&&(u.retryLane=s,no(e,s),jn(o,e,s,-1))}return Ei(),o=li(Error(i(421))),js(e,t,d,o)}return s.data==="$?"?(t.flags|=128,t.child=e.child,t=Im.bind(null,e),s._reactRetry=t,null):(e=u.treeContext,ln=po(s.nextSibling),rn=t,it=!0,wn=null,e!==null&&(dn[fn++]=eo,dn[fn++]=to,dn[fn++]=Ho,eo=e.id,to=e.overflow,Ho=t),t=di(t,o.children),t.flags|=4096,t)}function Hc(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),Wa(e.return,t,n)}function fi(e,t,n,o,s){var u=e.memoizedState;u===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:s}:(u.isBackwards=t,u.rendering=null,u.renderingStartTime=0,u.last=o,u.tail=n,u.tailMode=s)}function Uc(e,t,n){var o=t.pendingProps,s=o.revealOrder,u=o.tail;if(Bt(e,t,o.children,n),o=ct.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Hc(e,n,t);else if(e.tag===19)Hc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(tt(ct,o),(t.mode&1)===0)t.memoizedState=null;else switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&xs(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),fi(t,!1,s,n,u);break;case"backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&xs(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}fi(t,!0,n,null,u);break;case"together":fi(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Es(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function ro(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Go|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=So(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=So(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function bm(e,t,n){switch(t.tag){case 3:Bc(t),Tr();break;case 5:lc(t);break;case 1:Xt(t.type)&&us(t);break;case 4:Ua(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,s=t.memoizedProps.value;tt(hs,o._currentValue),o._currentValue=s;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(tt(ct,ct.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Yc(e,t,n):(tt(ct,ct.current&1),e=ro(e,t,n),e!==null?e.sibling:null);tt(ct,ct.current&1);break;case 19:if(o=(n&t.childLanes)!==0,(e.flags&128)!==0){if(o)return Uc(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),tt(ct,ct.current),o)break;return null;case 22:case 23:return t.lanes=0,Dc(e,t,n)}return ro(e,t,n)}var Vc,mi,Xc,Qc;Vc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},mi=function(){},Xc=function(e,t,n,o){var s=e.memoizedProps;if(s!==o){e=t.stateNode,Xo(Dn.current);var u=null;switch(n){case"input":s=tr(e,s),o=tr(e,o),u=[];break;case"select":s=V({},s,{value:void 0}),o=V({},o,{value:void 0}),u=[];break;case"textarea":s=or(e,s),o=or(e,o),u=[];break;default:typeof s.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=ss)}To(n,o);var d;n=null;for(A in s)if(!o.hasOwnProperty(A)&&s.hasOwnProperty(A)&&s[A]!=null)if(A==="style"){var j=s[A];for(d in j)j.hasOwnProperty(d)&&(n||(n={}),n[d]="")}else A!=="dangerouslySetInnerHTML"&&A!=="children"&&A!=="suppressContentEditableWarning"&&A!=="suppressHydrationWarning"&&A!=="autoFocus"&&(m.hasOwnProperty(A)?u||(u=[]):(u=u||[]).push(A,null));for(A in o){var L=o[A];if(j=s!=null?s[A]:void 0,o.hasOwnProperty(A)&&L!==j&&(L!=null||j!=null))if(A==="style")if(j){for(d in j)!j.hasOwnProperty(d)||L&&L.hasOwnProperty(d)||(n||(n={}),n[d]="");for(d in L)L.hasOwnProperty(d)&&j[d]!==L[d]&&(n||(n={}),n[d]=L[d])}else n||(u||(u=[]),u.push(A,n)),n=L;else A==="dangerouslySetInnerHTML"?(L=L?L.__html:void 0,j=j?j.__html:void 0,L!=null&&j!==L&&(u=u||[]).push(A,L)):A==="children"?typeof L!="string"&&typeof L!="number"||(u=u||[]).push(A,""+L):A!=="suppressContentEditableWarning"&&A!=="suppressHydrationWarning"&&(m.hasOwnProperty(A)?(L!=null&&A==="onScroll"&&ot("scroll",e),u||j===L||(u=[])):(u=u||[]).push(A,L))}n&&(u=u||[]).push("style",n);var A=u;(t.updateQueue=A)&&(t.flags|=4)}},Qc=function(e,t,n,o){n!==o&&(t.flags|=4)};function kl(e,t){if(!it)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Dt(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,o|=s.subtreeFlags&14680064,o|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,o|=s.subtreeFlags,o|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function wm(e,t,n){var o=t.pendingProps;switch(Ma(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Dt(t),null;case 1:return Xt(t.type)&&is(),Dt(t),null;case 3:return o=t.stateNode,$r(),rt(Vt),rt(zt),Qa(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(ms(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,wn!==null&&(Ci(wn),wn=null))),mi(e,t),Dt(t),null;case 5:Va(t);var s=Xo(yl.current);if(n=t.type,e!==null&&t.stateNode!=null)Xc(e,t,n,o,s),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(i(166));return Dt(t),null}if(e=Xo(Dn.current),ms(t)){o=t.stateNode,n=t.type;var u=t.memoizedProps;switch(o[On]=t,o[ml]=u,e=(t.mode&1)!==0,n){case"dialog":ot("cancel",o),ot("close",o);break;case"iframe":case"object":case"embed":ot("load",o);break;case"video":case"audio":for(s=0;s<cl.length;s++)ot(cl[s],o);break;case"source":ot("error",o);break;case"img":case"image":case"link":ot("error",o),ot("load",o);break;case"details":ot("toggle",o);break;case"input":Vr(o,u),ot("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!u.multiple},ot("invalid",o);break;case"textarea":Pn(o,u),ot("invalid",o)}To(n,u),s=null;for(var d in u)if(u.hasOwnProperty(d)){var j=u[d];d==="children"?typeof j=="string"?o.textContent!==j&&(u.suppressHydrationWarning!==!0&&ls(o.textContent,j,e),s=["children",j]):typeof j=="number"&&o.textContent!==""+j&&(u.suppressHydrationWarning!==!0&&ls(o.textContent,j,e),s=["children",""+j]):m.hasOwnProperty(d)&&j!=null&&d==="onScroll"&&ot("scroll",o)}switch(n){case"input":an(o),De(o,u,!0);break;case"textarea":an(o),Xr(o);break;case"select":case"option":break;default:typeof u.onClick=="function"&&(o.onclick=ss)}o=s,t.updateQueue=o,o!==null&&(t.flags|=4)}else{d=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Qr(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=d.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=d.createElement(n,{is:o.is}):(e=d.createElement(n),n==="select"&&(d=e,o.multiple?d.multiple=!0:o.size&&(d.size=o.size))):e=d.createElementNS(e,n),e[On]=t,e[ml]=o,Vc(e,t,!1,!1),t.stateNode=e;e:{switch(d=Lo(n,o),n){case"dialog":ot("cancel",e),ot("close",e),s=o;break;case"iframe":case"object":case"embed":ot("load",e),s=o;break;case"video":case"audio":for(s=0;s<cl.length;s++)ot(cl[s],e);s=o;break;case"source":ot("error",e),s=o;break;case"img":case"image":case"link":ot("error",e),ot("load",e),s=o;break;case"details":ot("toggle",e),s=o;break;case"input":Vr(e,o),s=tr(e,o),ot("invalid",e);break;case"option":s=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},s=V({},o,{value:void 0}),ot("invalid",e);break;case"textarea":Pn(e,o),s=or(e,o),ot("invalid",e);break;default:s=o}To(n,s),j=s;for(u in j)if(j.hasOwnProperty(u)){var L=j[u];u==="style"?Bl(e,L):u==="dangerouslySetInnerHTML"?(L=L?L.__html:void 0,L!=null&&Al(e,L)):u==="children"?typeof L=="string"?(n!=="textarea"||L!=="")&&Pt(e,L):typeof L=="number"&&Pt(e,""+L):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(m.hasOwnProperty(u)?L!=null&&u==="onScroll"&&ot("scroll",e):L!=null&&ne(e,u,L,d))}switch(n){case"input":an(e),De(e,o,!1);break;case"textarea":an(e),Xr(e);break;case"option":o.value!=null&&e.setAttribute("value",""+$e(o.value));break;case"select":e.multiple=!!o.multiple,u=o.value,u!=null?It(e,!!o.multiple,u,!1):o.defaultValue!=null&&It(e,!!o.multiple,o.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=ss)}switch(n){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Dt(t),null;case 6:if(e&&t.stateNode!=null)Qc(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(i(166));if(n=Xo(yl.current),Xo(Dn.current),ms(t)){if(o=t.stateNode,n=t.memoizedProps,o[On]=t,(u=o.nodeValue!==n)&&(e=rn,e!==null))switch(e.tag){case 3:ls(o.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ls(o.nodeValue,n,(e.mode&1)!==0)}u&&(t.flags|=4)}else o=(n.nodeType===9?n:n.ownerDocument).createTextNode(o),o[On]=t,t.stateNode=o}return Dt(t),null;case 13:if(rt(ct),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(it&&ln!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Zu(),Tr(),t.flags|=98560,u=!1;else if(u=ms(t),o!==null&&o.dehydrated!==null){if(e===null){if(!u)throw Error(i(318));if(u=t.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(i(317));u[On]=t}else Tr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Dt(t),u=!1}else wn!==null&&(Ci(wn),wn=null),u=!0;if(!u)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(ct.current&1)!==0?kt===0&&(kt=3):Ei())),t.updateQueue!==null&&(t.flags|=4),Dt(t),null);case 4:return $r(),mi(e,t),e===null&&dl(t.stateNode.containerInfo),Dt(t),null;case 10:return Ba(t.type._context),Dt(t),null;case 17:return Xt(t.type)&&is(),Dt(t),null;case 19:if(rt(ct),u=t.memoizedState,u===null)return Dt(t),null;if(o=(t.flags&128)!==0,d=u.rendering,d===null)if(o)kl(u,!1);else{if(kt!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(d=xs(e),d!==null){for(t.flags|=128,kl(u,!1),o=d.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=n,n=t.child;n!==null;)u=n,e=o,u.flags&=14680066,d=u.alternate,d===null?(u.childLanes=0,u.lanes=e,u.child=null,u.subtreeFlags=0,u.memoizedProps=null,u.memoizedState=null,u.updateQueue=null,u.dependencies=null,u.stateNode=null):(u.childLanes=d.childLanes,u.lanes=d.lanes,u.child=d.child,u.subtreeFlags=0,u.deletions=null,u.memoizedProps=d.memoizedProps,u.memoizedState=d.memoizedState,u.updateQueue=d.updateQueue,u.type=d.type,e=d.dependencies,u.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return tt(ct,ct.current&1|2),t.child}e=e.sibling}u.tail!==null&&lt()>Dr&&(t.flags|=128,o=!0,kl(u,!1),t.lanes=4194304)}else{if(!o)if(e=xs(d),e!==null){if(t.flags|=128,o=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),kl(u,!0),u.tail===null&&u.tailMode==="hidden"&&!d.alternate&&!it)return Dt(t),null}else 2*lt()-u.renderingStartTime>Dr&&n!==1073741824&&(t.flags|=128,o=!0,kl(u,!1),t.lanes=4194304);u.isBackwards?(d.sibling=t.child,t.child=d):(n=u.last,n!==null?n.sibling=d:t.child=d,u.last=d)}return u.tail!==null?(t=u.tail,u.rendering=t,u.tail=t.sibling,u.renderingStartTime=lt(),t.sibling=null,n=ct.current,tt(ct,o?n&1|2:n&1),t):(Dt(t),null);case 22:case 23:return ji(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(sn&1073741824)!==0&&(Dt(t),t.subtreeFlags&6&&(t.flags|=8192)):Dt(t),null;case 24:return null;case 25:return null}throw Error(i(156,t.tag))}function km(e,t){switch(Ma(t),t.tag){case 1:return Xt(t.type)&&is(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return $r(),rt(Vt),rt(zt),Qa(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Va(t),null;case 13:if(rt(ct),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));Tr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return rt(ct),null;case 4:return $r(),null;case 10:return Ba(t.type._context),null;case 22:case 23:return ji(),null;case 24:return null;default:return null}}var Ns=!1,Ft=!1,Cm=typeof WeakSet=="function"?WeakSet:Set,me=null;function zr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(o){mt(e,t,o)}else n.current=null}function pi(e,t,n){try{n()}catch(o){mt(e,t,o)}}var Gc=!1;function Sm(e,t){if(ja=Bo,e=Eu(),ya(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var o=n.getSelection&&n.getSelection();if(o&&o.rangeCount!==0){n=o.anchorNode;var s=o.anchorOffset,u=o.focusNode;o=o.focusOffset;try{n.nodeType,u.nodeType}catch{n=null;break e}var d=0,j=-1,L=-1,A=0,te=0,oe=e,ee=null;t:for(;;){for(var de;oe!==n||s!==0&&oe.nodeType!==3||(j=d+s),oe!==u||o!==0&&oe.nodeType!==3||(L=d+o),oe.nodeType===3&&(d+=oe.nodeValue.length),(de=oe.firstChild)!==null;)ee=oe,oe=de;for(;;){if(oe===e)break t;if(ee===n&&++A===s&&(j=d),ee===u&&++te===o&&(L=d),(de=oe.nextSibling)!==null)break;oe=ee,ee=oe.parentNode}oe=de}n=j===-1||L===-1?null:{start:j,end:L}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ea={focusedElem:e,selectionRange:n},Bo=!1,me=t;me!==null;)if(t=me,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,me=e;else for(;me!==null;){t=me;try{var ge=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(ge!==null){var ye=ge.memoizedProps,ht=ge.memoizedState,z=t.stateNode,I=z.getSnapshotBeforeUpdate(t.elementType===t.type?ye:kn(t.type,ye),ht);z.__reactInternalSnapshotBeforeUpdate=I}break;case 3:var D=t.stateNode.containerInfo;D.nodeType===1?D.textContent="":D.nodeType===9&&D.documentElement&&D.removeChild(D.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(i(163))}}catch(se){mt(t,t.return,se)}if(e=t.sibling,e!==null){e.return=t.return,me=e;break}me=t.return}return ge=Gc,Gc=!1,ge}function Cl(e,t,n){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var s=o=o.next;do{if((s.tag&e)===e){var u=s.destroy;s.destroy=void 0,u!==void 0&&pi(t,n,u)}s=s.next}while(s!==o)}}function Ps(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var o=n.create;n.destroy=o()}n=n.next}while(n!==t)}}function hi(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Kc(e){var t=e.alternate;t!==null&&(e.alternate=null,Kc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[On],delete t[ml],delete t[La],delete t[am],delete t[im])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Zc(e){return e.tag===5||e.tag===3||e.tag===4}function Jc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Zc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function _i(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ss));else if(o!==4&&(e=e.child,e!==null))for(_i(e,t,n),e=e.sibling;e!==null;)_i(e,t,n),e=e.sibling}function gi(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(gi(e,t,n),e=e.sibling;e!==null;)gi(e,t,n),e=e.sibling}var Lt=null,Cn=!1;function vo(e,t,n){for(n=n.child;n!==null;)qc(e,t,n),n=n.sibling}function qc(e,t,n){if($t&&typeof $t.onCommitFiberUnmount=="function")try{$t.onCommitFiberUnmount(Qn,n)}catch{}switch(n.tag){case 5:Ft||zr(n,t);case 6:var o=Lt,s=Cn;Lt=null,vo(e,t,n),Lt=o,Cn=s,Lt!==null&&(Cn?(e=Lt,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Lt.removeChild(n.stateNode));break;case 18:Lt!==null&&(Cn?(e=Lt,n=n.stateNode,e.nodeType===8?Ta(e.parentNode,n):e.nodeType===1&&Ta(e,n),fo(e)):Ta(Lt,n.stateNode));break;case 4:o=Lt,s=Cn,Lt=n.stateNode.containerInfo,Cn=!0,vo(e,t,n),Lt=o,Cn=s;break;case 0:case 11:case 14:case 15:if(!Ft&&(o=n.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){s=o=o.next;do{var u=s,d=u.destroy;u=u.tag,d!==void 0&&((u&2)!==0||(u&4)!==0)&&pi(n,t,d),s=s.next}while(s!==o)}vo(e,t,n);break;case 1:if(!Ft&&(zr(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=n.memoizedProps,o.state=n.memoizedState,o.componentWillUnmount()}catch(j){mt(n,t,j)}vo(e,t,n);break;case 21:vo(e,t,n);break;case 22:n.mode&1?(Ft=(o=Ft)||n.memoizedState!==null,vo(e,t,n),Ft=o):vo(e,t,n);break;default:vo(e,t,n)}}function ed(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Cm),t.forEach(function(o){var s=$m.bind(null,e,o);n.has(o)||(n.add(o),o.then(s,s))})}}function Sn(e,t){var n=t.deletions;if(n!==null)for(var o=0;o<n.length;o++){var s=n[o];try{var u=e,d=t,j=d;e:for(;j!==null;){switch(j.tag){case 5:Lt=j.stateNode,Cn=!1;break e;case 3:Lt=j.stateNode.containerInfo,Cn=!0;break e;case 4:Lt=j.stateNode.containerInfo,Cn=!0;break e}j=j.return}if(Lt===null)throw Error(i(160));qc(u,d,s),Lt=null,Cn=!1;var L=s.alternate;L!==null&&(L.return=null),s.return=null}catch(A){mt(s,t,A)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)td(t,e),t=t.sibling}function td(e,t){var n=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Sn(t,e),An(e),o&4){try{Cl(3,e,e.return),Ps(3,e)}catch(ye){mt(e,e.return,ye)}try{Cl(5,e,e.return)}catch(ye){mt(e,e.return,ye)}}break;case 1:Sn(t,e),An(e),o&512&&n!==null&&zr(n,n.return);break;case 5:if(Sn(t,e),An(e),o&512&&n!==null&&zr(n,n.return),e.flags&32){var s=e.stateNode;try{Pt(s,"")}catch(ye){mt(e,e.return,ye)}}if(o&4&&(s=e.stateNode,s!=null)){var u=e.memoizedProps,d=n!==null?n.memoizedProps:u,j=e.type,L=e.updateQueue;if(e.updateQueue=null,L!==null)try{j==="input"&&u.type==="radio"&&u.name!=null&&No(s,u),Lo(j,d);var A=Lo(j,u);for(d=0;d<L.length;d+=2){var te=L[d],oe=L[d+1];te==="style"?Bl(s,oe):te==="dangerouslySetInnerHTML"?Al(s,oe):te==="children"?Pt(s,oe):ne(s,te,oe,A)}switch(j){case"input":nr(s,u);break;case"textarea":Tn(s,u);break;case"select":var ee=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!u.multiple;var de=u.value;de!=null?It(s,!!u.multiple,de,!1):ee!==!!u.multiple&&(u.defaultValue!=null?It(s,!!u.multiple,u.defaultValue,!0):It(s,!!u.multiple,u.multiple?[]:"",!1))}s[ml]=u}catch(ye){mt(e,e.return,ye)}}break;case 6:if(Sn(t,e),An(e),o&4){if(e.stateNode===null)throw Error(i(162));s=e.stateNode,u=e.memoizedProps;try{s.nodeValue=u}catch(ye){mt(e,e.return,ye)}}break;case 3:if(Sn(t,e),An(e),o&4&&n!==null&&n.memoizedState.isDehydrated)try{fo(t.containerInfo)}catch(ye){mt(e,e.return,ye)}break;case 4:Sn(t,e),An(e);break;case 13:Sn(t,e),An(e),s=e.child,s.flags&8192&&(u=s.memoizedState!==null,s.stateNode.isHidden=u,!u||s.alternate!==null&&s.alternate.memoizedState!==null||(vi=lt())),o&4&&ed(e);break;case 22:if(te=n!==null&&n.memoizedState!==null,e.mode&1?(Ft=(A=Ft)||te,Sn(t,e),Ft=A):Sn(t,e),An(e),o&8192){if(A=e.memoizedState!==null,(e.stateNode.isHidden=A)&&!te&&(e.mode&1)!==0)for(me=e,te=e.child;te!==null;){for(oe=me=te;me!==null;){switch(ee=me,de=ee.child,ee.tag){case 0:case 11:case 14:case 15:Cl(4,ee,ee.return);break;case 1:zr(ee,ee.return);var ge=ee.stateNode;if(typeof ge.componentWillUnmount=="function"){o=ee,n=ee.return;try{t=o,ge.props=t.memoizedProps,ge.state=t.memoizedState,ge.componentWillUnmount()}catch(ye){mt(o,n,ye)}}break;case 5:zr(ee,ee.return);break;case 22:if(ee.memoizedState!==null){rd(oe);continue}}de!==null?(de.return=ee,me=de):rd(oe)}te=te.sibling}e:for(te=null,oe=e;;){if(oe.tag===5){if(te===null){te=oe;try{s=oe.stateNode,A?(u=s.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none"):(j=oe.stateNode,L=oe.memoizedProps.style,d=L!=null&&L.hasOwnProperty("display")?L.display:null,j.style.display=lr("display",d))}catch(ye){mt(e,e.return,ye)}}}else if(oe.tag===6){if(te===null)try{oe.stateNode.nodeValue=A?"":oe.memoizedProps}catch(ye){mt(e,e.return,ye)}}else if((oe.tag!==22&&oe.tag!==23||oe.memoizedState===null||oe===e)&&oe.child!==null){oe.child.return=oe,oe=oe.child;continue}if(oe===e)break e;for(;oe.sibling===null;){if(oe.return===null||oe.return===e)break e;te===oe&&(te=null),oe=oe.return}te===oe&&(te=null),oe.sibling.return=oe.return,oe=oe.sibling}}break;case 19:Sn(t,e),An(e),o&4&&ed(e);break;case 21:break;default:Sn(t,e),An(e)}}function An(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Zc(n)){var o=n;break e}n=n.return}throw Error(i(160))}switch(o.tag){case 5:var s=o.stateNode;o.flags&32&&(Pt(s,""),o.flags&=-33);var u=Jc(e);gi(e,u,s);break;case 3:case 4:var d=o.stateNode.containerInfo,j=Jc(e);_i(e,j,d);break;default:throw Error(i(161))}}catch(L){mt(e,e.return,L)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function jm(e,t,n){me=e,nd(e)}function nd(e,t,n){for(var o=(e.mode&1)!==0;me!==null;){var s=me,u=s.child;if(s.tag===22&&o){var d=s.memoizedState!==null||Ns;if(!d){var j=s.alternate,L=j!==null&&j.memoizedState!==null||Ft;j=Ns;var A=Ft;if(Ns=d,(Ft=L)&&!A)for(me=s;me!==null;)d=me,L=d.child,d.tag===22&&d.memoizedState!==null?ld(s):L!==null?(L.return=d,me=L):ld(s);for(;u!==null;)me=u,nd(u),u=u.sibling;me=s,Ns=j,Ft=A}od(e)}else(s.subtreeFlags&8772)!==0&&u!==null?(u.return=s,me=u):od(e)}}function od(e){for(;me!==null;){var t=me;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Ft||Ps(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!Ft)if(n===null)o.componentDidMount();else{var s=t.elementType===t.type?n.memoizedProps:kn(t.type,n.memoizedProps);o.componentDidUpdate(s,n.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var u=t.updateQueue;u!==null&&rc(t,u,o);break;case 3:var d=t.updateQueue;if(d!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}rc(t,d,n)}break;case 5:var j=t.stateNode;if(n===null&&t.flags&4){n=j;var L=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":L.autoFocus&&n.focus();break;case"img":L.src&&(n.src=L.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var A=t.alternate;if(A!==null){var te=A.memoizedState;if(te!==null){var oe=te.dehydrated;oe!==null&&fo(oe)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(i(163))}Ft||t.flags&512&&hi(t)}catch(ee){mt(t,t.return,ee)}}if(t===e){me=null;break}if(n=t.sibling,n!==null){n.return=t.return,me=n;break}me=t.return}}function rd(e){for(;me!==null;){var t=me;if(t===e){me=null;break}var n=t.sibling;if(n!==null){n.return=t.return,me=n;break}me=t.return}}function ld(e){for(;me!==null;){var t=me;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ps(4,t)}catch(L){mt(t,n,L)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var s=t.return;try{o.componentDidMount()}catch(L){mt(t,s,L)}}var u=t.return;try{hi(t)}catch(L){mt(t,u,L)}break;case 5:var d=t.return;try{hi(t)}catch(L){mt(t,d,L)}}}catch(L){mt(t,t.return,L)}if(t===e){me=null;break}var j=t.sibling;if(j!==null){j.return=t.return,me=j;break}me=t.return}}var Em=Math.ceil,Ts=le.ReactCurrentDispatcher,yi=le.ReactCurrentOwner,hn=le.ReactCurrentBatchConfig,Xe=0,jt=null,yt=null,Rt=0,sn=0,Or=ho(0),kt=0,Sl=null,Go=0,Ls=0,xi=0,jl=null,Gt=null,vi=0,Dr=1/0,lo=null,Rs=!1,bi=null,bo=null,Is=!1,wo=null,$s=0,El=0,wi=null,Ms=-1,zs=0;function Wt(){return(Xe&6)!==0?lt():Ms!==-1?Ms:Ms=lt()}function ko(e){return(e.mode&1)===0?1:(Xe&2)!==0&&Rt!==0?Rt&-Rt:cm.transition!==null?(zs===0&&(zs=tl()),zs):(e=He,e!==0||(e=window.event,e=e===void 0?16:G(e.type)),e)}function jn(e,t,n,o){if(50<El)throw El=0,wi=null,Error(i(185));Oo(e,n,o),((Xe&2)===0||e!==jt)&&(e===jt&&((Xe&2)===0&&(Ls|=n),kt===4&&Co(e,Rt)),Kt(e,o),n===1&&Xe===0&&(t.mode&1)===0&&(Dr=lt()+500,cs&&go()))}function Kt(e,t){var n=e.callbackNode;Ql(e,t);var o=In(e,e===jt?Rt:0);if(o===0)n!==null&&cn(n),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(n!=null&&cn(n),t===1)e.tag===0?um(ad.bind(null,e)):Vu(ad.bind(null,e)),lm(function(){(Xe&6)===0&&go()}),n=null;else{switch(Je(o)){case 1:n=qr;break;case 4:n=dr;break;case 16:n=$o;break;case 536870912:n=el;break;default:n=$o}n=hd(n,sd.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function sd(e,t){if(Ms=-1,zs=0,(Xe&6)!==0)throw Error(i(327));var n=e.callbackNode;if(Fr()&&e.callbackNode!==n)return null;var o=In(e,e===jt?Rt:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=Os(e,o);else{t=o;var s=Xe;Xe|=2;var u=ud();(jt!==e||Rt!==t)&&(lo=null,Dr=lt()+500,Zo(e,t));do try{Tm();break}catch(j){id(e,j)}while(!0);Aa(),Ts.current=u,Xe=s,yt!==null?t=0:(jt=null,Rt=0,t=kt)}if(t!==0){if(t===2&&(s=uo(e),s!==0&&(o=s,t=ki(e,s))),t===1)throw n=Sl,Zo(e,0),Co(e,o),Kt(e,lt()),n;if(t===6)Co(e,o);else{if(s=e.current.alternate,(o&30)===0&&!Nm(s)&&(t=Os(e,o),t===2&&(u=uo(e),u!==0&&(o=u,t=ki(e,u))),t===1))throw n=Sl,Zo(e,0),Co(e,o),Kt(e,lt()),n;switch(e.finishedWork=s,e.finishedLanes=o,t){case 0:case 1:throw Error(i(345));case 2:Jo(e,Gt,lo);break;case 3:if(Co(e,o),(o&130023424)===o&&(t=vi+500-lt(),10<t)){if(In(e,0)!==0)break;if(s=e.suspendedLanes,(s&o)!==o){Wt(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=Pa(Jo.bind(null,e,Gt,lo),t);break}Jo(e,Gt,lo);break;case 4:if(Co(e,o),(o&4194240)===o)break;for(t=e.eventTimes,s=-1;0<o;){var d=31-en(o);u=1<<d,d=t[d],d>s&&(s=d),o&=~u}if(o=s,o=lt()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*Em(o/1960))-o,10<o){e.timeoutHandle=Pa(Jo.bind(null,e,Gt,lo),o);break}Jo(e,Gt,lo);break;case 5:Jo(e,Gt,lo);break;default:throw Error(i(329))}}}return Kt(e,lt()),e.callbackNode===n?sd.bind(null,e):null}function ki(e,t){var n=jl;return e.current.memoizedState.isDehydrated&&(Zo(e,t).flags|=256),e=Os(e,t),e!==2&&(t=Gt,Gt=n,t!==null&&Ci(t)),e}function Ci(e){Gt===null?Gt=e:Gt.push.apply(Gt,e)}function Nm(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var o=0;o<n.length;o++){var s=n[o],u=s.getSnapshot;s=s.value;try{if(!bn(u(),s))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Co(e,t){for(t&=~xi,t&=~Ls,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-en(t),o=1<<n;e[n]=-1,t&=~o}}function ad(e){if((Xe&6)!==0)throw Error(i(327));Fr();var t=In(e,0);if((t&1)===0)return Kt(e,lt()),null;var n=Os(e,t);if(e.tag!==0&&n===2){var o=uo(e);o!==0&&(t=o,n=ki(e,o))}if(n===1)throw n=Sl,Zo(e,0),Co(e,t),Kt(e,lt()),n;if(n===6)throw Error(i(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Jo(e,Gt,lo),Kt(e,lt()),null}function Si(e,t){var n=Xe;Xe|=1;try{return e(t)}finally{Xe=n,Xe===0&&(Dr=lt()+500,cs&&go())}}function Ko(e){wo!==null&&wo.tag===0&&(Xe&6)===0&&Fr();var t=Xe;Xe|=1;var n=hn.transition,o=He;try{if(hn.transition=null,He=1,e)return e()}finally{He=o,hn.transition=n,Xe=t,(Xe&6)===0&&go()}}function ji(){sn=Or.current,rt(Or)}function Zo(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,rm(n)),yt!==null)for(n=yt.return;n!==null;){var o=n;switch(Ma(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&is();break;case 3:$r(),rt(Vt),rt(zt),Qa();break;case 5:Va(o);break;case 4:$r();break;case 13:rt(ct);break;case 19:rt(ct);break;case 10:Ba(o.type._context);break;case 22:case 23:ji()}n=n.return}if(jt=e,yt=e=So(e.current,null),Rt=sn=t,kt=0,Sl=null,xi=Ls=Go=0,Gt=jl=null,Vo!==null){for(t=0;t<Vo.length;t++)if(n=Vo[t],o=n.interleaved,o!==null){n.interleaved=null;var s=o.next,u=n.pending;if(u!==null){var d=u.next;u.next=s,o.next=d}n.pending=o}Vo=null}return e}function id(e,t){do{var n=yt;try{if(Aa(),vs.current=Cs,bs){for(var o=dt.memoizedState;o!==null;){var s=o.queue;s!==null&&(s.pending=null),o=o.next}bs=!1}if(Qo=0,St=wt=dt=null,xl=!1,vl=0,yi.current=null,n===null||n.return===null){kt=1,Sl=t,yt=null;break}e:{var u=e,d=n.return,j=n,L=t;if(t=Rt,j.flags|=32768,L!==null&&typeof L=="object"&&typeof L.then=="function"){var A=L,te=j,oe=te.tag;if((te.mode&1)===0&&(oe===0||oe===11||oe===15)){var ee=te.alternate;ee?(te.updateQueue=ee.updateQueue,te.memoizedState=ee.memoizedState,te.lanes=ee.lanes):(te.updateQueue=null,te.memoizedState=null)}var de=Ic(d);if(de!==null){de.flags&=-257,$c(de,d,j,u,t),de.mode&1&&Rc(u,A,t),t=de,L=A;var ge=t.updateQueue;if(ge===null){var ye=new Set;ye.add(L),t.updateQueue=ye}else ge.add(L);break e}else{if((t&1)===0){Rc(u,A,t),Ei();break e}L=Error(i(426))}}else if(it&&j.mode&1){var ht=Ic(d);if(ht!==null){(ht.flags&65536)===0&&(ht.flags|=256),$c(ht,d,j,u,t),Da(Mr(L,j));break e}}u=L=Mr(L,j),kt!==4&&(kt=2),jl===null?jl=[u]:jl.push(u),u=d;do{switch(u.tag){case 3:u.flags|=65536,t&=-t,u.lanes|=t;var z=Tc(u,L,t);oc(u,z);break e;case 1:j=L;var I=u.type,D=u.stateNode;if((u.flags&128)===0&&(typeof I.getDerivedStateFromError=="function"||D!==null&&typeof D.componentDidCatch=="function"&&(bo===null||!bo.has(D)))){u.flags|=65536,t&=-t,u.lanes|=t;var se=Lc(u,j,t);oc(u,se);break e}}u=u.return}while(u!==null)}dd(n)}catch(ve){t=ve,yt===n&&n!==null&&(yt=n=n.return);continue}break}while(!0)}function ud(){var e=Ts.current;return Ts.current=Cs,e===null?Cs:e}function Ei(){(kt===0||kt===3||kt===2)&&(kt=4),jt===null||(Go&268435455)===0&&(Ls&268435455)===0||Co(jt,Rt)}function Os(e,t){var n=Xe;Xe|=2;var o=ud();(jt!==e||Rt!==t)&&(lo=null,Zo(e,t));do try{Pm();break}catch(s){id(e,s)}while(!0);if(Aa(),Xe=n,Ts.current=o,yt!==null)throw Error(i(261));return jt=null,Rt=0,kt}function Pm(){for(;yt!==null;)cd(yt)}function Tm(){for(;yt!==null&&!Vl();)cd(yt)}function cd(e){var t=pd(e.alternate,e,sn);e.memoizedProps=e.pendingProps,t===null?dd(e):yt=t,yi.current=null}function dd(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=wm(n,t,sn),n!==null){yt=n;return}}else{if(n=km(n,t),n!==null){n.flags&=32767,yt=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{kt=6,yt=null;return}}if(t=t.sibling,t!==null){yt=t;return}yt=t=e}while(t!==null);kt===0&&(kt=5)}function Jo(e,t,n){var o=He,s=hn.transition;try{hn.transition=null,He=1,Lm(e,t,n,o)}finally{hn.transition=s,He=o}return null}function Lm(e,t,n,o){do Fr();while(wo!==null);if((Xe&6)!==0)throw Error(i(327));n=e.finishedWork;var s=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(i(177));e.callbackNode=null,e.callbackPriority=0;var u=n.lanes|n.childLanes;if(Gl(e,u),e===jt&&(yt=jt=null,Rt=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||Is||(Is=!0,hd($o,function(){return Fr(),null})),u=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||u){u=hn.transition,hn.transition=null;var d=He;He=1;var j=Xe;Xe|=4,yi.current=null,Sm(e,n),td(n,e),Zf(Ea),Bo=!!ja,Ea=ja=null,e.current=n,jm(n),ao(),Xe=j,He=d,hn.transition=u}else e.current=n;if(Is&&(Is=!1,wo=e,$s=s),u=e.pendingLanes,u===0&&(bo=null),fr(n.stateNode),Kt(e,lt()),t!==null)for(o=e.onRecoverableError,n=0;n<t.length;n++)s=t[n],o(s.value,{componentStack:s.stack,digest:s.digest});if(Rs)throw Rs=!1,e=bi,bi=null,e;return($s&1)!==0&&e.tag!==0&&Fr(),u=e.pendingLanes,(u&1)!==0?e===wi?El++:(El=0,wi=e):El=0,go(),null}function Fr(){if(wo!==null){var e=Je($s),t=hn.transition,n=He;try{if(hn.transition=null,He=16>e?16:e,wo===null)var o=!1;else{if(e=wo,wo=null,$s=0,(Xe&6)!==0)throw Error(i(331));var s=Xe;for(Xe|=4,me=e.current;me!==null;){var u=me,d=u.child;if((me.flags&16)!==0){var j=u.deletions;if(j!==null){for(var L=0;L<j.length;L++){var A=j[L];for(me=A;me!==null;){var te=me;switch(te.tag){case 0:case 11:case 15:Cl(8,te,u)}var oe=te.child;if(oe!==null)oe.return=te,me=oe;else for(;me!==null;){te=me;var ee=te.sibling,de=te.return;if(Kc(te),te===A){me=null;break}if(ee!==null){ee.return=de,me=ee;break}me=de}}}var ge=u.alternate;if(ge!==null){var ye=ge.child;if(ye!==null){ge.child=null;do{var ht=ye.sibling;ye.sibling=null,ye=ht}while(ye!==null)}}me=u}}if((u.subtreeFlags&2064)!==0&&d!==null)d.return=u,me=d;else e:for(;me!==null;){if(u=me,(u.flags&2048)!==0)switch(u.tag){case 0:case 11:case 15:Cl(9,u,u.return)}var z=u.sibling;if(z!==null){z.return=u.return,me=z;break e}me=u.return}}var I=e.current;for(me=I;me!==null;){d=me;var D=d.child;if((d.subtreeFlags&2064)!==0&&D!==null)D.return=d,me=D;else e:for(d=I;me!==null;){if(j=me,(j.flags&2048)!==0)try{switch(j.tag){case 0:case 11:case 15:Ps(9,j)}}catch(ve){mt(j,j.return,ve)}if(j===d){me=null;break e}var se=j.sibling;if(se!==null){se.return=j.return,me=se;break e}me=j.return}}if(Xe=s,go(),$t&&typeof $t.onPostCommitFiberRoot=="function")try{$t.onPostCommitFiberRoot(Qn,e)}catch{}o=!0}return o}finally{He=n,hn.transition=t}}return!1}function fd(e,t,n){t=Mr(n,t),t=Tc(e,t,1),e=xo(e,t,1),t=Wt(),e!==null&&(Oo(e,1,t),Kt(e,t))}function mt(e,t,n){if(e.tag===3)fd(e,e,n);else for(;t!==null;){if(t.tag===3){fd(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(bo===null||!bo.has(o))){e=Mr(n,e),e=Lc(t,e,1),t=xo(t,e,1),e=Wt(),t!==null&&(Oo(t,1,e),Kt(t,e));break}}t=t.return}}function Rm(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),t=Wt(),e.pingedLanes|=e.suspendedLanes&n,jt===e&&(Rt&n)===n&&(kt===4||kt===3&&(Rt&130023424)===Rt&&500>lt()-vi?Zo(e,0):xi|=n),Kt(e,t)}function md(e,t){t===0&&((e.mode&1)===0?t=1:(t=At,At<<=1,(At&130023424)===0&&(At=4194304)));var n=Wt();e=no(e,t),e!==null&&(Oo(e,t,n),Kt(e,n))}function Im(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),md(e,n)}function $m(e,t){var n=0;switch(e.tag){case 13:var o=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(i(314))}o!==null&&o.delete(t),md(e,n)}var pd;pd=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Vt.current)Qt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return Qt=!1,bm(e,t,n);Qt=(e.flags&131072)!==0}else Qt=!1,it&&(t.flags&1048576)!==0&&Xu(t,fs,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;Es(e,t),e=t.pendingProps;var s=Er(t,zt.current);Ir(t,n),s=Za(null,t,o,e,s,n);var u=Ja();return t.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Xt(o)?(u=!0,us(t)):u=!1,t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,Ha(t),s.updater=Ss,t.stateNode=s,s._reactInternals=t,ri(t,o,e,n),t=ii(null,t,o,!0,u,n)):(t.tag=0,it&&u&&$a(t),Bt(null,t,s,n),t=t.child),t;case 16:o=t.elementType;e:{switch(Es(e,t),e=t.pendingProps,s=o._init,o=s(o._payload),t.type=o,s=t.tag=zm(o),e=kn(o,e),s){case 0:t=ai(null,t,o,e,n);break e;case 1:t=Ac(null,t,o,e,n);break e;case 11:t=Mc(null,t,o,e,n);break e;case 14:t=zc(null,t,o,kn(o.type,e),n);break e}throw Error(i(306,o,""))}return t;case 0:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),ai(e,t,o,s,n);case 1:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),Ac(e,t,o,s,n);case 3:e:{if(Bc(t),e===null)throw Error(i(387));o=t.pendingProps,u=t.memoizedState,s=u.element,nc(e,t),ys(t,o,null,n);var d=t.memoizedState;if(o=d.element,u.isDehydrated)if(u={element:o,isDehydrated:!1,cache:d.cache,pendingSuspenseBoundaries:d.pendingSuspenseBoundaries,transitions:d.transitions},t.updateQueue.baseState=u,t.memoizedState=u,t.flags&256){s=Mr(Error(i(423)),t),t=Wc(e,t,o,n,s);break e}else if(o!==s){s=Mr(Error(i(424)),t),t=Wc(e,t,o,n,s);break e}else for(ln=po(t.stateNode.containerInfo.firstChild),rn=t,it=!0,wn=null,n=ec(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Tr(),o===s){t=ro(e,t,n);break e}Bt(e,t,o,n)}t=t.child}return t;case 5:return lc(t),e===null&&Oa(t),o=t.type,s=t.pendingProps,u=e!==null?e.memoizedProps:null,d=s.children,Na(o,s)?d=null:u!==null&&Na(o,u)&&(t.flags|=32),Fc(e,t),Bt(e,t,d,n),t.child;case 6:return e===null&&Oa(t),null;case 13:return Yc(e,t,n);case 4:return Ua(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Lr(t,null,o,n):Bt(e,t,o,n),t.child;case 11:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),Mc(e,t,o,s,n);case 7:return Bt(e,t,t.pendingProps,n),t.child;case 8:return Bt(e,t,t.pendingProps.children,n),t.child;case 12:return Bt(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(o=t.type._context,s=t.pendingProps,u=t.memoizedProps,d=s.value,tt(hs,o._currentValue),o._currentValue=d,u!==null)if(bn(u.value,d)){if(u.children===s.children&&!Vt.current){t=ro(e,t,n);break e}}else for(u=t.child,u!==null&&(u.return=t);u!==null;){var j=u.dependencies;if(j!==null){d=u.child;for(var L=j.firstContext;L!==null;){if(L.context===o){if(u.tag===1){L=oo(-1,n&-n),L.tag=2;var A=u.updateQueue;if(A!==null){A=A.shared;var te=A.pending;te===null?L.next=L:(L.next=te.next,te.next=L),A.pending=L}}u.lanes|=n,L=u.alternate,L!==null&&(L.lanes|=n),Wa(u.return,n,t),j.lanes|=n;break}L=L.next}}else if(u.tag===10)d=u.type===t.type?null:u.child;else if(u.tag===18){if(d=u.return,d===null)throw Error(i(341));d.lanes|=n,j=d.alternate,j!==null&&(j.lanes|=n),Wa(d,n,t),d=u.sibling}else d=u.child;if(d!==null)d.return=u;else for(d=u;d!==null;){if(d===t){d=null;break}if(u=d.sibling,u!==null){u.return=d.return,d=u;break}d=d.return}u=d}Bt(e,t,s.children,n),t=t.child}return t;case 9:return s=t.type,o=t.pendingProps.children,Ir(t,n),s=mn(s),o=o(s),t.flags|=1,Bt(e,t,o,n),t.child;case 14:return o=t.type,s=kn(o,t.pendingProps),s=kn(o.type,s),zc(e,t,o,s,n);case 15:return Oc(e,t,t.type,t.pendingProps,n);case 17:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),Es(e,t),t.tag=1,Xt(o)?(e=!0,us(t)):e=!1,Ir(t,n),Nc(t,o,s),ri(t,o,s,n),ii(null,t,o,!0,e,n);case 19:return Uc(e,t,n);case 22:return Dc(e,t,n)}throw Error(i(156,t.tag))};function hd(e,t){return cr(e,t)}function Mm(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _n(e,t,n,o){return new Mm(e,t,n,o)}function Ni(e){return e=e.prototype,!(!e||!e.isReactComponent)}function zm(e){if(typeof e=="function")return Ni(e)?1:0;if(e!=null){if(e=e.$$typeof,e===fe)return 11;if(e===Le)return 14}return 2}function So(e,t){var n=e.alternate;return n===null?(n=_n(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Ds(e,t,n,o,s,u){var d=2;if(o=e,typeof e=="function")Ni(e)&&(d=1);else if(typeof e=="string")d=5;else e:switch(e){case ue:return qo(n.children,s,u,t);case v:d=8,s|=8;break;case U:return e=_n(12,n,t,s|2),e.elementType=U,e.lanes=u,e;case Oe:return e=_n(13,n,t,s),e.elementType=Oe,e.lanes=u,e;case ze:return e=_n(19,n,t,s),e.elementType=ze,e.lanes=u,e;case W:return Fs(n,s,u,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case be:d=10;break e;case K:d=9;break e;case fe:d=11;break e;case Le:d=14;break e;case O:d=16,o=null;break e}throw Error(i(130,e==null?e:typeof e,""))}return t=_n(d,n,t,s),t.elementType=e,t.type=o,t.lanes=u,t}function qo(e,t,n,o){return e=_n(7,e,o,t),e.lanes=n,e}function Fs(e,t,n,o){return e=_n(22,e,o,t),e.elementType=W,e.lanes=n,e.stateNode={isHidden:!1},e}function Pi(e,t,n){return e=_n(6,e,null,t),e.lanes=n,e}function Ti(e,t,n){return t=_n(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Om(e,t,n,o,s){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=zo(0),this.expirationTimes=zo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=zo(0),this.identifierPrefix=o,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function Li(e,t,n,o,s,u,d,j,L){return e=new Om(e,t,n,j,L),t===1?(t=1,u===!0&&(t|=8)):t=0,u=_n(3,null,null,t),e.current=u,u.stateNode=e,u.memoizedState={element:o,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ha(u),e}function Dm(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ae,key:o==null?null:""+o,children:e,containerInfo:t,implementation:n}}function _d(e){if(!e)return _o;e=e._reactInternals;e:{if(pt(e)!==e||e.tag!==1)throw Error(i(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Xt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(i(171))}if(e.tag===1){var n=e.type;if(Xt(n))return Hu(e,n,t)}return t}function gd(e,t,n,o,s,u,d,j,L){return e=Li(n,o,!0,e,s,u,d,j,L),e.context=_d(null),n=e.current,o=Wt(),s=ko(n),u=oo(o,s),u.callback=t??null,xo(n,u,s),e.current.lanes=s,Oo(e,s,o),Kt(e,o),e}function As(e,t,n,o){var s=t.current,u=Wt(),d=ko(s);return n=_d(n),t.context===null?t.context=n:t.pendingContext=n,t=oo(u,d),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=xo(s,t,d),e!==null&&(jn(e,s,d,u),gs(e,s,d)),d}function Bs(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function yd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Ri(e,t){yd(e,t),(e=e.alternate)&&yd(e,t)}function Fm(){return null}var xd=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ii(e){this._internalRoot=e}Ws.prototype.render=Ii.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));As(e,t,null,null)},Ws.prototype.unmount=Ii.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ko(function(){As(null,e,null,null)}),t[Jn]=null}};function Ws(e){this._internalRoot=e}Ws.prototype.unstable_scheduleHydration=function(e){if(e){var t=ol();e={blockedOn:null,target:e,priority:t};for(var n=0;n<tn.length&&t!==0&&t<tn[n].priority;n++);tn.splice(n,0,e),n===0&&_r(e)}};function $i(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ys(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function vd(){}function Am(e,t,n,o,s){if(s){if(typeof o=="function"){var u=o;o=function(){var A=Bs(d);u.call(A)}}var d=gd(t,o,e,0,null,!1,!1,"",vd);return e._reactRootContainer=d,e[Jn]=d.current,dl(e.nodeType===8?e.parentNode:e),Ko(),d}for(;s=e.lastChild;)e.removeChild(s);if(typeof o=="function"){var j=o;o=function(){var A=Bs(L);j.call(A)}}var L=Li(e,0,!1,null,null,!1,!1,"",vd);return e._reactRootContainer=L,e[Jn]=L.current,dl(e.nodeType===8?e.parentNode:e),Ko(function(){As(t,L,n,o)}),L}function Hs(e,t,n,o,s){var u=n._reactRootContainer;if(u){var d=u;if(typeof s=="function"){var j=s;s=function(){var L=Bs(d);j.call(L)}}As(t,d,e,s)}else d=Am(n,t,e,s,o);return Bs(d)}nl=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=vn(t.pendingLanes);n!==0&&(pr(t,n|1),Kt(t,lt()),(Xe&6)===0&&(Dr=lt()+500,go()))}break;case 13:Ko(function(){var o=no(e,1);if(o!==null){var s=Wt();jn(o,e,1,s)}}),Ri(e,1)}},hr=function(e){if(e.tag===13){var t=no(e,134217728);if(t!==null){var n=Wt();jn(t,e,134217728,n)}Ri(e,134217728)}},Kl=function(e){if(e.tag===13){var t=ko(e),n=no(e,t);if(n!==null){var o=Wt();jn(n,e,t,o)}Ri(e,t)}},ol=function(){return He},Do=function(e,t){var n=He;try{return He=e,t()}finally{He=n}},Gr=function(e,t,n){switch(t){case"input":if(nr(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var s=as(o);if(!s)throw Error(i(90));Ur(o),nr(o,s)}}}break;case"textarea":Tn(e,n);break;case"select":t=n.value,t!=null&&It(e,!!n.multiple,t,!1)}},Xn=Si,qt=Ko;var Bm={usingClientEntryPoint:!1,Events:[pl,Sr,as,Vn,ut,Si]},Nl={findFiberByHostInstance:Wo,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Wm={bundleType:Nl.bundleType,version:Nl.version,rendererPackageName:Nl.rendererPackageName,rendererConfig:Nl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:le.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Rn(e),e===null?null:e.stateNode},findFiberByHostInstance:Nl.findFiberByHostInstance||Fm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Us=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Us.isDisabled&&Us.supportsFiber)try{Qn=Us.inject(Wm),$t=Us}catch{}}return Zt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Bm,Zt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!$i(t))throw Error(i(200));return Dm(e,t,null,n)},Zt.createRoot=function(e,t){if(!$i(e))throw Error(i(299));var n=!1,o="",s=xd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=Li(e,1,!1,null,null,n,!1,o,s),e[Jn]=t.current,dl(e.nodeType===8?e.parentNode:e),new Ii(t)},Zt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(i(188)):(e=Object.keys(e).join(","),Error(i(268,e)));return e=Rn(t),e=e===null?null:e.stateNode,e},Zt.flushSync=function(e){return Ko(e)},Zt.hydrate=function(e,t,n){if(!Ys(t))throw Error(i(200));return Hs(null,e,t,!0,n)},Zt.hydrateRoot=function(e,t,n){if(!$i(e))throw Error(i(405));var o=n!=null&&n.hydratedSources||null,s=!1,u="",d=xd;if(n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(u=n.identifierPrefix),n.onRecoverableError!==void 0&&(d=n.onRecoverableError)),t=gd(t,null,e,1,n??null,s,!1,u,d),e[Jn]=t.current,dl(e),o)for(e=0;e<o.length;e++)n=o[e],s=n._getVersion,s=s(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,s]:t.mutableSourceEagerHydrationData.push(n,s);return new Ws(t)},Zt.render=function(e,t,n){if(!Ys(t))throw Error(i(200));return Hs(null,e,t,!1,n)},Zt.unmountComponentAtNode=function(e){if(!Ys(e))throw Error(i(40));return e._reactRootContainer?(Ko(function(){Hs(null,null,e,!1,function(){e._reactRootContainer=null,e[Jn]=null})}),!0):!1},Zt.unstable_batchedUpdates=Si,Zt.unstable_renderSubtreeIntoContainer=function(e,t,n,o){if(!Ys(n))throw Error(i(200));if(e==null||e._reactInternals===void 0)throw Error(i(38));return Hs(e,t,n,!1,o)},Zt.version="18.3.1-next-f1338f8080-20240426",Zt}var Nd;function sf(){if(Nd)return Oi.exports;Nd=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(a){console.error(a)}}return r(),Oi.exports=Gm(),Oi.exports}var Pd;function Km(){if(Pd)return Vs;Pd=1;var r=sf();return Vs.createRoot=r.createRoot,Vs.hydrateRoot=r.hydrateRoot,Vs}var Zm=Km();const Jm={},Td=r=>{let a;const i=new Set,c=(w,T)=>{const _=typeof w=="function"?w(a):w;if(!Object.is(_,a)){const N=a;a=T??(typeof _!="object"||_===null)?_:Object.assign({},a,_),i.forEach(x=>x(a,N))}},m=()=>a,f={setState:c,getState:m,getInitialState:()=>$,subscribe:w=>(i.add(w),()=>i.delete(w)),destroy:()=>{(Jm?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),i.clear()}},$=a=r(c,m,f);return f},qm=r=>r?Td(r):Td;var Ai={exports:{}},Bi={},Wi={exports:{}},Yi={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ld;function ep(){if(Ld)return Yi;Ld=1;var r=Fl();function a(T,_){return T===_&&(T!==0||1/T===1/_)||T!==T&&_!==_}var i=typeof Object.is=="function"?Object.is:a,c=r.useState,m=r.useEffect,h=r.useLayoutEffect,p=r.useDebugValue;function y(T,_){var N=_(),x=c({inst:{value:N,getSnapshot:_}}),g=x[0].inst,E=x[1];return h(function(){g.value=N,g.getSnapshot=_,f(g)&&E({inst:g})},[T,N,_]),m(function(){return f(g)&&E({inst:g}),T(function(){f(g)&&E({inst:g})})},[T]),p(N),N}function f(T){var _=T.getSnapshot;T=T.value;try{var N=_();return!i(T,N)}catch{return!0}}function $(T,_){return _()}var w=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?$:y;return Yi.useSyncExternalStore=r.useSyncExternalStore!==void 0?r.useSyncExternalStore:w,Yi}var Rd;function tp(){return Rd||(Rd=1,Wi.exports=ep()),Wi.exports}/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Id;function np(){if(Id)return Bi;Id=1;var r=Fl(),a=tp();function i($,w){return $===w&&($!==0||1/$===1/w)||$!==$&&w!==w}var c=typeof Object.is=="function"?Object.is:i,m=a.useSyncExternalStore,h=r.useRef,p=r.useEffect,y=r.useMemo,f=r.useDebugValue;return Bi.useSyncExternalStoreWithSelector=function($,w,T,_,N){var x=h(null);if(x.current===null){var g={hasValue:!1,value:null};x.current=g}else g=x.current;x=y(function(){function k(ae){if(!J){if(J=!0,ne=ae,ae=_(ae),N!==void 0&&g.hasValue){var ue=g.value;if(N(ue,ae))return le=ue}return le=ae}if(ue=le,c(ne,ae))return ue;var v=_(ae);return N!==void 0&&N(ue,v)?(ne=ae,ue):(ne=ae,le=v)}var J=!1,ne,le,re=T===void 0?null:T;return[function(){return k(w())},re===null?void 0:function(){return k(re())}]},[w,T,_,N]);var E=m($,x[0],x[1]);return p(function(){g.hasValue=!0,g.value=E},[E]),f(E),E},Bi}var $d;function op(){return $d||($d=1,Ai.exports=np()),Ai.exports}var rp=op();const lp=rf(rp),af={},{useDebugValue:sp}=lf,{useSyncExternalStoreWithSelector:ap}=lp;let Md=!1;const ip=r=>r;function up(r,a=ip,i){(af?"production":void 0)!=="production"&&i&&!Md&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),Md=!0);const c=ap(r.subscribe,r.getState,r.getServerState||r.getInitialState,a,i);return sp(c),c}const zd=r=>{(af?"production":void 0)!=="production"&&typeof r!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const a=typeof r=="function"?qm(r):r,i=(c,m)=>up(a,c,m);return Object.assign(i,a),i},cp=r=>r?zd(r):zd,Od={iphone:{w:400,h:868},ipad:{w:500,h:716},mac:{w:640,h:400},watch:{w:205,h:251},android:{w:400,h:711}},oa={iphone:{deviceScale:92,deviceTop:15,deviceAngle:8},ipad:{deviceScale:92,deviceTop:15,deviceAngle:8},mac:{deviceScale:85,deviceTop:20,deviceAngle:0},watch:{deviceScale:80,deviceTop:22,deviceAngle:0},android:{deviceScale:92,deviceTop:15,deviceAngle:8}},dp={iphone:"iphone",android:"iphone",ipad:"ipad",mac:"mac",watch:"watch"};function uf(r,a){if(r==="android")return"generic-phone";const i=dp[r]??"iphone",c=a.filter(m=>m.category===i).sort((m,h)=>h.year-m.year)[0];return c?c.id:i==="ipad"?"ipad-pro-13":"generic-phone"}function fp(r,a,i){const c=uf(a,i);return r.map(m=>m.type!=="device"||m.frame===c&&(m.deviceColor??"")===""?m:{...m,frame:c,deviceColor:""})}function Xs(r,a,i){var h;const c=a.screens[r],m=oa[i]??oa.iphone;return{screenIndex:r,headline:c?c.headline:"New Screen",subtitle:c?c.subtitle??"":"",style:"minimal",layout:"center",font:a.theme.font,fontWeight:a.theme.fontWeight,headlineSize:a.theme.headlineSize??0,subtitleSize:a.theme.subtitleSize??0,headlineRotation:0,subtitleRotation:0,colors:{primary:a.theme.colors.primary,secondary:a.theme.colors.secondary,background:a.theme.colors.background,text:a.theme.colors.text,subtitle:a.theme.colors.subtitle??"#64748B"},frameId:a.frames.ios??a.frames.android??"",deviceColor:a.frames.deviceColor??"",frameStyle:a.frames.style==="3d"?"flat":a.frames.style,composition:"single",deviceScale:m.deviceScale,deviceTop:m.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:m.deviceAngle,deviceTilt:0,headlineGradient:null,subtitleGradient:null,autoSizeHeadline:!0,autoSizeSubtitle:!1,headlineLineHeight:0,headlineLetterSpacing:0,headlineTextTransform:"",headlineFontStyle:"",subtitleOpacity:0,subtitleLetterSpacing:0,subtitleTextTransform:"",spotlight:null,annotations:[],textPositions:{headline:null,subtitle:null},screenshotDataUrl:null,screenshotName:((h=c==null?void 0:c.screenshot)==null?void 0:h.split("/").pop())??null,screenshotDims:null,backgroundType:"solid",backgroundColor:"#ffffff",backgroundGradient:{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"},backgroundImageDataUrl:null,backgroundOverlay:null,deviceShadow:null,borderSimulation:null,cornerRadius:0,loupe:null,callouts:[],overlays:[],extraScreenshots:[]}}const mp=50;let Yr=[],na=[],zl=!1;function xt(r){return JSON.parse(JSON.stringify(r))}function En(r){zl||(Yr.push({screens:xt(r.screens),panoramicElements:xt(r.panoramicElements),panoramicBackground:xt(r.panoramicBackground),panoramicEffects:xt(r.panoramicEffects),selectedScreen:r.selectedScreen,selectedElementIndex:r.selectedElementIndex}),na=[],Yr.length>mp&&Yr.shift())}const X=cp((r,a)=>({config:null,platform:"iphone",previewW:400,previewH:868,selectedScreen:0,activeTab:"background",locale:"default",previewBg:"dark",renderVersion:0,isPanoramic:!1,panoramicFrameCount:5,panoramicBackground:{type:"solid",color:"#ffffff"},panoramicElements:[],panoramicEffects:{spotlight:null,annotations:[],overlays:[]},selectedElementIndex:null,fonts:[],frames:[],deviceFamilies:[],koubouAvailable:!1,sizes:{},exportSize:"",exportRenderer:"playwright",screens:[],setConfig:i=>r({config:i}),setPlatform:i=>r({platform:i}),setPreviewSize:(i,c)=>r({previewW:i,previewH:c}),setSelectedScreen:i=>r({selectedScreen:i}),setActiveTab:i=>r({activeTab:i}),setLocale:i=>r({locale:i}),setPreviewBg:i=>r({previewBg:i}),setExportSize:i=>r({exportSize:i}),setExportRenderer:i=>r({exportRenderer:i}),setFonts:i=>r({fonts:i}),setFrames:i=>r({frames:i}),setDeviceFamilies:i=>r({deviceFamilies:i}),setKoubouAvailable:i=>r({koubouAvailable:i}),setSizes:i=>r({sizes:i}),updateScreen:(i,c)=>r(m=>{const h=[...m.screens],p=h[i];return p?(En(m),h[i]={...p,...c},{screens:h}):m}),triggerRender:()=>r(i=>({renderVersion:i.renderVersion+1})),initScreens:(i,c)=>{const m=i.mode==="panoramic",h=i.screens.length>0?i.screens.map((y,f)=>Xs(f,i,c)):[],p=i.panoramic?{panoramicFrameCount:i.frameCount??5,panoramicBackground:i.panoramic.background,panoramicElements:i.panoramic.elements}:{};r({config:i,isPanoramic:m,screens:h,selectedScreen:0,selectedElementIndex:null,...p})},addScreen:()=>r(i=>{const{screens:c,config:m,platform:h}=i;if(!m)return i;En(i);const p=c[c.length-1],y=Xs(0,m,h);return y.screenIndex=c.length,y.headline=`Screen ${c.length+1}`,y.subtitle="",p&&(y.style=p.style,y.layout=p.layout,y.font=p.font,y.fontWeight=p.fontWeight,y.colors={...p.colors},y.frameId=p.frameId,y.deviceColor=p.deviceColor,y.frameStyle=p.frameStyle,y.composition=p.composition,y.deviceScale=p.deviceScale,y.deviceTop=p.deviceTop),{screens:[...c,y],selectedScreen:c.length}}),removeScreen:i=>r(c=>{if(c.screens.length<=1)return c;En(c);const m=c.screens.filter((p,y)=>y!==i).map((p,y)=>({...p,screenIndex:y}));let h=c.selectedScreen;return h>=m.length?h=m.length-1:h>i&&h--,{screens:m,selectedScreen:h}}),moveScreen:(i,c)=>r(m=>{if(c<0||c>=m.screens.length)return m;En(m);const h=[...m.screens],[p]=h.splice(i,1);return p?(h.splice(c,0,p),{screens:h.map((y,f)=>({...y,screenIndex:f})),selectedScreen:c}):m}),togglePanoramic:()=>r(i=>{var m;if(i.isPanoramic){if(i.screens.length===0&&i.config){const h=i.platform;return i.config.screens.length>0?{isPanoramic:!1,screens:i.config.screens.map((y,f)=>Xs(f,i.config,h)),selectedScreen:0}:{isPanoramic:!1,screens:[Xs(0,i.config,h)],selectedScreen:0}}return{isPanoramic:!1}}const c={isPanoramic:!0,selectedElementIndex:null};if(i.panoramicElements.length===0&&i.config&&i.screens.length>0){const h=i.config.theme.colors,p=i.screens.length;c.panoramicFrameCount=p,c.panoramicBackground={type:"solid",color:"#ffffff"};const y=[];for(let f=0;f<p;f++){const $=i.screens[f],w=f/p*100,T=w+100/p/2;y.push({type:"device",screenshot:((m=i.config.screens[f])==null?void 0:m.screenshot)??`screenshots/screen-${f+1}.png`,frame:$.frameId||void 0,x:T-6,y:20,width:12,rotation:$.deviceRotation||0,z:5}),$.headline&&y.push({type:"text",content:$.headline,x:w+2,y:3,fontSize:3,color:h.text??"#FFFFFF",fontWeight:i.config.theme.fontWeight??700,fontStyle:"normal",textAlign:"left",lineHeight:1.15,maxWidth:Math.floor(100/p)-4,z:10})}c.panoramicElements=y}else i.panoramicElements.length===0&&i.config&&i.panoramicBackground.type==="solid"&&(!i.panoramicBackground.color||i.panoramicBackground.color==="#000000")&&(c.panoramicBackground={type:"solid",color:"#ffffff"});return c}),setSelectedElement:i=>r({selectedElementIndex:i}),updatePanoramicBackground:i=>r(c=>(En(c),{panoramicBackground:{...c.panoramicBackground,...i}})),updatePanoramicElement:(i,c)=>r(m=>{const h=[...m.panoramicElements],p=h[i];return p?(En(m),h[i]={...p,...c},{panoramicElements:h}):m}),syncPanoramicDevicesForPlatform:i=>r(c=>{const m=fp(c.panoramicElements,i,c.deviceFamilies);return m.some((p,y)=>c.panoramicElements[y]!==p)?(En(c),{panoramicElements:m}):c}),addPanoramicElement:i=>r(c=>(En(c),{panoramicElements:[...c.panoramicElements,i],selectedElementIndex:c.panoramicElements.length})),removePanoramicElement:i=>r(c=>{En(c);const m=c.panoramicElements.filter((p,y)=>y!==i);let h=c.selectedElementIndex;return h!==null&&(h===i?h=null:h>i&&h--),{panoramicElements:m,selectedElementIndex:h}}),setPanoramicFrameCount:i=>r(c=>{const m=c.panoramicFrameCount;if(m===i)return c;En(c);const h=m/i,p=c.panoramicElements.map(y=>{const f={...y,x:y.x*h};return y.type==="device"?{...f,width:y.width*h}:y.type==="text"&&y.maxWidth?{...f,maxWidth:y.maxWidth*h}:y.type==="decoration"?{...f,width:y.width*h}:f});return{panoramicFrameCount:i,panoramicElements:p}}),updatePanoramicEffects:i=>r(c=>(En(c),{panoramicEffects:{...c.panoramicEffects,...i}})),undo:()=>{if(Yr.length===0)return;const i=a();na.push({screens:xt(i.screens),panoramicElements:xt(i.panoramicElements),panoramicBackground:xt(i.panoramicBackground),panoramicEffects:xt(i.panoramicEffects),selectedScreen:i.selectedScreen,selectedElementIndex:i.selectedElementIndex});const c=Yr.pop();zl=!0,r({screens:xt(c.screens),panoramicElements:xt(c.panoramicElements),panoramicBackground:xt(c.panoramicBackground),panoramicEffects:xt(c.panoramicEffects),selectedScreen:c.selectedScreen,selectedElementIndex:c.selectedElementIndex}),zl=!1},redo:()=>{if(na.length===0)return;const i=a();Yr.push({screens:xt(i.screens),panoramicElements:xt(i.panoramicElements),panoramicBackground:xt(i.panoramicBackground),panoramicEffects:xt(i.panoramicEffects),selectedScreen:i.selectedScreen,selectedElementIndex:i.selectedElementIndex});const c=na.pop();zl=!0,r({screens:xt(c.screens),panoramicElements:xt(c.panoramicElements),panoramicBackground:xt(c.panoramicBackground),panoramicEffects:xt(c.panoramicEffects),selectedScreen:c.selectedScreen,selectedElementIndex:c.selectedElementIndex}),zl=!1}})),Wn="";async function cf(){const r=await fetch(`${Wn}/api/config`);if(!r.ok)throw new Error(`Failed to fetch config: ${r.statusText}`);return r.json()}async function pp(){return await fetch(`${Wn}/api/reload`,{method:"POST"}),cf()}async function hp(r,a){const i=await fetch(`${Wn}/api/preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:a});if(!i.ok)throw new Error(`Preview render failed: ${i.statusText}`);return i.text()}async function _p(){const r=await fetch(`${Wn}/api/frames`);if(!r.ok)throw new Error(`Failed to fetch frames: ${r.statusText}`);return r.json()}async function gp(){const r=await fetch(`${Wn}/api/fonts`);if(!r.ok)throw new Error(`Failed to fetch fonts: ${r.statusText}`);return r.json()}async function yp(){const r=await fetch(`${Wn}/api/koubou-devices`);if(!r.ok)throw new Error(`Failed to fetch koubou devices: ${r.statusText}`);return r.json()}async function xp(){const r=await fetch(`${Wn}/api/sizes`);if(!r.ok)throw new Error(`Failed to fetch sizes: ${r.statusText}`);return r.json()}async function vp(r,a){const i=await fetch(`${Wn}/api/panoramic-preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:a});if(!i.ok)throw new Error(`Panoramic preview failed: ${i.statusText}`);return i.text()}async function bp(r){const a=await fetch(`${Wn}/api/export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!a.ok)throw new Error(`Export failed: ${a.statusText}`);return a.blob()}async function Hi(r){const a=await fetch(`${Wn}/api/panoramic-export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!a.ok)throw new Error(`Panoramic export failed: ${a.statusText}`);return a.blob()}const wp=[{id:"background",label:"Background"},{id:"device",label:"Device"},{id:"text",label:"Text"},{id:"extras",label:"Extras"},{id:"export",label:"Download"}];function kp({sidebarOpen:r,onToggleSidebar:a,showSidebarToggle:i,agentMode:c,onToggleAgentMode:m}){const h=X(x=>x.config),p=X(x=>x.isPanoramic),y=X(x=>x.togglePanoramic),f=X(x=>x.activeTab),$=X(x=>x.setActiveTab),w=X(x=>x.selectedScreen),T=X(x=>x.screens),_=p?"Panoramic":"Individual",N=p?"Switch to Individual":"Switch to Panoramic";return l.jsxs("div",{className:"w-full min-h-11 px-3 py-2 md:px-4 flex flex-wrap items-center gap-2 md:gap-4 border-b border-border bg-surface shrink-0",children:[l.jsxs("div",{className:"flex items-center gap-2 min-w-0",children:[i&&l.jsx("button",{className:`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${r?"border-accent/40 bg-accent/10 text-accent":"border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text"}`,onClick:a,"aria-expanded":r,"aria-controls":"editor-sidebar",children:r?"Hide Controls":"Show Controls"}),l.jsx("span",{className:"text-sm font-semibold whitespace-nowrap",children:"appframe"}),h&&l.jsx("span",{className:"text-xs text-text-dim truncate",children:h.app.name}),l.jsx("span",{className:"hidden sm:inline-flex text-[10px] text-text-dim bg-surface-2 px-1.5 py-0.5 rounded whitespace-nowrap",children:_}),!p&&T.length>0&&l.jsxs("span",{className:"text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded whitespace-nowrap",children:[w+1,"/",T.length]})]}),l.jsx("div",{className:"order-3 md:order-none basis-full md:basis-auto flex items-center gap-1 md:mx-auto overflow-x-auto",children:wp.map(x=>l.jsx("button",{className:`text-[11px] px-3 py-1.5 rounded-md transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${f===x.id?"bg-accent/10 text-accent font-medium":"text-text-dim hover:text-text hover:bg-surface-2"}`,onClick:()=>$(x.id),children:x.label},x.id))}),l.jsxs("div",{className:"ml-auto flex items-center gap-2 shrink-0",children:[l.jsx("button",{className:`hidden sm:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${c?"border-emerald-400/40 bg-emerald-500/10 text-emerald-300":"border-border bg-bg text-text-dim hover:border-emerald-400/30 hover:text-text"}`,onClick:m,"aria-pressed":c,children:c?"AI Mode On":"AI Mode Off"}),l.jsxs("button",{className:`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${p?"border-accent/40 bg-accent/10 text-accent":"border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text"}`,onClick:y,title:N,"aria-label":`${N}. Current mode: ${_}.`,"data-current-mode":_.toLowerCase(),children:[l.jsx("span",{className:"w-3 h-3 flex items-center justify-center","aria-hidden":"true",children:p?l.jsxs("svg",{viewBox:"0 0 12 12",fill:"none",className:"w-full h-full","aria-hidden":"true",children:[l.jsx("rect",{x:"0.5",y:"2",width:"11",height:"8",rx:"1",stroke:"currentColor",strokeWidth:"1"}),l.jsx("line",{x1:"3",y1:"2",x2:"3",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"}),l.jsx("line",{x1:"6",y1:"2",x2:"6",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"}),l.jsx("line",{x1:"9",y1:"2",x2:"9",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"})]}):l.jsx("svg",{viewBox:"0 0 12 12",fill:"none",className:"w-full h-full","aria-hidden":"true",children:l.jsx("rect",{x:"2",y:"1",width:"8",height:"10",rx:"1",stroke:"currentColor",strokeWidth:"1"})})}),N]})]})]})}function aa(){const r=X(m=>m.selectedScreen),a=X(m=>m.screens[m.selectedScreen]),i=X(m=>m.updateScreen),c=C.useCallback(m=>{i(r,m)},[r,i]);return{screen:a,selectedScreen:r,update:c}}const ou=new Map;function Dd(r,a){a?ou.set(r,a):ou.delete(r)}function Cp(r){return ou.get(r)??null}function au(){const r=X(p=>p.selectedScreen),a=X(p=>p.previewW),i=C.useCallback(()=>{try{const p=Cp(r);return(p==null?void 0:p.contentDocument)??null}catch{return null}},[r]),c=C.useCallback(p=>{const y=i();if(!y)return;const f=y.querySelector(".device-wrapper");if(f){if(p.deviceScale!==void 0){const $=y.querySelector(".canvas");if($){const w=$.getBoundingClientRect().width;if(f.dataset.origDw||(f.dataset.origDw=String(parseFloat(f.style.width)||f.getBoundingClientRect().width)),!f.dataset.origPerspective){const g=getComputedStyle(f).getPropertyValue("--device-perspective");f.dataset.origPerspective=String(parseFloat(g)||1500)}const T=parseFloat(f.dataset.origDw),_=Math.round(w*p.deviceScale/100),N=_/T;f.style.width=_+"px";const x=parseFloat(f.dataset.origPerspective);f.style.setProperty("--device-perspective",Math.round(x*N)+"px"),f.querySelectorAll(".screenshot-clip").forEach(g=>{const E=g;E.dataset.origLeft||(E.dataset.origLeft=E.style.left,E.dataset.origTop=E.style.top,E.dataset.origWidth=E.style.width,E.dataset.origHeight=E.style.height,E.dataset.origBr=E.style.borderRadius||""),E.style.left=Math.round(parseFloat(E.dataset.origLeft)*N)+"px",E.style.top=Math.round(parseFloat(E.dataset.origTop)*N)+"px",E.style.width=Math.round(parseFloat(E.dataset.origWidth)*N)+"px",E.style.height=Math.round(parseFloat(E.dataset.origHeight)*N)+"px",E.dataset.origBr&&(E.style.borderRadius=Math.round(parseFloat(E.dataset.origBr)*N)+"px")})}}if(p.deviceTop!==void 0){f.style.top=p.deviceTop+"%";for(const $ of[".glow-1",".glow-2",".orb-1",".orb-2",".bg-glow",".shape-1",".shape-3",".bg-shape-1"]){const w=y.querySelector($);w&&(w.style.top=p.deviceTop+"%")}}p.deviceOffsetX!==void 0&&(f.style.left=p.deviceOffsetX?`calc(50% + ${p.deviceOffsetX/100*a}px)`:"50%"),p.deviceRotation!==void 0&&f.style.setProperty("--device-rotation",`${p.deviceRotation}deg`),p.deviceAngle!==void 0&&f.style.setProperty("--device-angle",`${p.deviceAngle}deg`),p.deviceTilt!==void 0&&f.style.setProperty("--device-tilt",`${p.deviceTilt}deg`)}},[i,a]),m=C.useCallback(p=>{const y=i();if(!y)return;const f=y.querySelector(".canvas");if(f){if(p.type==="solid"&&p.color)f.style.background=p.color;else if(p.type==="gradient"&&p.colors){const $=p.colors.join(", ");p.gradientType==="radial"?f.style.background=`radial-gradient(circle at ${p.radialPosition??"center"}, ${$})`:f.style.background=`linear-gradient(${p.direction??135}deg, ${$})`}}},[i]),h=C.useCallback(p=>{const y=i();if(!y)return;const f=a/1290;if(p.headlineSize!==void 0||p.headlineRotation!==void 0){const $=y.querySelector(".headline");if($&&(p.headlineSize!==void 0&&($.style.fontSize=`${Math.round(p.headlineSize*f)}px`),p.headlineRotation!==void 0)){const w=["translateX(-50%)"];p.headlineRotation&&w.push(`rotate(${p.headlineRotation}deg)`),$.style.transform=w.join(" ")}}if(p.subtitleSize!==void 0||p.subtitleRotation!==void 0){const $=y.querySelector(".subtitle");if($&&(p.subtitleSize!==void 0&&($.style.fontSize=`${Math.round(p.subtitleSize*f)}px`),p.subtitleRotation!==void 0)){const w=["translateX(-50%)"];p.subtitleRotation&&w.push(`rotate(${p.subtitleRotation}deg)`),$.style.transform=w.join(" ")}}},[i,a]);return{patchDevice:c,patchBackground:m,patchText:h}}function Fe({title:r,children:a,hidden:i,tooltip:c,defaultCollapsed:m=!0}){const[h,p]=C.useState(m),y=C.useRef(null),[f,$]=C.useState(void 0);return C.useEffect(()=>{y.current&&!h&&$(y.current.scrollHeight)},[a,h]),i?null:l.jsxs("div",{className:"mx-3 my-1.5 first:mt-3 last:mb-3",children:[r&&l.jsxs("button",{className:"w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-surface-2 border border-border text-left cursor-pointer hover:border-accent/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",onClick:()=>p(!h),"aria-expanded":!h,children:[l.jsx("span",{className:"flex-1 text-[12px] font-medium text-text",children:r}),c&&l.jsx("span",{className:"inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-border text-[9px] text-text-dim cursor-help leading-none shrink-0",title:c,onClick:w=>w.stopPropagation(),"aria-label":c,children:"?"}),l.jsx("svg",{className:`w-3.5 h-3.5 text-text-dim shrink-0 transition-transform duration-200 ${h?"":"rotate-180"}`,viewBox:"0 0 12 12",fill:"none","aria-hidden":"true",children:l.jsx("path",{d:"M3 4.5l3 3 3-3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),l.jsx("div",{ref:y,className:"overflow-hidden transition-all duration-200 ease-in-out",style:{maxHeight:h?0:f??"none",opacity:h?0:1},"aria-hidden":h,children:l.jsx("div",{className:"px-1 pt-3 pb-1",children:a})})]})}function qe({label:r,value:a,onChange:i,onInstant:c,presets:m,onPresetClick:h}){const p=C.useId();return l.jsxs("div",{className:"mb-2.5",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("label",{htmlFor:p,className:"text-xs text-text-dim flex-1",children:r}),l.jsx("input",{id:p,type:"color",value:a,"aria-label":r,className:"w-8 h-8 border border-border rounded-md cursor-pointer bg-transparent p-0.5",onInput:y=>{c==null||c(y.target.value)},onChange:y=>{i(y.target.value)}})]}),m&&m.length>0&&l.jsx("div",{className:"flex flex-wrap gap-1 mt-1.5",children:m.map(y=>l.jsx("button",{className:"w-6 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:y},title:y,"aria-label":`Select color ${y}`,onClick:()=>{h==null||h(y),i(y)}},y))})]})}function Z({label:r,value:a,min:i,max:c,step:m=1,formatValue:h,onChange:p,onInstant:y,disabled:f}){const $=C.useId(),w=h?h(a):String(a),[T,_]=C.useState(!1),[N,x]=C.useState(""),g=C.useRef(null);C.useEffect(()=>{var k;T&&((k=g.current)==null||k.select())},[T]);function E(){_(!1);const k=parseFloat(N);if(Number.isNaN(k))return;const J=Math.min(c,Math.max(i,k)),ne=Math.round(J/m)*m;p(ne)}return l.jsxs("div",{className:`mb-2.5${f?" opacity-50 cursor-not-allowed":""}`,children:[l.jsx("label",{htmlFor:$,className:"block text-xs text-text-dim mb-1",children:r}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("input",{id:$,type:"range",min:i,max:c,step:m,value:a,disabled:f,"aria-label":r,"aria-valuemin":i,"aria-valuemax":c,"aria-valuenow":a,"aria-valuetext":w,className:"w-full accent-accent",onInput:k=>{const J=Number(k.target.value);y==null||y(J)},onChange:k=>{p(Number(k.target.value))}}),T?l.jsx("input",{ref:g,type:"text",inputMode:"decimal","aria-label":`Edit ${r} value`,value:N,onChange:k=>x(k.target.value),onBlur:E,onKeyDown:k=>{k.key==="Enter"&&E(),k.key==="Escape"&&_(!1)},className:"text-xs text-text bg-surface border border-border rounded px-1 py-0 min-w-[40px] w-[48px] text-right shrink-0 outline-none focus:border-accent"}):l.jsx("span",{className:`text-xs text-text-dim min-w-[40px] text-right shrink-0 transition-colors${f?"":" cursor-text hover:text-text"}`,tabIndex:f?void 0:0,role:"spinbutton","aria-label":`${r}: ${w}. Click to edit`,"aria-valuenow":a,"aria-valuetext":w,onClick:()=>{f||(x(String(a)),_(!0))},onKeyDown:k=>{f||(k.key==="Enter"||k.key===" ")&&(k.preventDefault(),x(String(a)),_(!0))},children:w})]})]})}const vt=C.memo(function({label:a,checked:i,onChange:c}){return l.jsx("div",{className:"mb-2.5",children:l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"checkbox",checked:i,onChange:m=>c(m.target.checked),className:"accent-accent"}),a]})})}),Ge=C.memo(function({label:a,value:i,onChange:c,options:m,groups:h,hidden:p}){const y=C.useId();return p?null:l.jsxs("div",{className:"mb-2.5",children:[a&&l.jsx("label",{htmlFor:y,className:"block text-xs text-text-dim mb-1",children:a}),l.jsxs("select",{id:y,value:i,onChange:f=>c(f.target.value),"aria-label":a||void 0,className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent",children:[m==null?void 0:m.map(f=>l.jsx("option",{value:f.value,disabled:f.disabled,title:f.title,children:f.label},f.value)),h==null?void 0:h.map(f=>l.jsx("optgroup",{label:f.label,children:f.options.map($=>l.jsx("option",{value:$.value,disabled:$.disabled,title:$.title,children:$.label},$.value))},f.label))]})]})}),df=["#000000","#1a1a2e","#16213e","#0f3460","#533483","#e94560","#f5f5f5","#fafafa","#2d3436","#636e72","#00b894","#00cec9","#6c5ce7","#fdcb6e","#e17055","#dfe6e9","#b2bec3","#2c3e50","#8e44ad","#2980b9"],iu=[{name:"Sunset",colors:["#ff6b35","#f7c948","#ff3864"],direction:135},{name:"Ocean",colors:["#0052d4","#4364f7","#6fb1fc"],direction:135},{name:"Midnight",colors:["#0f0c29","#302b63","#24243e"],direction:135},{name:"Sky",colors:["#2980b9","#6dd5fa","#ffffff"],direction:180},{name:"Horizon",colors:["#003973","#e5e5be","#f7a600"],direction:180},{name:"Vapor",colors:["#fc5c7d","#ce9ffc","#6a82fb"],direction:135},{name:"Tropical",colors:["#f7971e","#ffd200","#21d4fd"],direction:135},{name:"Dusk Sky",colors:["#2c3e50","#4ca1af","#c4e0e5"],direction:180},{name:"Flamingo",colors:["#ee5a24","#f0932b","#fad390"],direction:135},{name:"Arctic",colors:["#1e3c72","#2a5298","#e8f5e9"],direction:180},{name:"Velvet",colors:["#6a0572","#ab83a1","#f5e6cc"],direction:135},{name:"Lush",colors:["#004e92","#00b4db","#88d8b0"],direction:135},{name:"Aurora",colors:["#00c9ff","#92fe9d"],direction:135},{name:"Coral",colors:["#ff9a9e","#fecfef"],direction:135},{name:"Lavender",colors:["#a18cd1","#fbc2eb"],direction:135},{name:"Emerald",colors:["#11998e","#38ef7d"],direction:135},{name:"Fire",colors:["#f83600","#f9d423"],direction:135},{name:"Berry",colors:["#8e2de2","#4a00e0"],direction:135},{name:"Peach",colors:["#ffecd2","#fcb69f"],direction:135},{name:"Dusk",colors:["#2c3e50","#fd746c"],direction:135},{name:"Mint",colors:["#00b09b","#96c93d"],direction:135},{name:"Rose",colors:["#ee9ca7","#ffdde1"],direction:135},{name:"Indigo",colors:["#667eea","#764ba2"],direction:135},{name:"Candy",colors:["#fc5c7d","#6a82fb"],direction:135},{name:"Forest",colors:["#134e5e","#71b280"],direction:135},{name:"Neon",colors:["#00f260","#0575e6"],direction:135},{name:"Warm",colors:["#f093fb","#f5576c"],direction:135}],ff={"Natural Titanium":"#9a8e7e","Black Titanium":"#3c3c3c","White Titanium":"#e8e5e0","Desert Titanium":"#c4a882","Blue Titanium":"#394e5f",Black:"#1c1c1e",White:"#f5f5f7",Pink:"#f9cdd3",Teal:"#5eb5b5",Ultramarine:"#4a50c7",Blue:"#5b8fb9",Green:"#3f6e4e",Yellow:"#f2d44e",Red:"#c43d40",Purple:"#7c5dab",Midnight:"#2c2c3a",Starlight:"#f0e8d8","Product Red":"#c43d40","Space Black":"#2a2a2c","Space Gray":"#636366",Silver:"#d6d6d6",Gold:"#e3caa5","Deep Purple":"#5e4580",Graphite:"#4f4f4f","Pacific Blue":"#1e5c82","Sierra Blue":"#9fb8cf","Alpine Green":"#3c5e48","Rose Gold":"#e6c0aa"},Sp=[{value:"minimal",label:"Minimal"},{value:"bold",label:"Bold"},{value:"glow",label:"Glow"},{value:"playful",label:"Playful"},{value:"clean",label:"Clean"},{value:"branded",label:"Branded"},{value:"editorial",label:"Editorial"}],jp=[{value:"solid",label:"Solid"},{value:"gradient",label:"Gradient"},{value:"image",label:"Image"},{value:"preset",label:"Preset"}],Ep=[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}];function Np(){const{screen:r,update:a}=aa(),i=C.useRef(null),{patchBackground:c}=au(),m=C.useCallback(_=>c({type:"solid",color:_}),[c]),h=C.useCallback(_=>{if(!r)return;const N=r.backgroundGradient;c({type:"gradient",gradientType:N.type,colors:(_==null?void 0:_.colors)??N.colors,direction:(_==null?void 0:_.direction)??N.direction,radialPosition:N.radialPosition})},[r,c]),[p,y]=C.useState(!1);if(!r)return null;const f=r.backgroundType,$=p||f==="preset"?"preset":f,w=_=>{var g;const N=(g=_.target.files)==null?void 0:g[0];if(!N)return;const x=new FileReader;x.onload=E=>{var le;const k=(le=E.target)==null?void 0:le.result,{selectedScreen:J,updateScreen:ne}=X.getState();ne(J,{backgroundImageDataUrl:k})},x.readAsDataURL(N),_.target.value=""},T=()=>{const _=[...r.backgroundGradient.colors];_.length>=5||(_.push("#ffffff"),a({backgroundGradient:{...r.backgroundGradient,colors:_}}))};return l.jsxs(l.Fragment,{children:[l.jsxs(Fe,{title:"Background",tooltip:"Choose between solid colors, gradients, images, or template presets for your screenshot background.",defaultCollapsed:!1,children:[l.jsx("div",{className:"flex gap-3 mb-2.5",children:jp.map(_=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"bg-type",value:_.value,checked:$===_.value,onChange:()=>{_.value==="preset"?y(!0):(y(!1),a({backgroundType:_.value}))},className:"accent-accent"}),_.label]},_.value))}),$==="preset"&&l.jsx(Ge,{label:"Style Preset",value:f==="preset"?r.style:"",onChange:_=>{a({backgroundType:"preset",style:_})},options:[{value:"",label:"Select a preset...",disabled:!0},...Sp]}),$==="solid"&&l.jsx(qe,{label:"Color",value:r.backgroundColor,onChange:_=>a({backgroundColor:_}),onInstant:m,presets:df}),$==="gradient"&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:iu.map(_=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${_.direction}deg, ${_.colors.join(", ")})`},title:_.name,"aria-label":`Apply ${_.name} gradient`,onClick:()=>a({backgroundGradient:{type:"linear",colors:[..._.colors],direction:_.direction,radialPosition:"center"}})},_.name))}),l.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(_=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"gradient-type",checked:r.backgroundGradient.type===_,onChange:()=>a({backgroundGradient:{...r.backgroundGradient,type:_}}),className:"accent-accent"}),_.charAt(0).toUpperCase()+_.slice(1)]},_))}),r.backgroundGradient.type==="linear"&&l.jsx(Z,{label:"Direction",value:r.backgroundGradient.direction,min:0,max:360,formatValue:_=>`${_}°`,onChange:_=>a({backgroundGradient:{...r.backgroundGradient,direction:_}}),onInstant:_=>h({direction:_})}),r.backgroundGradient.type==="radial"&&l.jsx(Ge,{label:"Center",value:r.backgroundGradient.radialPosition,onChange:_=>a({backgroundGradient:{...r.backgroundGradient,radialPosition:_}}),options:Ep}),r.backgroundGradient.colors.map((_,N)=>l.jsx(qe,{label:`Stop ${N+1}`,value:_,onChange:x=>{const g=[...r.backgroundGradient.colors];g[N]=x,a({backgroundGradient:{...r.backgroundGradient,colors:g}})}},N)),r.backgroundGradient.colors.length<5&&l.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:T,children:"+ Add Color Stop"})]}),$==="image"&&l.jsxs(l.Fragment,{children:[!r.backgroundImageDataUrl&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Upload a custom image to use as the screenshot background. Supports PNG, JPEG, and WebP."}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var _;return(_=i.current)==null?void 0:_.click()},children:"Upload Background Image"}),l.jsx("input",{ref:i,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload background image",onChange:w}),r.backgroundImageDataUrl&&l.jsxs("div",{className:"mt-1.5",children:[l.jsx("img",{src:r.backgroundImageDataUrl,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>a({backgroundImageDataUrl:null}),children:"Remove"})]}),l.jsxs("div",{className:"mt-2",children:[l.jsx(vt,{label:"Dim Overlay",checked:!!r.backgroundOverlay,onChange:_=>a({backgroundOverlay:_?{color:"#000000",opacity:.3}:null})}),r.backgroundOverlay&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Color",value:r.backgroundOverlay.color,onChange:_=>a({backgroundOverlay:{...r.backgroundOverlay,color:_}})}),l.jsx(Z,{label:"Opacity",value:Math.round(r.backgroundOverlay.opacity*100),min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>a({backgroundOverlay:{...r.backgroundOverlay,opacity:_/100}})})]})]})]})]}),l.jsxs(Fe,{title:"Preset Colors",hidden:f!=="preset",tooltip:"Override the default colors for the selected template preset.",children:[l.jsx(qe,{label:"Primary",value:r.colors.primary,onChange:_=>a({colors:{...r.colors,primary:_}})}),l.jsx(qe,{label:"Secondary",value:r.colors.secondary,onChange:_=>a({colors:{...r.colors,secondary:_}})}),l.jsx(qe,{label:"Background",value:r.colors.background,onChange:_=>a({colors:{...r.colors,background:_}})})]})]})}function Fd(r,a,i){const m=[{name:"nw",x:i.x,y:i.y},{name:"ne",x:i.x+i.w,y:i.y},{name:"sw",x:i.x,y:i.y+i.h},{name:"se",x:i.x+i.w,y:i.y+i.h}];for(const h of m)if(Math.abs(r-h.x)<12&&Math.abs(a-h.y)<12)return h.name;return r>i.x&&r<i.x+i.w&&a>i.y&&a<i.y+i.h?"move":"new"}const Pp={nw:"nw-resize",ne:"ne-resize",sw:"sw-resize",se:"se-resize",move:"move",new:"crosshair"};function Tp({imageDataUrl:r,onApply:a,onCancel:i}){const c=C.useRef(null),m=C.useRef(null),h=C.useRef(null),p=C.useRef({x:0,y:0,w:0,h:0}),y=C.useRef(1),f=C.useRef({mode:null,startX:0,startY:0,startCrop:{x:0,y:0,w:0,h:0}}),$=C.useCallback(()=>{const _=m.current,N=h.current;if(!_||!N)return;const x=_.getContext("2d");if(!x)return;const g=_.width,E=_.height,k=p.current;x.clearRect(0,0,g,E),x.drawImage(N,0,0,g,E),x.fillStyle="rgba(0,0,0,0.5)",x.fillRect(0,0,g,k.y),x.fillRect(0,k.y+k.h,g,E-k.y-k.h),x.fillRect(0,k.y,k.x,k.h),x.fillRect(k.x+k.w,k.y,g-k.x-k.w,k.h),x.strokeStyle="#fff",x.lineWidth=2,x.strokeRect(k.x,k.y,k.w,k.h);const J=8;x.fillStyle="#fff";const ne=[[k.x,k.y],[k.x+k.w,k.y],[k.x,k.y+k.h],[k.x+k.w,k.y+k.h]];for(const[le,re]of ne)x.fillRect(le-J/2,re-J/2,J,J);x.strokeStyle="rgba(255,255,255,0.25)",x.lineWidth=1;for(let le=1;le<=2;le++)x.beginPath(),x.moveTo(k.x+k.w*le/3,k.y),x.lineTo(k.x+k.w*le/3,k.y+k.h),x.stroke(),x.beginPath(),x.moveTo(k.x,k.y+k.h*le/3),x.lineTo(k.x+k.w,k.y+k.h*le/3),x.stroke()},[]);C.useEffect(()=>{var N;const _=x=>{if(x.key==="Escape"){i();return}if(x.key==="Tab"&&c.current){const g=c.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');if(g.length===0)return;const E=g[0],k=g[g.length-1];x.shiftKey&&document.activeElement===E?(x.preventDefault(),k.focus()):!x.shiftKey&&document.activeElement===k&&(x.preventDefault(),E.focus())}};return window.addEventListener("keydown",_),(N=c.current)==null||N.focus(),()=>window.removeEventListener("keydown",_)},[i]),C.useEffect(()=>{const _=new Image;_.onload=()=>{h.current=_;const N=_.naturalWidth,x=_.naturalHeight,g=window.innerWidth*.8,E=window.innerHeight*.7,k=Math.min(g/N,E/x,1);y.current=k;const J=Math.round(N*k),ne=Math.round(x*k),le=m.current;le&&(le.width=J,le.height=ne,p.current={x:Math.round(J*.1),y:Math.round(ne*.1),w:Math.round(J*.8),h:Math.round(ne*.8)},$())},_.src=r},[r,$]);const w=C.useCallback(_=>{const N=m.current;if(!N)return;const x=N.getBoundingClientRect(),g=_.clientX-x.left,E=_.clientY-x.top,k=Fd(g,E,p.current),J=p.current;f.current={mode:k==="new"?"se":k,startX:g,startY:E,startCrop:{...J}},k==="new"&&(p.current={x:g,y:E,w:0,h:0})},[]);C.useEffect(()=>{const _=x=>{const g=m.current;if(!g)return;const E=g.getBoundingClientRect(),k=g.width,J=g.height,ne=f.current;if(!ne.mode){const be=Fd(x.clientX-E.left,x.clientY-E.top,p.current);g.style.cursor=Pp[be]??"crosshair";return}const le=Math.max(0,Math.min(k,x.clientX-E.left)),re=Math.max(0,Math.min(J,x.clientY-E.top)),ae=le-ne.startX,ue=re-ne.startY,v=ne.startCrop,U=p.current;ne.mode==="move"?(U.x=Math.max(0,Math.min(k-v.w,v.x+ae)),U.y=Math.max(0,Math.min(J-v.h,v.y+ue))):ne.mode==="se"?(U.w=Math.max(10,le-U.x),U.h=Math.max(10,re-U.y)):ne.mode==="nw"?(U.x=Math.min(v.x+v.w-10,v.x+ae),U.y=Math.min(v.y+v.h-10,v.y+ue),U.w=v.w-(U.x-v.x),U.h=v.h-(U.y-v.y)):ne.mode==="ne"?(U.y=Math.min(v.y+v.h-10,v.y+ue),U.w=Math.max(10,v.w+ae),U.h=v.h-(U.y-v.y)):ne.mode==="sw"&&(U.x=Math.min(v.x+v.w-10,v.x+ae),U.w=v.w-(U.x-v.x),U.h=Math.max(10,v.h+ue)),$()},N=()=>{f.current.mode=null};return document.addEventListener("mousemove",_),document.addEventListener("mouseup",N),()=>{document.removeEventListener("mousemove",_),document.removeEventListener("mouseup",N)}},[$]);const T=C.useCallback(()=>{const _=h.current;if(!_)return;const N=p.current,x=y.current,g=Math.round(N.x/x),E=Math.round(N.y/x);let k=Math.round(N.w/x),J=Math.round(N.h/x);k=Math.min(k,_.naturalWidth-g),J=Math.min(J,_.naturalHeight-E);const ne=document.createElement("canvas");ne.width=k,ne.height=J;const le=ne.getContext("2d");le&&(le.drawImage(_,g,E,k,J,0,0,k,J),a(ne.toDataURL("image/png")))},[a]);return l.jsxs("div",{ref:c,tabIndex:-1,role:"dialog","aria-modal":"true","aria-label":"Crop screenshot",className:"fixed inset-0 z-[9999] flex flex-col items-center justify-center outline-none",style:{background:"rgba(0,0,0,0.8)"},children:[l.jsx("div",{className:"text-white text-base font-semibold mb-3",children:"Crop Screenshot"}),l.jsx("canvas",{ref:m,className:"border border-white/30",style:{cursor:"crosshair"},role:"img","aria-label":"Screenshot crop area. Click and drag to select the region to crop.",onMouseDown:w}),l.jsxs("div",{className:"flex gap-2 mt-3",children:[l.jsx("button",{className:"px-6 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent-hover",onClick:T,children:"Apply Crop"}),l.jsx("button",{className:"px-6 py-2 text-sm bg-surface-2 text-text-dim border border-border rounded-md hover:text-text",onClick:i,children:"Cancel"})]})]})}function uu(r){return Od[r]??Od.iphone}function ia(r,a){var i,c;return(c=(i=r[a])==null?void 0:i[0])==null?void 0:c.key}const Lp={single:{deviceCount:1,slots:[{offsetX:0,offsetY:15,scale:92,rotation:0,angle:0,tilt:0,zIndex:1}]},"duo-overlap":{deviceCount:2,slots:[{offsetX:-30,offsetY:18,scale:85,rotation:-12,angle:12,tilt:2,zIndex:1},{offsetX:22,offsetY:8,scale:88,rotation:4,angle:0,tilt:0,zIndex:2}]},"duo-split":{deviceCount:2,slots:[{offsetX:-38,offsetY:12,scale:80,rotation:-5,angle:8,tilt:2,zIndex:1},{offsetX:38,offsetY:12,scale:80,rotation:5,angle:-8,tilt:2,zIndex:1}]},"hero-tilt":{deviceCount:2,slots:[{offsetX:-35,offsetY:20,scale:78,rotation:-15,angle:15,tilt:4,zIndex:1},{offsetX:12,offsetY:8,scale:92,rotation:0,angle:0,tilt:0,zIndex:2}]},"fanned-cards":{deviceCount:3,slots:[{offsetX:-35,offsetY:16,scale:68,rotation:-18,angle:0,tilt:0,zIndex:1},{offsetX:0,offsetY:8,scale:72,rotation:0,angle:0,tilt:0,zIndex:3},{offsetX:35,offsetY:16,scale:68,rotation:18,angle:0,tilt:0,zIndex:2}]}},Rp=[{value:"center",label:"Center"},{value:"angled-left",label:"Angled Left"},{value:"angled-right",label:"Angled Right"}],Ip=[{value:"flat",label:"Flat"},{value:"none",label:"None (frameless)"}],$p=[{value:"single",label:"Single Device"}],Mp=[{label:"Multi-Device",options:[{value:"duo-overlap",label:"Duo Overlap (2)"},{value:"duo-split",label:"Duo Split (2)"},{value:"hero-tilt",label:"Hero + Background (2)"},{value:"fanned-cards",label:"Fanned Cards (3)"}]}],zp=[{value:"iphone",label:"iPhone"},{value:"ipad",label:"iPad"},{value:"mac",label:"Mac"},{value:"watch",label:"Apple Watch"},{value:"android",label:"Android"}],Ad=.15;function Bd(r,a){const i=r.width/r.height;return Math.abs(a-i)/i<Ad||Math.abs(a-1/i)/(1/i)<Ad}const Op={iphone:["iphone"],android:["iphone"],ipad:["ipad"],mac:["mac"],watch:["watch"]},Dp={iphone:["default-ios","default-android"],android:["default-ios","default-android"],ipad:["default-ipad","fallback-tablet"],mac:[],watch:[]};function Fp(r,a,i,c,m){const h=i?i.width/i.height:null,p=!c&&h!==null,y=Op[m]??["iphone"],f=Dp[m]??[],$={};for(const _ of r){const N=_.category||"other";if(!c&&!y.includes(N)||p&&!Bd(_.screenResolution,h))continue;const x=$[N]??[];x.push({value:_.id,label:_.name}),$[N]=x}const w=Object.entries($).map(([_,N])=>({label:_.charAt(0).toUpperCase()+_.slice(1),options:N})),T=[];for(const _ of a){if(!c&&f.length>0){if(!(_.tags??[]).some(x=>f.includes(x)))continue}else if(!c&&f.length===0)continue;p&&_.screenResolution&&!Bd(_.screenResolution,h)||T.push({value:_.id,label:_.name})}return T.length>0&&w.push({label:"SVG Frames",options:T}),w}function Ap(){var Oe,ze,Le;const{screen:r,update:a}=aa(),i=X(O=>O.platform),c=X(O=>O.setPlatform),m=X(O=>O.setPreviewSize),h=X(O=>O.sizes),p=X(O=>O.setExportSize),y=X(O=>O.triggerRender),f=X(O=>O.updateScreen),$=X(O=>O.screens),w=X(O=>O.deviceFamilies),T=X(O=>O.frames),_=C.useRef(null),[N,x]=C.useState(!1),[g,E]=C.useState(!1),{patchDevice:k}=au(),J=C.useCallback((O,W)=>k({[O]:W}),[k]),ne=O=>{c(O);const W=uu(O);m(W.w,W.h);const M=ia(h,O);M&&p(M);const Y=uf(O,w);for(let V=0;V<$.length;V++)f(V,{frameId:Y,deviceColor:""});y()};if(!r)return null;const le=w.find(O=>O.id===r.frameId),re=le&&le.colors.length>1,ae=le&&le.screenRect,ue=r.frameStyle==="none",v=r.layout==="angled-left"||r.layout==="angled-right",U=C.useMemo(()=>Fp(w,T,r.screenshotDims,g,i),[w,T,r.screenshotDims,g,i]),be=O=>{var Y;const W=(Y=O.target.files)==null?void 0:Y[0];if(!W)return;const M=new FileReader;M.onload=V=>{var ie;const R=(ie=V.target)==null?void 0:ie.result,F=new Image;F.onload=()=>{const H={width:F.naturalWidth,height:F.naturalHeight};a({screenshotDataUrl:R,screenshotName:W.name,screenshotDims:H})},F.src=R},M.readAsDataURL(W),O.target.value=""},K=O=>{x(!1);const W=new Image;W.onload=()=>{const M={width:W.naturalWidth,height:W.naturalHeight};a({screenshotDataUrl:O,screenshotDims:M})},W.src=O},fe=oa[i]??oa.iphone;return l.jsxs(l.Fragment,{children:[N&&r.screenshotDataUrl&&l.jsx(Tp,{imageDataUrl:r.screenshotDataUrl,onApply:K,onCancel:()=>x(!1)}),l.jsx(Fe,{title:"Platform",tooltip:"Choose the target platform. This adjusts the preview dimensions and available device frames.",defaultCollapsed:!1,children:l.jsx(Ge,{label:"Platform",value:i,onChange:ne,options:zp})}),l.jsxs(Fe,{title:"Screenshot",children:[r.screenshotDataUrl&&l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:r.screenshotDataUrl,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:r.screenshotName||"Custom upload"})]}),!r.screenshotDataUrl&&r.screenshotName&&l.jsx("div",{className:"text-xs text-text-dim mb-2",children:r.screenshotName}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var O;return(O=_.current)==null?void 0:O.click()},children:"Upload Screenshot"}),l.jsx("input",{ref:_,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload screenshot image",onChange:be}),r.screenshotDataUrl&&l.jsxs("div",{className:"flex gap-1 mt-1.5",children:[l.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>x(!0),children:"Crop"}),l.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>a({screenshotDataUrl:null,screenshotName:null,screenshotDims:null}),children:"Revert"})]})]}),l.jsxs(Fe,{title:"Device Frame",children:[l.jsx(Ge,{label:"Device",value:r.frameId,onChange:O=>{const W=w.find(Y=>Y.id===O);W&&W.screenRect&&r.frameStyle==="none"?a({frameId:O,frameStyle:"flat"}):a({frameId:O})},groups:U}),r.screenshotDims&&l.jsx(vt,{label:"Show all frames",checked:g,onChange:E}),re&&l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),l.jsx("div",{className:"flex flex-wrap gap-1",children:le.colors.map(O=>l.jsx("button",{className:`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none ${r.deviceColor===O.name?"border-accent ring-1 ring-accent":"border-border"}`,style:{background:ff[O.name]??"#888888"},title:O.name,"aria-label":`${O.name} color variant`,"aria-pressed":r.deviceColor===O.name,onClick:()=>a({deviceColor:O.name})},O.name))})]}),l.jsx(Ge,{label:"Frame Style",value:r.frameStyle,onChange:O=>a({frameStyle:O}),options:Ip,hidden:!!ae}),ue&&l.jsxs(l.Fragment,{children:[l.jsx(vt,{label:"Border Simulation",checked:!!r.borderSimulation,onChange:O=>a({borderSimulation:O?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:null})}),r.borderSimulation&&l.jsxs(l.Fragment,{children:[l.jsx(Z,{label:"Thickness",value:r.borderSimulation.thickness,min:1,max:20,formatValue:O=>`${O}px`,onChange:O=>a({borderSimulation:{...r.borderSimulation,thickness:O}})}),l.jsx(qe,{label:"Color",value:r.borderSimulation.color,onChange:O=>a({borderSimulation:{...r.borderSimulation,color:O}})}),l.jsx(Z,{label:"Radius",value:r.borderSimulation.radius,min:0,max:60,formatValue:O=>`${O}px`,onChange:O=>a({borderSimulation:{...r.borderSimulation,radius:O}})})]})]})]}),l.jsxs(Fe,{title:"Device Layout",tooltip:"Control the size, position, rotation, and tilt of the device in the screenshot frame.",children:[l.jsx(vt,{label:"Fullscreen Screenshot",checked:r.style==="fullscreen",onChange:O=>a({style:O?"fullscreen":"minimal"})}),r.style!=="fullscreen"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Layout",value:r.layout,onChange:O=>a({layout:O}),options:Rp}),l.jsx(Z,{label:"Device Size",value:r.deviceScale,min:50,max:100,formatValue:O=>`${O}%`,onChange:O=>a({deviceScale:O}),onInstant:O=>J("deviceScale",O)}),l.jsx(Z,{label:"Device Position",value:r.deviceTop,min:-80,max:80,formatValue:O=>`${O}%`,onChange:O=>a({deviceTop:O}),onInstant:O=>J("deviceTop",O)}),l.jsx(Z,{label:"Horizontal Position",value:r.deviceOffsetX,min:-80,max:80,formatValue:O=>`${O}%`,onChange:O=>a({deviceOffsetX:O}),onInstant:O=>J("deviceOffsetX",O)}),l.jsx(Z,{label:"Device Rotation",value:r.deviceRotation,min:-180,max:180,formatValue:O=>`${O}°`,onChange:O=>a({deviceRotation:O}),onInstant:O=>J("deviceRotation",O)}),v&&l.jsx(Z,{label:"Perspective Angle",value:r.deviceAngle,min:2,max:45,formatValue:O=>`${O}°`,onChange:O=>a({deviceAngle:O}),onInstant:O=>J("deviceAngle",O)}),l.jsx(Z,{label:"3D Tilt",value:r.deviceTilt,min:0,max:40,formatValue:O=>`${O}°`,onChange:O=>a({deviceTilt:O}),onInstant:O=>J("deviceTilt",O)}),ue&&l.jsx(Z,{label:"Corner Radius",value:r.cornerRadius,min:0,max:50,formatValue:O=>`${O}%`,onChange:O=>a({cornerRadius:O})}),l.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>a({deviceScale:fe.deviceScale,deviceTop:fe.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:fe.deviceAngle,deviceTilt:0,cornerRadius:0}),children:"Reset Device Position"})]})]}),l.jsxs(Fe,{title:"Device Shadow",tooltip:"Add a custom drop shadow behind the device frame.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Custom Shadow",checked:!!r.deviceShadow,onChange:O=>a({deviceShadow:O?{opacity:.25,blur:20,color:"#000000",offsetY:10}:null})}),l.jsxs("div",{className:r.deviceShadow?"":"opacity-40 pointer-events-none",children:[l.jsx(Z,{label:"Opacity",value:r.deviceShadow?Math.round(r.deviceShadow.opacity*100):25,min:0,max:100,formatValue:O=>`${O}%`,onChange:O=>a({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},opacity:O/100}})}),l.jsx(Z,{label:"Blur",value:((Oe=r.deviceShadow)==null?void 0:Oe.blur)??20,min:0,max:50,formatValue:O=>`${O}px`,onChange:O=>a({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},blur:O}})}),l.jsx(qe,{label:"Color",value:((ze=r.deviceShadow)==null?void 0:ze.color)??"#000000",onChange:O=>a({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},color:O}})}),l.jsx(Z,{label:"Y Offset",value:((Le=r.deviceShadow)==null?void 0:Le.offsetY)??10,min:0,max:30,formatValue:O=>`${O}px`,onChange:O=>a({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},offsetY:O}})})]})]}),l.jsx(Fe,{title:"Composition",tooltip:"Choose how devices are arranged. Use multi-device layouts to show multiple app screens in one image.",defaultCollapsed:!0,children:l.jsx(Ge,{label:"Device Arrangement",value:r.composition,onChange:O=>{const W=O,M=Lp[W];if(M&&M.deviceCount===1){const Y=M.slots[0];a({composition:W,deviceOffsetX:Y.offsetX,deviceTop:Y.offsetY,deviceScale:Y.scale,deviceRotation:Y.rotation,deviceAngle:Y.angle,deviceTilt:Y.tilt})}else a({composition:W})},options:$p,groups:Mp})})]})}const Bp={"sans-serif":"Sans Serif",serif:"Serif",display:"Display"},Wp=["sans-serif","serif","display"];function mf(r){const a={};for(const i of r){const c=i.category??"sans-serif",m=a[c]??[];m.push({value:i.id,label:i.name}),a[c]=m}return Wp.filter(i=>{var c;return(c=a[i])==null?void 0:c.length}).map(i=>({label:Bp[i]??i,options:a[i]}))}const Wd=[{value:"",label:"Auto"},{value:"none",label:"None"},{value:"uppercase",label:"Uppercase"},{value:"lowercase",label:"Lowercase"},{value:"capitalize",label:"Capitalize"}],Yp=[{value:"",label:"Auto"},{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}];function Hp(){const{screen:r,update:a}=aa(),i=X(f=>f.fonts),{patchText:c}=au(),m=C.useCallback((f,$)=>c({[f]:$}),[c]),h=C.useMemo(()=>mf(i),[i]),p=C.useId(),y=C.useId();return r?l.jsxs(l.Fragment,{children:[l.jsxs(Fe,{title:"Text",tooltip:"Edit the headline and subtitle text that appears above or below the device frame.",defaultCollapsed:!1,children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{htmlFor:p,className:"block text-xs text-text-dim mb-1",children:"Headline"}),l.jsx("textarea",{id:p,rows:2,value:r.headline,onChange:f=>a({headline:f.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{htmlFor:y,className:"block text-xs text-text-dim mb-1",children:"Subtitle"}),l.jsx("input",{id:y,type:"text",value:r.subtitle,onChange:f=>a({subtitle:f.target.value}),placeholder:"Optional subtitle",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent"})]}),l.jsx(qe,{label:"Headline Color",value:r.colors.text,onChange:f=>a({colors:{...r.colors,text:f}})}),l.jsx(qe,{label:"Subtitle Color",value:r.colors.subtitle,onChange:f=>a({colors:{...r.colors,subtitle:f}})})]}),l.jsxs(Fe,{title:"Typography",tooltip:"Control font family, weight, size, rotation, spacing, and text transformations.",children:[l.jsx(Ge,{label:"Font",value:r.font,onChange:f=>a({font:f}),groups:h}),l.jsx(Z,{label:"Font Weight",value:r.fontWeight,min:400,max:800,step:100,formatValue:f=>String(f),onChange:f=>a({fontWeight:f})}),l.jsx(Z,{label:"Headline Size",value:r.headlineSize,min:0,max:200,formatValue:f=>f===0?"Auto":`${f}px`,onChange:f=>a({headlineSize:f}),onInstant:f=>m("headlineSize",f),disabled:r.autoSizeHeadline}),l.jsx(Z,{label:"Subtitle Size",value:r.subtitleSize,min:0,max:120,formatValue:f=>f===0?"Auto":`${f}px`,onChange:f=>a({subtitleSize:f}),onInstant:f=>m("subtitleSize",f),disabled:r.autoSizeSubtitle}),l.jsx(vt,{label:"Auto-size Headline",checked:r.autoSizeHeadline,onChange:f=>a({autoSizeHeadline:f})}),l.jsx(vt,{label:"Auto-size Subtitle",checked:r.autoSizeSubtitle,onChange:f=>a({autoSizeSubtitle:f})}),l.jsx(Z,{label:"Headline Rotation",value:r.headlineRotation,min:-30,max:30,formatValue:f=>`${f}°`,onChange:f=>a({headlineRotation:f}),onInstant:f=>m("headlineRotation",f)}),l.jsx(Z,{label:"Subtitle Rotation",value:r.subtitleRotation,min:-30,max:30,formatValue:f=>`${f}°`,onChange:f=>a({subtitleRotation:f}),onInstant:f=>m("subtitleRotation",f)}),l.jsx(Z,{label:"Headline Line Height",value:r.headlineLineHeight,min:80,max:180,formatValue:f=>f===0?"Auto":(f/100).toFixed(2),onChange:f=>a({headlineLineHeight:f})}),l.jsx(Z,{label:"Headline Letter Spacing",value:r.headlineLetterSpacing,min:-5,max:10,formatValue:f=>f===0?"Auto":`${f/100}em`,onChange:f=>a({headlineLetterSpacing:f})}),l.jsxs("div",{className:"flex gap-2 mb-2",children:[l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Headline Case",value:r.headlineTextTransform,onChange:f=>a({headlineTextTransform:f}),options:Wd})}),l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Headline Style",value:r.headlineFontStyle,onChange:f=>a({headlineFontStyle:f}),options:Yp})})]}),l.jsx(Z,{label:"Subtitle Opacity",value:r.subtitleOpacity,min:0,max:100,formatValue:f=>f===0?"Auto":`${f}%`,onChange:f=>a({subtitleOpacity:f})}),l.jsx(Z,{label:"Subtitle Letter Spacing",value:r.subtitleLetterSpacing,min:-5,max:10,formatValue:f=>f===0?"Auto":`${f/100}em`,onChange:f=>a({subtitleLetterSpacing:f})}),l.jsx(Ge,{label:"Subtitle Case",value:r.subtitleTextTransform,onChange:f=>a({subtitleTextTransform:f}),options:Wd})]}),l.jsxs(Fe,{title:"Text Position",tooltip:"Drag text elements in the preview to reposition, or reset to default positions.",children:[l.jsx("span",{className:"text-[11px] text-text-dim leading-tight block mb-1.5",children:"Drag the headline or subtitle in the preview to reposition them."}),l.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>a({textPositions:{headline:null,subtitle:null}}),children:"Reset to Default"})]}),l.jsxs(Fe,{title:"Text Gradient",tooltip:"Apply a gradient color effect to headline or subtitle text.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Enable Headline Gradient",checked:!!r.headlineGradient,onChange:f=>a({headlineGradient:f?{colors:["#6366f1","#ec4899"],direction:90}:null})}),r.headlineGradient&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Start",value:r.headlineGradient.colors[0]??"#6366f1",onChange:f=>a({headlineGradient:{...r.headlineGradient,colors:[f,r.headlineGradient.colors[1]??"#ec4899"]}})}),l.jsx(qe,{label:"End",value:r.headlineGradient.colors[1]??"#ec4899",onChange:f=>a({headlineGradient:{...r.headlineGradient,colors:[r.headlineGradient.colors[0]??"#6366f1",f]}})}),l.jsx(Z,{label:"Direction",value:r.headlineGradient.direction,min:0,max:360,formatValue:f=>`${f}°`,onChange:f=>a({headlineGradient:{...r.headlineGradient,direction:f}})})]}),l.jsx("div",{className:"mt-2.5",children:l.jsx(vt,{label:"Enable Subtitle Gradient",checked:!!r.subtitleGradient,onChange:f=>a({subtitleGradient:f?{colors:["#6366f1","#ec4899"],direction:90}:null})})}),r.subtitleGradient&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Start",value:r.subtitleGradient.colors[0]??"#6366f1",onChange:f=>a({subtitleGradient:{...r.subtitleGradient,colors:[f,r.subtitleGradient.colors[1]??"#ec4899"]}})}),l.jsx(qe,{label:"End",value:r.subtitleGradient.colors[1]??"#ec4899",onChange:f=>a({subtitleGradient:{...r.subtitleGradient,colors:[r.subtitleGradient.colors[0]??"#6366f1",f]}})}),l.jsx(Z,{label:"Direction",value:r.subtitleGradient.direction,min:0,max:360,formatValue:f=>`${f}°`,onChange:f=>a({subtitleGradient:{...r.subtitleGradient,direction:f}})})]})]})]}):null}function Ol({title:r,onRemove:a,children:i,defaultCollapsed:c=!1}){const[m,h]=C.useState(c),p=C.useRef(null),[y,f]=C.useState(void 0);return C.useEffect(()=>{p.current&&f(p.current.scrollHeight)},[i,m]),l.jsxs("div",{className:"border border-border rounded-md p-2 mb-1.5 text-[11px]",children:[l.jsxs("div",{className:"flex justify-between items-center mb-1.5",children:[l.jsxs("button",{className:"flex items-center gap-1 font-semibold text-text-dim hover:text-text transition-colors cursor-pointer bg-transparent border-none p-0 text-[11px]",onClick:()=>h(!m),"aria-expanded":!m,"aria-label":`${m?"Expand":"Collapse"} ${r}`,children:[l.jsx("span",{className:"inline-block transition-transform duration-150 text-[8px]",style:{transform:m?"rotate(-90deg)":"rotate(0deg)"},"aria-hidden":"true",children:"▼"}),r]}),l.jsx("button",{className:"text-text-dim hover:text-red-400 text-sm leading-none px-1 transition-colors",onClick:a,"aria-label":`Remove ${r}`,title:`Remove ${r}`,children:"×"})]}),l.jsx("div",{ref:p,className:"overflow-hidden transition-all duration-150 ease-in-out",style:{maxHeight:m?0:y??"none",opacity:m?0:1},"aria-hidden":m,children:i})]})}function Up({open:r,title:a,message:i,confirmLabel:c="Delete",cancelLabel:m="Cancel",destructive:h=!0,onConfirm:p,onCancel:y}){const f=C.useRef(null),$=C.useRef(null),w=C.useCallback(T=>{var _;if(T.key==="Escape"&&y(),T.key==="Tab"){const N=(_=f.current)==null?void 0:_.querySelectorAll("button");if(!N||N.length===0)return;const x=N[0],g=N[N.length-1];T.shiftKey&&document.activeElement===x?(T.preventDefault(),g.focus()):!T.shiftKey&&document.activeElement===g&&(T.preventDefault(),x.focus())}},[y]);return C.useEffect(()=>{var T;if(r)return(T=$.current)==null||T.focus(),document.addEventListener("keydown",w),()=>document.removeEventListener("keydown",w)},[r,w]),r?l.jsx("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center bg-black/50",onClick:y,"aria-hidden":"true",children:l.jsxs("div",{ref:f,role:"alertdialog","aria-modal":"true","aria-label":a,"aria-describedby":"confirm-dialog-message",className:"bg-surface border border-border rounded-lg shadow-xl p-5 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95",onClick:T=>T.stopPropagation(),children:[l.jsx("h3",{className:"text-sm font-semibold text-text mb-2",children:a}),l.jsx("p",{id:"confirm-dialog-message",className:"text-xs text-text-dim mb-4 leading-relaxed",children:i}),l.jsxs("div",{className:"flex gap-2 justify-end",children:[l.jsx("button",{ref:$,className:"px-3 py-1.5 text-[11px] font-medium bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-text-dim transition-colors",onClick:y,children:m}),l.jsx("button",{className:`px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${h?"bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30":"bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30"}`,onClick:p,children:c})]})]})}):null}function ua(){const[r,a]=C.useState({open:!1,options:{title:"",message:""},resolve:null}),i=C.useCallback(p=>new Promise(y=>{a({open:!0,options:p,resolve:y})}),[]),c=C.useCallback(()=>{var p;(p=r.resolve)==null||p.call(r,!0),a(y=>({...y,open:!1,resolve:null}))},[r.resolve]),m=C.useCallback(()=>{var p;(p=r.resolve)==null||p.call(r,!1),a(y=>({...y,open:!1,resolve:null}))},[r.resolve]),h=l.jsx(Up,{open:r.open,title:r.options.title,message:r.options.message,confirmLabel:r.options.confirmLabel,destructive:r.options.destructive,onConfirm:c,onCancel:m});return{confirm:i,dialog:h}}function Ui(r){return`${r}-${crypto.randomUUID().slice(0,8)}`}function Vp(){const{screen:r,update:a}=aa(),{confirm:i,dialog:c}=ua();if(!r)return null;const m=(N,x)=>{const g=r.annotations.map((E,k)=>k===N?{...E,...x}:E);a({annotations:g})},h=async N=>{await i({title:"Remove Annotation",message:`Remove Annotation ${N+1}? This cannot be undone.`})&&a({annotations:r.annotations.filter((g,E)=>E!==N)})},p=()=>{a({annotations:[...r.annotations,{id:Ui("ann"),shape:"rounded-rect",x:40,y:40,w:20,h:20,strokeColor:"#FF3B30",strokeWidth:4}]})},y=(N,x)=>{const g=r.callouts.map((E,k)=>k===N?{...E,...x}:E);a({callouts:g})},f=async N=>{await i({title:"Remove Callout",message:`Remove Callout ${N+1}? This cannot be undone.`})&&a({callouts:r.callouts.filter((g,E)=>E!==N)})},$=()=>{a({callouts:[...r.callouts,{id:Ui("callout"),sourceX:30,sourceY:40,sourceW:40,sourceH:20,displayX:60,displayY:10,displayScale:1,rotation:0,borderRadius:8,shadow:!0,borderWidth:0,borderColor:"#ffffff"}]})},w=(N,x)=>{const g=r.overlays.map((E,k)=>k===N?{...E,...x}:E);a({overlays:g})},T=async N=>{await i({title:"Remove Overlay",message:`Remove Overlay ${N+1}? This cannot be undone.`})&&a({overlays:r.overlays.filter((g,E)=>E!==N)})},_=()=>{a({overlays:[...r.overlays,{id:Ui("overlay"),type:"shape",x:10,y:10,size:10,rotation:0,opacity:1,shapeType:"circle",shapeColor:"#6366f1",shapeOpacity:.5,shapeBlur:10}]})};return l.jsxs(l.Fragment,{children:[c,l.jsxs(Fe,{title:"Spotlight / Dimming",tooltip:"Dim the background and highlight a specific area of your screenshot to draw attention.",defaultCollapsed:!1,children:[!r.spotlight&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Dim the screenshot background and highlight a specific region to guide the viewer's eye."}),l.jsx(vt,{label:"Enable Spotlight",checked:!!r.spotlight,onChange:N=>a({spotlight:N?{x:50,y:50,w:30,h:30,shape:"rectangle",dimOpacity:.6,blur:0}:null})}),r.spotlight&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:r.spotlight.shape,onChange:N=>a({spotlight:{...r.spotlight,shape:N}}),options:[{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(Z,{label:"Position X",value:r.spotlight.x,min:0,max:100,formatValue:N=>`${N}%`,onChange:N=>a({spotlight:{...r.spotlight,x:N}})}),l.jsx(Z,{label:"Position Y",value:r.spotlight.y,min:0,max:100,formatValue:N=>`${N}%`,onChange:N=>a({spotlight:{...r.spotlight,y:N}})}),l.jsx(Z,{label:"Width",value:r.spotlight.w,min:5,max:100,formatValue:N=>`${N}%`,onChange:N=>a({spotlight:{...r.spotlight,w:N}})}),l.jsx(Z,{label:"Height",value:r.spotlight.h,min:5,max:100,formatValue:N=>`${N}%`,onChange:N=>a({spotlight:{...r.spotlight,h:N}})}),l.jsx(Z,{label:"Dim Opacity",value:Math.round(r.spotlight.dimOpacity*100),min:0,max:100,formatValue:N=>`${N}%`,onChange:N=>a({spotlight:{...r.spotlight,dimOpacity:N/100}})}),l.jsx(Z,{label:"Background Blur",value:r.spotlight.blur,min:0,max:30,formatValue:N=>`${N}px`,onChange:N=>a({spotlight:{...r.spotlight,blur:N}})})]})]}),l.jsxs(Fe,{title:"Annotations",tooltip:"Draw shapes (rectangles, circles) over the screenshot to highlight specific UI elements.",children:[r.annotations.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Highlight areas of your screenshot with rectangles or circles. Great for drawing attention to specific features."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:p,children:"+ Add Annotation"}),r.annotations.map((N,x)=>l.jsxs(Ol,{title:`Annotation ${x+1}`,onRemove:()=>h(x),children:[l.jsx(Ge,{label:"Shape",value:N.shape,onChange:g=>m(x,{shape:g}),options:[{value:"rounded-rect",label:"Rounded Rect"},{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(qe,{label:"Color",value:N.strokeColor,onChange:g=>m(x,{strokeColor:g})}),l.jsx(Z,{label:"X",value:N.x,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>m(x,{x:g})}),l.jsx(Z,{label:"Y",value:N.y,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>m(x,{y:g})}),l.jsx(Z,{label:"Width",value:N.w,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>m(x,{w:g})}),l.jsx(Z,{label:"Height",value:N.h,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>m(x,{h:g})}),l.jsx(Z,{label:"Stroke",value:N.strokeWidth,min:1,max:20,formatValue:g=>`${g}px`,onChange:g=>m(x,{strokeWidth:g})})]},N.id))]}),l.jsxs(Fe,{title:"Loupe / Magnification",tooltip:"Magnify a region of the screenshot and display it enlarged elsewhere on the frame.",children:[l.jsx(vt,{label:"Loupe",checked:!!r.loupe,onChange:N=>a({loupe:N?{width:.5,height:.33,sourceX:0,sourceY:0,scale:1.1,cornerRadius:0,borderWidth:0,borderColor:"#ffffff",shadow:!0,shadowColor:"#000000",shadowRadius:30,shadowOffsetX:0,shadowOffsetY:0,xOffset:0,yOffset:0}:null})}),(()=>{const N={width:.5,height:.33,sourceX:0,sourceY:0,scale:1.1,cornerRadius:0,borderWidth:0,borderColor:"#ffffff",shadow:!0,shadowColor:"#000000",shadowRadius:30,shadowOffsetX:0,shadowOffsetY:0,xOffset:0,yOffset:0},x=r.loupe??N,g=E=>a({loupe:{...x,...E}});return l.jsxs("div",{className:r.loupe?"":"opacity-40 pointer-events-none",children:[l.jsx(Z,{label:"Width",value:x.width,min:.05,max:1,step:.01,formatValue:E=>E.toFixed(2),onChange:E=>g({width:E})}),l.jsx(Z,{label:"Height",value:x.height,min:.05,max:1,step:.01,formatValue:E=>E.toFixed(2),onChange:E=>g({height:E})}),l.jsx(Z,{label:"Source X",value:x.sourceX,min:-1,max:1,step:.01,formatValue:E=>E.toFixed(2),onChange:E=>g({sourceX:E})}),l.jsx(Z,{label:"Source Y",value:x.sourceY,min:-1,max:1,step:.01,formatValue:E=>E.toFixed(2),onChange:E=>g({sourceY:E})}),l.jsx(Z,{label:"Corner Radius",value:x.cornerRadius??0,min:0,max:100,formatValue:E=>`${E}`,onChange:E=>g({cornerRadius:E})}),l.jsx(vt,{label:"Border",checked:(x.borderWidth??0)>0,onChange:E=>g({borderWidth:E?3:0})}),(x.borderWidth??0)>0&&l.jsxs(l.Fragment,{children:[l.jsx(Z,{label:"Border Width",value:x.borderWidth,min:1,max:10,formatValue:E=>`${E}px`,onChange:E=>g({borderWidth:E})}),l.jsx(qe,{label:"Border Color",value:x.borderColor,onChange:E=>g({borderColor:E})})]}),l.jsx(vt,{label:"Shadow",checked:!!x.shadow,onChange:E=>g({shadow:E})}),x.shadow&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Shadow Color",value:x.shadowColor??"#000000",onChange:E=>g({shadowColor:E})}),l.jsx(Z,{label:"Shadow Radius",value:x.shadowRadius??30,min:0,max:100,formatValue:E=>`${E}`,onChange:E=>g({shadowRadius:E})}),l.jsx(Z,{label:"Shadow X Offset",value:x.shadowOffsetX??0,min:-50,max:50,formatValue:E=>`${E}`,onChange:E=>g({shadowOffsetX:E})}),l.jsx(Z,{label:"Shadow Y Offset",value:x.shadowOffsetY??0,min:-50,max:50,formatValue:E=>`${E}`,onChange:E=>g({shadowOffsetY:E})})]}),l.jsx(Z,{label:"Scale",value:x.scale??1.1,min:1,max:3,step:.01,formatValue:E=>`${E.toFixed(2)}x`,onChange:E=>g({scale:E})}),l.jsx(Z,{label:"X Offset",value:x.xOffset??0,min:-100,max:100,formatValue:E=>`${E}`,onChange:E=>g({xOffset:E})}),l.jsx(Z,{label:"Y Offset",value:x.yOffset??0,min:-100,max:100,formatValue:E=>`${E}`,onChange:E=>g({yOffset:E})})]})})()]}),l.jsxs(Fe,{title:"Callouts",tooltip:"Crop and enlarge a portion of the screenshot, displayed as a floating callout card.",children:[r.callouts.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Zoom into a specific area and display it as a floating card. Perfect for showcasing small UI details."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:$,children:"+ Add Callout"}),r.callouts.map((N,x)=>l.jsxs(Ol,{title:`Callout ${x+1}`,onRemove:()=>f(x),children:[l.jsx(Z,{label:"Source X",value:N.sourceX,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(x,{sourceX:g})}),l.jsx(Z,{label:"Source Y",value:N.sourceY,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(x,{sourceY:g})}),l.jsx(Z,{label:"Source W",value:N.sourceW,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>y(x,{sourceW:g})}),l.jsx(Z,{label:"Source H",value:N.sourceH,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>y(x,{sourceH:g})}),l.jsx(Z,{label:"Display X",value:N.displayX,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(x,{displayX:g})}),l.jsx(Z,{label:"Display Y",value:N.displayY,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(x,{displayY:g})}),l.jsx(Z,{label:"Scale",value:Math.round(N.displayScale*100),min:50,max:300,step:10,formatValue:g=>`${(g/100).toFixed(1)}x`,onChange:g=>y(x,{displayScale:g/100})}),l.jsx(Z,{label:"Rotation",value:N.rotation,min:-45,max:45,formatValue:g=>`${g}°`,onChange:g=>y(x,{rotation:g})}),l.jsx(Z,{label:"Radius",value:N.borderRadius,min:0,max:30,formatValue:g=>`${g}px`,onChange:g=>y(x,{borderRadius:g})})]},N.id))]}),l.jsxs(Fe,{title:"Overlays",tooltip:"Add decorative shapes, stars, icons, or badges floating over the screenshot.",children:[r.overlays.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Add floating shapes, star ratings, icons, or badges over your screenshot for extra visual appeal."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:_,children:"+ Add Overlay"}),r.overlays.map((N,x)=>l.jsxs(Ol,{title:`Overlay ${x+1}`,onRemove:()=>T(x),children:[l.jsx(Ge,{label:"Type",value:N.type,onChange:g=>w(x,{type:g}),options:[{value:"shape",label:"Shape"},{value:"star-rating",label:"Star Rating"},{value:"icon",label:"Icon"},{value:"badge",label:"Badge"},{value:"custom",label:"Custom"}]}),l.jsx(Z,{label:"X",value:N.x,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>w(x,{x:g})}),l.jsx(Z,{label:"Y",value:N.y,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>w(x,{y:g})}),l.jsx(Z,{label:"Size",value:N.size,min:1,max:50,formatValue:g=>`${g}%`,onChange:g=>w(x,{size:g})}),l.jsx(Z,{label:"Rotation",value:N.rotation,min:-180,max:180,formatValue:g=>`${g}°`,onChange:g=>w(x,{rotation:g})}),l.jsx(Z,{label:"Opacity",value:Math.round(N.opacity*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>w(x,{opacity:g/100})}),N.type==="shape"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:N.shapeType??"circle",onChange:g=>w(x,{shapeType:g}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"}]}),l.jsx(qe,{label:"Color",value:N.shapeColor??"#6366f1",onChange:g=>w(x,{shapeColor:g})}),l.jsx(Z,{label:"Shape Opacity",value:Math.round((N.shapeOpacity??.5)*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>w(x,{shapeOpacity:g/100})}),l.jsx(Z,{label:"Blur",value:N.shapeBlur??0,min:0,max:50,formatValue:g=>`${g}px`,onChange:g=>w(x,{shapeBlur:g})})]})]},N.id))]})]})}function pf(r,a,i,c){var m,h,p,y,f,$;return{screenIndex:r.screenIndex,screenshotDataUrl:r.screenshotDataUrl||void 0,locale:c!=="default"?c:void 0,style:r.style,layout:r.layout,headline:r.headline,subtitle:r.subtitle,colors:r.colors,font:r.font,fontWeight:r.fontWeight,headlineSize:r.headlineSize||void 0,subtitleSize:r.subtitleSize||void 0,headlineRotation:r.headlineRotation||void 0,subtitleRotation:r.subtitleRotation||void 0,frameId:r.frameId,deviceColor:r.deviceColor||void 0,frameStyle:r.frameStyle,deviceScale:r.deviceScale,deviceTop:r.deviceTop,deviceRotation:r.deviceRotation,deviceOffsetX:r.deviceOffsetX,deviceAngle:r.deviceAngle,deviceTilt:r.deviceTilt,headlineTop:(m=r.textPositions.headline)==null?void 0:m.y,headlineLeft:(h=r.textPositions.headline)==null?void 0:h.x,headlineWidth:(p=r.textPositions.headline)==null?void 0:p.width,subtitleTop:(y=r.textPositions.subtitle)==null?void 0:y.y,subtitleLeft:(f=r.textPositions.subtitle)==null?void 0:f.x,subtitleWidth:($=r.textPositions.subtitle)==null?void 0:$.width,composition:r.composition||"single",headlineGradient:r.headlineGradient||void 0,subtitleGradient:r.subtitleGradient||void 0,autoSizeHeadline:r.autoSizeHeadline||void 0,autoSizeSubtitle:r.autoSizeSubtitle||void 0,spotlight:r.spotlight||void 0,annotations:r.annotations.length>0?r.annotations:void 0,backgroundType:r.backgroundType!=="preset"?r.backgroundType:void 0,backgroundColor:r.backgroundType==="solid"?r.backgroundColor:void 0,backgroundGradient:r.backgroundType==="gradient"?r.backgroundGradient:void 0,backgroundImageDataUrl:r.backgroundType==="image"?r.backgroundImageDataUrl:void 0,backgroundOverlay:r.backgroundType==="image"&&r.backgroundOverlay?r.backgroundOverlay:void 0,deviceShadow:r.deviceShadow||void 0,borderSimulation:r.borderSimulation||void 0,cornerRadius:r.cornerRadius||void 0,loupe:r.loupe||void 0,callouts:r.callouts.length>0?r.callouts:void 0,overlays:r.overlays.length>0?r.overlays:void 0,headlineLineHeight:r.headlineLineHeight?r.headlineLineHeight/100:void 0,headlineLetterSpacing:r.headlineLetterSpacing?`${r.headlineLetterSpacing/100}em`:void 0,headlineTextTransform:r.headlineTextTransform||void 0,headlineFontStyle:r.headlineFontStyle||void 0,subtitleOpacity:r.subtitleOpacity?r.subtitleOpacity/100:void 0,subtitleLetterSpacing:r.subtitleLetterSpacing?`${r.subtitleLetterSpacing/100}em`:void 0,subtitleTextTransform:r.subtitleTextTransform||void 0,width:a,height:i}}function Xp(r,a,i,c,m,h){return pf(r,i,c,m)}function Qp(r,a){return{...pf(r,a.previewW,a.previewH,a.locale),sizeKey:a.sizeKey,renderer:a.renderer}}function Gp({message:r,onDone:a}){return C.useEffect(()=>{const i=setTimeout(a,3e3);return()=>clearTimeout(i)},[a]),l.jsx("div",{role:"alert","aria-live":"polite",className:"fixed top-4 right-4 z-50 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-in fade-in",children:r})}function Vi(r,a){const i=URL.createObjectURL(r),c=document.createElement("a");c.href=i,c.download=a,c.style.display="none",document.body.appendChild(c),requestAnimationFrame(()=>{c.click()}),window.setTimeout(()=>{URL.revokeObjectURL(i),c.remove()},6e4)}async function Kp(r){const a=window.showSaveFilePicker;if(typeof a=="function")try{return await a({suggestedName:r,excludeAcceptAllOption:!1,types:[{description:"PNG image",accept:{"image/png":[".png"]}}]})}catch(i){if(i instanceof DOMException&&i.name==="AbortError")return null;throw i}}async function Zp(r,a){const i=await r.createWritable();await i.write(a),await i.close()}function Yd(){const r=X(H=>H.platform),a=X(H=>H.sizes),i=X(H=>H.exportSize),c=X(H=>H.setExportSize),m=X(H=>H.exportRenderer),h=X(H=>H.setExportRenderer),p=X(H=>H.koubouAvailable),y=X(H=>H.locale),f=X(H=>H.setLocale),$=X(H=>H.previewBg),w=X(H=>H.setPreviewBg),T=X(H=>H.config),_=X(H=>H.initScreens),N=X(H=>H.triggerRender),x=X(H=>H.screens),g=X(H=>H.isPanoramic),E=X(H=>H.panoramicFrameCount),k=X(H=>H.panoramicBackground),J=X(H=>H.panoramicElements),ne=X(H=>H.panoramicEffects),le=X(H=>H.previewW),re=X(H=>H.previewH),[ae,ue]=C.useState(!1),[v,U]=C.useState("Ready"),[be,K]=C.useState(null),fe=C.useCallback(()=>K(null),[]),ze=(a[r]??[]).map(H=>({value:H.key,label:`${H.name} (${H.width}×${H.height})`})),Le=i||ia(a,r)||"";C.useEffect(()=>{!i&&Le&&c(Le)},[i,Le,c]);const O=!p||r==="android",W=[{value:"playwright",label:"Playwright (fast)"},{value:"koubou",label:"Koubou (pixel-perfect)",disabled:O,title:O?p?"Koubou is not available for Android":"Koubou server not running":void 0}],M=[{value:"default",label:"Default"}];if(T!=null&&T.locales)for(const H of Object.keys(T.locales))M.push({value:H,label:H});const Y=H=>({frameCount:E,frameWidth:le,frameHeight:re,background:k,elements:J,effects:ne,font:T==null?void 0:T.theme.font,fontWeight:T==null?void 0:T.theme.fontWeight,frameStyle:T==null?void 0:T.frames.style,sizeKey:Le,frameIndex:H}),V=async()=>{ue(!0);let H=0;for(let xe=0;xe<E;xe++){U(`Downloading frame ${xe+1} of ${E}...`);try{const we=await Hi(Y(xe));Vi(we,`frame-${xe+1}.png`),H++}catch(we){U(`Error on frame ${xe+1}: ${we instanceof Error?we.message:"Unknown"}`)}}ue(!1),U(`Downloaded ${H} of ${E} frames`),K(`Downloaded ${H} frames`)},R=async()=>{const H="panoramic-full.png",xe=await Kp(H);if(xe===null){U("Download canceled");return}if(xe){ue(!0),U("Downloading full panoramic canvas...");try{const we=await Hi(Y());await Zp(xe,we);const Ie=Math.round(we.size/1024);U(`Downloaded panoramic (${Ie}KB)`),K(`Panoramic canvas downloaded (${Ie}KB)`)}catch(we){U(`Download error: ${we instanceof Error?we.message:"Unknown error"}`)}finally{ue(!1)}return}ue(!0),U("Downloading full panoramic canvas...");try{const we=await Hi(Y());Vi(we,H);const Ie=Math.round(we.size/1024);U(`Downloaded panoramic (${Ie}KB)`),K(`Panoramic canvas downloaded (${Ie}KB)`)}catch(we){U(`Download error: ${we instanceof Error?we.message:"Unknown error"}`)}finally{ue(!1)}},F=async()=>{if(x.length===0)return;ue(!0);let H=0;for(let xe=0;xe<x.length;xe++){const we=x[xe];if(we){U(`Downloading screen ${xe+1} of ${x.length}...`);try{const Ie=await bp(Qp(we,{previewW:le,previewH:re,locale:y,sizeKey:Le,renderer:m}));Vi(Ie,`screenshot-${xe+1}.png`),H++}catch(Ie){U(`Error on screen ${xe+1}: ${Ie instanceof Error?Ie.message:"Unknown"}`)}}}ue(!1),U(`Downloaded ${H} of ${x.length} screens`),K(`Downloaded ${H} screenshots`)},ie=async()=>{try{const H=await pp();_(H,r),N(),U("Config reloaded")}catch(H){U(`Reload error: ${H instanceof Error?H.message:"Unknown error"}`)}};return!g&&x.length===0?l.jsx(Fe,{title:"Download",tooltip:"Choose output size and renderer, then download your screenshots.",defaultCollapsed:!1,children:l.jsxs("p",{className:"text-xs text-text-dim text-center py-4",children:["No screens to download."," ",l.jsx("button",{className:"text-accent hover:text-accent-hover underline",onClick:()=>X.getState().setActiveTab("background"),children:"Go to Background tab"})," ","to get started."]})}):l.jsxs(l.Fragment,{children:[be&&l.jsx(Gp,{message:be,onDone:fe}),l.jsxs(Fe,{title:"Download",tooltip:"Choose output size and renderer, then download your screenshots.",defaultCollapsed:!1,children:[l.jsx(Ge,{label:"Output Size",value:Le,onChange:c,options:ze}),!g&&p&&l.jsx(Ge,{label:"Renderer",value:m,onChange:h,options:W}),g?l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1",onClick:V,disabled:ae,children:ae?"Downloading...":`Download all ${E} frames`}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text disabled:opacity-50 mt-1",onClick:R,disabled:ae,children:ae?"Downloading...":"Download full canvas"})]}):l.jsx(l.Fragment,{children:l.jsx("button",{className:"w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1",onClick:F,disabled:ae,children:ae?"Downloading...":`Download all ${x.length} screens`})})]}),!g&&l.jsx(Fe,{title:"Locale",tooltip:"Select a locale to export localized screenshots. Configure locales in your YAML config file.",children:l.jsx(Ge,{label:"Language",value:y,onChange:f,options:M})}),l.jsx(Fe,{title:"Preview Background",tooltip:"Change the editor background color. This does not affect exported images.",children:l.jsx("div",{className:"flex gap-3",children:["dark","light"].map(H=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:$===H,onChange:()=>w(H),className:"accent-accent"}),H.charAt(0).toUpperCase()+H.slice(1)]},H))})}),l.jsxs(Fe,{title:"Actions",tooltip:"Refresh previews or reload the YAML configuration file from disk.",children:[l.jsxs("div",{className:"flex gap-2",children:[l.jsx("button",{className:"flex-1 py-2 text-xs bg-accent hover:bg-accent-hover text-white rounded-md",onClick:N,children:"Refresh All"}),l.jsx("button",{className:"flex-1 py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:ie,children:"Reload Config"})]}),l.jsx("div",{className:`text-[10px] mt-2 ${v.startsWith("Download error")||v.startsWith("Reload error")||v.startsWith("Error")?"text-red-400":v.startsWith("Downloaded")||v==="Config reloaded"?"text-green-400":"text-text-dim"}`,children:v})]})]})}let hf=null;function Hd(r){hf=r}function Jp(){return hf}function _f(){const r=X(y=>y.previewW),a=X(y=>y.previewH),i=X(y=>y.panoramicFrameCount),c=C.useCallback(()=>{try{const y=Jp();return(y==null?void 0:y.contentDocument)??null}catch{return null}},[]),m=r*i,h=C.useCallback(y=>{const f=c();if(!f)return;const $=f.querySelector(".panoramic-canvas");if($){if(y.type==="solid"&&y.color)$.style.background=y.color;else if(y.type==="gradient"&&y.colors){const w=y.colors.join(", ");y.gradientType==="radial"?$.style.background=`radial-gradient(circle at ${y.radialPosition??"center"}, ${w})`:$.style.background=`linear-gradient(${y.direction??135}deg, ${w})`}}},[c]),p=C.useCallback((y,f)=>{const $=c();if(!$)return;const w=$.querySelector(`[data-index="${y}"]`);w&&(f.x!==void 0&&(w.style.left=`${f.x/100*m}px`),f.y!==void 0&&(w.style.top=`${f.y/100*a}px`),f.width!==void 0&&(w.style.width=`${f.width/100*m}px`),f.height!==void 0&&(w.style.height=`${f.height/100*a}px`),f.rotation!==void 0&&(w.style.transform=`rotate(${f.rotation}deg)`),f.opacity!==void 0&&(w.style.opacity=String(f.opacity)),f.color!==void 0&&(w.classList.contains("pano-decoration")?w.style.background=f.color:w.style.color=f.color),f.fontSize!==void 0&&(w.style.fontSize=`${f.fontSize/100*a}px`),f.fontWeight!==void 0&&(w.style.fontWeight=String(f.fontWeight)))},[c,m,a]);return{patchBackground:h,patchElement:p}}const ra={device:"Device",text:"Text",label:"Label",decoration:"Decoration"},qp={iphone:["iphone"],android:["iphone"],ipad:["ipad"],mac:["mac"],watch:["watch"]},eh={iphone:["default-ios","default-android"],android:["default-ios","default-android"],ipad:["default-ipad","fallback-tablet"],mac:[],watch:[]};function th(r,a,i){const c=i?qp[i]??["iphone"]:null,m=i?eh[i]??[]:null,h={};for(const f of r){const $=f.category||"other";if(c&&!c.includes($))continue;const w=h[$]??[];w.push({value:f.id,label:f.name}),h[$]=w}const p=Object.entries(h).map(([f,$])=>({label:f.charAt(0).toUpperCase()+f.slice(1),options:$})),y=[];for(const f of a){if(m&&m.length>0){if(!(f.tags??[]).some(w=>m.includes(w)))continue}else if(m&&m.length===0)continue;y.push({value:f.id,label:f.name})}return y.length>0&&p.push({label:"SVG Frames",options:y}),p}function nh(r,a){return r.map((c,m)=>({z:c.z,i:m})).sort((c,m)=>c.z-m.z).findIndex(c=>c.i===a)}function gf({index:r}){const a=X(v=>v.panoramicElements[r]),i=X(v=>v.panoramicElements),c=X(v=>v.updatePanoramicElement),m=X(v=>v.removePanoramicElement),h=X(v=>v.config),p=X(v=>v.deviceFamilies),y=X(v=>v.frames),f=X(v=>v.fonts),$=C.useRef(null),{confirm:w,dialog:T}=ua(),{patchElement:_}=_f(),N=C.useMemo(()=>nh(i,r),[i,r]),x=C.useCallback(v=>{c(r,v)},[r,c]),g=C.useCallback(v=>{_(N,v)},[_,N]);if(!a)return null;const E=X(v=>v.platform),k=th(p,y,E),J=(h==null?void 0:h.frames.ios)??"",ne=a.type==="device"?a.frame??J:"",le=p.find(v=>v.id===ne),re=le&&le.colors.length>1,ae=C.useMemo(()=>mf(f),[f]),ue=v=>{var K;const U=(K=v.target.files)==null?void 0:K[0];if(!U)return;const be=new FileReader;be.onload=fe=>{var Oe;x({screenshot:(Oe=fe.target)==null?void 0:Oe.result})},be.readAsDataURL(U),v.target.value=""};return l.jsxs("div",{children:[T,l.jsxs("div",{className:"px-5 py-3 border-b border-border flex items-center justify-between",children:[l.jsxs("span",{className:"text-xs font-medium",children:[ra[a.type]," #",i.slice(0,r).filter(v=>v.type===a.type).length+1]}),l.jsx("button",{className:"text-[10px] text-red-400 hover:text-red-300",onClick:async()=>{const v=i.slice(0,r).filter(be=>be.type===a.type).length+1;await w({title:"Remove Element",message:`Remove ${ra[a.type]} #${v}? This cannot be undone.`})&&m(r)},children:"Remove"})]}),l.jsxs(Fe,{title:"Position",defaultCollapsed:!1,children:[l.jsx(Z,{label:"X %",value:a.x,min:-50,max:150,step:.5,formatValue:v=>`${v}%`,onChange:v=>x({x:v}),onInstant:v=>g({x:v})}),l.jsx(Z,{label:"Y %",value:a.y,min:-50,max:150,step:.5,formatValue:v=>`${v}%`,onChange:v=>x({y:v}),onInstant:v=>g({y:v})}),l.jsx(Z,{label:"Z-Index",value:a.z,min:0,max:100,onChange:v=>x({z:v})})]}),a.type==="device"&&(()=>{const v=(a.frameStyle??"flat")==="none",U=le&&le.screenRect,be=a.fullscreenScreenshot??!1;return l.jsxs(l.Fragment,{children:[l.jsxs(Fe,{title:"Screenshot",children:[a.screenshot.startsWith("data:")?l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:a.screenshot,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:"Custom upload"})]}):l.jsx("div",{className:"text-xs text-text-dim mb-2 truncate",children:a.screenshot}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var K;return(K=$.current)==null?void 0:K.click()},children:"Upload Screenshot"}),l.jsx("input",{ref:$,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload screenshot image",onChange:ue}),a.screenshot.startsWith("data:")&&l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>{var K;return x({screenshot:((K=h==null?void 0:h.screens[0])==null?void 0:K.screenshot)??"screenshots/screen-1.png"})},children:"Revert to File"})]}),l.jsxs(Fe,{title:"Device Frame",children:[l.jsx(Ge,{label:"Frame",value:ne,onChange:K=>{const fe=p.find(ze=>ze.id===K),Oe=fe&&fe.screenRect;x(Oe&&v?{frame:K,frameStyle:"flat"}:{frame:K})},groups:k}),re&&l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),l.jsx("div",{className:"flex flex-wrap gap-1",children:le.colors.map(K=>l.jsx("button",{className:`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent ${a.deviceColor===K.name?"border-accent ring-1 ring-accent":"border-border"}`,style:{background:ff[K.name]??"#888888"},title:K.name,"aria-label":`${K.name} color variant`,"aria-pressed":a.deviceColor===K.name,onClick:()=>x({deviceColor:K.name})},K.name))})]}),l.jsx(Ge,{label:"Frame Style",value:a.frameStyle??"flat",onChange:K=>x({frameStyle:K}),options:[{value:"flat",label:"Flat"},{value:"none",label:"None (frameless)"}],hidden:!!U}),v&&l.jsxs(l.Fragment,{children:[l.jsx(vt,{label:"Border Simulation",checked:!!a.borderSimulation,onChange:K=>x({borderSimulation:K?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:void 0})}),a.borderSimulation&&(()=>{const K=a.borderSimulation;return l.jsxs(l.Fragment,{children:[l.jsx(Z,{label:"Thickness",value:K.thickness,min:1,max:20,formatValue:fe=>`${fe}px`,onChange:fe=>x({borderSimulation:{...K,thickness:fe}})}),l.jsx(qe,{label:"Color",value:K.color,onChange:fe=>x({borderSimulation:{...K,color:fe}})}),l.jsx(Z,{label:"Radius",value:K.radius,min:0,max:60,formatValue:fe=>`${fe}px`,onChange:fe=>x({borderSimulation:{...K,radius:fe}})})]})})()]})]}),l.jsxs(Fe,{title:"Device Layout",tooltip:"Control device scale, position, and fullscreen mode.",children:[l.jsx(vt,{label:"Fullscreen Screenshot",checked:be,onChange:K=>x({fullscreenScreenshot:K})}),!be&&l.jsxs(l.Fragment,{children:[l.jsx(Z,{label:"Device Size",value:a.width,min:5,max:60,step:.5,formatValue:K=>`${K}%`,onChange:K=>x({width:K}),onInstant:K=>g({width:K})}),l.jsx(Z,{label:"Device Rotation",value:a.rotation,min:-180,max:180,formatValue:K=>`${K}°`,onChange:K=>x({rotation:K}),onInstant:K=>g({rotation:K})}),l.jsx(Z,{label:"3D Tilt",value:a.deviceTilt??0,min:0,max:40,formatValue:K=>`${K}°`,onChange:K=>x({deviceTilt:K})}),v&&l.jsx(Z,{label:"Corner Radius",value:a.cornerRadius??0,min:0,max:50,formatValue:K=>`${K}%`,onChange:K=>x({cornerRadius:K})})]})]}),l.jsxs(Fe,{title:"Device Shadow",tooltip:"Add a custom shadow beneath the device frame.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Custom Shadow",checked:!!a.shadow,onChange:K=>x({shadow:K?{opacity:.25,blur:20,color:"#000000",offsetY:10}:void 0})}),a.shadow&&l.jsxs(l.Fragment,{children:[l.jsx(Z,{label:"Opacity",value:Math.round(a.shadow.opacity*100),min:0,max:100,formatValue:K=>`${K}%`,onChange:K=>x({shadow:{...a.shadow,opacity:K/100}})}),l.jsx(Z,{label:"Blur",value:a.shadow.blur,min:0,max:50,formatValue:K=>`${K}px`,onChange:K=>x({shadow:{...a.shadow,blur:K}})}),l.jsx(qe,{label:"Color",value:a.shadow.color,onChange:K=>x({shadow:{...a.shadow,color:K}})}),l.jsx(Z,{label:"Y Offset",value:a.shadow.offsetY,min:0,max:30,formatValue:K=>`${K}px`,onChange:K=>x({shadow:{...a.shadow,offsetY:K}})})]})]})]})})(),a.type==="text"&&l.jsxs(l.Fragment,{children:[l.jsxs(Fe,{title:"Content",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Headline"}),l.jsx("textarea",{rows:3,value:a.content,onChange:v=>x({content:v.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),l.jsx(qe,{label:"Color",value:a.color,onChange:v=>x({color:v})})]}),l.jsxs(Fe,{title:"Typography",tooltip:"Control font family, weight, size, and styling for this element.",children:[l.jsx(Ge,{label:"Font",value:a.font??(h==null?void 0:h.theme.font)??"inter",onChange:v=>x({font:v}),groups:ae}),l.jsx(Z,{label:"Font Size",value:a.fontSize,min:.5,max:20,step:.1,formatValue:v=>`${v}%`,onChange:v=>x({fontSize:v}),onInstant:v=>g({fontSize:v})}),l.jsx(Z,{label:"Font Weight",value:a.fontWeight,min:100,max:900,step:100,formatValue:v=>String(v),onChange:v=>x({fontWeight:v}),onInstant:v=>g({fontWeight:v})}),l.jsx(Ge,{label:"Alignment",value:a.textAlign,onChange:v=>x({textAlign:v}),options:[{value:"left",label:"Left"},{value:"center",label:"Center"},{value:"right",label:"Right"}]}),l.jsx(Z,{label:"Line Height",value:a.lineHeight,min:.8,max:2,step:.05,formatValue:v=>v.toFixed(2),onChange:v=>x({lineHeight:v})}),l.jsxs("div",{className:"flex gap-2 mb-2",children:[l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Case",value:a.textTransform??"",onChange:v=>x({textTransform:v}),options:[{value:"",label:"Auto"},{value:"none",label:"None"},{value:"uppercase",label:"Uppercase"},{value:"lowercase",label:"Lowercase"},{value:"capitalize",label:"Capitalize"}]})}),l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Style",value:a.fontStyle,onChange:v=>x({fontStyle:v}),options:[{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}]})})]}),l.jsx(Z,{label:"Letter Spacing",value:a.letterSpacing??0,min:-5,max:10,formatValue:v=>v===0?"Auto":`${v/100}em`,onChange:v=>x({letterSpacing:v})}),l.jsx(Z,{label:"Rotation",value:a.rotation??0,min:-30,max:30,formatValue:v=>`${v}°`,onChange:v=>x({rotation:v})})]}),l.jsxs(Fe,{title:"Text Gradient",tooltip:"Apply a gradient color effect to the text.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Enable Gradient",checked:!!a.gradient,onChange:v=>x({gradient:v?{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"}:void 0})}),a.gradient&&(()=>{const v=a.gradient;return l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:iu.map(U=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${U.direction}deg, ${U.colors.join(", ")})`},title:U.name,"aria-label":`Apply ${U.name} gradient`,onClick:()=>x({gradient:{type:"linear",colors:[...U.colors],direction:U.direction,radialPosition:"center"}})},U.name))}),l.jsx(Z,{label:"Direction",value:v.direction,min:0,max:360,formatValue:U=>`${U}°`,onChange:U=>x({gradient:{...v,direction:U}})}),v.colors.map((U,be)=>l.jsx(qe,{label:`Stop ${be+1}`,value:U,onChange:K=>{const fe=[...v.colors];fe[be]=K,x({gradient:{...v,colors:fe}})}},be))]})})()]}),l.jsxs(Fe,{title:"Layout",children:[l.jsx(vt,{label:"Limit width",checked:a.maxWidth!==void 0,onChange:v=>x({maxWidth:v?25:void 0})}),a.maxWidth!==void 0&&l.jsx(Z,{label:"Max Width %",value:a.maxWidth,min:5,max:100,step:.5,formatValue:v=>`${v}%`,onChange:v=>x({maxWidth:v})})]})]}),a.type==="label"&&l.jsxs(Fe,{title:"Label",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Content"}),l.jsx("input",{type:"text",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] outline-none focus:border-accent",value:a.content,onChange:v=>x({content:v.target.value})})]}),l.jsx(Z,{label:"Font Size",value:a.fontSize,min:.5,max:10,step:.1,formatValue:v=>`${v}%`,onChange:v=>x({fontSize:v}),onInstant:v=>g({fontSize:v})}),l.jsx(qe,{label:"Text Color",value:a.color,onChange:v=>x({color:v})}),l.jsx(qe,{label:"Background",value:a.backgroundColor??"#00000033",onChange:v=>x({backgroundColor:v})}),l.jsx(Z,{label:"Padding",value:a.padding,min:0,max:5,step:.1,formatValue:v=>`${v}%`,onChange:v=>x({padding:v})}),l.jsx(Z,{label:"Border Radius",value:a.borderRadius,min:0,max:30,formatValue:v=>`${v}px`,onChange:v=>x({borderRadius:v})})]}),a.type==="decoration"&&l.jsxs(Fe,{title:"Decoration",children:[l.jsx(Ge,{label:"Shape",value:a.shape,onChange:v=>x({shape:v}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"},{value:"dot-grid",label:"Dot Grid"}]}),l.jsx(Z,{label:"Width",value:a.width,min:.5,max:100,step:.5,formatValue:v=>`${v}%`,onChange:v=>x({width:v}),onInstant:v=>g({width:v})}),a.height!==void 0&&l.jsx(Z,{label:"Height",value:a.height,min:.5,max:100,step:.5,formatValue:v=>`${v}%`,onChange:v=>x({height:v}),onInstant:v=>g({height:v})}),l.jsx(Z,{label:"Opacity",value:a.opacity,min:0,max:1,step:.05,formatValue:v=>`${Math.round(v*100)}%`,onChange:v=>x({opacity:v}),onInstant:v=>g({opacity:v})}),l.jsx(Z,{label:"Rotation",value:a.rotation,min:-180,max:180,formatValue:v=>`${v}°`,onChange:v=>x({rotation:v}),onInstant:v=>g({rotation:v})}),l.jsx(qe,{label:"Color",value:a.color,onChange:v=>x({color:v})})]})]})}function oh({imageDataUrl:r,onUpload:a,onRemove:i}){const c=C.useRef(null),m=h=>{var f;const p=(f=h.target.files)==null?void 0:f[0];if(!p)return;const y=new FileReader;y.onload=$=>{var w;return a((w=$.target)==null?void 0:w.result)},y.readAsDataURL(p),h.target.value=""};return l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var h;return(h=c.current)==null?void 0:h.click()},children:"Upload Background Image"}),l.jsx("input",{ref:c,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload background image",onChange:m}),r&&l.jsxs("div",{className:"mt-1.5",children:[l.jsx("img",{src:r,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:i,children:"Remove"})]})]})}function rh(){const r=C.useRef(null),a=X(p=>p.panoramicElements),i=X(p=>p.updatePanoramicElement),c=X(p=>p.addPanoramicElement),m=a.map((p,y)=>({el:p,i:y})).filter(({el:p})=>p.type==="device"),h=p=>{const y=Array.from(p.target.files??[]);y.length!==0&&(y.forEach((f,$)=>{const w=new FileReader;w.onload=T=>{var N;const _=(N=T.target)==null?void 0:N.result;if($<m.length)i(m[$].i,{screenshot:_});else{const x=m.length+($-m.length);c({type:"device",screenshot:_,x:10+x*20,y:15,width:12,rotation:0,z:5})}},w.readAsDataURL(f)}),p.target.value="")};return l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var p;return(p=r.current)==null?void 0:p.click()},children:"Upload Screenshots"}),l.jsx("input",{ref:r,type:"file",accept:"image/png,image/jpeg,image/webp",multiple:!0,className:"hidden","aria-label":"Upload device screenshots",onChange:h}),m.length>0&&l.jsx("div",{className:"mt-2 space-y-1",children:m.map(({el:p,i:y})=>l.jsxs("div",{className:"flex items-center gap-2 text-[11px] text-text-dim",children:[l.jsx("span",{className:"w-4 text-center",children:m.indexOf(m.find(f=>f.i===y))+1}),p.screenshot.startsWith("data:")?l.jsx("img",{src:p.screenshot,alt:"",className:"w-6 h-6 rounded object-cover border border-border"}):l.jsx("span",{className:"truncate flex-1",children:p.screenshot})]},y))}),l.jsx("p",{className:"text-[10px] text-text-dim mt-1.5",children:"Select multiple files to assign to device elements in order."})]})}const lh=[{value:"iphone",label:"iPhone"},{value:"ipad",label:"iPad"},{value:"mac",label:"Mac"},{value:"watch",label:"Apple Watch"},{value:"android",label:"Android"}];function sh(){const r=X(k=>k.panoramicFrameCount),a=X(k=>k.setPanoramicFrameCount),i=X(k=>k.panoramicBackground),c=X(k=>k.updatePanoramicBackground),m=X(k=>k.platform),h=X(k=>k.setPlatform),p=X(k=>k.setPreviewSize),y=X(k=>k.sizes),f=X(k=>k.setExportSize),$=X(k=>k.syncPanoramicDevicesForPlatform),{patchBackground:w}=_f(),T=C.useCallback(k=>{h(k),$(k);const J=uu(k);p(J.w,J.h);const ne=ia(y,k);ne&&f(ne)},[f,h,p,y,$]),_=C.useCallback(k=>w({type:"solid",color:k}),[w]),N=C.useCallback(k=>{const J=i.gradient??{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"};w({type:"gradient",gradientType:J.type,colors:(k==null?void 0:k.colors)??J.colors,direction:(k==null?void 0:k.direction)??J.direction,radialPosition:J.radialPosition})},[i.gradient,w]),x=i.type,g=i.color??"#000000",E=i.gradient??{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"};return l.jsxs("div",{children:[l.jsxs(Fe,{title:"Canvas",defaultCollapsed:!1,children:[l.jsx(Ge,{label:"Platform",value:m,onChange:T,options:lh}),l.jsx(Z,{label:"Frame Count",value:r,min:2,max:10,onChange:a})]}),l.jsxs(Fe,{title:"Background",children:[l.jsx("div",{className:"flex gap-3 mb-2.5",children:["solid","gradient","image","preset"].map(k=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"pano-bg-type",value:k,checked:x===k,onChange:()=>c({type:k}),className:"accent-accent"}),k.charAt(0).toUpperCase()+k.slice(1)]},k))}),x==="preset"&&l.jsx(Ge,{label:"Style Preset",value:i.preset??"",onChange:k=>c({preset:k}),options:[{value:"",label:"Select a preset..."},{value:"minimal",label:"Minimal"},{value:"bold",label:"Bold"},{value:"glow",label:"Glow"},{value:"playful",label:"Playful"},{value:"clean",label:"Clean"},{value:"branded",label:"Branded"},{value:"editorial",label:"Editorial"}]}),x==="solid"&&l.jsx(qe,{label:"Color",value:g,onChange:k=>c({color:k}),onInstant:_,presets:df}),x==="gradient"&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:iu.map(k=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${k.direction}deg, ${k.colors.join(", ")})`},title:k.name,"aria-label":`Apply ${k.name} gradient`,onClick:()=>c({gradient:{type:"linear",colors:[...k.colors],direction:k.direction,radialPosition:"center"}})},k.name))}),l.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(k=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:E.type===k,onChange:()=>c({gradient:{...E,type:k}}),className:"accent-accent"}),k.charAt(0).toUpperCase()+k.slice(1)]},k))}),E.type==="linear"&&l.jsx(Z,{label:"Direction",value:E.direction,min:0,max:360,formatValue:k=>`${k}°`,onChange:k=>c({gradient:{...E,direction:k}}),onInstant:k=>N({direction:k})}),E.type==="radial"&&l.jsx(Ge,{label:"Center",value:E.radialPosition??"center",onChange:k=>c({gradient:{...E,radialPosition:k}}),options:[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}]}),E.colors.map((k,J)=>l.jsx(qe,{label:`Stop ${J+1}`,value:k,onChange:ne=>{const le=[...E.colors];le[J]=ne,c({gradient:{...E,colors:le}})}},J)),E.colors.length<5&&l.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{const k=[...E.colors,"#ffffff"];c({gradient:{...E,colors:k}})},children:"+ Add Color Stop"})]}),x==="image"&&l.jsxs(l.Fragment,{children:[l.jsx(oh,{imageDataUrl:i.image,onUpload:k=>c({image:k}),onRemove:()=>c({image:void 0})}),l.jsxs("div",{className:"mt-2",children:[l.jsx(vt,{label:"Dim Overlay",checked:!!i.overlay,onChange:k=>c({overlay:k?{color:"#000000",opacity:.3}:void 0})}),i.overlay&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Color",value:i.overlay.color,onChange:k=>c({overlay:{...i.overlay,color:k}})}),l.jsx(Z,{label:"Opacity",value:Math.round(i.overlay.opacity*100),min:0,max:100,formatValue:k=>`${k}%`,onChange:k=>c({overlay:{...i.overlay,opacity:k/100}})})]})]})]})]})]})}function ah(){const r=X($=>$.panoramicElements),a=X($=>$.selectedElementIndex),i=X($=>$.setSelectedElement),c=X($=>$.addPanoramicElement),m=X($=>$.config),h=r.map(($,w)=>({el:$,i:w})).filter(({el:$})=>$.type==="device"||$.type==="decoration"),p=()=>{var T,_;const $=r.filter(N=>N.type==="device").length,w=((T=m==null?void 0:m.screens[$])==null?void 0:T.screenshot)??((_=m==null?void 0:m.screens[0])==null?void 0:_.screenshot)??"screenshots/screen-1.png";c({type:"device",screenshot:w,x:10+$*20,y:15,width:12,rotation:0,z:5})},y=()=>{c({type:"decoration",shape:"circle",x:50,y:50,width:5,height:8,color:(m==null?void 0:m.theme.colors.primary)??"#6366F1",opacity:.15,rotation:0,z:0})},f=a!==null&&r[a]&&(r[a].type==="device"||r[a].type==="decoration");return l.jsxs("div",{children:[l.jsx(Fe,{title:"Screenshots",children:l.jsx(rh,{})}),l.jsxs(Fe,{title:`Devices & Decorations (${h.length})`,defaultCollapsed:!1,children:[l.jsxs("div",{className:"grid grid-cols-2 gap-1 mb-3",children:[l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:p,children:"+ Device"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:y,children:"+ Decoration"})]}),h.length===0&&l.jsx("p",{className:"text-xs text-text-dim text-center py-4",children:"Add devices to place screenshots on the panoramic canvas."}),l.jsx("div",{className:"space-y-1",children:h.map(({el:$,i:w})=>{const T=r.slice(0,w).filter(_=>_.type===$.type).length+1;return l.jsxs("button",{className:`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${w===a?"bg-accent/15 text-accent border border-accent/30":"bg-surface-2 border border-border hover:border-accent/30"}`,onClick:()=>i(w===a?null:w),children:[l.jsxs("span",{className:"font-medium",children:[ra[$.type]," #",T]}),l.jsxs("span",{className:"text-text-dim ml-1",children:["(",Math.round($.x),"%, ",Math.round($.y),"%)"]})]},w)})})]}),f&&l.jsx(gf,{index:a})]})}function ih(){const r=X(f=>f.panoramicElements),a=X(f=>f.selectedElementIndex),i=X(f=>f.setSelectedElement),c=X(f=>f.addPanoramicElement),m=r.map((f,$)=>({el:f,i:$})).filter(({el:f})=>f.type==="text"||f.type==="label"),h=()=>{const f=r.filter($=>$.type==="text").length;c({type:"text",content:"New headline",x:5+f*20,y:5,fontSize:3.5,color:"#FFFFFF",fontWeight:700,fontStyle:"normal",textAlign:"left",lineHeight:1.15,maxWidth:25,z:10})},p=()=>{c({type:"label",content:"New Label",x:50,y:50,fontSize:1.5,color:"#FFFFFF",backgroundColor:"#00000044",padding:.5,borderRadius:8,z:15})},y=a!==null&&r[a]&&(r[a].type==="text"||r[a].type==="label");return l.jsxs("div",{children:[l.jsxs(Fe,{title:`Text & Labels (${m.length})`,defaultCollapsed:!1,children:[l.jsxs("div",{className:"grid grid-cols-2 gap-1 mb-3",children:[l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:h,children:"+ Text"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:p,children:"+ Label"})]}),m.length===0&&l.jsx("p",{className:"text-xs text-text-dim text-center py-4",children:"Add text elements for headlines, subtitles, and labels."}),l.jsx("div",{className:"space-y-1",children:m.map(({el:f,i:$})=>{const w=r.slice(0,$).filter(T=>T.type===f.type).length+1;return l.jsxs("button",{className:`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${$===a?"bg-accent/15 text-accent border border-accent/30":"bg-surface-2 border border-border hover:border-accent/30"}`,onClick:()=>i($===a?null:$),children:[l.jsxs("span",{className:"font-medium",children:[ra[f.type]," #",w]}),l.jsxs("span",{className:"text-text-dim ml-1",children:["(",Math.round(f.x),"%, ",Math.round(f.y),"%)"]}),(f.type==="text"||f.type==="label")&&l.jsxs("span",{className:"text-text-dim ml-1 truncate",title:f.content,children:["— ",f.content.slice(0,20)]})]},$)})})]}),y&&l.jsx(gf,{index:a})]})}function Ud(r){return`${r}-${crypto.randomUUID().slice(0,8)}`}function uh(){const r=X(w=>w.panoramicEffects),a=X(w=>w.updatePanoramicEffects),{confirm:i,dialog:c}=ua(),m=(w,T)=>{const _=r.annotations.map((N,x)=>x===w?{...N,...T}:N);a({annotations:_})},h=async w=>{await i({title:"Remove Annotation",message:`Remove Annotation ${w+1}? This cannot be undone.`})&&a({annotations:r.annotations.filter((_,N)=>N!==w)})},p=()=>{a({annotations:[...r.annotations,{id:Ud("ann"),shape:"rounded-rect",x:40,y:40,w:20,h:20,strokeColor:"#FF3B30",strokeWidth:4}]})},y=(w,T)=>{const _=r.overlays.map((N,x)=>x===w?{...N,...T}:N);a({overlays:_})},f=async w=>{await i({title:"Remove Overlay",message:`Remove Overlay ${w+1}? This cannot be undone.`})&&a({overlays:r.overlays.filter((_,N)=>N!==w)})},$=()=>{a({overlays:[...r.overlays,{id:Ud("overlay"),type:"shape",x:10,y:10,size:10,rotation:0,opacity:1,shapeType:"circle",shapeColor:"#6366f1",shapeOpacity:.5,shapeBlur:10}]})};return l.jsxs(l.Fragment,{children:[c,l.jsxs(Fe,{title:"Spotlight / Dimming",tooltip:"Dim the panoramic canvas and highlight a specific area to draw attention.",defaultCollapsed:!1,children:[!r.spotlight&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Dim the canvas background and highlight a specific region to guide the viewer's eye."}),l.jsx(vt,{label:"Enable Spotlight",checked:!!r.spotlight,onChange:w=>a({spotlight:w?{x:50,y:50,w:30,h:30,shape:"rectangle",dimOpacity:.6,blur:0}:null})}),r.spotlight&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:r.spotlight.shape,onChange:w=>a({spotlight:{...r.spotlight,shape:w}}),options:[{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(Z,{label:"Position X",value:r.spotlight.x,min:0,max:100,formatValue:w=>`${w}%`,onChange:w=>a({spotlight:{...r.spotlight,x:w}})}),l.jsx(Z,{label:"Position Y",value:r.spotlight.y,min:0,max:100,formatValue:w=>`${w}%`,onChange:w=>a({spotlight:{...r.spotlight,y:w}})}),l.jsx(Z,{label:"Width",value:r.spotlight.w,min:5,max:100,formatValue:w=>`${w}%`,onChange:w=>a({spotlight:{...r.spotlight,w}})}),l.jsx(Z,{label:"Height",value:r.spotlight.h,min:5,max:100,formatValue:w=>`${w}%`,onChange:w=>a({spotlight:{...r.spotlight,h:w}})}),l.jsx(Z,{label:"Dim Opacity",value:Math.round(r.spotlight.dimOpacity*100),min:0,max:100,formatValue:w=>`${w}%`,onChange:w=>a({spotlight:{...r.spotlight,dimOpacity:w/100}})}),l.jsx(Z,{label:"Background Blur",value:r.spotlight.blur,min:0,max:30,formatValue:w=>`${w}px`,onChange:w=>a({spotlight:{...r.spotlight,blur:w}})})]})]}),l.jsxs(Fe,{title:"Annotations",tooltip:"Draw shapes over the panoramic canvas to highlight specific areas.",children:[r.annotations.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Highlight areas of your panoramic canvas with rectangles or circles."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:p,children:"+ Add Annotation"}),r.annotations.map((w,T)=>l.jsxs(Ol,{title:`Annotation ${T+1}`,onRemove:()=>h(T),children:[l.jsx(Ge,{label:"Shape",value:w.shape,onChange:_=>m(T,{shape:_}),options:[{value:"rounded-rect",label:"Rounded Rect"},{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(qe,{label:"Color",value:w.strokeColor,onChange:_=>m(T,{strokeColor:_})}),l.jsx(Z,{label:"X",value:w.x,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>m(T,{x:_})}),l.jsx(Z,{label:"Y",value:w.y,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>m(T,{y:_})}),l.jsx(Z,{label:"Width",value:w.w,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>m(T,{w:_})}),l.jsx(Z,{label:"Height",value:w.h,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>m(T,{h:_})}),l.jsx(Z,{label:"Stroke",value:w.strokeWidth,min:1,max:20,formatValue:_=>`${_}px`,onChange:_=>m(T,{strokeWidth:_})})]},w.id))]}),l.jsxs(Fe,{title:"Overlays",tooltip:"Add decorative shapes floating over the panoramic canvas.",children:[r.overlays.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Add floating shapes, star ratings, or badges over your panoramic canvas for extra visual appeal."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:$,children:"+ Add Overlay"}),r.overlays.map((w,T)=>l.jsxs(Ol,{title:`Overlay ${T+1}`,onRemove:()=>f(T),children:[l.jsx(Ge,{label:"Type",value:w.type,onChange:_=>y(T,{type:_}),options:[{value:"shape",label:"Shape"},{value:"star-rating",label:"Star Rating"},{value:"icon",label:"Icon"},{value:"badge",label:"Badge"},{value:"custom",label:"Custom"}]}),l.jsx(Z,{label:"X",value:w.x,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(T,{x:_})}),l.jsx(Z,{label:"Y",value:w.y,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(T,{y:_})}),l.jsx(Z,{label:"Size",value:w.size,min:1,max:50,formatValue:_=>`${_}%`,onChange:_=>y(T,{size:_})}),l.jsx(Z,{label:"Rotation",value:w.rotation,min:-180,max:180,formatValue:_=>`${_}°`,onChange:_=>y(T,{rotation:_})}),l.jsx(Z,{label:"Opacity",value:Math.round(w.opacity*100),min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(T,{opacity:_/100})}),w.type==="shape"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:w.shapeType??"circle",onChange:_=>y(T,{shapeType:_}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"}]}),l.jsx(qe,{label:"Color",value:w.shapeColor??"#6366f1",onChange:_=>y(T,{shapeColor:_})}),l.jsx(Z,{label:"Shape Opacity",value:Math.round((w.shapeOpacity??.5)*100),min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(T,{shapeOpacity:_/100})}),l.jsx(Z,{label:"Blur",value:w.shapeBlur??0,min:0,max:50,formatValue:_=>`${_}px`,onChange:_=>y(T,{shapeBlur:_})})]})]},w.id))]}),l.jsx("div",{className:"px-5 py-3 text-[10px] text-text-dim",children:"Loupe and Callouts are available in individual mode as they operate on specific screenshot regions."})]})}function ch(r){return{top:r.offsetTop,left:r.offsetLeft,width:r.offsetWidth,height:r.offsetHeight}}function Xi(r){let a=r.offsetLeft,i=r.offsetTop,c=r.offsetParent;for(;c;)a+=c.offsetLeft-c.scrollLeft,i+=c.offsetTop-c.scrollTop,c=c.offsetParent;return{left:a,top:i,width:r.offsetWidth,height:r.offsetHeight}}function dh(r,a,i,c,m,h,p,y){const f=C.useRef(null),$=C.useCallback((N,x)=>{var g,E,k,J;try{const ne=(g=r.current)==null?void 0:g.contentDocument;if(!ne)return null;const le=ne.elementsFromPoint(N,x);let re=null,ae=null,ue=null;for(const v of le){let U=v;for(;U&&U!==ne.documentElement;)!re&&((E=U.classList)!=null&&E.contains("headline"))&&(re=U),!ae&&((k=U.classList)!=null&&k.contains("subtitle"))&&(ae=U),!ue&&((J=U.classList)!=null&&J.contains("device-wrapper"))&&(ue=U),U=U.parentElement}if(re&&ae){const v=Xi(re),U=Xi(ae),be=v.top+v.height/2,K=U.top+U.height/2;return Math.abs(x-be)<=Math.abs(x-K)?{cls:"headline",el:re,kind:"text"}:{cls:"subtitle",el:ae,kind:"text"}}if(re)return{cls:"headline",el:re,kind:"text"};if(ae)return{cls:"subtitle",el:ae,kind:"text"};if(ue)return{cls:"device-wrapper",el:ue,kind:"device"}}catch{}return null},[r]),w=C.useCallback((N,x)=>{const g=a.current;if(!g)return{x:0,y:0};const E=g.getBoundingClientRect();return{x:(N-E.left)/c,y:(x-E.top)/c}},[a,c]),T=C.useCallback(N=>{if(!i)return;const x=w(N.clientX,N.clientY),g=$(x.x,x.y);if(g){if(N.preventDefault(),g.kind==="device"){f.current={kind:"device",el:g.el,startX:N.clientX,startY:N.clientY,startDeviceTop:i.deviceTop,startDeviceOffsetX:i.deviceOffsetX,offsetX:0,offsetY:0,origWidth:0,scale:c},g.el.style.outline="2px solid rgba(99,102,241,0.5)";const E=J=>{const ne=f.current;if(!ne||ne.kind!=="device")return;const le=(J.clientX-ne.startX)/ne.scale,re=(J.clientY-ne.startY)/ne.scale,ae=Math.max(-80,Math.min(80,ne.startDeviceOffsetX+Math.round(le/m*100))),ue=Math.max(-80,Math.min(80,ne.startDeviceTop+Math.round(re/h*100)));ne.el.style.top=ue+"%",ne.el.style.left=ae?`calc(50% + ${ae/100*m}px)`:"50%"},k=J=>{const ne=f.current;if(!ne||ne.kind!=="device")return;ne.el.style.outline="none";const le=(J.clientX-ne.startX)/ne.scale,re=(J.clientY-ne.startY)/ne.scale,ae=Math.max(-80,Math.min(80,ne.startDeviceOffsetX+Math.round(le/m*100))),ue=Math.max(-80,Math.min(80,ne.startDeviceTop+Math.round(re/h*100)));f.current=null,document.removeEventListener("mousemove",E),document.removeEventListener("mouseup",k),p({deviceTop:ue,deviceOffsetX:ae})};document.addEventListener("mousemove",E),document.addEventListener("mouseup",k)}else if(g.kind==="text"){const E=g.el,k=g.cls,J=Xi(E),ne=!!(k==="headline"?i.textPositions.headline:i.textPositions.subtitle),le=ne?J.left:J.left+J.width/2,re=J.width;if(!ne){const v=k==="headline"?i.headlineRotation:i.subtitleRotation,U=["translateX(-50%)"];v&&U.push(`rotate(${v}deg)`),E.style.position="fixed",E.style.top=J.top+"px",E.style.left=le+"px",E.style.transform=U.join(" "),E.style.zIndex="10",E.style.margin="0",E.style.width=J.width+"px"}f.current={kind:"text",cls:k,el:E,startX:N.clientX,startY:N.clientY,startDeviceTop:0,startDeviceOffsetX:0,offsetX:x.x-le,offsetY:x.y-J.top,origWidth:re,scale:c},E.style.outline="2px dashed rgba(99,102,241,0.5)";const ae=v=>{const U=f.current;if(!U||U.kind!=="text")return;const be=w(v.clientX,v.clientY);U.el.style.top=be.y-U.offsetY+"px",U.el.style.left=be.x-U.offsetX+"px"},ue=()=>{const v=f.current;if(!v||v.kind!=="text")return;v.el.style.outline="none";const U=ch(v.el),be=Math.round(U.top/h*100*10)/10,K=Math.round(U.left/m*100*10)/10,fe=Math.round(v.origWidth/m*100*10)/10;f.current=null,document.removeEventListener("mousemove",ae),document.removeEventListener("mouseup",ue),y(v.cls,{x:K,y:be,width:fe})};document.addEventListener("mousemove",ae),document.addEventListener("mouseup",ue)}}},[i,c,w,$,p,y]),_=C.useCallback((N,x)=>{const g=w(N,x),E=$(g.x,g.y);return E?E.kind==="device"?"move":"grab":"default"},[w,$]);return{onOverlayMouseDown:T,getCursorForPosition:_}}function fh(){const r=X(re=>re.screens),a=X(re=>re.selectedScreen),i=X(re=>re.setSelectedScreen),c=X(re=>re.addScreen),m=X(re=>re.removeScreen),h=X(re=>re.moveScreen),p=X(re=>re.previewW),y=X(re=>re.previewH),f=X(re=>re.previewBg),$=X(re=>re.renderVersion),w=X(re=>re.platform),T=X(re=>re.locale),_=X(re=>re.deviceFamilies),N=C.useRef(null),[x,g]=C.useState(.5),E=C.useCallback(()=>{const re=N.current;if(!re)return;const ae=48,ue=16,v=56,U=re.clientWidth-ae,be=re.clientHeight-v-ae,K=r.length+.5,fe=r.length*ue,Oe=(U-fe)/(K*p),ze=be/y;let Le=Math.min(Oe,ze);Le=Math.min(Le,1.3),Le=Math.max(Le,.1),g(Le)},[y,p,r.length]);C.useEffect(()=>(E(),window.addEventListener("resize",E),()=>window.removeEventListener("resize",E)),[E]);const k=f==="light"?"bg-gray-100":"bg-bg",[J,ne]=C.useState(null),le=J??x;return l.jsxs("div",{ref:N,className:`flex-1 flex flex-col overflow-hidden ${k}`,children:[l.jsx("div",{className:"flex-1 overflow-auto",children:l.jsxs("div",{className:"flex items-center justify-center gap-4 p-6 min-w-min min-h-full",children:[r.map((re,ae)=>l.jsx(mh,{index:ae,selected:ae===a,previewW:p,previewH:y,scale:le,headline:re.headline,canRemove:r.length>1,canMoveLeft:ae>0,canMoveRight:ae<r.length-1,onSelect:()=>i(ae),onRemove:()=>m(ae),onMoveLeft:()=>h(ae,ae-1),onMoveRight:()=>h(ae,ae+1),renderVersion:$,platform:w,locale:T,deviceFamilies:_},`screen-${re.screenIndex}-${ae}`)),l.jsx("button",{className:"shrink-0 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-text-dim text-xs hover:border-accent hover:text-accent transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",style:{width:Math.round(p*le*.5),height:Math.round(y*le)},onClick:c,"aria-label":"Add a new screen",children:"+ Add Screen"})]})}),l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 border-t border-border bg-surface",children:[l.jsx("span",{className:"text-[10px] text-text-dim",children:"Zoom"}),l.jsx("input",{type:"range",min:10,max:150,value:Math.round((J??x)*100),onChange:re=>ne(parseInt(re.target.value,10)/100),className:"flex-1 h-1 accent-accent","aria-label":"Zoom level","aria-valuemin":10,"aria-valuemax":150,"aria-valuenow":Math.round((J??x)*100),"aria-valuetext":`${Math.round((J??x)*100)}%`}),l.jsxs("span",{className:"text-[10px] text-text-dim w-8 text-right",children:[Math.round((J??x)*100),"%"]}),l.jsx("button",{className:`text-[10px] transition-opacity ${J!==null?"text-text-dim hover:text-text":"text-text-dim/50 cursor-default"}`,onClick:()=>ne(null),disabled:J===null,"aria-label":"Reset zoom to fit",children:"Fit"})]})]})}function mh({index:r,selected:a,previewW:i,previewH:c,scale:m,canRemove:h,canMoveLeft:p,canMoveRight:y,onSelect:f,onRemove:$,onMoveLeft:w,onMoveRight:T,renderVersion:_,platform:N,locale:x,deviceFamilies:g}){const E=C.useRef(null),k=C.useRef(null),{confirm:J,dialog:ne}=ua(),[le,re]=C.useState(!0),ae=C.useRef(null),ue=C.useRef(null),v=X(W=>W.screens[r]),U=X(W=>W.updateScreen);C.useEffect(()=>(Dd(r,E.current),()=>Dd(r,null)),[r]);const be=C.useCallback(W=>{U(r,W)},[r,U]),K=C.useCallback((W,M)=>{const Y={...(v==null?void 0:v.textPositions)??{headline:null,subtitle:null}};Y[W]=M,U(r,{textPositions:Y})},[r,v==null?void 0:v.textPositions,U]),{onOverlayMouseDown:fe,getCursorForPosition:Oe}=dh(E,k,v,m,i,c,be,K),[ze,Le]=C.useState("default"),O=C.useCallback(W=>{Le(Oe(W.clientX,W.clientY))},[Oe]);return C.useEffect(()=>{if(v)return ue.current&&clearTimeout(ue.current),ue.current=setTimeout(()=>{var Y;(Y=ae.current)==null||Y.abort();const W=new AbortController;ae.current=W;const M=Xp(v,N,i,c,x);hp(M,W.signal).then(V=>{const R=E.current;if(!R)return;const F=R.contentDocument;F?(F.open(),F.write(V),F.close()):R.srcdoc=V,re(!1)}).catch(V=>{V instanceof DOMException&&V.name==="AbortError"||re(!1)})},le?0:150),()=>{var W;ue.current&&clearTimeout(ue.current),(W=ae.current)==null||W.abort()}},[v,_,N,i,c,x]),l.jsxs(l.Fragment,{children:[ne,l.jsxs("div",{className:`shrink-0 cursor-pointer rounded-lg overflow-hidden transition-shadow ${a?"ring-2 ring-accent shadow-lg":"hover:ring-1 hover:ring-border"}`,onClick:f,children:[l.jsxs("div",{className:"flex items-center justify-between px-2 py-1 bg-surface text-[10px]",children:[p?l.jsx("button",{className:"text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:W=>{W.stopPropagation(),w()},title:"Move left","aria-label":`Move screen ${r+1} left`,children:"‹"}):l.jsx("span",{className:"w-4"}),l.jsxs("span",{className:"text-text-dim font-medium",children:["Screen ",r+1]}),l.jsxs("div",{className:"flex items-center gap-0.5",children:[y&&l.jsx("button",{className:"text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:W=>{W.stopPropagation(),T()},title:"Move right","aria-label":`Move screen ${r+1} right`,children:"›"}),h&&l.jsx("button",{className:"text-text-dim hover:text-red-400 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:async W=>{W.stopPropagation(),await J({title:"Remove Screen",message:`Remove Screen ${r+1}? This cannot be undone.`})&&$()},title:"Remove screen","aria-label":`Remove screen ${r+1}`,children:"×"})]})]}),l.jsxs("div",{ref:k,className:"relative overflow-hidden",style:{width:i*m,height:c*m},children:[le&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-bg z-20",children:l.jsx("div",{className:"w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),l.jsx("iframe",{ref:E,className:"border-none block origin-top-left",style:{width:i,height:c,transform:`scale(${m})`},title:`Screen ${r+1}`}),l.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:ze},onMouseDown:fe,onMouseMove:O})]})]})]})}function ph(){const r=C.useRef(null),a=C.useRef(null),i=C.useRef(null),c=C.useRef(null),m=C.useRef(null),h=X(W=>W.config),p=X(W=>W.previewW),y=X(W=>W.previewH),f=X(W=>W.previewBg),$=X(W=>W.renderVersion),w=X(W=>W.panoramicFrameCount),T=X(W=>W.panoramicBackground),_=X(W=>W.panoramicElements),N=X(W=>W.panoramicEffects),x=X(W=>W.selectedElementIndex),g=X(W=>W.setSelectedElement),E=X(W=>W.updatePanoramicElement),[k,J]=C.useState(.3),[ne,le]=C.useState(!0),[re,ae]=C.useState(!1),ue=C.useRef(null);C.useEffect(()=>(Hd(r.current),()=>Hd(null)),[]);const v=p*w,U=C.useCallback(()=>{const W=a.current;if(!W)return;const M=W.clientWidth-48,Y=W.clientHeight-120,V=M/v,R=Y/y;let F=Math.min(V,R);F=Math.min(F,1),F=Math.max(F,.05),J(F)},[v,y]);C.useEffect(()=>(U(),window.addEventListener("resize",U),()=>window.removeEventListener("resize",U)),[U]),C.useEffect(()=>{if(h)return m.current&&clearTimeout(m.current),m.current=setTimeout(()=>{var Y;(Y=c.current)==null||Y.abort();const W=new AbortController;c.current=W;const M={frameCount:w,frameWidth:p,frameHeight:y,background:T,elements:_,font:h.theme.font,fontWeight:h.theme.fontWeight,frameStyle:h.frames.style,effects:N};vp(M,W.signal).then(V=>{const R=r.current;if(!R)return;const F=R.contentDocument;F&&(F.open(),F.write(V),F.close()),le(!1)}).catch(V=>{V instanceof DOMException&&V.name==="AbortError"||(console.error("[PanoramicPreview] fetch failed:",V),le(!1))})},ne?0:200),()=>{var W;m.current&&clearTimeout(m.current),(W=c.current)==null||W.abort()}},[h,w,p,y,T,_,N,$]);const be=C.useCallback((W,M)=>{const Y=i.current;if(!Y)return null;const V=Y.getBoundingClientRect(),R=(W-V.left)/(v*k)*100,F=(M-V.top)/(y*k)*100;return{x:R,y:F}},[v,y,k]),K=C.useCallback((W,M)=>{const Y=be(W,M);if(!Y)return null;let V=null,R=-1;for(let F=0;F<_.length;F++){const ie=_[F];let H,xe;ie.type==="device"?(H=ie.width,xe=ie.width/100*v*2.1/y*100):ie.type==="text"?(H=ie.maxWidth||15,xe=ie.fontSize/100*y*2/y*100):ie.type==="decoration"?(H=ie.width,xe=ie.height?ie.height/100*y/y*100:H*v/y):(H=10,xe=5),Y.x>=ie.x&&Y.x<=ie.x+H&&Y.y>=ie.y&&Y.y<=ie.y+xe&&ie.z>R&&(R=ie.z,V=F)}return V},[_,be,v,y]),fe=C.useCallback(W=>{if(!be(W.clientX,W.clientY))return;const Y=K(W.clientX,W.clientY);if(Y!==null){g(Y);const V=_[Y];ue.current={elementIndex:Y,startX:W.clientX,startY:W.clientY,origX:V.x,origY:V.y},ae(!0),W.preventDefault()}},[be,K,_,g]);C.useEffect(()=>{const W=Y=>{const V=ue.current;if(!V)return;const R=(Y.clientX-V.startX)/k,F=(Y.clientY-V.startY)/k,ie=r.current,H=ie==null?void 0:ie.contentDocument;if(H){const we=[..._].map(($e,Ue)=>({z:$e.z,i:Ue})).sort(($e,Ue)=>$e.z-Ue.z).findIndex($e=>$e.i===V.elementIndex),Ie=H.querySelector(`[data-index="${we}"]`);if(Ie){const $e=_[V.elementIndex],Ue="rotation"in $e&&$e.rotation?$e.rotation:0;Ie.style.filter="none",Ie.style.transform=`translate(${R}px, ${F}px) rotate(${Ue}deg)`}}},M=Y=>{const V=ue.current;if(!V)return;const R=(Y.clientX-V.startX)/(v*k)*100,F=(Y.clientY-V.startY)/(y*k)*100,ie=Math.round((V.origX+R)*2)/2,H=Math.round((V.origY+F)*2)/2;E(V.elementIndex,{x:ie,y:H}),ue.current=null,ae(!1)};return window.addEventListener("mousemove",W),window.addEventListener("mouseup",M),()=>{window.removeEventListener("mousemove",W),window.removeEventListener("mouseup",M)}},[v,y,k,_,E]),C.useEffect(()=>{const W=M=>{var H;if(x===null)return;const Y=(H=M.target)==null?void 0:H.tagName;if(Y==="INPUT"||Y==="TEXTAREA"||Y==="SELECT")return;const V=M.shiftKey?5:.5;let R=0,F=0;if(M.key==="ArrowLeft")R=-V;else if(M.key==="ArrowRight")R=V;else if(M.key==="ArrowUp")F=-V;else if(M.key==="ArrowDown")F=V;else return;M.preventDefault();const ie=_[x];ie&&E(x,{x:Math.round((ie.x+R)*2)/2,y:Math.round((ie.y+F)*2)/2})};return window.addEventListener("keydown",W),()=>window.removeEventListener("keydown",W)},[x,_,E]);const[Oe,ze]=C.useState("default"),Le=C.useCallback(W=>{if(re)return;const M=K(W.clientX,W.clientY);ze(M!==null?"grab":"default")},[re,K]),O=f==="light"?"bg-gray-100":"bg-bg";return l.jsxs("div",{ref:a,className:`flex-1 flex flex-col overflow-hidden ${O}`,children:[l.jsx("div",{className:"flex-1 overflow-auto",children:l.jsx("div",{className:"flex items-center justify-center p-6 min-h-full min-w-min",children:l.jsxs("div",{className:"relative w-fit",children:[ne&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center z-20",children:l.jsx("div",{className:"w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),l.jsx("div",{className:"flex mb-1",style:{width:v*k},children:Array.from({length:w},(W,M)=>l.jsxs("div",{className:"text-[9px] text-text-dim text-center border-x border-border/30",style:{width:p*k},children:["Frame ",M+1]},M))}),l.jsxs("div",{ref:i,className:"relative overflow-hidden rounded border border-border/30",style:{width:v*k,height:y*k},children:[l.jsx("iframe",{ref:r,className:"border-none block origin-top-left",style:{width:v,height:y,transform:`scale(${k})`},title:"Panoramic Preview"}),l.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:re?"grabbing":Oe},onMouseDown:fe,onMouseMove:Le})]})]})})}),l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 border-t border-border bg-surface",children:[l.jsx("span",{className:"text-[10px] text-text-dim",children:"Zoom"}),l.jsx("input",{type:"range",min:5,max:100,value:Math.round(k*100),onChange:W=>J(parseInt(W.target.value,10)/100),className:"flex-1 h-1 accent-accent","aria-label":"Zoom level","aria-valuemin":5,"aria-valuemax":100,"aria-valuenow":Math.round(k*100),"aria-valuetext":`${Math.round(k*100)}%`}),l.jsxs("span",{className:"text-[10px] text-text-dim w-8 text-right",children:[Math.round(k*100),"%"]}),l.jsx("button",{className:"text-[10px] text-text-dim hover:text-text transition-opacity",onClick:U,"aria-label":"Reset zoom to fit",children:"Fit"}),x!==null&&l.jsx("span",{className:"ml-auto text-[9px] text-text-dim border-l border-border pl-2",title:"Use arrow keys to nudge selected element. Hold Shift for larger steps.",children:"Arrow keys to nudge"})]})]})}var Vd=sf(),hh=`svg[fill=none] {
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
}`,_h={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let r=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");r||(r=document.createElement("style"),r.id="feedback-tool-styles-annotation-popup-css-styles",r.textContent=hh,document.head.appendChild(r))}var et=_h,gh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",children:l.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),yh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",children:l.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),xh=({size:r=24,style:a={}})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",style:a,children:[l.jsxs("g",{clipPath:"url(#clip0_list_sparkle)",children:[l.jsx("path",{d:"M11.5 12L5.5 12",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M18.5 6.75L5.5 6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M9.25 17.25L5.5 17.25",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})]}),l.jsx("defs",{children:l.jsx("clipPath",{id:"clip0_list_sparkle",children:l.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),Ar=({size:r=20})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:[l.jsx("circle",{cx:"10",cy:"10.5",r:"5.25",stroke:"currentColor",strokeWidth:"1.25"}),l.jsx("path",{d:"M8.5 8.75C8.5 7.92 9.17 7.25 10 7.25C10.83 7.25 11.5 7.92 11.5 8.75C11.5 9.58 10.83 10.25 10 10.25V11",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("circle",{cx:"10",cy:"13",r:"0.75",fill:"currentColor"})]}),Xd=({size:r=14})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 14 14",fill:"none",children:[l.jsx("style",{children:`
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
    `}),l.jsx("path",{className:"check-path-animated",d:"M3.9375 7L6.125 9.1875L10.5 4.8125",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),vh=({size:r=24,copied:a=!1})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .copy-icon, .check-icon {
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
    `}),l.jsxs("g",{className:"copy-icon",style:{opacity:a?0:1,transform:a?"scale(0.8)":"scale(1)",transformOrigin:"center"},children:[l.jsx("path",{d:"M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",stroke:"currentColor",strokeWidth:"1.5"}),l.jsx("path",{d:"M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),l.jsxs("g",{className:"check-icon",style:{opacity:a?1:0,transform:a?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})]}),bh=({size:r=24,state:a="idle"})=>{const i=a==="idle",c=a==="sent",m=a==="failed",h=a==="sending";return l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
        .send-arrow-icon, .send-check-icon, .send-error-icon {
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
      `}),l.jsx("g",{className:"send-arrow-icon",style:{opacity:i?1:h?.5:0,transform:i?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:l.jsx("path",{d:"M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),l.jsxs("g",{className:"send-check-icon",style:{opacity:c?1:0,transform:c?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsxs("g",{className:"send-error-icon",style:{opacity:m?1:0,transform:m?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M12 8V12",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round"}),l.jsx("circle",{cx:"12",cy:"15",r:"0.5",fill:"#ef4444",stroke:"#ef4444",strokeWidth:"1"})]})]})},wh=({size:r=24,isOpen:a=!0})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .eye-open, .eye-closed {
        transition: opacity 0.2s ease;
      }
    `}),l.jsxs("g",{className:"eye-open",style:{opacity:a?1:0},children:[l.jsx("path",{d:"M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsxs("g",{className:"eye-closed",style:{opacity:a?0:1},children:[l.jsx("path",{d:"M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",fill:"currentColor"}),l.jsx("path",{d:"M5 19L19 5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})]}),kh=({size:r=24,isPaused:a=!1})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .pause-bar, .play-triangle {
        transition: opacity 0.15s ease;
      }
    `}),l.jsx("path",{className:"pause-bar",d:"M8 6L8 18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:a?0:1}}),l.jsx("path",{className:"pause-bar",d:"M16 18L16 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:a?0:1}}),l.jsx("path",{className:"play-triangle",d:"M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",stroke:"currentColor",strokeWidth:"1.5",style:{opacity:a?1:0}})]}),Ch=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("path",{d:"M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("circle",{cx:"12",cy:"12",r:"2.5",stroke:"currentColor",strokeWidth:"1.5"})]}),Sh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:l.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Qi=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsxs("g",{clipPath:"url(#clip0_2_53)",children:[l.jsx("path",{d:"M16.25 16.25L7.75 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M7.75 16.25L16.25 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsx("defs",{children:l.jsx("clipPath",{id:"clip0_2_53",children:l.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),jh=({size:r=24})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:l.jsx("path",{d:"M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z",fill:"currentColor"})}),Eh=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:[l.jsx("path",{d:"M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M10 3.9585V5.05698",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M10 14.9429V16.0414",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M5.7269 5.72656L6.50682 6.50649",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M13.4932 13.4932L14.2731 14.2731",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M3.95834 10H5.05683",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M14.9432 10H16.0417",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M5.7269 14.2731L6.50682 13.4932",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M13.4932 6.50649L14.2731 5.72656",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"})]}),Nh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:l.jsx("path",{d:"M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z",stroke:"currentColor",strokeWidth:"1.13793",strokeLinecap:"round",strokeLinejoin:"round"})}),Qd=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375",stroke:"currentColor",strokeWidth:"0.9",strokeLinecap:"round",strokeLinejoin:"round"})}),Ph=({size:r=24})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Th=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M8.5 3.5L4 8L8.5 12.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),yf=["data-feedback-toolbar","data-annotation-popup","data-annotation-marker"],Gi=yf.flatMap(r=>[`:not([${r}])`,`:not([${r}] *)`]).join(""),ru="feedback-freeze-styles",Ki="__agentation_freeze";function Lh(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:a=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const r=window;return r[Ki]||(r[Ki]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),r[Ki]}var Ye=Lh();typeof window<"u"&&!Ye.installed&&(Ye.origSetTimeout=window.setTimeout.bind(window),Ye.origSetInterval=window.setInterval.bind(window),Ye.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(r,a,...i)=>typeof r=="string"?Ye.origSetTimeout(r,a):Ye.origSetTimeout((...c)=>{Ye.frozen?Ye.frozenTimeoutQueue.push(()=>r(...c)):r(...c)},a,...i),window.setInterval=(r,a,...i)=>typeof r=="string"?Ye.origSetInterval(r,a):Ye.origSetInterval((...c)=>{Ye.frozen||r(...c)},a,...i),window.requestAnimationFrame=r=>Ye.origRAF(a=>{Ye.frozen?Ye.frozenRAFQueue.push(r):r(a)}),Ye.installed=!0);var Ve=Ye.origSetTimeout,Rh=Ye.origSetInterval;function Ih(r){return r?yf.some(a=>{var i;return!!((i=r.closest)!=null&&i.call(r,`[${a}]`))}):!1}function $h(){if(typeof document>"u"||Ye.frozen)return;Ye.frozen=!0,Ye.frozenTimeoutQueue=[],Ye.frozenRAFQueue=[];let r=document.getElementById(ru);r||(r=document.createElement("style"),r.id=ru),r.textContent=`
    *${Gi},
    *${Gi}::before,
    *${Gi}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `,document.head.appendChild(r),Ye.pausedAnimations=[];try{document.getAnimations().forEach(a=>{var c;if(a.playState!=="running")return;const i=(c=a.effect)==null?void 0:c.target;Ih(i)||(a.pause(),Ye.pausedAnimations.push(a))})}catch{}document.querySelectorAll("video").forEach(a=>{a.paused||(a.dataset.wasPaused="false",a.pause())})}function Gd(){var i;if(typeof document>"u"||!Ye.frozen)return;Ye.frozen=!1;const r=Ye.frozenTimeoutQueue;Ye.frozenTimeoutQueue=[];for(const c of r)Ye.origSetTimeout(()=>{if(Ye.frozen){Ye.frozenTimeoutQueue.push(c);return}try{c()}catch(m){console.warn("[agentation] Error replaying queued timeout:",m)}},0);const a=Ye.frozenRAFQueue;Ye.frozenRAFQueue=[];for(const c of a)Ye.origRAF(m=>{if(Ye.frozen){Ye.frozenRAFQueue.push(c);return}c(m)});for(const c of Ye.pausedAnimations)try{c.play()}catch(m){console.warn("[agentation] Error resuming animation:",m)}Ye.pausedAnimations=[],(i=document.getElementById(ru))==null||i.remove(),document.querySelectorAll("video").forEach(c=>{c.dataset.wasPaused==="false"&&(c.play().catch(()=>{}),delete c.dataset.wasPaused)})}var Kd=C.forwardRef(function({element:a,timestamp:i,selectedText:c,placeholder:m="What should change?",initialValue:h="",submitLabel:p="Add",onSubmit:y,onCancel:f,onDelete:$,style:w,accentColor:T="#3c82f7",isExiting:_=!1,lightMode:N=!1,computedStyles:x},g){const[E,k]=C.useState(h),[J,ne]=C.useState(!1),[le,re]=C.useState("initial"),[ae,ue]=C.useState(!1),[v,U]=C.useState(!1),be=C.useRef(null),K=C.useRef(null),fe=C.useRef(null),Oe=C.useRef(null);C.useEffect(()=>{_&&le!=="exit"&&re("exit")},[_,le]),C.useEffect(()=>{Ve(()=>{re("enter")},0);const Y=Ve(()=>{re("entered")},200),V=Ve(()=>{const R=be.current;R&&(R.focus(),R.selectionStart=R.selectionEnd=R.value.length,R.scrollTop=R.scrollHeight)},50);return()=>{clearTimeout(Y),clearTimeout(V),fe.current&&clearTimeout(fe.current),Oe.current&&clearTimeout(Oe.current)}},[]);const ze=C.useCallback(()=>{Oe.current&&clearTimeout(Oe.current),ne(!0),Oe.current=Ve(()=>{var Y;ne(!1),(Y=be.current)==null||Y.focus()},250)},[]);C.useImperativeHandle(g,()=>({shake:ze}),[ze]);const Le=C.useCallback(()=>{re("exit"),fe.current=Ve(()=>{f()},150)},[f]),O=C.useCallback(()=>{E.trim()&&y(E.trim())},[E,y]),W=C.useCallback(Y=>{Y.stopPropagation(),!Y.nativeEvent.isComposing&&(Y.key==="Enter"&&!Y.shiftKey&&(Y.preventDefault(),O()),Y.key==="Escape"&&Le())},[O,Le]),M=[et.popup,N?et.light:"",le==="enter"?et.enter:"",le==="entered"?et.entered:"",le==="exit"?et.exit:"",J?et.shake:""].filter(Boolean).join(" ");return l.jsxs("div",{ref:K,className:M,"data-annotation-popup":!0,style:w,onClick:Y=>Y.stopPropagation(),children:[l.jsxs("div",{className:et.header,children:[x&&Object.keys(x).length>0?l.jsxs("button",{className:et.headerToggle,onClick:()=>{const Y=v;U(!v),Y&&Ve(()=>{var V;return(V=be.current)==null?void 0:V.focus()},0)},type:"button",children:[l.jsx("svg",{className:`${et.chevron} ${v?et.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),l.jsx("span",{className:et.element,children:a})]}):l.jsx("span",{className:et.element,children:a}),i&&l.jsx("span",{className:et.timestamp,children:i})]}),x&&Object.keys(x).length>0&&l.jsx("div",{className:`${et.stylesWrapper} ${v?et.expanded:""}`,children:l.jsx("div",{className:et.stylesInner,children:l.jsx("div",{className:et.stylesBlock,children:Object.entries(x).map(([Y,V])=>l.jsxs("div",{className:et.styleLine,children:[l.jsx("span",{className:et.styleProperty,children:Y.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",l.jsx("span",{className:et.styleValue,children:V}),";"]},Y))})})}),c&&l.jsxs("div",{className:et.quote,children:["“",c.slice(0,80),c.length>80?"...":"","”"]}),l.jsx("textarea",{ref:be,className:et.textarea,style:{borderColor:ae?T:void 0},placeholder:m,value:E,onChange:Y=>k(Y.target.value),onFocus:()=>ue(!0),onBlur:()=>ue(!1),rows:2,onKeyDown:W}),l.jsxs("div",{className:et.actions,children:[$&&l.jsx("div",{className:et.deleteWrapper,children:l.jsx("button",{className:et.deleteButton,onClick:$,type:"button",children:l.jsx(Ph,{size:22})})}),l.jsx("button",{className:et.cancel,onClick:Le,children:"Cancel"}),l.jsx("button",{className:et.submit,style:{backgroundColor:T,opacity:E.trim()?1:.4},onClick:O,disabled:!E.trim(),children:p})]})]})});function Hr(r){if(r.parentElement)return r.parentElement;const a=r.getRootNode();return a instanceof ShadowRoot?a.host:null}function Jt(r,a){let i=r;for(;i;){if(i.matches(a))return i;i=Hr(i)}return null}function Mh(r,a=4){const i=[];let c=r,m=0;for(;c&&m<a;){const h=c.tagName.toLowerCase();if(h==="html"||h==="body")break;let p=h;if(c.id)p=`#${c.id}`;else if(c.className&&typeof c.className=="string"){const f=c.className.split(/\s+/).find($=>$.length>2&&!$.match(/^[a-z]{1,2}$/)&&!$.match(/[A-Z0-9]{5,}/));f&&(p=`.${f.split("_")[0]}`)}const y=Hr(c);!c.parentElement&&y&&(p=`⟨shadow⟩ ${p}`),i.unshift(p),c=y,m++}return i.join(" > ")}function la(r){var c,m,h,p,y,f,$,w;const a=Mh(r);if(r.dataset.element)return{name:r.dataset.element,path:a};const i=r.tagName.toLowerCase();if(["path","circle","rect","line","g"].includes(i)){const T=Jt(r,"svg");if(T){const _=Hr(T);if(_ instanceof HTMLElement)return{name:`graphic in ${la(_).name}`,path:a}}return{name:"graphic element",path:a}}if(i==="svg"){const T=Hr(r);if((T==null?void 0:T.tagName.toLowerCase())==="button"){const _=(c=T.textContent)==null?void 0:c.trim();return{name:_?`icon in "${_}" button`:"button icon",path:a}}return{name:"icon",path:a}}if(i==="button"){const T=(m=r.textContent)==null?void 0:m.trim(),_=r.getAttribute("aria-label");return _?{name:`button [${_}]`,path:a}:{name:T?`button "${T.slice(0,25)}"`:"button",path:a}}if(i==="a"){const T=(h=r.textContent)==null?void 0:h.trim(),_=r.getAttribute("href");return T?{name:`link "${T.slice(0,25)}"`,path:a}:_?{name:`link to ${_.slice(0,30)}`,path:a}:{name:"link",path:a}}if(i==="input"){const T=r.getAttribute("type")||"text",_=r.getAttribute("placeholder"),N=r.getAttribute("name");return _?{name:`input "${_}"`,path:a}:N?{name:`input [${N}]`,path:a}:{name:`${T} input`,path:a}}if(["h1","h2","h3","h4","h5","h6"].includes(i)){const T=(p=r.textContent)==null?void 0:p.trim();return{name:T?`${i} "${T.slice(0,35)}"`:i,path:a}}if(i==="p"){const T=(y=r.textContent)==null?void 0:y.trim();return T?{name:`paragraph: "${T.slice(0,40)}${T.length>40?"...":""}"`,path:a}:{name:"paragraph",path:a}}if(i==="span"||i==="label"){const T=(f=r.textContent)==null?void 0:f.trim();return T&&T.length<40?{name:`"${T}"`,path:a}:{name:i,path:a}}if(i==="li"){const T=($=r.textContent)==null?void 0:$.trim();return T&&T.length<40?{name:`list item: "${T.slice(0,35)}"`,path:a}:{name:"list item",path:a}}if(i==="blockquote")return{name:"blockquote",path:a};if(i==="code"){const T=(w=r.textContent)==null?void 0:w.trim();return T&&T.length<30?{name:`code: \`${T}\``,path:a}:{name:"code",path:a}}if(i==="pre")return{name:"code block",path:a};if(i==="img"){const T=r.getAttribute("alt");return{name:T?`image "${T.slice(0,30)}"`:"image",path:a}}if(i==="video")return{name:"video",path:a};if(["div","section","article","nav","header","footer","aside","main"].includes(i)){const T=r.className,_=r.getAttribute("role"),N=r.getAttribute("aria-label");if(N)return{name:`${i} [${N}]`,path:a};if(_)return{name:`${_}`,path:a};if(typeof T=="string"&&T){const x=T.split(/[\s_-]+/).map(g=>g.replace(/[A-Z0-9]{5,}.*$/,"")).filter(g=>g.length>2&&!/^[a-z]{1,2}$/.test(g)).slice(0,2);if(x.length>0)return{name:x.join(" "),path:a}}return{name:i==="div"?"container":i,path:a}}return{name:i,path:a}}function Tl(r){var h,p,y;const a=[],i=(h=r.textContent)==null?void 0:h.trim();i&&i.length<100&&a.push(i);const c=r.previousElementSibling;if(c){const f=(p=c.textContent)==null?void 0:p.trim();f&&f.length<50&&a.unshift(`[before: "${f.slice(0,40)}"]`)}const m=r.nextElementSibling;if(m){const f=(y=m.textContent)==null?void 0:y.trim();f&&f.length<50&&a.push(`[after: "${f.slice(0,40)}"]`)}return a.join(" ")}function Qs(r){const a=Hr(r);if(!a)return"";const m=(r.getRootNode()instanceof ShadowRoot&&r.parentElement?Array.from(r.parentElement.children):Array.from(a.children)).filter(w=>w!==r&&w instanceof HTMLElement);if(m.length===0)return"";const h=m.slice(0,4).map(w=>{var x;const T=w.tagName.toLowerCase(),_=w.className;let N="";if(typeof _=="string"&&_){const g=_.split(/\s+/).map(E=>E.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(E=>E.length>2&&!/^[a-z]{1,2}$/.test(E));g&&(N=`.${g}`)}if(T==="button"||T==="a"){const g=(x=w.textContent)==null?void 0:x.trim().slice(0,15);if(g)return`${T}${N} "${g}"`}return`${T}${N}`});let y=a.tagName.toLowerCase();if(typeof a.className=="string"&&a.className){const w=a.className.split(/\s+/).map(T=>T.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(T=>T.length>2&&!/^[a-z]{1,2}$/.test(T));w&&(y=`.${w}`)}const f=a.children.length,$=f>h.length+1?` (${f} total in ${y})`:"";return h.join(", ")+$}function Ll(r){const a=r.className;return typeof a!="string"||!a?"":a.split(/\s+/).filter(c=>c.length>0).map(c=>{const m=c.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);return m?m[1]:c}).filter((c,m,h)=>h.indexOf(c)===m).join(", ")}var xf=new Set(["none","normal","auto","0px","rgba(0, 0, 0, 0)","transparent","static","visible"]),zh=new Set(["p","span","h1","h2","h3","h4","h5","h6","label","li","td","th","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","a","time","cite","q"]),Oh=new Set(["input","textarea","select"]),Dh=new Set(["img","video","canvas","svg"]),Fh=new Set(["div","section","article","nav","header","footer","aside","main","ul","ol","form","fieldset"]);function Gs(r){if(typeof window>"u")return{};const a=window.getComputedStyle(r),i={},c=r.tagName.toLowerCase();let m;zh.has(c)?m=["color","fontSize","fontWeight","fontFamily","lineHeight"]:c==="button"||c==="a"&&r.getAttribute("role")==="button"?m=["backgroundColor","color","padding","borderRadius","fontSize"]:Oh.has(c)?m=["backgroundColor","color","padding","borderRadius","fontSize"]:Dh.has(c)?m=["width","height","objectFit","borderRadius"]:Fh.has(c)?m=["display","padding","margin","gap","backgroundColor"]:m=["color","fontSize","margin","padding","backgroundColor"];for(const h of m){const p=h.replace(/([A-Z])/g,"-$1").toLowerCase(),y=a.getPropertyValue(p);y&&!xf.has(y)&&(i[h]=y)}return i}var Ah=["color","backgroundColor","borderColor","fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","textAlign","width","height","padding","margin","border","borderRadius","display","position","top","right","bottom","left","zIndex","flexDirection","justifyContent","alignItems","gap","opacity","visibility","overflow","boxShadow","transform"];function Ks(r){if(typeof window>"u")return"";const a=window.getComputedStyle(r),i=[];for(const c of Ah){const m=c.replace(/([A-Z])/g,"-$1").toLowerCase(),h=a.getPropertyValue(m);h&&!xf.has(h)&&i.push(`${m}: ${h}`)}return i.join("; ")}function Bh(r){if(!r)return;const a={},i=r.split(";").map(c=>c.trim()).filter(Boolean);for(const c of i){const m=c.indexOf(":");if(m>0){const h=c.slice(0,m).trim(),p=c.slice(m+1).trim();h&&p&&(a[h]=p)}}return Object.keys(a).length>0?a:void 0}function Zs(r){const a=[],i=r.getAttribute("role"),c=r.getAttribute("aria-label"),m=r.getAttribute("aria-describedby"),h=r.getAttribute("tabindex"),p=r.getAttribute("aria-hidden");return i&&a.push(`role="${i}"`),c&&a.push(`aria-label="${c}"`),m&&a.push(`aria-describedby="${m}"`),h&&a.push(`tabindex=${h}`),p==="true"&&a.push("aria-hidden"),r.matches("a, button, input, select, textarea, [tabindex]")&&a.push("focusable"),a.join(", ")}function Js(r){const a=[];let i=r;for(;i&&i.tagName.toLowerCase()!=="html";){const c=i.tagName.toLowerCase();let m=c;if(i.id)m=`${c}#${i.id}`;else if(i.className&&typeof i.className=="string"){const p=i.className.split(/\s+/).map(y=>y.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(y=>y.length>2);p&&(m=`${c}.${p}`)}const h=Hr(i);!i.parentElement&&h&&(m=`⟨shadow⟩ ${m}`),a.unshift(m),i=h}return a.join(" > ")}var lu="feedback-annotations-",vf=7;function sa(r){return`${lu}${r}`}function Zi(r){if(typeof window>"u")return[];try{const a=localStorage.getItem(sa(r));if(!a)return[];const i=JSON.parse(a),c=Date.now()-vf*24*60*60*1e3;return i.filter(m=>!m.timestamp||m.timestamp>c)}catch{return[]}}function bf(r,a){if(!(typeof window>"u"))try{localStorage.setItem(sa(r),JSON.stringify(a))}catch{}}function Wh(){const r=new Map;if(typeof window>"u")return r;try{const a=Date.now()-vf*24*60*60*1e3;for(let i=0;i<localStorage.length;i++){const c=localStorage.key(i);if(c!=null&&c.startsWith(lu)){const m=c.slice(lu.length),h=localStorage.getItem(c);if(h){const y=JSON.parse(h).filter(f=>!f.timestamp||f.timestamp>a);y.length>0&&r.set(m,y)}}}}catch{}return r}function Rl(r,a,i){const c=a.map(m=>({...m,_syncedTo:i}));bf(r,c)}var wf="agentation-session-";function cu(r){return`${wf}${r}`}function Yh(r){if(typeof window>"u")return null;try{return localStorage.getItem(cu(r))}catch{return null}}function Ji(r,a){if(!(typeof window>"u"))try{localStorage.setItem(cu(r),a)}catch{}}function Hh(r){if(!(typeof window>"u"))try{localStorage.removeItem(cu(r))}catch{}}var kf=`${wf}toolbar-hidden`;function Uh(){if(typeof window>"u")return!1;try{return sessionStorage.getItem(kf)==="1"}catch{return!1}}function Vh(r){if(!(typeof window>"u"))try{r&&sessionStorage.setItem(kf,"1")}catch{}}async function qi(r,a){const i=await fetch(`${r}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:a})});if(!i.ok)throw new Error(`Failed to create session: ${i.status}`);return i.json()}async function Zd(r,a){const i=await fetch(`${r}/sessions/${a}`);if(!i.ok)throw new Error(`Failed to get session: ${i.status}`);return i.json()}async function qs(r,a,i){const c=await fetch(`${r}/sessions/${a}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!c.ok)throw new Error(`Failed to sync annotation: ${c.status}`);return c.json()}async function Xh(r,a,i){const c=await fetch(`${r}/annotations/${a}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!c.ok)throw new Error(`Failed to update annotation: ${c.status}`);return c.json()}async function Jd(r,a){const i=await fetch(`${r}/annotations/${a}`,{method:"DELETE"});if(!i.ok)throw new Error(`Failed to delete annotation: ${i.status}`)}var Ke={FunctionComponent:0,ClassComponent:1,IndeterminateComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,Fragment:7,Mode:8,ContextConsumer:9,ContextProvider:10,ForwardRef:11,Profiler:12,SuspenseComponent:13,MemoComponent:14,SimpleMemoComponent:15,LazyComponent:16,IncompleteClassComponent:17,DehydratedFragment:18,SuspenseListComponent:19,ScopeComponent:21,OffscreenComponent:22,LegacyHiddenComponent:23,CacheComponent:24,TracingMarkerComponent:25,HostHoistable:26,HostSingleton:27,IncompleteFunctionComponent:28,Throw:29,ViewTransitionComponent:30,ActivityComponent:31},qd=new Set(["Component","PureComponent","Fragment","Suspense","Profiler","StrictMode","Routes","Route","Outlet","Root","ErrorBoundaryHandler","HotReload","Hot"]),ef=[/Boundary$/,/BoundaryHandler$/,/Provider$/,/Consumer$/,/^(Inner|Outer)/,/Router$/,/^Client(Page|Segment|Root)/,/^Server(Root|Component|Render)/,/^RSC/,/Context$/,/^Hot(Reload)?$/,/^(Dev|React)(Overlay|Tools|Root)/,/Overlay$/,/Handler$/,/^With[A-Z]/,/Wrapper$/,/^Root$/],Qh=[/Page$/,/View$/,/Screen$/,/Section$/,/Card$/,/List$/,/Item$/,/Form$/,/Modal$/,/Dialog$/,/Button$/,/Nav$/,/Header$/,/Footer$/,/Layout$/,/Panel$/,/Tab$/,/Menu$/];function Gh(r){const a=(r==null?void 0:r.mode)??"filtered";let i=qd;if(r!=null&&r.skipExact){const c=r.skipExact instanceof Set?r.skipExact:new Set(r.skipExact);i=new Set([...qd,...c])}return{maxComponents:(r==null?void 0:r.maxComponents)??6,maxDepth:(r==null?void 0:r.maxDepth)??30,mode:a,skipExact:i,skipPatterns:r!=null&&r.skipPatterns?[...ef,...r.skipPatterns]:ef,userPatterns:(r==null?void 0:r.userPatterns)??Qh,filter:r==null?void 0:r.filter}}function Kh(r){return r.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/([A-Z])([A-Z][a-z])/g,"$1-$2").toLowerCase()}function Zh(r,a=10){const i=new Set;let c=r,m=0;for(;c&&m<a;)c.className&&typeof c.className=="string"&&c.className.split(/\s+/).forEach(h=>{if(h.length>1){const p=h.replace(/[_][a-zA-Z0-9]{5,}.*$/,"").toLowerCase();p.length>1&&i.add(p)}}),c=c.parentElement,m++;return i}function Jh(r,a){const i=Kh(r);for(const c of a){if(c===i)return!0;const m=i.split("-").filter(p=>p.length>2),h=c.split("-").filter(p=>p.length>2);for(const p of m)for(const y of h)if(p===y||p.includes(y)||y.includes(p))return!0}return!1}function qh(r,a,i,c){if(i.filter)return i.filter(r,a);switch(i.mode){case"all":return!0;case"filtered":return!(i.skipExact.has(r)||i.skipPatterns.some(m=>m.test(r)));case"smart":return i.skipExact.has(r)||i.skipPatterns.some(m=>m.test(r))?!1:!!(c&&Jh(r,c)||i.userPatterns.some(m=>m.test(r)));default:return!0}}var Br=null,e_=new WeakMap;function eu(r){return Object.keys(r).some(a=>a.startsWith("__reactFiber$")||a.startsWith("__reactInternalInstance$")||a.startsWith("__reactProps$"))}function t_(){if(Br!==null)return Br;if(typeof document>"u")return!1;if(document.body&&eu(document.body))return Br=!0,!0;const r=["#root","#app","#__next","[data-reactroot]"];for(const a of r){const i=document.querySelector(a);if(i&&eu(i))return Br=!0,!0}if(document.body){for(const a of document.body.children)if(eu(a))return Br=!0,!0}return Br=!1,!1}var Il={map:e_};function n_(r){return Object.keys(r).find(i=>i.startsWith("__reactFiber$")||i.startsWith("__reactInternalInstance$"))||null}function o_(r){const a=n_(r);return a?r[a]:null}function er(r){return r?r.displayName?r.displayName:r.name?r.name:null:null}function r_(r){var m;const{tag:a,type:i,elementType:c}=r;if(a===Ke.HostComponent||a===Ke.HostText||a===Ke.HostHoistable||a===Ke.HostSingleton||a===Ke.Fragment||a===Ke.Mode||a===Ke.Profiler||a===Ke.DehydratedFragment||a===Ke.HostRoot||a===Ke.HostPortal||a===Ke.ScopeComponent||a===Ke.OffscreenComponent||a===Ke.LegacyHiddenComponent||a===Ke.CacheComponent||a===Ke.TracingMarkerComponent||a===Ke.Throw||a===Ke.ViewTransitionComponent||a===Ke.ActivityComponent)return null;if(a===Ke.ForwardRef){const h=c;if(h!=null&&h.render){const p=er(h.render);if(p)return p}return h!=null&&h.displayName?h.displayName:er(i)}if(a===Ke.MemoComponent||a===Ke.SimpleMemoComponent){const h=c;if(h!=null&&h.type){const p=er(h.type);if(p)return p}return h!=null&&h.displayName?h.displayName:er(i)}if(a===Ke.ContextProvider){const h=i;return(m=h==null?void 0:h._context)!=null&&m.displayName?`${h._context.displayName}.Provider`:null}if(a===Ke.ContextConsumer){const h=i;return h!=null&&h.displayName?`${h.displayName}.Consumer`:null}if(a===Ke.LazyComponent){const h=c;return(h==null?void 0:h._status)===1&&h._result?er(h._result):null}return a===Ke.SuspenseComponent||a===Ke.SuspenseListComponent?null:a===Ke.IncompleteClassComponent||a===Ke.IncompleteFunctionComponent||a===Ke.FunctionComponent||a===Ke.ClassComponent||a===Ke.IndeterminateComponent?er(i):null}function l_(r){return r.length<=2||r.length<=3&&r===r.toLowerCase()}function s_(r,a){const i=Gh(a),c=i.mode==="all";if(c){const f=Il.map.get(r);if(f!==void 0)return f}if(!t_()){const f={path:null,components:[]};return c&&Il.map.set(r,f),f}const m=i.mode==="smart"?Zh(r):void 0,h=[];try{let f=o_(r),$=0;for(;f&&$<i.maxDepth&&h.length<i.maxComponents;){const w=r_(f);w&&!l_(w)&&qh(w,$,i,m)&&h.push(w),f=f.return,$++}}catch{const f={path:null,components:[]};return c&&Il.map.set(r,f),f}if(h.length===0){const f={path:null,components:[]};return c&&Il.map.set(r,f),f}const y={path:h.slice().reverse().map(f=>`<${f}>`).join(" "),components:h};return c&&Il.map.set(r,y),y}var $l={FunctionComponent:0,IndeterminateComponent:2,ForwardRef:11,MemoComponent:14,SimpleMemoComponent:15};function a_(r){if(!r||typeof r!="object")return null;const a=Object.keys(r),i=a.find(h=>h.startsWith("__reactFiber$"));if(i)return r[i]||null;const c=a.find(h=>h.startsWith("__reactInternalInstance$"));if(c)return r[c]||null;const m=a.find(h=>{if(!h.startsWith("__react"))return!1;const p=r[h];return p&&typeof p=="object"&&"_debugSource"in p});return m&&r[m]||null}function Dl(r){if(!r.type||typeof r.type=="string")return null;if(typeof r.type=="object"||typeof r.type=="function"){const a=r.type;if(a.displayName)return a.displayName;if(a.name)return a.name}return null}function i_(r,a=50){var m;let i=r,c=0;for(;i&&c<a;){if(i._debugSource)return{source:i._debugSource,componentName:Dl(i)};if((m=i._debugOwner)!=null&&m._debugSource)return{source:i._debugOwner._debugSource,componentName:Dl(i._debugOwner)};i=i.return,c++}return null}function u_(r){let a=r,i=0;const c=50;for(;a&&i<c;){const m=a,h=["_debugSource","__source","_source","debugSource"];for(const p of h){const y=m[p];if(y&&typeof y=="object"&&"fileName"in y)return{source:y,componentName:Dl(a)}}if(a.memoizedProps){const p=a.memoizedProps;if(p.__source&&typeof p.__source=="object"){const y=p.__source;if(y.fileName&&y.lineNumber)return{source:{fileName:y.fileName,lineNumber:y.lineNumber,columnNumber:y.columnNumber},componentName:Dl(a)}}}a=a.return,i++}return null}var ea=new Map;function c_(r){var m;const a=r.tag,i=r.type,c=r.elementType;if(typeof i=="string"||i==null||typeof i=="function"&&((m=i.prototype)!=null&&m.isReactComponent))return null;if((a===$l.FunctionComponent||a===$l.IndeterminateComponent)&&typeof i=="function")return i;if(a===$l.ForwardRef&&c){const h=c.render;if(typeof h=="function")return h}if((a===$l.MemoComponent||a===$l.SimpleMemoComponent)&&c){const h=c.type;if(typeof h=="function")return h}return typeof i=="function"?i:null}function d_(){const r=lf,a=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;if(a&&"H"in a)return{get:()=>a.H,set:c=>{a.H=c}};const i=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;if(i){const c=i.ReactCurrentDispatcher;if(c&&"current"in c)return{get:()=>c.current,set:m=>{c.current=m}}}return null}function f_(r){const a=r.split(`
`),i=[/source-location/,/\/dist\/index\./,/node_modules\//,/react-dom/,/react\.development/,/react\.production/,/chunk-[A-Z0-9]+/i,/react-stack-bottom-frame/,/react-reconciler/,/scheduler/,/<anonymous>/],c=/^\s*at\s+(?:.*?\s+\()?(.+?):(\d+):(\d+)\)?$/,m=/^[^@]*@(.+?):(\d+):(\d+)$/;for(const h of a){const p=h.trim();if(!p||i.some(f=>f.test(p)))continue;const y=c.exec(p)||m.exec(p);if(y)return{fileName:y[1],line:parseInt(y[2],10),column:parseInt(y[3],10)}}return null}function m_(r){let a=r;return a=a.replace(/[?#].*$/,""),a=a.replace(/^turbopack:\/\/\/\[project\]\//,""),a=a.replace(/^webpack-internal:\/\/\/\.\//,""),a=a.replace(/^webpack-internal:\/\/\//,""),a=a.replace(/^webpack:\/\/\/\.\//,""),a=a.replace(/^webpack:\/\/\//,""),a=a.replace(/^turbopack:\/\/\//,""),a=a.replace(/^https?:\/\/[^/]+\//,""),a=a.replace(/^file:\/\/\//,"/"),a=a.replace(/^\([^)]+\)\/\.\//,""),a=a.replace(/^\.\//,""),a}function p_(r){const a=c_(r);if(!a)return null;if(ea.has(a))return ea.get(a);const i=d_();if(!i)return ea.set(a,null),null;const c=i.get();let m=null;try{const h=new Proxy({},{get(){throw new Error("probe")}});i.set(h);try{a({})}catch(p){if(p instanceof Error&&p.message==="probe"&&p.stack){const y=f_(p.stack);y&&(m={fileName:m_(y.fileName),lineNumber:y.line,columnNumber:y.column,componentName:Dl(r)||void 0})}}}finally{i.set(c)}return ea.set(a,m),m}function h_(r,a=15){let i=r,c=0;for(;i&&c<a;){const m=p_(i);if(m)return m;i=i.return,c++}return null}function su(r){const a=a_(r);if(!a)return{found:!1,reason:"no-fiber",isReactApp:!1,isProduction:!1};let i=i_(a);if(i||(i=u_(a)),i!=null&&i.source)return{found:!0,source:{fileName:i.source.fileName,lineNumber:i.source.lineNumber,columnNumber:i.source.columnNumber,componentName:i.componentName||void 0},isReactApp:!0,isProduction:!1};const c=h_(a);return c?{found:!0,source:c,isReactApp:!0,isProduction:!1}:{found:!1,reason:"no-debug-source",isReactApp:!0,isProduction:!1}}function __(r,a="path"){const{fileName:i,lineNumber:c,columnNumber:m}=r;let h=`${i}:${c}`;return m!==void 0&&(h+=`:${m}`),a==="vscode"?`vscode://file${i.startsWith("/")?"":"/"}${h}`:h}function g_(r,a=10){let i=r,c=0;for(;i&&c<a;){const m=su(i);if(m.found)return m;i=i.parentElement,c++}return su(r)}var y_=`svg[fill=none] {
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
}`,x_={toolbar:"styles-module__toolbar___wNsdK",toolbarContainer:"styles-module__toolbarContainer___dIhma",dragging:"styles-module__dragging___xrolZ",entrance:"styles-module__entrance___sgHd8",toolbarEnter:"styles-module__toolbarEnter___u8RRu",hiding:"styles-module__hiding___1td44",toolbarHide:"styles-module__toolbarHide___y8kaT",collapsed:"styles-module__collapsed___Rydsn",expanded:"styles-module__expanded___ofKPx",serverConnected:"styles-module__serverConnected___Gfbou",toggleContent:"styles-module__toggleContent___0yfyP",visible:"styles-module__visible___KHwEW",hidden:"styles-module__hidden___Ae8H4",controlsContent:"styles-module__controlsContent___9GJWU",badge:"styles-module__badge___2XsgF",fadeOut:"styles-module__fadeOut___6Ut6-",badgeEnter:"styles-module__badgeEnter___mVQLj",controlButton:"styles-module__controlButton___8Q0jc",statusShowing:"styles-module__statusShowing___te6iu",buttonBadge:"styles-module__buttonBadge___NeFWb",light:"styles-module__light___r6n4Y",mcpIndicator:"styles-module__mcpIndicator___zGJeL",connected:"styles-module__connected___7c28g",mcpIndicatorPulseConnected:"styles-module__mcpIndicatorPulseConnected___EDodZ",connecting:"styles-module__connecting___uo-CW",mcpIndicatorPulseConnecting:"styles-module__mcpIndicatorPulseConnecting___cCYte",connectionIndicatorWrapper:"styles-module__connectionIndicatorWrapper___L-e-3",connectionIndicator:"styles-module__connectionIndicator___afk9p",connectionIndicatorVisible:"styles-module__connectionIndicatorVisible___C-i5B",connectionIndicatorConnected:"styles-module__connectionIndicatorConnected___IY8pR",connectionPulse:"styles-module__connectionPulse___-Zycw",connectionIndicatorDisconnected:"styles-module__connectionIndicatorDisconnected___kmpaZ",connectionIndicatorConnecting:"styles-module__connectionIndicatorConnecting___QmSLH",buttonWrapper:"styles-module__buttonWrapper___rBcdv",buttonTooltip:"styles-module__buttonTooltip___Burd9",tooltipsInSession:"styles-module__tooltipsInSession___-0lHH",sendButtonWrapper:"styles-module__sendButtonWrapper___UUxG6",sendButtonVisible:"styles-module__sendButtonVisible___WPSQU",shortcut:"styles-module__shortcut___lEAQk",tooltipBelow:"styles-module__tooltipBelow___m6ats",tooltipsHidden:"styles-module__tooltipsHidden___VtLJG",tooltipVisible:"styles-module__tooltipVisible___0jcCv",buttonWrapperAlignLeft:"styles-module__buttonWrapperAlignLeft___myzIp",buttonWrapperAlignRight:"styles-module__buttonWrapperAlignRight___HCQFR",divider:"styles-module__divider___c--s1",overlay:"styles-module__overlay___Q1O9y",hoverHighlight:"styles-module__hoverHighlight___ogakW",enter:"styles-module__enter___WFIki",hoverHighlightIn:"styles-module__hoverHighlightIn___6WYHY",multiSelectOutline:"styles-module__multiSelectOutline___cSJ-m",fadeIn:"styles-module__fadeIn___b9qmf",exit:"styles-module__exit___fyOJ0",singleSelectOutline:"styles-module__singleSelectOutline___QhX-O",hoverTooltip:"styles-module__hoverTooltip___bvLk7",hoverTooltipIn:"styles-module__hoverTooltipIn___FYGQx",hoverReactPath:"styles-module__hoverReactPath___gx1IJ",hoverElementName:"styles-module__hoverElementName___QMLMl",markersLayer:"styles-module__markersLayer___-25j1",fixedMarkersLayer:"styles-module__fixedMarkersLayer___ffyX6",marker:"styles-module__marker___6sQrs",clearing:"styles-module__clearing___FQ--7",markerIn:"styles-module__markerIn___5FaAP",markerOut:"styles-module__markerOut___GU5jX",pending:"styles-module__pending___2IHLC",fixed:"styles-module__fixed___dBMHC",multiSelect:"styles-module__multiSelect___YWiuz",hovered:"styles-module__hovered___ZgXIy",renumber:"styles-module__renumber___nCTxD",renumberRoll:"styles-module__renumberRoll___Wgbq3",markerTooltip:"styles-module__markerTooltip___aLJID",tooltipIn:"styles-module__tooltipIn___0N31w",markerQuote:"styles-module__markerQuote___FHmrz",markerNote:"styles-module__markerNote___QkrrS",markerHint:"styles-module__markerHint___2iF-6",settingsPanel:"styles-module__settingsPanel___OxX3Y",settingsHeader:"styles-module__settingsHeader___pwDY9",settingsBrand:"styles-module__settingsBrand___0gJeM",settingsBrandSlash:"styles-module__settingsBrandSlash___uTG18",settingsVersion:"styles-module__settingsVersion___TUcFq",settingsSection:"styles-module__settingsSection___m-YM2",settingsLabel:"styles-module__settingsLabel___8UjfX",cycleButton:"styles-module__cycleButton___FMKfw",cycleDot:"styles-module__cycleDot___nPgLY",dropdownButton:"styles-module__dropdownButton___16NPz",toggleLabel:"styles-module__toggleLabel___Xm8Aa",customCheckbox:"styles-module__customCheckbox___U39ax",sliderLabel:"styles-module__sliderLabel___U8sPr",slider:"styles-module__slider___GLdxp",helpIcon:"styles-module__helpIcon___xQg56",themeToggle:"styles-module__themeToggle___2rUjA",dark:"styles-module__dark___ILIQf",settingsOption:"styles-module__settingsOption___UNa12",selected:"styles-module__selected___OwRqP",settingsPanelContainer:"styles-module__settingsPanelContainer___Xksv8",transitioning:"styles-module__transitioning___qxzCk",settingsPage:"styles-module__settingsPage___6YfHH",slideLeft:"styles-module__slideLeft___Ps01J",automationsPage:"styles-module__automationsPage___uvCq6",slideIn:"styles-module__slideIn___4-qXe",settingsNavLink:"styles-module__settingsNavLink___wCzJt",settingsNavLinkRight:"styles-module__settingsNavLinkRight___ZWwhj",mcpNavIndicator:"styles-module__mcpNavIndicator___cl9pO",mcpPulse:"styles-module__mcpPulse___uNggr",settingsBackButton:"styles-module__settingsBackButton___bIe2j",automationHeader:"styles-module__automationHeader___InP0r",automationDescription:"styles-module__automationDescription___NKlmo",learnMoreLink:"styles-module__learnMoreLink___8xv-x",autoSendRow:"styles-module__autoSendRow___UblX5",autoSendLabel:"styles-module__autoSendLabel___icDc2",active:"styles-module__active___-zoN6",webhookUrlInput:"styles-module__webhookUrlInput___2375C",settingsSectionExtraPadding:"styles-module__settingsSectionExtraPadding___jdhFV",settingsSectionGrow:"styles-module__settingsSectionGrow___h-5HZ",settingsRow:"styles-module__settingsRow___3sdhc",settingsRowMarginTop:"styles-module__settingsRowMarginTop___zA0Sp",dropdownContainer:"styles-module__dropdownContainer___BVnxe",settingsRowDisabled:"styles-module__settingsRowDisabled___EgS0V",toggleSwitch:"styles-module__toggleSwitch___l4Ygm",cycleButtonText:"styles-module__cycleButtonText___fD1LR",cycleTextIn:"styles-module__cycleTextIn___Q6zJf",cycleDots:"styles-module__cycleDots___LWuoQ",dropdownMenu:"styles-module__dropdownMenu___k73ER",scaleIn:"styles-module__scaleIn___c-r1K",dropdownItem:"styles-module__dropdownItem___ylsLj",settingsLabelMarker:"styles-module__settingsLabelMarker___ewdtV",settingsOptions:"styles-module__settingsOptions___LyrBA",sliderContainer:"styles-module__sliderContainer___ducXj",sliderLabels:"styles-module__sliderLabels___FhLDB",colorOptions:"styles-module__colorOptions___iHCNX",colorOption:"styles-module__colorOption___IodiY",colorOptionRing:"styles-module__colorOptionRing___U2xpo",settingsToggle:"styles-module__settingsToggle___fBrFn",settingsToggleMarginBottom:"styles-module__settingsToggleMarginBottom___MZUyF",checked:"styles-module__checked___mnZLo",toggleSlider:"styles-module__toggleSlider___wprIn",disabled:"styles-module__disabled___332Jw",mcpStatusDot:"styles-module__mcpStatusDot___ibgkc",disconnected:"styles-module__disconnected___cHPxR",mcpPulseError:"styles-module__mcpPulseError___fov9B",helpIconNudgeDown:"styles-module__helpIconNudgeDown___0cqpM",helpIconNoNudge:"styles-module__helpIconNoNudge___abogC","helpIconNudge1-5":"styles-module__helpIconNudge1-5___DM2TQ",helpIconNudge2:"styles-module__helpIconNudge2___TfWgC",dragSelection:"styles-module__dragSelection___kZLq2",dragCount:"styles-module__dragCount___KM90j",highlightsContainer:"styles-module__highlightsContainer___-0xzG",selectedElementHighlight:"styles-module__selectedElementHighlight___fyVlI",themeIconWrapper:"styles-module__themeIconWrapper___LsJIM",themeIcon:"styles-module__themeIcon___lCCmo",themeIconIn:"styles-module__themeIconIn___TU6ML",scaleOut:"styles-module__scaleOut___Wctwz",slideUp:"styles-module__slideUp___kgD36",slideDown:"styles-module__slideDown___zcdje",settingsPanelIn:"styles-module__settingsPanelIn___MGfO8",settingsPanelOut:"styles-module__settingsPanelOut___Zfymi"};if(typeof document<"u"){let r=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");r||(r=document.createElement("style"),r.id="feedback-tool-styles-page-toolbar-css-styles",r.textContent=y_,document.head.appendChild(r))}var S=x_;function tu(r,a="filtered"){const{name:i,path:c}=la(r);if(a==="off")return{name:i,elementName:i,path:c,reactComponents:null};const m=s_(r,{mode:a});return{name:m.path?`${m.path} ${i}`:i,elementName:i,path:c,reactComponents:m.path}}var tf=!1,nf={outputDetail:"standard",autoClearAfterCopy:!1,annotationColor:"#3c82f7",blockInteractions:!0,reactEnabled:!0,markerClickBehavior:"edit",webhookUrl:"",webhooksEnabled:!0},Bn=r=>{if(!r||!r.trim())return!1;try{const a=new URL(r.trim());return a.protocol==="http:"||a.protocol==="https:"}catch{return!1}},Ml=[{value:"compact",label:"Compact"},{value:"standard",label:"Standard"},{value:"detailed",label:"Detailed"},{value:"forensic",label:"Forensic"}],v_=[{value:"#AF52DE",label:"Purple"},{value:"#3c82f7",label:"Blue"},{value:"#5AC8FA",label:"Cyan"},{value:"#34C759",label:"Green"},{value:"#FFD60A",label:"Yellow"},{value:"#FF9500",label:"Orange"},{value:"#FF3B30",label:"Red"}];function Wr(r,a){let i=document.elementFromPoint(r,a);if(!i)return null;for(;i!=null&&i.shadowRoot;){const c=i.shadowRoot.elementFromPoint(r,a);if(!c||c===i)break;i=c}return i}function nu(r){let a=r;for(;a&&a!==document.body;){const c=window.getComputedStyle(a).position;if(c==="fixed"||c==="sticky")return!0;a=a.parentElement}return!1}function Eo(r){return r.status!=="resolved"&&r.status!=="dismissed"}function ta(r){const a=su(r),i=a.found?a:g_(r);if(i.found&&i.source)return __(i.source,"path")}function of(r,a,i="standard",c="filtered"){if(r.length===0)return"";const m=typeof window<"u"?`${window.innerWidth}×${window.innerHeight}`:"unknown";let h=`## Page Feedback: ${a}
`;return i==="forensic"?(h+=`
**Environment:**
`,h+=`- Viewport: ${m}
`,typeof window<"u"&&(h+=`- URL: ${window.location.href}
`,h+=`- User Agent: ${navigator.userAgent}
`,h+=`- Timestamp: ${new Date().toISOString()}
`,h+=`- Device Pixel Ratio: ${window.devicePixelRatio}
`),h+=`
---
`):i!=="compact"&&(h+=`**Viewport:** ${m}
`),h+=`
`,r.forEach((p,y)=>{i==="compact"?(h+=`${y+1}. **${p.element}**${p.sourceFile?` (${p.sourceFile})`:""}: ${p.comment}`,p.selectedText&&(h+=` (re: "${p.selectedText.slice(0,30)}${p.selectedText.length>30?"...":""}")`),h+=`
`):i==="forensic"?(h+=`### ${y+1}. ${p.element}
`,p.isMultiSelect&&p.fullPath&&(h+=`*Forensic data shown for first element of selection*
`),p.fullPath&&(h+=`**Full DOM Path:** ${p.fullPath}
`),p.cssClasses&&(h+=`**CSS Classes:** ${p.cssClasses}
`),p.boundingBox&&(h+=`**Position:** x:${Math.round(p.boundingBox.x)}, y:${Math.round(p.boundingBox.y)} (${Math.round(p.boundingBox.width)}×${Math.round(p.boundingBox.height)}px)
`),h+=`**Annotation at:** ${p.x.toFixed(1)}% from left, ${Math.round(p.y)}px from top
`,p.selectedText&&(h+=`**Selected text:** "${p.selectedText}"
`),p.nearbyText&&!p.selectedText&&(h+=`**Context:** ${p.nearbyText.slice(0,100)}
`),p.computedStyles&&(h+=`**Computed Styles:** ${p.computedStyles}
`),p.accessibility&&(h+=`**Accessibility:** ${p.accessibility}
`),p.nearbyElements&&(h+=`**Nearby Elements:** ${p.nearbyElements}
`),p.sourceFile&&(h+=`**Source:** ${p.sourceFile}
`),p.reactComponents&&(h+=`**React:** ${p.reactComponents}
`),h+=`**Feedback:** ${p.comment}

`):(h+=`### ${y+1}. ${p.element}
`,h+=`**Location:** ${p.elementPath}
`,p.sourceFile&&(h+=`**Source:** ${p.sourceFile}
`),p.reactComponents&&(h+=`**React:** ${p.reactComponents}
`),i==="detailed"&&(p.cssClasses&&(h+=`**Classes:** ${p.cssClasses}
`),p.boundingBox&&(h+=`**Position:** ${Math.round(p.boundingBox.x)}px, ${Math.round(p.boundingBox.y)}px (${Math.round(p.boundingBox.width)}×${Math.round(p.boundingBox.height)}px)
`)),p.selectedText&&(h+=`**Selected text:** "${p.selectedText}"
`),i==="detailed"&&p.nearbyText&&!p.selectedText&&(h+=`**Context:** ${p.nearbyText.slice(0,100)}
`),h+=`**Feedback:** ${p.comment}

`)}),h.trim()}function b_({demoAnnotations:r,demoDelay:a=1e3,enableDemoMode:i=!1,onAnnotationAdd:c,onAnnotationDelete:m,onAnnotationUpdate:h,onAnnotationsClear:p,onCopy:y,onSubmit:f,copyToClipboard:$=!0,endpoint:w,sessionId:T,onSessionCreated:_,webhookUrl:N,className:x}={}){var Zn,Bo,Jl;const[g,E]=C.useState(!1),[k,J]=C.useState([]),[ne,le]=C.useState(!0),[re,ae]=C.useState(()=>Uh()),[ue,v]=C.useState(!1),U=C.useRef(null);C.useEffect(()=>{const b=B=>{const Q=U.current;Q&&Q.contains(B.target)&&B.stopPropagation()},P=["mousedown","click","pointerdown"];return P.forEach(B=>document.body.addEventListener(B,b)),()=>{P.forEach(B=>document.body.removeEventListener(B,b))}},[]);const[be,K]=C.useState(!1),[fe,Oe]=C.useState(!1),[ze,Le]=C.useState(null),[O,W]=C.useState({x:0,y:0}),[M,Y]=C.useState(null),[V,R]=C.useState(!1),[F,ie]=C.useState("idle"),[H,xe]=C.useState(!1),[we,Ie]=C.useState(!1),[$e,Ue]=C.useState(null),[Nt,an]=C.useState(null),[Ur,Nn]=C.useState([]),[tr,Vr]=C.useState(null),[No,nr]=C.useState(null),[De,Yn]=C.useState(null),[Hn,It]=C.useState(null),[or,Pn]=C.useState([]),[Tn,Xr]=C.useState(0),[Qr,rr]=C.useState(!1),[nt,Al]=C.useState(!1),[Pt,so]=C.useState(!1),[Po,lr]=C.useState(!1),[Bl,Wl]=C.useState(!1),[To,Lo]=C.useState("main"),[sr,ar]=C.useState(!1),[Gr,Ln]=C.useState(!1),[Un,Kr]=C.useState(!1),Vn=C.useRef(null),[ut,Xn]=C.useState([]),qt=C.useRef({cmd:!1,shift:!1}),Ct=()=>{Ln(!0)},Yl=()=>{Ln(!1)},Ro=()=>{Un||(Vn.current=setTimeout(()=>Kr(!0),850))},Zr=()=>{Vn.current&&(clearTimeout(Vn.current),Vn.current=null),Kr(!1),Yl()};C.useEffect(()=>()=>{Vn.current&&clearTimeout(Vn.current)},[]);const un=({content:b,children:P})=>{const[B,Q]=C.useState(!1),[G,q]=C.useState(!1),[he,pe]=C.useState(!1),[ke,Te]=C.useState({top:0,right:0}),Ce=C.useRef(null),Pe=C.useRef(null),Se=C.useRef(null),Ne=()=>{if(Ce.current){const gt=Ce.current.getBoundingClientRect();Te({top:gt.top+gt.height/2,right:window.innerWidth-gt.left+8})}},_e=()=>{Q(!0),pe(!0),Se.current&&(clearTimeout(Se.current),Se.current=null),Ne(),Pe.current=Ve(()=>{q(!0)},500)},_t=()=>{Q(!1),Pe.current&&(clearTimeout(Pe.current),Pe.current=null),q(!1),Se.current=Ve(()=>{pe(!1)},150)};return C.useEffect(()=>()=>{Pe.current&&clearTimeout(Pe.current),Se.current&&clearTimeout(Se.current)},[]),l.jsxs(l.Fragment,{children:[l.jsx("span",{ref:Ce,onMouseEnter:_e,onMouseLeave:_t,children:P}),he&&Vd.createPortal(l.jsx("div",{"data-feedback-toolbar":!0,style:{position:"fixed",top:ke.top,right:ke.right,transform:"translateY(-50%)",padding:"6px 10px",background:"#383838",color:"rgba(255, 255, 255, 0.7)",fontSize:"11px",fontWeight:400,lineHeight:"14px",borderRadius:"10px",width:"180px",textAlign:"left",zIndex:100020,pointerEvents:"none",boxShadow:"0px 1px 8px rgba(0, 0, 0, 0.28)",opacity:G&&!sr?1:0,transition:"opacity 0.15s ease"},children:b}),document.body)]})},[ce,Yt]=C.useState(nf),[Me,Io]=C.useState(!0),[ir,Hl]=C.useState(!1),Ul=!1,gn="off",[pt,ur]=C.useState(T??null),Jr=C.useRef(!1),[Tt,Rn]=C.useState(w?"connecting":"disconnected"),[Ze,cr]=C.useState(null),[cn,Vl]=C.useState(!1),[ao,lt]=C.useState(null),[ca,qr]=C.useState(0),dr=C.useRef(!1),[$o,Mo]=C.useState(new Set),[el,Qn]=C.useState(new Set),[$t,fr]=C.useState(!1),[en,io]=C.useState(!1),[yn,Xl]=C.useState(!1),xn=C.useRef(null),At=C.useRef(null),vn=C.useRef(null),In=C.useRef(null),mr=C.useRef(!1),Ql=C.useRef(0),uo=C.useRef(null),tl=C.useRef(null),zo=8,Oo=50,Gl=C.useRef(null),pr=C.useRef(null),He=C.useRef(null),Je=typeof window<"u"?window.location.pathname:"/";C.useEffect(()=>{if(Po)Wl(!0);else{Ln(!1),Lo("main");const b=Ve(()=>Wl(!1),0);return()=>clearTimeout(b)}},[Po]),C.useEffect(()=>{ar(!0);const b=Ve(()=>ar(!1),350);return()=>clearTimeout(b)},[To]);const nl=g&&ne;C.useEffect(()=>{if(nl){Oe(!1),K(!0),Mo(new Set);const b=Ve(()=>{Mo(P=>{const B=new Set(P);return k.forEach(Q=>B.add(Q.id)),B})},350);return()=>clearTimeout(b)}else if(be){Oe(!0);const b=Ve(()=>{K(!1),Oe(!1)},250);return()=>clearTimeout(b)}},[nl]),C.useEffect(()=>{Al(!0),Xr(window.scrollY);const b=Zi(Je);J(b.filter(Eo)),tf||(Hl(!0),tf=!0,Ve(()=>Hl(!1),750));try{const P=localStorage.getItem("feedback-toolbar-settings");P&&Yt({...nf,...JSON.parse(P)})}catch{}try{const P=localStorage.getItem("feedback-toolbar-theme");P!==null&&Io(P==="dark")}catch{}try{const P=localStorage.getItem("feedback-toolbar-position");if(P){const B=JSON.parse(P);typeof B.x=="number"&&typeof B.y=="number"&&cr(B)}}catch{}},[Je]),C.useEffect(()=>{nt&&localStorage.setItem("feedback-toolbar-settings",JSON.stringify(ce))},[ce,nt]),C.useEffect(()=>{nt&&localStorage.setItem("feedback-toolbar-theme",Me?"dark":"light")},[Me,nt]);const hr=C.useRef(!1);C.useEffect(()=>{const b=hr.current;hr.current=cn,b&&!cn&&Ze&&nt&&localStorage.setItem("feedback-toolbar-position",JSON.stringify(Ze))},[cn,Ze,nt]),C.useEffect(()=>{if(!w||!nt||Jr.current)return;Jr.current=!0,Rn("connecting"),(async()=>{try{const P=Yh(Je),B=T||P;let Q=!1;if(B)try{const G=await Zd(w,B);ur(G.id),Rn("connected"),Ji(Je,G.id),Q=!0;const q=Zi(Je),he=new Set(G.annotations.map(ke=>ke.id)),pe=q.filter(ke=>!he.has(ke.id));if(pe.length>0){const Te=`${typeof window<"u"?window.location.origin:""}${Je}`,Pe=(await Promise.allSettled(pe.map(Ne=>qs(w,G.id,{...Ne,sessionId:G.id,url:Te})))).map((Ne,_e)=>Ne.status==="fulfilled"?Ne.value:(console.warn("[Agentation] Failed to sync annotation:",Ne.reason),pe[_e])),Se=[...G.annotations,...Pe];J(Se.filter(Eo)),Rl(Je,Se.filter(Eo),G.id)}else J(G.annotations.filter(Eo)),Rl(Je,G.annotations.filter(Eo),G.id)}catch(G){console.warn("[Agentation] Could not join session, creating new:",G),Hh(Je)}if(!Q){const G=typeof window<"u"?window.location.href:"/",q=await qi(w,G);ur(q.id),Rn("connected"),Ji(Je,q.id),_==null||_(q.id);const he=Wh(),pe=typeof window<"u"?window.location.origin:"",ke=[];for(const[Te,Ce]of he){const Pe=Ce.filter(_e=>!_e._syncedTo);if(Pe.length===0)continue;const Se=`${pe}${Te}`,Ne=Te===Je;ke.push((async()=>{try{const _e=Ne?q:await qi(w,Se),on=(await Promise.allSettled(Pe.map(st=>qs(w,_e.id,{...st,sessionId:_e.id,url:Se})))).map((st,ft)=>st.status==="fulfilled"?st.value:(console.warn("[Agentation] Failed to sync annotation:",st.reason),Pe[ft])).filter(Eo);if(Rl(Te,on,_e.id),Ne){const st=new Set(Pe.map(ft=>ft.id));J(ft=>{const Ae=ft.filter(Be=>!st.has(Be.id));return[...on,...Ae]})}}catch(_e){console.warn(`[Agentation] Failed to sync annotations for ${Te}:`,_e)}})())}await Promise.allSettled(ke)}}catch(P){Rn("disconnected"),console.warn("[Agentation] Failed to initialize session, using local storage:",P)}})()},[w,T,nt,_,Je]),C.useEffect(()=>{if(!w||!nt)return;const b=async()=>{try{(await fetch(`${w}/health`)).ok?Rn("connected"):Rn("disconnected")}catch{Rn("disconnected")}};b();const P=Rh(b,1e4);return()=>clearInterval(P)},[w,nt]),C.useEffect(()=>{if(!w||!nt||!pt)return;const b=new EventSource(`${w}/sessions/${pt}/events`),P=["resolved","dismissed"],B=Q=>{var G;try{const q=JSON.parse(Q.data);if(P.includes((G=q.payload)==null?void 0:G.status)){const he=q.payload.id;Qn(pe=>new Set(pe).add(he)),Ve(()=>{J(pe=>pe.filter(ke=>ke.id!==he)),Qn(pe=>{const ke=new Set(pe);return ke.delete(he),ke})},150)}}catch{}};return b.addEventListener("annotation.updated",B),()=>{b.removeEventListener("annotation.updated",B),b.close()}},[w,nt,pt]),C.useEffect(()=>{if(!w||!nt)return;const b=tl.current==="disconnected",P=Tt==="connected";tl.current=Tt,b&&P&&(async()=>{try{const Q=Zi(Je);if(Q.length===0)return;const q=`${typeof window<"u"?window.location.origin:""}${Je}`;let he=pt,pe=[];if(he)try{pe=(await Zd(w,he)).annotations}catch{he=null}he||(he=(await qi(w,q)).id,ur(he),Ji(Je,he));const ke=new Set(pe.map(Ce=>Ce.id)),Te=Q.filter(Ce=>!ke.has(Ce.id));if(Te.length>0){const Pe=(await Promise.allSettled(Te.map(_e=>qs(w,he,{..._e,sessionId:he,url:q})))).map((_e,_t)=>_e.status==="fulfilled"?_e.value:(console.warn("[Agentation] Failed to sync annotation on reconnect:",_e.reason),Te[_t])),Ne=[...pe,...Pe].filter(Eo);J(Ne),Rl(Je,Ne,he)}}catch(Q){console.warn("[Agentation] Failed to sync on reconnect:",Q)}})()},[Tt,w,nt,pt,Je]);const Kl=C.useCallback(()=>{ue||(v(!0),lr(!1),E(!1),Ve(()=>{Vh(!0),ae(!0),v(!1)},400))},[ue]);C.useEffect(()=>{if(!i||!nt||!r||r.length===0||k.length>0)return;const b=[];return b.push(Ve(()=>{E(!0)},a-200)),r.forEach((P,B)=>{const Q=a+B*300;b.push(Ve(()=>{const G=document.querySelector(P.selector);if(!G)return;const q=G.getBoundingClientRect(),{name:he,path:pe}=la(G),ke={id:`demo-${Date.now()}-${B}`,x:(q.left+q.width/2)/window.innerWidth*100,y:q.top+q.height/2+window.scrollY,comment:P.comment,element:he,elementPath:pe,timestamp:Date.now(),selectedText:P.selectedText,boundingBox:{x:q.left,y:q.top+window.scrollY,width:q.width,height:q.height},nearbyText:Tl(G),cssClasses:Ll(G)};J(Te=>[...Te,ke])},Q))}),()=>{b.forEach(clearTimeout)}},[i,nt,r,a]),C.useEffect(()=>{const b=()=>{Xr(window.scrollY),rr(!0),He.current&&clearTimeout(He.current),He.current=Ve(()=>{rr(!1)},150)};return window.addEventListener("scroll",b,{passive:!0}),()=>{window.removeEventListener("scroll",b),He.current&&clearTimeout(He.current)}},[]),C.useEffect(()=>{nt&&k.length>0?pt?Rl(Je,k,pt):bf(Je,k):nt&&k.length===0&&localStorage.removeItem(sa(Je))},[k,Je,nt,pt]);const ol=C.useCallback(()=>{Pt||($h(),so(!0))},[Pt]),Do=C.useCallback(()=>{Pt&&(Gd(),so(!1))},[Pt]),Fo=C.useCallback(()=>{Pt?Do():ol()},[Pt,ol,Do]),Ao=C.useCallback(()=>{if(ut.length===0)return;const b=ut[0],P=b.element,B=ut.length>1,Q=ut.map(G=>G.element.getBoundingClientRect());if(B){const G={left:Math.min(...Q.map(_e=>_e.left)),top:Math.min(...Q.map(_e=>_e.top)),right:Math.max(...Q.map(_e=>_e.right)),bottom:Math.max(...Q.map(_e=>_e.bottom))},q=ut.slice(0,5).map(_e=>_e.name).join(", "),he=ut.length>5?` +${ut.length-5} more`:"",pe=Q.map(_e=>({x:_e.left,y:_e.top+window.scrollY,width:_e.width,height:_e.height})),Te=ut[ut.length-1].element,Ce=Q[Q.length-1],Pe=Ce.left+Ce.width/2,Se=Ce.top+Ce.height/2,Ne=nu(Te);Y({x:Pe/window.innerWidth*100,y:Ne?Se:Se+window.scrollY,clientY:Se,element:`${ut.length} elements: ${q}${he}`,elementPath:"multi-select",boundingBox:{x:G.left,y:G.top+window.scrollY,width:G.right-G.left,height:G.bottom-G.top},isMultiSelect:!0,isFixed:Ne,elementBoundingBoxes:pe,multiSelectElements:ut.map(_e=>_e.element),targetElement:Te,fullPath:Js(P),accessibility:Zs(P),computedStyles:Ks(P),computedStylesObj:Gs(P),nearbyElements:Qs(P),cssClasses:Ll(P),nearbyText:Tl(P),sourceFile:ta(P)})}else{const G=Q[0],q=nu(P);Y({x:G.left/window.innerWidth*100,y:q?G.top:G.top+window.scrollY,clientY:G.top,element:b.name,elementPath:b.path,boundingBox:{x:G.left,y:q?G.top:G.top+window.scrollY,width:G.width,height:G.height},isFixed:q,fullPath:Js(P),accessibility:Zs(P),computedStyles:Ks(P),computedStylesObj:Gs(P),nearbyElements:Qs(P),cssClasses:Ll(P),nearbyText:Tl(P),reactComponents:b.reactComponents,sourceFile:ta(P)})}Xn([]),Le(null)},[ut]);C.useEffect(()=>{g||(Y(null),Yn(null),It(null),Pn([]),Le(null),lr(!1),Xn([]),qt.current={cmd:!1,shift:!1},Pt&&Do())},[g,Pt,Do]),C.useEffect(()=>()=>{Gd()},[]),C.useEffect(()=>{if(!g)return;const b=document.createElement("style");return b.id="feedback-cursor-styles",b.textContent=`
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
    `,document.head.appendChild(b),()=>{const P=document.getElementById("feedback-cursor-styles");P&&P.remove()}},[g]),C.useEffect(()=>{if(!g||M)return;const b=P=>{const B=P.composedPath()[0]||P.target;if(Jt(B,"[data-feedback-toolbar]")){Le(null);return}const Q=Wr(P.clientX,P.clientY);if(!Q||Jt(Q,"[data-feedback-toolbar]")){Le(null);return}const{name:G,elementName:q,path:he,reactComponents:pe}=tu(Q,gn),ke=Q.getBoundingClientRect();Le({element:G,elementName:q,elementPath:he,rect:ke,reactComponents:pe}),W({x:P.clientX,y:P.clientY})};return document.addEventListener("mousemove",b),()=>document.removeEventListener("mousemove",b)},[g,M,gn]),C.useEffect(()=>{if(!g)return;const b=P=>{var gt,on;if(mr.current){mr.current=!1;return}const B=P.composedPath()[0]||P.target;if(Jt(B,"[data-feedback-toolbar]")||Jt(B,"[data-annotation-popup]")||Jt(B,"[data-annotation-marker]"))return;if(P.metaKey&&P.shiftKey&&!M&&!De){P.preventDefault(),P.stopPropagation();const st=Wr(P.clientX,P.clientY);if(!st)return;const ft=st.getBoundingClientRect(),{name:Ae,path:Be,reactComponents:Mt}=tu(st,gn),at=ut.findIndex(Ht=>Ht.element===st);at>=0?Xn(Ht=>Ht.filter((Ut,xr)=>xr!==at)):Xn(Ht=>[...Ht,{element:st,rect:ft,name:Ae,path:Be,reactComponents:Mt??void 0}]);return}const Q=Jt(B,"button, a, input, select, textarea, [role='button'], [onclick]");if(ce.blockInteractions&&Q&&(P.preventDefault(),P.stopPropagation()),M){if(Q&&!ce.blockInteractions)return;P.preventDefault(),(gt=Gl.current)==null||gt.shake();return}if(De){if(Q&&!ce.blockInteractions)return;P.preventDefault(),(on=pr.current)==null||on.shake();return}P.preventDefault();const G=Wr(P.clientX,P.clientY);if(!G)return;const{name:q,path:he,reactComponents:pe}=tu(G,gn),ke=G.getBoundingClientRect(),Te=P.clientX/window.innerWidth*100,Ce=nu(G),Pe=Ce?P.clientY:P.clientY+window.scrollY,Se=window.getSelection();let Ne;Se&&Se.toString().trim().length>0&&(Ne=Se.toString().trim().slice(0,500));const _e=Gs(G),_t=Ks(G);Y({x:Te,y:Pe,clientY:P.clientY,element:q,elementPath:he,selectedText:Ne,boundingBox:{x:ke.left,y:Ce?ke.top:ke.top+window.scrollY,width:ke.width,height:ke.height},nearbyText:Tl(G),cssClasses:Ll(G),isFixed:Ce,fullPath:Js(G),accessibility:Zs(G),computedStyles:_t,computedStylesObj:_e,nearbyElements:Qs(G),reactComponents:pe??void 0,sourceFile:ta(G),targetElement:G}),Le(null)};return document.addEventListener("click",b,!0),()=>document.removeEventListener("click",b,!0)},[g,M,De,ce.blockInteractions,gn,ut]),C.useEffect(()=>{if(!g)return;const b=Q=>{Q.key==="Meta"&&(qt.current.cmd=!0),Q.key==="Shift"&&(qt.current.shift=!0)},P=Q=>{const G=qt.current.cmd&&qt.current.shift;Q.key==="Meta"&&(qt.current.cmd=!1),Q.key==="Shift"&&(qt.current.shift=!1);const q=qt.current.cmd&&qt.current.shift;G&&!q&&ut.length>0&&Ao()},B=()=>{qt.current={cmd:!1,shift:!1},Xn([])};return document.addEventListener("keydown",b),document.addEventListener("keyup",P),window.addEventListener("blur",B),()=>{document.removeEventListener("keydown",b),document.removeEventListener("keyup",P),window.removeEventListener("blur",B)}},[g,ut,Ao]),C.useEffect(()=>{if(!g||M)return;const b=P=>{const B=P.composedPath()[0]||P.target;Jt(B,"[data-feedback-toolbar]")||Jt(B,"[data-annotation-marker]")||Jt(B,"[data-annotation-popup]")||new Set(["P","SPAN","H1","H2","H3","H4","H5","H6","LI","TD","TH","LABEL","BLOCKQUOTE","FIGCAPTION","CAPTION","LEGEND","DT","DD","PRE","CODE","EM","STRONG","B","I","U","S","A","TIME","ADDRESS","CITE","Q","ABBR","DFN","MARK","SMALL","SUB","SUP"]).has(B.tagName)||B.isContentEditable||(xn.current={x:P.clientX,y:P.clientY})};return document.addEventListener("mousedown",b),()=>document.removeEventListener("mousedown",b)},[g,M]),C.useEffect(()=>{if(!g||M)return;const b=P=>{if(!xn.current)return;const B=P.clientX-xn.current.x,Q=P.clientY-xn.current.y,G=B*B+Q*Q,q=zo*zo;if(!yn&&G>=q&&(At.current=xn.current,Xl(!0)),(yn||G>=q)&&At.current){if(vn.current){const Ae=Math.min(At.current.x,P.clientX),Be=Math.min(At.current.y,P.clientY),Mt=Math.abs(P.clientX-At.current.x),at=Math.abs(P.clientY-At.current.y);vn.current.style.transform=`translate(${Ae}px, ${Be}px)`,vn.current.style.width=`${Mt}px`,vn.current.style.height=`${at}px`}const he=Date.now();if(he-Ql.current<Oo)return;Ql.current=he;const pe=At.current.x,ke=At.current.y,Te=Math.min(pe,P.clientX),Ce=Math.min(ke,P.clientY),Pe=Math.max(pe,P.clientX),Se=Math.max(ke,P.clientY),Ne=(Te+Pe)/2,_e=(Ce+Se)/2,_t=new Set,gt=[[Te,Ce],[Pe,Ce],[Te,Se],[Pe,Se],[Ne,_e],[Ne,Ce],[Ne,Se],[Te,_e],[Pe,_e]];for(const[Ae,Be]of gt){const Mt=document.elementsFromPoint(Ae,Be);for(const at of Mt)at instanceof HTMLElement&&_t.add(at)}const on=document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav");for(const Ae of on)if(Ae instanceof HTMLElement){const Be=Ae.getBoundingClientRect(),Mt=Be.left+Be.width/2,at=Be.top+Be.height/2,Ht=Mt>=Te&&Mt<=Pe&&at>=Ce&&at<=Se,Ut=Math.min(Be.right,Pe)-Math.max(Be.left,Te),xr=Math.min(Be.bottom,Se)-Math.max(Be.top,Ce),fa=Ut>0&&xr>0?Ut*xr:0,ql=Be.width*Be.height,ma=ql>0?fa/ql:0;(Ht||ma>.5)&&_t.add(Ae)}const st=[],ft=new Set(["BUTTON","A","INPUT","IMG","P","H1","H2","H3","H4","H5","H6","LI","LABEL","TD","TH","SECTION","ARTICLE","ASIDE","NAV"]);for(const Ae of _t){if(Jt(Ae,"[data-feedback-toolbar]")||Jt(Ae,"[data-annotation-marker]"))continue;const Be=Ae.getBoundingClientRect();if(!(Be.width>window.innerWidth*.8&&Be.height>window.innerHeight*.5)&&!(Be.width<10||Be.height<10)&&Be.left<Pe&&Be.right>Te&&Be.top<Se&&Be.bottom>Ce){const Mt=Ae.tagName;let at=ft.has(Mt);if(!at&&(Mt==="DIV"||Mt==="SPAN")){const Ht=Ae.textContent&&Ae.textContent.trim().length>0,Ut=Ae.onclick!==null||Ae.getAttribute("role")==="button"||Ae.getAttribute("role")==="link"||Ae.classList.contains("clickable")||Ae.hasAttribute("data-clickable");(Ht||Ut)&&!Ae.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")&&(at=!0)}if(at){let Ht=!1;for(const Ut of st)if(Ut.left<=Be.left&&Ut.right>=Be.right&&Ut.top<=Be.top&&Ut.bottom>=Be.bottom){Ht=!0;break}Ht||st.push(Be)}}}if(In.current){const Ae=In.current;for(;Ae.children.length>st.length;)Ae.removeChild(Ae.lastChild);st.forEach((Be,Mt)=>{let at=Ae.children[Mt];at||(at=document.createElement("div"),at.className=S.selectedElementHighlight,Ae.appendChild(at)),at.style.transform=`translate(${Be.left}px, ${Be.top}px)`,at.style.width=`${Be.width}px`,at.style.height=`${Be.height}px`})}}};return document.addEventListener("mousemove",b,{passive:!0}),()=>document.removeEventListener("mousemove",b)},[g,M,yn,zo]),C.useEffect(()=>{if(!g)return;const b=P=>{const B=yn,Q=At.current;if(yn&&Q){mr.current=!0;const G=Math.min(Q.x,P.clientX),q=Math.min(Q.y,P.clientY),he=Math.max(Q.x,P.clientX),pe=Math.max(Q.y,P.clientY),ke=[];document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th").forEach(Ne=>{if(!(Ne instanceof HTMLElement)||Jt(Ne,"[data-feedback-toolbar]")||Jt(Ne,"[data-annotation-marker]"))return;const _e=Ne.getBoundingClientRect();_e.width>window.innerWidth*.8&&_e.height>window.innerHeight*.5||_e.width<10||_e.height<10||_e.left<he&&_e.right>G&&_e.top<pe&&_e.bottom>q&&ke.push({element:Ne,rect:_e})});const Ce=ke.filter(({element:Ne})=>!ke.some(({element:_e})=>_e!==Ne&&Ne.contains(_e))),Pe=P.clientX/window.innerWidth*100,Se=P.clientY+window.scrollY;if(Ce.length>0){const Ne=Ce.reduce((ft,{rect:Ae})=>({left:Math.min(ft.left,Ae.left),top:Math.min(ft.top,Ae.top),right:Math.max(ft.right,Ae.right),bottom:Math.max(ft.bottom,Ae.bottom)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0}),_e=Ce.slice(0,5).map(({element:ft})=>la(ft).name).join(", "),_t=Ce.length>5?` +${Ce.length-5} more`:"",gt=Ce[0].element,on=Gs(gt),st=Ks(gt);Y({x:Pe,y:Se,clientY:P.clientY,element:`${Ce.length} elements: ${_e}${_t}`,elementPath:"multi-select",boundingBox:{x:Ne.left,y:Ne.top+window.scrollY,width:Ne.right-Ne.left,height:Ne.bottom-Ne.top},isMultiSelect:!0,fullPath:Js(gt),accessibility:Zs(gt),computedStyles:st,computedStylesObj:on,nearbyElements:Qs(gt),cssClasses:Ll(gt),nearbyText:Tl(gt),sourceFile:ta(gt)})}else{const Ne=Math.abs(he-G),_e=Math.abs(pe-q);Ne>20&&_e>20&&Y({x:Pe,y:Se,clientY:P.clientY,element:"Area selection",elementPath:`region at (${Math.round(G)}, ${Math.round(q)})`,boundingBox:{x:G,y:q+window.scrollY,width:Ne,height:_e},isMultiSelect:!0})}Le(null)}else B&&(mr.current=!0);xn.current=null,At.current=null,Xl(!1),In.current&&(In.current.innerHTML="")};return document.addEventListener("mouseup",b),()=>document.removeEventListener("mouseup",b)},[g,yn]);const bt=C.useCallback(async(b,P,B)=>{const Q=ce.webhookUrl||N;if(!Q||!ce.webhooksEnabled&&!B)return!1;try{return(await fetch(Q,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:b,timestamp:Date.now(),url:typeof window<"u"?window.location.href:void 0,...P})})).ok}catch(G){return console.warn("[Agentation] Webhook failed:",G),!1}},[N,ce.webhookUrl,ce.webhooksEnabled]),$n=C.useCallback(b=>{var B;if(!M)return;const P={id:Date.now().toString(),x:M.x,y:M.y,comment:b,element:M.element,elementPath:M.elementPath,timestamp:Date.now(),selectedText:M.selectedText,boundingBox:M.boundingBox,nearbyText:M.nearbyText,cssClasses:M.cssClasses,isMultiSelect:M.isMultiSelect,isFixed:M.isFixed,fullPath:M.fullPath,accessibility:M.accessibility,computedStyles:M.computedStyles,nearbyElements:M.nearbyElements,reactComponents:M.reactComponents,sourceFile:M.sourceFile,elementBoundingBoxes:M.elementBoundingBoxes,...w&&pt?{sessionId:pt,url:typeof window<"u"?window.location.href:void 0,status:"pending"}:{}};J(Q=>[...Q,P]),uo.current=P.id,Ve(()=>{uo.current=null},300),Ve(()=>{Mo(Q=>new Set(Q).add(P.id))},250),c==null||c(P),bt("annotation.add",{annotation:P}),fr(!0),Ve(()=>{Y(null),fr(!1)},150),(B=window.getSelection())==null||B.removeAllRanges(),w&&pt&&qs(w,pt,P).then(Q=>{Q.id!==P.id&&(J(G=>G.map(q=>q.id===P.id?{...q,id:Q.id}:q)),Mo(G=>{const q=new Set(G);return q.delete(P.id),q.add(Q.id),q}))}).catch(Q=>{console.warn("[Agentation] Failed to sync annotation:",Q)})},[M,c,bt,w,pt]),Mn=C.useCallback(()=>{fr(!0),Ve(()=>{Y(null),fr(!1)},150)},[]),Gn=C.useCallback(b=>{const P=k.findIndex(Q=>Q.id===b),B=k[P];(De==null?void 0:De.id)===b&&(io(!0),Ve(()=>{Yn(null),It(null),Pn([]),io(!1)},150)),Vr(b),Qn(Q=>new Set(Q).add(b)),B&&(m==null||m(B),bt("annotation.delete",{annotation:B})),w&&Jd(w,b).catch(Q=>{console.warn("[Agentation] Failed to delete annotation from server:",Q)}),Ve(()=>{J(Q=>Q.filter(G=>G.id!==b)),Qn(Q=>{const G=new Set(Q);return G.delete(b),G}),Vr(null),P<k.length-1&&(nr(P),Ve(()=>nr(null),200))},150)},[k,De,m,bt,w]),zn=C.useCallback(b=>{var P;if(Yn(b),Ue(null),an(null),Nn([]),(P=b.elementBoundingBoxes)!=null&&P.length){const B=[];for(const Q of b.elementBoundingBoxes){const G=Q.x+Q.width/2,q=Q.y+Q.height/2-window.scrollY,he=Wr(G,q);he&&B.push(he)}Pn(B),It(null)}else if(b.boundingBox){const B=b.boundingBox,Q=B.x+B.width/2,G=b.isFixed?B.y+B.height/2:B.y+B.height/2-window.scrollY,q=Wr(Q,G);if(q){const he=q.getBoundingClientRect(),pe=he.width/B.width,ke=he.height/B.height;pe<.5||ke<.5?It(null):It(q)}else It(null);Pn([])}else It(null),Pn([])},[]),tn=C.useCallback(b=>{var P;if(!b){Ue(null),an(null),Nn([]);return}if(Ue(b.id),(P=b.elementBoundingBoxes)!=null&&P.length){const B=[];for(const Q of b.elementBoundingBoxes){const G=Q.x+Q.width/2,q=Q.y+Q.height/2-window.scrollY,pe=document.elementsFromPoint(G,q).find(ke=>!ke.closest("[data-annotation-marker]")&&!ke.closest("[data-agentation-root]"));pe&&B.push(pe)}Nn(B),an(null)}else if(b.boundingBox){const B=b.boundingBox,Q=B.x+B.width/2,G=b.isFixed?B.y+B.height/2:B.y+B.height/2-window.scrollY,q=Wr(Q,G);if(q){const he=q.getBoundingClientRect(),pe=he.width/B.width,ke=he.height/B.height;pe<.5||ke<.5?an(null):an(q)}else an(null);Nn([])}else an(null),Nn([])},[]),da=C.useCallback(b=>{if(!De)return;const P={...De,comment:b};J(B=>B.map(Q=>Q.id===De.id?P:Q)),h==null||h(P),bt("annotation.update",{annotation:P}),w&&Xh(w,De.id,{comment:b}).catch(B=>{console.warn("[Agentation] Failed to update annotation on server:",B)}),io(!0),Ve(()=>{Yn(null),It(null),Pn([]),io(!1)},150)},[De,h,bt,w]),Zl=C.useCallback(()=>{io(!0),Ve(()=>{Yn(null),It(null),Pn([]),io(!1)},150)},[]),nn=C.useCallback(()=>{const b=k.length;if(b===0)return;p==null||p(k),bt("annotations.clear",{annotations:k}),w&&Promise.all(k.map(B=>Jd(w,B.id).catch(Q=>{console.warn("[Agentation] Failed to delete annotation from server:",Q)}))),Ie(!0),xe(!0);const P=b*30+200;Ve(()=>{J([]),Mo(new Set),localStorage.removeItem(sa(Je)),Ie(!1)},P),Ve(()=>xe(!1),1500)},[Je,k,p,bt,w]),rl=C.useCallback(async()=>{const b=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Je,P=of(k,b,ce.outputDetail,gn);if(P){if($)try{await navigator.clipboard.writeText(P)}catch{}y==null||y(P),R(!0),Ve(()=>R(!1),2e3),ce.autoClearAfterCopy&&Ve(()=>nn(),500)}},[k,Je,ce.outputDetail,gn,ce.autoClearAfterCopy,nn,$,y]),_r=C.useCallback(async()=>{const b=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Je,P=of(k,b,ce.outputDetail,gn);if(!P)return;f&&f(P,k),ie("sending"),await new Promise(Q=>Ve(Q,150));const B=await bt("submit",{output:P,annotations:k},!0);ie(B?"sent":"failed"),Ve(()=>ie("idle"),2500),B&&ce.autoClearAfterCopy&&Ve(()=>nn(),500)},[f,bt,k,Je,ce.outputDetail,gn,ce.autoClearAfterCopy,nn]);C.useEffect(()=>{if(!ao)return;const b=10,P=Q=>{const G=Q.clientX-ao.x,q=Q.clientY-ao.y,he=Math.sqrt(G*G+q*q);if(!cn&&he>b&&Vl(!0),cn||he>b){let pe=ao.toolbarX+G,ke=ao.toolbarY+q;const Te=20,Ce=297,Pe=44,Ne=Ce-(g?Tt==="connected"?297:257:44),_e=Te-Ne,_t=window.innerWidth-Te-Ce;pe=Math.max(_e,Math.min(_t,pe)),ke=Math.max(Te,Math.min(window.innerHeight-Pe-Te,ke)),cr({x:pe,y:ke})}},B=()=>{cn&&(dr.current=!0),Vl(!1),lt(null)};return document.addEventListener("mousemove",P),document.addEventListener("mouseup",B),()=>{document.removeEventListener("mousemove",P),document.removeEventListener("mouseup",B)}},[ao,cn,g,Tt]);const gr=C.useCallback(b=>{if(b.target.closest("button")||b.target.closest(`.${S.settingsPanel}`))return;const P=b.currentTarget.parentElement;if(!P)return;const B=P.getBoundingClientRect(),Q=(Ze==null?void 0:Ze.x)??B.left,G=(Ze==null?void 0:Ze.y)??B.top,q=(Math.random()-.5)*10;qr(q),lt({x:b.clientX,y:b.clientY,toolbarX:Q,toolbarY:G})},[Ze]);if(C.useEffect(()=>{if(!Ze)return;const b=()=>{let G=Ze.x,q=Ze.y;const ke=20-(297-(g?Tt==="connected"?297:257:44)),Te=window.innerWidth-20-297;G=Math.max(ke,Math.min(Te,G)),q=Math.max(20,Math.min(window.innerHeight-44-20,q)),(G!==Ze.x||q!==Ze.y)&&cr({x:G,y:q})};return b(),window.addEventListener("resize",b),()=>window.removeEventListener("resize",b)},[Ze,g,Tt]),C.useEffect(()=>{const b=P=>{const B=P.target,Q=B.tagName==="INPUT"||B.tagName==="TEXTAREA"||B.isContentEditable;if(P.key==="Escape"){if(ut.length>0){Xn([]);return}M||g&&(Ct(),E(!1))}if((P.metaKey||P.ctrlKey)&&P.shiftKey&&(P.key==="f"||P.key==="F")){P.preventDefault(),Ct(),E(G=>!G);return}if(!(Q||P.metaKey||P.ctrlKey)&&((P.key==="p"||P.key==="P")&&(P.preventDefault(),Ct(),Fo()),(P.key==="h"||P.key==="H")&&k.length>0&&(P.preventDefault(),Ct(),le(G=>!G)),(P.key==="c"||P.key==="C")&&k.length>0&&(P.preventDefault(),Ct(),rl()),(P.key==="x"||P.key==="X")&&k.length>0&&(P.preventDefault(),Ct(),nn()),P.key==="s"||P.key==="S")){const G=Bn(ce.webhookUrl)||Bn(N||"");k.length>0&&G&&F==="idle"&&(P.preventDefault(),Ct(),_r())}};return document.addEventListener("keydown",b),()=>document.removeEventListener("keydown",b)},[g,M,k.length,ce.webhookUrl,N,F,_r,Fo,rl,nn,ut]),!nt||re)return null;const Kn=k.length>0,yr=k.filter(b=>!el.has(b.id)&&Eo(b)),co=k.filter(b=>el.has(b.id)),fo=b=>{const q=b.x/100*window.innerWidth,he=typeof b.y=="string"?parseFloat(b.y):b.y,pe={};window.innerHeight-he-22-10<80&&(pe.top="auto",pe.bottom="calc(100% + 10px)");const Te=q-200/2,Ce=10;if(Te<Ce){const Pe=Ce-Te;pe.left=`calc(50% + ${Pe}px)`}else if(Te+200>window.innerWidth-Ce){const Pe=Te+200-(window.innerWidth-Ce);pe.left=`calc(50% - ${Pe}px)`}return pe};return Vd.createPortal(l.jsxs("div",{ref:U,style:{display:"contents"},children:[l.jsx("div",{className:`${S.toolbar}${x?` ${x}`:""}`,"data-feedback-toolbar":!0,style:Ze?{left:Ze.x,top:Ze.y,right:"auto",bottom:"auto"}:void 0,children:l.jsxs("div",{className:`${S.toolbarContainer} ${Me?"":S.light} ${g?S.expanded:S.collapsed} ${ir?S.entrance:""} ${ue?S.hiding:""} ${cn?S.dragging:""} ${!ce.webhooksEnabled&&(Bn(ce.webhookUrl)||Bn(N||""))?S.serverConnected:""}`,onClick:g?void 0:b=>{if(dr.current){dr.current=!1,b.preventDefault();return}E(!0)},onMouseDown:gr,role:g?void 0:"button",tabIndex:g?-1:0,title:g?void 0:"Start feedback mode",style:{...cn&&{transform:`scale(1.05) rotate(${ca}deg)`,cursor:"grabbing"}},children:[l.jsxs("div",{className:`${S.toggleContent} ${g?S.hidden:S.visible}`,children:[l.jsx(xh,{size:24}),Kn&&l.jsx("span",{className:`${S.badge} ${g?S.fadeOut:""} ${ir?S.entrance:""}`,style:{backgroundColor:ce.annotationColor},children:k.length})]}),l.jsxs("div",{className:`${S.controlsContent} ${g?S.visible:S.hidden} ${Ze&&Ze.y<100?S.tooltipBelow:""} ${Gr||Po?S.tooltipsHidden:""} ${Un?S.tooltipsInSession:""}`,onMouseEnter:Ro,onMouseLeave:Zr,children:[l.jsxs("div",{className:`${S.buttonWrapper} ${Ze&&Ze.x<120?S.buttonWrapperAlignLeft:""}`,children:[l.jsx("button",{className:`${S.controlButton} ${Me?"":S.light}`,onClick:b=>{b.stopPropagation(),Ct(),Fo()},"data-active":Pt,children:l.jsx(kh,{size:24,isPaused:Pt})}),l.jsxs("span",{className:S.buttonTooltip,children:[Pt?"Resume animations":"Pause animations",l.jsx("span",{className:S.shortcut,children:"P"})]})]}),l.jsxs("div",{className:S.buttonWrapper,children:[l.jsx("button",{className:`${S.controlButton} ${Me?"":S.light}`,onClick:b=>{b.stopPropagation(),Ct(),le(!ne)},disabled:!Kn,children:l.jsx(wh,{size:24,isOpen:ne})}),l.jsxs("span",{className:S.buttonTooltip,children:[ne?"Hide markers":"Show markers",l.jsx("span",{className:S.shortcut,children:"H"})]})]}),l.jsxs("div",{className:S.buttonWrapper,children:[l.jsx("button",{className:`${S.controlButton} ${Me?"":S.light} ${V?S.statusShowing:""}`,onClick:b=>{b.stopPropagation(),Ct(),rl()},disabled:!Kn,"data-active":V,children:l.jsx(vh,{size:24,copied:V})}),l.jsxs("span",{className:S.buttonTooltip,children:["Copy feedback",l.jsx("span",{className:S.shortcut,children:"C"})]})]}),l.jsxs("div",{className:`${S.buttonWrapper} ${S.sendButtonWrapper} ${g&&!ce.webhooksEnabled&&(Bn(ce.webhookUrl)||Bn(N||""))?S.sendButtonVisible:""}`,children:[l.jsxs("button",{className:`${S.controlButton} ${Me?"":S.light} ${F==="sent"||F==="failed"?S.statusShowing:""}`,onClick:b=>{b.stopPropagation(),Ct(),_r()},disabled:!Kn||!Bn(ce.webhookUrl)&&!Bn(N||"")||F==="sending","data-no-hover":F==="sent"||F==="failed",tabIndex:Bn(ce.webhookUrl)||Bn(N||"")?0:-1,children:[l.jsx(bh,{size:24,state:F}),Kn&&F==="idle"&&l.jsx("span",{className:`${S.buttonBadge} ${Me?"":S.light}`,style:{backgroundColor:ce.annotationColor},children:k.length})]}),l.jsxs("span",{className:S.buttonTooltip,children:["Send Annotations",l.jsx("span",{className:S.shortcut,children:"S"})]})]}),l.jsxs("div",{className:S.buttonWrapper,children:[l.jsx("button",{className:`${S.controlButton} ${Me?"":S.light}`,onClick:b=>{b.stopPropagation(),Ct(),nn()},disabled:!Kn,"data-danger":!0,children:l.jsx(Sh,{size:24})}),l.jsxs("span",{className:S.buttonTooltip,children:["Clear all",l.jsx("span",{className:S.shortcut,children:"X"})]})]}),l.jsxs("div",{className:S.buttonWrapper,children:[l.jsx("button",{className:`${S.controlButton} ${Me?"":S.light}`,onClick:b=>{b.stopPropagation(),Ct(),lr(!Po)},children:l.jsx(Ch,{size:24})}),w&&Tt!=="disconnected"&&l.jsx("span",{className:`${S.mcpIndicator} ${Me?"":S.light} ${S[Tt]} ${Po?S.hidden:""}`,title:Tt==="connected"?"MCP Connected":"MCP Connecting..."}),l.jsx("span",{className:S.buttonTooltip,children:"Settings"})]}),l.jsx("div",{className:`${S.divider} ${Me?"":S.light}`}),l.jsxs("div",{className:`${S.buttonWrapper} ${Ze&&typeof window<"u"&&Ze.x>window.innerWidth-120?S.buttonWrapperAlignRight:""}`,children:[l.jsx("button",{className:`${S.controlButton} ${Me?"":S.light}`,onClick:b=>{b.stopPropagation(),Ct(),E(!1)},children:l.jsx(jh,{size:24})}),l.jsxs("span",{className:S.buttonTooltip,children:["Exit",l.jsx("span",{className:S.shortcut,children:"Esc"})]})]})]}),l.jsx("div",{className:`${S.settingsPanel} ${Me?S.dark:S.light} ${Bl?S.enter:S.exit}`,onClick:b=>b.stopPropagation(),style:Ze&&Ze.y<230?{bottom:"auto",top:"calc(100% + 0.5rem)"}:void 0,children:l.jsxs("div",{className:`${S.settingsPanelContainer} ${sr?S.transitioning:""}`,children:[l.jsxs("div",{className:`${S.settingsPage} ${To==="automations"?S.slideLeft:""}`,children:[l.jsxs("div",{className:S.settingsHeader,children:[l.jsxs("span",{className:S.settingsBrand,children:[l.jsx("span",{className:S.settingsBrandSlash,style:{color:ce.annotationColor,transition:"color 0.2s ease"},children:"/"}),"agentation"]}),l.jsxs("span",{className:S.settingsVersion,children:["v","2.3.1"]}),l.jsx("button",{className:S.themeToggle,onClick:()=>Io(!Me),title:Me?"Switch to light mode":"Switch to dark mode",children:l.jsx("span",{className:S.themeIconWrapper,children:l.jsx("span",{className:S.themeIcon,children:Me?l.jsx(Eh,{size:20}):l.jsx(Nh,{size:20})},Me?"sun":"moon")})})]}),l.jsxs("div",{className:S.settingsSection,children:[l.jsxs("div",{className:S.settingsRow,children:[l.jsxs("div",{className:`${S.settingsLabel} ${Me?"":S.light}`,children:["Output Detail",l.jsx(un,{content:"Controls how much detail is included in the copied output",children:l.jsx("span",{className:S.helpIcon,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("button",{className:`${S.cycleButton} ${Me?"":S.light}`,onClick:()=>{const P=(Ml.findIndex(B=>B.value===ce.outputDetail)+1)%Ml.length;Yt(B=>({...B,outputDetail:Ml[P].value}))},children:[l.jsx("span",{className:S.cycleButtonText,children:(Zn=Ml.find(b=>b.value===ce.outputDetail))==null?void 0:Zn.label},ce.outputDetail),l.jsx("span",{className:S.cycleDots,children:Ml.map((b,P)=>l.jsx("span",{className:`${S.cycleDot} ${Me?"":S.light} ${ce.outputDetail===b.value?S.active:""}`},b.value))})]})]}),l.jsxs("div",{className:`${S.settingsRow} ${S.settingsRowMarginTop} ${S.settingsRowDisabled}`,children:[l.jsxs("div",{className:`${S.settingsLabel} ${Me?"":S.light}`,children:["React Components",l.jsx(un,{content:"Disabled — production builds minify component names, making detection unreliable. Use in development mode.",children:l.jsx("span",{className:S.helpIcon,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("label",{className:`${S.toggleSwitch} ${S.disabled}`,children:[l.jsx("input",{type:"checkbox",checked:Ul,disabled:!Ul,onChange:()=>Yt(b=>({...b,reactEnabled:!b.reactEnabled}))}),l.jsx("span",{className:S.toggleSlider})]})]}),l.jsxs("div",{className:`${S.settingsRow} ${S.settingsRowMarginTop}`,children:[l.jsxs("div",{className:`${S.settingsLabel} ${Me?"":S.light}`,children:["Hide Until Restart",l.jsx(un,{content:"Hides the toolbar until you open a new tab",children:l.jsx("span",{className:S.helpIcon,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("label",{className:S.toggleSwitch,children:[l.jsx("input",{type:"checkbox",checked:!1,onChange:b=>{b.target.checked&&Kl()}}),l.jsx("span",{className:S.toggleSlider})]})]})]}),l.jsxs("div",{className:S.settingsSection,children:[l.jsx("div",{className:`${S.settingsLabel} ${S.settingsLabelMarker} ${Me?"":S.light}`,children:"Marker Colour"}),l.jsx("div",{className:S.colorOptions,children:v_.map(b=>l.jsx("div",{role:"button",onClick:()=>Yt(P=>({...P,annotationColor:b.value})),style:{borderColor:ce.annotationColor===b.value?b.value:"transparent"},className:`${S.colorOptionRing} ${ce.annotationColor===b.value?S.selected:""}`,children:l.jsx("div",{className:`${S.colorOption} ${ce.annotationColor===b.value?S.selected:""}`,style:{backgroundColor:b.value},title:b.label})},b.value))})]}),l.jsxs("div",{className:S.settingsSection,children:[l.jsxs("label",{className:S.settingsToggle,children:[l.jsx("input",{type:"checkbox",id:"autoClearAfterCopy",checked:ce.autoClearAfterCopy,onChange:b=>Yt(P=>({...P,autoClearAfterCopy:b.target.checked}))}),l.jsx("label",{className:`${S.customCheckbox} ${ce.autoClearAfterCopy?S.checked:""}`,htmlFor:"autoClearAfterCopy",children:ce.autoClearAfterCopy&&l.jsx(Xd,{size:14})}),l.jsxs("span",{className:`${S.toggleLabel} ${Me?"":S.light}`,children:["Clear on copy/send",l.jsx(un,{content:"Automatically clear annotations after copying",children:l.jsx("span",{className:`${S.helpIcon} ${S.helpIconNudge2}`,children:l.jsx(Ar,{size:20})})})]})]}),l.jsxs("label",{className:`${S.settingsToggle} ${S.settingsToggleMarginBottom}`,children:[l.jsx("input",{type:"checkbox",id:"blockInteractions",checked:ce.blockInteractions,onChange:b=>Yt(P=>({...P,blockInteractions:b.target.checked}))}),l.jsx("label",{className:`${S.customCheckbox} ${ce.blockInteractions?S.checked:""}`,htmlFor:"blockInteractions",children:ce.blockInteractions&&l.jsx(Xd,{size:14})}),l.jsx("span",{className:`${S.toggleLabel} ${Me?"":S.light}`,children:"Block page interactions"})]})]}),l.jsx("div",{className:`${S.settingsSection} ${S.settingsSectionExtraPadding}`,children:l.jsxs("button",{className:`${S.settingsNavLink} ${Me?"":S.light}`,onClick:()=>Lo("automations"),children:[l.jsx("span",{children:"Manage MCP & Webhooks"}),l.jsxs("span",{className:S.settingsNavLinkRight,children:[w&&Tt!=="disconnected"&&l.jsx("span",{className:`${S.mcpNavIndicator} ${S[Tt]}`}),l.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M7.5 12.5L12 8L7.5 3.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]})]})})]}),l.jsxs("div",{className:`${S.settingsPage} ${S.automationsPage} ${To==="automations"?S.slideIn:""}`,children:[l.jsxs("button",{className:`${S.settingsBackButton} ${Me?"":S.light}`,onClick:()=>Lo("main"),children:[l.jsx(Th,{size:16}),l.jsx("span",{children:"Manage MCP & Webhooks"})]}),l.jsxs("div",{className:S.settingsSection,children:[l.jsxs("div",{className:S.settingsRow,children:[l.jsxs("span",{className:`${S.automationHeader} ${Me?"":S.light}`,children:["MCP Connection",l.jsx(un,{content:"Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time.",children:l.jsx("span",{className:`${S.helpIcon} ${S.helpIconNudgeDown}`,children:l.jsx(Ar,{size:20})})})]}),w&&l.jsx("div",{className:`${S.mcpStatusDot} ${S[Tt]}`,title:Tt==="connected"?"Connected":Tt==="connecting"?"Connecting...":"Disconnected"})]}),l.jsxs("p",{className:`${S.automationDescription} ${Me?"":S.light}`,style:{paddingBottom:6},children:["MCP connection allows agents to receive and act on annotations."," ",l.jsx("a",{href:"https://agentation.dev/mcp",target:"_blank",rel:"noopener noreferrer",className:`${S.learnMoreLink} ${Me?"":S.light}`,children:"Learn more"})]})]}),l.jsxs("div",{className:`${S.settingsSection} ${S.settingsSectionGrow}`,children:[l.jsxs("div",{className:S.settingsRow,children:[l.jsxs("span",{className:`${S.automationHeader} ${Me?"":S.light}`,children:["Webhooks",l.jsx(un,{content:"Send annotation data to any URL endpoint when annotations change. Useful for custom integrations.",children:l.jsx("span",{className:`${S.helpIcon} ${S.helpIconNoNudge}`,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("div",{className:S.autoSendRow,children:[l.jsx("span",{className:`${S.autoSendLabel} ${Me?"":S.light} ${ce.webhooksEnabled?S.active:""}`,children:"Auto-Send"}),l.jsxs("label",{className:`${S.toggleSwitch} ${ce.webhookUrl?"":S.disabled}`,children:[l.jsx("input",{type:"checkbox",checked:ce.webhooksEnabled,disabled:!ce.webhookUrl,onChange:()=>Yt(b=>({...b,webhooksEnabled:!b.webhooksEnabled}))}),l.jsx("span",{className:S.toggleSlider})]})]})]}),l.jsx("p",{className:`${S.automationDescription} ${Me?"":S.light}`,children:"The webhook URL will receive live annotation changes and annotation data."}),l.jsx("textarea",{className:`${S.webhookUrlInput} ${Me?"":S.light}`,placeholder:"Webhook URL",value:ce.webhookUrl,style:{"--marker-color":ce.annotationColor},onKeyDown:b=>b.stopPropagation(),onChange:b=>Yt(P=>({...P,webhookUrl:b.target.value}))})]})]})]})})]})}),l.jsxs("div",{className:S.markersLayer,"data-feedback-toolbar":!0,children:[be&&yr.filter(b=>!b.isFixed).map((b,P)=>{const B=!fe&&$e===b.id,Q=tr===b.id,G=(B||Q)&&!De,q=b.isMultiSelect,he=q?"#34C759":ce.annotationColor,pe=k.findIndex(Pe=>Pe.id===b.id),ke=!$o.has(b.id),Te=fe?S.exit:we?S.clearing:ke?S.enter:"",Ce=G&&ce.markerClickBehavior==="delete";return l.jsxs("div",{className:`${S.marker} ${q?S.multiSelect:""} ${Te} ${Ce?S.hovered:""}`,"data-annotation-marker":!0,style:{left:`${b.x}%`,top:b.y,backgroundColor:Ce?void 0:he,animationDelay:fe?`${(yr.length-1-P)*20}ms`:`${P*20}ms`},onMouseEnter:()=>!fe&&b.id!==uo.current&&tn(b),onMouseLeave:()=>tn(null),onClick:Pe=>{Pe.stopPropagation(),fe||(ce.markerClickBehavior==="delete"?Gn(b.id):zn(b))},onContextMenu:Pe=>{ce.markerClickBehavior==="delete"&&(Pe.preventDefault(),Pe.stopPropagation(),fe||zn(b))},children:[G?Ce?l.jsx(Qi,{size:q?18:16}):l.jsx(Qd,{size:16}):l.jsx("span",{className:No!==null&&pe>=No?S.renumber:void 0,children:pe+1}),B&&!De&&l.jsxs("div",{className:`${S.markerTooltip} ${Me?"":S.light} ${S.enter}`,style:fo(b),children:[l.jsxs("span",{className:S.markerQuote,children:[b.element,b.selectedText&&` "${b.selectedText.slice(0,30)}${b.selectedText.length>30?"...":""}"`]}),l.jsx("span",{className:S.markerNote,children:b.comment})]})]},b.id)}),be&&!fe&&co.filter(b=>!b.isFixed).map(b=>{const P=b.isMultiSelect;return l.jsx("div",{className:`${S.marker} ${S.hovered} ${P?S.multiSelect:""} ${S.exit}`,"data-annotation-marker":!0,style:{left:`${b.x}%`,top:b.y},children:l.jsx(Qi,{size:P?12:10})},b.id)})]}),l.jsxs("div",{className:S.fixedMarkersLayer,"data-feedback-toolbar":!0,children:[be&&yr.filter(b=>b.isFixed).map((b,P)=>{const B=yr.filter(Se=>Se.isFixed),Q=!fe&&$e===b.id,G=tr===b.id,q=(Q||G)&&!De,he=b.isMultiSelect,pe=he?"#34C759":ce.annotationColor,ke=k.findIndex(Se=>Se.id===b.id),Te=!$o.has(b.id),Ce=fe?S.exit:we?S.clearing:Te?S.enter:"",Pe=q&&ce.markerClickBehavior==="delete";return l.jsxs("div",{className:`${S.marker} ${S.fixed} ${he?S.multiSelect:""} ${Ce} ${Pe?S.hovered:""}`,"data-annotation-marker":!0,style:{left:`${b.x}%`,top:b.y,backgroundColor:Pe?void 0:pe,animationDelay:fe?`${(B.length-1-P)*20}ms`:`${P*20}ms`},onMouseEnter:()=>!fe&&b.id!==uo.current&&tn(b),onMouseLeave:()=>tn(null),onClick:Se=>{Se.stopPropagation(),fe||(ce.markerClickBehavior==="delete"?Gn(b.id):zn(b))},onContextMenu:Se=>{ce.markerClickBehavior==="delete"&&(Se.preventDefault(),Se.stopPropagation(),fe||zn(b))},children:[q?Pe?l.jsx(Qi,{size:he?18:16}):l.jsx(Qd,{size:16}):l.jsx("span",{className:No!==null&&ke>=No?S.renumber:void 0,children:ke+1}),Q&&!De&&l.jsxs("div",{className:`${S.markerTooltip} ${Me?"":S.light} ${S.enter}`,style:fo(b),children:[l.jsxs("span",{className:S.markerQuote,children:[b.element,b.selectedText&&` "${b.selectedText.slice(0,30)}${b.selectedText.length>30?"...":""}"`]}),l.jsx("span",{className:S.markerNote,children:b.comment})]})]},b.id)}),be&&!fe&&co.filter(b=>b.isFixed).map(b=>{const P=b.isMultiSelect;return l.jsx("div",{className:`${S.marker} ${S.fixed} ${S.hovered} ${P?S.multiSelect:""} ${S.exit}`,"data-annotation-marker":!0,style:{left:`${b.x}%`,top:b.y},children:l.jsx(gh,{size:P?12:10})},b.id)})]}),g&&l.jsxs("div",{className:S.overlay,"data-feedback-toolbar":!0,style:M||De?{zIndex:99999}:void 0,children:[(ze==null?void 0:ze.rect)&&!M&&!Qr&&!yn&&l.jsx("div",{className:`${S.hoverHighlight} ${S.enter}`,style:{left:ze.rect.left,top:ze.rect.top,width:ze.rect.width,height:ze.rect.height,borderColor:`${ce.annotationColor}80`,backgroundColor:`${ce.annotationColor}0A`}}),ut.filter(b=>document.contains(b.element)).map((b,P)=>{const B=b.element.getBoundingClientRect(),Q=ut.length>1;return l.jsx("div",{className:Q?S.multiSelectOutline:S.singleSelectOutline,style:{position:"fixed",left:B.left,top:B.top,width:B.width,height:B.height,...Q?{}:{borderColor:`${ce.annotationColor}99`,backgroundColor:`${ce.annotationColor}0D`}}},P)}),$e&&!M&&(()=>{var G;const b=k.find(q=>q.id===$e);if(!(b!=null&&b.boundingBox))return null;if((G=b.elementBoundingBoxes)!=null&&G.length)return Ur.length>0?Ur.filter(q=>document.contains(q)).map((q,he)=>{const pe=q.getBoundingClientRect();return l.jsx("div",{className:`${S.multiSelectOutline} ${S.enter}`,style:{left:pe.left,top:pe.top,width:pe.width,height:pe.height}},`hover-outline-live-${he}`)}):b.elementBoundingBoxes.map((q,he)=>l.jsx("div",{className:`${S.multiSelectOutline} ${S.enter}`,style:{left:q.x,top:q.y-Tn,width:q.width,height:q.height}},`hover-outline-${he}`));const P=Nt&&document.contains(Nt)?Nt.getBoundingClientRect():null,B=P?{x:P.left,y:P.top,width:P.width,height:P.height}:{x:b.boundingBox.x,y:b.isFixed?b.boundingBox.y:b.boundingBox.y-Tn,width:b.boundingBox.width,height:b.boundingBox.height},Q=b.isMultiSelect;return l.jsx("div",{className:`${Q?S.multiSelectOutline:S.singleSelectOutline} ${S.enter}`,style:{left:B.x,top:B.y,width:B.width,height:B.height,...Q?{}:{borderColor:`${ce.annotationColor}99`,backgroundColor:`${ce.annotationColor}0D`}}})})(),ze&&!M&&!Qr&&!yn&&l.jsxs("div",{className:`${S.hoverTooltip} ${S.enter}`,style:{left:Math.max(8,Math.min(O.x,window.innerWidth-100)),top:Math.max(O.y-(ze.reactComponents?48:32),8)},children:[ze.reactComponents&&l.jsx("div",{className:S.hoverReactPath,children:ze.reactComponents}),l.jsx("div",{className:S.hoverElementName,children:ze.elementName})]}),M&&l.jsxs(l.Fragment,{children:[(Bo=M.multiSelectElements)!=null&&Bo.length?M.multiSelectElements.filter(b=>document.contains(b)).map((b,P)=>{const B=b.getBoundingClientRect();return l.jsx("div",{className:`${S.multiSelectOutline} ${$t?S.exit:S.enter}`,style:{left:B.left,top:B.top,width:B.width,height:B.height}},`pending-multi-${P}`)}):M.targetElement&&document.contains(M.targetElement)?(()=>{const b=M.targetElement.getBoundingClientRect();return l.jsx("div",{className:`${S.singleSelectOutline} ${$t?S.exit:S.enter}`,style:{left:b.left,top:b.top,width:b.width,height:b.height,borderColor:`${ce.annotationColor}99`,backgroundColor:`${ce.annotationColor}0D`}})})():M.boundingBox&&l.jsx("div",{className:`${M.isMultiSelect?S.multiSelectOutline:S.singleSelectOutline} ${$t?S.exit:S.enter}`,style:{left:M.boundingBox.x,top:M.boundingBox.y-Tn,width:M.boundingBox.width,height:M.boundingBox.height,...M.isMultiSelect?{}:{borderColor:`${ce.annotationColor}99`,backgroundColor:`${ce.annotationColor}0D`}}}),(()=>{const b=M.x,P=M.isFixed?M.y:M.y-Tn;return l.jsxs(l.Fragment,{children:[l.jsx("div",{className:`${S.marker} ${S.pending} ${M.isMultiSelect?S.multiSelect:""} ${$t?S.exit:S.enter}`,style:{left:`${b}%`,top:P,backgroundColor:M.isMultiSelect?"#34C759":ce.annotationColor},children:l.jsx(yh,{size:12})}),l.jsx(Kd,{ref:Gl,element:M.element,selectedText:M.selectedText,computedStyles:M.computedStylesObj,placeholder:M.element==="Area selection"?"What should change in this area?":M.isMultiSelect?"Feedback for this group of elements...":"What should change?",onSubmit:$n,onCancel:Mn,isExiting:$t,lightMode:!Me,accentColor:M.isMultiSelect?"#34C759":ce.annotationColor,style:{left:Math.max(160,Math.min(window.innerWidth-160,b/100*window.innerWidth)),...P>window.innerHeight-290?{bottom:window.innerHeight-P+20}:{top:P+20}}})]})})()]}),De&&l.jsxs(l.Fragment,{children:[(Jl=De.elementBoundingBoxes)!=null&&Jl.length?or.length>0?or.filter(b=>document.contains(b)).map((b,P)=>{const B=b.getBoundingClientRect();return l.jsx("div",{className:`${S.multiSelectOutline} ${S.enter}`,style:{left:B.left,top:B.top,width:B.width,height:B.height}},`edit-multi-live-${P}`)}):De.elementBoundingBoxes.map((b,P)=>l.jsx("div",{className:`${S.multiSelectOutline} ${S.enter}`,style:{left:b.x,top:b.y-Tn,width:b.width,height:b.height}},`edit-multi-${P}`)):(()=>{const b=Hn&&document.contains(Hn)?Hn.getBoundingClientRect():null,P=b?{x:b.left,y:b.top,width:b.width,height:b.height}:De.boundingBox?{x:De.boundingBox.x,y:De.isFixed?De.boundingBox.y:De.boundingBox.y-Tn,width:De.boundingBox.width,height:De.boundingBox.height}:null;return P?l.jsx("div",{className:`${De.isMultiSelect?S.multiSelectOutline:S.singleSelectOutline} ${S.enter}`,style:{left:P.x,top:P.y,width:P.width,height:P.height,...De.isMultiSelect?{}:{borderColor:`${ce.annotationColor}99`,backgroundColor:`${ce.annotationColor}0D`}}}):null})(),l.jsx(Kd,{ref:pr,element:De.element,selectedText:De.selectedText,computedStyles:Bh(De.computedStyles),placeholder:"Edit your feedback...",initialValue:De.comment,submitLabel:"Save",onSubmit:da,onCancel:Zl,onDelete:()=>Gn(De.id),isExiting:en,lightMode:!Me,accentColor:De.isMultiSelect?"#34C759":ce.annotationColor,style:(()=>{const b=De.isFixed?De.y:De.y-Tn;return{left:Math.max(160,Math.min(window.innerWidth-160,De.x/100*window.innerWidth)),...b>window.innerHeight-290?{bottom:window.innerHeight-b+20}:{top:b+20}}})()})]}),yn&&l.jsxs(l.Fragment,{children:[l.jsx("div",{ref:vn,className:S.dragSelection}),l.jsx("div",{ref:In,className:S.highlightsContainer})]})]})]}),document.body)}function w_(){const r=X(v=>v.config),a=X(v=>v.isPanoramic),i=X(v=>v.initScreens),c=X(v=>v.setPreviewSize),m=X(v=>v.setFonts),h=X(v=>v.setFrames),p=X(v=>v.setDeviceFamilies),y=X(v=>v.setKoubouAvailable),f=X(v=>v.setSizes),$=X(v=>v.setExportSize),w=X(v=>v.activeTab),T=X(v=>v.undo),_=X(v=>v.redo),[N,x]=C.useState(null),g=typeof window<"u"?window.innerWidth<768:!1,E=typeof window<"u"?new URLSearchParams(window.location.search).get("agentation")==="1"||window.localStorage.getItem("appframe:agentation")==="1":!1,[k,J]=C.useState(g),[ne,le]=C.useState(!g),[re,ae]=C.useState(E);if(C.useEffect(()=>{const v=U=>{var fe;if(!(U.metaKey||U.ctrlKey)||U.key.toLowerCase()!=="z")return;const K=(fe=U.target)==null?void 0:fe.tagName;K==="INPUT"||K==="TEXTAREA"||K==="SELECT"||(U.preventDefault(),U.shiftKey?_():T())};return window.addEventListener("keydown",v),()=>window.removeEventListener("keydown",v)},[T,_]),C.useEffect(()=>{async function v(){try{const[U,be,K]=await Promise.all([cf(),gp(),_p()]),fe=U.app.platforms[0]??"iphone",Oe=uu(fe);c(Oe.w,Oe.h),m(be),h(K),i(U,fe);try{const Le=(await yp()).families;p(Le),y(!0)}catch{y(!1)}try{const ze=await xp(),Le={};for(const[W,M]of Object.entries(ze))Le[W]=M;f(Le);const O=ia(Le,fe);O&&$(O)}catch{}}catch(U){x(U instanceof Error?U.message:"Failed to load config")}}v()},[i,c,m,h,p,y,f,$]),C.useEffect(()=>{const v=()=>{const U=window.innerWidth<768;J(U),U||le(!0)};return v(),window.addEventListener("resize",v),()=>window.removeEventListener("resize",v)},[]),C.useEffect(()=>{window.localStorage.setItem("appframe:agentation",re?"1":"0")},[re]),N)return l.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-red-400",children:l.jsx("p",{children:N})});if(!r)return l.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-text-dim",children:l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsxs("svg",{className:"animate-spin h-4 w-4 text-accent",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[l.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),l.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"})]}),"Loading..."]})});const ue=a?l.jsxs(l.Fragment,{children:[w==="background"&&l.jsx(sh,{}),w==="device"&&l.jsx(ah,{}),w==="text"&&l.jsx(ih,{}),w==="extras"&&l.jsx(uh,{}),w==="export"&&l.jsx(Yd,{})]}):l.jsxs(l.Fragment,{children:[w==="background"&&l.jsx(Np,{}),w==="device"&&l.jsx(Ap,{}),w==="text"&&l.jsx(Hp,{}),w==="extras"&&l.jsx(Vp,{}),w==="export"&&l.jsx(Yd,{})]});return l.jsxs("div",{className:"h-dvh flex flex-col overflow-hidden",children:[l.jsx(kp,{sidebarOpen:ne,onToggleSidebar:()=>le(v=>!v),showSidebarToggle:k,agentMode:re,onToggleAgentMode:()=>ae(v=>!v)}),l.jsxs("div",{className:"flex-1 flex overflow-hidden min-h-0 flex-col md:flex-row",children:[l.jsx("div",{id:"editor-sidebar",className:`${ne?"flex":"hidden"} md:flex w-full md:w-80 md:min-w-80 max-h-[45vh] md:max-h-none bg-surface border-b md:border-b-0 md:border-r border-border flex-col shrink-0`,children:l.jsx("div",{className:"flex-1 overflow-y-auto",children:ue})}),a?l.jsx(ph,{}):l.jsx(fh,{})]}),re&&l.jsx(b_,{endpoint:"http://localhost:4747"})]})}const Cf=document.getElementById("root");if(!Cf)throw new Error("Root element not found");Zm.createRoot(Cf).render(l.jsx(C.StrictMode,{children:l.jsx(w_,{})}));
