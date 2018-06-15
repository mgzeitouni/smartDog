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

  public demoVariables:any={"cat":false,"urine":false,"scoop":false}

  public secondsAfterCat:number=4;

  public urineAllowed:boolean=false;

  resetVars(){
    this.demoVariables = {"cat":false,"urine":false,"scoop":false};
    this.urineAllowed = false;
  }

  constructor(private storage: Storage
   ) {
    console.log('Hello ScaleDataProvider Provider');

    var that = this;

    this.storage.get('data').then(data=>{
      
      console.log( parseFloat(data.catWeightThreshold))
      if (data !== undefined && data !=null){
        
        that.catWeightThreshold = parseFloat(data.catWeightThreshold);
        that.urineWeightThreshold=parseFloat(data.urineWeightThreshold);
        that.scoopWeightThreshold = parseFloat(data.scoopWeightThreshold);
        that.secondsAfterCat = parseFloat(data.secondsAfterCat);
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

            // Can only be cat if all true or all false
            if (that.demoVariables.cat==that.demoVariables.urine && that.demoVariables.urine==that.demoVariables.scoop ){
              that.catDetected=true;
              that.demoVariables.cat = true;


            }

          }
        }

      // If last 9 values were below cat threshold, then assume cat not present
      if (this.weight_values.length>this.waitInterval){
        // console.log(this.weight_values.slice(this.weight_values.length-9,this.weight_values.length))
          if (this.weight_values.slice(this.weight_values.length-this.waitInterval,this.weight_values.length).every(function(weight){
            return weight<that.catWeightThreshold;
          })){
            // If we just switched from true to false, than start the timeout
            if (that.catDetected){
              // Trigger urine allowed only after a few seconds
              setTimeout(function(){
                that.urineAllowed = true
              }, that.secondsAfterCat*1000)
            }
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
        // Urine can only change if we observed cat already, and didnt observe scoop yet, and enough time after cat
        if (that.demoVariables.cat && !that.demoVariables.scoop && that.urineAllowed){ 
          that.urineDetected=true;
          that.demoVariables.urine = true;
          
        }
       
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
        // Scoop can only change if we observed urine and cat already:
        if (that.demoVariables.cat && that.demoVariables.urine){
          that.scoopDetected=true;
          that.demoVariables.scoop = true;

          // Reset scoop after a few seconds
          var that2=that;

          setTimeout(function(){
            that2.resetVars();
            that2.scoopDetected=false;
            //that2.cd.detectChanges();
          },4000)
        }
        
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
                "waitInterval":this.waitInterval,
              "secondsAfterCat":this.secondsAfterCat}

    
    this.storage.set('data',data);
    
   navCtrl.setRoot('HomePage');

  }


}
