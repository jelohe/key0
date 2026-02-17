import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

import Landing from '@/routes/Landing';
import Scan from '@/routes/Scan';
import Codes from '@/routes/Codes';
import Backups from '@/routes/Backups';
import NotFound from '@/routes/NotFound';

import '../css/key0.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"    element={<Landing />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/keys" element={<Codes />} />
        <Route path="/backups" element={<Backups />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
