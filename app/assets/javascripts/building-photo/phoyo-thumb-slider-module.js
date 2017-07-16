

thumbnails_slider = function( parent, options, callback ) {
  

        var current_offset = 0                  // смещение слайдера
        var visible_last_index = 0              // индекс самой правой фотографии, нахадящийся в видимой области
        var total = 0                           // общее количество загруженных в слайдер фотографий
        var figure_width = 0
        var visible_width = 0         
        var sliding = false                     // true когда слайдер двигается
        var last_img_id = 0                     // id последней загруженной фотографии
        var load_new = true                     // загружать новые фотографии при прокрутке вправо

        
        var container_width = $(parent).width()

        var visible_photos_count = Math.round( container_width / (150+20) ) 

        // набор настроек, расширяемых извне
        // placed : true  - показывать только фото с кооринатами. Нужно для схем
        // placed : true  - показывать только фото без кооринатами. Нужно для схем
        var request_data = $.extend({
            count : visible_photos_count * 3
        }, options.parsed_url_options );


        this.elements = {}      // объект, в котором будут хранится DOM элементы слайдера (кнопки и т.п.)
        
        var collection = []    // массив, в котором будут хранится объекты фотографий

        var slider = this

        var elems = this.elements

        

        var self_destroy = function() {

            $(elems.container).remove()

            delete slider

            $(window).trigger('change_content_area')

        };

        var create_slider_elements = function() {


            elems.container     = $('<div id="slider_thumb_container">');
            elems.slider        = $('<div id="slider_thumb_slider">');
            elems.wrapper       = $('<div id="slider_thumb_wrapper">');
            elems.left_button   = $('<div id="thumb_button_left">');
            elems.right_button  = $('<div id="thumb_button_right">');
            elems.frame         = $('<div id="slider_thumb_frame">');


            $(elems.left_button).addClass('slider_button_left').hide()
            $(elems.right_button).addClass('slider_button_right')


            $(elems.left_button).on(  'click' , function() { 
                                    thumb_gallery_slide_left()
                                });

            $(elems.right_button).on( 'click' , function() { 
                                    thumb_gallery_slide_right()
                                });


            $(elems.slider).append(elems.wrapper).appendTo(elems.frame)
            $( elems.container ).append( elems.left_button, elems.frame , elems.right_button)

            $(parent).append(  elems.container )


            $(window).trigger('change_content_area')

        };

        var calculate_slider_params = function() {
  
            figure_width =  $( collection[0] ).width() +
                            parseInt( $( collection[0] ).css('marginRight') ) + 
                            parseInt( $( collection[0] ).css('marginLeft')  ) + 6
                            || 180



            request_data.count = Math.round( $(elems.container).width() / figure_width )
            visible_width = Math.round( request_data.count * figure_width )

            total = collection.length


            if ( total < request_data.count ) {

                $( elems.left_button ).fadeOut('fast')
                $( elems.right_button ).fadeOut('fast')

            }

            var actual_width = total * figure_width

            if ( actual_width >= 9999 ) {

                $('#slider_thumb_slider').css('width', actual_width + 'px');

            }

            // id крайней загруженной фотографий
            // с этого id начнется загрузка следующей порции фотографий
            // при прокрутке слайдера
            last_img_id  = $( collection [collection.length-1] ).find('img').eq(0).data('id')
            first_img_id = $( collection [0] ).find('img').eq(0).data('id')


        };

        var append_single_figure = function( figure ) {

            collection.push( figure )

            $( elems.wrapper ).append( figure )

        };

        var add_loaded_figures_to_slider = function( data ) {


            for ( var index in data ) {

                var figure = create_thumb_figure( data[index], callback );

                append_single_figure(figure);

            }


            // если в коллекции нет фотографий, удаляем слайдер
            if ( collection.length == 0 ) {

                    return;
            }


            // если ajax запрос вернул меньше фотографий, чем мы запросили
            // то это означает, что мы уже загрузили все фотографии
            if ( data.length < visible_photos_count ) {

                    load_new = false;
            }

            calculate_slider_params();                            

            find_visible_images_last_index(); 

        };

        var add_existing_figures_to_slider = function() {

            $(elems.container).simple_progress_bar('remove');

            for ( var i = 0 ; i < options.figures.length ; i++ ) {

                var new_figure =  $( options.figures[i] ).clone();

                var img = $(new_figure).find('img');

                var id = $(img).attr('id').replace('gallery-item-', '');
                
                $(img).data('id' , id );

                $(img).off('click').on( 'click' , function(e) { e.preventDefault() });

                $(img).on(callback);

                append_single_figure( new_figure );

                bind_button_appears_on_figure_hover( new_figure );

            }

            calculate_slider_params();                            

            find_visible_images_last_index(); 

        };


        var ajax_data_load = function( optional_data ) {

            console.log( 'ajax_data_load')

            var start_url = ( window.location.pathname );

            var ajax_data = $.extend( request_data,  optional_data );

            $.ajax({
                url: start_url + '/load_slider_photos',
                method: 'POST',
                dataType: 'json',
                cache: false,
                data: ajax_data, 
                beforeSend: function() 
                    {      


                    },
                success: function(data, textStatus, jqXHR) 
                    {

                        $(elems.container).simple_progress_bar('remove');

                        setTimeout( function() {

                            add_loaded_figures_to_slider( data );

                        }, 300 )
                                            
                    },
                error: function(data) 
                    {

                        $(elems.container).simple_progress_bar('remove')

                    } 

                })

        };




        // thumbnail gallery sliding function. Fired from 'thumb_gallery_slide' function
        var thumb_gallery_slide_left = function( sliding_offset ) {

            if (  sliding == true ) { return false; }


            var slider_left_pos = parseInt( $( elems.slider ).css('left') ) || 0

            sliding = true;
            
            current_offset = slider_left_pos + visible_width;

            if ( current_offset > -100 ) {

                current_offset = 0;
                $( elems.left_button ).fadeOut('fast');

            }

            $( elems.slider ).animate( { 'left' : current_offset }, 
                                                         { duration : 300, 
                                                           complete : function() { 
                                                                            sliding = false 
                                                                            find_visible_images_last_index()
                                                                        }
                                                          }
                                                        )

            $( elems.right_button ).fadeIn('fast');

            return true

        };


        var thumb_gallery_slide_right = function( ) {
            

            if ( sliding == true ) { 
                return false; 
            }

            var slider_left_pos = parseInt( $( elems.slider ).css('left') ) || 0

            var next_offset = slider_left_pos - visible_width;

            var animation_complete_function = function() {

                sliding = false;

                current_offset = next_offset;

                find_visible_images_last_index();

            }


            sliding = true;


            if ( -1*next_offset > $( elems.wrapper ).width() - visible_width ) {

                next_offset = -1 * ( $( elems.wrapper ).width() - $( elems.frame ).innerWidth() );

                $(elems.right_button).fadeOut('fast');

            }

            

            $(  elems.slider ).animate( { 'left' : next_offset }, 
                                        { duration : 300, 
                                          complete : animation_complete_function
                                        });       
            

            $( elems.left_button ).fadeIn('fast');


            if ( visible_last_index + request_data.count <= total && load_new == true ) {

                ajax_data_load( { id: last_img_id, direction: 'next' } );        

            }

            return true;

        };


        find_visible_images_last_index = function() {

            var left_invisible_part_width = Math.round( (-1*current_offset)/figure_width );

            visible_last_index = left_invisible_part_width + request_data.count;

        };


        
            
        return {

            init : function() {

                create_slider_elements();

                // добавялем индикатор загрузки
                $(elems.container).simple_progress_bar('create', {progress_bar_type : 'gray-circle-bar'}); 

                if ( 'figures' in options ) {

                    add_existing_figures_to_slider();

                    // Если вместе с параметрами были переданы
                    // ссылки на элементы figure, присутсвующие в DOM, 
                    // то новые  подгружатся не будут
                    load_new = false;

                } else {

                    ajax_data_load( );

                }

                return;


            },

            update : function() {

                calculate_slider_params();

            }

        }
    
    };
