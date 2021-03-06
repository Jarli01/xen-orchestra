import _ from 'intl'
import React from 'react'
import { map } from 'lodash'

import Icon from './icon'
import Tooltip from './tooltip'
import { alert } from './modal'

const AVAILABLE_TEMPLATE_VARS = {
  '{name}': 'templateNameInfo',
  '%': 'templateIndexInfo',
}

const showAvailableTemplateVars = () =>
  alert(
    _('availableTemplateVarsTitle'),
    <ul>
      {map(AVAILABLE_TEMPLATE_VARS, (value, key) => (
        <li key={key}>{_.keyValue(key, _(value))}</li>
      ))}
    </ul>
  )

const showNetworkConfigInfo = () =>
  alert(
    _('newVmNetworkConfigLabel'),
    <div>
      <p>
        {_('newVmNetworkConfigInfo', {
          noCloudDatasourceLink: (
            <a
              href='https://cloudinit.readthedocs.io/en/latest/topics/datasources/nocloud.html#datasource-nocloud'
              target='_blank'
            >
              {_('newVmNoCloudDatasource')}
            </a>
          ),
        })}
      </p>
      <p>
        {_('newVmNetworkConfigDocLink', {
          networkConfigDocLink: (
            <a
              href='https://cloudinit.readthedocs.io/en/latest/topics/network-config-format-v1.html'
              target='_blank'
            >
              {_('newVmNetworkConfigDoc')}
            </a>
          ),
        })}
      </p>
    </div>
  )

export const AvailableTemplateVars = () => (
  <Tooltip content={_('availableTemplateVarsInfo')}>
    <a
      className='text-info'
      style={{ cursor: 'pointer' }}
      onClick={showAvailableTemplateVars}
    >
      <Icon icon='info' />
    </a>
  </Tooltip>
)

export const NetworkConfigInfo = () => (
  <Tooltip content={_('newVmNetworkConfigTooltip')}>
    <a
      className='text-info'
      style={{ cursor: 'pointer' }}
      onClick={showNetworkConfigInfo}
    >
      <Icon icon='info' />
    </a>
  </Tooltip>
)

export const DEFAULT_CLOUD_CONFIG_TEMPLATE =
  '#cloud-config\n#hostname: {name}%\n#ssh_authorized_keys:\n#  - ssh-rsa <myKey>\n#packages:\n#  - htop\n'

// SOURCE: https://cloudinit.readthedocs.io/en/latest/topics/network-config-format-v1.html
export const DEFAULT_NETWORK_CONFIG_TEMPLATE = `#network:
#  version: 1
#  config:
#  - type: physical
#    name: eth0
#    subnets:
#      - type: dhcp`

export const CAN_CLOUD_INIT = +process.env.XOA_PLAN > 3
