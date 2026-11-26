import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Book } from '../types/library';

interface CoverArtworkProps {
  book: Book;
  className?: string;
}

export function CoverArtwork({ book, className = '' }: CoverArtworkProps) {
  const [imageError, setImageError] = useState(false);

  if (book.coverImage && !imageError) {
    return (
      <div
        className={`relative overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-surface)] ${className}`}
      >
        <img
          src={book.coverImage}
          alt={book.coverAlt}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={book.coverAlt}
      className={`relative flex flex-col justify-between overflow-hidden border border-[var(--border-hairline)] p-6 ${className}`}
      style={{
        backgroundColor: book.coverAccentHex,
        color: '#FFFFFF',
      }}
    >
      <div className="flex items-center justify-between border-b border-white/25 pb-3 text-xs tracking-widest uppercase">
        <span className="font-accessible-mono tabular-nums">
          {book.accessionCode}
        </span>
        <BookOpen className="h-4 w-4 opacity-85" aria-hidden="true" />
      </div>

      <div className="my-auto py-4">
        <p className="text-xs tracking-wider uppercase opacity-80">
          {book.category}
        </p>
        <h3 className="font-display mt-2 text-xl leading-snug font-semibold text-balance">
          {book.title}
        </h3>
      </div>

      <div className="border-t border-white/25 pt-3 text-xs opacity-90">
        {book.author}
      </div>
    </div>
  );
}
