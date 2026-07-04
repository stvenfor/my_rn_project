import {MockAudioPlayerService} from './mockAudioPlayer';
import {TrackPlayerAudioService} from './trackPlayerService';
import type {AudioPlayerService} from './types';

let sharedService: AudioPlayerService | null = null;
let initPromise: Promise<AudioPlayerService> | null = null;

export async function createAudioPlayerService(): Promise<AudioPlayerService> {
  if (sharedService) {
    return sharedService;
  }
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const native = new TrackPlayerAudioService();
        await native.ensureSetup();
        sharedService = native;
        return native;
      } catch (error) {
        console.warn(
          '[media-player] TrackPlayer unavailable, fallback to mock:',
          error,
        );
        sharedService = new MockAudioPlayerService();
        return sharedService;
      }
    })();
  }
  return initPromise;
}

export function getAudioPlayerService(): AudioPlayerService {
  if (!sharedService) {
    sharedService = new MockAudioPlayerService();
  }
  return sharedService;
}

export function setAudioPlayerService(service: AudioPlayerService): void {
  sharedService = service;
}
