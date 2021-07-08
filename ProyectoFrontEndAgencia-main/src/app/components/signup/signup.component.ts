import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    user = {
        email: '',
        nombre: '',
        password: ''
    }

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    signUp() {
        console.log(this.user);
        this.authService.signUp(this.user).subscribe(
            respuesta => {
                console.log(respuesta);
                localStorage.setItem('token', respuesta.token);
                console.log('Token Registro: ' + localStorage.getItem('token'));
                this.router.navigate(['/reservasDisponibles']);
            },
            err => {
              alert('Email existente'); 
            }
        );
    }
}
