import React from 'react';
import renderer from 'react-test-renderer';
import {Image} from 'react-native';
import {dubbingHomeAssets, dubbingRankBadge} from '../assets/homeAssets';
import {DubbingCoverImage} from '../components/DubbingCoverImage';
import {DubbingHotRankCard} from '../components/DubbingHotRankCard';
import {DubbingSectionHeader} from '../components/DubbingSectionHeader';
import {HotRankSidebarItem} from '../components/HotRankSidebarItem';
import {HomeDubbingFeedScreen} from '../screens/HomeDubbingFeedScreen';
import {HomeHotRankDetailScreen} from '../screens/HomeHotRankDetailScreen';
import {buildDubbingHomeFeed} from '../data/dubbingMockData';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

jest.mock('@core/navigation', () => ({
  RoutePath: {
    homeSearch: 'HomeSearch',
    homeAllServices: 'HomeAllServices',
    homeHotRankDetail: 'HomeHotRankDetail',
    dubbingVideoDetail: 'DubbingVideoDetail',
    homeDubbingFeed: 'HomeDubbingFeed',
  },
}));

describe('dubbing decorative visuals', () => {
  it('maps Flutter rank badge assets', () => {
    expect(dubbingRankBadge(1)).toBe(dubbingHomeAssets.rank_badge_1);
    expect(dubbingRankBadge(2)).toBe(dubbingHomeAssets.rank_badge_2);
    expect(dubbingRankBadge(3)).toBe(dubbingHomeAssets.rank_badge_3);
    expect(dubbingRankBadge(4)).toBe(dubbingHomeAssets.rank_icon_dub);
  });

  it('renders cover play badge and section swap icon', () => {
    const cover = renderer.create(
      <DubbingCoverImage
        source={dubbingHomeAssets.cover_01}
        width={120}
        height={68}
        duration="02:30"
        badge="AD"
      />,
    );
    const images = cover.root.findAllByType(Image);
    expect(
      images.some(
        img => img.props.source === dubbingHomeAssets.icon_play_badge,
      ),
    ).toBe(true);

    const header = renderer.create(
      <DubbingSectionHeader title="编辑精选" style="refresh" />,
    );
    expect(
      header.root
        .findAllByType(Image)
        .some(img => img.props.source === dubbingHomeAssets.icon_swap),
    ).toBe(true);
  });

  it('renders hot rank wheat and chevron in card', () => {
    const feed = buildDubbingHomeFeed();
    const card = renderer.create(
      <DubbingHotRankCard
        board={feed.hotRankBoards[0]!}
        onViewAll={jest.fn()}
        onItemPress={jest.fn()}
      />,
    );
    const sources = card.root.findAllByType(Image).map(img => img.props.source);
    expect(sources).toEqual(
      expect.arrayContaining([
        dubbingHomeAssets.wheat_left,
        dubbingHomeAssets.wheat_right,
        dubbingHomeAssets.icon_chevron_right,
        dubbingHomeAssets.rank_badge_1,
      ]),
    );
  });

  it('renders sidebar top20 badge for active 热搜榜', () => {
    const tree = renderer.create(
      <HotRankSidebarItem label="热搜榜" active onPress={jest.fn()} />,
    );
    expect(
      tree.root
        .findAllByType(Image)
        .some(
          img => img.props.source === dubbingHomeAssets.hot_rank_badge_top20,
        ),
    ).toBe(true);
  });

  it('smoke renders dubbing feed and hot rank detail screens', () => {
    const navigation = {navigate: jest.fn(), goBack: jest.fn()};
    expect(
      renderer
        .create(
          <HomeDubbingFeedScreen
            navigation={navigation as never}
            route={{key: 'k', name: 'HomeDubbingFeed', params: undefined}}
          />,
        )
        .toJSON(),
    ).toBeTruthy();
    expect(
      renderer
        .create(
          <HomeHotRankDetailScreen
            navigation={navigation as never}
            route={{
              key: 'k2',
              name: 'HomeHotRankDetail',
              params: {title: '热搜榜', boardId: 'hot_search', theme: 'blue'},
            }}
          />,
        )
        .toJSON(),
    ).toBeTruthy();
  });
});
