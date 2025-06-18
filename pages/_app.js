import '../output.css'
import Head from 'next/head';

<Head>
  <title>YouTube to MP3</title>
  <meta name="description" content="Convert any YouTube video to MP3 in seconds" />
  <meta property="og:title" content="YouTube to MP3 Converter" />
  <meta property="og:description" content="Fast, clean, and simple YouTube to MP3 tool" />
  <meta property="og:type" content="website" />
</Head>

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
