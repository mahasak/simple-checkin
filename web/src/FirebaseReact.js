import * as firebase from 'firebase'

import React from 'react'

export class Auth extends React.Component {
  auth = firebase.auth()
  state = {
    user: this.auth.currentUser
  }
  componentDidMount () {
    this.unsubscribe = this.auth.onAuthStateChanged(user => {
      this.setState({ user })
    })
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  render () {
    return this.props.children(this.state.user)
  }
}

/**
 * Usage: <Data
 *          path='path/to/data'
 *          renderLoading={() => <div />}
 *          renderData={(data) => <div />}
 *          renderError={(error) => <div />}
 *        />
 */
export class Data extends React.Component {
  db = firebase.database()
  render () {
    return (
      <DataRef
        key={this.props.path}
        {...this.props}
        firebaseRef={this.db.ref(this.props.path)}
      />
    )
  }
}

export class DataRef extends React.Component {
  state = {
    loading: true,
    data: null,
    error: null
  }
  componentDidMount () {
    this.firebaseRef = this.props.firebaseRef
    this.firebaseRef.on('value', this.onUpdate, this.onError)
  }
  componentWillUnmount () {
    this.firebaseRef.off('value', this.onUpdate)
  }
  onUpdate = (snapshot) => {
    this.setState({ loading: false, data: snapshot.val(), error: null })
  }
  onError = (error) => {
    this.setState({ loading: false, error })
  }
  render () {
    return this.state.loading
      ? (this.props.renderLoading || defaultRenderLoading)()
      : this.state.error
      ? (this.props.renderError || defaultRenderError)(this.state.error)
      : (this.props.renderData || defaultRenderData)(this.state.data)
  }
}

export function defaultRenderLoading () {
  return (
    <div style={{ padding: '1em' }}>Loading data from Firebase…</div>
  )
}

export function defaultRenderError (error) {
  return (
    <div style={{ background: 'red', color: 'white', padding: '1em' }}>
      <strong>Error received from Firebase:</strong> {String(error)}
    </div>
  )
}

export function defaultRenderData (data) {
  return (
    <pre style={{ padding: '1em' }}>
      {require('util').inspect(data)}
    </pre>
  )
}