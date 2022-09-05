/** Check Nebula API doc for useApp() hook */
interface App {
  getOnTheFlyWithHiddenListObject(): Promise<GenericObject>;
  getDimensionListObject(): Promise<GenericObject>;
}

interface GenericObject {
  getLayout: Function;
}

interface Field {
  qTags: string[];
  qSrcTables: string[];
  qName: string;
}

interface LibraryDimension {
  qData: {
    info: [{ qName: string }];
  };
  qInfo: {
    qId: string;
  };
}
