"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import StatusBar from "@/components/StatusBar";
import SkillBadge from "@/components/SkillBadge";

/* ───────────────── Données ───────────────── */

const PROJECTS = [
  {
    title: "E-commerce Ronron",
    description:
      "Site e-commerce complet avec système de panier, gestion produits et paiement. Développé lors de mon stage chez Ronron - imprint.",
    tags: ["HTML/CSS", "Node.js", "JavaScript", "E-commerce"],
    icon: "🛒",
    accent: "purple" as const,
  },
  {
    title: "Interface Créateurs",
    description:
      "Dashboard UX/UI orienté créateurs de contenu. Interface intuitive pour gérer streams, analytics et communauté.",
    tags: ["React", "Tailwind CSS", "UX/UI", "Figma"],
    icon: "🎨",
    accent: "green" as const,
  },
  {
    title: "Portfolio v2.0",
    description:
      "Ce portfolio — conçu avec Next.js, Tailwind et Framer Motion. Thème dark mode avec esthétique streaming/terminal.",
    tags: ["Next.js", "TypeScript", "Framer Motion", "Tailwind"],
    icon: "🚀",
    link: "https://github.com/Matteixou",
    accent: "purple" as const,
  },
];

const SKILLS = [
  { name: "JavaScript", icon: "⚡", level: 4 },
  { name: "TypeScript", icon: "🔷", level: 3 },
  { name: "Python", icon: "🐍", level: 3 },
  { name: "React/Next.js", icon: "⚛️", level: 4 },
  { name: "Node.js", icon: "🟢", level: 3 },
  { name: "HTML/CSS", icon: "🎨", level: 5 },
  { name: "MySQL", icon: "🗄️", level: 3 },
  { name: "PostgreSQL", icon: "🐘", level: 3 },
  { name: "Docker", icon: "🐳", level: 2 },
  { name: "Git", icon: "📦", level: 4 },
  { name: "Figma", icon: "🖌️", level: 3 },
  { name: "Tailwind", icon: "💨", level: 4 },
];

const AI_SKILLS = [
  { name: "Claude Code", icon: "🤖", level: 4 },
  { name: "ChatGPT", icon: "💬", level: 4 },
  { name: "Gemini", icon: "✨", level: 3 },
  { name: "GitHub Copilot", icon: "🧑‍✈️", level: 3 },
  { name: "Midjourney", icon: "🎆", level: 3 },
  { name: "Perplexity", icon: "🔍", level: 3 },
];

const SOCIALS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/matthieuferacho/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/matthieu.frch/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "Twitch",
    href: "https://www.twitch.tv/mathsuo",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/Matteixou",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
];

const TIMELINE = [
  {
    period: "2024 — Présent",
    title: "Bachelor Développement Web — EFREI Paris",
    description:
      "Formation en développement web full-stack, architecture logicielle et gestion de projet agile.",
    type: "education" as const,
  },
  {
    period: "2024",
    title: "Stage — Ronron - imprint",
    description:
      "Développement d'un site e-commerce complet (HTML/CSS/Node.js). Intégration front-end, logique panier et déploiement.",
    type: "work" as const,
  },
  {
    period: "2022 — 2024",
    title: "Leroy Merlin — Logistique & Analyse",
    description:
      "Gestion logistique et analyse de données. Développement d'outils internes pour l'optimisation des processus.",
    type: "work" as const,
  },
];

/* ───────────────── Typing Effect ───────────────── */

function useTypingEffect(texts: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayed(current.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
          if (charIndex + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), pause);
          }
        } else {
          setDisplayed(current.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
          if (charIndex - 1 === 0) {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, pause]);

  return displayed;
}

/* ───────────────── Nav ───────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-900/90 backdrop-blur-lg border-b border-dark-600"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a
          href="#hero"
          className="text-lg font-mono font-bold text-white flex items-center gap-2"
        >
          <span className="text-neon-purple">&lt;</span>
          Matteixou
          <span className="text-neon-purple">/&gt;</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Parcours", href: "#parcours" },
            { label: "Projets", href: "#projets" },
            { label: "Skills", href: "#skills" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-mono text-gray-400 hover:text-neon-purple-light transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="https://github.com/Matteixou"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-mono px-4 py-2 rounded-lg border border-neon-purple/30 text-neon-purple-light hover:bg-neon-purple/10 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </a>
      </div>
    </motion.nav>
  );
}

/* ───────────────── Sections ───────────────── */

function SectionTitle({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <span className="text-xs font-mono text-neon-purple-light tracking-widest uppercase">
        {tag}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 mt-3 max-w-xl">{subtitle}</p>
      )}
    </motion.div>
  );
}

/* ───────────────── Page Principale ───────────────── */

