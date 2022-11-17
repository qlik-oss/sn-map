export default () => ({
  type: 'sn-map',
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: 'ZMquS',
          qType: 'sn-map',
        },
        qMeta: {
          privileges: ['read', 'update', 'delete', 'exportdata'],
        },
        qSelectionInfo: {},
        gaLayers: [
          {
            type: 'PointLayer',
            cId: 'buTRjv',
            qHyperCube: {
              qSize: {
                qcx: 1,
                qcy: 10,
              },
              qDimensionInfo: [
                {
                  qFallbackTitle: 'id',
                  qApprMaxGlyphCount: 2,
                  qCardinal: 10,
                  qSortIndicator: 'A',
                  qGroupFallbackTitles: ['id'],
                  qGroupPos: 0,
                  qStateCounts: {
                    qLocked: 0,
                    qSelected: 0,
                    qOption: 10,
                    qDeselected: 0,
                    qAlternative: 0,
                    qExcluded: 0,
                    qSelectedExcluded: 0,
                    qLockedExcluded: 0,
                  },
                  qTags: ['$numeric', '$integer'],
                  qDimensionType: 'N',
                  qGrouping: 'N',
                  qNumFormat: {
                    qType: 'U',
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  qGroupFieldDefs: ['id'],
                  qMin: 1,
                  qMax: 10,
                  qContinuousAxes: true,
                  qAttrExprInfo: [
                    {
                      qMin: 57.7089,
                      qMax: 57.7089,
                      qFallbackTitle: '=latitude',
                      qMinText: '57.7089',
                      qMaxText: '57.7089',
                      qNumFormat: {
                        qType: 'U',
                        qnDec: 0,
                        qUseThou: 0,
                      },
                      qIsAutoFormat: true,
                      id: 'locationOrLatitude',
                    },
                    {
                      qMin: 11.9746,
                      qMax: 11.9746,
                      qFallbackTitle: '=longitude',
                      qMinText: '11.9746',
                      qMaxText: '11.9746',
                      qNumFormat: {
                        qType: 'U',
                        qnDec: 0,
                        qUseThou: 0,
                      },
                      qIsAutoFormat: true,
                      id: 'longitude',
                    },
                  ],
                  qAttrDimInfo: [],
                  qCardinalities: {
                    qCardinal: 10,
                    qHypercubeCardinal: 10,
                    qAllValuesCardinal: -1,
                  },
                  autoSort: true,
                  cId: 'XmQsW',
                },
              ],
              qMeasureInfo: [],
              qEffectiveInterColumnSortOrder: [0],
              qGrandTotalRow: [],
              qDataPages: [
                {
                  qMatrix: [
                    [
                      {
                        qText: '1',
                        qNum: 1,
                        qElemNumber: 0,
                        qState: 'O',
                        qAttrExps: {
                          qValues: [
                            {
                              qText: '57.7089',
                              qNum: 57.7089,
                            },
                            {
                              qText: '11.9746',
                              qNum: 11.9746,
                            },
                          ],
                        },
                      },
                    ],
                    [
                      {
                        qText: '2',
                        qNum: 2,
                        qElemNumber: 1,
                        qState: 'O',
                        qAttrExps: {
                          qValues: [
                            {
                              qText: '55.6761° N',
                              qNum: 'NaN',
                            },
                            {
                              qText: '12.5683° E',
                              qNum: 'NaN',
                            },
                          ],
                        },
                      },
                    ],
                    [
                      {
                        qText: '3',
                        qNum: 3,
                        qElemNumber: 2,
                        qState: 'O',
                        qAttrExps: {
                          qValues: [
                            {
                              qText: '59.3293° N',
                              qNum: 'NaN',
                            },
                            {
                              qText: '18.0686° E',
                              qNum: 'NaN',
                            },
                          ],
                        },
                      },
                    ],
                    [
                      {
                        qText: '4',
                        qNum: 4,
                        qElemNumber: 3,
                        qState: 'O',
                        qAttrExps: {
                          qValues: [
                            {
                              qText: '48.8566° N',
                              qNum: 'NaN',
                            },
                            {
                              qText: '2.3522° E',
                              qNum: 'NaN',
                            },
                          ],
                        },
                      },
                    ],
                    [
                      {
                        qText: '5',
                        qNum: 5,
                        qElemNumber: 4,
                        qState: 'O',
                        qAttrExps: {
                          qValues: [
                            {
                              qText: '51.5072° N',
                              qNum: 'NaN',
                            },
                            {
                              qText: '0.1276° W',
                              qNum: 'NaN',
                            },
                          ],
                        },
                      },
                    ],
                    [
                      {
                        qText: '6',
                        qNum: 6,
                        qElemNumber: 5,
                        qState: 'O',
                        qAttrExps: {
                          qValues: [
                            {
                              qText: '52.5200° N',
                              qNum: 'NaN',
                            },
                            {
                              qText: '13.4050° E',
                              qNum: 'NaN',
                            },
                          ],
                        },
                      },
                    ],
                    [
                      {
                        qText: '7',
                        qNum: 7,
                        qElemNumber: 6,
                        qState: 'O',
                        qAttrExps: {
                          qValues: [
                            {
                              qText: '52.3676° N',
                              qNum: 'NaN',
                            },
                            {
                              qText: '4.9041° E',
                              qNum: 'NaN',
                            },
                          ],
                        },
                      },
                    ],
                    [
                      {
                        qText: '8',
                        qNum: 8,
                        qElemNumber: 7,
                        qState: 'O',
                        qAttrExps: {
                          qValues: [
                            {
                              qText: '40.7128° N',
                              qNum: 'NaN',
                            },
                            {
                              qText: '74.0060° W',
                              qNum: 'NaN',
                            },
                          ],
                        },
                      },
                    ],
                    [
                      {
                        qText: '9',
                        qNum: 9,
                        qElemNumber: 8,
                        qState: 'O',
                        qAttrExps: {
                          qValues: [
                            {
                              qText: '33.9249° S',
                              qNum: 'NaN',
                            },
                            {
                              qText: '18.4241° E',
                              qNum: 'NaN',
                            },
                          ],
                        },
                      },
                    ],
                    [
                      {
                        qText: '10',
                        qNum: 10,
                        qElemNumber: 9,
                        qState: 'O',
                        qAttrExps: {
                          qValues: [
                            {
                              qText: '28.6139° N',
                              qNum: 'NaN',
                            },
                            {
                              qText: '77.2090° E',
                              qNum: 'NaN',
                            },
                          ],
                        },
                      },
                    ],
                  ],
                  qTails: [
                    {
                      qUp: 0,
                      qDown: 0,
                    },
                  ],
                  qArea: {
                    qLeft: 0,
                    qTop: 0,
                    qWidth: 1,
                    qHeight: 10,
                  },
                },
              ],
              qPivotDataPages: [],
              qStackedDataPages: [],
              qMode: 'S',
              qNoOfLeftDims: -1,
              qTreeNodesOnDim: [],
              qColumnOrder: [],
            },
            size: {
              radiusValueMin: 0,
              radiusValueMax: 1,
              autoRadiusValueRange: true,
              expression: {
                key: '',
                label: '',
                type: '',
              },
              label: '',
              slider: [8, 24],
              sliderSingle: 16,
              shape: 'points',
              formatting: {
                qNumFormat: {
                  qType: 'U',
                },
              },
            },
            color: {
              auto: false,
              mode: 'primary',
              paletteColor: {
                index: 6,
                color: '#4477aa',
              },
              useDimColVal: false,
              useMeasureGradient: false,
            },
            locationOrLatitude: {
              label: 'id',
              key: '=latitude',
              type: 'expression',
            },
            locationDefault: '[id]',
            locationNamesAuto: true,
            locationType: '',
            locationCountry: {
              key: '',
              label: '',
              type: '',
            },
            locationAdmin1: {
              key: '',
              label: '',
              type: '',
            },
            locationAdmin2: {
              key: '',
              label: '',
              type: '',
            },
            longitude: {
              label: 'longitude',
              key: '=longitude',
              type: 'expression',
            },
            isLatLong: true,
            id: 'buTRjv',
          },
        ],
        mapSettings: {
          _layerType: '',
          baseMap: 'default',
          projection: 'default',
          mapLanguage: 'auto',
          useImperialUnits: false,
          autoZoomOnSelection: false,
          showScaleBar: true,
          showDebugInfo: false,
        },
        showTitles: true,
        title: '',
        subtitle: '',
        footnote: '',
        disableNavMenu: false,
        showDetails: false,
        showDetailsExpression: false,
        visualization: 'sn-map',
        version: '0.6.0',
        extensionMeta: {
          translationKey: '',
          icon: 'puzzle',
          iconChar: 'puzzle',
          isLibraryItem: true,
          visible: true,
          name: 'sn-map',
          description: 'An agnostic map',
          template: 'sn-map',
          iconPath:
            'M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z',
          isThirdParty: true,
          version: '0.6.0',
          author: 'QlikTech International AB',
          type: 'visualization',
          supernova: true,
        },
      },

      getHyperCubeData: [
        {
          qMatrix: [
            [
              {
                qText: '1',
                qNum: 1,
                qElemNumber: 0,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '57.7089',
                      qNum: 57.7089,
                    },
                    {
                      qText: '11.9746',
                      qNum: 11.9746,
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: '2',
                qNum: 2,
                qElemNumber: 1,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '55.6761° N',
                      qNum: 'NaN',
                    },
                    {
                      qText: '12.5683° E',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: '3',
                qNum: 3,
                qElemNumber: 2,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '59.3293° N',
                      qNum: 'NaN',
                    },
                    {
                      qText: '18.0686° E',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: '4',
                qNum: 4,
                qElemNumber: 3,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '48.8566° N',
                      qNum: 'NaN',
                    },
                    {
                      qText: '2.3522° E',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: '5',
                qNum: 5,
                qElemNumber: 4,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '51.5072° N',
                      qNum: 'NaN',
                    },
                    {
                      qText: '0.1276° W',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: '6',
                qNum: 6,
                qElemNumber: 5,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '52.5200° N',
                      qNum: 'NaN',
                    },
                    {
                      qText: '13.4050° E',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: '7',
                qNum: 7,
                qElemNumber: 6,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '52.3676° N',
                      qNum: 'NaN',
                    },
                    {
                      qText: '4.9041° E',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: '8',
                qNum: 8,
                qElemNumber: 7,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '40.7128° N',
                      qNum: 'NaN',
                    },
                    {
                      qText: '74.0060° W',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: '9',
                qNum: 9,
                qElemNumber: 8,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '33.9249° S',
                      qNum: 'NaN',
                    },
                    {
                      qText: '18.4241° E',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
            [
              {
                qText: '10',
                qNum: 10,
                qElemNumber: 9,
                qState: 'O',
                qAttrExps: {
                  qValues: [
                    {
                      qText: '28.6139° N',
                      qNum: 'NaN',
                    },
                    {
                      qText: '77.2090° E',
                      qNum: 'NaN',
                    },
                  ],
                },
              },
            ],
          ],
          qTails: [
            {
              qUp: 0,
              qDown: 0,
            },
          ],
          qArea: {
            qLeft: 0,
            qTop: 0,
            qWidth: 1,
            qHeight: 10,
          },
        },
      ],
    },
  ],
});
