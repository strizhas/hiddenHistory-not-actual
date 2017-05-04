// Объект основного слайдера
// Возвращает только метод инициализации
main_photo_slider = function( options ) {

    var params = $.extend( {  },  options)

    var main_button_left  = $('#slider-main-button-left')
    var main_button_right = $('#slider-main-button-right')
    var main_img_frame    = $('#slider_main_img_frame')


    console.log('main_photo_slider')
    console.log( params)


    var load_image_to_main_container = function( current_id, direction ) {

                if ( current_id  == '' ) {

                    var current_id = $(main_img_frame).find('img').eq(0).attr('id').replace( /[^0-9]/g , '' )

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
                    $(main_img_frame).children().fadeOut('fast' , function() {

                         // add progress bar until image isn't loaded
                        $(main_img_frame).simple_progress_bar('create', {progress_bar_type : 'gray-circle-bar'}) 

                     })
                     

                },
                success: function(data, textStatus, jqXHR) 
                {

                    setTimeout( function() {

                        $(main_img_frame).hide().html( data ).fadeIn('fast')

                        recalculate_image_size( ) 

                        bind_likes_button()

                    }, 500)   


                                    
                },
                error: function(data) {

                    setTimeout( function() {

                        $(main_img_frame).simple_progress_bar('remove')
                        $(main_img_frame).children().fadeIn('fast')
                        return false

                    }, 200 ) 

                } 

                })

                $(window).trigger('change_content_area')

                return true

            };

            var recalculate_image_size = function( ) {

                var new_img = $(main_img_frame).find('img')[0]

                // custom plugin, recalculating img and container sizes 
                // and making img fill the container
                $(new_img).resizeImageToContainer( $(main_img_frame), function() {

                    $('#slider-main-img-footer').css('width' , $(new_img).width() )

                })
                
            };



            var close_slider_function = function() {

                if (  window.global_settings.popup != true ) 
                { 

                    if ( destroy() == true ) 
                    {
                        $(window).off('close_popup', close_slider_function )
                    }

                } 
                else 
                {
                    return false;
                }
            };

            var destroy = function( ) {

                $('#image-slider-background').fadeOut('fast', function() {
                         $(this).remove()
                         $('#content-main').children().fadeIn('fast')
                         $(window).trigger('change_content_area')
                        
                })
                return true

            };

            return {

                initialize : function() {

                    $('#main_slider_section').css('height' , params.max_height )

                    recalculate_image_size( )

                    $(window).on('close_popup', close_slider_function )
                
                    // toggling to previos slide
                    $(main_button_left).on('click' , function() { load_image_to_main_container( '', 'prev' ) })

                    // toggling to next slide
                    $(main_button_right).on('click' , function() { load_image_to_main_container( '', 'next' ) })

                    $(window).trigger('change_content_area')

                    bind_likes_button()

                
                },

                update_image : function(id) {

                    load_image_to_main_container(id)

                }


        }



}