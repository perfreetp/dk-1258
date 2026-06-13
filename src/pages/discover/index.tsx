import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { mockRecommendedMovies } from '@/data/mock';
import { RecommendedMovie } from '@/types';
import styles from './index.module.scss';

const DiscoverPage: React.FC = () => {
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');

  const ageRanges = [
    { value: 'all', label: '全部', minAge: 0 },
    { value: '3+', label: '3岁以上', minAge: 3 },
    { value: '4+', label: '4岁以上', minAge: 4 },
    { value: '5+', label: '5岁以上', minAge: 5 },
    { value: '6+', label: '6岁以上', minAge: 6 }
  ];

  const themes = [
    { id: 'all', name: '全部', icon: '🎬', count: mockRecommendedMovies.length },
    { id: 'courage', name: '勇气成长', icon: '🦁', themes: ['勇气', '成长', '勇敢正义'], count: 0 },
    { id: 'science', name: '科学探索', icon: '🔬', themes: ['自然科学', '地理知识'], count: 0 },
    { id: 'culture', name: '文化传承', icon: '🏮', themes: ['传统文化', '文化传承', '神话故事'], count: 0 },
    { id: 'emotion', name: '情绪管理', icon: '💝', themes: ['情绪管理', '心理健康', '自我认同'], count: 0 },
    { id: 'friendship', name: '友情社交', icon: '🤝', themes: ['友情', '社交技能'], count: 0 },
    { id: 'family', name: '家庭亲情', icon: '👨‍👩‍👧', themes: ['家庭亲情', '亲情'], count: 0 }
  ];

  const filteredMovies = useMemo(() => {
    let result = [...mockRecommendedMovies];

    if (selectedAge !== 'all') {
      const ageRange = ageRanges.find(a => a.value === selectedAge);
      if (ageRange) {
        const minAge = ageRange.minAge;
        result = result.filter(movie => {
          const ageNum = parseInt(movie.ageRange.replace(/\D/g, ''));
          return ageNum <= minAge;
        });
      }
    }

    if (selectedTheme !== 'all') {
      const themeConfig = themes.find(t => t.id === selectedTheme);
      if (themeConfig && 'themes' in themeConfig) {
        result = result.filter(movie =>
          movie.themes.some(t => themeConfig.themes.includes(t))
        );
      }
    }

    return result;
  }, [selectedAge, selectedTheme]);

  const themesWithCounts = useMemo(() => {
    return themes.map(theme => {
      if (theme.id === 'all') {
        return { ...theme, count: mockRecommendedMovies.length };
      }
      if ('themes' in theme) {
        const count = mockRecommendedMovies.filter(movie =>
          movie.themes.some(t => theme.themes.includes(t))
        ).length;
        return { ...theme, count };
      }
      return theme;
    });
  }, []);

  const holidayMovies = filteredMovies.slice(0, 3);

  const getMovieTypeName = (type: string) => {
    const typeMap = {
      'animation': '动画',
      'documentary': '纪录片',
      'family_movie': '亲子电影'
    };
    return typeMap[type] || type;
  };

  const handleMovieClick = (movieId: string) => {
    console.log('[Discover] Movie clicked:', movieId);
  };

  const handleThemeClick = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>发现好片</Text>
        <Text className={styles.subtitle}>精选适合亲子观看的优质影片</Text>

        <View className={styles.themeSection}>
          <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#2D3436', marginBottom: '16rpx' }}>教育主题</Text>
          <ScrollView scrollX className={styles.themeFilter}>
            {themesWithCounts.map(theme => (
              <View
                key={theme.id}
                className={`${styles.themeCard} ${selectedTheme === theme.id ? styles.active : ''}`}
                onClick={() => handleThemeClick(theme.id)}
              >
                <Text className={styles.themeIcon}>{theme.icon}</Text>
                <Text className={styles.themeName}>{theme.name}</Text>
                <Text className={styles.themeCount}>{theme.count}部</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View className={styles.content}>
        <ScrollView scrollX className={styles.ageFilter}>
          {ageRanges.map(age => (
            <View
              key={age.value}
              className={`${styles.ageItem} ${selectedAge === age.value ? styles.active : ''}`}
              onClick={() => setSelectedAge(age.value)}
            >
              {age.label}
            </View>
          ))}
        </ScrollView>

        {filteredMovies.length > 0 ? (
          <>
            <View className={styles.section}>
              <View className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>推荐片单 ({filteredMovies.length}部)</Text>
              </View>
              <ScrollView scrollX className={styles.movieScroll}>
                {filteredMovies.map(movie => (
                  <View
                    key={movie.id}
                    className={styles.movieCard}
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <View className={styles.moviePoster}>
                      <Image src={movie.poster} mode="aspectFill" />
                      <View className={styles.movieTypeBadge}>
                        {getMovieTypeName(movie.type)}
                      </View>
                    </View>
                    <View className={styles.movieInfo}>
                      <Text className={styles.movieTitle}>{movie.title}</Text>
                      <View className={styles.movieMeta}>
                        <Text className={styles.movieAge}>{movie.ageRange}</Text>
                        <View className={styles.movieRating}>
                          <Text>★</Text>
                          <Text>{movie.familyRating.toFixed(1)}</Text>
                        </View>
                      </View>
                      <View className={styles.movieThemes}>
                        {movie.themes.slice(0, 2).map((theme, idx) => (
                          <Text key={idx} className={styles.themeTag}>{theme}</Text>
                        ))}
                      </View>
                      <Text className={styles.movieDesc}>{movie.description}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View className={styles.section}>
              <View className={styles.holidayList}>
                <View className={styles.holidayBanner}>
                  <Text className={styles.holidayTitle}>🎬 假期片单推荐</Text>
                  <Text className={styles.holidayDesc}>精选适合假期亲子观看的影片</Text>
                </View>
                <View className={styles.holidayMovieList}>
                  {holidayMovies.map(movie => (
                    <View
                      key={movie.id}
                      className={styles.holidayMovieItem}
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      <Image src={movie.poster} mode="aspectFill" />
                      <View className={styles.movieInfo}>
                        <Text className={styles.movieTitle}>{movie.title}</Text>
                        <Text className={styles.movieDuration}>{movie.duration}分钟 · {movie.ageRange}</Text>
                        <View className={styles.movieThemes}>
                          {movie.themes.slice(0, 2).map((theme, idx) => (
                            <Text key={idx} className={styles.themeTag}>{theme}</Text>
                          ))}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={{ textAlign: 'center', padding: '120rpx 0' }}>
            <Text style={{ fontSize: '120rpx', opacity: 0.5 }}>🔍</Text>
            <Text style={{ fontSize: '28rpx', color: '#86909C', marginTop: '16rpx' }}>
              暂无符合条件的影片
            </Text>
            <Text
              style={{ fontSize: '24rpx', color: '#FF6B9D', marginTop: '16rpx' }}
              onClick={() => {
                setSelectedAge('all');
                setSelectedTheme('all');
              }}
            >
              点击重置筛选
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DiscoverPage;
