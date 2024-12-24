$(document).ready(function() {
    if ($(window).width() <= 768) {
        $(".portfolio").removeAttr("id");
        $("#sokoban").after("<br>");
        $("#sokoban").css(
            "margin", "0 auto"
        );
        $("#practico").css(
            "margin", "0 auto"
        );
    }
 });