import { SectionTitle } from "@/app/components/shared/SectionTitle";
import { Wrapper } from "@/app/components/shared/Wrapper";
import ShopClient from "@/app/components/shop/ShopClient";
import { getProducts } from "@/app/lib/services/products";

export const metadata = {
  title: "Shop | SPORE",
  description: "Browse our complete collection of field equipment and apparel.",
};

export default async function ShopPage() {
  const products = await getProducts({ limit: 100, offset: 0 });

  return (
    <main className="min-h-screen pt-32 pb-20 ">
      <Wrapper>
        <div className="mb-12">
          <SectionTitle>Field Equipment</SectionTitle>
          <p className="text-white/40 mt-4 max-w-2xl text-sm sm:text-base font-mono">
            COMPLETE INVENTORY LOG
            <br />
            Select equipment for deployment. All items are field-tested and durable.
          </p>
        </div>

        <ShopClient initialProducts={products} />
      </Wrapper>
    </main>
  );
}
