import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex, FaShippingFast, FaTruck } from 'react-icons/fa';
import { SiZcash, SiJet } from 'react-icons/si';
import { Trash2, Menu, ShoppingBag } from 'lucide-react';

export const PaymentIcons = {
  visa: <FaCcVisa />,
  mastercard: <FaCcMastercard />,
  paypal: <FaCcPaypal />,
  amex: <FaCcAmex />,
  gcash: <SiZcash />,
};

export const ShippingIcons = {
  jnt: <SiJet />,
  ninja: <FaTruck />,
  lalamove: <FaTruck />,
  fast: <FaShippingFast />,
};

export { Trash2, Menu, ShoppingBag };
