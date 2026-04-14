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
"<p>Error fetching page. Some websites block external requests.</p>";

}

}

function displayResults(data){

document.getElementById("results").innerHTML = `

<h2>SEO Report</h2>

<p><strong>Title:</strong> ${data.title || "Missing"}</p>
<p><strong>Meta Description:</strong> ${data.meta || "Missing"}</p>

<p><strong>H1 Count:</strong> ${data.h1}</p>
<p><strong>H2 Count:</strong> ${data.h2}</p>

<p><strong>Images:</strong> ${data.images}</p>

`;

}
