import getTMSProperties from './tms/initial-properties';
import getwMSProperties from './wms/initial-properties';
import getImageProperties from './image/initial-properties';

export default function getFormatsProperties() {
  return {
    title: '',
    dataType: 'tms',
    ...getTMSProperties(),
    ...getwMSProperties(),
    ...getImageProperties(),
  };
}
