module DatasetUtils {
  export function sortColumns(columns: string[]) {
    return [...columns.filter((key) => key === 'geoname'), ...columns.filter((key) => key !== 'geoname')];
  }
}

export default DatasetUtils;
