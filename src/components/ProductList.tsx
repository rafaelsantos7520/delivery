import { Suspense } from "react";
import { ProductClient } from "./ProductClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts, getCategories } from "@/lib/data";
import { Product } from "@/types";

// Componente de Loading para ser usado com Suspense
const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Componente principal que busca os dados
async function ProductData() {
  // Chama as funções de busca de dados diretamente
  const productsData = await getProducts();
  const categoriesData = await getCategories();
  
  // O tipo retornado pelo cache do Prisma pode ser complexo.
  // Garantimos que ele seja compatível com o que o ProductClient espera.
  const products: Product[] = JSON.parse(JSON.stringify(productsData));
  const categories = JSON.parse(JSON.stringify(categoriesData));

  return <ProductClient initialProducts={products} categories={categories} />;
}

// Componente exportado que usa Suspense para o loading
export function ProductList() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProductData />
    </Suspense>
  );
}
