import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from './environments/environment';
import { User } from './models/user.model';
import { Channel } from './models/channel.model';
import { Friend } from './models/friend.model';
import { Message } from './models/message.model';

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
    return this.http.post(`${this.apiUrl}/users/register`, user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getChannels(userID: number): Observable<Channel[]> {
    return this.http.get<{ code: number, data: Channel[], successful: boolean }>(
      `${this.apiUrl}/channels/${userID}`
    ).pipe(
      map(response => {
        if (response.successful) {
          return response.data.map(channel => ({
            id: channel.id,
            name: channel.name,
            owner: channel.owner
          }));
        }
        return [];
      })
    );
  }

  getFriends(userID: number): Observable<Friend[]>  
  {
  return this.http.get<{ successful: boolean; data: any[] }>(`${this.apiUrl}/friends/${userID}`)
    .pipe(
      map(response => {
        if (response.successful) 
          {
          return response.data.map(friendship => ({
            id: friendship.id,
            user: friendship.user1.id === userID ? friendship.user2 : friendship.user1
          }));
        }
        return [];
      })
    );
  }

  getChannelMessages(channelId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/channel/messages/${channelId}`);
  }

  sendChannelMessage(channelId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/channel/messages/${channelId}`, { content });
  }

  createChannel(channel: Channel): Observable<{ code: number, message: string, successful: boolean }> {
    return this.http.post<{ code: number, message: string, successful: boolean }>(
      `${this.apiUrl}/channels/new`, 
      channel
    );
  }

  addFriend(friendId: string) {
    const userId = Number(localStorage.getItem('userId')) || -1;
  return this.http.get<{ code: number, message: string, successful: boolean }>( `${this.apiUrl}/friends/add?userId=${userId}&friendId=${friendId}`);
  }
  
  getDirectMessages(friendId: number) {
  const userId = Number(localStorage.getItem('userId')) || -1;

  return this.http.get<{ code: number, data: Message[], successful: boolean }>(
      `${this.apiUrl}/friends/messages/${userId}/${friendId}`
    ).pipe(
      map(response => response.data)
    );
  }
   
   sendDirectMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/friends/messages`, message);
   }
}


