import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import Script from "next/script";
import Footer from "@/components/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EdgeCareer - Your AI-Powered Career Assistant",
  description:
    "Your AI-powered assistant for job search, resume optimization, mock interviews, and career growth.",
    icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning className="dark">
        <head>
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js" strategy="beforeInteractive"/>
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js" strategy="beforeInteractive"/>
          <link rel="icon" href="/skill.png" sizes="any" />
          {/* SEO Meta Tags */}
          <meta name="description" content={metadata.description} />
          <meta
            name="keywords"
            content="AI career assistant, job search, resume optimization, mock interviews, industry insights, career growth, AI interview prep, job application tools"
          />
          <meta name="author" content="EdgeCareer" />
          <meta name="robots" content="index, follow" />

          {/* Open Graph Meta Tags */}
          <meta property="og:title" content={metadata.title} />
          <meta property="og:description" content={metadata.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://edgecareer.com" />
          <meta property="og:image" content="https://edgecareer.com/og-image.png" />

          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metadata.title} />
          <meta name="twitter:description" content={metadata.description} />
          <meta name="twitter:image" content="https://edgecareer.com/og-image.png" />
        </head>
        <body className={`${inter.className}`} >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="bg-muted/50 py-10">
              <div className="container mx-auto px-4 text-center text-gray-200">
            <Footer/>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
