function figures_bind_onclick_slider_ajax_load( photo_links, options ) {


    $(photo_links).off('click');

    $(photo_links).on('click', function(e) {

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


    var calculate_max_slider_size = function() {

        var max_height = $(window).height() - 250 // 150 - thumbnail container height + 100px padding

        if ( max_height < 300 ) {

            params.max_height = Math.round( $(window).height() * 0.9 );
            params.show_thumb_gallery = false;

        } else {

            params.max_height = max_height;
            params.show_thumb_gallery = true;

        }

    };

    var load_thumbnail_gallery = function( current_photo_id , parsed_url_options) {

        var callback = {  
                        'click' : function(e) {

                                var id = $(this).data('id');

                                main_slider.update_image(id);

                        }
        }

        $('#image-slider-inner-wrap').add_thumbnail_slider( current_photo_id , parsed_url_options, callback );

        return true;

    };

    return ( function() {


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

                    $('#content-main').children('#content-inner-wrap').fadeOut('fast', function() {

                        $(window).trigger('change_content_area');

                        $('#content-main').append( data );



                        calculate_max_slider_size();


                        main_slider = new main_photo_slider(  params  );

                        main_slider.initialize();



                        if ( params.show_thumb_gallery == true && params.thumb_slider == true) {

                            load_thumbnail_gallery(current_photo_id, params );

                        }

                         // showing sidebar submenu if it still hidden
                        var year_menu = $('#sidebar-photo-content').find('ul')[0]

                        if ( !$(year_menu).is(':visible') ) {

                            $(year_menu).show();

                         }


                    });

                                    
                },
                error: function(data) {

                    return false

                } 

        })

    })(jQuery)

}