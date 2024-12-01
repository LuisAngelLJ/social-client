import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {
  public title : string;
  public user : User;
  public identity! : any;
  public token! : string;
  public status!: string;
  public url : string;
  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService,
    private _uploadService : UploadService
  ) {
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = global.url;
  }

  ngOnInit(): void {
    // console.log(this.user);
  }

  onSubmit(form: any) {
    this._userService.updateUser(this.user).subscribe(
      response => {
        if(!response.user) {
          this.status = 'error';
        } else {
          this.status = 'success';
          // actualizar el localStorage
          localStorage.setItem('identity', JSON.stringify(this.user));
          // actualizar la variable identity
          this.identity = this.user;
          // subida de imagen de usuario mistras la variable tenga algo
          if(this.filesToUpload != null) {
            this._uploadService.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload, this.token, 'image')
            .then((result:any) => {
              // console.log(result);
              this.user.image = result.user.image;
              localStorage.setItem('identity', JSON.stringify(this.user));
              console.log(this.user);
            })
            .catch((error: any) => {
              console.log(error);
            });
          } else {
            console.log('no se cargaron archivos')
          }
        }
      },
      error => {
        let errorMenssage = <any>error;
        console.log(errorMenssage);
        if(!errorMenssage != null) {
          this.status = 'error';
        }
      }
    );
  }

  public filesToUpload!: Array<File>;
  fileEventChange(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    // console.log(this.filesToUpload);
  }

}
