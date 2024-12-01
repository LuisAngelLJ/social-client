import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title : string;
  public user : User;
  public status! : string;
  public identity! : User;
  public token! : string;
  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService
  ) {
    this.title = 'Login';
    this.user = new User('','','','','','','','');
  }

  ngOnInit(): void {
  }

  onSubmit(form:any) {
    this._userService.singUp(this.user).subscribe(
      response => {
        this.identity = response.user;
        if(!this.identity || !this.identity._id) {
          this.status = 'error';
        } else {
          // persistir datos del usuario en localStorege
          localStorage.setItem('identity', JSON.stringify(this.identity));
          // conseguir el token
          this.getToken();
        }
        // console.log(this.identity);
      },
      error => {
        let errorMessage = <any>error;
        if(errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }


  getToken() {
    /*
  en el back si no le paso en los parametros el gettoken me devuelve los datos del usuario, que es la función de arriba
  si le paso el gettoken me devuelve solo el token que es lo que hago en este metodo
    */
    this._userService.singUp(this.user, 'true').subscribe(
      response => {
        this.token = response.token;
        if(this.token.length <= 0) {
          this.status = 'error';
        } else {
          // persistir token del usuario en localStorege
          localStorage.setItem('token', this.token);
          // conseguir los contadores o estadisticas del usuario
          this.getCounters();
        }
      },
      error => {
        let errorMessage = <any>error;
        if(errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  // sacar estadisticas del usuario
  getCounters() {
    this._userService.getCounters().subscribe(
      response => {
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
        this._router.navigate(['/home']);
      },
      error => {
        console.log(<any>error);
      }
    )
  }

}
