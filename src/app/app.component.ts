import { Component, ViewChild, ElementRef } from "@angular/core"
import { Router, ActivatedRoute, NavigationStart } from "@angular/router"
import { faCircleUser as faCircleUserSolid } from "@fortawesome/free-solid-svg-icons"
import { faCircleUser as faCircleUserRegular } from "@fortawesome/pro-regular-svg-icons"
import { Dav } from "dav-js"
import * as DavUIComponents from "dav-ui-components"
import { DataService } from "./services/data-service"
import { environment } from "../environments/environment"

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

	constructor(
		public dataService: DataService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		DavUIComponents.setLocale("en-EN")

		this.router.events.forEach(data => {
			if (data instanceof NavigationStart) {
				const currentUrl = data.url.split("?")[0]

				this.userButtonSelected = currentUrl == "/user"
			}
		})

		// Check for access token in the url
		this.activatedRoute.queryParams.subscribe(async params => {
			if (params["accessToken"]) {
				// Log in with the access token
				await this.dataService.dav.Login(params["accessToken"])
				window.location.href = this.router.url.slice(
					0,
					this.router.url.indexOf("?")
				)
			}
		})
	}

	ngOnInit() {
		this.dataService.contentContainer = this.contentContainer.nativeElement

		new Dav({
			environment: environment.environment,
			appId: environment.appId,
			tableIds: [],
			callbacks: {
				UserLoaded: () => this.userLoaded()
			}
		})
	}

	navigateToUserPage() {
		this.router.navigate(["user"])
	}

	//#region dav callback functions
	userLoaded() {
		this.dataService.userPromiseHolder.Resolve()
	}
	//#endregion
}
