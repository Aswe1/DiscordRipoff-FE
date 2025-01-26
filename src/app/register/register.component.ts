import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService) {}

  onRegister(): void {
    const newUser: User = {
      username: this.username,
      password: this.password,
      email: this.email 
    };

    this.apiService.register(newUser).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
      },
      error: (error) => {
        console.error('Error during registration:', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }
}
