import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { StoryService } from '../services/story.service';
import { FormsModule } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ai-story-generator-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (storyService.isAiStoryModalOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 animate-fade-in">
        <div class="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col my-auto">
          
          <!-- Modal Header -->
          <div class="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-icons text-amber-400">auto_awesome</span>
              <h3 class="text-base font-serif font-bold">Generate Local Story with AI</h3>
            </div>
            <button 
              type="button"
              (click)="storyService.isAiStoryModalOpen.set(false)"
              class="text-stone-400 hover:text-white p-1 rounded-lg"
            >
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <!-- Form Body -->
          <div class="p-6 space-y-4">
            <p class="text-xs text-stone-600 leading-relaxed">
              Enter a topic, community event idea, or news pitch about Ga-Sekororo. Gemini AI will generate a complete professional news dispatch for publication.
            </p>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Category</label>
              <select 
                [(ngModel)]="selectedCategory"
                class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 bg-white"
              >
                <option value="Local News">Local News</option>
                <option value="Culture & Tradition">Culture & Tradition</option>
                <option value="Entertainment & Music">Entertainment & Music</option>
                <option value="Business & Farming">Business & Farming</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Story Prompt / Idea</label>
              <textarea 
                [(ngModel)]="promptText"
                rows="4"
                placeholder="E.g., Local primary school in Ga-Sekororo wins provincial science expo with solar-powered water pump..."
                class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
              ></textarea>
            </div>

            @if (errorMessage) {
              <p class="text-xs text-red-600">{{ errorMessage }}</p>
            }
          </div>

          <!-- Modal Footer -->
          <div class="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3">
            <button 
              type="button"
              (click)="storyService.isAiStoryModalOpen.set(false)"
              class="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button 
              type="button"
              (click)="generateStory()"
              [disabled]="isGenerating() || !promptText.trim()"
              class="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
            >
              @if (isGenerating()) {
                <span class="material-icons text-sm animate-spin">autorenew</span>
                <span>Generating Article...</span>
              } @else {
                <span>Publish AI Dispatch</span>
              }
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class AiStoryGeneratorModal {
  storyService = inject(StoryService);
  selectedCategory = 'Local News';
  promptText = '';
  isGenerating = signal(false);
  errorMessage = '';

  async generateStory() {
    if (!this.promptText.trim() || this.isGenerating()) return;

    this.isGenerating.set(true);
    this.errorMessage = '';

    const newStory = await this.storyService.generateAiStory(this.promptText, this.selectedCategory);
    this.isGenerating.set(false);

    if (newStory) {
      this.storyService.isAiStoryModalOpen.set(false);
      this.promptText = '';
      this.storyService.activeStoryModal.set(newStory);
    } else {
      this.errorMessage = 'Failed to generate story. Please try again.';
    }
  }
}
