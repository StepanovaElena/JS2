"use strict";

(function($){
    $(function(){
        $.ajax ({
            url: 'http://localhost:3000/review',
            dataType: 'json',
            success: function (review) {
                //Создаем сообщение о наличие нерассмотренных отзывов
                $('body').append($('<h3 />', {text:'You have new customer reviews!', class: 'add-new-review'}));
                review.forEach(function (item) {

                    //Проверка был ли рассмотрен отзыв
                    if (item.step !== 2){
                    //Если не был, то добавляем его для рассмотрения модератором
                        // Создаем поле для текста отзыва
                    var $p = $('<p />', {
                        id: item.userId,
                    });
                        //Получаем значение текста отзыва в переменную
                    var $text = item.text;
                        //Создаем кнопку одобрить для конкретного отзыва
                    var $btnApprove = $('<button />', {
                        class: "approve",
                        text: "Approve",
                        'data-id': item.userId,
                        id: item.id
                    });
                        //Создаем кнопку удалить для конкретного отзыва
                    var $btnDelete = $('<button />', {
                        class: "delete",
                        text: "Delete",
                        'data-id': item.userId,
                        id: item.id
                    });
                        //Добавляем данные отзыва
                    $p.append("User ID: " + item.userId + "  Отзыв: " + $text);
                        //Добавляем отзыв в DOM
                    var $divElem = $('<div />', {class: 'review', id: item.userId})
                        .append($p)
                        .append($btnApprove)
                        .append($btnDelete);

                    $('#newReviewContainer').append($divElem);

                    $('#newReview').children('#userText').remove();
                    }
                });
                    //Проверка, что новых отзывов не поступало
                if( $('#newReviewContainer').is(':empty')) {
                    $('.add-new-review').remove();
                    $('body').append($('<h3 />', {text:"You haven't new customer reviews!"}));
                }
                    //Подтверждение отзыва
                $('.review').on('click', '.approve', function () {
                    //Получаем id отзыва
                    var id = $(this).attr('id');
                    //Выводим сообщение об одобрении отзыва
                    $('div[id = "' + $(this).data("id") + '"]').append('You approved a user review with ID: ' + $(this).data("id")).show();
                    //Скрываем кнопки одобрения и удаления
                    $('.approve[id = "' + this.id + '"]').hide();
                    $('.delete[id = "' + this.id + '"]').hide();
                    $('h3').remove();
                    //Отправляем данные об одобрении на сервер
                    $.ajax({
                        url: 'http://localhost:3000/review/' + id,
                        type: 'PATCH',
                        headers: {
                            'content-type': 'application/json',
                        },
                        data: JSON.stringify({
                            step: 2,
                            action: "show",
                        }),
                        success: function () {
                        }
                    });
                });
                    //Отклонение отзыва
                $('.review').on('click', '.delete', function () {
                    $('div[id = "' + $(this).data("id") + '"]').children().hide();
                    $('div[id = "' + $(this).data("id") + '"]').append('You rejected a user review with ID: ' + $(this).data("id")).show();
                    var userId = $(this).data("id");
                    var idElem = $(this).attr('id');

                    $.ajax({
                        url: 'http://localhost:3000/review/' + idElem,
                        type: 'DELETE',
                        success: function () {
                            $('div[id = "' + userId + '"]').children().remove();
                        }
                    })
                });
            }
        });

    });
})(jQuery);