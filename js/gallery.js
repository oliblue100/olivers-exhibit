let globalImgIndex = 0;
const globalImgArray = [];
const base = window.ELEVENTY_BASE || '/';
function switchImage() {
    const img = document.getElementById("gallery-view-img");
    const title = document.getElementById("gallery-view-title");
    if (globalImgArray.length === 0)
        return;
    if (globalImgIndex < 0) {
        globalImgIndex = globalImgArray.length - 1;
    }
    else if (globalImgIndex > globalImgArray.length - 1) {
        globalImgIndex = 0;
    }
    const currentImage = globalImgArray[globalImgIndex];
    if (!currentImage)
        return;
    img.setAttribute("src", currentImage.url);
    title.innerText = currentImage.title;
}
let galleryViewerBtnLeft;
let galleryViewerBtnRight;
let galleryViewerBtnClose;
async function loadImage(url) {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                resolve(img);
            };
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${url}`));
            };
        }
        catch (err) {
            reject(err);
        }
    });
}
async function generateGalleryItem(url, name, posX, posY) {
    const gallery_item = document.createElement("div");
    const img_container = document.createElement("div");
    const img = await loadImage(url);
    const title = document.createElement("h3");
    title.innerText = name;
    gallery_item.classList.add("gallery-item");
    img_container.classList.add("img-container");
    if (img.naturalWidth > img.naturalHeight) {
        img.classList.add("gallery-item-landscape");
    }
    else {
        img.classList.add("gallery-item-portrait");
    }
    img.style.position = "relative";
    img.style.top = `${posY}px`;
    img.style.left = `${posX}px`;
    img.alt = name;
    img_container.append(img);
    gallery_item.append(img_container);
    gallery_item.append(title);
    gallery_item.classList.add("fade-in");
    return gallery_item;
}
async function generateAndAppendNewGalleryItem(url, name, posX, posY, index) {
    const item = await generateGalleryItem(url, name, posX, posY);
    //const imgData = new Object();
    const imgData = {
        url: url,
        title: name
    };
    globalImgArray.push(imgData);
    item.addEventListener("click", () => {
        const galView = document.getElementById("gallery-viewer");
        const galImg = document.getElementById("gallery-view-img");
        globalImgIndex = index;
        switchImage();
        galView.style.display = "inline-block";
        //Review later. "void galView.offsetWidth" was needed in order to fix the CSS transition bug. Without this command, 
        // The theater will transition out, but not in. Still unsure why.
        void galView.offsetWidth;
        galView.classList.toggle("hidden");
    });
    globalImgIndex += 1;
    document.getElementById("gallery-panel").append(item);
    await delay(80);
    requestAnimationFrame(() => { item.classList.add("visible"); });
}
async function getJsonGalleryData(url) {
    const response = await fetch(url);
    if (!response.ok)
        throw new Error("Failed JSON read");
    return response.json();
    /*fetch("../../js/data.json")
        .then(response=>response.json())
        .then(data=>{
            resolve(data);
        }).catch(error=>{reject(error)});*/
}
async function populateGallery() {
    const gallery_json_data = await getJsonGalleryData(`${base}/assets/data/gallery_data.json`);
    const gallery_items = gallery_json_data.galleryItems;
    if (gallery_items.length > 0) {
        for (const item of gallery_items) {
            item.src = `${base}` + item.src;
            await generateAndAppendNewGalleryItem(item.src, item.name, item.positionX, item.positionY, globalImgIndex);
        }
    }
    else {
        console.log("No items found.");
    }
}
async function createGalleryViewer() {
    const InsertElement = document.querySelector('[data-insert="oe-gallery-nav"]');
    const GalleryNavigatorHTML = `<div id="gallery-viewer" class="hidden" style="display:none;">
                <div id="gallery-viewer-close" style="position: fixed;font-size: 2rem;right:15px;top:15px;">X</div>
                <div id="gallery-viewer-nav">
                    <div class="gallery-viewer-btn">
                        <button id="gallery-viewer-btn-left">&lt;</button>
                    </div>
                    <div style="flex-direction:column;display:flex;justify-content: center;align-items: center;">
                        <img id="gallery-view-img" src="/olivers-exhibit/assets/images/art/doodle1.JPG" style="height:auto;width:500px;">
                        <h1 id="gallery-view-title" style="font-size: 1.5rem;">Title</h1>
                    </div>
                    <div class="gallery-viewer-btn">
                        <button id="gallery-viewer-btn-right">&gt;</button>
                    </div>
                </div>
            </div>`;
    InsertElement.innerHTML = GalleryNavigatorHTML;
}
async function createGalleryContainer() {
    const MainContainer = document.createElement("div");
    const GalleryTitle = document.createElement("div");
    const GalleryContainer = document.createElement("div");
    MainContainer.classList.add("main-container");
    MainContainer.style.justifyContent = "start";
    GalleryTitle.style.display = "flex";
    GalleryTitle.style.alignItems = "center";
    GalleryTitle.style.justifyContent = "center";
    GalleryTitle.style.width = "80%";
    GalleryTitle.style.height = "100%";
    GalleryTitle.innerHTML = "<h1>The Gallery</h1>";
    GalleryContainer.id = "gallery-panel";
    GalleryContainer.classList.add("gallery-panel");
    MainContainer.append(GalleryTitle);
    MainContainer.append(GalleryContainer);
    return MainContainer;
}
async function insertGalleryContainer() {
    const InsertElement = document.querySelector('[data-insert="oe-gallery"]');
    const NewGalleryElement = await createGalleryContainer();
    InsertElement.append(NewGalleryElement);
}
async function initGlobalVariables() {
    galleryViewerBtnLeft = document.getElementById("gallery-viewer-btn-left");
    galleryViewerBtnRight = document.getElementById("gallery-viewer-btn-right");
    galleryViewerBtnClose = document.getElementById("gallery-viewer-close");
    if (galleryViewerBtnLeft != null) {
        galleryViewerBtnLeft.addEventListener("click", () => {
            globalImgIndex -= 1;
            switchImage();
        });
    }
    if (galleryViewerBtnRight != null) {
        galleryViewerBtnRight.addEventListener("click", () => {
            globalImgIndex += 1;
            switchImage();
        });
    }
    if (galleryViewerBtnClose != null) {
        galleryViewerBtnClose.addEventListener("click", () => {
            const galViewer = document.getElementById("gallery-viewer");
            if (galViewer != null) {
                galViewer.classList.toggle("hidden");
                galViewer.addEventListener("transitionend", () => {
                    if (galViewer.classList.contains("hidden")) {
                        galViewer.style.display = "none";
                    }
                    else {
                        return;
                    }
                });
            }
        });
    }
    ;
}
async function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(0);
        }, ms);
    });
}
export default async function initCode() {
    await createGalleryViewer();
    await initGlobalVariables();
    await insertGalleryContainer();
    await populateGallery();
}
//generateAndAppendNewGalleryItem("../../images/art/doodle5.PNG");
//document.getElementById("gallery-panel").append(test);
