import { Component, ModuleWithComponentFactories,Inject } from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import { ConnectionService } from 'ng-connection-service';
import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';
import {Globals} from 'src/app/extra/globals';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
  constructor(private connectionService:ConnectionService,updates:SwUpdate,public globals:Globals,public dialog: MatDialog){
    
    this.role=globals.role;
    this.logged_in=globals.logged_in;

    //this is only run when the connection status changes
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.globals.role = "online";
        this.openDialog();
      }
      else {
        this.globals.role = "offline";
        this.openDialog();
      }
    })
  }

  openDialog(): void {
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
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

  onlineCheck() {
      this.online_status = window.navigator.onLine;

      if (this.online_status){
        this.globals.role="online";
        this.openLoginDialog();
        
      }      

      else{
        this.globals.role="offline";
      }

  }


   ngOnInit(){
    this.onlineCheck();
  } 


}


@Component({
  selector: 'connection-status-popup',
  templateUrl: 'connection-status-popup.html',
})
export class DialogOverviewExampleDialog {

  offline_message="No Internet Connection Detected! Data will be stored locally in browser and pushed to Cloud\
  once the app is lauched again with a connection.";

  online_message="Internet Connection Detected! Login and then any data entered will be pushed directly to the cloud.\
  Any locally stored data is now being pushed to the Cloud.";

  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,public globals:Globals) {}

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

  constructor(public dialogRef: MatDialogRef<LoginDialog>,public globals:Globals) {}

  login() : void {
    if(this.username == 'admin' && this.password == 'admin'){
     //this.router.navigate(["user"]);
     console.log('success')
     this.globals.logged_in=true;
     this.dialogRef.close();
    }else {
      console.log("Invalid credentials");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
