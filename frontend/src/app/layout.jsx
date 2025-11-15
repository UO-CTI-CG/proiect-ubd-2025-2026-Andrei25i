import { Montserrat } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import NavBar from "./components/layout/NavBar";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'] 
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Toaster position="top-center" />

        <NavBar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
