// Объект основного слайдера
// Возвращает только метод инициализации
Photo_slider_main = function( options ) {

    var params = $.extend( {  },  options)

    var slider = this;

    this.button_left   = $('#slider-main-button-left');
    this.button_right  = $('#slider-main-button-right');
    this.main_frame    = $('#slider_main_img_frame');
    this.inner_wrap    = $('#image-slider-inner-wrap');

 
    var init = function() {

        var figure = $('#main_slider_section').find('figure').eq(0);

        $('#main_slider_section').css('height' , params.max_height );
                
        // toggling to previos slide
        $(slider.button_left).on('click' , function() { load_image_to_main_container( '', 'prev' ) });

        // toggling to next slide
        $(slider.button_right).on('click' , function() { load_image_to_main_container( '', 'next' ) });

        calculate_max_slider_size();

        recalculate_image_size( );

        bind_button_appears_on_figure_hover( figure );

        bind_likes_button();

        load_thumbnail_gallery();

        // Вместе с параметрами могут быть переданы уже
        // существующие на html страницы элементы fugires
        // После передачи их в thumb slider их надо удалить,
        // поскольку иначе они будут передаваться в параметры
        // ajaz запросов
        if ( 'figures' in params ) {

            delete params[ 'figures' ]

        }
        

    };

    var calculate_max_slider_size = function() {

        var max_height = $(window).height() - 250 // 150 - thumbnail container height + 100px padding


        if ( max_height < 300 ) {

            params.max_height   = Math.round( $(window).height() * 0.9 );
            params.thumb_slider = false;

        } else {

            params.max_height   = max_height;
            params.thumb_slider = true;

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


    var load_image_to_main_container = function( current_id, direction ) {

                if ( current_id  == '' ) {

                    var current_id = $(slider.main_frame).find('img').eq(0).attr('id').replace( /[^0-9]/g , '' )

                };  



                // если задано направление, то добавляем его в объект,
                // отправляемый в качестве params. Если не задано, то
                // удаляем соотвествующий ключ во избежание проблем
                if ( typeof( direction ) != 'undefined' ) {

                    params[ 'direction' ] = direction

                } else {

                    delete params[ 'direction' ]
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
                data: params, 
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



            


            return {

                initialize : function() {

                    init();
                
                },

                destroy : function( ) {

                    $(this).remove();

                    $('#image-slider-background').remove(); 

                    return true

                }


        }



}