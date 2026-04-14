async function analyzeSEO() {

const url = document.getElementById("urlInput").value;

if(!url){
alert("Please enter URL");
return;
}

try {

const html = await fetchHTML(url);
const doc = parseHTML(html);
const data = analyzePage(doc);

displayResults(data);

} catch(error){

document.getElementById("results").innerHTML = 
"<p>Error fetching page.</p>";

}

}

function displayResults(data){

const titleLength = data.title ? data.title.length : 0;
const metaLength = data.meta ? data.meta.length : 0;

const titleColor = titleLength > 70 ? "red" : "green";
const metaColor = metaLength > 160 ? "red" : "green";

document.getElementById("results").innerHTML = `

<h2>SEO Audit Report</h2>

<h3>Meta Title</h3>
<p style="color:${titleColor}">
${data.title || "Missing"} 
<br>
Characters: ${titleLength}/70
</p>

<h3>Meta Description</h3>
<p style="color:${metaColor}">
${data.meta || "Missing"}
<br>
Characters: ${metaLength}/160
</p>

<h3>Heading Structure</h3>

<p><strong>H1:</strong> ${data.h1Count}</p>
<ul>${data.h1List}</ul>

<p><strong>H2:</strong> ${data.h2Count}</p>
<ul>${data.h2List}</ul>

<p><strong>H3:</strong> ${data.h3Count}</p>
<ul>${data.h3List}</ul>

<h3>SEO Suggestions</h3>
<ul>
${data.suggestions}
</ul>

`;

}
