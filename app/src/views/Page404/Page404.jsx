// core
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

// assets
import './Page404.css';

export default class NotFound extends Component {

  render() {
    return (
<div className="NotFound">
  <div className="container">
    <div className="valign-wrapper" style={{minHeight: '65vh'}}>
      <div className="row center" style={{width: '100%'}}>
        <div className="col s12">
          <h1>404</h1>
          <h2>Page not found :(</h2>
          <Link to="/">Go to Main Page</Link>
        </div>
      </div>
    </div>
  </div>
</div>
    );
  }
}
