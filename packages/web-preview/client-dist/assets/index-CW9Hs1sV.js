(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const p of document.querySelectorAll('link[rel="modulepreload"]'))d(p);new MutationObserver(p=>{for(const h of p)if(h.type==="childList")for(const f of h.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&d(f)}).observe(document,{childList:!0,subtree:!0});function a(p){const h={};return p.integrity&&(h.integrity=p.integrity),p.referrerPolicy&&(h.referrerPolicy=p.referrerPolicy),p.crossOrigin==="use-credentials"?h.credentials="include":p.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function d(p){if(p.ep)return;p.ep=!0;const h=a(p);fetch(p.href,h)}})();function nf(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Ma={exports:{}},Pl={},za={exports:{}},Be={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var yd;function Dm(){if(yd)return Be;yd=1;var r=Symbol.for("react.element"),i=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),d=Symbol.for("react.strict_mode"),p=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),f=Symbol.for("react.context"),y=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),D=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),L=Symbol.iterator;function g(R){return R===null||typeof R!="object"?null:(R=L&&R[L]||R["@@iterator"],typeof R=="function"?R:null)}var j={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},b=Object.assign,_={};function N(R,A,ce){this.props=R,this.context=A,this.refs=_,this.updater=ce||j}N.prototype.isReactComponent={},N.prototype.setState=function(R,A){if(typeof R!="object"&&typeof R!="function"&&R!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,R,A,"setState")},N.prototype.forceUpdate=function(R){this.updater.enqueueForceUpdate(this,R,"forceUpdate")};function I(){}I.prototype=N.prototype;function V(R,A,ce){this.props=R,this.context=A,this.refs=_,this.updater=ce||j}var ee=V.prototype=new I;ee.constructor=V,b(ee,N.prototype),ee.isPureReactComponent=!0;var ie=Array.isArray,le=Object.prototype.hasOwnProperty,re={current:null},M={key:!0,ref:!0,__self:!0,__source:!0};function x(R,A,ce){var we,W={},ve=null,ke=null;if(A!=null)for(we in A.ref!==void 0&&(ke=A.ref),A.key!==void 0&&(ve=""+A.key),A)le.call(A,we)&&!M.hasOwnProperty(we)&&(W[we]=A[we]);var Le=arguments.length-2;if(Le===1)W.children=ce;else if(1<Le){for(var Ue=Array(Le),Nt=0;Nt<Le;Nt++)Ue[Nt]=arguments[Nt+2];W.children=Ue}if(R&&R.defaultProps)for(we in Le=R.defaultProps,Le)W[we]===void 0&&(W[we]=Le[we]);return{$$typeof:r,type:R,key:ve,ref:ke,props:W,_owner:re.current}}function K(R,A){return{$$typeof:r,type:R.type,key:A,ref:R.ref,props:R.props,_owner:R._owner}}function ue(R){return typeof R=="object"&&R!==null&&R.$$typeof===r}function q(R){var A={"=":"=0",":":"=2"};return"$"+R.replace(/[=:]/g,function(ce){return A[ce]})}var me=/\/+/g;function ze(R,A){return typeof R=="object"&&R!==null&&R.key!=null?q(""+R.key):A.toString(36)}function Ae(R,A,ce,we,W){var ve=typeof R;(ve==="undefined"||ve==="boolean")&&(R=null);var ke=!1;if(R===null)ke=!0;else switch(ve){case"string":case"number":ke=!0;break;case"object":switch(R.$$typeof){case r:case i:ke=!0}}if(ke)return ke=R,W=W(ke),R=we===""?"."+ze(ke,0):we,ie(W)?(ce="",R!=null&&(ce=R.replace(me,"$&/")+"/"),Ae(W,A,ce,"",function(Nt){return Nt})):W!=null&&(ue(W)&&(W=K(W,ce+(!W.key||ke&&ke.key===W.key?"":(""+W.key).replace(me,"$&/")+"/")+R)),A.push(W)),1;if(ke=0,we=we===""?".":we+":",ie(R))for(var Le=0;Le<R.length;Le++){ve=R[Le];var Ue=we+ze(ve,Le);ke+=Ae(ve,A,ce,Ue,W)}else if(Ue=g(R),typeof Ue=="function")for(R=Ue.call(R),Le=0;!(ve=R.next()).done;)ve=ve.value,Ue=we+ze(ve,Le++),ke+=Ae(ve,A,ce,Ue,W);else if(ve==="object")throw A=String(R),Error("Objects are not valid as a React child (found: "+(A==="[object Object]"?"object with keys {"+Object.keys(R).join(", ")+"}":A)+"). If you meant to render a collection of children, use an array instead.");return ke}function We(R,A,ce){if(R==null)return R;var we=[],W=0;return Ae(R,we,"","",function(ve){return A.call(ce,ve,W++)}),we}function F(R){if(R._status===-1){var A=R._result;A=A(),A.then(function(ce){(R._status===0||R._status===-1)&&(R._status=1,R._result=ce)},function(ce){(R._status===0||R._status===-1)&&(R._status=2,R._result=ce)}),R._status===-1&&(R._status=0,R._result=A)}if(R._status===1)return R._result.default;throw R._result}var U={current:null},$={transition:null},H={ReactCurrentDispatcher:U,ReactCurrentBatchConfig:$,ReactCurrentOwner:re};function X(){throw Error("act(...) is not supported in production builds of React.")}return Be.Children={map:We,forEach:function(R,A,ce){We(R,function(){A.apply(this,arguments)},ce)},count:function(R){var A=0;return We(R,function(){A++}),A},toArray:function(R){return We(R,function(A){return A})||[]},only:function(R){if(!ue(R))throw Error("React.Children.only expected to receive a single React element child.");return R}},Be.Component=N,Be.Fragment=a,Be.Profiler=p,Be.PureComponent=V,Be.StrictMode=d,Be.Suspense=m,Be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=H,Be.act=X,Be.cloneElement=function(R,A,ce){if(R==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+R+".");var we=b({},R.props),W=R.key,ve=R.ref,ke=R._owner;if(A!=null){if(A.ref!==void 0&&(ve=A.ref,ke=re.current),A.key!==void 0&&(W=""+A.key),R.type&&R.type.defaultProps)var Le=R.type.defaultProps;for(Ue in A)le.call(A,Ue)&&!M.hasOwnProperty(Ue)&&(we[Ue]=A[Ue]===void 0&&Le!==void 0?Le[Ue]:A[Ue])}var Ue=arguments.length-2;if(Ue===1)we.children=ce;else if(1<Ue){Le=Array(Ue);for(var Nt=0;Nt<Ue;Nt++)Le[Nt]=arguments[Nt+2];we.children=Le}return{$$typeof:r,type:R.type,key:W,ref:ve,props:we,_owner:ke}},Be.createContext=function(R){return R={$$typeof:f,_currentValue:R,_currentValue2:R,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},R.Provider={$$typeof:h,_context:R},R.Consumer=R},Be.createElement=x,Be.createFactory=function(R){var A=x.bind(null,R);return A.type=R,A},Be.createRef=function(){return{current:null}},Be.forwardRef=function(R){return{$$typeof:y,render:R}},Be.isValidElement=ue,Be.lazy=function(R){return{$$typeof:w,_payload:{_status:-1,_result:R},_init:F}},Be.memo=function(R,A){return{$$typeof:D,type:R,compare:A===void 0?null:A}},Be.startTransition=function(R){var A=$.transition;$.transition={};try{R()}finally{$.transition=A}},Be.unstable_act=X,Be.useCallback=function(R,A){return U.current.useCallback(R,A)},Be.useContext=function(R){return U.current.useContext(R)},Be.useDebugValue=function(){},Be.useDeferredValue=function(R){return U.current.useDeferredValue(R)},Be.useEffect=function(R,A){return U.current.useEffect(R,A)},Be.useId=function(){return U.current.useId()},Be.useImperativeHandle=function(R,A,ce){return U.current.useImperativeHandle(R,A,ce)},Be.useInsertionEffect=function(R,A){return U.current.useInsertionEffect(R,A)},Be.useLayoutEffect=function(R,A){return U.current.useLayoutEffect(R,A)},Be.useMemo=function(R,A){return U.current.useMemo(R,A)},Be.useReducer=function(R,A,ce){return U.current.useReducer(R,A,ce)},Be.useRef=function(R){return U.current.useRef(R)},Be.useState=function(R){return U.current.useState(R)},Be.useSyncExternalStore=function(R,A,ce){return U.current.useSyncExternalStore(R,A,ce)},Be.useTransition=function(){return U.current.useTransition()},Be.version="18.3.1",Be}var xd;function Al(){return xd||(xd=1,za.exports=Dm()),za.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var vd;function Am(){if(vd)return Pl;vd=1;var r=Al(),i=Symbol.for("react.element"),a=Symbol.for("react.fragment"),d=Object.prototype.hasOwnProperty,p=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function f(y,m,D){var w,L={},g=null,j=null;D!==void 0&&(g=""+D),m.key!==void 0&&(g=""+m.key),m.ref!==void 0&&(j=m.ref);for(w in m)d.call(m,w)&&!h.hasOwnProperty(w)&&(L[w]=m[w]);if(y&&y.defaultProps)for(w in m=y.defaultProps,m)L[w]===void 0&&(L[w]=m[w]);return{$$typeof:i,type:y,key:g,ref:j,props:L,_owner:p.current}}return Pl.Fragment=a,Pl.jsx=f,Pl.jsxs=f,Pl}var bd;function Bm(){return bd||(bd=1,Ma.exports=Am()),Ma.exports}var l=Bm(),C=Al();const of=nf(C);var Xs={},Oa={exports:{}},Zt={},Fa={exports:{}},Da={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var wd;function Wm(){return wd||(wd=1,(function(r){function i($,H){var X=$.length;$.push(H);e:for(;0<X;){var R=X-1>>>1,A=$[R];if(0<p(A,H))$[R]=H,$[X]=A,X=R;else break e}}function a($){return $.length===0?null:$[0]}function d($){if($.length===0)return null;var H=$[0],X=$.pop();if(X!==H){$[0]=X;e:for(var R=0,A=$.length,ce=A>>>1;R<ce;){var we=2*(R+1)-1,W=$[we],ve=we+1,ke=$[ve];if(0>p(W,X))ve<A&&0>p(ke,W)?($[R]=ke,$[ve]=X,R=ve):($[R]=W,$[we]=X,R=we);else if(ve<A&&0>p(ke,X))$[R]=ke,$[ve]=X,R=ve;else break e}}return H}function p($,H){var X=$.sortIndex-H.sortIndex;return X!==0?X:$.id-H.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;r.unstable_now=function(){return h.now()}}else{var f=Date,y=f.now();r.unstable_now=function(){return f.now()-y}}var m=[],D=[],w=1,L=null,g=3,j=!1,b=!1,_=!1,N=typeof setTimeout=="function"?setTimeout:null,I=typeof clearTimeout=="function"?clearTimeout:null,V=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ee($){for(var H=a(D);H!==null;){if(H.callback===null)d(D);else if(H.startTime<=$)d(D),H.sortIndex=H.expirationTime,i(m,H);else break;H=a(D)}}function ie($){if(_=!1,ee($),!b)if(a(m)!==null)b=!0,F(le);else{var H=a(D);H!==null&&U(ie,H.startTime-$)}}function le($,H){b=!1,_&&(_=!1,I(x),x=-1),j=!0;var X=g;try{for(ee(H),L=a(m);L!==null&&(!(L.expirationTime>H)||$&&!q());){var R=L.callback;if(typeof R=="function"){L.callback=null,g=L.priorityLevel;var A=R(L.expirationTime<=H);H=r.unstable_now(),typeof A=="function"?L.callback=A:L===a(m)&&d(m),ee(H)}else d(m);L=a(m)}if(L!==null)var ce=!0;else{var we=a(D);we!==null&&U(ie,we.startTime-H),ce=!1}return ce}finally{L=null,g=X,j=!1}}var re=!1,M=null,x=-1,K=5,ue=-1;function q(){return!(r.unstable_now()-ue<K)}function me(){if(M!==null){var $=r.unstable_now();ue=$;var H=!0;try{H=M(!0,$)}finally{H?ze():(re=!1,M=null)}}else re=!1}var ze;if(typeof V=="function")ze=function(){V(me)};else if(typeof MessageChannel<"u"){var Ae=new MessageChannel,We=Ae.port2;Ae.port1.onmessage=me,ze=function(){We.postMessage(null)}}else ze=function(){N(me,0)};function F($){M=$,re||(re=!0,ze())}function U($,H){x=N(function(){$(r.unstable_now())},H)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function($){$.callback=null},r.unstable_continueExecution=function(){b||j||(b=!0,F(le))},r.unstable_forceFrameRate=function($){0>$||125<$?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):K=0<$?Math.floor(1e3/$):5},r.unstable_getCurrentPriorityLevel=function(){return g},r.unstable_getFirstCallbackNode=function(){return a(m)},r.unstable_next=function($){switch(g){case 1:case 2:case 3:var H=3;break;default:H=g}var X=g;g=H;try{return $()}finally{g=X}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function($,H){switch($){case 1:case 2:case 3:case 4:case 5:break;default:$=3}var X=g;g=$;try{return H()}finally{g=X}},r.unstable_scheduleCallback=function($,H,X){var R=r.unstable_now();switch(typeof X=="object"&&X!==null?(X=X.delay,X=typeof X=="number"&&0<X?R+X:R):X=R,$){case 1:var A=-1;break;case 2:A=250;break;case 5:A=1073741823;break;case 4:A=1e4;break;default:A=5e3}return A=X+A,$={id:w++,callback:H,priorityLevel:$,startTime:X,expirationTime:A,sortIndex:-1},X>R?($.sortIndex=X,i(D,$),a(m)===null&&$===a(D)&&(_?(I(x),x=-1):_=!0,U(ie,X-R))):($.sortIndex=A,i(m,$),b||j||(b=!0,F(le))),$},r.unstable_shouldYield=q,r.unstable_wrapCallback=function($){var H=g;return function(){var X=g;g=H;try{return $.apply(this,arguments)}finally{g=X}}}})(Da)),Da}var kd;function Ym(){return kd||(kd=1,Fa.exports=Wm()),Fa.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cd;function Hm(){if(Cd)return Zt;Cd=1;var r=Al(),i=Ym();function a(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var d=new Set,p={};function h(e,t){f(e,t),f(e+"Capture",t)}function f(e,t){for(p[e]=t,e=0;e<t.length;e++)d.add(t[e])}var y=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),m=Object.prototype.hasOwnProperty,D=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,w={},L={};function g(e){return m.call(L,e)?!0:m.call(w,e)?!1:D.test(e)?L[e]=!0:(w[e]=!0,!1)}function j(e,t,n,o){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function b(e,t,n,o){if(t===null||typeof t>"u"||j(e,t,n,o))return!0;if(o)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function _(e,t,n,o,s,u,c){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=s,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=u,this.removeEmptyString=c}var N={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){N[e]=new _(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];N[t]=new _(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){N[e]=new _(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){N[e]=new _(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){N[e]=new _(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){N[e]=new _(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){N[e]=new _(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){N[e]=new _(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){N[e]=new _(e,5,!1,e.toLowerCase(),null,!1,!1)});var I=/[\-:]([a-z])/g;function V(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(I,V);N[t]=new _(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(I,V);N[t]=new _(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(I,V);N[t]=new _(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){N[e]=new _(e,1,!1,e.toLowerCase(),null,!1,!1)}),N.xlinkHref=new _("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){N[e]=new _(e,1,!1,e.toLowerCase(),null,!0,!0)});function ee(e,t,n,o){var s=N.hasOwnProperty(t)?N[t]:null;(s!==null?s.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(b(t,n,s,o)&&(n=null),o||s===null?g(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):s.mustUseProperty?e[s.propertyName]=n===null?s.type===3?!1:"":n:(t=s.attributeName,o=s.attributeNamespace,n===null?e.removeAttribute(t):(s=s.type,n=s===3||s===4&&n===!0?"":""+n,o?e.setAttributeNS(o,t,n):e.setAttribute(t,n))))}var ie=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,le=Symbol.for("react.element"),re=Symbol.for("react.portal"),M=Symbol.for("react.fragment"),x=Symbol.for("react.strict_mode"),K=Symbol.for("react.profiler"),ue=Symbol.for("react.provider"),q=Symbol.for("react.context"),me=Symbol.for("react.forward_ref"),ze=Symbol.for("react.suspense"),Ae=Symbol.for("react.suspense_list"),We=Symbol.for("react.memo"),F=Symbol.for("react.lazy"),U=Symbol.for("react.offscreen"),$=Symbol.iterator;function H(e){return e===null||typeof e!="object"?null:(e=$&&e[$]||e["@@iterator"],typeof e=="function"?e:null)}var X=Object.assign,R;function A(e){if(R===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);R=t&&t[1]||""}return`
`+R+e}var ce=!1;function we(e,t){if(!e||ce)return"";ce=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(B){var o=B}Reflect.construct(e,[],t)}else{try{t.call()}catch(B){o=B}e.call(t.prototype)}else{try{throw Error()}catch(B){o=B}e()}}catch(B){if(B&&o&&typeof B.stack=="string"){for(var s=B.stack.split(`
`),u=o.stack.split(`
`),c=s.length-1,S=u.length-1;1<=c&&0<=S&&s[c]!==u[S];)S--;for(;1<=c&&0<=S;c--,S--)if(s[c]!==u[S]){if(c!==1||S!==1)do if(c--,S--,0>S||s[c]!==u[S]){var P=`
`+s[c].replace(" at new "," at ");return e.displayName&&P.includes("<anonymous>")&&(P=P.replace("<anonymous>",e.displayName)),P}while(1<=c&&0<=S);break}}}finally{ce=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?A(e):""}function W(e){switch(e.tag){case 5:return A(e.type);case 16:return A("Lazy");case 13:return A("Suspense");case 19:return A("SuspenseList");case 0:case 2:case 15:return e=we(e.type,!1),e;case 11:return e=we(e.type.render,!1),e;case 1:return e=we(e.type,!0),e;default:return""}}function ve(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case M:return"Fragment";case re:return"Portal";case K:return"Profiler";case x:return"StrictMode";case ze:return"Suspense";case Ae:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case q:return(e.displayName||"Context")+".Consumer";case ue:return(e._context.displayName||"Context")+".Provider";case me:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case We:return t=e.displayName||null,t!==null?t:ve(e.type)||"Memo";case F:t=e._payload,e=e._init;try{return ve(e(t))}catch{}}return null}function ke(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ve(t);case 8:return t===x?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Le(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ue(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Nt(e){var t=Ue(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var s=n.get,u=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(c){o=""+c,u.call(this,c)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return o},setValue:function(c){o=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function an(e){e._valueTracker||(e._valueTracker=Nt(e))}function Ur(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=Ue(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}function En(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function tr(e,t){var n=t.checked;return X({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Vr(e,t){var n=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;n=Le(t.value!=null?t.value:n),e._wrapperState={initialChecked:o,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function No(e,t){t=t.checked,t!=null&&ee(e,"checked",t,!1)}function nr(e,t){No(e,t);var n=Le(t.value),o=t.type;if(n!=null)o==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Yn(e,t.type,n):t.hasOwnProperty("defaultValue")&&Yn(e,t.type,Le(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Me(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Yn(e,t,n){(t!=="number"||En(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Hn=Array.isArray;function It(e,t,n,o){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&o&&(e[n].defaultSelected=!0)}else{for(n=""+Le(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,o&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function or(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(a(91));return X({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Nn(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(a(92));if(Hn(n)){if(1<n.length)throw Error(a(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Le(n)}}function Pn(e,t){var n=Le(t.value),o=Le(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),o!=null&&(e.defaultValue=""+o)}function Xr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Qr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function rr(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Qr(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var nt,Bl=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,o,s){MSApp.execUnsafeLocalFunction(function(){return e(t,n,o,s)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(nt=nt||document.createElement("div"),nt.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=nt.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Pt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var so={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Po=["Webkit","ms","Moz","O"];Object.keys(so).forEach(function(e){Po.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),so[t]=so[e]})});function lr(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||so.hasOwnProperty(e)&&so[e]?(""+t).trim():t+"px"}function Wl(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var o=n.indexOf("--")===0,s=lr(n,t[n],o);n==="float"&&(n="cssFloat"),o?e.setProperty(n,s):e[n]=s}}var Yl=X({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ro(e,t){if(t){if(Yl[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(a(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(a(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(a(61))}if(t.style!=null&&typeof t.style!="object")throw Error(a(62))}}function Lo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var sr=null;function ir(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Gr=null,Rn=null,Un=null;function Kr(e){if(e=pl(e)){if(typeof Gr!="function")throw Error(a(280));var t=e.stateNode;t&&(t=as(t),Gr(e.stateNode,e.type,t))}}function Vn(e){Rn?Un?Un.push(e):Un=[e]:Rn=e}function ut(){if(Rn){var e=Rn,t=Un;if(Un=Rn=null,Kr(e),t)for(e=0;e<t.length;e++)Kr(t[e])}}function Xn(e,t){return e(t)}function qt(){}var Ct=!1;function Hl(e,t,n){if(Ct)return e(t,n);Ct=!0;try{return Xn(e,t,n)}finally{Ct=!1,(Rn!==null||Un!==null)&&(qt(),ut())}}function To(e,t){var n=e.stateNode;if(n===null)return null;var o=as(n);if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(a(231,t,typeof n));return n}var Zr=!1;if(y)try{var un={};Object.defineProperty(un,"passive",{get:function(){Zr=!0}}),window.addEventListener("test",un,un),window.removeEventListener("test",un,un)}catch{Zr=!1}function de(e,t,n,o,s,u,c,S,P){var B=Array.prototype.slice.call(arguments,3);try{t.apply(n,B)}catch(oe){this.onError(oe)}}var Yt=!1,$e=null,Io=!1,ar=null,Ul={onError:function(e){Yt=!0,$e=e}};function Vl(e,t,n,o,s,u,c,S,P){Yt=!1,$e=null,de.apply(Ul,arguments)}function gn(e,t,n,o,s,u,c,S,P){if(Vl.apply(this,arguments),Yt){if(Yt){var B=$e;Yt=!1,$e=null}else throw Error(a(198));Io||(Io=!0,ar=B)}}function pt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function ur(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Jr(e){if(pt(e)!==e)throw Error(a(188))}function Rt(e){var t=e.alternate;if(!t){if(t=pt(e),t===null)throw Error(a(188));return t!==e?null:e}for(var n=e,o=t;;){var s=n.return;if(s===null)break;var u=s.alternate;if(u===null){if(o=s.return,o!==null){n=o;continue}break}if(s.child===u.child){for(u=s.child;u;){if(u===n)return Jr(s),e;if(u===o)return Jr(s),t;u=u.sibling}throw Error(a(188))}if(n.return!==o.return)n=s,o=u;else{for(var c=!1,S=s.child;S;){if(S===n){c=!0,n=s,o=u;break}if(S===o){c=!0,o=s,n=u;break}S=S.sibling}if(!c){for(S=u.child;S;){if(S===n){c=!0,n=u,o=s;break}if(S===o){c=!0,o=u,n=s;break}S=S.sibling}if(!c)throw Error(a(189))}}if(n.alternate!==o)throw Error(a(190))}if(n.tag!==3)throw Error(a(188));return n.stateNode.current===n?e:t}function Ln(e){return e=Rt(e),e!==null?Ze(e):null}function Ze(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ze(e);if(t!==null)return t;e=e.sibling}return null}var cr=i.unstable_scheduleCallback,cn=i.unstable_cancelCallback,Xl=i.unstable_shouldYield,io=i.unstable_requestPaint,lt=i.unstable_now,ci=i.unstable_getCurrentPriorityLevel,qr=i.unstable_ImmediatePriority,dr=i.unstable_UserBlockingPriority,$o=i.unstable_NormalPriority,Mo=i.unstable_LowPriority,el=i.unstable_IdlePriority,Qn=null,$t=null;function fr(e){if($t&&typeof $t.onCommitFiberRoot=="function")try{$t.onCommitFiberRoot(Qn,e,void 0,(e.current.flags&128)===128)}catch{}}var en=Math.clz32?Math.clz32:Ql,ao=Math.log,yn=Math.LN2;function Ql(e){return e>>>=0,e===0?32:31-(ao(e)/yn|0)|0}var xn=64,At=4194304;function vn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Tn(e,t){var n=e.pendingLanes;if(n===0)return 0;var o=0,s=e.suspendedLanes,u=e.pingedLanes,c=n&268435455;if(c!==0){var S=c&~s;S!==0?o=vn(S):(u&=c,u!==0&&(o=vn(u)))}else c=n&~s,c!==0?o=vn(c):u!==0&&(o=vn(u));if(o===0)return 0;if(t!==0&&t!==o&&(t&s)===0&&(s=o&-o,u=t&-t,s>=u||s===16&&(u&4194240)!==0))return t;if((o&4)!==0&&(o|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)n=31-en(t),s=1<<n,o|=e[n],t&=~s;return o}function mr(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Gl(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,s=e.expirationTimes,u=e.pendingLanes;0<u;){var c=31-en(u),S=1<<c,P=s[c];P===-1?((S&n)===0||(S&o)!==0)&&(s[c]=mr(S,t)):P<=t&&(e.expiredLanes|=S),u&=~S}}function uo(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function tl(){var e=xn;return xn<<=1,(xn&4194240)===0&&(xn=64),e}function zo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Oo(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-en(t),e[t]=n}function Kl(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<n;){var s=31-en(n),u=1<<s;t[s]=0,o[s]=-1,e[s]=-1,n&=~u}}function pr(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-en(n),s=1<<o;s&t|e[o]&t&&(e[o]|=t),n&=~s}}var He=0;function Je(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var nl,hr,Zl,ol,Fo,Do=!1,Ao=[],bt=null,In=null,$n=null,Gn=new Map,Mn=new Map,tn=[],di="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Jl(e,t){switch(e){case"focusin":case"focusout":bt=null;break;case"dragenter":case"dragleave":In=null;break;case"mouseover":case"mouseout":$n=null;break;case"pointerover":case"pointerout":Gn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Mn.delete(t.pointerId)}}function nn(e,t,n,o,s,u){return e===null||e.nativeEvent!==u?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:u,targetContainers:[s]},t!==null&&(t=pl(t),t!==null&&hr(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function rl(e,t,n,o,s){switch(t){case"focusin":return bt=nn(bt,e,t,n,o,s),!0;case"dragenter":return In=nn(In,e,t,n,o,s),!0;case"mouseover":return $n=nn($n,e,t,n,o,s),!0;case"pointerover":var u=s.pointerId;return Gn.set(u,nn(Gn.get(u)||null,e,t,n,o,s)),!0;case"gotpointercapture":return u=s.pointerId,Mn.set(u,nn(Mn.get(u)||null,e,t,n,o,s)),!0}return!1}function _r(e){var t=Wo(e.target);if(t!==null){var n=pt(t);if(n!==null){if(t=n.tag,t===13){if(t=ur(n),t!==null){e.blockedOn=t,Fo(e.priority,function(){Zl(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function gr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Q(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);sr=o,n.target.dispatchEvent(o),sr=null}else return t=pl(n),t!==null&&hr(t),e.blockedOn=n,!1;t.shift()}return!0}function Kn(e,t,n){gr(e)&&n.delete(t)}function yr(){Do=!1,bt!==null&&gr(bt)&&(bt=null),In!==null&&gr(In)&&(In=null),$n!==null&&gr($n)&&($n=null),Gn.forEach(Kn),Mn.forEach(Kn)}function co(e,t){e.blockedOn===t&&(e.blockedOn=null,Do||(Do=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,yr)))}function fo(e){function t(s){return co(s,e)}if(0<Ao.length){co(Ao[0],e);for(var n=1;n<Ao.length;n++){var o=Ao[n];o.blockedOn===e&&(o.blockedOn=null)}}for(bt!==null&&co(bt,e),In!==null&&co(In,e),$n!==null&&co($n,e),Gn.forEach(t),Mn.forEach(t),n=0;n<tn.length;n++)o=tn[n],o.blockedOn===e&&(o.blockedOn=null);for(;0<tn.length&&(n=tn[0],n.blockedOn===null);)_r(n),n.blockedOn===null&&tn.shift()}var Zn=ie.ReactCurrentBatchConfig,Bo=!0;function ql(e,t,n,o){var s=He,u=Zn.transition;Zn.transition=null;try{He=1,E(e,t,n,o)}finally{He=s,Zn.transition=u}}function v(e,t,n,o){var s=He,u=Zn.transition;Zn.transition=null;try{He=4,E(e,t,n,o)}finally{He=s,Zn.transition=u}}function E(e,t,n,o){if(Bo){var s=Q(e,t,n,o);if(s===null)Si(e,t,o,Y,n),Jl(e,o);else if(rl(s,e,t,n,o))o.stopPropagation();else if(Jl(e,o),t&4&&-1<di.indexOf(e)){for(;s!==null;){var u=pl(s);if(u!==null&&nl(u),u=Q(e,t,n,o),u===null&&Si(e,t,o,Y,n),u===s)break;s=u}s!==null&&o.stopPropagation()}else Si(e,t,o,null,n)}}var Y=null;function Q(e,t,n,o){if(Y=null,e=ir(o),e=Wo(e),e!==null)if(t=pt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=ur(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Y=e,null}function G(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ci()){case qr:return 1;case dr:return 4;case $o:case Mo:return 16;case el:return 536870912;default:return 16}default:return 16}}var te=null,_e=null,he=null;function Ce(){if(he)return he;var e,t=_e,n=t.length,o,s="value"in te?te.value:te.textContent,u=s.length;for(e=0;e<n&&t[e]===s[e];e++);var c=n-e;for(o=1;o<=c&&t[n-o]===s[u-o];o++);return he=s.slice(e,1<o?1-o:void 0)}function Te(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Se(){return!0}function Re(){return!1}function je(e){function t(n,o,s,u,c){this._reactName=n,this._targetInst=s,this.type=o,this.nativeEvent=u,this.target=c,this.currentTarget=null;for(var S in e)e.hasOwnProperty(S)&&(n=e[S],this[S]=n?n(u):u[S]);return this.isDefaultPrevented=(u.defaultPrevented!=null?u.defaultPrevented:u.returnValue===!1)?Se:Re,this.isPropagationStopped=Re,this}return X(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Se)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Se)},persist:function(){},isPersistent:Se}),t}var Pe={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ge=je(Pe),_t=X({},Pe,{view:0,detail:0}),gt=je(_t),on,st,ft,Oe=X({},_t,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:pi,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ft&&(ft&&e.type==="mousemove"?(on=e.screenX-ft.screenX,st=e.screenY-ft.screenY):st=on=0,ft=e),on)},movementY:function(e){return"movementY"in e?e.movementY:st}}),Fe=je(Oe),Mt=X({},Oe,{dataTransfer:0}),it=je(Mt),Ht=X({},_t,{relatedTarget:0}),Ut=je(Ht),xr=X({},Pe,{animationName:0,elapsedTime:0,pseudoElement:0}),fi=je(xr),es=X({},Pe,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),mi=je(es),vf=X({},Pe,{data:0}),au=je(vf),bf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},wf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},kf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Cf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=kf[e])?!!t[e]:!1}function pi(){return Cf}var Sf=X({},_t,{key:function(e){if(e.key){var t=bf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Te(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?wf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:pi,charCode:function(e){return e.type==="keypress"?Te(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Te(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),jf=je(Sf),Ef=X({},Oe,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),uu=je(Ef),Nf=X({},_t,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:pi}),Pf=je(Nf),Rf=X({},Pe,{propertyName:0,elapsedTime:0,pseudoElement:0}),Lf=je(Rf),Tf=X({},Oe,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),If=je(Tf),$f=[9,13,27,32],hi=y&&"CompositionEvent"in window,ll=null;y&&"documentMode"in document&&(ll=document.documentMode);var Mf=y&&"TextEvent"in window&&!ll,cu=y&&(!hi||ll&&8<ll&&11>=ll),du=" ",fu=!1;function mu(e,t){switch(e){case"keyup":return $f.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function pu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var vr=!1;function zf(e,t){switch(e){case"compositionend":return pu(t);case"keypress":return t.which!==32?null:(fu=!0,du);case"textInput":return e=t.data,e===du&&fu?null:e;default:return null}}function Of(e,t){if(vr)return e==="compositionend"||!hi&&mu(e,t)?(e=Ce(),he=_e=te=null,vr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return cu&&t.locale!=="ko"?null:t.data;default:return null}}var Ff={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function hu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Ff[e.type]:t==="textarea"}function _u(e,t,n,o){Vn(o),t=ls(t,"onChange"),0<t.length&&(n=new ge("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var sl=null,il=null;function Df(e){$u(e,0)}function ts(e){var t=Sr(e);if(Ur(t))return e}function Af(e,t){if(e==="change")return t}var gu=!1;if(y){var _i;if(y){var gi="oninput"in document;if(!gi){var yu=document.createElement("div");yu.setAttribute("oninput","return;"),gi=typeof yu.oninput=="function"}_i=gi}else _i=!1;gu=_i&&(!document.documentMode||9<document.documentMode)}function xu(){sl&&(sl.detachEvent("onpropertychange",vu),il=sl=null)}function vu(e){if(e.propertyName==="value"&&ts(il)){var t=[];_u(t,il,e,ir(e)),Hl(Df,t)}}function Bf(e,t,n){e==="focusin"?(xu(),sl=t,il=n,sl.attachEvent("onpropertychange",vu)):e==="focusout"&&xu()}function Wf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ts(il)}function Yf(e,t){if(e==="click")return ts(t)}function Hf(e,t){if(e==="input"||e==="change")return ts(t)}function Uf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var bn=typeof Object.is=="function"?Object.is:Uf;function al(e,t){if(bn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var s=n[o];if(!m.call(t,s)||!bn(e[s],t[s]))return!1}return!0}function bu(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function wu(e,t){var n=bu(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=bu(n)}}function ku(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?ku(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Cu(){for(var e=window,t=En();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=En(e.document)}return t}function yi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Vf(e){var t=Cu(),n=e.focusedElem,o=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&ku(n.ownerDocument.documentElement,n)){if(o!==null&&yi(n)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var s=n.textContent.length,u=Math.min(o.start,s);o=o.end===void 0?u:Math.min(o.end,s),!e.extend&&u>o&&(s=o,o=u,u=s),s=wu(n,u);var c=wu(n,o);s&&c&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==c.node||e.focusOffset!==c.offset)&&(t=t.createRange(),t.setStart(s.node,s.offset),e.removeAllRanges(),u>o?(e.addRange(t),e.extend(c.node,c.offset)):(t.setEnd(c.node,c.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Xf=y&&"documentMode"in document&&11>=document.documentMode,br=null,xi=null,ul=null,vi=!1;function Su(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;vi||br==null||br!==En(o)||(o=br,"selectionStart"in o&&yi(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),ul&&al(ul,o)||(ul=o,o=ls(xi,"onSelect"),0<o.length&&(t=new ge("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=br)))}function ns(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var wr={animationend:ns("Animation","AnimationEnd"),animationiteration:ns("Animation","AnimationIteration"),animationstart:ns("Animation","AnimationStart"),transitionend:ns("Transition","TransitionEnd")},bi={},ju={};y&&(ju=document.createElement("div").style,"AnimationEvent"in window||(delete wr.animationend.animation,delete wr.animationiteration.animation,delete wr.animationstart.animation),"TransitionEvent"in window||delete wr.transitionend.transition);function os(e){if(bi[e])return bi[e];if(!wr[e])return e;var t=wr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ju)return bi[e]=t[n];return e}var Eu=os("animationend"),Nu=os("animationiteration"),Pu=os("animationstart"),Ru=os("transitionend"),Lu=new Map,Tu="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function mo(e,t){Lu.set(e,t),h(t,[e])}for(var wi=0;wi<Tu.length;wi++){var ki=Tu[wi],Qf=ki.toLowerCase(),Gf=ki[0].toUpperCase()+ki.slice(1);mo(Qf,"on"+Gf)}mo(Eu,"onAnimationEnd"),mo(Nu,"onAnimationIteration"),mo(Pu,"onAnimationStart"),mo("dblclick","onDoubleClick"),mo("focusin","onFocus"),mo("focusout","onBlur"),mo(Ru,"onTransitionEnd"),f("onMouseEnter",["mouseout","mouseover"]),f("onMouseLeave",["mouseout","mouseover"]),f("onPointerEnter",["pointerout","pointerover"]),f("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var cl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Kf=new Set("cancel close invalid load scroll toggle".split(" ").concat(cl));function Iu(e,t,n){var o=e.type||"unknown-event";e.currentTarget=n,gn(o,t,void 0,e),e.currentTarget=null}function $u(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],s=o.event;o=o.listeners;e:{var u=void 0;if(t)for(var c=o.length-1;0<=c;c--){var S=o[c],P=S.instance,B=S.currentTarget;if(S=S.listener,P!==u&&s.isPropagationStopped())break e;Iu(s,S,B),u=P}else for(c=0;c<o.length;c++){if(S=o[c],P=S.instance,B=S.currentTarget,S=S.listener,P!==u&&s.isPropagationStopped())break e;Iu(s,S,B),u=P}}}if(Io)throw e=ar,Io=!1,ar=null,e}function ot(e,t){var n=t[Li];n===void 0&&(n=t[Li]=new Set);var o=e+"__bubble";n.has(o)||(Mu(t,e,2,!1),n.add(o))}function Ci(e,t,n){var o=0;t&&(o|=4),Mu(n,e,o,t)}var rs="_reactListening"+Math.random().toString(36).slice(2);function dl(e){if(!e[rs]){e[rs]=!0,d.forEach(function(n){n!=="selectionchange"&&(Kf.has(n)||Ci(n,!1,e),Ci(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[rs]||(t[rs]=!0,Ci("selectionchange",!1,t))}}function Mu(e,t,n,o){switch(G(t)){case 1:var s=ql;break;case 4:s=v;break;default:s=E}n=s.bind(null,t,n,e),s=void 0,!Zr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),o?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function Si(e,t,n,o,s){var u=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var c=o.tag;if(c===3||c===4){var S=o.stateNode.containerInfo;if(S===s||S.nodeType===8&&S.parentNode===s)break;if(c===4)for(c=o.return;c!==null;){var P=c.tag;if((P===3||P===4)&&(P=c.stateNode.containerInfo,P===s||P.nodeType===8&&P.parentNode===s))return;c=c.return}for(;S!==null;){if(c=Wo(S),c===null)return;if(P=c.tag,P===5||P===6){o=u=c;continue e}S=S.parentNode}}o=o.return}Hl(function(){var B=u,oe=ir(n),se=[];e:{var ne=Lu.get(e);if(ne!==void 0){var fe=ge,ye=e;switch(e){case"keypress":if(Te(n)===0)break e;case"keydown":case"keyup":fe=jf;break;case"focusin":ye="focus",fe=Ut;break;case"focusout":ye="blur",fe=Ut;break;case"beforeblur":case"afterblur":fe=Ut;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":fe=Fe;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":fe=it;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":fe=Pf;break;case Eu:case Nu:case Pu:fe=fi;break;case Ru:fe=Lf;break;case"scroll":fe=gt;break;case"wheel":fe=If;break;case"copy":case"cut":case"paste":fe=mi;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":fe=uu}var xe=(t&4)!==0,ht=!xe&&e==="scroll",z=xe?ne!==null?ne+"Capture":null:ne;xe=[];for(var T=B,O;T!==null;){O=T;var ae=O.stateNode;if(O.tag===5&&ae!==null&&(O=ae,z!==null&&(ae=To(T,z),ae!=null&&xe.push(fl(T,ae,O)))),ht)break;T=T.return}0<xe.length&&(ne=new fe(ne,ye,null,n,oe),se.push({event:ne,listeners:xe}))}}if((t&7)===0){e:{if(ne=e==="mouseover"||e==="pointerover",fe=e==="mouseout"||e==="pointerout",ne&&n!==sr&&(ye=n.relatedTarget||n.fromElement)&&(Wo(ye)||ye[Jn]))break e;if((fe||ne)&&(ne=oe.window===oe?oe:(ne=oe.ownerDocument)?ne.defaultView||ne.parentWindow:window,fe?(ye=n.relatedTarget||n.toElement,fe=B,ye=ye?Wo(ye):null,ye!==null&&(ht=pt(ye),ye!==ht||ye.tag!==5&&ye.tag!==6)&&(ye=null)):(fe=null,ye=B),fe!==ye)){if(xe=Fe,ae="onMouseLeave",z="onMouseEnter",T="mouse",(e==="pointerout"||e==="pointerover")&&(xe=uu,ae="onPointerLeave",z="onPointerEnter",T="pointer"),ht=fe==null?ne:Sr(fe),O=ye==null?ne:Sr(ye),ne=new xe(ae,T+"leave",fe,n,oe),ne.target=ht,ne.relatedTarget=O,ae=null,Wo(oe)===B&&(xe=new xe(z,T+"enter",ye,n,oe),xe.target=O,xe.relatedTarget=ht,ae=xe),ht=ae,fe&&ye)t:{for(xe=fe,z=ye,T=0,O=xe;O;O=kr(O))T++;for(O=0,ae=z;ae;ae=kr(ae))O++;for(;0<T-O;)xe=kr(xe),T--;for(;0<O-T;)z=kr(z),O--;for(;T--;){if(xe===z||z!==null&&xe===z.alternate)break t;xe=kr(xe),z=kr(z)}xe=null}else xe=null;fe!==null&&zu(se,ne,fe,xe,!1),ye!==null&&ht!==null&&zu(se,ht,ye,xe,!0)}}e:{if(ne=B?Sr(B):window,fe=ne.nodeName&&ne.nodeName.toLowerCase(),fe==="select"||fe==="input"&&ne.type==="file")var be=Af;else if(hu(ne))if(gu)be=Hf;else{be=Wf;var Ee=Bf}else(fe=ne.nodeName)&&fe.toLowerCase()==="input"&&(ne.type==="checkbox"||ne.type==="radio")&&(be=Yf);if(be&&(be=be(e,B))){_u(se,be,n,oe);break e}Ee&&Ee(e,ne,B),e==="focusout"&&(Ee=ne._wrapperState)&&Ee.controlled&&ne.type==="number"&&Yn(ne,"number",ne.value)}switch(Ee=B?Sr(B):window,e){case"focusin":(hu(Ee)||Ee.contentEditable==="true")&&(br=Ee,xi=B,ul=null);break;case"focusout":ul=xi=br=null;break;case"mousedown":vi=!0;break;case"contextmenu":case"mouseup":case"dragend":vi=!1,Su(se,n,oe);break;case"selectionchange":if(Xf)break;case"keydown":case"keyup":Su(se,n,oe)}var Ne;if(hi)e:{switch(e){case"compositionstart":var Ie="onCompositionStart";break e;case"compositionend":Ie="onCompositionEnd";break e;case"compositionupdate":Ie="onCompositionUpdate";break e}Ie=void 0}else vr?mu(e,n)&&(Ie="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(Ie="onCompositionStart");Ie&&(cu&&n.locale!=="ko"&&(vr||Ie!=="onCompositionStart"?Ie==="onCompositionEnd"&&vr&&(Ne=Ce()):(te=oe,_e="value"in te?te.value:te.textContent,vr=!0)),Ee=ls(B,Ie),0<Ee.length&&(Ie=new au(Ie,e,null,n,oe),se.push({event:Ie,listeners:Ee}),Ne?Ie.data=Ne:(Ne=pu(n),Ne!==null&&(Ie.data=Ne)))),(Ne=Mf?zf(e,n):Of(e,n))&&(B=ls(B,"onBeforeInput"),0<B.length&&(oe=new au("onBeforeInput","beforeinput",null,n,oe),se.push({event:oe,listeners:B}),oe.data=Ne))}$u(se,t)})}function fl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ls(e,t){for(var n=t+"Capture",o=[];e!==null;){var s=e,u=s.stateNode;s.tag===5&&u!==null&&(s=u,u=To(e,n),u!=null&&o.unshift(fl(e,u,s)),u=To(e,t),u!=null&&o.push(fl(e,u,s))),e=e.return}return o}function kr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function zu(e,t,n,o,s){for(var u=t._reactName,c=[];n!==null&&n!==o;){var S=n,P=S.alternate,B=S.stateNode;if(P!==null&&P===o)break;S.tag===5&&B!==null&&(S=B,s?(P=To(n,u),P!=null&&c.unshift(fl(n,P,S))):s||(P=To(n,u),P!=null&&c.push(fl(n,P,S)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var Zf=/\r\n?/g,Jf=/\u0000|\uFFFD/g;function Ou(e){return(typeof e=="string"?e:""+e).replace(Zf,`
`).replace(Jf,"")}function ss(e,t,n){if(t=Ou(t),Ou(e)!==t&&n)throw Error(a(425))}function is(){}var ji=null,Ei=null;function Ni(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Pi=typeof setTimeout=="function"?setTimeout:void 0,qf=typeof clearTimeout=="function"?clearTimeout:void 0,Fu=typeof Promise=="function"?Promise:void 0,em=typeof queueMicrotask=="function"?queueMicrotask:typeof Fu<"u"?function(e){return Fu.resolve(null).then(e).catch(tm)}:Pi;function tm(e){setTimeout(function(){throw e})}function Ri(e,t){var n=t,o=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(o===0){e.removeChild(s),fo(t);return}o--}else n!=="$"&&n!=="$?"&&n!=="$!"||o++;n=s}while(n);fo(t)}function po(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Du(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Cr=Math.random().toString(36).slice(2),zn="__reactFiber$"+Cr,ml="__reactProps$"+Cr,Jn="__reactContainer$"+Cr,Li="__reactEvents$"+Cr,nm="__reactListeners$"+Cr,om="__reactHandles$"+Cr;function Wo(e){var t=e[zn];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Jn]||n[zn]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Du(e);e!==null;){if(n=e[zn])return n;e=Du(e)}return t}e=n,n=e.parentNode}return null}function pl(e){return e=e[zn]||e[Jn],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Sr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(a(33))}function as(e){return e[ml]||null}var Ti=[],jr=-1;function ho(e){return{current:e}}function rt(e){0>jr||(e.current=Ti[jr],Ti[jr]=null,jr--)}function tt(e,t){jr++,Ti[jr]=e.current,e.current=t}var _o={},zt=ho(_o),Vt=ho(!1),Yo=_o;function Er(e,t){var n=e.type.contextTypes;if(!n)return _o;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var s={},u;for(u in n)s[u]=t[u];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=s),s}function Xt(e){return e=e.childContextTypes,e!=null}function us(){rt(Vt),rt(zt)}function Au(e,t,n){if(zt.current!==_o)throw Error(a(168));tt(zt,t),tt(Vt,n)}function Bu(e,t,n){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return n;o=o.getChildContext();for(var s in o)if(!(s in t))throw Error(a(108,ke(e)||"Unknown",s));return X({},n,o)}function cs(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||_o,Yo=zt.current,tt(zt,e),tt(Vt,Vt.current),!0}function Wu(e,t,n){var o=e.stateNode;if(!o)throw Error(a(169));n?(e=Bu(e,t,Yo),o.__reactInternalMemoizedMergedChildContext=e,rt(Vt),rt(zt),tt(zt,e)):rt(Vt),tt(Vt,n)}var qn=null,ds=!1,Ii=!1;function Yu(e){qn===null?qn=[e]:qn.push(e)}function rm(e){ds=!0,Yu(e)}function go(){if(!Ii&&qn!==null){Ii=!0;var e=0,t=He;try{var n=qn;for(He=1;e<n.length;e++){var o=n[e];do o=o(!0);while(o!==null)}qn=null,ds=!1}catch(s){throw qn!==null&&(qn=qn.slice(e+1)),cr(qr,go),s}finally{He=t,Ii=!1}}return null}var Nr=[],Pr=0,fs=null,ms=0,dn=[],fn=0,Ho=null,eo=1,to="";function Uo(e,t){Nr[Pr++]=ms,Nr[Pr++]=fs,fs=e,ms=t}function Hu(e,t,n){dn[fn++]=eo,dn[fn++]=to,dn[fn++]=Ho,Ho=e;var o=eo;e=to;var s=32-en(o)-1;o&=~(1<<s),n+=1;var u=32-en(t)+s;if(30<u){var c=s-s%5;u=(o&(1<<c)-1).toString(32),o>>=c,s-=c,eo=1<<32-en(t)+s|n<<s|o,to=u+e}else eo=1<<u|n<<s|o,to=e}function $i(e){e.return!==null&&(Uo(e,1),Hu(e,1,0))}function Mi(e){for(;e===fs;)fs=Nr[--Pr],Nr[Pr]=null,ms=Nr[--Pr],Nr[Pr]=null;for(;e===Ho;)Ho=dn[--fn],dn[fn]=null,to=dn[--fn],dn[fn]=null,eo=dn[--fn],dn[fn]=null}var rn=null,ln=null,at=!1,wn=null;function Uu(e,t){var n=_n(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Vu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,rn=e,ln=po(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,rn=e,ln=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Ho!==null?{id:eo,overflow:to}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=_n(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,rn=e,ln=null,!0):!1;default:return!1}}function zi(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Oi(e){if(at){var t=ln;if(t){var n=t;if(!Vu(e,t)){if(zi(e))throw Error(a(418));t=po(n.nextSibling);var o=rn;t&&Vu(e,t)?Uu(o,n):(e.flags=e.flags&-4097|2,at=!1,rn=e)}}else{if(zi(e))throw Error(a(418));e.flags=e.flags&-4097|2,at=!1,rn=e}}}function Xu(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;rn=e}function ps(e){if(e!==rn)return!1;if(!at)return Xu(e),at=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ni(e.type,e.memoizedProps)),t&&(t=ln)){if(zi(e))throw Qu(),Error(a(418));for(;t;)Uu(e,t),t=po(t.nextSibling)}if(Xu(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(a(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ln=po(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ln=null}}else ln=rn?po(e.stateNode.nextSibling):null;return!0}function Qu(){for(var e=ln;e;)e=po(e.nextSibling)}function Rr(){ln=rn=null,at=!1}function Fi(e){wn===null?wn=[e]:wn.push(e)}var lm=ie.ReactCurrentBatchConfig;function hl(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(a(309));var o=n.stateNode}if(!o)throw Error(a(147,e));var s=o,u=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===u?t.ref:(t=function(c){var S=s.refs;c===null?delete S[u]:S[u]=c},t._stringRef=u,t)}if(typeof e!="string")throw Error(a(284));if(!n._owner)throw Error(a(290,e))}return e}function hs(e,t){throw e=Object.prototype.toString.call(t),Error(a(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Gu(e){var t=e._init;return t(e._payload)}function Ku(e){function t(z,T){if(e){var O=z.deletions;O===null?(z.deletions=[T],z.flags|=16):O.push(T)}}function n(z,T){if(!e)return null;for(;T!==null;)t(z,T),T=T.sibling;return null}function o(z,T){for(z=new Map;T!==null;)T.key!==null?z.set(T.key,T):z.set(T.index,T),T=T.sibling;return z}function s(z,T){return z=So(z,T),z.index=0,z.sibling=null,z}function u(z,T,O){return z.index=O,e?(O=z.alternate,O!==null?(O=O.index,O<T?(z.flags|=2,T):O):(z.flags|=2,T)):(z.flags|=1048576,T)}function c(z){return e&&z.alternate===null&&(z.flags|=2),z}function S(z,T,O,ae){return T===null||T.tag!==6?(T=Pa(O,z.mode,ae),T.return=z,T):(T=s(T,O),T.return=z,T)}function P(z,T,O,ae){var be=O.type;return be===M?oe(z,T,O.props.children,ae,O.key):T!==null&&(T.elementType===be||typeof be=="object"&&be!==null&&be.$$typeof===F&&Gu(be)===T.type)?(ae=s(T,O.props),ae.ref=hl(z,T,O),ae.return=z,ae):(ae=Ds(O.type,O.key,O.props,null,z.mode,ae),ae.ref=hl(z,T,O),ae.return=z,ae)}function B(z,T,O,ae){return T===null||T.tag!==4||T.stateNode.containerInfo!==O.containerInfo||T.stateNode.implementation!==O.implementation?(T=Ra(O,z.mode,ae),T.return=z,T):(T=s(T,O.children||[]),T.return=z,T)}function oe(z,T,O,ae,be){return T===null||T.tag!==7?(T=qo(O,z.mode,ae,be),T.return=z,T):(T=s(T,O),T.return=z,T)}function se(z,T,O){if(typeof T=="string"&&T!==""||typeof T=="number")return T=Pa(""+T,z.mode,O),T.return=z,T;if(typeof T=="object"&&T!==null){switch(T.$$typeof){case le:return O=Ds(T.type,T.key,T.props,null,z.mode,O),O.ref=hl(z,null,T),O.return=z,O;case re:return T=Ra(T,z.mode,O),T.return=z,T;case F:var ae=T._init;return se(z,ae(T._payload),O)}if(Hn(T)||H(T))return T=qo(T,z.mode,O,null),T.return=z,T;hs(z,T)}return null}function ne(z,T,O,ae){var be=T!==null?T.key:null;if(typeof O=="string"&&O!==""||typeof O=="number")return be!==null?null:S(z,T,""+O,ae);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case le:return O.key===be?P(z,T,O,ae):null;case re:return O.key===be?B(z,T,O,ae):null;case F:return be=O._init,ne(z,T,be(O._payload),ae)}if(Hn(O)||H(O))return be!==null?null:oe(z,T,O,ae,null);hs(z,O)}return null}function fe(z,T,O,ae,be){if(typeof ae=="string"&&ae!==""||typeof ae=="number")return z=z.get(O)||null,S(T,z,""+ae,be);if(typeof ae=="object"&&ae!==null){switch(ae.$$typeof){case le:return z=z.get(ae.key===null?O:ae.key)||null,P(T,z,ae,be);case re:return z=z.get(ae.key===null?O:ae.key)||null,B(T,z,ae,be);case F:var Ee=ae._init;return fe(z,T,O,Ee(ae._payload),be)}if(Hn(ae)||H(ae))return z=z.get(O)||null,oe(T,z,ae,be,null);hs(T,ae)}return null}function ye(z,T,O,ae){for(var be=null,Ee=null,Ne=T,Ie=T=0,Et=null;Ne!==null&&Ie<O.length;Ie++){Ne.index>Ie?(Et=Ne,Ne=null):Et=Ne.sibling;var Qe=ne(z,Ne,O[Ie],ae);if(Qe===null){Ne===null&&(Ne=Et);break}e&&Ne&&Qe.alternate===null&&t(z,Ne),T=u(Qe,T,Ie),Ee===null?be=Qe:Ee.sibling=Qe,Ee=Qe,Ne=Et}if(Ie===O.length)return n(z,Ne),at&&Uo(z,Ie),be;if(Ne===null){for(;Ie<O.length;Ie++)Ne=se(z,O[Ie],ae),Ne!==null&&(T=u(Ne,T,Ie),Ee===null?be=Ne:Ee.sibling=Ne,Ee=Ne);return at&&Uo(z,Ie),be}for(Ne=o(z,Ne);Ie<O.length;Ie++)Et=fe(Ne,z,Ie,O[Ie],ae),Et!==null&&(e&&Et.alternate!==null&&Ne.delete(Et.key===null?Ie:Et.key),T=u(Et,T,Ie),Ee===null?be=Et:Ee.sibling=Et,Ee=Et);return e&&Ne.forEach(function(jo){return t(z,jo)}),at&&Uo(z,Ie),be}function xe(z,T,O,ae){var be=H(O);if(typeof be!="function")throw Error(a(150));if(O=be.call(O),O==null)throw Error(a(151));for(var Ee=be=null,Ne=T,Ie=T=0,Et=null,Qe=O.next();Ne!==null&&!Qe.done;Ie++,Qe=O.next()){Ne.index>Ie?(Et=Ne,Ne=null):Et=Ne.sibling;var jo=ne(z,Ne,Qe.value,ae);if(jo===null){Ne===null&&(Ne=Et);break}e&&Ne&&jo.alternate===null&&t(z,Ne),T=u(jo,T,Ie),Ee===null?be=jo:Ee.sibling=jo,Ee=jo,Ne=Et}if(Qe.done)return n(z,Ne),at&&Uo(z,Ie),be;if(Ne===null){for(;!Qe.done;Ie++,Qe=O.next())Qe=se(z,Qe.value,ae),Qe!==null&&(T=u(Qe,T,Ie),Ee===null?be=Qe:Ee.sibling=Qe,Ee=Qe);return at&&Uo(z,Ie),be}for(Ne=o(z,Ne);!Qe.done;Ie++,Qe=O.next())Qe=fe(Ne,z,Ie,Qe.value,ae),Qe!==null&&(e&&Qe.alternate!==null&&Ne.delete(Qe.key===null?Ie:Qe.key),T=u(Qe,T,Ie),Ee===null?be=Qe:Ee.sibling=Qe,Ee=Qe);return e&&Ne.forEach(function(Fm){return t(z,Fm)}),at&&Uo(z,Ie),be}function ht(z,T,O,ae){if(typeof O=="object"&&O!==null&&O.type===M&&O.key===null&&(O=O.props.children),typeof O=="object"&&O!==null){switch(O.$$typeof){case le:e:{for(var be=O.key,Ee=T;Ee!==null;){if(Ee.key===be){if(be=O.type,be===M){if(Ee.tag===7){n(z,Ee.sibling),T=s(Ee,O.props.children),T.return=z,z=T;break e}}else if(Ee.elementType===be||typeof be=="object"&&be!==null&&be.$$typeof===F&&Gu(be)===Ee.type){n(z,Ee.sibling),T=s(Ee,O.props),T.ref=hl(z,Ee,O),T.return=z,z=T;break e}n(z,Ee);break}else t(z,Ee);Ee=Ee.sibling}O.type===M?(T=qo(O.props.children,z.mode,ae,O.key),T.return=z,z=T):(ae=Ds(O.type,O.key,O.props,null,z.mode,ae),ae.ref=hl(z,T,O),ae.return=z,z=ae)}return c(z);case re:e:{for(Ee=O.key;T!==null;){if(T.key===Ee)if(T.tag===4&&T.stateNode.containerInfo===O.containerInfo&&T.stateNode.implementation===O.implementation){n(z,T.sibling),T=s(T,O.children||[]),T.return=z,z=T;break e}else{n(z,T);break}else t(z,T);T=T.sibling}T=Ra(O,z.mode,ae),T.return=z,z=T}return c(z);case F:return Ee=O._init,ht(z,T,Ee(O._payload),ae)}if(Hn(O))return ye(z,T,O,ae);if(H(O))return xe(z,T,O,ae);hs(z,O)}return typeof O=="string"&&O!==""||typeof O=="number"?(O=""+O,T!==null&&T.tag===6?(n(z,T.sibling),T=s(T,O),T.return=z,z=T):(n(z,T),T=Pa(O,z.mode,ae),T.return=z,z=T),c(z)):n(z,T)}return ht}var Lr=Ku(!0),Zu=Ku(!1),_s=ho(null),gs=null,Tr=null,Di=null;function Ai(){Di=Tr=gs=null}function Bi(e){var t=_s.current;rt(_s),e._currentValue=t}function Wi(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function Ir(e,t){gs=e,Di=Tr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Qt=!0),e.firstContext=null)}function mn(e){var t=e._currentValue;if(Di!==e)if(e={context:e,memoizedValue:t,next:null},Tr===null){if(gs===null)throw Error(a(308));Tr=e,gs.dependencies={lanes:0,firstContext:e}}else Tr=Tr.next=e;return t}var Vo=null;function Yi(e){Vo===null?Vo=[e]:Vo.push(e)}function Ju(e,t,n,o){var s=t.interleaved;return s===null?(n.next=n,Yi(t)):(n.next=s.next,s.next=n),t.interleaved=n,no(e,o)}function no(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var yo=!1;function Hi(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function qu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function oo(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function xo(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Xe&2)!==0){var s=o.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),o.pending=t,no(e,n)}return s=o.interleaved,s===null?(t.next=t,Yi(o)):(t.next=s.next,s.next=t),o.interleaved=t,no(e,n)}function ys(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,pr(e,n)}}function ec(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var s=null,u=null;if(n=n.firstBaseUpdate,n!==null){do{var c={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};u===null?s=u=c:u=u.next=c,n=n.next}while(n!==null);u===null?s=u=t:u=u.next=t}else s=u=t;n={baseState:o.baseState,firstBaseUpdate:s,lastBaseUpdate:u,shared:o.shared,effects:o.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function xs(e,t,n,o){var s=e.updateQueue;yo=!1;var u=s.firstBaseUpdate,c=s.lastBaseUpdate,S=s.shared.pending;if(S!==null){s.shared.pending=null;var P=S,B=P.next;P.next=null,c===null?u=B:c.next=B,c=P;var oe=e.alternate;oe!==null&&(oe=oe.updateQueue,S=oe.lastBaseUpdate,S!==c&&(S===null?oe.firstBaseUpdate=B:S.next=B,oe.lastBaseUpdate=P))}if(u!==null){var se=s.baseState;c=0,oe=B=P=null,S=u;do{var ne=S.lane,fe=S.eventTime;if((o&ne)===ne){oe!==null&&(oe=oe.next={eventTime:fe,lane:0,tag:S.tag,payload:S.payload,callback:S.callback,next:null});e:{var ye=e,xe=S;switch(ne=t,fe=n,xe.tag){case 1:if(ye=xe.payload,typeof ye=="function"){se=ye.call(fe,se,ne);break e}se=ye;break e;case 3:ye.flags=ye.flags&-65537|128;case 0:if(ye=xe.payload,ne=typeof ye=="function"?ye.call(fe,se,ne):ye,ne==null)break e;se=X({},se,ne);break e;case 2:yo=!0}}S.callback!==null&&S.lane!==0&&(e.flags|=64,ne=s.effects,ne===null?s.effects=[S]:ne.push(S))}else fe={eventTime:fe,lane:ne,tag:S.tag,payload:S.payload,callback:S.callback,next:null},oe===null?(B=oe=fe,P=se):oe=oe.next=fe,c|=ne;if(S=S.next,S===null){if(S=s.shared.pending,S===null)break;ne=S,S=ne.next,ne.next=null,s.lastBaseUpdate=ne,s.shared.pending=null}}while(!0);if(oe===null&&(P=se),s.baseState=P,s.firstBaseUpdate=B,s.lastBaseUpdate=oe,t=s.shared.interleaved,t!==null){s=t;do c|=s.lane,s=s.next;while(s!==t)}else u===null&&(s.shared.lanes=0);Go|=c,e.lanes=c,e.memoizedState=se}}function tc(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],s=o.callback;if(s!==null){if(o.callback=null,o=n,typeof s!="function")throw Error(a(191,s));s.call(o)}}}var _l={},On=ho(_l),gl=ho(_l),yl=ho(_l);function Xo(e){if(e===_l)throw Error(a(174));return e}function Ui(e,t){switch(tt(yl,t),tt(gl,e),tt(On,_l),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:rr(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=rr(t,e)}rt(On),tt(On,t)}function $r(){rt(On),rt(gl),rt(yl)}function nc(e){Xo(yl.current);var t=Xo(On.current),n=rr(t,e.type);t!==n&&(tt(gl,e),tt(On,n))}function Vi(e){gl.current===e&&(rt(On),rt(gl))}var ct=ho(0);function vs(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Xi=[];function Qi(){for(var e=0;e<Xi.length;e++)Xi[e]._workInProgressVersionPrimary=null;Xi.length=0}var bs=ie.ReactCurrentDispatcher,Gi=ie.ReactCurrentBatchConfig,Qo=0,dt=null,wt=null,St=null,ws=!1,xl=!1,vl=0,sm=0;function Ot(){throw Error(a(321))}function Ki(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!bn(e[n],t[n]))return!1;return!0}function Zi(e,t,n,o,s,u){if(Qo=u,dt=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,bs.current=e===null||e.memoizedState===null?cm:dm,e=n(o,s),xl){u=0;do{if(xl=!1,vl=0,25<=u)throw Error(a(301));u+=1,St=wt=null,t.updateQueue=null,bs.current=fm,e=n(o,s)}while(xl)}if(bs.current=Ss,t=wt!==null&&wt.next!==null,Qo=0,St=wt=dt=null,ws=!1,t)throw Error(a(300));return e}function Ji(){var e=vl!==0;return vl=0,e}function Fn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return St===null?dt.memoizedState=St=e:St=St.next=e,St}function pn(){if(wt===null){var e=dt.alternate;e=e!==null?e.memoizedState:null}else e=wt.next;var t=St===null?dt.memoizedState:St.next;if(t!==null)St=t,wt=e;else{if(e===null)throw Error(a(310));wt=e,e={memoizedState:wt.memoizedState,baseState:wt.baseState,baseQueue:wt.baseQueue,queue:wt.queue,next:null},St===null?dt.memoizedState=St=e:St=St.next=e}return St}function bl(e,t){return typeof t=="function"?t(e):t}function qi(e){var t=pn(),n=t.queue;if(n===null)throw Error(a(311));n.lastRenderedReducer=e;var o=wt,s=o.baseQueue,u=n.pending;if(u!==null){if(s!==null){var c=s.next;s.next=u.next,u.next=c}o.baseQueue=s=u,n.pending=null}if(s!==null){u=s.next,o=o.baseState;var S=c=null,P=null,B=u;do{var oe=B.lane;if((Qo&oe)===oe)P!==null&&(P=P.next={lane:0,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null}),o=B.hasEagerState?B.eagerState:e(o,B.action);else{var se={lane:oe,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null};P===null?(S=P=se,c=o):P=P.next=se,dt.lanes|=oe,Go|=oe}B=B.next}while(B!==null&&B!==u);P===null?c=o:P.next=S,bn(o,t.memoizedState)||(Qt=!0),t.memoizedState=o,t.baseState=c,t.baseQueue=P,n.lastRenderedState=o}if(e=n.interleaved,e!==null){s=e;do u=s.lane,dt.lanes|=u,Go|=u,s=s.next;while(s!==e)}else s===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function ea(e){var t=pn(),n=t.queue;if(n===null)throw Error(a(311));n.lastRenderedReducer=e;var o=n.dispatch,s=n.pending,u=t.memoizedState;if(s!==null){n.pending=null;var c=s=s.next;do u=e(u,c.action),c=c.next;while(c!==s);bn(u,t.memoizedState)||(Qt=!0),t.memoizedState=u,t.baseQueue===null&&(t.baseState=u),n.lastRenderedState=u}return[u,o]}function oc(){}function rc(e,t){var n=dt,o=pn(),s=t(),u=!bn(o.memoizedState,s);if(u&&(o.memoizedState=s,Qt=!0),o=o.queue,ta(ic.bind(null,n,o,e),[e]),o.getSnapshot!==t||u||St!==null&&St.memoizedState.tag&1){if(n.flags|=2048,wl(9,sc.bind(null,n,o,s,t),void 0,null),jt===null)throw Error(a(349));(Qo&30)!==0||lc(n,t,s)}return s}function lc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=dt.updateQueue,t===null?(t={lastEffect:null,stores:null},dt.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function sc(e,t,n,o){t.value=n,t.getSnapshot=o,ac(t)&&uc(e)}function ic(e,t,n){return n(function(){ac(t)&&uc(e)})}function ac(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!bn(e,n)}catch{return!0}}function uc(e){var t=no(e,1);t!==null&&jn(t,e,1,-1)}function cc(e){var t=Fn();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:bl,lastRenderedState:e},t.queue=e,e=e.dispatch=um.bind(null,dt,e),[t.memoizedState,e]}function wl(e,t,n,o){return e={tag:e,create:t,destroy:n,deps:o,next:null},t=dt.updateQueue,t===null?(t={lastEffect:null,stores:null},dt.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e)),e}function dc(){return pn().memoizedState}function ks(e,t,n,o){var s=Fn();dt.flags|=e,s.memoizedState=wl(1|t,n,void 0,o===void 0?null:o)}function Cs(e,t,n,o){var s=pn();o=o===void 0?null:o;var u=void 0;if(wt!==null){var c=wt.memoizedState;if(u=c.destroy,o!==null&&Ki(o,c.deps)){s.memoizedState=wl(t,n,u,o);return}}dt.flags|=e,s.memoizedState=wl(1|t,n,u,o)}function fc(e,t){return ks(8390656,8,e,t)}function ta(e,t){return Cs(2048,8,e,t)}function mc(e,t){return Cs(4,2,e,t)}function pc(e,t){return Cs(4,4,e,t)}function hc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function _c(e,t,n){return n=n!=null?n.concat([e]):null,Cs(4,4,hc.bind(null,t,e),n)}function na(){}function gc(e,t){var n=pn();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Ki(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function yc(e,t){var n=pn();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Ki(t,o[1])?o[0]:(e=e(),n.memoizedState=[e,t],e)}function xc(e,t,n){return(Qo&21)===0?(e.baseState&&(e.baseState=!1,Qt=!0),e.memoizedState=n):(bn(n,t)||(n=tl(),dt.lanes|=n,Go|=n,e.baseState=!0),t)}function im(e,t){var n=He;He=n!==0&&4>n?n:4,e(!0);var o=Gi.transition;Gi.transition={};try{e(!1),t()}finally{He=n,Gi.transition=o}}function vc(){return pn().memoizedState}function am(e,t,n){var o=ko(e);if(n={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null},bc(e))wc(t,n);else if(n=Ju(e,t,n,o),n!==null){var s=Wt();jn(n,e,o,s),kc(n,t,o)}}function um(e,t,n){var o=ko(e),s={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null};if(bc(e))wc(t,s);else{var u=e.alternate;if(e.lanes===0&&(u===null||u.lanes===0)&&(u=t.lastRenderedReducer,u!==null))try{var c=t.lastRenderedState,S=u(c,n);if(s.hasEagerState=!0,s.eagerState=S,bn(S,c)){var P=t.interleaved;P===null?(s.next=s,Yi(t)):(s.next=P.next,P.next=s),t.interleaved=s;return}}catch{}finally{}n=Ju(e,t,s,o),n!==null&&(s=Wt(),jn(n,e,o,s),kc(n,t,o))}}function bc(e){var t=e.alternate;return e===dt||t!==null&&t===dt}function wc(e,t){xl=ws=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function kc(e,t,n){if((n&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,pr(e,n)}}var Ss={readContext:mn,useCallback:Ot,useContext:Ot,useEffect:Ot,useImperativeHandle:Ot,useInsertionEffect:Ot,useLayoutEffect:Ot,useMemo:Ot,useReducer:Ot,useRef:Ot,useState:Ot,useDebugValue:Ot,useDeferredValue:Ot,useTransition:Ot,useMutableSource:Ot,useSyncExternalStore:Ot,useId:Ot,unstable_isNewReconciler:!1},cm={readContext:mn,useCallback:function(e,t){return Fn().memoizedState=[e,t===void 0?null:t],e},useContext:mn,useEffect:fc,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ks(4194308,4,hc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ks(4194308,4,e,t)},useInsertionEffect:function(e,t){return ks(4,2,e,t)},useMemo:function(e,t){var n=Fn();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var o=Fn();return t=n!==void 0?n(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=am.bind(null,dt,e),[o.memoizedState,e]},useRef:function(e){var t=Fn();return e={current:e},t.memoizedState=e},useState:cc,useDebugValue:na,useDeferredValue:function(e){return Fn().memoizedState=e},useTransition:function(){var e=cc(!1),t=e[0];return e=im.bind(null,e[1]),Fn().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var o=dt,s=Fn();if(at){if(n===void 0)throw Error(a(407));n=n()}else{if(n=t(),jt===null)throw Error(a(349));(Qo&30)!==0||lc(o,t,n)}s.memoizedState=n;var u={value:n,getSnapshot:t};return s.queue=u,fc(ic.bind(null,o,u,e),[e]),o.flags|=2048,wl(9,sc.bind(null,o,u,n,t),void 0,null),n},useId:function(){var e=Fn(),t=jt.identifierPrefix;if(at){var n=to,o=eo;n=(o&~(1<<32-en(o)-1)).toString(32)+n,t=":"+t+"R"+n,n=vl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=sm++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},dm={readContext:mn,useCallback:gc,useContext:mn,useEffect:ta,useImperativeHandle:_c,useInsertionEffect:mc,useLayoutEffect:pc,useMemo:yc,useReducer:qi,useRef:dc,useState:function(){return qi(bl)},useDebugValue:na,useDeferredValue:function(e){var t=pn();return xc(t,wt.memoizedState,e)},useTransition:function(){var e=qi(bl)[0],t=pn().memoizedState;return[e,t]},useMutableSource:oc,useSyncExternalStore:rc,useId:vc,unstable_isNewReconciler:!1},fm={readContext:mn,useCallback:gc,useContext:mn,useEffect:ta,useImperativeHandle:_c,useInsertionEffect:mc,useLayoutEffect:pc,useMemo:yc,useReducer:ea,useRef:dc,useState:function(){return ea(bl)},useDebugValue:na,useDeferredValue:function(e){var t=pn();return wt===null?t.memoizedState=e:xc(t,wt.memoizedState,e)},useTransition:function(){var e=ea(bl)[0],t=pn().memoizedState;return[e,t]},useMutableSource:oc,useSyncExternalStore:rc,useId:vc,unstable_isNewReconciler:!1};function kn(e,t){if(e&&e.defaultProps){t=X({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function oa(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:X({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var js={isMounted:function(e){return(e=e._reactInternals)?pt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var o=Wt(),s=ko(e),u=oo(o,s);u.payload=t,n!=null&&(u.callback=n),t=xo(e,u,s),t!==null&&(jn(t,e,s,o),ys(t,e,s))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=Wt(),s=ko(e),u=oo(o,s);u.tag=1,u.payload=t,n!=null&&(u.callback=n),t=xo(e,u,s),t!==null&&(jn(t,e,s,o),ys(t,e,s))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Wt(),o=ko(e),s=oo(n,o);s.tag=2,t!=null&&(s.callback=t),t=xo(e,s,o),t!==null&&(jn(t,e,o,n),ys(t,e,o))}};function Cc(e,t,n,o,s,u,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,u,c):t.prototype&&t.prototype.isPureReactComponent?!al(n,o)||!al(s,u):!0}function Sc(e,t,n){var o=!1,s=_o,u=t.contextType;return typeof u=="object"&&u!==null?u=mn(u):(s=Xt(t)?Yo:zt.current,o=t.contextTypes,u=(o=o!=null)?Er(e,s):_o),t=new t(n,u),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=js,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=u),t}function jc(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&js.enqueueReplaceState(t,t.state,null)}function ra(e,t,n,o){var s=e.stateNode;s.props=n,s.state=e.memoizedState,s.refs={},Hi(e);var u=t.contextType;typeof u=="object"&&u!==null?s.context=mn(u):(u=Xt(t)?Yo:zt.current,s.context=Er(e,u)),s.state=e.memoizedState,u=t.getDerivedStateFromProps,typeof u=="function"&&(oa(e,t,u,n),s.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(t=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),t!==s.state&&js.enqueueReplaceState(s,s.state,null),xs(e,n,s,o),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function Mr(e,t){try{var n="",o=t;do n+=W(o),o=o.return;while(o);var s=n}catch(u){s=`
Error generating stack: `+u.message+`
`+u.stack}return{value:e,source:t,stack:s,digest:null}}function la(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function sa(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var mm=typeof WeakMap=="function"?WeakMap:Map;function Ec(e,t,n){n=oo(-1,n),n.tag=3,n.payload={element:null};var o=t.value;return n.callback=function(){Is||(Is=!0,ba=o),sa(e,t)},n}function Nc(e,t,n){n=oo(-1,n),n.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var s=t.value;n.payload=function(){return o(s)},n.callback=function(){sa(e,t)}}var u=e.stateNode;return u!==null&&typeof u.componentDidCatch=="function"&&(n.callback=function(){sa(e,t),typeof o!="function"&&(bo===null?bo=new Set([this]):bo.add(this));var c=t.stack;this.componentDidCatch(t.value,{componentStack:c!==null?c:""})}),n}function Pc(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new mm;var s=new Set;o.set(t,s)}else s=o.get(t),s===void 0&&(s=new Set,o.set(t,s));s.has(n)||(s.add(n),e=Em.bind(null,e,t,n),t.then(e,e))}function Rc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Lc(e,t,n,o,s){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=oo(-1,1),t.tag=2,xo(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=s,e)}var pm=ie.ReactCurrentOwner,Qt=!1;function Bt(e,t,n,o){t.child=e===null?Zu(t,null,n,o):Lr(t,e.child,n,o)}function Tc(e,t,n,o,s){n=n.render;var u=t.ref;return Ir(t,s),o=Zi(e,t,n,o,u,s),n=Ji(),e!==null&&!Qt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,ro(e,t,s)):(at&&n&&$i(t),t.flags|=1,Bt(e,t,o,s),t.child)}function Ic(e,t,n,o,s){if(e===null){var u=n.type;return typeof u=="function"&&!Na(u)&&u.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=u,$c(e,t,u,o,s)):(e=Ds(n.type,null,o,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(u=e.child,(e.lanes&s)===0){var c=u.memoizedProps;if(n=n.compare,n=n!==null?n:al,n(c,o)&&e.ref===t.ref)return ro(e,t,s)}return t.flags|=1,e=So(u,o),e.ref=t.ref,e.return=t,t.child=e}function $c(e,t,n,o,s){if(e!==null){var u=e.memoizedProps;if(al(u,o)&&e.ref===t.ref)if(Qt=!1,t.pendingProps=o=u,(e.lanes&s)!==0)(e.flags&131072)!==0&&(Qt=!0);else return t.lanes=e.lanes,ro(e,t,s)}return ia(e,t,n,o,s)}function Mc(e,t,n){var o=t.pendingProps,s=o.children,u=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},tt(Or,sn),sn|=n;else{if((n&1073741824)===0)return e=u!==null?u.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,tt(Or,sn),sn|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=u!==null?u.baseLanes:n,tt(Or,sn),sn|=o}else u!==null?(o=u.baseLanes|n,t.memoizedState=null):o=n,tt(Or,sn),sn|=o;return Bt(e,t,s,n),t.child}function zc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ia(e,t,n,o,s){var u=Xt(n)?Yo:zt.current;return u=Er(t,u),Ir(t,s),n=Zi(e,t,n,o,u,s),o=Ji(),e!==null&&!Qt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,ro(e,t,s)):(at&&o&&$i(t),t.flags|=1,Bt(e,t,n,s),t.child)}function Oc(e,t,n,o,s){if(Xt(n)){var u=!0;cs(t)}else u=!1;if(Ir(t,s),t.stateNode===null)Ns(e,t),Sc(t,n,o),ra(t,n,o,s),o=!0;else if(e===null){var c=t.stateNode,S=t.memoizedProps;c.props=S;var P=c.context,B=n.contextType;typeof B=="object"&&B!==null?B=mn(B):(B=Xt(n)?Yo:zt.current,B=Er(t,B));var oe=n.getDerivedStateFromProps,se=typeof oe=="function"||typeof c.getSnapshotBeforeUpdate=="function";se||typeof c.UNSAFE_componentWillReceiveProps!="function"&&typeof c.componentWillReceiveProps!="function"||(S!==o||P!==B)&&jc(t,c,o,B),yo=!1;var ne=t.memoizedState;c.state=ne,xs(t,o,c,s),P=t.memoizedState,S!==o||ne!==P||Vt.current||yo?(typeof oe=="function"&&(oa(t,n,oe,o),P=t.memoizedState),(S=yo||Cc(t,n,S,o,ne,P,B))?(se||typeof c.UNSAFE_componentWillMount!="function"&&typeof c.componentWillMount!="function"||(typeof c.componentWillMount=="function"&&c.componentWillMount(),typeof c.UNSAFE_componentWillMount=="function"&&c.UNSAFE_componentWillMount()),typeof c.componentDidMount=="function"&&(t.flags|=4194308)):(typeof c.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=P),c.props=o,c.state=P,c.context=B,o=S):(typeof c.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{c=t.stateNode,qu(e,t),S=t.memoizedProps,B=t.type===t.elementType?S:kn(t.type,S),c.props=B,se=t.pendingProps,ne=c.context,P=n.contextType,typeof P=="object"&&P!==null?P=mn(P):(P=Xt(n)?Yo:zt.current,P=Er(t,P));var fe=n.getDerivedStateFromProps;(oe=typeof fe=="function"||typeof c.getSnapshotBeforeUpdate=="function")||typeof c.UNSAFE_componentWillReceiveProps!="function"&&typeof c.componentWillReceiveProps!="function"||(S!==se||ne!==P)&&jc(t,c,o,P),yo=!1,ne=t.memoizedState,c.state=ne,xs(t,o,c,s);var ye=t.memoizedState;S!==se||ne!==ye||Vt.current||yo?(typeof fe=="function"&&(oa(t,n,fe,o),ye=t.memoizedState),(B=yo||Cc(t,n,B,o,ne,ye,P)||!1)?(oe||typeof c.UNSAFE_componentWillUpdate!="function"&&typeof c.componentWillUpdate!="function"||(typeof c.componentWillUpdate=="function"&&c.componentWillUpdate(o,ye,P),typeof c.UNSAFE_componentWillUpdate=="function"&&c.UNSAFE_componentWillUpdate(o,ye,P)),typeof c.componentDidUpdate=="function"&&(t.flags|=4),typeof c.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof c.componentDidUpdate!="function"||S===e.memoizedProps&&ne===e.memoizedState||(t.flags|=4),typeof c.getSnapshotBeforeUpdate!="function"||S===e.memoizedProps&&ne===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=ye),c.props=o,c.state=ye,c.context=P,o=B):(typeof c.componentDidUpdate!="function"||S===e.memoizedProps&&ne===e.memoizedState||(t.flags|=4),typeof c.getSnapshotBeforeUpdate!="function"||S===e.memoizedProps&&ne===e.memoizedState||(t.flags|=1024),o=!1)}return aa(e,t,n,o,u,s)}function aa(e,t,n,o,s,u){zc(e,t);var c=(t.flags&128)!==0;if(!o&&!c)return s&&Wu(t,n,!1),ro(e,t,u);o=t.stateNode,pm.current=t;var S=c&&typeof n.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&c?(t.child=Lr(t,e.child,null,u),t.child=Lr(t,null,S,u)):Bt(e,t,S,u),t.memoizedState=o.state,s&&Wu(t,n,!0),t.child}function Fc(e){var t=e.stateNode;t.pendingContext?Au(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Au(e,t.context,!1),Ui(e,t.containerInfo)}function Dc(e,t,n,o,s){return Rr(),Fi(s),t.flags|=256,Bt(e,t,n,o),t.child}var ua={dehydrated:null,treeContext:null,retryLane:0};function ca(e){return{baseLanes:e,cachePool:null,transitions:null}}function Ac(e,t,n){var o=t.pendingProps,s=ct.current,u=!1,c=(t.flags&128)!==0,S;if((S=c)||(S=e!==null&&e.memoizedState===null?!1:(s&2)!==0),S?(u=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),tt(ct,s&1),e===null)return Oi(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(c=o.children,e=o.fallback,u?(o=t.mode,u=t.child,c={mode:"hidden",children:c},(o&1)===0&&u!==null?(u.childLanes=0,u.pendingProps=c):u=As(c,o,0,null),e=qo(e,o,n,null),u.return=t,e.return=t,u.sibling=e,t.child=u,t.child.memoizedState=ca(n),t.memoizedState=ua,e):da(t,c));if(s=e.memoizedState,s!==null&&(S=s.dehydrated,S!==null))return hm(e,t,c,o,S,s,n);if(u){u=o.fallback,c=t.mode,s=e.child,S=s.sibling;var P={mode:"hidden",children:o.children};return(c&1)===0&&t.child!==s?(o=t.child,o.childLanes=0,o.pendingProps=P,t.deletions=null):(o=So(s,P),o.subtreeFlags=s.subtreeFlags&14680064),S!==null?u=So(S,u):(u=qo(u,c,n,null),u.flags|=2),u.return=t,o.return=t,o.sibling=u,t.child=o,o=u,u=t.child,c=e.child.memoizedState,c=c===null?ca(n):{baseLanes:c.baseLanes|n,cachePool:null,transitions:c.transitions},u.memoizedState=c,u.childLanes=e.childLanes&~n,t.memoizedState=ua,o}return u=e.child,e=u.sibling,o=So(u,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=n),o.return=t,o.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=o,t.memoizedState=null,o}function da(e,t){return t=As({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Es(e,t,n,o){return o!==null&&Fi(o),Lr(t,e.child,null,n),e=da(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function hm(e,t,n,o,s,u,c){if(n)return t.flags&256?(t.flags&=-257,o=la(Error(a(422))),Es(e,t,c,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(u=o.fallback,s=t.mode,o=As({mode:"visible",children:o.children},s,0,null),u=qo(u,s,c,null),u.flags|=2,o.return=t,u.return=t,o.sibling=u,t.child=o,(t.mode&1)!==0&&Lr(t,e.child,null,c),t.child.memoizedState=ca(c),t.memoizedState=ua,u);if((t.mode&1)===0)return Es(e,t,c,null);if(s.data==="$!"){if(o=s.nextSibling&&s.nextSibling.dataset,o)var S=o.dgst;return o=S,u=Error(a(419)),o=la(u,o,void 0),Es(e,t,c,o)}if(S=(c&e.childLanes)!==0,Qt||S){if(o=jt,o!==null){switch(c&-c){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=(s&(o.suspendedLanes|c))!==0?0:s,s!==0&&s!==u.retryLane&&(u.retryLane=s,no(e,s),jn(o,e,s,-1))}return Ea(),o=la(Error(a(421))),Es(e,t,c,o)}return s.data==="$?"?(t.flags|=128,t.child=e.child,t=Nm.bind(null,e),s._reactRetry=t,null):(e=u.treeContext,ln=po(s.nextSibling),rn=t,at=!0,wn=null,e!==null&&(dn[fn++]=eo,dn[fn++]=to,dn[fn++]=Ho,eo=e.id,to=e.overflow,Ho=t),t=da(t,o.children),t.flags|=4096,t)}function Bc(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),Wi(e.return,t,n)}function fa(e,t,n,o,s){var u=e.memoizedState;u===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:s}:(u.isBackwards=t,u.rendering=null,u.renderingStartTime=0,u.last=o,u.tail=n,u.tailMode=s)}function Wc(e,t,n){var o=t.pendingProps,s=o.revealOrder,u=o.tail;if(Bt(e,t,o.children,n),o=ct.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Bc(e,n,t);else if(e.tag===19)Bc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(tt(ct,o),(t.mode&1)===0)t.memoizedState=null;else switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&vs(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),fa(t,!1,s,n,u);break;case"backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&vs(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}fa(t,!0,n,null,u);break;case"together":fa(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Ns(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function ro(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Go|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(a(153));if(t.child!==null){for(e=t.child,n=So(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=So(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function _m(e,t,n){switch(t.tag){case 3:Fc(t),Rr();break;case 5:nc(t);break;case 1:Xt(t.type)&&cs(t);break;case 4:Ui(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,s=t.memoizedProps.value;tt(_s,o._currentValue),o._currentValue=s;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(tt(ct,ct.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Ac(e,t,n):(tt(ct,ct.current&1),e=ro(e,t,n),e!==null?e.sibling:null);tt(ct,ct.current&1);break;case 19:if(o=(n&t.childLanes)!==0,(e.flags&128)!==0){if(o)return Wc(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),tt(ct,ct.current),o)break;return null;case 22:case 23:return t.lanes=0,Mc(e,t,n)}return ro(e,t,n)}var Yc,ma,Hc,Uc;Yc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},ma=function(){},Hc=function(e,t,n,o){var s=e.memoizedProps;if(s!==o){e=t.stateNode,Xo(On.current);var u=null;switch(n){case"input":s=tr(e,s),o=tr(e,o),u=[];break;case"select":s=X({},s,{value:void 0}),o=X({},o,{value:void 0}),u=[];break;case"textarea":s=or(e,s),o=or(e,o),u=[];break;default:typeof s.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=is)}Ro(n,o);var c;n=null;for(B in s)if(!o.hasOwnProperty(B)&&s.hasOwnProperty(B)&&s[B]!=null)if(B==="style"){var S=s[B];for(c in S)S.hasOwnProperty(c)&&(n||(n={}),n[c]="")}else B!=="dangerouslySetInnerHTML"&&B!=="children"&&B!=="suppressContentEditableWarning"&&B!=="suppressHydrationWarning"&&B!=="autoFocus"&&(p.hasOwnProperty(B)?u||(u=[]):(u=u||[]).push(B,null));for(B in o){var P=o[B];if(S=s!=null?s[B]:void 0,o.hasOwnProperty(B)&&P!==S&&(P!=null||S!=null))if(B==="style")if(S){for(c in S)!S.hasOwnProperty(c)||P&&P.hasOwnProperty(c)||(n||(n={}),n[c]="");for(c in P)P.hasOwnProperty(c)&&S[c]!==P[c]&&(n||(n={}),n[c]=P[c])}else n||(u||(u=[]),u.push(B,n)),n=P;else B==="dangerouslySetInnerHTML"?(P=P?P.__html:void 0,S=S?S.__html:void 0,P!=null&&S!==P&&(u=u||[]).push(B,P)):B==="children"?typeof P!="string"&&typeof P!="number"||(u=u||[]).push(B,""+P):B!=="suppressContentEditableWarning"&&B!=="suppressHydrationWarning"&&(p.hasOwnProperty(B)?(P!=null&&B==="onScroll"&&ot("scroll",e),u||S===P||(u=[])):(u=u||[]).push(B,P))}n&&(u=u||[]).push("style",n);var B=u;(t.updateQueue=B)&&(t.flags|=4)}},Uc=function(e,t,n,o){n!==o&&(t.flags|=4)};function kl(e,t){if(!at)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Ft(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,o|=s.subtreeFlags&14680064,o|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,o|=s.subtreeFlags,o|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function gm(e,t,n){var o=t.pendingProps;switch(Mi(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ft(t),null;case 1:return Xt(t.type)&&us(),Ft(t),null;case 3:return o=t.stateNode,$r(),rt(Vt),rt(zt),Qi(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(ps(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,wn!==null&&(Ca(wn),wn=null))),ma(e,t),Ft(t),null;case 5:Vi(t);var s=Xo(yl.current);if(n=t.type,e!==null&&t.stateNode!=null)Hc(e,t,n,o,s),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(a(166));return Ft(t),null}if(e=Xo(On.current),ps(t)){o=t.stateNode,n=t.type;var u=t.memoizedProps;switch(o[zn]=t,o[ml]=u,e=(t.mode&1)!==0,n){case"dialog":ot("cancel",o),ot("close",o);break;case"iframe":case"object":case"embed":ot("load",o);break;case"video":case"audio":for(s=0;s<cl.length;s++)ot(cl[s],o);break;case"source":ot("error",o);break;case"img":case"image":case"link":ot("error",o),ot("load",o);break;case"details":ot("toggle",o);break;case"input":Vr(o,u),ot("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!u.multiple},ot("invalid",o);break;case"textarea":Nn(o,u),ot("invalid",o)}Ro(n,u),s=null;for(var c in u)if(u.hasOwnProperty(c)){var S=u[c];c==="children"?typeof S=="string"?o.textContent!==S&&(u.suppressHydrationWarning!==!0&&ss(o.textContent,S,e),s=["children",S]):typeof S=="number"&&o.textContent!==""+S&&(u.suppressHydrationWarning!==!0&&ss(o.textContent,S,e),s=["children",""+S]):p.hasOwnProperty(c)&&S!=null&&c==="onScroll"&&ot("scroll",o)}switch(n){case"input":an(o),Me(o,u,!0);break;case"textarea":an(o),Xr(o);break;case"select":case"option":break;default:typeof u.onClick=="function"&&(o.onclick=is)}o=s,t.updateQueue=o,o!==null&&(t.flags|=4)}else{c=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Qr(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=c.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=c.createElement(n,{is:o.is}):(e=c.createElement(n),n==="select"&&(c=e,o.multiple?c.multiple=!0:o.size&&(c.size=o.size))):e=c.createElementNS(e,n),e[zn]=t,e[ml]=o,Yc(e,t,!1,!1),t.stateNode=e;e:{switch(c=Lo(n,o),n){case"dialog":ot("cancel",e),ot("close",e),s=o;break;case"iframe":case"object":case"embed":ot("load",e),s=o;break;case"video":case"audio":for(s=0;s<cl.length;s++)ot(cl[s],e);s=o;break;case"source":ot("error",e),s=o;break;case"img":case"image":case"link":ot("error",e),ot("load",e),s=o;break;case"details":ot("toggle",e),s=o;break;case"input":Vr(e,o),s=tr(e,o),ot("invalid",e);break;case"option":s=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},s=X({},o,{value:void 0}),ot("invalid",e);break;case"textarea":Nn(e,o),s=or(e,o),ot("invalid",e);break;default:s=o}Ro(n,s),S=s;for(u in S)if(S.hasOwnProperty(u)){var P=S[u];u==="style"?Wl(e,P):u==="dangerouslySetInnerHTML"?(P=P?P.__html:void 0,P!=null&&Bl(e,P)):u==="children"?typeof P=="string"?(n!=="textarea"||P!=="")&&Pt(e,P):typeof P=="number"&&Pt(e,""+P):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(p.hasOwnProperty(u)?P!=null&&u==="onScroll"&&ot("scroll",e):P!=null&&ee(e,u,P,c))}switch(n){case"input":an(e),Me(e,o,!1);break;case"textarea":an(e),Xr(e);break;case"option":o.value!=null&&e.setAttribute("value",""+Le(o.value));break;case"select":e.multiple=!!o.multiple,u=o.value,u!=null?It(e,!!o.multiple,u,!1):o.defaultValue!=null&&It(e,!!o.multiple,o.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=is)}switch(n){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ft(t),null;case 6:if(e&&t.stateNode!=null)Uc(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(a(166));if(n=Xo(yl.current),Xo(On.current),ps(t)){if(o=t.stateNode,n=t.memoizedProps,o[zn]=t,(u=o.nodeValue!==n)&&(e=rn,e!==null))switch(e.tag){case 3:ss(o.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ss(o.nodeValue,n,(e.mode&1)!==0)}u&&(t.flags|=4)}else o=(n.nodeType===9?n:n.ownerDocument).createTextNode(o),o[zn]=t,t.stateNode=o}return Ft(t),null;case 13:if(rt(ct),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(at&&ln!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Qu(),Rr(),t.flags|=98560,u=!1;else if(u=ps(t),o!==null&&o.dehydrated!==null){if(e===null){if(!u)throw Error(a(318));if(u=t.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(a(317));u[zn]=t}else Rr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ft(t),u=!1}else wn!==null&&(Ca(wn),wn=null),u=!0;if(!u)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(ct.current&1)!==0?kt===0&&(kt=3):Ea())),t.updateQueue!==null&&(t.flags|=4),Ft(t),null);case 4:return $r(),ma(e,t),e===null&&dl(t.stateNode.containerInfo),Ft(t),null;case 10:return Bi(t.type._context),Ft(t),null;case 17:return Xt(t.type)&&us(),Ft(t),null;case 19:if(rt(ct),u=t.memoizedState,u===null)return Ft(t),null;if(o=(t.flags&128)!==0,c=u.rendering,c===null)if(o)kl(u,!1);else{if(kt!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(c=vs(e),c!==null){for(t.flags|=128,kl(u,!1),o=c.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=n,n=t.child;n!==null;)u=n,e=o,u.flags&=14680066,c=u.alternate,c===null?(u.childLanes=0,u.lanes=e,u.child=null,u.subtreeFlags=0,u.memoizedProps=null,u.memoizedState=null,u.updateQueue=null,u.dependencies=null,u.stateNode=null):(u.childLanes=c.childLanes,u.lanes=c.lanes,u.child=c.child,u.subtreeFlags=0,u.deletions=null,u.memoizedProps=c.memoizedProps,u.memoizedState=c.memoizedState,u.updateQueue=c.updateQueue,u.type=c.type,e=c.dependencies,u.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return tt(ct,ct.current&1|2),t.child}e=e.sibling}u.tail!==null&&lt()>Fr&&(t.flags|=128,o=!0,kl(u,!1),t.lanes=4194304)}else{if(!o)if(e=vs(c),e!==null){if(t.flags|=128,o=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),kl(u,!0),u.tail===null&&u.tailMode==="hidden"&&!c.alternate&&!at)return Ft(t),null}else 2*lt()-u.renderingStartTime>Fr&&n!==1073741824&&(t.flags|=128,o=!0,kl(u,!1),t.lanes=4194304);u.isBackwards?(c.sibling=t.child,t.child=c):(n=u.last,n!==null?n.sibling=c:t.child=c,u.last=c)}return u.tail!==null?(t=u.tail,u.rendering=t,u.tail=t.sibling,u.renderingStartTime=lt(),t.sibling=null,n=ct.current,tt(ct,o?n&1|2:n&1),t):(Ft(t),null);case 22:case 23:return ja(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(sn&1073741824)!==0&&(Ft(t),t.subtreeFlags&6&&(t.flags|=8192)):Ft(t),null;case 24:return null;case 25:return null}throw Error(a(156,t.tag))}function ym(e,t){switch(Mi(t),t.tag){case 1:return Xt(t.type)&&us(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return $r(),rt(Vt),rt(zt),Qi(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Vi(t),null;case 13:if(rt(ct),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(a(340));Rr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return rt(ct),null;case 4:return $r(),null;case 10:return Bi(t.type._context),null;case 22:case 23:return ja(),null;case 24:return null;default:return null}}var Ps=!1,Dt=!1,xm=typeof WeakSet=="function"?WeakSet:Set,pe=null;function zr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(o){mt(e,t,o)}else n.current=null}function pa(e,t,n){try{n()}catch(o){mt(e,t,o)}}var Vc=!1;function vm(e,t){if(ji=Bo,e=Cu(),yi(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var o=n.getSelection&&n.getSelection();if(o&&o.rangeCount!==0){n=o.anchorNode;var s=o.anchorOffset,u=o.focusNode;o=o.focusOffset;try{n.nodeType,u.nodeType}catch{n=null;break e}var c=0,S=-1,P=-1,B=0,oe=0,se=e,ne=null;t:for(;;){for(var fe;se!==n||s!==0&&se.nodeType!==3||(S=c+s),se!==u||o!==0&&se.nodeType!==3||(P=c+o),se.nodeType===3&&(c+=se.nodeValue.length),(fe=se.firstChild)!==null;)ne=se,se=fe;for(;;){if(se===e)break t;if(ne===n&&++B===s&&(S=c),ne===u&&++oe===o&&(P=c),(fe=se.nextSibling)!==null)break;se=ne,ne=se.parentNode}se=fe}n=S===-1||P===-1?null:{start:S,end:P}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ei={focusedElem:e,selectionRange:n},Bo=!1,pe=t;pe!==null;)if(t=pe,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,pe=e;else for(;pe!==null;){t=pe;try{var ye=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(ye!==null){var xe=ye.memoizedProps,ht=ye.memoizedState,z=t.stateNode,T=z.getSnapshotBeforeUpdate(t.elementType===t.type?xe:kn(t.type,xe),ht);z.__reactInternalSnapshotBeforeUpdate=T}break;case 3:var O=t.stateNode.containerInfo;O.nodeType===1?O.textContent="":O.nodeType===9&&O.documentElement&&O.removeChild(O.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(a(163))}}catch(ae){mt(t,t.return,ae)}if(e=t.sibling,e!==null){e.return=t.return,pe=e;break}pe=t.return}return ye=Vc,Vc=!1,ye}function Cl(e,t,n){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var s=o=o.next;do{if((s.tag&e)===e){var u=s.destroy;s.destroy=void 0,u!==void 0&&pa(t,n,u)}s=s.next}while(s!==o)}}function Rs(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var o=n.create;n.destroy=o()}n=n.next}while(n!==t)}}function ha(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Xc(e){var t=e.alternate;t!==null&&(e.alternate=null,Xc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[zn],delete t[ml],delete t[Li],delete t[nm],delete t[om])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Qc(e){return e.tag===5||e.tag===3||e.tag===4}function Gc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Qc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function _a(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=is));else if(o!==4&&(e=e.child,e!==null))for(_a(e,t,n),e=e.sibling;e!==null;)_a(e,t,n),e=e.sibling}function ga(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(ga(e,t,n),e=e.sibling;e!==null;)ga(e,t,n),e=e.sibling}var Lt=null,Cn=!1;function vo(e,t,n){for(n=n.child;n!==null;)Kc(e,t,n),n=n.sibling}function Kc(e,t,n){if($t&&typeof $t.onCommitFiberUnmount=="function")try{$t.onCommitFiberUnmount(Qn,n)}catch{}switch(n.tag){case 5:Dt||zr(n,t);case 6:var o=Lt,s=Cn;Lt=null,vo(e,t,n),Lt=o,Cn=s,Lt!==null&&(Cn?(e=Lt,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Lt.removeChild(n.stateNode));break;case 18:Lt!==null&&(Cn?(e=Lt,n=n.stateNode,e.nodeType===8?Ri(e.parentNode,n):e.nodeType===1&&Ri(e,n),fo(e)):Ri(Lt,n.stateNode));break;case 4:o=Lt,s=Cn,Lt=n.stateNode.containerInfo,Cn=!0,vo(e,t,n),Lt=o,Cn=s;break;case 0:case 11:case 14:case 15:if(!Dt&&(o=n.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){s=o=o.next;do{var u=s,c=u.destroy;u=u.tag,c!==void 0&&((u&2)!==0||(u&4)!==0)&&pa(n,t,c),s=s.next}while(s!==o)}vo(e,t,n);break;case 1:if(!Dt&&(zr(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=n.memoizedProps,o.state=n.memoizedState,o.componentWillUnmount()}catch(S){mt(n,t,S)}vo(e,t,n);break;case 21:vo(e,t,n);break;case 22:n.mode&1?(Dt=(o=Dt)||n.memoizedState!==null,vo(e,t,n),Dt=o):vo(e,t,n);break;default:vo(e,t,n)}}function Zc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new xm),t.forEach(function(o){var s=Pm.bind(null,e,o);n.has(o)||(n.add(o),o.then(s,s))})}}function Sn(e,t){var n=t.deletions;if(n!==null)for(var o=0;o<n.length;o++){var s=n[o];try{var u=e,c=t,S=c;e:for(;S!==null;){switch(S.tag){case 5:Lt=S.stateNode,Cn=!1;break e;case 3:Lt=S.stateNode.containerInfo,Cn=!0;break e;case 4:Lt=S.stateNode.containerInfo,Cn=!0;break e}S=S.return}if(Lt===null)throw Error(a(160));Kc(u,c,s),Lt=null,Cn=!1;var P=s.alternate;P!==null&&(P.return=null),s.return=null}catch(B){mt(s,t,B)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Jc(t,e),t=t.sibling}function Jc(e,t){var n=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Sn(t,e),Dn(e),o&4){try{Cl(3,e,e.return),Rs(3,e)}catch(xe){mt(e,e.return,xe)}try{Cl(5,e,e.return)}catch(xe){mt(e,e.return,xe)}}break;case 1:Sn(t,e),Dn(e),o&512&&n!==null&&zr(n,n.return);break;case 5:if(Sn(t,e),Dn(e),o&512&&n!==null&&zr(n,n.return),e.flags&32){var s=e.stateNode;try{Pt(s,"")}catch(xe){mt(e,e.return,xe)}}if(o&4&&(s=e.stateNode,s!=null)){var u=e.memoizedProps,c=n!==null?n.memoizedProps:u,S=e.type,P=e.updateQueue;if(e.updateQueue=null,P!==null)try{S==="input"&&u.type==="radio"&&u.name!=null&&No(s,u),Lo(S,c);var B=Lo(S,u);for(c=0;c<P.length;c+=2){var oe=P[c],se=P[c+1];oe==="style"?Wl(s,se):oe==="dangerouslySetInnerHTML"?Bl(s,se):oe==="children"?Pt(s,se):ee(s,oe,se,B)}switch(S){case"input":nr(s,u);break;case"textarea":Pn(s,u);break;case"select":var ne=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!u.multiple;var fe=u.value;fe!=null?It(s,!!u.multiple,fe,!1):ne!==!!u.multiple&&(u.defaultValue!=null?It(s,!!u.multiple,u.defaultValue,!0):It(s,!!u.multiple,u.multiple?[]:"",!1))}s[ml]=u}catch(xe){mt(e,e.return,xe)}}break;case 6:if(Sn(t,e),Dn(e),o&4){if(e.stateNode===null)throw Error(a(162));s=e.stateNode,u=e.memoizedProps;try{s.nodeValue=u}catch(xe){mt(e,e.return,xe)}}break;case 3:if(Sn(t,e),Dn(e),o&4&&n!==null&&n.memoizedState.isDehydrated)try{fo(t.containerInfo)}catch(xe){mt(e,e.return,xe)}break;case 4:Sn(t,e),Dn(e);break;case 13:Sn(t,e),Dn(e),s=e.child,s.flags&8192&&(u=s.memoizedState!==null,s.stateNode.isHidden=u,!u||s.alternate!==null&&s.alternate.memoizedState!==null||(va=lt())),o&4&&Zc(e);break;case 22:if(oe=n!==null&&n.memoizedState!==null,e.mode&1?(Dt=(B=Dt)||oe,Sn(t,e),Dt=B):Sn(t,e),Dn(e),o&8192){if(B=e.memoizedState!==null,(e.stateNode.isHidden=B)&&!oe&&(e.mode&1)!==0)for(pe=e,oe=e.child;oe!==null;){for(se=pe=oe;pe!==null;){switch(ne=pe,fe=ne.child,ne.tag){case 0:case 11:case 14:case 15:Cl(4,ne,ne.return);break;case 1:zr(ne,ne.return);var ye=ne.stateNode;if(typeof ye.componentWillUnmount=="function"){o=ne,n=ne.return;try{t=o,ye.props=t.memoizedProps,ye.state=t.memoizedState,ye.componentWillUnmount()}catch(xe){mt(o,n,xe)}}break;case 5:zr(ne,ne.return);break;case 22:if(ne.memoizedState!==null){td(se);continue}}fe!==null?(fe.return=ne,pe=fe):td(se)}oe=oe.sibling}e:for(oe=null,se=e;;){if(se.tag===5){if(oe===null){oe=se;try{s=se.stateNode,B?(u=s.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none"):(S=se.stateNode,P=se.memoizedProps.style,c=P!=null&&P.hasOwnProperty("display")?P.display:null,S.style.display=lr("display",c))}catch(xe){mt(e,e.return,xe)}}}else if(se.tag===6){if(oe===null)try{se.stateNode.nodeValue=B?"":se.memoizedProps}catch(xe){mt(e,e.return,xe)}}else if((se.tag!==22&&se.tag!==23||se.memoizedState===null||se===e)&&se.child!==null){se.child.return=se,se=se.child;continue}if(se===e)break e;for(;se.sibling===null;){if(se.return===null||se.return===e)break e;oe===se&&(oe=null),se=se.return}oe===se&&(oe=null),se.sibling.return=se.return,se=se.sibling}}break;case 19:Sn(t,e),Dn(e),o&4&&Zc(e);break;case 21:break;default:Sn(t,e),Dn(e)}}function Dn(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Qc(n)){var o=n;break e}n=n.return}throw Error(a(160))}switch(o.tag){case 5:var s=o.stateNode;o.flags&32&&(Pt(s,""),o.flags&=-33);var u=Gc(e);ga(e,u,s);break;case 3:case 4:var c=o.stateNode.containerInfo,S=Gc(e);_a(e,S,c);break;default:throw Error(a(161))}}catch(P){mt(e,e.return,P)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function bm(e,t,n){pe=e,qc(e)}function qc(e,t,n){for(var o=(e.mode&1)!==0;pe!==null;){var s=pe,u=s.child;if(s.tag===22&&o){var c=s.memoizedState!==null||Ps;if(!c){var S=s.alternate,P=S!==null&&S.memoizedState!==null||Dt;S=Ps;var B=Dt;if(Ps=c,(Dt=P)&&!B)for(pe=s;pe!==null;)c=pe,P=c.child,c.tag===22&&c.memoizedState!==null?nd(s):P!==null?(P.return=c,pe=P):nd(s);for(;u!==null;)pe=u,qc(u),u=u.sibling;pe=s,Ps=S,Dt=B}ed(e)}else(s.subtreeFlags&8772)!==0&&u!==null?(u.return=s,pe=u):ed(e)}}function ed(e){for(;pe!==null;){var t=pe;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Dt||Rs(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!Dt)if(n===null)o.componentDidMount();else{var s=t.elementType===t.type?n.memoizedProps:kn(t.type,n.memoizedProps);o.componentDidUpdate(s,n.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var u=t.updateQueue;u!==null&&tc(t,u,o);break;case 3:var c=t.updateQueue;if(c!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}tc(t,c,n)}break;case 5:var S=t.stateNode;if(n===null&&t.flags&4){n=S;var P=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":P.autoFocus&&n.focus();break;case"img":P.src&&(n.src=P.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var B=t.alternate;if(B!==null){var oe=B.memoizedState;if(oe!==null){var se=oe.dehydrated;se!==null&&fo(se)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(a(163))}Dt||t.flags&512&&ha(t)}catch(ne){mt(t,t.return,ne)}}if(t===e){pe=null;break}if(n=t.sibling,n!==null){n.return=t.return,pe=n;break}pe=t.return}}function td(e){for(;pe!==null;){var t=pe;if(t===e){pe=null;break}var n=t.sibling;if(n!==null){n.return=t.return,pe=n;break}pe=t.return}}function nd(e){for(;pe!==null;){var t=pe;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Rs(4,t)}catch(P){mt(t,n,P)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var s=t.return;try{o.componentDidMount()}catch(P){mt(t,s,P)}}var u=t.return;try{ha(t)}catch(P){mt(t,u,P)}break;case 5:var c=t.return;try{ha(t)}catch(P){mt(t,c,P)}}}catch(P){mt(t,t.return,P)}if(t===e){pe=null;break}var S=t.sibling;if(S!==null){S.return=t.return,pe=S;break}pe=t.return}}var wm=Math.ceil,Ls=ie.ReactCurrentDispatcher,ya=ie.ReactCurrentOwner,hn=ie.ReactCurrentBatchConfig,Xe=0,jt=null,yt=null,Tt=0,sn=0,Or=ho(0),kt=0,Sl=null,Go=0,Ts=0,xa=0,jl=null,Gt=null,va=0,Fr=1/0,lo=null,Is=!1,ba=null,bo=null,$s=!1,wo=null,Ms=0,El=0,wa=null,zs=-1,Os=0;function Wt(){return(Xe&6)!==0?lt():zs!==-1?zs:zs=lt()}function ko(e){return(e.mode&1)===0?1:(Xe&2)!==0&&Tt!==0?Tt&-Tt:lm.transition!==null?(Os===0&&(Os=tl()),Os):(e=He,e!==0||(e=window.event,e=e===void 0?16:G(e.type)),e)}function jn(e,t,n,o){if(50<El)throw El=0,wa=null,Error(a(185));Oo(e,n,o),((Xe&2)===0||e!==jt)&&(e===jt&&((Xe&2)===0&&(Ts|=n),kt===4&&Co(e,Tt)),Kt(e,o),n===1&&Xe===0&&(t.mode&1)===0&&(Fr=lt()+500,ds&&go()))}function Kt(e,t){var n=e.callbackNode;Gl(e,t);var o=Tn(e,e===jt?Tt:0);if(o===0)n!==null&&cn(n),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(n!=null&&cn(n),t===1)e.tag===0?rm(rd.bind(null,e)):Yu(rd.bind(null,e)),em(function(){(Xe&6)===0&&go()}),n=null;else{switch(Je(o)){case 1:n=qr;break;case 4:n=dr;break;case 16:n=$o;break;case 536870912:n=el;break;default:n=$o}n=fd(n,od.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function od(e,t){if(zs=-1,Os=0,(Xe&6)!==0)throw Error(a(327));var n=e.callbackNode;if(Dr()&&e.callbackNode!==n)return null;var o=Tn(e,e===jt?Tt:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=Fs(e,o);else{t=o;var s=Xe;Xe|=2;var u=sd();(jt!==e||Tt!==t)&&(lo=null,Fr=lt()+500,Zo(e,t));do try{Sm();break}catch(S){ld(e,S)}while(!0);Ai(),Ls.current=u,Xe=s,yt!==null?t=0:(jt=null,Tt=0,t=kt)}if(t!==0){if(t===2&&(s=uo(e),s!==0&&(o=s,t=ka(e,s))),t===1)throw n=Sl,Zo(e,0),Co(e,o),Kt(e,lt()),n;if(t===6)Co(e,o);else{if(s=e.current.alternate,(o&30)===0&&!km(s)&&(t=Fs(e,o),t===2&&(u=uo(e),u!==0&&(o=u,t=ka(e,u))),t===1))throw n=Sl,Zo(e,0),Co(e,o),Kt(e,lt()),n;switch(e.finishedWork=s,e.finishedLanes=o,t){case 0:case 1:throw Error(a(345));case 2:Jo(e,Gt,lo);break;case 3:if(Co(e,o),(o&130023424)===o&&(t=va+500-lt(),10<t)){if(Tn(e,0)!==0)break;if(s=e.suspendedLanes,(s&o)!==o){Wt(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=Pi(Jo.bind(null,e,Gt,lo),t);break}Jo(e,Gt,lo);break;case 4:if(Co(e,o),(o&4194240)===o)break;for(t=e.eventTimes,s=-1;0<o;){var c=31-en(o);u=1<<c,c=t[c],c>s&&(s=c),o&=~u}if(o=s,o=lt()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*wm(o/1960))-o,10<o){e.timeoutHandle=Pi(Jo.bind(null,e,Gt,lo),o);break}Jo(e,Gt,lo);break;case 5:Jo(e,Gt,lo);break;default:throw Error(a(329))}}}return Kt(e,lt()),e.callbackNode===n?od.bind(null,e):null}function ka(e,t){var n=jl;return e.current.memoizedState.isDehydrated&&(Zo(e,t).flags|=256),e=Fs(e,t),e!==2&&(t=Gt,Gt=n,t!==null&&Ca(t)),e}function Ca(e){Gt===null?Gt=e:Gt.push.apply(Gt,e)}function km(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var o=0;o<n.length;o++){var s=n[o],u=s.getSnapshot;s=s.value;try{if(!bn(u(),s))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Co(e,t){for(t&=~xa,t&=~Ts,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-en(t),o=1<<n;e[n]=-1,t&=~o}}function rd(e){if((Xe&6)!==0)throw Error(a(327));Dr();var t=Tn(e,0);if((t&1)===0)return Kt(e,lt()),null;var n=Fs(e,t);if(e.tag!==0&&n===2){var o=uo(e);o!==0&&(t=o,n=ka(e,o))}if(n===1)throw n=Sl,Zo(e,0),Co(e,t),Kt(e,lt()),n;if(n===6)throw Error(a(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Jo(e,Gt,lo),Kt(e,lt()),null}function Sa(e,t){var n=Xe;Xe|=1;try{return e(t)}finally{Xe=n,Xe===0&&(Fr=lt()+500,ds&&go())}}function Ko(e){wo!==null&&wo.tag===0&&(Xe&6)===0&&Dr();var t=Xe;Xe|=1;var n=hn.transition,o=He;try{if(hn.transition=null,He=1,e)return e()}finally{He=o,hn.transition=n,Xe=t,(Xe&6)===0&&go()}}function ja(){sn=Or.current,rt(Or)}function Zo(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,qf(n)),yt!==null)for(n=yt.return;n!==null;){var o=n;switch(Mi(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&us();break;case 3:$r(),rt(Vt),rt(zt),Qi();break;case 5:Vi(o);break;case 4:$r();break;case 13:rt(ct);break;case 19:rt(ct);break;case 10:Bi(o.type._context);break;case 22:case 23:ja()}n=n.return}if(jt=e,yt=e=So(e.current,null),Tt=sn=t,kt=0,Sl=null,xa=Ts=Go=0,Gt=jl=null,Vo!==null){for(t=0;t<Vo.length;t++)if(n=Vo[t],o=n.interleaved,o!==null){n.interleaved=null;var s=o.next,u=n.pending;if(u!==null){var c=u.next;u.next=s,o.next=c}n.pending=o}Vo=null}return e}function ld(e,t){do{var n=yt;try{if(Ai(),bs.current=Ss,ws){for(var o=dt.memoizedState;o!==null;){var s=o.queue;s!==null&&(s.pending=null),o=o.next}ws=!1}if(Qo=0,St=wt=dt=null,xl=!1,vl=0,ya.current=null,n===null||n.return===null){kt=1,Sl=t,yt=null;break}e:{var u=e,c=n.return,S=n,P=t;if(t=Tt,S.flags|=32768,P!==null&&typeof P=="object"&&typeof P.then=="function"){var B=P,oe=S,se=oe.tag;if((oe.mode&1)===0&&(se===0||se===11||se===15)){var ne=oe.alternate;ne?(oe.updateQueue=ne.updateQueue,oe.memoizedState=ne.memoizedState,oe.lanes=ne.lanes):(oe.updateQueue=null,oe.memoizedState=null)}var fe=Rc(c);if(fe!==null){fe.flags&=-257,Lc(fe,c,S,u,t),fe.mode&1&&Pc(u,B,t),t=fe,P=B;var ye=t.updateQueue;if(ye===null){var xe=new Set;xe.add(P),t.updateQueue=xe}else ye.add(P);break e}else{if((t&1)===0){Pc(u,B,t),Ea();break e}P=Error(a(426))}}else if(at&&S.mode&1){var ht=Rc(c);if(ht!==null){(ht.flags&65536)===0&&(ht.flags|=256),Lc(ht,c,S,u,t),Fi(Mr(P,S));break e}}u=P=Mr(P,S),kt!==4&&(kt=2),jl===null?jl=[u]:jl.push(u),u=c;do{switch(u.tag){case 3:u.flags|=65536,t&=-t,u.lanes|=t;var z=Ec(u,P,t);ec(u,z);break e;case 1:S=P;var T=u.type,O=u.stateNode;if((u.flags&128)===0&&(typeof T.getDerivedStateFromError=="function"||O!==null&&typeof O.componentDidCatch=="function"&&(bo===null||!bo.has(O)))){u.flags|=65536,t&=-t,u.lanes|=t;var ae=Nc(u,S,t);ec(u,ae);break e}}u=u.return}while(u!==null)}ad(n)}catch(be){t=be,yt===n&&n!==null&&(yt=n=n.return);continue}break}while(!0)}function sd(){var e=Ls.current;return Ls.current=Ss,e===null?Ss:e}function Ea(){(kt===0||kt===3||kt===2)&&(kt=4),jt===null||(Go&268435455)===0&&(Ts&268435455)===0||Co(jt,Tt)}function Fs(e,t){var n=Xe;Xe|=2;var o=sd();(jt!==e||Tt!==t)&&(lo=null,Zo(e,t));do try{Cm();break}catch(s){ld(e,s)}while(!0);if(Ai(),Xe=n,Ls.current=o,yt!==null)throw Error(a(261));return jt=null,Tt=0,kt}function Cm(){for(;yt!==null;)id(yt)}function Sm(){for(;yt!==null&&!Xl();)id(yt)}function id(e){var t=dd(e.alternate,e,sn);e.memoizedProps=e.pendingProps,t===null?ad(e):yt=t,ya.current=null}function ad(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=gm(n,t,sn),n!==null){yt=n;return}}else{if(n=ym(n,t),n!==null){n.flags&=32767,yt=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{kt=6,yt=null;return}}if(t=t.sibling,t!==null){yt=t;return}yt=t=e}while(t!==null);kt===0&&(kt=5)}function Jo(e,t,n){var o=He,s=hn.transition;try{hn.transition=null,He=1,jm(e,t,n,o)}finally{hn.transition=s,He=o}return null}function jm(e,t,n,o){do Dr();while(wo!==null);if((Xe&6)!==0)throw Error(a(327));n=e.finishedWork;var s=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(a(177));e.callbackNode=null,e.callbackPriority=0;var u=n.lanes|n.childLanes;if(Kl(e,u),e===jt&&(yt=jt=null,Tt=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||$s||($s=!0,fd($o,function(){return Dr(),null})),u=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||u){u=hn.transition,hn.transition=null;var c=He;He=1;var S=Xe;Xe|=4,ya.current=null,vm(e,n),Jc(n,e),Vf(Ei),Bo=!!ji,Ei=ji=null,e.current=n,bm(n),io(),Xe=S,He=c,hn.transition=u}else e.current=n;if($s&&($s=!1,wo=e,Ms=s),u=e.pendingLanes,u===0&&(bo=null),fr(n.stateNode),Kt(e,lt()),t!==null)for(o=e.onRecoverableError,n=0;n<t.length;n++)s=t[n],o(s.value,{componentStack:s.stack,digest:s.digest});if(Is)throw Is=!1,e=ba,ba=null,e;return(Ms&1)!==0&&e.tag!==0&&Dr(),u=e.pendingLanes,(u&1)!==0?e===wa?El++:(El=0,wa=e):El=0,go(),null}function Dr(){if(wo!==null){var e=Je(Ms),t=hn.transition,n=He;try{if(hn.transition=null,He=16>e?16:e,wo===null)var o=!1;else{if(e=wo,wo=null,Ms=0,(Xe&6)!==0)throw Error(a(331));var s=Xe;for(Xe|=4,pe=e.current;pe!==null;){var u=pe,c=u.child;if((pe.flags&16)!==0){var S=u.deletions;if(S!==null){for(var P=0;P<S.length;P++){var B=S[P];for(pe=B;pe!==null;){var oe=pe;switch(oe.tag){case 0:case 11:case 15:Cl(8,oe,u)}var se=oe.child;if(se!==null)se.return=oe,pe=se;else for(;pe!==null;){oe=pe;var ne=oe.sibling,fe=oe.return;if(Xc(oe),oe===B){pe=null;break}if(ne!==null){ne.return=fe,pe=ne;break}pe=fe}}}var ye=u.alternate;if(ye!==null){var xe=ye.child;if(xe!==null){ye.child=null;do{var ht=xe.sibling;xe.sibling=null,xe=ht}while(xe!==null)}}pe=u}}if((u.subtreeFlags&2064)!==0&&c!==null)c.return=u,pe=c;else e:for(;pe!==null;){if(u=pe,(u.flags&2048)!==0)switch(u.tag){case 0:case 11:case 15:Cl(9,u,u.return)}var z=u.sibling;if(z!==null){z.return=u.return,pe=z;break e}pe=u.return}}var T=e.current;for(pe=T;pe!==null;){c=pe;var O=c.child;if((c.subtreeFlags&2064)!==0&&O!==null)O.return=c,pe=O;else e:for(c=T;pe!==null;){if(S=pe,(S.flags&2048)!==0)try{switch(S.tag){case 0:case 11:case 15:Rs(9,S)}}catch(be){mt(S,S.return,be)}if(S===c){pe=null;break e}var ae=S.sibling;if(ae!==null){ae.return=S.return,pe=ae;break e}pe=S.return}}if(Xe=s,go(),$t&&typeof $t.onPostCommitFiberRoot=="function")try{$t.onPostCommitFiberRoot(Qn,e)}catch{}o=!0}return o}finally{He=n,hn.transition=t}}return!1}function ud(e,t,n){t=Mr(n,t),t=Ec(e,t,1),e=xo(e,t,1),t=Wt(),e!==null&&(Oo(e,1,t),Kt(e,t))}function mt(e,t,n){if(e.tag===3)ud(e,e,n);else for(;t!==null;){if(t.tag===3){ud(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(bo===null||!bo.has(o))){e=Mr(n,e),e=Nc(t,e,1),t=xo(t,e,1),e=Wt(),t!==null&&(Oo(t,1,e),Kt(t,e));break}}t=t.return}}function Em(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),t=Wt(),e.pingedLanes|=e.suspendedLanes&n,jt===e&&(Tt&n)===n&&(kt===4||kt===3&&(Tt&130023424)===Tt&&500>lt()-va?Zo(e,0):xa|=n),Kt(e,t)}function cd(e,t){t===0&&((e.mode&1)===0?t=1:(t=At,At<<=1,(At&130023424)===0&&(At=4194304)));var n=Wt();e=no(e,t),e!==null&&(Oo(e,t,n),Kt(e,n))}function Nm(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),cd(e,n)}function Pm(e,t){var n=0;switch(e.tag){case 13:var o=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(a(314))}o!==null&&o.delete(t),cd(e,n)}var dd;dd=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Vt.current)Qt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return Qt=!1,_m(e,t,n);Qt=(e.flags&131072)!==0}else Qt=!1,at&&(t.flags&1048576)!==0&&Hu(t,ms,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;Ns(e,t),e=t.pendingProps;var s=Er(t,zt.current);Ir(t,n),s=Zi(null,t,o,e,s,n);var u=Ji();return t.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Xt(o)?(u=!0,cs(t)):u=!1,t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,Hi(t),s.updater=js,t.stateNode=s,s._reactInternals=t,ra(t,o,e,n),t=aa(null,t,o,!0,u,n)):(t.tag=0,at&&u&&$i(t),Bt(null,t,s,n),t=t.child),t;case 16:o=t.elementType;e:{switch(Ns(e,t),e=t.pendingProps,s=o._init,o=s(o._payload),t.type=o,s=t.tag=Lm(o),e=kn(o,e),s){case 0:t=ia(null,t,o,e,n);break e;case 1:t=Oc(null,t,o,e,n);break e;case 11:t=Tc(null,t,o,e,n);break e;case 14:t=Ic(null,t,o,kn(o.type,e),n);break e}throw Error(a(306,o,""))}return t;case 0:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),ia(e,t,o,s,n);case 1:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),Oc(e,t,o,s,n);case 3:e:{if(Fc(t),e===null)throw Error(a(387));o=t.pendingProps,u=t.memoizedState,s=u.element,qu(e,t),xs(t,o,null,n);var c=t.memoizedState;if(o=c.element,u.isDehydrated)if(u={element:o,isDehydrated:!1,cache:c.cache,pendingSuspenseBoundaries:c.pendingSuspenseBoundaries,transitions:c.transitions},t.updateQueue.baseState=u,t.memoizedState=u,t.flags&256){s=Mr(Error(a(423)),t),t=Dc(e,t,o,n,s);break e}else if(o!==s){s=Mr(Error(a(424)),t),t=Dc(e,t,o,n,s);break e}else for(ln=po(t.stateNode.containerInfo.firstChild),rn=t,at=!0,wn=null,n=Zu(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Rr(),o===s){t=ro(e,t,n);break e}Bt(e,t,o,n)}t=t.child}return t;case 5:return nc(t),e===null&&Oi(t),o=t.type,s=t.pendingProps,u=e!==null?e.memoizedProps:null,c=s.children,Ni(o,s)?c=null:u!==null&&Ni(o,u)&&(t.flags|=32),zc(e,t),Bt(e,t,c,n),t.child;case 6:return e===null&&Oi(t),null;case 13:return Ac(e,t,n);case 4:return Ui(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Lr(t,null,o,n):Bt(e,t,o,n),t.child;case 11:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),Tc(e,t,o,s,n);case 7:return Bt(e,t,t.pendingProps,n),t.child;case 8:return Bt(e,t,t.pendingProps.children,n),t.child;case 12:return Bt(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(o=t.type._context,s=t.pendingProps,u=t.memoizedProps,c=s.value,tt(_s,o._currentValue),o._currentValue=c,u!==null)if(bn(u.value,c)){if(u.children===s.children&&!Vt.current){t=ro(e,t,n);break e}}else for(u=t.child,u!==null&&(u.return=t);u!==null;){var S=u.dependencies;if(S!==null){c=u.child;for(var P=S.firstContext;P!==null;){if(P.context===o){if(u.tag===1){P=oo(-1,n&-n),P.tag=2;var B=u.updateQueue;if(B!==null){B=B.shared;var oe=B.pending;oe===null?P.next=P:(P.next=oe.next,oe.next=P),B.pending=P}}u.lanes|=n,P=u.alternate,P!==null&&(P.lanes|=n),Wi(u.return,n,t),S.lanes|=n;break}P=P.next}}else if(u.tag===10)c=u.type===t.type?null:u.child;else if(u.tag===18){if(c=u.return,c===null)throw Error(a(341));c.lanes|=n,S=c.alternate,S!==null&&(S.lanes|=n),Wi(c,n,t),c=u.sibling}else c=u.child;if(c!==null)c.return=u;else for(c=u;c!==null;){if(c===t){c=null;break}if(u=c.sibling,u!==null){u.return=c.return,c=u;break}c=c.return}u=c}Bt(e,t,s.children,n),t=t.child}return t;case 9:return s=t.type,o=t.pendingProps.children,Ir(t,n),s=mn(s),o=o(s),t.flags|=1,Bt(e,t,o,n),t.child;case 14:return o=t.type,s=kn(o,t.pendingProps),s=kn(o.type,s),Ic(e,t,o,s,n);case 15:return $c(e,t,t.type,t.pendingProps,n);case 17:return o=t.type,s=t.pendingProps,s=t.elementType===o?s:kn(o,s),Ns(e,t),t.tag=1,Xt(o)?(e=!0,cs(t)):e=!1,Ir(t,n),Sc(t,o,s),ra(t,o,s,n),aa(null,t,o,!0,e,n);case 19:return Wc(e,t,n);case 22:return Mc(e,t,n)}throw Error(a(156,t.tag))};function fd(e,t){return cr(e,t)}function Rm(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _n(e,t,n,o){return new Rm(e,t,n,o)}function Na(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Lm(e){if(typeof e=="function")return Na(e)?1:0;if(e!=null){if(e=e.$$typeof,e===me)return 11;if(e===We)return 14}return 2}function So(e,t){var n=e.alternate;return n===null?(n=_n(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Ds(e,t,n,o,s,u){var c=2;if(o=e,typeof e=="function")Na(e)&&(c=1);else if(typeof e=="string")c=5;else e:switch(e){case M:return qo(n.children,s,u,t);case x:c=8,s|=8;break;case K:return e=_n(12,n,t,s|2),e.elementType=K,e.lanes=u,e;case ze:return e=_n(13,n,t,s),e.elementType=ze,e.lanes=u,e;case Ae:return e=_n(19,n,t,s),e.elementType=Ae,e.lanes=u,e;case U:return As(n,s,u,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case ue:c=10;break e;case q:c=9;break e;case me:c=11;break e;case We:c=14;break e;case F:c=16,o=null;break e}throw Error(a(130,e==null?e:typeof e,""))}return t=_n(c,n,t,s),t.elementType=e,t.type=o,t.lanes=u,t}function qo(e,t,n,o){return e=_n(7,e,o,t),e.lanes=n,e}function As(e,t,n,o){return e=_n(22,e,o,t),e.elementType=U,e.lanes=n,e.stateNode={isHidden:!1},e}function Pa(e,t,n){return e=_n(6,e,null,t),e.lanes=n,e}function Ra(e,t,n){return t=_n(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Tm(e,t,n,o,s){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=zo(0),this.expirationTimes=zo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=zo(0),this.identifierPrefix=o,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function La(e,t,n,o,s,u,c,S,P){return e=new Tm(e,t,n,S,P),t===1?(t=1,u===!0&&(t|=8)):t=0,u=_n(3,null,null,t),e.current=u,u.stateNode=e,u.memoizedState={element:o,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Hi(u),e}function Im(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:re,key:o==null?null:""+o,children:e,containerInfo:t,implementation:n}}function md(e){if(!e)return _o;e=e._reactInternals;e:{if(pt(e)!==e||e.tag!==1)throw Error(a(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Xt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(a(171))}if(e.tag===1){var n=e.type;if(Xt(n))return Bu(e,n,t)}return t}function pd(e,t,n,o,s,u,c,S,P){return e=La(n,o,!0,e,s,u,c,S,P),e.context=md(null),n=e.current,o=Wt(),s=ko(n),u=oo(o,s),u.callback=t??null,xo(n,u,s),e.current.lanes=s,Oo(e,s,o),Kt(e,o),e}function Bs(e,t,n,o){var s=t.current,u=Wt(),c=ko(s);return n=md(n),t.context===null?t.context=n:t.pendingContext=n,t=oo(u,c),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=xo(s,t,c),e!==null&&(jn(e,s,c,u),ys(e,s,c)),c}function Ws(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function hd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Ta(e,t){hd(e,t),(e=e.alternate)&&hd(e,t)}function $m(){return null}var _d=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ia(e){this._internalRoot=e}Ys.prototype.render=Ia.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(a(409));Bs(e,t,null,null)},Ys.prototype.unmount=Ia.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ko(function(){Bs(null,e,null,null)}),t[Jn]=null}};function Ys(e){this._internalRoot=e}Ys.prototype.unstable_scheduleHydration=function(e){if(e){var t=ol();e={blockedOn:null,target:e,priority:t};for(var n=0;n<tn.length&&t!==0&&t<tn[n].priority;n++);tn.splice(n,0,e),n===0&&_r(e)}};function $a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Hs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function gd(){}function Mm(e,t,n,o,s){if(s){if(typeof o=="function"){var u=o;o=function(){var B=Ws(c);u.call(B)}}var c=pd(t,o,e,0,null,!1,!1,"",gd);return e._reactRootContainer=c,e[Jn]=c.current,dl(e.nodeType===8?e.parentNode:e),Ko(),c}for(;s=e.lastChild;)e.removeChild(s);if(typeof o=="function"){var S=o;o=function(){var B=Ws(P);S.call(B)}}var P=La(e,0,!1,null,null,!1,!1,"",gd);return e._reactRootContainer=P,e[Jn]=P.current,dl(e.nodeType===8?e.parentNode:e),Ko(function(){Bs(t,P,n,o)}),P}function Us(e,t,n,o,s){var u=n._reactRootContainer;if(u){var c=u;if(typeof s=="function"){var S=s;s=function(){var P=Ws(c);S.call(P)}}Bs(t,c,e,s)}else c=Mm(n,t,e,s,o);return Ws(c)}nl=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=vn(t.pendingLanes);n!==0&&(pr(t,n|1),Kt(t,lt()),(Xe&6)===0&&(Fr=lt()+500,go()))}break;case 13:Ko(function(){var o=no(e,1);if(o!==null){var s=Wt();jn(o,e,1,s)}}),Ta(e,1)}},hr=function(e){if(e.tag===13){var t=no(e,134217728);if(t!==null){var n=Wt();jn(t,e,134217728,n)}Ta(e,134217728)}},Zl=function(e){if(e.tag===13){var t=ko(e),n=no(e,t);if(n!==null){var o=Wt();jn(n,e,t,o)}Ta(e,t)}},ol=function(){return He},Fo=function(e,t){var n=He;try{return He=e,t()}finally{He=n}},Gr=function(e,t,n){switch(t){case"input":if(nr(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var s=as(o);if(!s)throw Error(a(90));Ur(o),nr(o,s)}}}break;case"textarea":Pn(e,n);break;case"select":t=n.value,t!=null&&It(e,!!n.multiple,t,!1)}},Xn=Sa,qt=Ko;var zm={usingClientEntryPoint:!1,Events:[pl,Sr,as,Vn,ut,Sa]},Nl={findFiberByHostInstance:Wo,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Om={bundleType:Nl.bundleType,version:Nl.version,rendererPackageName:Nl.rendererPackageName,rendererConfig:Nl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ie.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ln(e),e===null?null:e.stateNode},findFiberByHostInstance:Nl.findFiberByHostInstance||$m,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Vs=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Vs.isDisabled&&Vs.supportsFiber)try{Qn=Vs.inject(Om),$t=Vs}catch{}}return Zt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=zm,Zt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!$a(t))throw Error(a(200));return Im(e,t,null,n)},Zt.createRoot=function(e,t){if(!$a(e))throw Error(a(299));var n=!1,o="",s=_d;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=La(e,1,!1,null,null,n,!1,o,s),e[Jn]=t.current,dl(e.nodeType===8?e.parentNode:e),new Ia(t)},Zt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(a(188)):(e=Object.keys(e).join(","),Error(a(268,e)));return e=Ln(t),e=e===null?null:e.stateNode,e},Zt.flushSync=function(e){return Ko(e)},Zt.hydrate=function(e,t,n){if(!Hs(t))throw Error(a(200));return Us(null,e,t,!0,n)},Zt.hydrateRoot=function(e,t,n){if(!$a(e))throw Error(a(405));var o=n!=null&&n.hydratedSources||null,s=!1,u="",c=_d;if(n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(u=n.identifierPrefix),n.onRecoverableError!==void 0&&(c=n.onRecoverableError)),t=pd(t,null,e,1,n??null,s,!1,u,c),e[Jn]=t.current,dl(e),o)for(e=0;e<o.length;e++)n=o[e],s=n._getVersion,s=s(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,s]:t.mutableSourceEagerHydrationData.push(n,s);return new Ys(t)},Zt.render=function(e,t,n){if(!Hs(t))throw Error(a(200));return Us(null,e,t,!1,n)},Zt.unmountComponentAtNode=function(e){if(!Hs(e))throw Error(a(40));return e._reactRootContainer?(Ko(function(){Us(null,null,e,!1,function(){e._reactRootContainer=null,e[Jn]=null})}),!0):!1},Zt.unstable_batchedUpdates=Sa,Zt.unstable_renderSubtreeIntoContainer=function(e,t,n,o){if(!Hs(n))throw Error(a(200));if(e==null||e._reactInternals===void 0)throw Error(a(38));return Us(e,t,n,!1,o)},Zt.version="18.3.1-next-f1338f8080-20240426",Zt}var Sd;function rf(){if(Sd)return Oa.exports;Sd=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(i){console.error(i)}}return r(),Oa.exports=Hm(),Oa.exports}var jd;function Um(){if(jd)return Xs;jd=1;var r=rf();return Xs.createRoot=r.createRoot,Xs.hydrateRoot=r.hydrateRoot,Xs}var Vm=Um();const Xm={},Ed=r=>{let i;const a=new Set,d=(w,L)=>{const g=typeof w=="function"?w(i):w;if(!Object.is(g,i)){const j=i;i=L??(typeof g!="object"||g===null)?g:Object.assign({},i,g),a.forEach(b=>b(i,j))}},p=()=>i,m={setState:d,getState:p,getInitialState:()=>D,subscribe:w=>(a.add(w),()=>a.delete(w)),destroy:()=>{(Xm?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),a.clear()}},D=i=r(d,p,m);return m},Qm=r=>r?Ed(r):Ed;var Aa={exports:{}},Ba={},Wa={exports:{}},Ya={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Nd;function Gm(){if(Nd)return Ya;Nd=1;var r=Al();function i(L,g){return L===g&&(L!==0||1/L===1/g)||L!==L&&g!==g}var a=typeof Object.is=="function"?Object.is:i,d=r.useState,p=r.useEffect,h=r.useLayoutEffect,f=r.useDebugValue;function y(L,g){var j=g(),b=d({inst:{value:j,getSnapshot:g}}),_=b[0].inst,N=b[1];return h(function(){_.value=j,_.getSnapshot=g,m(_)&&N({inst:_})},[L,j,g]),p(function(){return m(_)&&N({inst:_}),L(function(){m(_)&&N({inst:_})})},[L]),f(j),j}function m(L){var g=L.getSnapshot;L=L.value;try{var j=g();return!a(L,j)}catch{return!0}}function D(L,g){return g()}var w=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?D:y;return Ya.useSyncExternalStore=r.useSyncExternalStore!==void 0?r.useSyncExternalStore:w,Ya}var Pd;function Km(){return Pd||(Pd=1,Wa.exports=Gm()),Wa.exports}/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Rd;function Zm(){if(Rd)return Ba;Rd=1;var r=Al(),i=Km();function a(D,w){return D===w&&(D!==0||1/D===1/w)||D!==D&&w!==w}var d=typeof Object.is=="function"?Object.is:a,p=i.useSyncExternalStore,h=r.useRef,f=r.useEffect,y=r.useMemo,m=r.useDebugValue;return Ba.useSyncExternalStoreWithSelector=function(D,w,L,g,j){var b=h(null);if(b.current===null){var _={hasValue:!1,value:null};b.current=_}else _=b.current;b=y(function(){function I(re){if(!V){if(V=!0,ee=re,re=g(re),j!==void 0&&_.hasValue){var M=_.value;if(j(M,re))return ie=M}return ie=re}if(M=ie,d(ee,re))return M;var x=g(re);return j!==void 0&&j(M,x)?(ee=re,M):(ee=re,ie=x)}var V=!1,ee,ie,le=L===void 0?null:L;return[function(){return I(w())},le===null?void 0:function(){return I(le())}]},[w,L,g,j]);var N=p(D,b[0],b[1]);return f(function(){_.hasValue=!0,_.value=N},[N]),m(N),N},Ba}var Ld;function Jm(){return Ld||(Ld=1,Aa.exports=Zm()),Aa.exports}var qm=Jm();const ep=nf(qm),lf={},{useDebugValue:tp}=of,{useSyncExternalStoreWithSelector:np}=ep;let Td=!1;const op=r=>r;function rp(r,i=op,a){(lf?"production":void 0)!=="production"&&a&&!Td&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),Td=!0);const d=np(r.subscribe,r.getState,r.getServerState||r.getInitialState,i,a);return tp(d),d}const Id=r=>{(lf?"production":void 0)!=="production"&&typeof r!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const i=typeof r=="function"?Qm(r):r,a=(d,p)=>rp(i,d,p);return Object.assign(a,i),a},lp=r=>r?Id(r):Id,Fl={iphone:{w:400,h:868},ipad:{w:500,h:716},mac:{w:640,h:400},watch:{w:205,h:251},android:{w:400,h:711}},li={iphone:{deviceScale:92,deviceTop:15,deviceAngle:8},ipad:{deviceScale:92,deviceTop:15,deviceAngle:8},mac:{deviceScale:85,deviceTop:20,deviceAngle:0},watch:{deviceScale:80,deviceTop:22,deviceAngle:0},android:{deviceScale:92,deviceTop:15,deviceAngle:8}};function Qs(r,i,a){var h;const d=i.screens[r],p=li[a]??li.iphone;return{screenIndex:r,headline:d?d.headline:"New Screen",subtitle:d?d.subtitle??"":"",style:"minimal",layout:"center",font:i.theme.font,fontWeight:i.theme.fontWeight,headlineSize:i.theme.headlineSize??0,subtitleSize:i.theme.subtitleSize??0,headlineRotation:0,subtitleRotation:0,colors:{primary:i.theme.colors.primary,secondary:i.theme.colors.secondary,background:i.theme.colors.background,text:i.theme.colors.text,subtitle:i.theme.colors.subtitle??"#64748B"},frameId:i.frames.ios??i.frames.android??"",deviceColor:i.frames.deviceColor??"",frameStyle:i.frames.style==="3d"?"flat":i.frames.style,composition:"single",deviceScale:p.deviceScale,deviceTop:p.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:p.deviceAngle,deviceTilt:0,headlineGradient:null,subtitleGradient:null,autoSizeHeadline:!0,autoSizeSubtitle:!1,headlineLineHeight:0,headlineLetterSpacing:0,headlineTextTransform:"",headlineFontStyle:"",subtitleOpacity:0,subtitleLetterSpacing:0,subtitleTextTransform:"",spotlight:null,annotations:[],textPositions:{headline:null,subtitle:null},screenshotDataUrl:null,screenshotName:((h=d==null?void 0:d.screenshot)==null?void 0:h.split("/").pop())??null,screenshotDims:null,backgroundType:"solid",backgroundColor:"#ffffff",backgroundGradient:{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"},backgroundImageDataUrl:null,backgroundOverlay:null,deviceShadow:null,borderSimulation:null,cornerRadius:0,loupe:null,callouts:[],overlays:[],extraScreenshots:[]}}const sp=50;let Yr=[],ri=[],zl=!1;function xt(r){return JSON.parse(JSON.stringify(r))}function An(r){zl||(Yr.push({screens:xt(r.screens),panoramicElements:xt(r.panoramicElements),panoramicBackground:xt(r.panoramicBackground),panoramicEffects:xt(r.panoramicEffects),selectedScreen:r.selectedScreen,selectedElementIndex:r.selectedElementIndex}),ri=[],Yr.length>sp&&Yr.shift())}const J=lp((r,i)=>({config:null,platform:"iphone",previewW:400,previewH:868,selectedScreen:0,activeTab:"design",locale:"default",previewBg:"dark",renderVersion:0,isPanoramic:!1,panoramicFrameCount:5,panoramicBackground:{type:"solid",color:"#ffffff"},panoramicElements:[],panoramicEffects:{spotlight:null,annotations:[],overlays:[]},selectedElementIndex:null,fonts:[],frames:[],deviceFamilies:[],koubouAvailable:!1,sizes:{},exportSize:"",exportRenderer:"playwright",screens:[],setConfig:a=>r({config:a}),setPlatform:a=>r({platform:a}),setPreviewSize:(a,d)=>r({previewW:a,previewH:d}),setSelectedScreen:a=>r({selectedScreen:a}),setActiveTab:a=>r({activeTab:a}),setLocale:a=>r({locale:a}),setPreviewBg:a=>r({previewBg:a}),setExportSize:a=>r({exportSize:a}),setExportRenderer:a=>r({exportRenderer:a}),setFonts:a=>r({fonts:a}),setFrames:a=>r({frames:a}),setDeviceFamilies:a=>r({deviceFamilies:a}),setKoubouAvailable:a=>r({koubouAvailable:a}),setSizes:a=>r({sizes:a}),updateScreen:(a,d)=>r(p=>{const h=[...p.screens],f=h[a];return f?(An(p),h[a]={...f,...d},{screens:h}):p}),triggerRender:()=>r(a=>({renderVersion:a.renderVersion+1})),initScreens:(a,d)=>{const p=a.mode==="panoramic",h=a.screens.length>0?a.screens.map((y,m)=>Qs(m,a,d)):[],f=a.panoramic?{panoramicFrameCount:a.frameCount??5,panoramicBackground:a.panoramic.background,panoramicElements:a.panoramic.elements}:{};r({config:a,isPanoramic:p,screens:h,selectedScreen:0,selectedElementIndex:null,...f})},addScreen:()=>r(a=>{const{screens:d,config:p,platform:h}=a;if(!p)return a;An(a);const f=d[d.length-1],y=Qs(0,p,h);return y.screenIndex=d.length,y.headline=`Screen ${d.length+1}`,y.subtitle="",f&&(y.style=f.style,y.layout=f.layout,y.font=f.font,y.fontWeight=f.fontWeight,y.colors={...f.colors},y.frameId=f.frameId,y.deviceColor=f.deviceColor,y.frameStyle=f.frameStyle,y.composition=f.composition,y.deviceScale=f.deviceScale,y.deviceTop=f.deviceTop),{screens:[...d,y],selectedScreen:d.length}}),removeScreen:a=>r(d=>{if(d.screens.length<=1)return d;An(d);const p=d.screens.filter((f,y)=>y!==a).map((f,y)=>({...f,screenIndex:y}));let h=d.selectedScreen;return h>=p.length?h=p.length-1:h>a&&h--,{screens:p,selectedScreen:h}}),moveScreen:(a,d)=>r(p=>{if(d<0||d>=p.screens.length)return p;An(p);const h=[...p.screens],[f]=h.splice(a,1);return f?(h.splice(d,0,f),{screens:h.map((y,m)=>({...y,screenIndex:m})),selectedScreen:d}):p}),togglePanoramic:()=>r(a=>{var p;if(a.isPanoramic){if(a.screens.length===0&&a.config){const h=a.platform;return a.config.screens.length>0?{isPanoramic:!1,screens:a.config.screens.map((y,m)=>Qs(m,a.config,h)),selectedScreen:0}:{isPanoramic:!1,screens:[Qs(0,a.config,h)],selectedScreen:0}}return{isPanoramic:!1}}const d={isPanoramic:!0,selectedElementIndex:null};if(a.panoramicElements.length===0&&a.config&&a.screens.length>0){const h=a.config.theme.colors,f=a.screens.length;d.panoramicFrameCount=f,d.panoramicBackground={type:"solid",color:"#ffffff"};const y=[];for(let m=0;m<f;m++){const D=a.screens[m],w=m/f*100,L=w+100/f/2;y.push({type:"device",screenshot:((p=a.config.screens[m])==null?void 0:p.screenshot)??`screenshots/screen-${m+1}.png`,frame:D.frameId||void 0,x:L-6,y:20,width:12,rotation:D.deviceRotation||0,z:5}),D.headline&&y.push({type:"text",content:D.headline,x:w+2,y:3,fontSize:3,color:h.text??"#FFFFFF",fontWeight:a.config.theme.fontWeight??700,fontStyle:"normal",textAlign:"left",lineHeight:1.15,maxWidth:Math.floor(100/f)-4,z:10})}d.panoramicElements=y}else a.panoramicElements.length===0&&a.config&&a.panoramicBackground.type==="solid"&&(!a.panoramicBackground.color||a.panoramicBackground.color==="#000000")&&(d.panoramicBackground={type:"solid",color:"#ffffff"});return d}),setSelectedElement:a=>r({selectedElementIndex:a}),updatePanoramicBackground:a=>r(d=>(An(d),{panoramicBackground:{...d.panoramicBackground,...a}})),updatePanoramicElement:(a,d)=>r(p=>{const h=[...p.panoramicElements],f=h[a];return f?(An(p),h[a]={...f,...d},{panoramicElements:h}):p}),addPanoramicElement:a=>r(d=>(An(d),{panoramicElements:[...d.panoramicElements,a],selectedElementIndex:d.panoramicElements.length})),removePanoramicElement:a=>r(d=>{An(d);const p=d.panoramicElements.filter((f,y)=>y!==a);let h=d.selectedElementIndex;return h!==null&&(h===a?h=null:h>a&&h--),{panoramicElements:p,selectedElementIndex:h}}),setPanoramicFrameCount:a=>r(d=>{const p=d.panoramicFrameCount;if(p===a)return d;An(d);const h=p/a,f=d.panoramicElements.map(y=>{const m={...y,x:y.x*h};return y.type==="device"?{...m,width:y.width*h}:y.type==="text"&&y.maxWidth?{...m,maxWidth:y.maxWidth*h}:y.type==="decoration"?{...m,width:y.width*h}:m});return{panoramicFrameCount:a,panoramicElements:f}}),updatePanoramicEffects:a=>r(d=>(An(d),{panoramicEffects:{...d.panoramicEffects,...a}})),undo:()=>{if(Yr.length===0)return;const a=i();ri.push({screens:xt(a.screens),panoramicElements:xt(a.panoramicElements),panoramicBackground:xt(a.panoramicBackground),panoramicEffects:xt(a.panoramicEffects),selectedScreen:a.selectedScreen,selectedElementIndex:a.selectedElementIndex});const d=Yr.pop();zl=!0,r({screens:xt(d.screens),panoramicElements:xt(d.panoramicElements),panoramicBackground:xt(d.panoramicBackground),panoramicEffects:xt(d.panoramicEffects),selectedScreen:d.selectedScreen,selectedElementIndex:d.selectedElementIndex}),zl=!1},redo:()=>{if(ri.length===0)return;const a=i();Yr.push({screens:xt(a.screens),panoramicElements:xt(a.panoramicElements),panoramicBackground:xt(a.panoramicBackground),panoramicEffects:xt(a.panoramicEffects),selectedScreen:a.selectedScreen,selectedElementIndex:a.selectedElementIndex});const d=ri.pop();zl=!0,r({screens:xt(d.screens),panoramicElements:xt(d.panoramicElements),panoramicBackground:xt(d.panoramicBackground),panoramicEffects:xt(d.panoramicEffects),selectedScreen:d.selectedScreen,selectedElementIndex:d.selectedElementIndex}),zl=!1}})),Wn="";async function sf(){const r=await fetch(`${Wn}/api/config`);if(!r.ok)throw new Error(`Failed to fetch config: ${r.statusText}`);return r.json()}async function ip(){return await fetch(`${Wn}/api/reload`,{method:"POST"}),sf()}async function ap(r,i){const a=await fetch(`${Wn}/api/preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:i});if(!a.ok)throw new Error(`Preview render failed: ${a.statusText}`);return a.text()}async function up(){const r=await fetch(`${Wn}/api/frames`);if(!r.ok)throw new Error(`Failed to fetch frames: ${r.statusText}`);return r.json()}async function cp(){const r=await fetch(`${Wn}/api/fonts`);if(!r.ok)throw new Error(`Failed to fetch fonts: ${r.statusText}`);return r.json()}async function dp(){const r=await fetch(`${Wn}/api/koubou-devices`);if(!r.ok)throw new Error(`Failed to fetch koubou devices: ${r.statusText}`);return r.json()}async function fp(){const r=await fetch(`${Wn}/api/sizes`);if(!r.ok)throw new Error(`Failed to fetch sizes: ${r.statusText}`);return r.json()}async function mp(r,i){const a=await fetch(`${Wn}/api/panoramic-preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:i});if(!a.ok)throw new Error(`Panoramic preview failed: ${a.statusText}`);return a.text()}async function $d(r){const i=await fetch(`${Wn}/api/export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!i.ok)throw new Error(`Export failed: ${i.statusText}`);return i.blob()}async function Md(r){const i=await fetch(`${Wn}/api/panoramic-export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!i.ok)throw new Error(`Panoramic export failed: ${i.statusText}`);return i.blob()}function ai(){const r=J(p=>p.selectedScreen),i=J(p=>p.screens[p.selectedScreen]),a=J(p=>p.updateScreen),d=C.useCallback(p=>{a(r,p)},[r,a]);return{screen:i,selectedScreen:r,update:d}}const eu=new Map;function zd(r,i){i?eu.set(r,i):eu.delete(r)}function pp(r){return eu.get(r)??null}function lu(){const r=J(f=>f.selectedScreen),i=J(f=>f.previewW),a=C.useCallback(()=>{try{const f=pp(r);return(f==null?void 0:f.contentDocument)??null}catch{return null}},[r]),d=C.useCallback(f=>{const y=a();if(!y)return;const m=y.querySelector(".device-wrapper");if(m){if(f.deviceScale!==void 0){const D=y.querySelector(".canvas");if(D){const w=D.getBoundingClientRect().width;if(m.dataset.origDw||(m.dataset.origDw=String(parseFloat(m.style.width)||m.getBoundingClientRect().width)),!m.dataset.origPerspective){const _=getComputedStyle(m).getPropertyValue("--device-perspective");m.dataset.origPerspective=String(parseFloat(_)||1500)}const L=parseFloat(m.dataset.origDw),g=Math.round(w*f.deviceScale/100),j=g/L;m.style.width=g+"px";const b=parseFloat(m.dataset.origPerspective);m.style.setProperty("--device-perspective",Math.round(b*j)+"px"),m.querySelectorAll(".screenshot-clip").forEach(_=>{const N=_;N.dataset.origLeft||(N.dataset.origLeft=N.style.left,N.dataset.origTop=N.style.top,N.dataset.origWidth=N.style.width,N.dataset.origHeight=N.style.height,N.dataset.origBr=N.style.borderRadius||""),N.style.left=Math.round(parseFloat(N.dataset.origLeft)*j)+"px",N.style.top=Math.round(parseFloat(N.dataset.origTop)*j)+"px",N.style.width=Math.round(parseFloat(N.dataset.origWidth)*j)+"px",N.style.height=Math.round(parseFloat(N.dataset.origHeight)*j)+"px",N.dataset.origBr&&(N.style.borderRadius=Math.round(parseFloat(N.dataset.origBr)*j)+"px")})}}if(f.deviceTop!==void 0){m.style.top=f.deviceTop+"%";for(const D of[".glow-1",".glow-2",".orb-1",".orb-2",".bg-glow",".shape-1",".shape-3",".bg-shape-1"]){const w=y.querySelector(D);w&&(w.style.top=f.deviceTop+"%")}}f.deviceOffsetX!==void 0&&(m.style.left=f.deviceOffsetX?`calc(50% + ${f.deviceOffsetX/100*i}px)`:"50%"),f.deviceRotation!==void 0&&m.style.setProperty("--device-rotation",`${f.deviceRotation}deg`),f.deviceAngle!==void 0&&m.style.setProperty("--device-angle",`${f.deviceAngle}deg`),f.deviceTilt!==void 0&&m.style.setProperty("--device-tilt",`${f.deviceTilt}deg`)}},[a,i]),p=C.useCallback(f=>{const y=a();if(!y)return;const m=y.querySelector(".canvas");if(m){if(f.type==="solid"&&f.color)m.style.background=f.color;else if(f.type==="gradient"&&f.colors){const D=f.colors.join(", ");f.gradientType==="radial"?m.style.background=`radial-gradient(circle at ${f.radialPosition??"center"}, ${D})`:m.style.background=`linear-gradient(${f.direction??135}deg, ${D})`}}},[a]),h=C.useCallback(f=>{const y=a();if(!y)return;const m=i/1290;if(f.headlineSize!==void 0||f.headlineRotation!==void 0){const D=y.querySelector(".headline");if(D&&(f.headlineSize!==void 0&&(D.style.fontSize=`${Math.round(f.headlineSize*m)}px`),f.headlineRotation!==void 0)){const w=["translateX(-50%)"];f.headlineRotation&&w.push(`rotate(${f.headlineRotation}deg)`),D.style.transform=w.join(" ")}}if(f.subtitleSize!==void 0||f.subtitleRotation!==void 0){const D=y.querySelector(".subtitle");if(D&&(f.subtitleSize!==void 0&&(D.style.fontSize=`${Math.round(f.subtitleSize*m)}px`),f.subtitleRotation!==void 0)){const w=["translateX(-50%)"];f.subtitleRotation&&w.push(`rotate(${f.subtitleRotation}deg)`),D.style.transform=w.join(" ")}}},[a,i]);return{patchDevice:d,patchBackground:p,patchText:h}}function De({title:r,children:i,hidden:a,tooltip:d,defaultCollapsed:p=!0}){const[h,f]=C.useState(p),y=C.useRef(null),[m,D]=C.useState(void 0);return C.useEffect(()=>{y.current&&!h&&D(y.current.scrollHeight)},[i,h]),a?null:l.jsxs("div",{className:"mx-3 my-1.5 first:mt-3 last:mb-3",children:[r&&l.jsxs("button",{className:"w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-surface-2 border border-border text-left cursor-pointer hover:border-accent/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",onClick:()=>f(!h),"aria-expanded":!h,children:[l.jsx("span",{className:"flex-1 text-[12px] font-medium text-text",children:r}),d&&l.jsx("span",{className:"inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-border text-[9px] text-text-dim cursor-help leading-none shrink-0",title:d,onClick:w=>w.stopPropagation(),"aria-label":d,children:"?"}),l.jsx("svg",{className:`w-3.5 h-3.5 text-text-dim shrink-0 transition-transform duration-200 ${h?"":"rotate-180"}`,viewBox:"0 0 12 12",fill:"none","aria-hidden":"true",children:l.jsx("path",{d:"M3 4.5l3 3 3-3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),l.jsx("div",{ref:y,className:"overflow-hidden transition-all duration-200 ease-in-out",style:{maxHeight:h?0:m??"none",opacity:h?0:1},"aria-hidden":h,children:l.jsx("div",{className:"px-1 pt-3 pb-1",children:i})})]})}function qe({label:r,value:i,onChange:a,onInstant:d,presets:p,onPresetClick:h}){const f=C.useId();return l.jsxs("div",{className:"mb-2.5",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("label",{htmlFor:f,className:"text-xs text-text-dim flex-1",children:r}),l.jsx("input",{id:f,type:"color",value:i,"aria-label":r,className:"w-8 h-8 border border-border rounded-md cursor-pointer bg-transparent p-0.5",onInput:y=>{d==null||d(y.target.value)},onChange:y=>{a(y.target.value)}})]}),p&&p.length>0&&l.jsx("div",{className:"flex flex-wrap gap-1 mt-1.5",children:p.map(y=>l.jsx("button",{className:"w-6 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:y},title:y,"aria-label":`Select color ${y}`,onClick:()=>{h==null||h(y),a(y)}},y))})]})}function Z({label:r,value:i,min:a,max:d,step:p=1,formatValue:h,onChange:f,onInstant:y,disabled:m}){const D=C.useId(),w=h?h(i):String(i),[L,g]=C.useState(!1),[j,b]=C.useState(""),_=C.useRef(null);C.useEffect(()=>{var I;L&&((I=_.current)==null||I.select())},[L]);function N(){g(!1);const I=parseFloat(j);if(Number.isNaN(I))return;const V=Math.min(d,Math.max(a,I)),ee=Math.round(V/p)*p;f(ee)}return l.jsxs("div",{className:`mb-2.5${m?" opacity-50 cursor-not-allowed":""}`,children:[l.jsx("label",{htmlFor:D,className:"block text-xs text-text-dim mb-1",children:r}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("input",{id:D,type:"range",min:a,max:d,step:p,value:i,disabled:m,"aria-label":r,"aria-valuemin":a,"aria-valuemax":d,"aria-valuenow":i,"aria-valuetext":w,className:"w-full accent-accent",onInput:I=>{const V=Number(I.target.value);y==null||y(V)},onChange:I=>{f(Number(I.target.value))}}),L?l.jsx("input",{ref:_,type:"text",inputMode:"decimal","aria-label":`Edit ${r} value`,value:j,onChange:I=>b(I.target.value),onBlur:N,onKeyDown:I=>{I.key==="Enter"&&N(),I.key==="Escape"&&g(!1)},className:"text-xs text-text bg-surface border border-border rounded px-1 py-0 min-w-[40px] w-[48px] text-right shrink-0 outline-none focus:border-accent"}):l.jsx("span",{className:`text-xs text-text-dim min-w-[40px] text-right shrink-0 transition-colors${m?"":" cursor-text hover:text-text"}`,tabIndex:m?void 0:0,role:"spinbutton","aria-label":`${r}: ${w}. Click to edit`,"aria-valuenow":i,"aria-valuetext":w,onClick:()=>{m||(b(String(i)),g(!0))},onKeyDown:I=>{m||(I.key==="Enter"||I.key===" ")&&(I.preventDefault(),b(String(i)),g(!0))},children:w})]})]})}const vt=C.memo(function({label:i,checked:a,onChange:d}){return l.jsx("div",{className:"mb-2.5",children:l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"checkbox",checked:a,onChange:p=>d(p.target.checked),className:"accent-accent"}),i]})})}),Ge=C.memo(function({label:i,value:a,onChange:d,options:p,groups:h,hidden:f}){const y=C.useId();return f?null:l.jsxs("div",{className:"mb-2.5",children:[i&&l.jsx("label",{htmlFor:y,className:"block text-xs text-text-dim mb-1",children:i}),l.jsxs("select",{id:y,value:a,onChange:m=>d(m.target.value),"aria-label":i||void 0,className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent",children:[p==null?void 0:p.map(m=>l.jsx("option",{value:m.value,disabled:m.disabled,title:m.title,children:m.label},m.value)),h==null?void 0:h.map(m=>l.jsx("optgroup",{label:m.label,children:m.options.map(D=>l.jsx("option",{value:D.value,disabled:D.disabled,title:D.title,children:D.label},D.value))},m.label))]})]})}),af=["#000000","#1a1a2e","#16213e","#0f3460","#533483","#e94560","#f5f5f5","#fafafa","#2d3436","#636e72","#00b894","#00cec9","#6c5ce7","#fdcb6e","#e17055","#dfe6e9","#b2bec3","#2c3e50","#8e44ad","#2980b9"],su=[{name:"Sunset",colors:["#ff6b35","#f7c948","#ff3864"],direction:135},{name:"Ocean",colors:["#0052d4","#4364f7","#6fb1fc"],direction:135},{name:"Midnight",colors:["#0f0c29","#302b63","#24243e"],direction:135},{name:"Sky",colors:["#2980b9","#6dd5fa","#ffffff"],direction:180},{name:"Horizon",colors:["#003973","#e5e5be","#f7a600"],direction:180},{name:"Vapor",colors:["#fc5c7d","#ce9ffc","#6a82fb"],direction:135},{name:"Tropical",colors:["#f7971e","#ffd200","#21d4fd"],direction:135},{name:"Dusk Sky",colors:["#2c3e50","#4ca1af","#c4e0e5"],direction:180},{name:"Flamingo",colors:["#ee5a24","#f0932b","#fad390"],direction:135},{name:"Arctic",colors:["#1e3c72","#2a5298","#e8f5e9"],direction:180},{name:"Velvet",colors:["#6a0572","#ab83a1","#f5e6cc"],direction:135},{name:"Lush",colors:["#004e92","#00b4db","#88d8b0"],direction:135},{name:"Aurora",colors:["#00c9ff","#92fe9d"],direction:135},{name:"Coral",colors:["#ff9a9e","#fecfef"],direction:135},{name:"Lavender",colors:["#a18cd1","#fbc2eb"],direction:135},{name:"Emerald",colors:["#11998e","#38ef7d"],direction:135},{name:"Fire",colors:["#f83600","#f9d423"],direction:135},{name:"Berry",colors:["#8e2de2","#4a00e0"],direction:135},{name:"Peach",colors:["#ffecd2","#fcb69f"],direction:135},{name:"Dusk",colors:["#2c3e50","#fd746c"],direction:135},{name:"Mint",colors:["#00b09b","#96c93d"],direction:135},{name:"Rose",colors:["#ee9ca7","#ffdde1"],direction:135},{name:"Indigo",colors:["#667eea","#764ba2"],direction:135},{name:"Candy",colors:["#fc5c7d","#6a82fb"],direction:135},{name:"Forest",colors:["#134e5e","#71b280"],direction:135},{name:"Neon",colors:["#00f260","#0575e6"],direction:135},{name:"Warm",colors:["#f093fb","#f5576c"],direction:135}],uf={"Natural Titanium":"#9a8e7e","Black Titanium":"#3c3c3c","White Titanium":"#e8e5e0","Desert Titanium":"#c4a882","Blue Titanium":"#394e5f",Black:"#1c1c1e",White:"#f5f5f7",Pink:"#f9cdd3",Teal:"#5eb5b5",Ultramarine:"#4a50c7",Blue:"#5b8fb9",Green:"#3f6e4e",Yellow:"#f2d44e",Red:"#c43d40",Purple:"#7c5dab",Midnight:"#2c2c3a",Starlight:"#f0e8d8","Product Red":"#c43d40","Space Black":"#2a2a2c","Space Gray":"#636366",Silver:"#d6d6d6",Gold:"#e3caa5","Deep Purple":"#5e4580",Graphite:"#4f4f4f","Pacific Blue":"#1e5c82","Sierra Blue":"#9fb8cf","Alpine Green":"#3c5e48","Rose Gold":"#e6c0aa"},hp=[{value:"minimal",label:"Minimal"},{value:"bold",label:"Bold"},{value:"glow",label:"Glow"},{value:"playful",label:"Playful"},{value:"clean",label:"Clean"},{value:"branded",label:"Branded"},{value:"editorial",label:"Editorial"}],_p=[{value:"solid",label:"Solid"},{value:"gradient",label:"Gradient"},{value:"image",label:"Image"},{value:"preset",label:"Preset"}],gp=[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}];function yp(){const{screen:r,update:i}=ai(),a=C.useRef(null),{patchBackground:d}=lu(),p=C.useCallback(g=>d({type:"solid",color:g}),[d]),h=C.useCallback(g=>{if(!r)return;const j=r.backgroundGradient;d({type:"gradient",gradientType:j.type,colors:(g==null?void 0:g.colors)??j.colors,direction:(g==null?void 0:g.direction)??j.direction,radialPosition:j.radialPosition})},[r,d]),[f,y]=C.useState(!1);if(!r)return null;const m=r.backgroundType,D=f||m==="preset"?"preset":m,w=g=>{var _;const j=(_=g.target.files)==null?void 0:_[0];if(!j)return;const b=new FileReader;b.onload=N=>{var I;i({backgroundImageDataUrl:(I=N.target)==null?void 0:I.result})},b.readAsDataURL(j),g.target.value=""},L=()=>{const g=[...r.backgroundGradient.colors];g.length>=5||(g.push("#ffffff"),i({backgroundGradient:{...r.backgroundGradient,colors:g}}))};return l.jsxs(l.Fragment,{children:[l.jsxs(De,{title:"Background",tooltip:"Choose between solid colors, gradients, images, or template presets for your screenshot background.",defaultCollapsed:!1,children:[l.jsx("div",{className:"flex gap-3 mb-2.5",children:_p.map(g=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"bg-type",value:g.value,checked:D===g.value,onChange:()=>{g.value==="preset"?y(!0):(y(!1),i({backgroundType:g.value}))},className:"accent-accent"}),g.label]},g.value))}),D==="preset"&&l.jsx(Ge,{label:"Style Preset",value:m==="preset"?r.style:"",onChange:g=>{i({backgroundType:"preset",style:g})},options:[{value:"",label:"Select a preset...",disabled:!0},...hp]}),D==="solid"&&l.jsx(qe,{label:"Color",value:r.backgroundColor,onChange:g=>i({backgroundColor:g}),onInstant:p,presets:af}),D==="gradient"&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:su.map(g=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${g.direction}deg, ${g.colors.join(", ")})`},title:g.name,"aria-label":`Apply ${g.name} gradient`,onClick:()=>i({backgroundGradient:{type:"linear",colors:[...g.colors],direction:g.direction,radialPosition:"center"}})},g.name))}),l.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(g=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"gradient-type",checked:r.backgroundGradient.type===g,onChange:()=>i({backgroundGradient:{...r.backgroundGradient,type:g}}),className:"accent-accent"}),g.charAt(0).toUpperCase()+g.slice(1)]},g))}),r.backgroundGradient.type==="linear"&&l.jsx(Z,{label:"Direction",value:r.backgroundGradient.direction,min:0,max:360,formatValue:g=>`${g}°`,onChange:g=>i({backgroundGradient:{...r.backgroundGradient,direction:g}}),onInstant:g=>h({direction:g})}),r.backgroundGradient.type==="radial"&&l.jsx(Ge,{label:"Center",value:r.backgroundGradient.radialPosition,onChange:g=>i({backgroundGradient:{...r.backgroundGradient,radialPosition:g}}),options:gp}),r.backgroundGradient.colors.map((g,j)=>l.jsx(qe,{label:`Stop ${j+1}`,value:g,onChange:b=>{const _=[...r.backgroundGradient.colors];_[j]=b,i({backgroundGradient:{...r.backgroundGradient,colors:_}})}},j)),r.backgroundGradient.colors.length<5&&l.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:L,children:"+ Add Color Stop"})]}),D==="image"&&l.jsxs(l.Fragment,{children:[!r.backgroundImageDataUrl&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Upload a custom image to use as the screenshot background. Supports PNG, JPEG, and WebP."}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var g;return(g=a.current)==null?void 0:g.click()},children:"Upload Background Image"}),l.jsx("input",{ref:a,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload background image",onChange:w}),r.backgroundImageDataUrl&&l.jsxs("div",{className:"mt-1.5",children:[l.jsx("img",{src:r.backgroundImageDataUrl,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>i({backgroundImageDataUrl:null}),children:"Remove"})]}),l.jsxs("div",{className:"mt-2",children:[l.jsx(vt,{label:"Dim Overlay",checked:!!r.backgroundOverlay,onChange:g=>i({backgroundOverlay:g?{color:"#000000",opacity:.3}:null})}),r.backgroundOverlay&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Color",value:r.backgroundOverlay.color,onChange:g=>i({backgroundOverlay:{...r.backgroundOverlay,color:g}})}),l.jsx(Z,{label:"Opacity",value:Math.round(r.backgroundOverlay.opacity*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>i({backgroundOverlay:{...r.backgroundOverlay,opacity:g/100}})})]})]})]})]}),l.jsxs(De,{title:"Preset Colors",hidden:m!=="preset",tooltip:"Override the default colors for the selected template preset.",children:[l.jsx(qe,{label:"Primary",value:r.colors.primary,onChange:g=>i({colors:{...r.colors,primary:g}})}),l.jsx(qe,{label:"Secondary",value:r.colors.secondary,onChange:g=>i({colors:{...r.colors,secondary:g}})}),l.jsx(qe,{label:"Background",value:r.colors.background,onChange:g=>i({colors:{...r.colors,background:g}})})]})]})}function Od(r,i,a){const p=[{name:"nw",x:a.x,y:a.y},{name:"ne",x:a.x+a.w,y:a.y},{name:"sw",x:a.x,y:a.y+a.h},{name:"se",x:a.x+a.w,y:a.y+a.h}];for(const h of p)if(Math.abs(r-h.x)<12&&Math.abs(i-h.y)<12)return h.name;return r>a.x&&r<a.x+a.w&&i>a.y&&i<a.y+a.h?"move":"new"}const xp={nw:"nw-resize",ne:"ne-resize",sw:"sw-resize",se:"se-resize",move:"move",new:"crosshair"};function vp({imageDataUrl:r,onApply:i,onCancel:a}){const d=C.useRef(null),p=C.useRef(null),h=C.useRef(null),f=C.useRef({x:0,y:0,w:0,h:0}),y=C.useRef(1),m=C.useRef({mode:null,startX:0,startY:0,startCrop:{x:0,y:0,w:0,h:0}}),D=C.useCallback(()=>{const g=p.current,j=h.current;if(!g||!j)return;const b=g.getContext("2d");if(!b)return;const _=g.width,N=g.height,I=f.current;b.clearRect(0,0,_,N),b.drawImage(j,0,0,_,N),b.fillStyle="rgba(0,0,0,0.5)",b.fillRect(0,0,_,I.y),b.fillRect(0,I.y+I.h,_,N-I.y-I.h),b.fillRect(0,I.y,I.x,I.h),b.fillRect(I.x+I.w,I.y,_-I.x-I.w,I.h),b.strokeStyle="#fff",b.lineWidth=2,b.strokeRect(I.x,I.y,I.w,I.h);const V=8;b.fillStyle="#fff";const ee=[[I.x,I.y],[I.x+I.w,I.y],[I.x,I.y+I.h],[I.x+I.w,I.y+I.h]];for(const[ie,le]of ee)b.fillRect(ie-V/2,le-V/2,V,V);b.strokeStyle="rgba(255,255,255,0.25)",b.lineWidth=1;for(let ie=1;ie<=2;ie++)b.beginPath(),b.moveTo(I.x+I.w*ie/3,I.y),b.lineTo(I.x+I.w*ie/3,I.y+I.h),b.stroke(),b.beginPath(),b.moveTo(I.x,I.y+I.h*ie/3),b.lineTo(I.x+I.w,I.y+I.h*ie/3),b.stroke()},[]);C.useEffect(()=>{var j;const g=b=>{if(b.key==="Escape"){a();return}if(b.key==="Tab"&&d.current){const _=d.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');if(_.length===0)return;const N=_[0],I=_[_.length-1];b.shiftKey&&document.activeElement===N?(b.preventDefault(),I.focus()):!b.shiftKey&&document.activeElement===I&&(b.preventDefault(),N.focus())}};return window.addEventListener("keydown",g),(j=d.current)==null||j.focus(),()=>window.removeEventListener("keydown",g)},[a]),C.useEffect(()=>{const g=new Image;g.onload=()=>{h.current=g;const j=g.naturalWidth,b=g.naturalHeight,_=window.innerWidth*.8,N=window.innerHeight*.7,I=Math.min(_/j,N/b,1);y.current=I;const V=Math.round(j*I),ee=Math.round(b*I),ie=p.current;ie&&(ie.width=V,ie.height=ee,f.current={x:Math.round(V*.1),y:Math.round(ee*.1),w:Math.round(V*.8),h:Math.round(ee*.8)},D())},g.src=r},[r,D]);const w=C.useCallback(g=>{const j=p.current;if(!j)return;const b=j.getBoundingClientRect(),_=g.clientX-b.left,N=g.clientY-b.top,I=Od(_,N,f.current),V=f.current;m.current={mode:I==="new"?"se":I,startX:_,startY:N,startCrop:{...V}},I==="new"&&(f.current={x:_,y:N,w:0,h:0})},[]);C.useEffect(()=>{const g=b=>{const _=p.current;if(!_)return;const N=_.getBoundingClientRect(),I=_.width,V=_.height,ee=m.current;if(!ee.mode){const ue=Od(b.clientX-N.left,b.clientY-N.top,f.current);_.style.cursor=xp[ue]??"crosshair";return}const ie=Math.max(0,Math.min(I,b.clientX-N.left)),le=Math.max(0,Math.min(V,b.clientY-N.top)),re=ie-ee.startX,M=le-ee.startY,x=ee.startCrop,K=f.current;ee.mode==="move"?(K.x=Math.max(0,Math.min(I-x.w,x.x+re)),K.y=Math.max(0,Math.min(V-x.h,x.y+M))):ee.mode==="se"?(K.w=Math.max(10,ie-K.x),K.h=Math.max(10,le-K.y)):ee.mode==="nw"?(K.x=Math.min(x.x+x.w-10,x.x+re),K.y=Math.min(x.y+x.h-10,x.y+M),K.w=x.w-(K.x-x.x),K.h=x.h-(K.y-x.y)):ee.mode==="ne"?(K.y=Math.min(x.y+x.h-10,x.y+M),K.w=Math.max(10,x.w+re),K.h=x.h-(K.y-x.y)):ee.mode==="sw"&&(K.x=Math.min(x.x+x.w-10,x.x+re),K.w=x.w-(K.x-x.x),K.h=Math.max(10,x.h+M)),D()},j=()=>{m.current.mode=null};return document.addEventListener("mousemove",g),document.addEventListener("mouseup",j),()=>{document.removeEventListener("mousemove",g),document.removeEventListener("mouseup",j)}},[D]);const L=C.useCallback(()=>{const g=h.current;if(!g)return;const j=f.current,b=y.current,_=Math.round(j.x/b),N=Math.round(j.y/b);let I=Math.round(j.w/b),V=Math.round(j.h/b);I=Math.min(I,g.naturalWidth-_),V=Math.min(V,g.naturalHeight-N);const ee=document.createElement("canvas");ee.width=I,ee.height=V;const ie=ee.getContext("2d");ie&&(ie.drawImage(g,_,N,I,V,0,0,I,V),i(ee.toDataURL("image/png")))},[i]);return l.jsxs("div",{ref:d,tabIndex:-1,role:"dialog","aria-modal":"true","aria-label":"Crop screenshot",className:"fixed inset-0 z-[9999] flex flex-col items-center justify-center outline-none",style:{background:"rgba(0,0,0,0.8)"},children:[l.jsx("div",{className:"text-white text-base font-semibold mb-3",children:"Crop Screenshot"}),l.jsx("canvas",{ref:p,className:"border border-white/30",style:{cursor:"crosshair"},role:"img","aria-label":"Screenshot crop area. Click and drag to select the region to crop.",onMouseDown:w}),l.jsxs("div",{className:"flex gap-2 mt-3",children:[l.jsx("button",{className:"px-6 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent-hover",onClick:L,children:"Apply Crop"}),l.jsx("button",{className:"px-6 py-2 text-sm bg-surface-2 text-text-dim border border-border rounded-md hover:text-text",onClick:a,children:"Cancel"})]})]})}const bp={single:{deviceCount:1,slots:[{offsetX:0,offsetY:15,scale:92,rotation:0,angle:0,tilt:0,zIndex:1}]},"duo-overlap":{deviceCount:2,slots:[{offsetX:-30,offsetY:18,scale:85,rotation:-12,angle:12,tilt:2,zIndex:1},{offsetX:22,offsetY:8,scale:88,rotation:4,angle:0,tilt:0,zIndex:2}]},"duo-split":{deviceCount:2,slots:[{offsetX:-38,offsetY:12,scale:80,rotation:-5,angle:8,tilt:2,zIndex:1},{offsetX:38,offsetY:12,scale:80,rotation:5,angle:-8,tilt:2,zIndex:1}]},"hero-tilt":{deviceCount:2,slots:[{offsetX:-35,offsetY:20,scale:78,rotation:-15,angle:15,tilt:4,zIndex:1},{offsetX:12,offsetY:8,scale:92,rotation:0,angle:0,tilt:0,zIndex:2}]},"fanned-cards":{deviceCount:3,slots:[{offsetX:-35,offsetY:16,scale:68,rotation:-18,angle:0,tilt:0,zIndex:1},{offsetX:0,offsetY:8,scale:72,rotation:0,angle:0,tilt:0,zIndex:3},{offsetX:35,offsetY:16,scale:68,rotation:18,angle:0,tilt:0,zIndex:2}]}},wp=[{value:"center",label:"Center"},{value:"angled-left",label:"Angled Left"},{value:"angled-right",label:"Angled Right"}],kp=[{value:"flat",label:"Flat"},{value:"none",label:"None (frameless)"}],Cp=[{value:"single",label:"Single Device"}],Sp=[{label:"Multi-Device",options:[{value:"duo-overlap",label:"Duo Overlap (2)"},{value:"duo-split",label:"Duo Split (2)"},{value:"hero-tilt",label:"Hero + Background (2)"},{value:"fanned-cards",label:"Fanned Cards (3)"}]}],jp=[{value:"iphone",label:"iPhone"},{value:"ipad",label:"iPad"},{value:"mac",label:"Mac"},{value:"watch",label:"Apple Watch"},{value:"android",label:"Android"}],Ep={iphone:"iphone",android:"iphone",ipad:"ipad",mac:"mac",watch:"watch"};function Np(r,i){if(r==="android")return"generic-phone";const a=Ep[r]??"iphone",d=i.filter(p=>p.category===a).sort((p,h)=>h.year-p.year)[0];return d?d.id:a==="ipad"?"ipad-pro-13":"generic-phone"}const Fd=.15;function Dd(r,i){const a=r.width/r.height;return Math.abs(i-a)/a<Fd||Math.abs(i-1/a)/(1/a)<Fd}const Pp={iphone:["iphone"],android:["iphone"],ipad:["ipad"],mac:["mac"],watch:["watch"]},Rp={iphone:["default-ios","default-android"],android:["default-ios","default-android"],ipad:["default-ipad","fallback-tablet"],mac:[],watch:[]};function Lp(r,i,a,d,p){const h=a?a.width/a.height:null,f=!d&&h!==null,y=Pp[p]??["iphone"],m=Rp[p]??[],D={};for(const g of r){const j=g.category||"other";if(!d&&!y.includes(j)||f&&!Dd(g.screenResolution,h))continue;const b=D[j]??[];b.push({value:g.id,label:g.name}),D[j]=b}const w=Object.entries(D).map(([g,j])=>({label:g.charAt(0).toUpperCase()+g.slice(1),options:j})),L=[];for(const g of i){if(!d&&m.length>0){if(!(g.tags??[]).some(b=>m.includes(b)))continue}else if(!d&&m.length===0)continue;f&&g.screenResolution&&!Dd(g.screenResolution,h)||L.push({value:g.id,label:g.name})}return L.length>0&&w.push({label:"SVG Frames",options:L}),w}function Tp(){var ze,Ae,We;const{screen:r,update:i}=ai(),a=J(F=>F.platform),d=J(F=>F.setPlatform),p=J(F=>F.setPreviewSize),h=J(F=>F.sizes),f=J(F=>F.setExportSize),y=J(F=>F.triggerRender),m=J(F=>F.updateScreen),D=J(F=>F.screens),w=J(F=>F.deviceFamilies),L=J(F=>F.frames),g=C.useRef(null),[j,b]=C.useState(!1),[_,N]=C.useState(!1),{patchDevice:I}=lu(),V=C.useCallback((F,U)=>I({[F]:U}),[I]),ee=F=>{d(F);const U=Fl[F]??Fl.iphone;p(U.w,U.h);const $=h[F]??[];$.length>0&&f($[0].key);const H=Np(F,w);for(let X=0;X<D.length;X++)m(X,{frameId:H,deviceColor:""});y()};if(!r)return null;const ie=w.find(F=>F.id===r.frameId),le=ie&&ie.colors.length>1,re=ie&&ie.screenRect,M=r.frameStyle==="none",x=r.layout==="angled-left"||r.layout==="angled-right",K=C.useMemo(()=>Lp(w,L,r.screenshotDims,_,a),[w,L,r.screenshotDims,_,a]),ue=F=>{var H;const U=(H=F.target.files)==null?void 0:H[0];if(!U)return;const $=new FileReader;$.onload=X=>{var ce;const R=(ce=X.target)==null?void 0:ce.result,A=new Image;A.onload=()=>{const we={width:A.naturalWidth,height:A.naturalHeight};i({screenshotDataUrl:R,screenshotName:U.name,screenshotDims:we})},A.src=R},$.readAsDataURL(U),F.target.value=""},q=F=>{b(!1);const U=new Image;U.onload=()=>{const $={width:U.naturalWidth,height:U.naturalHeight};i({screenshotDataUrl:F,screenshotDims:$})},U.src=F},me=li[a]??li.iphone;return l.jsxs(l.Fragment,{children:[j&&r.screenshotDataUrl&&l.jsx(vp,{imageDataUrl:r.screenshotDataUrl,onApply:q,onCancel:()=>b(!1)}),l.jsx(De,{title:"Platform",tooltip:"Choose the target platform. This adjusts the preview dimensions and available device frames.",defaultCollapsed:!1,children:l.jsx(Ge,{label:"Platform",value:a,onChange:ee,options:jp})}),l.jsxs(De,{title:"Screenshot",children:[r.screenshotDataUrl&&l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:r.screenshotDataUrl,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:r.screenshotName||"Custom upload"})]}),!r.screenshotDataUrl&&r.screenshotName&&l.jsx("div",{className:"text-xs text-text-dim mb-2",children:r.screenshotName}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var F;return(F=g.current)==null?void 0:F.click()},children:"Upload Screenshot"}),l.jsx("input",{ref:g,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload screenshot image",onChange:ue}),r.screenshotDataUrl&&l.jsxs("div",{className:"flex gap-1 mt-1.5",children:[l.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>b(!0),children:"Crop"}),l.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>i({screenshotDataUrl:null,screenshotName:null,screenshotDims:null}),children:"Revert"})]})]}),l.jsxs(De,{title:"Device Frame",children:[l.jsx(Ge,{label:"Device",value:r.frameId,onChange:F=>{const U=w.find(H=>H.id===F);U&&U.screenRect&&r.frameStyle==="none"?i({frameId:F,frameStyle:"flat"}):i({frameId:F})},groups:K}),r.screenshotDims&&l.jsx(vt,{label:"Show all frames",checked:_,onChange:N}),le&&l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),l.jsx("div",{className:"flex flex-wrap gap-1",children:ie.colors.map(F=>l.jsx("button",{className:`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none ${r.deviceColor===F.name?"border-accent ring-1 ring-accent":"border-border"}`,style:{background:uf[F.name]??"#888888"},title:F.name,"aria-label":`${F.name} color variant`,"aria-pressed":r.deviceColor===F.name,onClick:()=>i({deviceColor:F.name})},F.name))})]}),l.jsx(Ge,{label:"Frame Style",value:r.frameStyle,onChange:F=>i({frameStyle:F}),options:kp,hidden:!!re}),M&&l.jsxs(l.Fragment,{children:[l.jsx(vt,{label:"Border Simulation",checked:!!r.borderSimulation,onChange:F=>i({borderSimulation:F?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:null})}),r.borderSimulation&&l.jsxs(l.Fragment,{children:[l.jsx(Z,{label:"Thickness",value:r.borderSimulation.thickness,min:1,max:20,formatValue:F=>`${F}px`,onChange:F=>i({borderSimulation:{...r.borderSimulation,thickness:F}})}),l.jsx(qe,{label:"Color",value:r.borderSimulation.color,onChange:F=>i({borderSimulation:{...r.borderSimulation,color:F}})}),l.jsx(Z,{label:"Radius",value:r.borderSimulation.radius,min:0,max:60,formatValue:F=>`${F}px`,onChange:F=>i({borderSimulation:{...r.borderSimulation,radius:F}})})]})]})]}),l.jsxs(De,{title:"Device Layout",tooltip:"Control the size, position, rotation, and tilt of the device in the screenshot frame.",children:[l.jsx(vt,{label:"Fullscreen Screenshot",checked:r.style==="fullscreen",onChange:F=>i({style:F?"fullscreen":"minimal"})}),r.style!=="fullscreen"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Layout",value:r.layout,onChange:F=>i({layout:F}),options:wp}),l.jsx(Z,{label:"Device Size",value:r.deviceScale,min:50,max:100,formatValue:F=>`${F}%`,onChange:F=>i({deviceScale:F}),onInstant:F=>V("deviceScale",F)}),l.jsx(Z,{label:"Device Position",value:r.deviceTop,min:-80,max:80,formatValue:F=>`${F}%`,onChange:F=>i({deviceTop:F}),onInstant:F=>V("deviceTop",F)}),l.jsx(Z,{label:"Horizontal Position",value:r.deviceOffsetX,min:-80,max:80,formatValue:F=>`${F}%`,onChange:F=>i({deviceOffsetX:F}),onInstant:F=>V("deviceOffsetX",F)}),l.jsx(Z,{label:"Device Rotation",value:r.deviceRotation,min:-180,max:180,formatValue:F=>`${F}°`,onChange:F=>i({deviceRotation:F}),onInstant:F=>V("deviceRotation",F)}),x&&l.jsx(Z,{label:"Perspective Angle",value:r.deviceAngle,min:2,max:45,formatValue:F=>`${F}°`,onChange:F=>i({deviceAngle:F}),onInstant:F=>V("deviceAngle",F)}),l.jsx(Z,{label:"3D Tilt",value:r.deviceTilt,min:0,max:40,formatValue:F=>`${F}°`,onChange:F=>i({deviceTilt:F}),onInstant:F=>V("deviceTilt",F)}),M&&l.jsx(Z,{label:"Corner Radius",value:r.cornerRadius,min:0,max:50,formatValue:F=>`${F}%`,onChange:F=>i({cornerRadius:F})}),l.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>i({deviceScale:me.deviceScale,deviceTop:me.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:me.deviceAngle,deviceTilt:0,cornerRadius:0}),children:"Reset Device Position"})]})]}),l.jsxs(De,{title:"Device Shadow",tooltip:"Add a custom drop shadow behind the device frame.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Custom Shadow",checked:!!r.deviceShadow,onChange:F=>i({deviceShadow:F?{opacity:.25,blur:20,color:"#000000",offsetY:10}:null})}),l.jsxs("div",{className:r.deviceShadow?"":"opacity-40 pointer-events-none",children:[l.jsx(Z,{label:"Opacity",value:r.deviceShadow?Math.round(r.deviceShadow.opacity*100):25,min:0,max:100,formatValue:F=>`${F}%`,onChange:F=>i({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},opacity:F/100}})}),l.jsx(Z,{label:"Blur",value:((ze=r.deviceShadow)==null?void 0:ze.blur)??20,min:0,max:50,formatValue:F=>`${F}px`,onChange:F=>i({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},blur:F}})}),l.jsx(qe,{label:"Color",value:((Ae=r.deviceShadow)==null?void 0:Ae.color)??"#000000",onChange:F=>i({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},color:F}})}),l.jsx(Z,{label:"Y Offset",value:((We=r.deviceShadow)==null?void 0:We.offsetY)??10,min:0,max:30,formatValue:F=>`${F}px`,onChange:F=>i({deviceShadow:{...r.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},offsetY:F}})})]})]}),l.jsx(De,{title:"Composition",tooltip:"Choose how devices are arranged. Use multi-device layouts to show multiple app screens in one image.",defaultCollapsed:!0,children:l.jsx(Ge,{label:"Device Arrangement",value:r.composition,onChange:F=>{const U=F,$=bp[U];if($&&$.deviceCount===1){const H=$.slots[0];i({composition:U,deviceOffsetX:H.offsetX,deviceTop:H.offsetY,deviceScale:H.scale,deviceRotation:H.rotation,deviceAngle:H.angle,deviceTilt:H.tilt})}else i({composition:U})},options:Cp,groups:Sp})})]})}const Ip={"sans-serif":"Sans Serif",serif:"Serif",display:"Display"},$p=["sans-serif","serif","display"];function cf(r){const i={};for(const a of r){const d=a.category??"sans-serif",p=i[d]??[];p.push({value:a.id,label:a.name}),i[d]=p}return $p.filter(a=>{var d;return(d=i[a])==null?void 0:d.length}).map(a=>({label:Ip[a]??a,options:i[a]}))}const Ad=[{value:"",label:"Auto"},{value:"none",label:"None"},{value:"uppercase",label:"Uppercase"},{value:"lowercase",label:"Lowercase"},{value:"capitalize",label:"Capitalize"}],Mp=[{value:"",label:"Auto"},{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}];function zp(){const{screen:r,update:i}=ai(),a=J(m=>m.fonts),{patchText:d}=lu(),p=C.useCallback((m,D)=>d({[m]:D}),[d]),h=C.useMemo(()=>cf(a),[a]),f=C.useId(),y=C.useId();return r?l.jsxs(l.Fragment,{children:[l.jsxs(De,{title:"Text",tooltip:"Edit the headline and subtitle text that appears above or below the device frame.",defaultCollapsed:!1,children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{htmlFor:f,className:"block text-xs text-text-dim mb-1",children:"Headline"}),l.jsx("textarea",{id:f,rows:2,value:r.headline,onChange:m=>i({headline:m.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{htmlFor:y,className:"block text-xs text-text-dim mb-1",children:"Subtitle"}),l.jsx("input",{id:y,type:"text",value:r.subtitle,onChange:m=>i({subtitle:m.target.value}),placeholder:"Optional subtitle",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent"})]}),l.jsx(qe,{label:"Headline Color",value:r.colors.text,onChange:m=>i({colors:{...r.colors,text:m}})}),l.jsx(qe,{label:"Subtitle Color",value:r.colors.subtitle,onChange:m=>i({colors:{...r.colors,subtitle:m}})})]}),l.jsxs(De,{title:"Typography",tooltip:"Control font family, weight, size, rotation, spacing, and text transformations.",children:[l.jsx(Ge,{label:"Font",value:r.font,onChange:m=>i({font:m}),groups:h}),l.jsx(Z,{label:"Font Weight",value:r.fontWeight,min:400,max:800,step:100,formatValue:m=>String(m),onChange:m=>i({fontWeight:m})}),l.jsx(Z,{label:"Headline Size",value:r.headlineSize,min:0,max:200,formatValue:m=>m===0?"Auto":`${m}px`,onChange:m=>i({headlineSize:m}),onInstant:m=>p("headlineSize",m),disabled:r.autoSizeHeadline}),l.jsx(Z,{label:"Subtitle Size",value:r.subtitleSize,min:0,max:120,formatValue:m=>m===0?"Auto":`${m}px`,onChange:m=>i({subtitleSize:m}),onInstant:m=>p("subtitleSize",m),disabled:r.autoSizeSubtitle}),l.jsx(vt,{label:"Auto-size Headline",checked:r.autoSizeHeadline,onChange:m=>i({autoSizeHeadline:m})}),l.jsx(vt,{label:"Auto-size Subtitle",checked:r.autoSizeSubtitle,onChange:m=>i({autoSizeSubtitle:m})}),l.jsx(Z,{label:"Headline Rotation",value:r.headlineRotation,min:-30,max:30,formatValue:m=>`${m}°`,onChange:m=>i({headlineRotation:m}),onInstant:m=>p("headlineRotation",m)}),l.jsx(Z,{label:"Subtitle Rotation",value:r.subtitleRotation,min:-30,max:30,formatValue:m=>`${m}°`,onChange:m=>i({subtitleRotation:m}),onInstant:m=>p("subtitleRotation",m)}),l.jsx(Z,{label:"Headline Line Height",value:r.headlineLineHeight,min:80,max:180,formatValue:m=>m===0?"Auto":(m/100).toFixed(2),onChange:m=>i({headlineLineHeight:m})}),l.jsx(Z,{label:"Headline Letter Spacing",value:r.headlineLetterSpacing,min:-5,max:10,formatValue:m=>m===0?"Auto":`${m/100}em`,onChange:m=>i({headlineLetterSpacing:m})}),l.jsxs("div",{className:"flex gap-2 mb-2",children:[l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Headline Case",value:r.headlineTextTransform,onChange:m=>i({headlineTextTransform:m}),options:Ad})}),l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Headline Style",value:r.headlineFontStyle,onChange:m=>i({headlineFontStyle:m}),options:Mp})})]}),l.jsx(Z,{label:"Subtitle Opacity",value:r.subtitleOpacity,min:0,max:100,formatValue:m=>m===0?"Auto":`${m}%`,onChange:m=>i({subtitleOpacity:m})}),l.jsx(Z,{label:"Subtitle Letter Spacing",value:r.subtitleLetterSpacing,min:-5,max:10,formatValue:m=>m===0?"Auto":`${m/100}em`,onChange:m=>i({subtitleLetterSpacing:m})}),l.jsx(Ge,{label:"Subtitle Case",value:r.subtitleTextTransform,onChange:m=>i({subtitleTextTransform:m}),options:Ad})]}),l.jsxs(De,{title:"Text Position",tooltip:"Drag text elements in the preview to reposition, or reset to default positions.",children:[l.jsx("span",{className:"text-[11px] text-text-dim leading-tight block mb-1.5",children:"Drag the headline or subtitle in the preview to reposition them."}),l.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>i({textPositions:{headline:null,subtitle:null}}),children:"Reset to Default"})]}),l.jsxs(De,{title:"Text Gradient",tooltip:"Apply a gradient color effect to headline or subtitle text.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Enable Headline Gradient",checked:!!r.headlineGradient,onChange:m=>i({headlineGradient:m?{colors:["#6366f1","#ec4899"],direction:90}:null})}),r.headlineGradient&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Start",value:r.headlineGradient.colors[0]??"#6366f1",onChange:m=>i({headlineGradient:{...r.headlineGradient,colors:[m,r.headlineGradient.colors[1]??"#ec4899"]}})}),l.jsx(qe,{label:"End",value:r.headlineGradient.colors[1]??"#ec4899",onChange:m=>i({headlineGradient:{...r.headlineGradient,colors:[r.headlineGradient.colors[0]??"#6366f1",m]}})}),l.jsx(Z,{label:"Direction",value:r.headlineGradient.direction,min:0,max:360,formatValue:m=>`${m}°`,onChange:m=>i({headlineGradient:{...r.headlineGradient,direction:m}})})]}),l.jsx("div",{className:"mt-2.5",children:l.jsx(vt,{label:"Enable Subtitle Gradient",checked:!!r.subtitleGradient,onChange:m=>i({subtitleGradient:m?{colors:["#6366f1","#ec4899"],direction:90}:null})})}),r.subtitleGradient&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Start",value:r.subtitleGradient.colors[0]??"#6366f1",onChange:m=>i({subtitleGradient:{...r.subtitleGradient,colors:[m,r.subtitleGradient.colors[1]??"#ec4899"]}})}),l.jsx(qe,{label:"End",value:r.subtitleGradient.colors[1]??"#ec4899",onChange:m=>i({subtitleGradient:{...r.subtitleGradient,colors:[r.subtitleGradient.colors[0]??"#6366f1",m]}})}),l.jsx(Z,{label:"Direction",value:r.subtitleGradient.direction,min:0,max:360,formatValue:m=>`${m}°`,onChange:m=>i({subtitleGradient:{...r.subtitleGradient,direction:m}})})]})]})]}):null}function Ol({title:r,onRemove:i,children:a,defaultCollapsed:d=!1}){const[p,h]=C.useState(d),f=C.useRef(null),[y,m]=C.useState(void 0);return C.useEffect(()=>{f.current&&m(f.current.scrollHeight)},[a,p]),l.jsxs("div",{className:"border border-border rounded-md p-2 mb-1.5 text-[11px]",children:[l.jsxs("div",{className:"flex justify-between items-center mb-1.5",children:[l.jsxs("button",{className:"flex items-center gap-1 font-semibold text-text-dim hover:text-text transition-colors cursor-pointer bg-transparent border-none p-0 text-[11px]",onClick:()=>h(!p),"aria-expanded":!p,"aria-label":`${p?"Expand":"Collapse"} ${r}`,children:[l.jsx("span",{className:"inline-block transition-transform duration-150 text-[8px]",style:{transform:p?"rotate(-90deg)":"rotate(0deg)"},"aria-hidden":"true",children:"▼"}),r]}),l.jsx("button",{className:"text-text-dim hover:text-red-400 text-sm leading-none px-1 transition-colors",onClick:i,"aria-label":`Remove ${r}`,title:`Remove ${r}`,children:"×"})]}),l.jsx("div",{ref:f,className:"overflow-hidden transition-all duration-150 ease-in-out",style:{maxHeight:p?0:y??"none",opacity:p?0:1},"aria-hidden":p,children:a})]})}function Op({open:r,title:i,message:a,confirmLabel:d="Delete",cancelLabel:p="Cancel",destructive:h=!0,onConfirm:f,onCancel:y}){const m=C.useRef(null),D=C.useRef(null),w=C.useCallback(L=>{var g;if(L.key==="Escape"&&y(),L.key==="Tab"){const j=(g=m.current)==null?void 0:g.querySelectorAll("button");if(!j||j.length===0)return;const b=j[0],_=j[j.length-1];L.shiftKey&&document.activeElement===b?(L.preventDefault(),_.focus()):!L.shiftKey&&document.activeElement===_&&(L.preventDefault(),b.focus())}},[y]);return C.useEffect(()=>{var L;if(r)return(L=D.current)==null||L.focus(),document.addEventListener("keydown",w),()=>document.removeEventListener("keydown",w)},[r,w]),r?l.jsx("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center bg-black/50",onClick:y,"aria-hidden":"true",children:l.jsxs("div",{ref:m,role:"alertdialog","aria-modal":"true","aria-label":i,"aria-describedby":"confirm-dialog-message",className:"bg-surface border border-border rounded-lg shadow-xl p-5 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95",onClick:L=>L.stopPropagation(),children:[l.jsx("h3",{className:"text-sm font-semibold text-text mb-2",children:i}),l.jsx("p",{id:"confirm-dialog-message",className:"text-xs text-text-dim mb-4 leading-relaxed",children:a}),l.jsxs("div",{className:"flex gap-2 justify-end",children:[l.jsx("button",{ref:D,className:"px-3 py-1.5 text-[11px] font-medium bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-text-dim transition-colors",onClick:y,children:p}),l.jsx("button",{className:`px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${h?"bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30":"bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30"}`,onClick:f,children:d})]})]})}):null}function ui(){const[r,i]=C.useState({open:!1,options:{title:"",message:""},resolve:null}),a=C.useCallback(f=>new Promise(y=>{i({open:!0,options:f,resolve:y})}),[]),d=C.useCallback(()=>{var f;(f=r.resolve)==null||f.call(r,!0),i(y=>({...y,open:!1,resolve:null}))},[r.resolve]),p=C.useCallback(()=>{var f;(f=r.resolve)==null||f.call(r,!1),i(y=>({...y,open:!1,resolve:null}))},[r.resolve]),h=l.jsx(Op,{open:r.open,title:r.options.title,message:r.options.message,confirmLabel:r.options.confirmLabel,destructive:r.options.destructive,onConfirm:d,onCancel:p});return{confirm:a,dialog:h}}function Ha(r){return`${r}-${crypto.randomUUID().slice(0,8)}`}function Fp(){const{screen:r,update:i}=ai(),{confirm:a,dialog:d}=ui();if(!r)return null;const p=(j,b)=>{const _=r.annotations.map((N,I)=>I===j?{...N,...b}:N);i({annotations:_})},h=async j=>{await a({title:"Remove Annotation",message:`Remove Annotation ${j+1}? This cannot be undone.`})&&i({annotations:r.annotations.filter((_,N)=>N!==j)})},f=()=>{i({annotations:[...r.annotations,{id:Ha("ann"),shape:"rounded-rect",x:40,y:40,w:20,h:20,strokeColor:"#FF3B30",strokeWidth:4}]})},y=(j,b)=>{const _=r.callouts.map((N,I)=>I===j?{...N,...b}:N);i({callouts:_})},m=async j=>{await a({title:"Remove Callout",message:`Remove Callout ${j+1}? This cannot be undone.`})&&i({callouts:r.callouts.filter((_,N)=>N!==j)})},D=()=>{i({callouts:[...r.callouts,{id:Ha("callout"),sourceX:30,sourceY:40,sourceW:40,sourceH:20,displayX:60,displayY:10,displayScale:1,rotation:0,borderRadius:8,shadow:!0,borderWidth:0,borderColor:"#ffffff"}]})},w=(j,b)=>{const _=r.overlays.map((N,I)=>I===j?{...N,...b}:N);i({overlays:_})},L=async j=>{await a({title:"Remove Overlay",message:`Remove Overlay ${j+1}? This cannot be undone.`})&&i({overlays:r.overlays.filter((_,N)=>N!==j)})},g=()=>{i({overlays:[...r.overlays,{id:Ha("overlay"),type:"shape",x:10,y:10,size:10,rotation:0,opacity:1,shapeType:"circle",shapeColor:"#6366f1",shapeOpacity:.5,shapeBlur:10}]})};return l.jsxs(l.Fragment,{children:[d,l.jsxs(De,{title:"Spotlight / Dimming",tooltip:"Dim the background and highlight a specific area of your screenshot to draw attention.",defaultCollapsed:!1,children:[!r.spotlight&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Dim the screenshot background and highlight a specific region to guide the viewer's eye."}),l.jsx(vt,{label:"Enable Spotlight",checked:!!r.spotlight,onChange:j=>i({spotlight:j?{x:50,y:50,w:30,h:30,shape:"rectangle",dimOpacity:.6,blur:0}:null})}),r.spotlight&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:r.spotlight.shape,onChange:j=>i({spotlight:{...r.spotlight,shape:j}}),options:[{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(Z,{label:"Position X",value:r.spotlight.x,min:0,max:100,formatValue:j=>`${j}%`,onChange:j=>i({spotlight:{...r.spotlight,x:j}})}),l.jsx(Z,{label:"Position Y",value:r.spotlight.y,min:0,max:100,formatValue:j=>`${j}%`,onChange:j=>i({spotlight:{...r.spotlight,y:j}})}),l.jsx(Z,{label:"Width",value:r.spotlight.w,min:5,max:100,formatValue:j=>`${j}%`,onChange:j=>i({spotlight:{...r.spotlight,w:j}})}),l.jsx(Z,{label:"Height",value:r.spotlight.h,min:5,max:100,formatValue:j=>`${j}%`,onChange:j=>i({spotlight:{...r.spotlight,h:j}})}),l.jsx(Z,{label:"Dim Opacity",value:Math.round(r.spotlight.dimOpacity*100),min:0,max:100,formatValue:j=>`${j}%`,onChange:j=>i({spotlight:{...r.spotlight,dimOpacity:j/100}})}),l.jsx(Z,{label:"Background Blur",value:r.spotlight.blur,min:0,max:30,formatValue:j=>`${j}px`,onChange:j=>i({spotlight:{...r.spotlight,blur:j}})})]})]}),l.jsxs(De,{title:"Annotations",tooltip:"Draw shapes (rectangles, circles) over the screenshot to highlight specific UI elements.",children:[r.annotations.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Highlight areas of your screenshot with rectangles or circles. Great for drawing attention to specific features."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:f,children:"+ Add Annotation"}),r.annotations.map((j,b)=>l.jsxs(Ol,{title:`Annotation ${b+1}`,onRemove:()=>h(b),children:[l.jsx(Ge,{label:"Shape",value:j.shape,onChange:_=>p(b,{shape:_}),options:[{value:"rounded-rect",label:"Rounded Rect"},{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(qe,{label:"Color",value:j.strokeColor,onChange:_=>p(b,{strokeColor:_})}),l.jsx(Z,{label:"X",value:j.x,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>p(b,{x:_})}),l.jsx(Z,{label:"Y",value:j.y,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>p(b,{y:_})}),l.jsx(Z,{label:"Width",value:j.w,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>p(b,{w:_})}),l.jsx(Z,{label:"Height",value:j.h,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>p(b,{h:_})}),l.jsx(Z,{label:"Stroke",value:j.strokeWidth,min:1,max:20,formatValue:_=>`${_}px`,onChange:_=>p(b,{strokeWidth:_})})]},j.id))]}),l.jsxs(De,{title:"Loupe / Magnification",tooltip:"Magnify a region of the screenshot and display it enlarged elsewhere on the frame.",children:[l.jsx(vt,{label:"Loupe",checked:!!r.loupe,onChange:j=>i({loupe:j?{width:.5,height:.33,sourceX:0,sourceY:0,scale:1.1,cornerRadius:0,borderWidth:0,borderColor:"#ffffff",shadow:!0,shadowColor:"#000000",shadowRadius:30,shadowOffsetX:0,shadowOffsetY:0,xOffset:0,yOffset:0}:null})}),(()=>{const j={width:.5,height:.33,sourceX:0,sourceY:0,scale:1.1,cornerRadius:0,borderWidth:0,borderColor:"#ffffff",shadow:!0,shadowColor:"#000000",shadowRadius:30,shadowOffsetX:0,shadowOffsetY:0,xOffset:0,yOffset:0},b=r.loupe??j,_=N=>i({loupe:{...b,...N}});return l.jsxs("div",{className:r.loupe?"":"opacity-40 pointer-events-none",children:[l.jsx(Z,{label:"Width",value:b.width,min:.05,max:1,step:.01,formatValue:N=>N.toFixed(2),onChange:N=>_({width:N})}),l.jsx(Z,{label:"Height",value:b.height,min:.05,max:1,step:.01,formatValue:N=>N.toFixed(2),onChange:N=>_({height:N})}),l.jsx(Z,{label:"Source X",value:b.sourceX,min:-1,max:1,step:.01,formatValue:N=>N.toFixed(2),onChange:N=>_({sourceX:N})}),l.jsx(Z,{label:"Source Y",value:b.sourceY,min:-1,max:1,step:.01,formatValue:N=>N.toFixed(2),onChange:N=>_({sourceY:N})}),l.jsx(Z,{label:"Corner Radius",value:b.cornerRadius??0,min:0,max:100,formatValue:N=>`${N}`,onChange:N=>_({cornerRadius:N})}),l.jsx(vt,{label:"Border",checked:(b.borderWidth??0)>0,onChange:N=>_({borderWidth:N?3:0})}),(b.borderWidth??0)>0&&l.jsxs(l.Fragment,{children:[l.jsx(Z,{label:"Border Width",value:b.borderWidth,min:1,max:10,formatValue:N=>`${N}px`,onChange:N=>_({borderWidth:N})}),l.jsx(qe,{label:"Border Color",value:b.borderColor,onChange:N=>_({borderColor:N})})]}),l.jsx(vt,{label:"Shadow",checked:!!b.shadow,onChange:N=>_({shadow:N})}),b.shadow&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Shadow Color",value:b.shadowColor??"#000000",onChange:N=>_({shadowColor:N})}),l.jsx(Z,{label:"Shadow Radius",value:b.shadowRadius??30,min:0,max:100,formatValue:N=>`${N}`,onChange:N=>_({shadowRadius:N})}),l.jsx(Z,{label:"Shadow X Offset",value:b.shadowOffsetX??0,min:-50,max:50,formatValue:N=>`${N}`,onChange:N=>_({shadowOffsetX:N})}),l.jsx(Z,{label:"Shadow Y Offset",value:b.shadowOffsetY??0,min:-50,max:50,formatValue:N=>`${N}`,onChange:N=>_({shadowOffsetY:N})})]}),l.jsx(Z,{label:"Scale",value:b.scale??1.1,min:1,max:3,step:.01,formatValue:N=>`${N.toFixed(2)}x`,onChange:N=>_({scale:N})}),l.jsx(Z,{label:"X Offset",value:b.xOffset??0,min:-100,max:100,formatValue:N=>`${N}`,onChange:N=>_({xOffset:N})}),l.jsx(Z,{label:"Y Offset",value:b.yOffset??0,min:-100,max:100,formatValue:N=>`${N}`,onChange:N=>_({yOffset:N})})]})})()]}),l.jsxs(De,{title:"Callouts",tooltip:"Crop and enlarge a portion of the screenshot, displayed as a floating callout card.",children:[r.callouts.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Zoom into a specific area and display it as a floating card. Perfect for showcasing small UI details."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:D,children:"+ Add Callout"}),r.callouts.map((j,b)=>l.jsxs(Ol,{title:`Callout ${b+1}`,onRemove:()=>m(b),children:[l.jsx(Z,{label:"Source X",value:j.sourceX,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(b,{sourceX:_})}),l.jsx(Z,{label:"Source Y",value:j.sourceY,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(b,{sourceY:_})}),l.jsx(Z,{label:"Source W",value:j.sourceW,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>y(b,{sourceW:_})}),l.jsx(Z,{label:"Source H",value:j.sourceH,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>y(b,{sourceH:_})}),l.jsx(Z,{label:"Display X",value:j.displayX,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(b,{displayX:_})}),l.jsx(Z,{label:"Display Y",value:j.displayY,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(b,{displayY:_})}),l.jsx(Z,{label:"Scale",value:Math.round(j.displayScale*100),min:50,max:300,step:10,formatValue:_=>`${(_/100).toFixed(1)}x`,onChange:_=>y(b,{displayScale:_/100})}),l.jsx(Z,{label:"Rotation",value:j.rotation,min:-45,max:45,formatValue:_=>`${_}°`,onChange:_=>y(b,{rotation:_})}),l.jsx(Z,{label:"Radius",value:j.borderRadius,min:0,max:30,formatValue:_=>`${_}px`,onChange:_=>y(b,{borderRadius:_})})]},j.id))]}),l.jsxs(De,{title:"Overlays",tooltip:"Add decorative shapes, stars, icons, or badges floating over the screenshot.",children:[r.overlays.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Add floating shapes, star ratings, icons, or badges over your screenshot for extra visual appeal."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:g,children:"+ Add Overlay"}),r.overlays.map((j,b)=>l.jsxs(Ol,{title:`Overlay ${b+1}`,onRemove:()=>L(b),children:[l.jsx(Ge,{label:"Type",value:j.type,onChange:_=>w(b,{type:_}),options:[{value:"shape",label:"Shape"},{value:"star-rating",label:"Star Rating"},{value:"icon",label:"Icon"},{value:"badge",label:"Badge"},{value:"custom",label:"Custom"}]}),l.jsx(Z,{label:"X",value:j.x,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>w(b,{x:_})}),l.jsx(Z,{label:"Y",value:j.y,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>w(b,{y:_})}),l.jsx(Z,{label:"Size",value:j.size,min:1,max:50,formatValue:_=>`${_}%`,onChange:_=>w(b,{size:_})}),l.jsx(Z,{label:"Rotation",value:j.rotation,min:-180,max:180,formatValue:_=>`${_}°`,onChange:_=>w(b,{rotation:_})}),l.jsx(Z,{label:"Opacity",value:Math.round(j.opacity*100),min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>w(b,{opacity:_/100})}),j.type==="shape"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:j.shapeType??"circle",onChange:_=>w(b,{shapeType:_}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"}]}),l.jsx(qe,{label:"Color",value:j.shapeColor??"#6366f1",onChange:_=>w(b,{shapeColor:_})}),l.jsx(Z,{label:"Shape Opacity",value:Math.round((j.shapeOpacity??.5)*100),min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>w(b,{shapeOpacity:_/100})}),l.jsx(Z,{label:"Blur",value:j.shapeBlur??0,min:0,max:50,formatValue:_=>`${_}px`,onChange:_=>w(b,{shapeBlur:_})})]})]},j.id))]})]})}function Dp({message:r,onDone:i}){return C.useEffect(()=>{const a=setTimeout(i,3e3);return()=>clearTimeout(a)},[i]),l.jsx("div",{role:"alert","aria-live":"polite",className:"fixed top-4 right-4 z-50 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-in fade-in",children:r})}function Gs(r,i){const a=URL.createObjectURL(r),d=document.createElement("a");d.href=a,d.download=i,document.body.appendChild(d),d.click(),document.body.removeChild(d),URL.revokeObjectURL(a)}function Bd(){const r=J(W=>W.platform),i=J(W=>W.sizes),a=J(W=>W.exportSize),d=J(W=>W.setExportSize),p=J(W=>W.exportRenderer),h=J(W=>W.setExportRenderer),f=J(W=>W.koubouAvailable),y=J(W=>W.locale),m=J(W=>W.setLocale),D=J(W=>W.previewBg),w=J(W=>W.setPreviewBg),L=J(W=>W.config),g=J(W=>W.initScreens),j=J(W=>W.triggerRender),b=J(W=>W.selectedScreen),_=J(W=>W.screens),N=J(W=>W.isPanoramic),I=J(W=>W.panoramicFrameCount),V=J(W=>W.panoramicBackground),ee=J(W=>W.panoramicElements),ie=J(W=>W.panoramicEffects),le=J(W=>W.previewW),re=J(W=>W.previewH),[M,x]=C.useState(!1),[K,ue]=C.useState("Ready"),[q,me]=C.useState(null),ze=C.useCallback(()=>me(null),[]),We=(i[r]??[]).map(W=>({value:W.key,label:`${W.name} (${W.width}×${W.height})`})),F=!f||r==="android",U=[{value:"playwright",label:"Playwright (fast)"},{value:"koubou",label:"Koubou (pixel-perfect)",disabled:F,title:F?f?"Koubou is not available for Android":"Koubou server not running":void 0}],$=[{value:"default",label:"Default"}];if(L!=null&&L.locales)for(const W of Object.keys(L.locales))$.push({value:W,label:W});const H=W=>({frameCount:I,frameWidth:le,frameHeight:re,background:V,elements:ee,effects:ie,font:L==null?void 0:L.theme.font,fontWeight:L==null?void 0:L.theme.fontWeight,frameStyle:L==null?void 0:L.frames.style,sizeKey:a,frameIndex:W}),X=async()=>{x(!0);let W=0;for(let ve=0;ve<I;ve++){ue(`Exporting frame ${ve+1} of ${I}...`);try{const ke=await Md(H(ve));Gs(ke,`frame-${ve+1}.png`),W++}catch(ke){ue(`Error on frame ${ve+1}: ${ke instanceof Error?ke.message:"Unknown"}`)}}x(!1),ue(`Exported ${W} of ${I} frames`),me(`Exported ${W} frames`)},R=async()=>{x(!0),ue("Exporting full panoramic canvas...");try{const W=await Md(H());Gs(W,"panoramic-full.png");const ve=Math.round(W.size/1024);ue(`Exported panoramic (${ve}KB)`),me(`Panoramic canvas exported (${ve}KB)`)}catch(W){ue(`Export error: ${W instanceof Error?W.message:"Unknown error"}`)}finally{x(!1)}},A=async()=>{const W=_[b];if(W){x(!0),ue(p==="koubou"?`Rendering screen ${b+1} with Koubou...`:`Exporting screen ${b+1}...`);try{const ve=await $d({screenIndex:W.screenIndex,sizeKey:a,renderer:p,headline:W.headline,subtitle:W.subtitle||void 0,style:W.style,layout:W.layout,colors:W.colors,font:W.font,fontWeight:W.fontWeight,frameId:W.frameId,frameStyle:W.frameStyle,deviceColor:W.deviceColor||void 0,deviceScale:W.deviceScale,deviceTop:W.deviceTop,screenshotDataUrl:W.screenshotDataUrl||void 0});Gs(ve,`screenshot-${b+1}.png`);const ke=Math.round(ve.size/1024);ue(`Exported (${ke}KB)`),me(`Screen ${b+1} exported (${ke}KB)`)}catch(ve){ue(`Export error: ${ve instanceof Error?ve.message:"Unknown error"}`)}finally{x(!1)}}},ce=async()=>{if(_.length===0)return;x(!0);let W=0;for(let ve=0;ve<_.length;ve++){const ke=_[ve];if(ke){ue(`Exporting screen ${ve+1} of ${_.length}...`);try{const Le=await $d({screenIndex:ke.screenIndex,sizeKey:a,renderer:p,headline:ke.headline,subtitle:ke.subtitle||void 0,style:ke.style,layout:ke.layout,colors:ke.colors,font:ke.font,fontWeight:ke.fontWeight,frameId:ke.frameId,frameStyle:ke.frameStyle,deviceColor:ke.deviceColor||void 0,deviceScale:ke.deviceScale,deviceTop:ke.deviceTop,screenshotDataUrl:ke.screenshotDataUrl||void 0});Gs(Le,`screenshot-${ve+1}.png`),W++}catch(Le){ue(`Error on screen ${ve+1}: ${Le instanceof Error?Le.message:"Unknown"}`)}}}x(!1),ue(`Exported ${W} of ${_.length} screens`),me(`Exported ${W} screenshots`)},we=async()=>{try{const W=await ip();g(W,r),j(),ue("Config reloaded")}catch(W){ue(`Reload error: ${W instanceof Error?W.message:"Unknown error"}`)}};return!N&&_.length===0?l.jsx(De,{title:"Export",tooltip:"Choose output size and renderer, then download your screenshots.",defaultCollapsed:!1,children:l.jsxs("p",{className:"text-xs text-text-dim text-center py-4",children:["No screens to export."," ",l.jsx("button",{className:"text-accent hover:text-accent-hover underline",onClick:()=>J.getState().setActiveTab("design"),children:"Go to Background tab"})," ","to get started."]})}):l.jsxs(l.Fragment,{children:[q&&l.jsx(Dp,{message:q,onDone:ze}),l.jsxs(De,{title:"Export",tooltip:"Choose output size and renderer, then download your screenshots.",defaultCollapsed:!1,children:[l.jsx(Ge,{label:"Output Size",value:a,onChange:d,options:We}),!N&&f&&l.jsx(Ge,{label:"Renderer",value:p,onChange:h,options:U}),N?l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1",onClick:X,disabled:M,children:M?"Exporting...":`Export All ${I} Frames`}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text disabled:opacity-50 mt-1",onClick:R,disabled:M,children:M?"Exporting...":"Export Full Canvas"})]}):l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1",onClick:A,disabled:M,children:M?"Exporting...":"Download Screenshot"}),_.length>1&&l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text disabled:opacity-50 mt-1",onClick:ce,disabled:M,children:M?"Exporting...":`Export All ${_.length} Screens`})]})]}),!N&&l.jsx(De,{title:"Locale",tooltip:"Select a locale to export localized screenshots. Configure locales in your YAML config file.",children:l.jsx(Ge,{label:"Language",value:y,onChange:m,options:$})}),l.jsx(De,{title:"Preview Background",tooltip:"Change the editor background color. This does not affect exported images.",children:l.jsx("div",{className:"flex gap-3",children:["dark","light"].map(W=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:D===W,onChange:()=>w(W),className:"accent-accent"}),W.charAt(0).toUpperCase()+W.slice(1)]},W))})}),l.jsxs(De,{title:"Actions",tooltip:"Refresh previews or reload the YAML configuration file from disk.",children:[l.jsxs("div",{className:"flex gap-2",children:[l.jsx("button",{className:"flex-1 py-2 text-xs bg-accent hover:bg-accent-hover text-white rounded-md",onClick:j,children:"Refresh All"}),l.jsx("button",{className:"flex-1 py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:we,children:"Reload Config"})]}),l.jsx("div",{className:`text-[10px] mt-2 ${K.startsWith("Export error")||K.startsWith("Reload error")||K.startsWith("Error")?"text-red-400":K.startsWith("Exported")||K==="Config reloaded"?"text-green-400":"text-text-dim"}`,children:K})]})]})}let df=null;function Wd(r){df=r}function Ap(){return df}function ff(){const r=J(y=>y.previewW),i=J(y=>y.previewH),a=J(y=>y.panoramicFrameCount),d=C.useCallback(()=>{try{const y=Ap();return(y==null?void 0:y.contentDocument)??null}catch{return null}},[]),p=r*a,h=C.useCallback(y=>{const m=d();if(!m)return;const D=m.querySelector(".panoramic-canvas");if(D){if(y.type==="solid"&&y.color)D.style.background=y.color;else if(y.type==="gradient"&&y.colors){const w=y.colors.join(", ");y.gradientType==="radial"?D.style.background=`radial-gradient(circle at ${y.radialPosition??"center"}, ${w})`:D.style.background=`linear-gradient(${y.direction??135}deg, ${w})`}}},[d]),f=C.useCallback((y,m)=>{const D=d();if(!D)return;const w=D.querySelector(`[data-index="${y}"]`);w&&(m.x!==void 0&&(w.style.left=`${m.x/100*p}px`),m.y!==void 0&&(w.style.top=`${m.y/100*i}px`),m.width!==void 0&&(w.style.width=`${m.width/100*p}px`),m.height!==void 0&&(w.style.height=`${m.height/100*i}px`),m.rotation!==void 0&&(w.style.transform=`rotate(${m.rotation}deg)`),m.opacity!==void 0&&(w.style.opacity=String(m.opacity)),m.color!==void 0&&(w.classList.contains("pano-decoration")?w.style.background=m.color:w.style.color=m.color),m.fontSize!==void 0&&(w.style.fontSize=`${m.fontSize/100*i}px`),m.fontWeight!==void 0&&(w.style.fontWeight=String(m.fontWeight)))},[d,p,i]);return{patchBackground:h,patchElement:f}}const tu={device:"Device",text:"Text",label:"Label",decoration:"Decoration"},Bp={iphone:["iphone"],android:["iphone"],ipad:["ipad"],mac:["mac"],watch:["watch"]},Wp={iphone:["default-ios","default-android"],android:["default-ios","default-android"],ipad:["default-ipad","fallback-tablet"],mac:[],watch:[]};function Yp(r,i,a){const d=a?Bp[a]??["iphone"]:null,p=a?Wp[a]??[]:null,h={};for(const m of r){const D=m.category||"other";if(d&&!d.includes(D))continue;const w=h[D]??[];w.push({value:m.id,label:m.name}),h[D]=w}const f=Object.entries(h).map(([m,D])=>({label:m.charAt(0).toUpperCase()+m.slice(1),options:D})),y=[];for(const m of i){if(p&&p.length>0){if(!(m.tags??[]).some(w=>p.includes(w)))continue}else if(p&&p.length===0)continue;y.push({value:m.id,label:m.name})}return y.length>0&&f.push({label:"SVG Frames",options:y}),f}function Hp(r,i){return r.map((d,p)=>({z:d.z,i:p})).sort((d,p)=>d.z-p.z).findIndex(d=>d.i===i)}function Up({index:r}){const i=J(x=>x.panoramicElements[r]),a=J(x=>x.panoramicElements),d=J(x=>x.updatePanoramicElement),p=J(x=>x.removePanoramicElement),h=J(x=>x.config),f=J(x=>x.deviceFamilies),y=J(x=>x.frames),m=J(x=>x.fonts),D=C.useRef(null),{confirm:w,dialog:L}=ui(),{patchElement:g}=ff(),j=C.useMemo(()=>Hp(a,r),[a,r]),b=C.useCallback(x=>{d(r,x)},[r,d]),_=C.useCallback(x=>{g(j,x)},[g,j]);if(!i)return null;const N=J(x=>x.platform),I=Yp(f,y,N),V=(h==null?void 0:h.frames.ios)??"",ee=i.type==="device"?i.frame??V:"",ie=f.find(x=>x.id===ee),le=ie&&ie.colors.length>1,re=C.useMemo(()=>cf(m),[m]),M=x=>{var q;const K=(q=x.target.files)==null?void 0:q[0];if(!K)return;const ue=new FileReader;ue.onload=me=>{var ze;b({screenshot:(ze=me.target)==null?void 0:ze.result})},ue.readAsDataURL(K),x.target.value=""};return l.jsxs("div",{children:[L,l.jsxs("div",{className:"px-5 py-3 border-b border-border flex items-center justify-between",children:[l.jsxs("span",{className:"text-xs font-medium",children:[tu[i.type]," #",a.slice(0,r).filter(x=>x.type===i.type).length+1]}),l.jsx("button",{className:"text-[10px] text-red-400 hover:text-red-300",onClick:async()=>{const x=a.slice(0,r).filter(ue=>ue.type===i.type).length+1;await w({title:"Remove Element",message:`Remove ${tu[i.type]} #${x}? This cannot be undone.`})&&p(r)},children:"Remove"})]}),l.jsxs(De,{title:"Position",defaultCollapsed:!1,children:[l.jsx(Z,{label:"X %",value:i.x,min:-50,max:150,step:.5,formatValue:x=>`${x}%`,onChange:x=>b({x}),onInstant:x=>_({x})}),l.jsx(Z,{label:"Y %",value:i.y,min:-50,max:150,step:.5,formatValue:x=>`${x}%`,onChange:x=>b({y:x}),onInstant:x=>_({y:x})}),l.jsx(Z,{label:"Z-Index",value:i.z,min:0,max:100,onChange:x=>b({z:x})})]}),i.type==="device"&&(()=>{const x=(i.frameStyle??"flat")==="none",K=ie&&ie.screenRect,ue=i.fullscreenScreenshot??!1;return l.jsxs(l.Fragment,{children:[l.jsxs(De,{title:"Screenshot",children:[i.screenshot.startsWith("data:")?l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:i.screenshot,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:"Custom upload"})]}):l.jsx("div",{className:"text-xs text-text-dim mb-2 truncate",children:i.screenshot}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var q;return(q=D.current)==null?void 0:q.click()},children:"Upload Screenshot"}),l.jsx("input",{ref:D,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload screenshot image",onChange:M}),i.screenshot.startsWith("data:")&&l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>{var q;return b({screenshot:((q=h==null?void 0:h.screens[0])==null?void 0:q.screenshot)??"screenshots/screen-1.png"})},children:"Revert to File"})]}),l.jsxs(De,{title:"Device Frame",children:[l.jsx(Ge,{label:"Frame",value:ee,onChange:q=>{const me=f.find(Ae=>Ae.id===q),ze=me&&me.screenRect;b(ze&&x?{frame:q,frameStyle:"flat"}:{frame:q})},groups:I}),le&&l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),l.jsx("div",{className:"flex flex-wrap gap-1",children:ie.colors.map(q=>l.jsx("button",{className:`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent ${i.deviceColor===q.name?"border-accent ring-1 ring-accent":"border-border"}`,style:{background:uf[q.name]??"#888888"},title:q.name,"aria-label":`${q.name} color variant`,"aria-pressed":i.deviceColor===q.name,onClick:()=>b({deviceColor:q.name})},q.name))})]}),l.jsx(Ge,{label:"Frame Style",value:i.frameStyle??"flat",onChange:q=>b({frameStyle:q}),options:[{value:"flat",label:"Flat"},{value:"none",label:"None (frameless)"}],hidden:!!K}),x&&l.jsxs(l.Fragment,{children:[l.jsx(vt,{label:"Border Simulation",checked:!!i.borderSimulation,onChange:q=>b({borderSimulation:q?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:void 0})}),i.borderSimulation&&(()=>{const q=i.borderSimulation;return l.jsxs(l.Fragment,{children:[l.jsx(Z,{label:"Thickness",value:q.thickness,min:1,max:20,formatValue:me=>`${me}px`,onChange:me=>b({borderSimulation:{...q,thickness:me}})}),l.jsx(qe,{label:"Color",value:q.color,onChange:me=>b({borderSimulation:{...q,color:me}})}),l.jsx(Z,{label:"Radius",value:q.radius,min:0,max:60,formatValue:me=>`${me}px`,onChange:me=>b({borderSimulation:{...q,radius:me}})})]})})()]})]}),l.jsxs(De,{title:"Device Layout",tooltip:"Control device scale, position, and fullscreen mode.",children:[l.jsx(vt,{label:"Fullscreen Screenshot",checked:ue,onChange:q=>b({fullscreenScreenshot:q})}),!ue&&l.jsxs(l.Fragment,{children:[l.jsx(Z,{label:"Device Size",value:i.width,min:5,max:60,step:.5,formatValue:q=>`${q}%`,onChange:q=>b({width:q}),onInstant:q=>_({width:q})}),l.jsx(Z,{label:"Device Rotation",value:i.rotation,min:-180,max:180,formatValue:q=>`${q}°`,onChange:q=>b({rotation:q}),onInstant:q=>_({rotation:q})}),l.jsx(Z,{label:"3D Tilt",value:i.deviceTilt??0,min:0,max:40,formatValue:q=>`${q}°`,onChange:q=>b({deviceTilt:q})}),x&&l.jsx(Z,{label:"Corner Radius",value:i.cornerRadius??0,min:0,max:50,formatValue:q=>`${q}%`,onChange:q=>b({cornerRadius:q})})]})]}),l.jsxs(De,{title:"Device Shadow",tooltip:"Add a custom shadow beneath the device frame.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Custom Shadow",checked:!!i.shadow,onChange:q=>b({shadow:q?{opacity:.25,blur:20,color:"#000000",offsetY:10}:void 0})}),i.shadow&&l.jsxs(l.Fragment,{children:[l.jsx(Z,{label:"Opacity",value:Math.round(i.shadow.opacity*100),min:0,max:100,formatValue:q=>`${q}%`,onChange:q=>b({shadow:{...i.shadow,opacity:q/100}})}),l.jsx(Z,{label:"Blur",value:i.shadow.blur,min:0,max:50,formatValue:q=>`${q}px`,onChange:q=>b({shadow:{...i.shadow,blur:q}})}),l.jsx(qe,{label:"Color",value:i.shadow.color,onChange:q=>b({shadow:{...i.shadow,color:q}})}),l.jsx(Z,{label:"Y Offset",value:i.shadow.offsetY,min:0,max:30,formatValue:q=>`${q}px`,onChange:q=>b({shadow:{...i.shadow,offsetY:q}})})]})]})]})})(),i.type==="text"&&l.jsxs(l.Fragment,{children:[l.jsxs(De,{title:"Content",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Headline"}),l.jsx("textarea",{rows:3,value:i.content,onChange:x=>b({content:x.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),l.jsx(qe,{label:"Color",value:i.color,onChange:x=>b({color:x})})]}),l.jsxs(De,{title:"Typography",tooltip:"Control font family, weight, size, and styling for this element.",children:[l.jsx(Ge,{label:"Font",value:i.font??(h==null?void 0:h.theme.font)??"inter",onChange:x=>b({font:x}),groups:re}),l.jsx(Z,{label:"Font Size",value:i.fontSize,min:.5,max:20,step:.1,formatValue:x=>`${x}%`,onChange:x=>b({fontSize:x}),onInstant:x=>_({fontSize:x})}),l.jsx(Z,{label:"Font Weight",value:i.fontWeight,min:100,max:900,step:100,formatValue:x=>String(x),onChange:x=>b({fontWeight:x}),onInstant:x=>_({fontWeight:x})}),l.jsx(Ge,{label:"Alignment",value:i.textAlign,onChange:x=>b({textAlign:x}),options:[{value:"left",label:"Left"},{value:"center",label:"Center"},{value:"right",label:"Right"}]}),l.jsx(Z,{label:"Line Height",value:i.lineHeight,min:.8,max:2,step:.05,formatValue:x=>x.toFixed(2),onChange:x=>b({lineHeight:x})}),l.jsxs("div",{className:"flex gap-2 mb-2",children:[l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Case",value:i.textTransform??"",onChange:x=>b({textTransform:x}),options:[{value:"",label:"Auto"},{value:"none",label:"None"},{value:"uppercase",label:"Uppercase"},{value:"lowercase",label:"Lowercase"},{value:"capitalize",label:"Capitalize"}]})}),l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Style",value:i.fontStyle,onChange:x=>b({fontStyle:x}),options:[{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}]})})]}),l.jsx(Z,{label:"Letter Spacing",value:i.letterSpacing??0,min:-5,max:10,formatValue:x=>x===0?"Auto":`${x/100}em`,onChange:x=>b({letterSpacing:x})}),l.jsx(Z,{label:"Rotation",value:i.rotation??0,min:-30,max:30,formatValue:x=>`${x}°`,onChange:x=>b({rotation:x})})]}),l.jsxs(De,{title:"Text Gradient",tooltip:"Apply a gradient color effect to the text.",defaultCollapsed:!0,children:[l.jsx(vt,{label:"Enable Gradient",checked:!!i.gradient,onChange:x=>b({gradient:x?{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"}:void 0})}),i.gradient&&(()=>{const x=i.gradient;return l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:su.map(K=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${K.direction}deg, ${K.colors.join(", ")})`},title:K.name,"aria-label":`Apply ${K.name} gradient`,onClick:()=>b({gradient:{type:"linear",colors:[...K.colors],direction:K.direction,radialPosition:"center"}})},K.name))}),l.jsx(Z,{label:"Direction",value:x.direction,min:0,max:360,formatValue:K=>`${K}°`,onChange:K=>b({gradient:{...x,direction:K}})}),x.colors.map((K,ue)=>l.jsx(qe,{label:`Stop ${ue+1}`,value:K,onChange:q=>{const me=[...x.colors];me[ue]=q,b({gradient:{...x,colors:me}})}},ue))]})})()]}),l.jsxs(De,{title:"Layout",children:[l.jsx(vt,{label:"Limit width",checked:i.maxWidth!==void 0,onChange:x=>b({maxWidth:x?25:void 0})}),i.maxWidth!==void 0&&l.jsx(Z,{label:"Max Width %",value:i.maxWidth,min:5,max:100,step:.5,formatValue:x=>`${x}%`,onChange:x=>b({maxWidth:x})})]})]}),i.type==="label"&&l.jsxs(De,{title:"Label",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Content"}),l.jsx("input",{type:"text",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] outline-none focus:border-accent",value:i.content,onChange:x=>b({content:x.target.value})})]}),l.jsx(Z,{label:"Font Size",value:i.fontSize,min:.5,max:10,step:.1,formatValue:x=>`${x}%`,onChange:x=>b({fontSize:x}),onInstant:x=>_({fontSize:x})}),l.jsx(qe,{label:"Text Color",value:i.color,onChange:x=>b({color:x})}),l.jsx(qe,{label:"Background",value:i.backgroundColor??"#00000033",onChange:x=>b({backgroundColor:x})}),l.jsx(Z,{label:"Padding",value:i.padding,min:0,max:5,step:.1,formatValue:x=>`${x}%`,onChange:x=>b({padding:x})}),l.jsx(Z,{label:"Border Radius",value:i.borderRadius,min:0,max:30,formatValue:x=>`${x}px`,onChange:x=>b({borderRadius:x})})]}),i.type==="decoration"&&l.jsxs(De,{title:"Decoration",children:[l.jsx(Ge,{label:"Shape",value:i.shape,onChange:x=>b({shape:x}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"},{value:"dot-grid",label:"Dot Grid"}]}),l.jsx(Z,{label:"Width",value:i.width,min:.5,max:100,step:.5,formatValue:x=>`${x}%`,onChange:x=>b({width:x}),onInstant:x=>_({width:x})}),i.height!==void 0&&l.jsx(Z,{label:"Height",value:i.height,min:.5,max:100,step:.5,formatValue:x=>`${x}%`,onChange:x=>b({height:x}),onInstant:x=>_({height:x})}),l.jsx(Z,{label:"Opacity",value:i.opacity,min:0,max:1,step:.05,formatValue:x=>`${Math.round(x*100)}%`,onChange:x=>b({opacity:x}),onInstant:x=>_({opacity:x})}),l.jsx(Z,{label:"Rotation",value:i.rotation,min:-180,max:180,formatValue:x=>`${x}°`,onChange:x=>b({rotation:x}),onInstant:x=>_({rotation:x})}),l.jsx(qe,{label:"Color",value:i.color,onChange:x=>b({color:x})})]})]})}function Vp({imageDataUrl:r,onUpload:i,onRemove:a}){const d=C.useRef(null),p=h=>{var m;const f=(m=h.target.files)==null?void 0:m[0];if(!f)return;const y=new FileReader;y.onload=D=>{var w;return i((w=D.target)==null?void 0:w.result)},y.readAsDataURL(f),h.target.value=""};return l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var h;return(h=d.current)==null?void 0:h.click()},children:"Upload Background Image"}),l.jsx("input",{ref:d,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload background image",onChange:p}),r&&l.jsxs("div",{className:"mt-1.5",children:[l.jsx("img",{src:r,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:a,children:"Remove"})]})]})}function Xp(){const r=C.useRef(null),i=J(f=>f.panoramicElements),a=J(f=>f.updatePanoramicElement),d=J(f=>f.addPanoramicElement),p=i.map((f,y)=>({el:f,i:y})).filter(({el:f})=>f.type==="device"),h=f=>{const y=Array.from(f.target.files??[]);y.length!==0&&(y.forEach((m,D)=>{const w=new FileReader;w.onload=L=>{var j;const g=(j=L.target)==null?void 0:j.result;if(D<p.length)a(p[D].i,{screenshot:g});else{const b=p.length+(D-p.length);d({type:"device",screenshot:g,x:10+b*20,y:15,width:12,rotation:0,z:5})}},w.readAsDataURL(m)}),f.target.value="")};return l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var f;return(f=r.current)==null?void 0:f.click()},children:"Upload Screenshots"}),l.jsx("input",{ref:r,type:"file",accept:"image/png,image/jpeg,image/webp",multiple:!0,className:"hidden","aria-label":"Upload device screenshots",onChange:h}),p.length>0&&l.jsx("div",{className:"mt-2 space-y-1",children:p.map(({el:f,i:y})=>l.jsxs("div",{className:"flex items-center gap-2 text-[11px] text-text-dim",children:[l.jsx("span",{className:"w-4 text-center",children:p.indexOf(p.find(m=>m.i===y))+1}),f.screenshot.startsWith("data:")?l.jsx("img",{src:f.screenshot,alt:"",className:"w-6 h-6 rounded object-cover border border-border"}):l.jsx("span",{className:"truncate flex-1",children:f.screenshot})]},y))}),l.jsx("p",{className:"text-[10px] text-text-dim mt-1.5",children:"Select multiple files to assign to device elements in order."})]})}const Qp=[{value:"iphone",label:"iPhone"},{value:"ipad",label:"iPad"},{value:"mac",label:"Mac"},{value:"watch",label:"Apple Watch"},{value:"android",label:"Android"}];function Gp(){const r=J(M=>M.panoramicFrameCount),i=J(M=>M.panoramicElements),a=J(M=>M.selectedElementIndex),d=J(M=>M.setSelectedElement),p=J(M=>M.addPanoramicElement),h=J(M=>M.setPanoramicFrameCount),f=J(M=>M.panoramicBackground),y=J(M=>M.updatePanoramicBackground),m=J(M=>M.config),D=J(M=>M.platform),w=J(M=>M.setPlatform),L=J(M=>M.setPreviewSize),{patchBackground:g}=ff(),j=C.useCallback(M=>{w(M);const x=Fl[M];x&&L(x.w,x.h)},[w,L]),b=C.useCallback(M=>g({type:"solid",color:M}),[g]),_=C.useCallback(M=>{const x=f.gradient??{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"};g({type:"gradient",gradientType:x.type,colors:(M==null?void 0:M.colors)??x.colors,direction:(M==null?void 0:M.direction)??x.direction,radialPosition:x.radialPosition})},[f.gradient,g]),N=()=>{var K,ue;const M=i.filter(q=>q.type==="device").length,x=((K=m==null?void 0:m.screens[M])==null?void 0:K.screenshot)??((ue=m==null?void 0:m.screens[0])==null?void 0:ue.screenshot)??"screenshots/screen-1.png";p({type:"device",screenshot:x,x:10+M*20,y:15,width:12,rotation:0,z:5})},I=()=>{const M=i.filter(x=>x.type==="text").length;p({type:"text",content:"New headline",x:5+M*20,y:5,fontSize:3.5,color:"#FFFFFF",fontWeight:700,fontStyle:"normal",textAlign:"left",lineHeight:1.15,maxWidth:25,z:10})},V=()=>{p({type:"label",content:"New Label",x:50,y:50,fontSize:1.5,color:"#FFFFFF",backgroundColor:"#00000044",padding:.5,borderRadius:8,z:15})},ee=()=>{p({type:"decoration",shape:"circle",x:50,y:50,width:5,height:8,color:(m==null?void 0:m.theme.colors.primary)??"#6366F1",opacity:.15,rotation:0,z:0})},ie=f.type,le=f.color??"#000000",re=f.gradient??{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"};return l.jsxs("div",{children:[l.jsxs(De,{title:"Canvas",defaultCollapsed:!1,children:[l.jsx(Ge,{label:"Platform",value:D,onChange:j,options:Qp}),l.jsx(Z,{label:"Frame Count",value:r,min:2,max:10,onChange:h})]}),l.jsxs(De,{title:"Background",children:[l.jsx("div",{className:"flex gap-3 mb-2.5",children:["solid","gradient","image","preset"].map(M=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"pano-bg-type",value:M,checked:ie===M,onChange:()=>y({type:M}),className:"accent-accent"}),M.charAt(0).toUpperCase()+M.slice(1)]},M))}),ie==="preset"&&l.jsx(Ge,{label:"Style Preset",value:f.preset??"",onChange:M=>y({preset:M}),options:[{value:"",label:"Select a preset..."},{value:"minimal",label:"Minimal"},{value:"bold",label:"Bold"},{value:"glow",label:"Glow"},{value:"playful",label:"Playful"},{value:"clean",label:"Clean"},{value:"branded",label:"Branded"},{value:"editorial",label:"Editorial"}]}),ie==="solid"&&l.jsx(qe,{label:"Color",value:le,onChange:M=>y({color:M}),onInstant:b,presets:af}),ie==="gradient"&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:su.map(M=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${M.direction}deg, ${M.colors.join(", ")})`},title:M.name,"aria-label":`Apply ${M.name} gradient`,onClick:()=>y({gradient:{type:"linear",colors:[...M.colors],direction:M.direction,radialPosition:"center"}})},M.name))}),l.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(M=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:re.type===M,onChange:()=>y({gradient:{...re,type:M}}),className:"accent-accent"}),M.charAt(0).toUpperCase()+M.slice(1)]},M))}),re.type==="linear"&&l.jsx(Z,{label:"Direction",value:re.direction,min:0,max:360,formatValue:M=>`${M}°`,onChange:M=>y({gradient:{...re,direction:M}}),onInstant:M=>_({direction:M})}),re.type==="radial"&&l.jsx(Ge,{label:"Center",value:re.radialPosition??"center",onChange:M=>y({gradient:{...re,radialPosition:M}}),options:[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}]}),re.colors.map((M,x)=>l.jsx(qe,{label:`Stop ${x+1}`,value:M,onChange:K=>{const ue=[...re.colors];ue[x]=K,y({gradient:{...re,colors:ue}})}},x)),re.colors.length<5&&l.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{const M=[...re.colors,"#ffffff"];y({gradient:{...re,colors:M}})},children:"+ Add Color Stop"})]}),ie==="image"&&l.jsxs(l.Fragment,{children:[l.jsx(Vp,{imageDataUrl:f.image,onUpload:M=>y({image:M}),onRemove:()=>y({image:void 0})}),l.jsxs("div",{className:"mt-2",children:[l.jsx(vt,{label:"Dim Overlay",checked:!!f.overlay,onChange:M=>y({overlay:M?{color:"#000000",opacity:.3}:void 0})}),f.overlay&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Color",value:f.overlay.color,onChange:M=>y({overlay:{...f.overlay,color:M}})}),l.jsx(Z,{label:"Opacity",value:Math.round(f.overlay.opacity*100),min:0,max:100,formatValue:M=>`${M}%`,onChange:M=>y({overlay:{...f.overlay,opacity:M/100}})})]})]})]})]}),l.jsx(De,{title:"Screenshots",children:l.jsx(Xp,{})}),l.jsxs(De,{title:`Elements (${i.length})`,children:[l.jsxs("div",{className:"grid grid-cols-4 gap-1 mb-3",children:[l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:N,children:"+ Device"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:I,children:"+ Text"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:V,children:"+ Label"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:ee,children:"+ Decoration"})]}),i.length===0&&l.jsx("p",{className:"text-xs text-text-dim text-center py-4",children:"Add devices, text, or decorations to build your panoramic layout."}),l.jsx("div",{className:"space-y-1",children:i.map((M,x)=>{const K=i.slice(0,x).filter(ue=>ue.type===M.type).length+1;return l.jsxs("button",{className:`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${x===a?"bg-accent/15 text-accent border border-accent/30":"bg-surface-2 border border-border hover:border-accent/30"}`,onClick:()=>d(x===a?null:x),children:[l.jsxs("span",{className:"font-medium",children:[tu[M.type]," #",K]}),l.jsxs("span",{className:"text-text-dim ml-1",children:["(",Math.round(M.x),"%, ",Math.round(M.y),"%)"]}),M.type==="text"&&l.jsxs("span",{className:"text-text-dim ml-1 truncate",title:M.content,children:["— ",M.content.slice(0,20)]}),M.type==="label"&&l.jsxs("span",{className:"text-text-dim ml-1 truncate",title:M.content,children:["— ",M.content.slice(0,20)]})]},x)})})]}),a!==null&&l.jsx(Up,{index:a}),l.jsx("div",{className:"px-5 py-3 text-[10px] text-text-dim",children:"Spotlight, annotations, and overlays are available in the Effects tab."})]})}function Yd(r){return`${r}-${crypto.randomUUID().slice(0,8)}`}function Kp(){const r=J(w=>w.panoramicEffects),i=J(w=>w.updatePanoramicEffects),{confirm:a,dialog:d}=ui(),p=(w,L)=>{const g=r.annotations.map((j,b)=>b===w?{...j,...L}:j);i({annotations:g})},h=async w=>{await a({title:"Remove Annotation",message:`Remove Annotation ${w+1}? This cannot be undone.`})&&i({annotations:r.annotations.filter((g,j)=>j!==w)})},f=()=>{i({annotations:[...r.annotations,{id:Yd("ann"),shape:"rounded-rect",x:40,y:40,w:20,h:20,strokeColor:"#FF3B30",strokeWidth:4}]})},y=(w,L)=>{const g=r.overlays.map((j,b)=>b===w?{...j,...L}:j);i({overlays:g})},m=async w=>{await a({title:"Remove Overlay",message:`Remove Overlay ${w+1}? This cannot be undone.`})&&i({overlays:r.overlays.filter((g,j)=>j!==w)})},D=()=>{i({overlays:[...r.overlays,{id:Yd("overlay"),type:"shape",x:10,y:10,size:10,rotation:0,opacity:1,shapeType:"circle",shapeColor:"#6366f1",shapeOpacity:.5,shapeBlur:10}]})};return l.jsxs(l.Fragment,{children:[d,l.jsxs(De,{title:"Spotlight / Dimming",tooltip:"Dim the panoramic canvas and highlight a specific area to draw attention.",defaultCollapsed:!1,children:[!r.spotlight&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Dim the canvas background and highlight a specific region to guide the viewer's eye."}),l.jsx(vt,{label:"Enable Spotlight",checked:!!r.spotlight,onChange:w=>i({spotlight:w?{x:50,y:50,w:30,h:30,shape:"rectangle",dimOpacity:.6,blur:0}:null})}),r.spotlight&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:r.spotlight.shape,onChange:w=>i({spotlight:{...r.spotlight,shape:w}}),options:[{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(Z,{label:"Position X",value:r.spotlight.x,min:0,max:100,formatValue:w=>`${w}%`,onChange:w=>i({spotlight:{...r.spotlight,x:w}})}),l.jsx(Z,{label:"Position Y",value:r.spotlight.y,min:0,max:100,formatValue:w=>`${w}%`,onChange:w=>i({spotlight:{...r.spotlight,y:w}})}),l.jsx(Z,{label:"Width",value:r.spotlight.w,min:5,max:100,formatValue:w=>`${w}%`,onChange:w=>i({spotlight:{...r.spotlight,w}})}),l.jsx(Z,{label:"Height",value:r.spotlight.h,min:5,max:100,formatValue:w=>`${w}%`,onChange:w=>i({spotlight:{...r.spotlight,h:w}})}),l.jsx(Z,{label:"Dim Opacity",value:Math.round(r.spotlight.dimOpacity*100),min:0,max:100,formatValue:w=>`${w}%`,onChange:w=>i({spotlight:{...r.spotlight,dimOpacity:w/100}})}),l.jsx(Z,{label:"Background Blur",value:r.spotlight.blur,min:0,max:30,formatValue:w=>`${w}px`,onChange:w=>i({spotlight:{...r.spotlight,blur:w}})})]})]}),l.jsxs(De,{title:"Annotations",tooltip:"Draw shapes over the panoramic canvas to highlight specific areas.",children:[r.annotations.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Highlight areas of your panoramic canvas with rectangles or circles."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:f,children:"+ Add Annotation"}),r.annotations.map((w,L)=>l.jsxs(Ol,{title:`Annotation ${L+1}`,onRemove:()=>h(L),children:[l.jsx(Ge,{label:"Shape",value:w.shape,onChange:g=>p(L,{shape:g}),options:[{value:"rounded-rect",label:"Rounded Rect"},{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(qe,{label:"Color",value:w.strokeColor,onChange:g=>p(L,{strokeColor:g})}),l.jsx(Z,{label:"X",value:w.x,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>p(L,{x:g})}),l.jsx(Z,{label:"Y",value:w.y,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>p(L,{y:g})}),l.jsx(Z,{label:"Width",value:w.w,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>p(L,{w:g})}),l.jsx(Z,{label:"Height",value:w.h,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>p(L,{h:g})}),l.jsx(Z,{label:"Stroke",value:w.strokeWidth,min:1,max:20,formatValue:g=>`${g}px`,onChange:g=>p(L,{strokeWidth:g})})]},w.id))]}),l.jsxs(De,{title:"Overlays",tooltip:"Add decorative shapes floating over the panoramic canvas.",children:[r.overlays.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Add floating shapes, star ratings, or badges over your panoramic canvas for extra visual appeal."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:D,children:"+ Add Overlay"}),r.overlays.map((w,L)=>l.jsxs(Ol,{title:`Overlay ${L+1}`,onRemove:()=>m(L),children:[l.jsx(Ge,{label:"Type",value:w.type,onChange:g=>y(L,{type:g}),options:[{value:"shape",label:"Shape"},{value:"star-rating",label:"Star Rating"},{value:"icon",label:"Icon"},{value:"badge",label:"Badge"},{value:"custom",label:"Custom"}]}),l.jsx(Z,{label:"X",value:w.x,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(L,{x:g})}),l.jsx(Z,{label:"Y",value:w.y,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(L,{y:g})}),l.jsx(Z,{label:"Size",value:w.size,min:1,max:50,formatValue:g=>`${g}%`,onChange:g=>y(L,{size:g})}),l.jsx(Z,{label:"Rotation",value:w.rotation,min:-180,max:180,formatValue:g=>`${g}°`,onChange:g=>y(L,{rotation:g})}),l.jsx(Z,{label:"Opacity",value:Math.round(w.opacity*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(L,{opacity:g/100})}),w.type==="shape"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:w.shapeType??"circle",onChange:g=>y(L,{shapeType:g}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"}]}),l.jsx(qe,{label:"Color",value:w.shapeColor??"#6366f1",onChange:g=>y(L,{shapeColor:g})}),l.jsx(Z,{label:"Shape Opacity",value:Math.round((w.shapeOpacity??.5)*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(L,{shapeOpacity:g/100})}),l.jsx(Z,{label:"Blur",value:w.shapeBlur??0,min:0,max:50,formatValue:g=>`${g}px`,onChange:g=>y(L,{shapeBlur:g})})]})]},w.id))]}),l.jsx("div",{className:"px-5 py-3 text-[10px] text-text-dim",children:"Loupe and Callouts are available in individual mode as they operate on specific screenshot regions."})]})}function Zp(r,i,a,d,p,h){var y,m,D,w,L,g;return{screenIndex:r.screenIndex,screenshotDataUrl:r.screenshotDataUrl||void 0,locale:p!=="default"?p:void 0,style:r.style,layout:r.layout,headline:r.headline,subtitle:r.subtitle,colors:r.colors,font:r.font,fontWeight:r.fontWeight,headlineSize:r.headlineSize||void 0,subtitleSize:r.subtitleSize||void 0,headlineRotation:r.headlineRotation||void 0,subtitleRotation:r.subtitleRotation||void 0,frameId:r.frameId,deviceColor:r.deviceColor||void 0,frameStyle:r.frameStyle,deviceScale:r.deviceScale,deviceTop:r.deviceTop,deviceRotation:r.deviceRotation,deviceOffsetX:r.deviceOffsetX,deviceAngle:r.deviceAngle,deviceTilt:r.deviceTilt,headlineTop:(y=r.textPositions.headline)==null?void 0:y.y,headlineLeft:(m=r.textPositions.headline)==null?void 0:m.x,headlineWidth:(D=r.textPositions.headline)==null?void 0:D.width,subtitleTop:(w=r.textPositions.subtitle)==null?void 0:w.y,subtitleLeft:(L=r.textPositions.subtitle)==null?void 0:L.x,subtitleWidth:(g=r.textPositions.subtitle)==null?void 0:g.width,composition:r.composition||"single",headlineGradient:r.headlineGradient||void 0,subtitleGradient:r.subtitleGradient||void 0,autoSizeHeadline:r.autoSizeHeadline||void 0,autoSizeSubtitle:r.autoSizeSubtitle||void 0,spotlight:r.spotlight||void 0,annotations:r.annotations.length>0?r.annotations:void 0,backgroundType:r.backgroundType!=="preset"?r.backgroundType:void 0,backgroundColor:r.backgroundType==="solid"?r.backgroundColor:void 0,backgroundGradient:r.backgroundType==="gradient"?r.backgroundGradient:void 0,backgroundImageDataUrl:r.backgroundType==="image"?r.backgroundImageDataUrl:void 0,backgroundOverlay:r.backgroundType==="image"&&r.backgroundOverlay?r.backgroundOverlay:void 0,deviceShadow:r.deviceShadow||void 0,borderSimulation:r.borderSimulation||void 0,cornerRadius:r.cornerRadius||void 0,loupe:r.loupe||void 0,callouts:r.callouts.length>0?r.callouts:void 0,overlays:r.overlays.length>0?r.overlays:void 0,headlineLineHeight:r.headlineLineHeight?r.headlineLineHeight/100:void 0,headlineLetterSpacing:r.headlineLetterSpacing?`${r.headlineLetterSpacing/100}em`:void 0,headlineTextTransform:r.headlineTextTransform||void 0,headlineFontStyle:r.headlineFontStyle||void 0,subtitleOpacity:r.subtitleOpacity?r.subtitleOpacity/100:void 0,subtitleLetterSpacing:r.subtitleLetterSpacing?`${r.subtitleLetterSpacing/100}em`:void 0,subtitleTextTransform:r.subtitleTextTransform||void 0,width:a,height:d}}function Jp(r){return{top:r.offsetTop,left:r.offsetLeft,width:r.offsetWidth,height:r.offsetHeight}}function qp(r,i,a,d,p,h,f,y){const m=C.useRef(null),D=C.useCallback((j,b)=>{var _,N,I,V;try{const ee=(_=r.current)==null?void 0:_.contentDocument;if(!ee)return null;const ie=ee.elementsFromPoint(j,b);let le=null,re=null,M=null;for(const x of ie){let K=x;for(;K&&K!==ee.documentElement;)!le&&((N=K.classList)!=null&&N.contains("headline"))&&(le=K),!re&&((I=K.classList)!=null&&I.contains("subtitle"))&&(re=K),!M&&((V=K.classList)!=null&&V.contains("device-wrapper"))&&(M=K),K=K.parentElement}if(le&&re){const x=le.getBoundingClientRect(),K=re.getBoundingClientRect(),ue=x.top+x.height/2,q=K.top+K.height/2;return Math.abs(b-ue)<=Math.abs(b-q)?{cls:"headline",el:le,kind:"text"}:{cls:"subtitle",el:re,kind:"text"}}if(le)return{cls:"headline",el:le,kind:"text"};if(re)return{cls:"subtitle",el:re,kind:"text"};if(M)return{cls:"device-wrapper",el:M,kind:"device"}}catch{}return null},[r]),w=C.useCallback((j,b)=>{const _=i.current;if(!_)return{x:0,y:0};const N=_.getBoundingClientRect();return{x:(j-N.left)/d,y:(b-N.top)/d}},[i,d]),L=C.useCallback(j=>{if(!a)return;const b=w(j.clientX,j.clientY),_=D(b.x,b.y);if(_){if(j.preventDefault(),_.kind==="device"){m.current={kind:"device",el:_.el,startX:j.clientX,startY:j.clientY,startDeviceTop:a.deviceTop,startDeviceOffsetX:a.deviceOffsetX,offsetX:0,offsetY:0,origWidth:0,scale:d},_.el.style.outline="2px solid rgba(99,102,241,0.5)";const N=V=>{const ee=m.current;if(!ee||ee.kind!=="device")return;const ie=(V.clientX-ee.startX)/ee.scale,le=(V.clientY-ee.startY)/ee.scale,re=Math.max(-80,Math.min(80,ee.startDeviceOffsetX+Math.round(ie/p*100))),M=Math.max(-80,Math.min(80,ee.startDeviceTop+Math.round(le/h*100)));ee.el.style.top=M+"%",ee.el.style.left=re?`calc(50% + ${re/100*p}px)`:"50%"},I=V=>{const ee=m.current;if(!ee||ee.kind!=="device")return;ee.el.style.outline="none";const ie=(V.clientX-ee.startX)/ee.scale,le=(V.clientY-ee.startY)/ee.scale,re=Math.max(-80,Math.min(80,ee.startDeviceOffsetX+Math.round(ie/p*100))),M=Math.max(-80,Math.min(80,ee.startDeviceTop+Math.round(le/h*100)));m.current=null,document.removeEventListener("mousemove",N),document.removeEventListener("mouseup",I),f({deviceTop:M,deviceOffsetX:re})};document.addEventListener("mousemove",N),document.addEventListener("mouseup",I)}else if(_.kind==="text"){const N=_.el,I=_.cls,V=N.getBoundingClientRect(),ee=!!(I==="headline"?a.textPositions.headline:a.textPositions.subtitle),ie=V.left+V.width/2,le=V.width;if(!ee){const x=I==="headline"?a.headlineRotation:a.subtitleRotation,K=["translateX(-50%)"];x&&K.push(`rotate(${x}deg)`),N.style.position="fixed",N.style.top=V.top+"px",N.style.left=ie+"px",N.style.transform=K.join(" "),N.style.zIndex="10",N.style.margin="0",N.style.width=V.width+"px"}m.current={kind:"text",cls:I,el:N,startX:j.clientX,startY:j.clientY,startDeviceTop:0,startDeviceOffsetX:0,offsetX:b.x-ie,offsetY:b.y-V.top,origWidth:le,scale:d},N.style.outline="2px dashed rgba(99,102,241,0.5)";const re=x=>{const K=m.current;if(!K||K.kind!=="text")return;const ue=w(x.clientX,x.clientY);K.el.style.top=ue.y-K.offsetY+"px",K.el.style.left=ue.x-K.offsetX+"px"},M=()=>{const x=m.current;if(!x||x.kind!=="text")return;x.el.style.outline="none";const K=Jp(x.el),ue=Math.round(K.top/h*100*10)/10,q=Math.round(K.left/p*100*10)/10,me=Math.round(x.origWidth/p*100*10)/10;m.current=null,document.removeEventListener("mousemove",re),document.removeEventListener("mouseup",M),y(x.cls,{x:q,y:ue,width:me})};document.addEventListener("mousemove",re),document.addEventListener("mouseup",M)}}},[a,d,w,D,f,y]),g=C.useCallback((j,b)=>{const _=w(j,b),N=D(_.x,_.y);return N?N.kind==="device"?"move":"grab":"default"},[w,D]);return{onOverlayMouseDown:L,getCursorForPosition:g}}function eh(){const r=J(le=>le.screens),i=J(le=>le.selectedScreen),a=J(le=>le.setSelectedScreen),d=J(le=>le.addScreen),p=J(le=>le.removeScreen),h=J(le=>le.moveScreen),f=J(le=>le.previewW),y=J(le=>le.previewH),m=J(le=>le.previewBg),D=J(le=>le.renderVersion),w=J(le=>le.platform),L=J(le=>le.locale),g=J(le=>le.deviceFamilies),j=C.useRef(null),[b,_]=C.useState(.5),N=C.useCallback(()=>{const le=j.current;if(!le)return;const re=48,M=16,x=56,K=le.clientWidth-re,ue=le.clientHeight-x-re,q=r.length+.5,me=r.length*M,ze=(K-me)/(q*f),Ae=ue/y;let We=Math.min(ze,Ae);We=Math.min(We,1.3),We=Math.max(We,.1),_(We)},[y,f,r.length]);C.useEffect(()=>(N(),window.addEventListener("resize",N),()=>window.removeEventListener("resize",N)),[N]);const I=m==="light"?"bg-gray-100":"bg-bg",[V,ee]=C.useState(null),ie=V??b;return l.jsxs("div",{ref:j,className:`flex-1 flex flex-col overflow-hidden ${I}`,children:[l.jsx("div",{className:"flex-1 overflow-auto",children:l.jsxs("div",{className:"flex items-center justify-center gap-4 p-6 min-w-min min-h-full",children:[r.map((le,re)=>l.jsx(th,{index:re,selected:re===i,previewW:f,previewH:y,scale:ie,headline:le.headline,canRemove:r.length>1,canMoveLeft:re>0,canMoveRight:re<r.length-1,onSelect:()=>a(re),onRemove:()=>p(re),onMoveLeft:()=>h(re,re-1),onMoveRight:()=>h(re,re+1),renderVersion:D,platform:w,locale:L,deviceFamilies:g},`screen-${le.screenIndex}-${re}`)),l.jsx("button",{className:"shrink-0 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-text-dim text-xs hover:border-accent hover:text-accent transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",style:{width:Math.round(f*ie*.5),height:Math.round(y*ie)},onClick:d,"aria-label":"Add a new screen",children:"+ Add Screen"})]})}),l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 border-t border-border bg-surface",children:[l.jsx("span",{className:"text-[10px] text-text-dim",children:"Zoom"}),l.jsx("input",{type:"range",min:10,max:150,value:Math.round((V??b)*100),onChange:le=>ee(parseInt(le.target.value,10)/100),className:"flex-1 h-1 accent-accent","aria-label":"Zoom level","aria-valuemin":10,"aria-valuemax":150,"aria-valuenow":Math.round((V??b)*100),"aria-valuetext":`${Math.round((V??b)*100)}%`}),l.jsxs("span",{className:"text-[10px] text-text-dim w-8 text-right",children:[Math.round((V??b)*100),"%"]}),l.jsx("button",{className:`text-[10px] transition-opacity ${V!==null?"text-text-dim hover:text-text":"text-text-dim/50 cursor-default"}`,onClick:()=>ee(null),disabled:V===null,"aria-label":"Reset zoom to fit",children:"Fit"})]})]})}function th({index:r,selected:i,previewW:a,previewH:d,scale:p,canRemove:h,canMoveLeft:f,canMoveRight:y,onSelect:m,onRemove:D,onMoveLeft:w,onMoveRight:L,renderVersion:g,platform:j,locale:b,deviceFamilies:_}){const N=C.useRef(null),I=C.useRef(null),{confirm:V,dialog:ee}=ui(),[ie,le]=C.useState(!0),re=C.useRef(null),M=C.useRef(null),x=J(U=>U.screens[r]),K=J(U=>U.updateScreen);C.useEffect(()=>(zd(r,N.current),()=>zd(r,null)),[r]);const ue=C.useCallback(U=>{K(r,U)},[r,K]),q=C.useCallback((U,$)=>{const H={...(x==null?void 0:x.textPositions)??{headline:null,subtitle:null}};H[U]=$,K(r,{textPositions:H})},[r,x==null?void 0:x.textPositions,K]),{onOverlayMouseDown:me,getCursorForPosition:ze}=qp(N,I,x,p,a,d,ue,q),[Ae,We]=C.useState("default"),F=C.useCallback(U=>{We(ze(U.clientX,U.clientY))},[ze]);return C.useEffect(()=>{if(x)return M.current&&clearTimeout(M.current),M.current=setTimeout(()=>{var H;(H=re.current)==null||H.abort();const U=new AbortController;re.current=U;const $=Zp(x,j,a,d,b);ap($,U.signal).then(X=>{const R=N.current;if(!R)return;const A=R.contentDocument;A?(A.open(),A.write(X),A.close()):R.srcdoc=X,le(!1)}).catch(X=>{X instanceof DOMException&&X.name==="AbortError"||le(!1)})},ie?0:150),()=>{var U;M.current&&clearTimeout(M.current),(U=re.current)==null||U.abort()}},[x,g,j,a,d,b]),l.jsxs(l.Fragment,{children:[ee,l.jsxs("div",{className:`shrink-0 cursor-pointer rounded-lg overflow-hidden transition-shadow ${i?"ring-2 ring-accent shadow-lg":"hover:ring-1 hover:ring-border"}`,onClick:m,children:[l.jsxs("div",{className:"flex items-center justify-between px-2 py-1 bg-surface text-[10px]",children:[f?l.jsx("button",{className:"text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:U=>{U.stopPropagation(),w()},title:"Move left","aria-label":`Move screen ${r+1} left`,children:"‹"}):l.jsx("span",{className:"w-4"}),l.jsxs("span",{className:"text-text-dim font-medium",children:["Screen ",r+1]}),l.jsxs("div",{className:"flex items-center gap-0.5",children:[y&&l.jsx("button",{className:"text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:U=>{U.stopPropagation(),L()},title:"Move right","aria-label":`Move screen ${r+1} right`,children:"›"}),h&&l.jsx("button",{className:"text-text-dim hover:text-red-400 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:async U=>{U.stopPropagation(),await V({title:"Remove Screen",message:`Remove Screen ${r+1}? This cannot be undone.`})&&D()},title:"Remove screen","aria-label":`Remove screen ${r+1}`,children:"×"})]})]}),l.jsxs("div",{ref:I,className:"relative overflow-hidden",style:{width:a*p,height:d*p},children:[ie&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-bg z-20",children:l.jsx("div",{className:"w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),l.jsx("iframe",{ref:N,className:"border-none block origin-top-left",style:{width:a,height:d,transform:`scale(${p})`},title:`Screen ${r+1}`}),l.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:Ae},onMouseDown:me,onMouseMove:F})]})]})]})}function nh(){const r=C.useRef(null),i=C.useRef(null),a=C.useRef(null),d=C.useRef(null),p=C.useRef(null),h=J(U=>U.config),f=J(U=>U.previewW),y=J(U=>U.previewH),m=J(U=>U.previewBg),D=J(U=>U.renderVersion),w=J(U=>U.panoramicFrameCount),L=J(U=>U.panoramicBackground),g=J(U=>U.panoramicElements),j=J(U=>U.panoramicEffects),b=J(U=>U.selectedElementIndex),_=J(U=>U.setSelectedElement),N=J(U=>U.updatePanoramicElement),[I,V]=C.useState(.3),[ee,ie]=C.useState(!0),[le,re]=C.useState(!1),M=C.useRef(null);C.useEffect(()=>(Wd(r.current),()=>Wd(null)),[]);const x=f*w,K=C.useCallback(()=>{const U=i.current;if(!U)return;const $=U.clientWidth-48,H=U.clientHeight-120,X=$/x,R=H/y;let A=Math.min(X,R);A=Math.min(A,1),A=Math.max(A,.05),V(A)},[x,y]);C.useEffect(()=>(K(),window.addEventListener("resize",K),()=>window.removeEventListener("resize",K)),[K]),C.useEffect(()=>{if(h)return p.current&&clearTimeout(p.current),p.current=setTimeout(()=>{var H;(H=d.current)==null||H.abort();const U=new AbortController;d.current=U;const $={frameCount:w,frameWidth:f,frameHeight:y,background:L,elements:g,font:h.theme.font,fontWeight:h.theme.fontWeight,frameStyle:h.frames.style,effects:j};mp($,U.signal).then(X=>{const R=r.current;if(!R)return;const A=R.contentDocument;A&&(A.open(),A.write(X),A.close()),ie(!1)}).catch(X=>{X instanceof DOMException&&X.name==="AbortError"||(console.error("[PanoramicPreview] fetch failed:",X),ie(!1))})},ee?0:200),()=>{var U;p.current&&clearTimeout(p.current),(U=d.current)==null||U.abort()}},[h,w,f,y,L,g,j,D]);const ue=C.useCallback((U,$)=>{const H=a.current;if(!H)return null;const X=H.getBoundingClientRect(),R=(U-X.left)/(x*I)*100,A=($-X.top)/(y*I)*100;return{x:R,y:A}},[x,y,I]),q=C.useCallback((U,$)=>{const H=ue(U,$);if(!H)return null;let X=null,R=-1;for(let A=0;A<g.length;A++){const ce=g[A];let we,W;ce.type==="device"?(we=ce.width,W=ce.width/100*x*2.1/y*100):ce.type==="text"?(we=ce.maxWidth||15,W=ce.fontSize/100*y*2/y*100):ce.type==="decoration"?(we=ce.width,W=ce.height?ce.height/100*y/y*100:we*x/y):(we=10,W=5),H.x>=ce.x&&H.x<=ce.x+we&&H.y>=ce.y&&H.y<=ce.y+W&&ce.z>R&&(R=ce.z,X=A)}return X},[g,ue,x,y]),me=C.useCallback(U=>{if(!ue(U.clientX,U.clientY))return;const H=q(U.clientX,U.clientY);if(H!==null){_(H);const X=g[H];M.current={elementIndex:H,startX:U.clientX,startY:U.clientY,origX:X.x,origY:X.y},re(!0),U.preventDefault()}},[ue,q,g,_]);C.useEffect(()=>{const U=H=>{const X=M.current;if(!X)return;const R=(H.clientX-X.startX)/I,A=(H.clientY-X.startY)/I,ce=r.current,we=ce==null?void 0:ce.contentDocument;if(we){const ve=[...g].map((Le,Ue)=>({z:Le.z,i:Ue})).sort((Le,Ue)=>Le.z-Ue.z).findIndex(Le=>Le.i===X.elementIndex),ke=we.querySelector(`[data-index="${ve}"]`);if(ke){const Le=g[X.elementIndex],Ue="rotation"in Le&&Le.rotation?Le.rotation:0;ke.style.filter="none",ke.style.transform=`translate(${R}px, ${A}px) rotate(${Ue}deg)`}}},$=H=>{const X=M.current;if(!X)return;const R=(H.clientX-X.startX)/(x*I)*100,A=(H.clientY-X.startY)/(y*I)*100,ce=Math.round((X.origX+R)*2)/2,we=Math.round((X.origY+A)*2)/2;N(X.elementIndex,{x:ce,y:we}),M.current=null,re(!1)};return window.addEventListener("mousemove",U),window.addEventListener("mouseup",$),()=>{window.removeEventListener("mousemove",U),window.removeEventListener("mouseup",$)}},[x,y,I,g,N]),C.useEffect(()=>{const U=$=>{var we;if(b===null)return;const H=(we=$.target)==null?void 0:we.tagName;if(H==="INPUT"||H==="TEXTAREA"||H==="SELECT")return;const X=$.shiftKey?5:.5;let R=0,A=0;if($.key==="ArrowLeft")R=-X;else if($.key==="ArrowRight")R=X;else if($.key==="ArrowUp")A=-X;else if($.key==="ArrowDown")A=X;else return;$.preventDefault();const ce=g[b];ce&&N(b,{x:Math.round((ce.x+R)*2)/2,y:Math.round((ce.y+A)*2)/2})};return window.addEventListener("keydown",U),()=>window.removeEventListener("keydown",U)},[b,g,N]);const[ze,Ae]=C.useState("default"),We=C.useCallback(U=>{if(le)return;const $=q(U.clientX,U.clientY);Ae($!==null?"grab":"default")},[le,q]),F=m==="light"?"bg-gray-100":"bg-bg";return l.jsxs("div",{ref:i,className:`flex-1 flex flex-col overflow-hidden ${F}`,children:[l.jsx("div",{className:"flex items-center justify-between px-6 py-3 border-b border-border bg-surface",children:l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("span",{className:"text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded",children:"Panoramic"}),l.jsxs("span",{className:"text-xs text-text-dim",children:[w," frames · ",x,"×",y]})]})}),l.jsx("div",{className:"flex-1 overflow-auto flex items-center justify-center p-6",children:l.jsxs("div",{className:"relative",children:[ee&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center z-20",children:l.jsx("div",{className:"w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),l.jsx("div",{className:"flex mb-1",style:{width:x*I},children:Array.from({length:w},(U,$)=>l.jsxs("div",{className:"text-[9px] text-text-dim text-center border-x border-border/30",style:{width:f*I},children:["Frame ",$+1]},$))}),l.jsxs("div",{ref:a,className:"relative overflow-hidden rounded border border-border/30",style:{width:x*I,height:y*I},children:[l.jsx("iframe",{ref:r,className:"border-none block origin-top-left",style:{width:x,height:y,transform:`scale(${I})`},title:"Panoramic Preview"}),l.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:le?"grabbing":ze},onMouseDown:me,onMouseMove:We})]})]})}),l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 border-t border-border bg-surface",children:[l.jsx("span",{className:"text-[10px] text-text-dim",children:"Zoom"}),l.jsx("input",{type:"range",min:5,max:100,value:Math.round(I*100),onChange:U=>V(parseInt(U.target.value,10)/100),className:"flex-1 h-1 accent-accent","aria-label":"Zoom level","aria-valuemin":5,"aria-valuemax":100,"aria-valuenow":Math.round(I*100),"aria-valuetext":`${Math.round(I*100)}%`}),l.jsxs("span",{className:"text-[10px] text-text-dim w-8 text-right",children:[Math.round(I*100),"%"]}),l.jsx("button",{className:"text-[10px] text-text-dim hover:text-text transition-opacity",onClick:K,"aria-label":"Reset zoom to fit",children:"Fit"}),b!==null&&l.jsx("span",{className:"ml-auto text-[9px] text-text-dim border-l border-border pl-2",title:"Use arrow keys to nudge selected element. Hold Shift for larger steps.",children:"Arrow keys to nudge"})]})]})}var Hd=rf(),oh=`svg[fill=none] {
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
}`,rh={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let r=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");r||(r=document.createElement("style"),r.id="feedback-tool-styles-annotation-popup-css-styles",r.textContent=oh,document.head.appendChild(r))}var et=rh,lh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",children:l.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),sh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",children:l.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),ih=({size:r=24,style:i={}})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",style:i,children:[l.jsxs("g",{clipPath:"url(#clip0_list_sparkle)",children:[l.jsx("path",{d:"M11.5 12L5.5 12",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M18.5 6.75L5.5 6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M9.25 17.25L5.5 17.25",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})]}),l.jsx("defs",{children:l.jsx("clipPath",{id:"clip0_list_sparkle",children:l.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),Ar=({size:r=20})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:[l.jsx("circle",{cx:"10",cy:"10.5",r:"5.25",stroke:"currentColor",strokeWidth:"1.25"}),l.jsx("path",{d:"M8.5 8.75C8.5 7.92 9.17 7.25 10 7.25C10.83 7.25 11.5 7.92 11.5 8.75C11.5 9.58 10.83 10.25 10 10.25V11",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("circle",{cx:"10",cy:"13",r:"0.75",fill:"currentColor"})]}),Ud=({size:r=14})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 14 14",fill:"none",children:[l.jsx("style",{children:`
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
    `}),l.jsx("path",{className:"check-path-animated",d:"M3.9375 7L6.125 9.1875L10.5 4.8125",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),ah=({size:r=24,copied:i=!1})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .copy-icon, .check-icon {
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
    `}),l.jsxs("g",{className:"copy-icon",style:{opacity:i?0:1,transform:i?"scale(0.8)":"scale(1)",transformOrigin:"center"},children:[l.jsx("path",{d:"M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",stroke:"currentColor",strokeWidth:"1.5"}),l.jsx("path",{d:"M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),l.jsxs("g",{className:"check-icon",style:{opacity:i?1:0,transform:i?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})]}),uh=({size:r=24,state:i="idle"})=>{const a=i==="idle",d=i==="sent",p=i==="failed",h=i==="sending";return l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
        .send-arrow-icon, .send-check-icon, .send-error-icon {
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
      `}),l.jsx("g",{className:"send-arrow-icon",style:{opacity:a?1:h?.5:0,transform:a?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:l.jsx("path",{d:"M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),l.jsxs("g",{className:"send-check-icon",style:{opacity:d?1:0,transform:d?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsxs("g",{className:"send-error-icon",style:{opacity:p?1:0,transform:p?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M12 8V12",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round"}),l.jsx("circle",{cx:"12",cy:"15",r:"0.5",fill:"#ef4444",stroke:"#ef4444",strokeWidth:"1"})]})]})},ch=({size:r=24,isOpen:i=!0})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .eye-open, .eye-closed {
        transition: opacity 0.2s ease;
      }
    `}),l.jsxs("g",{className:"eye-open",style:{opacity:i?1:0},children:[l.jsx("path",{d:"M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsxs("g",{className:"eye-closed",style:{opacity:i?0:1},children:[l.jsx("path",{d:"M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",fill:"currentColor"}),l.jsx("path",{d:"M5 19L19 5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})]}),dh=({size:r=24,isPaused:i=!1})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .pause-bar, .play-triangle {
        transition: opacity 0.15s ease;
      }
    `}),l.jsx("path",{className:"pause-bar",d:"M8 6L8 18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:i?0:1}}),l.jsx("path",{className:"pause-bar",d:"M16 18L16 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:i?0:1}}),l.jsx("path",{className:"play-triangle",d:"M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",stroke:"currentColor",strokeWidth:"1.5",style:{opacity:i?1:0}})]}),fh=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("path",{d:"M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("circle",{cx:"12",cy:"12",r:"2.5",stroke:"currentColor",strokeWidth:"1.5"})]}),mh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:l.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Ua=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:[l.jsxs("g",{clipPath:"url(#clip0_2_53)",children:[l.jsx("path",{d:"M16.25 16.25L7.75 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M7.75 16.25L16.25 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsx("defs",{children:l.jsx("clipPath",{id:"clip0_2_53",children:l.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),ph=({size:r=24})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",children:l.jsx("path",{d:"M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z",fill:"currentColor"})}),hh=({size:r=16})=>l.jsxs("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:[l.jsx("path",{d:"M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M10 3.9585V5.05698",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M10 14.9429V16.0414",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M5.7269 5.72656L6.50682 6.50649",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M13.4932 13.4932L14.2731 14.2731",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M3.95834 10H5.05683",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M14.9432 10H16.0417",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M5.7269 14.2731L6.50682 13.4932",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M13.4932 6.50649L14.2731 5.72656",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"})]}),_h=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 20 20",fill:"none",children:l.jsx("path",{d:"M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z",stroke:"currentColor",strokeWidth:"1.13793",strokeLinecap:"round",strokeLinejoin:"round"})}),Vd=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375",stroke:"currentColor",strokeWidth:"0.9",strokeLinecap:"round",strokeLinejoin:"round"})}),gh=({size:r=24})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),yh=({size:r=16})=>l.jsx("svg",{width:r,height:r,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M8.5 3.5L4 8L8.5 12.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),mf=["data-feedback-toolbar","data-annotation-popup","data-annotation-marker"],Va=mf.flatMap(r=>[`:not([${r}])`,`:not([${r}] *)`]).join(""),nu="feedback-freeze-styles",Xa="__agentation_freeze";function xh(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:i=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const r=window;return r[Xa]||(r[Xa]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),r[Xa]}var Ye=xh();typeof window<"u"&&!Ye.installed&&(Ye.origSetTimeout=window.setTimeout.bind(window),Ye.origSetInterval=window.setInterval.bind(window),Ye.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(r,i,...a)=>typeof r=="string"?Ye.origSetTimeout(r,i):Ye.origSetTimeout((...d)=>{Ye.frozen?Ye.frozenTimeoutQueue.push(()=>r(...d)):r(...d)},i,...a),window.setInterval=(r,i,...a)=>typeof r=="string"?Ye.origSetInterval(r,i):Ye.origSetInterval((...d)=>{Ye.frozen||r(...d)},i,...a),window.requestAnimationFrame=r=>Ye.origRAF(i=>{Ye.frozen?Ye.frozenRAFQueue.push(r):r(i)}),Ye.installed=!0);var Ve=Ye.origSetTimeout,vh=Ye.origSetInterval;function bh(r){return r?mf.some(i=>{var a;return!!((a=r.closest)!=null&&a.call(r,`[${i}]`))}):!1}function wh(){if(typeof document>"u"||Ye.frozen)return;Ye.frozen=!0,Ye.frozenTimeoutQueue=[],Ye.frozenRAFQueue=[];let r=document.getElementById(nu);r||(r=document.createElement("style"),r.id=nu),r.textContent=`
    *${Va},
    *${Va}::before,
    *${Va}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `,document.head.appendChild(r),Ye.pausedAnimations=[];try{document.getAnimations().forEach(i=>{var d;if(i.playState!=="running")return;const a=(d=i.effect)==null?void 0:d.target;bh(a)||(i.pause(),Ye.pausedAnimations.push(i))})}catch{}document.querySelectorAll("video").forEach(i=>{i.paused||(i.dataset.wasPaused="false",i.pause())})}function Xd(){var a;if(typeof document>"u"||!Ye.frozen)return;Ye.frozen=!1;const r=Ye.frozenTimeoutQueue;Ye.frozenTimeoutQueue=[];for(const d of r)Ye.origSetTimeout(()=>{if(Ye.frozen){Ye.frozenTimeoutQueue.push(d);return}try{d()}catch(p){console.warn("[agentation] Error replaying queued timeout:",p)}},0);const i=Ye.frozenRAFQueue;Ye.frozenRAFQueue=[];for(const d of i)Ye.origRAF(p=>{if(Ye.frozen){Ye.frozenRAFQueue.push(d);return}d(p)});for(const d of Ye.pausedAnimations)try{d.play()}catch(p){console.warn("[agentation] Error resuming animation:",p)}Ye.pausedAnimations=[],(a=document.getElementById(nu))==null||a.remove(),document.querySelectorAll("video").forEach(d=>{d.dataset.wasPaused==="false"&&(d.play().catch(()=>{}),delete d.dataset.wasPaused)})}var Qd=C.forwardRef(function({element:i,timestamp:a,selectedText:d,placeholder:p="What should change?",initialValue:h="",submitLabel:f="Add",onSubmit:y,onCancel:m,onDelete:D,style:w,accentColor:L="#3c82f7",isExiting:g=!1,lightMode:j=!1,computedStyles:b},_){const[N,I]=C.useState(h),[V,ee]=C.useState(!1),[ie,le]=C.useState("initial"),[re,M]=C.useState(!1),[x,K]=C.useState(!1),ue=C.useRef(null),q=C.useRef(null),me=C.useRef(null),ze=C.useRef(null);C.useEffect(()=>{g&&ie!=="exit"&&le("exit")},[g,ie]),C.useEffect(()=>{Ve(()=>{le("enter")},0);const H=Ve(()=>{le("entered")},200),X=Ve(()=>{const R=ue.current;R&&(R.focus(),R.selectionStart=R.selectionEnd=R.value.length,R.scrollTop=R.scrollHeight)},50);return()=>{clearTimeout(H),clearTimeout(X),me.current&&clearTimeout(me.current),ze.current&&clearTimeout(ze.current)}},[]);const Ae=C.useCallback(()=>{ze.current&&clearTimeout(ze.current),ee(!0),ze.current=Ve(()=>{var H;ee(!1),(H=ue.current)==null||H.focus()},250)},[]);C.useImperativeHandle(_,()=>({shake:Ae}),[Ae]);const We=C.useCallback(()=>{le("exit"),me.current=Ve(()=>{m()},150)},[m]),F=C.useCallback(()=>{N.trim()&&y(N.trim())},[N,y]),U=C.useCallback(H=>{H.stopPropagation(),!H.nativeEvent.isComposing&&(H.key==="Enter"&&!H.shiftKey&&(H.preventDefault(),F()),H.key==="Escape"&&We())},[F,We]),$=[et.popup,j?et.light:"",ie==="enter"?et.enter:"",ie==="entered"?et.entered:"",ie==="exit"?et.exit:"",V?et.shake:""].filter(Boolean).join(" ");return l.jsxs("div",{ref:q,className:$,"data-annotation-popup":!0,style:w,onClick:H=>H.stopPropagation(),children:[l.jsxs("div",{className:et.header,children:[b&&Object.keys(b).length>0?l.jsxs("button",{className:et.headerToggle,onClick:()=>{const H=x;K(!x),H&&Ve(()=>{var X;return(X=ue.current)==null?void 0:X.focus()},0)},type:"button",children:[l.jsx("svg",{className:`${et.chevron} ${x?et.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),l.jsx("span",{className:et.element,children:i})]}):l.jsx("span",{className:et.element,children:i}),a&&l.jsx("span",{className:et.timestamp,children:a})]}),b&&Object.keys(b).length>0&&l.jsx("div",{className:`${et.stylesWrapper} ${x?et.expanded:""}`,children:l.jsx("div",{className:et.stylesInner,children:l.jsx("div",{className:et.stylesBlock,children:Object.entries(b).map(([H,X])=>l.jsxs("div",{className:et.styleLine,children:[l.jsx("span",{className:et.styleProperty,children:H.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",l.jsx("span",{className:et.styleValue,children:X}),";"]},H))})})}),d&&l.jsxs("div",{className:et.quote,children:["“",d.slice(0,80),d.length>80?"...":"","”"]}),l.jsx("textarea",{ref:ue,className:et.textarea,style:{borderColor:re?L:void 0},placeholder:p,value:N,onChange:H=>I(H.target.value),onFocus:()=>M(!0),onBlur:()=>M(!1),rows:2,onKeyDown:U}),l.jsxs("div",{className:et.actions,children:[D&&l.jsx("div",{className:et.deleteWrapper,children:l.jsx("button",{className:et.deleteButton,onClick:D,type:"button",children:l.jsx(gh,{size:22})})}),l.jsx("button",{className:et.cancel,onClick:We,children:"Cancel"}),l.jsx("button",{className:et.submit,style:{backgroundColor:L,opacity:N.trim()?1:.4},onClick:F,disabled:!N.trim(),children:f})]})]})});function Hr(r){if(r.parentElement)return r.parentElement;const i=r.getRootNode();return i instanceof ShadowRoot?i.host:null}function Jt(r,i){let a=r;for(;a;){if(a.matches(i))return a;a=Hr(a)}return null}function kh(r,i=4){const a=[];let d=r,p=0;for(;d&&p<i;){const h=d.tagName.toLowerCase();if(h==="html"||h==="body")break;let f=h;if(d.id)f=`#${d.id}`;else if(d.className&&typeof d.className=="string"){const m=d.className.split(/\s+/).find(D=>D.length>2&&!D.match(/^[a-z]{1,2}$/)&&!D.match(/[A-Z0-9]{5,}/));m&&(f=`.${m.split("_")[0]}`)}const y=Hr(d);!d.parentElement&&y&&(f=`⟨shadow⟩ ${f}`),a.unshift(f),d=y,p++}return a.join(" > ")}function si(r){var d,p,h,f,y,m,D,w;const i=kh(r);if(r.dataset.element)return{name:r.dataset.element,path:i};const a=r.tagName.toLowerCase();if(["path","circle","rect","line","g"].includes(a)){const L=Jt(r,"svg");if(L){const g=Hr(L);if(g instanceof HTMLElement)return{name:`graphic in ${si(g).name}`,path:i}}return{name:"graphic element",path:i}}if(a==="svg"){const L=Hr(r);if((L==null?void 0:L.tagName.toLowerCase())==="button"){const g=(d=L.textContent)==null?void 0:d.trim();return{name:g?`icon in "${g}" button`:"button icon",path:i}}return{name:"icon",path:i}}if(a==="button"){const L=(p=r.textContent)==null?void 0:p.trim(),g=r.getAttribute("aria-label");return g?{name:`button [${g}]`,path:i}:{name:L?`button "${L.slice(0,25)}"`:"button",path:i}}if(a==="a"){const L=(h=r.textContent)==null?void 0:h.trim(),g=r.getAttribute("href");return L?{name:`link "${L.slice(0,25)}"`,path:i}:g?{name:`link to ${g.slice(0,30)}`,path:i}:{name:"link",path:i}}if(a==="input"){const L=r.getAttribute("type")||"text",g=r.getAttribute("placeholder"),j=r.getAttribute("name");return g?{name:`input "${g}"`,path:i}:j?{name:`input [${j}]`,path:i}:{name:`${L} input`,path:i}}if(["h1","h2","h3","h4","h5","h6"].includes(a)){const L=(f=r.textContent)==null?void 0:f.trim();return{name:L?`${a} "${L.slice(0,35)}"`:a,path:i}}if(a==="p"){const L=(y=r.textContent)==null?void 0:y.trim();return L?{name:`paragraph: "${L.slice(0,40)}${L.length>40?"...":""}"`,path:i}:{name:"paragraph",path:i}}if(a==="span"||a==="label"){const L=(m=r.textContent)==null?void 0:m.trim();return L&&L.length<40?{name:`"${L}"`,path:i}:{name:a,path:i}}if(a==="li"){const L=(D=r.textContent)==null?void 0:D.trim();return L&&L.length<40?{name:`list item: "${L.slice(0,35)}"`,path:i}:{name:"list item",path:i}}if(a==="blockquote")return{name:"blockquote",path:i};if(a==="code"){const L=(w=r.textContent)==null?void 0:w.trim();return L&&L.length<30?{name:`code: \`${L}\``,path:i}:{name:"code",path:i}}if(a==="pre")return{name:"code block",path:i};if(a==="img"){const L=r.getAttribute("alt");return{name:L?`image "${L.slice(0,30)}"`:"image",path:i}}if(a==="video")return{name:"video",path:i};if(["div","section","article","nav","header","footer","aside","main"].includes(a)){const L=r.className,g=r.getAttribute("role"),j=r.getAttribute("aria-label");if(j)return{name:`${a} [${j}]`,path:i};if(g)return{name:`${g}`,path:i};if(typeof L=="string"&&L){const b=L.split(/[\s_-]+/).map(_=>_.replace(/[A-Z0-9]{5,}.*$/,"")).filter(_=>_.length>2&&!/^[a-z]{1,2}$/.test(_)).slice(0,2);if(b.length>0)return{name:b.join(" "),path:i}}return{name:a==="div"?"container":a,path:i}}return{name:a,path:i}}function Rl(r){var h,f,y;const i=[],a=(h=r.textContent)==null?void 0:h.trim();a&&a.length<100&&i.push(a);const d=r.previousElementSibling;if(d){const m=(f=d.textContent)==null?void 0:f.trim();m&&m.length<50&&i.unshift(`[before: "${m.slice(0,40)}"]`)}const p=r.nextElementSibling;if(p){const m=(y=p.textContent)==null?void 0:y.trim();m&&m.length<50&&i.push(`[after: "${m.slice(0,40)}"]`)}return i.join(" ")}function Ks(r){const i=Hr(r);if(!i)return"";const p=(r.getRootNode()instanceof ShadowRoot&&r.parentElement?Array.from(r.parentElement.children):Array.from(i.children)).filter(w=>w!==r&&w instanceof HTMLElement);if(p.length===0)return"";const h=p.slice(0,4).map(w=>{var b;const L=w.tagName.toLowerCase(),g=w.className;let j="";if(typeof g=="string"&&g){const _=g.split(/\s+/).map(N=>N.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(N=>N.length>2&&!/^[a-z]{1,2}$/.test(N));_&&(j=`.${_}`)}if(L==="button"||L==="a"){const _=(b=w.textContent)==null?void 0:b.trim().slice(0,15);if(_)return`${L}${j} "${_}"`}return`${L}${j}`});let y=i.tagName.toLowerCase();if(typeof i.className=="string"&&i.className){const w=i.className.split(/\s+/).map(L=>L.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(L=>L.length>2&&!/^[a-z]{1,2}$/.test(L));w&&(y=`.${w}`)}const m=i.children.length,D=m>h.length+1?` (${m} total in ${y})`:"";return h.join(", ")+D}function Ll(r){const i=r.className;return typeof i!="string"||!i?"":i.split(/\s+/).filter(d=>d.length>0).map(d=>{const p=d.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);return p?p[1]:d}).filter((d,p,h)=>h.indexOf(d)===p).join(", ")}var pf=new Set(["none","normal","auto","0px","rgba(0, 0, 0, 0)","transparent","static","visible"]),Ch=new Set(["p","span","h1","h2","h3","h4","h5","h6","label","li","td","th","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","a","time","cite","q"]),Sh=new Set(["input","textarea","select"]),jh=new Set(["img","video","canvas","svg"]),Eh=new Set(["div","section","article","nav","header","footer","aside","main","ul","ol","form","fieldset"]);function Zs(r){if(typeof window>"u")return{};const i=window.getComputedStyle(r),a={},d=r.tagName.toLowerCase();let p;Ch.has(d)?p=["color","fontSize","fontWeight","fontFamily","lineHeight"]:d==="button"||d==="a"&&r.getAttribute("role")==="button"?p=["backgroundColor","color","padding","borderRadius","fontSize"]:Sh.has(d)?p=["backgroundColor","color","padding","borderRadius","fontSize"]:jh.has(d)?p=["width","height","objectFit","borderRadius"]:Eh.has(d)?p=["display","padding","margin","gap","backgroundColor"]:p=["color","fontSize","margin","padding","backgroundColor"];for(const h of p){const f=h.replace(/([A-Z])/g,"-$1").toLowerCase(),y=i.getPropertyValue(f);y&&!pf.has(y)&&(a[h]=y)}return a}var Nh=["color","backgroundColor","borderColor","fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","textAlign","width","height","padding","margin","border","borderRadius","display","position","top","right","bottom","left","zIndex","flexDirection","justifyContent","alignItems","gap","opacity","visibility","overflow","boxShadow","transform"];function Js(r){if(typeof window>"u")return"";const i=window.getComputedStyle(r),a=[];for(const d of Nh){const p=d.replace(/([A-Z])/g,"-$1").toLowerCase(),h=i.getPropertyValue(p);h&&!pf.has(h)&&a.push(`${p}: ${h}`)}return a.join("; ")}function Ph(r){if(!r)return;const i={},a=r.split(";").map(d=>d.trim()).filter(Boolean);for(const d of a){const p=d.indexOf(":");if(p>0){const h=d.slice(0,p).trim(),f=d.slice(p+1).trim();h&&f&&(i[h]=f)}}return Object.keys(i).length>0?i:void 0}function qs(r){const i=[],a=r.getAttribute("role"),d=r.getAttribute("aria-label"),p=r.getAttribute("aria-describedby"),h=r.getAttribute("tabindex"),f=r.getAttribute("aria-hidden");return a&&i.push(`role="${a}"`),d&&i.push(`aria-label="${d}"`),p&&i.push(`aria-describedby="${p}"`),h&&i.push(`tabindex=${h}`),f==="true"&&i.push("aria-hidden"),r.matches("a, button, input, select, textarea, [tabindex]")&&i.push("focusable"),i.join(", ")}function ei(r){const i=[];let a=r;for(;a&&a.tagName.toLowerCase()!=="html";){const d=a.tagName.toLowerCase();let p=d;if(a.id)p=`${d}#${a.id}`;else if(a.className&&typeof a.className=="string"){const f=a.className.split(/\s+/).map(y=>y.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(y=>y.length>2);f&&(p=`${d}.${f}`)}const h=Hr(a);!a.parentElement&&h&&(p=`⟨shadow⟩ ${p}`),i.unshift(p),a=h}return i.join(" > ")}var ou="feedback-annotations-",hf=7;function ii(r){return`${ou}${r}`}function Qa(r){if(typeof window>"u")return[];try{const i=localStorage.getItem(ii(r));if(!i)return[];const a=JSON.parse(i),d=Date.now()-hf*24*60*60*1e3;return a.filter(p=>!p.timestamp||p.timestamp>d)}catch{return[]}}function _f(r,i){if(!(typeof window>"u"))try{localStorage.setItem(ii(r),JSON.stringify(i))}catch{}}function Rh(){const r=new Map;if(typeof window>"u")return r;try{const i=Date.now()-hf*24*60*60*1e3;for(let a=0;a<localStorage.length;a++){const d=localStorage.key(a);if(d!=null&&d.startsWith(ou)){const p=d.slice(ou.length),h=localStorage.getItem(d);if(h){const y=JSON.parse(h).filter(m=>!m.timestamp||m.timestamp>i);y.length>0&&r.set(p,y)}}}}catch{}return r}function Tl(r,i,a){const d=i.map(p=>({...p,_syncedTo:a}));_f(r,d)}var gf="agentation-session-";function iu(r){return`${gf}${r}`}function Lh(r){if(typeof window>"u")return null;try{return localStorage.getItem(iu(r))}catch{return null}}function Ga(r,i){if(!(typeof window>"u"))try{localStorage.setItem(iu(r),i)}catch{}}function Th(r){if(!(typeof window>"u"))try{localStorage.removeItem(iu(r))}catch{}}var yf=`${gf}toolbar-hidden`;function Ih(){if(typeof window>"u")return!1;try{return sessionStorage.getItem(yf)==="1"}catch{return!1}}function $h(r){if(!(typeof window>"u"))try{r&&sessionStorage.setItem(yf,"1")}catch{}}async function Ka(r,i){const a=await fetch(`${r}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:i})});if(!a.ok)throw new Error(`Failed to create session: ${a.status}`);return a.json()}async function Gd(r,i){const a=await fetch(`${r}/sessions/${i}`);if(!a.ok)throw new Error(`Failed to get session: ${a.status}`);return a.json()}async function ti(r,i,a){const d=await fetch(`${r}/sessions/${i}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!d.ok)throw new Error(`Failed to sync annotation: ${d.status}`);return d.json()}async function Mh(r,i,a){const d=await fetch(`${r}/annotations/${i}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!d.ok)throw new Error(`Failed to update annotation: ${d.status}`);return d.json()}async function Kd(r,i){const a=await fetch(`${r}/annotations/${i}`,{method:"DELETE"});if(!a.ok)throw new Error(`Failed to delete annotation: ${a.status}`)}var Ke={FunctionComponent:0,ClassComponent:1,IndeterminateComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,Fragment:7,Mode:8,ContextConsumer:9,ContextProvider:10,ForwardRef:11,Profiler:12,SuspenseComponent:13,MemoComponent:14,SimpleMemoComponent:15,LazyComponent:16,IncompleteClassComponent:17,DehydratedFragment:18,SuspenseListComponent:19,ScopeComponent:21,OffscreenComponent:22,LegacyHiddenComponent:23,CacheComponent:24,TracingMarkerComponent:25,HostHoistable:26,HostSingleton:27,IncompleteFunctionComponent:28,Throw:29,ViewTransitionComponent:30,ActivityComponent:31},Zd=new Set(["Component","PureComponent","Fragment","Suspense","Profiler","StrictMode","Routes","Route","Outlet","Root","ErrorBoundaryHandler","HotReload","Hot"]),Jd=[/Boundary$/,/BoundaryHandler$/,/Provider$/,/Consumer$/,/^(Inner|Outer)/,/Router$/,/^Client(Page|Segment|Root)/,/^Server(Root|Component|Render)/,/^RSC/,/Context$/,/^Hot(Reload)?$/,/^(Dev|React)(Overlay|Tools|Root)/,/Overlay$/,/Handler$/,/^With[A-Z]/,/Wrapper$/,/^Root$/],zh=[/Page$/,/View$/,/Screen$/,/Section$/,/Card$/,/List$/,/Item$/,/Form$/,/Modal$/,/Dialog$/,/Button$/,/Nav$/,/Header$/,/Footer$/,/Layout$/,/Panel$/,/Tab$/,/Menu$/];function Oh(r){const i=(r==null?void 0:r.mode)??"filtered";let a=Zd;if(r!=null&&r.skipExact){const d=r.skipExact instanceof Set?r.skipExact:new Set(r.skipExact);a=new Set([...Zd,...d])}return{maxComponents:(r==null?void 0:r.maxComponents)??6,maxDepth:(r==null?void 0:r.maxDepth)??30,mode:i,skipExact:a,skipPatterns:r!=null&&r.skipPatterns?[...Jd,...r.skipPatterns]:Jd,userPatterns:(r==null?void 0:r.userPatterns)??zh,filter:r==null?void 0:r.filter}}function Fh(r){return r.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/([A-Z])([A-Z][a-z])/g,"$1-$2").toLowerCase()}function Dh(r,i=10){const a=new Set;let d=r,p=0;for(;d&&p<i;)d.className&&typeof d.className=="string"&&d.className.split(/\s+/).forEach(h=>{if(h.length>1){const f=h.replace(/[_][a-zA-Z0-9]{5,}.*$/,"").toLowerCase();f.length>1&&a.add(f)}}),d=d.parentElement,p++;return a}function Ah(r,i){const a=Fh(r);for(const d of i){if(d===a)return!0;const p=a.split("-").filter(f=>f.length>2),h=d.split("-").filter(f=>f.length>2);for(const f of p)for(const y of h)if(f===y||f.includes(y)||y.includes(f))return!0}return!1}function Bh(r,i,a,d){if(a.filter)return a.filter(r,i);switch(a.mode){case"all":return!0;case"filtered":return!(a.skipExact.has(r)||a.skipPatterns.some(p=>p.test(r)));case"smart":return a.skipExact.has(r)||a.skipPatterns.some(p=>p.test(r))?!1:!!(d&&Ah(r,d)||a.userPatterns.some(p=>p.test(r)));default:return!0}}var Br=null,Wh=new WeakMap;function Za(r){return Object.keys(r).some(i=>i.startsWith("__reactFiber$")||i.startsWith("__reactInternalInstance$")||i.startsWith("__reactProps$"))}function Yh(){if(Br!==null)return Br;if(typeof document>"u")return!1;if(document.body&&Za(document.body))return Br=!0,!0;const r=["#root","#app","#__next","[data-reactroot]"];for(const i of r){const a=document.querySelector(i);if(a&&Za(a))return Br=!0,!0}if(document.body){for(const i of document.body.children)if(Za(i))return Br=!0,!0}return Br=!1,!1}var Il={map:Wh};function Hh(r){return Object.keys(r).find(a=>a.startsWith("__reactFiber$")||a.startsWith("__reactInternalInstance$"))||null}function Uh(r){const i=Hh(r);return i?r[i]:null}function er(r){return r?r.displayName?r.displayName:r.name?r.name:null:null}function Vh(r){var p;const{tag:i,type:a,elementType:d}=r;if(i===Ke.HostComponent||i===Ke.HostText||i===Ke.HostHoistable||i===Ke.HostSingleton||i===Ke.Fragment||i===Ke.Mode||i===Ke.Profiler||i===Ke.DehydratedFragment||i===Ke.HostRoot||i===Ke.HostPortal||i===Ke.ScopeComponent||i===Ke.OffscreenComponent||i===Ke.LegacyHiddenComponent||i===Ke.CacheComponent||i===Ke.TracingMarkerComponent||i===Ke.Throw||i===Ke.ViewTransitionComponent||i===Ke.ActivityComponent)return null;if(i===Ke.ForwardRef){const h=d;if(h!=null&&h.render){const f=er(h.render);if(f)return f}return h!=null&&h.displayName?h.displayName:er(a)}if(i===Ke.MemoComponent||i===Ke.SimpleMemoComponent){const h=d;if(h!=null&&h.type){const f=er(h.type);if(f)return f}return h!=null&&h.displayName?h.displayName:er(a)}if(i===Ke.ContextProvider){const h=a;return(p=h==null?void 0:h._context)!=null&&p.displayName?`${h._context.displayName}.Provider`:null}if(i===Ke.ContextConsumer){const h=a;return h!=null&&h.displayName?`${h.displayName}.Consumer`:null}if(i===Ke.LazyComponent){const h=d;return(h==null?void 0:h._status)===1&&h._result?er(h._result):null}return i===Ke.SuspenseComponent||i===Ke.SuspenseListComponent?null:i===Ke.IncompleteClassComponent||i===Ke.IncompleteFunctionComponent||i===Ke.FunctionComponent||i===Ke.ClassComponent||i===Ke.IndeterminateComponent?er(a):null}function Xh(r){return r.length<=2||r.length<=3&&r===r.toLowerCase()}function Qh(r,i){const a=Oh(i),d=a.mode==="all";if(d){const m=Il.map.get(r);if(m!==void 0)return m}if(!Yh()){const m={path:null,components:[]};return d&&Il.map.set(r,m),m}const p=a.mode==="smart"?Dh(r):void 0,h=[];try{let m=Uh(r),D=0;for(;m&&D<a.maxDepth&&h.length<a.maxComponents;){const w=Vh(m);w&&!Xh(w)&&Bh(w,D,a,p)&&h.push(w),m=m.return,D++}}catch{const m={path:null,components:[]};return d&&Il.map.set(r,m),m}if(h.length===0){const m={path:null,components:[]};return d&&Il.map.set(r,m),m}const y={path:h.slice().reverse().map(m=>`<${m}>`).join(" "),components:h};return d&&Il.map.set(r,y),y}var $l={FunctionComponent:0,IndeterminateComponent:2,ForwardRef:11,MemoComponent:14,SimpleMemoComponent:15};function Gh(r){if(!r||typeof r!="object")return null;const i=Object.keys(r),a=i.find(h=>h.startsWith("__reactFiber$"));if(a)return r[a]||null;const d=i.find(h=>h.startsWith("__reactInternalInstance$"));if(d)return r[d]||null;const p=i.find(h=>{if(!h.startsWith("__react"))return!1;const f=r[h];return f&&typeof f=="object"&&"_debugSource"in f});return p&&r[p]||null}function Dl(r){if(!r.type||typeof r.type=="string")return null;if(typeof r.type=="object"||typeof r.type=="function"){const i=r.type;if(i.displayName)return i.displayName;if(i.name)return i.name}return null}function Kh(r,i=50){var p;let a=r,d=0;for(;a&&d<i;){if(a._debugSource)return{source:a._debugSource,componentName:Dl(a)};if((p=a._debugOwner)!=null&&p._debugSource)return{source:a._debugOwner._debugSource,componentName:Dl(a._debugOwner)};a=a.return,d++}return null}function Zh(r){let i=r,a=0;const d=50;for(;i&&a<d;){const p=i,h=["_debugSource","__source","_source","debugSource"];for(const f of h){const y=p[f];if(y&&typeof y=="object"&&"fileName"in y)return{source:y,componentName:Dl(i)}}if(i.memoizedProps){const f=i.memoizedProps;if(f.__source&&typeof f.__source=="object"){const y=f.__source;if(y.fileName&&y.lineNumber)return{source:{fileName:y.fileName,lineNumber:y.lineNumber,columnNumber:y.columnNumber},componentName:Dl(i)}}}i=i.return,a++}return null}var ni=new Map;function Jh(r){var p;const i=r.tag,a=r.type,d=r.elementType;if(typeof a=="string"||a==null||typeof a=="function"&&((p=a.prototype)!=null&&p.isReactComponent))return null;if((i===$l.FunctionComponent||i===$l.IndeterminateComponent)&&typeof a=="function")return a;if(i===$l.ForwardRef&&d){const h=d.render;if(typeof h=="function")return h}if((i===$l.MemoComponent||i===$l.SimpleMemoComponent)&&d){const h=d.type;if(typeof h=="function")return h}return typeof a=="function"?a:null}function qh(){const r=of,i=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;if(i&&"H"in i)return{get:()=>i.H,set:d=>{i.H=d}};const a=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;if(a){const d=a.ReactCurrentDispatcher;if(d&&"current"in d)return{get:()=>d.current,set:p=>{d.current=p}}}return null}function e_(r){const i=r.split(`
`),a=[/source-location/,/\/dist\/index\./,/node_modules\//,/react-dom/,/react\.development/,/react\.production/,/chunk-[A-Z0-9]+/i,/react-stack-bottom-frame/,/react-reconciler/,/scheduler/,/<anonymous>/],d=/^\s*at\s+(?:.*?\s+\()?(.+?):(\d+):(\d+)\)?$/,p=/^[^@]*@(.+?):(\d+):(\d+)$/;for(const h of i){const f=h.trim();if(!f||a.some(m=>m.test(f)))continue;const y=d.exec(f)||p.exec(f);if(y)return{fileName:y[1],line:parseInt(y[2],10),column:parseInt(y[3],10)}}return null}function t_(r){let i=r;return i=i.replace(/[?#].*$/,""),i=i.replace(/^turbopack:\/\/\/\[project\]\//,""),i=i.replace(/^webpack-internal:\/\/\/\.\//,""),i=i.replace(/^webpack-internal:\/\/\//,""),i=i.replace(/^webpack:\/\/\/\.\//,""),i=i.replace(/^webpack:\/\/\//,""),i=i.replace(/^turbopack:\/\/\//,""),i=i.replace(/^https?:\/\/[^/]+\//,""),i=i.replace(/^file:\/\/\//,"/"),i=i.replace(/^\([^)]+\)\/\.\//,""),i=i.replace(/^\.\//,""),i}function n_(r){const i=Jh(r);if(!i)return null;if(ni.has(i))return ni.get(i);const a=qh();if(!a)return ni.set(i,null),null;const d=a.get();let p=null;try{const h=new Proxy({},{get(){throw new Error("probe")}});a.set(h);try{i({})}catch(f){if(f instanceof Error&&f.message==="probe"&&f.stack){const y=e_(f.stack);y&&(p={fileName:t_(y.fileName),lineNumber:y.line,columnNumber:y.column,componentName:Dl(r)||void 0})}}}finally{a.set(d)}return ni.set(i,p),p}function o_(r,i=15){let a=r,d=0;for(;a&&d<i;){const p=n_(a);if(p)return p;a=a.return,d++}return null}function ru(r){const i=Gh(r);if(!i)return{found:!1,reason:"no-fiber",isReactApp:!1,isProduction:!1};let a=Kh(i);if(a||(a=Zh(i)),a!=null&&a.source)return{found:!0,source:{fileName:a.source.fileName,lineNumber:a.source.lineNumber,columnNumber:a.source.columnNumber,componentName:a.componentName||void 0},isReactApp:!0,isProduction:!1};const d=o_(i);return d?{found:!0,source:d,isReactApp:!0,isProduction:!1}:{found:!1,reason:"no-debug-source",isReactApp:!0,isProduction:!1}}function r_(r,i="path"){const{fileName:a,lineNumber:d,columnNumber:p}=r;let h=`${a}:${d}`;return p!==void 0&&(h+=`:${p}`),i==="vscode"?`vscode://file${a.startsWith("/")?"":"/"}${h}`:h}function l_(r,i=10){let a=r,d=0;for(;a&&d<i;){const p=ru(a);if(p.found)return p;a=a.parentElement,d++}return ru(r)}var s_=`svg[fill=none] {
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
}`,i_={toolbar:"styles-module__toolbar___wNsdK",toolbarContainer:"styles-module__toolbarContainer___dIhma",dragging:"styles-module__dragging___xrolZ",entrance:"styles-module__entrance___sgHd8",toolbarEnter:"styles-module__toolbarEnter___u8RRu",hiding:"styles-module__hiding___1td44",toolbarHide:"styles-module__toolbarHide___y8kaT",collapsed:"styles-module__collapsed___Rydsn",expanded:"styles-module__expanded___ofKPx",serverConnected:"styles-module__serverConnected___Gfbou",toggleContent:"styles-module__toggleContent___0yfyP",visible:"styles-module__visible___KHwEW",hidden:"styles-module__hidden___Ae8H4",controlsContent:"styles-module__controlsContent___9GJWU",badge:"styles-module__badge___2XsgF",fadeOut:"styles-module__fadeOut___6Ut6-",badgeEnter:"styles-module__badgeEnter___mVQLj",controlButton:"styles-module__controlButton___8Q0jc",statusShowing:"styles-module__statusShowing___te6iu",buttonBadge:"styles-module__buttonBadge___NeFWb",light:"styles-module__light___r6n4Y",mcpIndicator:"styles-module__mcpIndicator___zGJeL",connected:"styles-module__connected___7c28g",mcpIndicatorPulseConnected:"styles-module__mcpIndicatorPulseConnected___EDodZ",connecting:"styles-module__connecting___uo-CW",mcpIndicatorPulseConnecting:"styles-module__mcpIndicatorPulseConnecting___cCYte",connectionIndicatorWrapper:"styles-module__connectionIndicatorWrapper___L-e-3",connectionIndicator:"styles-module__connectionIndicator___afk9p",connectionIndicatorVisible:"styles-module__connectionIndicatorVisible___C-i5B",connectionIndicatorConnected:"styles-module__connectionIndicatorConnected___IY8pR",connectionPulse:"styles-module__connectionPulse___-Zycw",connectionIndicatorDisconnected:"styles-module__connectionIndicatorDisconnected___kmpaZ",connectionIndicatorConnecting:"styles-module__connectionIndicatorConnecting___QmSLH",buttonWrapper:"styles-module__buttonWrapper___rBcdv",buttonTooltip:"styles-module__buttonTooltip___Burd9",tooltipsInSession:"styles-module__tooltipsInSession___-0lHH",sendButtonWrapper:"styles-module__sendButtonWrapper___UUxG6",sendButtonVisible:"styles-module__sendButtonVisible___WPSQU",shortcut:"styles-module__shortcut___lEAQk",tooltipBelow:"styles-module__tooltipBelow___m6ats",tooltipsHidden:"styles-module__tooltipsHidden___VtLJG",tooltipVisible:"styles-module__tooltipVisible___0jcCv",buttonWrapperAlignLeft:"styles-module__buttonWrapperAlignLeft___myzIp",buttonWrapperAlignRight:"styles-module__buttonWrapperAlignRight___HCQFR",divider:"styles-module__divider___c--s1",overlay:"styles-module__overlay___Q1O9y",hoverHighlight:"styles-module__hoverHighlight___ogakW",enter:"styles-module__enter___WFIki",hoverHighlightIn:"styles-module__hoverHighlightIn___6WYHY",multiSelectOutline:"styles-module__multiSelectOutline___cSJ-m",fadeIn:"styles-module__fadeIn___b9qmf",exit:"styles-module__exit___fyOJ0",singleSelectOutline:"styles-module__singleSelectOutline___QhX-O",hoverTooltip:"styles-module__hoverTooltip___bvLk7",hoverTooltipIn:"styles-module__hoverTooltipIn___FYGQx",hoverReactPath:"styles-module__hoverReactPath___gx1IJ",hoverElementName:"styles-module__hoverElementName___QMLMl",markersLayer:"styles-module__markersLayer___-25j1",fixedMarkersLayer:"styles-module__fixedMarkersLayer___ffyX6",marker:"styles-module__marker___6sQrs",clearing:"styles-module__clearing___FQ--7",markerIn:"styles-module__markerIn___5FaAP",markerOut:"styles-module__markerOut___GU5jX",pending:"styles-module__pending___2IHLC",fixed:"styles-module__fixed___dBMHC",multiSelect:"styles-module__multiSelect___YWiuz",hovered:"styles-module__hovered___ZgXIy",renumber:"styles-module__renumber___nCTxD",renumberRoll:"styles-module__renumberRoll___Wgbq3",markerTooltip:"styles-module__markerTooltip___aLJID",tooltipIn:"styles-module__tooltipIn___0N31w",markerQuote:"styles-module__markerQuote___FHmrz",markerNote:"styles-module__markerNote___QkrrS",markerHint:"styles-module__markerHint___2iF-6",settingsPanel:"styles-module__settingsPanel___OxX3Y",settingsHeader:"styles-module__settingsHeader___pwDY9",settingsBrand:"styles-module__settingsBrand___0gJeM",settingsBrandSlash:"styles-module__settingsBrandSlash___uTG18",settingsVersion:"styles-module__settingsVersion___TUcFq",settingsSection:"styles-module__settingsSection___m-YM2",settingsLabel:"styles-module__settingsLabel___8UjfX",cycleButton:"styles-module__cycleButton___FMKfw",cycleDot:"styles-module__cycleDot___nPgLY",dropdownButton:"styles-module__dropdownButton___16NPz",toggleLabel:"styles-module__toggleLabel___Xm8Aa",customCheckbox:"styles-module__customCheckbox___U39ax",sliderLabel:"styles-module__sliderLabel___U8sPr",slider:"styles-module__slider___GLdxp",helpIcon:"styles-module__helpIcon___xQg56",themeToggle:"styles-module__themeToggle___2rUjA",dark:"styles-module__dark___ILIQf",settingsOption:"styles-module__settingsOption___UNa12",selected:"styles-module__selected___OwRqP",settingsPanelContainer:"styles-module__settingsPanelContainer___Xksv8",transitioning:"styles-module__transitioning___qxzCk",settingsPage:"styles-module__settingsPage___6YfHH",slideLeft:"styles-module__slideLeft___Ps01J",automationsPage:"styles-module__automationsPage___uvCq6",slideIn:"styles-module__slideIn___4-qXe",settingsNavLink:"styles-module__settingsNavLink___wCzJt",settingsNavLinkRight:"styles-module__settingsNavLinkRight___ZWwhj",mcpNavIndicator:"styles-module__mcpNavIndicator___cl9pO",mcpPulse:"styles-module__mcpPulse___uNggr",settingsBackButton:"styles-module__settingsBackButton___bIe2j",automationHeader:"styles-module__automationHeader___InP0r",automationDescription:"styles-module__automationDescription___NKlmo",learnMoreLink:"styles-module__learnMoreLink___8xv-x",autoSendRow:"styles-module__autoSendRow___UblX5",autoSendLabel:"styles-module__autoSendLabel___icDc2",active:"styles-module__active___-zoN6",webhookUrlInput:"styles-module__webhookUrlInput___2375C",settingsSectionExtraPadding:"styles-module__settingsSectionExtraPadding___jdhFV",settingsSectionGrow:"styles-module__settingsSectionGrow___h-5HZ",settingsRow:"styles-module__settingsRow___3sdhc",settingsRowMarginTop:"styles-module__settingsRowMarginTop___zA0Sp",dropdownContainer:"styles-module__dropdownContainer___BVnxe",settingsRowDisabled:"styles-module__settingsRowDisabled___EgS0V",toggleSwitch:"styles-module__toggleSwitch___l4Ygm",cycleButtonText:"styles-module__cycleButtonText___fD1LR",cycleTextIn:"styles-module__cycleTextIn___Q6zJf",cycleDots:"styles-module__cycleDots___LWuoQ",dropdownMenu:"styles-module__dropdownMenu___k73ER",scaleIn:"styles-module__scaleIn___c-r1K",dropdownItem:"styles-module__dropdownItem___ylsLj",settingsLabelMarker:"styles-module__settingsLabelMarker___ewdtV",settingsOptions:"styles-module__settingsOptions___LyrBA",sliderContainer:"styles-module__sliderContainer___ducXj",sliderLabels:"styles-module__sliderLabels___FhLDB",colorOptions:"styles-module__colorOptions___iHCNX",colorOption:"styles-module__colorOption___IodiY",colorOptionRing:"styles-module__colorOptionRing___U2xpo",settingsToggle:"styles-module__settingsToggle___fBrFn",settingsToggleMarginBottom:"styles-module__settingsToggleMarginBottom___MZUyF",checked:"styles-module__checked___mnZLo",toggleSlider:"styles-module__toggleSlider___wprIn",disabled:"styles-module__disabled___332Jw",mcpStatusDot:"styles-module__mcpStatusDot___ibgkc",disconnected:"styles-module__disconnected___cHPxR",mcpPulseError:"styles-module__mcpPulseError___fov9B",helpIconNudgeDown:"styles-module__helpIconNudgeDown___0cqpM",helpIconNoNudge:"styles-module__helpIconNoNudge___abogC","helpIconNudge1-5":"styles-module__helpIconNudge1-5___DM2TQ",helpIconNudge2:"styles-module__helpIconNudge2___TfWgC",dragSelection:"styles-module__dragSelection___kZLq2",dragCount:"styles-module__dragCount___KM90j",highlightsContainer:"styles-module__highlightsContainer___-0xzG",selectedElementHighlight:"styles-module__selectedElementHighlight___fyVlI",themeIconWrapper:"styles-module__themeIconWrapper___LsJIM",themeIcon:"styles-module__themeIcon___lCCmo",themeIconIn:"styles-module__themeIconIn___TU6ML",scaleOut:"styles-module__scaleOut___Wctwz",slideUp:"styles-module__slideUp___kgD36",slideDown:"styles-module__slideDown___zcdje",settingsPanelIn:"styles-module__settingsPanelIn___MGfO8",settingsPanelOut:"styles-module__settingsPanelOut___Zfymi"};if(typeof document<"u"){let r=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");r||(r=document.createElement("style"),r.id="feedback-tool-styles-page-toolbar-css-styles",r.textContent=s_,document.head.appendChild(r))}var k=i_;function Ja(r,i="filtered"){const{name:a,path:d}=si(r);if(i==="off")return{name:a,elementName:a,path:d,reactComponents:null};const p=Qh(r,{mode:i});return{name:p.path?`${p.path} ${a}`:a,elementName:a,path:d,reactComponents:p.path}}var qd=!1,ef={outputDetail:"standard",autoClearAfterCopy:!1,annotationColor:"#3c82f7",blockInteractions:!0,reactEnabled:!0,markerClickBehavior:"edit",webhookUrl:"",webhooksEnabled:!0},Bn=r=>{if(!r||!r.trim())return!1;try{const i=new URL(r.trim());return i.protocol==="http:"||i.protocol==="https:"}catch{return!1}},Ml=[{value:"compact",label:"Compact"},{value:"standard",label:"Standard"},{value:"detailed",label:"Detailed"},{value:"forensic",label:"Forensic"}],a_=[{value:"#AF52DE",label:"Purple"},{value:"#3c82f7",label:"Blue"},{value:"#5AC8FA",label:"Cyan"},{value:"#34C759",label:"Green"},{value:"#FFD60A",label:"Yellow"},{value:"#FF9500",label:"Orange"},{value:"#FF3B30",label:"Red"}];function Wr(r,i){let a=document.elementFromPoint(r,i);if(!a)return null;for(;a!=null&&a.shadowRoot;){const d=a.shadowRoot.elementFromPoint(r,i);if(!d||d===a)break;a=d}return a}function qa(r){let i=r;for(;i&&i!==document.body;){const d=window.getComputedStyle(i).position;if(d==="fixed"||d==="sticky")return!0;i=i.parentElement}return!1}function Eo(r){return r.status!=="resolved"&&r.status!=="dismissed"}function oi(r){const i=ru(r),a=i.found?i:l_(r);if(a.found&&a.source)return r_(a.source,"path")}function tf(r,i,a="standard",d="filtered"){if(r.length===0)return"";const p=typeof window<"u"?`${window.innerWidth}×${window.innerHeight}`:"unknown";let h=`## Page Feedback: ${i}
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
`,r.forEach((f,y)=>{a==="compact"?(h+=`${y+1}. **${f.element}**${f.sourceFile?` (${f.sourceFile})`:""}: ${f.comment}`,f.selectedText&&(h+=` (re: "${f.selectedText.slice(0,30)}${f.selectedText.length>30?"...":""}")`),h+=`
`):a==="forensic"?(h+=`### ${y+1}. ${f.element}
`,f.isMultiSelect&&f.fullPath&&(h+=`*Forensic data shown for first element of selection*
`),f.fullPath&&(h+=`**Full DOM Path:** ${f.fullPath}
`),f.cssClasses&&(h+=`**CSS Classes:** ${f.cssClasses}
`),f.boundingBox&&(h+=`**Position:** x:${Math.round(f.boundingBox.x)}, y:${Math.round(f.boundingBox.y)} (${Math.round(f.boundingBox.width)}×${Math.round(f.boundingBox.height)}px)
`),h+=`**Annotation at:** ${f.x.toFixed(1)}% from left, ${Math.round(f.y)}px from top
`,f.selectedText&&(h+=`**Selected text:** "${f.selectedText}"
`),f.nearbyText&&!f.selectedText&&(h+=`**Context:** ${f.nearbyText.slice(0,100)}
`),f.computedStyles&&(h+=`**Computed Styles:** ${f.computedStyles}
`),f.accessibility&&(h+=`**Accessibility:** ${f.accessibility}
`),f.nearbyElements&&(h+=`**Nearby Elements:** ${f.nearbyElements}
`),f.sourceFile&&(h+=`**Source:** ${f.sourceFile}
`),f.reactComponents&&(h+=`**React:** ${f.reactComponents}
`),h+=`**Feedback:** ${f.comment}

`):(h+=`### ${y+1}. ${f.element}
`,h+=`**Location:** ${f.elementPath}
`,f.sourceFile&&(h+=`**Source:** ${f.sourceFile}
`),f.reactComponents&&(h+=`**React:** ${f.reactComponents}
`),a==="detailed"&&(f.cssClasses&&(h+=`**Classes:** ${f.cssClasses}
`),f.boundingBox&&(h+=`**Position:** ${Math.round(f.boundingBox.x)}px, ${Math.round(f.boundingBox.y)}px (${Math.round(f.boundingBox.width)}×${Math.round(f.boundingBox.height)}px)
`)),f.selectedText&&(h+=`**Selected text:** "${f.selectedText}"
`),a==="detailed"&&f.nearbyText&&!f.selectedText&&(h+=`**Context:** ${f.nearbyText.slice(0,100)}
`),h+=`**Feedback:** ${f.comment}

`)}),h.trim()}function u_({demoAnnotations:r,demoDelay:i=1e3,enableDemoMode:a=!1,onAnnotationAdd:d,onAnnotationDelete:p,onAnnotationUpdate:h,onAnnotationsClear:f,onCopy:y,onSubmit:m,copyToClipboard:D=!0,endpoint:w,sessionId:L,onSessionCreated:g,webhookUrl:j,className:b}={}){var Zn,Bo,ql;const[_,N]=C.useState(!1),[I,V]=C.useState([]),[ee,ie]=C.useState(!0),[le,re]=C.useState(()=>Ih()),[M,x]=C.useState(!1),K=C.useRef(null);C.useEffect(()=>{const v=Y=>{const Q=K.current;Q&&Q.contains(Y.target)&&Y.stopPropagation()},E=["mousedown","click","pointerdown"];return E.forEach(Y=>document.body.addEventListener(Y,v)),()=>{E.forEach(Y=>document.body.removeEventListener(Y,v))}},[]);const[ue,q]=C.useState(!1),[me,ze]=C.useState(!1),[Ae,We]=C.useState(null),[F,U]=C.useState({x:0,y:0}),[$,H]=C.useState(null),[X,R]=C.useState(!1),[A,ce]=C.useState("idle"),[we,W]=C.useState(!1),[ve,ke]=C.useState(!1),[Le,Ue]=C.useState(null),[Nt,an]=C.useState(null),[Ur,En]=C.useState([]),[tr,Vr]=C.useState(null),[No,nr]=C.useState(null),[Me,Yn]=C.useState(null),[Hn,It]=C.useState(null),[or,Nn]=C.useState([]),[Pn,Xr]=C.useState(0),[Qr,rr]=C.useState(!1),[nt,Bl]=C.useState(!1),[Pt,so]=C.useState(!1),[Po,lr]=C.useState(!1),[Wl,Yl]=C.useState(!1),[Ro,Lo]=C.useState("main"),[sr,ir]=C.useState(!1),[Gr,Rn]=C.useState(!1),[Un,Kr]=C.useState(!1),Vn=C.useRef(null),[ut,Xn]=C.useState([]),qt=C.useRef({cmd:!1,shift:!1}),Ct=()=>{Rn(!0)},Hl=()=>{Rn(!1)},To=()=>{Un||(Vn.current=setTimeout(()=>Kr(!0),850))},Zr=()=>{Vn.current&&(clearTimeout(Vn.current),Vn.current=null),Kr(!1),Hl()};C.useEffect(()=>()=>{Vn.current&&clearTimeout(Vn.current)},[]);const un=({content:v,children:E})=>{const[Y,Q]=C.useState(!1),[G,te]=C.useState(!1),[_e,he]=C.useState(!1),[Ce,Te]=C.useState({top:0,right:0}),Se=C.useRef(null),Re=C.useRef(null),je=C.useRef(null),Pe=()=>{if(Se.current){const gt=Se.current.getBoundingClientRect();Te({top:gt.top+gt.height/2,right:window.innerWidth-gt.left+8})}},ge=()=>{Q(!0),he(!0),je.current&&(clearTimeout(je.current),je.current=null),Pe(),Re.current=Ve(()=>{te(!0)},500)},_t=()=>{Q(!1),Re.current&&(clearTimeout(Re.current),Re.current=null),te(!1),je.current=Ve(()=>{he(!1)},150)};return C.useEffect(()=>()=>{Re.current&&clearTimeout(Re.current),je.current&&clearTimeout(je.current)},[]),l.jsxs(l.Fragment,{children:[l.jsx("span",{ref:Se,onMouseEnter:ge,onMouseLeave:_t,children:E}),_e&&Hd.createPortal(l.jsx("div",{"data-feedback-toolbar":!0,style:{position:"fixed",top:Ce.top,right:Ce.right,transform:"translateY(-50%)",padding:"6px 10px",background:"#383838",color:"rgba(255, 255, 255, 0.7)",fontSize:"11px",fontWeight:400,lineHeight:"14px",borderRadius:"10px",width:"180px",textAlign:"left",zIndex:100020,pointerEvents:"none",boxShadow:"0px 1px 8px rgba(0, 0, 0, 0.28)",opacity:G&&!sr?1:0,transition:"opacity 0.15s ease"},children:v}),document.body)]})},[de,Yt]=C.useState(ef),[$e,Io]=C.useState(!0),[ar,Ul]=C.useState(!1),Vl=!1,gn="off",[pt,ur]=C.useState(L??null),Jr=C.useRef(!1),[Rt,Ln]=C.useState(w?"connecting":"disconnected"),[Ze,cr]=C.useState(null),[cn,Xl]=C.useState(!1),[io,lt]=C.useState(null),[ci,qr]=C.useState(0),dr=C.useRef(!1),[$o,Mo]=C.useState(new Set),[el,Qn]=C.useState(new Set),[$t,fr]=C.useState(!1),[en,ao]=C.useState(!1),[yn,Ql]=C.useState(!1),xn=C.useRef(null),At=C.useRef(null),vn=C.useRef(null),Tn=C.useRef(null),mr=C.useRef(!1),Gl=C.useRef(0),uo=C.useRef(null),tl=C.useRef(null),zo=8,Oo=50,Kl=C.useRef(null),pr=C.useRef(null),He=C.useRef(null),Je=typeof window<"u"?window.location.pathname:"/";C.useEffect(()=>{if(Po)Yl(!0);else{Rn(!1),Lo("main");const v=Ve(()=>Yl(!1),0);return()=>clearTimeout(v)}},[Po]),C.useEffect(()=>{ir(!0);const v=Ve(()=>ir(!1),350);return()=>clearTimeout(v)},[Ro]);const nl=_&&ee;C.useEffect(()=>{if(nl){ze(!1),q(!0),Mo(new Set);const v=Ve(()=>{Mo(E=>{const Y=new Set(E);return I.forEach(Q=>Y.add(Q.id)),Y})},350);return()=>clearTimeout(v)}else if(ue){ze(!0);const v=Ve(()=>{q(!1),ze(!1)},250);return()=>clearTimeout(v)}},[nl]),C.useEffect(()=>{Bl(!0),Xr(window.scrollY);const v=Qa(Je);V(v.filter(Eo)),qd||(Ul(!0),qd=!0,Ve(()=>Ul(!1),750));try{const E=localStorage.getItem("feedback-toolbar-settings");E&&Yt({...ef,...JSON.parse(E)})}catch{}try{const E=localStorage.getItem("feedback-toolbar-theme");E!==null&&Io(E==="dark")}catch{}try{const E=localStorage.getItem("feedback-toolbar-position");if(E){const Y=JSON.parse(E);typeof Y.x=="number"&&typeof Y.y=="number"&&cr(Y)}}catch{}},[Je]),C.useEffect(()=>{nt&&localStorage.setItem("feedback-toolbar-settings",JSON.stringify(de))},[de,nt]),C.useEffect(()=>{nt&&localStorage.setItem("feedback-toolbar-theme",$e?"dark":"light")},[$e,nt]);const hr=C.useRef(!1);C.useEffect(()=>{const v=hr.current;hr.current=cn,v&&!cn&&Ze&&nt&&localStorage.setItem("feedback-toolbar-position",JSON.stringify(Ze))},[cn,Ze,nt]),C.useEffect(()=>{if(!w||!nt||Jr.current)return;Jr.current=!0,Ln("connecting"),(async()=>{try{const E=Lh(Je),Y=L||E;let Q=!1;if(Y)try{const G=await Gd(w,Y);ur(G.id),Ln("connected"),Ga(Je,G.id),Q=!0;const te=Qa(Je),_e=new Set(G.annotations.map(Ce=>Ce.id)),he=te.filter(Ce=>!_e.has(Ce.id));if(he.length>0){const Te=`${typeof window<"u"?window.location.origin:""}${Je}`,Re=(await Promise.allSettled(he.map(Pe=>ti(w,G.id,{...Pe,sessionId:G.id,url:Te})))).map((Pe,ge)=>Pe.status==="fulfilled"?Pe.value:(console.warn("[Agentation] Failed to sync annotation:",Pe.reason),he[ge])),je=[...G.annotations,...Re];V(je.filter(Eo)),Tl(Je,je.filter(Eo),G.id)}else V(G.annotations.filter(Eo)),Tl(Je,G.annotations.filter(Eo),G.id)}catch(G){console.warn("[Agentation] Could not join session, creating new:",G),Th(Je)}if(!Q){const G=typeof window<"u"?window.location.href:"/",te=await Ka(w,G);ur(te.id),Ln("connected"),Ga(Je,te.id),g==null||g(te.id);const _e=Rh(),he=typeof window<"u"?window.location.origin:"",Ce=[];for(const[Te,Se]of _e){const Re=Se.filter(ge=>!ge._syncedTo);if(Re.length===0)continue;const je=`${he}${Te}`,Pe=Te===Je;Ce.push((async()=>{try{const ge=Pe?te:await Ka(w,je),on=(await Promise.allSettled(Re.map(st=>ti(w,ge.id,{...st,sessionId:ge.id,url:je})))).map((st,ft)=>st.status==="fulfilled"?st.value:(console.warn("[Agentation] Failed to sync annotation:",st.reason),Re[ft])).filter(Eo);if(Tl(Te,on,ge.id),Pe){const st=new Set(Re.map(ft=>ft.id));V(ft=>{const Oe=ft.filter(Fe=>!st.has(Fe.id));return[...on,...Oe]})}}catch(ge){console.warn(`[Agentation] Failed to sync annotations for ${Te}:`,ge)}})())}await Promise.allSettled(Ce)}}catch(E){Ln("disconnected"),console.warn("[Agentation] Failed to initialize session, using local storage:",E)}})()},[w,L,nt,g,Je]),C.useEffect(()=>{if(!w||!nt)return;const v=async()=>{try{(await fetch(`${w}/health`)).ok?Ln("connected"):Ln("disconnected")}catch{Ln("disconnected")}};v();const E=vh(v,1e4);return()=>clearInterval(E)},[w,nt]),C.useEffect(()=>{if(!w||!nt||!pt)return;const v=new EventSource(`${w}/sessions/${pt}/events`),E=["resolved","dismissed"],Y=Q=>{var G;try{const te=JSON.parse(Q.data);if(E.includes((G=te.payload)==null?void 0:G.status)){const _e=te.payload.id;Qn(he=>new Set(he).add(_e)),Ve(()=>{V(he=>he.filter(Ce=>Ce.id!==_e)),Qn(he=>{const Ce=new Set(he);return Ce.delete(_e),Ce})},150)}}catch{}};return v.addEventListener("annotation.updated",Y),()=>{v.removeEventListener("annotation.updated",Y),v.close()}},[w,nt,pt]),C.useEffect(()=>{if(!w||!nt)return;const v=tl.current==="disconnected",E=Rt==="connected";tl.current=Rt,v&&E&&(async()=>{try{const Q=Qa(Je);if(Q.length===0)return;const te=`${typeof window<"u"?window.location.origin:""}${Je}`;let _e=pt,he=[];if(_e)try{he=(await Gd(w,_e)).annotations}catch{_e=null}_e||(_e=(await Ka(w,te)).id,ur(_e),Ga(Je,_e));const Ce=new Set(he.map(Se=>Se.id)),Te=Q.filter(Se=>!Ce.has(Se.id));if(Te.length>0){const Re=(await Promise.allSettled(Te.map(ge=>ti(w,_e,{...ge,sessionId:_e,url:te})))).map((ge,_t)=>ge.status==="fulfilled"?ge.value:(console.warn("[Agentation] Failed to sync annotation on reconnect:",ge.reason),Te[_t])),Pe=[...he,...Re].filter(Eo);V(Pe),Tl(Je,Pe,_e)}}catch(Q){console.warn("[Agentation] Failed to sync on reconnect:",Q)}})()},[Rt,w,nt,pt,Je]);const Zl=C.useCallback(()=>{M||(x(!0),lr(!1),N(!1),Ve(()=>{$h(!0),re(!0),x(!1)},400))},[M]);C.useEffect(()=>{if(!a||!nt||!r||r.length===0||I.length>0)return;const v=[];return v.push(Ve(()=>{N(!0)},i-200)),r.forEach((E,Y)=>{const Q=i+Y*300;v.push(Ve(()=>{const G=document.querySelector(E.selector);if(!G)return;const te=G.getBoundingClientRect(),{name:_e,path:he}=si(G),Ce={id:`demo-${Date.now()}-${Y}`,x:(te.left+te.width/2)/window.innerWidth*100,y:te.top+te.height/2+window.scrollY,comment:E.comment,element:_e,elementPath:he,timestamp:Date.now(),selectedText:E.selectedText,boundingBox:{x:te.left,y:te.top+window.scrollY,width:te.width,height:te.height},nearbyText:Rl(G),cssClasses:Ll(G)};V(Te=>[...Te,Ce])},Q))}),()=>{v.forEach(clearTimeout)}},[a,nt,r,i]),C.useEffect(()=>{const v=()=>{Xr(window.scrollY),rr(!0),He.current&&clearTimeout(He.current),He.current=Ve(()=>{rr(!1)},150)};return window.addEventListener("scroll",v,{passive:!0}),()=>{window.removeEventListener("scroll",v),He.current&&clearTimeout(He.current)}},[]),C.useEffect(()=>{nt&&I.length>0?pt?Tl(Je,I,pt):_f(Je,I):nt&&I.length===0&&localStorage.removeItem(ii(Je))},[I,Je,nt,pt]);const ol=C.useCallback(()=>{Pt||(wh(),so(!0))},[Pt]),Fo=C.useCallback(()=>{Pt&&(Xd(),so(!1))},[Pt]),Do=C.useCallback(()=>{Pt?Fo():ol()},[Pt,ol,Fo]),Ao=C.useCallback(()=>{if(ut.length===0)return;const v=ut[0],E=v.element,Y=ut.length>1,Q=ut.map(G=>G.element.getBoundingClientRect());if(Y){const G={left:Math.min(...Q.map(ge=>ge.left)),top:Math.min(...Q.map(ge=>ge.top)),right:Math.max(...Q.map(ge=>ge.right)),bottom:Math.max(...Q.map(ge=>ge.bottom))},te=ut.slice(0,5).map(ge=>ge.name).join(", "),_e=ut.length>5?` +${ut.length-5} more`:"",he=Q.map(ge=>({x:ge.left,y:ge.top+window.scrollY,width:ge.width,height:ge.height})),Te=ut[ut.length-1].element,Se=Q[Q.length-1],Re=Se.left+Se.width/2,je=Se.top+Se.height/2,Pe=qa(Te);H({x:Re/window.innerWidth*100,y:Pe?je:je+window.scrollY,clientY:je,element:`${ut.length} elements: ${te}${_e}`,elementPath:"multi-select",boundingBox:{x:G.left,y:G.top+window.scrollY,width:G.right-G.left,height:G.bottom-G.top},isMultiSelect:!0,isFixed:Pe,elementBoundingBoxes:he,multiSelectElements:ut.map(ge=>ge.element),targetElement:Te,fullPath:ei(E),accessibility:qs(E),computedStyles:Js(E),computedStylesObj:Zs(E),nearbyElements:Ks(E),cssClasses:Ll(E),nearbyText:Rl(E),sourceFile:oi(E)})}else{const G=Q[0],te=qa(E);H({x:G.left/window.innerWidth*100,y:te?G.top:G.top+window.scrollY,clientY:G.top,element:v.name,elementPath:v.path,boundingBox:{x:G.left,y:te?G.top:G.top+window.scrollY,width:G.width,height:G.height},isFixed:te,fullPath:ei(E),accessibility:qs(E),computedStyles:Js(E),computedStylesObj:Zs(E),nearbyElements:Ks(E),cssClasses:Ll(E),nearbyText:Rl(E),reactComponents:v.reactComponents,sourceFile:oi(E)})}Xn([]),We(null)},[ut]);C.useEffect(()=>{_||(H(null),Yn(null),It(null),Nn([]),We(null),lr(!1),Xn([]),qt.current={cmd:!1,shift:!1},Pt&&Fo())},[_,Pt,Fo]),C.useEffect(()=>()=>{Xd()},[]),C.useEffect(()=>{if(!_)return;const v=document.createElement("style");return v.id="feedback-cursor-styles",v.textContent=`
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
    `,document.head.appendChild(v),()=>{const E=document.getElementById("feedback-cursor-styles");E&&E.remove()}},[_]),C.useEffect(()=>{if(!_||$)return;const v=E=>{const Y=E.composedPath()[0]||E.target;if(Jt(Y,"[data-feedback-toolbar]")){We(null);return}const Q=Wr(E.clientX,E.clientY);if(!Q||Jt(Q,"[data-feedback-toolbar]")){We(null);return}const{name:G,elementName:te,path:_e,reactComponents:he}=Ja(Q,gn),Ce=Q.getBoundingClientRect();We({element:G,elementName:te,elementPath:_e,rect:Ce,reactComponents:he}),U({x:E.clientX,y:E.clientY})};return document.addEventListener("mousemove",v),()=>document.removeEventListener("mousemove",v)},[_,$,gn]),C.useEffect(()=>{if(!_)return;const v=E=>{var gt,on;if(mr.current){mr.current=!1;return}const Y=E.composedPath()[0]||E.target;if(Jt(Y,"[data-feedback-toolbar]")||Jt(Y,"[data-annotation-popup]")||Jt(Y,"[data-annotation-marker]"))return;if(E.metaKey&&E.shiftKey&&!$&&!Me){E.preventDefault(),E.stopPropagation();const st=Wr(E.clientX,E.clientY);if(!st)return;const ft=st.getBoundingClientRect(),{name:Oe,path:Fe,reactComponents:Mt}=Ja(st,gn),it=ut.findIndex(Ht=>Ht.element===st);it>=0?Xn(Ht=>Ht.filter((Ut,xr)=>xr!==it)):Xn(Ht=>[...Ht,{element:st,rect:ft,name:Oe,path:Fe,reactComponents:Mt??void 0}]);return}const Q=Jt(Y,"button, a, input, select, textarea, [role='button'], [onclick]");if(de.blockInteractions&&Q&&(E.preventDefault(),E.stopPropagation()),$){if(Q&&!de.blockInteractions)return;E.preventDefault(),(gt=Kl.current)==null||gt.shake();return}if(Me){if(Q&&!de.blockInteractions)return;E.preventDefault(),(on=pr.current)==null||on.shake();return}E.preventDefault();const G=Wr(E.clientX,E.clientY);if(!G)return;const{name:te,path:_e,reactComponents:he}=Ja(G,gn),Ce=G.getBoundingClientRect(),Te=E.clientX/window.innerWidth*100,Se=qa(G),Re=Se?E.clientY:E.clientY+window.scrollY,je=window.getSelection();let Pe;je&&je.toString().trim().length>0&&(Pe=je.toString().trim().slice(0,500));const ge=Zs(G),_t=Js(G);H({x:Te,y:Re,clientY:E.clientY,element:te,elementPath:_e,selectedText:Pe,boundingBox:{x:Ce.left,y:Se?Ce.top:Ce.top+window.scrollY,width:Ce.width,height:Ce.height},nearbyText:Rl(G),cssClasses:Ll(G),isFixed:Se,fullPath:ei(G),accessibility:qs(G),computedStyles:_t,computedStylesObj:ge,nearbyElements:Ks(G),reactComponents:he??void 0,sourceFile:oi(G),targetElement:G}),We(null)};return document.addEventListener("click",v,!0),()=>document.removeEventListener("click",v,!0)},[_,$,Me,de.blockInteractions,gn,ut]),C.useEffect(()=>{if(!_)return;const v=Q=>{Q.key==="Meta"&&(qt.current.cmd=!0),Q.key==="Shift"&&(qt.current.shift=!0)},E=Q=>{const G=qt.current.cmd&&qt.current.shift;Q.key==="Meta"&&(qt.current.cmd=!1),Q.key==="Shift"&&(qt.current.shift=!1);const te=qt.current.cmd&&qt.current.shift;G&&!te&&ut.length>0&&Ao()},Y=()=>{qt.current={cmd:!1,shift:!1},Xn([])};return document.addEventListener("keydown",v),document.addEventListener("keyup",E),window.addEventListener("blur",Y),()=>{document.removeEventListener("keydown",v),document.removeEventListener("keyup",E),window.removeEventListener("blur",Y)}},[_,ut,Ao]),C.useEffect(()=>{if(!_||$)return;const v=E=>{const Y=E.composedPath()[0]||E.target;Jt(Y,"[data-feedback-toolbar]")||Jt(Y,"[data-annotation-marker]")||Jt(Y,"[data-annotation-popup]")||new Set(["P","SPAN","H1","H2","H3","H4","H5","H6","LI","TD","TH","LABEL","BLOCKQUOTE","FIGCAPTION","CAPTION","LEGEND","DT","DD","PRE","CODE","EM","STRONG","B","I","U","S","A","TIME","ADDRESS","CITE","Q","ABBR","DFN","MARK","SMALL","SUB","SUP"]).has(Y.tagName)||Y.isContentEditable||(xn.current={x:E.clientX,y:E.clientY})};return document.addEventListener("mousedown",v),()=>document.removeEventListener("mousedown",v)},[_,$]),C.useEffect(()=>{if(!_||$)return;const v=E=>{if(!xn.current)return;const Y=E.clientX-xn.current.x,Q=E.clientY-xn.current.y,G=Y*Y+Q*Q,te=zo*zo;if(!yn&&G>=te&&(At.current=xn.current,Ql(!0)),(yn||G>=te)&&At.current){if(vn.current){const Oe=Math.min(At.current.x,E.clientX),Fe=Math.min(At.current.y,E.clientY),Mt=Math.abs(E.clientX-At.current.x),it=Math.abs(E.clientY-At.current.y);vn.current.style.transform=`translate(${Oe}px, ${Fe}px)`,vn.current.style.width=`${Mt}px`,vn.current.style.height=`${it}px`}const _e=Date.now();if(_e-Gl.current<Oo)return;Gl.current=_e;const he=At.current.x,Ce=At.current.y,Te=Math.min(he,E.clientX),Se=Math.min(Ce,E.clientY),Re=Math.max(he,E.clientX),je=Math.max(Ce,E.clientY),Pe=(Te+Re)/2,ge=(Se+je)/2,_t=new Set,gt=[[Te,Se],[Re,Se],[Te,je],[Re,je],[Pe,ge],[Pe,Se],[Pe,je],[Te,ge],[Re,ge]];for(const[Oe,Fe]of gt){const Mt=document.elementsFromPoint(Oe,Fe);for(const it of Mt)it instanceof HTMLElement&&_t.add(it)}const on=document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav");for(const Oe of on)if(Oe instanceof HTMLElement){const Fe=Oe.getBoundingClientRect(),Mt=Fe.left+Fe.width/2,it=Fe.top+Fe.height/2,Ht=Mt>=Te&&Mt<=Re&&it>=Se&&it<=je,Ut=Math.min(Fe.right,Re)-Math.max(Fe.left,Te),xr=Math.min(Fe.bottom,je)-Math.max(Fe.top,Se),fi=Ut>0&&xr>0?Ut*xr:0,es=Fe.width*Fe.height,mi=es>0?fi/es:0;(Ht||mi>.5)&&_t.add(Oe)}const st=[],ft=new Set(["BUTTON","A","INPUT","IMG","P","H1","H2","H3","H4","H5","H6","LI","LABEL","TD","TH","SECTION","ARTICLE","ASIDE","NAV"]);for(const Oe of _t){if(Jt(Oe,"[data-feedback-toolbar]")||Jt(Oe,"[data-annotation-marker]"))continue;const Fe=Oe.getBoundingClientRect();if(!(Fe.width>window.innerWidth*.8&&Fe.height>window.innerHeight*.5)&&!(Fe.width<10||Fe.height<10)&&Fe.left<Re&&Fe.right>Te&&Fe.top<je&&Fe.bottom>Se){const Mt=Oe.tagName;let it=ft.has(Mt);if(!it&&(Mt==="DIV"||Mt==="SPAN")){const Ht=Oe.textContent&&Oe.textContent.trim().length>0,Ut=Oe.onclick!==null||Oe.getAttribute("role")==="button"||Oe.getAttribute("role")==="link"||Oe.classList.contains("clickable")||Oe.hasAttribute("data-clickable");(Ht||Ut)&&!Oe.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")&&(it=!0)}if(it){let Ht=!1;for(const Ut of st)if(Ut.left<=Fe.left&&Ut.right>=Fe.right&&Ut.top<=Fe.top&&Ut.bottom>=Fe.bottom){Ht=!0;break}Ht||st.push(Fe)}}}if(Tn.current){const Oe=Tn.current;for(;Oe.children.length>st.length;)Oe.removeChild(Oe.lastChild);st.forEach((Fe,Mt)=>{let it=Oe.children[Mt];it||(it=document.createElement("div"),it.className=k.selectedElementHighlight,Oe.appendChild(it)),it.style.transform=`translate(${Fe.left}px, ${Fe.top}px)`,it.style.width=`${Fe.width}px`,it.style.height=`${Fe.height}px`})}}};return document.addEventListener("mousemove",v,{passive:!0}),()=>document.removeEventListener("mousemove",v)},[_,$,yn,zo]),C.useEffect(()=>{if(!_)return;const v=E=>{const Y=yn,Q=At.current;if(yn&&Q){mr.current=!0;const G=Math.min(Q.x,E.clientX),te=Math.min(Q.y,E.clientY),_e=Math.max(Q.x,E.clientX),he=Math.max(Q.y,E.clientY),Ce=[];document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th").forEach(Pe=>{if(!(Pe instanceof HTMLElement)||Jt(Pe,"[data-feedback-toolbar]")||Jt(Pe,"[data-annotation-marker]"))return;const ge=Pe.getBoundingClientRect();ge.width>window.innerWidth*.8&&ge.height>window.innerHeight*.5||ge.width<10||ge.height<10||ge.left<_e&&ge.right>G&&ge.top<he&&ge.bottom>te&&Ce.push({element:Pe,rect:ge})});const Se=Ce.filter(({element:Pe})=>!Ce.some(({element:ge})=>ge!==Pe&&Pe.contains(ge))),Re=E.clientX/window.innerWidth*100,je=E.clientY+window.scrollY;if(Se.length>0){const Pe=Se.reduce((ft,{rect:Oe})=>({left:Math.min(ft.left,Oe.left),top:Math.min(ft.top,Oe.top),right:Math.max(ft.right,Oe.right),bottom:Math.max(ft.bottom,Oe.bottom)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0}),ge=Se.slice(0,5).map(({element:ft})=>si(ft).name).join(", "),_t=Se.length>5?` +${Se.length-5} more`:"",gt=Se[0].element,on=Zs(gt),st=Js(gt);H({x:Re,y:je,clientY:E.clientY,element:`${Se.length} elements: ${ge}${_t}`,elementPath:"multi-select",boundingBox:{x:Pe.left,y:Pe.top+window.scrollY,width:Pe.right-Pe.left,height:Pe.bottom-Pe.top},isMultiSelect:!0,fullPath:ei(gt),accessibility:qs(gt),computedStyles:st,computedStylesObj:on,nearbyElements:Ks(gt),cssClasses:Ll(gt),nearbyText:Rl(gt),sourceFile:oi(gt)})}else{const Pe=Math.abs(_e-G),ge=Math.abs(he-te);Pe>20&&ge>20&&H({x:Re,y:je,clientY:E.clientY,element:"Area selection",elementPath:`region at (${Math.round(G)}, ${Math.round(te)})`,boundingBox:{x:G,y:te+window.scrollY,width:Pe,height:ge},isMultiSelect:!0})}We(null)}else Y&&(mr.current=!0);xn.current=null,At.current=null,Ql(!1),Tn.current&&(Tn.current.innerHTML="")};return document.addEventListener("mouseup",v),()=>document.removeEventListener("mouseup",v)},[_,yn]);const bt=C.useCallback(async(v,E,Y)=>{const Q=de.webhookUrl||j;if(!Q||!de.webhooksEnabled&&!Y)return!1;try{return(await fetch(Q,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:v,timestamp:Date.now(),url:typeof window<"u"?window.location.href:void 0,...E})})).ok}catch(G){return console.warn("[Agentation] Webhook failed:",G),!1}},[j,de.webhookUrl,de.webhooksEnabled]),In=C.useCallback(v=>{var Y;if(!$)return;const E={id:Date.now().toString(),x:$.x,y:$.y,comment:v,element:$.element,elementPath:$.elementPath,timestamp:Date.now(),selectedText:$.selectedText,boundingBox:$.boundingBox,nearbyText:$.nearbyText,cssClasses:$.cssClasses,isMultiSelect:$.isMultiSelect,isFixed:$.isFixed,fullPath:$.fullPath,accessibility:$.accessibility,computedStyles:$.computedStyles,nearbyElements:$.nearbyElements,reactComponents:$.reactComponents,sourceFile:$.sourceFile,elementBoundingBoxes:$.elementBoundingBoxes,...w&&pt?{sessionId:pt,url:typeof window<"u"?window.location.href:void 0,status:"pending"}:{}};V(Q=>[...Q,E]),uo.current=E.id,Ve(()=>{uo.current=null},300),Ve(()=>{Mo(Q=>new Set(Q).add(E.id))},250),d==null||d(E),bt("annotation.add",{annotation:E}),fr(!0),Ve(()=>{H(null),fr(!1)},150),(Y=window.getSelection())==null||Y.removeAllRanges(),w&&pt&&ti(w,pt,E).then(Q=>{Q.id!==E.id&&(V(G=>G.map(te=>te.id===E.id?{...te,id:Q.id}:te)),Mo(G=>{const te=new Set(G);return te.delete(E.id),te.add(Q.id),te}))}).catch(Q=>{console.warn("[Agentation] Failed to sync annotation:",Q)})},[$,d,bt,w,pt]),$n=C.useCallback(()=>{fr(!0),Ve(()=>{H(null),fr(!1)},150)},[]),Gn=C.useCallback(v=>{const E=I.findIndex(Q=>Q.id===v),Y=I[E];(Me==null?void 0:Me.id)===v&&(ao(!0),Ve(()=>{Yn(null),It(null),Nn([]),ao(!1)},150)),Vr(v),Qn(Q=>new Set(Q).add(v)),Y&&(p==null||p(Y),bt("annotation.delete",{annotation:Y})),w&&Kd(w,v).catch(Q=>{console.warn("[Agentation] Failed to delete annotation from server:",Q)}),Ve(()=>{V(Q=>Q.filter(G=>G.id!==v)),Qn(Q=>{const G=new Set(Q);return G.delete(v),G}),Vr(null),E<I.length-1&&(nr(E),Ve(()=>nr(null),200))},150)},[I,Me,p,bt,w]),Mn=C.useCallback(v=>{var E;if(Yn(v),Ue(null),an(null),En([]),(E=v.elementBoundingBoxes)!=null&&E.length){const Y=[];for(const Q of v.elementBoundingBoxes){const G=Q.x+Q.width/2,te=Q.y+Q.height/2-window.scrollY,_e=Wr(G,te);_e&&Y.push(_e)}Nn(Y),It(null)}else if(v.boundingBox){const Y=v.boundingBox,Q=Y.x+Y.width/2,G=v.isFixed?Y.y+Y.height/2:Y.y+Y.height/2-window.scrollY,te=Wr(Q,G);if(te){const _e=te.getBoundingClientRect(),he=_e.width/Y.width,Ce=_e.height/Y.height;he<.5||Ce<.5?It(null):It(te)}else It(null);Nn([])}else It(null),Nn([])},[]),tn=C.useCallback(v=>{var E;if(!v){Ue(null),an(null),En([]);return}if(Ue(v.id),(E=v.elementBoundingBoxes)!=null&&E.length){const Y=[];for(const Q of v.elementBoundingBoxes){const G=Q.x+Q.width/2,te=Q.y+Q.height/2-window.scrollY,he=document.elementsFromPoint(G,te).find(Ce=>!Ce.closest("[data-annotation-marker]")&&!Ce.closest("[data-agentation-root]"));he&&Y.push(he)}En(Y),an(null)}else if(v.boundingBox){const Y=v.boundingBox,Q=Y.x+Y.width/2,G=v.isFixed?Y.y+Y.height/2:Y.y+Y.height/2-window.scrollY,te=Wr(Q,G);if(te){const _e=te.getBoundingClientRect(),he=_e.width/Y.width,Ce=_e.height/Y.height;he<.5||Ce<.5?an(null):an(te)}else an(null);En([])}else an(null),En([])},[]),di=C.useCallback(v=>{if(!Me)return;const E={...Me,comment:v};V(Y=>Y.map(Q=>Q.id===Me.id?E:Q)),h==null||h(E),bt("annotation.update",{annotation:E}),w&&Mh(w,Me.id,{comment:v}).catch(Y=>{console.warn("[Agentation] Failed to update annotation on server:",Y)}),ao(!0),Ve(()=>{Yn(null),It(null),Nn([]),ao(!1)},150)},[Me,h,bt,w]),Jl=C.useCallback(()=>{ao(!0),Ve(()=>{Yn(null),It(null),Nn([]),ao(!1)},150)},[]),nn=C.useCallback(()=>{const v=I.length;if(v===0)return;f==null||f(I),bt("annotations.clear",{annotations:I}),w&&Promise.all(I.map(Y=>Kd(w,Y.id).catch(Q=>{console.warn("[Agentation] Failed to delete annotation from server:",Q)}))),ke(!0),W(!0);const E=v*30+200;Ve(()=>{V([]),Mo(new Set),localStorage.removeItem(ii(Je)),ke(!1)},E),Ve(()=>W(!1),1500)},[Je,I,f,bt,w]),rl=C.useCallback(async()=>{const v=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Je,E=tf(I,v,de.outputDetail,gn);if(E){if(D)try{await navigator.clipboard.writeText(E)}catch{}y==null||y(E),R(!0),Ve(()=>R(!1),2e3),de.autoClearAfterCopy&&Ve(()=>nn(),500)}},[I,Je,de.outputDetail,gn,de.autoClearAfterCopy,nn,D,y]),_r=C.useCallback(async()=>{const v=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:Je,E=tf(I,v,de.outputDetail,gn);if(!E)return;m&&m(E,I),ce("sending"),await new Promise(Q=>Ve(Q,150));const Y=await bt("submit",{output:E,annotations:I},!0);ce(Y?"sent":"failed"),Ve(()=>ce("idle"),2500),Y&&de.autoClearAfterCopy&&Ve(()=>nn(),500)},[m,bt,I,Je,de.outputDetail,gn,de.autoClearAfterCopy,nn]);C.useEffect(()=>{if(!io)return;const v=10,E=Q=>{const G=Q.clientX-io.x,te=Q.clientY-io.y,_e=Math.sqrt(G*G+te*te);if(!cn&&_e>v&&Xl(!0),cn||_e>v){let he=io.toolbarX+G,Ce=io.toolbarY+te;const Te=20,Se=297,Re=44,Pe=Se-(_?Rt==="connected"?297:257:44),ge=Te-Pe,_t=window.innerWidth-Te-Se;he=Math.max(ge,Math.min(_t,he)),Ce=Math.max(Te,Math.min(window.innerHeight-Re-Te,Ce)),cr({x:he,y:Ce})}},Y=()=>{cn&&(dr.current=!0),Xl(!1),lt(null)};return document.addEventListener("mousemove",E),document.addEventListener("mouseup",Y),()=>{document.removeEventListener("mousemove",E),document.removeEventListener("mouseup",Y)}},[io,cn,_,Rt]);const gr=C.useCallback(v=>{if(v.target.closest("button")||v.target.closest(`.${k.settingsPanel}`))return;const E=v.currentTarget.parentElement;if(!E)return;const Y=E.getBoundingClientRect(),Q=(Ze==null?void 0:Ze.x)??Y.left,G=(Ze==null?void 0:Ze.y)??Y.top,te=(Math.random()-.5)*10;qr(te),lt({x:v.clientX,y:v.clientY,toolbarX:Q,toolbarY:G})},[Ze]);if(C.useEffect(()=>{if(!Ze)return;const v=()=>{let G=Ze.x,te=Ze.y;const Ce=20-(297-(_?Rt==="connected"?297:257:44)),Te=window.innerWidth-20-297;G=Math.max(Ce,Math.min(Te,G)),te=Math.max(20,Math.min(window.innerHeight-44-20,te)),(G!==Ze.x||te!==Ze.y)&&cr({x:G,y:te})};return v(),window.addEventListener("resize",v),()=>window.removeEventListener("resize",v)},[Ze,_,Rt]),C.useEffect(()=>{const v=E=>{const Y=E.target,Q=Y.tagName==="INPUT"||Y.tagName==="TEXTAREA"||Y.isContentEditable;if(E.key==="Escape"){if(ut.length>0){Xn([]);return}$||_&&(Ct(),N(!1))}if((E.metaKey||E.ctrlKey)&&E.shiftKey&&(E.key==="f"||E.key==="F")){E.preventDefault(),Ct(),N(G=>!G);return}if(!(Q||E.metaKey||E.ctrlKey)&&((E.key==="p"||E.key==="P")&&(E.preventDefault(),Ct(),Do()),(E.key==="h"||E.key==="H")&&I.length>0&&(E.preventDefault(),Ct(),ie(G=>!G)),(E.key==="c"||E.key==="C")&&I.length>0&&(E.preventDefault(),Ct(),rl()),(E.key==="x"||E.key==="X")&&I.length>0&&(E.preventDefault(),Ct(),nn()),E.key==="s"||E.key==="S")){const G=Bn(de.webhookUrl)||Bn(j||"");I.length>0&&G&&A==="idle"&&(E.preventDefault(),Ct(),_r())}};return document.addEventListener("keydown",v),()=>document.removeEventListener("keydown",v)},[_,$,I.length,de.webhookUrl,j,A,_r,Do,rl,nn,ut]),!nt||le)return null;const Kn=I.length>0,yr=I.filter(v=>!el.has(v.id)&&Eo(v)),co=I.filter(v=>el.has(v.id)),fo=v=>{const te=v.x/100*window.innerWidth,_e=typeof v.y=="string"?parseFloat(v.y):v.y,he={};window.innerHeight-_e-22-10<80&&(he.top="auto",he.bottom="calc(100% + 10px)");const Te=te-200/2,Se=10;if(Te<Se){const Re=Se-Te;he.left=`calc(50% + ${Re}px)`}else if(Te+200>window.innerWidth-Se){const Re=Te+200-(window.innerWidth-Se);he.left=`calc(50% - ${Re}px)`}return he};return Hd.createPortal(l.jsxs("div",{ref:K,style:{display:"contents"},children:[l.jsx("div",{className:`${k.toolbar}${b?` ${b}`:""}`,"data-feedback-toolbar":!0,style:Ze?{left:Ze.x,top:Ze.y,right:"auto",bottom:"auto"}:void 0,children:l.jsxs("div",{className:`${k.toolbarContainer} ${$e?"":k.light} ${_?k.expanded:k.collapsed} ${ar?k.entrance:""} ${M?k.hiding:""} ${cn?k.dragging:""} ${!de.webhooksEnabled&&(Bn(de.webhookUrl)||Bn(j||""))?k.serverConnected:""}`,onClick:_?void 0:v=>{if(dr.current){dr.current=!1,v.preventDefault();return}N(!0)},onMouseDown:gr,role:_?void 0:"button",tabIndex:_?-1:0,title:_?void 0:"Start feedback mode",style:{...cn&&{transform:`scale(1.05) rotate(${ci}deg)`,cursor:"grabbing"}},children:[l.jsxs("div",{className:`${k.toggleContent} ${_?k.hidden:k.visible}`,children:[l.jsx(ih,{size:24}),Kn&&l.jsx("span",{className:`${k.badge} ${_?k.fadeOut:""} ${ar?k.entrance:""}`,style:{backgroundColor:de.annotationColor},children:I.length})]}),l.jsxs("div",{className:`${k.controlsContent} ${_?k.visible:k.hidden} ${Ze&&Ze.y<100?k.tooltipBelow:""} ${Gr||Po?k.tooltipsHidden:""} ${Un?k.tooltipsInSession:""}`,onMouseEnter:To,onMouseLeave:Zr,children:[l.jsxs("div",{className:`${k.buttonWrapper} ${Ze&&Ze.x<120?k.buttonWrapperAlignLeft:""}`,children:[l.jsx("button",{className:`${k.controlButton} ${$e?"":k.light}`,onClick:v=>{v.stopPropagation(),Ct(),Do()},"data-active":Pt,children:l.jsx(dh,{size:24,isPaused:Pt})}),l.jsxs("span",{className:k.buttonTooltip,children:[Pt?"Resume animations":"Pause animations",l.jsx("span",{className:k.shortcut,children:"P"})]})]}),l.jsxs("div",{className:k.buttonWrapper,children:[l.jsx("button",{className:`${k.controlButton} ${$e?"":k.light}`,onClick:v=>{v.stopPropagation(),Ct(),ie(!ee)},disabled:!Kn,children:l.jsx(ch,{size:24,isOpen:ee})}),l.jsxs("span",{className:k.buttonTooltip,children:[ee?"Hide markers":"Show markers",l.jsx("span",{className:k.shortcut,children:"H"})]})]}),l.jsxs("div",{className:k.buttonWrapper,children:[l.jsx("button",{className:`${k.controlButton} ${$e?"":k.light} ${X?k.statusShowing:""}`,onClick:v=>{v.stopPropagation(),Ct(),rl()},disabled:!Kn,"data-active":X,children:l.jsx(ah,{size:24,copied:X})}),l.jsxs("span",{className:k.buttonTooltip,children:["Copy feedback",l.jsx("span",{className:k.shortcut,children:"C"})]})]}),l.jsxs("div",{className:`${k.buttonWrapper} ${k.sendButtonWrapper} ${_&&!de.webhooksEnabled&&(Bn(de.webhookUrl)||Bn(j||""))?k.sendButtonVisible:""}`,children:[l.jsxs("button",{className:`${k.controlButton} ${$e?"":k.light} ${A==="sent"||A==="failed"?k.statusShowing:""}`,onClick:v=>{v.stopPropagation(),Ct(),_r()},disabled:!Kn||!Bn(de.webhookUrl)&&!Bn(j||"")||A==="sending","data-no-hover":A==="sent"||A==="failed",tabIndex:Bn(de.webhookUrl)||Bn(j||"")?0:-1,children:[l.jsx(uh,{size:24,state:A}),Kn&&A==="idle"&&l.jsx("span",{className:`${k.buttonBadge} ${$e?"":k.light}`,style:{backgroundColor:de.annotationColor},children:I.length})]}),l.jsxs("span",{className:k.buttonTooltip,children:["Send Annotations",l.jsx("span",{className:k.shortcut,children:"S"})]})]}),l.jsxs("div",{className:k.buttonWrapper,children:[l.jsx("button",{className:`${k.controlButton} ${$e?"":k.light}`,onClick:v=>{v.stopPropagation(),Ct(),nn()},disabled:!Kn,"data-danger":!0,children:l.jsx(mh,{size:24})}),l.jsxs("span",{className:k.buttonTooltip,children:["Clear all",l.jsx("span",{className:k.shortcut,children:"X"})]})]}),l.jsxs("div",{className:k.buttonWrapper,children:[l.jsx("button",{className:`${k.controlButton} ${$e?"":k.light}`,onClick:v=>{v.stopPropagation(),Ct(),lr(!Po)},children:l.jsx(fh,{size:24})}),w&&Rt!=="disconnected"&&l.jsx("span",{className:`${k.mcpIndicator} ${$e?"":k.light} ${k[Rt]} ${Po?k.hidden:""}`,title:Rt==="connected"?"MCP Connected":"MCP Connecting..."}),l.jsx("span",{className:k.buttonTooltip,children:"Settings"})]}),l.jsx("div",{className:`${k.divider} ${$e?"":k.light}`}),l.jsxs("div",{className:`${k.buttonWrapper} ${Ze&&typeof window<"u"&&Ze.x>window.innerWidth-120?k.buttonWrapperAlignRight:""}`,children:[l.jsx("button",{className:`${k.controlButton} ${$e?"":k.light}`,onClick:v=>{v.stopPropagation(),Ct(),N(!1)},children:l.jsx(ph,{size:24})}),l.jsxs("span",{className:k.buttonTooltip,children:["Exit",l.jsx("span",{className:k.shortcut,children:"Esc"})]})]})]}),l.jsx("div",{className:`${k.settingsPanel} ${$e?k.dark:k.light} ${Wl?k.enter:k.exit}`,onClick:v=>v.stopPropagation(),style:Ze&&Ze.y<230?{bottom:"auto",top:"calc(100% + 0.5rem)"}:void 0,children:l.jsxs("div",{className:`${k.settingsPanelContainer} ${sr?k.transitioning:""}`,children:[l.jsxs("div",{className:`${k.settingsPage} ${Ro==="automations"?k.slideLeft:""}`,children:[l.jsxs("div",{className:k.settingsHeader,children:[l.jsxs("span",{className:k.settingsBrand,children:[l.jsx("span",{className:k.settingsBrandSlash,style:{color:de.annotationColor,transition:"color 0.2s ease"},children:"/"}),"agentation"]}),l.jsxs("span",{className:k.settingsVersion,children:["v","2.3.1"]}),l.jsx("button",{className:k.themeToggle,onClick:()=>Io(!$e),title:$e?"Switch to light mode":"Switch to dark mode",children:l.jsx("span",{className:k.themeIconWrapper,children:l.jsx("span",{className:k.themeIcon,children:$e?l.jsx(hh,{size:20}):l.jsx(_h,{size:20})},$e?"sun":"moon")})})]}),l.jsxs("div",{className:k.settingsSection,children:[l.jsxs("div",{className:k.settingsRow,children:[l.jsxs("div",{className:`${k.settingsLabel} ${$e?"":k.light}`,children:["Output Detail",l.jsx(un,{content:"Controls how much detail is included in the copied output",children:l.jsx("span",{className:k.helpIcon,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("button",{className:`${k.cycleButton} ${$e?"":k.light}`,onClick:()=>{const E=(Ml.findIndex(Y=>Y.value===de.outputDetail)+1)%Ml.length;Yt(Y=>({...Y,outputDetail:Ml[E].value}))},children:[l.jsx("span",{className:k.cycleButtonText,children:(Zn=Ml.find(v=>v.value===de.outputDetail))==null?void 0:Zn.label},de.outputDetail),l.jsx("span",{className:k.cycleDots,children:Ml.map((v,E)=>l.jsx("span",{className:`${k.cycleDot} ${$e?"":k.light} ${de.outputDetail===v.value?k.active:""}`},v.value))})]})]}),l.jsxs("div",{className:`${k.settingsRow} ${k.settingsRowMarginTop} ${k.settingsRowDisabled}`,children:[l.jsxs("div",{className:`${k.settingsLabel} ${$e?"":k.light}`,children:["React Components",l.jsx(un,{content:"Disabled — production builds minify component names, making detection unreliable. Use in development mode.",children:l.jsx("span",{className:k.helpIcon,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("label",{className:`${k.toggleSwitch} ${k.disabled}`,children:[l.jsx("input",{type:"checkbox",checked:Vl,disabled:!Vl,onChange:()=>Yt(v=>({...v,reactEnabled:!v.reactEnabled}))}),l.jsx("span",{className:k.toggleSlider})]})]}),l.jsxs("div",{className:`${k.settingsRow} ${k.settingsRowMarginTop}`,children:[l.jsxs("div",{className:`${k.settingsLabel} ${$e?"":k.light}`,children:["Hide Until Restart",l.jsx(un,{content:"Hides the toolbar until you open a new tab",children:l.jsx("span",{className:k.helpIcon,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("label",{className:k.toggleSwitch,children:[l.jsx("input",{type:"checkbox",checked:!1,onChange:v=>{v.target.checked&&Zl()}}),l.jsx("span",{className:k.toggleSlider})]})]})]}),l.jsxs("div",{className:k.settingsSection,children:[l.jsx("div",{className:`${k.settingsLabel} ${k.settingsLabelMarker} ${$e?"":k.light}`,children:"Marker Colour"}),l.jsx("div",{className:k.colorOptions,children:a_.map(v=>l.jsx("div",{role:"button",onClick:()=>Yt(E=>({...E,annotationColor:v.value})),style:{borderColor:de.annotationColor===v.value?v.value:"transparent"},className:`${k.colorOptionRing} ${de.annotationColor===v.value?k.selected:""}`,children:l.jsx("div",{className:`${k.colorOption} ${de.annotationColor===v.value?k.selected:""}`,style:{backgroundColor:v.value},title:v.label})},v.value))})]}),l.jsxs("div",{className:k.settingsSection,children:[l.jsxs("label",{className:k.settingsToggle,children:[l.jsx("input",{type:"checkbox",id:"autoClearAfterCopy",checked:de.autoClearAfterCopy,onChange:v=>Yt(E=>({...E,autoClearAfterCopy:v.target.checked}))}),l.jsx("label",{className:`${k.customCheckbox} ${de.autoClearAfterCopy?k.checked:""}`,htmlFor:"autoClearAfterCopy",children:de.autoClearAfterCopy&&l.jsx(Ud,{size:14})}),l.jsxs("span",{className:`${k.toggleLabel} ${$e?"":k.light}`,children:["Clear on copy/send",l.jsx(un,{content:"Automatically clear annotations after copying",children:l.jsx("span",{className:`${k.helpIcon} ${k.helpIconNudge2}`,children:l.jsx(Ar,{size:20})})})]})]}),l.jsxs("label",{className:`${k.settingsToggle} ${k.settingsToggleMarginBottom}`,children:[l.jsx("input",{type:"checkbox",id:"blockInteractions",checked:de.blockInteractions,onChange:v=>Yt(E=>({...E,blockInteractions:v.target.checked}))}),l.jsx("label",{className:`${k.customCheckbox} ${de.blockInteractions?k.checked:""}`,htmlFor:"blockInteractions",children:de.blockInteractions&&l.jsx(Ud,{size:14})}),l.jsx("span",{className:`${k.toggleLabel} ${$e?"":k.light}`,children:"Block page interactions"})]})]}),l.jsx("div",{className:`${k.settingsSection} ${k.settingsSectionExtraPadding}`,children:l.jsxs("button",{className:`${k.settingsNavLink} ${$e?"":k.light}`,onClick:()=>Lo("automations"),children:[l.jsx("span",{children:"Manage MCP & Webhooks"}),l.jsxs("span",{className:k.settingsNavLinkRight,children:[w&&Rt!=="disconnected"&&l.jsx("span",{className:`${k.mcpNavIndicator} ${k[Rt]}`}),l.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M7.5 12.5L12 8L7.5 3.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]})]})})]}),l.jsxs("div",{className:`${k.settingsPage} ${k.automationsPage} ${Ro==="automations"?k.slideIn:""}`,children:[l.jsxs("button",{className:`${k.settingsBackButton} ${$e?"":k.light}`,onClick:()=>Lo("main"),children:[l.jsx(yh,{size:16}),l.jsx("span",{children:"Manage MCP & Webhooks"})]}),l.jsxs("div",{className:k.settingsSection,children:[l.jsxs("div",{className:k.settingsRow,children:[l.jsxs("span",{className:`${k.automationHeader} ${$e?"":k.light}`,children:["MCP Connection",l.jsx(un,{content:"Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time.",children:l.jsx("span",{className:`${k.helpIcon} ${k.helpIconNudgeDown}`,children:l.jsx(Ar,{size:20})})})]}),w&&l.jsx("div",{className:`${k.mcpStatusDot} ${k[Rt]}`,title:Rt==="connected"?"Connected":Rt==="connecting"?"Connecting...":"Disconnected"})]}),l.jsxs("p",{className:`${k.automationDescription} ${$e?"":k.light}`,style:{paddingBottom:6},children:["MCP connection allows agents to receive and act on annotations."," ",l.jsx("a",{href:"https://agentation.dev/mcp",target:"_blank",rel:"noopener noreferrer",className:`${k.learnMoreLink} ${$e?"":k.light}`,children:"Learn more"})]})]}),l.jsxs("div",{className:`${k.settingsSection} ${k.settingsSectionGrow}`,children:[l.jsxs("div",{className:k.settingsRow,children:[l.jsxs("span",{className:`${k.automationHeader} ${$e?"":k.light}`,children:["Webhooks",l.jsx(un,{content:"Send annotation data to any URL endpoint when annotations change. Useful for custom integrations.",children:l.jsx("span",{className:`${k.helpIcon} ${k.helpIconNoNudge}`,children:l.jsx(Ar,{size:20})})})]}),l.jsxs("div",{className:k.autoSendRow,children:[l.jsx("span",{className:`${k.autoSendLabel} ${$e?"":k.light} ${de.webhooksEnabled?k.active:""}`,children:"Auto-Send"}),l.jsxs("label",{className:`${k.toggleSwitch} ${de.webhookUrl?"":k.disabled}`,children:[l.jsx("input",{type:"checkbox",checked:de.webhooksEnabled,disabled:!de.webhookUrl,onChange:()=>Yt(v=>({...v,webhooksEnabled:!v.webhooksEnabled}))}),l.jsx("span",{className:k.toggleSlider})]})]})]}),l.jsx("p",{className:`${k.automationDescription} ${$e?"":k.light}`,children:"The webhook URL will receive live annotation changes and annotation data."}),l.jsx("textarea",{className:`${k.webhookUrlInput} ${$e?"":k.light}`,placeholder:"Webhook URL",value:de.webhookUrl,style:{"--marker-color":de.annotationColor},onKeyDown:v=>v.stopPropagation(),onChange:v=>Yt(E=>({...E,webhookUrl:v.target.value}))})]})]})]})})]})}),l.jsxs("div",{className:k.markersLayer,"data-feedback-toolbar":!0,children:[ue&&yr.filter(v=>!v.isFixed).map((v,E)=>{const Y=!me&&Le===v.id,Q=tr===v.id,G=(Y||Q)&&!Me,te=v.isMultiSelect,_e=te?"#34C759":de.annotationColor,he=I.findIndex(Re=>Re.id===v.id),Ce=!$o.has(v.id),Te=me?k.exit:ve?k.clearing:Ce?k.enter:"",Se=G&&de.markerClickBehavior==="delete";return l.jsxs("div",{className:`${k.marker} ${te?k.multiSelect:""} ${Te} ${Se?k.hovered:""}`,"data-annotation-marker":!0,style:{left:`${v.x}%`,top:v.y,backgroundColor:Se?void 0:_e,animationDelay:me?`${(yr.length-1-E)*20}ms`:`${E*20}ms`},onMouseEnter:()=>!me&&v.id!==uo.current&&tn(v),onMouseLeave:()=>tn(null),onClick:Re=>{Re.stopPropagation(),me||(de.markerClickBehavior==="delete"?Gn(v.id):Mn(v))},onContextMenu:Re=>{de.markerClickBehavior==="delete"&&(Re.preventDefault(),Re.stopPropagation(),me||Mn(v))},children:[G?Se?l.jsx(Ua,{size:te?18:16}):l.jsx(Vd,{size:16}):l.jsx("span",{className:No!==null&&he>=No?k.renumber:void 0,children:he+1}),Y&&!Me&&l.jsxs("div",{className:`${k.markerTooltip} ${$e?"":k.light} ${k.enter}`,style:fo(v),children:[l.jsxs("span",{className:k.markerQuote,children:[v.element,v.selectedText&&` "${v.selectedText.slice(0,30)}${v.selectedText.length>30?"...":""}"`]}),l.jsx("span",{className:k.markerNote,children:v.comment})]})]},v.id)}),ue&&!me&&co.filter(v=>!v.isFixed).map(v=>{const E=v.isMultiSelect;return l.jsx("div",{className:`${k.marker} ${k.hovered} ${E?k.multiSelect:""} ${k.exit}`,"data-annotation-marker":!0,style:{left:`${v.x}%`,top:v.y},children:l.jsx(Ua,{size:E?12:10})},v.id)})]}),l.jsxs("div",{className:k.fixedMarkersLayer,"data-feedback-toolbar":!0,children:[ue&&yr.filter(v=>v.isFixed).map((v,E)=>{const Y=yr.filter(je=>je.isFixed),Q=!me&&Le===v.id,G=tr===v.id,te=(Q||G)&&!Me,_e=v.isMultiSelect,he=_e?"#34C759":de.annotationColor,Ce=I.findIndex(je=>je.id===v.id),Te=!$o.has(v.id),Se=me?k.exit:ve?k.clearing:Te?k.enter:"",Re=te&&de.markerClickBehavior==="delete";return l.jsxs("div",{className:`${k.marker} ${k.fixed} ${_e?k.multiSelect:""} ${Se} ${Re?k.hovered:""}`,"data-annotation-marker":!0,style:{left:`${v.x}%`,top:v.y,backgroundColor:Re?void 0:he,animationDelay:me?`${(Y.length-1-E)*20}ms`:`${E*20}ms`},onMouseEnter:()=>!me&&v.id!==uo.current&&tn(v),onMouseLeave:()=>tn(null),onClick:je=>{je.stopPropagation(),me||(de.markerClickBehavior==="delete"?Gn(v.id):Mn(v))},onContextMenu:je=>{de.markerClickBehavior==="delete"&&(je.preventDefault(),je.stopPropagation(),me||Mn(v))},children:[te?Re?l.jsx(Ua,{size:_e?18:16}):l.jsx(Vd,{size:16}):l.jsx("span",{className:No!==null&&Ce>=No?k.renumber:void 0,children:Ce+1}),Q&&!Me&&l.jsxs("div",{className:`${k.markerTooltip} ${$e?"":k.light} ${k.enter}`,style:fo(v),children:[l.jsxs("span",{className:k.markerQuote,children:[v.element,v.selectedText&&` "${v.selectedText.slice(0,30)}${v.selectedText.length>30?"...":""}"`]}),l.jsx("span",{className:k.markerNote,children:v.comment})]})]},v.id)}),ue&&!me&&co.filter(v=>v.isFixed).map(v=>{const E=v.isMultiSelect;return l.jsx("div",{className:`${k.marker} ${k.fixed} ${k.hovered} ${E?k.multiSelect:""} ${k.exit}`,"data-annotation-marker":!0,style:{left:`${v.x}%`,top:v.y},children:l.jsx(lh,{size:E?12:10})},v.id)})]}),_&&l.jsxs("div",{className:k.overlay,"data-feedback-toolbar":!0,style:$||Me?{zIndex:99999}:void 0,children:[(Ae==null?void 0:Ae.rect)&&!$&&!Qr&&!yn&&l.jsx("div",{className:`${k.hoverHighlight} ${k.enter}`,style:{left:Ae.rect.left,top:Ae.rect.top,width:Ae.rect.width,height:Ae.rect.height,borderColor:`${de.annotationColor}80`,backgroundColor:`${de.annotationColor}0A`}}),ut.filter(v=>document.contains(v.element)).map((v,E)=>{const Y=v.element.getBoundingClientRect(),Q=ut.length>1;return l.jsx("div",{className:Q?k.multiSelectOutline:k.singleSelectOutline,style:{position:"fixed",left:Y.left,top:Y.top,width:Y.width,height:Y.height,...Q?{}:{borderColor:`${de.annotationColor}99`,backgroundColor:`${de.annotationColor}0D`}}},E)}),Le&&!$&&(()=>{var G;const v=I.find(te=>te.id===Le);if(!(v!=null&&v.boundingBox))return null;if((G=v.elementBoundingBoxes)!=null&&G.length)return Ur.length>0?Ur.filter(te=>document.contains(te)).map((te,_e)=>{const he=te.getBoundingClientRect();return l.jsx("div",{className:`${k.multiSelectOutline} ${k.enter}`,style:{left:he.left,top:he.top,width:he.width,height:he.height}},`hover-outline-live-${_e}`)}):v.elementBoundingBoxes.map((te,_e)=>l.jsx("div",{className:`${k.multiSelectOutline} ${k.enter}`,style:{left:te.x,top:te.y-Pn,width:te.width,height:te.height}},`hover-outline-${_e}`));const E=Nt&&document.contains(Nt)?Nt.getBoundingClientRect():null,Y=E?{x:E.left,y:E.top,width:E.width,height:E.height}:{x:v.boundingBox.x,y:v.isFixed?v.boundingBox.y:v.boundingBox.y-Pn,width:v.boundingBox.width,height:v.boundingBox.height},Q=v.isMultiSelect;return l.jsx("div",{className:`${Q?k.multiSelectOutline:k.singleSelectOutline} ${k.enter}`,style:{left:Y.x,top:Y.y,width:Y.width,height:Y.height,...Q?{}:{borderColor:`${de.annotationColor}99`,backgroundColor:`${de.annotationColor}0D`}}})})(),Ae&&!$&&!Qr&&!yn&&l.jsxs("div",{className:`${k.hoverTooltip} ${k.enter}`,style:{left:Math.max(8,Math.min(F.x,window.innerWidth-100)),top:Math.max(F.y-(Ae.reactComponents?48:32),8)},children:[Ae.reactComponents&&l.jsx("div",{className:k.hoverReactPath,children:Ae.reactComponents}),l.jsx("div",{className:k.hoverElementName,children:Ae.elementName})]}),$&&l.jsxs(l.Fragment,{children:[(Bo=$.multiSelectElements)!=null&&Bo.length?$.multiSelectElements.filter(v=>document.contains(v)).map((v,E)=>{const Y=v.getBoundingClientRect();return l.jsx("div",{className:`${k.multiSelectOutline} ${$t?k.exit:k.enter}`,style:{left:Y.left,top:Y.top,width:Y.width,height:Y.height}},`pending-multi-${E}`)}):$.targetElement&&document.contains($.targetElement)?(()=>{const v=$.targetElement.getBoundingClientRect();return l.jsx("div",{className:`${k.singleSelectOutline} ${$t?k.exit:k.enter}`,style:{left:v.left,top:v.top,width:v.width,height:v.height,borderColor:`${de.annotationColor}99`,backgroundColor:`${de.annotationColor}0D`}})})():$.boundingBox&&l.jsx("div",{className:`${$.isMultiSelect?k.multiSelectOutline:k.singleSelectOutline} ${$t?k.exit:k.enter}`,style:{left:$.boundingBox.x,top:$.boundingBox.y-Pn,width:$.boundingBox.width,height:$.boundingBox.height,...$.isMultiSelect?{}:{borderColor:`${de.annotationColor}99`,backgroundColor:`${de.annotationColor}0D`}}}),(()=>{const v=$.x,E=$.isFixed?$.y:$.y-Pn;return l.jsxs(l.Fragment,{children:[l.jsx("div",{className:`${k.marker} ${k.pending} ${$.isMultiSelect?k.multiSelect:""} ${$t?k.exit:k.enter}`,style:{left:`${v}%`,top:E,backgroundColor:$.isMultiSelect?"#34C759":de.annotationColor},children:l.jsx(sh,{size:12})}),l.jsx(Qd,{ref:Kl,element:$.element,selectedText:$.selectedText,computedStyles:$.computedStylesObj,placeholder:$.element==="Area selection"?"What should change in this area?":$.isMultiSelect?"Feedback for this group of elements...":"What should change?",onSubmit:In,onCancel:$n,isExiting:$t,lightMode:!$e,accentColor:$.isMultiSelect?"#34C759":de.annotationColor,style:{left:Math.max(160,Math.min(window.innerWidth-160,v/100*window.innerWidth)),...E>window.innerHeight-290?{bottom:window.innerHeight-E+20}:{top:E+20}}})]})})()]}),Me&&l.jsxs(l.Fragment,{children:[(ql=Me.elementBoundingBoxes)!=null&&ql.length?or.length>0?or.filter(v=>document.contains(v)).map((v,E)=>{const Y=v.getBoundingClientRect();return l.jsx("div",{className:`${k.multiSelectOutline} ${k.enter}`,style:{left:Y.left,top:Y.top,width:Y.width,height:Y.height}},`edit-multi-live-${E}`)}):Me.elementBoundingBoxes.map((v,E)=>l.jsx("div",{className:`${k.multiSelectOutline} ${k.enter}`,style:{left:v.x,top:v.y-Pn,width:v.width,height:v.height}},`edit-multi-${E}`)):(()=>{const v=Hn&&document.contains(Hn)?Hn.getBoundingClientRect():null,E=v?{x:v.left,y:v.top,width:v.width,height:v.height}:Me.boundingBox?{x:Me.boundingBox.x,y:Me.isFixed?Me.boundingBox.y:Me.boundingBox.y-Pn,width:Me.boundingBox.width,height:Me.boundingBox.height}:null;return E?l.jsx("div",{className:`${Me.isMultiSelect?k.multiSelectOutline:k.singleSelectOutline} ${k.enter}`,style:{left:E.x,top:E.y,width:E.width,height:E.height,...Me.isMultiSelect?{}:{borderColor:`${de.annotationColor}99`,backgroundColor:`${de.annotationColor}0D`}}}):null})(),l.jsx(Qd,{ref:pr,element:Me.element,selectedText:Me.selectedText,computedStyles:Ph(Me.computedStyles),placeholder:"Edit your feedback...",initialValue:Me.comment,submitLabel:"Save",onSubmit:di,onCancel:Jl,onDelete:()=>Gn(Me.id),isExiting:en,lightMode:!$e,accentColor:Me.isMultiSelect?"#34C759":de.annotationColor,style:(()=>{const v=Me.isFixed?Me.y:Me.y-Pn;return{left:Math.max(160,Math.min(window.innerWidth-160,Me.x/100*window.innerWidth)),...v>window.innerHeight-290?{bottom:window.innerHeight-v+20}:{top:v+20}}})()})]}),yn&&l.jsxs(l.Fragment,{children:[l.jsx("div",{ref:vn,className:k.dragSelection}),l.jsx("div",{ref:Tn,className:k.highlightsContainer})]})]})]}),document.body)}function c_(){const r=J(V=>V.config),i=J(V=>V.isPanoramic),a=J(V=>V.togglePanoramic),d=J(V=>V.initScreens),p=J(V=>V.setPreviewSize),h=J(V=>V.setFonts),f=J(V=>V.setFrames),y=J(V=>V.setDeviceFamilies),m=J(V=>V.setKoubouAvailable),D=J(V=>V.setSizes),w=J(V=>V.setExportSize),L=J(V=>V.selectedScreen),g=J(V=>V.screens),j=J(V=>V.undo),b=J(V=>V.redo),[_,N]=C.useState(null),I=g[L];return C.useEffect(()=>{const V=ee=>{var re;if(!(ee.metaKey||ee.ctrlKey)||ee.key.toLowerCase()!=="z")return;const le=(re=ee.target)==null?void 0:re.tagName;le==="INPUT"||le==="TEXTAREA"||le==="SELECT"||(ee.preventDefault(),ee.shiftKey?b():j())};return window.addEventListener("keydown",V),()=>window.removeEventListener("keydown",V)},[j,b]),C.useEffect(()=>{async function V(){try{const[ee,ie,le]=await Promise.all([sf(),cp(),up()]),re=ee.app.platforms[0]??"iphone",M=Fl[re]??Fl.iphone;p(M.w,M.h),h(ie),f(le),d(ee,re);try{const K=(await dp()).families;y(K),m(!0)}catch{m(!1)}try{const x=await fp(),K={};for(const[q,me]of Object.entries(x))K[q]=me;D(K);const ue=K[re];ue&&ue.length>0&&w(ue[0].key)}catch{}}catch(ee){N(ee instanceof Error?ee.message:"Failed to load config")}}V()},[d,p,h,f,y,m,D,w]),_?l.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-red-400",children:l.jsx("p",{children:_})}):r?l.jsxs("div",{className:"h-dvh flex overflow-hidden",children:[l.jsxs("div",{className:"w-80 min-w-80 bg-surface border-r border-border flex flex-col",children:[l.jsxs("div",{className:"px-5 py-4 border-b border-border",children:[l.jsxs("div",{className:"flex items-center justify-between",children:[l.jsx("h1",{className:"text-base font-semibold",children:"appframe"}),l.jsxs("button",{className:`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${i?"border-accent/40 bg-accent/10 text-accent":"border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text"}`,onClick:a,title:i?"Switch to individual mode":"Switch to panoramic mode",children:[l.jsx("span",{className:"w-3 h-3 flex items-center justify-center","aria-hidden":"true",children:i?l.jsxs("svg",{viewBox:"0 0 12 12",fill:"none",className:"w-full h-full","aria-hidden":"true",children:[l.jsx("rect",{x:"0.5",y:"2",width:"11",height:"8",rx:"1",stroke:"currentColor",strokeWidth:"1"}),l.jsx("line",{x1:"3",y1:"2",x2:"3",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"}),l.jsx("line",{x1:"6",y1:"2",x2:"6",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"}),l.jsx("line",{x1:"9",y1:"2",x2:"9",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"})]}):l.jsx("svg",{viewBox:"0 0 12 12",fill:"none",className:"w-full h-full","aria-hidden":"true",children:l.jsx("rect",{x:"2",y:"1",width:"8",height:"10",rx:"1",stroke:"currentColor",strokeWidth:"1"})})}),i?"Panoramic":"Individual"]})]}),l.jsxs("div",{className:"flex items-center gap-2 mt-0.5",children:[l.jsx("p",{className:"text-xs text-text-dim",children:r.app.name}),!i&&I&&l.jsx("span",{className:"text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded",children:L+1})]})]}),l.jsx("div",{className:"flex-1 overflow-y-auto",children:i?l.jsxs(l.Fragment,{children:[l.jsx(Gp,{}),l.jsx(Kp,{}),l.jsx(Bd,{})]}):l.jsxs(l.Fragment,{children:[l.jsx(yp,{}),l.jsx(Tp,{}),l.jsx(zp,{}),l.jsx(Fp,{}),l.jsx(Bd,{})]})})]}),i?l.jsx(nh,{}):l.jsx(eh,{}),l.jsx(u_,{endpoint:"http://localhost:4747"})]}):l.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-text-dim",children:l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsxs("svg",{className:"animate-spin h-4 w-4 text-accent",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[l.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),l.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"})]}),"Loading..."]})})}const xf=document.getElementById("root");if(!xf)throw new Error("Root element not found");Vm.createRoot(xf).render(l.jsx(C.StrictMode,{children:l.jsx(c_,{})}));
