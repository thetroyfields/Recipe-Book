import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {

  constructor(private shoppingListService: ShoppingListService) { }

  @ViewChild('f') shoppingForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editedItem: Ingredient;

  ngOnInit() {
    this.subscription = this.shoppingListService.editItem.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editItemIndex = index; 
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.shoppingForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    );
  }

  onSubmit(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient( value.name, value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editItemIndex, newIngredient);
    } else {
      this.shoppingListService.addToList(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  clearForm() {
    this.shoppingForm.reset();
    this.editMode = false;
  }

  deleteItem() {
    this.shoppingListService.deleteFromList(this.editItemIndex);
    this.clearForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
