import React from 'react';
import { PuppyBreed, PuppyAccessory } from '../types';

interface PixelPuppyProps {
  size?: number;
  breed?: PuppyBreed;
  accessory?: PuppyAccessory;
  isAnimated?: boolean;
  actionState?: 'idle' | 'happy' | 'eating' | 'wagging' | 'barking' | 'sleeping';
  className?: string;
  onClick?: () => void;
}

export const PixelPuppy: React.FC<PixelPuppyProps> = ({
  size = 140,
  breed = 'golden',
  accessory = 'none',
  isAnimated = true,
  actionState = 'idle',
  className = '',
  onClick,
}) => {
  // Breed color palettes
  const palettes = {
    golden: {
      body: '#FFD700',
      bodyDark: '#E6A800',
      muzzle: '#FFFFFF',
      ears: '#4A2E00',
      outline: '#000000',
      tongue: '#FF3344',
      eyes: '#000000',
      collar: '#E53E3E',
    },
    corgi: {
      body: '#E58E26',
      bodyDark: '#B86A14',
      muzzle: '#FFFFFF',
      ears: '#8B4513',
      outline: '#000000',
      tongue: '#FF3344',
      eyes: '#000000',
      collar: '#3182CE',
    },
    shiba: {
      body: '#E67E22',
      bodyDark: '#BA5308',
      muzzle: '#FDFEFE',
      ears: '#6E2C00',
      outline: '#000000',
      tongue: '#FF3344',
      eyes: '#000000',
      collar: '#38A169',
    },
    dalmatian: {
      body: '#F7FAFC',
      bodyDark: '#CBD5E0',
      muzzle: '#EDF2F7',
      ears: '#1A202C',
      outline: '#000000',
      tongue: '#FF3344',
      eyes: '#000000',
      collar: '#E53E3E',
    },
    midnight: {
      body: '#2D3748',
      bodyDark: '#1A202C',
      muzzle: '#718096',
      ears: '#171923',
      outline: '#000000',
      tongue: '#FC8181',
      eyes: '#F6E05E',
      collar: '#9F7AEA',
    },
  };

  const pal = palettes[breed] || palettes.golden;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={`pixelated ${isAnimated && actionState === 'idle' ? 'animate-bounce-subtle' : ''} ${
          actionState === 'happy' ? 'animate-bounce' : ''
        }`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Pixel grid rendering (32x32) */}
        
        {/* Shadow under puppy */}
        <ellipse cx="16" cy="29" rx="9" ry="2" fill="#000000" fillOpacity="0.25" />

        {/* WAGGING TAIL (Left side) */}
        <g className={isAnimated ? 'origin-[11px_22px] animate-tail' : ''}>
          {/* Tail outline & fill */}
          <rect x="7" y="19" width="2" height="3" fill={pal.outline} />
          <rect x="6" y="20" width="2" height="3" fill={pal.outline} />
          <rect x="8" y="22" width="2" height="2" fill={pal.outline} />
          <rect x="7" y="20" width="2" height="2" fill={pal.body} />
          <rect x="8" y="21" width="1" height="2" fill={pal.bodyDark} />
        </g>

        {/* EARS OUTLINE */}
        {/* Left Ear */}
        <rect x="7" y="8" width="4" height="6" fill={pal.outline} />
        <rect x="6" y="9" width="2" height="6" fill={pal.outline} />
        <rect x="7" y="14" width="3" height="3" fill={pal.outline} />
        <rect x="8" y="9" width="2" height="6" fill={pal.ears} />
        <rect x="7" y="10" width="2" height="5" fill={pal.ears} />

        {/* Right Ear */}
        <rect x="21" y="8" width="4" height="6" fill={pal.outline} />
        <rect x="24" y="9" width="2" height="6" fill={pal.outline} />
        <rect x="22" y="14" width="3" height="3" fill={pal.outline} />
        <rect x="22" y="9" width="2" height="6" fill={pal.ears} />
        <rect x="23" y="10" width="2" height="5" fill={pal.ears} />

        {/* HEAD BASE OUTLINE */}
        <rect x="10" y="6" width="12" height="2" fill={pal.outline} />
        <rect x="9" y="7" width="14" height="1" fill={pal.outline} />
        <rect x="8" y="8" width="16" height="8" fill={pal.outline} />
        <rect x="9" y="16" width="14" height="2" fill={pal.outline} />

        {/* HEAD FILL (Yellow/Breed body) */}
        <rect x="10" y="7" width="12" height="9" fill={pal.body} />
        <rect x="9" y="8" width="14" height="8" fill={pal.body} />
        <rect x="10" y="6" width="12" height="1" fill={pal.body} />
        {/* Head Shading */}
        <rect x="9" y="14" width="2" height="2" fill={pal.bodyDark} />
        <rect x="21" y="14" width="2" height="2" fill={pal.bodyDark} />

        {/* EYES */}
        {actionState === 'sleeping' ? (
          // Sleeping closed eyes ^ ^
          <>
            <rect x="11" y="11" width="3" height="1" fill={pal.eyes} />
            <rect x="10" y="12" width="1" height="1" fill={pal.eyes} />
            <rect x="14" y="12" width="1" height="1" fill={pal.eyes} />
            <rect x="18" y="11" width="3" height="1" fill={pal.eyes} />
            <rect x="17" y="12" width="1" height="1" fill={pal.eyes} />
            <rect x="21" y="12" width="1" height="1" fill={pal.eyes} />
          </>
        ) : actionState === 'happy' ? (
          // Happy squint eyes > <
          <>
            <rect x="11" y="10" width="2" height="2" fill={pal.eyes} />
            <rect x="13" y="11" width="1" height="2" fill={pal.eyes} />
            <rect x="19" y="10" width="2" height="2" fill={pal.eyes} />
            <rect x="18" y="11" width="1" height="2" fill={pal.eyes} />
          </>
        ) : (
          // Cute big retro pixel eyes
          <>
            {/* Left Eye */}
            <rect x="11" y="10" width="3" height="3" fill={pal.eyes} />
            <rect x="11" y="10" width="1" height="1" fill="#FFFFFF" />
            {/* Right Eye */}
            <rect x="18" y="10" width="3" height="3" fill={pal.eyes} />
            <rect x="18" y="10" width="1" height="1" fill="#FFFFFF" />
          </>
        )}

        {/* MUZZLE (White snout) */}
        <rect x="13" y="12" width="6" height="4" fill={pal.muzzle} />
        <rect x="14" y="11" width="4" height="5" fill={pal.muzzle} />

        {/* NOSE */}
        <rect x="15" y="12" width="2" height="1" fill={pal.outline} />
        <rect x="15" y="13" width="2" height="1" fill={pal.outline} />

        {/* MOUTH & TONGUE */}
        <rect x="14" y="14" width="4" height="1" fill={pal.outline} />
        {/* Open tongue out */}
        <rect x="15" y="14" width="3" height="3" fill={pal.outline} />
        <rect x="15" y="14" width="2" height="2" fill={pal.tongue} />
        <rect x="16" y="15" width="2" height="2" fill={pal.tongue} />
        <rect x="15" y="16" width="2" height="1" fill={pal.outline} />

        {/* BODY OUTLINE */}
        <rect x="10" y="17" width="12" height="10" fill={pal.outline} />
        <rect x="9" y="18" width="14" height="8" fill={pal.outline} />

        {/* BODY FILL */}
        <rect x="10" y="17" width="12" height="8" fill={pal.body} />
        <rect x="9" y="18" width="14" height="6" fill={pal.body} />
        {/* Body shading */}
        <rect x="9" y="21" width="2" height="3" fill={pal.bodyDark} />
        <rect x="21" y="21" width="2" height="3" fill={pal.bodyDark} />

        {/* WHITE TUMMY */}
        <rect x="13" y="18" width="6" height="7" fill={pal.muzzle} />
        <rect x="12" y="19" width="8" height="5" fill={pal.muzzle} />

        {/* COLLAR (Optional decorative stripe) */}
        <rect x="11" y="16" width="10" height="1" fill={pal.collar} />
        <rect x="15" y="17" width="2" height="1" fill="#ECC94B" />

        {/* FRONT PAWS */}
        {/* Left Paw */}
        <rect x="11" y="25" width="3" height="2" fill={pal.outline} />
        <rect x="11" y="24" width="3" height="2" fill={pal.body} />
        <rect x="12" y="25" width="1" height="1" fill={pal.outline} />
        {/* Right Paw */}
        <rect x="18" y="25" width="3" height="2" fill={pal.outline} />
        <rect x="18" y="24" width="3" height="2" fill={pal.body} />
        <rect x="19" y="25" width="1" height="1" fill={pal.outline} />

        {/* BACK PAWS / LEGS SIDES */}
        <rect x="8" y="23" width="3" height="3" fill={pal.outline} />
        <rect x="8" y="23" width="2" height="2" fill={pal.bodyDark} />
        <rect x="21" y="23" width="3" height="3" fill={pal.outline} />
        <rect x="22" y="23" width="2" height="2" fill={pal.bodyDark} />

        {/* Dalmatian Spots if dalmatian breed */}
        {breed === 'dalmatian' && (
          <>
            <rect x="12" y="8" width="2" height="1" fill="#1A202C" />
            <rect x="19" y="7" width="1" height="2" fill="#1A202C" />
            <rect x="10" y="20" width="2" height="2" fill="#1A202C" />
            <rect x="20" y="19" width="2" height="1" fill="#1A202C" />
          </>
        )}

        {/* ACCESSORIES */}
        {accessory === 'party-hat' && (
          <g>
            {/* Party Cone Hat */}
            <polygon points="16,0 11,6 21,6" fill="#E53E3E" stroke="#000000" strokeWidth="0.8" />
            {/* Hat pompom */}
            <circle cx="16" cy="1" r="1.5" fill="#ECC94B" stroke="#000000" strokeWidth="0.5" />
            {/* Hat stripes */}
            <line x1="13" y1="4" x2="19" y2="4" stroke="#48BB78" strokeWidth="1" />
            <line x1="14" y1="2.5" x2="18" y2="2.5" stroke="#4299E1" strokeWidth="0.8" />
          </g>
        )}

        {accessory === 'sunglasses' && (
          <g>
            {/* Cool retro 8-bit black shades */}
            <rect x="9" y="9" width="6" height="4" fill="#000000" />
            <rect x="17" y="9" width="6" height="4" fill="#000000" />
            <rect x="14" y="10" width="4" height="2" fill="#000000" />
            {/* Lens Glare */}
            <rect x="10" y="10" width="2" height="1" fill="#63B3ED" />
            <rect x="18" y="10" width="2" height="1" fill="#63B3ED" />
          </g>
        )}

        {accessory === 'red-bandana' && (
          <g>
            {/* Cowboy / Explorer Bandana */}
            <polygon points="10,16 22,16 16,21" fill="#E53E3E" stroke="#000000" strokeWidth="0.8" />
            <rect x="15" y="18" width="2" height="1" fill="#FFFFFF" />
          </g>
        )}

        {accessory === 'bowler' && (
          <g>
            {/* Detective Bowler Hat */}
            <ellipse cx="16" cy="6" rx="7" ry="2" fill="#1A202C" stroke="#000000" strokeWidth="0.8" />
            <rect x="11" y="2" width="10" height="4" rx="1" fill="#1A202C" stroke="#000000" strokeWidth="0.8" />
            <rect x="11" y="5" width="10" height="1" fill="#E53E3E" />
          </g>
        )}

        {accessory === 'crown' && (
          <g>
            {/* Royal Gold Crown */}
            <polygon points="10,6 10,2 13,4 16,1 19,4 22,2 22,6" fill="#ECC94B" stroke="#000000" strokeWidth="0.8" />
            <circle cx="16" cy="2" r="0.7" fill="#E53E3E" />
            <circle cx="11" cy="3" r="0.6" fill="#3182CE" />
            <circle cx="21" cy="3" r="0.6" fill="#38A169" />
          </g>
        )}

        {/* EATING / TREAT ANIMATION */}
        {actionState === 'eating' && (
          <g className="animate-pulse">
            <rect x="14" y="17" width="5" height="3" rx="1" fill="#FFFFFF" stroke="#000" strokeWidth="0.5" />
            <circle cx="13" cy="18.5" r="1.2" fill="#FFFFFF" stroke="#000" strokeWidth="0.4" />
            <circle cx="19" cy="18.5" r="1.2" fill="#FFFFFF" stroke="#000" strokeWidth="0.4" />
          </g>
        )}
      </svg>
    </div>
  );
};
