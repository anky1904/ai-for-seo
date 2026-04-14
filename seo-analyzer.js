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


// META

const title=doc.querySelector("title")?.innerText || "Missing"
const meta=doc.querySelector('meta[name="description"]')?.content || "Missing"

const titleLength=title.length
const metaLength=meta.length



// HEADERS

const h1=doc.querySelectorAll("h1")
const h2=doc.querySelectorAll("h2")
const h3=doc.querySelectorAll("h3")

let h1List=""
let h2List=""
let h3List=""

h1.forEach(el=>h1List+=`<li>${el.innerText}</li>`)
h2.forEach(el=>h2List+=`<li>${el.innerText}</li>`)
h3.forEach(el=>h3List+=`<li>${el.innerText}</li>`)



// IMAGES

const images=doc.querySelectorAll("img")

let imagesMissingAlt=0
let imagesMissingAltList=""

images.forEach(img=>{

if(!img.getAttribute("alt")){

imagesMissingAlt++

let name=img.src.split("/").pop().split(".")[0]

name=name.replace(/[-_]/g," ")

imagesMissingAltList+=`

<tr>
<td>${img.src}</td>
<td>${name}</td>
</tr>

`

}

})



// LINKS

const links=doc.querySelectorAll("a")

let internalLinks=0
let externalLinks=0

links.forEach(link=>{

const href=link.getAttribute("href")

if(!href) return

if(
href.startsWith("/") ||
href.includes(url)
){
internalLinks++
}
else{
externalLinks++
}

})



// TECHNICAL SEO

const canonical=doc.querySelector("link[rel='canonical']")?.href || "Missing"

const robots=doc.querySelector("meta[name='robots']")?.content || "Missing"

const schema=doc.querySelector("script[type='application/ld+json']")
? "Present"
: "Missing"



// SITEMAP

let sitemap="Checking..."

try{

const sitemapCheck=await fetch(url+"/sitemap.xml")

sitemap=sitemapCheck.status===200
? "Present"
: "Missing"

}catch{

sitemap="Missing"

}



// PAGE SPEED

let speed="Unavailable"

try{

const api=`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`

const res=await fetch(api)

const json=await res.json()

if(
json &&
json.lighthouseResult &&
json.lighthouseResult.categories &&
json.lighthouseResult.categories.performance
){

speed=Math.round(
json.lighthouseResult.categories.performance.score*100
)

}

}catch{

speed="Unavailable"

}



// SEO SCORE

if(titleLength>70) score-=10
if(metaLength>160) score-=10
if(imagesMissingAlt>0) score-=10
if(h1.length==0) score-=10
if(canonical=="Missing") score-=5
if(robots=="Missing") score-=5
if(schema=="Missing") score-=5



return{

score,

title,
meta,

titleLength,
metaLength,

h1Count:h1.length,
h2Count:h2.length,
h3Count:h3.length,

h1List,
h2List,
h3List,

imageCount:images.length,
imagesMissingAlt,
imagesMissingAltList,

totalLinks:links.length,
internalLinks,
externalLinks,

canonical,
robots,
schema,
sitemap,
speed

}

}
