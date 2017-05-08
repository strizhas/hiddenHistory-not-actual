

(function( $ ){

     $.fn.promt_builder = function(message) { 


        var build_close_editor_message = function(parent_element , message ) {

            var message_div = document.createElement('div');


            if ( $(parent_element).is(":visible") == false ) {

                $(parent_element).css({'display' : 'block', 'opacity' : '0'})

                var pos_x = $(parent_element).offset().left
                var pos_y = $(parent_element).offset().top

                $(parent_element).css({'display' : 'none', 'opacity' : '1'})

            } else {

                var pos_x = $(parent_element).offset().left
                var pos_y = $(parent_element).offset().top

            }

            



            var window_width = $(window).width()

            if ( window_width - pos_x < 100 ) {
                $(message_div).addClass('hint-message-right')
            } else {
                $(message_div).addClass('hint-message-left')
            }

            $(message_div).addClass('hint-message')
            
            $(message_div).text( message )
            $(message_div).css({
                                'position' : 'absolute',
                                'left'     : pos_x + 'px',
                                'top'      : pos_y + 'px',  
                                'display'  : 'none' 
                            }) 

            $('body').append(message_div)

            return message_div
        }


        return this.each( function() {

            if ( typeof(message) == 'undefined') {return;}

            var promt = build_close_editor_message(this , message )

            $(this).mouseover( function() {
                $(promt).fadeIn('fast')
            })

            $(this).mouseleave( function() {
                $(promt).fadeOut('fast')
            })

            $(this).bind('destroyed', function() {
                $(promt).remove()
            })

            $(window).on('promt-destroy', function() {
                $(promt).remove()
            })

        })

    }


})( jQuery );        