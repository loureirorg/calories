import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-materialize';

// libs
import $ from 'jquery';
import moment from 'moment';

class ModalLostPassword extends Component {

  constructor(props) {
    super(props);
    this._handleCancel = this._handleCancel.bind(this);
  }

  componentDidMount() {
    let self = this;
    $('#modal-lost-password').modal({
      dismissible: true,
      complete: function() {
        self.props.modalLostPasswordClose();
      },
    });
    $('#modal-lost-password').modal('open');
  }

  componentWillUnmount() {
    $('#modal-lost-password').modal('close');
  }

  _handleCancel(event) {
    event.preventDefault();
    this.props.modalLostPasswordClose();
    this.props.history.push('/sign-in');
  }

  render() {
    return(
<div id="modal-lost-password" className="modal modal-fixed-footer">
  <form>
    <div className="modal-content">
      <h4>You've go mail!</h4>
      <p>Check your inbox. We've sent a link to reset your password to: <span className="email">{this.props.email}</span>.</p>
      <p>If you don't receive this message in a few minutes, please make sure it was not sent to your spam folder.</p>
    </div>
    <div className="modal-footer">
      <Button type="submit" onClick={this._handleCancel} className="waves-effect waves-blue btn-flat">Ok</Button>
    </div>
  </form>
</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modalLostPasswordClose: () => dispatch({type: 'MODAL_LOST_PASSWORD_CLOSE'}),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalLostPassword);
