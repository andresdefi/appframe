(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))u(d);new MutationObserver(d=>{for(const f of d)if(f.type==="childList")for(const h of f.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&u(h)}).observe(document,{childList:!0,subtree:!0});function i(d){const f={};return d.integrity&&(f.integrity=d.integrity),d.referrerPolicy&&(f.referrerPolicy=d.referrerPolicy),d.crossOrigin==="use-credentials"?f.credentials="include":d.crossOrigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function u(d){if(d.ep)return;d.ep=!0;const f=i(d);fetch(d.href,f)}})();function ff(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var Bi={exports:{}},Tl={},Wi={exports:{}},Ye={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var jd;function qm(){if(jd)return Ye;jd=1;var o=Symbol.for("react.element"),a=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),u=Symbol.for("react.strict_mode"),d=Symbol.for("react.profiler"),f=Symbol.for("react.provider"),h=Symbol.for("react.context"),y=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),$=Symbol.for("react.memo"),x=Symbol.for("react.lazy"),L=Symbol.iterator;function g(I){return I===null||typeof I!="object"?null:(I=L&&I[L]||I["@@iterator"],typeof I=="function"?I:null)}var S={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},N=Object.assign,_={};function k(I,D,de){this.props=I,this.context=D,this.refs=_,this.updater=de||S}k.prototype.isReactComponent={},k.prototype.setState=function(I,D){if(typeof I!="object"&&typeof I!="function"&&I!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,I,D,"setState")},k.prototype.forceUpdate=function(I){this.updater.enqueueForceUpdate(this,I,"forceUpdate")};function b(){}b.prototype=k.prototype;function Z(I,D,de){this.props=I,this.context=D,this.refs=_,this.updater=de||S}var U=Z.prototype=new b;U.constructor=Z,N(U,k.prototype),U.isPureReactComponent=!0;var le=Array.isArray,ne=Object.prototype.hasOwnProperty,ie={current:null},he={key:!0,ref:!0,__self:!0,__source:!0};function re(I,D,de){var pe,se={},Ee=null,Be=null;if(D!=null)for(pe in D.ref!==void 0&&(Be=D.ref),D.key!==void 0&&(Ee=""+D.key),D)ne.call(D,pe)&&!he.hasOwnProperty(pe)&&(se[pe]=D[pe]);var We=arguments.length-2;if(We===1)se.children=de;else if(1<We){for(var Ue=Array(We),nt=0;nt<We;nt++)Ue[nt]=arguments[nt+2];se.children=Ue}if(I&&I.defaultProps)for(pe in We=I.defaultProps,We)se[pe]===void 0&&(se[pe]=We[pe]);return{$$typeof:o,type:I,key:Ee,ref:Be,props:se,_owner:ie.current}}function G(I,D){return{$$typeof:o,type:I.type,key:D,ref:I.ref,props:I.props,_owner:I._owner}}function w(I){return typeof I=="object"&&I!==null&&I.$$typeof===o}function ke(I){var D={"=":"=0",":":"=2"};return"$"+I.replace(/[=:]/g,function(de){return D[de]})}var fe=/\/+/g;function H(I,D){return typeof I=="object"&&I!==null&&I.key!=null?ke(""+I.key):D.toString(36)}function ce(I,D,de,pe,se){var Ee=typeof I;(Ee==="undefined"||Ee==="boolean")&&(I=null);var Be=!1;if(I===null)Be=!0;else switch(Ee){case"string":case"number":Be=!0;break;case"object":switch(I.$$typeof){case o:case a:Be=!0}}if(Be)return Be=I,se=se(Be),I=pe===""?"."+H(Be,0):pe,le(se)?(de="",I!=null&&(de=I.replace(fe,"$&/")+"/"),ce(se,D,de,"",function(nt){return nt})):se!=null&&(w(se)&&(se=G(se,de+(!se.key||Be&&Be.key===se.key?"":(""+se.key).replace(fe,"$&/")+"/")+I)),D.push(se)),1;if(Be=0,pe=pe===""?".":pe+":",le(I))for(var We=0;We<I.length;We++){Ee=I[We];var Ue=pe+H(Ee,We);Be+=ce(Ee,D,de,Ue,se)}else if(Ue=g(I),typeof Ue=="function")for(I=Ue.call(I),We=0;!(Ee=I.next()).done;)Ee=Ee.value,Ue=pe+H(Ee,We++),Be+=ce(Ee,D,de,Ue,se);else if(Ee==="object")throw D=String(I),Error("Objects are not valid as a React child (found: "+(D==="[object Object]"?"object with keys {"+Object.keys(I).join(", ")+"}":D)+"). If you meant to render a collection of children, use an array instead.");return Be}function Pe(I,D,de){if(I==null)return I;var pe=[],se=0;return ce(I,pe,"","",function(Ee){return D.call(de,Ee,se++)}),pe}function O(I){if(I._status===-1){var D=I._result;D=D(),D.then(function(de){(I._status===0||I._status===-1)&&(I._status=1,I._result=de)},function(de){(I._status===0||I._status===-1)&&(I._status=2,I._result=de)}),I._status===-1&&(I._status=0,I._result=D)}if(I._status===1)return I._result.default;throw I._result}var je={current:null},M={transition:null},z={ReactCurrentDispatcher:je,ReactCurrentBatchConfig:M,ReactCurrentOwner:ie};function V(){throw Error("act(...) is not supported in production builds of React.")}return Ye.Children={map:Pe,forEach:function(I,D,de){Pe(I,function(){D.apply(this,arguments)},de)},count:function(I){var D=0;return Pe(I,function(){D++}),D},toArray:function(I){return Pe(I,function(D){return D})||[]},only:function(I){if(!w(I))throw Error("React.Children.only expected to receive a single React element child.");return I}},Ye.Component=k,Ye.Fragment=i,Ye.Profiler=d,Ye.PureComponent=Z,Ye.StrictMode=u,Ye.Suspense=p,Ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=z,Ye.act=V,Ye.cloneElement=function(I,D,de){if(I==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+I+".");var pe=N({},I.props),se=I.key,Ee=I.ref,Be=I._owner;if(D!=null){if(D.ref!==void 0&&(Ee=D.ref,Be=ie.current),D.key!==void 0&&(se=""+D.key),I.type&&I.type.defaultProps)var We=I.type.defaultProps;for(Ue in D)ne.call(D,Ue)&&!he.hasOwnProperty(Ue)&&(pe[Ue]=D[Ue]===void 0&&We!==void 0?We[Ue]:D[Ue])}var Ue=arguments.length-2;if(Ue===1)pe.children=de;else if(1<Ue){We=Array(Ue);for(var nt=0;nt<Ue;nt++)We[nt]=arguments[nt+2];pe.children=We}return{$$typeof:o,type:I.type,key:se,ref:Ee,props:pe,_owner:Be}},Ye.createContext=function(I){return I={$$typeof:h,_currentValue:I,_currentValue2:I,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},I.Provider={$$typeof:f,_context:I},I.Consumer=I},Ye.createElement=re,Ye.createFactory=function(I){var D=re.bind(null,I);return D.type=I,D},Ye.createRef=function(){return{current:null}},Ye.forwardRef=function(I){return{$$typeof:y,render:I}},Ye.isValidElement=w,Ye.lazy=function(I){return{$$typeof:x,_payload:{_status:-1,_result:I},_init:O}},Ye.memo=function(I,D){return{$$typeof:$,type:I,compare:D===void 0?null:D}},Ye.startTransition=function(I){var D=M.transition;M.transition={};try{I()}finally{M.transition=D}},Ye.unstable_act=V,Ye.useCallback=function(I,D){return je.current.useCallback(I,D)},Ye.useContext=function(I){return je.current.useContext(I)},Ye.useDebugValue=function(){},Ye.useDeferredValue=function(I){return je.current.useDeferredValue(I)},Ye.useEffect=function(I,D){return je.current.useEffect(I,D)},Ye.useId=function(){return je.current.useId()},Ye.useImperativeHandle=function(I,D,de){return je.current.useImperativeHandle(I,D,de)},Ye.useInsertionEffect=function(I,D){return je.current.useInsertionEffect(I,D)},Ye.useLayoutEffect=function(I,D){return je.current.useLayoutEffect(I,D)},Ye.useMemo=function(I,D){return je.current.useMemo(I,D)},Ye.useReducer=function(I,D,de){return je.current.useReducer(I,D,de)},Ye.useRef=function(I){return je.current.useRef(I)},Ye.useState=function(I){return je.current.useState(I)},Ye.useSyncExternalStore=function(I,D,de){return je.current.useSyncExternalStore(I,D,de)},Ye.useTransition=function(){return je.current.useTransition()},Ye.version="18.3.1",Ye}var Ed;function Vl(){return Ed||(Ed=1,Wi.exports=qm()),Wi.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Nd;function ep(){if(Nd)return Tl;Nd=1;var o=Vl(),a=Symbol.for("react.element"),i=Symbol.for("react.fragment"),u=Object.prototype.hasOwnProperty,d=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,f={key:!0,ref:!0,__self:!0,__source:!0};function h(y,p,$){var x,L={},g=null,S=null;$!==void 0&&(g=""+$),p.key!==void 0&&(g=""+p.key),p.ref!==void 0&&(S=p.ref);for(x in p)u.call(p,x)&&!f.hasOwnProperty(x)&&(L[x]=p[x]);if(y&&y.defaultProps)for(x in p=y.defaultProps,p)L[x]===void 0&&(L[x]=p[x]);return{$$typeof:a,type:y,key:g,ref:S,props:L,_owner:d.current}}return Tl.Fragment=i,Tl.jsx=h,Tl.jsxs=h,Tl}var Pd;function tp(){return Pd||(Pd=1,Bi.exports=ep()),Bi.exports}var l=tp(),C=Vl();const mf=ff(C);var qs={},Yi={exports:{}},on={},Hi={exports:{}},Vi={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ld;function np(){return Ld||(Ld=1,(function(o){function a(M,z){var V=M.length;M.push(z);e:for(;0<V;){var I=V-1>>>1,D=M[I];if(0<d(D,z))M[I]=z,M[V]=D,V=I;else break e}}function i(M){return M.length===0?null:M[0]}function u(M){if(M.length===0)return null;var z=M[0],V=M.pop();if(V!==z){M[0]=V;e:for(var I=0,D=M.length,de=D>>>1;I<de;){var pe=2*(I+1)-1,se=M[pe],Ee=pe+1,Be=M[Ee];if(0>d(se,V))Ee<D&&0>d(Be,se)?(M[I]=Be,M[Ee]=V,I=Ee):(M[I]=se,M[pe]=V,I=pe);else if(Ee<D&&0>d(Be,V))M[I]=Be,M[Ee]=V,I=Ee;else break e}}return z}function d(M,z){var V=M.sortIndex-z.sortIndex;return V!==0?V:M.id-z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var f=performance;o.unstable_now=function(){return f.now()}}else{var h=Date,y=h.now();o.unstable_now=function(){return h.now()-y}}var p=[],$=[],x=1,L=null,g=3,S=!1,N=!1,_=!1,k=typeof setTimeout=="function"?setTimeout:null,b=typeof clearTimeout=="function"?clearTimeout:null,Z=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function U(M){for(var z=i($);z!==null;){if(z.callback===null)u($);else if(z.startTime<=M)u($),z.sortIndex=z.expirationTime,a(p,z);else break;z=i($)}}function le(M){if(_=!1,U(M),!N)if(i(p)!==null)N=!0,O(ne);else{var z=i($);z!==null&&je(le,z.startTime-M)}}function ne(M,z){N=!1,_&&(_=!1,b(re),re=-1),S=!0;var V=g;try{for(U(z),L=i(p);L!==null&&(!(L.expirationTime>z)||M&&!ke());){var I=L.callback;if(typeof I=="function"){L.callback=null,g=L.priorityLevel;var D=I(L.expirationTime<=z);z=o.unstable_now(),typeof D=="function"?L.callback=D:L===i(p)&&u(p),U(z)}else u(p);L=i(p)}if(L!==null)var de=!0;else{var pe=i($);pe!==null&&je(le,pe.startTime-z),de=!1}return de}finally{L=null,g=V,S=!1}}var ie=!1,he=null,re=-1,G=5,w=-1;function ke(){return!(o.unstable_now()-w<G)}function fe(){if(he!==null){var M=o.unstable_now();w=M;var z=!0;try{z=he(!0,M)}finally{z?H():(ie=!1,he=null)}}else ie=!1}var H;if(typeof Z=="function")H=function(){Z(fe)};else if(typeof MessageChannel<"u"){var ce=new MessageChannel,Pe=ce.port2;ce.port1.onmessage=fe,H=function(){Pe.postMessage(null)}}else H=function(){k(fe,0)};function O(M){he=M,ie||(ie=!0,H())}function je(M,z){re=k(function(){M(o.unstable_now())},z)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(M){M.callback=null},o.unstable_continueExecution=function(){N||S||(N=!0,O(ne))},o.unstable_forceFrameRate=function(M){0>M||125<M?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):G=0<M?Math.floor(1e3/M):5},o.unstable_getCurrentPriorityLevel=function(){return g},o.unstable_getFirstCallbackNode=function(){return i(p)},o.unstable_next=function(M){switch(g){case 1:case 2:case 3:var z=3;break;default:z=g}var V=g;g=z;try{return M()}finally{g=V}},o.unstable_pauseExecution=function(){},o.unstable_requestPaint=function(){},o.unstable_runWithPriority=function(M,z){switch(M){case 1:case 2:case 3:case 4:case 5:break;default:M=3}var V=g;g=M;try{return z()}finally{g=V}},o.unstable_scheduleCallback=function(M,z,V){var I=o.unstable_now();switch(typeof V=="object"&&V!==null?(V=V.delay,V=typeof V=="number"&&0<V?I+V:I):V=I,M){case 1:var D=-1;break;case 2:D=250;break;case 5:D=1073741823;break;case 4:D=1e4;break;default:D=5e3}return D=V+D,M={id:x++,callback:z,priorityLevel:M,startTime:V,expirationTime:D,sortIndex:-1},V>I?(M.sortIndex=V,a($,M),i(p)===null&&M===i($)&&(_?(b(re),re=-1):_=!0,je(le,V-I))):(M.sortIndex=D,a(p,M),N||S||(N=!0,O(ne))),M},o.unstable_shouldYield=ke,o.unstable_wrapCallback=function(M){var z=g;return function(){var V=g;g=z;try{return M.apply(this,arguments)}finally{g=V}}}})(Vi)),Vi}var Id;function op(){return Id||(Id=1,Hi.exports=np()),Hi.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Td;function rp(){if(Td)return on;Td=1;var o=Vl(),a=op();function i(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var u=new Set,d={};function f(e,t){h(e,t),h(e+"Capture",t)}function h(e,t){for(d[e]=t,e=0;e<t.length;e++)u.add(t[e])}var y=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),p=Object.prototype.hasOwnProperty,$=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,x={},L={};function g(e){return p.call(L,e)?!0:p.call(x,e)?!1:$.test(e)?L[e]=!0:(x[e]=!0,!1)}function S(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function N(e,t,n,r){if(t===null||typeof t>"u"||S(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function _(e,t,n,r,s,c,m){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=s,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=c,this.removeEmptyString=m}var k={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){k[e]=new _(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];k[t]=new _(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){k[e]=new _(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){k[e]=new _(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){k[e]=new _(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){k[e]=new _(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){k[e]=new _(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){k[e]=new _(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){k[e]=new _(e,5,!1,e.toLowerCase(),null,!1,!1)});var b=/[\-:]([a-z])/g;function Z(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(b,Z);k[t]=new _(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(b,Z);k[t]=new _(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(b,Z);k[t]=new _(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){k[e]=new _(e,1,!1,e.toLowerCase(),null,!1,!1)}),k.xlinkHref=new _("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){k[e]=new _(e,1,!1,e.toLowerCase(),null,!0,!0)});function U(e,t,n,r){var s=k.hasOwnProperty(t)?k[t]:null;(s!==null?s.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(N(t,n,s,r)&&(n=null),r||s===null?g(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):s.mustUseProperty?e[s.propertyName]=n===null?s.type===3?!1:"":n:(t=s.attributeName,r=s.attributeNamespace,n===null?e.removeAttribute(t):(s=s.type,n=s===3||s===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var le=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ne=Symbol.for("react.element"),ie=Symbol.for("react.portal"),he=Symbol.for("react.fragment"),re=Symbol.for("react.strict_mode"),G=Symbol.for("react.profiler"),w=Symbol.for("react.provider"),ke=Symbol.for("react.context"),fe=Symbol.for("react.forward_ref"),H=Symbol.for("react.suspense"),ce=Symbol.for("react.suspense_list"),Pe=Symbol.for("react.memo"),O=Symbol.for("react.lazy"),je=Symbol.for("react.offscreen"),M=Symbol.iterator;function z(e){return e===null||typeof e!="object"?null:(e=M&&e[M]||e["@@iterator"],typeof e=="function"?e:null)}var V=Object.assign,I;function D(e){if(I===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);I=t&&t[1]||""}return`
`+I+e}var de=!1;function pe(e,t){if(!e||de)return"";de=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(B){var r=B}Reflect.construct(e,[],t)}else{try{t.call()}catch(B){r=B}e.call(t.prototype)}else{try{throw Error()}catch(B){r=B}e()}}catch(B){if(B&&r&&typeof B.stack=="string"){for(var s=B.stack.split(`
`),c=r.stack.split(`
`),m=s.length-1,E=c.length-1;1<=m&&0<=E&&s[m]!==c[E];)E--;for(;1<=m&&0<=E;m--,E--)if(s[m]!==c[E]){if(m!==1||E!==1)do if(m--,E--,0>E||s[m]!==c[E]){var T=`
`+s[m].replace(" at new "," at ");return e.displayName&&T.includes("<anonymous>")&&(T=T.replace("<anonymous>",e.displayName)),T}while(1<=m&&0<=E);break}}}finally{de=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?D(e):""}function se(e){switch(e.tag){case 5:return D(e.type);case 16:return D("Lazy");case 13:return D("Suspense");case 19:return D("SuspenseList");case 0:case 2:case 15:return e=pe(e.type,!1),e;case 11:return e=pe(e.type.render,!1),e;case 1:return e=pe(e.type,!0),e;default:return""}}function Ee(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case he:return"Fragment";case ie:return"Portal";case G:return"Profiler";case re:return"StrictMode";case H:return"Suspense";case ce:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case ke:return(e.displayName||"Context")+".Consumer";case w:return(e._context.displayName||"Context")+".Provider";case fe:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Pe:return t=e.displayName||null,t!==null?t:Ee(e.type)||"Memo";case O:t=e._payload,e=e._init;try{return Ee(e(t))}catch{}}return null}function Be(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ee(t);case 8:return t===re?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function We(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ue(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function nt(e){var t=Ue(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var s=n.get,c=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(m){r=""+m,c.call(this,m)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(m){r=""+m},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function wt(e){e._valueTracker||(e._valueTracker=nt(e))}function Ro(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Ue(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function J(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function mt(e,t){var n=t.checked;return V({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function ot(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=We(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function jt(e,t){t=t.checked,t!=null&&U(e,"checked",t,!1)}function Qt(e,t){jt(e,t);var n=We(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Xn(e,t.type,n):t.hasOwnProperty("defaultValue")&&Xn(e,t.type,We(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function ze(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Xn(e,t,n){(t!=="number"||J(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Qn=Array.isArray;function Ft(e,t,n,r){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&r&&(e[n].defaultSelected=!0)}else{for(n=""+We(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,r&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function ar(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(i(91));return V({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function $n(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(i(92));if(Qn(n)){if(1<n.length)throw Error(i(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:We(n)}}function Mn(e,t){var n=We(t.value),r=We(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Kr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Zr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ir(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Zr(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var st,Xl=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,s){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,s)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(st=st||document.createElement("div"),st.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=st.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function $t(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var uo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},$o=["Webkit","ms","Moz","O"];Object.keys(uo).forEach(function(e){$o.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),uo[t]=uo[e]})});function cr(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||uo.hasOwnProperty(e)&&uo[e]?(""+t).trim():t+"px"}function Ql(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,s=cr(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,s):e[n]=s}}var Gl=V({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Mo(e,t){if(t){if(Gl[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(i(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(i(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(i(61))}if(t.style!=null&&typeof t.style!="object")throw Error(i(62))}}function zo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ur=null;function dr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Jr=null,zn=null,Gn=null;function qr(e){if(e=gl(e)){if(typeof Jr!="function")throw Error(i(280));var t=e.stateNode;t&&(t=ps(t),Jr(e.stateNode,e.type,t))}}function Kn(e){zn?Gn?Gn.push(e):Gn=[e]:zn=e}function pt(){if(zn){var e=zn,t=Gn;if(Gn=zn=null,qr(e),t)for(e=0;e<t.length;e++)qr(t[e])}}function Zn(e,t){return e(t)}function ln(){}var Lt=!1;function Kl(e,t,n){if(Lt)return e(t,n);Lt=!0;try{return Zn(e,t,n)}finally{Lt=!1,(zn!==null||Gn!==null)&&(ln(),pt())}}function Oo(e,t){var n=e.stateNode;if(n===null)return null;var r=ps(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(i(231,t,typeof n));return n}var el=!1;if(y)try{var pn={};Object.defineProperty(pn,"passive",{get:function(){el=!0}}),window.addEventListener("test",pn,pn),window.removeEventListener("test",pn,pn)}catch{el=!1}function ue(e,t,n,r,s,c,m,E,T){var B=Array.prototype.slice.call(arguments,3);try{t.apply(n,B)}catch(te){this.onError(te)}}var Gt=!1,Fe=null,Fo=!1,fr=null,Zl={onError:function(e){Gt=!0,Fe=e}};function Jl(e,t,n,r,s,c,m,E,T){Gt=!1,Fe=null,ue.apply(Zl,arguments)}function wn(e,t,n,r,s,c,m,E,T){if(Jl.apply(this,arguments),Gt){if(Gt){var B=Fe;Gt=!1,Fe=null}else throw Error(i(198));Fo||(Fo=!0,fr=B)}}function xt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function mr(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function tl(e){if(xt(e)!==e)throw Error(i(188))}function Mt(e){var t=e.alternate;if(!t){if(t=xt(e),t===null)throw Error(i(188));return t!==e?null:e}for(var n=e,r=t;;){var s=n.return;if(s===null)break;var c=s.alternate;if(c===null){if(r=s.return,r!==null){n=r;continue}break}if(s.child===c.child){for(c=s.child;c;){if(c===n)return tl(s),e;if(c===r)return tl(s),t;c=c.sibling}throw Error(i(188))}if(n.return!==r.return)n=s,r=c;else{for(var m=!1,E=s.child;E;){if(E===n){m=!0,n=s,r=c;break}if(E===r){m=!0,r=s,n=c;break}E=E.sibling}if(!m){for(E=c.child;E;){if(E===n){m=!0,n=c,r=s;break}if(E===r){m=!0,r=c,n=s;break}E=E.sibling}if(!m)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function On(e){return e=Mt(e),e!==null?et(e):null}function et(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=et(e);if(t!==null)return t;e=e.sibling}return null}var pr=a.unstable_scheduleCallback,hn=a.unstable_cancelCallback,ql=a.unstable_shouldYield,fo=a.unstable_requestPaint,ct=a.unstable_now,_a=a.unstable_getCurrentPriorityLevel,nl=a.unstable_ImmediatePriority,hr=a.unstable_UserBlockingPriority,Do=a.unstable_NormalPriority,Ao=a.unstable_LowPriority,ol=a.unstable_IdlePriority,Jn=null,Dt=null;function _r(e){if(Dt&&typeof Dt.onCommitFiberRoot=="function")try{Dt.onCommitFiberRoot(Jn,e,void 0,(e.current.flags&128)===128)}catch{}}var sn=Math.clz32?Math.clz32:es,mo=Math.log,kn=Math.LN2;function es(e){return e>>>=0,e===0?32:31-(mo(e)/kn|0)|0}var Cn=64,Vt=4194304;function Sn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Fn(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,s=e.suspendedLanes,c=e.pingedLanes,m=n&268435455;if(m!==0){var E=m&~s;E!==0?r=Sn(E):(c&=m,c!==0&&(r=Sn(c)))}else m=n&~s,m!==0?r=Sn(m):c!==0&&(r=Sn(c));if(r===0)return 0;if(t!==0&&t!==r&&(t&s)===0&&(s=r&-r,c=t&-t,s>=c||s===16&&(c&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-sn(t),s=1<<n,r|=e[n],t&=~s;return r}function gr(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ts(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,s=e.expirationTimes,c=e.pendingLanes;0<c;){var m=31-sn(c),E=1<<m,T=s[m];T===-1?((E&n)===0||(E&r)!==0)&&(s[m]=gr(E,t)):T<=t&&(e.expiredLanes|=E),c&=~E}}function po(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function rl(){var e=Cn;return Cn<<=1,(Cn&4194240)===0&&(Cn=64),e}function Bo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Wo(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-sn(t),e[t]=n}function ns(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var s=31-sn(n),c=1<<s;t[s]=0,r[s]=-1,e[s]=-1,n&=~c}}function yr(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-sn(n),s=1<<r;s&t|e[r]&t&&(e[r]|=t),n&=~s}}var Ve=0;function tt(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var ll,xr,os,sl,Yo,Ho=!1,Vo=[],Et=null,Dn=null,An=null,qn=new Map,Bn=new Map,an=[],ga="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function rs(e,t){switch(e){case"focusin":case"focusout":Et=null;break;case"dragenter":case"dragleave":Dn=null;break;case"mouseover":case"mouseout":An=null;break;case"pointerover":case"pointerout":qn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Bn.delete(t.pointerId)}}function cn(e,t,n,r,s,c){return e===null||e.nativeEvent!==c?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:c,targetContainers:[s]},t!==null&&(t=gl(t),t!==null&&xr(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function al(e,t,n,r,s){switch(t){case"focusin":return Et=cn(Et,e,t,n,r,s),!0;case"dragenter":return Dn=cn(Dn,e,t,n,r,s),!0;case"mouseover":return An=cn(An,e,t,n,r,s),!0;case"pointerover":var c=s.pointerId;return qn.set(c,cn(qn.get(c)||null,e,t,n,r,s)),!0;case"gotpointercapture":return c=s.pointerId,Bn.set(c,cn(Bn.get(c)||null,e,t,n,r,s)),!0}return!1}function vr(e){var t=Xo(e.target);if(t!==null){var n=xt(t);if(n!==null){if(t=n.tag,t===13){if(t=mr(n),t!==null){e.blockedOn=t,Yo(e.priority,function(){os(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function br(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=X(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);ur=r,n.target.dispatchEvent(r),ur=null}else return t=gl(n),t!==null&&xr(t),e.blockedOn=n,!1;t.shift()}return!0}function eo(e,t,n){br(e)&&n.delete(t)}function wr(){Ho=!1,Et!==null&&br(Et)&&(Et=null),Dn!==null&&br(Dn)&&(Dn=null),An!==null&&br(An)&&(An=null),qn.forEach(eo),Bn.forEach(eo)}function ho(e,t){e.blockedOn===t&&(e.blockedOn=null,Ho||(Ho=!0,a.unstable_scheduleCallback(a.unstable_NormalPriority,wr)))}function _o(e){function t(s){return ho(s,e)}if(0<Vo.length){ho(Vo[0],e);for(var n=1;n<Vo.length;n++){var r=Vo[n];r.blockedOn===e&&(r.blockedOn=null)}}for(Et!==null&&ho(Et,e),Dn!==null&&ho(Dn,e),An!==null&&ho(An,e),qn.forEach(t),Bn.forEach(t),n=0;n<an.length;n++)r=an[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<an.length&&(n=an[0],n.blockedOn===null);)vr(n),n.blockedOn===null&&an.shift()}var to=le.ReactCurrentBatchConfig,Uo=!0;function ls(e,t,n,r){var s=Ve,c=to.transition;to.transition=null;try{Ve=1,P(e,t,n,r)}finally{Ve=s,to.transition=c}}function v(e,t,n,r){var s=Ve,c=to.transition;to.transition=null;try{Ve=4,P(e,t,n,r)}finally{Ve=s,to.transition=c}}function P(e,t,n,r){if(Uo){var s=X(e,t,n,r);if(s===null)Ia(e,t,r,Y,n),rs(e,r);else if(al(s,e,t,n,r))r.stopPropagation();else if(rs(e,r),t&4&&-1<ga.indexOf(e)){for(;s!==null;){var c=gl(s);if(c!==null&&ll(c),c=X(e,t,n,r),c===null&&Ia(e,t,r,Y,n),c===s)break;s=c}s!==null&&r.stopPropagation()}else Ia(e,t,r,null,n)}}var Y=null;function X(e,t,n,r){if(Y=null,e=dr(r),e=Xo(e),e!==null)if(t=xt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=mr(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Y=e,null}function Q(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(_a()){case nl:return 1;case hr:return 4;case Do:case Ao:return 16;case ol:return 536870912;default:return 16}default:return 16}}var q=null,ye=null,ge=null;function Ce(){if(ge)return ge;var e,t=ye,n=t.length,r,s="value"in q?q.value:q.textContent,c=s.length;for(e=0;e<n&&t[e]===s[e];e++);var m=n-e;for(r=1;r<=m&&t[n-r]===s[c-r];r++);return ge=s.slice(e,1<r?1-r:void 0)}function $e(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Se(){return!0}function Re(){return!1}function Ne(e){function t(n,r,s,c,m){this._reactName=n,this._targetInst=s,this.type=r,this.nativeEvent=c,this.target=m,this.currentTarget=null;for(var E in e)e.hasOwnProperty(E)&&(n=e[E],this[E]=n?n(c):c[E]);return this.isDefaultPrevented=(c.defaultPrevented!=null?c.defaultPrevented:c.returnValue===!1)?Se:Re,this.isPropagationStopped=Re,this}return V(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Se)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Se)},persist:function(){},isPersistent:Se}),t}var Te={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},xe=Ne(Te),kt=V({},Te,{view:0,detail:0}),Ct=Ne(kt),un,ut,gt,De=V({},kt,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:va,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==gt&&(gt&&e.type==="mousemove"?(un=e.screenX-gt.screenX,ut=e.screenY-gt.screenY):ut=un=0,gt=e),un)},movementY:function(e){return"movementY"in e?e.movementY:ut}}),Ae=Ne(De),At=V({},De,{dataTransfer:0}),dt=Ne(At),Kt=V({},kt,{relatedTarget:0}),Zt=Ne(Kt),kr=V({},Te,{animationName:0,elapsedTime:0,pseudoElement:0}),ya=Ne(kr),ss=V({},Te,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),xa=Ne(ss),$f=V({},Te,{data:0}),_c=Ne($f),Mf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},zf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Of={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ff(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Of[e])?!!t[e]:!1}function va(){return Ff}var Df=V({},kt,{key:function(e){if(e.key){var t=Mf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=$e(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?zf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:va,charCode:function(e){return e.type==="keypress"?$e(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?$e(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Af=Ne(Df),Bf=V({},De,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),gc=Ne(Bf),Wf=V({},kt,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:va}),Yf=Ne(Wf),Hf=V({},Te,{propertyName:0,elapsedTime:0,pseudoElement:0}),Vf=Ne(Hf),Uf=V({},De,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Xf=Ne(Uf),Qf=[9,13,27,32],ba=y&&"CompositionEvent"in window,il=null;y&&"documentMode"in document&&(il=document.documentMode);var Gf=y&&"TextEvent"in window&&!il,yc=y&&(!ba||il&&8<il&&11>=il),xc=" ",vc=!1;function bc(e,t){switch(e){case"keyup":return Qf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function wc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Cr=!1;function Kf(e,t){switch(e){case"compositionend":return wc(t);case"keypress":return t.which!==32?null:(vc=!0,xc);case"textInput":return e=t.data,e===xc&&vc?null:e;default:return null}}function Zf(e,t){if(Cr)return e==="compositionend"||!ba&&bc(e,t)?(e=Ce(),ge=ye=q=null,Cr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return yc&&t.locale!=="ko"?null:t.data;default:return null}}var Jf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function kc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Jf[e.type]:t==="textarea"}function Cc(e,t,n,r){Kn(r),t=ds(t,"onChange"),0<t.length&&(n=new xe("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var cl=null,ul=null;function qf(e){Wc(e,0)}function as(e){var t=Pr(e);if(Ro(t))return e}function em(e,t){if(e==="change")return t}var Sc=!1;if(y){var wa;if(y){var ka="oninput"in document;if(!ka){var jc=document.createElement("div");jc.setAttribute("oninput","return;"),ka=typeof jc.oninput=="function"}wa=ka}else wa=!1;Sc=wa&&(!document.documentMode||9<document.documentMode)}function Ec(){cl&&(cl.detachEvent("onpropertychange",Nc),ul=cl=null)}function Nc(e){if(e.propertyName==="value"&&as(ul)){var t=[];Cc(t,ul,e,dr(e)),Kl(qf,t)}}function tm(e,t,n){e==="focusin"?(Ec(),cl=t,ul=n,cl.attachEvent("onpropertychange",Nc)):e==="focusout"&&Ec()}function nm(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return as(ul)}function om(e,t){if(e==="click")return as(t)}function rm(e,t){if(e==="input"||e==="change")return as(t)}function lm(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var jn=typeof Object.is=="function"?Object.is:lm;function dl(e,t){if(jn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var s=n[r];if(!p.call(t,s)||!jn(e[s],t[s]))return!1}return!0}function Pc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Lc(e,t){var n=Pc(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Pc(n)}}function Ic(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Ic(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Tc(){for(var e=window,t=J();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=J(e.document)}return t}function Ca(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function sm(e){var t=Tc(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Ic(n.ownerDocument.documentElement,n)){if(r!==null&&Ca(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var s=n.textContent.length,c=Math.min(r.start,s);r=r.end===void 0?c:Math.min(r.end,s),!e.extend&&c>r&&(s=r,r=c,c=s),s=Lc(n,c);var m=Lc(n,r);s&&m&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==m.node||e.focusOffset!==m.offset)&&(t=t.createRange(),t.setStart(s.node,s.offset),e.removeAllRanges(),c>r?(e.addRange(t),e.extend(m.node,m.offset)):(t.setEnd(m.node,m.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var am=y&&"documentMode"in document&&11>=document.documentMode,Sr=null,Sa=null,fl=null,ja=!1;function Rc(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ja||Sr==null||Sr!==J(r)||(r=Sr,"selectionStart"in r&&Ca(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),fl&&dl(fl,r)||(fl=r,r=ds(Sa,"onSelect"),0<r.length&&(t=new xe("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Sr)))}function is(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var jr={animationend:is("Animation","AnimationEnd"),animationiteration:is("Animation","AnimationIteration"),animationstart:is("Animation","AnimationStart"),transitionend:is("Transition","TransitionEnd")},Ea={},$c={};y&&($c=document.createElement("div").style,"AnimationEvent"in window||(delete jr.animationend.animation,delete jr.animationiteration.animation,delete jr.animationstart.animation),"TransitionEvent"in window||delete jr.transitionend.transition);function cs(e){if(Ea[e])return Ea[e];if(!jr[e])return e;var t=jr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in $c)return Ea[e]=t[n];return e}var Mc=cs("animationend"),zc=cs("animationiteration"),Oc=cs("animationstart"),Fc=cs("transitionend"),Dc=new Map,Ac="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function go(e,t){Dc.set(e,t),f(t,[e])}for(var Na=0;Na<Ac.length;Na++){var Pa=Ac[Na],im=Pa.toLowerCase(),cm=Pa[0].toUpperCase()+Pa.slice(1);go(im,"on"+cm)}go(Mc,"onAnimationEnd"),go(zc,"onAnimationIteration"),go(Oc,"onAnimationStart"),go("dblclick","onDoubleClick"),go("focusin","onFocus"),go("focusout","onBlur"),go(Fc,"onTransitionEnd"),h("onMouseEnter",["mouseout","mouseover"]),h("onMouseLeave",["mouseout","mouseover"]),h("onPointerEnter",["pointerout","pointerover"]),h("onPointerLeave",["pointerout","pointerover"]),f("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),f("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),f("onBeforeInput",["compositionend","keypress","textInput","paste"]),f("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),f("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),f("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ml="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),um=new Set("cancel close invalid load scroll toggle".split(" ").concat(ml));function Bc(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,wn(r,t,void 0,e),e.currentTarget=null}function Wc(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],s=r.event;r=r.listeners;e:{var c=void 0;if(t)for(var m=r.length-1;0<=m;m--){var E=r[m],T=E.instance,B=E.currentTarget;if(E=E.listener,T!==c&&s.isPropagationStopped())break e;Bc(s,E,B),c=T}else for(m=0;m<r.length;m++){if(E=r[m],T=E.instance,B=E.currentTarget,E=E.listener,T!==c&&s.isPropagationStopped())break e;Bc(s,E,B),c=T}}}if(Fo)throw e=fr,Fo=!1,fr=null,e}function at(e,t){var n=t[Oa];n===void 0&&(n=t[Oa]=new Set);var r=e+"__bubble";n.has(r)||(Yc(t,e,2,!1),n.add(r))}function La(e,t,n){var r=0;t&&(r|=4),Yc(n,e,r,t)}var us="_reactListening"+Math.random().toString(36).slice(2);function pl(e){if(!e[us]){e[us]=!0,u.forEach(function(n){n!=="selectionchange"&&(um.has(n)||La(n,!1,e),La(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[us]||(t[us]=!0,La("selectionchange",!1,t))}}function Yc(e,t,n,r){switch(Q(t)){case 1:var s=ls;break;case 4:s=v;break;default:s=P}n=s.bind(null,t,n,e),s=void 0,!el||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),r?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function Ia(e,t,n,r,s){var c=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var m=r.tag;if(m===3||m===4){var E=r.stateNode.containerInfo;if(E===s||E.nodeType===8&&E.parentNode===s)break;if(m===4)for(m=r.return;m!==null;){var T=m.tag;if((T===3||T===4)&&(T=m.stateNode.containerInfo,T===s||T.nodeType===8&&T.parentNode===s))return;m=m.return}for(;E!==null;){if(m=Xo(E),m===null)return;if(T=m.tag,T===5||T===6){r=c=m;continue e}E=E.parentNode}}r=r.return}Kl(function(){var B=c,te=dr(n),oe=[];e:{var ee=Dc.get(e);if(ee!==void 0){var me=xe,ve=e;switch(e){case"keypress":if($e(n)===0)break e;case"keydown":case"keyup":me=Af;break;case"focusin":ve="focus",me=Zt;break;case"focusout":ve="blur",me=Zt;break;case"beforeblur":case"afterblur":me=Zt;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":me=Ae;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":me=dt;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":me=Yf;break;case Mc:case zc:case Oc:me=ya;break;case Fc:me=Vf;break;case"scroll":me=Ct;break;case"wheel":me=Xf;break;case"copy":case"cut":case"paste":me=xa;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":me=gc}var be=(t&4)!==0,vt=!be&&e==="scroll",F=be?ee!==null?ee+"Capture":null:ee;be=[];for(var R=B,A;R!==null;){A=R;var ae=A.stateNode;if(A.tag===5&&ae!==null&&(A=ae,F!==null&&(ae=Oo(R,F),ae!=null&&be.push(hl(R,ae,A)))),vt)break;R=R.return}0<be.length&&(ee=new me(ee,ve,null,n,te),oe.push({event:ee,listeners:be}))}}if((t&7)===0){e:{if(ee=e==="mouseover"||e==="pointerover",me=e==="mouseout"||e==="pointerout",ee&&n!==ur&&(ve=n.relatedTarget||n.fromElement)&&(Xo(ve)||ve[no]))break e;if((me||ee)&&(ee=te.window===te?te:(ee=te.ownerDocument)?ee.defaultView||ee.parentWindow:window,me?(ve=n.relatedTarget||n.toElement,me=B,ve=ve?Xo(ve):null,ve!==null&&(vt=xt(ve),ve!==vt||ve.tag!==5&&ve.tag!==6)&&(ve=null)):(me=null,ve=B),me!==ve)){if(be=Ae,ae="onMouseLeave",F="onMouseEnter",R="mouse",(e==="pointerout"||e==="pointerover")&&(be=gc,ae="onPointerLeave",F="onPointerEnter",R="pointer"),vt=me==null?ee:Pr(me),A=ve==null?ee:Pr(ve),ee=new be(ae,R+"leave",me,n,te),ee.target=vt,ee.relatedTarget=A,ae=null,Xo(te)===B&&(be=new be(F,R+"enter",ve,n,te),be.target=A,be.relatedTarget=vt,ae=be),vt=ae,me&&ve)t:{for(be=me,F=ve,R=0,A=be;A;A=Er(A))R++;for(A=0,ae=F;ae;ae=Er(ae))A++;for(;0<R-A;)be=Er(be),R--;for(;0<A-R;)F=Er(F),A--;for(;R--;){if(be===F||F!==null&&be===F.alternate)break t;be=Er(be),F=Er(F)}be=null}else be=null;me!==null&&Hc(oe,ee,me,be,!1),ve!==null&&vt!==null&&Hc(oe,vt,ve,be,!0)}}e:{if(ee=B?Pr(B):window,me=ee.nodeName&&ee.nodeName.toLowerCase(),me==="select"||me==="input"&&ee.type==="file")var we=em;else if(kc(ee))if(Sc)we=rm;else{we=nm;var Le=tm}else(me=ee.nodeName)&&me.toLowerCase()==="input"&&(ee.type==="checkbox"||ee.type==="radio")&&(we=om);if(we&&(we=we(e,B))){Cc(oe,we,n,te);break e}Le&&Le(e,ee,B),e==="focusout"&&(Le=ee._wrapperState)&&Le.controlled&&ee.type==="number"&&Xn(ee,"number",ee.value)}switch(Le=B?Pr(B):window,e){case"focusin":(kc(Le)||Le.contentEditable==="true")&&(Sr=Le,Sa=B,fl=null);break;case"focusout":fl=Sa=Sr=null;break;case"mousedown":ja=!0;break;case"contextmenu":case"mouseup":case"dragend":ja=!1,Rc(oe,n,te);break;case"selectionchange":if(am)break;case"keydown":case"keyup":Rc(oe,n,te)}var Ie;if(ba)e:{switch(e){case"compositionstart":var Me="onCompositionStart";break e;case"compositionend":Me="onCompositionEnd";break e;case"compositionupdate":Me="onCompositionUpdate";break e}Me=void 0}else Cr?bc(e,n)&&(Me="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(Me="onCompositionStart");Me&&(yc&&n.locale!=="ko"&&(Cr||Me!=="onCompositionStart"?Me==="onCompositionEnd"&&Cr&&(Ie=Ce()):(q=te,ye="value"in q?q.value:q.textContent,Cr=!0)),Le=ds(B,Me),0<Le.length&&(Me=new _c(Me,e,null,n,te),oe.push({event:Me,listeners:Le}),Ie?Me.data=Ie:(Ie=wc(n),Ie!==null&&(Me.data=Ie)))),(Ie=Gf?Kf(e,n):Zf(e,n))&&(B=ds(B,"onBeforeInput"),0<B.length&&(te=new _c("onBeforeInput","beforeinput",null,n,te),oe.push({event:te,listeners:B}),te.data=Ie))}Wc(oe,t)})}function hl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ds(e,t){for(var n=t+"Capture",r=[];e!==null;){var s=e,c=s.stateNode;s.tag===5&&c!==null&&(s=c,c=Oo(e,n),c!=null&&r.unshift(hl(e,c,s)),c=Oo(e,t),c!=null&&r.push(hl(e,c,s))),e=e.return}return r}function Er(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Hc(e,t,n,r,s){for(var c=t._reactName,m=[];n!==null&&n!==r;){var E=n,T=E.alternate,B=E.stateNode;if(T!==null&&T===r)break;E.tag===5&&B!==null&&(E=B,s?(T=Oo(n,c),T!=null&&m.unshift(hl(n,T,E))):s||(T=Oo(n,c),T!=null&&m.push(hl(n,T,E)))),n=n.return}m.length!==0&&e.push({event:t,listeners:m})}var dm=/\r\n?/g,fm=/\u0000|\uFFFD/g;function Vc(e){return(typeof e=="string"?e:""+e).replace(dm,`
`).replace(fm,"")}function fs(e,t,n){if(t=Vc(t),Vc(e)!==t&&n)throw Error(i(425))}function ms(){}var Ta=null,Ra=null;function $a(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ma=typeof setTimeout=="function"?setTimeout:void 0,mm=typeof clearTimeout=="function"?clearTimeout:void 0,Uc=typeof Promise=="function"?Promise:void 0,pm=typeof queueMicrotask=="function"?queueMicrotask:typeof Uc<"u"?function(e){return Uc.resolve(null).then(e).catch(hm)}:Ma;function hm(e){setTimeout(function(){throw e})}function za(e,t){var n=t,r=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(r===0){e.removeChild(s),_o(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=s}while(n);_o(t)}function yo(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Xc(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Nr=Math.random().toString(36).slice(2),Wn="__reactFiber$"+Nr,_l="__reactProps$"+Nr,no="__reactContainer$"+Nr,Oa="__reactEvents$"+Nr,_m="__reactListeners$"+Nr,gm="__reactHandles$"+Nr;function Xo(e){var t=e[Wn];if(t)return t;for(var n=e.parentNode;n;){if(t=n[no]||n[Wn]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Xc(e);e!==null;){if(n=e[Wn])return n;e=Xc(e)}return t}e=n,n=e.parentNode}return null}function gl(e){return e=e[Wn]||e[no],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Pr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(i(33))}function ps(e){return e[_l]||null}var Fa=[],Lr=-1;function xo(e){return{current:e}}function it(e){0>Lr||(e.current=Fa[Lr],Fa[Lr]=null,Lr--)}function lt(e,t){Lr++,Fa[Lr]=e.current,e.current=t}var vo={},Bt=xo(vo),Jt=xo(!1),Qo=vo;function Ir(e,t){var n=e.type.contextTypes;if(!n)return vo;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var s={},c;for(c in n)s[c]=t[c];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=s),s}function qt(e){return e=e.childContextTypes,e!=null}function hs(){it(Jt),it(Bt)}function Qc(e,t,n){if(Bt.current!==vo)throw Error(i(168));lt(Bt,t),lt(Jt,n)}function Gc(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var s in r)if(!(s in t))throw Error(i(108,Be(e)||"Unknown",s));return V({},n,r)}function _s(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||vo,Qo=Bt.current,lt(Bt,e),lt(Jt,Jt.current),!0}function Kc(e,t,n){var r=e.stateNode;if(!r)throw Error(i(169));n?(e=Gc(e,t,Qo),r.__reactInternalMemoizedMergedChildContext=e,it(Jt),it(Bt),lt(Bt,e)):it(Jt),lt(Jt,n)}var oo=null,gs=!1,Da=!1;function Zc(e){oo===null?oo=[e]:oo.push(e)}function ym(e){gs=!0,Zc(e)}function bo(){if(!Da&&oo!==null){Da=!0;var e=0,t=Ve;try{var n=oo;for(Ve=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}oo=null,gs=!1}catch(s){throw oo!==null&&(oo=oo.slice(e+1)),pr(nl,bo),s}finally{Ve=t,Da=!1}}return null}var Tr=[],Rr=0,ys=null,xs=0,_n=[],gn=0,Go=null,ro=1,lo="";function Ko(e,t){Tr[Rr++]=xs,Tr[Rr++]=ys,ys=e,xs=t}function Jc(e,t,n){_n[gn++]=ro,_n[gn++]=lo,_n[gn++]=Go,Go=e;var r=ro;e=lo;var s=32-sn(r)-1;r&=~(1<<s),n+=1;var c=32-sn(t)+s;if(30<c){var m=s-s%5;c=(r&(1<<m)-1).toString(32),r>>=m,s-=m,ro=1<<32-sn(t)+s|n<<s|r,lo=c+e}else ro=1<<c|n<<s|r,lo=e}function Aa(e){e.return!==null&&(Ko(e,1),Jc(e,1,0))}function Ba(e){for(;e===ys;)ys=Tr[--Rr],Tr[Rr]=null,xs=Tr[--Rr],Tr[Rr]=null;for(;e===Go;)Go=_n[--gn],_n[gn]=null,lo=_n[--gn],_n[gn]=null,ro=_n[--gn],_n[gn]=null}var dn=null,fn=null,ft=!1,En=null;function qc(e,t){var n=bn(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function eu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,dn=e,fn=yo(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,dn=e,fn=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Go!==null?{id:ro,overflow:lo}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=bn(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,dn=e,fn=null,!0):!1;default:return!1}}function Wa(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Ya(e){if(ft){var t=fn;if(t){var n=t;if(!eu(e,t)){if(Wa(e))throw Error(i(418));t=yo(n.nextSibling);var r=dn;t&&eu(e,t)?qc(r,n):(e.flags=e.flags&-4097|2,ft=!1,dn=e)}}else{if(Wa(e))throw Error(i(418));e.flags=e.flags&-4097|2,ft=!1,dn=e}}}function tu(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;dn=e}function vs(e){if(e!==dn)return!1;if(!ft)return tu(e),ft=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!$a(e.type,e.memoizedProps)),t&&(t=fn)){if(Wa(e))throw nu(),Error(i(418));for(;t;)qc(e,t),t=yo(t.nextSibling)}if(tu(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(i(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){fn=yo(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}fn=null}}else fn=dn?yo(e.stateNode.nextSibling):null;return!0}function nu(){for(var e=fn;e;)e=yo(e.nextSibling)}function $r(){fn=dn=null,ft=!1}function Ha(e){En===null?En=[e]:En.push(e)}var xm=le.ReactCurrentBatchConfig;function yl(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(i(309));var r=n.stateNode}if(!r)throw Error(i(147,e));var s=r,c=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===c?t.ref:(t=function(m){var E=s.refs;m===null?delete E[c]:E[c]=m},t._stringRef=c,t)}if(typeof e!="string")throw Error(i(284));if(!n._owner)throw Error(i(290,e))}return e}function bs(e,t){throw e=Object.prototype.toString.call(t),Error(i(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function ou(e){var t=e._init;return t(e._payload)}function ru(e){function t(F,R){if(e){var A=F.deletions;A===null?(F.deletions=[R],F.flags|=16):A.push(R)}}function n(F,R){if(!e)return null;for(;R!==null;)t(F,R),R=R.sibling;return null}function r(F,R){for(F=new Map;R!==null;)R.key!==null?F.set(R.key,R):F.set(R.index,R),R=R.sibling;return F}function s(F,R){return F=Po(F,R),F.index=0,F.sibling=null,F}function c(F,R,A){return F.index=A,e?(A=F.alternate,A!==null?(A=A.index,A<R?(F.flags|=2,R):A):(F.flags|=2,R)):(F.flags|=1048576,R)}function m(F){return e&&F.alternate===null&&(F.flags|=2),F}function E(F,R,A,ae){return R===null||R.tag!==6?(R=Mi(A,F.mode,ae),R.return=F,R):(R=s(R,A),R.return=F,R)}function T(F,R,A,ae){var we=A.type;return we===he?te(F,R,A.props.children,ae,A.key):R!==null&&(R.elementType===we||typeof we=="object"&&we!==null&&we.$$typeof===O&&ou(we)===R.type)?(ae=s(R,A.props),ae.ref=yl(F,R,A),ae.return=F,ae):(ae=Vs(A.type,A.key,A.props,null,F.mode,ae),ae.ref=yl(F,R,A),ae.return=F,ae)}function B(F,R,A,ae){return R===null||R.tag!==4||R.stateNode.containerInfo!==A.containerInfo||R.stateNode.implementation!==A.implementation?(R=zi(A,F.mode,ae),R.return=F,R):(R=s(R,A.children||[]),R.return=F,R)}function te(F,R,A,ae,we){return R===null||R.tag!==7?(R=rr(A,F.mode,ae,we),R.return=F,R):(R=s(R,A),R.return=F,R)}function oe(F,R,A){if(typeof R=="string"&&R!==""||typeof R=="number")return R=Mi(""+R,F.mode,A),R.return=F,R;if(typeof R=="object"&&R!==null){switch(R.$$typeof){case ne:return A=Vs(R.type,R.key,R.props,null,F.mode,A),A.ref=yl(F,null,R),A.return=F,A;case ie:return R=zi(R,F.mode,A),R.return=F,R;case O:var ae=R._init;return oe(F,ae(R._payload),A)}if(Qn(R)||z(R))return R=rr(R,F.mode,A,null),R.return=F,R;bs(F,R)}return null}function ee(F,R,A,ae){var we=R!==null?R.key:null;if(typeof A=="string"&&A!==""||typeof A=="number")return we!==null?null:E(F,R,""+A,ae);if(typeof A=="object"&&A!==null){switch(A.$$typeof){case ne:return A.key===we?T(F,R,A,ae):null;case ie:return A.key===we?B(F,R,A,ae):null;case O:return we=A._init,ee(F,R,we(A._payload),ae)}if(Qn(A)||z(A))return we!==null?null:te(F,R,A,ae,null);bs(F,A)}return null}function me(F,R,A,ae,we){if(typeof ae=="string"&&ae!==""||typeof ae=="number")return F=F.get(A)||null,E(R,F,""+ae,we);if(typeof ae=="object"&&ae!==null){switch(ae.$$typeof){case ne:return F=F.get(ae.key===null?A:ae.key)||null,T(R,F,ae,we);case ie:return F=F.get(ae.key===null?A:ae.key)||null,B(R,F,ae,we);case O:var Le=ae._init;return me(F,R,A,Le(ae._payload),we)}if(Qn(ae)||z(ae))return F=F.get(A)||null,te(R,F,ae,we,null);bs(R,ae)}return null}function ve(F,R,A,ae){for(var we=null,Le=null,Ie=R,Me=R=0,Rt=null;Ie!==null&&Me<A.length;Me++){Ie.index>Me?(Rt=Ie,Ie=null):Rt=Ie.sibling;var Ke=ee(F,Ie,A[Me],ae);if(Ke===null){Ie===null&&(Ie=Rt);break}e&&Ie&&Ke.alternate===null&&t(F,Ie),R=c(Ke,R,Me),Le===null?we=Ke:Le.sibling=Ke,Le=Ke,Ie=Rt}if(Me===A.length)return n(F,Ie),ft&&Ko(F,Me),we;if(Ie===null){for(;Me<A.length;Me++)Ie=oe(F,A[Me],ae),Ie!==null&&(R=c(Ie,R,Me),Le===null?we=Ie:Le.sibling=Ie,Le=Ie);return ft&&Ko(F,Me),we}for(Ie=r(F,Ie);Me<A.length;Me++)Rt=me(Ie,F,Me,A[Me],ae),Rt!==null&&(e&&Rt.alternate!==null&&Ie.delete(Rt.key===null?Me:Rt.key),R=c(Rt,R,Me),Le===null?we=Rt:Le.sibling=Rt,Le=Rt);return e&&Ie.forEach(function(Lo){return t(F,Lo)}),ft&&Ko(F,Me),we}function be(F,R,A,ae){var we=z(A);if(typeof we!="function")throw Error(i(150));if(A=we.call(A),A==null)throw Error(i(151));for(var Le=we=null,Ie=R,Me=R=0,Rt=null,Ke=A.next();Ie!==null&&!Ke.done;Me++,Ke=A.next()){Ie.index>Me?(Rt=Ie,Ie=null):Rt=Ie.sibling;var Lo=ee(F,Ie,Ke.value,ae);if(Lo===null){Ie===null&&(Ie=Rt);break}e&&Ie&&Lo.alternate===null&&t(F,Ie),R=c(Lo,R,Me),Le===null?we=Lo:Le.sibling=Lo,Le=Lo,Ie=Rt}if(Ke.done)return n(F,Ie),ft&&Ko(F,Me),we;if(Ie===null){for(;!Ke.done;Me++,Ke=A.next())Ke=oe(F,Ke.value,ae),Ke!==null&&(R=c(Ke,R,Me),Le===null?we=Ke:Le.sibling=Ke,Le=Ke);return ft&&Ko(F,Me),we}for(Ie=r(F,Ie);!Ke.done;Me++,Ke=A.next())Ke=me(Ie,F,Me,Ke.value,ae),Ke!==null&&(e&&Ke.alternate!==null&&Ie.delete(Ke.key===null?Me:Ke.key),R=c(Ke,R,Me),Le===null?we=Ke:Le.sibling=Ke,Le=Ke);return e&&Ie.forEach(function(Jm){return t(F,Jm)}),ft&&Ko(F,Me),we}function vt(F,R,A,ae){if(typeof A=="object"&&A!==null&&A.type===he&&A.key===null&&(A=A.props.children),typeof A=="object"&&A!==null){switch(A.$$typeof){case ne:e:{for(var we=A.key,Le=R;Le!==null;){if(Le.key===we){if(we=A.type,we===he){if(Le.tag===7){n(F,Le.sibling),R=s(Le,A.props.children),R.return=F,F=R;break e}}else if(Le.elementType===we||typeof we=="object"&&we!==null&&we.$$typeof===O&&ou(we)===Le.type){n(F,Le.sibling),R=s(Le,A.props),R.ref=yl(F,Le,A),R.return=F,F=R;break e}n(F,Le);break}else t(F,Le);Le=Le.sibling}A.type===he?(R=rr(A.props.children,F.mode,ae,A.key),R.return=F,F=R):(ae=Vs(A.type,A.key,A.props,null,F.mode,ae),ae.ref=yl(F,R,A),ae.return=F,F=ae)}return m(F);case ie:e:{for(Le=A.key;R!==null;){if(R.key===Le)if(R.tag===4&&R.stateNode.containerInfo===A.containerInfo&&R.stateNode.implementation===A.implementation){n(F,R.sibling),R=s(R,A.children||[]),R.return=F,F=R;break e}else{n(F,R);break}else t(F,R);R=R.sibling}R=zi(A,F.mode,ae),R.return=F,F=R}return m(F);case O:return Le=A._init,vt(F,R,Le(A._payload),ae)}if(Qn(A))return ve(F,R,A,ae);if(z(A))return be(F,R,A,ae);bs(F,A)}return typeof A=="string"&&A!==""||typeof A=="number"?(A=""+A,R!==null&&R.tag===6?(n(F,R.sibling),R=s(R,A),R.return=F,F=R):(n(F,R),R=Mi(A,F.mode,ae),R.return=F,F=R),m(F)):n(F,R)}return vt}var Mr=ru(!0),lu=ru(!1),ws=xo(null),ks=null,zr=null,Va=null;function Ua(){Va=zr=ks=null}function Xa(e){var t=ws.current;it(ws),e._currentValue=t}function Qa(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Or(e,t){ks=e,Va=zr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(en=!0),e.firstContext=null)}function yn(e){var t=e._currentValue;if(Va!==e)if(e={context:e,memoizedValue:t,next:null},zr===null){if(ks===null)throw Error(i(308));zr=e,ks.dependencies={lanes:0,firstContext:e}}else zr=zr.next=e;return t}var Zo=null;function Ga(e){Zo===null?Zo=[e]:Zo.push(e)}function su(e,t,n,r){var s=t.interleaved;return s===null?(n.next=n,Ga(t)):(n.next=s.next,s.next=n),t.interleaved=n,so(e,r)}function so(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var wo=!1;function Ka(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function au(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function ao(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function ko(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(Qe&2)!==0){var s=r.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),r.pending=t,so(e,n)}return s=r.interleaved,s===null?(t.next=t,Ga(r)):(t.next=s.next,s.next=t),r.interleaved=t,so(e,n)}function Cs(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,yr(e,n)}}function iu(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var s=null,c=null;if(n=n.firstBaseUpdate,n!==null){do{var m={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};c===null?s=c=m:c=c.next=m,n=n.next}while(n!==null);c===null?s=c=t:c=c.next=t}else s=c=t;n={baseState:r.baseState,firstBaseUpdate:s,lastBaseUpdate:c,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Ss(e,t,n,r){var s=e.updateQueue;wo=!1;var c=s.firstBaseUpdate,m=s.lastBaseUpdate,E=s.shared.pending;if(E!==null){s.shared.pending=null;var T=E,B=T.next;T.next=null,m===null?c=B:m.next=B,m=T;var te=e.alternate;te!==null&&(te=te.updateQueue,E=te.lastBaseUpdate,E!==m&&(E===null?te.firstBaseUpdate=B:E.next=B,te.lastBaseUpdate=T))}if(c!==null){var oe=s.baseState;m=0,te=B=T=null,E=c;do{var ee=E.lane,me=E.eventTime;if((r&ee)===ee){te!==null&&(te=te.next={eventTime:me,lane:0,tag:E.tag,payload:E.payload,callback:E.callback,next:null});e:{var ve=e,be=E;switch(ee=t,me=n,be.tag){case 1:if(ve=be.payload,typeof ve=="function"){oe=ve.call(me,oe,ee);break e}oe=ve;break e;case 3:ve.flags=ve.flags&-65537|128;case 0:if(ve=be.payload,ee=typeof ve=="function"?ve.call(me,oe,ee):ve,ee==null)break e;oe=V({},oe,ee);break e;case 2:wo=!0}}E.callback!==null&&E.lane!==0&&(e.flags|=64,ee=s.effects,ee===null?s.effects=[E]:ee.push(E))}else me={eventTime:me,lane:ee,tag:E.tag,payload:E.payload,callback:E.callback,next:null},te===null?(B=te=me,T=oe):te=te.next=me,m|=ee;if(E=E.next,E===null){if(E=s.shared.pending,E===null)break;ee=E,E=ee.next,ee.next=null,s.lastBaseUpdate=ee,s.shared.pending=null}}while(!0);if(te===null&&(T=oe),s.baseState=T,s.firstBaseUpdate=B,s.lastBaseUpdate=te,t=s.shared.interleaved,t!==null){s=t;do m|=s.lane,s=s.next;while(s!==t)}else c===null&&(s.shared.lanes=0);er|=m,e.lanes=m,e.memoizedState=oe}}function cu(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],s=r.callback;if(s!==null){if(r.callback=null,r=n,typeof s!="function")throw Error(i(191,s));s.call(r)}}}var xl={},Yn=xo(xl),vl=xo(xl),bl=xo(xl);function Jo(e){if(e===xl)throw Error(i(174));return e}function Za(e,t){switch(lt(bl,t),lt(vl,e),lt(Yn,xl),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:ir(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=ir(t,e)}it(Yn),lt(Yn,t)}function Fr(){it(Yn),it(vl),it(bl)}function uu(e){Jo(bl.current);var t=Jo(Yn.current),n=ir(t,e.type);t!==n&&(lt(vl,e),lt(Yn,n))}function Ja(e){vl.current===e&&(it(Yn),it(vl))}var ht=xo(0);function js(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var qa=[];function ei(){for(var e=0;e<qa.length;e++)qa[e]._workInProgressVersionPrimary=null;qa.length=0}var Es=le.ReactCurrentDispatcher,ti=le.ReactCurrentBatchConfig,qo=0,_t=null,Nt=null,It=null,Ns=!1,wl=!1,kl=0,vm=0;function Wt(){throw Error(i(321))}function ni(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!jn(e[n],t[n]))return!1;return!0}function oi(e,t,n,r,s,c){if(qo=c,_t=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Es.current=e===null||e.memoizedState===null?Cm:Sm,e=n(r,s),wl){c=0;do{if(wl=!1,kl=0,25<=c)throw Error(i(301));c+=1,It=Nt=null,t.updateQueue=null,Es.current=jm,e=n(r,s)}while(wl)}if(Es.current=Is,t=Nt!==null&&Nt.next!==null,qo=0,It=Nt=_t=null,Ns=!1,t)throw Error(i(300));return e}function ri(){var e=kl!==0;return kl=0,e}function Hn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return It===null?_t.memoizedState=It=e:It=It.next=e,It}function xn(){if(Nt===null){var e=_t.alternate;e=e!==null?e.memoizedState:null}else e=Nt.next;var t=It===null?_t.memoizedState:It.next;if(t!==null)It=t,Nt=e;else{if(e===null)throw Error(i(310));Nt=e,e={memoizedState:Nt.memoizedState,baseState:Nt.baseState,baseQueue:Nt.baseQueue,queue:Nt.queue,next:null},It===null?_t.memoizedState=It=e:It=It.next=e}return It}function Cl(e,t){return typeof t=="function"?t(e):t}function li(e){var t=xn(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=Nt,s=r.baseQueue,c=n.pending;if(c!==null){if(s!==null){var m=s.next;s.next=c.next,c.next=m}r.baseQueue=s=c,n.pending=null}if(s!==null){c=s.next,r=r.baseState;var E=m=null,T=null,B=c;do{var te=B.lane;if((qo&te)===te)T!==null&&(T=T.next={lane:0,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null}),r=B.hasEagerState?B.eagerState:e(r,B.action);else{var oe={lane:te,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null};T===null?(E=T=oe,m=r):T=T.next=oe,_t.lanes|=te,er|=te}B=B.next}while(B!==null&&B!==c);T===null?m=r:T.next=E,jn(r,t.memoizedState)||(en=!0),t.memoizedState=r,t.baseState=m,t.baseQueue=T,n.lastRenderedState=r}if(e=n.interleaved,e!==null){s=e;do c=s.lane,_t.lanes|=c,er|=c,s=s.next;while(s!==e)}else s===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function si(e){var t=xn(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,s=n.pending,c=t.memoizedState;if(s!==null){n.pending=null;var m=s=s.next;do c=e(c,m.action),m=m.next;while(m!==s);jn(c,t.memoizedState)||(en=!0),t.memoizedState=c,t.baseQueue===null&&(t.baseState=c),n.lastRenderedState=c}return[c,r]}function du(){}function fu(e,t){var n=_t,r=xn(),s=t(),c=!jn(r.memoizedState,s);if(c&&(r.memoizedState=s,en=!0),r=r.queue,ai(hu.bind(null,n,r,e),[e]),r.getSnapshot!==t||c||It!==null&&It.memoizedState.tag&1){if(n.flags|=2048,Sl(9,pu.bind(null,n,r,s,t),void 0,null),Tt===null)throw Error(i(349));(qo&30)!==0||mu(n,t,s)}return s}function mu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=_t.updateQueue,t===null?(t={lastEffect:null,stores:null},_t.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function pu(e,t,n,r){t.value=n,t.getSnapshot=r,_u(t)&&gu(e)}function hu(e,t,n){return n(function(){_u(t)&&gu(e)})}function _u(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!jn(e,n)}catch{return!0}}function gu(e){var t=so(e,1);t!==null&&In(t,e,1,-1)}function yu(e){var t=Hn();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Cl,lastRenderedState:e},t.queue=e,e=e.dispatch=km.bind(null,_t,e),[t.memoizedState,e]}function Sl(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=_t.updateQueue,t===null?(t={lastEffect:null,stores:null},_t.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function xu(){return xn().memoizedState}function Ps(e,t,n,r){var s=Hn();_t.flags|=e,s.memoizedState=Sl(1|t,n,void 0,r===void 0?null:r)}function Ls(e,t,n,r){var s=xn();r=r===void 0?null:r;var c=void 0;if(Nt!==null){var m=Nt.memoizedState;if(c=m.destroy,r!==null&&ni(r,m.deps)){s.memoizedState=Sl(t,n,c,r);return}}_t.flags|=e,s.memoizedState=Sl(1|t,n,c,r)}function vu(e,t){return Ps(8390656,8,e,t)}function ai(e,t){return Ls(2048,8,e,t)}function bu(e,t){return Ls(4,2,e,t)}function wu(e,t){return Ls(4,4,e,t)}function ku(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Cu(e,t,n){return n=n!=null?n.concat([e]):null,Ls(4,4,ku.bind(null,t,e),n)}function ii(){}function Su(e,t){var n=xn();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&ni(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ju(e,t){var n=xn();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&ni(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Eu(e,t,n){return(qo&21)===0?(e.baseState&&(e.baseState=!1,en=!0),e.memoizedState=n):(jn(n,t)||(n=rl(),_t.lanes|=n,er|=n,e.baseState=!0),t)}function bm(e,t){var n=Ve;Ve=n!==0&&4>n?n:4,e(!0);var r=ti.transition;ti.transition={};try{e(!1),t()}finally{Ve=n,ti.transition=r}}function Nu(){return xn().memoizedState}function wm(e,t,n){var r=Eo(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Pu(e))Lu(t,n);else if(n=su(e,t,n,r),n!==null){var s=Xt();In(n,e,r,s),Iu(n,t,r)}}function km(e,t,n){var r=Eo(e),s={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Pu(e))Lu(t,s);else{var c=e.alternate;if(e.lanes===0&&(c===null||c.lanes===0)&&(c=t.lastRenderedReducer,c!==null))try{var m=t.lastRenderedState,E=c(m,n);if(s.hasEagerState=!0,s.eagerState=E,jn(E,m)){var T=t.interleaved;T===null?(s.next=s,Ga(t)):(s.next=T.next,T.next=s),t.interleaved=s;return}}catch{}finally{}n=su(e,t,s,r),n!==null&&(s=Xt(),In(n,e,r,s),Iu(n,t,r))}}function Pu(e){var t=e.alternate;return e===_t||t!==null&&t===_t}function Lu(e,t){wl=Ns=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Iu(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,yr(e,n)}}var Is={readContext:yn,useCallback:Wt,useContext:Wt,useEffect:Wt,useImperativeHandle:Wt,useInsertionEffect:Wt,useLayoutEffect:Wt,useMemo:Wt,useReducer:Wt,useRef:Wt,useState:Wt,useDebugValue:Wt,useDeferredValue:Wt,useTransition:Wt,useMutableSource:Wt,useSyncExternalStore:Wt,useId:Wt,unstable_isNewReconciler:!1},Cm={readContext:yn,useCallback:function(e,t){return Hn().memoizedState=[e,t===void 0?null:t],e},useContext:yn,useEffect:vu,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Ps(4194308,4,ku.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Ps(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ps(4,2,e,t)},useMemo:function(e,t){var n=Hn();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Hn();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=wm.bind(null,_t,e),[r.memoizedState,e]},useRef:function(e){var t=Hn();return e={current:e},t.memoizedState=e},useState:yu,useDebugValue:ii,useDeferredValue:function(e){return Hn().memoizedState=e},useTransition:function(){var e=yu(!1),t=e[0];return e=bm.bind(null,e[1]),Hn().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=_t,s=Hn();if(ft){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),Tt===null)throw Error(i(349));(qo&30)!==0||mu(r,t,n)}s.memoizedState=n;var c={value:n,getSnapshot:t};return s.queue=c,vu(hu.bind(null,r,c,e),[e]),r.flags|=2048,Sl(9,pu.bind(null,r,c,n,t),void 0,null),n},useId:function(){var e=Hn(),t=Tt.identifierPrefix;if(ft){var n=lo,r=ro;n=(r&~(1<<32-sn(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=kl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=vm++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Sm={readContext:yn,useCallback:Su,useContext:yn,useEffect:ai,useImperativeHandle:Cu,useInsertionEffect:bu,useLayoutEffect:wu,useMemo:ju,useReducer:li,useRef:xu,useState:function(){return li(Cl)},useDebugValue:ii,useDeferredValue:function(e){var t=xn();return Eu(t,Nt.memoizedState,e)},useTransition:function(){var e=li(Cl)[0],t=xn().memoizedState;return[e,t]},useMutableSource:du,useSyncExternalStore:fu,useId:Nu,unstable_isNewReconciler:!1},jm={readContext:yn,useCallback:Su,useContext:yn,useEffect:ai,useImperativeHandle:Cu,useInsertionEffect:bu,useLayoutEffect:wu,useMemo:ju,useReducer:si,useRef:xu,useState:function(){return si(Cl)},useDebugValue:ii,useDeferredValue:function(e){var t=xn();return Nt===null?t.memoizedState=e:Eu(t,Nt.memoizedState,e)},useTransition:function(){var e=si(Cl)[0],t=xn().memoizedState;return[e,t]},useMutableSource:du,useSyncExternalStore:fu,useId:Nu,unstable_isNewReconciler:!1};function Nn(e,t){if(e&&e.defaultProps){t=V({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ci(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:V({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ts={isMounted:function(e){return(e=e._reactInternals)?xt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Xt(),s=Eo(e),c=ao(r,s);c.payload=t,n!=null&&(c.callback=n),t=ko(e,c,s),t!==null&&(In(t,e,s,r),Cs(t,e,s))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Xt(),s=Eo(e),c=ao(r,s);c.tag=1,c.payload=t,n!=null&&(c.callback=n),t=ko(e,c,s),t!==null&&(In(t,e,s,r),Cs(t,e,s))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Xt(),r=Eo(e),s=ao(n,r);s.tag=2,t!=null&&(s.callback=t),t=ko(e,s,r),t!==null&&(In(t,e,r,n),Cs(t,e,r))}};function Tu(e,t,n,r,s,c,m){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,c,m):t.prototype&&t.prototype.isPureReactComponent?!dl(n,r)||!dl(s,c):!0}function Ru(e,t,n){var r=!1,s=vo,c=t.contextType;return typeof c=="object"&&c!==null?c=yn(c):(s=qt(t)?Qo:Bt.current,r=t.contextTypes,c=(r=r!=null)?Ir(e,s):vo),t=new t(n,c),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ts,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=c),t}function $u(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Ts.enqueueReplaceState(t,t.state,null)}function ui(e,t,n,r){var s=e.stateNode;s.props=n,s.state=e.memoizedState,s.refs={},Ka(e);var c=t.contextType;typeof c=="object"&&c!==null?s.context=yn(c):(c=qt(t)?Qo:Bt.current,s.context=Ir(e,c)),s.state=e.memoizedState,c=t.getDerivedStateFromProps,typeof c=="function"&&(ci(e,t,c,n),s.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(t=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),t!==s.state&&Ts.enqueueReplaceState(s,s.state,null),Ss(e,n,s,r),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function Dr(e,t){try{var n="",r=t;do n+=se(r),r=r.return;while(r);var s=n}catch(c){s=`
Error generating stack: `+c.message+`
`+c.stack}return{value:e,source:t,stack:s,digest:null}}function di(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function fi(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Em=typeof WeakMap=="function"?WeakMap:Map;function Mu(e,t,n){n=ao(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Ds||(Ds=!0,Ei=r),fi(e,t)},n}function zu(e,t,n){n=ao(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var s=t.value;n.payload=function(){return r(s)},n.callback=function(){fi(e,t)}}var c=e.stateNode;return c!==null&&typeof c.componentDidCatch=="function"&&(n.callback=function(){fi(e,t),typeof r!="function"&&(So===null?So=new Set([this]):So.add(this));var m=t.stack;this.componentDidCatch(t.value,{componentStack:m!==null?m:""})}),n}function Ou(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Em;var s=new Set;r.set(t,s)}else s=r.get(t),s===void 0&&(s=new Set,r.set(t,s));s.has(n)||(s.add(n),e=Bm.bind(null,e,t,n),t.then(e,e))}function Fu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Du(e,t,n,r,s){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=ao(-1,1),t.tag=2,ko(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=s,e)}var Nm=le.ReactCurrentOwner,en=!1;function Ut(e,t,n,r){t.child=e===null?lu(t,null,n,r):Mr(t,e.child,n,r)}function Au(e,t,n,r,s){n=n.render;var c=t.ref;return Or(t,s),r=oi(e,t,n,r,c,s),n=ri(),e!==null&&!en?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,io(e,t,s)):(ft&&n&&Aa(t),t.flags|=1,Ut(e,t,r,s),t.child)}function Bu(e,t,n,r,s){if(e===null){var c=n.type;return typeof c=="function"&&!$i(c)&&c.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=c,Wu(e,t,c,r,s)):(e=Vs(n.type,null,r,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(c=e.child,(e.lanes&s)===0){var m=c.memoizedProps;if(n=n.compare,n=n!==null?n:dl,n(m,r)&&e.ref===t.ref)return io(e,t,s)}return t.flags|=1,e=Po(c,r),e.ref=t.ref,e.return=t,t.child=e}function Wu(e,t,n,r,s){if(e!==null){var c=e.memoizedProps;if(dl(c,r)&&e.ref===t.ref)if(en=!1,t.pendingProps=r=c,(e.lanes&s)!==0)(e.flags&131072)!==0&&(en=!0);else return t.lanes=e.lanes,io(e,t,s)}return mi(e,t,n,r,s)}function Yu(e,t,n){var r=t.pendingProps,s=r.children,c=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},lt(Br,mn),mn|=n;else{if((n&1073741824)===0)return e=c!==null?c.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,lt(Br,mn),mn|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=c!==null?c.baseLanes:n,lt(Br,mn),mn|=r}else c!==null?(r=c.baseLanes|n,t.memoizedState=null):r=n,lt(Br,mn),mn|=r;return Ut(e,t,s,n),t.child}function Hu(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function mi(e,t,n,r,s){var c=qt(n)?Qo:Bt.current;return c=Ir(t,c),Or(t,s),n=oi(e,t,n,r,c,s),r=ri(),e!==null&&!en?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,io(e,t,s)):(ft&&r&&Aa(t),t.flags|=1,Ut(e,t,n,s),t.child)}function Vu(e,t,n,r,s){if(qt(n)){var c=!0;_s(t)}else c=!1;if(Or(t,s),t.stateNode===null)$s(e,t),Ru(t,n,r),ui(t,n,r,s),r=!0;else if(e===null){var m=t.stateNode,E=t.memoizedProps;m.props=E;var T=m.context,B=n.contextType;typeof B=="object"&&B!==null?B=yn(B):(B=qt(n)?Qo:Bt.current,B=Ir(t,B));var te=n.getDerivedStateFromProps,oe=typeof te=="function"||typeof m.getSnapshotBeforeUpdate=="function";oe||typeof m.UNSAFE_componentWillReceiveProps!="function"&&typeof m.componentWillReceiveProps!="function"||(E!==r||T!==B)&&$u(t,m,r,B),wo=!1;var ee=t.memoizedState;m.state=ee,Ss(t,r,m,s),T=t.memoizedState,E!==r||ee!==T||Jt.current||wo?(typeof te=="function"&&(ci(t,n,te,r),T=t.memoizedState),(E=wo||Tu(t,n,E,r,ee,T,B))?(oe||typeof m.UNSAFE_componentWillMount!="function"&&typeof m.componentWillMount!="function"||(typeof m.componentWillMount=="function"&&m.componentWillMount(),typeof m.UNSAFE_componentWillMount=="function"&&m.UNSAFE_componentWillMount()),typeof m.componentDidMount=="function"&&(t.flags|=4194308)):(typeof m.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=T),m.props=r,m.state=T,m.context=B,r=E):(typeof m.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{m=t.stateNode,au(e,t),E=t.memoizedProps,B=t.type===t.elementType?E:Nn(t.type,E),m.props=B,oe=t.pendingProps,ee=m.context,T=n.contextType,typeof T=="object"&&T!==null?T=yn(T):(T=qt(n)?Qo:Bt.current,T=Ir(t,T));var me=n.getDerivedStateFromProps;(te=typeof me=="function"||typeof m.getSnapshotBeforeUpdate=="function")||typeof m.UNSAFE_componentWillReceiveProps!="function"&&typeof m.componentWillReceiveProps!="function"||(E!==oe||ee!==T)&&$u(t,m,r,T),wo=!1,ee=t.memoizedState,m.state=ee,Ss(t,r,m,s);var ve=t.memoizedState;E!==oe||ee!==ve||Jt.current||wo?(typeof me=="function"&&(ci(t,n,me,r),ve=t.memoizedState),(B=wo||Tu(t,n,B,r,ee,ve,T)||!1)?(te||typeof m.UNSAFE_componentWillUpdate!="function"&&typeof m.componentWillUpdate!="function"||(typeof m.componentWillUpdate=="function"&&m.componentWillUpdate(r,ve,T),typeof m.UNSAFE_componentWillUpdate=="function"&&m.UNSAFE_componentWillUpdate(r,ve,T)),typeof m.componentDidUpdate=="function"&&(t.flags|=4),typeof m.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof m.componentDidUpdate!="function"||E===e.memoizedProps&&ee===e.memoizedState||(t.flags|=4),typeof m.getSnapshotBeforeUpdate!="function"||E===e.memoizedProps&&ee===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=ve),m.props=r,m.state=ve,m.context=T,r=B):(typeof m.componentDidUpdate!="function"||E===e.memoizedProps&&ee===e.memoizedState||(t.flags|=4),typeof m.getSnapshotBeforeUpdate!="function"||E===e.memoizedProps&&ee===e.memoizedState||(t.flags|=1024),r=!1)}return pi(e,t,n,r,c,s)}function pi(e,t,n,r,s,c){Hu(e,t);var m=(t.flags&128)!==0;if(!r&&!m)return s&&Kc(t,n,!1),io(e,t,c);r=t.stateNode,Nm.current=t;var E=m&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&m?(t.child=Mr(t,e.child,null,c),t.child=Mr(t,null,E,c)):Ut(e,t,E,c),t.memoizedState=r.state,s&&Kc(t,n,!0),t.child}function Uu(e){var t=e.stateNode;t.pendingContext?Qc(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Qc(e,t.context,!1),Za(e,t.containerInfo)}function Xu(e,t,n,r,s){return $r(),Ha(s),t.flags|=256,Ut(e,t,n,r),t.child}var hi={dehydrated:null,treeContext:null,retryLane:0};function _i(e){return{baseLanes:e,cachePool:null,transitions:null}}function Qu(e,t,n){var r=t.pendingProps,s=ht.current,c=!1,m=(t.flags&128)!==0,E;if((E=m)||(E=e!==null&&e.memoizedState===null?!1:(s&2)!==0),E?(c=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),lt(ht,s&1),e===null)return Ya(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(m=r.children,e=r.fallback,c?(r=t.mode,c=t.child,m={mode:"hidden",children:m},(r&1)===0&&c!==null?(c.childLanes=0,c.pendingProps=m):c=Us(m,r,0,null),e=rr(e,r,n,null),c.return=t,e.return=t,c.sibling=e,t.child=c,t.child.memoizedState=_i(n),t.memoizedState=hi,e):gi(t,m));if(s=e.memoizedState,s!==null&&(E=s.dehydrated,E!==null))return Pm(e,t,m,r,E,s,n);if(c){c=r.fallback,m=t.mode,s=e.child,E=s.sibling;var T={mode:"hidden",children:r.children};return(m&1)===0&&t.child!==s?(r=t.child,r.childLanes=0,r.pendingProps=T,t.deletions=null):(r=Po(s,T),r.subtreeFlags=s.subtreeFlags&14680064),E!==null?c=Po(E,c):(c=rr(c,m,n,null),c.flags|=2),c.return=t,r.return=t,r.sibling=c,t.child=r,r=c,c=t.child,m=e.child.memoizedState,m=m===null?_i(n):{baseLanes:m.baseLanes|n,cachePool:null,transitions:m.transitions},c.memoizedState=m,c.childLanes=e.childLanes&~n,t.memoizedState=hi,r}return c=e.child,e=c.sibling,r=Po(c,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function gi(e,t){return t=Us({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Rs(e,t,n,r){return r!==null&&Ha(r),Mr(t,e.child,null,n),e=gi(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Pm(e,t,n,r,s,c,m){if(n)return t.flags&256?(t.flags&=-257,r=di(Error(i(422))),Rs(e,t,m,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(c=r.fallback,s=t.mode,r=Us({mode:"visible",children:r.children},s,0,null),c=rr(c,s,m,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,(t.mode&1)!==0&&Mr(t,e.child,null,m),t.child.memoizedState=_i(m),t.memoizedState=hi,c);if((t.mode&1)===0)return Rs(e,t,m,null);if(s.data==="$!"){if(r=s.nextSibling&&s.nextSibling.dataset,r)var E=r.dgst;return r=E,c=Error(i(419)),r=di(c,r,void 0),Rs(e,t,m,r)}if(E=(m&e.childLanes)!==0,en||E){if(r=Tt,r!==null){switch(m&-m){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=(s&(r.suspendedLanes|m))!==0?0:s,s!==0&&s!==c.retryLane&&(c.retryLane=s,so(e,s),In(r,e,s,-1))}return Ri(),r=di(Error(i(421))),Rs(e,t,m,r)}return s.data==="$?"?(t.flags|=128,t.child=e.child,t=Wm.bind(null,e),s._reactRetry=t,null):(e=c.treeContext,fn=yo(s.nextSibling),dn=t,ft=!0,En=null,e!==null&&(_n[gn++]=ro,_n[gn++]=lo,_n[gn++]=Go,ro=e.id,lo=e.overflow,Go=t),t=gi(t,r.children),t.flags|=4096,t)}function Gu(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Qa(e.return,t,n)}function yi(e,t,n,r,s){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:s}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=r,c.tail=n,c.tailMode=s)}function Ku(e,t,n){var r=t.pendingProps,s=r.revealOrder,c=r.tail;if(Ut(e,t,r.children,n),r=ht.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Gu(e,n,t);else if(e.tag===19)Gu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(lt(ht,r),(t.mode&1)===0)t.memoizedState=null;else switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&js(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),yi(t,!1,s,n,c);break;case"backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&js(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}yi(t,!0,n,null,c);break;case"together":yi(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function $s(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function io(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),er|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=Po(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Po(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Lm(e,t,n){switch(t.tag){case 3:Uu(t),$r();break;case 5:uu(t);break;case 1:qt(t.type)&&_s(t);break;case 4:Za(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,s=t.memoizedProps.value;lt(ws,r._currentValue),r._currentValue=s;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(lt(ht,ht.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Qu(e,t,n):(lt(ht,ht.current&1),e=io(e,t,n),e!==null?e.sibling:null);lt(ht,ht.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return Ku(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),lt(ht,ht.current),r)break;return null;case 22:case 23:return t.lanes=0,Yu(e,t,n)}return io(e,t,n)}var Zu,xi,Ju,qu;Zu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},xi=function(){},Ju=function(e,t,n,r){var s=e.memoizedProps;if(s!==r){e=t.stateNode,Jo(Yn.current);var c=null;switch(n){case"input":s=mt(e,s),r=mt(e,r),c=[];break;case"select":s=V({},s,{value:void 0}),r=V({},r,{value:void 0}),c=[];break;case"textarea":s=ar(e,s),r=ar(e,r),c=[];break;default:typeof s.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=ms)}Mo(n,r);var m;n=null;for(B in s)if(!r.hasOwnProperty(B)&&s.hasOwnProperty(B)&&s[B]!=null)if(B==="style"){var E=s[B];for(m in E)E.hasOwnProperty(m)&&(n||(n={}),n[m]="")}else B!=="dangerouslySetInnerHTML"&&B!=="children"&&B!=="suppressContentEditableWarning"&&B!=="suppressHydrationWarning"&&B!=="autoFocus"&&(d.hasOwnProperty(B)?c||(c=[]):(c=c||[]).push(B,null));for(B in r){var T=r[B];if(E=s!=null?s[B]:void 0,r.hasOwnProperty(B)&&T!==E&&(T!=null||E!=null))if(B==="style")if(E){for(m in E)!E.hasOwnProperty(m)||T&&T.hasOwnProperty(m)||(n||(n={}),n[m]="");for(m in T)T.hasOwnProperty(m)&&E[m]!==T[m]&&(n||(n={}),n[m]=T[m])}else n||(c||(c=[]),c.push(B,n)),n=T;else B==="dangerouslySetInnerHTML"?(T=T?T.__html:void 0,E=E?E.__html:void 0,T!=null&&E!==T&&(c=c||[]).push(B,T)):B==="children"?typeof T!="string"&&typeof T!="number"||(c=c||[]).push(B,""+T):B!=="suppressContentEditableWarning"&&B!=="suppressHydrationWarning"&&(d.hasOwnProperty(B)?(T!=null&&B==="onScroll"&&at("scroll",e),c||E===T||(c=[])):(c=c||[]).push(B,T))}n&&(c=c||[]).push("style",n);var B=c;(t.updateQueue=B)&&(t.flags|=4)}},qu=function(e,t,n,r){n!==r&&(t.flags|=4)};function jl(e,t){if(!ft)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Yt(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,r|=s.subtreeFlags&14680064,r|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,r|=s.subtreeFlags,r|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Im(e,t,n){var r=t.pendingProps;switch(Ba(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Yt(t),null;case 1:return qt(t.type)&&hs(),Yt(t),null;case 3:return r=t.stateNode,Fr(),it(Jt),it(Bt),ei(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(vs(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,En!==null&&(Li(En),En=null))),xi(e,t),Yt(t),null;case 5:Ja(t);var s=Jo(bl.current);if(n=t.type,e!==null&&t.stateNode!=null)Ju(e,t,n,r,s),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Yt(t),null}if(e=Jo(Yn.current),vs(t)){r=t.stateNode,n=t.type;var c=t.memoizedProps;switch(r[Wn]=t,r[_l]=c,e=(t.mode&1)!==0,n){case"dialog":at("cancel",r),at("close",r);break;case"iframe":case"object":case"embed":at("load",r);break;case"video":case"audio":for(s=0;s<ml.length;s++)at(ml[s],r);break;case"source":at("error",r);break;case"img":case"image":case"link":at("error",r),at("load",r);break;case"details":at("toggle",r);break;case"input":ot(r,c),at("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!c.multiple},at("invalid",r);break;case"textarea":$n(r,c),at("invalid",r)}Mo(n,c),s=null;for(var m in c)if(c.hasOwnProperty(m)){var E=c[m];m==="children"?typeof E=="string"?r.textContent!==E&&(c.suppressHydrationWarning!==!0&&fs(r.textContent,E,e),s=["children",E]):typeof E=="number"&&r.textContent!==""+E&&(c.suppressHydrationWarning!==!0&&fs(r.textContent,E,e),s=["children",""+E]):d.hasOwnProperty(m)&&E!=null&&m==="onScroll"&&at("scroll",r)}switch(n){case"input":wt(r),ze(r,c,!0);break;case"textarea":wt(r),Kr(r);break;case"select":case"option":break;default:typeof c.onClick=="function"&&(r.onclick=ms)}r=s,t.updateQueue=r,r!==null&&(t.flags|=4)}else{m=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Zr(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=m.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=m.createElement(n,{is:r.is}):(e=m.createElement(n),n==="select"&&(m=e,r.multiple?m.multiple=!0:r.size&&(m.size=r.size))):e=m.createElementNS(e,n),e[Wn]=t,e[_l]=r,Zu(e,t,!1,!1),t.stateNode=e;e:{switch(m=zo(n,r),n){case"dialog":at("cancel",e),at("close",e),s=r;break;case"iframe":case"object":case"embed":at("load",e),s=r;break;case"video":case"audio":for(s=0;s<ml.length;s++)at(ml[s],e);s=r;break;case"source":at("error",e),s=r;break;case"img":case"image":case"link":at("error",e),at("load",e),s=r;break;case"details":at("toggle",e),s=r;break;case"input":ot(e,r),s=mt(e,r),at("invalid",e);break;case"option":s=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},s=V({},r,{value:void 0}),at("invalid",e);break;case"textarea":$n(e,r),s=ar(e,r),at("invalid",e);break;default:s=r}Mo(n,s),E=s;for(c in E)if(E.hasOwnProperty(c)){var T=E[c];c==="style"?Ql(e,T):c==="dangerouslySetInnerHTML"?(T=T?T.__html:void 0,T!=null&&Xl(e,T)):c==="children"?typeof T=="string"?(n!=="textarea"||T!=="")&&$t(e,T):typeof T=="number"&&$t(e,""+T):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(d.hasOwnProperty(c)?T!=null&&c==="onScroll"&&at("scroll",e):T!=null&&U(e,c,T,m))}switch(n){case"input":wt(e),ze(e,r,!1);break;case"textarea":wt(e),Kr(e);break;case"option":r.value!=null&&e.setAttribute("value",""+We(r.value));break;case"select":e.multiple=!!r.multiple,c=r.value,c!=null?Ft(e,!!r.multiple,c,!1):r.defaultValue!=null&&Ft(e,!!r.multiple,r.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=ms)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Yt(t),null;case 6:if(e&&t.stateNode!=null)qu(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(i(166));if(n=Jo(bl.current),Jo(Yn.current),vs(t)){if(r=t.stateNode,n=t.memoizedProps,r[Wn]=t,(c=r.nodeValue!==n)&&(e=dn,e!==null))switch(e.tag){case 3:fs(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&fs(r.nodeValue,n,(e.mode&1)!==0)}c&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Wn]=t,t.stateNode=r}return Yt(t),null;case 13:if(it(ht),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ft&&fn!==null&&(t.mode&1)!==0&&(t.flags&128)===0)nu(),$r(),t.flags|=98560,c=!1;else if(c=vs(t),r!==null&&r.dehydrated!==null){if(e===null){if(!c)throw Error(i(318));if(c=t.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(i(317));c[Wn]=t}else $r(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Yt(t),c=!1}else En!==null&&(Li(En),En=null),c=!0;if(!c)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(ht.current&1)!==0?Pt===0&&(Pt=3):Ri())),t.updateQueue!==null&&(t.flags|=4),Yt(t),null);case 4:return Fr(),xi(e,t),e===null&&pl(t.stateNode.containerInfo),Yt(t),null;case 10:return Xa(t.type._context),Yt(t),null;case 17:return qt(t.type)&&hs(),Yt(t),null;case 19:if(it(ht),c=t.memoizedState,c===null)return Yt(t),null;if(r=(t.flags&128)!==0,m=c.rendering,m===null)if(r)jl(c,!1);else{if(Pt!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(m=js(e),m!==null){for(t.flags|=128,jl(c,!1),r=m.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)c=n,e=r,c.flags&=14680066,m=c.alternate,m===null?(c.childLanes=0,c.lanes=e,c.child=null,c.subtreeFlags=0,c.memoizedProps=null,c.memoizedState=null,c.updateQueue=null,c.dependencies=null,c.stateNode=null):(c.childLanes=m.childLanes,c.lanes=m.lanes,c.child=m.child,c.subtreeFlags=0,c.deletions=null,c.memoizedProps=m.memoizedProps,c.memoizedState=m.memoizedState,c.updateQueue=m.updateQueue,c.type=m.type,e=m.dependencies,c.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return lt(ht,ht.current&1|2),t.child}e=e.sibling}c.tail!==null&&ct()>Wr&&(t.flags|=128,r=!0,jl(c,!1),t.lanes=4194304)}else{if(!r)if(e=js(m),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),jl(c,!0),c.tail===null&&c.tailMode==="hidden"&&!m.alternate&&!ft)return Yt(t),null}else 2*ct()-c.renderingStartTime>Wr&&n!==1073741824&&(t.flags|=128,r=!0,jl(c,!1),t.lanes=4194304);c.isBackwards?(m.sibling=t.child,t.child=m):(n=c.last,n!==null?n.sibling=m:t.child=m,c.last=m)}return c.tail!==null?(t=c.tail,c.rendering=t,c.tail=t.sibling,c.renderingStartTime=ct(),t.sibling=null,n=ht.current,lt(ht,r?n&1|2:n&1),t):(Yt(t),null);case 22:case 23:return Ti(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(mn&1073741824)!==0&&(Yt(t),t.subtreeFlags&6&&(t.flags|=8192)):Yt(t),null;case 24:return null;case 25:return null}throw Error(i(156,t.tag))}function Tm(e,t){switch(Ba(t),t.tag){case 1:return qt(t.type)&&hs(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Fr(),it(Jt),it(Bt),ei(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Ja(t),null;case 13:if(it(ht),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));$r()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return it(ht),null;case 4:return Fr(),null;case 10:return Xa(t.type._context),null;case 22:case 23:return Ti(),null;case 24:return null;default:return null}}var Ms=!1,Ht=!1,Rm=typeof WeakSet=="function"?WeakSet:Set,_e=null;function Ar(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){yt(e,t,r)}else n.current=null}function vi(e,t,n){try{n()}catch(r){yt(e,t,r)}}var ed=!1;function $m(e,t){if(Ta=Uo,e=Tc(),Ca(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var s=r.anchorOffset,c=r.focusNode;r=r.focusOffset;try{n.nodeType,c.nodeType}catch{n=null;break e}var m=0,E=-1,T=-1,B=0,te=0,oe=e,ee=null;t:for(;;){for(var me;oe!==n||s!==0&&oe.nodeType!==3||(E=m+s),oe!==c||r!==0&&oe.nodeType!==3||(T=m+r),oe.nodeType===3&&(m+=oe.nodeValue.length),(me=oe.firstChild)!==null;)ee=oe,oe=me;for(;;){if(oe===e)break t;if(ee===n&&++B===s&&(E=m),ee===c&&++te===r&&(T=m),(me=oe.nextSibling)!==null)break;oe=ee,ee=oe.parentNode}oe=me}n=E===-1||T===-1?null:{start:E,end:T}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ra={focusedElem:e,selectionRange:n},Uo=!1,_e=t;_e!==null;)if(t=_e,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,_e=e;else for(;_e!==null;){t=_e;try{var ve=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(ve!==null){var be=ve.memoizedProps,vt=ve.memoizedState,F=t.stateNode,R=F.getSnapshotBeforeUpdate(t.elementType===t.type?be:Nn(t.type,be),vt);F.__reactInternalSnapshotBeforeUpdate=R}break;case 3:var A=t.stateNode.containerInfo;A.nodeType===1?A.textContent="":A.nodeType===9&&A.documentElement&&A.removeChild(A.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(i(163))}}catch(ae){yt(t,t.return,ae)}if(e=t.sibling,e!==null){e.return=t.return,_e=e;break}_e=t.return}return ve=ed,ed=!1,ve}function El(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var s=r=r.next;do{if((s.tag&e)===e){var c=s.destroy;s.destroy=void 0,c!==void 0&&vi(t,n,c)}s=s.next}while(s!==r)}}function zs(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function bi(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function td(e){var t=e.alternate;t!==null&&(e.alternate=null,td(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Wn],delete t[_l],delete t[Oa],delete t[_m],delete t[gm])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function nd(e){return e.tag===5||e.tag===3||e.tag===4}function od(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||nd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function wi(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ms));else if(r!==4&&(e=e.child,e!==null))for(wi(e,t,n),e=e.sibling;e!==null;)wi(e,t,n),e=e.sibling}function ki(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(ki(e,t,n),e=e.sibling;e!==null;)ki(e,t,n),e=e.sibling}var zt=null,Pn=!1;function Co(e,t,n){for(n=n.child;n!==null;)rd(e,t,n),n=n.sibling}function rd(e,t,n){if(Dt&&typeof Dt.onCommitFiberUnmount=="function")try{Dt.onCommitFiberUnmount(Jn,n)}catch{}switch(n.tag){case 5:Ht||Ar(n,t);case 6:var r=zt,s=Pn;zt=null,Co(e,t,n),zt=r,Pn=s,zt!==null&&(Pn?(e=zt,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):zt.removeChild(n.stateNode));break;case 18:zt!==null&&(Pn?(e=zt,n=n.stateNode,e.nodeType===8?za(e.parentNode,n):e.nodeType===1&&za(e,n),_o(e)):za(zt,n.stateNode));break;case 4:r=zt,s=Pn,zt=n.stateNode.containerInfo,Pn=!0,Co(e,t,n),zt=r,Pn=s;break;case 0:case 11:case 14:case 15:if(!Ht&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){s=r=r.next;do{var c=s,m=c.destroy;c=c.tag,m!==void 0&&((c&2)!==0||(c&4)!==0)&&vi(n,t,m),s=s.next}while(s!==r)}Co(e,t,n);break;case 1:if(!Ht&&(Ar(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(E){yt(n,t,E)}Co(e,t,n);break;case 21:Co(e,t,n);break;case 22:n.mode&1?(Ht=(r=Ht)||n.memoizedState!==null,Co(e,t,n),Ht=r):Co(e,t,n);break;default:Co(e,t,n)}}function ld(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Rm),t.forEach(function(r){var s=Ym.bind(null,e,r);n.has(r)||(n.add(r),r.then(s,s))})}}function Ln(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var s=n[r];try{var c=e,m=t,E=m;e:for(;E!==null;){switch(E.tag){case 5:zt=E.stateNode,Pn=!1;break e;case 3:zt=E.stateNode.containerInfo,Pn=!0;break e;case 4:zt=E.stateNode.containerInfo,Pn=!0;break e}E=E.return}if(zt===null)throw Error(i(160));rd(c,m,s),zt=null,Pn=!1;var T=s.alternate;T!==null&&(T.return=null),s.return=null}catch(B){yt(s,t,B)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)sd(t,e),t=t.sibling}function sd(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Ln(t,e),Vn(e),r&4){try{El(3,e,e.return),zs(3,e)}catch(be){yt(e,e.return,be)}try{El(5,e,e.return)}catch(be){yt(e,e.return,be)}}break;case 1:Ln(t,e),Vn(e),r&512&&n!==null&&Ar(n,n.return);break;case 5:if(Ln(t,e),Vn(e),r&512&&n!==null&&Ar(n,n.return),e.flags&32){var s=e.stateNode;try{$t(s,"")}catch(be){yt(e,e.return,be)}}if(r&4&&(s=e.stateNode,s!=null)){var c=e.memoizedProps,m=n!==null?n.memoizedProps:c,E=e.type,T=e.updateQueue;if(e.updateQueue=null,T!==null)try{E==="input"&&c.type==="radio"&&c.name!=null&&jt(s,c),zo(E,m);var B=zo(E,c);for(m=0;m<T.length;m+=2){var te=T[m],oe=T[m+1];te==="style"?Ql(s,oe):te==="dangerouslySetInnerHTML"?Xl(s,oe):te==="children"?$t(s,oe):U(s,te,oe,B)}switch(E){case"input":Qt(s,c);break;case"textarea":Mn(s,c);break;case"select":var ee=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!c.multiple;var me=c.value;me!=null?Ft(s,!!c.multiple,me,!1):ee!==!!c.multiple&&(c.defaultValue!=null?Ft(s,!!c.multiple,c.defaultValue,!0):Ft(s,!!c.multiple,c.multiple?[]:"",!1))}s[_l]=c}catch(be){yt(e,e.return,be)}}break;case 6:if(Ln(t,e),Vn(e),r&4){if(e.stateNode===null)throw Error(i(162));s=e.stateNode,c=e.memoizedProps;try{s.nodeValue=c}catch(be){yt(e,e.return,be)}}break;case 3:if(Ln(t,e),Vn(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{_o(t.containerInfo)}catch(be){yt(e,e.return,be)}break;case 4:Ln(t,e),Vn(e);break;case 13:Ln(t,e),Vn(e),s=e.child,s.flags&8192&&(c=s.memoizedState!==null,s.stateNode.isHidden=c,!c||s.alternate!==null&&s.alternate.memoizedState!==null||(ji=ct())),r&4&&ld(e);break;case 22:if(te=n!==null&&n.memoizedState!==null,e.mode&1?(Ht=(B=Ht)||te,Ln(t,e),Ht=B):Ln(t,e),Vn(e),r&8192){if(B=e.memoizedState!==null,(e.stateNode.isHidden=B)&&!te&&(e.mode&1)!==0)for(_e=e,te=e.child;te!==null;){for(oe=_e=te;_e!==null;){switch(ee=_e,me=ee.child,ee.tag){case 0:case 11:case 14:case 15:El(4,ee,ee.return);break;case 1:Ar(ee,ee.return);var ve=ee.stateNode;if(typeof ve.componentWillUnmount=="function"){r=ee,n=ee.return;try{t=r,ve.props=t.memoizedProps,ve.state=t.memoizedState,ve.componentWillUnmount()}catch(be){yt(r,n,be)}}break;case 5:Ar(ee,ee.return);break;case 22:if(ee.memoizedState!==null){cd(oe);continue}}me!==null?(me.return=ee,_e=me):cd(oe)}te=te.sibling}e:for(te=null,oe=e;;){if(oe.tag===5){if(te===null){te=oe;try{s=oe.stateNode,B?(c=s.style,typeof c.setProperty=="function"?c.setProperty("display","none","important"):c.display="none"):(E=oe.stateNode,T=oe.memoizedProps.style,m=T!=null&&T.hasOwnProperty("display")?T.display:null,E.style.display=cr("display",m))}catch(be){yt(e,e.return,be)}}}else if(oe.tag===6){if(te===null)try{oe.stateNode.nodeValue=B?"":oe.memoizedProps}catch(be){yt(e,e.return,be)}}else if((oe.tag!==22&&oe.tag!==23||oe.memoizedState===null||oe===e)&&oe.child!==null){oe.child.return=oe,oe=oe.child;continue}if(oe===e)break e;for(;oe.sibling===null;){if(oe.return===null||oe.return===e)break e;te===oe&&(te=null),oe=oe.return}te===oe&&(te=null),oe.sibling.return=oe.return,oe=oe.sibling}}break;case 19:Ln(t,e),Vn(e),r&4&&ld(e);break;case 21:break;default:Ln(t,e),Vn(e)}}function Vn(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(nd(n)){var r=n;break e}n=n.return}throw Error(i(160))}switch(r.tag){case 5:var s=r.stateNode;r.flags&32&&($t(s,""),r.flags&=-33);var c=od(e);ki(e,c,s);break;case 3:case 4:var m=r.stateNode.containerInfo,E=od(e);wi(e,E,m);break;default:throw Error(i(161))}}catch(T){yt(e,e.return,T)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Mm(e,t,n){_e=e,ad(e)}function ad(e,t,n){for(var r=(e.mode&1)!==0;_e!==null;){var s=_e,c=s.child;if(s.tag===22&&r){var m=s.memoizedState!==null||Ms;if(!m){var E=s.alternate,T=E!==null&&E.memoizedState!==null||Ht;E=Ms;var B=Ht;if(Ms=m,(Ht=T)&&!B)for(_e=s;_e!==null;)m=_e,T=m.child,m.tag===22&&m.memoizedState!==null?ud(s):T!==null?(T.return=m,_e=T):ud(s);for(;c!==null;)_e=c,ad(c),c=c.sibling;_e=s,Ms=E,Ht=B}id(e)}else(s.subtreeFlags&8772)!==0&&c!==null?(c.return=s,_e=c):id(e)}}function id(e){for(;_e!==null;){var t=_e;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Ht||zs(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Ht)if(n===null)r.componentDidMount();else{var s=t.elementType===t.type?n.memoizedProps:Nn(t.type,n.memoizedProps);r.componentDidUpdate(s,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var c=t.updateQueue;c!==null&&cu(t,c,r);break;case 3:var m=t.updateQueue;if(m!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}cu(t,m,n)}break;case 5:var E=t.stateNode;if(n===null&&t.flags&4){n=E;var T=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":T.autoFocus&&n.focus();break;case"img":T.src&&(n.src=T.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var B=t.alternate;if(B!==null){var te=B.memoizedState;if(te!==null){var oe=te.dehydrated;oe!==null&&_o(oe)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(i(163))}Ht||t.flags&512&&bi(t)}catch(ee){yt(t,t.return,ee)}}if(t===e){_e=null;break}if(n=t.sibling,n!==null){n.return=t.return,_e=n;break}_e=t.return}}function cd(e){for(;_e!==null;){var t=_e;if(t===e){_e=null;break}var n=t.sibling;if(n!==null){n.return=t.return,_e=n;break}_e=t.return}}function ud(e){for(;_e!==null;){var t=_e;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{zs(4,t)}catch(T){yt(t,n,T)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var s=t.return;try{r.componentDidMount()}catch(T){yt(t,s,T)}}var c=t.return;try{bi(t)}catch(T){yt(t,c,T)}break;case 5:var m=t.return;try{bi(t)}catch(T){yt(t,m,T)}}}catch(T){yt(t,t.return,T)}if(t===e){_e=null;break}var E=t.sibling;if(E!==null){E.return=t.return,_e=E;break}_e=t.return}}var zm=Math.ceil,Os=le.ReactCurrentDispatcher,Ci=le.ReactCurrentOwner,vn=le.ReactCurrentBatchConfig,Qe=0,Tt=null,St=null,Ot=0,mn=0,Br=xo(0),Pt=0,Nl=null,er=0,Fs=0,Si=0,Pl=null,tn=null,ji=0,Wr=1/0,co=null,Ds=!1,Ei=null,So=null,As=!1,jo=null,Bs=0,Ll=0,Ni=null,Ws=-1,Ys=0;function Xt(){return(Qe&6)!==0?ct():Ws!==-1?Ws:Ws=ct()}function Eo(e){return(e.mode&1)===0?1:(Qe&2)!==0&&Ot!==0?Ot&-Ot:xm.transition!==null?(Ys===0&&(Ys=rl()),Ys):(e=Ve,e!==0||(e=window.event,e=e===void 0?16:Q(e.type)),e)}function In(e,t,n,r){if(50<Ll)throw Ll=0,Ni=null,Error(i(185));Wo(e,n,r),((Qe&2)===0||e!==Tt)&&(e===Tt&&((Qe&2)===0&&(Fs|=n),Pt===4&&No(e,Ot)),nn(e,r),n===1&&Qe===0&&(t.mode&1)===0&&(Wr=ct()+500,gs&&bo()))}function nn(e,t){var n=e.callbackNode;ts(e,t);var r=Fn(e,e===Tt?Ot:0);if(r===0)n!==null&&hn(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&hn(n),t===1)e.tag===0?ym(fd.bind(null,e)):Zc(fd.bind(null,e)),pm(function(){(Qe&6)===0&&bo()}),n=null;else{switch(tt(r)){case 1:n=nl;break;case 4:n=hr;break;case 16:n=Do;break;case 536870912:n=ol;break;default:n=Do}n=vd(n,dd.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function dd(e,t){if(Ws=-1,Ys=0,(Qe&6)!==0)throw Error(i(327));var n=e.callbackNode;if(Yr()&&e.callbackNode!==n)return null;var r=Fn(e,e===Tt?Ot:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=Hs(e,r);else{t=r;var s=Qe;Qe|=2;var c=pd();(Tt!==e||Ot!==t)&&(co=null,Wr=ct()+500,nr(e,t));do try{Dm();break}catch(E){md(e,E)}while(!0);Ua(),Os.current=c,Qe=s,St!==null?t=0:(Tt=null,Ot=0,t=Pt)}if(t!==0){if(t===2&&(s=po(e),s!==0&&(r=s,t=Pi(e,s))),t===1)throw n=Nl,nr(e,0),No(e,r),nn(e,ct()),n;if(t===6)No(e,r);else{if(s=e.current.alternate,(r&30)===0&&!Om(s)&&(t=Hs(e,r),t===2&&(c=po(e),c!==0&&(r=c,t=Pi(e,c))),t===1))throw n=Nl,nr(e,0),No(e,r),nn(e,ct()),n;switch(e.finishedWork=s,e.finishedLanes=r,t){case 0:case 1:throw Error(i(345));case 2:or(e,tn,co);break;case 3:if(No(e,r),(r&130023424)===r&&(t=ji+500-ct(),10<t)){if(Fn(e,0)!==0)break;if(s=e.suspendedLanes,(s&r)!==r){Xt(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=Ma(or.bind(null,e,tn,co),t);break}or(e,tn,co);break;case 4:if(No(e,r),(r&4194240)===r)break;for(t=e.eventTimes,s=-1;0<r;){var m=31-sn(r);c=1<<m,m=t[m],m>s&&(s=m),r&=~c}if(r=s,r=ct()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*zm(r/1960))-r,10<r){e.timeoutHandle=Ma(or.bind(null,e,tn,co),r);break}or(e,tn,co);break;case 5:or(e,tn,co);break;default:throw Error(i(329))}}}return nn(e,ct()),e.callbackNode===n?dd.bind(null,e):null}function Pi(e,t){var n=Pl;return e.current.memoizedState.isDehydrated&&(nr(e,t).flags|=256),e=Hs(e,t),e!==2&&(t=tn,tn=n,t!==null&&Li(t)),e}function Li(e){tn===null?tn=e:tn.push.apply(tn,e)}function Om(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var s=n[r],c=s.getSnapshot;s=s.value;try{if(!jn(c(),s))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function No(e,t){for(t&=~Si,t&=~Fs,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-sn(t),r=1<<n;e[n]=-1,t&=~r}}function fd(e){if((Qe&6)!==0)throw Error(i(327));Yr();var t=Fn(e,0);if((t&1)===0)return nn(e,ct()),null;var n=Hs(e,t);if(e.tag!==0&&n===2){var r=po(e);r!==0&&(t=r,n=Pi(e,r))}if(n===1)throw n=Nl,nr(e,0),No(e,t),nn(e,ct()),n;if(n===6)throw Error(i(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,or(e,tn,co),nn(e,ct()),null}function Ii(e,t){var n=Qe;Qe|=1;try{return e(t)}finally{Qe=n,Qe===0&&(Wr=ct()+500,gs&&bo())}}function tr(e){jo!==null&&jo.tag===0&&(Qe&6)===0&&Yr();var t=Qe;Qe|=1;var n=vn.transition,r=Ve;try{if(vn.transition=null,Ve=1,e)return e()}finally{Ve=r,vn.transition=n,Qe=t,(Qe&6)===0&&bo()}}function Ti(){mn=Br.current,it(Br)}function nr(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,mm(n)),St!==null)for(n=St.return;n!==null;){var r=n;switch(Ba(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&hs();break;case 3:Fr(),it(Jt),it(Bt),ei();break;case 5:Ja(r);break;case 4:Fr();break;case 13:it(ht);break;case 19:it(ht);break;case 10:Xa(r.type._context);break;case 22:case 23:Ti()}n=n.return}if(Tt=e,St=e=Po(e.current,null),Ot=mn=t,Pt=0,Nl=null,Si=Fs=er=0,tn=Pl=null,Zo!==null){for(t=0;t<Zo.length;t++)if(n=Zo[t],r=n.interleaved,r!==null){n.interleaved=null;var s=r.next,c=n.pending;if(c!==null){var m=c.next;c.next=s,r.next=m}n.pending=r}Zo=null}return e}function md(e,t){do{var n=St;try{if(Ua(),Es.current=Is,Ns){for(var r=_t.memoizedState;r!==null;){var s=r.queue;s!==null&&(s.pending=null),r=r.next}Ns=!1}if(qo=0,It=Nt=_t=null,wl=!1,kl=0,Ci.current=null,n===null||n.return===null){Pt=1,Nl=t,St=null;break}e:{var c=e,m=n.return,E=n,T=t;if(t=Ot,E.flags|=32768,T!==null&&typeof T=="object"&&typeof T.then=="function"){var B=T,te=E,oe=te.tag;if((te.mode&1)===0&&(oe===0||oe===11||oe===15)){var ee=te.alternate;ee?(te.updateQueue=ee.updateQueue,te.memoizedState=ee.memoizedState,te.lanes=ee.lanes):(te.updateQueue=null,te.memoizedState=null)}var me=Fu(m);if(me!==null){me.flags&=-257,Du(me,m,E,c,t),me.mode&1&&Ou(c,B,t),t=me,T=B;var ve=t.updateQueue;if(ve===null){var be=new Set;be.add(T),t.updateQueue=be}else ve.add(T);break e}else{if((t&1)===0){Ou(c,B,t),Ri();break e}T=Error(i(426))}}else if(ft&&E.mode&1){var vt=Fu(m);if(vt!==null){(vt.flags&65536)===0&&(vt.flags|=256),Du(vt,m,E,c,t),Ha(Dr(T,E));break e}}c=T=Dr(T,E),Pt!==4&&(Pt=2),Pl===null?Pl=[c]:Pl.push(c),c=m;do{switch(c.tag){case 3:c.flags|=65536,t&=-t,c.lanes|=t;var F=Mu(c,T,t);iu(c,F);break e;case 1:E=T;var R=c.type,A=c.stateNode;if((c.flags&128)===0&&(typeof R.getDerivedStateFromError=="function"||A!==null&&typeof A.componentDidCatch=="function"&&(So===null||!So.has(A)))){c.flags|=65536,t&=-t,c.lanes|=t;var ae=zu(c,E,t);iu(c,ae);break e}}c=c.return}while(c!==null)}_d(n)}catch(we){t=we,St===n&&n!==null&&(St=n=n.return);continue}break}while(!0)}function pd(){var e=Os.current;return Os.current=Is,e===null?Is:e}function Ri(){(Pt===0||Pt===3||Pt===2)&&(Pt=4),Tt===null||(er&268435455)===0&&(Fs&268435455)===0||No(Tt,Ot)}function Hs(e,t){var n=Qe;Qe|=2;var r=pd();(Tt!==e||Ot!==t)&&(co=null,nr(e,t));do try{Fm();break}catch(s){md(e,s)}while(!0);if(Ua(),Qe=n,Os.current=r,St!==null)throw Error(i(261));return Tt=null,Ot=0,Pt}function Fm(){for(;St!==null;)hd(St)}function Dm(){for(;St!==null&&!ql();)hd(St)}function hd(e){var t=xd(e.alternate,e,mn);e.memoizedProps=e.pendingProps,t===null?_d(e):St=t,Ci.current=null}function _d(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Im(n,t,mn),n!==null){St=n;return}}else{if(n=Tm(n,t),n!==null){n.flags&=32767,St=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Pt=6,St=null;return}}if(t=t.sibling,t!==null){St=t;return}St=t=e}while(t!==null);Pt===0&&(Pt=5)}function or(e,t,n){var r=Ve,s=vn.transition;try{vn.transition=null,Ve=1,Am(e,t,n,r)}finally{vn.transition=s,Ve=r}return null}function Am(e,t,n,r){do Yr();while(jo!==null);if((Qe&6)!==0)throw Error(i(327));n=e.finishedWork;var s=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(i(177));e.callbackNode=null,e.callbackPriority=0;var c=n.lanes|n.childLanes;if(ns(e,c),e===Tt&&(St=Tt=null,Ot=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||As||(As=!0,vd(Do,function(){return Yr(),null})),c=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||c){c=vn.transition,vn.transition=null;var m=Ve;Ve=1;var E=Qe;Qe|=4,Ci.current=null,$m(e,n),sd(n,e),sm(Ra),Uo=!!Ta,Ra=Ta=null,e.current=n,Mm(n),fo(),Qe=E,Ve=m,vn.transition=c}else e.current=n;if(As&&(As=!1,jo=e,Bs=s),c=e.pendingLanes,c===0&&(So=null),_r(n.stateNode),nn(e,ct()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)s=t[n],r(s.value,{componentStack:s.stack,digest:s.digest});if(Ds)throw Ds=!1,e=Ei,Ei=null,e;return(Bs&1)!==0&&e.tag!==0&&Yr(),c=e.pendingLanes,(c&1)!==0?e===Ni?Ll++:(Ll=0,Ni=e):Ll=0,bo(),null}function Yr(){if(jo!==null){var e=tt(Bs),t=vn.transition,n=Ve;try{if(vn.transition=null,Ve=16>e?16:e,jo===null)var r=!1;else{if(e=jo,jo=null,Bs=0,(Qe&6)!==0)throw Error(i(331));var s=Qe;for(Qe|=4,_e=e.current;_e!==null;){var c=_e,m=c.child;if((_e.flags&16)!==0){var E=c.deletions;if(E!==null){for(var T=0;T<E.length;T++){var B=E[T];for(_e=B;_e!==null;){var te=_e;switch(te.tag){case 0:case 11:case 15:El(8,te,c)}var oe=te.child;if(oe!==null)oe.return=te,_e=oe;else for(;_e!==null;){te=_e;var ee=te.sibling,me=te.return;if(td(te),te===B){_e=null;break}if(ee!==null){ee.return=me,_e=ee;break}_e=me}}}var ve=c.alternate;if(ve!==null){var be=ve.child;if(be!==null){ve.child=null;do{var vt=be.sibling;be.sibling=null,be=vt}while(be!==null)}}_e=c}}if((c.subtreeFlags&2064)!==0&&m!==null)m.return=c,_e=m;else e:for(;_e!==null;){if(c=_e,(c.flags&2048)!==0)switch(c.tag){case 0:case 11:case 15:El(9,c,c.return)}var F=c.sibling;if(F!==null){F.return=c.return,_e=F;break e}_e=c.return}}var R=e.current;for(_e=R;_e!==null;){m=_e;var A=m.child;if((m.subtreeFlags&2064)!==0&&A!==null)A.return=m,_e=A;else e:for(m=R;_e!==null;){if(E=_e,(E.flags&2048)!==0)try{switch(E.tag){case 0:case 11:case 15:zs(9,E)}}catch(we){yt(E,E.return,we)}if(E===m){_e=null;break e}var ae=E.sibling;if(ae!==null){ae.return=E.return,_e=ae;break e}_e=E.return}}if(Qe=s,bo(),Dt&&typeof Dt.onPostCommitFiberRoot=="function")try{Dt.onPostCommitFiberRoot(Jn,e)}catch{}r=!0}return r}finally{Ve=n,vn.transition=t}}return!1}function gd(e,t,n){t=Dr(n,t),t=Mu(e,t,1),e=ko(e,t,1),t=Xt(),e!==null&&(Wo(e,1,t),nn(e,t))}function yt(e,t,n){if(e.tag===3)gd(e,e,n);else for(;t!==null;){if(t.tag===3){gd(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(So===null||!So.has(r))){e=Dr(n,e),e=zu(t,e,1),t=ko(t,e,1),e=Xt(),t!==null&&(Wo(t,1,e),nn(t,e));break}}t=t.return}}function Bm(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=Xt(),e.pingedLanes|=e.suspendedLanes&n,Tt===e&&(Ot&n)===n&&(Pt===4||Pt===3&&(Ot&130023424)===Ot&&500>ct()-ji?nr(e,0):Si|=n),nn(e,t)}function yd(e,t){t===0&&((e.mode&1)===0?t=1:(t=Vt,Vt<<=1,(Vt&130023424)===0&&(Vt=4194304)));var n=Xt();e=so(e,t),e!==null&&(Wo(e,t,n),nn(e,n))}function Wm(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),yd(e,n)}function Ym(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(i(314))}r!==null&&r.delete(t),yd(e,n)}var xd;xd=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Jt.current)en=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return en=!1,Lm(e,t,n);en=(e.flags&131072)!==0}else en=!1,ft&&(t.flags&1048576)!==0&&Jc(t,xs,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;$s(e,t),e=t.pendingProps;var s=Ir(t,Bt.current);Or(t,n),s=oi(null,t,r,e,s,n);var c=ri();return t.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,qt(r)?(c=!0,_s(t)):c=!1,t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,Ka(t),s.updater=Ts,t.stateNode=s,s._reactInternals=t,ui(t,r,e,n),t=pi(null,t,r,!0,c,n)):(t.tag=0,ft&&c&&Aa(t),Ut(null,t,s,n),t=t.child),t;case 16:r=t.elementType;e:{switch($s(e,t),e=t.pendingProps,s=r._init,r=s(r._payload),t.type=r,s=t.tag=Vm(r),e=Nn(r,e),s){case 0:t=mi(null,t,r,e,n);break e;case 1:t=Vu(null,t,r,e,n);break e;case 11:t=Au(null,t,r,e,n);break e;case 14:t=Bu(null,t,r,Nn(r.type,e),n);break e}throw Error(i(306,r,""))}return t;case 0:return r=t.type,s=t.pendingProps,s=t.elementType===r?s:Nn(r,s),mi(e,t,r,s,n);case 1:return r=t.type,s=t.pendingProps,s=t.elementType===r?s:Nn(r,s),Vu(e,t,r,s,n);case 3:e:{if(Uu(t),e===null)throw Error(i(387));r=t.pendingProps,c=t.memoizedState,s=c.element,au(e,t),Ss(t,r,null,n);var m=t.memoizedState;if(r=m.element,c.isDehydrated)if(c={element:r,isDehydrated:!1,cache:m.cache,pendingSuspenseBoundaries:m.pendingSuspenseBoundaries,transitions:m.transitions},t.updateQueue.baseState=c,t.memoizedState=c,t.flags&256){s=Dr(Error(i(423)),t),t=Xu(e,t,r,n,s);break e}else if(r!==s){s=Dr(Error(i(424)),t),t=Xu(e,t,r,n,s);break e}else for(fn=yo(t.stateNode.containerInfo.firstChild),dn=t,ft=!0,En=null,n=lu(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if($r(),r===s){t=io(e,t,n);break e}Ut(e,t,r,n)}t=t.child}return t;case 5:return uu(t),e===null&&Ya(t),r=t.type,s=t.pendingProps,c=e!==null?e.memoizedProps:null,m=s.children,$a(r,s)?m=null:c!==null&&$a(r,c)&&(t.flags|=32),Hu(e,t),Ut(e,t,m,n),t.child;case 6:return e===null&&Ya(t),null;case 13:return Qu(e,t,n);case 4:return Za(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Mr(t,null,r,n):Ut(e,t,r,n),t.child;case 11:return r=t.type,s=t.pendingProps,s=t.elementType===r?s:Nn(r,s),Au(e,t,r,s,n);case 7:return Ut(e,t,t.pendingProps,n),t.child;case 8:return Ut(e,t,t.pendingProps.children,n),t.child;case 12:return Ut(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,s=t.pendingProps,c=t.memoizedProps,m=s.value,lt(ws,r._currentValue),r._currentValue=m,c!==null)if(jn(c.value,m)){if(c.children===s.children&&!Jt.current){t=io(e,t,n);break e}}else for(c=t.child,c!==null&&(c.return=t);c!==null;){var E=c.dependencies;if(E!==null){m=c.child;for(var T=E.firstContext;T!==null;){if(T.context===r){if(c.tag===1){T=ao(-1,n&-n),T.tag=2;var B=c.updateQueue;if(B!==null){B=B.shared;var te=B.pending;te===null?T.next=T:(T.next=te.next,te.next=T),B.pending=T}}c.lanes|=n,T=c.alternate,T!==null&&(T.lanes|=n),Qa(c.return,n,t),E.lanes|=n;break}T=T.next}}else if(c.tag===10)m=c.type===t.type?null:c.child;else if(c.tag===18){if(m=c.return,m===null)throw Error(i(341));m.lanes|=n,E=m.alternate,E!==null&&(E.lanes|=n),Qa(m,n,t),m=c.sibling}else m=c.child;if(m!==null)m.return=c;else for(m=c;m!==null;){if(m===t){m=null;break}if(c=m.sibling,c!==null){c.return=m.return,m=c;break}m=m.return}c=m}Ut(e,t,s.children,n),t=t.child}return t;case 9:return s=t.type,r=t.pendingProps.children,Or(t,n),s=yn(s),r=r(s),t.flags|=1,Ut(e,t,r,n),t.child;case 14:return r=t.type,s=Nn(r,t.pendingProps),s=Nn(r.type,s),Bu(e,t,r,s,n);case 15:return Wu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,s=t.pendingProps,s=t.elementType===r?s:Nn(r,s),$s(e,t),t.tag=1,qt(r)?(e=!0,_s(t)):e=!1,Or(t,n),Ru(t,r,s),ui(t,r,s,n),pi(null,t,r,!0,e,n);case 19:return Ku(e,t,n);case 22:return Yu(e,t,n)}throw Error(i(156,t.tag))};function vd(e,t){return pr(e,t)}function Hm(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function bn(e,t,n,r){return new Hm(e,t,n,r)}function $i(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Vm(e){if(typeof e=="function")return $i(e)?1:0;if(e!=null){if(e=e.$$typeof,e===fe)return 11;if(e===Pe)return 14}return 2}function Po(e,t){var n=e.alternate;return n===null?(n=bn(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Vs(e,t,n,r,s,c){var m=2;if(r=e,typeof e=="function")$i(e)&&(m=1);else if(typeof e=="string")m=5;else e:switch(e){case he:return rr(n.children,s,c,t);case re:m=8,s|=8;break;case G:return e=bn(12,n,t,s|2),e.elementType=G,e.lanes=c,e;case H:return e=bn(13,n,t,s),e.elementType=H,e.lanes=c,e;case ce:return e=bn(19,n,t,s),e.elementType=ce,e.lanes=c,e;case je:return Us(n,s,c,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case w:m=10;break e;case ke:m=9;break e;case fe:m=11;break e;case Pe:m=14;break e;case O:m=16,r=null;break e}throw Error(i(130,e==null?e:typeof e,""))}return t=bn(m,n,t,s),t.elementType=e,t.type=r,t.lanes=c,t}function rr(e,t,n,r){return e=bn(7,e,r,t),e.lanes=n,e}function Us(e,t,n,r){return e=bn(22,e,r,t),e.elementType=je,e.lanes=n,e.stateNode={isHidden:!1},e}function Mi(e,t,n){return e=bn(6,e,null,t),e.lanes=n,e}function zi(e,t,n){return t=bn(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Um(e,t,n,r,s){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Bo(0),this.expirationTimes=Bo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Bo(0),this.identifierPrefix=r,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function Oi(e,t,n,r,s,c,m,E,T){return e=new Um(e,t,n,E,T),t===1?(t=1,c===!0&&(t|=8)):t=0,c=bn(3,null,null,t),e.current=c,c.stateNode=e,c.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ka(c),e}function Xm(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ie,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function bd(e){if(!e)return vo;e=e._reactInternals;e:{if(xt(e)!==e||e.tag!==1)throw Error(i(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(qt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(i(171))}if(e.tag===1){var n=e.type;if(qt(n))return Gc(e,n,t)}return t}function wd(e,t,n,r,s,c,m,E,T){return e=Oi(n,r,!0,e,s,c,m,E,T),e.context=bd(null),n=e.current,r=Xt(),s=Eo(n),c=ao(r,s),c.callback=t??null,ko(n,c,s),e.current.lanes=s,Wo(e,s,r),nn(e,r),e}function Xs(e,t,n,r){var s=t.current,c=Xt(),m=Eo(s);return n=bd(n),t.context===null?t.context=n:t.pendingContext=n,t=ao(c,m),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=ko(s,t,m),e!==null&&(In(e,s,m,c),Cs(e,s,m)),m}function Qs(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function kd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Fi(e,t){kd(e,t),(e=e.alternate)&&kd(e,t)}function Qm(){return null}var Cd=typeof reportError=="function"?reportError:function(e){console.error(e)};function Di(e){this._internalRoot=e}Gs.prototype.render=Di.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));Xs(e,t,null,null)},Gs.prototype.unmount=Di.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;tr(function(){Xs(null,e,null,null)}),t[no]=null}};function Gs(e){this._internalRoot=e}Gs.prototype.unstable_scheduleHydration=function(e){if(e){var t=sl();e={blockedOn:null,target:e,priority:t};for(var n=0;n<an.length&&t!==0&&t<an[n].priority;n++);an.splice(n,0,e),n===0&&vr(e)}};function Ai(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ks(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Sd(){}function Gm(e,t,n,r,s){if(s){if(typeof r=="function"){var c=r;r=function(){var B=Qs(m);c.call(B)}}var m=wd(t,r,e,0,null,!1,!1,"",Sd);return e._reactRootContainer=m,e[no]=m.current,pl(e.nodeType===8?e.parentNode:e),tr(),m}for(;s=e.lastChild;)e.removeChild(s);if(typeof r=="function"){var E=r;r=function(){var B=Qs(T);E.call(B)}}var T=Oi(e,0,!1,null,null,!1,!1,"",Sd);return e._reactRootContainer=T,e[no]=T.current,pl(e.nodeType===8?e.parentNode:e),tr(function(){Xs(t,T,n,r)}),T}function Zs(e,t,n,r,s){var c=n._reactRootContainer;if(c){var m=c;if(typeof s=="function"){var E=s;s=function(){var T=Qs(m);E.call(T)}}Xs(t,m,e,s)}else m=Gm(n,t,e,s,r);return Qs(m)}ll=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Sn(t.pendingLanes);n!==0&&(yr(t,n|1),nn(t,ct()),(Qe&6)===0&&(Wr=ct()+500,bo()))}break;case 13:tr(function(){var r=so(e,1);if(r!==null){var s=Xt();In(r,e,1,s)}}),Fi(e,1)}},xr=function(e){if(e.tag===13){var t=so(e,134217728);if(t!==null){var n=Xt();In(t,e,134217728,n)}Fi(e,134217728)}},os=function(e){if(e.tag===13){var t=Eo(e),n=so(e,t);if(n!==null){var r=Xt();In(n,e,t,r)}Fi(e,t)}},sl=function(){return Ve},Yo=function(e,t){var n=Ve;try{return Ve=e,t()}finally{Ve=n}},Jr=function(e,t,n){switch(t){case"input":if(Qt(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var s=ps(r);if(!s)throw Error(i(90));Ro(r),Qt(r,s)}}}break;case"textarea":Mn(e,n);break;case"select":t=n.value,t!=null&&Ft(e,!!n.multiple,t,!1)}},Zn=Ii,ln=tr;var Km={usingClientEntryPoint:!1,Events:[gl,Pr,ps,Kn,pt,Ii]},Il={findFiberByHostInstance:Xo,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Zm={bundleType:Il.bundleType,version:Il.version,rendererPackageName:Il.rendererPackageName,rendererConfig:Il.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:le.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=On(e),e===null?null:e.stateNode},findFiberByHostInstance:Il.findFiberByHostInstance||Qm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Js=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Js.isDisabled&&Js.supportsFiber)try{Jn=Js.inject(Zm),Dt=Js}catch{}}return on.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Km,on.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ai(t))throw Error(i(200));return Xm(e,t,null,n)},on.createRoot=function(e,t){if(!Ai(e))throw Error(i(299));var n=!1,r="",s=Cd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=Oi(e,1,!1,null,null,n,!1,r,s),e[no]=t.current,pl(e.nodeType===8?e.parentNode:e),new Di(t)},on.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(i(188)):(e=Object.keys(e).join(","),Error(i(268,e)));return e=On(t),e=e===null?null:e.stateNode,e},on.flushSync=function(e){return tr(e)},on.hydrate=function(e,t,n){if(!Ks(t))throw Error(i(200));return Zs(null,e,t,!0,n)},on.hydrateRoot=function(e,t,n){if(!Ai(e))throw Error(i(405));var r=n!=null&&n.hydratedSources||null,s=!1,c="",m=Cd;if(n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(c=n.identifierPrefix),n.onRecoverableError!==void 0&&(m=n.onRecoverableError)),t=wd(t,null,e,1,n??null,s,!1,c,m),e[no]=t.current,pl(e),r)for(e=0;e<r.length;e++)n=r[e],s=n._getVersion,s=s(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,s]:t.mutableSourceEagerHydrationData.push(n,s);return new Gs(t)},on.render=function(e,t,n){if(!Ks(t))throw Error(i(200));return Zs(null,e,t,!1,n)},on.unmountComponentAtNode=function(e){if(!Ks(e))throw Error(i(40));return e._reactRootContainer?(tr(function(){Zs(null,null,e,!1,function(){e._reactRootContainer=null,e[no]=null})}),!0):!1},on.unstable_batchedUpdates=Ii,on.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Ks(n))throw Error(i(200));if(e==null||e._reactInternals===void 0)throw Error(i(38));return Zs(e,t,n,!1,r)},on.version="18.3.1-next-f1338f8080-20240426",on}var Rd;function pf(){if(Rd)return Yi.exports;Rd=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(a){console.error(a)}}return o(),Yi.exports=rp(),Yi.exports}var $d;function lp(){if($d)return qs;$d=1;var o=pf();return qs.createRoot=o.createRoot,qs.hydrateRoot=o.hydrateRoot,qs}var sp=lp();const ap={},Md=o=>{let a;const i=new Set,u=(x,L)=>{const g=typeof x=="function"?x(a):x;if(!Object.is(g,a)){const S=a;a=L??(typeof g!="object"||g===null)?g:Object.assign({},a,g),i.forEach(N=>N(a,S))}},d=()=>a,p={setState:u,getState:d,getInitialState:()=>$,subscribe:x=>(i.add(x),()=>i.delete(x)),destroy:()=>{(ap?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),i.clear()}},$=a=o(u,d,p);return p},ip=o=>o?Md(o):Md;var Ui={exports:{}},Xi={},Qi={exports:{}},Gi={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var zd;function cp(){if(zd)return Gi;zd=1;var o=Vl();function a(L,g){return L===g&&(L!==0||1/L===1/g)||L!==L&&g!==g}var i=typeof Object.is=="function"?Object.is:a,u=o.useState,d=o.useEffect,f=o.useLayoutEffect,h=o.useDebugValue;function y(L,g){var S=g(),N=u({inst:{value:S,getSnapshot:g}}),_=N[0].inst,k=N[1];return f(function(){_.value=S,_.getSnapshot=g,p(_)&&k({inst:_})},[L,S,g]),d(function(){return p(_)&&k({inst:_}),L(function(){p(_)&&k({inst:_})})},[L]),h(S),S}function p(L){var g=L.getSnapshot;L=L.value;try{var S=g();return!i(L,S)}catch{return!0}}function $(L,g){return g()}var x=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?$:y;return Gi.useSyncExternalStore=o.useSyncExternalStore!==void 0?o.useSyncExternalStore:x,Gi}var Od;function up(){return Od||(Od=1,Qi.exports=cp()),Qi.exports}/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fd;function dp(){if(Fd)return Xi;Fd=1;var o=Vl(),a=up();function i($,x){return $===x&&($!==0||1/$===1/x)||$!==$&&x!==x}var u=typeof Object.is=="function"?Object.is:i,d=a.useSyncExternalStore,f=o.useRef,h=o.useEffect,y=o.useMemo,p=o.useDebugValue;return Xi.useSyncExternalStoreWithSelector=function($,x,L,g,S){var N=f(null);if(N.current===null){var _={hasValue:!1,value:null};N.current=_}else _=N.current;N=y(function(){function b(ie){if(!Z){if(Z=!0,U=ie,ie=g(ie),S!==void 0&&_.hasValue){var he=_.value;if(S(he,ie))return le=he}return le=ie}if(he=le,u(U,ie))return he;var re=g(ie);return S!==void 0&&S(he,re)?(U=ie,he):(U=ie,le=re)}var Z=!1,U,le,ne=L===void 0?null:L;return[function(){return b(x())},ne===null?void 0:function(){return b(ne())}]},[x,L,g,S]);var k=d($,N[0],N[1]);return h(function(){_.hasValue=!0,_.value=k},[k]),p(k),k},Xi}var Dd;function fp(){return Dd||(Dd=1,Ui.exports=dp()),Ui.exports}var mp=fp();const pp=ff(mp),hf={},{useDebugValue:hp}=mf,{useSyncExternalStoreWithSelector:_p}=pp;let Ad=!1;const gp=o=>o;function yp(o,a=gp,i){(hf?"production":void 0)!=="production"&&i&&!Ad&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),Ad=!0);const u=_p(o.subscribe,o.getState,o.getServerState||o.getInitialState,a,i);return hp(u),u}const Bd=o=>{(hf?"production":void 0)!=="production"&&typeof o!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const a=typeof o=="function"?ip(o):o,i=(u,d)=>yp(a,u,d);return Object.assign(i,a),i},xp=o=>o?Bd(o):Bd,Wd={iphone:{w:400,h:868},ipad:{w:500,h:716},mac:{w:640,h:400},watch:{w:205,h:251},android:{w:400,h:711}},ua={iphone:{deviceScale:92,deviceTop:15,deviceAngle:8},ipad:{deviceScale:92,deviceTop:15,deviceAngle:8},mac:{deviceScale:85,deviceTop:20,deviceAngle:0},watch:{deviceScale:80,deviceTop:22,deviceAngle:0},android:{deviceScale:92,deviceTop:15,deviceAngle:8}},vp={iphone:"iphone",android:"iphone",ipad:"ipad",mac:"mac",watch:"watch"};function _f(o,a){if(o==="android")return"generic-phone";const i=vp[o]??"iphone",u=a.filter(d=>d.category===i).sort((d,f)=>f.year-d.year)[0];return u?u.id:i==="ipad"?"ipad-pro-13":"generic-phone"}function bp(o,a,i){const u=_f(a,i);return o.map(d=>d.type!=="device"||d.frame===u&&(d.deviceColor??"")===""?d:{...d,frame:u,deviceColor:""})}function wp(o,a,i,u){var d,f,h;if(i!=="default")return(h=(f=(d=o[i])==null?void 0:d.screens)==null?void 0:f[a])==null?void 0:h[u]}function Rl(o,a,i){var f;const u=a.screens[o],d=ua[i]??ua.iphone;return{screenIndex:o,headline:u?u.headline:"New Frame",subtitle:u?u.subtitle??"":"",style:"minimal",layout:"center",font:a.theme.font,fontWeight:a.theme.fontWeight,headlineSize:a.theme.headlineSize??0,subtitleSize:a.theme.subtitleSize??0,headlineRotation:0,subtitleRotation:0,colors:{primary:a.theme.colors.primary,secondary:a.theme.colors.secondary,background:a.theme.colors.background,text:a.theme.colors.text,subtitle:a.theme.colors.subtitle??"#64748B"},frameId:a.frames.ios??a.frames.android??"",deviceColor:a.frames.deviceColor??"",frameStyle:a.frames.style==="3d"?"flat":a.frames.style,composition:"single",deviceScale:d.deviceScale,deviceTop:d.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:d.deviceAngle,deviceTilt:0,headlineGradient:null,subtitleGradient:null,autoSizeHeadline:!0,autoSizeSubtitle:!1,headlineLineHeight:0,headlineLetterSpacing:0,headlineTextTransform:"",headlineFontStyle:"",subtitleOpacity:0,subtitleLetterSpacing:0,subtitleTextTransform:"",spotlight:null,annotations:[],textPositions:{headline:null,subtitle:null},screenshotDataUrl:null,screenshotName:((f=u==null?void 0:u.screenshot)==null?void 0:f.split("/").pop())??null,screenshotDims:null,backgroundType:"solid",backgroundColor:"#ffffff",backgroundGradient:{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"},backgroundImageDataUrl:null,backgroundOverlay:null,deviceShadow:null,borderSimulation:null,cornerRadius:0,loupe:null,callouts:[],overlays:[],extraScreenshots:[]}}const kp=50;let Qr=[],ca=[],Wl=!1;function Ze(o){return JSON.parse(JSON.stringify(o))}function gf(o){return`${o}-${Math.random().toString(36).slice(2,10)}`}function dc(o){return{platform:o.platform,previewW:o.previewW,previewH:o.previewH,locale:o.locale,sessionLocales:Ze(o.sessionLocales),isPanoramic:o.isPanoramic,screens:Ze(o.screens),selectedScreen:o.selectedScreen,panoramicFrameCount:o.panoramicFrameCount,panoramicBackground:Ze(o.panoramicBackground),panoramicElements:Ze(o.panoramicElements),panoramicEffects:Ze(o.panoramicEffects),selectedElementIndex:o.selectedElementIndex,exportSize:o.exportSize,exportRenderer:o.exportRenderer}}function lr(o){return{platform:o.platform,previewW:o.previewW,previewH:o.previewH,locale:o.locale,sessionLocales:Ze(o.sessionLocales),isPanoramic:o.isPanoramic,screens:Ze(o.screens),selectedScreen:o.selectedScreen,panoramicFrameCount:o.panoramicFrameCount,panoramicBackground:Ze(o.panoramicBackground),panoramicElements:Ze(o.panoramicElements),panoramicEffects:Ze(o.panoramicEffects),selectedElementIndex:o.selectedElementIndex,exportSize:o.exportSize,exportRenderer:o.exportRenderer}}function Hr(o,a,i){if(!a)return o;const u=dc(i),d=new Date().toISOString();return o.map(f=>f.id===a?{...f,snapshot:u,updatedAt:d}:f)}function Io(o,a){const i=new Date().toISOString();return{id:gf("variant"),name:o,status:"draft",createdAt:i,updatedAt:i,snapshot:dc(a),artifacts:[]}}function $l(o,a="Variant"){let i=o.length+1,u=`${a} ${i}`;const d=new Set(o.map(f=>f.name));for(;d.has(u);)i+=1,u=`${a} ${i}`;return u}function Tn(o){Wl||(Qr.push({screens:Ze(o.screens),panoramicElements:Ze(o.panoramicElements),panoramicBackground:Ze(o.panoramicBackground),panoramicEffects:Ze(o.panoramicEffects),selectedScreen:o.selectedScreen,selectedElementIndex:o.selectedElementIndex}),ca=[],Qr.length>kp&&Qr.shift())}const W=xp((o,a)=>({config:null,variants:[],activeVariantId:null,platform:"iphone",previewW:400,previewH:868,selectedScreen:0,activeTab:"background",locale:"default",previewBg:"dark",renderVersion:0,isPanoramic:!1,panoramicFrameCount:5,panoramicBackground:{type:"solid",color:"#ffffff"},panoramicElements:[],panoramicEffects:{spotlight:null,annotations:[],overlays:[]},selectedElementIndex:null,fonts:[],frames:[],deviceFamilies:[],koubouAvailable:!1,sizes:{},exportSize:"",exportRenderer:"playwright",screens:[],sessionLocales:{},setConfig:i=>o({config:i}),setPlatform:i=>o({platform:i}),setPreviewSize:(i,u)=>o({previewW:i,previewH:u}),setSelectedScreen:i=>o({selectedScreen:i}),setActiveTab:i=>o({activeTab:i}),setLocale:i=>o({locale:i}),upsertLocaleConfig:(i,u)=>o(d=>({sessionLocales:{...d.sessionLocales,[i]:u}})),createVariant:i=>o(u=>{const d=Hr(u.variants,u.activeVariantId,u),f=Io(i??$l(d),u);return{variants:[...d,f],activeVariantId:f.id,...lr(f.snapshot)}}),duplicateActiveVariant:()=>o(i=>{const u=Hr(i.variants,i.activeVariantId,i),d=u.find(h=>h.id===i.activeVariantId),f=Io(d?`${d.name} Copy`:$l(u),i);return{variants:[...u,f],activeVariantId:f.id,...lr(f.snapshot)}}),createVariantSet:()=>o(i=>{const u=Hr(i.variants,i.activeVariantId,i),d=dc(i);if(u.length===1&&i.activeVariantId){const p=u[0];if(!p)return i;const $={...p,name:"Concept A",snapshot:d,updatedAt:new Date().toISOString()},x=Io("Concept B",i),L=Io("Concept C",i);return{variants:[$,x,L],activeVariantId:$.id,...lr($.snapshot)}}const f=Io($l(u,"Concept"),i),h=Io($l([...u,f],"Concept"),i),y=Io($l([...u,f,h],"Concept"),i);return{variants:[...u,f,h,y],activeVariantId:f.id,...lr(f.snapshot)}}),selectVariant:i=>o(u=>{if(i===u.activeVariantId)return u;const d=Hr(u.variants,u.activeVariantId,u),f=d.find(h=>h.id===i);return f?{variants:d,activeVariantId:i,...lr(f.snapshot)}:u}),renameVariant:(i,u)=>o(d=>({variants:d.variants.map(f=>f.id===i?{...f,name:u.trim()||f.name,updatedAt:new Date().toISOString()}:f)})),deleteVariant:i=>o(u=>{if(u.variants.length<=1)return u;if(i!==u.activeVariantId)return{variants:u.variants.filter(h=>h.id!==i)};const d=Hr(u.variants,u.activeVariantId,u).filter(h=>h.id!==i),f=d[0];return f?{variants:d,activeVariantId:f.id,...lr(f.snapshot)}:u}),setVariantStatus:(i,u)=>o(d=>({variants:d.variants.map(f=>f.id===i?{...f,status:u,updatedAt:new Date().toISOString()}:f)})),recordVariantArtifact:i=>o(u=>{const d=Hr(u.variants,u.activeVariantId,u);if(!u.activeVariantId)return{variants:d};const f={...i,id:gf("artifact"),exportedAt:new Date().toISOString()};return{variants:d.map(h=>h.id===u.activeVariantId?{...h,updatedAt:f.exportedAt,artifacts:[f,...h.artifacts]}:h)}}),setPreviewBg:i=>o({previewBg:i}),setExportSize:i=>o({exportSize:i}),setExportRenderer:i=>o({exportRenderer:i}),setFonts:i=>o({fonts:i}),setFrames:i=>o({frames:i}),setDeviceFamilies:i=>o({deviceFamilies:i}),setKoubouAvailable:i=>o({koubouAvailable:i}),setSizes:i=>o({sizes:i}),updateScreen:(i,u)=>o(d=>{const f=[...d.screens],h=f[i];return h?(Tn(d),f[i]={...h,...u},{screens:f}):d}),triggerRender:()=>o(i=>({renderVersion:i.renderVersion+1})),initScreens:(i,u)=>{var g;const d=i.mode==="panoramic",f=a(),h=f.locale,y=h!=="default"&&((g=i.locales)!=null&&g[h])?h:"default",p=Ze(i.locales??{}),$=i.screens.length>0?i.screens.map((S,N)=>Rl(N,i,u)):[],x=i.panoramic?{panoramicFrameCount:i.frameCount??5,panoramicBackground:i.panoramic.background,panoramicElements:i.panoramic.elements}:{panoramicFrameCount:f.panoramicFrameCount,panoramicBackground:f.panoramicBackground,panoramicElements:f.panoramicElements},L=Io("Concept A",{platform:u,previewW:f.previewW,previewH:f.previewH,locale:y,sessionLocales:p,isPanoramic:d,screens:$,selectedScreen:0,panoramicFrameCount:x.panoramicFrameCount,panoramicBackground:x.panoramicBackground,panoramicElements:x.panoramicElements,panoramicEffects:f.panoramicEffects,selectedElementIndex:null,exportSize:f.exportSize,exportRenderer:f.exportRenderer});o({config:i,sessionLocales:p,variants:[L],activeVariantId:L.id,isPanoramic:d,locale:y,screens:$,selectedScreen:0,selectedElementIndex:null,...x})},hydrateSession:i=>{const u=a(),{platform:d}=u,f=i.variants.map(p=>{const $=p.config,x=$.mode==="panoramic",L=Ze($.locales??{}),g=$.screens.length>0?$.screens.map((_,k)=>Rl(k,$,d)):[],S=$.panoramic?{panoramicFrameCount:$.frameCount??5,panoramicBackground:$.panoramic.background,panoramicElements:$.panoramic.elements}:{panoramicFrameCount:u.panoramicFrameCount,panoramicBackground:u.panoramicBackground,panoramicElements:u.panoramicElements},N=new Date().toISOString();return{id:p.id,name:p.name,status:p.status==="approved"?"approved":"draft",createdAt:N,updatedAt:N,snapshot:{platform:d,previewW:u.previewW,previewH:u.previewH,locale:"default",sessionLocales:L,isPanoramic:x,screens:g,selectedScreen:0,...S,panoramicEffects:u.panoramicEffects,selectedElementIndex:null,exportSize:u.exportSize,exportRenderer:u.exportRenderer},artifacts:[]}});if(f.length===0)return;const h=i.activeVariantId&&f.some(p=>p.id===i.activeVariantId)?i.activeVariantId:f[0].id,y=f.find(p=>p.id===h);o({variants:f,activeVariantId:h,...lr(y.snapshot)})},addScreen:()=>o(i=>{const{screens:u,config:d,platform:f}=i;if(!d)return i;Tn(i);const h=u[u.length-1],y=Rl(0,d,f);return y.screenIndex=u.length,y.headline=`Frame ${u.length+1}`,y.subtitle="",h&&(y.style=h.style,y.layout=h.layout,y.font=h.font,y.fontWeight=h.fontWeight,y.colors={...h.colors},y.frameId=h.frameId,y.deviceColor=h.deviceColor,y.frameStyle=h.frameStyle,y.composition=h.composition,y.deviceScale=h.deviceScale,y.deviceTop=h.deviceTop),{screens:[...u,y],selectedScreen:u.length}}),removeScreen:i=>o(u=>{if(u.screens.length<=1)return u;Tn(u);const d=u.screens.filter((h,y)=>y!==i).map((h,y)=>({...h,screenIndex:y}));let f=u.selectedScreen;return f>=d.length?f=d.length-1:f>i&&f--,{screens:d,selectedScreen:f}}),moveScreen:(i,u)=>o(d=>{if(u<0||u>=d.screens.length)return d;Tn(d);const f=[...d.screens],[h]=f.splice(i,1);return h?(f.splice(u,0,h),{screens:f.map((y,p)=>({...y,screenIndex:p})),selectedScreen:u}):d}),togglePanoramic:()=>o(i=>{var d;if(i.isPanoramic){if(i.screens.length===0&&i.config){const f=i.platform;return i.config.screens.length>0?{isPanoramic:!1,screens:i.config.screens.map((y,p)=>Rl(p,i.config,f)),selectedScreen:0}:{isPanoramic:!1,screens:[Rl(0,i.config,f)],selectedScreen:0}}return{isPanoramic:!1}}const u={isPanoramic:!0,selectedElementIndex:null};if(i.panoramicElements.length===0&&i.config&&i.screens.length>0){const f=i.config.theme.colors,h=i.screens.length,y=i.locale,p=i.sessionLocales;u.panoramicFrameCount=h,u.panoramicBackground={type:"solid",color:"#ffffff"};const $=[];for(let x=0;x<h;x++){const L=i.screens[x],g=x/h*100,S=g+100/h/2;$.push({type:"device",screenshot:((d=i.config.screens[x])==null?void 0:d.screenshot)??`screenshots/screen-${x+1}.png`,localeSourceScreen:x,frame:L.frameId||void 0,x:S-6,y:20,width:12,rotation:L.deviceRotation||0,z:5}),L.headline&&$.push({type:"text",content:wp(p,x,y,"headline")??L.headline,localeSourceScreen:x,localeSourceField:"headline",x:g+2,y:3,fontSize:3,color:f.text??"#FFFFFF",fontWeight:i.config.theme.fontWeight??700,fontStyle:"normal",textAlign:"left",lineHeight:1.15,maxWidth:Math.floor(100/h)-4,z:10})}u.panoramicElements=$}else i.panoramicElements.length===0&&i.config&&i.panoramicBackground.type==="solid"&&(!i.panoramicBackground.color||i.panoramicBackground.color==="#000000")&&(u.panoramicBackground={type:"solid",color:"#ffffff"});return u}),setSelectedElement:i=>o({selectedElementIndex:i}),updatePanoramicBackground:i=>o(u=>(Tn(u),{panoramicBackground:{...u.panoramicBackground,...i}})),updatePanoramicElement:(i,u)=>o(d=>{const f=[...d.panoramicElements],h=f[i];return h?(Tn(d),f[i]={...h,...u},{panoramicElements:f}):d}),syncPanoramicDevicesForPlatform:i=>o(u=>{const d=bp(u.panoramicElements,i,u.deviceFamilies);return d.some((h,y)=>u.panoramicElements[y]!==h)?(Tn(u),{panoramicElements:d}):u}),addPanoramicElement:i=>o(u=>(Tn(u),{panoramicElements:[...u.panoramicElements,i],selectedElementIndex:u.panoramicElements.length})),removePanoramicElement:i=>o(u=>{Tn(u);const d=u.panoramicElements.filter((h,y)=>y!==i);let f=u.selectedElementIndex;return f!==null&&(f===i?f=null:f>i&&f--),{panoramicElements:d,selectedElementIndex:f}}),setPanoramicFrameCount:i=>o(u=>{const d=u.panoramicFrameCount;if(d===i)return u;Tn(u);const f=d/i,h=u.panoramicElements.map(y=>{const p={...y,x:y.x*f};return y.type==="device"?{...p,width:y.width*f}:y.type==="image"?{...p,width:y.width*f}:y.type==="text"&&y.maxWidth?{...p,maxWidth:y.maxWidth*f}:y.type==="decoration"?{...p,width:y.width*f}:p});return{panoramicFrameCount:i,panoramicElements:h}}),updatePanoramicEffects:i=>o(u=>(Tn(u),{panoramicEffects:{...u.panoramicEffects,...i}})),undo:()=>{if(Qr.length===0)return;const i=a();ca.push({screens:Ze(i.screens),panoramicElements:Ze(i.panoramicElements),panoramicBackground:Ze(i.panoramicBackground),panoramicEffects:Ze(i.panoramicEffects),selectedScreen:i.selectedScreen,selectedElementIndex:i.selectedElementIndex});const u=Qr.pop();Wl=!0,o({screens:Ze(u.screens),panoramicElements:Ze(u.panoramicElements),panoramicBackground:Ze(u.panoramicBackground),panoramicEffects:Ze(u.panoramicEffects),selectedScreen:u.selectedScreen,selectedElementIndex:u.selectedElementIndex}),Wl=!1},redo:()=>{if(ca.length===0)return;const i=a();Qr.push({screens:Ze(i.screens),panoramicElements:Ze(i.panoramicElements),panoramicBackground:Ze(i.panoramicBackground),panoramicEffects:Ze(i.panoramicEffects),selectedScreen:i.selectedScreen,selectedElementIndex:i.selectedElementIndex});const u=ca.pop();Wl=!0,o({screens:Ze(u.screens),panoramicElements:Ze(u.panoramicElements),panoramicBackground:Ze(u.panoramicBackground),panoramicEffects:Ze(u.panoramicEffects),selectedScreen:u.selectedScreen,selectedElementIndex:u.selectedElementIndex}),Wl=!1}})),Rn="";async function yf(o){const a=await fetch(`${Rn}${o}`);if(!a.ok)throw new Error(`Request failed: ${a.statusText}`);return a.json()}async function xf(){return yf("/api/project")}async function Cp(){return yf("/api/session")}async function Sp(){return await fetch(`${Rn}/api/project/reload`,{method:"POST"}),xf()}async function jp(o,a){const i=await fetch(`${Rn}/api/preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o),signal:a});if(!i.ok)throw new Error(`Preview render failed: ${i.statusText}`);return i.text()}async function Ep(){const o=await fetch(`${Rn}/api/frames`);if(!o.ok)throw new Error(`Failed to fetch frames: ${o.statusText}`);return o.json()}async function Np(){const o=await fetch(`${Rn}/api/fonts`);if(!o.ok)throw new Error(`Failed to fetch fonts: ${o.statusText}`);return o.json()}async function Pp(){const o=await fetch(`${Rn}/api/koubou-devices`);if(!o.ok)throw new Error(`Failed to fetch koubou devices: ${o.statusText}`);return o.json()}async function Lp(){const o=await fetch(`${Rn}/api/sizes`);if(!o.ok)throw new Error(`Failed to fetch sizes: ${o.statusText}`);return o.json()}async function Ip(o,a){const i=await fetch(`${Rn}/api/panoramic-preview-html`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o),signal:a});if(!i.ok)throw new Error(`Panoramic preview failed: ${i.statusText}`);return i.text()}async function Tp(o){const a=await fetch(`${Rn}/api/export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!a.ok)throw new Error(`Export failed: ${a.statusText}`);return a.blob()}async function Rp(o){const a=await fetch(`${Rn}/api/panoramic-export`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!a.ok)throw new Error(`Panoramic export failed: ${a.statusText}`);return a.blob()}async function $p(o,a={}){const i=await fetch(`${Rn}/api/translate-locale`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({locale:o,...a})});if(!i.ok){let u=`Automatic translation failed: ${i.statusText}`;try{const d=await i.json();d.error&&(u=d.error)}catch{}throw new Error(u)}return i.json()}const Mp=[{id:"variants",label:"Variants"},{id:"background",label:"Background"},{id:"device",label:"Device"},{id:"text",label:"Text"},{id:"extras",label:"Extras"},{id:"export",label:"Download"}];function zp({sidebarOpen:o,onToggleSidebar:a,showSidebarToggle:i,agentMode:u,onToggleAgentMode:d}){const f=W(b=>b.config),h=W(b=>b.isPanoramic),y=W(b=>b.togglePanoramic),p=W(b=>b.activeTab),$=W(b=>b.setActiveTab),x=W(b=>b.activeVariantId),L=W(b=>b.variants),g=W(b=>b.selectedScreen),S=W(b=>b.screens),N=h?"Panoramic":"Individual",_=h?"Switch to Individual":"Switch to Panoramic",k=L.find(b=>b.id===x);return l.jsxs("div",{className:"w-full min-h-11 px-3 py-2 md:px-4 flex flex-wrap items-center gap-2 md:gap-4 border-b border-border bg-surface shrink-0",children:[l.jsxs("div",{className:"flex items-center gap-2 min-w-0",children:[i&&l.jsx("button",{className:`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${o?"border-accent/40 bg-accent/10 text-accent":"border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text"}`,onClick:a,"aria-expanded":o,"aria-controls":"editor-sidebar",children:o?"Hide Controls":"Show Controls"}),l.jsx("span",{className:"text-sm font-semibold whitespace-nowrap",children:"appframe"}),f&&l.jsx("span",{className:"text-xs text-text-dim truncate",children:f.app.name}),k&&l.jsx("span",{className:"hidden sm:inline-flex text-[10px] text-text-dim bg-surface-2 px-1.5 py-0.5 rounded whitespace-nowrap",children:k.name}),l.jsx("span",{className:"hidden sm:inline-flex text-[10px] text-text-dim bg-surface-2 px-1.5 py-0.5 rounded whitespace-nowrap",children:N}),!h&&S.length>0&&l.jsxs("span",{className:"text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded whitespace-nowrap",children:[g+1,"/",S.length]})]}),l.jsx("div",{className:"order-3 md:order-none basis-full md:basis-auto flex items-center gap-1 md:mx-auto overflow-x-auto",children:Mp.map(b=>l.jsx("button",{className:`text-[11px] px-3 py-1.5 rounded-md transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${p===b.id?"bg-accent/10 text-accent font-medium":"text-text-dim hover:text-text hover:bg-surface-2"}`,onClick:()=>$(b.id),children:b.label},b.id))}),l.jsxs("div",{className:"ml-auto flex items-center gap-2 shrink-0",children:[l.jsx("button",{className:`hidden sm:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${u?"border-emerald-400/40 bg-emerald-500/10 text-emerald-300":"border-border bg-bg text-text-dim hover:border-emerald-400/30 hover:text-text"}`,onClick:d,"aria-pressed":u,title:"Toggle the Agentation annotation overlay",children:u?"Agentation On":"Agentation Off"}),l.jsxs("button",{className:`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${h?"border-accent/40 bg-accent/10 text-accent":"border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text"}`,onClick:y,title:_,"aria-label":`${_}. Current mode: ${N}.`,"data-current-mode":N.toLowerCase(),children:[l.jsx("span",{className:"w-3 h-3 flex items-center justify-center","aria-hidden":"true",children:h?l.jsxs("svg",{viewBox:"0 0 12 12",fill:"none",className:"w-full h-full","aria-hidden":"true",children:[l.jsx("rect",{x:"0.5",y:"2",width:"11",height:"8",rx:"1",stroke:"currentColor",strokeWidth:"1"}),l.jsx("line",{x1:"3",y1:"2",x2:"3",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"}),l.jsx("line",{x1:"6",y1:"2",x2:"6",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"}),l.jsx("line",{x1:"9",y1:"2",x2:"9",y2:"10",stroke:"currentColor",strokeWidth:"0.5",strokeDasharray:"1 1"})]}):l.jsx("svg",{viewBox:"0 0 12 12",fill:"none",className:"w-full h-full","aria-hidden":"true",children:l.jsx("rect",{x:"2",y:"1",width:"8",height:"10",rx:"1",stroke:"currentColor",strokeWidth:"1"})})}),_]})]})]})}function pa(){const o=W(d=>d.selectedScreen),a=W(d=>d.screens[d.selectedScreen]),i=W(d=>d.updateScreen),u=C.useCallback(d=>{i(o,d)},[o,i]);return{screen:a,selectedScreen:o,update:u}}const ac=new Map;function Yd(o,a){a?ac.set(o,a):ac.delete(o)}function Op(o){return ac.get(o)??null}function fc(){const o=W(h=>h.selectedScreen),a=W(h=>h.previewW),i=C.useCallback(()=>{try{const h=Op(o);return(h==null?void 0:h.contentDocument)??null}catch{return null}},[o]),u=C.useCallback(h=>{const y=i();if(!y)return;const p=y.querySelector(".device-wrapper");if(p){if(h.deviceScale!==void 0){const $=y.querySelector(".canvas");if($){const x=$.getBoundingClientRect().width;if(p.dataset.origDw||(p.dataset.origDw=String(parseFloat(p.style.width)||p.getBoundingClientRect().width)),!p.dataset.origPerspective){const _=getComputedStyle(p).getPropertyValue("--device-perspective");p.dataset.origPerspective=String(parseFloat(_)||1500)}const L=parseFloat(p.dataset.origDw),g=Math.round(x*h.deviceScale/100),S=g/L;p.style.width=g+"px";const N=parseFloat(p.dataset.origPerspective);p.style.setProperty("--device-perspective",Math.round(N*S)+"px"),p.querySelectorAll(".screenshot-clip").forEach(_=>{const k=_;k.dataset.origLeft||(k.dataset.origLeft=k.style.left,k.dataset.origTop=k.style.top,k.dataset.origWidth=k.style.width,k.dataset.origHeight=k.style.height,k.dataset.origBr=k.style.borderRadius||""),k.style.left=Math.round(parseFloat(k.dataset.origLeft)*S)+"px",k.style.top=Math.round(parseFloat(k.dataset.origTop)*S)+"px",k.style.width=Math.round(parseFloat(k.dataset.origWidth)*S)+"px",k.style.height=Math.round(parseFloat(k.dataset.origHeight)*S)+"px",k.dataset.origBr&&(k.style.borderRadius=Math.round(parseFloat(k.dataset.origBr)*S)+"px")})}}if(h.deviceTop!==void 0){p.style.top=h.deviceTop+"%";for(const $ of[".glow-1",".glow-2",".orb-1",".orb-2",".bg-glow",".shape-1",".shape-3",".bg-shape-1"]){const x=y.querySelector($);x&&(x.style.top=h.deviceTop+"%")}}h.deviceOffsetX!==void 0&&(p.style.left=h.deviceOffsetX?`calc(50% + ${h.deviceOffsetX/100*a}px)`:"50%"),h.deviceRotation!==void 0&&p.style.setProperty("--device-rotation",`${h.deviceRotation}deg`),h.deviceAngle!==void 0&&p.style.setProperty("--device-angle",`${h.deviceAngle}deg`),h.deviceTilt!==void 0&&p.style.setProperty("--device-tilt",`${h.deviceTilt}deg`)}},[i,a]),d=C.useCallback(h=>{const y=i();if(!y)return;const p=y.querySelector(".canvas");if(p){if(h.type==="solid"&&h.color)p.style.background=h.color;else if(h.type==="gradient"&&h.colors){const $=h.colors.join(", ");h.gradientType==="radial"?p.style.background=`radial-gradient(circle at ${h.radialPosition??"center"}, ${$})`:p.style.background=`linear-gradient(${h.direction??135}deg, ${$})`}}},[i]),f=C.useCallback(h=>{const y=i();if(!y)return;const p=a/1290;if(h.headlineSize!==void 0||h.headlineRotation!==void 0){const $=y.querySelector(".headline");if($&&(h.headlineSize!==void 0&&($.style.fontSize=`${Math.round(h.headlineSize*p)}px`),h.headlineRotation!==void 0)){const x=["translateX(-50%)"];h.headlineRotation&&x.push(`rotate(${h.headlineRotation}deg)`),$.style.transform=x.join(" ")}}if(h.subtitleSize!==void 0||h.subtitleRotation!==void 0){const $=y.querySelector(".subtitle");if($&&(h.subtitleSize!==void 0&&($.style.fontSize=`${Math.round(h.subtitleSize*p)}px`),h.subtitleRotation!==void 0)){const x=["translateX(-50%)"];h.subtitleRotation&&x.push(`rotate(${h.subtitleRotation}deg)`),$.style.transform=x.join(" ")}}},[i,a]);return{patchDevice:u,patchBackground:d,patchText:f}}function Oe({title:o,children:a,hidden:i,tooltip:u,defaultCollapsed:d=!0}){const[f,h]=C.useState(d),y=C.useRef(null),[p,$]=C.useState(void 0);return C.useEffect(()=>{y.current&&!f&&$(y.current.scrollHeight)},[a,f]),i?null:l.jsxs("div",{className:"mx-3 my-1.5 first:mt-3 last:mb-3",children:[o&&l.jsxs("button",{className:"w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-surface-2 border border-border text-left cursor-pointer hover:border-accent/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",onClick:()=>h(!f),"aria-expanded":!f,children:[l.jsx("span",{className:"flex-1 text-[12px] font-medium text-text",children:o}),u&&l.jsx("span",{className:"inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-border text-[9px] text-text-dim cursor-help leading-none shrink-0",title:u,onClick:x=>x.stopPropagation(),"aria-label":u,children:"?"}),l.jsx("svg",{className:`w-3.5 h-3.5 text-text-dim shrink-0 transition-transform duration-200 ${f?"":"rotate-180"}`,viewBox:"0 0 12 12",fill:"none","aria-hidden":"true",children:l.jsx("path",{d:"M3 4.5l3 3 3-3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),l.jsx("div",{ref:y,className:"overflow-hidden transition-all duration-200 ease-in-out",style:{maxHeight:f?0:p??"none",opacity:f?0:1},"aria-hidden":f,children:l.jsx("div",{className:"px-1 pt-3 pb-1",children:a})})]})}function qe({label:o,value:a,onChange:i,onInstant:u,presets:d,onPresetClick:f}){const h=C.useId();return l.jsxs("div",{className:"mb-2.5",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("label",{htmlFor:h,className:"text-xs text-text-dim flex-1",children:o}),l.jsx("input",{id:h,type:"color",value:a,"aria-label":o,className:"w-8 h-8 border border-border rounded-md cursor-pointer bg-transparent p-0.5",onInput:y=>{u==null||u(y.target.value)},onChange:y=>{i(y.target.value)}})]}),d&&d.length>0&&l.jsx("div",{className:"flex flex-wrap gap-1 mt-1.5",children:d.map(y=>l.jsx("button",{className:"w-6 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:y},title:y,"aria-label":`Select color ${y}`,onClick:()=>{f==null||f(y),i(y)}},y))})]})}function K({label:o,value:a,min:i,max:u,step:d=1,formatValue:f,onChange:h,onInstant:y,disabled:p}){const $=C.useId(),x=f?f(a):String(a),[L,g]=C.useState(!1),[S,N]=C.useState(""),_=C.useRef(null);C.useEffect(()=>{var b;L&&((b=_.current)==null||b.select())},[L]);function k(){g(!1);const b=parseFloat(S);if(Number.isNaN(b))return;const Z=Math.min(u,Math.max(i,b)),U=Math.round(Z/d)*d;h(U)}return l.jsxs("div",{className:`mb-2.5${p?" opacity-50 cursor-not-allowed":""}`,children:[l.jsx("label",{htmlFor:$,className:"block text-xs text-text-dim mb-1",children:o}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("input",{id:$,type:"range",min:i,max:u,step:d,value:a,disabled:p,"aria-label":o,"aria-valuemin":i,"aria-valuemax":u,"aria-valuenow":a,"aria-valuetext":x,className:"w-full accent-accent",onInput:b=>{const Z=Number(b.target.value);y==null||y(Z)},onChange:b=>{h(Number(b.target.value))}}),L?l.jsx("input",{ref:_,type:"text",inputMode:"decimal","aria-label":`Edit ${o} value`,value:S,onChange:b=>N(b.target.value),onBlur:k,onKeyDown:b=>{b.key==="Enter"&&k(),b.key==="Escape"&&g(!1)},className:"text-xs text-text bg-surface border border-border rounded px-1 py-0 min-w-[40px] w-[48px] text-right shrink-0 outline-none focus:border-accent"}):l.jsx("span",{className:`text-xs text-text-dim min-w-[40px] text-right shrink-0 transition-colors${p?"":" cursor-text hover:text-text"}`,tabIndex:p?void 0:0,role:"spinbutton","aria-label":`${o}: ${x}. Click to edit`,"aria-valuenow":a,"aria-valuetext":x,onClick:()=>{p||(N(String(a)),g(!0))},onKeyDown:b=>{p||(b.key==="Enter"||b.key===" ")&&(b.preventDefault(),N(String(a)),g(!0))},children:x})]})]})}const bt=C.memo(function({label:a,checked:i,onChange:u}){return l.jsx("div",{className:"mb-2.5",children:l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"checkbox",checked:i,onChange:d=>u(d.target.checked),className:"accent-accent"}),a]})})}),Ge=C.memo(function({label:a,value:i,onChange:u,options:d,groups:f,hidden:h}){const y=C.useId();return h?null:l.jsxs("div",{className:"mb-2.5",children:[a&&l.jsx("label",{htmlFor:y,className:"block text-xs text-text-dim mb-1",children:a}),l.jsxs("select",{id:y,value:i,onChange:p=>u(p.target.value),"aria-label":a||void 0,className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent",children:[d==null?void 0:d.map(p=>l.jsx("option",{value:p.value,disabled:p.disabled,title:p.title,children:p.label},p.value)),f==null?void 0:f.map(p=>l.jsx("optgroup",{label:p.label,children:p.options.map($=>l.jsx("option",{value:$.value,disabled:$.disabled,title:$.title,children:$.label},$.value))},p.label))]})]})}),vf=["#000000","#1a1a2e","#16213e","#0f3460","#533483","#e94560","#f5f5f5","#fafafa","#2d3436","#636e72","#00b894","#00cec9","#6c5ce7","#fdcb6e","#e17055","#dfe6e9","#b2bec3","#2c3e50","#8e44ad","#2980b9"],mc=[{name:"Sunset",colors:["#ff6b35","#f7c948","#ff3864"],direction:135},{name:"Ocean",colors:["#0052d4","#4364f7","#6fb1fc"],direction:135},{name:"Midnight",colors:["#0f0c29","#302b63","#24243e"],direction:135},{name:"Sky",colors:["#2980b9","#6dd5fa","#ffffff"],direction:180},{name:"Horizon",colors:["#003973","#e5e5be","#f7a600"],direction:180},{name:"Vapor",colors:["#fc5c7d","#ce9ffc","#6a82fb"],direction:135},{name:"Tropical",colors:["#f7971e","#ffd200","#21d4fd"],direction:135},{name:"Dusk Sky",colors:["#2c3e50","#4ca1af","#c4e0e5"],direction:180},{name:"Flamingo",colors:["#ee5a24","#f0932b","#fad390"],direction:135},{name:"Arctic",colors:["#1e3c72","#2a5298","#e8f5e9"],direction:180},{name:"Velvet",colors:["#6a0572","#ab83a1","#f5e6cc"],direction:135},{name:"Lush",colors:["#004e92","#00b4db","#88d8b0"],direction:135},{name:"Aurora",colors:["#00c9ff","#92fe9d"],direction:135},{name:"Coral",colors:["#ff9a9e","#fecfef"],direction:135},{name:"Lavender",colors:["#a18cd1","#fbc2eb"],direction:135},{name:"Emerald",colors:["#11998e","#38ef7d"],direction:135},{name:"Fire",colors:["#f83600","#f9d423"],direction:135},{name:"Berry",colors:["#8e2de2","#4a00e0"],direction:135},{name:"Peach",colors:["#ffecd2","#fcb69f"],direction:135},{name:"Dusk",colors:["#2c3e50","#fd746c"],direction:135},{name:"Mint",colors:["#00b09b","#96c93d"],direction:135},{name:"Rose",colors:["#ee9ca7","#ffdde1"],direction:135},{name:"Indigo",colors:["#667eea","#764ba2"],direction:135},{name:"Candy",colors:["#fc5c7d","#6a82fb"],direction:135},{name:"Forest",colors:["#134e5e","#71b280"],direction:135},{name:"Neon",colors:["#00f260","#0575e6"],direction:135},{name:"Warm",colors:["#f093fb","#f5576c"],direction:135}],bf={"Natural Titanium":"#9a8e7e","Black Titanium":"#3c3c3c","White Titanium":"#e8e5e0","Desert Titanium":"#c4a882","Blue Titanium":"#394e5f",Black:"#1c1c1e",White:"#f5f5f7",Pink:"#f9cdd3",Teal:"#5eb5b5",Ultramarine:"#4a50c7",Blue:"#5b8fb9",Green:"#3f6e4e",Yellow:"#f2d44e",Red:"#c43d40",Purple:"#7c5dab",Midnight:"#2c2c3a",Starlight:"#f0e8d8","Product Red":"#c43d40","Space Black":"#2a2a2c","Space Gray":"#636366",Silver:"#d6d6d6",Gold:"#e3caa5","Deep Purple":"#5e4580",Graphite:"#4f4f4f","Pacific Blue":"#1e5c82","Sierra Blue":"#9fb8cf","Alpine Green":"#3c5e48","Rose Gold":"#e6c0aa"},Fp=[{value:"minimal",label:"Minimal"},{value:"bold",label:"Bold"},{value:"glow",label:"Glow"},{value:"playful",label:"Playful"},{value:"clean",label:"Clean"},{value:"branded",label:"Branded"},{value:"editorial",label:"Editorial"}],Dp=[{value:"solid",label:"Solid"},{value:"gradient",label:"Gradient"},{value:"image",label:"Image"},{value:"preset",label:"Preset"}],Ap=[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}];function Bp(){const{screen:o,update:a}=pa(),i=C.useRef(null),{patchBackground:u}=fc(),d=C.useCallback(g=>u({type:"solid",color:g}),[u]),f=C.useCallback(g=>{if(!o)return;const S=o.backgroundGradient;u({type:"gradient",gradientType:S.type,colors:(g==null?void 0:g.colors)??S.colors,direction:(g==null?void 0:g.direction)??S.direction,radialPosition:S.radialPosition})},[o,u]),[h,y]=C.useState(!1);if(!o)return null;const p=o.backgroundType,$=h||p==="preset"?"preset":p,x=g=>{var _;const S=(_=g.target.files)==null?void 0:_[0];if(!S)return;const N=new FileReader;N.onload=k=>{var le;const b=(le=k.target)==null?void 0:le.result,{selectedScreen:Z,updateScreen:U}=W.getState();U(Z,{backgroundImageDataUrl:b})},N.readAsDataURL(S),g.target.value=""},L=()=>{const g=[...o.backgroundGradient.colors];g.length>=5||(g.push("#ffffff"),a({backgroundGradient:{...o.backgroundGradient,colors:g}}))};return l.jsxs(l.Fragment,{children:[l.jsxs(Oe,{title:"Background",tooltip:"Choose between solid colors, gradients, images, or template presets for your screenshot background.",defaultCollapsed:!1,children:[l.jsx("div",{className:"flex gap-3 mb-2.5",children:Dp.map(g=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"bg-type",value:g.value,checked:$===g.value,onChange:()=>{g.value==="preset"?y(!0):(y(!1),a({backgroundType:g.value}))},className:"accent-accent"}),g.label]},g.value))}),$==="preset"&&l.jsx(Ge,{label:"Style Preset",value:p==="preset"?o.style:"",onChange:g=>{a({backgroundType:"preset",style:g})},options:[{value:"",label:"Select a preset...",disabled:!0},...Fp]}),$==="solid"&&l.jsx(qe,{label:"Color",value:o.backgroundColor,onChange:g=>a({backgroundColor:g}),onInstant:d,presets:vf}),$==="gradient"&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:mc.map(g=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${g.direction}deg, ${g.colors.join(", ")})`},title:g.name,"aria-label":`Apply ${g.name} gradient`,onClick:()=>a({backgroundGradient:{type:"linear",colors:[...g.colors],direction:g.direction,radialPosition:"center"}})},g.name))}),l.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(g=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"gradient-type",checked:o.backgroundGradient.type===g,onChange:()=>a({backgroundGradient:{...o.backgroundGradient,type:g}}),className:"accent-accent"}),g.charAt(0).toUpperCase()+g.slice(1)]},g))}),o.backgroundGradient.type==="linear"&&l.jsx(K,{label:"Direction",value:o.backgroundGradient.direction,min:0,max:360,formatValue:g=>`${g}°`,onChange:g=>a({backgroundGradient:{...o.backgroundGradient,direction:g}}),onInstant:g=>f({direction:g})}),o.backgroundGradient.type==="radial"&&l.jsx(Ge,{label:"Center",value:o.backgroundGradient.radialPosition,onChange:g=>a({backgroundGradient:{...o.backgroundGradient,radialPosition:g}}),options:Ap}),o.backgroundGradient.colors.map((g,S)=>l.jsx(qe,{label:`Stop ${S+1}`,value:g,onChange:N=>{const _=[...o.backgroundGradient.colors];_[S]=N,a({backgroundGradient:{...o.backgroundGradient,colors:_}})}},S)),o.backgroundGradient.colors.length<5&&l.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:L,children:"+ Add Color Stop"})]}),$==="image"&&l.jsxs(l.Fragment,{children:[!o.backgroundImageDataUrl&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Upload a custom image to use as the screenshot background. Supports PNG, JPEG, and WebP."}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var g;return(g=i.current)==null?void 0:g.click()},children:"Upload Background Image"}),l.jsx("input",{ref:i,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload background image",onChange:x}),o.backgroundImageDataUrl&&l.jsxs("div",{className:"mt-1.5",children:[l.jsx("img",{src:o.backgroundImageDataUrl,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>a({backgroundImageDataUrl:null}),children:"Remove"})]}),l.jsxs("div",{className:"mt-2",children:[l.jsx(bt,{label:"Dim Overlay",checked:!!o.backgroundOverlay,onChange:g=>a({backgroundOverlay:g?{color:"#000000",opacity:.3}:null})}),o.backgroundOverlay&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Color",value:o.backgroundOverlay.color,onChange:g=>a({backgroundOverlay:{...o.backgroundOverlay,color:g}})}),l.jsx(K,{label:"Opacity",value:Math.round(o.backgroundOverlay.opacity*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>a({backgroundOverlay:{...o.backgroundOverlay,opacity:g/100}})})]})]})]})]}),l.jsxs(Oe,{title:"Preset Colors",hidden:p!=="preset",tooltip:"Override the default colors for the selected template preset.",children:[l.jsx(qe,{label:"Primary",value:o.colors.primary,onChange:g=>a({colors:{...o.colors,primary:g}})}),l.jsx(qe,{label:"Secondary",value:o.colors.secondary,onChange:g=>a({colors:{...o.colors,secondary:g}})}),l.jsx(qe,{label:"Background",value:o.colors.background,onChange:g=>a({colors:{...o.colors,background:g}})})]})]})}function Hd(o,a,i){const d=[{name:"nw",x:i.x,y:i.y},{name:"ne",x:i.x+i.w,y:i.y},{name:"sw",x:i.x,y:i.y+i.h},{name:"se",x:i.x+i.w,y:i.y+i.h}];for(const f of d)if(Math.abs(o-f.x)<12&&Math.abs(a-f.y)<12)return f.name;return o>i.x&&o<i.x+i.w&&a>i.y&&a<i.y+i.h?"move":"new"}const Wp={nw:"nw-resize",ne:"ne-resize",sw:"sw-resize",se:"se-resize",move:"move",new:"crosshair"};function Yp({imageDataUrl:o,onApply:a,onCancel:i}){const u=C.useRef(null),d=C.useRef(null),f=C.useRef(null),h=C.useRef({x:0,y:0,w:0,h:0}),y=C.useRef(1),p=C.useRef({mode:null,startX:0,startY:0,startCrop:{x:0,y:0,w:0,h:0}}),$=C.useCallback(()=>{const g=d.current,S=f.current;if(!g||!S)return;const N=g.getContext("2d");if(!N)return;const _=g.width,k=g.height,b=h.current;N.clearRect(0,0,_,k),N.drawImage(S,0,0,_,k),N.fillStyle="rgba(0,0,0,0.5)",N.fillRect(0,0,_,b.y),N.fillRect(0,b.y+b.h,_,k-b.y-b.h),N.fillRect(0,b.y,b.x,b.h),N.fillRect(b.x+b.w,b.y,_-b.x-b.w,b.h),N.strokeStyle="#fff",N.lineWidth=2,N.strokeRect(b.x,b.y,b.w,b.h);const Z=8;N.fillStyle="#fff";const U=[[b.x,b.y],[b.x+b.w,b.y],[b.x,b.y+b.h],[b.x+b.w,b.y+b.h]];for(const[le,ne]of U)N.fillRect(le-Z/2,ne-Z/2,Z,Z);N.strokeStyle="rgba(255,255,255,0.25)",N.lineWidth=1;for(let le=1;le<=2;le++)N.beginPath(),N.moveTo(b.x+b.w*le/3,b.y),N.lineTo(b.x+b.w*le/3,b.y+b.h),N.stroke(),N.beginPath(),N.moveTo(b.x,b.y+b.h*le/3),N.lineTo(b.x+b.w,b.y+b.h*le/3),N.stroke()},[]);C.useEffect(()=>{var S;const g=N=>{if(N.key==="Escape"){i();return}if(N.key==="Tab"&&u.current){const _=u.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');if(_.length===0)return;const k=_[0],b=_[_.length-1];N.shiftKey&&document.activeElement===k?(N.preventDefault(),b.focus()):!N.shiftKey&&document.activeElement===b&&(N.preventDefault(),k.focus())}};return window.addEventListener("keydown",g),(S=u.current)==null||S.focus(),()=>window.removeEventListener("keydown",g)},[i]),C.useEffect(()=>{const g=new Image;g.onload=()=>{f.current=g;const S=g.naturalWidth,N=g.naturalHeight,_=window.innerWidth*.8,k=window.innerHeight*.7,b=Math.min(_/S,k/N,1);y.current=b;const Z=Math.round(S*b),U=Math.round(N*b),le=d.current;le&&(le.width=Z,le.height=U,h.current={x:Math.round(Z*.1),y:Math.round(U*.1),w:Math.round(Z*.8),h:Math.round(U*.8)},$())},g.src=o},[o,$]);const x=C.useCallback(g=>{const S=d.current;if(!S)return;const N=S.getBoundingClientRect(),_=g.clientX-N.left,k=g.clientY-N.top,b=Hd(_,k,h.current),Z=h.current;p.current={mode:b==="new"?"se":b,startX:_,startY:k,startCrop:{...Z}},b==="new"&&(h.current={x:_,y:k,w:0,h:0})},[]);C.useEffect(()=>{const g=N=>{const _=d.current;if(!_)return;const k=_.getBoundingClientRect(),b=_.width,Z=_.height,U=p.current;if(!U.mode){const w=Hd(N.clientX-k.left,N.clientY-k.top,h.current);_.style.cursor=Wp[w]??"crosshair";return}const le=Math.max(0,Math.min(b,N.clientX-k.left)),ne=Math.max(0,Math.min(Z,N.clientY-k.top)),ie=le-U.startX,he=ne-U.startY,re=U.startCrop,G=h.current;U.mode==="move"?(G.x=Math.max(0,Math.min(b-re.w,re.x+ie)),G.y=Math.max(0,Math.min(Z-re.h,re.y+he))):U.mode==="se"?(G.w=Math.max(10,le-G.x),G.h=Math.max(10,ne-G.y)):U.mode==="nw"?(G.x=Math.min(re.x+re.w-10,re.x+ie),G.y=Math.min(re.y+re.h-10,re.y+he),G.w=re.w-(G.x-re.x),G.h=re.h-(G.y-re.y)):U.mode==="ne"?(G.y=Math.min(re.y+re.h-10,re.y+he),G.w=Math.max(10,re.w+ie),G.h=re.h-(G.y-re.y)):U.mode==="sw"&&(G.x=Math.min(re.x+re.w-10,re.x+ie),G.w=re.w-(G.x-re.x),G.h=Math.max(10,re.h+he)),$()},S=()=>{p.current.mode=null};return document.addEventListener("mousemove",g),document.addEventListener("mouseup",S),()=>{document.removeEventListener("mousemove",g),document.removeEventListener("mouseup",S)}},[$]);const L=C.useCallback(()=>{const g=f.current;if(!g)return;const S=h.current,N=y.current,_=Math.round(S.x/N),k=Math.round(S.y/N);let b=Math.round(S.w/N),Z=Math.round(S.h/N);b=Math.min(b,g.naturalWidth-_),Z=Math.min(Z,g.naturalHeight-k);const U=document.createElement("canvas");U.width=b,U.height=Z;const le=U.getContext("2d");le&&(le.drawImage(g,_,k,b,Z,0,0,b,Z),a(U.toDataURL("image/png")))},[a]);return l.jsxs("div",{ref:u,tabIndex:-1,role:"dialog","aria-modal":"true","aria-label":"Crop screenshot",className:"fixed inset-0 z-[9999] flex flex-col items-center justify-center outline-none",style:{background:"rgba(0,0,0,0.8)"},children:[l.jsx("div",{className:"text-white text-base font-semibold mb-3",children:"Crop Screenshot"}),l.jsx("canvas",{ref:d,className:"border border-white/30",style:{cursor:"crosshair"},role:"img","aria-label":"Screenshot crop area. Click and drag to select the region to crop.",onMouseDown:x}),l.jsxs("div",{className:"flex gap-2 mt-3",children:[l.jsx("button",{className:"px-6 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent-hover",onClick:L,children:"Apply Crop"}),l.jsx("button",{className:"px-6 py-2 text-sm bg-surface-2 text-text-dim border border-border rounded-md hover:text-text",onClick:i,children:"Cancel"})]})]})}function pc(o){return Wd[o]??Wd.iphone}function ha(o,a){var i,u;return(u=(i=o[a])==null?void 0:i[0])==null?void 0:u.key}const Hp={single:{deviceCount:1,slots:[{offsetX:0,offsetY:15,scale:92,rotation:0,angle:0,tilt:0,zIndex:1}]},"duo-overlap":{deviceCount:2,slots:[{offsetX:-30,offsetY:18,scale:85,rotation:-12,angle:12,tilt:2,zIndex:1},{offsetX:22,offsetY:8,scale:88,rotation:4,angle:0,tilt:0,zIndex:2}]},"duo-split":{deviceCount:2,slots:[{offsetX:-38,offsetY:12,scale:80,rotation:-5,angle:8,tilt:2,zIndex:1},{offsetX:38,offsetY:12,scale:80,rotation:5,angle:-8,tilt:2,zIndex:1}]},"hero-tilt":{deviceCount:2,slots:[{offsetX:-35,offsetY:20,scale:78,rotation:-15,angle:15,tilt:4,zIndex:1},{offsetX:12,offsetY:8,scale:92,rotation:0,angle:0,tilt:0,zIndex:2}]},"fanned-cards":{deviceCount:3,slots:[{offsetX:-35,offsetY:16,scale:68,rotation:-18,angle:0,tilt:0,zIndex:1},{offsetX:0,offsetY:8,scale:72,rotation:0,angle:0,tilt:0,zIndex:3},{offsetX:35,offsetY:16,scale:68,rotation:18,angle:0,tilt:0,zIndex:2}]}},Vp=[{value:"center",label:"Center"},{value:"angled-left",label:"Angled Left"},{value:"angled-right",label:"Angled Right"}],Up=[{value:"flat",label:"Flat"},{value:"none",label:"None (frameless)"}],Xp=[{value:"single",label:"Single Device"}],Qp=[{label:"Multi-Device",options:[{value:"duo-overlap",label:"Duo Overlap (2)"},{value:"duo-split",label:"Duo Split (2)"},{value:"hero-tilt",label:"Hero + Background (2)"},{value:"fanned-cards",label:"Fanned Cards (3)"}]}],Gp=[{value:"iphone",label:"iPhone"},{value:"ipad",label:"iPad"},{value:"mac",label:"Mac"},{value:"watch",label:"Apple Watch"},{value:"android",label:"Android"}],Vd=.15;function Ud(o,a){const i=o.width/o.height;return Math.abs(a-i)/i<Vd||Math.abs(a-1/i)/(1/i)<Vd}const Kp={iphone:["iphone"],android:["iphone"],ipad:["ipad"],mac:["mac"],watch:["watch"]},Zp={iphone:["default-ios","default-android"],android:["default-ios","default-android"],ipad:["default-ipad","fallback-tablet"],mac:[],watch:[]};function Jp(o,a,i,u,d){const f=i?i.width/i.height:null,h=!u&&f!==null,y=Kp[d]??["iphone"],p=Zp[d]??[],$={};for(const g of o){const S=g.category||"other";if(!u&&!y.includes(S)||h&&!Ud(g.screenResolution,f))continue;const N=$[S]??[];N.push({value:g.id,label:g.name}),$[S]=N}const x=Object.entries($).map(([g,S])=>({label:g.charAt(0).toUpperCase()+g.slice(1),options:S})),L=[];for(const g of a){if(!u&&p.length>0){if(!(g.tags??[]).some(N=>p.includes(N)))continue}else if(!u&&p.length===0)continue;h&&g.screenResolution&&!Ud(g.screenResolution,f)||L.push({value:g.id,label:g.name})}return L.length>0&&x.push({label:"SVG Frames",options:L}),x}function qp(){var H,ce,Pe;const{screen:o,update:a}=pa(),i=W(O=>O.platform),u=W(O=>O.setPlatform),d=W(O=>O.setPreviewSize),f=W(O=>O.sizes),h=W(O=>O.setExportSize),y=W(O=>O.triggerRender),p=W(O=>O.updateScreen),$=W(O=>O.screens),x=W(O=>O.deviceFamilies),L=W(O=>O.frames),g=C.useRef(null),[S,N]=C.useState(!1),[_,k]=C.useState(!1),{patchDevice:b}=fc(),Z=C.useCallback((O,je)=>b({[O]:je}),[b]),U=O=>{u(O);const je=pc(O);d(je.w,je.h);const M=ha(f,O);M&&h(M);const z=_f(O,x);for(let V=0;V<$.length;V++)p(V,{frameId:z,deviceColor:""});y()};if(!o)return null;const le=x.find(O=>O.id===o.frameId),ne=le&&le.colors.length>1,ie=le&&le.screenRect,he=o.frameStyle==="none",re=o.layout==="angled-left"||o.layout==="angled-right",G=C.useMemo(()=>Jp(x,L,o.screenshotDims,_,i),[x,L,o.screenshotDims,_,i]),w=O=>{var z;const je=(z=O.target.files)==null?void 0:z[0];if(!je)return;const M=new FileReader;M.onload=V=>{var de;const I=(de=V.target)==null?void 0:de.result,D=new Image;D.onload=()=>{const pe={width:D.naturalWidth,height:D.naturalHeight};a({screenshotDataUrl:I,screenshotName:je.name,screenshotDims:pe})},D.src=I},M.readAsDataURL(je),O.target.value=""},ke=O=>{N(!1);const je=new Image;je.onload=()=>{const M={width:je.naturalWidth,height:je.naturalHeight};a({screenshotDataUrl:O,screenshotDims:M})},je.src=O},fe=ua[i]??ua.iphone;return l.jsxs(l.Fragment,{children:[S&&o.screenshotDataUrl&&l.jsx(Yp,{imageDataUrl:o.screenshotDataUrl,onApply:ke,onCancel:()=>N(!1)}),l.jsx(Oe,{title:"Platform",tooltip:"Choose the target platform. This adjusts the preview dimensions and available device frames.",defaultCollapsed:!1,children:l.jsx(Ge,{label:"Platform",value:i,onChange:U,options:Gp})}),l.jsxs(Oe,{title:"Screenshot",children:[o.screenshotDataUrl&&l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:o.screenshotDataUrl,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:o.screenshotName||"Custom upload"})]}),!o.screenshotDataUrl&&o.screenshotName&&l.jsx("div",{className:"text-xs text-text-dim mb-2",children:o.screenshotName}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var O;return(O=g.current)==null?void 0:O.click()},children:"Upload Screenshot"}),l.jsx("input",{ref:g,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload screenshot image",onChange:w}),o.screenshotDataUrl&&l.jsxs("div",{className:"flex gap-1 mt-1.5",children:[l.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>N(!0),children:"Crop"}),l.jsx("button",{className:"flex-1 py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>a({screenshotDataUrl:null,screenshotName:null,screenshotDims:null}),children:"Revert"})]})]}),l.jsxs(Oe,{title:"Device Frame",children:[l.jsx(Ge,{label:"Device",value:o.frameId,onChange:O=>{const je=x.find(z=>z.id===O);je&&je.screenRect&&o.frameStyle==="none"?a({frameId:O,frameStyle:"flat"}):a({frameId:O})},groups:G}),o.screenshotDims&&l.jsx(bt,{label:"Show all frames",checked:_,onChange:k}),ne&&l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),l.jsx("div",{className:"flex flex-wrap gap-1",children:le.colors.map(O=>l.jsx("button",{className:`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none ${o.deviceColor===O.name?"border-accent ring-1 ring-accent":"border-border"}`,style:{background:bf[O.name]??"#888888"},title:O.name,"aria-label":`${O.name} color variant`,"aria-pressed":o.deviceColor===O.name,onClick:()=>a({deviceColor:O.name})},O.name))})]}),l.jsx(Ge,{label:"Frame Style",value:o.frameStyle,onChange:O=>a({frameStyle:O}),options:Up,hidden:!!ie}),he&&l.jsxs(l.Fragment,{children:[l.jsx(bt,{label:"Border Simulation",checked:!!o.borderSimulation,onChange:O=>a({borderSimulation:O?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:null})}),o.borderSimulation&&l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Thickness",value:o.borderSimulation.thickness,min:1,max:20,formatValue:O=>`${O}px`,onChange:O=>a({borderSimulation:{...o.borderSimulation,thickness:O}})}),l.jsx(qe,{label:"Color",value:o.borderSimulation.color,onChange:O=>a({borderSimulation:{...o.borderSimulation,color:O}})}),l.jsx(K,{label:"Radius",value:o.borderSimulation.radius,min:0,max:60,formatValue:O=>`${O}px`,onChange:O=>a({borderSimulation:{...o.borderSimulation,radius:O}})})]})]})]}),l.jsxs(Oe,{title:"Device Layout",tooltip:"Control the size, position, rotation, and tilt of the device in the screenshot frame.",children:[l.jsx(bt,{label:"Fullscreen Screenshot",checked:o.style==="fullscreen",onChange:O=>a({style:O?"fullscreen":"minimal"})}),o.style!=="fullscreen"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Layout",value:o.layout,onChange:O=>a({layout:O}),options:Vp}),l.jsx(K,{label:"Device Size",value:o.deviceScale,min:50,max:100,formatValue:O=>`${O}%`,onChange:O=>a({deviceScale:O}),onInstant:O=>Z("deviceScale",O)}),l.jsx(K,{label:"Device Position",value:o.deviceTop,min:-80,max:80,formatValue:O=>`${O}%`,onChange:O=>a({deviceTop:O}),onInstant:O=>Z("deviceTop",O)}),l.jsx(K,{label:"Horizontal Position",value:o.deviceOffsetX,min:-80,max:80,formatValue:O=>`${O}%`,onChange:O=>a({deviceOffsetX:O}),onInstant:O=>Z("deviceOffsetX",O)}),l.jsx(K,{label:"Device Rotation",value:o.deviceRotation,min:-180,max:180,formatValue:O=>`${O}°`,onChange:O=>a({deviceRotation:O}),onInstant:O=>Z("deviceRotation",O)}),re&&l.jsx(K,{label:"Perspective Angle",value:o.deviceAngle,min:2,max:45,formatValue:O=>`${O}°`,onChange:O=>a({deviceAngle:O}),onInstant:O=>Z("deviceAngle",O)}),l.jsx(K,{label:"3D Tilt",value:o.deviceTilt,min:0,max:40,formatValue:O=>`${O}°`,onChange:O=>a({deviceTilt:O}),onInstant:O=>Z("deviceTilt",O)}),he&&l.jsx(K,{label:"Corner Radius",value:o.cornerRadius,min:0,max:50,formatValue:O=>`${O}%`,onChange:O=>a({cornerRadius:O})}),l.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>a({deviceScale:fe.deviceScale,deviceTop:fe.deviceTop,deviceRotation:0,deviceOffsetX:0,deviceAngle:fe.deviceAngle,deviceTilt:0,cornerRadius:0}),children:"Reset Device Position"})]})]}),l.jsxs(Oe,{title:"Device Shadow",tooltip:"Add a custom drop shadow behind the device frame.",defaultCollapsed:!0,children:[l.jsx(bt,{label:"Custom Shadow",checked:!!o.deviceShadow,onChange:O=>a({deviceShadow:O?{opacity:.25,blur:20,color:"#000000",offsetY:10}:null})}),l.jsxs("div",{className:o.deviceShadow?"":"opacity-40 pointer-events-none",children:[l.jsx(K,{label:"Opacity",value:o.deviceShadow?Math.round(o.deviceShadow.opacity*100):25,min:0,max:100,formatValue:O=>`${O}%`,onChange:O=>a({deviceShadow:{...o.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},opacity:O/100}})}),l.jsx(K,{label:"Blur",value:((H=o.deviceShadow)==null?void 0:H.blur)??20,min:0,max:50,formatValue:O=>`${O}px`,onChange:O=>a({deviceShadow:{...o.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},blur:O}})}),l.jsx(qe,{label:"Color",value:((ce=o.deviceShadow)==null?void 0:ce.color)??"#000000",onChange:O=>a({deviceShadow:{...o.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},color:O}})}),l.jsx(K,{label:"Y Offset",value:((Pe=o.deviceShadow)==null?void 0:Pe.offsetY)??10,min:0,max:30,formatValue:O=>`${O}px`,onChange:O=>a({deviceShadow:{...o.deviceShadow??{opacity:.25,blur:20,color:"#000000",offsetY:10},offsetY:O}})})]})]}),l.jsx(Oe,{title:"Composition",tooltip:"Choose how devices are arranged. Use multi-device layouts to show multiple app screens in one image.",defaultCollapsed:!0,children:l.jsx(Ge,{label:"Device Arrangement",value:o.composition,onChange:O=>{const je=O,M=Hp[je];if(M&&M.deviceCount===1){const z=M.slots[0];a({composition:je,deviceOffsetX:z.offsetX,deviceTop:z.offsetY,deviceScale:z.scale,deviceRotation:z.rotation,deviceAngle:z.angle,deviceTilt:z.tilt})}else a({composition:je})},options:Xp,groups:Qp})})]})}const eh={"sans-serif":"Sans Serif",serif:"Serif",display:"Display"},th=["sans-serif","serif","display"];function wf(o){const a={};for(const i of o){const u=i.category??"sans-serif",d=a[u]??[];d.push({value:i.id,label:i.name}),a[u]=d}return th.filter(i=>{var u;return(u=a[i])==null?void 0:u.length}).map(i=>({label:eh[i]??i,options:a[i]}))}const Xd=[{value:"",label:"Auto"},{value:"none",label:"None"},{value:"uppercase",label:"Uppercase"},{value:"lowercase",label:"Lowercase"},{value:"capitalize",label:"Capitalize"}],nh=[{value:"",label:"Auto"},{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}];function oh(){const{screen:o,update:a}=pa(),i=W(p=>p.fonts),{patchText:u}=fc(),d=C.useCallback((p,$)=>u({[p]:$}),[u]),f=C.useMemo(()=>wf(i),[i]),h=C.useId(),y=C.useId();return o?l.jsxs(l.Fragment,{children:[l.jsxs(Oe,{title:"Text",tooltip:"Edit the headline and subtitle text that appears above or below the device frame.",defaultCollapsed:!1,children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{htmlFor:h,className:"block text-xs text-text-dim mb-1",children:"Headline"}),l.jsx("textarea",{id:h,rows:2,value:o.headline,onChange:p=>a({headline:p.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{htmlFor:y,className:"block text-xs text-text-dim mb-1",children:"Subtitle"}),l.jsx("input",{id:y,type:"text",value:o.subtitle,onChange:p=>a({subtitle:p.target.value}),placeholder:"Optional subtitle",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent"})]}),l.jsx(qe,{label:"Headline Color",value:o.colors.text,onChange:p=>a({colors:{...o.colors,text:p}})}),l.jsx(qe,{label:"Subtitle Color",value:o.colors.subtitle,onChange:p=>a({colors:{...o.colors,subtitle:p}})})]}),l.jsxs(Oe,{title:"Typography",tooltip:"Control font family, weight, size, rotation, spacing, and text transformations.",children:[l.jsx(Ge,{label:"Font",value:o.font,onChange:p=>a({font:p}),groups:f}),l.jsx(K,{label:"Font Weight",value:o.fontWeight,min:400,max:800,step:100,formatValue:p=>String(p),onChange:p=>a({fontWeight:p})}),l.jsx(K,{label:"Headline Size",value:o.headlineSize,min:0,max:200,formatValue:p=>p===0?"Auto":`${p}px`,onChange:p=>a({headlineSize:p}),onInstant:p=>d("headlineSize",p),disabled:o.autoSizeHeadline}),l.jsx(K,{label:"Subtitle Size",value:o.subtitleSize,min:0,max:120,formatValue:p=>p===0?"Auto":`${p}px`,onChange:p=>a({subtitleSize:p}),onInstant:p=>d("subtitleSize",p),disabled:o.autoSizeSubtitle}),l.jsx(bt,{label:"Auto-size Headline",checked:o.autoSizeHeadline,onChange:p=>a({autoSizeHeadline:p})}),l.jsx(bt,{label:"Auto-size Subtitle",checked:o.autoSizeSubtitle,onChange:p=>a({autoSizeSubtitle:p})}),l.jsx(K,{label:"Headline Rotation",value:o.headlineRotation,min:-30,max:30,formatValue:p=>`${p}°`,onChange:p=>a({headlineRotation:p}),onInstant:p=>d("headlineRotation",p)}),l.jsx(K,{label:"Subtitle Rotation",value:o.subtitleRotation,min:-30,max:30,formatValue:p=>`${p}°`,onChange:p=>a({subtitleRotation:p}),onInstant:p=>d("subtitleRotation",p)}),l.jsx(K,{label:"Headline Line Height",value:o.headlineLineHeight,min:80,max:180,formatValue:p=>p===0?"Auto":(p/100).toFixed(2),onChange:p=>a({headlineLineHeight:p})}),l.jsx(K,{label:"Headline Letter Spacing",value:o.headlineLetterSpacing,min:-5,max:10,formatValue:p=>p===0?"Auto":`${p/100}em`,onChange:p=>a({headlineLetterSpacing:p})}),l.jsxs("div",{className:"flex gap-2 mb-2",children:[l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Headline Case",value:o.headlineTextTransform,onChange:p=>a({headlineTextTransform:p}),options:Xd})}),l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Headline Style",value:o.headlineFontStyle,onChange:p=>a({headlineFontStyle:p}),options:nh})})]}),l.jsx(K,{label:"Subtitle Opacity",value:o.subtitleOpacity,min:0,max:100,formatValue:p=>p===0?"Auto":`${p}%`,onChange:p=>a({subtitleOpacity:p})}),l.jsx(K,{label:"Subtitle Letter Spacing",value:o.subtitleLetterSpacing,min:-5,max:10,formatValue:p=>p===0?"Auto":`${p/100}em`,onChange:p=>a({subtitleLetterSpacing:p})}),l.jsx(Ge,{label:"Subtitle Case",value:o.subtitleTextTransform,onChange:p=>a({subtitleTextTransform:p}),options:Xd})]}),l.jsxs(Oe,{title:"Text Position",tooltip:"Drag text elements in the preview to reposition, or reset to default positions.",children:[l.jsx("span",{className:"text-[11px] text-text-dim leading-tight block mb-1.5",children:"Drag the headline or subtitle in the preview to reposition them."}),l.jsx("button",{className:"w-full py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>a({textPositions:{headline:null,subtitle:null}}),children:"Reset to Default"})]}),l.jsxs(Oe,{title:"Text Gradient",tooltip:"Apply a gradient color effect to headline or subtitle text.",defaultCollapsed:!0,children:[l.jsx(bt,{label:"Enable Headline Gradient",checked:!!o.headlineGradient,onChange:p=>a({headlineGradient:p?{colors:["#6366f1","#ec4899"],direction:90}:null})}),o.headlineGradient&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Start",value:o.headlineGradient.colors[0]??"#6366f1",onChange:p=>a({headlineGradient:{...o.headlineGradient,colors:[p,o.headlineGradient.colors[1]??"#ec4899"]}})}),l.jsx(qe,{label:"End",value:o.headlineGradient.colors[1]??"#ec4899",onChange:p=>a({headlineGradient:{...o.headlineGradient,colors:[o.headlineGradient.colors[0]??"#6366f1",p]}})}),l.jsx(K,{label:"Direction",value:o.headlineGradient.direction,min:0,max:360,formatValue:p=>`${p}°`,onChange:p=>a({headlineGradient:{...o.headlineGradient,direction:p}})})]}),l.jsx("div",{className:"mt-2.5",children:l.jsx(bt,{label:"Enable Subtitle Gradient",checked:!!o.subtitleGradient,onChange:p=>a({subtitleGradient:p?{colors:["#6366f1","#ec4899"],direction:90}:null})})}),o.subtitleGradient&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Start",value:o.subtitleGradient.colors[0]??"#6366f1",onChange:p=>a({subtitleGradient:{...o.subtitleGradient,colors:[p,o.subtitleGradient.colors[1]??"#ec4899"]}})}),l.jsx(qe,{label:"End",value:o.subtitleGradient.colors[1]??"#ec4899",onChange:p=>a({subtitleGradient:{...o.subtitleGradient,colors:[o.subtitleGradient.colors[0]??"#6366f1",p]}})}),l.jsx(K,{label:"Direction",value:o.subtitleGradient.direction,min:0,max:360,formatValue:p=>`${p}°`,onChange:p=>a({subtitleGradient:{...o.subtitleGradient,direction:p}})})]})]})]}):null}function Yl({title:o,onRemove:a,children:i,defaultCollapsed:u=!1}){const[d,f]=C.useState(u),h=C.useRef(null),[y,p]=C.useState(void 0);return C.useEffect(()=>{h.current&&p(h.current.scrollHeight)},[i,d]),l.jsxs("div",{className:"border border-border rounded-md p-2 mb-1.5 text-[11px]",children:[l.jsxs("div",{className:"flex justify-between items-center mb-1.5",children:[l.jsxs("button",{className:"flex items-center gap-1 font-semibold text-text-dim hover:text-text transition-colors cursor-pointer bg-transparent border-none p-0 text-[11px]",onClick:()=>f(!d),"aria-expanded":!d,"aria-label":`${d?"Expand":"Collapse"} ${o}`,children:[l.jsx("span",{className:"inline-block transition-transform duration-150 text-[8px]",style:{transform:d?"rotate(-90deg)":"rotate(0deg)"},"aria-hidden":"true",children:"▼"}),o]}),l.jsx("button",{className:"text-text-dim hover:text-red-400 text-sm leading-none px-1 transition-colors",onClick:a,"aria-label":`Remove ${o}`,title:`Remove ${o}`,children:"×"})]}),l.jsx("div",{ref:h,className:"overflow-hidden transition-all duration-150 ease-in-out",style:{maxHeight:d?0:y??"none",opacity:d?0:1},"aria-hidden":d,children:i})]})}function rh({open:o,title:a,message:i,confirmLabel:u="Delete",cancelLabel:d="Cancel",destructive:f=!0,onConfirm:h,onCancel:y}){const p=C.useRef(null),$=C.useRef(null),x=C.useCallback(L=>{var g;if(L.key==="Escape"&&y(),L.key==="Tab"){const S=(g=p.current)==null?void 0:g.querySelectorAll("button");if(!S||S.length===0)return;const N=S[0],_=S[S.length-1];L.shiftKey&&document.activeElement===N?(L.preventDefault(),_.focus()):!L.shiftKey&&document.activeElement===_&&(L.preventDefault(),N.focus())}},[y]);return C.useEffect(()=>{var L;if(o)return(L=$.current)==null||L.focus(),document.addEventListener("keydown",x),()=>document.removeEventListener("keydown",x)},[o,x]),o?l.jsx("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center bg-black/50",onClick:y,"aria-hidden":"true",children:l.jsxs("div",{ref:p,role:"alertdialog","aria-modal":"true","aria-label":a,"aria-describedby":"confirm-dialog-message",className:"bg-surface border border-border rounded-lg shadow-xl p-5 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95",onClick:L=>L.stopPropagation(),children:[l.jsx("h3",{className:"text-sm font-semibold text-text mb-2",children:a}),l.jsx("p",{id:"confirm-dialog-message",className:"text-xs text-text-dim mb-4 leading-relaxed",children:i}),l.jsxs("div",{className:"flex gap-2 justify-end",children:[l.jsx("button",{ref:$,className:"px-3 py-1.5 text-[11px] font-medium bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-text-dim transition-colors",onClick:y,children:d}),l.jsx("button",{className:`px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${f?"bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30":"bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30"}`,onClick:h,children:u})]})]})}):null}function Ul(){const[o,a]=C.useState({open:!1,options:{title:"",message:""},resolve:null}),i=C.useCallback(h=>new Promise(y=>{a({open:!0,options:h,resolve:y})}),[]),u=C.useCallback(()=>{var h;(h=o.resolve)==null||h.call(o,!0),a(y=>({...y,open:!1,resolve:null}))},[o.resolve]),d=C.useCallback(()=>{var h;(h=o.resolve)==null||h.call(o,!1),a(y=>({...y,open:!1,resolve:null}))},[o.resolve]),f=l.jsx(rh,{open:o.open,title:o.options.title,message:o.options.message,confirmLabel:o.options.confirmLabel,destructive:o.options.destructive,onConfirm:u,onCancel:d});return{confirm:i,dialog:f}}function Ki(o){return`${o}-${crypto.randomUUID().slice(0,8)}`}function lh(){const{screen:o,update:a}=pa(),{confirm:i,dialog:u}=Ul();if(!o)return null;const d=(S,N)=>{const _=o.annotations.map((k,b)=>b===S?{...k,...N}:k);a({annotations:_})},f=async S=>{await i({title:"Remove Annotation",message:`Remove Annotation ${S+1}? This cannot be undone.`})&&a({annotations:o.annotations.filter((_,k)=>k!==S)})},h=()=>{a({annotations:[...o.annotations,{id:Ki("ann"),shape:"rounded-rect",x:40,y:40,w:20,h:20,strokeColor:"#FF3B30",strokeWidth:4}]})},y=(S,N)=>{const _=o.callouts.map((k,b)=>b===S?{...k,...N}:k);a({callouts:_})},p=async S=>{await i({title:"Remove Callout",message:`Remove Callout ${S+1}? This cannot be undone.`})&&a({callouts:o.callouts.filter((_,k)=>k!==S)})},$=()=>{a({callouts:[...o.callouts,{id:Ki("callout"),sourceX:30,sourceY:40,sourceW:40,sourceH:20,displayX:60,displayY:10,displayScale:1,rotation:0,borderRadius:8,shadow:!0,borderWidth:0,borderColor:"#ffffff"}]})},x=(S,N)=>{const _=o.overlays.map((k,b)=>b===S?{...k,...N}:k);a({overlays:_})},L=async S=>{await i({title:"Remove Overlay",message:`Remove Overlay ${S+1}? This cannot be undone.`})&&a({overlays:o.overlays.filter((_,k)=>k!==S)})},g=()=>{a({overlays:[...o.overlays,{id:Ki("overlay"),type:"shape",x:10,y:10,size:10,rotation:0,opacity:1,shapeType:"circle",shapeColor:"#6366f1",shapeOpacity:.5,shapeBlur:10}]})};return l.jsxs(l.Fragment,{children:[u,l.jsxs(Oe,{title:"Spotlight / Dimming",tooltip:"Dim the background and highlight a specific area of your screenshot to draw attention.",defaultCollapsed:!1,children:[!o.spotlight&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Dim the screenshot background and highlight a specific region to guide the viewer's eye."}),l.jsx(bt,{label:"Enable Spotlight",checked:!!o.spotlight,onChange:S=>a({spotlight:S?{x:50,y:50,w:30,h:30,shape:"rectangle",dimOpacity:.6,blur:0}:null})}),o.spotlight&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:o.spotlight.shape,onChange:S=>a({spotlight:{...o.spotlight,shape:S}}),options:[{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(K,{label:"Position X",value:o.spotlight.x,min:0,max:100,formatValue:S=>`${S}%`,onChange:S=>a({spotlight:{...o.spotlight,x:S}})}),l.jsx(K,{label:"Position Y",value:o.spotlight.y,min:0,max:100,formatValue:S=>`${S}%`,onChange:S=>a({spotlight:{...o.spotlight,y:S}})}),l.jsx(K,{label:"Width",value:o.spotlight.w,min:5,max:100,formatValue:S=>`${S}%`,onChange:S=>a({spotlight:{...o.spotlight,w:S}})}),l.jsx(K,{label:"Height",value:o.spotlight.h,min:5,max:100,formatValue:S=>`${S}%`,onChange:S=>a({spotlight:{...o.spotlight,h:S}})}),l.jsx(K,{label:"Dim Opacity",value:Math.round(o.spotlight.dimOpacity*100),min:0,max:100,formatValue:S=>`${S}%`,onChange:S=>a({spotlight:{...o.spotlight,dimOpacity:S/100}})}),l.jsx(K,{label:"Background Blur",value:o.spotlight.blur,min:0,max:30,formatValue:S=>`${S}px`,onChange:S=>a({spotlight:{...o.spotlight,blur:S}})})]})]}),l.jsxs(Oe,{title:"Annotations",tooltip:"Draw shapes (rectangles, circles) over the screenshot to highlight specific UI elements.",children:[o.annotations.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Highlight areas of your screenshot with rectangles or circles. Great for drawing attention to specific features."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:h,children:"+ Add Annotation"}),o.annotations.map((S,N)=>l.jsxs(Yl,{title:`Annotation ${N+1}`,onRemove:()=>f(N),children:[l.jsx(Ge,{label:"Shape",value:S.shape,onChange:_=>d(N,{shape:_}),options:[{value:"rounded-rect",label:"Rounded Rect"},{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(qe,{label:"Color",value:S.strokeColor,onChange:_=>d(N,{strokeColor:_})}),l.jsx(K,{label:"X",value:S.x,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>d(N,{x:_})}),l.jsx(K,{label:"Y",value:S.y,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>d(N,{y:_})}),l.jsx(K,{label:"Width",value:S.w,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>d(N,{w:_})}),l.jsx(K,{label:"Height",value:S.h,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>d(N,{h:_})}),l.jsx(K,{label:"Stroke",value:S.strokeWidth,min:1,max:20,formatValue:_=>`${_}px`,onChange:_=>d(N,{strokeWidth:_})})]},S.id))]}),l.jsxs(Oe,{title:"Loupe / Magnification",tooltip:"Magnify a region of the screenshot and display it enlarged elsewhere on the frame.",children:[l.jsx(bt,{label:"Loupe",checked:!!o.loupe,onChange:S=>a({loupe:S?{width:.5,height:.33,sourceX:0,sourceY:0,scale:1.1,cornerRadius:0,borderWidth:0,borderColor:"#ffffff",shadow:!0,shadowColor:"#000000",shadowRadius:30,shadowOffsetX:0,shadowOffsetY:0,xOffset:0,yOffset:0}:null})}),(()=>{const S={width:.5,height:.33,sourceX:0,sourceY:0,scale:1.1,cornerRadius:0,borderWidth:0,borderColor:"#ffffff",shadow:!0,shadowColor:"#000000",shadowRadius:30,shadowOffsetX:0,shadowOffsetY:0,xOffset:0,yOffset:0},N=o.loupe??S,_=k=>a({loupe:{...N,...k}});return l.jsxs("div",{className:o.loupe?"":"opacity-40 pointer-events-none",children:[l.jsx(K,{label:"Width",value:N.width,min:.05,max:1,step:.01,formatValue:k=>k.toFixed(2),onChange:k=>_({width:k})}),l.jsx(K,{label:"Height",value:N.height,min:.05,max:1,step:.01,formatValue:k=>k.toFixed(2),onChange:k=>_({height:k})}),l.jsx(K,{label:"Source X",value:N.sourceX,min:-1,max:1,step:.01,formatValue:k=>k.toFixed(2),onChange:k=>_({sourceX:k})}),l.jsx(K,{label:"Source Y",value:N.sourceY,min:-1,max:1,step:.01,formatValue:k=>k.toFixed(2),onChange:k=>_({sourceY:k})}),l.jsx(K,{label:"Corner Radius",value:N.cornerRadius??0,min:0,max:100,formatValue:k=>`${k}`,onChange:k=>_({cornerRadius:k})}),l.jsx(bt,{label:"Border",checked:(N.borderWidth??0)>0,onChange:k=>_({borderWidth:k?3:0})}),(N.borderWidth??0)>0&&l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Border Width",value:N.borderWidth,min:1,max:10,formatValue:k=>`${k}px`,onChange:k=>_({borderWidth:k})}),l.jsx(qe,{label:"Border Color",value:N.borderColor,onChange:k=>_({borderColor:k})})]}),l.jsx(bt,{label:"Shadow",checked:!!N.shadow,onChange:k=>_({shadow:k})}),N.shadow&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Shadow Color",value:N.shadowColor??"#000000",onChange:k=>_({shadowColor:k})}),l.jsx(K,{label:"Shadow Radius",value:N.shadowRadius??30,min:0,max:100,formatValue:k=>`${k}`,onChange:k=>_({shadowRadius:k})}),l.jsx(K,{label:"Shadow X Offset",value:N.shadowOffsetX??0,min:-50,max:50,formatValue:k=>`${k}`,onChange:k=>_({shadowOffsetX:k})}),l.jsx(K,{label:"Shadow Y Offset",value:N.shadowOffsetY??0,min:-50,max:50,formatValue:k=>`${k}`,onChange:k=>_({shadowOffsetY:k})})]}),l.jsx(K,{label:"Scale",value:N.scale??1.1,min:1,max:3,step:.01,formatValue:k=>`${k.toFixed(2)}x`,onChange:k=>_({scale:k})}),l.jsx(K,{label:"X Offset",value:N.xOffset??0,min:-100,max:100,formatValue:k=>`${k}`,onChange:k=>_({xOffset:k})}),l.jsx(K,{label:"Y Offset",value:N.yOffset??0,min:-100,max:100,formatValue:k=>`${k}`,onChange:k=>_({yOffset:k})})]})})()]}),l.jsxs(Oe,{title:"Callouts",tooltip:"Crop and enlarge a portion of the screenshot, displayed as a floating callout card.",children:[o.callouts.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Zoom into a specific area and display it as a floating card. Perfect for showcasing small UI details."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:$,children:"+ Add Callout"}),o.callouts.map((S,N)=>l.jsxs(Yl,{title:`Callout ${N+1}`,onRemove:()=>p(N),children:[l.jsx(K,{label:"Source X",value:S.sourceX,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(N,{sourceX:_})}),l.jsx(K,{label:"Source Y",value:S.sourceY,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(N,{sourceY:_})}),l.jsx(K,{label:"Source W",value:S.sourceW,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>y(N,{sourceW:_})}),l.jsx(K,{label:"Source H",value:S.sourceH,min:1,max:100,formatValue:_=>`${_}%`,onChange:_=>y(N,{sourceH:_})}),l.jsx(K,{label:"Display X",value:S.displayX,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(N,{displayX:_})}),l.jsx(K,{label:"Display Y",value:S.displayY,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>y(N,{displayY:_})}),l.jsx(K,{label:"Scale",value:Math.round(S.displayScale*100),min:50,max:300,step:10,formatValue:_=>`${(_/100).toFixed(1)}x`,onChange:_=>y(N,{displayScale:_/100})}),l.jsx(K,{label:"Rotation",value:S.rotation,min:-45,max:45,formatValue:_=>`${_}°`,onChange:_=>y(N,{rotation:_})}),l.jsx(K,{label:"Radius",value:S.borderRadius,min:0,max:30,formatValue:_=>`${_}px`,onChange:_=>y(N,{borderRadius:_})})]},S.id))]}),l.jsxs(Oe,{title:"Overlays",tooltip:"Add decorative shapes, stars, icons, or badges floating over the screenshot.",children:[o.overlays.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Add floating shapes, star ratings, icons, or badges over your screenshot for extra visual appeal."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:g,children:"+ Add Overlay"}),o.overlays.map((S,N)=>l.jsxs(Yl,{title:`Overlay ${N+1}`,onRemove:()=>L(N),children:[l.jsx(Ge,{label:"Type",value:S.type,onChange:_=>x(N,{type:_}),options:[{value:"shape",label:"Shape"},{value:"star-rating",label:"Star Rating"},{value:"icon",label:"Icon"},{value:"badge",label:"Badge"},{value:"custom",label:"Custom"}]}),l.jsx(K,{label:"X",value:S.x,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>x(N,{x:_})}),l.jsx(K,{label:"Y",value:S.y,min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>x(N,{y:_})}),l.jsx(K,{label:"Size",value:S.size,min:1,max:50,formatValue:_=>`${_}%`,onChange:_=>x(N,{size:_})}),l.jsx(K,{label:"Rotation",value:S.rotation,min:-180,max:180,formatValue:_=>`${_}°`,onChange:_=>x(N,{rotation:_})}),l.jsx(K,{label:"Opacity",value:Math.round(S.opacity*100),min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>x(N,{opacity:_/100})}),S.type==="shape"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:S.shapeType??"circle",onChange:_=>x(N,{shapeType:_}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"}]}),l.jsx(qe,{label:"Color",value:S.shapeColor??"#6366f1",onChange:_=>x(N,{shapeColor:_})}),l.jsx(K,{label:"Shape Opacity",value:Math.round((S.shapeOpacity??.5)*100),min:0,max:100,formatValue:_=>`${_}%`,onChange:_=>x(N,{shapeOpacity:_/100})}),l.jsx(K,{label:"Blur",value:S.shapeBlur??0,min:0,max:50,formatValue:_=>`${_}px`,onChange:_=>x(N,{shapeBlur:_})})]})]},S.id))]})]})}function kf(o,a,i,u,d){var h,y,p,$,x,L;const f=u!=="default";return{screenIndex:o.screenIndex,screenshotDataUrl:o.screenshotDataUrl||void 0,locale:f?u:void 0,preferLocaleText:f||void 0,localeConfig:f?d:void 0,style:o.style,layout:o.layout,headline:o.headline,subtitle:o.subtitle,colors:o.colors,font:o.font,fontWeight:o.fontWeight,headlineSize:o.headlineSize||void 0,subtitleSize:o.subtitleSize||void 0,headlineRotation:o.headlineRotation||void 0,subtitleRotation:o.subtitleRotation||void 0,frameId:o.frameId,deviceColor:o.deviceColor||void 0,frameStyle:o.frameStyle,deviceScale:o.deviceScale,deviceTop:o.deviceTop,deviceRotation:o.deviceRotation,deviceOffsetX:o.deviceOffsetX,deviceAngle:o.deviceAngle,deviceTilt:o.deviceTilt,headlineTop:(h=o.textPositions.headline)==null?void 0:h.y,headlineLeft:(y=o.textPositions.headline)==null?void 0:y.x,headlineWidth:(p=o.textPositions.headline)==null?void 0:p.width,subtitleTop:($=o.textPositions.subtitle)==null?void 0:$.y,subtitleLeft:(x=o.textPositions.subtitle)==null?void 0:x.x,subtitleWidth:(L=o.textPositions.subtitle)==null?void 0:L.width,composition:o.composition||"single",headlineGradient:o.headlineGradient||void 0,subtitleGradient:o.subtitleGradient||void 0,autoSizeHeadline:o.autoSizeHeadline||void 0,autoSizeSubtitle:o.autoSizeSubtitle||void 0,spotlight:o.spotlight||void 0,annotations:o.annotations.length>0?o.annotations:void 0,backgroundType:o.backgroundType!=="preset"?o.backgroundType:void 0,backgroundColor:o.backgroundType==="solid"?o.backgroundColor:void 0,backgroundGradient:o.backgroundType==="gradient"?o.backgroundGradient:void 0,backgroundImageDataUrl:o.backgroundType==="image"?o.backgroundImageDataUrl:void 0,backgroundOverlay:o.backgroundType==="image"&&o.backgroundOverlay?o.backgroundOverlay:void 0,deviceShadow:o.deviceShadow||void 0,borderSimulation:o.borderSimulation||void 0,cornerRadius:o.cornerRadius||void 0,loupe:o.loupe||void 0,callouts:o.callouts.length>0?o.callouts:void 0,overlays:o.overlays.length>0?o.overlays:void 0,headlineLineHeight:o.headlineLineHeight?o.headlineLineHeight/100:void 0,headlineLetterSpacing:o.headlineLetterSpacing?`${o.headlineLetterSpacing/100}em`:void 0,headlineTextTransform:o.headlineTextTransform||void 0,headlineFontStyle:o.headlineFontStyle||void 0,subtitleOpacity:o.subtitleOpacity?o.subtitleOpacity/100:void 0,subtitleLetterSpacing:o.subtitleLetterSpacing?`${o.subtitleLetterSpacing/100}em`:void 0,subtitleTextTransform:o.subtitleTextTransform||void 0,width:a,height:i}}function sh(o,a,i,u,d,f,h){return kf(o,i,u,d,f)}function ah(o,a){return{...kf(o,a.previewW,a.previewH,a.locale,a.localeConfig),sizeKey:a.sizeKey,renderer:a.renderer}}const ih=["en","es","fr","de","it","pt","pt-BR","nl","sv","no","da","fi","pl","cs","tr","ro","hu","uk","ru","el","he","ar","hi","th","vi","id","ms","ja","ko","zh-Hans","zh-Hant"];function ch(o){return o==="default"?o:o.replace(/_/g,"-")}function uh(o,a={}){const i=o!=null&&o.locales?Object.keys(o.locales):[],u=Object.keys(a);return["default",...new Set([...i,...u,...ih])]}function Ml(o){if(o==="default")return"Default";const a=ch(o);try{const u=new Intl.DisplayNames(void 0,{type:"language"}).of(a);if(u)return`${u} (${o})`}catch{}return o}function dh({message:o,onDone:a}){return C.useEffect(()=>{const i=setTimeout(a,3e3);return()=>clearTimeout(i)},[a]),l.jsx("div",{role:"alert","aria-live":"polite",className:"fixed top-4 right-4 z-50 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-in fade-in",children:o})}function ea(o,a){const i=URL.createObjectURL(o),u=document.createElement("a");u.href=i,u.download=a,u.style.display="none",document.body.appendChild(u),requestAnimationFrame(()=>{u.click()}),window.setTimeout(()=>{URL.revokeObjectURL(i),u.remove()},6e4)}function fh(o){return o.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"variant"}function Qd(){const o=W(J=>J.platform),a=W(J=>J.sizes),i=W(J=>J.exportSize),u=W(J=>J.setExportSize),d=W(J=>J.exportRenderer),f=W(J=>J.setExportRenderer),h=W(J=>J.koubouAvailable),y=W(J=>J.locale),p=W(J=>J.sessionLocales),$=W(J=>J.setLocale),x=W(J=>J.upsertLocaleConfig),L=W(J=>J.previewBg),g=W(J=>J.setPreviewBg),S=W(J=>J.config),N=W(J=>J.variants),_=W(J=>J.activeVariantId),k=W(J=>J.recordVariantArtifact),b=W(J=>J.initScreens),Z=W(J=>J.triggerRender),U=W(J=>J.screens),le=W(J=>J.isPanoramic),ne=W(J=>J.panoramicFrameCount),ie=W(J=>J.panoramicBackground),he=W(J=>J.panoramicElements),re=W(J=>J.panoramicEffects),G=W(J=>J.previewW),w=W(J=>J.previewH),[ke,fe]=C.useState(!1),[H,ce]=C.useState("Ready"),[Pe,O]=C.useState(null),je=C.useCallback(()=>O(null),[]),z=(a[o]??[]).map(J=>({value:J.key,label:`${J.name} (${J.width}×${J.height})`})),V=i||ha(a,o)||"";C.useEffect(()=>{!i&&V&&u(V)},[i,V,u]);const I=!h||o==="android",D=[{value:"playwright",label:"Playwright (fast)"},{value:"koubou",label:"Koubou (pixel-perfect)",disabled:I,title:I?h?"Koubou is not available for Android":"Koubou server not running":void 0}],de=y==="default"?void 0:p[y],pe=uh(S,p),se=N.find(J=>J.id===_)??null,Ee=fh((se==null?void 0:se.name)??"variant"),Be=pe.map(J=>({value:J,label:Ml(J)})),We=C.useCallback(async J=>{if(J==="default"||p[J]){$(J),ce(J==="default"?"Using current working copy":`Using ${Ml(J)}`);return}ce(`Generating ${Ml(J)} for this session...`);try{const mt=await $p(J,{screens:U.map(ot=>({headline:ot.headline,subtitle:ot.subtitle||null})),panoramicElements:he});x(mt.locale,mt.localeConfig),$(mt.locale),ce(`Added ${Ml(mt.locale)} to this session`),O(`Added ${Ml(mt.locale)}`)}catch(mt){ce(mt instanceof Error?mt.message:"Automatic translation failed")}},[he,U,p,$,x]),Ue=J=>({locale:y,localeConfig:de,frameCount:ne,frameWidth:G,frameHeight:w,background:ie,elements:he,effects:re,font:S==null?void 0:S.theme.font,fontWeight:S==null?void 0:S.theme.fontWeight,frameStyle:S==null?void 0:S.frames.style,sizeKey:V,frameIndex:J}),nt=async()=>{fe(!0);let J=0;const mt=[];for(let ot=0;ot<ne;ot++){ce(`Downloading frame ${ot+1} of ${ne}...`);try{const jt=await Rp(Ue(ot)),Qt=`${Ee}-frame-${ot+1}.png`;ea(jt,Qt),mt.push(Qt),J++}catch(jt){ce(`Error on frame ${ot+1}: ${jt instanceof Error?jt.message:"Unknown"}`)}}if(J>0){const ot=`${Ee}-manifest.json`,jt={variantId:(se==null?void 0:se.id)??null,variantName:(se==null?void 0:se.name)??"Variant",status:(se==null?void 0:se.status)??"draft",mode:"panoramic",locale:y,sizeKey:V,renderer:"playwright",fileNames:mt,exportedAt:new Date().toISOString()};ea(new Blob([JSON.stringify(jt,null,2)],{type:"application/json"}),ot),k({kind:"frames",locale:y,mode:"panoramic",sizeKey:V,renderer:"playwright",fileNames:mt,manifestName:ot})}fe(!1),ce(`Downloaded ${J} of ${ne} frames`),O(`Downloaded ${J} frames`)},wt=async()=>{if(U.length===0)return;fe(!0);let J=0;const mt=[];for(let ot=0;ot<U.length;ot++){const jt=U[ot];if(jt){ce(`Downloading screen ${ot+1} of ${U.length}...`);try{const Qt=await Tp(ah(jt,{previewW:G,previewH:w,locale:y,localeConfig:de,sizeKey:V,renderer:d})),ze=`${Ee}-screen-${ot+1}.png`;ea(Qt,ze),mt.push(ze),J++}catch(Qt){ce(`Error on screen ${ot+1}: ${Qt instanceof Error?Qt.message:"Unknown"}`)}}}if(J>0){const ot=`${Ee}-manifest.json`,jt={variantId:(se==null?void 0:se.id)??null,variantName:(se==null?void 0:se.name)??"Variant",status:(se==null?void 0:se.status)??"draft",mode:"individual",locale:y,sizeKey:V,renderer:d,fileNames:mt,exportedAt:new Date().toISOString()};ea(new Blob([JSON.stringify(jt,null,2)],{type:"application/json"}),ot),k({kind:"screens",locale:y,mode:"individual",sizeKey:V,renderer:d,fileNames:mt,manifestName:ot})}fe(!1),ce(`Downloaded ${J} of ${U.length} screens`),O(`Downloaded ${J} screenshots`)},Ro=async()=>{try{const J=await Sp();b(J,o),Z(),ce("Project reloaded from disk")}catch(J){ce(`Reload failed: ${J instanceof Error?J.message:"Unknown error"}`)}};return!le&&U.length===0?l.jsx(Oe,{title:"Download",tooltip:"Choose output size and renderer, then download your screenshots.",defaultCollapsed:!1,children:l.jsxs("p",{className:"text-xs text-text-dim text-center py-4",children:["No screens to download."," ",l.jsx("button",{className:"text-accent hover:text-accent-hover underline",onClick:()=>W.getState().setActiveTab("background"),children:"Go to Background tab"})," ","to get started."]})}):l.jsxs(l.Fragment,{children:[Pe&&l.jsx(dh,{message:Pe,onDone:je}),l.jsxs(Oe,{title:"Download",tooltip:"Choose output size and renderer, then download your screenshots.",defaultCollapsed:!1,children:[se&&l.jsxs("div",{className:"text-[10px] text-text-dim mb-2",children:["Exporting ",l.jsx("span",{className:"text-text",children:se.name})," (",se.status,")"]}),l.jsx(Ge,{label:"Output Size",value:V,onChange:u,options:z}),!le&&h&&l.jsx(Ge,{label:"Renderer",value:d,onChange:f,options:D}),le?l.jsx("button",{className:"w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1",onClick:nt,disabled:ke,children:ke?"Downloading...":`Download all ${ne} frames`}):l.jsx(l.Fragment,{children:l.jsx("button",{className:"w-full py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-50 mt-1",onClick:wt,disabled:ke,children:ke?"Downloading...":`Download all ${U.length} screens`})})]}),pe.length>1&&l.jsx(Oe,{title:"Locale",tooltip:"Select the language for localized previews and exports. Session translations are used immediately, and imported project locales remain available.",children:l.jsx(Ge,{label:"Language",value:y,onChange:We,options:Be})}),l.jsx(Oe,{title:"Preview Background",tooltip:"Change the editor background color. This does not affect exported images.",children:l.jsx("div",{className:"flex gap-3",children:["dark","light"].map(J=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:L===J,onChange:()=>g(J),className:"accent-accent"}),J.charAt(0).toUpperCase()+J.slice(1)]},J))})}),l.jsxs(Oe,{title:"Actions",tooltip:"Refresh previews or reload the project from disk. Reloading resets unsaved session-only locale changes.",children:[l.jsxs("div",{className:"flex gap-2",children:[l.jsx("button",{className:"flex-1 py-2 text-xs bg-accent hover:bg-accent-hover text-white rounded-md",onClick:Z,children:"Refresh All"}),l.jsx("button",{className:"flex-1 py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:Ro,children:"Reload Project"})]}),l.jsx("div",{className:`text-[10px] mt-2 ${H.startsWith("Download error")||H.startsWith("Reload failed")||H.startsWith("Error")?"text-red-400":H.startsWith("Downloaded")||H==="Project reloaded from disk"?"text-green-400":"text-text-dim"}`,children:H})]})]})}function Gd(o){try{return new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(o))}catch{return o}}function Kd(){const o=W(g=>g.variants),a=W(g=>g.activeVariantId),i=W(g=>g.createVariant),u=W(g=>g.duplicateActiveVariant),d=W(g=>g.createVariantSet),f=W(g=>g.selectVariant),h=W(g=>g.renameVariant),y=W(g=>g.deleteVariant),p=W(g=>g.setVariantStatus),{confirm:$,dialog:x}=Ul(),L=C.useMemo(()=>o.filter(g=>g.status==="approved").length,[o]);return l.jsxs(l.Fragment,{children:[x,l.jsxs(Oe,{title:"Variants",tooltip:"Create and compare multiple screenshot concepts in one session. Agents can iterate on each concept separately, and you can approve the one that should be exported.",defaultCollapsed:!1,children:[l.jsxs("div",{className:"flex gap-2 mb-3",children:[l.jsx("button",{className:"flex-1 py-2 text-xs bg-accent hover:bg-accent-hover text-white rounded-md",onClick:()=>i(),children:"New Variant"}),l.jsx("button",{className:"flex-1 py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:u,disabled:o.length===0,children:"Duplicate Active"})]}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-3",onClick:d,children:"Create 3 Concepts"}),l.jsxs("div",{className:"text-[10px] text-text-dim mb-3",children:[o.length," variants in session, ",L," approved"]}),l.jsx("div",{className:"space-y-2",children:o.map(g=>{const S=g.id===a,N=g.snapshot.isPanoramic?"Panoramic":"Individual",_=g.artifacts[0];return l.jsxs("div",{className:`rounded-lg border p-3 ${S?"border-accent bg-accent/5":"border-border bg-surface-2/40"}`,children:[l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("input",{className:"flex-1 bg-bg border border-border rounded px-2 py-1 text-xs text-text",value:g.name,onChange:k=>h(g.id,k.target.value),"aria-label":"Variant name"}),l.jsx("span",{className:`text-[10px] px-2 py-1 rounded ${g.status==="approved"?"bg-emerald-500/15 text-emerald-300":"bg-surface text-text-dim"}`,children:g.status==="approved"?"Approved":"Draft"})]}),l.jsxs("div",{className:"text-[10px] text-text-dim space-y-1 mb-3",children:[l.jsxs("div",{children:[N," · ",g.snapshot.screens.length," screens · ",Object.keys(g.snapshot.sessionLocales).length," locales"]}),l.jsxs("div",{children:["Updated ",Gd(g.updatedAt)]}),l.jsxs("div",{children:[g.artifacts.length," exports recorded"]}),_&&l.jsxs("div",{children:["Last export: ",_.kind==="frames"?"frames":"screens"," · ",Gd(_.exportedAt)]})]}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx("button",{className:`flex-1 py-2 text-xs rounded-md ${S?"bg-accent text-white":"bg-surface border border-border text-text-dim hover:text-text"}`,onClick:()=>f(g.id),children:S?"Active":"Open"}),l.jsx("button",{className:`flex-1 py-2 text-xs rounded-md border ${g.status==="approved"?"border-emerald-400/40 text-emerald-300 bg-emerald-500/10":"border-border text-text-dim hover:text-text bg-surface"}`,onClick:()=>p(g.id,g.status==="approved"?"draft":"approved"),children:g.status==="approved"?"Unapprove":"Approve"}),l.jsx("button",{className:"py-2 px-3 text-xs rounded-md border border-border text-text-dim hover:text-red-300 bg-surface disabled:opacity-50",disabled:o.length<=1,onClick:async()=>{await $({title:"Delete Variant",message:`Delete ${g.name}?`})&&y(g.id)},children:"Delete"})]})]},g.id)})})]})]})}let Cf=null;function Zd(o){Cf=o}function mh(){return Cf}function Sf(){const o=W(y=>y.previewW),a=W(y=>y.previewH),i=W(y=>y.panoramicFrameCount),u=C.useCallback(()=>{try{const y=mh();return(y==null?void 0:y.contentDocument)??null}catch{return null}},[]),d=o*i,f=C.useCallback(y=>{const p=u();if(!p)return;const $=p.querySelector(".panoramic-canvas");if($){if(y.type==="solid"&&y.color)$.style.background=y.color;else if(y.type==="gradient"&&y.colors){const x=y.colors.join(", ");y.gradientType==="radial"?$.style.background=`radial-gradient(circle at ${y.radialPosition??"center"}, ${x})`:$.style.background=`linear-gradient(${y.direction??135}deg, ${x})`}}},[u]),h=C.useCallback((y,p)=>{const $=u();if(!$)return;const x=$.querySelector(`[data-index="${y}"]`);x&&(p.x!==void 0&&(x.style.left=`${p.x/100*d}px`),p.y!==void 0&&(x.style.top=`${p.y/100*a}px`),p.width!==void 0&&(x.style.width=`${p.width/100*d}px`),p.height!==void 0&&(x.style.height=`${p.height/100*a}px`),p.rotation!==void 0&&(x.style.transform=`rotate(${p.rotation}deg)`),p.opacity!==void 0&&(x.style.opacity=String(p.opacity)),p.color!==void 0&&(x.classList.contains("pano-decoration")?x.style.background=p.color:x.style.color=p.color),p.fontSize!==void 0&&(x.style.fontSize=`${p.fontSize/100*a}px`),p.fontWeight!==void 0&&(x.style.fontWeight=String(p.fontWeight)))},[u,d,a]);return{patchBackground:f,patchElement:h}}const da={device:"Device",text:"Text",label:"Label",decoration:"Decoration",image:"Image"},ph={iphone:["iphone"],android:["iphone"],ipad:["ipad"],mac:["mac"],watch:["watch"]},hh={iphone:["default-ios","default-android"],android:["default-ios","default-android"],ipad:["default-ipad","fallback-tablet"],mac:[],watch:[]};function _h(o,a,i){const u=i?ph[i]??["iphone"]:null,d=i?hh[i]??[]:null,f={};for(const p of o){const $=p.category||"other";if(u&&!u.includes($))continue;const x=f[$]??[];x.push({value:p.id,label:p.name}),f[$]=x}const h=Object.entries(f).map(([p,$])=>({label:p.charAt(0).toUpperCase()+p.slice(1),options:$})),y=[];for(const p of a){if(d&&d.length>0){if(!(p.tags??[]).some(x=>d.includes(x)))continue}else if(d&&d.length===0)continue;y.push({value:p.id,label:p.name})}return y.length>0&&h.push({label:"SVG Frames",options:y}),h}function gh(o,a){return o.map((u,d)=>({z:u.z,i:d})).sort((u,d)=>u.z-d.z).findIndex(u=>u.i===a)}function jf({index:o}){const a=W(w=>w.panoramicElements[o]),i=W(w=>w.panoramicElements),u=W(w=>w.updatePanoramicElement),d=W(w=>w.removePanoramicElement),f=W(w=>w.config),h=W(w=>w.deviceFamilies),y=W(w=>w.frames),p=W(w=>w.fonts),$=C.useRef(null),x=C.useRef(null),{confirm:L,dialog:g}=Ul(),{patchElement:S}=Sf(),N=C.useMemo(()=>gh(i,o),[i,o]),_=C.useCallback(w=>{u(o,w)},[o,u]),k=C.useCallback(w=>{S(N,w)},[S,N]);if(!a)return null;const b=W(w=>w.platform),Z=_h(h,y,b),U=(f==null?void 0:f.frames.ios)??"",le=a.type==="device"?a.frame??U:"",ne=h.find(w=>w.id===le),ie=ne&&ne.colors.length>1,he=C.useMemo(()=>wf(p),[p]),re=w=>{var H;const ke=(H=w.target.files)==null?void 0:H[0];if(!ke)return;const fe=new FileReader;fe.onload=ce=>{var Pe;_({screenshot:(Pe=ce.target)==null?void 0:Pe.result})},fe.readAsDataURL(ke),w.target.value=""},G=w=>{var H;const ke=(H=w.target.files)==null?void 0:H[0];if(!ke)return;const fe=new FileReader;fe.onload=ce=>{var Pe;_({src:(Pe=ce.target)==null?void 0:Pe.result})},fe.readAsDataURL(ke),w.target.value=""};return l.jsxs("div",{children:[g,l.jsxs("div",{className:"px-5 py-3 border-b border-border flex items-center justify-between",children:[l.jsxs("span",{className:"text-xs font-medium",children:[da[a.type]," #",i.slice(0,o).filter(w=>w.type===a.type).length+1]}),l.jsx("button",{className:"text-[10px] text-red-400 hover:text-red-300",onClick:async()=>{const w=i.slice(0,o).filter(fe=>fe.type===a.type).length+1;await L({title:"Remove Element",message:`Remove ${da[a.type]} #${w}? This cannot be undone.`})&&d(o)},children:"Remove"})]}),l.jsxs(Oe,{title:"Position",defaultCollapsed:!1,children:[l.jsx(K,{label:"X %",value:a.x,min:-50,max:150,step:.5,formatValue:w=>`${w}%`,onChange:w=>_({x:w}),onInstant:w=>k({x:w})}),l.jsx(K,{label:"Y %",value:a.y,min:-50,max:150,step:.5,formatValue:w=>`${w}%`,onChange:w=>_({y:w}),onInstant:w=>k({y:w})}),l.jsx(K,{label:"Z-Index",value:a.z,min:0,max:100,onChange:w=>_({z:w})})]}),a.type==="device"&&(()=>{const w=(a.frameStyle??"flat")==="none",ke=ne&&ne.screenRect,fe=a.fullscreenScreenshot??!1;return l.jsxs(l.Fragment,{children:[l.jsxs(Oe,{title:"Screenshot",children:[a.screenshot.startsWith("data:")?l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:a.screenshot,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:"Custom upload"})]}):l.jsx("div",{className:"text-xs text-text-dim mb-2 truncate",children:a.screenshot}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var H;return(H=$.current)==null?void 0:H.click()},children:"Upload Screenshot"}),l.jsx("input",{ref:$,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload screenshot image",onChange:re}),a.screenshot.startsWith("data:")&&l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:()=>{var H;return _({screenshot:((H=f==null?void 0:f.screens[0])==null?void 0:H.screenshot)??"screenshots/screen-1.png"})},children:"Revert to File"})]}),l.jsxs(Oe,{title:"Device Frame",children:[l.jsx(Ge,{label:"Frame",value:le,onChange:H=>{const ce=h.find(O=>O.id===H),Pe=ce&&ce.screenRect;_(Pe&&w?{frame:H,frameStyle:"flat"}:{frame:H})},groups:Z}),ie&&l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Color Variant"}),l.jsx("div",{className:"flex flex-wrap gap-1",children:ne.colors.map(H=>l.jsx("button",{className:`w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent ${a.deviceColor===H.name?"border-accent ring-1 ring-accent":"border-border"}`,style:{background:bf[H.name]??"#888888"},title:H.name,"aria-label":`${H.name} color variant`,"aria-pressed":a.deviceColor===H.name,onClick:()=>_({deviceColor:H.name})},H.name))})]}),l.jsx(Ge,{label:"Frame Style",value:a.frameStyle??"flat",onChange:H=>_({frameStyle:H}),options:[{value:"flat",label:"Flat"},{value:"none",label:"None (frameless)"}],hidden:!!ke}),w&&l.jsxs(l.Fragment,{children:[l.jsx(bt,{label:"Border Simulation",checked:!!a.borderSimulation,onChange:H=>_({borderSimulation:H?{enabled:!0,thickness:4,color:"#1a1a1a",radius:40}:void 0})}),a.borderSimulation&&(()=>{const H=a.borderSimulation;return l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Thickness",value:H.thickness,min:1,max:20,formatValue:ce=>`${ce}px`,onChange:ce=>_({borderSimulation:{...H,thickness:ce}})}),l.jsx(qe,{label:"Color",value:H.color,onChange:ce=>_({borderSimulation:{...H,color:ce}})}),l.jsx(K,{label:"Radius",value:H.radius,min:0,max:60,formatValue:ce=>`${ce}px`,onChange:ce=>_({borderSimulation:{...H,radius:ce}})})]})})()]})]}),l.jsxs(Oe,{title:"Device Layout",tooltip:"Control device scale, position, and fullscreen mode.",children:[l.jsx(bt,{label:"Fullscreen Screenshot",checked:fe,onChange:H=>_({fullscreenScreenshot:H})}),!fe&&l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Device Size",value:a.width,min:5,max:60,step:.5,formatValue:H=>`${H}%`,onChange:H=>_({width:H}),onInstant:H=>k({width:H})}),l.jsx(K,{label:"Device Rotation",value:a.rotation,min:-180,max:180,formatValue:H=>`${H}°`,onChange:H=>_({rotation:H}),onInstant:H=>k({rotation:H})}),l.jsx(K,{label:"3D Tilt",value:a.deviceTilt??0,min:0,max:40,formatValue:H=>`${H}°`,onChange:H=>_({deviceTilt:H})}),w&&l.jsx(K,{label:"Corner Radius",value:a.cornerRadius??0,min:0,max:50,formatValue:H=>`${H}%`,onChange:H=>_({cornerRadius:H})})]})]}),l.jsxs(Oe,{title:"Device Shadow",tooltip:"Add a custom shadow beneath the device frame.",defaultCollapsed:!0,children:[l.jsx(bt,{label:"Custom Shadow",checked:!!a.shadow,onChange:H=>_({shadow:H?{opacity:.25,blur:20,color:"#000000",offsetY:10}:void 0})}),a.shadow&&l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Opacity",value:Math.round(a.shadow.opacity*100),min:0,max:100,formatValue:H=>`${H}%`,onChange:H=>_({shadow:{...a.shadow,opacity:H/100}})}),l.jsx(K,{label:"Blur",value:a.shadow.blur,min:0,max:50,formatValue:H=>`${H}px`,onChange:H=>_({shadow:{...a.shadow,blur:H}})}),l.jsx(qe,{label:"Color",value:a.shadow.color,onChange:H=>_({shadow:{...a.shadow,color:H}})}),l.jsx(K,{label:"Y Offset",value:a.shadow.offsetY,min:0,max:30,formatValue:H=>`${H}px`,onChange:H=>_({shadow:{...a.shadow,offsetY:H}})})]})]})]})})(),a.type==="text"&&l.jsxs(l.Fragment,{children:[l.jsxs(Oe,{title:"Content",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Headline"}),l.jsx("textarea",{rows:3,value:a.content,onChange:w=>_({content:w.target.value}),className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent resize-y min-h-[60px]"})]}),l.jsx(qe,{label:"Color",value:a.color,onChange:w=>_({color:w})})]}),l.jsxs(Oe,{title:"Typography",tooltip:"Control font family, weight, size, and styling for this element.",children:[l.jsx(Ge,{label:"Font",value:a.font??(f==null?void 0:f.theme.font)??"inter",onChange:w=>_({font:w}),groups:he}),l.jsx(K,{label:"Font Size",value:a.fontSize,min:.5,max:20,step:.1,formatValue:w=>`${w}%`,onChange:w=>_({fontSize:w}),onInstant:w=>k({fontSize:w})}),l.jsx(K,{label:"Font Weight",value:a.fontWeight,min:100,max:900,step:100,formatValue:w=>String(w),onChange:w=>_({fontWeight:w}),onInstant:w=>k({fontWeight:w})}),l.jsx(Ge,{label:"Alignment",value:a.textAlign,onChange:w=>_({textAlign:w}),options:[{value:"left",label:"Left"},{value:"center",label:"Center"},{value:"right",label:"Right"}]}),l.jsx(K,{label:"Line Height",value:a.lineHeight,min:.8,max:2,step:.05,formatValue:w=>w.toFixed(2),onChange:w=>_({lineHeight:w})}),l.jsxs("div",{className:"flex gap-2 mb-2",children:[l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Case",value:a.textTransform??"",onChange:w=>_({textTransform:w}),options:[{value:"",label:"Auto"},{value:"none",label:"None"},{value:"uppercase",label:"Uppercase"},{value:"lowercase",label:"Lowercase"},{value:"capitalize",label:"Capitalize"}]})}),l.jsx("div",{className:"flex-1",children:l.jsx(Ge,{label:"Style",value:a.fontStyle,onChange:w=>_({fontStyle:w}),options:[{value:"normal",label:"Normal"},{value:"italic",label:"Italic"}]})})]}),l.jsx(K,{label:"Letter Spacing",value:a.letterSpacing??0,min:-5,max:10,formatValue:w=>w===0?"Auto":`${w/100}em`,onChange:w=>_({letterSpacing:w})}),l.jsx(K,{label:"Rotation",value:a.rotation??0,min:-30,max:30,formatValue:w=>`${w}°`,onChange:w=>_({rotation:w})})]}),l.jsxs(Oe,{title:"Text Gradient",tooltip:"Apply a gradient color effect to the text.",defaultCollapsed:!0,children:[l.jsx(bt,{label:"Enable Gradient",checked:!!a.gradient,onChange:w=>_({gradient:w?{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"}:void 0})}),a.gradient&&(()=>{const w=a.gradient;return l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:mc.map(ke=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${ke.direction}deg, ${ke.colors.join(", ")})`},title:ke.name,"aria-label":`Apply ${ke.name} gradient`,onClick:()=>_({gradient:{type:"linear",colors:[...ke.colors],direction:ke.direction,radialPosition:"center"}})},ke.name))}),l.jsx(K,{label:"Direction",value:w.direction,min:0,max:360,formatValue:ke=>`${ke}°`,onChange:ke=>_({gradient:{...w,direction:ke}})}),w.colors.map((ke,fe)=>l.jsx(qe,{label:`Stop ${fe+1}`,value:ke,onChange:H=>{const ce=[...w.colors];ce[fe]=H,_({gradient:{...w,colors:ce}})}},fe))]})})()]}),l.jsxs(Oe,{title:"Layout",children:[l.jsx(bt,{label:"Limit width",checked:a.maxWidth!==void 0,onChange:w=>_({maxWidth:w?25:void 0})}),a.maxWidth!==void 0&&l.jsx(K,{label:"Max Width %",value:a.maxWidth,min:5,max:100,step:.5,formatValue:w=>`${w}%`,onChange:w=>_({maxWidth:w})})]})]}),a.type==="image"&&l.jsxs(l.Fragment,{children:[l.jsxs(Oe,{title:"Image Asset",children:[a.src.startsWith("data:")?l.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[l.jsx("img",{src:a.src,alt:"",className:"w-10 h-10 rounded object-cover border border-border"}),l.jsx("span",{className:"text-xs text-text-dim truncate flex-1",children:"Custom upload"})]}):l.jsx("div",{className:"text-xs text-text-dim mb-2 truncate",children:a.src}),l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var w;return(w=x.current)==null?void 0:w.click()},children:"Upload Image"}),l.jsx("input",{ref:x,type:"file",accept:"image/png,image/jpeg,image/webp,image/svg+xml",className:"hidden","aria-label":"Upload panoramic image",onChange:G})]}),l.jsxs(Oe,{title:"Layout",children:[l.jsx(K,{label:"Width",value:a.width,min:.5,max:100,step:.5,formatValue:w=>`${w}%`,onChange:w=>_({width:w}),onInstant:w=>k({width:w})}),l.jsx(K,{label:"Height",value:a.height,min:.5,max:100,step:.5,formatValue:w=>`${w}%`,onChange:w=>_({height:w}),onInstant:w=>k({height:w})}),l.jsx(Ge,{label:"Fit",value:a.fit,onChange:w=>_({fit:w}),options:[{value:"contain",label:"Contain"},{value:"cover",label:"Cover"}]}),l.jsx(K,{label:"Opacity",value:a.opacity,min:0,max:1,step:.05,formatValue:w=>`${Math.round(w*100)}%`,onChange:w=>_({opacity:w}),onInstant:w=>k({opacity:w})}),l.jsx(K,{label:"Rotation",value:a.rotation,min:-180,max:180,formatValue:w=>`${w}°`,onChange:w=>_({rotation:w}),onInstant:w=>k({rotation:w})}),l.jsx(K,{label:"Border Radius",value:a.borderRadius,min:0,max:100,formatValue:w=>`${w}px`,onChange:w=>_({borderRadius:w})})]}),l.jsxs(Oe,{title:"Shadow",defaultCollapsed:!0,children:[l.jsx(bt,{label:"Custom Shadow",checked:!!a.shadow,onChange:w=>_({shadow:w?{opacity:.2,blur:24,color:"#000000",offsetY:8}:void 0})}),a.shadow&&l.jsxs(l.Fragment,{children:[l.jsx(K,{label:"Opacity",value:Math.round(a.shadow.opacity*100),min:0,max:100,formatValue:w=>`${w}%`,onChange:w=>_({shadow:{...a.shadow,opacity:w/100}})}),l.jsx(K,{label:"Blur",value:a.shadow.blur,min:0,max:50,formatValue:w=>`${w}px`,onChange:w=>_({shadow:{...a.shadow,blur:w}})}),l.jsx(qe,{label:"Color",value:a.shadow.color,onChange:w=>_({shadow:{...a.shadow,color:w}})}),l.jsx(K,{label:"Y Offset",value:a.shadow.offsetY,min:0,max:30,formatValue:w=>`${w}px`,onChange:w=>_({shadow:{...a.shadow,offsetY:w}})})]})]})]}),a.type==="label"&&l.jsxs(Oe,{title:"Label",children:[l.jsxs("div",{className:"mb-2.5",children:[l.jsx("label",{className:"block text-xs text-text-dim mb-1",children:"Content"}),l.jsx("input",{type:"text",className:"w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] outline-none focus:border-accent",value:a.content,onChange:w=>_({content:w.target.value})})]}),l.jsx(K,{label:"Font Size",value:a.fontSize,min:.5,max:10,step:.1,formatValue:w=>`${w}%`,onChange:w=>_({fontSize:w}),onInstant:w=>k({fontSize:w})}),l.jsx(qe,{label:"Text Color",value:a.color,onChange:w=>_({color:w})}),l.jsx(qe,{label:"Background",value:a.backgroundColor??"#00000033",onChange:w=>_({backgroundColor:w})}),l.jsx(K,{label:"Padding",value:a.padding,min:0,max:5,step:.1,formatValue:w=>`${w}%`,onChange:w=>_({padding:w})}),l.jsx(K,{label:"Border Radius",value:a.borderRadius,min:0,max:30,formatValue:w=>`${w}px`,onChange:w=>_({borderRadius:w})})]}),a.type==="decoration"&&l.jsxs(Oe,{title:"Decoration",children:[l.jsx(Ge,{label:"Shape",value:a.shape,onChange:w=>_({shape:w}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"},{value:"dot-grid",label:"Dot Grid"}]}),l.jsx(K,{label:"Width",value:a.width,min:.5,max:100,step:.5,formatValue:w=>`${w}%`,onChange:w=>_({width:w}),onInstant:w=>k({width:w})}),a.height!==void 0&&l.jsx(K,{label:"Height",value:a.height,min:.5,max:100,step:.5,formatValue:w=>`${w}%`,onChange:w=>_({height:w}),onInstant:w=>k({height:w})}),l.jsx(K,{label:"Opacity",value:a.opacity,min:0,max:1,step:.05,formatValue:w=>`${Math.round(w*100)}%`,onChange:w=>_({opacity:w}),onInstant:w=>k({opacity:w})}),l.jsx(K,{label:"Rotation",value:a.rotation,min:-180,max:180,formatValue:w=>`${w}°`,onChange:w=>_({rotation:w}),onInstant:w=>k({rotation:w})}),l.jsx(qe,{label:"Color",value:a.color,onChange:w=>_({color:w})})]})]})}function yh({imageDataUrl:o,onUpload:a,onRemove:i}){const u=C.useRef(null),d=f=>{var p;const h=(p=f.target.files)==null?void 0:p[0];if(!h)return;const y=new FileReader;y.onload=$=>{var x;return a((x=$.target)==null?void 0:x.result)},y.readAsDataURL(h),f.target.value=""};return l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:()=>{var f;return(f=u.current)==null?void 0:f.click()},children:"Upload Background Image"}),l.jsx("input",{ref:u,type:"file",accept:"image/png,image/jpeg,image/webp",className:"hidden","aria-label":"Upload background image",onChange:d}),o&&l.jsxs("div",{className:"mt-1.5",children:[l.jsx("img",{src:o,className:"w-full max-h-20 object-cover rounded-md border border-border",alt:"Background"}),l.jsx("button",{className:"w-full py-1 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mt-1",onClick:i,children:"Remove"})]})]})}function xh(){const o=C.useRef(null),a=W(h=>h.panoramicElements),i=W(h=>h.updatePanoramicElement),u=W(h=>h.addPanoramicElement),d=a.map((h,y)=>({el:h,i:y})).filter(({el:h})=>h.type==="device"),f=h=>{const y=Array.from(h.target.files??[]);y.length!==0&&(y.forEach((p,$)=>{const x=new FileReader;x.onload=L=>{var S;const g=(S=L.target)==null?void 0:S.result;if($<d.length)i(d[$].i,{screenshot:g});else{const N=d.length+($-d.length);u({type:"device",screenshot:g,frameStyle:"flat",x:10+N*20,y:15,width:12,rotation:0,deviceScale:92,deviceTop:15,deviceOffsetX:0,deviceAngle:8,deviceTilt:0,cornerRadius:0,fullscreenScreenshot:!1,z:5})}},x.readAsDataURL(p)}),h.target.value="")};return l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{var h;return(h=o.current)==null?void 0:h.click()},children:"Upload Screenshots"}),l.jsx("input",{ref:o,type:"file",accept:"image/png,image/jpeg,image/webp",multiple:!0,className:"hidden","aria-label":"Upload device screenshots",onChange:f}),d.length>0&&l.jsx("div",{className:"mt-2 space-y-1",children:d.map(({el:h,i:y})=>l.jsxs("div",{className:"flex items-center gap-2 text-[11px] text-text-dim",children:[l.jsx("span",{className:"w-4 text-center",children:d.indexOf(d.find(p=>p.i===y))+1}),h.screenshot.startsWith("data:")?l.jsx("img",{src:h.screenshot,alt:"",className:"w-6 h-6 rounded object-cover border border-border"}):l.jsx("span",{className:"truncate flex-1",children:h.screenshot})]},y))}),l.jsx("p",{className:"text-[10px] text-text-dim mt-1.5",children:"Select multiple files to assign to device elements in order."})]})}const vh=[{value:"iphone",label:"iPhone"},{value:"ipad",label:"iPad"},{value:"mac",label:"Mac"},{value:"watch",label:"Apple Watch"},{value:"android",label:"Android"}];function bh(){const o=W(b=>b.panoramicFrameCount),a=W(b=>b.setPanoramicFrameCount),i=W(b=>b.panoramicBackground),u=W(b=>b.updatePanoramicBackground),d=W(b=>b.platform),f=W(b=>b.setPlatform),h=W(b=>b.setPreviewSize),y=W(b=>b.sizes),p=W(b=>b.setExportSize),$=W(b=>b.syncPanoramicDevicesForPlatform),{patchBackground:x}=Sf(),L=C.useCallback(b=>{f(b),$(b);const Z=pc(b);h(Z.w,Z.h);const U=ha(y,b);U&&p(U)},[p,f,h,y,$]),g=C.useCallback(b=>x({type:"solid",color:b}),[x]),S=C.useCallback(b=>{const Z=i.gradient??{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"};x({type:"gradient",gradientType:Z.type,colors:(b==null?void 0:b.colors)??Z.colors,direction:(b==null?void 0:b.direction)??Z.direction,radialPosition:Z.radialPosition})},[i.gradient,x]),N=i.type,_=i.color??"#000000",k=i.gradient??{type:"linear",colors:["#6366f1","#ec4899"],direction:135,radialPosition:"center"};return l.jsxs("div",{children:[l.jsxs(Oe,{title:"Canvas",defaultCollapsed:!1,children:[l.jsx(Ge,{label:"Platform",value:d,onChange:L,options:vh}),l.jsx(K,{label:"Frame Count",value:o,min:2,max:10,onChange:a})]}),l.jsxs(Oe,{title:"Background",children:[l.jsx("div",{className:"flex gap-3 mb-2.5",children:["solid","gradient","image","preset"].map(b=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",name:"pano-bg-type",value:b,checked:N===b,onChange:()=>u({type:b}),className:"accent-accent"}),b.charAt(0).toUpperCase()+b.slice(1)]},b))}),N==="preset"&&l.jsx(Ge,{label:"Style Preset",value:i.preset??"",onChange:b=>u({preset:b}),options:[{value:"",label:"Select a preset..."},{value:"minimal",label:"Minimal"},{value:"bold",label:"Bold"},{value:"glow",label:"Glow"},{value:"playful",label:"Playful"},{value:"clean",label:"Clean"},{value:"branded",label:"Branded"},{value:"editorial",label:"Editorial"}]}),N==="solid"&&l.jsx(qe,{label:"Color",value:_,onChange:b=>u({color:b}),onInstant:g,presets:vf}),N==="gradient"&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"flex flex-wrap gap-1 mb-2",children:mc.map(b=>l.jsx("button",{className:"w-8 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none",style:{background:`linear-gradient(${b.direction}deg, ${b.colors.join(", ")})`},title:b.name,"aria-label":`Apply ${b.name} gradient`,onClick:()=>u({gradient:{type:"linear",colors:[...b.colors],direction:b.direction,radialPosition:"center"}})},b.name))}),l.jsx("div",{className:"flex gap-3 mb-2",children:["linear","radial"].map(b=>l.jsxs("label",{className:"text-xs text-text-dim cursor-pointer flex items-center gap-1",children:[l.jsx("input",{type:"radio",checked:k.type===b,onChange:()=>u({gradient:{...k,type:b}}),className:"accent-accent"}),b.charAt(0).toUpperCase()+b.slice(1)]},b))}),k.type==="linear"&&l.jsx(K,{label:"Direction",value:k.direction,min:0,max:360,formatValue:b=>`${b}°`,onChange:b=>u({gradient:{...k,direction:b}}),onInstant:b=>S({direction:b})}),k.type==="radial"&&l.jsx(Ge,{label:"Center",value:k.radialPosition??"center",onChange:b=>u({gradient:{...k,radialPosition:b}}),options:[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"}]}),k.colors.map((b,Z)=>l.jsx(qe,{label:`Stop ${Z+1}`,value:b,onChange:U=>{const le=[...k.colors];le[Z]=U,u({gradient:{...k,colors:le}})}},Z)),k.colors.length<5&&l.jsx("button",{className:"w-full text-[11px] py-1 bg-surface-2 border border-border rounded-md text-text-dim hover:text-text",onClick:()=>{const b=[...k.colors,"#ffffff"];u({gradient:{...k,colors:b}})},children:"+ Add Color Stop"})]}),N==="image"&&l.jsxs(l.Fragment,{children:[l.jsx(yh,{imageDataUrl:i.image,onUpload:b=>u({image:b}),onRemove:()=>u({image:void 0})}),l.jsxs("div",{className:"mt-2",children:[l.jsx(bt,{label:"Dim Overlay",checked:!!i.overlay,onChange:b=>u({overlay:b?{color:"#000000",opacity:.3}:void 0})}),i.overlay&&l.jsxs(l.Fragment,{children:[l.jsx(qe,{label:"Color",value:i.overlay.color,onChange:b=>u({overlay:{...i.overlay,color:b}})}),l.jsx(K,{label:"Opacity",value:Math.round(i.overlay.opacity*100),min:0,max:100,formatValue:b=>`${b}%`,onChange:b=>u({overlay:{...i.overlay,opacity:b/100}})})]})]})]})]})]})}function wh(){const o=W(x=>x.panoramicElements),a=W(x=>x.selectedElementIndex),i=W(x=>x.setSelectedElement),u=W(x=>x.addPanoramicElement),d=W(x=>x.config),f=o.map((x,L)=>({el:x,i:L})).filter(({el:x})=>x.type==="device"||x.type==="decoration"||x.type==="image"),h=()=>{var g,S;const x=o.filter(N=>N.type==="device").length,L=((g=d==null?void 0:d.screens[x])==null?void 0:g.screenshot)??((S=d==null?void 0:d.screens[0])==null?void 0:S.screenshot)??"screenshots/screen-1.png";u({type:"device",screenshot:L,frameStyle:"flat",x:10+x*20,y:15,width:12,rotation:0,deviceScale:92,deviceTop:15,deviceOffsetX:0,deviceAngle:8,deviceTilt:0,cornerRadius:0,fullscreenScreenshot:!1,z:5})},y=()=>{u({type:"decoration",shape:"circle",x:50,y:50,width:5,height:8,color:(d==null?void 0:d.theme.colors.primary)??"#6366F1",opacity:.15,rotation:0,z:0})},p=()=>{var L;const x=o.filter(g=>g.type==="image").length;u({type:"image",src:((L=d==null?void 0:d.screens[0])==null?void 0:L.screenshot)??"screenshots/screen-1.png",x:8+x*12,y:58,width:12,height:12,fit:"contain",opacity:1,rotation:0,borderRadius:0,z:6})},$=a!==null&&o[a]&&(o[a].type==="device"||o[a].type==="decoration"||o[a].type==="image");return l.jsxs("div",{children:[l.jsx(Oe,{title:"Screenshots",children:l.jsx(xh,{})}),l.jsxs(Oe,{title:`Devices & Decorations (${f.length})`,defaultCollapsed:!1,children:[l.jsxs("div",{className:"grid grid-cols-3 gap-1 mb-3",children:[l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:h,children:"+ Device"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:y,children:"+ Decoration"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:p,children:"+ Image"})]}),f.length===0&&l.jsx("p",{className:"text-xs text-text-dim text-center py-4",children:"Add devices to place screenshots on the panoramic canvas."}),l.jsx("div",{className:"space-y-1",children:f.map(({el:x,i:L})=>{const g=o.slice(0,L).filter(S=>S.type===x.type).length+1;return l.jsxs("button",{className:`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${L===a?"bg-accent/15 text-accent border border-accent/30":"bg-surface-2 border border-border hover:border-accent/30"}`,onClick:()=>i(L===a?null:L),children:[l.jsxs("span",{className:"font-medium",children:[da[x.type]," #",g]}),l.jsxs("span",{className:"text-text-dim ml-1",children:["(",Math.round(x.x),"%, ",Math.round(x.y),"%)"]})]},L)})})]}),$&&l.jsx(jf,{index:a})]})}function kh(){const o=W(p=>p.panoramicElements),a=W(p=>p.selectedElementIndex),i=W(p=>p.setSelectedElement),u=W(p=>p.addPanoramicElement),d=o.map((p,$)=>({el:p,i:$})).filter(({el:p})=>p.type==="text"||p.type==="label"),f=()=>{const p=o.filter($=>$.type==="text").length;u({type:"text",content:"New headline",x:5+p*20,y:5,fontSize:3.5,color:"#FFFFFF",fontWeight:700,fontStyle:"normal",textAlign:"left",lineHeight:1.15,letterSpacing:0,textTransform:"",rotation:0,maxWidth:25,z:10})},h=()=>{u({type:"label",content:"New Label",x:50,y:50,fontSize:1.5,color:"#FFFFFF",backgroundColor:"#00000044",padding:.5,borderRadius:8,z:15})},y=a!==null&&o[a]&&(o[a].type==="text"||o[a].type==="label");return l.jsxs("div",{children:[l.jsxs(Oe,{title:`Text & Labels (${d.length})`,defaultCollapsed:!1,children:[l.jsxs("div",{className:"grid grid-cols-2 gap-1 mb-3",children:[l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:f,children:"+ Text"}),l.jsx("button",{className:"py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent transition-colors",onClick:h,children:"+ Label"})]}),d.length===0&&l.jsx("p",{className:"text-xs text-text-dim text-center py-4",children:"Add text elements for headlines, subtitles, and labels."}),l.jsx("div",{className:"space-y-1",children:d.map(({el:p,i:$})=>{const x=o.slice(0,$).filter(L=>L.type===p.type).length+1;return l.jsxs("button",{className:`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${$===a?"bg-accent/15 text-accent border border-accent/30":"bg-surface-2 border border-border hover:border-accent/30"}`,onClick:()=>i($===a?null:$),children:[l.jsxs("span",{className:"font-medium",children:[da[p.type]," #",x]}),l.jsxs("span",{className:"text-text-dim ml-1",children:["(",Math.round(p.x),"%, ",Math.round(p.y),"%)"]}),(p.type==="text"||p.type==="label")&&l.jsxs("span",{className:"text-text-dim ml-1 truncate",title:p.content,children:["— ",p.content.slice(0,20)]})]},$)})})]}),y&&l.jsx(jf,{index:a})]})}function Jd(o){return`${o}-${crypto.randomUUID().slice(0,8)}`}function Ch(){const o=W(x=>x.panoramicEffects),a=W(x=>x.updatePanoramicEffects),{confirm:i,dialog:u}=Ul(),d=(x,L)=>{const g=o.annotations.map((S,N)=>N===x?{...S,...L}:S);a({annotations:g})},f=async x=>{await i({title:"Remove Annotation",message:`Remove Annotation ${x+1}? This cannot be undone.`})&&a({annotations:o.annotations.filter((g,S)=>S!==x)})},h=()=>{a({annotations:[...o.annotations,{id:Jd("ann"),shape:"rounded-rect",x:40,y:40,w:20,h:20,strokeColor:"#FF3B30",strokeWidth:4}]})},y=(x,L)=>{const g=o.overlays.map((S,N)=>N===x?{...S,...L}:S);a({overlays:g})},p=async x=>{await i({title:"Remove Overlay",message:`Remove Overlay ${x+1}? This cannot be undone.`})&&a({overlays:o.overlays.filter((g,S)=>S!==x)})},$=()=>{a({overlays:[...o.overlays,{id:Jd("overlay"),type:"shape",x:10,y:10,size:10,rotation:0,opacity:1,shapeType:"circle",shapeColor:"#6366f1",shapeOpacity:.5,shapeBlur:10}]})};return l.jsxs(l.Fragment,{children:[u,l.jsxs(Oe,{title:"Spotlight / Dimming",tooltip:"Dim the panoramic canvas and highlight a specific area to draw attention.",defaultCollapsed:!1,children:[!o.spotlight&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Dim the canvas background and highlight a specific region to guide the viewer's eye."}),l.jsx(bt,{label:"Enable Spotlight",checked:!!o.spotlight,onChange:x=>a({spotlight:x?{x:50,y:50,w:30,h:30,shape:"rectangle",dimOpacity:.6,blur:0}:null})}),o.spotlight&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:o.spotlight.shape,onChange:x=>a({spotlight:{...o.spotlight,shape:x}}),options:[{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(K,{label:"Position X",value:o.spotlight.x,min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({spotlight:{...o.spotlight,x}})}),l.jsx(K,{label:"Position Y",value:o.spotlight.y,min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({spotlight:{...o.spotlight,y:x}})}),l.jsx(K,{label:"Width",value:o.spotlight.w,min:5,max:100,formatValue:x=>`${x}%`,onChange:x=>a({spotlight:{...o.spotlight,w:x}})}),l.jsx(K,{label:"Height",value:o.spotlight.h,min:5,max:100,formatValue:x=>`${x}%`,onChange:x=>a({spotlight:{...o.spotlight,h:x}})}),l.jsx(K,{label:"Dim Opacity",value:Math.round(o.spotlight.dimOpacity*100),min:0,max:100,formatValue:x=>`${x}%`,onChange:x=>a({spotlight:{...o.spotlight,dimOpacity:x/100}})}),l.jsx(K,{label:"Background Blur",value:o.spotlight.blur,min:0,max:30,formatValue:x=>`${x}px`,onChange:x=>a({spotlight:{...o.spotlight,blur:x}})})]})]}),l.jsxs(Oe,{title:"Annotations",tooltip:"Draw shapes over the panoramic canvas to highlight specific areas.",children:[o.annotations.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Highlight areas of your panoramic canvas with rectangles or circles."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:h,children:"+ Add Annotation"}),o.annotations.map((x,L)=>l.jsxs(Yl,{title:`Annotation ${L+1}`,onRemove:()=>f(L),children:[l.jsx(Ge,{label:"Shape",value:x.shape,onChange:g=>d(L,{shape:g}),options:[{value:"rounded-rect",label:"Rounded Rect"},{value:"rectangle",label:"Rectangle"},{value:"circle",label:"Circle"}]}),l.jsx(qe,{label:"Color",value:x.strokeColor,onChange:g=>d(L,{strokeColor:g})}),l.jsx(K,{label:"X",value:x.x,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>d(L,{x:g})}),l.jsx(K,{label:"Y",value:x.y,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>d(L,{y:g})}),l.jsx(K,{label:"Width",value:x.w,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>d(L,{w:g})}),l.jsx(K,{label:"Height",value:x.h,min:1,max:100,formatValue:g=>`${g}%`,onChange:g=>d(L,{h:g})}),l.jsx(K,{label:"Stroke",value:x.strokeWidth,min:1,max:20,formatValue:g=>`${g}px`,onChange:g=>d(L,{strokeWidth:g})})]},x.id))]}),l.jsxs(Oe,{title:"Overlays",tooltip:"Add decorative shapes floating over the panoramic canvas.",children:[o.overlays.length===0&&l.jsx("p",{className:"text-[10px] text-text-dim mb-2 leading-relaxed",children:"Add floating shapes, star ratings, or badges over your panoramic canvas for extra visual appeal."}),l.jsx("button",{className:"w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text mb-2",onClick:$,children:"+ Add Overlay"}),o.overlays.map((x,L)=>l.jsxs(Yl,{title:`Overlay ${L+1}`,onRemove:()=>p(L),children:[l.jsx(Ge,{label:"Type",value:x.type,onChange:g=>y(L,{type:g}),options:[{value:"shape",label:"Shape"},{value:"star-rating",label:"Star Rating"},{value:"icon",label:"Icon"},{value:"badge",label:"Badge"},{value:"custom",label:"Custom"}]}),l.jsx(K,{label:"X",value:x.x,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(L,{x:g})}),l.jsx(K,{label:"Y",value:x.y,min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(L,{y:g})}),l.jsx(K,{label:"Size",value:x.size,min:1,max:50,formatValue:g=>`${g}%`,onChange:g=>y(L,{size:g})}),l.jsx(K,{label:"Rotation",value:x.rotation,min:-180,max:180,formatValue:g=>`${g}°`,onChange:g=>y(L,{rotation:g})}),l.jsx(K,{label:"Opacity",value:Math.round(x.opacity*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(L,{opacity:g/100})}),x.type==="shape"&&l.jsxs(l.Fragment,{children:[l.jsx(Ge,{label:"Shape",value:x.shapeType??"circle",onChange:g=>y(L,{shapeType:g}),options:[{value:"circle",label:"Circle"},{value:"rectangle",label:"Rectangle"},{value:"line",label:"Line"}]}),l.jsx(qe,{label:"Color",value:x.shapeColor??"#6366f1",onChange:g=>y(L,{shapeColor:g})}),l.jsx(K,{label:"Shape Opacity",value:Math.round((x.shapeOpacity??.5)*100),min:0,max:100,formatValue:g=>`${g}%`,onChange:g=>y(L,{shapeOpacity:g/100})}),l.jsx(K,{label:"Blur",value:x.shapeBlur??0,min:0,max:50,formatValue:g=>`${g}px`,onChange:g=>y(L,{shapeBlur:g})})]})]},x.id))]}),l.jsx("div",{className:"px-5 py-3 text-[10px] text-text-dim",children:"Loupe and Callouts are available in individual mode as they operate on specific screenshot regions."})]})}function Sh(o){return{top:o.offsetTop,left:o.offsetLeft,width:o.offsetWidth,height:o.offsetHeight}}function Zi(o){let a=o.offsetLeft,i=o.offsetTop,u=o.offsetParent;for(;u;)a+=u.offsetLeft-u.scrollLeft,i+=u.offsetTop-u.scrollTop,u=u.offsetParent;return{left:a,top:i,width:o.offsetWidth,height:o.offsetHeight}}function jh(o,a,i,u,d,f,h,y){const p=C.useRef(null),$=C.useCallback((S,N)=>{var _,k,b,Z;try{const U=(_=o.current)==null?void 0:_.contentDocument;if(!U)return null;const le=U.elementsFromPoint(S,N);let ne=null,ie=null,he=null;for(const re of le){let G=re;for(;G&&G!==U.documentElement;)!ne&&((k=G.classList)!=null&&k.contains("headline"))&&(ne=G),!ie&&((b=G.classList)!=null&&b.contains("subtitle"))&&(ie=G),!he&&((Z=G.classList)!=null&&Z.contains("device-wrapper"))&&(he=G),G=G.parentElement}if(ne&&ie){const re=Zi(ne),G=Zi(ie),w=re.top+re.height/2,ke=G.top+G.height/2;return Math.abs(N-w)<=Math.abs(N-ke)?{cls:"headline",el:ne,kind:"text"}:{cls:"subtitle",el:ie,kind:"text"}}if(ne)return{cls:"headline",el:ne,kind:"text"};if(ie)return{cls:"subtitle",el:ie,kind:"text"};if(he)return{cls:"device-wrapper",el:he,kind:"device"}}catch{}return null},[o]),x=C.useCallback((S,N)=>{const _=a.current;if(!_)return{x:0,y:0};const k=_.getBoundingClientRect();return{x:(S-k.left)/u,y:(N-k.top)/u}},[a,u]),L=C.useCallback(S=>{if(!i)return;const N=x(S.clientX,S.clientY),_=$(N.x,N.y);if(_){if(S.preventDefault(),_.kind==="device"){p.current={kind:"device",el:_.el,startX:S.clientX,startY:S.clientY,startDeviceTop:i.deviceTop,startDeviceOffsetX:i.deviceOffsetX,offsetX:0,offsetY:0,origWidth:0,scale:u},_.el.style.outline="2px solid rgba(99,102,241,0.5)";const k=Z=>{const U=p.current;if(!U||U.kind!=="device")return;const le=(Z.clientX-U.startX)/U.scale,ne=(Z.clientY-U.startY)/U.scale,ie=Math.max(-80,Math.min(80,U.startDeviceOffsetX+Math.round(le/d*100))),he=Math.max(-80,Math.min(80,U.startDeviceTop+Math.round(ne/f*100)));U.el.style.top=he+"%",U.el.style.left=ie?`calc(50% + ${ie/100*d}px)`:"50%"},b=Z=>{const U=p.current;if(!U||U.kind!=="device")return;U.el.style.outline="none";const le=(Z.clientX-U.startX)/U.scale,ne=(Z.clientY-U.startY)/U.scale,ie=Math.max(-80,Math.min(80,U.startDeviceOffsetX+Math.round(le/d*100))),he=Math.max(-80,Math.min(80,U.startDeviceTop+Math.round(ne/f*100)));p.current=null,document.removeEventListener("mousemove",k),document.removeEventListener("mouseup",b),h({deviceTop:he,deviceOffsetX:ie})};document.addEventListener("mousemove",k),document.addEventListener("mouseup",b)}else if(_.kind==="text"){const k=_.el,b=_.cls,Z=Zi(k),U=!!(b==="headline"?i.textPositions.headline:i.textPositions.subtitle),le=U?Z.left:Z.left+Z.width/2,ne=Z.width;if(!U){const re=b==="headline"?i.headlineRotation:i.subtitleRotation,G=["translateX(-50%)"];re&&G.push(`rotate(${re}deg)`),k.style.position="fixed",k.style.top=Z.top+"px",k.style.left=le+"px",k.style.transform=G.join(" "),k.style.zIndex="10",k.style.margin="0",k.style.width=Z.width+"px"}p.current={kind:"text",cls:b,el:k,startX:S.clientX,startY:S.clientY,startDeviceTop:0,startDeviceOffsetX:0,offsetX:N.x-le,offsetY:N.y-Z.top,origWidth:ne,scale:u},k.style.outline="2px dashed rgba(99,102,241,0.5)";const ie=re=>{const G=p.current;if(!G||G.kind!=="text")return;const w=x(re.clientX,re.clientY);G.el.style.top=w.y-G.offsetY+"px",G.el.style.left=w.x-G.offsetX+"px"},he=()=>{const re=p.current;if(!re||re.kind!=="text")return;re.el.style.outline="none";const G=Sh(re.el),w=Math.round(G.top/f*100*10)/10,ke=Math.round(G.left/d*100*10)/10,fe=Math.round(re.origWidth/d*100*10)/10;p.current=null,document.removeEventListener("mousemove",ie),document.removeEventListener("mouseup",he),y(re.cls,{x:ke,y:w,width:fe})};document.addEventListener("mousemove",ie),document.addEventListener("mouseup",he)}}},[i,u,x,$,h,y]),g=C.useCallback((S,N)=>{const _=x(S,N),k=$(_.x,_.y);return k?k.kind==="device"?"move":"grab":"default"},[x,$]);return{onOverlayMouseDown:L,getCursorForPosition:g}}function Eh(){const o=W(ne=>ne.screens),a=W(ne=>ne.selectedScreen),i=W(ne=>ne.setSelectedScreen),u=W(ne=>ne.addScreen),d=W(ne=>ne.removeScreen),f=W(ne=>ne.moveScreen),h=W(ne=>ne.previewW),y=W(ne=>ne.previewH),p=W(ne=>ne.previewBg),$=W(ne=>ne.renderVersion),x=W(ne=>ne.platform),L=W(ne=>ne.locale),g=W(ne=>ne.deviceFamilies),S=C.useRef(null),[N,_]=C.useState(.5),k=C.useCallback(()=>{const ne=S.current;if(!ne)return;const ie=48,he=16,re=56,G=ne.clientWidth-ie,w=ne.clientHeight-re-ie,ke=o.length+.5,fe=o.length*he,H=(G-fe)/(ke*h),ce=w/y;let Pe=Math.min(H,ce);Pe=Math.min(Pe,1.3),Pe=Math.max(Pe,.1),_(Pe)},[y,h,o.length]);C.useEffect(()=>(k(),window.addEventListener("resize",k),()=>window.removeEventListener("resize",k)),[k]);const b=p==="light"?"bg-gray-100":"bg-bg",[Z,U]=C.useState(null),le=Z??N;return l.jsxs("div",{ref:S,className:`flex-1 flex flex-col overflow-hidden ${b}`,children:[l.jsx("div",{className:"flex-1 overflow-auto",children:l.jsxs("div",{className:"flex items-center justify-center gap-4 p-6 min-w-min min-h-full",children:[o.map((ne,ie)=>l.jsx(Nh,{index:ie,selected:ie===a,previewW:h,previewH:y,scale:le,headline:ne.headline,canRemove:o.length>1,canMoveLeft:ie>0,canMoveRight:ie<o.length-1,onSelect:()=>i(ie),onRemove:()=>d(ie),onMoveLeft:()=>f(ie,ie-1),onMoveRight:()=>f(ie,ie+1),renderVersion:$,platform:x,locale:L,deviceFamilies:g},`screen-${ne.screenIndex}-${ie}`)),l.jsx("button",{className:"shrink-0 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-text-dim text-xs hover:border-accent hover:text-accent transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",style:{width:Math.round(h*le*.5),height:Math.round(y*le)},onClick:u,"aria-label":"Add a new frame",children:"+ Add Frame"})]})}),l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 border-t border-border bg-surface",children:[l.jsx("span",{className:"text-[10px] text-text-dim",children:"Zoom"}),l.jsx("input",{type:"range",min:10,max:150,value:Math.round((Z??N)*100),onChange:ne=>U(parseInt(ne.target.value,10)/100),className:"flex-1 h-1 accent-accent","aria-label":"Zoom level","aria-valuemin":10,"aria-valuemax":150,"aria-valuenow":Math.round((Z??N)*100),"aria-valuetext":`${Math.round((Z??N)*100)}%`}),l.jsxs("span",{className:"text-[10px] text-text-dim w-8 text-right",children:[Math.round((Z??N)*100),"%"]}),l.jsx("button",{className:`text-[10px] transition-opacity ${Z!==null?"text-text-dim hover:text-text":"text-text-dim/50 cursor-default"}`,onClick:()=>U(null),disabled:Z===null,"aria-label":"Reset zoom to fit",children:"Fit"})]})]})}function Nh({index:o,selected:a,previewW:i,previewH:u,scale:d,canRemove:f,canMoveLeft:h,canMoveRight:y,onSelect:p,onRemove:$,onMoveLeft:x,onMoveRight:L,renderVersion:g,platform:S,locale:N,deviceFamilies:_}){const k=C.useRef(null),b=C.useRef(null),{confirm:Z,dialog:U}=Ul(),[le,ne]=C.useState(!0),ie=C.useRef(null),he=C.useRef(null),re=W(M=>M.screens[o]),G=W(M=>M.sessionLocales[M.locale]),w=W(M=>M.updateScreen);C.useEffect(()=>(Yd(o,k.current),()=>Yd(o,null)),[o]);const ke=C.useCallback(M=>{w(o,M)},[o,w]),fe=C.useCallback((M,z)=>{const V={...(re==null?void 0:re.textPositions)??{headline:null,subtitle:null}};V[M]=z,w(o,{textPositions:V})},[o,re==null?void 0:re.textPositions,w]),{onOverlayMouseDown:H,getCursorForPosition:ce}=jh(k,b,re,d,i,u,ke,fe),[Pe,O]=C.useState("default"),je=C.useCallback(M=>{O(ce(M.clientX,M.clientY))},[ce]);return C.useEffect(()=>{if(re)return he.current&&clearTimeout(he.current),he.current=setTimeout(()=>{var V;(V=ie.current)==null||V.abort();const M=new AbortController;ie.current=M;const z=sh(re,S,i,u,N,G);jp(z,M.signal).then(I=>{const D=k.current;if(!D)return;const de=D.contentDocument;de?(de.open(),de.write(I),de.close()):D.srcdoc=I,ne(!1)}).catch(I=>{I instanceof DOMException&&I.name==="AbortError"||ne(!1)})},le?0:150),()=>{var M;he.current&&clearTimeout(he.current),(M=ie.current)==null||M.abort()}},[re,g,S,i,u,N,G,_]),l.jsxs(l.Fragment,{children:[U,l.jsxs("div",{className:`shrink-0 cursor-pointer rounded-lg overflow-hidden transition-shadow ${a?"ring-2 ring-accent shadow-lg":"hover:ring-1 hover:ring-border"}`,onClick:p,children:[l.jsxs("div",{className:"flex items-center justify-between px-2 py-1 bg-surface text-[10px]",children:[h?l.jsx("button",{className:"text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:M=>{M.stopPropagation(),x()},title:"Move left","aria-label":`Move frame ${o+1} left`,children:"‹"}):l.jsx("span",{className:"w-4"}),l.jsxs("span",{className:"text-text-dim font-medium",children:["Frame ",o+1]}),l.jsxs("div",{className:"flex items-center gap-0.5",children:[y&&l.jsx("button",{className:"text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:M=>{M.stopPropagation(),L()},title:"Move right","aria-label":`Move frame ${o+1} right`,children:"›"}),f&&l.jsx("button",{className:"text-text-dim hover:text-red-400 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",onClick:async M=>{M.stopPropagation(),await Z({title:"Remove Frame",message:`Remove Frame ${o+1}? This cannot be undone.`})&&$()},title:"Remove frame","aria-label":`Remove frame ${o+1}`,children:"×"})]})]}),l.jsxs("div",{ref:b,className:"relative overflow-hidden",style:{width:i*d,height:u*d},children:[le&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-bg z-20",children:l.jsx("div",{className:"w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),l.jsx("iframe",{ref:k,className:"border-none block origin-top-left",style:{width:i,height:u,transform:`scale(${d})`},title:`Frame ${o+1}`}),l.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:Pe},onMouseDown:H,onMouseMove:je})]})]})]})}function Ph(){const o=C.useRef(null),a=C.useRef(null),i=C.useRef(null),u=C.useRef(null),d=C.useRef(null),f=W(z=>z.config),h=W(z=>z.previewW),y=W(z=>z.previewH),p=W(z=>z.previewBg),$=W(z=>z.locale),x=W(z=>z.sessionLocales[z.locale]),L=W(z=>z.renderVersion),g=W(z=>z.panoramicFrameCount),S=W(z=>z.panoramicBackground),N=W(z=>z.panoramicElements),_=W(z=>z.panoramicEffects),k=W(z=>z.selectedElementIndex),b=W(z=>z.setSelectedElement),Z=W(z=>z.updatePanoramicElement),[U,le]=C.useState(.3),[ne,ie]=C.useState(!0),[he,re]=C.useState(!1),G=C.useRef(null);C.useEffect(()=>(Zd(o.current),()=>Zd(null)),[]);const w=h*g,ke=C.useCallback(()=>{const z=a.current;if(!z)return;const V=z.clientWidth-48,I=z.clientHeight-120,D=V/w,de=I/y;let pe=Math.min(D,de);pe=Math.min(pe,1),pe=Math.max(pe,.05),le(pe)},[w,y]);C.useEffect(()=>(ke(),window.addEventListener("resize",ke),()=>window.removeEventListener("resize",ke)),[ke]),C.useEffect(()=>{if(f)return d.current&&clearTimeout(d.current),d.current=setTimeout(()=>{var I;(I=u.current)==null||I.abort();const z=new AbortController;u.current=z;const V={locale:$,localeConfig:x,frameCount:g,frameWidth:h,frameHeight:y,background:S,elements:N,font:f.theme.font,fontWeight:f.theme.fontWeight,frameStyle:f.frames.style,effects:_};Ip(V,z.signal).then(D=>{const de=o.current;if(!de)return;const pe=de.contentDocument;pe&&(pe.open(),pe.write(D),pe.close()),ie(!1)}).catch(D=>{D instanceof DOMException&&D.name==="AbortError"||(console.error("[PanoramicPreview] fetch failed:",D),ie(!1))})},ne?0:200),()=>{var z;d.current&&clearTimeout(d.current),(z=u.current)==null||z.abort()}},[f,$,x,g,h,y,S,N,_,L]);const fe=C.useCallback((z,V)=>{const I=i.current;if(!I)return null;const D=I.getBoundingClientRect(),de=(z-D.left)/(w*U)*100,pe=(V-D.top)/(y*U)*100;return{x:de,y:pe}},[w,y,U]),H=C.useCallback((z,V)=>{const I=fe(z,V);if(!I)return null;let D=null,de=-1;for(let pe=0;pe<N.length;pe++){const se=N[pe];let Ee,Be;se.type==="device"?(Ee=se.width,Be=se.width/100*w*2.1/y*100):se.type==="image"?(Ee=se.width,Be=se.height):se.type==="text"?(Ee=se.maxWidth||15,Be=se.fontSize/100*y*2/y*100):se.type==="decoration"?(Ee=se.width,Be=se.height?se.height/100*y/y*100:Ee*w/y):(Ee=10,Be=5),I.x>=se.x&&I.x<=se.x+Ee&&I.y>=se.y&&I.y<=se.y+Be&&se.z>de&&(de=se.z,D=pe)}return D},[N,fe,w,y]),ce=C.useCallback(z=>{if(!fe(z.clientX,z.clientY))return;const I=H(z.clientX,z.clientY);if(I!==null){b(I);const D=N[I];G.current={elementIndex:I,startX:z.clientX,startY:z.clientY,origX:D.x,origY:D.y},re(!0),z.preventDefault()}},[fe,H,N,b]);C.useEffect(()=>{const z=I=>{const D=G.current;if(!D)return;const de=(I.clientX-D.startX)/U,pe=(I.clientY-D.startY)/U,se=o.current,Ee=se==null?void 0:se.contentDocument;if(Ee){const We=[...N].map((nt,wt)=>({z:nt.z,i:wt})).sort((nt,wt)=>nt.z-wt.z).findIndex(nt=>nt.i===D.elementIndex),Ue=Ee.querySelector(`[data-index="${We}"]`);if(Ue){const nt=N[D.elementIndex],wt="rotation"in nt&&nt.rotation?nt.rotation:0;Ue.style.filter="none",Ue.style.transform=`translate(${de}px, ${pe}px) rotate(${wt}deg)`}}},V=I=>{const D=G.current;if(!D)return;const de=(I.clientX-D.startX)/(w*U)*100,pe=(I.clientY-D.startY)/(y*U)*100,se=Math.round((D.origX+de)*2)/2,Ee=Math.round((D.origY+pe)*2)/2;Z(D.elementIndex,{x:se,y:Ee}),G.current=null,re(!1)};return window.addEventListener("mousemove",z),window.addEventListener("mouseup",V),()=>{window.removeEventListener("mousemove",z),window.removeEventListener("mouseup",V)}},[w,y,U,N,Z]),C.useEffect(()=>{const z=V=>{var Ee;if(k===null)return;const I=(Ee=V.target)==null?void 0:Ee.tagName;if(I==="INPUT"||I==="TEXTAREA"||I==="SELECT")return;const D=V.shiftKey?5:.5;let de=0,pe=0;if(V.key==="ArrowLeft")de=-D;else if(V.key==="ArrowRight")de=D;else if(V.key==="ArrowUp")pe=-D;else if(V.key==="ArrowDown")pe=D;else return;V.preventDefault();const se=N[k];se&&Z(k,{x:Math.round((se.x+de)*2)/2,y:Math.round((se.y+pe)*2)/2})};return window.addEventListener("keydown",z),()=>window.removeEventListener("keydown",z)},[k,N,Z]);const[Pe,O]=C.useState("default"),je=C.useCallback(z=>{if(he)return;const V=H(z.clientX,z.clientY);O(V!==null?"grab":"default")},[he,H]),M=p==="light"?"bg-gray-100":"bg-bg";return l.jsxs("div",{ref:a,className:`flex-1 flex flex-col overflow-hidden ${M}`,children:[l.jsx("div",{className:"flex-1 overflow-auto",children:l.jsx("div",{className:"flex items-center justify-center p-6 min-h-full min-w-min",children:l.jsxs("div",{className:"relative w-fit",children:[ne&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center z-20",children:l.jsx("div",{className:"w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"})}),l.jsx("div",{className:"flex mb-1",style:{width:w*U},children:Array.from({length:g},(z,V)=>l.jsxs("div",{className:"text-[9px] text-text-dim text-center border-x border-border/30",style:{width:h*U},children:["Frame ",V+1]},V))}),l.jsxs("div",{ref:i,className:"relative overflow-hidden rounded border border-border/30",style:{width:w*U,height:y*U},children:[l.jsx("iframe",{ref:o,className:"border-none block origin-top-left",style:{width:w,height:y,transform:`scale(${U})`},title:"Panoramic Preview"}),l.jsx("div",{className:"absolute inset-0 z-10",style:{cursor:he?"grabbing":Pe},onMouseDown:ce,onMouseMove:je})]})]})})}),l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 border-t border-border bg-surface",children:[l.jsx("span",{className:"text-[10px] text-text-dim",children:"Zoom"}),l.jsx("input",{type:"range",min:5,max:100,value:Math.round(U*100),onChange:z=>le(parseInt(z.target.value,10)/100),className:"flex-1 h-1 accent-accent","aria-label":"Zoom level","aria-valuemin":5,"aria-valuemax":100,"aria-valuenow":Math.round(U*100),"aria-valuetext":`${Math.round(U*100)}%`}),l.jsxs("span",{className:"text-[10px] text-text-dim w-8 text-right",children:[Math.round(U*100),"%"]}),l.jsx("button",{className:"text-[10px] text-text-dim hover:text-text transition-opacity",onClick:ke,"aria-label":"Reset zoom to fit",children:"Fit"}),k!==null&&l.jsx("span",{className:"ml-auto text-[9px] text-text-dim border-l border-border pl-2",title:"Use arrow keys to nudge selected element. Hold Shift for larger steps.",children:"Arrow keys to nudge"})]})]})}var qd=pf(),Lh=`svg[fill=none] {
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
}`,Ih={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let o=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");o||(o=document.createElement("style"),o.id="feedback-tool-styles-annotation-popup-css-styles",o.textContent=Lh,document.head.appendChild(o))}var rt=Ih,Th=({size:o=16})=>l.jsx("svg",{width:o,height:o,viewBox:"0 0 16 16",fill:"none",children:l.jsx("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),Rh=({size:o=16})=>l.jsx("svg",{width:o,height:o,viewBox:"0 0 16 16",fill:"none",children:l.jsx("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),$h=({size:o=24,style:a={}})=>l.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",style:a,children:[l.jsxs("g",{clipPath:"url(#clip0_list_sparkle)",children:[l.jsx("path",{d:"M11.5 12L5.5 12",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M18.5 6.75L5.5 6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M9.25 17.25L5.5 17.25",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})]}),l.jsx("defs",{children:l.jsx("clipPath",{id:"clip0_list_sparkle",children:l.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),Vr=({size:o=20})=>l.jsxs("svg",{width:o,height:o,viewBox:"0 0 20 20",fill:"none",children:[l.jsx("circle",{cx:"10",cy:"10.5",r:"5.25",stroke:"currentColor",strokeWidth:"1.25"}),l.jsx("path",{d:"M8.5 8.75C8.5 7.92 9.17 7.25 10 7.25C10.83 7.25 11.5 7.92 11.5 8.75C11.5 9.58 10.83 10.25 10 10.25V11",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("circle",{cx:"10",cy:"13",r:"0.75",fill:"currentColor"})]}),ef=({size:o=14})=>l.jsxs("svg",{width:o,height:o,viewBox:"0 0 14 14",fill:"none",children:[l.jsx("style",{children:`
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
    `}),l.jsx("path",{className:"check-path-animated",d:"M3.9375 7L6.125 9.1875L10.5 4.8125",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),Mh=({size:o=24,copied:a=!1})=>l.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .copy-icon, .check-icon {
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
    `}),l.jsxs("g",{className:"copy-icon",style:{opacity:a?0:1,transform:a?"scale(0.8)":"scale(1)",transformOrigin:"center"},children:[l.jsx("path",{d:"M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",stroke:"currentColor",strokeWidth:"1.5"}),l.jsx("path",{d:"M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),l.jsxs("g",{className:"check-icon",style:{opacity:a?1:0,transform:a?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})]}),zh=({size:o=24,state:a="idle"})=>{const i=a==="idle",u=a==="sent",d=a==="failed",f=a==="sending";return l.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
        .send-arrow-icon, .send-check-icon, .send-error-icon {
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
      `}),l.jsx("g",{className:"send-arrow-icon",style:{opacity:i?1:f?.5:0,transform:i?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:l.jsx("path",{d:"M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),l.jsxs("g",{className:"send-check-icon",style:{opacity:u?1:0,transform:u?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsxs("g",{className:"send-error-icon",style:{opacity:d?1:0,transform:d?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[l.jsx("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M12 8V12",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round"}),l.jsx("circle",{cx:"12",cy:"15",r:"0.5",fill:"#ef4444",stroke:"#ef4444",strokeWidth:"1"})]})]})},Oh=({size:o=24,isOpen:a=!0})=>l.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .eye-open, .eye-closed {
        transition: opacity 0.2s ease;
      }
    `}),l.jsxs("g",{className:"eye-open",style:{opacity:a?1:0},children:[l.jsx("path",{d:"M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsxs("g",{className:"eye-closed",style:{opacity:a?0:1},children:[l.jsx("path",{d:"M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",fill:"currentColor"}),l.jsx("path",{d:"M5 19L19 5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})]}),Fh=({size:o=24,isPaused:a=!1})=>l.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("style",{children:`
      .pause-bar, .play-triangle {
        transition: opacity 0.15s ease;
      }
    `}),l.jsx("path",{className:"pause-bar",d:"M8 6L8 18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:a?0:1}}),l.jsx("path",{className:"pause-bar",d:"M16 18L16 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:a?0:1}}),l.jsx("path",{className:"play-triangle",d:"M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",stroke:"currentColor",strokeWidth:"1.5",style:{opacity:a?1:0}})]}),Dh=({size:o=16})=>l.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",children:[l.jsx("path",{d:"M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("circle",{cx:"12",cy:"12",r:"2.5",stroke:"currentColor",strokeWidth:"1.5"})]}),Ah=({size:o=16})=>l.jsx("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",children:l.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Ji=({size:o=16})=>l.jsxs("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",children:[l.jsxs("g",{clipPath:"url(#clip0_2_53)",children:[l.jsx("path",{d:"M16.25 16.25L7.75 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M7.75 16.25L16.25 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),l.jsx("defs",{children:l.jsx("clipPath",{id:"clip0_2_53",children:l.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),Bh=({size:o=24})=>l.jsx("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",children:l.jsx("path",{d:"M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z",fill:"currentColor"})}),Wh=({size:o=16})=>l.jsxs("svg",{width:o,height:o,viewBox:"0 0 20 20",fill:"none",children:[l.jsx("path",{d:"M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M10 3.9585V5.05698",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M10 14.9429V16.0414",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M5.7269 5.72656L6.50682 6.50649",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M13.4932 13.4932L14.2731 14.2731",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M3.95834 10H5.05683",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M14.9432 10H16.0417",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M5.7269 14.2731L6.50682 13.4932",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),l.jsx("path",{d:"M13.4932 6.50649L14.2731 5.72656",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"})]}),Yh=({size:o=16})=>l.jsx("svg",{width:o,height:o,viewBox:"0 0 20 20",fill:"none",children:l.jsx("path",{d:"M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z",stroke:"currentColor",strokeWidth:"1.13793",strokeLinecap:"round",strokeLinejoin:"round"})}),tf=({size:o=16})=>l.jsx("svg",{width:o,height:o,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375",stroke:"currentColor",strokeWidth:"0.9",strokeLinecap:"round",strokeLinejoin:"round"})}),Hh=({size:o=24})=>l.jsx("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Vh=({size:o=16})=>l.jsx("svg",{width:o,height:o,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M8.5 3.5L4 8L8.5 12.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),Ef=["data-feedback-toolbar","data-annotation-popup","data-annotation-marker"],qi=Ef.flatMap(o=>[`:not([${o}])`,`:not([${o}] *)`]).join(""),ic="feedback-freeze-styles",ec="__agentation_freeze";function Uh(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:a=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const o=window;return o[ec]||(o[ec]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),o[ec]}var He=Uh();typeof window<"u"&&!He.installed&&(He.origSetTimeout=window.setTimeout.bind(window),He.origSetInterval=window.setInterval.bind(window),He.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(o,a,...i)=>typeof o=="string"?He.origSetTimeout(o,a):He.origSetTimeout((...u)=>{He.frozen?He.frozenTimeoutQueue.push(()=>o(...u)):o(...u)},a,...i),window.setInterval=(o,a,...i)=>typeof o=="string"?He.origSetInterval(o,a):He.origSetInterval((...u)=>{He.frozen||o(...u)},a,...i),window.requestAnimationFrame=o=>He.origRAF(a=>{He.frozen?He.frozenRAFQueue.push(o):o(a)}),He.installed=!0);var Xe=He.origSetTimeout,Xh=He.origSetInterval;function Qh(o){return o?Ef.some(a=>{var i;return!!((i=o.closest)!=null&&i.call(o,`[${a}]`))}):!1}function Gh(){if(typeof document>"u"||He.frozen)return;He.frozen=!0,He.frozenTimeoutQueue=[],He.frozenRAFQueue=[];let o=document.getElementById(ic);o||(o=document.createElement("style"),o.id=ic),o.textContent=`
    *${qi},
    *${qi}::before,
    *${qi}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `,document.head.appendChild(o),He.pausedAnimations=[];try{document.getAnimations().forEach(a=>{var u;if(a.playState!=="running")return;const i=(u=a.effect)==null?void 0:u.target;Qh(i)||(a.pause(),He.pausedAnimations.push(a))})}catch{}document.querySelectorAll("video").forEach(a=>{a.paused||(a.dataset.wasPaused="false",a.pause())})}function nf(){var i;if(typeof document>"u"||!He.frozen)return;He.frozen=!1;const o=He.frozenTimeoutQueue;He.frozenTimeoutQueue=[];for(const u of o)He.origSetTimeout(()=>{if(He.frozen){He.frozenTimeoutQueue.push(u);return}try{u()}catch(d){console.warn("[agentation] Error replaying queued timeout:",d)}},0);const a=He.frozenRAFQueue;He.frozenRAFQueue=[];for(const u of a)He.origRAF(d=>{if(He.frozen){He.frozenRAFQueue.push(u);return}u(d)});for(const u of He.pausedAnimations)try{u.play()}catch(d){console.warn("[agentation] Error resuming animation:",d)}He.pausedAnimations=[],(i=document.getElementById(ic))==null||i.remove(),document.querySelectorAll("video").forEach(u=>{u.dataset.wasPaused==="false"&&(u.play().catch(()=>{}),delete u.dataset.wasPaused)})}var of=C.forwardRef(function({element:a,timestamp:i,selectedText:u,placeholder:d="What should change?",initialValue:f="",submitLabel:h="Add",onSubmit:y,onCancel:p,onDelete:$,style:x,accentColor:L="#3c82f7",isExiting:g=!1,lightMode:S=!1,computedStyles:N},_){const[k,b]=C.useState(f),[Z,U]=C.useState(!1),[le,ne]=C.useState("initial"),[ie,he]=C.useState(!1),[re,G]=C.useState(!1),w=C.useRef(null),ke=C.useRef(null),fe=C.useRef(null),H=C.useRef(null);C.useEffect(()=>{g&&le!=="exit"&&ne("exit")},[g,le]),C.useEffect(()=>{Xe(()=>{ne("enter")},0);const z=Xe(()=>{ne("entered")},200),V=Xe(()=>{const I=w.current;I&&(I.focus(),I.selectionStart=I.selectionEnd=I.value.length,I.scrollTop=I.scrollHeight)},50);return()=>{clearTimeout(z),clearTimeout(V),fe.current&&clearTimeout(fe.current),H.current&&clearTimeout(H.current)}},[]);const ce=C.useCallback(()=>{H.current&&clearTimeout(H.current),U(!0),H.current=Xe(()=>{var z;U(!1),(z=w.current)==null||z.focus()},250)},[]);C.useImperativeHandle(_,()=>({shake:ce}),[ce]);const Pe=C.useCallback(()=>{ne("exit"),fe.current=Xe(()=>{p()},150)},[p]),O=C.useCallback(()=>{k.trim()&&y(k.trim())},[k,y]),je=C.useCallback(z=>{z.stopPropagation(),!z.nativeEvent.isComposing&&(z.key==="Enter"&&!z.shiftKey&&(z.preventDefault(),O()),z.key==="Escape"&&Pe())},[O,Pe]),M=[rt.popup,S?rt.light:"",le==="enter"?rt.enter:"",le==="entered"?rt.entered:"",le==="exit"?rt.exit:"",Z?rt.shake:""].filter(Boolean).join(" ");return l.jsxs("div",{ref:ke,className:M,"data-annotation-popup":!0,style:x,onClick:z=>z.stopPropagation(),children:[l.jsxs("div",{className:rt.header,children:[N&&Object.keys(N).length>0?l.jsxs("button",{className:rt.headerToggle,onClick:()=>{const z=re;G(!re),z&&Xe(()=>{var V;return(V=w.current)==null?void 0:V.focus()},0)},type:"button",children:[l.jsx("svg",{className:`${rt.chevron} ${re?rt.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),l.jsx("span",{className:rt.element,children:a})]}):l.jsx("span",{className:rt.element,children:a}),i&&l.jsx("span",{className:rt.timestamp,children:i})]}),N&&Object.keys(N).length>0&&l.jsx("div",{className:`${rt.stylesWrapper} ${re?rt.expanded:""}`,children:l.jsx("div",{className:rt.stylesInner,children:l.jsx("div",{className:rt.stylesBlock,children:Object.entries(N).map(([z,V])=>l.jsxs("div",{className:rt.styleLine,children:[l.jsx("span",{className:rt.styleProperty,children:z.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",l.jsx("span",{className:rt.styleValue,children:V}),";"]},z))})})}),u&&l.jsxs("div",{className:rt.quote,children:["“",u.slice(0,80),u.length>80?"...":"","”"]}),l.jsx("textarea",{ref:w,className:rt.textarea,style:{borderColor:ie?L:void 0},placeholder:d,value:k,onChange:z=>b(z.target.value),onFocus:()=>he(!0),onBlur:()=>he(!1),rows:2,onKeyDown:je}),l.jsxs("div",{className:rt.actions,children:[$&&l.jsx("div",{className:rt.deleteWrapper,children:l.jsx("button",{className:rt.deleteButton,onClick:$,type:"button",children:l.jsx(Hh,{size:22})})}),l.jsx("button",{className:rt.cancel,onClick:Pe,children:"Cancel"}),l.jsx("button",{className:rt.submit,style:{backgroundColor:L,opacity:k.trim()?1:.4},onClick:O,disabled:!k.trim(),children:h})]})]})});function Gr(o){if(o.parentElement)return o.parentElement;const a=o.getRootNode();return a instanceof ShadowRoot?a.host:null}function rn(o,a){let i=o;for(;i;){if(i.matches(a))return i;i=Gr(i)}return null}function Kh(o,a=4){const i=[];let u=o,d=0;for(;u&&d<a;){const f=u.tagName.toLowerCase();if(f==="html"||f==="body")break;let h=f;if(u.id)h=`#${u.id}`;else if(u.className&&typeof u.className=="string"){const p=u.className.split(/\s+/).find($=>$.length>2&&!$.match(/^[a-z]{1,2}$/)&&!$.match(/[A-Z0-9]{5,}/));p&&(h=`.${p.split("_")[0]}`)}const y=Gr(u);!u.parentElement&&y&&(h=`⟨shadow⟩ ${h}`),i.unshift(h),u=y,d++}return i.join(" > ")}function fa(o){var u,d,f,h,y,p,$,x;const a=Kh(o);if(o.dataset.element)return{name:o.dataset.element,path:a};const i=o.tagName.toLowerCase();if(["path","circle","rect","line","g"].includes(i)){const L=rn(o,"svg");if(L){const g=Gr(L);if(g instanceof HTMLElement)return{name:`graphic in ${fa(g).name}`,path:a}}return{name:"graphic element",path:a}}if(i==="svg"){const L=Gr(o);if((L==null?void 0:L.tagName.toLowerCase())==="button"){const g=(u=L.textContent)==null?void 0:u.trim();return{name:g?`icon in "${g}" button`:"button icon",path:a}}return{name:"icon",path:a}}if(i==="button"){const L=(d=o.textContent)==null?void 0:d.trim(),g=o.getAttribute("aria-label");return g?{name:`button [${g}]`,path:a}:{name:L?`button "${L.slice(0,25)}"`:"button",path:a}}if(i==="a"){const L=(f=o.textContent)==null?void 0:f.trim(),g=o.getAttribute("href");return L?{name:`link "${L.slice(0,25)}"`,path:a}:g?{name:`link to ${g.slice(0,30)}`,path:a}:{name:"link",path:a}}if(i==="input"){const L=o.getAttribute("type")||"text",g=o.getAttribute("placeholder"),S=o.getAttribute("name");return g?{name:`input "${g}"`,path:a}:S?{name:`input [${S}]`,path:a}:{name:`${L} input`,path:a}}if(["h1","h2","h3","h4","h5","h6"].includes(i)){const L=(h=o.textContent)==null?void 0:h.trim();return{name:L?`${i} "${L.slice(0,35)}"`:i,path:a}}if(i==="p"){const L=(y=o.textContent)==null?void 0:y.trim();return L?{name:`paragraph: "${L.slice(0,40)}${L.length>40?"...":""}"`,path:a}:{name:"paragraph",path:a}}if(i==="span"||i==="label"){const L=(p=o.textContent)==null?void 0:p.trim();return L&&L.length<40?{name:`"${L}"`,path:a}:{name:i,path:a}}if(i==="li"){const L=($=o.textContent)==null?void 0:$.trim();return L&&L.length<40?{name:`list item: "${L.slice(0,35)}"`,path:a}:{name:"list item",path:a}}if(i==="blockquote")return{name:"blockquote",path:a};if(i==="code"){const L=(x=o.textContent)==null?void 0:x.trim();return L&&L.length<30?{name:`code: \`${L}\``,path:a}:{name:"code",path:a}}if(i==="pre")return{name:"code block",path:a};if(i==="img"){const L=o.getAttribute("alt");return{name:L?`image "${L.slice(0,30)}"`:"image",path:a}}if(i==="video")return{name:"video",path:a};if(["div","section","article","nav","header","footer","aside","main"].includes(i)){const L=o.className,g=o.getAttribute("role"),S=o.getAttribute("aria-label");if(S)return{name:`${i} [${S}]`,path:a};if(g)return{name:`${g}`,path:a};if(typeof L=="string"&&L){const N=L.split(/[\s_-]+/).map(_=>_.replace(/[A-Z0-9]{5,}.*$/,"")).filter(_=>_.length>2&&!/^[a-z]{1,2}$/.test(_)).slice(0,2);if(N.length>0)return{name:N.join(" "),path:a}}return{name:i==="div"?"container":i,path:a}}return{name:i,path:a}}function zl(o){var f,h,y;const a=[],i=(f=o.textContent)==null?void 0:f.trim();i&&i.length<100&&a.push(i);const u=o.previousElementSibling;if(u){const p=(h=u.textContent)==null?void 0:h.trim();p&&p.length<50&&a.unshift(`[before: "${p.slice(0,40)}"]`)}const d=o.nextElementSibling;if(d){const p=(y=d.textContent)==null?void 0:y.trim();p&&p.length<50&&a.push(`[after: "${p.slice(0,40)}"]`)}return a.join(" ")}function ta(o){const a=Gr(o);if(!a)return"";const d=(o.getRootNode()instanceof ShadowRoot&&o.parentElement?Array.from(o.parentElement.children):Array.from(a.children)).filter(x=>x!==o&&x instanceof HTMLElement);if(d.length===0)return"";const f=d.slice(0,4).map(x=>{var N;const L=x.tagName.toLowerCase(),g=x.className;let S="";if(typeof g=="string"&&g){const _=g.split(/\s+/).map(k=>k.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(k=>k.length>2&&!/^[a-z]{1,2}$/.test(k));_&&(S=`.${_}`)}if(L==="button"||L==="a"){const _=(N=x.textContent)==null?void 0:N.trim().slice(0,15);if(_)return`${L}${S} "${_}"`}return`${L}${S}`});let y=a.tagName.toLowerCase();if(typeof a.className=="string"&&a.className){const x=a.className.split(/\s+/).map(L=>L.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(L=>L.length>2&&!/^[a-z]{1,2}$/.test(L));x&&(y=`.${x}`)}const p=a.children.length,$=p>f.length+1?` (${p} total in ${y})`:"";return f.join(", ")+$}function Ol(o){const a=o.className;return typeof a!="string"||!a?"":a.split(/\s+/).filter(u=>u.length>0).map(u=>{const d=u.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);return d?d[1]:u}).filter((u,d,f)=>f.indexOf(u)===d).join(", ")}var Nf=new Set(["none","normal","auto","0px","rgba(0, 0, 0, 0)","transparent","static","visible"]),Zh=new Set(["p","span","h1","h2","h3","h4","h5","h6","label","li","td","th","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","a","time","cite","q"]),Jh=new Set(["input","textarea","select"]),qh=new Set(["img","video","canvas","svg"]),e_=new Set(["div","section","article","nav","header","footer","aside","main","ul","ol","form","fieldset"]);function na(o){if(typeof window>"u")return{};const a=window.getComputedStyle(o),i={},u=o.tagName.toLowerCase();let d;Zh.has(u)?d=["color","fontSize","fontWeight","fontFamily","lineHeight"]:u==="button"||u==="a"&&o.getAttribute("role")==="button"?d=["backgroundColor","color","padding","borderRadius","fontSize"]:Jh.has(u)?d=["backgroundColor","color","padding","borderRadius","fontSize"]:qh.has(u)?d=["width","height","objectFit","borderRadius"]:e_.has(u)?d=["display","padding","margin","gap","backgroundColor"]:d=["color","fontSize","margin","padding","backgroundColor"];for(const f of d){const h=f.replace(/([A-Z])/g,"-$1").toLowerCase(),y=a.getPropertyValue(h);y&&!Nf.has(y)&&(i[f]=y)}return i}var t_=["color","backgroundColor","borderColor","fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","textAlign","width","height","padding","margin","border","borderRadius","display","position","top","right","bottom","left","zIndex","flexDirection","justifyContent","alignItems","gap","opacity","visibility","overflow","boxShadow","transform"];function oa(o){if(typeof window>"u")return"";const a=window.getComputedStyle(o),i=[];for(const u of t_){const d=u.replace(/([A-Z])/g,"-$1").toLowerCase(),f=a.getPropertyValue(d);f&&!Nf.has(f)&&i.push(`${d}: ${f}`)}return i.join("; ")}function n_(o){if(!o)return;const a={},i=o.split(";").map(u=>u.trim()).filter(Boolean);for(const u of i){const d=u.indexOf(":");if(d>0){const f=u.slice(0,d).trim(),h=u.slice(d+1).trim();f&&h&&(a[f]=h)}}return Object.keys(a).length>0?a:void 0}function ra(o){const a=[],i=o.getAttribute("role"),u=o.getAttribute("aria-label"),d=o.getAttribute("aria-describedby"),f=o.getAttribute("tabindex"),h=o.getAttribute("aria-hidden");return i&&a.push(`role="${i}"`),u&&a.push(`aria-label="${u}"`),d&&a.push(`aria-describedby="${d}"`),f&&a.push(`tabindex=${f}`),h==="true"&&a.push("aria-hidden"),o.matches("a, button, input, select, textarea, [tabindex]")&&a.push("focusable"),a.join(", ")}function la(o){const a=[];let i=o;for(;i&&i.tagName.toLowerCase()!=="html";){const u=i.tagName.toLowerCase();let d=u;if(i.id)d=`${u}#${i.id}`;else if(i.className&&typeof i.className=="string"){const h=i.className.split(/\s+/).map(y=>y.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(y=>y.length>2);h&&(d=`${u}.${h}`)}const f=Gr(i);!i.parentElement&&f&&(d=`⟨shadow⟩ ${d}`),a.unshift(d),i=f}return a.join(" > ")}var cc="feedback-annotations-",Pf=7;function ma(o){return`${cc}${o}`}function tc(o){if(typeof window>"u")return[];try{const a=localStorage.getItem(ma(o));if(!a)return[];const i=JSON.parse(a),u=Date.now()-Pf*24*60*60*1e3;return i.filter(d=>!d.timestamp||d.timestamp>u)}catch{return[]}}function Lf(o,a){if(!(typeof window>"u"))try{localStorage.setItem(ma(o),JSON.stringify(a))}catch{}}function o_(){const o=new Map;if(typeof window>"u")return o;try{const a=Date.now()-Pf*24*60*60*1e3;for(let i=0;i<localStorage.length;i++){const u=localStorage.key(i);if(u!=null&&u.startsWith(cc)){const d=u.slice(cc.length),f=localStorage.getItem(u);if(f){const y=JSON.parse(f).filter(p=>!p.timestamp||p.timestamp>a);y.length>0&&o.set(d,y)}}}}catch{}return o}function Fl(o,a,i){const u=a.map(d=>({...d,_syncedTo:i}));Lf(o,u)}var If="agentation-session-";function hc(o){return`${If}${o}`}function r_(o){if(typeof window>"u")return null;try{return localStorage.getItem(hc(o))}catch{return null}}function nc(o,a){if(!(typeof window>"u"))try{localStorage.setItem(hc(o),a)}catch{}}function l_(o){if(!(typeof window>"u"))try{localStorage.removeItem(hc(o))}catch{}}var Tf=`${If}toolbar-hidden`;function s_(){if(typeof window>"u")return!1;try{return sessionStorage.getItem(Tf)==="1"}catch{return!1}}function a_(o){if(!(typeof window>"u"))try{o&&sessionStorage.setItem(Tf,"1")}catch{}}async function oc(o,a){const i=await fetch(`${o}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:a})});if(!i.ok)throw new Error(`Failed to create session: ${i.status}`);return i.json()}async function rf(o,a){const i=await fetch(`${o}/sessions/${a}`);if(!i.ok)throw new Error(`Failed to get session: ${i.status}`);return i.json()}async function sa(o,a,i){const u=await fetch(`${o}/sessions/${a}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!u.ok)throw new Error(`Failed to sync annotation: ${u.status}`);return u.json()}async function i_(o,a,i){const u=await fetch(`${o}/annotations/${a}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!u.ok)throw new Error(`Failed to update annotation: ${u.status}`);return u.json()}async function lf(o,a){const i=await fetch(`${o}/annotations/${a}`,{method:"DELETE"});if(!i.ok)throw new Error(`Failed to delete annotation: ${i.status}`)}var Je={FunctionComponent:0,ClassComponent:1,IndeterminateComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,Fragment:7,Mode:8,ContextConsumer:9,ContextProvider:10,ForwardRef:11,Profiler:12,SuspenseComponent:13,MemoComponent:14,SimpleMemoComponent:15,LazyComponent:16,IncompleteClassComponent:17,DehydratedFragment:18,SuspenseListComponent:19,ScopeComponent:21,OffscreenComponent:22,LegacyHiddenComponent:23,CacheComponent:24,TracingMarkerComponent:25,HostHoistable:26,HostSingleton:27,IncompleteFunctionComponent:28,Throw:29,ViewTransitionComponent:30,ActivityComponent:31},sf=new Set(["Component","PureComponent","Fragment","Suspense","Profiler","StrictMode","Routes","Route","Outlet","Root","ErrorBoundaryHandler","HotReload","Hot"]),af=[/Boundary$/,/BoundaryHandler$/,/Provider$/,/Consumer$/,/^(Inner|Outer)/,/Router$/,/^Client(Page|Segment|Root)/,/^Server(Root|Component|Render)/,/^RSC/,/Context$/,/^Hot(Reload)?$/,/^(Dev|React)(Overlay|Tools|Root)/,/Overlay$/,/Handler$/,/^With[A-Z]/,/Wrapper$/,/^Root$/],c_=[/Page$/,/View$/,/Screen$/,/Section$/,/Card$/,/List$/,/Item$/,/Form$/,/Modal$/,/Dialog$/,/Button$/,/Nav$/,/Header$/,/Footer$/,/Layout$/,/Panel$/,/Tab$/,/Menu$/];function u_(o){const a=(o==null?void 0:o.mode)??"filtered";let i=sf;if(o!=null&&o.skipExact){const u=o.skipExact instanceof Set?o.skipExact:new Set(o.skipExact);i=new Set([...sf,...u])}return{maxComponents:(o==null?void 0:o.maxComponents)??6,maxDepth:(o==null?void 0:o.maxDepth)??30,mode:a,skipExact:i,skipPatterns:o!=null&&o.skipPatterns?[...af,...o.skipPatterns]:af,userPatterns:(o==null?void 0:o.userPatterns)??c_,filter:o==null?void 0:o.filter}}function d_(o){return o.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/([A-Z])([A-Z][a-z])/g,"$1-$2").toLowerCase()}function f_(o,a=10){const i=new Set;let u=o,d=0;for(;u&&d<a;)u.className&&typeof u.className=="string"&&u.className.split(/\s+/).forEach(f=>{if(f.length>1){const h=f.replace(/[_][a-zA-Z0-9]{5,}.*$/,"").toLowerCase();h.length>1&&i.add(h)}}),u=u.parentElement,d++;return i}function m_(o,a){const i=d_(o);for(const u of a){if(u===i)return!0;const d=i.split("-").filter(h=>h.length>2),f=u.split("-").filter(h=>h.length>2);for(const h of d)for(const y of f)if(h===y||h.includes(y)||y.includes(h))return!0}return!1}function p_(o,a,i,u){if(i.filter)return i.filter(o,a);switch(i.mode){case"all":return!0;case"filtered":return!(i.skipExact.has(o)||i.skipPatterns.some(d=>d.test(o)));case"smart":return i.skipExact.has(o)||i.skipPatterns.some(d=>d.test(o))?!1:!!(u&&m_(o,u)||i.userPatterns.some(d=>d.test(o)));default:return!0}}var Ur=null,h_=new WeakMap;function rc(o){return Object.keys(o).some(a=>a.startsWith("__reactFiber$")||a.startsWith("__reactInternalInstance$")||a.startsWith("__reactProps$"))}function __(){if(Ur!==null)return Ur;if(typeof document>"u")return!1;if(document.body&&rc(document.body))return Ur=!0,!0;const o=["#root","#app","#__next","[data-reactroot]"];for(const a of o){const i=document.querySelector(a);if(i&&rc(i))return Ur=!0,!0}if(document.body){for(const a of document.body.children)if(rc(a))return Ur=!0,!0}return Ur=!1,!1}var Dl={map:h_};function g_(o){return Object.keys(o).find(i=>i.startsWith("__reactFiber$")||i.startsWith("__reactInternalInstance$"))||null}function y_(o){const a=g_(o);return a?o[a]:null}function sr(o){return o?o.displayName?o.displayName:o.name?o.name:null:null}function x_(o){var d;const{tag:a,type:i,elementType:u}=o;if(a===Je.HostComponent||a===Je.HostText||a===Je.HostHoistable||a===Je.HostSingleton||a===Je.Fragment||a===Je.Mode||a===Je.Profiler||a===Je.DehydratedFragment||a===Je.HostRoot||a===Je.HostPortal||a===Je.ScopeComponent||a===Je.OffscreenComponent||a===Je.LegacyHiddenComponent||a===Je.CacheComponent||a===Je.TracingMarkerComponent||a===Je.Throw||a===Je.ViewTransitionComponent||a===Je.ActivityComponent)return null;if(a===Je.ForwardRef){const f=u;if(f!=null&&f.render){const h=sr(f.render);if(h)return h}return f!=null&&f.displayName?f.displayName:sr(i)}if(a===Je.MemoComponent||a===Je.SimpleMemoComponent){const f=u;if(f!=null&&f.type){const h=sr(f.type);if(h)return h}return f!=null&&f.displayName?f.displayName:sr(i)}if(a===Je.ContextProvider){const f=i;return(d=f==null?void 0:f._context)!=null&&d.displayName?`${f._context.displayName}.Provider`:null}if(a===Je.ContextConsumer){const f=i;return f!=null&&f.displayName?`${f.displayName}.Consumer`:null}if(a===Je.LazyComponent){const f=u;return(f==null?void 0:f._status)===1&&f._result?sr(f._result):null}return a===Je.SuspenseComponent||a===Je.SuspenseListComponent?null:a===Je.IncompleteClassComponent||a===Je.IncompleteFunctionComponent||a===Je.FunctionComponent||a===Je.ClassComponent||a===Je.IndeterminateComponent?sr(i):null}function v_(o){return o.length<=2||o.length<=3&&o===o.toLowerCase()}function b_(o,a){const i=u_(a),u=i.mode==="all";if(u){const p=Dl.map.get(o);if(p!==void 0)return p}if(!__()){const p={path:null,components:[]};return u&&Dl.map.set(o,p),p}const d=i.mode==="smart"?f_(o):void 0,f=[];try{let p=y_(o),$=0;for(;p&&$<i.maxDepth&&f.length<i.maxComponents;){const x=x_(p);x&&!v_(x)&&p_(x,$,i,d)&&f.push(x),p=p.return,$++}}catch{const p={path:null,components:[]};return u&&Dl.map.set(o,p),p}if(f.length===0){const p={path:null,components:[]};return u&&Dl.map.set(o,p),p}const y={path:f.slice().reverse().map(p=>`<${p}>`).join(" "),components:f};return u&&Dl.map.set(o,y),y}var Al={FunctionComponent:0,IndeterminateComponent:2,ForwardRef:11,MemoComponent:14,SimpleMemoComponent:15};function w_(o){if(!o||typeof o!="object")return null;const a=Object.keys(o),i=a.find(f=>f.startsWith("__reactFiber$"));if(i)return o[i]||null;const u=a.find(f=>f.startsWith("__reactInternalInstance$"));if(u)return o[u]||null;const d=a.find(f=>{if(!f.startsWith("__react"))return!1;const h=o[f];return h&&typeof h=="object"&&"_debugSource"in h});return d&&o[d]||null}function Hl(o){if(!o.type||typeof o.type=="string")return null;if(typeof o.type=="object"||typeof o.type=="function"){const a=o.type;if(a.displayName)return a.displayName;if(a.name)return a.name}return null}function k_(o,a=50){var d;let i=o,u=0;for(;i&&u<a;){if(i._debugSource)return{source:i._debugSource,componentName:Hl(i)};if((d=i._debugOwner)!=null&&d._debugSource)return{source:i._debugOwner._debugSource,componentName:Hl(i._debugOwner)};i=i.return,u++}return null}function C_(o){let a=o,i=0;const u=50;for(;a&&i<u;){const d=a,f=["_debugSource","__source","_source","debugSource"];for(const h of f){const y=d[h];if(y&&typeof y=="object"&&"fileName"in y)return{source:y,componentName:Hl(a)}}if(a.memoizedProps){const h=a.memoizedProps;if(h.__source&&typeof h.__source=="object"){const y=h.__source;if(y.fileName&&y.lineNumber)return{source:{fileName:y.fileName,lineNumber:y.lineNumber,columnNumber:y.columnNumber},componentName:Hl(a)}}}a=a.return,i++}return null}var aa=new Map;function S_(o){var d;const a=o.tag,i=o.type,u=o.elementType;if(typeof i=="string"||i==null||typeof i=="function"&&((d=i.prototype)!=null&&d.isReactComponent))return null;if((a===Al.FunctionComponent||a===Al.IndeterminateComponent)&&typeof i=="function")return i;if(a===Al.ForwardRef&&u){const f=u.render;if(typeof f=="function")return f}if((a===Al.MemoComponent||a===Al.SimpleMemoComponent)&&u){const f=u.type;if(typeof f=="function")return f}return typeof i=="function"?i:null}function j_(){const o=mf,a=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;if(a&&"H"in a)return{get:()=>a.H,set:u=>{a.H=u}};const i=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;if(i){const u=i.ReactCurrentDispatcher;if(u&&"current"in u)return{get:()=>u.current,set:d=>{u.current=d}}}return null}function E_(o){const a=o.split(`
`),i=[/source-location/,/\/dist\/index\./,/node_modules\//,/react-dom/,/react\.development/,/react\.production/,/chunk-[A-Z0-9]+/i,/react-stack-bottom-frame/,/react-reconciler/,/scheduler/,/<anonymous>/],u=/^\s*at\s+(?:.*?\s+\()?(.+?):(\d+):(\d+)\)?$/,d=/^[^@]*@(.+?):(\d+):(\d+)$/;for(const f of a){const h=f.trim();if(!h||i.some(p=>p.test(h)))continue;const y=u.exec(h)||d.exec(h);if(y)return{fileName:y[1],line:parseInt(y[2],10),column:parseInt(y[3],10)}}return null}function N_(o){let a=o;return a=a.replace(/[?#].*$/,""),a=a.replace(/^turbopack:\/\/\/\[project\]\//,""),a=a.replace(/^webpack-internal:\/\/\/\.\//,""),a=a.replace(/^webpack-internal:\/\/\//,""),a=a.replace(/^webpack:\/\/\/\.\//,""),a=a.replace(/^webpack:\/\/\//,""),a=a.replace(/^turbopack:\/\/\//,""),a=a.replace(/^https?:\/\/[^/]+\//,""),a=a.replace(/^file:\/\/\//,"/"),a=a.replace(/^\([^)]+\)\/\.\//,""),a=a.replace(/^\.\//,""),a}function P_(o){const a=S_(o);if(!a)return null;if(aa.has(a))return aa.get(a);const i=j_();if(!i)return aa.set(a,null),null;const u=i.get();let d=null;try{const f=new Proxy({},{get(){throw new Error("probe")}});i.set(f);try{a({})}catch(h){if(h instanceof Error&&h.message==="probe"&&h.stack){const y=E_(h.stack);y&&(d={fileName:N_(y.fileName),lineNumber:y.line,columnNumber:y.column,componentName:Hl(o)||void 0})}}}finally{i.set(u)}return aa.set(a,d),d}function L_(o,a=15){let i=o,u=0;for(;i&&u<a;){const d=P_(i);if(d)return d;i=i.return,u++}return null}function uc(o){const a=w_(o);if(!a)return{found:!1,reason:"no-fiber",isReactApp:!1,isProduction:!1};let i=k_(a);if(i||(i=C_(a)),i!=null&&i.source)return{found:!0,source:{fileName:i.source.fileName,lineNumber:i.source.lineNumber,columnNumber:i.source.columnNumber,componentName:i.componentName||void 0},isReactApp:!0,isProduction:!1};const u=L_(a);return u?{found:!0,source:u,isReactApp:!0,isProduction:!1}:{found:!1,reason:"no-debug-source",isReactApp:!0,isProduction:!1}}function I_(o,a="path"){const{fileName:i,lineNumber:u,columnNumber:d}=o;let f=`${i}:${u}`;return d!==void 0&&(f+=`:${d}`),a==="vscode"?`vscode://file${i.startsWith("/")?"":"/"}${f}`:f}function T_(o,a=10){let i=o,u=0;for(;i&&u<a;){const d=uc(i);if(d.found)return d;i=i.parentElement,u++}return uc(o)}var R_=`svg[fill=none] {
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
}`,$_={toolbar:"styles-module__toolbar___wNsdK",toolbarContainer:"styles-module__toolbarContainer___dIhma",dragging:"styles-module__dragging___xrolZ",entrance:"styles-module__entrance___sgHd8",toolbarEnter:"styles-module__toolbarEnter___u8RRu",hiding:"styles-module__hiding___1td44",toolbarHide:"styles-module__toolbarHide___y8kaT",collapsed:"styles-module__collapsed___Rydsn",expanded:"styles-module__expanded___ofKPx",serverConnected:"styles-module__serverConnected___Gfbou",toggleContent:"styles-module__toggleContent___0yfyP",visible:"styles-module__visible___KHwEW",hidden:"styles-module__hidden___Ae8H4",controlsContent:"styles-module__controlsContent___9GJWU",badge:"styles-module__badge___2XsgF",fadeOut:"styles-module__fadeOut___6Ut6-",badgeEnter:"styles-module__badgeEnter___mVQLj",controlButton:"styles-module__controlButton___8Q0jc",statusShowing:"styles-module__statusShowing___te6iu",buttonBadge:"styles-module__buttonBadge___NeFWb",light:"styles-module__light___r6n4Y",mcpIndicator:"styles-module__mcpIndicator___zGJeL",connected:"styles-module__connected___7c28g",mcpIndicatorPulseConnected:"styles-module__mcpIndicatorPulseConnected___EDodZ",connecting:"styles-module__connecting___uo-CW",mcpIndicatorPulseConnecting:"styles-module__mcpIndicatorPulseConnecting___cCYte",connectionIndicatorWrapper:"styles-module__connectionIndicatorWrapper___L-e-3",connectionIndicator:"styles-module__connectionIndicator___afk9p",connectionIndicatorVisible:"styles-module__connectionIndicatorVisible___C-i5B",connectionIndicatorConnected:"styles-module__connectionIndicatorConnected___IY8pR",connectionPulse:"styles-module__connectionPulse___-Zycw",connectionIndicatorDisconnected:"styles-module__connectionIndicatorDisconnected___kmpaZ",connectionIndicatorConnecting:"styles-module__connectionIndicatorConnecting___QmSLH",buttonWrapper:"styles-module__buttonWrapper___rBcdv",buttonTooltip:"styles-module__buttonTooltip___Burd9",tooltipsInSession:"styles-module__tooltipsInSession___-0lHH",sendButtonWrapper:"styles-module__sendButtonWrapper___UUxG6",sendButtonVisible:"styles-module__sendButtonVisible___WPSQU",shortcut:"styles-module__shortcut___lEAQk",tooltipBelow:"styles-module__tooltipBelow___m6ats",tooltipsHidden:"styles-module__tooltipsHidden___VtLJG",tooltipVisible:"styles-module__tooltipVisible___0jcCv",buttonWrapperAlignLeft:"styles-module__buttonWrapperAlignLeft___myzIp",buttonWrapperAlignRight:"styles-module__buttonWrapperAlignRight___HCQFR",divider:"styles-module__divider___c--s1",overlay:"styles-module__overlay___Q1O9y",hoverHighlight:"styles-module__hoverHighlight___ogakW",enter:"styles-module__enter___WFIki",hoverHighlightIn:"styles-module__hoverHighlightIn___6WYHY",multiSelectOutline:"styles-module__multiSelectOutline___cSJ-m",fadeIn:"styles-module__fadeIn___b9qmf",exit:"styles-module__exit___fyOJ0",singleSelectOutline:"styles-module__singleSelectOutline___QhX-O",hoverTooltip:"styles-module__hoverTooltip___bvLk7",hoverTooltipIn:"styles-module__hoverTooltipIn___FYGQx",hoverReactPath:"styles-module__hoverReactPath___gx1IJ",hoverElementName:"styles-module__hoverElementName___QMLMl",markersLayer:"styles-module__markersLayer___-25j1",fixedMarkersLayer:"styles-module__fixedMarkersLayer___ffyX6",marker:"styles-module__marker___6sQrs",clearing:"styles-module__clearing___FQ--7",markerIn:"styles-module__markerIn___5FaAP",markerOut:"styles-module__markerOut___GU5jX",pending:"styles-module__pending___2IHLC",fixed:"styles-module__fixed___dBMHC",multiSelect:"styles-module__multiSelect___YWiuz",hovered:"styles-module__hovered___ZgXIy",renumber:"styles-module__renumber___nCTxD",renumberRoll:"styles-module__renumberRoll___Wgbq3",markerTooltip:"styles-module__markerTooltip___aLJID",tooltipIn:"styles-module__tooltipIn___0N31w",markerQuote:"styles-module__markerQuote___FHmrz",markerNote:"styles-module__markerNote___QkrrS",markerHint:"styles-module__markerHint___2iF-6",settingsPanel:"styles-module__settingsPanel___OxX3Y",settingsHeader:"styles-module__settingsHeader___pwDY9",settingsBrand:"styles-module__settingsBrand___0gJeM",settingsBrandSlash:"styles-module__settingsBrandSlash___uTG18",settingsVersion:"styles-module__settingsVersion___TUcFq",settingsSection:"styles-module__settingsSection___m-YM2",settingsLabel:"styles-module__settingsLabel___8UjfX",cycleButton:"styles-module__cycleButton___FMKfw",cycleDot:"styles-module__cycleDot___nPgLY",dropdownButton:"styles-module__dropdownButton___16NPz",toggleLabel:"styles-module__toggleLabel___Xm8Aa",customCheckbox:"styles-module__customCheckbox___U39ax",sliderLabel:"styles-module__sliderLabel___U8sPr",slider:"styles-module__slider___GLdxp",helpIcon:"styles-module__helpIcon___xQg56",themeToggle:"styles-module__themeToggle___2rUjA",dark:"styles-module__dark___ILIQf",settingsOption:"styles-module__settingsOption___UNa12",selected:"styles-module__selected___OwRqP",settingsPanelContainer:"styles-module__settingsPanelContainer___Xksv8",transitioning:"styles-module__transitioning___qxzCk",settingsPage:"styles-module__settingsPage___6YfHH",slideLeft:"styles-module__slideLeft___Ps01J",automationsPage:"styles-module__automationsPage___uvCq6",slideIn:"styles-module__slideIn___4-qXe",settingsNavLink:"styles-module__settingsNavLink___wCzJt",settingsNavLinkRight:"styles-module__settingsNavLinkRight___ZWwhj",mcpNavIndicator:"styles-module__mcpNavIndicator___cl9pO",mcpPulse:"styles-module__mcpPulse___uNggr",settingsBackButton:"styles-module__settingsBackButton___bIe2j",automationHeader:"styles-module__automationHeader___InP0r",automationDescription:"styles-module__automationDescription___NKlmo",learnMoreLink:"styles-module__learnMoreLink___8xv-x",autoSendRow:"styles-module__autoSendRow___UblX5",autoSendLabel:"styles-module__autoSendLabel___icDc2",active:"styles-module__active___-zoN6",webhookUrlInput:"styles-module__webhookUrlInput___2375C",settingsSectionExtraPadding:"styles-module__settingsSectionExtraPadding___jdhFV",settingsSectionGrow:"styles-module__settingsSectionGrow___h-5HZ",settingsRow:"styles-module__settingsRow___3sdhc",settingsRowMarginTop:"styles-module__settingsRowMarginTop___zA0Sp",dropdownContainer:"styles-module__dropdownContainer___BVnxe",settingsRowDisabled:"styles-module__settingsRowDisabled___EgS0V",toggleSwitch:"styles-module__toggleSwitch___l4Ygm",cycleButtonText:"styles-module__cycleButtonText___fD1LR",cycleTextIn:"styles-module__cycleTextIn___Q6zJf",cycleDots:"styles-module__cycleDots___LWuoQ",dropdownMenu:"styles-module__dropdownMenu___k73ER",scaleIn:"styles-module__scaleIn___c-r1K",dropdownItem:"styles-module__dropdownItem___ylsLj",settingsLabelMarker:"styles-module__settingsLabelMarker___ewdtV",settingsOptions:"styles-module__settingsOptions___LyrBA",sliderContainer:"styles-module__sliderContainer___ducXj",sliderLabels:"styles-module__sliderLabels___FhLDB",colorOptions:"styles-module__colorOptions___iHCNX",colorOption:"styles-module__colorOption___IodiY",colorOptionRing:"styles-module__colorOptionRing___U2xpo",settingsToggle:"styles-module__settingsToggle___fBrFn",settingsToggleMarginBottom:"styles-module__settingsToggleMarginBottom___MZUyF",checked:"styles-module__checked___mnZLo",toggleSlider:"styles-module__toggleSlider___wprIn",disabled:"styles-module__disabled___332Jw",mcpStatusDot:"styles-module__mcpStatusDot___ibgkc",disconnected:"styles-module__disconnected___cHPxR",mcpPulseError:"styles-module__mcpPulseError___fov9B",helpIconNudgeDown:"styles-module__helpIconNudgeDown___0cqpM",helpIconNoNudge:"styles-module__helpIconNoNudge___abogC","helpIconNudge1-5":"styles-module__helpIconNudge1-5___DM2TQ",helpIconNudge2:"styles-module__helpIconNudge2___TfWgC",dragSelection:"styles-module__dragSelection___kZLq2",dragCount:"styles-module__dragCount___KM90j",highlightsContainer:"styles-module__highlightsContainer___-0xzG",selectedElementHighlight:"styles-module__selectedElementHighlight___fyVlI",themeIconWrapper:"styles-module__themeIconWrapper___LsJIM",themeIcon:"styles-module__themeIcon___lCCmo",themeIconIn:"styles-module__themeIconIn___TU6ML",scaleOut:"styles-module__scaleOut___Wctwz",slideUp:"styles-module__slideUp___kgD36",slideDown:"styles-module__slideDown___zcdje",settingsPanelIn:"styles-module__settingsPanelIn___MGfO8",settingsPanelOut:"styles-module__settingsPanelOut___Zfymi"};if(typeof document<"u"){let o=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");o||(o=document.createElement("style"),o.id="feedback-tool-styles-page-toolbar-css-styles",o.textContent=R_,document.head.appendChild(o))}var j=$_;function lc(o,a="filtered"){const{name:i,path:u}=fa(o);if(a==="off")return{name:i,elementName:i,path:u,reactComponents:null};const d=b_(o,{mode:a});return{name:d.path?`${d.path} ${i}`:i,elementName:i,path:u,reactComponents:d.path}}var cf=!1,uf={outputDetail:"standard",autoClearAfterCopy:!1,annotationColor:"#3c82f7",blockInteractions:!0,reactEnabled:!0,markerClickBehavior:"edit",webhookUrl:"",webhooksEnabled:!0},Un=o=>{if(!o||!o.trim())return!1;try{const a=new URL(o.trim());return a.protocol==="http:"||a.protocol==="https:"}catch{return!1}},Bl=[{value:"compact",label:"Compact"},{value:"standard",label:"Standard"},{value:"detailed",label:"Detailed"},{value:"forensic",label:"Forensic"}],M_=[{value:"#AF52DE",label:"Purple"},{value:"#3c82f7",label:"Blue"},{value:"#5AC8FA",label:"Cyan"},{value:"#34C759",label:"Green"},{value:"#FFD60A",label:"Yellow"},{value:"#FF9500",label:"Orange"},{value:"#FF3B30",label:"Red"}];function Xr(o,a){let i=document.elementFromPoint(o,a);if(!i)return null;for(;i!=null&&i.shadowRoot;){const u=i.shadowRoot.elementFromPoint(o,a);if(!u||u===i)break;i=u}return i}function sc(o){let a=o;for(;a&&a!==document.body;){const u=window.getComputedStyle(a).position;if(u==="fixed"||u==="sticky")return!0;a=a.parentElement}return!1}function To(o){return o.status!=="resolved"&&o.status!=="dismissed"}function ia(o){const a=uc(o),i=a.found?a:T_(o);if(i.found&&i.source)return I_(i.source,"path")}function df(o,a,i="standard",u="filtered"){if(o.length===0)return"";const d=typeof window<"u"?`${window.innerWidth}×${window.innerHeight}`:"unknown";let f=`## Page Feedback: ${a}
`;return i==="forensic"?(f+=`
**Environment:**
`,f+=`- Viewport: ${d}
`,typeof window<"u"&&(f+=`- URL: ${window.location.href}
`,f+=`- User Agent: ${navigator.userAgent}
`,f+=`- Timestamp: ${new Date().toISOString()}
`,f+=`- Device Pixel Ratio: ${window.devicePixelRatio}
`),f+=`
---
`):i!=="compact"&&(f+=`**Viewport:** ${d}
`),f+=`
`,o.forEach((h,y)=>{i==="compact"?(f+=`${y+1}. **${h.element}**${h.sourceFile?` (${h.sourceFile})`:""}: ${h.comment}`,h.selectedText&&(f+=` (re: "${h.selectedText.slice(0,30)}${h.selectedText.length>30?"...":""}")`),f+=`
`):i==="forensic"?(f+=`### ${y+1}. ${h.element}
`,h.isMultiSelect&&h.fullPath&&(f+=`*Forensic data shown for first element of selection*
`),h.fullPath&&(f+=`**Full DOM Path:** ${h.fullPath}
`),h.cssClasses&&(f+=`**CSS Classes:** ${h.cssClasses}
`),h.boundingBox&&(f+=`**Position:** x:${Math.round(h.boundingBox.x)}, y:${Math.round(h.boundingBox.y)} (${Math.round(h.boundingBox.width)}×${Math.round(h.boundingBox.height)}px)
`),f+=`**Annotation at:** ${h.x.toFixed(1)}% from left, ${Math.round(h.y)}px from top
`,h.selectedText&&(f+=`**Selected text:** "${h.selectedText}"
`),h.nearbyText&&!h.selectedText&&(f+=`**Context:** ${h.nearbyText.slice(0,100)}
`),h.computedStyles&&(f+=`**Computed Styles:** ${h.computedStyles}
`),h.accessibility&&(f+=`**Accessibility:** ${h.accessibility}
`),h.nearbyElements&&(f+=`**Nearby Elements:** ${h.nearbyElements}
`),h.sourceFile&&(f+=`**Source:** ${h.sourceFile}
`),h.reactComponents&&(f+=`**React:** ${h.reactComponents}
`),f+=`**Feedback:** ${h.comment}

`):(f+=`### ${y+1}. ${h.element}
`,f+=`**Location:** ${h.elementPath}
`,h.sourceFile&&(f+=`**Source:** ${h.sourceFile}
`),h.reactComponents&&(f+=`**React:** ${h.reactComponents}
`),i==="detailed"&&(h.cssClasses&&(f+=`**Classes:** ${h.cssClasses}
`),h.boundingBox&&(f+=`**Position:** ${Math.round(h.boundingBox.x)}px, ${Math.round(h.boundingBox.y)}px (${Math.round(h.boundingBox.width)}×${Math.round(h.boundingBox.height)}px)
`)),h.selectedText&&(f+=`**Selected text:** "${h.selectedText}"
`),i==="detailed"&&h.nearbyText&&!h.selectedText&&(f+=`**Context:** ${h.nearbyText.slice(0,100)}
`),f+=`**Feedback:** ${h.comment}

`)}),f.trim()}function z_({demoAnnotations:o,demoDelay:a=1e3,enableDemoMode:i=!1,onAnnotationAdd:u,onAnnotationDelete:d,onAnnotationUpdate:f,onAnnotationsClear:h,onCopy:y,onSubmit:p,copyToClipboard:$=!0,endpoint:x,sessionId:L,onSessionCreated:g,webhookUrl:S,className:N}={}){var to,Uo,ls;const[_,k]=C.useState(!1),[b,Z]=C.useState([]),[U,le]=C.useState(!0),[ne,ie]=C.useState(()=>s_()),[he,re]=C.useState(!1),G=C.useRef(null);C.useEffect(()=>{const v=Y=>{const X=G.current;X&&X.contains(Y.target)&&Y.stopPropagation()},P=["mousedown","click","pointerdown"];return P.forEach(Y=>document.body.addEventListener(Y,v)),()=>{P.forEach(Y=>document.body.removeEventListener(Y,v))}},[]);const[w,ke]=C.useState(!1),[fe,H]=C.useState(!1),[ce,Pe]=C.useState(null),[O,je]=C.useState({x:0,y:0}),[M,z]=C.useState(null),[V,I]=C.useState(!1),[D,de]=C.useState("idle"),[pe,se]=C.useState(!1),[Ee,Be]=C.useState(!1),[We,Ue]=C.useState(null),[nt,wt]=C.useState(null),[Ro,J]=C.useState([]),[mt,ot]=C.useState(null),[jt,Qt]=C.useState(null),[ze,Xn]=C.useState(null),[Qn,Ft]=C.useState(null),[ar,$n]=C.useState([]),[Mn,Kr]=C.useState(0),[Zr,ir]=C.useState(!1),[st,Xl]=C.useState(!1),[$t,uo]=C.useState(!1),[$o,cr]=C.useState(!1),[Ql,Gl]=C.useState(!1),[Mo,zo]=C.useState("main"),[ur,dr]=C.useState(!1),[Jr,zn]=C.useState(!1),[Gn,qr]=C.useState(!1),Kn=C.useRef(null),[pt,Zn]=C.useState([]),ln=C.useRef({cmd:!1,shift:!1}),Lt=()=>{zn(!0)},Kl=()=>{zn(!1)},Oo=()=>{Gn||(Kn.current=setTimeout(()=>qr(!0),850))},el=()=>{Kn.current&&(clearTimeout(Kn.current),Kn.current=null),qr(!1),Kl()};C.useEffect(()=>()=>{Kn.current&&clearTimeout(Kn.current)},[]);const pn=({content:v,children:P})=>{const[Y,X]=C.useState(!1),[Q,q]=C.useState(!1),[ye,ge]=C.useState(!1),[Ce,$e]=C.useState({top:0,right:0}),Se=C.useRef(null),Re=C.useRef(null),Ne=C.useRef(null),Te=()=>{if(Se.current){const Ct=Se.current.getBoundingClientRect();$e({top:Ct.top+Ct.height/2,right:window.innerWidth-Ct.left+8})}},xe=()=>{X(!0),ge(!0),Ne.current&&(clearTimeout(Ne.current),Ne.current=null),Te(),Re.current=Xe(()=>{q(!0)},500)},kt=()=>{X(!1),Re.current&&(clearTimeout(Re.current),Re.current=null),q(!1),Ne.current=Xe(()=>{ge(!1)},150)};return C.useEffect(()=>()=>{Re.current&&clearTimeout(Re.current),Ne.current&&clearTimeout(Ne.current)},[]),l.jsxs(l.Fragment,{children:[l.jsx("span",{ref:Se,onMouseEnter:xe,onMouseLeave:kt,children:P}),ye&&qd.createPortal(l.jsx("div",{"data-feedback-toolbar":!0,style:{position:"fixed",top:Ce.top,right:Ce.right,transform:"translateY(-50%)",padding:"6px 10px",background:"#383838",color:"rgba(255, 255, 255, 0.7)",fontSize:"11px",fontWeight:400,lineHeight:"14px",borderRadius:"10px",width:"180px",textAlign:"left",zIndex:100020,pointerEvents:"none",boxShadow:"0px 1px 8px rgba(0, 0, 0, 0.28)",opacity:Q&&!ur?1:0,transition:"opacity 0.15s ease"},children:v}),document.body)]})},[ue,Gt]=C.useState(uf),[Fe,Fo]=C.useState(!0),[fr,Zl]=C.useState(!1),Jl=!1,wn="off",[xt,mr]=C.useState(L??null),tl=C.useRef(!1),[Mt,On]=C.useState(x?"connecting":"disconnected"),[et,pr]=C.useState(null),[hn,ql]=C.useState(!1),[fo,ct]=C.useState(null),[_a,nl]=C.useState(0),hr=C.useRef(!1),[Do,Ao]=C.useState(new Set),[ol,Jn]=C.useState(new Set),[Dt,_r]=C.useState(!1),[sn,mo]=C.useState(!1),[kn,es]=C.useState(!1),Cn=C.useRef(null),Vt=C.useRef(null),Sn=C.useRef(null),Fn=C.useRef(null),gr=C.useRef(!1),ts=C.useRef(0),po=C.useRef(null),rl=C.useRef(null),Bo=8,Wo=50,ns=C.useRef(null),yr=C.useRef(null),Ve=C.useRef(null),tt=typeof window<"u"?window.location.pathname:"/";C.useEffect(()=>{if($o)Gl(!0);else{zn(!1),zo("main");const v=Xe(()=>Gl(!1),0);return()=>clearTimeout(v)}},[$o]),C.useEffect(()=>{dr(!0);const v=Xe(()=>dr(!1),350);return()=>clearTimeout(v)},[Mo]);const ll=_&&U;C.useEffect(()=>{if(ll){H(!1),ke(!0),Ao(new Set);const v=Xe(()=>{Ao(P=>{const Y=new Set(P);return b.forEach(X=>Y.add(X.id)),Y})},350);return()=>clearTimeout(v)}else if(w){H(!0);const v=Xe(()=>{ke(!1),H(!1)},250);return()=>clearTimeout(v)}},[ll]),C.useEffect(()=>{Xl(!0),Kr(window.scrollY);const v=tc(tt);Z(v.filter(To)),cf||(Zl(!0),cf=!0,Xe(()=>Zl(!1),750));try{const P=localStorage.getItem("feedback-toolbar-settings");P&&Gt({...uf,...JSON.parse(P)})}catch{}try{const P=localStorage.getItem("feedback-toolbar-theme");P!==null&&Fo(P==="dark")}catch{}try{const P=localStorage.getItem("feedback-toolbar-position");if(P){const Y=JSON.parse(P);typeof Y.x=="number"&&typeof Y.y=="number"&&pr(Y)}}catch{}},[tt]),C.useEffect(()=>{st&&localStorage.setItem("feedback-toolbar-settings",JSON.stringify(ue))},[ue,st]),C.useEffect(()=>{st&&localStorage.setItem("feedback-toolbar-theme",Fe?"dark":"light")},[Fe,st]);const xr=C.useRef(!1);C.useEffect(()=>{const v=xr.current;xr.current=hn,v&&!hn&&et&&st&&localStorage.setItem("feedback-toolbar-position",JSON.stringify(et))},[hn,et,st]),C.useEffect(()=>{if(!x||!st||tl.current)return;tl.current=!0,On("connecting"),(async()=>{try{const P=r_(tt),Y=L||P;let X=!1;if(Y)try{const Q=await rf(x,Y);mr(Q.id),On("connected"),nc(tt,Q.id),X=!0;const q=tc(tt),ye=new Set(Q.annotations.map(Ce=>Ce.id)),ge=q.filter(Ce=>!ye.has(Ce.id));if(ge.length>0){const $e=`${typeof window<"u"?window.location.origin:""}${tt}`,Re=(await Promise.allSettled(ge.map(Te=>sa(x,Q.id,{...Te,sessionId:Q.id,url:$e})))).map((Te,xe)=>Te.status==="fulfilled"?Te.value:(console.warn("[Agentation] Failed to sync annotation:",Te.reason),ge[xe])),Ne=[...Q.annotations,...Re];Z(Ne.filter(To)),Fl(tt,Ne.filter(To),Q.id)}else Z(Q.annotations.filter(To)),Fl(tt,Q.annotations.filter(To),Q.id)}catch(Q){console.warn("[Agentation] Could not join session, creating new:",Q),l_(tt)}if(!X){const Q=typeof window<"u"?window.location.href:"/",q=await oc(x,Q);mr(q.id),On("connected"),nc(tt,q.id),g==null||g(q.id);const ye=o_(),ge=typeof window<"u"?window.location.origin:"",Ce=[];for(const[$e,Se]of ye){const Re=Se.filter(xe=>!xe._syncedTo);if(Re.length===0)continue;const Ne=`${ge}${$e}`,Te=$e===tt;Ce.push((async()=>{try{const xe=Te?q:await oc(x,Ne),un=(await Promise.allSettled(Re.map(ut=>sa(x,xe.id,{...ut,sessionId:xe.id,url:Ne})))).map((ut,gt)=>ut.status==="fulfilled"?ut.value:(console.warn("[Agentation] Failed to sync annotation:",ut.reason),Re[gt])).filter(To);if(Fl($e,un,xe.id),Te){const ut=new Set(Re.map(gt=>gt.id));Z(gt=>{const De=gt.filter(Ae=>!ut.has(Ae.id));return[...un,...De]})}}catch(xe){console.warn(`[Agentation] Failed to sync annotations for ${$e}:`,xe)}})())}await Promise.allSettled(Ce)}}catch(P){On("disconnected"),console.warn("[Agentation] Failed to initialize session, using local storage:",P)}})()},[x,L,st,g,tt]),C.useEffect(()=>{if(!x||!st)return;const v=async()=>{try{(await fetch(`${x}/health`)).ok?On("connected"):On("disconnected")}catch{On("disconnected")}};v();const P=Xh(v,1e4);return()=>clearInterval(P)},[x,st]),C.useEffect(()=>{if(!x||!st||!xt)return;const v=new EventSource(`${x}/sessions/${xt}/events`),P=["resolved","dismissed"],Y=X=>{var Q;try{const q=JSON.parse(X.data);if(P.includes((Q=q.payload)==null?void 0:Q.status)){const ye=q.payload.id;Jn(ge=>new Set(ge).add(ye)),Xe(()=>{Z(ge=>ge.filter(Ce=>Ce.id!==ye)),Jn(ge=>{const Ce=new Set(ge);return Ce.delete(ye),Ce})},150)}}catch{}};return v.addEventListener("annotation.updated",Y),()=>{v.removeEventListener("annotation.updated",Y),v.close()}},[x,st,xt]),C.useEffect(()=>{if(!x||!st)return;const v=rl.current==="disconnected",P=Mt==="connected";rl.current=Mt,v&&P&&(async()=>{try{const X=tc(tt);if(X.length===0)return;const q=`${typeof window<"u"?window.location.origin:""}${tt}`;let ye=xt,ge=[];if(ye)try{ge=(await rf(x,ye)).annotations}catch{ye=null}ye||(ye=(await oc(x,q)).id,mr(ye),nc(tt,ye));const Ce=new Set(ge.map(Se=>Se.id)),$e=X.filter(Se=>!Ce.has(Se.id));if($e.length>0){const Re=(await Promise.allSettled($e.map(xe=>sa(x,ye,{...xe,sessionId:ye,url:q})))).map((xe,kt)=>xe.status==="fulfilled"?xe.value:(console.warn("[Agentation] Failed to sync annotation on reconnect:",xe.reason),$e[kt])),Te=[...ge,...Re].filter(To);Z(Te),Fl(tt,Te,ye)}}catch(X){console.warn("[Agentation] Failed to sync on reconnect:",X)}})()},[Mt,x,st,xt,tt]);const os=C.useCallback(()=>{he||(re(!0),cr(!1),k(!1),Xe(()=>{a_(!0),ie(!0),re(!1)},400))},[he]);C.useEffect(()=>{if(!i||!st||!o||o.length===0||b.length>0)return;const v=[];return v.push(Xe(()=>{k(!0)},a-200)),o.forEach((P,Y)=>{const X=a+Y*300;v.push(Xe(()=>{const Q=document.querySelector(P.selector);if(!Q)return;const q=Q.getBoundingClientRect(),{name:ye,path:ge}=fa(Q),Ce={id:`demo-${Date.now()}-${Y}`,x:(q.left+q.width/2)/window.innerWidth*100,y:q.top+q.height/2+window.scrollY,comment:P.comment,element:ye,elementPath:ge,timestamp:Date.now(),selectedText:P.selectedText,boundingBox:{x:q.left,y:q.top+window.scrollY,width:q.width,height:q.height},nearbyText:zl(Q),cssClasses:Ol(Q)};Z($e=>[...$e,Ce])},X))}),()=>{v.forEach(clearTimeout)}},[i,st,o,a]),C.useEffect(()=>{const v=()=>{Kr(window.scrollY),ir(!0),Ve.current&&clearTimeout(Ve.current),Ve.current=Xe(()=>{ir(!1)},150)};return window.addEventListener("scroll",v,{passive:!0}),()=>{window.removeEventListener("scroll",v),Ve.current&&clearTimeout(Ve.current)}},[]),C.useEffect(()=>{st&&b.length>0?xt?Fl(tt,b,xt):Lf(tt,b):st&&b.length===0&&localStorage.removeItem(ma(tt))},[b,tt,st,xt]);const sl=C.useCallback(()=>{$t||(Gh(),uo(!0))},[$t]),Yo=C.useCallback(()=>{$t&&(nf(),uo(!1))},[$t]),Ho=C.useCallback(()=>{$t?Yo():sl()},[$t,sl,Yo]),Vo=C.useCallback(()=>{if(pt.length===0)return;const v=pt[0],P=v.element,Y=pt.length>1,X=pt.map(Q=>Q.element.getBoundingClientRect());if(Y){const Q={left:Math.min(...X.map(xe=>xe.left)),top:Math.min(...X.map(xe=>xe.top)),right:Math.max(...X.map(xe=>xe.right)),bottom:Math.max(...X.map(xe=>xe.bottom))},q=pt.slice(0,5).map(xe=>xe.name).join(", "),ye=pt.length>5?` +${pt.length-5} more`:"",ge=X.map(xe=>({x:xe.left,y:xe.top+window.scrollY,width:xe.width,height:xe.height})),$e=pt[pt.length-1].element,Se=X[X.length-1],Re=Se.left+Se.width/2,Ne=Se.top+Se.height/2,Te=sc($e);z({x:Re/window.innerWidth*100,y:Te?Ne:Ne+window.scrollY,clientY:Ne,element:`${pt.length} elements: ${q}${ye}`,elementPath:"multi-select",boundingBox:{x:Q.left,y:Q.top+window.scrollY,width:Q.right-Q.left,height:Q.bottom-Q.top},isMultiSelect:!0,isFixed:Te,elementBoundingBoxes:ge,multiSelectElements:pt.map(xe=>xe.element),targetElement:$e,fullPath:la(P),accessibility:ra(P),computedStyles:oa(P),computedStylesObj:na(P),nearbyElements:ta(P),cssClasses:Ol(P),nearbyText:zl(P),sourceFile:ia(P)})}else{const Q=X[0],q=sc(P);z({x:Q.left/window.innerWidth*100,y:q?Q.top:Q.top+window.scrollY,clientY:Q.top,element:v.name,elementPath:v.path,boundingBox:{x:Q.left,y:q?Q.top:Q.top+window.scrollY,width:Q.width,height:Q.height},isFixed:q,fullPath:la(P),accessibility:ra(P),computedStyles:oa(P),computedStylesObj:na(P),nearbyElements:ta(P),cssClasses:Ol(P),nearbyText:zl(P),reactComponents:v.reactComponents,sourceFile:ia(P)})}Zn([]),Pe(null)},[pt]);C.useEffect(()=>{_||(z(null),Xn(null),Ft(null),$n([]),Pe(null),cr(!1),Zn([]),ln.current={cmd:!1,shift:!1},$t&&Yo())},[_,$t,Yo]),C.useEffect(()=>()=>{nf()},[]),C.useEffect(()=>{if(!_)return;const v=document.createElement("style");return v.id="feedback-cursor-styles",v.textContent=`
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
    `,document.head.appendChild(v),()=>{const P=document.getElementById("feedback-cursor-styles");P&&P.remove()}},[_]),C.useEffect(()=>{if(!_||M)return;const v=P=>{const Y=P.composedPath()[0]||P.target;if(rn(Y,"[data-feedback-toolbar]")){Pe(null);return}const X=Xr(P.clientX,P.clientY);if(!X||rn(X,"[data-feedback-toolbar]")){Pe(null);return}const{name:Q,elementName:q,path:ye,reactComponents:ge}=lc(X,wn),Ce=X.getBoundingClientRect();Pe({element:Q,elementName:q,elementPath:ye,rect:Ce,reactComponents:ge}),je({x:P.clientX,y:P.clientY})};return document.addEventListener("mousemove",v),()=>document.removeEventListener("mousemove",v)},[_,M,wn]),C.useEffect(()=>{if(!_)return;const v=P=>{var Ct,un;if(gr.current){gr.current=!1;return}const Y=P.composedPath()[0]||P.target;if(rn(Y,"[data-feedback-toolbar]")||rn(Y,"[data-annotation-popup]")||rn(Y,"[data-annotation-marker]"))return;if(P.metaKey&&P.shiftKey&&!M&&!ze){P.preventDefault(),P.stopPropagation();const ut=Xr(P.clientX,P.clientY);if(!ut)return;const gt=ut.getBoundingClientRect(),{name:De,path:Ae,reactComponents:At}=lc(ut,wn),dt=pt.findIndex(Kt=>Kt.element===ut);dt>=0?Zn(Kt=>Kt.filter((Zt,kr)=>kr!==dt)):Zn(Kt=>[...Kt,{element:ut,rect:gt,name:De,path:Ae,reactComponents:At??void 0}]);return}const X=rn(Y,"button, a, input, select, textarea, [role='button'], [onclick]");if(ue.blockInteractions&&X&&(P.preventDefault(),P.stopPropagation()),M){if(X&&!ue.blockInteractions)return;P.preventDefault(),(Ct=ns.current)==null||Ct.shake();return}if(ze){if(X&&!ue.blockInteractions)return;P.preventDefault(),(un=yr.current)==null||un.shake();return}P.preventDefault();const Q=Xr(P.clientX,P.clientY);if(!Q)return;const{name:q,path:ye,reactComponents:ge}=lc(Q,wn),Ce=Q.getBoundingClientRect(),$e=P.clientX/window.innerWidth*100,Se=sc(Q),Re=Se?P.clientY:P.clientY+window.scrollY,Ne=window.getSelection();let Te;Ne&&Ne.toString().trim().length>0&&(Te=Ne.toString().trim().slice(0,500));const xe=na(Q),kt=oa(Q);z({x:$e,y:Re,clientY:P.clientY,element:q,elementPath:ye,selectedText:Te,boundingBox:{x:Ce.left,y:Se?Ce.top:Ce.top+window.scrollY,width:Ce.width,height:Ce.height},nearbyText:zl(Q),cssClasses:Ol(Q),isFixed:Se,fullPath:la(Q),accessibility:ra(Q),computedStyles:kt,computedStylesObj:xe,nearbyElements:ta(Q),reactComponents:ge??void 0,sourceFile:ia(Q),targetElement:Q}),Pe(null)};return document.addEventListener("click",v,!0),()=>document.removeEventListener("click",v,!0)},[_,M,ze,ue.blockInteractions,wn,pt]),C.useEffect(()=>{if(!_)return;const v=X=>{X.key==="Meta"&&(ln.current.cmd=!0),X.key==="Shift"&&(ln.current.shift=!0)},P=X=>{const Q=ln.current.cmd&&ln.current.shift;X.key==="Meta"&&(ln.current.cmd=!1),X.key==="Shift"&&(ln.current.shift=!1);const q=ln.current.cmd&&ln.current.shift;Q&&!q&&pt.length>0&&Vo()},Y=()=>{ln.current={cmd:!1,shift:!1},Zn([])};return document.addEventListener("keydown",v),document.addEventListener("keyup",P),window.addEventListener("blur",Y),()=>{document.removeEventListener("keydown",v),document.removeEventListener("keyup",P),window.removeEventListener("blur",Y)}},[_,pt,Vo]),C.useEffect(()=>{if(!_||M)return;const v=P=>{const Y=P.composedPath()[0]||P.target;rn(Y,"[data-feedback-toolbar]")||rn(Y,"[data-annotation-marker]")||rn(Y,"[data-annotation-popup]")||new Set(["P","SPAN","H1","H2","H3","H4","H5","H6","LI","TD","TH","LABEL","BLOCKQUOTE","FIGCAPTION","CAPTION","LEGEND","DT","DD","PRE","CODE","EM","STRONG","B","I","U","S","A","TIME","ADDRESS","CITE","Q","ABBR","DFN","MARK","SMALL","SUB","SUP"]).has(Y.tagName)||Y.isContentEditable||(Cn.current={x:P.clientX,y:P.clientY})};return document.addEventListener("mousedown",v),()=>document.removeEventListener("mousedown",v)},[_,M]),C.useEffect(()=>{if(!_||M)return;const v=P=>{if(!Cn.current)return;const Y=P.clientX-Cn.current.x,X=P.clientY-Cn.current.y,Q=Y*Y+X*X,q=Bo*Bo;if(!kn&&Q>=q&&(Vt.current=Cn.current,es(!0)),(kn||Q>=q)&&Vt.current){if(Sn.current){const De=Math.min(Vt.current.x,P.clientX),Ae=Math.min(Vt.current.y,P.clientY),At=Math.abs(P.clientX-Vt.current.x),dt=Math.abs(P.clientY-Vt.current.y);Sn.current.style.transform=`translate(${De}px, ${Ae}px)`,Sn.current.style.width=`${At}px`,Sn.current.style.height=`${dt}px`}const ye=Date.now();if(ye-ts.current<Wo)return;ts.current=ye;const ge=Vt.current.x,Ce=Vt.current.y,$e=Math.min(ge,P.clientX),Se=Math.min(Ce,P.clientY),Re=Math.max(ge,P.clientX),Ne=Math.max(Ce,P.clientY),Te=($e+Re)/2,xe=(Se+Ne)/2,kt=new Set,Ct=[[$e,Se],[Re,Se],[$e,Ne],[Re,Ne],[Te,xe],[Te,Se],[Te,Ne],[$e,xe],[Re,xe]];for(const[De,Ae]of Ct){const At=document.elementsFromPoint(De,Ae);for(const dt of At)dt instanceof HTMLElement&&kt.add(dt)}const un=document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav");for(const De of un)if(De instanceof HTMLElement){const Ae=De.getBoundingClientRect(),At=Ae.left+Ae.width/2,dt=Ae.top+Ae.height/2,Kt=At>=$e&&At<=Re&&dt>=Se&&dt<=Ne,Zt=Math.min(Ae.right,Re)-Math.max(Ae.left,$e),kr=Math.min(Ae.bottom,Ne)-Math.max(Ae.top,Se),ya=Zt>0&&kr>0?Zt*kr:0,ss=Ae.width*Ae.height,xa=ss>0?ya/ss:0;(Kt||xa>.5)&&kt.add(De)}const ut=[],gt=new Set(["BUTTON","A","INPUT","IMG","P","H1","H2","H3","H4","H5","H6","LI","LABEL","TD","TH","SECTION","ARTICLE","ASIDE","NAV"]);for(const De of kt){if(rn(De,"[data-feedback-toolbar]")||rn(De,"[data-annotation-marker]"))continue;const Ae=De.getBoundingClientRect();if(!(Ae.width>window.innerWidth*.8&&Ae.height>window.innerHeight*.5)&&!(Ae.width<10||Ae.height<10)&&Ae.left<Re&&Ae.right>$e&&Ae.top<Ne&&Ae.bottom>Se){const At=De.tagName;let dt=gt.has(At);if(!dt&&(At==="DIV"||At==="SPAN")){const Kt=De.textContent&&De.textContent.trim().length>0,Zt=De.onclick!==null||De.getAttribute("role")==="button"||De.getAttribute("role")==="link"||De.classList.contains("clickable")||De.hasAttribute("data-clickable");(Kt||Zt)&&!De.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")&&(dt=!0)}if(dt){let Kt=!1;for(const Zt of ut)if(Zt.left<=Ae.left&&Zt.right>=Ae.right&&Zt.top<=Ae.top&&Zt.bottom>=Ae.bottom){Kt=!0;break}Kt||ut.push(Ae)}}}if(Fn.current){const De=Fn.current;for(;De.children.length>ut.length;)De.removeChild(De.lastChild);ut.forEach((Ae,At)=>{let dt=De.children[At];dt||(dt=document.createElement("div"),dt.className=j.selectedElementHighlight,De.appendChild(dt)),dt.style.transform=`translate(${Ae.left}px, ${Ae.top}px)`,dt.style.width=`${Ae.width}px`,dt.style.height=`${Ae.height}px`})}}};return document.addEventListener("mousemove",v,{passive:!0}),()=>document.removeEventListener("mousemove",v)},[_,M,kn,Bo]),C.useEffect(()=>{if(!_)return;const v=P=>{const Y=kn,X=Vt.current;if(kn&&X){gr.current=!0;const Q=Math.min(X.x,P.clientX),q=Math.min(X.y,P.clientY),ye=Math.max(X.x,P.clientX),ge=Math.max(X.y,P.clientY),Ce=[];document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th").forEach(Te=>{if(!(Te instanceof HTMLElement)||rn(Te,"[data-feedback-toolbar]")||rn(Te,"[data-annotation-marker]"))return;const xe=Te.getBoundingClientRect();xe.width>window.innerWidth*.8&&xe.height>window.innerHeight*.5||xe.width<10||xe.height<10||xe.left<ye&&xe.right>Q&&xe.top<ge&&xe.bottom>q&&Ce.push({element:Te,rect:xe})});const Se=Ce.filter(({element:Te})=>!Ce.some(({element:xe})=>xe!==Te&&Te.contains(xe))),Re=P.clientX/window.innerWidth*100,Ne=P.clientY+window.scrollY;if(Se.length>0){const Te=Se.reduce((gt,{rect:De})=>({left:Math.min(gt.left,De.left),top:Math.min(gt.top,De.top),right:Math.max(gt.right,De.right),bottom:Math.max(gt.bottom,De.bottom)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0}),xe=Se.slice(0,5).map(({element:gt})=>fa(gt).name).join(", "),kt=Se.length>5?` +${Se.length-5} more`:"",Ct=Se[0].element,un=na(Ct),ut=oa(Ct);z({x:Re,y:Ne,clientY:P.clientY,element:`${Se.length} elements: ${xe}${kt}`,elementPath:"multi-select",boundingBox:{x:Te.left,y:Te.top+window.scrollY,width:Te.right-Te.left,height:Te.bottom-Te.top},isMultiSelect:!0,fullPath:la(Ct),accessibility:ra(Ct),computedStyles:ut,computedStylesObj:un,nearbyElements:ta(Ct),cssClasses:Ol(Ct),nearbyText:zl(Ct),sourceFile:ia(Ct)})}else{const Te=Math.abs(ye-Q),xe=Math.abs(ge-q);Te>20&&xe>20&&z({x:Re,y:Ne,clientY:P.clientY,element:"Area selection",elementPath:`region at (${Math.round(Q)}, ${Math.round(q)})`,boundingBox:{x:Q,y:q+window.scrollY,width:Te,height:xe},isMultiSelect:!0})}Pe(null)}else Y&&(gr.current=!0);Cn.current=null,Vt.current=null,es(!1),Fn.current&&(Fn.current.innerHTML="")};return document.addEventListener("mouseup",v),()=>document.removeEventListener("mouseup",v)},[_,kn]);const Et=C.useCallback(async(v,P,Y)=>{const X=ue.webhookUrl||S;if(!X||!ue.webhooksEnabled&&!Y)return!1;try{return(await fetch(X,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:v,timestamp:Date.now(),url:typeof window<"u"?window.location.href:void 0,...P})})).ok}catch(Q){return console.warn("[Agentation] Webhook failed:",Q),!1}},[S,ue.webhookUrl,ue.webhooksEnabled]),Dn=C.useCallback(v=>{var Y;if(!M)return;const P={id:Date.now().toString(),x:M.x,y:M.y,comment:v,element:M.element,elementPath:M.elementPath,timestamp:Date.now(),selectedText:M.selectedText,boundingBox:M.boundingBox,nearbyText:M.nearbyText,cssClasses:M.cssClasses,isMultiSelect:M.isMultiSelect,isFixed:M.isFixed,fullPath:M.fullPath,accessibility:M.accessibility,computedStyles:M.computedStyles,nearbyElements:M.nearbyElements,reactComponents:M.reactComponents,sourceFile:M.sourceFile,elementBoundingBoxes:M.elementBoundingBoxes,...x&&xt?{sessionId:xt,url:typeof window<"u"?window.location.href:void 0,status:"pending"}:{}};Z(X=>[...X,P]),po.current=P.id,Xe(()=>{po.current=null},300),Xe(()=>{Ao(X=>new Set(X).add(P.id))},250),u==null||u(P),Et("annotation.add",{annotation:P}),_r(!0),Xe(()=>{z(null),_r(!1)},150),(Y=window.getSelection())==null||Y.removeAllRanges(),x&&xt&&sa(x,xt,P).then(X=>{X.id!==P.id&&(Z(Q=>Q.map(q=>q.id===P.id?{...q,id:X.id}:q)),Ao(Q=>{const q=new Set(Q);return q.delete(P.id),q.add(X.id),q}))}).catch(X=>{console.warn("[Agentation] Failed to sync annotation:",X)})},[M,u,Et,x,xt]),An=C.useCallback(()=>{_r(!0),Xe(()=>{z(null),_r(!1)},150)},[]),qn=C.useCallback(v=>{const P=b.findIndex(X=>X.id===v),Y=b[P];(ze==null?void 0:ze.id)===v&&(mo(!0),Xe(()=>{Xn(null),Ft(null),$n([]),mo(!1)},150)),ot(v),Jn(X=>new Set(X).add(v)),Y&&(d==null||d(Y),Et("annotation.delete",{annotation:Y})),x&&lf(x,v).catch(X=>{console.warn("[Agentation] Failed to delete annotation from server:",X)}),Xe(()=>{Z(X=>X.filter(Q=>Q.id!==v)),Jn(X=>{const Q=new Set(X);return Q.delete(v),Q}),ot(null),P<b.length-1&&(Qt(P),Xe(()=>Qt(null),200))},150)},[b,ze,d,Et,x]),Bn=C.useCallback(v=>{var P;if(Xn(v),Ue(null),wt(null),J([]),(P=v.elementBoundingBoxes)!=null&&P.length){const Y=[];for(const X of v.elementBoundingBoxes){const Q=X.x+X.width/2,q=X.y+X.height/2-window.scrollY,ye=Xr(Q,q);ye&&Y.push(ye)}$n(Y),Ft(null)}else if(v.boundingBox){const Y=v.boundingBox,X=Y.x+Y.width/2,Q=v.isFixed?Y.y+Y.height/2:Y.y+Y.height/2-window.scrollY,q=Xr(X,Q);if(q){const ye=q.getBoundingClientRect(),ge=ye.width/Y.width,Ce=ye.height/Y.height;ge<.5||Ce<.5?Ft(null):Ft(q)}else Ft(null);$n([])}else Ft(null),$n([])},[]),an=C.useCallback(v=>{var P;if(!v){Ue(null),wt(null),J([]);return}if(Ue(v.id),(P=v.elementBoundingBoxes)!=null&&P.length){const Y=[];for(const X of v.elementBoundingBoxes){const Q=X.x+X.width/2,q=X.y+X.height/2-window.scrollY,ge=document.elementsFromPoint(Q,q).find(Ce=>!Ce.closest("[data-annotation-marker]")&&!Ce.closest("[data-agentation-root]"));ge&&Y.push(ge)}J(Y),wt(null)}else if(v.boundingBox){const Y=v.boundingBox,X=Y.x+Y.width/2,Q=v.isFixed?Y.y+Y.height/2:Y.y+Y.height/2-window.scrollY,q=Xr(X,Q);if(q){const ye=q.getBoundingClientRect(),ge=ye.width/Y.width,Ce=ye.height/Y.height;ge<.5||Ce<.5?wt(null):wt(q)}else wt(null);J([])}else wt(null),J([])},[]),ga=C.useCallback(v=>{if(!ze)return;const P={...ze,comment:v};Z(Y=>Y.map(X=>X.id===ze.id?P:X)),f==null||f(P),Et("annotation.update",{annotation:P}),x&&i_(x,ze.id,{comment:v}).catch(Y=>{console.warn("[Agentation] Failed to update annotation on server:",Y)}),mo(!0),Xe(()=>{Xn(null),Ft(null),$n([]),mo(!1)},150)},[ze,f,Et,x]),rs=C.useCallback(()=>{mo(!0),Xe(()=>{Xn(null),Ft(null),$n([]),mo(!1)},150)},[]),cn=C.useCallback(()=>{const v=b.length;if(v===0)return;h==null||h(b),Et("annotations.clear",{annotations:b}),x&&Promise.all(b.map(Y=>lf(x,Y.id).catch(X=>{console.warn("[Agentation] Failed to delete annotation from server:",X)}))),Be(!0),se(!0);const P=v*30+200;Xe(()=>{Z([]),Ao(new Set),localStorage.removeItem(ma(tt)),Be(!1)},P),Xe(()=>se(!1),1500)},[tt,b,h,Et,x]),al=C.useCallback(async()=>{const v=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:tt,P=df(b,v,ue.outputDetail,wn);if(P){if($)try{await navigator.clipboard.writeText(P)}catch{}y==null||y(P),I(!0),Xe(()=>I(!1),2e3),ue.autoClearAfterCopy&&Xe(()=>cn(),500)}},[b,tt,ue.outputDetail,wn,ue.autoClearAfterCopy,cn,$,y]),vr=C.useCallback(async()=>{const v=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:tt,P=df(b,v,ue.outputDetail,wn);if(!P)return;p&&p(P,b),de("sending"),await new Promise(X=>Xe(X,150));const Y=await Et("submit",{output:P,annotations:b},!0);de(Y?"sent":"failed"),Xe(()=>de("idle"),2500),Y&&ue.autoClearAfterCopy&&Xe(()=>cn(),500)},[p,Et,b,tt,ue.outputDetail,wn,ue.autoClearAfterCopy,cn]);C.useEffect(()=>{if(!fo)return;const v=10,P=X=>{const Q=X.clientX-fo.x,q=X.clientY-fo.y,ye=Math.sqrt(Q*Q+q*q);if(!hn&&ye>v&&ql(!0),hn||ye>v){let ge=fo.toolbarX+Q,Ce=fo.toolbarY+q;const $e=20,Se=297,Re=44,Te=Se-(_?Mt==="connected"?297:257:44),xe=$e-Te,kt=window.innerWidth-$e-Se;ge=Math.max(xe,Math.min(kt,ge)),Ce=Math.max($e,Math.min(window.innerHeight-Re-$e,Ce)),pr({x:ge,y:Ce})}},Y=()=>{hn&&(hr.current=!0),ql(!1),ct(null)};return document.addEventListener("mousemove",P),document.addEventListener("mouseup",Y),()=>{document.removeEventListener("mousemove",P),document.removeEventListener("mouseup",Y)}},[fo,hn,_,Mt]);const br=C.useCallback(v=>{if(v.target.closest("button")||v.target.closest(`.${j.settingsPanel}`))return;const P=v.currentTarget.parentElement;if(!P)return;const Y=P.getBoundingClientRect(),X=(et==null?void 0:et.x)??Y.left,Q=(et==null?void 0:et.y)??Y.top,q=(Math.random()-.5)*10;nl(q),ct({x:v.clientX,y:v.clientY,toolbarX:X,toolbarY:Q})},[et]);if(C.useEffect(()=>{if(!et)return;const v=()=>{let Q=et.x,q=et.y;const Ce=20-(297-(_?Mt==="connected"?297:257:44)),$e=window.innerWidth-20-297;Q=Math.max(Ce,Math.min($e,Q)),q=Math.max(20,Math.min(window.innerHeight-44-20,q)),(Q!==et.x||q!==et.y)&&pr({x:Q,y:q})};return v(),window.addEventListener("resize",v),()=>window.removeEventListener("resize",v)},[et,_,Mt]),C.useEffect(()=>{const v=P=>{const Y=P.target,X=Y.tagName==="INPUT"||Y.tagName==="TEXTAREA"||Y.isContentEditable;if(P.key==="Escape"){if(pt.length>0){Zn([]);return}M||_&&(Lt(),k(!1))}if((P.metaKey||P.ctrlKey)&&P.shiftKey&&(P.key==="f"||P.key==="F")){P.preventDefault(),Lt(),k(Q=>!Q);return}if(!(X||P.metaKey||P.ctrlKey)&&((P.key==="p"||P.key==="P")&&(P.preventDefault(),Lt(),Ho()),(P.key==="h"||P.key==="H")&&b.length>0&&(P.preventDefault(),Lt(),le(Q=>!Q)),(P.key==="c"||P.key==="C")&&b.length>0&&(P.preventDefault(),Lt(),al()),(P.key==="x"||P.key==="X")&&b.length>0&&(P.preventDefault(),Lt(),cn()),P.key==="s"||P.key==="S")){const Q=Un(ue.webhookUrl)||Un(S||"");b.length>0&&Q&&D==="idle"&&(P.preventDefault(),Lt(),vr())}};return document.addEventListener("keydown",v),()=>document.removeEventListener("keydown",v)},[_,M,b.length,ue.webhookUrl,S,D,vr,Ho,al,cn,pt]),!st||ne)return null;const eo=b.length>0,wr=b.filter(v=>!ol.has(v.id)&&To(v)),ho=b.filter(v=>ol.has(v.id)),_o=v=>{const q=v.x/100*window.innerWidth,ye=typeof v.y=="string"?parseFloat(v.y):v.y,ge={};window.innerHeight-ye-22-10<80&&(ge.top="auto",ge.bottom="calc(100% + 10px)");const $e=q-200/2,Se=10;if($e<Se){const Re=Se-$e;ge.left=`calc(50% + ${Re}px)`}else if($e+200>window.innerWidth-Se){const Re=$e+200-(window.innerWidth-Se);ge.left=`calc(50% - ${Re}px)`}return ge};return qd.createPortal(l.jsxs("div",{ref:G,style:{display:"contents"},children:[l.jsx("div",{className:`${j.toolbar}${N?` ${N}`:""}`,"data-feedback-toolbar":!0,style:et?{left:et.x,top:et.y,right:"auto",bottom:"auto"}:void 0,children:l.jsxs("div",{className:`${j.toolbarContainer} ${Fe?"":j.light} ${_?j.expanded:j.collapsed} ${fr?j.entrance:""} ${he?j.hiding:""} ${hn?j.dragging:""} ${!ue.webhooksEnabled&&(Un(ue.webhookUrl)||Un(S||""))?j.serverConnected:""}`,onClick:_?void 0:v=>{if(hr.current){hr.current=!1,v.preventDefault();return}k(!0)},onMouseDown:br,role:_?void 0:"button",tabIndex:_?-1:0,title:_?void 0:"Start feedback mode",style:{...hn&&{transform:`scale(1.05) rotate(${_a}deg)`,cursor:"grabbing"}},children:[l.jsxs("div",{className:`${j.toggleContent} ${_?j.hidden:j.visible}`,children:[l.jsx($h,{size:24}),eo&&l.jsx("span",{className:`${j.badge} ${_?j.fadeOut:""} ${fr?j.entrance:""}`,style:{backgroundColor:ue.annotationColor},children:b.length})]}),l.jsxs("div",{className:`${j.controlsContent} ${_?j.visible:j.hidden} ${et&&et.y<100?j.tooltipBelow:""} ${Jr||$o?j.tooltipsHidden:""} ${Gn?j.tooltipsInSession:""}`,onMouseEnter:Oo,onMouseLeave:el,children:[l.jsxs("div",{className:`${j.buttonWrapper} ${et&&et.x<120?j.buttonWrapperAlignLeft:""}`,children:[l.jsx("button",{className:`${j.controlButton} ${Fe?"":j.light}`,onClick:v=>{v.stopPropagation(),Lt(),Ho()},"data-active":$t,children:l.jsx(Fh,{size:24,isPaused:$t})}),l.jsxs("span",{className:j.buttonTooltip,children:[$t?"Resume animations":"Pause animations",l.jsx("span",{className:j.shortcut,children:"P"})]})]}),l.jsxs("div",{className:j.buttonWrapper,children:[l.jsx("button",{className:`${j.controlButton} ${Fe?"":j.light}`,onClick:v=>{v.stopPropagation(),Lt(),le(!U)},disabled:!eo,children:l.jsx(Oh,{size:24,isOpen:U})}),l.jsxs("span",{className:j.buttonTooltip,children:[U?"Hide markers":"Show markers",l.jsx("span",{className:j.shortcut,children:"H"})]})]}),l.jsxs("div",{className:j.buttonWrapper,children:[l.jsx("button",{className:`${j.controlButton} ${Fe?"":j.light} ${V?j.statusShowing:""}`,onClick:v=>{v.stopPropagation(),Lt(),al()},disabled:!eo,"data-active":V,children:l.jsx(Mh,{size:24,copied:V})}),l.jsxs("span",{className:j.buttonTooltip,children:["Copy feedback",l.jsx("span",{className:j.shortcut,children:"C"})]})]}),l.jsxs("div",{className:`${j.buttonWrapper} ${j.sendButtonWrapper} ${_&&!ue.webhooksEnabled&&(Un(ue.webhookUrl)||Un(S||""))?j.sendButtonVisible:""}`,children:[l.jsxs("button",{className:`${j.controlButton} ${Fe?"":j.light} ${D==="sent"||D==="failed"?j.statusShowing:""}`,onClick:v=>{v.stopPropagation(),Lt(),vr()},disabled:!eo||!Un(ue.webhookUrl)&&!Un(S||"")||D==="sending","data-no-hover":D==="sent"||D==="failed",tabIndex:Un(ue.webhookUrl)||Un(S||"")?0:-1,children:[l.jsx(zh,{size:24,state:D}),eo&&D==="idle"&&l.jsx("span",{className:`${j.buttonBadge} ${Fe?"":j.light}`,style:{backgroundColor:ue.annotationColor},children:b.length})]}),l.jsxs("span",{className:j.buttonTooltip,children:["Send Annotations",l.jsx("span",{className:j.shortcut,children:"S"})]})]}),l.jsxs("div",{className:j.buttonWrapper,children:[l.jsx("button",{className:`${j.controlButton} ${Fe?"":j.light}`,onClick:v=>{v.stopPropagation(),Lt(),cn()},disabled:!eo,"data-danger":!0,children:l.jsx(Ah,{size:24})}),l.jsxs("span",{className:j.buttonTooltip,children:["Clear all",l.jsx("span",{className:j.shortcut,children:"X"})]})]}),l.jsxs("div",{className:j.buttonWrapper,children:[l.jsx("button",{className:`${j.controlButton} ${Fe?"":j.light}`,onClick:v=>{v.stopPropagation(),Lt(),cr(!$o)},children:l.jsx(Dh,{size:24})}),x&&Mt!=="disconnected"&&l.jsx("span",{className:`${j.mcpIndicator} ${Fe?"":j.light} ${j[Mt]} ${$o?j.hidden:""}`,title:Mt==="connected"?"MCP Connected":"MCP Connecting..."}),l.jsx("span",{className:j.buttonTooltip,children:"Settings"})]}),l.jsx("div",{className:`${j.divider} ${Fe?"":j.light}`}),l.jsxs("div",{className:`${j.buttonWrapper} ${et&&typeof window<"u"&&et.x>window.innerWidth-120?j.buttonWrapperAlignRight:""}`,children:[l.jsx("button",{className:`${j.controlButton} ${Fe?"":j.light}`,onClick:v=>{v.stopPropagation(),Lt(),k(!1)},children:l.jsx(Bh,{size:24})}),l.jsxs("span",{className:j.buttonTooltip,children:["Exit",l.jsx("span",{className:j.shortcut,children:"Esc"})]})]})]}),l.jsx("div",{className:`${j.settingsPanel} ${Fe?j.dark:j.light} ${Ql?j.enter:j.exit}`,onClick:v=>v.stopPropagation(),style:et&&et.y<230?{bottom:"auto",top:"calc(100% + 0.5rem)"}:void 0,children:l.jsxs("div",{className:`${j.settingsPanelContainer} ${ur?j.transitioning:""}`,children:[l.jsxs("div",{className:`${j.settingsPage} ${Mo==="automations"?j.slideLeft:""}`,children:[l.jsxs("div",{className:j.settingsHeader,children:[l.jsxs("span",{className:j.settingsBrand,children:[l.jsx("span",{className:j.settingsBrandSlash,style:{color:ue.annotationColor,transition:"color 0.2s ease"},children:"/"}),"agentation"]}),l.jsxs("span",{className:j.settingsVersion,children:["v","2.3.1"]}),l.jsx("button",{className:j.themeToggle,onClick:()=>Fo(!Fe),title:Fe?"Switch to light mode":"Switch to dark mode",children:l.jsx("span",{className:j.themeIconWrapper,children:l.jsx("span",{className:j.themeIcon,children:Fe?l.jsx(Wh,{size:20}):l.jsx(Yh,{size:20})},Fe?"sun":"moon")})})]}),l.jsxs("div",{className:j.settingsSection,children:[l.jsxs("div",{className:j.settingsRow,children:[l.jsxs("div",{className:`${j.settingsLabel} ${Fe?"":j.light}`,children:["Output Detail",l.jsx(pn,{content:"Controls how much detail is included in the copied output",children:l.jsx("span",{className:j.helpIcon,children:l.jsx(Vr,{size:20})})})]}),l.jsxs("button",{className:`${j.cycleButton} ${Fe?"":j.light}`,onClick:()=>{const P=(Bl.findIndex(Y=>Y.value===ue.outputDetail)+1)%Bl.length;Gt(Y=>({...Y,outputDetail:Bl[P].value}))},children:[l.jsx("span",{className:j.cycleButtonText,children:(to=Bl.find(v=>v.value===ue.outputDetail))==null?void 0:to.label},ue.outputDetail),l.jsx("span",{className:j.cycleDots,children:Bl.map((v,P)=>l.jsx("span",{className:`${j.cycleDot} ${Fe?"":j.light} ${ue.outputDetail===v.value?j.active:""}`},v.value))})]})]}),l.jsxs("div",{className:`${j.settingsRow} ${j.settingsRowMarginTop} ${j.settingsRowDisabled}`,children:[l.jsxs("div",{className:`${j.settingsLabel} ${Fe?"":j.light}`,children:["React Components",l.jsx(pn,{content:"Disabled — production builds minify component names, making detection unreliable. Use in development mode.",children:l.jsx("span",{className:j.helpIcon,children:l.jsx(Vr,{size:20})})})]}),l.jsxs("label",{className:`${j.toggleSwitch} ${j.disabled}`,children:[l.jsx("input",{type:"checkbox",checked:Jl,disabled:!Jl,onChange:()=>Gt(v=>({...v,reactEnabled:!v.reactEnabled}))}),l.jsx("span",{className:j.toggleSlider})]})]}),l.jsxs("div",{className:`${j.settingsRow} ${j.settingsRowMarginTop}`,children:[l.jsxs("div",{className:`${j.settingsLabel} ${Fe?"":j.light}`,children:["Hide Until Restart",l.jsx(pn,{content:"Hides the toolbar until you open a new tab",children:l.jsx("span",{className:j.helpIcon,children:l.jsx(Vr,{size:20})})})]}),l.jsxs("label",{className:j.toggleSwitch,children:[l.jsx("input",{type:"checkbox",checked:!1,onChange:v=>{v.target.checked&&os()}}),l.jsx("span",{className:j.toggleSlider})]})]})]}),l.jsxs("div",{className:j.settingsSection,children:[l.jsx("div",{className:`${j.settingsLabel} ${j.settingsLabelMarker} ${Fe?"":j.light}`,children:"Marker Colour"}),l.jsx("div",{className:j.colorOptions,children:M_.map(v=>l.jsx("div",{role:"button",onClick:()=>Gt(P=>({...P,annotationColor:v.value})),style:{borderColor:ue.annotationColor===v.value?v.value:"transparent"},className:`${j.colorOptionRing} ${ue.annotationColor===v.value?j.selected:""}`,children:l.jsx("div",{className:`${j.colorOption} ${ue.annotationColor===v.value?j.selected:""}`,style:{backgroundColor:v.value},title:v.label})},v.value))})]}),l.jsxs("div",{className:j.settingsSection,children:[l.jsxs("label",{className:j.settingsToggle,children:[l.jsx("input",{type:"checkbox",id:"autoClearAfterCopy",checked:ue.autoClearAfterCopy,onChange:v=>Gt(P=>({...P,autoClearAfterCopy:v.target.checked}))}),l.jsx("label",{className:`${j.customCheckbox} ${ue.autoClearAfterCopy?j.checked:""}`,htmlFor:"autoClearAfterCopy",children:ue.autoClearAfterCopy&&l.jsx(ef,{size:14})}),l.jsxs("span",{className:`${j.toggleLabel} ${Fe?"":j.light}`,children:["Clear on copy/send",l.jsx(pn,{content:"Automatically clear annotations after copying",children:l.jsx("span",{className:`${j.helpIcon} ${j.helpIconNudge2}`,children:l.jsx(Vr,{size:20})})})]})]}),l.jsxs("label",{className:`${j.settingsToggle} ${j.settingsToggleMarginBottom}`,children:[l.jsx("input",{type:"checkbox",id:"blockInteractions",checked:ue.blockInteractions,onChange:v=>Gt(P=>({...P,blockInteractions:v.target.checked}))}),l.jsx("label",{className:`${j.customCheckbox} ${ue.blockInteractions?j.checked:""}`,htmlFor:"blockInteractions",children:ue.blockInteractions&&l.jsx(ef,{size:14})}),l.jsx("span",{className:`${j.toggleLabel} ${Fe?"":j.light}`,children:"Block page interactions"})]})]}),l.jsx("div",{className:`${j.settingsSection} ${j.settingsSectionExtraPadding}`,children:l.jsxs("button",{className:`${j.settingsNavLink} ${Fe?"":j.light}`,onClick:()=>zo("automations"),children:[l.jsx("span",{children:"Manage MCP & Webhooks"}),l.jsxs("span",{className:j.settingsNavLinkRight,children:[x&&Mt!=="disconnected"&&l.jsx("span",{className:`${j.mcpNavIndicator} ${j[Mt]}`}),l.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M7.5 12.5L12 8L7.5 3.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]})]})})]}),l.jsxs("div",{className:`${j.settingsPage} ${j.automationsPage} ${Mo==="automations"?j.slideIn:""}`,children:[l.jsxs("button",{className:`${j.settingsBackButton} ${Fe?"":j.light}`,onClick:()=>zo("main"),children:[l.jsx(Vh,{size:16}),l.jsx("span",{children:"Manage MCP & Webhooks"})]}),l.jsxs("div",{className:j.settingsSection,children:[l.jsxs("div",{className:j.settingsRow,children:[l.jsxs("span",{className:`${j.automationHeader} ${Fe?"":j.light}`,children:["MCP Connection",l.jsx(pn,{content:"Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time.",children:l.jsx("span",{className:`${j.helpIcon} ${j.helpIconNudgeDown}`,children:l.jsx(Vr,{size:20})})})]}),x&&l.jsx("div",{className:`${j.mcpStatusDot} ${j[Mt]}`,title:Mt==="connected"?"Connected":Mt==="connecting"?"Connecting...":"Disconnected"})]}),l.jsxs("p",{className:`${j.automationDescription} ${Fe?"":j.light}`,style:{paddingBottom:6},children:["MCP connection allows agents to receive and act on annotations."," ",l.jsx("a",{href:"https://agentation.dev/mcp",target:"_blank",rel:"noopener noreferrer",className:`${j.learnMoreLink} ${Fe?"":j.light}`,children:"Learn more"})]})]}),l.jsxs("div",{className:`${j.settingsSection} ${j.settingsSectionGrow}`,children:[l.jsxs("div",{className:j.settingsRow,children:[l.jsxs("span",{className:`${j.automationHeader} ${Fe?"":j.light}`,children:["Webhooks",l.jsx(pn,{content:"Send annotation data to any URL endpoint when annotations change. Useful for custom integrations.",children:l.jsx("span",{className:`${j.helpIcon} ${j.helpIconNoNudge}`,children:l.jsx(Vr,{size:20})})})]}),l.jsxs("div",{className:j.autoSendRow,children:[l.jsx("span",{className:`${j.autoSendLabel} ${Fe?"":j.light} ${ue.webhooksEnabled?j.active:""}`,children:"Auto-Send"}),l.jsxs("label",{className:`${j.toggleSwitch} ${ue.webhookUrl?"":j.disabled}`,children:[l.jsx("input",{type:"checkbox",checked:ue.webhooksEnabled,disabled:!ue.webhookUrl,onChange:()=>Gt(v=>({...v,webhooksEnabled:!v.webhooksEnabled}))}),l.jsx("span",{className:j.toggleSlider})]})]})]}),l.jsx("p",{className:`${j.automationDescription} ${Fe?"":j.light}`,children:"The webhook URL will receive live annotation changes and annotation data."}),l.jsx("textarea",{className:`${j.webhookUrlInput} ${Fe?"":j.light}`,placeholder:"Webhook URL",value:ue.webhookUrl,style:{"--marker-color":ue.annotationColor},onKeyDown:v=>v.stopPropagation(),onChange:v=>Gt(P=>({...P,webhookUrl:v.target.value}))})]})]})]})})]})}),l.jsxs("div",{className:j.markersLayer,"data-feedback-toolbar":!0,children:[w&&wr.filter(v=>!v.isFixed).map((v,P)=>{const Y=!fe&&We===v.id,X=mt===v.id,Q=(Y||X)&&!ze,q=v.isMultiSelect,ye=q?"#34C759":ue.annotationColor,ge=b.findIndex(Re=>Re.id===v.id),Ce=!Do.has(v.id),$e=fe?j.exit:Ee?j.clearing:Ce?j.enter:"",Se=Q&&ue.markerClickBehavior==="delete";return l.jsxs("div",{className:`${j.marker} ${q?j.multiSelect:""} ${$e} ${Se?j.hovered:""}`,"data-annotation-marker":!0,style:{left:`${v.x}%`,top:v.y,backgroundColor:Se?void 0:ye,animationDelay:fe?`${(wr.length-1-P)*20}ms`:`${P*20}ms`},onMouseEnter:()=>!fe&&v.id!==po.current&&an(v),onMouseLeave:()=>an(null),onClick:Re=>{Re.stopPropagation(),fe||(ue.markerClickBehavior==="delete"?qn(v.id):Bn(v))},onContextMenu:Re=>{ue.markerClickBehavior==="delete"&&(Re.preventDefault(),Re.stopPropagation(),fe||Bn(v))},children:[Q?Se?l.jsx(Ji,{size:q?18:16}):l.jsx(tf,{size:16}):l.jsx("span",{className:jt!==null&&ge>=jt?j.renumber:void 0,children:ge+1}),Y&&!ze&&l.jsxs("div",{className:`${j.markerTooltip} ${Fe?"":j.light} ${j.enter}`,style:_o(v),children:[l.jsxs("span",{className:j.markerQuote,children:[v.element,v.selectedText&&` "${v.selectedText.slice(0,30)}${v.selectedText.length>30?"...":""}"`]}),l.jsx("span",{className:j.markerNote,children:v.comment})]})]},v.id)}),w&&!fe&&ho.filter(v=>!v.isFixed).map(v=>{const P=v.isMultiSelect;return l.jsx("div",{className:`${j.marker} ${j.hovered} ${P?j.multiSelect:""} ${j.exit}`,"data-annotation-marker":!0,style:{left:`${v.x}%`,top:v.y},children:l.jsx(Ji,{size:P?12:10})},v.id)})]}),l.jsxs("div",{className:j.fixedMarkersLayer,"data-feedback-toolbar":!0,children:[w&&wr.filter(v=>v.isFixed).map((v,P)=>{const Y=wr.filter(Ne=>Ne.isFixed),X=!fe&&We===v.id,Q=mt===v.id,q=(X||Q)&&!ze,ye=v.isMultiSelect,ge=ye?"#34C759":ue.annotationColor,Ce=b.findIndex(Ne=>Ne.id===v.id),$e=!Do.has(v.id),Se=fe?j.exit:Ee?j.clearing:$e?j.enter:"",Re=q&&ue.markerClickBehavior==="delete";return l.jsxs("div",{className:`${j.marker} ${j.fixed} ${ye?j.multiSelect:""} ${Se} ${Re?j.hovered:""}`,"data-annotation-marker":!0,style:{left:`${v.x}%`,top:v.y,backgroundColor:Re?void 0:ge,animationDelay:fe?`${(Y.length-1-P)*20}ms`:`${P*20}ms`},onMouseEnter:()=>!fe&&v.id!==po.current&&an(v),onMouseLeave:()=>an(null),onClick:Ne=>{Ne.stopPropagation(),fe||(ue.markerClickBehavior==="delete"?qn(v.id):Bn(v))},onContextMenu:Ne=>{ue.markerClickBehavior==="delete"&&(Ne.preventDefault(),Ne.stopPropagation(),fe||Bn(v))},children:[q?Re?l.jsx(Ji,{size:ye?18:16}):l.jsx(tf,{size:16}):l.jsx("span",{className:jt!==null&&Ce>=jt?j.renumber:void 0,children:Ce+1}),X&&!ze&&l.jsxs("div",{className:`${j.markerTooltip} ${Fe?"":j.light} ${j.enter}`,style:_o(v),children:[l.jsxs("span",{className:j.markerQuote,children:[v.element,v.selectedText&&` "${v.selectedText.slice(0,30)}${v.selectedText.length>30?"...":""}"`]}),l.jsx("span",{className:j.markerNote,children:v.comment})]})]},v.id)}),w&&!fe&&ho.filter(v=>v.isFixed).map(v=>{const P=v.isMultiSelect;return l.jsx("div",{className:`${j.marker} ${j.fixed} ${j.hovered} ${P?j.multiSelect:""} ${j.exit}`,"data-annotation-marker":!0,style:{left:`${v.x}%`,top:v.y},children:l.jsx(Th,{size:P?12:10})},v.id)})]}),_&&l.jsxs("div",{className:j.overlay,"data-feedback-toolbar":!0,style:M||ze?{zIndex:99999}:void 0,children:[(ce==null?void 0:ce.rect)&&!M&&!Zr&&!kn&&l.jsx("div",{className:`${j.hoverHighlight} ${j.enter}`,style:{left:ce.rect.left,top:ce.rect.top,width:ce.rect.width,height:ce.rect.height,borderColor:`${ue.annotationColor}80`,backgroundColor:`${ue.annotationColor}0A`}}),pt.filter(v=>document.contains(v.element)).map((v,P)=>{const Y=v.element.getBoundingClientRect(),X=pt.length>1;return l.jsx("div",{className:X?j.multiSelectOutline:j.singleSelectOutline,style:{position:"fixed",left:Y.left,top:Y.top,width:Y.width,height:Y.height,...X?{}:{borderColor:`${ue.annotationColor}99`,backgroundColor:`${ue.annotationColor}0D`}}},P)}),We&&!M&&(()=>{var Q;const v=b.find(q=>q.id===We);if(!(v!=null&&v.boundingBox))return null;if((Q=v.elementBoundingBoxes)!=null&&Q.length)return Ro.length>0?Ro.filter(q=>document.contains(q)).map((q,ye)=>{const ge=q.getBoundingClientRect();return l.jsx("div",{className:`${j.multiSelectOutline} ${j.enter}`,style:{left:ge.left,top:ge.top,width:ge.width,height:ge.height}},`hover-outline-live-${ye}`)}):v.elementBoundingBoxes.map((q,ye)=>l.jsx("div",{className:`${j.multiSelectOutline} ${j.enter}`,style:{left:q.x,top:q.y-Mn,width:q.width,height:q.height}},`hover-outline-${ye}`));const P=nt&&document.contains(nt)?nt.getBoundingClientRect():null,Y=P?{x:P.left,y:P.top,width:P.width,height:P.height}:{x:v.boundingBox.x,y:v.isFixed?v.boundingBox.y:v.boundingBox.y-Mn,width:v.boundingBox.width,height:v.boundingBox.height},X=v.isMultiSelect;return l.jsx("div",{className:`${X?j.multiSelectOutline:j.singleSelectOutline} ${j.enter}`,style:{left:Y.x,top:Y.y,width:Y.width,height:Y.height,...X?{}:{borderColor:`${ue.annotationColor}99`,backgroundColor:`${ue.annotationColor}0D`}}})})(),ce&&!M&&!Zr&&!kn&&l.jsxs("div",{className:`${j.hoverTooltip} ${j.enter}`,style:{left:Math.max(8,Math.min(O.x,window.innerWidth-100)),top:Math.max(O.y-(ce.reactComponents?48:32),8)},children:[ce.reactComponents&&l.jsx("div",{className:j.hoverReactPath,children:ce.reactComponents}),l.jsx("div",{className:j.hoverElementName,children:ce.elementName})]}),M&&l.jsxs(l.Fragment,{children:[(Uo=M.multiSelectElements)!=null&&Uo.length?M.multiSelectElements.filter(v=>document.contains(v)).map((v,P)=>{const Y=v.getBoundingClientRect();return l.jsx("div",{className:`${j.multiSelectOutline} ${Dt?j.exit:j.enter}`,style:{left:Y.left,top:Y.top,width:Y.width,height:Y.height}},`pending-multi-${P}`)}):M.targetElement&&document.contains(M.targetElement)?(()=>{const v=M.targetElement.getBoundingClientRect();return l.jsx("div",{className:`${j.singleSelectOutline} ${Dt?j.exit:j.enter}`,style:{left:v.left,top:v.top,width:v.width,height:v.height,borderColor:`${ue.annotationColor}99`,backgroundColor:`${ue.annotationColor}0D`}})})():M.boundingBox&&l.jsx("div",{className:`${M.isMultiSelect?j.multiSelectOutline:j.singleSelectOutline} ${Dt?j.exit:j.enter}`,style:{left:M.boundingBox.x,top:M.boundingBox.y-Mn,width:M.boundingBox.width,height:M.boundingBox.height,...M.isMultiSelect?{}:{borderColor:`${ue.annotationColor}99`,backgroundColor:`${ue.annotationColor}0D`}}}),(()=>{const v=M.x,P=M.isFixed?M.y:M.y-Mn;return l.jsxs(l.Fragment,{children:[l.jsx("div",{className:`${j.marker} ${j.pending} ${M.isMultiSelect?j.multiSelect:""} ${Dt?j.exit:j.enter}`,style:{left:`${v}%`,top:P,backgroundColor:M.isMultiSelect?"#34C759":ue.annotationColor},children:l.jsx(Rh,{size:12})}),l.jsx(of,{ref:ns,element:M.element,selectedText:M.selectedText,computedStyles:M.computedStylesObj,placeholder:M.element==="Area selection"?"What should change in this area?":M.isMultiSelect?"Feedback for this group of elements...":"What should change?",onSubmit:Dn,onCancel:An,isExiting:Dt,lightMode:!Fe,accentColor:M.isMultiSelect?"#34C759":ue.annotationColor,style:{left:Math.max(160,Math.min(window.innerWidth-160,v/100*window.innerWidth)),...P>window.innerHeight-290?{bottom:window.innerHeight-P+20}:{top:P+20}}})]})})()]}),ze&&l.jsxs(l.Fragment,{children:[(ls=ze.elementBoundingBoxes)!=null&&ls.length?ar.length>0?ar.filter(v=>document.contains(v)).map((v,P)=>{const Y=v.getBoundingClientRect();return l.jsx("div",{className:`${j.multiSelectOutline} ${j.enter}`,style:{left:Y.left,top:Y.top,width:Y.width,height:Y.height}},`edit-multi-live-${P}`)}):ze.elementBoundingBoxes.map((v,P)=>l.jsx("div",{className:`${j.multiSelectOutline} ${j.enter}`,style:{left:v.x,top:v.y-Mn,width:v.width,height:v.height}},`edit-multi-${P}`)):(()=>{const v=Qn&&document.contains(Qn)?Qn.getBoundingClientRect():null,P=v?{x:v.left,y:v.top,width:v.width,height:v.height}:ze.boundingBox?{x:ze.boundingBox.x,y:ze.isFixed?ze.boundingBox.y:ze.boundingBox.y-Mn,width:ze.boundingBox.width,height:ze.boundingBox.height}:null;return P?l.jsx("div",{className:`${ze.isMultiSelect?j.multiSelectOutline:j.singleSelectOutline} ${j.enter}`,style:{left:P.x,top:P.y,width:P.width,height:P.height,...ze.isMultiSelect?{}:{borderColor:`${ue.annotationColor}99`,backgroundColor:`${ue.annotationColor}0D`}}}):null})(),l.jsx(of,{ref:yr,element:ze.element,selectedText:ze.selectedText,computedStyles:n_(ze.computedStyles),placeholder:"Edit your feedback...",initialValue:ze.comment,submitLabel:"Save",onSubmit:ga,onCancel:rs,onDelete:()=>qn(ze.id),isExiting:sn,lightMode:!Fe,accentColor:ze.isMultiSelect?"#34C759":ue.annotationColor,style:(()=>{const v=ze.isFixed?ze.y:ze.y-Mn;return{left:Math.max(160,Math.min(window.innerWidth-160,ze.x/100*window.innerWidth)),...v>window.innerHeight-290?{bottom:window.innerHeight-v+20}:{top:v+20}}})()})]}),kn&&l.jsxs(l.Fragment,{children:[l.jsx("div",{ref:Sn,className:j.dragSelection}),l.jsx("div",{ref:Fn,className:j.highlightsContainer})]})]})]}),document.body)}function O_(){const o=W(G=>G.config),a=W(G=>G.isPanoramic),i=W(G=>G.initScreens),u=W(G=>G.hydrateSession),d=W(G=>G.setPreviewSize),f=W(G=>G.setFonts),h=W(G=>G.setFrames),y=W(G=>G.setDeviceFamilies),p=W(G=>G.setKoubouAvailable),$=W(G=>G.setSizes),x=W(G=>G.setExportSize),L=W(G=>G.activeTab),g=W(G=>G.undo),S=W(G=>G.redo),[N,_]=C.useState(null),k=typeof window<"u"?window.innerWidth<768:!1,b=typeof window<"u"?new URLSearchParams(window.location.search).get("agentation")==="1"||window.localStorage.getItem("appframe:agentation")==="1":!1,[Z,U]=C.useState(k),[le,ne]=C.useState(!k),[ie,he]=C.useState(b);if(C.useEffect(()=>{const G=w=>{var H;if(!(w.metaKey||w.ctrlKey)||w.key.toLowerCase()!=="z")return;const fe=(H=w.target)==null?void 0:H.tagName;fe==="INPUT"||fe==="TEXTAREA"||fe==="SELECT"||(w.preventDefault(),w.shiftKey?S():g())};return window.addEventListener("keydown",G),()=>window.removeEventListener("keydown",G)},[g,S]),C.useEffect(()=>{async function G(){try{const[w,ke,fe]=await Promise.all([xf(),Np(),Ep()]),H=w.app.platforms[0]??"iphone",ce=pc(H);d(ce.w,ce.h),f(ke),h(fe),i(w,H);try{const Pe=await Cp();Pe&&Array.isArray(Pe.variants)&&Pe.variants.length>0&&u(Pe)}catch{}try{const O=(await Pp()).families;y(O),p(!0)}catch{p(!1)}try{const Pe=await Lp(),O={};for(const[M,z]of Object.entries(Pe))O[M]=z;$(O);const je=ha(O,H);je&&x(je)}catch{}}catch(w){_(w instanceof Error?w.message:"Failed to load project")}}G()},[i,u,d,f,h,y,p,$,x]),C.useEffect(()=>{const G=()=>{const w=window.innerWidth<768;U(w),w||ne(!0)};return G(),window.addEventListener("resize",G),()=>window.removeEventListener("resize",G)},[]),C.useEffect(()=>{window.localStorage.setItem("appframe:agentation",ie?"1":"0")},[ie]),N)return l.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-red-400",children:l.jsx("p",{children:N})});if(!o)return l.jsx("div",{className:"h-dvh flex items-center justify-center bg-bg text-text-dim",children:l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsxs("svg",{className:"animate-spin h-4 w-4 text-accent",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[l.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),l.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"})]}),"Loading..."]})});const re=a?l.jsxs(l.Fragment,{children:[L==="variants"&&l.jsx(Kd,{}),L==="background"&&l.jsx(bh,{}),L==="device"&&l.jsx(wh,{}),L==="text"&&l.jsx(kh,{}),L==="extras"&&l.jsx(Ch,{}),L==="export"&&l.jsx(Qd,{})]}):l.jsxs(l.Fragment,{children:[L==="variants"&&l.jsx(Kd,{}),L==="background"&&l.jsx(Bp,{}),L==="device"&&l.jsx(qp,{}),L==="text"&&l.jsx(oh,{}),L==="extras"&&l.jsx(lh,{}),L==="export"&&l.jsx(Qd,{})]});return l.jsxs("div",{className:"h-dvh flex flex-col overflow-hidden",children:[l.jsx(zp,{sidebarOpen:le,onToggleSidebar:()=>ne(G=>!G),showSidebarToggle:Z,agentMode:ie,onToggleAgentMode:()=>he(G=>!G)}),l.jsxs("div",{className:"flex-1 flex overflow-hidden min-h-0 flex-col md:flex-row",children:[l.jsx("div",{id:"editor-sidebar",className:`${le?"flex":"hidden"} md:flex w-full md:w-80 md:min-w-80 max-h-[45vh] md:max-h-none bg-surface border-b md:border-b-0 md:border-r border-border flex-col shrink-0`,children:l.jsx("div",{className:"flex-1 overflow-y-auto",children:re})}),a?l.jsx(Ph,{}):l.jsx(Eh,{})]}),ie&&l.jsx(z_,{endpoint:"http://localhost:4747"})]})}const Rf=document.getElementById("root");if(!Rf)throw new Error("Root element not found");sp.createRoot(Rf).render(l.jsx(C.StrictMode,{children:l.jsx(O_,{})}));
