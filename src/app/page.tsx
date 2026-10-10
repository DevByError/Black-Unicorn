import { ContactCta } from '@/components/sections/ContactCta';
import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { IntentChips } from '@/components/sections/IntentChips';
import { KpiBand } from '@/components/sections/KpiBand';
import { NotesFeed } from '@/components/sections/NotesFeed';
import { ProcessTabs } from '@/components/sections/ProcessTabs';
import { Spotlight } from '@/components/sections/Spotlight';
import { StackDirectory } from '@/components/sections/StackDirectory';
import { TeamPreview } from '@/components/sections/TeamPreview';
import { WorkRail } from '@/components/sections/WorkRail';
import { OnThisPage } from '@/components/shell/OnThisPage';
import { metrics } from '@/content/metrics';
import { notes } from '@/content/notes';
import { process } from '@/content/process';
import { projects } from '@/content/projects';
import { stack } from '@/content/stack';
import { team } from '@/content/team';
import { site } from '@/content/site';

export default function Home() {
  const slides = projects.filter((p) => p.heroOrder).sort((a, b) => (a.heroOrder ?? 0) - (b.heroOrder ?? 0)).slice(0, 5);
  const featured = projects.filter((p) => p.featured);
  const spotlight = featured[0] ?? projects[0];
  return (
    <>
      <h1 className="visually-hidden">{site.name}: {site.tagline}</h1>
      <HeroCarousel slides={slides} />
      <IntentChips />
      <WorkRail projects={featured} />
      {spotlight && <Spotlight project={spotlight} />}
      <KpiBand metrics={metrics} />
      <ProcessTabs stages={process} />
      <NotesFeed notes={notes} />
      <StackDirectory items={stack} />
      <TeamPreview team={team} />
      <ContactCta />
      <OnThisPage />
    </>
  );
}
