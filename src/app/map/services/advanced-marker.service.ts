import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdvancedMarkerService {

  map!: google.maps.Map;
  currentMarker!: google.maps.marker.AdvancedMarkerElement;

  public mapOptions: google.maps.MapOptions = {
    mapId: "4504f8b37365c3d0", // Si se activa se usa los estilos del Cloud
  };

  constructor() { }

  drawActiveMarkers(data:any) {
    for (const property of data) {

      const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        content: this.buildContent(property),
        position: property.position,
        title: property.description,
      });

      AdvancedMarkerElement.addListener("click", () => {
        this.toggleHighlight(AdvancedMarkerElement, property);
      });
    }
  }

  addMarker(location: google.maps.LatLng) {
    
    // Borrar marcador anterior.
    if (this.currentMarker) {
      this.currentMarker.map = null;
    }

    const markerContent = document.createElement('div');
    markerContent.className = 'custom-marker';
    markerContent.innerHTML = `
      <h2 style="background-color: white; border-radius: 15px; padding: 10px;">¡Hola desde mi marcador!</h2>
      <p class="p-2 bg-white text-xl rounded-md mt-2">Este es un contenido personalizado.</p>
    `;

    // Crea un nuevo marcador
    let marker = new google.maps.marker.AdvancedMarkerElement({
        content: markerContent,
      position: location,
      map: this.map,
    });

    // Asignar marcador actual.
    this.currentMarker = marker;
  }

  toggleHighlight(markerView:any, property: any) {
    if (markerView.content.classList.contains("highlight")) {
      markerView.content.classList.remove("highlight");
      markerView.zIndex = null;
    } else {
      markerView.content.classList.add("highlight");
      markerView.zIndex = 1;
    }
  }


  buildContent(property: any) {
    const content = document.createElement("div");
  
    content.classList.add("property");
    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa fa-icon fa-${property.type}" title="${property.type}"></i>
          <span class="fa-sr-only">${property.type}</span>
      </div>
      <div class="details">
          <div class="price">${property.price}</div>
          <div class="address">${property.address}</div>
          <div class="features">
          <div>
              <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>
              <span class="fa-sr-only">bedroom</span>
              <span>${property.bed}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
              <span class="fa-sr-only">bathroom</span>
              <span>${property.bath}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>
              <span class="fa-sr-only">size</span>
              <span>${property.size} ft<sup>2</sup></span>
          </div>
          </div>
      </div>
      `;
    return content;
  }
}
