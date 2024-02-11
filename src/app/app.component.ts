import { Component, ViewChild, ElementRef } from "@angular/core"
import { Router, NavigationStart } from "@angular/router"
import * as DavUIComponents from "dav-ui-components"
import { DataService } from "./services/data-service"
import { faCircleUser as faCircleUserSolid } from "@fortawesome/free-solid-svg-icons"
import { faCircleUser as faCircleUserRegular } from "@fortawesome/pro-regular-svg-icons"

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss"
})
export class AppComponent {
	faCircleUserSolid = faCircleUserSolid
	faCircleUserRegular = faCircleUserRegular
	@ViewChild("contentContainer", { static: true })
	contentContainer: ElementRef<HTMLDivElement>
	userButtonSelected: boolean = false

	constructor(private dataService: DataService, private router: Router) {
		DavUIComponents.setLocale("en-EN")

		this.router.events.forEach(data => {
			if (data instanceof NavigationStart) {
				const currentUrl = data.url.split("?")[0]

				this.userButtonSelected = currentUrl == "/user"
			}
		})
	}

	ngOnInit() {
		this.dataService.contentContainer = this.contentContainer.nativeElement
	}

	navigateToUserPage() {
		this.router.navigate(["user"])
	}
}
