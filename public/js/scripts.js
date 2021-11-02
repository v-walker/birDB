$(document).on("ready", function() {
    "use strict";

    $('.cdf-btn-effect-2')
    .on('mouseenter', function(e) {
        var parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
        $(this).find('span').css({top:relY, left:relX})
    })
    .on('mouseout', function(e) {
        var parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
        $(this).find('span').css({top:relY, left:relX})
    });

    $('.client-carousel').owlCarousel({
        loop:true,
        margin:30,
        navigation: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2,
            },
            1000:{
                items:3,
            }
        }
    });

    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
      disableOn: 700,
      type: 'iframe',
      mainClass: 'mfp-fade',
      removalDelay: 160,
      preloader: false,

      fixedContentPos: false
    });

    $('.partner-carousel').owlCarousel({
        loop:true,
        margin:20,
        navigation: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:6
            }
        }
    });

    $('.partner-carousel-2').owlCarousel({
        loop:true,
        margin:20,
        dots: true,
        navigation: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:3
            }
        }
    });
    
    $('.case-carousel').owlCarousel({
        loop:true,
        margin:20,
        navigation: true,
        nav:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2,
                nav: true,
                navText: [
                '<i class="arrow_carrot-left"></i>',
                '<i class="arrow_carrot-right"></i>',
                ],
            },
            1000:{
                items:3,
                nav: true,
                navText: [
                '<i class="arrow_carrot-left"></i>',
                '<i class="arrow_carrot-right"></i>',
                ],
            }
        }

    });


    $('.member-carousel').owlCarousel({
        loop:true,
        margin:30,
        navigation: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:4
            }
        }
    });


    $('.case-carousel-2').owlCarousel({
        loop:true,
        margin:20,
        navigation: true,
        nav:true,
        responsive:{
            0:{
                items:1
            },
            430:{
                items:2,
                nav: true,
                navText: [
                '<i class="arrow_left"></i>',
                '<i class="arrow_right"></i>',
                ],
            },
            600:{
                items:2,
                nav: true,
                navText: [
                '<i class="arrow_left"></i> PRV CASE',
                'NEXT CASE <i class="arrow_right"></i>',
                ],
            },
            1000:{
                items:3,
                nav: true,
                navText: [
                '<i class="arrow_left"></i> PRV CASE',
                'NEXT CASE <i class="arrow_right"></i>',
                ],
            }
        }

    });

    $(function() {

        var mm = $('.cdf-menu').offset().top;

        var mm_navigation = function(){
          var scroll_top = $(window).scrollTop();

          if (scroll_top > mm) { 
            $('.cdf-menu').css({ 'position': 'fixed', 'top':0, 'left':0, 'right':0, 'background-color': '#fff', 'z-index':99999999999 });
                } else {
                    $('.cdf-menu').css({ 'position': 'relative', 'height': 'auto', 'background-color': '#fff', 'z-index':9999999999 }); 
                }  

                if (scroll_top > mm) { 
                   $('.cdf-menu').addClass("fix-menu");
               } else {
                $('.cdf-menu').removeClass("fix-menu");
            } 
        };
        mm_navigation();

        $(window).on("scroll", function() {

        mm_navigation();
        });
    });

    $('.counter').counterUp({delay:50,time:3000});

    $('#sort').mixitup({
        load: {
            filter: 'all'
        }    
    });

    /*   - Google Map - with support of gmaps.js 
    --------------------------------------------------------------------*/ 

    function isMobile() { 
        return ('ontouchstart' in document.documentElement);
    }

    function init_gmap() {
        if ( typeof google === 'undefined' ) return;
            var options = {
              center: [23.7806286, 90.2793692],
              zoom: 10,
              mapTypeControl: true,
              mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            navigationControl: true,
            scrollwheel: false,            streetViewControl: true,
        }

        if (isMobile()) {
          options.draggable = false;
       }

       $('#googleMaps').gmap3({
            map: {
                options: options
            },
            marker: {
                latLng: [23.7806286, 90.2793692],
                options: { icon: 'img/map.png' }
            }
        });
    }
    init_gmap();

    /*   - Google Map - with support of gmaps.js End 
    --------------------------------------------------------------------*/


    (function ($) { 
        $('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');

        $('.tab ul.tabs li a').on( "click", function (g) { 
            var tab = $(this).closest('.tab'),  
            index = $(this).closest('li').index();

            tab.find('ul.tabs > li').removeClass('current');
            $(this).closest('li').addClass('current');

            tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
            tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();

            g.preventDefault();
        } );
    })(jQuery);

    var htmlDiv = document.getElementById("rs-plugin-settings-inline-css"); var htmlDivCss="";
    if(htmlDiv) {
        htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
    }else{
        var htmlDiv = document.createElement("div");
        htmlDiv.innerHTML = "<style>" + htmlDivCss + "</style>";
        document.getElementsByTagName("head")[0].appendChild(htmlDiv.childNodes[0]);
    }

    function buttonUp(){
        var valux = $('.sb-search-input').val(); 
        valux = $.trim(valux).length;
        if(valux !== 0){
        $('.sb-search-submit').css('z-index','99');
        } else{
            $('.sb-search-input').val(''); 
            $('.sb-search-submit').css('z-index','-999');
        }
    }
    var submitIcon = $('.sb-icon-search');
    var submitInput = $('.sb-search-input');
    var searchBox = $('.sb-search');
    var isOpen = false;

    $(document).on( "mouseup", function(){
        if(isOpen == true){
            submitInput.val('');
            $('.sb-search-submit').css('z-index','-999');
            submitIcon.click();
        }
    });

    submitIcon.on( "mouseup", function(){
        return false;
    });

    searchBox.on( "mouseup", function(){
        return false;
    });

    submitIcon.on( "click", function(){
        if(isOpen == false){
            searchBox.addClass('sb-search-open');
            isOpen = true;
        } else {
            searchBox.removeClass('sb-search-open');
            isOpen = false;
        }
    });

    (function(){
        var burger = document.querySelector('.burger-container'),
        header = document.querySelector('.cdf-header');
        
        burger.onclick = function() {
            header.classList.toggle('menu-opened');
        }
    }());
});  // End Of $(document).ready(function() {