import Navbar from '../components/homePage/Navbar';
import Hero from '../components/homePage/Hero';
import Features from '../components/homePage/Features';
import About from '../components/homePage/About';
import Join from '../components/homePage/Join';
import Footer from '../components/homePage/Footer';
import Problem from '../components/homePage/Problem';

function Home() {
  const btnData = { btnText: "Login", btnLink: "/login" };

  return (
    <>
      <Navbar btnData={btnData} />
      <Hero btnData={btnData} />
      <Problem />
      <Features />
      <About />
      <Join btnData={btnData} />
      <Footer />
    </>
  )
}

export default Home