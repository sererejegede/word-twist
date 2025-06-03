import { useState } from "react";
import { anagrams, words } from "@/lib/data";

export type WordPair = {
  original: string;
  scrambled: string;
}

export function useWords() {
  const [word, setWord] = useState<WordPair>();
  const [usedWords, setUsedWords] = useState<string[]>([]);

  const TOTAL_WORDS = 5; // Number of words per game

  const getNextWord = () => {
    const newWord = getRandomWordAndShuffle(usedWords);
    setWord(newWord);
    setUsedWords(prevUsedWords => [...prevUsedWords, newWord.original]);
  };

  const shuffleString = (str: string): string => {
    if (!str) return "";
    const arr = str.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  }

  const getRandomWordAndShuffle = (usedWords: string[]) => {
    const currentWord = words[Math.floor(Math.random() * words.length)];
    if (usedWords.includes(currentWord)) {
      return getRandomWordAndShuffle(usedWords);
    }
    return { original: currentWord, scrambled: shuffleString(currentWord) };
  }

  const shuffleWord = () => {
    setWord(prevWord => {
      if (!prevWord) return prevWord;
      let temp = prevWord.original;
      while (temp === prevWord.original) {
        temp = shuffleString(prevWord.original);
      }
      return { original: prevWord.original, scrambled: temp };
    });
  }

  const isWordCorrect = (word: string, original: string) => {
    return word.trim().toLowerCase() === original.toLowerCase() || anagrams.some(anagram => anagram.anagrams.includes(word.toLowerCase()));
  };

  return { word, usedWords, setUsedWords, getNextWord, shuffleWord, isWordCorrect, TOTAL_WORDS };
}
