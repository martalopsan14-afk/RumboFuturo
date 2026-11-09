import { Camera } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export interface TeamMember {
  id: string;
  name: string;
  photo?: string;
}

const LOCAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'laura-gallego',
    name: 'Laura Gallego',
    photo: '/assets/team/Laura%20Gallego.jpeg',
  },
  {
    id: 'adrian-marquez',
    name: 'Adrián Márquez',
    photo: '/assets/team/Adri%C3%A1n%20M%C3%A1rquez.jpeg',
  },
  {
    id: 'enrique-andres',
    name: 'Enrique Andrés Jiménez',
    photo: '/assets/team/Enrique%20Andr%C3%A9s%20Jim%C3%A9nez.jpeg',
  },
  {
    id: 'mariela-reyes',
    name: 'Mariela Reyes',
    photo: '/assets/team/Mariela%20Reyes.jpeg',
  },
  {
    id: 'laura-prado',
    name: 'Laura Prado',
    photo: '/assets/team/Laura%20Prado.jpeg',
  },
  {
    id: 'marta-lopez',
    name: 'Marta López',
    photo: '/assets/team/Marta%20L%C3%B3pez.jpeg',
  },
];

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-ivory shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 border-b border-dashed border-ink/20 bg-ivory-deep/70 text-graphite-soft">
        {member.photo ? (
          <img src={member.photo} alt={member.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <>
            <Camera aria-hidden="true" className="h-8 w-8" strokeWidth={1.5} />
            <span className="font-sans text-xs font-semibold uppercase tracking-wider">Fotografía pendiente</span>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="font-sans text-lg">{member.name}</h3>
      </div>
    </article>
  );
}

export function TeamGrid() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeader title="Nuestro equipo" />
      <div className="flex min-h-56 items-center justify-center rounded-[2rem] border border-dashed border-ivory/30 bg-ivory/5 px-6 text-center font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ivory/70">
        Fotografía conjunta del equipo pendiente de incorporar
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LOCAL_TEAM_MEMBERS.map((member) => (
          <li key={member.id}>
            <TeamMemberCard member={member} />
          </li>
        ))}
      </ul>
    </div>
  );
}
