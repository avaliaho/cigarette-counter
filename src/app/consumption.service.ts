import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { pack } from './pack.interface';
import { consumption } from './consumption.interface';

@Injectable({
  providedIn: 'root'
})
export class ConsumptionService {

  constructor(private storage: Storage) { }

  getPack = () => {
    return new Promise((resolve, reject) => {
      this.storage.get("pack").then((pack) => {
        resolve(pack);
      })
    })
  }

  savePack = (pack: pack[]) => {
    this.storage.set("pack", pack);
  }

  getConsumptions = () => {
    return new Promise((resolve, reject) => {
      this.storage.get("consumption").then((kulutukset) => {
        resolve(kulutukset);
      })
    })
  }

  addConsumptions = (newconsumption: consumption) => {
    this.storage.get("consumption").then((data: consumption[]) => {
      let consumptions = data;
      let current_exists = false;
      if (consumptions == null) {
        consumptions = [{date: new Date().toLocaleDateString(), 
          consumption: 0, last_smoked: new Date().toLocaleTimeString()},
        ]
      }
      for (let consumption of consumptions) {
        // use current date
        if (consumption.date == newconsumption.date) {
          current_exists = true;
          consumption.date = newconsumption.date;
          consumption.consumption = newconsumption.consumption;
          consumption.last_smoked = newconsumption.last_smoked;
        }
      }
      // new date
      if (current_exists == false) {
        consumptions.push(newconsumption);
      }
      this.storage.set("consumption", consumptions);
    }
    )}

    saveConsumptions = (consumptions: consumption[]) => {
      this.storage.set("consumption", consumptions);
    }

}