export interface TeamMember {
  id: string;
  name: string;
  photo: string | null;
}

export const TEAM_MEMBERS: TeamMember[] = [
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
    id: 'enrique-andres-jimenez',
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
