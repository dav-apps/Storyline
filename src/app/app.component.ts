import { Component, ViewChild, ElementRef, HostListener } from "@angular/core"
import { Router, ActivatedRoute, NavigationStart } from "@angular/router"
import {
	faNewspaper as faNewspaperSolid,
	faCircleUser as faCircleUserSolid,
	faGear as faGearSolid
} from "@fortawesome/free-solid-svg-icons"
import { faSparkles as faSparklesSolid } from "@fortawesome/pro-solid-svg-icons"
import {
	faNewspaper as faNewspaperRegular,
	faSparkles as faSparklesRegular,
	faCircleUser as faCircleUserRegular,
	faGear as faGearRegular
} from "@fortawesome/pro-regular-svg-icons"
import { Dav } from "dav-js"
import * as DavUIComponents from "dav-ui-components"
import { DataService } from "./services/data-service"
import { LocalizationService } from "./services/localization-service"
import { smallWindowMaxSize } from "src/app/constants"
import { environment } from "src/environments/environment"

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss"
})
export class AppComponent {
	locale = this.localizationService.locale.misc
	faNewspaperSolid = faNewspaperSolid
	faNewspaperRegular = faNewspaperRegular
	faSparklesSolid = faSparklesSolid
	faSparklesRegular = faSparklesRegular
	faCircleUserSolid = faCircleUserSolid
	faCircleUserRegular = faCircleUserRegular
	faGearSolid = faGearSolid
	faGearRegular = faGearRegular
	@ViewChild("contentContainer", { static: true })
	contentContainer: ElementRef<HTMLDivElement>
	newsFeedTabActive: boolean = false
	discoverTabActive: boolean = false
	userButtonSelected: boolean = false
	settingsButtonSelected: boolean = false

	constructor(
		public dataService: DataService,
		private localizationService: LocalizationService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		DavUIComponents.setLocale("en-EN")

		this.router.events.forEach(data => {
			if (data instanceof NavigationStart) {
				const currentUrl = data.url.split("?")[0]

				this.newsFeedTabActive = currentUrl == "/"
				this.discoverTabActive = currentUrl.startsWith("/discover")
				this.userButtonSelected = currentUrl == "/user"
				this.settingsButtonSelected = currentUrl == "/settings"
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
		this.dataService.loadTheme()
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

	@HostListener("window:resize")
	setSize() {
		this.dataService.isMobile = window.innerWidth <= smallWindowMaxSize
	}

	navigateToNewsFeedPage() {
		this.router.navigate([""])
	}

	navigateToDiscoverPage() {
		this.router.navigate(["discover"])
	}

	navigateToUserPage() {
		this.router.navigate(["user"])
	}

	navigateToSettingsPage() {
		this.router.navigate(["settings"])
	}

	//#region dav callback functions
	userLoaded() {
		this.dataService.userPromiseHolder.Resolve()
	}
	//#endregion
}
