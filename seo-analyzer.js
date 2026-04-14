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

const title = doc.querySelector("title")?.innerText || "Missing";
const meta = doc.querySelector('meta[name="description"]')?.content || "Missing";

const titleLength = title.length;
const metaLength = meta.length;

const h1 = doc.querySelectorAll("h1");
const h2 = doc.querySelectorAll("h2");
const h3 = doc.querySelectorAll("h3");

let h1List="";
let h2List="";
let h3List="";

h1.forEach(el=> h1List += `<li>${el.innerText}</li>`);
h2.forEach(el=> h2List += `<li>${el.innerText}</li>`);
h3.forEach(el=> h3List += `<li>${el.innerText}</li>`);

let suggestions="";

const titleMissing = title === "Missing";
const titleLong = titleLength > 70;

const metaMissing = meta === "Missing";
const metaLong = metaLength > 160;

const h1Missing = h1.length === 0;
const multipleH1 = h1.length > 1;

if(titleMissing) suggestions += "<li>Missing Meta Title</li>";
if(titleLong) suggestions += "<li>Meta Title too long</li>";
if(metaMissing) suggestions += "<li>Missing Meta Description</li>";
if(metaLong) suggestions += "<li>Meta Description too long</li>";
if(h1Missing) suggestions += "<li>Missing H1</li>";
if(multipleH1) suggestions += "<li>Multiple H1 tags</li>";

return {

title,
meta,

titleLength,
metaLength,

titleMissing,
titleLong,
metaMissing,
metaLong,
h1Missing,
multipleH1,

h1Count:h1.length,
h2Count:h2.length,
h3Count:h3.length,

h1List,
h2List,
h3List,

suggestions

};

}
