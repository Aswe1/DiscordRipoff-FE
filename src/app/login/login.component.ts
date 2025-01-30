import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl   : './login.component.css',
  standalone: true,
  imports: [FormsModule, RouterModule]
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService, 
    private router: Router
  ) {}

 

  onSubmit(form: NgForm) {

  const newUser: User = {
      id: -1,
      username: this.username,
      password: this.password,
      email: this.email 
    };

    if (form.valid) 
      {
      this.apiService.login(newUser).subscribe({
          next: (response) => {
            if (response.successful) 
              {
              localStorage.setItem('userId', response.data.id.toString());
              localStorage.setItem('username', response.data.username);
              localStorage.setItem('email', response.data.email);

              this.router.navigate(['/home']);
            } else {
              this.errorMessage = 'Invalid credentials';
            }
          },
          error: () => {
            this.errorMessage = 'Login failed. Please try again.';
          }
        });
    }

  


  }

  }

