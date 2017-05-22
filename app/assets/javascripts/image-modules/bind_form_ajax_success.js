$.fn.bind_form_ajax_sucess = function( callback ) {

    var form = this

    var progress_area = $(form).find('.progress-bar-area').eq(0)

    var inputs = $(form).find('input')



    $(form).on( 'ajax:beforeSend', function(e, xhr) { 

        // проверка заполненности полей
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
            
            // контроллер возвращает сообщение о шибке или успехе
            // в виде JSON
            recieved_data = jQuery.parseJSON( xhr.responseText )

            // сообщение отправляется в progress bar
            progress_bar_params = {
                    text     : recieved_data.text_message ,
                    callback : function() { $(window).trigger('close_popup') }
            }

            // если есть callback, то выполняем
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



