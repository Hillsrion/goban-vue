/**
 * Created by Ismaël on 25/02/2017.
 */
import Vue from "vue"
export default Vue.component('goban',{
    template:
        `<div :class="classList">
            <slot></slot>
        </div>`,
    data() {
        return {
            className: "goban",
            getSizeModifier() {
                if(this.size==9) {
                    return "small"
                } else if(this.size==13) {
                    return "medium"
                } else if(this.size==19) {
                    return "large"
                }
            }
        }
    },
    props: ['size'],
    computed: {
        classList() {
            return [this.className,this.className+"--"+this.getSizeModifier()];
        }
    },
})