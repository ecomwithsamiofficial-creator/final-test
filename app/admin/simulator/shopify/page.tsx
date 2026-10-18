import { Metadata } from 'next';
import { ShopifySimulator } from '../components/ShopifySimulator';

export const metadata: Metadata = {
  title: 'Analytics • Shopify Admin',
  description: 'Shopify Store Analytics Dashboard',
  robots: { index: false, follow: false },
};

export default function ShopifySimulatorPage() {
  return <ShopifySimulator />;
}
