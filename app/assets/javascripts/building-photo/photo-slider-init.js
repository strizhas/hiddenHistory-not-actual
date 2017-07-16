function figures_bind_onclick_slider_ajax_load( figures, options ) {


    var photo_link  = $(figures).find('.photo-gallery-image-link');


    $(photo_link).off('click');

    $(photo_link).on('click', function(e) {

        e.preventDefault();

        var target_url = $(this).attr('href');

        load_slider_by_ajax(target_url, options);    

    })

};




function load_slider_by_ajax(target_url, options) {


    var params = $.extend({
            parsed_url_options : {}        // Набор GET параметров из URL
        }, options);


    var parse_url_get_params = function( url ) {

        if ( typeof(target_url) != 'string' ) {

            return;
        }

        url_get_options = url.replace(/.*\?/ , '').split('&');

        url_get_options.forEach( function(option) {

            option = option.split('=');
            params.parsed_url_options[ option[0] ] = option[1];

        })
        

    };

    var remove_slider = function() {

        var background = $('#image-slider-background');


        // Если слайдера нет или поверх него запущено окно
        // с настройками фотографии - прерываем
        if ( background.length == 0 || hiddenHistory.global_settings.popup == true ) {

            return

        }

        $(background).fadeOut('fast' , function() {

            $(background).remove();

            hiddenHistory.main_slider.destroy();

        });

        $('#content-main').css({'height' : 'auto', 'overflow' : 'scroll'});

        $(window).off('close_popup', remove_slider );

        hiddenHistory.global_settings.lightbox = false;

    };


    var ajax_slider_load = function() {

        if ( !target_url ) { return false; }

        // Получаем id выбранной фотографии. Вырезаем путь 
        // и GET параметры

        if ( typeof(target_url) == 'number' ) {

            current_photo_id = target_url

        } else {

            current_photo_id = target_url.replace(/.*\// , '').replace(/\?.*/ , '');

        }

        if ( /^\d+$/.test(current_photo_id) == false ) {

            return;

        }

        // Получаем GET параметры, содержащиеся в url
        // Их мы потом передадим в контроллер для получения 
        // правильной выборки фотографий
        parse_url_get_params(target_url)

        hiddenHistory.main_slider = new Photo_slider_main( params  );

        hiddenHistory.main_slider.initialize();

        var background = $('<div id="image-slider-background"></div>');

        $(background).hide().css({ position: 'fixed', 
                                    width: '100%', 
                                    overflow: 'scroll', 
                                    height : '100vh'});

        $(background).prependTo('#content-main');

        $(background).append( hiddenHistory.main_slider.inner_wrap ).fadeIn('fast');

        hiddenHistory.global_settings.lightbox = true;

        $(window).on('close_popup', remove_slider )

    }



    return ajax_slider_load();

}