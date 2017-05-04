function bind_actions_on_photo_gallery( options ) {

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


    if ( $(image_gallery).length != 0 ) { 

        var figures      = $(image_gallery).find('figure')
        var photo_links  = $(figures).find('.photo-gallery-image-link')

        bind_button_appears_on_figure_hover( figures );
        figures_bind_onclick_slider_ajax_load( photo_links , options );
        

    }

    var pagination_links = $('#pagination-section').find('a');

    $(pagination_links).on('click' , function(e) {

        e.preventDefault();

        var url = $(this).attr('href');

        ajax_page_content_update(url);

    })
    

}