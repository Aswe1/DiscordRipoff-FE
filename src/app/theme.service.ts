import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(true);
  isDarkMode$ = this.isDarkMode.asObservable();

  applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.removeItem('darkMode');
    }
  }

  initializeTheme() {
    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
    const isDark = savedDarkMode === 'true' || (savedDarkMode === null && prefersDark);
    console.log('Initializing theme:', isDark);
    this.applyTheme(isDark);
    this.isDarkMode.next(isDark);
  }
  
  toggleTheme() {
    const currentMode = this.isDarkMode.value;
    console.log('Toggling theme to:', !currentMode);
    this.isDarkMode.next(!currentMode);
    this.applyTheme(!currentMode);
  }
}

