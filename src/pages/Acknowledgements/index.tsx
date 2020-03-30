import React from 'react';
import { Dispatch } from 'redux';
import { Box, Heading, Text } from 'grommet';
import { FormNext } from 'grommet-icons';
import { connect } from 'react-redux';
import { scroller } from 'react-scroll';
import { WorkflowPageTemplate } from '../../components/WorkflowPage/WorkflowPageTemplate';
import {
  AcknowledgementSection,
  AcknowledgementSectionData,
} from './AcknowledgementSection';
import { Link } from '../../components/Link';
import {
  acknowledgementId,
  acknowledgementState,
  StoreState,
} from '../../store/reducers';
import { Paper } from '../../components/Paper';
import { Button } from '../../components/Button';
import { pageContent } from './pageContent';
import { routesEnum } from '../../Routes';
import {DispatchUpdateWorkflowProgressType, WorkflowProgressStep, updateWorkflowProgress} from "../../store/actions/workflowProgressActions";
import {
  DispatchUpdateAcknowledgementStateType,
  updateAcknowledgementState
} from "../../store/actions/acknowledgementActions";

interface OwnProps {}
interface StateProps {
  acknowledgementState: acknowledgementState;
  workflowProgress: WorkflowProgressStep;
}
interface DispatchProps {
  dispatchUpdateAcknowledgementState: DispatchUpdateAcknowledgementStateType;
  dispatchUpdateWorkflowProgress: DispatchUpdateWorkflowProgressType;
}
type Props = StateProps & DispatchProps & OwnProps;

const _AcknowledgementPage = ({
  acknowledgementState,
  dispatchUpdateAcknowledgementState,
  workflowProgress,
  dispatchUpdateWorkflowProgress,
}: Props) => {
  const handleSubmit = () => {
    if (workflowProgress === WorkflowProgressStep.OVERVIEW) {
      dispatchUpdateWorkflowProgress(WorkflowProgressStep.GENERATE_KEY_PAIRS);
    }
  };

  const scrollToNextAcknowledgement = () => {
    if (!acknowledgementState.allAgreedTo) {
      const nextAcknowledgement = pageContent.find(
        (section: AcknowledgementSectionData) =>
          !acknowledgementState.acknowledgements[section.id]
      );

      if (nextAcknowledgement === undefined) {
        throw new TypeError(
          'Redux and local acknowledgement state are out of sync'
        );
      }

      scroller.scrollTo(nextAcknowledgement.id, {
        duration: 800,
        delay: 0,
        offset: -10,
        smooth: 'easeInOutQuart',
      });
    }
  };

  const handleCheckboxClick = (
    id: acknowledgementId,
    checked: boolean
  ): void => {
    dispatchUpdateAcknowledgementState(id, checked);
    if (checked) {
      scrollToNextAcknowledgement();
    }
  };

  const renderIntroSection = () => {
    return (
      <Paper>
        <Heading level={3} size="small" color="blueDark">
          Introducing eth2 phase 0
        </Heading>

        <Text size="large" className="my10">
          Ethereum 2.0 uses proof-of-stake to secure its network.
        </Text>
        <Text size="large" className="my10">
          For this, we need active participants - known as validators - to
          propose, verify, and vouch for the validity of blocks. In exchange,
          honest validators receive financial rewards
        </Text>
        <Text size="large" className="my10">
          Importantly, validators need to post ETH as collateral - in other
          words, have some funds at stake. The only way to become a validator is
          to make a one-way ETH transaction to a deposit contract on Ethereum
          1.0
        </Text>
        <Link external to="https://www.google.com" className="my10" primary>
          Learn More <FormNext color="blueDark" />
        </Link>
      </Paper>
    );
  };

  return (
    <WorkflowPageTemplate title="Overview">
      {renderIntroSection()}
      {pageContent.map((acknowledgement: AcknowledgementSectionData) => (
        <AcknowledgementSection
          key={acknowledgement.id}
          handleCheckboxClick={handleCheckboxClick}
          agreedTo={acknowledgementState.acknowledgements[acknowledgement.id]}
          {...acknowledgement}
        />
      ))}
      <Box align="center" pad="large">
        <Link to={routesEnum.generateKeysPage} onClick={handleSubmit}>
          <Button
            rainbow
            width={300}
            disabled={!acknowledgementState.allAgreedTo}
            label="Continue"
          />
        </Link>
      </Box>
    </WorkflowPageTemplate>
  );
};

const mapStateToProps = (state: StoreState): StateProps => ({
  workflowProgress: state.workflowProgress,
  acknowledgementState: state.acknowledgementState,
});
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  dispatchUpdateAcknowledgementState: (id, value) =>
    dispatch(updateAcknowledgementState(id, value)),
  dispatchUpdateWorkflowProgress: (step: WorkflowProgressStep) =>
    dispatch(updateWorkflowProgress(step)),
});

export const AcknowledgementPage = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  mapStateToProps,
  mapDispatchToProps
)(_AcknowledgementPage);
