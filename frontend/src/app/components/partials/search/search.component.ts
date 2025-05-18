import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';
import {
  FOODS_BY_SEARCH_URL,
  FOODS_TAGS_URL,
} from 'src/app/shared/constants/urls';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  showResults: boolean = false;
  filteredFoods: Food[] = [];
  isLoading: boolean = false;
  private searchTerms = new Subject<string>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          this.isLoading = true;
          return this.foodService.getAllFoodsBySearchTerm(term);
        })
      )
      .subscribe({
        next: (foods) => {
          this.filteredFoods = foods;
          this.showResults = this.searchTerm.length > 0;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Search error:', error);
        },
      });

    this.activatedRoute.params.subscribe((params) => {
      if (params['searchTerm']) {
        this.searchTerm = params['searchTerm'];
        this.searchTerms.next(this.searchTerm);
      }
    });
  }

  onSearchInput(term: string): void {
    this.searchTerm = term;
    this.searchTerms.next(term);
  }

  searchFoods(term: string): void {
    this.foodService.getAllFoodsBySearchTerm(term).subscribe({
      next: (foods) => {
        this.filteredFoods = foods;
      },
      error: (error) => {
        console.error('Search error:', error);
      },
    });
  }

  search(term: string): void {
    if (term) {
      this.router.navigateByUrl(FOODS_BY_SEARCH_URL + '/' + term);
      this.showResults = false;
    }
  }

  selectFood(food: Food): void {
    this.searchTerm = food.name;
    this.router.navigate([food.tags, food.id]);
    this.showResults = false;
    this.searchTerm = '';
  }

  hideResults(): void {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }
}
