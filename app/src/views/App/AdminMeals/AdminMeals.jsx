// core
import React, { Component } from 'react';
import { connect } from 'react-redux';

// api
import { adminMealList } from '../../../reducers';

// assets
import './AdminMeals.css';

// libs
import $ from 'jquery';

// components
import ModalEdit from '../ModalEdit/ModalEdit';

class AdminMeals extends Component {
  constructor(props) {
    super(props);

    this._handleEditClick = this._handleEditClick.bind(this);
    this._sortTableClick = this._sortTableClick.bind(this);
    this._submitSearch = this._submitSearch.bind(this);
  }

  componentDidMount() {
    this.props.adminMealList(this.props.admin_meals, {});
  }

  _submitSearch(event) {
    event.preventDefault();
    this.props.adminMealList(this.props.admin_meals, {keyword: this.searchMeals.value});
  }

  _sortTableClick(event) {
    event.preventDefault();

    let orderBy  = $(event.target).attr('data-column');
    let orderDir = 1;

    // same column? Reverse order
    if (orderBy === this.props.admin_meals.args.orderBy) {
      orderDir = -this.props.admin_meals.args.orderDir;
    }

    // ajax
    this.props.adminMealList(this.props.admin_meals, {orderBy: orderBy, orderDir: orderDir});
  }

  _handleEditClick(event) {
    event.preventDefault();

    let tr = $(event.target.closest('tr'));
    this.props.modalEditOpen({
      id: tr.attr('data-id'),
      cal: tr.attr('data-cal'),
      title: tr.attr('data-title'),
      date: tr.attr('data-date'),
      time: tr.attr('data-time'),
    });
  }

  render() {
    let self = this;

    // edit modal
    let modal_edit_html = '';
    if (this.props.modal_edit) {
      let modal_edit = this.props.modal_edit;
      modal_edit_html = <ModalEdit key="-1" record_id={modal_edit.id} cal={modal_edit.cal} date={modal_edit.date} time={modal_edit.time} title={modal_edit.title} />;
    }

    // render API data
    let meals_html = [];
    $.each(this.props.admin_meals.info, function(key, value) {
      meals_html.push(<tr key={'admin_meal_' + key} data-id={value.id} data-cal={value.calories} data-date={value.eat_date} data-time={value.eat_time} data-title={value.title} onClick={self._handleEditClick}>
        <td>{value.eat_date}</td>
        <td>{value.eat_time}</td>
        <td>{value.title}</td>
        <td>{value.calories}</td>
      </tr>);
    });

    // sort icons
    let sort_html = {};
    let direction_html = (<i className="fa fa-sort-amount-desc" />);
    if (this.props.admin_meals.args.orderDir === 1) {
      direction_html = (<i className="fa fa-sort-amount-asc" />)
    };
    sort_html[this.props.admin_meals.args.orderBy] = direction_html;


    return (
<div style={{paddingTop: '25px'}} className="AdminMeals container">
  {modal_edit_html}

  <div className="row">
    <div className="col s12">
      <form className="input-field" onSubmit={this._submitSearch}>
        <i className="material-icons prefix circle left">search</i>
        <input id="txt-search-meals" autoFocus="true" className="browser-default" ref={(input) => this.searchMeals = input} />
        <label htmlFor="txt-search-meals" className="active">Search</label>
      </form>
    </div>
  </div>


  <div className="row">
    <div className="col s12">
      <table style={{backgroundColor: 'white'}} className="striped responsive-table admin-table">
        <thead>
          <tr>
            <th data-column='date' onClick={this._sortTableClick}>{sort_html['date']} Date</th>
            <th data-column='time' onClick={this._sortTableClick}>{sort_html['time']} Time</th>
            <th data-column='title' onClick={this._sortTableClick}>{sort_html['title']}Title</th>
            <th data-column='calories' onClick={this._sortTableClick}>{sort_html['calories']}Calories</th>
          </tr>
        </thead>
        <tbody>
        {meals_html}
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
    meal: state.meal,
    admin_meals: state.admin_meals,
    modal_edit: state.modal_edit,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalEditOpen: (info) => dispatch({type: 'MODAL_EDIT_OPEN', info: info}),
    adminMealList: (state, args) => dispatch(adminMealList(state, args)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminMeals);
