import Decimal from "decimal.js";
import SpaceMeasure from "./SpaceMeasure";
import { SingleDimensionalSpace, TriDimensionalSpace } from "./SpaceMeasureUnit";
import WeightMeasure from "./WeightMeasure";
import WeightMeasureUnit from "./WeightMeasureUnit";

export default class PhysicalAttributes {

    constructor(
        readonly widthX: SpaceMeasure,
        readonly lengthY: SpaceMeasure,
        readonly heightZ: SpaceMeasure,
        readonly weight: WeightMeasure
    ) {
        if (this.usingSameUnit(widthX, lengthY, heightZ)) throw Error('Physical attributes\'s space measures must all use same unit');
        this.widthX = widthX;
        this.heightZ = heightZ;
        this.lengthY = lengthY;
        this.weight = weight;
    }

    public get kilogramMetricDensity(): Decimal {
        const volume = this.metricVolume.value;
        const weight = this.weight.as(WeightMeasureUnit.KG);
        return new Decimal(weight.value.div(volume).toPrecision(3));
    }

    public get metricVolume(): SpaceMeasure {
        const volume = this.widthX.as(SingleDimensionalSpace.M).value
            .times(this.lengthY.as(SingleDimensionalSpace.M).value)
            .times(this.heightZ.as(SingleDimensionalSpace.M).value);
        return new SpaceMeasure(volume, TriDimensionalSpace.M3);
    }


    private usingSameUnit(...spaceMeasures: SpaceMeasure[]): boolean {
        const firstUnit = spaceMeasures[0].unit;
        return spaceMeasures.some(sm => sm.unit !== firstUnit);
    }

}