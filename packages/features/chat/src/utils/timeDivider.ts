import type {ImMessage} from '@core/im';
import {formatMessageTimeLabel} from './formatChatTime';

export function shouldInsertTimeDivider(
  messages: ImMessage[],
  createdAt: string,
): boolean {
  if (messages.length === 0) {
    return true;
  }
  const latest = messages[0];
  if (latest.type === 'time') {
    return false;
  }
  const diff = Math.abs(
    new Date(createdAt).getTime() - new Date(latest.createdAt).getTime(),
  );
  return diff >= 5 * 60 * 1000;
}

export function createTimeDividerMessage(
  conversationId: string,
  createdAt: string,
): ImMessage {
  return {
    id: `time_${new Date(createdAt).getTime()}`,
    conversationId,
    type: 'time',
    content: formatMessageTimeLabel(createdAt),
    isSelf: false,
    createdAt,
    sendStatus: 'success',
    readStatus: 'read',
    isRecalled: false,
  };
}

export function canRecallMessage(message: ImMessage): boolean {
  if (!message.isSelf || message.isRecalled) {
    return false;
  }
  const age = Date.now() - new Date(message.createdAt).getTime();
  return age <= 3 * 60 * 1000;
}

export function readStatusLabel(message: ImMessage): string {
  if (message.type === 'time' || message.type === 'system') {
    return '';
  }
  if (!message.isSelf) {
    return message.readStatus === 'read' ? '已读' : '未读';
  }
  if (message.sendStatus === 'sending') {
    return '发送中';
  }
  if (message.sendStatus === 'failed') {
    return '发送失败';
  }
  return message.readStatus === 'read' ? '已读' : '未读';
}
