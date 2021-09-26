$(document).ready(function () {
  $('#reg_email, #email').on('keypress', function (e) {
    if (e.which == 32) {
      return false;
    }
  });
  $('#form-login').on('submit', function (e) {
    e.preventDefault();
  });
  $('#btn-login').on('click', function () {
    var email = $('#email').val();
    var pw = $('#password').val();
    $.ajax({
      type: 'POST',
      url: './login',
      data: { email: email, password: pw },
      success: function (res, data) {
        Swal.fire({
          position: 'bottom-end',
          title:
            '<div class="face"><div class="eye"></div><div class="eye eright"></div><div class="mouth happy"></div></div>',
          html: '<div class="" style="margin-top:5rem;text-transform: uppercase;letter-spacing: 0.5rem;font-size: 24px;color:#fff;line-height: 3rem;font-weight: 700">success!</div><br><div class="" style="font-size:18px;font-weight: 700;">Yay, Welcome to us!!!</div>',
          background:
            'linear-gradient(to bottom right, var(--success) 40%, var(--secondary) 100%)',
          backdrop: `rgba(0,0,0,0.8)`,
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 2000,
        });

        setTimeout(function () {
          window.location.href = '/';
        }, 1500);
      },
      error: function (err, data) {
        var res = err.responseJSON;
        Swal.fire({
          title:
            '<div class="face2"><div class="eye"></div><div class="eye eright"></div><div class="mouth sad"></div></div><div class="shadow move"></div>',
          html:
            '<div class="" style="margin-top:5rem;text-transform: uppercase;letter-spacing: 0.5rem;font-size: 24px;color:#fff;line-height: 3rem;font-weight: 700">error!</div><br><div class="" style="font-size:18px;font-weight: 700;">' +
            res.message +
            '</div>',
          padding: '3em',
          width: 400,
          text: res.message,
          background:
            'linear-gradient(to bottom right, #EF8D9C 40%, #FFC39E 100%)',
          backdrop: `rgba(0,0,0,0.8)`,
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: `try again`,
          allowOutsideClick: false,
        });
      },
    });
  });

  $('#btn-reg').on('click', function (e) {
    e.preventDefault();
    var fname = $('#fnam').val();
    var lname = $('#lname').val();
    var email = $('#reg_email').val();
    var pw = $('#reg_password').val();
    var cfpw = $('#re_password').val();
    if (fname == '' || fname == null) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill your first name!!!',
        showConfirmButton: false,
        timer: 1000,
        allowOutsideClick: false,
      });
    }
    if (lname == '' || lname == null) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill your last name!!!',
        showConfirmButton: false,
        timer: 1000,
        allowOutsideClick: false,
      });
    }
    if (email == '' || email == null) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill your email!!!',
        showConfirmButton: false,
        timer: 1000,
        allowOutsideClick: false,
      });
    }
    if (pw != cfpw) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Oops...',
        text: 'Password and Confirm Password not match!!!',
        showConfirmButton: false,
        timer: 1000,
        allowOutsideClick: false,
      });
    }
    if (grecaptcha && grecaptcha.getResponse().length > 0) {
      $.ajax({
        type: 'POST',
        url: './account',
        data: { fname: fname, lname: lname, email: email, password: pw },
        success: function (res, data) {
          Swal.fire({
            icon: 'success',
            title: 'Register Success',
            text: 'Please check your email!!!',
            showConfirmButton: false,
            timer: 1500,
            allowOutsideClick: false,
          });
          setTimeout(function () {
            window.location.href = '/';
          }, 1500);
        },
        error: function (err, data) {
          Swal.fire({
            position: 'bottom-end',
            icon: 'error',
            title: 'Oops...',
            text: err.responseJSON.message,
            showConfirmButton: false,
            timer: 1000,
            allowOutsideClick: false,
          });
        },
      });
    } else {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Oops...',
        text: 'Oops, you have to check the recaptcha !',
        showConfirmButton: false,
        timer: 1000,
        allowOutsideClick: false,
      });
    }
  });
});
