import Head from 'next/head';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Head>
        <title>M.A. Handyman Services — Kirkland, WA</title>
        <meta
          name="description"
          content="Friendly, dependable handyman service for Kirkland homeowners. Carpentry, painting, repairs, installs, and more."
        />
      </Head>
      <Layout>
        <Hero />
        <Services />
        <About />
        <Contact />
      </Layout>
    </>
  );
}
