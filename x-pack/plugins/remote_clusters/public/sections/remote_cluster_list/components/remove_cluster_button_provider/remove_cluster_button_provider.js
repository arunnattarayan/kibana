/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectI18n, FormattedMessage } from '@kbn/i18n/react';

import {
  EuiConfirmModal,
  EuiOverlayMask,
} from '@elastic/eui';

export const RemoveClusterButtonProvider = injectI18n(
  class extends Component {
    static propTypes = {
      removeClusters: PropTypes.func.isRequired,
      clusterNames: PropTypes.array.isRequired,
      children: PropTypes.func.isRequired,
    };

    state = {
      isModalOpen: false,
    };

    onMouseOverModal = (event) => {
      // This component can sometimes be used inside of an EuiToolTip, in which case mousing over
      // the modal can trigger the tooltip. Stopping propagation prevents this.
      event.stopPropagation();
    };

    showConfirmModal = () => {
      this.setState({
        isModalOpen: true,
      });
    };

    closeConfirmModal = () => {
      this.setState({
        isModalOpen: false,
      });
    };

    onConfirm = () => {
      const { removeClusters, clusterNames } = this.props;
      removeClusters(clusterNames);
      this.closeConfirmModal();
    }

    render() {
      const { intl, clusterNames, children } = this.props;
      const { isModalOpen } = this.state;
      const isSingleCluster = clusterNames.length === 1;
      let modal;

      if (isModalOpen) {
        const title = isSingleCluster ? intl.formatMessage({
          id: 'xpack.remoteClusters.removeButton.confirmModal.deleteSingleClusterTitle',
          defaultMessage: 'Remove remote cluster \'{name}\'?',
        }, { name: clusterNames[0] }) : intl.formatMessage({
          id: 'xpack.remoteClusters.removeButton.confirmModal.multipleDeletionTitle',
          defaultMessage: 'Remove {count} remote clusters?',
        }, { count: clusterNames.length });

        const content = (
          <Fragment>
            <p>
              <FormattedMessage
                id="xpack.remoteClusters.removeButton.confirmModal.multipleDeletionDescription"
                defaultMessage="You are about to remove these remote clusters:"
              />
            </p>
            <ul>{clusterNames.map(name => <li key={name}>{name}</li>)}</ul>
          </Fragment>
        );

        modal = (
          <EuiOverlayMask>
            { /* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */ }
            <EuiConfirmModal
              title={title}
              onCancel={this.closeConfirmModal}
              onConfirm={this.onConfirm}
              cancelButtonText={
                intl.formatMessage({
                  id: 'xpack.remoteClusters.removeButton.confirmModal.cancelButtonText',
                  defaultMessage: 'Cancel',
                })
              }
              buttonColor="danger"
              confirmButtonText={
                intl.formatMessage({
                  id: 'xpack.remoteClusters.removeButton.confirmModal.confirmButtonText',
                  defaultMessage: 'Remove',
                })
              }
              onMouseOver={this.onMouseOverModal}
            >
              {!isSingleCluster && content}
            </EuiConfirmModal>
          </EuiOverlayMask>
        );
      }

      return (
        <Fragment>
          {children(this.showConfirmModal)}
          {modal}
        </Fragment>
      );
    }
  }
);
