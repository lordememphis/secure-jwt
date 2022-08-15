import { NgModule } from "@angular/core";
import { ExitModule, RenewModule } from "@carbon/icons-angular";
import { IconModule } from "carbon-components-angular";

@NgModule({ exports: [IconModule, ExitModule, RenewModule] })
export class CoreCarbonIconsModule {}
