import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwAlertComponent, TwAlertTitleComponent, TwAlertDescriptionComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-alert-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwAlertComponent,
    TwAlertTitleComponent,
    TwAlertDescriptionComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './alert-demo.component.html',
})
export class AlertDemoComponent {
  onDismiss(): void {
    console.log('Alert dismissed');
  }

  // Code examples
  variantsCode = `<tw-alert variant="info">Informational message.</tw-alert>
<tw-alert variant="success">Your changes have been saved!</tw-alert>
<tw-alert variant="warning">Please review your input.</tw-alert>
<tw-alert variant="danger">An error occurred.</tw-alert>
<tw-alert variant="neutral">Neutral notification.</tw-alert>`;

  stylesCode = `<tw-alert variant="info" alertStyle="solid">Solid style alert</tw-alert>
<tw-alert variant="info" alertStyle="soft">Soft style alert</tw-alert>
<tw-alert variant="info" alertStyle="outlined">Outlined style alert</tw-alert>
<tw-alert variant="info" alertStyle="accent">Accent style alert</tw-alert>`;

  titleDescCode = `<tw-alert variant="success" alertStyle="soft">
  <tw-alert-title>Success!</tw-alert-title>
  <tw-alert-description>
    Your payment has been processed successfully.
    You will receive a confirmation email shortly.
  </tw-alert-description>
</tw-alert>

<tw-alert variant="danger" alertStyle="accent">
  <tw-alert-title>Error</tw-alert-title>
  <tw-alert-description>
    Unable to connect to the server.
    Please check your internet connection.
  </tw-alert-description>
</tw-alert>`;

  dismissibleCode = `<tw-alert
  variant="info"
  alertStyle="soft"
  [dismissible]="true"
  (dismiss)="onDismiss()">
  Click the X button to dismiss this alert.
</tw-alert>

<tw-alert
  variant="warning"
  alertStyle="soft"
  [dismissible]="true"
  (dismiss)="onDismiss()">
  <tw-alert-title>Heads up!</tw-alert-title>
  <tw-alert-description>
    This alert can be dismissed.
  </tw-alert-description>
</tw-alert>`;

  noIconCode = `<tw-alert variant="info" alertStyle="soft" [showIcon]="false">
  This alert doesn't show an icon.
</tw-alert>

<tw-alert variant="success" alertStyle="accent" [showIcon]="false">
  <tw-alert-title>Note</tw-alert-title>
  <tw-alert-description>
    You can hide the icon for a cleaner look.
  </tw-alert-description>
</tw-alert>`;
}
