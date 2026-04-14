function openTab(evt, tabName){

const tabcontent = document.querySelectorAll(".tab-content");

tabcontent.forEach(el=>{
el.style.display="none"
})

const tabs = document.querySelectorAll(".tab")

tabs.forEach(el=>{
el.classList.remove("active")
})

document.getElementById(tabName).style.display="block"

if(evt){
evt.currentTarget.classList.add("active")
}

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

openTab(null,"meta")

}


function displayResults(data){

document.getElementById("seoScore").innerHTML=`

<div class="score-wrapper">

<div class="score-number">${data.score}/100</div>

</div>
`



document.getElementById("meta").innerHTML=`

<div class="card">

<h3>Meta Title</h3>

<p>${data.titleHighlighted}</p>

<h3>Meta Description</h3>

<p>${data.metaHighlighted}</p>

</div>

`


document.getElementById("headers").innerHTML=`

<div class="card">

${data.headingStructure}

</div>

`


document.getElementById("images").innerHTML=`

<div class="card">

<p class="alt-error">
Missing ALT: ${data.imagesMissingAlt}
</p>

<table>

${data.imagesMissingAltList}

</table>

</div>

`


document.getElementById("links").innerHTML=`

<div class="card">

Total Links: ${data.totalLinks}

</div>

`


document.getElementById("technical").innerHTML=`

<div class="card">

Canonical: ${data.canonical}

</div>

`


document.getElementById("suggestions").innerHTML=`

<div class="card">

${data.suggestions}

</div>

`

}
