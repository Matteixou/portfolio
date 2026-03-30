"use client";

import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  link?: string;
  accent?: "purple" | "green";
}

const styles = {
  purple: {
    hoverBorder: "group-hover:border-neon-purple/50",
    glowLine: "via-neon-purple",
    tagBg: "bg-neon-purple/10",
    tagText: "text-neon-purple-light",
    tagBorder: "border-neon-purple/20",
    linkText: "text-neon-purple-light",
    blobBg: "bg-neon-purple/5",
    blobHover: "group-hover:bg-neon-purple/10",
  },
  green: {
    hoverBorder: "group-hover:border-neon-green/50",
    glowLine: "via-neon-green",
    tagBg: "bg-neon-green/10",
    tagText: "text-neon-green",
    tagBorder: "border-neon-green/20",
    linkText: "text-neon-green",
    blobBg: "bg-neon-green/5",
    blobHover: "group-hover:bg-neon-green/10",
  },
};

export default function ProjectCard({
  title,
  description,
  tags,
  icon,
  link,
  accent = "purple",
}: ProjectCardProps) {
  const s = styles[accent];
  const glowClass = accent === "purple" ? "glow-purple" : "glow-green";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group relative"
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-dark-800 border border-dark-600 p-6 h-full transition-all duration-300 ${s.hoverBorder}`}
        style={undefined}
        onMouseEnter={(e) => {
          e.currentTarget.classList.add(glowClass);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.classList.remove(glowClass);
        }}
      >
        {/* Top glow line */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${s.glowLine} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-white font-mono">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs font-mono px-2.5 py-1 rounded-full ${s.tagBg} ${s.tagText} border ${s.tagBorder}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${s.linkText} hover:text-white transition-colors duration-200`}
          >
            <span>Voir le projet</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        )}

        {/* Background decoration */}
        <div
          className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${s.blobBg} blur-2xl ${s.blobHover} transition-all duration-500`}
        />
      </div>
    </motion.div>
  );
}
