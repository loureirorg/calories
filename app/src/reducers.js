// api end-point
window.api_url = '//api.calories.learnwithdaniel.com';
if ((window.location.protocol === 'file:') || (window.location.hostname === 'localhost')) {
  window.api_url = 'http://localhost:3000';
}

function reducerModalAdd(state = false, action) {
  switch (action.type) {
  case 'MODAL_ADD_OPEN':
    return true
  case 'MODAL_ADD_CLOSE':
    return false
  default:
    return state
  }
}

export function reducerModalAddUser(state = false, action) {
  switch (action.type) {
  case 'MODAL_ADD_USER_OPEN':
    return true
  case 'MODAL_ADD_USER_CLOSE':
    return false
  default:
    return state
  }
}

function reducerFilterDialog(state = false, action) {
  switch (action.type) {
  case 'FILTER_DIALOG_OPEN':
    return action.args;
  case 'FILTER_CLOSE':
    return false;
  default:
    return state
  }
}

function reducerModalLostPassword(state = false, action) {
  switch (action.type) {
  case 'MODAL_LOST_PASSWORD_OPEN':
    return action.email
  case 'MODAL_LOST_PASSWORD_CLOSE':
    return false
  default:
    return state
  }
}

function reducerSettings(state = false, action) {
  switch (action.type) {
  case 'MODAL_SETTINGS_OPEN':
    return true
  case 'MODAL_SETTINGS_CLOSE':
    return false
  default:
    return state
  }
}

function reducerFilter(state = {opened: false, args: {}}, action) {
  switch (action.type) {
  case 'MODAL_FILTER_OPEN':
    return Object.assign({}, state, {opened: true});
  case 'MODAL_FILTER_MEMORIZE':
    return Object.assign({}, state, {args: action.args});
  case 'MODAL_FILTER_CLOSE':
    return Object.assign({}, state, {opened: false});
  default:
    return state
  }
}

function reducerModalEdit(state = false, action) {
  switch (action.type) {
  case 'MODAL_EDIT_OPEN':
    return Object.assign({}, action.info);
  case 'MODAL_EDIT_CLOSE':
    return false
  default:
    return state
  }
}


export function reducerModalEditUser(state = false, action) {
  switch (action.type) {
  case 'MODAL_EDIT_USER_OPEN':
    return Object.assign({}, action.info);
  case 'MODAL_EDIT_USER_CLOSE':
    return false
  default:
    return state
  }
}


/***********/
/* MEAL    */
/***********/

export function reducerMeals(state = {
  isFetching: false,
  info: false,
  errors: false,
  error: false
}, action) {
  switch (action.type) {
    case MEAL_LIST_REQUEST:
      return Object.assign({}, state, {
        isFetching: 'LIST',
        errors: false,
        error: false
      })

    case MEAL_LIST_RECEIVE:
      if (action.ajaxReturn['errors']) {
        return Object.assign({}, state, {
          isFetching: false,
          errors: action.ajaxReturn['errors']
        })
      }
      else if (action.ajaxReturn['error']) {
        return Object.assign({}, state, {
          isFetching: false,
          error: action.ajaxReturn['error']
        })
      }

      return Object.assign({}, state, {
        isFetching: false,
        info: action.ajaxReturn,
      })

    case MEAL_CREATE_REQUEST:
      return Object.assign({}, state, {
        isFetching: 'CREATE',
        errors: false,
        error: false
      })

    case MEAL_CREATE_RECEIVE:
      if (action.ajaxReturn['errors']) {
        return Object.assign({}, state, {
          isFetching: false,
          errors: action.ajaxReturn['errors']
        })
      }
      else if (action.ajaxReturn['error']) {
        return Object.assign({}, state, {
          isFetching: false,
          error: action.ajaxReturn['error']
        })
      }

      return Object.assign({}, state, {
        isFetching: false
      })

    case MEAL_FILTER_REQUEST:
      return Object.assign({}, state, {
        isFetching: 'FILTER',
        errors: false,
        error: false
      })

    case MEAL_FILTER_RECEIVE:
      if (action.ajaxReturn['errors']) {
        return Object.assign({}, state, {
          isFetching: false,
          errors: action.ajaxReturn['errors']
        })
      }
      else if (action.ajaxReturn['error']) {
        return Object.assign({}, state, {
          isFetching: false,
          error: action.ajaxReturn['error']
        })
      }

      return Object.assign({}, state, {
        isFetching: false,
        info: action.ajaxReturn
      })

    case MEAL_UPDATE_REQUEST:
      return Object.assign({}, state, {
        isFetching: 'UPDATE',
        errors: false,
        error: false
      })

    case MEAL_UPDATE_RECEIVE:
      if (action.ajaxReturn['errors']) {
        return Object.assign({}, state, {
          isFetching: false,
          errors: action.ajaxReturn['errors']
        })
      }
      else if (action.ajaxReturn['error']) {
        return Object.assign({}, state, {
          isFetching: false,
          error: action.ajaxReturn['error']
        })
      }

      return Object.assign({}, state, {
        isFetching: false
      })

    case MEAL_DELETE_REQUEST:
      return Object.assign({}, state, {
        isFetching: 'DELETE',
        errors: false,
        error: false
      })

    case MEAL_DELETE_RECEIVE:
      if (action.ajaxReturn['errors']) {
        return Object.assign({}, state, {
          isFetching: false,
          errors: action.ajaxReturn['errors']
        })
      }
      else if (action.ajaxReturn['error']) {
        return Object.assign({}, state, {
          isFetching: false,
          error: action.ajaxReturn['error']
        })
      }

      return Object.assign({}, state, {
        isFetching: false
      })

    default:
      return state
  }
}

