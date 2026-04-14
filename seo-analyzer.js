async function fetchHTML(url){

if(!url.startsWith("http")){
url = "https://" + url;
}

const proxy = "https://corsproxy.io/?";

const response = await fetch(proxy + encodeURIComponent(url));
const html = await response.text();

return html;

}

function parseHTML(html){

const parser = new DOMParser();
return parser.parseFromString(html, "text/html");

}

function analyzePage(doc){

const title = doc.querySelector("title")?.innerText;
const meta = doc.querySelector('meta[name="description"]')?.content;

const h1 = doc.querySelectorAll("h1");
const h2 = doc.querySelectorAll("h2");
const h3 = doc.querySelectorAll("h3");

let h1List = "";
let h2List = "";
let h3List = "";

h1.forEach(el => h1List += `<li>${el.innerText}</li>`);
h2.forEach(el => h2List += `<li>${el.innerText}</li>`);
h3.forEach(el => h3List += `<li>${el.innerText}</li>`);

let suggestions = "";

if(!title){
suggestions += "<li>Missing Meta Title</li>";
}

if(title && title.length > 70){
suggestions += "<li>Meta title too long</li>";
}

if(!meta){
suggestions += "<li>Missing meta description</li>";
}

if(meta && meta.length > 160){
suggestions += "<li>Meta description too long</li>";
}

if(h1.length === 0){
suggestions += "<li>Missing H1 tag</li>";
}

if(h1.length > 1){
suggestions += "<li>Multiple H1 tags found</li>";
}

return {

title,
meta,

h1Count: h1.length,
h2Count: h2.length,
h3Count: h3.length,

h1List,
h2List,
h3List,

suggestions

};

}
