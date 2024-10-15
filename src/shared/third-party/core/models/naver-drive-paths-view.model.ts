import { ApiProperty } from "@nestjs/swagger";

export class NDPTSummary {
    @ApiProperty()
    readonly start: any;

    @ApiProperty()
    readonly goal: any;

    @ApiProperty()
    readonly distance: number;

    @ApiProperty()
    readonly duration: number;

    @ApiProperty()
    readonly departureTime: Date;

    @ApiProperty()
    readonly bbox: any[];

    @ApiProperty()
    readonly tollFare: number;

    @ApiProperty()
    readonly taxiFare: number;

    @ApiProperty()
    readonly fuelPrice: number;
}

export class NDPTSection {
    @ApiProperty()
    readonly pointIndex: number;

    @ApiProperty()
    readonly pointCount: number;

    @ApiProperty()
    readonly distance: number;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly congestion: number;

    @ApiProperty()
    readonly speed: number;
}

export class NDPTGuide {
    @ApiProperty()
    readonly pointIndex: number;

    @ApiProperty()
    readonly type: number;

    @ApiProperty()
    readonly instructions: string;

    @ApiProperty()
    readonly distance: number;

    @ApiProperty()
    readonly duration: number;
}

export class NDPTrafast {
    @ApiProperty({ type: NDPTSummary })
    readonly summary: NDPTSummary;

    @ApiProperty({ default: [[123, 123], [123, 123]] })
    readonly path: number[][];

    @ApiProperty({ type: [NDPTSection] })
    readonly section: NDPTSection[];

    @ApiProperty({ type: [NDPTGuide] })
    readonly guide: NDPTGuide[];
}

export class NDPRoute {
    @ApiProperty({ type: [NDPTrafast] })
    readonly trafast: NDPTrafast[];
}

export class NaverDrivePathsViewModel {
    @ApiProperty({ type: NDPRoute })
    readonly route: NDPRoute;
}