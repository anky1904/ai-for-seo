function openTab(evt, tabName){

document.querySelectorAll(".tab-content").forEach(tab=>{
tab.style.display="none"
})

document.querySelectorAll(".tab").forEach(btn=>{
btn.classList.remove("active")
})

document.getElementById(tabName).style.display="block"
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
SEO Score
<div class="score-number">${data.score}</div>
</div>

<div class="card">

<h3>Meta Title</h3>

<p>${data.titleHighlighted}</p>

<p class="${data.titleLength>70?'char-warning':'char-ok'}">
${data.titleLength}/70
</p>

<h3>Meta Description</h3>

<p>${data.metaHighlighted}</p>

<p class="${data.metaLength>160?'char-warning':'char-ok'}">
${data.metaLength}/160
</p>

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
Missing ALT Text: ${data.imagesMissingAlt}
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

<h3>Links</h3>

<p>Total Links: ${data.totalLinks}</p>
<p>Internal Links: ${data.internalLinks}</p>
<p>External Links: ${data.externalLinks}</p>

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

}
