const headers = { "Content-type": "application/json; charset=UTF-8" };
const searchInput = document.querySelector(".searchInput");
const searchForm = document.getElementById("searchForm");
console.log(`Search Input: ${searchInput}`);
console.log(`Search Form: ${searchForm}`);
let searchString = searchInput.value;

// method: "get" to "/search"
// add event listener to search form --> event: 'submit'
searchForm.addEventListener("submit", async (e) => {
// in form event listener:
    // prevent default
    // obtain value from search input
    // send back via body as "searchString"
    // e.preventDefault();

    // console.log(searchString);
    await fetch(`/search/${searchInput.value}`, {
        method: "GET",
        headers: headers
        // body: {search: searchInput.value}
    });
    // }).then(window.location.assign(`/search/${searchString}`));



});



