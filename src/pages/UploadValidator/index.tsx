import React, { useCallback, useEffect, useState } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { WorkflowPageTemplate } from '../../components/WorkflowPage/WorkflowPageTemplate';
import { Paper } from '../../components/Paper';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { routesEnum } from '../../Routes';
import { Link } from '../../components/Link';
import { validateKeyFile } from './validateKeyFile';
import { StoreState } from '../../store/reducers';
import {
  DispatchKeyFilesUpdateType,
  KeyFileInterface,
  TransactionStatus,
  updateKeyFiles,
} from '../../store/actions/keyFileActions';
import {
  DispatchWorkflowUpdateType,
  updateWorkflow,
  WorkflowStep,
} from '../../store/actions/workflowActions';
import { useDropzone } from 'react-dropzone';
import { FileUploadAnimation } from './FileUploadAnimation';

const Dropzone = styled.div`
  outline: none;
  :focus {
    outline: none;
  }
`;
const Container = styled(Paper)`
  height: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const UploadText = styled(Text)`
  color: ${(p: { theme: any }) => p.theme.blue.medium};
  cursor: pointer;
  display: inline-block;
`;

interface OwnProps {}
interface StateProps {
  keyFiles: KeyFileInterface[];
  workflow: WorkflowStep;
}

interface DispatchProps {
  dispatchKeyFilesUpdate: DispatchKeyFilesUpdateType;
  dispatchWorkflowUpdate: DispatchWorkflowUpdateType;
}
type Props = StateProps & DispatchProps & OwnProps;

export const _UploadValidatorPage = ({
  keyFiles,
  dispatchKeyFilesUpdate,
  dispatchWorkflowUpdate,
  workflow,
}: Props): JSX.Element => {
  const fileAccepted = keyFiles.length > 0;
  const [invalidFile, setInvalidFile] = useState(false);
  const defaultMessage = (
    <div>
      Drag file to upload or <UploadText>browse</UploadText>
    </div>
  );
  const [message, setMessage] = useState(defaultMessage);
  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length === 1) {
        setInvalidFile(false);
        const reader = new FileReader();
        reader.onload = async event => {
          if (event.target) {
            try {
              const fileData = JSON.parse(event.target.result as string);
              if (await validateKeyFile(fileData as KeyFileInterface[])) {
                dispatchKeyFilesUpdate(
                  fileData.map((keyFile: KeyFileInterface) => ({
                    ...keyFile,
                    transactionStatus: TransactionStatus.READY, // initialize each keyFile with ready state for transaction
                  }))
                );
              } else {
                setInvalidFile(true);
                setTimeout(() => setInvalidFile(false), 2000);
              }
            } catch (e) {
              setInvalidFile(true);
              setTimeout(() => setInvalidFile(false), 2000);
            }
          }
        };
        reader.readAsText(acceptedFiles[0]);
      }
    },
    [dispatchKeyFilesUpdate]
  );

  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({ onDrop, accept: 'application/json' });

  useEffect(() => {
    if (fileAccepted) {
      setTimeout(() => setMessage(<div>File accepted</div>), 800);
      return;
    }

    if (!isDragActive) {
      if (invalidFile) {
        setMessage(<div>File is invalid</div>);
        return;
      }
      setMessage(defaultMessage);
      return;
    }

    if (isDragActive) {
      if (isDragReject) {
        setMessage(<div>Please upload a valid json file</div>);
      }
    }
  }, [fileAccepted, invalidFile, isDragReject, isDragActive]);
  const handleSubmit = () => {
    if (workflow === WorkflowStep.UPLOAD_VALIDATOR_FILE) {
      dispatchWorkflowUpdate(WorkflowStep.CONNECT_WALLET);
    }
  };

  // if (workflow < WorkflowStep.UPLOAD_VALIDATOR_FILE)
  //   return routeToCorrectWorkflowStep(workflow);

  return (
    <WorkflowPageTemplate title="Upload Deposit File">
      <Dropzone {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <Container className="mt20" pad="medium" ethBackground>
          <input {...getInputProps()} />
          <FileUploadAnimation
            isDragAccept={isDragAccept}
            isDragReject={isDragReject}
            fileAccepted={fileAccepted}
            isDragActive={isDragActive}
            invalidFile={invalidFile}
          />
          <Text className="mt20" textAlign="center">
            {message}
          </Text>
        </Container>
      </Dropzone>
      <div className="flex center p30">
        <Link to={routesEnum.generateKeysPage}>
          <Button className="mr10" width={100} label="Back" />
        </Link>
        <Link to={routesEnum.connectWalletPage} onClick={handleSubmit}>
          <Button
            width={300}
            rainbow
            disabled={!fileAccepted}
            label="Continue"
          />
        </Link>
      </div>
    </WorkflowPageTemplate>
  );
};

const mapStateToProps = (state: StoreState): StateProps => ({
  keyFiles: state.keyFiles,
  workflow: state.workflow,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  dispatchKeyFilesUpdate: files => dispatch(updateKeyFiles(files)),
  dispatchWorkflowUpdate: step => dispatch(updateWorkflow(step)),
});

export const UploadValidatorPage = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  mapStateToProps,
  mapDispatchToProps
)(_UploadValidatorPage);
