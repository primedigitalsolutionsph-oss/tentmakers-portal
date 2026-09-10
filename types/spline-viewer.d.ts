import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
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
