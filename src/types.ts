export type MaterialType = 'curriculum' | 'syllabus' | 'lkpd';

export interface SavedMaterial {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  type: MaterialType;
  content: string;
  date: string;
}
