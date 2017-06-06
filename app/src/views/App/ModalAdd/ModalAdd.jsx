// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-materialize';

// api
import { mealCreate, mealList } from '../../../reducers';

// libs
import $ from 'jquery';
import moment from 'moment';

class ModalAdd extends Component {

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
        self.props.modalAddClose();
      },
      ready: function(modal, trigger) {
        $('.modal input:first').focus();

        // $('.datepicker').pickadate({
        //   selectMonths: true, // Creates a dropdown to control month
        //   selectYears: 15 // Creates a dropdown of 15 years to control year
        // });
        // $('.picker').appendTo('body');

        $('#txt-date').val(moment().format('YYYY-MM-DD'));
        $('#txt-time').val(moment().format('HH:mm'));
      }
    });
    window.jQuery(this.modal_add).modal('open');
  }

  componentWillUnmount() {
    window.jQuery(this.modal_add).modal('close');
  }

  _handleCancel(event) {
    event.preventDefault();
    this.props.modalAddClose();
  }

  _handleCreate(event) {
    event.preventDefault();

    let self = this;
    this.props.mealCreate({
      title: this.title.value,
      calories: this.cal.value,
      eat_date: this.date.value,
      eat_time: this.time.value
    })
    .then(function (info) {
      self.props.mealList();
      self.props.modalAddClose();
    })
  }

  render() {
    return(
<div id="modal-add" ref="modal_add" className="modal modal-fixed-footer">
  <form>
  <div className="modal-content">
    <h4>New Meal</h4>
    <div className="row">
      <div className="input-field col s12 m6">
        <input id="txt-title" type="text" autoFocus="true" className="validate" ref={(input) => this.title = input} />
        <label htmlFor="txt-title" className="active">Description</label>
      </div>
      <div className="input-field col s12 m6">
        <input id="txt-calories" type="number" className="validate" ref={(input) => this.cal = input} />
        <label htmlFor="txt-calories">Calories</label>
      </div>
    </div>
    <div className="row">
      <div className="input-field col s12 m6">
        <input id="txt-date" type="date" className="datepicker2" ref={(input) => this.date = input} />
        <label htmlFor="txt-date" className="active">Date</label>
      </div>
      <div className="input-field col s12 m6">
        <input id="txt-time" type="time" className="validate" ref={(input) => this.time = input} />
        <label htmlFor="txt-time" className="active">Time</label>
      </div>
    </div>
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
    meal: state.meal
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalAddClose: () => dispatch({type: 'MODAL_ADD_CLOSE'}),
    mealList: () => dispatch(mealList()),
    mealCreate: (info) => dispatch(mealCreate(info)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalAdd);
