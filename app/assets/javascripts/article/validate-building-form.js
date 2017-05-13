function validate_article_form() {

    var form = $('#article-form').find('form').eq(0);

    $(form).validate({
        rules:{
            'article[title]':{
                    required: true,
                    rangelength: [5,100]
                },

            'article[intro]':{
                    required: true
                },
            'article[text]':{
                    required: true
                }
        },
        messages:{
            'article[title]':{
                required: "вы не указали название статьи",
                rangelength: "Выберете имя в диапозоне от 5 до 100 символов"
            },
            'article[intro]': {
                required: "пожалуйста заполните краткое описание",
            },
            'article[text]': {
                required: "вы не заполнили содержание статьи",
            }
        }

    });
}