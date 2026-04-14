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

const schemaScript=doc.querySelector('script[type="application/ld+json"]')

if(schemaScript){

const schemaText=schemaScript.innerText

if(schemaText.includes("Product")){
pageType="Product"
}

if(schemaText.includes("Article")){
pageType="Blog"
}

}



/* META */

const title=doc.querySelector("title")?.innerText || "Missing"
const meta=doc.querySelector('meta[name="description"]')?.content || "Missing"

const titleLength=title.length
const metaLength=meta.length

let titleHighlighted=title
let metaHighlighted=meta


if(titleLength>70){

score-=10

suggestions+=`

<div class="suggestion high">
<h4>Meta Title Too Long</h4>
<p>Reduce meta title under 70 characters to prevent truncation.</p>
</div>

`

}


if(!title.toLowerCase().includes("|")){

suggestions+=`

<div class="suggestion medium">
<h4>Brand Missing in Title</h4>
<p>Add brand name in title to improve CTR.</p>
</div>

`

}


/* META DESCRIPTION */

if(metaLength<120){

suggestions+=`

<div class="suggestion medium">
<h4>Meta Description Too Short</h4>
<p>Increase description to 140–160 characters.</p>
</div>

`

score-=5

}


/* HEADINGS */

const headings=doc.querySelectorAll("h1,h2,h3")

let headingStructure=""
let h1Count=doc.querySelectorAll("h1").length

const firstHeading=headings[0]?.tagName

headings.forEach(tag=>{

headingStructure+=`
<p class="${tag.tagName.toLowerCase()}">
${tag.tagName}: ${tag.innerText}
</p>
`

})


if(firstHeading!="H1"){

score-=10

suggestions+=`

<div class="suggestion high">
<h4>Heading Structure Issue</h4>
<p>Page starts with ${firstHeading}. H1 should appear first.</p>
</div>

`

}


/* CONTENT */

const contentLength=doc.body.innerText.length

if(contentLength<1500){

score-=10

suggestions+=`

<div class="suggestion medium">
<h4>Thin Content</h4>
<p>Increase content depth for better ranking.</p>
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

}

})


if(imagesMissingAlt>0){

score-=10

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

links.forEach(link=>{

const href=link.getAttribute("href")

if(!href) return

if(href.startsWith("/") || href.includes(url)){
internalLinks++
}

})


if(internalLinks<5){

score-=5

suggestions+=`

<div class="suggestion medium">
<h4>Low Internal Linking</h4>
<p>Add more internal links.</p>
</div>

`

}



/* PRODUCT PAGE SUGGESTIONS */

if(pageType=="Product"){

const reviewCheck=doc.body.innerText.toLowerCase().includes("review")

if(!reviewCheck){

suggestions+=`

<div class="suggestion high">
<h4>Product Reviews Missing</h4>
<p>Add customer reviews to improve ranking.</p>
</div>

`

score-=5

}


const faqCheck=doc.body.innerText.toLowerCase().includes("faq")

if(!faqCheck){

suggestions+=`

<div class="suggestion medium">
<h4>FAQ Section Missing</h4>
<p>Add FAQ for long-tail keywords.</p>
</div>

`

score-=5

}


}



/* BLOG PAGE SUGGESTIONS */

if(pageType=="Blog"){

const tocCheck=doc.body.innerText.toLowerCase().includes("table of contents")

if(!tocCheck){

suggestions+=`

<div class="suggestion medium">
<h4>Table of Contents Missing</h4>
<p>Add TOC to improve UX.</p>
</div>

`

score-=5

}

}



/* TECHNICAL */

const canonical=doc.querySelector("link[rel='canonical']")?.href || "Missing"

if(canonical=="Missing"){

score-=5

suggestions+=`

<div class="suggestion high">
<h4>Canonical Missing</h4>
<p>Add canonical tag.</p>
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

totalLinks:links.length,
internalLinks,

canonical,

suggestions

}

}
