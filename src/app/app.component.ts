import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExchangeService, RatesMap } from './exchange.service';

export enum Currency {
  UAH = 'uah',
  USD = 'usd',
  EUR = 'eur',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public exchangeRates: RatesMap | null = null;
  public exchangeFrom: FormGroup;

  public currency = Currency

  constructor(public excahnge: ExchangeService, private fb: FormBuilder) {

    this.exchangeFrom = fb.group({
      sourceCurrency: Currency.USD,
      sourceValue: 0,
      targetCurrency: Currency.UAH,
      targetValue: 0,
    })

    this.getControl('sourceCurrency').valueChanges.subscribe(() => {
     this.setTargetValue()
    })

    this.getControl('sourceValue').valueChanges.subscribe(() => {
      this.setTargetValue()
    })

    this.getControl('targetCurrency').valueChanges.subscribe(() => {
      this.setTargetValue()
    })

    this.getControl('targetValue').valueChanges.subscribe(val => {
      this.getControl('sourceValue').setValue(this.round(val / this.getRate()), { emitEvent: false })
    })

  }

  ngOnInit(): void {
    this.excahnge.getRates().subscribe(val => this.exchangeRates = val)
  }

  private getControl(name: string) {
    return this.exchangeFrom.controls[name]
  }

  private getRate(): number {
    const sourceCurrency = this.getControl('sourceCurrency').value
    const targetCurrency = this.getControl('targetCurrency').value

    return this.exchangeRates ? this.exchangeRates[sourceCurrency][targetCurrency] : 1
  }

  private round(value: number) {
    return Math.round(value * 100) / 100
  }

  private setTargetValue() {
    const sourceValue = this.getControl('sourceValue').value
    this.getControl('targetValue').setValue(this.round(this.getRate() * sourceValue))
  }
  
}
