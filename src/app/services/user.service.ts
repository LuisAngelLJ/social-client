import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';
import { User } from '../models/user';

@Injectable()
export class UserService {
	public url : string;
	public identity! : any;
	public token! : string;
	public stats! : any;
	constructor(
		public _http : HttpClient
	) {
		this.url = global.url;
	}

	// registrar
	register(user: User): Observable<any> {
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-type','application/json');

		return this._http.post(this.url+'register', params, {headers});
	}

	// loguear
	singUp(user: any, gettoken = 'null'): Observable<any> {
		if(gettoken != 'null') {
			user.gettoken = gettoken;
		}

		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-type', 'application/json');

		return this._http.post(this.url+'login', params, {headers});
	}

	// devolver los datos del usuario logueado en el storage
	getIdentity() {
	    let identity = JSON.parse(localStorage.getItem('identity') || 'null');

	    if(identity != "undefined") {
	    	this.identity = identity;
	    } else {
	    	this.identity = 'null';
	    }

	    return this.identity;
    }

    // devolver el token del usuario logueado en el storage
    getToken() {
    	let token = localStorage.getItem('token') || 'null';

    	if(token != "undefined") {
    		this.token = token;
    	} else {
    		this.token = 'null';
    	}

    	return this.token;
    }

    // llamar los datos del localStorage que se guardan desde el login que llama a la función de getCounters
    getStats() {
    	let stats = JSON.parse(localStorage.getItem('stats') || 'null');

    	if(stats != "undefined") {
    		this.stats = stats;
    	} else {
    		this.stats = 'null';
    	}

    	return this.stats;
    }

    // contado de seguidores - seguido - publicaciones
    getCounters(userId = 'null'): Observable<any> {
    	let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', this.getToken());

    	if(userId != 'null') {
    		return this._http.get(this.url+'counters/'+userId, {headers});
    	} else {
    		return this._http.get(this.url+'counters', {headers});
    	}
    }

    // actualizar usuario
    updateUser(user: User): Observable<any> {
    	let params = JSON.stringify(user);
    	let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', this.getToken());

    	return this._http.put(this.url+'update-user/'+user._id, params, {headers});
    }

    // listado de usuarios
    getUsers(page = null): Observable<any> {
    	let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', this.getToken());

    	return this._http.get(this.url+'users/'+page, {headers});
    }

    // buscar usuario
    getUser(user_id:any): Observable<any> {
    	let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', this.getToken());

    	return this._http.get(this.url+'user/'+user_id, {headers});
    }
}
