export interface MineHttpTestArgs {
  level: number;
  title: string;
  collected: number;
  total: number;
  collecting: boolean;
  locked: boolean;
}

export const defaultMineHttpTestArgs: MineHttpTestArgs = {
  level: 1,
  title: 'Level 1 Starter',
  collected: 0,
  total: 120,
  collecting: false,
  locked: false,
};

export function parseMineHttpTestArgs(
  params: Record<string, unknown> | undefined,
): MineHttpTestArgs {
  if (!params) {
    return {...defaultMineHttpTestArgs};
  }
  return {
    level:
      typeof params.level === 'number'
        ? params.level
        : defaultMineHttpTestArgs.level,
    title:
      typeof params.title === 'string'
        ? params.title
        : defaultMineHttpTestArgs.title,
    collected:
      typeof params.collected === 'number'
        ? params.collected
        : defaultMineHttpTestArgs.collected,
    total:
      typeof params.total === 'number'
        ? params.total
        : defaultMineHttpTestArgs.total,
    collecting:
      typeof params.collecting === 'boolean'
        ? params.collecting
        : defaultMineHttpTestArgs.collecting,
    locked:
      typeof params.locked === 'boolean'
        ? params.locked
        : defaultMineHttpTestArgs.locked,
  };
}
