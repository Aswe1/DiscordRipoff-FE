import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from './environments/environment';
import { User } from './models/user.model';
import { Channel } from './models/channel.model';
import { Friend } from './models/friend.model';
import { Message } from './models/message.model';
import { ChannelUser } from './models/channelUser.model';

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

  updateUserRole(UserID: number, updateUser: ChannelUser): Observable<ChannelUser> {
    return this.http.put<ChannelUser>(`${this.apiUrl}/channels/${UserID}/users`, updateUser);
  }

  updateChannel(UserID: number, updatedChannel: Channel): Observable<Channel> {
    return this.http.put<Channel>(`${this.apiUrl}/channels/${UserID}`, updatedChannel);
  }

  deleteChannelUser(channelID: number,channelUserID: number): Observable<void> {
    const userId = Number(localStorage.getItem('userId')) || -1;
    return this.http.delete<void>(`${this.apiUrl}/channels/${channelID}/auth/${userId}/user/${channelUserID}`);
  }

  deleteChannel(channelId: number): Observable<void> {
    const userId = Number(localStorage.getItem('userId')) || -1;
    return this.http.delete<void>(`${this.apiUrl}/channels/${channelId}/auth/${userId}`);
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

  sendChannelMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/channels/messages`, message );
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

  addUserToChannel(ChannelID: number,UserToAddID: string ) {
    const userId = Number(localStorage.getItem('userId')) || -1;
    return this.http.get<{ code: number, message: string, successful: boolean }>(`${this.apiUrl}/channels/${ChannelID}/auth/${userId}/add/${UserToAddID}`);
  }
    
  getChannelMessages(channelId: number): Observable<{ code: number, data: Message[], successful: boolean }> {
  return this.http.get<{ code: number, data: Message[], successful: boolean }>(
    `${this.apiUrl}/channels/${channelId}/messages`
  );
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

   getChannelUsers(channelId: number): Observable<ChannelUser[]> {
    return this.http.get<{ code: number, data: ChannelUser[], successful: boolean }>(
      `${this.apiUrl}/channels/${channelId}/users`
    ).pipe(
      map(response => {
        if (!response.successful || !Array.isArray(response.data)) {
          console.warn('Invalid response format:', response);
          return [];
        }
        return response.data;
      })
    );
  }

}


