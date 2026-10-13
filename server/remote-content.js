import {backendOrigin} from './gateway.js';
export function remoteContent(backendUrl) {
  const origin = backendOrigin(backendUrl);
  let previous;
  return {async published() {
    try {
      const response = await fetch(origin + '/api/content', {signal: AbortSignal.timeout(8000)});
      if (!response.ok) throw new Error('Content unavailable.');
      const state = await response.json();
      if (!state.content?.settings || !Array.isArray(state.content.pages)) throw new Error('Invalid content response.');
      previous = state;
      return state;
    } catch (error) {
      if (previous) return previous;
      throw error;
    }
  }};
}
