import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from './environments/environment';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${environment.baseUrl}`;
  private http    = inject(HttpClient)

  constructor(
    private router: Router
  ) {}

  login(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, user);
  }
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

