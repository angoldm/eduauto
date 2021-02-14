import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { TransferState, makeStateKey } from '@angular/platform-browser';
//import { importType } from '@angular/compiler/src/output/output_ast';
import { CityesService } from '../cityes.service'
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

//const CITYES_KEY = makeStateKey('cities');

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  Citylist = new FormControl();
  //options: string[] = ['Уфа', 'Москва', 'Пермь', 'Челябинск', 'Оренбург', 'Казань', 'Санкт-Петербург'];
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  /*private _City: string;
  set City(city:string){
    this._City = city;
  }
  get City(){
    return this._City;
  }*/
  chCity: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private CityesService: CityesService,
    @Inject(PLATFORM_ID) private platformId,
    //private state: TransferState
    ) {
    //this._City = "Уфа";
  }

  clickCity(){
    this.chCity = !this.chCity;
    return false;
  }

  saveCity(value: string){
    localStorage.setItem("City", value);
    this.chCity = false;
  }

  ngOnInit() {
    //this.options = this.state.get(CITYES_KEY, null as any);
    //if (!this.options) {
      this.CityesService.getCities().subscribe(data => {
        //console.log(data);
        this.options = data;
        //this.state.set(CITYES_KEY, data as any);
      })
    //}
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem("City") == null || localStorage.getItem("City") == '')
        localStorage.setItem("City", "Уфа");
      //this.City = localStorage.getItem("City");
      this.Citylist.setValue(localStorage.getItem("City"));
    }
    this.filteredOptions = this.Citylist.valueChanges
      .pipe(
        //startWith(''),//показывает полный список при активации поля ввода!
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onCityFocus(value: string){
    this.options.filter(option => option.toLowerCase().includes(value));
  }
}
