$(document).ready(function () {
    $.get("https://api.thingspeak.com/apps/thinghttp/send_request?api_key=4AN7227D41Z7DVY6", function (data) {
        let index1 = data.indexOf("potw/");
        let index2 = data.indexOf("potw/", index1 + 1);
        let index3 = data.indexOf("potw/", index2 + 1);
        let index4 = data.indexOf("potw/", index3 + 1);
        $("#wtl_new_problem_D").attr("href", "http://cemc.uwaterloo.ca/resources/" + data.substring(index1, index2));
        $("#wtl_new_problem_D").html("POTW D");
        $("#wtl_new_problem_E").attr("href", "http://cemc.uwaterloo.ca/resources/" + data.substring(index2, index3));
        $("#wtl_new_problem_E").html("POTW E");
        $("#wtl_solution_D").attr("href", "http://cemc.uwaterloo.ca/resources/" + data.substring(index3, index4));
        $("#wtl_solution_D").html("Last POTW D");
        $("#wtl_solution_E").attr("href", "http://cemc.uwaterloo.ca/resources/" + data.substring(index4));
        $("#wtl_solution_E").html("Last POTW E");
    });

    let randD = Math.floor(Math.random() * 48);
    let randE = Math.floor(Math.random() * 58);
    $("#extra_problem_D").attr("href", "problems/POTWD-15-All/Problems/POTWD-15-W" + randD + ".pdf");
    $("#extra_problem_E").attr("href", "problems/POTWE-15-All/Problems/POTWE-15-W" + randE + ".pdf");
    $("#extra_solution_D").attr("href", "problems/POTWD-15-All/Solutions/POTWD-15-SOLUTION-W" + randD + ".pdf");
    $("#extra_solution_E").attr("href", "problems/POTWE-15-All/Solutions/POTWE-15-SOLUTION-W" + randE + ".pdf");

    //adding class to links for outputting image in css
    $('a[href]').each(function () {
        if ((C = $(this).attr('href').match(/[.](doc|xls|pdf)$/))) {
            $(this).addClass(C[1]);
        }
    });

    $('a[href]').each(function () {
        if (($(this).attr('href').match(/[.](cfm|pdf|doc|docx)/))) {
            $(this).attr('target', '_blank');
        }
    });

    $('nav.primaryNav.mobile').hide();

    $('#mobileNavigation a').click(function (e) {
        $('.primaryNav.mobile').slideToggle();
        e.preventDefault();
    });

    $('#metaNav form.mobile').hide();
    $('#metaNav a.mobile').click(function (e) {
        $('#metaNav form.mobile').slideToggle();
        e.preventDefault();
    });

    //fix address in header only being on a single line
    var tabletText = $('.tablet').html() ? $('.tablet').html() : "";
    $('.tablet').html(tabletText.replace('T5', '<br />T5'));
    $('.tablet').html(tabletText.replace('T6', '<br />T6'));

    // Fix address margin height on desktop version
    headerHeight = $('#header').height();
    addressHeight = $('#header address.desktop').height();
    addressMargin = (headerHeight - addressHeight) / 2;
    $('#header address.desktop').css('margin-top', addressMargin);
});