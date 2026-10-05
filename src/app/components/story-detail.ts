import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StoryService, Story } from '../services/story.service';
import { FormsModule } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-story-detail',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (storyService.activeStoryModal(); as story) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex justify-center p-4 sm:p-6 animate-fade-in" (click)="closeModal()">
        <div class="bg-[#FBF9F5] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col my-auto max-h-[90vh]" (click)="$event.stopPropagation()">
          
          <!-- Modal Header Bar -->
          <div class="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded bg-amber-600 text-white text-[10px] font-semibold uppercase tracking-wider">
                {{ story.category }}
              </span>
              <span class="text-xs text-stone-300 font-sans hidden sm:inline">Ga-Sekororo Dispatch</span>
            </div>

            <div class="flex items-center gap-2">
              <!-- Realistic Voice Read Aloud Button -->
              <button 
                type="button"
                (click)="readAloud(story)"
                [class]="isSpeaking ? 'flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold animate-pulse shadow-sm' : 'flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition-colors shadow-sm'"
                title="Listen to realistic voice narration"
              >
                <span class="material-icons text-sm">{{ isSpeaking ? 'volume_up' : 'headphones' }}</span>
                <span>{{ isSpeaking ? 'Stop Audio' : 'Listen (HQ Voice)' }}</span>
              </button>

              <button 
                type="button"
                (click)="copyLink()"
                class="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
                title="Share story"
              >
                <span class="material-icons text-base">share</span>
              </button>

              <button 
                type="button"
                (click)="closeModal()"
                class="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
                title="Close"
              >
                <span class="material-icons text-base">close</span>
              </button>
            </div>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="p-6 sm:p-10 overflow-y-auto space-y-8">
            
            <!-- Headline & Byline -->
            <div class="space-y-4 border-b border-stone-200 pb-6">
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 leading-tight">
                {{ story.title }}
              </h1>

              <div class="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 font-sans">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif font-bold text-xs">
                    {{ story.author.charAt(0) }}
                  </div>
                  <div>
                    <span class="font-semibold text-stone-900 block">By {{ story.author }}</span>
                    <span>Published on {{ story.date }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <span>{{ story.readTime }}</span>
                  <span>·</span>
                  <span>{{ story.views }} views</span>
                  <button 
                    type="button"
                    (click)="storyService.likeStory(story.id)"
                    class="flex items-center gap-1 text-amber-800 hover:text-amber-900 font-semibold"
                  >
                    <span class="material-icons text-sm">thumb_up</span>
                    <span>{{ story.likes }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Featured Image -->
            <div class="h-80 sm:h-96 rounded-xl overflow-hidden bg-stone-100 shadow-sm relative">
              <img 
                [src]="story.imageUrl" 
                [alt]="story.title"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
              @if (isSpeaking) {
                <div class="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md p-3 rounded-xl text-white flex items-center gap-3 animate-fade-in shadow-xl">
                  <div class="flex items-center gap-1">
                    <span class="w-1 h-4 bg-amber-500 animate-bounce"></span>
                    <span class="w-1 h-6 bg-amber-500 animate-bounce delay-75"></span>
                    <span class="w-1 h-3 bg-amber-500 animate-bounce delay-150"></span>
                    <span class="w-1 h-5 bg-amber-500 animate-bounce delay-200"></span>
                  </div>
                  <span class="text-xs font-sans tracking-wide">High-Quality Realistic Voice Narration Active...</span>
                </div>
              }
            </div>

            <!-- Content Paragraphs -->
            <div class="space-y-6 text-stone-800 font-serif text-base sm:text-lg leading-relaxed">
              <p class="font-semibold text-stone-900 text-lg sm:text-xl">
                {{ story.excerpt }}
              </p>

              @for (paragraph of formatContent(story.content); track paragraph) {
                <p>{{ paragraph }}</p>
              }
            </div>

            <!-- Comments & Community Discussion Section -->
            <div class="border-t border-stone-200 pt-8 space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-serif font-bold text-stone-900">
                  Community Discussion ({{ story.comments.length }})
                </h3>
              </div>

              <!-- Add Comment Form -->
              <div class="bg-white p-5 rounded-xl border border-stone-200 space-y-4 shadow-sm">
                <h4 class="text-xs uppercase tracking-widest font-sans font-semibold text-stone-700">Share your thoughts</h4>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text"
                    [(ngModel)]="commentAuthor"
                    placeholder="Your Name (E.g. Sello Makgoba)"
                    class="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-sans"
                  />
                </div>

                <textarea 
                  [(ngModel)]="commentText"
                  rows="3"
                  placeholder="Write your comment or local perspective..."
                  class="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-sans"
                ></textarea>

                <div class="flex justify-end">
                  <button 
                    type="button"
                    (click)="submitComment(story.id)"
                    [disabled]="!commentText.trim()"
                    class="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold font-sans transition-colors shadow-sm"
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              <!-- Comments List -->
              <div class="space-y-4">
                @for (comment of story.comments; track comment.id) {
                  <div class="bg-white p-4 rounded-xl border border-stone-200 space-y-1 shadow-sm">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-semibold text-stone-900 font-sans">{{ comment.author }}</span>
                      <span class="text-[10px] text-stone-400 font-sans">{{ comment.date }}</span>
                    </div>
                    <p class="text-xs text-stone-700 font-sans leading-relaxed">{{ comment.text }}</p>
                  </div>
                } @empty {
                  <p class="text-xs text-stone-500 italic font-sans">No comments yet. Be the first to share your voice!</p>
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    }
  `
})
export class StoryDetail {
  storyService = inject(StoryService);
  commentAuthor = '';
  commentText = '';
  isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  formatContent(content: string): string[] {
    return content.split('\n\n').filter(p => p.trim().length > 0);
  }

  closeModal() {
    this.stopSpeech();
    this.storyService.activeStoryModal.set(null);
  }

  submitComment(storyId: string) {
    if (!this.commentText.trim()) return;
    this.storyService.addComment(storyId, this.commentAuthor, this.commentText);
    this.commentText = '';
    this.commentAuthor = '';
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Story link copied to clipboard!');
  }

  readAloud(story: Story) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (this.isSpeaking) {
      this.stopSpeech();
      return;
    }

    const textToRead = `${story.title}. By ${story.author}. ${story.excerpt}. ${story.content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Configure for realistic news reading cadence
    utterance.rate = 0.98;
    utterance.pitch = 0.96;
    utterance.volume = 1.0;

    // Pick best available English voice (e.g. Google UK English Female / Natural)
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('UK English') || v.name.includes('Samantha')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
    };

    this.currentUtterance = utterance;
    this.isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }
}
