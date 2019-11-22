var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);
$(document).ready(function() {
	
    $('.btn-delete').on('click', function(e) {
        e.preventDefault();
        const id = $(this).attr('data-id');
        console.log(id);
        $.ajax({
            type: 'DELETE',
            url: '/delete/' + id,
            success: function(res) {
                alert('deleting');
                // location.reload();
            },
            error: function(err) {
                console.log(err);
            }
        })
    })
});