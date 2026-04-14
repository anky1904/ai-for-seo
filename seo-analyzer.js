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


function analyzePage(doc){

let score=100

const title=doc.querySelector("title")?.innerText || "Missing"
const meta=doc.querySelector('meta[name="description"]')?.content || "Missing"

const titleLength=title.length
const metaLength=meta.length

if(titleLength>70) score-=10
if(metaLength>160) score-=10


const h1=doc.querySelectorAll("h1")
const h2=doc.querySelectorAll("h2")
const h3=doc.querySelectorAll("h3")

if(h1.length==0) score-=10

let h1List=""
let h2List=""
let h3List=""

h1.forEach(el=>h1List+=`<li>${el.innerText}</li>`)
h2.forEach(el=>h2List+=`<li>${el.innerText}</li>`)
h3.forEach(el=>h3List+=`<li>${el.innerText}</li>`)


const images=doc.querySelectorAll("img")

let imagesMissingAlt=0
let imagesMissingAltList=""

images.forEach(img=>{

if(!img.getAttribute("alt")){

imagesMissingAlt++

const src=img.src

let suggestedAlt=src.split("/").pop()
suggestedAlt=suggestedAlt.replace(/[-_]/g," ")
suggestedAlt=suggestedAlt.split(".")[0]

imagesMissingAltList+=`

<tr>
<td>${src}</td>
<td>${suggestedAlt}</td>
</tr>

`

}

})

if(imagesMissingAlt>0) score-=10


const links=doc.querySelectorAll("a")

let internalLinks=0
let externalLinks=0

links.forEach(link=>{

const href=link.getAttribute("href")

if(!href) return

if(href.startsWith("/")){
internalLinks++
}else{
externalLinks++
}

})


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
externalLinks

}

}
