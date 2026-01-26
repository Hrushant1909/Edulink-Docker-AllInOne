import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { GraduationCap, BookOpen, Users, Award, CheckCircle } from 'lucide-react'
import landingImage from '../assets/landing-feature.png'

export const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Unlock Your <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Potential</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              EduLink is the modern bridge between educators and students. Experience a seamless, intuitive, and powerful learning management system.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-full px-8 text-lg h-12">Get Started</Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full rounded-full px-8 text-lg h-12">Login</Button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Free to Join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Expert Teachers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>24/7 Access</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-10 bg-primary/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>
            <img
              src={landingImage}
              alt="Student learning"
              className="relative rounded-3xl shadow-2xl border border-white/20 transform hover:-translate-y-2 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card/50 py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Choose EduLink?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to manage your educational journey, whether you are a teacher or a student.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<GraduationCap className="h-8 w-8 text-white" />}
              title="For Students"
              description="Browse widely available subjects, enroll in courses instantly, and access top-tier study materials."
              color="bg-blue-500"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-white" />}
              title="For Teachers"
              description="Create comprehensive subjects, upload diverse materials, and manage your classes with ease."
              color="bg-violet-500"
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-white" />}
              title="Resource Hub"
              description="A central repository for all your educational needs. Upload, download, and share in seconds."
              color="bg-indigo-500"
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-white" />}
              title="Smart Admin"
              description="Powerful administrative tools to manage users, monitor activity, and ensure platform health."
              color="bg-purple-500"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="group p-6 rounded-2xl bg-background border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      <div className={`h-14 w-14 rounded-xl ${color} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}
