async function fetchHTML(url){

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


const title=doc.querySelector("title")?.innerText || "Missing"

const meta=doc.querySelector('meta[name="description"]')?.content || "Missing"


const titleHighlighted=title

const metaHighlighted=meta


const headings=doc.querySelectorAll("h1,h2,h3")

let headingStructure=""

headings.forEach(tag=>{
headingStructure+=`<p>${tag.tagName}: ${tag.innerText}</p>`
})


const images=doc.querySelectorAll("img")

let imagesMissingAlt=0

let imagesMissingAltList=""

images.forEach(img=>{

if(!img.alt){

imagesMissingAlt++

imagesMissingAltList+=`
<tr>
<td>${img.src}</td>
</tr>
`

}

})


const links=doc.querySelectorAll("a")

const totalLinks=links.length


const canonical=doc.querySelector("link[rel='canonical']")?.href || "Missing"


/* Advanced suggestions */

if(url.includes("/products")){

suggestions+=`

<h3>Product Page Optimization</h3>

<ul>
<li>Add product reviews</li>
<li>Improve product description</li>
<li>Add FAQ</li>
<li>Add related products</li>
</ul>

`

}


if(url.includes("/blogs")){

suggestions+=`

<h3>Blog Optimization</h3>

<ul>
<li>Improve content depth</li>
<li>Add FAQ</li>
<li>Add TOC</li>
<li>Add internal linking</li>
</ul>

`

}


return{

score,

title,
meta,

titleHighlighted,
metaHighlighted,

headingStructure,

imageCount:images.length,
imagesMissingAlt,
imagesMissingAltList,

totalLinks,

canonical,

suggestions

}

}
