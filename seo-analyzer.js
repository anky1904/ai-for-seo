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



/* ================= META TAGS ================= */

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

score-=8

suggestions+=`

<div class="suggestion high">
<h4>Meta Title Too Long</h4>
<p>Reduce meta title below 70 characters. Long titles get truncated in search results and reduce CTR.</p>
</div>

`

}


if(titleLength<30){

score-=5

suggestions+=`

<div class="suggestion medium">
<h4>Meta Title Too Short</h4>
<p>Add primary keyword and increase title length for better ranking relevance.</p>
</div>

`

}


if(metaLength>160){

metaHighlighted=meta.substring(0,160)+
`<span class="char-warning">`+
meta.substring(160)+
`</span>`

score-=8

suggestions+=`

<div class="suggestion high">
<h4>Meta Description Too Long</h4>
<p>Keep meta description between 140-160 characters.</p>
</div>

`

}


if(meta=="Missing"){

score-=12

suggestions+=`

<div class="suggestion high">
<h4>Meta Description Missing</h4>
<p>Add compelling meta description to improve CTR.</p>
</div>

`

}



/* ================= HEADINGS ================= */

const headings=doc.querySelectorAll("h1,h2,h3,h4,h5")

let headingStructure=""
let h1Count=0
let previousLevel=0

headings.forEach(tag=>{

const level=parseInt(tag.tagName.replace("H",""))

if(level==1){
h1Count++
}

if(previousLevel && level>previousLevel+1){

score-=5

suggestions+=`

<div class="suggestion high">
<h4>Heading Structure Issue</h4>
<p>${tag.tagName} appears after H${previousLevel}. Avoid skipping heading hierarchy.</p>
</div>

`

}

previousLevel=level

headingStructure+=`
<p class="${tag.tagName.toLowerCase()}">
${tag.tagName} : ${tag.innerText}
</p>
`

})


if(h1Count==0){

score-=10

suggestions+=`

<div class="suggestion high">
<h4>Missing H1 Tag</h4>
<p>Add one primary H1 tag including main keyword.</p>
</div>

`

}


if(h1Count>1){

score-=5

suggestions+=`

<div class="suggestion medium">
<h4>Multiple H1 Tags</h4>
<p>Use only one H1 tag.</p>
</div>

`

}



/* ================= CONTENT ================= */

const contentLength=doc.body.innerText.length

if(contentLength<1500){

score-=8

suggestions+=`

<div class="suggestion medium">
<h4>Thin Content</h4>
<p>Increase content depth to 1500+ words.</p>
</div>

`

}



/* ================= IMAGES ================= */

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

score-=8

suggestions+=`

<div class="suggestion high">
<h4>Missing ALT Tags</h4>
<p>${imagesMissingAlt} images missing ALT text. Add descriptive ALT text including keywords.</p>
</div>

`

}



/* ================= LINKS ================= */

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

suggestions+=`

<div class="suggestion medium">
<h4>Low Internal Linking</h4>
<p>Add more internal links to improve crawlability.</p>
</div>

`

}



/* ================= TECHNICAL ================= */

const canonical=doc.querySelector("link[rel='canonical']")?.href || "Missing"
const robots=doc.querySelector("meta[name='robots']")?.content || "Missing"
const schema=doc.querySelector("script[type='application/ld+json']") ? "Present" : "Missing"


let sitemap="Missing"

try{
const map=await fetch(url+"/sitemap.xml")
if(map.status==200) sitemap="Present"
}catch{}


if(canonical=="Missing"){

score-=5

suggestions+=`

<div class="suggestion high">
<h4>Canonical Missing</h4>
<p>Add canonical tag.</p>
</div>

`

}


if(schema=="Missing"){

score-=5

suggestions+=`

<div class="suggestion medium">
<h4>Schema Missing</h4>
<p>Add structured data markup.</p>
</div>

`

}


if(robots=="Missing"){

score-=5

suggestions+=`

<div class="suggestion medium">
<h4>Robots Tag Missing</h4>
<p>Add robots meta tag.</p>
</div>

`

}


if(sitemap=="Missing"){

score-=5

suggestions+=`

<div class="suggestion medium">
<h4>Sitemap Missing</h4>
<p>Add sitemap.xml.</p>
</div>

`

}


/* ================= FINAL ================= */

if(score<0){
score=0
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
