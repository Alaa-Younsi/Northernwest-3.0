import { useEffect, useRef, useState, useMemo } from 'react';
import type { ProductVariant } from '@/types';
import type { Lang } from '@/types';

const PROMPT = 'nw@northernwest:~$ ';

interface TLine {
  kind: 'cmd' | 'out' | 'blank';
  prompt: string;
  text: string;
  speed: number;    // ms per character
  preDelay: number; // ms pause before starting
}

interface DisplayLine {
  kind: 'cmd' | 'out' | 'blank';
  prompt: string;
  text: string;
  done: boolean;
}

function buildScript(
  name: string,
  categoryName: string,
  price: number,
  variants: ProductVariant[],
  stock: number,
  description: string,
  lang: Lang,
): TLine[] {
  const variantNames = variants
    .map((v) => (v[`name_${lang}` as keyof ProductVariant] as string) || v.name_en)
    .join(' / ');

  const stockText =
    stock === 0 ? 'OUT OF STOCK' : stock < 5 ? `LOW — ${stock} LEFT` : 'IN STOCK';

  const lines: TLine[] = [
    { kind: 'cmd',   prompt: PROMPT, text: 'cat product.info',  speed: 62,  preDelay: 550 },
    { kind: 'blank', prompt: '',     text: '',                  speed: 0,   preDelay: 0   },
    { kind: 'out',   prompt: '',     text: `NAME      ${name.toUpperCase()}`,                 speed: 7, preDelay: 55 },
    { kind: 'out',   prompt: '',     text: `CATEGORY  ${(categoryName || 'N/A').toUpperCase()}`, speed: 7, preDelay: 0  },
    { kind: 'out',   prompt: '',     text: `PRICE     $${price.toFixed(2)} USD`,               speed: 7, preDelay: 0  },
  ];

  if (variantNames) {
    lines.push({ kind: 'out', prompt: '', text: `VARIANTS  ${variantNames.toUpperCase()}`, speed: 7, preDelay: 0 });
  }

  lines.push({ kind: 'out', prompt: '', text: `STATUS    ${stockText}`, speed: 7, preDelay: 0 });

  if (description.trim()) {
    lines.push({ kind: 'blank', prompt: '', text: '', speed: 0, preDelay: 140 });
    lines.push({ kind: 'cmd',   prompt: PROMPT, text: 'cat description.txt', speed: 58, preDelay: 480 });
    lines.push({ kind: 'blank', prompt: '', text: '', speed: 0, preDelay: 0 });

    // Word-wrap description to ~54 chars per line
    const words = description.replace(/\s+/g, ' ').trim().toUpperCase().split(' ');
    let row = '';
    for (const word of words) {
      const candidate = row ? `${row} ${word}` : word;
      if (candidate.length > 54) {
        if (row) lines.push({ kind: 'out', prompt: '', text: row, speed: 5, preDelay: 0 });
        row = word;
      } else {
        row = candidate;
      }
    }
    if (row) lines.push({ kind: 'out', prompt: '', text: row, speed: 5, preDelay: 0 });
  }

  return lines;
}

interface ProductTerminalProps {
  name: string;
  categoryName: string;
  price: number;
  variants: ProductVariant[];
  stock: number;
  description: string;
  lang: Lang;
  /** Change this value to replay the animation (pass the product slug) */
  triggerKey: string;
}

export function ProductTerminal({
  name,
  categoryName,
  price,
  variants,
  stock,
  description,
  lang,
  triggerKey,
}: ProductTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const script = useMemo(
    () => buildScript(name, categoryName, price, variants, stock, description, lang),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triggerKey],
  );

  const makeInitial = (): DisplayLine[] =>
    script.map((l) => ({
      kind: l.kind,
      prompt: l.prompt,
      text: '',
      done: l.kind === 'blank',
    }));

  const [display, setDisplay] = useState<DisplayLine[]>(makeInitial);
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setDisplay(makeInitial());
    setActiveLine(0);

    let lineIdx = 0;
    let charIdx = 0;
    let alive = true;

    const step = () => {
      if (!alive) return;
      const line = script[lineIdx];
      if (!line) {
        setActiveLine(script.length);
        return;
      }

      if (line.kind === 'blank') {
        lineIdx++;
        charIdx = 0;
        setActiveLine(lineIdx);
        timerRef.current = setTimeout(step, 55);
        return;
      }

      const shown = line.text.slice(0, charIdx);

      setDisplay((prev) => {
        if (!alive) return prev;
        const next = [...prev];
        next[lineIdx] = { ...next[lineIdx], text: shown };
        return next;
      });

      if (charIdx < line.text.length) {
        charIdx++;
        // First character: respect the line's preDelay; after that use typing speed
        timerRef.current = setTimeout(step, charIdx === 1 ? line.preDelay : line.speed);
      } else {
        // Line complete
        setDisplay((prev) => {
          if (!alive) return prev;
          const next = [...prev];
          next[lineIdx] = { ...next[lineIdx], done: true };
          return next;
        });
        lineIdx++;
        charIdx = 0;
        setActiveLine(lineIdx);
        // Short pause after a command line, near-instant after output line
        timerRef.current = setTimeout(step, line.kind === 'cmd' ? 130 : 38);
      }
    };

    timerRef.current = setTimeout(step, 350);
    return () => {
      alive = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  // Auto-scroll to bottom as text appears
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [display]);

  const allDone = activeLine >= script.length;

  return (
    <div
      style={{
        background: '#030303',
        border: '1px solid #1a1a1a',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 4px 28px rgba(0,0,0,0.8), 0 0 24px rgba(255,0,0,0.04)',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: '#0a0a0a',
          borderBottom: '1px solid #181818',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '7px 13px',
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF0000', opacity: 0.9 }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#222' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#222' }} />
        <span
          style={{
            color: '#3a3a3a',
            fontSize: '0.58rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginLeft: '6px',
            fontFamily: 'IBM Plex Mono, monospace',
          }}
        >
          northernwest — terminal
        </span>
      </div>

      {/* Output area */}
      <div
        ref={scrollRef}
        style={{
          height: '230px',
          overflowY: 'auto',
          padding: '12px 14px',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.68rem',
          lineHeight: 1.65,
          scrollbarWidth: 'thin',
          scrollbarColor: '#1a1a1a #030303',
        }}
      >
        {display.map((line, idx) => {
          if (line.kind === 'blank') {
            return <div key={idx} style={{ height: '0.45rem' }} />;
          }

          const isActive = idx === activeLine && !allDone;

          if (line.kind === 'cmd') {
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'pre' }}>
                <span style={{ color: '#FF0000' }}>{line.prompt}</span>
                <span style={{ color: '#e8e8e8' }}>{line.text}</span>
                {isActive && <Cursor color="#FF0000" />}
              </div>
            );
          }

          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <span style={{ color: '#33FF33' }}>{line.text}</span>
              {isActive && <Cursor color="#33FF33" />}
            </div>
          );
        })}

        {/* Idle prompt after animation ends */}
        {allDone && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
            <span style={{ color: '#FF0000', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem' }}>
              {PROMPT}
            </span>
            <Cursor color="#FF0000" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes nw-terminal-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Cursor({ color }: { color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '7px',
        height: '12px',
        background: color,
        marginLeft: '1px',
        verticalAlign: 'middle',
        animation: 'nw-terminal-blink 1s step-end infinite',
      }}
    />
  );
}
