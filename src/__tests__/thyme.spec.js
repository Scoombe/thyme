

import { totalProjectTime, calculateDuration, formatDuration } from '../core/thyme';

describe('Calculate total project time', () => {
  const times = [{
    project: null,
    start: '2018-01-03T10:00:00.000Z',
    end: '2018-01-03T12:00:00.000Z',
  }, {
    project: 'ABCDEF',
    start: '2018-01-03T10:00:00.000Z',
    end: '2018-01-03T12:00:00.000Z',
  }, {
    project: 'ABCDEF',
    start: '2018-01-04T10:00:00.000Z',
    end: '2018-01-04T15:00:00.000Z',
  }, {
    project: 'ABCDEF',
    start: '2018-02-03T10:00:00.000Z',
    end: '2018-02-03T12:00:00.000Z',
  }];

  it('Calculates the sum of durations for a project', () => {
    expect(totalProjectTime({ id: 'ABCDEF' }, times, new Date(2018, 0, 3), new Date(2018, 0, 4)))
      .toBe(7 * 60);
  });
});

describe('calculateDuration testing', () => {
  it('Should have the correct duration of 2 minutes', () => {
    expect(calculateDuration('2018/05/11 13:30:00', '2018/05/11 13:32:00'))
      .toBe(2);
  });
  it('Should have the correct duration of 1 minutes as it rounds down', () => {
    expect(calculateDuration('2018/05/11 13:30:30', '2018/05/11 13:32:00'))
      .toBe(1);
  });
  it('Should have the correct duration of minutes over a day', () => {
    expect(calculateDuration('2018/05/11 13:30:00', '2018/05/12 13:30:00'))
      .toBe(1440);
  });
  it('Should have the correct duration of minutes over a week', () => {
    expect(calculateDuration('2018/05/11 13:30:00', '2018/05/18 13:30:00'))
      .toBe(10080);
  });
  it('Should return 0 for incorrect inputs', () => {
    expect(calculateDuration('thyme', 'test'))
      .toBe(0);
  });
  it('Should return 0 for dates the wrong way round', () => {
    expect(calculateDuration('2018/05/18 13:30:00', '2018/05/11 13:30:00'))
      .toBe(0);
  });
});

describe('formatDuration testing', () => {
  it('should format the hours and min', () => {
    expect(formatDuration(120))
      .toBe('02:00');
  });
  it('should format the hours and min', () => {
    expect(formatDuration(88))
      .toBe('01:28');
  });
  it('should format the hours and min', () => {
    expect(formatDuration(1000000000))
      .toBe('16666666:40');
  });
  it('should format the hours and min', () => {
    expect(formatDuration(0))
      .toBe('00:00');
  });
});
