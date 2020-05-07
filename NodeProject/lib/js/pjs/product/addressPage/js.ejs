$(document).ready(function() {
    var input = document.querySelector("#pnumber");
    window.intlTelInput(input, {
        utilsScript: "/package/intl-tel-input-master/build/js/utils.js"
    });

    
    
    $('#pnumber').on('input', function() {
        this.value = this.value
            .replace(/[^\d]/g, ''); // numbers and decimals only

    });



    $('.btn-delete-address').on('click', function(e) {
        e.preventDefault();

        const id = $(this).attr('data-id');
        console.log(id);

        Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    backdrop: `
                        rgba(0,0,123,0.4)
                        url("/api/docs/background/UIBkAT.jpg")
                        left top
                        no-repeat
                    `,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: 'DELETE',
                    url: '/delete-address/' + id,
                    success: function(res) {
                        // alert('deleting');
                        location.reload();
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            }
        })
    });
    

    // $('#checkbox-notification').prop('checked', true);

    fetch('/get_noti')
            .then(function(response) {

                if (!response.ok) {
                    throw Error(response.statusText);
                }
                // Read the response as json.
                return response.json();
            })
            .then(function(responseAsJson) {
                // Do stuff with the JSON
                console.log(responseAsJson);

                var user = responseAsJson;
                console.log(user);
                
                $('#checkbox-notification').prop('checked', user.noti['get_noti']);

            })
            .catch(function(error) {
                console.log('Looks like there was a problem: \n', error);
            });
    $('#datepicker').datepicker();


    $('#datepicker').on('click', function(e) {
        e.preventDefault();
        // const date = ($('#datepicker').val()).split("/").reverse().join("-");
        const date = formatDate($('#datepicker').val())
        // var param = {'created': date};
        // console.log(JSON.stringify(param));
        console.log(date);
    });

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
})