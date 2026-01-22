import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Marketing } from "@/components/sections/marketing";
import { PhotoGallery } from "@/components/sections/photo-gallery";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <PhotoGallery />
        <Marketing />
      </main>
      <Footer />
    </div>
  );
}
