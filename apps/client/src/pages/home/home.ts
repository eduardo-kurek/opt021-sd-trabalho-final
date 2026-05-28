import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from "@angular/router";

@Component({
  imports: [ButtonModule, RouterLink],
  selector: 'home',
  templateUrl: './home.html',
})
export class Home {
  
}
