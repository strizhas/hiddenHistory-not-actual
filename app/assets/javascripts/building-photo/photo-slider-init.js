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
            thumb_slider : true     // показывать сладйер с превью фотографий
        }, options);

    var parsed_url_options = { layout : 'false' };


    var parse_url_get_params = function( url ) {

        url_get_options = url.replace(/.*\?/ , '').split('&');

        url_get_options.forEach( function(option) {

            option = option.split('=');
            parsed_url_options[ option[0] ] = option[1];

        })
        
        // эту опцию мы добавляем для того, чтобы контроллер
        // не рендерил layout. Он рендерится тоько в том случае, 
        // если фотография открывается напрямую по ссылке
        params = $.extend( params, parsed_url_options );

    };

    var remove_slider = function() {

        var background = $('#image-slider-background');

        if ( background.length == 0 ) {

            return

        }

        $(background).fadeOut('fast' , function() {

            $(background).remove();

            hiddenHistory.main_slider.destroy();

        });

        $('#content-main').css({'height' : 'auto', 'overflow' : 'scroll'});

        $(window).off('close_popup', remove_slider );

    }


    var ajax_slider_load = function() {

        if ( !target_url ) { return false; }

        // Получаем id выбранной фотографии. Вырезаем путь 
        // и GET параметры
        current_photo_id = target_url.replace(/.*\// , '').replace(/\?.*/ , '');

        if ( /^\d+$/.test(current_photo_id) == false ) {

            return;

        }

        // Получаем GET параметры, содержащиеся в url
        // Их мы потом передадим в контроллер для получения 
        // правильной выборки фотографий
        parse_url_get_params(target_url)

        $.ajax({
            url: target_url,
            method: 'GET',
            dataType: 'html',
            data: parsed_url_options,
            cache: false,
            beforeSend: function() 
            {

            },
            success: function(data, textStatus, jqXHR) 
            {


                var background = $('<div id="image-slider-background"></div>');

                $(background).hide().css({ position: 'fixed', 
                                            width: '100%', 
                                            overflow: 'scroll', 
                                            height : '100vh'});

                $(background).prependTo('#content-main');

                $(background).prepend( data ).fadeIn('fast');          

                hiddenHistory.main_slider = new Photo_slider_main(  params  );

                hiddenHistory.main_slider.initialize();

                

                $(window).on('close_popup', remove_slider )

                
                                
            },
            error: function(data) {

                return false

            } 

        })

    }



    return ajax_slider_load();

}