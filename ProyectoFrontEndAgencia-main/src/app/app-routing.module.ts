import { MisReservasComponent } from './components/mis-reservas/mis-reservas.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservasDisponiblesComponent} from './components/reservas-disponibles/reservas-disponibles.component';

import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';

import  {AuthGuard} from './auth.guard';

const routes: Routes = [
    //Ruta inicial -> redirigimos a las reservas disponibles
    {
        path: '',
        redirectTo: '/reservasDisponibles',
        pathMatch: 'full'
    },
    {
        path: 'reservasDisponibles',
        component: ReservasDisponiblesComponent
    },
    //Dar de alta
    {
        path: 'signin',
        component: SigninComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
      path: 'profile',
      component: ProfileComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'editProfile',
      component: EditProfileComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'myBookings',
      component: MisReservasComponent,
      canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
