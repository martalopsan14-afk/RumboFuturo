import { PageHeader } from '@/components/ui/PageHeader';
import { EventsGrid } from '@/components/saber-mas/EventsGrid';
import { UpcomingMeetings } from '@/components/saber-mas/UpcomingMeetings';

export function SaberMasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rumbo Futuro"
        title="Saber Más"
        description="Charlas, encuentros y actividades para conocer a profesionales del sector y ampliar tu mirada sobre la comunicación."
      />
      <EventsGrid />
      <UpcomingMeetings />
    </>
  );
}
