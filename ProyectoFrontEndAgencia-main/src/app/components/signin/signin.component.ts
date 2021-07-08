import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    user = {
        email: '',
        password: ''
    }
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    signIn() {
        console.log(this.user);
        this.authService.signIn(this.user).subscribe(
            respuesta => {
                console.log(respuesta);
                localStorage.setItem('token', respuesta.token);
                console.log('Token Login: ' + localStorage.getItem('token'));
                this.router.navigate(['/reservasDisponibles']);
            },
            err => {
                alert('Contraseña o email incorrectos');
            }
        );
    }
}
