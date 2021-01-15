$(document).ready(function() {
   
    // document.addEventListener('DOMContentLoaded', function() {
    //     new Zooming({
    //     }).listen('.img-zoomable')
    // })
    new Zooming().listen('.img-zoomable')
    
     var currentDataImage = $('#lightSlider li');
     var currentImage = $('#lightSlider li img');
     var currentImageSrc = $('#lightSlider li img').attr('src');
     console.log(currentDataImage)
     console.log(currentImage)
     console.log(currentImageSrc)
        
    var imgElements = $('#lightSlider li img');
    var imgLi = $('#lightSlider li');
    console.log(imgLi);
    console.log(imgLi.length)
    var img, url, imageli;
     

    for (var i = 0; i < imgElements.length; i++) {   
        img = imgElements[i];
        console.log(img)
        console.log(img.src); //already get src of img tag
       // $('ul#lightSlider li').attr('data-thumb', img.src);
       
        //for(var j = 0;j < imgLi.length; j++){
            //console.log(j);
            imageli = imgLi[i];
            console.log(imageli);
            var sam = imageli.getAttribute('data-thumb');
            imageli.setAttribute('data-thumb', img.src);
            //console.log(sam);
            //imageli.attr('data-thumb', img.src)
        //}
        
       
    }



    $('.btn-join').on('click', function(e){
        e.preventDefault();
        var id = $(this).attr('data-id');
        console.log(id);
        window.location.href = "/proxygb/payment/" + id;
    })
    var url = (window.location).href;
    var res = url.split("/").pop();
    console.log(res);

    var $carousel = 
    $('#lightSlider').slick({
        dots: false,
        arrows: false,
        swipeToSlide: true,
        infinite: false,
        adaptiveHeight: true,
        draggable: false,
    });
    $('.2nd-slick').slick({
      slidesToShow: 9,
      slidesToScroll: 1,
      asNavFor: '#lightSlider',
      dots: false,
      
      adaptiveHeight: true,
      focusOnSelect: true,
    });
     
    




    var select = $("#c-profile");
    var selectQuantity = $("#c-profile > option")
    $("#c-profile").change( function(e) {
       
   
        goTo = select.val();
       

            $carousel.slick( "goTo", goTo );
      }); 

    fetch('/api/product/getcid/' + res).then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    }).then(function(responseAsJson) {
        console.log(responseAsJson);
        var product = responseAsJson;

        $('#c-profile').change(function() {
            // $('.product-details-price span').remove();
            for (var i in product) {
                if (this.value == product[i].product_id) {
                    if (product[i].outstock == 1) {
                        $('.product-details-price').html("$" + product[i].price + " USD")
                        // $("#btn-add, #btn-paypal").attr("disabled", false)
                        // $("#btn-paypal").attr("disabled", false)
                    } else {
                        $('.product-details-price').html("<span style='color: red'>Out stock</span>")

                        // $("#btn-add").attr("disabled", true)
                        // $("#btn-paypal").attr("disabled", true)
                    }

                }


            }
            // if(this.value == product[i].product_id){
            //     console.log(product[i].product_id)
            // }
        })
    })


    fetch('/api/category/getcid/' + res).then(function(response2nd) {
        if (!response2nd.ok) {
            throw Error(response2nd.statusText);
        }
        return response2nd.json();
    }).then(function(response2ndAsJson) {
        console.log(response2ndAsJson);
        var category = response2ndAsJson;
        console.log(category.status_gb);
        var status = category.status_gb;

        if(status == 0 || status == 1){
          
                        $("#btn-add, #btn-paypal").attr("disabled", true)
        }else{

        }

    })
})