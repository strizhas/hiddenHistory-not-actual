
Image_uploader = function( options, image_input, callback ) {


        var that = this

        this.params = $.extend({
            'count'                     : 0,
            'current'                   : '',
            'edit_mode'                 : false // by default umage editor is turned off
        }, options);



        var get_input_html_data = function() {

            var image_default_size   = $(image_input).data('default-size')
            var image_default_width  = image_default_size ? image_default_size.split('x')[0] : -1
            var image_default_height = image_default_size ? image_default_size.split('x')[1] : -1

            var multiple_attr = $(image_input).attr('multiple')
                multiple_attr = ( !multiple_attr || multiple_attr == '' ) ? false : true

            // EDIT_MODE - if edit_mode set as 'false' images will be just visualized as gallery  
            // KEEP_ASPECT - if this attribute set as true, image cropper would save image proprotions
            // (original prortions if there in no default dimensions. If default sizes setted up,
            // aspect will correspond to specified size)

            // MILTIPLE - if input has no multiple attr and edit_mode = true - uploaded image will
            // immediately go to the editor, gallsery wouldn't be created
            that.params.remote_upload        =   $(image_input).data('remote')             || false
            that.params.image_default_width  =   image_default_width
            that.params.image_default_height =   image_default_height 
            that.params.resource_type        =   $(image_input).attr('name').split('[')[0] || false
            that.params.edit_mode            =   $(image_input).data('edit')               || false
            that.params.multiple             =   multiple_attr
            that.params.keep_aspect          =   $(image_input).data('keep-aspect')        || false

        }

        var append_to_gallery = function(img) {

            if ( that.params.multiple  != true ) {

                $(that.params.gallery).find('img').remove()

            }

            $(that.params.gallery).append(img)
            $(that.params.gallery).simple_progress_bar('remove') 

        }



        // creates the image_collection of image objects
        var handleFileSelect = function(files, loading_status ) {


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
                            name = escape(theFile.name)

                            img.src = e.target.result;
                            img.name = escape(theFile.name)

                            if (  that.params.edit_mode == true  ) {

                                $('#image-editor-area').empty()
                                $('#image-editor-area').append(img)
                                $(img).image_cropper_plugin(that.params)

                                return;

                            }

                            if ( typeof( that.params.gallery ) != 'undefined') {

                                append_to_gallery(img)
                                return;

                            } 


                            return;
                            
                        };

                })(f);

                // Read in the image file as a data URL.
                reader.readAsDataURL(f);

                })(files[i]);    
            } 

        }



        this.clear_file_input = function() {

            $('#image-input-field').replaceWith($('#image-input-field').val('').clone(true));
            image_input = $('#image-input-field')

        };

        this.files_processing = function(files) {

            if ( typeof( that.params.gallery ) != 'undefined') {
                $(that.params.gallery).simple_progress_bar('create', {progress_bar_type : 'gray-circle-bar'}) 
            }

            handleFileSelect(files)

        };



        this.init = function() {

            console.log(this)

                get_input_html_data()

                if ( !this.params.resource_type ) return


                var covering_button = $(image_input).parent().find('button')[0]

                // Crutches for the :focus style: 
                $(covering_button).focus(function(){
                    $(image_input).focus()
                });
                

                $(image_input).off('change')

                $(image_input).on('change', function(event) {

                    that.files_processing(event.target.files)

                }) 

        };


}


var Remote_image_uploader = function( options, image_input, callback ) {


    Image_uploader.call(this, options, image_input, callback ); // отнаследовать

    var that = this

    this.files_processing = function() {

        var url = $(image_input).closest('form').attr('action')

        ajax_file_upload(event.target.files, url, this.params.gallery, add_thumbnail_to_gallery )

    };

    var add_thumbnail_to_gallery = function( data ) {

            for ( var index in data ) {

                var figure = create_image_figure( data[index], callback )

                $( that.params.gallery ).append( figure )

            }
        
            
    };

};


 

$.fn.add_uploaded_files_listener = function( options, callback ) {



    var remote,image_uploader

    remote =  $(this).data('remote') || false

    if ( remote == true ) {

        image_uploader = new Remote_image_uploader( options, this, callback )

    } else {

        image_uploader = new Image_uploader( options, this, callback )

    }

    image_uploader.init()

};
