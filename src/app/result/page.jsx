import { getProducts } from "@/lib/services/products";
import ResultContent from "./ResultContent";
import { Suspense } from "react";

export default async function Result() {
  const products = await getProducts({ limit: 20, offset: 0 });
  return (
    <Suspense>
      <ResultContent products={products} />
    </Suspense>
  );
}
