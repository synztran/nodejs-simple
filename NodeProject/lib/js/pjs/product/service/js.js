$(document).ready(function() {
    var type_sw, cherry_spring, box_spring, cherry_name_switch, box_name_switch, add_spring;
    var checkbox_film, checkbox_spring;
    var checkbox_add_film, checkbox_add_spring;
    // for lube service
    var lube_accessories = 0;
    var lube_service = 0;
    var assembled_service = 0;
    var assembled_accessories = 0;
    var current_price_film = 150000;
    var current_price_spring = 180000;
    var solder_led_18 = 1500;
    var solder_led_234 = 3500;
    var desolder_led = 2500; 
    var lube_service_with_accessories = 6000;
    var lube_service_without_accessories = 5000;
    // for assem service
    var assemble_kb_type, assemble_kb_layout;
    var assembled_accessories = 0;
    var assembled_service = 0;
    var price_discount = 0;
    var kb_type = 0;
    var kb_layout = 0;

    $('#lube-service .t-right').html(new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(0))
    $('#assembled-service .t-right').html(new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(0))
    $('#lube-accessories .t-right').html(new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(0))
    $('#assembled-accessories .t-right').html(new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(0))
    $("#discount-price .t-right").html(new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(0))
    $("#sub-total .t-right").html(new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(0))
    $("#total-price .t-right").html(new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(0))

    
    
    $('.disabled_searchbar').select2({
        minimumResultsForSearch: Infinity,
        placeholder: 'Please select'
    })
    $('.enable_select2').select2({
        placeholder: 'Please select'
    });
    // $('.')
    $('#lube_quantity').on('input', function() {
        this.value = this.value
            .replace(/[^\d]/g, ''); // numbers and decimals only
    });
    $('#email').on('keypress', function(e) {
        if (e.which == 32) {
            return false;
        }
    });
    $("#lube_form").hide();
    $("#assembled_form").hide();
    $("#add_lube_service").click(function(){
        var radioValue = $("input[name='add_lube_service']:checked").val();
        if (radioValue == 'add_lube_service') {
            $("#lube_form").show();
        } else {
            $("#lube_quantity").val(0)
            calcPrice();
            $("#lube_form").hide();
        }
    })
     $("#add_assembled_service").click(function(){
        var radioValue = $("input[name='add_assembled_service']:checked").val();
        if (radioValue == 'add_assembled_service') {
            $("#assembled_form").show();
        } else {
            $("#assembled_form").hide();
        }
    })
    // Lube Service
    cherry_name_switch = $('#lube_cherry_switch')
    cherry_name_switch.next(".select2-container").hide()

    box_name_switch = $('#lube_box_switch')
    box_name_switch.next(".select2-container").hide()

    cherry_spring = $('#lube_cherry_spring_force')
    cherry_spring.next(".select2-container").hide()

    box_spring = $('#lube_box_spring_force')
    box_spring.next(".select2-container").hide()


    $("#lube_film_color").next(".select2-container").hide()
    $("#lube_switch_type").each(function() {
        type_sw = $('#lube_switch_type').val();
        if (type_sw == 'cherry') {
            cherry_name_switch.next(".select2-container").show();
        }
    });
    $(document).on('change', '#lube_switch_type', function() {
        type_sw = $(this).val();
        add_spring = $("input[name='spring']:checked").val()
        if (type_sw == 'cherry') {
            cherry_name_switch.next(".select2-container").show();
            box_name_switch.next(".select2-container").hide();
            if (add_spring == "add_spring") {
                cherry_spring.next(".select2-container").show();
                box_spring.next(".select2-container").hide();
            } else {
                box_spring.next(".select2-container").hide();
                cherry_spring.next(".select2-container").hide();
            }
        } else if (type_sw == 'box') {
            cherry_name_switch.next(".select2-container").hide();
            box_name_switch.next(".select2-container").show();
            if (add_spring == "add_spring") {
                cherry_spring.next(".select2-container").hide();
                box_spring.next(".select2-container").show();
            } else {
                box_spring.next(".select2-container").hide();
                cherry_spring.next(".select2-container").hide();
            }
        } else if (type_sw == 'albs') {

        } else {

        }
    })
    checkbox_film = $("#film").val();
    checkbox_spring = $("#spring").val();
    checkbox_add_spring = $("#have_film").val();
    checkbox_add_spring = $("#have_spring").val();
    $("#have_spring").prop('disabled', true);
    $("#have_film").prop('disabled', true)

    $(document).on('change', '#have_film', function() {

    })
    $(document).on('change', '#have_spring', function() {

    })
    $("#have_film").click(function() {

        var radioValue = $("input[name='have_film']:checked").val();
        if (radioValue == 'have_film') {
            calcPrice()
        } else {
            calcPrice()
        }
    });

    $("#have_spring").click(function() {

        var radioValue = $("input[name='have_spring']:checked").val();
        if (radioValue == 'have_spring') {
            calcPrice()
        } else {
            calcPrice()
        }
    });

    $("#film").click(function() {

        var radioValue = $("input[name='film']:checked").val();
        if (radioValue == 'add_film') {
            $("#lube_film_color").next(".select2-container").show()
            $("#have_film").prop('disabled', false);

            // price_accessories = price_film
            calcPrice()
        } else {
            $("#lube_film_color").next(".select2-container").hide()
            $("#have_film").prop('disabled', true);
            // price_accessories = 0;
            calcPrice()
        }
    });
    $("#spring").click(function() {

        var radioSpringValue = $("input[name='spring']:checked").val();
        var radioTypeSwitchValue = $("#lube_switch_type").val();
        if (radioSpringValue == 'add_spring') {
            $("#have_spring").prop('disabled', false);
            // price_accessories = price_spring
            calcPrice()
            if (radioTypeSwitchValue == 'cherry') {
                $("#lube_cherry_spring_force").next(".select2-container").show();
                $("#lube_box_spring_force").next(".select2-container").hide();

            } else if (radioTypeSwitchValue == 'box') {
                $("#lube_cherry_spring_force").next(".select2-container").hide();
                $("#lube_box_spring_force").next(".select2-container").show();
            }
        } else {
            // price_accessories = 0
            $("#have_spring").prop('disabled', true);
            calcPrice()
            $("#lube_cherry_spring_force").next(".select2-container").hide();
            $("#lube_box_spring_force").next(".select2-container").hide();
        }
    });

    $(document).on('change', '#lube_quantity', function() {
        calcPrice();

    })

    // Assembled Service
    $(".option_assembled_pcb").hide();

    $("#add_pcb").click(function(){
        var radioValue = $("input[name='add_pcb']:checked").val();
         if (radioValue == 'add_pcb') {
            $(".option_assembled_pcb").show();
        } else {
            $(".option_assembled_pcb").hide();
        }
    })
    $(".option_assembled_led").hide();
    $("#add_led").click(function(){
        var radioValue = $("input[name='add_led']:checked").val();
         if (radioValue == 'add_led') {
            $(".option_assembled_led").show();
        } else {
            $(".option_assembled_led").hide();
        }
    })
    $("#assemble_kb_type").on("change", function(){
        var type_keyboard = $("#assemble_kb_type").val();
        if(type_keyboard == "stock"){
            kb_type = 50000
        }else{}
        calcPrice();
    })
    // $("#assemble_kb_layout").on("change", function(){
    //     alert($(this).val())
    //     var kb_layout = $(this).val();
    //     if(kb_layout == "60"){
    //         kb_layout = 
    //     }else if(kb_layout == "65"){
    //         kb_layout =
    //     }else if(kb_layout == "87"){
    //         kb_layout =
    //     }else if(kb_layout == "108"){
    //         kb_layout =
    //     }else if(kb_layout == "1800"){
    //         kb_layout =
    //     }else{

    //     }

    // })

    // For pcb
    $("#assembled_pcb_solder").click(function(){
        var radioValue = $("input[name='assembled_pcb_solder']:checked").val();
        if(radioValue == 'assembled_pcb_solder'){
            calcPrice()
        }else{
            calcPrice()
        }
    })
    $("#assembled_pcb_desolder").click(function(){
        var radioValue = $("input[name='assembled_pcb_desolder']:checked").val();
        if(radioValue == 'assembled_pcb_desolder'){
            calcPrice()
        }else{
            calcPrice()
        }
    })
    $("#assembled_pcb_handlestab").click(function(){
        var radioValue = $("input[name='assembled_pcb_handlestab']:checked").val();
        if(radioValue == 'assembled_pcb_handlestab'){
            calcPrice()
        }else{
            calcPrice()
        }
    })
    $("#assembled_pcb_solder_hotswap").click(function(){
        var radioValue = $("input[name='assembled_pcb_solder_hotswap']:checked").val();
        if(radioValue == 'assembled_pcb_solder_hotswap'){
            calcPrice()
        }else{
            calcPrice()
        }
    })

    // For Led
    $("#assembled_led_solder").click(function(){
        var radioValue = $("input[name='assembled_led_solder']:checked").val();
        if(radioValue == 'assembled_led_solder'){
            calcPrice()
        }else{
            calcPrice()
        }
    })
    $("#assembled_led_desolder").click(function(){
        var radioValue = $("input[name='assembled_led_desolder']:checked").val();
        if(radioValue == 'assembled_led_desolder'){
            calcPrice()
        }else{
            calcPrice()
        }
    })
    // 

    var switchType, switchName, greaseName, filmColor, springForce;
    var addFilm, addSrping, haveFilm, haveSpring;
    var estTime, note;
    // lUBE SERVICE
    var switchQuantity = 0;
    var priceService = 0;
    var priceAccessories = 0;
    var priceTotal = 0;

    // ASSENBKED SERVUCE
    var priceAssembled_Solder = 0;
    var priceKeyboard_Type = 0;
    var priceKeyboard_Layout = 0;
    var priceAssembled_Desolder = 0;
    var priceAssembled_HandleStab = 0;
    var priceAssembled_SolderHotswap = 0;

    var priceAssembled_LedSolder_18 = 0;
    var priceAssembled_LedSolder_234 = 0
    var priceAssembled_LedDesolder = 0;



    var formatLubeService, formatLubeAccessories, formatAssembledService, formatAssembledAccessories, formatPriceTotal, formatPriceSubTotal, formatDiscount;
    var priceFilm, priceSpring

    var calcPrice = function() {
        // Input params
            // lube service
             var   switchQuantity = $("#lube_quantity").val();
              var  addFilm = $("input[name='film']:checked").val();
              var  addSpring = $("input[name='spring']:checked").val();
            // assembled service
              var  assemble_kb_layout = $("#assemble_kb_layout").val();
              var  assemble_kb_type = $("assemble_kb_type").val();
              var  assembled_pcb_solder = $("input[name='assembled_pcb_solder']:checked").val();
               var assembled_pcb_desolder = $("input[name='assembled_pcb_desolder']:checked").val();;
              var  assembled_pcb_handlestab= $("input[name='assembled_pcb_handlestab']:checked").val();;
               var assembled_pcb_solder_hotswap = $("input[name='assembled_pcb_solder_hotswap']:checked").val();;
              var  assembled_led_solder = $("input[name='assembled_led_solder']:checked").val();;
              var  assembled_led_desolder = $("input[name='assembled_led_desolder']:checked").val();;
            var assemble_led_type = $("#assemble_led_type").val();

        //  lube service
            if (addFilm == 'add_film') {priceFilm = current_price_film} else {priceFilm = 0}
            if (addSpring == 'add_spring') {priceSpring = current_price_spring} else {priceSpring = 0}

            haveFilm = $("input[name='have_film']:checked").val();
            haveSpring = $("input[name='have_spring']:checked").val();
            checkboxHaveFilm = $("#have_film");
            checkboxHaveSpring = $("#have_spring");
            // haveFilm == 'have_film' ? priceFilm = current_price_film : 0
            // haveSpring == 'have_spring' ? priceSpring = current_price_spring : 0
            if (document.getElementById('have_film').attributes.getNamedItem('disabled')) {} else if (haveFilm == 'have_film') {
                priceFilm = 0
            } else {
                priceFilm = current_price_film
            }
            if (document.getElementById('have_spring').attributes.getNamedItem('disabled')) {} else if (haveSpring == 'have_spring') {
                priceSpring = 0
            } else {
                priceSpring = current_price_spring
            }

        // assembled service
            assemble_kb_type == "stock" ?  priceKeyboardType = 50000 : priceKeyboardType = 0;
            assemble_kb_layout == "60" ? calcPriceAssembled60() :  0;
            assemble_kb_layout == "65" ? calcPriceAssembled65() :  0;
            assemble_kb_layout == "87" ? calcPriceAssembled87() :  0;
            assemble_kb_layout == "108" ? calcPriceAssembled108() :  0;
            // assemble_kb_layout == "1800" ? calcPriceAssembled1800() : return 0;

            function calcPriceAssembled60(){
                var current_price_solder = 150000
                if(assembled_pcb_solder == 'assembled_pcb_solder'){
                    priceAssembled_Solder = parseInt(current_price_solder)
                }else{
                    priceAssembled_Solder = 0
                }

                if(assembled_pcb_desolder == 'assembled_pcb_desolder'){
                    priceAssembled_Desolder = parseInt(current_price_solder + 30000)
                }else{
                    priceAssembled_Desolder = 0
                }

                if(assembled_pcb_handlestab == 'assembled_pcb_handlestab'){
                    priceAssembled_HandleStab = parseInt(150000)
                }else{
                    priceAssembled_HandleStab = 0
                }

                if(assembled_pcb_solder_hotswap == 'assembled_pcb_solder_hotswap'){
                    priceAssembled_SolderHotswap = parseInt(priceAssembled_Desolder - 10000)
                }else{
                    priceAssembled_SolderHotswap = 0
                }

                if(assemble_led_type === "1.8"){
                    assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_18 = parseInt(70*solder_led_18) : priceAssembled_LedSolder_18 = 0;
                }else if(assemble_led_type === "2x3x4"){
                    assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_234 = parseInt(70*solder_led_234) : priceAssembled_LedSolder_234 = 0;
                }else{

                }
                if(assembled_led_desolder == 'assembled_led_desolder'){
                    priceAssembled_LedDesolder = parseInt(70*desolder_led)
                }else{
                    priceAssembled_LedDesolder = 0
                }
                
            }
            function calcPriceAssembled65(){
                var current_price_solder = 180000
                if(assembled_pcb_solder == 'assembled_pcb_solder'){
                    priceAssembled_Solder = parseInt(current_price_solder)
                }else{
                    priceAssembled_Solder = 0
                }

                if(assembled_pcb_desolder == 'assembled_pcb_desolder'){
                    priceAssembled_Desolder = parseInt(current_price_solder + 30000)
                }else{
                    priceAssembled_Desolder = 0
                }

                if(assembled_pcb_handlestab == 'assembled_pcb_handlestab'){
                    priceAssembled_HandleStab = parseInt(150000)
                }else{
                    priceAssembled_HandleStab = 0
                }

                if(assembled_pcb_solder_hotswap == 'assembled_pcb_solder_hotswap'){
                    priceAssembled_SolderHotswap = parseInt(priceAssembled_Desolder - 10000)
                }else{
                    priceAssembled_SolderHotswap = 0
                }
                
                if(assemble_led_type === "1.8"){
                    assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_18 = parseInt(70*solder_led_18) : priceAssembled_LedSolder_18 = 0;
                }else if(assemble_led_type === "2x3x4"){
                    assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_234 = parseInt(70*solder_led_234) : priceAssembled_LedSolder_234 = 0;
                }else{

                }
                if(assembled_led_desolder == 'assembled_led_desolder'){
                    priceAssembled_LedDesolder = parseInt(70*desolder_led)
                }else{
                    priceAssembled_LedDesolder = 0
                }

                // assembled_pcb_solder == 'assembled_pcb_solder' ? priceAssembled_Solder = parseInt(180000) : priceAssembled_Solder = 0;
                // assembled_pcb_desolder == 'assembled_pcb_desolder' ? priceAssembled_Desolder = parseInt(priceAssembled_Solder + 30000) : priceAssembled_Desolder = 0
                // assembled_pcb_handlestab == 'assembled_pcb_handlestab' ? priceAssembled_HandleStab = parseInt(150000) ? priceAssembled_HandleStab = 0
                // assembled_pcb_solder_hotswap == 'assembled_pcb_solder_hotswap' ? priceAssembled_SolderHotswap = parseInt(priceAssembled_Desolder - 10000) ? priceAssembled_SolderHotswap = 0
                
                // if(assemble_led_type == "1.8"){
                //     assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_18 = parseInt(70*solder_led_18) : priceAssembled_LedSolder_18 = 0;
                // }else if(assemble_led_type == "2x3x4"){
                //     assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_234 = parseInt(70*solder_led_234) : priceAssembled_LedSolder_234 = 0;
                // }else{
                    
                // }
                // assembled_led_desolder == 'assembled_led_desolder' ? priceAssembled_LedDesolder = parseInt(70*desolder_led) : priceAssembled_LedDesolder = 0
            }
            function calcPriceAssembled87(){
                var current_price_solder = 220000
                if(assembled_pcb_solder == 'assembled_pcb_solder'){
                    priceAssembled_Solder = parseInt(current_price_solder)
                }else{
                    priceAssembled_Solder = 0
                }

                if(assembled_pcb_desolder == 'assembled_pcb_desolder'){
                    priceAssembled_Desolder = parseInt(current_price_solder + 30000)
                }else{
                    priceAssembled_Desolder = 0
                }

                if(assembled_pcb_handlestab == 'assembled_pcb_handlestab'){
                    priceAssembled_HandleStab = parseInt(180000)
                }else{
                    priceAssembled_HandleStab = 0
                }

                if(assembled_pcb_solder_hotswap == 'assembled_pcb_solder_hotswap'){
                    priceAssembled_SolderHotswap = parseInt(priceAssembled_Desolder - 10000)
                }else{
                    priceAssembled_SolderHotswap = 0
                }
                
                if(assemble_led_type === "1.8"){
                    assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_18 = parseInt(90*solder_led_18) : priceAssembled_LedSolder_18 = 0;
                }else if(assemble_led_type === "2x3x4"){
                    assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_234 = parseInt(90*solder_led_234) : priceAssembled_LedSolder_234 = 0;
                }else{

                }
                if(assembled_led_desolder == 'assembled_led_desolder'){
                    priceAssembled_LedDesolder = parseInt(90*desolder_led)
                }else{
                    priceAssembled_LedDesolder = 0
                }


                // assembled_pcb_solder == 'assembled_pcb_solder' ? priceAssembled_Solder = parseInt(220000) : priceAssembled_Solder = 0;
                // assembled_pcb_desolder == 'assembled_pcb_desolder' ? priceAssembled_Desolder = parseInt(priceAssembled_Solder + 30000) : priceAssembled_Desolder = 0
                // assembled_pcb_handlestab == 'assembled_pcb_handlestab' ? priceAssembled_HandleStab = parseInt(180000) ? priceAssembled_HandleStab = 0
                // assembled_pcb_solder_hotswap == 'assembled_pcb_solder_hotswap' ? priceAssembled_SolderHotswap = parseInt(priceAssembled_Desolder - 10000) ? priceAssembled_SolderHotswap = 0
                
                // if(assemble_led_type == "1.8"){
                //     assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_18 = parseInt(90*solder_led_18) : priceAssembled_LedSolder_18 = 0;
                // }else if(assemble_led_type == "2x3x4"){
                //     assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_234 = parseInt(90*solder_led_234) : priceAssembled_LedSolder_234 = 0;
                // }else{
                    
                // }
                // assembled_led_desolder == 'assembled_led_desolder' ? priceAssembled_LedDesolder = parseInt(90*desolder_led) : priceAssembled_LedDesolder = 0
            }
            function calcPriceAssembled108(){
                var current_price_solder = 280000
                if(assembled_pcb_solder == 'assembled_pcb_solder'){
                    priceAssembled_Solder = parseInt(current_price_solder)
                }else{
                    priceAssembled_Solder = 0
                }

                if(assembled_pcb_desolder == 'assembled_pcb_desolder'){
                    priceAssembled_Desolder = parseInt(current_price_solder + 30000)
                }else{
                    priceAssembled_Desolder = 0
                }

                if(assembled_pcb_handlestab == 'assembled_pcb_handlestab'){
                    priceAssembled_HandleStab = parseInt(210000)
                }else{
                    priceAssembled_HandleStab = 0
                }

                if(assembled_pcb_solder_hotswap == 'assembled_pcb_solder_hotswap'){
                    priceAssembled_SolderHotswap = parseInt(priceAssembled_Desolder - 10000)
                }else{
                    priceAssembled_SolderHotswap = 0
                }
                
                if(assemble_led_type === "1.8"){
                    assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_18 = parseInt(110*solder_led_18) : priceAssembled_LedSolder_18 = 0;
                }else if(assemble_led_type === "2x3x4"){
                    assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_234 = parseInt(110*solder_led_234) : priceAssembled_LedSolder_234 = 0;
                }else{

                }
                if(assembled_led_desolder == 'assembled_led_desolder'){
                    priceAssembled_LedDesolder = parseInt(110*desolder_led)
                }else{
                    priceAssembled_LedDesolder = 0
                }

                // assembled_pcb_solder == 'assembled_pcb_solder' ? priceAssembled_Solder = parseInt(280000) : priceAssembled_Solder = 0;
                // assembled_pcb_desolder == 'assembled_pcb_desolder' ? priceAssembled_Desolder = parseInt(priceAssembled_Solder + 30000) : priceAssembled_Desolder = 0
                // assembled_pcb_handlestab == 'assembled_pcb_handlestab' ? priceAssembled_HandleStab = parseInt(210000) ? priceAssembled_HandleStab = 0
                // assembled_pcb_solder_hotswap == 'assembled_pcb_solder_hotswap' ? priceAssembled_SolderHotswap = parseInt(priceAssembled_Desolder - 10000) ? priceAssembled_SolderHotswap = 0
                
                // if(assemble_led_type == "1.8"){
                //     assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_18 = parseInt(110*solder_led_18) : priceAssembled_LedSolder_18 = 0;
                // }else if(assemble_led_type == "2x3x4"){
                //     assembled_led_solder == 'assembled_led_solder' ? priceAssembled_LedSolder_234 = parseInt(110*solder_led_234) : priceAssembled_LedSolder_234 = 0;
                // }else{
                    
                // }
                // assembled_led_desolder == 'assembled_led_desolder' ? priceAssembled_LedDesolder = parseInt(110*desolder_led) : priceAssembled_LedDesolder = 0
            }
            // calcPriceAssembled1800(){
            //     priceAssembled_Solder = parseInt(150000);
            //     priceAssembled_Desolder = parseInt(priceAssembled_Solder + 30000);
            //     priceAssembled_HandleStab = parseInt(150000);
            //     priceAssembled_SolderHotswap = parseInt(priceAssembled_Desolder - 10000);

            //     priceAssembled_LedSolder_18 = parseInt(60*solder_led_18);
            //     priceAssembled_LedSolder_234 = parseInt(60*solder_led_234);
            //     priceAssembled_LedDesolder = parseInt(60*desolder_led)
            // }


        // Calc Price
            // LUBE SERVICE
                if (addFilm || addSpring) {
                    lube_service = switchQuantity * lube_service_with_accessories;
                } else {
                    lube_service = switchQuantity * lube_service_without_accessories;
                }
                lube_accessories = priceFilm + priceSpring
            // ASSEMBLED SERVICE
                assembled_service = parseInt(priceAssembled_Solder + priceAssembled_Desolder + priceAssembled_HandleStab + priceAssembled_SolderHotswap + priceAssembled_LedSolder_18 + priceAssembled_LedSolder_234 + priceAssembled_LedDesolder + priceKeyboardType);
                assembled_accessories = 0;

        subtotal_price = lube_service + lube_accessories + assembled_service + assembled_accessories
        total_price = subtotal_price - price_discount
        // Format Price
        formatLubeService = new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(lube_service)
        formatLubeAccessories = new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(lube_accessories)
        formatAssembledService = new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(assembled_service)
        formatAssembledAccessories = new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(assembled_accessories)
        formatDiscount = new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(price_discount)
        formatPriceSubTotal = new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(subtotal_price)
        formatPriceTotal = new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(total_price)
        // Show Price
        $('#lube-service .t-right').html(formatLubeService)
        $('#assembled-service .t-right').html(formatAssembledService)
        $('#lube-accessories .t-right').html(formatLubeAccessories)
        $('#assembled-accessories .t-right').html(formatAssembledAccessories)
        $("#discount-price .t-right").html(formatDiscount)
        $("#sub-total .t-right").html(formatPriceSubTotal)
        $("#total-price .t-right").html(formatPriceTotal)
    }
    $("#submit-order").on('click', function(){
        $.ajax({
            type: 'POST',
            url: '/service/invoice',
            dataType: "json",
            data: {
                switches_quanity: $("#lube_quantity").val(),
                sw_quantity : $("#lube_quantity").val(),
                 grease : $("#lube_grease").val(),
                 film_color : $("#lube_film_color").val(),
                 box_spring_force : $("#lube_box_spring_force").val(),
                 spring_force :  $("#lube_spring_force").val(),
                 keeb_type : $("#assemble_kb_type").val(),
                 keeb_layout : $("#assemble_kb_layout").val(),

                 pcb_solder : $("#assembled_pcb_solder").val(),
                 pcb_desolder : $("#assembled_pcb_desolder").val(),
                 pcb_handlestab : $("#assembled_pcb_handlestab").val(),
                 pcb_solderhotswap : $("#assembled_pcb_solder_hotswap").val(),

                 led_solder : $("#assembled_led_solder").val(),
                 led_desolder : $("#assembled_led_desolder").val(),
                 price_lube_accessories = $("#").val(),
                 price_lube_service = $("#").val(),
                 price_assembled_accessories = $("#").val()
            },
            success: function(res){
                console.log(res)
            },
            error: function(err){
                console.log(err)
            }
        })
    })



})