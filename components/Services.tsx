import { motion } from 'framer-motion';

const services = [
  { icon: '🔨', title: 'Carpentry',        body: 'Trim, doors, shelving, repairs to wood structures.' },
  { icon: '🎨', title: 'Painting',         body: 'Interior & exterior. Clean lines, careful prep.' },
  { icon: '🔧', title: 'Plumbing fixes',   body: 'Faucets, toilets, leaks, simple replacements.' },
  { icon: '💡', title: 'Electrical',       body: 'Fixture swaps, outlets, light installs.' },
  { icon: '📦', title: 'Assembly & mounts',body: 'Furniture, TVs, shelving, anything boxed.' },
  { icon: '🛠️', title: 'General repairs',  body: "If something's broken and you don't know who to call." },
];

export default function Services() {
  return (
    <section id="services" className="bg-sand">
      <div className="mx-auto max-w-container px-6 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            What I do
          </div>
          <h2 className="mt-2 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Repairs &amp; installs for the whole home
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl bg-white p-6 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream text-xl"
                aria-hidden
              >
                {s.icon}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
