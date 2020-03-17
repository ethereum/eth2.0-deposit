import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  AcknowledgementPage,
  CongratulationsPage,
  ConnectWalletPage,
  GenerateKeysPage,
  LandingPage,
  NotFoundPage,
  SummaryPage,
  UploadValidatorPage,
  ValidatorSettingsPage,
} from './pages';
import ScrollToTop from './utils/ScrollToTop';

type RouteType = {
  path: string;
  component: FunctionComponent;
  exact?: boolean;
};

export enum routesEnum {
  congratulationsPage = '/congratulations',
  connectWalletPage = '/connect-wallet',
  generateKeysPage = '/generate-keys',
  acknowledgementPage = '/overview',
  summaryPage = '/summary',
  uploadValidatorPage = '/upload-validator',
  validatorSettingsPage = '/validator-settings',
  landingPage = '/',
  notFoundPage = '/*',
}
const routes: RouteType[] = [
  {
    path: routesEnum.congratulationsPage,
    exact: true,
    component: CongratulationsPage,
  },
  {
    path: routesEnum.connectWalletPage,
    exact: true,
    component: ConnectWalletPage,
  },
  {
    path: routesEnum.generateKeysPage,
    exact: true,
    component: GenerateKeysPage,
  },
  {
    path: routesEnum.acknowledgementPage,
    exact: true,
    component: AcknowledgementPage,
  },
  { path: routesEnum.summaryPage, exact: true, component: SummaryPage },
  {
    path: routesEnum.uploadValidatorPage,
    exact: true,
    component: UploadValidatorPage,
  },
  {
    path: routesEnum.validatorSettingsPage,
    exact: true,
    component: ValidatorSettingsPage,
  },
  { path: routesEnum.landingPage, exact: true, component: LandingPage },
  { path: routesEnum.notFoundPage, component: NotFoundPage },
];

export const Routes = () => {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {routes.map((route: RouteType) => (
          <Route
            onUpdate={() => window.scrollTo(0, 0)}
            {...route}
            key={route.path}
          />
        ))}
      </Switch>
    </>
  );
};
