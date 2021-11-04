let postDiv = document.querySelector('#append-post')


const initPost = async () => {
    console.log('init');
    let results = await fetch('/post/:id');
    let post = await results.json();
    buildPost(post)
}

const buildPost = (record) => {
    console.log('list blogs');
    let htmlBlock = `
    <div class="cdf-image mb40 img-effect-1">
    <img src="/img/blog/blog-single-image.jpg" alt="">
    <figcaption></figcaption>
</div>
<div class="cdf-single-meta ul-li mb15">
    <ul>
        <li class="admin"><strong>Written</strong> by Sujonmaji</li>
        <li class="post-time"> 15th Aug, 2016</li>
    </ul>
</div>
<div class="cdf-title mb20">
    <h2><a href="#">Lorem lpsum dolor soiltp amet consectetur adipisicing tempor incididunt fugiat</a></h2>
</div>

<div class="cdf-text">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris magni dolores quis nostrud exercitation. Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut laboreipsam nostrud exercitation ullamco amet consectetur adipisicing.</p>
    <p>Porem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris magni dolores quis nostrud exercitation. Lorem ipsum dolor sit amet consectetur adipisicing.</p>

    <blockquote>
        <span></span>Lorem ipsum dolor sit amet, consectetur dolor adipisicing dolor  elit, dosed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    </blockquote>

    <p>Morem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris magni dolores quis nostrud exercitation. Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut laboreipsam nostrud exercitation ullamco amet consectetur adipisicing. Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>


    <div class="cdf-tag-social ul-li clearfix mb50">
            <div class="cdf-tag col-sm-7 pt10">
                <span class="pull-left mr5">tags : </span>
                <ul class="">
                    <li><a href="#">SEO</a></li>
                    <li><a href="#">Adwords</a></li>
                    <li><a href="#">Social</a></li>
                    <li><a href="#">Media</a></li>
                </ul>
            </div>
            <div class="social-share text-right ul-li col-sm-5">
                <ul>
                    <li><a href="#"><i class="social_facebook"></i></a></li>
                    <li><a href="#"><i class="social_twitter"></i></a></li>
                    <li><a href="#"><i class="social_googleplus"></i></a></li>
                    <li><a href="#"><i class="social_tumblr"></i></a></li>
                </ul>
            </div>
        </div>
    </div>
        `
    postDiv.innerHTML = htmlBlock;
}

initPost()