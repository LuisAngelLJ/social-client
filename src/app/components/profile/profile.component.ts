import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { global } from '../../services/global';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService, PublicationService]
})
export class ProfileComponent implements OnInit {
  public title: string;
  public url: string;
  public user!: User;
  public status!: string;
  public identity: any;
  public token: string;
  public stats!: any;
  public follow!: any;
  public seguir: boolean;
  public siguiendo: boolean;
  public publications_user!: any;
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _followService: FollowService,
    private _publicationService: PublicationService
  ) {
    this.url = global.url;
    this.title = 'Perfil';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.seguir = false;
    this.siguiendo = false;
  }

  ngOnInit(): void {
    this.loadID();
  }

  loadID() {
    this._route.params.subscribe(
      params => {
        let id = params['id'];
        this.getUser(id);
        this.getCounters(id);
        this.getPublications(id);
      }
    );
  }

  // buscar a un usuario
  getUser(id: string) {
    this._userService.getUser(id).subscribe(
      response => {
        this.user = response.user;

        // comprobar si el usuario consultado me sigue
        if(response.following != null) {
          this.seguir = true;
        } else {
          this.seguir = false;
        }

        // consultar si yo sigo al usuario
        if(response.followed !== null) {
          this.siguiendo = true;
        } else {
          this.siguiendo = false;
        }
      },
      error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        this._router.navigate(['/home']);
        alert('El usuario no existe');
        if(error) {
          this.status = 'error';
        }
      }
    );
  }


  // efecto de botón seguiendo y dejar de seguir
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


  // estadisticas del usuario buscado
  getCounters(id: string) {
    this._userService.getCounters(id).subscribe(
      response => {
        this.stats = response;
      },
      error => {
        console.log(<any>error);
      }
    );
  }



  // seguir a usuario
  followUser(idUserFollowed: string) {
    let follow = new Follow('', this.identity._id, idUserFollowed);

    this._followService.addFollow(this.token, follow).subscribe(
      response => {
        this.siguiendo = true;
        console.log (this.siguiendo);
      },
      error => {
        console.log(<any>error);
      }
    );
  }


  // dejar de seguir a usuario
  unfollowUser(idUserUnfollowed: string) {
    this._followService.deleteFollow(this.token, idUserUnfollowed).subscribe(
      response => {
        this.siguiendo = false;
        console.log (this.siguiendo);
      },
      error => {
        console.log(<any>error);
      }
    );
  }


  //publicaciones de este usuario
  getPublications(id: string) {
    this._publicationService.getPublicationsUser(this.token, id).subscribe(
      response => {
        this.publications_user = response.publications.docs;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
