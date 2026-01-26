import { Button } from '../components/ui/Button'
import { Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react'
import contactImage from '../assets/contact-feature.png'

export const Contact = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Contact Info & Illustration */}
                    <div className="space-y-12">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
                                Get in <span className="text-primary">Touch</span>
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                First of all there is no "us", it's just me. But I'll do my best to verify and help with your queries.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 p-4 rounded-xl bg-card border shadow-sm">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Email Us</p>
                                    <p className="text-muted-foreground text-sm">support@edulink.com</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 rounded-xl bg-card border shadow-sm">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Call Us</p>
                                    <p className="text-muted-foreground text-sm">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 rounded-xl bg-card border shadow-sm">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Visit Us</p>
                                    <p className="text-muted-foreground text-sm">123 Education Lane, Tech City</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block mt-8">
                            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-30"></div>
                            <img
                                src={contactImage}
                                alt="Contact Support"
                                className="relative rounded-2xl shadow-xl w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card border rounded-2xl shadow-xl p-8 lg:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <MessageSquare className="mr-3 h-6 w-6 text-primary" />
                            Send a Message
                        </h2>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                    placeholder="Your message here..."
                                />
                            </div>

                            <Button type="submit" className="w-full h-11 text-base">
                                Send Message <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
