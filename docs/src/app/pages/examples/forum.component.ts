import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faSearch,
  faBell,
  faPlus,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  TwButtonComponent,
  TwCardComponent,
  TwInputComponent,
  TwBadgeComponent,
  TwAvatarComponent,
  TwModalComponent,
  TwToastService,
  TwDividerComponent,
  TwAlertComponent,
  TwPaginationComponent,
  TwSelectComponent,
  SelectOption,
} from '@pegasusheavy/ngx-tailwindcss';
import { ThemeToggleComponent } from '../../components/theme-toggle.component';

interface User {
  id: number;
  username: string;
  avatar: string;
  reputation: number;
  role: 'admin' | 'moderator' | 'member';
  joinDate: string;
  posts: number;
  badges: string[];
}

interface Thread {
  id: number;
  title: string;
  author: User;
  category: string;
  content: string;
  views: number;
  replies: number;
  likes: number;
  isPinned: boolean;
  isLocked: boolean;
  isSolved: boolean;
  tags: string[];
  createdAt: string;
  lastActivity: string;
}

interface Reply {
  id: number;
  author: User;
  content: string;
  likes: number;
  isAccepted: boolean;
  createdAt: string;
  edited?: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  threads: number;
  posts: number;
  color: string;
}

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FontAwesomeModule,
    TwButtonComponent,
    TwCardComponent,
    TwInputComponent,
    TwBadgeComponent,
    TwAvatarComponent,
    TwModalComponent,
    TwDividerComponent,
    TwAlertComponent,
    TwPaginationComponent,
    TwSelectComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './forum.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #fafafa;
    }
  `],
})
export class ForumComponent {
  protected icons = {
    arrowLeft: faArrowLeft,
    search: faSearch,
    bell: faBell,
    plus: faPlus,
    chevronRight: faChevronRight,
  };

  protected currentView = signal<'categories' | 'threads' | 'thread'>('categories');
  protected selectedCategory = signal<string | null>(null);
  protected selectedThread = signal<Thread | null>(null);
  protected newThreadModalOpen = signal(false);
  protected searchQuery = signal('');
  protected sortBy = signal('latest');
  protected currentPage = signal(1);
  protected itemsPerPage = 10;

  // New thread form
  protected newThreadTitle = signal('');
  protected newThreadContent = signal('');
  protected newThreadCategory = signal('general');
  protected newThreadTags = signal('');

  // Reply form
  protected replyContent = signal('');
  protected loading = signal(false);

  protected currentUser: User = {
    id: 1,
    username: 'johndoe',
    avatar: 'JD',
    reputation: 1250,
    role: 'member',
    joinDate: '2023-01-15',
    posts: 142,
    badges: ['🏆', '🌟', '💡'],
  };

  protected categories: Category[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'Talk about anything and everything',
      icon: '💬',
      threads: 1234,
      posts: 8567,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'help',
      name: 'Help & Support',
      description: 'Get help from the community',
      icon: '🆘',
      threads: 567,
      posts: 3421,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'announcements',
      name: 'Announcements',
      description: 'Official news and updates',
      icon: '📢',
      threads: 45,
      posts: 678,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'showcase',
      name: 'Show & Tell',
      description: 'Share your projects and creations',
      icon: '🎨',
      threads: 789,
      posts: 4321,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'bugs',
      name: 'Bug Reports',
      description: 'Report issues and bugs',
      icon: '🐛',
      threads: 234,
      posts: 1567,
      color: 'from-red-500 to-rose-500',
    },
    {
      id: 'feedback',
      name: 'Feature Requests',
      description: 'Suggest new features',
      icon: '💡',
      threads: 456,
      posts: 2345,
      color: 'from-yellow-500 to-amber-500',
    },
  ];

  protected threads: Thread[] = [
    {
      id: 1,
      title: 'Welcome to the Community Forum!',
      author: {
        id: 100,
        username: 'admin',
        avatar: 'AD',
        reputation: 5000,
        role: 'admin',
        joinDate: '2020-01-01',
        posts: 1234,
        badges: ['👑', '🏆', '⭐'],
      },
      category: 'announcements',
      content: 'Welcome everyone! Read our community guidelines and introduce yourself.',
      views: 2543,
      replies: 45,
      likes: 128,
      isPinned: true,
      isLocked: false,
      isSolved: false,
      tags: ['welcome', 'introduction'],
      createdAt: '2024-01-01',
      lastActivity: '2024-12-15',
    },
    {
      id: 2,
      title: 'How to integrate OAuth authentication?',
      author: {
        id: 2,
        username: 'devuser',
        avatar: 'DU',
        reputation: 450,
        role: 'member',
        joinDate: '2023-06-10',
        posts: 34,
        badges: ['💻'],
      },
      category: 'help',
      content: 'I need help setting up OAuth 2.0 with Google. Any tutorials?',
      views: 876,
      replies: 12,
      likes: 23,
      isPinned: false,
      isLocked: false,
      isSolved: true,
      tags: ['oauth', 'authentication', 'help'],
      createdAt: '2024-12-10',
      lastActivity: '2024-12-14',
    },
    {
      id: 3,
      title: 'My latest project: AI-powered chat bot',
      author: {
        id: 3,
        username: 'aibuilder',
        avatar: 'AB',
        reputation: 890,
        role: 'member',
        joinDate: '2023-03-20',
        posts: 67,
        badges: ['🤖', '🌟'],
      },
      category: 'showcase',
      content: 'Built an AI chatbot using GPT-4. Check out the demo!',
      views: 1234,
      replies: 34,
      likes: 89,
      isPinned: false,
      isLocked: false,
      isSolved: false,
      tags: ['ai', 'chatbot', 'showcase'],
      createdAt: '2024-12-12',
      lastActivity: '2024-12-15',
    },
  ];

  protected replies: Reply[] = [
    {
      id: 1,
      author: {
        id: 4,
        username: 'helper',
        avatar: 'HP',
        reputation: 2340,
        role: 'moderator',
        joinDate: '2021-05-15',
        posts: 456,
        badges: ['🛡️', '💡', '🌟'],
      },
      content: 'You can use Passport.js for OAuth integration. Here\'s a quick example...',
      likes: 15,
      isAccepted: true,
      createdAt: '2024-12-11',
    },
    {
      id: 2,
      author: {
        id: 5,
        username: 'coder123',
        avatar: 'C1',
        reputation: 678,
        role: 'member',
        joinDate: '2022-08-20',
        posts: 89,
        badges: ['💻'],
      },
      content: 'I had the same issue. Make sure your redirect URI is correctly configured.',
      likes: 8,
      isAccepted: false,
      createdAt: '2024-12-12',
      edited: true,
    },
  ];

  protected sortOptions: SelectOption[] = [
    { label: 'Latest Activity', value: 'latest' },
    { label: 'Most Replies', value: 'replies' },
    { label: 'Most Likes', value: 'likes' },
    { label: 'Most Views', value: 'views' },
    { label: 'Oldest First', value: 'oldest' },
  ];

  protected stats = [
    { label: 'Total Threads', value: '3,325' },
    { label: 'Total Posts', value: '21,899' },
    { label: 'Active Members', value: '8,542' },
    { label: 'Online Now', value: '234' },
  ];

  protected filteredThreads = computed(() => {
    let filtered = this.threads;

    // Filter by category
    const category = this.selectedCategory();
    if (category) {
      filtered = filtered.filter(t => t.category === category);
    }

    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.content.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    const sort = this.sortBy();
    switch (sort) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
        break;
      case 'replies':
        filtered.sort((a, b) => b.replies - a.replies);
        break;
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
    }

    return filtered;
  });

  protected totalPages = computed(() => {
    return Math.ceil(this.filteredThreads().length / this.itemsPerPage);
  });

  protected paginatedThreads = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredThreads().slice(start, start + this.itemsPerPage);
  });

  constructor(private toastService: TwToastService) {}

  protected selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.currentView.set('threads');
    this.currentPage.set(1);
  }

  protected backToCategories(): void {
    this.currentView.set('categories');
    this.selectedCategory.set(null);
  }

  protected viewThread(thread: Thread): void {
    this.selectedThread.set(thread);
    this.currentView.set('thread');
    thread.views++;
  }

  protected backToThreads(): void {
    this.currentView.set('threads');
    this.selectedThread.set(null);
  }

  protected openNewThread(): void {
    this.newThreadModalOpen.set(true);
  }

  protected closeNewThread(): void {
    this.newThreadModalOpen.set(false);
    this.newThreadTitle.set('');
    this.newThreadContent.set('');
    this.newThreadTags.set('');
  }

  protected submitNewThread(): void {
    if (!this.newThreadTitle() || !this.newThreadContent()) {
      this.toastService.warning('Please fill in all fields', 'Incomplete');
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
      this.toastService.success('Thread created successfully!', 'Success');
      this.closeNewThread();
    }, 1000);
  }

  protected submitReply(): void {
    if (!this.replyContent()) {
      this.toastService.warning('Please enter a reply', 'Empty Reply');
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
      this.toastService.success('Reply posted!', 'Success');
      this.replyContent.set('');

      const thread = this.selectedThread();
      if (thread) {
        thread.replies++;
      }
    }, 1000);
  }

  protected likeThread(thread: Thread): void {
    thread.likes++;
    this.toastService.success('Liked!', 'Success');
  }

  protected likeReply(reply: Reply): void {
    reply.likes++;
    this.toastService.success('Liked!', 'Success');
  }

  protected getRoleBadgeVariant(role: string): 'success' | 'warning' | 'danger' | 'primary' {
    switch (role) {
      case 'admin': return 'danger';
      case 'moderator': return 'warning';
      default: return 'primary';
    }
  }

  protected getCategoryName(categoryId: string): string {
    return this.categories.find(c => c.id === categoryId)?.name || categoryId;
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
