var convert_json_in_figures = function( data, container, callback) {

    if ( data.length == 0 ) {
        return
    }

    for ( var item in data ) {

        var figure = create_icon_figure( data[item], callback )

        $(container).append(figure)

    }

}