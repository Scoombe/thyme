import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { parse, isSameMinute } from 'date-fns';

import TimeSheet from 'sections/TimeSheet/TimeSheet';

import createStore from '../../createStore';

describe('DateRange', () => {
  const store = createStore({
    time: {
      byId: {
        1: {
          id: 1,
          project: null,
          start: '2018-08-14T12:00:00.000Z',
          end: '2018-08-14T13:00:00.000Z',
        },
        2: {
          id: 2,
          project: null,
          start: '2018-08-14T15:00:00.000Z',
          end: '2018-08-14T16:00:00.000Z',
        },
        3: {
          id: 3,
          project: null,
          start: '2018-08-13T15:00:00.000Z',
          end: '2018-08-13T16:00:00.000Z',
        },
        4: {
          id: 4,
          project: null,
          start: '2018-08-09T15:00:00.000Z',
          end: '2018-08-09T16:00:00.000Z',
        },
        5: {
          id: 5,
          project: null,
          start: '2018-07-15T15:00:00.000Z',
          end: '2018-07-15T16:00:00.000Z',
        },
        6: {
          id: 6,
          project: null,
          start: '2017-07-15T15:00:00.000Z',
          end: '2017-07-15T16:00:00.000Z',
        },
      },
      allIds: [1, 2, 3, 4, 5, 6],
    },
  });
  const page = mount(
    <Provider store={store}>
      <TimeSheet now={parse('2018-08-14T19:00:00.000Z')} />
    </Provider>,
  );
  const dateRangeWrapper = page.find('DateRange');

  it('renders date ranges', () => {
    // click on "today"
    dateRangeWrapper.find('.menu .item').at(0).simulate('click');

    expect(dateRangeWrapper.find('.menu .item').length).toBe(5);
  });

  it('renders today\'s entries when picking today', () => {
    expect(page.find('Entry').length).toBe(3);
  });

  it('renders this week\'s entries when picking this week', () => {
    // click on "this week"
    dateRangeWrapper.find('.menu .item').at(1).simulate('click');

    expect(page.find('Entry').length).toBe(4);
  });

  it('renders entries when picking last 7 days', () => {
    // click on "week to date"
    dateRangeWrapper.find('.menu .item').at(2).simulate('click');

    expect(page.find('Entry').length).toBe(5);
  });

  it('renders entries when picking last month', () => {
    // click on "last month"
    dateRangeWrapper.find('.menu .item').at(3).simulate('click');

    expect(page.find('Entry').length).toBe(6);
  });

  it('renders old entries when picking older', () => {
    // click on "older"
    dateRangeWrapper.find('.menu .item').at(4).simulate('click');

    expect(page.find('Entry').length).toBe(2);
  });
});

