// @flow

import React from 'react';

import Table from 'semantic-ui-react/dist/commonjs/collections/Table';

import { render as renderComponent } from 'register/component';

import Responsive from 'components/Responsive';

import ProjectsList from './ProjectsList';

type ProjectsListWrapperProps = {
  projects: Array<ProjectTreeType>;
};

function ProjectsListWrapper(props: ProjectsListWrapperProps) {
  const { projects } = props;

  if (projects.length === 0) {
    return (
      <div className="ProjectList--empty">
        No projects added yet, add projects using above form.
      </div>
    );
  }

  return (
    <Table>
      <Responsive min="tablet">
        {matched => matched && (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Name
              </Table.HeaderCell>
              {renderComponent('projects.tableheader.name', props)}
              <Table.HeaderCell width={5}>
                Parent
              </Table.HeaderCell>
              {renderComponent('projects.tableheader.parent', props)}
              <Table.HeaderCell width={1}>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )}
      </Responsive>
      <Table.Body>
        <ProjectsList projects={projects} />
      </Table.Body>
    </Table>
  );
}

export default ProjectsListWrapper;
