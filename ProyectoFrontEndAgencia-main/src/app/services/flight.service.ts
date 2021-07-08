import { Flight } from './../models/Flight';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  miAPI = 'http://localhost:5000/vuelos';
  flights: Flight[];
  constructor(private http: HttpClient) { }


  getFlights()
  {
    return this.http.get<Flight[]>(`${this.miAPI}`);
  }

  addFlight(newCar: Flight){
    return this.http.post<Flight>(`${this.miAPI}`, newCar);
  }

  deleteFlight(id: any){
      return this.http.delete<any>(`${this.miAPI}/${id}`);
  }

  updateFlight(newData: Flight)
  {
      return this.http.put<any>(`${this.miAPI}/${newData._id}`, newData);
  }
}
