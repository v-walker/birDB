

 /******************************************
 -   PREPARE PLACEHOLDER FOR SLIDER  -
 ******************************************/

 var setREVStartSize=function(){
    try{var e=new Object,i=jQuery(window).width(),t=9999,r=0,n=0,l=0,f=0,s=0,h=0;
        e.c = jQuery('#rev_slider_1_1');
        e.gridwidth = [1240];
        e.gridheight = [868];

        e.sliderLayout = "fullwidth";
        if(e.responsiveLevels&&(jQuery.each(e.responsiveLevels,function(e,f){f>i&&(t=r=f,l=e),i>f&&f>r&&(r=f,n=e)}),t>r&&(l=n)),f=e.gridheight[l]||e.gridheight[0]||e.gridheight,s=e.gridwidth[l]||e.gridwidth[0]||e.gridwidth,h=i/s,h=h>1?1:h,f=Math.round(h*f),"fullscreen"==e.sliderLayout){var u=(e.c.width(),jQuery(window).height());if(void 0!=e.fullScreenOffsetContainer){var c=e.fullScreenOffsetContainer.split(",");if (c) jQuery.each(c,function(e,i){u=jQuery(i).length>0?u-jQuery(i).outerHeight(!0):u}),e.fullScreenOffset.split("%").length>1&&void 0!=e.fullScreenOffset&&e.fullScreenOffset.length>0?u-=jQuery(window).height()*parseInt(e.fullScreenOffset,0)/100:void 0!=e.fullScreenOffset&&e.fullScreenOffset.length>0&&(u-=parseInt(e.fullScreenOffset,0))}f=u}else void 0!=e.minHeight&&f<e.minHeight&&(f=e.minHeight);e.c.closest(".rev_slider_wrapper").css({height:f})

    }catch(d){console.log("Failure at Presize of Slider:"+d)}
};

setREVStartSize();

var tpj=jQuery;

var revapi1;
tpj(document).ready(function() {
    if(tpj("#rev_slider_1_1").revolution == undefined){
        revslider_showDoubleJqueryError("#rev_slider_1_1");
    }else{
        revapi1 = tpj("#rev_slider_1_1").show().revolution({
            sliderType:"standard",
            jsFileLocation:"//localhost/seo/wp-content/plugins/revslider/public/assets/js/",
            sliderLayout:"fullwidth",
            dottedOverlay:"none",
            delay:9000,
            navigation: {
                onHoverStop:"off",
            },
            visibilityLevels:[1240,1024,778,480],
            gridwidth:1240,
            gridheight:868,
            lazyType:"none",
            shadow:0,
            spinner:"spinner0",
            stopLoop:"off",
            stopAfterLoops:-1,
            stopAtSlide:-1,
            shuffle:"off",
            autoHeight:"off",
            disableProgressBar:"on",
            hideThumbsOnMobile:"off",
            hideSliderAtLimit:0,
            hideCaptionAtLimit:0,
            hideAllCaptionAtLilmit:0,
            debugMode:false,
            fallbacks: {
                simplifyAll:"off",
                nextSlideOnWindowFocus:"off",
                disableFocusListener:false,
            }
        });
    }
}); /*ready*/

