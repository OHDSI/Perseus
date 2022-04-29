export interface User {
  username: string;
  email: string;
  password?: string;
  token?: string;
  firstName?: string;
  lastName?: string;
  refresh_token?: string;
}
