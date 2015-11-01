var script = '<script type="text/javascript" src="js/markerclusterer';
script += '.js"><' + '/script>';
document.write(script);

function getCompaniesByCategory(categoryId) {
   var url = "https://startapp.scalingo.io/retrieveDashBoardDataByCategory/" + categoryId;
   //var url = "cat.json";
   $( "#chat-container" ).hide();
   $( "#map-container,#map,svg" ).animate({
              height: 923
            }, 20 );
    $.getJSON(url, function(data){
      var center = new google.maps.LatLng(52.1951063, 5.4370157);

      document.getElementById('map').className = document.getElementById('map').className.replace(/\bselectcategory\b/,'');
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var markers = [];
      for (var i = 0; i < data.companies.length; i++) {
        var company = data.companies[i];
        var latLng = new google.maps.LatLng(company.gpsLatitude, company.gpsLongitude);
        var marker = new google.maps.Marker({
          position: latLng
        });
        marker.addListener('click', function(e) {
          zoomAndGetHistory(map, e);
        });
        markers.push(marker);
      }
      var markerCluster = new MarkerClusterer(map, markers);

      // on click on map to send the coordinates and get the historical data
      google.maps.event.addListener(map, "click", function (e) {

        // zoom in to the location and get the historical data
        zoomAndGetHistory(map, e);

      });

      function zoomAndGetHistory(map, e) {
        var url = "https://startapp.scalingo.io/retrieveCategoryTrends?categoryId=" + categoryId + "&gpsLatitude=" + e.latLng.lat() + "&gpsLongitude=" + e.latLng.lng();
        //lat and lng is available in e object
        var center = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
        map.setZoom(map.getZoom() + 1);
        map.panTo(center);

        $.getJSON(url, function(data){
            $( "#chat-container" ).hide();

            $( "#map-container,#map,svg" ).animate({
              height: 500
            }, 1000 );

            addChart(data);
            var options = { percent: 100 };
            function callback() {}
            $( "#chat-container" ).show( "scale", options, 1000, callback );
            $( "#chat-container" ).append( "<button>OK</button>" );
        });
        
      }
    });

}

function initialize() {

  //var center = new google.maps.LatLng(52.1951063, 5.4370157);

  //var map = new google.maps.Map(document.getElementById('map'), {
  //  zoom: 8,
  //  center: center,
  //  mapTypeId: google.maps.MapTypeId.ROADMAP
  //});
  var mapdiv = document.getElementById('map');
  mapdiv.innerHTML = "Select a category of business you are interested to start.";
  mapdiv.className = mapdiv.className + " selectcategory";
}

google.maps.event.addDomListener(window, 'load', initialize);

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-12846745-20']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();


var addChart = function (data) {
    var years=[],countOfCompaniesStarted=[],countOfcompaniesClosedRecently=[],countOfcompaniesRunning=[];

    for (var i = data.length - 1; i >= 0; i--) {
      years.push(data[i].year);
      countOfCompaniesStarted.push(data[i].countOfCompaniesStarted);
      countOfcompaniesClosedRecently.push(data[i].countOfcompaniesClosedRecently);
      countOfcompaniesRunning.push(data[i].countOfcompaniesRunning);
    };

    $('#chat-container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Historic Industries by Region'
        },
        
        xAxis: {
            categories: years,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Industries count',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Opened',
            data: countOfCompaniesStarted
        }, {
            name: 'Running',
            data: countOfcompaniesClosedRecently
        }, {
            name: 'Closed',
            data: countOfcompaniesRunning
        }]
    });
};