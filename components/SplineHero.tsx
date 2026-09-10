'use client';

import Script from 'next/script';
import EcosystemNetwork from '@/components/EcosystemNetwork';

// Pinned Spline viewer build (see https://spline.design/3d-design).
// Bumped deliberately — the viewer API is stable across 1.x.
const SPLINE_VIEWER_SRC =
  'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';

/**
 * Hero 3D slot. When NEXT_PUBLIC_SPLINE_SCENE_URL is set to a published
 * Spline scene (Spline editor → Export → Viewer → copy scene URL), the
 * interactive 3D scene renders here. Until then, the lightweight SVG
 * ecosystem diagram renders instead — no empty hero, no extra dependency.
 */
export default function SplineHero() {
  const sceneUrl = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;

  if (!sceneUrl) {
    return <EcosystemNetwork />;
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-[28px] border border-white/10 bg-navy-light/40">
      <Script src={SPLINE_VIEWER_SRC} strategy="lazyOnload" />
      <spline-viewer
        url={sceneUrl}
        loading="lazy"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
