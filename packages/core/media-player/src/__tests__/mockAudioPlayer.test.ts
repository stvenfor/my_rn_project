import {MockAudioPlayerService} from '../mockAudioPlayer';

describe('MockAudioPlayerService', () => {
  let player: MockAudioPlayerService;

  beforeEach(() => {
    player = new MockAudioPlayerService();
  });

  afterEach(() => {
    player.dispose();
  });

  it('plays and reports position', async () => {
    const positions: number[] = [];
    player.setCallbacks({onPositionChanged: ms => positions.push(ms)});
    await player.play('https://example.com/a.mp3', 3000);
    expect(positions).toContain(0);
  });

  it('pauses and resumes', async () => {
    const states: string[] = [];
    player.setCallbacks({onStateChanged: s => states.push(s)});
    await player.play('https://example.com/a.mp3', 3000);
    await player.pause();
    await player.resume();
    expect(states).toEqual(
      expect.arrayContaining(['playing', 'paused', 'playing']),
    );
  });
});
