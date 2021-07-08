import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL = 'http://localhost:5000';
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signUp(user) {
    return this.http.post<any>(this.URL + '/registro', user);
  }

  signIn(user) {
    return this.http.post<any>(this.URL + '/iniciarSesion', user);
  }



  getUsuario() {
    return this.http.get<any>(this.URL + '/getUsuario');
  }

  isloggedIn(): Boolean {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.router.navigate(['/signin']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  editProfile(user: User, id)
  {
    return this.http.put<any>(`${this.URL}/editProfile/${id}`, user);
  }
}
