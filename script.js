function openTab(evt,tabName){

document.querySelectorAll(".tab-content")
.forEach(tab=>{
tab.style.display="none"
})

document.querySelectorAll(".tab")
.forEach(tab=>{
tab.classList.remove("active")
})

document.getElementById(tabName).style.display="block"
evt.currentTarget.classList.add("active")

}


async function analyzeSEO(){

const url=document.getElementById("urlInput").value

if(!url){
alert("Enter URL")
return
}

const html=await fetchHTML(url)
const doc=parseHTML(html)

const data=await analyzePage(doc,url)

displayResults(data)

document.querySelector(".tab").click()

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

<h3>Meta Title</h3>
<p>${data.title}</p>

<h3>Meta Description</h3>
<p>${data.meta}</p>

`


document.getElementById("headers").innerHTML=data.headingStructure


document.getElementById("images").innerHTML=`

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

`


document.getElementById("links").innerHTML=`

<p>Total Links: ${data.totalLinks}</p>
<p>Internal Links: ${data.internalLinks}</p>
<p>External Links: ${data.externalLinks}</p>

`


document.getElementById("technical").innerHTML=`

<p>Canonical: ${data.canonical}</p>
<p>Robots: ${data.robots}</p>
<p>Schema: ${data.schema}</p>
<p>Sitemap: ${data.sitemap}</p>

`


document.getElementById("suggestions").innerHTML=data.suggestions

}
