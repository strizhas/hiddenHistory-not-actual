var create_image_figure = function( params, callback ) {

    var figure = $('<figure>');

    var link   = $('<a>').attr('href', window.location.href + '/' + params['id'] )
                        .addClass('photo-gallery-image-link');

    var img    = $('<img>').attr('src', params['image']['thumb']['url'] )
                        .data('id'  , params['id'] )
                        .data('year', params['year']);

     var add_edit_button_to_figure = function() {

        if ( !sessionStorage ) {

            return;

        }

        var user_id = sessionStorage.getItem("user_id")

        if ( user_id == params['user_id'] ) {
            
            var href = '/photo_editor?id=' + params['id'];
            var edit = $('<a>').addClass('image-edit-button')
                                .attr('href', href )
                                .data('remote','true');

            $(figure).append(edit);

            $(edit).on('click', function(e) {

                e.preventDefault();

                $.get( href , function(result){
                    photo_editor_window(result , edit);
                });
            })
        };

    }

    console.log(callback)

    $(figure).addClass('photo-gallery-figure')
            .attr('id' , 'slider-figure-' + params['id'] )
            .data('id'  , params['id'] )
            .append( link );

    $(link).append(img)
    $(link).off('click').on( 'click' , function(e) { e.preventDefault() })

    $(img).on(callback);

    add_edit_button_to_figure();

    bind_button_appears_on_figure_hover( figure );

   

    return figure;

};


