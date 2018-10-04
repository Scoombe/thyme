// @flow

import React, { Component } from 'react';
import format from 'date-fns/format';
import classnames from 'classnames';

import Table from 'semantic-ui-react/dist/commonjs/collections/Table';
import Accordion from 'semantic-ui-react/dist/commonjs/modules/Accordion';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup/Popup';

import { timeElapsed } from '../../core/thyme';

import './ReportDetailed.css';

type ReportColumn = 'date' | 'start' | 'end' | 'duration' | 'project' | 'notes';

type ReportDetailedType = {
  round: rounding;
  roundAmount: number;
  projects: Array<projectTreeWithTimeType>;
};

type ReportDetailedState = {
  opened: boolean;
  printable: {
    [ReportColumn]: boolean;
  };
};

class ReportDetailed extends Component<ReportDetailedType, ReportDetailedState> {
  state = {
    opened: false,
    printable: {
      date: true,
      start: true,
      end: true,
      duration: true,
      project: true,
      notes: true,
    },
  };

  onChangePrintView = (e: Event, data: { checked: boolean, column: ReportColumn }) => {
    const { printable } = this.state;

    this.setState({
      printable: {
        ...printable,
        [data.column]: data.checked,
      },
    });
  };

  toggleDetails = () => {
    const { opened } = this.state;

    this.setState({
      opened: !opened,
    });
  };

  columnHeader = (column: ReportColumn) => {
    const { printable } = this.state;

    return (
      <Table.HeaderCell className={classnames({ 'no-print': !printable[column] })}>
        <Popup
          inverted
          trigger={(
            <Checkbox
              label={column}
              checked={printable[column]}
              column={column}
              onClick={this.onChangePrintView}
            />
          )}
          content={`Show '${column}' on printed version`}
        />
      </Table.HeaderCell>
    );
  };

  render() {
    const { round, roundAmount, projects } = this.props;
    const { opened, printable } = this.state;

    return (
      <Accordion className="ReportDetailed">
        <Accordion.Title active={opened} onClick={this.toggleDetails}>
          <Icon name="dropdown" />
          Detailed view
        </Accordion.Title>
        <Accordion.Content active={opened}>
          <Table celled>
            <Table.Header>
              <Table.Row>
                {this.columnHeader('date')}
                {this.columnHeader('start')}
                {this.columnHeader('end')}
                {this.columnHeader('duration')}
                {this.columnHeader('project')}
                {this.columnHeader('notes')}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {projects.map(project => project.entries.map(entry => (
                <Table.Row key={entry.id}>
                  <Table.Cell className={classnames({ 'no-print': !printable.date })}>
                    {format(entry.start, 'DD/MM/YYYY')}
                  </Table.Cell>
                  <Table.Cell className={classnames({ 'no-print': !printable.start })}>
                    {format(entry.start, 'HH:mm')}
                  </Table.Cell>
                  <Table.Cell className={classnames({ 'no-print': !printable.end })}>
                    {format(entry.end, 'HH:mm')}
                  </Table.Cell>
                  <Table.Cell className={classnames({ 'no-print': !printable.duration })}>
                    {timeElapsed(
                      entry.start,
                      entry.end,
                      false,
                      false,
                      round,
                      roundAmount,
                    )}
                  </Table.Cell>
                  <Table.Cell className={classnames({ 'no-print': !printable.project })}>
                    {project.nameTree.join(' > ')}
                  </Table.Cell>
                  <Table.Cell className={classnames({ 'no-print': !printable.notes })}>
                    {entry.notes}
                  </Table.Cell>
                </Table.Row>
              )))}
            </Table.Body>
          </Table>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default ReportDetailed;
