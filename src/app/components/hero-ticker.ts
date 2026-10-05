import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StoryService, Story } from '../services/story.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-ticker',
  standalone: true,
  template: `
    <!-- Breaking News Ticker -->
    <div class="bg-stone-900 text-stone-100 text-xs py-2 px-6 overflow-hidden flex items-center border-b border-stone-800">
      <div class="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-amber-400 shrink-0 mr-4">
        <span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        Breaking News
      </div>
      <div class="whitespace-nowrap overflow-x-auto scrollbar-none flex items-center gap-8 text-stone-300">
        @for (item of storyService.breakingNews(); track $index) {
          <span class="flex items-center gap-2">
            <span>{{ item }}</span>
            <span class="text-stone-600">/</span>
          </span>
        }
      </div>
    </div>

    <!-- Editorial Hero Marquee Section -->
    <section class="max-w-7xl mx-auto px-6 pt-10 pb-8">
      <div class="border-b border-stone-300 pb-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div class="text-xs uppercase tracking-widest font-sans font-semibold text-stone-500 mb-1">
            Vol. XIV · Ga-Sekororo Gazette · September 2026
          </div>
          <h1 class="text-3xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Voices, Culture & Media of Ga-Sekororo
          </h1>
        </div>
        <div class="text-sm text-stone-600 max-w-sm">
          Reporting live from the foothills of the Drakensberg escarpment — bringing you authentic news, traditional heritage, and local community updates.
        </div>
      </div>

      <!-- Featured Lead Story -->
      @if (featuredStory(); as story) {
        <div 
          class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-stone-200 rounded-2xl p-6 lg:p-8 shadow-sm hover:border-stone-300 transition-all cursor-pointer group"
          (click)="storyService.activeStoryModal.set(story)"
        >
          <div class="lg:col-span-7 space-y-4">
            <!-- Unboxed Metadata -->
            <div class="flex items-center gap-2 text-xs font-semibold text-stone-600">
              <span class="text-amber-700 uppercase tracking-wider">{{ story.category }}</span>
              <span aria-hidden="true">·</span>
              <span>By {{ story.author }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ story.date }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ story.readTime }}</span>
            </div>

            <h2 class="text-2xl lg:text-4xl font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-tight">
              {{ story.title }}
            </h2>

            <p class="text-stone-600 text-base leading-relaxed">
              {{ story.excerpt }}
            </p>

            <div class="flex items-center gap-4 pt-2">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 bg-stone-100 px-3 py-1.5 rounded-lg group-hover:bg-stone-900 group-hover:text-white transition-colors">
                <span>Read Full Story</span>
                <span class="material-icons text-sm">arrow_forward</span>
              </span>
              
              <button 
                type="button"
                (click)="$event.stopPropagation(); storyService.toggleBookmark(story.id)"
                class="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 p-1.5 rounded-md transition-colors"
                title="Bookmark story"
              >
                <span class="material-icons text-base">
                  {{ storyService.bookmarkedIds().includes(story.id) ? 'bookmark' : 'bookmark_border' }}
                </span>
                <span>{{ storyService.bookmarkedIds().includes(story.id) ? 'Saved' : 'Save' }}</span>
              </button>
            </div>
          </div>

          <div class="lg:col-span-5 h-64 lg:h-80 relative overflow-hidden rounded-xl bg-stone-100">
            <img 
              [src]="story.imageUrl" 
              [alt]="story.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerpolicy="no-referrer"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        </div>
      }
    </section>
  `
})
export class HeroTicker {
  storyService = inject(StoryService);

  featuredStory() {
    return this.storyService.stories().find(s => s.isFeatured) || this.storyService.stories()[0];
  }
}
