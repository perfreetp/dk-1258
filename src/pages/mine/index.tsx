import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '@/store/AppContext';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const { currentChild, children, settings, updateSettings, movies } = useAppContext();
  const [watchTimeReminder, setWatchTimeReminder] = useState(settings.watchTimeReminder.enabled);
  const [maxDuration, setMaxDuration] = useState(settings.watchTimeReminder.maxDuration);
  const [familyOnly, setFamilyOnly] = useState(settings.privacySettings.familyOnlyVisible);

  const childMovieCount = movies.filter(m => m.childId === currentChild?.id).length;

  const handleNavigate = (url: string) => {
    Taro.navigateTo({ url });
  };

  const handleToggleWatchTime = (value: boolean) => {
    setWatchTimeReminder(value);
    updateSettings({
      watchTimeReminder: {
        ...settings.watchTimeReminder,
        enabled: value
      }
    });
    Taro.showToast({
      title: value ? '提醒已开启' : '提醒已关闭',
      icon: 'success'
    });
  };

  const handleToggleFamilyOnly = (value: boolean) => {
    setFamilyOnly(value);
    updateSettings({
      privacySettings: {
        ...settings.privacySettings,
        familyOnlyVisible: value
      }
    });
    Taro.showToast({
      title: value ? '家庭可见已开启' : '家庭可见已关闭',
      icon: 'success'
    });
  };

  const handleSetMaxDuration = () => {
    Taro.showModal({
      title: '设置提醒时长',
      editable: true,
      placeholderText: '请输入时长（分钟）',
      success: (res) => {
        if (res.confirm && res.content) {
          const duration = parseInt(res.content);
          if (duration > 0 && duration <= 300) {
            setMaxDuration(duration);
            updateSettings({
              watchTimeReminder: {
                ...settings.watchTimeReminder,
                maxDuration: duration
              }
            });
            Taro.showToast({
              title: `已设置${duration}分钟`,
              icon: 'success'
            });
          } else {
            Taro.showToast({
              title: '请输入1-300之间的数字',
              icon: 'none'
            });
          }
        }
      }
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.profileCard}>
          <View className={styles.profileInfo}>
            <View style={{ width: '120rpx', height: '120rpx', borderRadius: '999rpx', overflow: 'hidden', border: '4rpx solid #FF6B9D' }}>
              <View style={{ width: '100%', height: '100%', background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64rpx' }}>
                👨‍👩‍👧
              </View>
            </View>
            <View className={styles.profileText}>
              <Text className={styles.profileName}>幸福一家人</Text>
              <Text className={styles.profileMeta}>
                {children.length}个孩子 · {movies.length}部观影记录
              </Text>
            </View>
          </View>
          <View className={styles.profileActions}>
            <View className={styles.actionBtn} onClick={() => handleNavigate('/pages/child-profile/index')}>
              <Text className={styles.actionIcon}>👶</Text>
              <Text className={styles.actionText}>孩子档案</Text>
            </View>
            <View className={styles.actionBtn} onClick={() => handleNavigate('/pages/share-card/index')}>
              <Text className={styles.actionIcon}>📤</Text>
              <Text className={styles.actionText}>导出观影卡</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.menuSection}>
          <View className={styles.menuItem} onClick={() => handleNavigate('/pages/child-profile/index')}>
            <Text className={styles.menuIcon}>👶</Text>
            <Text className={styles.menuText}>孩子档案管理</Text>
            <Text className={styles.menuArrow}>→</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleNavigate('/pages/share-card/index')}>
            <Text className={styles.menuIcon}>🎨</Text>
            <Text className={styles.menuText}>生成观影卡片</Text>
            <Text className={styles.menuArrow}>→</Text>
          </View>
          <View className={styles.menuItem}>
            <Text className={styles.menuIcon}>📊</Text>
            <Text className={styles.menuText}>观影数据统计</Text>
            <Text className={styles.menuArrow}>→</Text>
          </View>
        </View>

        <View className={styles.settingsSection}>
          <Text className={styles.settingsTitle}>功能设置</Text>
          <View className={styles.settingItem}>
            <View>
              <Text className={styles.settingLabel}>
                <Text className={styles.labelIcon}>⏰</Text>
                观看时长提醒
              </Text>
              <Text className={styles.settingDesc}>
                单次观看超过{maxDuration}分钟提醒休息
              </Text>
            </View>
            <View
              className={`${styles.toggle} ${watchTimeReminder ? styles.active : ''}`}
              onClick={() => handleToggleWatchTime(!watchTimeReminder)}
            />
          </View>
          {watchTimeReminder && (
            <View
              className={styles.settingItem}
              style={{ marginTop: '16rpx' }}
              onClick={handleSetMaxDuration}
            >
              <View>
                <Text className={styles.settingLabel}>
                  <Text className={styles.labelIcon}>⚙️</Text>
                  提醒时长上限
                </Text>
                <Text className={styles.settingDesc}>
                  当前设定: {maxDuration}分钟
                </Text>
              </View>
              <Text style={{ color: '#FF6B9D', fontSize: '28rpx' }}>点击修改 →</Text>
            </View>
          )}
        </View>

        <View className={styles.settingsSection}>
          <Text className={styles.settingsTitle}>隐私设置</Text>
          <View className={styles.settingItem}>
            <View>
              <Text className={styles.settingLabel}>
                <Text className={styles.labelIcon}>🔒</Text>
                家庭可见
              </Text>
              <Text className={styles.settingDesc}>仅家庭成员可查看观影记录</Text>
            </View>
            <View
              className={`${styles.toggle} ${familyOnly ? styles.active : ''}`}
              onClick={() => handleToggleFamilyOnly(!familyOnly)}
            />
          </View>
        </View>

        <View className={styles.footer}>
          <Text className={styles.footerText}>亲子观影日记 v1.0.0</Text>
          <Text className={styles.version}>记录美好亲子时光</Text>
        </View>
      </View>
    </View>
  );
};

export default MinePage;
