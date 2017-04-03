

(function( $ ){

    var methods = {

         create : function() {
        
            progressBar = document.createElement('div');
            $(progressBar).attr('id','content-progress-bar')
            $(progressBar).addClass(settings.progress_bar_type)
            $(progressBar).hide()

            $(this).prepend( progressBar )
            $(progressBar).fadeIn('fast')

        },

        success : function( arguments ) {

            if (  typeof( arguments ) == 'undefined' || typeof( arguments.text ) == 'undefined' ) { 
                return methods[ 'remove' ].apply( this )
            }

            text_message = document.createElement('div');
            $(text_message).attr('id','progress-bar-text-message')
            $(text_message).text( arguments.text ).hide()
            console.log('success')

            $(progressBar).parent().append(text_message)

            $(progressBar).slideToggle('fast', function() {

                $(text_message).fadeIn('fast')
                setTimeout( function() { return methods[ 'remove' ].apply( this ) }, 1000)   
            })
                

        },

        remove : function(arguments) {

            if ( typeof( text_message ) != 'undefined' ) {
                 $(text_message).fadeOut('fast', function() { $(this).remove() })
            }
           
            $(progressBar).fadeOut('fast', function() {
                $(this).remove()
                if ( typeof( settings.callback ) == 'function' ) {
                    settings.callback.call(this);
                }
            })

           

        }

    }

    $.fn.simple_progress_bar = function( method, params ) {

        settings = $.extend({
            'progress_bar_type' : 'gray-gears-bar'
        }, params)

        if ( typeof(method) == 'undefined' || method == 'create' ) {

            methods[ 'create' ].apply( this, arguments );

        } else {

            if ( !methods[method] ) {
                $.error( 'Метод с именем ' +  method + ' не существует для simple_progress_bar' ); 
            }

            methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));

        } 

        return this
        
    }

})( jQuery );