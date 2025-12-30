import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwInputComponent, TwTextareaComponent } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwInputComponent,
    TwTextareaComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './input-demo.component.html',
})
export class InputDemoComponent {
  name = signal('');
  email = signal('');
  bio = signal('');
  password = signal('');

  // Code examples
  basicCode = `<tw-input
  label="Full Name"
  placeholder="Enter your name">
</tw-input>

<tw-input
  label="Email Address"
  type="email"
  placeholder="you@example.com">
</tw-input>`;

  variantsCode = `<tw-input variant="default" label="Default" placeholder="Default variant"></tw-input>
<tw-input variant="filled" label="Filled" placeholder="Filled variant"></tw-input>
<tw-input variant="outlined" label="Outlined" placeholder="Outlined variant"></tw-input>
<tw-input variant="underlined" label="Underlined" placeholder="Underlined variant"></tw-input>`;

  sizesCode = `<tw-input size="sm" label="Small" placeholder="Small input"></tw-input>
<tw-input size="md" label="Medium" placeholder="Medium input"></tw-input>
<tw-input size="lg" label="Large" placeholder="Large input"></tw-input>`;

  hintErrorCode = `<!-- With hint text -->
<tw-input
  label="Username"
  placeholder="Choose a username"
  hint="Must be at least 3 characters long">
</tw-input>

<!-- With error message -->
<tw-input
  label="Email"
  type="email"
  placeholder="Enter email"
  error="Please enter a valid email address">
</tw-input>`;

  statesCode = `<!-- Required field -->
<tw-input
  label="Required Field"
  placeholder="This field is required"
  [required]="true">
</tw-input>

<!-- Disabled field -->
<tw-input
  label="Disabled Field"
  placeholder="This field is disabled"
  [disabled]="true">
</tw-input>

<!-- Readonly field -->
<tw-input
  label="Readonly Field"
  [readonly]="true"
  value="Read-only value">
</tw-input>`;

  clearableCode = `<tw-input
  label="Search"
  placeholder="Type to search..."
  [clearable]="true">
</tw-input>`;

  textareaCode = `<!-- Basic textarea -->
<tw-textarea
  label="Bio"
  placeholder="Tell us about yourself..."
  [rows]="4">
</tw-textarea>

<!-- With character count -->
<tw-textarea
  label="With Character Count"
  placeholder="Limited to 200 characters..."
  [rows]="3"
  [maxlength]="200"
  [showCount]="true">
</tw-textarea>

<!-- Auto-resize -->
<tw-textarea
  label="Auto-resize"
  placeholder="This textarea will grow as you type..."
  [rows]="2"
  [autoResize]="true">
</tw-textarea>`;
}
