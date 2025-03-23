import { Base } from "@/base/base";

export class Button extends Base {
    config: any
    group: any
    constructor(config, group) {
        super()
        this.config = config
        this.group = group
        this.init()
    }
    init() {
        super.init()
    }
}