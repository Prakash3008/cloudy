import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  private map: any;
  userMarker: any;
  private markers: any[] = [];



  constructor() { }
  ngOnInit(): void {
    this.initMap();
    this.getUserLocation();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    tiles.addTo(this.map);
    //this.addMarkers();
  }

  private addMarkers(): void {
    this.markers.forEach((marker: any) => {
      const color = this.getAQIColor(marker.aqi);
      const leafletMarker = L.circleMarker([marker.lat, marker.lng], {
        radius: 8,
        fillColor: color,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      }).addTo(this.map);

      leafletMarker.bindPopup(`<b>${marker.name}</b><br>AQI: ${marker.aqi}`);
    });
  }

  private getAQIColor(aqi: number): string {
    if (aqi <= 50) return 'green';
    if (aqi <= 100) return 'yellow';
    if (aqi <= 150) return 'orange';
    return 'red';
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        this.addUserMarker(userLat, userLng);
        this.map.setView([userLat, userLng], 14);
      }, () => {
        alert("Unable to retrieve your location.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  private addUserMarker(lat: number, lng: number): void {
    if (this.userMarker) {
      this.map.removeLayer(this.userMarker);
    }
    this.userMarker = L.marker([lat, lng]).addTo(this.map).bindPopup('Your Location').openPopup();
  }

  private drawRoute(): void {
    const latLngs = this.markers.map(marker => [marker.lat, marker.lng]);
    const route = L.polyline(latLngs, { color: 'blue' }).addTo(this.map);
    this.map.fitBounds(route.getBounds());
  }


}
