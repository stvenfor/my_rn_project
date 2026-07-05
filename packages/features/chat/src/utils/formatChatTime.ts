export function formatConversationTime(iso: string): string {
  const time = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(time.getFullYear(), time.getMonth(), time.getDate());
  const hm = `${String(time.getHours()).padStart(2, '0')}:${String(
    time.getMinutes(),
  ).padStart(2, '0')}`;

  if (msgDay.getTime() === today.getTime()) {
    return hm;
  }
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (msgDay.getTime() === yesterday.getTime()) {
    return '昨天';
  }
  return `${time.getMonth() + 1}/${time.getDate()}`;
}

export function formatMessageTimeLabel(iso: string): string {
  const time = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(time.getFullYear(), time.getMonth(), time.getDate());
  const hm = `${String(time.getHours()).padStart(2, '0')}:${String(
    time.getMinutes(),
  ).padStart(2, '0')}`;

  if (msgDay.getTime() === today.getTime()) {
    return hm;
  }
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (msgDay.getTime() === yesterday.getTime()) {
    return `昨天 ${hm}`;
  }
  return `${time.getMonth() + 1}/${time.getDate()} ${hm}`;
}
