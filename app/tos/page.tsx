import '../../app/global.css';
import type { Metadata } from 'next';
import { Overlay } from '@/components/overlay';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ClientShell } from '@/components/clientshell';
import { TOS } from '@/components/tos';

export const metadata: Metadata = {
  title: 'Terms of Service'
};

export default function TOSPage() {
  return (
    <ClientShell>
      <Overlay/>
      <Navbar links={[]}/>
      <TOS/>
      <Footer/>
    </ClientShell>
  );
}
