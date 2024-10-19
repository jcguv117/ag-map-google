import { inject, Injectable } from '@angular/core';
import { MarkerService } from './marker.service';
import { AdvancedMarkerService } from './advanced-marker.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map!:google.maps.Map;
  currentMarker!: any;
  public zoom: number = 10;
  public center!: google.maps.LatLngLiteral;

  mapOptions: google.maps.MapOptions;

  // marker = inject(MarkerService);
  marker = inject(AdvancedMarkerService);

  constructor() {
    this.mapOptions = {
      center: this.center,
      zoom: this.zoom,
      ...this.marker.mapOptions
    };
  }

  setMap(map: google.maps.Map) {
    this.map = map;
    this.marker.map = map;
  }

  onClickMap() {
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if(event.latLng) this.marker.addMarker(event.latLng)
    })
  }
  
}
