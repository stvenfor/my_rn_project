export function buildAuthGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return '早上好，欢迎使用i车商';
  }
  if (hour < 18) {
    return '下午好，欢迎使用i车商';
  }
  return '晚上好，欢迎使用i车商';
}
