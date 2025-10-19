import React from 'react';
import { UsersIcon, EnvelopeIcon, BoltIcon, CalendarDaysIcon, ClockIcon } from '../components/Icons';

export const CATEGORIES = [
  {
    id: "interruption",
    label: "Interrupción",
    icon: <UsersIcon className="w-8 h-8" />,
  },
  {
    id: "impulsive_email",
    label: "Correo impulsivo",
    icon: <EnvelopeIcon className="w-8 h-8" />,
  },
  {
    id: "microtask_interruption",
    label: "Microtareas imprevistas",
    icon: <BoltIcon className="w-8 h-8" />,
  },
  {
    id: "unexpected_meeting",
    label: "Reunión inesperada",
    icon: <CalendarDaysIcon className="w-8 h-8" />,
  },
  {
    id: "long_meeting",
    label: "Reunión que se alarga",
    icon: <ClockIcon className="w-8 h-8" />,
  },
];