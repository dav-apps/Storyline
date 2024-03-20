import {
	Component,
	Input,
	Output,
	ViewChild,
	ElementRef,
	EventEmitter
} from "@angular/core"
import { Dialog } from "dav-ui-components"
import { LocalizationService } from "src/app/services/localization-service"
import { isClient } from "src/app/utils"

@Component({
	selector: "storyline-publisher-dialog",
	templateUrl: "./publisher-dialog.component.html"
})
export class PublisherDialogComponent {
	locale = this.localizationService.locale.dialogs.publisherDialog
	actionsLocale = this.localizationService.locale.actions
	@Input() mode: "create" | "update" = "create"
	@Input() loading: boolean = false
	@Input() name: string = ""
	@Input() nameError: string = ""
	@Input() description: string = ""
	@Input() descriptionError: string = ""
	@Input() url: string = ""
	@Input() urlError: string = ""
	@Input() logoUrl: string = ""
	@Input() logoUrlError: string = ""
	@Output() primaryButtonClick = new EventEmitter()
	@ViewChild("dialog") dialog: ElementRef<Dialog>
	visible: boolean = false

	constructor(private localizationService: LocalizationService) {}

	ngAfterViewInit() {
		if (isClient()) {
			document.body.appendChild(this.dialog.nativeElement)
		}
	}

	ngOnDestroy() {
		if (isClient()) {
			document.body.removeChild(this.dialog.nativeElement)
		}
	}

	show() {
		if (this.mode == "create") {
			this.name = ""
			this.description = ""
			this.url = ""
			this.logoUrl = ""
		}

		this.visible = true
	}

	hide() {
		this.visible = false
	}

	nameTextfieldChange(event: Event) {
		this.name = (event as CustomEvent).detail.value
		this.nameError = ""
	}

	descriptionTextareaChange(event: Event) {
		this.description = (event as CustomEvent).detail.value
		this.descriptionError = ""
	}

	urlTextfieldChange(event: Event) {
		this.url = (event as CustomEvent).detail.value
		this.urlError = ""
	}

	logoUrlTextfieldChange(event: Event) {
		this.logoUrl = (event as CustomEvent).detail.value
		this.logoUrlError = ""
	}

	submit() {
		this.primaryButtonClick.emit({
			name: this.name,
			description: this.description,
			url: this.url,
			logoUrl: this.logoUrl
		})
	}
}
