/**
 * Created by Ismaël on 25/02/2017.
 */
import Vue from "vue"
export default Vue.component("stone",{
    template: "<div :class='classList'></div>",
    data() {
        return {
            className: "stone"
        }
    },
    computed: {
        classList() {
            return [this.className]
        }
    }
})