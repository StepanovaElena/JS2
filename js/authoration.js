"use strict";

var validRule = {
    phone: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
    email: /^(([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/,
    name: /^[A-zА-яЁё]+( [a-zA-Zа-яА-Я']+)*$/,
    cardnumber: /(\d{4}([-]|)\d{4}([-]|)\d{4}([-]|)\d{4})/,
    card: /(\d{4}([-]|)\d{4}([-]|)\d{4}([-]|)\d{4})/,
    fname: /^[A-Z][a-zA-Z-_\.]{1,20}$/,
    lname: /^[A-Z][a-zA-Z-_\.]{1,20}$/
};

var textError = {
    phone: 'Entered number does not match the format "+7(777)777-7777" ',
    email: 'Email address does nt match the format "user@mail.domain"',
    cardnumber: 'Entered card number does not match the format "ХХХХ-ХХХХ-ХХХХ-ХХХХ"',
    card: 'Entered card number does not match the format "ХХХХ-ХХХХ-ХХХХ-ХХХХ"',
    fname: 'Name must contain only letters "a-z", the first letter is uppercase',
    lname: 'Surname must contain only letters "a-z", the first letter is uppercase'
};

//Функция формирования пользовательского аккаута после успешной регистрации
function accountForming () {

    $('.account-flex').css({'display': 'none'});

    $.ajax({
        url: 'http://localhost:3000/enter',
        dataType: 'json',
        success: function (enter) {
            if (enter.length !== 0) {

                enter.forEach(function (userAuth) {
                    var loginUserId = userAuth.userId;
                    var loginUserLog = userAuth.login;
                    var loginUserEnterId = userAuth.id;
                    $.ajax({
                        url: 'http://localhost:3000/profile',
                        dataType: 'json',
                        success: function (profile) {
                            profile.forEach(function (user) {
                                if ((loginUserId === user.userId) && (loginUserLog === user.login)) {

                                    var $divLogin = $('<div />', {class: 'user-form'});
                                    $('.user-menu').append($divLogin);

                                    // Создаем поля для данных зарегистрированного пользователя
                                    var $img = $('<img />', {
                                        src: user.photo,
                                        alt: user.userId,
                                        id: user.id
                                    });

                                    var $pID = $('<p />', {
                                        id: user.userId,
                                        text: 'ID  ' + user.userId
                                    });

                                    var $h5 = $('<h5 />', {
                                        id: user.userId,
                                        text: 'User login:  ' + user.login
                                    });

                                    var $h4 = $('<h4 />', {
                                        id: user.userId,
                                        text: user.name
                                    });

                                    var $pGnd = $('<p />', {
                                        id: user.userId,
                                        text: 'Gender:  ' + user.gender
                                    });

                                    $('.user-form')
                                        .append($img)
                                        .append($pID)
                                        .append($h4)
                                        .append($h5)
                                        .append($pGnd);

                                    Object.keys(user).forEach(function (i) {
                                        if ((i !== "userId") && (i !== "id") &&
                                            (i !== "name") && (i !== "gender") &&
                                            (i !== "photo") && (i !== "login")) {
                                            var $input = $('<input />', {
                                                'data-id': user.userId,
                                                id: i + user.userId,
                                                name: i,
                                                value: user[i],
                                                class: 'user-input',
                                                'data-user-validation-rule': i
                                            });
                                            $('.user-form').append($input);
                                        }
                                    });

                                    var $btnChange = $('<button />', {
                                        class: 'change-data',
                                        text: 'Change data',
                                        'data-id': user.id,
                                    });

                                    var $btnLogout = $('<button />', {
                                        'data-logo-id': loginUserEnterId,
                                        class: 'user-logout',
                                        text: 'Logout',
                                        'data-id': user.id
                                    });

                                    //Добавляем в DOM
                                    $('.user-form')
                                        .append($btnChange)
                                        .append($btnLogout)
                                        .css({'display': 'block'})
                                        .attr('data-id', user.id);

                                    $('.user-form.input').prop('disable', true);

                                    $('.user-flex').css({'display': 'block'});

                                    $('.my-account').remove();

                                    //Проверяем есть ли у пользователя фото в базе
                                    if ($img.attr('src') !== undefined) {
                                    } else {
                                        $img.attr('src', "images/Layer_anonim.png");
                                    }

                                    //Создаем кнопку пользователя
                                    $('.account-button').append($('<a />', {
                                        text: user.name,
                                        class: 'my-account',
                                        id: 'user-account'
                                    }));
                                    $('#user-account')
                                        .prepend($('<i class="fa fa-user-circle-o" aria-hidden="true" style="padding-right: 5px; color:#ffffff"></i>'));

                                    //Добавляем кнопку закрытия
                                    $('.user-menu').prepend($('<button />', {
                                        class: 'user-close',
                                        style: 'top: 10px; left: 278px'
                                    }));
                                    $('.user-close').append($('<i class="fa fa-times" aria-hidden="true"></i>'));

                                }
                            });
                        }
                    });
                });
            }
        }
    });

}
function validationCheck (userFields) {
    //Переходим к проверке в соответвии с правилами
    Object.keys(validRule).forEach(function (rule) {
        if (userFields !== undefined) {
            var fields = document.querySelectorAll('[data-user-validation-rule = "' + rule + '"]');
        } else {
            var fields = document.querySelectorAll('[data-validation-rule = "' + rule + '"]');
        }
        //Проверяем в соответвии с правилами
        fields.forEach(function (field) {
            if (validRule[rule].test(field.value)) {
                field.classList.remove('invalid');
            } else {
                field.classList.add('invalid');
                //Выводим сообщения ошибки заполнения
                Object.keys(textError).forEach(function (error) {
                    var $pError = $('<p />', {
                        class: 'errorMessage',
                        text: textError[error],
                    });
                    if ((rule === error) && (userFields !== undefined)) {
                        $('[data-user-validation-rule = "' + error + '"]').before($pError);
                    } else {
                        $('[data-validation-rule = "' + error + '"]').before($pError);
                    }
                })
            }
        })
    });
}

function correctData () {

    $('.reg-span').after($('<p />', {
        text:'Invalid login or password. Try again!',
        class: 'account-invalid account-reg-span'}));
    $('.account-flex').css({'display': 'block'});
}

(function($) {
    $(function () {

        //Загрузка данных ползователя, если он не вышел из аккаунта
        accountForming ();

        //Вход в аккаунт
        //Слушаем нажатие по кнопке входа в аккаунт
         $('.account-button').on('click', '#my-account', function(){
            //Убираем предыдущие записи об ошибках
            $('.account-invalid').remove();
            //Убираем кнопку закрытия формы
            $('.reg-close').remove();
             //Показываем меню формы
            $('.account-flex').css({'display': 'block'});
            //Добавляем кнопку закрытия
            $('.account-menu').prepend($('<button />', {
                class: 'reg-close',
                style: 'top: 10px; left: 278px'
            }));
            $('.reg-close').append($('<i class="fa fa-times" aria-hidden="true"></i>'));
        });

        //Слушаем нажатие по кнопке закрытия формы входа в аккаунт
        $('.account-flex').on('click', '.reg-close', function(){
            $('.account-flex').css({'display': 'none'});
            this.remove();
        });

        //Слушаем событие кнопки входа аккаунт
        $('.account-menu').on('click', '#login-button', function(){

            //Убираем все сообщения ошибок регистрации
            $('.account-invalid').remove();
            //Берем значеие введенных данных из формы
                var dataEmail = $('input[name="login"]').val();
                var dataPass = $('input[name="password"]').val();
            //Направляем запрос на сверку данных с базой пользователей
                $.ajax({
                    url: 'http://localhost:3000/profile',
                    dataType: 'json',
                    success: function (profile) {
                        profile.forEach(function (user) {
                                if (user.login === dataEmail && user.password === dataPass ) {
                                 var userAuth = {userId: user.userId, login: user.login, password: user.password};
                                   // Отправляем запрос на добавление данных входа
                                    $.ajax({
                                        url: 'http://localhost:3000/enter',
                                        type: 'POST',
                                        headers: {'content-type': 'application/json'},
                                        data: JSON.stringify(userAuth),
                                        success: function () {
                                            accountForming();
                                            //Очищаем поля ввода
                                            $('.form').find(':input').val('');

                                        }
                                    });
                                } else {
                                        correctData();
                                }
                        })
                    }
                });
            event.preventDefault();
        });

        //Регистрация нового пользователя
        //Слушаем нажатие по кнопке регитсрации
        $('#reg-link').on('click', function() {

            $('#msform:input').removeClass('invalid');
            //Показать форму регистрации
            $('.reg-flex').css({'display': 'block'});
            //Скрыть форму входа в аккаунт
            $('.account-flex').hide();
            //Добавляем кнопку закрытия формы регистрации
            var $btnClose = $('<button />', {
            id: 'reg-close',
            class: 'action-button',
            text: 'Close registration form'
            });
            $('[data-validation-rule = "cardnumber"]').after($btnClose)
        });

        //Слушаем нажатие по кнопке отправке данных
        $('#reg-submit').on('click', function() {
            //Убираем все сообщения ошибок регистрации
            $('.errorMessage').remove();
            //Показываем блок регистрации
            $('.reg-flex').css({'display': 'block'});
            //Отменяем стандартное действие
            event.preventDefault();
            //Получение данных из формы и проверка на выполнение правил
             var dataEmail = $('input[name="email"]').val();
             var dataPass = $('input[name="pass"]').val();
             var dataConfPass = $('input[name="cpass"]').val();
             var dataName = $('input[name="fname"]').val();
             var dataSurname = $ ('input[name="lname"]').val();
             var dataGender = $ ('.gender').val();
             var dataPhone = $('input[name="phone"]').val();
             var dataCard = $('input[name="cardnumber"]').val();
            //Проверяем совпадает ли пароль
            if (dataPass !== dataConfPass) {
                //Выводим сообщение о несовпадении
                var $pError = $('<p />', {
                    class: 'errorMessage',
                    text: '<- Passwords do not match!!!',
                    style: 'top: 143px'
                });
                $('[data-validation-rule = "pass"]').after($pError);
            } else {
                validationCheck();
                //Проверяем, что полей с ошибкой нет и направляем запрос на проверку базы
                    if($('input').is('.invalid')) {
                    } else {
                        //Переменная проверки статуса существования в базе
                        var $newUser;
                        //Проверяем на наличие пользователя в базе с такими же данными пароля или логина
                        $.ajax({
                            url: 'http://localhost:3000/profile',
                            dataType: 'json',
                            success: function (profile) {
                                profile.forEach(function (user) {
                                    //Проверяем наличие пароля и логина
                                    if ((user.login === dataEmail) && (user.password === dataPass)) {
                                        var $pError = $('<p />', {
                                            class: 'errorMessage',
                                            text: 'The user with such login/password already exist!'
                                        });
                                        //Выводим сообщение об ошибке
                                        $('[data-validation-rule = "email"]').before($pError);
                                        $newUser = 2;
                                    }
                                });
                            //Проверяем что пользователя в базе нет и создаем запрос на создание записи данных
                            if ($newUser !== 2) {
                            $.ajax({
                                url: 'http://localhost:3000/profile',
                                type: 'POST',
                                headers: {'content-type': 'application/json',},
                                data: JSON.stringify({
                                    userId: Math.round(Math.random() * 1001),
                                    photo: "",
                                    name: dataSurname + ', ' + dataName,
                                    location: "",
                                    gender:dataGender,
                                    login: dataEmail,
                                    password: dataPass,
                                    email: dataEmail,
                                    phone: dataPhone,
                                    card: dataCard,
                                }),
                                success: function() {
                                //Скрываем кнопку отправки
                                    $('#reg-submit').hide();
                                //Создаем и выводи сообщение об успешной регистрации
                                    var $p = $('<p />', {
                                        class: 'successMessage',
                                        text: 'Registration success',
                                    });
                                    $('[data-validation-rule = "cardnumber"]').after($p);
                                    //Очищаем поля ввода
                                    $('#msform.input').empty();
                                }
                            })
                            }
                            }
                        });
                    }
            }
        });

        //Слушаем нажатие по кнопке закрытия формы регитсрации
        $('.reg-flex').on('click','#reg-close', function() {
            //Деактивируем требование required
            $('#msform.input').removeAttr('required');
            //Скрываем форму регистрации
            $('.reg-flex').css({'display': 'none'});
            //Удаляем кнопку
            this.remove();
        });

        //Выход из аккаунта
        //Слушаем нажатие по кнопке закрытия информации пользователя
        $('.user-flex').on('click','.user-close', function() {
        //Скрываем форму
        $('.user-flex').css({'display': 'none'});
        });

        //Слушаем нажатие по кнопке открытия информации пользователя
        $('.account-button').on('click','#user-account', function() {
            //Скрываем форму
            $('.user-flex').css({'display': 'block'});
        });

        //Слушаем нажатие по кнопке выхода из информации пользователя
        $('.user-flex').on('click','.user-logout', function() {
            //Получаем серверный идентификатор пользователя
            var id = $(this).attr('data-logo-id');
            //Убираем кнопку пользователя
            $('#user-account').remove();
            //Вычищаем данные пользователя
            $('.user-menu')
                .children()
                .remove();
            //Скрываем форму
            $('.user-flex').css({'display': 'none'});
             //Создаем кнопку входа в аккаунт
            $('.account-button').append($('<a />', {
                id:'my-account',
                class: 'my-account',
                href:"#",
                text: 'My account'
            }));
            $('#my-account').append($('<i class="fa fa-caret-down" aria-hidden="true"></i>'));

            //Направляем запрос на удаление данных из блока регистрации
            $.ajax({
                url: 'http://localhost:3000/enter/' + id,
                type: 'DELETE',
                success: function () {}
            })
        });

        //Слушаем нажатие по кнопке изменения информации пользователя
        $('.user-flex').on('click','.change-data', function() {
            var userFields = 1;
            //Убираем все сообщения об ошибках
            $('.errorMessage').remove();
            //Получаем серверный идентификатор пользователя
            var id = $(this).attr('data-id');
            //Получаем значения полей
            var dataPhone = $('.user-form').find(':input[name="phone"]').val();
            var dataCard = $('.user-form').find(':input[name="card"]').val();
            var dataEmail = $('.user-form').find(':input[name="email"]').val();
            //Проверяем на правила
            validationCheck(userFields);
            //Проверяем, что полей с ошибкой нет и направляем запрос на изменение базы
            if($('input').is('.invalid')) {
            } else {
                $.ajax({
                    url: 'http://localhost:3000/profile/' + id,
                    type: 'PATCH',
                    headers: {'content-type': 'application/json'},
                    data: JSON.stringify({
                        phone: dataPhone,
                        card: dataCard,
                        email: dataEmail
                    }),
                    success: function () {location.reload();}
                })
            }
        });
    });
})(jQuery);

//$input.prop('disable', true);
//var dataForm = $('.reg-form').serializeArray();

//var data = dataForm.map(function(item){
// return (item.name +':'+ item.value);
//});
//Проверяем корректность заполнения полей