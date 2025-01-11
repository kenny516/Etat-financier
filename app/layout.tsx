import { Sidebar } from '@/components/sidebar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Analyse Financière',
    description: 'Application d\'analyse financière professionnelle',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <div className="flex h-screen">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}