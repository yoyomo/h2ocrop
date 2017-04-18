import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CropHistoryPage } from '../crop-history/crop-history';
import { AuthService } from '../../providers/auth-service';

@Component({

  selector: 'page-daily-rec',
  templateUrl: 'daily-rec.html'
})  
  
export class DailyRecPage {

public lineChartType:string = 'line';
public lineChartData:Array<any> = [{data: [18, 48, 27, 39, 10, 27, 40], label: 'Series'}];
public lineChartLabels:Array<any> = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun', 'July', 'Aug.','Sep.']; 

types = {gal: 'gal', L: 'L', hr: 'hr', mm: 'mm', in: 'in'};
rec = {amount: 0, type: this.types.gal};
crop: any = [];
history = {cropid: '', uid: '', recommendedet: 0,
irrigatedet: 0, seasonday: 0};
setupCrop:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private auth: AuthService) {
		this.crop = navParams.get("crop");
    console.log(this.crop);
    this.setup();
  }

  // Set Up if first time
  setup() {
    if(this.crop.currentday==0){
      this.setupCrop = {
        currentday: this.crop.currentday,
        currentet: this.crop.currentet,
        cumulativeet: this.crop.cumulativeet,
        currentkc: this.crop.currentkc,
        cropstatus: this.crop.cropstatus,
        cropid: this.crop.cropid,
        uid: this.crop.uid
      };
      console.log(this.setupCrop);
      this.auth.setupCrop(this.setupCrop).subscribe(data => {

      },
      error => {
        console.log(error);
      });

    }
  }

  ionViewWillEnter(){
    this.auth.readSpecificCrop(this.crop).subscribe(data => {
      this.crop = data[0];

      this.history.cropid = this.crop.cropid;
      this.history.uid = this.crop.uid;
      this.history.recommendedet = this.crop.cumulativeet;
      this.history.irrigatedet = this.crop.cumulativeet;
      this.history.seasonday = this.crop.currentday;

      this.rec.amount = this.history.irrigatedet;
      this.changeAmountType();
    },
    error => {
      console.log(error);
    });
    
  }

  private getDailyRecommendation() {
    var D, A, Q, eff, G, T, L, mm, inch;

    D = this.history.irrigatedet;
    A = parseFloat(this.crop.acres);
    Q = parseFloat(this.crop.waterflow);
    eff = parseFloat(this.crop.irrigationefficiency);

    G = 1069.02 * (D * A) / eff;

    if (Q > 0) {
      T = G / (Q * 60);
    } else {
      T = 0;
    }

    L = 3.78541 * G;
    mm = D;
    inch = 0.0393701 * D;

    return {gal: G, hr: T, L: L, mm: mm, in: inch};
  }

  // Converts any amount to mm
  private reverse() {
    var A, Q, eff, G, T, L, mm, inch, amount;

    amount = this.rec.amount; // in gal,hr,L,mm or in
    A = parseFloat(this.crop.acres);
    Q = parseFloat(this.crop.waterflow);
    eff = parseFloat(this.crop.irrigationefficiency);

    // reverse of G = 1069.02 * (D * A) / eff
    G = (amount * eff) / (1069.02 * A);

    if (Q > 0) {
      // reverse of T = G / (Q * 60);
      T = G * (Q * 60);
    } else {
      // may cause error. should never reach this place.
      // no change
      T = amount; 
    }

    // reverse of L = 3.78541 * G;
    L = G / 3.78541;
    //no change
    mm = amount;
    // reverse of inch = 0.0393701 * D;
    inch = amount / 0.0393701;

    return {gal: G, hr: T, L: L, mm: mm, in: inch};
  }

  public changeAmountType() {
    switch (this.rec.type){
      case this.types.gal:
        this.rec.amount = this.getDailyRecommendation().gal;
        break;
      case this.types.L:
        this.rec.amount = this.getDailyRecommendation().L;
        break;
      case this.types.hr:
        this.rec.amount = this.getDailyRecommendation().hr;
        break;
      case this.types.mm:
        this.rec.amount = this.getDailyRecommendation().mm;
        break;
      case this.types.in:
        this.rec.amount = this.getDailyRecommendation().in;
        break;
    }

  }

  public changeAmount(){
    switch (this.rec.type){
      case this.types.gal:
        this.history.irrigatedet = this.reverse().gal;
        break;
      case this.types.L:
        this.history.irrigatedet = this.reverse().L;
        break;
      case this.types.hr:
        this.history.irrigatedet = this.reverse().hr;
        break;
      case this.types.mm:
        this.history.irrigatedet = this.reverse().mm;
        break;
      case this.types.in:
        this.history.irrigatedet = this.reverse().in;
        break;
    }
    console.log("Changed amount to " + this.history.irrigatedet);
  }

  public cropHistory(){
    this.navCtrl.push(CropHistoryPage, {
      crop: this.crop
    });
  }

  
  public irrigate(){
    this.auth.addHistory(this.history).subscribe(data => {
      console.log("History added.");
    },
    error => {
      console.log(error);
    });

    this.crop.cumulativeet -= this.history.irrigatedet;
    this.auth.updateCrop(this.crop).subscribe(data => {
      console.log("Crop updated.");
      this.navCtrl.pop();
    },
    error => {
      console.log(error);
    });

    /*
     * Send to microcontroller
     */
  }
   
}
  