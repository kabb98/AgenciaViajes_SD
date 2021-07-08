import { User } from './../../models/User';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  id: string;

  user: User = {
    nombre: '',
    email: '',
    password: ''
  }

  constructor(
    public authService: AuthService,
    public router: Router,

    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getIdUsuario();
  }

  getIdUsuario() {
    this.authService.getUsuario().subscribe(
      result => {
        localStorage.setItem('id', result.usuario._id);
      }
    )
  }

  editProfile(form: NgForm) {
    console.log('Id: ' + localStorage.getItem('id'));
    this.authService.editProfile(form.value, localStorage.getItem('id')).subscribe
      (res => {
        this.router.navigate(['/profile']);
      }
      );
  }
}
