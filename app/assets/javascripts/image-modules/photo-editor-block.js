var photo_editor_window = function(template, caller_link ) {

        console.log('image_editor_object init')

                var settings = {
                    'editor_min_width'     : '480',
                    'editor_max_width'     : '760',
                    'editor_min_top'       : '20',
                    'data_update_success'  : false,
                    'keep_aspect'          : true,  //  square image
                    'image_default_width'  : 300,   //  default crop size
                    'image_default_height' : 300,   
                    'close_button'         : false, // image cropper will not have close button 
                    'info_size'            : false,  // info size block will be hidden
                    'resource_type'        : 'photo'
                }; 

                // template - xhr response text ( simple string )
                $(template).hide()
                $('body').append( $(template) )

                // get reference to #popup-image-editor-main. 
                // We do this to find the original image size
                var editor_main = $('body').find('#popup-image-editor-main')
                
                var img = $(editor_main).find('img')[0] 

                $(img).on( 'load' , function() {

                    var loaded_img_width  = $(img).width()
                    var loaded_img_height = $(img).height()

                    var form_elements_height = $('#popup-image-editor-form').outerHeight()
                    var form_footer_height   = $('#popup-image-editor-footer').outerHeight()

                    var screen_height = $(window).height()

                    if ( typeof(loaded_img_width) != 'undefined' && loaded_img_width != 0) {

                            var aspect_ratio = loaded_img_width/loaded_img_height
                            
                            if ( loaded_img_width < settings.editor_min_width ) {

                                var actual_photo_width  = settings.editor_min_width
                                var actual_photo_height = Math.round( actual_photo_width/aspect_ratio )


                            } else if ( loaded_img_width > settings.editor_max_width ) {

                                var actual_photo_width  = settings.editor_max_width
                                var actual_photo_height = Math.round( actual_photo_width/aspect_ratio )

                            } else {

                                var actual_photo_width  = loaded_img_width
                                var actual_photo_height = loaded_img_height

                            }

                            var new_editor_height = actual_photo_height + form_elements_height + form_footer_height
                            

                            if ( typeof( screen_height ) != 'undefined' && new_editor_height > 0.9*screen_height  ) {

                                actual_photo_height = 0.9*screen_height - settings.editor_min_top - form_elements_height - form_footer_height
                                actual_photo_width = actual_photo_height * aspect_ratio

                                new_editor_height = actual_photo_height + form_elements_height + form_footer_height

                            }

                            if ( actual_photo_width < settings.editor_min_width ) {

                                 actual_photo_width = settings.editor_min_width
                            } 


                            var new_editor_top = $(window).scrollTop() + ( $(window).height() - new_editor_height ) / 2 
                            

                            if ( new_editor_top < settings.editor_min_top ) { new_editor_top = settings.editor_min_top  }

                            $(img).css({ 'width' : 'auto' , 'height' : actual_photo_height })

                            $('#popup-image-editor-main').css({ 
                                                        'top'    :  new_editor_top + 'px',  
                                                        'width'  :  parseInt(actual_photo_width) + 20 + 'px',
                                                        'height' :  parseInt(new_editor_height) + 'px'
                                                    })
                    
                    } else {

                            $('#popup-image-editor-main').css( 'top' , '20%' )

                    }

                    
                    $(img).css({ 'max-width' : settings.editor_max_width + 'px' })

                    // building hover mesage with warning
                    $('#remove-image-button').promt_builder('удалить изображение')
                    $('#call-image-editor').promt_builder('обрезать превью изображения')

                    // binding ajax success for photo metadata update form
                    var photo_form = $(editor_main).find('form').first()

                    submit_form_prevent( photo_form , caller_link )

                    $('#call-image-editor').on('click', function() {
                     $(img).image_cropper_plugin(settings)
                    })
                    // fading in the half-transparent background tint. More details in 'create_background_black_tint' function
                    $(window).trigger('popup_activate')
                    // closing editor on 'close_popup' window event
                    $(window).on('close_popup', image_editor_close_function )
                    // binding hover buttons effect on image area
                    bind_button_appears_on_figure_hover($(img).parent())
                    // fading in html  
                    $(editor_main).fadeIn('fast')
                    

                })


     

    }

    var image_editor_close_function = function(  ) {

        console.log('image_editor_close_function')

        var editor_main = $('#popup-image-editor-main')

        // removing 'on close_popup' event statement
        $(window).off('close_popup' , image_editor_close_function )

        $(editor_main).fadeOut('fast',function() {
            $(editor_main).remove()

        })     

    };

    var submit_form_prevent = function( photo_form , caller_link ) {

        $( photo_form ).find(':submit').on('click' , function(e) {

            e.preventDefault()

            // form validation goes here

            $( this ).submit()

        })

        var callback = {}

        callback['success'] = function(recieved_data) {
         
            if ( recieved_data.removed == 'true' ) {  
                $(caller_link).parent().fadeOut('fast' , function() { $(this).remove(); }) 
            }

        };

        callback['error'] = function() {
            $(window).trigger('close_popup')
        };

        $(photo_form).bind_form_ajax_sucess(photo_form , callback)
        

    };





$.fn.image_editor_window = function(options) {

        var edit_links = $(this).find('.image-edit-button')

        // disabling older ajax events. It is need to prevent multiple function binding
        // after user uploaded a new photos
        $(edit_links).off('ajax:success');

        $(edit_links).on('ajax:success', function( evt, data, status, xhr ) {

            console.log( 'image_editor_window ajax:success')

            photo_editor_window( xhr.responseText, this );

        })

    
};