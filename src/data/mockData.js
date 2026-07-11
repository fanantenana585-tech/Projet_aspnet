export const statsData = [
  {
    label: 'Enseignants',
    value: 24,
    icon: 'Users',
    trend: '+2 ce mois',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    label: 'Salles',
    value: 12,
    icon: 'School',
    trend: '10 disponibles',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-400'
  },
  {
    label: 'Matières',
    value: 38,
    icon: 'BookOpen',
    trend: '6 filières couvertes',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-400'
  },
  {
    label: 'Emplois du Temps',
    value: 6,
    icon: 'Calendar',
    trend: '3 en cours',
    color: 'orange',
    gradient: 'from-orange-500 to-yellow-400'
  }
];

export const activitiesData = [
  {
    id: 1,
    type: 'update',
    content: 'Emploi du temps L3 Info mis à jour',
    time: 'il y a 2h',
    icon: 'RefreshCw',
    color: 'text-blue-400'
  },
  {
    id: 2,
    type: 'add',
    content: 'Nouvel enseignant ajouté : Dr. Rakoto',
    time: 'hier',
    icon: 'UserPlus',
    color: 'text-emerald-400'
  },
  {
    id: 3,
    type: 'modify',
    content: 'Salle B204 modifiée',
    time: 'il y a 3 jours',
    icon: 'Edit3',
    color: 'text-amber-400'
  },
  {
    id: 4,
    type: 'alert',
    content: 'Conflit détecté en L1 G2',
    time: 'il y a 4 jours',
    icon: 'AlertCircle',
    color: 'text-red-400'
  }
];

export const todayCourses = [
  {
    id: 1,
    time: '08:00 - 10:00',
    subject: 'Algorithmique',
    teacher: 'Dr. Rakoto',
    room: 'Salle 102',
    branch: 'L1 G1',
    status: 'Terminé'
  },
  {
    id: 2,
    time: '10:15 - 12:15',
    subject: 'Base de Données',
    teacher: 'Mme. Ranaivo',
    room: 'Labo Info 1',
    branch: 'L2 G2',
    status: 'En cours'
  },
  {
    id: 3,
    time: '14:00 - 16:00',
    subject: 'Développement Web',
    teacher: 'M. Andria',
    room: 'Amphi A',
    branch: 'L3',
    status: 'À venir'
  },
  {
    id: 4,
    time: '16:15 - 18:15',
    subject: 'Réseaux Locaux',
    teacher: 'M. Jean',
    room: 'Salle 201',
    branch: 'M1',
    status: 'À venir'
  }
];

export const chartData = {
  distribution: {
    labels: ['Informatique', 'Management', 'Télécom', 'Génie Civil', 'Droit', 'Économie'],
    datasets: [{
      data: [30, 20, 15, 15, 10, 10],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ],
      borderColor: 'rgba(30, 41, 59, 1)',
      borderWidth: 2
    }]
  },
  workload: {
    labels: ['Dr. Rakoto', 'Mme. Ranaivo', 'M. Andria', 'Dr. Solo', 'Mme. Voary'],
    datasets: [{
      label: 'Heures / Semaine',
      data: [18, 15, 22, 12, 16],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 8
    }]
  }
};
