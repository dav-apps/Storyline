import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { RouterOutlet, RouterLink } from "@angular/router"
import * as DavUIComponents from "dav-ui-components"

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, RouterLink],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
	constructor() {
		DavUIComponents.setLocale("en-EN")
	}
}
