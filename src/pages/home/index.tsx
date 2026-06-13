import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '@/store/AppContext';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { children, currentChild, setCurrentChild, movies } = useAppContext();
  const [currentTab, setCurrentTab] = useState<string>('recent');

  const childMovies = movies.filter(m => m.childId === currentChild?.id);
  const recentMovies = childMovies.slice(0, 3);

  const totalWatchTime = childMovies.reduce((sum, m) => sum + m.duration, 0);
  const rewatchCount = childMovies.filter(m => m.hasRewatch).length;
  const averageRating = childMovies.length > 0
    ? (childMovies.reduce((sum, m) => sum + m.familyRating, 0) / childMovies.length).toFixed(1)
    : '0';

  const getMovieTypeName = (type: string) => {
    const typeMap = {
      'animation': '动画',
      'documentary': '纪录片',
      'family_movie': '亲子电影'
    };
    return typeMap[type] || type;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalf) stars += '½';
    return stars;
  };

  const handleAddMovie = () => {
    Taro.navigateTo({ url: '/pages/add-movie/index' });
  };

  const handleMovieClick = (movieId: string) => {
    Taro.navigateTo({ url: `/pages/movie-detail/index?id=${movieId}` });
  };

  const handleSeeAll = () => {
    Taro.switchTab({ url: '/pages/movies/index' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.headerBg} />
      
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <Text className={styles.greeting}>
            {new Date().getHours() < 12 ? '上午好' : new Date().getHours() < 18 ? '下午好' : '晚上好'} 👋
          </Text>
          <Text className={styles.title}>亲子观影日记</Text>
          
          <ScrollView scrollX className={styles.childSelector}>
            {children.map(child => (
              <View
                key={child.id}
                className={`${styles.childCard} ${currentChild?.id === child.id ? styles.active : ''}`}
                onClick={() => setCurrentChild(child)}
              >
                <Image
                  className={styles.childAvatar}
                  src={child.avatar}
                  mode="aspectFill"
                />
                <View className={styles.childInfo}>
                  <Text className={styles.childName}>{child.name}</Text>
                  <Text className={styles.childAge}>{child.age}岁</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.statsCard}>
          <View className={styles.statsTitle}>
            <Text>观影统计</Text>
            <Text style={{ fontSize: '24rpx', color: '#86909C' }}>共{childMovies.length}部</Text>
          </View>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{childMovies.length}</Text>
              <Text className={styles.statLabel}>观影片数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{totalWatchTime}</Text>
              <Text className={styles.statLabel}>分钟</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{rewatchCount}</Text>
              <Text className={styles.statLabel}>二刷次数</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>近期观影</Text>
            <Text className={styles.seeAll} onClick={handleSeeAll}>查看全部 →</Text>
          </View>
          
          {recentMovies.length > 0 ? (
            <View className={styles.movieList}>
              {recentMovies.map(movie => (
                <View
                  key={movie.id}
                  className={styles.movieItem}
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <View className={styles.moviePoster}>
                    <Image src={movie.poster} mode="aspectFill" />
                  </View>
                  <View className={styles.movieInfo}>
                    <View>
                      <Text className={styles.movieTitle}>{movie.title}</Text>
                      <View className={styles.movieMeta}>
                        <Text className={`${styles.tag} ${styles.tagType}`}>
                          {getMovieTypeName(movie.type)}
                        </Text>
                        {movie.hasRewatch && (
                          <Text className={`${styles.tag} ${styles.tagRewatch}`}>
                            已二刷{movie.rewatchCount}次
                          </Text>
                        )}
                      </View>
                      <Text className={styles.movieDate}>
                        {movie.watchDate} · {movie.duration}分钟
                      </Text>
                    </View>
                    <View className={styles.rating}>
                      <Text className={styles.stars}>{renderStars(movie.familyRating)}</Text>
                      <Text className={styles.ratingText}>{movie.familyRating.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🎬</Text>
              <Text className={styles.emptyText}>还没有观影记录</Text>
              <Text className={styles.emptySubtext}>点击右下角添加第一部影片吧</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.quickAdd} onClick={handleAddMovie}>+</View>
    </View>
  );
};

export default HomePage;
