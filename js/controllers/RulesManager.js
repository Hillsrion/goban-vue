/**
 * Created by Ismaël on 06/03/2017.
 */
import _ from "lodash"
class RulesManager {
    constructor() {
        this.currentGoban = [];
        this.dataTurn = {};
    }
    eval(goban) {
        if(goban) {
            this.currentGoban = goban;
            let slot;
            for(let key in this.currentGoban) {
                slot = this.currentGoban[key];
                console.log(slot);
                if(this._isConnectedSlot(slot)) {
                    // Log this for all slots
                    console.log("slot is connected");
                } else {
                    console.log("slot is not connected");
                }
            }
            return this.currentGoban;
        } else {
            console.warn("goban given in param is null");
        }
    }
    getAtariList() {
    }
    _getAdjacentSlots(slot) {
        /**
         *  In the case we're dealing slots close the bounds of the goban,
         *  x1 and y1 might are undefined because the slot after simply doesn't exist.
         *  Be careful to test if properties exist when you use this function.
         */
        const x = parseInt(slot.x);
        const y = parseInt(slot.y);
        /**
         * I parse x and y as int, and make the calculations aside
         * because it can be interpreted as a concatenation
         * 1 + 1 can result as 11 instead of 2
         * @type {{x1: {slotModel}, x2: {slotModel}, y1: {slotModel}, y2: {slotModel}}}
         */
        const adjacentSlots = {
            x1: this.currentGoban[(x-1)+","+y],
            x2: this.currentGoban[(x+1)+","+y],
            y1: this.currentGoban[x+","+(y-1)],
            y2: this.currentGoban[x+","+(y+1)]
        };
        return adjacentSlots;
    }
    _isConnectedSlot(slot) {
        const adjacentSlots = this._getAdjacentSlots(slot);
        console.log(adjacentSlots);
        let sibling;
        for(let key in adjacentSlots) {
            sibling = adjacentSlots[key];
            if(sibling && sibling.isFilled && sibling.belongsTo==slot.belongsTo) {
                return true
            }
        }
    }
    /**
     * Allows to know if we can set the stone at the position given in params
     * if the stone is not in atari or is in ko situation
     * @param {string} position
     * @returns {boolean}
     */
    canSetStone(position) {
        return true;
        if(!this.isAtari(position) || this.isKo(position)) {
            return true;
        } else {
            return false;
        }
    }

    _isAtari(position) {
        return false;
    }
    _isKo(position) {
        return true;
    }
    getConnectedArea() {

    }
    getTakenStoneList() {
    }

}


export default new RulesManager()