var icons = {
          gemiddeld: {
            icon: 'gemiddeld.png'
          },
          druk: {
            icon:  'druk.png'
          },
          rustig: {
            icon: 'rustig.png'
          }
        };

// Deze functie vraagt de volgende 3 doorkomsten op aan een bepaalde halte op basis van de naam van de halte
function getTijden(naam){
	var name = encodeURI(naam);
	var d = new Date();
	var uren = d.getHours();
	var minuten = d.getMinutes();
	var jaar = d.getFullYear()
	var maand =  d.getMonth() + 1;
	var dag = d.getDate();
	var json2 = (function () {      //Opvragen van haltedata via iRail en toekennen aan json1
    var json2 = null; //json1 bestaat eerst nog niet
    $.ajax({
        'async': false,
        'global': false,
        'url': "https://data.irail.be/DeLijn/Departures/" + name + "/"+ jaar +"/" + maand +"/" + dag + "/" + uren + "/" + minuten + ".json",
        'dataType': "json",
        'success': function (data) {
            json2 = data;
        }
    });
    return json2; //teruggeven data als resultaat
})(); 
var vertrekken = json2.Departures;
var eerstedrie = vertrekken.slice(0, 3);
return(eerstedrie);
}




// 2. Benoemen van functie om graden om te zetten naar radialen
function rad(x) {return x*Math.PI/180;}

// 3. Geolocatie opstarten
function locate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geolocationCallback, error);

        } else {
            error('not supported');
        }
    }
function centreerKaart(clatitude, clongitude) {

    	    eval('map.setCenter(new google.maps.LatLng('+clatitude+','+clongitude+'))'); // Centreer de kaart opnieuw
    	   	map.setZoom(18);      // This will trigger a zoom_changed on the map
   

    }

