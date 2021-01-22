$(document).ready(function() {
   let burger = $(".burger-menu__button");
   burger.click(function() {
      $(this).toggleClass("active");
   });
});
