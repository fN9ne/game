$(document).ready(function() {
   let burger = $(".burger-menu__button");
   burger.click(function() {
      $(this).toggleClass("active");
   });
   let chealth = $("#current-health");
   let btn = $(".button");
   btn.click(function() {
      let ca = Number(chealth.html());
      ca--;
      chealth.html(ca);
      let hh = 1 / Number($("#max-health")) * Number($(".health__bar").width());
      $(".health__bar").css("width", $(".health__bar").width() - hh);
   });
});
