import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwAccordionComponent, TwAccordionItemComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-accordion-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwAccordionComponent,
    TwAccordionItemComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './accordion-demo.component.html',
})
export class AccordionDemoComponent {
  basicCode = `<tw-accordion>
  <tw-accordion-item itemTitle="Section 1">
    Content for section 1
  </tw-accordion-item>
  <tw-accordion-item itemTitle="Section 2">
    Content for section 2
  </tw-accordion-item>
</tw-accordion>`;

  multipleCode = `<tw-accordion [allowMultiple]="true">
  <tw-accordion-item itemTitle="Section 1" [open]="true">...</tw-accordion-item>
  <tw-accordion-item itemTitle="Section 2" [open]="true">...</tw-accordion-item>
</tw-accordion>`;

  variantsCode = `<tw-accordion variant="default">...</tw-accordion>
<tw-accordion variant="bordered">...</tw-accordion>
<tw-accordion variant="separated">...</tw-accordion>`;
}