export default function HomePage() {
  const typedText = useTypingEffect([
    "Développeur Web",
    "Content Creator",
    "Streamer Twitch",
    "Musicien",
  ]);

  return (
    <main className="grid-bg min-h-screen">
      <Navbar />

      {/* ════════ HERO ════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      >
        {/* Background blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-green/8 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-800 border border-dark-600 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-neon-green pulse-live" />
            <span className="text-xs font-mono text-gray-400">
              Disponible pour opportunités
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight"
          >
            Matthieu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-green">
              Feracho
            </span>
          </motion.h1>

          {/* Typing subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-xl md:text-2xl font-mono text-gray-400"
          >
            <span className="text-neon-purple">const</span>{" "}
            <span className="text-neon-green">role</span>{" "}
            <span className="text-white">=</span>{" "}
            <span className="text-yellow-300">&quot;{typedText}&quot;</span>
            <span className="text-white cursor-blink">|</span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Étudiant en Bachelor à l&apos;EFREI Paris, passionné par le
            développement web, le streaming sur Twitch et la musique. Je
            construis des expériences digitales où le code rencontre la
            créativité.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#projets"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-purple-light text-white font-semibold hover:opacity-90 transition-opacity glow-purple"
            >
              Voir mes projets
            </a>
            <a
              href="#contact"
              className="px-8 py-3 rounded-lg border border-dark-500 text-gray-300 font-semibold hover:border-neon-green/50 hover:text-neon-green transition-all duration-300"
            >
              Me contacter
            </a>
          </motion.div>

          {/* Status bar widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-16"
          >
            <StatusBar />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-dark-500 flex justify-center pt-2"
          >
            <div className="w-1 h-2.5 rounded-full bg-neon-purple" />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════ PARCOURS ════════ */}
      <section id="parcours" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionTitle
            tag="// parcours"
            title="Expériences & Formation"
            subtitle="Mon chemin entre le code, le commerce et la création de contenu."
          />

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-green to-transparent" />

            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative pl-12 md:pl-20"
                >
                  {/* Dot */}
                  <div
                    className={`absolute left-2.5 md:left-6.5 top-1.5 w-3 h-3 rounded-full border-2 ${
                      item.type === "work"
                        ? "border-neon-green bg-neon-green/20"
                        : "border-neon-purple bg-neon-purple/20"
                    }`}
                  />

                  <span
                    className={`text-xs font-mono ${
                      item.type === "work"
                        ? "text-neon-green"
                        : "text-neon-purple-light"
                    }`}
                  >
                    {item.period}
                  </span>
                  <h3 className="text-lg font-semibold text-white mt-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PROJETS ════════ */}
      <section id="projets" className="py-24 px-6 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            tag="// projets"
            title="Ce que j'ai construit"
            subtitle="Des projets concrets qui mêlent technique et créativité."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SKILLS ════════ */}
      <section id="skills" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionTitle
            tag="// skills"
            title="Technologies & Outils"
            subtitle="Ma stack technique, en constante évolution."
          />

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {SKILLS.map((skill, i) => (
              <SkillBadge
                key={skill.name}
                {...skill}
                delay={i * 0.05}
              />
            ))}
          </div>

          {/* IA & Outils */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-green/30" />
              <span className="text-sm font-mono text-neon-green whitespace-nowrap">
                // intelligence artificielle
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-green/30" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {AI_SKILLS.map((skill, i) => (
                <SkillBadge
                  key={skill.name}
                  {...skill}
                  delay={i * 0.05}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ CONTACT ════════ */}
      <section id="contact" className="py-24 px-6 bg-dark-800/30">
        <div className="max-w-2xl mx-auto text-center">
          <SectionTitle
            tag="// contact"
            title="Travaillons ensemble"
            subtitle="Un projet en tete ? Une opportunite ? N'hesitez pas a me contacter."
          />

          {/* CTA mail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="mailto:matthieu.feracho@efrei.net"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-purple-light text-white font-semibold hover:opacity-90 transition-opacity glow-purple"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Envoyer un mail
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="group/social flex items-center justify-center w-12 h-12 rounded-xl bg-dark-800 border border-dark-600 text-gray-400 hover:text-white hover:border-neon-purple/50 hover:bg-neon-purple/10 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </motion.div>

          {/* Terminal-style email */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 inline-block"
          >
            <div className="bg-dark-800 border border-dark-600 rounded-lg px-6 py-3 font-mono text-sm">
              <span className="text-neon-green">$</span>{" "}
              <span className="text-gray-400">mail -s &quot;Hello&quot;</span>{" "}
              <span className="text-neon-purple-light">
                matthieu.feracho@efrei.net
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="py-8 px-6 border-t border-dark-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-mono text-gray-400">
            <span className="text-neon-purple">&lt;</span>
            Matteixou
            <span className="text-neon-purple">/&gt;</span>{" "}
            &copy; {new Date().getFullYear()}
          </span>
          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-gray-500 hover:text-neon-purple-light transition-colors duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-mono">
            Built with Next.js, Tailwind CSS & Framer Motion
          </span>
        </div>
      </footer>
    </main>
  );
}
