import { Book } from '../types/library';

/**
 * Splits an array of paragraphs into individual sentences while preserving paragraph boundaries.
 */
export interface IndexedSentence {
  globalIndex: number;
  paragraphIndex: number;
  text: string;
}

export function splitParagraphsToSentences(paragraphs: string[]): {
  sentences: IndexedSentence[];
  byParagraph: IndexedSentence[][];
} {
  const sentences: IndexedSentence[] = [];
  const byParagraph: IndexedSentence[][] = [];
  let globalIndex = 0;

  paragraphs.forEach((paragraph, pIdx) => {
    const rawParts = paragraph
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const pSentences: IndexedSentence[] = rawParts.map((text) => {
      const item: IndexedSentence = {
        globalIndex,
        paragraphIndex: pIdx,
        text,
      };
      sentences.push(item);
      globalIndex += 1;
      return item;
    });

    byParagraph.push(pSentences);
  });

  return { sentences, byParagraph };
}

const BRAILLE_MAP: Record<string, string> = {
  a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑', f: '⠋', g: '⠛', h: '⠓', i: '⠊', j: '⠚',
  k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕', p: '⠏', q: '⠟', r: '⠗', s: '⠎', t: '⠞',
  u: '⠥', v: '⠧', w: '⠺', x: '⠭', y: '⠽', z: '⠵',
  '0': '⠼⠚', '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙',
  '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊',
  ' ': ' ', '.': '⠲', ',': '⠂', ';': '⠆', ':': '⠒', '?': '⠦', '!': '⠖',
  '-': '⠤', '(': '⠐⠣', ')': '⠐⠜', '"': '⠦', "'": '⠄', '\n': '\n',
};

export function toUnicodeBraille(text: string): string {
  let result = '';
  for (const ch of text) {
    const lower = ch.toLowerCase();
    const isUpper = ch !== lower && /[a-z]/i.test(ch);
    const mapped = BRAILLE_MAP[lower];
    if (mapped) {
      result += isUpper ? `⠠${mapped}` : mapped;
    } else {
      result += ch;
    }
  }
  return result;
}

export function downloadBookAsAccessibleText(book: Book) {
  const lines: string[] = [
    `${book.title.toUpperCase()}`,
    `${book.subtitle}`,
    `Penulis: ${book.author}`,
    `Kategori: ${book.category} | Tahun: ${book.year} | Kode Arsip: ${book.accessionCode}`,
    '',
    'RINGKASAN',
    book.summary,
    '',
  ];

  book.chapters.forEach((chapter) => {
    lines.push('----------------------------------------');
    lines.push(`BAB ${chapter.number}: ${chapter.title}`);
    lines.push(`Ringkasan Bab: ${chapter.summary}`);
    lines.push('');
    chapter.paragraphs.forEach((p) => {
      lines.push(p);
      lines.push('');
    });
    if (chapter.marginNote) {
      lines.push(`[Catatan Aksesibilitas]: ${chapter.marginNote}`);
      lines.push('');
    }
  });

  triggerFileDownload(`${book.id}-teks-aksesibel.txt`, lines.join('\n'));
}

export function downloadBookAsBrailleText(book: Book) {
  const plainLines: string[] = [
    `${book.title}`,
    `${book.subtitle}`,
    `Penulis: ${book.author}`,
    '',
  ];

  book.chapters.forEach((chapter) => {
    plainLines.push(`Bab ${chapter.number}: ${chapter.title}`);
    chapter.paragraphs.forEach((p) => {
      plainLines.push(p);
    });
    plainLines.push('');
  });

  const brailleContent = toUnicodeBraille(plainLines.join('\n'));
  triggerFileDownload(`${book.id}-braille-unicode.brf.txt`, brailleContent);
}

function triggerFileDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
