import { useLocation } from 'react-router-dom'
import { subjectFromSearch } from '@/data/subjects'
export function useSubject() { return subjectFromSearch(useLocation().search) }
