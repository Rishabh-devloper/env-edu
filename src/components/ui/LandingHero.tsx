interface LandingHeroProps {
  title: string
  subtitle: string
  roleLabel: string
  roleColor: string
  description: string
  backgroundGradient?: string
  className?: string
}

export default function LandingHero({
  title,
  subtitle,
  roleLabel,
  roleColor,
  description,
  backgroundGradient = 'from-green-50 via-emerald-50 to-teal-50',
  className = ''
}: LandingHeroProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} ${className}`}>
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {title}
              <span className={`${roleColor}`}> {roleLabel}!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
