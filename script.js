sections = document.querySelectorAll("h2")
content = document.querySelectorAll("content-part")
h3 = document.querySelectorAll("h3")

sections.forEach((section) => {

    section.style.color = randDarkColor()

    section.addEventListener("click", () => {
        sections.forEach((section) => {
            section.nextElementSibling.classList.add("display")
        })
        if (section.nextElementSibling) {
            section.nextElementSibling.classList.toggle("display") 
        } 
    })
})



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

h3.forEach((header) => {
    header.addEventListener("click", () => {
        h3.forEach((head) => {
            head.nextElementSibling.classList.add("display") 
        })

        if (header.nextElementSibling) {
            header.nextElementSibling.classList.toggle("display") 
        } 
    })

})