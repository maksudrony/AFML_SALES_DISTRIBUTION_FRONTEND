export interface IMenuItem {
  label: string;
  path?: string | null;
  icon?: string | null;
  children : IMenuItem[];
}

export interface ILoginResponse {
  statusCode: number; // Returns 1 for Success, 0 for Failure
  message: string;
  token: string;
  empName: string; 
}