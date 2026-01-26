export interface GradientPreset {
  name: string;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
}

export const gradientPresets: GradientPreset[] = [
  { name: 'Blue', gradient: 'from-sky-500 to-blue-600', bgGradient: 'from-sky-50 to-blue-50', borderColor: 'border-sky-200', textColor: 'text-sky-700' },
  { name: 'Purple', gradient: 'from-purple-500 to-indigo-600', bgGradient: 'from-purple-50 to-indigo-50', borderColor: 'border-purple-200', textColor: 'text-purple-700' },
  { name: 'Orange', gradient: 'from-amber-500 to-orange-600', bgGradient: 'from-amber-50 to-orange-50', borderColor: 'border-amber-200', textColor: 'text-amber-700' },
  { name: 'Teal', gradient: 'from-teal-500 to-cyan-600', bgGradient: 'from-teal-50 to-cyan-50', borderColor: 'border-teal-200', textColor: 'text-teal-700' },
  { name: 'Pink', gradient: 'from-fuchsia-500 to-pink-600', bgGradient: 'from-fuchsia-50 to-pink-50', borderColor: 'border-fuchsia-200', textColor: 'text-fuchsia-700' },
  { name: 'Green', gradient: 'from-lime-500 to-green-600', bgGradient: 'from-lime-50 to-green-50', borderColor: 'border-lime-200', textColor: 'text-lime-700' },
  { name: 'Red', gradient: 'from-rose-500 to-red-600', bgGradient: 'from-rose-50 to-red-50', borderColor: 'border-rose-200', textColor: 'text-rose-700' },
  { name: 'Slate', gradient: 'from-slate-500 to-gray-600', bgGradient: 'from-slate-50 to-gray-50', borderColor: 'border-slate-200', textColor: 'text-slate-700' },
];
