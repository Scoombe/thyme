// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';

import {
  updateDurationRounding,
  updateDurationRoundingAmount,
  updateRoundingOn,
} from '../../../actions/settings';

import { getDurationRounding, getDurationAmount, getRoundingOn } from '../../../selectors/settings';

import RoundingField from './RoundingField';
import RoundingExample from './RoundingExample';

import './Rounding.css';

type RoundingProps = {
  durationAmount: number;
  durationRounding: rounding;
  roundingOn: roundableOn;
  onChangeDurationRounding: (round: rounding) => void;
  onChangeDurationRoundingAmount: (amount: number) => void;
  onChangeRoundingOn: (roundingOn: roundableOn) => void;
}

function Rounding({
  durationAmount,
  durationRounding,
  roundingOn,
  onChangeDurationRounding,
  onChangeDurationRoundingAmount,
  onChangeRoundingOn,
}: RoundingProps) {
  return (
    <div>
      <Message attached info>
        Setting duration rounding will round the durations shown in the timesheet and on reports.
      </Message>
      <Form className="Rounding attached fluid segment">
        <RoundingField
          label="Duration rounding"
          rounding={durationRounding}
          amount={durationAmount}
          onChangeRounding={onChangeDurationRounding}
          onChangeAmount={onChangeDurationRoundingAmount}
        />
        <Form.Group grouped>
          <Form.Field>
            <label>Round time on</label>
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              label="Per entry"
              name="roundingOn"
              value="entries"
              checked={roundingOn === 'entries'}
              onChange={onChangeRoundingOn}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              label="Report totals"
              name="roundingOn"
              value="reports"
              checked={roundingOn === 'reports'}
              onChange={onChangeRoundingOn}
            />
          </Form.Field>
        </Form.Group>
      </Form>
      <RoundingExample amount={durationAmount} rounding={durationRounding} />
    </div>
  );
}
function mapStateToProps(state) {
  return {
    durationRounding: getDurationRounding(state),
    durationAmount: getDurationAmount(state),
    roundingOn: getRoundingOn(state),
  };
}

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators({
    onChangeDurationRounding: updateDurationRounding,
    onChangeDurationRoundingAmount: updateDurationRoundingAmount,
    onChangeRoundingOn: (e, { value }) => updateRoundingOn(value),
  }, dispatch),
)(Rounding);
