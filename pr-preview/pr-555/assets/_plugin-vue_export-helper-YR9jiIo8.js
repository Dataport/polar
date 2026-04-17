import{i as V,c as B,a as A,e as P,b as p,d as Z,f as i,g as H,j as W,k as R,l as C,m as e,n as X,o as G,p as u,q as F}from"./runtime-core.esm-bundler-BZeKpgYv.js";let a;const S=typeof window<"u"&&window.trustedTypes;if(S)try{a=S.createPolicy("vue",{createHTML:M=>M})}catch{}const b=a?M=>a.createHTML(M):M=>M,J="http://www.w3.org/2000/svg",_="http://www.w3.org/1998/Math/MathML",y=typeof document<"u"?document:null,d=y&&y.createElement("template"),K={insert:(M,t,T)=>{t.insertBefore(M,T||null)},remove:M=>{const t=M.parentNode;t&&t.removeChild(M)},createElement:(M,t,T,N)=>{const I=t==="svg"?y.createElementNS(J,M):t==="mathml"?y.createElementNS(_,M):T?y.createElement(M,{is:T}):y.createElement(M);return M==="select"&&N&&N.multiple!=null&&I.setAttribute("multiple",N.multiple),I},createText:M=>y.createTextNode(M),createComment:M=>y.createComment(M),setText:(M,t)=>{M.nodeValue=t},setElementText:(M,t)=>{M.textContent=t},parentNode:M=>M.parentNode,nextSibling:M=>M.nextSibling,querySelector:M=>y.querySelector(M),setScopeId(M,t){M.setAttribute(t,"")},insertStaticContent(M,t,T,N,I,D){const L=T?T.previousSibling:t.lastChild;if(I&&(I===D||I.nextSibling))for(;t.insertBefore(I.cloneNode(!0),T),!(I===D||!(I=I.nextSibling)););else{d.innerHTML=b(N==="svg"?`<svg>${M}</svg>`:N==="mathml"?`<math>${M}</math>`:M);const g=d.content;if(N==="svg"||N==="mathml"){const c=g.firstChild;for(;c.firstChild;)g.appendChild(c.firstChild);g.removeChild(c)}t.insertBefore(g,T)}return[L?L.nextSibling:t.firstChild,T?T.previousSibling:t.lastChild]}},$=Symbol("_vtc");function q(M,t,T){const N=M[$];N&&(t=(t?[t,...N]:[...N]).join(" ")),t==null?M.removeAttribute("class"):T?M.setAttribute("class",t):M.className=t}const E=Symbol("_vod"),f=Symbol("_vsh"),OM={name:"show",beforeMount(M,{value:t},{transition:T}){M[E]=M.style.display==="none"?"":M.style.display,T&&t?T.beforeEnter(M):j(M,t)},mounted(M,{value:t},{transition:T}){T&&t&&T.enter(M)},updated(M,{value:t,oldValue:T},{transition:N}){!t!=!T&&(N?t?(N.beforeEnter(M),j(M,!0),N.enter(M)):N.leave(M,()=>{j(M,!1)}):j(M,t))},beforeUnmount(M,{value:t}){j(M,t)}};function j(M,t){M.style.display=t?M[E]:"none",M[f]=!t}const MM=Symbol(""),tM=/(?:^|;)\s*display\s*:/;function TM(M,t,T){const N=M.style,I=A(T);let D=!1;if(T&&!I){if(t)if(A(t))for(const L of t.split(";")){const g=L.slice(0,L.indexOf(":")).trim();T[g]==null&&x(N,g,"")}else for(const L in t)T[L]==null&&x(N,L,"");for(const L in T)L==="display"&&(D=!0),x(N,L,T[L])}else if(I){if(t!==T){const L=N[MM];L&&(T+=";"+L),N.cssText=T,D=tM.test(T)}}else t&&M.removeAttribute("style");E in M&&(M[E]=D?N.display:"",M[f]&&(N.display="none"))}const O=/\s*!important$/;function x(M,t,T){if(C(T))T.forEach(N=>x(M,t,N));else if(T==null&&(T=""),t.startsWith("--"))M.setProperty(t,T);else{const N=NM(M,t);O.test(T)?M.setProperty(e(N),T.replace(O,""),"important"):M[N]=T}}const r=["Webkit","Moz","ms"],n={};function NM(M,t){const T=n[t];if(T)return T;let N=i(t);if(N!=="filter"&&N in M)return n[t]=N;N=X(N);for(let I=0;I<r.length;I++){const D=r[I]+N;if(D in M)return n[t]=D}return t}const l="http://www.w3.org/1999/xlink";function w(M,t,T,N,I,D=R(t)){N&&t.startsWith("xlink:")?T==null?M.removeAttributeNS(l,t.slice(6,t.length)):M.setAttributeNS(l,t,T):T==null||D&&!H(T)?M.removeAttribute(t):M.setAttribute(t,D?"":W(T)?String(T):T)}function s(M,t,T,N,I){if(t==="innerHTML"||t==="textContent"){T!=null&&(M[t]=t==="innerHTML"?b(T):T);return}const D=M.tagName;if(t==="value"&&D!=="PROGRESS"&&!D.includes("-")){const g=D==="OPTION"?M.getAttribute("value")||"":M.value,c=T==null?M.type==="checkbox"?"on":"":String(T);(g!==c||!("_value"in M))&&(M.value=c),T==null&&M.removeAttribute(t),M._value=T;return}let L=!1;if(T===""||T==null){const g=typeof M[t];g==="boolean"?T=H(T):T==null&&g==="string"?(T="",L=!0):g==="number"&&(T=0,L=!0)}try{M[t]=T}catch{}L&&M.removeAttribute(I||t)}function v(M,t,T,N){M.addEventListener(t,T,N)}function IM(M,t,T,N){M.removeEventListener(t,T,N)}const U=Symbol("_vei");function LM(M,t,T,N,I=null){const D=M[U]||(M[U]={}),L=D[t];if(N&&L)L.value=N;else{const[g,c]=DM(t);if(N){const h=D[t]=yM(N,I);v(M,g,h,c)}else L&&(IM(M,g,L,c),D[t]=void 0)}}const Q=/(?:Once|Passive|Capture)$/;function DM(M){let t;if(Q.test(M)){t={};let N;for(;N=M.match(Q);)M=M.slice(0,M.length-N[0].length),t[N[0].toLowerCase()]=!0}return[M[2]===":"?M.slice(3):e(M.slice(2)),t]}let z=0;const gM=Promise.resolve(),cM=()=>z||(gM.then(()=>z=0),z=Date.now());function yM(M,t){const T=N=>{if(!N._vts)N._vts=Date.now();else if(N._vts<=T.attached)return;G(jM(N,T.value),t,5,[N])};return T.value=M,T.attached=cM(),T}function jM(M,t){if(C(t)){const T=M.stopImmediatePropagation;return M.stopImmediatePropagation=()=>{T.call(M),M._stopped=!0},t.map(N=>I=>!I._stopped&&N&&N(I))}else return t}const m=M=>M.charCodeAt(0)===111&&M.charCodeAt(1)===110&&M.charCodeAt(2)>96&&M.charCodeAt(2)<123,iM=(M,t,T,N,I,D)=>{const L=I==="svg";t==="class"?q(M,N,L):t==="style"?TM(M,T,N):p(t)?Z(t)||LM(M,t,T,N,D):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):AM(M,t,N,L))?(s(M,t,N),!M.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&w(M,t,N,L,D,t!=="value")):M._isVueCE&&(xM(M,t)||M._def.__asyncLoader&&(/[A-Z]/.test(t)||!A(N)))?s(M,i(t),N,D,t):(t==="true-value"?M._trueValue=N:t==="false-value"&&(M._falseValue=N),w(M,t,N,L))};function AM(M,t,T,N){if(N)return!!(t==="innerHTML"||t==="textContent"||t in M&&m(t)&&V(T));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&M.tagName==="IFRAME"||t==="form"||t==="list"&&M.tagName==="INPUT"||t==="type"&&M.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const I=M.tagName;if(I==="IMG"||I==="VIDEO"||I==="CANVAS"||I==="SOURCE")return!1}return m(t)&&A(T)?!1:t in M}function xM(M,t){const T=M._def.props;if(!T)return!1;const N=i(t);return Array.isArray(T)?T.some(I=>i(I)===N):Object.keys(T).some(I=>i(I)===N)}const k=M=>{const t=M.props["onUpdate:modelValue"]||!1;return C(t)?T=>F(t,T):t},o=Symbol("_assign"),rM={created(M,{value:t},T){M.checked=u(t,T.props.value),M[o]=k(T),v(M,"change",()=>{M[o](EM(M))})},beforeUpdate(M,{value:t,oldValue:T},N){M[o]=k(N),t!==T&&(M.checked=u(t,N.props.value))}};function EM(M){return"_value"in M?M._value:M.value}const nM=["ctrl","shift","alt","meta"],zM={stop:M=>M.stopPropagation(),prevent:M=>M.preventDefault(),self:M=>M.target!==M.currentTarget,ctrl:M=>!M.ctrlKey,shift:M=>!M.shiftKey,alt:M=>!M.altKey,meta:M=>!M.metaKey,left:M=>"button"in M&&M.button!==0,middle:M=>"button"in M&&M.button!==1,right:M=>"button"in M&&M.button!==2,exact:(M,t)=>nM.some(T=>M[`${T}Key`]&&!t.includes(T))},lM=(M,t)=>{if(!M)return M;const T=M._withMods||(M._withMods={}),N=t.join(".");return T[N]||(T[N]=((I,...D)=>{for(let L=0;L<t.length;L++){const g=zM[t[L]];if(g&&g(I,t))return}return M(I,...D)}))},oM={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},wM=(M,t)=>{const T=M._withKeys||(M._withKeys={}),N=t.join(".");return T[N]||(T[N]=(I=>{if(!("key"in I))return;const D=e(I.key);if(t.some(L=>L===D||oM[L]===D))return M(I)}))},aM=P({patchProp:iM},K);let Y;function CM(){return Y||(Y=B(aM))}const sM=((...M)=>{const t=CM().createApp(...M),{mount:T}=t;return t.mount=N=>{const I=uM(N);if(!I)return;const D=t._component;!V(D)&&!D.render&&!D.template&&(D.template=I.innerHTML),I.nodeType===1&&(I.textContent="");const L=T(I,!1,eM(I));return I instanceof Element&&(I.removeAttribute("v-cloak"),I.setAttribute("data-v-app","")),L},t});function eM(M){if(M instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&M instanceof MathMLElement)return"mathml"}function uM(M){return A(M)?document.querySelector(M):M}const SM=new CSSStyleSheet;SM.replaceSync(`@layer kern-ux-icons {
	
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
	

		.kern-icon--ar-stickers {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIxMC41LTgxUTExMC0xMjIgMTEwLTE5MnEwLTMyIDMwLjUtNjMuNVQyMzEtMzA3bDUyIDQ2cS03NiAyNC05NC41IDQxLjVUMTcwLTE5MnEwIDIzIDgwLjUgNTVUNDgwLTEwNXExNDkgMCAyMjkuNS0zMnQ4MC41LTU1cTAtMTAtMTguNS0yNy41VDY3Ny0yNjFsNTMtNDZxNjAgMjAgOTAgNTEuNXQzMCA2My41cTAgNzAtMTAwLjUgMTExVDQ4MC00MHEtMTY5IDAtMjY5LjUtNDFaTTQ0My0yMDkuNXEtMTctOC41LTMzLTIwLjVMMTM0LTQ2N3EtMTEtMTAtMTcuNS0yMi41VDExMC01MTZ2LTc4cTAtMTQgNi41LTI1dDE2LjUtMjBsMjc2LTI1NnExNC0xNCAzMi41LTIwdDM4LjUtNnEyMCAwIDM4LjUgNnQzMi41IDIwbDI3NiAyNTZxMTAgOSAxNi41IDIwdDYuNSAyNXY3OHEwIDE0LTYuNSAyNi41VDgyNi00NjdMNTUwLTIzMHEtMTYgMTItMzMgMjAuNXQtMzcgOC41cS0yMCAwLTM3LTguNVpNNTA3LTM3N3ExNC01IDI2LTE2bDIzOS0yMTgtMjYzLTIzOHEtNS03LTExLjUtOS41VDQ4My04NjBxLTggMS0xNiAzLjV0LTE2IDcuNUwxODctNjA5bDIzNiAyMTZxMTIgMTEgMjYgMTZ0MjkgNXExNSAwIDI5LTVaTTM4NC01NzFxMTQtMTQgMTQtMzR0LTE0LTM0cS0xNC0xNC0zNC0xNHQtMzQgMTRxLTE0IDE0LTE0IDM0dDE0IDM0cTE0IDE0IDM0IDE0dDM0LTE0Wm0zMSA3NXE0NSAyMCA5MyAxMC41dDg0LTQyLjVxMzMtMjkgNDMuNS03MXQtNi41LTgzTDQxNS00OTZabTk5LTIwMXExNC0xNCAxNC0zNHQtMTQtMzRxLTE0LTE0LTM0LTE0dC0zNCAxNHEtMTQgMTQtMTQgMzR0MTQgMzRxMTQgMTQgMzQgMTR0MzQtMTRabS0zNCA4MVoiLz48L3N2Zz4=");
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
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTM3OC0zMzIgMzYzLTM2M3E5LTkgMjEuNS05dDIxLjUgOXE5IDkgOSAyMS41dC05IDIxLjVMMzk5LTI2N3EtOSA5LTIxIDl0LTIxLTlMMTc1LTQ0OXEtOS05LTguNS0yMS41VDE3Ni00OTJxOS05IDIxLjUtOXQyMS41IDlsMTU5IDE2MFoiLz48L3N2Zz4=");
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
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIxMC41LTgxUTExMC0xMjIgMTEwLTE5MnEwLTMyIDMwLjUtNjMuNVQyMzEtMzA3bDUyIDQ2cS03NiAyNC05NC41IDQxLjVUMTcwLTE5MnEwIDIzIDgwLjUgNTVUNDgwLTEwNXExNDkgMCAyMjkuNS0zMnQ4MC41LTU1cTAtMTAtMTguNS0yNy41VDY3Ny0yNjFsNTMtNDZxNjAgMjAgOTAgNTEuNXQzMCA2My41cTAgNzAtMTAwLjUgMTExVDQ4MC00MHEtMTY5IDAtMjY5LjUtNDFaTTQ0My0yMDkuNXEtMTctOC41LTMzLTIwLjVMMTM0LTQ2N3EtMTEtMTAtMTcuNS0yMi41VDExMC01MTZ2LTc4cTAtMTQgNi41LTI1dDE2LjUtMjBsMjc2LTI1NnExNC0xNCAzMi41LTIwdDM4LjUtNnEyMCAwIDM4LjUgNnQzMi41IDIwbDI3NiAyNTZxMTAgOSAxNi41IDIwdDYuNSAyNXY3OHEwIDE0LTYuNSAyNi41VDgyNi00NjdMNTUwLTIzMHEtMTYgMTItMzMgMjAuNXQtMzcgOC41cS0yMCAwLTM3LTguNVpNMzg0LTU3MXExNC0xNCAxNC0zNHQtMTQtMzRxLTE0LTE0LTM0LTE0dC0zNCAxNHEtMTQgMTQtMTQgMzR0MTQgMzRxMTQgMTQgMzQgMTR0MzQtMTRabTMxIDc1cTQ1IDIwIDkzIDEwLjV0ODQtNDIuNXEzMy0yOSA0My41LTcxdC02LjUtODNMNDE1LTQ5NlptOTktMjAxcTE0LTE0IDE0LTM0dC0xNC0zNHEtMTQtMTQtMzQtMTR0LTM0IDE0cS0xNCAxNC0xNCAzNHQxNCAzNHExNCAxNCAzNCAxNHQzNC0xNFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--open-in-new {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTE4MC0xMjBxLTI0IDAtNDItMTh0LTE4LTQydi02MDBxMC0yNCAxOC00MnQ0Mi0xOGgyNDlxMTIuNzUgMCAyMS4zOCA4LjY4IDguNjIgOC42NyA4LjYyIDIxLjUgMCAxMi44Mi04LjYyIDIxLjMyLTguNjMgOC41LTIxLjM4IDguNUgxODB2NjAwaDYwMHYtMjQ5cTAtMTIuNzUgOC42OC0yMS4zOCA4LjY3LTguNjIgMjEuNS04LjYyIDEyLjgyIDAgMjEuMzIgOC42MiA4LjUgOC42MyA4LjUgMjEuMzh2MjQ5cTAgMjQtMTggNDJ0LTQyIDE4SDE4MFptNjAwLTYxN0w0MDMtMzYwcS05IDktMjEgOC41dC0yMS05LjVxLTktOS05LTIxdDktMjFsMzc3LTM3N0g1NDlxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoMjYxcTEyLjc1IDAgMjEuMzggOC42MlE4NDAtODIyLjc1IDg0MC04MTB2MjYxcTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42My04LjUtOC42Mi04LjUtMjEuMzd2LTE4OFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--home {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIyMC0xODBoMTUwdi0yMjBxMC0xMi43NSA4LjYzLTIxLjM4UTM4Ny4yNS00MzAgNDAwLTQzMGgxNjBxMTIuNzUgMCAyMS4zOCA4LjYyUTU5MC00MTIuNzUgNTkwLTQwMHYyMjBoMTUwdi0zOTBMNDgwLTc2NSAyMjAtNTcwdjM5MFptLTYwIDB2LTM5MHEwLTE0LjI1IDYuMzgtMjcgNi4zNy0xMi43NSAxNy42Mi0yMWwyNjAtMTk1cTE1LjY4LTEyIDM1Ljg0LTEyUTUwMC04MjUgNTE2LTgxM2wyNjAgMTk1cTExLjI1IDguMjUgMTcuNjMgMjEgNi4zNyAxMi43NSA2LjM3IDI3djM5MHEwIDI0Ljc1LTE3LjYyIDQyLjM3UTc2NC43NS0xMjAgNzQwLTEyMEg1NjBxLTEyLjc1IDAtMjEuMzctOC42M1E1MzAtMTM3LjI1IDUzMC0xNTB2LTIyMEg0MzB2MjIwcTAgMTIuNzUtOC42MiAyMS4zN1E0MTIuNzUtMTIwIDQwMC0xMjBIMjIwcS0yNC43NSAwLTQyLjM3LTE3LjYzUTE2MC0xNTUuMjUgMTYwLTE4MFptMzIwLTI5M1oiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--school {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIyMC0yNjJxLTE0LTgtMjIuNS0yMS44OFExODktMjk3Ljc1IDE4OS0zMTV2LTIwNEw4OS01NzRxLTgtNS0xMi0xMS41My00LTYuNTItNC0xNC41IDAtNy45NyA0LTE0LjQ3IDQtNi41IDEyLTExLjVsMzYxLTE5OHE3LTQgMTQtNS41dDE1LTEuNXE4IDAgMTUgMS41dDE0IDUuNWwzOTYgMjE1cTggNSAxMiAxMS45NyA0IDYuOTYgNCAxNS4wM3YyNjlxMCAxMi43NS04LjY4IDIxLjM3LTguNjcgOC42My0yMS41IDguNjMtMTIuODIgMC0yMS4zMi04LjYzLTguNS04LjYyLTguNS0yMS4zN3YtMjUybC05MSA0NnYyMDRxMCAxNy4yNS04LjUgMzEuMTJRNzUyLTI3MCA3MzgtMjYyTDUwOC0xMzZxLTcgNC0xNCA1LjV0LTE1IDEuNXEtOCAwLTE1LTEuNXQtMTQtNS41TDIyMC0yNjJabTI1OS0xNjYgMzE1LTE3Mi0zMTUtMTY5LTMxMyAxNjkgMzEzIDE3MlptMCAyNDAgMjMwLTEyN3YtMTY4TDUwOC0zNzVxLTcgNC0xNCA1LjV0LTE1IDEuNXEtOCAwLTE0LjUtMS41VDQ1MS0zNzVMMjQ5LTQ4NXYxNzBsMjMwIDEyN1ptMS0yNDBabS0xIDkwWm0wIDBaIi8+PC9zdmc+");
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
	

		.kern-icon--check {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTM3OC0zMzIgMzYzLTM2M3E5LTkgMjEuNS05dDIxLjUgOXE5IDkgOSAyMS41dC05IDIxLjVMMzk5LTI2N3EtOSA5LTIxIDl0LTIxLTlMMTc1LTQ0OXEtOS05LTguNS0yMS41VDE3Ni00OTJxOS05IDIxLjUtOXQyMS41IDlsMTU5IDE2MFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--location-on {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC0xNTlxMTMzLTEyMSAxOTYuNS0yMTkuNVQ3NDAtNTUycTAtMTE4LTc1LjUtMTkzVDQ4MC04MjBxLTEwOSAwLTE4NC41IDc1VDIyMC01NTJxMCA3NSA2NSAxNzMuNVQ0ODAtMTU5Wm0tMjEuNSA1NS41UTQ0OC0xMDcgNDQwLTExNXEtNDItMzgtOTEtODcuNVQyNTgtMzA5cS00Mi01Ny03MC0xMTl0LTI4LTEyNHEwLTE1MCA5Ni41LTIzOVQ0ODAtODgwcTEyNyAwIDIyMy41IDg5VDgwMC01NTJxMCA2Mi0yOCAxMjR0LTcwIDExOXEtNDIgNTctOTEgMTA2LjVUNTIwLTExNXEtOCA4LTE4LjUgMTEuNVQ0ODAtMTAwcS0xMSAwLTIxLjUtMy41Wk00ODAtNTYwWm00OS41IDQ5LjVRNTUwLTUzMSA1NTAtNTYwdC0yMC41LTQ5LjVRNTA5LTYzMCA0ODAtNjMwdC00OS41IDIwLjVRNDEwLTU4OSA0MTAtNTYwdDIwLjUgNDkuNVE0NTEtNDkwIDQ4MC00OTB0NDkuNS0yMC41WiIvPjwvc3ZnPg==");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--palette {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC04MHEtODIgMC0xNTUtMzEuNXQtMTI3LjUtODZRMTQzLTI1MiAxMTEuNS0zMjVUODAtNDgwcTAtODUgMzItMTU4dDg3LjUtMTI3cTU1LjUtNTQgMTMwLTg0LjVUNDg5LTg4MHE3OSAwIDE1MCAyNi41VDc2My41LTc4MHE1My41IDQ3IDg1IDExMS41VDg4MC01MjdxMCAxMDgtNjMgMTcwLjVUNjUwLTI5NGgtNzVxLTE4IDAtMzEgMTR0LTEzIDMxcTAgMjcgMTQuNSA0NnQxNC41IDQ0cTAgMzgtMjEgNTguNVQ0ODAtODBabTAtNDAwWm0tMTk4IDExcTE1LTE1IDE1LTM1dC0xNS0zNXEtMTUtMTUtMzUtMTV0LTM1IDE1cS0xNSAxNS0xNSAzNXQxNSAzNXExNSAxNSAzNSAxNXQzNS0xNVptMTI2LTE3MHExNS0xNSAxNS0zNXQtMTUtMzVxLTE1LTE1LTM1LTE1dC0zNSAxNXEtMTUgMTUtMTUgMzV0MTUgMzVxMTUgMTUgMzUgMTV0MzUtMTVabTIxNCAwcTE1LTE1IDE1LTM1dC0xNS0zNXEtMTUtMTUtMzUtMTV0LTM1IDE1cS0xNSAxNS0xNSAzNXQxNSAzNXExNSAxNSAzNSAxNXQzNS0xNVptMTMxIDE3MHExNS0xNSAxNS0zNXQtMTUtMzVxLTE1LTE1LTM1LTE1dC0zNSAxNXEtMTUgMTUtMTUgMzV0MTUgMzVxMTUgMTUgMzUgMTV0MzUtMTVaTTQ4MC0xNDBxMTEgMCAxNS41LTQuNVQ1MDAtMTU5cTAtMTQtMTQuNS0yNlQ0NzEtMjM4cTAtNDYgMzAtODF0NzYtMzVoNzNxNzYgMCAxMjMtNDQuNVQ4MjAtNTI3cTAtMTMyLTEwMC0yMTIuNVQ0ODktODIwcS0xNDYgMC0yNDcuNSA5OC41VDE0MC00ODBxMCAxNDEgOTkuNSAyNDAuNVQ0ODAtMTQwWiIvPjwvc3ZnPg==");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--rocket-launch {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTI5Mi01MDZxMTgtMzYgMzguNS03MXQ0My41LTY3bC03OS0xNi0xMDkgMTA5IDEwNiA0NVptNTE1LTMxMnEtMTAyIDUtMTg0IDQzLjVUNDYzLTY1OHEtMzEgMzEtNjQgODF0LTU5IDEwN2wxMzMgMTMzcTU3LTI2IDEwNy01OXQ4MS02NHE3OC03OCAxMTYuNS0xNTkuNVQ4MjEtODAzcTAtMy0xLTZ0LTMtNXEtMi0yLTQuNS0zdC01LjUtMVpNNTUwLTYxNS41cTAtMjkuNSAyMC00OS41dDQ5LjUtMjBxMjkuNSAwIDQ5LjUgMjB0MjAgNDkuNXEwIDI5LjUtMjAgNDkuNXQtNDkuNSAyMHEtMjkuNSAwLTQ5LjUtMjB0LTIwLTQ5LjVaTTUwOS0yODhsNDUgMTA1IDEwOS0xMDktMTUtNzlxLTMyIDIzLTY3LjUgNDRUNTA5LTI4OFptMzczLTU1OXEzIDEyNS00MC41IDIzMC41VDcwNC00MTdxLTEgMS0yIDEuNXQtMiAxLjVsMjIgMTEwcTMgMTUtMSAyOXQtMTUgMjVMNTY1LTEwOXEtMTEgMTEtMjYuNSA4VDUxNy0xMTlsLTY4LTE1Ny0xNjktMTcwLTE1OC02N3EtMTUtNi0xNy41LTIydDguNS0yN2wxNDAtMTQwcTExLTExIDI1LTE1LjV0MjktMS41bDExMCAyMnExLTEgMi0xLjV0Mi0xLjVxOTQtOTQgMTk5LTEzNy41VDg1MC04NzhxNiAwIDExLjUgMi41VDg3Mi04NjhxNSA1IDcuNSAxMHQyLjUgMTFaTTE0OS0zMjVxMzUtMzUgODUuNS0zNS41VDMyMC0zMjZxMzUgMzUgMzQuNSA4NS41VDMxOS0xNTVxLTQ3IDQ3LTExMi41IDU2LjVUNzUtODBsMTgtMTMycTktNjYgNTYtMTEzWm00MiA0M3EtMjQgMjYtMzEgNjB0LTEzIDY5cTM1LTYgNjktMTN0NjAtMzFxMjAtMTcgMjAtNDIuNVQyNzgtMjg0cS0xOS0xOC00NC41LTE4VDE5MS0yODJaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--settings {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQyMS04MHEtMTQgMC0yNS05dC0xMy0yM2wtMTUtOTRxLTE5LTctNDAtMTl0LTM3LTI1bC04NiA0MHEtMTQgNi0yOCAxLjVUMTU1LTIyNkw5Ny0zMzBxLTgtMTMtNC41LTI3dDE1LjUtMjNsODAtNTlxLTItOS0yLjUtMjAuNVQxODUtNDgwcTAtOSAuNS0yMC41VDE4OC01MjFsLTgwLTU5cS0xMi05LTE1LjUtMjN0NC41LTI3bDU4LTEwNHE4LTEzIDIyLTE3LjV0MjggMS41bDg2IDQwcTE2LTEzIDM3LTI1dDQwLTE4bDE1LTk1cTItMTQgMTMtMjN0MjUtOWgxMThxMTQgMCAyNSA5dDEzIDIzbDE1IDk0cTE5IDcgNDAuNSAxOC41VDY2OS03MTBsODYtNDBxMTQtNiAyNy41LTEuNVQ4MDQtNzM0bDU5IDEwNHE4IDEzIDQuNSAyNy41VDg1Mi01ODBsLTgwIDU3cTIgMTAgMi41IDIxLjV0LjUgMjEuNXEwIDEwLS41IDIxdC0yLjUgMjFsODAgNThxMTIgOCAxNS41IDIyLjVUODYzLTMzMGwtNTggMTA0cS04IDEzLTIyIDE3LjV0LTI4LTEuNWwtODYtNDBxLTE2IDEzLTM2LjUgMjUuNVQ1OTItMjA2bC0xNSA5NHEtMiAxNC0xMyAyM3QtMjUgOUg0MjFabTE1LTYwaDg4bDE0LTExMnEzMy04IDYyLjUtMjV0NTMuNS00MWwxMDYgNDYgNDAtNzItOTQtNjlxNC0xNyA2LjUtMzMuNVQ3MTUtNDgwcTAtMTctMi0zMy41dC03LTMzLjVsOTQtNjktNDAtNzItMTA2IDQ2cS0yMy0yNi01Mi00My41VDUzOC03MDhsLTE0LTExMmgtODhsLTE0IDExMnEtMzQgNy02My41IDI0VDMwNi02NDJsLTEwNi00Ni00MCA3MiA5NCA2OXEtNCAxNy02LjUgMzMuNVQyNDUtNDgwcTAgMTcgMi41IDMzLjVUMjU0LTQxM2wtOTQgNjkgNDAgNzIgMTA2LTQ2cTI0IDI0IDUzLjUgNDF0NjIuNSAyNWwxNCAxMTJabTQ0LTIxMHE1NCAwIDkyLTM4dDM4LTkycTAtNTQtMzgtOTJ0LTkyLTM4cS01NCAwLTkyIDM4dC0zOCA5MnEwIDU0IDM4IDkydDkyIDM4Wm0wLTEzMFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--build {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTM1NC0zNzBxLTk3LjA4IDAtMTY1LjA0LTY3LjY3UTEyMS01MDUuMzMgMTIxLTYwMnEwLTIwIDMtMzcuNXQxMS0zNi41cTMtOCA5LTEydDEyLjgxLTZxNi44MS0yIDE0IDB0MTMuMTkgOGwxMTMgMTEzIDkyLTg2LTExOC0xMThxLTYuMTUtNS45My04LjA4LTEyLjk2UTI2MS03OTcgMjYzLTgwNHEyLTcgNi0xMi4yNXQxMi04Ljc1cTE5LTggMzYtMTEuNXQzNi44NS0zLjVxOTkuMjMgMCAxNjguNjkgNjkuNDJRNTkyLTcwMS4xNyA1OTItNjAycTAgMjQtNSA0N3QtMTMgNDZsMjIxIDIyMXEyNyAyNiAyNi41IDYzLjVUNzkzLTE2MXEtMjYgMjQtNjEuNSAyMy41VDY3MC0xNjRMNDQ3LTM4OHEtMjMgOC00NiAxM3QtNDcgNVptMC02MHEyNSAwIDUzLTh0NDktMjRsMjU3IDI1N3E4IDggMjAgOHQyMC04cTgtOCA4LTIwdC04LTIwTDUwMC00OThxMTYtMjEgMjQtNDkuNXQ4LTU0LjVxMC03NS01NS41LTEyN1QzNTAtNzgybDEwMiAxMDRxOSA5IDguNSAyMS41VDQ1MS02MzVMMzE4LTUxMHEtOS4yNyA4LTIxLjY0IDgtMTIuMzYgMC0yMC4zNi04bC05OC05N3EzIDc3IDU0LjY3IDEyN1QzNTQtNDMwWm0xMTctNThaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--orbit {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTIzMy0xMDBxLTU1LjEgMC05NC4wNS0zOC45My0zOC45NS0zOC45My0zOC45NS05NFQxMzguOTMtMzI3cTM4LjkzLTM5IDk0LTM5VDMyNy0zMjcuMDVxMzkgMzguOTUgMzkgOTQuMDUgMCAyMi03IDQyLjVUMzM5LTE1M3YtMTdxMzMgMTUgNjkgMjIuNXQ3MiA3LjVxMTMzLjU5IDAgMjMwLjc5LTg5UTgwOC0zMTggODE5LTQ0OXEyLTEzIDEwLTIydDIwLjgyLTlxMTIuODMgMCAyMS41IDkgOC42OCA5IDcuNjggMjItMTIgMTU1LTEyNiAyNjJUNDc5LjktODBxLTQ1LjkgMC05MC40LTEwLjVRMzQ1LTEwMSAzMDMtMTIxcS0xNiAxMC41LTMzLjUgMTUuNzVUMjMzLTEwMFptNTEuNS04MS41UTMwNi0yMDMgMzA2LTIzM3QtMjEuNS01MS41UTI2My0zMDYgMjMzLTMwNnQtNTEuNSAyMS41UTE2MC0yNjMgMTYwLTIzM3QyMS41IDUxLjVRMjAzLTE2MCAyMzMtMTYwdDUxLjUtMjEuNVpNNDgwLjA3LTM0N1E0MjUtMzQ3IDM4Ni0zODUuOTNxLTM5LTM4LjkzLTM5LTk0VDM4NS45My01NzRxMzguOTMtMzkgOTQtMzlUNTc0LTU3NC4wN3EzOSAzOC45MyAzOSA5NFQ1NzQuMDctMzg2cS0zOC45MyAzOS05NCAzOVpNNDgwLTgyMHEtMTMzLjU5IDAtMjMwLjc5IDg5UTE1Mi02NDIgMTQxLTUxMXEtMiAxMy0xMCAyMnQtMjAuODIgOXEtMTIuODMgMC0yMS41LTlRODAtNDk4IDgxLTUxMXExMi0xNTUgMTI2LTI2MnQyNzMuMS0xMDdxNDUuOSAwIDkwLjQgMTAuNVE2MTUtODU5IDY1Ny04MzlxMTYtMTAgMzMuNS0xNXQzNi41LTVxNTQuNjkgMCA5My4zNCAzOC43MlE4NTktNzgxLjU2IDg1OS03MjYuNzhUODIwLjI4LTYzM3EtMzguNzIgMzktOTMuNSAzOVQ2MzMtNjMyLjk1UTU5NC02NzEuOSA1OTQtNzI3cTAtMjIgNy00Mi41dDIwLTM3LjV2MTdxLTMzLTE1LTY5LTIyLjV0LTcyLTcuNVptMjQ3IDE2NnEzMCAwIDUxLTIxLjV0MjEtNTEuNXEwLTMwLTIxLTUxdC01MS0yMXEtMzAgMC01MS41IDIxVDY1NC03MjdxMCAzMCAyMS4yOSA1MS41VDcyNy02NTRaTTIzMy0yMzNabTQ5NC00OTRaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--extension {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTM1Ni0xMjBIMTgwcS0yNCAwLTQyLTE4dC0xOC00MnYtMTc2cTQ0LTUgNzUuNS0zNC41VDIyNy00NjNxMC00My0zMS41LTcyLjVUMTIwLTU3MHYtMTc2cTAtMjQgMTgtNDJ0NDItMThoMTc3cTExLTQwIDM5LjUtNjd0NjguNS0yN3E0MCAwIDY4LjUgMjd0MzkuNSA2N2gxNzNxMjQgMCA0MiAxOHQxOCA0MnYxNzNxNDAgMTEgNjUuNSA0MS41VDg5Ny00NjFxMCA0MC0yNS41IDY3VDgwNi0zNTZ2MTc2cTAgMjQtMTggNDJ0LTQyIDE4SDU3MHEtNS00OC0zNS41LTc3LjVUNDYzLTIyN3EtNDEgMC03MS41IDI5LjVUMzU2LTEyMFptLTE3Ni02MGgxMzBxMjUtNjEgNjkuODktODR0ODMtMjNRNTAxLTI4NyA1NDYtMjY0dDcwIDg0aDEzMHYtMjM1aDQ1cTIwIDAgMzMtMTN0MTMtMzNxMC0yMC0xMy0zM3QtMzMtMTNoLTQ1di0yMzlINTExdi00OHEwLTIwLTEzLTMzdC0zMy0xM3EtMjAgMC0zMyAxM3QtMTMgMzN2NDhIMTgwdjEzMHE0OC4xNSAxNy44MiA3Ny41OCA1OS42OVEyODctNTE0LjQ1IDI4Ny00NjIuNzggMjg3LTQxMiAyNTcuNS0zNzBUMTgwLTMxMHYxMzBabTI4NS0yODFaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--looks {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ4MC02NjBxLTE1MCAwLTI1OC41IDEwMVQxMDEtMzExcS0xIDEzLTkuNSAyMlQ3MC0yODBxLTEyIDAtMjEtOC41VDQxLTMwOXE2LTg2IDQyLjUtMTYxVDE3OS02MDAuNVEyMzgtNjU2IDMxNS41LTY4OFQ0ODAtNzIwcTg3IDAgMTY0LjUgMzJUNzgxLTYwMC41UTg0MC01NDUgODc2LjUtNDcwVDkxOS0zMDlxMSAxMi04IDIwLjV0LTIxIDguNXEtMTMgMC0yMS41LTl0LTkuNS0yMnEtMTItMTQ3LTEyMC0yNDhUNDgwLTY2MFptMCAxMjBxLTEwMiAwLTE3NS41IDY3VDIyMS0zMDZxLTEgMTEtMTAgMTguNXQtMjEgNy41cS0xMyAwLTIxLjUtOS41VDE2Mi0zMTJxMTItMTIzIDEwMi0yMDUuNVQ0ODAtNjAwcTEyNiAwIDIxNiA4Mi41VDc5OC0zMTJxMiAxMy02LjUgMjIuNVQ3NzAtMjgwcS0xMiAwLTIxLTcuNVQ3MzktMzA2cS0xMC0xMDAtODMuNS0xNjdUNDgwLTU0MFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--museum {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTgwLTgwdi02MGg4M3YtNDExaC01NHEtMTIuMzUgMC0yMC42OC05UTgwLTU2OSA4MC01ODFxMC04LjMxIDMuNjctMTUuMjNRODcuMzMtNjAzLjE1IDk0LTYwOGwzNTEtMjQ4cTgtNSAxNi44MS04IDguODEtMyAxOC0zdDE4LjE5IDNxOSAzIDE3IDhsMzUxIDI0OHE2LjY3IDQuOSAxMC4zMyAxMi4yNVE4ODAtNTg4LjQgODgwLTU4MHEwIDEyLjM1LTguMzIgMjAuNjhRODYzLjM1LTU1MSA4NTEtNTUxaC01M3Y0MTFoODJ2NjBIODBabTY1OC02MHYtNDg1TDQ4MC04MDYgMjIzLTYyNXY0ODVoNTE1Wk00OTQtMzA3cTYtMyAxMS0xMGw3Mi0xMDh2MTU0cTAgMTIuNzUgOC42OCAyMS4zNyA4LjY3IDguNjMgMjEuNSA4LjYzIDEyLjgyIDAgMjEuMzItOC42MyA4LjUtOC42MiA4LjUtMjEuMzd2LTIxN3EwLTExLjQ1LTcuNzctMTkuMjNRNjIxLjQ1LTUxNSA2MTAtNTE1aC0yMy40cS02LjQ2IDAtMTIuNTEgMy4yVDU2NC01MDNsLTg0IDEyOC04My0xMjZxLTUtNy0xMS43NS0xMC41VDM3MS01MTVoLTE1LjE0cS0xMy41NCAwLTIyLjcgOS4yVDMyNC00ODN2MjEycTAgMTIuNzUgOC42OCAyMS4zNyA4LjY3IDguNjMgMjEuNSA4LjYzIDEyLjgyIDAgMjEuMzItOC42MyA4LjUtOC42MiA4LjUtMjEuMzd2LTE1NGw3MSAxMDdxNSA3IDExIDEwLjV0MTQgMy41cTggMCAxNC0zWm0yNDQgMTY3SDIyM2g1MTVaIi8+PC9zdmc+");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--alt-route {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQ1MC0xMTB2LTE3MHEwLTQ4LTE2LTc5dC00OS02NGw0My00M3ExMyAxMSAyNy41IDMwdDI0LjUgMzVxMTctMjYgMzMuNS00NXQzMS41LTMycTU4LTQ3IDgzLjUtMTEzLjVUNjQ4LTc2NmwtNjkgNjlxLTkgOS0yMSA5dC0yMS05cS05LTktOS0yMXQ5LTIxbDEyMC0xMjBxNS01IDEwLTd0MTEtMnE2IDAgMTEgMnQxMCA3bDEyMCAxMjBxOSA5IDkgMjF0LTkgMjFxLTkgOS0yMSA5dC0yMS05bC02OS02OXE1IDEyNi0yNC41IDE5OC41VDU4NS00MzJxLTQ0IDQwLTU5LjUgNzNUNTEwLTI4MHYxNzBxMCAxMy04LjUgMjEuNVQ0ODAtODBxLTEzIDAtMjEuNS04LjVUNDUwLTExMFpNMjU4LTYzNnEtNC0xOC02LjUtNTIuNVQyNTEtNzY1bC02OCA2OHEtOSA5LTIxIDl0LTIxLTlxLTktOS05LTIxdDktMjFsMTIwLTEyMHE1LTUgMTAtN3QxMS0ycTYgMCAxMSAydDEwIDdsMTIwIDEyMHE5IDkgOSAyMXQtOSAyMXEtOSA5LTIxIDl0LTIxLTlsLTY5LTY5cS0yIDM4LTEgNjYuNXQ1IDQ5LjVsLTU4IDE0Wm04NCAxNzFxLTE3LTE4LTM3LjUtNDcuNVQyNzMtNTc3bDU5LTE1cTkgMjUgMjQgNDh0MjggMzdsLTQyIDQyWiIvPjwvc3ZnPg==");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--map {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0ibTU5Mi0xMjctMjQzLTg2LTE4OCA3NXEtOCAzLTE1IDEuNXQtMTMtNS41cS02LTQtOS41LTEwdC0zLjUtMTR2LTU2NXEwLTEzIDcuNS0yM3QxOS41LTE1bDE4Mi02NHE1LTIgMTAtMi41dDEwLS41cTUgMCAxMCAuNXQxMCAyLjVsMjQzIDg1IDE4Ny03NXE4LTMgMTUtMnQxMyA1cTYgNCA5LjUgMTAuNVQ4NDAtNzk1djU3MnEwIDExLTcuNSAxOVQ4MTQtMTkybC0xODIgNjVxLTUgMi0xMCAyLjV0LTEwIC41cS01IDAtMTAtLjV0LTEwLTIuNVptLTE0LTY4di01MDVsLTE5Ni02NnY1MDVsMTk2IDY2Wm02MCAwIDE0Mi00N3YtNTEybC0xNDIgNTR2NTA1Wm0tNDU4LTEyIDE0Mi01NHYtNTA1bC0xNDIgNDd2NTEyWm00NTgtNDkzdjUwNS01MDVabS0zMTYtNjZ2NTA1LTUwNVoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	

		.kern-icon--accessibility {
			mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIiIGhlaWdodD0iIiB2aWV3Qm94PSIwIC05NjAgOTYwIDk2MCI+PHBhdGggZD0iTTQyOC41LTc1NS40MnEtMjEuNS0yMS40Mi0yMS41LTUxLjV0MjEuNDItNTEuNThxMjEuNDItMjEuNSA1MS41LTIxLjV0NTEuNTggMjEuNDJxMjEuNSAyMS40MiAyMS41IDUxLjV0LTIxLjQyIDUxLjU4cS0yMS40MiAyMS41LTUxLjUgMjEuNXQtNTEuNTgtMjEuNDJaTTM3Mi0xMTB2LTUwM0gxNTBxLTEyLjc1IDAtMjEuMzctOC42OC04LjYzLTguNjctOC42My0yMS41IDAtMTIuODIgOC42My0yMS4zMiA4LjYyLTguNSAyMS4zNy04LjVoNjYwcTEyLjc1IDAgMjEuMzggOC42OCA4LjYyIDguNjcgOC42MiAyMS41IDAgMTIuODItOC42MiAyMS4zMi04LjYzIDguNS0yMS4zOCA4LjVINTg4djUwM3EwIDEyLjc1LTguNjggMjEuMzctOC42NyA4LjYzLTIxLjUgOC42My0xMi44MiAwLTIxLjMyLTguNjNRNTI4LTk3LjI1IDUyOC0xMTB2LTIzMGgtOTZ2MjMwcTAgMTIuNzUtOC42OCAyMS4zNy04LjY3IDguNjMtMjEuNSA4LjYzLTEyLjgyIDAtMjEuMzItOC42M1EzNzItOTcuMjUgMzcyLTExMFoiLz48L3N2Zz4=");
			background-color: var(--kern-color-layout-text-default, #171a2b);
		}
	
}`);const UM=(M,t)=>{const T=M.__vccOpts||M;for(const[N,I]of t)T[N]=I;return T};export{UM as _,OM as a,wM as b,sM as c,SM as s,rM as v,lM as w};
