import { Injectable } from "@angular/core"
import { Dav, PromiseHolder } from "dav-js"

@Injectable()
export class DataService {
	dav = Dav
	userPromiseHolder = new PromiseHolder()
	contentContainer: HTMLDivElement = null
}
