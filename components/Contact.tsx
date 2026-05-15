import { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from 'react-social-icons';

type InquiryForm = {
  name: string;
  number: string;
  email: string;
  address: string;
  serviceInfo: string;
  phone: boolean;
  emailCheck: boolean;
  text: boolean;
};

const initialForm: InquiryForm = {
  name: '',
  number: '',
  email: '',
  address: '',
  serviceInfo: '',
  phone: false,
  emailCheck: false,
  text: false,
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputCls =
  'w-full rounded-md border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-cream placeholder:text-stone-500 focus:border-amber-400 focus:outline-none';

export default function Contact() {
  const [form, setForm] = useState<InquiryForm>(initialForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const next = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: next }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.phone && !form.emailCheck && !form.text) {
      setErrorMessage('Please select at least one preferred contact method.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setErrorMessage('');
    try {
      const res = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('send failed');
      setStatus('success');
      setForm(initialForm);
    } catch {
      setErrorMessage('Something went wrong sending the message. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="bg-ink text-cream">
      <div className="mx-auto grid max-w-container gap-12 px-6 py-20 md:grid-cols-[1fr_1.1fr] md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
            Get a quote
          </div>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Let&apos;s talk about your project.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-stone-300">
            Tell me a bit about what you need. I&apos;ll usually reply within a day.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-stone-300">
            <li>
              <span aria-hidden>📞 </span>(425) 555-0123
            </li>
            <li>
              <span aria-hidden>✉ </span>contact@mahandyman.com
            </li>
            <li>
              <span aria-hidden>📍 </span>Kirkland, WA &amp; nearby
            </li>
          </ul>
          <div className="mt-4">
            <SocialIcon
              url="https://facebook.com/Handyman.Aguilar"
              target="_blank"
              bgColor="#c2410c"
              fgColor="#fdf8ef"
              style={{ height: 36, width: 36 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl bg-stone-900 p-6"
        >
          {status === 'success' ? (
            <div className="py-10 text-center">
              <h3 className="font-display text-2xl text-cream">Thanks — your message is in.</h3>
              <p className="mt-2 text-sm text-stone-300">I&apos;ll be in touch soon.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-sm font-semibold text-amber-400 underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3" noValidate>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Name"
                  className={inputCls}
                />
                <input
                  name="number"
                  value={form.number}
                  onChange={onChange}
                  placeholder="Phone"
                  className={inputCls}
                />
              </div>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email"
                className={inputCls}
              />
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Address"
                className={inputCls}
              />
              <textarea
                required
                name="serviceInfo"
                value={form.serviceInfo}
                onChange={onChange}
                placeholder="Tell me about the project…"
                rows={4}
                className={inputCls}
              />
              <fieldset className="text-xs text-stone-300">
                <legend className="mb-2 uppercase tracking-wider">Preferred contact</legend>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="phone" checked={form.phone} onChange={onChange} />
                    Phone
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="emailCheck"
                      checked={form.emailCheck}
                      onChange={onChange}
                    />
                    Email
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="text" checked={form.text} onChange={onChange} />
                    Text
                  </label>
                </div>
              </fieldset>
              {status === 'error' && errorMessage && (
                <div className="rounded-md border border-rust/40 bg-rust/10 px-3 py-2 text-xs text-rust">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full rounded-lg bg-rust py-3 text-sm font-semibold text-white transition-colors hover:bg-rust/90 disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
