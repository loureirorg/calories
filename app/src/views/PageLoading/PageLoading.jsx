// core
import React, { Component } from 'react';

// assets
import './PageLoading.css';

export default class NotFound extends Component {

  render() {
    return (
<div className="PageLoading">
  <div className="container">
    <div className="valign-wrapper" style={{minHeight: '65vh'}}>
      <div className="row center" style={{width: '100%'}}>
        <div className="col s12">
          {/* <h2>Loading ...</h2> */}
        </div>
      </div>
    </div>
  </div>
</div>
    );
  }
}
