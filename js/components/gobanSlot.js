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
        isFilled: Boolean,
        koOpportunity: Boolean,
        isUsableForStrikeKo: Number,
        turnCount: Number,
        model: Object
    },
    computed: {
        classList() {
            let modifier = this.isFilled ? 'is-filled' : '';
            let isFree = this.belongsTo && this.belongsTo!==null && this.isFillableBy!==this.currentPlayer;
            let isLastUsed = this.model.setAtTurn==this.turnCount-1 ? "is-last" : '';
            let user;
            if(isFree) {
                // Getting the state class in camelCase.
                user = "user"+this.belongsTo.substring(0,1).toUpperCase()+this.belongsTo.substring(1);
            } else if(!this.isFilled) {
                user = "is-free"
            }
            return [this.className,user,modifier,isLastUsed]
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
            return !this.isFilled && (this.isFillableBy==this.currentPlayer || !this.isFillableBy || this.koOpportunity)
        },
        onClick() {
            this.play()
        },
        play() {
            if(this.isFillableByCurrentPlayer()) {
                const payload = new SlotModel(this.getNewSlotParams());
                EventBus.$emit("goban:playPhase",payload);
                // console.log(`Stone played in ${this.x},${this.y}`);
            } else {
                console.log("There's already a stone")
            }
        },
        /**
         * Params for SlotModel instanciation emitted in playPhase event.
         * @returns {{x: int, y: int, isFilled: boolean, isFillableBy: string, belongsTo: (String|*|null|string|string), lastUsed: boolean, isUsableForStrikeKo: boolean, hasKoOpportunity: boolean, relationships: Object, time: Date}}
         */
        getNewSlotParams() {
            return {
                x: this.x,
                y: this.y,
                isFilled: true,
                isFillableBy: "",
                belongsTo: this.currentPlayer,
                lastUsed: true,
                isUsableForStrikeKo: this.isUsableForStrikeKo,
                hasKoOpportunity: this.koOpportunity,
                setAtTurn: this.turnCount,
                relationships: this.model.relationships,
                time: new Date()
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

