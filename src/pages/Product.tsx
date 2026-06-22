import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '@/components/seo/SEOHead';
import { useProduct, useCategoryProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/components/ui/Toast';
import { CyberpunkDataPanel } from '@/components/ui/CyberpunkDataPanel';
import type { Lang, ProductVariant } from '@/types';

export default function Product() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const { product, loading } = useProduct(slug);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const categorySlug = product?.category?.slug ?? '';
  const { products: related } = useCategoryProducts(categorySlug);
  const relatedFiltered = related.filter((p) => p.id !== product?.id).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-[#444] text-xs uppercase tracking-widest animate-pulse">
          {t('common.loading')}
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-[#444] text-xs uppercase tracking-widest">
          Product not found
        </span>
      </div>
    );
  }

  const name =
    (product[`name_${lang}` as keyof typeof product] as string) || product.name_en;
  const description =
    (product[`description_${lang}` as keyof typeof product] as string) ||
    product.description_en ||
    '';
  const categoryName = product.category
    ? ((product.category[`name_${lang}` as keyof typeof product.category] as string) ||
        product.category.name_en)
    : '';

  // Split variants into color and non-color (size / other)
  const colorVariants = product.variants?.filter((v) => v.color_hex) ?? [];
  const sizeVariants = product.variants?.filter((v) => !v.color_hex) ?? [];

  const effectiveVariant = selectedVariant ?? product.variants?.[0] ?? null;
  const price = product.base_price + (effectiveVariant?.price_modifier ?? 0);
  const stock = effectiveVariant?.stock ?? 999;

  const selectedColorName =
    (effectiveVariant?.[`name_${lang}` as keyof ProductVariant] as string) ||
    effectiveVariant?.name_en ||
    '';

  const handleAddToCart = () => {
    addItem(product, effectiveVariant ?? undefined, 1);
    toast.success(`${name} added to cart`);
  };

  return (
    <>
      <SEOHead
        title={`${name} — Northernwest`}
        description={description.slice(0, 160)}
        image={product.images[0]}
        productSchema={{ name, price, description, image: product.images[0] ?? '' }}
      />

      {/* ── Full-screen split — constrained to viewport so image is always visible ── */}
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-64px)]">

        {/* ══════════════════════════════════════
            LEFT — image panel
        ══════════════════════════════════════ */}
        <div
          className="grain-overlay relative flex items-center justify-center overflow-hidden
                     bg-[#080808] min-h-[55vw] lg:min-h-0 lg:flex-1"
        >
          {/* Subtle red grid */}
          <div className="absolute inset-0 red-grid-bg opacity-15 pointer-events-none" />

          {/* Radial spotlight */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div
              style={{
                width: 640,
                height: 640,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.02) 40%, transparent 68%)',
              }}
            />
          </div>

          {/* Mini breadcrumb — top of image panel */}
          <nav className="absolute top-0 left-0 right-0 flex items-center gap-3 px-8 py-5 z-10">
            <Link
              to="/"
              className="font-display font-black text-white text-xs tracking-widest hover:text-[#FF0000] transition-colors"
            >
              NW
            </Link>
            <span className="text-[#2a2a2a] text-xs">|</span>
            <Link
              to="/shop"
              className="font-mono text-[10px] text-[#555] uppercase tracking-widest hover:text-white transition-colors"
            >
              SHOP
            </Link>
            {categoryName && (
              <>
                <span className="text-[#2a2a2a] text-xs">|</span>
                <Link
                  to={`/category/${product.category?.slug ?? ''}`}
                  className="font-mono text-[10px] text-[#555] uppercase tracking-widest hover:text-white transition-colors"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <span className="text-[#2a2a2a] text-xs">|</span>
            <span className="font-mono text-[10px] text-[#333] uppercase tracking-widest truncate">
              {name}
            </span>
          </nav>

          {/* Vignette — fades white image edges into dark bg */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 42%, #080808 100%)',
            }}
          />

          {/* Product image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              src={product.images[activeImage] ?? ''}
              alt={name}
              className="relative z-10 max-w-[85%] max-h-[70vh] w-auto h-auto object-contain select-none"
              style={{ filter: 'drop-shadow(0 24px 60px rgba(0,0,0,0.9))' }}
            />
          </AnimatePresence>

          {!product.images[activeImage] && (
            <div className="relative z-10 font-display font-black text-[#181818] text-9xl select-none">
              NW
            </div>
          )}

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="absolute bottom-6 flex gap-2 z-30">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-11 h-11 border overflow-hidden transition-all ${
                    idx === activeImage
                      ? 'border-[#FF0000] opacity-100'
                      : 'border-[#1a1a1a] opacity-35 hover:opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
            RIGHT — product details
        ══════════════════════════════════════ */}
        <div
          className="grain-overlay relative flex flex-col w-full lg:w-[44%] lg:max-w-[600px]
                     border-t border-[#141414] lg:border-t-0 lg:border-l lg:border-[#141414]
                     bg-[#050505] overflow-y-auto"
        >
          {/* SALE badge — top-right absolute */}
          {product.is_featured && (
            <div className="absolute top-5 right-5 z-10">
              <span className="font-mono text-[9px] text-black bg-[#FF0000] px-2 py-1 rounded-[3px] uppercase tracking-widest font-bold">
                FEATURED
              </span>
            </div>
          )}

          {/* ── Top block: name + price + category ── */}
          <div className="px-8 pt-7 pb-5 border-b border-[#111]">

            {/* Product name */}
            <h1
              className="font-display font-black text-white uppercase leading-[0.9] mb-3"
              style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.4rem)' }}
            >
              {name}
            </h1>

            {/* Price row */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-white text-sm font-bold tracking-wide">
                ${price.toFixed(2)} USD
              </span>
            </div>

            {/* Collection / category sub-label */}
            {categoryName && (
              <span className="font-mono text-[10px] text-[#444] uppercase tracking-[0.2em]">
                {categoryName}
              </span>
            )}
          </div>

          {/* ── Middle block: variants ── */}
          <div className="px-8 py-4 border-b border-[#111] flex flex-col gap-3">

            {/* Color swatches */}
            {colorVariants.length > 0 && (
              <div className="flex items-center gap-4">
                {/* Selected color name */}
                <span className="font-mono text-[10px] text-[#888] uppercase tracking-[0.18em] w-16 shrink-0">
                  {colorVariants.find((v) => v.id === effectiveVariant?.id)
                    ? selectedColorName
                    : (colorVariants[0]?.[`name_${lang}` as keyof ProductVariant] as string) ||
                      colorVariants[0]?.name_en ||
                      'COLOR'}
                </span>
                <div className="flex items-center gap-2">
                  {colorVariants.map((v) => {
                    const isSelected = effectiveVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        disabled={v.stock === 0}
                        title={
                          (v[`name_${lang}` as keyof ProductVariant] as string) || v.name_en
                        }
                        className={`relative w-4 h-4 rounded-full transition-all duration-150 ${
                          v.stock === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        style={{ backgroundColor: v.color_hex || '#333' }}
                      >
                        {isSelected && (
                          <span
                            className="absolute inset-[-3px] rounded-full border border-white pointer-events-none"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size / non-color variants */}
            {sizeVariants.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-[#888] uppercase tracking-[0.18em] w-16 shrink-0">
                  SIZE:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {sizeVariants.map((v) => {
                    const vName =
                      (v[`name_${lang}` as keyof ProductVariant] as string) || v.name_en;
                    const isSelected = effectiveVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => !v.stock || setSelectedVariant(v)}
                        disabled={v.stock === 0}
                        className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border transition-all ${
                          isSelected
                            ? 'border-white text-white'
                            : v.stock === 0
                            ? 'border-[#1a1a1a] text-[#2a2a2a] line-through cursor-not-allowed'
                            : 'border-[#2a2a2a] text-[#666] hover:border-[#555] hover:text-white'
                        }`}
                      >
                        {vName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div>
              {stock === 0 ? (
                <span className="font-mono text-[10px] text-[#cc0000] uppercase tracking-widest">
                  ✕ OUT OF STOCK
                </span>
              ) : stock < 5 ? (
                <span className="font-mono text-[10px] text-yellow-600 uppercase tracking-widest">
                  ◎ ONLY {stock} LEFT
                </span>
              ) : (
                <span className="font-mono text-[10px] text-[#333] uppercase tracking-widest">
                  ● IN STOCK
                </span>
              )}
            </div>
          </div>

          {/* ── Bottom block: cyberpunk data + add to cart ── */}
          <div className="flex flex-col flex-1 px-8 py-5">

            {/* Cyberpunk HUD panel */}
            <div className="flex-1">
              <CyberpunkDataPanel
                key={slug}
                name={name}
                categoryName={categoryName}
                price={price}
                variants={product.variants ?? []}
                stock={stock}
                description={description}
                lang={lang}
              />
            </div>

            {/* Add to cart row */}
            <div className="flex items-end justify-between mt-6 pt-5 border-t border-[#111]">
              {/* Mobile: full-width button */}
              <button
                disabled={stock === 0}
                onClick={handleAddToCart}
                className={`lg:hidden w-full py-4 font-display font-bold uppercase tracking-widest text-sm transition-colors
                  ${stock === 0
                    ? 'bg-[#111] text-[#333] cursor-not-allowed'
                    : 'bg-[#FF0000] text-white hover:bg-white hover:text-[#FF0000]'
                  }`}
              >
                {stock === 0 ? t('product.outOfStock') : t('product.addToCart')}
              </button>

              {/* Desktop: label + circle */}
              <span className="hidden lg:block font-mono text-[10px] text-[#2a2a2a] uppercase tracking-widest">
                {stock === 0 ? t('product.outOfStock') : t('product.addToCart')}
              </span>

              <motion.button
                whileHover={stock === 0 ? {} : { scale: 1.08 }}
                whileTap={stock === 0 ? {} : { scale: 0.93 }}
                disabled={stock === 0}
                onClick={handleAddToCart}
                className={`hidden lg:flex w-[58px] h-[58px] rounded-full items-center justify-center transition-colors
                  ${stock === 0
                    ? 'bg-[#111] text-[#2a2a2a] cursor-not-allowed'
                    : 'bg-[#FF0000] text-white hover:bg-white hover:text-[#FF0000]'
                  }`}
              >
                <Plus size={22} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related products ── */}
      {relatedFiltered.length > 0 && (
        <div className="border-t border-[#111] px-8 lg:px-14 py-16">
          <h2 className="font-display font-black text-white uppercase tracking-widest text-2xl mb-10">
            {t('product.relatedProducts')}
          </h2>
          <ProductGrid products={relatedFiltered} />
        </div>
      )}
    </>
  );
}
