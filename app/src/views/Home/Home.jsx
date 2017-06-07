// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

// assets
import './Home.css';
import '../../fonts/hand-drawn/flaticon.css';
import iphoneWhite from '../../images/iphone-white.png';

class Home extends Component {

  render() {
    if (this.props.user.info) {
      if (this.props.user.info.role !== 'USER') {
        return (<Redirect to="/admin/users" />);
      }
      return (<Redirect to="/dashboard" />);
    }

    return (
<div>
  <div className="section main-section">
    <div className="container valign-wrapper" style={{minHeight: 'calc(100vh - 40px)'}}>

      <div className="row">
        <div className="col s12 m8" style={{paddingTop: '35px'}}>
          <div className="row" style={{marginBottom: '68px', paddingLeft: '15px', paddingRight: '15px'}}>
            <h2>ULLAM AUT. AD MAXIME.</h2>
            <span>Vivo blanditiis molestiae optio curtus nesciunt confido. Umerus uredo surculus arguo tabella demum confugo saepe. Vomito stultus consequatur coruscus vinitor charisma clarus spoliatio.</span>
          </div>

          <div className="row">
            <div className="col s12 m4" style={{paddingBottom: '15px'}}>
              <Link to="/sign-up" className="btn-large waves-effect waves-light orange" style={{width: '100%'}}>New Account</Link>
            </div>
            <div className="col s12 m4">
              <Link to="/sign-in" className="btn-large waves-effect waves-light white black-text" style={{width: '100%'}}>Sign In</Link>
            </div>
          </div>
        </div>

        <div className="col hide-on-small-only m4 right-align">
          <img src={iphoneWhite} className="responsive-img" alt="" />
        </div>
      </div>

    </div>
  </div>

  <div className="section second-section">
    <div className="row" style={{width: '80%'}}>
      <div className="col s12 m4">
        <div className="icon-block center">
          <i className="blue-text flaticon-bird-part-meat-hand-drawn-outline" />
          <h5 className="center">Speeds up development</h5>

          <p className="light">We did most of the heavy lifting for you to provide a default stylings that incorporate our custom components. Additionally, we refined animations and transitions to provide a smoother experience for developers.</p>
        </div>
      </div>

      <div className="col s12 m4">
        <div className="icon-block center">
          <i className="blue-text flaticon-smile-hand-drawn-emoticon" />
          <h5 className="center">User Experience Focused</h5>

          <p className="light">By utilizing elements and principles of Material Design, we were able to create a framework that incorporates components and animations that provide more feedback to users. Additionally, a single underlying responsive system across all platforms allow for a more unified user experience.</p>
        </div>
      </div>

      <div className="col s12 m4">
        <div className="icon-block center">
          <i className="blue-text flaticon-bars-graphic-up-hand-drawn-symbol" />
          <h5 className="center">Easy to work with</h5>

          <p className="light">We have provided detailed documentation as well as specific code examples to help new users get started. We are also always open to feedback and can answer any questions a user may have about Materialize.</p>
        </div>
      </div>

    </div>

  </div>

  <footer className="footer white" style={{paddingTop: '25px', paddingBottom: '12px'}}>
    <div className="row" style={{width: '80%', color: '#3a3a3a', opacity: '0.75'}}>
      <div className="col s12 m12 center">
        <p>2017 - Icons by Freepik</p>
      </div>
    </div>
  </footer>

</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