const MEAL_LIST_REQUEST = 'MEAL_LIST_REQUEST';
function requestMealList() {
  return {
    type: MEAL_LIST_REQUEST
  }
}

const MEAL_LIST_RECEIVE = 'MEAL_LIST_RECEIVE';
function receiveMealList(ajaxReturn) {
  return {
    type: MEAL_LIST_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: mealList() */
export function mealList() {
  return function (dispatch) {
    dispatch(requestMealList());

    return fetch(window.api_url + '/meals', {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(json => dispatch(receiveMealList(json)));
  }
}


const MEAL_CREATE_REQUEST = 'MEAL_CREATE_REQUEST';
function requestMealCreate() {
  return {
    type: MEAL_CREATE_REQUEST,
  }
}

const MEAL_CREATE_RECEIVE = 'MEAL_CREATE_RECEIVE';
function receiveMealCreate(ajaxReturn) {
  return {
    type: MEAL_CREATE_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: mealCreate({title: '', calories: 1000, eat_date: '2017-05-10', eat_time: '17:20'}) */
export function mealCreate(mealInfo) {
  return function (dispatch) {
    dispatch(requestMealCreate());

    return fetch(window.api_url + '/meals', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({meal: mealInfo})
      })
      .then(response => response.json())
      .then(json => dispatch(receiveMealCreate(json)));
  }
}


const MEAL_UPDATE_REQUEST = 'MEAL_UPDATE_REQUEST';
function requestMealUpdate() {
  return {
    type: MEAL_UPDATE_REQUEST,
  }
}

const MEAL_UPDATE_RECEIVE = 'MEAL_UPDATE_RECEIVE';
function receiveMealUpdate(ajaxReturn) {
  return {
    type: MEAL_UPDATE_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: mealUpdate({id: 10, title: '', calories: 1000, eat_date: '2017-05-10', eat_time: '17:20'}) */
export function mealUpdate(mealInfo) {
  return function (dispatch) {
    dispatch(requestMealUpdate());

    return fetch(window.api_url + '/meals/' + mealInfo.id, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({meal: mealInfo})
      })
      .then(response => response.json())
      .then(json => dispatch(receiveMealUpdate(json)));
  }
}


const MEAL_DELETE_REQUEST = 'MEAL_DELETE_REQUEST';
function requestMealDelete() {
  return {
    type: MEAL_DELETE_REQUEST,
  }
}

const MEAL_DELETE_RECEIVE = 'MEAL_DELETE_RECEIVE';
function receiveMealDelete(ajaxReturn) {
  return {
    type: MEAL_DELETE_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: mealDelete({id: 10}) */
export function mealDelete(mealInfo) {
  return function (dispatch) {
    dispatch(requestMealDelete());

    return fetch(window.api_url + '/meals/' + mealInfo.id, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(json => dispatch(receiveMealDelete(json)));
  }
}
const MEAL_FILTER_REQUEST = 'MEAL_FILTER_REQUEST';
function requestMealFilter() {
  return {
    type: MEAL_FILTER_REQUEST,
  }
}

const MEAL_FILTER_RECEIVE = 'MEAL_FILTER_RECEIVE';
function receiveMealFilter(ajaxReturn) {
  return {
    type: MEAL_FILTER_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: mealFilter('2017-05-15') */
export function mealFilter(date_from, date_to, time_from, time_to) {
  return function (dispatch) {
    // memorize inputs
    let args = {
      date_from: date_from,
      date_to: date_to,
      time_from: time_from,
      time_to: time_to,
    };
    dispatch({type: 'MODAL_FILTER_MEMORIZE', args: args});

    // start ajax request
    dispatch(requestMealFilter());

    // args
    let url_args = [];
    if (date_from) url_args.push('date-from=' + date_from);
    if (date_to) url_args.push('date-to=' + date_to);
    if (time_from) url_args.push('time-from=' + time_from);
    if (time_to) url_args.push('time-to=' + time_to);

    // ajax request
    return fetch(window.api_url + '/meals?' + url_args.join('&'), {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(function (json) {
        dispatch({type: 'FILTER_DIALOG_OPEN', args: args});
        dispatch(receiveMealFilter(json));
      });
  }
}


/***********/
/* ADMIN   */
/***********/

export function reducerAdminMeals(state = {
  isFetching: false,
  info: false,
  error: false,
  args: {orderBy: 'date', orderDir: +1, keyword: ''}
}, action) {

  switch (action.type) {
  case ADMIN_MEAL_LIST_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'LIST',
      error: false,
      args: Object.assign({}, state.args, action.args)
    })

  case ADMIN_MEAL_LIST_RECEIVE:
    if (action.ajaxReturn['error']) {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.ajaxReturn['error']
      })
    }

    return Object.assign({}, state, {
      isFetching: false,
      info: action.ajaxReturn,
    })

  default:
    return state
  }
}

const ADMIN_MEAL_LIST_REQUEST = 'ADMIN_MEAL_LIST_REQUEST';
function requestAdminMealList() {
  return {
    type: ADMIN_MEAL_LIST_REQUEST
  }
}

const ADMIN_MEAL_LIST_RECEIVE = 'ADMIN_MEAL_LIST_RECEIVE';
function receiveAdminMealList(ajaxReturn) {
  return {
    type: ADMIN_MEAL_LIST_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: adminMealList() */
export function adminMealList() {
  return function (dispatch) {
    dispatch(requestAdminMealList());

    return fetch(window.api_url + '/admin/meals', {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(json => dispatch(receiveAdminMealList(json)));
  }
}


export function reducerAdminUser(state = {
  isFetching: false,
  info: false,
  errors: false,
  error: false
}, action) {

  switch (action.type) {
  case ADMIN_USER_CREATE_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'CREATE',
      errors: false,
      error: false
    })

  case ADMIN_USER_CREATE_RECEIVE:
    if (action.ajaxReturn['errors']) {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.ajaxReturn['errors']
      })
    }
    else if (action.ajaxReturn['error']) {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.ajaxReturn['error']
      })
    }

    return Object.assign({}, state, {
      isFetching: false
    })

  case ADMIN_USER_UPDATE_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'UPDATE',
      errors: false,
      error: false
    })

  case ADMIN_USER_UPDATE_RECEIVE:
    if (action.ajaxReturn['errors']) {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.ajaxReturn['errors']
      })
    }
    else if (action.ajaxReturn['error']) {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.ajaxReturn['error']
      })
    }

    return Object.assign({}, state, {
      isFetching: false,
      info: action.ajaxReturn
    })

  case ADMIN_USER_DELETE_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'DELETE',
      errors: false,
      error: false
    })

  case ADMIN_USER_DELETE_RECEIVE:
    if (action.ajaxReturn['errors']) {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.ajaxReturn['errors']
      })
    }
    else if (action.ajaxReturn['error']) {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.ajaxReturn['error']
      })
    }

    return Object.assign({}, state, {
      isFetching: false
    })

  default:
    return state
  }
}

