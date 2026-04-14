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


/* META */

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



/* HEADINGS */

const headings=doc.querySelectorAll("h1,h2,h3,h4,h5,h6")

let headingStructure=""

let h1Count=doc.querySelectorAll("h1").length

headings.forEach(tag=>{
headingStructure+=`
<p class="${tag.tagName.toLowerCase()}">
${tag.tagName} : ${tag.innerText}
</p>
`
})


if(h1Count==0) score-=10
if(h1Count>1) score-=5



/* CONTENT */

const contentLength=doc.body.innerText.length

if(contentLength<1500){
score-=10
}



/* IMAGES */

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



/* LINKS */

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

if(internalLinks<5){
score-=5
}



/* TECHNICAL */

const canonical=doc.querySelector("link[rel='canonical']")?.href || "Missing"
const robots=doc.querySelector("meta[name='robots']")?.content || "Missing"
const schema=doc.querySelector("script[type='application/ld+json']") ? "Present" : "Missing"

let sitemap="Missing"

try{
const map=await fetch(url+"/sitemap.xml")
if(map.status==200) sitemap="Present"
}catch{}


if(canonical=="Missing") score-=5
if(robots=="Missing") score-=5
if(schema=="Missing") score-=5
if(sitemap=="Missing") score-=5



/* SEO SUGGESTIONS */

let suggestions=""


/* META */

if(titleLength>70){
suggestions+=`
<div class="suggestion high">
<h4>Meta Title Optimization Required</h4>
<p>Your meta title exceeds recommended length. Reduce below 70 characters and include primary keyword at beginning.</p>
</div>
`
}


if(metaLength>160){
suggestions+=`
<div class="suggestion high">
<h4>Meta Description Optimization Required</h4>
<p>Meta description is too long. Keep between 140-160 characters and add CTA to improve CTR.</p>
</div>
`
}



/* HEADINGS */

if(h1Count==0){
suggestions+=`
<div class="suggestion high">
<h4>Missing H1 Tag</h4>
<p>Add one primary H1 tag including main keyword to improve ranking relevance.</p>
</div>
`
}

if(h1Count>1){
suggestions+=`
<div class="suggestion medium">
<h4>Multiple H1 Tags Found</h4>
<p>Use only one H1 tag for better SEO structure.</p>
</div>
`
}



/* CONTENT */

if(contentLength<1500){
suggestions+=`
<div class="suggestion medium">
<h4>Low Content Length</h4>
<p>Increase content length above 1500 words for better ranking potential.</p>
</div>
`
}



/* IMAGES */

if(imagesMissingAlt>0){
suggestions+=`
<div class="suggestion high">
<h4>Missing Image ALT Tags</h4>
<p>${imagesMissingAlt} images missing ALT text. Add descriptive ALT tags including keywords.</p>
</div>
`
}



/* INTERNAL LINKS */

if(internalLinks<5){
suggestions+=`
<div class="suggestion medium">
<h4>Low Internal Linking</h4>
<p>Add more internal links to improve crawlability and authority flow.</p>
</div>
`
}



/* TECHNICAL */

if(canonical=="Missing"){
suggestions+=`
<div class="suggestion high">
<h4>Canonical Tag Missing</h4>
<p>Add canonical tag to prevent duplicate content issues.</p>
</div>
`
}

if(schema=="Missing"){
suggestions+=`
<div class="suggestion medium">
<h4>Schema Markup Missing</h4>
<p>Add structured data to improve SERP visibility.</p>
</div>
`
}

if(sitemap=="Missing"){
suggestions+=`
<div class="suggestion medium">
<h4>Sitemap Missing</h4>
<p>Add sitemap.xml to improve indexing.</p>
</div>
`
}


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
sitemap,

suggestions

}

}
