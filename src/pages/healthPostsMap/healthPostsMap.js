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
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((env) => {
      console.log('Config loaded:', env);
      if (!env.GOOGLE_MAPS_API_KEY) {
        throw new Error('Google Maps API key not found in config');
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=initPage`;
      script.async = true;
      script.defer = true;
      
      // Add error handling for script loading
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
      };
      
      document.head.appendChild(script);
    })
    .catch((error) => {
      console.error('Error loading config or Google Maps script:', error);
      // Fallback: try to load with a default key or show error message
      alert('Erro ao carregar o mapa. Verifique sua conexão com a internet.');
    });
}

document.addEventListener('DOMContentLoaded', loadGoogleMapsScript);
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('geolocateButton').addEventListener('click', setupGeolocation);
});

function initPage() {
  // TODO: Implementar geolocalização ao iniciar a página e centralizar o mapa na localização do usuário
  // TODO: Integrar dados informativos (novos casos nas últimas 24h, etc.)
  
  // Check if Google Maps API is loaded
  if (typeof google === 'undefined' || !google.maps) {
    console.error('Google Maps API not loaded');
    setTimeout(initPage, 1000); // Retry after 1 second
    return;
  }
  
  console.log('Google Maps API loaded successfully');
  initMap();
  watchLocationFilterType();
  changeLocationFilterType(locationFilterType);
}

function initMap() {
  const beloHorizonteCoordinates = { lat: -19.9129, lng: -43.9409 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    maxZoom: 15,
    minZoom: 11,
    center: beloHorizonteCoordinates,
    styles: redStyles,
  });

  console.log('Map initialized:', map);

  initAutocomplete();
  
  // Add a small delay to ensure map is fully loaded
  setTimeout(() => {
    searchHealthPosts(beloHorizonteCoordinates);
  }, 1000);
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
    const userLocation = new google.maps.LatLng(userLat, userLng);
    map.setCenter(userLocation);
    map.setZoom(14);
    searchHealthPosts(userLocation);
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
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: image,
  });

  const infowindow = new google.maps.InfoWindow({
    content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`,
  });

  marker.addListener('click', () => {
    infowindow.open(map, marker);
  });
}

function initAutocomplete() {
  const input = document.getElementById('location');

  autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: 'BR' },
    fields: ['address_components', 'geometry', 'icon', 'name'],
    types: [locationFilterType === 'city' ? '(cities)' : 'sublocality'],
  });

  autocomplete.setFields([
    'address_components',
    'geometry',
    'icon',
    'name',
  ]);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    map.setCenter(place.geometry.location);
    map.setZoom(14);

    searchHealthPosts(place.geometry.location);
  });
}

function searchHealthPosts(location) {
  // Ensure location is a google.maps.LatLng object
  let searchLocation;
  if (location instanceof google.maps.LatLng) {
    searchLocation = location;
  } else if (location.lat && location.lng) {
    searchLocation = new google.maps.LatLng(location.lat, location.lng);
  } else {
    console.error('Invalid location provided to searchHealthPosts');
    return;
  }

  console.log('Searching for health posts at:', searchLocation.toString());
  console.log('Map object:', map);

  // Check if map is properly initialized
  if (!map) {
    console.error('Map is not initialized');
    return;
  }

  try {
    const service = new google.maps.places.PlacesService(map);
    console.log('Places service created:', service);

    const request = {
      location: searchLocation,
      radius: 5000,
      keyword: 'posto de saúde'
    };

    console.log('Places request:', request);

    service.nearbySearch(request, (results, status) => {
      console.log('Places API response - Status:', status);
      console.log('Places API response - Results:', results);
      
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Filter for only places matching the desired names
        const filtered = results.filter(place =>
          /centro de saúde|unidade de pronto atendimento|ubs|upa|sms|cms/i.test(place.name)
        );
        filtered.forEach(addMarker);
      } else {
        console.error('Google Places API error:', status);
        // Handle specific error cases
        if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.log('No health posts found in this area');
        } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
          console.error('Places API query limit exceeded');
        } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
          console.error('Places API request denied - check API key and billing');
        } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
          console.error('Invalid request to Places API');
        } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
          console.error('Places API not found');
        } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
          console.error('Places API unknown error');
        }
      }
    });
  } catch (error) {
    console.error('Error creating Places service or making request:', error);
  }
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
  
  // Reinitialize autocomplete with new types
  if (autocomplete) {
    autocomplete.setTypes([type === 'city' ? '(cities)' : 'sublocality']);
  }
}
