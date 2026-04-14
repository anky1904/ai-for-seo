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



/* PAGE TYPE DETECTION */

let pageType="General"

if(url.includes("/products")) pageType="Product"
if(url.includes("/blogs")) pageType="Blog"
if(url.includes("/collections")) pageType="Collection"



/* META */

const title=doc.querySelector("title")?.innerText || "Missing"
const meta=doc.querySelector('meta[name="description"]')?.content || "Missing"

const titleLength=title.length
const metaLength=meta.length

let titleHighlighted=title
let metaHighlighted=meta


if(titleLength>70){
score-=5
}

if(metaLength<120){
score-=5
}



/* HEADINGS */

const headings=doc.querySelectorAll("h1,h2,h3,h4")

let headingStructure=""

headings.forEach(tag=>{
headingStructure+=`
<p>${tag.tagName}: ${tag.innerText}</p>
`
})



/* IMAGES */

const images=doc.querySelectorAll("img")

let imagesMissingAlt=0
let imagesMissingAltList=""

images.forEach(img=>{

if(!img.alt){

imagesMissingAlt++

imagesMissingAltList+=`
<tr>
<td>${img.src}</td>
<td>${img.src.split("/").pop()}</td>
</tr>
`

}

})



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



/* SCHEMA */

let schema="Missing"

const schemaScripts = doc.querySelectorAll(
'script[type="application/ld+json"]'
)

if(schemaScripts.length>0){
schema="Present"
}



/* SITEMAP */

let sitemap="Missing"

try{
const sitemapURL = new URL("/sitemap.xml", url)

const res = await fetch(sitemapURL)

if(res.status===200){
sitemap="Present"
}

}catch(e){
sitemap="Missing"
}



/* CANONICAL */

const canonical =
doc.querySelector("link[rel='canonical']")?.href || "Missing"



/* TECHNICAL SUGGESTIONS */

if(schema=="Missing"){
score-=5
suggestions+=`
<div class="suggestion">
<h4>Schema Markup Missing</h4>
<p>Add structured data (Product / Article / Organization)</p>
</div>
`
}


if(sitemap=="Missing"){
score-=5
suggestions+=`
<div class="suggestion">
<h4>Sitemap Missing</h4>
<p>Add sitemap.xml and submit to Search Console</p>
</div>
`
}



/* PRODUCT PAGE SUGGESTIONS */

if(pageType=="Product"){

suggestions+=`
<h3>Product Page Optimization</h3>
`

const reviewCheck =
doc.body.innerText.toLowerCase().includes("review")

if(!reviewCheck){
suggestions+=`
<p>• Add product reviews to improve trust & CTR</p>
`
score-=5
}


const faqCheck =
doc.body.innerText.toLowerCase().includes("faq")

if(!faqCheck){
suggestions+=`
<p>• Add FAQ section for long-tail ranking</p>
`
}


const relatedCheck =
doc.body.innerText.toLowerCase().includes("related")

if(!relatedCheck){
suggestions+=`
<p>• Add related products for internal linking</p>
`
}


}



/* BLOG PAGE SUGGESTIONS */

if(pageType=="Blog"){

suggestions+=`
<h3>Blog Optimization</h3>
`

const faqCheck =
doc.body.innerText.toLowerCase().includes("frequently asked")

if(!faqCheck){
suggestions+=`
<p>• Add FAQ section</p>
`
}


const contentLength = doc.body.innerText.length

if(contentLength<1500){
suggestions+=`
<p>• Increase content depth</p>
`
}


const tocCheck =
doc.body.innerText.toLowerCase().includes("table of contents")

if(!tocCheck){
suggestions+=`
<p>• Add table of contents</p>
`
}

}



/* COLLECTION PAGE */

if(pageType=="Collection"){

suggestions+=`
<h3>Collection Page Optimization</h3>

<p>• Add collection description</p>
<p>• Add internal linking</p>
<p>• Add FAQ section</p>

`

}



/* HOMEPAGE */

if(pageType=="General"){

suggestions+=`
<h3>Homepage Optimization</h3>

<p>• Add internal linking</p>
<p>• Improve hero content</p>
<p>• Add FAQ section</p>

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
schema,
sitemap,

suggestions

}

}
