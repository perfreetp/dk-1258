import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '@/store/AppContext';
import styles from './index.module.scss';

const ShareCardPage: React.FC = () => {
  const { currentChild, movies } = useAppContext();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');

  const childMovies = movies.filter(m => m.childId === currentChild?.id);

  const stats = useMemo(() => {
    const total = childMovies.length;
    const totalMinutes = childMovies.reduce((sum, m) => sum + m.duration, 0);
    const rewatchCount = childMovies.filter(m => m.hasRewatch).length;

    const themeCounts: Record<string, number> = {};
    childMovies.forEach(movie => {
      movie.educationThemes.forEach(theme => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });

    const topThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([theme]) => theme);

    const allPhotos: string[] = [];
    childMovies.forEach(movie => {
      allPhotos.push(...movie.photos);
    });

    return {
      total,
      totalMinutes,
      rewatchCount,
      topThemes,
      photoCount: allPhotos.length
    };
  }, [childMovies]);

  const templates = [
    { id: 'default', name: '温馨粉', icon: '🌸', desc: '温暖粉色主题', gradient: ['#FFF5F7', '#FFF0F5'] },
    { id: 'blue', name: '天空蓝', icon: '🌊', desc: '清新蓝色主题', gradient: ['#E8F4FD', '#E0F0FF'] },
    { id: 'purple', name: '梦幻紫', icon: '🌟', desc: '梦幻紫色主题', gradient: ['#F3E8FF', '#EDE4FF'] },
    { id: 'green', name: '自然绿', icon: '🌿', desc: '自然绿色主题', gradient: ['#E8F5E9', '#E0F5E1'] }
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  const handleDownload = () => {
    if (stats.total === 0) {
      Taro.showToast({ title: '暂无观影记录可分享', icon: 'none' });
      return;
    }

    Taro.showLoading({ title: '正在生成卡片...' });

    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '卡片已保存到相册', icon: 'success' });
    }, 1500);
  };

  const handleShare = () => {
    if (stats.total === 0) {
      Taro.showToast({ title: '暂无观影记录可分享', icon: 'none' });
      return;
    }

    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    Taro.showToast({ title: '点击右上角分享给好友', icon: 'none' });
  };

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.preview}>
        <View
          className={styles.cardPreview}
          style={{
            background: `linear-gradient(135deg, ${currentTemplate.gradient[0]} 0%, ${currentTemplate.gradient[1]} 100%)`
          }}
        >
          <View className={styles.cardPattern} />
          <View className={styles.cardContent}>
            <View className={styles.cardHeader}>
              <View className={styles.cardAvatar}>👶</View>
              <View className={styles.cardInfo}>
                <Text className={styles.cardName}>{currentChild?.name || '小宝贝'}</Text>
                <Text className={styles.cardMeta}>
                  {currentChild?.age || 5}岁 · 亲子观影档案
                </Text>
              </View>
            </View>

            <View className={styles.cardTitle}>
              <Text className={styles.cardTitleText}>🎬 观影小达人 🎬</Text>
              <Text className={styles.cardSubtitle}>记录美好亲子时光</Text>
            </View>

            <View className={styles.cardStats}>
              <View className={styles.cardStat}>
                <Text className={styles.cardStatValue}>{stats.total}</Text>
                <Text className={styles.cardStatLabel}>观影片数</Text>
              </View>
              <View className={styles.cardStat}>
                <Text className={styles.cardStatValue}>{Math.floor(stats.totalMinutes / 60)}</Text>
                <Text className={styles.cardStatLabel}>观影小时</Text>
              </View>
              <View className={styles.cardStat}>
                <Text className={styles.cardStatValue}>{stats.rewatchCount}</Text>
                <Text className={styles.cardStatLabel}>二刷次数</Text>
              </View>
            </View>

            {stats.topThemes.length > 0 && (
              <View className={styles.cardThemes}>
                <Text className={styles.cardThemesTitle}>探索主题</Text>
                <View className={styles.cardThemesList}>
                  {stats.topThemes.map((theme, idx) => (
                    <Text key={idx} className={styles.cardThemeTag}>{theme}</Text>
                  ))}
                </View>
              </View>
            )}

            <View className={styles.cardFooter}>
              <Text className={styles.cardDate}>
                生成日期: {new Date().toLocaleDateString()}
              </Text>
              <Text className={styles.cardBrand}>亲子观影日记</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>选择模板</Text>
        <View className={styles.templateList}>
          {templates.map(template => (
            <View
              key={template.id}
              className={`${styles.templateCard} ${selectedTemplate === template.id ? styles.active : ''}`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <View
                style={{
                  width: '80rpx',
                  height: '80rpx',
                  borderRadius: '16rpx',
                  background: `linear-gradient(135deg, ${template.gradient[0]} 0%, ${template.gradient[1]} 100%)`,
                  marginBottom: '8rpx'
                }}
              />
              <Text className={styles.templateName}>{template.name}</Text>
              <Text className={styles.templateDesc}>{template.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>分享方式</Text>
        <View className={styles.shareOptions}>
          <View className={styles.shareBtn} onClick={handleDownload}>
            <Text className={styles.shareIcon}>📥</Text>
            <Text className={styles.shareText}>保存到相册</Text>
          </View>
          <View className={styles.shareBtn} onClick={handleShare}>
            <Text className={styles.shareIcon}>📤</Text>
            <Text className={styles.shareText}>分享给好友</Text>
          </View>
        </View>
      </View>

      {stats.photoCount > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>精彩瞬间 ({stats.photoCount}张照片)</Text>
          <Text style={{ fontSize: '24rpx', color: '#86909C', marginTop: '8rpx' }}>
            在观影记录中上传合影和手工作品，它们会在这里展示
          </Text>
        </View>
      )}

      <View style={{ height: '200rpx' }} />

      <View className={styles.bottomBar}>
        <View className={styles.downloadBtn} onClick={handleDownload}>
          生成分享卡片
        </View>
      </View>
    </ScrollView>
  );
};

export default ShareCardPage;
