import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import img1 from "@assets/Captura_de_tela_2026-01-21_220951_1769044948210.png";
import img2 from "@assets/Captura_de_tela_2026-01-21_221058_1769044948210.png";
import img3 from "@assets/Captura_de_tela_2026-01-21_221104_1769044948210.png";
import img4 from "@assets/Captura_de_tela_2026-01-21_221121_1769044948210.png";
import img5 from "@assets/ChatGPT_Image_21_de_jan._de_2026,_22_39_08_1769045964191.png";
import img6 from "@assets/ChatGPT_Image_21_de_jan._de_2026,_22_36_15_1769045793557.png";
import img7 from "@assets/ChatGPT_Image_21_de_jan._de_2026,_22_46_17_1769046398313.png";

const photos = [
  { src: img1, alt: "Decoração de Festa" },
  { src: img2, alt: "Mesa de Evento com Flores" },
  { src: img3, alt: "Espaço Coberto Noturno" },
  { src: img4, alt: "Área de Balanço e Piscina" },
  { src: img5, alt: "Piscina e Deck" },
  { src: img6, alt: "Espaço Kids Real" },
  { src: img7, alt: "Área de Churrasco e Cozinha" },
];

export function PhotoGallery() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-primary mb-4">Galeria de Fotos</h2>
          <p className="text-muted-foreground">Momentos reais capturados no Espaço Castro.</p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative cursor-pointer group overflow-hidden rounded-2xl"
              onClick={() => setSelectedImg(photo.src)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                  Ver foto
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-6 right-6 text-white hover:text-secondary transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImg}
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