const ADMIN_USER_UPDATE_REQUEST = 'ADMIN_USER_UPDATE_REQUEST';
function requestAdminUserUpdate() {
  return {
    type: ADMIN_USER_UPDATE_REQUEST
  }
}

const ADMIN_USER_UPDATE_RECEIVE = 'ADMIN_USER_UPDATE_RECEIVE';
function receiveAdminUserUpdate(ajaxReturn) {
  return {
    type: ADMIN_USER_UPDATE_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: adminUserUpdate({id: 12, email: '', password: ''}) */
export function adminUserUpdate(userInfo) {
  return function (dispatch) {
    dispatch(requestAdminUserUpdate());

    return fetch(window.api_url + '/admin/users/' + userInfo.id, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user: userInfo})
      })
      .then(response => response.json())
      .then(json => dispatch(receiveAdminUserUpdate(json)));
  }
}

const ADMIN_USER_CREATE_REQUEST = 'ADMIN_USER_CREATE_REQUEST';
function requestAdminUserCreate() {
  return {
    type: ADMIN_USER_CREATE_REQUEST,
  }
}

const ADMIN_USER_CREATE_RECEIVE = 'ADMIN_USER_CREATE_RECEIVE';
function receiveAdminUserCreate(ajaxReturn) {
  return {
    type: ADMIN_USER_CREATE_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: adminUserCreate({title: '', calories: 1000, eat_date: '2017-05-10', eat_time: '17:20'}) */
export function adminUserCreate(info) {
  return function (dispatch) {
    dispatch(requestAdminUserCreate());

    return fetch(window.api_url + '/admin/users', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user: info})
      })
      .then(response => response.json())
      .then(json => dispatch(receiveAdminUserCreate(json)));
  }
}

