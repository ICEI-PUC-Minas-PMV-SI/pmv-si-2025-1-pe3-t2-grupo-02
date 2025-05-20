let map;
let locationFilterType = 'city';
let autocomplete;
const redStyles = [
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [{ saturation: -80 }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ hue: '#ff0022' }, { saturation: 60 }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ hue: '#ff0000' }, { saturation: 50 }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ hue: '#ff0000' }, { saturation: 40 }],
  },
];

function loadGoogleMapsScript() {
  fetch('../../config.json')
    .then((response) => response.json())
    .then((env) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=initPage`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', loadGoogleMapsScript);
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('geolocateButton').addEventListener('click', setupGeolocation);
});

function initPage() {
  // TODO: Implementar geolocalização ao iniciar a página e centralizar o mapa na localização do usuário
  // TODO: Integrar dados informativos (novos casos nas últimas 24h, etc.)
  this.initMap();
  this.watchLocationFilterType();
  this.changeLocationFilterType(locationFilterType);
}

function initMap() {
  const beloHorizonteCoordinates = { lat: -19.9129, lng: -43.9409 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    maxZoom: 15,
    minZoom: 11,
    center: beloHorizonteCoordinates,
    styles: redStyles,
  });
  this.map = map;

  this.initAutocomplete();
  this.searchHealthPosts(beloHorizonteCoordinates);
}

function setupGeolocation() {
  navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
    if (result.state === 'granted' || result.state === 'prompt') {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.error('Geolocation permission denied.');
      alert('Permissão negada para acessar sua localização.');
    }
  });

  function successCallback(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    this.map.setCenter(new google.maps.LatLng(userLat, userLng));
    this.map.setZoom(14);
    this.searchHealthPosts(new google.maps.LatLng(userLat, userLng));
  }

  function errorCallback(error) {
    console.error('Geolocation error:', error);
    alert('Não foi possível obter sua localização.');
  }
}

function addMarker(place) {
  const image = {
    url: '../../assets/posto-de-saude.png',
    size: new google.maps.Size(36, 52),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(22, 94),
    scaledSize: new google.maps.Size(36, 52),
  };

  const marker = new google.maps.Marker({
    map: this.map,
    position: place.geometry.location,
    title: place.name,
    icon: image,
  });

  const infowindow = new google.maps.InfoWindow({
    content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`,
  });

  marker.addListener('click', () => {
    infowindow.open(this.map, marker);
  });
}

function initAutocomplete() {
  const input = document.getElementById('location');

  this.autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: 'BR' },
    fields: ['address_components', 'geometry', 'icon', 'name'],
    types: [locationFilterType === 'city' ? '(cities)' : 'sublocality'],
  });

  this.autocomplete.setFields([
    'address_components',
    'geometry',
    'icon',
    'name',
  ]);

  this.autocomplete.addListener('place_changed', () => {
    const place = this.autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    this.map.setCenter(
      new google.maps.LatLng(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      )
    );
    this.map.setZoom(14);

    this.searchHealthPosts(place.geometry.location);
  });
}

function searchHealthPosts(location) {
  const service = new google.maps.places.PlacesService(this.map);
  const request = {
    location,
    radius: '5000',
    type: ['health'],
    keyword: 'CENTRO DE SAUDE/UNIDADE BASICA',
  };

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach((healthUnit) => {
        this.addMarker(healthUnit);
      });
    } else {
      console.error('Google Places API error:', status);
    }
  });
}

function watchLocationFilterType() {
  document
    .getElementById('locationFilterTypeSelect')
    .addEventListener('change', (event) => {
      changeLocationFilterType(event.target.value);
    });
}

function changeLocationFilterType(type) {
  locationFilterType = type;
  const input = document.getElementById('location');
  input.value = '';
  input.placeholder =
    type === 'city' ? 'Pesquise por cidade' : 'Pesquise por nome do bairro';
  input.focus();
  const label = document.getElementById('locationLabel');
  label.textContent = type === 'city' ? 'Cidade:' : 'Bairro:';
  this.autocomplete.setTypes([type === 'city' ? '(cities)' : 'sublocality']);
}
