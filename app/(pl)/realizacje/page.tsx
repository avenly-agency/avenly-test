import RealizacjeClient from './RealizacjeClient';
import { realizacjeDict } from '@/lib/i18n/projects';

export default function ProjectsPage() {
  return <RealizacjeClient t={realizacjeDict.pl} locale="pl" />;
}
