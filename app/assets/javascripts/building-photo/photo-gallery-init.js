function init_photo_gallery( options ) {

    // updating page size paramerts ( look sidebar.coffee )
    $(window).trigger('change_content_area')


    var year_menu = $('#sidebar-photo-content').find('ul')[0];
    var pagination_links = $('#pagination-section').find('a');
    var image_gallery    = $('#basic-photo-gallery');


    // Демонстрируем меню выбора года в сайдбаре 
    if ( $(year_menu).length != 0 && !$(year_menu).is(':visible') ) {

        $(year_menu).show();

    } else {


        if ( typeof( hiddenHistory ) !== 'undefined' &&
             typeof( hiddenHistory.sidebar ) !== 'undefined' ) 
        {

            hiddenHistory.sidebar.create_photos_menu();

        }

    }

    // Если есть галерея, то находим в ней изображения 
    // и вешаем на них функцию вызова слайдера
    if ( $(image_gallery).length != 0 ) { 

        var figures = $(image_gallery).find("figure");

        if ( 'context' in figures) {

            delete figures['context'];

        }

        if ( 'prevObject' in figures) {

            delete figures['prevObject'];

        }

        if ( 'selector' in figures) {

            delete figures['selector'];

        }

        bind_button_appears_on_figure_hover( figures );

        figures_bind_onclick_slider_ajax_load( figures );

        

    }

    // добавлем ajax щагрузку страниц для пагинации
    $(pagination_links).on('click' , function(e) {

        e.preventDefault();

        ajax_page_content_update( $(this).attr('href') );

    })
    

}