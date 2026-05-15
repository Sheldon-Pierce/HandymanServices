import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            Meet Michael
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Local. Reliable. Particular about good work.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-600 md:text-lg">
            Michael Aguilar has been doing home repair work in the Kirkland area for 8 years. He answers his own phone, shows up when he says he will, and treats every house like it&apos;s his own. Free quotes, no nonsense, and references on request.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
