import React, { useState } from 'react';
import type { Product } from '../types';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

interface ColorOption {
  name: string;
  value: string;
  displayColor: string;
}

const colorOptions: ColorOption[] = [
  { name: 'Peach', value: 'peach', displayColor: '#f4978e' },
  { name: 'Rose', value: 'rose', displayColor: '#f08080' },
  { name: 'Crimson', value: 'crimson', displayColor: '#e63946' },
  { name: 'White', value: 'white', displayColor: '#ffffff' },
  { name: 'Black', value: 'black', displayColor: '#2d2d2d' },
];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(99, Number(e.target.value) || 1));
    setQuantity(value);
  };

  const handleColorSelect = (colorValue: string) => {
    setSelectedColor(prevColor => prevColor === colorValue ? '' : colorValue);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    try {
      const customization = selectedColor 
        ? `Color: ${colorOptions.find(c => c.value === selectedColor)?.name}` 
        : undefined;
      
      await addToCart(product, quantity, customization);
      
      // Reset form state after successful add
      setQuantity(1);
      setSelectedColor('');
      
      setTimeout(() => setIsAddingToCart(false), 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const selectedColorName = colorOptions.find(c => c.value === selectedColor)?.name;

  return (
    <article className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`} className="product-image-link">
          <img 
            src={product.image} 
            alt={product.title}
            className="product-image"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="product-content">
        <div className="product-header">
          <Link to={`/product/${product.id}`} className="product-title-link">
            <h3 className="product-title">{product.title}</h3>
          </Link>
          <p className="product-description">{product.description}</p>
        </div>

        <div className="product-price">
          ₱{product.price.toLocaleString()}
        </div>

        <div className="product-options">
          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label htmlFor={`qty-${product.id}`} className="quantity-label">
              Quantity
            </label>
            <div className="quantity-input-container">
              <button
                type="button"
                className="quantity-btn quantity-btn-minus"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                id={`qty-${product.id}`}
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
                aria-label={`Quantity: ${quantity}`}
              />
              <button
                type="button"
                className="quantity-btn quantity-btn-plus"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                disabled={quantity >= 99}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Color Customization */}
          <div className="color-customization">
            <div className="color-label">
              Customize Color
              {selectedColorName && (
                <span className="selected-color-text">
                  : {selectedColorName}
                </span>
              )}
            </div>
            <div className="color-options" role="group" aria-label="Color options">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`color-option ${selectedColor === option.value ? 'color-option-selected' : ''}`}
                  onClick={() => handleColorSelect(option.value)}
                  style={{ 
                    '--color': option.displayColor,
                    '--border-color': option.value === 'white' ? '#d1d5db' : 'transparent'
                  } as React.CSSProperties}
                  aria-label={`Select ${option.name} color`}
                  title={option.name}
                />
              ))}
            </div>
            <p className="customization-hint">
              <Link to={`/product/${product.id}`} className="customization-link">
                View product for more customization options
              </Link>
            </p>
          </div>
        </div>

        <div className="product-actions">
          <button
            type="button"
            className={`btn btn-primary add-to-cart-btn ${isAddingToCart ? 'btn-loading' : ''}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            aria-label={`Add ${product.title} to cart`}
          >
            {isAddingToCart ? (
              <>
                <span className="loading-spinner" aria-hidden="true"></span>
                Adding...
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
          
          <Link
            to={`/product/${product.id}`}
            className="btn btn-secondary view-btn"
            aria-label={`View details for ${product.title}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;