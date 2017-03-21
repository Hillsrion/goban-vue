/**
 * Created by Ismaël on 06/03/2017.
 */

class RulesManager {
    constructor() {
        this.currentGoban = [];
        this.dataTurn = {
            atariList: [],
            deathList: [],
            koList: [],
            koOpportunity: []
        };
        this.cachedResults = new Map();
    }

    eval(goban) {
        if (goban) {
            this.currentGoban = goban;
            let slot;
            for (let key in this.currentGoban) {
                slot = this.currentGoban[key];
                if (this._isConnectedSlot(slot)) {
                    // This is logged for all slots
                    //console.log("slot is connected");
                    if (slot.lastUsed) {
                        // console.log("slot is connected")
                    }
                } else {
                    // This is logged for all slots
                    //console.log("slot is connected");
                    if (slot.lastUsed) {
                        // console.log("slot is not connected")
                    }
                    if (slot.isFilled && this._isAtari(slot)) {
                        this._putAtari(slot);
                    } else if (slot.isFilled && this._isDeadKilledBy(slot)) {
                        this._killSingleSlot(slot);
                    }
                    if(slot.isFilled && this._hasKoOpportunity(slot)) {
                        this.dataTurn.koOpportunity.push(slot);
                    }
                    if (!slot.isFilled && this._isUnfillableByOpponent(slot)) {
                        slot.isFillableBy = this.cachedResults.get("lastReference");
                    }
                }
            }
            return this.currentGoban;
        } else {
            console.warn("goban given in param is null");
        }
    }
    _getConnectedArea() {

    }
    _putAtari(slot) {
        slot.isAtari = true;
        console.log(`slot position ${slot.x},${slot.y} is in Atari`);
        this.dataTurn.atariList.push(slot);
    }

    _killSingleSlot(slot) {
        /**
         *
         * Here we're gonna reset the slot state so it can be refilled if possible.
         */
        slot.isFilled = false;
        slot.isFillableBy = this.cachedResults.get("lastKilledBy");
        slot.isAtari = false;
        slot.belongsTo = "";
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
        let goban = this.currentGoban;
        /**
         * I parse x and y as int, and make the calculations aside
         * because it can be interpreted as a concatenation
         * 1 + 1 can result as 11 instead of 2
         * @type {{x1: {slotModel}, x2: {slotModel}, y1: {slotModel}, y2: {slotModel}}}
         */
        const adjacentSlots = {
            x1: goban[(x - 1) + "," + y],
            x2: goban[(x + 1) + "," + y],
            y1: goban[x + "," + (y - 1)],
            y2: goban[x + "," + (y + 1)]
        };
        return adjacentSlots;
    }

    _isConnectedSlot(slot) {
        const adjacentSlots = this._getAdjacentSlots(slot);
        // console.log(adjacentSlots);
        let sibling;
        for (let key in adjacentSlots) {
            sibling = adjacentSlots[key];
            if (sibling && sibling.isFilled && sibling.belongsTo == slot.belongsTo) {
                return true
            }
        }
    }

    /**
     * Returns true if the unfilled slot given in parameter mustn't be filled by the opponent
     * @param slot
     * @returns {boolean}
     * @private
     */
    _isUnfillableByOpponent(slot) {
        const adjacentSlots = this._getAdjacentSlots(slot);
        // console.log(adjacentSlots);
        let sibling;
        let owners = {
            reference: "",
            colors: []
        };
        let result;
        for (let key in adjacentSlots) {
            sibling = adjacentSlots[key];
            if (sibling && sibling.isFilled) {
                owners.colors.push(sibling.belongsTo);
                if(!owners.reference) {
                    owners.reference = sibling.belongsTo;
                    this.cachedResults('lastReference',sibling.belongsTo)
                }
            } else if(!sibling) {
                owners.colors.push("");
            }
        }
        // if reference property is a empty chain, then none of the adjacent slots belong to someone.
        if(owners.reference=="") {
            return false
        } else {
            // If the 4 adjacent slots has the same owner or are empty for some, then the slot if unfillable for the opponent.
            const predicate = owners.colors.every((slot) => {
                return slot==owners.reference || slot==""
            });
            return predicate && owners.colors.length==4;
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
        for (let key in adjacentSlots) {
            sibling = adjacentSlots[key];
            if (sibling && sibling.isFilled && sibling.belongsTo !== slot.belongsTo) {
                i++;
            } else if(!sibling) {
                // If sibling doesn't exist, it's that we're on a border
                i++;
            }
        }
        return i == 3
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
        // console.log(adjacentSlots);
        let sibling;
        let i = 0;
        let killedBy = false;
        /**
         * We're gonna test if adjacents slots belong to the opponent.
         * If 4 adjacents slots do, then the slot is dead.
         */
        for (let key in adjacentSlots) {
            sibling = adjacentSlots[key];
            if (sibling && sibling.isFilled && sibling.belongsTo !== slot.belongsTo) {
                i++;
            } else if(!sibling) {
                // If sibling doesn't exist, it's that we're on a border
                i++;
            }
            if (i == 4) {
                this.cachedResults.set("lastKilledBy",sibling.belongsTo);
            }
        }
        return killedBy;
    }

    _hasKoOpportunity(slot) {
        const adjacentSlots = this._getAdjacentSlots(slot);

    }
}



export default new RulesManager()