export type ThemeMode = 'paper' | 'dark' | 'high-contrast' | 'cream';

export type FontFamilyChoice = 'sans' | 'serif' | 'mono';

export type LetterSpacingChoice = 'normal' | 'wide' | 'wider';

export type BookCategory =
  | 'Semua'
  | 'Sastra & Fiksi'
  | 'Sains & Teknologi'
  | 'Arsitektur & Ruang'
  | 'Seni & Budaya'
  | 'Panduan Aksesibilitas';

export interface Chapter {
  id: string;
  number: number;
  title: string;
  summary: string;
  paragraphs: string[];
  marginNote?: string;
}

export interface Book {
  id: string;
  accessionCode: string;
  title: string;
  subtitle: string;
  author: string;
  narrator: string;
  category: Exclude<BookCategory, 'Semua'>;
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
  fontSizePx: 19,
  lineHeight: 1.75,
  letterSpacing: 'normal',
  screenReaderAutoSpeak: false,
  highlightSpokenSentence: true,
  readingRuler: false,
  reduceMotion: false,
  speechRate: 1.0,
  speechPitch: 1.0,
  preferredVoiceURI: '',
};
