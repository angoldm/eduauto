import { isPlatformBrowser, isPlatformServer } from '@angular/common';
//import {HttpClient} from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit, Injectable, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {merge, Observable, of as observableOf, of} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
//import { TransferState, makeStateKey } from '@angular/platform-browser';
//import { isPlatformServer } from '@angular/common';
//import { PLATFORM_ID } from '@angular/core';
import { InstructorstblItem, InstructorsInfo } from '../instructors/instructors.service';
import { InstructorsService } from '../instructors/instructors.service';

//const INSTRS_KEY = makeStateKey('instructors');

@Component({
  selector: 'instructorstbl',
  templateUrl: './instructorstbl.component.html',
  styleUrls: ['./instructorstbl.component.css']
})
export class InstructorstblComponent implements AfterViewInit, OnInit, OnDestroy {
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'school', 'city'];
  exampleDatabase: InstructorsService | null;
  data: InstructorstblItem[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatTable) table: MatTable<InstructorstblItem>;
  //dataSource: InstructorstblDataSource;

  constructor(private instrService: InstructorsService,
    @Inject(PLATFORM_ID) private platformId,
    //private transferState: TransferState
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      //this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);
      // If the user changes the sort order, reset back to the first page.
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
            return this.instrService!.getInstructors(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
          //}
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return data.instructors;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.data = data;
      });
    /*this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;*/
    })
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: InstructorsInfo) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    data.instructors = data.instructors.splice(startIndex, this.paginator.pageSize);
    return data;
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: InstructorsInfo) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    data.instructors = data.instructors.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
    return data;
  }

  ngOnInit() {
    /*this.instrService.getInstructors().subscribe(data => {
      console.log(data);
    })*/
    //this.dataSource = new InstructorstblDataSource(this.instrService);
    if (this.instrService.getTransferState() == null) {
      if (isPlatformServer(this.platformId)){
        //location.reload();
        console.log("Instructorstbl server ngOnInit");
        this.instrService.getAllInstructors();
      } else if (localStorage.getItem('Instructors_reloaded') == null) {
        localStorage.setItem('Instructors_reloaded', '');
        location.reload();
      } else {
        localStorage.removeItem('Instructors_reloaded');
      }
    }
  }

  ngOnDestroy(){
    this.sort.sortChange.unsubscribe();
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
