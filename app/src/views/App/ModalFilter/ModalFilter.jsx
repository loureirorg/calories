// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-materialize';

// api
import { mealFilter } from '../../../reducers';

// libs
import $ from 'jquery';
import moment from 'moment';

class ModalFilter extends Component {

  constructor(props) {
    super(props);
    this._cancel = this._cancel.bind(this);
    this._submit = this._submit.bind(this);
  }

  componentDidMount() {
    const { modal_filter } = this.refs;
    this.modal_filter = modal_filter;

    let self = this;
    window.jQuery(this.modal_filter).modal({
      dismissible: true,
      complete: function() {
        self.props.modalFilterClose();
      },
      ready: function(modal, trigger) {
        $('.modal input:first').focus();
      }
    });
    window.jQuery(this.modal_filter).modal('open');
  }

  componentWillUnmount() {
    window.jQuery(this.modal_filter).modal('close');
  }

  _cancel(event) {
    event.preventDefault();
    this.props.modalFilterClose();
  }

  _submit(event) {
    event.preventDefault();

    let self = this;
    this.props.mealFilter(
      this.date_from.value,
      this.date_to.value,
      this.time_from.value,
      this.time_to.value
    )
    .then(function (info) {
      self.props.modalFilterClose();
    })
  }

  render() {
    return(
<div id="modal-filter" ref="modal_filter" className="modal modal-fixed-footer">
  <form>
    <div className="modal-content">
      <h4>Filter</h4>
      <div className="row">
        <div className="input-field col s12 m6">
          <input id="txt-date-from" type="date" autoFocus="true" className="validate" defaultValue={this.props.modal_filter.args.date_from} ref={(input) => this.date_from = input} />
          <label htmlFor="txt-date-from" className="active">Date From</label>
        </div>
        <div className="input-field col s12 m6">
          <input id="txt-date-to" type="date" className="validate" defaultValue={this.props.modal_filter.args.date_to} ref={(input) => this.date_to = input} />
          <label htmlFor="txt-date-to" className="active">Date To</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12 m6">
          <input id="txt-time-from" type="time" className="validate" defaultValue={this.props.modal_filter.args.time_from} ref={(input) => this.time_from = input} />
          <label htmlFor="txt-time-from" className="active">Time From</label>
        </div>
        <div className="input-field col s12 m6">
          <input id="txt-time-to" type="time" className="validate" defaultValue={this.props.modal_filter.args.time_to} ref={(input) => this.time_to = input} />
          <label htmlFor="txt-time-to" className="active">Time To</label>
        </div>
      </div>
    </div>
    <div className="modal-footer">
      <Button type="submit" onClick={this._submit} className="waves-effect waves-blue btn-flat">Filter</Button>
      <Button onClick={this._cancel} className="modal-action modal-close waves-effect waves-white btn-flat">Cancel</Button>
    </div>
  </form>
</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modal_filter: state.modal_filter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalFilterClose: () => dispatch({type: 'MODAL_FILTER_CLOSE'}),
    mealFilter: (date_from, date_to, time_from, time_to) => dispatch(mealFilter(date_from, date_to, time_from, time_to)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalFilter);
