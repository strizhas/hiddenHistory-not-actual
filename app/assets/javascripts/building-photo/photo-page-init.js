$(window).on('photo-gallery-start' , function() {

    // updating page size paramerts ( look sidebar.coffee )
    $(window).trigger('change_content_area')

    // showing sidebar submenu if it still hidden
    var year_menu = $('#sidebar-photo-content').find('ul')[0]

    if ( !$(year_menu).is(':visible') ) {

        $(year_menu).show();

    }

    // bind image editor plugin to image input
    // before binding we find out this inpup multiple or not

    
    var image_gallery   = $('#basic-photo-gallery')
    var image_input     = $('#image-input-field')
    var upload_options  = { 'gallery' : image_gallery }

    var callback = { 'click' : function(e) {

        e.preventDefault();

        var target_url = $(this).parent().attr('href');
                                

        console.log(target_url)

        load_slider_by_ajax(target_url); 

    }}

    if ( $(image_gallery).length != 0 ) { 

        var figures      = $(image_gallery).find('figure')
        var photo_links  = $(figures).find('.photo-gallery-image-link')

        bind_button_appears_on_figure_hover( figures )
        figures_bind_onclick_slider_ajax_load( photo_links )

    }

    if ( $(image_input).length != 0 ) {
        $('#image-input-field').add_uploaded_files_listener( upload_options , callback )
    }
})