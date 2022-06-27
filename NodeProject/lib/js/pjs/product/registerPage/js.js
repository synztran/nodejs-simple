$(document).ready(function () {
  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }
  $('#reg_email, #email').on('keypress', function (e) {
    if (e.which == 32) {
      return false;
    }
  });
  $('#form-login').on('submit', function (e) {
    e.preventDefault();
  });
  $('#btn-sign-in').on('click', function () {
    var email = $('#email').val();
    var pw = $('#password').val();
    if (email != '' || pw != '') {
      $.ajax({
        type: 'POST',
        url: './login',
        data: { email: email, password: pw },
        success: function (res, data) {
          Swal.fire({
            position: 'bottom-end',
            title:
              '<div class="face"><div class="eye"></div><div class="eye eright"></div><div class="mouth happy"></div></div>',
            html: '<div style="margin-top:5rem;text-transform: uppercase;letter-spacing: 0.5rem;font-size: 24px;color:#fff;line-height: 3rem;font-weight: 700">success!</div><br><div class="" style="font-size:18px;font-weight: 700;">Yay, Welcome to us!!!</div>',
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
            position: 'bottom-end',
            title:
              '<div class="face2"><div class="eye"></div><div class="eye eright"></div><div class="mouth sad"></div></div><div class="shadow move"></div>',
            html:
              '<div style="margin-top:5rem;text-transform: uppercase;letter-spacing: 0.5rem;font-size: 24px;color:#fff;line-height: 3rem;font-weight: 700">error!</div><br><div class="" style="font-size:18px;font-weight: 700;">' +
              res.message +
              '</div>',
            text: res.message,
            background:
              'linear-gradient(to bottom right, #EF8D9C 40%, #FFC39E 100%)',
            backdrop: `transparent`,
            showConfirmButton: false,
            showCancelButton: false,
            timer: 3000,
            // cancelButtonText: `try again`,
            allowOutsideClick: true,
          });
        },
      });
    }
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
        timer: 3000,
        allowOutsideClick: false,
      });
    } else if (lname == '' || lname == null) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill your last name!!!',
        showConfirmButton: false,
        timer: 3000,
        allowOutsideClick: false,
      });
    } else if (email == '' || email == null) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill your email!!!',
        showConfirmButton: false,
        timer: 3000,
        allowOutsideClick: false,
      });
    } else if (pw != cfpw) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Oops...',
        text: 'Password and Confirm Password not match!!!',
        showConfirmButton: false,
        timer: 3000,
        allowOutsideClick: false,
      });
    }
    // if (grecaptcha && grecaptcha.getResponse().length > 0) {
    else {
      $('body').waitMe({
        effect: 'roundBounce',
        text: 'Please wait...',
        // waitTime: 3000,
      });
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
            timer: 2000,
            allowOutsideClick: false,
          });
          $('body').waitMe('hide');
          setTimeout(function () {
            window.location.href = '/';
          }, 1500);
        },
        error: function (err, data) {
          $('body').waitMe('hide');
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
    }
    // else {
    //   Swal.fire({
    //     position: 'bottom-end',
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'Oops, you have to check the recaptcha !',
    //     showConfirmButton: false,
    //     timer: 3000,
    //     allowOutsideClick: false,
    //   });
    // }
  });

  // js for tab
  var tab_reg_ele = $('#tab-reg');
  var form_reg_ele = $('.reg-form');
  var tab_sign_ele = $('#tab-sign-in');
  var form_sign_ele = $('.login-form');
  $(tab_reg_ele).on('click', function () {
    if (tab_reg_ele.hasClass('active')) {
    } else {
      tab_reg_ele.addClass('active-tab');
      form_reg_ele.removeClass('d-none');
      tab_sign_ele.removeClass('active-tab');
      form_sign_ele.addClass('d-none');
    }
  });
  $(tab_sign_ele).on('click', function () {
    if (tab_sign_ele.hasClass('active')) {
    } else {
      tab_sign_ele.addClass('active-tab');
      form_sign_ele.removeClass('d-none');
      tab_reg_ele.removeClass('active-tab');
      form_reg_ele.addClass('d-none');
    }
  });

  // show/hide text pw
  var eye_pw_show = $('#eye-pw_show');
  var eye_pw_hide = $('#eye-pw_hide');
  var reg_pw_input = $('#reg_password');
  var eye_confirm_pw_show = $('#eye-pw-confirm_show');
  var eye_confirm_pw_hide = $('#eye-pw-confirm_hide');
  var reg_confirm_pw_input = $('#re_password');
  // sign in
  var sign_eye_pw_show = $('#sign_eye-pw__show');
  var sign_eye_pw_hide = $('#sign_eye-pw__hide');
  var sign_pw_input = $('#password');
  const passwordVisible = (eyeField) => {
    var passwType;
    var passwField;
    if (eyeField == eye_pw_hide || eyeField == eye_pw_show) {
      passwType = reg_pw_input.attr('type');
      passwField = reg_pw_input;
    } else if (eyeField == sign_eye_pw_show || eyeField == sign_eye_pw_hide) {
      passwType = sign_pw_input.attr('type');
      passwField = sign_pw_input;
    } else {
      passwType = reg_confirm_pw_input.attr('type');
      passwField = reg_confirm_pw_input;
    }
    let visibilityStatus;

    if (passwType === 'text') {
      passwField.attr('type', 'password');
      visibilityStatus = 'hidden';
    } else {
      passwField.attr('type', 'text');
      visibilityStatus = 'visible';
    }
    return visibilityStatus;
  };

  const changeVisibiltyBtnIcon = (btn, status) => {
    var hiddenPasswIcon;
    var visibilePasswIcon;
    switch (btn) {
      case eye_pw_hide: {
        hiddenPasswIcon = $('#eye-pw_hide[data-visible="hidden"]');
        visibilePasswIcon = $('#eye-pw_show[data-visible="visible"]');
        break;
      }
      case eye_pw_show: {
        hiddenPasswIcon = $('#eye-pw_hide[data-visible="hidden"]');
        visibilePasswIcon = $('#eye-pw_show[data-visible="visible"]');
        break;
      }
      case eye_confirm_pw_hide: {
        hiddenPasswIcon = $('#eye-pw-confirm_hide[data-visible="hidden"]');
        visibilePasswIcon = $('#eye-pw-confirm_show[data-visible="visible"]');
        break;
      }
      case eye_confirm_pw_show: {
        hiddenPasswIcon = $('#eye-pw-confirm_hide[data-visible="hidden"]');
        visibilePasswIcon = $('#eye-pw-confirm_show[data-visible="visible"]');
        break;
      }
      case sign_eye_pw_show: {
        hiddenPasswIcon = $('#sign_eye-pw__hide[data-visible="hidden"]');
        visibilePasswIcon = $('#sign_eye-pw__show[data-visible="visible"]');
        break;
      }
      case sign_eye_pw_hide: {
        hiddenPasswIcon = $('#sign_eye-pw__hide[data-visible="hidden"]');
        visibilePasswIcon = $('#sign_eye-pw__show[data-visible="visible"]');
        break;
      }
      default:
        break;
    }

    if (status === 'visible') {
      visibilePasswIcon.removeClass('hide-pw');
      hiddenPasswIcon.addClass('hide-pw');
    } else if (status === 'hidden') {
      visibilePasswIcon.addClass('hide-pw');
      hiddenPasswIcon.removeClass('hide-pw');
    }
  };

  eye_pw_show.on('click', function () {
    passwordVisible(eye_pw_show);
    const status =
      reg_pw_input.attr('type') == 'password' ? 'visible' : 'hidden';
    changeVisibiltyBtnIcon(eye_pw_show, status);
  });
  eye_pw_hide.on('click', function () {
    passwordVisible(eye_pw_hide);
    const status =
      reg_pw_input.attr('type') == 'password' ? 'visible' : 'hidden';
    changeVisibiltyBtnIcon(eye_pw_hide, status);
  });

  eye_confirm_pw_show.on('click', function () {
    passwordVisible(eye_confirm_pw_show);
    const status =
      reg_confirm_pw_input.attr('type') == 'password' ? 'visible' : 'hidden';
    changeVisibiltyBtnIcon(eye_confirm_pw_show, status);
  });
  eye_confirm_pw_hide.on('click', function () {
    passwordVisible(eye_confirm_pw_hide);
    const status =
      reg_confirm_pw_input.attr('type') == 'password' ? 'visible' : 'hidden';
    changeVisibiltyBtnIcon(eye_confirm_pw_hide, status);
  });
  // sign in
  sign_eye_pw_show.on('click', function () {
    passwordVisible(sign_eye_pw_show);
    const status =
      sign_pw_input.attr('type') == 'password' ? 'visible' : 'hidden';
    changeVisibiltyBtnIcon(sign_eye_pw_show, status);
  });
  sign_eye_pw_hide.on('click', function () {
    passwordVisible(sign_eye_pw_hide);
    const status =
      sign_pw_input.attr('type') == 'password' ? 'visible' : 'hidden';
    changeVisibiltyBtnIcon(sign_eye_pw_hide, status);
  });
});
