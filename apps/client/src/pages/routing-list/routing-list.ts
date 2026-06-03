import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { Routing } from '../../models/Routing';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { RoutingService } from '../../../services/RoutingService';

@Component({
  imports: [RouterModule, ButtonModule, CardModule],
  selector: 'app-routing-list',
  templateUrl: './routing-list.html',
  styleUrl: './routing-list.css'
})
export class RoutingList implements OnInit {
  private router = inject(Router);
  private service = inject(RoutingService);
  private http = inject(HttpClient);
  routingList = signal<Routing[]>([]);

  ngOnInit(): void {
    this.service.getAll().subscribe((data) => {
      this.routingList.set(data);
    });
  }

  navigate(id: string) {
    this.router.navigate(['/routing-detail', id]);
  }

}
