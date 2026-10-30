import { Hero } from "@/components/Hero";
import { StatsSection } from "@/components/StatsSection";
import { CompanyIntro } from "@/components/CompanyIntro";
import { LegacySection } from "@/components/LegacySection";
import { ProjectsPreview } from "@/components/ProjectsPreview";
import { ExploreLocations, buildLocationGroups } from "@/components/ExploreLocations";
import { OngoingHighlight } from "@/components/OngoingHighlight";
import { CustomerCare } from "@/components/CustomerCare";
import { PlatformIndex } from "@/components/PlatformIndex";
import { IntroOverlay } from "@/components/IntroOverlay";
import { EnquiryCta } from "@/components/EnquiryCta";
import { projects } from "@/data/projects";

export default function HomePage() {
  const groups = buildLocationGroups(projects);
  return (
    <>
      <IntroOverlay />
      <Hero />
      <StatsSection />
      <CompanyIntro />
      <LegacySection />
      <ProjectsPreview />
      <PlatformIndex />
      <ExploreLocations groups={groups} />
      <OngoingHighlight />
      <CustomerCare />
      <EnquiryCta />
    </>
  );
}
