$(document).ready(function() {
   let burger = $(".burger-menu__button");
   burger.click(function() {
      $(this).toggleClass("active");
   });
   let chealth = $("#current-health");
   let btn = $(".button");
   btn.click(function() {
      let ca = Number(chealth.html());
      alert(ca);
   });
});
