import {
	Component,
	Input,
	Output,
	ViewChild,
	ElementRef,
	EventEmitter,
	Inject,
	PLATFORM_ID
} from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { Dialog } from "dav-ui-components"
import { LocalizationService } from "src/app/services/localization-service"

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

	constructor(
		private localizationService: LocalizationService,
		@Inject(PLATFORM_ID) private platformId: object
	) {}

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			document.body.appendChild(this.dialog.nativeElement)
		}
	}

	ngOnDestroy() {
		if (isPlatformBrowser(this.platformId)) {
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
