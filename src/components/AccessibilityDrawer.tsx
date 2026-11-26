import { useEffect, useRef } from 'react';
import { RotateCcw, Volume2, X } from 'lucide-react';
import {
  AccessibilitySettings,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  FontFamilyChoice,
  LetterSpacingChoice,
  ThemeMode,
} from '../types/library';
import { VoiceOption } from '../hooks/useSpeechEngine';

interface AccessibilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdate: (partial: Partial<AccessibilitySettings>) => void;
  voices: VoiceOption[];
  speechSupported: boolean;
  onTestVoice: () => void;
  onAnnounce: (message: string) => void;
}

const THEME_OPTIONS: {
  id: ThemeMode;
  label: string;
  contrastNote: string;
  previewBg: string;
  previewText: string;
}[] = [
  {
    id: 'paper',
    label: 'Kertas Arsip',
    contrastNote: 'Kontras 14:1 · Nyaman Siang',
    previewBg: '#FBF9F5',
    previewText: '#1C1917',
  },
  {
    id: 'dark',
    label: 'Malam Tenang',
    contrastNote: 'Kontras 13:1 · Minim Silau',
    previewBg: '#0F1419',
    previewText: '#F3F4F6',
  },
  {
    id: 'high-contrast',
    label: 'Kontras Ekstrem AAA',
    contrastNote: 'Kontras 21:1 · Low Vision',
    previewBg: '#000000',
    previewText: '#FFE600',
  },
  {
    id: 'cream',
    label: 'Krem Disleksia',
    contrastNote: 'Kontras 11:1 · Reduksi Silau',
    previewBg: '#F5ECD7',
    previewText: '#231F20',
  },
];

