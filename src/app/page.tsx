import QrCodeGenerator from '@/components/qr-code-generator';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background py-8">
      <QrCodeGenerator />
    </main>
  );
}
