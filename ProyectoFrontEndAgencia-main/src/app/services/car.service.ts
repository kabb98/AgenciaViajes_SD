import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Car } from '../models/Car';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  miAPI = 'http://localhost:5000/coches';
    selectedCar: Car = {
        nombre: '',
        origen: '',
        destino: '',
        fechaIda: new Date(),
        fechaVuelta: new Date(),
        precio: 0
    };
    cars: Array<Car>;

    constructor(private http: HttpClient) {}

    getCars(){
        return this.http.get<Car[]>(`${this.miAPI}`);
    }

    addCar(newCar: Car){
        return this.http.post<Car>(`${this.miAPI}`, newCar);
    }

    deleteCar(id: any){
        return this.http.delete<any>(`${this.miAPI}/${id}`);
    }

    updateCar(newData: Car)
    {
      console.log(newData);
      return this.http.put<any>(`${this.miAPI}/${newData._id}`, newData);
    }


    getCarsBooked()
    {
      return this.http.get<Car[]>(`${this.miAPI}Reservados/${localStorage.id}`);
    }
}
