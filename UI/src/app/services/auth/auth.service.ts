import { User } from '../../models/user';
import { Observable } from 'rxjs/internal/Observable';

export interface AuthService {

  user: User

  isUserLoggedIn: boolean

  login(email: string, password: string): Observable<User>

  logout(): Observable<void>

  register(user: User): Observable<void>;

  recoverPassword(email: string): Observable<void>;

  reset(password: string, token: string): Observable<void>;
}

export const localStorageUserField = 'currentUser'
