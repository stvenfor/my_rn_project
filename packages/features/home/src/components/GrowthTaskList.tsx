import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {checkInMallTheme} from '../theme/checkInMallTheme';

export type TaskActionType = 'primary' | 'completed';

export interface GrowthTask {
  icon: string;
  title: string;
  subtitle: string;
  actionText: string;
  actionType: TaskActionType;
  showHelp?: boolean;
}

interface Props {
  tasks: GrowthTask[];
}

export function GrowthTaskList({tasks}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>成长值任务</Text>
      <View style={styles.card}>
        {tasks.map((task, index) => (
          <View key={task.title}>
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{task.icon}</Text>
              </View>
              <View style={styles.meta}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{task.title}</Text>
                  {task.showHelp ? <Text style={styles.help}>?</Text> : null}
                </View>
                <Text style={styles.subtitle}>{task.subtitle}</Text>
              </View>
              <TaskButton task={task} />
            </View>
            {index < tasks.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

function TaskButton({task}: {task: GrowthTask}) {
  if (task.actionType === 'completed') {
    return (
      <View style={styles.completedBtn}>
        <Text style={styles.completedText}>{task.actionText}</Text>
      </View>
    );
  }
  return (
    <View style={styles.primaryBtn}>
      <Text style={styles.primaryText}>{task.actionText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {marginHorizontal: 16, marginTop: 16},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: checkInMallTheme.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: checkInMallTheme.cardWhite,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: checkInMallTheme.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {fontSize: 18},
  meta: {flex: 1, marginLeft: 12},
  titleRow: {flexDirection: 'row', alignItems: 'center'},
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: checkInMallTheme.textPrimary,
  },
  help: {
    fontSize: 12,
    color: checkInMallTheme.textHint,
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 12,
    color: checkInMallTheme.textSecondary,
    marginTop: 2,
  },
  primaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: checkInMallTheme.primaryBlue,
  },
  primaryText: {color: '#fff', fontSize: 12, fontWeight: '500'},
  completedBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: checkInMallTheme.pendingBg,
  },
  completedText: {color: checkInMallTheme.textHint, fontSize: 12},
  divider: {
    height: 1,
    backgroundColor: checkInMallTheme.divider,
    marginLeft: 56,
    marginRight: 16,
  },
});
