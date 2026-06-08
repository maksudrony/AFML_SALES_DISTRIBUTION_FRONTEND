export interface ILoginResponse {
  statusCode: number; // Returns 1 for Success, 0 for Failure
  message: string;
  token: string;
  empName: string; 
}