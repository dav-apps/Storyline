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
	selector: "storyline-create-feed-dialog",
	templateUrl: "./create-feed-dialog.component.html"
})
export class CreateFeedDialogComponent {
	locale = this.localizationService.locale.dialogs.createFeedDialog
	actionsLocale = this.localizationService.locale.actions
	@Input() loading: boolean = false
	@Input() urlError: string = ""
	@Output() primaryButtonClick = new EventEmitter()
	@ViewChild("dialog") dialog: ElementRef<Dialog>
	visible: boolean = false
	url: string = ""

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
		this.url = ""
		this.visible = true
	}

	hide() {
		this.visible = false
	}

	urlTextfieldChange(event: Event) {
		this.url = (event as CustomEvent).detail.value
	}

	submit() {
		this.primaryButtonClick.emit({
			url: this.url
		})
	}
}
