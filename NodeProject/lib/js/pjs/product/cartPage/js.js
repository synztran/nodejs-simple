$(document).ready(() => {
  let currentCart;
  // Init
  $.ajax({
    method: 'GET',
    url: '/cart/get',
    success: (res) => {
      currentCart = res.data;
    },
    error: (res) => {
      console.log(res);
    },
  });
  //remove item from cart
  $('.remove-item-cart, .btn-remove-item').on('click', function (e) {
    e.preventDefault();
    const product_id = $(this).attr('data-id');
    $.ajax({
      type: 'POST',
      url: '/cart/remove-item',
      data: {
        product_id: product_id,
      },
      success: (res) => {
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
  });

  $('.td-quantity button, .element-group-quantity button').on(
    'click',
    function (e) {
      e.preventDefault();
      const getId = $(this).attr('data-id');
      const inputEle = $(`.input-quantity_${getId}`);
      const inputValue = Number(inputEle.val());
      const getAction = $(this).attr('data-type');
      if (inputValue == 1) {
        if (getAction === 'subtract') return;
        if (getAction === 'plus') {
          inputEle.val(inputValue + 1);
        }
      } else {
        if (getAction === 'subtract') {
          inputEle.val(inputValue - 1);
        }
        if (getAction === 'plus') {
          inputEle.val(inputValue + 1);
        }
      }
    }
  );
  // popup edit for mobile
  $('.btn-popup-mobile').on('click', function (e) {
    e.preventDefault();
    const getId = $(this).attr('data-id');
    const ele = $(`#popup-edit-mobile_${getId}`);
    if ($(this)[0].classList.contains('active')) {
      $(this)[0].classList.remove('active');
      $(this)[0].children[0].classList.remove('d-none');
      $(this)[0].children[1].classList.add('d-none');
    } else {
      $(this)[0].classList.add('active');
      $(this)[0].children[0].classList.add('d-none');
      $(this)[0].children[1].classList.remove('d-none');
    }
    if (ele.hasClass('d-flex')) {
      ele.addClass('d-none');
      ele.removeClass('d-flex');
    } else {
      ele.removeClass('d-none');
      ele.addClass('d-flex');
    }
  });

  // Update cart
  $('.btn-update, .btn-update-cart').on('click', function (e) {
    e.preventDefault();
    let newQuantityArr = [];
    $.ajax({
      method: 'GET',
      url: '/cart/get',
      success: (res) => {
        const length = res.data.length;
        for (let i = 0; i < length; i++) {
          let item_quantity = $(`.input-quantity_${i}`).val();
          newQuantityArr.push(item_quantity);
        }
        if (newQuantityArr) {
          $.ajax({
            method: 'POST',
            url: '/cart/update',
            data: { newQuantityArr },
            success: (res) => {
              window.location.reload();
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  });
});
