import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Square,
  Volume2,
} from 'lucide-react';
import {
  AccessibilitySettings,
  Book,
  BookmarkItem,
} from '../types/library';
import {
  downloadBookAsAccessibleText,
  downloadBookAsBrailleText,
  splitParagraphsToSentences,
} from '../utils/textExport';
import { CoverArtwork } from './CoverArtwork';

interface BookReaderProps {
  book: Book;
  initialChapterIndex: number;
  initialSentenceIndex: number;
  isCompleted: boolean;
  settings: AccessibilitySettings;
  onUpdateSettings: (partial: Partial<AccessibilitySettings>) => void;
  onOpenAccessibility: () => void;
  onBackToCatalog: () => void;
  onSaveProgress: (
    bookId: string,
    chapterIndex: number,
    sentenceIndex: number
  ) => void;
  onMarkCompleted: (bookId: string) => void;
  bookmarks: BookmarkItem[];
  onToggleBookmark: (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => void;
  speech: {
    supported: boolean;
    isSpeaking: boolean;
    isPaused: boolean;
    speakUI: (
      text: string,
      rate?: number,
      pitch?: number,
      voiceURI?: string
    ) => void;
    startSequence: (
      sentences: string[],
      startIndex: number,
      options: {
        rate: number;
        pitch: number;
        voiceURI: string;
        onSentenceStart: (index: number) => void;
        onSequenceEnd: () => void;
      }
    ) => void;
    togglePause: () => void;
    stop: () => void;
    updateLiveOptions: (rate: number, pitch: number, voiceURI: string) => void;
  };
  onAnnounce: (msg: string) => void;
}

export function BookReader({
  book,
  initialChapterIndex,
  initialSentenceIndex,
  isCompleted,
  settings,
  onUpdateSettings,
  onOpenAccessibility,
  onBackToCatalog,
  onSaveProgress,
  onMarkCompleted,
  bookmarks,
  onToggleBookmark,
  speech,
  onAnnounce,
}: BookReaderProps) {
  const [chapterIndex, setChapterIndex] = useState(
    Math.max(0, Math.min(initialChapterIndex, book.chapters.length - 1))
  );
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(
    Math.max(0, initialSentenceIndex)
  );
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(
    null
  );
  const [rulerTopPx, setRulerTopPx] = useState<number | null>(null);
  const [exportNotice, setExportNotice] = useState<string>('');

  const proseContainerRef = useRef<HTMLDivElement>(null);
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const chapterHeadingRef = useRef<HTMLHeadingElement>(null);

  const chapter = book.chapters[chapterIndex] ?? book.chapters[0];

  const { sentences, byParagraph } = useMemo(
    () => splitParagraphsToSentences(chapter.paragraphs),
    [chapter.paragraphs]
  );

  const sentenceTexts = useMemo(
    () => sentences.map((s) => s.text),
    [sentences]
  );

  // Sync external initial jumps (e.g., opening a bookmark)
  useEffect(() => {
    const safeChap = Math.max(
      0,
      Math.min(initialChapterIndex, book.chapters.length - 1)
    );
    setChapterIndex(safeChap);
    setActiveSentenceIndex(Math.max(0, initialSentenceIndex));
    setSelectedAnswerIdx(null);
  }, [book.id, initialChapterIndex, initialSentenceIndex, book.chapters.length]);

  // Reset question choice when changing chapter
  useEffect(() => {
    setSelectedAnswerIdx(null);
  }, [chapterIndex, book.id]);

  // Save reading progress whenever position changes
  useEffect(() => {
    onSaveProgress(book.id, chapterIndex, activeSentenceIndex);
  }, [book.id, chapterIndex, activeSentenceIndex, onSaveProgress]);

  // Keep live speech speed/pitch/voice synced
  useEffect(() => {
    speech.updateLiveOptions(
      settings.speechRate,
      settings.speechPitch,
      settings.preferredVoiceURI
    );
  }, [
    settings.speechRate,
    settings.speechPitch,
    settings.preferredVoiceURI,
    speech,
  ]);

  // Stop speech when unmounting reader
  useEffect(() => {
    return () => {
      speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id]);

  // Scroll active spoken sentence smoothly into view
  useEffect(() => {
    const el = sentenceRefs.current[activeSentenceIndex];
    if (el && (speech.isSpeaking || settings.readingRuler)) {
      el.scrollIntoView({
        behavior: settings.reduceMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    }
  }, [
    activeSentenceIndex,
    speech.isSpeaking,
    settings.readingRuler,
    settings.reduceMotion,
  ]);

  const startNarrationAt = (
    idx: number,
    targetChapterSentences = sentenceTexts,
    targetChapterIdx = chapterIndex
  ) => {
    if (!speech.supported) {
      onAnnounce('Maaf, peramban ini tidak mendukung sintesis suara.');
      return;
    }

    const safeIdx = Math.max(
      0,
      Math.min(idx, targetChapterSentences.length - 1)
    );
    setActiveSentenceIndex(safeIdx);

    speech.startSequence(targetChapterSentences, safeIdx, {
      rate: settings.speechRate,
      pitch: settings.speechPitch,
      voiceURI: settings.preferredVoiceURI,
      onSentenceStart: (sIdx) => {
        setActiveSentenceIndex(sIdx);
      },
      onSequenceEnd: () => {
        if (targetChapterIdx < book.chapters.length - 1) {
          const nextChapter = targetChapterIdx + 1;
          const nextSplit = splitParagraphsToSentences(
            book.chapters[nextChapter].paragraphs
          );
          const nextTexts = nextSplit.sentences.map((s) => s.text);
          setChapterIndex(nextChapter);
          setActiveSentenceIndex(0);
          onAnnounce(
            `Berpindah otomatis ke Bab ${book.chapters[nextChapter].number}: ${book.chapters[nextChapter].title}`
          );
          startNarrationAt(0, nextTexts, nextChapter);
        } else {
          onMarkCompleted(book.id);
          onAnnounce(`Hore! Selesai membacakan seluruh cerita ${book.title}.`);
        }
      },
    });
  };

  const handlePlayPause = () => {
    if (speech.isSpeaking) {
      speech.togglePause();
      onAnnounce(speech.isPaused ? 'Cerita dilanjutkan.' : 'Cerita dijeda.');
    } else {
      startNarrationAt(activeSentenceIndex);
      onAnnounce(
        `Mulai membacakan cerita dari kalimat ${activeSentenceIndex + 1}.`
      );
    }
  };

  const handleStepSentence = (delta: number) => {
    const nextIdx = Math.max(
      0,
      Math.min(activeSentenceIndex + delta, sentences.length - 1)
    );
    setActiveSentenceIndex(nextIdx);
    if (speech.isSpeaking && !speech.isPaused) {
      startNarrationAt(nextIdx);
    } else {
      onAnnounce(`Kalimat ${nextIdx + 1} dari ${sentences.length}.`);
    }
  };

  const handleSelectChapter = (nextIdx: number) => {
    const wasSpeaking = speech.isSpeaking && !speech.isPaused;
    speech.stop();
    setChapterIndex(nextIdx);
    setActiveSentenceIndex(0);
    const chosen = book.chapters[nextIdx];
    onAnnounce(`Membuka Bab ${chosen.number}: ${chosen.title}`);
    chapterHeadingRef.current?.focus();

    if (wasSpeaking) {
      const nextSplit = splitParagraphsToSentences(chosen.paragraphs);
      startNarrationAt(
        0,
        nextSplit.sentences.map((s) => s.text),
        nextIdx
      );
    }
  };

  // Reader-specific keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.code === 'Space' && tag !== 'button' && tag !== 'a') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleStepSentence(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleStepSentence(-1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const currentSentenceObj = sentences[activeSentenceIndex] ?? sentences[0];
  const isCurrentBookmarked = bookmarks.some(
    (b) =>
      b.bookId === book.id &&
      b.chapterIndex === chapterIndex &&
      b.sentenceIndex === activeSentenceIndex
  );

  const fontClass =
    settings.fontFamily === 'serif'
      ? 'font-display'
      : settings.fontFamily === 'mono'
        ? 'font-accessible-mono'
        : 'font-accessible-sans';

  const letterSpacingStyle =
    settings.letterSpacing === 'wider'
      ? '0.07em'
      : settings.letterSpacing === 'wide'
        ? '0.035em'
        : '0em';

  const progressPercent =
    sentences.length > 0
      ? Math.round(((activeSentenceIndex + 1) / sentences.length) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Contextual Reader Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              speech.stop();
              onBackToCatalog();
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)] whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Kembali ke Katalog</span>
          </button>

          <div className="text-sm text-[var(--text-muted)]">
            <span>{book.category}</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>Usia {book.ageGroup}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-pressed={isCurrentBookmarked}
            onClick={() => {
              onToggleBookmark({
                bookId: book.id,
                bookTitle: book.title,
                chapterIndex,
                chapterTitle: chapter.title,
                sentenceIndex: activeSentenceIndex,
                excerpt: currentSentenceObj?.text ?? '',
              });
            }}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 ${
              isCurrentBookmarked
                ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--text-primary)]'
                : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <Bookmark
              className="h-4 w-4"
              aria-hidden="true"
              fill={isCurrentBookmarked ? 'currentColor' : 'none'}
            />
            <span>{isCurrentBookmarked ? 'Ditandai' : 'Tandai Kalimat'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAccessibility}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)] whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>Tampilan &amp; Suara</span>
          </button>
        </div>
      </div>

