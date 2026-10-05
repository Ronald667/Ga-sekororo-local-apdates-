import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { StoryService } from '../services/story.service';
import { FormsModule } from '@angular/forms';

interface ChatMsg {
  sender: 'user' | 'reporter';
  text: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ai-reporter-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (storyService.isAiReporterOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 animate-fade-in">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col my-auto max-h-[85vh]">
          
          <!-- Modal Header -->
          <div class="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white shadow-sm">
                M
              </div>
              <div>
                <h3 class="text-base font-serif font-bold">Mmanapo — Sekororo AI Reporter</h3>
                <span class="text-[10px] text-amber-300 font-sans block">Your cultural guide & local history expert</span>
              </div>
            </div>

            <button 
              type="button"
              (click)="storyService.isAiReporterOpen.set(false)"
              class="text-stone-400 hover:text-white p-1 rounded-lg"
            >
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <!-- Chat Messages Body -->
          <div class="flex-1 p-6 overflow-y-auto space-y-4 bg-stone-50">
            <div class="bg-white border border-stone-200 p-4 rounded-xl shadow-sm max-w-lg">
              <p class="text-xs text-stone-700 leading-relaxed font-sans">
                Sawubona! I am Mmanapo, your AI reporter for Ga Sekororo Local Stories. Ask me anything about our traditional leadership, local history, tourism around the Blyde River foothills, or agricultural developments!
              </p>
            </div>

            @for (msg of messages(); track $index) {
              <div [class]="msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'">
                <div [class]="msg.sender === 'user' ? 'bg-stone-900 text-white p-4 rounded-xl max-w-lg shadow-sm text-xs leading-relaxed' : 'bg-white border border-stone-200 text-stone-800 p-4 rounded-xl max-w-lg shadow-sm text-xs leading-relaxed'">
                  {{ msg.text }}
                </div>
              </div>
            }

            @if (isLoading()) {
              <div class="flex justify-start">
                <div class="bg-white border border-stone-200 text-stone-500 p-3 rounded-xl text-xs flex items-center gap-2">
                  <span class="material-icons text-sm animate-spin">autorenew</span>
                  <span>Mmanapo is researching and writing...</span>
                </div>
              </div>
            }
          </div>

          <!-- Question Input Footer -->
          <div class="p-4 bg-white border-t border-stone-200 flex items-center gap-2">
            <input 
              type="text"
              [(ngModel)]="currentQuestion"
              (keyup.enter)="sendQuestion()"
              placeholder="Ask about Ga-Sekororo culture, history, or news..."
              class="flex-1 px-4 py-2.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
            />
            <button 
              type="button"
              (click)="sendQuestion()"
              [disabled]="isLoading() || !currentQuestion.trim()"
              class="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Ask
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class AiReporterModal {
  storyService = inject(StoryService);
  currentQuestion = '';
  isLoading = signal(false);
  messages = signal<ChatMsg[]>([
    { sender: 'reporter', text: 'How can I assist you with stories or information about Ga-Sekororo today?' }
  ]);

  async sendQuestion() {
    const q = this.currentQuestion.trim();
    if (!q || this.isLoading()) return;

    this.messages.update(list => [...list, { sender: 'user', text: q }]);
    this.currentQuestion = '';
    this.isLoading.set(true);

    const answer = await this.storyService.askAiReporter(q);
    this.messages.update(list => [...list, { sender: 'reporter', text: answer }]);
    this.isLoading.set(false);
  }
}
