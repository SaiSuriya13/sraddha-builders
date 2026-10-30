"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Phone, Mail, ChevronDown } from "lucide-react";
import { company, telHref } from "@/data/company";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/ongoing", label: "Ongoing" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

const discover = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/explore", label: "Location Atlas" },
  { href: "/recommend", label: "Find Your Fit" },
  { href: "/experience", label: "Experience" },
];

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The admin area has its own chrome; never render the public site header
  // there (defence in depth alongside the server-side layout).
  if (pathname?.startsWith("/admin")) return null;

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "border-b border-brand-line bg-brand-bg/95 backdrop-blur"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
          aria-hidden="true"
        />
        <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
          <Link
            href="/"
            className="group flex items-baseline gap-2"
            aria-label="Sraddha Builders home"
          >
            <span className="font-serif text-xl font-semibold tracking-tight text-brand-ink transition-colors duration-300 group-hover:text-brand-gold lg:text-2xl">
              SRADDHA
            </span>
            <span className="hidden text-[10px] font-light uppercase tracking-[0.35em] text-brand-secondary sm:inline">
              Builders
            </span>
          </Link>

          <nav
            className="hidden items-center gap-6 lg:flex xl:gap-8"
            aria-label="Primary"
          >
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative text-[12px] uppercase tracking-[0.17em] transition-colors duration-300 ${
                    active
                      ? "text-brand-gold"
                      : "text-brand-ink/70 hover:text-brand-ink"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-brand-gold/40 transition-transform duration-300 ${
                      active ? "scale-x-0" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    aria-hidden="true"
                  />
                  {active ? (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-brand-gold"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                      aria-hidden="true"
                    />
                  ) : null}
                </Link>
              );
            })}
            <div className="group relative">
              <button
                type="button"
                className="relative flex items-center gap-1 text-[12px] uppercase tracking-[0.17em] text-brand-ink/70 transition-colors duration-300 hover:text-brand-ink"
                aria-haspopup="true"
              >
                Discover
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="min-w-[13rem] border border-brand-line bg-brand-surface p-2 shadow-lift">
                  {discover.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2.5 text-[11px] uppercase tracking-[0.16em] transition-colors hover:bg-brand-card ${
                        isActive(pathname, link.href)
                          ? "text-brand-gold"
                          : "text-brand-ink/75 hover:text-brand-ink"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/contact" className="btn-primary !px-5 !py-3 text-[11px]">
              Get In Touch
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 text-brand-ink lg:hidden"
          >
            <span
              className={`h-px w-6 bg-current transition-all duration-300 ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-current transition-all duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.25 }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-brand-bg lg:hidden"
          >
            <nav
              className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24"
              aria-label="Mobile"
            >
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce ? 0 : 0.05 * i + 0.08,
                    duration: 0.35,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={
                      isActive(pathname, link.href) ? "page" : undefined
                    }
                    className={`font-serif text-4xl font-medium tracking-tight ${
                      isActive(pathname, link.href)
                        ? "text-brand-gold"
                        : "text-brand-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduce ? 0 : 0.42, duration: 0.35 }}
                className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 border-t border-brand-line pt-6"
              >
                {discover.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-center text-[11px] uppercase tracking-[0.22em] text-brand-secondary transition-colors hover:text-brand-gold"
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.5, duration: 0.35 }}
                className="mt-8 flex flex-col items-center gap-4"
              >
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="btn-primary"
                >
                  Get In Touch
                </Link>
                <div className="flex items-center gap-6 text-brand-ink/60">
                  <a
                    href={telHref(company.phones[0])}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </a>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
