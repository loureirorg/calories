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
import AdminMeals from './AdminMeals/AdminMeals';
import PageLoading from '../PageLoading/PageLoading';

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
    this._handleNavItemClick = this._handleNavItemClick.bind(this);
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

  _handleNavItemClick(event) {
    window.jQuery(this.button_collapse_nav).sideNav('hide');
  }

  componentWillUnmount() {
    const { button_collapse_nav } = this.refs;
    this.button_collapse_nav = button_collapse_nav;

    if (this.button_collapse_nav) {
      window.jQuery(this.button_collapse_nav).sideNav('destroy');
    }
  }

  componentDidUpdate() {
    const { button_collapse_nav } = this.refs;
    this.button_collapse_nav = button_collapse_nav;

    // Not always this component exists
    if (this.button_collapse_nav) {
      window.jQuery(this.button_collapse_nav).sideNav();
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
      if (this.props.user.isFetching) {
        return(<PageLoading />)
      }
      return (<Redirect to="/" />);
    }

    // permissions
    switch (this.props.user.info.role) {
      case 'USER':
        if (this.props.location.pathname.startsWith('/admin/')) {
          return (<Redirect to="/dashboard" />);
        }
        break

      case 'MANAGER':
        if (this.props.location.pathname !== '/admin/users') {
          return (<Redirect to="/admin/users" />);
        }
        break

      case 'ADMIN':
        if (this.props.location.pathname === '/dashboard') {
          return (<Redirect to="/admin/users" />);
        }
        break

      default:
        break;
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

    // generic progress bar
    let loading_html = '';
    if ((this.props.user.isFetching) || (this.props.meals.isFetching)) {
      loading_html = (
        <div className="progress">
          <div className="indeterminate orange"></div>
        </div>);
    }

    // title changes according page
    let title_html = '';
    switch (this.props.location.pathname) {
    case '/dashboard':
         let sum = 0; // calories
         let today_meals = this.props.meals.info[moment().format('YYYY-MM-DD')];
         if (today_meals) {
           today_meals.meals.forEach(function(num) { sum += parseInt(num[2], 10) || 0 })
         }
         title_html = (<span className="brand-logo center"><b>{sum.toLocaleString()}</b> calories out of <b>{this.props.user.info.daily_calories_max.toLocaleString()}</b></span>);
         break;

    case '/admin/users':
         title_html = (<span className="brand-logo center"><b>Users</b></span>);
         break;

    case '/admin/managers':
         title_html = (<span className="brand-logo center"><b>Managers</b></span>);
         break;

    case '/admin/admins':
         title_html = (<span className="brand-logo center"><b>Administrators</b></span>);
         break;

    case '/admin/meals':
         title_html = (<span className="brand-logo center"><b>Meals</b></span>);
         break;

    default:
         break;
    }

    // menu changes according role
    let menu_options_html = [];
    menu_options_html.push(
      <li key="mi_1"><div className="userView">
        <div className="background blue"></div>
        <div className="center" style={{display: 'inline-flex'}}><img className="circle center" src={defaultUserImage} alt="" /></div>
        <div><span className="white-text name">{this.props.user.info.name}</span></div>
        <div><span className="white-text email">{this.props.user.info.email}</span></div>
      </div></li>
    );

    if (this.props.user.info.role === 'USER') {
      menu_options_html.push(<li key="mi_2"><Link to="/filter" onClick={this._handleFilterClick}>Filter</Link></li>);
      menu_options_html.push(<li key="mi_3"><Link to="/settings" onClick={this._handleSettingsClick}>Settings</Link></li>);
    }
    else {
      if (this.props.user.info.role === 'ADMIN') {
        menu_options_html.push(<li key="mi_7"><Link to="/admin/meals" onClick={this._handleNavItemClick}>Meals</Link></li>);
      }
      menu_options_html.push(<li key="mi_8"><Link to="/admin/users" onClick={this._handleNavItemClick}>Users</Link></li>);
    }
    menu_options_html.push(<li key="mi_9"><Link to="/logout" onClick={this._handleSignOutClick}>Logout</Link></li>);

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
          <div data-activates="slide-out" className="left button-collapse-nav" ref="button_collapse_nav" style={{paddingLeft: '24px', cursor: 'pointer'}}><i className="material-icons">menu</i></div>
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
      <Route path="/admin/managers" component={AdminUsers} />
      <Route path="/admin/admins" component={AdminUsers} />
      <Route path="/admin/meals" component={AdminMeals} />
      <Redirect to="/404-not-found" />
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
