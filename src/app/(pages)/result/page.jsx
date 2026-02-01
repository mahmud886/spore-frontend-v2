import { getProducts } from "@/app/lib/services/products";
import { Suspense } from "react";
import ResultContent from "./ResultContent";

export const revalidate = 3600;

export default async function Result() {
  const products = await getProducts({ limit: 20, offset: 0 });
  return (
    <Suspense>
      <ResultContent products={products} />
    </Suspense>
  );
}
