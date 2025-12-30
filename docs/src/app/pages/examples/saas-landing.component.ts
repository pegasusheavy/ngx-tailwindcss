import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faPlay,
  faBook,
  faCalendarAlt,
  faEnvelope,
  faCheck,
  faArrowRight,
  faRocket,
  faShieldAlt,
  faChartLine,
  faRobot,
  faLink,
  faMobileAlt,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import {
  TwInputComponent,
  TwModalComponent,
  TwToastService,
  TwAccordionComponent,
  TwAccordionItemComponent,
  TwSpinnerComponent,
} from '@pegasusheavy/ngx-tailwindcss';
import { ThemeToggleComponent } from '../../components/theme-toggle.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

@Component({
  selector: 'app-saas-landing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FontAwesomeModule,
    TwInputComponent,
    TwModalComponent,
    TwAccordionComponent,
    TwAccordionItemComponent,
    TwSpinnerComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './saas-landing.component.html',
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class SaasLandingComponent {
  // Icons
  protected icons = {
    arrowLeft: faArrowLeft,
    play: faPlay,
    book: faBook,
    calendar: faCalendarAlt,
    envelope: faEnvelope,
    check: faCheck,
    arrowRight: faArrowRight,
    rocket: faRocket,
    shield: faShieldAlt,
    chart: faChartLine,
    robot: faRobot,
    link: faLink,
    mobile: faMobileAlt,
    paperPlane: faPaperPlane,
  };

  protected demoModalOpen = signal(false);
  protected contactModalOpen = signal(false);
  protected loading = signal(false);
  protected email = signal('');
  protected name = signal('');
  protected message = signal('');

  protected features: Feature[] = [
    {
      icon: '🚀',
      title: 'Lightning Fast',
      description: 'Built for speed with edge computing and global CDN distribution',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'SOC 2 Type II certified with end-to-end encryption',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track every metric that matters with beautiful dashboards',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Machine learning models optimize your workflow automatically',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: '🔗',
      title: 'Seamless Integration',
      description: 'Connect with 1000+ tools via our REST API and webhooks',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Native iOS and Android apps with offline support',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  protected pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      price: '$29',
      period: 'per month',
      description: 'Perfect for individuals and small teams',
      features: [
        'Up to 5 team members',
        '10 GB storage',
        'Basic analytics',
        'Email support',
        'API access',
      ],
      highlighted: false,
      cta: 'Start Free Trial',
    },
    {
      name: 'Professional',
      price: '$99',
      period: 'per month',
      description: 'For growing businesses and teams',
      features: [
        'Up to 25 team members',
        '100 GB storage',
        'Advanced analytics',
        'Priority support',
        'Advanced API access',
        'Custom integrations',
        'SSO authentication',
      ],
      highlighted: true,
      cta: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations with custom needs',
      features: [
        'Unlimited team members',
        'Unlimited storage',
        'Custom analytics',
        '24/7 dedicated support',
        'Enterprise API',
        'Custom development',
        'Advanced security',
        'SLA guarantee',
      ],
      highlighted: false,
      cta: 'Contact Sales',
    },
  ];

  protected testimonials: Testimonial[] = [
    {
      name: 'Sarah Chen',
      role: 'CTO',
      company: 'TechCorp',
      content: 'This platform has transformed how we manage our data. The AI features alone have saved us 40 hours per week.',
      avatar: 'SC',
      rating: 5,
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager',
      company: 'InnovateLabs',
      content: 'The best investment we\'ve made this year. Our team productivity has increased by 150% since we switched.',
      avatar: 'MR',
      rating: 5,
    },
    {
      name: 'Emily Thompson',
      role: 'CEO',
      company: 'StartupXYZ',
      content: 'Game-changing platform. The analytics insights have helped us make data-driven decisions that doubled our revenue.',
      avatar: 'ET',
      rating: 5,
    },
  ];

  protected team: TeamMember[] = [
    {
      name: 'Alex Morgan',
      role: 'CEO & Co-Founder',
      avatar: 'AM',
      bio: 'Former VP of Engineering at Google. Stanford CS PhD.',
    },
    {
      name: 'Jessica Liu',
      role: 'CTO & Co-Founder',
      avatar: 'JL',
      bio: 'Ex-Meta senior engineer. MIT graduate.',
    },
    {
      name: 'David Kumar',
      role: 'Head of Product',
      avatar: 'DK',
      bio: 'Former Product Lead at Stripe. Berkeley MBA.',
    },
    {
      name: 'Rachel Park',
      role: 'Head of Design',
      avatar: 'RP',
      bio: 'Previously Design Director at Airbnb. Parsons grad.',
    },
  ];

  protected stats = [
    { value: '10M+', label: 'Active Users' },
    { value: '99.99%', label: 'Uptime SLA' },
    { value: '50+', label: 'Countries' },
    { value: '$2B+', label: 'Processed' },
  ];

  protected integrations = [
    { name: 'Salesforce', logo: '☁️' },
    { name: 'Slack', logo: '💬' },
    { name: 'GitHub', logo: '🐙' },
    { name: 'Jira', logo: '🔷' },
    { name: 'AWS', logo: '🟧' },
    { name: 'Stripe', logo: '💳' },
  ];

  constructor(private toastService: TwToastService) {}

  protected openDemo(): void {
    this.demoModalOpen.set(true);
  }

  protected closeDemo(): void {
    this.demoModalOpen.set(false);
  }

  protected openContact(): void {
    this.contactModalOpen.set(true);
  }

  protected closeContact(): void {
    this.contactModalOpen.set(false);
  }

  protected submitContact(): void {
    if (!this.name() || !this.email() || !this.message()) {
      this.toastService.warning('Please fill in all fields', 'Incomplete Form');
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
      this.toastService.success(
        'Thanks for reaching out! Our team will contact you within 24 hours.',
        'Message Sent'
      );

      this.name.set('');
      this.email.set('');
      this.message.set('');
      this.closeContact();
    }, 1500);
  }

  protected startTrial(tier: PricingTier): void {
    if (tier.name === 'Enterprise') {
      this.openContact();
    } else {
      this.toastService.success(
        `Starting your ${tier.name} trial! Check your email for next steps.`,
        'Trial Started'
      );
    }
  }

  protected scrollToSection(section: string): void {
    this.toastService.info(`Scrolling to ${section}`, 'Navigation');
  }
}

