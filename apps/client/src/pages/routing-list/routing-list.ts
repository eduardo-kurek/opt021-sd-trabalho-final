import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [RouterModule, ButtonModule],
  selector: 'app-routing-list',
  templateUrl: './routing-list.html',
})
export class RoutingList implements OnInit {
  private httpClient = inject(HttpClient);
  message = signal('Loading...');

  ngOnInit(): void {
    this.httpClient.get<{ message: string }>('http://localhost:5123/api/routing').subscribe((data) => {
      this.message.set(data.message);
    });
  }

}
