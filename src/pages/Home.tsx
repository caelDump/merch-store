import ProductList from "../components/ProductList";
import "../App.css";

const Home = () => {
  return (
    <main className="home">
      <section className="hero">
        <h2>✨ Fairy-Inspired Dresses & Tees ✨</h2>
        <p>Soft, dreamy, and magical pieces made for you 🌸</p>
      </section>
      <ProductList />
    </main>
  );
};

export default Home;
