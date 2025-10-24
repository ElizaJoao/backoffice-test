export interface Country {
  id: number;
  name: string;
  code: string;
  region: string;
  capital: string;
  currency: string;
  language: string;
  population: number;
  area: number;
  status: 'active' | 'inactive';
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
