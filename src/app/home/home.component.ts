import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Friend } from '../models/friend.model';
import { Channel } from '../models/channel.model';
import { Message } from '../models/message.model';;
import { User } from '../models/user.model';
import { ChannelUser, UserRole } from '../models/channelUser.model';
import { DatePipe } from '@angular/common';


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
  channelUsers: ChannelUser[] = []; 

  selectedFriend?: User;

  showAddUserDialog = false;
  showAddChannelDialog = false;
  showAddFriendDialog = false;
  showRemoveChannelDialog = false;

  newChannelName = '';
  newFriendId = '';
  newMessageInBox: string = '';

  newUserToAddID = '';

  userId = Number(localStorage.getItem('userId')) || -1;
  username = localStorage.getItem('username') || " ";
  email = localStorage.getItem('email') || " ";

  AddFriendErrMsg: string = '';
  AddUserToChnlErrMsg: string = '';
  NewChannelErrMsg: string = '';

  editChannelName: string = '';
  showEditChannelDialog: boolean = false;
  selectedChannelForEdit: any = null;

  showModifyUserRoleDialog = false;
  selectedUserRole: UserRole = UserRole.GUEST;
  selectedUserForModify: ChannelUser | null = null;
  selectedChannelUserId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.userId = Number(localStorage.getItem('userId')) || -1;
    this.username = localStorage.getItem('username') || " ";
    this.email = localStorage.getItem('email') || " ";

    this.loadChannels(this.userId);
  }

  loadChannels(userId: number) {
    this.apiService.getChannels(userId).subscribe({
      next: (channels) => {
        this.channels = channels;
        this.loadFriends(this.userId);
      },
      error: (error) => {
        console.error('Error loading channels:', error);
        this.AddFriendErrMsg = 'Failed to load channels';
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

  getUserRoleInChannel(channelId: number): UserRole | null {
    const channelUser = this.channelUsers.find(cu => 
      cu.channel.id === channelId && cu.user.id === this.userId
    );
    return channelUser?.userRole || null;
  }

  startEditChannel(channel: any) {
    this.selectedChannelForEdit = channel;
    this.editChannelName = channel.name;
    this.showEditChannelDialog = true;
  }

  modifyUserRole(channelUser: ChannelUser) {
    this.selectedUserForModify = channelUser;
    this.selectedUserRole = channelUser.userRole;
    this.showModifyUserRoleDialog = true;
  }

  updateUserRole() {
    if (!this.selectedUserForModify) return;

    this.selectedUserForModify.userRole = this.selectedUserRole;

    this.apiService.updateUserRole(this.userId, this.selectedUserForModify)
      .subscribe({
        next: (updatedUser) => {
          console.log('Channel updated successfully:', updatedUser);
          this.showModifyUserRoleDialog = false;
        },
        error: (err) => {
          console.error('Error updating channel:', err);
        }
      });

    this.showModifyUserRoleDialog = false;
  }

  updateChannel() {
    if (!this.selectedChannelForEdit.id) return;

    this.apiService.updateChannel(this.userId, this.selectedChannelForEdit)
      .subscribe({
        next: (updatedChannel) => {
          console.log('Channel updated successfully:', updatedChannel);
          this.showEditChannelDialog = false;
        },
        error: (err) => {
          console.error('Error updating channel:', err);
        }
      });

    this.showEditChannelDialog = false;
  }
  
  kickUser(channelUser: ChannelUser) {
    if(!channelUser) return;
    if(!channelUser.channel.id) return;
    if(!channelUser.id) return;

    this.apiService.deleteChannelUser(channelUser.channel.id, channelUser.id).subscribe({
      next: () => {
      this.channelUsers = this.channelUsers.filter(channelUsers => channelUsers.id !== channelUser.id);
      },
     error: (error) => {
        console.error('Error deleting channel:', error);
      }
    });

  }

  deleteChannel(channelId: number)
  {
    if(!channelId) return;

    this.apiService.deleteChannel(channelId).subscribe({
      next: () => {
      this.channels = this.channels.filter(channel => channel.id !== channelId);
      if (this.selectedChannelId === channelId) {
        this.selectedChannelId = undefined;
        this.messages = [];
        this.channelUsers = [];
      }
      },
     error: (error) => {
        console.error('Error deleting channel:', error);
      }
    });
  }

  sendMessage() 
  {
    if (!this.newMessageInBox.trim()) return;

    var selectedfriend;
    var selectedChannel;

    

    const msg: Message = 
    {
      content: this.newMessageInBox,
      sender: { id: this.userId, username: this.username, email: this.email}, 
    };
    

    if (this.selectedChannelId) 
    {
      for (var channel of this.channels) 
      {
          if (channel.id == this.selectedChannelId) 
            {
              selectedChannel = channel;
              break; 
            } 
      }

      msg.channel = selectedChannel;
      this.apiService.sendChannelMessage(msg).subscribe(this.handleNewMessage);
    } 
    else if (this.selectedFriendId)
    {
      for (var friend of this.friends) 
      {
          if (friend.user.id == this.selectedFriendId) 
            {
              selectedfriend = friend.user;
              break; 
            } 
      }

      msg.receiver = selectedfriend;
      this.apiService.sendDirectMessage(msg).subscribe(this.handleNewMessage);
    }
    this.newMessageInBox = '';
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
      },
      error: (error) => {
        console.error("Error:", error);
        this.NewChannelErrMsg = error.error.message || 'An error occurred';
      }
    });
  }

  addUserToChannel() {
    if(this.selectedChannelId === undefined) return;
    if(this.selectedChannelId === undefined) return;
  
  
    this.apiService.addUserToChannel(this.selectedChannelId, this.newUserToAddID).subscribe({
      next: (response) => 
      {
        if(response.successful)
        {
          this.showAddUserDialog = false;
          if (this.selectedChannelId !== undefined) this.loadChannelUsers(this.selectedChannelId);
        }
        
      },
      error: (error) => {
        console.error('Error adding user to channel:', error);
        this.AddUserToChnlErrMsg = error.error.message || 'An error occurred';
      }
    });
  }

  addFriend() {
    if (!this.newFriendId.trim()) return;
    
    this.apiService.addFriend(this.newFriendId).subscribe({
      next: (response) => {
        if (response.successful) 
        {
          this.showAddFriendDialog = false;
          this.newFriendId = '';
          this.loadFriends(this.userId);
        }
      },
      error: (error) => {
        console.error("Error:", error);
        this.AddFriendErrMsg = error.error.message || 'An error occurred';
      }
    });
  }

  loadDirectMessages(friendId: number) {
    this.apiService.getDirectMessages(friendId).subscribe(messages => {
      this.messages = messages;
    });
  }

  loadChannelMessages(channelId: number) {
    this.apiService.getChannelMessages(channelId).subscribe(data => {
        this.messages = data.data;
        this.loadChannelUsers(channelId);
    });
  }

  loadChannelUsers(channelId: number) {    
    this.apiService.getChannelUsers(channelId).subscribe(data => {
        this.channelUsers = data;
    });
  }

  private handleNewMessage = (message: Message) => 
  {
    if (this.selectedFriendId !== undefined) this.loadDirectMessages(this.selectedFriendId);
    if (this.selectedChannelId !== undefined) this.loadChannelMessages(this.selectedChannelId);
  }

  selectFriend(user: User) {
    if(user.id === undefined) return;

    this.selectedFriend = user
    this.selectedFriendId = user.id;

    this.selectedChannelId = undefined;
    this.loadDirectMessages(user.id);
  }

  selectChannel(channelId: number) {
    this.selectedChannelId = channelId;
    this.selectedFriendId = undefined;

    this.loadChannelMessages(channelId);

  }
  


}
