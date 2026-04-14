async function analyzeSEO(){

const url = document.getElementById("urlInput").value;

const html = await fetchHTML(url);

const doc = parseHTML(html);

const data = analyzePage(doc);

displayResults(data);

}

function displayResults(data){

document.getElementById("results").innerHTML = `

<h2>SEO Report</h2>

<p><strong>Title:</strong> ${data.title}</p>
<p><strong>Meta Description:</strong> ${data.meta}</p>

<p><strong>H1 Count:</strong> ${data.h1}</p>
<p><strong>H2 Count:</strong> ${data.h2}</p>

<p><strong>Images:</strong> ${data.images}</p>

`;

}
