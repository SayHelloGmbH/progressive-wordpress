import React from 'react';
import { ShadowBox } from '../../theme';

const VapidResetModal = ({ onClose }: { onClose: (show: boolean) => void }) => {
  return (
    <ShadowBox close={onClose} title="sure" size="small">
      sure?
    </ShadowBox>
  );
};

export default VapidResetModal;
