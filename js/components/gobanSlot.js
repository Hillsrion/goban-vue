/**
 * Created by Ismaël on 25/02/2017.
 */
import Vue from "vue"
import EventBus from "../controllers/EventBus"
import RulesManager from "../controllers/RulesManager"
import slotModel from "../models/slot"
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
            time: null,
            isFillable: this.fillable,
            belongsTo: this.owner

        }
    },
    props: {
        x: Number,
        y: Number,
        fillable: {
            type: Boolean,
            required: true,
            default: true
        },
        owner: String,
        "current-player": String,
        filled: Boolean
    },
    computed: {
        classList() {
            let modifier = this.filled ? 'is-filled' : '';
            let user;
            if(this.belongsTo && this.belongsTo!==null) {
                // Getting the state class in camelCase.
                user = "user"+this.belongsTo.substring(0,1).toUpperCase()+this.belongsTo.substring(1);
            } else if(!this.filled) {
                user = "is-free"
            }
            return [this.className,modifier,user]
        },
        getFilled() {
            return this.filled;
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
            return this.filled
        },
        shouldDisplayShadow() {
            return this.hasShadow && !this.filled && this.isFillable
        }
    },
    methods: {
        onClick() {
            if(!this.isFilled && this.isFillable) {
                if(!this.belongsTo) {
                    this.belongsTo = this.currentPlayer;
                }
                this.isFillable = false;
                this.time = new Date();
                const params = {
                    x: this.x,
                    y: this.y,
                    isFilled: true,
                    isFillable: this.isFillable,
                    belongsTo: this.belongsTo,
                    lastUsed: true,
                    time: new Date()
                };
                const payload = new slotModel(params);
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

