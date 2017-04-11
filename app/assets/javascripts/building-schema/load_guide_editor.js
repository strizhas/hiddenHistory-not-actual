Schema_content_editor = function() {

    var that = this


    this.ajax_content_load = function( url, params, callback ) {

        $.ajax({
                url: url,
                method: 'POST',
                dataType: 'HTML',
                cache: true,
                data: params,
                beforeSend : function() {

                     $(that.container).fadeIn('fast');
                     $(that.container).simple_progress_bar('create', {progress_bar_type : 'gray-circle-bar'});

                },
                success: function(data, textStatus, jqXHR) 
                {

                    console.log('sucess');

                    $(that.container).html(data);

                    $(that.container).mouseenter(function(event) {
                        $('body').css('overflow', 'hidden');
                    }).mouseleave(function(event) {
                        $('body').css('overflow', '');
                    });
    
                    $('#close-show-photo-button').on('click' ,  function() { that.destroy(); } )

                    if (typeof( callback ) === 'function' ) {

                        callback(that);
                    }

                },
                error: function(data) 
                {      

                    $(that.container).html('<div class="pop-up-error">произошла какая-то ошибка</div>');

                    setTimeout( function() {

                        that.destroy();

                        if ( typeof(active_marker) != 'undefined' ) {

                            active_marker.marker_drop();
                        }

                    }, 1000)

                    
                }

        });

    }; 

    this.init = function() {

        this.container = $('#schema-photo-show-container')

        if ( $(this.container).length == 0 ) {

            this.container = document.createElement('div');

            $(this.container).attr('id','schema-photo-show-container')
                            .appendTo('#schema-svg-section');
        }

        $(window).on('close_popup' , function() {

            that.destroy();

        })

    };

    this.destroy = function() {

        $('body').css('overflow', '');
        $(this.container).fadeOut('fast', function() { $(this).empty() })

        $(window).trigger('popup_closed')
        delete this

    }

    this.ajax_update_content_area = function( params ) {

        var callback = function() {

            var img = $(that.container).find('#photo-big-preview');
                    
            $(img).resizeImageToContainer( $('#photo-section') );

            bind_likes_button();

            // Реинициализируем или создаем и инициализируем
            // объект комментариев для нормальной работы ajax
            if ( typeof(comment) == 'undefined' ) {

                comment = new Comment_form();
                comment.init();
                    
            } else {

                comment.init();

            }

        };

        that.ajax_content_load( this.SHOW_PATH , params, callback );

    }

}



Schema_show_photo = function( photo_id ) {

    Schema_content_editor.call(this);

    this.SHOW_PATH = window.location.href + '/show_photo_marker/'

    this.init();

    this.ajax_update_content_area( { 'photo_id' : photo_id } );

};


Schema_show_guide = function( guide_id ) {

    Schema_content_editor.call(this);

    this.SHOW_PATH = window.location.href + '/show_guide_marker/'

    this.init();

    this.ajax_update_content_area( { 'guide_id' : guide_id } )
   

};



Guide_edior = function( id ) {

    Schema_content_editor.call(this); // отнаследовать

    var that = this

    that.init()

    var basic_callback = function(editor) {

        var form = $(editor.container).find('form')

        var uploader_options = { 'gallery' : $('#photo-load-section')}

        if ( form.length != 0 ) {

            $(form).bind_form_ajax_sucess();

            $('#image-input-field').add_uploaded_files_listener(uploader_options);

        }

    }

    this.create_new_guide = function( callback ) {


        var url = window.location.href + '/new_guide/';

        that.ajax_content_load( url , {}, callback );

    }

    this.edit_guide = function(id, callback ) {

        var url = window.location.href + '/edit_guide/' + id;

        that.ajax_content_load( url, {}, callback );

    }

};