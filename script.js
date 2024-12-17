$("#sokoban").click(
    function() {
        window.open("https://l0v3.fyi/sokoban", "_self");
    }
);

$("#practico").click(
    function() {
        window.open("https://l0v3.fyi/keyboard", "_self");
    }
);

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