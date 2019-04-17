import React from 'react'
import withRoot from '../withRoot'
import Header from '../components/Header'
import Home from '../components/Home'

const App = () => {
  return (
    <>
      <Header />
      <Home />
    </>
  )
}

export default withRoot(App)