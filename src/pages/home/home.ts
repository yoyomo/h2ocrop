import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, MenuController} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';


import { AddPage } from '../add/add';
import { AuthService } from '../../providers/auth-service';
import { AlertController } from 'ionic-angular';
import { DailyRecPage } from '../daily-rec/daily-rec';
import { EditFarmPage } from '../edit-farm/edit-farm';
import { EditZonePage } from '../edit-zone/edit-zone';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

user: any = [];
crops: any = [];
zones: any = [];
farms: any = [];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
   public navParams: NavParams,private menuCtrl: MenuController, private auth: AuthService, public alertCtrl: AlertController, private iab:InAppBrowser) {

    this.menuCtrl.enable(true); 
    this.user = this.auth.getUserInfo();
    console.log(this.user);
    this.auth.getUserFarms(this.user).subscribe(data => {
      this.farms = data;

      this.auth.getUserZones(this.user).subscribe(data => {
        this.zones = data;

        this.auth.getUserCrops(this.user).subscribe(data => {
          this.crops = data; 
          console.log(this.crops);

          this.includeCropsToZones();
          this.includeZonesToFarms();
        },
        error => {
          console.log(error);
        });
      },
      error => {
        console.log(error);
      });
    },
    error => {
      console.log(error);
    });
  }

  includeCropsToZones() {

    for(var zoneIndex = this.zones.length-1; zoneIndex >= 0; zoneIndex--) {
      this.zones[zoneIndex].crops = [];
      for(var cropIndex = this.crops.length-1; cropIndex >= 0; cropIndex--) {
        if(this.crops[cropIndex].izid === this.zones[zoneIndex].izid){
          this.zones[zoneIndex].crops.push(this.crops[cropIndex]);
        }
      }
    }
  }

  includeZonesToFarms() {
    for(var farmIndex = this.farms.length-1; farmIndex >= 0; farmIndex--) {
      this.farms[farmIndex].zones = [];
      for(var zoneIndex = this.zones.length-1; zoneIndex >= 0; zoneIndex--) {
        if(this.zones[zoneIndex].farmid === this.farms[farmIndex].farmid){
          this.farms[farmIndex].zones.push(this.zones[zoneIndex]);
        }
      }
    }
  }

  

  launcharAddPage(){
    this.navCtrl.push(AddPage);
  }

  dailyRec(crop){
    this.navCtrl.push(DailyRecPage, {
      crop: crop
    });

  }

  editFarm(farm){
    this.navCtrl.push(EditFarmPage, {
      farm: farm
    });
  }
  editZone(zone){
    this.navCtrl.push(EditZonePage, {
      zone: zone
    });
  }
 
  deleteFarm(farm){
    let prompt = this.alertCtrl.create({
          title: 'Delete Farm?',
          message: "All Irrigation Zones, Crops and History under this Farm will also be deleted. Are you sure you want to delete this Farm?",
          
          buttons: [
              {
                  text: 'Cancel'
              },
              {
                  text: 'Delete',
                  handler: data => {
                    this.auth.deleteFarm(farm).subscribe(data => {
                      console.log("Farm, all its irrigation zones & \
                        all its crops & all its histories deleted.");
                      this.navCtrl.setRoot(HomePage);
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

  deleteZone(zone){
    let prompt = this.alertCtrl.create({
          title: 'Delete Irrigation Zone?',
          message: "All Crops and History under this Irrigation Zone will also be deleted. Are you sure you want to delete this Irrigation Zone?",
          
          buttons: [
              {
                  text: 'Cancel'
              },
              {
                  text: 'Delete',
                  handler: data => {
                    this.auth.deleteIrrigationZone(zone).subscribe(data => {
                      console.log("Irrigation Zone & all its crops & \
                        all its histories deleted.");
                      this.navCtrl.setRoot(HomePage);
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
 
  deleteCrop(crop){
      let prompt = this.alertCtrl.create({
          title: 'Delete Crop Info?',
          message: "All User Crops and History under this Crop Info will also be deleted. Are you sure you want to delete this Crop Info?",
                    
          buttons: [
              {
                  text: 'Cancel'
              },
              {
                  text: 'Delete',
                  handler: data => {
                    this.auth.deleteCrop(crop).subscribe(data => {
                      console.log("Crop Info &Crops & \
                        all its History deleted.");
                      this.navCtrl.setRoot(HomePage);
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

  info(){
    let prompt = this.alertCtrl.create({
          title: 'Information',
          message: `
        <ul>
          <li> Press the plus + sign icon found in the page header to add crops.</li>

          <li> Press the 3 lined icon found in the page header to open side menu or Swipe
          page to the right.</li>

          <li> Swipe list items to the left < to delete or edit farm, zone or crop.</li>

          <li> Press selected crop to see recommended irrigation value.</li>
                 
        </ul>
        <ul>
        For more detailed information about H2O Crop see our user manual found in the side menu.
                 
        </ul>
      `,
          buttons: [
              {
                  text: 'Done'
              }
              
          ]
      });

      prompt.present();  

  }


}
