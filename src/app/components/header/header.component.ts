import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  
  isLoggedIn = false;
  private userSub: Subscription;
  collapsed = true;
  
  constructor(private dataStorageService: DataStorageService,
          private authService: AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isLoggedIn = !user ? false : true;
    });
  }
  onSaveData(){
    this.dataStorageService.storeRecipes();
  }

  onFetchData(){ 
    this.dataStorageService.fetchRecipes().subscribe();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}