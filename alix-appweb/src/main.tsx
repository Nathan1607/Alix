import { createRoot } from 'react-dom/client'

import LandingPage from './pages/landingPage';
import MentionLegale from './pages/mentionLegale';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/mention-legale',
    element: <MentionLegale />,
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)