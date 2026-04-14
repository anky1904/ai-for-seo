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

score-=10

titleHighlighted = title.substring(0,70) +
`<span class="char-warning">` +
title.substring(70) +
`</span>`

}


if(metaLength>160){

score-=10

metaHighlighted = meta.substring(0,160) +
`<span class="char-warning">` +
meta.substring(160) +
`</span>`

}



/* HEADINGS */

const headings=doc.querySelectorAll("h1,h2,h3,h4")

let headingStructure=""

let firstHeading=headings[0]?.tagName

headings.forEach(tag=>{

headingStructure+=`
<p class="${tag.tagName.toLowerCase()}">
${tag.tagName} : ${tag.innerText}
</p>
`

})


if(firstHeading!="H1"){

score-=10

suggestions+=`

<div class="suggestion high">
<h4>Heading Structure Issue</h4>
<p>H1 should appear first.</p>
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

let name=img.src.split("/").pop().split(".")[0]

imagesMissingAltList+=`

<tr>
<td>${img.src}</td>
<td>${name.replace(/[-_]/g," ")}</td>
</tr>

`

}

})



if(imagesMissingAlt>0){

score-=5

suggestions+=`

<div class="suggestion high">
<h4>Missing ALT Tags</h4>
<p>${imagesMissingAlt} images missing ALT text.</p>
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



/* TECHNICAL */

const canonical=doc.querySelector("link[rel='canonical']")?.href || "Missing"
const robots=doc.querySelector("meta[name='robots']")?.content || "Missing"



if(canonical=="Missing"){

score-=5

suggestions+=`

<div class="suggestion high">
<h4>Canonical Missing</h4>
<p>Add canonical tag.</p>
</div>

`

}



/* PAGE TYPE */

let pageType="General"

if(url.includes("/products")) pageType="Product"
if(url.includes("/blogs")) pageType="Blog"



/* BLOG SUGGESTIONS */

if(pageType=="Blog"){

const faqCheck =
doc.body.innerText.toLowerCase().includes("frequently asked questions")

if(!faqCheck){

score-=5

suggestions+=`

<div class="suggestion medium">
<h4>FAQ Section Missing</h4>
<p>Add FAQ section to target long-tail queries.</p>
</div>

`

}

const contentLength=doc.body.innerText.length

if(contentLength<1500){

score-=10

suggestions+=`

<div class="suggestion medium">
<h4>Thin Content</h4>
<p>Increase blog content length.</p>
</div>

`

}

}



/* PRODUCT SUGGESTIONS */

if(pageType=="Product"){

const reviewCheck =
doc.body.innerText.toLowerCase().includes("review")

if(!reviewCheck){

score-=5

suggestions+=`

<div class="suggestion high">
<h4>Product Reviews Missing</h4>
<p>Add product reviews.</p>
</div>

`

}


const faqCheck =
doc.body.innerText.toLowerCase().includes("faq")

if(!faqCheck){

score-=5

suggestions+=`

<div class="suggestion medium">
<h4>FAQ Section Missing</h4>
<p>Add FAQ section.</p>
</div>

`

}

}



/* RETURN */

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

suggestions

}

}
