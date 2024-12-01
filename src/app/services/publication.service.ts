import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';
import { Publication } from '../models/publication';

@Injectable()
export class PublicationService {
	public url : string;

	constructor(
		private _http : HttpClient
	) {
		this.url = global.url;
	}

	/**Los token los obtengo de la función del componenete, ahí llamo al metodo donde saco el token**/

	// crear nueva publicación
	addPublication(token:string, publication:any): Observable<any> {
		let params = JSON.stringify(publication);
		let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', token);

		return this._http.post(this.url+'publication', params, {headers});
	}

	// listar publicaciones
	getPublications(token: string , page = 1): Observable<any> {
		let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', token);

		return this._http.get(this.url+'publications/'+page, {headers});
	}

	// eliminar publicación
	deletePublication(token: string, id: string): Observable<any> {
		let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', token);

		return this._http.delete(this.url+'publication/'+id, {headers});
	}

	//listar publicaciones del usuario logueado
	getPublicationsUser(token: string, user_id: string , page = 1): Observable<any> {
		let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', token);

		return this._http.get(this.url+'publications-user/'+user_id+ '/' +page, {headers});
	}
}
