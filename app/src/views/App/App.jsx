// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, Redirect, Switch } from 'react-router-dom';
import { Button } from 'react-materialize';

// api
import { signOut } from '../../reducers';

// sub-pages / components
import ModalAdd from './ModalAdd/ModalAdd';
import ModalAddUser from './ModalAddUser/ModalAddUser';
import ModalSettings from './ModalSettings/ModalSettings';
import ModalFilter from './ModalFilter/ModalFilter';
import Dashboard from './Dashboard/Dashboard';
import AdminUsers from './AdminUsers/AdminUsers';

// assets
import './App.css';
import defaultUserImage from '../../images/default-user.png';

// libs
// import { $ } from 'jquery';
import moment from 'moment';

class App extends Component {

  constructor(props) {
    super(props);
    this._handleAddClick = this._handleAddClick.bind(this);
    this._handleSettingsClick = this._handleSettingsClick.bind(this);
    this._handleFilterClick = this._handleFilterClick.bind(this);
    this._handleSignOutClick = this._handleSignOutClick.bind(this);
  }

  _handleAddClick(event) {
    event.preventDefault();
    if (this.props.location.pathname === '/dashboard') {
      this.props.modalAddOpen();
    }
    else {
      this.props.modalAddUserOpen();
    }
  }

  _handleSettingsClick(event) {
    event.preventDefault();
    window.jQuery(this.button_collapse_nav).sideNav('hide');
    this.props.modalSettingsOpen();
  }

  _handleFilterClick(event) {
    event.preventDefault();
    window.jQuery(this.button_collapse_nav).sideNav('hide');
    this.props.modalFilterOpen();
  }

  _handleSignOutClick(event) {
    event.preventDefault();
    window.jQuery(this.button_collapse_nav).sideNav('hide');
    this.props.signOut();
  }

  componentWillUnmount() {
    if (this.button_collapse_nav) {
      window.jQuery(this.button_collapse_nav).sideNav('destroy');
    }
  }

  componentDidMount() {
    const { button_collapse_nav } = this.refs;
    this.button_collapse_nav = button_collapse_nav;

    // Not always this component exists
    if (this.button_collapse_nav) {
      window.jQuery(this.button_collapse_nav).sideNav();
    }
  }

