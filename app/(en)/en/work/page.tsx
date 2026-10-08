import RealizacjeClient from '../../../(pl)/realizacje/RealizacjeClient';
import { realizacjeDict } from '@/lib/i18n/projects';

export default function ProjectsPageEn() {
  return <RealizacjeClient t={realizacjeDict.en} locale="en" />;
}
