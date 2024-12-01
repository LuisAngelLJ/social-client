import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { global } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {
  public identity: any;
  public token: string;
  public title: string;
  public url: string;
  public status!: string;
  public page: number;
  public total!: number;
  public pages!: number;
  public publications!: any[];
  public itemsPerPage!: any;
  public nextPage!: any;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService,
    private _publicationService: PublicationService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title = 'Publicaciones';
    this.url = global.url;
    this.page = 1;
  }

  ngOnInit(): void {
    this.getPublications(this.page);
    console.log(this.identity._id)
  }

  getPublications(page: number, addingScroll = false) {
    this._publicationService.getPublications(this.token, page).subscribe(
      response => {
        if(response.publications) {
          this.total = response.publications.totalDocs;
          this.pages = response.publications.totalPages;
          this.itemsPerPage = response.publications.limit;
          this.nextPage = response.publications.nextPage;

          if(!addingScroll) {
            this.publications = response.publications.docs;
            console.log(this.publications);
          } else {
            var b = response.publications.docs; //página 2 - página 3
            this.publications = this.publications.concat(b);
            // console.log(this.publications);
            // scroll automatico animado
            $("html, .cont div").animate({scrollTop: $('body').prop("scrollHeight")}, 500);
          }
        } else {
          this.status = 'error';
        }
      },
      error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if(error) {
          this.status = 'error';
        }
      }
    );
  }

  viewMore() {
    if(this.nextPage != null) {
      this.page += 1;
      this.getPublications(this.page, true);
    }
  }

// responde al evento output de sidebar
  refresh(event: any) {
    // llamo a la función que consulta las publicaciones
    this.getPublications(1);
  }

}
