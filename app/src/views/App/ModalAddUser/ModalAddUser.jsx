// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-materialize';

// api
import { adminUserCreate, userList } from '../../../reducers';

// libs
import $ from 'jquery';
import moment from 'moment';

class ModalAddUser extends Component {

  constructor(props) {
    super(props);
    this._handleCancel = this._handleCancel.bind(this);
    this._handleCreate = this._handleCreate.bind(this);
  }

  componentDidMount() {
    const { modal_add } = this.refs;
    this.modal_add = modal_add;

    let self = this;

    window.jQuery(this.modal_add).modal({
      dismissible: true,
      complete: function() {
        self.props.modalAddUserClose();
      },
      ready: function(modal, trigger) {
        $('.modal input:first').focus();
      }
    });
    window.jQuery(this.modal_add).modal('open');
    window.jQuery(this.role).material_select();
  }

  componentWillUnmount() {
    window.jQuery(this.modal_add).modal('close');
  }

  _handleCancel(event) {
    event.preventDefault();
    this.props.modalAddUserClose();
  }

  _handleCreate(event) {
    event.preventDefault();

    let self = this;
    this.props.adminUserCreate({
      name: this.name.value,
      email: this.email.value,
      password: this.password.value,
      role: this.role.value,
      daily_calories_max: this.daily_calories_max.value
    })
    .then(function (info) {
      if (self.props.admin_user.error) {
        window.Materialize.toast(self.props.admin_user.error);
      }
      else if (self.props.admin_user.errors) {
      }
      else {
        self.props.userList(self.props.users, {});
        self.props.modalAddUserClose();
      }
    })
  }

  render() {
    let errors = this.props.admin_user.errors;

    let input_role_html = '';
    let selected;
    if (this.role) selected = this.role.value
    if (! selected) selected = 'USER';

    if (this.props.user.info.role === 'ADMIN') {
      input_role_html = (
<div className="row">
  <div className="input-field col s12 m6">
    <select defaultValue={selected} ref={(input) => this.role = input}>
      <option value="USER">User</option>
      <option value="MANAGER">Manager</option>
      <option value="ADMIN">Administrator</option>
    </select>
    <label htmlFor="txt-role" data-error={"Role " + errors['role']} className="active">Role</label>
  </div>
</div>
    )}

    return(
<div id="modal-add" ref="modal_add" className="modal modal-fixed-footer">
  <form>
  <div className="modal-content">
    <h4>New User</h4>
    <div className="row">
      <div className="input-field col s12 m6">
        <input id="txt-daily-cal" type="number" autoFocus="true" className={"validate " + (errors['daily_calories_max'] ? "invalid" : "")}  ref={(input) => this.daily_calories_max = input} />
        <label htmlFor="txt-daily-cal" data-error={"Goal " + errors['daily_calories_max']} className="active">Daily Calorie Goal</label>
      </div>
      <div className="input-field col s12 m6">
        <input id="txt-email" type="email" className={"validate " + (errors['email'] ? "invalid" : "")}  ref={(input) => this.email = input} />
        <label htmlFor="txt-email" data-error={"Email " + errors['email']} className="active">Email</label>
      </div>
    </div>
    <div className="row">
      <div className="input-field col s12 m6">
        <input id="txt-name" type="text" className={"validate " + (errors['name'] ? "invalid" : "")}  ref={(input) => this.name = input} />
        <label htmlFor="txt-name" data-error={"Name " + errors['name']} className="active">Name</label>
      </div>
      <div className="input-field col s12 m6">
        <input id="txt-password" type="password" autoComplete="new-password" className={"validate " + (errors['password'] ? "invalid" : "")} ref={(input) => this.password = input} />
        <label htmlFor="txt-password" data-error={"Password " + errors['password']} className="active">Password</label>
      </div>
    </div>
    {input_role_html}
  </div>
  <div className="modal-footer">
    <Button type="submit" onClick={this._handleCreate} className="waves-effect waves-blue btn-flat">Save</Button>
    <Button onClick={this._handleCancel} className="modal-action modal-close waves-effect waves-white btn-flat">Cancel</Button>
  </div>
  </form>
</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modal_add: state.modal_add_user,
    users: state.users,
    user: state.user,
    admin_user: state.admin_user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalAddUserClose: () => dispatch({type: 'MODAL_ADD_USER_CLOSE'}),
    userList: (state, args) => dispatch(userList(state, args)),
    adminUserCreate: (info) => dispatch(adminUserCreate(info)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalAddUser);
