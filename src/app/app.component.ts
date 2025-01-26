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

  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe(
      mode => this.isDarkMode = mode
    );
  }

  ngOnInit() {
    this.themeService.initializeTheme();
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }
}
