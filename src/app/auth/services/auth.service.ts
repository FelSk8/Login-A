import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserI, UserResponseI } from '../interfaces/user';
//helper
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
//firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn=new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private router: Router,
    private afAuth: AngularFireAuth //firebase
  ) { 
    this.checkToken().subscribe();
  }
  
    
  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }
  private readonly TOKEN = 'token';//save token in localstorage

  login(user: UserI):Observable<UserResponseI | void>{
    return this.http.post<UserResponseI>(environment.baseUrl+'/auth/login',user)
    .pipe(
      map((user: UserResponseI) => {
          //save token in localstorage
          this.saveToken(user);
          //loggedIn
          this.loggedIn.next(true);
      
        return user;

      }))
      
  }

  //save token in localstorage
  private saveToken(user: UserResponseI){
    const {message, ...rest}=user;
    localStorage.setItem(this.TOKEN,JSON.stringify(rest.token).replace(/['"]+/g,''));
    localStorage.setItem('user',JSON.stringify(rest));
  }

  logout():void{
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem('user');
    //loggedInnext(false)
    this.loggedIn.next(false);
   //desea cerrar sesion si o no con sweetalert2

   /* Swal.fire({
      title: '¿Desea cerrar sesión?',
      showDenyButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
    /*  if (result.isConfirmed) {
        Swal.fire('Sesión cerrada', '', 'success')
        this.router.navigate(['/login']);
      } else if (result.isDenied) {
        Swal.fire('Sesión no cerrada', '', 'info')
        
      }
    })*/
    //redireccionar
   this.router.navigate(['./login']);
    
  }
  checkToken():Observable<boolean>{
    const token = localStorage.getItem(this.TOKEN);
    const helper = new JwtHelperService();
    if(!token){
      this.logout();
      return new Observable<boolean>();
    }
    const isExpired = helper.isTokenExpired(token);
    if(isExpired){
      
      this.logout();
      return new Observable<boolean>();
    }
   this.loggedIn.next(true);
    return new Observable<boolean>();
  }

  //firebase
  async loginGoogle() : Promise<any>{
    try{
      const {user}=await this.afAuth.signInWithPopup(
        new GoogleAuthProvider())
      return user;
    }catch(error){
      console.log(error);
    }
  }
}
