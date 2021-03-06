import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoadingController, Loading } from 'ionic-angular';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
loading: Loading;

emailSentSuccess = false;
forgotPasswordCredentials = { email: '',password: ''};

  constructor(private nav: NavController, private auth: AuthService, 
  private alertCtrl: AlertController, private loadingCtrl: LoadingController) {}
  
  // Writes a random password to the user's password
 public resetPassword() {
  //reset the password
  this.forgotPasswordCredentials.password = this.createRandomPassword();
  
  this.showLoading();
  this.auth.forgotPassword(this.forgotPasswordCredentials).subscribe(data => {
    if(data.length > 0){
      this.auth.sendForgotPassword(this.forgotPasswordCredentials).subscribe(data => {
        if (data) {
          setTimeout(() => {
            
           this.emailSentSuccess = true;
           this.closeLoading();
            this.showPopup("Success", "Email Sent.")
          });
        } else {
          this.emailSentSuccess = false;
          this.closeLoading();
          this.showPopup("Error", "try again.")
        }
      },
      error => {
        this.closeLoading();
        this.showPopup("Error","Account does not exist.");
      });
    }
    else{
      this.closeLoading();
      this.showPopup("Error","Account does not exist.");
    }
  },
  error => {
    this.closeLoading();
    this.showPopup("Error","Account does not exist.");
  });
  }

  // Creates a new random password
  createRandomPassword (){
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( var i=0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  //Shows Loading screen
  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  // Closes loading screen
  closeLoading(){
    this.loading.dismiss();
  }

  // Displays message as a popup
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
       {
         text: 'OK',
         handler: data => {
           if (this.emailSentSuccess) {
             this.nav.popToRoot();
           }
         }
       }
     ]
    });
    alert.present();
  }
}

