h2s = document.querySelectorAll("h2")
content_titles = document.querySelectorAll(".content-title h3")
content_details = document.querySelectorAll(".content-details")
h3s = document.querySelectorAll("h3")

hideContent()

h2s.forEach((h2) => {
    h2.style.color = randDarkColor()
    h2.addEventListener("click", () => {  
        if (h2.nextElementSibling.classList.contains("do-not-display")) {
            hideContent()
            hideDetails()
        }
        
        
        h2.nextElementSibling.classList.toggle("do-not-display")
    })
 })


 content_titles.forEach((title) => {
     title.addEventListener("click", () => {
        if (title.nextElementSibling.classList.contains("do-not-display")) {
            hideDetails()
        }
        
        title.nextElementSibling.classList.toggle("do-not-display")
     })
 })

function hideContent() {
    content_titles.forEach((title) => {
        title.nextElementSibling.classList.add("do-not-display")
    })
}

function hideDetails() {
    content_details.forEach((detail) => {
        detail.classList.add("do-not-display")
    })
}

function randDarkColor() {
    var lum = -0.25;
    var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var rgb = "#",
        c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}