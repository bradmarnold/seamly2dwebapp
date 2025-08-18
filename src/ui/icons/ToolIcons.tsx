/**
 * Simple SVG icons for Seamly2D tools
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const SelectIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path d="M2 2L2 14L6 10L14 14L2 2Z" fill="currentColor" />
  </svg>
);

export const PointIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <circle cx="8" cy="8" r="3" fill="currentColor" />
  </svg>
);

export const LineIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <line x1="2" y1="14" x2="14" y2="2" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CurveIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path d="M2 14Q4 2 8 8Q12 14 14 2" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const ArcIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path d="M2 8A6 6 0 0 1 14 8" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const MirrorIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
    <path d="M2 4L6 8L2 12" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M14 4L10 8L14 12" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const RotateIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path d="M8 2A6 6 0 0 1 14 8A6 6 0 0 1 8 14A6 6 0 0 1 2 8" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M11 5L14 8L11 11" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const PieceIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path d="M2 4L8 2L14 4L14 12L8 14L2 12Z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const NotchIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" />
    <path d="M8 12L6 8L10 8Z" fill="currentColor" />
  </svg>
);

export const GrainlineIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2" />
    <path d="M2 8L4 6L4 10Z" fill="currentColor" />
    <path d="M14 8L12 6L12 10Z" fill="currentColor" />
  </svg>
);

export const AllowanceIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <rect x="4" y="4" width="8" height="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="2" y="2" width="12" height="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" fill="none" />
  </svg>
);

export const PanIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path d="M8 2L10 4L9 4L9 7L12 7L12 6L14 8L12 10L12 9L9 9L9 12L10 12L8 14L6 12L7 12L7 9L4 9L4 10L2 8L4 6L4 7L7 7L7 4L6 4Z" fill="currentColor" />
  </svg>
);