export type SessionType = {
  id: string;
  name: string;
  color: string;
  iconColor: string;
  borderColor: string;
  shadowColor: string;
  hoverShadowColor: string;
};
export const sessionTypes: SessionType[] = [{
  id: 'deep-focus',
  name: 'Deep Focus',
  color: 'bg-red-500',
  iconColor: 'text-red',
  borderColor: 'border-red-500',
  shadowColor: 'shadow-[0_6px_0_#B33B3B]',
  hoverShadowColor: 'hover:shadow-[0_6px_0_#C74B4B]'
}, {
  id: 'work',
  name: 'Work',
  color: 'bg-green-500',
  iconColor: 'text-[#22c55e]',
  borderColor: 'border-green-500',
  shadowColor: 'shadow-[0_6px_0_#22C55E]',
  hoverShadowColor: 'hover:shadow-[0_6px_0_#16A34A]'
}, {
  id: 'writing',
  name: 'Writing',
  color: 'bg-purple-500',
  iconColor: 'text-purple-500',
  borderColor: 'border-purple-500',
  shadowColor: 'shadow-[0_6px_0_#A855F7]',
  hoverShadowColor: 'hover:shadow-[0_6px_0_#9333EA]'
}, {
  id: 'break',
  name: 'Break',
  color: 'bg-orange-500',
  iconColor: 'text-orange-500',
  borderColor: 'border-orange-500',
  shadowColor: 'shadow-[0_6px_0_#F97316]',
  hoverShadowColor: 'hover:shadow-[0_6px_0_#EA580C]'
}, {
  id: 'study',
  name: 'Study',
  color: 'bg-blue-500',
  iconColor: 'text-blue-500',
  borderColor: 'border-blue-500',
  shadowColor: 'shadow-[0_6px_0_#3B82F6]',
  hoverShadowColor: 'hover:shadow-[0_6px_0_#2563EB]'
}];