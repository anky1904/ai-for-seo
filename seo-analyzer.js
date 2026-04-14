async function fetchHTML(url){

if(!url.startsWith("http")){
url = "https://" + url
}

const proxy = "https://corsproxy.io/?"

const response = await fetch(proxy + encodeURIComponent(url))
const html = await response.text()

return html

}


function parseHTML(html){

const parser = new DOMParser()
return parser.parseFromString(html,"text/html")

}


function analyzePage(doc){

const title = doc.querySelector("title")?.innerText || "Missing"
const meta = doc.querySelector('meta[name="description"]')?.content || "Missing"

const titleLength = title.length
const metaLength = meta.length


// HEADINGS

const h1 = doc.querySelectorAll("h1")
const h2 = doc.querySelectorAll("h2")
const h3 = doc.querySelectorAll("h3")

let h1List=""
let h2List=""
let h3List=""

h1.forEach(el => h1List += `<li>${el.innerText}</li>`)
h2.forEach(el => h2List += `<li>${el.innerText}</li>`)
h3.forEach(el => h3List += `<li>${el.innerText}</li>`)


// IMAGES

const images = doc.querySelectorAll("img")

let imagesMissingAlt = 0

images.forEach(img=>{
if(!img.getAttribute("alt")){
imagesMissingAlt++
}
})


// LINKS

const links = doc.querySelectorAll("a")

let internalLinks = 0
let externalLinks = 0

links.forEach(link=>{

const href = link.getAttribute("href")

if(!href) return

if(
href.startsWith("/") ||
href.includes(doc.location?.hostname)
){
internalLinks++
}
else{
externalLinks++
}

})


return{

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

imageCount: images.length,
imagesMissingAlt: imagesMissingAlt,

totalLinks: links.length,
internalLinks: internalLinks,
externalLinks: externalLinks

}

}
