import { Component, OnInit } from '@angular/core';
import { Items, Item, GithubResponse } from './interface';
import { GithubService } from './services/github.service';
import { Observable, observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  startWith,
  map,
  debounceTime,
  mergeMapTo,
  mergeMap,
  switchMap,
  catchError
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public githubAutoComplete$: Observable<Items> = null;
  public autoCompleteControl = new FormControl();

  constructor(private githubService: GithubService) {}

  lookup(value: string): Observable<Items> {
    return this.githubService.search(value.toLowerCase()).pipe(
      map(results => results.items),
      catchError(error => {
        return of(null);
      })
    );
  }

  ngOnInit() {
    this.githubAutoComplete$ = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        if (value !== '') {
          return this.lookup(value);
        } else {
          return of(null);
        }
      })
    );
  }
}
