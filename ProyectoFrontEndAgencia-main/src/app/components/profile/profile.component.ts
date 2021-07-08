import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  email = '';
  nombre = '';
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser()
  {
    this.authService.getUsuario().subscribe(
      user => {
        console.log(user.usuario);
        this.email = user.usuario.email,
        this.nombre = user.usuario.nombre,
        console.log('Email: ' + this.email);
        console.log('Nombre: ' + this.nombre);
        console.log('Id: ' + user.usuario._id);

      }
    )
  }
  editarPerfil()
  {
    this.router.navigate(['editProfile']);
  }

  misReservas()
  {
    this.router.navigate(['myBookings']);
  }
}
