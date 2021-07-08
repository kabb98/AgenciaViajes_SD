import { HotelService } from 'src/app/services/hotel.service';
import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';
import { Flight } from 'src/app/models/Flight';


@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css'],
  providers: [HotelService]
})
export class FlightsComponent implements OnInit {

  constructor(public flightService: FlightService) { }

  ngOnInit(): void {
    this.getFlights();
  }

  getFlights(){
    this.flightService.getFlights().subscribe
    (vuelos => {
      this.flightService.flights = vuelos;
    });
  }

  reservarVuelo(flight: Flight)
  {
    const respuesta = confirm('¿Estás seguro que desea reservar este coche?');
    if (respuesta) {
      flight.client = localStorage.id;
      flight.reservado = true;
      this.flightService.updateFlight(flight).subscribe(
        res =>
        {
          this.getFlights();
          //window.location.reload();
        }
      )
    }
  }
}


