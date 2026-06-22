import { motion } from 'framer-motion';
import type { ProductVariant, Lang } from '@/types';

interface DataRowProps {
  label: string;
  value: string;
  delay: number;
}

function DataRow({ label, value, delay }: DataRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.22 }}
      className="flex items-baseline border-b border-[#0d0d0d] py-[5px]"
    >
      <span className="font-mono text-[9px] text-[#333] uppercase tracking-[0.14em] w-[86px] shrink-0">
        {label}
      </span>
      <span className="font-mono text-[9px] text-[#FF0000] mx-1.5 shrink-0">▸</span>
      <span className="font-mono text-[9px] text-[#bbb] uppercase tracking-wide truncate">
        {value}
      </span>
    </motion.div>
  );
}

interface CyberpunkDataPanelProps {
  name: string;
  categoryName: string;
  price: number;
  variants: ProductVariant[];
  stock: number;
  description: string;
  lang: Lang;
}

export function CyberpunkDataPanel({
  name,
  categoryName,
  price,
  variants,
  stock,
  description,
  lang,
}: CyberpunkDataPanelProps) {
  const variantNames = variants
    .map((v) => (v[`name_${lang}` as keyof ProductVariant] as string) || v.name_en)
    .join(' / ');

  const stockPct = stock === 0 ? 0 : stock < 10 ? Math.max(12, stock * 10) : 100;
  const stockColor =
    stock === 0 ? '#7a0000' : stock < 5 ? '#aa6600' : '#FF0000';
  const stockLabel =
    stock === 0 ? 'OUT OF STOCK' : stock < 5 ? `CRITICAL — ${stock}` : 'NOMINAL';

  const rows: Array<{ label: string; value: string }> = [
    { label: 'DESIGNATION', value: name },
    { label: 'CATEGORY', value: categoryName || 'UNCLASSIFIED' },
    { label: 'UNIT COST', value: `$${price.toFixed(2)} USD` },
    ...(variantNames ? [{ label: 'CONFIG', value: variantNames }] : []),
  ];

  return (
    <div
      className="relative overflow-hidden border border-[#161616]"
      style={{ background: '#070707' }}
    >
      {/* Corner brackets */}
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#FF0000] z-10 pointer-events-none" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#FF0000] z-10 pointer-events-none" />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#FF0000] z-10 pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#FF0000] z-10 pointer-events-none" />

      {/* Scanning line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none z-20"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,0,0,0.55) 50%, transparent 100%)',
          animation: 'nw-data-scan 3.5s linear infinite',
        }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-3.5 py-2 border-b border-[#111]"
        style={{ background: '#0b0b0b' }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="font-mono text-[9px] text-[#FF0000] uppercase tracking-[0.2em]"
        >
          ◈ SPEC_DATA.LOG
        </motion.span>
        <div className="flex items-center gap-1.5">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="font-mono text-[8px] text-[#252525] uppercase tracking-widest"
          >
            SYS.READY
          </motion.span>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#FF0000',
              animation: 'nw-blink-dot 1.4s step-end infinite',
            }}
          />
        </div>
      </div>

      {/* Data rows */}
      <div className="px-3.5 pt-1 pb-1">
        {rows.map((row, i) => (
          <DataRow key={row.label} {...row} delay={0.2 + i * 0.065} />
        ))}

        {/* Inventory row */}
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + rows.length * 0.065, duration: 0.22 }}
          className="flex items-center pt-[5px]"
        >
          <span className="font-mono text-[9px] text-[#333] uppercase tracking-[0.14em] w-[86px] shrink-0">
            INVENTORY
          </span>
          <span className="font-mono text-[9px] text-[#FF0000] mx-1.5 shrink-0">▸</span>
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 h-1 bg-[#111] relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stockPct}%` }}
                transition={{ delay: 0.55, duration: 0.65, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0"
                style={{ background: stockColor }}
              />
            </div>
            <span
              className="font-mono text-[8.5px] uppercase tracking-widest whitespace-nowrap"
              style={{ color: stockColor }}
            >
              {stockLabel}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Description */}
      {description.trim() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + (rows.length + 1) * 0.065 + 0.15, duration: 0.4 }}
          className="border-t border-[#0f0f0f] px-3.5 py-2.5"
        >
          <p className="font-mono text-[8.5px] text-[#2c2c2c] uppercase tracking-[0.09em] leading-relaxed line-clamp-3">
            {description}
          </p>
        </motion.div>
      )}
    </div>
  );
}
