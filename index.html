function openTab(evt, tabName){

const tabs=document.querySelectorAll(".tab")
const contents=document.querySelectorAll(".tab-content")

tabs.forEach(tab=>{
tab.classList.remove("active")
})

contents.forEach(content=>{
content.style.display="none"
})

document.getElementById(tabName).style.display="block"

if(evt){
evt.currentTarget.classList.add("active")
}

}


async function analyzeSEO(){

const url=document.getElementById("urlInput").value

if(!url){
alert("Enter Website URL")
return
}

const html=await fetchHTML(url)
const doc=parseHTML(html)

const data=await analyzePage(doc,url)

displayResults(data)

document.querySelectorAll(".tab").forEach(tab=>{
tab.classList.remove("active")
})

document.querySelector(".tab").classList.add("active")

document.querySelectorAll(".tab-content").forEach(content=>{
content.style.display="none"
})

document.getElementById("meta").style.display="block"

}


function displayResults(data){

document.getElementById("seoScore").innerHTML=`

<div class="score-wrapper">

<div class="score-card">

<div class="score-number">${data.score}/100</div>

<div class="score-text">
Overall SEO Score
</div>

</div>

</div>

`


document.getElementById("meta").innerHTML=`

<div class="card">

<h3>Meta Title</h3>

<p>${data.titleHighlighted}</p>

<p>${data.titleLength}/70</p>

<h3>Meta Description</h3>

<p>${data.metaHighlighted}</p>

<p>${data.metaLength}/160</p>

</div>

`


document.getElementById("headers").innerHTML=`

<div class="card">

<h3>Heading Structure</h3>

${data.headingStructure}

</div>

`


document.getElementById("images").innerHTML=`

<div class="card">

<h3>Images</h3>

<p>Total Images: ${data.imageCount}</p>

<p class="alt-error">
Missing ALT: ${data.imagesMissingAlt}
</p>

<table>

<tr>
<th>Image</th>
<th>Suggested ALT</th>
</tr>

${data.imagesMissingAltList}

</table>

</div>

`


document.getElementById("links").innerHTML=`

<div class="card">

<p>Total Links: ${data.totalLinks}</p>
<p>Internal Links: ${data.internalLinks}</p>
<p>External Links: ${data.externalLinks}</p>

</div>

`


document.getElementById("technical").innerHTML=`

<div class="card">

<p>Canonical: ${data.canonical}</p>
<p>Robots: ${data.robots}</p>
<p>Schema: ${data.schema}</p>
<p>Sitemap: ${data.sitemap}</p>

</div>

`


document.getElementById("suggestions").innerHTML=`

<div class="card">

<h3>SEO Suggestions</h3>

${data.suggestions}

</div>

`

}
