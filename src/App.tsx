import React, { ReactElement } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Main from 'src/components/Main'

const App = (): ReactElement => {
  (
  <Router>
    <Route>
      <Switch>
        <Route path="/" exact component={Main} />
      </Switch>
    </Route>
  </Router>
)

export default App
