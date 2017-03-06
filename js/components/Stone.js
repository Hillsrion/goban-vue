/**
 * Created by Ismaël on 25/02/2017.
 */
import Vue from "vue"
export default Vue.component("stone",{
    template: "<div :class='classList'></div>",
    props: {
      color: {
          required: true,
          default: "black",
          type: String
      }
    },
    data() {
        return {
            className: "stone",
            getModifier() {
                return this.className+"--"+this.color;
            }
        }
    },
    computed: {
        classList() {
            return [this.className,this.getModifier()]
        }
    }
})