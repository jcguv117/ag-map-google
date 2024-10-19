import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ GoogleMapsModule ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {

  private map!: google.maps.Map;
  public zoom: number = 10;
  public center!: google.maps.LatLngLiteral;

  public mapOptions: google.maps.MapOptions = {
    styles: [
      { featureType: "all", stylers: [ { saturation: -40 }, { lightness: 20 }  ], },
      { featureType: "road.highway",elementType: "labels",stylers:[{visibility: "off"}]}, //turns off highway labels
      { featureType: "road.arterial",elementType: "labels",stylers: [{visibility: "off"}]}, //turns off arterial roads labels
      { featureType: "road.local",elementType: "labels",stylers: [{visibility: "off"}]},
      { featureType: "poi", stylers: [{visibility: "off"}]}
    ],
    mapTypeControl: true, 
    streetViewControl: true,
    center: this.center,
    zoom: this.zoom
  };

  initMap(map: google.maps.Map) {
    this.map = map;
  }

}
