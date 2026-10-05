import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from './components/header';
import { HeroTicker } from './components/hero-ticker';
import { StoryList } from './components/story-list';
import { StoryDetail } from './components/story-detail';
import { Gallery } from './components/gallery';
import { EventsCalendar } from './components/events-calendar';
import { Podcasts } from './components/podcasts';
import { AiReporterModal } from './components/ai-reporter-modal';
import { AiStoryGeneratorModal } from './components/ai-story-generator-modal';
import { SubmitStory } from './components/submit-story';
import { AdminDashboard } from './components/admin-dashboard';
import { Footer } from './components/footer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    Header,
    HeroTicker,
    StoryList,
    StoryDetail,
    Gallery,
    EventsCalendar,
    Podcasts,
    AiReporterModal,
    AiStoryGeneratorModal,
    SubmitStory,
    AdminDashboard,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
