"use strict";
//Позиция слйдера
var slideNow = 1;
// Индекс кнопки по которой произошел клик
var navBtnId = 0;
//Расстояние на которое смещается слайдер
var translateWidth = 0;
// Максимально возможное количество показываемых отзывов
var sliderMax = 7;
//Счетчик слайдов
var j = 0;


//Функция генерации случайного числа
function randomId (min, max){
    var rnd = min - 0.5 + Math.random() * (max - min +1)
    rnd = Math.round(rnd);
    return rnd;
}
//Функция уведомления для пользвателя
function userText(text) {
    //Создаем элемент для сообщения
    var $span = $('<span />', {
        id: "userText",
    });
    $span.append(text);
    //Очищаем поле отзыва
    $('.fieldReview').val('');
    //Показываем сообщение добавляя в DOM
    $('#newReview').append($span).show();
}

(function($) {
    $(function () {

        //Размещение отзыва пользователем
        //Слушаем событие по кнопке отправить
        $('#newReview').on('click', 'review-submit-button', function() {
            //Проверяем заполнено ли поле текста отзыва
            if ($('.fieldReview').val() !== '') {
                //Проверяем оставлен ли отзыв авторизированным пользователем
                $.ajax({
                    url: 'http://localhost:3000/enter',
                    dataType: 'json',
                    success: function (enter) {
                        if (enter.length !== 0) {
                            var element = {text: $('.fieldReview').val(), userId: enter.userId};
                        } else {
                            var element = {text: $('.fieldReview').val(), userId: Math.round(Math.random() * 10001)};
                        }
                    }
                });
                //Добавляем отзыв пользователя на сервер
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:3000/review',
                    headers: {'content-type': 'application/json'},
                    data: JSON.stringify(element)
                });
                //Запускаем функцию проверки отзыва на стороне администратора
                reviewExam ();
                //
                $('#newReview').children('#userText').remove();
                //
                var $text = "Thank you! Your feedback has been sent to moderator.";
                //
                userText($text);
            } else {
                //
                $('#newReview').children('#userText').remove();
                //
                var $textError = "Your review is empty ! Try again!";
                //
                userText($textError);
            }
       });

        $('#slidewrapper').css('width', 'calc(100% *' + sliderMax + ')');

        //Добавление отзывов на сайт
        for (j; j < sliderMax; j++) {
            //направляем запрос на получение данных об отзывах
            $.ajax({
                url: 'http://localhost:3000/review',
                dataType: 'json',
                success: function (review) {
                    //Формируем случаную выборку отзывов
                    var i = randomId(0, review.length-1);
                    var item = review[i];
                 //Направляем запрос на получение данных о пользавтелях на сервере
                    $.ajax({
                        url: 'http://localhost:3000/profile',
                        dataType: 'json',
                        success: function (profile) {
                            profile.forEach(function (user) {
                                // Создаем поле для текста отзыва
                                var $img = $('<img />', {
                                    src: "",
                                    alt: "",
                                    id: item.id
                                });

                                var $p = $('<p />', {
                                    id: item.userId,
                                    text: item.text
                                });

                                var $h4 = $('<h4 />', {
                                    id: item.userId,
                                    class: 'user-name'
                                });

                                var $h5 = $('<h5 />', {
                                    id: item.userId,
                                    class: 'user-location'
                                });

                                //Добавляем отзыв в DOM
                                var $divElem = $('<div />', {class: 'li-slide meaning', id: item.userId})
                                    .append($img)
                                    .append($p)
                                    .append($h4)
                                    .append($h5);
                                

                                $('#slidewrapper').append($divElem);

                                $('.li-slide').css('width', 'calc(100% /' + sliderMax+ ')');

                                //Создаем кнопку слайдера
                                var $divBtn = $('<div />', {class: 'slide-nav-btn line', id: item.userId, 'data-count': j});
                                $('#nav-btns').append($divBtn);

                                if (item.userId === user.userId) {
                                    // Добавляем атрибуты
                                    $img.attr('src', user.photo);
                                    $img.attr('alt', user.name);
                                    $h4.text(user.name);
                                    $h5.text(user.location);
                                } else {
                                    // Добавляем атрибуты для анонимного пользователя
                                    $img.attr('src', "images/Layer_anonim.png");
                                    $img.attr('alt', user.name);
                                    $h4.text('User ID ' + item.userId);
                                    $h5.text('Not specifying');
                                }
                            });
                        }
                    })
                    $('.slide-nav-btn').first().addClass('active-link');
                }
            });
        }

        $('#nav-btns').on('click', '.slide-nav-btn', function () {
            //Стираем у всех кнопок слайдера класс активной ссылки
            $('.slide-nav-btn').removeClass('active-link');
            //получаем индекс кнопки
            navBtnId = $(this).index();
            // проверяем произошел ли клик по текущему слайду или нет
            if (navBtnId + 1 !== slideNow) {
                // Вычисляем значение смещения слайдера
                translateWidth = -$('#viewport').width() * (navBtnId);
                //задаем свойство транслейт
                $('#slidewrapper').css({'transform': 'translate(' + translateWidth + 'px, 0)'});
                // перезаписываем позицию текущего слайда
                slideNow = navBtnId + 1;
                //Добавляем значение active
                $(this).addClass('active-link');
            }
        });
    });
})(jQuery);




