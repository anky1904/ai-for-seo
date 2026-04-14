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


let titleHighlighted=title
let metaHighlighted=meta

if(titleLength>70){

titleHighlighted=title.substring(0,70)+
`<span class="char-warning">`+
title.substring(70)+
`</span>`

score-=10
}


if(metaLength>160){

metaHighlighted=meta.substring(0,160)+
`<span class="char-warning">`+
meta.substring(160)+
`</span>`

score-=10
}


// headings

const headings=doc.querySelectorAll("h1,h2,h3,h4,h5,h6")

let headingStructure=""

headings.forEach(tag=>{

headingStructure+=`
<p class="${tag.tagName.toLowerCase()}">
${tag.tagName} : ${tag.innerText}
</p>
`

})


// images

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


// links

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


// technical

const canonical=doc.querySelector("link[rel='canonical']")?.href || "Missing"
const robots=doc.querySelector("meta[name='robots']")?.content || "Missing"
const schema=doc.querySelector("script[type='application/ld+json']") ? "Present" : "Missing"

let sitemap="Missing"

try{
const map=await fetch(url+"/sitemap.xml")
if(map.status==200) sitemap="Present"
}catch{}

return{

score,

title,
meta,

titleHighlighted,
metaHighlighted,

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