// 4. Callback Geolocatie
function geolocationCallback(position) {

    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
   	//1. Opvragen en toekennen variabele json1 met haltedata
    var json1 = (function () {      //Opvragen van haltedata via iRail en toekennen aan json1
    var json1 = null; //json1 bestaat eerst nog niet
    $.ajax({
        'async': false,
        'global': false,
        'url': "https://ophopingslijn-comite.rhcloud.com/haltes_opvragen.php?lat="+lat+"&lon="+lng+"&rad=2500",
        'dataType': "json",
        'success': function (data) {
            json1 = data;
        }
    });
    return json1; //teruggeven data als resultaat
})(); 


    // alert('Dichtstbijzijnde halte: '+json1.Stations[1].name); //geef naam dichtsbijzijnde halte
    // alert('Tweede Dichtstbijzijnde halte: '+json1.Stations[2].name); //geef naam dichtsbijzijnde halte
    map.setZoom(16);      // This will trigger a zoom_changed on the map
    eval('map.setCenter(new google.maps.LatLng('+json1.Stations[0].latitude+','+json1.Stations[0].longitude+'))'); // Centreer de kaart opnieuw
    var latLng = new google.maps.LatLng(json1.Stations[0].latitude, json1.Stations[0].longitude); //toekennen variabele coördinaten marker
	var drukte = json1.Stations[0].drukte / 25*Math.PI;

		if (drukte > 2.5  ||  drukte == 2.5){
			var drukte = 'druk';
		}
		else if (drukte < 2.5  &&  drukte > 1.5){
			var drukte = 'gemiddeld';

		}
		else if (drukte<1.5 && drukte>0 || drukte == 0){
			var drukte = 'rustig';

		}
	var marker = new google.maps.Marker({ //maak marker aan op basis van variabele
            position: latLng,
            map: map,
            icon: icons[drukte].icon,
            title: json1.Stations[0].name
        });

	var details = '<button onclick="simuleerDrukte('+json1.Stations[0].latitude+','+json1.Stations[0].longitude+', 2)">Druk</button><b>Dichtstbijzijnde Halte</b><br><b>Naam:</b>' + json1.Stations[0].name; // toekennen variabele details voor infowindow
	bindInfoWindow(marker, map, infowindow, details, json1.Stations[0].name); // maak infowindow beschikbaar onclick op marker
	
	// Geef doorkomsten weer voor dichtstbijzijnde halte
	var doorkomsten = getTijden(json1.Stations[0].name);
    	var beschrijving = details + '</br><b>Tijden:</b> ';
    	$.each(doorkomsten, function(key, data) {
    	var dag = Date.parse(data.iso8601);
    	var uren = dag.getHours();
		var minuten = pad(dag.getMinutes(), 2);
	var jaar = dag.getFullYear();
	var maand =  dag.getMonth() + 1;
	var dag = dag.getDate();
    	beschrijving += '<br><div style="display: inline-block;"><b class="number" style="background-color:#' + data.color + ' !important; color:#'+ data.text_color + ' !important; ">' + data.short_name + '</b></div><div style="display: inline-block;"><p> ' + data.long_name +'</p></div><br><div class="time" style="text-align: right; display: inline-block">om '  +  uren + ':' + minuten +'</div><hr>';
    });
    //Stel inhoud zijbalk in:
    $("#halte-info").append('<p>1. '+json1.Stations[0].name+'</p><a href="https://maps.google.com/maps?saddr='+lat+','+lng + '&daddr='+json1.Stations[0].latitude+','+json1.Stations[0].longitude+'">Routebeschrijving</a>');
        $("#halte-info").append('<p>2. '+json1.Stations[1].name+'</p><a href="https://maps.google.com/maps?saddr='+lat+','+lng + '&daddr='+json1.Stations[1].latitude+','+json1.Stations[1].longitude+'">Routebeschrijving</a>');
        $("#halte-info").append('<p>3. '+json1.Stations[2].name+'</p><a href="https://maps.google.com/maps?saddr='+lat+','+lng + '&daddr='+json1.Stations[2].latitude+','+json1.Stations[2].longitude+'">Routebeschrijving</a>');

    //Stel inhoud infowindow in en open de infowindow
	infowindow.setContent(beschrijving);
    infowindow.open(map, marker);

    //Plot alle markers
	$.each(json1.Stations, function(key, data) {
		var latLng = new google.maps.LatLng(data.latitude, data.longitude); //toekennen variabele coördinaten marker
		var drukte = data.drukte/(25*Math.PI);
		if (drukte >= 2.5){
			var drukte = 'druk';
		}
		else if (drukte <=2.5  && drukte >= 1.5){
			var drukte = 'gemiddeld';

		}
		else if (drukte<1.5 && drukte>0 || drukte == 0){
			var drukte = 'rustig';

		}
		var marker = new google.maps.Marker({ //maak marker aan op basis van variabele
            position: latLng,
            map: map,
            icon: icons[drukte].icon,
            title: data.name
        });
        	var details = '<div class="feedback"><p>Hoe druk is het aan deze halte? <a href="#" onclick="simuleerDrukte('+data.latitude+','+data.longitude+', 2)">Zeer Druk.</a>&nbsp;&nbsp;&nbsp;<a href="#" onclick="simuleerDrukte('+data.latitude+','+data.longitude+', 1)">Druk.</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#">Rustig.</a></p></div> <h4>' + data.name+'</h4>'; // toekennen variabele details voor infowindow
			bindInfoWindow(marker, map, infowindow, details,  data.name, data.id); // maak infowindow beschikbaar onclick op marker
	
    });
      }


    //toekennen foutfunctie
function error(msg) {
        alert(msg);
}

