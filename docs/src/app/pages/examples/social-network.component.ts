import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faSearch,
  faHome,
  faBell,
  faComment,
  faBookmark,
  faUsers,
  faCalendar,
  faVideo,
  faImage,
  faSmile,
  faEllipsisV,
  faHeart,
  faShareAlt,
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
  TwChipComponent,
} from '@pegasusheavy/ngx-tailwindcss';
import { ThemeToggleComponent } from '../../components/theme-toggle.component';

interface User {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  verified: boolean;
  location?: string;
  website?: string;
  joinedDate: string;
}

interface Post {
  id: number;
  author: User;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked: boolean;
  bookmarked: boolean;
  hashtags: string[];
}

interface Comment {
  id: number;
  author: User;
  content: string;
  likes: number;
  timestamp: string;
  liked: boolean;
}

interface Story {
  id: number;
  author: User;
  imageUrl: string;
  viewed: boolean;
}

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  content: string;
  timestamp: string;
  read: boolean;
}

@Component({
  selector: 'app-social-network',
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
    TwChipComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './social-network.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #fafafa;
    }
  `],
})
export class SocialNetworkComponent {
  protected icons = {
    arrowLeft: faArrowLeft,
    search: faSearch,
    home: faHome,
    bell: faBell,
    comment: faComment,
    bookmark: faBookmark,
    users: faUsers,
    calendar: faCalendar,
    video: faVideo,
    image: faImage,
    smile: faSmile,
    ellipsisV: faEllipsisV,
    heart: faHeart,
    shareAlt: faShareAlt,
  };

  protected currentView = signal<'feed' | 'profile' | 'explore'>('feed');
  protected newPostModalOpen = signal(false);
  protected postDetailModalOpen = signal(false);
  protected selectedPost = signal<Post | null>(null);
  protected notificationsOpen = signal(false);
  protected messagesOpen = signal(false);

  // Post creation
  protected newPostContent = signal('');
  protected newPostImage = signal('');
  protected loading = signal(false);

  protected currentUser: User = {
    id: 1,
    username: 'johndoe',
    displayName: 'John Doe',
    avatar: 'JD',
    bio: 'Digital creator & photographer 📸 | Travel enthusiast ✈️ | Coffee lover ☕',
    followers: 12500,
    following: 543,
    posts: 842,
    verified: true,
    location: 'San Francisco, CA',
    website: 'johndoe.com',
    joinedDate: 'January 2020',
  };

  protected stories: Story[] = [
    {
      id: 1,
      author: { ...this.currentUser, id: 1 },
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=200&auto=format&fit=crop',
      viewed: false,
    },
    {
      id: 2,
      author: {
        id: 2,
        username: 'janedoe',
        displayName: 'Jane Doe',
        avatar: 'JD',
        bio: '',
        followers: 8900,
        following: 321,
        posts: 456,
        verified: true,
        joinedDate: 'March 2020',
      },
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200&auto=format&fit=crop',
      viewed: false,
    },
    {
      id: 3,
      author: {
        id: 3,
        username: 'traveler',
        displayName: 'World Traveler',
        avatar: 'WT',
        bio: '',
        followers: 15000,
        following: 678,
        posts: 1234,
        verified: false,
        joinedDate: 'June 2019',
      },
      imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=200&auto=format&fit=crop',
      viewed: true,
    },
    {
      id: 4,
      author: {
        id: 10,
        username: 'fitnessguru',
        displayName: 'Fitness Guru',
        avatar: 'FG',
        bio: '',
        followers: 32000,
        following: 120,
        posts: 890,
        verified: true,
        joinedDate: 'April 2020',
      },
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop',
      viewed: false,
    },
    {
      id: 5,
      author: {
        id: 11,
        username: 'coffeeaddict',
        displayName: 'Coffee Addict',
        avatar: 'CA',
        bio: '',
        followers: 5600,
        following: 234,
        posts: 321,
        verified: false,
        joinedDate: 'July 2021',
      },
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=200&auto=format&fit=crop',
      viewed: true,
    },
  ];

  protected posts: Post[] = [
    {
      id: 1,
      author: {
        id: 2,
        username: 'janedoe',
        displayName: 'Jane Doe',
        avatar: 'JD',
        bio: 'Artist & Designer',
        followers: 8900,
        following: 321,
        posts: 456,
        verified: true,
        joinedDate: 'March 2020',
      },
      content: 'Just finished this amazing painting! What do you think? 🎨✨ #art #painting #creative',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
      likes: 1234,
      comments: 89,
      shares: 45,
      timestamp: '2 hours ago',
      liked: false,
      bookmarked: false,
      hashtags: ['art', 'painting', 'creative'],
    },
    {
      id: 2,
      author: {
        id: 3,
        username: 'traveler',
        displayName: 'World Traveler',
        avatar: 'WT',
        bio: 'Exploring the world',
        followers: 15000,
        following: 678,
        posts: 1234,
        verified: false,
        joinedDate: 'June 2019',
      },
      content: 'Sunset views from Santorini never get old! 🌅 #travel #greece #sunset',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600&auto=format&fit=crop',
      likes: 5678,
      comments: 234,
      shares: 123,
      timestamp: '5 hours ago',
      liked: true,
      bookmarked: true,
      hashtags: ['travel', 'greece', 'sunset'],
    },
    {
      id: 3,
      author: {
        id: 4,
        username: 'foodie',
        displayName: 'Food Lover',
        avatar: 'FL',
        bio: 'Food blogger',
        followers: 23400,
        following: 432,
        posts: 2345,
        verified: true,
        joinedDate: 'February 2019',
      },
      content: 'Best brunch spot in the city! 🥐☕ The avocado toast was incredible. Highly recommend!',
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop',
      likes: 890,
      comments: 67,
      shares: 34,
      timestamp: '8 hours ago',
      liked: false,
      bookmarked: false,
      hashtags: ['food', 'brunch', 'foodie'],
    },
    {
      id: 4,
      author: {
        id: 10,
        username: 'fitnessguru',
        displayName: 'Fitness Guru',
        avatar: 'FG',
        bio: 'Personal Trainer & Wellness Coach',
        followers: 32000,
        following: 120,
        posts: 890,
        verified: true,
        joinedDate: 'April 2020',
      },
      content: 'Morning workout complete! 💪 Remember: consistency beats intensity. Start small, stay committed. #fitness #motivation #workout',
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
      likes: 2456,
      comments: 178,
      shares: 89,
      timestamp: '1 day ago',
      liked: false,
      bookmarked: false,
      hashtags: ['fitness', 'motivation', 'workout'],
    },
    {
      id: 5,
      author: {
        id: 8,
        username: 'photographer',
        displayName: 'Pro Photographer',
        avatar: 'PP',
        bio: 'Professional photographer',
        followers: 45600,
        following: 234,
        posts: 1234,
        verified: true,
        joinedDate: 'January 2018',
      },
      content: 'Golden hour magic ✨ Sometimes the best shots happen when you least expect them. #photography #goldenhour #portrait',
      imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop',
      likes: 7892,
      comments: 342,
      shares: 156,
      timestamp: '2 days ago',
      liked: true,
      bookmarked: false,
      hashtags: ['photography', 'goldenhour', 'portrait'],
    },
  ];

  protected comments: Comment[] = [
    {
      id: 1,
      author: {
        id: 5,
        username: 'artlover',
        displayName: 'Art Enthusiast',
        avatar: 'AE',
        bio: '',
        followers: 456,
        following: 234,
        posts: 123,
        verified: false,
        joinedDate: 'May 2021',
      },
      content: 'This is absolutely stunning! Love the color palette! 🎨',
      likes: 45,
      timestamp: '1 hour ago',
      liked: false,
    },
    {
      id: 2,
      author: {
        id: 6,
        username: 'designer',
        displayName: 'Creative Designer',
        avatar: 'CD',
        bio: '',
        followers: 1200,
        following: 345,
        posts: 567,
        verified: true,
        joinedDate: 'August 2020',
      },
      content: 'Amazing work! The technique is flawless 👏',
      likes: 23,
      timestamp: '30 minutes ago',
      liked: true,
    },
  ];

  protected notifications: Notification[] = [
    {
      id: 1,
      type: 'like',
      user: this.stories[1].author,
      content: 'liked your post',
      timestamp: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'comment',
      user: this.stories[2].author,
      content: 'commented on your post',
      timestamp: '15 minutes ago',
      read: false,
    },
    {
      id: 3,
      type: 'follow',
      user: {
        id: 7,
        username: 'newuser',
        displayName: 'New User',
        avatar: 'NU',
        bio: '',
        followers: 234,
        following: 123,
        posts: 45,
        verified: false,
        joinedDate: 'December 2024',
      },
      content: 'started following you',
      timestamp: '1 hour ago',
      read: true,
    },
  ];

  protected trendingTopics = [
    { tag: 'Photography', posts: '125K' },
    { tag: 'Travel2024', posts: '89K' },
    { tag: 'FoodieLife', posts: '67K' },
    { tag: 'TechNews', posts: '45K' },
    { tag: 'Fitness', posts: '34K' },
  ];

  protected suggestedUsers: User[] = [
    {
      id: 8,
      username: 'photographer',
      displayName: 'Pro Photographer',
      avatar: 'PP',
      bio: 'Professional photographer',
      followers: 45600,
      following: 234,
      posts: 1234,
      verified: true,
      joinedDate: 'January 2018',
    },
    {
      id: 9,
      username: 'techguru',
      displayName: 'Tech Guru',
      avatar: 'TG',
      bio: 'Tech enthusiast & reviewer',
      followers: 78900,
      following: 456,
      posts: 2345,
      verified: true,
      joinedDate: 'March 2019',
    },
  ];

  protected unreadNotifications = computed(() => {
    return this.notifications.filter(n => !n.read).length;
  });

  constructor(private toastService: TwToastService) {}

  protected openNewPost(): void {
    this.newPostModalOpen.set(true);
  }

  protected closeNewPost(): void {
    this.newPostModalOpen.set(false);
    this.newPostContent.set('');
    this.newPostImage.set('');
  }

  protected submitPost(): void {
    if (!this.newPostContent()) {
      this.toastService.warning('Please enter some content', 'Empty Post');
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
      this.toastService.success('Post shared successfully!', 'Posted');
      this.closeNewPost();

      // Add new post to feed
      const hashtags = this.newPostContent().match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
      this.posts.unshift({
        id: Date.now(),
        author: this.currentUser,
        content: this.newPostContent(),
        imageUrl: this.newPostImage() || undefined,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: 'Just now',
        liked: false,
        bookmarked: false,
        hashtags,
      });
    }, 1000);
  }

  protected likePost(post: Post): void {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    if (post.liked) {
      this.toastService.success('Liked!', 'Success');
    }
  }

  protected bookmarkPost(post: Post): void {
    post.bookmarked = !post.bookmarked;
    this.toastService.success(
      post.bookmarked ? 'Added to bookmarks' : 'Removed from bookmarks',
      'Bookmarks'
    );
  }

  protected sharePost(post: Post): void {
    post.shares++;
    this.toastService.success('Post shared!', 'Shared');
  }

  protected openPostDetail(post: Post): void {
    this.selectedPost.set(post);
    this.postDetailModalOpen.set(true);
  }

  protected closePostDetail(): void {
    this.postDetailModalOpen.set(false);
    this.selectedPost.set(null);
  }

  protected followUser(user: User): void {
    this.toastService.success(`You are now following ${user.displayName}`, 'Following');
  }

  protected viewStory(story: Story): void {
    story.viewed = true;
    this.toastService.info(`Viewing ${story.author.displayName}'s story`, 'Story');
  }

  protected toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
    if (this.messagesOpen()) {
      this.messagesOpen.set(false);
    }
  }

  protected toggleMessages(): void {
    this.messagesOpen.update(v => !v);
    if (this.notificationsOpen()) {
      this.notificationsOpen.set(false);
    }
  }

  protected markNotificationRead(notification: Notification): void {
    notification.read = true;
  }

  protected getNotificationIcon(type: string): string {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'mention': return '@';
      default: return '🔔';
    }
  }

  protected formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}

