import { Component, ViewChild } from "@angular/core"
import { Router } from "@angular/router"
import { CreatePublisherDialogComponent } from "src/app/dialogs/create-publisher-dialog/create-publisher-dialog.component"
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
	publishers: PublisherResource[] = []
	limit: number = 10
	offset: number = 0

	//#region CreatePublisherDialog
	@ViewChild("createPublisherDialog")
	createPublisherDialog: CreatePublisherDialogComponent
	createPublisherDialogLoading: boolean = false
	createPublisherDialogNameError: string = ""
	createPublisherDialogDescriptionError: string = ""
	createPublisherDialogUrlError: string = ""
	createPublisherDialogLogoUrlError: string = ""
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

	showCreatePublisherDialog() {
		this.createPublisherDialog.show()
	}

	async createPublisher(data: {
		name: string
		description: string
		url: string
		logoUrl: string
	}) {
		this.createPublisherDialogNameError = ""
		this.createPublisherDialogDescriptionError = ""
		this.createPublisherDialogUrlError = ""
		this.createPublisherDialogLogoUrlError = ""
		this.createPublisherDialogLoading = true

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

		this.createPublisherDialogLoading = false

		if (response.errors == null) {
			let responseData = response.data.createPublisher

			this.publishers.push(responseData)
			this.navigateToAdminPublisherPage(responseData)
		} else {
			console.log(response.errors)
			let errors = response.errors[0].extensions["errors"] as string[]

			for (let errorCode of errors) {
				switch (errorCode) {
					case ErrorCodes.nameTooShort:
						if (data.name.length == 0) {
							this.createPublisherDialogNameError =
								this.locale.errors.nameMissing
						} else {
							this.createPublisherDialogNameError =
								this.locale.errors.nameTooShort
						}
						break
					case ErrorCodes.nameTooLong:
						this.createPublisherDialogNameError =
							this.locale.errors.nameTooLong
						break
					case ErrorCodes.descriptionTooShort:
						if (data.description.length == 0) {
							this.createPublisherDialogDescriptionError =
								this.locale.errors.descriptionMissing
						} else {
							this.createPublisherDialogDescriptionError =
								this.locale.errors.descriptionTooShort
						}
						break
					case ErrorCodes.descriptionTooLong:
						this.createPublisherDialogDescriptionError =
							this.locale.errors.descriptionTooLong
						break
					case ErrorCodes.urlInvalid:
						if (data.url.length == 0) {
							this.createPublisherDialogUrlError =
								this.locale.errors.urlMissing
						} else {
							this.createPublisherDialogUrlError =
								this.locale.errors.urlInvalid
						}
						break
					case ErrorCodes.logoUrlInvalid:
						if (data.logoUrl.length == 0) {
							this.createPublisherDialogLogoUrlError =
								this.locale.errors.logoUrlMissing
						} else {
							this.createPublisherDialogLogoUrlError =
								this.locale.errors.logoUrlInvalid
						}
						break
					default:
						this.createPublisherDialogNameError =
							this.locale.errors.unexpectedError
						break
				}
			}
		}
	}

	navigateToAdminPublisherPage(publisher: PublisherResource) {
		this.router.navigate(["admin", "publisher", publisher.uuid])
	}
}
