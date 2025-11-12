export interface ChecklistItem {
  id: number;
  label: string;
  critical: boolean;
  completed: boolean;
  notes?: string;
}
