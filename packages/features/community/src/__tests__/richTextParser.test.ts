import {parseRichText} from '../services/richTextParser';

describe('richTextParser', () => {
  it('parses mention, hashtag and link', () => {
    const segments = parseRichText(
      'hello @张三 #Flutter开发 https://flutter.dev end',
    );
    expect(segments).toEqual([
      {type: 'plain', text: 'hello '},
      {type: 'mention', text: '@张三', payload: '张三'},
      {type: 'plain', text: ' '},
      {type: 'hashtag', text: '#Flutter开发', payload: 'Flutter开发'},
      {type: 'plain', text: ' '},
      {
        type: 'link',
        text: 'https://flutter.dev',
        payload: 'https://flutter.dev',
      },
      {type: 'plain', text: ' end'},
    ]);
  });
});
