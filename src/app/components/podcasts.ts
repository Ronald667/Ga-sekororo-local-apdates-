import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StoryService, PodcastEpisode } from '../services/story.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-podcasts',
  standalone: true,
  template: `
    <section class="max-w-7xl mx-auto px-6 py-12 border-t border-stone-200" id="podcasts">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div class="text-xs uppercase tracking-widest font-sans font-semibold text-amber-800 mb-1">
            Audio & Broadcast Media
          </div>
          <h2 class="text-2xl lg:text-3xl font-serif font-bold text-stone-900">
            Ga-Sekororo Podcasts & Radio Hour
          </h2>
        </div>
        <p class="text-xs text-stone-600 max-w-sm">
          Listen to oral history recordings, agricultural expert panels, and cultural dialogues in Northern Sotho and English.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (pod of storyService.podcasts(); track pod.id) {
          <div class="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:border-stone-400 transition-all flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs text-stone-500 font-sans">
                <span class="font-semibold text-stone-800">{{ pod.showName }}</span>
                <span>{{ pod.duration }} · {{ pod.date }}</span>
              </div>

              <h3 class="text-xl font-serif font-bold text-stone-900">
                {{ pod.title }}
              </h3>

              <p class="text-xs text-stone-600 leading-relaxed">
                {{ pod.description }}
              </p>
            </div>

            <div class="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
              <button 
                type="button"
                (click)="playPodcast(pod)"
                class="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <span class="material-icons text-sm">play_arrow</span>
                <span>Play Episode</span>
              </button>

              <span class="text-[11px] text-stone-500 italic">High Quality Audio</span>
            </div>
          </div>
        }
      </div>

      <!-- Active Audio Bar if playing -->
      @if (storyService.isAudioPlaying()) {
        <div class="fixed bottom-6 right-6 z-50 bg-stone-900 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 border border-stone-700 animate-slide-up">
          <div class="w-10 h-10 rounded-lg bg-amber-700 flex items-center justify-center">
            <span class="material-icons text-white animate-spin">graphic_eq</span>
          </div>
          <div>
            <div class="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Now Playing</div>
            <div class="text-xs font-serif font-bold">{{ storyService.currentAudioTitle() }}</div>
          </div>
          <button 
            type="button"
            (click)="storyService.isAudioPlaying.set(false)"
            class="ml-4 text-stone-400 hover:text-white"
          >
            <span class="material-icons">close</span>
          </button>
        </div>
      }
    </section>
  `
})
export class Podcasts {
  storyService = inject(StoryService);

  playPodcast(pod: PodcastEpisode) {
    this.storyService.currentAudioTitle.set(pod.title);
    this.storyService.isAudioPlaying.set(true);
  }
}
