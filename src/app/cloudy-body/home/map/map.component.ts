import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { HomeService } from '../home.service';
import 'leaflet';
import 'leaflet-routing-machine';
declare let L: { map: (arg0: string, arg1: { center: number[]; zoom: number; }) => any; tileLayer: (arg0: string, arg1: { maxZoom: number; minZoom: number; attribution: string; }) => { (): any; new(): any; addTo: { (arg0: any): any; new(): any; }; }; Control: new (arg0: { position: string; }) => any; DomUtil: { create: (arg0: string, arg1: string) => any; }; circleMarker: (arg0: any[], arg1: { radius: number; fillColor: string; color: string; weight: number; opacity: number; fillOpacity: number; }) => { (): any; new(): any; addTo: { (arg0: any): any; new(): any; }; }; marker: (arg0: number[]) => { (): any; new(): any; addTo: { (arg0: any): any; new(): any; }; }; polyline: (arg0: any[][], arg1: { color: string; }) => { (): any; new(): any; addTo: { (arg0: any): any; new(): any; }; }; Routing: { control: (arg0: { waypoints: any[]; routeWhileDragging: boolean; }) => { (): any; new(): any; addTo: { (arg0: any): void; new(): any; }; }; }; latLng: (arg0: number, arg1: number) => any; };

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
  weatherData: any;
  aqiData: any;
  weatherControl: any;
  sourceWeatherControl: any;
  destinationWeatherControl: any;
  stopSelection: any;
  private routingControl: any;




  constructor(private apiService: ApiServiceService, private homeService: HomeService) { }
  ngOnInit(): void {
    this.initMap();
    this.getUserLocation();

    this.homeService.stopSelection$.subscribe((status: any) => {
      this.stopSelection = status;
      
      this.drawRoute();
    });
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
    }).addTo(this.map);

    this.weatherControl = new L.Control({ position: 'topright' });

    this.weatherControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'weather-control');
      div.innerHTML = `
        <div style="padding: 5px 10px; background: white;border: 1px solid #ccc; border-radius: 5px;">
          <div style="display:flex; gap:2px"><h4>Weather: </h4><p>Loading...</p></div>
          <div style="display:flex; gap:2px"><h4>Temp: </h4><p>Loading...</p></div>
          <div style="display:flex; gap:2px"><h4>AQI: </h4><p>Loading...</p></div>
        </div>
      `;
      return div;
    };

    this.sourceWeatherControl = new L.Control({ position: 'topright' });

    this.sourceWeatherControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'weather-control');
      div.innerHTML = `
        <div style="display: none; padding: 5px 10px; background: white;border: 1px solid #ccc; border-radius: 5px;">
          <div style="display:flex; gap:2px"><h4>Weather: </h4><p>Loading...</p></div>
          <div style="display:flex; gap:2px"><h4>Temp: </h4><p>Loading...</p></div>
          <div style="display:flex; gap:2px"><h4>AQI: </h4><p>Loading...</p></div>
        </div>
      `;
      return div;
    };


    this.destinationWeatherControl = new L.Control({ position: 'topright' });

    this.destinationWeatherControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'weather-control');
      div.innerHTML = `
        <div style="display: none;padding: 5px 10px; background: white;border: 1px solid #ccc; border-radius: 5px;">
          <div style="display:flex; gap:2px"><h4>Weather: </h4><p>Loading...</p></div>
          <div style="display:flex; gap:2px"><h4>Temp: </h4><p>Loading...</p></div>
          <div style="display:flex; gap:2px"><h4>AQI: </h4><p>Loading...</p></div>
        </div>
      `;
      return div;
    };


    this.weatherControl.addTo(this.map);  
    this.sourceWeatherControl.addTo(this.map);  
    this.destinationWeatherControl.addTo(this.map);  

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
    if (aqi <= 100) return 'orange';
    if (aqi <= 150) return 'brown';
    return 'red';
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        this.addUserMarker(userLat, userLng, "Current Location");
        this.map.setView([userLat, userLng], 14);
      }, () => {
        alert("Unable to retrieve your location.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  private async addUserMarker(lat: number, lng: number, position: string): Promise<void> {
    if (this.userMarker) {
      this.map.removeLayer(this.userMarker);
    }
    this.weatherData = await this.apiService.fetchWeatherData(lat, lng);
    this.aqiData = await this.apiService.fetchAQIData(lat, lng);
    this.userMarker = L.marker([lat, lng]).addTo(this.map);

    this.updateWeatherAndAQI(position);
    
  }

  updateWeatherAndAQI(position: string) {
    const weather = this.weatherData.weather[0].description;
    const temp = this.weatherData.main.temp;
    const aqi = this.aqiData.data.aqi;
    const color = this.getAQIColor(aqi);
    if(position == "Current Location") {
      this.weatherControl.getContainer().innerHTML = `
      <div style="padding: 5px 10px; background: white;border: 1px solid #ccc; border-radius: 5px;">
      <div style="display:flex; gap:2px"><h4>Position: </h4><p>${position}</p></div>

      <div style="display:flex; gap:2px"><h4>Weather: </h4><p>${weather}</p></div>
      <div style="display:flex; gap:2px"><h4>Temp: </h4><p>${temp.toFixed(1)}°C</p></div>
      <div style="display:flex; gap:2px"><h4>AQI: </h4><p style="color: ${color}">${aqi}</p></div>
        
      </div>
    `;
    }

    if(position == "Source Stop"){
      this.sourceWeatherControl.getContainer().innerHTML = `
      <div style="padding: 5px 10px; background: white;border: 1px solid #ccc; border-radius: 5px;">
      <div style="display:flex; gap:2px"><h4>Position: </h4><p>${position}</p></div>

      <div style="display:flex; gap:2px"><h4>Weather: </h4><p>${weather}</p></div>
      <div style="display:flex; gap:2px"><h4>Temp: </h4><p>${temp.toFixed(1)}°C</p></div>
      <div style="display:flex; gap:2px"><h4>AQI: </h4><p style="color: ${color}">${aqi}</p></div>
        
      </div>
    `;
    }
    if(position == "Destination Stop"){
      this.destinationWeatherControl.getContainer().innerHTML = `
      <div style="padding: 5px 10px; background: white;border: 1px solid #ccc; border-radius: 5px;">
      <div style="display:flex; gap:2px"><h4>Position: </h4><p>${position}</p></div>

      <div style="display:flex; gap:2px"><h4>Weather: </h4><p>${weather}</p></div>
      <div style="display:flex; gap:2px"><h4>Temp: </h4><p>${temp.toFixed(1)}°C</p></div>
      <div style="display:flex; gap:2px"><h4>AQI: </h4><p style="color: ${color}">${aqi}</p></div>
        
      </div>
    `;
    }
    
  }

  private async drawRoute(): Promise<void> {
    if(this.stopSelection){
      if (this.routingControl) {
        this.map.removeControl(this.routingControl); // Remove routing control
        this.routingControl = null; // Clear reference
      }
      this.weatherData = await this.apiService.fetchWeatherData(this.stopSelection.source.stop_lat, this.stopSelection.source.stop_lon);
      this.aqiData = await this.apiService.fetchAQIData(this.stopSelection.source.stop_lat, this.stopSelection.source.stop_lon);
      this.updateWeatherAndAQI("Source Stop")

      this.weatherData = await this.apiService.fetchWeatherData(this.stopSelection.destination.stop_lat, this.stopSelection.destination.stop_lon);
      this.aqiData = await this.apiService.fetchAQIData(this.stopSelection.destination.stop_lat, this.stopSelection.destination.stop_lon);
      this.updateWeatherAndAQI("Destination Stop")
      let sourceLatLongs = L.latLng(this.stopSelection.source.stop_lat, this.stopSelection.source.stop_lon);
      let destLatLongs = L.latLng(this.stopSelection.destination.stop_lat, this.stopSelection.destination.stop_lon);
      this.routingControl = L.Routing.control({
        waypoints: [
          sourceLatLongs,
          destLatLongs
        ],
        routeWhileDragging: true
    }).addTo(this.map);
    }
    
  }


}
