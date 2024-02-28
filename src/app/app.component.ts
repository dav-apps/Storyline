import { Component, ViewChild, ElementRef, HostListener } from "@angular/core"
import { Router, ActivatedRoute, NavigationStart } from "@angular/router"
import { HttpHeaders } from "@angular/common/http"
import { Apollo } from "apollo-angular"
import { HttpLink } from "apollo-angular/http"
import { InMemoryCache } from "@apollo/client/core"
import {
	faNewspaper as faNewspaperSolid,
	faHammer as faHammerSolid,
	faCircleUser as faCircleUserSolid,
	faGear as faGearSolid,
	faBookBookmark as faBookBookmarkSolid
} from "@fortawesome/free-solid-svg-icons"
import { faSparkles as faSparklesSolid } from "@fortawesome/pro-solid-svg-icons"
import {
	faNewspaper as faNewspaperRegular,
	faSparkles as faSparklesRegular,
	faBookBookmark as faBookBookmarkRegular,
	faHammer as faHammerRegular,
	faCircleUser as faCircleUserRegular,
	faGear as faGearRegular
} from "@fortawesome/pro-regular-svg-icons"
import { Dav, GetAllTableObjects } from "dav-js"
import * as DavUIComponents from "dav-ui-components"
import { DataService } from "./services/data-service"
import { ApiService } from "./services/api-service"
import { DavApiService } from "./services/dav-api-service"
import { LocalizationService } from "./services/localization-service"
import { dataIdFromObject } from "src/app/utils"
import {
	smallWindowMaxSize,
	admins,
	davApiClientName,
	storylineApiClientName
} from "src/app/constants"
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
	faBookBookmarkSolid = faBookBookmarkSolid
	faBookBookmarkRegular = faBookBookmarkRegular
	faHammerSolid = faHammerSolid
	faHammerRegular = faHammerRegular
	faCircleUserSolid = faCircleUserSolid
	faCircleUserRegular = faCircleUserRegular
	faGearSolid = faGearSolid
	faGearRegular = faGearRegular
	@ViewChild("contentContainer", { static: true })
	contentContainer: ElementRef<HTMLDivElement>
	newsFeedTabActive: boolean = false
	discoverTabActive: boolean = false
	bookmarksButtonSelected: boolean = false
	adminButtonSelected: boolean = false
	userButtonSelected: boolean = false
	settingsButtonSelected: boolean = false

	constructor(
		public dataService: DataService,
		private apiService: ApiService,
		private davApiService: DavApiService,
		private localizationService: LocalizationService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private apollo: Apollo,
		private httpLink: HttpLink
	) {
		DavUIComponents.setLocale("en-EN")

		this.router.events.forEach(data => {
			if (data instanceof NavigationStart) {
				const currentUrl = data.url.split("?")[0]

				this.newsFeedTabActive = currentUrl == "/"
				this.discoverTabActive = currentUrl.startsWith("/discover")
				this.bookmarksButtonSelected = currentUrl == "/bookmarks"
				this.adminButtonSelected = currentUrl.startsWith("/admin")
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

	async ngOnInit() {
		this.setSize()
		this.dataService.loadTheme()
		this.dataService.contentContainer = this.contentContainer.nativeElement

		new Dav({
			environment: environment.environment,
			appId: environment.appId,
			tableIds: [],
			callbacks: {
				UserLoaded: () => this.userLoaded(),
				AccessTokenRenewed: (accessToken: string) =>
					this.accessTokenRenewed(accessToken)
			}
		})

		// Get number of bookmark table objects
		let tableObjects = await GetAllTableObjects(environment.bookmarkTableId)
		this.dataService.bookmarksCount = tableObjects.length
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

	navigateToBookmarksPage() {
		this.router.navigate(["bookmarks"])
	}

	navigateToAdminPage() {
		this.router.navigate(["admin"])
	}

	navigateToUserPage() {
		this.router.navigate(["user"])
	}

	navigateToSettingsPage() {
		this.router.navigate(["settings"])
	}

	setupApollo(accessToken: string) {
		this.apollo.removeClient(davApiClientName)
		this.apollo.removeClient(storylineApiClientName)

		this.apollo.create(
			{
				cache: new InMemoryCache({ dataIdFromObject }),
				link: this.httpLink.create({
					uri: environment.davApiUrl,
					headers: new HttpHeaders().set("Authorization", accessToken)
				})
			},
			davApiClientName
		)

		this.apollo.create(
			{
				cache: new InMemoryCache({ dataIdFromObject }),
				link: this.httpLink.create({
					uri: environment.storylineApiUrl,
					headers: new HttpHeaders().set("Authorization", accessToken)
				})
			},
			storylineApiClientName
		)

		this.davApiService.loadApolloClient()
		this.apiService.loadApolloClient()
	}

	//#region dav callback functions
	userLoaded() {
		this.dataService.userIsAdmin = admins.includes(
			this.dataService.dav.user.Id
		)

		if (this.dataService.dav.isLoggedIn) {
			// Setup the apollo client with the access token
			this.setupApollo(this.dataService.dav.accessToken)
		}

		this.dataService.userPromiseHolder.Resolve()
	}

	accessTokenRenewed(accessToken: string) {
		this.setupApollo(accessToken)
	}
	//#endregion
}
