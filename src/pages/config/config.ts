import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScaleDataProvider } from '../../providers/scale-data/scale-data';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public scaleDataProvider: ScaleDataProvider) {

      // this.catWeightThreshhold = scaleDataProvider.catWeightThreshhold;
      // this.urineWeightThreshold = scaleDataProvider.urineWeightThreshold;
      // this.waitInterval= scaleDataProvider.waitInterval;
  }

  // catWeightThreshhold:number;

  // urineWeightThreshold:number;
  // waitInterval:number;

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');

    
  }



}
