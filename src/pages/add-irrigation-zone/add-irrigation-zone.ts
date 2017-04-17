import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-add-irrigation-zone',
  templateUrl: 'add-irrigation-zone.html'
})
export class AddIrrigationZonePage {

public zoneInfo = { farmid: '', uid: '', izname: '',acres: '',
		waterflow: '0', method: '', eff: '' };

private irrigationMethods: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController, private auth: AuthService) {

  	var user, farmid;
  	user = this.auth.getUserInfo();
  	farmid = this.navParams.get("farmid");
  	this.zoneInfo.uid = user.uid;
  	this.zoneInfo.farmid = farmid;

  	this.auth.getIrrigationMethods().subscribe(data => {
      this.irrigationMethods = data;
    },
    error => {
      console.log(error);
    });
  }

  updateEfficiency() {
  	for(var i=0;i<this.irrigationMethods.length;i++){
  		if(this.irrigationMethods[i].irrigationmethod == this.zoneInfo.method){
  			this.zoneInfo.eff = this.irrigationMethods[i].ea;
  		}
  	}
  }

  addIrrigationZone() {
  	if(parseFloat(this.zoneInfo.eff) > 1 || parseFloat(this.zoneInfo.eff) < 0) return;
  	
  	this.auth.addIrrigationZone(this.zoneInfo).subscribe(data => {
      console.log("Irrigation Zone Added to farm "+this.zoneInfo.farmid);
      this.navCtrl.pop();
    },
    error => {
      console.log(error);
    });
  }

}