const ADMIN_USER_DELETE_REQUEST = 'ADMIN_USER_DELETE_REQUEST';
function requestAdminUserDelete() {
  return {
    type: ADMIN_USER_DELETE_REQUEST,
  }
}

const ADMIN_USER_DELETE_RECEIVE = 'ADMIN_USER_DELETE_RECEIVE';
function receiveAdminUserDelete(ajaxReturn) {
  return {
    type: ADMIN_USER_DELETE_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: adminUserDelete({id: 10}) */
export function adminUserDelete(info) {
  return function (dispatch) {
    dispatch(requestAdminUserDelete());

    return fetch(window.api_url + '/admin/users/' + info.id, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(json => dispatch(receiveAdminUserDelete(json)));
  }
}

/***********/
/* USER    */
/***********/

export function reducerAdminUsers(state = {
  isFetching: false,
  info: false,
  error: false,
  args: {orderBy: 'name', orderDir: +1, keyword: '', role: 'USER'}
}, action) {

  switch (action.type) {
  case ADMIN_USER_LIST_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'LIST',
      error: false,
      args: Object.assign({}, state.args, action.args)
    })

  case ADMIN_USER_LIST_RECEIVE:
    if (action.ajaxReturn['error']) {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.ajaxReturn['error']
      })
    }

    return Object.assign({}, state, {
      isFetching: false,
      info: action.ajaxReturn,
    })

  default:
    return state
  }
}

