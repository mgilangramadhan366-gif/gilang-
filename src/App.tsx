import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  Headphones,
  Menu,
  Search,
  SlidersHorizontal,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import { HERO_LIBRARY_IMAGE, LIBRARY_BOOKS } from './data/books';
import {
  AccessibilitySettings,
  AgeGroup,
  Book,
  BookCategory,
  BookmarkItem,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  ReadingProgressMap,
} from './types/library';
import { useSpeechEngine } from './hooks/useSpeechEngine';
import { AccessibilityDrawer } from './components/AccessibilityDrawer';
import { BookReader } from './components/BookReader';
import { CoverArtwork } from './components/CoverArtwork';
import { ShortcutsModal } from './components/ShortcutsModal';

type ActiveView = 'catalog' | 'reader' | 'bookmarks';

const AGE_GROUPS: AgeGroup[] = [
  'Semua Usia',
  '4–6 Tahun',
  '7–9 Tahun',
  '10–12 Tahun',
];

const CATEGORIES: BookCategory[] = [
  'Semua',
  'Fabel & Dongeng',
  'Sains Anak',
  'Persahabatan & Inklusi',
  'Alam & Nusantara',
  'Kreativitas & Seni',
];

const STORAGE_KEYS = {
  settings: 'pustaka_inklusi_settings_v2',
  bookmarks: 'pustaka_inklusi_bookmarks_v2',
  progress: 'pustaka_inklusi_progress_v2',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

function loadArrayFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [settings, setSettings] = useState<AccessibilitySettings>(() =>
    loadFromStorage(STORAGE_KEYS.settings, DEFAULT_ACCESSIBILITY_SETTINGS)
  );
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() =>
    loadArrayFromStorage(STORAGE_KEYS.bookmarks, [])
  );
  const [progressMap, setProgressMap] = useState<ReadingProgressMap>(() =>
    loadFromStorage(STORAGE_KEYS.progress, {})
  );

  const [activeView, setActiveView] = useState<ActiveView>('catalog');
  const [selectedBookId, setSelectedBookId] = useState<string>(
    LIBRARY_BOOKS[0].id
  );
  const [readerJump, setReaderJump] = useState<{
    chapterIndex: number;
    sentenceIndex: number;
  }>({ chapterIndex: 0, sentenceIndex: 0 });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeAgeGroup, setActiveAgeGroup] = useState<AgeGroup>('Semua Usia');
  const [activeCategory, setActiveCategory] = useState<BookCategory>('Semua');
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [liveMessage, setLiveMessage] = useState('');
  const [heroImageError, setHeroImageError] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);

  const speech = useSpeechEngine();

  // Persist settings & apply root theme/motion classes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors
    }

    const root = document.documentElement;
    root.classList.remove(
      'dark',
      'theme-dark',
      'theme-high-contrast',
      'theme-cream',
      'reduce-motion'
    );

    if (settings.theme === 'dark') {
      root.classList.add('dark', 'theme-dark');
    } else if (settings.theme === 'high-contrast') {
      root.classList.add('dark', 'theme-high-contrast');
    } else if (settings.theme === 'cream') {
      root.classList.add('theme-cream');
    }

    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
    } catch {
      // Ignore storage quota errors
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progressMap));
    } catch {
      // Ignore storage quota errors
    }
  }, [progressMap]);

  const announce = useCallback(
    (message: string) => {
      setLiveMessage('');
      requestAnimationFrame(() => {
        setLiveMessage(message);
      });
      if (settings.screenReaderAutoSpeak) {
        speech.speakUI(
          message,
          settings.speechRate,
          settings.speechPitch,
          settings.preferredVoiceURI
        );
      }
    },
    [
      settings.screenReaderAutoSpeak,
      settings.speechRate,
      settings.speechPitch,
      settings.preferredVoiceURI,
      speech,
    ]
  );

  const updateSettings = useCallback(
    (partial: Partial<AccessibilitySettings>) => {
      setSettings((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  const handleSaveProgress = useCallback(
    (bookId: string, chapterIndex: number, sentenceIndex: number) => {
      setProgressMap((prev) => {
        const existing = prev[bookId];
        if (
          existing &&
          existing.chapterIndex === chapterIndex &&
          existing.sentenceIndex === sentenceIndex
        ) {
          return prev;
        }
        return {
          ...prev,
          [bookId]: {
            ...existing,
            chapterIndex,
            sentenceIndex,
            updatedAt: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  const handleMarkCompleted = useCallback((bookId: string) => {
    setProgressMap((prev) => {
      const existing = prev[bookId];
      return {
        ...prev,
        [bookId]: {
          chapterIndex: existing?.chapterIndex ?? 0,
          sentenceIndex: existing?.sentenceIndex ?? 0,
          completed: true,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const handleToggleBookmark = useCallback(
    (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => {
      setBookmarks((prev) => {
        const exists = prev.find(
          (b) =>
            b.bookId === item.bookId &&
            b.chapterIndex === item.chapterIndex &&
            b.sentenceIndex === item.sentenceIndex
        );
        if (exists) {
          announce('Penanda halaman dihapus.');
          return prev.filter((b) => b.id !== exists.id);
        }
        const created: BookmarkItem = {
          ...item,
          id: `${item.bookId}-${item.chapterIndex}-${item.sentenceIndex}-${Date.now()}`,
          createdAt: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        };
        announce(
          `Penanda disimpan pada ${item.bookTitle}, Bab ${item.chapterIndex + 1}, Kalimat ${item.sentenceIndex + 1}.`
        );
        return [created, ...prev];
      });
    },
    [announce]
  );

  const openBook = useCallback(
    (book: Book, chapterIdx?: number, sentenceIdx?: number) => {
      const saved = progressMap[book.id];
      const nextChapter = chapterIdx ?? saved?.chapterIndex ?? 0;
      const nextSentence = sentenceIdx ?? saved?.sentenceIndex ?? 0;

      setSelectedBookId(book.id);
      setReaderJump({ chapterIndex: nextChapter, sentenceIndex: nextSentence });
      setActiveView('reader');
      setIsMobileMenuOpen(false);
      window.scrollTo({
        top: 0,
        behavior: settings.reduceMotion ? 'auto' : 'smooth',
      });
      announce(
        `Membuka cerita ${book.title} karya ${book.author}, Bab ${nextChapter + 1}.`
      );
    },
    [progressMap, settings.reduceMotion, announce]
  );

  // Global keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName.toLowerCase();
      const isTyping =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target?.isContentEditable;

      if (isTyping) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === '/') {
        e.preventDefault();
        setActiveView('catalog');
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
        announce('Fokus dipindahkan ke kotak pencarian cerita.');
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        const nextTheme =
          settings.theme === 'high-contrast' ? 'paper' : 'high-contrast';
        updateSettings({ theme: nextTheme });
        announce(
          nextTheme === 'high-contrast'
            ? 'Mode Kontras Ekstrem AAA diaktifkan.'
            : 'Tema kembali ke Kertas Cerita.'
        );
      } else if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAccessibilityOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [settings.theme, updateSettings, announce]);

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LIBRARY_BOOKS.filter((book) => {
      const matchesAge =
        activeAgeGroup === 'Semua Usia' || book.ageGroup === activeAgeGroup;
      const matchesCat =
        activeCategory === 'Semua' || book.category === activeCategory;
      if (!matchesAge || !matchesCat) return false;
      if (!q) return true;
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.summary.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeAgeGroup, activeCategory]);

  const activeBook = useMemo(
    () =>
      LIBRARY_BOOKS.find((b) => b.id === selectedBookId) ?? LIBRARY_BOOKS[0],
    [selectedBookId]
  );

  const completedBooks = useMemo(
    () => LIBRARY_BOOKS.filter((b) => progressMap[b.id]?.completed),
    [progressMap]
  );

  const navigateTo = (view: ActiveView) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
    const labelMap: Record<ActiveView, string> = {
      catalog: 'Halaman Katalog Cerita Anak Pustaka Inklusi',
      reader: `Ruang Baca ${activeBook.title}`,
      bookmarks: `Jejak Bacaan dan Penanda Halaman, ${bookmarks.length} penanda tersimpan`,
    };
    announce(labelMap[view]);
    mainContentRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Skip Navigation Links for Keyboard & Screen Reader Users */}
      <a href="#main-content" className="skip-link">
        Lompat ke Konten Utama
      </a>
      <a
        href="#catalog-search"
        onClick={() => {
          setActiveView('catalog');
          requestAnimationFrame(() => searchInputRef.current?.focus());
        }}
        className="skip-link"
      >
        Lompat ke Pencarian Cerita
      </a>

      {/* ARIA Live Announcement Region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveMessage}
      </div>

      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#katalog"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('catalog');
            }}
            className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0"
          >
            Pustaka Inklusi
          </a>

          {/* Zone 2: 4 Single-Line Nav Links */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden items-center gap-6 md:flex"
          >
            <button
              type="button"
              onClick={() => navigateTo('catalog')}
              aria-current={activeView === 'catalog' ? 'page' : undefined}
              className={`min-h-[44px] border-b-2 px-1 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'catalog'
                  ? 'border-[var(--accent-primary)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
              }`}
            >
              Katalog
            </button>
            <button
              type="button"
              onClick={() => navigateTo('reader')}
              aria-current={activeView === 'reader' ? 'page' : undefined}
              className={`min-h-[44px] border-b-2 px-1 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'reader'
                  ? 'border-[var(--accent-primary)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
              }`}
            >
              Pembaca
            </button>
            <button
              type="button"
              onClick={() => navigateTo('bookmarks')}
              aria-current={activeView === 'bookmarks' ? 'page' : undefined}
              className={`min-h-[44px] border-b-2 px-1 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'bookmarks'
                  ? 'border-[var(--accent-primary)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
              }`}
            >
              Penanda ({bookmarks.length})
            </button>
            <button
              type="button"
              onClick={() => setIsShortcutsOpen(true)}
              className="min-h-[44px] border-b-2 border-transparent px-1 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] whitespace-nowrap shrink-0"
            >
              Pintasan
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAccessibilityOpen(true)}
              aria-label="Buka Pusat Aksesibilitas dan Pembaca Layar"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-bold text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              <span>Aksesibilitas</span>
            </button>

            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu navigasi'}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-nav-menu"
            aria-label="Navigasi Seluler"
            className="border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => navigateTo('catalog')}
                className="min-h-[44px] rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-[var(--bg-subtle)]"
              >
                Katalog Cerita Anak
              </button>
              <button
                type="button"
                onClick={() => navigateTo('reader')}
                className="min-h-[44px] rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-[var(--bg-subtle)]"
              >
                Ruang Pembaca
              </button>
              <button
                type="button"
                onClick={() => navigateTo('bookmarks')}
                className="min-h-[44px] rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-[var(--bg-subtle)]"
              >
                Jejak &amp; Penanda ({bookmarks.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsShortcutsOpen(true);
                }}
                className="min-h-[44px] rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-[var(--bg-subtle)]"
              >
                Pintasan Papan Ketik
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" ref={mainContentRef} tabIndex={-1}>
        {activeView === 'catalog' && (
          <>
            {/* Editorial Storybook Hero */}
            <section
              aria-labelledby="hero-title"
              className="border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]"
            >
              <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
                  {/* Left Editorial Column */}
                  <div className="flex flex-col justify-between lg:col-span-7">
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-[var(--text-muted)]">
                        Perpustakaan Digital Ramah Anak · Usia 4–12 Tahun ·
                        Standar Inklusi
                      </p>

                      <h1
                        id="hero-title"
                        className="font-display mt-4 text-4xl leading-tight font-semibold text-balance sm:text-5xl"
                      >
                        Dunia Cerita Hangat yang Ramah untuk Semua Anak
                      </h1>

                      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
                        Dongeng fabel, petualangan sains, dan kisah persahabatan
                        untuk anak usia 4–12 tahun—lengkap dengan pembaca layar
                        suara lembut, kamus kata baru bersuara, huruf ramah
                        disleksia, dan panduan belajar yang aman.
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => openBook(activeBook)}
                        className="inline-flex min-h-[48px] items-center gap-2.5 rounded-lg bg-[var(--accent-primary)] px-6 py-3 text-base font-bold text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0"
                      >
                        <Headphones className="h-5 w-5" aria-hidden="true" />
                        <span>Mulai Baca &amp; Dengar Cerita</span>
                      </button>

                      <button
                        type="button"
                        aria-pressed={settings.screenReaderAutoSpeak}
                        onClick={() => {
                          const next = !settings.screenReaderAutoSpeak;
                          updateSettings({ screenReaderAutoSpeak: next });
                          if (next) {
                            speech.speakUI(
                              'Halo! Mode pembaca layar ramah anak sudah aktif. Setiap halaman dan tombol akan dibacakan dengan jelas.',
                              settings.speechRate,
                              settings.speechPitch,
                              settings.preferredVoiceURI
                            );
                          } else {
                            speech.stop();
                          }
                          setLiveMessage(
                            next
                              ? 'Mode narasi otomatis pembaca layar diaktifkan.'
                              : 'Mode narasi otomatis pembaca layar dimatikan.'
                          );
                        }}
                        className={`inline-flex min-h-[48px] items-center gap-2.5 rounded-lg border px-5 py-3 text-sm font-bold whitespace-nowrap shrink-0 ${
                          settings.screenReaderAutoSpeak
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-primary)]'
                            : 'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                        }`}
                      >
                        <Volume2 className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {settings.screenReaderAutoSpeak
                            ? 'Pembaca Layar Aktif'
                            : 'Aktifkan Suara Pemandu'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Right Hero Media */}
                  <div className="lg:col-span-5">
                    <div className="h-72 overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] sm:h-80 lg:h-full lg:min-h-[360px]">
                      {!heroImageError ? (
                        <img
                          src={HERO_LIBRARY_IMAGE}
                          alt="Sudut baca perpustakaan anak yang hangat dan bermandikan sinar matahari pagi, dua anak sedang membaca buku cerita bergambar dan buku huruf timbul bersama."
                          referrerPolicy="no-referrer"
                          onError={() => setHeroImageError(true)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col justify-between p-8">
                          <BookOpen
                            className="h-10 w-10 text-[var(--accent-primary)]"
                            aria-hidden="true"
                          />
                          <p className="font-display text-2xl font-semibold">
                            Pojok Baca Anak Inklusif
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operational Utility Strip */}
                <div
                  aria-label="Keunggulan Perpustakaan Ramah Anak"
                  className="mt-10 grid grid-cols-1 gap-4 border-t border-[var(--border-hairline)] pt-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                  <div>
                    <p className="font-accessible-mono tabular-nums text-sm font-bold">
                      {LIBRARY_BOOKS.length} Buku Cerita Anak
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      Dikurasi aman untuk usia 4 hingga 12 tahun
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      Kamus Kata &amp; Tanya Jawab
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      Bantu anak pahami kosakata baru dengan suara
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      Huruf Besar &amp; Penggaris Baca
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      Mendukung pembaca awal, disleksia, dan low-vision
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      Bebas Iklan &amp; Ekspor Braille
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      Lingkungan tenang dengan unduhan .txt &amp; .brf
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Catalog Filter & Book Grid */}
            <section
              id="katalog"
              aria-labelledby="catalog-heading"
              className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
            >
              <div className="flex flex-col gap-6 border-b border-[var(--border-hairline)] pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2
                    id="catalog-heading"
                    className="font-display text-3xl font-semibold"
                  >
                    Rak Cerita &amp; Pengetahuan Anak
                  </h2>
                  <p className="mt-1 text-base text-[var(--text-secondary)]">
                    Pilih kelompok usia atau topik cerita untuk mulai membaca
                    dan mendengarkan bersama.
                  </p>
                </div>

                {/* Search Box */}
                <div className="w-full lg:max-w-sm">
                  <label
                    htmlFor="catalog-search"
                    className="mb-1.5 block text-xs font-bold tracking-wider uppercase text-[var(--text-muted)]"
                  >
                    Cari Judul atau Topik Cerita (Tekan /)
                  </label>
                  <div className="relative flex items-center">
                    <Search
                      className="pointer-events-none absolute left-3.5 h-4 w-4 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <input
                      id="catalog-search"
                      ref={searchInputRef}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Misal: kancil, hujan, bintang..."
                      className="min-h-[48px] w-full rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] pr-10 pl-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          searchInputRef.current?.focus();
                          announce('Pencarian dikosongkan.');
                        }}
                        aria-label="Hapus kata pencarian"
                        className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--bg-subtle)]"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Age Group Filter Tabs */}
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div
                  role="tablist"
                  aria-label="Filter kelompok usia anak"
                  className="flex flex-wrap items-center gap-2"
                >
                  {AGE_GROUPS.map((age) => {
                    const active = activeAgeGroup === age;
                    return (
                      <button
                        key={age}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          setActiveAgeGroup(age);
                          announce(`Menampilkan buku untuk ${age}.`);
                        }}
                        className={`min-h-[44px] rounded-lg border px-4 py-2 text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-primary)]'
                            : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                        }`}
                      >
                        {age}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Filter Buttons */}
              <div
                role="tablist"
                aria-label="Filter kategori cerita"
                className="mt-3 flex flex-wrap items-center gap-2"
              >
                {CATEGORIES.map((category) => {
                  const active = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        setActiveCategory(category);
                        announce(`Menampilkan kategori ${category}.`);
                      }}
                      className={`min-h-[44px] rounded-lg border px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--accent-contrast-text)]'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Search Result Count */}
              <p className="mt-6 text-sm text-[var(--text-muted)]">
                Menampilkan{' '}
                <span className="font-accessible-mono tabular-nums font-bold text-[var(--text-primary)]">
                  {filteredBooks.length}
                </span>{' '}
                dari{' '}
                <span className="font-accessible-mono tabular-nums">
                  {LIBRARY_BOOKS.length}
                </span>{' '}
                buku cerita ramah anak.
              </p>

              {/* Empty State */}
              {filteredBooks.length === 0 ? (
                <div className="mt-8 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-10 text-center">
                  <h3 className="font-display text-2xl font-semibold">
                    Cerita belum ditemukan
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-base text-[var(--text-secondary)]">
                    Coba ganti kata kunci pencarian, atau pilih Semua Usia dan
                    kategori Semua untuk melihat semua buku anak.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveAgeGroup('Semua Usia');
                      setActiveCategory('Semua');
                      announce('Filter dan pencarian diatur ulang.');
                    }}
                    className="mt-6 min-h-[44px] rounded-lg bg-[var(--accent-primary)] px-6 py-2.5 text-sm font-bold text-[var(--accent-contrast-text)]"
                  >
                    Tampilkan Semua Cerita
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredBooks.map((book) => {
                    const saved = progressMap[book.id];
                    return (
                      <article
                        key={book.id}
                        className="flex flex-col justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6"
                      >
                        <div>
                          <div className="flex items-start gap-5">
                            <CoverArtwork
                              book={book}
                              className="h-36 w-24 shrink-0 rounded-lg"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                                {book.category} · {book.ageGroup}
                              </p>
                              <h3 className="font-display mt-1.5 text-xl leading-snug font-semibold text-balance">
                                {book.title}
                              </h3>
                              <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
                                {book.author}
                              </p>
                              <p className="font-accessible-mono tabular-nums mt-2 text-xs text-[var(--text-muted)]">
                                {book.chapters.length} bab ·{' '}
                                {book.audioMinutes} mnt cerita
                              </p>
                            </div>
                          </div>

                          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {book.summary}
                          </p>

                          {saved && (
                            <p className="mt-3 flex items-center gap-1.5 border-t border-[var(--border-hairline)] pt-3 text-xs font-semibold text-[var(--accent-primary)]">
                              {saved.completed && (
                                <CheckCircle2
                                  className="h-4 w-4 shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                              <span>
                                {saved.completed
                                  ? 'Sudah selesai dibaca · Bisa diulang kapan saja'
                                  : `Terakhir dibaca: Bab ${saved.chapterIndex + 1}, Kalimat ${saved.sentenceIndex + 1}`}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-[var(--border-hairline)] pt-4">
                          <button
                            type="button"
                            onClick={() => openBook(book)}
                            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-bold text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)] whitespace-nowrap"
                          >
                            <BookOpen className="h-4 w-4" aria-hidden="true" />
                            <span>
                              {saved && !saved.completed
                                ? 'Lanjutkan Cerita'
                                : 'Baca & Dengarkan'}
                            </span>
                          </button>

                          <button
                            type="button"
                            aria-label={`Dengarkan sinopsis cerita ${book.title}`}
                            onClick={() => {
                              const text = `${book.title}, untuk usia ${book.ageGroup}, ditulis oleh ${book.author}. ${book.summary}`;
                              speech.speakUI(
                                text,
                                settings.speechRate,
                                settings.speechPitch,
                                settings.preferredVoiceURI
                              );
                              setLiveMessage(
                                `Membacakan ringkasan cerita ${book.title}.`
                              );
                            }}
                            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)]"
                          >
                            <Volume2 className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">
                              Dengarkan ringkasan {book.title}
                            </span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {activeView === 'reader' && (
          <BookReader
            book={activeBook}
            initialChapterIndex={readerJump.chapterIndex}
            initialSentenceIndex={readerJump.sentenceIndex}
            isCompleted={Boolean(progressMap[activeBook.id]?.completed)}
            settings={settings}
            onUpdateSettings={updateSettings}
            onOpenAccessibility={() => setIsAccessibilityOpen(true)}
            onBackToCatalog={() => navigateTo('catalog')}
            onSaveProgress={handleSaveProgress}
            onMarkCompleted={handleMarkCompleted}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            speech={speech}
            onAnnounce={announce}
          />
        )}

        {activeView === 'bookmarks' && (
          <section
            aria-labelledby="bookmarks-heading"
            className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-6">
              <div>
                <h1
                  id="bookmarks-heading"
                  className="font-display text-3xl font-semibold"
                >
                  Jejak Bacaan &amp; Penanda Halaman
                </h1>
                <p className="mt-1 text-base text-[var(--text-secondary)]">
                  Lihat cerita yang sudah selesai dibaca dan lanjutkan kalimat
                  yang telah ditandai.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('catalog')}
                className="min-h-[44px] rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold hover:bg-[var(--bg-surface)]"
              >
                Kembali ke Katalog
              </button>
            </div>

            {/* Completed Books Summary */}
            {completedBooks.length > 0 && (
              <div className="mt-8 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6">
                <h2 className="font-display text-xl font-semibold">
                  Cerita yang Sudah Selesai Dibaca ({completedBooks.length})
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {completedBooks.map((book) => (
                    <li
                      key={book.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-3.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{book.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {book.category} · {book.ageGroup}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openBook(book, 0, 0)}
                        className="min-h-[40px] shrink-0 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-bold hover:bg-[var(--bg-subtle)]"
                      >
                        Baca Ulang
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {bookmarks.length === 0 ? (
              <div className="mt-8 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-10 text-center">
                <Bookmark
                  className="mx-auto h-10 w-10 text-[var(--text-muted)]"
                  aria-hidden="true"
                />
                <h2 className="font-display mt-4 text-2xl font-semibold">
                  Belum ada kalimat yang ditandai
                </h2>
                <p className="mx-auto mt-2 max-w-md text-base text-[var(--text-secondary)]">
                  Saat membaca cerita, tekan tombol Tandai Kalimat untuk
                  menyimpan bagian favoritmu agar mudah dibuka kembali nanti.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('catalog')}
                  className="mt-6 min-h-[44px] rounded-lg bg-[var(--accent-primary)] px-6 py-2.5 text-sm font-bold text-[var(--accent-contrast-text)]"
                >
                  Pilih Cerita di Katalog
                </button>
              </div>
            ) : (
              <ul className="mt-8 space-y-4">
                {bookmarks.map((bm) => {
                  const book =
                    LIBRARY_BOOKS.find((b) => b.id === bm.bookId) ??
                    LIBRARY_BOOKS[0];
                  return (
                    <li
                      key={bm.id}
                      className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                            {bm.bookTitle} · Bab {bm.chapterIndex + 1} · Kalimat{' '}
                            {bm.sentenceIndex + 1} · {bm.createdAt}
                          </p>
                          <h2 className="font-display mt-1 text-lg font-semibold">
                            {bm.chapterTitle}
                          </h2>
                          <blockquote className="mt-2 text-base leading-relaxed text-[var(--text-secondary)]">
                            &ldquo;{bm.excerpt}&rdquo;
                          </blockquote>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openBook(book, bm.chapterIndex, bm.sentenceIndex)
                            }
                            className="min-h-[44px] rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-bold text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)] whitespace-nowrap"
                          >
                            Buka Posisi
                          </button>
                          <button
                            type="button"
                            aria-label={`Hapus penanda dari ${bm.bookTitle}`}
                            onClick={() => {
                              setBookmarks((prev) =>
                                prev.filter((item) => item.id !== bm.id)
                              );
                              announce('Penanda halaman berhasil dihapus.');
                            }}
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="mt-16 border-t border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-8 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>
            Pustaka Inklusi — Perpustakaan Digital Ramah Anak &amp; Aksesibilitas
            Tinggi.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setIsShortcutsOpen(true)}
              className="min-h-[44px] font-semibold text-[var(--text-secondary)] underline-offset-4 hover:underline"
            >
              Pintasan Papan Ketik (?)
            </button>
            <button
              type="button"
              onClick={() => setIsAccessibilityOpen(true)}
              className="min-h-[44px] font-semibold text-[var(--text-secondary)] underline-offset-4 hover:underline"
            >
              Setelan Aksesibilitas (A)
            </button>
          </div>
        </div>
      </footer>

      {/* Drawers & Modals */}
      <AccessibilityDrawer
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
        voices={speech.voices}
        speechSupported={speech.supported}
        onTestVoice={() => {
          speech.speakUI(
            'Halo! Ini adalah uji suara pembaca layar ramah anak Pustaka Inklusi. Kecepatan dan ukuran huruf bisa disesuaikan agar nyaman dibaca.',
            settings.speechRate,
            settings.speechPitch,
            settings.preferredVoiceURI
          );
        }}
        onAnnounce={announce}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onReadShortcuts={() => {
          speech.speakUI(
            'Daftar pintasan papan ketik. Tekan garis miring untuk mencari cerita. Tekan spasi untuk memutar atau menjeda suara di ruang baca. Tekan panah kiri atau kanan untuk berpindah kalimat. Tekan H untuk mode kontras tinggi, A untuk panel aksesibilitas, dan tanda tanya untuk bantuan ini.',
            settings.speechRate,
            settings.speechPitch,
            settings.preferredVoiceURI
          );
        }}
      />
    </div>
  );
}
