# TwMultiSelectComponent

A multi-select dropdown component with support for grouped options, filtering, and flexible configuration.

## Features

- ✅ Multiple selection with checkboxes
- ✅ Grouped options for visual organization
- ✅ Search/filter functionality
- ✅ Select all / clear all options
- ✅ Maximum selections limit
- ✅ Keyboard navigation
- ✅ Reactive forms integration (ControlValueAccessor)
- ✅ Append to body or self
- ✅ Fully customizable with Tailwind CSS

## Basic Usage

### Flat Options List

```typescript
import { TwMultiSelectComponent, MultiSelectOption } from 'ngx-tailwindcss';

@Component({
  imports: [TwMultiSelectComponent],
  template: `
    <tw-multiselect
      [options]="options"
      [(ngModel)]="selected"
      placeholder="Select fruits"
      label="Choose your fruits">
    </tw-multiselect>
  `
})
export class MyComponent {
  options: MultiSelectOption[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' }
  ];

  selected: unknown[] = [];
}
```

### Grouped Options

```typescript
import { TwMultiSelectComponent, MultiSelectGroup } from 'ngx-tailwindcss';

@Component({
  imports: [TwMultiSelectComponent],
  template: `
    <tw-multiselect
      [groups]="groups"
      [(ngModel)]="selected"
      [filter]="true"
      placeholder="Select countries"
      label="Choose countries">
    </tw-multiselect>
  `
})
export class MyComponent {
  groups: MultiSelectGroup[] = [
    {
      label: 'North America',
      options: [
        { label: 'United States', value: 'us', icon: '🇺🇸' },
        { label: 'Canada', value: 'ca', icon: '🇨🇦' },
        { label: 'Mexico', value: 'mx', icon: '🇲🇽' }
      ]
    },
    {
      label: 'Europe',
      options: [
        { label: 'United Kingdom', value: 'uk', icon: '🇬🇧' },
        { label: 'France', value: 'fr', icon: '🇫🇷' },
        { label: 'Germany', value: 'de', icon: '🇩🇪' },
        { label: 'Spain', value: 'es', icon: '🇪🇸' }
      ]
    },
    {
      label: 'Asia',
      options: [
        { label: 'Japan', value: 'jp', icon: '🇯🇵' },
        { label: 'China', value: 'cn', icon: '🇨🇳' },
        { label: 'India', value: 'in', icon: '🇮🇳' }
      ]
    }
  ];

  selected: unknown[] = [];
}
```

## With Reactive Forms

```typescript
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TwMultiSelectComponent } from 'ngx-tailwindcss';

@Component({
  imports: [ReactiveFormsModule, TwMultiSelectComponent],
  template: `
    <form [formGroup]="form">
      <tw-multiselect
        formControlName="skills"
        [groups]="skillGroups"
        [filter]="true"
        [showSelectAll]="true"
        label="Skills"
        placeholder="Select your skills">
      </tw-multiselect>
    </form>
  `
})
export class MyComponent {
  form = this.fb.group({
    skills: [[]]
  });

  skillGroups: MultiSelectGroup[] = [
    {
      label: 'Frontend',
      options: [
        { label: 'Angular', value: 'angular' },
        { label: 'React', value: 'react' },
        { label: 'Vue', value: 'vue' }
      ]
    },
    {
      label: 'Backend',
      options: [
        { label: 'Node.js', value: 'nodejs' },
        { label: 'Python', value: 'python' },
        { label: 'Java', value: 'java' }
      ]
    }
  ];

  constructor(private fb: FormBuilder) {}
}
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `options` | `MultiSelectOption[]` | `[]` | Flat list of options |
| `groups` | `MultiSelectGroup[]` | `[]` | Grouped options (takes precedence over `options`) |
| `placeholder` | `string` | `'Select options'` | Placeholder text |
| `label` | `string` | `''` | Label text |
| `filter` | `boolean` | `false` | Enable search/filter |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `variant` | `'default' \| 'filled'` | `'default'` | Visual variant |
| `appendTo` | `'body' \| 'self'` | `'self'` | Panel layering mode. `'body'` renders a fixed-position layer (escapes overflow) rather than reparenting to body |
| `disabled` | `boolean` | `false` | Disabled state |
| `showCheckbox` | `boolean` | `true` | Show checkboxes |
| `showSelectAll` | `boolean` | `true` | Show select all option |
| `maxSelections` | `number` | `0` | Max selections (0 = unlimited) |
| `dropdownClass` | `string` | `''` | Custom dropdown class |
| `triggerClass` | `string` | `''` | Custom trigger class |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `selectionChange` | `EventEmitter<unknown[]>` | Emitted when selection changes |

## Interfaces

### MultiSelectOption

```typescript
interface MultiSelectOption {
  label: string;
  value: unknown;
  disabled?: boolean;
  icon?: string;
}
```

### MultiSelectGroup

```typescript
interface MultiSelectGroup {
  label: string;
  options: MultiSelectOption[];
}
```

## Advanced Examples

### With Maximum Selections

```typescript
<tw-multiselect
  [options]="options"
  [(ngModel)]="selected"
  [maxSelections]="3"
  label="Choose up to 3 items">
</tw-multiselect>
```

Note: the Select All row is hidden when `maxSelections` is lower than the number of
enabled options, since selecting everything would be impossible.

### Escaping Overflow Contexts

`appendTo="body"` keeps the panel in place in the DOM but renders it as a
fixed-position layer that tracks the trigger on scroll and resize, so it can escape
`overflow: hidden`/`overflow: auto` ancestors. The panel is not reparented to
`document.body`.

```typescript
<tw-multiselect
  [options]="options"
  [(ngModel)]="selected"
  appendTo="body">
</tw-multiselect>
```

### Custom Styling

```typescript
<tw-multiselect
  [options]="options"
  [(ngModel)]="selected"
  triggerClass="border-2 border-purple-500"
  dropdownClass="shadow-2xl">
</tw-multiselect>
```

### Without Select All

```typescript
<tw-multiselect
  [options]="options"
  [(ngModel)]="selected"
  [showSelectAll]="false">
</tw-multiselect>
```

## Comparison with TwSelectComponent

Both `TwSelectComponent` and `TwMultiSelectComponent` now support grouped options!

### TwSelectComponent (Single Selection)

```typescript
<tw-select
  [groups]="groups"
  [(ngModel)]="selected"
  placeholder="Select one country">
</tw-select>
```

### TwMultiSelectComponent (Multiple Selection)

```typescript
<tw-multiselect
  [groups]="groups"
  [(ngModel)]="selected"
  placeholder="Select multiple countries">
</tw-multiselect>
```

## Accessibility

- Listbox pattern: `role="listbox"` with `aria-multiselectable`, `role="option"` rows
  with `aria-selected`/`aria-disabled`, and `aria-activedescendant` on the trigger
- Keyboard navigation: ArrowUp/ArrowDown move the active option, Home/End jump to the
  first/last enabled option, Enter/Space toggles the active option
- ESC key closes the dropdown and returns focus to the trigger
- The filter input is focused automatically when the dropdown opens (when `filter` is enabled)

## Styling

The component uses Tailwind CSS classes and can be customized using the `triggerClass` and `dropdownClass` inputs, or by modifying the component's template directly.

