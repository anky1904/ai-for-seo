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
let suggestions=""


/* META */

const title=doc.querySelector("title")?.innerText || "Missing"
const meta=doc.querySelector('meta[name="description"]')?.content || "Missing"

const titleLength=title.length
const metaLength=meta.length


let titleHighlighted=title
let metaHighlighted=meta


if(titleLength>70){

score-=5

titleHighlighted=
title.substring(0,70)+
"<span class='char-warning'>"+
title.substring(70)+
"</span>"

}



if(metaLength>160){

score-=5

metaHighlighted=
meta.substring(0,160)+
"<span class='char-warning'>"+
meta.substring(160)+
"</span>"

}



/* HEADING STRUCTURE */

const headings=doc.querySelectorAll("h1,h2,h3,h4")

let headingStructure=""

headings.forEach(tag=>{

headingStructure+=`
<p class="${tag.tagName.toLowerCase()}">
${tag.tagName}: ${tag.innerText}
</p>
`

})


const firstHeading=headings[0]?.tagName

if(firstHeading!="H1"){

score-=5

suggestions+=`

<div class="suggestion">
<h4>Heading Structure Issue</h4>
<p>H1 should appear first</p>
</div>

`

}



/* IMAGES */

const images=doc.querySelectorAll("img")

let imagesMissingAlt=0
let imagesMissingAltList=""

images.forEach(img=>{

if(!img.alt){

imagesMissingAlt++

let name=img.src.split("/").pop()

imagesMissingAltList+=`

<tr>
<td>${img.src}</td>
<td>${name}</td>
</tr>

`

}

})



if(imagesMissingAlt>0){

score-=5

suggestions+=`

<div class="suggestion">
<h4>Image Optimization Required</h4>
<p>${imagesMissingAlt} images missing ALT text</p>
</div>

`

}



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

score-=3

suggestions+=`

<div class="suggestion">
<h4>Internal Linking Opportunity</h4>
<p>Add contextual internal links</p>
</div>

`

}



/* SCHEMA */

let schema="Missing"

const schemaScripts=doc.querySelectorAll(
'script[type="application/ld+json"]'
)

if(schemaScripts.length>0){
schema="Present"
}else{

score-=5

suggestions+=`

<div class="suggestion">
<h4>Schema Missing</h4>
<p>Add structured data for better SERP visibility</p>
</div>

`

}



/* SITEMAP */

let sitemap="Missing"

try{

const sitemapURL=new URL("/sitemap.xml",url)

const res=await fetch(sitemapURL)

if(res.status===200){
sitemap="Present"
}

}catch(e){

sitemap="Missing"

}



/* CANONICAL */

const canonical=
doc.querySelector("link[rel='canonical']")?.href || "Missing"



if(canonical=="Missing"){

score-=5

suggestions+=`

<div class="suggestion">
<h4>Canonical Missing</h4>
<p>Add canonical tag</p>
</div>

`

}



/* PAGE TYPE DETECTION */

let pageType="General"

if(url.includes("/products")) pageType="Product"
if(url.includes("/blogs")) pageType="Blog"
if(url.includes("/collections")) pageType="Collection"



/* PRODUCT PAGE SEO */

if(pageType=="Product"){

const reviewCheck=
doc.body.innerText.toLowerCase().includes("review")

if(!reviewCheck){

suggestions+=`

<div class="suggestion">
<h4>Product Reviews Missing</h4>
<p>Add reviews to improve CTR</p>
</div>

`

}



const faqCheck=
doc.body.innerText.toLowerCase().includes("faq")

if(!faqCheck){

suggestions+=`

<div class="suggestion">
<h4>Product FAQ Missing</h4>
<p>Add FAQ section</p>
</div>

`

}



}



/* BLOG SEO */

if(pageType=="Blog"){

const contentLength=doc.body.innerText.length

if(contentLength<1500){

suggestions+=`

<div class="suggestion">
<h4>Thin Blog Content</h4>
<p>Increase content depth</p>
</div>

`

}


const faqCheck=
doc.body.innerText.toLowerCase().includes(
"frequently asked"
)

if(!faqCheck){

suggestions+=`

<div class="suggestion">
<h4>FAQ Section Missing</h4>
<p>Add FAQ section</p>
</div>

`

}

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
schema,
sitemap,

suggestions

}

}
