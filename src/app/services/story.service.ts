import { Injectable, signal } from '@angular/core';

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categories: string[];
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  isFeatured?: boolean;
  views: number;
  likes: number;
  comments: Comment[];
}

export interface PodcastEpisode {
  id: string;
  title: string;
  showName: string;
  duration: string;
  date: string;
  description: string;
  audioUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Local Events' | 'People' | 'Places';
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  description: string;
  date: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  category: 'Cultural' | 'Sports' | 'Business' | 'Community Meeting' | 'Music & Arts';
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
}

export interface SubmissionItem {
  id: string;
  type: 'Story' | 'Media' | 'Event';
  title: string;
  submitter: string;
  email: string;
  content: string;
  category: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  mediaUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private initialStories: Story[] = [
    {
      id: '1',
      title: 'Sekororo Traditional Council Launches Youth Agricultural Skills Initiative',
      excerpt: 'Under the leadership of Kgoshi Sekororo, a new multi-million rand youth farming program opens across local villages to boost sustainable avocado and macadamia production.',
      content: `Ga-Sekororo — In a landmark gathering at the Tribal Authority offices yesterday, the Sekororo Traditional Council officially launched the "Mohlale wa Temo" (Pathway to Agriculture) youth initiative. Aimed at equipping young people from wards 1 through 6 with modern agritech and sustainable farming skills, the program partners with local commercial orchards and agricultural cooperatives.\n\n"Our land along the lush foothills of the Drakensberg escarpment is blessed with fertile soil and abundant water resources," Kgoshi Sekororo stated during the keynote address. "We cannot afford to leave our youth behind when the global demand for Limpopo avocados, citrus, and macadamia nuts is soaring."\n\nParticipants will undergo a 6-month intensive training covering soil management, drip irrigation systems, supply chain logistics, and cooperative governance. Several local youth representatives expressed immense gratitude, noting that the initiative bridges the gap between traditional land stewardship and modern entrepreneurial success. Registration for the first cohort opens next Monday at local community centers.`,
      category: 'News',
      categories: ['News', 'Community', 'Business'],
      author: 'Thabo Masedi',
      date: '24 Sep 2026',
      readTime: '4 min read',
      imageUrl: '/src/assets/images/hero_sekororo_valley_1790237855080.jpg',
      isFeatured: true,
      views: 1420,
      likes: 388,
      comments: [
        { id: 'c1', author: 'Lerato Kgatla', text: 'This is brilliant news for our youth in Ga-Sekororo! Looking forward to seeing the co-ops thrive.', date: '2 hours ago' },
        { id: 'c2', author: 'Sello Makgoba', text: 'Finally practical support for agriculture. Where can we pick up registration forms?', date: '1 hour ago' }
      ]
    },
    {
      id: '2',
      title: 'Rhythmic Heritage: Celebrating Traditional Lobedu Music and Dance Festivals',
      excerpt: 'Local dance troupes and traditional drum masters gather at the annual Sekororo Cultural Heritage Celebration, drawing visitors from across Limpopo.',
      content: `The rhythmic beating of traditional drums echoed across the valleys of Ga-Sekororo this past weekend as hundreds gathered for the annual Heritage Celebration. Dressed in vibrant traditional attire, performers showcased ancient Lobedu and Northern Sotho dances that have been passed down through generations.\n\nThe festival serves not only as entertainment but as a living archive of community memory. Elders led storytelling circles, recounting the rich history of the Sekororo chieftaincy and its ancestral connection to the Blyde River landscape.\n\n"Music and dance are our spiritual anchors," remarked cultural curator Mavis Sekgobela. "When our children dance to these ancestral rhythms, they carry forward our identity with pride." The event concluded with a grand feast featuring traditional delicacies and local acoustic performances.`,
      category: 'Culture',
      categories: ['Culture', 'Entertainment', 'Community'],
      author: 'Kgomotso Mohlala',
      date: '23 Sep 2026',
      readTime: '3 min read',
      imageUrl: '/src/assets/images/cultural_dance_sekororo_1790237866246.jpg',
      views: 950,
      likes: 245,
      comments: [
        { id: 'c3', author: 'Ntsako Baloyi', text: 'What an unforgettable weekend! The drumming was out of this world.', date: 'Yesterday' }
      ]
    },
    {
      id: '3',
      title: 'From Farm Gate to Global Markets: Ga-Sekororo Fresh Produce Rising',
      excerpt: 'Local farmers expand export channels as international buyers turn their attention to the pristine orchards nestled near the Blyde River Canyon.',
      content: `Ga-Sekororo has long been an agricultural powerhouse, but recent infrastructure upgrades and cooperative packaging facilities are allowing local farmers to sell directly to international markets in Europe and the Middle East.\n\nAgricultural cooperatives in the region reported a 35% increase in avocado and mango yields this season, thanks to favorable seasonal rains and improved irrigation infrastructure.\n\n"We are no longer just supplying local fresh produce markets; our fruit is now landing on supermarket shelves in London and Dubai," says Johannes Mothapo, head of the Sekororo Farmers Union. This economic surge is creating sustainable local employment and encouraging young entrepreneurs to invest in agro-processing ventures right at home.`,
      category: 'Business',
      categories: ['Business', 'News'],
      author: 'Phasha Ronny',
      date: '22 Sep 2026',
      readTime: '5 min read',
      imageUrl: '/src/assets/images/local_farming_market_1790237877238.jpg',
      views: 1180,
      likes: 312,
      comments: []
    },
    {
      id: '4',
      title: 'Tzaneen & Sekororo Super League: Weekend Derby Delivers 5-Goal Thriller',
      excerpt: 'Ga-Sekororo United secure a dramatic last-minute victory against visiting rivals in front of a roaring home crowd at the central sports ground.',
      content: `Football fever gripped Ga-Sekororo on Saturday afternoon as the local sports stadium filled to capacity for the much-anticipated regional derby against Tzaneen Rovers.\n\nIn a pulsating encounter that kept fans on the edge of their seats, Ga-Sekororo United snatched a dramatic winning goal in the 91st minute, courtesy of star striker Neo "Jomo" Modiselle.\n\n"The boys played with immense heart," declared Coach Thomas Raphala. "This victory belongs to every single supporter who came out to wave our colours." Celebrations spilled into the evening across local community entertainment hubs.`,
      category: 'Sports',
      categories: ['Sports', 'Entertainment'],
      author: 'Bucie Nkoana',
      date: '21 Sep 2026',
      readTime: '3 min read',
      imageUrl: '/src/assets/images/hero_sekororo_valley_1790237855080.jpg',
      views: 890,
      likes: 198,
      comments: []
    },
    {
      id: '5',
      title: 'Soundwaves of Limpopo: Emerging Artists Fusion of Maskandi and Afro-Soul',
      excerpt: 'Local music producers in Ga-Sekororo are blending traditional guitar melodies with modern soulful beats, capturing national radio airplay.',
      content: `The vibrant soundscape of Ga-Sekororo is undergoing an artistic renaissance. A new wave of young producers and vocalists are fusing traditional acoustic Maskandi guitars with smooth contemporary Afro-soul chords.\n\nTracks recorded in local home studios are rapidly trending on digital streaming platforms and community radio stations across Limpopo. Artists like Limpopo Boy and Sister Khumo cite the tranquil beauty of the Drakensberg mountains as their primary creative inspiration.\n\n"We want the world to feel the heartbeat of our villages through our music," shares producer and songwriter Kabelo Mello. With upcoming showcases planned for Tzaneen and Polokwane, the future of Ga-Sekororo entertainment shines brighter than ever.`,
      category: 'Entertainment',
      categories: ['Entertainment', 'Culture'],
      author: 'Mpho Sebone',
      date: '20 Sep 2026',
      readTime: '4 min read',
      imageUrl: '/src/assets/images/cultural_dance_sekororo_1790237866246.jpg',
      views: 1310,
      likes: 420,
      comments: []
    }
  ];

