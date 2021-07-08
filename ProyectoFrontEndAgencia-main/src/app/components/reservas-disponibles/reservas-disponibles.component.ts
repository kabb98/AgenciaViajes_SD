import { FlightService } from 'src/app/services/flight.service';
import { HotelService } from 'src/app/services/hotel.service';
import { CarService } from 'src/app/services/car.service';
import { Component, OnInit } from '@angular/core';
import { ApiGWService } from 'src/app/services/api-gw.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reservas-disponibles',
  templateUrl: './reservas-disponibles.component.html',
  styleUrls: ['./reservas-disponibles.component.css'],
  providers: [CarService, HotelService, FlightService, ApiGWService]
})
export class ReservasDisponiblesComponent implements OnInit {

  constructor(public apiService: ApiGWService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.getUsuario();
  }

  getUsuario() {
    this.authService.getUsuario().subscribe
    (usuario => {
      console.log(usuario);
    });
  }

  getReservasDisponibles(){
  }

}
