/**
 * Created by Ismaël on 25/02/2017.
 */
import Vue from "vue"
import EventBus from "../controllers/EventBus"
import RulesManager from "../controllers/RulesManager"
const gobanComponent = Vue.component('goban',{
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
    props: ['size','slots'],
    computed: {
        classList() {
            return [this.className,this.className+"--"+this.getSizeModifier()];
        }
    },
    methods: {
        playPhase(slot) {
            this.slots[slot.x+","+slot.y] = slot;
            RulesManager.eval(this.slots);
            EventBus.$emit("goban:endPhase");
        }
    },
    created() {
        // If I don't bind an anonymous function to the scope, it throws that payload is undefined
        EventBus.$on("goban:playPhase", (function (payload) {
            this.playPhase(payload)
        }).bind(this));
    }
});

export default gobanComponent