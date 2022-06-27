$(document).ready(function () {
  const textArr = document.querySelectorAll('.text');
  const colorArr = [
    '#fefefe',
    '#ff9b00',
    '#ff3434',
    '#db38f0',
    '#0096fb',
    '#00c500',
    '#ffd200',
  ];
  textArr.forEach((text, index) => {
    text.style.color = colorArr[index];
  });
  var x = document.cookie;
  const ggcaptchasitekey = '6Lcti9UUAAAAADIUivaJtXit0OKia78-EQIbnDkc';
  fetch('/get_cookie')
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      // Read the response as json.
      return response.json();
    })
    .then(function (responseAsJson) {
      var user = responseAsJson;
      var formLogin = $('.swal2-container').clone()[0];
      $('#form-login').remove();
    })
    .catch(function (error) {
      console.log('Looks like there was a problem: \n', error);
    });

  // preload effect
  $('html,body').animate({ scrollTop: 0 }, 'normal');
  $('.loading-text')
    .delay(1000)
    .fadeOut('slow', () => {
      $('.loading').delay(500).fadeOut('slow');
    });
});
