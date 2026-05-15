import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="top" className="bg-cream">
      <div className="mx-auto grid max-w-container items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            Serving Kirkland, WA
          </div>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink md:text-6xl">
            Your neighbor for honest home repairs.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
            Carpentry, painting, repairs, installs — done well, done on time, by one person who cares about the work.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-lg bg-rust px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rust/90"
            >
              Request a quote
            </a>
            <a
              href="#services"
              className="rounded-lg border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              See services
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-xl"
        >
          <Image
            src="/main.jpeg"
            alt="Handyman at work"
            width={720}
            height={720}
            priority
            className="h-auto w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
