// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button } from 'react-materialize';

// api
import { signIn } from  '../../reducers';

// assets
import './SignIn.css';

// libs
import $ from 'jquery';

class SignIn extends Component {

  constructor(props) {
    super(props);
    this._handleSignInSubmit = this._handleSignInSubmit.bind(this);
  }

  _handleSignInSubmit(event) {
    event.preventDefault();

    // disable submit button
    $('form button').prop('disabled', true);

    // api
    let self = this;
    this.props.signIn({
      email: this.email.value,
      password: this.password.value,
    })
    .then(function () {
      if (self.props.user.error) {
        window.Materialize.toast(self.props.user.error, 4000);
      }

      // enable buttons
      $('form button').prop('disabled', false);
    });
  }

  render() {
    if (this.props.user.info) {
      if (this.props.user.info.role !== 'USER') {
        return (<Redirect to="/admin/users" />);
      }
      return (<Redirect to="/dashboard" />);
    }

    let loading_html = '';
    if (this.props.user.isFetching) {
      loading_html = (
        <div className="progress" style={{marginTop: 0}}>
          <div className="indeterminate orange"></div>
        </div>);
    }

    let errors = this.props.user.errors;
    return (
<div className="SignIn">
  <div style={{minHeight: '100vh'}}>
    <div className="navbar-fixed">
      <nav style={{backgroundColor: '#0172FF'}}>
        <div className="nav-wrapper">
          {/* <span className="brand-logo center">Calories Logger</span> */}
          <div className="col s12">
            <Link to="/" className="breadcrumb"></Link>
            <Link to="/" className="breadcrumb">Sign in</Link>
            {loading_html}
          </div>
        </div>
      </nav>
    </div>

    <form onSubmit={this._handleSignInSubmit} className="valign-wrapper" style={{paddingTop: '40px', minHeight: 'calc(80vh - 40px)'}}>
      <div className="container">
        <div className="row">
          <div className="input-field col s12 m6 offset-m3">
            <input id="txt-email" type="email" autoFocus="true" className={"validate " + (errors['email'] ? "invalid" : "")} ref={(input) => this.email = input} />
            <label htmlFor="txt-email" className="active" data-error={"E-mail " + errors['email']}>E-mail</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12 m6 offset-m3">
            <input id="txt-password" type="password" className={"validate " + (errors['password'] ? "invalid" : "")} ref={(input) => this.password = input} />
            <label htmlFor="txt-password" data-error={"Password " + errors['password']}>Password</label>
          </div>
        </div>

        <div className="row">
          <div className="col s12 m6 offset-m3 lost-password left">
            <Link to="/lost-password">Forgotten your password?</Link>
          </div>
        </div>

        <div className="row">
          <div className="col s12 m6 offset-m3" style={{paddingBottom: '15px'}}>
            <Button type="submit" className="btn-large waves-effect waves-light blue" style={{width: '100%'}}>Log In</Button>
          </div>
        </div>
      </div>
    </form>
  </div>
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
    signIn: (userInfo) => dispatch(signIn(userInfo)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
