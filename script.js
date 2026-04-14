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

const url = document.getElementById("urlInput").value

const html = await fetchHTML(url)
const doc = parseHTML(html)

const data = analyzePage(doc)

displayResults(data)

}


function displayResults(data){

document.getElementById("summary").innerHTML = `

<div class="card">

<h3>Meta Title</h3>
<p>${data.title}</p>
<p class="${data.titleLength>70?'error':'good'}">
${data.titleLength}/70 Characters
</p>

<h3>Meta Description</h3>

<p>${data.meta}</p>
<p class="${data.metaLength>160?'error':'good'}">
${data.metaLength}/160 Characters
</p>

</div>

`


document.getElementById("headers").innerHTML = `

<div class="card">

<h3>H1 (${data.h1Count})</h3>
<ul>${data.h1List}</ul>

<h3>H2 (${data.h2Count})</h3>
<ul>${data.h2List}</ul>

<h3>H3 (${data.h3Count})</h3>
<ul>${data.h3List}</ul>

</div>

`


document.getElementById("images").innerHTML = `

<div class="card">

<h3>Images</h3>

<p>Total Images: ${data.imageCount}</p>

<p class="${data.imagesMissingAlt>0?'error':'good'}">
Missing ALT: ${data.imagesMissingAlt}
</p>

</div>

`


document.getElementById("links").innerHTML = `

<div class="card">

<h3>Links</h3>

<p>Total Links: ${data.totalLinks}</p>
<p>Internal Links: ${data.internalLinks}</p>
<p>External Links: ${data.externalLinks}</p>

</div>

`


document.getElementById("speed").innerHTML = `

<div class="card">

<h3>Page Speed Suggestions</h3>

<ul>

<li>Optimize Images</li>
<li>Minify CSS</li>
<li>Reduce JavaScript</li>
<li>Enable Caching</li>

</ul>

</div>

`

}
