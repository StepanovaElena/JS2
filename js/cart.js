//Количество отображаемых элментов на странице
var $manGoodsNumber = 9;
//Позиция хлебной крошки
var $crumbsNow = 1;
//Переменная для хранения количества единицы товара
var $itemQnt = 0;

//Функция обработки списка товаров
function buildGoodsList() {
    // Запрашиваем список товаров на складе
    $.ajax({
        url: 'http://localhost:3000/goods',
        dataType: 'json',
        success: function (good) {
            // Перебираем список товаров
            good.forEach( function (item) {
                //Создаем поля постороения списка товаров
                var $divProduct = $('<div />', {
                    class: 'product-block',
                    'data-id': item.id,
                    'data-gender': item.gender
                });
                var $divProductText = $('<div />', {class: 'product-text', 'data-id': item.id})
                    .append($('<h4 />', {text: item.name}))
                    .append($('<p />', {text: '$' + item.price}));

                var $productLink = $('<a />', {class: 'product-link', href: '#', 'data-id':item.id})
                    .append($('<img />', {src: item.image, class: 'img', alt: 'Product' + item.id}));

                var $divProductHov = $('<div />', {class: 'product-hover', 'data-id': item.id});
                var $cartLink = $('<a />', {
                    class: 'cart-link',
                    href: '#',
                    text: 'Add to cart  ',
                    'data-img': item.image,
                    'data-id':item.id,
                    'data-name':item.name,
                    'data-price':item.price,
                    'data-color':item.color,
                    'data-size':item.size,
                    'data-shipping':item.shipping,
                    'data-store':item.store})
                    .append($('<img />', {src: 'images/Forma%201%20copy.svg', 'data-id': item.id, alt: 'Cart'}));
                var $refreshLink = $('<a />', {class: 'cart-link cart-refresh', href: '#'})
                    .append('<i class="fa fa-refresh" aria-hidden="true"></i>');
                var $heartLink = $('<a />', {class: 'cart-link cart-heart', href: '#'})
                    .append('<i class="fa fa-heart-o" aria-hidden="true"></i>');

                $divProductHov
                    .append($cartLink)
                    .append($refreshLink)
                    .append($heartLink);

                $productLink
                    .append($divProductText);

                $divProduct
                    .append($productLink)
                    .append($divProductHov);

                //Проверяем на принадлежность
                if (item.gender === 'man') {
                //Добавляем поля в DOM
                $('div[data-gender-type ="'+ item.gender + '"]').append($divProduct);
                $('.product-block:not(:lt(' + $manGoodsNumber + '))').hide();
                $cartLink.addClass(item.gender + '-cart-link');
                }
                //Добавляем товары на глвную страницу
                $('[data-gender-type ="multi"]').append($divProduct);
                $('[data-gender-type ="multi"]').find('.product-block:not(:lt(' + 8 + '))').hide();
            })

            //Определяем количество хлебных крошек для станицы товаров
            var qntElementGender = $('div[data-gender="man"]').length;
            var qntBredCrumbs = Math.ceil(qntElementGender/$manGoodsNumber);
            //Создаем хлебные крошки
            for (var i = 0; i < qntBredCrumbs; i++) {
                var $liCrumbButton = $('<li />');
                var $aCrumbs = $('<a />', {href: '#', text: i+1, id: i+1, class: 'crumbs-man'});
                $liCrumbButton.append($aCrumbs);
                $('.numbers').append($liCrumbButton);
                $('.man-arrow-right').appendTo('.numbers');
            }
        }
    })
}

