
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

export function TeamGrid() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeader title="Nuestro equipo" />

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LOCAL_TEAM_MEMBERS.map((member) => (
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
              <h3 className="font-semibold text-ink">
                {member.name}
              </h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
