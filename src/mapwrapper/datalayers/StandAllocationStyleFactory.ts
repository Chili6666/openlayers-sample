import { IStyleFactory } from "../IStyleFactory";
import Feature from "ol/Feature";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Icon from "ol/style/Icon";
import Circle from "ol/style/Circle";
import { MapItemVisualization } from "@/models/MapItemVisualization";
import StyleService from "@/services/StyleService";
import PictogramService from "@/services/PictogramService";
import { IStandAllocation } from "@/models/IStandAllocation";

export class StandAllocationStyleFactory implements IStyleFactory {

    createStyles(feature: Feature, resolution: number): Style[] {
        const mapItemVisualization: MapItemVisualization = feature.get('mapItemVisualization');
        const direction = (mapItemVisualization.direction !== undefined ? mapItemVisualization.direction : 0);
        const standAllocation: IStandAllocation = feature.get('mapDataItem');

        let style = StyleService.getStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString());
        let alertStyle = StyleService.getStyle(mapItemVisualization.pictogramId + 'STANDALLOCATION_ALERT', mapItemVisualization.toString());
        if (!alertStyle) {
            alertStyle = new Style({
                image: new Circle({
                    radius: 5,
                    stroke: new Stroke({
                        color: '#fff',
                    }),
                    fill: new Fill({
                        color: 'red',
                    }),
                }),
                text: new Text({
                    text: '1',
                    fill: new Fill({
                        color: '#fff',
                    }),
                }),
            });
            console.log('create SA alertstyle');
            StyleService.setStyle(mapItemVisualization.pictogramId + 'STANDALLOCATION_ALERT', mapItemVisualization.toString(), alertStyle);
        }

        if (!style) {
            const shape = PictogramService.getPictogram(mapItemVisualization.pictogramId);
            style = new Style({
                image: new Icon({
                    opacity: 1,
                    src: "data:image/svg+xml;utf8," + shape,
                    rotateWithView: feature.get('rotateWithView'),
                    rotation: direction,
                }),
            });

            StyleService.setStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString(), style);
        }

        //IMAGE--------------
        //change colors and other relavent features
        if (standAllocation.EntityId === 'StandAllocation.801782836') {
            style.getImage().setScale(1 / resolution);
            alertStyle.getImage().setScale(1 / resolution);
            return [style, alertStyle];
        }
        else {
            style.getImage().setScale(1 / resolution);
            return [style];
        }
    }
}

export default new StandAllocationStyleFactory();
