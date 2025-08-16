import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description: 'Create your own quizzes with different question types',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-3xl font-bold"
                style={{
                  background: "linear-gradient(90deg, rgb(158, 40, 40) 30%, rgb(6, 9, 65) 80%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                >
                  Quiz Builder
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/create"
                  className="text-md font-bold text-black hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-800 hover:to-blue-900 transition-colors duration-300"
                  >
                  Create
                </Link>
                <Link 
                  href="/quizzes"
                  className="text-green-900 hover:text-green-500 px-3 py-2 rounded-md text-md font-medium"
                >
                  Quizzes
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}