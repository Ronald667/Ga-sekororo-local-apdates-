import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { StoryService, GalleryItem } from '../services/story.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-gallery',
  standalone: true,
  template: `
    <section class="max-w-7xl mx-auto px-6 py-12 border-t border-stone-200" id="gallery">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div class="text-xs uppercase tracking-widest font-sans font-semibold text-amber-800 mb-1">
            Visual Archives & Media
          </div>
          <h2 class="text-2xl lg:text-3xl font-serif font-bold text-stone-900">
            Ga-Sekororo Multimedia Gallery
          </h2>
        </div>
        <p class="text-xs text-stone-600 max-w-sm">
          Browse stunning photographs and video records documenting local events, revered people, and breathtaking places.
        </p>
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        @for (cat of categories; track cat) {
          <button 
            type="button"
            (click)="selectedCat.set(cat)"
            [class]="selectedCat() === cat 
              ? 'px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white shadow-sm transition-colors' 
              : 'px-4 py-2 text-xs font-medium rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors'"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Gallery Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (item of filteredGallery(); track item.id) {
          <div 
            (click)="openLightbox(item)"
            class="bg-white border border-stone-200 rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:border-stone-400 transition-all flex flex-col"
          >
            <div class="h-60 relative overflow-hidden bg-stone-100">
              <img 
                [src]="item.thumbnailUrl" 
                [alt]="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerpolicy="no-referrer"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
              
              <!-- Badge -->
              <div class="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-stone-100 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
                {{ item.category }}
              </div>

              <!-- Type Indicator -->
              @if (item.type === 'video') {
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span class="material-icons text-xl">play_arrow</span>
                  </div>
                </div>
              }

              <div class="absolute bottom-3 left-3 right-3 text-white">
                <h3 class="text-sm font-serif font-bold leading-snug line-clamp-1">{{ item.title }}</h3>
                <p class="text-[10px] text-stone-300">{{ item.date }}</p>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Lightbox Modal -->
      @if (activeItem(); as item) {
        <div class="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" (click)="closeLightbox()">
          <div class="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col" (click)="$event.stopPropagation()">
            <div class="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">{{ item.category }}</span>
                <h3 class="text-base font-serif font-bold">{{ item.title }}</h3>
              </div>
              <button (click)="closeLightbox()" class="text-stone-400 hover:text-white p-1">
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="p-6 bg-stone-50 space-y-4">
              @if (item.type === 'video') {
                <div class="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center relative">
                  <video controls class="w-full h-full object-contain">
                    <source [src]="item.url" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              } @else {
                <div class="max-h-[60vh] overflow-hidden rounded-xl bg-stone-100 flex items-center justify-center">
                  <img [src]="item.url" [alt]="item.title" class="max-h-[60vh] w-full object-contain" referrerpolicy="no-referrer" />
                </div>
              }

              <p class="text-xs text-stone-700 leading-relaxed font-sans">
                {{ item.description }}
              </p>
              <div class="text-[11px] text-stone-400 font-sans">
                Published on {{ item.date }}
              </div>
            </div>
          </div>
        </div>
      }
    </section>
  `
})
export class Gallery {
  storyService = inject(StoryService);
  categories = ['All', 'Local Events', 'People', 'Places'];
  selectedCat = signal('All');
  activeItem = signal<GalleryItem | null>(null);

  filteredGallery = computed(() => {
    const cat = this.selectedCat();
    const list = this.storyService.gallery();
    if (cat === 'All') return list;
    return list.filter(item => item.category === cat);
  });

  openLightbox(item: GalleryItem) {
    this.activeItem.set(item);
  }

  closeLightbox() {
    this.activeItem.set(null);
  }
}
