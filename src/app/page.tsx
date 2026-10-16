import { Capabilities } from '@/components/home/Capabilities';
import { HomeHero } from '@/components/home/HomeHero';
import { Pipeline } from '@/components/home/Pipeline';
import { Radar } from '@/components/home/Radar';
import { TechTape } from '@/components/home/TechTape';
import { ContactCta } from '@/components/sections/ContactCta';
import { KpiBand } from '@/components/sections/KpiBand';
import { TeamPreview } from '@/components/sections/TeamPreview';
import { WorkRail } from '@/components/sections/WorkRail';
import { OnThisPage } from '@/components/shell/OnThisPage';
import { metrics } from '@/content/metrics';
import { notes } from '@/content/notes';
import { process } from '@/content/process';
import { projects } from '@/content/projects';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { stack } from '@/content/stack';
import { team } from '@/content/team';
import { getDevFeed } from '@/lib/feed';

export default async function Home() {
  const featured = projects.filter((p) => p.featured);
  const feed = await getDevFeed();
  return (
    <>
      <HomeHero tagline={site.tagline} description={site.description} />
      <TechTape items={stack} />
      <Capabilities services={services} />
      <WorkRail projects={featured} />
      <Pipeline stages={process} />
      <KpiBand metrics={metrics} />
      <Radar notes={notes} feed={feed} />
      <TeamPreview team={team} />
      <ContactCta />
      <OnThisPage />
    </>
  );
}
