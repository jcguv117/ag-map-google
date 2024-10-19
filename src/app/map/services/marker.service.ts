import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  map!: google.maps.Map;
  currentMarker!: google.maps.Marker;

  mapOptions: google.maps.MapOptions = {
    styles: [
      { featureType: "all", stylers: [ { saturation: -80 }, { lightness: 20 }  ], },
      { featureType: "road.highway",elementType: "labels",stylers:[{visibility: "off"}]}, //turns off highway labels
      { featureType: "road.arterial",elementType: "labels",stylers: [{visibility: "off"}]}, //turns off arterial roads labels
      { featureType: "road.local",elementType: "labels",stylers: [{visibility: "off"}]},
      { featureType: "poi", stylers: [{visibility: "off"}]}
    ],
    mapTypeControl: true, 
    streetViewControl: true,
  };

  constructor() { }

  addMarker(location: google.maps.LatLng) {
  
    // Borrar marcador anterior.
    if (this.currentMarker) {
      this.currentMarker.setMap(null);
    }

    // Crea un nuevo marcador
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });

    // Asignar marcador actual.
    this.currentMarker = marker;
  }

}
