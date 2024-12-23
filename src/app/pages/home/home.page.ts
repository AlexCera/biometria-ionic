import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  isCardRotated = false;
  totalAvailable = 0;
  listTransactions = [
    { date: Date.now(), total: -20 },
    { date: Date.now(), total: -5 },
    { date: Date.now(), total: 10 },
    { date: Date.now(), total: 20 },
    { date: Date.now(), total: 200 },
    { date: Date.now(), total: -20 },
    { date: Date.now(), total: 40 },
    { date: Date.now(), total: -100 },
  ]

  constructor() { }

  ngOnInit() {
    this.totalAvailable = this.calculateTotal(this.listTransactions)
  }

  rotateCard() {
    this.isCardRotated = !this.isCardRotated;
  }

  calculateTotal(transacciones: any) {
    return transacciones.reduce((acumulador: number, transaccion: any) => {
      return acumulador + transaccion.total;
    }, 0);
  }
}
