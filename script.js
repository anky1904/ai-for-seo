function openTab(evt, tabName){

document.querySelectorAll(".tab-content").forEach(tab=>{
tab.classList.remove("active")
})

document.querySelectorAll(".tab").forEach(btn=>{
btn.classList.remove("active")
})

document.getElementById(tabName).classList.add("active")
evt.currentTarget.classList.add("active")

}


async function analyzeSEO(){

const url=document.getElementById("urlInput").value

if(!url){
alert("Enter URL")
return
}

try{

const html=await fetchHTML(url)
const doc=parseHTML(html)

const data=await analyzePage(doc,url)

displayResults(data)

}catch(e){

alert("Error analyzing website")

}

}


function displayResults(data){

// SUMMARY

document.getElementById("summary").innerHTML=`

<div class="score-card">
Overall SEO Score
<div class="score-number">${data.score || "N/A"}</div>
</div>

<div class="card">

<h3>Meta Title</h3>
<p>${data.title}</p>
<p>${data.titleLength}/70</p>

<h3>Meta Description</h3>
<p>${data.meta}</p>
<p>${data.metaLength}/160</p>

</div>

`


// HEADERS

document.getElementById("headers").innerHTML=`

<div class="card">

<h3>Heading Structure</h3>

<h4>H1 (${data.h1Count})</h4>
<ul>${data.h1List}</ul>

<h4>H2 (${data.h2Count})</h4>
<ul>${data.h2List}</ul>

<h4>H3 (${data.h3Count})</h4>
<ul>${data.h3List}</ul>

</div>

`


// IMAGES

document.getElementById("images").innerHTML=`

<div class="card">

<h3>Images</h3>

<p>Total Images: ${data.imageCount}</p>

<p class="error">Missing ALT: ${data.imagesMissingAlt}</p>

<table>
<tr>
<th>Image</th>
<th>Suggested ALT</th>
</tr>

${data.imagesMissingAltList || "<tr><td colspan='2'>No missing ALT</td></tr>"}

</table>

</div>

`


// LINKS

document.getElementById("links").innerHTML=`

<div class="card">

<h3>Links</h3>

<p>Total Links: ${data.totalLinks}</p>
<p>Internal Links: ${data.internalLinks}</p>
<p>External Links: ${data.externalLinks}</p>

</div>

`


// TECHNICAL

document.getElementById("technical").innerHTML=`

<div class="card">

<h3>Technical SEO</h3>

<p><strong>Canonical:</strong> ${data.canonical}</p>
<p><strong>Robots:</strong> ${data.robots}</p>
<p><strong>Schema:</strong> ${data.schema}</p>
<p><strong>Sitemap:</strong> ${data.sitemap}</p>

</div>

`


// PAGE SPEED

document.getElementById("speed").innerHTML=`

<div class="card">

<h3>Page Speed</h3>

<p><strong>Performance Score:</strong> ${data.speed}</p>

</div>

`

}
