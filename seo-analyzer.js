let suggestions=""

if(titleLength>70){
suggestions+=`<p>• Reduce Meta Title length below 70 characters</p>`
}

if(metaLength>160){
suggestions+=`<p>• Reduce Meta Description below 160 characters</p>`
}

if(imagesMissingAlt>0){
suggestions+=`<p>• Add ALT text to ${imagesMissingAlt} images</p>`
}

if(canonical=="Missing"){
suggestions+=`<p>• Add Canonical tag to avoid duplicate content</p>`
}

if(robots=="Missing"){
suggestions+=`<p>• Add Robots meta tag</p>`
}

if(schema=="Missing"){
suggestions+=`<p>• Add Schema markup for better ranking</p>`
}

if(sitemap=="Missing"){
suggestions+=`<p>• Add sitemap.xml for better indexing</p>`
}
