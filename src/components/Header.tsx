import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useCart } from '../context/CartContext';
import "../styles/Header.css";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
  
  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);
  
  return (
    <header className="header">
      <h1 className="logo">Fairy Couture ✨</h1>
      <nav>
        <button
          className="menu-btn"
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <ul className={`nav-links ${open ? 'show' : ''}`}>
          <li>
            <a href="/" onClick={closeMenu}>Home</a>
          </li>
          <li>
            <a href="/contact" onClick={closeMenu}>Contact</a>
          </li>
          <li style={{ position: 'relative' }}>
            <a href="/cart" onClick={closeMenu}>
              <ShoppingBag size={20} /> Cart
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#e63946',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '2px 7px',
                  minWidth: 22,
                  textAlign: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                  lineHeight: 1
                }}>{cartCount}</span>
              )}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;