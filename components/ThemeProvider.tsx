'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useServerInsertedHTML } from 'next/navigation';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';
const DEFAULT_THEME: Theme = 'dark';

// Runs before paint (injected into the SSR stream, outside the React tree)
// so the correct `dark`/`light` class is present before hydration — no
// flash, and no client-rendered <script> for React 19 to flag.
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}")||"${DEFAULT_THEME}";var r=s==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):s;var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(r);d.style.colorScheme=r;}catch(e){}})();`;

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark' | null;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  resolvedTheme: 'dark',
  systemTheme: null,
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

function getSystemTheme(): 'light' | 'dark' | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  const el = document.documentElement;
  el.classList.remove('light', 'dark');
  el.classList.add(resolved);
  el.style.colorScheme = resolved;
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // Private mode etc. — fall back to default.
  }
  return DEFAULT_THEME;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializers read browser state during hydration (never on the
  // server), so no mount effect — and no set-state-in-effect — is needed.
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark' | null>(getSystemTheme);

  // FOUC guard lives in the HTML stream — React never renders a <script>.
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
  ));

  // Follow OS changes while in system mode.
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemTheme(query.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [theme]);

  // Cross-tab sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue;
      if (next === 'light' || next === 'dark' || next === 'system') {
        setThemeState(next);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemTheme ?? 'dark') : theme;

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme ]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode etc. — theme still applies for this session.
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, resolvedTheme, systemTheme }),
    [theme, setTheme, resolvedTheme, systemTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
