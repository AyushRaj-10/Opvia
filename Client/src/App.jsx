import React from 'react'
import HomePage from './pages/Home'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ATSChecker from './pages/ATSChecker'

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/ats-checker' element={<ATSChecker/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App