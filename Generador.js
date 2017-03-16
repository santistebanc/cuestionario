var contadorPreguntas = 0;
var htmlbody = "";
var htmlscript = "";
var htmlstyle = "";
var htmlInicial1 = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head>';
var htmlhead = "<meta charset='UTF-8' /><title>AutoEvaluación</title>"
var htmlInicial2 = "</head><body>";
var htmlFinal = "</body></html>";

var textFile = null;
var listarespuestas = [];

$(document).ready(function(){ //	se llama automaticamente al principio
	Comenzar();
});

function Comenzar(){

	AgregarPregunta(); 	//esto agrega la pregunta inicial

	$("#addbut").click(function(){
		AgregarPregunta();
	});
	$("#generarbut").click(function(){
		Generar();
	});
	$("#renderbut").click(function(){
		RenderHTML();
		Compilar();
	});

}

function AgregarPregunta(){
	contadorPreguntas ++;
	var id = contadorPreguntas;
	var contenedorPregunta = $("<div class='pregunta'></div>");
	$("#contenedor").append(contenedorPregunta);

	var titulo = $("<h4></h4>").text("Pregunta "+id);
	var pregunta = $("<input type='text' />");
	var opciones = $("<div class='opciones'></div>");
	var deletebut = $("<button>✖</button>").click(function(){
		$(this).parent().remove();
	});
	contenedorPregunta.append(titulo, pregunta, deletebut, opciones);

	var agregarbut = $("<button>Agregar Opción</button>");
	opciones.append(agregarbut);

	//esto agrega las 4 opciones iniciales
	AgregarOpcion();
	AgregarOpcion();
	AgregarOpcion();
	AgregarOpcion();

	agregarbut.click(function(e){
		AgregarOpcion();
	})

	function AgregarOpcion(){
		var opcion = $("<div class='opcion'></div>")
		var radio = $("<input type='radio' checked='checked'/>").attr("name", "p"+id);
		var texto = $("<input type='text'/>");
		var deletebut = $("<button>✖</button>").click(function(){
			$(this).parent().remove();
		});
		opcion.append(radio, texto, deletebut);
		opciones.append(opcion);
	}
}

function HacerFormdata(){
	formdata = [];
	listarespuestas = [];
	$("#contenedor").children('.pregunta').each(function(index){
		var pregunta = $(this).find('input').val();
		var opciones = [];
		var respuesta = "sin definir";
		 $(this).find('.opciones').children('.opcion').each(function(i){
			if($(this).find('input[type=radio]').is(':checked')){
				respuesta = i;
				listarespuestas.push(i);
			}
			opciones.push({id: i, texto: $(this).find('input[type=text]').val(), correcta: respuesta == i});
		});
		formdata.push({id:index, pregunta: pregunta, opciones: opciones, respuesta: respuesta});
	})

	htmlscript = "//<![CDATA[\nvar respuestas = ["+listarespuestas+"];\nvar correctas = [];\nvar q = 0;\nvar preguntas = document.getElementsByClassName('pregunta');\nload();\n"+load+"\n"+isCorrect+"\n"+showQuestion+"\n"+check+"\n"+atras+"\n"+siguiente+"\n"+reset+"\n//]]>";


}


//----------------
// el script que lleva dentro el html generado (no usar jquery aqui dentro no variables fuera de las funciones)
function load(){
	showQuestion();
}

function isCorrect(ind){
	var radios = preguntas[ind].getElementsByClassName("radio");
	for(var i = 0;i<radios.length;i++){
		if(radios[i].checked && i==respuestas[ind]){
			return i;
		}
	}
	return -1;
}

function showQuestion(){
	for(var i = 0; i<preguntas.length;i++){
		if(i !== q){
			preguntas[i].setAttribute("style","display: none;");
		}else {
			preguntas[i].setAttribute("style","");
		}
	}
	document.getElementById('resultados').setAttribute("style","display: none;");

	var botoncheck = "<button onclick='check()'>Check</button>";
	var botonsiguiente = '<button onclick="siguiente()">Next</button>';
	var botonatras = '<button onclick="atras()">Back</button>';
	var botonfinish = '<button onclick="siguiente()">Finish</button>';
	var botonrepeat = '<button onclick="reset()">Reset</button>';

	if(q == preguntas.length){
		for(var k=0;k<preguntas.length;k++){
			var exists = -1;
			for(var i = 0; i<correctas.length;i++){
				if(correctas[i] == k){
					exists = i;
					break;
				}
			}
			if(exists == -1 && isCorrect(k) !== -1){
				correctas.push(k);
			}else if(exists !== -1 && isCorrect(k) == -1){
				correctas.splice(exists, 1);
			}
		}
		document.getElementById('numcorrectas').innerHTML = correctas.length;
		document.getElementById('resultados').setAttribute("style","");
		document.getElementById('botones').innerHTML = botonrepeat;
	}else {
		document.getElementById('botones').innerHTML = botoncheck;
		if(q == preguntas.length-1){
			document.getElementById('botones').innerHTML += botonfinish;
		}else{
			document.getElementById('botones').innerHTML += botonsiguiente;
		}
		if(q>0){
			document.getElementById('botones').innerHTML += botonatras;
		}
	}

}

