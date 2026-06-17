import { Smartphone, ShoppingBag, Home, ShieldAlert, Glasses, Hand, Footprints } from "lucide-react";

export const categories = [
  { name: "Electronics", Icon: Smartphone },
  { name: "Clothes", Icon: ShoppingBag },  
  { name: "Miscellaneous", Icon: Glasses },
  { name: "Shoes", Icon: Footprints },
];

export const testimonials = [
  {
    text: " RevoShop has the best selection and fastest delivery. Great prices and authentic products from trusted sellers. My go-to marketplace!",
    name: "Budi Santoso",
    company: "Jakarta, Indonesia",
    initials: "BS",
  },
  {
    text: " Love shopping here! Wide variety of products, reliable sellers, and excellent customer service. Always on time with delivery. Highly recommended!",
    name: "Sarah Wijaya",
    company: "Bandung, Indonesia",
    initials: "SW",
  },
  {
    text: " The variety is amazing and prices are competitive. Fast response from sellers and smooth checkout process. This is my favorite marketplace!",
    name: "Ahmad Fauzi",
    company: "Surabaya, Indonesia",
    initials: "AF",
  },
];

export const faqs: Record<string, { q: string; a: string }[]> = {
  Ordering: [
    {
      q: "How do I place an order?",
      a: "Browse products, add to cart, and proceed to checkout. You'll need to be logged in. New users can register with email and password.",
    },
    {
      q: "Can I purchase as a guest?",
      a: "No, you need to create an account to checkout. Registration is quick and free!",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept bank transfer, credit/debit cards, e-wallets, and COD for eligible areas.",
    },
  ],
  Payment: [
    {
      q: "Is it safe to pay online on RevoShop?",
      a: "Yes. All transactions are secured with SSL encryption via PCI-DSS compliant payment partners.",
    },
    {
      q: "Can I change my payment method after ordering?",
      a: "Yes, you can modify payment details if your order hasn't been processed yet. Contact support quickly.",
    },
  ],
  Delivery: [
    {
      q: "How fast is shipping?",
      a: "Orders are processed same day. Jabodetabek: 1-2 business days. Other areas: 2-7 business days.",
    },
    {
      q: "Do you ship nationally?",
      a: "Yes, we ship to all areas across Indonesia using various courier services.",
    },
    {
      q: "Is free shipping available?",
      a: "Free shipping applies to orders above Rp 100,000 for standard delivery.",
    },
  ],
  Returns: [
    {
      q: "What is your return policy?",
      a: "Products can be returned within 30 days if unused and in original packaging. Damaged items accepted up to 90 days.",
    },
    {
      q: "How do I initiate a return?",
      a: "Contact our support with your order number and photos. Returns are processed within 5-7 business days.",
    },
  ],
  Products: [
    {
      q: "Are all products authentic?",
      a: "Yes, we verify all sellers and authenticate products. Our strict quality control ensures genuine items only.",
    },
    {
      q: "How do I know product quality?",
      a: "Check product ratings, customer reviews, and seller ratings. Our quality guarantee backs every purchase.",
    },
  ],
};
