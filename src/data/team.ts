export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
}

const PENDING_ROLE = 'Cargo por definir';
const PENDING_BIO = 'Biografía pendiente. Este espacio se completará con la información oficial del equipo.';

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'enrique-jimenez', name: 'Enrique Jiménez García', role: PENDING_ROLE, bio: PENDING_BIO, photo: null },
  { id: 'adrian-marquez', name: 'Adrián Márquez Domínguez', role: PENDING_ROLE, bio: PENDING_BIO, photo: null },
  { id: 'laura-prado', name: 'Laura Prado Álvarez', role: PENDING_ROLE, bio: PENDING_BIO, photo: null },
  { id: 'marta-lopez', name: 'Marta López Sanromán', role: PENDING_ROLE, bio: PENDING_BIO, photo: null },
  { id: 'laura-gallego', name: 'Laura Gallego Rodríguez', role: PENDING_ROLE, bio: PENDING_BIO, photo: null },
  { id: 'mariela-reyes', name: 'Mariela Reyes Chaves', role: PENDING_ROLE, bio: PENDING_BIO, photo: null },
];