describe('TimeTable', () => {
  it('Has the correct starting date', () => {
    const store = createStore();
    const page = mount(
      <Provider store={store}>
        <TimeSheet now={parse('2018-08-14T19:00:00.000Z')} />
      </Provider>,
    );

    expect(page.find('TimeTable').find('DateInput').first().prop('value')).toBe('2018-08-14');
  });

  it('Renders duration when times changes', () => {
    const store = createStore();
    const page = mount(
      <Provider store={store}>
        <TimeSheet now={parse('2018-08-14T19:00:00.000Z')} />
      </Provider>,
    );

    // change start time at 01:00 and end time to 03:00
    const startTime = document.createElement('input');
    startTime.value = '01:00';

    const endTime = document.createElement('input');
    endTime.value = '03:00';

    page.find('TimeTable').find('input[type="time"]').at(0).simulate('change', { target: startTime });
    page.find('TimeTable').find('input[type="time"]').at(0).simulate('blur');
    page.find('TimeTable').find('input[type="time"]').at(1).simulate('change', { target: endTime });
    page.find('TimeTable').find('input[type="time"]').at(1).simulate('blur');

    expect(page.find('TimeTable').find('.EntryDuration').at(0).text()).toBe('02:00');
  });

  it('Adds and updates entry to the store', () => {
    const store = createStore();
    const page = mount(
      <Provider store={store}>
        <TimeSheet now={parse('2018-08-14T19:00:00.000Z')} />
      </Provider>,
    );

    const startTime = document.createElement('input');
    startTime.value = '09:00';

    const endTime = document.createElement('input');
    endTime.value = '12:00';

    const notes = document.createElement('input');
    notes.value = 'Testing Thyme';

    page.find('TimeTable').find('input[type="time"]').at(0).simulate('change', { target: startTime });
    page.find('TimeTable').find('input[type="time"]').at(0).simulate('blur');
    page.find('TimeTable').find('input[type="time"]').at(1).simulate('change', { target: endTime });
    page.find('TimeTable').find('input[type="time"]').at(1).simulate('blur');
    page.find('TimeTable').find('.EntryNotes input').at(0).simulate('change', { target: notes });
    page.find('TimeTable').find('.EntryNotes input').at(0).simulate('blur');

    page.find('TimeTable').find('.EntrySubmit').at(0).simulate('click');

    const state = store.getState();
    const entries = state.time.allIds.map(id => state.time.byId[id]);

    // see if entry has entered
    expect(entries.length).toBe(1);
    expect(entries[0].notes).toBe('Testing Thyme');

    // testing updates
    notes.value = 'Updated notes';

    const notesInput = page.find('TimeTable').find('.EntryNotes input').at(1);
    notesInput.simulate('change', { target: notes });
    notesInput.simulate('blur');

    const updatedState = store.getState();
    const updatedEntries = updatedState.time.allIds.map(id => updatedState.time.byId[id]);

    expect(updatedEntries[0].notes).toBe('Updated notes');
  });

  it('Adds entry to the store with a project selected', () => {
    const store = createStore({
      projects: {
        allIds: [1],
        byId: {
          1: {
            id: 1,
            name: 'Project name',
          },
        },
      },
    });
    const page = mount(
      <Provider store={store}>
        <TimeSheet now={parse('2018-08-14T19:00:00.000Z')} />
      </Provider>,
    );

    const startTime = document.createElement('input');
    startTime.value = '09:00';

    const endTime = document.createElement('input');
    endTime.value = '12:00';

    // set times
    page.find('TimeTable').find('input[type="time"]').at(0).simulate('change', { target: startTime });
    page.find('TimeTable').find('input[type="time"]').at(1).simulate('change', { target: endTime });

    // select project
    page.find('TimeTable').find('input.search').simulate('click');
    page.find('TimeTable').find('.dropdown .item').at(1).simulate('click');

    // submit
    page.find('TimeTable').find('.EntrySubmit').at(0).simulate('click');

    const state = store.getState();
    const entries = state.time.allIds.map(id => state.time.byId[id]);

    expect(entries[0].project).toBe(1);
  });

  it('Creates project from project select', () => {
    const store = createStore();
    const page = mount(
      <Provider store={store}>
        <TimeSheet now={parse('2018-08-14T19:00:00.000Z')} />
      </Provider>,
    );

    const projectName = document.createElement('input');
    projectName.value = 'Test project';

    // select project
    page.find('TimeTable').find('input.search').simulate('change', { target: projectName });
    page.find('TimeTable').find('.dropdown .item').at(0).simulate('click');

    const state = store.getState();
    const projects = state.projects.allIds.map(id => state.projects.byId[id]);

    expect(projects.length).toBe(1);
    expect(projects[0].name).toBe('Test project');
  });

  it('Updates both dates when a different date is picked', () => {
    const store = createStore({
      time: {
        byId: {
          1: {
            id: 1,
            project: null,
            start: '2018-08-14T12:00:00.000Z',
            end: '2018-08-14T13:00:00.000Z',
            notes: '',
          },
        },
        allIds: [1],
      },
    });
    const page = mount(
      <Provider store={store}>
        <TimeSheet now={parse('2018-08-14T19:00:00.000Z')} />
      </Provider>,
    );

    const startDate = document.createElement('input');
    startDate.value = '2018-08-15';

    page.find('TimeTable').find('input[type="date"]').at(1).simulate('change', { target: startDate });
    page.find('TimeTable').find('input[type="date"]').at(1).simulate('blur');

    const state = store.getState();
    expect(isSameMinute(state.time.byId[1].start, '2018-08-15T12:00:00.000Z')).toBe(true);
    expect(isSameMinute(state.time.byId[1].end, '2018-08-15T13:00:00.000Z')).toBe(true);
  });

  it('Updates only start date if manual end date is enabled', () => {
    const store = createStore({
      time: {
        byId: {
          1: {
            id: 1,
            project: null,
            start: '2018-08-14T12:00:00.000Z',
            end: '2018-08-14T13:00:00.000Z',
            notes: '',
          },
        },
        allIds: [1],
      },
      settings: {
        timesheet: {
          enableEndDate: true,
        },
      },
    });
    const page = mount(
      <Provider store={store}>
        <TimeSheet now={parse('2018-08-14T19:00:00.000Z')} />
      </Provider>,
    );

    const startDate = document.createElement('input');
    startDate.value = '2018-08-13';

    page.find('TimeTable').find('input[type="date"]').at(2).simulate('change', { target: startDate });
    page.find('TimeTable').find('input[type="date"]').at(2).simulate('blur');

    const state = store.getState();
    expect(isSameMinute(state.time.byId[1].start, '2018-08-13T12:00:00.000Z')).toBe(true);
    expect(isSameMinute(state.time.byId[1].end, '2018-08-14T13:00:00.000Z')).toBe(true);
  });
});
