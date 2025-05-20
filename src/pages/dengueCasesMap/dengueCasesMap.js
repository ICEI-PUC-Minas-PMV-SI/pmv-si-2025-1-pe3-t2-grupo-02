const BRAZIL_REGIONS_GEOJSON = {
  AC: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-12-mun.json',
  AM: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-13-mun.json',
  AP: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-16-mun.json',
  PA: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-15-mun.json',
  RO: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-11-mun.json',
  RR: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-14-mun.json',
  TO: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-17-mun.json',
  AL: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-27-mun.json',
  BA: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-29-mun.json',
  CE: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-23-mun.json',
  MA: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-21-mun.json',
  PB: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-25-mun.json',
  PE: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-26-mun.json',
  PI: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-22-mun.json',
  RN: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-24-mun.json',
  SE: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-28-mun.json',
  ES: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-32-mun.json',
  MG: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-31-mun.json',
  RJ: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-33-mun.json',
  SP: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-35-mun.json',
  PR: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-41-mun.json',
  RS: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-43-mun.json',
  SC: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-42-mun.json',
  DF: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-53-mun.json',
  GO: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-52-mun.json',
  MT: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-51-mun.json',
  MS: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-50-mun.json',
};
let map;
let geoJsonLayer;
let selectedRegion;
let selectedPlace;
let apiUrl;

