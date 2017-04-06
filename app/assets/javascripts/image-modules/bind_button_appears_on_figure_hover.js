function bind_button_appears_on_figure_hover(figures) {

    console.log('bind_button_appears_on_figure_hover')

    $(figures).image_editor_window();

     $(figures).on({
        mouseenter: function () {
            $(this).find('a, button').animate( { opacity : 1 }, 100 )
            return true;
        },
        mouseleave: function () {
            $(this).find('.image-edit-button').animate( { opacity : 0 }, 100 )
            return false;
        }
    });
};
