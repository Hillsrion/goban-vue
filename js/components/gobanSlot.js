/**
 * Created by Ismaël on 25/02/2017.
 */
import Vue from "vue"
import EventBus from "../controllers/EventBus"
import RulesManager from "../controllers/RulesManager"
export default Vue.component('gobanSlot',{
    template:
        `<div @click='onClick' @mouseover='onMouseOver' @mouseleave="onMouseLeave" :class='classList'>
            <slot v-if="shouldDisplayStone" name='stone-wrapper'></slot>
            <div :class="shadowClasses" v-show='shouldDisplayShadow'></div>
        </div>`,
    data() {
        return {
            className: "slot",
            isFilled: false,
            hasShadow: false
        }
    },
    props: {
        x: Number,
        y: Number
    },
    computed: {
        classList() {
            let modifier = this.isFilled ? 'is-filled' : '';
            return [this.className,modifier]
        },
        shadowClasses() {
            return [this.className+"__shadow"]
        },
        shouldDisplayStone() {
            return this.isFilled
        },
        shouldDisplayShadow() {
            return this.hasShadow && !this.isFilled
        }
    },
    methods: {
        onClick() {
            if(!this.isFilled && RulesManager.canSetStone(this.position)) {
                this.isFilled = true;
                EventBus.$emit("gobanPlay",this.position);
            } else {
                console.log("There's already a stone")
            }
        },
        onMouseOver() {
            // console.log('on');
            this.hasShadow = true;
        },
        onMouseLeave() {
            // console.log('off');
            this.hasShadow = false;
        }
    }
})