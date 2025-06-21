import "../output.css";
import Head from "next/head";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>YouTube to MP3 Converter</title>
        <meta name="description" content="Convert YouTube videos to MP3 audio in seconds. Simple, clean, and fast." />
        <meta name="keywords" content="YouTube to MP3, MP3 downloader, audio extractor, RealRyan" />
        <meta name="author" content="RealRyan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="YouTube to MP3 Converter" />
        <meta property="og:description" content="Convert YouTube videos to MP3 with ease." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://youtube2-mp3-tool.vercel.app/" />
        <meta property="og:image" content="/cover.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="YouTube to MP3 Converter" />
        <meta name="twitter:description" content="Clean and fast tool to convert YouTube to MP3." />
        <meta name="twitter:image" content="/cover.png" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
