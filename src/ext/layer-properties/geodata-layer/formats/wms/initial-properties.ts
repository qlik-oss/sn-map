export default function getWMSProperties() {
  return {
    wms: {
      url: 'https://',
      attribution: '',
      version: '1.1.0',
      selectedCrs: 'EPSG:3857',
      selectedFormat: 'PNG',
      hasWmsLoaded: false,
      capabilities: {
        layers: [],
        transparent: true,
        crs: ['EPSG:3857'],
        formats: ['PNG'],
      },
    },
  };
}
