import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { mockRecommendedMovies } from '@/data/mock';
import styles from './index.module.scss';

const DiscoverPage: React.FC = () => {
  const [selectedAge, setSelectedAge] = useState<string>('all');

  const ageRanges = [
    { value: 'all', label: '全部' },
    { value: '3+', label: '3岁以上' },
    { value: '4+', label: '4岁以上' },
    { value: '5+', label: '5岁以上' },
    { value: '6+', label: '6岁以上' }
  ];

  const themes = [
    { id: 'courage', name: '勇气成长', icon: '🦁', count: 12 },
    { id: 'science', name: '科学探索', icon: '🔬', count: 8 },
    { id: 'culture', name: '文化传承', icon: '🏮', count: 6 },
    { id: 'emotion', name: '情绪管理', icon: '💝', count: 9 }
  ];

  const holidayMovies = mockRecommendedMovies.slice(0, 3);

  const getMovieTypeName = (type: string) => {
    const typeMap = {
      'animation': '动画',
      'documentary': '纪录片',
      'family_movie': '亲子电影'
    };
    return typeMap[type] || type;
  };

  const handleMovieClick = (movieId: string) => {
    // Could navigate to movie detail
    console.log('[Discover] Movie clicked:', movieId);
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>发现好片</Text>
        <Text className={styles.subtitle}>精选适合亲子观看的优质影片</Text>

        <View className={styles.themeSection}>
          <View className={styles.themeGrid}>
            {themes.map(theme => (
              <View key={theme.id} className={styles.themeCard}>
                <Text className={styles.themeIcon}>{theme.icon}</Text>
                <Text className={styles.themeName}>{theme.name}</Text>
                <Text className={styles.themeCount}>{theme.count}部影片</Text>
              </View>
            ))}
          </View>
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

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>编辑推荐</Text>
          </View>
          <ScrollView scrollX className={styles.movieScroll}>
            {mockRecommendedMovies.map(movie => (
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
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className={styles.section}>
          <View className={styles.holidayList}>
            <View className={styles.holidayBanner}>
              <Text className={styles.holidayTitle}>🎬 暑假片单推荐</Text>
              <Text className={styles.holidayDesc}>精选10部适合暑假观看的优质影片</Text>
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
                    <Text className={styles.movieDuration}>{movie.duration}分钟</Text>
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

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>热门主题</Text>
          </View>
          <ScrollView scrollX className={styles.movieScroll}>
            {mockRecommendedMovies.slice(3, 7).map(movie => (
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
                  <Text className={styles.movieDesc}>{movie.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default DiscoverPage;
