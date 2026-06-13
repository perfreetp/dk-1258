import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '@/store/AppContext';
import { Movie } from '@/types';
import styles from './index.module.scss';

const MovieDetailPage: React.FC = () => {
  const { movies, deleteMovie, currentChild } = useAppContext();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const eventChannel = Taro.getCurrentInstance().page?.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.on('movieData', (data: Movie) => {
        setMovie(data);
      });
    }

    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as any).options || {};
    
    if (options.id) {
      const foundMovie = movies.find(m => m.id === options.id);
      if (foundMovie) {
        setMovie(foundMovie);
      }
    }
  }, [movies]);

  const getMovieTypeName = (type: string) => {
    const typeMap = {
      'animation': '动画',
      'documentary': '纪录片',
      'family_movie': '亲子电影'
    };
    return typeMap[type] || type;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Text
        key={i}
        className={`${styles.star} ${i < Math.floor(rating) ? styles.active : ''}`}
      >
        ★
      </Text>
    ));
  };

  const handleEdit = () => {
    if (movie) {
      Taro.navigateTo({
        url: `/pages/add-movie/index?movieId=${movie.id}`
      });
    }
  };

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条观影记录吗？',
      success: (res) => {
        if (res.confirm && movie) {
          deleteMovie(movie.id);
          Taro.showToast({ title: '删除成功', icon: 'success' });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  const handlePreviewPhoto = (urls: string[], current: number) => {
    Taro.previewImage({
      urls,
      current: urls[current]
    });
  };

  if (!movie) {
    return (
      <View className={styles.container}>
        <View style={{ padding: '32rpx', textAlign: 'center' }}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.poster}>
        <Image src={movie.poster} mode="aspectFill" />
        <View className={styles.posterOverlay} />
      </View>

      <View className={styles.content}>
        <View className={styles.infoCard}>
          <Text className={styles.movieTitle}>{movie.title}</Text>
          <View className={styles.movieMeta}>
            <Text className={`${styles.tag} ${styles.tagType}`}>
              {getMovieTypeName(movie.type)}
            </Text>
            <Text className={styles.tag}>{movie.watchDate}</Text>
            <Text className={styles.tag}>{movie.duration}分钟</Text>
            <Text className={styles.tag}>适龄: {movie.ageRating}</Text>
            {movie.hasRewatch && (
              <Text className={`${styles.tag} ${styles.tagRewatch}`}>
                已二刷{movie.rewatchCount}次
              </Text>
            )}
            {movie.isHoliday && movie.holidayName && (
              <Text className={`${styles.tag}`}>{movie.holidayName}</Text>
            )}
          </View>

          <View className={styles.ratingSection}>
            <Text className={styles.ratingLabel}>家庭评分</Text>
            <View className={styles.stars}>
              {renderStars(movie.familyRating)}
            </View>
            <Text className={styles.ratingValue}>{movie.familyRating.toFixed(1)}</Text>
          </View>
        </View>

        <View className={styles.reactionCard}>
          <Text className={styles.sectionTitle}>观影感受</Text>
          <Text className={styles.reactionText}>"{movie.reaction}"</Text>
        </View>

        <View className={styles.themesSection}>
          <Text className={styles.sectionTitle}>教育主题</Text>
          <View className={styles.themesGrid}>
            {movie.educationThemes.map((theme, idx) => (
              <Text key={idx} className={styles.themeTag}>{theme}</Text>
            ))}
          </View>
        </View>

        <View className={styles.photosSection}>
          <Text className={styles.sectionTitle}>合影与作品 ({movie.photos.length})</Text>
          {movie.photos.length > 0 ? (
            <View className={styles.photosGrid}>
              {movie.photos.map((photo, idx) => (
                <View
                  key={idx}
                  className={styles.photoItem}
                  onClick={() => handlePreviewPhoto(movie.photos, idx)}
                >
                  <Image src={photo} mode="aspectFill" />
                </View>
              ))}
            </View>
          ) : (
            <Text className={styles.noPhotos}>还没有上传合影或作品</Text>
          )}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={`${styles.actionBtn} ${styles.editBtn}`} onClick={handleEdit}>
          编辑
        </View>
        <View className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={handleDelete}>
          删除
        </View>
      </View>
    </View>
  );
};

export default MovieDetailPage;
