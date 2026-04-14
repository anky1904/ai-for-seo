async function fetchHTML(url){

const proxy = "https://api.allorigins.win/raw?url=";

const response = await fetch(proxy + encodeURIComponent(url));

const text = await response.text();

return text;

}

function parseHTML(html){

const parser = new DOMParser();
return parser.parseFromString(html, "text/html");

}

function analyzePage(doc){

const title = doc.querySelector("title")?.innerText;
const meta = doc.querySelector('meta[name="description"]')?.content;

const h1 = doc.querySelectorAll("h1").length;
const h2 = doc.querySelectorAll("h2").length;
const images = doc.querySelectorAll("img").length;

return {

title,
meta,
h1,
h2,
images

};

}
