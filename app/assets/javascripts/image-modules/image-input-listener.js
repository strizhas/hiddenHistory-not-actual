
function handle_image_to_editor() {

    var input = $('#image-input-field');

    var resource_type = $(input).attr('name').split('[')[0] || false

    // параметры, необходимые для работы
    // обречика превью изображения
    var params = { 
        image_default_width  :   300,
        image_default_height :   300, 
        resource_type        :   resource_type,
        keep_aspect          :   true

    }

    $(input).off('change');

    $(input).on('change', function(event) {

        handleFileSelect( event.target.files , after_load_action );

    }) 

    var after_load_action = function(img) {

        $('#image-editor-area').empty();
        $('#image-editor-area').append(img);

        $(img).image_cropper_plugin(params);

    }

};



function handleFileSelect (files, action ) {


    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0; i < files.length ; i++) {

                (function(f) {
                    // Only process image files.
                    if (!f.type.match('image.*')) {
                        return;
                    }

                    var reader = new FileReader();
                    reader.onload = (function (theFile) {
                        
                        return function (e) {
                    
                            var img, img_object, name

                            
                            img = new Image();
                            name = escape(theFile.name);

                            img.src = e.target.result;
                            img.name = escape(theFile.name);


                            if ( typeof( action ) === 'function' )  {

                                action(img);

                            } 


                            return;
                            
                        };

                })(f);

                // Read in the image file as a data URL.
                reader.readAsDataURL(f);

                })(files[i]);    
            } 

};


function building_photo_uploader( ) {

    var form    = $('#building-photo-upload');
    var gallery = $('#basic-photo-gallery');



    $(form).validate({
        rules:{
            'photo[year]':{
                    digits: true,
                    rangelength: [4,4]
                },

            'post_photos[]':{
                    required: true,
                    validate_file_type : true
                }
        },
        messages:{
            'photo[year]':{
                digits: "поле должно состоять только из цифр",
                rangelength: "Год должен состоять из 4 цифр"
            },
            'post_photos[]': {
                required: "вы не указали ни одного файла",
                validate_file_type : "файл имеет неправильное расширение"
            }
        }
    });


    
    // Если у пользователя работает JS, вместо переадрессации 
    // контроллер вернет отрендеренные картинки
    $(form).append('<input name="render_nothing" value="true" type="hidden">')


    $(form).on( 'ajax:beforeSend', function(e, xhr) { 

        $(gallery).animate({'height' : '150px'}, 300 , function() {

            $(gallery).simple_progress_bar('create', {progress_bar_type : 'gray-gears-bar'});

        })

    });

    $(form).on( 'ajax:success', function( evt, data, status, xhr ) { 

        var html = $(xhr.responseText);

        // обнулим значение инпута
        $('#image-input-field').replaceWith($('#image-input-field').val('').clone(true));

       $(gallery).empty().append( html ).css('height','auto')

       bind_actions_on_photo_gallery()

    });

    $(form).on( 'ajax:error', function() {

        var params = { 'text' : 'произошла какая-то ошибка' };

        params['callback'] = function() {
             $(gallery).animate({'height' : '0'}, 300 )
        }

        $(gallery).simple_progress_bar('success', params );

        
    });

};
