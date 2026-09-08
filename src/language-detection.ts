/**
 * Builds a noise-reduced language-detection copy and identifies CJK scripts
 * when Latin technical terms would otherwise dominate the detector input.
 */

const URL_PATTERN = /https?:\/\/[^\s<>()]+(?:\([^\s<>()]*\)[^\s<>()]*)*/giu
const FENCED_CODE_BLOCK_PATTERN = /```[\s\S]*?```|~~~[\s\S]*?~~~/gu
const INLINE_CODE_PATTERN = /`[^`\n]*`/gu
const MARKDOWN_LINK_PATTERN = /!?\[([^\]]*)\]\([^\n)]*\)/gu
const COMMIT_SHA_PATTERN = /\b[0-9a-f]{7,40}\b/giu
const MULTIPLE_WHITESPACE_PATTERN = /\s+/gu
const HAN_CHARACTER_PATTERN = /^\p{Script=Han}$/u
const HIRAGANA_CHARACTER_PATTERN = /^\p{Script=Hiragana}$/u
const KATAKANA_CHARACTER_PATTERN = /^\p{Script=Katakana}$/u
const HANGUL_CHARACTER_PATTERN = /^\p{Script=Hangul}$/u
const LATIN_CHARACTER_PATTERN = /^\p{Script=Latin}$/u
const LETTER_CHARACTER_PATTERN = /^\p{Letter}$/u
const MIN_CJK_OVERRIDE_CHARACTERS = 4
const MIN_CJK_OVERRIDE_SHARE = 0.2

interface ScriptCounts {
  totalLetters: number
  latin: number
  han: number
  hiragana: number
  katakana: number
  hangul: number
}

export function getLanguageDetectionText(body: string): string {
  return body
    .replace(URL_PATTERN, ' ')
    .replace(FENCED_CODE_BLOCK_PATTERN, ' ')
    .replace(INLINE_CODE_PATTERN, ' ')
    .replace(MARKDOWN_LINK_PATTERN, '$1')
    .replace(COMMIT_SHA_PATTERN, ' ')
    .replace(MULTIPLE_WHITESPACE_PATTERN, ' ')
    .trim()
}

export function getCjkLanguageOverride(text: string): string | null {
  const counts = getScriptCounts(text)
  const kana = counts.hiragana + counts.katakana
  const japaneseNativeCharacters = counts.han + kana
  const isJapanese =
    kana >= MIN_CJK_OVERRIDE_CHARACTERS &&
    hasMinimumScriptShare(japaneseNativeCharacters, counts.totalLetters) &&
    counts.latin >= japaneseNativeCharacters
  const isKorean =
    counts.hangul >= MIN_CJK_OVERRIDE_CHARACTERS &&
    hasMinimumScriptShare(counts.hangul, counts.totalLetters) &&
    counts.latin >= counts.hangul

  if (isJapanese && isKorean) {
    return null
  }
  if (isJapanese) {
    return 'jpn'
  }
  if (isKorean) {
    return 'kor'
  }

  const hasJapaneseOrKoreanCharacters = kana > 0 || counts.hangul > 0
  const isChinese =
    !hasJapaneseOrKoreanCharacters &&
    counts.han >= MIN_CJK_OVERRIDE_CHARACTERS &&
    hasMinimumScriptShare(counts.han, counts.totalLetters) &&
    counts.latin >= counts.han

  return isChinese ? 'cmn' : null
}

function getScriptCounts(text: string): ScriptCounts {
  const counts: ScriptCounts = {
    totalLetters: 0,
    latin: 0,
    han: 0,
    hiragana: 0,
    katakana: 0,
    hangul: 0
  }

  for (const character of text) {
    if (LETTER_CHARACTER_PATTERN.test(character)) {
      counts.totalLetters += 1
    }
    if (LATIN_CHARACTER_PATTERN.test(character)) {
      counts.latin += 1
    }
    if (HAN_CHARACTER_PATTERN.test(character)) {
      counts.han += 1
    }
    if (HIRAGANA_CHARACTER_PATTERN.test(character)) {
      counts.hiragana += 1
    }
    if (KATAKANA_CHARACTER_PATTERN.test(character)) {
      counts.katakana += 1
    }
    if (HANGUL_CHARACTER_PATTERN.test(character)) {
      counts.hangul += 1
    }
  }

  return counts
}

function hasMinimumScriptShare(
  scriptCharacters: number,
  totalLetters: number
): boolean {
  return (
    totalLetters > 0 &&
    scriptCharacters / totalLetters >= MIN_CJK_OVERRIDE_SHARE
  )
}
