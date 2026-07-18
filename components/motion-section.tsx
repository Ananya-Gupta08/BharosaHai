"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function MotionSection({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.32, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
