import React, { useState, useEffect } from 'react'
import Navbar from '../components/homePage/Navbar'
import Hero from '../components/homePage/Hero'
import Features from '../components/homePage/Features'
import About from '../components/homePage/About'
import Join from '../components/homePage/Join'
import Footer from '../components/homePage/Footer'
import Problem from '../components/homePage/Problem'

function Home() {
  // Usually, you'd get this from a Context or LocalStorage
  const [UserLogedIn, setUserLogedIn] = useState(false) 
  const [btnData, setBtnData] = useState({ btnText: "Login", btnLink: "/login" })

  useEffect(() => {
    if (UserLogedIn) {
      setBtnData({ btnText: "Go to Dashboard", btnLink: "/dashboard" })
    } else {
      setBtnData({ btnText: "Login", btnLink: "/login" })
    }
  }, [UserLogedIn]) // This only runs when UserLogedIn changes

  return (
    <>
      <Navbar btnData={btnData} UserLogedIn={UserLogedIn}/>
      <Hero btnData={btnData} UserLogedIn={UserLogedIn}/>
      <Problem />
      <Features />
      <About />
      <Join btnData={btnData} UserLogedIn={UserLogedIn}/>
      <Footer />
    </>
  )
}

export default Home