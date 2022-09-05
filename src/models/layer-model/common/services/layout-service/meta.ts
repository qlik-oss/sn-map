import { getValue } from 'qlik-chart-modules';

module Meta {
  export function getLocationMeta(layout: LayerLayout, ref: string = '') {
    const hasLocation = getValue(layout, `${ref}locationOrLatitude.key`, '').trim().length > 0;
    const locationType = getValue(layout, `${ref}locationType`, '');
    if (hasLocation) {
      return {
        expressions: getLocationExpression(layout),
        hasLocation,
        isAuto: layout.locationNamesAuto,
        isLatLong: layout.isLatLong,
        locationType,
      };
    }
    return {
      hasLocation,
      isAuto: layout.locationNamesAuto,
      isLatLong: layout.isLatLong,
      locationType,
    };
  }

  export function getLocationExpression(layout: LayerLayout) {
    let expressions = [] as ExpressionMeta[];
    expressions = [...getExpressionMeta('locationOrLatitude', layout)];
    if (layout.isLatLong) {
      expressions = [...expressions, ...getExpressionMeta('longitude', layout)];
    } else if (!layout.locationNamesAuto) {
      expressions = [
        ...expressions,
        ...getExpressionMeta('locationCountry', layout),
        ...getExpressionMeta('locationAdmin1', layout),
        ...getExpressionMeta('locationAdmin2', layout),
      ];
    }
    return expressions;
  }

  export function getExpressionMeta(id: string, layout: LayerLayout) {
    let expressionMeta: ExpressionMeta[] = [];
    layout.qHyperCube.qDimensionInfo.forEach((dimension: NxDimensionInfo, dimIndex: number) => {
      dimension.qAttrExprInfo.find((attrExpr: NxAttrExprInfo, index: number) => {
        if (attrExpr.id === id) {
          expressionMeta = [
            {
              id: attrExpr.id,
              index,
              dimIndex,
              isDimension: false,
            },
          ] as ExpressionMeta[];
        }
      });

      dimension.qAttrDimInfo.find((dimExpr: NxAttrDimInfo, index: number) => {
        if (dimExpr.id === id) {
          expressionMeta = [
            {
              id: dimExpr.id,
              index,
              dimIndex,
              isDimension: true,
            },
          ] as ExpressionMeta[];
        }
      });
    });

    return expressionMeta;
  }
}

export default Meta;
