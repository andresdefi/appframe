(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const p of document.querySelectorAll('link[rel="modulepreload"]'))c(p);new MutationObserver(p=>{for(const h of p)if(h.type==="childList")for(const m of h.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&c(m)}).observe(document,{childList:!0,subtree:!0});function a(p){const h={};return p.integrity&&(h.integrity=p.integrity),p.referrerPolicy&&(h.referrerPolicy=p.referrerPolicy),p.crossOrigin==="use-credentials"?h.credentials="include":p.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function c(p){if(p.ep)return;p.ep=!0;const h=a(p);fetch(p.href,h)}})();function rf(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var za={exports:{}},Pl={},Oa={exports:{}},We={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xd;function Ym(){if(xd)return We;xd=1;var r=Symbol.for("react.element"),i=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),c=Symbol.for("react.strict_mode"),p=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),m=Symbol.for("react.context"),x=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),$=Symbol.for("react.memo"),k=Symbol.for("react.lazy"),P=Symbol.iterator;function g(L){return L===null||typeof L!="object"?null:(L=P&&L[P]||L["@@iterator"],typeof L=="function"?L:null)}var E={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},b=Object.assign,_={};function y(L,D,ae){this.props=L,this.context=D,this.refs=_,this.updater=ae||E}y.prototype.isReactComponent={},y.prototype.setState=function(L,D){if(typeof L!="object"&&typeof L!="function"&&L!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,L,D,"setState")},y.prototype.forceUpdate=function(L){this.updater.enqueueForceUpdate(this,L,"forceUpdate")};function R(){}R.prototype=y.prototype;function ee(L,D,ae){this.props=L,this.context=D,this.refs=_,this.updater=ae||E}var ne=ee.prototype=new R;ne.constructor=ee,b(ne,y.prototype),ne.isPureReactComponent=!0;var se=Array.isArray,re=Object.prototype.hasOwnProperty,ie={current:null},ue={key:!0,ref:!0,__self:!0,__source:!0};function v(L,D,ae){var we,H={},ve=null,Ie=null;if(D!=null)for(we in D.ref!==void 0&&(Ie=D.ref),D.key!==void 0&&(ve=""+D.key),D)re.call(D,we)&&!ue.hasOwnProperty(we)&&(H[we]=D[we]);var Te=arguments.length-2;if(Te===1)H.children=ae;else if(1<Te){for(var Ue=Array(Te),Nt=0;Nt<Te;Nt++)Ue[Nt]=arguments[Nt+2];H.children=Ue}if(L&&L.defaultProps)for(we in Te=L.defaultProps,Te)H[we]===void 0&&(H[we]=Te[we]);return{$$typeof:r,type:L,key:ve,ref:Ie,props:H,_owner:ie.current}}function G(L,D){return{$$typeof:r,type:L.type,key:D,ref:L.ref,props:L.props,_owner:L._owner}}function fe(L){return typeof L=="object"&&L!==null&&L.$$typeof===r}function Z(L){var D={"=":"=0",":":"=2"};return"$"+L.replace(/[=:]/g,function(ae){return D[ae]})}var de=/\/+/g;function Me(L,D){return typeof L=="object"&&L!==null&&L.key!=null?Z(""+L.key):D.toString(36)}function Oe(L,D,ae,we,H){var ve=typeof L;(ve==="undefined"||ve==="boolean")&&(L=null);var Ie=!1;if(L===null)Ie=!0;else switch(ve){case"string":case"number":Ie=!0;break;case"object":switch(L.$$typeof){case r:case i:Ie=!0}}if(Ie)return Ie=L,H=H(Ie),L=we===""?"."+Me(Ie,0):we,se(H)?(ae="",L!=null&&(ae=L.replace(de,"$&/")+"/"),Oe(H,D,ae,"",function(Nt){return Nt})):H!=null&&(fe(H)&&(H=G(H,ae+(!H.key||Ie&&Ie.key===H.key?"":(""+H.key).replace(de,"$&/")+"/")+L)),D.push(H)),1;if(Ie=0,we=we===""?".":we+":",se(L))for(var Te=0;Te<L.length;Te++){ve=L[Te];var Ue=we+Me(ve,Te);Ie+=Oe(ve,D,ae,Ue,H)}else if(Ue=g(L),typeof Ue=="function")for(L=Ue.call(L),Te=0;!(ve=L.next()).done;)ve=ve.value,Ue=we+Me(ve,Te++),Ie+=Oe(ve,D,ae,Ue,H);else if(ve==="object")throw D=String(L),Error("Objects are not valid as a React child (found: "+(D==="[object Object]"?"object with keys {"+Object.keys(L).join(", ")+"}":D)+"). If you meant to render a collection of children, use an array instead.");return Ie}function ze(L,D,ae){if(L==null)return L;var we=[],H=0;return Oe(L,we,"","",function(ve){return D.call(ae,ve,H++)}),we}function O(L){if(L._status===-1){var D=L._result;D=D(),D.then(function(ae){(L._status===0||L._status===-1)&&(L._status=1,L._result=ae)},function(ae){(L._status===0||L._status===-1)&&(L._status=2,L._result=ae)}),L._status===-1&&(L._status=0,L._result=D)}if(L._status===1)return L._result.default;throw L._result}var W={current:null},M={transition:null},Y={ReactCurrentDispatcher:W,ReactCurrentBatchConfig:M,ReactCurrentOwner:ie};function U(){throw Error("act(...) is not supported in production builds of React.")}return We.Children={map:ze,forEach:function(L,D,ae){ze(L,function(){D.apply(this,arguments)},ae)},count:function(L){var D=0;return ze(L,function(){D++}),D},toArray:function(L){return ze(L,function(D){return D})||[]},only:function(L){if(!fe(L))throw Error("React.Children.only expected to receive a single React element child.");return L}},We.Component=y,We.Fragment=a,We.Profiler=p,We.PureComponent=ee,We.StrictMode=c,We.Suspense=f,We.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Y,We.act=U,We.cloneElement=function(L,D,ae){if(L==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+L+".");var we=b({},L.props),H=L.key,ve=L.ref,Ie=L._owner;if(D!=null){if(D.ref!==void 0&&(ve=D.ref,Ie=ie.current),D.key!==void 0&&(H=""+D.key),L.type&&L.type.defaultProps)var Te=L.type.defaultProps;for(Ue in D)re.call(D,Ue)&&!ue.hasOwnProperty(Ue)&&(we[Ue]=D[Ue]===void 0&&Te!==void 0?Te[Ue]:D[Ue])}var Ue=arguments.length-2;if(Ue===1)we.children=ae;else if(1<Ue){Te=Array(Ue);for(var Nt=0;Nt<Ue;Nt++)Te[Nt]=arguments[Nt+2];we.children=Te}return{$$typeof:r,type:L.type,key:H,ref:ve,props:we,_owner:Ie}},We.createContext=function(L){return L={$$typeof:m,_currentValue:L,_currentValue2:L,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},L.Provider={$$typeof:h,_context:L},L.Consumer=L},We.createElement=v,We.createFactory=function(L){var D=v.bind(null,L);return D.type=L,D},We.createRef=function(){return{current:null}},We.forwardRef=function(L){return{$$typeof:x,render:L}},We.isValidElement=fe,We.lazy=function(L){return{$$typeof:k,_payload:{_status:-1,_result:L},_init:O}},We.memo=function(L,D){return{$$typeof:$,type:L,compare:D===void 0?null:D}},We.startTransition=function(L){var D=M.transition;M.transition={};try{L()}finally{M.transition=D}},We.unstable_act=U,We.useCallback=function(L,D){return W.current.useCallback(L,D)},We.useContext=function(L){return W.current.useContext(L)},We.useDebugValue=function(){},We.useDeferredValue=function(L){return W.current.useDeferredValue(L)},We.useEffect=function(L,D){return W.current.useEffect(L,D)},We.useId=function(){return W.current.useId()},We.useImperativeHandle=function(L,D,ae){return W.current.useImperativeHandle(L,D,ae)},We.useInsertionEffect=function(L,D){return W.current.useInsertionEffect(L,D)},We.useLayoutEffect=function(L,D){return W.current.useLayoutEffect(L,D)},We.useMemo=function(L,D){return W.current.useMemo(L,D)},We.useReducer=function(L,D,ae){return W.current.useReducer(L,D,ae)},We.useRef=function(L){return W.current.useRef(L)},We.useState=function(L){return W.current.useState(L)},We.useSyncExternalStore=function(L,D,ae){return W.current.useSyncExternalStore(L,D,ae)},We.useTransition=function(){return W.current.useTransition()},We.version="18.3.1",We}var vd;function Al(){return vd||(vd=1,Oa.exports=Ym()),Oa.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bd;function Hm(){if(bd)return Pl;bd=1;var r=Al(),i=Symbol.for("react.element"),a=Symbol.for("react.fragment"),c=Object.prototype.hasOwnProperty,p=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function m(x,f,$){var k,P={},g=null,E=null;$!==void 0&&(g=""+$),f.key!==void 0&&(g=""+f.key),f.ref!==void 0&&(E=f.ref);for(k in f)c.call(f,k)&&!h.hasOwnProperty(k)&&(P[k]=f[k]);if(x&&x.defaultProps)for(k in f=x.defaultProps,f)P[k]===void 0&&(P[k]=f[k]);return{$$typeof:i,type:x,key:g,ref:E,props:P,_owner:p.current}}return Pl.Fragment=a,Pl.jsx=m,Pl.jsxs=m,Pl}var wd;function Um(){return wd||(wd=1,za.exports=Hm()),za.exports}var l=Um(),C=Al();const lf=rf(C);var Xs={},Fa={exports:{}},Zt={},Da={exports:{}},Aa={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var kd;function Vm(){return kd||(kd=1,(function(r){function i(M,Y){var U=M.length;M.push(Y);e:for(;0<U;){var L=U-1>>>1,D=M[L];if(0<p(D,Y))M[L]=Y,M[U]=D,U=L;else break e}}function a(M){return M.length===0?null:M[0]}function c(M){if(M.length===0)return null;var Y=M[0],U=M.pop();if(U!==Y){M[0]=U;e:for(var L=0,D=M.length,ae=D>>>1;L<ae;){var we=2*(L+1)-1,H=M[we],ve=we+1,Ie=M[ve];if(0>p(H,U))ve<D&&0>p(Ie,H)?(M[L]=Ie,M[ve]=U,L=ve):(M[L]=H,M[we]=U,L=we);else if(ve<D&&0>p(Ie,U))M[L]=Ie,M[ve]=U,L=ve;else break e}}return Y}function p(M,Y){var U=M.sortIndex-Y.sortIndex;return U!==0?U:M.id-Y.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;r.unstable_now=function(){return h.now()}}else{var m=Date,x=m.now();r.unstable_now=function(){return m.now()-x}}var f=[],$=[],k=1,P=null,g=3,E=!1,b=!1,_=!1,y=typeof setTimeout=="function"?setTimeout:null,R=typeof clearTimeout=="function"?clearTimeout:null,ee=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ne(M){for(var Y=a($);Y!==null;){if(Y.callback===null)c($);else if(Y.startTime<=M)c($),Y.sortIndex=Y.expirationTime,i(f,Y);else break;Y=a($)}}function se(M){if(_=!1,ne(M),!b)if(a(f)!==null)b=!0,O(re);else{var Y=a($);Y!==null&&W(se,Y.startTime-M)}}function re(M,Y){b=!1,_&&(_=!1,R(v),v=-1),E=!0;var U=g;try{for(ne(Y),P=a(f);P!==null&&(!(P.expirationTime>Y)||M&&!Z());){var L=P.callback;if(typeof L=="function"){P.callback=null,g=P.priorityLevel;var D=L(P.expirationTime<=Y);Y=r.unstable_now(),typeof D=="function"?P.callback=D:P===a(f)&&c(f),ne(Y)}else c(f);P=a(f)}if(P!==null)var ae=!0;else{var we=a($);we!==null&&W(se,we.startTime-Y),ae=!1}return ae}finally{P=null,g=U,E=!1}}var ie=!1,ue=null,v=-1,G=5,fe=-1;function Z(){return!(r.unstable_now()-fe<G)}function de(){if(ue!==null){var M=r.unstable_now();fe=M;var Y=!0;try{Y=ue(!0,M)}finally{Y?Me():(ie=!1,ue=null)}}else ie=!1}var Me;if(typeof ee=="function")Me=function(){ee(de)};else if(typeof MessageChannel<"u"){var Oe=new MessageChannel,ze=Oe.port2;Oe.port1.onmessage=de,Me=function(){ze.postMessage(null)}}else Me=function(){y(de,0)};function O(M){ue=M,ie||(ie=!0,Me())}function W(M,Y){v=y(function(){M(r.unstable_now())},Y)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(M){M.callback=null},r.unstable_continueExecution=function(){b||E||(b=!0,O(re))},r.unstable_forceFrameRate=function(M){0>M||125<M?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):G=0<M?Math.floor(1e3/M):5},r.unstable_getCurrentPriorityLevel=function(){return g},r.unstable_getFirstCallbackNode=function(){return a(f)},r.unstable_next=function(M){switch(g){case 1:case 2:case 3:var Y=3;break;default:Y=g}var U=g;g=Y;try{return M()}finally{g=U}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(M,Y){switch(M){case 1:case 2:case 3:case 4:case 5:break;default:M=3}var U=g;g=M;try{return Y()}finally{g=U}},r.unstable_scheduleCallback=function(M,Y,U){var L=r.unstable_now();switch(typeof U=="object"&&U!==null?(U=U.delay,U=typeof U=="number"&&0<U?L+U:L):U=L,M){case 1:var D=-1;break;case 2:D=250;break;case 5:D=1073741823;break;case 4:D=1e4;break;default:D=5e3}return D=U+D,M={id:k++,callback:Y,priorityLevel:M,startTime:U,expirationTime:D,sortIndex:-1},U>L?(M.sortIndex=U,i($,M),a(f)===null&&M===a($)&&(_?(R(v),v=-1):_=!0,W(se,U-L))):(M.sortIndex=D,i(f,M),b||E||(b=!0,O(re))),M},r.unstable_shouldYield=Z,r.unstable_wrapCallback=function(M){var Y=g;return function(){var U=g;g=Y;try{return M.apply(this,arguments)}finally{g=U}}}})(Aa)),Aa}var Cd;function Xm(){return Cd||(Cd=1,Da.exports=Vm()),Da.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sd;function Qm(){if(Sd)return Zt;Sd=1;var r=Al(),i=Xm();function a(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var c=new Set,p={};function h(e,t){m(e,t),m(e+"Capture",t)}function m(e,t){for(p[e]=t,e=0;e<t.length;e++)c.add(t[e])}var x=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),f=Object.prototype.hasOwnProperty,$=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,k={},P={};function g(e){return f.call(P,e)?!0:f.call(k,e)?!1:$.test(e)?P[e]=!0:(k[e]=!0,!1)}function E(e,t,n,o){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function b(e,t,n,o){if(t===null||typeof t>"u"||E(e,t,n,o))return!0;if(o)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function _(e,t,n,o,s,u,d){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=s,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=u,this.removeEmptyString=d}var y={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){y[e]=new _(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];y[t]=new _(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){y[e]=new _(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){y[e]=new _(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){y[e]=new _(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){y[e]=new _(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){y[e]=new _(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){y[e]=new _(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){y[e]=new _(e,5,!1,e.toLowerCase(),null,!1,!1)});var R=/[\-:]([a-z])/g;function ee(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(R,ee);y[t]=new _(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(R,ee);y[t]=new _(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(R,ee);y[t]=new _(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){y[e]=new _(e,1,!1,e.toLowerCase(),null,!1,!1)}),y.xlinkHref=new _("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){y[e]=new _(e,1,!1,e.toLowerCase(),null,!0,!0)});function ne(e,t,n,o){var s=y.hasOwnProperty(t)?y[t]:null;(s!==null?s.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(b(t,n,s,o)&&(n=null),o||s===null?g(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):s.mustUseProperty?e[s.propertyName]=n===null?s.type===3?!1:"":n:(t=s.attributeName,o=s.attributeNamespace,n===null?e.removeAttribute(t):(s=s.type,n=s===3||s===4&&n===!0?"":""+n,o?e.setAttributeNS(o,t,n):e.setAttribute(t,n))))}var se=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,re=Symbol.for("react.element"),ie=Symbol.for("react.portal"),ue=Symbol.for("react.fragment"),v=Symbol.for("react.strict_mode"),G=Symbol.for("react.profiler"),fe=Symbol.for("react.provider"),Z=Symbol.for("react.context"),de=Symbol.for("react.forward_ref"),Me=Symbol.for("react.suspense"),Oe=Symbol.for("react.suspense_list"),ze=Symbol.for("react.memo"),O=Symbol.for("react.lazy"),W=Symbol.for("react.offscreen"),M=Symbol.iterator;function Y(e){return e===null||typeof e!="object"?null:(e=M&&e[M]||e["@@iterator"],typeof e=="function"?e:null)}var U=Object.assign,L;function D(e){if(L===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);L=t&&t[1]||""}return`
`+L+e}var ae=!1;function we(e,t){if(!e||ae)return"";ae=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(A){var o=A}Reflect.construct(e,[],t)}else{try{t.call()}catch(A){o=A}e.call(t.prototype)}else{try{throw Error()}catch(A){o=A}e()}}catch(A){if(A&&o&&typeof A.stack=="string"){for(var s=A.stack.split(`
`),u=o.stack.split(`
`),d=s.length-1,j=u.length-1;1<=d&&0<=j&&s[d]!==u[j];)j--;for(;1<=d&&0<=j;d--,j--)if(s[d]!==u[j]){if(d!==1||j!==1)do if(d--,j--,0>j||s[d]!==u[j]){var T=`
`+s[d].replace(" at new "," at ");return e.displayName&&T.includes("<anonymous>")&&(T=T.replace("<anonymous>",e.displayName)),T}while(1<=d&&0<=j);break}}}finally{ae=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?D(e):""}function H(e){switch(e.tag){case 5:return D(e.type);case 16:return D("Lazy");case 13:return D("Suspense");case 19:return D("SuspenseList");case 0:case 2:case 15:return e=we(e.type,!1),e;case 11:return e=we(e.type.render,!1),e;case 1:return e=we(e.type,!0),e;default:return""}}function ve(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ue:return"Fragment";case ie:return"Portal";case G:return"Profiler";case v:return"StrictMode";case Me:return"Suspense";case Oe:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Z:return(e.displayName||"Context")+".Consumer";case fe:return(e._context.displayName||"Context")+".Provider";case de:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ze:return t=e.displayName||null,t!==null?t:ve(e.type)||"Memo";case O:t=e._payload,e=e._init;try{return ve(e(t))}catch{}}return null}function Ie(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ve(t);case 8:return t===v?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Te(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ue(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Nt(e){var t=Ue(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var s=n.get,u=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(d){o=""+d,u.call(this,d)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return o},setValue:function(d){o=""+d},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function an(e){e._valueTracker||(e._valueTracker=Nt(e))}function Ur(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=Ue(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}function En(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function tr(e,t){var n=t.checked;return U({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Vr(e,t){var n=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;n=Te(t.value!=null?t.value:n),e._wrapperState={initialChecked:o,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function No(e,t){t=t.checked,t!=null&&ne(e,"checked",t,!1)}function nr(e,t){No(e,t);var n=Te(t.value),o=t.type;if(n!=null)o==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Yn(e,t.type,n):t.hasOwnProperty("defaultValue")&&Yn(e,t.type,Te(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Fe(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Yn(e,t,n){(t!=="number"||En(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Hn=Array.isArray;function It(e,t,n,o){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&o&&(e[n].defaultSelected=!0)}else{for(n=""+Te(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,o&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function or(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(a(91));return U({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Nn(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(a(92));if(Hn(n)){if(1<n.length)throw Error(a(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Te(n)}}function Pn(e,t){var n=Te(t.value),o=Te(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),o!=null&&(e.defaultValue=""+o)}function Xr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Qr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function rr(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Qr(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var nt,Bl=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,o,s){MSApp.execUnsafeLocalFunction(function(){return e(t,n,o,s)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(nt=nt||document.createElement("div"),nt.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=nt.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Pt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var so={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Po=["Webkit","ms","Moz","O"];Object.keys(so).forEach(function(e){Po.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),so[t]=so[e]})});function lr(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||so.hasOwnProperty(e)&&so[e]?(""+t).trim():t+"px"}function Wl(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var o=n.indexOf("--")===0,s=lr(n,t[n],o);n==="float"&&(n="cssFloat"),o?e.setProperty(n,s):e[n]=s}}var Yl=U({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function To(e,t){if(t){if(Yl[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(a(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(a(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(a(61))}if(t.style!=null&&typeof t.style!="object")throw Error(a(62))}}function Lo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var sr=null;function ir(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Gr=null,Tn=null,Un=null;function Kr(e){if(e=pl(e)){if(typeof Gr!="function")throw Error(a(280));var t=e.stateNode;t&&(t=as(t),Gr(e.stateNode,e.type,t))}}function Vn(e){Tn?Un?Un.push(e):Un=[e]:Tn=e}function ut(){if(Tn){var e=Tn,t=Un;if(Un=Tn=null,Kr(e),t)for(e=0;e<t.length;e++)Kr(t[e])}}function Xn(e,t){return e(t)}function qt(){}var Ct=!1;function Hl(e,t,n){if(Ct)return e(t,n);Ct=!0;try{return Xn(e,t,n)}finally{Ct=!1,(Tn!==null||Un!==null)&&(qt(),ut())}}function Ro(e,t){var n=e.stateNode;if(n===null)return null;var o=as(n);if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(a(231,t,typeof n));return n}var Zr=!1;if(x)try{var un={};Object.defineProperty(un,"passive",{get:function(){Zr=!0}}),window.addEventListener("test",un,un),window.removeEventListener("test",un,un)}catch{Zr=!1}function ce(e,t,n,o,s,u,d,j,T){var A=Array.prototype.slice.call(arguments,3);try{t.apply(n,A)}catch(te){this.onError(te)}}var Yt=!1,$e=null,Io=!1,ar=null,Ul={onError:function(e){Yt=!0,$e=e}};function Vl(e,t,n,o,s,u,d,j,T){Yt=!1,$e=null,ce.apply(Ul,arguments)}function gn(e,t,n,o,s,u,d,j,T){if(Vl.apply(this,arguments),Yt){if(Yt){var A=$e;Yt=!1,$e=null}else throw Error(a(198));Io||(Io=!0,ar=A)}}function pt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function ur(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Jr(e){if(pt(e)!==e)throw Error(a(188))}function Tt(e){var t=e.alternate;if(!t){if(t=pt(e),t===null)throw Error(a(188));return t!==e?null:e}for(var n=e,o=t;;){var s=n.return;if(s===null)break;var u=s.alternate;if(u===null){if(o=s.return,o!==null){n=o;continue}break}if(s.child===u.child){for(u=s.child;u;){if(u===n)return Jr(s),e;if(u===o)return Jr(s),t;u=u.sibling}throw Error(a(188))}if(n.return!==o.return)n=s,o=u;else{for(var d=!1,j=s.child;j;){if(j===n){d=!0,n=s,o=u;break}if(j===o){d=!0,o=s,n=u;break}j=j.sibling}if(!d){for(j=u.child;j;){if(j===n){d=!0,n=u,o=s;break}if(j===o){d=!0,o=u,n=s;break}j=j.sibling}if(!d)throw Error(a(189))}}if(n.alternate!==o)throw Error(a(190))}if(n.tag!==3)throw Error(a(188));return n.stateNode.current===n?e:t}function Ln(e){return e=Tt(e),e!==null?Ze(e):null}function Ze(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ze(e);if(t!==null)return t;e=e.sibling}return null}var cr=i.unstable_scheduleCallback,cn=i.unstable_cancelCallback,Xl=i.unstable_shouldYield,io=i.unstable_requestPaint,lt=i.unstable_now,di=i.unstable_getCurrentPriorityLevel,qr=i.unstable_ImmediatePriority,dr=i.unstable_UserBlockingPriority,$o=i.unstable_NormalPriority,Mo=i.unstable_LowPriority,el=i.unstable_IdlePriority,Qn=null,$t=null;function fr(e){if($t&&typeof $t.onCommitFiberRoot=="function")try{$t.onCommitFiberRoot(Qn,e,void 0,(e.current.flags&128)===128)}catch{}}var en=Math.clz32?Math.clz32:Ql,ao=Math.log,yn=Math.LN2;function Ql(e){return e>>>=0,e===0?32:31-(ao(e)/yn|0)|0}var xn=64,At=4194304;function vn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Rn(e,t){var n=e.pendingLanes;if(n===0)return 0;var o=0,s=e.suspendedLanes,u=e.pingedLanes,d=n&268435455;if(d!==0){var j=d&~s;j!==0?o=vn(j):(u&=d,u!==0&&(o=vn(u)))}else d=n&~s,d!==0?o=vn(d):u!==0&&(o=vn(u));if(o===0)return 0;if(t!==0&&t!==o&&(t&s)===0&&(s=o&-o,u=t&-t,s>=u||s===16&&(u&4194240)!==0))return t;if((o&4)!==0&&(o|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)n=31-en(t),s=1<<n,o|=e[n],t&=~s;return o}function mr(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Gl(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,s=e.expirationTimes,u=e.pendingLanes;0<u;){var d=31-en(u),j=1<<d,T=s[d];T===-1?((j&n)===0||(j&o)!==0)&&(s[d]=mr(j,t)):T<=t&&(e.expiredLanes|=j),u&=~j}}function uo(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function tl(){var e=xn;return xn<<=1,(xn&4194240)===0&&(xn=64),e}function zo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Oo(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-en(t),e[t]=n}function Kl(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<n;){var s=31-en(n),u=1<<s;t[s]=0,o[s]=-1,e[s]=-1,n&=~u}}function pr(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-en(n),s=1<<o;s&t|e[o]&t&&(e[o]|=t),n&=~s}}var He=0;function Je(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var nl,hr,Zl,ol,Fo,Do=!1,Ao=[],bt=null,In=null,$n=null,Gn=new Map,Mn=new Map,tn=[],fi="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Jl(e,t){switch(e){case"focusin":case"focusout":bt=null;break;case"dragenter":case"dragleave":In=null;break;case"mouseover":case"mouseout":$n=null;break;case"pointerover":case"pointerout":Gn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Mn.delete(t.pointerId)}}function nn(e,t,n,o,s,u){return e===null||e.nativeEvent!==u?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:u,targetContainers:[s]},t!==null&&(t=pl(t),t!==null&&hr(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function rl(e,t,n,o,s){switch(t){case"focusin":return bt=nn(bt,e,t,n,o,s),!0;case"dragenter":return In=nn(In,e,t,n,o,s),!0;case"mouseover":return $n=nn($n,e,t,n,o,s),!0;case"pointerover":var u=s.pointerId;return Gn.set(u,nn(Gn.get(u)||null,e,t,n,o,s)),!0;case"gotpointercapture":return u=s.pointerId,Mn.set(u,nn(Mn.get(u)||null,e,t,n,o,s)),!0}return!1}function _r(e){var t=Wo(e.target);if(t!==null){var n=pt(t);if(n!==null){if(t=n.tag,t===13){if(t=ur(n),t!==null){e.blockedOn=t,Fo(e.priority,function(){Zl(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function gr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=X(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);sr=o,n.target.dispatchEvent(o),sr=null}else return t=pl(n),t!==null&&hr(t),e.blockedOn=n,!1;t.shift()}return!0}function Kn(e,t,n){gr(e)&&n.delete(t)}function yr(){Do=!1,bt!==null&&gr(bt)&&(bt=null),In!==null&&gr(In)&&(In=null),$n!==null&&gr($n)&&($n=null),Gn.forEach(Kn),Mn.forEach(Kn)}function co(e,t){e.blockedOn===t&&(e.blockedOn=null,Do||(Do=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,yr)))}function fo(e){function t(s){return co(s,e)}if(0<Ao.length){co(Ao[0],e);for(var n=1;n<Ao.length;n++){var o=Ao[n];o.blockedOn===e&&(o.blockedOn=null)}}for(bt!==null&&co(bt,e),In!==null&&co(In,e),$n!==null&&co($n,e),Gn.forEach(t),Mn.forEach(t),n=0;n<tn.length;n++)o=tn[n],o.blockedOn===e&&(o.blockedOn=null);for(;0<tn.length&&(n=tn[0],n.blockedOn===null);)_r(n),n.blockedOn===null&&tn.shift()}var Zn=se.ReactCurrentBatchConfig,Bo=!0;function ql(e,t,n,o){var s=He,u=Zn.transition;Zn.transition=null;try{He=1,N(e,t,n,o)}finally{He=s,Zn.transition=u}}function w(e,t,n,o){var s=He,u=Zn.transition;Zn.transition=null;try{He=4,N(e,t,n,o)}finally{He=s,Zn.transition=u}}function N(e,t,n,o){if(Bo){var s=X(e,t,n,o);if(s===null)ji(e,t,o,B,n),Jl(e,o);else if(rl(s,e,t,n,o))o.stopPropagation();else if(Jl(e,o),t&4&&-1<fi.indexOf(e)){for(;s!==null;){var u=pl(s);if(u!==null&&nl(u),u=X(e,t,n,o),u===null&&ji(e,t,o,B,n),u===s)break;s=u}s!==null&&o.stopPropagation()}else ji(e,t,o,null,n)}}var B=null;function X(e,t,n,o){if(B=null,e=ir(o),e=Wo(e),e!==null)if(t=pt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=ur(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return B=e,null}function Q(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(di()){case qr:return 1;case dr:return 4;case $o:case Mo:return 16;case el:return 536870912;default:return 16}default:return 16}}var J=null,_e=null,he=null;function ke(){if(he)return he;var e,t=_e,n=t.length,o,s="value"in J?J.value:J.textContent,u=s.length;for(e=0;e<n&&t[e]===s[e];e++);var d=n-e;for(o=1;o<=d&&t[n-o]===s[u-o];o++);return he=s.slice(e,1<o?1-o:void 0)}function Le(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ce(){return!0}function Pe(){return!1}function Se(e){function t(n,o,s,u,d){this._reactName=n,this._targetInst=s,this.type=o,this.nativeEvent=u,this.target=d,this.currentTarget=null;for(var j in e)e.hasOwnProperty(j)&&(n=e[j],this[j]=n?n(u):u[j]);return this.isDefaultPrevented=(u.defaultPrevented!=null?u.defaultPrevented:u.returnValue===!1)?Ce:Pe,this.isPropagationStopped=Pe,this}return U(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ce)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ce)},persist:function(){},isPersistent:Ce}),t}var Ne={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ge=Se(Ne),_t=U({},Ne,{view:0,detail:0}),gt=Se(_t),on,st,ft,Ae=U({},_t,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:hi,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ft&&(ft&&e.type==="mousemove"?(on=e.screenX-ft.screenX,st=e.screenY-ft.screenY):st=on=0,ft=e),on)},movementY:function(e){return"movementY"in e?e.movementY:st}}),Be=Se(Ae),Mt=U({},Ae,{dataTransfer:0}),it=Se(Mt),Ht=U({},_t,{relatedTarget:0}),Ut=Se(Ht),xr=U({},Ne,{animationName:0,elapsedTime:0,pseudoElement:0}),mi=Se(xr),es=U({},Ne,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),pi=Se(es),Cf=U({},Ne,{data:0}),uu=Se(Cf),Sf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},jf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ef={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Nf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Ef[e])?!!t[e]:!1}function hi(){return Nf}var Pf=U({},_t,{key:function(e){if(e.key){var t=Sf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Le(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?jf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:hi,charCode:function(e){return e.type==="keypress"?Le(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Le(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Tf=Se(Pf),Lf=U({},Ae,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),cu=Se(Lf),Rf=U({},_t,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:hi}),If=Se(Rf),$f=U({},Ne,{propertyName:0,elapsedTime:0,pseudoElement:0}),Mf=Se($f),zf=U({},Ae,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Of=Se(zf),Ff=[9,13,27,32],_i=x&&"CompositionEvent"in window,ll=null;x&&"documentMode"in document&&(ll=document.documentMode);var Df=x&&"TextEvent"in window&&!ll,du=x&&(!_i||ll&&8<ll&&11>=ll),fu=" ",mu=!1;function pu(e,t){switch(e){case"keyup":return Ff.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function hu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var vr=!1;function Af(e,t){switch(e){case"compositionend":return hu(t);case"keypress":return t.which!==32?null:(mu=!0,fu);case"textInput":return e=t.data,e===fu&&mu?null:e;default:return null}}function Bf(e,t){if(vr)return e==="compositionend"||!_i&&pu(e,t)?(e=ke(),he=_e=J=null,vr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return du&&t.locale!=="ko"?null:t.data;default:return null}}var Wf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function _u(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Wf[e.type]:t==="textarea"}function gu(e,t,n,o){Vn(o),t=ls(t,"onChange"),0<t.length&&(n=new ge("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var sl=null,il=null;function Yf(e){Mu(e,0)}function ts(e){var t=Sr(e);if(Ur(t))return e}function Hf(e,t){if(e==="change")return t}var yu=!1;if(x){var gi;if(x){var yi="oninput"in document;if(!yi){var xu=document.createElement("div");xu.setAttribute("oninput","return;"),yi=typeof xu.oninput=="function"}gi=yi}else gi=!1;yu=gi&&(!document.documentMode||9<document.documentMode)}function vu(){sl&&(sl.detachEvent("onpropertychange",bu),il=sl=null)}function bu(e){if(e.propertyName==="value"&&ts(il)){var t=[];gu(t,il,e,ir(e)),Hl(Yf,t)}}function Uf(e,t,n){e==="focusin"?(vu(),sl=t,il=n,sl.attachEvent("onpropertychange",bu)):e==="focusout"&&vu()}function Vf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ts(il)}function Xf(e,t){if(e==="click")return ts(t)}function Qf(e,t){if(e==="input"||e==="change")return ts(t)}function Gf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var bn=typeof Object.is=="function"?Object.is:Gf;function al(e,t){if(bn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var s=n[o];if(!f.call(t,s)||!bn(e[s],t[s]))return!1}return!0}function wu(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function ku(e,t){var n=wu(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=wu(n)}}function Cu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Cu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Su(){for(var e=window,t=En();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=En(e.document)}return t}function xi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Kf(e){var t=Su(),n=e.focusedElem,o=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Cu(n.ownerDocument.documentElement,n)){if(o!==null&&xi(n)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var s=n.textContent.length,u=Math.min(o.start,s);o=o.end===void 0?u:Math.min(o.end,s),!e.extend&&u>o&&(s=o,o=u,u=s),s=ku(n,u);var d=ku(n,o);s&&d&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==d.node||e.focusOffset!==d.offset)&&(t=t.createRange(),t.setStart(s.node,s.offset),e.removeAllRanges(),u>o?(e.addRange(t),e.extend(d.node,d.offset)):(t.setEnd(d.node,d.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Zf=x&&"documentMode"in document&&11>=document.documentMode,br=null,vi=null,ul=null,bi=!1;function ju(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;bi||br==null||br!==En(o)||(o=br,"selectionStart"in o&&xi(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),ul&&al(ul,o)||(ul=o,o=ls(vi,"onSelect"),0<o.length&&(t=new ge("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=br)))}function ns(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var wr={animationend:ns("Animation","AnimationEnd"),animationiteration:ns("Animation","AnimationIteration"),animationstart:ns("Animation","AnimationStart"),transitionend:ns("Transition","TransitionEnd")},wi={},Eu={};x&&(Eu=document.createElement("div").style,"AnimationEvent"in window||(delete wr.animationend.animation,delete wr.animationiteration.animation,delete wr.animationstart.animation),"TransitionEvent"in window||delete wr.transitionend.transition);function os(e){if(wi[e])return wi[e];if(!wr[e])return e;var t=wr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Eu)return wi[e]=t[n];return e}var Nu=os("animationend"),Pu=os("animationiteration"),Tu=os("animationstart"),Lu=os("transitionend"),Ru=new Map,Iu="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function mo(e,t){Ru.set(e,t),h(t,[e])}for(var ki=0;ki<Iu.length;ki++){var Ci=Iu[ki],Jf=Ci.toLowerCase(),qf=Ci[0].toUpperCase()+Ci.slice(1);mo(Jf,"on"+qf)}mo(Nu,"onAnimationEnd"),mo(Pu,"onAnimationIteration"),mo(Tu,"onAnimationStart"),mo("dblclick","onDoubleClick"),mo("focusin","onFocus"),mo("focusout","onBlur"),mo(Lu,"onTransitionEnd"),m("onMouseEnter",["mouseout","mouseover"]),m("onMouseLeave",["mouseout","mouseover"]),m("onPointerEnter",["pointerout","pointerover"]),m("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var cl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),em=new Set("cancel close invalid load scroll toggle".split(" ").concat(cl));function $u(e,t,n){var o=e.type||"unknown-event";e.currentTarget=n,gn(o,t,void 0,e),e.currentTarget=null}function Mu(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],s=o.event;o=o.listeners;e:{var u=void 0;if(t)for(var d=o.length-1;0<=d;d--){var j=o[d],T=j.instance,A=j.currentTarget;if(j=j.listener,T!==u&&s.isPropagationStopped())break e;$u(s,j,A),u=T}else for(d=0;d<o.length;d++){if(j=o[d],T=j.instance,A=j.currentTarget,j=j.listener,T!==u&&s.isPropagationStopped())break e;$u(s,j,A),u=T}}}if(Io)throw e=ar,Io=!1,ar=null,e}function ot(e,t){var n=t[Ri];n===void 0&&(n=t[Ri]=new Set);var o=e+"__bubble";n.has(o)||(zu(t,e,2,!1),n.add(o))}function Si(e,t,n){var o=0;t&&(o|=4),zu(n,e,o,t)}var rs="_reactListening"+Math.random().toString(36).slice(2);function dl(e){if(!e[rs]){e[rs]=!0,c.forEach(function(n){n!=="selectionchange"&&(em.has(n)||Si(n,!1,e),Si(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[rs]||(t[rs]=!0,Si("selectionchange",!1,t))}}function zu(e,t,n,o){switch(Q(t)){case 1:var s=ql;break;case 4:s=w;break;default:s=N}n=s.bind(null,t,n,e),s=void 0,!Zr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),o?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function ji(e,t,n,o,s){var u=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var d=o.tag;if(d===3||d===4){var j=o.stateNode.containerInfo;if(j===s||j.nodeType===8&&j.parentNode===s)break;if(d===4)for(d=o.return;d!==null;){var T=d.tag;if((T===3||T===4)&&(T=d.stateNode.containerInfo,T===s||T.nodeType===8&&T.parentNode===s))return;d=d.return}for(;j!==null;){if(d=Wo(j),d===null)return;if(T=d.tag,T===5||T===6){o=u=d;continue e}j=j.parentNode}}o=o.return}Hl(function(){var A=u,te=ir(n),oe=[];e:{var q=Ru.get(e);if(q!==void 0){var me=ge,ye=e;switch(e){case"keypress":if(Le(n)===0)break e;case"keydown":case"keyup":me=Tf;break;case"focusin":ye="focus",me=Ut;break;case"focusout":ye="blur",me=Ut;break;case"beforeblur":case"afterblur":me=Ut;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":me=Be;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":me=it;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":me=If;break;case Nu:case Pu:case Tu:me=mi;break;case Lu:me=Mf;break;case"scroll":me=gt;break;case"wheel":me=Of;break;case"copy":case"cut":case"paste":me=pi;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":me=cu}var xe=(t&4)!==0,ht=!xe&&e==="scroll",z=xe?q!==null?q+"Capture":null:q;xe=[];for(var I=A,F;I!==null;){F=I;var le=F.stateNode;if(F.tag===5&&le!==null&&(F=le,z!==null&&(le=Ro(I,z),le!=null&&xe.push(fl(I,le,F)))),ht)break;I=I.return}0<xe.length&&(q=new me(q,ye,null,n,te),oe.push({event:q,listeners:xe}))}}if((t&7)===0){e:{if(q=e==="mouseover"||e==="pointerover",me=e==="mouseout"||e==="pointerout",q&&n!==sr&&(ye=n.relatedTarget||n.fromElement)&&(Wo(ye)||ye[Jn]))break e;if((me||q)&&(q=te.window===te?te:(q=te.ownerDocument)?q.defaultView||q.parentWindow:window,me?(ye=n.relatedTarget||n.toElement,me=A,ye=ye?Wo(ye):null,ye!==null&&(ht=pt(ye),ye!==ht||ye.tag!==5&&ye.tag!==6)&&(ye=null)):(me=null,ye=A),me!==ye)){if(xe=Be,le="onMouseLeave",z="onMouseEnter",I="mouse",(e==="pointerout"||e==="pointerover")&&(xe=cu,le="onPointerLeave",z="onPointerEnter",I="pointer"),ht=me==null?q:Sr(me),F=ye==null?q:Sr(ye),q=new xe(le,I+"leave",me,n,te),q.target=ht,q.relatedTarget=F,le=null,Wo(te)===A&&(xe=new xe(z,I+"enter",ye,n,te),xe.target=F,xe.relatedTarget=ht,le=xe),ht=le,me&&ye)t:{for(xe=me,z=ye,I=0,F=xe;F;F=kr(F))I++;for(F=0,le=z;le;le=kr(le))F++;for(;0<I-F;)xe=kr(xe),I--;for(;0<F-I;)z=kr(z),F--;for(;I--;){if(xe===z||z!==null&&xe===z.alternate)break t;xe=kr(xe),z=kr(z)}xe=null}else xe=null;me!==null&&Ou(oe,q,me,xe,!1),ye!==null&&ht!==null&&Ou(oe,ht,ye,xe,!0)}}e:{if(q=A?Sr(A):window,me=q.nodeName&&q.nodeName.toLowerCase(),me==="select"||me==="input"&&q.type==="file")var be=Hf;else if(_u(q))if(yu)be=Qf;else{be=Vf;var je=Uf}else(me=q.nodeName)&&me.toLowerCase()==="input"&&(q.type==="checkbox"||q.type==="radio")&&(be=Xf);if(be&&(be=be(e,A))){gu(oe,be,n,te);break e}je&&je(e,q,A),e==="focusout"&&(je=q._wrapperState)&&je.controlled&&q.type==="number"&&Yn(q,"number",q.value)}switch(je=A?Sr(A):window,e){case"focusin":(_u(je)||je.contentEditable==="true")&&(br=je,vi=A,ul=null);break;case"focusout":ul=vi=br=null;break;case"mousedown":bi=!0;break;case"contextmenu":case"mouseup":case"dragend":bi=!1,ju(oe,n,te);break;case"selectionchange":if(Zf)break;case"keydown":case"keyup":ju(oe,n,te)}var Ee;if(_i)e:{switch(e){case"compositionstart":var Re="onCompositionStart";break e;case"compositionend":Re="onCompositionEnd";break e;case"compositionupdate":Re="onCompositionUpdate";break e}Re=void 0}else vr?pu(e,n)&&(Re="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(Re="onCompositionStart");Re&&(du&&n.locale!=="ko"&&(vr||Re!=="onCompositionStart"?Re==="onCompositionEnd"&&vr&&(Ee=ke()):(J=te,_e="value"in J?J.value:J.textContent,vr=!0)),je=ls(A,Re),0<je.length&&(Re=new uu(Re,e,null,n,te),oe.push({event:Re,listeners:je}),Ee?Re.data=Ee:(Ee=hu(n),Ee!==null&&(Re.data=Ee)))),(Ee=Df?Af(e,n):Bf(e,n))&&(A=ls(A,"onBeforeInput"),0<A.length&&(te=new uu("onBeforeInput","beforeinput",null,n,te),oe.push({event:te,listeners:A}),te.data=Ee))}Mu(oe,t)})}function fl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ls(e,t){for(var n=t+"Capture",o=[];e!==null;){var s=e,u=s.stateNode;s.tag===5&&u!==null&&(s=u,u=Ro(e,n),u!=null&&o.unshift(fl(e,u,s)),u=Ro(e,t),u!=null&&o.push(fl(e,u,s))),e=e.return}return o}function kr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Ou(e,t,n,o,s){for(var u=t._reactName,d=[];n!==null&&n!==o;){var j=n,T=j.alternate,A=j.stateNode;if(T!==null&&T===o)break;j.tag===5&&A!==null&&(j=A,s?(T=Ro(n,u),T!=null&&d.unshift(fl(n,T,j))):s||(T=Ro(n,u),T!=null&&d.push(fl(n,T,j)))),n=n.return}d.length!==0&&e.push({event:t,listeners:d})}var tm=/\r\n?/g,nm=/\u0000|\uFFFD/g;function Fu(e){return(typeof e=="string"?e:""+e).replace(tm,`
`).replace(nm,"")}function ss(e,t,n){if(t=Fu(t),Fu(e)!==t&&n)throw Error(a(425))}function is(){}var Ei=null,Ni=null;function Pi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ti=typeof setTimeout=="function"?setTimeout:void 0,om=typeof clearTimeout=="function"?clearTimeout:void 0,Du=typeof Promise=="function"?Promise:void 0,rm=typeof queueMicrotask=="function"?queueMicrotask:typeof Du<"u"?function(e){return Du.resolve(null).then(e).catch(lm)}:Ti;function lm(e){setTimeout(function(){throw e})}function Li(e,t){var n=t,o=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(o===0){e.removeChild(s),fo(t);return}o--}else n!=="$"&&n!=="$?"&&n!=="$!"||o++;n=s}while(n);fo(t)}function po(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Au(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Cr=Math.random().toString(36).slice(2),zn="__reactFiber$"+Cr,ml="__reactProps$"+Cr,Jn="__reactContainer$"+Cr,Ri="__reactEvents$"+Cr,sm="__reactListeners$"+Cr,im="__reactHandles$"+Cr;function Wo(e){var t=e[zn];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Jn]||n[zn]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Au(e);e!==null;){if(n=e[zn])return n;e=Au(e)}return t}e=n,n=e.parentNode}return null}function pl(e){return e=e[zn]||e[Jn],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Sr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(a(33))}function as(e){return e[ml]||null}var Ii=[],jr=-1;function ho(e){return{current:e}}function rt(e){0>jr||(e.current=Ii[jr],Ii[jr]=null,jr--)}function tt(e,t){jr++,Ii[jr]=e.current,e.current=t}var _o={},zt=ho(_o),Vt=ho(!1),Yo=_o;function Er(e,t){var n=e.type.contextTypes;if(!n)return _o;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var s={},u;for(u in n)s[u]=t[u];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=s),s}function Xt(e){return e=e.childContextTypes,e!=null}function us(){rt(Vt),rt(zt)}function Bu(e,t,n){if(zt.current!==_o)throw Error(a(168));tt(zt,t),tt(Vt,n)}function Wu(e,t,n){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return n;o=o.getChildContext();for(var s in o)if(!(s in t))throw Error(a(108,Ie(e)||"Unknown",s));return U({},n,o)}function cs(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||_o,Yo=zt.current,tt(zt,e),tt(Vt,Vt.current),!0}function Yu(e,t,n){var o=e.stateNode;if(!o)throw Error(a(169));n?(e=Wu(e,t,Yo),o.__reactInternalMemoizedMergedChildContext=e,rt(Vt),rt(zt),tt(zt,e)):rt(Vt),tt(Vt,n)}var qn=null,ds=!1,$i=!1;function Hu(e){qn===null?qn=[e]:qn.push(e)}function am(e){ds=!0,Hu(e)}function go(){if(!$i&&qn!==null){$i=!0;var e=0,t=He;try{var n=qn;for(He=1;e<n.length;e++){var o=n[e];do o=o(!0);while(o!==null)}qn=null,ds=!1}catch(s){throw qn!==null&&(qn=qn.slice(e+1)),cr(qr,go),s}finally{He=t,$i=!1}}return null}var Nr=[],Pr=0,fs=null,ms=0,dn=[],fn=0,Ho=null,eo=1,to="";function Uo(e,t){Nr[Pr++]=ms,Nr[Pr++]=fs,fs=e,ms=t}function Uu(e,t,n){dn[fn++]=eo,dn[fn++]=to,dn[fn++]=Ho,Ho=e;var o=eo;e=to;var s=32-en(o)-1;o&=~(1<<s),n+=1;var u=32-en(t)+s;if(30<u){var d=s-s%5;u=(o&(1<<d)-1).toString(32),o>>=d,s-=d,eo=1<<32-en(t)+s|n<<s|o,to=u+e}else eo=1<<u|n<<s|o,to=e}function Mi(e){e.return!==null&&(Uo(e,1),Uu(e,1,0))}function zi(e){for(;e===fs;)fs=Nr[--Pr],Nr[Pr]=null,ms=Nr[--Pr],Nr[Pr]=null;for(;e===Ho;)Ho=dn[--fn],dn[fn]=null,to=dn[--fn],dn[fn]=null,eo=dn[--fn],dn[fn]=null}var rn=null,ln=null,at=!1,wn=null;function Vu(e,t){var n=_n(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Xu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,rn=e,ln=po(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,rn=e,ln=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Ho!==null?{id:eo,overflow:to}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=_n(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,rn=e,ln=null,!0):!1;default:return!1}}function Oi(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Fi(e){if(at){var t=ln;if(t){var n=t;if(!Xu(e,t)){if(Oi(e))throw Error(a(418));t=po(n.nextSibling);var o=rn;t&&Xu(e,t)?Vu(o,n):(e.flags=e.flags&-4097|2,at=!1,rn=e)}}else{if(Oi(e))throw Error(a(418));e.flags=e.flags&-4097|2,at=!1,rn=e}}}function Qu(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;rn=e}function ps(e){if(e!==rn)return!1;if(!at)return Qu(e),at=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Pi(e.type,e.memoizedProps)),t&&(t=ln)){if(Oi(e))throw Gu(),Error(a(418));for(;t;)Vu(e,t),t=po(t.nextSibling)}if(Qu(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(a(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ln=po(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ln=null}}else ln=rn?po(e.stateNode.nextSibling):null;return!0}function Gu(){for(var e=ln;e;)e=po(e.nextSibling)}function Tr(){ln=rn=null,at=!1}function Di(e){wn===null?wn=[e]:wn.push(e)}var um=se.ReactCurrentBatchConfig;function hl(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(a(309));var o=n.stateNode}if(!o)throw Error(a(147,e));var s=o,u=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===u?t.ref:(t=function(d){var j=s.refs;d===null?delete j[u]:j[u]=d},t._stringRef=u,t)}if(typeof e!="string")throw Error(a(284));if(!n._owner)throw Error(a(290,e))}return e}function hs(e,t){throw e=Object.prototype.toString.call(t),Error(a(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Ku(e){var t=e._init;return t(e._payload)}function Zu(e){function t(z,I){if(e){var F=z.deletions;F===null?(z.deletions=[I],z.flags|=16):F.push(I)}}function n(z,I){if(!e)return null;for(;I!==null;)t(z,I),I=I.sibling;return null}function o(z,I){for(z=new Map;I!==null;)I.key!==null?z.set(I.key,I):z.set(I.index,I),I=I.sibling;return z}function s(z,I){return z=So(z,I),z.index=0,z.sibling=null,z}function u(z,I,F){return z.index=F,e?(F=z.alternate,F!==null?(F=F.index,F<I?(z.flags|=2,I):F):(z.flags|=2,I)):(z.flags|=1048576,I)}function d(z){return e&&z.alternate===null&&(z.flags|=2),z}function j(z,I,F,le){return I===null||I.tag!==6?(I=Ta(F,z.mode,le),I.return=z,I):(I=s(I,F),I.return=z,I)}function T(z,I,F,le){var be=F.type;return be===ue?te(z,I,F.props.children,le,F.key):I!==null&&(I.elementType===be||typeof be=="object"&&be!==null&&be.$$typeof===O&&Ku(be)===I.type)?(le=s(I,F.props),le.ref=hl(z,I,F),le.return=z,le):(le=Ds(F.type,F.key,F.props,null,z.mode,le),le.ref=hl(z,I,F),le.return=z,le)}function A(z,I,F,le){return I===null||I.tag!==4||I.stateNode.containerInfo!==F.containerInfo||I.stateNode.implementation!==F.implementation?(I=La(F,z.mode,le),I.return=z,I):(I=s(I,F.children||[]),I.return=z,I)}function te(z,I,F,le,be){return I===null||I.tag!==7?(I=qo(F,z.mode,le,be),I.return=z,I):(I=s(I,F),I.return=z,I)}function oe(z,I,F){if(typeof I=="string"&&I!==""||typeof I=="number")return I=Ta(""+I,z.mode,F),I.return=z,I;if(typeof I=="object"&&I!==null){switch(I.$$typeof){case re:return F=Ds(I.type,I.key,I.props,null,z.mode,F),F.ref=hl(z,null,I),F.return=z,F;case ie:return I=La(I,z.mode,F),I.return=z,I;case O:var le=I._init;return oe(z,le(I._payload),F)}if(Hn(I)||Y(I))return I=qo(I,z.mode,F,null),I.return=z,I;hs(z,I)}return null}function q(z,I,F,le){var be=I!==null?I.key:null;if(typeof F=="string"&&F!==""||typeof F=="number")return be!==null?null:j(z,I,""+F,le);if(typeof F=="object"&&F!==null){switch(F.$$typeof){case re:return F.key===be?T(z,I,F,le):null;case ie:return F.key===be?A(z,I,F,le):null;case O:return be=F._init,q(z,I,be(F._payload),le)}if(Hn(F)||Y(F))return be!==null?null:te(z,I,F,le,null);hs(z,F)}return null}function me(z,I,F,le,be){if(typeof le=="string"&&le!==""||typeof le=="number")return z=z.get(F)||null,j(I,z,""+le,be);if(typeof le=="object"&&le!==null){switch(le.$$typeof){case re:return z=z.get(le.key===null?F:le.key)||null,T(I,z,le,be);case ie:return z=z.get(le.key===null?F:le.key)||null,A(I,z,le,be);case O:var je=le._init;return me(z,I,F,je(le._payload),be)}if(Hn(le)||Y(le))return z=z.get(F)||null,te(I,z,le,be,null);hs(I,le)}return null}function ye(z,I,F,le){for(var be=null,je=null,Ee=I,Re=I=0,Et=null;Ee!==null&&Re<F.length;Re++){Ee.index>Re?(Et=Ee,Ee=null):Et=Ee.sibling;var Qe=q(z,Ee,F[Re],le);if(Qe===null){Ee===null&&(Ee=Et);break}e&&Ee&&Qe.alternate===null&&t(z,Ee),I=u(Qe,I,Re),je===null?be=Qe:je.sibling=Qe,je=Qe,Ee=Et}if(Re===F.length)return n(z,Ee),at&&Uo(z,Re),be;if(Ee===null){for(;Re<F.length;Re++)Ee=oe(z,F[Re],le),Ee!==null&&(I=u(Ee,I,Re),je===null?be=Ee:je.sibling=Ee,je=Ee);return at&&Uo(z,Re),be}for(Ee=o(z,Ee);Re<F.length;Re++)Et=me(Ee,z,Re,F[Re],le),Et!==null&&(e&&Et.alternate!==null&&Ee.delete(Et.key===null?Re:Et.key),I=u(Et,I,Re),je===null?be=Et:je.sibling=Et,je=Et);return e&&Ee.forEach(function(jo){return t(z,jo)}),at&&Uo(z,Re),be}function xe(z,I,F,le){var be=Y(F);if(typeof be!="function")throw Error(a(150));if(F=be.call(F),F==null)throw Error(a(151));for(var je=be=null,Ee=I,Re=I=0,Et=null,Qe=F.next();Ee!==null&&!Qe.done;Re++,Qe=F.next()){Ee.index>Re?(Et=Ee,Ee=null):Et=Ee.sibling;var jo=q(z,Ee,Qe.value,le);if(jo===null){Ee===null&&(Ee=Et);break}e&&Ee&&jo.alternate===null&&t(z,Ee),I=u(jo,I,Re),je===null?be=jo:je.sibling=jo,je=jo,Ee=Et}if(Qe.done)return n(z,Ee),at&&Uo(z,Re),be;if(Ee===null){for(;!Qe.done;Re++,Qe=F.next())Qe=oe(z,Qe.value,le),Qe!==null&&(I=u(Qe,I,Re),je===null?be=Qe:je.sibling=Qe,je=Qe);return at&&Uo(z,Re),be}for(Ee=o(z,Ee);!Qe.done;Re++,Qe=F.next())Qe=me(Ee,z,Re,Qe.value,le),Qe!==null&&(e&&Qe.alternate!==null&&Ee.delete(Qe.key===null?Re:Qe.key),I=u(Qe,I,Re),je===null?be=Qe:je.sibling=Qe,je=Qe);return e&&Ee.forEach(function(Wm){return t(z,Wm)}),at&&Uo(z,Re),be}function ht(z,I,F,le){if(typeof F=="object"&&F!==null&&F.type===ue&&F.key===null&&(F=F.props.children),typeof F=="object"&&F!==null){switch(F.$$typeof){case re:e:{for(var be=F.key,je=I;je!==null;){if(je.key===be){if(be=F.type,be===ue){if(je.tag===7){n(z,je.sibling),I=s(je,F.props.children),I.return=z,z=I;break e}}else if(je.elementType===be||typeof be=="object"&&be!==null&&be.$$typeof===O&&Ku(be)===je.type){n(z,je.sibling),I=s(je,F.props),I.ref=hl(z,je,F),I.return=z,z=I;break e}n(z,je);break}else t(z,je);je=je.sibling}F.type===ue?(I=qo(F.props.children,z.mode,le,F.key),I.return=z,z=I):(le=Ds(F.type,F.key,F.props,null,z.mode,le),le.ref=hl(z,I,F),le.return=z,z=le)}return d(z);case ie:e:{for(je=F.key;I!==null;){if(I.key===je)if(I.tag===4&&I.stateNode.containerInfo===F.containerInfo&&I.stateNode.implementation===F.implementation){n(z,I.sibling),I=s(I,F.children||[]),I.return=z,z=I;break e}else{n(z,I);break}else t(z,I);I=I.sibling}I=La(F,z.mode,le),I.return=z,z=I}return d(z);case O:return je=F._init,ht(z,I,je(F._payload),le)}if(Hn(F))return ye(z,I,F,le);if(Y(F))return xe(z,I,F,le);hs(z,F)}return typeof F=="string"&&F!==""||typeof F=="number"?(F=""+F,I!==null&&I.tag===6?(n(z,I.sibling),I=s(I,F),I.return=z,z=I):(n(z,I),I=Ta(F,z.mode,le),I.return=z,z=I),d(z)):n(z,I)}return ht}var Lr=Zu(!0),Ju=Zu(!1),_s=ho(null),gs=null,Rr=null,Ai=null;function Bi(){Ai=Rr=gs=null}function Wi(e){var t=_s.current;rt(_s),e._currentValue=t}function Yi(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function Ir(e,t){gs=e,Ai=Rr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Qt=!0),e.firstContext=null)}function mn(e){var t=e._currentValue;if(Ai!==e)if(e={context:e,memoizedValue:t,next:null},Rr===null){if(gs===null)throw Error(a(308));Rr=e,gs.dependencies={lanes:0,firstContext:e}}else Rr=Rr.next=e;return t}var Vo=null;function Hi(e){Vo===null?Vo=[e]:Vo.push(e)}function qu(e,t,n,o){var s=t.interleaved;return s===null?(n.next=n,Hi(t)):(n.next=s.next,s.next=n),t.interleaved=n,no(e,o)}function no(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var yo=!1;function Ui(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function ec(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function oo(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function xo(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Xe&2)!==0){var s=o.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),o.pending=t,no(e,n)}return s=o.interleaved,s===null?(t.next=t,Hi(o)):(t.next=s.next,s.next=t),o.interleaved=t,no(e,n)}function ys(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,pr(e,n)}}function tc(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var s=null,u=null;if(n=n.firstBaseUpdate,n!==null){do{var d={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};u===null?s=u=d:u=u.next=d,n=n.next}while(n!==null);u===null?s=u=t:u=u.next=t}else s=u=t;n={baseState:o.baseState,firstBaseUpdate:s,lastBaseUpdate:u,shared:o.shared,effects:o.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function xs(e,t,n,o){var s=e.updateQueue;yo=!1;var u=s.firstBaseUpdate,d=s.lastBaseUpdate,j=s.shared.pending;if(j!==null){s.shared.pending=null;var T=j,A=T.next;T.next=null,d===null?u=A:d.next=A,d=T;var te=e.alternate;te!==null&&(te=te.updateQueue,j=te.lastBaseUpdate,j!==d&&(j===null?te.firstBaseUpdate=A:j.next=A,te.lastBaseUpdate=T))}if(u!==null){var oe=s.baseState;d=0,te=A=T=null,j=u;do{var q=j.lane,me=j.eventTime;if((o&q)===q){te!==null&&(te=te.next={eventTime:me,lane:0,tag:j.tag,payload:j.payload,callback:j.callback,next:null});e:{var ye=e,xe=j;switch(q=t,me=n,xe.tag){case 1:if(ye=xe.payload,typeof ye=="function"){oe=ye.call(me,oe,q);break e}oe=ye;break e;case 3:ye.flags=ye.flags&-65537|128;case 0:if(ye=xe.payload,q=typeof ye=="function"?ye.call(me,oe,q):ye,q==null)break e;oe=U({},oe,q);break e;case 2:yo=!0}}j.callback!==null&&j.lane!==0&&(e.flags|=64,q=s.effects,q===null?s.effects=[j]:q.push(j))}else me={eventTime:me,lane:q,tag:j.tag,payload:j.payload,callback:j.callback,next:null},te===null?(A=te=me,T=oe):te=te.next=me,d|=q;if(j=j.next,j===null){if(j=s.shared.pending,j===null)break;q=j,j=q.next,q.next=null,s.lastBaseUpdate=q,s.shared.pending=null}}while(!0);if(te===null&&(T=oe),s.baseState=T,s.firstBaseUpdate=A,s.lastBaseUpdate=te,t=s.shared.interleaved,t!==null){s=t;do d|=s.lane,s=s.next;while(s!==t)}else u===null&&(s.shared.lanes=0);Go|=d,e.lanes=d,e.memoizedState=oe}}function nc(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],s=o.callback;if(s!==null){if(o.callback=null,o=n,typeof s!="function")throw Error(a(191,s));s.call(o)}}}var _l={},On=ho(_l),gl=ho(_l),yl=ho(_l);function Xo(e){if(e===_l)throw Error(a(174));return e}function Vi(e,t){switch(tt(yl,t),tt(gl,e),tt(On,_l),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:rr(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=rr(t,e)}rt(On),tt(On,t)}function $r(){rt(On),rt(gl),rt(yl)}function oc(e){Xo(yl.current);var t=Xo(On.current),n=rr(t,e.type);t!==n&&(tt(gl,e),tt(On,n))}function Xi(e){gl.current===e&&(rt(On),rt(gl))}var ct=ho(0);function vs(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Qi=[];function Gi(){for(var e=0;e<Qi.length;e++)Qi[e]._workInProgressVersionPrimary=null;Qi.length=0}var bs=se.ReactCurrentDispatcher,Ki=se.ReactCurrentBatchConfig,Qo=0,dt=null,wt=null,St=null,ws=!1,xl=!1,vl=0,cm=0;function Ot(){throw Error(a(321))}function Zi(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!bn(e[n],t[n]))return!1;return!0}function Ji(e,t,n,o,s,u){if(Qo=u,dt=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,bs.current=e===null||e.memoizedState===null?pm:hm,e=n(o,s),xl){u=0;do{if(xl=!1,vl=0,25<=u)throw Error(a(301));u+=1,St=wt=null,t.updateQueue=null,bs.current=_m,e=n(o,s)}while(xl)}if(bs.current=Ss,t=wt!==null&&wt.next!==null,Qo=0,St=wt=dt=null,ws=!1,t)throw Error(a(300));return e}function qi(){var e=vl!==0;return vl=0,e}function Fn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return St===null?dt.memoizedState=St=e:St=St.next=e,St}function pn(){if(wt===null){var e=dt.alternate;e=e!==null?e.memoizedState:null}else e=wt.next;var t=St===null?dt.memoizedState:St.next;if(t!==null)St=t,wt=e;else{if(e===null)throw Error(a(310));wt=e,e={memoizedState:wt.memoizedState,baseState:wt.baseState,baseQueue:wt.baseQueue,queue:wt.queue,next:null},St===null?dt.memoizedState=St=e:St=St.next=e}return St}function bl(e,t){return typeof t=="function"?t(e):t}function ea(e){var t=pn(),n=t.queue;if(n===null)throw Error(a(311));n.lastRenderedReducer=e;var o=wt,s=o.baseQueue,u=n.pending;if(u!==null){if(s!==null){var d=s.next;s.next=u.next,u.next=d}o.baseQueue=s=u,n.pending=null}if(s!==null){u=s.next,o=o.baseState;var j=d=null,T=null,A=u;do{var te=A.lane;if((Qo&te)===te)T!==null&&(T=T.next={lane:0,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null}),o=A.hasEagerState?A.eagerState:e(o,A.action);else{var oe={lane:te,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null};T===null?(j=T=oe,d=o):T=T.next=oe,dt.lanes|=te,Go|=te}A=A.next}while(A!==null&&A!==u);T===null?d=o:T.next=j,bn(o,t.memoizedState)||(Qt=!0),t.memoizedState=o,t.baseState=d,t.baseQueue=T,n.lastRenderedState=o}if(e=n.interleaved,e!==null){s=e;do u=s.lane,dt.lanes|=u,Go|=u,s=s.next;while(s!==e)}else s===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function ta(e){var t=pn(),n=t.queue;if(n===null)throw Error(a(311));n.lastRenderedReducer=e;var o=n.dispatch,s=n.pending,u=t.memoizedState;if(s!==null){n.pending=null;var d=s=s.next;do u=e(u,d.action),d=d.next;while(d!==s);bn(u,t.memoizedState)||(Qt=!0),t.memoizedState=u,t.baseQueue===null&&(t.baseState=u),n.lastRenderedState=u}return[u,o]}function rc(){}function lc(e,t){var n=dt,o=pn(),s=t(),u=!bn(o.memoizedState,s);if(u&&(o.memoizedState=s,Qt=!0),o=o.queue,na(ac.bind(null,n,o,e),[e]),o.getSnapshot!==t||u||St!==null&&St.memoizedState.tag&1){if(n.flags|=2048,wl(9,ic.bind(null,n,o,s,t),void 0,null),jt===null)throw Error(a(349));(Qo&30)!==0||sc(n,t,s)}return s}function sc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=dt.updateQueue,t===null?(t={lastEffect:null,stores:null},dt.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ic(e,t,n,o){t.value=n,t.getSnapshot=o,uc(t)&&cc(e)}function ac(e,t,n){return n(function(){uc(t)&&cc(e)})}function uc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!bn(e,n)}catch{return!0}}function cc(e){var t=no(e,1);t!==null&&jn(t,e,1,-1)}function dc(e){var t=Fn();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:bl,lastRenderedState:e},t.queue=e,e=e.dispatch=mm.bind(null,dt,e),[t.memoizedState,e]}function wl(e,t,n,o){return e={tag:e,create:t,destroy:n,deps:o,next:null},t=dt.updateQueue,t===null?(t={lastEffect:null,stores:null},dt.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e)),e}function fc(){return pn().memoizedState}function ks(e,t,n,o){var s=Fn();dt.flags|=e,s.memoizedState=wl(1|t,n,void 0,o===void 0?null:o)}function Cs(e,t,n,o){var s=pn();o=o===void 0?null:o;var u=void 0;if(wt!==null){var d=wt.memoizedState;if(u=d.destroy,o!==null&&Zi(o,d.deps)){s.memoizedState=wl(t,n,u,o);return}}dt.flags|=e,s.memoizedState=wl(1|t,n,u,o)}function mc(e,t){return ks(8390656,8,e,t)}function na(e,t){return Cs(2048,8,e,t)}function pc(e,t){return Cs(4,2,e,t)}function hc(e,t){return Cs(4,4,e,t)}function _c(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function gc(e,t,n){return n=n!=null?n.concat([e]):null,Cs(4,4,_c.bind(null,t,e),n)}function oa(){}function yc(e,t){var n=pn();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Zi(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function xc(e,t){var n=pn();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Zi(t,o[1])?o[0]:(e=e(),n.memoizedState=[e,t],e)}function vc(e,t,n){return(Qo&21)===0?(e.baseState&&(e.baseState=!1,Qt=!0),e.memoizedState=n):(bn(n,t)||(n=tl(),dt.lanes|=n,Go|=n,e.baseState=!0),t)}function dm(e,t){var n=He;He=n!==0&&4>n?n:4,e(!0);var o=Ki.transition;Ki.transition={};try{e(!1),t()}finally{He=n,Ki.transition=o}}function bc(){return pn().memoizedState}function fm(e,t,n){var o=ko(e);if(n={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null},wc(e))kc(t,n);else if(n=qu(e,t,n,o),n!==null){var s=Wt();jn(n,e,o,s),Cc(n,t,o)}}function mm(e,t,n){var o=ko(e),s={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null};if(wc(e))kc(t,s);else{var u=e.alternate;if(e.lanes===0&&(u===null||u.lanes===0)&&(u=t.lastRenderedReducer,u!==null))try{var d=t.lastRenderedState,j=u(d,n);if(s.hasEagerState=!0,s.eagerState=j,bn(j,d)){var T=t.interleaved;T===null?(s.next=s,Hi(t)):(s.next=T.next,T.next=s),t.interleaved=s;return}}catch{}finally{}n=qu(e,t,s,o),n!==null&&(s=Wt(),jn(n,e,o,s),Cc(n,t,o))}}function wc(e){var t=e.alternate;return e===dt||t!==null&&t===dt}function kc(e,t){xl=ws=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Cc(e,t,n){if((n&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,pr(e,n)}}var Ss={readContext:mn,useCallback:Ot,useContext:Ot,useEffect:Ot,useImperativeHandle:Ot,useInsertionEffect:Ot,useLayoutEffect:Ot,useMemo:Ot,useReducer:Ot,useRef:Ot,useState:Ot,useDebugValue:Ot,useDeferredValue:Ot,useTransition:Ot,useMutableSource:Ot,useSyncExternalStore:Ot,useId:Ot,unstable_isNewReconciler:!1},pm={readContext:mn,useCallback:function(e,t){return Fn().memoizedState=[e,t===void 0?null:t],e},useContext:mn,useEffect:mc,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ks(4194308,4,_c.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ks(4194308,4,e,t)},useInsertionEffect:function(e,t){return ks(4,2,e,t)},useMemo:function(e,t){var n=Fn();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var o=Fn();return t=n!==void 0?n(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=fm.bind(null,dt,e),[o.memoizedState,e]},useRef:function(e){var t=Fn();return e={current:e},t.memoizedState=e},useState:dc,useDebugValue:oa,useDeferredValue:function(e){return Fn().memoizedState=e},useTransition:function(){var e=dc(!1),t=e[0];return e=dm.bind(null,e[1]),Fn().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var o=dt,s=Fn();if(at){if(n===void 0)throw Error(a(407));n=n()}else{if(n=t(),jt===null)throw Error(a(349));(Qo&30)!==0||sc(o,t,n)}s.memoizedState=n;var u={value:n,getSnapshot:t};return s.queue=u,mc(ac.bind(null,o,u,e),[e]),o.flags|=2048,wl(9,ic.bind(null,o,u,n,t),void 0,null),n},useId:function(){var e=Fn(),t=jt.identifierPrefix;if(at){var n=to,o=eo;n=(o&~(1<<32-en(o)-1)).toString(32)+n,t=":"+t+"R"+n,n=vl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=cm++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},hm={readContext:mn,useCallback:yc,useContext:mn,useEffect:na,useImperativeHandle:gc,useInsertionEffect:pc,useLayoutEffect:hc,useMemo:xc,useReducer:ea,useRef:fc,useState:function(){return ea(bl)},useDebugValue:oa,useDeferredValue:function(e){var t=pn();return vc(t,wt.memoizedState,e)},useTransition:function(){var e=ea(bl)[0],t=pn().memoizedState;return[e,t]},useMutableSource:rc,useSyncExternalStore:lc,useId:bc,unstable_isNewReconciler:!1},_m={readContext:mn,useCallback:yc,useContext:mn,useEffect:na,useImperativeHandle:gc,useInsertionEffect:pc,useLayoutEffect:hc,useMemo:xc,useReducer:ta,useRef:fc,useState:function(){return ta(bl)},useDebugValue:oa,useDeferredValue:function(e){var t=pn();return wt===null?t.memoizedState=e:vc(t,wt.memoizedState,e)},useTransition:function(){var e=ta(bl)[0],t=pn().memoizedState;return[e,t]},useMutableSource:rc,useSyncExternalStore:lc,useId:bc,unstable_isNewReconciler:!1};function kn(e,t){if(e&&e.defaultProps){t=U({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ra(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:U({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var js={isMounted:function(e){return(e=e._reactInternals)?pt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var o=Wt(),s=ko(e),u=oo(o,s);u.payload=t,n!=null&&(u.callback=n),t=xo(e,u,s),t!==null&&(jn(t,e,s,o),ys(t,e,s))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=Wt(),s=ko(e),u=oo(o,s);u.tag=1,u.payload=t,n!=null&&(u.callback=n),t=xo(e,u,s),t!==null&&(jn(t,e,s,o),ys(t,e,s))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Wt(),o=ko(e),s=oo(n,o);s.tag=2,t!=null&&(s.callback=t),t=xo(e,s,o),t!==null&&(jn(t,e,o,n),ys(t,e,o))}};function Sc(e,t,n,o,s,u,d){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,u,d):t.prototype&&t.prototype.isPureReactComponent?!al(n,o)||!al(s,u):!0}function jc(e,t,n){var o=!1,s=_o,u=t.contextType;return typeof u=="object"&&u!==null?u=mn(u):(s=Xt(t)?Yo:zt.current,o=t.contextTypes,u=(o=o!=null)?Er(e,s):_o),t=new t(n,u),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=js,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=u),t}function Ec(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&js.enqueueReplaceState(t,t.state,null)}function la(e,t,n,o){var s=e.stateNode;s.props=n,s.state=e.memoizedState,s.refs={},Ui(e);var u=t.contextType;typeof u=="object"&&u!==null?s.context=mn(u):(u=Xt(t)?Yo:zt.current,s.context=Er(e,u)),s.state=e.memoizedState,u=t.getDerivedStateFromProps,typeof u=="function"&&(ra(e,t,u,n),s.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(t=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),t!==s.state&&js.enqueueReplaceState(s,s.state,null),xs(e,n,s,o),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function Mr(e,t){try{var n="",o=t;do n+=H(o),o=o.return;while(o);var s=n}catch(u){s=`
Error generating stack: `+u.message+`
`+u.stack}return{value:e,source:t,stack:s,digest:null}}function sa(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function ia(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var gm=typeof WeakMap=="function"?WeakMap:Map;function Nc(e,t,n){n=oo(-1,n),n.tag=3,n.payload={element:null};var o=t.value;return n.callback=function(){Is||(Is=!0,wa=o),ia(e,t)},n}function Pc(e,t,n){n=oo(-1,n),n.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var s=t.value;n.payload=function(){return o(s)},n.callback=function(){ia(e,t)}}var u=e.stateNode;return u!==null&&typeof u.componentDidCatch=="function"&&(n.callback=function(){ia(e,t),typeof o!="function"&&(bo===null?bo=new Set([this]):bo.add(this));var d=t.stack;this.componentDidCatch(t.value,{componentStack:d!==null?d:""})}),n}function Tc(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new gm;var s=new Set;o.set(t,s)}else s=o.get(t),s===void 0&&(s=new Set,o.set(t,s));s.has(n)||(s.add(n),e=Lm.bind(null,e,t,n),t.then(e,e))}function Lc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Rc(e,t,n,o,s){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=oo(-1,1),t.tag=2,xo(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=s,e)}var ym=se.ReactCurrentOwner,Qt=!1;function Bt(e,t,n,o){t.child=e===null?Ju(t,null,n,o):Lr(t,e.child,n,o)}function Ic(e,t,n,o,s){n=n.render;var u=t.ref;return Ir(t,s),o=Ji(e,t,n,o,u,s),n=qi(),e!==null&&!Qt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,ro(e,t,s)):(at&&n&&Mi(t),t.flags|=1,Bt(e,t,o,s),t.child)}function $c(e,t,n,o,s){if(e===null){var u=n.type;return typeof u=="function"&&!Pa(u)&&u.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=u,Mc(e,t,u,o,s)):(e=Ds(n.type,null,o,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(u=e.child,(e.lanes&s)===0){var d=u.memoizedProps;if(n=n.compare,n=n!==null?n:al,n(d,o)&&e.ref===t.ref)return ro(e,t,s)}return t.flags|=1,e=So(u,o),e.ref=t.ref,e.return=t,t.child=e}function Mc(e,t,n,o,s){if(e!==null){var u=e.memoizedProps;if(al(u,o)&&e.ref===t.ref)if(Qt=!1,t.pendingProps=o=u,(e.lanes&s)!==0)(e.flags&131072)!==0&&(Qt=!0);else return t.lanes=e.lanes,ro(e,t,s)}return aa(e,t,n,o,s)}function zc(e,t,n){var o=t.pendingProps,s=o.children,u=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},tt(Or,sn),sn|=n;else{if((n&1073741824)===0)return e=u!==null?u.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,tt(Or,sn),sn|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=u!==null?u.baseLanes:n,tt(Or,sn),sn|=o}else u!==null?(o=u.baseLanes|n,t.memoizedState=null):o=n,tt(Or,sn),sn|=o;return Bt(e,t,s,n),t.child}function Oc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function aa(e,t,n,o,s){var u=Xt(n)?Yo:zt.current;return u=Er(t,u),Ir(t,s),n=Ji(e,t,n,o,u,s),o=qi(),e!==null&&!Qt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,ro(e,t,s)):(at&&o&&Mi(t),t.flags|=1,Bt(e,t,n,s),t.child)}function Fc(e,t,n,o,s){if(Xt(n)){var u=!0;cs(t)}else u=!1;if(Ir(t,s),t.stateNode===null)Ns(e,t),jc(t,n,o),la(t,n,o,s),o=!0;else if(e===null){var d=t.stateNode,j=t.memoizedProps;d.props=j;var T=d.context,A=n.contextType;typeof A=="object"&&A!==null?A=mn(A):(A=Xt(n)?Yo:zt.current,A=Er(t,A));var te=n.getDerivedStateFromProps,oe=typeof te=="function"||typeof d.getSnapshotBeforeUpdate=="function";oe||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(j!==o||T!==A)&&Ec(t,d,o,A),yo=!1;var q=t.memoizedState;d.state=q,xs(t,o,d,s),T=t.memoizedState,j!==o||q!==T||Vt.current||yo?(typeof te=="function"&&(ra(t,n,te,o),T=t.memoizedState),(j=yo||Sc(t,n,j,o,q,T,A))?(oe||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount()),typeof d.componentDidMount=="function"&&(t.flags|=4194308)):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=T),d.props=o,d.state=T,d.context=A,o=j):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{d=t.stateNode,ec(e,t),j=t.memoizedProps,A=t.type===t.elementType?j:kn(t.type,j),d.props=A,oe=t.pendingProps,q=d.context,T=n.contextType,typeof T=="object"&&T!==null?T=mn(T):(T=Xt(n)?Yo:zt.current,T=Er(t,T));var me=n.getDerivedStateFromProps;(te=typeof me=="function"||typeof d.getSnapshotBeforeUpdate=="function")||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(j!==oe||q!==T)&&Ec(t,d,o,T),yo=!1,q=t.memoizedState,d.state=q,xs(t,o,d,s);var ye=t.memoizedState;j!==oe||q!==ye||Vt.current||yo?(typeof me=="function"&&(ra(t,n,me,o),ye=t.memoizedState),(A=yo||Sc(t,n,A,o,q,ye,T)||!1)?(te||typeof d.UNSAFE_componentWillUpdate!="function"&&typeof d.componentWillUpdate!="function"||(typeof d.componentWillUpdate=="function"&&d.componentWillUpdate(o,ye,T),typeof d.UNSAFE_componentWillUpdate=="function"&&d.UNSAFE_componentWillUpdate(o,ye,T)),typeof d.componentDidUpdate=="function"&&(t.flags|=4),typeof d.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof d.componentDidUpdate!="function"||j===e.memoizedProps&&q===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||j===e.memoizedProps&&q===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=ye),d.props=o,d.state=ye,d.context=T,o=A):(typeof d.componentDidUpdate!="function"||j===e.memoizedProps&&q===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||j===e.memoizedProps&&q===e.memoizedState||(t.flags|=1024),o=!1)}return ua(e,t,n,o,u,s)}function ua(e,t,n,o,s,u){Oc(e,t);var d=(t.flags&128)!==0;if(!o&&!d)return s&&Yu(t,n,!1),ro(e,t,u);o=t.stateNode,ym.current=t;var j=d&&typeof n.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&d?(t.child=Lr(t,e.child,null,u),t.child=Lr(t,null,j,u)):Bt(e,t,j,u),t.memoizedState=o.state,s&&Yu(t,n,!0),t.child}function Dc(e){var t=e.stateNode;t.pendingContext?Bu(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Bu(e,t.context,!1),Vi(e,t.containerInfo)}function Ac(e,t,n,o,s){return Tr(),Di(s),t.flags|=256,Bt(e,t,n,o),t.child}var ca={dehydrated:null,treeContext:null,retryLane:0};function da(e){return{baseLanes:e,cachePool:null,transitions:null}}function Bc(e,t,n){var o=t.pendingProps,s=ct.current,u=!1,d=(t.flags&128)!==0,j;if((j=d)||(j=e!==null&&e.memoizedState===null?!1:(s&2)!==0),j?(u=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),tt(ct,s&1),e===null)return Fi(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(d=o.children,e=o.fallback,u?(o=t.mode,u=t.child,d={mode:"hidden",children:d},(o&1)===0&&u!==null?(u.childLanes=0,u.pendingProps=d):u=As(d,o,0,null),e=qo(e,o,n,null),u.return=t,e.return=t,u.sibling=e,t.child=u,t.child.memoizedState=da(n),t.memoizedState=ca,e):fa(t,d));if(s=e.memoizedState,s!==null&&(j=s.dehydrated,j!==null))return xm(e,t,d,o,j,s,n);if(u){u=o.fallback,d=t.mode,s=e.child,j=s.sibling;var T={mode:"hidden",children:o.children};return(d&1)===0&&t.child!==s?(o=t.child,o.childLanes=0,o.pendingProps=T,t.deletions=null):(o=So(s,T),o.subtreeFlags=s.subtreeFlags&14680064),j!==null?u=So(j,u):(u=qo(u,d,n,null),u.flags|=2),u.return=t,o.return=t,o.sibling=u,t.child=o,o=u,u=t.child,d=e.child.memoizedState,d=d===null?da(n):{baseLanes:d.baseLanes|n,cachePool:null,transitions:d.transitions},u.memoizedState=d,u.childLanes=e.childLanes&~n,t.memoizedState=ca,o}return u=e.child,e=u.sibling,o=So(u,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=n),o.return=t,o.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=o,t.memoizedState=null,o}function fa(e,t){return t=As({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Es(e,t,n,o){return o!==null&&Di(o),Lr(t,e.child,null,n),e=fa(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function xm(e,t,n,o,s,u,d){if(n)return t.flags&256?(t.flags&=-257,o=sa(Error(a(422))),Es(e,t,d,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(u=o.fallback,s=t.mode,o=As({mode:"visible",children:o.children},s,0,null),u=qo(u,s,d,null),u.flags|=2,o.return=t,u.return=t,o.sibling=u,t.child=o,(t.mode&1)!==0&&Lr(t,e.child,null,d),t.child.memoizedState=da(d),t.memoizedState=ca,u);if((t.mode&1)===0)return Es(e,t,d,null);if(s.data==="$!"){if(o=s.nextSibling&&s.nextSibling.dataset,o)var j=o.dgst;return o=j,u=Error(a(419)),o=sa(u,o,void 0),Es(e,t,d,o)}if(j=(d&e.childLanes)!==0,Qt||j){if(o=jt,o!==null){switch(d&-d){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=(s&(o.suspendedLanes|d))!==0?0:s,s!==0&&s!==u.retryLane&&(u.retryLane=s,no(e,s),jn(o,e,s,-1))}return Na(),o=sa(Error(a(421))),Es(e,t,d,o)}return s.data==="$?"?(t.flags|=128,t.child=e.child,t=Rm.bind(null,e),s._reactRetry=t,null):(e=u.treeContext,ln=po(s.nextSibling),rn=t,at=!0,wn=null,e!==null&&(dn[fn++]=eo,dn[fn++]=to,dn[fn++]=Ho,eo=e.id,to=e.overflow,Ho=t),t=fa(t,o.children),t.flags|=4096,t)}function Wc(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),Yi(e.return,t,n)}function ma(e,t,n,o,s){var u=e.memoizedState;u===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:s}:(u.isBackwards=t,u.rendering=null,u.renderingStartTime=0,u.last=o,u.tail=n,u.tailMode=s)}function Yc(e,t,n){var o=t.pendingProps,s=o.revealOrder,u=o.tail;if(Bt(e,t,o.children,n),o=ct.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Wc(e,n,t);else if(e.tag===19)Wc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(tt(ct,o),(t.mode&1)===0)t.memoizedState=null;else switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&vs(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),ma(t,!1,s,n,u);break;case"backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&vs(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}ma(t,!0,n,null,u);break;case"together":ma(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Ns(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function ro(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Go|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(a(153));if(t.child!==null){for(e=t.child,n=So(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=So(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function vm(e,t,n){switch(t.tag){case 3:Dc(t),Tr();break;case 5:oc(t);break;case 1:Xt(t.type)&&cs(t);break;case 4:Vi(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,s=t.memoizedProps.value;tt(_s,o._currentValue),o._currentValue=s;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(tt(ct,ct.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Bc(e,t,n):(tt(ct,ct.current&1),e=ro(e,t,n),e!==null?e.sibling:null);tt(ct,ct.current&1);break;case 19:if(o=(n&t.childLanes)!==0,(e.flags&128)!==0){if(o)return Yc(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),tt(ct,ct.current),o)break;return null;case 22:case 23:return t.lanes=0,zc(e,t,n)}return ro(e,t,n)}var Hc,pa,Uc,Vc;Hc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},pa=function(){},Uc=function(e,t,n,o){var s=e.memoizedProps;if(s!==o){e=t.stateNode,Xo(On.current);var u=null;switch(n){case"input":s=tr(e,s),o=tr(e,o),u=[];break;case"select":s=U({},s,{value:void 0}),o=U({},o,{value:void 0}),u=[];break;case"textarea":s=or(e,s),o=or(e,o),u=[];break;default:typeof s.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=is)}To(n,o);var d;n=null;for(A in s)if(!o.hasOwnProperty(A)&&s.hasOwnProperty(A)&&s[A]!=null)if(A==="style"){var j=s[A];for(d in j)j.hasOwnProperty(d)&&(n||(n={}),n[d]="")}else A!=="dangerouslySetInnerHTML"&&A!=="children"&&A!=="suppressContentEditableWarning"&&A!=="suppressHydrationWarning"&&A!=="autoFocus"&&(p.hasOwnProperty(A)?u||(u=[]):(u=u||[]).push(A,null));for(A in o){var T=o[A];if(j=s!=null?s[A]:void 0,o.hasOwnProperty(A)&&T!==j&&(T!=null||j!=null))if(A==="style")if(j){for(d in j)!j.hasOwnProperty(d)||T&&T.hasOwnProperty(d)||(n||(n={}),n[d]="");for(d in T)T.hasOwnProperty(d)&&j[d]!==T[d]&&(n||(n={}),n[d]=T[d])}else n||(u||(u=[]),u.push(A,n)),n=T;else A==="dangerouslySetInnerHTML"?(T=T?T.__html:void 0,j=j?j.__html:void 0,T!=null&&j!==T&&(u=u||[]).push(A,T)):A==="children"?typeof T!="string"&&typeof T!="number"||(u=u||[]).push(A,""+T):A!=="suppressContentEditableWarning"&&A!=="suppressHydrationWarning"&&(p.hasOwnProperty(A)?(T!=null&&A==="onScroll"&&ot("scroll",e),u||j===T||(u=[])):(u=u||[]).push(A,T))}n&&(u=u||[]).push("style",n);var A=u;(t.updateQueue=A)&&(t.flags|=4)}},Vc=function(e,t,n,o){n!==o&&(t.flags|=4)};function kl(e,t){if(!at)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Ft(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,o|=s.subtreeFlags&14680064,o|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,o|=s.subtreeFlags,o|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function bm(e,t,n){var o=t.pendingProps;switch(zi(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ft(t),null;case 1:return Xt(t.type)&&us(),Ft(t),null;case 3:return o=t.stateNode,$r(),rt(Vt),rt(zt),Gi(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(ps(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,wn!==null&&(Sa(wn),wn=null))),pa(e,t),Ft(t),null;case 5:Xi(t);var s=Xo(yl.current);if(n=t.type,e!==null&&t.stateNode!=null)Uc(e,t,n,o,s),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(a(166));return Ft(t),null}if(e=Xo(On.current),ps(t)){o=t.stateNode,n=t.type;var u=t.memoizedProps;switch(o[zn]=t,o[ml]=u,e=(t.mode&1)!==0,n){case"dialog":ot("cancel",o),ot("close",o);break;case"iframe":case"object":case"embed":ot("load",o);break;case"video":case"audio":for(s=0;s<cl.length;s++)ot(cl[s],o);break;case"source":ot("error",o);break;case"img":case"image":case"link":ot("error",o),ot("load",o);break;case"details":ot("toggle",o);break;case"input":Vr(o,u),ot("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!u.multiple},ot("invalid",o);break;case"textarea":Nn(o,u),ot("invalid",o)}To(n,u),s=null;for(var d in u)if(u.hasOwnProperty(d)){var j=u[d];d==="children"?typeof j=="string"?o.textContent!==j&&(u.suppressHydrationWarning!==!0&&ss(o.textContent,j,e),s=["children",j]):typeof j=="number"&&o.textContent!==""+j&&(u.suppressHydrationWarning!==!0&&ss(o.textContent,j,e),s=["children",""+j]):p.hasOwnProperty(d)&&j!=null&&d==="onScroll"&&ot("scroll",o)}switch(n){case"input":an(o),Fe(o,u,!0);break;case"textarea":an(o),Xr(o);break;case"select":case"option":break;default:typeof u.onClick=="function"&&(o.onclick=is)}o=s,t.updateQueue=o,o!==null&&(t.flags|=4)}else{d=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Qr(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=d.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=d.createElement(n,{is:o.is}):(e=d.createElement(n),n==="select"&&(d=e,o.multiple?d.multiple=!0:o.size&&(d.size=o.size))):e=d.createElementNS(e,n),e[zn]=t,e[ml]=o,Hc(e,t,!1,!1),t.stateNode=e;e:{switch(d=Lo(n,o),n){case"dialog":ot("cancel",e),ot("close",e),s=o;break;case"iframe":case"object":case"embed":ot("load",e),s=o;break;case"video":case"audio":for(s=0;s<cl.length;s++)ot(cl[s],e);s=o;break;case"source":ot("error",e),s=o;break;case"img":case"image":case"link":ot("error",e),ot("load",e),s=o;break;case"details":ot("toggle",e),s=o;break;case"input":Vr(e,o),s=tr(e,o),ot("invalid",e);break;case"option":s=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},s=U({},o,{value:void 0}),ot("invalid",e);break;case"textarea":Nn(e,o),s=or(e,o),ot("invalid",e);break;default:s=o}To(n,s),j=s;for(u in j)if(j.hasOwnProperty(u)){var T=j[u];u==="style"?Wl(e,T):u==="dangerouslySetInnerHTML"?(T=T?T.__html:void 0,T!=null&&Bl(e,T)):u==="children"?typeof T=="string"?(n!=="textarea"||T!=="")&&Pt(e,T):typeof T=="number"&&Pt(e,""+T):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(p.hasOwnProperty(u)?T!=null&&u==="onScroll"&&ot("scroll",e):T!=null&&ne(e,u,T,d))}switch(n){case"input":an(e),Fe(e,o,!1);break;case"textarea":an(e),Xr(e);break;case"option":o.value!=null&&e.setAttribute("value",""+Te(o.value));break;case"select":e.multiple=!!o.multiple,u=o.value,u!=null?It(e,!!o.multiple,u,!1):o.defaultValue!=null&&It(e,!!o.multiple,o.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=is)}switch(n){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ft(t),null;case 6:if(e&&t.stateNode!=null)Vc(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(a(166));if(n=Xo(yl.current),Xo(On.current),ps(t)){if(o=t.stateNode,n=t.memoizedProps,o[zn]=t,(u=o.nodeValue!==n)&&(e=rn,e!==null))switch(e.tag){case 3:ss(o.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ss(o.nodeValue,n,(e.mode&1)!==0)}u&&(t.flags|=4)}else o=(n.nodeType===9?n:n.ownerDocument).createTextNode(o),o[zn]=t,t.stateNode=o}return Ft(t),null;case 13:if(rt(ct),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(at&&ln!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Gu(),Tr(),t.flags|=98560,u=!1;else if(u=ps(t),o!==null&&o.dehydrated!==null){if(e===null){if(!u)throw Error(a(318));if(u=t.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(a(317));u[zn]=t}else Tr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ft(t),u=!1}else wn!==null&&(Sa(wn),wn=null),u=!0;if(!u)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(ct.current&1)!==0?kt===0&&(kt=3):Na())),t.updateQueue!==null&&(t.flags|=4),Ft(t),null);case 4:return $r(),pa(e,t),e===null&&dl(t.stateNode.containerInfo),Ft(t),null;case 10:return Wi(t.type._context),Ft(t),null;case 17:return Xt(t.type)&&us(),Ft(t),null;case 19:if(rt(ct),u=t.memoizedState,u===null)return Ft(t),null;if(o=(t.flags&128)!==0,d=u.rendering,d===null)if(o)kl(u,!1);else{if(kt!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(d=vs(e),d!==null){for(t.flags|=128,kl(u,!1),o=d.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=n,n=t.child;n!==null;)u=n,e=o,u.flags&=14680066,d=u.alternate,d===null?(u.childLanes=0,u.lanes=e,u.child=null,u.subtreeFlags=0,u.memoizedProps=null,u.memoizedState=null,u.updateQueue=null,u.dependencies=null,u.stateNode=null):(u.childLanes=d.childLanes,u.lanes=d.lanes,u.child=d.child,u.subtreeFlags=0,u.deletions=null,u.memoizedProps=d.memoizedProps,u.memoizedState=d.memoizedState,u.updateQueue=d.updateQueue,u.type=d.type,e=d.dependencies,u.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return tt(ct,ct.current&1|2),t.child}e=e.sibling}u.tail!==null&&lt()>Fr&&(t.flags|=128,o=!0,kl(u,!1),t.lanes=4194304)}else{if(!o)if(e=vs(d),e!==null){if(t.flags|=128,o=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),kl(u,!0),u.tail===null&&u.tailMode==="hidden"&&!d.alternate&&!at)return Ft(t),null}else 2*lt()-u.renderingStartTime>Fr&&n!==1073741824&&(t.flags|=128,o=!0,kl(u,!1),t.lanes=4194304);u.isBackwards?(d.sibling=t.child,t.child=d):(n=u.last,n!==null?n.sibling=d:t.child=d,u.last=d)}return u.tail!==null?(t=u.tail,u.rendering=t,u.tail=t.sibling,u.renderingStartTime=lt(),t.sibling=null,n=ct.current,tt(ct,o?n&1|2:n&1),t):(Ft(t),null);case 22:case 23:return Ea(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(sn&1073741824)!==0&&(Ft(t),t.subtreeFlags&6&&(t.flags|=8192)):Ft(t),null;case 24:return null;case 25:return null}throw Error(a(156,t.tag))}function wm(e,t){switch(zi(t),t.tag){case 1:return Xt(t.type)&&us(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return $r(),rt(Vt),rt(zt),Gi(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Xi(t),null;case 13:if(rt(ct),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(a(340));Tr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return rt(ct),null;case 4:return $r(),null;case 10:return Wi(t.type._context),null;case 22:case 23:return Ea(),null;case 24:return null;default:return null}}var Ps=!1,Dt=!1,km=typeof WeakSet=="function"?WeakSet:Set,pe=null;function zr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(o){mt(e,t,o)}else n.current=null}function ha(e,t,n){try{n()}catch(o){mt(e,t,o)}}var Xc=!1;function Cm(e,t){if(Ei=Bo,e=Su(),xi(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var o=n.getSelection&&n.getSelection();if(o&&o.rangeCount!==0){n=o.anchorNode;var s=o.anchorOffset,u=o.focusNode;o=o.focusOffset;try{n.nodeType,u.nodeType}catch{n=null;break e}var d=0,j=-1,T=-1,A=0,te=0,oe=e,q=null;t:for(;;){for(var me;oe!==n||s!==0&&oe.nodeType!==3||(j=d+s),oe!==u||o!==0&&oe.nodeType!==3||(T=d+o),oe.nodeType===3&&(d+=oe.nodeValue.length),(me=oe.firstChild)!==null;)q=oe,oe=me;for(;;){if(oe===e)break t;if(q===n&&++A===s&&(j=d),q===u&&++te===o&&(T=d),(me=oe.nextSibling)!==null)break;oe=q,q=oe.parentNode}oe=me}n=j===-1||T===-1?null:{start:j,end:T}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ni={focusedElem:e,selectionRange:n},Bo=!1,pe=t;pe!==null;)if(t=pe,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,pe=e;else for(;pe!==null;){t=pe;try{var ye=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(ye!==null){var xe=ye.memoizedProps,ht=ye.memoizedState,z=t.stateNode,I=z.getSnapshotBeforeUpdate(t.elementType===t.type?xe:kn(t.type,xe),ht);z.__reactInternalSnapshotBeforeUpdate=I}break;case 3:var F=t.stateNode.containerInfo;F.nodeType===1?F.textContent="":F.nodeType===9&&F.documentElement&&F.removeChild(F.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(a(163))}}catch(le){mt(t,t.return,le)}if(e=t.sibling,e!==null){e.return=t.return,pe=e;break}pe=t.return}return ye=Xc,Xc=!1,ye}function Cl(e,t,n){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var s=o=o.next;do{if((s.tag&e)===e){var u=s.destroy;s.destroy=void 0,u!==void 0&&ha(t,n,u)}s=s.next}while(s!==o)}}function Ts(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var o=n.create;n.destroy=o()}n=n.next}while(n!==t)}}function _a(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Qc(e){var t=e.alternate;t!==null&&(e.alternate=null,Qc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[zn],delete t[ml],delete t[Ri],delete t[sm],delete t[im])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Gc(e){return e.tag===5||e.tag===3||e.tag===4}function Kc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Gc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ga(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=is));else if(o!==4&&(e=e.child,e!==null))for(ga(e,t,n),e=e.sibling;e!==null;)ga(e,t,n),e=e.sibling}function ya(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(ya(e,t,n),e=e.sibling;e!==null;)ya(e,t,n),e=e.sibling}var Lt=null,Cn=!1;function vo(e,t,n){for(n=n.child;n!==null;)Zc(e,t,n),n=n.sibling}function Zc(e,t,n){if($t&&typeof $t.onCommitFiberUnmount=="function")try{$t.onCommitFiberUnmount(Qn,n)}catch{}switch(n.tag){case 5:Dt||zr(n,t);case 6:var o=Lt,s=Cn;Lt=null,vo(e,t,n),Lt=o,Cn=s,Lt!==null&&(Cn?(e=Lt,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Lt.removeChild(n.stateNode));break;case 18:Lt!==null&&(Cn?(e=Lt,n=n.stateNode,e.nodeType===8?Li(e.parentNode,n):e.nodeType===1&&Li(e,n),fo(e)):Li(Lt,n.stateNode));break;case 4:o=Lt,s=Cn,Lt=n.stateNode.containerInfo,Cn=!0,vo(e,t,n),Lt=o,Cn=s;break;case 0:case 11:case 14:case 15:if(!Dt&&(o=n.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){s=o=o.next;do{var u=s,d=u.destroy;u=u.tag,d!==void 0&&((u&2)!==0||(u&4)!==0)&&ha(n,t,d),s=s.next}while(s!==o)}vo(e,t,n);break;case 1:if(!Dt&&(zr(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=n.memoizedProps,o.state=n.memoizedState,o.componentWillUnmount()}catch(j){mt(n,t,j)}vo(e,t,n);break;case 21:vo(e,t,n);break;case 22:n.mode&1?(Dt=(o=Dt)||n.memoizedState!==null,vo(e,t,n),Dt=o):vo(e,t,n);break;default:vo(e,t,n)}}function Jc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new km),t.forEach(function(o){var s=Im.bind(null,e,o);n.has(o)||(n.add(o),o.then(s,s))})}}function Sn(e,t){var n=t.deletions;if(n!==null)for(var o=0;o<n.length;o++){var s=n[o];try{var u=e,d=t,j=d;e:for(;j!==null;){switch(j.tag){case 5:Lt=j.stateNode,Cn=!1;break e;case 3:Lt=j.stateNode.containerInfo,Cn=!0;break e;case 4:Lt=j.stateNode.containerInfo,Cn=!0;break e}j=j.return}if(Lt===null)throw Error(a(160));Zc(u,d,s),Lt=null,Cn=!1;var T=s.alternate;T!==null&&(T.return=null),s.return=null}catch(A){mt(s,t,A)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)qc(t,e),t=t.sibling}function qc(e,t){var n=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Sn(t,e),Dn(e),o&4){try{Cl(3,e,e.return),Ts(3,e)}catch(xe){mt(e,e.return,xe)}try{Cl(5,e,e.return)}catch(xe){mt(e,e.return,xe)}}break;case 1:Sn(t,e),Dn(e),o&512&&n!==null&&zr(n,n.return);break;case 5:if(Sn(t,e),Dn(e),o&512&&n!==null&&zr(n,n.return),e.flags&32){var s=e.stateNode;try{Pt(s,"")}catch(xe){mt(e,e.return,xe)}}if(o&4&&(s=e.stateNode,s!=null)){var u=e.memoizedProps,d=n!==null?n.memoizedProps:u,j=e.type,T=e.updateQueue;if(e.updateQueue=null,T!==null)try{j==="input"&&u.type==="radio"&&u.name!=null&&No(s,u),Lo(j,d);var A=Lo(j,u);for(d=0;d<T.length;d+=2){var te=T[d],oe=T[d+1];te==="style"?Wl(s,oe):te==="dangerouslySetInnerHTML"?Bl(s,oe):te==="children"?Pt(s,oe):ne(s,te,oe,A)}switch(j){case"input":nr(s,u);break;case"textarea":Pn(s,u);break;case"select":var q=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!u.multiple;var me=u.value;me!=null?It(s,!!u.multiple,me,!1):q!==!!u.multiple&&(u.defaultValue!=null?It(s,!!u.multiple,u.defaultValue,!0):It(s,!!u.multiple,u.multiple?[]:"",!1))}s[ml]=u}catch(xe){mt(e,e.return,xe)}}break;case 6:if(Sn(t,e),Dn(e),o&4){if(e.stateNode===null)throw Error(a(162));s=e.stateNode,u=e.memoizedProps;try{s.nodeValue=u}catch(xe){mt(e,e.return,xe)}}break;case 3:if(Sn(t,e),Dn(e),o&4&&n!==null&&n.memoizedState.isDehydrated)try{fo(t.containerInfo)}catch(xe){mt(e,e.return,xe)}break;case 4:Sn(t,e),Dn(e);break;case 13:Sn(t,e),Dn(e),s=e.child,s.flags&8192&&(u=s.memoizedState!==null,s.stateNode.isHidden=u,!u||s.alternate!==null&&s.alternate.memoizedState!==null||(ba=lt())),o&4&&Jc(e);break;case 22:if(te=n!==null&&n.memoizedState!==null,e.mode&1?(Dt=(A=Dt)||te,Sn(t,e),Dt=A):Sn(t,e),Dn(e),o&8192){if(A=e.memoizedState!==null,(e.stateNode.isHidden=A)&&!te&&(e.mode&1)!==0)for(pe=e,te=e.child;te!==null;){for(oe=pe=te;pe!==null;){switch(q=pe,me=q.child,q.tag){case 0:case 11:case 14:case 15:Cl(4,q,q.return);break;case 1:zr(q,q.return);var ye=q.stateNode;if(typeof ye.componentWillUnmount=="function"){o=q,n=q.return;try{t=o,ye.props=t.memoizedProps,ye.state=t.memoizedState,ye.componentWillUnmount()}catch(xe){mt(o,n,xe)}}break;case 5:zr(q,q.return);break;case 22:if(q.memoizedState!==null){nd(oe);continue}}me!==null?(me.return=q,pe=me):nd(oe)}te=te.sibling}e:for(te=null,oe=e;;){if(oe.tag===5){if(te===null){te=oe;try{s=oe.stateNode,A?(u=s.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none"):(j=oe.stateNode,T=oe.memoizedProps.style,d=T!=null&&T.hasOwnProperty("display")?T.display:null,j.style.display=lr("display",d))}catch(xe){mt(e,e.return,xe)}}}else if(oe.tag===6){if(te===null)try{oe.stateNode.nodeValue=A?"":oe.memoizedProps}catch(xe){mt(e,e.return,xe)}}else if((oe.tag!==22&&oe.tag!==23||oe.memoizedState===null||oe===e)&&oe.child!==null){oe.child.return=oe,oe=oe.child;continue}if(oe===e)break e;for(;oe.sibling===null;){if(oe.return===null||oe.return===e)break e;te===oe&&(te=null),oe=oe.return}te===oe&&(te=null),oe.sibling.return=oe.return,oe=oe.sibling}}break;case 19:Sn(t,e),Dn(e),o&4&&Jc(e);break;case 21:break;default:Sn(t,e),Dn(e)}}function Dn(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Gc(n)){var o=n;break e}n=n.return}throw Error(a(160))}switch(o.tag){case 5:var s=o.stateNode;o.flags&32&&(Pt(s,""),o.flags&=-33);var u=Kc(e);ya(e,u,s);break;case 3:case 4:var d=o.stateNode.containerInfo,j=Kc(e);ga(e,j,d);break;default:throw Error(a(161))}}catch(T){mt(e,e.return,T)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Sm(e,t,n){pe=e,ed(e)}function ed(e,t,n){for(var o=(e.mode&1)!==0;pe!==null;){var s=pe,u=s.child;if(s.tag===22&&o){var d=s.memoizedState!==null||Ps;if(!d){var j=s.alternate,T=j!==null&&j.memoizedState!==null||Dt;j=Ps;var A=Dt;if(Ps=d,(Dt=T)&&!A)for(pe=s;pe!==null;)d=pe,T=d.child,d.tag===22&&d.memoizedState!==null?od(s):T!==null?(T.return=d,pe=T):od(s);for(;u!==null;)pe=u,ed(u),u=u.sibling;pe=s,Ps=j,Dt=A}td(e)}else(s.subtreeFlags&8772)!==0&&u!==null?(u.return=s,pe=u):td(e)}}function td(e){for(;pe!==null;){var t=pe;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Dt||Ts(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!Dt)if(n===null)o.componentDidMount();else{var s=t.elementType===t.type?n.memoizedProps:kn(t.type,n.memoizedProps);o.componentDidUpdate(s,n.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var u=t.updateQueue;u!==null&&nc(t,u,o);break;case 3:var d=t.updateQueue;if(d!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}nc(t,d,n)}break;case 5:var j=t.stateNode;if(n===null&&t.flags&4){n=j;var T=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":T.autoFocus&&n.focus();break;case"img":T.src&&(n.src=T.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var A=t.alternate;if(A!==null){var te=A.memoizedState;if(te!==null){var oe=te.dehydrated;oe!==null&&fo(oe)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(a(163))}Dt||t.flags&512&&_a(t)}catch(q){mt(t,t.return,q)}}if(t===e){pe=null;break}if(n=t.sibling,n!==null){n.return=t.return,pe=n;break}pe=t.return}}function nd(e){for(;pe!==null;){var t=pe;if(t===e){pe=null;break}var n=t.sibling;if(n!==null){n.return=t.return,pe=n;break}pe=t.return}}function od(e){for(;pe!==null;){var t=pe;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ts(4,t)}catch(T){mt(t,n,T)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var s=t.return;try{o.componentDidMount()}catch(T){mt(t,s,T)}}var u=t.return;try{_a(t)}catch(T){mt(t,u,T)}break;case 5:var d=t.return;try{_a(t)}catch(T){mt(t,d,T)}}}catch(T){mt(t,t.return,T)}if(t===e){pe=null;break}var j=t.sibling;if(j!==null){j.return=t.return,pe=j;break}pe=t.return}}var jm=Math.ceil,Ls=se.ReactCurrentDispatcher,xa=se.ReactCurrentOwner,hn=se.ReactCurrentBatchConfig,Xe=0,jt=null,yt=null,Rt=0,sn=0,Or=ho(0),kt=0,Sl=null,Go=0,Rs=0,va=0,jl=null,Gt=null,ba=0,Fr=1/0,lo=null,Is=!1,wa=null,bo=null,$s=!1,wo=null,Ms=0,El=0,ka=null,zs=-1,Os=0;function Wt(){return(Xe&6)!==0?lt():zs!==-1?zs:zs=lt()}function ko(e){return(e.mode&1)===0?1:(Xe&2)!==0&&Rt!==0?Rt&-Rt:um.transition!==null?(Os===0&&(Os=tl()),Os):(e=He,e!==0||(e=window.event,e=e===void 0?16:Q(e.type)),e)}function jn(e,t,n,o){if(50<El)throw El=0,ka=null,Error(a(185));Oo(e,n,o),((Xe&2)===0||e!==jt)&&(e===jt&&((Xe&2)===0&&(Rs|=n),kt===4&&Co(e,Rt)),Kt(e,o),n===1&&Xe===0&&(t.mode&1)===0&&(Fr=lt()+500,ds&&go()))}function Kt(e,t){var n=e.callbackNode;Gl(e,t);var o=Rn(e,e===jt?Rt:0);if(o===0)n!==null&&cn(n),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(n!=null&&cn(n),t===1)e.tag===0?am(ld.bind(null,e)):Hu(ld.bind(null,e)),rm(function(){(Xe&6)===0&&go()}),n=null;else{switch(Je(o)){case 1:n=qr;break;case 4:n=dr;break;case 16:n=$o;break;case 536870912:n=el;break;default:n=$o}n=md(n,rd.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function rd(e,t){if(zs=-1,Os=0,(Xe&6)!==0)throw Error(a(327));var n=e.callbackNode;if(Dr()&&e.callbackNode!==n)return null;var o=Rn(e,e===jt?Rt:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=Fs(e,o);else{t=o;var s=Xe;Xe|=2;var u=id();(jt!==e||Rt!==t)&&(lo=null,Fr=lt()+500,Zo(e,t));do try{Pm();break}catch(j){sd(e,j)}while(!0);Bi(),Ls.current=u,Xe=s,yt!==null?t=0:(jt=null,Rt=0,t=kt)}if(t!==0){if(t===2&&(s=uo(e),s!==0&&(o=s,t=Ca(e,s))),t===1)throw n=Sl,Zo(e,0),Co(e,o),Kt(e,lt()),n;if(t===6)Co(e,o);else{if(s=e.current.alternate,(o&30)===0&&!Em(s)&&(t=Fs(e,o),t===2&&(u=uo(e),u!==0&&(o=u,t=Ca(e,u))),t===1))throw n=Sl,Zo(e,0),Co(e,o),Kt(e,lt()),n;switch(e.finishedWork=s,e.finishedLanes=o,t){case 0:case 1:throw Error(a(345));case 2:Jo(e,Gt,lo);break;case 3:if(Co(e,o),(o&130023424)===o&&(t=ba+500-lt(),10<t)){if(Rn(e,0)!==0)break;if(s=e.suspendedLanes,(s&o)!==o){Wt(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=Ti(Jo.bind(null,e,Gt,lo),t);break}Jo(e,Gt,lo);break;case 4:if(Co(e,o),(o&4194240)===o)break;for(t=e.eventTimes,s=-1;0<o;){var d=31-en(o);u=1<<d,d=t[d],d>s&&(s=d),o&=~u}if(o=s,o=lt()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*jm(o/1960))-o,10<o){e.timeoutHandle=Ti(Jo.bind(null,e,Gt,lo),o);break}Jo(e,Gt,lo);break;case 5:Jo(e,Gt,lo);break;default:throw Error(a(329))}}}return Kt(e,lt()),e.callbackNode===n?rd.bind(null,e):null}function Ca(e,t){var n=jl;return e.current.memoizedState.isDehydrated&&(Zo(e,t).flags|=256),e=Fs(e,t),e!==2&&(t=Gt,Gt=n,t!==null&&Sa(t)),e}function Sa(e){Gt===null?Gt=e:Gt.push.apply(Gt,e)}function Em(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var o=0;o<n.length;o++){var s=n[o],u=s.getSnapshot;s=s.value;try{if(!bn(u(),s))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Co(e,t){for(t&=~va,t&=~Rs,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-en(t),o=1<<n;e[n]=-1,t&=~o}}function ld(e){if((Xe&6)!==0)throw Error(a(327));Dr();var t=Rn(e,0);if((t&1)===0)return Kt(e,lt()),null;var n=Fs(e,t);if(e.tag!==0&&n===2){var o=uo(e);o!==0&&(t=o,n=Ca(e,o))}if(n===1)throw n=Sl,Zo(e,0),Co(e,t),Kt(e,lt()),n;if(n===6)throw Error(a(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Jo(e,Gt,lo),Kt(e,lt()),null}function ja(e,t){var n=Xe;Xe|=1;try{return e(t)}finally{Xe=n,Xe===0&&(Fr=lt()+500,ds&&go())}}function Ko(e){wo!==null&&wo.tag===0&&(Xe&6)===0&&Dr();var t=Xe;Xe|=1;var n=hn.transition,o=He;try{if(hn.transition=null,He=1,e)return e()}finally{He=o,hn.transition=n,Xe=t,(Xe&6)===0&&go()}}function Ea(){sn=Or.current,rt(Or)}function Zo(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,om(n)),yt!==null)for(n=yt.return;n!==null;){var o=n;switch(zi(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&us();break;case 3:$r(),rt(Vt),rt(zt),Gi();break;case 5:Xi(o);break;case 4:$r();break;case 13:rt(ct);break;case 19:rt(ct);break;case 10:Wi(o.type._context);break;case 22:case 23:Ea()}n=n.return}if(jt=e,yt=e=So(e.current,null),Rt=sn=t,kt=0,Sl=null,va=Rs=Go=0,Gt=jl=null,Vo!==null){for(t=0;t<Vo.length;t++)if(n=Vo[t],o=n.interleaved,o!==null){n.interleaved=null;var s=o.next,u=n.pending;if(u!==null){var d=u.next;u.next=s,o.next=d}n.pending=o}Vo=null}return e}function sd(e,t){do{var n=yt;try{if(Bi(),bs.current=Ss,ws){for(var o=dt.memoizedState;o!==null;){var s=o.queue;s!==null&&(s.pending=null),o=o.next}ws=!1}if(Qo=0,St=wt=dt=null,xl=!1,vl=0,xa.current=null,n===null||n.return===null){kt=1,Sl=t,yt=null;break}e:{var u=e,d=n.return,j=n,T=t;if(t=Rt,j.flags|=32768,T!==null&&typeof T=="object"&&typeof T.then=="function"){var A=T,te=j,oe=te.tag;if((te.mode&1)===0&&(oe===0||oe===11||oe===15)){var q=te.alternate;q?(te.updateQueue=q.updateQueue,te.memoizedState=q.memoizedState,te.lanes=q.lanes):(te.updateQueue=null,te.memoizedState=null)}var me=Lc(d);if(me!==null){me.flags&=-257,Rc(me,d,j,u,t),me.mode&1&&Tc(u,A,t),t=me,T=A;var ye=t.updateQueue;if(ye===null){var xe=new Set;xe.add(T),t.updateQueue=xe}else ye.add(T);break e}else{if((t&1)===0){Tc(u,A,t),Na();break e}T=Error(a(426))}}else if(at&&j.mode&1){var ht=Lc(d);if(ht!==null){(ht.flags&65536)===0&&(ht.flags|=256),Rc(ht,d,j,u,t),Di(Mr(T,j));break e}}u=T=Mr(T,j),kt!==4&&(kt=2),jl===null?jl=[u]:jl.push(u),u=d;do{switch(u.tag){case 3:u.flags|=65536,t&=-t,u.lanes|=t;var z=Nc(u,T,t);tc(u,z);break e;case 1:j=T;var I=u.type,F=u.stateNode;if((u.flags&128)===0&&(typeof I.getDerivedStateFromError=="function"||F!==null&&typeof F.componentDidCatch=="function"&&(bo===null||!bo.has(F)))){u.flags|=65536,t&=-t,u.lanes|=t;var le=Pc(u,j,t);tc(u,le);break e}}u=u.return}while(u!==null)}ud(n)}catch(be){t=be,yt===n&&n!==null&&(yt=n=n.return);continue}break}while(!0)}function id(){var e=Ls.current;return Ls.current=Ss,e===null?Ss:e}function Na(){(kt===0||kt===3||kt===2)&&(kt=4),jt===null||(Go&268435455)===0&&(Rs&268435455)===0||Co(jt,Rt)}function Fs(e,t){var n=Xe;Xe|=2;var o=id();(jt!==e||Rt!==t)&&(lo=null,Zo(e,t));do try{Nm();break}catch(s){sd(e,s)}while(!0);if(Bi(),Xe=n,Ls.current=o,yt!==null)throw Error(a(261));return jt=null,Rt=0,kt}function Nm(){for(;yt!==null;)ad(yt)}function Pm(){for(;yt!==null&&!Xl();)ad(yt)}function ad(e){var t=fd(e.alternate,e,sn);e.memoizedProps=e.pendingProps,t===null?ud(e):yt=t,xa.current=null}function ud(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=bm(n,t,sn),n!==null){yt=n;return}}else{if(n=wm(n,t),n!==null){n.flags&=32767,yt=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{kt=6,yt=null;return}}if(t=t.sibling,t!==null){yt=t;return}yt=t=e}while(t!==null);kt===0&&(kt=5)}function Jo(e,t,n){var o=He,s=hn.transition;try{hn.transition=null,He=1,Tm(e,t,n,o)}finally{hn.transition=s,He=o}return null}function Tm(e,t,n,o){do Dr();while(wo!==null);if((Xe&6)!==0)throw Error(a(327));n=e.finishedWork;var s=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(a(177));e.callbackNode=null,e.callbackPriority=0;var u=n.lanes|n.childLanes;if(Kl(e,u),e===jt&&(yt=jt=null,Rt=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||$s||($s=!0,md($o,function(){return Dr(),null})),u=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||u){u=hn.transition,hn.transition=null;var d=He;He=1;var j=Xe;Xe|=4,xa.current=null,Cm(e,n),qc(n,e),Kf(Ni),Bo=!!Ei,Ni=Ei=null,e.current=n,Sm(n),io(),Xe=j,He=d,hn.transition=u}else e.current=n;if($s&&($s=!1,wo=e,Ms=s),u=e.pendingLanes,u===0&&(bo=null),fr(n.stateNode),Kt(e,lt()),t!==null)for(o=e.onRecoverableError,n=0;n<t.length;n++)s=t[n],o(s.value,{componentStack:s.stack,digest:s.digest});if(Is)throw Is=!1,e=wa,wa=null,e;return(Ms&1)!==0&&e.tag!==0&&Dr(),u=e.pendingLanes,(u&1)!==0?e===ka?El++:(El=0,ka=e):El=0,go(),null}function Dr(){if(wo!==null){var e=Je(Ms),t=hn.transition,n=He;try{if(hn.transition=null,He=16>e?16:e,wo===null)var o=!1;else{if(e=wo,wo=null,Ms=0,(Xe&6)!==0)throw Error(a(331));var s=Xe;for(Xe|=4,pe=e.current;pe!==null;){var u=pe,d=u.child;if((pe.flags&16)!==0){var j=u.deletions;if(j!==null){for(var T=0;T<j.length;T++){var A=j[T];for(pe=A;pe!==null;){var te=pe;switch(te.tag){case 0:case 11:case 15:Cl(8,te,u)}var oe=te.child;if(oe!==null)oe.return=te,pe=oe;else for(;pe!==null;){te=pe;var q=te.sibling,me=te.return;if(Qc(te),te===A){pe=null;break}if(q!==null){q.return=me,pe=q;break}pe=me}}}var ye=u.alternate;if(ye!==null){var xe=ye.child;if(xe!==null){ye.child=null;do{var ht=xe.sibling;xe.sibling=null,xe=ht}while(xe!==null)}}pe=u}}if((u.subtreeFlags&2064)!==0&&d!==null)d.return=u,pe=d;else e:for(;pe!==null;){if(u=pe,(u.flags&2048)!==0)switch(u.tag){case 0:case 11:case 15:Cl(9,u,u.return)}var z=u.sibling;if(z!==null){z.return=u.return,pe=z;break e}pe=u.return}}var I=e.current;for(pe=I;pe!==null;){d=pe;var F=d.child;if((d.subtreeFlags&2064)!==0&&F!==null)F.return=d,pe=F;else e:for(d=I;pe!==null;){if(j=pe,(j.flags&2048)!==0)try{switch(j.tag){case 0:case 11:case 15:Ts(9,j)}}catch(be){mt(j,j.return,be)}if(j===d){pe=null;break e}var le=j.sibling;if(le!==null){le.return=j.return,pe=le;break e}pe=j.return}}if(Xe=s,go(),$t&&typeof $t.onPostCommitFiberRoot=="function")try{$t.onPostCommitFiberRoot(Qn,e)}catch{}o=!0}return o}finally{He=n,hn.transition=t}}return!1}function cd(e,t,n){t=Mr(n,t),t=Nc(e,t,1),e=xo(e,t,1),t=Wt(),e!==null&&(Oo(e,1,t),Kt(e,t))}function mt(e,t,n){if(e.tag===3)cd(e,e,n);else for(;t!==null;){if(t.tag===3){cd(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(bo===null||!bo.has(o))){e=Mr(n,e),e=Pc(t,e,1),t=xo(t,e,1),e=Wt(),t!==null&&(Oo(t,1,e),Kt(t,e));break}}t=t.return}}function Lm(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),t=Wt(),e.pingedLanes|=e.suspendedLanes&n,jt===e&&(Rt&n)===n&&(kt===4||kt===3&&(Rt&130023424)===Rt&&500>lt()-ba?Zo(e,0):va|=n),Kt(e,t)}function dd(e,t){t===0&&((e.mode&1)===0?t=1:(t=At,At<<=1,(At&130023424)===0&&(At=4194304)));var n=Wt();e=no(e,t),e!==null&&(Oo(e,t,n),Kt(e,n))}function Rm(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),dd(e,n)}function Im(e,t){var n=0;switch(e.tag){case 13:var o=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(a(314))}o!==null&&o.delete(t),dd(e,n)}var fd;fd=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Vt.current)Qt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return Qt=!1,vm(e,t,n);Qt=(e.flags&131072)!==0}else Qt=!1,at&&(t.flags&1048576)!==0&&Uu(t,ms,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;Ns(e,t),e=t.pendingProps;var s=Er(t,zt.current);Ir(t,n),s=Ji(null,t,o,e,s,n);var u=qi();return t.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Xt(o)?(u=!0,cs(t)):u=!1,t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,Ui(t),s.updater=js,t.stateNode=s,s._reactInternals=t,la(t,o,e,n),t=ua(null,t,o,!0,u,n)):(t.tag=0,at&&u&&Mi(t),Bt(null,t,s,n),t=t.child),t;case 16:o=t.elementType;e:{switch(Ns(e,t),e=t.pendingProps,s=o._init,o=s(o._payload),t.type=o,s=t.tag=Mm(o),e=kn(o,e),s){case 0:t=aa(null,t,o,e,n);break e;case 1:t=Fc(null,t,o,e,n);break e;case 11:t=Ic(null,t,o,e,n);break e;case 14:t=$c(null,t,o,kn(o.type,e),n);break e}throw Error(a(306,o,""))}return t;case 0:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),aa(e,t,o,s,n);case 1:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),Fc(e,t,o,s,n);case 3:e:{if(Dc(t),e===null)throw Error(a(387));o=t.pendingProps,u=t.memoizedState,s=u.element,ec(e,t),xs(t,o,null,n);var d=t.memoizedState;if(o=d.element,u.isDehydrated)if(u={element:o,isDehydrated:!1,cache:d.cache,pendingSuspenseBoundaries:d.pendingSuspenseBoundaries,transitions:d.transitions},t.updateQueue.baseState=u,t.memoizedState=u,t.flags&256){s=Mr(Error(a(423)),t),t=Ac(e,t,o,n,s);break e}else if(o!==s){s=Mr(Error(a(424)),t),t=Ac(e,t,o,n,s);break e}else for(ln=po(t.stateNode.containerInfo.firstChild),rn=t,at=!0,wn=null,n=Ju(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Tr(),o===s){t=ro(e,t,n);break e}Bt(e,t,o,n)}t=t.child}return t;case 5:return oc(t),e===null&&Fi(t),o=t.type,s=t.pendingProps,u=e!==null?e.memoizedProps:null,d=s.children,Pi(o,s)?d=null:u!==null&&Pi(o,u)&&(t.flags|=32),Oc(e,t),Bt(e,t,d,n),t.child;case 6:return e===null&&Fi(t),null;case 13:return Bc(e,t,n);case 4:return Vi(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Lr(t,null,o,n):Bt(e,t,o,n),t.child;case 11:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),Ic(e,t,o,s,n);case 7:return Bt(e,t,t.pendingProps,n),t.child;case 8:return Bt(e,t,t.pendingProps.children,n),t.child;case 12:return Bt(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(o=t.type._context,s=t.pendingProps,u=t.memoizedProps,d=s.value,tt(_s,o._currentValue),o._currentValue=d,u!==null)if(bn(u.value,d)){if(u.children===s.children&&!Vt.current){t=ro(e,t,n);break e}}else for(u=t.child,u!==null&&(u.return=t);u!==null;){var j=u.dependencies;if(j!==null){d=u.child;for(var T=j.firstContext;T!==null;){if(T.context===o){if(u.tag===1){T=oo(-1,n&-n),T.tag=2;var A=u.updateQueue;if(A!==null){A=A.shared;var te=A.pending;te===null?T.next=T:(T.next=te.next,te.next=T),A.pending=T}}u.lanes|=n,T=u.alternate,T!==null&&(T.lanes|=n),Yi(u.return,n,t),j.lanes|=n;break}T=T.next}}else if(u.tag===10)d=u.type===t.type?null:u.child;else if(u.tag===18){if(d=u.return,d===null)throw Error(a(341));d.lanes|=n,j=d.alternate,j!==null&&(j.lanes|=n),Yi(d,n,t),d=u.sibling}else d=u.child;if(d!==null)d.return=u;else for(d=u;d!==null;){if(d===t){d=null;break}if(u=d.sibling,u!==null){u.return=d.return,d=u;break}d=d.return}u=d}Bt(e,t,s.children,n),t=t.child}return t;case 9:return s=t.type,o=t.pendingProps.children,Ir(t,n),s=mn(s),o=o(s),t.flags|=1,Bt(e,t,o,n),t.child;case 14:return o=t.type,s=kn(o,t.pendingProps),s=kn(o.type,s),$c(e,t,o,s,n);case 15:return Mc(e,t,t.type,t.pendingProps,n);case 17:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),Ns(e,t),t.tag=1,Xt(o)?(e=!0,cs(t)):e=!1,Ir(t,n),jc(t,o,s),la(t,o,s,n),ua(null,t,o,!0,e,n);case 19:return Yc(e,t,n);case 22:return zc(e,t,n)}throw Error(a(156,t.tag))};function md(e,t){return cr(e,t)}function $m(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _n(e,t,n,o){return new $m(e,t,n,o)}function Pa(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Mm(e){if(typeof e=="function")return Pa(e)?1:0;if(e!=null){if(e=e.$$typeof,e===de)return 11;if(e===ze)return 14}return 2}function So(e,t){var n=e.alternate;return n===null?(n=_n(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Ds(e,t,n,o,s,u){var d=2;if(o=e,typeof e=="function")Pa(e)&&(d=1);else if(typeof e=="string")d=5;else e:switch(e){case ue:return qo(n.children,s,u,t);case v:d=8,s|=8;break;case G:return e=_n(12,n,t,s|2),e.elementType=G,e.lanes=u,e;case Me:return e=_n(13,n,t,s),e.elementType=Me,e.lanes=u,e;case Oe:return e=_n(19,n,t,s),e.elementType=Oe,e.lanes=u,e;case W:return As(n,s,u,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case fe:d=10;break e;case Z:d=9;break e;case de:d=11;break e;case ze:d=14;break e;case O:d=16,o=null;break e}throw Error(a(130,e==null?e:typeof e,""))}return t=_n(d,n,t,s),t.elementType=e,t.type=o,t.lanes=u,t}function qo(e,t,n,o){return e=_n(7,e,o,t),e.lanes=n,e}function As(e,t,n,o){return e=_n(22,e,o,t),e.elementType=W,e.lanes=n,e.stateNode={isHidden:!1},e}function Ta(e,t,n){return e=_n(6,e,null,t),e.lanes=n,e}function La(e,t,n){return t=_n(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function zm(e,t,n,o,s){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=zo(0),this.expirationTimes=zo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=zo(0),this.identifierPrefix=o,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function Ra(e,t,n,o,s,u,d,j,T){return e=new zm(e,t,n,j,T),t===1?(t=1,u===!0&&(t|=8)):t=0,u=_n(3,null,null,t),e.current=u,u.stateNode=e,u.memoizedState={element:o,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ui(u),e}function Om(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ie,key:o==null?null:""+o,children:e,containerInfo:t,implementation:n}}function pd(e){if(!e)return _o;e=e._reactInternals;e:{if(pt(e)!==e||e.tag!==1)throw Error(a(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Xt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(a(171))}if(e.tag===1){var n=e.type;if(Xt(n))return Wu(e,n,t)}return t}function hd(e,t,n,o,s,u,d,j,T){return e=Ra(n,o,!0,e,s,u,d,j,T),e.context=pd(null),n=e.current,o=Wt(),s=ko(n),u=oo(o,s),u.callback=t??null,xo(n,u,s),e.current.lanes=s,Oo(e,s,o),Kt(e,o),e}function Bs(e,t,n,o){var s=t.current,u=Wt(),d=ko(s);return n=pd(n),t.context===null?t.context=n:t.pendingContext=n,t=oo(u,d),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=xo(s,t,d),e!==null&&(jn(e,s,d,u),ys(e,s,d)),d}function Ws(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function _d(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Ia(e,t){_d(e,t),(e=e.alternate)&&_d(e,t)}function Fm(){return null}var gd=typeof reportError=="function"?reportError:function(e){console.error(e)};function $a(e){this._internalRoot=e}Ys.prototype.render=$a.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(a(409));Bs(e,t,null,null)},Ys.prototype.unmount=$a.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ko(function(){Bs(null,e,null,null)}),t[Jn]=null}};function Ys(e){this._internalRoot=e}Ys.prototype.unstable_scheduleHydration=function(e){if(e){var t=ol();e={blockedOn:null,target:e,priority:t};for(var n=0;n<tn.length&&t!==0&&t<tn[n].priority;n++);tn.splice(n,0,e),n===0&&_r(e)}};function Ma(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Hs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function yd(){}function Dm(e,t,n,o,s){if(s){if(typeof o=="function"){var u=o;o=function(){var A=Ws(d);u.call(A)}}var d=hd(t,o,e,0,null,!1,!1,"",yd);return e._reactRootContainer=d,e[Jn]=d.current,dl(e.nodeType===8?e.parentNode:e),Ko(),d}for(;s=e.lastChild;)e.removeChild(s);if(typeof o=="function"){var j=o;o=function(){var A=Ws(T);j.call(A)}}var T=Ra(e,0,!1,null,null,!1,!1,"",yd);return e._reactRootContainer=T,e[Jn]=T.current,dl(e.nodeType===8?e.parentNode:e),Ko(function(){Bs(t,T,n,o)}),T}function Us(e,t,n,o,s){var u=n._reactRootContainer;if(u){var d=u;if(typeof s=="function"){var j=s;s=function(){var T=Ws(d);j.call(T)}}Bs(t,d,e,s)}else d=Dm(n,t,e,s,o);return Ws(d)}nl=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=vn(t.pendingLanes);n!==0&&(pr(t,n|1),Kt(t,lt()),(Xe&6)===0&&(Fr=lt()+500,go()))}break;case 13:Ko(function(){var o=no(e,1);if(o!==null){var s=Wt();jn(o,e,1,s)}}),Ia(e,1)}},hr=function(e){if(e.tag===13){var t=no(e,134217728);if(t!==null){var n=Wt();jn(t,e,134217728,n)}Ia(e,134217728)}},Zl=function(e){if(e.tag===13){var t=ko(e),n=no(e,t);if(n!==null){var o=Wt();jn(n,e,t,o)}Ia(e,t)}},ol=function(){return He},Fo=function(e,t){var n=He;try{return He=e,t()}finally{He=n}},Gr=function(e,t,n){switch(t){case"input":if(nr(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var s=as(o);if(!s)throw Error(a(90));Ur(o),nr(o,s)}}}break;case"textarea":Pn(e,n);break;case"select":t=n.value,t!=null&&It(e,!!n.multiple,t,!1)}},Xn=ja,qt=Ko;var Am={usingClientEntryPoint:!1,Events:[pl,Sr,as,Vn,ut,ja]},Nl={findFiberByHostInstance:Wo,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Bm={bundleType:Nl.bundleType,version:Nl.version,rendererPackageName:Nl.rendererPackageName,rendererConfig:Nl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:se.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ln(e),e===null?null:e.stateNode},findFiberByHostInstance:Nl.findFiberByHostInstance||Fm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Vs=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Vs.isDisabled&&Vs.supportsFiber)try{Qn=Vs.inject(Bm),$t=Vs}catch{}}return Zt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Am,Zt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ma(t))throw Error(a(200));return Om(e,t,null,n)},Zt.createRoot=function(e,t){if(!Ma(e))throw Error(a(299));var n=!1,o="",s=gd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=Ra(e,1,!1,null,null,n,!1,o,s),e[Jn]=t.current,dl(e.nodeType===8?e.parentNode:e),new $a(t)},Zt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(a(188)):(e=Object.keys(e).join(","),Error(a(268,e)));return e=Ln(t),e=e===null?null:e.stateNode,e},Zt.flushSync=function(e){return Ko(e)},Zt.hydrate=function(e,t,n){if(!Hs(t))throw Error(a(200));return Us(null,e,t,!0,n)},Zt.hydrateRoot=function(e,t,n){if(!Ma(e))throw Error(a(405));var o=n!=null&&n.hydratedSources||null,s=!1,u="",d=gd;if(n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(u=n.identifierPrefix),n.onRecoverableError!==void 0&&(d=n.onRecoverableError)),t=hd(t,null,e,1,n??null,s,!1,u,d),e[Jn]=t.current,dl(e),o)for(e=0;e<o.length;e++)n=o[e],s=n._getVersion,s=s(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,s]:t.mutableSourceEagerHydrationData.push(n,s);return new Ys(t)},Zt.render=function(e,t,n){if(!Hs(t))throw Error(a(200));return Us(null,e,t,!1,n)},Zt.unmountComponentAtNode=function(e){if(!Hs(e))throw Error(a(40));return e._reactRootContainer?(Ko(function(){Us(null,null,e,!1,function(){e._reactRootContainer=null,e[Jn]=null})}),!0):!1},Zt.unstable_batchedUpdates=ja,Zt.unstable_renderSubtreeIntoContainer=function(e,t,n,o){if(!Hs(n))throw Error(a(200));if(e==null||e._reactInternals===void 0)throw Error(a(38));return Us(e,t,n,!1,o)},Zt.version="18.3.1-next-f1338f8080-20240426",Zt}var jd;function sf(){if(jd)return Fa.exports;jd=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(i){console.error(i)}}return r(),Fa.exports=Qm(),Fa.exports}var Ed;function Gm(){if(Ed)return Xs;Ed=1;var r=sf();return Xs.createRoot=r.createRoot,Xs.hydrateRoot=r.hydrateRoot,Xs}var Km=Gm();const Zm={},Nd=r=>{let i;const a=new Set,c=(k,P)=>{const g=typeof k=="function"?k(i):k;if(!Object.is(g,i)){const E=i;i=P??(typeof g!="object"||g===null)?g:Object.assign({},i,g),a.forEach(b=>b(i,E))}},p=()=>i,f={setState:c,getState:p,getInitialState:()=>$,subscribe:k=>(a.add(k),()=>a.delete(k)),destroy:()=>{(Zm?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),a.clear()}},$=i=r(c,p,f);return f},Jm=r=>r?Nd(r):Nd;var Ba={exports:{}},Wa={},Ya={exports:{}},Ha={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Pd;function qm(){if(Pd)return Ha;Pd=1;var r=Al();function i(P,g){return P===g&&(P!==0||1/P===1/g)||P!==P&&g!==g}var a=typeof Object.is=="function"?Object.is:i,c=r.useState,p=r.useEffect,h=r.useLayoutEffect,m=r.useDebugValue;function x(P,g){var E=g(),b=c({inst:{value:E,getSnapshot:g}}),_=b[0].inst,y=b[1];return h(function(){_.value=E,_.getSnapshot=g,f(_)&&y({inst:_})},[P,E,g]),p(function(){return f(_)&&y({inst:_}),P(function(){f(_)&&y({inst:_})})},[P]),m(E),E}function f(P){var g=P.getSnapshot;P=P.value;try{var E=g();return!a(P,E)}catch{return!0}}function $(P,g){return g()}var k=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?$:x;return Ha.useSyncExternalStore=r.useSyncExternalStore!==void 0?r.useSyncExternalStore:k,Ha}var Td;function ep(){return Td||(Td=1,Ya.exports=qm()),Ya.exports}/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ld;function tp(){if(Ld)return Wa;Ld=1;var r=Al(),i=ep();function a($,k){return $===k&&($!==0||1/$===1/k)||$!==$&&k!==k}var c=typeof Object.is=="function"?Object.is:a,p=i.useSyncExternalStore,h=r.useRef,m=r.useEffect,x=r.useMemo,f=r.useDebugValue;return Wa.useSyncExternalStoreWithSelector=function($,k,P,g,E){var b=h(null);if(b.current===null){var _={hasValue:!1,value:null};b.current=_}else _=b.current;b=x(function(){function R(ie){if(!ee){if(ee=!0,ne=ie,ie=g(ie),E!==void 0&&_.hasValue){var ue=_.value;if(E(ue,ie))return se=ue}return se=ie}if(ue=se,c(ne,ie))return ue;var v=g(ie);return E!==void 0&&E(ue,v)?(ne=ie,ue):(ne=ie,se=v)}var ee=!1,ne,se,re=P===void 0?null:P;return[function(){return R(k())},re===null?void 0:function(){return R(re())}]},[k,P,g,E]);var y=p($,b[0],b[1]);return m(function(){_.hasValue=!0,_.value=y},[y]),f(y),y},Wa}var Rd;function np(){return Rd||(Rd=1,Ba.exports=tp()),Ba.exports}var op=np();const rp=rf(op),af={},{useDebugValue:lp}=lf,{useSyncExternalStoreWithSelector:sp}=rp;let Id=!1;const ip=r=>r;function ap(r,i=ip,a){(af?"production":void 0)!=="production"&&a&&!Id&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),Id=!0);const c=sp(r.subscribe,r.getState,r.getServerState||r.getInitialState,i,a);return lp(c),c}const $d=r=>{(af?"production":void 0)!=="production"&&typeof r!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const i=typeof r=="function"?Jm(r):r,a=(c,p)=>ap(i,c,p);return Object.assign(a,i),a},up=r=>r?$d(r):$d,Fl={iphone:{w:400,h:868},ipad:{w:500,h:716},mac:{w:640,h:400},watch:{w:205,h:251},android:{w:400,h:711}},li={iphone:{deviceScale:92,deviceTop:15,deviceAngle:8},ipad:{deviceScale:92,deviceTop:15,deviceAngle:8},mac:{deviceScale:85,deviceTop:20,deviceAngle:0},watch:{deviceScale:80,deviceTop:22,deviceAngle:0},android:{deviceScale:92,deviceTop:15,deviceAngle:8}};function Qs(r,i,a){var h;const c=i.screens[r],p=li[a]??li.iphone;return{screenIndex:r,headline:c?c.headline:"New Screen",subtitle:c?c.subtitle??"":"",style:"minimal",layout:"center",font:i.theme.font,fontWeight:i.theme.fontWeight,headlineSize:i.theme.headlineSize??0,subtitleSize:i.theme.subtitleSize??0,headlineRotation:0,subtitleRotation:0,colors:{primary:i.theme.colors.primary,secondary:i.theme.colors.secondary,background:i.theme.colors.background,text:i.theme.colors.text,subtitle:i.theme.colors.subtitle??"#64748B"},frameId:i.frames.ios??i.frames.android??"",deviceColor:i.frames.deviceColor??"",frameStyle:i.frames.style==="3d"?"flat":i.frames.style,composition:"single",deviceScale:p.deviceScale,deviceTop:p.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:p.deviceAngle,deviceTilt:0,headlineGradient:null,subtitleGradient:null,autoSizeHeadline:!0,autoSizeSubtitle:!1,headlineLineHeight:0,headlineLetterSpacing:0,headlineTextTransform:"",headlineFontStyle:"",subtitleOpacity:0,subtitleLetterSpacing:0,subtitleTextTransform:"",spotlight:null,annotations:[],textPositions:{headline:null,subtitle:null},screenshotDataUrl:null,screenshotName:((h=c==null?void 0:c.screenshot)==null?void 0:h.split("/").pop())??null,screenshotDims:null,backgroundType:"solid",backgroundColor:"#ffffff",backgroundGradient:{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"},backgroundImageDataUrl:null,backgroundOverlay:null,deviceShadow:null,borderSimulation:null,cornerRadius:0,loupe:null,callouts:[],overlays:[],extraScreenshots:[]}}const cp=50;let Yr=[],ri=[],zl=!1;function xt(r){return JSON.parse(JSON.stringify(r))}function An(r){zl||(Yr.push({screens:xt(r.screens),panoramicElements:xt(r.panoramicElements),panoramicBackground:xt(r.panoramicBackground),panoramicEffects:xt(r.panoramicEffects),selectedScreen:r.selectedScreen,selectedElementIndex:r.selectedElementIndex}),ri=[],Yr.length>cp&&Yr.shift())}const V=up((r,i)=>({config:null,platform:"iphone",previewW:400,previewH:868,selectedScreen:0,activeTab:"background",locale:"default",previewBg:"dark",renderVersion:0,isPanoramic:!1,panoramicFrameCount:5,panoramicBackground:{type:"solid",color:"#ffffff"},panoramicElements:[],panoramicEffects:{spotlight:null,annotations:[],overlays:[]},selectedElementIndex:null,fonts:[],frames:[],deviceFamilies:[],koubouAvailable:!1,sizes:{},exportSize:"",exportRenderer:"playwright",screens:[],setConfig:a=>r({config:a}),setPlatform:a=>r({platform:a}),setPreviewSize:(a,c)=>r({previewW:a,previewH:c}),setSelectedScreen:a=>r({selectedScreen:a}),setActiveTab:a=>r({activeTab:a}),setLocale:a=>r({locale:a}),setPreviewBg:a=>r({previewBg:a}),setExportSize:a=>r({exportSize:a}),setExportRenderer:a=>r({exportRenderer:a}),setFonts:a=>r({fonts:a}),setFrames:a=>r({frames:a}),setDeviceFamilies:a=>r({deviceFamilies:a}),setKoubouAvailable:a=>r({koubouAvailable:a}),setSizes:a=>r({sizes:a}),updateScreen:(a,c)=>r(p=>{const h=[...p.screens],m=h[a];return m?(An(p),h[a]={...m,...c},{screens:h}):p}),triggerRender:()=>r(a=>({renderVersion:a.renderVersion+1})),initScreens:(a,c)=>{const p=a.mode==="panoramic",h=a.screens.length>0?a.screens.map((x,f)=>Qs(f,a,c)):[],m=a.panoramic?{panoramicFrameCount:a.frameCount??5,panoramicBackground:a.panoramic.background,panoramicElements:a.panoramic.elements}:{};r({config:a,isPanoramic:p,screens:h,selectedScreen:0,selectedElementIndex:null,...m})},addScreen:()=>r(a=>{const{screens:c,config:p,platform:h}=a;if(!p)return a;An(a);const m=c[c.length-1],x=Qs(0,p,h);return x.screenIndex=c.length,x.headline=`Screen ${c.length+1}`,x.subtitle="",m&&(x.style=m.style,x.layout=m.layout,x.font=m.font,x.fontWeight=m.fontWeight,x.colors={...m.colors},x.frameId=m.frameId,x.deviceColor=m.deviceColor,x.frameStyle=m.frameStyle,x.composition=m.composition,x.deviceScale=m.deviceScale,x.deviceTop=m.deviceTop),{screens:[...c,x],selectedScreen:c.length}}),removeScreen:a=>r(c=>{if(c.screens.length<=1)return c;An(c);const p=c.screens.filter((m,x)=>x!==a).map((m,x)=>({...m,screenIndex:x}));let h=c.selectedScreen;return h>=p.length?h=p.length-1:h>a&&h--,{screens:p,selectedScreen:h}}),moveScreen:(a,c)=>r(p=>{if(c<0||c>=p.screens.length)return p;An(p);const h=[...p.screens],[m]=h.splice(a,1);return m?(h.splice(c,0,m),{screens:h.map((x,f)=>({...x,screenIndex:f})),selectedScreen:c}):p}),togglePanoramic:()=>r(a=>{var p;if(a.isPanoramic){if(a.screens.length===0&&a.config){const h=a.platform;return a.config.screens.length>0?{isPanoramic:!1,screens:a.config.screens.map((x,f)=>Qs(f,a.config,h)),selectedScreen:0}:{isPanoramic:!1,screens:[Qs(0,a.config,h)],selectedScreen:0}}return{isPanoramic:!1}}const c={isPanoramic:!0,selectedElementIndex:null};if(a.panoramicElements.length===0&&a.config&&a.screens.length>0){const h=a.config.theme.colors,m=a.screens.length;c.panoramicFrameCount=m,c.panoramicBackground={type:"solid",color:"#ffffff"};const x=[];for(let f=0;f<m;f++){const $=a.screens[f],k=f/m*100,P=k+100/m/2;x.push({type:"device",screenshot:((p=a.config.screens[f])==null?void 0:p.screenshot)??`screenshots/screen-${f+1}.png`,frame:$.frameId||void 0,x:P-6,y:20,width:12,rotation:$.deviceRotation||0,z:5}),$.headline&&x.push({type:"text",content:$.headline,x:k+2,y:3,fontSize:3,color:h.text??"#FFFFFF",fontWeight:a.config.theme.fontWeight??700,fontStyle:"normal",textAlign:"left",lineHeight:1.15,maxWidth:Math.floor(100/m)-4,z:10})}c.panoramicElements=x}else a.panoramicElements.length===0&&a.config&&a.panoramicBackground.type==="solid"&&(!a.panoramicBackground.color||a.panoramicBackground.color==="#000000")&&(c.panoramicBackground={type:"solid",color:"#ffffff"});return c}),setSelectedElement:a=>r({selectedElementIndex:a}),updatePanoramicBackground:a=>r(c=>(An(c),{panoramicBackground:{...c.panoramicBackground,...a}})),updatePanoramicElement:(a,c)=>r(p=>{const h=[...p.panoramicElements],m=h[a];return m?(An(p),h[a]={...m,...c},{panoramicElements:h}):p}),addPanoramicElement:a=>r(c=>(An(c),{panoramicElements:[...c.panoramicElements,a],selectedElementIndex:c.panoramicElements.length})),removePanoramicElement:a=>r(c=>{An(c);const p=c.panoramicElements.filter((m,x)=>x!==a);let h=c.selectedElementIndex;return h!==null&&(h===a?h=null:h>a&&h--),{panoramicElements:p,selectedElementIndex:h}}),setPanoramicFrameCount:a=>r(c=>{const p=c.panoramicFrameCount;if(p===a)return c;An(c);const h=p/a,m=c.panoramicElements.map(x=>{const f={...x,x:x.x*h};return x.type==="device"?{...f,width:x.width*h}:x.type==="text"&&x.maxWidth?{...f,maxWidth:x.maxWidth*h}:x.type==="decoration"?{...f,width:x.width*h}:f});return{panoramicFrameCount:a,panoramicElements:m}}),updatePanoramicEffects:a=>r(c=>(An(c),{panoramicEffects:{...c.panoramicEffects,...a}})),undo:()=>{if(Yr.length===0)return;const a=i();ri.push({screens:xt(a.screens),panoramicElements:xt(a.panoramicElements),panoramicBackground:xt(a.panoramicBackground),panoramicEffects:xt(a.panoramicEffects),selectedScreen:a.selectedScreen,selectedElementIndex:a.selectedElementIndex});const c=Yr.pop();zl=!0,r({screens:xt(c.screens),panoramicElements:xt(c.panoramicElements),panoramicBackground:xt(c.panoramicBackground),panoramicEffects:xt(c.panoramicEffects),selectedScreen:c.selectedScreen,selectedElementIndex:c.selectedElementIndex}),zl=!1},redo:()=>{if(ri.length===0)return;const a=i();Yr.push({screens:xt(a.screens),panoramicElements:xt(a.panoramicElements),panoramicBackground:xt(a.panoramicBackground),panoramicEffects:xt(a.panoramicEffects),selectedScreen:a.selectedScreen,selectedElementIndex:a.selectedElementIndex});const c=ri.pop();zl=!0,r({screens:xt(c.screens),panoramicElements:xt(c.panoramicElements),panoramicBackground:xt(c.panoramicBackground),panoramicEffects:xt(c.panoramicEffects),selectedScreen:c.selectedScreen,selectedElementIndex:c.selectedElementIndex}),zl=!1}})),Wn="";async function uf(){const r=await fetch(`${Wn}/api/config`);if(!r.ok)throw new Error(`Failed to fetch config: ${r.statusText}`);return r.json()}async function dp(){return await fetch(`${Wn}/api/reload`,{method:"POST"}),uf()}async function fp(r,i){const a=await fetch(`${Wn}/api/preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:i});if(!a.ok)throw new Error(`Preview render failed: ${a.statusText}`);return a.text()}async function mp(){const r=await fetch(`${Wn}/api/frames`);if(!r.ok)throw new Error(`Failed to fetch frames: ${r.statusText}`);return r.json()}async function pp(){const r=await fetch(`${Wn}/api/fonts`);if(!r.ok)throw new Error(`Failed to fetch fonts: ${r.statusText}`);return r.json()}async function hp(){const r=await fetch(`${Wn}/api/koubou-devices`);if(!r.ok)throw new Error(`Failed to fetch koubou devices: ${r.statusText}`);return r.json()}async function _p(){const r=await fetch(`${Wn}/api/sizes`);if(!r.ok)throw new Error(`Failed to fetch sizes: ${r.statusText}`);return r.json()}async function gp(r,i){const a=await fetch(`${Wn}/api/panoramic-preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:i});if(!a.ok)throw new Error(`Panoramic preview failed: ${a.statusText}`);return a.text()}async function Md(r){const i=await fetch(`${Wn}/api/export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!i.ok)throw new Error(`Export failed: ${i.statusText}`);return i.blob()}async function zd(r){const i=await fetch(`${Wn}/api/panoramic-export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!i.ok)throw new Error(`Panoramic export failed: ${i.statusText}`);return i.blob()}const yp=[{id:"background",label:"Background"},{id:"device",label:"Device"},{id:"text",label:"Text"},{id:"extras",label:"Extras"},{id:"export",label:"Export"}];function xp({sidebarOpen:r,onToggleSidebar:i,showSidebarToggle:a,agentMode:c,onToggleAgentMode:p}){const h=V(b=>b.config),m=V(b=>b.isPanoramic),x=V(b=>b.togglePanoramic),f=V(b=>b.activeTab),$=V(b=>b.setActiveTab),k=V(b=>b.selectedScreen),P=V(b=>b.screens),g=m?"Panoramic":"Individual",E=m?"Switch to Individual":"Switch to Panoramic";return l.jsxs("div",{className:"w-full min-h-11 px-3 py-2 md:px-4 flex flex-wrap items-center gap-2 md:gap-4 border-b border-border bg-surface shrink-0",children:[l.jsxs("div",{className:"flex items-center gap-2 min-w-0",children:[a&&l.jsx("button",{className:`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${r?"border-accent/40 bg-accent/10 text-accent":"border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text"}`,onClick:i,"aria-expanded":r,"aria-controls":"editor-sidebar",children:r?"Hide Controls":"Show Controls"}),l.jsx("span",{className:"text-sm font-semibold whitespace-nowrap",children:"appframe"}),h&&l.jsx("span",{className:"text-xs text-text-dim truncate",children:h.app.name}),l.jsx("span",{className:"hidden sm:inline-flex text-[10px] text-text-dim bg-surface-2 px-1.5 py-0.5 rounded whitespace-nowrap",children:g}),!m&&P.length>0&&l.jsxs("span",{className:"text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded whitespace-nowrap",children:[k+1,"/",P.length]})]}),l.jsx("div",{className:"order-3 md:order-none basis-full md:basis-auto flex items-center gap-1 md:mx-auto overflow-x-auto",children:yp.map(b=>l.jsx("button",{className:`text-[11px] px-3 py-1.5 rounded-md transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${f===b.id?"bg-accent/10 text-accent font-medium":"text-text-dim hover:text-text hover:bg-surface-2"}`,onClick:()=>$(b.id),children:b.label},b.id))}),l.jsxs("div",{className:"ml-auto flex items-center gap-2 shrink-0",children:[l.jsx("button",{className:`hidden sm:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${c?"border-emerald-400/40 bg-emerald-500/10 text-emerald-300":"border-border bg-bg text-text-dim hover:border-emerald-400/30 hover:text-text"}`,onClick:p,"aria-pressed":c,children:c?"AI Mode On":"AI Mode Off"}),l.jsxs("button",{className:`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${m?"border-accent/40 bg-accent/10 text-accent":"border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text"}`,onClick:x,title:E,"aria-label":`${E}. Current mode: ${g}.`,"data-current-mode":g.toLowerCase(),children:[l.jsx("span",{className:"w-3 h-3 flex items-center justify-center","aria-hidden":"true",children:m?l.jsxs("svg",{viewBox:"0 0 12 12",fill:"none",className:"w-full h-full","aria-hidden":"true",children:[l.jsx("rect",{x:"0.5",y:"2",width:"11",height:"8",rx:"1",stroke:"currentColor",strokeWidth:"1"}),l.jsx("line",{x1:"3",y1:"2",x2:"3",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"}),l.jsx("line",{x1:"6",y1:"2",x2:"6",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"}),l.jsx("line",{x1:"9",y1:"2",x2:"9",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"})]}):l.jsx("svg",{viewBox:"0 0 12 12",fill:"none",className:"w-full h-full","aria-hidden":"true",children:l.jsx("rect",{x:"2",y:"1",width:"8",height:"10",rx:"1",stroke:"currentColor",strokeWidth:"1"})})}),E]})]})]})}function ui(){const r=V(p=>p.selectedScreen),i=V(p=>p.screens[p.selectedScreen]),a=V(p=>p.updateScreen),c=C.useCallback(p=>{a(r,p)},[r,a]);return{screen:i,selectedScreen:r,update:c}}const nu=new Map;function Od(r,i){i?nu.set(r,i):nu.delete(r)}function vp(r){return nu.get(r)??null}function su(){const r=V(m=>m.selectedScreen),i=V(m=>m.previewW),a=C.useCallback(()=>{try{const m=vp(r);return(m==null?void 0:m.contentDocument)??null}catch{return null}},[r]),c=C.useCallback(m=>{const x=a();if(!x)return;const f=x.querySelector(".device-wrapper");if(f){if(m.deviceScale!==void 0){const $=x.querySelector(".canvas");if($){const k=$.getBoundingClientRect().width;if(f.dataset.origDw||(f.dataset.origDw=String(parseFloat(f.style.width)||f.getBoundingClientRect().width)),!f.dataset.origPerspective){const _=getComputedStyle(f).getPropertyValue("--device-perspective");f.dataset.origPerspective=String(parseFloat(_)||1500)}const P=parseFloat(f.dataset.origDw),g=Math.round(k*m.deviceScale/100),E=g/P;f.style.width=g+"px";const b=parseFloat(f.dataset.origPerspective);f.style.setProperty("--device-perspective",Math.round(b*E)+"px"),f.querySelectorAll(".screenshot-clip").forEach(_=>{const y=_;y.dataset.origLeft||(y.dataset.origLeft=y.style.left,y.dataset.origTop=y.style.top,y.dataset.origWidth=y.style.width,y.dataset.origHeight=y.style.height,y.dataset.origBr=y.style.borderRadius||""),y.style.left=Math.round(parseFloat(y.dataset.origLeft)*E)+"px",y.style.top=Math.round(parseFloat(y.dataset.origTop)*E)+"px",y.style.width=Math.round(parseFloat(y.dataset.origWidth)*E)+"px",y.style.height=Math.round(parseFloat(y.dataset.origHeight)*E)+"px",y.dataset.origBr&&(y.style.borderRadius=Math.round(parseFloat(y.dataset.origBr)*E)+"px")})}}if(m.deviceTop!==void 0){f.style.top=m.deviceTop+"%";for(const $ of[".glow-1",".glow-2",".orb-1",".orb-2",".bg-glow",".shape-1",".shape-3",".bg-shape-1"]){const k=x.querySelector($);k&&(k.style.top=m.deviceTop+"%")}}m.deviceOffsetX!==void 0&&(f.style.left=m.deviceOffsetX?`calc(50% + ${m.deviceOffsetX/100*i}px)`:"50%"),m.deviceRotation!==void 0&&f.style.setProperty("--device-rotation",`${m.deviceRotation}deg`),m.deviceAngle!==void 0&&f.style.setProperty("--device-angle",`${m.deviceAngle}deg`),m.deviceTilt!==void 0&&f.style.setProperty("--device-tilt",`${m.deviceTilt}deg`)}},[a,i]),p=C.useCallback(m=>{const x=a();if(!x)return;const f=x.querySelector(".canvas");if(f){if(m.type==="solid"&&m.color)f.style.background=m.color;else if(m.type==="gradient"&&m.colors){const $=m.colors.join(", ");m.gradientType==="radial"?f.style.background=`radial-gradient(circle at ${m.radialPosition??"center"}, ${$})`:f.style.background=`linear-gradient(${m.direction??135}deg, ${$})`}}},[a]),h=C.useCallback(m=>{const x=a();if(!x)return;const f=i/1290;if(m.headlineSize!==void 0||m.headlineRotation!==void 0){const $=x.querySelector(".headline");if($&&(m.headlineSize!==void 0&&($.style.fontSize=`${Math.round(m.headlineSize*f)}px`),m.headlineRotation!==void 0)){const k=["translateX(-50%)"];m.headlineRotation&&k.push(`rotate(${m.headlineRotation}deg)`),$.style.transform=k.join(" ")}}if(m.subtitleSize!==void 0||m.subtitleRotation!==void 0){const $=x.querySelector(".subtitle");if($&&(m.subtitleSize!==void 0&&($.style.fontSize=`${Math.round(m.subtitleSize*f)}px`),m.subtitleRotation!==void 0)){const k=["translateX(-50%)"];m.subtitleRotation&&k.push(`rotate(${m.subtitleRotation}deg)`),$.style.transform=k.join(" ")}}},[a,i]);return{patchDevice:c,patchBackground:p,patchText:h}}function De({title:r,children:i,hidden:a,tooltip:c,defaultCollapsed:p=!0}){const[h,m]=C.useState(p),x=C.useRef(null),[f,$]=C.useState(void 0);return C.useEffect(()=>{x.current&&!h&&$(x.current.scrollHeight)},[i,h]),a?null:l.jsxs("div",{className:"mx-3 my-1.5 first:mt-3 last:mb-3",children:[r&&l.jsxs("button",{className:"w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-surface-2 border border-border text-left cursor-pointer hover:border-accent/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",onClick:()=>m(!h),"aria-expanded":!h,children:[l.jsx("span",{className:"flex-1 text-[12px] font-medium text-text",children:r}),c&&l.jsx("span",{className:"inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-border text-[9px] text-text-dim cursor-help leading-none shrink-0",title:c,onClick:k=>k.stopPropagation(),"aria-label":c,children:"?"}),l.jsx("svg",{className:`w-3.5 h-3.5 text-text-dim shrink-0 transition-transform duration-200 ${h?"":"rotate-180"}`,viewBox:"0 0 12 12",fill:"none","aria-hidden":"true",children:l.jsx("path",{d:"M3 4.5l3 3 3-3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),l.jsx("div",{ref:x,className:"overflow-hidden transition-all duration-200 ease-in-out",style:{maxHeight:h?0:f??"none",opacity:h?0:1},"aria-hidden":h,children:l.jsx("div",{className:"px-1 pt-3 pb-1",children:i})})]})}function qe({label:r,value:i,onChange:a,onInstant:c,presets:p,onPresetClick:h}){const m=C.useId();return l.jsxs("div",{className:"mb-2.5",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("label",{htmlFor:m,className:"text-xs text-text-dim flex-1",children:r}),l.jsx("input",{id:m,type:"color",value:i,"aria-label":r,className:"w-8 h-8 border border-border rounded-md cursor-pointer bg-transparent p-0.5",onInput:x=>{c==null||c(x.target.value)},onChange:x=>{a(x.target.value)}})]}),p&&p.length>0&&l.jsx("div",{className:"flex flex-wrap gap-1 mt-1.5",children:p.map(x=>l.jsx("button",{className:"w-6 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:x},title:x,"aria-label":`Select color ${x}`,onClick:()=>{h==null||h(x),a(x)}},x))})]})}function K({label:r,value:i,min:a,max:c,step:p=1,formatValue:h,onChange:m,onInstant:x,disabled:f}){const $=C.useId(),k=h?h(i):String(i),[P,g]=C.useState(!1),[E,b]=C.useState(""),_=C.useRef(null);C.useEffect(()=>{var R;P&&((R=_.current)==null||R.select())},[P]);function y(){g(!1);const R=parseFloat(E);if(Number.isNaN(R))return;const ee=Math.min(c,Math.max(a,R)),ne=Math.round(ee/p)*p;m(ne)}return l.jsxs("div",{className:`mb-2.5${f?" opacity-50 cursor-not-allowed":""}`,children:[l.jsx("label",{htmlFor:$,className:"block text-xs text-text-dim mb-1",children:r}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("input",{id:$,type:"range",min:a,max:c,step:p,value:i,disabled:f,"aria-label":r,"aria-valuemin":a,"aria-valuemax":c,"aria-valuenow":i,"aria-valuetext":k,className:"w-full accent-accent",onInput:R=>{const ee=Number(R.target.value);x==null||x(ee)},onChange:R=>{m(Number(R.target.value))}}),P?l.jsx("input",{ref:_,type:"text",inputMode:"decimal","aria-label":`Edit ${r} value`,value:E,onChange:R=>b(R.target.value),onBlur:y,onKeyDown:R=>{R.key==="Enter"&&y(),R.key==="Escape"&&g(!1)},className:"text-xs text-text bg-surface border border-border rounded px-1 py-0 min-w-[40px] w-[48px] text-right shrink-0 outline-none focus:border-accent"}):l.jsx("span",{className:`text-xs text-text-dim min-w-[40px] text-right shrink-0 transition-colors${f?"":" cursor-text hover:text-text"}`,tabIndex:f?void 0:0,role:"spinbutton","aria-label":`${r}: ${k}. Click to edit`,"aria-valuenow":i,"aria-valuetext":k,onClick:()=>{f||(b(String(i)),g(!0))},onKeyDown:R=>{f||(R.key==="Enter"||R.key===" ")&&(R.preventDefault(),b(String(i)),g(!0))},children:k})]})]})}const vt=C.memo(function({label:i,checked:a,onChange:c}){return l.jsx("div",{className:"mb-2.5",children:l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"checkbox",checked:a,onChange:p=>c(p.target.checked),className:"accent-accent"}),i]})})}),Ge=C.memo(function({label:i,value:a,onChange:c,options:p,groups:h,hidden:m}){const x=C.useId();return m?null:l.jsxs("div",{className:"mb-2.5",children:[i&&l.jsx("label",{htmlFor:x,className:"block text-xs text-text-dim mb-1",children:i}),l.jsxs("select",{id:x,value:a,onChange:f=>c(f.target.value),"aria-label":i||void 0,className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent",children:[p==null?void 0:p.map(f=>l.jsx("option",{value:f.value,disabled:f.disabled,title:f.title,children:f.label},f.value)),h==null?void 0:h.map(f=>l.jsx("optgroup",{label:f.label,children:f.options.map($=>l.jsx("option",{value:$.value,disabled:$.disabled,title:$.title,children:$.label},$.value))},f.label))]})]})}),cf=["#000000","#1a1a2e","#16213e","#0f3460","#533483","#e94560","#f5f5f5","#fafafa","#2d3436","#636e72","#00b894","#00cec9","#6c5ce7","#fdcb6e","#e17055","#dfe6e9","#b2bec3","#2c3e50","#8e44ad","#2980b9"],iu=[{name:"Sunset",colors:["#ff6b35","#f7c948","#ff3864"],direction:135},{name:"Ocean",colors:["#0052d4","#4364f7","#6fb1fc"],direction:135},{name:"Midnight",colors:["#0f0c29","#302b63","#24243e"],direction:135},{name:"Sky",colors:["#2980b9","#6dd5fa","#ffffff"],direction:180},{name:"Horizon",colors:["#003973","#e5e5be","#f7a600"],direction:180},{name:"Vapor",colors:["#fc5c7d","#ce9ffc","#6a82fb"],direction:135},{name:"Tropical",colors:["#f7971e","#ffd200","#21d4fd"],direction:135},{name:"Dusk Sky",colors:["#2c3e50","#4ca1af","#c4e0e5"],direction:180},{name:"Flamingo",colors:["#ee5a24","#f0932b","#fad390"],direction:135},{name:"Arctic",colors:["#1e3c72","#2a5298","#e8f5e9"],direction:180},{name:"Velvet",colors:["#6a0572","#ab83a1","#f5e6cc"],direction:135},{name:"Lush",colors:["#004e92","#00b4db","#88d8b0"],direction:135},{name:"Aurora",colors:["#00c9ff","#92fe9d"],direction:135},{name:"Coral",colors:["#ff9a9e","#fecfef"],direction:135},{name:"Lavender",colors:["#a18cd1","#fbc2eb"],direction:135},{name:"Emerald",colors:["#11998e","#38ef7d"],direction:135},{name:"Fire",colors:["#f83600","#f9d423"],direction:135},{name:"Berry",colors:["#8e2de2","#4a00e0"],direction:135},{name:"Peach",colors:["#ffecd2","#fcb69f"],direction:135},{name:"Dusk",colors:["#2c3e50","#fd746c"],direction:135},{name:"Mint",colors:["#00b09b","#96c93d"],direction:135},{name:"Rose",colors:["#ee9ca7","#ffdde1"],direction:135},{name:"Indigo",colors:["#667eea","#764ba2"],direction:135},{name:"Candy",colors:["#fc5c7d","#6a82fb"],direction:135},{name:"Forest",colors:["#134e5e","#71b280"],direction:135},{name:"Neon",colors:["#00f260","#0575e6"],direction:135},{name:"Warm",colors:["#f093fb","#f5576c"],direction:135}],df={"Natural Titanium":"#9a8e7e","Black Titanium":"#3c3c3c","White Titanium":"#e8e5e0","Desert Titanium":"#c4a882","Blue Titanium":"#394e5f",Black:"#1c1c1e",White:"#f5f5f7",Pink:"#f9cdd3",Teal:"#5eb5b5",Ultramarine:"#4a50c7",Blue:"#5b8fb9",Green:"#3f6e4e",Yellow:"#f2d44e",Red:"#c43d40",Purple:"#7c5dab",Midnight:"#2c2c3a",Starlight:"#f0e8d8","Product Red":"#c43d40","Space Black":"#2a2a2c","Space Gray":"#636366",Silver:"#d6d6d6",Gold:"#e3caa5","Deep Purple":"#5e4580",Graphite:"#4f4f4f","Pacific Blue":"#1e5c82","Sierra Blue":"#9fb8cf","Alpine Green":"#3c5e48","Rose Gold":"#e6c0aa"},bp=[{value:"minimal",label:"Minimal"},{value:"bold",label:"Bold"},{value:"glow",label:"Glow"},{value:"playful",label:"Playful"},{value:"clean",label:"Clean"},{value:"branded",label:"Branded"},{value:"editorial",label:"Editorial"}],wp=[{value:"solid",label:"Solid"},{value:"gradient",label:"Gradient"},{value:"image",label:"Image"},{value:"preset",label:"Preset"}],kp=[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}];function Cp(){const{screen:r,update:i}=ui(),a=C.useRef(null),{patchBackground:c}=su(),p=C.useCallback(g=>c({type:"solid",color:g}),[c]),h=C.useCallback(g=>{if(!r)return;const E=r.backgroundGradient;c({type:"gradient",gradientType:E.type,colors:(g==null?void 0:g.colors)??E.colors,direction:(g==null?void 0:g.direction)??E.direction,radialPosition:E.radialPosition})},[r,c]),[m,x]=C.useState(!1);if(!r)return null;const f=r.backgroundType,$=m||f==="preset"?"preset":f,k=g=>{var _;const E=(_=g.target.files)==null?void 0:_[0];if(!E)return;const b=new FileReader;b.onload=y=>{var se;const R=(se=y.target)==null?void 0:se.result,{selectedScreen:ee,updateScreen:ne}=V.getState();ne(ee,{backgroundImageDataUrl:R})},b.readAsDataURL(E),g.target.value=""},P=()=>{const g=[...r.backgroundGradient.colors];g.length>=5||(g.push("#ffffff"),i({backgroundGradient:{...r.backgroundGradient,colors:g}}))};return l.jsxs(l.Fragment,{children:[l.jsxs(De,{title:"Background",tooltip:"Choose between solid colors, gradients, images, or template presets for your screenshot background.",defaultCollapsed:!1,children:[l.jsx("div",{className:"flex gap-3 mb-2.5",children:wp.map(g=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"bg-type",value:g.value,checked:$===g.value,onChange:()=>{g.value==="preset"?x(!0):(x(!1),i({backgroundType:g.value}))},className:"accent-accent"}),g.label]},g.value))}),$==="preset"&&l.jsx(Ge,{label:"Style Preset",value:f==="preset"?r.style:"",onChange:g=>{i({backgroundType:"preset",style:g})},options:[{value:"",label:"Select a preset...",disabled:!0},...bp]}),$==="solid"&&l.jsx(qe,{label:"Color",value:r.backgroundColor,onChange:g=>i({backgroundColor:g}),onInstant:p,presets:cf}),$==="gradient"&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:iu.map(g=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${g.direction}deg, ${g.colors.join(", ")})`},title:g.name,"aria-label":`Apply ${g.name} gradient`,onClick:()=>i({backgroundGradient:{type:"linear",colors:[...g.colors],direction:g.direction,radialPosition:"center"}})},g.name))}),l.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(g=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"gradient-type",checked:r.backgroundGradient.type===g,onChange:()=>i({backgroundGradient:{...r.backgroundGradient,type:g}}),className:"accent-accent"}),g.charAt(0).toUpperCase()+g.slice(1)]},g))}),r.backgroundGradient.type==="linear"&&l.jsx(K,{label:"Direction",value:r.backgroundGradient.direction,min:0,max:360,formatValue:g=>`${g}°`,onChange:g=>i({backgroundGradient:{...r.backgroundGradient,direction:g}}),onInstant:g=>h({direction:g})}),r.backgroundGradient.type==="radial"&&l.jsx(Ge,{label:"Center",value:r.backgroundGradient.radialPosition,onChange:g=>i({backgroundGradient:{...r.backgroundGradient,radialPosition:g}}),options:kp}),r.backgroundGradient.colors.map((g,E)=>l.jsx(qe,{label:`Stop ${E+1}`,value:g,onChange:b=>{const _=[...r.backgroundGradient.colors];_[E]=b,i({backgroundGradient:{...r.backgroundGradient,colors:_}})}},E)),r.backgroundGradient.colors.length<5&&l.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:P,children:"+ Add Color Stop"})]}),$==="image"&&l.jsxs(l.Fragment,{children:[!r.backgroundImageDataUrl&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Upload a custom image to use as the screenshot background. Supports PNG, JPEG, and WebP."}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var g;return(g=a.current)==null?void 0:g.click()},children:"Upload Background Image"}),l.jsx("input",{ref:a,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload background image",onChange:k}),r.backgroundImageDataUrl&&l.jsxs("div",{className:"mt-1.5",children:[l.jsx("img",{src:r.backgroundImageDataUrl,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>i({backgroundImageDataUrl:null}),children:"Remove"})]}),l.jsxs("div",{className:"mt-2",children:[l.jsx(vt,{label:"Dim Overlay",checked:!!r.backgroundOverlay,onChange:g=>i({backgroundOverlay:g?{color:"#000000",opacity:.3}:null})}),r.backgroundOverlay&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Color",value:r.backgroundOverlay.color,onChange:g=>i({backgroundOverlay:{...r.backgroundOverlay,color:g}})}),l.jsx(K,{label:"Opacity",value:Math.round(r.backgroundOverlay.opacity*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>i({backgroundOverlay:{...r.backgroundOverlay,opacity:g/100}})})]})]})]})]}),l.jsxs(De,{title:"Preset Colors",hidden:f!=="preset",tooltip:"Override the default colors for the selected template preset.",children:[l.jsx(qe,{label:"Primary",value:r.colors.primary,onChange:g=>i({colors:{...r.colors,primary:g}})}),l.jsx(qe,{label:"Secondary",value:r.colors.secondary,onChange:g=>i({colors:{...r.colors,secondary:g}})}),l.jsx(qe,{label:"Background",value:r.colors.background,onChange:g=>i({colors:{...r.colors,background:g}})})]})]})}function Fd(r,i,a){const p=[{name:"nw",x:a.x,y:a.y},{name:"ne",x:a.x+a.w,y:a.y},{name:"sw",x:a.x,y:a.y+a.h},{name:"se",x:a.x+a.w,y:a.y+a.h}];for(const h of p)if(Math.abs(r-h.x)<12&&Math.abs(i-h.y)<12)return h.name;return r>a.x&&r<a.x+a.w&&i>a.y&&i<a.y+a.h?"move":"new"}const Sp={nw:"nw-resize",ne:"ne-resize",sw:"sw-resize",se:"se-resize",move:"move",new:"crosshair"};function jp({imageDataUrl:r,onApply:i,onCancel:a}){const c=C.useRef(null),p=C.useRef(null),h=C.useRef(null),m=C.useRef({x:0,y:0,w:0,h:0}),x=C.useRef(1),f=C.useRef({mode:null,startX:0,startY:0,startCrop:{x:0,y:0,w:0,h:0}}),$=C.useCallback(()=>{const g=p.current,E=h.current;if(!g||!E)return;const b=g.getContext("2d");if(!b)return;const _=g.width,y=g.height,R=m.current;b.clearRect(0,0,_,y),b.drawImage(E,0,0,_,y),b.fillStyle="rgba(0,0,0,0.5)",b.fillRect(0,0,_,R.y),b.fillRect(0,R.y+R.h,_,y-R.y-R.h),b.fillRect(0,R.y,R.x,R.h),b.fillRect(R.x+R.w,R.y,_-R.x-R.w,R.h),b.strokeStyle="#fff",b.lineWidth=2,b.strokeRect(R.x,R.y,R.w,R.h);const ee=8;b.fillStyle="#fff";const ne=[[R.x,R.y],[R.x+R.w,R.y],[R.x,R.y+R.h],[R.x+R.w,R.y+R.h]];for(const[se,re]of ne)b.fillRect(se-ee/2,re-ee/2,ee,ee);b.strokeStyle="rgba(255,255,255,0.25)",b.lineWidth=1;for(let se=1;se<=2;se++)b.beginPath(),b.moveTo(R.x+R.w*se/3,R.y),b.lineTo(R.x+R.w*se/3,R.y+R.h),b.stroke(),b.beginPath(),b.moveTo(R.x,R.y+R.h*se/3),b.lineTo(R.x+R.w,R.y+R.h*se/3),b.stroke()},[]);C.useEffect(()=>{var E;const g=b=>{if(b.key==="Escape"){a();return}if(b.key==="Tab"&&c.current){const _=c.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');if(_.length===0)return;const y=_[0],R=_[_.length-1];b.shiftKey&&document.activeElement===y?(b.preventDefault(),R.focus()):!b.shiftKey&&document.activeElement===R&&(b.preventDefault(),y.focus())}};return window.addEventListener("keydown",g),(E=c.current)==null||E.focus(),()=>window.removeEventListener("keydown",g)},[a]),C.useEffect(()=>{const g=new Image;g.onload=()=>{h.current=g;const E=g.naturalWidth,b=g.naturalHeight,_=window.innerWidth*.8,y=window.innerHeight*.7,R=Math.min(_/E,y/b,1);x.current=R;const ee=Math.round(E*R),ne=Math.round(b*R),se=p.current;se&&(se.width=ee,se.height=ne,m.current={x:Math.round(ee*.1),y:Math.round(ne*.1),w:Math.round(ee*.8),h:Math.round(ne*.8)},$())},g.src=r},[r,$]);const k=C.useCallback(g=>{const E=p.current;if(!E)return;const b=E.getBoundingClientRect(),_=g.clientX-b.left,y=g.clientY-b.top,R=Fd(_,y,m.current),ee=m.current;f.current={mode:R==="new"?"se":R,startX:_,startY:y,startCrop:{...ee}},R==="new"&&(m.current={x:_,y,w:0,h:0})},[]);C.useEffect(()=>{const g=b=>{const _=p.current;if(!_)return;const y=_.getBoundingClientRect(),R=_.width,ee=_.height,ne=f.current;if(!ne.mode){const fe=Fd(b.clientX-y.left,b.clientY-y.top,m.current);_.style.cursor=Sp[fe]??"crosshair";return}const se=Math.max(0,Math.min(R,b.clientX-y.left)),re=Math.max(0,Math.min(ee,b.clientY-y.top)),ie=se-ne.startX,ue=re-ne.startY,v=ne.startCrop,G=m.current;ne.mode==="move"?(G.x=Math.max(0,Math.min(R-v.w,v.x+ie)),G.y=Math.max(0,Math.min(ee-v.h,v.y+ue))):ne.mode==="se"?(G.w=Math.max(10,se-G.x),G.h=Math.max(10,re-G.y)):ne.mode==="nw"?(G.x=Math.min(v.x+v.w-10,v.x+ie),G.y=Math.min(v.y+v.h-10,v.y+ue),G.w=v.w-(G.x-v.x),G.h=v.h-(G.y-v.y)):ne.mode==="ne"?(G.y=Math.min(v.y+v.h-10,v.y+ue),G.w=Math.max(10,v.w+ie),G.h=v.h-(G.y-v.y)):ne.mode==="sw"&&(G.x=Math.min(v.x+v.w-10,v.x+ie),G.w=v.w-(G.x-v.x),G.h=Math.max(10,v.h+ue)),$()},E=()=>{f.current.mode=null};return document.addEventListener("mousemove",g),document.addEventListener("mouseup",E),()=>{document.removeEventListener("mousemove",g),document.removeEventListener("mouseup",E)}},[$]);const P=C.useCallback(()=>{const g=h.current;if(!g)return;const E=m.current,b=x.current,_=Math.round(E.x/b),y=Math.round(E.y/b);let R=Math.round(E.w/b),ee=Math.round(E.h/b);R=Math.min(R,g.naturalWidth-_),ee=Math.min(ee,g.naturalHeight-y);const ne=document.createElement("canvas");ne.width=R,ne.height=ee;const se=ne.getContext("2d");se&&(se.drawImage(g,_,y,R,ee,0,0,R,ee),i(ne.toDataURL("image/png")))},[i]);return l.jsxs("div",{ref:c,tabIndex:-1,role:"dialog","aria-modal":"true","aria-label":"Crop screenshot",className:"fixed inset-0 z-[9999] flex flex-col items-center justify-center outline-none",style:{background:"rgba(0,0,0,0.8)"},children:[l.jsx("div",{className:"text-white text-base font-semibold mb-3",children:"Crop Screenshot"}),l.jsx("canvas",{ref:p,className:"border border-white/30",style:{cursor:"crosshair"},role:"img","aria-label":"Screenshot crop area. Click and drag to select the region to crop.",onMouseDown:k}),l.jsxs("div",{className:"flex gap-2 mt-3",children:[l.jsx("button",{className:"px-6 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent-hover",onClick:P,children:"Apply Crop"}),l.jsx("button",{className:"px-6 py-2 text-sm bg-surface-2 text-text-dim border border-border rounded-md hover:text-text",onClick:a,children:"Cancel"})]})]})}const Ep={single:{deviceCount:1,slots:[{offsetX:0,offsetY:15,scale:92,rotation:0,angle:0,tilt:0,zIndex:1}]},"duo-overlap":{deviceCount:2,slots:[{offsetX:-30,offsetY:18,scale:85,rotation:-12,angle:12,tilt:2,zIndex:1},{offsetX:22,offsetY:8,scale:88,rotation:4,angle:0,tilt:0,zIndex:2}]},"duo-split":{deviceCount:2,slots:[{offsetX:-38,offsetY:12,scale:80,rotation:-5,angle:8,tilt:2,zIndex:1},{offsetX:38,offsetY:12,scale:80,rotation:5,angle:-8,tilt:2,zIndex:1}]},"hero-tilt":{deviceCount:2,slots:[{offsetX:-35,offsetY:20,scale:78,rotation:-15,angle:15,tilt:4,zIndex:1},{offsetX:12,offsetY:8,scale:92,rotation:0,angle:0,tilt:0,zIndex:2}]},"fanned-cards":{deviceCount:3,slots:[{offsetX:-35,offsetY:16,scale:68,rotation:-18,angle:0,tilt:0,zIndex:1},{offsetX:0,offsetY:8,scale:72,rotation:0,angle:0,tilt:0,zIndex:3},{offsetX:35,offsetY:16,scale:68,rotation:18,angle:0,tilt:0,zIndex:2}]}},Np=[{value:"center",label:"Center"},{value:"angled-left",label:"Angled Left"},{value:"angled-right",label:"Angled Right"}],Pp=[{value:"flat",label:"Flat"},{value:"none",label:"None (frameless)"}],Tp=[{value:"single",label:"Single Device"}],Lp=[{label:"Multi-Device",options:[{value:"duo-overlap",label:"Duo Overlap (2)"},{value:"duo-split",label:"Duo Split (2)"},{value:"hero-tilt",label:"Hero + Background (2)"},{value:"fanned-cards",label:"Fanned Cards (3)"}]}],Rp=[{value:"iphone",label:"iPhone"},{value:"ipad",label:"iPad"},{value:"mac",label:"Mac"},{value:"watch",label:"Apple Watch"},{value:"android",label:"Android"}],Ip={iphone:"iphone",android:"iphone",ipad:"ipad",mac:"mac",watch:"watch"};function $p(r,i){if(r==="android")return"generic-phone";const a=Ip[r]??"iphone",c=i.filter(p=>p.category===a).sort((p,h)=>h.year-p.year)[0];return c?c.id:a==="ipad"?"ipad-pro-13":"generic-phone"}const Dd=.15;function Ad(r,i){const a=r.width/r.height;return Math.abs(i-a)/a<Dd||Math.abs(i-1/a)/(1/a)<Dd}const Mp={iphone:["iphone"],android:["iphone"],ipad:["ipad"],mac:["mac"],watch:["watch"]},zp={iphone:["default-ios","default-android"],android:["default-ios","default-android"],ipad:["default-ipad","fallback-tablet"],mac:[],watch:[]};function Op(r,i,a,c,p){const h=a?a.width/a.height:null,m=!c&&h!==null,x=Mp[p]??["iphone"],f=zp[p]??[],$={};for(const g of r){const E=g.category||"other";if(!c&&!x.includes(E)||m&&!Ad(g.screenResolution,h))continue;const b=$[E]??[];b.push({value:g.id,label:g.name}),$[E]=b}const k=Object.entries($).map(([g,E])=>({label:g.charAt(0).toUpperCase()+g.slice(1),options:E})),P=[];for(const g of i){if(!c&&f.length>0){if(!(g.tags??[]).some(b=>f.includes(b)))continue}else if(!c&&f.length===0)continue;m&&g.screenResolution&&!Ad(g.screenResolution,h)||P.push({value:g.id,label:g.name})}return P.length>0&&k.push({label:"SVG Frames",options:P}),k}function Fp(){var Me,Oe,ze;const{screen:r,update:i}=ui(),a=V(O=>O.platform),c=V(O=>O.setPlatform),p=V(O=>O.setPreviewSize),h=V(O=>O.sizes),m=V(O=>O.setExportSize),x=V(O=>O.triggerRender),f=V(O=>O.updateScreen),$=V(O=>O.screens),k=V(O=>O.deviceFamilies),P=V(O=>O.frames),g=C.useRef(null),[E,b]=C.useState(!1),[_,y]=C.useState(!1),{patchDevice:R}=su(),ee=C.useCallback((O,W)=>R({[O]:W}),[R]),ne=O=>{c(O);const W=Fl[O]??Fl.iphone;p(W.w,W.h);const M=h[O]??[];M.length>0&&m(M[0].key);const Y=$p(O,k);for(let U=0;U<$.length;U++)f(U,{frameId:Y,deviceColor:""});x()};if(!r)return null;const se=k.find(O=>O.id===r.frameId),re=se&&se.colors.length>1,ie=se&&se.screenRect,ue=r.frameStyle==="none",v=r.layout==="angled-left"||r.layout==="angled-right",G=C.useMemo(()=>Op(k,P,r.screenshotDims,_,a),[k,P,r.screenshotDims,_,a]),fe=O=>{var Y;const W=(Y=O.target.files)==null?void 0:Y[0];if(!W)return;const M=new FileReader;M.onload=U=>{var ae;const L=(ae=U.target)==null?void 0:ae.result,D=new Image;D.onload=()=>{const we={width:D.naturalWidth,height:D.naturalHeight};i({screenshotDataUrl:L,screenshotName:W.name,screenshotDims:we})},D.src=L},M.readAsDataURL(W),O.target.value=""},Z=O=>{b(!1);const W=new Image;W.onload=()=>{const M={width:W.naturalWidth,height:W.naturalHeight};i({screenshotDataUrl:O,screenshotDims:M})},W.src=O},de=li[a]??li.iphone;return l.jsxs(l.Fragment,{children:[E&&r.screenshotDataUrl&&l.jsx(jp,{imageDataUrl:r.screenshotDataUrl,onApply:Z,onCancel:()=>b(!1)}),l.jsx(De,{title:"Platform",tooltip:"Choose the target platform. This adjusts the preview dimensions and available device frames.",defaultCollapsed:!1,children:l.jsx(Ge,{label:"Platform",value:a,onChange:ne,options:Rp})}),l.jsxs(De,{title:"Screenshot",children:[r.screenshotDataUrl&&l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:r.screenshotDataUrl,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:r.screenshotName||"Custom upload"})]}),!r.screenshotDataUrl&&r.screenshotName&&l.jsx("div",{className:"text-xs text-text-dim mb-2",children:r.screenshotName}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var O;return(O=g.current)==null?void 0:O.click()},children:"Upload Screenshot"}),l.jsx("input",{ref:g,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload screenshot image",onChange:fe}),r.screenshotDataUrl&&l.jsxs("div",{className:"flex gap-1 mt-1.5",children:[l.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>b(!0),children:"Crop"}),l.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>i({screenshotDataUrl:null,screenshotName:null,screenshotDims:null}),children:"Revert"})]})]}),l.jsxs(De,{title:"Device Frame",children:[l.jsx(Ge,{label:"Device",value:r.frameId,onChange:O=>{const W=k.find(Y=>Y.id===O);W&&W.screenRect&&r.frameStyle==="none"?i({frameId:O,frameStyle:"flat"}):i({frameId:O})},groups:G}),r.screenshotDims&&l.jsx(vt,{label:"Show all frames",checked:_,onChange:y}),re&&l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),l.jsx("div",{className:"flex flex-wrap gap-1",children:se.colors.map(O=>l.jsx("button",{className:`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none ${r.deviceColor===O.name?"border-accent ring-1 ring-accent":"border-border"}`,style:{background:df[O.name]??"#888888"},title:O.name,"aria-label":`${O.name} color variant`,"aria-pressed":r.deviceColor===O.name,onClick:()=>i({deviceColor:O.name})},O.name))})]}),l.jsx(Ge,{label:"Frame Style",value:r.frameStyle,onChange:O=>i({frameStyle:O}),options:Pp,hidden:!!ie}),ue&&l.jsxs(l.Fragment,{children:[l.jsx(vt,{label:"Border Simulation",checked:!!r.borderSimulation,onChange:O=>i({borderSimulation:O?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:null})}),r.borderSimulation&&l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Thickness",value:r.borderSimulation.thickness,min:1,max:20,formatValue:O=>`${O}px`,onChange:O=>i({borderSimulation:{...r.borderSimulation,thickness:O}})}),l.jsx(qe,{label:"Color",value:r.borderSimulation.color,onChange:O=>i({borderSimulation:{...r.borderSimulation,color:O}})}),l.jsx(K,{label:"Radius",value:r.borderSimulation.radius,min:0,max:60,formatValue:O=>`${O}px`,onChange:O=>i({borderSimulation:{...r.borderSimulation,radius:O}})})]})]})]}),l.jsxs(De,{title:"Device Layout",tooltip:"Control the size, position, rotation, and tilt of the device in the screenshot frame.",children:[l.jsx(vt,{label:"Fullscreen Screenshot",checked:r.style==="fullscreen",onChange:O=>i({style:O?"fullscreen":"minimal"})}),r.style!=="fullscreen"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Layout",value:r.layout,onChange:O=>i({layout:O}),options:Np}),l.jsx(K,{label:"Device Size",value:r.deviceScale,min:50,max:100,formatValue:O=>`${O}%`,onChange:O=>i({deviceScale:O}),onInstant:O=>ee("deviceScale",O)}),l.jsx(K,{label:"Device Position",value:r.deviceTop,min:-80,max:80,formatValue:O=>`${O}%`,onChange:O=>i({deviceTop:O}),onInstant:O=>ee("deviceTop",O)}),l.jsx(K,{label:"Horizontal Position",value:r.deviceOffsetX,min:-80,max:80,formatValue:O=>`${O}%`,onChange:O=>i({deviceOffsetX:O}),onInstant:O=>ee("deviceOffsetX",O)}),l.jsx(K,{label:"Device Rotation",value:r.deviceRotation,min:-180,max:180,formatValue:O=>`${O}°`,onChange:O=>i({deviceRotation:O}),onInstant:O=>ee("deviceRotation",O)}),v&&l.jsx(K,{label:"Perspective Angle",value:r.deviceAngle,min:2,max:45,formatValue:O=>`${O}°`,onChange:O=>i({deviceAngle:O}),onInstant:O=>ee("deviceAngle",O)}),l.jsx(K,{label:"3D Tilt",value:r.deviceTilt,min:0,max:40,formatValue:O=>`${O}°`,onChange:O=>i({deviceTilt:O}),onInstant:O=>ee("deviceTilt",O)}),ue&&l.jsx(K,{label:"Corner Radius",value:r.cornerRadius,min:0,max:50,formatValue:O=>`${O}%`,onChange:O=>i({cornerRadius:O})}),l.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>i({deviceScale:de.deviceScale,deviceTop:de.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:de.deviceAngle,deviceTilt:0,cornerRadius:0}),children:"Reset Device Position"})]})]}),l.jsxs(De,{title:"Device Shadow",tooltip:"Add a custom drop shadow behind the device frame.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Custom Shadow",checked:!!r.deviceShadow,onChange:O=>i({deviceShadow:O?{opacity:.25,blur:20,color:"#000000",offsetY:10}:null})}),l.jsxs("div",{className:r.deviceShadow?"":"opacity-40 pointer-events-none",children:[l.jsx(K,{label:"Opacity",value:r.deviceShadow?Math.round(r.deviceShadow.opacity*100):25,min:0,max:100,formatValue:O=>`${O}%`,onChange:O=>i({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},opacity:O/100}})}),l.jsx(K,{label:"Blur",value:((Me=r.deviceShadow)==null?void 0:Me.blur)??20,min:0,max:50,formatValue:O=>`${O}px`,onChange:O=>i({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},blur:O}})}),l.jsx(qe,{label:"Color",value:((Oe=r.deviceShadow)==null?void 0:Oe.color)??"#000000",onChange:O=>i({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},color:O}})}),l.jsx(K,{label:"Y Offset",value:((ze=r.deviceShadow)==null?void 0:ze.offsetY)??10,min:0,max:30,formatValue:O=>`${O}px`,onChange:O=>i({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},offsetY:O}})})]})]}),l.jsx(De,{title:"Composition",tooltip:"Choose how devices are arranged. Use multi-device layouts to show multiple app screens in one image.",defaultCollapsed:!0,children:l.jsx(Ge,{label:"Device Arrangement",value:r.composition,onChange:O=>{const W=O,M=Ep[W];if(M&&M.deviceCount===1){const Y=M.slots[0];i({composition:W,deviceOffsetX:Y.offsetX,deviceTop:Y.offsetY,deviceScale:Y.scale,deviceRotation:Y.rotation,deviceAngle:Y.angle,deviceTilt:Y.tilt})}else i({composition:W})},options:Tp,groups:Lp})})]})}const Dp={"sans-serif":"Sans Serif",serif:"Serif",display:"Display"},Ap=["sans-serif","serif","display"];function ff(r){const i={};for(const a of r){const c=a.category??"sans-serif",p=i[c]??[];p.push({value:a.id,label:a.name}),i[c]=p}return Ap.filter(a=>{var c;return(c=i[a])==null?void 0:c.length}).map(a=>({label:Dp[a]??a,options:i[a]}))}const Bd=[{value:"",label:"Auto"},{value:"none",label:"None"},{value:"uppercase",label:"Uppercase"},{value:"lowercase",label:"Lowercase"},{value:"capitalize",label:"Capitalize"}],Bp=[{value:"",label:"Auto"},{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}];function Wp(){const{screen:r,update:i}=ui(),a=V(f=>f.fonts),{patchText:c}=su(),p=C.useCallback((f,$)=>c({[f]:$}),[c]),h=C.useMemo(()=>ff(a),[a]),m=C.useId(),x=C.useId();return r?l.jsxs(l.Fragment,{children:[l.jsxs(De,{title:"Text",tooltip:"Edit the headline and subtitle text that appears above or below the device frame.",defaultCollapsed:!1,children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{htmlFor:m,className:"block text-xs text-text-dim mb-1",children:"Headline"}),l.jsx("textarea",{id:m,rows:2,value:r.headline,onChange:f=>i({headline:f.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{htmlFor:x,className:"block text-xs text-text-dim mb-1",children:"Subtitle"}),l.jsx("input",{id:x,type:"text",value:r.subtitle,onChange:f=>i({subtitle:f.target.value}),placeholder:"Optional subtitle",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent"})]}),l.jsx(qe,{label:"Headline Color",value:r.colors.text,onChange:f=>i({colors:{...r.colors,text:f}})}),l.jsx(qe,{label:"Subtitle Color",value:r.colors.subtitle,onChange:f=>i({colors:{...r.colors,subtitle:f}})})]}),l.jsxs(De,{title:"Typography",tooltip:"Control font family, weight, size, rotation, spacing, and text transformations.",children:[l.jsx(Ge,{label:"Font",value:r.font,onChange:f=>i({font:f}),groups:h}),l.jsx(K,{label:"Font Weight",value:r.fontWeight,min:400,max:800,step:100,formatValue:f=>String(f),onChange:f=>i({fontWeight:f})}),l.jsx(K,{label:"Headline Size",value:r.headlineSize,min:0,max:200,formatValue:f=>f===0?"Auto":`${f}px`,onChange:f=>i({headlineSize:f}),onInstant:f=>p("headlineSize",f),disabled:r.autoSizeHeadline}),l.jsx(K,{label:"Subtitle Size",value:r.subtitleSize,min:0,max:120,formatValue:f=>f===0?"Auto":`${f}px`,onChange:f=>i({subtitleSize:f}),onInstant:f=>p("subtitleSize",f),disabled:r.autoSizeSubtitle}),l.jsx(vt,{label:"Auto-size Headline",checked:r.autoSizeHeadline,onChange:f=>i({autoSizeHeadline:f})}),l.jsx(vt,{label:"Auto-size Subtitle",checked:r.autoSizeSubtitle,onChange:f=>i({autoSizeSubtitle:f})}),l.jsx(K,{label:"Headline Rotation",value:r.headlineRotation,min:-30,max:30,formatValue:f=>`${f}°`,onChange:f=>i({headlineRotation:f}),onInstant:f=>p("headlineRotation",f)}),l.jsx(K,{label:"Subtitle Rotation",value:r.subtitleRotation,min:-30,max:30,formatValue:f=>`${f}°`,onChange:f=>i({subtitleRotation:f}),onInstant:f=>p("subtitleRotation",f)}),l.jsx(K,{label:"Headline Line Height",value:r.headlineLineHeight,min:80,max:180,formatValue:f=>f===0?"Auto":(f/100).toFixed(2),onChange:f=>i({headlineLineHeight:f})}),l.jsx(K,{label:"Headline Letter Spacing",value:r.headlineLetterSpacing,min:-5,max:10,formatValue:f=>f===0?"Auto":`${f/100}em`,onChange:f=>i({headlineLetterSpacing:f})}),l.jsxs("div",{className:"flex gap-2 mb-2",children:[l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Headline Case",value:r.headlineTextTransform,onChange:f=>i({headlineTextTransform:f}),options:Bd})}),l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Headline Style",value:r.headlineFontStyle,onChange:f=>i({headlineFontStyle:f}),options:Bp})})]}),l.jsx(K,{label:"Subtitle Opacity",value:r.subtitleOpacity,min:0,max:100,formatValue:f=>f===0?"Auto":`${f}%`,onChange:f=>i({subtitleOpacity:f})}),l.jsx(K,{label:"Subtitle Letter Spacing",value:r.subtitleLetterSpacing,min:-5,max:10,formatValue:f=>f===0?"Auto":`${f/100}em`,onChange:f=>i({subtitleLetterSpacing:f})}),l.jsx(Ge,{label:"Subtitle Case",value:r.subtitleTextTransform,onChange:f=>i({subtitleTextTransform:f}),options:Bd})]}),l.jsxs(De,{title:"Text Position",tooltip:"Drag text elements in the preview to reposition, or reset to default positions.",children:[l.jsx("span",{className:"text-[11px] text-text-dim leading-tight block mb-1.5",children:"Drag the headline or subtitle in the preview to reposition them."}),l.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>i({textPositions:{headline:null,subtitle:null}}),children:"Reset to Default"})]}),l.jsxs(De,{title:"Text Gradient",tooltip:"Apply a gradient color effect to headline or subtitle text.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Enable Headline Gradient",checked:!!r.headlineGradient,onChange:f=>i({headlineGradient:f?{colors:["#6366f1","#ec4899"],direction:90}:null})}),r.headlineGradient&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Start",value:r.headlineGradient.colors[0]??"#6366f1",onChange:f=>i({headlineGradient:{...r.headlineGradient,colors:[f,r.headlineGradient.colors[1]??"#ec4899"]}})}),l.jsx(qe,{label:"End",value:r.headlineGradient.colors[1]??"#ec4899",onChange:f=>i({headlineGradient:{...r.headlineGradient,colors:[r.headlineGradient.colors[0]??"#6366f1",f]}})}),l.jsx(K,{label:"Direction",value:r.headlineGradient.direction,min:0,max:360,formatValue:f=>`${f}°`,onChange:f=>i({headlineGradient:{...r.headlineGradient,direction:f}})})]}),l.jsx("div",{className:"mt-2.5",children:l.jsx(vt,{label:"Enable Subtitle Gradient",checked:!!r.subtitleGradient,onChange:f=>i({subtitleGradient:f?{colors:["#6366f1","#ec4899"],direction:90}:null})})}),r.subtitleGradient&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Start",value:r.subtitleGradient.colors[0]??"#6366f1",onChange:f=>i({subtitleGradient:{...r.subtitleGradient,colors:[f,r.subtitleGradient.colors[1]??"#ec4899"]}})}),l.jsx(qe,{label:"End",value:r.subtitleGradient.colors[1]??"#ec4899",onChange:f=>i({subtitleGradient:{...r.subtitleGradient,colors:[r.subtitleGradient.colors[0]??"#6366f1",f]}})}),l.jsx(K,{label:"Direction",value:r.subtitleGradient.direction,min:0,max:360,formatValue:f=>`${f}°`,onChange:f=>i({subtitleGradient:{...r.subtitleGradient,direction:f}})})]})]})]}):null}function Ol({title:r,onRemove:i,children:a,defaultCollapsed:c=!1}){const[p,h]=C.useState(c),m=C.useRef(null),[x,f]=C.useState(void 0);return C.useEffect(()=>{m.current&&f(m.current.scrollHeight)},[a,p]),l.jsxs("div",{className:"border border-border rounded-md p-2 mb-1.5 text-[11px]",children:[l.jsxs("div",{className:"flex justify-between items-center mb-1.5",children:[l.jsxs("button",{className:"flex items-center gap-1 font-semibold text-text-dim hover:text-text transition-colors cursor-pointer bg-transparent border-none p-0 text-[11px]",onClick:()=>h(!p),"aria-expanded":!p,"aria-label":`${p?"Expand":"Collapse"} ${r}`,children:[l.jsx("span",{className:"inline-block transition-transform duration-150 text-[8px]",style:{transform:p?"rotate(-90deg)":"rotate(0deg)"},"aria-hidden":"true",children:"▼"}),r]}),l.jsx("button",{className:"text-text-dim hover:text-red-400 text-sm leading-none px-1 transition-colors",onClick:i,"aria-label":`Remove ${r}`,title:`Remove ${r}`,children:"×"})]}),l.jsx("div",{ref:m,className:"overflow-hidden transition-all duration-150 ease-in-out",style:{maxHeight:p?0:x??"none",opacity:p?0:1},"aria-hidden":p,children:a})]})}function Yp({open:r,title:i,message:a,confirmLabel:c="Delete",cancelLabel:p="Cancel",destructive:h=!0,onConfirm:m,onCancel:x}){const f=C.useRef(null),$=C.useRef(null),k=C.useCallback(P=>{var g;if(P.key==="Escape"&&x(),P.key==="Tab"){const E=(g=f.current)==null?void 0:g.querySelectorAll("button");if(!E||E.length===0)return;const b=E[0],_=E[E.length-1];P.shiftKey&&document.activeElement===b?(P.preventDefault(),_.focus()):!P.shiftKey&&document.activeElement===_&&(P.preventDefault(),b.focus())}},[x]);return C.useEffect(()=>{var P;if(r)return(P=$.current)==null||P.focus(),document.addEventListener("keydown",k),()=>document.removeEventListener("keydown",k)},[r,k]),r?l.jsx("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center bg-black/50",onClick:x,"aria-hidden":"true",children:l.jsxs("div",{ref:f,role:"alertdialog","aria-modal":"true","aria-label":i,"aria-describedby":"confirm-dialog-message",className:"bg-surface border border-border rounded-lg shadow-xl p-5 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95",onClick:P=>P.stopPropagation(),children:[l.jsx("h3",{className:"text-sm font-semibold text-text mb-2",children:i}),l.jsx("p",{id:"confirm-dialog-message",className:"text-xs text-text-dim mb-4 leading-relaxed",children:a}),l.jsxs("div",{className:"flex gap-2 justify-end",children:[l.jsx("button",{ref:$,className:"px-3 py-1.5 text-[11px] font-medium bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-text-dim transition-colors",onClick:x,children:p}),l.jsx("button",{className:`px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${h?"bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30":"bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30"}`,onClick:m,children:c})]})]})}):null}function ci(){const[r,i]=C.useState({open:!1,options:{title:"",message:""},resolve:null}),a=C.useCallback(m=>new Promise(x=>{i({open:!0,options:m,resolve:x})}),[]),c=C.useCallback(()=>{var m;(m=r.resolve)==null||m.call(r,!0),i(x=>({...x,open:!1,resolve:null}))},[r.resolve]),p=C.useCallback(()=>{var m;(m=r.resolve)==null||m.call(r,!1),i(x=>({...x,open:!1,resolve:null}))},[r.resolve]),h=l.jsx(Yp,{open:r.open,title:r.options.title,message:r.options.message,confirmLabel:r.options.confirmLabel,destructive:r.options.destructive,onConfirm:c,onCancel:p});return{confirm:a,dialog:h}}function Ua(r){return`${r}-${crypto.randomUUID().slice(0,8)}`}function Hp(){const{screen:r,update:i}=ui(),{confirm:a,dialog:c}=ci();if(!r)return null;const p=(E,b)=>{const _=r.annotations.map((y,R)=>R===E?{...y,...b}:y);i({annotations:_})},h=async E=>{await a({title:"Remove Annotation",message:`Remove Annotation ${E+1}? This cannot be undone.`})&&i({annotations:r.annotations.filter((_,y)=>y!==E)})},m=()=>{i({annotations:[...r.annotations,{id:Ua("ann"),shape:"rounded-rect",x:40,y:40,w:20,h:20,strokeColor:"#FF3B30",strokeWidth:4}]})},x=(E,b)=>{const _=r.callouts.map((y,R)=>R===E?{...y,...b}:y);i({callouts:_})},f=async E=>{await a({title:"Remove Callout",message:`Remove Callout ${E+1}? This cannot be undone.`})&&i({callouts:r.callouts.filter((_,y)=>y!==E)})},$=()=>{i({callouts:[...r.callouts,{id:Ua("callout"),sourceX:30,sourceY:40,sourceW:40,sourceH:20,displayX:60,displayY:10,displayScale:1,rotation:0,borderRadius:8,shadow:!0,borderWidth:0,borderColor:"#ffffff"}]})},k=(E,b)=>{const _=r.overlays.map((y,R)=>R===E?{...y,...b}:y);i({overlays:_})},P=async E=>{await a({title:"Remove Overlay",message:`Remove Overlay ${E+1}? This cannot be undone.`})&&i({overlays:r.overlays.filter((_,y)=>y!==E)})},g=()=>{i({overlays:[...r.overlays,{id:Ua("overlay"),type:"shape",x:10,y:10,size:10,rotation:0,opacity:1,shapeType:"circle",shapeColor:"#6366f1",shapeOpacity:.5,shapeBlur:10}]})};return l.jsxs(l.Fragment,{children:[c,l.jsxs(De,{title:"Spotlight / Dimming",tooltip:"Dim the background and highlight a specific area of your screenshot to draw attention.",defaultCollapsed:!1,children:[!r.spotlight&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Dim the screenshot background and highlight a specific region to guide the viewer's eye."}),l.jsx(vt,{label:"Enable Spotlight",checked:!!r.spotlight,onChange:E=>i({spotlight:E?{x:50,y:50,w:30,h:30,shape:"rectangle",dimOpacity:.6,blur:0}:null})}),r.spotlight&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:r.spotlight.shape,onChange:E=>i({spotlight:{...r.spotlight,shape:E}}),options:[{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(K,{label:"Position X",value:r.spotlight.x,min:0,max:100,formatValue:E=>`${E}%`,onChange:E=>i({spotlight:{...r.spotlight,x:E}})}),l.jsx(K,{label:"Position Y",value:r.spotlight.y,min:0,max:100,formatValue:E=>`${E}%`,onChange:E=>i({spotlight:{...r.spotlight,y:E}})}),l.jsx(K,{label:"Width",value:r.spotlight.w,min:5,max:100,formatValue:E=>`${E}%`,onChange:E=>i({spotlight:{...r.spotlight,w:E}})}),l.jsx(K,{label:"Height",value:r.spotlight.h,min:5,max:100,formatValue:E=>`${E}%`,onChange:E=>i({spotlight:{...r.spotlight,h:E}})}),l.jsx(K,{label:"Dim Opacity",value:Math.round(r.spotlight.dimOpacity*100),min:0,max:100,formatValue:E=>`${E}%`,onChange:E=>i({spotlight:{...r.spotlight,dimOpacity:E/100}})}),l.jsx(K,{label:"Background Blur",value:r.spotlight.blur,min:0,max:30,formatValue:E=>`${E}px`,onChange:E=>i({spotlight:{...r.spotlight,blur:E}})})]})]}),l.jsxs(De,{title:"Annotations",tooltip:"Draw shapes (rectangles, circles) over the screenshot to highlight specific UI elements.",children:[r.annotations.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Highlight areas of your screenshot with rectangles or circles. Great for drawing attention to specific features."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:m,children:"+ Add Annotation"}),r.annotations.map((E,b)=>l.jsxs(Ol,{title:`Annotation ${b+1}`,onRemove:()=>h(b),children:[l.jsx(Ge,{label:"Shape",value:E.shape,onChange:_=>p(b,{shape:_}),options:[{value:"rounded-rect",label:"Rounded Rect"},{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(qe,{label:"Color",value:E.strokeColor,onChange:_=>p(b,{strokeColor:_})}),l.jsx(K,{label:"X",value:E.x,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>p(b,{x:_})}),l.jsx(K,{label:"Y",value:E.y,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>p(b,{y:_})}),l.jsx(K,{label:"Width",value:E.w,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>p(b,{w:_})}),l.jsx(K,{label:"Height",value:E.h,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>p(b,{h:_})}),l.jsx(K,{label:"Stroke",value:E.strokeWidth,min:1,max:20,formatValue:_=>`${_}px`,onChange:_=>p(b,{strokeWidth:_})})]},E.id))]}),l.jsxs(De,{title:"Loupe / Magnification",tooltip:"Magnify a region of the screenshot and display it enlarged elsewhere on the frame.",children:[l.jsx(vt,{label:"Loupe",checked:!!r.loupe,onChange:E=>i({loupe:E?{width:.5,height:.33,sourceX:0,sourceY:0,scale:1.1,cornerRadius:0,borderWidth:0,borderColor:"#ffffff",shadow:!0,shadowColor:"#000000",shadowRadius:30,shadowOffsetX:0,shadowOffsetY:0,xOffset:0,yOffset:0}:null})}),(()=>{const E={width:.5,height:.33,sourceX:0,sourceY:0,scale:1.1,cornerRadius:0,borderWidth:0,borderColor:"#ffffff",shadow:!0,shadowColor:"#000000",shadowRadius:30,shadowOffsetX:0,shadowOffsetY:0,xOffset:0,yOffset:0},b=r.loupe??E,_=y=>i({loupe:{...b,...y}});return l.jsxs("div",{className:r.loupe?"":"opacity-40 pointer-events-none",children:[l.jsx(K,{label:"Width",value:b.width,min:.05,max:1,step:.01,formatValue:y=>y.toFixed(2),onChange:y=>_({width:y})}),l.jsx(K,{label:"Height",value:b.height,min:.05,max:1,step:.01,formatValue:y=>y.toFixed(2),onChange:y=>_({height:y})}),l.jsx(K,{label:"Source X",value:b.sourceX,min:-1,max:1,step:.01,formatValue:y=>y.toFixed(2),onChange:y=>_({sourceX:y})}),l.jsx(K,{label:"Source Y",value:b.sourceY,min:-1,max:1,step:.01,formatValue:y=>y.toFixed(2),onChange:y=>_({sourceY:y})}),l.jsx(K,{label:"Corner Radius",value:b.cornerRadius??0,min:0,max:100,formatValue:y=>`${y}`,onChange:y=>_({cornerRadius:y})}),l.jsx(vt,{label:"Border",checked:(b.borderWidth??0)>0,onChange:y=>_({borderWidth:y?3:0})}),(b.borderWidth??0)>0&&l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Border Width",value:b.borderWidth,min:1,max:10,formatValue:y=>`${y}px`,onChange:y=>_({borderWidth:y})}),l.jsx(qe,{label:"Border Color",value:b.borderColor,onChange:y=>_({borderColor:y})})]}),l.jsx(vt,{label:"Shadow",checked:!!b.shadow,onChange:y=>_({shadow:y})}),b.shadow&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Shadow Color",value:b.shadowColor??"#000000",onChange:y=>_({shadowColor:y})}),l.jsx(K,{label:"Shadow Radius",value:b.shadowRadius??30,min:0,max:100,formatValue:y=>`${y}`,onChange:y=>_({shadowRadius:y})}),l.jsx(K,{label:"Shadow X Offset",value:b.shadowOffsetX??0,min:-50,max:50,formatValue:y=>`${y}`,onChange:y=>_({shadowOffsetX:y})}),l.jsx(K,{label:"Shadow Y Offset",value:b.shadowOffsetY??0,min:-50,max:50,formatValue:y=>`${y}`,onChange:y=>_({shadowOffsetY:y})})]}),l.jsx(K,{label:"Scale",value:b.scale??1.1,min:1,max:3,step:.01,formatValue:y=>`${y.toFixed(2)}x`,onChange:y=>_({scale:y})}),l.jsx(K,{label:"X Offset",value:b.xOffset??0,min:-100,max:100,formatValue:y=>`${y}`,onChange:y=>_({xOffset:y})}),l.jsx(K,{label:"Y Offset",value:b.yOffset??0,min:-100,max:100,formatValue:y=>`${y}`,onChange:y=>_({yOffset:y})})]})})()]}),l.jsxs(De,{title:"Callouts",tooltip:"Crop and enlarge a portion of the screenshot, displayed as a floating callout card.",children:[r.callouts.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Zoom into a specific area and display it as a floating card. Perfect for showcasing small UI details."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:$,children:"+ Add Callout"}),r.callouts.map((E,b)=>l.jsxs(Ol,{title:`Callout ${b+1}`,onRemove:()=>f(b),children:[l.jsx(K,{label:"Source X",value:E.sourceX,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>x(b,{sourceX:_})}),l.jsx(K,{label:"Source Y",value:E.sourceY,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>x(b,{sourceY:_})}),l.jsx(K,{label:"Source W",value:E.sourceW,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>x(b,{sourceW:_})}),l.jsx(K,{label:"Source H",value:E.sourceH,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>x(b,{sourceH:_})}),l.jsx(K,{label:"Display X",value:E.displayX,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>x(b,{displayX:_})}),l.jsx(K,{label:"Display Y",value:E.displayY,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>x(b,{displayY:_})}),l.jsx(K,{label:"Scale",value:Math.round(E.displayScale*100),min:50,max:300,step:10,formatValue:_=>`${(_/100).toFixed(1)}x`,onChange:_=>x(b,{displayScale:_/100})}),l.jsx(K,{label:"Rotation",value:E.rotation,min:-45,max:45,formatValue:_=>`${_}°`,onChange:_=>x(b,{rotation:_})}),l.jsx(K,{label:"Radius",value:E.borderRadius,min:0,max:30,formatValue:_=>`${_}px`,onChange:_=>x(b,{borderRadius:_})})]},E.id))]}),l.jsxs(De,{title:"Overlays",tooltip:"Add decorative shapes, stars, icons, or badges floating over the screenshot.",children:[r.overlays.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Add floating shapes, star ratings, icons, or badges over your screenshot for extra visual appeal."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:g,children:"+ Add Overlay"}),r.overlays.map((E,b)=>l.jsxs(Ol,{title:`Overlay ${b+1}`,onRemove:()=>P(b),children:[l.jsx(Ge,{label:"Type",value:E.type,onChange:_=>k(b,{type:_}),options:[{value:"shape",label:"Shape"},{value:"star-rating",label:"Star Rating"},{value:"icon",label:"Icon"},{value:"badge",label:"Badge"},{value:"custom",label:"Custom"}]}),l.jsx(K,{label:"X",value:E.x,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>k(b,{x:_})}),l.jsx(K,{label:"Y",value:E.y,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>k(b,{y:_})}),l.jsx(K,{label:"Size",value:E.size,min:1,max:50,formatValue:_=>`${_}%`,onChange:_=>k(b,{size:_})}),l.jsx(K,{label:"Rotation",value:E.rotation,min:-180,max:180,formatValue:_=>`${_}°`,onChange:_=>k(b,{rotation:_})}),l.jsx(K,{label:"Opacity",value:Math.round(E.opacity*100),min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>k(b,{opacity:_/100})}),E.type==="shape"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:E.shapeType??"circle",onChange:_=>k(b,{shapeType:_}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"}]}),l.jsx(qe,{label:"Color",value:E.shapeColor??"#6366f1",onChange:_=>k(b,{shapeColor:_})}),l.jsx(K,{label:"Shape Opacity",value:Math.round((E.shapeOpacity??.5)*100),min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>k(b,{shapeOpacity:_/100})}),l.jsx(K,{label:"Blur",value:E.shapeBlur??0,min:0,max:50,formatValue:_=>`${_}px`,onChange:_=>k(b,{shapeBlur:_})})]})]},E.id))]})]})}function mf(r,i,a,c){var p,h,m,x,f,$;return{screenIndex:r.screenIndex,screenshotDataUrl:r.screenshotDataUrl||void 0,locale:c!=="default"?c:void 0,style:r.style,layout:r.layout,headline:r.headline,subtitle:r.subtitle,colors:r.colors,font:r.font,fontWeight:r.fontWeight,headlineSize:r.headlineSize||void 0,subtitleSize:r.subtitleSize||void 0,headlineRotation:r.headlineRotation||void 0,subtitleRotation:r.subtitleRotation||void 0,frameId:r.frameId,deviceColor:r.deviceColor||void 0,frameStyle:r.frameStyle,deviceScale:r.deviceScale,deviceTop:r.deviceTop,deviceRotation:r.deviceRotation,deviceOffsetX:r.deviceOffsetX,deviceAngle:r.deviceAngle,deviceTilt:r.deviceTilt,headlineTop:(p=r.textPositions.headline)==null?void 0:p.y,headlineLeft:(h=r.textPositions.headline)==null?void 0:h.x,headlineWidth:(m=r.textPositions.headline)==null?void 0:m.width,subtitleTop:(x=r.textPositions.subtitle)==null?void 0:x.y,subtitleLeft:(f=r.textPositions.subtitle)==null?void 0:f.x,subtitleWidth:($=r.textPositions.subtitle)==null?void 0:$.width,composition:r.composition||"single",headlineGradient:r.headlineGradient||void 0,subtitleGradient:r.subtitleGradient||void 0,autoSizeHeadline:r.autoSizeHeadline||void 0,autoSizeSubtitle:r.autoSizeSubtitle||void 0,spotlight:r.spotlight||void 0,annotations:r.annotations.length>0?r.annotations:void 0,backgroundType:r.backgroundType!=="preset"?r.backgroundType:void 0,backgroundColor:r.backgroundType==="solid"?r.backgroundColor:void 0,backgroundGradient:r.backgroundType==="gradient"?r.backgroundGradient:void 0,backgroundImageDataUrl:r.backgroundType==="image"?r.backgroundImageDataUrl:void 0,backgroundOverlay:r.backgroundType==="image"&&r.backgroundOverlay?r.backgroundOverlay:void 0,deviceShadow:r.deviceShadow||void 0,borderSimulation:r.borderSimulation||void 0,cornerRadius:r.cornerRadius||void 0,loupe:r.loupe||void 0,callouts:r.callouts.length>0?r.callouts:void 0,overlays:r.overlays.length>0?r.overlays:void 0,headlineLineHeight:r.headlineLineHeight?r.headlineLineHeight/100:void 0,headlineLetterSpacing:r.headlineLetterSpacing?`${r.headlineLetterSpacing/100}em`:void 0,headlineTextTransform:r.headlineTextTransform||void 0,headlineFontStyle:r.headlineFontStyle||void 0,subtitleOpacity:r.subtitleOpacity?r.subtitleOpacity/100:void 0,subtitleLetterSpacing:r.subtitleLetterSpacing?`${r.subtitleLetterSpacing/100}em`:void 0,subtitleTextTransform:r.subtitleTextTransform||void 0,width:i,height:a}}function Up(r,i,a,c,p,h){return mf(r,a,c,p)}function Wd(r,i){return{...mf(r,i.previewW,i.previewH,i.locale),sizeKey:i.sizeKey,renderer:i.renderer}}function Vp({message:r,onDone:i}){return C.useEffect(()=>{const a=setTimeout(i,3e3);return()=>clearTimeout(a)},[i]),l.jsx("div",{role:"alert","aria-live":"polite",className:"fixed top-4 right-4 z-50 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-in fade-in",children:r})}function Gs(r,i){const a=URL.createObjectURL(r),c=document.createElement("a");c.href=a,c.download=i,document.body.appendChild(c),c.click(),document.body.removeChild(c),URL.revokeObjectURL(a)}function Yd(){const r=V(H=>H.platform),i=V(H=>H.sizes),a=V(H=>H.exportSize),c=V(H=>H.setExportSize),p=V(H=>H.exportRenderer),h=V(H=>H.setExportRenderer),m=V(H=>H.koubouAvailable),x=V(H=>H.locale),f=V(H=>H.setLocale),$=V(H=>H.previewBg),k=V(H=>H.setPreviewBg),P=V(H=>H.config),g=V(H=>H.initScreens),E=V(H=>H.triggerRender),b=V(H=>H.selectedScreen),_=V(H=>H.screens),y=V(H=>H.isPanoramic),R=V(H=>H.panoramicFrameCount),ee=V(H=>H.panoramicBackground),ne=V(H=>H.panoramicElements),se=V(H=>H.panoramicEffects),re=V(H=>H.previewW),ie=V(H=>H.previewH),[ue,v]=C.useState(!1),[G,fe]=C.useState("Ready"),[Z,de]=C.useState(null),Me=C.useCallback(()=>de(null),[]),ze=(i[r]??[]).map(H=>({value:H.key,label:`${H.name} (${H.width}×${H.height})`})),O=!m||r==="android",W=[{value:"playwright",label:"Playwright (fast)"},{value:"koubou",label:"Koubou (pixel-perfect)",disabled:O,title:O?m?"Koubou is not available for Android":"Koubou server not running":void 0}],M=[{value:"default",label:"Default"}];if(P!=null&&P.locales)for(const H of Object.keys(P.locales))M.push({value:H,label:H});const Y=H=>({frameCount:R,frameWidth:re,frameHeight:ie,background:ee,elements:ne,effects:se,font:P==null?void 0:P.theme.font,fontWeight:P==null?void 0:P.theme.fontWeight,frameStyle:P==null?void 0:P.frames.style,sizeKey:a,frameIndex:H}),U=async()=>{v(!0);let H=0;for(let ve=0;ve<R;ve++){fe(`Exporting frame ${ve+1} of ${R}...`);try{const Ie=await zd(Y(ve));Gs(Ie,`frame-${ve+1}.png`),H++}catch(Ie){fe(`Error on frame ${ve+1}: ${Ie instanceof Error?Ie.message:"Unknown"}`)}}v(!1),fe(`Exported ${H} of ${R} frames`),de(`Exported ${H} frames`)},L=async()=>{v(!0),fe("Exporting full panoramic canvas...");try{const H=await zd(Y());Gs(H,"panoramic-full.png");const ve=Math.round(H.size/1024);fe(`Exported panoramic (${ve}KB)`),de(`Panoramic canvas exported (${ve}KB)`)}catch(H){fe(`Export error: ${H instanceof Error?H.message:"Unknown error"}`)}finally{v(!1)}},D=async()=>{const H=_[b];if(H){v(!0),fe(p==="koubou"?`Rendering screen ${b+1} with Koubou...`:`Exporting screen ${b+1}...`);try{const ve=await Md(Wd(H,{previewW:re,previewH:ie,locale:x,sizeKey:a,renderer:p}));Gs(ve,`screenshot-${b+1}.png`);const Ie=Math.round(ve.size/1024);fe(`Exported (${Ie}KB)`),de(`Screen ${b+1} exported (${Ie}KB)`)}catch(ve){fe(`Export error: ${ve instanceof Error?ve.message:"Unknown error"}`)}finally{v(!1)}}},ae=async()=>{if(_.length===0)return;v(!0);let H=0;for(let ve=0;ve<_.length;ve++){const Ie=_[ve];if(Ie){fe(`Exporting screen ${ve+1} of ${_.length}...`);try{const Te=await Md(Wd(Ie,{previewW:re,previewH:ie,locale:x,sizeKey:a,renderer:p}));Gs(Te,`screenshot-${ve+1}.png`),H++}catch(Te){fe(`Error on screen ${ve+1}: ${Te instanceof Error?Te.message:"Unknown"}`)}}}v(!1),fe(`Exported ${H} of ${_.length} screens`),de(`Exported ${H} screenshots`)},we=async()=>{try{const H=await dp();g(H,r),E(),fe("Config reloaded")}catch(H){fe(`Reload error: ${H instanceof Error?H.message:"Unknown error"}`)}};return!y&&_.length===0?l.jsx(De,{title:"Export",tooltip:"Choose output size and renderer, then download your screenshots.",defaultCollapsed:!1,children:l.jsxs("p",{className:"text-xs text-text-dim text-center py-4",children:["No screens to export."," ",l.jsx("button",{className:"text-accent hover:text-accent-hover underline",onClick:()=>V.getState().setActiveTab("background"),children:"Go to Background tab"})," ","to get started."]})}):l.jsxs(l.Fragment,{children:[Z&&l.jsx(Vp,{message:Z,onDone:Me}),l.jsxs(De,{title:"Export",tooltip:"Choose output size and renderer, then download your screenshots.",defaultCollapsed:!1,children:[l.jsx(Ge,{label:"Output Size",value:a,onChange:c,options:ze}),!y&&m&&l.jsx(Ge,{label:"Renderer",value:p,onChange:h,options:W}),y?l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1",onClick:U,disabled:ue,children:ue?"Exporting...":`Export All ${R} Frames`}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text disabled:opacity-50 mt-1",onClick:L,disabled:ue,children:ue?"Exporting...":"Export Full Canvas"})]}):l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1",onClick:D,disabled:ue,children:ue?"Exporting...":"Download Screenshot"}),_.length>1&&l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text disabled:opacity-50 mt-1",onClick:ae,disabled:ue,children:ue?"Exporting...":`Export All ${_.length} Screens`})]})]}),!y&&l.jsx(De,{title:"Locale",tooltip:"Select a locale to export localized screenshots. Configure locales in your YAML config file.",children:l.jsx(Ge,{label:"Language",value:x,onChange:f,options:M})}),l.jsx(De,{title:"Preview Background",tooltip:"Change the editor background color. This does not affect exported images.",children:l.jsx("div",{className:"flex gap-3",children:["dark","light"].map(H=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:$===H,onChange:()=>k(H),className:"accent-accent"}),H.charAt(0).toUpperCase()+H.slice(1)]},H))})}),l.jsxs(De,{title:"Actions",tooltip:"Refresh previews or reload the YAML configuration file from disk.",children:[l.jsxs("div",{className:"flex gap-2",children:[l.jsx("button",{className:"flex-1 py-2 text-xs bg-accent hover:bg-accent-hover text-white rounded-md",onClick:E,children:"Refresh All"}),l.jsx("button",{className:"flex-1 py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:we,children:"Reload Config"})]}),l.jsx("div",{className:`text-[10px] mt-2 ${G.startsWith("Export error")||G.startsWith("Reload error")||G.startsWith("Error")?"text-red-400":G.startsWith("Exported")||G==="Config reloaded"?"text-green-400":"text-text-dim"}`,children:G})]})]})}let pf=null;function Hd(r){pf=r}function Xp(){return pf}function hf(){const r=V(x=>x.previewW),i=V(x=>x.previewH),a=V(x=>x.panoramicFrameCount),c=C.useCallback(()=>{try{const x=Xp();return(x==null?void 0:x.contentDocument)??null}catch{return null}},[]),p=r*a,h=C.useCallback(x=>{const f=c();if(!f)return;const $=f.querySelector(".panoramic-canvas");if($){if(x.type==="solid"&&x.color)$.style.background=x.color;else if(x.type==="gradient"&&x.colors){const k=x.colors.join(", ");x.gradientType==="radial"?$.style.background=`radial-gradient(circle at ${x.radialPosition??"center"}, ${k})`:$.style.background=`linear-gradient(${x.direction??135}deg, ${k})`}}},[c]),m=C.useCallback((x,f)=>{const $=c();if(!$)return;const k=$.querySelector(`[data-index="${x}"]`);k&&(f.x!==void 0&&(k.style.left=`${f.x/100*p}px`),f.y!==void 0&&(k.style.top=`${f.y/100*i}px`),f.width!==void 0&&(k.style.width=`${f.width/100*p}px`),f.height!==void 0&&(k.style.height=`${f.height/100*i}px`),f.rotation!==void 0&&(k.style.transform=`rotate(${f.rotation}deg)`),f.opacity!==void 0&&(k.style.opacity=String(f.opacity)),f.color!==void 0&&(k.classList.contains("pano-decoration")?k.style.background=f.color:k.style.color=f.color),f.fontSize!==void 0&&(k.style.fontSize=`${f.fontSize/100*i}px`),f.fontWeight!==void 0&&(k.style.fontWeight=String(f.fontWeight)))},[c,p,i]);return{patchBackground:h,patchElement:m}}const si={device:"Device",text:"Text",label:"Label",decoration:"Decoration"},Qp={iphone:["iphone"],android:["iphone"],ipad:["ipad"],mac:["mac"],watch:["watch"]},Gp={iphone:["default-ios","default-android"],android:["default-ios","default-android"],ipad:["default-ipad","fallback-tablet"],mac:[],watch:[]};function Kp(r,i,a){const c=a?Qp[a]??["iphone"]:null,p=a?Gp[a]??[]:null,h={};for(const f of r){const $=f.category||"other";if(c&&!c.includes($))continue;const k=h[$]??[];k.push({value:f.id,label:f.name}),h[$]=k}const m=Object.entries(h).map(([f,$])=>({label:f.charAt(0).toUpperCase()+f.slice(1),options:$})),x=[];for(const f of i){if(p&&p.length>0){if(!(f.tags??[]).some(k=>p.includes(k)))continue}else if(p&&p.length===0)continue;x.push({value:f.id,label:f.name})}return x.length>0&&m.push({label:"SVG Frames",options:x}),m}function Zp(r,i){return r.map((c,p)=>({z:c.z,i:p})).sort((c,p)=>c.z-p.z).findIndex(c=>c.i===i)}function _f({index:r}){const i=V(v=>v.panoramicElements[r]),a=V(v=>v.panoramicElements),c=V(v=>v.updatePanoramicElement),p=V(v=>v.removePanoramicElement),h=V(v=>v.config),m=V(v=>v.deviceFamilies),x=V(v=>v.frames),f=V(v=>v.fonts),$=C.useRef(null),{confirm:k,dialog:P}=ci(),{patchElement:g}=hf(),E=C.useMemo(()=>Zp(a,r),[a,r]),b=C.useCallback(v=>{c(r,v)},[r,c]),_=C.useCallback(v=>{g(E,v)},[g,E]);if(!i)return null;const y=V(v=>v.platform),R=Kp(m,x,y),ee=(h==null?void 0:h.frames.ios)??"",ne=i.type==="device"?i.frame??ee:"",se=m.find(v=>v.id===ne),re=se&&se.colors.length>1,ie=C.useMemo(()=>ff(f),[f]),ue=v=>{var Z;const G=(Z=v.target.files)==null?void 0:Z[0];if(!G)return;const fe=new FileReader;fe.onload=de=>{var Me;b({screenshot:(Me=de.target)==null?void 0:Me.result})},fe.readAsDataURL(G),v.target.value=""};return l.jsxs("div",{children:[P,l.jsxs("div",{className:"px-5 py-3 border-b border-border flex items-center justify-between",children:[l.jsxs("span",{className:"text-xs font-medium",children:[si[i.type]," #",a.slice(0,r).filter(v=>v.type===i.type).length+1]}),l.jsx("button",{className:"text-[10px] text-red-400 hover:text-red-300",onClick:async()=>{const v=a.slice(0,r).filter(fe=>fe.type===i.type).length+1;await k({title:"Remove Element",message:`Remove ${si[i.type]} #${v}? This cannot be undone.`})&&p(r)},children:"Remove"})]}),l.jsxs(De,{title:"Position",defaultCollapsed:!1,children:[l.jsx(K,{label:"X %",value:i.x,min:-50,max:150,step:.5,formatValue:v=>`${v}%`,onChange:v=>b({x:v}),onInstant:v=>_({x:v})}),l.jsx(K,{label:"Y %",value:i.y,min:-50,max:150,step:.5,formatValue:v=>`${v}%`,onChange:v=>b({y:v}),onInstant:v=>_({y:v})}),l.jsx(K,{label:"Z-Index",value:i.z,min:0,max:100,onChange:v=>b({z:v})})]}),i.type==="device"&&(()=>{const v=(i.frameStyle??"flat")==="none",G=se&&se.screenRect,fe=i.fullscreenScreenshot??!1;return l.jsxs(l.Fragment,{children:[l.jsxs(De,{title:"Screenshot",children:[i.screenshot.startsWith("data:")?l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:i.screenshot,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:"Custom upload"})]}):l.jsx("div",{className:"text-xs text-text-dim mb-2 truncate",children:i.screenshot}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var Z;return(Z=$.current)==null?void 0:Z.click()},children:"Upload Screenshot"}),l.jsx("input",{ref:$,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload screenshot image",onChange:ue}),i.screenshot.startsWith("data:")&&l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>{var Z;return b({screenshot:((Z=h==null?void 0:h.screens[0])==null?void 0:Z.screenshot)??"screenshots/screen-1.png"})},children:"Revert to File"})]}),l.jsxs(De,{title:"Device Frame",children:[l.jsx(Ge,{label:"Frame",value:ne,onChange:Z=>{const de=m.find(Oe=>Oe.id===Z),Me=de&&de.screenRect;b(Me&&v?{frame:Z,frameStyle:"flat"}:{frame:Z})},groups:R}),re&&l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),l.jsx("div",{className:"flex flex-wrap gap-1",children:se.colors.map(Z=>l.jsx("button",{className:`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent ${i.deviceColor===Z.name?"border-accent ring-1 ring-accent":"border-border"}`,style:{background:df[Z.name]??"#888888"},title:Z.name,"aria-label":`${Z.name} color variant`,"aria-pressed":i.deviceColor===Z.name,onClick:()=>b({deviceColor:Z.name})},Z.name))})]}),l.jsx(Ge,{label:"Frame Style",value:i.frameStyle??"flat",onChange:Z=>b({frameStyle:Z}),options:[{value:"flat",label:"Flat"},{value:"none",label:"None (frameless)"}],hidden:!!G}),v&&l.jsxs(l.Fragment,{children:[l.jsx(vt,{label:"Border Simulation",checked:!!i.borderSimulation,onChange:Z=>b({borderSimulation:Z?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:void 0})}),i.borderSimulation&&(()=>{const Z=i.borderSimulation;return l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Thickness",value:Z.thickness,min:1,max:20,formatValue:de=>`${de}px`,onChange:de=>b({borderSimulation:{...Z,thickness:de}})}),l.jsx(qe,{label:"Color",value:Z.color,onChange:de=>b({borderSimulation:{...Z,color:de}})}),l.jsx(K,{label:"Radius",value:Z.radius,min:0,max:60,formatValue:de=>`${de}px`,onChange:de=>b({borderSimulation:{...Z,radius:de}})})]})})()]})]}),l.jsxs(De,{title:"Device Layout",tooltip:"Control device scale, position, and fullscreen mode.",children:[l.jsx(vt,{label:"Fullscreen Screenshot",checked:fe,onChange:Z=>b({fullscreenScreenshot:Z})}),!fe&&l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Device Size",value:i.width,min:5,max:60,step:.5,formatValue:Z=>`${Z}%`,onChange:Z=>b({width:Z}),onInstant:Z=>_({width:Z})}),l.jsx(K,{label:"Device Rotation",value:i.rotation,min:-180,max:180,formatValue:Z=>`${Z}°`,onChange:Z=>b({rotation:Z}),onInstant:Z=>_({rotation:Z})}),l.jsx(K,{label:"3D Tilt",value:i.deviceTilt??0,min:0,max:40,formatValue:Z=>`${Z}°`,onChange:Z=>b({deviceTilt:Z})}),v&&l.jsx(K,{label:"Corner Radius",value:i.cornerRadius??0,min:0,max:50,formatValue:Z=>`${Z}%`,onChange:Z=>b({cornerRadius:Z})})]})]}),l.jsxs(De,{title:"Device Shadow",tooltip:"Add a custom shadow beneath the device frame.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Custom Shadow",checked:!!i.shadow,onChange:Z=>b({shadow:Z?{opacity:.25,blur:20,color:"#000000",offsetY:10}:void 0})}),i.shadow&&l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Opacity",value:Math.round(i.shadow.opacity*100),min:0,max:100,formatValue:Z=>`${Z}%`,onChange:Z=>b({shadow:{...i.shadow,opacity:Z/100}})}),l.jsx(K,{label:"Blur",value:i.shadow.blur,min:0,max:50,formatValue:Z=>`${Z}px`,onChange:Z=>b({shadow:{...i.shadow,blur:Z}})}),l.jsx(qe,{label:"Color",value:i.shadow.color,onChange:Z=>b({shadow:{...i.shadow,color:Z}})}),l.jsx(K,{label:"Y Offset",value:i.shadow.offsetY,min:0,max:30,formatValue:Z=>`${Z}px`,onChange:Z=>b({shadow:{...i.shadow,offsetY:Z}})})]})]})]})})(),i.type==="text"&&l.jsxs(l.Fragment,{children:[l.jsxs(De,{title:"Content",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Headline"}),l.jsx("textarea",{rows:3,value:i.content,onChange:v=>b({content:v.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),l.jsx(qe,{label:"Color",value:i.color,onChange:v=>b({color:v})})]}),l.jsxs(De,{title:"Typography",tooltip:"Control font family, weight, size, and styling for this element.",children:[l.jsx(Ge,{label:"Font",value:i.font??(h==null?void 0:h.theme.font)??"inter",onChange:v=>b({font:v}),groups:ie}),l.jsx(K,{label:"Font Size",value:i.fontSize,min:.5,max:20,step:.1,formatValue:v=>`${v}%`,onChange:v=>b({fontSize:v}),onInstant:v=>_({fontSize:v})}),l.jsx(K,{label:"Font Weight",value:i.fontWeight,min:100,max:900,step:100,formatValue:v=>String(v),onChange:v=>b({fontWeight:v}),onInstant:v=>_({fontWeight:v})}),l.jsx(Ge,{label:"Alignment",value:i.textAlign,onChange:v=>b({textAlign:v}),options:[{value:"left",label:"Left"},{value:"center",label:"Center"},{value:"right",label:"Right"}]}),l.jsx(K,{label:"Line Height",value:i.lineHeight,min:.8,max:2,step:.05,formatValue:v=>v.toFixed(2),onChange:v=>b({lineHeight:v})}),l.jsxs("div",{className:"flex gap-2 mb-2",children:[l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Case",value:i.textTransform??"",onChange:v=>b({textTransform:v}),options:[{value:"",label:"Auto"},{value:"none",label:"None"},{value:"uppercase",label:"Uppercase"},{value:"lowercase",label:"Lowercase"},{value:"capitalize",label:"Capitalize"}]})}),l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Style",value:i.fontStyle,onChange:v=>b({fontStyle:v}),options:[{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}]})})]}),l.jsx(K,{label:"Letter Spacing",value:i.letterSpacing??0,min:-5,max:10,formatValue:v=>v===0?"Auto":`${v/100}em`,onChange:v=>b({letterSpacing:v})}),l.jsx(K,{label:"Rotation",value:i.rotation??0,min:-30,max:30,formatValue:v=>`${v}°`,onChange:v=>b({rotation:v})})]}),l.jsxs(De,{title:"Text Gradient",tooltip:"Apply a gradient color effect to the text.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Enable Gradient",checked:!!i.gradient,onChange:v=>b({gradient:v?{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"}:void 0})}),i.gradient&&(()=>{const v=i.gradient;return l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:iu.map(G=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${G.direction}deg, ${G.colors.join(", ")})`},title:G.name,"aria-label":`Apply ${G.name} gradient`,onClick:()=>b({gradient:{type:"linear",colors:[...G.colors],direction:G.direction,radialPosition:"center"}})},G.name))}),l.jsx(K,{label:"Direction",value:v.direction,min:0,max:360,formatValue:G=>`${G}°`,onChange:G=>b({gradient:{...v,direction:G}})}),v.colors.map((G,fe)=>l.jsx(qe,{label:`Stop ${fe+1}`,value:G,onChange:Z=>{const de=[...v.colors];de[fe]=Z,b({gradient:{...v,colors:de}})}},fe))]})})()]}),l.jsxs(De,{title:"Layout",children:[l.jsx(vt,{label:"Limit width",checked:i.maxWidth!==void 0,onChange:v=>b({maxWidth:v?25:void 0})}),i.maxWidth!==void 0&&l.jsx(K,{label:"Max Width %",value:i.maxWidth,min:5,max:100,step:.5,formatValue:v=>`${v}%`,onChange:v=>b({maxWidth:v})})]})]}),i.type==="label"&&l.jsxs(De,{title:"Label",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Content"}),l.jsx("input",{type:"text",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] outline-none focus:border-accent",value:i.content,onChange:v=>b({content:v.target.value})})]}),l.jsx(K,{label:"Font Size",value:i.fontSize,min:.5,max:10,step:.1,formatValue:v=>`${v}%`,onChange:v=>b({fontSize:v}),onInstant:v=>_({fontSize:v})}),l.jsx(qe,{label:"Text Color",value:i.color,onChange:v=>b({color:v})}),l.jsx(qe,{label:"Background",value:i.backgroundColor??"#00000033",onChange:v=>b({backgroundColor:v})}),l.jsx(K,{label:"Padding",value:i.padding,min:0,max:5,step:.1,formatValue:v=>`${v}%`,onChange:v=>b({padding:v})}),l.jsx(K,{label:"Border Radius",value:i.borderRadius,min:0,max:30,formatValue:v=>`${v}px`,onChange:v=>b({borderRadius:v})})]}),i.type==="decoration"&&l.jsxs(De,{title:"Decoration",children:[l.jsx(Ge,{label:"Shape",value:i.shape,onChange:v=>b({shape:v}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"},{value:"dot-grid",label:"Dot Grid"}]}),l.jsx(K,{label:"Width",value:i.width,min:.5,max:100,step:.5,formatValue:v=>`${v}%`,onChange:v=>b({width:v}),onInstant:v=>_({width:v})}),i.height!==void 0&&l.jsx(K,{label:"Height",value:i.height,min:.5,max:100,step:.5,formatValue:v=>`${v}%`,onChange:v=>b({height:v}),onInstant:v=>_({height:v})}),l.jsx(K,{label:"Opacity",value:i.opacity,min:0,max:1,step:.05,formatValue:v=>`${Math.round(v*100)}%`,onChange:v=>b({opacity:v}),onInstant:v=>_({opacity:v})}),l.jsx(K,{label:"Rotation",value:i.rotation,min:-180,max:180,formatValue:v=>`${v}°`,onChange:v=>b({rotation:v}),onInstant:v=>_({rotation:v})}),l.jsx(qe,{label:"Color",value:i.color,onChange:v=>b({color:v})})]})]})}function Jp({imageDataUrl:r,onUpload:i,onRemove:a}){const c=C.useRef(null),p=h=>{var f;const m=(f=h.target.files)==null?void 0:f[0];if(!m)return;const x=new FileReader;x.onload=$=>{var k;return i((k=$.target)==null?void 0:k.result)},x.readAsDataURL(m),h.target.value=""};return l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var h;return(h=c.current)==null?void 0:h.click()},children:"Upload Background Image"}),l.jsx("input",{ref:c,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload background image",onChange:p}),r&&l.jsxs("div",{className:"mt-1.5",children:[l.jsx("img",{src:r,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:a,children:"Remove"})]})]})}function qp(){const r=C.useRef(null),i=V(m=>m.panoramicElements),a=V(m=>m.updatePanoramicElement),c=V(m=>m.addPanoramicElement),p=i.map((m,x)=>({el:m,i:x})).filter(({el:m})=>m.type==="device"),h=m=>{const x=Array.from(m.target.files??[]);x.length!==0&&(x.forEach((f,$)=>{const k=new FileReader;k.onload=P=>{var E;const g=(E=P.target)==null?void 0:E.result;if($<p.length)a(p[$].i,{screenshot:g});else{const b=p.length+($-p.length);c({type:"device",screenshot:g,x:10+b*20,y:15,width:12,rotation:0,z:5})}},k.readAsDataURL(f)}),m.target.value="")};return l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var m;return(m=r.current)==null?void 0:m.click()},children:"Upload Screenshots"}),l.jsx("input",{ref:r,type:"file",accept:"image/png,image/jpeg,image/webp",multiple:!0,className:"hidden","aria-label":"Upload device screenshots",onChange:h}),p.length>0&&l.jsx("div",{className:"mt-2 space-y-1",children:p.map(({el:m,i:x})=>l.jsxs("div",{className:"flex items-center gap-2 text-[11px] text-text-dim",children:[l.jsx("span",{className:"w-4 text-center",children:p.indexOf(p.find(f=>f.i===x))+1}),m.screenshot.startsWith("data:")?l.jsx("img",{src:m.screenshot,alt:"",className:"w-6 h-6 rounded object-cover border border-border"}):l.jsx("span",{className:"truncate flex-1",children:m.screenshot})]},x))}),l.jsx("p",{className:"text-[10px] text-text-dim mt-1.5",children:"Select multiple files to assign to device elements in order."})]})}const eh=[{value:"iphone",label:"iPhone"},{value:"ipad",label:"iPad"},{value:"mac",label:"Mac"},{value:"watch",label:"Apple Watch"},{value:"android",label:"Android"}];function th(){const r=V(y=>y.panoramicFrameCount),i=V(y=>y.setPanoramicFrameCount),a=V(y=>y.panoramicBackground),c=V(y=>y.updatePanoramicBackground),p=V(y=>y.platform),h=V(y=>y.setPlatform),m=V(y=>y.setPreviewSize),x=V(y=>y.sizes),f=V(y=>y.setExportSize),{patchBackground:$}=hf(),k=C.useCallback(y=>{h(y);const R=Fl[y];R&&m(R.w,R.h);const ee=x[y]??[];ee.length>0&&f(ee[0].key)},[f,h,m,x]),P=C.useCallback(y=>$({type:"solid",color:y}),[$]),g=C.useCallback(y=>{const R=a.gradient??{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"};$({type:"gradient",gradientType:R.type,colors:(y==null?void 0:y.colors)??R.colors,direction:(y==null?void 0:y.direction)??R.direction,radialPosition:R.radialPosition})},[a.gradient,$]),E=a.type,b=a.color??"#000000",_=a.gradient??{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"};return l.jsxs("div",{children:[l.jsxs(De,{title:"Canvas",defaultCollapsed:!1,children:[l.jsx(Ge,{label:"Platform",value:p,onChange:k,options:eh}),l.jsx(K,{label:"Frame Count",value:r,min:2,max:10,onChange:i})]}),l.jsxs(De,{title:"Background",children:[l.jsx("div",{className:"flex gap-3 mb-2.5",children:["solid","gradient","image","preset"].map(y=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"pano-bg-type",value:y,checked:E===y,onChange:()=>c({type:y}),className:"accent-accent"}),y.charAt(0).toUpperCase()+y.slice(1)]},y))}),E==="preset"&&l.jsx(Ge,{label:"Style Preset",value:a.preset??"",onChange:y=>c({preset:y}),options:[{value:"",label:"Select a preset..."},{value:"minimal",label:"Minimal"},{value:"bold",label:"Bold"},{value:"glow",label:"Glow"},{value:"playful",label:"Playful"},{value:"clean",label:"Clean"},{value:"branded",label:"Branded"},{value:"editorial",label:"Editorial"}]}),E==="solid"&&l.jsx(qe,{label:"Color",value:b,onChange:y=>c({color:y}),onInstant:P,presets:cf}),E==="gradient"&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:iu.map(y=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${y.direction}deg, ${y.colors.join(", ")})`},title:y.name,"aria-label":`Apply ${y.name} gradient`,onClick:()=>c({gradient:{type:"linear",colors:[...y.colors],direction:y.direction,radialPosition:"center"}})},y.name))}),l.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(y=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:_.type===y,onChange:()=>c({gradient:{..._,type:y}}),className:"accent-accent"}),y.charAt(0).toUpperCase()+y.slice(1)]},y))}),_.type==="linear"&&l.jsx(K,{label:"Direction",value:_.direction,min:0,max:360,formatValue:y=>`${y}°`,onChange:y=>c({gradient:{..._,direction:y}}),onInstant:y=>g({direction:y})}),_.type==="radial"&&l.jsx(Ge,{label:"Center",value:_.radialPosition??"center",onChange:y=>c({gradient:{..._,radialPosition:y}}),options:[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}]}),_.colors.map((y,R)=>l.jsx(qe,{label:`Stop ${R+1}`,value:y,onChange:ee=>{const ne=[..._.colors];ne[R]=ee,c({gradient:{..._,colors:ne}})}},R)),_.colors.length<5&&l.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{const y=[..._.colors,"#ffffff"];c({gradient:{..._,colors:y}})},children:"+ Add Color Stop"})]}),E==="image"&&l.jsxs(l.Fragment,{children:[l.jsx(Jp,{imageDataUrl:a.image,onUpload:y=>c({image:y}),onRemove:()=>c({image:void 0})}),l.jsxs("div",{className:"mt-2",children:[l.jsx(vt,{label:"Dim Overlay",checked:!!a.overlay,onChange:y=>c({overlay:y?{color:"#000000",opacity:.3}:void 0})}),a.overlay&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Color",value:a.overlay.color,onChange:y=>c({overlay:{...a.overlay,color:y}})}),l.jsx(K,{label:"Opacity",value:Math.round(a.overlay.opacity*100),min:0,max:100,formatValue:y=>`${y}%`,onChange:y=>c({overlay:{...a.overlay,opacity:y/100}})})]})]})]})]})]})}function nh(){const r=V($=>$.panoramicElements),i=V($=>$.selectedElementIndex),a=V($=>$.setSelectedElement),c=V($=>$.addPanoramicElement),p=V($=>$.config),h=r.map(($,k)=>({el:$,i:k})).filter(({el:$})=>$.type==="device"||$.type==="decoration"),m=()=>{var P,g;const $=r.filter(E=>E.type==="device").length,k=((P=p==null?void 0:p.screens[$])==null?void 0:P.screenshot)??((g=p==null?void 0:p.screens[0])==null?void 0:g.screenshot)??"screenshots/screen-1.png";c({type:"device",screenshot:k,x:10+$*20,y:15,width:12,rotation:0,z:5})},x=()=>{c({type:"decoration",shape:"circle",x:50,y:50,width:5,height:8,color:(p==null?void 0:p.theme.colors.primary)??"#6366F1",opacity:.15,rotation:0,z:0})},f=i!==null&&r[i]&&(r[i].type==="device"||r[i].type==="decoration");return l.jsxs("div",{children:[l.jsx(De,{title:"Screenshots",children:l.jsx(qp,{})}),l.jsxs(De,{title:`Devices & Decorations (${h.length})`,defaultCollapsed:!1,children:[l.jsxs("div",{className:"grid grid-cols-2 gap-1 mb-3",children:[l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:m,children:"+ Device"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:x,children:"+ Decoration"})]}),h.length===0&&l.jsx("p",{className:"text-xs text-text-dim text-center py-4",children:"Add devices to place screenshots on the panoramic canvas."}),l.jsx("div",{className:"space-y-1",children:h.map(({el:$,i:k})=>{const P=r.slice(0,k).filter(g=>g.type===$.type).length+1;return l.jsxs("button",{className:`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${k===i?"bg-accent/15 text-accent border border-accent/30":"bg-surface-2 border border-border hover:border-accent/30"}`,onClick:()=>a(k===i?null:k),children:[l.jsxs("span",{className:"font-medium",children:[si[$.type]," #",P]}),l.jsxs("span",{className:"text-text-dim ml-1",children:["(",Math.round($.x),"%, ",Math.round($.y),"%)"]})]},k)})})]}),f&&l.jsx(_f,{index:i})]})}function oh(){const r=V(f=>f.panoramicElements),i=V(f=>f.selectedElementIndex),a=V(f=>f.setSelectedElement),c=V(f=>f.addPanoramicElement),p=r.map((f,$)=>({el:f,i:$})).filter(({el:f})=>f.type==="text"||f.type==="label"),h=()=>{const f=r.filter($=>$.type==="text").length;c({type:"text",content:"New headline",x:5+f*20,y:5,fontSize:3.5,color:"#FFFFFF",fontWeight:700,fontStyle:"normal",textAlign:"left",lineHeight:1.15,maxWidth:25,z:10})},m=()=>{c({type:"label",content:"New Label",x:50,y:50,fontSize:1.5,color:"#FFFFFF",backgroundColor:"#00000044",padding:.5,borderRadius:8,z:15})},x=i!==null&&r[i]&&(r[i].type==="text"||r[i].type==="label");return l.jsxs("div",{children:[l.jsxs(De,{title:`Text & Labels (${p.length})`,defaultCollapsed:!1,children:[l.jsxs("div",{className:"grid grid-cols-2 gap-1 mb-3",children:[l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:h,children:"+ Text"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:m,children:"+ Label"})]}),p.length===0&&l.jsx("p",{className:"text-xs text-text-dim text-center py-4",children:"Add text elements for headlines, subtitles, and labels."}),l.jsx("div",{className:"space-y-1",children:p.map(({el:f,i:$})=>{const k=r.slice(0,$).filter(P=>P.type===f.type).length+1;return l.jsxs("button",{className:`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${$===i?"bg-accent/15 text-accent border border-accent/30":"bg-surface-2 border border-border hover:border-accent/30"}`,onClick:()=>a($===i?null:$),children:[l.jsxs("span",{className:"font-medium",children:[si[f.type]," #",k]}),l.jsxs("span",{className:"text-text-dim ml-1",children:["(",Math.round(f.x),"%, ",Math.round(f.y),"%)"]}),(f.type==="text"||f.type==="label")&&l.jsxs("span",{className:"text-text-dim ml-1 truncate",title:f.content,children:["— ",f.content.slice(0,20)]})]},$)})})]}),x&&l.jsx(_f,{index:i})]})}function Ud(r){return`${r}-${crypto.randomUUID().slice(0,8)}`}function rh(){const r=V(k=>k.panoramicEffects),i=V(k=>k.updatePanoramicEffects),{confirm:a,dialog:c}=ci(),p=(k,P)=>{const g=r.annotations.map((E,b)=>b===k?{...E,...P}:E);i({annotations:g})},h=async k=>{await a({title:"Remove Annotation",message:`Remove Annotation ${k+1}? This cannot be undone.`})&&i({annotations:r.annotations.filter((g,E)=>E!==k)})},m=()=>{i({annotations:[...r.annotations,{id:Ud("ann"),shape:"rounded-rect",x:40,y:40,w:20,h:20,strokeColor:"#FF3B30",strokeWidth:4}]})},x=(k,P)=>{const g=r.overlays.map((E,b)=>b===k?{...E,...P}:E);i({overlays:g})},f=async k=>{await a({title:"Remove Overlay",message:`Remove Overlay ${k+1}? This cannot be undone.`})&&i({overlays:r.overlays.filter((g,E)=>E!==k)})},$=()=>{i({overlays:[...r.overlays,{id:Ud("overlay"),type:"shape",x:10,y:10,size:10,rotation:0,opacity:1,shapeType:"circle",shapeColor:"#6366f1",shapeOpacity:.5,shapeBlur:10}]})};return l.jsxs(l.Fragment,{children:[c,l.jsxs(De,{title:"Spotlight / Dimming",tooltip:"Dim the panoramic canvas and highlight a specific area to draw attention.",defaultCollapsed:!1,children:[!r.spotlight&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Dim the canvas background and highlight a specific region to guide the viewer's eye."}),l.jsx(vt,{label:"Enable Spotlight",checked:!!r.spotlight,onChange:k=>i({spotlight:k?{x:50,y:50,w:30,h:30,shape:"rectangle",dimOpacity:.6,blur:0}:null})}),r.spotlight&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:r.spotlight.shape,onChange:k=>i({spotlight:{...r.spotlight,shape:k}}),options:[{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(K,{label:"Position X",value:r.spotlight.x,min:0,max:100,formatValue:k=>`${k}%`,onChange:k=>i({spotlight:{...r.spotlight,x:k}})}),l.jsx(K,{label:"Position Y",value:r.spotlight.y,min:0,max:100,formatValue:k=>`${k}%`,onChange:k=>i({spotlight:{...r.spotlight,y:k}})}),l.jsx(K,{label:"Width",value:r.spotlight.w,min:5,max:100,formatValue:k=>`${k}%`,onChange:k=>i({spotlight:{...r.spotlight,w:k}})}),l.jsx(K,{label:"Height",value:r.spotlight.h,min:5,max:100,formatValue:k=>`${k}%`,onChange:k=>i({spotlight:{...r.spotlight,h:k}})}),l.jsx(K,{label:"Dim Opacity",value:Math.round(r.spotlight.dimOpacity*100),min:0,max:100,formatValue:k=>`${k}%`,onChange:k=>i({spotlight:{...r.spotlight,dimOpacity:k/100}})}),l.jsx(K,{label:"Background Blur",value:r.spotlight.blur,min:0,max:30,formatValue:k=>`${k}px`,onChange:k=>i({spotlight:{...r.spotlight,blur:k}})})]})]}),l.jsxs(De,{title:"Annotations",tooltip:"Draw shapes over the panoramic canvas to highlight specific areas.",children:[r.annotations.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Highlight areas of your panoramic canvas with rectangles or circles."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:m,children:"+ Add Annotation"}),r.annotations.map((k,P)=>l.jsxs(Ol,{title:`Annotation ${P+1}`,onRemove:()=>h(P),children:[l.jsx(Ge,{label:"Shape",value:k.shape,onChange:g=>p(P,{shape:g}),options:[{value:"rounded-rect",label:"Rounded Rect"},{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(qe,{label:"Color",value:k.strokeColor,onChange:g=>p(P,{strokeColor:g})}),l.jsx(K,{label:"X",value:k.x,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>p(P,{x:g})}),l.jsx(K,{label:"Y",value:k.y,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>p(P,{y:g})}),l.jsx(K,{label:"Width",value:k.w,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>p(P,{w:g})}),l.jsx(K,{label:"Height",value:k.h,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>p(P,{h:g})}),l.jsx(K,{label:"Stroke",value:k.strokeWidth,min:1,max:20,formatValue:g=>`${g}px`,onChange:g=>p(P,{strokeWidth:g})})]},k.id))]}),l.jsxs(De,{title:"Overlays",tooltip:"Add decorative shapes floating over the panoramic canvas.",children:[r.overlays.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Add floating shapes, star ratings, or badges over your panoramic canvas for extra visual appeal."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:$,children:"+ Add Overlay"}),r.overlays.map((k,P)=>l.jsxs(Ol,{title:`Overlay ${P+1}`,onRemove:()=>f(P),children:[l.jsx(Ge,{label:"Type",value:k.type,onChange:g=>x(P,{type:g}),options:[{value:"shape",label:"Shape"},{value:"star-rating",label:"Star Rating"},{value:"icon",label:"Icon"},{value:"badge",label:"Badge"},{value:"custom",label:"Custom"}]}),l.jsx(K,{label:"X",value:k.x,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>x(P,{x:g})}),l.jsx(K,{label:"Y",value:k.y,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>x(P,{y:g})}),l.jsx(K,{label:"Size",value:k.size,min:1,max:50,formatValue:g=>`${g}%`,onChange:g=>x(P,{size:g})}),l.jsx(K,{label:"Rotation",value:k.rotation,min:-180,max:180,formatValue:g=>`${g}°`,onChange:g=>x(P,{rotation:g})}),l.jsx(K,{label:"Opacity",value:Math.round(k.opacity*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>x(P,{opacity:g/100})}),k.type==="shape"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:k.shapeType??"circle",onChange:g=>x(P,{shapeType:g}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"}]}),l.jsx(qe,{label:"Color",value:k.shapeColor??"#6366f1",onChange:g=>x(P,{shapeColor:g})}),l.jsx(K,{label:"Shape Opacity",value:Math.round((k.shapeOpacity??.5)*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>x(P,{shapeOpacity:g/100})}),l.jsx(K,{label:"Blur",value:k.shapeBlur??0,min:0,max:50,formatValue:g=>`${g}px`,onChange:g=>x(P,{shapeBlur:g})})]})]},k.id))]}),l.jsx("div",{className:"px-5 py-3 text-[10px] text-text-dim",children:"Loupe and Callouts are available in individual mode as they operate on specific screenshot regions."})]})}function lh(r){return{top:r.offsetTop,left:r.offsetLeft,width:r.offsetWidth,height:r.offsetHeight}}function Va(r){let i=r.offsetLeft,a=r.offsetTop,c=r.offsetParent;for(;c;)i+=c.offsetLeft-c.scrollLeft,a+=c.offsetTop-c.scrollTop,c=c.offsetParent;return{left:i,top:a,width:r.offsetWidth,height:r.offsetHeight}}function sh(r,i,a,c,p,h,m,x){const f=C.useRef(null),$=C.useCallback((E,b)=>{var _,y,R,ee;try{const ne=(_=r.current)==null?void 0:_.contentDocument;if(!ne)return null;const se=ne.elementsFromPoint(E,b);let re=null,ie=null,ue=null;for(const v of se){let G=v;for(;G&&G!==ne.documentElement;)!re&&((y=G.classList)!=null&&y.contains("headline"))&&(re=G),!ie&&((R=G.classList)!=null&&R.contains("subtitle"))&&(ie=G),!ue&&((ee=G.classList)!=null&&ee.contains("device-wrapper"))&&(ue=G),G=G.parentElement}if(re&&ie){const v=Va(re),G=Va(ie),fe=v.top+v.height/2,Z=G.top+G.height/2;return Math.abs(b-fe)<=Math.abs(b-Z)?{cls:"headline",el:re,kind:"text"}:{cls:"subtitle",el:ie,kind:"text"}}if(re)return{cls:"headline",el:re,kind:"text"};if(ie)return{cls:"subtitle",el:ie,kind:"text"};if(ue)return{cls:"device-wrapper",el:ue,kind:"device"}}catch{}return null},[r]),k=C.useCallback((E,b)=>{const _=i.current;if(!_)return{x:0,y:0};const y=_.getBoundingClientRect();return{x:(E-y.left)/c,y:(b-y.top)/c}},[i,c]),P=C.useCallback(E=>{if(!a)return;const b=k(E.clientX,E.clientY),_=$(b.x,b.y);if(_){if(E.preventDefault(),_.kind==="device"){f.current={kind:"device",el:_.el,startX:E.clientX,startY:E.clientY,startDeviceTop:a.deviceTop,startDeviceOffsetX:a.deviceOffsetX,offsetX:0,offsetY:0,origWidth:0,scale:c},_.el.style.outline="2px solid rgba(99,102,241,0.5)";const y=ee=>{const ne=f.current;if(!ne||ne.kind!=="device")return;const se=(ee.clientX-ne.startX)/ne.scale,re=(ee.clientY-ne.startY)/ne.scale,ie=Math.max(-80,Math.min(80,ne.startDeviceOffsetX+Math.round(se/p*100))),ue=Math.max(-80,Math.min(80,ne.startDeviceTop+Math.round(re/h*100)));ne.el.style.top=ue+"%",ne.el.style.left=ie?`calc(50% + ${ie/100*p}px)`:"50%"},R=ee=>{const ne=f.current;if(!ne||ne.kind!=="device")return;ne.el.style.outline="none";const se=(ee.clientX-ne.startX)/ne.scale,re=(ee.clientY-ne.startY)/ne.scale,ie=Math.max(-80,Math.min(80,ne.startDeviceOffsetX+Math.round(se/p*100))),ue=Math.max(-80,Math.min(80,ne.startDeviceTop+Math.round(re/h*100)));f.current=null,document.removeEventListener("mousemove",y),document.removeEventListener("mouseup",R),m({deviceTop:ue,deviceOffsetX:ie})};document.addEventListener("mousemove",y),document.addEventListener("mouseup",R)}else if(_.kind==="text"){const y=_.el,R=_.cls,ee=Va(y),ne=!!(R==="headline"?a.textPositions.headline:a.textPositions.subtitle),se=ne?ee.left:ee.left+ee.width/2,re=ee.width;if(!ne){const v=R==="headline"?a.headlineRotation:a.subtitleRotation,G=["translateX(-50%)"];v&&G.push(`rotate(${v}deg)`),y.style.position="fixed",y.style.top=ee.top+"px",y.style.left=se+"px",y.style.transform=G.join(" "),y.style.zIndex="10",y.style.margin="0",y.style.width=ee.width+"px"}f.current={kind:"text",cls:R,el:y,startX:E.clientX,startY:E.clientY,startDeviceTop:0,startDeviceOffsetX:0,offsetX:b.x-se,offsetY:b.y-ee.top,origWidth:re,scale:c},y.style.outline="2px dashed rgba(99,102,241,0.5)";const ie=v=>{const G=f.current;if(!G||G.kind!=="text")return;const fe=k(v.clientX,v.clientY);G.el.style.top=fe.y-G.offsetY+"px",G.el.style.left=fe.x-G.offsetX+"px"},ue=()=>{const v=f.current;if(!v||v.kind!=="text")return;v.el.style.outline="none";const G=lh(v.el),fe=Math.round(G.top/h*100*10)/10,Z=Math.round(G.left/p*100*10)/10,de=Math.round(v.origWidth/p*100*10)/10;f.current=null,document.removeEventListener("mousemove",ie),document.removeEventListener("mouseup",ue),x(v.cls,{x:Z,y:fe,width:de})};document.addEventListener("mousemove",ie),document.addEventListener("mouseup",ue)}}},[a,c,k,$,m,x]),g=C.useCallback((E,b)=>{const _=k(E,b),y=$(_.x,_.y);return y?y.kind==="device"?"move":"grab":"default"},[k,$]);return{onOverlayMouseDown:P,getCursorForPosition:g}}function ih(){const r=V(re=>re.screens),i=V(re=>re.selectedScreen),a=V(re=>re.setSelectedScreen),c=V(re=>re.addScreen),p=V(re=>re.removeScreen),h=V(re=>re.moveScreen),m=V(re=>re.previewW),x=V(re=>re.previewH),f=V(re=>re.previewBg),$=V(re=>re.renderVersion),k=V(re=>re.platform),P=V(re=>re.locale),g=V(re=>re.deviceFamilies),E=C.useRef(null),[b,_]=C.useState(.5),y=C.useCallback(()=>{const re=E.current;if(!re)return;const ie=48,ue=16,v=56,G=re.clientWidth-ie,fe=re.clientHeight-v-ie,Z=r.length+.5,de=r.length*ue,Me=(G-de)/(Z*m),Oe=fe/x;let ze=Math.min(Me,Oe);ze=Math.min(ze,1.3),ze=Math.max(ze,.1),_(ze)},[x,m,r.length]);C.useEffect(()=>(y(),window.addEventListener("resize",y),()=>window.removeEventListener("resize",y)),[y]);const R=f==="light"?"bg-gray-100":"bg-bg",[ee,ne]=C.useState(null),se=ee??b;return l.jsxs("div",{ref:E,className:`flex-1 flex flex-col overflow-hidden ${R}`,children:[l.jsx("div",{className:"flex-1 overflow-auto",children:l.jsxs("div",{className:"flex items-center justify-center gap-4 p-6 min-w-min min-h-full",children:[r.map((re,ie)=>l.jsx(ah,{index:ie,selected:ie===i,previewW:m,previewH:x,scale:se,headline:re.headline,canRemove:r.length>1,canMoveLeft:ie>0,canMoveRight:ie<r.length-1,onSelect:()=>a(ie),onRemove:()=>p(ie),onMoveLeft:()=>h(ie,ie-1),onMoveRight:()=>h(ie,ie+1),renderVersion:$,platform:k,locale:P,deviceFamilies:g},`screen-${re.screenIndex}-${ie}`)),l.jsx("button",{className:"shrink-0 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-text-dim text-xs hover:border-accent hover:text-accent transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",style:{width:Math.round(m*se*.5),height:Math.round(x*se)},onClick:c,"aria-label":"Add a new screen",children:"+ Add Screen"})]})}),l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 border-t border-border bg-surface",children:[l.jsx("span",{className:"text-[10px] text-text-dim",children:"Zoom"}),l.jsx("input",{type:"range",min:10,max:150,value:Math.round((ee??b)*100),onChange:re=>ne(parseInt(re.target.value,10)/100),className:"flex-1 h-1 accent-accent","aria-label":"Zoom level","aria-valuemin":10,"aria-valuemax":150,"aria-valuenow":Math.round((ee??b)*100),"aria-valuetext":`${Math.round((ee??b)*100)}%`}),l.jsxs("span",{className:"text-[10px] text-text-dim w-8 text-right",children:[Math.round((ee??b)*100),"%"]}),l.jsx("button",{className:`text-[10px] transition-opacity ${ee!==null?"text-text-dim hover:text-text":"text-text-dim/50 cursor-default"}`,onClick:()=>ne(null),disabled:ee===null,"aria-label":"Reset zoom to fit",children:"Fit"})]})]})}function ah({index:r,selected:i,previewW:a,previewH:c,scale:p,canRemove:h,canMoveLeft:m,canMoveRight:x,onSelect:f,onRemove:$,onMoveLeft:k,onMoveRight:P,renderVersion:g,platform:E,locale:b,deviceFamilies:_}){const y=C.useRef(null),R=C.useRef(null),{confirm:ee,dialog:ne}=ci(),[se,re]=C.useState(!0),ie=C.useRef(null),ue=C.useRef(null),v=V(W=>W.screens[r]),G=V(W=>W.updateScreen);C.useEffect(()=>(Od(r,y.current),()=>Od(r,null)),[r]);const fe=C.useCallback(W=>{G(r,W)},[r,G]),Z=C.useCallback((W,M)=>{const Y={...(v==null?void 0:v.textPositions)??{headline:null,subtitle:null}};Y[W]=M,G(r,{textPositions:Y})},[r,v==null?void 0:v.textPositions,G]),{onOverlayMouseDown:de,getCursorForPosition:Me}=sh(y,R,v,p,a,c,fe,Z),[Oe,ze]=C.useState("default"),O=C.useCallback(W=>{ze(Me(W.clientX,W.clientY))},[Me]);return C.useEffect(()=>{if(v)return ue.current&&clearTimeout(ue.current),ue.current=setTimeout(()=>{var Y;(Y=ie.current)==null||Y.abort();const W=new AbortController;ie.current=W;const M=Up(v,E,a,c,b);fp(M,W.signal).then(U=>{const L=y.current;if(!L)return;const D=L.contentDocument;D?(D.open(),D.write(U),D.close()):L.srcdoc=U,re(!1)}).catch(U=>{U instanceof DOMException&&U.name==="AbortError"||re(!1)})},se?0:150),()=>{var W;ue.current&&clearTimeout(ue.current),(W=ie.current)==null||W.abort()}},[v,g,E,a,c,b]),l.jsxs(l.Fragment,{children:[ne,l.jsxs("div",{className:`shrink-0 cursor-pointer rounded-lg overflow-hidden transition-shadow ${i?"ring-2 ring-accent shadow-lg":"hover:ring-1 hover:ring-border"}`,onClick:f,children:[l.jsxs("div",{className:"flex items-center justify-between px-2 py-1 bg-surface text-[10px]",children:[m?l.jsx("button",{className:"text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:W=>{W.stopPropagation(),k()},title:"Move left","aria-label":`Move screen ${r+1} left`,children:"‹"}):l.jsx("span",{className:"w-4"}),l.jsxs("span",{className:"text-text-dim font-medium",children:["Screen ",r+1]}),l.jsxs("div",{className:"flex items-center gap-0.5",children:[x&&l.jsx("button",{className:"text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:W=>{W.stopPropagation(),P()},title:"Move right","aria-label":`Move screen ${r+1} right`,children:"›"}),h&&l.jsx("button",{className:"text-text-dim hover:text-red-400 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:async W=>{W.stopPropagation(),await ee({title:"Remove Screen",message:`Remove Screen ${r+1}? This cannot be undone.`})&&$()},title:"Remove screen","aria-label":`Remove screen ${r+1}`,children:"×"})]})]}),l.jsxs("div",{ref:R,className:"relative overflow-hidden",style:{width:a*p,height:c*p},children:[se&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-bg z-20",children:l.jsx("div",{className:"w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),l.jsx("iframe",{ref:y,className:"border-none block origin-top-left",style:{width:a,height:c,transform:`scale(${p})`},title:`Screen ${r+1}`}),l.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:Oe},onMouseDown:de,onMouseMove:O})]})]})]})}function uh(){const r=C.useRef(null),i=C.useRef(null),a=C.useRef(null),c=C.useRef(null),p=C.useRef(null),h=V(W=>W.config),m=V(W=>W.previewW),x=V(W=>W.previewH),f=V(W=>W.previewBg),$=V(W=>W.renderVersion),k=V(W=>W.panoramicFrameCount),P=V(W=>W.panoramicBackground),g=V(W=>W.panoramicElements),E=V(W=>W.panoramicEffects),b=V(W=>W.selectedElementIndex),_=V(W=>W.setSelectedElement),y=V(W=>W.updatePanoramicElement),[R,ee]=C.useState(.3),[ne,se]=C.useState(!0),[re,ie]=C.useState(!1),ue=C.useRef(null);C.useEffect(()=>(Hd(r.current),()=>Hd(null)),[]);const v=m*k,G=C.useCallback(()=>{const W=i.current;if(!W)return;const M=W.clientWidth-48,Y=W.clientHeight-120,U=M/v,L=Y/x;let D=Math.min(U,L);D=Math.min(D,1),D=Math.max(D,.05),ee(D)},[v,x]);C.useEffect(()=>(G(),window.addEventListener("resize",G),()=>window.removeEventListener("resize",G)),[G]),C.useEffect(()=>{if(h)return p.current&&clearTimeout(p.current),p.current=setTimeout(()=>{var Y;(Y=c.current)==null||Y.abort();const W=new AbortController;c.current=W;const M={frameCount:k,frameWidth:m,frameHeight:x,background:P,elements:g,font:h.theme.font,fontWeight:h.theme.fontWeight,frameStyle:h.frames.style,effects:E};gp(M,W.signal).then(U=>{const L=r.current;if(!L)return;const D=L.contentDocument;D&&(D.open(),D.write(U),D.close()),se(!1)}).catch(U=>{U instanceof DOMException&&U.name==="AbortError"||(console.error("[PanoramicPreview] fetch failed:",U),se(!1))})},ne?0:200),()=>{var W;p.current&&clearTimeout(p.current),(W=c.current)==null||W.abort()}},[h,k,m,x,P,g,E,$]);const fe=C.useCallback((W,M)=>{const Y=a.current;if(!Y)return null;const U=Y.getBoundingClientRect(),L=(W-U.left)/(v*R)*100,D=(M-U.top)/(x*R)*100;return{x:L,y:D}},[v,x,R]),Z=C.useCallback((W,M)=>{const Y=fe(W,M);if(!Y)return null;let U=null,L=-1;for(let D=0;D<g.length;D++){const ae=g[D];let we,H;ae.type==="device"?(we=ae.width,H=ae.width/100*v*2.1/x*100):ae.type==="text"?(we=ae.maxWidth||15,H=ae.fontSize/100*x*2/x*100):ae.type==="decoration"?(we=ae.width,H=ae.height?ae.height/100*x/x*100:we*v/x):(we=10,H=5),Y.x>=ae.x&&Y.x<=ae.x+we&&Y.y>=ae.y&&Y.y<=ae.y+H&&ae.z>L&&(L=ae.z,U=D)}return U},[g,fe,v,x]),de=C.useCallback(W=>{if(!fe(W.clientX,W.clientY))return;const Y=Z(W.clientX,W.clientY);if(Y!==null){_(Y);const U=g[Y];ue.current={elementIndex:Y,startX:W.clientX,startY:W.clientY,origX:U.x,origY:U.y},ie(!0),W.preventDefault()}},[fe,Z,g,_]);C.useEffect(()=>{const W=Y=>{const U=ue.current;if(!U)return;const L=(Y.clientX-U.startX)/R,D=(Y.clientY-U.startY)/R,ae=r.current,we=ae==null?void 0:ae.contentDocument;if(we){const ve=[...g].map((Te,Ue)=>({z:Te.z,i:Ue})).sort((Te,Ue)=>Te.z-Ue.z).findIndex(Te=>Te.i===U.elementIndex),Ie=we.querySelector(`[data-index="${ve}"]`);if(Ie){const Te=g[U.elementIndex],Ue="rotation"in Te&&Te.rotation?Te.rotation:0;Ie.style.filter="none",Ie.style.transform=`translate(${L}px, ${D}px) rotate(${Ue}deg)`}}},M=Y=>{const U=ue.current;if(!U)return;const L=(Y.clientX-U.startX)/(v*R)*100,D=(Y.clientY-U.startY)/(x*R)*100,ae=Math.round((U.origX+L)*2)/2,we=Math.round((U.origY+D)*2)/2;y(U.elementIndex,{x:ae,y:we}),ue.current=null,ie(!1)};return window.addEventListener("mousemove",W),window.addEventListener("mouseup",M),()=>{window.removeEventListener("mousemove",W),window.removeEventListener("mouseup",M)}},[v,x,R,g,y]),C.useEffect(()=>{const W=M=>{var we;if(b===null)return;const Y=(we=M.target)==null?void 0:we.tagName;if(Y==="INPUT"||Y==="TEXTAREA"||Y==="SELECT")return;const U=M.shiftKey?5:.5;let L=0,D=0;if(M.key==="ArrowLeft")L=-U;else if(M.key==="ArrowRight")L=U;else if(M.key==="ArrowUp")D=-U;else if(M.key==="ArrowDown")D=U;else return;M.preventDefault();const ae=g[b];ae&&y(b,{x:Math.round((ae.x+L)*2)/2,y:Math.round((ae.y+D)*2)/2})};return window.addEventListener("keydown",W),()=>window.removeEventListener("keydown",W)},[b,g,y]);const[Me,Oe]=C.useState("default"),ze=C.useCallback(W=>{if(re)return;const M=Z(W.clientX,W.clientY);Oe(M!==null?"grab":"default")},[re,Z]),O=f==="light"?"bg-gray-100":"bg-bg";return l.jsxs("div",{ref:i,className:`flex-1 flex flex-col overflow-hidden ${O}`,children:[l.jsx("div",{className:"flex-1 overflow-auto",children:l.jsx("div",{className:"flex items-center justify-center p-6 min-h-full min-w-min",children:l.jsxs("div",{className:"relative w-fit",children:[ne&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center z-20",children:l.jsx("div",{className:"w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),l.jsx("div",{className:"flex mb-1",style:{width:v*R},children:Array.from({length:k},(W,M)=>l.jsxs("div",{className:"text-[9px] text-text-dim text-center border-x border-border/30",style:{width:m*R},children:["Frame ",M+1]},M))}),l.jsxs("div",{ref:a,className:"relative overflow-hidden rounded border border-border/30",style:{width:v*R,height:x*R},children:[l.jsx("iframe",{ref:r,className:"border-none block origin-top-left",style:{width:v,height:x,transform:`scale(${R})`},title:"Panoramic Preview"}),l.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:re?"grabbing":Me},onMouseDown:de,onMouseMove:ze})]})]})})}),l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 border-t border-border bg-surface",children:[l.jsx("span",{className:"text-[10px] text-text-dim",children:"Zoom"}),l.jsx("input",{type:"range",min:5,max:100,value:Math.round(R*100),onChange:W=>ee(parseInt(W.target.value,10)/100),className:"flex-1 h-1 accent-accent","aria-label":"Zoom level","aria-valuemin":5,"aria-valuemax":100,"aria-valuenow":Math.round(R*100),"aria-valuetext":`${Math.round(R*100)}%`}),l.jsxs("span",{className:"text-[10px] text-text-dim w-8 text-right",children:[Math.round(R*100),"%"]}),l.jsx("button",{className:"text-[10px] text-text-dim hover:text-text transition-opacity",onClick:G,"aria-label":"Reset zoom to fit",children:"Fit"}),b!==null&&l.jsx("span",{className:"ml-auto text-[9px] text-text-dim border-l border-border pl-2",title:"Use arrow keys to nudge selected element. Hold Shift for larger steps.",children:"Arrow keys to nudge"})]})]})}var Vd=sf(),ch=`svg[fill=none] {
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
}`,dh={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let r=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");r||(r=document.createElement("style"),r.id="feedback-tool-styles-annotation-popup-css-styles",r.textContent=ch,document.head.appendChild(r))}var et=dh,fh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",children:l.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),mh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",children:l.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),ph=({size:r=24,style:i={}})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",style:i,children:[l.jsxs("g",{clipPath:"url(#clip0_list_sparkle)",children:[l.jsx("path",{d:"M11.5 12L5.5 12",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M18.5 6.75L5.5 6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M9.25 17.25L5.5 17.25",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})]}),l.jsx("defs",{children:l.jsx("clipPath",{id:"clip0_list_sparkle",children:l.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),Ar=({size:r=20})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:[l.jsx("circle",{cx:"10",cy:"10.5",r:"5.25",stroke:"currentColor",strokeWidth:"1.25"}),l.jsx("path",{d:"M8.5 8.75C8.5 7.92 9.17 7.25 10 7.25C10.83 7.25 11.5 7.92 11.5 8.75C11.5 9.58 10.83 10.25 10 10.25V11",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("circle",{cx:"10",cy:"13",r:"0.75",fill:"currentColor"})]}),Xd=({size:r=14})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 14 14",fill:"none",children:[l.jsx("style",{children:`
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
    `}),l.jsx("path",{className:"check-path-animated",d:"M3.9375 7L6.125 9.1875L10.5 4.8125",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),hh=({size:r=24,copied:i=!1})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .copy-icon, .check-icon {
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
    `}),l.jsxs("g",{className:"copy-icon",style:{opacity:i?0:1,transform:i?"scale(0.8)":"scale(1)",transformOrigin:"center"},children:[l.jsx("path",{d:"M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",stroke:"currentColor",strokeWidth:"1.5"}),l.jsx("path",{d:"M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),l.jsxs("g",{className:"check-icon",style:{opacity:i?1:0,transform:i?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})]}),_h=({size:r=24,state:i="idle"})=>{const a=i==="idle",c=i==="sent",p=i==="failed",h=i==="sending";return l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
        .send-arrow-icon, .send-check-icon, .send-error-icon {
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
      `}),l.jsx("g",{className:"send-arrow-icon",style:{opacity:a?1:h?.5:0,transform:a?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:l.jsx("path",{d:"M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),l.jsxs("g",{className:"send-check-icon",style:{opacity:c?1:0,transform:c?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsxs("g",{className:"send-error-icon",style:{opacity:p?1:0,transform:p?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M12 8V12",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round"}),l.jsx("circle",{cx:"12",cy:"15",r:"0.5",fill:"#ef4444",stroke:"#ef4444",strokeWidth:"1"})]})]})},gh=({size:r=24,isOpen:i=!0})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .eye-open, .eye-closed {
        transition: opacity 0.2s ease;
      }
    `}),l.jsxs("g",{className:"eye-open",style:{opacity:i?1:0},children:[l.jsx("path",{d:"M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsxs("g",{className:"eye-closed",style:{opacity:i?0:1},children:[l.jsx("path",{d:"M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",fill:"currentColor"}),l.jsx("path",{d:"M5 19L19 5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})]}),yh=({size:r=24,isPaused:i=!1})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .pause-bar, .play-triangle {
        transition: opacity 0.15s ease;
      }
    `}),l.jsx("path",{className:"pause-bar",d:"M8 6L8 18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:i?0:1}}),l.jsx("path",{className:"pause-bar",d:"M16 18L16 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:i?0:1}}),l.jsx("path",{className:"play-triangle",d:"M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",stroke:"currentColor",strokeWidth:"1.5",style:{opacity:i?1:0}})]}),xh=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("path",{d:"M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("circle",{cx:"12",cy:"12",r:"2.5",stroke:"currentColor",strokeWidth:"1.5"})]}),vh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:l.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Xa=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsxs("g",{clipPath:"url(#clip0_2_53)",children:[l.jsx("path",{d:"M16.25 16.25L7.75 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M7.75 16.25L16.25 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsx("defs",{children:l.jsx("clipPath",{id:"clip0_2_53",children:l.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),bh=({size:r=24})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:l.jsx("path",{d:"M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z",fill:"currentColor"})}),wh=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:[l.jsx("path",{d:"M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M10 3.9585V5.05698",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M10 14.9429V16.0414",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M5.7269 5.72656L6.50682 6.50649",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M13.4932 13.4932L14.2731 14.2731",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M3.95834 10H5.05683",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M14.9432 10H16.0417",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M5.7269 14.2731L6.50682 13.4932",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M13.4932 6.50649L14.2731 5.72656",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"})]}),kh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:l.jsx("path",{d:"M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z",stroke:"currentColor",strokeWidth:"1.13793",strokeLinecap:"round",strokeLinejoin:"round"})}),Qd=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375",stroke:"currentColor",strokeWidth:"0.9",strokeLinecap:"round",strokeLinejoin:"round"})}),Ch=({size:r=24})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Sh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M8.5 3.5L4 8L8.5 12.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),gf=["data-feedback-toolbar","data-annotation-popup","data-annotation-marker"],Qa=gf.flatMap(r=>[`:not([${r}])`,`:not([${r}] *)`]).join(""),ou="feedback-freeze-styles",Ga="__agentation_freeze";function jh(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:i=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const r=window;return r[Ga]||(r[Ga]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),r[Ga]}var Ye=jh();typeof window<"u"&&!Ye.installed&&(Ye.origSetTimeout=window.setTimeout.bind(window),Ye.origSetInterval=window.setInterval.bind(window),Ye.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(r,i,...a)=>typeof r=="string"?Ye.origSetTimeout(r,i):Ye.origSetTimeout((...c)=>{Ye.frozen?Ye.frozenTimeoutQueue.push(()=>r(...c)):r(...c)},i,...a),window.setInterval=(r,i,...a)=>typeof r=="string"?Ye.origSetInterval(r,i):Ye.origSetInterval((...c)=>{Ye.frozen||r(...c)},i,...a),window.requestAnimationFrame=r=>Ye.origRAF(i=>{Ye.frozen?Ye.frozenRAFQueue.push(r):r(i)}),Ye.installed=!0);var Ve=Ye.origSetTimeout,Eh=Ye.origSetInterval;function Nh(r){return r?gf.some(i=>{var a;return!!((a=r.closest)!=null&&a.call(r,`[${i}]`))}):!1}function Ph(){if(typeof document>"u"||Ye.frozen)return;Ye.frozen=!0,Ye.frozenTimeoutQueue=[],Ye.frozenRAFQueue=[];let r=document.getElementById(ou);r||(r=document.createElement("style"),r.id=ou),r.textContent=`
    *${Qa},
    *${Qa}::before,
    *${Qa}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `,document.head.appendChild(r),Ye.pausedAnimations=[];try{document.getAnimations().forEach(i=>{var c;if(i.playState!=="running")return;const a=(c=i.effect)==null?void 0:c.target;Nh(a)||(i.pause(),Ye.pausedAnimations.push(i))})}catch{}document.querySelectorAll("video").forEach(i=>{i.paused||(i.dataset.wasPaused="false",i.pause())})}function Gd(){var a;if(typeof document>"u"||!Ye.frozen)return;Ye.frozen=!1;const r=Ye.frozenTimeoutQueue;Ye.frozenTimeoutQueue=[];for(const c of r)Ye.origSetTimeout(()=>{if(Ye.frozen){Ye.frozenTimeoutQueue.push(c);return}try{c()}catch(p){console.warn("[agentation] Error replaying queued timeout:",p)}},0);const i=Ye.frozenRAFQueue;Ye.frozenRAFQueue=[];for(const c of i)Ye.origRAF(p=>{if(Ye.frozen){Ye.frozenRAFQueue.push(c);return}c(p)});for(const c of Ye.pausedAnimations)try{c.play()}catch(p){console.warn("[agentation] Error resuming animation:",p)}Ye.pausedAnimations=[],(a=document.getElementById(ou))==null||a.remove(),document.querySelectorAll("video").forEach(c=>{c.dataset.wasPaused==="false"&&(c.play().catch(()=>{}),delete c.dataset.wasPaused)})}var Kd=C.forwardRef(function({element:i,timestamp:a,selectedText:c,placeholder:p="What should change?",initialValue:h="",submitLabel:m="Add",onSubmit:x,onCancel:f,onDelete:$,style:k,accentColor:P="#3c82f7",isExiting:g=!1,lightMode:E=!1,computedStyles:b},_){const[y,R]=C.useState(h),[ee,ne]=C.useState(!1),[se,re]=C.useState("initial"),[ie,ue]=C.useState(!1),[v,G]=C.useState(!1),fe=C.useRef(null),Z=C.useRef(null),de=C.useRef(null),Me=C.useRef(null);C.useEffect(()=>{g&&se!=="exit"&&re("exit")},[g,se]),C.useEffect(()=>{Ve(()=>{re("enter")},0);const Y=Ve(()=>{re("entered")},200),U=Ve(()=>{const L=fe.current;L&&(L.focus(),L.selectionStart=L.selectionEnd=L.value.length,L.scrollTop=L.scrollHeight)},50);return()=>{clearTimeout(Y),clearTimeout(U),de.current&&clearTimeout(de.current),Me.current&&clearTimeout(Me.current)}},[]);const Oe=C.useCallback(()=>{Me.current&&clearTimeout(Me.current),ne(!0),Me.current=Ve(()=>{var Y;ne(!1),(Y=fe.current)==null||Y.focus()},250)},[]);C.useImperativeHandle(_,()=>({shake:Oe}),[Oe]);const ze=C.useCallback(()=>{re("exit"),de.current=Ve(()=>{f()},150)},[f]),O=C.useCallback(()=>{y.trim()&&x(y.trim())},[y,x]),W=C.useCallback(Y=>{Y.stopPropagation(),!Y.nativeEvent.isComposing&&(Y.key==="Enter"&&!Y.shiftKey&&(Y.preventDefault(),O()),Y.key==="Escape"&&ze())},[O,ze]),M=[et.popup,E?et.light:"",se==="enter"?et.enter:"",se==="entered"?et.entered:"",se==="exit"?et.exit:"",ee?et.shake:""].filter(Boolean).join(" ");return l.jsxs("div",{ref:Z,className:M,"data-annotation-popup":!0,style:k,onClick:Y=>Y.stopPropagation(),children:[l.jsxs("div",{className:et.header,children:[b&&Object.keys(b).length>0?l.jsxs("button",{className:et.headerToggle,onClick:()=>{const Y=v;G(!v),Y&&Ve(()=>{var U;return(U=fe.current)==null?void 0:U.focus()},0)},type:"button",children:[l.jsx("svg",{className:`${et.chevron} ${v?et.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),l.jsx("span",{className:et.element,children:i})]}):l.jsx("span",{className:et.element,children:i}),a&&l.jsx("span",{className:et.timestamp,children:a})]}),b&&Object.keys(b).length>0&&l.jsx("div",{className:`${et.stylesWrapper} ${v?et.expanded:""}`,children:l.jsx("div",{className:et.stylesInner,children:l.jsx("div",{className:et.stylesBlock,children:Object.entries(b).map(([Y,U])=>l.jsxs("div",{className:et.styleLine,children:[l.jsx("span",{className:et.styleProperty,children:Y.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",l.jsx("span",{className:et.styleValue,children:U}),";"]},Y))})})}),c&&l.jsxs("div",{className:et.quote,children:["“",c.slice(0,80),c.length>80?"...":"","”"]}),l.jsx("textarea",{ref:fe,className:et.textarea,style:{borderColor:ie?P:void 0},placeholder:p,value:y,onChange:Y=>R(Y.target.value),onFocus:()=>ue(!0),onBlur:()=>ue(!1),rows:2,onKeyDown:W}),l.jsxs("div",{className:et.actions,children:[$&&l.jsx("div",{className:et.deleteWrapper,children:l.jsx("button",{className:et.deleteButton,onClick:$,type:"button",children:l.jsx(Ch,{size:22})})}),l.jsx("button",{className:et.cancel,onClick:ze,children:"Cancel"}),l.jsx("button",{className:et.submit,style:{backgroundColor:P,opacity:y.trim()?1:.4},onClick:O,disabled:!y.trim(),children:m})]})]})});function Hr(r){if(r.parentElement)return r.parentElement;const i=r.getRootNode();return i instanceof ShadowRoot?i.host:null}function Jt(r,i){let a=r;for(;a;){if(a.matches(i))return a;a=Hr(a)}return null}function Th(r,i=4){const a=[];let c=r,p=0;for(;c&&p<i;){const h=c.tagName.toLowerCase();if(h==="html"||h==="body")break;let m=h;if(c.id)m=`#${c.id}`;else if(c.className&&typeof c.className=="string"){const f=c.className.split(/\s+/).find($=>$.length>2&&!$.match(/^[a-z]{1,2}$/)&&!$.match(/[A-Z0-9]{5,}/));f&&(m=`.${f.split("_")[0]}`)}const x=Hr(c);!c.parentElement&&x&&(m=`⟨shadow⟩ ${m}`),a.unshift(m),c=x,p++}return a.join(" > ")}function ii(r){var c,p,h,m,x,f,$,k;const i=Th(r);if(r.dataset.element)return{name:r.dataset.element,path:i};const a=r.tagName.toLowerCase();if(["path","circle","rect","line","g"].includes(a)){const P=Jt(r,"svg");if(P){const g=Hr(P);if(g instanceof HTMLElement)return{name:`graphic in ${ii(g).name}`,path:i}}return{name:"graphic element",path:i}}if(a==="svg"){const P=Hr(r);if((P==null?void 0:P.tagName.toLowerCase())==="button"){const g=(c=P.textContent)==null?void 0:c.trim();return{name:g?`icon in "${g}" button`:"button icon",path:i}}return{name:"icon",path:i}}if(a==="button"){const P=(p=r.textContent)==null?void 0:p.trim(),g=r.getAttribute("aria-label");return g?{name:`button [${g}]`,path:i}:{name:P?`button "${P.slice(0,25)}"`:"button",path:i}}if(a==="a"){const P=(h=r.textContent)==null?void 0:h.trim(),g=r.getAttribute("href");return P?{name:`link "${P.slice(0,25)}"`,path:i}:g?{name:`link to ${g.slice(0,30)}`,path:i}:{name:"link",path:i}}if(a==="input"){const P=r.getAttribute("type")||"text",g=r.getAttribute("placeholder"),E=r.getAttribute("name");return g?{name:`input "${g}"`,path:i}:E?{name:`input [${E}]`,path:i}:{name:`${P} input`,path:i}}if(["h1","h2","h3","h4","h5","h6"].includes(a)){const P=(m=r.textContent)==null?void 0:m.trim();return{name:P?`${a} "${P.slice(0,35)}"`:a,path:i}}if(a==="p"){const P=(x=r.textContent)==null?void 0:x.trim();return P?{name:`paragraph: "${P.slice(0,40)}${P.length>40?"...":""}"`,path:i}:{name:"paragraph",path:i}}if(a==="span"||a==="label"){const P=(f=r.textContent)==null?void 0:f.trim();return P&&P.length<40?{name:`"${P}"`,path:i}:{name:a,path:i}}if(a==="li"){const P=($=r.textContent)==null?void 0:$.trim();return P&&P.length<40?{name:`list item: "${P.slice(0,35)}"`,path:i}:{name:"list item",path:i}}if(a==="blockquote")return{name:"blockquote",path:i};if(a==="code"){const P=(k=r.textContent)==null?void 0:k.trim();return P&&P.length<30?{name:`code: \`${P}\``,path:i}:{name:"code",path:i}}if(a==="pre")return{name:"code block",path:i};if(a==="img"){const P=r.getAttribute("alt");return{name:P?`image "${P.slice(0,30)}"`:"image",path:i}}if(a==="video")return{name:"video",path:i};if(["div","section","article","nav","header","footer","aside","main"].includes(a)){const P=r.className,g=r.getAttribute("role"),E=r.getAttribute("aria-label");if(E)return{name:`${a} [${E}]`,path:i};if(g)return{name:`${g}`,path:i};if(typeof P=="string"&&P){const b=P.split(/[\s_-]+/).map(_=>_.replace(/[A-Z0-9]{5,}.*$/,"")).filter(_=>_.length>2&&!/^[a-z]{1,2}$/.test(_)).slice(0,2);if(b.length>0)return{name:b.join(" "),path:i}}return{name:a==="div"?"container":a,path:i}}return{name:a,path:i}}function Tl(r){var h,m,x;const i=[],a=(h=r.textContent)==null?void 0:h.trim();a&&a.length<100&&i.push(a);const c=r.previousElementSibling;if(c){const f=(m=c.textContent)==null?void 0:m.trim();f&&f.length<50&&i.unshift(`[before: "${f.slice(0,40)}"]`)}const p=r.nextElementSibling;if(p){const f=(x=p.textContent)==null?void 0:x.trim();f&&f.length<50&&i.push(`[after: "${f.slice(0,40)}"]`)}return i.join(" ")}function Ks(r){const i=Hr(r);if(!i)return"";const p=(r.getRootNode()instanceof ShadowRoot&&r.parentElement?Array.from(r.parentElement.children):Array.from(i.children)).filter(k=>k!==r&&k instanceof HTMLElement);if(p.length===0)return"";const h=p.slice(0,4).map(k=>{var b;const P=k.tagName.toLowerCase(),g=k.className;let E="";if(typeof g=="string"&&g){const _=g.split(/\s+/).map(y=>y.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(y=>y.length>2&&!/^[a-z]{1,2}$/.test(y));_&&(E=`.${_}`)}if(P==="button"||P==="a"){const _=(b=k.textContent)==null?void 0:b.trim().slice(0,15);if(_)return`${P}${E} "${_}"`}return`${P}${E}`});let x=i.tagName.toLowerCase();if(typeof i.className=="string"&&i.className){const k=i.className.split(/\s+/).map(P=>P.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(P=>P.length>2&&!/^[a-z]{1,2}$/.test(P));k&&(x=`.${k}`)}const f=i.children.length,$=f>h.length+1?` (${f} total in ${x})`:"";return h.join(", ")+$}function Ll(r){const i=r.className;return typeof i!="string"||!i?"":i.split(/\s+/).filter(c=>c.length>0).map(c=>{const p=c.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);return p?p[1]:c}).filter((c,p,h)=>h.indexOf(c)===p).join(", ")}var yf=new Set(["none","normal","auto","0px","rgba(0, 0, 0, 0)","transparent","static","visible"]),Lh=new Set(["p","span","h1","h2","h3","h4","h5","h6","label","li","td","th","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","a","time","cite","q"]),Rh=new Set(["input","textarea","select"]),Ih=new Set(["img","video","canvas","svg"]),$h=new Set(["div","section","article","nav","header","footer","aside","main","ul","ol","form","fieldset"]);function Zs(r){if(typeof window>"u")return{};const i=window.getComputedStyle(r),a={},c=r.tagName.toLowerCase();let p;Lh.has(c)?p=["color","fontSize","fontWeight","fontFamily","lineHeight"]:c==="button"||c==="a"&&r.getAttribute("role")==="button"?p=["backgroundColor","color","padding","borderRadius","fontSize"]:Rh.has(c)?p=["backgroundColor","color","padding","borderRadius","fontSize"]:Ih.has(c)?p=["width","height","objectFit","borderRadius"]:$h.has(c)?p=["display","padding","margin","gap","backgroundColor"]:p=["color","fontSize","margin","padding","backgroundColor"];for(const h of p){const m=h.replace(/([A-Z])/g,"-$1").toLowerCase(),x=i.getPropertyValue(m);x&&!yf.has(x)&&(a[h]=x)}return a}var Mh=["color","backgroundColor","borderColor","fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","textAlign","width","height","padding","margin","border","borderRadius","display","position","top","right","bottom","left","zIndex","flexDirection","justifyContent","alignItems","gap","opacity","visibility","overflow","boxShadow","transform"];function Js(r){if(typeof window>"u")return"";const i=window.getComputedStyle(r),a=[];for(const c of Mh){const p=c.replace(/([A-Z])/g,"-$1").toLowerCase(),h=i.getPropertyValue(p);h&&!yf.has(h)&&a.push(`${p}: ${h}`)}return a.join("; ")}function zh(r){if(!r)return;const i={},a=r.split(";").map(c=>c.trim()).filter(Boolean);for(const c of a){const p=c.indexOf(":");if(p>0){const h=c.slice(0,p).trim(),m=c.slice(p+1).trim();h&&m&&(i[h]=m)}}return Object.keys(i).length>0?i:void 0}function qs(r){const i=[],a=r.getAttribute("role"),c=r.getAttribute("aria-label"),p=r.getAttribute("aria-describedby"),h=r.getAttribute("tabindex"),m=r.getAttribute("aria-hidden");return a&&i.push(`role="${a}"`),c&&i.push(`aria-label="${c}"`),p&&i.push(`aria-describedby="${p}"`),h&&i.push(`tabindex=${h}`),m==="true"&&i.push("aria-hidden"),r.matches("a, button, input, select, textarea, [tabindex]")&&i.push("focusable"),i.join(", ")}function ei(r){const i=[];let a=r;for(;a&&a.tagName.toLowerCase()!=="html";){const c=a.tagName.toLowerCase();let p=c;if(a.id)p=`${c}#${a.id}`;else if(a.className&&typeof a.className=="string"){const m=a.className.split(/\s+/).map(x=>x.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(x=>x.length>2);m&&(p=`${c}.${m}`)}const h=Hr(a);!a.parentElement&&h&&(p=`⟨shadow⟩ ${p}`),i.unshift(p),a=h}return i.join(" > ")}var ru="feedback-annotations-",xf=7;function ai(r){return`${ru}${r}`}function Ka(r){if(typeof window>"u")return[];try{const i=localStorage.getItem(ai(r));if(!i)return[];const a=JSON.parse(i),c=Date.now()-xf*24*60*60*1e3;return a.filter(p=>!p.timestamp||p.timestamp>c)}catch{return[]}}function vf(r,i){if(!(typeof window>"u"))try{localStorage.setItem(ai(r),JSON.stringify(i))}catch{}}function Oh(){const r=new Map;if(typeof window>"u")return r;try{const i=Date.now()-xf*24*60*60*1e3;for(let a=0;a<localStorage.length;a++){const c=localStorage.key(a);if(c!=null&&c.startsWith(ru)){const p=c.slice(ru.length),h=localStorage.getItem(c);if(h){const x=JSON.parse(h).filter(f=>!f.timestamp||f.timestamp>i);x.length>0&&r.set(p,x)}}}}catch{}return r}function Rl(r,i,a){const c=i.map(p=>({...p,_syncedTo:a}));vf(r,c)}var bf="agentation-session-";function au(r){return`${bf}${r}`}function Fh(r){if(typeof window>"u")return null;try{return localStorage.getItem(au(r))}catch{return null}}function Za(r,i){if(!(typeof window>"u"))try{localStorage.setItem(au(r),i)}catch{}}function Dh(r){if(!(typeof window>"u"))try{localStorage.removeItem(au(r))}catch{}}var wf=`${bf}toolbar-hidden`;function Ah(){if(typeof window>"u")return!1;try{return sessionStorage.getItem(wf)==="1"}catch{return!1}}function Bh(r){if(!(typeof window>"u"))try{r&&sessionStorage.setItem(wf,"1")}catch{}}async function Ja(r,i){const a=await fetch(`${r}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:i})});if(!a.ok)throw new Error(`Failed to create session: ${a.status}`);return a.json()}async function Zd(r,i){const a=await fetch(`${r}/sessions/${i}`);if(!a.ok)throw new Error(`Failed to get session: ${a.status}`);return a.json()}async function ti(r,i,a){const c=await fetch(`${r}/sessions/${i}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!c.ok)throw new Error(`Failed to sync annotation: ${c.status}`);return c.json()}async function Wh(r,i,a){const c=await fetch(`${r}/annotations/${i}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!c.ok)throw new Error(`Failed to update annotation: ${c.status}`);return c.json()}async function Jd(r,i){const a=await fetch(`${r}/annotations/${i}`,{method:"DELETE"});if(!a.ok)throw new Error(`Failed to delete annotation: ${a.status}`)}var Ke={FunctionComponent:0,ClassComponent:1,IndeterminateComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,Fragment:7,Mode:8,ContextConsumer:9,ContextProvider:10,ForwardRef:11,Profiler:12,SuspenseComponent:13,MemoComponent:14,SimpleMemoComponent:15,LazyComponent:16,IncompleteClassComponent:17,DehydratedFragment:18,SuspenseListComponent:19,ScopeComponent:21,OffscreenComponent:22,LegacyHiddenComponent:23,CacheComponent:24,TracingMarkerComponent:25,HostHoistable:26,HostSingleton:27,IncompleteFunctionComponent:28,Throw:29,ViewTransitionComponent:30,ActivityComponent:31},qd=new Set(["Component","PureComponent","Fragment","Suspense","Profiler","StrictMode","Routes","Route","Outlet","Root","ErrorBoundaryHandler","HotReload","Hot"]),ef=[/Boundary$/,/BoundaryHandler$/,/Provider$/,/Consumer$/,/^(Inner|Outer)/,/Router$/,/^Client(Page|Segment|Root)/,/^Server(Root|Component|Render)/,/^RSC/,/Context$/,/^Hot(Reload)?$/,/^(Dev|React)(Overlay|Tools|Root)/,/Overlay$/,/Handler$/,/^With[A-Z]/,/Wrapper$/,/^Root$/],Yh=[/Page$/,/View$/,/Screen$/,/Section$/,/Card$/,/List$/,/Item$/,/Form$/,/Modal$/,/Dialog$/,/Button$/,/Nav$/,/Header$/,/Footer$/,/Layout$/,/Panel$/,/Tab$/,/Menu$/];function Hh(r){const i=(r==null?void 0:r.mode)??"filtered";let a=qd;if(r!=null&&r.skipExact){const c=r.skipExact instanceof Set?r.skipExact:new Set(r.skipExact);a=new Set([...qd,...c])}return{maxComponents:(r==null?void 0:r.maxComponents)??6,maxDepth:(r==null?void 0:r.maxDepth)??30,mode:i,skipExact:a,skipPatterns:r!=null&&r.skipPatterns?[...ef,...r.skipPatterns]:ef,userPatterns:(r==null?void 0:r.userPatterns)??Yh,filter:r==null?void 0:r.filter}}function Uh(r){return r.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/([A-Z])([A-Z][a-z])/g,"$1-$2").toLowerCase()}function Vh(r,i=10){const a=new Set;let c=r,p=0;for(;c&&p<i;)c.className&&typeof c.className=="string"&&c.className.split(/\s+/).forEach(h=>{if(h.length>1){const m=h.replace(/[_][a-zA-Z0-9]{5,}.*$/,"").toLowerCase();m.length>1&&a.add(m)}}),c=c.parentElement,p++;return a}function Xh(r,i){const a=Uh(r);for(const c of i){if(c===a)return!0;const p=a.split("-").filter(m=>m.length>2),h=c.split("-").filter(m=>m.length>2);for(const m of p)for(const x of h)if(m===x||m.includes(x)||x.includes(m))return!0}return!1}function Qh(r,i,a,c){if(a.filter)return a.filter(r,i);switch(a.mode){case"all":return!0;case"filtered":return!(a.skipExact.has(r)||a.skipPatterns.some(p=>p.test(r)));case"smart":return a.skipExact.has(r)||a.skipPatterns.some(p=>p.test(r))?!1:!!(c&&Xh(r,c)||a.userPatterns.some(p=>p.test(r)));default:return!0}}var Br=null,Gh=new WeakMap;function qa(r){return Object.keys(r).some(i=>i.startsWith("__reactFiber$")||i.startsWith("__reactInternalInstance$")||i.startsWith("__reactProps$"))}function Kh(){if(Br!==null)return Br;if(typeof document>"u")return!1;if(document.body&&qa(document.body))return Br=!0,!0;const r=["#root","#app","#__next","[data-reactroot]"];for(const i of r){const a=document.querySelector(i);if(a&&qa(a))return Br=!0,!0}if(document.body){for(const i of document.body.children)if(qa(i))return Br=!0,!0}return Br=!1,!1}var Il={map:Gh};function Zh(r){return Object.keys(r).find(a=>a.startsWith("__reactFiber$")||a.startsWith("__reactInternalInstance$"))||null}function Jh(r){const i=Zh(r);return i?r[i]:null}function er(r){return r?r.displayName?r.displayName:r.name?r.name:null:null}function qh(r){var p;const{tag:i,type:a,elementType:c}=r;if(i===Ke.HostComponent||i===Ke.HostText||i===Ke.HostHoistable||i===Ke.HostSingleton||i===Ke.Fragment||i===Ke.Mode||i===Ke.Profiler||i===Ke.DehydratedFragment||i===Ke.HostRoot||i===Ke.HostPortal||i===Ke.ScopeComponent||i===Ke.OffscreenComponent||i===Ke.LegacyHiddenComponent||i===Ke.CacheComponent||i===Ke.TracingMarkerComponent||i===Ke.Throw||i===Ke.ViewTransitionComponent||i===Ke.ActivityComponent)return null;if(i===Ke.ForwardRef){const h=c;if(h!=null&&h.render){const m=er(h.render);if(m)return m}return h!=null&&h.displayName?h.displayName:er(a)}if(i===Ke.MemoComponent||i===Ke.SimpleMemoComponent){const h=c;if(h!=null&&h.type){const m=er(h.type);if(m)return m}return h!=null&&h.displayName?h.displayName:er(a)}if(i===Ke.ContextProvider){const h=a;return(p=h==null?void 0:h._context)!=null&&p.displayName?`${h._context.displayName}.Provider`:null}if(i===Ke.ContextConsumer){const h=a;return h!=null&&h.displayName?`${h.displayName}.Consumer`:null}if(i===Ke.LazyComponent){const h=c;return(h==null?void 0:h._status)===1&&h._result?er(h._result):null}return i===Ke.SuspenseComponent||i===Ke.SuspenseListComponent?null:i===Ke.IncompleteClassComponent||i===Ke.IncompleteFunctionComponent||i===Ke.FunctionComponent||i===Ke.ClassComponent||i===Ke.IndeterminateComponent?er(a):null}function e_(r){return r.length<=2||r.length<=3&&r===r.toLowerCase()}function t_(r,i){const a=Hh(i),c=a.mode==="all";if(c){const f=Il.map.get(r);if(f!==void 0)return f}if(!Kh()){const f={path:null,components:[]};return c&&Il.map.set(r,f),f}const p=a.mode==="smart"?Vh(r):void 0,h=[];try{let f=Jh(r),$=0;for(;f&&$<a.maxDepth&&h.length<a.maxComponents;){const k=qh(f);k&&!e_(k)&&Qh(k,$,a,p)&&h.push(k),f=f.return,$++}}catch{const f={path:null,components:[]};return c&&Il.map.set(r,f),f}if(h.length===0){const f={path:null,components:[]};return c&&Il.map.set(r,f),f}const x={path:h.slice().reverse().map(f=>`<${f}>`).join(" "),components:h};return c&&Il.map.set(r,x),x}var $l={FunctionComponent:0,IndeterminateComponent:2,ForwardRef:11,MemoComponent:14,SimpleMemoComponent:15};function n_(r){if(!r||typeof r!="object")return null;const i=Object.keys(r),a=i.find(h=>h.startsWith("__reactFiber$"));if(a)return r[a]||null;const c=i.find(h=>h.startsWith("__reactInternalInstance$"));if(c)return r[c]||null;const p=i.find(h=>{if(!h.startsWith("__react"))return!1;const m=r[h];return m&&typeof m=="object"&&"_debugSource"in m});return p&&r[p]||null}function Dl(r){if(!r.type||typeof r.type=="string")return null;if(typeof r.type=="object"||typeof r.type=="function"){const i=r.type;if(i.displayName)return i.displayName;if(i.name)return i.name}return null}function o_(r,i=50){var p;let a=r,c=0;for(;a&&c<i;){if(a._debugSource)return{source:a._debugSource,componentName:Dl(a)};if((p=a._debugOwner)!=null&&p._debugSource)return{source:a._debugOwner._debugSource,componentName:Dl(a._debugOwner)};a=a.return,c++}return null}function r_(r){let i=r,a=0;const c=50;for(;i&&a<c;){const p=i,h=["_debugSource","__source","_source","debugSource"];for(const m of h){const x=p[m];if(x&&typeof x=="object"&&"fileName"in x)return{source:x,componentName:Dl(i)}}if(i.memoizedProps){const m=i.memoizedProps;if(m.__source&&typeof m.__source=="object"){const x=m.__source;if(x.fileName&&x.lineNumber)return{source:{fileName:x.fileName,lineNumber:x.lineNumber,columnNumber:x.columnNumber},componentName:Dl(i)}}}i=i.return,a++}return null}var ni=new Map;function l_(r){var p;const i=r.tag,a=r.type,c=r.elementType;if(typeof a=="string"||a==null||typeof a=="function"&&((p=a.prototype)!=null&&p.isReactComponent))return null;if((i===$l.FunctionComponent||i===$l.IndeterminateComponent)&&typeof a=="function")return a;if(i===$l.ForwardRef&&c){const h=c.render;if(typeof h=="function")return h}if((i===$l.MemoComponent||i===$l.SimpleMemoComponent)&&c){const h=c.type;if(typeof h=="function")return h}return typeof a=="function"?a:null}function s_(){const r=lf,i=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;if(i&&"H"in i)return{get:()=>i.H,set:c=>{i.H=c}};const a=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;if(a){const c=a.ReactCurrentDispatcher;if(c&&"current"in c)return{get:()=>c.current,set:p=>{c.current=p}}}return null}function i_(r){const i=r.split(`
`),a=[/source-location/,/\/dist\/index\./,/node_modules\//,/react-dom/,/react\.development/,/react\.production/,/chunk-[A-Z0-9]+/i,/react-stack-bottom-frame/,/react-reconciler/,/scheduler/,/<anonymous>/],c=/^\s*at\s+(?:.*?\s+\()?(.+?):(\d+):(\d+)\)?$/,p=/^[^@]*@(.+?):(\d+):(\d+)$/;for(const h of i){const m=h.trim();if(!m||a.some(f=>f.test(m)))continue;const x=c.exec(m)||p.exec(m);if(x)return{fileName:x[1],line:parseInt(x[2],10),column:parseInt(x[3],10)}}return null}function a_(r){let i=r;return i=i.replace(/[?#].*$/,""),i=i.replace(/^turbopack:\/\/\/\[project\]\//,""),i=i.replace(/^webpack-internal:\/\/\/\.\//,""),i=i.replace(/^webpack-internal:\/\/\//,""),i=i.replace(/^webpack:\/\/\/\.\//,""),i=i.replace(/^webpack:\/\/\//,""),i=i.replace(/^turbopack:\/\/\//,""),i=i.replace(/^https?:\/\/[^/]+\//,""),i=i.replace(/^file:\/\/\//,"/"),i=i.replace(/^\([^)]+\)\/\.\//,""),i=i.replace(/^\.\//,""),i}function u_(r){const i=l_(r);if(!i)return null;if(ni.has(i))return ni.get(i);const a=s_();if(!a)return ni.set(i,null),null;const c=a.get();let p=null;try{const h=new Proxy({},{get(){throw new Error("probe")}});a.set(h);try{i({})}catch(m){if(m instanceof Error&&m.message==="probe"&&m.stack){const x=i_(m.stack);x&&(p={fileName:a_(x.fileName),lineNumber:x.line,columnNumber:x.column,componentName:Dl(r)||void 0})}}}finally{a.set(c)}return ni.set(i,p),p}function c_(r,i=15){let a=r,c=0;for(;a&&c<i;){const p=u_(a);if(p)return p;a=a.return,c++}return null}function lu(r){const i=n_(r);if(!i)return{found:!1,reason:"no-fiber",isReactApp:!1,isProduction:!1};let a=o_(i);if(a||(a=r_(i)),a!=null&&a.source)return{found:!0,source:{fileName:a.source.fileName,lineNumber:a.source.lineNumber,columnNumber:a.source.columnNumber,componentName:a.componentName||void 0},isReactApp:!0,isProduction:!1};const c=c_(i);return c?{found:!0,source:c,isReactApp:!0,isProduction:!1}:{found:!1,reason:"no-debug-source",isReactApp:!0,isProduction:!1}}function d_(r,i="path"){const{fileName:a,lineNumber:c,columnNumber:p}=r;let h=`${a}:${c}`;return p!==void 0&&(h+=`:${p}`),i==="vscode"?`vscode://file${a.startsWith("/")?"":"/"}${h}`:h}function f_(r,i=10){let a=r,c=0;for(;a&&c<i;){const p=lu(a);if(p.found)return p;a=a.parentElement,c++}return lu(r)}var m_=`svg[fill=none] {
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
}`,p_={toolbar:"styles-module__toolbar___wNsdK",toolbarContainer:"styles-module__toolbarContainer___dIhma",dragging:"styles-module__dragging___xrolZ",entrance:"styles-module__entrance___sgHd8",toolbarEnter:"styles-module__toolbarEnter___u8RRu",hiding:"styles-module__hiding___1td44",toolbarHide:"styles-module__toolbarHide___y8kaT",collapsed:"styles-module__collapsed___Rydsn",expanded:"styles-module__expanded___ofKPx",serverConnected:"styles-module__serverConnected___Gfbou",toggleContent:"styles-module__toggleContent___0yfyP",visible:"styles-module__visible___KHwEW",hidden:"styles-module__hidden___Ae8H4",controlsContent:"styles-module__controlsContent___9GJWU",badge:"styles-module__badge___2XsgF",fadeOut:"styles-module__fadeOut___6Ut6-",badgeEnter:"styles-module__badgeEnter___mVQLj",controlButton:"styles-module__controlButton___8Q0jc",statusShowing:"styles-module__statusShowing___te6iu",buttonBadge:"styles-module__buttonBadge___NeFWb",light:"styles-module__light___r6n4Y",mcpIndicator:"styles-module__mcpIndicator___zGJeL",connected:"styles-module__connected___7c28g",mcpIndicatorPulseConnected:"styles-module__mcpIndicatorPulseConnected___EDodZ",connecting:"styles-module__connecting___uo-CW",mcpIndicatorPulseConnecting:"styles-module__mcpIndicatorPulseConnecting___cCYte",connectionIndicatorWrapper:"styles-module__connectionIndicatorWrapper___L-e-3",connectionIndicator:"styles-module__connectionIndicator___afk9p",connectionIndicatorVisible:"styles-module__connectionIndicatorVisible___C-i5B",connectionIndicatorConnected:"styles-module__connectionIndicatorConnected___IY8pR",connectionPulse:"styles-module__connectionPulse___-Zycw",connectionIndicatorDisconnected:"styles-module__connectionIndicatorDisconnected___kmpaZ",connectionIndicatorConnecting:"styles-module__connectionIndicatorConnecting___QmSLH",buttonWrapper:"styles-module__buttonWrapper___rBcdv",buttonTooltip:"styles-module__buttonTooltip___Burd9",tooltipsInSession:"styles-module__tooltipsInSession___-0lHH",sendButtonWrapper:"styles-module__sendButtonWrapper___UUxG6",sendButtonVisible:"styles-module__sendButtonVisible___WPSQU",shortcut:"styles-module__shortcut___lEAQk",tooltipBelow:"styles-module__tooltipBelow___m6ats",tooltipsHidden:"styles-module__tooltipsHidden___VtLJG",tooltipVisible:"styles-module__tooltipVisible___0jcCv",buttonWrapperAlignLeft:"styles-module__buttonWrapperAlignLeft___myzIp",buttonWrapperAlignRight:"styles-module__buttonWrapperAlignRight___HCQFR",divider:"styles-module__divider___c--s1",overlay:"styles-module__overlay___Q1O9y",hoverHighlight:"styles-module__hoverHighlight___ogakW",enter:"styles-module__enter___WFIki",hoverHighlightIn:"styles-module__hoverHighlightIn___6WYHY",multiSelectOutline:"styles-module__multiSelectOutline___cSJ-m",fadeIn:"styles-module__fadeIn___b9qmf",exit:"styles-module__exit___fyOJ0",singleSelectOutline:"styles-module__singleSelectOutline___QhX-O",hoverTooltip:"styles-module__hoverTooltip___bvLk7",hoverTooltipIn:"styles-module__hoverTooltipIn___FYGQx",hoverReactPath:"styles-module__hoverReactPath___gx1IJ",hoverElementName:"styles-module__hoverElementName___QMLMl",markersLayer:"styles-module__markersLayer___-25j1",fixedMarkersLayer:"styles-module__fixedMarkersLayer___ffyX6",marker:"styles-module__marker___6sQrs",clearing:"styles-module__clearing___FQ--7",markerIn:"styles-module__markerIn___5FaAP",markerOut:"styles-module__markerOut___GU5jX",pending:"styles-module__pending___2IHLC",fixed:"styles-module__fixed___dBMHC",multiSelect:"styles-module__multiSelect___YWiuz",hovered:"styles-module__hovered___ZgXIy",renumber:"styles-module__renumber___nCTxD",renumberRoll:"styles-module__renumberRoll___Wgbq3",markerTooltip:"styles-module__markerTooltip___aLJID",tooltipIn:"styles-module__tooltipIn___0N31w",markerQuote:"styles-module__markerQuote___FHmrz",markerNote:"styles-module__markerNote___QkrrS",markerHint:"styles-module__markerHint___2iF-6",settingsPanel:"styles-module__settingsPanel___OxX3Y",settingsHeader:"styles-module__settingsHeader___pwDY9",settingsBrand:"styles-module__settingsBrand___0gJeM",settingsBrandSlash:"styles-module__settingsBrandSlash___uTG18",settingsVersion:"styles-module__settingsVersion___TUcFq",settingsSection:"styles-module__settingsSection___m-YM2",settingsLabel:"styles-module__settingsLabel___8UjfX",cycleButton:"styles-module__cycleButton___FMKfw",cycleDot:"styles-module__cycleDot___nPgLY",dropdownButton:"styles-module__dropdownButton___16NPz",toggleLabel:"styles-module__toggleLabel___Xm8Aa",customCheckbox:"styles-module__customCheckbox___U39ax",sliderLabel:"styles-module__sliderLabel___U8sPr",slider:"styles-module__slider___GLdxp",helpIcon:"styles-module__helpIcon___xQg56",themeToggle:"styles-module__themeToggle___2rUjA",dark:"styles-module__dark___ILIQf",settingsOption:"styles-module__settingsOption___UNa12",selected:"styles-module__selected___OwRqP",settingsPanelContainer:"styles-module__settingsPanelContainer___Xksv8",transitioning:"styles-module__transitioning___qxzCk",settingsPage:"styles-module__settingsPage___6YfHH",slideLeft:"styles-module__slideLeft___Ps01J",automationsPage:"styles-module__automationsPage___uvCq6",slideIn:"styles-module__slideIn___4-qXe",settingsNavLink:"styles-module__settingsNavLink___wCzJt",settingsNavLinkRight:"styles-module__settingsNavLinkRight___ZWwhj",mcpNavIndicator:"styles-module__mcpNavIndicator___cl9pO",mcpPulse:"styles-module__mcpPulse___uNggr",settingsBackButton:"styles-module__settingsBackButton___bIe2j",automationHeader:"styles-module__automationHeader___InP0r",automationDescription:"styles-module__automationDescription___NKlmo",learnMoreLink:"styles-module__learnMoreLink___8xv-x",autoSendRow:"styles-module__autoSendRow___UblX5",autoSendLabel:"styles-module__autoSendLabel___icDc2",active:"styles-module__active___-zoN6",webhookUrlInput:"styles-module__webhookUrlInput___2375C",settingsSectionExtraPadding:"styles-module__settingsSectionExtraPadding___jdhFV",settingsSectionGrow:"styles-module__settingsSectionGrow___h-5HZ",settingsRow:"styles-module__settingsRow___3sdhc",settingsRowMarginTop:"styles-module__settingsRowMarginTop___zA0Sp",dropdownContainer:"styles-module__dropdownContainer___BVnxe",settingsRowDisabled:"styles-module__settingsRowDisabled___EgS0V",toggleSwitch:"styles-module__toggleSwitch___l4Ygm",cycleButtonText:"styles-module__cycleButtonText___fD1LR",cycleTextIn:"styles-module__cycleTextIn___Q6zJf",cycleDots:"styles-module__cycleDots___LWuoQ",dropdownMenu:"styles-module__dropdownMenu___k73ER",scaleIn:"styles-module__scaleIn___c-r1K",dropdownItem:"styles-module__dropdownItem___ylsLj",settingsLabelMarker:"styles-module__settingsLabelMarker___ewdtV",settingsOptions:"styles-module__settingsOptions___LyrBA",sliderContainer:"styles-module__sliderContainer___ducXj",sliderLabels:"styles-module__sliderLabels___FhLDB",colorOptions:"styles-module__colorOptions___iHCNX",colorOption:"styles-module__colorOption___IodiY",colorOptionRing:"styles-module__colorOptionRing___U2xpo",settingsToggle:"styles-module__settingsToggle___fBrFn",settingsToggleMarginBottom:"styles-module__settingsToggleMarginBottom___MZUyF",checked:"styles-module__checked___mnZLo",toggleSlider:"styles-module__toggleSlider___wprIn",disabled:"styles-module__disabled___332Jw",mcpStatusDot:"styles-module__mcpStatusDot___ibgkc",disconnected:"styles-module__disconnected___cHPxR",mcpPulseError:"styles-module__mcpPulseError___fov9B",helpIconNudgeDown:"styles-module__helpIconNudgeDown___0cqpM",helpIconNoNudge:"styles-module__helpIconNoNudge___abogC","helpIconNudge1-5":"styles-module__helpIconNudge1-5___DM2TQ",helpIconNudge2:"styles-module__helpIconNudge2___TfWgC",dragSelection:"styles-module__dragSelection___kZLq2",dragCount:"styles-module__dragCount___KM90j",highlightsContainer:"styles-module__highlightsContainer___-0xzG",selectedElementHighlight:"styles-module__selectedElementHighlight___fyVlI",themeIconWrapper:"styles-module__themeIconWrapper___LsJIM",themeIcon:"styles-module__themeIcon___lCCmo",themeIconIn:"styles-module__themeIconIn___TU6ML",scaleOut:"styles-module__scaleOut___Wctwz",slideUp:"styles-module__slideUp___kgD36",slideDown:"styles-module__slideDown___zcdje",settingsPanelIn:"styles-module__settingsPanelIn___MGfO8",settingsPanelOut:"styles-module__settingsPanelOut___Zfymi"};if(typeof document<"u"){let r=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");r||(r=document.createElement("style"),r.id="feedback-tool-styles-page-toolbar-css-styles",r.textContent=m_,document.head.appendChild(r))}var S=p_;function eu(r,i="filtered"){const{name:a,path:c}=ii(r);if(i==="off")return{name:a,elementName:a,path:c,reactComponents:null};const p=t_(r,{mode:i});return{name:p.path?`${p.path} ${a}`:a,elementName:a,path:c,reactComponents:p.path}}var tf=!1,nf={outputDetail:"standard",autoClearAfterCopy:!1,annotationColor:"#3c82f7",blockInteractions:!0,reactEnabled:!0,markerClickBehavior:"edit",webhookUrl:"",webhooksEnabled:!0},Bn=r=>{if(!r||!r.trim())return!1;try{const i=new URL(r.trim());return i.protocol==="http:"||i.protocol==="https:"}catch{return!1}},Ml=[{value:"compact",label:"Compact"},{value:"standard",label:"Standard"},{value:"detailed",label:"Detailed"},{value:"forensic",label:"Forensic"}],h_=[{value:"#AF52DE",label:"Purple"},{value:"#3c82f7",label:"Blue"},{value:"#5AC8FA",label:"Cyan"},{value:"#34C759",label:"Green"},{value:"#FFD60A",label:"Yellow"},{value:"#FF9500",label:"Orange"},{value:"#FF3B30",label:"Red"}];function Wr(r,i){let a=document.elementFromPoint(r,i);if(!a)return null;for(;a!=null&&a.shadowRoot;){const c=a.shadowRoot.elementFromPoint(r,i);if(!c||c===a)break;a=c}return a}function tu(r){let i=r;for(;i&&i!==document.body;){const c=window.getComputedStyle(i).position;if(c==="fixed"||c==="sticky")return!0;i=i.parentElement}return!1}function Eo(r){return r.status!=="resolved"&&r.status!=="dismissed"}function oi(r){const i=lu(r),a=i.found?i:f_(r);if(a.found&&a.source)return d_(a.source,"path")}function of(r,i,a="standard",c="filtered"){if(r.length===0)return"";const p=typeof window<"u"?`${window.innerWidth}×${window.innerHeight}`:"unknown";let h=`## Page Feedback: ${i}
`;return a==="forensic"?(h+=`
**Environment:**
`,h+=`- Viewport: ${p}
`,typeof window<"u"&&(h+=`- URL: ${window.location.href}
`,h+=`- User Agent: ${navigator.userAgent}
`,h+=`- Timestamp: ${new Date().toISOString()}
`,h+=`- Device Pixel Ratio: ${window.devicePixelRatio}
`),h+=`
---
`):a!=="compact"&&(h+=`**Viewport:** ${p}
`),h+=`
`,r.forEach((m,x)=>{a==="compact"?(h+=`${x+1}. **${m.element}**${m.sourceFile?` (${m.sourceFile})`:""}: ${m.comment}`,m.selectedText&&(h+=` (re: "${m.selectedText.slice(0,30)}${m.selectedText.length>30?"...":""}")`),h+=`
`):a==="forensic"?(h+=`### ${x+1}. ${m.element}
`,m.isMultiSelect&&m.fullPath&&(h+=`*Forensic data shown for first element of selection*
`),m.fullPath&&(h+=`**Full DOM Path:** ${m.fullPath}
`),m.cssClasses&&(h+=`**CSS Classes:** ${m.cssClasses}
`),m.boundingBox&&(h+=`**Position:** x:${Math.round(m.boundingBox.x)}, y:${Math.round(m.boundingBox.y)} (${Math.round(m.boundingBox.width)}×${Math.round(m.boundingBox.height)}px)
`),h+=`**Annotation at:** ${m.x.toFixed(1)}% from left, ${Math.round(m.y)}px from top
`,m.selectedText&&(h+=`**Selected text:** "${m.selectedText}"
`),m.nearbyText&&!m.selectedText&&(h+=`**Context:** ${m.nearbyText.slice(0,100)}
`),m.computedStyles&&(h+=`**Computed Styles:** ${m.computedStyles}
`),m.accessibility&&(h+=`**Accessibility:** ${m.accessibility}
`),m.nearbyElements&&(h+=`**Nearby Elements:** ${m.nearbyElements}
`),m.sourceFile&&(h+=`**Source:** ${m.sourceFile}
`),m.reactComponents&&(h+=`**React:** ${m.reactComponents}
`),h+=`**Feedback:** ${m.comment}

`):(h+=`### ${x+1}. ${m.element}
`,h+=`**Location:** ${m.elementPath}
`,m.sourceFile&&(h+=`**Source:** ${m.sourceFile}
`),m.reactComponents&&(h+=`**React:** ${m.reactComponents}
`),a==="detailed"&&(m.cssClasses&&(h+=`**Classes:** ${m.cssClasses}
`),m.boundingBox&&(h+=`**Position:** ${Math.round(m.boundingBox.x)}px, ${Math.round(m.boundingBox.y)}px (${Math.round(m.boundingBox.width)}×${Math.round(m.boundingBox.height)}px)
`)),m.selectedText&&(h+=`**Selected text:** "${m.selectedText}"
`),a==="detailed"&&m.nearbyText&&!m.selectedText&&(h+=`**Context:** ${m.nearbyText.slice(0,100)}
`),h+=`**Feedback:** ${m.comment}

`)}),h.trim()}function __({demoAnnotations:r,demoDelay:i=1e3,enableDemoMode:a=!1,onAnnotationAdd:c,onAnnotationDelete:p,onAnnotationUpdate:h,onAnnotationsClear:m,onCopy:x,onSubmit:f,copyToClipboard:$=!0,endpoint:k,sessionId:P,onSessionCreated:g,webhookUrl:E,className:b}={}){var Zn,Bo,ql;const[_,y]=C.useState(!1),[R,ee]=C.useState([]),[ne,se]=C.useState(!0),[re,ie]=C.useState(()=>Ah()),[ue,v]=C.useState(!1),G=C.useRef(null);C.useEffect(()=>{const w=B=>{const X=G.current;X&&X.contains(B.target)&&B.stopPropagation()},N=["mousedown","click","pointerdown"];return N.forEach(B=>document.body.addEventListener(B,w)),()=>{N.forEach(B=>document.body.removeEventListener(B,w))}},[]);const[fe,Z]=C.useState(!1),[de,Me]=C.useState(!1),[Oe,ze]=C.useState(null),[O,W]=C.useState({x:0,y:0}),[M,Y]=C.useState(null),[U,L]=C.useState(!1),[D,ae]=C.useState("idle"),[we,H]=C.useState(!1),[ve,Ie]=C.useState(!1),[Te,Ue]=C.useState(null),[Nt,an]=C.useState(null),[Ur,En]=C.useState([]),[tr,Vr]=C.useState(null),[No,nr]=C.useState(null),[Fe,Yn]=C.useState(null),[Hn,It]=C.useState(null),[or,Nn]=C.useState([]),[Pn,Xr]=C.useState(0),[Qr,rr]=C.useState(!1),[nt,Bl]=C.useState(!1),[Pt,so]=C.useState(!1),[Po,lr]=C.useState(!1),[Wl,Yl]=C.useState(!1),[To,Lo]=C.useState("main"),[sr,ir]=C.useState(!1),[Gr,Tn]=C.useState(!1),[Un,Kr]=C.useState(!1),Vn=C.useRef(null),[ut,Xn]=C.useState([]),qt=C.useRef({cmd:!1,shift:!1}),Ct=()=>{Tn(!0)},Hl=()=>{Tn(!1)},Ro=()=>{Un||(Vn.current=setTimeout(()=>Kr(!0),850))},Zr=()=>{Vn.current&&(clearTimeout(Vn.current),Vn.current=null),Kr(!1),Hl()};C.useEffect(()=>()=>{Vn.current&&clearTimeout(Vn.current)},[]);const un=({content:w,children:N})=>{const[B,X]=C.useState(!1),[Q,J]=C.useState(!1),[_e,he]=C.useState(!1),[ke,Le]=C.useState({top:0,right:0}),Ce=C.useRef(null),Pe=C.useRef(null),Se=C.useRef(null),Ne=()=>{if(Ce.current){const gt=Ce.current.getBoundingClientRect();Le({top:gt.top+gt.height/2,right:window.innerWidth-gt.left+8})}},ge=()=>{X(!0),he(!0),Se.current&&(clearTimeout(Se.current),Se.current=null),Ne(),Pe.current=Ve(()=>{J(!0)},500)},_t=()=>{X(!1),Pe.current&&(clearTimeout(Pe.current),Pe.current=null),J(!1),Se.current=Ve(()=>{he(!1)},150)};return C.useEffect(()=>()=>{Pe.current&&clearTimeout(Pe.current),Se.current&&clearTimeout(Se.current)},[]),l.jsxs(l.Fragment,{children:[l.jsx("span",{ref:Ce,onMouseEnter:ge,onMouseLeave:_t,children:N}),_e&&Vd.createPortal(l.jsx("div",{"data-feedback-toolbar":!0,style:{position:"fixed",top:ke.top,right:ke.right,transform:"translateY(-50%)",padding:"6px 10px",background:"#383838",color:"rgba(255, 255, 255, 0.7)",fontSize:"11px",fontWeight:400,lineHeight:"14px",borderRadius:"10px",width:"180px",textAlign:"left",zIndex:100020,pointerEvents:"none",boxShadow:"0px 1px 8px rgba(0, 0, 0, 0.28)",opacity:Q&&!sr?1:0,transition:"opacity 0.15s ease"},children:w}),document.body)]})},[ce,Yt]=C.useState(nf),[$e,Io]=C.useState(!0),[ar,Ul]=C.useState(!1),Vl=!1,gn="off",[pt,ur]=C.useState(P??null),Jr=C.useRef(!1),[Tt,Ln]=C.useState(k?"connecting":"disconnected"),[Ze,cr]=C.useState(null),[cn,Xl]=C.useState(!1),[io,lt]=C.useState(null),[di,qr]=C.useState(0),dr=C.useRef(!1),[$o,Mo]=C.useState(new Set),[el,Qn]=C.useState(new Set),[$t,fr]=C.useState(!1),[en,ao]=C.useState(!1),[yn,Ql]=C.useState(!1),xn=C.useRef(null),At=C.useRef(null),vn=C.useRef(null),Rn=C.useRef(null),mr=C.useRef(!1),Gl=C.useRef(0),uo=C.useRef(null),tl=C.useRef(null),zo=8,Oo=50,Kl=C.useRef(null),pr=C.useRef(null),He=C.useRef(null),Je=typeof window<"u"?window.location.pathname:"/";C.useEffect(()=>{if(Po)Yl(!0);else{Tn(!1),Lo("main");const w=Ve(()=>Yl(!1),0);return()=>clearTimeout(w)}},[Po]),C.useEffect(()=>{ir(!0);const w=Ve(()=>ir(!1),350);return()=>clearTimeout(w)},[To]);const nl=_&&ne;C.useEffect(()=>{if(nl){Me(!1),Z(!0),Mo(new Set);const w=Ve(()=>{Mo(N=>{const B=new Set(N);return R.forEach(X=>B.add(X.id)),B})},350);return()=>clearTimeout(w)}else if(fe){Me(!0);const w=Ve(()=>{Z(!1),Me(!1)},250);return()=>clearTimeout(w)}},[nl]),C.useEffect(()=>{Bl(!0),Xr(window.scrollY);const w=Ka(Je);ee(w.filter(Eo)),tf||(Ul(!0),tf=!0,Ve(()=>Ul(!1),750));try{const N=localStorage.getItem("feedback-toolbar-settings");N&&Yt({...nf,...JSON.parse(N)})}catch{}try{const N=localStorage.getItem("feedback-toolbar-theme");N!==null&&Io(N==="dark")}catch{}try{const N=localStorage.getItem("feedback-toolbar-position");if(N){const B=JSON.parse(N);typeof B.x=="number"&&typeof B.y=="number"&&cr(B)}}catch{}},[Je]),C.useEffect(()=>{nt&&localStorage.setItem("feedback-toolbar-settings",JSON.stringify(ce))},[ce,nt]),C.useEffect(()=>{nt&&localStorage.setItem("feedback-toolbar-theme",$e?"dark":"light")},[$e,nt]);const hr=C.useRef(!1);C.useEffect(()=>{const w=hr.current;hr.current=cn,w&&!cn&&Ze&&nt&&localStorage.setItem("feedback-toolbar-position",JSON.stringify(Ze))},[cn,Ze,nt]),C.useEffect(()=>{if(!k||!nt||Jr.current)return;Jr.current=!0,Ln("connecting"),(async()=>{try{const N=Fh(Je),B=P||N;let X=!1;if(B)try{const Q=await Zd(k,B);ur(Q.id),Ln("connected"),Za(Je,Q.id),X=!0;const J=Ka(Je),_e=new Set(Q.annotations.map(ke=>ke.id)),he=J.filter(ke=>!_e.has(ke.id));if(he.length>0){const Le=`${typeof window<"u"?window.location.origin:""}${Je}`,Pe=(await Promise.allSettled(he.map(Ne=>ti(k,Q.id,{...Ne,sessionId:Q.id,url:Le})))).map((Ne,ge)=>Ne.status==="fulfilled"?Ne.value:(console.warn("[Agentation] Failed to sync annotation:",Ne.reason),he[ge])),Se=[...Q.annotations,...Pe];ee(Se.filter(Eo)),Rl(Je,Se.filter(Eo),Q.id)}else ee(Q.annotations.filter(Eo)),Rl(Je,Q.annotations.filter(Eo),Q.id)}catch(Q){console.warn("[Agentation] Could not join session, creating new:",Q),Dh(Je)}if(!X){const Q=typeof window<"u"?window.location.href:"/",J=await Ja(k,Q);ur(J.id),Ln("connected"),Za(Je,J.id),g==null||g(J.id);const _e=Oh(),he=typeof window<"u"?window.location.origin:"",ke=[];for(const[Le,Ce]of _e){const Pe=Ce.filter(ge=>!ge._syncedTo);if(Pe.length===0)continue;const Se=`${he}${Le}`,Ne=Le===Je;ke.push((async()=>{try{const ge=Ne?J:await Ja(k,Se),on=(await Promise.allSettled(Pe.map(st=>ti(k,ge.id,{...st,sessionId:ge.id,url:Se})))).map((st,ft)=>st.status==="fulfilled"?st.value:(console.warn("[Agentation] Failed to sync annotation:",st.reason),Pe[ft])).filter(Eo);if(Rl(Le,on,ge.id),Ne){const st=new Set(Pe.map(ft=>ft.id));ee(ft=>{const Ae=ft.filter(Be=>!st.has(Be.id));return[...on,...Ae]})}}catch(ge){console.warn(`[Agentation] Failed to sync annotations for ${Le}:`,ge)}})())}await Promise.allSettled(ke)}}catch(N){Ln("disconnected"),console.warn("[Agentation] Failed to initialize session, using local storage:",N)}})()},[k,P,nt,g,Je]),C.useEffect(()=>{if(!k||!nt)return;const w=async()=>{try{(await fetch(`${k}/health`)).ok?Ln("connected"):Ln("disconnected")}catch{Ln("disconnected")}};w();const N=Eh(w,1e4);return()=>clearInterval(N)},[k,nt]),C.useEffect(()=>{if(!k||!nt||!pt)return;const w=new EventSource(`${k}/sessions/${pt}/events`),N=["resolved","dismissed"],B=X=>{var Q;try{const J=JSON.parse(X.data);if(N.includes((Q=J.payload)==null?void 0:Q.status)){const _e=J.payload.id;Qn(he=>new Set(he).add(_e)),Ve(()=>{ee(he=>he.filter(ke=>ke.id!==_e)),Qn(he=>{const ke=new Set(he);return ke.delete(_e),ke})},150)}}catch{}};return w.addEventListener("annotation.updated",B),()=>{w.removeEventListener("annotation.updated",B),w.close()}},[k,nt,pt]),C.useEffect(()=>{if(!k||!nt)return;const w=tl.current==="disconnected",N=Tt==="connected";tl.current=Tt,w&&N&&(async()=>{try{const X=Ka(Je);if(X.length===0)return;const J=`${typeof window<"u"?window.location.origin:""}${Je}`;let _e=pt,he=[];if(_e)try{he=(await Zd(k,_e)).annotations}catch{_e=null}_e||(_e=(await Ja(k,J)).id,ur(_e),Za(Je,_e));const ke=new Set(he.map(Ce=>Ce.id)),Le=X.filter(Ce=>!ke.has(Ce.id));if(Le.length>0){const Pe=(await Promise.allSettled(Le.map(ge=>ti(k,_e,{...ge,sessionId:_e,url:J})))).map((ge,_t)=>ge.status==="fulfilled"?ge.value:(console.warn("[Agentation] Failed to sync annotation on reconnect:",ge.reason),Le[_t])),Ne=[...he,...Pe].filter(Eo);ee(Ne),Rl(Je,Ne,_e)}}catch(X){console.warn("[Agentation] Failed to sync on reconnect:",X)}})()},[Tt,k,nt,pt,Je]);const Zl=C.useCallback(()=>{ue||(v(!0),lr(!1),y(!1),Ve(()=>{Bh(!0),ie(!0),v(!1)},400))},[ue]);C.useEffect(()=>{if(!a||!nt||!r||r.length===0||R.length>0)return;const w=[];return w.push(Ve(()=>{y(!0)},i-200)),r.forEach((N,B)=>{const X=i+B*300;w.push(Ve(()=>{const Q=document.querySelector(N.selector);if(!Q)return;const J=Q.getBoundingClientRect(),{name:_e,path:he}=ii(Q),ke={id:`demo-${Date.now()}-${B}`,x:(J.left+J.width/2)/window.innerWidth*100,y:J.top+J.height/2+window.scrollY,comment:N.comment,element:_e,elementPath:he,timestamp:Date.now(),selectedText:N.selectedText,boundingBox:{x:J.left,y:J.top+window.scrollY,width:J.width,height:J.height},nearbyText:Tl(Q),cssClasses:Ll(Q)};ee(Le=>[...Le,ke])},X))}),()=>{w.forEach(clearTimeout)}},[a,nt,r,i]),C.useEffect(()=>{const w=()=>{Xr(window.scrollY),rr(!0),He.current&&clearTimeout(He.current),He.current=Ve(()=>{rr(!1)},150)};return window.addEventListener("scroll",w,{passive:!0}),()=>{window.removeEventListener("scroll",w),He.current&&clearTimeout(He.current)}},[]),C.useEffect(()=>{nt&&R.length>0?pt?Rl(Je,R,pt):vf(Je,R):nt&&R.length===0&&localStorage.removeItem(ai(Je))},[R,Je,nt,pt]);const ol=C.useCallback(()=>{Pt||(Ph(),so(!0))},[Pt]),Fo=C.useCallback(()=>{Pt&&(Gd(),so(!1))},[Pt]),Do=C.useCallback(()=>{Pt?Fo():ol()},[Pt,ol,Fo]),Ao=C.useCallback(()=>{if(ut.length===0)return;const w=ut[0],N=w.element,B=ut.length>1,X=ut.map(Q=>Q.element.getBoundingClientRect());if(B){const Q={left:Math.min(...X.map(ge=>ge.left)),top:Math.min(...X.map(ge=>ge.top)),right:Math.max(...X.map(ge=>ge.right)),bottom:Math.max(...X.map(ge=>ge.bottom))},J=ut.slice(0,5).map(ge=>ge.name).join(", "),_e=ut.length>5?` +${ut.length-5} more`:"",he=X.map(ge=>({x:ge.left,y:ge.top+window.scrollY,width:ge.width,height:ge.height})),Le=ut[ut.length-1].element,Ce=X[X.length-1],Pe=Ce.left+Ce.width/2,Se=Ce.top+Ce.height/2,Ne=tu(Le);Y({x:Pe/window.innerWidth*100,y:Ne?Se:Se+window.scrollY,clientY:Se,element:`${ut.length} elements: ${J}${_e}`,elementPath:"multi-select",boundingBox:{x:Q.left,y:Q.top+window.scrollY,width:Q.right-Q.left,height:Q.bottom-Q.top},isMultiSelect:!0,isFixed:Ne,elementBoundingBoxes:he,multiSelectElements:ut.map(ge=>ge.element),targetElement:Le,fullPath:ei(N),accessibility:qs(N),computedStyles:Js(N),computedStylesObj:Zs(N),nearbyElements:Ks(N),cssClasses:Ll(N),nearbyText:Tl(N),sourceFile:oi(N)})}else{const Q=X[0],J=tu(N);Y({x:Q.left/window.innerWidth*100,y:J?Q.top:Q.top+window.scrollY,clientY:Q.top,element:w.name,elementPath:w.path,boundingBox:{x:Q.left,y:J?Q.top:Q.top+window.scrollY,width:Q.width,height:Q.height},isFixed:J,fullPath:ei(N),accessibility:qs(N),computedStyles:Js(N),computedStylesObj:Zs(N),nearbyElements:Ks(N),cssClasses:Ll(N),nearbyText:Tl(N),reactComponents:w.reactComponents,sourceFile:oi(N)})}Xn([]),ze(null)},[ut]);C.useEffect(()=>{_||(Y(null),Yn(null),It(null),Nn([]),ze(null),lr(!1),Xn([]),qt.current={cmd:!1,shift:!1},Pt&&Fo())},[_,Pt,Fo]),C.useEffect(()=>()=>{Gd()},[]),C.useEffect(()=>{if(!_)return;const w=document.createElement("style");return w.id="feedback-cursor-styles",w.textContent=`
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
    `,document.head.appendChild(w),()=>{const N=document.getElementById("feedback-cursor-styles");N&&N.remove()}},[_]),C.useEffect(()=>{if(!_||M)return;const w=N=>{const B=N.composedPath()[0]||N.target;if(Jt(B,"[data-feedback-toolbar]")){ze(null);return}const X=Wr(N.clientX,N.clientY);if(!X||Jt(X,"[data-feedback-toolbar]")){ze(null);return}const{name:Q,elementName:J,path:_e,reactComponents:he}=eu(X,gn),ke=X.getBoundingClientRect();ze({element:Q,elementName:J,elementPath:_e,rect:ke,reactComponents:he}),W({x:N.clientX,y:N.clientY})};return document.addEventListener("mousemove",w),()=>document.removeEventListener("mousemove",w)},[_,M,gn]),C.useEffect(()=>{if(!_)return;const w=N=>{var gt,on;if(mr.current){mr.current=!1;return}const B=N.composedPath()[0]||N.target;if(Jt(B,"[data-feedback-toolbar]")||Jt(B,"[data-annotation-popup]")||Jt(B,"[data-annotation-marker]"))return;if(N.metaKey&&N.shiftKey&&!M&&!Fe){N.preventDefault(),N.stopPropagation();const st=Wr(N.clientX,N.clientY);if(!st)return;const ft=st.getBoundingClientRect(),{name:Ae,path:Be,reactComponents:Mt}=eu(st,gn),it=ut.findIndex(Ht=>Ht.element===st);it>=0?Xn(Ht=>Ht.filter((Ut,xr)=>xr!==it)):Xn(Ht=>[...Ht,{element:st,rect:ft,name:Ae,path:Be,reactComponents:Mt??void 0}]);return}const X=Jt(B,"button, a, input, select, textarea, [role='button'], [onclick]");if(ce.blockInteractions&&X&&(N.preventDefault(),N.stopPropagation()),M){if(X&&!ce.blockInteractions)return;N.preventDefault(),(gt=Kl.current)==null||gt.shake();return}if(Fe){if(X&&!ce.blockInteractions)return;N.preventDefault(),(on=pr.current)==null||on.shake();return}N.preventDefault();const Q=Wr(N.clientX,N.clientY);if(!Q)return;const{name:J,path:_e,reactComponents:he}=eu(Q,gn),ke=Q.getBoundingClientRect(),Le=N.clientX/window.innerWidth*100,Ce=tu(Q),Pe=Ce?N.clientY:N.clientY+window.scrollY,Se=window.getSelection();let Ne;Se&&Se.toString().trim().length>0&&(Ne=Se.toString().trim().slice(0,500));const ge=Zs(Q),_t=Js(Q);Y({x:Le,y:Pe,clientY:N.clientY,element:J,elementPath:_e,selectedText:Ne,boundingBox:{x:ke.left,y:Ce?ke.top:ke.top+window.scrollY,width:ke.width,height:ke.height},nearbyText:Tl(Q),cssClasses:Ll(Q),isFixed:Ce,fullPath:ei(Q),accessibility:qs(Q),computedStyles:_t,computedStylesObj:ge,nearbyElements:Ks(Q),reactComponents:he??void 0,sourceFile:oi(Q),targetElement:Q}),ze(null)};return document.addEventListener("click",w,!0),()=>document.removeEventListener("click",w,!0)},[_,M,Fe,ce.blockInteractions,gn,ut]),C.useEffect(()=>{if(!_)return;const w=X=>{X.key==="Meta"&&(qt.current.cmd=!0),X.key==="Shift"&&(qt.current.shift=!0)},N=X=>{const Q=qt.current.cmd&&qt.current.shift;X.key==="Meta"&&(qt.current.cmd=!1),X.key==="Shift"&&(qt.current.shift=!1);const J=qt.current.cmd&&qt.current.shift;Q&&!J&&ut.length>0&&Ao()},B=()=>{qt.current={cmd:!1,shift:!1},Xn([])};return document.addEventListener("keydown",w),document.addEventListener("keyup",N),window.addEventListener("blur",B),()=>{document.removeEventListener("keydown",w),document.removeEventListener("keyup",N),window.removeEventListener("blur",B)}},[_,ut,Ao]),C.useEffect(()=>{if(!_||M)return;const w=N=>{const B=N.composedPath()[0]||N.target;Jt(B,"[data-feedback-toolbar]")||Jt(B,"[data-annotation-marker]")||Jt(B,"[data-annotation-popup]")||new Set(["P","SPAN","H1","H2","H3","H4","H5","H6","LI","TD","TH","LABEL","BLOCKQUOTE","FIGCAPTION","CAPTION","LEGEND","DT","DD","PRE","CODE","EM","STRONG","B","I","U","S","A","TIME","ADDRESS","CITE","Q","ABBR","DFN","MARK","SMALL","SUB","SUP"]).has(B.tagName)||B.isContentEditable||(xn.current={x:N.clientX,y:N.clientY})};return document.addEventListener("mousedown",w),()=>document.removeEventListener("mousedown",w)},[_,M]),C.useEffect(()=>{if(!_||M)return;const w=N=>{if(!xn.current)return;const B=N.clientX-xn.current.x,X=N.clientY-xn.current.y,Q=B*B+X*X,J=zo*zo;if(!yn&&Q>=J&&(At.current=xn.current,Ql(!0)),(yn||Q>=J)&&At.current){if(vn.current){const Ae=Math.min(At.current.x,N.clientX),Be=Math.min(At.current.y,N.clientY),Mt=Math.abs(N.clientX-At.current.x),it=Math.abs(N.clientY-At.current.y);vn.current.style.transform=`translate(${Ae}px, ${Be}px)`,vn.current.style.width=`${Mt}px`,vn.current.style.height=`${it}px`}const _e=Date.now();if(_e-Gl.current<Oo)return;Gl.current=_e;const he=At.current.x,ke=At.current.y,Le=Math.min(he,N.clientX),Ce=Math.min(ke,N.clientY),Pe=Math.max(he,N.clientX),Se=Math.max(ke,N.clientY),Ne=(Le+Pe)/2,ge=(Ce+Se)/2,_t=new Set,gt=[[Le,Ce],[Pe,Ce],[Le,Se],[Pe,Se],[Ne,ge],[Ne,Ce],[Ne,Se],[Le,ge],[Pe,ge]];for(const[Ae,Be]of gt){const Mt=document.elementsFromPoint(Ae,Be);for(const it of Mt)it instanceof HTMLElement&&_t.add(it)}const on=document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav");for(const Ae of on)if(Ae instanceof HTMLElement){const Be=Ae.getBoundingClientRect(),Mt=Be.left+Be.width/2,it=Be.top+Be.height/2,Ht=Mt>=Le&&Mt<=Pe&&it>=Ce&&it<=Se,Ut=Math.min(Be.right,Pe)-Math.max(Be.left,Le),xr=Math.min(Be.bottom,Se)-Math.max(Be.top,Ce),mi=Ut>0&&xr>0?Ut*xr:0,es=Be.width*Be.height,pi=es>0?mi/es:0;(Ht||pi>.5)&&_t.add(Ae)}const st=[],ft=new Set(["BUTTON","A","INPUT","IMG","P","H1","H2","H3","H4","H5","H6","LI","LABEL","TD","TH","SECTION","ARTICLE","ASIDE","NAV"]);for(const Ae of _t){if(Jt(Ae,"[data-feedback-toolbar]")||Jt(Ae,"[data-annotation-marker]"))continue;const Be=Ae.getBoundingClientRect();if(!(Be.width>window.innerWidth*.8&&Be.height>window.innerHeight*.5)&&!(Be.width<10||Be.height<10)&&Be.left<Pe&&Be.right>Le&&Be.top<Se&&Be.bottom>Ce){const Mt=Ae.tagName;let it=ft.has(Mt);if(!it&&(Mt==="DIV"||Mt==="SPAN")){const Ht=Ae.textContent&&Ae.textContent.trim().length>0,Ut=Ae.onclick!==null||Ae.getAttribute("role")==="button"||Ae.getAttribute("role")==="link"||Ae.classList.contains("clickable")||Ae.hasAttribute("data-clickable");(Ht||Ut)&&!Ae.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")&&(it=!0)}if(it){let Ht=!1;for(const Ut of st)if(Ut.left<=Be.left&&Ut.right>=Be.right&&Ut.top<=Be.top&&Ut.bottom>=Be.bottom){Ht=!0;break}Ht||st.push(Be)}}}if(Rn.current){const Ae=Rn.current;for(;Ae.children.length>st.length;)Ae.removeChild(Ae.lastChild);st.forEach((Be,Mt)=>{let it=Ae.children[Mt];it||(it=document.createElement("div"),it.className=S.selectedElementHighlight,Ae.appendChild(it)),it.style.transform=`translate(${Be.left}px, ${Be.top}px)`,it.style.width=`${Be.width}px`,it.style.height=`${Be.height}px`})}}};return document.addEventListener("mousemove",w,{passive:!0}),()=>document.removeEventListener("mousemove",w)},[_,M,yn,zo]),C.useEffect(()=>{if(!_)return;const w=N=>{const B=yn,X=At.current;if(yn&&X){mr.current=!0;const Q=Math.min(X.x,N.clientX),J=Math.min(X.y,N.clientY),_e=Math.max(X.x,N.clientX),he=Math.max(X.y,N.clientY),ke=[];document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th").forEach(Ne=>{if(!(Ne instanceof HTMLElement)||Jt(Ne,"[data-feedback-toolbar]")||Jt(Ne,"[data-annotation-marker]"))return;const ge=Ne.getBoundingClientRect();ge.width>window.innerWidth*.8&&ge.height>window.innerHeight*.5||ge.width<10||ge.height<10||ge.left<_e&&ge.right>Q&&ge.top<he&&ge.bottom>J&&ke.push({element:Ne,rect:ge})});const Ce=ke.filter(({element:Ne})=>!ke.some(({element:ge})=>ge!==Ne&&Ne.contains(ge))),Pe=N.clientX/window.innerWidth*100,Se=N.clientY+window.scrollY;if(Ce.length>0){const Ne=Ce.reduce((ft,{rect:Ae})=>({left:Math.min(ft.left,Ae.left),top:Math.min(ft.top,Ae.top),right:Math.max(ft.right,Ae.right),bottom:Math.max(ft.bottom,Ae.bottom)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0}),ge=Ce.slice(0,5).map(({element:ft})=>ii(ft).name).join(", "),_t=Ce.length>5?` +${Ce.length-5} more`:"",gt=Ce[0].element,on=Zs(gt),st=Js(gt);Y({x:Pe,y:Se,clientY:N.clientY,element:`${Ce.length} elements: ${ge}${_t}`,elementPath:"multi-select",boundingBox:{x:Ne.left,y:Ne.top+window.scrollY,width:Ne.right-Ne.left,height:Ne.bottom-Ne.top},isMultiSelect:!0,fullPath:ei(gt),accessibility:qs(gt),computedStyles:st,computedStylesObj:on,nearbyElements:Ks(gt),cssClasses:Ll(gt),nearbyText:Tl(gt),sourceFile:oi(gt)})}else{const Ne=Math.abs(_e-Q),ge=Math.abs(he-J);Ne>20&&ge>20&&Y({x:Pe,y:Se,clientY:N.clientY,element:"Area selection",elementPath:`region at (${Math.round(Q)}, ${Math.round(J)})`,boundingBox:{x:Q,y:J+window.scrollY,width:Ne,height:ge},isMultiSelect:!0})}ze(null)}else B&&(mr.current=!0);xn.current=null,At.current=null,Ql(!1),Rn.current&&(Rn.current.innerHTML="")};return document.addEventListener("mouseup",w),()=>document.removeEventListener("mouseup",w)},[_,yn]);const bt=C.useCallback(async(w,N,B)=>{const X=ce.webhookUrl||E;if(!X||!ce.webhooksEnabled&&!B)return!1;try{return(await fetch(X,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:w,timestamp:Date.now(),url:typeof window<"u"?window.location.href:void 0,...N})})).ok}catch(Q){return console.warn("[Agentation] Webhook failed:",Q),!1}},[E,ce.webhookUrl,ce.webhooksEnabled]),In=C.useCallback(w=>{var B;if(!M)return;const N={id:Date.now().toString(),x:M.x,y:M.y,comment:w,element:M.element,elementPath:M.elementPath,timestamp:Date.now(),selectedText:M.selectedText,boundingBox:M.boundingBox,nearbyText:M.nearbyText,cssClasses:M.cssClasses,isMultiSelect:M.isMultiSelect,isFixed:M.isFixed,fullPath:M.fullPath,accessibility:M.accessibility,computedStyles:M.computedStyles,nearbyElements:M.nearbyElements,reactComponents:M.reactComponents,sourceFile:M.sourceFile,elementBoundingBoxes:M.elementBoundingBoxes,...k&&pt?{sessionId:pt,url:typeof window<"u"?window.location.href:void 0,status:"pending"}:{}};ee(X=>[...X,N]),uo.current=N.id,Ve(()=>{uo.current=null},300),Ve(()=>{Mo(X=>new Set(X).add(N.id))},250),c==null||c(N),bt("annotation.add",{annotation:N}),fr(!0),Ve(()=>{Y(null),fr(!1)},150),(B=window.getSelection())==null||B.removeAllRanges(),k&&pt&&ti(k,pt,N).then(X=>{X.id!==N.id&&(ee(Q=>Q.map(J=>J.id===N.id?{...J,id:X.id}:J)),Mo(Q=>{const J=new Set(Q);return J.delete(N.id),J.add(X.id),J}))}).catch(X=>{console.warn("[Agentation] Failed to sync annotation:",X)})},[M,c,bt,k,pt]),$n=C.useCallback(()=>{fr(!0),Ve(()=>{Y(null),fr(!1)},150)},[]),Gn=C.useCallback(w=>{const N=R.findIndex(X=>X.id===w),B=R[N];(Fe==null?void 0:Fe.id)===w&&(ao(!0),Ve(()=>{Yn(null),It(null),Nn([]),ao(!1)},150)),Vr(w),Qn(X=>new Set(X).add(w)),B&&(p==null||p(B),bt("annotation.delete",{annotation:B})),k&&Jd(k,w).catch(X=>{console.warn("[Agentation] Failed to delete annotation from server:",X)}),Ve(()=>{ee(X=>X.filter(Q=>Q.id!==w)),Qn(X=>{const Q=new Set(X);return Q.delete(w),Q}),Vr(null),N<R.length-1&&(nr(N),Ve(()=>nr(null),200))},150)},[R,Fe,p,bt,k]),Mn=C.useCallback(w=>{var N;if(Yn(w),Ue(null),an(null),En([]),(N=w.elementBoundingBoxes)!=null&&N.length){const B=[];for(const X of w.elementBoundingBoxes){const Q=X.x+X.width/2,J=X.y+X.height/2-window.scrollY,_e=Wr(Q,J);_e&&B.push(_e)}Nn(B),It(null)}else if(w.boundingBox){const B=w.boundingBox,X=B.x+B.width/2,Q=w.isFixed?B.y+B.height/2:B.y+B.height/2-window.scrollY,J=Wr(X,Q);if(J){const _e=J.getBoundingClientRect(),he=_e.width/B.width,ke=_e.height/B.height;he<.5||ke<.5?It(null):It(J)}else It(null);Nn([])}else It(null),Nn([])},[]),tn=C.useCallback(w=>{var N;if(!w){Ue(null),an(null),En([]);return}if(Ue(w.id),(N=w.elementBoundingBoxes)!=null&&N.length){const B=[];for(const X of w.elementBoundingBoxes){const Q=X.x+X.width/2,J=X.y+X.height/2-window.scrollY,he=document.elementsFromPoint(Q,J).find(ke=>!ke.closest("[data-annotation-marker]")&&!ke.closest("[data-agentation-root]"));he&&B.push(he)}En(B),an(null)}else if(w.boundingBox){const B=w.boundingBox,X=B.x+B.width/2,Q=w.isFixed?B.y+B.height/2:B.y+B.height/2-window.scrollY,J=Wr(X,Q);if(J){const _e=J.getBoundingClientRect(),he=_e.width/B.width,ke=_e.height/B.height;he<.5||ke<.5?an(null):an(J)}else an(null);En([])}else an(null),En([])},[]),fi=C.useCallback(w=>{if(!Fe)return;const N={...Fe,comment:w};ee(B=>B.map(X=>X.id===Fe.id?N:X)),h==null||h(N),bt("annotation.update",{annotation:N}),k&&Wh(k,Fe.id,{comment:w}).catch(B=>{console.warn("[Agentation] Failed to update annotation on server:",B)}),ao(!0),Ve(()=>{Yn(null),It(null),Nn([]),ao(!1)},150)},[Fe,h,bt,k]),Jl=C.useCallback(()=>{ao(!0),Ve(()=>{Yn(null),It(null),Nn([]),ao(!1)},150)},[]),nn=C.useCallback(()=>{const w=R.length;if(w===0)return;m==null||m(R),bt("annotations.clear",{annotations:R}),k&&Promise.all(R.map(B=>Jd(k,B.id).catch(X=>{console.warn("[Agentation] Failed to delete annotation from server:",X)}))),Ie(!0),H(!0);const N=w*30+200;Ve(()=>{ee([]),Mo(new Set),localStorage.removeItem(ai(Je)),Ie(!1)},N),Ve(()=>H(!1),1500)},[Je,R,m,bt,k]),rl=C.useCallback(async()=>{const w=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Je,N=of(R,w,ce.outputDetail,gn);if(N){if($)try{await navigator.clipboard.writeText(N)}catch{}x==null||x(N),L(!0),Ve(()=>L(!1),2e3),ce.autoClearAfterCopy&&Ve(()=>nn(),500)}},[R,Je,ce.outputDetail,gn,ce.autoClearAfterCopy,nn,$,x]),_r=C.useCallback(async()=>{const w=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Je,N=of(R,w,ce.outputDetail,gn);if(!N)return;f&&f(N,R),ae("sending"),await new Promise(X=>Ve(X,150));const B=await bt("submit",{output:N,annotations:R},!0);ae(B?"sent":"failed"),Ve(()=>ae("idle"),2500),B&&ce.autoClearAfterCopy&&Ve(()=>nn(),500)},[f,bt,R,Je,ce.outputDetail,gn,ce.autoClearAfterCopy,nn]);C.useEffect(()=>{if(!io)return;const w=10,N=X=>{const Q=X.clientX-io.x,J=X.clientY-io.y,_e=Math.sqrt(Q*Q+J*J);if(!cn&&_e>w&&Xl(!0),cn||_e>w){let he=io.toolbarX+Q,ke=io.toolbarY+J;const Le=20,Ce=297,Pe=44,Ne=Ce-(_?Tt==="connected"?297:257:44),ge=Le-Ne,_t=window.innerWidth-Le-Ce;he=Math.max(ge,Math.min(_t,he)),ke=Math.max(Le,Math.min(window.innerHeight-Pe-Le,ke)),cr({x:he,y:ke})}},B=()=>{cn&&(dr.current=!0),Xl(!1),lt(null)};return document.addEventListener("mousemove",N),document.addEventListener("mouseup",B),()=>{document.removeEventListener("mousemove",N),document.removeEventListener("mouseup",B)}},[io,cn,_,Tt]);const gr=C.useCallback(w=>{if(w.target.closest("button")||w.target.closest(`.${S.settingsPanel}`))return;const N=w.currentTarget.parentElement;if(!N)return;const B=N.getBoundingClientRect(),X=(Ze==null?void 0:Ze.x)??B.left,Q=(Ze==null?void 0:Ze.y)??B.top,J=(Math.random()-.5)*10;qr(J),lt({x:w.clientX,y:w.clientY,toolbarX:X,toolbarY:Q})},[Ze]);if(C.useEffect(()=>{if(!Ze)return;const w=()=>{let Q=Ze.x,J=Ze.y;const ke=20-(297-(_?Tt==="connected"?297:257:44)),Le=window.innerWidth-20-297;Q=Math.max(ke,Math.min(Le,Q)),J=Math.max(20,Math.min(window.innerHeight-44-20,J)),(Q!==Ze.x||J!==Ze.y)&&cr({x:Q,y:J})};return w(),window.addEventListener("resize",w),()=>window.removeEventListener("resize",w)},[Ze,_,Tt]),C.useEffect(()=>{const w=N=>{const B=N.target,X=B.tagName==="INPUT"||B.tagName==="TEXTAREA"||B.isContentEditable;if(N.key==="Escape"){if(ut.length>0){Xn([]);return}M||_&&(Ct(),y(!1))}if((N.metaKey||N.ctrlKey)&&N.shiftKey&&(N.key==="f"||N.key==="F")){N.preventDefault(),Ct(),y(Q=>!Q);return}if(!(X||N.metaKey||N.ctrlKey)&&((N.key==="p"||N.key==="P")&&(N.preventDefault(),Ct(),Do()),(N.key==="h"||N.key==="H")&&R.length>0&&(N.preventDefault(),Ct(),se(Q=>!Q)),(N.key==="c"||N.key==="C")&&R.length>0&&(N.preventDefault(),Ct(),rl()),(N.key==="x"||N.key==="X")&&R.length>0&&(N.preventDefault(),Ct(),nn()),N.key==="s"||N.key==="S")){const Q=Bn(ce.webhookUrl)||Bn(E||"");R.length>0&&Q&&D==="idle"&&(N.preventDefault(),Ct(),_r())}};return document.addEventListener("keydown",w),()=>document.removeEventListener("keydown",w)},[_,M,R.length,ce.webhookUrl,E,D,_r,Do,rl,nn,ut]),!nt||re)return null;const Kn=R.length>0,yr=R.filter(w=>!el.has(w.id)&&Eo(w)),co=R.filter(w=>el.has(w.id)),fo=w=>{const J=w.x/100*window.innerWidth,_e=typeof w.y=="string"?parseFloat(w.y):w.y,he={};window.innerHeight-_e-22-10<80&&(he.top="auto",he.bottom="calc(100% + 10px)");const Le=J-200/2,Ce=10;if(Le<Ce){const Pe=Ce-Le;he.left=`calc(50% + ${Pe}px)`}else if(Le+200>window.innerWidth-Ce){const Pe=Le+200-(window.innerWidth-Ce);he.left=`calc(50% - ${Pe}px)`}return he};return Vd.createPortal(l.jsxs("div",{ref:G,style:{display:"contents"},children:[l.jsx("div",{className:`${S.toolbar}${b?` ${b}`:""}`,"data-feedback-toolbar":!0,style:Ze?{left:Ze.x,top:Ze.y,right:"auto",bottom:"auto"}:void 0,children:l.jsxs("div",{className:`${S.toolbarContainer} ${$e?"":S.light} ${_?S.expanded:S.collapsed} ${ar?S.entrance:""} ${ue?S.hiding:""} ${cn?S.dragging:""} ${!ce.webhooksEnabled&&(Bn(ce.webhookUrl)||Bn(E||""))?S.serverConnected:""}`,onClick:_?void 0:w=>{if(dr.current){dr.current=!1,w.preventDefault();return}y(!0)},onMouseDown:gr,role:_?void 0:"button",tabIndex:_?-1:0,title:_?void 0:"Start feedback mode",style:{...cn&&{transform:`scale(1.05) rotate(${di}deg)`,cursor:"grabbing"}},children:[l.jsxs("div",{className:`${S.toggleContent} ${_?S.hidden:S.visible}`,children:[l.jsx(ph,{size:24}),Kn&&l.jsx("span",{className:`${S.badge} ${_?S.fadeOut:""} ${ar?S.entrance:""}`,style:{backgroundColor:ce.annotationColor},children:R.length})]}),l.jsxs("div",{className:`${S.controlsContent} ${_?S.visible:S.hidden} ${Ze&&Ze.y<100?S.tooltipBelow:""} ${Gr||Po?S.tooltipsHidden:""} ${Un?S.tooltipsInSession:""}`,onMouseEnter:Ro,onMouseLeave:Zr,children:[l.jsxs("div",{className:`${S.buttonWrapper} ${Ze&&Ze.x<120?S.buttonWrapperAlignLeft:""}`,children:[l.jsx("button",{className:`${S.controlButton} ${$e?"":S.light}`,onClick:w=>{w.stopPropagation(),Ct(),Do()},"data-active":Pt,children:l.jsx(yh,{size:24,isPaused:Pt})}),l.jsxs("span",{className:S.buttonTooltip,children:[Pt?"Resume animations":"Pause animations",l.jsx("span",{className:S.shortcut,children:"P"})]})]}),l.jsxs("div",{className:S.buttonWrapper,children:[l.jsx("button",{className:`${S.controlButton} ${$e?"":S.light}`,onClick:w=>{w.stopPropagation(),Ct(),se(!ne)},disabled:!Kn,children:l.jsx(gh,{size:24,isOpen:ne})}),l.jsxs("span",{className:S.buttonTooltip,children:[ne?"Hide markers":"Show markers",l.jsx("span",{className:S.shortcut,children:"H"})]})]}),l.jsxs("div",{className:S.buttonWrapper,children:[l.jsx("button",{className:`${S.controlButton} ${$e?"":S.light} ${U?S.statusShowing:""}`,onClick:w=>{w.stopPropagation(),Ct(),rl()},disabled:!Kn,"data-active":U,children:l.jsx(hh,{size:24,copied:U})}),l.jsxs("span",{className:S.buttonTooltip,children:["Copy feedback",l.jsx("span",{className:S.shortcut,children:"C"})]})]}),l.jsxs("div",{className:`${S.buttonWrapper} ${S.sendButtonWrapper} ${_&&!ce.webhooksEnabled&&(Bn(ce.webhookUrl)||Bn(E||""))?S.sendButtonVisible:""}`,children:[l.jsxs("button",{className:`${S.controlButton} ${$e?"":S.light} ${D==="sent"||D==="failed"?S.statusShowing:""}`,onClick:w=>{w.stopPropagation(),Ct(),_r()},disabled:!Kn||!Bn(ce.webhookUrl)&&!Bn(E||"")||D==="sending","data-no-hover":D==="sent"||D==="failed",tabIndex:Bn(ce.webhookUrl)||Bn(E||"")?0:-1,children:[l.jsx(_h,{size:24,state:D}),Kn&&D==="idle"&&l.jsx("span",{className:`${S.buttonBadge} ${$e?"":S.light}`,style:{backgroundColor:ce.annotationColor},children:R.length})]}),l.jsxs("span",{className:S.buttonTooltip,children:["Send Annotations",l.jsx("span",{className:S.shortcut,children:"S"})]})]}),l.jsxs("div",{className:S.buttonWrapper,children:[l.jsx("button",{className:`${S.controlButton} ${$e?"":S.light}`,onClick:w=>{w.stopPropagation(),Ct(),nn()},disabled:!Kn,"data-danger":!0,children:l.jsx(vh,{size:24})}),l.jsxs("span",{className:S.buttonTooltip,children:["Clear all",l.jsx("span",{className:S.shortcut,children:"X"})]})]}),l.jsxs("div",{className:S.buttonWrapper,children:[l.jsx("button",{className:`${S.controlButton} ${$e?"":S.light}`,onClick:w=>{w.stopPropagation(),Ct(),lr(!Po)},children:l.jsx(xh,{size:24})}),k&&Tt!=="disconnected"&&l.jsx("span",{className:`${S.mcpIndicator} ${$e?"":S.light} ${S[Tt]} ${Po?S.hidden:""}`,title:Tt==="connected"?"MCP Connected":"MCP Connecting..."}),l.jsx("span",{className:S.buttonTooltip,children:"Settings"})]}),l.jsx("div",{className:`${S.divider} ${$e?"":S.light}`}),l.jsxs("div",{className:`${S.buttonWrapper} ${Ze&&typeof window<"u"&&Ze.x>window.innerWidth-120?S.buttonWrapperAlignRight:""}`,children:[l.jsx("button",{className:`${S.controlButton} ${$e?"":S.light}`,onClick:w=>{w.stopPropagation(),Ct(),y(!1)},children:l.jsx(bh,{size:24})}),l.jsxs("span",{className:S.buttonTooltip,children:["Exit",l.jsx("span",{className:S.shortcut,children:"Esc"})]})]})]}),l.jsx("div",{className:`${S.settingsPanel} ${$e?S.dark:S.light} ${Wl?S.enter:S.exit}`,onClick:w=>w.stopPropagation(),style:Ze&&Ze.y<230?{bottom:"auto",top:"calc(100% + 0.5rem)"}:void 0,children:l.jsxs("div",{className:`${S.settingsPanelContainer} ${sr?S.transitioning:""}`,children:[l.jsxs("div",{className:`${S.settingsPage} ${To==="automations"?S.slideLeft:""}`,children:[l.jsxs("div",{className:S.settingsHeader,children:[l.jsxs("span",{className:S.settingsBrand,children:[l.jsx("span",{className:S.settingsBrandSlash,style:{color:ce.annotationColor,transition:"color 0.2s ease"},children:"/"}),"agentation"]}),l.jsxs("span",{className:S.settingsVersion,children:["v","2.3.1"]}),l.jsx("button",{className:S.themeToggle,onClick:()=>Io(!$e),title:$e?"Switch to light mode":"Switch to dark mode",children:l.jsx("span",{className:S.themeIconWrapper,children:l.jsx("span",{className:S.themeIcon,children:$e?l.jsx(wh,{size:20}):l.jsx(kh,{size:20})},$e?"sun":"moon")})})]}),l.jsxs("div",{className:S.settingsSection,children:[l.jsxs("div",{className:S.settingsRow,children:[l.jsxs("div",{className:`${S.settingsLabel} ${$e?"":S.light}`,children:["Output Detail",l.jsx(un,{content:"Controls how much detail is included in the copied output",children:l.jsx("span",{className:S.helpIcon,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("button",{className:`${S.cycleButton} ${$e?"":S.light}`,onClick:()=>{const N=(Ml.findIndex(B=>B.value===ce.outputDetail)+1)%Ml.length;Yt(B=>({...B,outputDetail:Ml[N].value}))},children:[l.jsx("span",{className:S.cycleButtonText,children:(Zn=Ml.find(w=>w.value===ce.outputDetail))==null?void 0:Zn.label},ce.outputDetail),l.jsx("span",{className:S.cycleDots,children:Ml.map((w,N)=>l.jsx("span",{className:`${S.cycleDot} ${$e?"":S.light} ${ce.outputDetail===w.value?S.active:""}`},w.value))})]})]}),l.jsxs("div",{className:`${S.settingsRow} ${S.settingsRowMarginTop} ${S.settingsRowDisabled}`,children:[l.jsxs("div",{className:`${S.settingsLabel} ${$e?"":S.light}`,children:["React Components",l.jsx(un,{content:"Disabled — production builds minify component names, making detection unreliable. Use in development mode.",children:l.jsx("span",{className:S.helpIcon,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("label",{className:`${S.toggleSwitch} ${S.disabled}`,children:[l.jsx("input",{type:"checkbox",checked:Vl,disabled:!Vl,onChange:()=>Yt(w=>({...w,reactEnabled:!w.reactEnabled}))}),l.jsx("span",{className:S.toggleSlider})]})]}),l.jsxs("div",{className:`${S.settingsRow} ${S.settingsRowMarginTop}`,children:[l.jsxs("div",{className:`${S.settingsLabel} ${$e?"":S.light}`,children:["Hide Until Restart",l.jsx(un,{content:"Hides the toolbar until you open a new tab",children:l.jsx("span",{className:S.helpIcon,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("label",{className:S.toggleSwitch,children:[l.jsx("input",{type:"checkbox",checked:!1,onChange:w=>{w.target.checked&&Zl()}}),l.jsx("span",{className:S.toggleSlider})]})]})]}),l.jsxs("div",{className:S.settingsSection,children:[l.jsx("div",{className:`${S.settingsLabel} ${S.settingsLabelMarker} ${$e?"":S.light}`,children:"Marker Colour"}),l.jsx("div",{className:S.colorOptions,children:h_.map(w=>l.jsx("div",{role:"button",onClick:()=>Yt(N=>({...N,annotationColor:w.value})),style:{borderColor:ce.annotationColor===w.value?w.value:"transparent"},className:`${S.colorOptionRing} ${ce.annotationColor===w.value?S.selected:""}`,children:l.jsx("div",{className:`${S.colorOption} ${ce.annotationColor===w.value?S.selected:""}`,style:{backgroundColor:w.value},title:w.label})},w.value))})]}),l.jsxs("div",{className:S.settingsSection,children:[l.jsxs("label",{className:S.settingsToggle,children:[l.jsx("input",{type:"checkbox",id:"autoClearAfterCopy",checked:ce.autoClearAfterCopy,onChange:w=>Yt(N=>({...N,autoClearAfterCopy:w.target.checked}))}),l.jsx("label",{className:`${S.customCheckbox} ${ce.autoClearAfterCopy?S.checked:""}`,htmlFor:"autoClearAfterCopy",children:ce.autoClearAfterCopy&&l.jsx(Xd,{size:14})}),l.jsxs("span",{className:`${S.toggleLabel} ${$e?"":S.light}`,children:["Clear on copy/send",l.jsx(un,{content:"Automatically clear annotations after copying",children:l.jsx("span",{className:`${S.helpIcon} ${S.helpIconNudge2}`,children:l.jsx(Ar,{size:20})})})]})]}),l.jsxs("label",{className:`${S.settingsToggle} ${S.settingsToggleMarginBottom}`,children:[l.jsx("input",{type:"checkbox",id:"blockInteractions",checked:ce.blockInteractions,onChange:w=>Yt(N=>({...N,blockInteractions:w.target.checked}))}),l.jsx("label",{className:`${S.customCheckbox} ${ce.blockInteractions?S.checked:""}`,htmlFor:"blockInteractions",children:ce.blockInteractions&&l.jsx(Xd,{size:14})}),l.jsx("span",{className:`${S.toggleLabel} ${$e?"":S.light}`,children:"Block page interactions"})]})]}),l.jsx("div",{className:`${S.settingsSection} ${S.settingsSectionExtraPadding}`,children:l.jsxs("button",{className:`${S.settingsNavLink} ${$e?"":S.light}`,onClick:()=>Lo("automations"),children:[l.jsx("span",{children:"Manage MCP & Webhooks"}),l.jsxs("span",{className:S.settingsNavLinkRight,children:[k&&Tt!=="disconnected"&&l.jsx("span",{className:`${S.mcpNavIndicator} ${S[Tt]}`}),l.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M7.5 12.5L12 8L7.5 3.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]})]})})]}),l.jsxs("div",{className:`${S.settingsPage} ${S.automationsPage} ${To==="automations"?S.slideIn:""}`,children:[l.jsxs("button",{className:`${S.settingsBackButton} ${$e?"":S.light}`,onClick:()=>Lo("main"),children:[l.jsx(Sh,{size:16}),l.jsx("span",{children:"Manage MCP & Webhooks"})]}),l.jsxs("div",{className:S.settingsSection,children:[l.jsxs("div",{className:S.settingsRow,children:[l.jsxs("span",{className:`${S.automationHeader} ${$e?"":S.light}`,children:["MCP Connection",l.jsx(un,{content:"Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time.",children:l.jsx("span",{className:`${S.helpIcon} ${S.helpIconNudgeDown}`,children:l.jsx(Ar,{size:20})})})]}),k&&l.jsx("div",{className:`${S.mcpStatusDot} ${S[Tt]}`,title:Tt==="connected"?"Connected":Tt==="connecting"?"Connecting...":"Disconnected"})]}),l.jsxs("p",{className:`${S.automationDescription} ${$e?"":S.light}`,style:{paddingBottom:6},children:["MCP connection allows agents to receive and act on annotations."," ",l.jsx("a",{href:"https://agentation.dev/mcp",target:"_blank",rel:"noopener noreferrer",className:`${S.learnMoreLink} ${$e?"":S.light}`,children:"Learn more"})]})]}),l.jsxs("div",{className:`${S.settingsSection} ${S.settingsSectionGrow}`,children:[l.jsxs("div",{className:S.settingsRow,children:[l.jsxs("span",{className:`${S.automationHeader} ${$e?"":S.light}`,children:["Webhooks",l.jsx(un,{content:"Send annotation data to any URL endpoint when annotations change. Useful for custom integrations.",children:l.jsx("span",{className:`${S.helpIcon} ${S.helpIconNoNudge}`,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("div",{className:S.autoSendRow,children:[l.jsx("span",{className:`${S.autoSendLabel} ${$e?"":S.light} ${ce.webhooksEnabled?S.active:""}`,children:"Auto-Send"}),l.jsxs("label",{className:`${S.toggleSwitch} ${ce.webhookUrl?"":S.disabled}`,children:[l.jsx("input",{type:"checkbox",checked:ce.webhooksEnabled,disabled:!ce.webhookUrl,onChange:()=>Yt(w=>({...w,webhooksEnabled:!w.webhooksEnabled}))}),l.jsx("span",{className:S.toggleSlider})]})]})]}),l.jsx("p",{className:`${S.automationDescription} ${$e?"":S.light}`,children:"The webhook URL will receive live annotation changes and annotation data."}),l.jsx("textarea",{className:`${S.webhookUrlInput} ${$e?"":S.light}`,placeholder:"Webhook URL",value:ce.webhookUrl,style:{"--marker-color":ce.annotationColor},onKeyDown:w=>w.stopPropagation(),onChange:w=>Yt(N=>({...N,webhookUrl:w.target.value}))})]})]})]})})]})}),l.jsxs("div",{className:S.markersLayer,"data-feedback-toolbar":!0,children:[fe&&yr.filter(w=>!w.isFixed).map((w,N)=>{const B=!de&&Te===w.id,X=tr===w.id,Q=(B||X)&&!Fe,J=w.isMultiSelect,_e=J?"#34C759":ce.annotationColor,he=R.findIndex(Pe=>Pe.id===w.id),ke=!$o.has(w.id),Le=de?S.exit:ve?S.clearing:ke?S.enter:"",Ce=Q&&ce.markerClickBehavior==="delete";return l.jsxs("div",{className:`${S.marker} ${J?S.multiSelect:""} ${Le} ${Ce?S.hovered:""}`,"data-annotation-marker":!0,style:{left:`${w.x}%`,top:w.y,backgroundColor:Ce?void 0:_e,animationDelay:de?`${(yr.length-1-N)*20}ms`:`${N*20}ms`},onMouseEnter:()=>!de&&w.id!==uo.current&&tn(w),onMouseLeave:()=>tn(null),onClick:Pe=>{Pe.stopPropagation(),de||(ce.markerClickBehavior==="delete"?Gn(w.id):Mn(w))},onContextMenu:Pe=>{ce.markerClickBehavior==="delete"&&(Pe.preventDefault(),Pe.stopPropagation(),de||Mn(w))},children:[Q?Ce?l.jsx(Xa,{size:J?18:16}):l.jsx(Qd,{size:16}):l.jsx("span",{className:No!==null&&he>=No?S.renumber:void 0,children:he+1}),B&&!Fe&&l.jsxs("div",{className:`${S.markerTooltip} ${$e?"":S.light} ${S.enter}`,style:fo(w),children:[l.jsxs("span",{className:S.markerQuote,children:[w.element,w.selectedText&&` "${w.selectedText.slice(0,30)}${w.selectedText.length>30?"...":""}"`]}),l.jsx("span",{className:S.markerNote,children:w.comment})]})]},w.id)}),fe&&!de&&co.filter(w=>!w.isFixed).map(w=>{const N=w.isMultiSelect;return l.jsx("div",{className:`${S.marker} ${S.hovered} ${N?S.multiSelect:""} ${S.exit}`,"data-annotation-marker":!0,style:{left:`${w.x}%`,top:w.y},children:l.jsx(Xa,{size:N?12:10})},w.id)})]}),l.jsxs("div",{className:S.fixedMarkersLayer,"data-feedback-toolbar":!0,children:[fe&&yr.filter(w=>w.isFixed).map((w,N)=>{const B=yr.filter(Se=>Se.isFixed),X=!de&&Te===w.id,Q=tr===w.id,J=(X||Q)&&!Fe,_e=w.isMultiSelect,he=_e?"#34C759":ce.annotationColor,ke=R.findIndex(Se=>Se.id===w.id),Le=!$o.has(w.id),Ce=de?S.exit:ve?S.clearing:Le?S.enter:"",Pe=J&&ce.markerClickBehavior==="delete";return l.jsxs("div",{className:`${S.marker} ${S.fixed} ${_e?S.multiSelect:""} ${Ce} ${Pe?S.hovered:""}`,"data-annotation-marker":!0,style:{left:`${w.x}%`,top:w.y,backgroundColor:Pe?void 0:he,animationDelay:de?`${(B.length-1-N)*20}ms`:`${N*20}ms`},onMouseEnter:()=>!de&&w.id!==uo.current&&tn(w),onMouseLeave:()=>tn(null),onClick:Se=>{Se.stopPropagation(),de||(ce.markerClickBehavior==="delete"?Gn(w.id):Mn(w))},onContextMenu:Se=>{ce.markerClickBehavior==="delete"&&(Se.preventDefault(),Se.stopPropagation(),de||Mn(w))},children:[J?Pe?l.jsx(Xa,{size:_e?18:16}):l.jsx(Qd,{size:16}):l.jsx("span",{className:No!==null&&ke>=No?S.renumber:void 0,children:ke+1}),X&&!Fe&&l.jsxs("div",{className:`${S.markerTooltip} ${$e?"":S.light} ${S.enter}`,style:fo(w),children:[l.jsxs("span",{className:S.markerQuote,children:[w.element,w.selectedText&&` "${w.selectedText.slice(0,30)}${w.selectedText.length>30?"...":""}"`]}),l.jsx("span",{className:S.markerNote,children:w.comment})]})]},w.id)}),fe&&!de&&co.filter(w=>w.isFixed).map(w=>{const N=w.isMultiSelect;return l.jsx("div",{className:`${S.marker} ${S.fixed} ${S.hovered} ${N?S.multiSelect:""} ${S.exit}`,"data-annotation-marker":!0,style:{left:`${w.x}%`,top:w.y},children:l.jsx(fh,{size:N?12:10})},w.id)})]}),_&&l.jsxs("div",{className:S.overlay,"data-feedback-toolbar":!0,style:M||Fe?{zIndex:99999}:void 0,children:[(Oe==null?void 0:Oe.rect)&&!M&&!Qr&&!yn&&l.jsx("div",{className:`${S.hoverHighlight} ${S.enter}`,style:{left:Oe.rect.left,top:Oe.rect.top,width:Oe.rect.width,height:Oe.rect.height,borderColor:`${ce.annotationColor}80`,backgroundColor:`${ce.annotationColor}0A`}}),ut.filter(w=>document.contains(w.element)).map((w,N)=>{const B=w.element.getBoundingClientRect(),X=ut.length>1;return l.jsx("div",{className:X?S.multiSelectOutline:S.singleSelectOutline,style:{position:"fixed",left:B.left,top:B.top,width:B.width,height:B.height,...X?{}:{borderColor:`${ce.annotationColor}99`,backgroundColor:`${ce.annotationColor}0D`}}},N)}),Te&&!M&&(()=>{var Q;const w=R.find(J=>J.id===Te);if(!(w!=null&&w.boundingBox))return null;if((Q=w.elementBoundingBoxes)!=null&&Q.length)return Ur.length>0?Ur.filter(J=>document.contains(J)).map((J,_e)=>{const he=J.getBoundingClientRect();return l.jsx("div",{className:`${S.multiSelectOutline} ${S.enter}`,style:{left:he.left,top:he.top,width:he.width,height:he.height}},`hover-outline-live-${_e}`)}):w.elementBoundingBoxes.map((J,_e)=>l.jsx("div",{className:`${S.multiSelectOutline} ${S.enter}`,style:{left:J.x,top:J.y-Pn,width:J.width,height:J.height}},`hover-outline-${_e}`));const N=Nt&&document.contains(Nt)?Nt.getBoundingClientRect():null,B=N?{x:N.left,y:N.top,width:N.width,height:N.height}:{x:w.boundingBox.x,y:w.isFixed?w.boundingBox.y:w.boundingBox.y-Pn,width:w.boundingBox.width,height:w.boundingBox.height},X=w.isMultiSelect;return l.jsx("div",{className:`${X?S.multiSelectOutline:S.singleSelectOutline} ${S.enter}`,style:{left:B.x,top:B.y,width:B.width,height:B.height,...X?{}:{borderColor:`${ce.annotationColor}99`,backgroundColor:`${ce.annotationColor}0D`}}})})(),Oe&&!M&&!Qr&&!yn&&l.jsxs("div",{className:`${S.hoverTooltip} ${S.enter}`,style:{left:Math.max(8,Math.min(O.x,window.innerWidth-100)),top:Math.max(O.y-(Oe.reactComponents?48:32),8)},children:[Oe.reactComponents&&l.jsx("div",{className:S.hoverReactPath,children:Oe.reactComponents}),l.jsx("div",{className:S.hoverElementName,children:Oe.elementName})]}),M&&l.jsxs(l.Fragment,{children:[(Bo=M.multiSelectElements)!=null&&Bo.length?M.multiSelectElements.filter(w=>document.contains(w)).map((w,N)=>{const B=w.getBoundingClientRect();return l.jsx("div",{className:`${S.multiSelectOutline} ${$t?S.exit:S.enter}`,style:{left:B.left,top:B.top,width:B.width,height:B.height}},`pending-multi-${N}`)}):M.targetElement&&document.contains(M.targetElement)?(()=>{const w=M.targetElement.getBoundingClientRect();return l.jsx("div",{className:`${S.singleSelectOutline} ${$t?S.exit:S.enter}`,style:{left:w.left,top:w.top,width:w.width,height:w.height,borderColor:`${ce.annotationColor}99`,backgroundColor:`${ce.annotationColor}0D`}})})():M.boundingBox&&l.jsx("div",{className:`${M.isMultiSelect?S.multiSelectOutline:S.singleSelectOutline} ${$t?S.exit:S.enter}`,style:{left:M.boundingBox.x,top:M.boundingBox.y-Pn,width:M.boundingBox.width,height:M.boundingBox.height,...M.isMultiSelect?{}:{borderColor:`${ce.annotationColor}99`,backgroundColor:`${ce.annotationColor}0D`}}}),(()=>{const w=M.x,N=M.isFixed?M.y:M.y-Pn;return l.jsxs(l.Fragment,{children:[l.jsx("div",{className:`${S.marker} ${S.pending} ${M.isMultiSelect?S.multiSelect:""} ${$t?S.exit:S.enter}`,style:{left:`${w}%`,top:N,backgroundColor:M.isMultiSelect?"#34C759":ce.annotationColor},children:l.jsx(mh,{size:12})}),l.jsx(Kd,{ref:Kl,element:M.element,selectedText:M.selectedText,computedStyles:M.computedStylesObj,placeholder:M.element==="Area selection"?"What should change in this area?":M.isMultiSelect?"Feedback for this group of elements...":"What should change?",onSubmit:In,onCancel:$n,isExiting:$t,lightMode:!$e,accentColor:M.isMultiSelect?"#34C759":ce.annotationColor,style:{left:Math.max(160,Math.min(window.innerWidth-160,w/100*window.innerWidth)),...N>window.innerHeight-290?{bottom:window.innerHeight-N+20}:{top:N+20}}})]})})()]}),Fe&&l.jsxs(l.Fragment,{children:[(ql=Fe.elementBoundingBoxes)!=null&&ql.length?or.length>0?or.filter(w=>document.contains(w)).map((w,N)=>{const B=w.getBoundingClientRect();return l.jsx("div",{className:`${S.multiSelectOutline} ${S.enter}`,style:{left:B.left,top:B.top,width:B.width,height:B.height}},`edit-multi-live-${N}`)}):Fe.elementBoundingBoxes.map((w,N)=>l.jsx("div",{className:`${S.multiSelectOutline} ${S.enter}`,style:{left:w.x,top:w.y-Pn,width:w.width,height:w.height}},`edit-multi-${N}`)):(()=>{const w=Hn&&document.contains(Hn)?Hn.getBoundingClientRect():null,N=w?{x:w.left,y:w.top,width:w.width,height:w.height}:Fe.boundingBox?{x:Fe.boundingBox.x,y:Fe.isFixed?Fe.boundingBox.y:Fe.boundingBox.y-Pn,width:Fe.boundingBox.width,height:Fe.boundingBox.height}:null;return N?l.jsx("div",{className:`${Fe.isMultiSelect?S.multiSelectOutline:S.singleSelectOutline} ${S.enter}`,style:{left:N.x,top:N.y,width:N.width,height:N.height,...Fe.isMultiSelect?{}:{borderColor:`${ce.annotationColor}99`,backgroundColor:`${ce.annotationColor}0D`}}}):null})(),l.jsx(Kd,{ref:pr,element:Fe.element,selectedText:Fe.selectedText,computedStyles:zh(Fe.computedStyles),placeholder:"Edit your feedback...",initialValue:Fe.comment,submitLabel:"Save",onSubmit:fi,onCancel:Jl,onDelete:()=>Gn(Fe.id),isExiting:en,lightMode:!$e,accentColor:Fe.isMultiSelect?"#34C759":ce.annotationColor,style:(()=>{const w=Fe.isFixed?Fe.y:Fe.y-Pn;return{left:Math.max(160,Math.min(window.innerWidth-160,Fe.x/100*window.innerWidth)),...w>window.innerHeight-290?{bottom:window.innerHeight-w+20}:{top:w+20}}})()})]}),yn&&l.jsxs(l.Fragment,{children:[l.jsx("div",{ref:vn,className:S.dragSelection}),l.jsx("div",{ref:Rn,className:S.highlightsContainer})]})]})]}),document.body)}function g_(){const r=V(v=>v.config),i=V(v=>v.isPanoramic),a=V(v=>v.initScreens),c=V(v=>v.setPreviewSize),p=V(v=>v.setFonts),h=V(v=>v.setFrames),m=V(v=>v.setDeviceFamilies),x=V(v=>v.setKoubouAvailable),f=V(v=>v.setSizes),$=V(v=>v.setExportSize),k=V(v=>v.activeTab),P=V(v=>v.undo),g=V(v=>v.redo),[E,b]=C.useState(null),_=typeof window<"u"?window.innerWidth<768:!1,y=typeof window<"u"?new URLSearchParams(window.location.search).get("agentation")==="1"||window.localStorage.getItem("appframe:agentation")==="1":!1,[R,ee]=C.useState(_),[ne,se]=C.useState(!_),[re,ie]=C.useState(y);if(C.useEffect(()=>{const v=G=>{var de;if(!(G.metaKey||G.ctrlKey)||G.key.toLowerCase()!=="z")return;const Z=(de=G.target)==null?void 0:de.tagName;Z==="INPUT"||Z==="TEXTAREA"||Z==="SELECT"||(G.preventDefault(),G.shiftKey?g():P())};return window.addEventListener("keydown",v),()=>window.removeEventListener("keydown",v)},[P,g]),C.useEffect(()=>{async function v(){try{const[G,fe,Z]=await Promise.all([uf(),pp(),mp()]),de=G.app.platforms[0]??"iphone",Me=Fl[de]??Fl.iphone;c(Me.w,Me.h),p(fe),h(Z),a(G,de);try{const ze=(await hp()).families;m(ze),x(!0)}catch{x(!1)}try{const Oe=await _p(),ze={};for(const[W,M]of Object.entries(Oe))ze[W]=M;f(ze);const O=ze[de];O&&O.length>0&&$(O[0].key)}catch{}}catch(G){b(G instanceof Error?G.message:"Failed to load config")}}v()},[a,c,p,h,m,x,f,$]),C.useEffect(()=>{const v=()=>{const G=window.innerWidth<768;ee(G),G||se(!0)};return v(),window.addEventListener("resize",v),()=>window.removeEventListener("resize",v)},[]),C.useEffect(()=>{window.localStorage.setItem("appframe:agentation",re?"1":"0")},[re]),E)return l.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-red-400",children:l.jsx("p",{children:E})});if(!r)return l.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-text-dim",children:l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsxs("svg",{className:"animate-spin h-4 w-4 text-accent",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[l.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),l.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"})]}),"Loading..."]})});const ue=i?l.jsxs(l.Fragment,{children:[k==="background"&&l.jsx(th,{}),k==="device"&&l.jsx(nh,{}),k==="text"&&l.jsx(oh,{}),k==="extras"&&l.jsx(rh,{}),k==="export"&&l.jsx(Yd,{})]}):l.jsxs(l.Fragment,{children:[k==="background"&&l.jsx(Cp,{}),k==="device"&&l.jsx(Fp,{}),k==="text"&&l.jsx(Wp,{}),k==="extras"&&l.jsx(Hp,{}),k==="export"&&l.jsx(Yd,{})]});return l.jsxs("div",{className:"h-dvh flex flex-col overflow-hidden",children:[l.jsx(xp,{sidebarOpen:ne,onToggleSidebar:()=>se(v=>!v),showSidebarToggle:R,agentMode:re,onToggleAgentMode:()=>ie(v=>!v)}),l.jsxs("div",{className:"flex-1 flex overflow-hidden min-h-0 flex-col md:flex-row",children:[l.jsx("div",{id:"editor-sidebar",className:`${ne?"flex":"hidden"} md:flex w-full md:w-80 md:min-w-80 max-h-[45vh] md:max-h-none bg-surface border-b md:border-b-0 md:border-r border-border flex-col shrink-0`,children:l.jsx("div",{className:"flex-1 overflow-y-auto",children:ue})}),i?l.jsx(uh,{}):l.jsx(ih,{})]}),re&&l.jsx(__,{endpoint:"http://localhost:4747"})]})}const kf=document.getElementById("root");if(!kf)throw new Error("Root element not found");Km.createRoot(kf).render(l.jsx(C.StrictMode,{children:l.jsx(g_,{})}));
