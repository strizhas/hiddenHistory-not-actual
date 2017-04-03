
schema_load_thumbnail_image = function(id, callback) {

    if ( !id || typeof(id) == 'undefined' ) { return }

    var url = '/load_thumbnail_image/' + id 

    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        cache: true,
        success: function(data, textStatus, jqXHR) 
        {

            if ( callback && typeof(callback) === 'function' ) {

                callback( data )

            }

        },
        error: function(data) {


        } 

    });

};

