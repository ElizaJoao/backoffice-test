import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../core/services/dashboard.service';
import { Statistics } from '../../core/models/statistics.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  statistics = signal<Statistics | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading.set(true);
    this.dashboardService.getStatistics().subscribe({
      next: (data) => {
        this.statistics.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load statistics');
        this.loading.set(false);
        console.error('Error loading statistics:', error);
      }
    });
  }

  refresh(): void {
    this.loadStatistics();
  }

  getMaxActivity(): number {
    if (!this.statistics()?.recentActivity.length) return 1;
    return Math.max(...this.statistics()!.recentActivity.map(a => a.count));
  }
}
