import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import ModulesSection from '@/components/ModulesSection'
import CTASection from '@/components/CTASection'
import QuickNav from '@/components/QuickNav'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <Features />
      <ModulesSection />
      <CTASection />
      <QuickNav />
    </main>
  )
}