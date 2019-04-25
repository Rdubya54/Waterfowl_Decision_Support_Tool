import { Component, ModuleWithComponentFactories,Inject } from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import { ConnectionService } from 'ng-connection-service';
import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';
import {Globals} from 'src/app/extra/globals';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AuthService} from 'src/app/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  isConnected = true;
  title = 'ducks';
  datapeice: any;
  public role:string;
  public logged_in:boolean;
  online_status=false;

  //this makes sure updates are properly loaded.
  //needed cause pwas caching can make it hard to seee updates
  constructor(private connectionService:ConnectionService,updates:SwUpdate,public globals:Globals,public dialog: MatDialog,
    authservice:AuthService){
    
    this.role=globals.role;

    //this is only run when the connection status changes
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.globals.role = "online";
        this.openConnectionStatusDialog();
      }
      else {
        this.globals.role = "offline";
        this.openConnectionStatusDialog();
      }
    })
  }

  openDataWrittenDialog(): void {
    const dialogRef = this.dialog.open(DataWrittenDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      location.reload();
    });
  }

  openConnectionStatusDialog(): void {
      const dialogRef = this.dialog.open(ConnectionStatusDialog, {
        width: '250px',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
}

  initial_onlineCheck() {
      this.online_status = window.navigator.onLine;

      if (this.online_status){
        this.globals.role="online";  
      }      

      else{
        this.globals.role="offline";
      }


      var loginstatus=localStorage.getItem('logged in')
      console.log("loginstatus is "+loginstatus)
      if(loginstatus !== 'true'){
        this.openLoginDialog();
        this.openConnectionStatusDialog();
      }

  }


   ngOnInit(){
    this.initial_onlineCheck();
  } 


}


@Component({
  selector: 'connection-status-popup',
  templateUrl: 'connection-status-popup.html',
  styleUrls:["dialog-styles.css"]
})
export class ConnectionStatusDialog {

  offline_message="No internet connection detected! Any data entered will be stored locally in browser.";

  online_message="Internet connection detected! Any data entered will be pushed directly to the cloud.\
  Any locally stored data is now also being pushed to the cloud.";

  constructor(public dialogRef: MatDialogRef<ConnectionStatusDialog>,public globals:Globals) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'data-written-dialog',
  templateUrl: 'data-written-dialog.html',
})
export class DataWrittenDialog {

  offline_message="No internet connection detected. Entry was saved locally to the browser. App will push this data to the cloud\
  once it is open and detects an internet connection. DO NOT DELETE HISTORY OR COOKIES BEFORE THIS HAPPENS OR ENTRY WILL BE LOST.";

  online_message="Internet Connection Detected. Entry was saved to the cloud." ;

  constructor(public dialogRef: MatDialogRef<DataWrittenDialog>,public globals:Globals) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'login-dialog',
  templateUrl: 'login-dialog.html',
})
export class LoginDialog {  
  username: string;
  password: string;

  constructor(public dialogRef: MatDialogRef<LoginDialog>,public globals:Globals,private authservice:AuthService) {}

  login() : void {
    if(this.username == 'admin' && this.password == 'admin'){
     //this.router.navigate(["user"]);
     console.log('success')
     this.authservice.setLoggedIn(true);
     console.log(localStorage.getItem('logged in'));
     this.dialogRef.close();
    }else {
      console.log("Invalid credentials");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
