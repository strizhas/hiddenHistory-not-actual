bind_likes_button = function() {

    var ajax_add_like = function( button ) {

        var url = $(button).attr('href') 

        $.ajax({
            url : url,
            method : 'GET',
            data : { remote : true },
            dataType : 'JSON',
            success : function( data, textStatus, jqXHR ) {

                if ( data.status == 'created' ) {

                    console.log( 'created' )

                    var counter = $(button).parent().find('.slider-likes-counter')
                    
                    var likes_count = counter.text()

                    var new_count = likes_count++

                    if ( new_count == 0 ) { new_count = '1' }

                    counter.text( new_count  )

                } else if ( data.status == 'deleted' ) {

                    console.log( 'deleted' )

                    var counter = $(button).parent().find('.slider-likes-counter')
                    var likes_count = counter.text()

                    var new_count = likes_count-1

                    if ( new_count == 0 ) { new_count = '' ; console.log('sdsd') }

                    counter.text( new_count  )

                }
                
            }

        })
    }


    var buttons = $(document).find('.slider-like-button')

        $(buttons).off('click')

        $(buttons).on('click', function(e) {

            e.preventDefault()

            ajax_add_like( this )

    })


}



$(window).on('page:change' , function() {

	bind_likes_button()

})



