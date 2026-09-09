const btn=document.getElementById("openBtn");

const cover=document.getElementById("cover");

const site=document.getElementById("website");

const music=document.getElementById("music");

btn.onclick=function(){

    cover.classList.add("hide");

    site.style.display="block";

    music.play();

}
