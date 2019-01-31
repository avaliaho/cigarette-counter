import { Component } from '@angular/core';
import { pack } from '../pack.interface';
import { consumption } from '../consumption.interface';
import { ConsumptionService } from '../consumption.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private service: ConsumptionService) { }

  segment: string = "info";
  pack: pack[] = [];
  today = {} as consumption;
  histories: consumption[] = [];
  money_consumption: number = 0;
  money_consumption_tostring: string = "0";

  ngOnInit() {

    this.service.getConsumptions().then((data: consumption[]) => {
      if (data == null) {
        this.today.consumption = 0;
        this.today.date = new Date().toLocaleDateString();
        this.today.last_smoked = new Date().toLocaleTimeString();
      } else {
        for (let consumption of data) {
          if (consumption.date == new Date().toLocaleDateString()) {
            this.today = consumption;
          }
        }
        this.histories = data;
      }
      this.service.getPack().then((packdata: pack) => {
        if (packdata != null) {
          let price_of_one_cigarette = packdata.price / packdata.cigarettecount;
          for (let consumption of data) {
            this.money_consumption += consumption.consumption * price_of_one_cigarette;
            this.money_consumption_tostring = this.money_consumption.toFixed(2);
          }
        }
      })
    })

    this.service.getPack().then((data) => {
      if (data != null) {
        this.segment = "counter";
      }
    })

  }

  addOne = () => {
    this.today.date = new Date().toLocaleDateString();
    this.today.consumption += 1;
    this.today.last_smoked = new Date().toLocaleTimeString();

    this.service.getConsumptions().then((data: consumption[]) => {
      let consumptions = data;
      this.histories = data;
      // at least one consumption found
      if (consumptions != null) {
        let current_exists = false;
        for (let consumption of consumptions) {
          // use current date
          if (consumption.date == this.today.date) {
            current_exists = true;
            consumption.date = this.today.date;
            consumption.consumption = this.today.consumption;
            consumption.last_smoked = this.today.last_smoked;

            // add current consumption to history
            for (let history of this.histories) {
              if (history.date == this.today.date) {
                history.date = this.today.date;
                history.consumption = this.today.consumption;
                history.last_smoked = this.today.last_smoked;
              }
            }

          }
        }
        // new date
        if (current_exists == false) {
          consumptions.push(this.today);
          this.histories.push(this.today);
        }
        this.service.saveConsumptions(consumptions);
      } else {
        // no consumptions found
        this.service.addConsumptions(this.today);
        this.histories = data;
      }
      this.service.getPack().then((packdata: pack) => {
        if (packdata != null) {
          let price_of_one_cigarette = packdata.price / packdata.cigarettecount;
          this.money_consumption = 0;
          for (let consumption of data) {
            this.money_consumption += consumption.consumption * price_of_one_cigarette;
            this.money_consumption_tostring = this.money_consumption.toFixed(2);
          }
        }
      })
    })
  }

  savePack = () => {
    this.service.savePack(this.pack);
    this.segment = "counter";
  }

}
