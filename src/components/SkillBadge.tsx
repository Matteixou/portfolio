"use client";

import { motion } from "framer-motion";

interface SkillBadgeProps {
  name: string;
  icon: string;
  level: number; // 1-5
  delay?: number;
}

export default function SkillBadge({ name, icon, level, delay = 0 }: SkillBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05 }}
      className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-800 border border-dark-600 hover:border-neon-purple/40 transition-all duration-300"
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-mono font-medium text-white">{name}</span>
      {/* Level dots */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              i < level
                ? "bg-neon-purple group-hover:bg-neon-green"
                : "bg-dark-500"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
