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

const html=await fetchHTML(url)
const doc=parseHTML(html)

const data=await analyzePage(doc,url)

displayResults(data)

}


function displayResults(data){

document.getElementById("summary").innerHTML=`

<div class="score-card">
Overall SEO Score
<div class="score-number">${data.score}</div>
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

${data.imagesMissingAltList}

</table>

</div>

`


document.getElementById("technical").innerHTML=`

<div class="card">

<h3>Technical SEO</h3>

<p>Canonical: ${data.canonical}</p>

<p>Robots: ${data.robots}</p>

<p>Schema: ${data.schema}</p>

<p>Sitemap: ${data.sitemap}</p>

</div>

`


document.getElementById("speed").innerHTML=`

<div class="card">

<h3>Page Speed</h3>

<p>${data.speed}</p>

</div>

`

}