export function reducerUser(state = {
  isFetching: false,
  info: false,
  errors: false,
  error: false
}, action) {

  switch (action.type) {
  case USER_SIGNUP_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'SIGNUP',
      errors: false,
      error: false
    })

  case USER_SIGNUP_RECEIVE:
    if (action.ajaxReturn['errors']) {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.ajaxReturn['errors']
      })
    }
    else if (action.ajaxReturn['error']) {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.ajaxReturn['error']
      })
    }

    return Object.assign({}, state, {
      isFetching: false,
      info: action.ajaxReturn
    })

  case USER_SIGNIN_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'SIGNIN',
      errors: false,
      error: false
    })

  case USER_SIGNIN_RECEIVE:
    if (action.ajaxReturn['errors']) {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.ajaxReturn['errors']
      })
    }
    else if (action.ajaxReturn['error']) {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.ajaxReturn['error']
      })
    }

    return Object.assign({}, state, {
      isFetching: false,
      info: action.ajaxReturn
    })

  case USER_UPDATE_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'UPDATE',
      errors: false,
      error: false
    })

  case USER_UPDATE_RECEIVE:
    if (action.ajaxReturn['errors']) {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.ajaxReturn['errors']
      })
    }
    else if (action.ajaxReturn['error']) {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.ajaxReturn['error']
      })
    }

    return Object.assign({}, state, {
      isFetching: false,
      info: action.ajaxReturn
    })

  case USER_LOST_PASSWORD_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'LOST_PASSWORD',
      errors: false,
      error: false
    })

  case USER_LOST_PASSWORD_RECEIVE:
    if (action.ajaxReturn['errors']) {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.ajaxReturn['errors']
      })
    }
    else if (action.ajaxReturn['error']) {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.ajaxReturn['error']
      })
    }

    return Object.assign({}, state, {
      isFetching: false
    })

  case USER_CHANGE_PASSWORD_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'CHANGE_PASSWORD',
      errors: false,
      error: false
    })

  case USER_CHANGE_PASSWORD_RECEIVE:
    if (action.ajaxReturn['errors']) {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.ajaxReturn['errors']
      })
    }
    else if (action.ajaxReturn['error']) {
      return Object.assign({}, state, {
        isFetching: false,
        error: action.ajaxReturn['error']
      })
    }

    return Object.assign({}, state, {
      isFetching: false,
      info: action.ajaxReturn
    })

  case USER_INFO_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'INFO',
    })

  case USER_INFO_RECEIVE:
    if ((action.ajaxReturn['errors']) || (action.ajaxReturn['error'])) {
      return Object.assign({}, state, {
        isFetching: false,
        info: false
      })
    }
    return Object.assign({}, state, {
      isFetching: false,
      info: action.ajaxReturn
    })

  case USER_SIGNOUT_REQUEST:
    return Object.assign({}, state, {
      isFetching: 'SIGNOUT',
    })

  case USER_SIGNOUT_RECEIVE:
    return Object.assign({}, state, {
      isFetching: false,
      info: false
    })

  default:
    return state
  }
}

const USER_SIGNUP_REQUEST = 'USER_SIGNUP_REQUEST';
function requestSignUp() {
  return {
    type: USER_SIGNUP_REQUEST,
  }
}

