export interface LocalSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  audioUrl: string;
  durationMs: number;
  albumArtUrl?: string;
  accentColor?: string;
}

export const MUSIC_MOCK_SONGS: LocalSong[] = [
  {
    id: '1',
    title: 'SoundHelix Song 1',
    artist: 'SoundHelix',
    album: 'Examples',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    durationMs: 348000,
    albumArtUrl: 'https://picsum.photos/seed/music1/300/300',
    accentColor: '#4DD0C8',
  },
  {
    id: '2',
    title: 'SoundHelix Song 2',
    artist: 'SoundHelix',
    album: 'Examples',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    durationMs: 420000,
    accentColor: '#7E57C2',
  },
  {
    id: '3',
    title: 'SoundHelix Song 3',
    artist: 'SoundHelix',
    album: 'Examples',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    durationMs: 360000,
    accentColor: '#5C6BC0',
  },
  {
    id: '4',
    title: 'SoundHelix Song 4',
    artist: 'SoundHelix',
    album: 'Examples',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    durationMs: 390000,
    albumArtUrl: 'https://picsum.photos/seed/music4/300/300',
  },
];
