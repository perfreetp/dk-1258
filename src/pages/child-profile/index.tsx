import React, { useState } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '@/store/AppContext';
import { Child } from '@/types';
import styles from './index.module.scss';

const ChildProfilePage: React.FC = () => {
  const { children, movies, addChild, updateChild, setCurrentChild } = useAppContext();
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: 'male' as 'male' | 'female'
  });

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setFormData({
      name: child.name,
      birthDate: child.birthDate,
      gender: child.gender
    });
    setIsAddingNew(false);
  };

  const handleAddChild = () => {
    setEditingChild(null);
    setFormData({
      name: '',
      birthDate: '',
      gender: 'male'
    });
    setIsAddingNew(true);
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入孩子姓名', icon: 'none' });
      return;
    }

    if (!formData.birthDate) {
      Taro.showToast({ title: '请选择出生日期', icon: 'none' });
      return;
    }

    if (isAddingNew) {
      const newChild: Child = {
        id: `child_${Date.now()}`,
        name: formData.name,
        avatar: 'https://picsum.photos/id/64/200/200',
        birthDate: formData.birthDate,
        age: calculateAge(formData.birthDate),
        gender: formData.gender,
        createdAt: new Date().toISOString()
      };
      addChild(newChild);
      Taro.showToast({ title: '添加成功', icon: 'success' });
      setCurrentChild(newChild);
      setIsAddingNew(false);
    } else if (editingChild) {
      const updatedChild: Child = {
        ...editingChild,
        name: formData.name,
        birthDate: formData.birthDate,
        age: calculateAge(formData.birthDate),
        gender: formData.gender
      };
      updateChild(updatedChild);
      Taro.showToast({ title: '保存成功', icon: 'success' });
      setEditingChild(null);
    }
  };

  const handleCancel = () => {
    setEditingChild(null);
    setIsAddingNew(false);
  };

  return (
    <View className={styles.container}>
      <View className={styles.childList}>
        {children.map(child => {
          const childMovies = movies.filter(m => m.childId === child.id);
          const totalMinutes = childMovies.reduce((sum, m) => sum + m.duration, 0);
          
          return (
            <View
              key={child.id}
              className={styles.childCard}
              onClick={() => handleEditChild(child)}
            >
              <View className={styles.childHeader}>
                <View className={styles.avatarPlaceholder}>
                  👶
                </View>
                <View className={styles.childInfo}>
                  <Text className={styles.childName}>{child.name}</Text>
                  <Text className={styles.childMeta}>{child.age}岁 · {child.gender === 'male' ? '男孩' : '女孩'}</Text>
                  <Text className={styles.childMeta}>出生日期: {child.birthDate}</Text>
                </View>
              </View>
              <View className={styles.childStats}>
                <View className={styles.statItem}>
                  <Text className={styles.statValue}>{childMovies.length}</Text>
                  <Text className={styles.statLabel}>观影片数</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statValue}>{totalMinutes}</Text>
                  <Text className={styles.statLabel}>总分钟</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statValue}>
                    {childMovies.filter(m => m.hasRewatch).length}
                  </Text>
                  <Text className={styles.statLabel}>二刷次数</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {(editingChild || isAddingNew) && (
        <View className={styles.formSection}>
          <Text className={styles.formTitle}>
            {isAddingNew ? '添加新孩子' : '编辑档案'}
          </Text>
          
          <View className={styles.formItem}>
            <Text className={styles.label}>姓名</Text>
            <Input
              className={styles.input}
              placeholder="请输入孩子姓名"
              value={formData.name}
              onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>出生日期</Text>
            <Input
              className={styles.input}
              type="date"
              placeholder="请选择出生日期"
              value={formData.birthDate}
              onInput={(e) => setFormData({ ...formData, birthDate: e.detail.value })}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>性别</Text>
            <View className={styles.genderSelector}>
              <View
                className={`${styles.genderOption} ${formData.gender === 'male' ? styles.active : ''}`}
                onClick={() => setFormData({ ...formData, gender: 'male' })}
              >
                男男孩
              </View>
              <View
                className={`${styles.genderOption} ${formData.gender === 'female' ? styles.active : ''}`}
                onClick={() => setFormData({ ...formData, gender: 'female' })}
              >
                女女孩
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>年龄自动计算</Text>
            <Text style={{ fontSize: '28rpx', color: '#636E72' }}>
              {formData.birthDate ? `${calculateAge(formData.birthDate)}岁` : '请先选择出生日期'}
            </Text>
          </View>
        </View>
      )}

      <View className={styles.bottomBar}>
        {!isAddingNew && !editingChild && (
          <View className={styles.addChildBtn} onClick={handleAddChild}>
            + 添加新孩子
          </View>
        )}
        
        {(isAddingNew || editingChild) && (
          <>
            <View className={styles.saveBtn} onClick={handleSave}>
              保存
            </View>
            <View style={{ height: '16rpx' }} />
            <View
              className={styles.addChildBtn}
              style={{ color: '#636E72', borderColor: '#E9ECEF' }}
              onClick={handleCancel}
            >
              取消
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ChildProfilePage;
