onload = function () {
    let post_status = new URLSearchParams(location.search).get("post_status");
    if (post_status) {
        if (post_status == "success") {
            window.alert("Thank you for your feedback ðŸ˜„")
            this.location.assign(this.location.origin + this.location.pathname + '?post_status=POST_REDIRECT')
        }
        else if(post_status == "POST_REDIRECT") {
            changer("article5", false)
        }
        else {
            window.alert("Something went wrong when trying to submit your feedback:\n" + post_status.toString())
            this.location.assign(this.location.origin + this.location.pathname + '?post_status=POST_REDIRECT')
        }
    }
    else {
        document.body.style.overflowY = 'hidden'
        document.body.style.overflowX = 'hidden'
    }
}

//Create Load Effect
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let parallax_titles = Array.from(document.querySelectorAll(".title"))
const init_wait_time = 1.5 * 1000
let counter_wait_time = 2 * 1000
const back_to_top_btn = document.querySelector('.back-to-top')
window.setTimeout(() => {
    back_to_top_btn.classList.add("back-to-top-fadein")
    back_to_top_btn.classList.remove("back-to-top")
    document.body.style.overflowY = "scroll"
    determine_next_scroll()
    window.bttbtn_shown = true
}, init_wait_time + (counter_wait_time * parallax_titles.length))

for (let i = 0; i < parallax_titles.length; i++) {
    const title = parallax_titles[i];
    window.setTimeout(
        () => {
            title.classList.remove("title")
            title.classList.add("parallax-area-loaded")
        },
        init_wait_time + (counter_wait_time * i)
    )
}

//Create Typewriter Effect
function typewrite(node, counter) {
    try {
        var txt = node.dataset.text
        let speed = 2000 / txt.length;
        if (counter < txt.length) {
            node.innerHTML = txt.slice(0, counter).replaceAll("\\n", "<br>").replaceAll("\\", "") + "â”ƒ"
            setTimeout(typewrite.bind(node, node, ++counter), speed);
        }
        else {
            let ss = node.innerHTML.replace("â”ƒ", txt.at(-1))
            node.innerHTML = ss
            return
        }
    } catch (_) { }
}

typewriter_callback = async function (entries) {
    for (const entry of entries) {
        with (entry) {
            if (isIntersecting && intersectionRatio >= 75 / 100) {
                typewrite(target, window[`typewrite_${num_typewrites_processed++}`])
                observer.unobserve(target)
            }
        }
    }
}

let typewriter_intersector_options = {
    rootMargin: '0px',
    threshold: 0.8
}
var num_typewrites_processed = 0;
observer = new IntersectionObserver(typewriter_callback, typewriter_intersector_options)
let to_typewrite = Array.from(document.querySelectorAll(".typewrite"))
for (let i = 0, l = to_typewrite.length; i < l; i++) {
    const element = to_typewrite[i];
    window[`typewrite_${i}`] = 0
    observer.observe(element)
}

//Change Bottom Button Behavior

let scrolled = false
let changer = function (hash, go = true) {
    document.querySelector('#' + hash.toString()).scrollIntoView({ behavior: (go ? 'smooth' : "auto"), block: "center", inline: "center" })
    if (go) determine_next_scroll()
}
let curr = ""
function determine_next_scroll() {
    let bttbtn = document.querySelector(".back-to-top-fadein") ?? eval("throw new Error")
    if (curr === "footer") {
        bttbtn.children[0].classList.replace("down", "up")
        curr = "article1"
    }
    else if (curr.match(/footer|article[0-9]/i)) {
        bttbtn.children[0].classList.replace("up", "down")
        let article_n = parseInt(curr.at(-1))
        let articles = Array.from(document.querySelectorAll("article"))
        if (!(article_n >= articles.length)) {
            curr = `article${article_n + 1}`
        }
        else {
            curr = "footer"
        }
    }
    else {

        bttbtn.children[0].classList.replace('up', 'down')
        curr = "article2"
    }
    bttbtn.onclick = changer.bind(null, curr)
    return 1
}
// Help create background scrolling effect

window.onscroll = () => {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    let offset = (document.querySelector(".parallax-area").scrollTop - document.querySelector(".nav-container").scrollTop - document.querySelector("footer").scrollTop) * 2
    let computed_scroll = (-1 * (scrollTop - offset))
    document.documentElement.style.setProperty("--bg-pos", `${computed_scroll.toString()}px`)
}

//form validator

function validate_form(form) {
    let inputs = form.querySelectorAll('input')
    let name = inputs[0]
    let email = inputs[1]
    let feedback = form.querySelector('textarea')
    //check name element
    if (name.value.length > parseInt(name.getAttribute('maxLength'))) {
        window.alert("name is too big")
        return false
    }
    if (name.value.length < parseInt(name.getAttribute('minLength'))) {
        window.alert("name is too small")
        return false
    }
    let alphanumericizer = /[^a-zA-Z0-9]+/g
    if (name.value.trim().replace(alphanumericizer, "") != name.value.trim()) {
        window.alert("name can only be alphanumerical")
        return false
    }

    //validate e-mail element
    if (email.value.trim() == "") return true;
    if (email.value.length > email.getAttribute('maxLength')) {
        window.alert("e-mail is too big")
        return false
    }
    if (email.value.length < email.getAttribute('minLength')) {
        window.alert("e-mail is too small")
        return false
    }

    let is_email = new RegExp("^[^\\s@]+@[^\\s@]+\.[^\\s@]+$")
    if (!is_email.test(email.value.trim())) {
        return window.confirm("Couldn't validate e-mail; Sumbit anyway?")
    }
}