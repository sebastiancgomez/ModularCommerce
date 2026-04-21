import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="page">
      <h1>Panel de administración</h1>

      <p style={{ marginTop: 8 }}>
        Gestiona el catálogo y controla la información de tu tienda
      </p>

      {/* ACCESOS */}
      <div className="grid-3">
        <Link href="/admin/categories">
          <div style={cardStyle}>
            <h3>Categorías</h3>
            <p>Gestiona las categorías principales</p>
          </div>
        </Link>

        <Link href="/admin/subcategories">
          <div style={cardStyle}>
            <h3>Subcategorías</h3>
            <p>Organiza productos por categoría</p>
          </div>
        </Link>

        <Link href="/admin/products">
          <div style={cardStyle}>
            <h3>Productos</h3>
            <p>Administra el catálogo completo</p>
          </div>
        </Link>
      </div>

      {/* RESUMEN */}
      <div style={{ marginTop: 32 }}>
        <h2>Resumen</h2>

        <div className="flex-row">
          <div style={statCard}>Productos: --</div>
          <div style={statCard}>Categorías: --</div>
          <div style={statCard}>Subcategorías: --</div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#111",
  border: "1px solid #333",
  borderRadius: 10,
  padding: 16,
  cursor: "pointer"
};

const statCard = {
  background: "#1a1a1a",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #333"
};