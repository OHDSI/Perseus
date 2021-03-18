import { User } from '../models/user';
import { Observable } from 'rxjs/internal/Observable';

export interface AuthService {

  user: User

  isUserLoggedIn: boolean

  login(login: string, password: string): Observable<User>

  logout(): Observable<void>
}
