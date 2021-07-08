import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { AuthGuard } from './auth.guard';

import { TokenInterceptorService } from './services/token-interceptor.service';
import { ReservasDisponiblesComponent } from './components/reservas-disponibles/reservas-disponibles.component';
import { CarsComponent } from './components/cars/cars.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { FlightsComponent } from './components/flights/flights.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { MisReservasComponent } from './components/mis-reservas/mis-reservas.component';
import { CochesReservadosComponent } from './components/coches-reservados/coches-reservados.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlidersComponent } from './components/sliders/sliders.component';

@NgModule({
    declarations: [
        AppComponent,
        SignupComponent,
        SigninComponent,
        ReservasDisponiblesComponent,
        CarsComponent,
        HotelsComponent,
        FlightsComponent,
        ProfileComponent,
        EditProfileComponent,
        MisReservasComponent,
        CochesReservadosComponent,
        SlidersComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        NgbModule
    ],
    providers: [
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
