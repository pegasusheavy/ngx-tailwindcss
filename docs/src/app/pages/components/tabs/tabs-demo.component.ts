import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwTabsComponent, TwTabPanelComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-tabs-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwTabsComponent,
    TwTabPanelComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './tabs-demo.component.html',
})
export class TabsDemoComponent {
  activeTab = signal('tab1');

  // Code examples
  basicCode = `// In your component
activeTab = signal('tab1');

// In your template
<tw-tabs [(value)]="activeTab" variant="line">
  <tw-tab-panel value="tab1" label="Overview">
    <p>This is the overview tab content.</p>
  </tw-tab-panel>
  <tw-tab-panel value="tab2" label="Features">
    <p>This is the features tab content.</p>
  </tw-tab-panel>
  <tw-tab-panel value="tab3" label="Pricing">
    <p>This is the pricing tab content.</p>
  </tw-tab-panel>
</tw-tabs>`;

  variantsCode = `<!-- Line Style -->
<tw-tabs variant="line">
  <tw-tab-panel value="t1" label="Tab 1">Content 1</tw-tab-panel>
  <tw-tab-panel value="t2" label="Tab 2">Content 2</tw-tab-panel>
</tw-tabs>

<!-- Enclosed Style -->
<tw-tabs variant="enclosed">
  <tw-tab-panel value="t1" label="Tab 1">Content 1</tw-tab-panel>
  <tw-tab-panel value="t2" label="Tab 2">Content 2</tw-tab-panel>
</tw-tabs>

<!-- Pills Style -->
<tw-tabs variant="pills">
  <tw-tab-panel value="t1" label="Tab 1">Content 1</tw-tab-panel>
  <tw-tab-panel value="t2" label="Tab 2">Content 2</tw-tab-panel>
</tw-tabs>

<!-- Soft Rounded Style -->
<tw-tabs variant="soft-rounded">
  <tw-tab-panel value="t1" label="Tab 1">Content 1</tw-tab-panel>
  <tw-tab-panel value="t2" label="Tab 2">Content 2</tw-tab-panel>
</tw-tabs>`;

  disabledCode = `<tw-tabs variant="line">
  <tw-tab-panel value="active1" label="Active Tab">
    This tab is active and clickable.
  </tw-tab-panel>
  <tw-tab-panel value="active2" label="Another Tab">
    This tab is also active.
  </tw-tab-panel>
  <tw-tab-panel value="disabled" label="Disabled" [disabled]="true">
    This content won't be shown.
  </tw-tab-panel>
</tw-tabs>`;

  fullWidthCode = `<tw-tabs variant="soft-rounded" [fullWidth]="true">
  <tw-tab-panel value="fw1" label="First">
    First tab content with full width tabs.
  </tw-tab-panel>
  <tw-tab-panel value="fw2" label="Second">
    Second tab content with full width tabs.
  </tw-tab-panel>
  <tw-tab-panel value="fw3" label="Third">
    Third tab content with full width tabs.
  </tw-tab-panel>
</tw-tabs>`;
}
