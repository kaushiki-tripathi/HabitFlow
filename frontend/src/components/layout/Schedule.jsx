import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Sparkles } from 'lucide-react';

const scheduleData = [
  { time: '07:00 AM', task: 'Morning Meditation', duration: '15 min', category: 'Mindfulness' },
  { time: '09:00 AM', task: 'Deep Work Session', duration: '2 hours', category: 'Productivity' },
  { time: '12:30 PM', task: 'Nutritious Lunch', duration: '45 min', category: 'Health' },
  { time: '05:00 PM', task: 'Evening Run', duration: '30 min', category: 'Fitness' },
];

const Schedule = () => {
  return (
    <section id="scheduleview" className="relative overflow-hidden bg-[#2C261F] py-24 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="mb-4 block text-sm font-semibold uppercase tracking-[0.22em] text-[#d3b9a1]"
          >
            Daily Flow
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.08 }}
            className="max-w-2xl font-serif text-4xl leading-tight text-[#f8f4ee] sm:text-5xl lg:text-6xl"
          >
            Structure your day
            <span className="mt-2 block italic text-[#cdb7a4]">with intention.</span>
          </motion.h2>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-7">
            <div className="absolute bottom-0 left-[1.1rem] top-0 w-px bg-[#f2e9df]/12" />

            <div className="space-y-8">
              {scheduleData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -22 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative pl-12"
                >
                  <div className="absolute left-0 top-7 flex h-9 w-9 items-center justify-center rounded-full border border-[#f2e9df]/20 bg-[#1f1b18] shadow-[0_0_0_5px_rgba(31,27,24,0.9)] transition-colors duration-500 group-hover:border-[#d3b9a1]">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#d3b9a1] opacity-0 transition-all duration-500 group-hover:opacity-100" />
                  </div>

                  <div className="rounded-[28px] border border-[#f2e9df]/10 bg-[#f8f4ee]/95 p-5 text-[#2c261f] shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#d3b9a1]/60 hover:shadow-[0_28px_70px_rgba(0,0,0,0.18)] sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a685d]">
                          {item.time}
                        </span>
                        <h3 className="mt-2 text-xl font-semibold text-[#2a241f] sm:text-2xl">
                          {item.task}
                        </h3>
                        <p className="mt-2 text-sm text-[#6a5e55]">
                          {item.category} • {item.duration}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-full border border-[#e5d9cd] bg-[#f1e9e1] px-3 py-2 text-[#5d4d42]">
                        <CheckCircle2 className="h-4 w-4 text-[#7d685a]" strokeWidth={1.8} />
                        <span className="text-xs font-semibold uppercase tracking-[0.16em]">Planned</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-24"
          >
            <div className="relative overflow-hidden rounded-[32px] border border-[#e8ddd0] bg-[#f5f0ea] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.18)] sm:p-8">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#d9c3a8]/30 blur-3xl" />
              <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-[#c49d78]/15 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#efe3d4] text-[#6b564e]">
                  <Calendar className="h-7 w-7" strokeWidth={1.5} />
                </div>

                <h3 className="font-serif text-3xl text-[#2b241f] sm:text-4xl">
                  Smart Scheduling
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#62564f]">
                  HabitFlow learns your best energy windows and helps you place healthy routines where they naturally fit.
                </p>

                <div className="mt-8 space-y-4 rounded-[24px] border border-[#e7d9ca] bg-white/55 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7e6d62]">
                      Daily completion
                    </span>
                    <span className="font-serif text-2xl text-[#2b241f]">82%</span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#efe5db]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '82%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-[#8c7465]"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {['Best focus', 'Low friction', 'Energy-aware'].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 rounded-full border border-[#e7d9ca] bg-[#f7f2ee] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5d4f47]"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#7d685a]" strokeWidth={2} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;