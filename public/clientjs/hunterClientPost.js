let headerUsername = document.querySelector('#header-username')
let collapseUsername = document.querySelector('#collapse-username')
let commentsUl = document.querySelector('.comments-list')
let container = document.querySelector('.container')


let commentForm = document.querySelector('#comment-form');
let postDiv = document.querySelector('.single-post');
let postID = post.id


let input = document.querySelector('#contents')
let headers = {"Content-type": "application/json; charset=UTF-8"}

let ul = document.querySelector('.comments-list')

// const buildPage = () => {
//     let htmlBlock = `
//     <div class="row">
//     <div class="col-sm-8">
//         <article class="mb80">
//             <div class="single-post" id='<%= post.id %>'>

//             </div>

//                 <!-- post-author -->
//             <div class="post-comments-area padding-top80">
//                 <h3 class="sub-title padding-bottom50"> Comments [<%= comments.length %>]</h3>
//                 <ul class="comments-list">

//                 </ul>
//             </div><!-- /.post-comments-area -->
//                 <div id="leave-comment" class="pb80">
//                     <div class="cdf-title mb30">
//                         <h2>LEAVE A REPLY</h2>
//                     </div>
//                     <form action="/post/<%= post.id %>" method="post" id="comment-form" name="comment-form">
//                         <div class="contact-form-inner mb80">
//                             <div class="row">
//                                 <div class="contact-form-field col-md-12">
//                                 <textarea id="contents" rows="5" placeholder="Type your message...." name="contents" type="contents"></textarea>
//                                     <div class="cdf-btn cdf-btn-one submit">
//                                         <button type="submit">SEND MESSAGE</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//         </article>
//         </div>
//         <div class="col-sm-4">
//             <div class="side-bar">
//                 <div class="search side-bar-widget">
//                     <form action="#" method="get" class="side-bar-search newsletter">
//                         <input type="text" class="" placeholder="Search">
//                         <button type="submit"><i class="icon_search"></i></button>
//                     </form>
//                 </div>
//                 <%- include ('partials/followingSkeleton.ejs') %>
//                 <%- include ('partials/recentSkeleton.ejs') %>
//             </div>
//         </div>
//     </div>
// </div>
//     `
//     container.innerHTML = htmlBlock
// }


const buildPost = (records) => {
    console.log('post');
    let htmlBlock = `
    <div class="cdf-image mb40 img-effect-1">
        <img src="/img/blog/blog-single-image.jpg" alt="">
        <figcaption></figcaption>
    </div>
    <div class="cdf-single-meta ul-li mb15">
        <ul>
            <li class="admin"><strong>Written</strong> by <%= postUsername %> </li>
            <li class="post-time">${records.date.month} - ${records.date.day}</li>  
    `
    if (records.postUsername == records.username) {
        htmlBlock += `
            <li>
                <button class="button btn" type='submit'>
                    <span>
                        <i id='${records.post.id}' class="fas fa-trash"></i>
                    </span>
                </button>
            </li>
        `
    }
    htmlBlock += `
        </ul>
    </div>
    <div class="cdf-title mb20">
        <h2><a href="#">${records.post.title}</a></h2>
    </div>
    <div class="cdf-text">
        <p>Common Name: ${records.post.commonName}</p>
        <p>Scientific Name: ${records.post.scientificName}</p>
        <p>Location: ${records.post.location}</p>
        <p>Temperature: ${records.post.temperature}</p>
        <p>Precipitation: ${records.post.precipitation}</p>
        <p>Cloud Cover: ${records.post.cloudCover}</p>
        <p>Observations: ${records.post.observation}</p>
    </div>
    `
    postDiv.innerHTML = htmlBlock
}

const buildComments = (records) => {
    console.log('comments');
    let htmlBlock = ''
    for( let i = 0; i < records.comments.length; i++ ) {
        htmlBlock += `
        <li class="parent">
            <div class="comments-img">
                <img class="img-responsive" src="/img/blog/author.jpg" alt="Post Iamge">
            </div>
            <div class="comments-txt dark-bg content-box">
                <div class="author mb10">
                    <a href="#" class="">${records.comments[i].username}  </a> 
                    <span> ${records.commentDates[i].month} - ${records.commentDates[i].day}   </span>
                </div>
                <p id='${records.comments[i].id}' class="comments-contents">${records.comments[i].contents} </p>
        `
        if (records.username == records.comments[i].username) {
            htmlBlock += `
            <div  class="col-2 text-right pr-2">
                    <button class="button btn" type='submit'>
                        <span>
                            <i id='${records.comments[i].id}' class="fas fa-trash"></i>
                        </span>
                    </button>
                <button  class="button btn">
                    <span>
                        <i id='${records.comments[i].id}' class="fas fa-pencil-alt"></i>
                    </span>
                </button>
            </div>
                `
        } else {
            htmlBlock += `
            <a href="#" class="reply mt20"><i class="arrow_back"></i></a>
            `
        }
        htmlBlock += `
        </div>
    </li>
        `
    }
    commentsUl.innerHTML = htmlBlock
}

const initPost = async () => {
    let results = await fetch(`/post/${postID}`);
    let records = await results.json();
    buildPost(records)
    buildComments(records)
}












ul.addEventListener('click', async (e) => {
    if(e.target.className === 'fas fa-trash'){
        let id = e.target.id;
        fetch(`/post/${postID}/${id}`, {
            method: "DELETE",
            headers
        })
    }

})
post.addEventListener('click', async (e) => {
    if(e.target.className === 'fas fa-trash'){
        let id = e.target.id;
        let result = await fetch(`/post/${postID}`, {
            method: "DELETE",
            headers
        })
    }
})

