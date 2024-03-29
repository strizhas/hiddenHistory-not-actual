

var aplication_init_functions = function() {


    create_background_black_tint();


    if ( sessionStorage ) {

         var user_id = sessionStorage.getItem("user_id")

        if ( user_id == null ) {

            get_current_user_id();

        }

    }

    // загрузчик изображений для страницы с 
    // настройками профиля пользователя
    if ( $('#users-setting').length != 0  ) {

        var input = $('#image-input-field');
        $(input ).add_uploaded_files_listener();

    }

    if ( $('#main-sidebar').length != 0 ) {

        if ( typeof(sidebar_menu) === 'undefined' ) {

            sidebar_menu = new Sidebar_menu();

            sidebar_menu.init();

        } else {

            sidebar_menu.update();

        }

    }


    if ( typeof(comment) == 'undefined' ) {

        comment = new Comment_form()
        comment.init()

    }

    



};

$(document).on('turbolinks:load', aplication_init_functions );

