var e=([e,t])=>`<wps:Execute
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
</wps:Execute>`;function t(e,t){return e.getElementsByTagNameNS(`*`,t)[0]?.textContent??``}async function n(n,r,i){let a=await fetch(n,{method:`POST`,body:e(r),signal:i}),o=new DOMParser().parseFromString(await a.text(),`text/xml`),s=o.querySelector(`parsererror`);if(s)throw Error(`Failed to parse XML response: ${s.textContent}.`);let c=o.getElementsByTagNameNS(`*`,`Adresse`)[0];if(!c)throw Error(`Response does not contain an "Adresse" element.`);let l={Distanz:parseFloat(t(c,`Distanz`)),Hausnr:parseInt(t(c,`Hausnr`),10),Plz:parseInt(t(c,`Plz`),10),Strasse:t(c,`Strasse`),XKoordinate:parseFloat(t(c,`XKoordinate`)),YKoordinate:parseFloat(t(c,`YKoordinate`)),Zusatz:t(c,`Zusatz`)};return{type:`reverse_geocoded`,title:`${l.Strasse} ${l.Hausnr}${l.Zusatz}`,properties:l,geometry:{coordinates:r,type:`Point`},addressGeometry:{coordinates:[l.XKoordinate,l.YKoordinate],type:`Point`}}}if(import.meta.vitest){let{beforeEach:t,expect:r,test:i,vi:a}=import.meta.vitest;t(()=>{a.restoreAllMocks()});let o=`https://wps.example`,s=[565192.2974622496,5933428.820743558],c=`<?xml version='1.0' encoding='UTF-8'?>
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
							<wps:XKoordinate>${s[0]}</wps:XKoordinate>
							<wps:YKoordinate>${s[1]}</wps:YKoordinate>
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
</wps:ExecuteResponse>`;i(`reverseGeocode throws on invalid XML`,async()=>{a.spyOn(global,`fetch`).mockResolvedValueOnce({text:()=>Promise.resolve(`<invalid><xml`)}),await r(n(o,s,new AbortController().signal)).rejects.toThrow(`Failed to parse XML response`)}),i(`reverseGeocode throws when Adresse element is missing`,async()=>{a.spyOn(global,`fetch`).mockResolvedValueOnce({text:()=>Promise.resolve(`<?xml version="1.0"?><root><empty/></root>`)}),await r(n(o,s,new AbortController().signal)).rejects.toThrow(`Response does not contain an "Adresse" element.`)}),i(`reverseGeocode works with Hamburg-WPS-style`,async()=>{let t=a.spyOn(global,`fetch`).mockResolvedValueOnce({text:()=>Promise.resolve(c)}),i=new AbortController,l=await n(o,s,i.signal);r(t).toHaveBeenCalledOnce(),r(t).toHaveBeenCalledWith(o,{method:`POST`,body:e(s),signal:i.signal}),r(l).toEqual({type:`reverse_geocoded`,title:`Herrlichkeit 1`,addressGeometry:{coordinates:[565200.347,5933442.881],type:`Point`},geometry:{coordinates:s,type:`Point`},properties:{Distanz:16.20141565450446,Hausnr:1,Plz:20459,Strasse:`Herrlichkeit`,XKoordinate:565200.347,YKoordinate:5933442.881,Zusatz:``}})})}export{n as t};