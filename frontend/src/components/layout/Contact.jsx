import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, ArrowUpRight, Send, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../../context/ToastContext";

const easeLuxury = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeLuxury },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
};

const wordAnim = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeLuxury },
  },
};

function AnimatedWords({ text }) {
  const words = text.split(" ");
  return (
    <motion.span
      className="inline-flex flex-wrap gap-x-[0.3em] gap-y-1"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.7 }}
      transition={{ staggerChildren: 0.08, delayChildren: 0.08 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordAnim}
          className="inline-block will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "kaushikitripathi07@gmail.com",
    href: "mailto:kaushikitripathi07@gmail.com",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Noida, Uttar Pradesh",
    href: null,
  },
];

export default function Contact() {
  const { openLogin } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setStatus("submitting");

    try {
      const accessKey =
        import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
        "58a36438-1f45-4c71-882f-2f6770c68803";

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          subject: `HabitFlow Message from ${form.name.trim()}`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        toast.success("Message sent successfully!");
      } else {
        toast.error(result.message || "Failed to send message. Please try again.");
        setStatus("idle");
      }
    } catch (err) {
      console.error("Contact Form Submission Error:", err);
      toast.error("Network error. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-[#f7e8c5] px-4 py-24 sm:px-8 lg:py-32"
    >
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-[#E2D6C8]/50 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#D4BCA6]/25 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8A7B6C]"
          >
            Get in touch
          </motion.p>

          <h2 className="font-serif text-4xl tracking-tight text-[#2C261F] sm:text-5xl lg:text-6xl">
            <AnimatedWords text="Start a conversation" />
          </h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[#6F655C] sm:text-base"
          >
            Feedback, ideas, or a simple hello — drop a note.<br /> HabitFlow is built with care & your words help shape what comes next.
          </motion.p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left — details */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="flex flex-col gap-6 lg:col-span-4"
          >
            {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="rounded-[28px] border border-[#E8DFD6] bg-[#FFFCFA] p-6 shadow-[0_16px_40px_rgba(44,38,31,0.04)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1EAE2] text-[#8C7465]">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9A8776]">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="mt-2 inline-flex items-center gap-1.5 text-base font-medium text-[#2C261F] transition-colors hover:text-[#8C7465]"
                  >
                    {value}
                    <ArrowUpRight size={15} strokeWidth={1.75} />
                  </a>
                ) : (
                  <p className="mt-2 text-base font-medium text-[#2C261F]">
                    {value}
                  </p>
                )}
              </motion.div>
            ))}

            {/* Mini CTA card */}
            <motion.div
              variants={fadeUp}
              className="rounded-[28px] border border-[#E8DFD6] bg-[#2C261F] p-6 text-[#F7F4EF]"
            >
              <p className="font-serif text-xl tracking-tight">
                Prefer to start tracking?
              </p>
              <p className="mt-2 text-sm text-[#C4B2A0]">
                No worries! Login to your account and start tracking your habits.
              </p>
              <button
                type="button"
                onClick={openLogin}
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#F7F4EF] px-5 py-2.5 text-sm font-semibold text-[#2C261F] transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                Open App
                <ArrowUpRight size={15} />
              </button>
            </motion.div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="rounded-[32px] border border-[#E8DFD6] bg-[#FFFCFA] p-6 shadow-[0_20px_50px_rgba(44,38,31,0.06)] sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, ease: easeLuxury }}
                    className="flex min-h-[340px] flex-col items-center justify-center text-center"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFE8E0] text-[#8C7465]">
                      <Check size={26} strokeWidth={2} />
                    </div>
                    <h3 className="font-serif text-3xl tracking-tight text-[#2C261F]">
                      Message received
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6F655C]">
                      Thank you for writing in. We&apos;ll get back to you as soon as
                      we can — quietly and carefully.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-8 rounded-full border border-[#E0D5CA] bg-white px-5 py-2.5 text-sm font-semibold text-[#2C261F] transition hover:bg-[#F7F4EF] active:scale-95 cursor-pointer"
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: easeLuxury }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <label className="block text-left">
                        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A8776]">
                          Name
                        </span>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="w-full rounded-2xl border border-[#E8DFD6] bg-[#FBF8F5] px-4 py-3.5 text-sm text-[#2C261F] outline-none transition placeholder:text-[#B5A698] focus:border-[#C4B2A0] focus:bg-white focus:ring-4 focus:ring-[#E8DFD6]/80"
                        />
                      </label>

                      <label className="block text-left">
                        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A8776]">
                          Email
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="your_name@gmail.com"
                          className="w-full rounded-2xl border border-[#E8DFD6] bg-[#FBF8F5] px-4 py-3.5 text-sm text-[#2C261F] outline-none transition placeholder:text-[#B5A698] focus:border-[#C4B2A0] focus:bg-white focus:ring-4 focus:ring-[#E8DFD6]/80"
                        />
                      </label>
                    </div>

                    <label className="block text-left">
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A8776]">
                        Message
                      </span>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Tell us what’s on your mind…"
                        className="w-full resize-y rounded-2xl border border-[#E8DFD6] bg-[#FBF8F5] px-4 py-3.5 text-sm text-[#2C261F] outline-none transition placeholder:text-[#B5A698] focus:border-[#C4B2A0] focus:bg-white focus:ring-4 focus:ring-[#E8DFD6]/80"
                      />
                    </label>

                    <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                      <p className="text-xs leading-relaxed text-[#9A8776]">
                        Give us your feedback!! We will look and respond to your message as soon as possible.
                      </p>

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="inline-flex items-center gap-2 rounded-full bg-[#2C261F] px-6 py-3.5 text-sm font-semibold text-[#F7F4EF] transition-transform duration-300 hover:scale-[1.03] active:scale-95 disabled:cursor-wait disabled:opacity-70 cursor-pointer"
                      >
                        {status === "submitting" ? (
                          "Sending…"
                        ) : (
                          <>
                            Send message
                            <Send size={15} strokeWidth={2} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}