  render() {
    // not logged in
    if (! this.props.user.info) {
      return (<Redirect to="/" />);
    }

    let modal_add_html = '';
    if (this.props.modal_add) {
      modal_add_html = <ModalAdd key="modal-add" />;
    }

    let modal_add_user_html = '';
    if (this.props.modal_add_user) {
      modal_add_user_html = <ModalAddUser key="modal-add-user" />;
    }

    let modal_settings_html = '';
    if (this.props.modal_settings) {
      modal_settings_html = <ModalSettings key="modal-settings" />;
    }

    let modal_filter_html = '';
    if (this.props.modal_filter.opened) {
      modal_filter_html = <ModalFilter key="modal-filter" />;
    }

    let loading_html = '';
    if ((this.props.user.isFetching) || (this.props.meals.isFetching)) {
      loading_html = (
        <div className="progress">
          <div className="indeterminate orange"></div>
        </div>);
    }

    // only displays calories on dashboard page
    let title_html = '';
    if (this.props.location.pathname === '/dashboard') {
      let sum = 0; // calories
      let today_meals = this.props.meals.info[moment().format('YYYY-MM-DD')];
      if (today_meals) {
        today_meals.meals.forEach(function(num) { sum += parseInt(num[2], 10) || 0 })
      }
      title_html = (<span className="brand-logo center"><b>{sum.toLocaleString()}</b> calories out of <b>{this.props.user.info.daily_calories_max.toLocaleString()}</b></span>);
    }
    else {
      if (this.props.location.pathname === '/admin/users') {
        title_html = (<span className="brand-logo center"><b>Users</b></span>);
      }

      // if (this.props.user.info.role === 'MANAGER') {
      //   title_html = (<span className="brand-logo center"><b>Management</b></span>);
      // }
      // else if (this.props.user.info.role === 'ADMIN') {
      //   title_html = (<span className="brand-logo center"><b>Administration</b></span>);
      // }
    }

    // menu changes according role
    let menu_options_html = [];
    menu_options_html.push(
      <li key="mi_1"><div className="userView">
        <div className="background blue"></div>
        <a href="#" className="center" style={{display: 'inline-flex'}}><img className="circle center" src={defaultUserImage} /></a>
        <a href="#"><span className="white-text name">{this.props.user.info.name}</span></a>
        <a href="#"><span className="white-text email">{this.props.user.info.email}</span></a>
      </div></li>
    );

    if (this.props.user.info.role === 'USER') {
      menu_options_html.push(<li key="mi_2"><Link to="/filter" onClick={this._handleFilterClick}>Filter</Link></li>);
      menu_options_html.push(<li key="mi_3"><Link to="/settings" onClick={this._handleSettingsClick}>Settings</Link></li>);
      menu_options_html.push(<li key="mi_4"><Link to="/logout" onClick={this._handleSignOutClick}>Logout</Link></li>);
    }
    else {
      if (this.props.user.info.role === 'ADMIN') {
        menu_options_html.push(<li key="mi_5"><a className="waves-effect" href="#!">Administrators</a></li>);
        menu_options_html.push(<li key="mi_6"><a className="waves-effect" href="#!">Managers</a></li>);
        menu_options_html.push(<li key="mi_7"><a className="waves-effect" href="#!">Meals</a></li>);
      }

      menu_options_html.push(<li key="mi_8"><a className="waves-effect" href="#!">Users</a></li>);
      menu_options_html.push(<li key="mi_9"><Link to="/logout" onClick={this._handleSignOutClick}>Logout</Link></li>);
    }

    return (
<div className="App">
  <div style={{minHeight: '100vh'}}>

    <div className="navbar-fixed">
      <nav style={{backgroundColor: '#0172FF'}}>
        <div className="nav-wrapper">
          {title_html}
          <ul className="right hide-on-small-only" style={{paddingRight: '24px'}}>
            <li><Button onClick={this._handleAddClick} className="btn waves-effect waves-light orange">Add</Button></li>
          </ul>

          {/* MOBILE MENU */}
          {/* <SideNav trigger={<a href="#" className="left" style={{paddingLeft: '24px'}}><i className="material-icons">menu</i></a>} options={{ closeOnClick: true }}>
            <SideNavItem className="left"><i className="material-icons left">search</i> Filter</SideNavItem>
            <SideNavItem className="left"><i className="material-icons left">search</i> Settings</SideNavItem>
            <SideNavItem href="/" className="left"><i className="material-icons left">search</i> Logout</SideNavItem>
          </SideNav> */}
          <a href="#" data-activates="slide-out" className="left button-collapse-nav" ref="button_collapse_nav" style={{paddingLeft: '24px'}}><i className="material-icons">menu</i></a>
          <ul id="slide-out" className="side-nav">
            {menu_options_html}
          </ul>
          {loading_html}
        </div>
      </nav>
    </div>

    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin/users" component={AdminUsers} />
    </Switch>

    <div className="fixed-action-btn hide-on-med-and-up">
      <Link className="btn-floating btn-large red" to="#" onClick={this._handleAddClick}>
        <i className="large material-icons">add</i>
      </Link>
    </div>

    {/* MODALS */}
    {modal_add_html}
    {modal_add_user_html}
    {modal_settings_html}
    {modal_filter_html}

  </div>

</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modal_add: state.modal_add,
    modal_add_user: state.modal_add_user,
    modal_settings: state.modal_settings,
    modal_filter: state.modal_filter,
    user: state.user,
    meals: state.meals
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalAddOpen: () => dispatch({type: 'MODAL_ADD_OPEN'}),
    modalAddUserOpen: () => dispatch({type: 'MODAL_ADD_USER_OPEN'}),
    modalSettingsOpen: () => dispatch({type: 'MODAL_SETTINGS_OPEN'}),
    modalFilterOpen: () => dispatch({type: 'MODAL_FILTER_OPEN'}),
    signOut: () => dispatch(signOut()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
