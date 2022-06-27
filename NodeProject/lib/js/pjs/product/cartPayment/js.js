$(document).ready(function () {
  if (typeof Storage !== undefined) {
    window.localStorage.getItem('cart')
      ? ''
      : window.localStorage.setItem('cart', '[]');
  } else {
    console.log('Browser not support localStorage');
  }
  // Format
  function formatSelect2Icon(idioma) {
    var imgData = $(idioma.element).data('image');
    var imgUrl = '/api' + imgData;
    var $span = $(
      "<span style='font-weight: bold'><img style='width:40px;height:40px;object-fit: cover' src='" +
        imgUrl +
        "'/> " +
        idioma.text +
        '</span>'
    );
    return $span;
  }
  // Init
  $('.select2').select2({
    minimumResultsForSearch: -1,
    templateResult: formatSelect2Icon,
  });
  const labelSelect2 = '<label id="label-select2">Country/region</label>';
  $('.select2-selection.select2-selection--single').append(labelSelect2);

  $('html,body').animate({ scrollTop: 0 }, 'normal');
  $('.loading-text')
    .delay(1000)
    .fadeOut('slow', () => {
      $('.loading').delay(500).fadeOut('slow');
    });

  // Handle effect showing label for input
  $('input, textarea').bind('keyup', (e) => {
    const target = e.target.id;
    if (e.target.value) {
      $(`#form-group-${target} label`).css({
        opacity: 1,
        top: '0',
        'pointer-event': 'unset',
      });

      $(`#form-group-${target} input, #form-group-${target} textarea`).css({
        'padding-top': '20px',
        'padding-bottom': '0px',
      });
    } else {
      $(`#form-group-${target} label`).css({ opacity: 0, top: '10px' });
      $(`#form-group-${target} input, #form-group-${target} textarea`).css({
        padding: '10px',
      });
    }
  });

  // handle show voucher code
  $('.discount-input a').on('click', (e) => {
    e.preventDefault();
    let showed = false;
    $('.discount-input a').hasClass('active')
      ? $('.discount-input a').removeClass('active')
      : $('.discount-input a').addClass('active');
    if ($('.discount-input input').hasClass('active')) {
      $('.discount-input input').removeClass('active');
      $('.discount-input div button').removeClass('active');
    } else {
      $('.discount-input input').addClass('active');
      $('.discount-input div button').addClass('active');
    }
  });

  // Handle slide tab form
  const slideContainer = $('.slide-form-content');
  $('.btn-next-step').on('click', function () {
    let currentTab = $(this).parent().parent();
    let nextTab = $(this).parent().parent().parent().next().children();
    if (currentTab.attr('data-id') < 3) {
      $(`#${nextTab.attr('data-title')}`).addClass('slide-active-tab');
      slideContainer.css(
        'transform',
        `translateX(-${currentTab.attr('data-id')}00%)`
      );
    }
  });
  $('.btn-prev-step').on('click', function () {
    let currentTab = $(this).parent().parent();
    // let prevTab = $(this).parent().parent().parent().prev().children();
    $(`#${currentTab.attr('data-title')}`).removeClass('slide-active-tab');
    slideContainer.css(
      'transform',
      `translateX(-${currentTab.attr('data-id') - 2}00%)`
    );
  });

  // Select2 with icon
  const labelSelect2PaymentMethod =
    '<label id="label-select2">Payment method</label>';
  $('.select2-payment-method').select2({
    minimumResultsForSearch: -1,
    templateResult: formatSelect2Icon,
    width: '100%',
  });
  $('.payment-method .select2-selection.select2-selection--single').append(
    labelSelect2PaymentMethod
  );
});
