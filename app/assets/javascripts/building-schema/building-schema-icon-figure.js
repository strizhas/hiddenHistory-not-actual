/*  функция для создания превью изображений
    в сайдбаре схемы
*/
var create_icon_figure = function( params, callback ) {

    var figure = $('<figure>');

    var link   = $('<a>').attr('href', hiddenHistory.schema_URL + '/' + params['id'] )
                        .addClass('photo-gallery-image-link');

    var img    = $('<img>').attr('src', params['image']['icon']['url'] )
                        .data('id'  , params['id'] )
                        .data('year', params['year']);



    $(figure).addClass('photo-gallery-figure')
            .addClass( 'icon-figure' )
            .attr('id' , 'icon-figure-' + params['id'] )
            .data('id'  , params['id'] )
            .append( link );

    $(link).append(img);
    $(link).off('click').on( 'click' , function(e) { e.preventDefault() });


    if ( typeof(callback) !== 'object' ) {

        callback = {};

    }

    // устраняем стандартную возможность перетаскивать изображение
    // Нужно для нормальной работы претаскивания на схему
    callback['dragstart'] = function(e) { e.preventDefault(); }

    $(img).on(callback);

    return figure;

};