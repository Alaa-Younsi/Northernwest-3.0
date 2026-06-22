import { Suspense, lazy, useEffect, useRef, useState, Component } from 'react';
import type { ReactNode } from 'react';

const FloatingKeyboard3D = lazy(() => import('@/components/three/FloatingKeyboard3D'));

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message ?? String(error) };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          <div style={{ color: '#FF0000', fontFamily: 'monospace', fontSize: 11, padding: 16, border: '1px solid #FF0000', maxWidth: 400, wordBreak: 'break-word' }}>
            3D ERROR: {this.state.message}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Placeholder() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 420,
          height: 260,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #0e0e0e 0%, #080808 100%)',
          border: '1px solid #1a1a1a',
          boxShadow: '0 0 40px rgba(255,0,0,0.08)',
        }}
      />
    </div>
  );
}

export function Hero3DKeyboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setFrameloop(entry.isIntersecting ? 'always' : 'never');
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 'clamp(340px, 55vh, 560px)',
        position: 'relative',
        cursor: 'grab',
      }}
    >
      <ErrorBoundary>
        <Suspense fallback={<Placeholder />}>
          <FloatingKeyboard3D frameloop={frameloop} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
