import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { mealList } from '../../../reducers';

// assets
import './Dashboard.css';
import iconPicture from '../../../images/cd-icon-picture.svg';
// import iconMovie from '../../../images/cd-icon-movie.svg';

// libs
import $ from 'jquery';
import moment from 'moment';

// components
import ModalEdit from '../ModalEdit/ModalEdit';


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._closeFilterDialog = this._closeFilterDialog.bind(this);
    this._checkTodayClock = this._checkTodayClock.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.checkTodayTimeout);
  }

  // if day has changed, refresh header
  _checkTodayClock() {
    let today = moment().format('YYYY-MM-DD');
    if (today !== this.lastTime) {
      this.props.mealList();
    }
    this.lastTime = today;
    this.checkTodayTimeout = setTimeout(this._checkTodayClock, 1000);
  }

  componentDidMount() {
    // fetch meals only after being logged in
    if (this.props.user.info) {
      this.props.mealList();
    }

    // if day has changed, refresh header
    this.lastTime = moment().format('YYYY-MM-DD');
    this.checkTodayTimeout = setTimeout(this._checkTodayClock, 1000);
  }

  _handleEditClick(event) {
    event.preventDefault();

    let row = $(event.target.closest('.row'));
    this.props.modalEditOpen({
      id: row.attr('data-id'),
      cal: row.attr('data-cal'),
      title: row.attr('data-title'),
      date: row.attr('data-date'),
      time: row.attr('data-time')
    });
  }

  _closeFilterDialog(event) {
    event.preventDefault();

    this.props.filterDialogClose();
    this.props.mealList();
  }

  render() {
    let self = this;

    // edit modal
    let modal_edit_html = '';
    if (this.props.modal_edit) {
      let modal_edit = this.props.modal_edit;
      modal_edit_html = <ModalEdit key="-1" record_id={modal_edit.id} cal={modal_edit.cal} date={modal_edit.date} time={modal_edit.time} title={modal_edit.title} />;
    }

    // filter dialog
    let filter_dialog_html = '';
    if (this.props.filter_dialog) {
      // date string
      let date_str = false;
      if ((! this.props.filter_dialog.date_from) && (this.props.filter_dialog.date_to)) {
        date_str = 'Before ' + moment(this.props.filter_dialog.date_to).format('LL');
      }
      else if ((this.props.filter_dialog.date_from) && (! this.props.filter_dialog.date_to)) {
        date_str = 'After ' + moment(this.props.filter_dialog.date_from).format('LL');
      }
      else if ((this.props.filter_dialog.date_from) && (this.props.filter_dialog.date_to)) {
        date_str = moment(this.props.filter_dialog.date_from).format('LL') + ' to ' + moment(this.props.filter_dialog.date_to).format('LL');
      }
      if (date_str) {
        date_str = (
          <tr>
            <td><b>Date:</b></td>
            <td>{date_str}</td>
          </tr>
        );
      }

      // time string
      let time_str = false;
      if ((! this.props.filter_dialog.time_from) && (this.props.filter_dialog.time_to)) {
        time_str = 'Before ' + moment(this.props.filter_dialog.time_to, ["HH:mm"]).format("hh:mm A");
      }
      else if ((this.props.filter_dialog.time_from) && (! this.props.filter_dialog.time_to)) {
        time_str = 'After ' + moment(this.props.filter_dialog.time_from, ["HH:mm"]).format("hh:mm A");
      }
      else if ((this.props.filter_dialog.time_from) && (this.props.filter_dialog.time_to)) {
        time_str = moment(this.props.filter_dialog.time_from, ["HH:mm"]).format("hh:mm A") + ' to ' + moment(this.props.filter_dialog.time_to, ["HH"]).format("hh A");
      }
      if (time_str) {
        time_str = (
          <tr>
            <td><b>Time:</b></td>
            <td>{time_str}</td>
          </tr>
        );
      }

      filter_dialog_html = (
<div className="chip green" style={{width: '100%', height: '100%'}}>
  <div className="row" style={{marginBottom: '5px', marginTop: '10px'}}>
    <div className="col s12">
      <i className="material-icons white-text left" style={{fontSize: '26px', marginTop: '7px'}}>search</i>
      <i className="material-icons white-text right close" style={{marginTop: '0px'}} onClick={this._closeFilterDialog}>close</i>
      <h6 className="white-text" style={{fontSize: '18px'}}><b>Filter:</b></h6>
    </div>
  </div>
  <div className="row center" style={{display: 'flex', justifyContent: 'center'}}>
    <div className="col">
      <table className="filter-well">
        <tbody>
          {date_str}
          {time_str}
        </tbody>
      </table>
    </div>
  </div>
</div>
      );
    }


    // meals - render API data
    let meals_html = [];
    $.each(this.props.meals.info, function(key, value) {
      // lines
      let items_html = [];
      $.each(value.meals, function(index, data) {
        items_html.push(
        <div className="row items" key={"meal_" + data[0]} data-id={data[0]} data-date={key} data-time={data[1]} data-cal={data[2]} data-title={data[3]}>
          <div className="col s1 m1 left-align">
            <Link to={"/edit/" + data[0]} onClick={self._handleEditClick}><i className="material-icons">settings</i></Link>
          </div>
          <div className="col s5 m2 left-align">
            <span>{moment(data[1], ["HH:mm"]).format("hh:mm A")}: </span>
          </div>
          <div className="col s6 m2 right-align">
            <span>{data[2].toLocaleString()} cal</span>
          </div>
          <div className="col s12 m7 left-align">
            <span>{data[3]}</span>
          </div>
        </div>
        );
      });

      // summary
      let sum = 0; // calories
      value.meals.forEach(function(num) { sum += parseInt(num[2], 10) || 0 })
      let summary = { cal: sum, meals: value.meals.length };

      let red_green = summary.cal > self.props.user.info.daily_calories_max ? "cd-movie" : "cd-picture";
      let day = moment(key).format('LL');
      let title = key === moment().format('YYYY-MM-DD') ? 'Today ('+ day +')' : day;

      meals_html.push(
        <div key={key} className="cd-timeline-block">
          <div className={"cd-timeline-img " + red_green}>
            <img src={iconPicture} alt="" />
          </div>

          <div className="cd-timeline-content">
            <div className="row hide-on-large-only" style={{paddingLeft: '12px', marginBottom: '10px'}}>
              <div className="s12">
                <h2>{title}</h2>
              </div>
            </div>
            {items_html}
            <div className="hide-on-large-only">
              <hr />
              <ul>
                <li><b>Calories:</b> {summary.cal.toLocaleString()}</li>
                <li><b>Meals:</b> {summary.meals}</li>
              </ul>
            </div>
            <div className="cd-date hide-on-med-and-down">
              <h3>{title}:</h3>
              <ul>
                <li>Calories: {summary.cal.toLocaleString()}</li>
                <li>Meals: {summary.meals}</li>
              </ul>
            </div>
          </div>
        </div>
      );
    });

    // no meals
    if (meals_html.length === 0) {
      meals_html = (
        <div className="valign-wrapper" style={{height: '50vh'}}>
          <p className="no-meals">- No meals -</p>
        </div>
      );
    }
    else {
      meals_html = (
        <section id="cd-timeline">
          {meals_html}
        </section>
      );
    }

    return (
<div style={{paddingTop: '25px'}} className="Dashboard container">
  {modal_edit_html}
  {filter_dialog_html}
  {meals_html}
</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modal_edit: state.modal_edit,
    user: state.user,
    meals: state.meals,
    filter_dialog: state.filter_dialog
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalEditOpen: (info) => dispatch({type: 'MODAL_EDIT_OPEN', info: info}),
    mealList: () => dispatch(mealList()),
    filterDialogClose: () => dispatch({type: 'FILTER_DIALOG_CLOSE'})
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
