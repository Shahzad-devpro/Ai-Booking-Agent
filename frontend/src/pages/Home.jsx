import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import WhyChooseUs from "../components/home/WhyChooseUs";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import FinalCTA from "../components/home/FinalCTA";
import Footer from "../components/home/Footer";


const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />

            <main>
                <Hero />

                <Services />

                <WhyChooseUs />

                <HowItWorks />

                <Testimonials />

                <FAQ/>

                <FinalCTA />
            </main>

            <Footer />
        </div>
    );
};

export default Home;