function loadGoogleMapsScript() {
  fetch('../../config.json')
    .then((response) => response.json())
    .then((env) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAPS_API_KEY}&libraries=places&language=pt-BR&callback=initAutocomplete`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    });
}

async function initPage() {
  await fetch('../../config.json')
    .then((response) => response.json())
    .then((env) => {
      apiUrl = env.API_URL;
    });
  loadGoogleMapsScript();
  initMap();
  onSearchButtonClick();
  onClearFiltersButtonClick();
}

function onSearchButtonClick() {
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', () => {
    if (!selectedRegion) {
      alert('Selecione uma cidade');
      return;
    }
    const stateGeoJsonUrl = BRAZIL_REGIONS_GEOJSON[selectedRegion];
    if (!stateGeoJsonUrl) {
      alert('Estado não encontrado');
      return;
    }

    fetch(stateGeoJsonUrl)
      .then((response) => response.json())
      .then((data) => {
        this.map.setView(
          [
            selectedPlace.geometry.location.lat(),
            selectedPlace.geometry.location.lng(),
          ],
          10
        );
        addGeoJsonLayerAndData(data, 'city', selectedRegion);
      });
  });
}

function onClearFiltersButtonClick() {
  const clearFiltersButton = document.getElementById('clearFilterButton');
  clearFiltersButton.addEventListener('click', () => {
    selectedRegion = null;
    selectedPlace = null;
    const locationInput = document.getElementById('location');
    locationInput.value = '';
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    startDateInput.value = '';
    endDateInput.value = '';
    fetch('../../data/brazil-states.geojson')
      .then((response) => response.json())
      .then((data) => {
        this.map.setZoom(4);
        addGeoJsonLayerAndData(data, 'state');
      });
  });
}

function initMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  createMap(-18.235, -51.9253);
}

function setupGeolocation() {
  navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
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
    map.setView([userLat, userLng], 10);
  }

  function errorCallback(error) {
    console.error('Geolocation error:', error);
    alert('Não foi possível obter sua localização.');
  }
}

function getBoundsForZoom(zoom) {
  const maxBounds = {
    4: [
      [-33.751748, -53.982817],
      [5.271786, -34.729993],
    ],
    5: [
      [-35.751748, -55.982817],
      [5.271786, -34.729993],
    ],
    6: [
      [-35.751748, -75.982817],
      [5.271786, -34.729993],
    ],
    7: [
      [-35.751748, -95.982817],
      [5.271786, -34.729993],
    ],
    8: [
      [-35.751748, -95.982817],
      [5.271786, -34.729993],
    ],
  };
  return maxBounds[zoom] || maxBounds[8];
}

function createMap(lat, lng, zoom = 4) {
  map = L.map('map', {
    center: [lat, lng],
    zoom: zoom,
    maxBounds: [
      [-33.751748, -53.982817], // Southwest coordinates of Brazil
      [5.271786, -34.729993], // Northeast coordinates of Brazil
    ],
    maxBoundsViscosity: 1.0,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  this.map = map;

  fetch('../../data/brazil-states.geojson')
    .then((response) => response.json())
    .then((data) => {
      addGeoJsonLayerAndData(data, 'state');
    });

  map.on('zoomend', function () {
    var newBounds = getBoundsForZoom(map.getZoom());
    map.setMaxBounds(newBounds);
  });
}

async function getOutbreakReports(startDate, endDate, location) {
  let url = `${apiUrl}/denuncias-focos/`;
  if (startDate && endDate) {
    url += `?data_registro_gte=${encodeURIComponent(
      startDate
    )}&data_registro_lte=${encodeURIComponent(endDate)}`;
  }
  if (location) {
    url += `?Estado=${encodeURIComponent(location)}`;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return response;
}

async function getCasesReports(startDate, endDate, location) {
  let url = `${apiUrl}/denuncias-casos/`;
  if (startDate && endDate) {
    url += `?data_registro_gte=${encodeURIComponent(
      startDate
    )}&data_registro_lte=${encodeURIComponent(endDate)}`;
  }
  if (location) {
    url += `?estado=${location}`;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return response;
}

async function addGeoJsonLayerAndData(data, locationFilterType, location) {
  console.log(location);
  console.log(data);
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const outbreakReports = await this.getOutbreakReports(
    startDateInput.value,
    endDateInput.value,
    location
  );
  const casesReports = await this.getCasesReports(
    startDateInput.value,
    endDateInput.value,
    location
  );
  console.log(outbreakReports);
  console.log(casesReports);

  if (geoJsonLayer) {
    map.removeLayer(geoJsonLayer);
  }
  geoJsonLayer = L.geoJson(data, {
    style: (feature) => {
      const propertyName =
        locationFilterType === 'state'
          ? feature?.properties?.sigla
          : feature?.properties?.name;
      const casesLength = this.getCasesReportsByLocation(
        propertyName,
        casesReports,
        locationFilterType
      );
      const outbreakReportsLenght = this.getOutbreakReportsByLocation(
        propertyName,
        outbreakReports,
        locationFilterType
      );
      const sum = casesLength + outbreakReportsLenght;
      return {
        fillColor: this.getColor(sum),
        weight: 2,
        opacity: 1,
        color: 'red',
        dashArray: 3,
        fillOpacity: 0.7,
      };
    },
    onEachFeature: (feature, layer) => {
      const propertyName =
        locationFilterType === 'state'
          ? feature?.properties?.sigla
          : feature?.properties?.name;
      const casesLength = this.getCasesReportsByLocation(
        propertyName,
        casesReports,
        locationFilterType
      );
      const outbreakReportsLenght = this.getOutbreakReportsByLocation(
        propertyName,
        outbreakReports,
        locationFilterType
      );
      layer.bindPopup(
        `<strong>${
          locationFilterType === 'state' ? 'Estado' : 'Cidade'
        }:</strong> ${propertyName}<br><strong>Casos:</strong> ${casesLength}<br><strong>Focos registrados:</strong> ${outbreakReportsLenght}
        `
      );
    },
  }).addTo(map);
}

function getCasesReportsByLocation(location, casesReports, locationFilterType) {
  const locationLower = location.toLowerCase();
  return casesReports.filter(
    (report) =>
      (locationFilterType === 'state'
        ? report.estado
        : report.cidade
      ).toLowerCase() === locationLower
  ).length;
}

function getOutbreakReportsByLocation(
  location,
  outbreakReports,
  locationFilterType
) {
  const locationLower = location.toLowerCase();
  return outbreakReports.filter(
    (report) =>
      (locationFilterType === 'state'
        ? report.estado
        : report.cidade
      ).toLowerCase() === locationLower
  ).length;
}

function getColor(cases) {
  return cases >= 10000
    ? '#800026'
    : cases >= 5000
    ? '#BD0026'
    : cases >= 1000
    ? '#E31A1C'
    : cases >= 100
    ? '#FC4E2A'
    : cases >= 50
    ? '#FD8D3C'
    : cases >= 10
    ? '#FEB24C'
    : cases >= 1
    ? '#FED976'
    : '#edece7';
}

function initAutocomplete() {
  const input = document.getElementById('location');

  this.autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: 'BR' },
    fields: ['address_components', 'geometry', 'icon', 'name'],
    types: ['(cities)'],
  });

  this.autocomplete.setFields([
    'address_components',
    'geometry',
    'icon',
    'name',
  ]);

  this.autocomplete.addListener('place_changed', () => {
    const place = this.autocomplete.getPlace();
    console.log(place);
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    const state = place.address_components.find((component) =>
      component.types.includes('administrative_area_level_1')
    );

    selectedPlace = place;
    selectedRegion = state.short_name;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initPage();
  document
    .getElementById('geolocateButton')
    .addEventListener('click', setupGeolocation);
});
