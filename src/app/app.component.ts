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
import { dataIdFromObject, isServer } from "src/app/utils"
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
	currentUrl: string = ""

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

				setTimeout(() => {
					this.currentUrl = currentUrl
				}, 100)
			}
		})

		// Check for access token in the url
		this.activatedRoute.queryParams.subscribe(async params => {
			if (params["accessToken"]) {
				// Log in with the access token
				await this.dataService.dav.Login(params["accessToken"])

				// Reload the page without accessToken in the url
				let url = new URL(window.location.href)
				url.searchParams.delete("accessToken")
				window.location.href = url.toString()
			} else if (params["upgradePlus"] == "true") {
				await this.dataService.userPromiseHolder.AwaitResult()

				if (
					this.dataService.dav.isLoggedIn &&
					this.dataService.dav.user.Plan == 0
				) {
					let redirectUrl =
						window.location.origin + window.location.pathname

					let response =
						await this.davApiService.createSubscriptionCheckoutSession(
							`url`,
							{
								plan: "PLUS",
								successUrl: redirectUrl,
								cancelUrl: redirectUrl
							}
						)

					const url = response.data?.createSubscriptionCheckoutSession?.url

					if (url != null) {
						window.location.href = url
					} else {
						window.location.href = redirectUrl
					}
				}
			}
		})
	}

	async ngOnInit() {
		if (isServer()) {
			this.userLoaded()
			return
		}

		this.setSize()
		this.dataService.loadTheme()
		this.dataService.contentContainer = this.contentContainer.nativeElement

		new Dav({
			environment: environment.environment,
			appId: environment.appId,
			tableIds: [
				environment.followTableId,
				environment.bookmarkTableId,
				environment.notificationTableId
			],
			notificationOptions: {
				icon: "/assets/icons/icon-192.png",
				badge: "/assets/icons/badge-128.png"
			},
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
		this.dataService.isMobile =
			!isServer() && window.innerWidth <= smallWindowMaxSize
	}

	navigateToPage(path: string) {
		if (this.currentUrl == path) {
			this.scrollToTop(path)
		} else {
			this.router.navigate([path])
		}
	}

	scrollToTop(path: string) {
		if (path == this.currentUrl) {
			this.dataService.contentContainer.scroll({
				top: 0,
				behavior: "smooth"
			})
		}
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
