// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input } from 'react-materialize';

// api
import { adminUserList } from '../../../reducers';

// assets
import './AdminUsers.css';
import '../../../fonts/font-awesome/css/font-awesome.css';

// libs
import $ from 'jquery';

// components
import ModalEditUser from './ModalEditUser/ModalEditUser';

class AdminUsers extends Component {
  constructor(props) {
    super(props);

    this._handleEditClick = this._handleEditClick.bind(this);
    this._sortTableClick = this._sortTableClick.bind(this);
    this._submitSearch = this._submitSearch.bind(this);
    this._handleRoleChange = this._handleRoleChange.bind(this);
  }

  componentDidMount() {
    // fetch data
    let role;
    switch (this.props.location.pathname) {
      case '/admin/users': role = 'USER'; break;
      case '/admin/managers': role = 'MANAGER'; break;
      case '/admin/admins': role = 'ADMIN'; break;
      default: role = 'USER'; break;
    }
    this.props.adminUserList(this.props.admin_users, {role: role});
  }

  _handleRoleChange(event) {
    event.preventDefault();

    // change role, change page
    switch (event.target.value) {
    case 'USER': this.props.history.push('/admin/users'); break;
    case 'MANAGER': this.props.history.push('/admin/managers'); break;
    case 'ADMIN': this.props.history.push('/admin/admins'); break;
    default: break;
    }
    this.props.adminUserList(this.props.admin_users, {role: event.target.value});
  }

  _submitSearch(event) {
    event.preventDefault();
    this.props.adminUserList(this.props.admin_users, {keyword: this.searchUsers.value});
  }

  _sortTableClick(event) {
    event.preventDefault();
    let orderBy  = $(event.target).attr('data-column');
    let orderDir = 1;

    // same column? Reverse order
    if (orderBy === this.props.admin_users.args.orderBy) {
      orderDir = -this.props.admin_users.args.orderDir;
    }

    // ajax
    this.props.adminUserList(this.props.admin_users, {orderBy: orderBy, orderDir: orderDir});
  }

  _handleEditClick(event) {
    event.preventDefault();

    let tr = $(event.target.closest('tr'));
    this.props.modalEditUserOpen({
      id: tr.attr('data-id'),
      name: tr.attr('data-name'),
      email: tr.attr('data-email'),
      role: tr.attr('data-role'),
      daily_calories_max: tr.attr('data-daily_calories_max'),
    });
  }

  render() {
    let self = this;

    // role selector
    let role;
    switch (this.props.location.pathname) {
      case '/admin/users': role = 'USER'; break;
      case '/admin/managers': role = 'MANAGER'; break;
      case '/admin/admins': role = 'ADMIN'; break;
      default: role = 'USER'; break;
    }

    // edit modal
    let modal_edit_html = '';
    if (this.props.modal_edit) {
      let modal_edit = this.props.modal_edit;
      modal_edit_html = <ModalEditUser key="-1" record_id={modal_edit.id} name={modal_edit.name} email={modal_edit.email} role={modal_edit.role} daily_calories_max={modal_edit.daily_calories_max} />;
    }

    // render API data
    let users_html = [];
    $.each(this.props.admin_users.info, function(key, value) {
      users_html.push(<tr key={'admin_user_' + key} data-id={value.id} data-name={value.name} data-email={value.email} data-role={value.role} data-daily_calories_max={value.daily_calories_max} onClick={self._handleEditClick}>
        <td>{value.name}</td>
        <td>{value.email}</td>
        <td>{value.daily_calories_max}</td>
      </tr>);
    });

    // sort icons
    let sort_html = {};
    let direction_html = (<i className="fa fa-sort-amount-desc" />);
    if (this.props.admin_users.args.orderDir === 1) {
      direction_html = (<i className="fa fa-sort-amount-asc" />)
    };
    sort_html[this.props.admin_users.args.orderBy] = direction_html;

    // search bar: ADMIN has a "role" input
    let search_bar_html = '';
    if (this.props.user.info.role === 'ADMIN') {
      search_bar_html = (
        <div className="row">
          <div className="col s12 m8">
            <form className="input-field" onSubmit={this._submitSearch}>
              <i className="material-icons prefix circle left">search</i>
              <input id="txt-search-users" autoFocus="true" className="browser-default" ref={(input) => this.searchUsers = input} />
              <label htmlFor="txt-search-users" className="active">Search</label>
            </form>
          </div>

        	<Input s={12} m={4} type='select' label="Role" defaultValue={role} onChange={this._handleRoleChange}>
        		<option value='USER'>Users</option>
        		<option value='MANAGER'>Managers</option>
        		<option value='ADMIN'>Admins</option>
        	</Input>
        </div>
      );
    }
    else {
      search_bar_html = (
        <div className="row">
          <div className="col s12 m12">
            <form className="input-field" onSubmit={this._submitSearch}>
              <i className="material-icons prefix circle left">search</i>
              <input id="txt-search-users" autoFocus="true" className="browser-default" ref={(input) => this.searchUsers = input} />
              <label htmlFor="txt-search-users" className="active">Search</label>
            </form>
          </div>
        </div>
      );
    }

    return (
<div style={{paddingTop: '25px'}} className="AdminUsers container">
  {modal_edit_html}

  {search_bar_html}

  <div className="row">
    <div className="col s12">
      <table style={{backgroundColor: 'white'}} className="striped responsive-table admin-table">
        <thead>
          <tr>
            <th data-column='name' onClick={this._sortTableClick}>{sort_html['name']} Name</th>
            <th data-column='email' onClick={this._sortTableClick}>{sort_html['email']} Email</th>
            <th data-column='daily_calories_max' onClick={this._sortTableClick}>{sort_html['daily_calories_max']}Cal. Limit</th>
          </tr>
        </thead>
        <tbody>
        {users_html}
        </tbody>
      </table>
    </div>
  </div>
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
    modalEditUserOpen: (info) => dispatch({type: 'MODAL_EDIT_USER_OPEN', info: info}),
    adminUserList: (state, args) => dispatch(adminUserList(state, args)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUsers);
