module DatasetUtils {
  export function getDatasetInfo(data: Data[]) {
    for (const index in data) {
      const row = data[index];
      const columns = Object.keys(row);
      if (row.hasOwnProperty('coords')) {
        return {
          columns,
          isGeoname: false,
        };
      }
      if (row.hasOwnProperty('geoname')) {
        return {
          columns: sortColumns(columns), // geoname needs to be first
          isGeoname: true,
        };
      }
    }
    return null;
  }

  export function sortColumns(columns: string[]) {
    return [...columns.filter((key) => key === 'geoname'), ...columns.filter((key) => key !== 'geoname')];
  }
}

export default DatasetUtils;