      {/* Integrated Screen Reader Audio Dock */}
      <section
        aria-label="Kontrol Pembaca Layar Cerita"
        className="mt-6 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePlayPause}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-bold text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0"
            >
              {speech.isSpeaking && !speech.isPaused ? (
                <>
                  <Pause className="h-4 w-4" aria-hidden="true" />
                  <span>Jeda Suara</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {speech.isPaused ? 'Lanjutkan Cerita' : 'Bacakan Bab Ini'}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                speech.stop();
                onAnnounce('Pembaca layar dihentikan.');
              }}
              disabled={!speech.isSpeaking && !speech.isPaused}
              aria-label="Hentikan pembacaan suara"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0"
            >
              <Square className="h-4 w-4" aria-hidden="true" />
              <span>Berhenti</span>
            </button>

            <button
              type="button"
              onClick={() => handleStepSentence(-1)}
              disabled={activeSentenceIndex <= 0}
              aria-label="Kalimat sebelumnya"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <SkipBack className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleStepSentence(1)}
              disabled={activeSentenceIndex >= sentences.length - 1}
              aria-label="Kalimat berikutnya"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <SkipForward className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Speed Quick Selector */}
            <div
              role="group"
              aria-label="Kecepatan suara cepat"
              className="flex items-center gap-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-1"
            >
              {[0.8, 0.95, 1.15, 1.35].map((speed) => {
                const active = Math.abs(settings.speechRate - speed) < 0.03;
                return (
                  <button
                    key={speed}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      onUpdateSettings({ speechRate: speed });
                      onAnnounce(`Kecepatan suara ${speed} kali.`);
                    }}
                    className={`font-accessible-mono tabular-nums min-h-[38px] rounded-md px-3 py-1 text-xs font-bold whitespace-nowrap ${
                      active
                        ? 'bg-[var(--accent-primary)] text-[var(--accent-contrast-text)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    {speed}x
                  </button>
                );
              })}
            </div>

            <div className="text-sm text-[var(--text-secondary)]">
              <span className="font-accessible-mono tabular-nums font-semibold">
                Kalimat {activeSentenceIndex + 1}/{sentences.length}
              </span>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span className="font-accessible-mono tabular-nums">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Reading Progress Bar */}
        <div
          role="progressbar"
          aria-label="Kemajuan membaca bab"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]"
        >
          <div
            className="h-full bg-[var(--accent-primary)] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* Main Asymmetric Editorial Reading Canvas */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* 70% Reading Column */}
        <article
          aria-labelledby="reader-chapter-heading"
          className="lg:col-span-8"
        >
          <header className="border-b border-[var(--border-hairline)] pb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[var(--text-muted)]">
              {book.title} · Bab {chapter.number} dari {book.chapters.length}
            </p>
            <h1
              ref={chapterHeadingRef}
              id="reader-chapter-heading"
              tabIndex={-1}
              className="font-display mt-3 text-3xl leading-tight font-semibold text-balance sm:text-4xl"
            >
              {chapter.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
              {chapter.summary}
            </p>
          </header>

          {/* Prose Canvas with Optional Reading Ruler */}
          <div
            ref={proseContainerRef}
            onMouseMove={(e) => {
              if (!settings.readingRuler || !proseContainerRef.current) return;
              const rect = proseContainerRef.current.getBoundingClientRect();
              setRulerTopPx(e.clientY - rect.top);
            }}
            onMouseLeave={() => setRulerTopPx(null)}
            className={`relative mt-8 max-w-prose ${fontClass}`}
            style={{
              fontSize: `${settings.fontSizePx}px`,
              lineHeight: settings.lineHeight,
              letterSpacing: letterSpacingStyle,
            }}
          >
            {settings.readingRuler && rulerTopPx !== null && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 left-0 z-10 h-14 -translate-y-1/2 rounded-md border-y"
                style={{
                  top: `${rulerTopPx}px`,
                  backgroundColor: 'var(--ruler-bg)',
                  borderColor: 'var(--ruler-border)',
                }}
              />
            )}

            <div className="space-y-6">
              {byParagraph.map((pSentences, pIdx) => (
                <p key={pIdx} className="text-[var(--text-primary)]">
                  {pSentences.map((s) => {
                    const isActive = s.globalIndex === activeSentenceIndex;
                    const showHighlight =
                      isActive &&
                      (settings.highlightSpokenSentence || speech.isSpeaking);

                    return (
                      <span
                        key={s.globalIndex}
                        ref={(el) => {
                          sentenceRefs.current[s.globalIndex] = el;
                        }}
                        role="button"
                        tabIndex={0}
                        aria-current={isActive ? 'true' : undefined}
                        aria-label={`Kalimat ${s.globalIndex + 1}: ${s.text}. Tekan Enter untuk mulai membacakan dari kalimat ini.`}
                        onClick={() => startNarrationAt(s.globalIndex)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            startNarrationAt(s.globalIndex);
                          }
                        }}
                        className={`mr-1.5 inline cursor-pointer rounded px-1 py-0.5 transition-colors ${
                          showHighlight
                            ? 'font-semibold ring-2'
                            : 'hover:bg-[var(--bg-subtle)]'
                        }`}
                        style={
                          showHighlight
                            ? {
                                backgroundColor: 'var(--reader-highlight-bg)',
                                color: 'var(--reader-highlight-text)',
                                boxShadow:
                                  '0 0 0 2px var(--reader-highlight-ring)',
                              }
                            : undefined
                        }
                      >
                        {s.text}
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>
          </div>

          {/* Child-Friendly Story Comprehension Check */}
          {chapter.question && (
            <section
              aria-labelledby="chapter-question-heading"
              className="mt-10 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2
                  id="chapter-question-heading"
                  className="font-display text-xl font-semibold"
                >
                  Ayo Pahami Cerita Bab {chapter.number}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const q = chapter.question!;
                    const opts = q.options
                      .map((o, i) => `Pilihan ${i + 1}: ${o}`)
                      .join('. ');
                    speech.speakUI(
                      `${q.prompt}. ${opts}`,
                      settings.speechRate,
                      settings.speechPitch,
                      settings.preferredVoiceURI
                    );
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-2 text-xs font-semibold hover:bg-[var(--bg-subtle)]"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  <span>Bacakan Pertanyaan</span>
                </button>
              </div>

              <p className="mt-3 text-base font-semibold text-[var(--text-primary)]">
                {chapter.question.prompt}
              </p>

              <div className="mt-4 space-y-2.5">
                {chapter.question.options.map((opt, idx) => {
                  const chosen = selectedAnswerIdx === idx;
                  const isCorrect = idx === chapter.question!.correctIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      aria-pressed={chosen}
                      onClick={() => {
                        setSelectedAnswerIdx(idx);
                        const feedback = isCorrect
                          ? chapter.question!.explanation
                          : `Belum tepat. Coba pikirkan kembali cerita tadi atau pilih jawaban lainnya.`;
                        onAnnounce(feedback);
                      }}
                      className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        chosen
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] font-bold text-[var(--text-primary)]'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      <span>
                        <span className="font-accessible-mono mr-2 font-bold">
                          {idx + 1}.
                        </span>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedAnswerIdx !== null && (
                <div
                  role="status"
                  className="mt-4 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-4 text-sm font-medium text-[var(--text-primary)]"
                >
                  {selectedAnswerIdx === chapter.question.correctIndex
                    ? chapter.question.explanation
                    : 'Belum tepat, yuk coba pilih jawaban lain yang paling sesuai dengan cerita di atas!'}
                </div>
              )}
            </section>
          )}

          {/* Chapter Prev / Next Navigation */}
          <nav
            aria-label="Navigasi antar-bab"
            className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-hairline)] pt-6"
          >
            <button
              type="button"
              disabled={chapterIndex === 0}
              onClick={() => handleSelectChapter(chapterIndex - 1)}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--bg-subtle)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span>Bab Sebelumnya</span>
            </button>

            <span className="font-accessible-mono tabular-nums text-sm text-[var(--text-muted)]">
              Bab {chapter.number} / {book.chapters.length}
            </span>

            {chapterIndex < book.chapters.length - 1 ? (
              <button
                type="button"
                onClick={() => handleSelectChapter(chapterIndex + 1)}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-bold text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)]"
              >
                <span>Bab Berikutnya</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onMarkCompleted(book.id);
                  onAnnounce(
                    `Selamat! Kamu telah menyelesaikan cerita ${book.title}.`
                  );
                }}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-bold text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)]"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>
                  {isCompleted ? 'Cerita Sudah Selesai' : 'Tandai Selesai Baca'}
                </span>
              </button>
            )}
          </nav>
        </article>

        {/* 30% Margin Notes, Kamus Kata Baru, Chapter Outline & Exports */}
        <aside
          aria-label="Kamus kata baru, daftar bab, dan unduhan aksesibel"
          className="space-y-8 lg:col-span-4"
        >
          {/* Book Identity & Story Note */}
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5">
            <div className="flex items-start gap-4">
              <CoverArtwork
                book={book}
                className="h-28 w-20 shrink-0 rounded-md"
              />
              <div className="min-w-0">
                <h2 className="font-display text-lg leading-snug font-semibold">
                  {book.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {book.author}
                </p>
                <p className="font-accessible-mono tabular-nums mt-2 text-xs text-[var(--text-muted)]">
                  Usia {book.ageGroup} · {book.audioMinutes} mnt cerita
                </p>
              </div>
            </div>

            {chapter.marginNote && (
              <div className="mt-5 border-t border-[var(--border-hairline)] pt-4">
                <h3 className="text-xs font-bold tracking-widest uppercase text-[var(--text-muted)]">
                  Catatan Cerita Bab Ini
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {chapter.marginNote}
                </p>
              </div>
            )}
          </div>

          {/* Kamus Kata Baru Bersuara */}
          {chapter.glossary && chapter.glossary.length > 0 && (
            <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5">
              <h2 className="text-sm font-bold tracking-wider uppercase text-[var(--text-muted)]">
                Kamus Kata Baru
              </h2>
              <dl className="mt-3 divide-y divide-[var(--border-hairline)]">
                {chapter.glossary.map((item) => (
                  <div key={item.word} className="py-3 first:pt-1 last:pb-1">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="font-display text-base font-semibold">
                        {item.word}
                      </dt>
                      <button
                        type="button"
                        aria-label={`Bacakan arti kata ${item.word}`}
                        onClick={() =>
                          speech.speakUI(
                            `${item.word}, artinya: ${item.meaning}`,
                            settings.speechRate,
                            settings.speechPitch,
                            settings.preferredVoiceURI
                          )
                        }
                        className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]"
                      >
                        <Volume2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <dd className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {item.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Chapter List */}
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5">
            <h2 className="text-sm font-bold tracking-wider uppercase text-[var(--text-muted)]">
              Daftar Bab Cerita
            </h2>
            <ol className="mt-3 divide-y divide-[var(--border-hairline)]">
              {book.chapters.map((c, idx) => {
                const current = idx === chapterIndex;
                return (
                  <li key={c.id} className="py-1.5">
                    <button
                      type="button"
                      aria-current={current ? 'step' : undefined}
                      onClick={() => handleSelectChapter(idx)}
                      className={`flex min-h-[44px] w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        current
                          ? 'bg-[var(--accent-subtle)] font-bold text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                      }`}
                    >
                      <span className="font-accessible-mono tabular-nums mt-0.5 text-xs">
                        0{c.number}.
                      </span>
                      <span>{c.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Accessible Formats Download */}
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5">
            <h2 className="text-sm font-bold tracking-wider uppercase text-[var(--text-muted)]">
              Unduh untuk Belajar Luring
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Simpan cerita ini untuk dibaca bersama orang tua, guru, atau
              perangkat Braille.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  downloadBookAsAccessibleText(book);
                  setExportNotice(
                    'Berkas teks terstruktur (.txt) berhasil diunduh.'
                  );
                  onAnnounce(
                    `Berkas teks cerita ${book.title} mulai diunduh.`
                  );
                }}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Unduh Teks Cerita (.txt)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  downloadBookAsBrailleText(book);
                  setExportNotice(
                    'Berkas Unicode Braille (.brf.txt) berhasil diunduh.'
                  );
                  onAnnounce(
                    `Berkas Braille Unicode untuk ${book.title} mulai diunduh.`
                  );
                }}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Unduh Braille Unicode (.brf.txt)</span>
              </button>
            </div>
            {exportNotice && (
              <p
                role="status"
                className="mt-3 text-xs font-semibold text-[var(--accent-primary)]"
              >
                {exportNotice}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
