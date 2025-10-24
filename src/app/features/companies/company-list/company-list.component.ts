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
import { Company } from '../../../core/models/company.model';
import { CompanyService } from '../../../core/services/company.service';
import { CompanyFormModalComponent } from '../company-form-modal/company-form-modal.component';

@Component({
  selector: 'app-company-list',
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
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'industry', 'email', 'phone', 'employeeCount', 'status', 'approvalStatus', 'actions'];
  dataSource!: MatTableDataSource<Company>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterValues = {
    name: '',
    industry: '',
    email: '',
    phone: '',
    status: ''
  };

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Company>([]);
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe(companies => {
      this.dataSource.data = companies;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.setupFilter();
    });
  }

  setupFilter(): void {
    this.dataSource.filterPredicate = (data: Company, filter: string) => {
      const filters = JSON.parse(filter);

      const matchName = !filters.name || data.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchIndustry = !filters.industry || data.industry.toLowerCase().includes(filters.industry.toLowerCase());
      const matchEmail = !filters.email || data.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchPhone = !filters.phone || data.phone.includes(filters.phone);
      const matchStatus = !filters.status || data.status === filters.status;

      return matchName && matchIndustry && matchEmail && matchPhone && matchStatus;
    };
  }

  applyFilter(field: string, value: string): void {
    this.filterValues[field as keyof typeof this.filterValues] = value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  clearFilters(): void {
    this.filterValues = {
      name: '',
      industry: '',
      email: '',
      phone: '',
      status: ''
    };
    this.dataSource.filter = '';
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filterValues).some(value => value !== '');
  }

  addCompany(): void {
    const dialogRef = this.dialog.open(CompanyFormModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompanies();
      }
    });
  }

  viewCompany(company: Company): void {
    this.router.navigate(['/companies', company.id]);
  }

  deleteCompany(company: Company, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${company.name}?`)) {
      this.companyService.deleteCompany(company.id).subscribe(() => {
        this.loadCompanies();
      });
    }
  }
}