  private initialPodcasts: PodcastEpisode[] = [
    {
      id: 'p1',
      title: 'Episode 24: Preserving Lobedu History and Oral Traditions',
      showName: 'Voice of Sekororo Podcast',
      duration: '32 min',
      date: '22 Sep 2026',
      description: 'An in-depth conversation with tribal elders regarding ancient heritage sites, royal genealogy, and cultural preservation in modern times.',
      audioUrl: '#'
    },
    {
      id: 'p2',
      title: 'Episode 18: Agropreneurship and Exporting Limpopo Avocadoes',
      showName: 'Limpopo Business Hour',
      duration: '28 min',
      date: '15 Sep 2026',
      description: 'Examining cooperative farming models, irrigation grants, and export logistics for emerging farmers in Ga-Sekororo.',
      audioUrl: '#'
    }
  ];

  private initialGallery: GalleryItem[] = [
    {
      id: 'g1',
      title: 'Annual Sekororo Cultural Heritage Dance',
      category: 'Local Events',
      type: 'image',
      url: '/src/assets/images/cultural_dance_sekororo_1790237866246.jpg',
      thumbnailUrl: '/src/assets/images/cultural_dance_sekororo_1790237866246.jpg',
      description: 'Traditional drum performance and dance troupe gathering at the tribal grounds.',
      date: '23 Sep 2026'
    },
    {
      id: 'g2',
      title: 'Drakensberg Escarpment Foothills',
      category: 'Places',
      type: 'image',
      url: '/src/assets/images/hero_sekororo_valley_1790237855080.jpg',
      thumbnailUrl: '/src/assets/images/hero_sekororo_valley_1790237855080.jpg',
      description: 'Panoramic view of lush green valleys and avocado orchards near Ga-Sekororo.',
      date: '24 Sep 2026'
    },
    {
      id: 'g3',
      title: 'Local Agricultural Market & Farming Stall',
      category: 'Places',
      type: 'image',
      url: '/src/assets/images/local_farming_market_1790237877238.jpg',
      thumbnailUrl: '/src/assets/images/local_farming_market_1790237877238.jpg',
      description: 'Fresh organic avocados, mangoes, and citrus at the weekly cooperative market.',
      date: '22 Sep 2026'
    },
    {
      id: 'g4',
      title: 'Traditional Elders Storytelling Circle',
      category: 'People',
      type: 'image',
      url: '/src/assets/images/cultural_dance_sekororo_1790237866246.jpg',
      thumbnailUrl: '/src/assets/images/cultural_dance_sekororo_1790237866246.jpg',
      description: 'Village elders sharing oral history with the younger generation.',
      date: '20 Sep 2026'
    },
    {
      id: 'g5',
      title: 'Sekororo United Football Final Match Highlights',
      category: 'Local Events',
      type: 'video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: '/src/assets/images/hero_sekororo_valley_1790237855080.jpg',
      description: 'Exciting 91st minute winning goal highlights from the central sports ground.',
      date: '21 Sep 2026'
    }
  ];

