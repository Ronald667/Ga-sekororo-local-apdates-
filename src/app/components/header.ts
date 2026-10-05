import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StoryService } from '../services/story.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        <!-- Zone 1: Wordmark -->
        <a href="#" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-lg bg-stone-900 text-stone-50 flex items-center justify-center font-serif font-bold text-lg shadow-sm">
            GS
          </div>
          <div>
            <span class="text-lg font-bold font-serif tracking-tight text-stone-900 block leading-tight">
              Ga Sekororo
            </span>
            <span class="text-[10px] uppercase tracking-widest text-stone-500 font-medium block">
              Local Stories & Media
            </span>
          </div>
        </a>

        <!-- Zone 2: Navigation links -->
        <nav class="hidden xl:flex items-center gap-5 text-sm font-medium text-stone-600">
          <a href="#news" class="hover:text-stone-950 transition-colors">News</a>
          <a href="#gallery" class="hover:text-stone-950 transition-colors">Gallery</a>
          <a href="#events" class="hover:text-stone-950 transition-colors">Events</a>
          <a href="#podcasts" class="hover:text-stone-950 transition-colors">Podcasts</a>
          <a href="#sports" class="hover:text-stone-950 transition-colors">Sports</a>
        </nav>

        <!-- Zone 3: Actions -->
        <div class="flex items-center gap-2.5">
          <button 
            (click)="storyService.isAiReporterOpen.set(true)"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-200/70 hover:bg-stone-300/80 rounded-lg transition-colors whitespace-nowrap shadow-sm">
            <span class="material-icons text-sm text-stone-700">smart_toy</span>
            <span class="hidden sm:inline">AI Reporter</span>
          </button>

          <button 
            (click)="storyService.isAiStoryModalOpen.set(true)"
            class="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shadow-sm">
            <span class="material-icons text-sm">auto_awesome</span>
            <span>Write AI</span>
          </button>

          <button 
            (click)="storyService.isSubmitModalOpen.set(true)"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap">
            <span class="material-icons text-sm">edit_note</span>
            <span class="hidden sm:inline">Submit Content</span>
          </button>

          <button 
            (click)="storyService.isAdminOpen.set(true)"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            title="Admin & Moderation"
          >
            <span class="material-icons text-sm">admin_panel_settings</span>
            <span class="hidden md:inline">Admin</span>
          </button>
        </div>

      </div>
    </header>
  `
})
export class Header {
  storyService = inject(StoryService);
}