export function AccessibilityDrawer({
  isOpen,
  onClose,
  settings,
  onUpdate,
  voices,
  speechSupported,
  onTestVoice,
  onAnnounce,
}: AccessibilityDrawerProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleReset = () => {
    onUpdate(DEFAULT_ACCESSIBILITY_SETTINGS);
    onAnnounce('Semua pengaturan aksesibilitas dikembalikan ke setelan awal.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-drawer-title"
        className="flex h-full w-full max-w-lg flex-col border-l border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-hairline)] px-6 py-5">
          <div>
            <h2
              id="accessibility-drawer-title"
              className="font-display text-2xl font-semibold"
            >
              Pusat Aksesibilitas
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Sesuaikan pembaca layar, kontras, dan kenyamanan baca
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup panel aksesibilitas"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          {/* Section 1: Pembaca Layar & Suara */}
          <section aria-labelledby="section-screen-reader">
            <h3
              id="section-screen-reader"
              className="border-b border-[var(--border-hairline)] pb-2 text-base font-bold"
            >
              1. Pembaca Layar &amp; Sintesis Suara
            </h3>

            {!speechSupported ? (
              <p className="mt-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 text-sm">
                Peramban Anda belum mendukung Web Speech API bawaan. Anda tetap
                dapat menggunakan pembaca layar eksternal (NVDA, JAWS, VoiceOver,
                atau TalkBack) yang didukung penuh melalui struktur ARIA aplikasi
                ini.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <label className="flex min-h-[48px] cursor-pointer items-center justify-between gap-4 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-3">
                  <div>
                    <span className="block font-semibold">
                      Narasi Otomatis Antarmuka
                    </span>
                    <span className="block text-sm text-[var(--text-muted)]">
                      Bacakan perubahan halaman, pencarian, dan fokus tombol
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.screenReaderAutoSpeak}
                    onChange={(e) => {
                      const next = e.target.checked;
                      onUpdate({ screenReaderAutoSpeak: next });
                      onAnnounce(
                        next
                          ? 'Narasi otomatis antarmuka diaktifkan.'
                          : 'Narasi otomatis antarmuka dimatikan.'
                      );
                    }}
                    className="h-6 w-6 shrink-0 accent-[var(--accent-primary)]"
                  />
                </label>

                <label className="flex min-h-[48px] cursor-pointer items-center justify-between gap-4 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-3">
                  <div>
                    <span className="block font-semibold">
                      Sorot Kalimat Saat Dibacakan
                    </span>
                    <span className="block text-sm text-[var(--text-muted)]">
                      Tandai kalimat aktif dengan warna kontras tinggi
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.highlightSpokenSentence}
                    onChange={(e) =>
                      onUpdate({ highlightSpokenSentence: e.target.checked })
                    }
                    className="h-6 w-6 shrink-0 accent-[var(--accent-primary)]"
                  />
                </label>

                <div>
                  <label
                    htmlFor="voice-select"
                    className="mb-1.5 block text-sm font-semibold"
                  >
                    Pilihan Suara Narator ({voices.length} tersedia)
                  </label>
                  <select
                    id="voice-select"
                    value={settings.preferredVoiceURI}
                    onChange={(e) =>
                      onUpdate({ preferredVoiceURI: e.target.value })
                    }
                    className="min-h-[44px] w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)]"
                  >
                    <option value="">Otomatis (Prioritas Bahasa Indonesia)</option>
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <label htmlFor="speech-rate" className="font-semibold">
                        Kecepatan Bicara
                      </label>
                      <span className="font-accessible-mono tabular-nums font-semibold">
                        {settings.speechRate.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      id="speech-rate"
                      type="range"
                      min="0.6"
                      max="2.0"
                      step="0.05"
                      value={settings.speechRate}
                      onChange={(e) =>
                        onUpdate({ speechRate: parseFloat(e.target.value) })
                      }
                      className="h-9 w-full cursor-pointer accent-[var(--accent-primary)]"
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <label htmlFor="speech-pitch" className="font-semibold">
                        Nada Suara
                      </label>
                      <span className="font-accessible-mono tabular-nums font-semibold">
                        {settings.speechPitch.toFixed(1)}
                      </span>
                    </div>
                    <input
                      id="speech-pitch"
                      type="range"
                      min="0.8"
                      max="1.3"
                      step="0.1"
                      value={settings.speechPitch}
                      onChange={(e) =>
                        onUpdate({ speechPitch: parseFloat(e.target.value) })
                      }
                      className="h-9 w-full cursor-pointer accent-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onTestVoice}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  <span>Uji Suara Pembaca Layar</span>
                </button>
              </div>
            )}
          </section>

          {/* Section 2: Tema Kontras & Warna */}
          <section aria-labelledby="section-theme">
            <h3
              id="section-theme"
              className="border-b border-[var(--border-hairline)] pb-2 text-base font-bold"
            >
              2. Tema Kontras &amp; Kecerahan
            </h3>
            <div
              role="radiogroup"
              aria-labelledby="section-theme"
              className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {THEME_OPTIONS.map((opt) => {
                const selected = settings.theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      onUpdate({ theme: opt.id });
                      onAnnounce(`Tema diubah ke ${opt.label}.`);
                    }}
                    className={`flex min-h-[64px] items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                      selected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-black/20 text-sm font-bold"
                      style={{
                        backgroundColor: opt.previewBg,
                        color: opt.previewText,
                      }}
                    >
                      Aa
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">
                        {opt.label}
                      </span>
                      <span className="block text-xs text-[var(--text-muted)]">
                        {opt.contrastNote}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Tipografi & Dukungan Disleksia */}
          <section aria-labelledby="section-typography">
            <h3
              id="section-typography"
              className="border-b border-[var(--border-hairline)] pb-2 text-base font-bold"
            >
              3. Tipografi &amp; Kenyamanan Disleksia
            </h3>
            <div className="mt-4 space-y-5">
              <div>
                <span className="mb-2 block text-sm font-semibold">
                  Jenis Huruf Bacaan
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'sans', label: 'Hyperlegible' },
                      { id: 'serif', label: 'Serif Buku' },
                      { id: 'mono', label: 'Mono Jelas' },
                    ] as { id: FontFamilyChoice; label: string }[]
                  ).map((font) => {
                    const active = settings.fontFamily === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onUpdate({ fontFamily: font.id })}
                        className={`min-h-[44px] rounded-lg border px-3 py-2 text-sm font-semibold whitespace-nowrap ${
                          active
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--accent-contrast-text)]'
                            : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)]'
                        }`}
                      >
                        {font.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <label htmlFor="font-size-slider" className="font-semibold">
                      Ukuran Huruf
                    </label>
                    <span className="font-accessible-mono tabular-nums font-semibold">
                      {settings.fontSizePx}px
                    </span>
                  </div>
                  <input
                    id="font-size-slider"
                    type="range"
                    min="16"
                    max="28"
                    step="1"
                    value={settings.fontSizePx}
                    onChange={(e) =>
                      onUpdate({ fontSizePx: parseInt(e.target.value, 10) })
                    }
                    className="h-9 w-full cursor-pointer accent-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <label
                      htmlFor="line-height-slider"
                      className="font-semibold"
                    >
                      Spasi Baris
                    </label>
                    <span className="font-accessible-mono tabular-nums font-semibold">
                      {settings.lineHeight.toFixed(2)}
                    </span>
                  </div>
                  <input
                    id="line-height-slider"
                    type="range"
                    min="1.5"
                    max="2.2"
                    step="0.05"
                    value={settings.lineHeight}
                    onChange={(e) =>
                      onUpdate({ lineHeight: parseFloat(e.target.value) })
                    }
                    className="h-9 w-full cursor-pointer accent-[var(--accent-primary)]"
                  />
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-semibold">
                  Jarak Antar-Huruf (Disleksia)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'normal', label: 'Normal' },
                      { id: 'wide', label: 'Lebar' },
                      { id: 'wider', label: 'Ekstra Lebar' },
                    ] as { id: LetterSpacingChoice; label: string }[]
                  ).map((spacing) => {
                    const active = settings.letterSpacing === spacing.id;
                    return (
                      <button
                        key={spacing.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onUpdate({ letterSpacing: spacing.id })}
                        className={`min-h-[44px] rounded-lg border px-3 py-2 text-sm font-semibold whitespace-nowrap ${
                          active
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--accent-contrast-text)]'
                            : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)]'
                        }`}
                      >
                        {spacing.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Fokus & Gerakan */}
          <section aria-labelledby="section-focus-motion">
            <h3
              id="section-focus-motion"
              className="border-b border-[var(--border-hairline)] pb-2 text-base font-bold"
            >
              4. Fokus Visual &amp; Pengurangan Gerakan
            </h3>
            <div className="mt-4 space-y-3">
              <label className="flex min-h-[48px] cursor-pointer items-center justify-between gap-4 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-3">
                <div>
                  <span className="block font-semibold">
                    Penggaris Baca (Garis Fokus)
                  </span>
                  <span className="block text-sm text-[var(--text-muted)]">
                    Pita panduan horizontal agar baris tidak terlewat
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.readingRuler}
                  onChange={(e) =>
                    onUpdate({ readingRuler: e.target.checked })
                  }
                  className="h-6 w-6 shrink-0 accent-[var(--accent-primary)]"
                />
              </label>

              <label className="flex min-h-[48px] cursor-pointer items-center justify-between gap-4 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-3">
                <div>
                  <span className="block font-semibold">
                    Kurangi Animasi &amp; Transisi
                  </span>
                  <span className="block text-sm text-[var(--text-muted)]">
                    Menghilangkan efek gerak bagi sensitivitas vestibular
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) =>
                    onUpdate({ reduceMotion: e.target.checked })
                  }
                  className="h-6 w-6 shrink-0 accent-[var(--accent-primary)]"
                />
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Reset Awal</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-lg bg-[var(--accent-primary)] px-6 py-2 text-sm font-bold text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)]"
          >
            Selesai
          </button>
        </div>
      </aside>
    </div>
  );
}