function check(){

	if(isCorrect(q) !== -1){
		preguntas[q].getElementsByClassName('mensaje')[0].innerHTML = "<p class='correcto'>Correcto</p>";
	}else{
		var res = respuestas[q];
		var men = "La respuesta correcta es: "+preguntas[q].getElementsByClassName("texto")[res].innerHTML;
		preguntas[q].getElementsByClassName('mensaje')[0].innerHTML = "<p class='incorrecto'>"+men+"</p>";
	}
}
function atras(){
	q --;
	showQuestion();
}
function siguiente(){
	q ++;
	showQuestion();
}
function reset(){
	q = 0;
	correctas = [];
	for(var i= 0;i<preguntas.length;i++){
		preguntas[i].getElementsByClassName('mensaje')[0].innerHTML = "";
		var radios = preguntas[i].getElementsByClassName("radio");
		for(var k=0;k<radios.length;k++){
			radios[k].checked = false;
		}
	}
	showQuestion();
}
//----------------------


//poner aqui los estilos del html a generar
var cssbody = "body{font-family: Futura Medium, Helvetica Neue, Helvetica, Arial, sans-serif;color: #474747;font-size:15px;margin-left:10px;}";
var cssautoevaluacion = ".autoevaluacion{margin-left:20px;width:380px;height:auto;font-size: 15px;line-height: 20px;}";
var cssheadline = ".headline {font-size:20px;margin-left: 0px;text-align:left;line-height: 1.5em;}";
var cssradio = "input[type=radio] {margin: 10px 20px 10px 10px;padding: 10px;cursor: pointer;}";
var cssbefore = ".headline:before{content:' ';display:block;margin-top: 10px;margin-bottom: 10px;border:1px solid #e6e6e6;}";
var csscorrecto = ".correcto{font-weight: bold;color: rgb(51, 204, 51);}";
var cssincorrecto = ".incorrecto{font-weight: bold;color: rgb(255, 51, 0);}";

var style = cssbody+cssautoevaluacion+cssheadline+cssradio+cssbefore+csscorrecto+cssincorrecto;
htmlstyle = "<style>"+style+"</style>";


function GenerarHTML(){
	var preguntas = [];
	for(var i=0;i<formdata.length;i++){
			var pre = "<p class='pre'>Pregunta "+(i+1)+" de "+formdata.length+"</p>"
			var titulo = "<h2 class='headline'>"+formdata[i].pregunta+"</h2>";
			var opciones = "<ol type='a' class='opciones'>";
			for(var k=0;k<formdata[i].opciones.length;k++){
				opciones += "<li><input type='radio' class='radio' name="+"'p"+i+"'/>"+"<span class='texto'>"+formdata[i].opciones[k].texto+"</span></li>";
			}
			opciones += "</ol>";
			var htmlmensaje = "<div class='mensaje'></div>";
			var divpregunta = "<div class='pregunta'>"+pre+titulo+opciones+htmlmensaje+"</div>";
			preguntas.push(divpregunta);
	}
	var htmlPreguntas = preguntas.join('');

	var htmlResultados = "<div id='resultados'><h2 class='headline'>Resultado</h2>Obtuviste: <span id='numcorrectas'></span> de "+ preguntas.length +"</div><br />";

	var htmlbotones = '<div id="botones"></div>';

	htmlbody = "<div class='autoevaluacion'>"+htmlPreguntas+htmlResultados+htmlbotones+'</div><script type="text/javascript">'+htmlscript+'</script>';

	var union = htmlInicial1+htmlhead+htmlstyle+htmlInicial2+htmlbody+htmlFinal;

	var beautified = html_beautify(union);

	$("#output").val(beautified);

}

function RenderHTML(){
	var iframe = document.getElementById('frame');
	var html_string= $("#output").val();
	iframe.src = "data:text/html;charset=utf-8," + escape(html_string);
}

function Generar(){
	HacerFormdata();
	GenerarHTML();
	RenderHTML();
	Compilar();
}

function Compilar(){
		var text = $("#output").val();
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

		var link = document.getElementById('downloadlink');
    link.href = textFile;
    link.style.display = 'block';
}
