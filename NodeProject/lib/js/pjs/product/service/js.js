$(document).ready(function() {
    var type_sw, cherry_spring, box_spring, cherry_name_switch, box_name_switch, add_spring;
    var checkbox_film, checkbox_spring;
    var checkbox_add_film, checkbox_add_spring;
    // for lube service
    var lube_accessories = 0;
    var lube_service = 0;
    var current_price_film = 150000;
    var current_price_spring = 180000;
    var lube_service_with_accessories = 6000;
    var lube_service_without_accessories = 5000;
    // for assem service
    var assembled_accessories = 0;
    var assembled_service = 0;
    var price_discount = 0;
    var kb_type = 0;
    var kb_layout = 0;

    
    
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
    // 

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
    // 

    var switchType, switchName, greaseName, filmColor, springForce;
    var addFilm, addSrping, haveFilm, haveSpring;
    var estTime, note;
    var switchQuantity = 0;
    var priceService = 0;
    var priceAccessories = 0;
    var priceTotal = 0;
    var formatLubeService, formatLubeAccessories, formatAssembledService, formatAssembledAccessories, formatPriceTotal, formatPriceSubTotal, formatDiscount;
    var priceFilm, priceSpring

    var calcPrice = function() {
        // Input params
        switchQuantity = $("#lube_quantity").val();
        addFilm = $("input[name='film']:checked").val();
        addSpring = $("input[name='spring']:checked").val();


        if (addFilm == 'add_film') {
            priceFilm = current_price_film
        } else {
            priceFilm = 0
        }
        if (addSpring == 'add_spring') {
            priceSpring = current_price_spring
        } else {
            priceSpring = 0
        }
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
        // Calc Price
        if (addFilm || addSpring) {
            lube_service = switchQuantity * lube_service_with_accessories;
        } else {
            lube_service = switchQuantity * lube_service_without_accessories;
        }
        lube_accessories = priceFilm + priceSpring
        subtotal_price = lube_service + lube_accessories
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



})