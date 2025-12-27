import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Contact {
  name: string;
  preview: string;
  time: string;
  unread?: number;
  avatar: string;
}

interface MessageBubble {
  id: string;
  text: string;
  time: string;
  dayLabel?: string;
  position: 'left' | 'right';
}

@Component({
  selector: 'app-chats',
  standalone: true,
  templateUrl: './chats.html',
  styleUrls: ['./chats.css'],
  imports: [CommonModule, RouterModule],
})
export class ChatsComponent {
  contacts: Contact[] = [
    { name: 'P2M Team', preview: 'Nouveaux messages', time: '19:48', unread: 4, avatar: 'P2' },
    { name: 'Dr. Amine', preview: 'Vous: Je vous enverrai la version...', time: '18:30', avatar: 'DA' },
    { name: 'Ahmed', preview: 'Le rapport est en cours de préparation...', time: '18:16', avatar: 'Ah' },
    { name: 'Yassmine', preview: 'Le rapport est en cours de préparation...', time: '18:02', avatar: 'Ya' },
    { name: 'Nour', preview: 'Vous: As-tu mis à jour le statut des...', time: '17:42', avatar: 'No' },
    { name: 'Amina', preview: 'Vous: Je trouve un problème pour la...', time: '17:08', avatar: 'Am' },
    { name: 'Mehdi', preview: 'Toutes mes tâches sont complètes', time: '16:21', avatar: 'Me' },
    { name: 'Khalil', preview: 'Vous: Bien sûr', time: '15:10', avatar: 'Kh' },
  ];

  messages: MessageBubble[] = [
    {
      id: 'msg-1',
      text: 'Bonjour Chayma,\nAs-tu finalisé le rapport technique du module Data Logger ? N’oubliez pas d’inclure le schéma de la carte capteur et les tests unitaires. Je dois le valider avant la réunion de suivi demain à 10h.',
      time: '18:12',
      dayLabel: '02/04/2025',
      position: 'left',
    },
    {
      id: 'msg-2',
      text: 'Bonjour Monsieur Marc,\nOui, nous avons terminé la partie Hardware & Communication Protocols. Il ne reste qu’à ajouter la partie Dashboard Monitoring.',
      time: '18:15',
      position: 'right',
    },
    {
      id: 'msg-3',
      text: 'Je vous enverrai la version complète sur SupFlow d’ici 19h.',
      time: '18:16',
      position: 'right',
    },
  ];
}
