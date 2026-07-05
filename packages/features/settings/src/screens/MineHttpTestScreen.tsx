import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Clipboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ENV_CONFIGS} from '@core/config';
import {getApiClient} from '@core/api-client';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {
  getHarmonyArticleCount,
  getHarmonySections,
  type HarmonyArticleModel,
  type HarmonyIndexModel,
  type HarmonySectionModel,
} from '../models/harmonyIndexModel';
import {
  defaultMineHttpTestArgs,
  parseMineHttpTestArgs,
} from '../models/mineHttpTestArgs';
import {HARMONY_INDEX_PATH, fetchHarmonyIndex} from '../services/mineApi';
import {mineTheme} from '../theme/mineTheme';
import {MineIcon, type MineIconName} from '../components/mineIcons';

type LoadState = 'loading' | 'success' | 'error';

export function MineHttpTestScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.mineHttpTest>) {
  const insets = useSafeAreaInsets();
  const args = useMemo(
    () =>
      parseMineHttpTestArgs(
        route.params as Record<string, unknown> | undefined,
      ),
    [route.params],
  );
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [indexModel, setIndexModel] = useState<HarmonyIndexModel | null>(null);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadState('loading');
    setErrorMessage(null);
    try {
      const model = await fetchHarmonyIndex();
      setIndexModel(model);
      setLoadState('success');
      setLoadedAt(new Date());
    } catch (error) {
      setLoadState('error');
      setErrorMessage(error instanceof Error ? error.message : '请求失败');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const visibleSections = useMemo(() => {
    if (!indexModel) {
      return [] as HarmonySectionModel[];
    }
    const section =
      args.level === 1
        ? indexModel.links
        : args.level === 2
        ? indexModel.openSources
        : args.level === 3
        ? indexModel.tools
        : null;
    if (section) {
      return [section];
    }
    return getHarmonySections(indexModel);
  }, [args.level, indexModel]);

  const baseUrl = getApiClient().defaults.baseURL ?? ENV_CONFIGS.test.baseUrl;

  return (
    <AppPageScaffold
      backgroundColor={mineTheme.httpPageBackground}
      navBar={
        <AppNavBar
          title={args.title || defaultMineHttpTestArgs.title}
          backgroundColor="#fff"
          showBackButton
          onBack={() => navigation.goBack()}
          right={
            <TouchableOpacity onPress={loadData} style={styles.navAction}>
              <MineIcon
                name="refresh_rounded"
                color={mineTheme.httpSuccessGreen}
                size={22}
              />
            </TouchableOpacity>
          }
        />
      }>
      <ScrollView
        contentContainerStyle={[
          styles.body,
          {paddingBottom: insets.bottom + 32},
        ]}>
        <RequestInfoCard
          baseUrl={baseUrl}
          path={HARMONY_INDEX_PATH}
          loadState={loadState}
          level={args.level}
          loadedAt={loadedAt}
          articleCount={indexModel ? getHarmonyArticleCount(indexModel) : null}
        />

        {loadState === 'loading' ? <LoadingPanel /> : null}
        {loadState === 'error' ? (
          <ErrorPanel message={errorMessage ?? '请求失败'} onRetry={loadData} />
        ) : null}
        {loadState === 'success' && indexModel ? (
          <>
            {args.level >= 4 ? <OverviewBanner model={indexModel} /> : null}
            {visibleSections.map(section => (
              <SectionBlock key={section.name ?? 'section'} section={section} />
            ))}
          </>
        ) : null}
      </ScrollView>
    </AppPageScaffold>
  );
}

function RequestInfoCard({
  baseUrl,
  path,
  loadState,
  level,
  loadedAt,
  articleCount,
}: {
  baseUrl: string;
  path: string;
  loadState: LoadState;
  level: number;
  loadedAt: Date | null;
  articleCount: number | null;
}) {
  const status =
    loadState === 'loading'
      ? {label: '请求中', color: mineTheme.httpWarning}
      : loadState === 'success'
      ? {label: '请求成功', color: mineTheme.httpSuccessGreen}
      : {label: '请求失败', color: mineTheme.httpError};

  return (
    <View style={styles.requestCardOuter}>
      <View style={styles.requestCardInner}>
        <View style={styles.requestHeader}>
          <View
            style={[styles.statusPill, {backgroundColor: `${status.color}2E`}]}>
            <Text style={[styles.statusText, {color: status.color}]}>
              {status.label}
            </Text>
          </View>
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
        <InfoRow label="BaseUrl" value={baseUrl} />
        <InfoRow label="Path" value={path} />
        {loadedAt ? (
          <InfoRow
            label="完成时间"
            value={`${String(loadedAt.getHours()).padStart(2, '0')}:${String(
              loadedAt.getMinutes(),
            ).padStart(2, '0')}:${String(loadedAt.getSeconds()).padStart(
              2,
              '0',
            )}`}
          />
        ) : null}
        {articleCount != null ? (
          <InfoRow label="资源总数" value={`${articleCount} 条`} />
        ) : null}
      </View>
    </View>
  );
}

function InfoRow({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function LoadingPanel() {
  return (
    <View style={styles.loadingPanel}>
      <ActivityIndicator size="large" color={mineTheme.httpSuccessGreen} />
      <Text style={styles.loadingText}>正在验证网络请求...</Text>
    </View>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.errorPanel}>
      <MineIcon name="cloud_off_rounded" color={mineTheme.textGray500} size={36} />
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <View style={styles.retryContent}>
          <MineIcon name="refresh_rounded" color="#fff" size={20} />
          <Text style={styles.retryButtonText}>重试</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function OverviewBanner({model}: {model: HarmonyIndexModel}) {
  return (
    <View style={styles.overviewBanner}>
      <View style={styles.overviewIconWrap}>
        <MineIcon name="hub_rounded" color={mineTheme.httpSuccessGreen} size={36} />
      </View>
      <Text style={styles.overviewText}>
        {`已加载 ${
          getHarmonySections(model).length
        } 个分类，共 ${getHarmonyArticleCount(model)} 条鸿蒙资源`}
      </Text>
    </View>
  );
}

function SectionBlock({section}: {section: HarmonySectionModel}) {
  const articles = section.articleList ?? [];
  return (
    <View style={styles.sectionBlock}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionAccent} />
        <Text style={styles.sectionTitle} numberOfLines={1}>
          {section.name ?? '未命名分类'}
        </Text>
        <Text style={styles.sectionCount}>{articles.length} 条</Text>
      </View>
      {articles.map(article => (
        <ArticleCard key={`${article.id ?? article.title}`} article={article} />
      ))}
    </View>
  );
}

function ArticleCard({article}: {article: HarmonyArticleModel}) {
  const [linkVisible, setLinkVisible] = useState(false);
  const link = article.link?.trim();
  const desc = article.desc?.trim();

  return (
    <>
      <Pressable
        style={styles.articleCard}
        disabled={!link}
        onPress={() => link && setLinkVisible(true)}>
        <Text style={styles.articleTitle}>{article.title ?? '未命名资源'}</Text>
        {desc ? (
          <Text style={styles.articleDesc} numberOfLines={3}>
            {desc}
          </Text>
        ) : null}
        <View style={styles.tagRow}>
          {article.chapterName ? (
            <TagChip label={article.chapterName} icon="folder_outlined" />
          ) : null}
          {article.author ? (
            <TagChip label={article.author} icon="person_outline_rounded" />
          ) : null}
          {article.niceDate ? (
            <TagChip label={article.niceDate} icon="schedule_rounded" />
          ) : null}
        </View>
        {link ? (
          <View style={styles.linkBox}>
            <MineIcon name="link_rounded" color={mineTheme.httpSuccessGreen} size={14} />
            <Text style={styles.linkText} numberOfLines={1}>
              {link}
            </Text>
            <MineIcon name="chevron_right_rounded" color="#C7C7CC" size={14} />
          </View>
        ) : null}
      </Pressable>

      <Modal transparent visible={linkVisible} animationType="fade">
        <View style={styles.linkDialogMask}>
          <View style={styles.linkDialogCard}>
            <Text style={styles.linkDialogTitle}>资源链接</Text>
            <Text style={styles.linkDialogContent}>{link}</Text>
            <View style={styles.linkDialogActions}>
              <TouchableOpacity
                onPress={() => {
                  if (link) {
                    Clipboard.setString(link);
                    AppToast.show('链接已复制');
                  }
                  setLinkVisible(false);
                }}>
                <Text style={styles.linkDialogAction}>复制</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLinkVisible(false)}>
                <Text style={styles.linkDialogAction}>关闭</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function TagChip({icon, label}: {icon: MineIconName; label: string}) {
  return (
    <View style={styles.tagChip}>
      <MineIcon name={icon} color="#8E9197" size={14} />
      <Text style={styles.tagChipLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  navAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  requestCardOuter: {
    borderRadius: 24,
    backgroundColor: mineTheme.httpCardDarkStart,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 8},
    elevation: 6,
  },
  requestCardInner: {
    padding: 22,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  statusPill: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  levelText: {
    marginLeft: 'auto',
    fontSize: 18,
    fontWeight: '500',
    color: '#B8BBC0',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  infoLabel: {
    width: 88,
    fontSize: 18,
    color: mineTheme.httpMuted,
  },
  infoValue: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  loadingPanel: {
    height: 220,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 20,
    color: '#6B7078',
  },
  errorPanel: {
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 20,
    color: '#6B7078',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 18,
    backgroundColor: mineTheme.httpSuccessGreen,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: mineTheme.httpBannerBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  overviewIconWrap: {
    marginRight: 14,
  },
  overviewText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: mineTheme.httpBannerText,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionAccent: {
    width: 6,
    height: 24,
    borderRadius: 3,
    backgroundColor: mineTheme.httpSuccessGreen,
    marginRight: 10,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 26,
    fontWeight: '700',
    color: mineTheme.httpSectionTitle,
  },
  sectionCount: {
    fontSize: 18,
    color: mineTheme.httpSectionCount,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: mineTheme.httpSectionTitle,
    lineHeight: 31,
  },
  articleDesc: {
    marginTop: 10,
    fontSize: 18,
    color: mineTheme.httpArticleDesc,
    lineHeight: 26,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: mineTheme.httpTagBg,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipLabel: {
    fontSize: 15,
    color: mineTheme.httpTagText,
  },
  linkBox: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: mineTheme.httpLinkBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: mineTheme.httpLinkText,
  },
  linkDialogMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  linkDialogCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  linkDialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  linkDialogContent: {
    fontSize: 14,
    color: mineTheme.httpLinkText,
  },
  linkDialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 16,
  },
  linkDialogAction: {
    fontSize: 16,
    color: mineTheme.primaryBlue,
    marginLeft: 16,
  },
});
