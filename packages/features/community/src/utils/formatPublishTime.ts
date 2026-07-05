/** 对齐 Flutter CommunityViewModel.formatPublishTime */
export function formatPublishTime(isoTime: string): string {
  const time = new Date(isoTime);
  const diffMs = Date.now() - time.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return '刚刚';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return '昨天';
  }
  return `${time.getMonth() + 1}月${time.getDate()}日`;
}
