import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,
 Loading, LoadingController, AlertController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-edit-zone',
  templateUrl: 'edit-zone.html'
})
export class EditZonePage {

zone = { izid: '', farmid: '', uid: '', izname: '',acres: '',
		waterflow: '0', irrigationmethod: '', irrigationefficiency: 0, crops: ''};
private irrigationMethods: any = [];
loadingMethods: Loading;

mastercontrols: any = [];
control: any = {
  controlid: '',
  valveid: '',
  izid: '',
  uid: '',
  farmid: '',
  new: true
};

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController, private auth: AuthService,
  private loadingCtrl: LoadingController, private alertCtrl: AlertController) {

  	this.zone = this.navParams.get("zone");
    this.makeIrrigationEfficiencyPercentage();

    this.showLoadingMethods();
  	this.auth.getIrrigationMethods().subscribe(data => {
      this.irrigationMethods = data;
      this.closeLoadingMethods();
    },
    error => {
      console.log(error);
    });

    this.loadMasterControl();
  }

  makeIrrigationEfficiencyPercentage() {
    this.zone.irrigationefficiency *= 100; // make percentage
  }

  makeIrrigationEfficiencyDecimal() {
    this.zone.irrigationefficiency /= 100; // make percentage
  }

  updateEfficiency() {
  	for(var i=0;i<this.irrigationMethods.length;i++){
  		if(this.irrigationMethods[i].irrigationmethod == this.zone.irrigationmethod){
  			this.zone.irrigationefficiency = this.irrigationMethods[i].ea;
        this.makeIrrigationEfficiencyPercentage();
        return;
  		}
  	}
  }

  editIrrigationZone() {
  	if(this.zone.irrigationefficiency > 100 || this.zone.irrigationefficiency < 0) return;
    this.makeIrrigationEfficiencyDecimal();
    
  	this.auth.editIrrigationZone(this.zone).subscribe(data => {
      console.log("Irrigation Zone edited.");
      this.navCtrl.pop();
    },
    error => {
      console.log(error);
    });
  }

  showLoadingMethods() {
    this.loadingMethods = this.loadingCtrl.create({
      content: "Loading Irrigation Methods..."
    });
    this.loadingMethods.present();
  }

  closeLoadingMethods(){
    console.log("Irrigation Methods loaded.");
    this.loadingMethods.dismiss();
  }

  loadMasterControl() {
    this.auth.getMasterControl(this.zone).subscribe(data => {
      this.mastercontrols = data;
      this.control.uid = this.zone.uid;
      this.control.izid = this.zone.izid;
      this.control.farmid = this.zone.farmid;
    },
    error => {
      console.log(error);

    });
  }

  getValveID(){
    this.auth.getValveControl(this.control).subscribe(data => {
      if(data.length != 0){
        this.control.valveid = data[0].valveid;
        this.control.new = false;
      }
      else{
        this.control.valveid = '';
        this.control.new = true;
      }
    },
    error => {
      console.log(error);
    });
  }

  editValveControl() {
    this.auth.editValveControl(this.control).subscribe(data => {
      if(data.length != 0){
        console.log(data);
        this.showPopup('ERROR',data.detail);
      }
      else{
        console.log('Valve Control edited.');
        this.getValveID();
        this.showPopup('Success!','Valve Control edited.');
      }
    },
    error => {
      console.log(error);
    });
  }

  addValveControl() {
    this.auth.addValveControl(this.control).subscribe(data => {
      if(data.length != 0){
        console.log(data);
        if(data.constraint==='izid_unique'){
          this.showIPOption();
        }
        else{
          this.showPopup('ERROR',data.detail);
        }
        
      }
      else{
        console.log('Valve Control added.');
        this.getValveID();
        this.showPopup('Success!','Valve Control added.');
      }
    },
    error => {
      console.log(error);
    });
  }

  deleteValveControl() {
    this.auth.deleteValveControl(this.control).subscribe(data => {
      if(data.length != 0){
        console.log(data);
        this.showPopup('ERROR',data.detail);
      }
      else{
        console.log('Valve Control deleted.');
        this.loadMasterControl();
        this.getValveID();
        this.control.controlid='';

      }
    },
    error => {
      console.log(error);
    });
  }

  showConfirmDelete(){
     let prompt = this.alertCtrl.create({
          title: 'Delete Valve Control?',
          message: 'Deleting this valve control will disable any connection with a physical irrigation zone. Are you sure you want to delete this master control?',
          
          buttons: [
              {
                text: 'Cancel'
              },
              {
                text: 'Delete',
                handler: data => {
                  this.deleteValveControl();
                }
              }
          ]
      });

      prompt.present();  

  }

  showPopup(title,message){
   let prompt = this.alertCtrl.create({
        title: title,
        message: message,
        
        buttons: [
            {
              text: 'OK'
            }
        ]
    });

    prompt.present();  

  }

  showIPOption(){
    let prompt = this.alertCtrl.create({
      title: 'New IP',
      message: 'Irrigation Zone is already occupied. Want to change IP address?',
      
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Yes',
          handler: data =>{
            this.auth.editValveIPControl(this.control).subscribe(data => {
              if(data.length != 0){
                console.log(data);
                this.showPopup('ERROR',data.detail);
              }
              else{
                console.log('Valve Control edited.');
                this.getValveID();
                this.showPopup('Success!','Valve Control edited.');
              }
            },
            error => {
              console.log(error);
            });
          }
        }
      ]
    });

    prompt.present(); 
    
  }

}
