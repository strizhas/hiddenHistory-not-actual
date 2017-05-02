/*  Функция для ajax загрузки фотографий из input'ов
    Перед загрузкой создаёт иконки загрузки с помощью 
    класса Loading_thumbnails, которые после завершения
    удаляются

    В качестве аргументов принимает следующее:
    
    files - список файлов из искомого input'а
    url - тут всё понятно
    container - DOM элемент, к которому будут пределаны
                иконки загрузки
    callback - функция, которая будет выполнена после
                завершения загрузки

*/

;var ajax_file_upload = function(files, url, container, callback) {   

    var loading_thumbs = '';
    var data = new FormData(); 


    if ( !url || files.length == 0 ) return

    $.each(files, function(key, value)
        {   
            data.append('post_photos[]', value);
        });

    data.append('render_nothing', true );

    $.ajax({ 
        url: url,
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        beforeSend: function() {

            loading_thumbs = new Loading_thumbnails();

            loading_thumbs.initialize( files.length, container )


        },
        success: function(data, textStatus, jqXHR) {

            setTimeout( function() {

                loading_thumbs.destroy( files.length );

                if ( typeof(callback) === 'function' ) {

                    callback(data)

                }

            }, 400 )
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            alert('произошла проблема при загрузке файлов')
            loading_thumbs.destroy( files.length );      

        }

    })

};