(function($) {
  'use strict';

  $(document).ready(function() {

    $('.js-timer').countdown('2020/06/05', function(event) {

      var $this = $(this).html(event.strftime(''
        + '<div class="u-timer__section"><strong class="u-timer__amount">%D</strong> <em class="u-timer__period">days</em></div>'
        + '<div class="u-timer__section"><strong class="u-timer__amount">%H</strong> <em class="u-timer__period">hours</em></div>'
        + '<div class="u-timer__section"><strong class="u-timer__amount">%M</strong> <em class="u-timer__period">minutes</em></div>'
        + '<div class="u-timer__section"><strong class="u-timer__amount">%S</strong> <em class="u-timer__period">seconds</em></div>'));
    });
  })

}(jQuery));