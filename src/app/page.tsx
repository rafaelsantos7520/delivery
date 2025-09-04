import { ProductList } from "@/components/ProductList";
import { HomeClient } from "./HomeClient";

// page.tsx agora é um Server Component por padrão (sem 'use client')
export default function Home() {
  return (
    <HomeClient>
      {/* ProductList é um Server Component que busca dados. 
          Ele é passado como "children" para o HomeClient. */}
      <ProductList />
    </HomeClient>
  );
}