  private initialEvents: CommunityEvent[] = [
    {
      id: 'e1',
      title: 'Sekororo Traditional Council Youth Workshop',
      category: 'Community Meeting',
      date: '2026-10-05',
      time: '10:00 AM',
      location: 'Sekororo Tribal Authority Hall',
      organizer: 'Sekororo Youth Desk',
      description: 'Informational session on the newly launched Mohlale wa Temo agricultural skills and co-op program.'
    },
    {
      id: 'e2',
      title: 'Ga-Sekororo Heritage Music & Dance Festival',
      category: 'Cultural',
      date: '2026-10-12',
      time: '12:00 PM',
      location: 'Central Sports Ground, Ward 3',
      organizer: 'Cultural Heritage Directorate',
      description: 'Annual showcase of Lobedu and Northern Sotho dance troupes, traditional cuisine, and acoustic performances.'
    },
    {
      id: 'e3',
      title: 'Super League Derby: Sekororo United vs Burgersfort FC',
      category: 'Sports',
      date: '2026-10-18',
      time: '03:00 PM',
      location: 'Sekororo Main Stadium',
      organizer: 'Regional Football Association',
      description: 'High-stakes regional football clash with live entertainment and food stalls.'
    },
    {
      id: 'e4',
      title: 'Agropreneurship & Export Seminar for Farmers',
      category: 'Business',
      date: '2026-10-25',
      time: '09:00 AM',
      location: 'Cooperative Packhouse Center',
      organizer: 'Sekororo Farmers Union',
      description: 'Expert talks on drip irrigation grants, organic certification, and international export logistics.'
    }
  ];

  private initialSubmissions: SubmissionItem[] = [
    {
      id: 'sub1',
      type: 'Story',
      title: 'New Water Borehole Project Completed in Ward 4',
      submitter: 'Kabelo Mello',
      email: 'kabelo@gasekororo.co.za',
      content: 'Community volunteers and local contractors successfully installed a solar-powered borehole providing clean water to over 300 households in Ward 4.',
      category: 'Local News',
      date: '24 Sep 2026',
      status: 'Pending'
    },
    {
      id: 'sub2',
      type: 'Event',
      title: 'Youth Chess Tournament at Community Library',
      submitter: 'Ntsako Baloyi',
      email: 'ntsako@gmail.com',
      content: 'Local high school students are organizing a weekend chess championship to foster critical thinking and youth engagement.',
      category: 'Sports',
      date: '23 Sep 2026',
      status: 'Pending'
    }
  ];

