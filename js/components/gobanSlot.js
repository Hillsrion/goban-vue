/**
 * Created by Ismaël on 25/02/2017.
 */
import Vue from "vue"
import EventBus from "../controllers/EventBus"
import RulesManager from "../controllers/RulesManager"
import SlotModel from "../models/slot"
export default Vue.component('gobanSlot',{
    template:
        `<div @click='onClick' @mouseover='onMouseOver' @mouseleave="onMouseLeave" :class='classList'>
            <slot v-if="shouldDisplayStone" name='stone-wrapper'></slot>
            <div :class="shadowClasses" v-show='shouldDisplayShadow'></div>
        </div>`,
    data() {
        return {
            className: "slot",
            hasShadow: false,
            time: null
        }
    },
    props: {
        x: Number,
        y: Number,
        isFillableBy: {
            type: String,
            required: true,
            default: null
        },
        belongsTo: String,
        currentPlayer: String,
        isFilled: Boolean
    },
    computed: {
        classList() {
            let modifier = this.isFilled ? 'is-filled' : '';
            let isFree = this.belongsTo && this.belongsTo!==null && this.isFillableBy!==this.currentPlayer;
            let user;
            if(isFree) {
                // Getting the state class in camelCase.
                user = "user"+this.belongsTo.substring(0,1).toUpperCase()+this.belongsTo.substring(1);
            } else if(!this.isFilled) {
                user = "is-free"
            }
            return [this.className,modifier,user]
        },
        getFilled() {
            return this.isFilled;
        },
        shadowClasses() {
            let modifier;
            let elClass = this.className+"__shadow";
            if(this.currentPlayer=="black") {
                modifier = elClass+"--black";
            } else if(this.currentPlayer=="white") {
                modifier = elClass+"--white";
            }
            return [elClass,modifier]
        },
        shouldDisplayStone() {
            return this.isFilled
        },
        shouldDisplayShadow() {
            return this.hasShadow && this.isFillableByCurrentPlayer();
        }
    },
    methods: {
        isFillableByCurrentPlayer() {
            return !this.isFilled && (this.isFillableBy==this.currentPlayer || !this.isFillableBy);
        },
        onClick() {
            if(this.isFillableByCurrentPlayer()) {
                const params = {
                    x: this.x,
                    y: this.y,
                    isFilled: true,
                    isFillableBy: "",
                    belongsTo: this.currentPlayer,
                    lastUsed: true,
                    time: new Date()
                };
                const payload = new SlotModel(params);
                EventBus.$emit("goban:playPhase",payload);
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

