// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'react-materialize';

// api
import { adminUserList, adminUserDelete, adminUserUpdate } from '../../../../reducers';

// libs
import $ from 'jquery';

//
const KEEP_SAME_PASS = '******';

class ModalEditUser extends Component {

  constructor(props) {
    super(props);

    // binding
    this._handleCancel = this._handleCancel.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._handleUpdate = this._handleUpdate.bind(this);
    this._handleRoleChange = this._handleRoleChange.bind(this);
  }

  componentDidMount() {
    const { modal_edit } = this.refs;
    this.modal_edit = modal_edit;

    this.role = this.props.role;

    let self = this;

    window.jQuery(this.modal_edit).modal({
      dismissible: true,
      complete: function() {
        self.props.modalEditUserClose();
      },
      ready: function(modal, trigger) {
        $('.modal input:first').focus();
      }
    });
    window.jQuery(this.modal_edit).modal('open');
  }

  componentWillUnmount() {
    window.jQuery(this.modal_edit).modal('close');
  }

  _handleCancel(event) {
    event.preventDefault();
    this.props.modalEditUserClose();
  }

  _handleDelete(event) {
    event.preventDefault();

    let self = this;
    this.props.adminUserDelete({
      id: this.props.record_id
    })
    .then(function (info) {
      self.props.adminUserList(self.props.admin_users, {});
      self.props.modalEditUserClose();
    })
  }

  _handleUpdate(event) {
    event.preventDefault();

    let info = {
      id: this.props.record_id,
      name: this.name.value,
      email: this.email.value,
      daily_calories_max: this.daily_calories_max.value,
      role: this.role
    };

    if (this.password.value !== KEEP_SAME_PASS) {
      info.password = this.password.value;
      info.password_confirmation = this.password.value;
    }

    let self = this;
    this.props.adminUserUpdate(info)
    .then(function (info) {
      if (self.props.admin_user.error) {
        window.Materialize.toast(self.props.admin_user.error);
      }
      else if (self.props.admin_user.errors) {
      }
      else {
        self.props.adminUserList(self.props.admin_users, {});
        self.props.modalEditUserClose();
      }
    })
  }

  _handleRoleChange(event) {
    this.role = event.target.value;
  }

  render() {
    let errors = this.props.admin_user.errors;

    let input_role_html = '';

    if (this.props.user.info.role === 'ADMIN') {
      input_role_html = (
        <Input s={12} m={6}
               type='select'
               label="Role"
               defaultValue={this.props.role}
               error={errors['role'] ? "Role " + errors['role'] : ''}
               onChange={this._handleRoleChange}>
          <option value='USER'>Users</option>
          <option value='MANAGER'>Managers</option>
          <option value='ADMIN'>Admins</option>
        </Input>)
    }

    return(
<div id="modal-edit" ref="modal_edit" className="modal modal-fixed-footer">
  <form>
  <div className="modal-content">
    <h4>Edit User</h4>
    <div className="row">
      <div className="input-field col s12 m6">
        <input id="txt-daily-cal" type="number" autoFocus="true" className={"validate " + (errors['daily_calories_max'] ? "invalid" : "")} defaultValue={this.props.daily_calories_max} ref={(input) => this.daily_calories_max = input} />
        <label htmlFor="txt-daily-cal" data-error={"Goal " + errors['daily_calories_max']} className="active">Daily Calorie Goal</label>
      </div>
      <div className="input-field col s12 m6">
        <input id="txt-email" type="email" className={"validate " + (errors['email'] ? "invalid" : "")} defaultValue={this.props.email} ref={(input) => this.email = input} />
        <label htmlFor="txt-email" data-error={"Email " + errors['email']} className="active">Email</label>
      </div>
    </div>
    <div className="row">
      <div className="input-field col s12 m6">
        <input id="txt-name" type="text" className={"validate " + (errors['name'] ? "invalid" : "")} defaultValue={this.props.name} ref={(input) => this.name = input} />
        <label htmlFor="txt-name" data-error={"Name " + errors['name']} className="active">Name</label>
      </div>
      <div className="input-field col s12 m6">
        <input id="txt-password" type="password" autoComplete="new-password" className={"validate " + (errors['password'] ? "invalid" : "")} defaultValue={KEEP_SAME_PASS} ref={(input) => this.password = input} />
        <label htmlFor="txt-password" data-error={"Password " + errors['password']} className="active">Password</label>
      </div>
    </div>
    {input_role_html}
  </div>
  <div className="modal-footer">
    <Button type="submit" onClick={this._handleUpdate} className="waves-effect waves-blue btn-flat">Save</Button>
    <Button onClick={this._handleDelete} className="modal-action modal-close waves-effect waves-white btn-flat">Delete</Button>
    <Button onClick={this._handleCancel} className="modal-action modal-close waves-effect waves-white btn-flat">Cancel</Button>
  </div>
  </form>
</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    admin_user: state.admin_user,
    admin_users: state.admin_users,
    modal_edit: state.modal_edit_user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalEditUserClose: () => dispatch({type: 'MODAL_EDIT_USER_CLOSE'}),
    adminUserList: (state, args) => dispatch(adminUserList(state, args)),
    adminUserUpdate: (info) => dispatch(adminUserUpdate(info)),
    adminUserDelete: (info) => dispatch(adminUserDelete(info)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalEditUser);
