import { useEffect, useRef } from 'react';
import { Volume2, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadShortcuts: () => void;
}

const SHORTCUTS: { keys: string; description: string }[] = [
  { keys: '/', description: 'Fokus langsung ke kotak pencarian buku di katalog' },
  { keys: 'Spasi', description: 'Putar atau jeda pembaca layar saat membaca buku' },
  { keys: 'Panah Kiri / Kanan', description: 'Pindah ke kalimat sebelumnya atau berikutnya' },
  { keys: 'H', description: 'Aktifkan atau matikan tema Kontras Ekstrem AAA' },
  { keys: 'A', description: 'Buka panel Pengaturan Aksesibilitas & Suara' },
  { keys: '?', description: 'Tampilkan atau tutup daftar pintasan papan ketik ini' },
  { keys: 'Esc', description: 'Tutup dialog atau panel yang sedang terbuka' },
];

export function ShortcutsModal({
  isOpen,
  onClose,
  onReadShortcuts,
}: ShortcutsModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
        className="w-full max-w-xl rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-hairline)] px-6 py-4">
          <h2
            id="shortcuts-modal-title"
            className="font-display text-2xl font-semibold"
          >
            Pintasan Papan Ketik
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup daftar pintasan"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-subtle)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Seluruh perpustakaan dapat dioperasikan sepenuhnya tanpa tetikus
            menggunakan tombol Tab, Enter, dan pintasan cepat berikut.
          </p>

          <dl className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
            {SHORTCUTS.map((item) => (
              <div
                key={item.keys}
                className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
              >
                <dt className="font-accessible-mono inline-block self-start rounded border border-[var(--border-strong)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-semibold">
                  {item.keys}
                </dt>
                <dd className="text-sm text-[var(--text-primary)] sm:text-right">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] px-6 py-4">
          <button
            type="button"
            onClick={onReadShortcuts}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold hover:bg-[var(--bg-subtle)]"
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            <span>Bacakan Semua Pintasan</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-lg bg-[var(--accent-primary)] px-5 py-2 text-sm font-bold text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
