import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { StoryService, Story } from '../services/story.service';
import { FormsModule } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (storyService.isAdminOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex justify-center p-4 sm:p-6 animate-fade-in">
        <div class="bg-[#FBF9F5] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col my-auto max-h-[90vh]">
          
          <!-- Header -->
          <div class="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-icons text-amber-400">admin_panel_settings</span>
              <h3 class="text-base font-serif font-bold">Editorial & Admin Control Center</h3>
            </div>
            <button (click)="storyService.isAdminOpen.set(false)" class="text-stone-400 hover:text-white p-1">
              <span class="material-icons">close</span>
            </button>
          </div>

          <!-- Navigation Tabs -->
          <div class="bg-white border-b border-stone-200 px-6 flex gap-6">
            <button 
              type="button"
              (click)="activeTab.set('moderation')"
              [class]="activeTab() === 'moderation' ? 'py-3 text-xs font-semibold text-stone-900 border-b-2 border-stone-900' : 'py-3 text-xs font-medium text-stone-500 hover:text-stone-900'"
            >
              Moderation Queue ({{ pendingCount() }})
            </button>
            <button 
              type="button"
              (click)="activeTab.set('content')"
              [class]="activeTab() === 'content' ? 'py-3 text-xs font-semibold text-stone-900 border-b-2 border-stone-900' : 'py-3 text-xs font-medium text-stone-500 hover:text-stone-900'"
            >
              Manage Published Stories ({{ storyService.stories().length }})
            </button>
          </div>

          <!-- Tab Body -->
          <div class="p-6 overflow-y-auto flex-1 space-y-6">
            @if (activeTab() === 'moderation') {
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-serif font-bold text-stone-900">Community Submissions Awaiting Review</h4>
                  <span class="text-xs text-stone-500 font-sans">Approve to instantly publish to the live site.</span>
                </div>

                <div class="space-y-4">
                  @for (sub of storyService.submissions(); track sub.id) {
                    <div class="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-semibold uppercase tracking-wider rounded">{{ sub.type }}</span>
                          <span class="text-xs font-semibold text-stone-900 font-sans">{{ sub.title }}</span>
                        </div>
                        <span [class]="sub.status === 'Pending' ? 'text-xs font-semibold text-amber-600' : (sub.status === 'Approved' ? 'text-xs font-semibold text-emerald-600' : 'text-xs font-semibold text-red-600')">
                          {{ sub.status }}
                        </span>
                      </div>

                      <p class="text-xs text-stone-700 font-sans leading-relaxed">
                        {{ sub.content }}
                      </p>

                      <div class="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500 font-sans">
                        <span>Submitted by <strong class="text-stone-800">{{ sub.submitter }}</strong> ({{ sub.email }}) on {{ sub.date }}</span>
                        
                        @if (sub.status === 'Pending') {
                          <div class="flex items-center gap-2">
                            <button 
                              type="button"
                              (click)="storyService.approveSubmission(sub.id)"
                              class="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
                            >
                              Approve & Publish
                            </button>
                            <button 
                              type="button"
                              (click)="storyService.rejectSubmission(sub.id)"
                              class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                  } @empty {
                    <p class="text-xs text-stone-500 italic py-8 text-center">No submissions in the moderation queue.</p>
                  }
                </div>
              </div>
            } @else {
              <!-- Content Management Tab -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-serif font-bold text-stone-900">Manage Published Articles & Media</h4>
                  <span class="text-xs text-stone-500 font-sans">Update pictures, videos, headlines, or remove stories.</span>
                </div>

                <div class="space-y-3">
                  @for (story of storyService.stories(); track story.id) {
                    <div class="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
                      <div class="flex items-center gap-3 flex-1">
                        <img [src]="story.imageUrl" [alt]="story.title" class="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0" referrerpolicy="no-referrer" />
                        <div class="space-y-1">
                          <div class="flex items-center gap-2 text-[10px] text-stone-500 font-sans">
                            <span class="font-semibold text-amber-800 uppercase">{{ story.category }}</span>
                            <span>· By {{ story.author }}</span>
                            <span>· {{ story.date }}</span>
                          </div>
                          <h5 class="text-sm font-serif font-bold text-stone-900 line-clamp-1">{{ story.title }}</h5>
                        </div>
                      </div>

                      <div class="flex items-center gap-2">
                        <button 
                          type="button"
                          (click)="startEditStory(story)"
                          class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Edit Media & Text
                        </button>
                        <button 
                          type="button"
                          (click)="storyService.deleteStory(story.id)"
                          class="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                          title="Delete story"
                        >
                          <span class="material-icons text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Edit Story Modal with Picture & Video support -->
          @if (editingStory) {
            <div class="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div class="bg-white w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-2xl my-auto">
                <div class="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h4 class="text-base font-serif font-bold text-stone-900">Edit News Article, Picture & Media</h4>
                  <button (click)="editingStory = null" class="text-stone-400 hover:text-stone-900">
                    <span class="material-icons">close</span>
                  </button>
                </div>
                
                <div class="space-y-1">
                  <span class="block text-xs font-semibold text-stone-700 uppercase">Headline Title</span>
                  <input type="text" [(ngModel)]="editingStory.title" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <span class="block text-xs font-semibold text-stone-700 uppercase">Primary Category</span>
                    <select [(ngModel)]="editingStory.category" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-stone-900">
                      @for (cat of availableCategories; track cat) {
                        <option [value]="cat">{{ cat }}</option>
                      }
                    </select>
                  </div>
                  <div class="space-y-1">
                    <span class="block text-xs font-semibold text-stone-700 uppercase">Author / Source</span>
                    <input type="text" [(ngModel)]="editingStory.author" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900" />
                  </div>
                </div>

                <div class="space-y-1">
                  <span class="block text-xs font-semibold text-stone-700 uppercase">Assigned Categories (Select one or more)</span>
                  <div class="flex flex-wrap gap-2 pt-1">
                    @for (cat of availableCategories; track cat) {
                      <button 
                        type="button"
                        (click)="toggleCategory(cat)"
                        [class]="isCategorySelected(cat) ? 'px-3 py-1 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-sm' : 'px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors'"
                      >
                        {{ cat }}
                      </button>
                    }
                  </div>
                </div>

                <div class="space-y-1">
                  <span class="block text-xs font-semibold text-stone-700 uppercase">Featured Picture URL</span>
                  <input type="text" [(ngModel)]="editingStory.imageUrl" placeholder="https://images.unsplash.com/..." class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900" />
                </div>

                @if (editingStory.imageUrl) {
                  <div class="h-32 rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
                    <img [src]="editingStory.imageUrl" alt="Preview" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                  </div>
                }

                <div class="space-y-1">
                  <span class="block text-xs font-semibold text-stone-700 uppercase">Excerpt Summary</span>
                  <textarea [(ngModel)]="editingStory.excerpt" rows="2" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"></textarea>
                </div>

                <div class="space-y-1">
                  <span class="block text-xs font-semibold text-stone-700 uppercase">Full Story Content</span>
                  <textarea [(ngModel)]="editingStory.content" rows="5" class="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"></textarea>
                </div>

                <div class="flex justify-end gap-3 pt-2 border-t border-stone-200">
                  <button type="button" (click)="editingStory = null" class="px-4 py-2 text-xs text-stone-600 font-medium">Cancel</button>
                  <button type="button" (click)="saveEditedStory()" class="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors">Save Media & Story</button>
                </div>
              </div>
            </div>
          }

        </div>
      </div>
    }
  `
})
export class AdminDashboard {
  storyService = inject(StoryService);
  activeTab = signal<'moderation' | 'content'>('moderation');
  editingStory: Story | null = null;
  availableCategories = ['News', 'Entertainment', 'Community', 'Culture', 'Business', 'Sports'];

  pendingCount = () => {
    return this.storyService.submissions().filter(s => s.status === 'Pending').length;
  };

  startEditStory(story: Story) {
    this.editingStory = { 
      ...story, 
      categories: story.categories ? [...story.categories] : [story.category || 'News'] 
    };
  }

  toggleCategory(cat: string) {
    if (!this.editingStory) return;
    if (!this.editingStory.categories) {
      this.editingStory.categories = [];
    }
    if (this.editingStory.categories.includes(cat)) {
      this.editingStory.categories = this.editingStory.categories.filter(c => c !== cat);
    } else {
      this.editingStory.categories = [...this.editingStory.categories, cat];
    }
    if (this.editingStory.categories.length > 0) {
      this.editingStory.category = this.editingStory.categories[0];
    }
  }

  isCategorySelected(cat: string): boolean {
    return !!this.editingStory?.categories?.includes(cat);
  }

  saveEditedStory() {
    if (!this.editingStory) return;
    if (!this.editingStory.categories || this.editingStory.categories.length === 0) {
      this.editingStory.categories = [this.editingStory.category || 'News'];
    }
    this.storyService.updateStory(this.editingStory);
    this.editingStory = null;
    alert('Story, media and categories updated successfully!');
  }
}
