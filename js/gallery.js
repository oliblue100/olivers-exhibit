    let globalImgIndex = 0;
    const globalImgArray = [];

    function switchImage(index){
        const img=document.getElementById("gallery-view-img")
        const title=document.getElementById("gallery-view-title")

        if(globalImgIndex < 0) {
            globalImgIndex = globalImgArray.length-1;
        } else if(globalImgIndex > globalImgArray.length-1)
        {
            globalImgIndex = 0;
        }

        img.setAttribute("src", globalImgArray[globalImgIndex].url);
        title.innerText=globalImgArray[globalImgIndex].title;
    }

    document.getElementById("gallery-viewer-btn-left").addEventListener("click", ()=>{
        globalImgIndex-=1;
        switchImage();
    });

    document.getElementById("gallery-viewer-btn-right").addEventListener("click", ()=>{
        globalImgIndex+=1
        switchImage();
    });

    document.getElementById("gallery-viewer-close").addEventListener("click", ()=>{
        const galViewer = document.getElementById("gallery-viewer");

        galViewer.classList.toggle("hidden");

        galViewer.addEventListener("transitionend", ()=>{
            if(galViewer.classList.contains("hidden")){
                galViewer.style.display="none";
            } else {
                return;
            }
            
        });
    })

    async function loadImage(url)
    {
        return new Promise((resolve, reject)=>{
            try
            {
                const img = new Image();
                img.src=url;
                
                img.onload = ()=>
                {
                    resolve(img)
                }
                img.onerror = () => 
                {
                    reject(new Error(`Failed to load image: ${url}`));
                }
            } catch (err)
            {
                reject(err);
            }
        })
    }

    async function generateGalleryItem(url, name, posX, posY)
    {

        const gallery_item = document.createElement("div");
        const img_container = document.createElement("div");
        const img = await loadImage(url);
        const title = document.createElement("h3");
        title.innerText=name;

        gallery_item.classList.add("gallery-item");
        img_container.classList.add("img-container");

        

        if(img.naturalWidth > img.naturalHeight)
        {
            img.classList.add("gallery-item-landscape");
        } else
        {
            img.classList.add("gallery-item-portrait");
        }

        img.style.position="relative";
        img.style.top=`${posY}px`;
        img.style.left=`${posX}px`;
        img.alt=name;

        img_container.append(img);
        gallery_item.append(img_container);
        gallery_item.append(title);
        gallery_item.classList.add("fade-in");

        return gallery_item;
    }

    async function generateAndAppendNewGalleryItem(url, name, posX, posY, index)
    {
        
        const item = await generateGalleryItem(url, name, posX, posY);
        const imgData = new Object();

        imgData.url = url;
        imgData.title = name;
    
        

        globalImgArray.push(imgData);

        console.log(globalImgArray);

        item.addEventListener("click", ()=>{
            const galView = document.getElementById("gallery-viewer");
            const galImg = document.getElementById("gallery-view-img");
            
            globalImgIndex = index;
            switchImage(index);
            galView.style.display="inline-block";

            //Review later. "void galView.offsetWidth" was needed in order to fix the CSS transition bug. Without this command, 
            // The theater will transition out, but not in. Still unsure why.
            void galView.offsetWidth;
            galView.classList.toggle("hidden");
        })

        globalImgIndex+=1;
        document.getElementById("gallery-panel").append(item);
        await delay(80);
        requestAnimationFrame(()=>{item.classList.add("visible");})
    }

    async function getJsonGalleryData(url)
    {
        const response = await fetch(url);
        if(!response.ok) throw new Error("Failed JSON read");
        return response.json();
        /*fetch("../../js/data.json")
            .then(response=>response.json())
            .then(data=>{
                resolve(data);
            }).catch(error=>{reject(error)});*/
    }

    async function populateGallery()
    {
        const gallery_json_data = await getJsonGalleryData("../../json/gallery_data.json");
        const gallery_items = gallery_json_data.galleryItems;

        if(gallery_items.length>0)
        {
            for(const item of gallery_items)
            {

                await generateAndAppendNewGalleryItem(item.src, item.name, item.positionX, item.positionY, globalImgIndex);
            }
        } else {
            console.log("No items found.");
        }
            
    }

    async function delay(ms){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            },ms)
        });
    }

    async function initCode()
    {
        await populateGallery();
        
    }

    
    initCode();

    //generateAndAppendNewGalleryItem("../../images/art/doodle5.PNG");
    //document.getElementById("gallery-panel").append(test);
