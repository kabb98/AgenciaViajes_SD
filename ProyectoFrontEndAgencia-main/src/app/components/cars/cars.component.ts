import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/car.service';
import { Car } from 'src/app/models/Car';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

import { Book } from 'src/app/models/Book';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
  providers: [CarService]
})
export class CarsComponent implements OnInit {
  cars: Array<Car>
  userId = '';
  reserva: Car = {
    nombre: '',
    origen: '',
    destino: '',
    fechaVuelta: new Date(),
    fechaIda: new Date(),
    precio: 0,
    client: ''
  };


  constructor(
    public carService: CarService,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.getCars();
  }

  getCars() {
    this.carService.getCars()
      .subscribe(
        cars => {
          this.cars = cars;
        });
  }

  addCar(form: NgForm) {
    if (form.value._id) {
      this.carService.updateCar(form.value).subscribe(
        respuesta => console.log(respuesta),
        err => console.log(err)
      );
    }
    else {
      console.log('Creando coche!!!!')
      this.carService.addCar(form.value).subscribe(
        respuesta => {
          this.getCars();
          form.reset();
        },
        err => console.log(err)
      );
    }
  }


  deleteCar(id) {
    const respuesta = confirm('¿Estás seguro que desear borrar este coche?');

    if (respuesta) {
      const cars = this.carService.cars;
      this.carService.deleteCar(id)
        .subscribe(data => {
          this.getCars();
        });
    }
  }

  resetForm(form: NgForm) {
    console.log('Borrando formulario');
    form.reset();
  }

  editCar(car: Car) {
    this.carService.selectedCar = car;
  }


  reservarCoche(car: Car) {
    const respuesta = confirm('¿Estás seguro que desea reservar este coche?');
    if (respuesta) {
      car.client = localStorage.id;
      car.reservado = true;
      this.carService.updateCar(car).subscribe(
        res =>
        {
          this.getCars();
          //window.location.reload();
        }
      )
    }
  }
}
