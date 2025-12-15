import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwAvatarComponent, TwAvatarGroupComponent } from '@pegasus-heavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-avatar-demo',
  standalone: true,
  imports: [
    CommonModule,
    TwAvatarComponent,
    TwAvatarGroupComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './avatar-demo.component.html',
})
export class AvatarDemoComponent {
  basicCode = `<tw-avatar src="https://i.pravatar.cc/150?img=1" alt="User"></tw-avatar>
<tw-avatar initials="JD"></tw-avatar>
<tw-avatar icon="user"></tw-avatar>`;

  sizesCode = `<tw-avatar size="xs" src="..."></tw-avatar>
<tw-avatar size="sm" src="..."></tw-avatar>
<tw-avatar size="md" src="..."></tw-avatar>
<tw-avatar size="lg" src="..."></tw-avatar>
<tw-avatar size="xl" src="..."></tw-avatar>`;

  shapesCode = `<tw-avatar shape="circle" src="..."></tw-avatar>
<tw-avatar shape="square" src="..."></tw-avatar>
<tw-avatar shape="rounded" src="..."></tw-avatar>`;

  statusCode = `<tw-avatar status="online" src="..."></tw-avatar>
<tw-avatar status="offline" src="..."></tw-avatar>
<tw-avatar status="away" src="..."></tw-avatar>
<tw-avatar status="busy" src="..."></tw-avatar>`;

  groupCode = `<tw-avatar-group [max]="4">
  <tw-avatar src="..."></tw-avatar>
  <tw-avatar src="..."></tw-avatar>
  <tw-avatar src="..."></tw-avatar>
  <tw-avatar src="..."></tw-avatar>
  <tw-avatar src="..."></tw-avatar>
</tw-avatar-group>`;
}

