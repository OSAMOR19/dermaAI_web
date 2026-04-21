import Image from 'next/image';

const images = [
  { src: '/face.jpg', alt: 'Clinical Result 1' },
  { src: '/beauty-products.png', alt: 'Luxury Product' },
  { src: '/face1.jpg', alt: 'Clinical Result 2' },
  { src: '/skincare-routine.png', alt: 'Skincare Routine' },
  { src: '/professional-treatment.png', alt: 'Professional Treatment' },
  { src: '/hero-image.png', alt: 'Skin Excellence' },
];

export default function LandingImageGallery() {
  return (
    <section style={{ padding: '80px 0', background: '#faf8f7' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(227,27,93,0.08)', color: '#e31b5d',
            borderRadius: 50, padding: '6px 16px', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20,
          }}>Visual Excellence</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 60px)', fontFamily: 'Georgia,serif', fontWeight: 700, color: '#2d1a12', marginBottom: 16 }}>
            Clinical art & <span style={{ color: '#e31b5d', fontStyle: 'italic' }}>results</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(45,26,18,0.6)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7, fontWeight: 500 }}>
            A glimpse into our world of professional skincare, from clinical treatments to luxury wholesale products.
          </p>
        </div>

        <div style={{ columns: '3 280px', gap: 24 }}>
          {images.map((img, i) => (
            <div key={i} style={{
              breakInside: 'avoid', marginBottom: 24,
              borderRadius: 28, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid #fff',
              position: 'relative',
            }}>
              <div style={{ position: 'relative', aspectRatio: i % 2 === 0 ? '4/5' : '4/3' }}>
                <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover', transition: 'transform 0.8s' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(45,26,18,0.75), transparent)',
                  opacity: 0, transition: 'opacity 0.4s',
                }} className="gallery-overlay" />
                <div style={{
                  position: 'absolute', bottom: 24, left: 24,
                  opacity: 0, transition: 'opacity 0.4s',
                }} className="gallery-caption">
                  <p style={{ color: '#e31b5d', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>WBH Clinical</p>
                  <h4 style={{ color: '#fff', fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 18 }}>{img.alt}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .gallery-overlay:hover, div:hover > .gallery-overlay { opacity: 1; }
        div:hover .gallery-caption { opacity: 1; }
      `}</style>
    </section>
  );
}
