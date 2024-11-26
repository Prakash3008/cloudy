import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private AQI_API_KEY = '8397994a3fe0c1c23b9dc85ce559ea08db5bcb99';
  private OW_API_KEY = '15bab98feb5c73625874388c33638610';
  private FLASK_BACKEND_URL = 'http://127.0.0.1:5000';


  constructor(private http: HttpClient) { }

  fetchWeatherData = async (latitude: number, longitude: number): Promise<any> => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.OW_API_KEY}`;
      return await lastValueFrom(this.http.get(weatherUrl));
    } catch (error: any) {
      this.handleError(error);
    }
  };

  // Fetch AQI data using waqi API
  fetchAQIData = async (latitude: number, longitude: number): Promise<any> => {
    try {
      const aqiUrl = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${this.AQI_API_KEY}`;
      return await lastValueFrom(this.http.get(aqiUrl));
    } catch (error: any) {
      this.handleError(error);
    }
  };

  fetchAllStops = async (): Promise<any> => {
    try {
      const all_stops = `${this.FLASK_BACKEND_URL}/all_stops`;
      return await lastValueFrom(this.http.get(all_stops));
    } catch (error: any) {
      this.handleError(error);
    }
  };

  private handleError(error: HttpErrorResponse): void {
    let errorMsg = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMsg = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMsg = `Server error (Code: ${error.status}): ${error.message}`;
    }
    console.error(errorMsg);
    throw new Error(errorMsg); // Throw an error to reject the Promise
  }
}
