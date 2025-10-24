export interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  hireDate: string;
  companyId: number;
  company?: {
    id: number;
    name: string;
  };
  status: 'active' | 'inactive';
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
