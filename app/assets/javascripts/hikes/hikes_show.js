
var markers = [];

$(document).ready(function(){

    console.log("show hike loaded.");
    // console.log('test object: ', '<%= @startLocation %>');

    window.onresize = function(event){
        resizeDiv();
    }

    function resizeDiv(){
        vpw = $(window).width();
        $('#showMap').css({'width': vpw});
    }

    ////////////////////////////////////  HIKES SHOW /////////////////////////////////////////

if( $('.hikes.show').length){


    $('#backHikes').on('click', function(){
        window.location.href="/hikes";
    });

    $('.submitComment').on('click',function(){
        var comment = $('.commentText').val();
        $.ajax({
            url: '/comments',
            method: 'POST',
            data: {
              comment: comment,
              hike_id: hike_id
            },
            datatype: 'json'
        })
        .done(function(res){
            $('<p class="userName">').html(current_user.firstname + ' ' + ' : ' + comment ).appendTo('.commentContainer');
            // $('<p id= "comment">').html(comment).appendTo('.commentContainer');
            $('.commentText').val('');
        })
        .fail(function(xhr, status, error){
            console.log(xhr, status, error);
        })
    });

    startingWaypoint = waypoints[0];
    console.log(Array.isArray(startingWaypoint));

    // var newMarker =

    var mymap = L.map('showMap').setView(startingWaypoint, 13);

    var googleTerrain = L.tileLayer('http://{s}.google.com/vt/key={accessToken}&lyrs=p&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        accessToken: 'AIzaSyB4e1KgLbKlIWzhOiPoJcBW6v_02e6fwCg'
    }).addTo(mymap);

    var TerrainButton = L.Control.extend({
        onAdd: function(){
            var buttonOne = L.DomUtil.create("button", 'leaflet-bar leaflet-control leaflet-control-custom leaflet-right mapbuttons');
            buttonOne.id = "terrainView"
            buttonOne.innerHTML ='Terrain'
            // buttonOne.classList.add('mapbuttons')
            return buttonOne;
        }
    });

    var SatelliteButton = L.Control.extend({
        onAdd: function(){
            var buttonTwo = L.DomUtil.create("button", 'leaflet-bar leaflet-control leaflet-control-custom leaftlet-left');
            buttonTwo.id = "satelliteView"
            buttonTwo.innerHTML = 'Satellite'
            // buttonTwo.classList.add('mapbuttons')
            return buttonTwo;
        }
    });

    //(new GoogleViews).addTo(mymap);

    (new TerrainButton).addTo(mymap);
    (new SatelliteButton).addTo(mymap);

    $('#terrainView').on('click', function(){
        console.log('terrain');
        var googleTerrain = L.tileLayer('http://{s}.google.com/vt/key={accessToken}&lyrs=p&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3'],
            accessToken: 'AIzaSyB4e1KgLbKlIWzhOiPoJcBW6v_02e6fwCg'
        }).addTo(mymap);

    }); // terrain view click handler

    $('#satelliteView').on('click', function(){
        console.log('satellite');
        var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        accessToken: 'AIzaSyB4e1KgLbKlIWzhOiPoJcBW6v_02e6fwCg'
        }).addTo(mymap);

    }); // satellite view click handler

    var leafletPoints = [];

    for(var i = 0; i < waypoints.length; i++) {
      var waypoint = waypoints[i];
      var p = new L.LatLng(waypoint[0], waypoint[1]);
      leafletPoints.push( p );
    }

    var firstpolyline = new L.Polyline(leafletPoints, {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
    });
    firstpolyline.addTo(mymap);

    var markerGroup = L.featureGroup();

    markers.forEach(function(m){
      var marker = L.marker([ m.lat, m.long ]);
      markerGroup.addLayer(marker);


      marker.on('mouseover', function(e){
        this.bindPopup('<h6>Tip:</h6><h6>' + m.tips[0].tip + '</h6>').openPopup();
      })

    markerGroup.addTo(mymap);

    });

} // if (single hike show page )

  $('#addMarker').on('click', function (){

    mymap.on('click', function(e){

      var form = $('<form>')
      var textarea = $('<textarea class="materialize-textarea" placeholder="Enter Your Tip!">')

      var marker = new L.marker(e.latlng).addTo(mymap)
      .bindPopup('<textarea placeholder="Enter your tip!" id="markerTip"></textarea><br><button id="saveTip" lat="' + e.latlng.lat + '" lng="' + e.latlng.lng + '">Save Tip</button>' )
      .openPopup();

    });

    $(document).on("click", "#saveTip", function (){
      var tip = $('#markerTip').val();
      var lat = $(this).attr('lat');
      var lng = $(this).attr('lng');

      $.ajax({
          url: "/tips",
          method: "POST",
          data: {
            tip: tip,
            hike_id: hike_id,
            lat: lat,
            lng: lng
          },
          datatype: "json"
      })
      .done(function (res) {

        window.location.href = '/hikes/' + hike_id

      })
      .fail(function (xhr, status, error){
          console.log(xhr, status, error);
      });

    });

  });


}); // doc ready
