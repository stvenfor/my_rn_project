export interface HarmonyArticleModel {
  id?: number;
  title?: string;
  desc?: string;
  link?: string;
  chapterName?: string;
  niceDate?: string;
  author?: string;
}

export interface HarmonySectionModel {
  name?: string;
  desc?: string;
  articleList?: HarmonyArticleModel[];
}

export interface HarmonyIndexModel {
  links?: HarmonySectionModel;
  openSources?: HarmonySectionModel;
  tools?: HarmonySectionModel;
}

export function parseHarmonyIndexModel(
  json: Record<string, unknown>,
): HarmonyIndexModel {
  const parseSection = (raw: unknown): HarmonySectionModel | undefined => {
    if (!raw || typeof raw !== 'object') {
      return undefined;
    }
    const section = raw as Record<string, unknown>;
    const articles: HarmonyArticleModel[] = [];
    const articleList = section.articleList;
    if (Array.isArray(articleList)) {
      for (const item of articleList) {
        if (item && typeof item === 'object') {
          const row = item as Record<string, unknown>;
          articles.push({
            id: typeof row.id === 'number' ? row.id : undefined,
            title: row.title?.toString(),
            desc: row.desc?.toString(),
            link: row.link?.toString(),
            chapterName: row.chapterName?.toString(),
            niceDate: row.niceDate?.toString(),
            author: row.author?.toString(),
          });
        }
      }
    }
    return {
      name: section.name?.toString(),
      desc: section.desc?.toString(),
      articleList: articles,
    };
  };

  return {
    links: parseSection(json.links),
    openSources: parseSection(json.open_sources),
    tools: parseSection(json.tools),
  };
}

export function getHarmonySections(
  model: HarmonyIndexModel,
): HarmonySectionModel[] {
  return [model.links, model.openSources, model.tools].filter(
    (section): section is HarmonySectionModel => section != null,
  );
}

export function getHarmonyArticleCount(model: HarmonyIndexModel): number {
  return getHarmonySections(model).reduce(
    (sum, section) => sum + (section.articleList?.length ?? 0),
    0,
  );
}
