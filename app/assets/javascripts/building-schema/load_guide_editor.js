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

            if ( hiddenHistory.global_settings.popup == true ||
                 hiddenHistory.global_settings.lightbox == true ) {

                return;

            } 

            that.destroy();

        })

    };

    this.destroy = function() {

        $('body').css('overflow', '');

        $(this.container).fadeOut('fast', function() { $(this).empty() });

        $(window).trigger('popup_closed');

        delete this

    }

    this.ajax_update_content_area = function( params, callback ) {

        // стандартный набор функций, который срабатывает при 
        // загрузке любого типа content_editor'a
        var common_callback = function(  ) {

            var img = $(that.container).find('#photo-big-preview');

            var edit_button = $('#edit-item-button')
                    
            $(img).resizeImageToContainer( $('#photo-section') );

            bind_likes_button();

            bind_comment_form_ajax_response();

            $(edit_button).on('click' , function() {

                that.load_editor( $(edit_button).data('id') )

            });

            if ( typeof(callback) === 'function' ) {

                callback();

            }

        };

        that.ajax_content_load( this.SHOW_PATH , params, common_callback );

    }

}



Schema_show_photo = function( photo_id ) {


    Schema_content_editor.call(this);


    var after_load_callback = function() {

        $('#photo-big-preview').on('click' , function() {

            load_slider_by_ajax( photo_id, { navigation : false, thumb_slider : false } );

        });

    };

    this.SHOW_PATH = hiddenHistory.schema_URL + '/show_photo_marker/';

    this.init();

    this.ajax_update_content_area( { 'photo_id' : photo_id }, after_load_callback );


};





Schema_show_guide = function( guide_id ) {

    Schema_content_editor.call(this);


    this.SHOW_PATH = hiddenHistory.schema_URL + '/show_guide_marker/'

    this.init();

    this.ajax_update_content_area( { 'guide_id' : guide_id } )

    this.load_editor = function(id) {

        hiddenHistory.schema_item = new Guide_edior();
                    
        hiddenHistory.schema_item.edit_guide(id);

    }

    

};




Guide_edior = function() {

    Schema_content_editor.call(this); // отнаследовать

    var that = this

    that.init();
    

    var basic_callback = function(editor) {

        var form = $(editor.container).find('form').eq(0);

        var uploader_options = { 'gallery' : $('#photo-load-section')}

        if ( form.length != 0 ) {



            $(form).bind_form_ajax_sucess();

            handle_image_to_guide_gallery();

            that.validate_guide_form(form)

        }

    };

    var collect_input_values = function() {

        var form = $(that.container).find('form').eq(0);

        var title_input = $(form).find('#guide_title');
        var url_input   = $(form).find('#guide_url');
        var num_input   = $(form).find('#guide_number');
        
        var guide_params = {}

        $(title_input).on( 'change', function(  ) {

            guide_params['title'] = $(this).val();

        });

        $(url_input).on( 'change', function(  ) {

            guide_params['url'] = $(this).val();

        });

        $(num_input).on( 'change', function(  ) {

            guide_params['number'] = $(this).val();

        });

        return guide_params;

    };

    var new_guide_callback = function() {

        var form = $(that.container).find('form').eq(0);

        // добавляем валидации
        that.validate_guide_form(form);

        // превью прикрепляемого изображения
        handle_image_to_guide_gallery();

        // параметры, которые будет отправлены
        // в меню для создания нового элемента
        var guide_params = collect_input_values();

        // действия, которые будут выполнены
        // после заполнения формы
        var callback = { }

        
        // действия в случае успешного заполнения формы 
        // получаем id созданного guide и добавляем его
        // в маркер и соотвествующий эдемент меню
        callback['success'] = function( id ) {

            // Нужно временно сделать так, чтобы значение было
            // не null. Иначе есть риск удаления из-за
            // срабатывания триггера close_popup
            that.params.marker.params['id'] = 'updating'

            that.params.marker.params['guide_id'] = id;  
            that.params.marker.update('create');

            guide_params['id'] = id

            // добавляем новый элемент в меню
            hiddenHistory.schema_interface.menus.guides.add_guide(guide_params);

        };

        // действия в случае неудачного заполнения формы    
        callback['error'] = function() {
            $(window).trigger('close_popup')
        };


        // действия при закрытии формы
        $(window).on('popup_closed' , function() {

            if ( typeof( that.params.marker.params['guide_id'] ) == 'undefined') {
                that.params.marker.destroy()
            }

        })


        $(form).bind_form_ajax_sucess( callback );


    };

    this.validate_guide_form = function(form) {

        $(form).validate({
            rules:{
                'guide[number]':{
                        regex: "[а-яА-Я0-9]"
                    }
            }


        });

    }

    this.create_new_guide = function( params ) {

        var url = hiddenHistory.schema_URL + '/new_guide/';

        that.params = params

        that.ajax_content_load( url , {}, new_guide_callback );

    }

    this.edit_guide = function(id, callback ) {

        var url = hiddenHistory.schema_URL + '/edit_guide/' + id;

        that.ajax_content_load( url, {}, basic_callback );

    }



};