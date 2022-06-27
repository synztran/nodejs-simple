$(document).ready(function () {
  $('html,body').animate({ scrollTop: 0 }, 'normal');
  $('.loading-text')
    .delay(1000)
    .fadeOut('slow', () => {
      $('.loading').delay(1000).fadeOut('slow');
    });
});
