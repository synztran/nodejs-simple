$(document).ready(function(){
	const textArr = document.querySelectorAll('.text')
            const colorArr = ["#fefefe", "#ff9b00", "#ff3434", "#db38f0", "#0096fb", "#00c500", "#ffd200"]
            textArr.forEach((text, index) => {
                text.style.color = colorArr[index]
            })
            var x = document.cookie;
            console.log(x);
            const ggcaptchasitekey = '6Lcti9UUAAAAADIUivaJtXit0OKia78-EQIbnDkc';
            fetch('/get_cookie')
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    // Read the response as json.
                    return response.json();
                })
                .then(function(responseAsJson) {
                    // Do stuff with the JSON
                    // console.log(responseAsJson);
                    var user = responseAsJson;
                    // console.log(user);
                    // console.log(user.session['email'])
                    var formLogin = $('.swal2-container').clone()[0]
                    $('#form-login').remove();
                    // $('.home-social #login, #login').on('click', function(e) {
                    //     e.preventDefault();
                    //     // var formLogin = $('#form-login > form').clone()[0]
                    //     if (responseAsJson['code'] != 200) {
                    //         Swal.fire({
                    //             title: 'Your profile',
                    //             showConfirmButton: false,
                    //             width: '600px',
                    //             // background: '#fff url(/api/docs/background/UIBkAT.jpg) no-repeat' ,

                    //             backdrop: `
                    //         rgba(0,0,123,0.4)
                    //         url("/api/docs/background/UIBkAT.jpg")
                    //         left top
                    //         no-repeat
                    //     `,
                    //             heightAuto: true,
                    //             html: "<div  class='form-group form-info'><div class='row'><div  class='col-md-8'>   <div  class='col-md-2'>      <label >email:</label> <input id='email' type='email' value='" + user.session['email'] + "' disabled/>   </div>     <div  class='col-md-2'>      <label >first name:</label> <input id='email' type='text' value='" + user.session['fname'] + "' disabled/>   </div>  <div  class='col-md-2'>      <label >last name:</label> <input id='email' type='text' value='" + user.session['lname'] + "' disabled/>   </div>    <form id='updatepassword' >        <div  class='col-md-2'>          <label >current password:</label>   <input id='currentpw' required name='currentpw' type='password' value='' /> </div>           <div style='display:inline-flex' class='col-md-2'>          <label >new password:</label>   <input required id='newpw' name='newpw' type='password' value='' />            </div><div class='button-submit-changepw'><button type='submit' id='btn-submit' class='btn btn-primary btn-login'>Change</button></div></form><div class='col-md-4'><div class='button-logout'><button type='submit' id='btn-logout' class='btn btn-primary btn-login'>Logout</button></div></div> </div></div></div>"
                    //         })
                    //         $('#btn-logout').on('click', function(e) {
                    //     e.preventDefault();
                    //     Swal.fire({
                    //         title: 'Are you sure?',
                    //         text: "You won't be able to revert this!",
                    //         icon: 'warning',
                    //         showCancelButton: true,
                    //         backdrop: `
                    // rgba(0,0,123,0.4)
                    // url("/api/docs/background/UIBkAT.jpg")
                    // left top
                    // no-repeat
                    // `,
                    //         confirmButtonColor: '#3085d6',
                    //         cancelButtonColor: '#d33',
                    //         confirmButtonText: 'Yes, delete it!'
                    //     }).then((result) => {
                    //         if (result.value) {
                    //             // $.ajax({
                    //             //     tpye: 'GET',
                    //             //     url: '/del',
                    //             //     success: function(res) {
                    //             //         window.location.href = '/'
                    //             //     },
                    //             //     error: function(err) {
                    //             //         console.log(err);
                    //             //     },
                    //             // })
                    //             $.ajax({
                    //                 tpye: 'GET',
                    //                 url: '/del',
                    //                 success: function(res) {
                    //                     window.location.href = '/'
                    //                 },
                    //                 error: function(err) {
                    //                     console.log(err);
                    //                 },
                    //             })

                    //         }
                    //     })
                    //         })

                    //         $('#updatepassword').submit(function(e) {
                    //             e.preventDefault();
                    //             const curpw = $('#currentpw').val();
                    //             const newpw = $('#newpw').val();
                    //             const uemail = $('#email').val();
                    //             console.log(curpw, newpw, uemail);
                    //             if (newpw == '' || curpw == '') {

                    //             } else {
                    //                 $.ajax({
                    //                     type: 'POST',
                    //                     url: '/updatepassword',
                    //                     data: { uemail: uemail, currentpw: curpw, newpw: newpw },
                    //                     success: function(res) {

                    //                         window.location.href = '/'
                    //                     },
                    //                     error: function(err) {
                    //                         console.log(err);
                    //                         console.log(err.responseJSON['message'])
                    //                         if (err.status == 400) {

                    //                             const Toast = Swal.mixin({
                    //                                 position: 'top-end',
                    //                                 toast: true,
                    //                                 // icon: 'error',
                    //                                 // title: 'The password is not correct',
                    //                                 showConfirmButton: false,
                    //                                 timerProgressBar: true,
                    //                                 timer: 1500,
                    //                                 onOpen: (toast) => {
                    //                                     toast.addEventListener('mouseenter', Swal.stopTimer)
                    //                                     toast.addEventListener('mouseleave', Swal.resumeTimer)
                    //                                 }
                    //                             })

                    //                             Toast.fire({
                    //                                 icon: 'error',
                    //                                 title: 'The password is not correct'
                    //                             })
                    //                         }
                    //                     },
                    //                 })
                    //             }
                    //         })
                    //     } else {
                    //         Swal.fire({
                    //             title: 'Hi!',
                    //             showConfirmButton: false,
                    //             html: "<form action='./login' method='post'><div class='form-group'><label for='email'>Email address</label><input required type='email' name='email' value='rapsunl231@gmail.com' autocomplete='off' class='form-control' id='email' aria-describedby='emailHelp' placeholder='Enter email'></div><div class='form-group'><label for='password'>Password</label><input type='password' value='123456' required name='password' class='form-control' id='password' placeholder='Password'></div><div class='form-group'><small id='emailHelp' class='form-text text-muted'>We'll never share your email with anyone else.</small></br></br></div></br><div class='button-login'><button type='submit' id='btn-submit' class='btn btn-primary btn-login'>Login</button></div><br><a class='btn-register' href='./register'> or Register here!!!</a></form>"
                    //         })

                    //     }

                    // });


                })
                .catch(function(error) {
                    console.log('Looks like there was a problem: \n', error);
                });
})