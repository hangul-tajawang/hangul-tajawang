/**
 * 브라우저 내장 음성 합성(Web Speech API) 얇은 래퍼 — 받아쓰기 게임용.
 * 서버·외부 API 호출이 없어 비용 0. 한국어 음성이 없는 환경은 호출 측에서
 * "보고 쓰기" 모드로 폴백한다.
 *
 * iOS Safari는 첫 speak()가 사용자 제스처(클릭/키 입력) 안에서 호출돼야
 * 이후 재생이 풀리므로, 시작 버튼 핸들러에서 곧바로 speak를 부른다.
 */

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickKoreanVoice(): SpeechSynthesisVoice | null {
  if (!ttsSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  const ko = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('ko'));
  // 온라인(고품질) 음성 > 기본 음성 > 아무 한국어 음성
  return ko.find((v) => /google|natural|online/i.test(v.name)) || ko.find((v) => v.default) || ko[0] || null;
}

/**
 * 음성 목록 로딩 대기 후 한국어 음성 유무를 알려준다.
 * 목록이 비어 있어도(일부 브라우저는 끝까지 비어 있음) lang='ko-KR'로 재생은 시도할 수 있으므로
 * 'unknown'을 돌려 호출 측이 막지 않게 한다.
 */
export function loadKoreanVoice(timeoutMs = 1500): Promise<'ko' | 'none' | 'unknown'> {
  if (!ttsSupported()) return Promise.resolve('none');
  return new Promise((resolve) => {
    const settle = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return false;
      cachedVoice = pickKoreanVoice();
      resolve(cachedVoice ? 'ko' : 'none');
      return true;
    };
    if (settle()) return;
    const onChange = () => {
      if (settle()) window.speechSynthesis.removeEventListener('voiceschanged', onChange);
    };
    window.speechSynthesis.addEventListener('voiceschanged', onChange);
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onChange);
      if (!settle()) resolve('unknown');
    }, timeoutMs);
  });
}

/** 이전 재생을 끊고 text를 읽는다. 끝나면(또는 실패하면) resolve */
export function speak(text: string, rate = 1): Promise<void> {
  if (!ttsSupported()) return Promise.resolve();
  const synth = window.speechSynthesis;
  synth.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    const voice = cachedVoice || pickKoreanVoice();
    if (voice) u.voice = voice;
    u.rate = rate;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    synth.speak(u);
    // 크롬은 오래 멈춰 있던 탭에서 큐가 paused 상태로 남는 경우가 있다
    if (synth.paused) synth.resume();
  });
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel();
}
