import{j as a}from"./store-CEL07PE3.js";import"./pinia-CbxOPHy1-Ds7GYo7H.js";import"./vue.runtime.esm-bundler-x5GycwNE-C2i-EXPZ.js";import"./index-DbfXkN7X-DXi4MmEH.js";const w=([s,p])=>`<wps:Execute
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
				<wps:LiteralData dataType='float'>${s}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
		<wps:Input>
			<ows:Identifier>Y</ows:Identifier>
			<wps:Data>
				<wps:LiteralData dataType='float'>${p}</wps:LiteralData>
			</wps:Data>
		</wps:Input>
	</wps:DataInputs>
</wps:Execute>`,l=new a.Parser({tagNameProcessors:[a.processors.stripPrefix]});async function m(s,p){const r=await fetch(s,{method:"POST",body:w(p)}),o=await l.parseStringPromise(await r.text()),e=Object.fromEntries(Object.entries(o.ExecuteResponse.ProcessOutputs[0].Output[0].Data[0].ComplexData[0].ReverseGeocoder[0].Ergebnis[0].Adresse[0]).map(([n,i])=>[n,i[0]])),t={Distanz:parseFloat(e.Distanz),Hausnr:parseInt(e.Hausnr,10),Plz:parseInt(e.Plz,10),Strasse:e.Strasse,XKoordinate:parseFloat(e.XKoordinate),YKoordinate:parseFloat(e.YKoordinate),Zusatz:e.Zusatz};return{type:"reverse_geocoded",title:`${t.Strasse} ${t.Hausnr}${t.Zusatz}`,properties:t,geometry:{coordinates:p,type:"Point"},addressGeometry:{coordinates:[t.XKoordinate,t.YKoordinate],type:"Point"}}}if(import.meta.vitest){const{expect:s,test:p,vi:r}=import.meta.vitest,o="https://wps.example",e=[565192.2974622496,5933428820743558e-9],t=`<?xml version='1.0' encoding='UTF-8'?>
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
							<wps:XKoordinate>${e[0]}</wps:XKoordinate>
							<wps:YKoordinate>${e[1]}</wps:YKoordinate>
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
</wps:ExecuteResponse>`;p("reverseGeocode works with Hamburg-WPS-style",async()=>{const n=r.spyOn(global,"fetch").mockResolvedValueOnce({text:()=>Promise.resolve(t)}),i=await m(o,e);s(n).toHaveBeenCalledOnce(),s(n).toHaveBeenCalledWith(o,{method:"POST",body:w(e)}),s(i).toEqual({type:"reverse_geocoded",title:"Herrlichkeit 1",addressGeometry:{coordinates:[565200.347,5933442881e-3],type:"Point"},geometry:{coordinates:e,type:"Point"},properties:{Distanz:16.20141565450446,Hausnr:1,Plz:20459,Strasse:"Herrlichkeit",XKoordinate:565200.347,YKoordinate:5933442881e-3,Zusatz:""}})})}export{m as reverseGeocode};
