export const chatAvatarUrls = {
  self: 'https://picsum.photos/seed/chat_self/150/150',
  peer: (peerId: string) => `https://picsum.photos/seed/chat_${peerId}/150/150`,
} as const;
