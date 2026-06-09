import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { inject } from '@angular/core';
import { CURRENT_USER } from '../token/current-user.token';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  imports: [RouterModule, ButtonModule, PanelModule, ToolbarModule, ToastModule, FormsModule, RadioButtonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [MessageService]
})
export class App {
  protected title = 'client';
  public currentUser = inject(CURRENT_USER);
}
