import{$ as e,G as t,H as n,J as r,K as i,Q as a,U as o,V as s,W as c,X as l,Y as ee,Z as te,et as u,i as d,q as f,u as p}from"./_plugin-vue_export-helper-BgAB-K8Y.js";var m=void 0,h=typeof window<`u`&&window.trustedTypes;if(h)try{m=h.createPolicy(`vue`,{createHTML:e=>e})}catch{}var g=m?e=>m.createHTML(e):e=>e,ne=`http://www.w3.org/2000/svg`,_=`http://www.w3.org/1998/Math/MathML`,v=typeof document<`u`?document:null,y=v&&v.createElement(`template`),b={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let i=t===`svg`?v.createElementNS(ne,e):t===`mathml`?v.createElementNS(_,e):n?v.createElement(e,{is:n}):v.createElement(e);return e===`select`&&r&&r.multiple!=null&&i.setAttribute(`multiple`,r.multiple),i},createText:e=>v.createTextNode(e),createComment:e=>v.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>v.querySelector(e),setScopeId(e,t){e.setAttribute(t,``)},insertStaticContent(e,t,n,r,i,a){let o=n?n.previousSibling:t.lastChild;if(i&&(i===a||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),n),i!==a&&(i=i.nextSibling););else{y.innerHTML=g(r===`svg`?`<svg>${e}</svg>`:r===`mathml`?`<math>${e}</math>`:e);let i=y.content;if(r===`svg`||r===`mathml`){let e=i.firstChild;for(;e.firstChild;)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},x=Symbol(`_vtc`);function S(e,t,n){let r=e[x];r&&(t=(t?[t,...r]:[...r]).join(` `)),t==null?e.removeAttribute(`class`):n?e.setAttribute(`class`,t):e.className=t}var C=Symbol(`_vod`),w=Symbol(`_vsh`),T=Symbol(``),E=/(?:^|;)\s*display\s*:/;function re(e,t,n){let r=e.style,i=a(n),o=!1;if(n&&!i){if(t){if(a(t))for(let e of t.split(`;`)){let t=e.slice(0,e.indexOf(`:`)).trim();n[t]??O(r,t,``)}else for(let e in t)n[e]??O(r,e,``)}for(let i in n){i===`display`&&(o=!0);let s=n[i];s==null?O(r,i,``):M(e,i,!a(t)&&t?t[i]:void 0,s)||O(r,i,s)}}else if(i){if(t!==n){let e=r[T];e&&(n+=`;`+e),r.cssText=n,o=E.test(n)}}else t&&e.removeAttribute(`style`);C in e&&(e[C]=o?r.display:``,e[w]&&(r.display=`none`))}var D=/\s*!important$/;function O(e,t,n){if(f(n))n.forEach(n=>O(e,t,n));else if(n??=``,t.startsWith(`--`))D.test(n)?e.setProperty(t,n.replace(D,``),`important`):e.setProperty(t,n);else{let r=j(e,t);D.test(n)?e.setProperty(c(r),n.replace(D,``),`important`):e[r]=n}}var k=[`Webkit`,`Moz`,`ms`],A={};function j(e,t){let r=A[t];if(r)return r;let i=s(t);if(i!==`filter`&&i in e)return A[t]=i;i=n(i);for(let n=0;n<k.length;n++){let r=k[n]+i;if(r in e)return A[t]=r}return t}function M(e,t,n,r){return e.tagName===`TEXTAREA`&&(t===`width`||t===`height`)&&a(r)&&n===r}var N=`http://www.w3.org/1999/xlink`;function P(n,r,i,a,o,s=te(r)){a&&r.startsWith(`xlink:`)?i==null?n.removeAttributeNS(N,r.slice(6,r.length)):n.setAttributeNS(N,r,i):i==null||s&&!t(i)?n.removeAttribute(r):n.setAttribute(r,s?``:e(i)?String(i):i)}function F(e,n,r,i,a){if(n===`innerHTML`||n===`textContent`){r!=null&&(e[n]=n===`innerHTML`?g(r):r);return}let o=e.tagName;if(n===`value`&&o!==`PROGRESS`&&!o.includes(`-`)){let t=o===`OPTION`?e.getAttribute(`value`)||``:e.value,i=r==null?e.type===`checkbox`?`on`:``:String(r);(t!==i||!(`_value`in e))&&(e.value=i),r??e.removeAttribute(n),e._value=r;return}let s=!1;if(r===``||r==null){let i=typeof e[n];i===`boolean`?r=t(r):r==null&&i===`string`?(r=``,s=!0):i===`number`&&(r=0,s=!0)}try{e[n]=r}catch{}s&&e.removeAttribute(a||n)}function I(e,t,n,r){e.addEventListener(t,n,r)}function L(e,t,n,r){e.removeEventListener(t,n,r)}var R=Symbol(`_vei`);function z(e,t,n,r,i=null){let a=e[R]||(e[R]={}),o=a[t];if(r&&o)o.value=r;else{let[n,s]=H(t);r?I(e,n,a[t]=G(r,i),s):o&&(L(e,n,o,s),a[t]=void 0)}}var B=/(Once|Passive|Capture)$/,V=/^on:?(?:Once|Passive|Capture)$/;function H(e){let t,n;for(;(n=e.match(B))&&!V.test(e);)t||={},e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===`:`?e.slice(3):c(e.slice(2)),t]}var U=0,W=Promise.resolve(),ie=()=>U||=(W.then(()=>U=0),Date.now());function G(e,t){let n=e=>{if(!e._vts)e._vts=Date.now();else if(e._vts<=n.attached)return;let r=n.value;if(f(r)){let n=e.stopImmediatePropagation;e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0};let i=r.slice(),a=[e];for(let n=0;n<i.length&&!e._stopped;n++){let e=i[n];e&&d(e,t,5,a)}}else d(r,t,5,[e])};return n.value=e,n.attached=ie(),n}var K=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,q=(e,t,n,r,i,o)=>{let c=i===`svg`;t===`class`?S(e,r,c):t===`style`?re(e,n,r):l(t)?ee(t)||z(e,t,n,r,o):(t[0]===`.`?(t=t.slice(1),1):t[0]===`^`?(t=t.slice(1),0):J(e,t,r,c))?(F(e,t,r),!e.tagName.includes(`-`)&&(t===`value`||t===`checked`||t===`selected`)&&P(e,t,r,c,o,t!==`value`)):e._isVueCE&&(Y(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!a(r)))?F(e,s(t),r,o,t):(t===`true-value`?e._trueValue=r:t===`false-value`&&(e._falseValue=r),P(e,t,r,c))};function J(e,t,n,i){if(i)return!!(t===`innerHTML`||t===`textContent`||t in e&&K(t)&&r(n));if(t===`spellcheck`||t===`draggable`||t===`translate`||t===`autocorrect`||t===`sandbox`&&e.tagName===`IFRAME`||t===`form`||t===`list`&&e.tagName===`INPUT`||t===`type`&&e.tagName===`TEXTAREA`)return!1;if(t===`width`||t===`height`){let t=e.tagName;if(t===`IMG`||t===`VIDEO`||t===`CANVAS`||t===`SOURCE`)return!1}return K(t)&&a(n)?!1:t in e}function Y(e,t){let n=e._def.props;if(!n)return!1;let r=s(t);return Array.isArray(n)?n.some(e=>s(e)===r):Object.keys(n).some(e=>s(e)===r)}var X=e=>{let t=e.props[`onUpdate:modelValue`]||!1;return f(t)?e=>i(t,e):t},Z=Symbol(`_assign`),ae={created(e,{value:t},n){e.checked=u(t,n.props.value),e[Z]=X(n),I(e,`change`,()=>{e[Z](oe(e))})},beforeUpdate(e,{value:t,oldValue:n},r){e[Z]=X(r),t!==n&&(e.checked=u(t,r.props.value))}};function oe(e){return`_value`in e?e._value:e.value}var Q=[`ctrl`,`shift`,`alt`,`meta`],se={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>`button`in e&&e.button!==0,middle:e=>`button`in e&&e.button!==1,right:e=>`button`in e&&e.button!==2,exact:(e,t)=>Q.some(n=>e[`${n}Key`]&&!t.includes(n))},ce=(e,t)=>{if(!e)return e;let n=e._withMods||={},r=t.join(`.`);return n[r]||(n[r]=((n,...r)=>{for(let e=0;e<t.length;e++){let r=se[t[e]];if(r&&r(n,t))return}return e(n,...r)}))},le=o({patchProp:q},b),ue;function de(){return ue||=p(le)}var fe=((...e)=>{let t=de().createApp(...e),{mount:n}=t;return t.mount=e=>{let i=me(e);if(!i)return;let a=t._component;!r(a)&&!a.render&&!a.template&&(a.template=i.innerHTML),i.nodeType===1&&(i.textContent=``);let o=n(i,!1,pe(i));return i instanceof Element&&(i.removeAttribute(`v-cloak`),i.setAttribute(`data-v-app`,``)),o},t});function pe(e){if(e instanceof SVGElement)return`svg`;if(typeof MathMLElement==`function`&&e instanceof MathMLElement)return`mathml`}function me(e){return a(e)?document.querySelector(e):e}var $=new CSSStyleSheet;$.replaceSync(`@layer kern-ux-icons {
	
		.kern-icon--arrow-back {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTI3NC00NTAgMjI3IDIyN3E5IDkgOSAyMXQtOSAyMXEtOSA5LTIxIDl0LTIxLTlMMTgxLTQ1OXEtNS01LTctMTB0LTItMTFxMC02IDItMTF0Ny0xMGwyNzgtMjc4cTktOSAyMS05dDIxIDlxOSA5IDkgMjF0LTkgMjFMMjc0LTUxMGg0OTZxMTMgMCAyMS41IDguNVQ4MDAtNDgwcTAgMTMtOC41IDIxLjVUNzcwLTQ1MEgyNzRaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--arrow-back {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTI3NC00NTAgMjI3IDIyN3E5IDkgOSAyMXQtOSAyMXEtOSA5LTIxIDl0LTIxLTlMMTgxLTQ1OXEtNS01LTctMTB0LTItMTFxMC02IDItMTF0Ny0xMGwyNzgtMjc4cTktOSAyMS05dDIxIDlxOSA5IDkgMjF0LTkgMjFMMjc0LTUxMGg0OTZxMTMgMCAyMS41IDguNVQ4MDAtNDgwcTAgMTMtOC41IDIxLjVUNzcwLTQ1MEgyNzRaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--arrow-forward {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTY4Ni00NTBIMTkwcS0xMyAwLTIxLjUtOC41VDE2MC00ODBxMC0xMyA4LjUtMjEuNVQxOTAtNTEwaDQ5Nkw0NTktNzM3cS05LTktOS0yMXQ5LTIxcTktOSAyMS05dDIxIDlsMjc4IDI3OHE1IDUgNyAxMHQyIDExcTAgNi0yIDExdC03IDEwTDUwMS0xODFxLTkgOS0yMSA5dC0yMS05cS05LTktOS0yMXQ5LTIxbDIyNy0yMjdaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--check {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTM3OC0zMzIgMzYzLTM2M3E5LTkgMjEuNS05dDIxLjUgOXE5IDkgOSAyMS41dC05IDIxLjVMMzk5LTI2N3EtOSA5LTIxIDl0LTIxLTlMMTc1LTQ0OXEtOS05LTguNS0yMS41VDE3Ni00OTJxOS05IDIxLjUtOXQyMS41IDlsMTU5IDE2MFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--content-copy {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTMwMC0yMDBxLTI0IDAtNDItMTh0LTE4LTQydi01NjBxMC0yNCAxOC00MnQ0Mi0xOGg0NDBxMjQgMCA0MiAxOHQxOCA0MnY1NjBxMCAyNC0xOCA0MnQtNDIgMThIMzAwWk0xODAtODBxLTI0IDAtNDItMTh0LTE4LTQydi01OTBxMC0xMyA4LjUtMjEuNVQxNTAtNzYwcTEzIDAgMjEuNSA4LjVUMTgwLTczMHY1OTBoNDcwcTEzIDAgMjEuNSA4LjVUNjgwLTExMHEwIDEzLTguNSAyMS41VDY1MC04MEgxODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--home {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIyMC0xODBoMTUwdi0yMjBxMC0xMi43NSA4LjYzLTIxLjM4UTM4Ny4yNS00MzAgNDAwLTQzMGgxNjBxMTIuNzUgMCAyMS4zOCA4LjYyUTU5MC00MTIuNzUgNTkwLTQwMHYyMjBoMTUwdi0zOTBMNDgwLTc2NSAyMjAtNTcwdjM5MFptLTYwIDB2LTM5MHEwLTE0LjI1IDYuMzgtMjcgNi4zNy0xMi43NSAxNy42Mi0yMWwyNjAtMTk1cTE1LjY4LTEyIDM1Ljg0LTEyUTUwMC04MjUgNTE2LTgxM2wyNjAgMTk1cTExLjI1IDguMjUgMTcuNjMgMjEgNi4zNyAxMi43NSA2LjM3IDI3djM5MHEwIDI0Ljc1LTE3LjYyIDQyLjM3UTc2NC43NS0xMjAgNzQwLTEyMEg1NjBxLTEyLjc1IDAtMjEuMzctOC42M1E1MzAtMTM3LjI1IDUzMC0xNTB2LTIyMEg0MzB2MjIwcTAgMTIuNzUtOC42MiAyMS4zN1E0MTIuNzUtMTIwIDQwMC0xMjBIMjIwcS0yNC43NSAwLTQyLjM3LTE3LjYzUTE2MC0xNTUuMjUgMTYwLTE4MFptMzIwLTI5M1oiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--school {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIyMC0yNjJxLTE0LTgtMjIuNS0yMS44OFExODktMjk3Ljc1IDE4OS0zMTV2LTIwNEw4OS01NzRxLTgtNS0xMi0xMS41My00LTYuNTItNC0xNC41IDAtNy45NyA0LTE0LjQ3IDQtNi41IDEyLTExLjVsMzYxLTE5OHE3LTQgMTQtNS41dDE1LTEuNXE4IDAgMTUgMS41dDE0IDUuNWwzOTYgMjE1cTggNSAxMiAxMS45NyA0IDYuOTYgNCAxNS4wM3YyNjlxMCAxMi43NS04LjY4IDIxLjM3LTguNjcgOC42My0yMS41IDguNjMtMTIuODIgMC0yMS4zMi04LjYzLTguNS04LjYyLTguNS0yMS4zN3YtMjUybC05MSA0NnYyMDRxMCAxNy4yNS04LjUgMzEuMTJRNzUyLTI3MCA3MzgtMjYyTDUwOC0xMzZxLTcgNC0xNCA1LjV0LTE1IDEuNXEtOCAwLTE1LTEuNXQtMTQtNS41TDIyMC0yNjJabTI1OS0xNjYgMzE1LTE3Mi0zMTUtMTY5LTMxMyAxNjkgMzEzIDE3MlptMCAyNDAgMjMwLTEyN3YtMTY4TDUwOC0zNzVxLTcgNC0xNCA1LjV0LTE1IDEuNXEtOCAwLTE0LjUtMS41VDQ1MS0zNzVMMjQ5LTQ4NXYxNzBsMjMwIDEyN1ptMS0yNDBabS0xIDkwWm0wIDBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--book-5 {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTI3MC04MHEtNDUgMC03Ny41LTI5LjY0UTE2MC0xMzkuMjcgMTYwLTE4M3YtNTY0cTAtMzYuNTcgMjIuMTItNjUuNDNRMjA0LjI0LTg0MS4zIDI0MC04NDlsMzA4LTY0cTI4LTYgNTAgMTIuMTRUNjIwLTg1NHY0OTdxMCAyMS4xNi0xMyAzNy41OFE1OTQtMzAzIDU3My0yOThsLTMxMyA2N3EtMTcuMTQgMy42OS0yOC41NyAxNy41NFEyMjAtMTk5LjYyIDIyMC0xODNxMCAxOSAxNSAzMXQzNSAxMmg0NzB2LTYzMHEwLTEyLjc1IDguNjgtMjEuMzggOC42Ny04LjYyIDIxLjUtOC42MiAxMi44MiAwIDIxLjMyIDguNjIgOC41IDguNjMgOC41IDIxLjM4djYzMHEwIDI0Ljc1LTE3LjYyIDQyLjM3UTc2NC43NS04MCA3NDAtODBIMjcwWm03MC0yMjggMjIwLTQ3di00OTlsLTIyMCA0NXY1MDFabS02MCAxMi44MVYtNzk2bC0yMCA0cS0xNyA0LTI4LjUgMTUuODNRMjIwLTc2NC4zNSAyMjAtNzQ3djQ3MXE5LjA2LTUuMiAxOS4wMy05LjFRMjQ5LTI4OSAyNjAtMjkxbDIwLTQuMTlaTTIyMC03OTJ2NTE2LTUxNloiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--open-in-new {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi02MDBxMC0yNCAxOC00MnQ0Mi0xOGgyNDlxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNUgxODB2NjAwaDYwMHYtMjQ5cTAtMTIuNzUgOC42OC0yMS4zOCA4LjY3LTguNjIgMjEuNS04LjYyIDEyLjgyIDAgMjEuMzIgOC42MiA4LjUgOC42MyA4LjUgMjEuMzh2MjQ5cTAgMjQtMTggNDJ0LTQyIDE4SDE4MFptNjAwLTYxN0w0MDMtMzYwcS05IDktMjEgOC41dC0yMS05LjVxLTktOS05LTIxdDktMjFsMzc3LTM3N0g1NDlxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoMjYxcTEyLjc1IDAgMjEuMzggOC42MlE4NDAtODIyLjc1IDg0MC04MTB2MjYxcTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42My04LjUtOC42Mi04LjUtMjEuMzd2LTE4OFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--ar-stickers {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIxMC41LTgxUTExMC0xMjIgMTEwLTE5MnEwLTMyIDMwLjUtNjMuNVQyMzEtMzA3bDUyIDQ2cS03NiAyNC05NC41IDQxLjVUMTcwLTE5MnEwIDIzIDgwLjUgNTVUNDgwLTEwNXExNDkgMCAyMjkuNS0zMnQ4MC41LTU1cTAtMTAtMTguNS0yNy41VDY3Ny0yNjFsNTMtNDZxNjAgMjAgOTAgNTEuNXQzMCA2My41cTAgNzAtMTAwLjUgMTExVDQ4MC00MHEtMTY5IDAtMjY5LjUtNDFaTTQ0My0yMDkuNXEtMTctOC41LTMzLTIwLjVMMTM0LTQ2N3EtMTEtMTAtMTcuNS0yMi41VDExMC01MTZ2LTc4cTAtMTQgNi41LTI1dDE2LjUtMjBsMjc2LTI1NnExNC0xNCAzMi41LTIwdDM4LjUtNnEyMCAwIDM4LjUgNnQzMi41IDIwbDI3NiAyNTZxMTAgOSAxNi41IDIwdDYuNSAyNXY3OHEwIDE0LTYuNSAyNi41VDgyNi00NjdMNTUwLTIzMHEtMTYgMTItMzMgMjAuNXQtMzcgOC41cS0yMCAwLTM3LTguNVpNMzg0LTU3MXExNC0xNCAxNC0zNHQtMTQtMzRxLTE0LTE0LTM0LTE0dC0zNCAxNHEtMTQgMTQtMTQgMzR0MTQgMzRxMTQgMTQgMzQgMTR0MzQtMTRabTMxIDc1cTQ1IDIwIDkzIDEwLjV0ODQtNDIuNXEzMy0yOSA0My41LTcxdC02LjUtODNMNDE1LTQ5NlptOTktMjAxcTE0LTE0IDE0LTM0dC0xNC0zNHEtMTQtMTQtMzQtMTR0LTM0IDE0cS0xNCAxNC0xNCAzNHQxNCAzNHExNCAxNCAzNCAxNHQzNC0xNFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--open-in-new {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi02MDBxMC0yNCAxOC00MnQ0Mi0xOGgyNDlxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNUgxODB2NjAwaDYwMHYtMjQ5cTAtMTIuNzUgOC42OC0yMS4zOCA4LjY3LTguNjIgMjEuNS04LjYyIDEyLjgyIDAgMjEuMzIgOC42MiA4LjUgOC42MyA4LjUgMjEuMzh2MjQ5cTAgMjQtMTggNDJ0LTQyIDE4SDE4MFptNjAwLTYxN0w0MDMtMzYwcS05IDktMjEgOC41dC0yMS05LjVxLTktOS05LTIxdDktMjFsMzc3LTM3N0g1NDlxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoMjYxcTEyLjc1IDAgMjEuMzggOC42MlE4NDAtODIyLjc1IDg0MC04MTB2MjYxcTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42My04LjUtOC42Mi04LjUtMjEuMzd2LTE4OFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--ar-stickers {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIxMC41LTgxUTExMC0xMjIgMTEwLTE5MnEwLTMyIDMwLjUtNjMuNVQyMzEtMzA3bDUyIDQ2cS03NiAyNC05NC41IDQxLjVUMTcwLTE5MnEwIDIzIDgwLjUgNTVUNDgwLTEwNXExNDkgMCAyMjkuNS0zMnQ4MC41LTU1cTAtMTAtMTguNS0yNy41VDY3Ny0yNjFsNTMtNDZxNjAgMjAgOTAgNTEuNXQzMCA2My41cTAgNzAtMTAwLjUgMTExVDQ4MC00MHEtMTY5IDAtMjY5LjUtNDFaTTQ0My0yMDkuNXEtMTctOC41LTMzLTIwLjVMMTM0LTQ2N3EtMTEtMTAtMTcuNS0yMi41VDExMC01MTZ2LTc4cTAtMTQgNi41LTI1dDE2LjUtMjBsMjc2LTI1NnExNC0xNCAzMi41LTIwdDM4LjUtNnEyMCAwIDM4LjUgNnQzMi41IDIwbDI3NiAyNTZxMTAgOSAxNi41IDIwdDYuNSAyNXY3OHEwIDE0LTYuNSAyNi41VDgyNi00NjdMNTUwLTIzMHEtMTYgMTItMzMgMjAuNXQtMzcgOC41cS0yMCAwLTM3LTguNVpNNTA3LTM3N3ExNC01IDI2LTE2bDIzOS0yMTgtMjYzLTIzOHEtNS03LTExLjUtOS41VDQ4My04NjBxLTggMS0xNiAzLjV0LTE2IDcuNUwxODctNjA5bDIzNiAyMTZxMTIgMTEgMjYgMTZ0MjkgNXExNSAwIDI5LTVaTTM4NC01NzFxMTQtMTQgMTQtMzR0LTE0LTM0cS0xNC0xNC0zNC0xNHQtMzQgMTRxLTE0IDE0LTE0IDM0dDE0IDM0cTE0IDE0IDM0IDE0dDM0LTE0Wm0zMSA3NXE0NSAyMCA5MyAxMC41dDg0LTQyLjVxMzMtMjkgNDMuNS03MXQtNi41LTgzTDQxNS00OTZabTk5LTIwMXExNC0xNCAxNC0zNHQtMTQtMzRxLTE0LTE0LTM0LTE0dC0zNCAxNHEtMTQgMTQtMTQgMzR0MTQgMzRxMTQgMTQgMzQgMTR0MzQtMTRabS0zNCA4MVoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--open-in-new {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi02MDBxMC0yNCAxOC00MnQ0Mi0xOGgyNDlxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNUgxODB2NjAwaDYwMHYtMjQ5cTAtMTIuNzUgOC42OC0yMS4zOCA4LjY3LTguNjIgMjEuNS04LjYyIDEyLjgyIDAgMjEuMzIgOC42MiA4LjUgOC42MyA4LjUgMjEuMzh2MjQ5cTAgMjQtMTggNDJ0LTQyIDE4SDE4MFptNjAwLTYxN0w0MDMtMzYwcS05IDktMjEgOC41dC0yMS05LjVxLTktOS05LTIxdDktMjFsMzc3LTM3N0g1NDlxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoMjYxcTEyLjc1IDAgMjEuMzggOC42MlE4NDAtODIyLjc1IDg0MC04MTB2MjYxcTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42My04LjUtOC42Mi04LjUtMjEuMzd2LTE4OFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--open-in-new {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi02MDBxMC0yNCAxOC00MnQ0Mi0xOGgyNDlxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNUgxODB2NjAwaDYwMHYtMjQ5cTAtMTIuNzUgOC42OC0yMS4zOCA4LjY3LTguNjIgMjEuNS04LjYyIDEyLjgyIDAgMjEuMzIgOC42MiA4LjUgOC42MyA4LjUgMjEuMzh2MjQ5cTAgMjQtMTggNDJ0LTQyIDE4SDE4MFptNjAwLTYxN0w0MDMtMzYwcS05IDktMjEgOC41dC0yMS05LjVxLTktOS05LTIxdDktMjFsMzc3LTM3N0g1NDlxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoMjYxcTEyLjc1IDAgMjEuMzggOC42MlE4NDAtODIyLjc1IDg0MC04MTB2MjYxcTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42My04LjUtOC42Mi04LjUtMjEuMzd2LTE4OFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--flag {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTI2MC00Mjl2Mjc5cTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42My04LjUtOC42Mi04LjUtMjEuMzd2LTYyMHEwLTEyLjc1IDguNjMtMjEuMzhRMjE3LjI1LTgwMCAyMzAtODAwaDI4OXExMC41IDAgMTguNzUgNi41VDU0OC03NzZsMTQgNjJoMjA4cTEyLjc1IDAgMjEuMzggOC42MlE4MDAtNjk2Ljc1IDgwMC02ODR2MzEwcTAgMTIuNzUtOC42MiAyMS4zN1E3ODIuNzUtMzQ0IDc3MC0zNDRINTY4cS0xMC41IDAtMTguNzUtNlQ1MzktMzY3bC0xNC02MkgyNjBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--splitscreen-left {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi02MDBxMC0yNCAxOC00MnQ0Mi0xOGgyMTBxMjQgMCA0MiAxOHQxOCA0MnY2MDBxMCAyNC0xOCA0MnQtNDIgMThIMTgwWm0zOTAgMHEtMjQgMC00Mi0xOHQtMTgtNDJ2LTYwMHEwLTI0IDE4LTQydDQyLTE4aDIxMHEyNCAwIDQyIDE4dDE4IDQydjYwMHEwIDI0LTE4IDQydC00MiAxOEg1NzBabTIxMC02NjBINTcwdjYwMGgyMTB2LTYwMFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--dark-mode {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC0xMjBxLTE1MCAwLTI1NS0xMDVUMTIwLTQ4MHEwLTEzNSA3OS41LTIyOVQ0MDgtODMwcTIwLTUgMzQtMXQyMiAxNXE4IDEwIDcuNSAyNXQtOC41IDM1cS05IDIzLTE0IDQ3dC01IDQ5cTAgOTAgNjMgMTUzdDE1MyA2M3EyNSAwIDQ4LjUtNC41VDc1NC00NjFxMjItOCAzOC03dDI2IDlxMTAgOCAxMyAyM3QtMiAzNnEtMjcgMTIxLTEyMSAyMDAuNVQ0ODAtMTIwWm0wLTYwcTEwOSAwIDE5MC02Ny41VDc3MS00MDZxLTI1IDExLTUzLjUgMTYuNVQ2NjAtMzg0cS0xMTUgMC0xOTUuNS04MC41VDM4NC02NjBxMC0yNCA1LTUxLjV0MTgtNjIuNXEtOTggMjctMTYyLjUgMTA5LjVUMTgwLTQ4MHEwIDEyNSA4Ny41IDIxMi41VDQ4MC0xODBabS00LTI5N1oiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--photo-camera {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ3OS41LTI2N3E3Mi41IDAgMTIxLjUtNDl0NDktMTIxLjVxMC03Mi41LTQ5LTEyMVQ0NzkuNS02MDdxLTcyLjUgMC0xMjEgNDguNXQtNDguNSAxMjFxMCA3Mi41IDQ4LjUgMTIxLjV0MTIxIDQ5Wm0wLTYwcS00Ny41IDAtNzguNS0zMS41dC0zMS03OXEwLTQ3LjUgMzEtNzguNXQ3OC41LTMxcTQ3LjUgMCA3OSAzMXQzMS41IDc4LjVxMCA0Ny41LTMxLjUgNzl0LTc5IDMxLjVaTTE0MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi01MTNxMC0yMyAxOC00MS41dDQyLTE4LjVoMTQ3bDU1LTY2cTgtMTEgMjAtMTZ0MjYtNWgxODRxMTQgMCAyNiA1dDIwIDE2bDU1IDY2aDE0N3EyMyAwIDQxLjUgMTguNVQ4ODAtNjkzdjUxM3EwIDI0LTE4LjUgNDJUODIwLTEyMEgxNDBabTAtNjBoNjgwdi01MTNINjQ1bC03My04N0gzODhsLTczIDg3SDE0MHY1MTNabTM0MC0yNTdaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--assignment {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0Ljc1IDAtNDIuMzctMTcuNjNRMTIwLTE1NS4yNSAxMjAtMTgwdi02MDBxMC0yNC43NSAxNy42My00Mi4zOFExNTUuMjUtODQwIDE4MC04NDBoMjA1cTUtMzUgMzItNTcuNXQ2My0yMi41cTM2IDAgNjMgMjIuNXQzMiA1Ny41aDIwNXEyNC43NSAwIDQyLjM4IDE3LjYyUTg0MC04MDQuNzUgODQwLTc4MHY2MDBxMCAyNC43NS0xNy42MiA0Mi4zN1E4MDQuNzUtMTIwIDc4MC0xMjBIMTgwWm0wLTYwaDYwMHYtNjAwSDE4MHY2MDBabTEzMC0xMDBoMjEzcTEyLjc1IDAgMjEuMzgtOC42OCA4LjYyLTguNjcgOC42Mi0yMS41IDAtMTIuODItOC42Mi0yMS4zMi04LjYzLTguNS0yMS4zOC04LjVIMzEwcS0xMi43NSAwLTIxLjM3IDguNjgtOC42MyA4LjY3LTguNjMgMjEuNSAwIDEyLjgyIDguNjMgMjEuMzIgOC42MiA4LjUgMjEuMzcgOC41Wm0wLTE3MGgzNDBxMTIuNzUgMCAyMS4zOC04LjY4IDguNjItOC42NyA4LjYyLTIxLjUgMC0xMi44Mi04LjYyLTIxLjMyLTguNjMtOC41LTIxLjM4LTguNUgzMTBxLTEyLjc1IDAtMjEuMzcgOC42OC04LjYzIDguNjctOC42MyAyMS41IDAgMTIuODIgOC42MyAyMS4zMiA4LjYyIDguNSAyMS4zNyA4LjVabTAtMTcwaDM0MHExMi43NSAwIDIxLjM4LTguNjggOC42Mi04LjY3IDguNjItMjEuNSAwLTEyLjgyLTguNjItMjEuMzItOC42My04LjUtMjEuMzgtOC41SDMxMHEtMTIuNzUgMC0yMS4zNyA4LjY4LTguNjMgOC42Ny04LjYzIDIxLjUgMCAxMi44MiA4LjYzIDIxLjMyIDguNjIgOC41IDIxLjM3IDguNVptMTk0LjUtMTg3LjVRNTE1LTgxOCA1MTUtODMydC0xMC41LTI0LjVRNDk0LTg2NyA0ODAtODY3dC0yNC41IDEwLjVRNDQ1LTg0NiA0NDUtODMydDEwLjUgMjQuNVE0NjYtNzk3IDQ4MC03OTd0MjQuNS0xMC41Wk0xODAtMTgwdi02MDAgNjAwWiIvPjwvc3ZnPg==");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--check {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTM3OC0zMzIgMzYzLTM2M3E5LTkgMjEuNS05dDIxLjUgOXE5IDkgOSAyMS41dC05IDIxLjVMMzk5LTI2N3EtOSA5LTIxIDl0LTIxLTlMMTc1LTQ0OXEtOS05LTguNS0yMS41VDE3Ni00OTJxOS05IDIxLjUtOXQyMS41IDlsMTU5IDE2MFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon-fill--layers {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE1MS0zODZxLTEyLTguOTQtMTEuNS0yMy40N1QxNTIuMDgtNDMzcTguMy02IDE4LjExLTYgOS44MSAwIDE3LjgxIDZsMjkyIDIyNyAyOTItMjI3cTguMzItNiAxOC4xNi02dDE4LjA5IDUuOTdxMTIgOC45NSAxMi4zOCAyMy40OVE4MjEtMzk1IDgwOS0zODZMNTE3LTE1OXEtMTYuNSAxMy0zNi43NSAxM1Q0NDMtMTU5TDE1MS0zODZabTI5MiA3NUwxODEtNTE1cS0yMy0xNy44OC0yMy00Ni45NFQxODEtNjA5bDI2Mi0yMDRxMTYuNS0xMyAzNi43NS0xM1Q1MTctODEzbDI2MiAyMDRxMjMgMTcuODggMjMgNDYuOTRUNzc5LTUxNUw1MTctMzExcS0xNi41IDEzLTM2Ljc1IDEzVDQ0My0zMTFaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--check {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTM3OC0zMzIgMzYzLTM2M3E5LTkgMjEuNS05dDIxLjUgOXE5IDkgOSAyMS41dC05IDIxLjVMMzk5LTI2N3EtOSA5LTIxIDl0LTIxLTlMMTc1LTQ0OXEtOS05LTguNS0yMS41VDE3Ni00OTJxOS05IDIxLjUtOXQyMS41IDlsMTU5IDE2MFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--location-on {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC0xNTlxMTMzLTEyMSAxOTYuNS0yMTkuNVQ3NDAtNTUycTAtMTE4LTc1LjUtMTkzVDQ4MC04MjBxLTEwOSAwLTE4NC41IDc1VDIyMC01NTJxMCA3NSA2NSAxNzMuNVQ0ODAtMTU5Wm0tMjEuNSA1NS41UTQ0OC0xMDcgNDQwLTExNXEtNDItMzgtOTEtODcuNVQyNTgtMzA5cS00Mi01Ny03MC0xMTl0LTI4LTEyNHEwLTE1MCA5Ni41LTIzOVQ0ODAtODgwcTEyNyAwIDIyMy41IDg5VDgwMC01NTJxMCA2Mi0yOCAxMjR0LTcwIDExOXEtNDIgNTctOTEgMTA2LjVUNTIwLTExNXEtOCA4LTE4LjUgMTEuNVQ0ODAtMTAwcS0xMSAwLTIxLjUtMy41Wk00ODAtNTYwWm00OS41IDQ5LjVRNTUwLTUzMSA1NTAtNTYwdC0yMC41LTQ5LjVRNTA5LTYzMCA0ODAtNjMwdC00OS41IDIwLjVRNDEwLTU4OSA0MTAtNTYwdDIwLjUgNDkuNVE0NTEtNDkwIDQ4MC00OTB0NDkuNS0yMC41WiIvPjwvc3ZnPg==");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--palette {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC04MHEtODIgMC0xNTUtMzEuNXQtMTI3LjUtODZRMTQzLTI1MiAxMTEuNS0zMjVUODAtNDgwcTAtODUgMzItMTU4dDg3LjUtMTI3cTU1LjUtNTQgMTMwLTg0LjVUNDg5LTg4MHE3OSAwIDE1MCAyNi41VDc2My41LTc4MHE1My41IDQ3IDg1IDExMS41VDg4MC01MjdxMCAxMDgtNjMgMTcwLjVUNjUwLTI5NGgtNzVxLTE4IDAtMzEgMTR0LTEzIDMxcTAgMjcgMTQuNSA0NnQxNC41IDQ0cTAgMzgtMjEgNTguNVQ0ODAtODBabTAtNDAwWm0tMTk4IDExcTE1LTE1IDE1LTM1dC0xNS0zNXEtMTUtMTUtMzUtMTV0LTM1IDE1cS0xNSAxNS0xNSAzNXQxNSAzNXExNSAxNSAzNSAxNXQzNS0xNVptMTI2LTE3MHExNS0xNSAxNS0zNXQtMTUtMzVxLTE1LTE1LTM1LTE1dC0zNSAxNXEtMTUgMTUtMTUgMzV0MTUgMzVxMTUgMTUgMzUgMTV0MzUtMTVabTIxNCAwcTE1LTE1IDE1LTM1dC0xNS0zNXEtMTUtMTUtMzUtMTV0LTM1IDE1cS0xNSAxNS0xNSAzNXQxNSAzNXExNSAxNSAzNSAxNXQzNS0xNVptMTMxIDE3MHExNS0xNSAxNS0zNXQtMTUtMzVxLTE1LTE1LTM1LTE1dC0zNSAxNXEtMTUgMTUtMTUgMzV0MTUgMzVxMTUgMTUgMzUgMTV0MzUtMTVaTTQ4MC0xNDBxMTEgMCAxNS41LTQuNVQ1MDAtMTU5cTAtMTQtMTQuNS0yNlQ0NzEtMjM4cTAtNDYgMzAtODF0NzYtMzVoNzNxNzYgMCAxMjMtNDQuNVQ4MjAtNTI3cTAtMTMyLTEwMC0yMTIuNVQ0ODktODIwcS0xNDYgMC0yNDcuNSA5OC41VDE0MC00ODBxMCAxNDEgOTkuNSAyNDAuNVQ0ODAtMTQwWiIvPjwvc3ZnPg==");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--rocket-launch {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTI5Mi01MDZxMTgtMzYgMzguNS03MXQ0My41LTY3bC03OS0xNi0xMDkgMTA5IDEwNiA0NVptNTE1LTMxMnEtMTAyIDUtMTg0IDQzLjVUNDYzLTY1OHEtMzEgMzEtNjQgODF0LTU5IDEwN2wxMzMgMTMzcTU3LTI2IDEwNy01OXQ4MS02NHE3OC03OCAxMTYuNS0xNTkuNVQ4MjEtODAzcTAtMy0xLTZ0LTMtNXEtMi0yLTQuNS0zdC01LjUtMVpNNTUwLTYxNS41cTAtMjkuNSAyMC00OS41dDQ5LjUtMjBxMjkuNSAwIDQ5LjUgMjB0MjAgNDkuNXEwIDI5LjUtMjAgNDkuNXQtNDkuNSAyMHEtMjkuNSAwLTQ5LjUtMjB0LTIwLTQ5LjVaTTUwOS0yODhsNDUgMTA1IDEwOS0xMDktMTUtNzlxLTMyIDIzLTY3LjUgNDRUNTA5LTI4OFptMzczLTU1OXEzIDEyNS00MC41IDIzMC41VDcwNC00MTdxLTEgMS0yIDEuNXQtMiAxLjVsMjIgMTEwcTMgMTUtMSAyOXQtMTUgMjVMNTY1LTEwOXEtMTEgMTEtMjYuNSA4VDUxNy0xMTlsLTY4LTE1Ny0xNjktMTcwLTE1OC02N3EtMTUtNi0xNy41LTIydDguNS0yN2wxNDAtMTQwcTExLTExIDI1LTE1LjV0MjktMS41bDExMCAyMnExLTEgMi0xLjV0Mi0xLjVxOTQtOTQgMTk5LTEzNy41VDg1MC04NzhxNiAwIDExLjUgMi41VDg3Mi04NjhxNSA1IDcuNSAxMHQyLjUgMTFaTTE0OS0zMjVxMzUtMzUgODUuNS0zNS41VDMyMC0zMjZxMzUgMzUgMzQuNSA4NS41VDMxOS0xNTVxLTQ3IDQ3LTExMi41IDU2LjVUNzUtODBsMTgtMTMycTktNjYgNTYtMTEzWm00MiA0M3EtMjQgMjYtMzEgNjB0LTEzIDY5cTM1LTYgNjktMTN0NjAtMzFxMjAtMTcgMjAtNDIuNVQyNzgtMjg0cS0xOS0xOC00NC41LTE4VDE5MS0yODJaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--settings {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQyMS04MHEtMTQgMC0yNS05dC0xMy0yM2wtMTUtOTRxLTE5LTctNDAtMTl0LTM3LTI1bC04NiA0MHEtMTQgNi0yOCAxLjVUMTU1LTIyNkw5Ny0zMzBxLTgtMTMtNC41LTI3dDE1LjUtMjNsODAtNTlxLTItOS0yLjUtMjAuNVQxODUtNDgwcTAtOSAuNS0yMC41VDE4OC01MjFsLTgwLTU5cS0xMi05LTE1LjUtMjN0NC41LTI3bDU4LTEwNHE4LTEzIDIyLTE3LjV0MjggMS41bDg2IDQwcTE2LTEzIDM3LTI1dDQwLTE4bDE1LTk1cTItMTQgMTMtMjN0MjUtOWgxMThxMTQgMCAyNSA5dDEzIDIzbDE1IDk0cTE5IDcgNDAuNSAxOC41VDY2OS03MTBsODYtNDBxMTQtNiAyNy41LTEuNVQ4MDQtNzM0bDU5IDEwNHE4IDEzIDQuNSAyNy41VDg1Mi01ODBsLTgwIDU3cTIgMTAgMi41IDIxLjV0LjUgMjEuNXEwIDEwLS41IDIxdC0yLjUgMjFsODAgNThxMTIgOCAxNS41IDIyLjVUODYzLTMzMGwtNTggMTA0cS04IDEzLTIyIDE3LjV0LTI4LTEuNWwtODYtNDBxLTE2IDEzLTM2LjUgMjUuNVQ1OTItMjA2bC0xNSA5NHEtMiAxNC0xMyAyM3QtMjUgOUg0MjFabTE1LTYwaDg4bDE0LTExMnEzMy04IDYyLjUtMjV0NTMuNS00MWwxMDYgNDYgNDAtNzItOTQtNjlxNC0xNyA2LjUtMzMuNVQ3MTUtNDgwcTAtMTctMi0zMy41dC03LTMzLjVsOTQtNjktNDAtNzItMTA2IDQ2cS0yMy0yNi01Mi00My41VDUzOC03MDhsLTE0LTExMmgtODhsLTE0IDExMnEtMzQgNy02My41IDI0VDMwNi02NDJsLTEwNi00Ni00MCA3MiA5NCA2OXEtNCAxNy02LjUgMzMuNVQyNDUtNDgwcTAgMTcgMi41IDMzLjVUMjU0LTQxM2wtOTQgNjkgNDAgNzIgMTA2LTQ2cTI0IDI0IDUzLjUgNDF0NjIuNSAyNWwxNCAxMTJabTQ0LTIxMHE1NCAwIDkyLTM4dDM4LTkycTAtNTQtMzgtOTJ0LTkyLTM4cS01NCAwLTkyIDM4dC0zOCA5MnEwIDU0IDM4IDkydDkyIDM4Wm0wLTEzMFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--build {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTM1NC0zNzBxLTk3LjA4IDAtMTY1LjA0LTY3LjY3UTEyMS01MDUuMzMgMTIxLTYwMnEwLTIwIDMtMzcuNXQxMS0zNi41cTMtOCA5LTEydDEyLjgxLTZxNi44MS0yIDE0IDB0MTMuMTkgOGwxMTMgMTEzIDkyLTg2LTExOC0xMThxLTYuMTUtNS45My04LjA4LTEyLjk2UTI2MS03OTcgMjYzLTgwNHEyLTcgNi0xMi4yNXQxMi04Ljc1cTE5LTggMzYtMTEuNXQzNi44NS0zLjVxOTkuMjMgMCAxNjguNjkgNjkuNDJRNTkyLTcwMS4xNyA1OTItNjAycTAgMjQtNSA0N3QtMTMgNDZsMjIxIDIyMXEyNyAyNiAyNi41IDYzLjVUNzkzLTE2MXEtMjYgMjQtNjEuNSAyMy41VDY3MC0xNjRMNDQ3LTM4OHEtMjMgOC00NiAxM3QtNDcgNVptMC02MHEyNSAwIDUzLTh0NDktMjRsMjU3IDI1N3E4IDggMjAgOHQyMC04cTgtOCA4LTIwdC04LTIwTDUwMC00OThxMTYtMjEgMjQtNDkuNXQ4LTU0LjVxMC03NS01NS41LTEyN1QzNTAtNzgybDEwMiAxMDRxOSA5IDguNSAyMS41VDQ1MS02MzVMMzE4LTUxMHEtOS4yNyA4LTIxLjY0IDgtMTIuMzYgMC0yMC4zNi04bC05OC05N3EzIDc3IDU0LjY3IDEyN1QzNTQtNDMwWm0xMTctNThaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--orbit {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIzMy0xMDBxLTU1LjEgMC05NC4wNS0zOC45My0zOC45NS0zOC45My0zOC45NS05NFQxMzguOTMtMzI3cTM4LjkzLTM5IDk0LTM5VDMyNy0zMjcuMDVxMzkgMzguOTUgMzkgOTQuMDUgMCAyMi03IDQyLjVUMzM5LTE1M3YtMTdxMzMgMTUgNjkgMjIuNXQ3MiA3LjVxMTMzLjU5IDAgMjMwLjc5LTg5UTgwOC0zMTggODE5LTQ0OXEyLTEzIDEwLTIydDIwLjgyLTlxMTIuODMgMCAyMS41IDkgOC42OCA5IDcuNjggMjItMTIgMTU1LTEyNiAyNjJUNDc5LjktODBxLTQ1LjkgMC05MC40LTEwLjVRMzQ1LTEwMSAzMDMtMTIxcS0xNiAxMC41LTMzLjUgMTUuNzVUMjMzLTEwMFptNTEuNS04MS41UTMwNi0yMDMgMzA2LTIzM3QtMjEuNS01MS41UTI2My0zMDYgMjMzLTMwNnQtNTEuNSAyMS41UTE2MC0yNjMgMTYwLTIzM3QyMS41IDUxLjVRMjAzLTE2MCAyMzMtMTYwdDUxLjUtMjEuNVpNNDgwLjA3LTM0N1E0MjUtMzQ3IDM4Ni0zODUuOTNxLTM5LTM4LjkzLTM5LTk0VDM4NS45My01NzRxMzguOTMtMzkgOTQtMzlUNTc0LTU3NC4wN3EzOSAzOC45MyAzOSA5NFQ1NzQuMDctMzg2cS0zOC45MyAzOS05NCAzOVpNNDgwLTgyMHEtMTMzLjU5IDAtMjMwLjc5IDg5UTE1Mi02NDIgMTQxLTUxMXEtMiAxMy0xMCAyMnQtMjAuODIgOXEtMTIuODMgMC0yMS41LTlRODAtNDk4IDgxLTUxMXExMi0xNTUgMTI2LTI2MnQyNzMuMS0xMDdxNDUuOSAwIDkwLjQgMTAuNVE2MTUtODU5IDY1Ny04MzlxMTYtMTAgMzMuNS0xNXQzNi41LTVxNTQuNjkgMCA5My4zNCAzOC43MlE4NTktNzgxLjU2IDg1OS03MjYuNzhUODIwLjI4LTYzM3EtMzguNzIgMzktOTMuNSAzOVQ2MzMtNjMyLjk1UTU5NC02NzEuOSA1OTQtNzI3cTAtMjIgNy00Mi41dDIwLTM3LjV2MTdxLTMzLTE1LTY5LTIyLjV0LTcyLTcuNVptMjQ3IDE2NnEzMCAwIDUxLTIxLjV0MjEtNTEuNXEwLTMwLTIxLTUxdC01MS0yMXEtMzAgMC01MS41IDIxVDY1NC03MjdxMCAzMCAyMS4yOSA1MS41VDcyNy02NTRaTTIzMy0yMzNabTQ5NC00OTRaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--extension {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTM1Ni0xMjBIMTgwcS0yNCAwLTQyLTE4dC0xOC00MnYtMTc2cTQ0LTUgNzUuNS0zNC41VDIyNy00NjNxMC00My0zMS41LTcyLjVUMTIwLTU3MHYtMTc2cTAtMjQgMTgtNDJ0NDItMThoMTc3cTExLTQwIDM5LjUtNjd0NjguNS0yN3E0MCAwIDY4LjUgMjd0MzkuNSA2N2gxNzNxMjQgMCA0MiAxOHQxOCA0MnYxNzNxNDAgMTEgNjUuNSA0MS41VDg5Ny00NjFxMCA0MC0yNS41IDY3VDgwNi0zNTZ2MTc2cTAgMjQtMTggNDJ0LTQyIDE4SDU3MHEtNS00OC0zNS41LTc3LjVUNDYzLTIyN3EtNDEgMC03MS41IDI5LjVUMzU2LTEyMFptLTE3Ni02MGgxMzBxMjUtNjEgNjkuODktODR0ODMtMjNRNTAxLTI4NyA1NDYtMjY0dDcwIDg0aDEzMHYtMjM1aDQ1cTIwIDAgMzMtMTN0MTMtMzNxMC0yMC0xMy0zM3QtMzMtMTNoLTQ1di0yMzlINTExdi00OHEwLTIwLTEzLTMzdC0zMy0xM3EtMjAgMC0zMyAxM3QtMTMgMzN2NDhIMTgwdjEzMHE0OC4xNSAxNy44MiA3Ny41OCA1OS42OVEyODctNTE0LjQ1IDI4Ny00NjIuNzggMjg3LTQxMiAyNTcuNS0zNzBUMTgwLTMxMHYxMzBabTI4NS0yODFaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--looks {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC02NjBxLTE1MCAwLTI1OC41IDEwMVQxMDEtMzExcS0xIDEzLTkuNSAyMlQ3MC0yODBxLTEyIDAtMjEtOC41VDQxLTMwOXE2LTg2IDQyLjUtMTYxVDE3OS02MDAuNVEyMzgtNjU2IDMxNS41LTY4OFQ0ODAtNzIwcTg3IDAgMTY0LjUgMzJUNzgxLTYwMC41UTg0MC01NDUgODc2LjUtNDcwVDkxOS0zMDlxMSAxMi04IDIwLjV0LTIxIDguNXEtMTMgMC0yMS41LTl0LTkuNS0yMnEtMTItMTQ3LTEyMC0yNDhUNDgwLTY2MFptMCAxMjBxLTEwMiAwLTE3NS41IDY3VDIyMS0zMDZxLTEgMTEtMTAgMTguNXQtMjEgNy41cS0xMyAwLTIxLjUtOS41VDE2Mi0zMTJxMTItMTIzIDEwMi0yMDUuNVQ0ODAtNjAwcTEyNiAwIDIxNiA4Mi41VDc5OC0zMTJxMiAxMy02LjUgMjIuNVQ3NzAtMjgwcS0xMiAwLTIxLTcuNVQ3MzktMzA2cS0xMC0xMDAtODMuNS0xNjdUNDgwLTU0MFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--museum {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTgwLTgwdi02MGg4M3YtNDExaC01NHEtMTIuMzUgMC0yMC42OC05UTgwLTU2OSA4MC01ODFxMC04LjMxIDMuNjctMTUuMjNRODcuMzMtNjAzLjE1IDk0LTYwOGwzNTEtMjQ4cTgtNSAxNi44MS04IDguODEtMyAxOC0zdDE4LjE5IDNxOSAzIDE3IDhsMzUxIDI0OHE2LjY3IDQuOSAxMC4zMyAxMi4yNVE4ODAtNTg4LjQgODgwLTU4MHEwIDEyLjM1LTguMzIgMjAuNjhRODYzLjM1LTU1MSA4NTEtNTUxaC01M3Y0MTFoODJ2NjBIODBabTY1OC02MHYtNDg1TDQ4MC04MDYgMjIzLTYyNXY0ODVoNTE1Wk00OTQtMzA3cTYtMyAxMS0xMGw3Mi0xMDh2MTU0cTAgMTIuNzUgOC42OCAyMS4zNyA4LjY3IDguNjMgMjEuNSA4LjYzIDEyLjgyIDAgMjEuMzItOC42MyA4LjUtOC42MiA4LjUtMjEuMzd2LTIxN3EwLTExLjQ1LTcuNzctMTkuMjNRNjIxLjQ1LTUxNSA2MTAtNTE1aC0yMy40cS02LjQ2IDAtMTIuNTEgMy4yVDU2NC01MDNsLTg0IDEyOC04My0xMjZxLTUtNy0xMS43NS0xMC41VDM3MS01MTVoLTE1LjE0cS0xMy41NCAwLTIyLjcgOS4yVDMyNC00ODN2MjEycTAgMTIuNzUgOC42OCAyMS4zNyA4LjY3IDguNjMgMjEuNSA4LjYzIDEyLjgyIDAgMjEuMzItOC42MyA4LjUtOC42MiA4LjUtMjEuMzd2LTE1NGw3MSAxMDdxNSA3IDExIDEwLjV0MTQgMy41cTggMCAxNC0zWm0yNDQgMTY3SDIyM2g1MTVaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--alt-route {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ1MC0xMTB2LTE3MHEwLTQ4LTE2LTc5dC00OS02NGw0My00M3ExMyAxMSAyNy41IDMwdDI0LjUgMzVxMTctMjYgMzMuNS00NXQzMS41LTMycTU4LTQ3IDgzLjUtMTEzLjVUNjQ4LTc2NmwtNjkgNjlxLTkgOS0yMSA5dC0yMS05cS05LTktOS0yMXQ5LTIxbDEyMC0xMjBxNS01IDEwLTd0MTEtMnE2IDAgMTEgMnQxMCA3bDEyMCAxMjBxOSA5IDkgMjF0LTkgMjFxLTkgOS0yMSA5dC0yMS05bC02OS02OXE1IDEyNi0yNC41IDE5OC41VDU4NS00MzJxLTQ0IDQwLTU5LjUgNzNUNTEwLTI4MHYxNzBxMCAxMy04LjUgMjEuNVQ0ODAtODBxLTEzIDAtMjEuNS04LjVUNDUwLTExMFpNMjU4LTYzNnEtNC0xOC02LjUtNTIuNVQyNTEtNzY1bC02OCA2OHEtOSA5LTIxIDl0LTIxLTlxLTktOS05LTIxdDktMjFsMTIwLTEyMHE1LTUgMTAtN3QxMS0ycTYgMCAxMSAydDEwIDdsMTIwIDEyMHE5IDkgOSAyMXQtOSAyMXEtOSA5LTIxIDl0LTIxLTlsLTY5LTY5cS0yIDM4LTEgNjYuNXQ1IDQ5LjVsLTU4IDE0Wm04NCAxNzFxLTE3LTE4LTM3LjUtNDcuNVQyNzMtNTc3bDU5LTE1cTkgMjUgMjQgNDh0MjggMzdsLTQyIDQyWiIvPjwvc3ZnPg==");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--map {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTU5Mi0xMjctMjQzLTg2LTE4OCA3NXEtOCAzLTE1IDEuNXQtMTMtNS41cS02LTQtOS41LTEwdC0zLjUtMTR2LTU2NXEwLTEzIDcuNS0yM3QxOS41LTE1bDE4Mi02NHE1LTIgMTAtMi41dDEwLS41cTUgMCAxMCAuNXQxMCAyLjVsMjQzIDg1IDE4Ny03NXE4LTMgMTUtMnQxMyA1cTYgNCA5LjUgMTAuNVQ4NDAtNzk1djU3MnEwIDExLTcuNSAxOVQ4MTQtMTkybC0xODIgNjVxLTUgMi0xMCAyLjV0LTEwIC41cS01IDAtMTAtLjV0LTEwLTIuNVptLTE0LTY4di01MDVsLTE5Ni02NnY1MDVsMTk2IDY2Wm02MCAwIDE0Mi00N3YtNTEybC0xNDIgNTR2NTA1Wm0tNDU4LTEyIDE0Mi01NHYtNTA1bC0xNDIgNDd2NTEyWm00NTgtNDkzdjUwNS01MDVabS0zMTYtNjZ2NTA1LTUwNVoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--accessibility {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQyOC41LTc1NS40MnEtMjEuNS0yMS40Mi0yMS41LTUxLjV0MjEuNDItNTEuNThxMjEuNDItMjEuNSA1MS41LTIxLjV0NTEuNTggMjEuNDJxMjEuNSAyMS40MiAyMS41IDUxLjV0LTIxLjQyIDUxLjU4cS0yMS40MiAyMS41LTUxLjUgMjEuNXQtNTEuNTgtMjEuNDJaTTM3Mi0xMTB2LTUwM0gxNTBxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoNjYwcTEyLjc1IDAgMjEuMzggOC42OCA4LjYyIDguNjcgOC42MiAyMS41IDAgMTIuODItOC42MiAyMS4zMi04LjYzIDguNS0yMS4zOCA4LjVINTg4djUwM3EwIDEyLjc1LTguNjggMjEuMzctOC42NyA4LjYzLTIxLjUgOC42My0xMi44MiAwLTIxLjMyLTguNjNRNTI4LTk3LjI1IDUyOC0xMTB2LTIzMGgtOTZ2MjMwcTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42M1EzNzItOTcuMjUgMzcyLTExMFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--groups {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTMwLTI0MHEtMTIuNzUgMC0yMS4zNy04LjYzUTAtMjU3LjI1IDAtMjcwdi0yM3EwLTM4LjU3IDQxLjUtNjIuNzhRODMtMzgwIDE1MC4zOC0zODBxMTIuMTYgMCAyMy4zOS41dDIyLjIzIDIuMTVxLTggMTcuMzUtMTIgMzUuMTctNCAxNy44MS00IDM3LjE4djY1SDMwWm0yNDAgMHEtMTIuNzUgMC0yMS4zNy04LjYzUTI0MC0yNTcuMjUgMjQwLTI3MHYtMzVxMC0zMiAxNy41LTU4LjVUMzA3LTQxMHEzMi0yMCA3Ni41LTMwdDk2LjUtMTBxNTMgMCA5Ny41IDEwdDc2LjUgMzBxMzIgMjAgNDkgNDYuNXQxNyA1OC41djM1cTAgMTIuNzUtOC42MiAyMS4zN1E3MDIuNzUtMjQwIDY5MC0yNDBIMjcwWm01MTAgMHYtNjVxMC0xOS44Ni0zLjUtMzcuNDNUNzY1LTM3Ny4yN3ExMS0xLjczIDIyLjE3LTIuMjMgMTEuMTctLjUgMjIuODMtLjUgNjcuNSAwIDEwOC43NSAyMy43N1Q5NjAtMjkzdjIzcTAgMTIuNzUtOC42MiAyMS4zN1E5NDIuNzUtMjQwIDkzMC0yNDBINzgwWm0tNDgwLTYwaDM2MHYtNnEwLTM3LTUwLjUtNjAuNVQ0ODAtMzkwcS03OSAwLTEyOS41IDIzLjVUMzAwLTMwNXY1Wk0xNDkuNTctNDEwcS0yOC41NyAwLTQ5LjA3LTIwLjU2UTgwLTQ1MS4xMyA4MC00ODBxMC0yOSAyMC41Ni00OS41UTEyMS4xMy01NTAgMTUwLTU1MHEyOSAwIDQ5LjUgMjAuNXQyMC41IDQ5LjkzcTAgMjguNTctMjAuNSA0OS4wN1QxNDkuNTctNDEwWm02NjAgMHEtMjguNTcgMC00OS4wNy0yMC41NlE3NDAtNDUxLjEzIDc0MC00ODBxMC0yOSAyMC41Ni00OS41UTc4MS4xMy01NTAgODEwLTU1MHEyOSAwIDQ5LjUgMjAuNXQyMC41IDQ5LjkzcTAgMjguNTctMjAuNSA0OS4wN1Q4MDkuNTctNDEwWk00ODAtNDgwcS01MCAwLTg1LTM1dC0zNS04NXEwLTUxIDM1LTg1LjV0ODUtMzQuNXE1MSAwIDg1LjUgMzQuNVQ2MDAtNjAwcTAgNTAtMzQuNSA4NVQ0ODAtNDgwWm0uMzUtNjBRNTA2LTU0MCA1MjMtNTU3LjM1dDE3LTQzUTU0MC02MjYgNTIyLjg1LTY0M3QtNDIuNS0xN3EtMjUuMzUgMC00Mi44NSAxNy4xNXQtMTcuNSA0Mi41cTAgMjUuMzUgMTcuMzUgNDIuODV0NDMgMTcuNVpNNDgwLTMwMFptMC0zMDBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	

		.kern-icon--bug-report {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC0xMjBxLTY1LjM3IDAtMTIxLjE4LTMxUTMwMy0xODIgMjc2LTI0MGgtODZxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoNjJxLTctMjYtNy01Mi42N1YtNDA2aC01NnEtMTIuNzUgMC0yMS4zNy04LjY4LTguNjMtOC42Ny04LjYzLTIxLjUgMC0xMi44MiA4LjYzLTIxLjMyIDguNjItOC41IDIxLjM3LTguNWg1NnEwLTI5IC41LTU3LjVUMjU0LTU4MGgtNjRxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoOTBxMTQtMjggMzctNDl0NTEtMzVsLTU3LTU2cS04LTgtOC0xOS43OSAwLTExLjc4IDguNDItMjAuMzUgNy43Mi03Ljg2IDE5LjY1LTcuODZ0MTkuOTMgOGw3NCA3NHEyNy42Ny0xMCA1Ni4zNC0xMFE1MTAtNzU2IDUzOC03NDZsNzQtNzRxOC04IDE5Ljc5LTggMTEuNzggMCAyMC4zNSA4LjQyIDcuODYgNy43MiA3Ljg2IDE5LjY1VDY1Mi03ODBsLTU2IDU2cTI4IDE0IDQ5LjQgMzUuNjdRNjY2LjgtNjY2LjY3IDY4My02NDBoODhxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNWgtNjVxOSAyOCA4LjUgNTYuNjctLjUgMjguNjYtLjUgNTcuMzNoNTdxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNWgtNTdxMCAyNyAuNSA1My41VDcwOC0zMDBoNjNxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNWgtODZxLTI2IDU5LTgyLjQ1IDg5LjVRNTQ2LjExLTEyMCA0ODAtMTIwWm0uMTYtNjBRNTUyLTE4MCA2MDMtMjMwLjVUNjU0LTM1M3YtMTY3cTAtNzItNTEuMTYtMTIyLjV0LTEyMy01MC41UTQwOC02OTMgMzU3LTY0Mi41VDMwNi01MjB2MTY3cTAgNzIgNTEuMTYgMTIyLjV0MTIzIDUwLjVaTTQzMC0zMjBoMTAwcTEyLjc1IDAgMjEuMzgtOC42OCA4LjYyLTguNjcgOC42Mi0yMS41IDAtMTIuODItOC42Mi0yMS4zMi04LjYzLTguNS0yMS4zOC04LjVINDMwcS0xMi43NSAwLTIxLjM3IDguNjgtOC42MyA4LjY3LTguNjMgMjEuNSAwIDEyLjgyIDguNjMgMjEuMzIgOC42MiA4LjUgMjEuMzcgOC41Wm0wLTE3M2gxMDBxMTIuNzUgMCAyMS4zOC04LjY4IDguNjItOC42NyA4LjYyLTIxLjUgMC0xMi44Mi04LjYyLTIxLjMyLTguNjMtOC41LTIxLjM4LTguNUg0MzBxLTEyLjc1IDAtMjEuMzcgOC42OC04LjYzIDguNjctOC42MyAyMS41IDAgMTIuODIgOC42MyAyMS4zMiA4LjYyIDguNSAyMS4zNyA4LjVabTUwLjUgNTdoLS41LjUtLjUuNS0uNS41LS41LjVaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default-contextual, #131525);
		}
	
}`);export{ce as i,fe as n,ae as r,$ as t};