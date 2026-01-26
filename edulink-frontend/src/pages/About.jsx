import { Button } from '../components/ui/Button'
import { ArrowRight, CheckCircle, Users, Award, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import aboutImage from '../assets/about-feature.png'

export const About = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-primary/5 pb-16 pt-20 lg:pb-32 lg:pt-32">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
                        <div className="lg:w-1/2 space-y-8">
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                                Empowering <span className="text-primary block mt-2">Future Education</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                                Edulink connects students and teachers in a seamless, modern environment. We are dedicated to transforming the way knowledge is shared and acquired.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/signup">
                                    <Button size="lg" className="rounded-full px-8">
                                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to="/contact">
                                    <Button variant="outline" size="lg" className="rounded-full px-8">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="lg:w-1/2 flex justify-center">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                                <img
                                    src={aboutImage}
                                    alt="Team collaboration"
                                    className="relative rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <section className="py-24 bg-card">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Our Mission</h2>
                        <p className="text-lg text-muted-foreground">
                            To bridge the gap between educators and learners through intuitive technology and community-driven learning.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-background border hover:border-primary/50 transition-colors shadow-sm cursor-pointer group">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Community First</h3>
                            <p className="text-muted-foreground">
                                Building a strong network of motivated students and passionate teachers.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-background border hover:border-primary/50 transition-colors shadow-sm cursor-pointer group">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Accessible Learning</h3>
                            <p className="text-muted-foreground">
                                Making quality educational resources available to everyone, everywhere.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-background border hover:border-primary/50 transition-colors shadow-sm cursor-pointer group">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <Award className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                            <p className="text-muted-foreground">
                                Striving for the highest standards in educational tools and support.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
