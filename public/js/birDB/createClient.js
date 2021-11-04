let photoForm = document.querySelector("#photoForm")

photoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(e.target)

})