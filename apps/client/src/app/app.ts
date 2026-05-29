import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  imports: [RouterModule, ButtonModule, PanelModule, ToolbarModule, ToastModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [MessageService]
})
export class App {
  protected title = 'client';
}
