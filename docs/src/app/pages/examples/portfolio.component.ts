import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faImages,
  faDownload,
  faHeart,
  faShare,
  faCamera,
  faExpand,
  faTimes,
  faEnvelope,
  faPaperPlane,
  faPhone,
  faMapMarkerAlt,
  faCheck,
  faArrowRight,
  faUser,
  faCalendar,
  faCameraRetro,
  faChurch,
  faGlassCheers,
  faBriefcase,
} from '@fortawesome/free-solid-svg-icons';
import {
  faInstagram,
  faFacebook,
  faPinterest,
} from '@fortawesome/free-brands-svg-icons';
import {
  TwInputComponent,
  TwModalComponent,
  TwToastService,
  TwTabsComponent,
  TwTabPanelComponent,
  TwSpinnerComponent,
  TwAccordionComponent,
  TwAccordionItemComponent,
  TwRatingComponent,
} from '@pegasusheavy/ngx-tailwindcss';
import { ThemeToggleComponent } from '../../components/theme-toggle.component';

interface Photo {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  camera: string;
  aperture: string;
  shutter: string;
  iso: string;
  description: string;
  tags: string[];
  likes: number;
  image: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  rating: number;
  comment: string;
  avatar: string;
}

interface Service {
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FontAwesomeModule,
    TwInputComponent,
    TwModalComponent,
    TwTabsComponent,
    TwTabPanelComponent,
    TwSpinnerComponent,
    TwAccordionComponent,
    TwAccordionItemComponent,
    TwRatingComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './portfolio.component.html',
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class PortfolioComponent {
  // Icons
  protected icons = {
    arrowLeft: faArrowLeft,
    images: faImages,
    download: faDownload,
    heart: faHeart,
    share: faShare,
    camera: faCamera,
    cameraRetro: faCameraRetro,
    expand: faExpand,
    times: faTimes,
    envelope: faEnvelope,
    paperPlane: faPaperPlane,
    phone: faPhone,
    mapMarker: faMapMarkerAlt,
    check: faCheck,
    arrowRight: faArrowRight,
    user: faUser,
    calendar: faCalendar,
    instagram: faInstagram,
    facebook: faFacebook,
    pinterest: faPinterest,
    church: faChurch,
    glassCheers: faGlassCheers,
    briefcase: faBriefcase,
  };

  protected selectedCategory = signal<string>('all');
  protected selectedPhoto = signal<Photo | null>(null);
  protected photoDetailOpen = signal(false);
  protected contactModalOpen = signal(false);
  protected loading = signal(false);
  protected currentSection = signal('hero');

  // Contact form
  protected contactName = signal('');
  protected contactEmail = signal('');
  protected contactMessage = signal('');
  protected contactSubject = signal('General Inquiry');

  protected photos: Photo[] = [
    {
      id: 1,
      title: 'Golden Hour',
      category: 'Landscape',
      location: 'Yosemite National Park',
      date: '2024-10-15',
      camera: 'Canon EOS R5',
      aperture: 'f/8',
      shutter: '1/250s',
      iso: '100',
      description: 'Captured during the magical golden hour, this image showcases the dramatic landscape bathed in warm, ethereal light.',
      tags: ['nature', 'mountains', 'sunset'],
      likes: 342,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      aspectRatio: 'landscape',
    },
    {
      id: 2,
      title: 'Urban Reflections',
      category: 'Architecture',
      location: 'New York City',
      date: '2024-11-20',
      camera: 'Sony A7IV',
      aperture: 'f/11',
      shutter: '1/125s',
      iso: '200',
      description: 'Modern architecture reflected in glass facades, creating a mesmerizing pattern of light and shadow.',
      tags: ['city', 'modern', 'glass'],
      likes: 256,
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=800&fit=crop',
      aspectRatio: 'portrait',
    },
    {
      id: 3,
      title: 'Portrait Session',
      category: 'Portrait',
      location: 'Studio',
      date: '2024-12-01',
      camera: 'Nikon Z9',
      aperture: 'f/2.8',
      shutter: '1/160s',
      iso: '400',
      description: 'A candid moment captured during an intimate portrait session, showcasing natural emotion and connection.',
      tags: ['portrait', 'studio', 'professional'],
      likes: 489,
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop',
      aspectRatio: 'portrait',
    },
    {
      id: 4,
      title: 'Coastal Dreams',
      category: 'Landscape',
      location: 'Big Sur, California',
      date: '2024-09-28',
      camera: 'Canon EOS R5',
      aperture: 'f/16',
      shutter: '2s',
      iso: '50',
      description: 'Long exposure of the Pacific coastline, capturing the ethereal movement of water against rugged cliffs.',
      tags: ['ocean', 'long-exposure', 'coast'],
      likes: 567,
      image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
      aspectRatio: 'landscape',
    },
    {
      id: 5,
      title: 'Wedding Bliss',
      category: 'Wedding',
      location: 'Napa Valley',
      date: '2024-11-05',
      camera: 'Sony A7IV',
      aperture: 'f/1.8',
      shutter: '1/500s',
      iso: '800',
      description: 'A precious moment between newlyweds, captured with soft natural light and genuine emotion.',
      tags: ['wedding', 'couple', 'love'],
      likes: 723,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop',
      aspectRatio: 'square',
    },
    {
      id: 6,
      title: 'Street Life',
      category: 'Street',
      location: 'Tokyo, Japan',
      date: '2024-08-12',
      camera: 'Fujifilm X-T5',
      aperture: 'f/5.6',
      shutter: '1/250s',
      iso: '1600',
      description: 'Candid street photography capturing the vibrant energy and culture of urban life.',
      tags: ['street', 'candid', 'urban'],
      likes: 412,
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=800&fit=crop',
      aspectRatio: 'portrait',
    },
    {
      id: 7,
      title: 'Wilderness',
      category: 'Landscape',
      location: 'Iceland',
      date: '2024-07-22',
      camera: 'Canon EOS R5',
      aperture: 'f/11',
      shutter: '1/60s',
      iso: '200',
      description: 'The raw beauty of Iceland\'s dramatic landscapes, where fire meets ice in perfect harmony.',
      tags: ['nature', 'iceland', 'dramatic'],
      likes: 891,
      image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&h=600&fit=crop',
      aspectRatio: 'landscape',
    },
    {
      id: 8,
      title: 'Modern Lines',
      category: 'Architecture',
      location: 'Dubai',
      date: '2024-10-30',
      camera: 'Sony A7IV',
      aperture: 'f/8',
      shutter: '1/200s',
      iso: '100',
      description: 'Bold geometric patterns and modern architectural design reaching toward the sky.',
      tags: ['architecture', 'modern', 'geometric'],
      likes: 334,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=800&fit=crop',
      aspectRatio: 'portrait',
    },
    {
      id: 9,
      title: 'Festival Moments',
      category: 'Events',
      location: 'Austin, Texas',
      date: '2024-06-15',
      camera: 'Nikon Z9',
      aperture: 'f/4',
      shutter: '1/320s',
      iso: '3200',
      description: 'Capturing the energy and excitement of live music festivals and cultural celebrations.',
      tags: ['event', 'music', 'festival'],
      likes: 267,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
      aspectRatio: 'landscape',
    },
  ];

  protected testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'Tech Innovations Inc',
      rating: 5,
      comment: 'Absolutely stunning work! The attention to detail and creative vision exceeded all our expectations. Highly recommend!',
      avatar: 'SJ',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Wedding Client',
      company: 'Private',
      rating: 5,
      comment: 'Our wedding photos are absolutely perfect. Every moment was captured beautifully. We couldn\'t be happier!',
      avatar: 'MC',
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'Art Director',
      company: 'Creative Studio',
      rating: 5,
      comment: 'Professional, creative, and a pleasure to work with. The final deliverables were outstanding.',
      avatar: 'ED',
    },
  ];

  protected services: Service[] = [
    {
      title: 'Portrait Photography',
      description: 'Professional portrait sessions for individuals, families, and corporate headshots',
      price: 'Starting at $300',
      features: ['2-hour session', 'Multiple locations', '50+ edited photos', 'Online gallery', 'Print rights'],
      icon: 'user',
    },
    {
      title: 'Wedding Photography',
      description: 'Complete coverage of your special day with stunning, timeless imagery',
      price: 'Starting at $2,500',
      features: ['8-hour coverage', 'Two photographers', '500+ edited photos', 'Engagement session', 'Custom album'],
      icon: 'church',
    },
    {
      title: 'Commercial Photography',
      description: 'High-quality imagery for brands, products, and marketing campaigns',
      price: 'Starting at $1,000',
      features: ['Full-day shoot', 'Unlimited revisions', 'Usage rights', 'Fast turnaround', 'Creative direction'],
      icon: 'briefcase',
    },
    {
      title: 'Event Photography',
      description: 'Professional coverage of corporate events, conferences, and special occasions',
      price: 'Starting at $500',
      features: ['4-hour minimum', 'Real-time upload', '200+ photos', 'Quick delivery', 'Social media ready'],
      icon: 'glassCheers',
    },
  ];

  protected categories = [
    { label: 'All Work', value: 'all', count: 9 },
    { label: 'Landscape', value: 'Landscape', count: 3 },
    { label: 'Portrait', value: 'Portrait', count: 1 },
    { label: 'Architecture', value: 'Architecture', count: 2 },
    { label: 'Wedding', value: 'Wedding', count: 1 },
    { label: 'Street', value: 'Street', count: 1 },
    { label: 'Events', value: 'Events', count: 1 },
  ];

  protected stats = [
    { value: '500+', label: 'Projects Completed' },
    { value: '100+', label: 'Happy Clients' },
    { value: '15+', label: 'Awards Won' },
    { value: '8+', label: 'Years Experience' },
  ];

  protected filteredPhotos = computed(() => {
    const category = this.selectedCategory();
    if (category === 'all') {
      return this.photos;
    }
    return this.photos.filter(p => p.category === category);
  });

  constructor(private toastService: TwToastService) {}

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected openPhotoDetail(photo: Photo): void {
    this.selectedPhoto.set(photo);
    this.photoDetailOpen.set(true);
  }

  protected closePhotoDetail(): void {
    this.photoDetailOpen.set(false);
    this.selectedPhoto.set(null);
  }

  protected likePhoto(photo: Photo): void {
    photo.likes++;
    this.toastService.success('Photo liked!', 'Success');
  }

  protected sharePhoto(photo: Photo): void {
    this.toastService.info(`Sharing: ${photo.title}`, 'Share');
  }

  protected openContactModal(): void {
    this.contactModalOpen.set(true);
  }

  protected closeContactModal(): void {
    this.contactModalOpen.set(false);
  }

  protected submitContact(): void {
    if (!this.contactName() || !this.contactEmail() || !this.contactMessage()) {
      this.toastService.warning('Please fill in all fields', 'Incomplete Form');
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
      this.toastService.success(
        'Thank you for your inquiry! I\'ll get back to you soon.',
        'Message Sent'
      );

      // Reset form
      this.contactName.set('');
      this.contactEmail.set('');
      this.contactMessage.set('');
      this.contactSubject.set('General Inquiry');
      this.closeContactModal();
    }, 1500);
  }

  protected downloadPortfolio(): void {
    this.toastService.info('Portfolio PDF download started', 'Downloading');
  }

  protected scrollToSection(section: string): void {
    this.currentSection.set(section);
    // In a real app, use ViewportScroller or scroll behavior
    this.toastService.info(`Scrolling to ${section}`, 'Navigation');
  }
}

