import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiGWService {
  miAPI = 'http://localhost:5000';

  constructor(private http: HttpClient) { }



}
