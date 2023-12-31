import React from 'react';

import { darkTheme, lightTheme } from '@strapi/design-system';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Router } from 'react-router-dom';

import Theme from '../../../../../../components/Theme';
import ThemeToggleProvider from '../../../../../../components/ThemeToggleProvider';
import EditView from '../index';
import { data } from '../utils/tests/dataMock';

jest.mock('@strapi/helper-plugin', () => ({
  ...jest.requireActual('@strapi/helper-plugin'),
  useNotification: jest.fn(),
  useFocusWhenNavigate: jest.fn(),
  useRBAC: jest.fn(() => ({
    allowedActions: {
      canCreate: true,
      canDelete: true,
      canRead: true,
      canUpdate: true,
      canRegenerate: true,
    },
  })),
  useGuidedTour: jest.fn(() => ({
    startSection: jest.fn(),
  })),
  useOverlayBlocker: jest.fn(() => ({
    lockApp: jest.fn(),
    unlockApp: jest.fn(),
  })),
  useFetchClient: jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation((path) => {
      if (path === '/admin/content-api/permissions') {
        return { data };
      }

      return {
        data: {
          data: {
            id: '1',
            name: 'My super token',
            description: 'This describe my super token',
            type: 'read-only',
            createdAt: '2021-11-15T00:00:00.000Z',
            permissions: [],
          },
        },
      };
    }),
  }),
}));

jest.spyOn(Date, 'now').mockImplementation(() => new Date('2015-10-01T08:00:00.000Z'));

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const makeApp = (history) => {
  return (
    <QueryClientProvider client={client}>
      <IntlProvider messages={{}} defaultLocale="en" textComponent="span" locale="en">
        <ThemeToggleProvider themes={{ light: lightTheme, dark: darkTheme }}>
          <Theme>
            <Router history={history}>
              <Route path="/settings/transfer-tokens/:id">
                <EditView />
              </Route>
            </Router>
          </Theme>
        </ThemeToggleProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
};

describe('ADMIN | Pages | TRANSFER TOKENS | EditView', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('renders and matches the snapshot when creating token', async () => {
    const history = createMemoryHistory();
    const App = makeApp(history);
    const { container } = render(App);

    history.push('/settings/transfer-tokens/create');

    expect(container).toMatchSnapshot();
  });

  it('renders and matches the snapshot when editing existing token', async () => {
    const history = createMemoryHistory();
    const App = makeApp(history);
    const { container, getByText } = render(App);

    history.push('/settings/transfer-tokens/1');

    await waitFor(() => {
      expect(getByText('My super token')).toBeInTheDocument();
      expect(getByText('This describe my super token')).toBeInTheDocument();
      expect(getByText('Regenerate')).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
