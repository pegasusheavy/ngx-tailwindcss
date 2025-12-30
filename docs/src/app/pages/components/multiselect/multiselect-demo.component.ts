import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TwMultiSelectComponent, MultiSelectGroup } from '@pegasusheavy/ngx-tailwindcss';
import { DemoSectionComponent, PageHeaderComponent } from '../../../shared/demo-section.component';

@Component({
  selector: 'app-multiselect-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TwMultiSelectComponent,
    DemoSectionComponent,
    PageHeaderComponent,
  ],
  templateUrl: './multiselect-demo.component.html',
})
export class MultiselectDemoComponent {
  // Basic selection
  selectedFruits = signal<string[]>([]);

  // Grouped selection
  selectedCountries = signal<string[]>([]);

  // With filter
  selectedTechnologies = signal<string[]>([]);

  // Max selections
  selectedColors = signal<string[]>([]);

  fruits = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' },
    { label: 'Grape', value: 'grape' },
    { label: 'Mango', value: 'mango' },
    { label: 'Strawberry', value: 'strawberry' },
  ];

  countryGroups: MultiSelectGroup[] = [
    {
      label: 'North America',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
        { label: 'Mexico', value: 'mx' },
      ],
    },
    {
      label: 'Europe',
      options: [
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Germany', value: 'de' },
        { label: 'France', value: 'fr' },
        { label: 'Spain', value: 'es' },
      ],
    },
    {
      label: 'Asia',
      options: [
        { label: 'Japan', value: 'jp' },
        { label: 'South Korea', value: 'kr' },
        { label: 'China', value: 'cn' },
      ],
    },
  ];

  technologies = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Next.js', value: 'nextjs' },
    { label: 'Nuxt', value: 'nuxt' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Python', value: 'python' },
  ];

  colors = [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Purple', value: 'purple' },
    { label: 'Orange', value: 'orange' },
  ];

  disabledOptions = [
    { label: 'Available Option 1', value: 'opt1' },
    { label: 'Available Option 2', value: 'opt2' },
    { label: 'Unavailable Option', value: 'opt3', disabled: true },
    { label: 'Available Option 3', value: 'opt4' },
  ];

  // Code examples
  basicCode = `// Options array
fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
];

// In template
<tw-multiselect
  [options]="fruits"
  [(ngModel)]="selectedFruits"
  placeholder="Select fruits">
</tw-multiselect>`;

  groupedCode = `// Grouped options
countryGroups: MultiSelectGroup[] = [
  {
    label: 'North America',
    options: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
    ],
  },
  {
    label: 'Europe',
    options: [
      { label: 'United Kingdom', value: 'uk' },
      { label: 'Germany', value: 'de' },
    ],
  },
];

<tw-multiselect
  [groups]="countryGroups"
  [(ngModel)]="selectedCountries"
  placeholder="Select countries">
</tw-multiselect>`;

  filterCode = `<tw-multiselect
  [options]="technologies"
  [(ngModel)]="selectedTechnologies"
  [filter]="true"
  placeholder="Search technologies...">
</tw-multiselect>`;

  maxSelectionsCode = `<tw-multiselect
  [options]="colors"
  [(ngModel)]="selectedColors"
  [maxSelections]="3"
  placeholder="Select up to 3 colors">
</tw-multiselect>`;

  sizesCode = `<tw-multiselect size="sm" [options]="options"></tw-multiselect>
<tw-multiselect size="md" [options]="options"></tw-multiselect>
<tw-multiselect size="lg" [options]="options"></tw-multiselect>`;

  variantsCode = `<tw-multiselect variant="default" [options]="options"></tw-multiselect>
<tw-multiselect variant="filled" [options]="options"></tw-multiselect>`;

  statesCode = `// Disabled
<tw-multiselect [disabled]="true" [options]="options"></tw-multiselect>

// With disabled options
<tw-multiselect [options]="[
  { label: 'Available', value: 'a' },
  { label: 'Disabled', value: 'b', disabled: true },
]"></tw-multiselect>`;
}

