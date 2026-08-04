const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./crs-Dzf2F7GM-DyEaBdL8.js","./crs-sjmcHbK1-BOWV4PBt.js","./proj-CKF553FA-DdigQzmj.js","./math-BpivNITZ-CEdSfXPT.js","./defaults-DZtjWIE4-B9Z7Bm7I.js","./defaults-DQauJHIq-CvsGHwXN.js"])))=>i.map(i=>d[i]);
import{t as e}from"./proj-CKF553FA-DdigQzmj.js";var t=`modulepreload`,n=function(e,t){return new URL(e,t).href},r={},i=function(e,i,a){let o=Promise.resolve();if(i&&i.length>0){let e=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function u(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}o=l(i.map(i=>{if(i=n(i,a),i=u(i),i in r)return;r[i]=!0;let o=i.endsWith(`.css`);for(let t=e.length-1;t>=0;t--){let n=e[t];if(n.href===i&&(!o||n.rel===`stylesheet`))return}let s=document.createElement(`link`);if(s.rel=o?`stylesheet`:t,o||(s.as=`script`),s.crossOrigin=``,s.href=i,c&&s.setAttribute(`nonce`,c),document.head.appendChild(s),o)return new Promise((e,t)=>{s.addEventListener(`load`,e),s.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${i}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(t=>{for(let e of t||[])e.status===`rejected`&&s(e.reason);return e().catch(s)})},a=([e,t])=>`<wps:Execute
	xmlns:wps='http://www.opengis.net/wps/1.0.0'
	xmlns:xlink='http://www.w3.org/1999/xlink'
	xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'
	xmlns:ows='http://www.opengis.net/ows/1.1'
	service='WPS'
	version='1.0.0'
	xsi:schemaLocation='http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd'
>
	<ows:Identifier>ReverseGeocoder.fmw</ows:Identifier>
	<wps:DataInputs>
		<wps:Input>
			<ows:Identifier>X</ows:Identifier>
			<wps:Data>
				<wps:LiteralData dataType='float'>${e}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>Y</ows:Identifier>
			<wps:Data>
				<wps:LiteralData dataType='float'>${t}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
	</wps:DataInputs>
</wps:Execute>`;function o(e,t){return e.getElementsByTagNameNS(`*`,t)[0]?.textContent??``}async function s({url:t,coordinate:n,epsg:r,serviceEpsg:i,signal:s}){let c=await fetch(t,{method:`POST`,body:a(e(n,r,i)),signal:s}),l=new DOMParser().parseFromString(await c.text(),`text/xml`),u=l.querySelector(`parsererror`);if(u)throw Error(`Failed to parse XML response: ${u.textContent}.`);let d=l.getElementsByTagNameNS(`*`,`Adresse`)[0];if(!d)throw Error(`Response does not contain an "Adresse" element.`);let f={Distanz:parseFloat(o(d,`Distanz`)),Hausnr:parseInt(o(d,`Hausnr`),10),Plz:parseInt(o(d,`Plz`),10),Strasse:o(d,`Strasse`),XKoordinate:parseFloat(o(d,`XKoordinate`)),YKoordinate:parseFloat(o(d,`YKoordinate`)),Zusatz:o(d,`Zusatz`)};return{type:`reverse_geocoded`,title:`${f.Strasse} ${f.Hausnr}${f.Zusatz}`,properties:f,geometry:{coordinates:n,type:`Point`},addressGeometry:{coordinates:[f.XKoordinate,f.YKoordinate],type:`Point`}}}if(import.meta.vitest){let{beforeEach:e,expect:t,test:n,vi:r}=import.meta.vitest,{default:{registerProjections:o}}=await i(async()=>{let{default:{registerProjections:e}}=await import(`./crs-Dzf2F7GM-DyEaBdL8.js`);return{default:{registerProjections:e}}},__vite__mapDeps([0,1,2,3]),import.meta.url),{default:{namedProjections:c}}=await i(async()=>{let{default:{namedProjections:e}}=await import(`./defaults-DZtjWIE4-B9Z7Bm7I.js`);return{default:{namedProjections:e}}},__vite__mapDeps([4,5]),import.meta.url);e(()=>{r.restoreAllMocks(),o(c)});let l=`https://wps.example`,u=[565192.2974622496,5933428.820743558],d=`<?xml version='1.0' encoding='UTF-8'?>
<wps:ExecuteResponse xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WPS" version="1.0.0" xml:lang="en" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsExecute_response.xsd" serviceInstance="https://geodienste.hamburg.de/HH_WPS?service=WPS&amp;request=GetCapabilities&amp;version=1.0.0">
	<wps:Process wps:processVersion="0.0.1">
		<ows:Identifier>ReverseGeocoder.fmw</ows:Identifier>
		<ows:Title>ReverseGeocoder</ows:Title>
		<ows:Abstract>&lt;p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">prio: normal&lt;/p> &lt;p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">kritisch: nein&lt;/p> &lt;p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">Ansprechpartner: webdienste@gv.hamburg.de&lt;/p> &lt;p style="-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;"> &lt;br/> &lt;/p> &lt;p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">Beschreibung: startet mit einem Punkt und findet dazu die nächst gelegene Adresse und ermittelt die Zuständigkeit&lt;/p> &lt;p style=" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;">das Ergebnis wird zurückgegeben&lt;/p> </ows:Abstract>
	</wps:Process>
	<wps:Status creationTime="2023-10-13T07:54:26.579Z">
		<wps:ProcessSucceeded>Process execution finished@2023-10-13T07:54:26.579Z</wps:ProcessSucceeded>
	</wps:Status>
	<wps:ProcessOutputs>
		<wps:Output>
			<ows:Identifier>FMEResponse</ows:Identifier>
			<ows:Title>Response from FME (Job Submitter Service)</ows:Title>
			<wps:Data>
				<wps:ComplexData mimeType="application/xml">
					<wps:ReverseGeocoder xmlns:wps="http://www.safe.com/xml/xmltables" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.safe.com/xml/xmltables output.xsd">
						<wps:Anfrage>
							<wps:XKoordinate>${u[0]}</wps:XKoordinate>
							<wps:YKoordinate>${u[1]}</wps:YKoordinate>
							<wps:Epsg>25832</wps:Epsg>
						</wps:Anfrage>
						<wps:Ergebnis>
							<wps:Adresse>
								<wps:Strasse>Herrlichkeit</wps:Strasse>
								<wps:Hausnr>1</wps:Hausnr>
								<wps:Zusatz/>
								<wps:Plz>20459</wps:Plz>
								<wps:Distanz>16.20141565450446</wps:Distanz>
								<wps:XKoordinate>565200.347</wps:XKoordinate>
								<wps:YKoordinate>5933442.881</wps:YKoordinate>
							</wps:Adresse>
						</wps:Ergebnis>
					</wps:ReverseGeocoder>
				</wps:ComplexData>
			</wps:Data>
		</wps:Output>
	</wps:ProcessOutputs>
</wps:ExecuteResponse>`;n(`reverseGeocode throws on invalid XML`,async()=>{r.spyOn(global,`fetch`).mockResolvedValueOnce({text:()=>Promise.resolve(`<invalid><xml`)});let e=new AbortController;await t(s({url:l,coordinate:u,epsg:`EPSG:25832`,serviceEpsg:`EPSG:25832`,signal:e.signal})).rejects.toThrow(`Failed to parse XML response`)}),n(`reverseGeocode throws when Adresse element is missing`,async()=>{r.spyOn(global,`fetch`).mockResolvedValueOnce({text:()=>Promise.resolve(`<?xml version="1.0"?><root><empty/></root>`)});let e=new AbortController;await t(s({url:l,coordinate:u,epsg:`EPSG:25832`,serviceEpsg:`EPSG:25832`,signal:e.signal})).rejects.toThrow(`Response does not contain an "Adresse" element.`)}),n(`reverseGeocode works with Hamburg-WPS-style`,async()=>{let e=r.spyOn(global,`fetch`).mockResolvedValueOnce({text:()=>Promise.resolve(d)}),n=new AbortController,i=await s({url:l,coordinate:u,epsg:`EPSG:25832`,serviceEpsg:`EPSG:25832`,signal:n.signal});t(e).toHaveBeenCalledOnce(),t(e).toHaveBeenCalledWith(l,{method:`POST`,body:a(u),signal:n.signal}),t(i).toEqual({type:`reverse_geocoded`,title:`Herrlichkeit 1`,addressGeometry:{coordinates:[565200.347,5933442.881],type:`Point`},geometry:{coordinates:u,type:`Point`},properties:{Distanz:16.20141565450446,Hausnr:1,Plz:20459,Strasse:`Herrlichkeit`,XKoordinate:565200.347,YKoordinate:5933442.881,Zusatz:``}})})}export{i as n,s as t};