import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/cadastro" component={Register}/>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
