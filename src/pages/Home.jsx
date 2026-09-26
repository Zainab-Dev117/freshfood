import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import QuickFind from '../components/home/QuickFind';
import FeaturedCarousel from '../components/home/FeaturedCarousel';
import SeasonalPicks from '../components/home/SeasonalPicks';
import HowItWorks from '../components/home/HowItWorks';
import Benefits from '../components/home/Benefits';
import VisitorCounter from '../components/home/VisitorCounter';
import HomeCTA from '../components/home/HomeCTA';

export default function Home() {
    useEffect(() => {
        document.title = 'FreshFind — Fresh Finds. Local Markets. Better Choices.';
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="freshfind-home-page">
            <HeroSection />
            <QuickFind />
            <FeaturedCarousel />
            <SeasonalPicks />
            <HowItWorks />
            <Benefits />
            <VisitorCounter />
            <HomeCTA />
        </main>
    );
}
