let suggestions=""


if(firstHeading!=="H1"){

suggestions+=`

<div class="suggestion-card suggestion-high">

<span class="priority-badge high">High Priority</span>

<div class="suggestion-title">
Heading Structure Issue
</div>

<div>
H1 should appear first. Currently page starts with ${firstHeading}
</div>

<div class="suggestion-fix">
<strong>How to Fix:</strong><br>
Move main page title as H1 at top of page
</div>

<div class="suggestion-impact">
Impact: Improves SEO relevance and keyword targeting
</div>

</div>

`

}


if(imagesMissingAlt>0){

suggestions+=`

<div class="suggestion-card suggestion-high">

<span class="priority-badge high">High Priority</span>

<div class="suggestion-title">
Missing ALT Tags
</div>

<div>
${imagesMissingAlt} images missing ALT text
</div>

<div class="suggestion-fix">
<strong>How to Fix:</strong><br>
Add descriptive ALT text including primary keywords
</div>

<div class="suggestion-impact">
Impact: Improves image SEO and accessibility
</div>

</div>

`

}


if(titleLength>60){

suggestions+=`

<div class="suggestion-card suggestion-medium">

<span class="priority-badge medium">Medium Priority</span>

<div class="suggestion-title">
Meta Title Optimization
</div>

<div>
Meta title length should be optimized
</div>

<div class="suggestion-fix">
<strong>How to Fix:</strong><br>
Keep title between 50-60 characters
</div>

<div class="suggestion-impact">
Impact: Improves CTR from search results
</div>

</div>

`

}
