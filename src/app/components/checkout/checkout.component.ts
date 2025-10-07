import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private forBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService) {}

  ngOnInit(): void {
    
    //create form group with different sections
    this.checkoutFormGroup = this.forBuilder.group({
      customer: this.forBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      
      shippingAddress: this.forBuilder.group({
        street: [''],
        city: [''],
        country: [''],
        state: [''],
        postcode: ['']
      }),

      billingAddress: this.forBuilder.group({
        street: [''],
        city: [''],
        country: [''],
        state: [''],
        postcode: ['']
      }),

      creditCard: this.forBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("start month: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    //popilate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
         console.log("Retrieved countries: " + JSON.stringify(data));
         this.countries = data;
      }
    );


  }

  //copy shipping address detials into billing addres details
  copyShippingAddressToBillingAddress(event) {
    
    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      //bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } 
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //bug fix for states
      this.billingAddressStates = [];
    }
  }

  //handle month and years for credit card details DDLs
  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    //if current year equals selected year, then start with the current month
    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    ); 
  }

  //select states based on countries
  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} county code: ${countryCode}`)
    console.log(`${formGroupName} county name: ${countryName}`)

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        //select first state item as default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer').value.email);

    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);

    console.log("The billing address country is " + this.checkoutFormGroup.get('billingAddress').value.country.name);
    console.log("The billing address state is " + this.checkoutFormGroup.get('billingAddress').value.state.name);

  }

}
