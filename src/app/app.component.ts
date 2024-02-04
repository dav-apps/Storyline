import { Component, ViewChild, ElementRef } from "@angular/core"
import * as DavUIComponents from "dav-ui-components"
import { DataService } from "./services/data-service"

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss"
})
export class AppComponent {
	constructor() {
		DavUIComponents.setLocale("en-EN")
	}
}
