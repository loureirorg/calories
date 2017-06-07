// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-materialize';

// api
import { mealUpdate, mealDelete, mealList } from '../../../reducers';

// libs
import $ from 'jquery';

class ModalEdit extends Component {

  constructor(props) {
    super(props);

    // binding
    this._handleCancel = this._handleCancel.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._handleUpdate = this._handleUpdate.bind(this);
  }

  componentDidMount() {
    const { modal_edit } = this.refs;
    this.modal_edit = modal_edit;

    let self = this;

    window.jQuery(this.modal_edit).modal({
      dismissible: true,
      complete: function() {
        self.props.modalEditClose();
      },
      ready: function(modal, trigger) {
        $('.modal input:first').focus();

        // $('.datepicker').pickadate({
        //   selectMonths: true, // Creates a dropdown to control month
        //   selectYears: 15 // Creates a dropdown of 15 years to control year
        // });
        // $('.picker').appendTo('body');
        //
        // document.getElementById("txt-date").valueAsDate = new Date();
        // $('#txt-time').val(moment().format('HH:mm'));
      }
    });
    window.jQuery(this.modal_edit).modal('open');
  }

  componentWillUnmount() {
    window.jQuery(this.modal_edit).modal('close');
  }

  _handleCancel(event) {
    event.preventDefault();
    this.props.modalEditClose();
  }

  _handleDelete(event) {
    event.preventDefault();

    let self = this;
    this.props.mealDelete({
      id: this.props.record_id
    })
    .then(function (info) {
      self.props.mealList();
      self.props.modalEditClose();
    })
  }

  _handleUpdate(event) {
    event.preventDefault();

    let self = this;
    this.props.mealUpdate({
      id: this.props.record_id,
      title: this.title.value,
      calories: this.cal.value,
      eat_date: this.date.value,
      eat_time: this.time.value
    })
    .then(function (info) {
      self.props.mealList();
      self.props.modalEditClose();
    })
  }

  render() {
    return(
<div id="modal-edit" ref="modal_edit" className="modal modal-fixed-footer">
  <form>
  <div className="modal-content">
    <h4>Edit Meal</h4>
    <div className="row">
      <div className="input-field col s12 m6">
        <input id="txt-title" type="text" autoFocus="true" className="validate" defaultValue={this.props.title} ref={(input) => this.title = input} />
        <label htmlFor="txt-title" className="active">Description</label>
      </div>
      <div className="input-field col s12 m6">
        <input id="txt-calories" type="number" className="validate" defaultValue={this.props.cal} ref={(input) => this.cal = input} />
        <label htmlFor="txt-calories" className="active">Calories</label>
      </div>
    </div>
    <div className="row">
      <div className="input-field col s12 m6">
        <input id="txt-date" type="date" className="datepicker2" defaultValue={this.props.date} ref={(input) => this.date = input} />
        <label htmlFor="txt-date" className="active">Date</label>
      </div>
      <div className="input-field col s12 m6">
        <input id="txt-time" type="time" className="validate" defaultValue={this.props.time} ref={(input) => this.time = input} />
        <label htmlFor="txt-time" className="active">Time</label>
      </div>
    </div>
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
    meal: state.meal
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalEditClose: () => dispatch({type: 'MODAL_EDIT_CLOSE'}),
    mealList: () => dispatch(mealList()),
    mealUpdate: (info) => dispatch(mealUpdate(info)),
    mealDelete: (info) => dispatch(mealDelete(info)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalEdit);
