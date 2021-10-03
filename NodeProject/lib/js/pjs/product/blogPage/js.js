
$(document).ready(function(){
	 var zeynep = $('.zeynep').zeynep({
    opened: function () {
    }
  })

  // dynamically bind 'closing' event
  zeynep.on('closing', function () {
  })

  // handle zeynepjs overlay click
  $('.zeynep-overlay').on('click', function () {
    zeynep.close()
  })

  // open zeynepjs side menu
  $('.btn-open').on('click', function () {
    zeynep.open()
  })
})