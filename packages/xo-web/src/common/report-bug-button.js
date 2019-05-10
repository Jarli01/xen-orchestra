import _ from 'intl'
import decorate from 'apply-decorators'
import defined from '@xen-orchestra/defined'
import PropTypes from 'prop-types'
import React from 'react'
import { identity, omit } from 'lodash'
import { injectState, provideState } from 'reaclette'
import { post } from 'fetch'

import ActionButton from './action-button'
import ActionRowButton from './action-row-button'

export const CAN_REPORT_BUG = process.env.XOA_PLAN > 1

export const reportBug = ({ formatMessage, message, title }) => {
  const encodedTitle = encodeURIComponent(title == null ? '' : title)
  const encodedMessage = encodeURIComponent(
    message == null
      ? ''
      : formatMessage === undefined
      ? message
      : formatMessage(message)
  )

  window.open(
    process.env.XOA_PLAN < 5
      ? `https://xen-orchestra.com/#!/member/support?title=${encodedTitle}&message=${encodedMessage}`
      : `https://github.com/vatesfr/xen-orchestra/issues/new?title=${encodedTitle}&body=${encodedMessage}`
  )
}

const SUPPORT_PANEL_URL = `${window.location.origin}/supportPanel/create/ticket`

const reportBugWithFiles = ({
  files,
  formatMessage = identity,
  message,
  title,
}) => {
  const { FormData, open } = window

  const formData = new FormData()
  formData.append('title', title)
  if (message !== undefined) {
    formData.append('message', formatMessage(message))
  }
  files.forEach(({ file, name }) => {
    formData.append('attachments', file, name)
  })

  return post(SUPPORT_PANEL_URL, formData).then(async res => {
    const status = defined(res.status, res.statusCode)
    if (status !== 200) {
      throw new Error('cannot get the new ticket URL')
    }
    return open(await res.text())
  })
}

const REPORT_BUG_BUTTON_PROP_TYPES = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.oneOfType([
        PropTypes.instanceOf(window.Blob),
        PropTypes.instanceOf(window.File),
      ]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  formatMessage: PropTypes.func,
  message: PropTypes.string,
  rowButton: PropTypes.bool,
  title: PropTypes.string.isRequired,
}

const ReportBugButton = decorate([
  provideState({
    effects: {
      async reportBug() {
        const { props } = this
        props.files !== undefined
          ? await reportBugWithFiles(props)
          : reportBug(props)
      },
    },
    computed: {
      Button: (state, { rowButton }) =>
        rowButton ? ActionRowButton : ActionButton,
      buttonProps: (state, props) =>
        omit(props, Object.keys(REPORT_BUG_BUTTON_PROP_TYPES)),
    },
  }),
  injectState,
  ({ state, effects }) => (
    <state.Button
      {...state.buttonProps}
      handler={effects.reportBug}
      icon='bug'
      tooltip={_('reportBug')}
    />
  ),
])

ReportBugButton.propTypes = REPORT_BUG_BUTTON_PROP_TYPES

export { ReportBugButton as default }
