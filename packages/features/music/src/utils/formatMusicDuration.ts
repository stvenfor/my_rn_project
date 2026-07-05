/** Matches Flutter MusicPlaybackController.formatDuration (h:mm:ss when hours > 0). */
export function formatMusicDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSec % 60).toString().padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
}