var map; // variabele voor kaart toewijzen
var infowindow = new google.maps.InfoWindow(); // variabele infowindow aanmaken
function initialize() { //initialisatie

    var mapProp = {
        center: new google.maps.LatLng(50.51, 4.21),  //centreren op standaardlocatie
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
            navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: true,
              disableDefaultUI: true

    };

    map = new google.maps.Map(document.getElementById("map"), mapProp); //kaart aanmaken
	locate(); // functie locate opreopen zie eerder


}
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function bindInfoWindow(marker, map, infowindow, strDescription, naam, id) {
    google.maps.event.addListener(marker, 'click', function () {
    	var doorkomsten = getTijden(naam);
    	var beschrijving = strDescription;
    	if(Object.keys(doorkomsten).length != 0){
    	$.each(doorkomsten, function(key, data) {
    	var dag = Date.parse(data.iso8601);
    	var uren = dag.getHours();
		var minuten = pad(dag.getMinutes(), 2);
	var jaar = dag.getFullYear();
	var maand =  dag.getMonth() + 1;
	var dag = dag.getDate();
    	beschrijving += '<div style="display: inline-block;"><b class="number" style="background-color:#' + data.color + ' !important; color:#'+ data.text_color + ' !important; ">' + data.short_name + '</b></div><div style="display: inline-block;color: black !important;"><h5><b> ' + data.long_name +'</b></h5></div><div class="time" style="text-align: right; display: inline-block">om '  +  uren + ':' + minuten +'</div><hr>';
    });
    }
    else{
    	beschrijving += '<br><br><h5 style="text-align:center; color: #3d3d3d !important"><b>Geen doorkomsten in het komende uur.</b></h5><br><br><br>';
    }
    	beschrijving += '<small>Real-time drukte informatie via Buzzy. Overige informatie via <a href="http://www.irail.be">iRail</a>. Vertrektijden zijn niet real-time.</small>'
        infowindow.setContent(beschrijving);
        infowindow.open(map, marker);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);


function getId(){
	if (localStorage.getItem("userid") === null) {
			var json2 = (function () {      //Opvragen van haltedata via iRail en toekennen aan json1
    var json2 = null; //json1 bestaat eerst nog niet
    $.ajax({
        'async': false,
        'global': false,
        'url': "http://ophopingslijn-comite.rhcloud.com/id_aanmaken.php",
        'dataType': "json",
        'success': function (data) {
            json2 = data;
        }
    });
    return json2["id"]; //teruggeven data als resultaat
		})(); 
		  localStorage.setItem('userid', json2);

	}
	else{
	}


}

function shareLocation(){

		function locatieDelen(position) {

    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var json2 = (function () {      //Opvragen van haltedata via iRail en toekennen aan json1
    var json2 = null; //json1 bestaat eerst nog niet
    $.ajax({
        'async': false,
        'global': false,
        'url': "http://ophopingslijn-comite.rhcloud.com/locatie_gebruiker.php?lat="+lat+"&lon="+lng+"&id="+1234,
        'dataType': "json",
        'success': function (data) {
            json2 = data;
        }
    });
    return json2; //teruggeven data als resultaat
		})(); 
	}

	window.setInterval(function(){

	 if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(locatieDelen, error);

        } else {
            error('not supported');
        }
    }, 60000);

}


function simuleerDrukte(lat, lng, d){

	if (d == 0){
		d = 0
	}
	else if (d==1){
		d = 1.6 * Math.PI * 25
	}
	else if (d==2){
		d = 3 * Math.PI * 25
	}
	i = 0
    var lat = lat;
    var lng = lng;
    var json2 = (function () {      //Opvragen van haltedata via iRail en toekennen aan json1
    var json2 = null; //json1 bestaat eerst nog niet
    $.ajax({
        'async': false,
        'global': false,
        'url': "http://ophopingslijn-comite.rhcloud.com/drukte_simulatie.php?lat="+lat+"&lon="+lng+"&number="+d,
        'dataType': "json",
        'success': function (data) {
            json2 = data;
        }
    });
    return json2; //teruggeven data als resultaat
		})(); 
alert('Dankuwel voor uw medewerking.');
}
