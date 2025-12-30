import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBolt,
  faArrowLeft,
  faLayerGroup,
  faUsers,
  faChartBar,
  faCreditCard,
  faCog,
  faSignOutAlt,
  faSearch,
  faBell,
  faPlus,
  faEdit,
  faTrash,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import {
  TwButtonComponent,
  TwInputComponent,
  TwSelectComponent,
  SelectOption,
  MultiSelectGroup,
  TwAvatarComponent,
  TwModalComponent,
  TwToastService,
  TwPaginationComponent,
  TwAlertComponent,
  TwSpinnerComponent,
  TwDropdownComponent,
  TwDropdownMenuComponent,
  TwDropdownItemDirective,
  TwDropdownDividerComponent,
} from '@pegasusheavy/ngx-tailwindcss';
import { ThemeToggleComponent } from '../../components/theme-toggle.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  avatar: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FontAwesomeModule,
    TwButtonComponent,
    TwInputComponent,
    TwSelectComponent,
    TwAvatarComponent,
    TwModalComponent,
    TwPaginationComponent,
    TwAlertComponent,
    TwSpinnerComponent,
    TwDropdownComponent,
    TwDropdownMenuComponent,
    TwDropdownItemDirective,
    TwDropdownDividerComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f8fafc;
    }
  `],
})
export class AdminDashboardComponent {
  protected icons = {
    bolt: faBolt,
    arrowLeft: faArrowLeft,
    layerGroup: faLayerGroup,
    users: faUsers,
    chartBar: faChartBar,
    creditCard: faCreditCard,
    cog: faCog,
    signOutAlt: faSignOutAlt,
    search: faSearch,
    bell: faBell,
    plus: faPlus,
    edit: faEdit,
    trash: faTrash,
    camera: faCamera,
  };

  protected sidebarOpen = signal(true);
  protected currentTab = signal('users');
  protected searchQuery = signal('');
  protected selectedRole = signal('all');
  protected selectedStatuses = signal<string[]>([]);
  protected currentPage = signal(1);
  protected itemsPerPage = 10;
  protected userModalOpen = signal(false);
  protected loading = signal(false);

  protected roleOptions: SelectOption[] = [
    { label: 'All Roles', value: 'all' },
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ];

  protected statusGroups: MultiSelectGroup[] = [
    {
      label: 'Active States',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Pending', value: 'pending' },
      ],
    },
    {
      label: 'Inactive States',
      options: [
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
  ];

  protected users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', lastActive: '2 min ago', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor', status: 'active', lastActive: '1 hour ago', avatar: 'JS' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'viewer', status: 'inactive', lastActive: '2 days ago', avatar: 'BJ' },
    { id: 4, name: 'Alice Wong', email: 'alice@example.com', role: 'editor', status: 'active', lastActive: '30 min ago', avatar: 'AW' },
    { id: 5, name: 'Mike Kim', email: 'mike@example.com', role: 'viewer', status: 'pending', lastActive: '1 week ago', avatar: 'MK' },
    { id: 6, name: 'Sarah Davis', email: 'sarah@example.com', role: 'admin', status: 'active', lastActive: '5 min ago', avatar: 'SD' },
    { id: 7, name: 'Tom Wilson', email: 'tom@example.com', role: 'editor', status: 'active', lastActive: '45 min ago', avatar: 'TW' },
    { id: 8, name: 'Emily Chen', email: 'emily@example.com', role: 'viewer', status: 'inactive', lastActive: '3 days ago', avatar: 'EC' },
  ];

  protected stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', positive: true, progress: 72 },
    { label: 'Active Sessions', value: '456', change: '+8%', positive: true, progress: 58 },
    { label: 'Revenue', value: '$12.5K', change: '-3%', positive: false, progress: 85 },
    { label: 'Support Tickets', value: '89', change: '+5%', positive: true, progress: 34 },
  ];

  protected statusOptions: SelectOption[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ];

  protected chartData = [45, 62, 38, 75, 55, 82, 48, 91, 67, 78, 56, 88];

  protected recentActivity = [
    { id: 1, avatar: 'JD', action: 'John Doe updated profile', time: '2 minutes ago' },
    { id: 2, avatar: 'JS', action: 'Jane Smith created new project', time: '15 minutes ago' },
    { id: 3, avatar: 'BJ', action: 'Bob Johnson deleted a file', time: '1 hour ago' },
    { id: 4, avatar: 'AW', action: 'Alice Wong invited a member', time: '3 hours ago' },
    { id: 5, avatar: 'MK', action: 'Mike Kim changed settings', time: '5 hours ago' },
  ];

  protected notifications = [
    { id: 1, title: 'New user registered', message: 'John Doe just signed up', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment received', message: 'Invoice #1234 has been paid', time: '1 hour ago', unread: true },
    { id: 3, title: 'Server alert', message: 'CPU usage exceeded 80%', time: '3 hours ago', unread: false },
    { id: 4, title: 'Report ready', message: 'Monthly analytics report is ready', time: '1 day ago', unread: false },
  ];

  protected filteredUsers = computed(() => {
    let filtered = this.users;

    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        u =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    const role = this.selectedRole();
    if (role !== 'all') {
      filtered = filtered.filter(u => u.role === role);
    }

    const statuses = this.selectedStatuses();
    if (statuses.length > 0) {
      filtered = filtered.filter(u => statuses.includes(u.status));
    }

    return filtered;
  });

  protected totalPages = computed(() => {
    return Math.ceil(this.filteredUsers().length / this.itemsPerPage);
  });

  protected paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredUsers().slice(start, start + this.itemsPerPage);
  });

  constructor(private toastService: TwToastService) {}

  protected toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  protected openUserModal(): void {
    this.userModalOpen.set(true);
  }

  protected closeUserModal(): void {
    this.userModalOpen.set(false);
  }

  protected saveUser(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.toastService.success('User saved successfully!', 'Success');
      this.closeUserModal();
    }, 1000);
  }

  protected deleteUser(user: User): void {
    if (confirm(`Delete user ${user.name}?`)) {
      this.toastService.success('User deleted successfully!', 'Success');
    }
  }

  protected getStatusVariant(
    status: string
  ): 'success' | 'warning' | 'danger' | 'primary' {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'danger';
      default:
        return 'primary';
    }
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}

