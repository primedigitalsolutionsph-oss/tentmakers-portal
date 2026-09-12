import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'spline-viewer': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { url?: string; loading?: string },
        HTMLElement
      >;
    }
  }
}

export {};
