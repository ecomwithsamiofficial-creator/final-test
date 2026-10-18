import { Metadata } from 'next';
import { TikTokSimulator } from '../components/TikTokSimulator';

export const metadata: Metadata = {
  title: 'Advertising on TikTok | TikTok Ads Manager',
  description: 'TikTok for Business Ads Manager Dashboard',
  robots: { index: false, follow: false },
};

export default function TikTokSimulatorPage() {
  return <TikTokSimulator />;
}
