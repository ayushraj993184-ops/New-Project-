import React from 'react';
import {
  AirVent,
  Bath,
  BedDouble,
  Building,
  Car,
  Coffee,
  Flame,
  Key,
  Lock,
  Phone,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Sun,
  Tv,
  Utensils,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export const SUPPORTED_AMENITY_ICONS: Record<string, LucideIcon> = {
  Wifi,
  Zap,
  Flame,
  AirVent,
  Tv,
  Car,
  Coffee,
  ShieldCheck,
  Sparkles,
  BedDouble,
  Bath,
  Utensils,
  Snowflake,
  Sun,
  Lock,
  Key,
  Phone,
  Building,
};

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const IconComponent = SUPPORTED_AMENITY_ICONS[name] || Sparkles;
  return <IconComponent className={className} size={size} />;
};
