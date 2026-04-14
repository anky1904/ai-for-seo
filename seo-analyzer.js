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

if(titleLength>70) score-=10
if(metaLength>160) score-=10



// HEADING STRUCTURE

const headings=doc.querySelectorAll("h1,h2,h3,h4,h5,h6")

let headingStructure=""

headings.forEach(tag=>{

headingStructure+=`
<p><strong>${tag.tagName}</strong> : ${tag.innerText}</p>
`

})



// IMAGES

const images=doc.querySelectorAll("img")

let imagesMissingAlt=0
let imagesMissingAltList=""

images.forEach(img=>{

if(!img.alt){

imagesMissingAlt++

let name=img.src.split("/").pop().split(".")[0]

imagesMissingAltList+=`
<tr>
<td>${img.src}</td>
<td>${name.replace(/[-_]/g," ")}</td>
</tr>
`

}

})

if(imagesMissingAlt>0) score-=10



// LINKS

const links=doc.querySelectorAll("a")

let internalLinks=0
let externalLinks=0

links.forEach(link=>{

const href=link.getAttribute("href")

if(!href) return

if(href.startsWith("/") || href.includes(url)){
internalLinks++
}else{
externalLinks++
}

})



// TECHNICAL

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



// SCORING

if(!canonical || canonical=="Missing") score-=5
if(!robots || robots=="Missing") score-=5
if(schema=="Missing") score-=5

if(score<0) score=0


return{

score,

title,
meta,

titleLength,
metaLength,

headingStructure,

imageCount:images.length,
imagesMissingAlt,
imagesMissingAltList,

totalLinks:links.length,
internalLinks,
externalLinks,

canonical,
robots,
schema,
sitemap

}

}
