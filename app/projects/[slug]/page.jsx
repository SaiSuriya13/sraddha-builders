import { notFound } from "next/navigation";
import { projects, ongoingProject } from "@/data/projects";
import { ProjectDetailContent } from "@/components/ProjectDetailContent";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...projects, ongoingProject].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = [...projects, ongoingProject].find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.name}`,
    description: `${project.name} — ${project.nature} with ${project.units} flats in ${project.locality}, ${project.city}. A listed project of Sraddha Builders.`,
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = [...projects, ongoingProject].find((p) => p.slug === slug);
  if (!project) notFound();
  const isOngoing = ongoingProject.slug === slug;
  return <ProjectDetailContent project={project} isOngoing={isOngoing} />;
}