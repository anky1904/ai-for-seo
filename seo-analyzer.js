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
`<span style="color:red">`+
title.substring(70)+
`</span>`

score-=8

suggestions+=`

<div class="suggestion-card suggestion-high">

<div class="suggestion-title">
Meta Title Too Long
</div>

<p>
Your meta title exceeds 70 characters. 
This can reduce CTR and cause truncation.
</p>

<p>
Fix: Keep title between 50-60 characters
</p>

</div>

`

}


if(metaLength>160){

metaHighlighted=meta.substring(0,160)+
`<span style="color:red">`+
meta.substring(160)+
`</span>`

score-=8

suggestions+=`

<div class="suggestion-card suggestion-high">

<div class="suggestion-title">
Meta Description Too Long
</div>

<p>
Meta description should be below 160 characters
</p>

</div>

`

}



/* ================= HEADINGS ================= */

const headings=doc.querySelectorAll("h1,h2,h3,h4")

let headingStructure=""
let h1Count=0
let firstHeading=headings[0]?.tagName

headings.forEach(tag=>{

if(tag.tagName==="H1"){
h1Count++
}

headingStructure+=`

<p class="${tag.tagName.toLowerCase()}">
${tag.tagName} : ${tag.innerText}
</p>

`

})


if(firstHeading!=="H1"){

score-=10

suggestions+=`

<div class="suggestion-card suggestion-high">

<div class="suggestion-title">
Heading Structure Issue
</div>

<p>
H1 should appear first
</p>

</div>

`

}


if(h1Count>1){

score-=5

suggestions+=`

<div class="suggestion-card suggestion-medium">

<div class="suggestion-title">
Multiple H1 Tags
</div>

<p>
Use only one H1 tag
</p>

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

<div class="suggestion-card suggestion-high">

<div class="suggestion-title">
Missing ALT Tags
</div>

<p>
${imagesMissingAlt} images missing ALT text
</p>

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

<div class="suggestion-card suggestion-medium">

<div class="suggestion-title">
Low Internal Linking
</div>

<p>
Add more internal links
</p>

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

if(map.status==200){
sitemap="Present"
}

}catch{}


if(canonical=="Missing"){

score-=5

suggestions+=`

<div class="suggestion-card suggestion-high">

<div class="suggestion-title">
Canonical Missing
</div>

<p>
Add canonical tag
</p>

</div>

`

}


if(schema=="Missing"){

score-=5

suggestions+=`

<div class="suggestion-card suggestion-medium">

<div class="suggestion-title">
Schema Missing
</div>

<p>
Add schema markup
</p>

</div>

`

}


if(robots=="Missing"){

score-=5

suggestions+=`

<div class="suggestion-card suggestion-medium">

<div class="suggestion-title">
Robots Tag Missing
</div>

<p>
Add robots meta tag
</p>

</div>

`

}



/* ================= FINAL SCORE ================= */

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