  stories = signal<Story[]>(this.initialStories);
  podcasts = signal<PodcastEpisode[]>(this.initialPodcasts);
  gallery = signal<GalleryItem[]>(this.initialGallery);
  events = signal<CommunityEvent[]>(this.initialEvents);
  submissions = signal<SubmissionItem[]>(this.initialSubmissions);

  selectedCategory = signal<string>('All');
  searchQuery = signal<string>('');
  bookmarkedIds = signal<string[]>([]);
  activeStoryModal = signal<Story | null>(null);
  isAiReporterOpen = signal<boolean>(false);
  isAiStoryModalOpen = signal<boolean>(false);
  isSubmitModalOpen = signal<boolean>(false);
  isAdminOpen = signal<boolean>(false);
  isAudioPlaying = signal<boolean>(false);
  currentAudioTitle = signal<string>('');

  breakingNews = signal<string[]>([
    '🔥 Sekororo Traditional Council launches multi-million rand youth agricultural skills initiative.',
    '⚽ Ga-Sekororo United secure dramatic 3-2 victory in weekend regional football derby.',
    '🥑 Local farming cooperatives report a 35% surge in export yields for avocado and citrus harvest.',
    '🎶 Annual Heritage Celebration draws record crowds with traditional drumming and dance troupes.'
  ]);

  constructor() {
    try {
      const saved = localStorage.getItem('sekororo_bookmarks');
      if (saved) {
        this.bookmarkedIds.set(JSON.parse(saved));
      }
      const savedStories = localStorage.getItem('sekororo_stories');
      if (savedStories) {
        this.stories.set(JSON.parse(savedStories));
      }
      const savedEvents = localStorage.getItem('sekororo_events');
      if (savedEvents) {
        this.events.set(JSON.parse(savedEvents));
      }
      const savedSubmissions = localStorage.getItem('sekororo_submissions');
      if (savedSubmissions) {
        this.submissions.set(JSON.parse(savedSubmissions));
      }
    } catch (e) {}
  }

  saveToStorage() {
    try {
      localStorage.setItem('sekororo_stories', JSON.stringify(this.stories()));
      localStorage.setItem('sekororo_events', JSON.stringify(this.events()));
      localStorage.setItem('sekororo_submissions', JSON.stringify(this.submissions()));
    } catch (e) {}
  }

