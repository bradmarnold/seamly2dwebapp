// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // Send the homepage to /draft/
  redirect('/draft/');
}
