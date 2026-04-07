export interface News {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: Date | string;
  category: 'Announcement' | 'Event' | 'Reminder';
  isVisible: boolean;
  order?: number;
  /** Relative `/uploads/...` path from API */
  imagePath?: string;
}
