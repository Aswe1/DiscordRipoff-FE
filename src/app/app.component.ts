import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe(
      mode => this.isDarkMode = mode
    );
  }

  ngOnInit() {
    const storedId = localStorage.getItem("userId");
    const userId = storedId ? Number(storedId) : -1;

    this.themeService.initializeTheme();
    this.UserID = userId.toString();
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }
}
