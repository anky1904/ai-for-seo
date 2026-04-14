function displayResults(data){

/* SCORE */

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


/* META */

document.getElementById("meta").innerHTML=`

<div class="card">

<h3>Meta Title</h3>

<p>${data.titleHighlighted}</p>

<p class="${data.titleLength>70?'char-warning':'char-ok'}">
${data.titleLength}/70 characters
</p>

<h3>Meta Description</h3>

<p>${data.metaHighlighted}</p>

<p class="${data.metaLength>160?'char-warning':'char-ok'}">
${data.metaLength}/160 characters
</p>

</div>

`


/* HEADERS */

document.getElementById("headers").innerHTML=`

<div class="card">

<h3>Heading Structure</h3>

${data.headingStructure}

</div>

`


/* IMAGES */

document.getElementById("images").innerHTML=`

<div class="card">

<h3>Images</h3>

<p>Total Images: ${data.imageCount}</p>

<p class="alt-error">
Missing ALT Text: ${data.imagesMissingAlt}
</p>

<table>

<tr>
<th>Image URL</th>
<th>Suggested ALT</th>
</tr>

${data.imagesMissingAltList}

</table>

</div>

`


/* LINKS */

document.getElementById("links").innerHTML=`

<div class="card">

<h3>Links</h3>

<p>Total Links: ${data.totalLinks}</p>
<p>Internal Links: ${data.internalLinks}</p>
<p>External Links: ${data.externalLinks}</p>

</div>

`


/* TECHNICAL */

document.getElementById("technical").innerHTML=`

<div class="card">

<h3>Technical SEO</h3>

<p>Canonical: ${data.canonical}</p>
<p>Robots: ${data.robots}</p>
<p>Schema: ${data.schema}</p>
<p>Sitemap: ${data.sitemap}</p>

</div>

`


/* SEO SUGGESTIONS */

document.getElementById("suggestions").innerHTML=`

<div class="card">

<h3>SEO Recommendations to Reach Score 100</h3>

${data.suggestions}

</div>

`

}
