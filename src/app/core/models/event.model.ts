export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date | string;
  location: string;
  time?: string;
  image?: string;
  organizer?: string;
  category: string;
  isVisible: boolean;
  order?: number;
}
