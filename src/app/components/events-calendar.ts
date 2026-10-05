import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { StoryService, CommunityEvent } from '../services/story.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-events-calendar',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="max-w-7xl mx-auto px-6 py-12 border-t border-stone-200" id="events">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div class="text-xs uppercase tracking-widest font-sans font-semibold text-amber-800 mb-1">
            Community Schedule
          </div>
          <h2 class="text-2xl lg:text-3xl font-serif font-bold text-stone-900">
            Ga-Sekororo Events Calendar
          </h2>
        </div>
        <div class="flex items-center gap-3">
          <button 
            type="button"
            (click)="isSubmitEventOpen.set(true)"
            class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-sm"
          >
            <span class="material-icons text-sm">event_available</span>
            <span>Submit Event</span>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          @for (cat of categories; track cat) {
            <button 
              type="button"
              (click)="selectedCat.set(cat)"
              [class]="selectedCat() === cat 
                ? 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white transition-colors' 
                : 'px-3.5 py-1.5 text-xs font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors'"
            >
              {{ cat }}
            </button>
          }
        </div>

        <div class="text-xs text-stone-500">
          Showing {{ filteredEvents().length }} upcoming community gatherings
        </div>
      </div>

      <!-- Events List -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (ev of filteredEvents(); track ev.id) {
          <div class="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:border-stone-400 transition-all flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs font-sans">
                <span class="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-semibold uppercase tracking-wider text-[10px]">
                  {{ ev.category }}
                </span>
                <span class="text-stone-500 font-medium">{{ ev.date }} · {{ ev.time }}</span>
              </div>

              <h3 class="text-xl font-serif font-bold text-stone-900">
                {{ ev.title }}
              </h3>

              <p class="text-xs text-stone-600 leading-relaxed font-sans">
                {{ ev.description }}
              </p>
            </div>

            <div class="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-sans">
              <div class="flex items-center gap-1.5">
                <span class="material-icons text-stone-400 text-sm">location_on</span>
                <span class="font-medium text-stone-800">{{ ev.location }}</span>
              </div>
              <span class="italic text-[11px]">Org: {{ ev.organizer }}</span>
            </div>
          </div>
        } @empty {
          <div class="col-span-2 text-center py-12 bg-white border border-stone-200 rounded-xl">
            <span class="material-icons text-3xl text-stone-400 mb-2">event_busy</span>
            <p class="text-xs text-stone-500 font-sans">No events found for this category.</p>
          </div>
        }
      </div>

      <!-- Event Submission Modal -->
      @if (isSubmitEventOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex justify-center p-4 animate-fade-in">
          <div class="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col my-auto">
            
            <div class="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-icons text-amber-400">event</span>
                <h3 class="text-base font-serif font-bold">Submit Event for Review</h3>
              </div>
              <button (click)="isSubmitEventOpen.set(false)" class="text-stone-400 hover:text-white p-1">
                <span class="material-icons">close</span>
              </button>
            </div>

            <form [formGroup]="eventForm" (ngSubmit)="onSubmitEvent()" class="p-6 space-y-4">
              <p class="text-xs text-stone-600 font-sans leading-relaxed">
                Organizing a community gathering, sports match, or cultural festival in Ga-Sekororo? Submit details for review and calendar publishing.
              </p>

              <div class="space-y-1">
                <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Event Title</label>
                <input type="text" formControlName="title" placeholder="E.g., Ward 2 Youth Soccer Championship" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Category</label>
                  <select formControlName="category" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 bg-white">
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Business">Business</option>
                    <option value="Community Meeting">Community Meeting</option>
                    <option value="Music & Arts">Music & Arts</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Date</label>
                  <input type="date" formControlName="date" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 bg-white" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Time</label>
                  <input type="text" formControlName="time" placeholder="E.g. 10:00 AM" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900" />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Location</label>
                  <input type="text" formControlName="location" placeholder="E.g. Tribal Hall" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900" />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Organizer Name</label>
                <input type="text" formControlName="organizer" placeholder="E.g. Youth Sports Council" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900" />
              </div>

              <div class="space-y-1">
                <label class="text-xs font-semibold uppercase tracking-wider text-stone-700 font-sans">Description</label>
                <textarea formControlName="description" rows="3" placeholder="Provide summary of the event..." class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"></textarea>
              </div>

              <div class="pt-2 flex justify-end gap-3">
                <button type="button" (click)="isSubmitEventOpen.set(false)" class="px-4 py-2 text-xs font-medium text-stone-600">Cancel</button>
                <button type="submit" [disabled]="eventForm.invalid" class="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors">Submit Event</button>
              </div>
            </form>

          </div>
        </div>
      }
    </section>
  `
})
export class EventsCalendar {
  storyService = inject(StoryService);
  fb = inject(FormBuilder);
  categories = ['All', 'Cultural', 'Sports', 'Business', 'Community Meeting', 'Music & Arts'];
  selectedCat = signal('All');
  isSubmitEventOpen = signal(false);

  eventForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    category: ['Cultural', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    location: ['', Validators.required],
    organizer: ['', Validators.required],
    description: ['', Validators.required]
  });

  filteredEvents = computed(() => {
    const cat = this.selectedCat();
    const list = this.storyService.events();
    if (cat === 'All') return list;
    return list.filter(e => e.category === cat);
  });

  onSubmitEvent() {
    if (this.eventForm.invalid) return;
    const val = this.eventForm.value;
    this.storyService.addEvent(val);
    this.isSubmitEventOpen.set(false);
    this.eventForm.reset({ category: 'Cultural' });
    alert('Event submitted successfully and added to the community calendar!');
  }
}