const USER_SIGNUP_RECEIVE = 'USER_SIGNUP_RECEIVE';
function receiveSignUp(ajaxReturn) {
  return {
    type: USER_SIGNUP_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: signUp({email: '', password: '', name: ''}) */
export function signUp(userInfo) {
  return function (dispatch) {
    dispatch(requestSignUp());

    return fetch(window.api_url + '/users', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({user: userInfo})
      })
      .then(response => response.json())
      .then(json => dispatch(receiveSignUp(json)));
  }
}

const USER_SIGNOUT_REQUEST = 'USER_SIGNOUT_REQUEST';
function requestSignOut() {
  return {
    type: USER_SIGNOUT_REQUEST
  }
}

const USER_SIGNOUT_RECEIVE = 'USER_SIGNOUT_RECEIVE';
function receiveSignOut(ajaxReturn) {
  return {
    type: USER_SIGNOUT_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: signOut() */
export function signOut(userInfo) {
  return function (dispatch) {
    dispatch(requestSignOut());

    return fetch(window.api_url + '/users/sign_out', {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(json => dispatch(receiveSignOut(json)));
  }
}


const USER_SIGNIN_REQUEST = 'USER_SIGNIN_REQUEST';
function requestSignIn() {
  return {
    type: USER_SIGNIN_REQUEST
  }
}

const USER_SIGNIN_RECEIVE = 'USER_SIGNIN_RECEIVE';
function receiveSignIn(ajaxReturn) {
  return {
    type: USER_SIGNIN_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: signIn({email: '', password: ''}) */
export function signIn(userInfo) {
  return function (dispatch) {
    dispatch(requestSignIn());

    return fetch(window.api_url + '/users/sign_in', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({user: userInfo})
      })
      .then(response => response.json())
      .then(json => dispatch(receiveSignIn(json)));
  }
}


const USER_INFO_REQUEST = 'USER_INFO_REQUEST';
function requestUserInfo() {
  return {
    type: USER_INFO_REQUEST
  }
}

const USER_INFO_RECEIVE = 'USER_INFO_RECEIVE';
function receiveUserInfo(ajaxReturn) {
  return {
    type: USER_INFO_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: userFetch() */
export function userFetch() {
  return function (dispatch) {
    dispatch(requestUserInfo());

    return fetch(window.api_url + '/users/sign_in', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      .then(response => response.json())
      .then(json => dispatch(receiveUserInfo(json)));
  }
}


const USER_UPDATE_REQUEST = 'USER_UPDATE_REQUEST';
function requestUserUpdate() {
  return {
    type: USER_UPDATE_REQUEST
  }
}

const USER_UPDATE_RECEIVE = 'USER_UPDATE_RECEIVE';
function receiveUserUpdate(ajaxReturn) {
  return {
    type: USER_UPDATE_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: userUpdate({email: '', password: ''}) */
export function userUpdate(userInfo) {
  return function (dispatch) {
    dispatch(requestUserUpdate());

    return fetch(window.api_url + '/users', {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({user: userInfo})
      })
      .then(response => response.json())
      .then(json => dispatch(receiveUserUpdate(json)));
  }
}


const USER_LOST_PASSWORD_REQUEST = 'USER_LOST_PASSWORD_REQUEST';
function requestUserLostPassword() {
  return {
    type: USER_LOST_PASSWORD_REQUEST
  }
}

const USER_LOST_PASSWORD_RECEIVE = 'USER_LOST_PASSWORD_RECEIVE';
function receiveUserLostPassword(ajaxReturn) {
  return {
    type: USER_LOST_PASSWORD_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: lostPassword({email: ''}) */
export function lostPassword(userInfo) {
  return function (dispatch) {
    dispatch(requestUserLostPassword());

    return fetch(window.api_url + '/users/password', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({user: userInfo})
      })
      .then(response => response.json())
      .then(json => dispatch(receiveUserLostPassword(json)));
  }
}


const USER_CHANGE_PASSWORD_REQUEST = 'USER_CHANGE_PASSWORD_REQUEST';
function requestChangePassword() {
  return {
    type: USER_CHANGE_PASSWORD_REQUEST,
  }
}

const USER_CHANGE_PASSWORD_RECEIVE = 'USER_CHANGE_PASSWORD_RECEIVE';
function receiveChangePassword(ajaxReturn) {
  return {
    type: USER_CHANGE_PASSWORD_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: changePassword({password: '', password_confirmation: ''}) */
export function changePassword(userInfo) {
  return function (dispatch) {
    dispatch(requestChangePassword());

    return fetch(window.api_url + '/users/password', {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({user: userInfo})
      })
      .then(response => response.json())
      .then(json => dispatch(receiveChangePassword(json)));
  }
}


const ADMIN_USER_LIST_REQUEST = 'ADMIN_USER_LIST_REQUEST';
function requestAdminUserList(args) {
  return {
    type: ADMIN_USER_LIST_REQUEST,
    args: args
  }
}

const ADMIN_USER_LIST_RECEIVE = 'ADMIN_USER_LIST_RECEIVE';
function receiveAdminUserList(ajaxReturn) {
  return {
    type: ADMIN_USER_LIST_RECEIVE,
    ajaxReturn: ajaxReturn
  }
}

/* Ex.: adminUserList() */
export function adminUserList(state, args={}) {
  return function (dispatch) {
    dispatch(requestAdminUserList(args));

    // args
    args = Object.assign({}, state.args, args);
    let url_args = [];

    if (args['role']) url_args.push('role=' + args['role']);
    if (args['orderBy']) url_args.push('order-by=' + args['orderBy']);
    if (args['orderDir']) url_args.push('order-dir=' + args['orderDir']);
    if (args['keyword']) url_args.push('keyword=' + args['keyword']);

    return fetch(window.api_url + '/admin/users?' + url_args.join('&'), {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(json => dispatch(receiveAdminUserList(json)));
  }
}


export {
  reducerModalAdd,
  reducerModalEdit,
  reducerSettings,
  reducerFilter,
  reducerModalLostPassword,
  reducerFilterDialog
};
