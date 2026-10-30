"use client";

import { useState, useCallback } from "react";
import { ProjectFinder } from "@/components/ProjectFinder";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ComparisonTray } from "@/components/ComparisonTray";
import { ComparisonModal } from "@/components/ComparisonModal";
import { projects } from "@/data/projects";

// Owns the interactive state for the Projects page: the Smart Project Finder
// filters, the archive grid (search + region + unit range), and the visitor
// comparison session. Comparison lives only in React state — never persisted.
export function ProjectsExplorer({ initialRegion = "All" }) {
  const [region, setRegion] = useState(initialRegion);
  const [unitBand, setUnitBand] = useState("any");
  const [compare, setCompare] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const compareProjects = compare
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean);

  const toggleCompare = useCallback((slug) => {
    setCompare((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div className={compare.length > 0 ? "pb-28" : ""}>
      <div className="mt-14 lg:mt-20">
        <ProjectFinder
          region={region}
          onRegionChange={setRegion}
          unitBand={unitBand}
          onUnitBandChange={setUnitBand}
          compareSet={compare}
          onToggleCompare={toggleCompare}
        />
      </div>

      <div className="mt-16 lg:mt-20">
        <ProjectGrid
          region={region}
          onRegionChange={setRegion}
          unitBand={unitBand}
          onUnitBandChange={setUnitBand}
          compareSet={compare}
          onToggleCompare={toggleCompare}
        />
      </div>

      <ComparisonTray
        projects={compareProjects}
        onRemove={toggleCompare}
        onClear={clearCompare}
        onOpen={openModal}
      />
      <ComparisonModal
        open={modalOpen}
        projects={compareProjects}
        onClose={closeModal}
      />
    </div>
  );
}