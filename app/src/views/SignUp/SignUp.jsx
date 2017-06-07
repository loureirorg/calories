// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button } from 'react-materialize';

// api
import { signUp } from  '../../reducers';

// assets
import './SignUp.css';

// libs
import $ from 'jquery';

class SignUp extends Component {

  constructor(props) {
    super(props);
    this._handleSignUpSubmit = this._handleSignUpSubmit.bind(this);
  }

  _handleSignUpSubmit(event) {
    event.preventDefault();

    // disable submit button
    $('form button').prop('disabled', true);

    // api
    let self = this;
    this.props.signUp({
      email: this.email.value,
      password: this.password.value,
      name: this.name.value
    })
    .then(function () {
      if (self.props.user.error) {
        window.Materialize.toast(self.props.user.error, 4000);
      }

      // enable buttons
      $('form button').prop('disabled', false);
    });
  }

  // componentDidUpdate() {
  //   if (this.props.user.error) {
  //     window.Materialize.toast(this.props.user.error, 4000);
  //   }
  // }

  render() {
    if (this.props.user.info) {
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
<div className="SignUp">
  <div style={{minHeight: '100vh'}}>
    <div className="navbar-fixed">
      <nav style={{backgroundColor: '#0172FF'}}>
        <div className="nav-wrapper">
          <div className="col s12">
            <Link to="/" className="breadcrumb"></Link>
            <Link to="/" className="breadcrumb">Sign up</Link>
            {loading_html}
          </div>
        </div>
      </nav>
    </div>

    <div className="container valign-wrapper" style={{paddingTop: '15px'}}>
      <form onSubmit={this._handleSignUpSubmit} style={{width: '100%'}}>
        <div className="row">
          <div className="input-field col s12 m6 offset-m3">
            <input id="txt-email" type="email" autoFocus="true" className={"validate " + (errors['email'] ? "invalid" : "")} ref={(input) => this.email = input} />
            <label htmlFor="txt-email" data-error={"E-mail " + errors['email']}>E-mail</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12 m6 offset-m3">
            <input id="txt-password" type="password" className={"validate " + (errors['password'] ? "invalid" : "")} ref={(input) => this.password = input} />
            <label htmlFor="txt-password" data-error={"Password " + errors['password']}>Password</label>
          </div>
        </div>

        {/* <div className="row">
          <div className="input-field col s12 m6 offset-m3">
            <input id="txt-confirm-password" type="password" className="validate" ref={(input) => this.confirm_password = input} />
            <label htmlFor="txt-confirm-password">Confirm Password</label>
          </div>
        </div> */}

        <div className="row">
          <div className="input-field col s12 m6 offset-m3">
            <input id="txt-name" type="text" className={"validate " + (errors['name'] ? "invalid" : "")} ref={(input) => this.name = input} />
            <label htmlFor="txt-name" data-error={"Name " + errors['name']} className="active">Name</label>
          </div>
        </div>

        <div className="row">
          <div className="col s12 m4 offset-m4" style={{paddingBottom: '15px', paddingTop: '30px'}}>
            <Button type="submit" className="btn-large waves-effect waves-light blue" style={{width: '100%'}}>Create Account</Button>
          </div>
        </div>
      </form>
    </div>
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
    signUp: (userInfo) => dispatch(signUp(userInfo)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
