$(document).ready(function () {
  var ADDTOCART_TIMEOUT = 1000;
  let currentCart;
  if (typeof Storage !== undefined) {
    if (!window.localStorage.getItem('cart')) {
      window.localStorage.setItem('cart', '[]');
    }
    // window.localStorage.getItem('cart') !== 'undefined' && JSON.parse(window.localStorage.getItem('cart')).length > 0 ? '' : window.localStorage.setItem('cart', "[]")
    currentCart = JSON.parse(window.localStorage.getItem('cart'));
  } else {
    console.log('Browser not support localStorage');
  }
  // Init
  $('html,body').animate({ scrollTop: 0 }, 'normal');
  $('.loading-text')
    .delay(1000)
    .fadeOut('slow', () => {
      $('.loading').delay(1000).fadeOut('slow');
    });

  $('.select2').select2({ minimumResultsForSearch: -1 });
  new Zooming({ bgColor: 'rgb(0,0,0)' }).listen('.img-zoomable');

  var currentDataImage = $('#lightSlider li');
  var currentImage = $('#lightSlider li img');
  var currentImageSrc = $('#lightSlider li img').attr('src');

  var imgElements = $('#lightSlider li img');
  var imgLi = $('#lightSlider li');
  var img, url, imageli;

  for (var i = 0; i < imgElements.length; i++) {
    img = imgElements[i];
    imageli = imgLi[i];
    var sam = imageli.getAttribute('data-thumb');
    imageli.setAttribute('data-thumb', img.src);
  }
  $('.btn-join, #btn-add').on('click', function (e) {
    e.preventDefault();
    var id = $(this).attr('data-id');
    var url = $(this).attr('data-url');
    window.location.href = '/shop/payment/' + url;
  });
  var url = window.location.href;
  var res = url.split('/').pop();

  var $carousel = $('#lightSlider').slick({
    dots: false,
    arrows: false,
    swipeToSlide: true,
    infinite: false,
    adaptiveHeight: true,
    draggable: true,
  });
  $('.2nd-slick').slick({
    slidesToShow: 9,
    slidesToScroll: 1,
    asNavFor: '#lightSlider',
    dots: false,
    adaptiveHeight: true,
    focusOnSelect: true,
    arrows: true,
  });

  var select = $('#select-product');
  var selectQuantity = $('#select-product > option');
  $('#select-product').each((e) => {
    const product_price = $(this).find('option:selected').attr('data-price');
    const isAvailable = $(this).find('option:selected').attr('data-oos');
    const product_id = $(this).find('option:selected').attr('data-value');
    $("input[name='product_id']").val(product_id);
    if (isAvailable == 1) {
      $('#oos-price').css('display', 'none');
      $('#og-price').html(
        new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'USD',
        }).format(product_price)
      );
      $('#btn-atc').attr('disabled', false);
    } else {
      $('#oos-price').css('display', 'unset');
      $('#og-price').css('display', 'none');
      $('#btn-atc').attr('disabled', true);
    }
  });
  $('#select-product').change(function (e) {
    const product_price = $(this).find('option:selected').attr('data-price');
    const isAvailable = $(this).find('option:selected').attr('data-oos');
    const product_id = $(this).find('option:selected').attr('data-value');

    // this goTo return id of img
    goTo = select.val();
    $carousel.slick('goTo', goTo);
    $('#input-product-id').val(product_id);
    if (isAvailable == 1) {
      $('#oos-price').css('display', 'none');
      $('#og-price').css('display', 'unset');
      $('#og-price').html(
        new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'USD',
        }).format(product_price)
      );
      $('#btn-atc').attr('disabled', false);
    } else {
      $('#oos-price').css('display', 'unset');
      $('#og-price').css('display', 'none');
      $('#btn-atc').attr('disabled', true);
    }
  });

  fetch('/api/product/getcid/' + res)
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(function (responseAsJson) {
      var product = responseAsJson;
      if (product[0].outstock != 1) {
        $('#btn-add').attr('disabled', true);
      }
      $('#c-profile').change(function () {
        // $('.product-details-price span').remove();
        for (var i in product) {
          if (this.value == i) {
            $('#product-name').html(product[i].product_name);
            if (product[i].outstock == 1) {
              $('.block-price_currency').html('$' + product[i].price + ' USD');
              $('#btn-add').attr('disabled', false);
            } else {
              $('.block-price_currency').html(
                "<span style='color: red'>Out stock</span>"
              );

              $('#btn-add').attr('disabled', true);
              // $("#btn-paypal").attr("disabled", true)
            }
          }
        }
        // if(this.value == product[i].product_id){
        //     console.log(product[i].product_id)
        // }
      });
    });

  fetch('/api/category/getcid/' + res)
    .then(function (response2nd) {
      if (!response2nd.ok) {
        throw Error(response2nd.statusText);
      }
      return response2nd.json();
    })
    .then(function (response2ndAsJson) {
      var category = response2ndAsJson;
      var status = category.status_gb;
      if (status == 0 || status == 1) {
        $('#btn-add, #btn-paypal').attr('disabled', true);
      } else {
      }
    });

  $('.btn-close-toast').on('click', (e) => {
    $('#toastNoti').removeClass('show');
  });

  // Handle add cart
  $('#form-add-cart').on('submit', (e) => {
    e.preventDefault();
    $('#btn-atc span').addClass('d-none');
    $('#btn-atc div').removeClass('d-none');
    $('#btn-atc').addClass('pe-none');
    const formData = $('#form-add-cart').serializeArray();
    $.ajax({
      type: 'POST',
      url: '/cart/add',
      data: {
        product_id: formData[1].value,
        product_quantity: formData[2].value,
        // 'cart': window.localStorage.getItem('cart'),
      },
      success: (res) => {
        if(res.flag === 407){
          $('#toastNoti').addClass('show');
          $('.toast-body').css('color', 'red')
          $('.toast-body').html(res.message);
        }else{
          $('#toastNoti').addClass('show');
           $('.toast-body').css('color', 'green')
          $('.toast-body').html(res.message);
          const currentNoCart = $('#cart-icon label').text();
          $('#cart-icon label').html(
            Number(currentNoCart) + Number(formData[2].value)
          );
          $('#cart-icon label').addClass('ping-active');
          setTimeout(() => {
            $('#cart-icon label').removeClass('ping-active');
          }, 1000);
          setTimeout(() => {
            $('#toastNoti').removeClass('show');
          }, $('#toastNoti').attr('data-bs-delay'));
        }
         setTimeout(() => {
            $('#btn-atc span').removeClass('d-none');
            $('#btn-atc div').addClass('d-none');
            $('#btn-atc').removeClass('pe-none');
          }, ADDTOCART_TIMEOUT);
        
      },
      error: (err) => {
        console.log(err);
      },
    });
  });
});
