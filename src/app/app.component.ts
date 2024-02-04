import { Component, ViewChild, ElementRef } from "@angular/core"
import * as DavUIComponents from "dav-ui-components"
import { DataService } from "./services/data-service"

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss"
})
export class AppComponent {
	@ViewChild("contentContainer", { static: true })
	contentContainer: ElementRef<HTMLDivElement>

	constructor(private dataService: DataService) {
		DavUIComponents.setLocale("en-EN")
	}

	ngOnInit() {
		this.dataService.contentContainer = this.contentContainer.nativeElement
	}
}
