

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: f2fLocal.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(f2fLocal.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${f2fLocal.nome}</h3><p>${f2fLocal.endereco}</p>`))
    .addTo(map)

map.addControl(new mapboxgl.NavigationControl());