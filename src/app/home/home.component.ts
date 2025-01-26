import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Channel {
  id: number;
  name: string;
}

interface Friend {
  id: number;
  name: string;
}

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: Date;
}

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  channels: Channel[] = [];
  friends: Friend[] = [];
  messages: Message[] = [];
  newMessage: string = '';

  sendMessage() {
    // Implement send logic
  }
}
