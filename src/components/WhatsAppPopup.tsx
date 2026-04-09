import { motion } from 'motion/react';
import { Phone } from 'lucide-react';

export function WhatsAppPopup() {
  const phoneNumber = '917888380934';
  const message = 'Hello PBS Real Estate, I am interested in your properties.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-20 right-6 sm:bottom-6 sm:right-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110"
    >
      <Phone className="h-5 w-5" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold">1</span>
    </motion.a>
  );
}
