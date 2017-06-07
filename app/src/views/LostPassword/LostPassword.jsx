import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button } from 'react-materialize';

// sub-pages / components
import ModalLostPassword from './ModalLostPassword/ModalLostPassword';

// api
import { lostPassword } from '../../reducers';

// assets
import './LostPassword.css';

// libs
import $ from 'jquery';


class LostPassword extends Component {

  constructor(props) {
    super(props);
    this._submit = this._submit.bind(this);
  }

  _submit(event) {
    event.preventDefault();

    // disable submit button
    $('form button').prop('disabled', true);

    // api
    let self = this;
    this.props.lostPassword({email: this.email.value})
      .then(function (res) {
        $('form button').prop('disabled', false);
        if (res.ajaxReturn.error) {
          window.Materialize.toast(res.ajaxReturn.error, 4000);
        }
        else if (! res.ajaxReturn.errors) {
          // success
          self.props.modalLostPasswordOpen(self.email.value);
        }
      });
  }

  render() {
    if (this.props.user.info) {
      return (<Redirect to="/dashboard" />);
    }

    let modal_html = '';
    if (this.props.modal_lost_password) {
      modal_html = <ModalLostPassword key="modal-lost-password" history={this.props.history} email={this.props.modal_lost_password} />;
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
<div className="LostPassword">
  <div style={{minHeight: '100vh'}}>
    <div className="navbar-fixed">
      <nav style={{backgroundColor: '#0172FF'}}>
        <div className="nav-wrapper">
          <div className="col s12">
            <Link to="/" className="breadcrumb"></Link>
            <Link to="/" className="breadcrumb">Forgotten your password?</Link>
            {loading_html}
          </div>
        </div>
      </nav>
    </div>

    <form onSubmit={this._submit} className="valign-wrapper" style={{paddingTop: '40px', minHeight: 'calc(70vh - 40px)'}}>
      <div className="container">
        <div className="row">
          <div className="input-field col s12 m6 offset-m3">
            <input id="txt-email" autoFocus="true" type="email" className={"validate " + (errors['email'] ? "invalid" : "")} ref={(input) => this.email = input} />
            <label htmlFor="txt-email" className="active" data-error={"E-mail " + errors['email']}>E-mail</label>
          </div>
        </div>

        <div className="row">
          <div className="col s12 m6 offset-m3" style={{paddingBottom: '15px'}}>
            <Button type="submit" className="btn-large waves-effect waves-light blue" style={{width: '100%'}}>Reset your password</Button>
          </div>
        </div>
      </div>
    </form>

    {/* MODALS */}
    {modal_html}
  </div>
</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    modal_lost_password: state.modal_lost_password,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    lostPassword: (info) => dispatch(lostPassword(info)),
    modalLostPasswordOpen: (email) => dispatch({type: 'MODAL_LOST_PASSWORD_OPEN', email: email}),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LostPassword);
