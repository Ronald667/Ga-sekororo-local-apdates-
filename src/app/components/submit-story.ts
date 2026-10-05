import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StoryService, Story } from '../services/story.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-submit-story',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    @if (storyService.isSubmitModalOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 animate-fade-in">
        <div class="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col my-auto">
          
          <!-- Header -->
          <div class="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-icons text-amber-400">edit_note</span>
              <h3 class="text-base font-serif font-bold">Submit a Local Story or News Tip</h3>
            </div>
            <button 
              type="button"
              (click)="storyService.isSubmitModalOpen.set(false)"
              class="text-stone-400 hover:text-white p-1 rounded-lg"
            >
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <!-- Form -->
          <form [formGroup]="submitForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <p class="text-xs text-stone-600 leading-relaxed">
              Have news, an event, or community story to share from Ga-Sekororo? Submit your tip directly to our editorial desk.
            </p>

            <div class="space-y-1">
              <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Your Name</label>
              <input 
                type="text" 
                formControlName="author"
                placeholder="E.g. Sello Makgoba" 
                class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Category</label>
              <select 
                formControlName="category"
                class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 bg-white"
              >
                <option value="Local News">Local News</option>
                <option value="Culture & Tradition">Culture & Tradition</option>
                <option value="Entertainment & Music">Entertainment & Music</option>
                <option value="Business & Farming">Business & Farming</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Headline</label>
              <input 
                type="text" 
                formControlName="title"
                placeholder="Brief headline of the story..." 
                class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Story Details</label>
              <textarea 
                formControlName="content"
                rows="4"
                placeholder="Provide full details, location, and dates..." 
                class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
              ></textarea>
            </div>

            <div class="pt-2 flex justify-end gap-3">
              <button 
                type="button"
                (click)="storyService.isSubmitModalOpen.set(false)"
                class="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button 
                type="submit"
                [disabled]="submitForm.invalid"
                class="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Submit to Editorial Desk
              </button>
            </div>
          </form>

        </div>
      </div>
    }
  `
})
export class SubmitStory {
  storyService = inject(StoryService);
  fb = inject(FormBuilder);

  submitForm: FormGroup = this.fb.group({
    author: ['', Validators.required],
    category: ['Local News', Validators.required],
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  onSubmit() {
    if (this.submitForm.invalid) return;

    const val = this.submitForm.value;
    const cat = val.category || 'News';
    const newStory: Story = {
      id: 'sub_' + Date.now(),
      title: val.title,
      excerpt: val.content.substring(0, 120) + '...',
      content: val.content,
      category: cat,
      categories: [cat, 'Community'],
      author: val.author,
      date: 'Today',
      readTime: '3 min read',
      imageUrl: '/src/assets/images/hero_sekororo_valley_1790237855080.jpg',
      views: 1,
      likes: 2,
      comments: []
    };

    this.storyService.stories.update(list => [newStory, ...list]);
    this.storyService.isSubmitModalOpen.set(false);
    this.submitForm.reset({ category: 'Local News' });
    alert('Thank you! Your story tip has been successfully submitted to the editorial desk.');
  }
}
