import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="page">
      <h1>Panel de administración</h1>
      <p style={{ marginTop: 8, color: '#888' }}>
        Gestiona el catálogo y controla las ventas de tu tienda
      </p>

      {/* SECCIÓN PRINCIPAL: VENTAS */}
      <div style={{ marginTop: 24 }}>
        <Link href="/admin/orders" className="card-link" prefetch={false}>
          <div className="card-button" style={{ borderLeft: '4px solid #da1b1b', background: '#1a1a1a' }}>
            <h3>📦 Gestión de Órdenes</h3>
            <p>Revisa pagos, aprueba pedidos y gestiona envíos</p>
          </div>
        </Link>
      </div>

      {/* SECCIÓN SECUNDARIA: CATÁLOGO */}
      <h2 style={{ marginTop: 32, fontSize: '1.2rem' }}>Catálogo</h2>
      <div className="grid-3" style={{ marginTop: 16 }}>
        <Link href="/admin/categories" className="card-link" prefetch={false}>
          <div className="card-button">
            <h3>Categorías</h3>
            <p>Principales</p>
          </div>
        </Link>

        <Link href="/admin/subcategories" className="card-link" prefetch={false}>
          <div className="card-button">
            <h3>Subcategorías</h3>
            <p>Por categoría</p>
          </div>
        </Link>

        <Link href="/admin/products" className="card-link" prefetch={false}>
          <div className="card-button">
            <h3>Productos</h3>
            <p>Inventario completo</p>
          </div>
        </Link>
      </div>

      {/* RESUMEN */}
      <div style={{ marginTop: 40 }}>
        <h2>Resumen</h2>
        <div className="flex-row" style={{ marginTop: 16 }}>
          <div className="card-stat">Productos: --</div>
          <div className="card-stat">Categorías: --</div>
          <div style={statCard}>Subcategorías: --</div>
          <div className="card-stat" style={{ borderLeft: '2px solid #da1b1b' }}>Órdenes hoy: --</div>
        </div>
      </div>
    </div>
  );
}

const statCard = {
  background: "#1a1a1a",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #333"
};