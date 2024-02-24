import { Component, ViewChild } from "@angular/core"
import { Router } from "@angular/router"
import { PublisherDialogComponent } from "src/app/dialogs/publisher-dialog/publisher-dialog.component"
import { ApiService } from "src/app/services/api-service"
import { LocalizationService } from "src/app/services/localization-service"
import { PublisherResource } from "src/app/types"
import * as ErrorCodes from "src/app/errorCodes"

@Component({
	templateUrl: "./admin-page.component.html",
	styleUrl: "./admin-page.component.scss"
})
export class AdminPageComponent {
	locale = this.localizationService.locale.adminPage
	errorsLocale = this.localizationService.locale.errors
	publishers: PublisherResource[] = []
	limit: number = 10
	offset: number = 0

	//#region CreatePublisherDialog
	@ViewChild("publisherDialog")
	publisherDialog: PublisherDialogComponent
	publisherDialogLoading: boolean = false
	publisherDialogNameError: string = ""
	publisherDialogDescriptionError: string = ""
	publisherDialogUrlError: string = ""
	publisherDialogLogoUrlError: string = ""
	//#endregion

	constructor(
		private apiService: ApiService,
		private localizationService: LocalizationService,
		private router: Router
	) {}

	async ngOnInit() {
		await this.loadPublishers()
	}

	async loadPublishers() {
		let listPublishersResponse = await this.apiService.listPublishers(
			`
				total
				items {
					uuid
					name
					logoUrl
				}
			`,
			{
				limit: this.limit,
				offset: this.offset
			}
		)

		let listPublishersResponseData =
			listPublishersResponse.data?.listPublishers

		if (listPublishersResponseData != null) {
			for (let item of listPublishersResponseData.items) {
				this.publishers.push(item)
			}
		}
	}

	showPublisherDialog() {
		this.publisherDialog.show()
	}

	async createPublisher(data: {
		name: string
		description: string
		url: string
		logoUrl: string
	}) {
		this.publisherDialogNameError = ""
		this.publisherDialogDescriptionError = ""
		this.publisherDialogUrlError = ""
		this.publisherDialogLogoUrlError = ""
		this.publisherDialogLoading = true

		let response = await this.apiService.createPublisher(
			`
				uuid
				name
				description
				url
				logoUrl
			`,
			{ ...data }
		)

		this.publisherDialogLoading = false

		if (response.errors == null) {
			let responseData = response.data.createPublisher

			this.publishers.push(responseData)
			this.navigateToAdminPublisherPage(responseData)
		} else {
			let errors = response.errors[0].extensions["errors"] as string[]

			for (let errorCode of errors) {
				switch (errorCode) {
					case ErrorCodes.nameTooShort:
						if (data.name.length == 0) {
							this.publisherDialogNameError =
								this.errorsLocale.nameMissing
						} else {
							this.publisherDialogNameError =
								this.errorsLocale.nameTooShort
						}
						break
					case ErrorCodes.nameTooLong:
						this.publisherDialogNameError = this.errorsLocale.nameTooLong
						break
					case ErrorCodes.descriptionTooShort:
						if (data.description.length == 0) {
							this.publisherDialogDescriptionError =
								this.errorsLocale.descriptionMissing
						} else {
							this.publisherDialogDescriptionError =
								this.errorsLocale.descriptionTooShort
						}
						break
					case ErrorCodes.descriptionTooLong:
						this.publisherDialogDescriptionError =
							this.errorsLocale.descriptionTooLong
						break
					case ErrorCodes.urlInvalid:
						if (data.url.length == 0) {
							this.publisherDialogUrlError = this.errorsLocale.urlMissing
						} else {
							this.publisherDialogUrlError = this.errorsLocale.urlInvalid
						}
						break
					case ErrorCodes.logoUrlInvalid:
						if (data.logoUrl.length == 0) {
							this.publisherDialogLogoUrlError =
								this.errorsLocale.logoUrlMissing
						} else {
							this.publisherDialogLogoUrlError =
								this.errorsLocale.logoUrlInvalid
						}
						break
					default:
						this.publisherDialogNameError =
							this.errorsLocale.unexpectedError
						break
				}
			}
		}
	}

	navigateToAdminPublisherPage(publisher: PublisherResource) {
		this.router.navigate(["admin", "publisher", publisher.uuid])
	}
}
