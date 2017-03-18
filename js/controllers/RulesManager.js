/**
 * Created by Ismaël on 06/03/2017.
 */
import _ from "lodash"
class RulesManager {
    constructor() {
        this.currentGoban = [];
        this.dataTurn = {
            atariList: [],
            deathList: [],
            koList: []
        };
    }
    eval(goban) {
        if(goban) {
            this.currentGoban = goban;
            let slot;
            for(let key in this.currentGoban) {
                slot = this.currentGoban[key];
                if(this._isConnectedSlot(slot)) {
                    // This is logged for all slots
                    //console.log("slot is connected");
                    if(slot.lastUsed) {
                        console.log("slot is connected")
                    }
                } else {
                    // This is logged for all slots
                    //console.log("slot is connected");
                    if(slot.lastUsed) {
                        console.log("slot is not connected")
                    }
                    if(slot.isFilled && this._isAtari(slot)) {
                        this._putAtari(slot);
                    } else if(slot.isFilled && this._isDeadKilledBy(slot)) {
                        this._killSlot(slot);
                    }
                }
            }
            return this.currentGoban;
        } else {
            console.warn("goban given in param is null");
        }
    }
    getAtariList() {
    }
    _putAtari(slot) {
        slot.isAtari = true;
        console.log(`slot position ${slot.x},${slot.y} is in Atari`);
        this.dataTurn.atariList.push(slot);
    }
    _killSlot(slot) {
        slot.isFilled = false;
        slot.isFillableBy = this.lastKilledBy;
        slot.isAtari = false;
        console.log(`slot position ${slot.x},${slot.y} is dead`);
        this.dataTurn.deathList.push(slot);
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
        // console.log(adjacentSlots);
        let sibling;
        for(let key in adjacentSlots) {
            sibling = adjacentSlots[key];
            if(sibling && sibling.isFilled && sibling.belongsTo==slot.belongsTo) {
                return true
            }
        }
    }

    /**
     * Tests if the stone is in atari state or not.
     * @param slot
     * @returns {boolean}
     * @private
     */
    _isAtari(slot) {
        const adjacentSlots = this._getAdjacentSlots(slot);
        // console.log(adjacentSlots);
        let sibling;
        let i = 0;
        /**
         * We're gonna test if adjacents slots belong to the opponent.
         * If 3 adjacents slots do, then the slot is in atari.
         */
        for(let key in adjacentSlots) {
            sibling = adjacentSlots[key];
            if(sibling && sibling.isFilled && sibling.belongsTo!==slot.belongsTo) {
                i++;
            }
        }
        return i==3
    }
    _isKo(position) {
        return true;
    }
    /**
     * Tests if the stone is dead or not and returns the opponent color.
     * @param slot
     * @returns {boolean}
     * @private
     */
    _isDeadKilledBy(slot) {
        const adjacentSlots = this._getAdjacentSlots(slot);
        this.lastKilledBy = "";
        // console.log(adjacentSlots);
        let sibling;
        let i = 0;
        let killedBy = false;
        /**
         * We're gonna test if adjacents slots belong to the opponent.
         * If 4 adjacents slots do, then the slot is dead.
         */
        for(let key in adjacentSlots) {
            sibling = adjacentSlots[key];
            if(sibling && sibling.isFilled && sibling.belongsTo!==slot.belongsTo) {
                i++;
            }
            if(i==4) {
                killedBy = sibling.belongsTo;
                this.lastKilledBy = killedBy
            }
        }
        return killedBy;
    }
    getConnectedArea() {

    }
    getTakenStoneList() {
    }

}


export default new RulesManager()