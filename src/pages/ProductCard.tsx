import "../styles/ProductCard.css";

type ProductProps = {
  name: string;
  price: number;
  image: string;
};

const ProductCard = ({ name, price, image }: ProductProps) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>₱{price}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
