// this plugin calculate img and container sizes and if image 
// is larger, than container, resize it to fill container

// used in 'photo-main-slider-block.js' and 'schema-ajax-functions.js'

;(function() {

    var get_properties = function(img, container, callback ) {

        $(img).on('load' , function() {

            var img_width  = $(img).width()
            var img_height = $(img).height()


            if ( img_width == 0 || img_height == 0 ) { return false; } 

            var container_width  = $(container).width()
            var container_height =  $(container).height()


            if (  img_width > container_width || img_height > container_height ) {

                    var image_ratio = img_width   / img_height
                    var container_ratio = container_width / container_height

                    if ( image_ratio > container_ratio ) {
                        $(img).css({ 
                                        'width'  : container_width + 'px',
                                        'height' : 'auto' 
                                        })
                    } else {
                        $(img).css({ 
                                        'width'  : 'auto',
                                        'height' : container_height + 'px' 
                                        })
                    }

                    img_width  = $(img).width()
                    img_height = $(img).height()
            
            };

            if ( callback && typeof(callback) === 'function' ) {

                callback();

            };

        });

    };

    $.fn.resizeImageToContainer = function(container, callback) {

        return get_properties( this, container, callback );

    };

})(jQuery);