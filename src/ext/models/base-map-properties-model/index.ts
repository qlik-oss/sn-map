import { CoreBaseMapsModel } from '../../../models/base-maps-model';
import LanguageUtils from '../../utils/language';
/**
 * Keeps track of base map settings.
 * Handles localization.
 */
export class BaseMapPropertiesModel extends CoreBaseMapsModel implements BaseMapPropertiesModelInterface {
  translator: TranslatorType;

  constructor(translator: TranslatorType) {
    super();
    this.translator = translator;
  }

  /**
   * Returns a map of map names to name and projections for all available maps.
   * @param current (optional) The currently used map. If not among the available maps it will be added to the list.
   */
  public getBasemaps(current?: string) {
    const maps = this.getAvailableMaps();
    if (current && maps.indexOf(current) === -1) {
      maps.push(current);
    }
    return this.parseMaps(maps);
  }

  /**
   * Parses base map names into its parts name and projection.
   * Can also handle the old map names not following the naming standard.
   * @param loadedMaps Array of full base map names.
   * @param projFilter (optional) If set it will only include map projections that match this argument (example: "adaptive")
   */
  private parseMaps(loadedMaps: string[], projectionFilter?: string) {
    const maps = new Map<string, BaseMapInfo>();

    loadedMaps.sort();
    loadedMaps.forEach((baseMapName) => {
      const { name, projection } = this.parseMapName(baseMapName);

      if (projectionFilter && projection !== projectionFilter) {
        return; // skipping map because of not matching projFilter
      }

      if (maps.has(name)) {
        const bm = maps.get(name) as BaseMapInfo;
        bm.projections.set(projection, baseMapName);
      } else {
        const projections = new Map<string, string>();
        projections.set(projection, baseMapName);
        maps.set(name, { name, projections });
      }
    });

    this.fixBasemapOrder(maps);

    return maps;
  }

  /**
   * Splits the given base map name into name and projection.
   * E.g. "pale_adaptive" gives "pale" and "adaptive".
   * Can also handle the old map names not following the naming standard.
   * @param baseMapName Full name of the base map. Expected follow this format: <name>_<projection>
   */
  public parseMapName(baseMapName: string): ParsedMapInfo {
    const nameProj = baseMapName.split('_');
    let name = '';
    let projection = 'mercator';
    if (nameProj.length === 2) {
      name = nameProj[0];
      projection = nameProj[1];
    } else {
      // For old configuration names. (empty configurations)
      if (nameProj[0].indexOf('empty') === 0) {
        name = 'empty';
        if (nameProj[0] === 'empty') {
          projection = 'WGS-84';
        } else if (nameProj[0].indexOf('meters') > nameProj[0].indexOf('empty')) {
          projection = 'undefined meters';
        } else if (nameProj[0].indexOf('degreemercator') > nameProj[0].indexOf('empty')) {
          projection = 'mercator';
        }
      } else {
        name = nameProj[0];
      }
    }
    return {
      name,
      projection,
    };
  }

  private fixBasemapOrder(baseMaps: Map<string, BaseMapInfo>) {
    // Clone basemaps and clear original
    const baseMapsTemp = new Map<string, BaseMapInfo>();
    baseMaps.forEach((bm, name) => {
      baseMapsTemp.set(name, bm);
    });
    baseMaps.clear();
    // Move each basemap back to original following "mapOrder"
    const mapOrder = ['default', 'pale', 'dark', 'satellite'];
    mapOrder.forEach((name) => {
      if (baseMapsTemp.has(name)) {
        const bm = baseMapsTemp.get(name) as BaseMapInfo;
        baseMaps.set(name, bm);
        baseMapsTemp.delete(name);
      }
    });
    // Move the rest of the basemaps back to original (keep internal order)
    baseMapsTemp.forEach((bm, name) => {
      baseMaps.set(name, bm);
    });
    // Empty should be last of all
    if (baseMaps.has('empty')) {
      const emptyBM = baseMaps.get('empty') as BaseMapInfo;
      baseMaps.delete('empty');
      baseMaps.set('empty', emptyBM);
    }
  }

  /**
   * Gets an appropriate default value for the projection property (which contains the complete map name).
   * Keeps the current projection if possible.
   */
  public getDefaultProjection(baseMapLabel: string, current: string): string {
    // If possible get only baseMaps with same projection, otherwise get all base maps
    let baseMaps = this.getBasemapsMaintainProjection(current);
    if (!baseMaps.has(baseMapLabel)) {
      baseMaps = this.getBasemaps(current);
    }
    // Get the baseMap entry for baseMapLabel
    const bm = baseMaps.get(baseMapLabel);
    // return full base map name of first available projection
    const projections = bm?.projections;
    return projections && projections.entries().next().value[1];
  }

  /**
   * Same as getBasemaps but will only include projections that matches current if current is set
   */
  private getBasemapsMaintainProjection(current?: string) {
    const maps = this.getAvailableMaps();
    if (current && maps.indexOf(current) === -1) {
      maps.push(current);
    }
    const currentProjection = current && this.parseMapName(current).projection;
    return this.parseMaps(maps, currentProjection);
  }

  /**
   * Options for the current basemap regarding projections. Labels are projections and value are basemap identities.
   */
  public getAvailableBaseMapAndProjections(layout?: MapLayout) {
    const mapSettings = layout?.mapSettings;
    const currentMap = mapSettings?.projection || 'empty';
    const basemapLabel = mapSettings?.baseMap || 'empty';

    const basemaps = this.getBasemaps(currentMap);
    const options: Option[] = [];

    const bm = basemaps.get(basemapLabel);
    bm?.projections.forEach((value, index) => {
      const label = LanguageUtils.getGeoTranslation(index, 'projection', this.translator);
      options.push({ value, label });
    });

    return options;
  }
}
