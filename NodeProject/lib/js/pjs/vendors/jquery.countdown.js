(function($) {
  'use strict';

  $(document).ready(function() {
<<<<<<< HEAD
    $('.js-timer').countdown('2019/10/05', function(event) {
=======
    $('.js-timer').countdown('2020/01/06', function(event) {
>>>>>>> 7ee5d615b158b44a92ceaa2f57885105920bb303
      var $this = $(this).html(event.strftime(''
        + '<div class="u-timer__section"><strong class="u-timer__amount">%D</strong> <em class="u-timer__period">days</em></div>'
        + '<div class="u-timer__section"><strong class="u-timer__amount">%H</strong> <em class="u-timer__period">hours</em></div>'
        + '<div class="u-timer__section"><strong class="u-timer__amount">%M</strong> <em class="u-timer__period">minutes</em></div>'
        + '<div class="u-timer__section"><strong class="u-timer__amount">%S</strong> <em class="u-timer__period">seconds</em></div>'));
    });
  })

}(jQuery));