export interface Company {
  id: number;
  name: string;
  industry: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  employeeCount: number;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
