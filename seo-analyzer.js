async function fetchHTML(url){

if(!url.startsWith("http")){
url="https://"+url
}

const proxy="https://corsproxy.io/?"

const response=await fetch(proxy+encodeURIComponent(url))
const html=await response.text()

return html

}


function parseHTML(html){

const parser=new DOMParser()
return parser.parseFromString(html,"text/html")

}


async function analyzePage(doc,url){

let score=100

const title=doc.querySelector("title")?.innerText || "Missing"
const meta=doc.querySelector('meta[name="description"]')?.content || "Missing"

const titleLength=title.length
const metaLength=meta.length


const images=doc.querySelectorAll("img")

let imagesMissingAlt=0
let imagesMissingAltList=""

images.forEach(img=>{

if(!img.alt){

imagesMissingAlt++

let alt=img.src.split("/").pop()

imagesMissingAltList+=`
<tr>
<td>${img.src}</td>
<td>${alt}</td>
</tr>
`

}

})


const canonical=doc.querySelector("link[rel='canonical']")?.href || "Missing"
const robots=doc.querySelector("meta[name='robots']")?.content || "Missing"

const schema=doc.querySelector("script[type='application/ld+json']")
? "Present"
: "Missing"

let sitemap="Missing"

try{
const map=await fetch(url+"/sitemap.xml")
if(map.status==200) sitemap="Present"
}catch{}


let speed="Checking..."

try{

const api=`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`

const res=await fetch(api)

const json=await res.json()

speed=Math.round(json.lighthouseResult.categories.performance.score*100)

}catch{

speed="Unavailable"

}


return{

score,

title,
meta,

titleLength,
metaLength,

imageCount:images.length,
imagesMissingAlt,
imagesMissingAltList,

canonical,
robots,
schema,
sitemap,
speed

}

}
