import { User } from '../models/user';
import { Observable } from 'rxjs/internal/Observable';

export interface AuthService {

  user: User

  isUserLoggedIn: boolean

  login(username: string, password: string): Observable<User>

  logout(): Observable<void>
}

export const localStorageUserField = 'currentUser'
