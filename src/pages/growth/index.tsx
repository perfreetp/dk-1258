import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useAppContext } from '@/store/AppContext';
import styles from './index.module.scss';

const GrowthPage: React.FC = () => {
  const { currentChild, movies } = useAppContext();

  const childMovies = movies.filter(m => m.childId === currentChild?.id);

  const stats = useMemo(() => {
    const total = childMovies.length;
    const animation = childMovies.filter(m => m.type === 'animation').length;
    const documentary = childMovies.filter(m => m.type === 'documentary').length;
    const familyMovie = childMovies.filter(m => m.type === 'family_movie').length;
    const totalMinutes = childMovies.reduce((sum, m) => sum + m.duration, 0);
    const rewatchCount = childMovies.filter(m => m.hasRewatch).length;

    const themeCounts: Record<string, number> = {};
    childMovies.forEach(movie => {
      movie.educationThemes.forEach(theme => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });

    const sortedThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      total,
      animation,
      documentary,
      familyMovie,
      totalMinutes,
      rewatchCount,
      topThemes: sortedThemes
    };
  }, [childMovies]);

  const timelineMovies = useMemo(() => {
    return [...childMovies]
      .sort((a, b) => new Date(b.watchDate).getTime() - new Date(a.watchDate).getTime())
      .slice(0, 5);
  }, [childMovies]);

  const getMovieTypeName = (type: string) => {
    const typeMap = {
      'animation': '动画',
      'documentary': '纪录片',
      'family_movie': '亲子电影'
    };
    return typeMap[type] || type;
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>{currentChild?.name || '孩子'}的成长档案</Text>
        <Text className={styles.subtitle}>记录每一次美好的观影时光</Text>

        <View className={styles.statsOverview}>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{stats.total}</Text>
              <Text className={styles.statLabel}>观影片数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{stats.totalMinutes}</Text>
              <Text className={styles.statLabel}>总分钟</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{stats.rewatchCount}</Text>
              <Text className={styles.statLabel}>二刷次数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{stats.topThemes.length}</Text>
              <Text className={styles.statLabel}>教育主题</Text>
            </View>
          </View>

          <View className={styles.progressSection}>
            <Text className={styles.progressTitle}>影片类型分布</Text>
            <View className={styles.progressItem}>
              <View className={styles.progressLabel}>
                <Text>动画</Text>
                <Text>{stats.animation}部</Text>
              </View>
              <View className={styles.progressBar}>
                <View
                  className={`${styles.progressFill} ${styles.progressAnimation}`}
                  style={{ width: `${stats.total > 0 ? (stats.animation / stats.total) * 100 : 0}%` }}
                />
              </View>
            </View>
            <View className={styles.progressItem}>
              <View className={styles.progressLabel}>
                <Text>纪录片</Text>
                <Text>{stats.documentary}部</Text>
              </View>
              <View className={styles.progressBar}>
                <View
                  className={`${styles.progressFill} ${styles.progressDocumentary}`}
                  style={{ width: `${stats.total > 0 ? (stats.documentary / stats.total) * 100 : 0}%` }}
                />
              </View>
            </View>
            <View className={styles.progressItem}>
              <View className={styles.progressLabel}>
                <Text>亲子电影</Text>
                <Text>{stats.familyMovie}部</Text>
              </View>
              <View className={styles.progressBar}>
                <View
                  className={`${styles.progressFill} ${styles.progressFamily}`}
                  style={{ width: `${stats.total > 0 ? (stats.familyMovie / stats.total) * 100 : 0}%` }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>🏆 成长里程碑</Text>
          <View className={styles.achievementCard}>
            <Text className={styles.achievementTitle}>
              {stats.total >= 10 ? '🌟 观影小达人' : stats.total >= 5 ? '🎬 观影新星' : '🌱 观影起步'}
            </Text>
            <Text className={styles.achievementDesc}>
              {currentChild?.name}已经观看了{stats.total}部影片，
              包括{stats.animation}部动画、{stats.documentary}部纪录片，
              总共花费了{Math.floor(stats.totalMinutes / 60)}小时{stats.totalMinutes % 60}分钟的美好时光！
            </Text>
            <View className={styles.achievementStats}>
              <View className={styles.achievementStat}>
                <Text className={styles.statValue}>{Math.floor(stats.totalMinutes / 60)}</Text>
                <Text className={styles.statLabel}>小时观影</Text>
              </View>
              <View className={styles.achievementStat}>
                <Text className={styles.statValue}>{stats.rewatchCount}</Text>
                <Text className={styles.statLabel}>次二刷</Text>
              </View>
              <View className={styles.achievementStat}>
                <Text className={styles.statValue}>{stats.topThemes.length}</Text>
                <Text className={styles.statLabel}>个主题</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📅 观影时间线</Text>
          <View className={styles.timeline}>
            {timelineMovies.map(movie => (
              <View key={movie.id} className={`${styles.timelineItem} ${styles[movie.type]}`}>
                <View className={styles.timelineDot} />
                <Text className={styles.timelineDate}>{movie.watchDate}</Text>
                <Text className={styles.timelineTitle}>{movie.title}</Text>
                <View className={styles.timelineMeta}>
                  <Text className={styles.timelineTag}>{getMovieTypeName(movie.type)}</Text>
                  <Text className={styles.timelineTag}>{movie.duration}分钟</Text>
                  {movie.hasRewatch && <Text className={styles.timelineTag}>已二刷</Text>}
                </View>
                <Text className={styles.timelineReaction}>"{movie.reaction}"</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📚 教育主题分布</Text>
          <View className={styles.themesSection}>
            <View className={styles.themesGrid}>
              {stats.topThemes.length > 0 ? (
                stats.topThemes.map(([theme, count]) => (
                  <View key={theme} className={styles.themeCard}>
                    <Text className={styles.themeIcon}>🏷️</Text>
                    <Text className={styles.themeName}>{theme}</Text>
                    <Text className={styles.themeCount}>{count}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ fontSize: '28rpx', color: '#86909C', textAlign: 'center', padding: '32rpx' }}>
                  还没有教育主题记录
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GrowthPage;
