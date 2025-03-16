import {
	Component,
	ViewChild,
	ElementRef,
	Output,
	EventEmitter,
	Inject,
	PLATFORM_ID
} from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { Dialog } from "dav-ui-components"
import { LocalizationService } from "src/app/services/localization-service"

@Component({
	selector: "storyline-login-prompt-dialog",
	templateUrl: "./login-prompt-dialog.component.html",
	styleUrl: "./login-prompt-dialog.component.scss"
})
export class LoginPromptDialogComponent {
	locale = this.localizationService.locale.dialogs.loginPromptDialog
	actionsLocale = this.localizationService.locale.actions
	@Output() primaryButtonClick = new EventEmitter()
	@ViewChild("dialog") dialog: ElementRef<Dialog>
	visible: boolean = false

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
		this.visible = true
	}

	hide() {
		this.visible = false
	}
}
