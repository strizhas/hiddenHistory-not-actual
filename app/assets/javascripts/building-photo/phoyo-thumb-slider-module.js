

thumbnails_slider = function( current_id, parent, options, callback ) {

        

        var current_offset = 0                  // смещение слайдера
        var visible_last_index = 0              // индекс самой правой фотографии, нахадящийся в видимой области
        var total = 0                           // общее количество загруженных в слайдер фотографий
        var figure_width = 0
        var visible_width = 0         
        var sliding = false                     // true когда слайдер двигается
        var maximum_last_img_id = undefined     // id последней загруженной фотографии при достижении слайдером конца выборки
        var last_img_id = 0                     // id последней загруженной фотографии

        
        var container_width = $(parent).width()
        var visible_photos_count = Math.round( container_width / (150+20) ) 

        // набор настроек, расширяемых извне
        // placed : true  - показывать только фото с кооринатами. Нужно для схем
        // placed : true  - показывать только фото без кооринатами. Нужно для схем
        var request_data = $.extend({
            count : visible_photos_count * 3
        }, options);


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

        var append_single_figure = function( params ) {

            var figure = create_thumb_figure(params, callback )

            collection.push( figure )

            $( elems.wrapper ).append( figure )

        };

        var add_loaded_figures_to_slider = function( data ) {


            for ( var index in data ) {

                append_single_figure(data[index])

            }


            // если в коллекции нет фотографий, удаляем слайдер
            if ( collection.length == 0 )
                {
                    return
                }


            // если ajax запрос вернул меньше фотографий, чем мы запросили
            // то это означает, что мы уже загрузили все фотографии
            if ( data.length < visible_photos_count ) 
                {
                    maximum_last_img_id = $( collection[collection.length-1] ).find('img').eq(0).data('id')
                }

            calculate_slider_params()                            

            find_visible_images_last_index() 

        };


        var ajax_data_load = function( optional_data ) {


            var start_url = ( window.location.pathname );

            var ajax_data = $.extend( request_data,  optional_data );

            console.log('slider start sdsd2 23 wdsds')
            console.log(ajax_data)

            $.ajax({
                url: start_url + '/load_slider_photos' ,
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

            if ( typeof( sliding_offset ) == 'undefined') {
                sliding_offset = visible_width;
            }


            var slider_left_pos = parseInt( $( elems.slider ).css('left') ) || 0

            sliding = true;
            
            current_offset = slider_left_pos + sliding_offset;

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

        // thumbnail gallery sliding function. Fired from 'thumb_gallery_slide' function
        var thumb_gallery_slide_right = function( sliding_offset ) {
            

            if ( sliding == true ) { 
                return false; 
            }

            if ( typeof( sliding_offset ) == 'undefined') {

                sliding_offset = visible_width;
                load_new = true;

            } else {

                load_new = false;

            }


            var slider_left_pos = parseInt( $( elems.slider ).css('left') ) || 0

            var next_offset = slider_left_pos - sliding_offset;

            var animation_complete_function = function() {

                sliding = false;

                current_offset = next_offset;

                find_visible_images_last_index();

            }


            sliding = true;

            if ( visible_last_index + request_data.count <= total  && 
                 maximum_last_img_id  == undefined && load_new == true ) {

                // если в параметрах были переданы id изображений
                // то мы загружаем им один раз в начале и больше
                // не подгружаем
                if ( typeof(options.ids) != 'undefined' ) {

                    return;

                }

                ajax_data_load( { id: last_img_id, direction: 'next' } );
                

            }


            if ( -1*next_offset > $( elems.wrapper ).width() - sliding_offset ) {

                next_offset = -1 * ( $( elems.wrapper ).width() - $( elems.frame ).innerWidth() );

                $(elems.right_button).fadeOut('fast');

            }

            

            $(  elems.slider ).animate(  { 'left' : next_offset }, 
                                        { duration : 300, 
                                            complete : animation_complete_function
                                        });       
            

            $( elems.left_button ).fadeIn('fast');

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

                ajax_data_load( );


            },

            update : function() {

                calculate_slider_params();

            }

        }
    
    };




$.fn.add_thumbnail_slider = function( current_id, options, callback ) {

    thumbnail_slider = new thumbnails_slider( current_id, this, options, callback );

    thumbnail_slider.init();

    return thumbnail_slider;
};
