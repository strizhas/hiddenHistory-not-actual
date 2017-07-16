

var aplication_init_functions = function() {

    // создание пространства имен
    if ( typeof( hiddenHistory) === 'undefined')  { 

        hiddenHistory = {}; 

    }

    // Здесь будут содержатся глобальные параметры
    // в том случае, если они необходимы
    hiddenHistory.global_settings = {}

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

        if ( typeof(hiddenHistory.sidebar) === 'undefined' ) {

            hiddenHistory.sidebar = new Sidebar_menu();

            hiddenHistory.sidebar.init();

        } else {

            hiddenHistory.sidebar.update();

        }

    }

    // Добавляем функции к сайдбару
    // в админ-панели
    if ( $('#admin-sidebar').length != 0 ) {

        bind_admin_sidebar_functions();

    }

    // Добавляем загрузку формы подкатегорий в
    // админке
    if ( $('#admin-categories-list').length != 0 ) {

        bind_add_subcategory_form_ajax_load();
        
    }

    // Добавляем валидации к форме сооружений
    if ( $('#building-form').length != 0 ) {

        validate_building_form();

    }

    // Добавляем валидации к форме статей
    if ( $('#article-form').length != 0 ) {

        validate_article_form();

    }

    // Инициализация схемы
    if ( $('#schema-svg-section').length != 0 ) {

        building_schema_initialize();

    }


    // добавляем ajax и другие необходимые
    // функции к форме комментариев
    bind_comment_form_ajax_response();


    // Jquery validation plugin нативно не имеет 
    // валидации по регулярным выражениям, поэтому 
    // добавляем такую возможность
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "проверьте правильность заполнения поля"
);
    



};

$(document).on('turbolinks:load', aplication_init_functions );

