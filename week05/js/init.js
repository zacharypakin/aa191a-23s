

let mapOptions = {'center': [38,0],'zoom':2}

// use the variables
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// var usa = L.icon({
//     iconUrl: 'media/usa.png',
//     // shadowUrl: 'media/usa.png',

//     iconSize:     [38, 60], // size of the icon
//     // shadowSize:   [50, 64], // size of the shadow
//     iconAnchor:   [19, 60], // point of the icon which will correspond to marker's location
//     // shadowAnchor: [4, 62],  // the same for the shadow
//     // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });

// var spain = L.icon({
//     iconUrl: 'media/spain.png',
//     // shadowUrl: 'media/spain.png',

//     iconSize:     [38, 50], // size of the icon
//     // shadowSize:   [50, 64], // size of the shadow
//     iconAnchor:   [19, 50], // point of the icon which will correspond to marker's location
//     // shadowAnchor: [4, 62],  // the same for the shadow
//     // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });

// var italy = L.icon({
//     iconUrl: 'media/italy.png',
//     // shadowUrl: 'media/italy.png',

//     iconSize:     [38, 30], // size of the icon
//     // shadowSize:   [50, 64], // size of the shadow
//     iconAnchor:   [19, 30], // point of the icon which will correspond to marker's location
//     // shadowAnchor: [4, 62],  // the same for the shadow
//     // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });

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

// create a function to add markers
function addMarker(lat,lng,title,message,icon_sel){
    console.log(message)
    L.marker([lat,lng],{icon:icon_sel}).addTo(map).bindPopup(`<h2 style="color:black; font-size: 1.2rem;">${title}</h2> <h3 style="color:black;line-height: 1.5; font-size: 0.9rem;">${message}</h3>`)
    //createButtons(lat,lng,title); 
    return message
}
function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); 
    newButton.id = "button"+title; 
    newButton.innerHTML = title; 
    newButton.setAttribute("lat",lat); 
    newButton.setAttribute("lng",lng); 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng]); 
    })
    document.getElementById("contents").appendChild(newButton); 
}


const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRESUOf9n3y8vL19jjop5uHE_nhMTNxw7Z3MVeAi1JJFZ3UVLPBlDHJv_nWT7slZjWEJjoH0LzFQ4S9/pub?output=csv";


function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })``
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

function processData(results){
    console.log(results)
    results.data.forEach(data => {
        icon_sel = greenIcon;
        if(data['Did you experience any barriers to vaccination?'] == 'Yes'){
            icon_sel = redIcon;
        }

        console.log(data)
        grabMessage(data)
        addMarker(data.lat,data.lng,data['Location'],grabMessage(data),icon_sel);
    })
}

// define the legend object
var legend = L.control({position: 'bottomright'});

// add the legend
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ['No Barriers Faced', 'Barriers Faced'],
        labels = ['marker-icon-green.png', 'marker-icon-red.png'];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/' + labels[i] + '" alt="' + grades[i] + '"> ' +
            grades[i] + '<br>';
    }

    return div;
};

legend.addTo(map);




loadData(dataUrl);






