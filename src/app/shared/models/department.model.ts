export interface Department {
  id: string;
  name: string;
  description: string;
  contactNumber: string;
  floorNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  contactNumber: string;
  floorNumber: number;
}