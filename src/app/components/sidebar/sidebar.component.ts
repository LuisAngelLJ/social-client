import { Component, OnInit, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService]
})
export class SidebarComponent implements OnInit, DoCheck {
  public identity: any;
  public token: string;
  public stats: any;
  public status!: string;
  public url: string;
  public publication!: Publication;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService: UserService,
    private _publicationService : PublicationService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats(); // llamo a la función que recoge los datos del localStorage
    this.url = global.url;
    this.publication = new Publication('', '', '', '', this.identity._id);
  }

  ngOnInit(): void {
    // console.log(this.stats);
  }

  ngDoCheck(): void {
    this.stats = this._userService.getStats();
  }

  onSubmit(form: any) {
    // console.log(this.publication);
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if(response.publication) {
          this.publication = response.publication;
          this.status = 'success';
          this.getCounters();
          form.reset();
          // forma de actualizar el componete timeline porque como son dos componentes distintos no se puede usar el input y output
          this._router.navigate(['/timeline']);
        } else {
          this.status = 'error';
        }
      },
      error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage) {
          this.status = 'error';
        }
      }
    );
  }

  // actualizar las estadisticas del usuario que se sacan del login
  getCounters() {
    this._userService.getCounters().subscribe(
      response => {
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
      },
      error => {
        console.log(<any>error);
      }
    )
  }


  // output
  @Output() sended = new EventEmitter();
  sendPublication(event: any) {
    console.log(event);
    this.sended.emit({send: 'true'});
  }

}
