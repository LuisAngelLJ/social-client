import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
// para dejar de seguir
import { Follow } from '../../models/follow';
import { FollowService } from '../../services/follow.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, FollowService]
})
export class UsersComponent implements OnInit {
  public title : string;
  public url : string;
  public identity : any;
  public token : string;
  public page! : number;
  public next_page! : any;
  public prev_page! : any;
  public status! : string;
  public total! : any;
  public pages! : any;
  public users! : User[];
  public follows! : any;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = 'Gente';
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(
      params => {
        // el signo de + es para convertirlo a entero
        let page = +params['page'];
        this.page = page;

        if(!page) {
          page = 1;
        } else {
          this.next_page = page+1;
          this.prev_page = page-1;

          if(this.prev_page <= 0) {
            this.prev_page = 1;
          }
        }
        // sacar los usuarios
        this.getUsers(page);
      }
    );
  }

  getUsers(page: any) {
    this._userService.getUsers(page).subscribe(
      response => {
        if(!response.users) {
          this.status = 'error';
        } else {
          this.total = response.users.totalDocs;
          this.users = response.users.docs;
          this.pages = response.users.totalPages;
          this.prev_page = response.users.prevPage;
          this.next_page = response.users.nextPage;

          let array_follows = new Array();
          for(let i = 0; i < response.following.length; i++) {
            array_follows.push(Object.values(response.following[i]).toString());
          }
          this.follows = array_follows;
          // console.log(this.follows);

          if(page > this.pages) {
            this._router.navigate(['/gente', 1]);
          }
        }
      },
      error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null) {
          this.status = 'error';
        }
      });
  }

  // seguir y dejar de seguir
  public followUserOver! : any;

//si entra el mouse al boton
  mouseEnter(user_id:any) {
    // a la propiedad ele asigno el id del usuario solo para hacer el efecto
    this.followUserOver = user_id;
  }

//si el mouse sale del botón
  mouseLeave() {
    this.followUserOver = 0;
  }


  // seguir a un usuario
  followUser(followed: string) {
    var follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(
      response => {
        if(!response.follow) {
          this.status = 'error';
        } else {
          this.status = 'success';
          // agregar el id al array de forma reactiva sin recargar la página
          this.follows.push(followed);
        }
      },
      error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  // dejar de seguir
  unfollowUser(followed:string) {
    this._followService.deleteFollow(this.token, followed).subscribe(
      response => {
        // buscar id
        let search = this.follows.indexOf(followed);
        if(search != -1) {
          // eliminar el id del array de forma reactiva sin recargar la página
          this.follows.splice(search, 1);
        }
      },
      error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

}
