// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// api
import { userList } from '../../../reducers';

// assets
import './AdminUsers.css';
import '../../../fonts/font-awesome/css/font-awesome.css';
import iconPicture from '../../../images/cd-icon-picture.svg';
import iconMovie from '../../../images/cd-icon-movie.svg';

// libs
import $ from 'jquery';
import moment from 'moment';

// components
import ModalEditUser from './ModalEditUser/ModalEditUser';

class AdminUsers extends Component {

  constructor(props) {
    super(props);

    this._handleEditClick = this._handleEditClick.bind(this);
    this._sortTableClick = this._sortTableClick.bind(this);
    this._submitSearch = this._submitSearch.bind(this);
  }

  componentDidMount() {
    // fetch managers (if user is logged)
    if (this.props.user.info) {
      this.props.userList(this.props.users, {role: 'USER'});
    }
  }

  _submitSearch(event) {
    event.preventDefault();
    this.props.userList(this.props.users, {keyword: this.searchUsers.value});
  }

  _sortTableClick(event) {
    event.preventDefault();
    let orderBy  = $(event.target).attr('data-column');
    let orderDir = 1;

    // same column? Reverse order
    if (orderBy == this.props.users.args.orderBy) {
      orderDir = -this.props.users.args.orderDir;
    }

    // ajax
    this.props.userList(this.props.users, {orderBy: orderBy, orderDir: orderDir});
  }

  _handleEditClick(event) {
    event.preventDefault();

    let tr = $(event.target.closest('tr'));
    this.props.modalEditUserOpen(
      tr.attr('data-id'),
      tr.attr('data-name'),
      tr.attr('data-email'),
      tr.attr('data-role'),
      tr.attr('data-daily_calories_max'),
    );
  }

  render() {
    let self = this;

    // edit modal
    let modal_edit_html = '';
    if (this.props.modal_edit) {
      let modal_edit = this.props.modal_edit;
      modal_edit_html = <ModalEditUser key="-1" record_id={modal_edit.id} name={modal_edit.name} email={modal_edit.email} role={modal_edit.role} daily_calories_max={modal_edit.daily_calories_max} />;
    }

    // render API data
    let users_html = [];
    $.each(this.props.users.info, function(key, value) {
      users_html.push(<tr key={'admin_user_' + key} data-id={value.id} data-name={value.name} data-email={value.email} data-role={value.role} data-daily_calories_max={value.daily_calories_max} onClick={self._handleEditClick}>
        <td>{value.name}</td>
        <td>{value.email}</td>
        <td>{value.daily_calories_max}</td>
      </tr>);
    });

    // sort icons
    let sort_html = {};
    let direction_html = (<i className="fa fa-sort-amount-desc" />);
    if (this.props.users.args.orderDir == 1) {
      direction_html = (<i className="fa fa-sort-amount-asc" />)
    };
    sort_html[this.props.users.args.orderBy] = direction_html;


    return (
<div style={{paddingTop: '25px'}} className="AdminUsers container">
  {modal_edit_html}

  <div className="row">
    <form className="col s12 input-field" onSubmit={this._submitSearch}>
      <i className="material-icons prefix circle left">search</i>
      <input id="txt-search-users" autoFocus="true" className="browser-default" ref={(input) => this.searchUsers = input} />
      <label htmlFor="txt-search-users" className="active">Search</label>
    </form>
  </div>


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
    modal_edit: state.modal_edit_user,
    users: state.users,
    user: state.user,
    admin_user: state.admin_user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalEditUserOpen: (id, name, email, role, daily_calories_max) => dispatch({type: 'MODAL_EDIT_USER_OPEN', id: id, name: name, email: email, role: role, daily_calories_max: daily_calories_max}),
    userList: (state, args) => dispatch(userList(state, args)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUsers);
