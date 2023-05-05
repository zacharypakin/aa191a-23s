let mapOptions = {'center': [38,0],'zoom':2}

const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function createButtons(lat, lng, title) {
  const newButton = document.createElement("button");
  newButton.id = "button" + title;
  newButton.innerHTML = title;
  newButton.setAttribute("lat", lat);
  newButton.setAttribute("lng", lng);
  newButton.addEventListener("click", function () {
    map.flyTo([lat, lng], 8);
  });
  document.getElementById("location-buttons").appendChild(newButton);
}

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRESUOf9n3y8vL19jjop5uHE_nhMTNxw7Z3MVeAi1JJFZ3UVLPBlDHJv_nWT7slZjWEJjoH0LzFQ4S9/pub?output=csv";

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

function grabMessage(data) {
    let comfortable = false;
    if(data['Would you be comfortable sharing your story?'] == 'Yes'){
        comfortable = true;
    }

    message = ('<i>English spoken fluently: </i>' + data['Do you speak English fluently?'] + '<br>'
        + '<i>Comfortable Sharing Story: </i>' + data['Would you be comfortable sharing your story?']);

    if(comfortable){
        if(data['Did you experience any side effects from the vaccine?'] != '')
            message += '<br>' + ('<i>Vaccine Side Effects: </i>' + data['Did you experience any side effects from the vaccine?']);
        
        if(data['Please share any barriers you faced'] != '')
            message += ('<br>' + '<i>Barriers to Vaccination: </i>' + data['Please share any barriers you faced']);
        else
            message += ('<br>' + '<i>Barriers to Vaccination: </i>' + 'None Provided');
    }

    return message;
}

function processData(results) {
  console.log(results);
    results.data.forEach((data) => {
    icon_sel = greenIcon;
    let isBarrier = false;
    if (data["Did you experience any barriers to vaccination?"] == "Yes") {
      icon_sel = redIcon;
      isBarrier = true;
    }

    console.log(data);
    grabMessage(data);
    addMarker(data.lat, data.lng, data["Location"], grabMessage(data), icon_sel, isBarrier);
  });

  // Add layers to the map
  markersWithBarriers.addTo(map);
  markersWithoutBarriers.addTo(map);
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");
    div.innerHTML = "<h4>Click to Toggle</h4><br>";
  var noBarriers = L.DomUtil.create("div", "legend-item", div);
  noBarriers.innerHTML = `<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt="No Barriers Faced" class="no-barriers-icon"> <span class="legend-text">No Barriers Faced</span>`;
  noBarriers.style.cursor = "pointer";
  noBarriers.addEventListener("click", function () {
    if (map.hasLayer(markersWithoutBarriers)) {
      map.removeLayer(markersWithoutBarriers);
      noBarriers.querySelector(".no-barriers-icon").src = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png";
    } else {
      map.addLayer(markersWithoutBarriers);
      noBarriers.querySelector(".no-barriers-icon").src = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";
    }
  });

  var barriers = L.DomUtil.create("div", "legend-item", div);
  barriers.innerHTML = `<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" alt="Barriers Faced" class="barriers-icon"> <span class="legend-text">Barriers Faced</span>`;
  barriers.style.cursor = "pointer";
  barriers.addEventListener("click", function () {
    if (map.hasLayer(markersWithBarriers)) {
      map.removeLayer(markersWithBarriers);
      barriers.querySelector(".barriers-icon").src = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png";
    } else {
      map.addLayer(markersWithBarriers);
      barriers.querySelector(".barriers-icon").src = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";
    }
  });

  return div;
};


legend.addTo(map);

const markersWithBarriers = L.layerGroup();
const markersWithoutBarriers = L.layerGroup();

function addMarker(lat, lng, title, message, icon_sel, isBarrier) {
  console.log(message);
  const marker = L.marker([lat, lng], { icon: icon_sel }).bindPopup(
    `<h2 style="color:black; font-size: 1.2rem;">${title}</h2> <h3 style="color:black;line-height: 1.5; font-size: 0.9rem;">${message}</h3>`
  );

  if (isBarrier) {
    markersWithBarriers.addLayer(marker);
  } else {
    markersWithoutBarriers.addLayer(marker);
  }
  createButtons(lat,lng,title);
}

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  var noBarriers = L.DomUtil.create("div", "legend-item", div);
  noBarriers.innerHTML = `<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt="No Barriers Faced"> No Barriers Faced`;
  noBarriers.style.cursor = "pointer";
  noBarriers.addEventListener("click", function () {
    if (map.hasLayer(markersWithoutBarriers)) {
      map.removeLayer(markersWithoutBarriers);
    } else {
      map.addLayer(markersWithoutBarriers);
    }
  });

  var barriers = L.DomUtil.create("div", "legend-item", div);
  barriers.innerHTML = `<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" alt="Barriers Faced"> Barriers Faced`;
  barriers.style.cursor = "pointer";
  barriers.addEventListener("click", function () {
    if (map.hasLayer(markersWithBarriers)) {
      map.removeLayer(markersWithBarriers);
    } else {
      map.addLayer(markersWithBarriers);
    }
  });

  return div;
};

loadData(dataUrl);

