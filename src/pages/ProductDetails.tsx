import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import products from "../data/product";
import { useCart } from '../context/CartContext';
import '../styles/ProductDetails.css';

const colorOptions = [
  { name: 'Pink', color: '#f8afa6' },
  { name: 'Peach', color: '#f4978e' },
  { name: 'Rose', color: '#f08080' },
  { name: 'Crimson', color: '#e63946' },
  { name: 'White', color: '#fff' },
  { name: 'Black', color: '#222' },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState('');
  const [embroidery, setEmbroidery] = useState(false);
  const [embroideryText, setEmbroideryText] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftWrapStyle, setGiftWrapStyle] = useState('Classic');
  const [messageCard, setMessageCard] = useState(false);
  const [messageText, setMessageText] = useState('');
  const sizeOptions = ['S', 'M', 'L', 'XL'];
  const [size, setSize] = useState('M');

  if (!product) {
    return (
      <div className="product-details">
        <div className="not-found">Product not found.</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    let custom = [];
    if (color) custom.push(`Color: ${color}`);
    if (embroidery && embroideryText) custom.push(`Embroidery: ${embroideryText}`);
    if (giftWrap) custom.push(`Gift wrap: ${giftWrapStyle}`);
    if (messageCard && messageText) custom.push(`Message card: ${messageText}`);
    addToCart(product, qty, custom.length ? custom.join(', ') : undefined);
    setQty(1);
    setColor('');
    setEmbroidery(false);
    setEmbroideryText('');
    setGiftWrap(false);
    setGiftWrapStyle('Classic');
    setMessageCard(false);
    setMessageText('');
  };

  return (
    <div className="product-details">
      <div className="product-details-header">
        <button 
          onClick={() => navigate('/')} 
          className="back-button"
          aria-label="Go back to home"
        >
          &larr; Back
        </button>
        <div className="product-id">Product ID: {product.id}</div>
      </div>

      <div className="product-grid">
        {/* Product Image */}
        <div className="image-container">
          <div className="image-wrapper">
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          
          <div className="price-info">
            <div className="product-description">{product.description}</div>
            <div className="price-shipping">
              <div className="product-price">₱{product.price.toLocaleString()}</div>
              <div className="shipping-info">Ships in 2-3 days</div>
            </div>
          </div>

          <div className="product-details-row">
            <div className="detail-item">
              Material: <span className="detail-value">Cotton blend</span>
            </div>
            <div className="detail-item">
              Care: <span className="detail-value">Hand wash</span>
            </div>
          </div>

          {/* Size Selection */}
          <div className="size-selector">
            <div className="size-label">Select size</div>
            <div className="size-options">
              {sizeOptions.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`size-option ${size === s ? 'selected' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color and Quantity Selection */}
          <div className="color-selection">
            <div className="color-selector">
              <div className="color-label">Choose color</div>
              <div className="color-options">
                {colorOptions.map(opt => (
                  <button
                    key={opt.name}
                    type="button"
                    aria-label={opt.name}
                    onClick={() => setColor(opt.name)}
                    className={`color-option ${color === opt.name ? 'selected' : ''}`}
                    style={{ backgroundColor: opt.color }}
                  />
                ))}
              </div>
              {color && (
                <div className="color-selected">{color} selected</div>
              )}
            </div>

            <div className="quantity-cart">
              <div className="quantity-selector">
                <label htmlFor="qty" className="quantity-label">Qty</label>
                <input 
                  id="qty" 
                  type="number" 
                  min={1} 
                  value={qty} 
                  onChange={e => setQty(Math.max(1, Number(e.target.value)))} 
                  className="quantity-input"
                />
              </div>

              <button 
                onClick={handleAddToCart} 
                className="add-to-cart-btn"
                aria-label={`Add ${product.title} to cart`}
              >
                Add to cart
              </button>
            </div>
          </div>

          {/* Customization Options */}
          <div className="customization-section">
            <div className="customization-title">Other customization options</div>
            <div className="customization-options">
              
              {/* Embroidery Option */}
              <label className="customization-option">
                <input 
                  type="checkbox" 
                  checked={embroidery} 
                  onChange={e => setEmbroidery(e.target.checked)} 
                  className="customization-checkbox"
                />
                <div className="customization-content">
                  <div className="customization-name">Personalized embroidery</div>
                  <div className="customization-description">Add a name or short text (max 20 chars)</div>
                  {embroidery && (
                    <input 
                      value={embroideryText} 
                      onChange={e => setEmbroideryText(e.target.value)} 
                      placeholder="Text for embroidery" 
                      maxLength={20} 
                      className="customization-input"
                    />
                  )}
                </div>
              </label>

              {/* Gift Wrap Option */}
              <label className="customization-option">
                <input 
                  type="checkbox" 
                  checked={giftWrap} 
                  onChange={e => setGiftWrap(e.target.checked)} 
                  className="customization-checkbox"
                />
                <div className="customization-content">
                  <div className="customization-name">Gift wrap</div>
                  <div className="customization-description">Choose a wrapping style</div>
                  {giftWrap && (
                    <select 
                      value={giftWrapStyle} 
                      onChange={e => setGiftWrapStyle(e.target.value)} 
                      className="customization-select"
                    >
                      <option>Classic</option>
                      <option>Festive</option>
                      <option>Minimalist</option>
                      <option>Eco-friendly</option>
                      <option>Luxury</option>
                    </select>
                  )}
                </div>
              </label>

              {/* Message Card Option */}
              <label className="customization-option">
                <input 
                  type="checkbox" 
                  checked={messageCard} 
                  onChange={e => setMessageCard(e.target.checked)} 
                  className="customization-checkbox"
                />
                <div className="customization-content">
                  <div className="customization-name">Message card</div>
                  <div className="customization-description">Write a short message to include</div>
                  {messageCard && (
                    <textarea 
                      value={messageText} 
                      onChange={e => setMessageText(e.target.value)} 
                      placeholder="Message to include" 
                      className="customization-textarea"
                    />
                  )}
                </div>
              </label>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;