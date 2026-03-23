import{i as k,c as h,a as j,e as V,b as p,d as B,f as A,g as H,j as P,k as Z,l as a,m as f,n as W,o as R,p as E,q as G}from"./runtime-core.esm-bundler-B6j4r-2h.js";let x;const z=typeof window<"u"&&window.trustedTypes;if(z)try{x=z.createPolicy("vue",{createHTML:M=>M})}catch{}const b=x?M=>x.createHTML(M):M=>M,X="http://www.w3.org/2000/svg",F="http://www.w3.org/1998/Math/MathML",i=typeof document<"u"?document:null,u=i&&i.createElement("template"),_={insert:(M,t,T)=>{t.insertBefore(M,T||null)},remove:M=>{const t=M.parentNode;t&&t.removeChild(M)},createElement:(M,t,T,N)=>{const I=t==="svg"?i.createElementNS(X,M):t==="mathml"?i.createElementNS(F,M):T?i.createElement(M,{is:T}):i.createElement(M);return M==="select"&&N&&N.multiple!=null&&I.setAttribute("multiple",N.multiple),I},createText:M=>i.createTextNode(M),createComment:M=>i.createComment(M),setText:(M,t)=>{M.nodeValue=t},setElementText:(M,t)=>{M.textContent=t},parentNode:M=>M.parentNode,nextSibling:M=>M.nextSibling,querySelector:M=>i.querySelector(M),setScopeId(M,t){M.setAttribute(t,"")},insertStaticContent(M,t,T,N,I,g){const L=T?T.previousSibling:t.lastChild;if(I&&(I===g||I.nextSibling))for(;t.insertBefore(I.cloneNode(!0),T),!(I===g||!(I=I.nextSibling)););else{u.innerHTML=b(N==="svg"?`<svg>${M}</svg>`:N==="mathml"?`<math>${M}</math>`:M);const c=u.content;if(N==="svg"||N==="mathml"){const D=c.firstChild;for(;D.firstChild;)c.appendChild(D.firstChild);c.removeChild(D)}t.insertBefore(c,T)}return[L?L.nextSibling:t.firstChild,T?T.previousSibling:t.lastChild]}},J=Symbol("_vtc");function K(M,t,T){const N=M[J];N&&(t=(t?[t,...N]:[...N]).join(" ")),t==null?M.removeAttribute("class"):T?M.setAttribute("class",t):M.className=t}const r=Symbol("_vod"),$=Symbol("_vsh"),q=Symbol(""),MM=/(?:^|;)\s*display\s*:/;function tM(M,t,T){const N=M.style,I=j(T);let g=!1;if(T&&!I){if(t)if(j(t))for(const L of t.split(";")){const c=L.slice(0,L.indexOf(":")).trim();T[c]==null&&n(N,c,"")}else for(const L in t)T[L]==null&&n(N,L,"");for(const L in T)L==="display"&&(g=!0),n(N,L,T[L])}else if(I){if(t!==T){const L=N[q];L&&(T+=";"+L),N.cssText=T,g=MM.test(T)}}else t&&M.removeAttribute("style");r in M&&(M[r]=g?N.display:"",M[$]&&(N.display="none"))}const C=/\s*!important$/;function n(M,t,T){if(a(T))T.forEach(N=>n(M,t,N));else if(T==null&&(T=""),t.startsWith("--"))M.setProperty(t,T);else{const N=TM(M,t);C.test(T)?M.setProperty(f(N),T.replace(C,""),"important"):M[N]=T}}const d=["Webkit","Moz","ms"],y={};function TM(M,t){const T=y[t];if(T)return T;let N=A(t);if(N!=="filter"&&N in M)return y[t]=N;N=W(N);for(let I=0;I<d.length;I++){const g=d[I]+N;if(g in M)return y[t]=g}return t}const O="http://www.w3.org/1999/xlink";function S(M,t,T,N,I,g=Z(t)){N&&t.startsWith("xlink:")?T==null?M.removeAttributeNS(O,t.slice(6,t.length)):M.setAttributeNS(O,t,T):T==null||g&&!H(T)?M.removeAttribute(t):M.setAttribute(t,g?"":P(T)?String(T):T)}function l(M,t,T,N,I){if(t==="innerHTML"||t==="textContent"){T!=null&&(M[t]=t==="innerHTML"?b(T):T);return}const g=M.tagName;if(t==="value"&&g!=="PROGRESS"&&!g.includes("-")){const c=g==="OPTION"?M.getAttribute("value")||"":M.value,D=T==null?M.type==="checkbox"?"on":"":String(T);(c!==D||!("_value"in M))&&(M.value=D),T==null&&M.removeAttribute(t),M._value=T;return}let L=!1;if(T===""||T==null){const c=typeof M[t];c==="boolean"?T=H(T):T==null&&c==="string"?(T="",L=!0):c==="number"&&(T=0,L=!0)}try{M[t]=T}catch{}L&&M.removeAttribute(I||t)}function Y(M,t,T,N){M.addEventListener(t,T,N)}function NM(M,t,T,N){M.removeEventListener(t,T,N)}const s=Symbol("_vei");function IM(M,t,T,N,I=null){const g=M[s]||(M[s]={}),L=g[t];if(N&&L)L.value=N;else{const[c,D]=LM(t);if(N){const v=g[t]=DM(N,I);Y(M,c,v,D)}else L&&(NM(M,c,L,D),g[t]=void 0)}}const w=/(?:Once|Passive|Capture)$/;function LM(M){let t;if(w.test(M)){t={};let N;for(;N=M.match(w);)M=M.slice(0,M.length-N[0].length),t[N[0].toLowerCase()]=!0}return[M[2]===":"?M.slice(3):f(M.slice(2)),t]}let o=0;const gM=Promise.resolve(),cM=()=>o||(gM.then(()=>o=0),o=Date.now());function DM(M,t){const T=N=>{if(!N._vts)N._vts=Date.now();else if(N._vts<=T.attached)return;R(iM(N,T.value),t,5,[N])};return T.value=M,T.attached=cM(),T}function iM(M,t){if(a(t)){const T=M.stopImmediatePropagation;return M.stopImmediatePropagation=()=>{T.call(M),M._stopped=!0},t.map(N=>I=>!I._stopped&&N&&N(I))}else return t}const m=M=>M.charCodeAt(0)===111&&M.charCodeAt(1)===110&&M.charCodeAt(2)>96&&M.charCodeAt(2)<123,AM=(M,t,T,N,I,g)=>{const L=I==="svg";t==="class"?K(M,N,L):t==="style"?tM(M,T,N):p(t)?B(t)||IM(M,t,T,N,g):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):jM(M,t,N,L))?(l(M,t,N),!M.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&S(M,t,N,L,g,t!=="value")):M._isVueCE&&(nM(M,t)||M._def.__asyncLoader&&(/[A-Z]/.test(t)||!j(N)))?l(M,A(t),N,g,t):(t==="true-value"?M._trueValue=N:t==="false-value"&&(M._falseValue=N),S(M,t,N,L))};function jM(M,t,T,N){if(N)return!!(t==="innerHTML"||t==="textContent"||t in M&&m(t)&&k(T));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&M.tagName==="IFRAME"||t==="form"||t==="list"&&M.tagName==="INPUT"||t==="type"&&M.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const I=M.tagName;if(I==="IMG"||I==="VIDEO"||I==="CANVAS"||I==="SOURCE")return!1}return m(t)&&j(T)?!1:t in M}function nM(M,t){const T=M._def.props;if(!T)return!1;const N=A(t);return Array.isArray(T)?T.some(I=>A(I)===N):Object.keys(T).some(I=>A(I)===N)}const Q=M=>{const t=M.props["onUpdate:modelValue"]||!1;return a(t)?T=>G(t,T):t},e=Symbol("_assign"),CM={created(M,{value:t},T){M.checked=E(t,T.props.value),M[e]=Q(T),Y(M,"change",()=>{M[e](yM(M))})},beforeUpdate(M,{value:t,oldValue:T},N){M[e]=Q(N),t!==T&&(M.checked=E(t,N.props.value))}};function yM(M){return"_value"in M?M._value:M.value}const oM=["ctrl","shift","alt","meta"],eM={stop:M=>M.stopPropagation(),prevent:M=>M.preventDefault(),self:M=>M.target!==M.currentTarget,ctrl:M=>!M.ctrlKey,shift:M=>!M.shiftKey,alt:M=>!M.altKey,meta:M=>!M.metaKey,left:M=>"button"in M&&M.button!==0,middle:M=>"button"in M&&M.button!==1,right:M=>"button"in M&&M.button!==2,exact:(M,t)=>oM.some(T=>M[`${T}Key`]&&!t.includes(T))},dM=(M,t)=>{if(!M)return M;const T=M._withMods||(M._withMods={}),N=t.join(".");return T[N]||(T[N]=((I,...g)=>{for(let L=0;L<t.length;L++){const c=eM[t[L]];if(c&&c(I,t))return}return M(I,...g)}))},xM=V({patchProp:AM},_);let U;function aM(){return U||(U=h(xM))}const OM=((...M)=>{const t=aM().createApp(...M),{mount:T}=t;return t.mount=N=>{const I=zM(N);if(!I)return;const g=t._component;!k(g)&&!g.render&&!g.template&&(g.template=I.innerHTML),I.nodeType===1&&(I.textContent="");const L=T(I,!1,EM(I));return I instanceof Element&&(I.removeAttribute("v-cloak"),I.setAttribute("data-v-app","")),L},t});function EM(M){if(M instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&M instanceof MathMLElement)return"mathml"}function zM(M){return j(M)?document.querySelector(M):M}const uM=new CSSStyleSheet;uM.replaceSync(`@layer kern-ux-icons {
	
		.kern-icon--arrow-back {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTI3NC00NTAgMjI3IDIyN3E5IDkgOSAyMXQtOSAyMXEtOSA5LTIxIDl0LTIxLTlMMTgxLTQ1OXEtNS01LTctMTB0LTItMTFxMC02IDItMTF0Ny0xMGwyNzgtMjc4cTktOSAyMS05dDIxIDlxOSA5IDkgMjF0LTkgMjFMMjc0LTUxMGg0OTZxMTMgMCAyMS41IDguNVQ4MDAtNDgwcTAgMTMtOC41IDIxLjVUNzcwLTQ1MEgyNzRaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--arrow-back {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTI3NC00NTAgMjI3IDIyN3E5IDkgOSAyMXQtOSAyMXEtOSA5LTIxIDl0LTIxLTlMMTgxLTQ1OXEtNS01LTctMTB0LTItMTFxMC02IDItMTF0Ny0xMGwyNzgtMjc4cTktOSAyMS05dDIxIDlxOSA5IDkgMjF0LTkgMjFMMjc0LTUxMGg0OTZxMTMgMCAyMS41IDguNVQ4MDAtNDgwcTAgMTMtOC41IDIxLjVUNzcwLTQ1MEgyNzRaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--arrow-forward {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTY4Ni00NTBIMTkwcS0xMyAwLTIxLjUtOC41VDE2MC00ODBxMC0xMyA4LjUtMjEuNVQxOTAtNTEwaDQ5Nkw0NTktNzM3cS05LTktOS0yMXQ5LTIxcTktOSAyMS05dDIxIDlsMjc4IDI3OHE1IDUgNyAxMHQyIDExcTAgNi0yIDExdC03IDEwTDUwMS0xODFxLTkgOS0yMSA5dC0yMS05cS05LTktOS0yMXQ5LTIxbDIyNy0yMjdaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon-fill--flag {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTI2MC00Mjl2Mjc5cTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42My04LjUtOC42Mi04LjUtMjEuMzd2LTYyMHEwLTEyLjc1IDguNjMtMjEuMzhRMjE3LjI1LTgwMCAyMzAtODAwaDI4OXExMC41IDAgMTguNzUgNi41VDU0OC03NzZsMTQgNjJoMjA4cTEyLjc1IDAgMjEuMzggOC42MlE4MDAtNjk2Ljc1IDgwMC02ODR2MzEwcTAgMTIuNzUtOC42MiAyMS4zN1E3ODIuNzUtMzQ0IDc3MC0zNDRINTY4cS0xMC41IDAtMTguNzUtNlQ1MzktMzY3bC0xNC02MkgyNjBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--splitscreen-left {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi02MDBxMC0yNCAxOC00MnQ0Mi0xOGgyMTBxMjQgMCA0MiAxOHQxOCA0MnY2MDBxMCAyNC0xOCA0MnQtNDIgMThIMTgwWm0zOTAgMHEtMjQgMC00Mi0xOHQtMTgtNDJ2LTYwMHEwLTI0IDE4LTQydDQyLTE4aDIxMHEyNCAwIDQyIDE4dDE4IDQydjYwMHEwIDI0LTE4IDQydC00MiAxOEg1NzBabTIxMC02NjBINTcwdjYwMGgyMTB2LTYwMFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon-fill--layers {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE1MS0zODZxLTEyLTguOTQtMTEuNS0yMy40N1QxNTIuMDgtNDMzcTguMy02IDE4LjExLTYgOS44MSAwIDE3LjgxIDZsMjkyIDIyNyAyOTItMjI3cTguMzItNiAxOC4xNi02dDE4LjA5IDUuOTdxMTIgOC45NSAxMi4zOCAyMy40OVE4MjEtMzk1IDgwOS0zODZMNTE3LTE1OXEtMTYuNSAxMy0zNi43NSAxM1Q0NDMtMTU5TDE1MS0zODZabTI5MiA3NUwxODEtNTE1cS0yMy0xNy44OC0yMy00Ni45NFQxODEtNjA5bDI2Mi0yMDRxMTYuNS0xMyAzNi43NS0xM1Q1MTctODEzbDI2MiAyMDRxMjMgMTcuODggMjMgNDYuOTRUNzc5LTUxNUw1MTctMzExcS0xNi41IDEzLTM2Ljc1IDEzVDQ0My0zMTFaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--ar-stickers {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC00MHEtMTY5IDAtMjY5LjUtNDFUMTEwLTE5MnEwLTMyIDMwLjUtNjMuNVQyMzEtMzA3bDUyIDQ2cS03NiAyNC05NC41IDQxLjVUMTcwLTE5MS41OFExNzAtMTY5IDI1MC41LTEzN1Q0ODAtMTA1cTE0OSAwIDIyOS41LTMydDgwLjUtNTQuNThxMC0xMC40Mi0xOC41LTI3LjkyVDY3Ny0yNjFsNTMtNDZxNjAgMjAgOTAgNTEuNXQzMCA2My41cTAgNzAtMTAwLjUgMTExVDQ4MC00MFptMC0xNjFxLTIwIDAtMzctOC41VDQxMC0yMzBMMTM0LTQ2N3EtMTEtMTAtMTcuNS0yMi43M1ExMTAtNTAyLjQ3IDExMC01MTZ2LTc4cTAtMTQgNi41LTI1dDE2LjUtMjBsMjc2LTI1NnExNC0xNCAzMi4zOC0yMCAxOC4zNy02IDM4LjUtNiAyMC4xMiAwIDM4LjYyIDYgMTguNSA2IDMyLjUgMjBsMjc2IDI1NnExMCA5IDE2LjUgMjB0Ni41IDI1djc4cTAgMTMuNTMtNi41IDI2LjI3UTgzNy00NzcgODI2LTQ2N0w1NTAtMjMwcS0xNiAxMi0zMyAyMC41dC0zNyA4LjVabS0yLTE3MXExNS40IDAgMjkuMTUtNC45N1E1MjAuOS0zODEuOTUgNTMzLTM5M2wyMzktMjE4LTI2My0yMzhxLTUtNy0xMS41LTkuNVQ0ODMtODYwcS04IDEtMTYgMy41dC0xNiA3LjVMMTg3LTYwOWwyMzYuMDkgMjE1LjgyUTQzNS0zODIgNDQ4Ljc4LTM3N3ExMy43OCA1IDI5LjIyIDVaTTM0OS44OS01NTdRMzcwLTU1NyAzODQtNTcwLjg5cTE0LTEzLjg4IDE0LTM0UTM5OC02MjUgMzg0LjExLTYzOXEtMTMuODgtMTQtMzQtMTRRMzMwLTY1MyAzMTYtNjM5LjExcS0xNCAxMy44OC0xNCAzNFEzMDItNTg1IDMxNS44OS01NzFxMTMuODggMTQgMzQgMTRaTTQxNS00OTZxNDUgMjAgOTMgMTAuNXQ4NC00Mi41cTMzLTI5IDQzLjUtNzF0LTYuNS04M0w0MTUtNDk2Wm02NC44OS0xODdRNTAwLTY4MyA1MTQtNjk2Ljg5cTE0LTEzLjg4IDE0LTM0UTUyOC03NTEgNTE0LjExLTc2NXEtMTMuODgtMTQtMzQtMTRRNDYwLTc3OSA0NDYtNzY1LjExcS0xNCAxMy44OC0xNCAzNFE0MzItNzExIDQ0NS44OS02OTdxMTMuODggMTQgMzQgMTRabS4xMSA2N1oiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--open-in-new {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi02MDBxMC0yNCAxOC00MnQ0Mi0xOGgyNDlxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNUgxODB2NjAwaDYwMHYtMjQ5cTAtMTIuNzUgOC42OC0yMS4zOCA4LjY3LTguNjIgMjEuNS04LjYyIDEyLjgyIDAgMjEuMzIgOC42MiA4LjUgOC42MyA4LjUgMjEuMzh2MjQ5cTAgMjQtMTggNDJ0LTQyIDE4SDE4MFptNjAwLTYxN0w0MDMtMzYwcS05IDktMjEgOC41dC0yMS05LjVxLTktOS05LTIxdDktMjFsMzc3LTM3N0g1NDlxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoMjYxcTEyLjc1IDAgMjEuMzggOC42MlE4NDAtODIyLjc1IDg0MC04MTB2MjYxcTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42My04LjUtOC42Mi04LjUtMjEuMzd2LTE4OFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--check {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTM3OC0zMzIgMzYzLTM2M3E5LjI3LTkgMjEuNjQtOSAxMi4zNiAwIDIxLjM2IDkuMDUgOSA5LjA2IDkgMjEuNSAwIDEyLjQ1LTkgMjEuNDVMMzk5LTI2N3EtOSA5LTIxIDl0LTIxLTlMMTc1LTQ0OXEtOS05LjA3LTguNS0yMS41My41LTEyLjQ3IDkuNTUtMjEuNDcgOS4wNi05IDIxLjUtOSAxMi40NSAwIDIxLjQ1IDlsMTU5IDE2MFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon-fill--content-copy {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTMwMC0yMDBxLTI0IDAtNDItMTh0LTE4LTQydi01NjBxMC0yNCAxOC00MnQ0Mi0xOGg0NDBxMjQgMCA0MiAxOHQxOCA0MnY1NjBxMCAyNC0xOCA0MnQtNDIgMThIMzAwWk0xODAtODBxLTI0IDAtNDItMTh0LTE4LTQydi01OTBxMC0xMyA4LjUtMjEuNVQxNTAtNzYwcTEzIDAgMjEuNSA4LjVUMTgwLTczMHY1OTBoNDcwcTEzIDAgMjEuNSA4LjVUNjgwLTExMHEwIDEzLTguNSAyMS41VDY1MC04MEgxODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon-fill--check-circle {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTQyMS0zODktOTgtOThxLTktOS0yMi05dC0yMyAxMHEtOSA5LTkgMjJ0OSAyMmwxMjIgMTIzcTkgOSAyMSA5dDIxLTlsMjM5LTIzOXExMC0xMCAxMC0yM3QtMTAtMjNxLTEwLTktMjMuNS04LjVUNjM1LTYwM0w0MjEtMzg5Wm01OSAzMDlxLTgyIDAtMTU1LTMxLjV0LTEyNy41LTg2UTE0My0yNTIgMTExLjUtMzI1VDgwLTQ4MHEwLTgzIDMxLjUtMTU2dDg2LTEyN1EyNTItODE3IDMyNS04NDguNVQ0ODAtODgwcTgzIDAgMTU2IDMxLjVUNzYzLTc2M3E1NCA1NCA4NS41IDEyN1Q4ODAtNDgwcTAgODItMzEuNSAxNTVUNzYzLTE5Ny41cS01NCA1NC41LTEyNyA4NlQ0ODAtODBaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon-fill--ar-stickers {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC00MHEtMTY5IDAtMjY5LjUtNDFUMTEwLTE5MnEwLTMyIDMwLjUtNjMuNVQyMzEtMzA3bDUyIDQ2cS03NiAyNC05NC41IDQxLjVUMTcwLTE5MnEwIDIzIDgwLjUgNTVUNDgwLTEwNXExNDkgMCAyMjkuNS0zMnQ4MC41LTU1cTAtMTAtMTguNS0yNy41VDY3Ny0yNjFsNTMtNDZxNjAgMjAgOTAgNTEuNXQzMCA2My41cTAgNzAtMTAwLjUgMTExVDQ4MC00MFptMC0xNjFxLTIwIDAtMzctOC41VDQxMC0yMzBMMTM0LTQ2N3EtMTEtMTAtMTcuNS0yMi41VDExMC01MTZ2LTc4cTAtMTQgNi41LTI1dDE2LjUtMjBsMjc2LTI1NnExNC0xNCAzMi41LTIwdDM4LjUtNnEyMCAwIDM4LjUgNnQzMi41IDIwbDI3NiAyNTZxMTAgOSAxNi41IDIwdDYuNSAyNXY3OHEwIDE0LTYuNSAyNi41VDgyNi00NjdMNTUwLTIzMHEtMTYgMTItMzMgMjAuNXQtMzcgOC41Wk0zNTAtNTU3cTIwIDAgMzQtMTR0MTQtMzRxMC0yMC0xNC0zNHQtMzQtMTRxLTIwIDAtMzQgMTR0LTE0IDM0cTAgMjAgMTQgMzR0MzQgMTRabTY1IDYxcTQ1IDIwIDkzIDEwLjV0ODQtNDIuNXEzMy0yOSA0My41LTcxdC02LjUtODNMNDE1LTQ5NlptNjUtMTg3cTIwIDAgMzQtMTR0MTQtMzRxMC0yMC0xNC0zNHQtMzQtMTRxLTIwIDAtMzQgMTR0LTE0IDM0cTAgMjAgMTQgMzR0MzQgMTRaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--open-in-new {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi02MDBxMC0yNCAxOC00MnQ0Mi0xOGgyNDlxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNUgxODB2NjAwaDYwMHYtMjQ5cTAtMTIuNzUgOC42OC0yMS4zOCA4LjY3LTguNjIgMjEuNS04LjYyIDEyLjgyIDAgMjEuMzIgOC42MiA4LjUgOC42MyA4LjUgMjEuMzh2MjQ5cTAgMjQtMTggNDJ0LTQyIDE4SDE4MFptNjAwLTYxN0w0MDMtMzYwcS05IDktMjEgOC41dC0yMS05LjVxLTktOS05LTIxdDktMjFsMzc3LTM3N0g1NDlxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoMjYxcTEyLjc1IDAgMjEuMzggOC42MlE4NDAtODIyLjc1IDg0MC04MTB2MjYxcTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42My04LjUtOC42Mi04LjUtMjEuMzd2LTE4OFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--check {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTM3OC0zMzIgMzYzLTM2M3E5LjI3LTkgMjEuNjQtOSAxMi4zNiAwIDIxLjM2IDkuMDUgOSA5LjA2IDkgMjEuNSAwIDEyLjQ1LTkgMjEuNDVMMzk5LTI2N3EtOSA5LTIxIDl0LTIxLTlMMTc1LTQ0OXEtOS05LjA3LTguNS0yMS41My41LTEyLjQ3IDkuNTUtMjEuNDcgOS4wNi05IDIxLjUtOSAxMi40NSAwIDIxLjQ1IDlsMTU5IDE2MFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--home {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIyMC0xODBoMTUwdi0yMjBxMC0xMi43NSA4LjYzLTIxLjM4UTM4Ny4yNS00MzAgNDAwLTQzMGgxNjBxMTIuNzUgMCAyMS4zOCA4LjYyUTU5MC00MTIuNzUgNTkwLTQwMHYyMjBoMTUwdi0zOTBMNDgwLTc2NSAyMjAtNTcwdjM5MFptLTYwIDB2LTM5MHEwLTE0LjI1IDYuMzgtMjcgNi4zNy0xMi43NSAxNy42Mi0yMWwyNjAtMTk1cTE1LjY4LTEyIDM1Ljg0LTEyUTUwMC04MjUgNTE2LTgxM2wyNjAgMTk1cTExLjI1IDguMjUgMTcuNjMgMjEgNi4zNyAxMi43NSA2LjM3IDI3djM5MHEwIDI0Ljc1LTE3LjYyIDQyLjM3UTc2NC43NS0xMjAgNzQwLTEyMEg1NjBxLTEyLjc1IDAtMjEuMzctOC42M1E1MzAtMTM3LjI1IDUzMC0xNTB2LTIyMEg0MzB2MjIwcTAgMTIuNzUtOC42MiAyMS4zN1E0MTIuNzUtMTIwIDQwMC0xMjBIMjIwcS0yNC43NSAwLTQyLjM3LTE3LjYzUTE2MC0xNTUuMjUgMTYwLTE4MFptMzIwLTI5M1oiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--school {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIyMC0yNjJxLTE0LTgtMjIuNS0yMS44OFExODktMjk3Ljc1IDE4OS0zMTV2LTIwNEw4OS01NzRxLTgtNS0xMi0xMS41My00LTYuNTItNC0xNC41IDAtNy45NyA0LTE0LjQ3IDQtNi41IDEyLTExLjVsMzYxLTE5OHE3LTQgMTQuMjEtNS41IDcuMi0xLjUgMTQuNzktMS41IDcuNTkgMCAxNC43OSAxLjVRNTAxLTgyOCA1MDgtODI0bDM5NiAyMTVxOCA1IDEyIDExLjk3IDQgNi45NiA0IDE1LjAzdjI2OXEwIDEyLjc1LTguNjggMjEuMzctOC42NyA4LjYzLTIxLjUgOC42My0xMi44MiAwLTIxLjMyLTguNjMtOC41LTguNjItOC41LTIxLjM3di0yNTJsLTkxIDQ2djIwNHEwIDE3LjI1LTguNSAzMS4xMlE3NTItMjcwIDczOC0yNjJMNTA4LTEzNnEtNyA0LTE0LjIxIDUuNS03LjIgMS41LTE0Ljc5IDEuNS03LjU5IDAtMTQuNzktMS41UTQ1Ny0xMzIgNDUwLTEzNkwyMjAtMjYyWm0yNTktMTY2IDMxNS0xNzItMzE1LTE2OS0zMTMgMTY5IDMxMyAxNzJabTAgMjQwIDIzMC0xMjd2LTE2OEw1MDgtMzc1cS03IDQtMTQgNS41dC0xNSAxLjVxLTggMC0xNC41LTEuNVQ0NTEtMzc1TDI0OS00ODV2MTcwbDIzMCAxMjdabTEtMjQwWm0tMSA5MFptMCAwWiIvPjwvc3ZnPg==");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--book-5 {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTI3MC04MHEtNDUgMC03Ny41LTI5LjY0UTE2MC0xMzkuMjcgMTYwLTE4M3YtNTY0cTAtMzYuNTcgMjIuMTItNjUuNDNRMjA0LjI0LTg0MS4zIDI0MC04NDlsMzA4LTY0cTI4LTYgNTAgMTIuMTRUNjIwLTg1NHY0OTdxMCAyMS4xNi0xMyAzNy41OFE1OTQtMzAzIDU3My0yOThsLTMxMyA2N3EtMTcuMTQgMy42OS0yOC41NyAxNy41NFEyMjAtMTk5LjYyIDIyMC0xODNxMCAxOSAxNSAzMXQzNSAxMmg0NzB2LTYzMHEwLTEyLjc1IDguNjgtMjEuMzggOC42Ny04LjYyIDIxLjUtOC42MiAxMi44MiAwIDIxLjMyIDguNjIgOC41IDguNjMgOC41IDIxLjM4djYzMHEwIDI0Ljc1LTE3LjYyIDQyLjM3UTc2NC43NS04MCA3NDAtODBIMjcwWm03MC0yMjggMjIwLTQ3di00OTlsLTIyMCA0NXY1MDFabS02MCAxMi44MVYtNzk2bC0yMCA0cS0xNyA0LTI4LjUgMTUuODNRMjIwLTc2NC4zNSAyMjAtNzQ3djQ3MXE5LjA2LTUuMiAxOS4wMy05LjFRMjQ5LTI4OSAyNjAtMjkxbDIwLTQuMTlaTTIyMC03OTJ2NTE2LTUxNloiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--open-in-new {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi02MDBxMC0yNCAxOC00MnQ0Mi0xOGgyNDlxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNUgxODB2NjAwaDYwMHYtMjQ5cTAtMTIuNzUgOC42OC0yMS4zOCA4LjY3LTguNjIgMjEuNS04LjYyIDEyLjgyIDAgMjEuMzIgOC42MiA4LjUgOC42MyA4LjUgMjEuMzh2MjQ5cTAgMjQtMTggNDJ0LTQyIDE4SDE4MFptNjAwLTYxN0w0MDMtMzYwcS05IDktMjEgOC41dC0yMS05LjVxLTktOS05LTIxdDktMjFsMzc3LTM3N0g1NDlxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoMjYxcTEyLjc1IDAgMjEuMzggOC42MlE4NDAtODIyLjc1IDg0MC04MTB2MjYxcTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42My04LjUtOC42Mi04LjUtMjEuMzd2LTE4OFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--check {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTM3OC0zMzIgMzYzLTM2M3E5LjI3LTkgMjEuNjQtOSAxMi4zNiAwIDIxLjM2IDkuMDUgOSA5LjA2IDkgMjEuNSAwIDEyLjQ1LTkgMjEuNDVMMzk5LTI2N3EtOSA5LTIxIDl0LTIxLTlMMTc1LTQ0OXEtOS05LjA3LTguNS0yMS41My41LTEyLjQ3IDkuNTUtMjEuNDcgOS4wNi05IDIxLjUtOSAxMi40NSAwIDIxLjQ1IDlsMTU5IDE2MFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--location-on {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC0xNTlxMTMzLTEyMSAxOTYuNS0yMTkuNVQ3NDAtNTUycTAtMTE3Ljc5LTc1LjI5LTE5Mi45UTU4OS40Mi04MjAgNDgwLTgyMHQtMTg0LjcxIDc1LjFRMjIwLTY2OS43OSAyMjAtNTUycTAgNzUgNjUgMTczLjVUNDgwLTE1OVptLS4yNSA1OXEtMTAuNzUgMC0yMS4yNS0zLjVUNDQwLTExNXEtNDItMzgtOTEtODcuNVQyNTgtMzA5cS00Mi01Ny03MC0xMTl0LTI4LTEyNHEwLTE1MCA5Ni41LTIzOVQ0ODAtODgwcTEyNyAwIDIyMy41IDg5VDgwMC01NTJxMCA2Mi0yOCAxMjR0LTcwIDExOXEtNDIgNTctOTEgMTA2LjVUNTIwLTExNXEtOCA4LTE4Ljc1IDExLjV0LTIxLjUgMy41Wm0uMjUtNDYwWm0uMDkgNzBxMjguOTEgMCA0OS40MS0yMC41OSAyMC41LTIwLjU5IDIwLjUtNDkuNXQtMjAuNTktNDkuNDFxLTIwLjU5LTIwLjUtNDkuNS0yMC41dC00OS40MSAyMC41OXEtMjAuNSAyMC41OS0yMC41IDQ5LjV0MjAuNTkgNDkuNDFxMjAuNTkgMjAuNSA0OS41IDIwLjVaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--palette {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC04MHEtODIgMC0xNTUtMzEuNXQtMTI3LjUtODZRMTQzLTI1MiAxMTEuNS0zMjVUODAtNDgwcTAtODUgMzItMTU4dDg3LjUtMTI3cTU1LjUtNTQgMTMwLTg0LjVUNDg5LTg4MHE3OSAwIDE1MCAyNi41VDc2My41LTc4MHE1My41IDQ3IDg1IDExMS41VDg4MC01MjdxMCAxMDgtNjMgMTcwLjVUNjUwLTI5NGgtNzVxLTE4IDAtMzEgMTR0LTEzIDMxcTAgMjcgMTQuNSA0NnQxNC41IDQ0cTAgMzgtMjEgNTguNVQ0ODAtODBabTAtNDAwWm0tMjMzIDI2cTIwIDAgMzUtMTV0MTUtMzVxMC0yMC0xNS0zNXQtMzUtMTVxLTIwIDAtMzUgMTV0LTE1IDM1cTAgMjAgMTUgMzV0MzUgMTVabTEyNi0xNzBxMjAgMCAzNS0xNXQxNS0zNXEwLTIwLTE1LTM1dC0zNS0xNXEtMjAgMC0zNSAxNXQtMTUgMzVxMCAyMCAxNSAzNXQzNSAxNVptMjE0IDBxMjAgMCAzNS0xNXQxNS0zNXEwLTIwLTE1LTM1dC0zNS0xNXEtMjAgMC0zNSAxNXQtMTUgMzVxMCAyMCAxNSAzNXQzNSAxNVptMTMxIDE3MHEyMCAwIDM1LTE1dDE1LTM1cTAtMjAtMTUtMzV0LTM1LTE1cS0yMCAwLTM1IDE1dC0xNSAzNXEwIDIwIDE1IDM1dDM1IDE1Wk00ODAtMTQwcTExIDAgMTUuNS00LjVUNTAwLTE1OXEwLTE0LTE0LjUtMjZUNDcxLTIzOHEwLTQ2IDMwLTgxdDc2LTM1aDczcTc2IDAgMTIzLTQ0LjVUODIwLTUyN3EwLTEzMi0xMDAtMjEyLjVUNDg5LTgyMHEtMTQ2IDAtMjQ3LjUgOTguNVQxNDAtNDgwcTAgMTQxIDk5LjUgMjQwLjVUNDgwLTE0MFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--rocket-launch {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTI5Mi01MDZxMTgtMzYgMzguNS03MXQ0My41LTY3bC03OS0xNi0xMDkgMTA5IDEwNiA0NVptNTE1LTMxMnEtMTAyIDUtMTg0IDQzLjVUNDYzLTY1OHEtMzEgMzEtNjQgODF0LTU5IDEwN2wxMzMgMTMzcTU3LTI2IDEwNy01OXQ4MS02NHE3OC03OCAxMTYuNS0xNTkuNVQ4MjEtODAzcTAtMy0xLTZ0LTMtNXEtMi0yLTQuNS0zdC01LjUtMVpNNTcwLTU2NnEtMjAtMjAtMjAtNDkuNXQyMC00OS41cTIwLTIwIDQ5LjUtMjB0NDkuNSAyMHEyMCAyMCAyMCA0OS41VDY2OS01NjZxLTIwIDIwLTQ5LjUgMjBUNTcwLTU2NlptLTYxIDI3OCA0NSAxMDUgMTA5LTEwOS0xNS03OXEtMzIgMjMtNjcuNSA0NFQ1MDktMjg4Wm0zNzMtNTU5cTMgMTI1LTQwLjUgMjMwLjVUNzA0LTQxN3EtMSAxLTIgMS41dC0yIDEuNWwyMiAxMTBxMyAxNS0xIDI5dC0xNSAyNUw1NjUtMTA5cS0xMSAxMS0yNi41IDhUNTE3LTExOWwtNjgtMTU3LTE2OS0xNzAtMTU4LTY3cS0xNS02LTE3LjUtMjJ0OC41LTI3bDE0MC0xNDBxMTEtMTEgMjUtMTUuNXQyOS0xLjVsMTEwIDIycTEtMSAyLTEuNXQyLTEuNXE5NC05NCAxOTktMTM3LjVUODUwLTg3OHE2IDAgMTEuNSAyLjVUODcyLTg2OHE1IDUgNy41IDEwdDIuNSAxMVpNMTQ5LTMyNXEzNS0zNSA4NS41LTM1LjVUMzIwLTMyNnEzNSAzNSAzNC41IDg1LjVUMzE5LTE1NXEtNDcgNDctMTEyLjUgNTYuNVQ3NS04MGwxOC0xMzJxOS02NiA1Ni0xMTNabTQyIDQzcS0yNCAyNi0zMSA2MHQtMTMgNjlxMzUtNiA2OS0xM3Q2MC0zMXEyMC0xNyAyMC00Mi41VDI3OC0yODRxLTE5LTE4LTQ0LjUtMThUMTkxLTI4MloiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	
}`);const SM=(M,t)=>{const T=M.__vccOpts||M;for(const[N,I]of t)T[N]=I;return T};export{SM as _,OM as c,uM as s,CM as v,dM as w};
