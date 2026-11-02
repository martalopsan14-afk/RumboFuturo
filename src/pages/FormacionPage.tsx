import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { ModalityContent } from '@/components/formacion/ModalityContent';
import { SubscriptionContent } from '@/components/formacion/SubscriptionContent';
import { IN_PERSON_MODALITY, ONLINE_MODALITY } from '@/data/courses';

export function FormacionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rumbo Futuro"
        title="Formación Dual"
        description="Dos modalidades formativas, online y presencial, y un modelo de suscripción que se anunciará próximamente."
      />
      <Section id="modalidad-online">
        <ModalityContent data={ONLINE_MODALITY} />
      </Section>
      <Section id="modalidad-presencial" tone="deep">
        <ModalityContent data={IN_PERSON_MODALITY} />
      </Section>
      <Section id="suscripciones">
        <SubscriptionContent />
      </Section>
    </>
  );
}
