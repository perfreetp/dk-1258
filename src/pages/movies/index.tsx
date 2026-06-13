import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '@/store/AppContext';
import styles from './index.module.scss';

const MoviesPage: React.FC = () => {
  const { currentChild, movies } = useAppContext();
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  const childMovies = movies.filter(m => m.childId === currentChild?.id);

  const filteredMovies = useMemo(() => {
    let result = [...childMovies];

    if (filterType !== 'all') {
      result = result.filter(m => m.type === filterType);
    }

    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.watchDate).getTime() - new Date(a.watchDate).getTime();
      } else if (sortBy === 'rating') {
        return b.familyRating - a.familyRating;
      } else if (sortBy === 'rewatch') {
        return b.rewatchCount - a.rewatchCount;
      }
      return 0;
    });

    return result;
  }, [childMovies, filterType, sortBy]);

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

  const handleMovieClick = (movieId: string) => {
    Taro.navigateTo({ url: `/pages/movie-detail/index?id=${movieId}` });
  };

  const handleAddMovie = () => {
    Taro.navigateTo({ url: '/pages/add-movie/index' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>观影记录</Text>
        
        <ScrollView scrollX className={styles.filterBar}>
          <View
            className={`${styles.filterItem} ${filterType === 'all' ? styles.active : ''}`}
            onClick={() => setFilterType('all')}
          >
            全部
          </View>
          <View
            className={`${styles.filterItem} ${filterType === 'animation' ? styles.active : ''}`}
            onClick={() => setFilterType('animation')}
          >
            动画
          </View>
          <View
            className={`${styles.filterItem} ${filterType === 'documentary' ? styles.active : ''}`}
            onClick={() => setFilterType('documentary')}
          >
            纪录片
          </View>
          <View
            className={`${styles.filterItem} ${filterType === 'family_movie' ? styles.active : ''}`}
            onClick={() => setFilterType('family_movie')}
          >
            亲子电影
          </View>
          <View style={{ width: '32rpx', flexShrink: 0 }} />
        </ScrollView>

        <ScrollView scrollX className={styles.filterBar} style={{ marginTop: '16rpx' }}>
          <View
            className={`${styles.filterItem} ${sortBy === 'date' ? styles.active : ''}`}
            onClick={() => setSortBy('date')}
          >
            按时间
          </View>
          <View
            className={`${styles.filterItem} ${sortBy === 'rating' ? styles.active : ''}`}
            onClick={() => setSortBy('rating')}
          >
            按评分
          </View>
          <View
            className={`${styles.filterItem} ${sortBy === 'rewatch' ? styles.active : ''}`}
            onClick={() => setSortBy('rewatch')}
          >
            按二刷
          </View>
        </ScrollView>
      </View>

      <View className={styles.content}>
        {filteredMovies.length > 0 ? (
          <View className={styles.movieList}>
            {filteredMovies.map(movie => (
              <View
                key={movie.id}
                className={styles.movieItem}
                onClick={() => handleMovieClick(movie.id)}
              >
                <View className={styles.moviePoster}>
                  <Image src={movie.poster} mode="aspectFill" />
                  {movie.isHoliday && movie.holidayName && (
                    <View className={styles.holidayBadge}>{movie.holidayName}</View>
                  )}
                </View>
                <View className={styles.movieInfo}>
                  <View>
                    <View className={styles.movieHeader}>
                      <Text className={styles.movieTitle}>{movie.title}</Text>
                    </View>
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
                    <Text className={styles.movieReaction}>{movie.reaction}</Text>
                    <View className={styles.themes}>
                      {movie.educationThemes.slice(0, 3).map((theme, idx) => (
                        <Text key={idx} className={styles.themeTag}>{theme}</Text>
                      ))}
                    </View>
                  </View>
                  <View className={styles.rating}>
                    <Text className={styles.stars}>{renderStars(movie.familyRating)}</Text>
                    <Text className={styles.ratingText}>{movie.familyRating.toFixed(1)}</Text>
                    {movie.photos.length > 0 && (
                      <Text className={styles.photoCount}>📷 {movie.photos.length}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🎬</Text>
            <Text className={styles.emptyText}>还没有观影记录</Text>
            <Text className={styles.addBtn} onClick={handleAddMovie}>添加第一部影片</Text>
          </View>
        )}
      </View>

      <View className={styles.floatingBtn} onClick={handleAddMovie}>+</View>
    </View>
  );
};

export default MoviesPage;
