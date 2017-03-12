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
            /**
             * I'm assigning there the slot to a copy of the current goban slots.
             * This modification will not affect the displayed goban. Only the goban property,
             * registered on the root instance can. The aim there is not evaluate the modifications which need
             * to be done to get to the next turn.
             * The modified goban on the data will flow down on this and update the goban
             */
            for(let key in this.slots) {
                if(this.slots[key].lastUsed) {
                    this.slots[key].lastUsed = false
                }
            }
            this.slots[slot.x+","+slot.y] = slot;
            const payload = RulesManager.eval(this.slots);
            EventBus.$emit("goban:endPhase",payload);
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