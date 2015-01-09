LITERALS = {};
(function(){
  "use strict";

  var data = {}; 
  var lang;

  this.load = function () {
    data = LITERALDATA;
    lang = getDefaultLenguageFromURL();
    setLanguageLiteralsInMain();
  };

  this.getGeneralLiterals = function (key) {
    return data[lang]
  }

  this.replaceText = function (text, keyX, keyY, keyZ, keyK) {

    var retext = text.replace("{x}", keyX);
    if (keyY || keyY === "") {
        retext = retext.replace("{y}", keyY)
    }
    if (keyZ) {
        retext = retext.replace("{z}", keyZ)
    }
    if (keyK) {
        retext = retext.replace("{k}", keyK)
    }
    return retext; 
  } 

  this.getModuleLiterals = function (key) {
    return data[lang].modules[key];
  };

  this.getButtonLiteral = function (key) {
    return data[lang].buttons[key];
  };
  
  this.getMainMenuOptions = function () {
    return data[lang].mainMenu.options;
  };

  this.getActualLanguage = function (key) {
    return data[lang].languages;
  };

  this.setLanguageLiteralsInMainMenu = function () {
    var languages = LITERALS.getActualLanguage();
    $(".language").each(function(index){
        $(this).attr("title", languages[index].language);
    });
  };

  var getDefaultLenguageFromURL = function () {
    var url = window.location.search;
    var langUrl = url.split("lang=")[1];
    if (!langUrl || !data[langUrl]) {
      langUrl = Proyect.CONFIG.app.default_language;

      if (navigator && navigator.language) {
        langUrl = navigator.language.split("-")[0];
      }
    }
    return langUrl
  }

  var setLanguageLiteralsInMain = function () {
    var literals = data[lang];

    $("#lt-appTitle, #lt-appTitle2, #title2, #lt-title2").attr("content", literals.appTitle);
    $("#lt-title, #lt-metodo").html(literals.title);
    $("#title2, #lt-title2").html(literals.appTitle);
    $("#lt-appDesc").attr("content", literals.appDesc);
    $("#lt-appName").attr("content", literals.appName);
    $("#lt-appUrl").attr("content", literals.appUrl);
    $("#lt-llevame, #lt-llevame2").html(literals.llevame);
    $("#lt-cambiare, #lt-cambiare2").html(literals.cambiare);
    $("#lt-comprar").html(literals.comprar);
    $("#lt-crear").html(literals.crear);
    $("#lt-libro").html(literals.libro);
    $("#lt-pasos").html(literals.pasos);
    $("#lt-pasos2").html(literals.pasos2);
    $("#lt-tambien").html(literals.tambien);
    $("#lt-kindle").html(literals.kindle);
    $("#lt-linkComprar").attr({"title": literals.linkComprar, "data-original-title": literals.linkComprar});
    $("#lt-parr1").html(literals.parr1);
    $("#lt-verVideo").attr({"title": literals.verVideo, "data-original-title": literals.verVideo});
    $("#lt-empieza, #lt-empieza2").html(literals.empieza);
    $("#lt-suscri, #lt-suscri2").html(literals.suscri);
    $("#lt-enviar, #lt-enviar2").html(literals.enviar);
    $("#lt-email, #lt-email2").attr("placeholder", literals.email);
    $("#lt-cli").attr({
        "title": literals.webTitle, 
        "data-original-title": literals.webTitle,
        "href": "http://" + literals.web
      }).html(literals.web);
    $("#lt-seguir, #lt-seguir2").html(literals.seguir);
    $("#lt-libroImg").attr({"alt": literals.libroImg, "src": "img/" + literals.libroSrc});
    $("#lt-asoc").html(literals.asoc);
    $("#lt-asoc2").html(literals.asoc2);
    $("#lt-asoc3").html(literals.asoc3);
    $("#lt-desa2").html(literals.desa2);
    $("#lt-desa").html(literals.desa);
    $("#lt-legu").html(literals.legu);
    $("#lt-legu2").html(literals.legu2);
    $("#lt-fruta").html(literals.fruta);
    $("#lt-fruta2").html(literals.fruta2);
    $("#lt-fruta3").html(literals.fruta3);
    $("#lt-fruta4").html(literals.fruta4);
    $("#lt-fruta5").html(literals.fruta5);
    $("#lt-prote").html(literals.prote);
    $("#lt-prote2").html(literals.prote2);
    $("#lt-verdu").html(literals.verdu);
    $("#lt-verdu2").html(literals.verdu2);
    $("#lt-pesca").html(literals.pesca);
    $("#lt-maris").html(literals.maris);
    $("#lt-carne").html(literals.carne);
    $("#lt-carbo").html(literals.carbo);
    $("#lt-carbo2").html(literals.carbo2);
    $("#lt-crear2").html(literals.crear);
    $("#lt-intole").html(literals.intole);
    $("#lt-lista").html(literals.lista);
    $("#lt-creaPara").html(literals.creaPara);
    $("#lt-scrollDown").html(literals.scrollDown);
    $("#lt-reco1").html(literals.reco1);
    $("#lt-reco2").html(literals.reco2);
    $("#lt-reco3").html(literals.reco3);
    $("#lt-clinica, #lt-clinica3").html(literals.clinica);
    $("#lt-clinica2, #lt-clinica4").attr("alt", literals.clinica);
    $(".lt-link-libro").attr("href", literals.linkLibro);
    $(".lt-link-libro-kindle").attr("href", literals.linkLibroKindle);
    $("#lt-trata").html(literals.trata);
    $("#lt-trata2").html(literals.trata2);
    $("#lt-visita").html(literals.visita);
    $("#lt-quote").html(literals.quote);
    $("#lt-detras").html(literals.detras);
    $("#lt-doctor3").html(literals.doctor3);
    $("#lt-doctor2").html(literals.doctor2);
    $("#lt-doctor, #lt-doctor4").html(literals.doctor);
    $("#lt-contacta").html(literals.contacta);
    $("#lt-telefo").attr({"title": literals.telefo, "data-original-title": literals.telefo});
    $("#lt-fijo").attr({"title": literals.telefo, "data-original-title": literals.telefo});
    $("#lt-myemail").html(literals.myemail);
    $("#lt-emailCita").attr(
      {
        "title": literals.pedirCita, 
        "data-original-title": literals.pedirCita,
        "href": "mailto:" + literals.myemail
      })
    $("#lt-mapa").attr({"title": literals.mapa, "data-original-title": literals.mapa});

    setLista("reco1List");
    setLista("reco2List");
    setLista("reco3List");
  }

  var setLista = function (selector) {
    var $list = $("#lt-" + selector);
    var list;

    list = data[lang][selector].map(function (item) {
      return "<li>" + item + "</li>";
    });

    $list.html(list.join(""))

  }

  this.bindLanguageOptions = function (){
	 	
		$("#idiomas .btn").each(function(){
			if($(this).attr("value")===lang){
				$(this).addClass("active")
			}
		})
		
    $(".language").off().on("click", function (e){
			e.preventDefault();
			if(!$(this).hasClass("active")){
				$("#menuContainer .btn").removeClass("active");
        $(this).addClass("active");
				$("#sidebar-wrapper").toggleClass("active");
				lang = $(this).attr("value");
        setLanguageLiteralsInMain();
        MainMenu.setMenuLiterals();
        App.actualModule.refreshModule();
        $(document).trigger("showAlimentos");
			}
		});
  };
}).apply( LITERALS );
LITERALS.load();
