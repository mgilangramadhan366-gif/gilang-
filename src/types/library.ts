export type ThemeMode = 'paper' | 'dark' | 'high-contrast' | 'cream';

export type FontFamilyChoice = 'sans' | 'serif' | 'mono';

export type LetterSpacingChoice = 'normal' | 'wide' | 'wider';

export type AgeGroup = 'Semua Usia' | '4–6 Tahun' | '7–9 Tahun' | '10–12 Tahun';

export type BookCategory =
  | 'Semua'
  | 'Fabel & Dongeng'
  | 'Sains Anak'
  | 'Persahabatan & Inklusi'
  | 'Alam & Nusantara'
  | 'Kreativitas & Seni';

export interface GlossaryWord {
  word: string;
  meaning: string;
}

export interface ChapterQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  summary: string;
  paragraphs: string[];
  marginNote?: string;
  glossary?: GlossaryWord[];
  question?: ChapterQuestion;
}

export interface Book {
  id: string;
  accessionCode: string;
  title: string;
  subtitle: string;
  author: string;
  narrator: string;
  category: Exclude<BookCategory, 'Semua'>;
  ageGroup: Exclude<AgeGroup, 'Semua Usia'>;
  year: number;
  language: string;
  readingMinutes: number;
  audioMinutes: number;
  coverImage?: string;
  coverAlt: string;
  coverAccentHex: string;
  summary: string;
  accessibilityNotes: string[];
  chapters: Chapter[];
}

export interface BookmarkItem {
  id: string;
  bookId: string;
  bookTitle: string;
  chapterIndex: number;
  chapterTitle: string;
  sentenceIndex: number;
  excerpt: string;
  createdAt: string;
}

export interface ReadingProgressMap {
  [bookId: string]: {
    chapterIndex: number;
    sentenceIndex: number;
    completed?: boolean;
    updatedAt: string;
  };
}

export interface AccessibilitySettings {
  theme: ThemeMode;
  fontFamily: FontFamilyChoice;
  fontSizePx: number;
  lineHeight: number;
  letterSpacing: LetterSpacingChoice;
  screenReaderAutoSpeak: boolean;
  highlightSpokenSentence: boolean;
  readingRuler: boolean;
  reduceMotion: boolean;
  speechRate: number;
  speechPitch: number;
  preferredVoiceURI: string;
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  theme: 'paper',
  fontFamily: 'sans',
  fontSizePx: 20,
  lineHeight: 1.85,
  letterSpacing: 'normal',
  screenReaderAutoSpeak: false,
  highlightSpokenSentence: true,
  readingRuler: false,
  reduceMotion: false,
  speechRate: 0.95,
  speechPitch: 1.0,
  preferredVoiceURI: '',
};
