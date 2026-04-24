'use client';

export default function ProductSkeleton() {
  return (
    <div className="page grid-2 animate-pulse" style={{ marginTop: '20px' }}>
      {/* Espacio para la imagen */}
      <div className="card" style={{ 
        height: '450px', 
        background: 'var(--border)', 
        borderRadius: 'var(--radius)' 
      }}></div>

      {/* Espacio para la información */}
      <div className="flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ height: '40px', background: 'var(--border)', width: '70%', borderRadius: '4px' }}></div>
        <div style={{ height: '20px', background: 'var(--border)', width: '30%', borderRadius: '4px' }}></div>
        
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ height: '15px', background: 'var(--border)', width: '100%', borderRadius: '4px' }}></div>
          <div style={{ height: '15px', background: 'var(--border)', width: '100%', borderRadius: '4px' }}></div>
          <div style={{ height: '15px', background: 'var(--border)', width: '80%', borderRadius: '4px' }}></div>
        </div>

        <div className="flex-row" style={{ marginTop: 'auto', gap: '15px' }}>
          <div style={{ flex: 1, height: '45px', background: 'var(--border)', borderRadius: 'var(--radius)' }}></div>
          <div style={{ flex: 1, height: '45px', background: 'var(--border)', borderRadius: 'var(--radius)' }}></div>
        </div>
      </div>
    </div>
  );
}