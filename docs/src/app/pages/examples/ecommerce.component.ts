import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faSearch,
  faHeart,
  faShoppingCart,
  faUser,
  faTimes,
  faPlus,
  faMinus,
  faTrash,
  faStar,
  faFilter,
  faTh,
  faList,
  faChevronDown,
  faCheck,
  faShippingFast,
  faUndo,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import {
  TwButtonComponent,
  TwCardComponent,
  TwInputComponent,
  TwSelectComponent,
  TwMultiSelectComponent,
  SelectOption,
  MultiSelectGroup,
  TwBadgeComponent,
  TwAvatarComponent,
  TwRatingComponent,
  TwModalComponent,
  TwToastService,
  TwSidebarComponent,
  TwChipComponent,
  TwChipsComponent,
  TwSliderComponent,
  TwAlertComponent,
  TwAccordionComponent,
  TwAccordionItemComponent,
  TwDividerComponent,
} from '@pegasus-heavy/ngx-tailwindcss';
import { ThemeToggleComponent } from '../../components/theme-toggle.component';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  brand: string;
  image: string;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
  tags: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    FontAwesomeModule,
    TwButtonComponent,
    TwCardComponent,
    TwInputComponent,
    TwSelectComponent,
    TwMultiSelectComponent,
    TwBadgeComponent,
    TwAvatarComponent,
    TwRatingComponent,
    TwModalComponent,
    TwSidebarComponent,
    TwChipComponent,
    TwChipsComponent,
    TwSliderComponent,
    TwAlertComponent,
    TwAccordionComponent,
    TwAccordionItemComponent,
    TwDividerComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './ecommerce.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #fafafa;
    }
  `],
})
export class EcommerceComponent {
  // Icons
  protected icons = {
    arrowLeft: faArrowLeft,
    search: faSearch,
    heart: faHeart,
    heartEmpty: faHeartRegular,
    cart: faShoppingCart,
    user: faUser,
    times: faTimes,
    plus: faPlus,
    minus: faMinus,
    trash: faTrash,
    star: faStar,
    filter: faFilter,
    grid: faTh,
    list: faList,
    chevronDown: faChevronDown,
    check: faCheck,
    shipping: faShippingFast,
    undo: faUndo,
    shield: faShieldAlt,
  };

  protected cartOpen = signal(false);
  protected productDetailOpen = signal(false);
  protected selectedProduct = signal<Product | null>(null);
  protected searchQuery = signal('');
  protected selectedCategories = signal<string[]>([]);
  protected selectedBrands = signal<string[]>([]);
  protected priceRange = signal([0, 1000]);
  protected sortBy = signal('featured');
  protected viewMode = signal<'grid' | 'list'>('grid');
  protected cart = signal<CartItem[]>([]);
  protected selectedColor = signal<string>('');
  protected selectedSize = signal<string>('');

  protected products: Product[] = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      description: 'High-quality over-ear headphones with active noise cancellation',
      price: 299,
      originalPrice: 399,
      rating: 4.5,
      reviews: 1234,
      category: 'Electronics',
      brand: 'AudioPro',
      image: '🎧',
      inStock: true,
      colors: ['Black', 'Silver', 'Blue'],
      tags: ['wireless', 'noise-canceling', 'premium'],
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      description: 'Track your fitness goals with GPS and heart rate monitoring',
      price: 199,
      originalPrice: 249,
      rating: 4.8,
      reviews: 856,
      category: 'Electronics',
      brand: 'FitTech',
      image: '⌚',
      inStock: true,
      colors: ['Black', 'Pink', 'Green'],
      sizes: ['S', 'M', 'L'],
      tags: ['fitness', 'smart', 'waterproof'],
    },
    {
      id: 3,
      name: 'Ergonomic Office Chair',
      description: 'Comfortable mesh back chair with lumbar support',
      price: 399,
      rating: 4.6,
      reviews: 543,
      category: 'Furniture',
      brand: 'ComfortSeat',
      image: '🪑',
      inStock: true,
      colors: ['Black', 'Gray'],
      tags: ['ergonomic', 'office', 'adjustable'],
    },
    {
      id: 4,
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard with blue switches',
      price: 149,
      originalPrice: 199,
      rating: 4.7,
      reviews: 2341,
      category: 'Electronics',
      brand: 'GameGear',
      image: '⌨️',
      inStock: true,
      colors: ['Black', 'White'],
      tags: ['gaming', 'rgb', 'mechanical'],
    },
    {
      id: 5,
      name: 'Running Shoes Pro',
      description: 'Lightweight running shoes with advanced cushioning',
      price: 129,
      rating: 4.4,
      reviews: 678,
      category: 'Sports',
      brand: 'SportFit',
      image: '👟',
      inStock: false,
      colors: ['Blue', 'Red', 'Black'],
      sizes: ['8', '9', '10', '11', '12'],
      tags: ['running', 'sports', 'lightweight'],
    },
    {
      id: 6,
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated water bottle keeps drinks cold for 24 hours',
      price: 29,
      rating: 4.9,
      reviews: 3421,
      category: 'Sports',
      brand: 'HydroMax',
      image: '💧',
      inStock: true,
      colors: ['Silver', 'Blue', 'Green', 'Pink'],
      tags: ['insulated', 'eco-friendly', 'portable'],
    },
    {
      id: 7,
      name: 'Wireless Mouse',
      description: 'Precision wireless mouse with ergonomic design',
      price: 49,
      originalPrice: 69,
      rating: 4.3,
      reviews: 1567,
      category: 'Electronics',
      brand: 'TechMouse',
      image: '🖱️',
      inStock: true,
      colors: ['Black', 'White', 'Gray'],
      tags: ['wireless', 'ergonomic', 'precision'],
    },
    {
      id: 8,
      name: 'Yoga Mat Premium',
      description: 'Non-slip yoga mat with carrying strap',
      price: 59,
      rating: 4.6,
      reviews: 892,
      category: 'Sports',
      brand: 'YogaPro',
      image: '🧘',
      inStock: true,
      colors: ['Purple', 'Blue', 'Pink', 'Black'],
      tags: ['yoga', 'non-slip', 'eco-friendly'],
    },
  ];

  protected categoryGroups: MultiSelectGroup[] = [
    {
      label: 'Tech',
      options: [
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Computers', value: 'Computers' },
      ],
    },
    {
      label: 'Lifestyle',
      options: [
        { label: 'Furniture', value: 'Furniture' },
        { label: 'Sports', value: 'Sports' },
        { label: 'Fashion', value: 'Fashion' },
      ],
    },
  ];

  protected brandOptions: MultiSelectGroup[] = [
    {
      label: 'Popular Brands',
      options: [
        { label: 'AudioPro', value: 'AudioPro' },
        { label: 'FitTech', value: 'FitTech' },
        { label: 'GameGear', value: 'GameGear' },
      ],
    },
    {
      label: 'Other Brands',
      options: [
        { label: 'ComfortSeat', value: 'ComfortSeat' },
        { label: 'SportFit', value: 'SportFit' },
        { label: 'HydroMax', value: 'HydroMax' },
        { label: 'TechMouse', value: 'TechMouse' },
        { label: 'YogaPro', value: 'YogaPro' },
      ],
    },
  ];

  protected sortOptions: SelectOption[] = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Rating: High to Low', value: 'rating' },
    { label: 'Newest', value: 'newest' },
  ];

  protected reviews: Review[] = [
    {
      id: 1,
      author: 'John D.',
      rating: 5,
      date: '2024-12-10',
      comment: 'Amazing product! Exceeded my expectations. The quality is outstanding.',
      helpful: 24,
    },
    {
      id: 2,
      author: 'Sarah M.',
      rating: 4,
      date: '2024-12-08',
      comment: 'Great value for money. Shipping was fast and packaging was secure.',
      helpful: 15,
    },
    {
      id: 3,
      author: 'Mike R.',
      rating: 5,
      date: '2024-12-05',
      comment: 'Highly recommend! Works perfectly and looks great.',
      helpful: 31,
    },
  ];

  protected filteredProducts = computed(() => {
    let filtered = this.products;

    // Search filter
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    const categories = this.selectedCategories();
    if (categories.length > 0) {
      filtered = filtered.filter(p => categories.includes(p.category));
    }

    // Brand filter
    const brands = this.selectedBrands();
    if (brands.length > 0) {
      filtered = filtered.filter(p => brands.includes(p.brand));
    }

    // Price filter
    const [minPrice, maxPrice] = this.priceRange();
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Sort
    const sortBy = this.sortBy();
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  });

  protected cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  });

  protected cartItemCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  constructor(private toastService: TwToastService) {}

  protected toggleCart(): void {
    this.cartOpen.update(v => !v);
  }

  protected openProductDetail(product: Product): void {
    this.selectedProduct.set(product);
    this.selectedColor.set(product.colors?.[0] || '');
    this.selectedSize.set(product.sizes?.[0] || '');
    this.productDetailOpen.set(true);
  }

  protected closeProductDetail(): void {
    this.productDetailOpen.set(false);
    this.selectedProduct.set(null);
  }

  protected addToCart(product: Product): void {
    const cartItem: CartItem = {
      product,
      quantity: 1,
      selectedColor: this.selectedColor(),
      selectedSize: this.selectedSize(),
    };

    this.cart.update(items => {
      const existing = items.find(
        i =>
          i.product.id === product.id &&
          i.selectedColor === cartItem.selectedColor &&
          i.selectedSize === cartItem.selectedSize
      );

      if (existing) {
        return items.map(i =>
          i === existing ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...items, cartItem];
    });

    this.toastService.success(`${product.name} added to cart!`, 'Added to Cart');
    this.closeProductDetail();
  }

  protected removeFromCart(item: CartItem): void {
    this.cart.update(items => items.filter(i => i !== item));
    this.toastService.info('Item removed from cart', 'Removed');
  }

  protected updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.removeFromCart(item);
      return;
    }

    this.cart.update(items =>
      items.map(i => (i === item ? { ...i, quantity } : i))
    );
  }

  protected clearFilters(): void {
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.priceRange.set([0, 1000]);
    this.searchQuery.set('');
  }

  protected checkout(): void {
    if (this.cart().length === 0) {
      this.toastService.warning('Your cart is empty', 'Cannot Checkout');
      return;
    }

    this.toastService.success(
      `Order placed! Total: $${this.cartTotal().toFixed(2)}`,
      'Order Successful'
    );
    this.cart.set([]);
    this.cartOpen.set(false);
  }

  protected getDiscount(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }
}

