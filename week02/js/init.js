// declare variables
let zoomLevel = 2;
const mapCenter = [50.0709,-75];

// use the variables
const map = L.map('the_map').setView(mapCenter, zoomLevel);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var usa = L.icon({
    iconUrl: 'media/usa.png',
    // shadowUrl: 'media/usa.png',

    iconSize:     [38, 60], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [19, 60], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var spain = L.icon({
    iconUrl: 'media/spain.png',
    // shadowUrl: 'media/spain.png',

    iconSize:     [38, 50], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [19, 50], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var italy = L.icon({
    iconUrl: 'media/italy.png',
    // shadowUrl: 'media/italy.png',

    iconSize:     [38, 30], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [19, 30], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// create a function to add markers
function addMarker(lat,lng,title,message,icon_sel){
    console.log(message)
    L.marker([lat,lng],{icon:icon_sel}).addTo(map).bindPopup(`<h2 style="color:black;">${title}</h2> <h3 style="color:black;">${message}</h3>`)
    return message
}

// use our marker functions
addMarker(37.9,-121.7,'Hometown','my hometown!',usa)
addMarker(34,-118.4,'Undergraduate','i moved here in 2019', usa)
addMarker(40.76,-73.95,'Graduate School','i will move here in aug 2023',usa)
addMarker(40.4,-3.7,'Study Abroad Fall 2023','i lived here in fall 2023',spain)
addMarker(43.76,11.23,'Study Abroad Summer 2023','i lived here in summer 2023',italy)

