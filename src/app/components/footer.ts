import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule],
  template: `
    <footer class="bg-stone-900 text-stone-300 pt-16 pb-12 mt-20 border-t border-stone-800">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div class="space-y-4 md:col-span-1">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-serif font-bold">
              GS
            </div>
            <span class="text-lg font-bold font-serif text-white tracking-tight">
              Ga Sekororo
            </span>
          </div>
          <p class="text-xs text-stone-400 leading-relaxed">
            Your premier destination for local news, cultural heritage, entertainment, podcasts, and community media from Ga-Sekororo, Limpopo.
          </p>
        </div>

        <div>
          <h4 class="text-xs uppercase tracking-widest font-sans font-semibold text-white mb-4">Categories</h4>
          <ul class="space-y-2 text-xs text-stone-400 font-sans">
            <li><a href="#news" class="hover:text-white transition-colors">Local News & Wards</a></li>
            <li><a href="#gallery" class="hover:text-white transition-colors">Multimedia Gallery</a></li>
            <li><a href="#events" class="hover:text-white transition-colors">Events Calendar</a></li>
            <li><a href="#podcasts" class="hover:text-white transition-colors">Voice of Sekororo Podcast</a></li>
            <li><a href="#sports" class="hover:text-white transition-colors">Sports & Regional League</a></li>
          </ul>
        </div>

        <!-- Newsletter Subscription Form -->
        <div class="md:col-span-2 space-y-4">
          <h4 class="text-xs uppercase tracking-widest font-sans font-semibold text-white">Weekly Digest Newsletter</h4>
          <p class="text-xs text-stone-400 leading-relaxed">
            Sign up to receive our weekly dispatch straight to your inbox with top local stories, cultural updates, and upcoming community events in Ga-Sekororo.
          </p>

          @if (isSubscribed()) {
            <div class="p-3 bg-emerald-900/50 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-sans flex items-center gap-2">
              <span class="material-icons text-sm">check_circle</span>
              <span>Thank you for subscribing! You are now signed up for the weekly digest.</span>
            </div>
          } @else {
            <form (ngSubmit)="onSubscribe()" class="flex flex-col sm:flex-row gap-2">
              <input 
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="Enter your email address..."
                class="flex-1 px-3.5 py-2.5 text-xs bg-stone-800 border border-stone-700 text-white rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button 
                type="submit"
                [disabled]="!email.trim()"
                class="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shadow-sm"
              >
                Subscribe
              </button>
            </form>
          }
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
        <div>
          &copy; 2026 Ga Sekororo Local Stories. All rights reserved.
        </div>
        <div class="flex items-center gap-6 mt-4 sm:mt-0">
          <a href="#" class="hover:text-stone-300 transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-stone-300 transition-colors">Terms of Use</a>
          <a href="#" class="hover:text-stone-300 transition-colors">Editorial Code</a>
        </div>
      </div>
    </footer>
  `
})
export class Footer {
  email = '';
  isSubscribed = signal(false);

  onSubscribe() {
    if (!this.email.trim()) return;
    this.isSubscribed.set(true);
    this.email = '';
  }
}
