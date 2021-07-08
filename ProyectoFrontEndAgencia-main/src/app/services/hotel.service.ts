import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hotel } from '../models/Hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  miAPI = 'http://localhost:5000/hoteles';
  hotels: Array<Hotel>;

  constructor(private http: HttpClient) { }

  getHotels()
  {
    return this.http.get<Hotel[]>(`${this.miAPI}`);
  }

  addHotel(newCar: Hotel){
    return this.http.post<Hotel>(`${this.miAPI}`, newCar);
  }

  deleteHotel(id: any){
      return this.http.delete<any>(`${this.miAPI}/${id}`);
  }

  updateHotel(newData: Hotel)
  {
      return this.http.put<any>(`${this.miAPI}/${newData._id}`, newData);
  }
}
