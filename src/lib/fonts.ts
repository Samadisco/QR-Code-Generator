export type FontOption = {
  value: string;
  label: string;
};

export const FONT_FAMILIES: FontOption[] = [
  { value: 'var(--font-inter), Arial, sans-serif', label: 'Inter (Default)' }, // Updated to Inter
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: '"Courier New", Courier, monospace', label: 'Courier New' },
  { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
  { value: '"Trebuchet MS", Helvetica, sans-serif', label: 'Trebuchet MS' },
  { value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', label: 'Lucida Sans' },
  { value: 'Impact, Charcoal, sans-serif', label: 'Impact' },
  // You can still offer Geist as an option if you install it separately
  // { value: 'Geist, Arial, sans-serif', label: 'Geist' },
];
