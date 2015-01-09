var App = {};

(function(){
  "use strict";

  this.actualModule;

  var literals = LITERALS.getGeneralLiterals();
  var rutaPOST = "/";
  var isOffline;
  
  var startApp = function(){
      
      if (!isWebApp)
          rutaPOST = "http://metodomanniello.com/";

      cordovaLoad();
      htmlReadyTask();
        
      loadImgBackground("#inicio", function () {
          console.info("APP Initialize");
          opacity();
          loadMenu();
          efectosCss();
      });
  };

  var fullscreen = function () {  
    var $full;
    if (!isWebApp || !isMobile.any) {
      return false
    } else if (window.navigator.standalone === true) {
      return false;
    } else if (localStorage.getItem("fullscreen") === "true") {
      return false;
    }

    localStorage.setItem("fullscreen", "true");
    $full = $('<div id="fullscreen">'+ literals["fullscreen"] +'</div>');
    $full.appendTo($(document.body));

    $(document.body).hammer()
      .on('touchstart', function(){ $full.remove(); });
    
  }

  var opacity = function () {
      $("body").addClass("ready");
  }

  var efectosCss = function () {
      $("#inicio .center").addClass("effect");
  }

  var loadImgBackground = function (selector, callback) {

    var $div = $(selector),
        bg = $div.css('background-image'),
        src, $img;

    if (bg) {
      src = bg.replace(/(^url\()|(\)$|[\"\'])/g, ''),
      $img = $('<img>').attr('src', src).on('load', function() {
        callback.apply();
        $img.remove()
      });

    }
  }

  var updateSite = function (event) {
    window.applicationCache.swapCache();
  }

  var eventUpdateReady = function () {
    function logEvent(e) {
        var online, status, type, message;
        online = (navigator.onLine) ? 'yes' : 'no';
        status = window.applicationCache.status;
        type = e.type;
        message = 'online: ' + online;
        message+= ', event: ' + type;
        message+= ', status: ' + status;
        if (type == 'error' && navigator.onLine) {
            message+= ' (prolly a syntax error in manifest)';
        }
        alert(message);
    }

    window.applicationCache.addEventListener('updateready', updateSite, false);
    window.applicationCache.addEventListener('error', function (e) {
      console.log("Cache error", e);
    }, false);
    window.applicationCache.addEventListener('checking', function (e) {
      console.log("Cache checking", e);
    }, false);
    window.applicationCache.addEventListener('downloading', function (e) {
      console.log("Cache downloading", e);
    }, false);
    window.applicationCache.addEventListener('update', function (e) {
      console.log("Cache update", e);
    }, false);
    window.applicationCache.addEventListener('progress', function (e) {
      console.log("Cache progress", e);
    }, false);
    window.applicationCache.addEventListener('updateready', function (e) {
      console.log("Cache updateready", e);
    }, false);
    window.applicationCache.addEventListener('cached', function (e) {
      console.log("Cache cached", e);
    }, false);
  } 

  var loadMenu = function () {

    var appHaveMainMenu = Proyect.CONFIG.app.main_menu;

    if (appHaveMainMenu){

      MainMenu.load({isModernAndroid: isModernAndroid});  
    }
  };

  this.loadModule = function (idmodule) {

      var getDependencies = function () {
        require([
           'js/components/modules/' + idmodule + '/' + idmodule,
           'text!components/modules/' + idmodule + '/' + idmodule + '.html',
        ], function (moduleJS, HTML) {
            templateInyection(HTML);
            initializeModuleLogic();

            var appHaveMainMenu = Proyect.CONFIG.app.main_menu;
            if (appHaveMainMenu){
              MainMenu.close();
            }
        });
      };

      var initializeModuleLogic = function () {
          var moduleClassName = idmodule.charAt(0).toUpperCase() + idmodule.slice(1).toLowerCase();
          App.actualModule = Proyect[moduleClassName];
          Proyect[moduleClassName].startModule();
      };

      var templateInyection = function (template) {
          $('#page').html(template);
      };

      getDependencies();
    
  };

  var isWebApp = (function () {

     var isNotProtocolHttp = location.protocol.indexOf("http:") === 0;
     var isLocalhost = location.hostname === "localhost";

     if ( isNotProtocolHttp || isLocalhost){
        return true;

     } else {
        return false;
     }
        
  })();

  var isModernAndroid = (function () {
      if (!isMobile.android.device)
        return false

      var ua = ua || navigator.userAgent; 
      var match = ua.match(/Android\s([0-9\.]*)/);
      var version = match ? match[1] : "";

      return parseInt(version.replace(/\./g, "")) >= 444;
 
  })();

  var cordovaLoad = function () {

      if (!isWebApp) {

          Mobile.load();    
      }   
  };

  var googleMap = function () {
      
      if (!google.maps.LatLng) {
        return false
      }

      var myOptions = {
          center: new google.maps.LatLng(36.487630, -4.9901519),
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map($(".map")[0], myOptions);
      var myLatLng = new google.maps.LatLng(36.487330, -4.9901019);
      var $redes = $("#redes");
      var address = $redes.find("address")[0].outerHTML;
      var data = $redes.find("#content_map_inner").html();
      var contentString = 
          '<div id="content_map">'+
            data +
            address +
          '</div>';

      var infowindow = new google.maps.InfoWindow({
          content: contentString
      });

      var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: "Clínica de médicinas alternativas"
          //icon: image
      });

      infowindow.open(map,marker);

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });
    
  }

  var animateScrollToTarget = function ($target) {
    var margen = $target.is("#menu-semanal") ? -30 : 0;
    $('html,body').animate({
        scrollTop: $target.offset().top + margen
    });  
  }

  var scrollsAnimated = function () {
      // Scrolls to the selected menu item on the page
      $('body').on("click", "a[href*=#]", function() {
          if ($(this).attr("href") === "#") {
            return false
          }
          if (isMobile.any) {
            return true
          }
          if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
            || location.hostname == this.hostname) {

              var $target = $(this.hash);
              $target = $target.length ? $target : $('[name=' + this.hash.slice(1) + ']');
              if ($target.length) {
                  animateScrollToTarget($target);
              }
          }
      });
  }

  var getAlimentos = function () {

      var alimentos = LITERALS.getModuleLiterals("menu").alimentos;
      App.alimentosCol = new Backbone.Collection(alimentos, { 
          model: Backbone.Model.extend({ 
              defaults: {
                enabled: true,
                visible: true
              } 
          }) 
      });
      
      return App.alimentosCol
  }

  var getAlimentosByTipo = function () {
      
      var alimentosCol = getAlimentos();

      App.desayunos = alimentosCol.where({ tipo: "desayuno", enabled: true });
      App.legumbres = alimentosCol.where({ tipo: "legumbre", enabled: true }); 
      App.frutasAcidas = alimentosCol.where({ tipo: "fruta", subtipo: "ácida", enabled: true });                      
      App.frutasDulces = alimentosCol.where({ tipo: "fruta", subtipo: "dulce", enabled: true });     
      App.frutasNeutras = alimentosCol.where({ tipo: "fruta", subtipo: "neutra", enabled: true });     
      App.verduras = alimentosCol.where({ tipo: "verdura", enabled: true });     
      App.carbohidratos = alimentosCol.where({ tipo: "carbohidrato", enabled: true }); 
      App.huevos = alimentosCol.where({ tipo: "proteina", subtipo: "huevos", enabled: true });  
      App.proteinaVegetal = alimentosCol.where({ tipo: "proteina", subtipo: "vegetal", enabled: true });
      App.marisco = alimentosCol.where({ tipo: "proteina", subtipo: "marisco", enabled: true });
      App.pescado = alimentosCol.where({ tipo: "proteina", subtipo: "pescado", enabled: true }); 
      App.carne = alimentosCol.where({ tipo: "proteina", subtipo: "carne", enabled: true }); 
  }

  var renderAlimentos = function () {

      var tpl = _.template('<% _.each(models, function (model) { %>' 
                              + '<div class="checkbox"><label>'
                                + '<input type="checkbox" name="<%= model.cid %>"><%= model.attributes.nombre.replace("({x})", "") %>'
                              + '</label></div>'
                         + '<% }) %>');

      $("#grupo_1").html(tpl({models: App.legumbres }));
      $("#fruta_neutra").html(tpl({models: App.frutasNeutras }));
      $("#fruta_acida").html(tpl({models: App.frutasAcidas }));
      $("#fruta_dulce").html(tpl({models: App.frutasDulces }));
      $("#pescados").html(tpl({models: App.pescado }));
      $("#mariscos").html(tpl({models: App.marisco }));
      $("#carnes").html(tpl({models: App.carne }));
      $("#otros").html(tpl({models: App.huevos.concat(App.proteinaVegetal) }));
      $("#grupo_3").html(tpl({models: App.verduras }));
      $("#grupo_6").html(tpl({models: App.carbohidratos }));
      $("#grupo_7").html(tpl({models: App.desayunos }));
  }

  var bindChangeAlimentos = function () {
      $("#alimentos").on("change", "input:checkbox", function () {
        var id = $(this).attr("name");
        var value = $(this).is(":checked");
        App.alimentosCol.get(id).set("enabled", !value);
      })
  }

  var checkboxs = function (argument) {

      $('input[type="checkbox"]').checkbox({
          buttonStyleChecked: '',
          checkedClass: 'fa fa-times',
          uncheckedClass: 'fa fa-square-o fa-lg'
      });
  }

  var tooltips = function () {

      $('body').tooltip({ selector: "[data-toggle=tooltip]", html: true});
  }  

  var isOfflineNow = function () {
    if (Offline.state === "down") {
      return true

    } else if (Offline.state === "up"){
      return false
    }
  }

  var videos = function () {

      var $videosOffline = $(".ver-video");
      var $videosOnline = $(".video-iframe");
      isOffline = isOfflineNow();
      if (isOffline) {
          $videosOffline.removeClass("hide");
          $videosOnline.addClass("hide");  
          $videosOnline.map(function () {
            this.onload = null
          });
      } else {
          $videosOffline.addClass("hide");
          $videosOnline.map(function () {
            var $this = $(this);
            this.src = $this.data("src");
            this.onload = function () {
             $this.removeClass("hide"); 
            };
          });      
      }    
  }

  var menuFixed = function () {
    if (!isWebApp) { // Mobile
      return
    }
    var $menu = $('#menufixed');
    var top = $(window).scrollTop();
    var l = $("#libro").offset().top + 100;
    var m = $("#alimentos").offset().top;
    var x = $("#clinica").offset().top;
    var f = $("#contacto").offset().top;

    if ( top + 1 > l && top < m
      || top > x + 600 && top < f - 300
      ) {
      $menu.addClass("fixed").removeClass("out");
    }
    else if (top > f - 300) {
      $menu.removeClass("out").removeClass("fixed");
    } else {
      $menu.addClass("out");
    }      
  }
 
  var popovers = function () {
      $('body')
        .popover({ 
          selector: "[data-toggle=popover]", 
          html: true, 
          trigger: $("html").hasClass("touch") ? "click" : "hover",
          placement: "top"
        });   

      $(document)
        .on('click', ':not([data-toggle=popover])', function(){
            $('[data-toggle=popover][aria-describedby]').popover('hide');
        })
        .on('show.bs.popover', "[data-toggle=popover]", function (e) {
            $('[data-toggle=popover][aria-describedby]').not(this).popover('hide');
        });
  }

  var eventPrint = function () {
      $("body").on("click", ".print", function () {
        print();
      })
  }

  this.cargarMenu = function () {
      Backbone.history.navigate("#menu");
      Backbone.history.loadUrl();
  }

  var nuevoMenu = function () {
      $("body").on("click", ".nuevo-menu", function () {
        App.cargarMenu()
      })
  } 

  
  var loadCSS = function(url, callback) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
    if(callback) {
      callback();
    }
  }

  var windowScroll = function () {

    $(window)
      .scroll(function () {
        menuFixed();
      });

  }

  var emailTest = function (email) {
    var validEmail = /^([a-z0-9_'&\.\-\+=])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,10})+$/i;

    if (validEmail.test(email)) {
      return true
    }

    return false
  }

  var eventSuscribir = function () {
    $(".suscribir").on("click", function () {
      var email;
      var $form = $(this).parents(".form-group");
      var $email = $form.find("[type=email]");
      email = $email.val();

      if (!email || !emailTest(email)) {
        $form.addClass("has-error");
        $email.attr("title", literals["email"]);

      } else {
        $form.removeClass("has-error");
        $email.attr("title", "");
        suscribirEmail(email);
        sessionStorage.setItem("email", email);
      }
    })
  }

  var eventEnviarMenu = function () {
    $("body").on("click", ".enviar", function () {
      var email;
      var cabecera = '<div style="text-align:center">' 
        + $("#titulo")
        .find("p").css({"margin": 0, "padding": 0}).end()
        .find("h1").css({"font-family": "Comic Sans MS, Verdana, Arial", "font-size": 18}).end()
        .find("h3").css({"margin": "5px 0"}).end()
        .find("span.fa").html("&#10084;").end()
        .html() + '</div>';
      var titulo = $("#titulo .shadow").text();
      var menu = '<div style="text-align:center">' 
        + $("#menu-semanal .carousel-caption").clone()
        .find("a").remove().end()
        .find("p, h3, h2").css({"padding": 0, "margin": 0}).end()
        .find("h3").css({"padding-top": 5, "font-size": 16}).end()
        .find("h2").css({"padding-top": 5, "text-transform": "uppercase", "font-size": 15}).end()
        .map(function () { 
        return "<br>" + $(this).html() 
      }).get().join("") + "</div><br>";
      var tips = $("#tips").clone().find("a").remove().end().html();
      var emailInLocal = sessionStorage.getItem("email");
      var $form = $("#enviar-menu");
      var $email = $form.find("[type=email]");
      //email = emailInLocal || $email.val();
      email = $email.val();

      if ($form.hasClass("hide")) {
        $(".enviar-mensaje").addClass("hide");
        if (!email) {
            $email.val(emailInLocal);
        }
        $form.removeClass("hide");
        $form.find("[type=email]").focus()
        return
      }

      if (!email || !emailTest(email)) {
        $form.addClass("has-error");
        $form.find("[type=email]").focus()
        $email.attr("title", literals["Email inválido"]);

      } else {
        $form.removeClass("has-error");
        $email.attr("title", "");
        enviarEmail(email, titulo, cabecera + menu + tips);
        sessionStorage.setItem("email", email);
      }

    })
  }

  var enviarEmail = function (email, titulo, menu) {

    var request = new XMLHttpRequest();
    var params = "email=" + email;
        params += "&titulo=" + titulo;
        params += "&emailFrom=info@metodomanniello.com";
        params += "&mensaje=" + encodeURIComponent(menu);
  
    request.open("POST", rutaPOST + "enviar-menu.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {
        var text;
        // request.responseURL
        if (request.readyState == 4) {
            if ((request.status == 200 || request.status == 0)) {

              text = literals["EnvioRealizado"];
              $("#enviar-menu").addClass("hide");
              $(".enviar-mensaje")
                .html("<span class='fa fa-check-circle-o fa-lg'> </span> " + text)
                .removeClass("hide");

            } else {

               text = literals["NoInternetConection"];
               $(".enviar-mensaje")
                 .removeClass("hide")
                 .html("<span class='fa fa-exclamation-triangle'> </span> " + text);
            }
        }
    }
    request.send(params);
    $(".enviar-mensaje").removeClass("hide").html("<span class='fa fa-spinner'> </span> " + literals["Enviando"]);

  }

  var suscribirEmail = function (email) {

    var request = new XMLHttpRequest();
    var params = "user[email]=" + email;
        params += "&ajax=" + 0;
        params += "&ctrl=" + "sub"; 
        params += "&task=" + "optin";
        params += "&option=" + "com_acymailing";
        params += "&hiddenlists=" + 1;
        params += "&acyformname=" + "formAcymailing18301";
  
    request.open("POST", rutaPOST + "index.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {
        var text;
        sessionStorage.setItem("email", email);
        if (request.readyState == 4) {
            if ((request.status == 200 || request.status == 0)) {
              text = literals["SuscripcionRealizada"];
              $(".suscribete .form").addClass("hide");
              $(".mensaje").html("<span class='fa fa-check-circle-o fa-lg'> </span> " + text)

            } else {
               text = literals["NoInternetConection"];
               $(".mensaje").html("<span class='fa fa-exclamation-triangle'> </span> " + text);
            }
        }
    }
    request.send(params);
    $(".mensaje").html("<span class='fa fa-spinner'></span> " + literals["Enviando"]);

  }

  var showAlimentos = function () {
      getAlimentosByTipo();
      renderAlimentos();
      checkboxs();
  }        

  var parallaxScroll = function () {
      if (!isWebApp || isMobile.any) {
        return false
      }

      $("#inicio").addClass("fixed");

      var s = skrollr.init({
        forceHeight: false,
        render: function(data) {
            //Debugging - Log the current scroll position.
            //console.log(data.curTop);
        }
    });
  }

  var offline = function () {

    Offline.options = {
      checks: {
        image: {
          url: function() { 
            return "http://manniellomethod.com/favicon.ico?_=" + (Math.floor(Math.random() * 1000000000)); 
          }
        },
        active: 'image'
      }
    };
    
    Offline.on("up", videos);
    Offline.on("down", videos);

    checkOffline();

  }

  var checkOffline = function () {
      Offline.check();
  }

  var htmlReadyTask = function () {
      eventUpdateReady();
      fullscreen();
      parallaxScroll();
      showAlimentos();
      bindChangeAlimentos();
      offline();
      videos();
      scrollsAnimated()
      tooltips();
      popovers();
      menuFixed();
      //googleMap();
      eventPrint();
      eventSuscribir();
      nuevoMenu();
      eventEnviarMenu();
      //loadCSS();
      // Trigger desde literales
      $(document).on("showAlimentos", function () {
        showAlimentos();
      })
  }

  startApp();
  windowScroll()
  
}).apply( App );