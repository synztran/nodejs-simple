$("#form-login" ).on( "submit", function( event ) {
        event.preventDefault();
    });
$("#btn-login").on('click', function(){
    var email = $("#email").val();
    var pw = $("#password").val();
    $.ajax({
        type: 'POST',
        url: './login',
        data: {email: email, password: pw},
        success: function(res, data){
            Swal.fire({
                    icon: 'success',
                    title: 'Login Success',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function(){
                    window.location.href = '/';
                },1500)
        },
        error: function(err, data){
            Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Username or password is incorrect!',
                    footer: '<a href="#">Why do I ha   ve this issue?</a>'
                })
        }
    })
})

$('#form-register').on('click', function(e){
     event.preventDefault();
})
$("#btn-reg").on('click', function(){
    var fname = $("#fnam").val();
    var lname = $("#lname").val();
    var email = $("#reg_email").val();
    var pw = $("#reg_password").val();
    var cfpw = $("#re_password").val();
    if(fname == '' || fname == null){
        Swal.fire({
            position: 'bot-end',
            icon: 'error',
            title: 'Oops...',
            text: "Please fill your first name!!!",
            showConfirmButton: false,
            timer: 1000
        })
    }
    if(lname == '' || lname == null){
        Swal.fire({
            position: 'bot-end',
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill your last name!!!',
            showConfirmButton: false,
            timer: 1000
        })
    }
    if(email == '' || email == null){
        Swal.fire({
            position: 'bot-end',
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill your email!!!',
            showConfirmButton: false,
            timer: 1000
        })
    }
    if(pw != cfpw){
        Swal.fire({
            position: 'bot-end',
            icon: 'error',
            title: 'Oops...',
            text: 'Password and Confirm Password not match!!!',
            showConfirmButton: false,
            timer: 1000
        })     
    }
    if(grecaptcha && grecaptcha.getResponse().length > 0){
            $.ajax({
                type: 'POST',
                url: './account',
                data: {fname: fname,lname: lname,email: email, password: pw},
                success: function(res, data){
                    Swal.fire({
                            icon: 'success',
                            title: 'Register Success',
                            text: 'Please check your email!!!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(function(){
                            window.location.href = '/';
                        },1500)
                },
                error: function(err, data){
                    Swal.fire({
                        position: 'bot-end',
                        icon: 'error',
                        title: 'Oops...',
                        text: err.responseJSON.message,
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
            })
    }else{
        Swal.fire({
           position: 'bot-end',
            icon: 'error',
            title: 'Oops...',
           text: 'Oops, you have to check the recaptcha !',
           showConfirmButton: false,
           timer: 1000
        })
    }
})