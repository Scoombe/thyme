// @flow

import React from 'react';
import { connect } from 'react-redux';

import { sortedProjects } from '../../core/projects';

import './Reports.css';

type ReportsType = {
  projects: Array<projectTreeType>,
};

function Reports({ projects }: ReportsType) {
  return (
    <div>
      <div className="Report__header">
        <h2 className="Report__title">This week</h2>
        <span className="Report__header-date">(15-21 January 2018)</span>
        <div className="Report__period">
          <select name="period">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom range</option>
          </select>
        </div>
      </div>
      <div className="Report__filters">
        <span className="Report__filters-label">Show:</span>
        {projects.map(project => (
          <label className="Report__filter" key={project.id} htmlFor={project.id}>
            <span className="Report__filter-name">{project.name}</span>
            <input defaultChecked type="checkbox" name={project.id} id={project.id} />
          </label>
        ))}
      </div>
      <div>{JSON.stringify(projects)}</div>
    </div>
  );
}

function mapStateToProps(state) {
  const { projects, time } = state;

  return {
    projects: sortedProjects(projects.allIds.map(id => projects.byId[id])),
    time: time.allIds.map(id => time.byId[id]),
  };
}

export default connect(mapStateToProps)(Reports);
