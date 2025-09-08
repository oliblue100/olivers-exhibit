import runGalleryCode from './gallery.js';
const page = window.PAGE;
const base = window.ELEVENTY_BASE || '/';
document.addEventListener("DOMContentLoaded", () => {
    const x = document.getElementsByClassName("button");
    for (const item of x) {
        const btn = item;
        if (btn.dataset.buttontype === "back") {
            item.addEventListener("click", () => {
                window.history.back();
            });
        }
    }
});
const NavHTML = `
      <div class="nav-container">
      <a class="button" style="position:absolute;left:24px;top:24px;" data-BUTTONTYPE="back">Go back</a>
      <button class="nav-mobile-btn" class="">=</button>
      <div class="nav-list-container hide">
        <ul class="nav-ul">
          <li><a href="${base}">Home</a></li>
          <li><a href="${base}pages/gallery" id="blog-link">The Gallery</a></li>
          <li><a href="${base}pages/coollinks">Cool Links</a></li>
          <li><a href="${base}pages/projects">Projects</a></li>
          <li><a href="${base}pages/about">About</a></li>
        </ul>
      </div>
      `;
const NavInsertElement = document.querySelector('[data-insert="oe-nav"]');
NavInsertElement.innerHTML = NavHTML;
let isDropped = false;
const OENav = document.querySelector(".nav-container");
const NavMobileBtn = OENav.querySelector(".nav-mobile-btn");
const NavDropdown = OENav.querySelector(".nav-list-container");
async function toggleDropdown() {
    if (isDropped) {
        NavDropdown.classList.remove("show");
        await delay(120);
        NavDropdown.classList.add("hide");
        isDropped = false;
    }
    else {
        NavDropdown.classList.add("show");
        isDropped = true;
        NavDropdown.classList.remove("hide");
    }
}
NavMobileBtn.addEventListener("click", () => {
    toggleDropdown();
});
async function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(0);
        }, ms);
    });
}
if (page === "gallery") {
    const linkBlock = document.createElement("link");
    const htmlHead = document.getElementsByTagName("head");
    linkBlock.setAttribute("type", "text/css");
    linkBlock.setAttribute("rel", "stylesheet");
    linkBlock.setAttribute("href", `${base}css/gallery.css`);
    for (const item of htmlHead) {
        //item.appendChild(styleBlock);
        //item.append(linkBlock);
    }
    runGalleryCode();
}
//unused code, but reference for later. instanceof can check the constructor of an element
/*for (const item of x)
{
    if(item instanceof HTMLButtonElement)
    {
        //code
    } else if (item instanceof HTMLDivElement)
    {
        //code
    } else {

    }

    You can also use tag name:

    for (const item of x) {
        switch (item.tagName) {
            case "BUTTON":
                console.log("Button found");
                break;
            case "DIV":
                console.log("Div found");
                break;
            default:
                console.log("Other:", item.tagName);
        }
}*/
