/**
 * @jest-environment jsdom
 */

import WMSCapabilities from '../wms-capabilities';

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<WMS_Capabilities version="1.1.1">
  <Capability>
    <Request>
      <GetMap>
        <Format>image/bmp</Format>
        <Format>image/png</Format>
      </GetMap>
    </Request>
    <Layer>
      <CRS>EPSG:3857</CRS>
      <SRS>EPSG:102100</SRS>
      <Layer queryable="1">
        <Name>0</Name>
        <Title>Foo</Title>
        <CRS>EPSG:3857</CRS>
      </Layer>
      <Layer queryable="1">
        <Name>1</Name>
        <Title>Bar</Title>
        <SRS>EPSG:102100</SRS>
      </Layer>
    </Layer>
  </Capability>
</WMS_Capabilities>`;

describe('The WMSCapbabilities', () => {
  it('layers parser should return the right number of layers', () => {
    const capabilities = new WMSCapabilities(xml);
    const layers = capabilities.layers;

    expect(layers.length).toEqual(2);
    expect(layers[0].name.trim()).toEqual('0');
    expect(layers[0].title.trim()).toEqual('Foo');
    expect(layers[1].name.trim()).toEqual('1');
    expect(layers[1].title.trim()).toEqual('Bar');
  });
  it('format parser should return the right image formats', () => {
    const capabilities = new WMSCapabilities(xml);
    const formats = capabilities.formats;
    const expected = ['image/bmp', 'image/png'];

    expect(formats.length).toEqual(2);
    expect(formats).toEqual(expected);
  });
  it('crs parser should return the right crs', () => {
    const capabilities = new WMSCapabilities(xml);
    const crs = capabilities.srs;
    const expected = ['EPSG:102100', 'EPSG:3857'];

    expect(crs.length).toEqual(2);
    expect(crs).toEqual(expected);
  });
});
