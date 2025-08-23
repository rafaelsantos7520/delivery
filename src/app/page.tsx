import { ProductList } from "@/components/ProductList";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Nosso Cardápio</h1>
      <ProductList />
    </main>
  );
}