// app/page.js

import Hero from "@/components/Hero";
import News from "@/components/News";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div>
      <Hero />
      <News />
      <FAQ />
    </div>
  );
}