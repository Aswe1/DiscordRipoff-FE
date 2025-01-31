import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DiscordRipoff-FE';

  isDarkMode = false;
  UserID: string = '';

  constructor(private themeService: ThemeService,private router: Router) {
    this.themeService.isDarkMode$.subscribe(
      mode => this.isDarkMode = mode
    );
  }

  ngOnInit() {

    const userId = Number(localStorage.getItem('userId')) || -1;

    if(userId < 0) this.router.navigate(['/login']);

    this.themeService.initializeTheme();
    this.UserID = userId.toString();
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }
}
