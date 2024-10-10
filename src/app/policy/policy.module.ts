import { Module } from "@nestjs/common";
import { PolicyService } from "./policy.service";

@Module({
    imports: [],
    providers: [
        PolicyService
    ],
    exports: [
        PolicyService
    ]
})
export class PolicyModule { }