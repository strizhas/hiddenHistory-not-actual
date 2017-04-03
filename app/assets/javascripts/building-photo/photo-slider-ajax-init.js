figures_bind_onclick_slider_ajax_load = function( photo_links ) {

    var parse_url_get_params = function( url ) {

        url_get_options = url.replace(/.*\?/ , '').split('&');
        
        parsed_url_options = {}

        url_get_options.forEach( function(option) {

            option = option.split('=')
            parsed_url_options[ option[0] ] = option[1]

        })
        
        return parsed_url_options        
    };


    var calculate_max_slider_size = function() {

        var size_params = {}
        var max_height = $(window).height() - 250 // 150 - thumbnail container height + 100px padding

        if ( max_height < 300 ) {
            size_params.max_height = Math.round( $(window).height() * 0.9 )
            size_params.show_thumb_gallery = false
        } else {
            size_params.max_height = max_height
            size_params.show_thumb_gallery = true
        }

        return size_params

    };

    var load_thumbnail_gallery = function( current_photo_id , parsed_url_options) {

        var callback = {  
                        'click' : function(e) {

                                var id = $(this).data('id')

                                main_slider.update_image(id)

                        }
        }

        $('#image-slider-inner-wrap').add_thumbnail_slider( current_photo_id , parsed_url_options, callback )

        return true

    };

    return (function() {

        $(photo_links).off('click')

        $(photo_links).on('click', function(e) {

            e.preventDefault()

            var target_url = $(this).attr('href')

            if ( !target_url ) { return false; }

            // Получаем id выбранной фотографии. Вырезаем путь 
            // и GET параметры
            current_photo_id = target_url.replace(/.*\// , '').replace(/\?.*/ , '')

            // Получаем GET параметры, содержащиеся в url
            // Их мы потом передадим в контроллер для получения 
            // правильной выборки фотографий
            parsed_url_options = parse_url_get_params(target_url)

            // эту опцию мы добавляем для того, чтобы контроллер
            // не рендерил layout. Он рендерится тоько в том случае, 
            // если фотография открывается напрямую по ссылке
            parsed_url_options = $.extend( { layout: 'false' } , parsed_url_options )


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

                        $(window).trigger('change_content_area')

                        $('#content-main').append( data )

                        var size_params = calculate_max_slider_size()

                        main_slider = new main_photo_slider(  size_params , parsed_url_options );

                        main_slider.initialize()

                        if ( size_params.show_thumb_gallery == true ) {

                            load_thumbnail_gallery(current_photo_id, parsed_url_options)

                        }

                         // showing sidebar submenu if it still hidden
                        var year_menu = $('#sidebar-photo-content').find('ul')[0]

                        if ( !$(year_menu).is(':visible') ) {

                            $(year_menu).show()

                         }

                    });

                                    
                },
                error: function(data) {

                    return false

                } 

            })

        })

    })(jQuery)

};