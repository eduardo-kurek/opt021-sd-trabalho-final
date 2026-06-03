import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { Routing } from '../../models/Routing';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [RouterModule, ButtonModule, CardModule],
  selector: 'app-routing-detail',
  templateUrl: './routing-detail.html',
  styleUrl: './routing-detail.css'
})
export class RoutingDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  public routing = signal<Routing | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.http.get<Routing>(`http://localhost:5123/api/routing/${id}`).subscribe((data) => {
        this.routing.set(data);
        console.log(data  );
      });
    }
  }

}
