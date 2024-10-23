import { inject, Injectable } from '@angular/core';
import { MarkerService } from './marker.service';
import { AdvancedMarkerService } from './advanced-marker.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  public map        : google.maps.Map | null;
  public mapOptions : google.maps.MapOptions;
  public zoom       : number = 11;
  public center     : google.maps.LatLngLiteral = { lat: 19.432608, lng: -99.133209 }

  geoJsonFeatures: google.maps.Data.Feature[] = [];

  // marker = inject(MarkerService);
  marker = inject(AdvancedMarkerService);

  constructor() {
    this.map = null;
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

  cleanMap() {
    this.map = null;
    this.marker.map = null;
  }

  onClickMap() {
    this.map?.addListener('click', (event: google.maps.MapMouseEvent) => {
      if(event.latLng) this.marker.addMarker(event.latLng)
    })
  }

  loadGeoJson(url: string) {
    try {
      if (this.map) {
        this.map.data.loadGeoJson(url, {}, (features: google.maps.Data.Feature[]) => {
          this.geoJsonFeatures = features;
          this.fitMapToGeoJsonBounds(features);
        });
      }
    } catch (error) {
      console.log("loadGeoJson ~ error:", error)
    }
  }

  loadGeoJsonPromise( url: string, props:any=null ): Promise<google.maps.Data>{
    return new Promise<google.maps.Data>(( resolve, reject )=>{
        this.map?.data.loadGeoJson( url,{ ...props },( features ) => {
            this.geoJsonFeatures = features;
            if(this.map) resolve(this.map.data);
            else resolve(new google.maps.Data);
        });
    });
  }

  // Ajustar el zoom y centro a los límites del GeoJSON
  fitMapToGeoJsonBounds(features: google.maps.Data.Feature[]) {
    if(!this.map) return; 

    const bounds = new google.maps.LatLngBounds();
    features.forEach((feature) => {
      feature.getGeometry()?.forEachLatLng((latLng) => {
        bounds.extend(latLng);
      });
    });

    this.map.fitBounds(bounds);
  }

  generateRandomCoordinatesInPolygon(): google.maps.LatLngLiteral | null {
    if (this.geoJsonFeatures.length === 0) return null;

    // Obtener la geometría del primer feature
    const geometry = this.geoJsonFeatures[0].getGeometry();
  
    if (!geometry || geometry.getType() !== 'Polygon') {
      console.error('La geometría no es un polígono.');
      return null;
    }
  
    // Extraer el primer conjunto de coordenadas del polígono
    const polygonCoords = (geometry as google.maps.Data.Polygon).getArray()[0].getArray();

    const bounds = new google.maps.LatLngBounds();
    polygonCoords.forEach(point => bounds.extend(point));

    let randomLatLng: google.maps.LatLngLiteral | null = null;
    let attempts = 0;
    const maxAttempts = 100; // Limite de intentos

    // Intentamos generar una coordenada válida dentro del polígono
    while (attempts < maxAttempts) {
      const randomLat = bounds.getSouthWest().lat() + Math.random() * (bounds.getNorthEast().lat() - bounds.getSouthWest().lat());
      const randomLng = bounds.getSouthWest().lng() + Math.random() * (bounds.getNorthEast().lng() - bounds.getSouthWest().lng());
      randomLatLng = { lat: randomLat, lng: randomLng };

      if (this.isPointInPolygon(randomLatLng, polygonCoords)) {
        return randomLatLng; // Devuelve la coordenada si está dentro del polígono
      }

      attempts++;
    }

    return null; // Si no se encontró ninguna coordenada válida
  }
  
  // Función para verificar si un punto está dentro del polígono
  isPointInPolygon(point: google.maps.LatLngLiteral, polygon: google.maps.LatLng[]): boolean {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat();
      const yi = polygon[i].lng();
      const xj = polygon[j].lat();
      const yj = polygon[j].lng();

      const intersect = ((yi > point.lng) !== (yj > point.lng)) &&
        (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }
}
