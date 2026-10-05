import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { StoryService, Story } from '../services/story.service';
import { FormsModule } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-story-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="max-w-7xl mx-auto px-6 py-8" id="news">
      <!-- Section Header & Filter Tabs -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-stone-200 pb-6">
        <div>
          <h2 class="text-2xl font-serif font-bold text-stone-900">
            Community Stories & Dispatch
          </h2>
          <p class="text-xs text-stone-500 mt-0.5">
            Explore breaking news, cultural heritage, and media updates across all wards.
          </p>
        </div>

        <!-- Search & Google AI News Fetcher -->
        <div class="flex items-center gap-2 w-full md:w-auto">
          <button 
            type="button"
            (click)="fetchGoogleNews()"
            [disabled]="isFetching()"
            class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm whitespace-nowrap"
            title="Automatically search and fetch live news from Google using AI grounding"
          >
            <span class="material-icons text-sm animate-spin" [style.animationPlayState]="isFetching() ? 'running' : 'paused'">update</span>
            <span>{{ isFetching() ? 'Fetching Live News...' : 'Fetch Google AI News' }}</span>
          </button>

          <div class="relative w-full md:w-64">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
              <span class="material-icons text-sm">search</span>
            </span>
            <input 
              type="text"
              [ngModel]="storyService.searchQuery()"
              (ngModelChange)="storyService.searchQuery.set($event)"
              placeholder="Search stories, topics..."
              class="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- Categories Filter Tabs (Functional buttons with clean segmented style) -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        @for (cat of categories; track cat) {
          <button 
            type="button"
            (click)="storyService.selectedCategory.set(cat)"
            [class]="storyService.selectedCategory() === cat 
              ? 'px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white shadow-sm whitespace-nowrap transition-colors' 
              : 'px-4 py-2 text-xs font-medium rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 whitespace-nowrap transition-colors'"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Stories Grid -->
      @if (filteredStories().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (story of filteredStories(); track story.id) {
            <article 
              (click)="storyService.activeStoryModal.set(story)"
              class="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-400 transition-all cursor-pointer flex flex-col group shadow-sm"
            >
              <div class="h-48 relative overflow-hidden bg-stone-100">
                <img 
                  [src]="story.imageUrl" 
                  [alt]="story.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerpolicy="no-referrer"
                />
                <div class="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-stone-100 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
                  {{ story.category }}
                </div>
              </div>

              <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                  <!-- Unboxed Metadata -->
                  <div class="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                    <span>{{ story.date }}</span>
                    <span aria-hidden="true">·</span>
                    <span>{{ story.readTime }}</span>
                    <span aria-hidden="true">·</span>
                    <span>{{ story.views }} views</span>
                  </div>

                  <h3 class="text-lg font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug line-clamp-2">
                    {{ story.title }}
                  </h3>

                  <p class="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {{ story.excerpt }}
                  </p>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-stone-100">
                  <span class="text-xs font-semibold text-stone-700">By {{ story.author }}</span>
                  <button 
                    type="button"
                    (click)="$event.stopPropagation(); storyService.toggleBookmark(story.id)"
                    class="p-1.5 text-stone-400 hover:text-stone-900 rounded-md transition-colors"
                    title="Bookmark"
                  >
                    <span class="material-icons text-base">
                      {{ storyService.bookmarkedIds().includes(story.id) ? 'bookmark' : 'bookmark_border' }}
                    </span>
                  </button>
                </div>
              </div>
            </article>
          }
        </div>
      } @else {
        <div class="text-center py-16 bg-white border border-stone-200 rounded-xl p-8">
          <span class="material-icons text-4xl text-stone-400 mb-2">article</span>
          <h3 class="text-base font-serif font-semibold text-stone-800">No stories found</h3>
          <p class="text-xs text-stone-500 mt-1">Try adjusting your search query or selecting a different category.</p>
          <button 
            type="button"
            (click)="storyService.searchQuery.set(''); storyService.selectedCategory.set('All')"
            class="mt-4 px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      }
    </section>
  `
})
export class StoryList {
  storyService = inject(StoryService);
  isFetching = signal(false);

  categories = ['All', 'News', 'Entertainment', 'Community', 'Culture', 'Business', 'Sports'];

  filteredStories = computed(() => {
    const cat = this.storyService.selectedCategory();
    const query = this.storyService.searchQuery().toLowerCase().trim();
    let list = this.storyService.stories();

    if (cat !== 'All') {
      list = list.filter(s => (s.categories && s.categories.includes(cat)) || s.category === cat);
    }

    if (query) {
      list = list.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.excerpt.toLowerCase().includes(query) || 
        s.author.toLowerCase().includes(query)
      );
    }

    return list;
  });

  async fetchGoogleNews() {
    if (this.isFetching()) return;
    this.isFetching.set(true);
    const story = await this.storyService.fetchGoogleNews();
    this.isFetching.set(false);
    if (story) {
      alert(`Successfully fetched and published latest Google news update: "${story.title}"`);
    } else {
      alert('Failed to fetch Google news update. Please try again.');
    }
  }
}
