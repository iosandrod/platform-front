import { reactive } from "vue";
import { staticData } from "../formEditor/testData";

class Base {
  constructor() {
    return reactive(this)
  }
}
export class Editor extends Base {
  constructor(config) {
    super()
  }
  //添加字段
  addField() { }
  //添加布局
  addLayout() { }
  loadData(data = staticData) {
    let list = data.list
    let fields = data.fields
    list.forEach((li) => {
    })
    fields.forEach(fe => {

    })
  }
}

export class pcEditor extends Editor {
  constructor(config) {
    super(config)
  }
}

export class mobileEditor extends Editor {
  constructor(config) {
    super(config)
  }
}


export class Node extends Base {
  constructor(config) {
    super()
  }
}

export class Field extends Node {
  constructor(config) {
    super(config)
  }
}

