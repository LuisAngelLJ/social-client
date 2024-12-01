//una pipe es u filtro de información - formatear información
import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';

@Pipe({
    name: 'moment'
})

@Injectable()
export class MomentPipe implements PipeTransform {
	transform(uni: number) {
		let date = moment.unix(uni);
		return date.format('YYYY-M-D');
	}
}