//Функция формирования звездного рейтинга
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
  $('.cart-quantity-circle').find('span').remove();
  $('#cart').empty();
  $('.cart-menu').find('.menu-product').remove();

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
                var $p = $('<p />', {text: 'Color: '})
                        .append($('<span />',{text: item.color}));
                var $pSize = $('<p />', {class: 'row-p', text: 'Size: '})
                        .append($('<span />',{text: item.size}));

                var $th = $('<th />', {scope: "row", 'data-id': item.id});
                //Создаем элементы по колонкам таблицы
                // Ячейка цены единицы продукции
                var $tdPrice = $('<td />', {
                    text: '$' + item.price,
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
                    text: '$' + item.price,
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

                $a
                    .append($h4)
                    .append($p)
                    .append($pSize);

                $th
                    .append($a);

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
                var $aImg = $('<a />', {class: 'little-cart-img', href: '#'}).append($('<img />', {src: item.image}));
                var $h4Name = $('<h4 />', {text: item.name});
                var $pQntSum = $('<p />', {text: item.quantity + ' х $' + amount.toFixed(2)});
                var $aGoodDel = $('<a />', {
                    class: 'delete-item delete-item-position',
                    href: '#',
                    'data-id': item.id,
                    'data-quantity': $qntTotal})
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

        //Общее количество товаров в корзине для значка корзины
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

        // Слушаем нажатия на удаление товара из малой корзины
        $('.cart-menu').on('click', '.delete-item', function () {
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
                        quantity: +qnt
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


        //Обработка событий на странице продуктов
        //Слайдер цены
        $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: 500,
            values: [ 52, 300 ],
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
            }
        });
        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
            " - $" + $( "#slider-range" ).slider( "values", 1 ) );

        //Слушаем нажатие по кнопке показать все продукты
        $('.nav-button-man').on('click', function (){
            event.preventDefault();
            $('.product-block:hidden').show();
        });

        //Слушаем нажатие по хлебным крошкам
        $('.numbers').on('click', '.crumbs-man', function (){
        var id = $(this).attr('id');
        $crumbsNow = +id;
        $('.product-block').hide();
        event.preventDefault();
        for ( var i = 0; i < (id*$manGoodsNumber); i++) {
            if( i > id*$manGoodsNumber-($manGoodsNumber+1))
            {
                $('.product-block').eq(i).show();
            } else {
                $('.product-block').eq(i).hide();
            }
        }
        });

        //Позиция хлебной крошки стрелка вправо
        $('.numbers').on('click', '.man-arrow-right', function (){
            event.preventDefault();
            $('.product-block').hide();
            $crumbsNow = $crumbsNow + 1;
            var id = $crumbsNow;
            if ($('.crumbs-man[id="' + id + '"]').length !==0) {
                for (var i = 0; i < (id * $manGoodsNumber); i++) {
                    if (i > id * $manGoodsNumber - ($manGoodsNumber + 1)) {
                        $('.product-block').eq(i).show();
                    } else {
                        $('.product-block').eq(i).hide();
                    }
                }
            }
        });

        //Позиция хлебной крошки стрелка влево
        $('.numbers').on('click', '.man-arrow-left', function (){
            event.preventDefault();
            $('.product-block').hide();
            $crumbsNow = $crumbsNow - 1;
            var id = $crumbsNow;
            if ($('.crumbs-man[id="' + id + '"]').length !==0) {
                for (var i = 0; i < (id * $manGoodsNumber); i++) {
                    if (i > id * $manGoodsNumber - ($manGoodsNumber + 1)) {
                        $('.product-block').eq(i).show();
                    } else {
                        $('.product-block').eq(i).hide();
                    }
                }
            }
        });

    // Слушаем нажатия на кнопку Купить
    $('.general-product-block').on('click','.cart-link', function() {
        $qntTot = 0;
      // Определяем id товара, который пользователь хочет удалить
      var id = $(this).attr('data-id');
      var image = $(this).attr('data-img');
      var name = $(this).attr('data-name');
      var color = $(this).attr('data-color');
      var size = $(this).attr('data-size');
      var price = $(this).attr('data-price');
      var store = $(this).attr('data-store');
      var shipping = $(this).attr('data-shipping');


       // Пробуем найти такой товар в корзине
        $.ajax({
            url: 'http://localhost:3000/cart',
            dataType: 'json',
            success: function (cart) {
                if (cart.length) {
                    cart.forEach(function (item) {
                        if (item.id === id) {
                            console.log(item.id);
                            $itemQnt = item.quantity;
                            console.log($itemQnt);

                            $.ajax({
                                url: 'http://localhost:3000/cart/' + id,
                                type: 'PATCH',
                                headers: {'content-type': 'application/json',},
                                data: JSON.stringify({
                                    quantity: +$itemQnt + 1,
                                }),
                                success: function () {
                                    // Перестраиваем корзину
                                    buildCart();
                                }
                            })
                        } else {
                            // Товара в корзине нет - создаем в заданном количестве
                            $.ajax({
                                url: 'http://localhost:3000/cart',
                                type: 'POST',
                                headers: {'content-type': 'application/json',},
                                data: JSON.stringify({
                                    id: id,
                                    image: image,
                                    name: name,
                                    color: color,
                                    size: size,
                                    price: +price,
                                    store: +store,
                                    shipping: shipping,
                                    quantity: 1
                                }),
                                success: function () {
                                    // Перерисовываем корзину
                                    buildCart();
                                }
                            })
                        }
                    })
                }
            }
        })
    });
  });
})(jQuery);