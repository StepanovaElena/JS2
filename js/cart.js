function buildGoodsList() {
    // Запрашиваем список товаров на складе
    $.ajax({
        url: 'http://localhost:3000/goods',
        dataType: 'json',
        success: function(cart) {
            var $ul = $('<ul />');

            // Перебираем список товаров
            cart.forEach(function(item) {
                // Создаем товар в списке
                var $li = $('<li />', {
                    text: item.name + ' ' + item.price + ' rub.',
                });

                // Поле для ввода количества с ограничением по количеству на складе
                var $quantity = $('<input>', {
                    name: item.name,
                    type: 'number',
                    min: '1',
                    max: item.store,
                    value: "1" });

                // Создаем кнопку для покупки
                var $button = $('<button />', {
                    text: 'Buy',
                    class: 'buy',
                    'data-id': item.id,
                    'data-name': item.name,
                    'data-price': item.price,
                    'store': item.store,
                });

                // Добавляем все в dom
                $li
                    .append($quantity)
                    .append($button);

                $ul.append($li);
            });
            // Добавляем все в dom
            $('#goods').append($ul);
        }
    })
}

function move(e, obj){
    var progress = e.pageX - obj.offset().left;
    var rating = progress * 5 / $('.stars').width();
    obj.next().width(progress);
}

//Обработка данных корзины
//Переменая для хранения общей стоимости товара в корзине
var $amountTot = 0;
var $qntTot = 0;
//Функция выстраивания списка товаров, нходящихся в корзине

