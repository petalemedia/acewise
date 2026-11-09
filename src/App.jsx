import { Route, Routes } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"
import Legal from "@/pages/Legal"
import CookieConsent from "@/components/legal/CookieConsent"
import Home from "@/pages/Home"
import CourseHome from "@/pages/CourseHome"
import Questions from "@/pages/Questions"
import Notes from "@/pages/Notes"
import NotFound from "@/pages/NotFound"
import ComingSoon from "@/pages/ComingSoon"
import { isStudyFeatureEnabled } from "@/lib/study-features"
import { StudyNavigationProvider } from "@/components/study/StudyNavigation"
import { AuthProvider } from "@/lib/auth-context"
import AuthModal from "@/components/auth/AuthModal"
import { pingAppwrite } from "@/lib/appwrite"

const Worksheets = lazy(() => import("@/pages/Worksheets"))
const Flashcards = lazy(() => import("@/pages/Flashcards"))

function App() {
  useEffect(() => {
    void pingAppwrite()
    if (isStudyFeatureEnabled('worksheets')) {
      void Promise.all([import('@/pages/Worksheets'), import('@/lib/worksheet-preload'), import('react-pdf')]).then(([, { preloadWorksheets }, { pdfjs }]) => preloadWorksheets(pdfjs.GlobalWorkerOptions.workerSrc)).catch(() => {})
    }
    if (isStudyFeatureEnabled('flashcards')) void import('@/pages/Flashcards').catch(() => {})
  }, [])

  return (
    <AuthProvider>
      <StudyNavigationProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          {["privacy", "terms", "cookies", "contact"].map(page => <Route key={page} path={`/${page}`} element={<Legal page={page}/>}/>)}
          <Route path="/course" element={<CourseHome />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/flashcards" element={isStudyFeatureEnabled('flashcards') ? <Suspense fallback={<ComingSoon feature="flashcards"/>}><Flashcards /></Suspense> : <ComingSoon feature="flashcards"/>} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/worksheets" element={isStudyFeatureEnabled('worksheets') ? <Suspense fallback={<ComingSoon feature="worksheets"/>}><Worksheets /></Suspense> : <ComingSoon feature="worksheets"/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AuthModal />
        <CookieConsent/>
      </StudyNavigationProvider>
    </AuthProvider>
  )
}

export default App
