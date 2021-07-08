import { CarService } from 'src/app/services/car.service';
import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/Car';

@Component({
  selector: 'app-coches-reservados',
  templateUrl: './coches-reservados.component.html',
  styleUrls: ['./coches-reservados.component.css']
})
export class CochesReservadosComponent implements OnInit {
  cars: Car[];
  constructor(
    private carService: CarService
  ) { }

  ngOnInit(): void {
    this.carService.getCarsBooked().subscribe(
      coches =>
      {
        this.cars = coches;
      },
      
        err => {
          alert('No hay reservas');
        }
      
    )
  }

}
