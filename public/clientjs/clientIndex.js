// let postsDiv = document.querySelector('#append-posts')


// const initBlogs = async () => {
//     console.log('init');
//     let results = await fetch('/blogs');
//     let blogs = await results.json();
//     listBlogs(blogs)
// }

// const listBlogs = (records) => {
//     console.log('list blogs');
//     let htmlBlock = ''
//     records.forEach((blogObj) => {
//         htmlBlock +=`
//         <article class="mb80">
//             <div class="cdf-post relative pl70">
//                 <div class="cdf-image"><img src="" alt="">
//                     <div class="cdf-meta">
//                         <ul class="post-meta">
//                             <li><a href="#">day ${blogObj.createdAt}</a><span>month ${blogObj.createdAt}</span></li>
//                             <li><a href="#"><img src="/img/icons/Comments.png" alt=""> </a><span>09</span></li>
//                             <li><a href="#"><img src="/img/icons/like.png" alt=""> </a><span>${blogObj.likes}</span></li>
//                         </ul>
//                     </div>
//                 </div>
//                 <div class="cdf-content pt20 pl50">
//                     <div class="cdf-title mb15"><h2><a href="#">${blogObj.title}</a></h2></div>
//                     <div class="cdf-text"><p>${blogObj.user.username}</p></div>

//                     <div class="cdf-btn cdf-btn-one mt20"><a href="/post/${blogObj.id}">read more</a></div>
//                 </div>
//             </div>
//         </article>
//         `
//     })
//     postsDiv.innerHTML = htmlBlock;
// }
// //image source needed above for bird pic. kept causing 404

// initBlogs()