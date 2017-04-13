$.fn.bind_form_ajax_sucess = function( callback ) {

    var form = this

    console.log('bind_form_ajax_sucess')

    progress_area = $(form).find('.progress-bar-area').eq(0)

    var inputs = $(form).find('input')



    $(form).on( 'ajax:beforeSend', function(e, xhr) { 

        for ( var i=0; i<inputs.length; i++ ) {

            if ( $(inputs[i]).data('validate') == true) {
            
                if ( $(inputs[i]).val() == '' ) {

                    xhr.abort();

                    return false;
           
                }
            }
        }

        $('#popup-tint').fadeIn('fast');
        $(progress_area).simple_progress_bar('create', {progress_bar_type : 'gray-gears-bar'});

    });

    $(form).on( 'ajax:success', function( evt, data, status, xhr ) { 

        setTimeout( function() {

            var recieved_data, progress_bar_params
                
            recieved_data = jQuery.parseJSON( xhr.responseText )

            progress_bar_params = {
                    text     : recieved_data.text_message ,
                    callback : function() { $(window).trigger('close_popup') }
            }

            if ( typeof(callback) != 'undefined' && typeof(callback['success'] ) === 'function' ) {
                    callback['success'](recieved_data)
            }

                $(progress_area).simple_progress_bar('success', progress_bar_params ); 

        }, 500 )
    })

    $(form).on( 'ajax:error', function() {

        var params = {}

        params['text'] = 'произошла какая-то ошибка'

        if ( typeof(callback) != 'undefined' && typeof(callback['error'] ) === 'function' ) {

                params['callback'] = callback['error'];

            }



        $(progress_area).simple_progress_bar('success', params );

        
    })

};



