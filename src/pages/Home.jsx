import Navbar from "../components/homePage/Navbar";
import Hero from "../components/homePage/Hero";
import Features from "../components/homePage/Features";
import About from "../components/homePage/About";
import Join from "../components/homePage/Join";
import Footer from "../components/homePage/Footer";
import Problem from "../components/homePage/Problem";
import Workflow from "../components/homePage/Workflow";

function Home() {
  return (
    <div className="relative isolate">
      <Navbar />

      {/* Foreground content */}
      <main className="relative z-10 bg-white">
        <Hero />
        <Problem />
        <Workflow />
        <Features />
        <About />
        <Join />
      </main>

      {/* Revealed footer layer */}
      <Footer />
    </div>
  );
}

export default Home;
