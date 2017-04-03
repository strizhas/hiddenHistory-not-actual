
Schema_lightbox = function() {

    var settings = {}

    return {

        init : function() {

            var container = document.createElement('div')

            $(container).attr('id' , 'schema-lightbox-container')
                        .addClass('schema-lightbox-container')
                        .hide()
                        .appendTo( '#schema-svg-section' )


            settings.lightbox = container

            $(window).on('close_popup' , function() {

                if (  window.global_settings.popup != true && $(settings.lightbox).is(':visible') ) {

                        $(settings.lightbox).fadeOut('fast' , function() {

                                $('#schema-wrapper').fadeIn('fast');

                        });


                }

            });

            return;

        },

        fullsize_image_loading : function( img_id ) {


            if ( settings.fading == true ) {
                return false
            } else {
                settings.fading = true
            }


            if ( !img_id ) { return false; }

            var url = window.location.href + '/load_fullsize_image/' + img_id
                
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'html',
                data: { layout: 'false' },
                cache: false,
                beforeSend: function() 
                {

                    if ( $( '#schema-wrapper' ).is(':visible') ) {

                         $( '#schema-wrapper' ).fadeOut('fast' , function() {

                                    $(settings.lightbox).fadeIn('fast')

                        })

                    }
                             
                    $(settings.lightbox).children().fadeOut('fast' , function() {

                            $(this).remove()

                    })
   
                },
                success: function(data, textStatus, jqXHR) 
                {

                    setTimeout( function() {

                        $(settings.lightbox).append( data )

                            var new_img = $(settings.lightbox).find('img')

                            $(new_img).resizeImageToContainer( $(settings.lightbox), function() {

                                    $('#slider-main-img-footer').css('width' , $(new_img).width() )

                                });

                            bind_likes_button()

                            settings.fading = false

                    }, 200 );
                           
                },
                error: function(data) {

                    settings.fading = false
                    return false

                } 

            }) 

        } // bind_fullsize_image_loading end

    } // return methods end

};
