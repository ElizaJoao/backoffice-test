import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { Country } from '../../../core/models/country.model';
import { CountryService } from '../../../core/services/country.service';
import { CountryFormModalComponent } from '../country-form-modal/country-form-modal.component';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss'
})
export class CountryListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'code', 'region', 'capital', 'population', 'status', 'approvalStatus', 'actions'];
  dataSource!: MatTableDataSource<Country>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showFilters = false;

  filterValues = {
    name: '',
    code: '',
    region: '',
    capital: '',
    status: ''
  };

  constructor(
    private countryService: CountryService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Country>([]);
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe(countries => {
      this.dataSource.data = countries;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.setupFilter();
    });
  }

  setupFilter(): void {
    this.dataSource.filterPredicate = (data: Country, filter: string) => {
      const filters = JSON.parse(filter);

      const matchName = !filters.name || data.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchCode = !filters.code || data.code.toLowerCase().includes(filters.code.toLowerCase());
      const matchRegion = !filters.region || data.region.toLowerCase().includes(filters.region.toLowerCase());
      const matchCapital = !filters.capital || data.capital?.toLowerCase().includes(filters.capital.toLowerCase());
      const matchStatus = !filters.status || data.status === filters.status;

      return matchName && matchCode && matchRegion && matchCapital && matchStatus;
    };
  }

  applyFilter(field: string, value: string): void {
    this.filterValues[field as keyof typeof this.filterValues] = value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  clearFilters(): void {
    this.filterValues = {
      name: '',
      code: '',
      region: '',
      capital: '',
      status: ''
    };
    this.dataSource.filter = '';
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filterValues).some(value => value !== '');
  }

  getActiveFilterCount(): number {
    return Object.values(this.filterValues).filter(value => value !== '').length;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  addCountry(): void {
    const dialogRef = this.dialog.open(CountryFormModalComponent, {
      width: '700px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCountries();
      }
    });
  }

  viewCountry(country: Country): void {
    this.router.navigate(['/countries', country.id]);
  }

  deleteCountry(country: Country, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${country.name}?`)) {
      this.countryService.deleteCountry(country.id).subscribe(() => {
        this.loadCountries();
      });
    }
  }
}
