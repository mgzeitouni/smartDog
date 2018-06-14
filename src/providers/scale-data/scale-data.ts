import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
/*
  Generated class for the ScaleDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ScaleDataProvider {

  public weight_values:number[]=[];

  public catWeightThreshold:number=2;

  public catDetected:boolean=null;

  public urineWeightThreshold:number = 0.3;

  public urineDetected:boolean=null;

  public scoopWeightThreshold:number = -0.2;

  public scoopDetected:boolean=null;

  public waitInterval:number=6;


  constructor(private storage: Storage) {
    console.log('Hello ScaleDataProvider Provider');

    var that = this;

    this.storage.get('data').then(data=>{
      
      console.log( parseFloat(data.catWeightThreshold))
      if (data !== undefined && data !=null){
        
        that.catWeightThreshold = parseFloat(data.catWeightThreshold);
        that.urineWeightThreshold=parseFloat(data.urineWeightThreshold);
        that.scoopWeightThreshold = parseFloat(data.scoopWeightThreshold)
        that.waitInterval = parseInt(data.waitInterval);
        

      }


    })
  }

  newWeight(weight){
    this.weight_values.push(weight);

    var that = this;

      // If last 9 values were above cat threshold, then assume cat present
      if (this.weight_values.length>this.waitInterval){
        // console.log(this.weight_values.slice(this.weight_values.length-9,this.weight_values.length))
          if (this.weight_values.slice(this.weight_values.length-this.waitInterval,this.weight_values.length).every(function(weight){
            return weight>that.catWeightThreshold;
          })){
            //console.log("Cat detected!!");
            that.catDetected=true;
          }
        }

      // If last 9 values were below cat threshold, then assume cat present
      if (this.weight_values.length>this.waitInterval){
        // console.log(this.weight_values.slice(this.weight_values.length-9,this.weight_values.length))
          if (this.weight_values.slice(this.weight_values.length-this.waitInterval,this.weight_values.length).every(function(weight){
            return weight<that.catWeightThreshold;
          })){
            that.catDetected=false;
          }
        }


   // If cat not inside, then assume urine present
    if (this.weight_values.length>this.waitInterval){
     // console.log(this.weight_values.slice(this.weight_values.length-9,this.weight_values.length))
      if (this.weight_values.slice(this.weight_values.length-this.waitInterval,this.weight_values.length).every(function(weight){
        return weight>that.urineWeightThreshold && weight<that.catWeightThreshold;
      })){
        //console.log("Urine detected!!");
        that.urineDetected=true;
      }
    }

       // If cat not inside, then assume urine present
       if (this.weight_values.length>this.waitInterval){
        // console.log(this.weight_values.slice(this.weight_values.length-9,this.weight_values.length))
         if (this.weight_values.slice(this.weight_values.length-this.waitInterval,this.weight_values.length).every(function(weight){
           return weight<that.urineWeightThreshold ||  that.catDetected;
         })){
         //  console.log("Urine not detected");
           that.urineDetected=false;
         }
       }


    // Scoop - if urine was just detected, look for a scoop
    if (this.weight_values.length>this.waitInterval){
      // console.log(this.weight_values.slice(this.weight_values.length-9,this.weight_values.length))
       if (this.weight_values.slice(this.weight_values.length-this.waitInterval,this.weight_values.length).every(function(weight){
        //console.log(weight+ "<"+ that.scoopWeightThreshold+" = "+(weight< that.scoopWeightThreshold))
        return weight< that.scoopWeightThreshold
       })){
        // console.log("Scoop detected!!");
         that.scoopDetected=true;
       }
     }


    // Scoop - if urine was just detected, look for a scoop
    if ( this.weight_values.length>this.waitInterval){
      // console.log(this.weight_values.slice(this.weight_values.length-9,this.weight_values.length))
       if (this.weight_values.slice(this.weight_values.length-this.waitInterval,this.weight_values.length).every(function(weight){
         return weight>that.scoopWeightThreshold
       })){
        // console.log("Scoop not detected");
         that.scoopDetected=false;
       }
     }


  }

  updateConfig(navCtrl){
    

    var data = {"catWeightThreshold":this.catWeightThreshold,
                "urineWeightThreshold":this.urineWeightThreshold,
                "scoopWeightThreshold":this.scoopWeightThreshold.toString(),
                "waitInterval":this.waitInterval}

    
    this.storage.set('data',data);
    
   navCtrl.setRoot('HomePage');

  }


}
