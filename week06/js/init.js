let mapOptions = { 'center': [0, 0], 'zoom': 2 }

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

var greyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
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

function loadData(url) {
  Papa.parse(url, {
    header: true,
    download: true,
    complete: results => processData(results)
  })
}

function grabMessage(data) {
  let comfortable = false;
  if (data['Would you be comfortable sharing your story?'] == 'Yes') {
    comfortable = true;
  }

  message = ('<i>English spoken fluently: </i>' + data['Do you speak English fluently?'] + '<br>' + '<i>Voted: </i>' + data['Did you vote in the most recent federal election in your place of residence?'] + '<br>'
    + '<i>Comfortable Sharing Story: </i>' + data['Would you be comfortable sharing your story?']);

  if (comfortable) {
    if (data['If you are comfortable, please share if you felt pressured to vote a certain way and the source of that pressure.'] != '')
      message += '<br>' + ('<i>Pressures in voting: </i>' + data['If you are comfortable, please share if you felt pressured to vote a certain way and the source of that pressure.']);

    if (data['If you are comfortable, please share any other barriers to voting you faced'] != '')
      message += ('<br>' + '<i>Other Voting Barriers: </i>' + data['If you are comfortable, please share any other barriers to voting you faced']);
    else
      message += ('<br>' + '<i>Other Voting Barriers: </i>' + 'None Provided');
  }

  return message;
}

function processData(results) {
  console.log(results);
  results.data.forEach((data) => {
    icon_sel = greenIcon;
    let isBarrier = false;
    if (data["Did you experience any barriers to voting?"] == "Yes") {
      if (data['Did you vote in the most recent federal election in your place of residence?'] === "No") {
        icon_sel = redIcon;
      }
      else { icon_sel = orangeIcon; }
      isBarrier = true;
    }

    console.log(icon_sel);
    grabMessage(data);
    addMarker(data.lat, data.lng, data["Location"], grabMessage(data), icon_sel, isBarrier);
  });

  // Add layers to the map
  markersWithBarriers.addTo(map);
  markersWithoutBarriers.addTo(map);
  markersWithBarriersNoVote.addTo(map);
}

var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  var noBarriers = L.DomUtil.create("div", "legend-item", div);
  noBarriers.innerHTML = `<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt="No Barriers Faced"> No Barriers Faced`;
  noBarriers.style.cursor = "pointer";
  noBarriers.addEventListener("click", function () {
    if (map.hasLayer(markersWithoutBarriers)) {
      map.removeLayer(markersWithoutBarriers);
      noBarriers.querySelector("img").src = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png";

    } else {
      map.addLayer(markersWithoutBarriers);
      noBarriers.querySelector("img").src = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";
    }
  });


  var barriers = L.DomUtil.create("div", "legend-item", div);
  barriers.innerHTML = `<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png" alt="Didn't Vote & Barriers Faced">Didn't Vote & Barriers Faced`;
  barriers.style.cursor = "pointer";
  barriers.addEventListener("click", function () {
    if (map.hasLayer(markersWithBarriers)) {
      map.removeLayer(markersWithBarriers);
      barriers.querySelector("img").src = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png";
    } else {
      map.addLayer(markersWithBarriers);
      barriers.querySelector("img").src = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png";

    }
  });

  var newIcon = L.DomUtil.create("div", "legend-item", div);
  newIcon.innerHTML = `<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" alt="Voted & Barriers Faced"> Voted & Barriers Faced`;
  newIcon.style.cursor = "pointer";
  newIcon.addEventListener("click", function () {
    if (map.hasLayer(markersWithBarriersNoVote)) {
      map.removeLayer(markersWithBarriersNoVote);
      newIcon.querySelector("img").src = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png";
    } else {
      map.addLayer(markersWithBarriersNoVote);
      newIcon.querySelector("img").src = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";

    }
  });

  L.DomEvent.disableClickPropagation(div); // prevent click on legend container from propagating to map


  return div;
};

legend.addTo(map);


const markersWithBarriers = L.layerGroup();
const markersWithoutBarriers = L.layerGroup();
const markersWithBarriersNoVote = L.layerGroup();

var count = 0;
function addMarker(lat, lng, title, message, icon_sel, isBarrier) {
  console.log(message);
  const marker = L.marker([lat, lng], { icon: icon_sel }).bindPopup(
    `<h2 style="color:black; font-size: 1.2rem;">${title}</h2> <h3 style="color:black;line-height: 1.5; font-size: 0.9rem;">${message}</h3>`
  );

  if (icon_sel === orangeIcon) {
    markersWithBarriers.addLayer(marker);
  } else if (isBarrier) {
    markersWithBarriersNoVote.addLayer(marker);
  } else {
    markersWithoutBarriers.addLayer(marker);
  }
  var randy = Math.floor(Math.random() * 10);
  if (randy < 4 && count < 12) {
    createButtons(lat, lng, title);
    count++;
  }
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
  barriers.innerHTML = `<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png" alt="Barriers Faced"> Barriers Faced`;
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

