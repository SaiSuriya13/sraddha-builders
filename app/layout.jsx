import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata = {
  title: {
    default: "Sraddha Builders | Building with Trust Since 1999",
    template: "%s | Sraddha Builders",
  },
  description:
    "Sraddha Builders is a Bangalore-based partnership firm operating since 1999, with 29 past project records and an ongoing apartment project in Chittoor. Explore our portfolio and get in touch.",
  keywords: [
    "Sraddha Builders",
    "builder Bangalore",
    "apartments Bangalore",
    "real estate Bangalore",
    "Sri Sai Sradddha Chittoor",
    "construction company Bangalore",
  ],
  openGraph: {
    title: "Sraddha Builders | Building with Trust Since 1999",
    description:
      "A Bangalore partnership firm operating since 1999 — 29 past project records and an ongoing apartment project.",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Returning visitors in the same session get the intro hidden before
            the body paints, so there is never a flash of the welcome screen. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('sb_intro_v2')==='1'){document.documentElement.classList.add('sb-intro-seen')}}catch(e){}",
          }}
        />
      </head>
      <body className="bg-brand-bg font-sans text-brand-ink">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}