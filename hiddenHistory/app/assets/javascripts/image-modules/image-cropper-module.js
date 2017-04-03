// Simple image editor plugin
// Now it could crop image, but later i wand to extend it functionality with rotate and desaturate options
// after image editor plugin applied to img, calculate_image_initial_parametrs method get initial crop parametrs,
// depending of image input params (contained in data- attributes)
// When plugin wrap main editor fields around the selected img 

;(function( $ ){

    methods = {

        extend : function(Child, Parent) {
                    var F = function() { }
                    F.prototype = Parent.prototype
                    Child.prototype = new F()
                    Child.prototype.constructor = Child
                    Child.superclass = Parent.prototype
        }
    
    };

    $.fn.image_cropper_plugin = function(image_params) { 

        var settings = $.extend({
            'current'                   : '',
            'editor_max_width'          : 720,  // editor window max width
            'editor_max_height'         : 720,  // editor window max width
            'dragging'                  : false,
            'scale'                     : 1,
            'close_button'              : true,
            'info_size'                 : true
        }, image_params);


        // edit box constructor
        function edit_box() {

            that = this

            // edit box dragable field
            this.edit_box_field = document.createElement('div');
            $(this.edit_box_field).attr('id','edit_box_main')
            $(this.edit_box_field).hide()

            // create corners of edit box
            this.corners = [
                left_top_corner = new dragable_corner('left_top_corner'),
                right_top_corner = new dragable_corner('right_top_corner'),
                left_bottom_corner = new dragable_corner('left_bot_corner'),
                right_bottom_corner = new dragable_corner('right_bot_corner')
            ]

            // putting corners inside the field
            $(this.edit_box_field).append( this.corners)
            
            this.update = function() {

                console.log('updating')
                var edit_box = this.edit_box_field

                // current image size
                this.max_width  = $('#current_editable_image').width()  || 0
                this.max_height = $('#current_editable_image').height() || 0

                this.offset_x = $(edit_box)[0].getBoundingClientRect().left + $(window)['scrollLeft']();
                this.offset_y = $(edit_box)[0].getBoundingClientRect().top + $(window)['scrollTop']();

                this.left   = parseInt( $(edit_box).css('left'))   || 0
                this.top    = parseInt( $(edit_box).css('top'))    || 0 
                this.width  = parseInt( $(edit_box).css('width'))  || 0
                this.height = parseInt( $(edit_box).css('height')) || 0

 
                settings_to_update = {
                            crop_w   : Math.round( this.width * settings.scale ),
                            crop_h   : Math.round( this.height * settings.scale ),
                            crop_x   : Math.round( this.left * settings.scale ),
                            crop_y   : Math.round( this.top * settings.scale )
                }

                settings = $.extend( settings, settings_to_update )
                update_input_fields()
                add_size_to_information_field()

            }

            this.build_edit_box = function() {
                console.log('build_edit_box')
                return this.corners
            }
            
            $(this.edit_box_field).bind('mousedown' , {event}, function() { that.dragging(event) })
            $(document).bind('mouseup' , function() {  if ( settings.dragging == true ) that.drop() })  

            this.build_edit_box()

        };

        // prototype method for edit box. detecting the current event
        // and firing move or resize method
        edit_box.prototype.dragging = function(e) {

            console.log('call dragging function')     

            var target = e.target || e.srcElement;

            if ( !target ) return

            settings.dragging = true

            // actual settings, depending pf the current corner
            // position and editable image size
            var start_offLeft = e.pageX
            var start_offTop = e.pageY

            // if user click on the corner we call resize method
            if ( $(target).attr('id').indexOf('corner') > -1 ) {
                console.log('resizing')

                // the initial resize params
                // maximum width and height
                var critical_width  = this.max_width
                var critical_height = this.max_height

                console.log('this.max_height = ' + this.max_height)
                console.log('critical_height' + critical_height)

                // absolute center of the edit-field, relative to the window
                var center_pos_x = this.offset_x + this.width / 2
                var center_pos_y = this.offset_y + this.height / 2

                // starting point
                var start_dx = Math.abs( center_pos_x - start_offLeft )
                var start_dy = Math.abs( center_pos_y - start_offTop )

                var resize_params = {
                    critical_width  : critical_width,
                    critical_height : critical_height,
                    center_pos_x    : center_pos_x,
                    center_pos_y    : center_pos_y,
                    start_dx        : start_dx,
                    start_dy        : start_dy
                }

                $(big_preview).bind('mousemove', {event}, function() { that.resize_edit_box(event, start_offLeft, start_offTop, resize_params ) } )   
            } else {
                console.log('dragging')
                $(big_preview).bind('mousemove', {event}, function() { that.move_edit_box(event, start_offLeft, start_offTop ) } )
            }     

            return

        };

        // drop method. Firing at mouseup event, binded in 'dragging' class
        edit_box.prototype.drop = function(e) {
            $(big_preview).unbind('mousemove' );
            $(big_preview).unbind('mouseup' );

            that.update() // updating the edit box metadata

            $(that.edit_box_field).css('cursor','pointer')
            settings.dragging = false
            console.log('stop')
        };

        // main resizing method
        // initializing from method called 'dragging'
        edit_box.prototype.resize_edit_box = function(e,start_offLeft,start_offTop,resize_params) {


            var dx = Math.abs( resize_params.center_pos_x - e.pageX )
            var dy = Math.abs( resize_params.center_pos_y - e.pageY )


            // we choose the way of image resizing. If the keep_aspect parametrs setted, we
            // must include relative scale into calculations 
            if ( settings.keep_aspect == true ) {

                var scale_x =  1 + ( dx - resize_params.start_dx ) / 100
                var scale_y =  1 + ( dy - resize_params.start_dy ) / 100

                var new_width  = Math.round( this.width - ( resize_params.start_dx - Math.max( dx, dy ) ) )
                var new_height = new_width

                

            } else {
               
                var new_width  = Math.round( this.width - ( resize_params.start_dx - dx ) )
                var new_height = Math.round( this.height - ( resize_params.start_dy - dy ) )

            }
            

            // detecting side from wich resizing began
            if ( start_offTop > resize_params.center_pos_y && start_offLeft < resize_params.center_pos_x  ) {
                // bottom left corner
                new_left =  this.left + (this.width - new_width )
                new_top  = this.top

            } else if ( start_offTop < resize_params.center_pos_y && start_offLeft < resize_params.center_pos_x ) {
                // top left corner
                new_left = this.left + (this.width - new_width)
                new_top  = this.top + (this.height - new_height)  

            } else if ( start_offTop < resize_params.center_pos_y && start_offLeft >= resize_params.center_pos_x  ) {
                // top right corner
                new_left = this.left
                new_top = this.top + (this.height - new_height)

            } else {
                // bottom right corner
                new_left = this.left
                new_top  = this.top
            }


            if (new_left   < 0  ||
                new_top    < 0  ||
                new_width + new_left  > resize_params.critical_width ||
                new_height + new_top > resize_params.critical_height
            ) { 
                return 
            }

            edit_box_field = $(this.edit_box_field)[0]

            $(edit_box_field).css({
                width   : new_width,
                height  : new_height,
                left    : new_left,
                top     : new_top
            })
 
        };


        // prototype method to move all edit box across the edit area
        // for resizing we use another method, called 'resize_edit_box'
        edit_box.prototype.move_edit_box = function(e,offLeft,offTop) {
            
            console.log('start moving')

            var left =that.left + e.pageX - offLeft
            var top = that.top + e.pageY - offTop

            if ( left < 0 ) { left = 0 }
            if ( top < 0 ) { top = 0 } 

            if ( left > that.max_width - that.width ) { 
                    left = that.max_width - that.width }

            if ( top > that.max_height - that.height ) { 
                    top = that.max_heigh - that.height } 
            

            $(that.edit_box_field).css({
                            left: left,
                            top: top,
                            cursor: 'move'
            });
       
        };

        // edit box corner class. Create new corner
        function dragable_corner(id) {
                
                el = document.createElement('div')
                $(el).attr('id', id )

                this.element = $(el)

                return $(el)

        };

        methods.extend(dragable_corner, edit_box)


        // this function updating preview box css
        var visualize_box = function(new_w, new_h, new_x, new_y ) {

            console.log( 'visualize_box' )

            new_x = typeof new_x !== 'undefined' ? new_x : settings.crop_x
            new_y = typeof new_y !== 'undefined' ? new_y : settings.crop_y
            new_w = typeof new_w !== 'undefined' ? new_w : settings.crop_w
            new_h = typeof new_h !== 'undefined' ? new_h : settings.crop_h


            $(edit_box.edit_box_field).show()

            // each parametr we divide by scale. it's important because
            // an image size can  be bigger, then the editor window
            $(edit_box.edit_box_field).css({
                    'top'    : Math.round(new_y/settings.scale),
                    'left'   : Math.round(new_x/settings.scale),
                    'width'  : Math.round(new_w/settings.scale),
                    'height' : Math.round(new_h/settings.scale)
                })

            edit_box.update()
            

        };   

        // simply add actual preview size to info-box DIV
        var add_size_to_information_field = function() {

            var info_box = $('#uploaded-info').find('span')[0]
            $(info_box).text( settings.crop_w + 'x' + settings.crop_h )

        };

        // method called 'update_input_fields', but realy it create new input fields every time
        // This inputs contain the actual crop values
        var update_input_fields = function() {

            console.log( 'update_inputs' )

            $(big_preview).find('input').remove()

            var inputs = {  crop_w : settings.crop_w, 
                            crop_h : settings.crop_h, 
                            crop_x : settings.crop_x, 
                            crop_y : settings.crop_y 
                        }
                     

            for ( input_name in inputs ) {
                input = '<input name=' + settings.resource_type 
               
                if ( settings.multiple == true ) {
                    input += '[image][' + settings.current.img.name + ']'
                }   
                input += '[' + input_name + '] '
                input +=  'value="' + inputs[input_name] + '" />'
                $(big_preview).append(input)
            };

        };


        // calculating initial crop and size, depends of current input data attributes
        calculate_image_initial_parametrs = function( img ) {

            var nh,nw,y,x,new_preview_params,orig_w,orig_h

            // creating new image and calculate it original size
            var temp_img = new Image()
                temp_img.src = (img.getAttribute ? img.getAttribute("src") : false) || img.src;


            $(temp_img).on('load' , function() {

                calculate_size_and_proceed()

            })


            // if there is no default settings for image size
            // we set a maximum thumbnail size
            var set_maximum_size = function() {

                return [ orig_w, orig_h, 0, 0]

            };

            // this method will fire if we have default settings for thumbnail image size
            // here we are goung to set size for edit filed area and find coordinates
            var set_thumbnail_size = function() {

                // if image smaller then the default size, we must recalculate the crop           
                if ( orig_w >= settings.image_default_width && orig_h >= settings.image_default_height ) {
                

                    nw = settings.image_default_width
                    nh = settings.image_default_height

                    // crop coodrinates
                    x = Math.round(( orig_w - nw ) / 2)
                    y = Math.round(( orig_h - nw ) / 2)

                } else {

                    or = orig_w/orig_h                // original image aspect ratio
                    nr = settings.image_default_width/settings.image_default_height  // new image aspect ratio

                    if ( or >= nr ) {

                        nh = orig_h
                        nw = Math.round( settings.image_default_width * ( nh / settings.image_default_height ))

                        y = 0
                        x = Math.round(( orig_w - nw ) / 2)

                    } else {

                        nw = orig_w
                        nh = Math.round( settings.image_default_height * ( nw / settings.image_default_width ))

                        x = 0
                        y = Math.round(( orig_h - nh ) / 2)

                    }

                }

                return [nw,nh,x,y]
            };


            var calculate_size_and_proceed = function() {

                orig_w = temp_img.width
                orig_h = temp_img.height

                // defult thumbnail settings depends of the current settings
                // if default sizes set as '-1', the preview will take maximum size
                if ( !settings.image_default_width  || settings.image_default_width  == -1  &&
                     !settings.image_default_height || settings.image_default_height == -1 ) 
                {
                    new_preview_params = set_maximum_size()    
                } else {
                    new_preview_params = set_thumbnail_size()
                }

                // if uloaded image larger then the editor workfield
                if (  orig_w > settings.editor_max_width ) {
                    scale = orig_w/settings.editor_max_width
                } else {
                    scale = 1
                }


                settings = $.extend(settings , {
                        'orig_w'      : orig_w,
                        'orig_h'      : orig_h,
                        'crop_w'      : new_preview_params[0],
                        'crop_h'      : new_preview_params[1],
                        'crop_x'      : new_preview_params[2],
                        'crop_y'      : new_preview_params[3]
                });

                create_or_update_image_editor(img)
                return 

            };

            

        };

        var create_or_update_image_editor = function(editable_img) {

            var image_width = $( editable_img ).width()

            if ( image_width > settings.editor_max_width   ) {

                image_width = settings.editor_max_width
                
                $(editable_img).css({ 'width' : settings.editor_max_width , 'height' : 'auto' })

            }

            settings.scale = settings.orig_w / image_width

            image_editor    = document.createElement('div');
            big_preview     = document.createElement('div');
            info_block      = document.createElement('div');
            info_size       = document.createElement('span');
            remove_image    = document.createElement('div');

            $(image_editor).attr('id','uploaded-image-editor')
            $(big_preview).attr('id','uploaded-image-big_preview')  
            $(editable_img).attr('id','current_editable_image')  
            $(info_block).attr('id','uploaded-info')  
            $(remove_image).attr('id','close-editor-button')
            $(remove_image).addClass('remove-image-button')


            // new draggable edit box (preview area)
            edit_box = new edit_box( ) 

            $(info_block).append(info_size)
            $(editable_img).parent().append(image_editor)
            $(image_editor).append(big_preview)
            $(big_preview).append(editable_img, edit_box.edit_box_field )

            if ( settings.info_size    == true ) $(image_editor).prepend( info_block  ) // block with current preview size
            if ( settings.close_button == true ) $(big_preview).append( remove_image )  // image editor close button

            // hover message with warning
            $(remove_image).promt_builder('закрыть редактор и сбросить изменения')

            // height of page is changing, so we trigger custom event to 
            // recalculate page dimensions    
            $(window).trigger('change_content_area')

            $(remove_image).bind('click' , function() {
                remove_editor_function()
            }) 

            console.log('settings')
             console.log(settings)
            visualize_box()

        };


    // removing image editor and triggering the content change events
    // this events causes recalculations of window dimensions
    var remove_editor_function = function() {

        $('#uploaded-image-editor').remove()
        $(window).trigger('image-editor-close')

    };    

    return this.each(function(){ 

        console.log('cropper start')

        // removing editor if he was already created, 
        if ( $(this).parent().attr('id') == 'uploaded-image-big_preview' ) {
             var image_editor = $(this).parent().parent()
             $(this).parent().parent().parent().append( this )
             $(image_editor).remove()
             return
        }

        // if selected image if already in editor
        if ( $(this).attr('id') == settings.current ) return
        settings.current = $(this).attr('id')

        // this - selected img
        calculate_image_initial_parametrs(this)

    });

  };

})( jQuery );