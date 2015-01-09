MainMenu = {};
(function(){
  "use strict";

  var $menu;

  this.load = function(options){

    if (isMobile.any && !options.isModernAndroid) {
      loadIdiomas()

    } else {  
      loadMenuFixed()
    }
  };

  var loadIdiomas = function () {

    require([
       'text!components/modules/main_idiomas.html'
    ], function (idiomas) {
      $("#menuContainer").html(idiomas);
      LITERALS.setLanguageLiteralsInMainMenu();
      LITERALS.bindLanguageOptions();
    })
  }

  var loadMenuFixed = function () {
    require([
       'text!components/modules/main_menu.html',
       'text!components/modules/main_idiomas.html'
    ], function (menu, idiomas) {
        $('#menuContainer').html(menu);
        $("#sidebar-wrapper").prepend(idiomas);
        MainMenu.setMenuLiterals();
        bindMenuAnimations();
        LITERALS.setLanguageLiteralsInMainMenu();
        LITERALS.bindLanguageOptions();
    });
  }

  this.close = function () {
      $("#sidebar-wrapper").removeClass("active");
  };

  this.setMenuLiterals = function () {
      var opts = LITERALS.getMainMenuOptions();
      $(".option").each(function(index){
          $(this).html(opts[index].option);
      });
  };
  
  this.toggleMenu = function () {
    //$("#sidebar-wrapper").css("top", $(window).scrollTop()).toggleClass("active");
    $("#sidebar-wrapper").toggleClass("active");
  }

  var bindMenuAnimations = function (){
      $menu = $("#sidebar-wrapper");

      $(".toggle").click(function(e) {
          e.preventDefault();
          MainMenu.toggleMenu()
      });
      $menu.find("a").click(function(e){
          closeMenu()
      });
      
      $(window)
        .scroll(function () {
          $("#menu-close").trigger("click")
        });

      $(document.body).hammer()
        .on('touchstart', function (e) { 
           if (!$(e.target).closest("#sidebar-wrapper").length 
            && !$(e.target).is(".toggle") && !$(e.target).is(".toggle .fa")) {
            $menu.removeClass("active");
           }
        });
  };

  var closeMenu = function () {
      $("#sidebar-wrapper").removeClass("active");
  }

}).apply( MainMenu );


