export default function Header() {
  return (
    <header className="header">
      <div className="logo">Mis Bellas</div>

      <div className="search">
        <input placeholder="Buscar" />
        <button>🔍</button>
      </div>

      <div className="actions">
        <span>♡</span>
        <span>🛒</span>
      </div>
    </header>
  );
}