function buildCart() {

  // Очищаем корзину
  $('#cart').empty();
  // Отправляем запрос на получение списка товаров в корзине
  $.ajax({
    url: 'http://localhost:3000/cart',
    dataType: 'json',
    success: function(cart) {
        if (cart.length) {
            // Перебираем товары
            cart.forEach(function (item) {
                // Создаем tr - элемент строки товара в таблице
                var $tr = $('<tr />', {class: 'table-row', 'data-id': item.id});
                // Переменная для хранения стоимости одной позиции товара в корзине
                var amount = 0;
                //Выстраивание полей основной страницы корзины
                // Создаем элементы таблицы в строке товара в колонке Product Details
                var $a = $('<a />', {class: 'row-a', href: '#'}).append($('<img />', {src: item.image}));
                var $h4 = $('<h4 />', {text: item.name});
                var $p = $('<p />', {text: item.color});
                var $th = $('<th />', {scope: "row", 'data-id': item.id});
                //Создаем элементы по колонкам таблицы
                // Ячейка цены единицы продукции
                var $tdPrice = $('<td />', {
                    text: '$' + item.price.toFixed(2),
                    'data-id': item.id,
                    'data-name': 'unit-price'
                });
                //Ячейка количества добавленного товара с полем input
                var $tdQnt = $('<td />');
                var $inputQnt = $('<input>', {
                    class: 'unt-qnt',
                    'data-id': item.id,
                    name: item.name,
                    type: 'number',
                    min: '1',
                    max: item.store,
                    value: item.quantity
                });
                $inputQnt.attr('title', 'Available for order only ' + item.store + ' unit(s) of item.');
                // Ячейка итоговой суммы первично
                var $tdTot = $('<td />', {
                    text: '$' + item.price.toFixed(2),
                    'data-id': item.id,
                    'data-name': 'subtotal'
                });
                // Ячейка способа доставки
                var $tdShp = $('<td />', {text: item.shipping, 'data-id': item.id, 'data-name': 'shipping'});

                // Проверяем на ограничения по складу
                if (+item.quantity > +item.store) {
                    //Переменная для количества позиции товара в корзине
                    var $qntTotal = +item.store;
                    // Подсчитываем стоимость в позиции корзины
                    amount += $qntTotal * +item.price;
                    // Записываем итоговую стоимость
                    $tdTot.text('$' + amount.toFixed(2));
                    // Добавляем значение после проверки в ячейку количества
                    $('input[data-id="' + item.id + '"]').text($qntTotal);
                    // Добавляем стоимость к итоговой
                    $amountTot = $amountTot + amount;
                    $qntTot = $qntTot + $qntTotal;

                } else {
                    $qntTotal = +item.quantity;
                    // Подсчитываем стоимость в позиции корзины
                    amount += $qntTotal * +item.price;
                    // Создаем поле для записи количества товара в корзине
                    $tdTot.text('$' + amount.toFixed(2));
                    // Добавляем значение после проверки в ячейку количества
                    $('input[data-id="' + item.id + '"]').text($qntTotal);
                    // Добавляем стоимость к итоговой
                    $amountTot = $amountTot + amount;
                    $qntTot = $qntTot + $qntTotal;
                }

                // Создаем кнопку для удаления товара из корзины
                var $tdDel = $('<td />');
                var $aDel = $('<a />', {
                    class: 'delete-item',
                    href: '#',
                    'data-id': item.id,
                    'data-quantity': $qntTotal
                })
                    .append('<i class="fa fa-times-circle" aria-hidden="true"/>');
                    $tdDel.append($aDel);

                // Добавляем в DOM поля основной страницы корзины
                $tdQnt.append($inputQnt);

                $th
                    .append($a)
                    .append($h4)
                    .append($p);

                $tr
                    .append($th)
                    .append($tdPrice)
                    .append($tdQnt)
                    .append($tdShp)
                    .append($tdTot)
                    .append($tdDel);

                $('#cart').append($tr);

                //Создаем поля малой корзины
                var $divGood = $('<div />', {class: 'menu-product menu-product-' + item.id, 'data-id': item.id});
                var $divText = $('<div />', {class: 'menu-product-text menu-product-' + item.id + '-text', 'data-id': item.id});
                var $divStar = $('<div />')
                    .append($('<div />', {class: 'stars'}))
                    .append($('<p />', {class: 'progress'}));
                var $divRait = $('<div />', {
                        id: 'rating',
                        class: 'reviewStars-input',
                        'data-id': item.id})
                        .append ($divStar);

                //
                var $aImg = $('<a />', {class: 'little-cart-img', href: '#'}).append($('<img />', {src: item.image}));
                var $h4Name = $('<h4 />', {text: item.name});
                var $pQntSum = $('<p />', {text: item.quantity + ' х $' + amount.toFixed(2)});
                var $aGoodDel = $('<a />', {
                    class: 'delete-item delete-item-position',
                    href: '#',
                    'data-id': item.id,
                    'data-quantity': $qntTotal
                })
                    .append('<i class="fa fa-times-circle" aria-hidden="true"/>');

                $divText
                    .append($h4Name)
                    .append($divRait)
                    .append($pQntSum);
                $divGood
                    .append($aImg)
                    .append($divText)
                    .append($aGoodDel);
                //Добавляем поля малой корзины в DOM
                $('.cart-menu .triangle').after($divGood);
            });
        } else {
              $('#cart').append($('<p />', {text:'There are no products in your shopping cart.'}))
        }

      // Добавляем все в DOM
        $('#cart-total > h5').find('span').remove();
        $('#cart-total > h5').append($('<span />',{text:' $' + $amountTot.toFixed(2)}));

        $('#cart-total > h4').find('span').remove();
        $('#cart-total > h4').append($('<span />',{text:' $' + $amountTot.toFixed(2)}));

        $('.cart-menu > h2').find('span').remove();
        $('.cart-menu > h2').append($('<span />',{text:' $' + $amountTot.toFixed(2)}));

        //Общее количество товаров в корзине
        $('.cart-quantity-circle').find('span').remove();
        $('.cart-quantity-circle').append($('<span />',{text: $qntTot}));
    }
  })
}

