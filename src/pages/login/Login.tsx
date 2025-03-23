import { defineComponent } from "vue";
import { erFormEditor } from "@ER/formEditor";
import buttonCom from "@/buttonGroup/buttonCom";
import tabCom from "@/buttonGroup/tabCom";
import buttonGroupCom from "@/buttonGroup/buttonGroupCom";
import d from "../home/d.vue";
export default defineComponent({
  components: {
    erFormEditor,
    buttonCom,
    tabCom,
    buttonGroupCom,
    d
  },
  setup(props) {
    const formConfig = {
      itemSpan: 24,
      items: [
        {
          field: "email",
          label: "邮箱",
          required: true
        }, {
          field: "password",
          label: "密码",
          required: true,
          password: true
        }
      ]
    }
    let style = { width: '400px', margin: '0 auto' }
    return () => {
      let com = <buttonGroupCom items={[{
        label: '按钮1'
      }, {
        label: '按钮2'
      }, {
        label: '按钮3'
      },
      {
        label: '按钮4'
      }, {
        label: '按钮5'
      },].slice(0, 5)}></buttonGroupCom>
      com = <erFormEditor isDesign={true} {...formConfig}></erFormEditor>
      // com=<buttonGroupCom></buttonGroupCom>
      // com=<d></d>
      let com1 = <d></d>
      let _com = <div>
        <div id="box" class="slow-appear">点击按钮后我才会出现</div>
        <button onClick={() => { document.getElementById('box').classList.add('show') }}>点击我</button>
        {/* <erFormEditor isDesign={true} {...formConfig}></erFormEditor> */}
        {/* <buttonCom></buttonCom> */}
        { }
        {/* <tabCom>  </tabCom> */}
        {com}
        {/* {com1} */}
      </div>
      return _com
    }
  }
})