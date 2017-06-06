// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// api
import { userList } from '../../../reducers';

// assets
import './AdminManagers.css';
import iconPicture from '../../../images/cd-icon-picture.svg';
import iconMovie from '../../../images/cd-icon-movie.svg';

// libs
import $ from 'jquery';
import moment from 'moment';

// components
import ModalEditUser from './ModalEditUser/ModalEditUser';

class AdminManagers extends Component {

  constructor(props) {
    super(props);
    this._handleEditClick = this._handleEditClick.bind(this);
  }

  componentDidMount() {
    // fetch managers (if user is logged)
    if (this.props.user.info) {
      this.props.userList('USER');
    }
  }

  _handleEditClick(event) {
    event.preventDefault();

    let row = $(event.target.closest('.row'));
    this.props.modalEditOpen(
      row.attr('data-id'),
      row.attr('data-name'),
      row.attr('data-email'),
    );
  }

  render() {
    let self = this;

    // edit modal
    let modal_edit_html = '';
    if (this.props.modal_edit) {
      let modal_edit = this.props.modal_edit;
      modal_edit_html = <ModalEditUser key="-1" record_id={modal_edit.id} name={modal_edit.name} email={modal_edit.email} />;
    }

    // render API data
    let managers_html = [];
    $.each(this.props.users.info, function(key, value) {
      console.log(value);
    });


    return (
<div style={{paddingTop: '25px'}} className="AdminManagers container">
  {modal_edit_html}
  {managers_html}
</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modal_edit_user: state.modal_edit_user,
    users: state.users,
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalEditOpen: (info) => dispatch({type: 'USER_MODAL_EDIT_OPEN', info: info}),
    userList: (role) => dispatch(userList(role)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminManagers);
