"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { projects, pastProjectCount } from "@/data/projects";

export function ProjectsPreview() {
  const featured = projects.slice(0, 3);
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto max-w-8xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Project Catalogue</p>
              <h2 className="mt-6 font-serif text-4xl font-medium leading-tight tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
                A documented portfolio.
              </h2>
            </div>
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-[13px] uppercase tracking-[0.2em] text-brand-gold"
            >
              View all {pastProjectCount} projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.08}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}