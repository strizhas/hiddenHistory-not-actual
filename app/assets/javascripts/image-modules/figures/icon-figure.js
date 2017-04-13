var create_icon_figure = function( params, callback ) {


    var figure = $('<figure>');

    var link   = $('<a>').attr('href', window.location.href + '/' + params['id'] )
                        .addClass('photo-gallery-image-link');

    var img    = $('<img>').attr('src', params['image']['icon']['url'] )
                        .data('id'  , params['id'] )
                        .data('year', params['year']);



    $(figure).addClass('photo-gallery-figure')
            .addClass( 'icon-figure' )
            .attr('id' , 'icon-figure-' + params['id'] )
            .data('id'  , params['id'] )
            .append( link );

    $(link).append(img)
    $(link).off('click').on( 'click' , function(e) { e.preventDefault() })

    $(img).on(callback);

    return figure;

};