export interface IResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  timestamp: string;
}

export interface IPaginatedResponse<T> extends IResponse<T> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}