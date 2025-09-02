import products from "../data/product";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import "../styles/ProductList.css";

const ProductList = () => {
  return (
    <div className="product-list">
      {products.map((product: Product, i: number) => (
        <ProductCard key={product.id ?? i} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