  toggleBookmark(id: string) {
    this.bookmarkedIds.update(ids => {
      const exists = ids.includes(id);
      const updated = exists ? ids.filter(i => i !== id) : [...ids, id];
      try {
        localStorage.setItem('sekororo_bookmarks', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }

  addComment(storyId: string, author: string, text: string) {
    this.stories.update(list => list.map(s => {
      if (s.id === storyId) {
        const newComment: Comment = {
          id: 'c_' + Date.now(),
          author: author || 'Community Member',
          text,
          date: 'Just now'
        };
        return { ...s, comments: [newComment, ...s.comments] };
      }
      return s;
    }));
    this.saveToStorage();

    const currentActive = this.activeStoryModal();
    if (currentActive && currentActive.id === storyId) {
      const updated = this.stories().find(s => s.id === storyId);
      if (updated) this.activeStoryModal.set(updated);
    }
  }

  likeStory(storyId: string) {
    this.stories.update(list => list.map(s => {
      if (s.id === storyId) {
        return { ...s, likes: s.likes + 1 };
      }
      return s;
    }));
    this.saveToStorage();

    const currentActive = this.activeStoryModal();
    if (currentActive && currentActive.id === storyId) {
      const updated = this.stories().find(s => s.id === storyId);
      if (updated) this.activeStoryModal.set(updated);
    }
  }

  addSubmission(submission: Omit<SubmissionItem, 'id' | 'date' | 'status'>) {
    const newItem: SubmissionItem = {
      id: 'sub_' + Date.now(),
      ...submission,
      date: 'Today',
      status: 'Pending'
    };
    this.submissions.update(list => [newItem, ...list]);
    this.saveToStorage();
  }

  approveSubmission(id: string) {
    const sub = this.submissions().find(s => s.id === id);
    if (!sub) return;

    if (sub.type === 'Story') {
      const cat = sub.category || 'News';
      const newStory: Story = {
        id: 'pub_' + Date.now(),
        title: sub.title,
        excerpt: sub.content.substring(0, 120) + '...',
        content: sub.content,
        category: cat,
        categories: [cat, 'Community'],
        author: sub.submitter,
        date: 'Today',
        readTime: '3 min read',
        imageUrl: sub.mediaUrl || '/src/assets/images/hero_sekororo_valley_1790237855080.jpg',
        views: 1,
        likes: 1,
        comments: []
      };
      this.stories.update(list => [newStory, ...list]);
    } else if (sub.type === 'Event') {
      const newEvent: CommunityEvent = {
        id: 'ev_' + Date.now(),
        title: sub.title,
        category: (sub.category as any) || 'Cultural',
        date: '2026-10-30',
        time: '10:00 AM',
        location: 'Ga-Sekororo Community Center',
        organizer: sub.submitter,
        description: sub.content
      };
      this.events.update(list => [newEvent, ...list]);
    }

    this.submissions.update(list => list.map(s => s.id === id ? { ...s, status: 'Approved' } : s));
    this.saveToStorage();
  }

  rejectSubmission(id: string) {
    this.submissions.update(list => list.map(s => s.id === id ? { ...s, status: 'Rejected' } : s));
    this.saveToStorage();
  }

  addEvent(event: Omit<CommunityEvent, 'id'>) {
    const newEvent: CommunityEvent = {
      id: 'e_' + Date.now(),
      ...event
    };
    this.events.update(list => [newEvent, ...list]);
    this.saveToStorage();
  }

  updateStory(updatedStory: Story) {
    this.stories.update(list => list.map(s => s.id === updatedStory.id ? updatedStory : s));
    this.saveToStorage();
  }

  deleteStory(id: string) {
    this.stories.update(list => list.filter(s => s.id !== id));
    this.saveToStorage();
  }

  async generateAiStory(prompt: string, category: string): Promise<Story | null> {
    try {
      const res = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category })
      });
      const data = await res.json();
      if (data.success && data.story) {
        const cat = category || 'News';
        const newStory: Story = {
          id: 'ai_' + Date.now(),
          title: data.story.title || prompt,
          excerpt: data.story.excerpt || 'Generated community story from Ga-Sekororo.',
          content: data.story.content || prompt,
          category: cat,
          categories: [cat, 'News'],
          author: data.story.author || 'Sekororo AI News Desk',
          date: 'Today',
          readTime: data.story.readTime || '3 min read',
          imageUrl: '/src/assets/images/hero_sekororo_valley_1790237855080.jpg',
          views: 1,
          likes: 5,
          comments: []
        };
        this.stories.update(list => [newStory, ...list]);
        this.saveToStorage();
        return newStory;
      }
    } catch (e) {
      console.error('Failed to generate AI story', e);
    }
    return null;
  }

  async fetchGoogleNews(): Promise<Story | null> {
    try {
      const res = await fetch('/api/ai/fetch-google-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success && data.story) {
        const cat = data.story.category || 'News';
        const newStory: Story = {
          id: 'google_news_' + Date.now(),
          title: data.story.title || 'Latest Google News Dispatch: Ga-Sekororo',
          excerpt: data.story.excerpt || 'Real-time intelligence report via Google Search grounding.',
          content: data.story.content || '',
          category: cat,
          categories: [cat, 'News', 'Community'],
          author: data.story.author || 'Google News AI Desk',
          date: 'Today',
          readTime: data.story.readTime || '3 min read',
          imageUrl: '/src/assets/images/hero_sekororo_valley_1790237855080.jpg',
          views: 1,
          likes: 14,
          comments: []
        };
        this.stories.update(list => [newStory, ...list]);
        this.saveToStorage();
        return newStory;
      }
    } catch (e) {
      console.error('Failed to fetch Google news', e);
    }
    return null;
  }

  async askAiReporter(question: string): Promise<string> {
    try {
      const res = await fetch('/api/ai/ask-reporter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        return data.answer;
      }
    } catch (e) {
      console.error('Failed to ask AI reporter', e);
    }
    return 'Greetings! I am Mmanapo, your Sekororo Cultural Guide. I am currently having trouble connecting to the network. Please try again shortly!';
  }
}
