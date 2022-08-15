import { NgModule } from "@angular/core";
import { ButtonModule, InputModule, LinkModule, UIShellModule } from "carbon-components-angular";
import { CoreCarbonIconsModule } from "./carbon-icons.module";

@NgModule({
  imports: [CoreCarbonIconsModule],
  exports: [UIShellModule, CoreCarbonIconsModule, InputModule, ButtonModule, LinkModule],
})
export class CoreCarbonModule {}
