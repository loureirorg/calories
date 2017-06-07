// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button } from 'react-materialize';

// api
import { changePassword } from '../../reducers';

// assets
import './ChangePassword.css';

// libs
import $ from 'jquery';

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this._submit = this._submit.bind(this);
  }

  _submit(event) {
    event.preventDefault();

    let token = this.props.location.search.match(/\?reset_password_token=(.*)/);
    if (token) {
      token = token[1];
    }
    else {
      token = 1;
    }

    // disable submit button
    $('form button').prop('disabled', true);

    // api
    this.props.changePassword({
      password: this.password.value,
      password_confirmation: this.password_confirmation.value,
      reset_password_token: token
    })
    .then(function (res) {
      $('form button').prop('disabled', false);
      if (res.ajaxReturn.error) {
        window.Materialize.toast(res.ajaxReturn.error, 4000);
      }
      else if (res.ajaxReturn.errors && res.ajaxReturn.errors['reset_password_token']) {
        window.Materialize.toast('Reset token ' + res.ajaxReturn.errors['reset_password_token'], 4000);
      }
      else if (res.ajaxReturn.errors) {
      }
      else { // success
      }
    });
  }

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
<div className="ChangePassword">
  <div style={{minHeight: '100vh'}}>
    <div className="navbar-fixed">
      <nav style={{backgroundColor: '#0172FF'}}>
        <div className="nav-wrapper">
          {/* <span className="brand-logo center">Calories Logger</span> */}
          <div className="col s12">
            <Link to="/" className="breadcrumb"></Link>
            <Link to="/" className="breadcrumb">Change Password</Link>
            {loading_html}
          </div>
        </div>
      </nav>
    </div>

    <form onSubmit={this._submit} className="valign-wrapper">
      <div className="container">
        <div className="row">
          <div className="input-field col s12 m6 offset-m3">
            <input id="txt-password" type="password" autoFocus="true" className={"validate " + (errors['password'] ? "invalid" : "")} ref={(input) => this.password = input} />
            <label htmlFor="txt-password" data-error={"Password " + errors['password']} className="active">New Password</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12 m6 offset-m3">
            <input id="txt-confirm-password" type="password" className={"validate " + (errors['password_confirmation'] ? "invalid" : "")} ref={(input) => this.password_confirmation = input} />
            <label htmlFor="txt-confirm-password" data-error={"Password confirmation " + errors['password_confirmation']}>Confirm Password</label>
          </div>
        </div>

        <div className="row">
          <div className="col s12 m6 offset-m3" style={{paddingBottom: '15px'}}>
            <Button type="submit" className="btn-large waves-effect waves-light blue" style={{width: '100%'}}>Save</Button>
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
    changePassword: (info) => dispatch(changePassword(info)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePassword);
