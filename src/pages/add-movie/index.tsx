import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '@/store/AppContext';
import { Movie } from '@/types';
import styles from './index.module.scss';

const AddMoviePage: React.FC = () => {
  const { addMovie, updateMovie, movies, currentChild } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    type: 'animation' as 'animation' | 'documentary' | 'family_movie',
    watchDate: '',
    duration: '',
    ageRating: 'G',
    reaction: '',
    familyRating: 5,
    hasRewatch: false,
    rewatchCount: 0,
    educationThemes: [] as string[],
    photos: [] as string[],
    isHoliday: false,
    holidayName: ''
  });

  const movieTypes = [
    { value: 'animation', label: '动画', icon: '🎬' },
    { value: 'documentary', label: '纪录片', icon: '📚' },
    { value: 'family_movie', label: '亲子电影', icon: '🎥' }
  ];

  const educationThemes = [
    '勇气', '成长', '友情', '亲情', '自我认同', '自然科学',
    '动物保护', '地理知识', '家庭亲情', '音乐艺术', '文化传承',
    '情绪管理', '心理健康', '社交技能', '传统文化', '勇敢正义'
  ];

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as any).options || {};

    if (options.movieId) {
      const movie = movies.find(m => m.id === options.movieId);
      if (movie) {
        setFormData({
          title: movie.title,
          type: movie.type,
          watchDate: movie.watchDate,
          duration: String(movie.duration),
          ageRating: movie.ageRating,
          reaction: movie.reaction,
          familyRating: movie.familyRating,
          hasRewatch: movie.hasRewatch,
          rewatchCount: movie.rewatchCount,
          educationThemes: movie.educationThemes,
          photos: movie.photos,
          isHoliday: movie.isHoliday,
          holidayName: movie.holidayName || ''
        });
      }
    }
  }, []);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请输入影片名称', icon: 'none' });
      return;
    }
    if (!formData.watchDate) {
      Taro.showToast({ title: '请选择观看日期', icon: 'none' });
      return;
    }
    if (!formData.duration) {
      Taro.showToast({ title: '请输入片长', icon: 'none' });
      return;
    }
    if (!formData.reaction.trim()) {
      Taro.showToast({ title: '请输入孩子反应', icon: 'none' });
      return;
    }

    const movieData: Movie = {
      id: `movie_${Date.now()}`,
      childId: currentChild?.id || '',
      title: formData.title,
      poster: 'https://picsum.photos/id/292/300/400',
      type: formData.type,
      watchDate: formData.watchDate,
      ageRating: formData.ageRating,
      duration: Number(formData.duration),
      rating: 4.5,
      review: '',
      reaction: formData.reaction,
      educationThemes: formData.educationThemes,
      hasRewatch: formData.hasRewatch,
      rewatchCount: formData.hasRewatch ? 1 : 0,
      photos: formData.photos,
      isHoliday: formData.isHoliday,
      holidayName: formData.isHoliday ? formData.holidayName : undefined,
      familyRating: formData.familyRating,
      createdAt: new Date().toISOString()
    };

    addMovie(movieData);
    Taro.showToast({ title: '添加成功', icon: 'success' });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const handleThemeToggle = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      educationThemes: prev.educationThemes.includes(theme)
        ? prev.educationThemes.filter(t => t !== theme)
        : [...prev.educationThemes, theme]
    }));
  };

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>基本信息</Text>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>影片名称 *</Text>
          <Input
            className={styles.input}
            placeholder="请输入影片名称"
            value={formData.title}
            onInput={(e) => setFormData({ ...formData, title: e.detail.value })}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>影片类型 *</Text>
          <View className={styles.typeSelector}>
            {movieTypes.map(type => (
              <View
                key={type.value}
                className={`${styles.typeOption} ${formData.type === type.value ? styles.active : ''}`}
                onClick={() => setFormData({ ...formData, type: type.value as any })}
              >
                <Text className={styles.typeIcon}>{type.icon}</Text>
                <Text>{type.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>观看日期 *</Text>
          <Input
            className={styles.input}
            type="date"
            placeholder="请选择观看日期"
            value={formData.watchDate}
            onInput={(e) => setFormData({ ...formData, watchDate: e.detail.value })}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>片长(分钟) *</Text>
          <Input
            className={styles.input}
            type="number"
            placeholder="请输入片长"
            value={formData.duration}
            onInput={(e) => setFormData({ ...formData, duration: e.detail.value })}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>适龄程度</Text>
          <View className={styles.typeSelector}>
            {['G', 'PG', 'PG-13'].map(rating => (
              <View
                key={rating}
                className={`${styles.typeOption} ${formData.ageRating === rating ? styles.active : ''}`}
                onClick={() => setFormData({ ...formData, ageRating: rating })}
              >
                <Text>{rating}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>家庭评分</Text>
        <View className={styles.starRating}>
          {Array.from({ length: 5 }, (_, i) => (
            <Text
              key={i}
              className={`${styles.star} ${i < formData.familyRating ? styles.active : ''}`}
              onClick={() => setFormData({ ...formData, familyRating: i + 1 })}
            >
              ★
            </Text>
          ))}
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>观影感受 *</Text>
        <Textarea
          className={styles.input}
          style={{ height: '160rpx', textAlign: 'top' }}
          placeholder="记录孩子的观影反应和感受..."
          value={formData.reaction}
          onInput={(e) => setFormData({ ...formData, reaction: e.detail.value })}
        />
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>教育主题</Text>
        <View className={styles.themeSelector}>
          {educationThemes.map(theme => (
            <View
              key={theme}
              className={`${styles.themeOption} ${formData.educationThemes.includes(theme) ? styles.active : ''}`}
              onClick={() => handleThemeToggle(theme)}
            >
              {theme}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>其他信息</Text>
        
        <View
          className={styles.checkbox}
          onClick={() => setFormData({ ...formData, hasRewatch: !formData.hasRewatch })}
        >
          <View className={`${styles.checkboxIcon} ${formData.hasRewatch ? styles.checked : ''}`}>
            {formData.hasRewatch && '✓'}
          </View>
          <Text className={styles.checkboxLabel}>已二刷</Text>
        </View>

        <View
          className={styles.checkbox}
          style={{ marginTop: '16rpx' }}
          onClick={() => setFormData({ ...formData, isHoliday: !formData.isHoliday })}
        >
          <View className={`${styles.checkboxIcon} ${formData.isHoliday ? styles.checked : ''}`}>
            {formData.isHoliday && '✓'}
          </View>
          <Text className={styles.checkboxLabel}>假期观影</Text>
        </View>

        {formData.isHoliday && (
          <View className={styles.formItem} style={{ marginTop: '16rpx' }}>
            <Text className={styles.label}>假期名称</Text>
            <Input
              className={styles.input}
              placeholder="如: 暑假、五一假期"
              value={formData.holidayName}
              onInput={(e) => setFormData({ ...formData, holidayName: e.detail.value })}
            />
          </View>
        )}
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>合影与作品</Text>
        <View className={styles.photoGrid}>
          {formData.photos.map((photo, idx) => (
            <View key={idx} className={styles.photoItem}>
              <Text style={{ fontSize: '24rpx' }}>📷</Text>
            </View>
          ))}
          <View className={styles.photoItem}>+</View>
        </View>
        <View className={styles.addPhotoBtn}>添加照片或作品</View>
      </View>

      <View style={{ height: '200rpx' }} />

      <View className={styles.bottomBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          保存观影记录
        </View>
      </View>
    </ScrollView>
  );
};

export default AddMoviePage;
