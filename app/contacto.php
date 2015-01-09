<?php

/*ini_set("display_errors", 1);
ini_set("display_startup_errors", 0);
ini_set("html_errors", 1);*/


if(isset($_POST)){
	contacto($_POST["email"], "", $_POST["mensaje"], "info@metodomanniello.com", $_POST["titulo"], FALSE);
}

function contacto($to, $bcc, $mensajeTxt, $from, $subject, $isHtml = FALSE){

	$nombre = strip_tags($nombre);
	// El mensaje contiene HTML
	if(!$isHtml){
		$mensajeTxt = strip_tags(nl2br($mensajeTxt),"<br>");
	}

	// Campos no vacios => Error 
	if(!empty($to) && !empty($mensajeTxt)){	
		
		$mensaje = $mensajeTxt;
		
		$body = "<html>\n";
		$body .= "<body style='font-family:Tahoma, Geneva, sans-serif; font-size:14px; color:#333;'>\n";
		$body .= $mensaje;
		$body .= "</body>\n";
		$body .= "</html>\n";
		
		$headers  = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
		if(!empty($bcc)){	
			$headers .= "Bcc: ".$bcc."\r\n";
		}
		$headers .= "From: Dr. Donato Manniello<".$from.">\r\n";
		$headers .=	"Reply-To: ".$from. "\r\n";
		
		echo $to;
		echo $subject;
		echo $body;
		echo $headers;
		
		// No Enviado => Error
		if (mail($to, utf8_decode($subject), $body, $headers)){

			return TRUE;
		}else{

			return FALSE;
		}
	}else{
		
		return FALSE;
	}
	

}
	
?>