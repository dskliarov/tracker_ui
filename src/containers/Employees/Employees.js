import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as employeeActions from 'redux/modules/employees';
import {isLoaded, load as loadEmployees} from 'redux/modules/employees';
import {initializeWithKey} from 'redux-form';
import connectData from 'helpers/connectData';
import { WidgetForm } from 'components';

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    return dispatch(loadEmployees());
  }
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    employees: state.employees.data,
    editing: state.employees.editing,
    error: state.employees.error,
    loading: state.employees.loading
  }),
  {...employeeActions, initializeWithKey })
export default class Employees extends Component {
  static propTypes = {
    employees: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    initializeWithKey: PropTypes.func.isRequired,
    editing: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  }

  render() {
    const handleEdit = (employee) => {
      const {editStart} = this.props; // eslint-disable-line no-shadow
      return () => editStart(String(employee.id));
    };
    const {employees, error, editing, loading, load} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Employees.scss');
    return (
      <div className={styles.employees + ' container'}>
        <h1>
         Employees
          <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}>
            <i className={refreshClassName}/> {' '} Reload Employees
          </button>
        </h1>
        <Helmet title="Employees"/>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
        {employees && employees.length &&
        <table className="table table-striped">
          <thead>
          <tr>
            <th className={styles.idCol}>ID</th>
            <th className={styles.firstNameCol}>First Name</th>
            <th className={styles.lastNameCol}>Last Name</th>
            <th className={styles.inactiveCol}>Inactive</th>
            <th className={styles.departmentCol}>Department</th>
            <th className={styles.buttonCol}></th>
          </tr>
          </thead>
          <tbody>
          {
            employees.map((employee) => editing[employee.id] ?
              <WidgetForm formKey={String(employee.id)} key={String(employee.id)} initialValues={employee}/> :
              <tr key={employee.id}>
                <td className={styles.idCol}>{employee.id}</td>
                <td className={styles.firstNameCol}>{employee.first_name}</td>
                <td className={styles.lastNameCol}>{employee.last_name}</td>
                <td className={styles.inactiveCol}>{employee.inactive.toString()}</td>
                <td className={styles.departmentCol}>{employee.department_id}</td>
                <td className={styles.buttonCol}>
                  <button className="btn btn-primary" onClick={handleEdit(employee)}>
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