(function($) {
    $(function () {

        //Обработка данных корзины
        //Первичная запись значений итоговой суммы в корзину
        $('#cart-total > h5').append($('<span />',{text:' $' + $amountTot.toFixed(2)}));
        $('#cart-total > h4').append($('<span />',{text:' $' + $amountTot.toFixed(2)}));
        $('.cart-menu > h2').append($('<span />',{text:' $' + $amountTot.toFixed(2)}));
        $('.cart-quantity-circle').append($('<span />',{text: $qntTot}));

        // Рисуем корзину
        buildCart();
        // Рисуем список товаров
        buildGoodsList();

        //Наведение на корзину
        $('.header-cart-button').hover(
            function(){$('.cart-flex').show();},
            function() {$('.cart-flex').hide(6000);}
        );

        // Слушаем нажатия на удаление товара из корзины
        $('#cart').on('click', '.delete-item', function () {
            //Обнуляем корзину
            $qntTot = 0;
            // Получаем id товара, который пользователь хочет удалить
            var id = $(this).attr('data-id');
            // Отправляем запрос на удаление
            $.ajax({
                url: 'http://localhost:3000/cart/' + id,
                type: 'DELETE',
                success: function () {
                    // Перерисовываем корзину
                    buildCart();
                }
            })
        });

        // Слушаем нажатия на изменение количества товара в корзине
        $('#cart').on('input', '.unt-qnt', function () {
            //Получаем значение количества
            var qnt = $(this).val();
            //Получаем значение id товара из корзины
            var id = $(this).attr('data-id');
            //Обнуляем корзину
            $qntTot = 0;

            if (qnt > 0) {
                // Отправляем запрос на изменение количества
                $.ajax({
                    url: 'http://localhost:3000/cart/' + id,
                    type: 'PATCH',
                    headers: {'content-type': 'application/json'},
                    data: JSON.stringify({
                        quantity: qnt
                    }),
                    success: function () {
                        // Перерисовываем корзины
                        buildCart()
                    }
                })
            }
        });

        // Слушаем нажатие на кнопку очистки корзины
        $('.cart-button').on('click', 'button', function() {
            //Обнуляем корзину
            $qntTot = 0;

            $.ajax({
                url: 'http://localhost:3000/cart',
                dataType: 'json',
                success: function(cart) {
                    cart.forEach(function(elem) {
                        var id = elem.id;
                        // Отправляем запрос на удаление
                        $.ajax({
                            url: 'http://localhost:3000/cart/' + id,
                            type: 'DELETE',
                            success: function () {
                                // Перерисовываем корзины
                                buildCart();
                            }
                        })
                    })
                }
            })
        });

        //Слушаем события на малой корзине при оценки товара звездным рейтингом
        $('.cart-menu').on('click', '#rating .stars', function(e){
            $(this).toggleClass('fixed');
            move(e, $(this));
        });

        $('.cart-menu').on('mousemove', '#rating .stars', function(e){
            if ($(this).hasClass('fixed') === false) move(e, $(this));
        });



    // Слушаем нажатия на кнопку Купить
    $('#goods').on('click', '.buy', function() {
      // Определяем id товара, который пользователь хочет удалить
      var id = $(this).attr('data-id');
      var name = $(this).attr('data-name');
      var qnt = $('input[name="' + name + '"]').val();
      // Пробуем найти такой товар в корзине
      var entity = $('#cart [data-id="' + id + '"]');
      if(entity.length) {
        // Товар в корзине есть, отправляем запрос на увеличение количества
        $.ajax({
          url: 'http://localhost:3000/cart/' + id,
          type: 'PATCH',
          headers: {
            'content-type': 'application/json',
          },
          data: JSON.stringify({
            quantity: +$(entity).attr('data-quantity') + +qnt,
          }),
          success: function() {
            // Перестраиваем корзину
            buildCart();
          }
        })
      } else {
        // Товара в корзине нет - создаем в заданном количестве
        $.ajax({
          url: 'http://localhost:3000/cart',
          type: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          data: JSON.stringify({
            id: id,
            quantity: qnt,
            name: $(this).attr('data-name'),
            price: $(this).attr('data-price'),
            store:$(this).attr('store'),
          }),
          success: function() {
            // Перерисовываем корзину
            buildCart();
          }
        })
      }
    });    
  });
})(jQuery);