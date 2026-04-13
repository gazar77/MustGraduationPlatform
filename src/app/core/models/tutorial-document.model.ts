export interface TutorialDocument {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  lastUpdate: Date | string;
  isVisible: boolean;
  order?: number;
}
