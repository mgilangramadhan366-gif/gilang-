import { useCallback, useEffect, useRef, useState } from 'react';

export interface VoiceOption {
  voiceURI: string;
  name: string;
  lang: string;
}

interface SpeakSequenceOptions {
  rate: number;
  pitch: number;
  voiceURI: string;
  onSentenceStart: (index: number) => void;
  onSequenceEnd: () => void;
}

export function useSpeechEngine() {
  const [supported] = useState<boolean>(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window
  );
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const activeSequenceRef = useRef<{
    id: number;
    sentences: string[];
    currentIndex: number;
    options: SpeakSequenceOptions;
  } | null>(null);
  const sequenceCounterRef = useRef(0);

  const loadVoices = useCallback(() => {
    if (!supported) return;
    const rawVoices = window.speechSynthesis.getVoices();
    const mapped = rawVoices
      .map((v) => ({
        voiceURI: v.voiceURI,
        name: v.name,
        lang: v.lang,
      }))
      .sort((a, b) => {
        const aId = a.lang.toLowerCase().startsWith('id') ? 0 : 1;
        const bId = b.lang.toLowerCase().startsWith('id') ? 0 : 1;
        if (aId !== bId) return aId - bId;
        return a.name.localeCompare(b.name);
      });
    setVoices(mapped);
  }, [supported]);

  useEffect(() => {
    if (!supported) return;
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, [supported, loadVoices]);

  const resolveVoice = useCallback(
    (preferredURI: string): SpeechSynthesisVoice | null => {
      if (!supported) return null;
      const all = window.speechSynthesis.getVoices();
      if (all.length === 0) return null;

      if (preferredURI) {
        const matched = all.find((v) => v.voiceURI === preferredURI);
        if (matched) return matched;
      }

      const indonesian = all.find((v) =>
        v.lang.toLowerCase().startsWith('id')
      );
      if (indonesian) return indonesian;

      return all[0];
    },
    [supported]
  );

  const stop = useCallback(() => {
    sequenceCounterRef.current += 1;
    activeSequenceRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
    if (supported) {
      window.speechSynthesis.cancel();
    }
  }, [supported]);

  const speakUI = useCallback(
    (text: string, rate = 1.05, pitch = 1.0, voiceURI = '') => {
      if (!supported || !text.trim()) return;
      // Do not interrupt active book narration unless user explicitly pauses
      if (activeSequenceRef.current && !isPaused) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = resolveVoice(voiceURI);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = 'id-ID';
      }
      utterance.rate = rate;
      utterance.pitch = pitch;
      window.speechSynthesis.speak(utterance);
    },
    [supported, resolveVoice, isPaused]
  );

  const speakSentenceAt = useCallback(
    (seqId: number, index: number) => {
      const seq = activeSequenceRef.current;
      if (!supported || !seq || seq.id !== seqId) return;

      if (index >= seq.sentences.length) {
        activeSequenceRef.current = null;
        setIsSpeaking(false);
        setIsPaused(false);
        seq.options.onSequenceEnd();
        return;
      }

      seq.currentIndex = index;
      seq.options.onSentenceStart(index);

      const text = seq.sentences[index];
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = resolveVoice(seq.options.voiceURI);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = 'id-ID';
      }
      utterance.rate = seq.options.rate;
      utterance.pitch = seq.options.pitch;

      utterance.onend = () => {
        if (activeSequenceRef.current?.id === seqId) {
          speakSentenceAt(seqId, index + 1);
        }
      };

      utterance.onerror = () => {
        if (activeSequenceRef.current?.id === seqId) {
          activeSequenceRef.current = null;
          setIsSpeaking(false);
          setIsPaused(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [supported, resolveVoice]
  );

  const startSequence = useCallback(
    (
      sentences: string[],
      startIndex: number,
      options: SpeakSequenceOptions
    ) => {
      if (!supported || sentences.length === 0) return;

      window.speechSynthesis.cancel();
      sequenceCounterRef.current += 1;
      const seqId = sequenceCounterRef.current;

      const safeIndex = Math.max(0, Math.min(startIndex, sentences.length - 1));
      activeSequenceRef.current = {
        id: seqId,
        sentences,
        currentIndex: safeIndex,
        options,
      };

      setIsSpeaking(true);
      setIsPaused(false);
      speakSentenceAt(seqId, safeIndex);
    },
    [supported, speakSentenceAt]
  );

  const togglePause = useCallback(() => {
    if (!supported || !activeSequenceRef.current) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [supported, isPaused]);

  const updateLiveOptions = useCallback(
    (rate: number, pitch: number, voiceURI: string) => {
      const seq = activeSequenceRef.current;
      if (!seq) return;
      seq.options.rate = rate;
      seq.options.pitch = pitch;
      seq.options.voiceURI = voiceURI;

      if (isSpeaking && !isPaused) {
        const resumeIdx = seq.currentIndex;
        const seqOptions = { ...seq.options };
        const sentences = seq.sentences;
        startSequence(sentences, resumeIdx, seqOptions);
      }
    },
    [isSpeaking, isPaused, startSequence]
  );

  return {
    supported,
    voices,
    isSpeaking,
    isPaused,
    speakUI,
    startSequence,
    togglePause,
    stop,
    updateLiveOptions,
  };
}
