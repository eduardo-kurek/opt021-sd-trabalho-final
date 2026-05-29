import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { Routing } from '../../models/Routing';
import { CardModule } from 'primeng/card';

@Component({
  imports: [RouterModule, ButtonModule, CardModule],
  selector: 'app-routing-list',
  templateUrl: './routing-list.html',
  styleUrl: './routing-list.css'
})
export class RoutingList implements OnInit {
  private http = inject(HttpClient);
  routingList = signal<Routing[]>([]);
by: any;

  ngOnInit(): void {
    this.http.get<Routing[]>('http://localhost:5123/api/routing').subscribe((data) => {
      this.routingList.set(data);
    });
  }

}
