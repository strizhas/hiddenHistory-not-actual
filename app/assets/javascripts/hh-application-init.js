

var aplication_init_functions = function() {


    create_background_black_tint();


    if ( sessionStorage ) {

         var user_id = sessionStorage.getItem("user_id");

        if ( user_id == null ) {

            get_current_user_id();

        }

    }


    if ( $('#post-image-upload').length != 0 ) {

        handle_image_to_editor();

    }

    if ( $('#registration-form').length != 0 ) {

        validate_registration_form();
    }

    if ( $('#main-sidebar').length != 0 ) {

        if ( typeof(sidebar_menu) === 'undefined' ) {

            sidebar_menu = new Sidebar_menu();

            sidebar_menu.init();

        } else {

            sidebar_menu.update();

        }

    }

    if ( $('#admin-sidebar').length != 0 ) {

        bind_admin_sidebar_functions();

    }

    if ( $('#admin-categories-list').length != 0 ) {

        bind_add_subcategory_form_ajax_load();
        
    }

    if ( $('#building-form').length != 0 ) {

        validate_building_form();

    }

    if ( $('#article-form').length != 0 ) {

        validate_article_form();

    }


    bind_comment_form_ajax_response();
    



};

$(document).on('turbolinks:load', aplication_init_functions );

