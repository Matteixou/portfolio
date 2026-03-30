"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_ITEMS = [
  { label: "Portfolio v2.0", status: "LIVE", progress: 100, color: "green" as const },
  { label: "E-commerce Ronron", status: "SHIPPED", progress: 100, color: "purple" as const },
  { label: "API REST Projet", status: "IN DEV", progress: 68, color: "purple" as const },
  { label: "Stream Setup", status: "ONLINE", progress: 100, color: "green" as const },
];

export default function StatusBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerCount, setViewerCount] = useState(142);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STATUS_ITEMS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = STATUS_ITEMS[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-dark-800 border border-dark-600 rounded-lg overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-dark-700 border-b border-dark-600">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-gray-400 ml-2">
              ~/matteixou/status-monitor
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green pulse-live" />
            <span className="text-xs font-mono text-neon-green">
              {viewerCount} viewers
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Status line */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      current.color === "green"
                        ? "bg-neon-green/15 text-neon-green"
                        : "bg-neon-purple/15 text-neon-purple-light"
                    }`}
                  >
                    {current.status}
                  </span>
                  <span className="text-sm font-mono text-white">
                    {current.label}
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  {current.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    current.color === "green"
                      ? "bg-gradient-to-r from-neon-green-dark to-neon-green"
                      : "bg-gradient-to-r from-neon-purple to-neon-purple-light"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${current.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator */}
          <div className="flex justify-center gap-1.5 mt-3">
            {STATUS_ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-neon-purple w-4"
                    : "bg-dark-500 hover:bg-dark-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
