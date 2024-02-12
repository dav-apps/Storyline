import { Injectable } from "@angular/core"
import { Dav } from "dav-js"

@Injectable()
export class DataService {
	dav = Dav
	contentContainer: HTMLDivElement = null
}
