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
    name: 'Laura Gallego Rodríguez',
    photo: '/Laura%20Gallego.jpeg',
  },
  {
    id: 'adrian-marquez',
    name: 'Adrián Márquez Domínguez',
    photo: '/Adri%C3%A1n%20M%C3%A1rquez.jpeg',
  },
  {
    id: 'enrique-andres',
    name: 'Enrique Andrés Jiménez García',
    photo: '/Enrique%20Andr%C3%A9s%20Jim%C3%A9nez.jpeg',
  },
  {
    id: 'marta-lopez',
    name: 'Marta López Sanromán',
    photo: '/Marta%20L%C3%B3pez.jpeg',
  },
  {
    id: 'laura-prado',
    name: 'Laura Prado Álvarez',
    photo: '/Laura%20Prado.jpeg',
  },
  {
    id: 'mariela-reyes',
    name: 'Mariela Reyes Chaves',
    photo: '/Mariela%20Reyes.jpeg',
  },
];

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <li
      key={member.id}
      className="overflow-hidden rounded-2xl border border-ivory/20 bg-ivory/5"
    >
      <div className="aspect-[4/5] overflow-hidden bg-ivory/10">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Camera className="h-10 w-10 text-ivory/40" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-ink">
          {member.name}
        </h4>
      </div>
    </li>
  );
}

export function TeamGrid() {
  const coordinator = LOCAL_TEAM_MEMBERS.find(
    (member) => member.id === 'enrique-andres',
  )!;

  const creative = LOCAL_TEAM_MEMBERS.find(
    (member) => member.id === 'laura-prado',
  )!;

  const technical = LOCAL_TEAM_MEMBERS.filter((member) =>
    ['marta-lopez', 'laura-gallego'].includes(member.id),
  );

  const management = LOCAL_TEAM_MEMBERS.filter((member) =>
    ['adrian-marquez', 'mariela-reyes'].includes(member.id),
  );

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader title="Nuestro equipo" />

      {/* Coordinación y equipo creativo */}
      <div className="grid gap-8 sm:grid-cols-2">
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-ink">
            Coordinador
          </h3>

          <ul className="grid gap-6">
            <TeamMemberCard member={coordinator} />
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-ink">
            Equipo creativo
          </h3>

          <ul className="grid gap-6">
            <TeamMemberCard member={creative} />
          </ul>
        </section>
      </div>

      {/* Equipo técnico */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-ink">
          Equipo técnico
        </h3>

        <ul className="grid gap-6 sm:grid-cols-2">
          {technical.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
            />
          ))}
        </ul>
      </section>

      {/* Equipo de gestión */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-ink">
          Equipo de gestión
        </h3>

        <ul className="grid gap-6 sm:grid-cols-2">
          {management.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
