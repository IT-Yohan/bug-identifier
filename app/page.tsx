import { redirect } from 'next/navigation';

export default function DefaultPage() {
  // Redirect to English by default
  redirect('/en');
}
