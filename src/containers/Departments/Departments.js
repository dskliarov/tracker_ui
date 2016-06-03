import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as departmentActions from 'redux/modules/departments';
import {isLoaded, load as loadDepartments} from 'redux/modules/departments';
import {initializeWithKey} from 'redux-form';
import connectData from 'helpers/connectData';
import { DepartmentForm } from 'components';

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    return dispatch(loadDepartments());
  }
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    departments: state.departments.data,
    editing: state.departments.editing,
    error: state.departments.error,
    loading: state.departments.loading
  }),
  {...departmentActions, initializeWithKey })

export default class Departments extends Component {

  static propTypes = {
    departments: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    initializeWithKey: PropTypes.func.isRequired,
    editing: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  }

  render() {
    const handleEdit = (department) => {
      const {editStart} = this.props; // eslint-disable-line no-shadow
      return () => editStart(String(department.id));
    };
    const {departments, error, editing, loading, load} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Departments.scss');
    return (
      <div className={styles.departments + ' container'}>
        <h1>
          Departments
          <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}>
            <i className={refreshClassName}/> {' '} Reload Departments
          </button>
        </h1>
        <Helmet title="Departments"/>
        <p>
          If you hit refresh on your browser, the data loading will take place on the server before the page is returned.
          If you navigated here from another page, the data was fetched from the client after the route transition.
          This uses the static method <code>fetchDataDeferred</code>. To block a route transition until some data is loaded, use <code>fetchData</code>.
          To always render before loading data, even on the server, use <code>componentDidMount</code>.
        </p>
        <p>
          This widgets are stored in your session, so feel free to edit it and refresh.
        </p>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
       {departments && departments.length &&
        <table className="table table-striped">
          <thead>
          <tr>
            <th className={styles.idCol}>ID</th>
            <th className={styles.nameCol}>Name</th>
            <th className={styles.inactiveCol}>Inactive</th>
            <th className={styles.buttonCol}></th>
          </tr>
          </thead>
          <tbody>
          {
            departments.map((department) => editing[department.id] ?
              <DepartmentForm formKey={String(department.id)} key={String(department.id)} initialValues={department}/> :
                <tr key={department.id}>
                <td className={styles.idCol}>{department.id}</td>
                <td className={styles.nameCol}>{department.name}</td>
                <td className={styles.inactiveCol}>{department.inactive.toString()}</td>
                <td className={styles.buttonCol}>
                  <button className="btn btn-primary" onClick={handleEdit(department)}>
                    <i className="fa fa-pencil"/> Edit
                  </button>
                </td>
              </tr>)
          }
          </tbody>
        </table>}
      </div>
    );
  }
}

