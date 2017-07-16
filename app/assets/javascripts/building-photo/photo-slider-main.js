// Объект основного слайдера
// Возвращает только метод инициализации
Photo_slider_main = function(  options ) {


    // thumb_slider : true -  показывать сладйер с превью фотографий
    // navigation   : true  - кнопки 'следующая фотография' и 'предыдущая'

    var params = $.extend( { thumb_slider : true,  navigation : true },  options)

    var slider = this;

    this.initialize = function() {

        create_slider_elements();

        calculate_max_slider_size();

        load_first_image();

        bind_likes_button();

    };


    this.destroy = function( ) {

        $(this).remove();

        $('#image-slider-background').remove(); 

        return true;

    };


    var create_slider_elements = function() {


        //<div id="image-slider-inner-wrap">
        //<div id="main_slider_section">
        //<div id="slider_main_img_frame">

        
        slider.inner_wrap    = $('<div></div>').addClass('image-slider-inner-wrap');
        slider.section       = $('<div></div>').addClass('main_slider_section');
        slider.main_frame    = $('<div></div>').addClass('slider_main_img_frame');


        $(slider.inner_wrap).append(slider.section);
        $(slider.section).append(slider.main_frame);


        $( slider.section ).css('height' , params.max_height );

        if ( params.navigation == true ) {

            slider.button_left   = $('<div></div>').addClass('slider_button_left').prependTo(slider.section);
            slider.button_right  = $('<div></div>').addClass('slider_button_right').appendTo(slider.section);

            // toggling to previos slide
            $(slider.button_left).on('click' , function() { load_image_to_main_container( '', 'prev' ) });

            // toggling to next slide
            $(slider.button_right).on('click' , function() { load_image_to_main_container( '', 'next' ) });

        }

    };

    var calculate_max_slider_size = function() {

        var max_height = $(window).height() - 250 // 150 - thumbnail container height + 100px padding


        if ( max_height < 300 ) {

            params.max_height   = Math.round( $(window).height() * 0.9 );
            params.thumb_slider = false;

        } else {

            params.max_height   = max_height;

        }

        $(slider.main_frame).height( params.max_height );


    };

    var load_thumbnail_gallery = function( ) {


        if ( params.thumb_slider == false ) {

            return false;

        }

        var callback = {  

            'click' : function(e) {

                var id = $(this).data('id');

                load_image_to_main_container(id);

            }

        };

        thumbnail_slider = new thumbnails_slider( slider.inner_wrap, params, callback );

        thumbnail_slider.init();

        return true;

    };

    var load_first_image = function() {

        $.ajax({

            url: '/load_fullsize_image/' + current_photo_id,
            method: 'POST',
            dataType: 'html',
            data: params.parsed_url_options,
            cache: false,
            beforeSend: function() 
            {

            },
            success: function( figure, textStatus, jqXHR) 
            {

                $(slider.main_frame).append( figure );

                load_thumbnail_gallery();

                var figure = $(slider.main_frame).find('.slider-main-img-figure').eq(0)

                bind_button_appears_on_figure_hover( figure );

                recalculate_image_size( );

                                
            },
            error: function(data) {

                return false

            } 

        })

    }


    var load_image_to_main_container = function( current_id, direction ) {

                var request_params = params.parsed_url_options;

                if ( current_id  == '' ) {

                    var current_id = $(slider.main_frame).find('img').eq(0).attr('id').replace( /[^0-9]/g , '' );

                };  

                // если задано направление, то добавляем его в объект,
                // отправляемый в качестве params. Если не задано, то
                // удаляем соотвествующий ключ во избежание проблем
                if ( typeof( direction ) != 'undefined' ) {

                    request_params[ 'direction' ] = direction;

                } 

                if ( !current_id ) { 

                    return false; 

                };

                var url = '/load_fullsize_image/' + current_id

                $.ajax({
                url: url,
                method: 'POST',
                dataType: 'html',
                cache: true,
                data: params.parsed_url_options, 
                beforeSend: function() 
                {
                    $(slider.main_frame).children().fadeOut('fast' , function() {

                         // add progress bar until image isn't loaded
                        $(slider.main_frame).simple_progress_bar('create', {progress_bar_type : 'gray-circle-bar'}) 

                     })
                     

                },
                success: function(data, textStatus, jqXHR) 
                {

                    setTimeout( function() {

                        $(slider.main_frame).hide().html( data ).fadeIn('fast');

                        var figure = $(slider.main_frame).find('figure')

                        recalculate_image_size( ); 

                        bind_likes_button();

                        bind_button_appears_on_figure_hover( figure );

                    }, 500)   


                                    
                },
                error: function(data) {

                    setTimeout( function() {

                        $(slider.main_frame).simple_progress_bar('remove')
                        $(slider.main_frame).children().fadeIn('fast')
                        return false

                    }, 200 ) 

                } 

                })

                $(window).trigger('change_content_area')

                return true

            };

            var recalculate_image_size = function( ) {

                var new_img = $(slider.main_frame).find('img')[0]

                // custom plugin, recalculating img and container sizes 
                // and making img fill the container
                $(new_img).resizeImageToContainer( $(slider.main_frame), function() {

                    $('#slider-main-img-footer').css('width' , $(new_img).width() )

                })
                
            };


      



}