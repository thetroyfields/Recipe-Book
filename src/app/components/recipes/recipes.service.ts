import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  //   new Recipe(
  //     'Nachos',
  //     'These are so good!',
  //     'https://cdn.pixabay.com/photo/2019/09/05/19/58/nachos-4454941_1280.jpg',
  //     [
  //       new Ingredient('chips', 1),
  //       new Ingredient('ground beef', 2),
  //       new Ingredient('cheese', 5),
  //     ]
  //   ),
  //   new Recipe(
  //     'Chicken Sandwich', 
  //     'Better than  Chick-Fil-a!', 
  //     'https://live.staticflickr.com/8326/8352201772_7986fc3138_b.jpg',
  //     [
  //       new Ingredient('chicken', 5),
  //       new Ingredient('buns', 5),
  //       new Ingredient('mayonnaise', 1)
  //     ]
  //   )
  // ];

  constructor() { }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  } 

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index]
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index:number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe; 
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
