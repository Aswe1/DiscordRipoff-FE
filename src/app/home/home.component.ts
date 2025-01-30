import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Friend } from '../models/friend.model';
import { Channel } from '../models/channel.model';
import { Message } from '../models/message.model';
import { DatePipe } from '@angular/common';
import { User } from '../models/user.model';


@Component({
  selector: 'app-home',
  imports: [FormsModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit
{
  channels: Channel[] = [];
  friends: Friend[] = [];
  selectedChannelId?: number;
  selectedFriendId?: number;
  messages: Message[] = [];
  newMessageInBox: string = '';

  showAddChannelDialog = false;
  showAddFriendDialog = false;
  newChannelName = '';
  newFriendId = '';

  userId = Number(localStorage.getItem('userId')) || -1;
  username = localStorage.getItem('username') || " ";
  email = localStorage.getItem('email') || " ";

  errorMessage: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.userId = Number(localStorage.getItem('userId')) || -1;
    this.username = localStorage.getItem('username') || " ";
    this.email = localStorage.getItem('email') || " ";

    this.loadChannels(this.userId);
    this.loadFriends(this.userId);
  }

  loadChannels(userId: number) {
    this.apiService.getChannels(userId).subscribe({
      next: (channels) => {
        this.channels = channels;
      },
      error: (error) => {
        console.error('Error loading channels:', error);
        this.errorMessage = 'Failed to load channels';
      }
    });
  }

  loadFriends(userID: number) 
  {
    if(userID == -1)  return; //Not LoggedIn
 
    this.apiService.getFriends(userID).subscribe(friends => {
      this.friends = friends;
    });
  }

  selectChannel(channelId: number) {
    this.selectedChannelId = channelId;
    this.apiService.getChannelMessages(channelId).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() 
  {
    if (!this.newMessageInBox.trim()) return;
    

    var selectedfriend;

    for (var friend of this.friends) 
    {
      if (friend.user.id == this.selectedFriendId) 
        {
          selectedfriend = friend.user;
          break; 
        } 
    }

    const msg: Message = 
    {
      content: this.newMessageInBox,
      sender: { id: this.userId, username: this.username, email: this.email}, 
      receiver: selectedfriend
      //channel: { id: 123, name: "General" },
    };
    

    if (this.selectedChannelId) 
      {
      this.apiService.sendChannelMessage(this.selectedChannelId, this.newMessageInBox).subscribe(this.handleNewMessage);
    } 
    else if (this.selectedFriendId)
    {
      this.apiService.sendDirectMessage(msg).subscribe(this.handleNewMessage);
    }
  }
  
  createChannel() {
    if (!this.newChannelName.trim()) return;
 
  
    const channel: Channel = {
      name: this.newChannelName,
      owner: {
        id: this.userId,
        username: this.username,
        email: this.email
      }
    };


    this.apiService.createChannel(channel).subscribe({
      next: (response) => {
        if (response.successful) {
          this.showAddChannelDialog = false;
          this.newChannelName = '';
          this.loadChannels(this.userId);
        }
        this.errorMessage = response.message;
      },
      error: (error) => {
        console.error("Error:", error);
        this.errorMessage = error.error.message || 'An error occurred';
      }
    });
  }
 
  addFriend() {
    if (!this.newFriendId.trim()) return;
    
    this.apiService.addFriend(this.newFriendId).subscribe({
      next: (response) => {
        this.errorMessage = response.message;
        if (response.successful) 
          {
          this.showAddFriendDialog = false;
          this.newFriendId = '';
          this.loadFriends(this.userId);
        }
      },
      error: (error) => {
        console.error("Error:", error);
        this.errorMessage = error.error.message || 'An error occurred';
      }
    });
  }
  loadDirectMessages(friendId: number) {
    this.apiService.getDirectMessages(friendId).subscribe(messages => {
      this.messages = messages;
    });
  }
 
  private handleNewMessage = (message: Message) => 
  {
    if (this.selectedFriendId !== undefined)
      this.loadDirectMessages(this.selectedFriendId);

    this.newMessageInBox = '';
  }

  selectFriend(id: number) {
    if(id < 0) return;
    this.selectedFriendId = id;
    this.selectedChannelId = undefined;
    this.loadDirectMessages(id);
  }
}
