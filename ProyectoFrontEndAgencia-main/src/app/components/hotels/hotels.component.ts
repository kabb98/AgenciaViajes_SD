import { Component, OnInit } from '@angular/core';
import { HotelService } from 'src/app/services/hotel.service';
import { Hotel } from 'src/app/models/Hotel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css'],
  providers: [HotelService]
})
export class HotelsComponent implements OnInit {

  constructor(
    public hotelService: HotelService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getHoteles();
    this.authService.getUsuario().subscribe
    (
      res => {
        localStorage.setItem('id', res.usuario._id);
      }
    )
  }

  getHoteles() {

    this.hotelService.getHotels()
      .subscribe(hoteles => {
        this.hotelService.hotels = hoteles;
      });
  }
/*
  getUser()
  {
    this.authService.getUsuario().subscribe
    (
      res => {
        localStorage.setItem('id', res.usuario._id);
      }
    )
  }*/



  reservarHotel(hotel: Hotel){
    const respuesta = confirm('¿Estás seguro que desea reservar este coche?');
    if (respuesta) {
      hotel.client = localStorage.id;
      hotel.reservado = true;
      console.log(hotel);
      this.hotelService.updateHotel(hotel).subscribe(
        res =>
        {
          this.getHoteles();
          //window.location.reload();
        }
      )
    }
  }
}
