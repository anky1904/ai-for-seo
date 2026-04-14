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

if(url.includes("/product") || url.includes("/products")){
pageType="Product"
}

if(url.includes("/blog") || url.includes("/blogs")){
pageType="Blog"
}




/* META */

const title=doc.querySelector("title")?.innerText || "Missing"
const meta=doc.querySelector('meta[name="description"]')?.content || "Missing"

const titleLength=title.length
const metaLength=meta.length


if(titleLength>70){

score-=10

suggestions+=`
<div class="suggestion high">
<h4>Meta Title Too Long</h4>
<p>Reduce meta title below 70 characters.</p>
</div>
`

}



if(metaLength<120){

score-=5

suggestions+=`
<div class="suggestion medium">
<h4>Meta Description Too Short</h4>
<p>Increase meta description for better CTR.</p>
</div>
`

}




/* HEADINGS */

const headings=doc.querySelectorAll("h1,h2,h3")

const firstHeading=headings[0]?.tagName

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

images.forEach(img=>{
if(!img.alt){
imagesMissingAlt++
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
<p>Add contextual internal links.</p>
</div>
`

}



/* PRODUCT PAGE SEO */

if(pageType=="Product"){


const reviewCheck=
doc.body.innerText.toLowerCase().includes("review")

if(!reviewCheck){

score-=5

suggestions+=`
<div class="suggestion high">
<h4>Product Reviews Missing</h4>
<p>Add customer reviews to improve ranking and trust.</p>
</div>
`

}



const faqCheck=
doc.body.innerText.toLowerCase().includes("faq")

if(!faqCheck){

score-=5

suggestions+=`
<div class="suggestion medium">
<h4>FAQ Section Missing</h4>
<p>Add FAQ section for long tail keywords.</p>
</div>
`

}



const descriptionLength=doc.body.innerText.length

if(descriptionLength<1200){

score-=10

suggestions+=`
<div class="suggestion high">
<h4>Product Description Too Short</h4>
<p>Expand description with benefits and features.</p>
</div>
`

}



const relatedCheck=
doc.body.innerText.toLowerCase().includes("related")

if(!relatedCheck){

score-=3

suggestions+=`
<div class="suggestion low">
<h4>Related Products Missing</h4>
<p>Add related products for internal linking.</p>
</div>
`

}



const priceCheck=
doc.body.innerText.includes("₹") ||
doc.body.innerText.includes("$")

if(!priceCheck){

score-=3

suggestions+=`
<div class="suggestion medium">
<h4>Price Not Clearly Visible</h4>
<p>Ensure price visible for product schema.</p>
</div>
`

}



}



/* BLOG PAGE SEO */

if(pageType=="Blog"){


const contentLength=doc.body.innerText.length

if(contentLength<1500){

score-=10

suggestions+=`
<div class="suggestion high">
<h4>Thin Content</h4>
<p>Increase blog content depth.</p>
</div>
`

}



const faqCheck=
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



const tocCheck=
doc.body.innerText.toLowerCase().includes("table of contents")

if(!tocCheck){

score-=5

suggestions+=`
<div class="suggestion medium">
<h4>Table of Contents Missing</h4>
<p>Add TOC for better UX.</p>
</div>
`

}



const authorCheck=
doc.body.innerText.toLowerCase().includes("author")

if(!authorCheck){

score-=5

suggestions+=`
<div class="suggestion medium">
<h4>Author Section Missing</h4>
<p>Add author info for E-E-A-T.</p>
</div>
`

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
titleLength,
metaLength,
imageCount:images.length,
imagesMissingAlt,
totalLinks:links.length,
internalLinks,
canonical,
suggestions

}

}
