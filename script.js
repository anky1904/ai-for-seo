async function analyzeSEO() {

const url = document.getElementById("urlInput").value;

if(!url){
alert("Enter URL");
return;
}

const html = await fetchHTML(url);
const doc = parseHTML(html);
const data = analyzePage(doc);

displayResults(data);

}

function displayResults(data){

let score = 100;

if(data.titleMissing) score -= 15;
if(data.titleLong) score -= 10;
if(data.metaMissing) score -= 15;
if(data.metaLong) score -= 10;
if(data.h1Missing) score -= 15;
if(data.multipleH1) score -= 10;

if(score < 0) score = 0;

document.getElementById("results").innerHTML = `

<div class="card">

<div class="score">SEO Score: ${score}/100</div>

<div class="progress">
<div class="progress-bar" style="width:${score}%"></div>
</div>

</div>

<div class="card">

<h2>Meta Title</h2>

<p class="${data.titleLong ? 'error':'good'}">
${data.title}
</p>

<p>Characters: ${data.titleLength}/70</p>

</div>

<div class="card">

<h2>Meta Description</h2>

<p class="${data.metaLong ? 'error':'good'}">
${data.meta}
</p>

<p>Characters: ${data.metaLength}/160</p>

</div>

<div class="card">

<h2>Heading Structure</h2>

<h3>H1 (${data.h1Count})</h3>
<ul>${data.h1List}</ul>

<h3>H2 (${data.h2Count})</h3>
<ul>${data.h2List}</ul>

<h3>H3 (${data.h3Count})</h3>
<ul>${data.h3List}</ul>

</div>

<div class="card">

<h2>SEO Suggestions</h2>

<ul>${data.suggestions}</ul>

</div>

`;

}
