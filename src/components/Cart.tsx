import "../styles/Cart.css";
import React, { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { Trash2 } from "../icons";
import { PaymentIcons, ShippingIcons } from "../icons";
import { useNavigate } from "react-router-dom";

type ShippingMethod = "standard" | "express" | "same_day";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [discountCode, setDiscountCode] = useState("");
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum: number, i: any) => sum + (i.price || 0) * (i.quantity || 1), 0),
    [items]
  );

  const shippingCost = useMemo(() => {
    switch (shippingMethod) {
      case "express":
        return subtotal > 3000 ? 0 : 199;
      case "same_day":
        return 299;
      default:

        return subtotal > 1500 ? 0 : 99;
    }
  }, [shippingMethod, subtotal]);

  const discount = useMemo(() => {
    // demo-only rule: "WELCOME10" -> 10% off
    if (discountCode.trim().toUpperCase() === "WELCOME10") {
      return Math.round(subtotal * 0.1);
    }
    return 0;
  }, [discountCode, subtotal]);

  const total = Math.max(0, subtotal + shippingCost - discount);

  return (
    <div className="cart">
      <header className="cart__header">
        <h2 className="cart__title">Your Cart 🛒</h2>
        <p className="cart__subtitle">Secure checkout • Major cards accepted • Nationwide shipping</p>
      </header>

      {items.length === 0 ? (
        <div className="cart-empty" role="status" aria-live="polite">
          <p>No items yet.</p>
          <a href="/" className="btn btn--ghost" aria-label="Continue shopping">
            Continue shopping
          </a>
        </div>
      ) : (
        <>
          <ul className="cart-list" aria-label="Cart items">
            {items.map((item: any) => (
              <li className="cart-item" key={item.id}>
                <div className="cart-item__left">
                  {item.image ? (
                    <img
                      className="cart-item__image"
                      src={item.image}
                      alt={item.title || "Product image"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="cart-item__placeholder" aria-hidden="true" />
                  )}
                  <div className="cart-item__meta">
                    <strong className="cart-item__title">{item.title}</strong>
                    <div className="cart-item__price">₱{Number(item.price || 0).toLocaleString()}</div>
                    <div className="cart-item__qty">Qty: {item.quantity || 1}</div>
                    {item.personalization && (
                      <div className="cart-item__note">
                        <em>Personalization:</em> {item.personalization}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="icon-btn icon-btn--danger"
                  aria-label={`Remove ${item.title || "item"} from cart`}
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>

          <section className="checkout">
            {/* Payment */}
            <div className="accordion">
              <button
                className="accordion__trigger"
                aria-expanded={showPayment}
                aria-controls="payment-panel"
                onClick={() => setShowPayment((v) => !v)}
              >
                <span className="accordion__title">Payment Options</span>
                <span className="accordion__icons">
                  {PaymentIcons.visa}
                  {PaymentIcons.mastercard}
                  {PaymentIcons.amex}
                  {PaymentIcons.paypal}
                  {PaymentIcons.gcash}
                </span>
              </button>
              <div
                id="payment-panel"
                role="region"
                aria-labelledby="Payment Options"
                className={`accordion__panel ${showPayment ? "is-open" : ""}`}
              >
                <div className="pill-row" aria-hidden={!showPayment}>
                  <span className="pill" title="Visa">{PaymentIcons.visa}</span>
                  <span className="pill" title="Mastercard">{PaymentIcons.mastercard}</span>
                  <span className="pill" title="American Express">{PaymentIcons.amex}</span>
                  <span className="pill" title="PayPal">{PaymentIcons.paypal}</span>
                  <span className="pill" title="GCash">{PaymentIcons.gcash}</span>
                </div>
                <p className="muted">Demo-only: no payment is processed.</p>
              </div>
            </div>

            {/* Shipping */}
            <div className="accordion">
              <button
                className="accordion__trigger"
                aria-expanded={showShipping}
                aria-controls="shipping-panel"
                onClick={() => setShowShipping((v) => !v)}
              >
                <span className="accordion__title">Shipping (PH nationwide)</span>
                <span className="accordion__icons">
                  {ShippingIcons.jnt}
                  {ShippingIcons.ninja}
                  {ShippingIcons.lalamove}
                  {ShippingIcons.fast}
                </span>
              </button>
              <div
                id="shipping-panel"
                role="region"
                aria-labelledby="Shipping"
                className={`accordion__panel ${showShipping ? "is-open" : ""}`}
              >
                <div className="pill-row" aria-hidden={!showShipping}>
                  <span className="pill" title="J&T">{ShippingIcons.jnt}</span>
                  <span className="pill" title="Ninja Van">{ShippingIcons.ninja}</span>
                  <span className="pill" title="Lalamove">{ShippingIcons.lalamove}</span>
                  <span className="pill" title="Fast courier">{ShippingIcons.fast}</span>
                </div>

                <div className="field">
                  <label htmlFor="ship-method" className="field__label">
                    Shipping method
                  </label>
                  <select
                    id="ship-method"
                    className="field__control"
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                  >
                    <option value="standard">Standard (3–5 days) — {subtotal > 1500 ? "FREE" : "₱99"}</option>
                    <option value="express">Express (1–2 days) — {subtotal > 3000 ? "FREE" : "₱199"}</option>
                    <option value="same_day">Same-Day (Metro Areas) — ₱299</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Discount */}
            <div className="field">
              <label htmlFor="discount" className="field__label">Discount code</label>
              <div className="field__inline">
                <input
                  id="discount"
                  className="field__control"
                  placeholder="Enter code (try WELCOME10)"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  inputMode="text"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="btn btn--ghost"
                  aria-label="Apply discount code"
                  onClick={() => {}}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="summary" aria-label="Order summary">
              <div className="summary__row">
                <span>Subtotal</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary__row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "FREE" : `₱${shippingCost.toLocaleString()}`}</span>
              </div>
              {discount > 0 && (
                <div className="summary__row summary__row--good">
                  <span>Discount</span>
                  <span>−₱{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="summary__total">
                <span>Total</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
            </div>

            {isCheckoutSuccess ? (
              <div className="success-message" role="alert">
                <h2>Order Placed Successfully! 🎉</h2>
                <p>Thank you for your purchase! We'll send you a confirmation email shortly.</p>
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <button
                  className="btn btn--primary checkout-btn"
                  disabled={items.length === 0}
                  aria-disabled={items.length === 0}
                  onClick={() => {
                    setIsCheckoutSuccess(true);
 
                    setTimeout(() => {
                      clearCart();
                    }, 2000);
                  }}
                >
                  Proceed to Checkout
                </button>
                <p className="muted">By continuing you agree to our Terms & Privacy. Demo only — no backend.</p>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Cart;
