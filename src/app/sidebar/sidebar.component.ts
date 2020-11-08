import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
//import { importType } from '@angular/compiler/src/output/output_ast';
import { CityesService } from '../cityes.service'

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

  private _City: string;
  set City(city:string){
    this._City = city;
  }
  get City(){
    return this._City;
  }
  chCity: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private CityesService: CityesService) {
    this._City = "Уфа";
    this.CityesService.getCities().subscribe(data => {
      this.options = data;
    })
  }

  clickCity(){
    this.chCity = !this.chCity;
    return false;
  }

  saveCity(value: string){
    localStorage.setItem("City", value);
  }

  ngOnInit() {
    if (localStorage.getItem("City") == null)
      localStorage.setItem("City", "Уфа");
    this.City = localStorage.getItem("City");
    this.filteredOptions = this.Citylist.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
