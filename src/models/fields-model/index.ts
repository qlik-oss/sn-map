import LayerType from '../../utils/const/layer-type';

const POINT_TAG = '$geopoint';

export class FieldsModel {
  private static fields: Field[] = [];
  private static dimensions: LibraryDimension[] = [];

  static async load(app: App) {
    try {
      await app
        .getOnTheFlyWithHiddenListObject()
        .then((hiddenList: GenericObject) => {
          return hiddenList.getLayout();
        })
        .then((fields: Field[]) => {
          FieldsModel.fields = fields;
        });
      await app.getDimensionListObject().then((dimensionList: GenericObject) => {
        dimensionList.getLayout().then((dims: LibraryDimension[]) => {
          FieldsModel.dimensions = dims;
        });
      });
    } catch {}
  }

  /**
   * For testing this class it can be loaded with these fields and dimensions.
   */
  static loadTest(fields: Field[], dimensions: LibraryDimension[]) {
    FieldsModel.fields = fields;
    FieldsModel.dimensions = dimensions;
  }

  static fieldNameFromLibraryDimension(libraryId: string) {
    for (const i in FieldsModel.dimensions) {
      const dimensionId = FieldsModel.dimensions[i].qInfo.qId;
      if (dimensionId === libraryId) {
        return FieldsModel.getFirstFieldName(FieldsModel.dimensions[i]);
      }
    }
    return null;
  }

  static getFirstFieldName(dim: LibraryDimension) {
    return dim.qData.info[0].qName;
  }

  static relatedFieldName(fieldName: string, type: string) {
    const field = FieldsModel.findField(fieldName);
    if (field) {
      return FieldsModel.relatedField(field, type);
    }
    return null;
  }

  static findField(name: string) {
    for (const i in FieldsModel.fields) {
      const field = FieldsModel.fields[i];
      if (field.qName === name) {
        return field;
      }
    }
    return null;
  }

  static relatedField(field: Field, type: string) {
    const relatedFields = FieldsModel.getRelatedFields(field, FieldsModel.fields);
    for (const j in relatedFields) {
      const rField = relatedFields[j];
      if (type === LayerType.POINT && FieldsModel.isNormalGeoPointField(rField)) {
        return rField.qName;
      }
    }
    return null;
  }

  static getRelatedFields(field: Field, fieldList: Field[]) {
    const relatedFieldNames = FieldsModel.getRelatedFieldNames(field);
    const arr: Field[] = [];

    for (let i = 0; i < fieldList.length; i++) {
      if (relatedFieldNames.indexOf(fieldList[i].qName) >= 0) {
        arr.push(fieldList[i]);
      }
    }

    return arr;
  }

  static getRelatedFieldNames(field: Field) {
    const qTags = field.qTags,
      n = qTags ? qTags.length : 0;
    const arr: string[] = [];
    for (let i = 0; i < n; i++) {
      if (qTags[i].substring(0, 9) === '$relates_') {
        arr.push(qTags[i].substring(9, qTags[i].length));
      }
    }
    return arr;
  }

  static isNormalGeoPointField(field: Field) {
    return field.qTags.indexOf(POINT_TAG) > -1 || field.qTags.indexOf('$geotag') > -1;
  }
}
