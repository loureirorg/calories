// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-materialize';

// api
import { userUpdate } from '../../../reducers'

// libs
import $ from 'jquery';
import moment from 'moment';

//
const KEEP_SAME_PASS = '******';

class ModalSettings extends Component {

  constructor(props) {
    super(props);
    this._handleCancel = this._handleCancel.bind(this);
    this._handleSave = this._handleSave.bind(this);
  }

  componentDidMount() {
    const { modal_settings } = this.refs;
    this.modal_settings = modal_settings;

    let self = this;
    window.jQuery(this.modal_settings).modal({
      dismissible: true,
      complete: function() {
        self.props.modalSettingsClose();
      },
      ready: function(modal, trigger) {
        $('.modal input:first').focus();
      }
    });
    window.jQuery(this.modal_settings).modal('open');
  }

  componentWillUnmount() {
    window.jQuery(this.modal_settings).modal('close');
  }

  _handleCancel(event) {
    event.preventDefault();
    this.props.modalSettingsClose();
  }

  _handleSave(event) {
    event.preventDefault();
    let info = {
      name: this.name.value,
      daily_calories_max: this.daily_calories_max.value,
    }
    if (this.password.value !== KEEP_SAME_PASS) {
      info.password = this.password.value;
      info.password_confirmation = this.password.value;
    }

    let self = this;
    this.props.userUpdate(info)
      .then(function (res) {
        if (res.ajaxReturn.error) {
          window.Materialize.toast(res.ajaxReturn.error, 4000);
        }
        else if (! res.ajaxReturn.errors) { // success
          self.props.modalSettingsClose();
        }
      });
  }

  render() {
    let errors = this.props.user.errors;

    return(
<div id="modal-settings" ref="modal_settings" className="modal modal-fixed-footer">
  <form>
  <div className="modal-content">
    <h4>Settings</h4>
    <div className="row">
      <div className="input-field col s12 m12">
        <input id="txt-daily-cal" type="number" autoFocus="true" className={"validate " + (errors['daily_calories_max'] ? "invalid" : "")} defaultValue={this.props.user.info.daily_calories_max} ref={(input) => this.daily_calories_max = input} />
        <label htmlFor="txt-daily-cal" data-error={"Goal " + errors['daily_calories_max']} className="active">Daily Calorie Goal</label>
      </div>
    </div>
    <div className="row">
      <div className="input-field col s12 m6">
        <input id="txt-name" type="text" className={"validate " + (errors['name'] ? "invalid" : "")} defaultValue={this.props.user.info.name} ref={(input) => this.name = input} />
        <label htmlFor="txt-name" data-error={"Name " + errors['name']} className="active">Name</label>
      </div>
      <div className="input-field col s12 m6">
        <input id="txt-password" type="password" autoComplete="new-password" className={"validate " + (errors['password'] ? "invalid" : "")} defaultValue={KEEP_SAME_PASS} ref={(input) => this.password = input} />
        <label htmlFor="txt-password" data-error={"Password " + errors['password']} className="active">Password</label>
      </div>
    </div>
  </div>
  <div className="modal-footer">
    <Button type="submit" onClick={this._handleSave} className="waves-effect waves-blue btn-flat">Save</Button>
    <Button onClick={this._handleCancel} className="modal-action modal-close waves-effect waves-white btn-flat">Cancel</Button>
  </div>
  </form>
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
    modalSettingsClose: () => dispatch({type: 'MODAL_SETTINGS_CLOSE'}),
    userUpdate: (info) => dispatch(userUpdate(info))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSettings);
