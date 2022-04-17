var D=Object.defineProperty,I=Object.defineProperties;var T=Object.getOwnPropertyDescriptors;var N=Object.getOwnPropertySymbols;var W=Object.prototype.hasOwnProperty,j=Object.prototype.propertyIsEnumerable;var F=(r,t,o)=>t in r?D(r,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):r[t]=o,u=(r,t)=>{for(var o in t||(t={}))W.call(t,o)&&F(r,o,t[o]);if(N)for(var o of N(t))j.call(t,o)&&F(r,o,t[o]);return r},f=(r,t)=>I(r,T(t));import{j as e,B as c,a as i,H as h,L as k,I as O,u as m,b as p,c as L,d as M,M as P,S as V,e as _,r as g,F as x,f as $,g as H,h as b,i as w,k as S,l as y,m as v,n as J,V as C,o as Y,p as q,R as E,q as G,C as K,s as Q,t as U,v as z}from"./vendor.5c9c36f1.js";const Z=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerpolicy&&(a.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?a.credentials="include":n.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}};Z();var X="/assets/shoutwest.91930497.png",ee="/assets/shoutwest_white.bf70070c.png";const B=()=>e(c,{maxW:"1000px",m:"auto",children:i(h,{h:"100px",justify:"space-between",align:"center",children:[e(k,{to:"/",children:e(c,{boxSize:"md",w:"225px",h:"41px",children:e(O,{src:m(X,ee),alt:"Dan Abramov"})})}),e(k,{to:"/about",children:e(p,{fontSize:"18px",color:m("#304BB3","white"),children:"About"})})]})}),R=()=>{const{colorMode:r,toggleColorMode:t}=L();return i(h,{position:"fixed",bottom:"0px",left:"0px",width:"100vw",height:"50px",bg:"#304BB3",justify:"space-between",px:"40px",opacity:"0.6",children:[e(p,{fontSize:"16px",color:"white",children:"Garrett Roell 2022"}),e(M,{onClick:t,variant:"outline",children:r==="light"?e(P,{w:4,h:4,p:"0",color:"white"}):e(V,{w:4,h:4,px:"0"})})]})};function te(){return"https://sw-server.garrettroell.com"}const re=({setFlightInfo:r,setDisplayMode:t})=>{const o=_(),l=g.exports.useRef();g.exports.useState(!1);function n(a){let s;return a||(s="This field is required"),s}return i(x,{children:[e(p,{mt:"75px",textAlign:"center",fontSize:"16px",children:"Add your Southwest trip details, and we'll automatically check you to your flights"}),e(h,{maxW:"350px",m:"auto",h:"15px",bg:"#C3322C",transform:"translateY(35px)",borderTopRadius:"15px",children:e(c,{h:"100%",w:"50%",bg:"#F5C14D",borderTopLeftRadius:"15px"})}),e(c,{maxW:"350px",m:"auto",mt:"20px",p:"20px",mb:"50px",borderWidth:"1px",borderRadius:"15px",children:e($,{initialValues:{firstName:"",lastName:"",confirmationNumber:""},onSubmit:(a,s)=>{l.current=o({title:"Getting data from Southwest",status:"info",isClosable:!0}),fetch(`${te()}/set-up`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u({},a))}).then(d=>{d.json().then(A=>{r(f(u({},a),{flights:A})),s.setSubmitting(!1),t("info"),l.current&&o.close(l.current)})}).catch(d=>{console.log(d),s.setSubmitting(!1),l.current&&o.close(l.current),l.current=o({title:d,status:"info",isClosable:!0})})},children:a=>i(H,{children:[e(b,{h:"15px"}),e(w,{name:"firstName",validate:n,children:({field:s,form:d})=>i(S,{isInvalid:d.errors.firstName&&d.touched.firstName,children:[e(y,{htmlFor:"firstName",fontSize:"sm",mb:"0px",children:"First Name"}),e(v,f(u({},s),{id:"firstName",placeholder:"",px:"10px",h:"35px",minW:"100%",fontSize:"14px",_autofill:{textFillColor:m("rgb(26, 32, 44)","white"),boxShadow:"0 0 0px 1000px #00000000 inset",transition:"background-color 5000s ease-in-out 0s"}}))]})}),e(b,{h:"15px"}),e(w,{name:"lastName",validate:n,children:({field:s,form:d})=>i(S,{isInvalid:d.errors.lastName&&d.touched.lastName,children:[e(y,{htmlFor:"lastName",fontSize:"sm",mb:"0px",children:"Last Name"}),e(v,f(u({},s),{id:"lastName",placeholder:"",px:"10px",h:"35px",minW:"100%",fontSize:"14px",_autofill:{textFillColor:m("rgb(26, 32, 44)","white"),boxShadow:"0 0 0px 1000px #00000000 inset",transition:"background-color 5000s ease-in-out 0s"}}))]})}),e(b,{h:"15px"}),e(w,{name:"confirmationNumber",validate:n,children:({field:s,form:d})=>i(S,{isInvalid:d.errors.confirmationNumber&&d.touched.confirmationNumber,children:[e(y,{htmlFor:"confirmationNumber",fontSize:"sm",mb:"0px",children:"Confirmation Number"}),e(v,f(u({},s),{id:"confirmationNumber",placeholder:"",px:"10px",h:"35px",minW:"100%",fontSize:"14px",_autofill:{textFillColor:m("rgb(26, 32, 44)","white"),boxShadow:"0 0 0px 1000px #00000000 inset",transition:"background-color 5000s ease-in-out 0s"}}))]})}),e(b,{h:"30px"}),e(M,{type:"submit",bg:"#304BB3",color:"white",isLoading:a.isSubmitting,m:"auto",w:"100%",children:"Auto Check In"})]})})}),e(c,{h:"25px"})]})},oe=()=>e(c,{transform:"rotateZ(90deg)",children:i("svg",{x:"0px",y:"0px",viewBox:"0 0 1000 1000",enableBackground:"new 0 0 1000 1000",fill:m("#C3322C","#F5C14D"),children:[e("metadata",{children:" Svg Vector Icons : http://www.onlinewebfonts.com/icon "}),e("g",{children:e("g",{transform:"translate(0.000000,511.000000) scale(0.100000,-0.100000)",children:e("path",{d:"M4892.6,4970.8c-212.8-132.7-398.2-531-529-1134.2l-52.7-244l-7.8-1044.4l-7.8-1044.4L2196.7,256.2L100-993.2v-349.4v-349.5l54.7,11.7c978,214.7,4134.7,884.4,4140.6,878.5c3.9-3.9,171.8-1731.6,236.2-2442.2c0-1.9-277.2-214.7-614.9-474.4l-614.9-470.5v-302.6c0-279.2,2-302.6,35.1-292.8c117.1,37.1,1622.3,382.6,1663.3,382.6c41,0,1546.1-345.5,1665.2-382.6c31.3-9.7,33.2,13.7,33.2,292.8v302.6l-579.8,443.1c-320.1,242.1-597.4,456.8-614.9,474.4c-31.2,29.3-27.3,97.6,80,1247.4c62.5,669.6,117.1,1220.1,121,1222.1c3.9,3.9,942.9-193.3,2086.9-439.2s2084.9-447.1,2094.7-447.1c7.8,0,13.7,156.2,13.7,347.5v347.5L7803.3,256.2L5704.7,1503.7l-7.8,1044.4l-7.8,1044.4l-50.8,240.1c-105.4,478.3-253.8,853.1-404.1,1024.9C5101.5,5007.9,5003.9,5041,4892.6,4970.8z"})})})]})});function ne(r){const t=new Date(r);return`${["January","February","March","April","May","June","July","August","September","October","November","December"][t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`}const ie=({flightInfo:r})=>{console.log(r);const[t]=J("(min-width: 600px)");return e(C,{gap:t?"8px":"20px",children:r.flights.map((o,l)=>i(Y,{direction:t?"row":"column",justify:"space-between",w:"100%",spacing:t?"0px":"12px",children:[i(h,{spacing:"30px",justify:"center",w:"100%",children:[e(p,{fontSize:"20px",children:o.fromCode}),e(c,{w:"30px",h:"30px",children:e(oe,{})}),e(p,{fontSize:"20px",children:o.toCode})]}),i(h,{justify:"center",w:"100%",children:[e(p,{fontSize:"16px",children:o.departureTime}),e(p,{fontSize:"16px",children:ne(o.date)})]})]},l))})},ae=({flightInfo:r,setDisplayMode:t})=>e(x,{children:i(C,{maxW:"800px",m:"auto",spacing:"16px",align:"left",children:[e(p,{mt:"80px",textAlign:"center",children:"Success!"}),e(c,{h:"30px",w:"100px"}),i(C,{spacing:"0px",children:[e(h,{w:"100%",h:"15px",bg:"#C3322C",transform:"translateY(10px)",borderTopRadius:"15px",children:e(c,{h:"100%",w:"50%",bg:"#F5C14D",borderTopLeftRadius:"15px"})}),i(c,{w:"100%",py:"20px",borderWidth:"1px",borderRadius:"15px",children:[i(p,{fontSize:"16px",mt:"10px",mb:"20px",textAlign:"center",children:[r.firstName," ",r.lastName," (",r.confirmationNumber,")"]}),e(ie,{flightInfo:r})]})]}),i(p,{mt:"30px",fontSize:"16px",children:["You'll be checked in at ",r.flights[0].checkInTime]}),e(c,{w:"170px",maxW:"800px",m:"auto",children:i(h,{spacing:"5px",cursor:"pointer",transitionDuration:"300ms",transitionTimingFunction:"ease-out",onClick:()=>t("form"),_hover:{marginLeft:"-12px",color:"#F5C14D"},children:[e(p,{fontSize:"16px",children:"\u2190"}),e(p,{fontSize:"16px",children:"set up another trip"})]})}),e(c,{h:"100px"})]})}),se=()=>{const[r,t]=g.exports.useState({}),[o,l]=g.exports.useState("form"),{setColorMode:n}=L();return g.exports.useEffect(()=>{n("dark")},[]),i(x,{children:[i(c,{w:"100vw",h:"100vh",positon:"relative",px:"20px",children:[e(B,{}),o==="form"?e(re,{setFlightInfo:t,setDisplayMode:l}):e(x,{}),o==="info"?e(ae,{flightInfo:r,setFlightInfo:t,setDisplayMode:l}):e(x,{})]}),e(R,{})]})},le={initialColorMode:"dark"},ce=q({config:le}),de=()=>e(x,{children:i(c,{w:"100vw",h:"100vh",positon:"relative",children:[e(B,{}),e(p,{textAlign:"center",children:"About Page"}),e(R,{})]})});E.render(e(G.StrictMode,{children:e(K,{theme:ce,children:e(Q,{children:i(U,{children:[e(z,{path:"/",element:e(se,{})}),e(z,{path:"/about",element:e(de,{})})]})})})}),document.getElementById("root"));
