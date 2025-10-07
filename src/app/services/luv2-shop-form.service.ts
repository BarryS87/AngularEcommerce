import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesURL = 'http://localhost:8080/api/countries';
  private statesURL = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  //get countries
  getCountries() : Observable<Country[]> {

    return this.httpClient.get<GetReponseCountries>(this.countriesURL).pipe(
      map(reponse => reponse._embedded.countries)
    );
  }

  //get states
  getStates(theCountryCode: string) : Observable<State[]> {

    //search url
    const searchStateUrl  = `${this.statesURL}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetReponseStates>(searchStateUrl).pipe(
      map(reponse => reponse._embedded.states)
    );
  }

  //get credit card months
  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    //build an array for "Month" dropdown list
    // -start at current month and loop

    for (let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }

  //get credit card years
  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    //build an array for "Year" dropdown list
    // -start at current year and loop for the next 10 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);

  }
}

interface GetReponseCountries {
  _embedded : {
    countries: Country[];
  }
}

interface GetReponseStates {
  _embedded : {
    states: State[];
  }
}
