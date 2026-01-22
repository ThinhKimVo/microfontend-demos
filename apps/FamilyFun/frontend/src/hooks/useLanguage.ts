import { useState, useCallback } from 'react';

type Language = 'en' | 'tc';

interface Translations {
  [key: string]: {
    en: string;
    tc: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { en: 'Home', tc: '首頁' },
  events: { en: 'Events', tc: '活動' },
  about: { en: 'About', tc: '關於我們' },
  login: { en: 'Login', tc: '登入' },
  logout: { en: 'Logout', tc: '登出' },

  // Filters
  filters: { en: 'Filters', tc: '篩選' },
  date: { en: 'Date', tc: '日期' },
  timeSlot: { en: 'Time Slot', tc: '時段' },
  district: { en: 'District', tc: '地區' },
  ageGroup: { en: 'Age Group', tc: '年齡組' },
  price: { en: 'Price', tc: '價格' },
  free: { en: 'Free', tc: '免費' },
  paid: { en: 'Paid', tc: '付費' },
  senFriendly: { en: 'SEN Friendly', tc: 'SEN友善' },

  // Event details
  eventDetails: { en: 'Event Details', tc: '活動詳情' },
  location: { en: 'Location', tc: '地點' },
  dateTime: { en: 'Date & Time', tc: '日期和時間' },
  share: { en: 'Share', tc: '分享' },
  viewOnMap: { en: 'View on Map', tc: '在地圖上查看' },

  // Home page
  featuredEvents: { en: 'Featured Events', tc: '精選活動' },
  senFriendlyEvents: { en: 'SEN Friendly Events', tc: 'SEN友善活動' },
  freeEvents: { en: 'Free Events', tc: '免費活動' },
  touristMode: { en: 'Tourist Mode', tc: '遊客模式' },
  viewAll: { en: 'View All', tc: '查看全部' },
  searchEvents: { en: 'Search events...', tc: '搜索活動...' },

  // Merchant
  dashboard: { en: 'Dashboard', tc: '儀表板' },
  myEvents: { en: 'My Events', tc: '我的活動' },
  submitEvent: { en: 'Submit Event', tc: '提交活動' },
  subscription: { en: 'Subscription', tc: '訂閱' },
  subscriptionStatus: { en: 'Subscription Status', tc: '訂閱狀態' },

  // Status
  draft: { en: 'Draft', tc: '草稿' },
  submitted: { en: 'Submitted', tc: '已提交' },
  approved: { en: 'Approved', tc: '已批准' },
  rejected: { en: 'Rejected', tc: '已拒絕' },

  // Actions
  save: { en: 'Save', tc: '保存' },
  submit: { en: 'Submit', tc: '提交' },
  cancel: { en: 'Cancel', tc: '取消' },
  edit: { en: 'Edit', tc: '編輯' },
  delete: { en: 'Delete', tc: '刪除' },
  approve: { en: 'Approve', tc: '批准' },
  reject: { en: 'Reject', tc: '拒絕' },

  // AI Import
  importFromUrl: { en: 'Import from URL', tc: '從URL導入' },
  pasteUrl: { en: 'Paste event URL', tc: '粘貼活動URL' },
  extracting: { en: 'Extracting...', tc: '正在提取...' },

  // General
  morning: { en: 'Morning', tc: '早上' },
  afternoon: { en: 'Afternoon', tc: '下午' },
  evening: { en: 'Evening', tc: '晚上' },
  allAges: { en: 'All Ages', tc: '所有年齡' },
  perPerson: { en: 'per person', tc: '每人' },
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'tc' : 'en'));
  }, []);

  const t = useCallback(
    (key: string): string => {
      const translation = translations[key];
      if (!translation) return key;
      return translation[language];
    },
    [language]
  );

  return { language, toggleLanguage, t };
};

export default useLanguage;
