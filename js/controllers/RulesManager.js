/**
 * Created by Ismaël on 06/03/2017.
 */
import EyeModel from "../models/eye"
class RulesManager {
    constructor() {
        this.currentGoban = [];
        this.dataTurn = this.getDefaultDataturn();
        this.turnCount = 1;
        this.history = {};
    }
    getDefaultDataturn() {
        return {
            atariList: [],
            deathList: [],
            koList: [],
            potentialKoList: [],
            eyes: [],
        };
    }
    eval(goban,turnCount) {
        this.dataTurn = this.getDefaultDataturn();
        this.turnCount = turnCount;
        this.lastKoOpportunity = null;
        this._createTurnHistory();
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
                    if(slot.isFilled) {
                        /**
                         * Important : Let this _hasKoOpportunity execute first.
                         * If we don't, a ko  which should kill a stone can fail because
                         * the stone is already surrounded by 4 opponent stone.
                         * So the ko doesn't work
                         */
                        if(this._hasKoOpportunity(slot)) {
                            this.dataTurn.potentialKoList.push(this.lastKoOpportunity);
                            this.lastKoOpportunity.hasKoOpportunity = true;
                        }
                        if (this._isAtari(slot)) {
                            this._putAtari(slot);
                        } else if (!slot.hasKoOpportunity && this._isDeadKilledBy(slot)) {
                            this._killSingleSlot(slot);
                            this._initKoStrike(slot);
                            // this.dataTurn.koList.push(slot);
                        }
                    } else {
                        if (this._isUnfillableByOpponent(slot)) {
                            slot.isFillableBy = this.lastReference;
                        }
                    }
                }
            }
            return this.currentGoban;
        } else {
            console.warn("goban given in param is not valid.");
            console.log(goban);
        }
    }
    _getConnectedArea() {

    }
    _createTurnHistory() {
        this.history[this.turnCount] = {};
        this.history[this.turnCount].isUsableForStrikeKo = [];
    }
    _putAtari(slot) {
        slot.isAtari = true;
        console.log(`slot position ${slot.x},${slot.y} is in Atari`);
        this.dataTurn.atariList.push(slot);
    }

    /**
     * Kills the stone
     * @param slot {SlotModel}
     * @private
     */
    _killSingleSlot(slot) {
        /**
         * Here we're gonna reset the slot state so it can be refilled if possible.
         */
        slot.killReset(this.lastKilledBy);
        console.log(`slot position ${slot.x},${slot.y} is dead`);
        this.dataTurn.deathList.push(slot);
    }

    _getAdjacentSlots(slot) {
        /**
         *  In the case we're dealing slots close the bounds of the goban,
         *  x1 and y1 might are undefined because the slot after simply doesn't exist.
         *  Be careful to test if properties exist when you use this function.
         */
        const x = slot ? parseInt(slot.x) : null;
        const y = slot ? parseInt(slot.y) : null;
        let goban = this.currentGoban;
        /**
         * I parse x and y as int, and make the calculations aside
         * because it can be interpreted as a concatenation
         * 1 + 1 can result as 11 instead of 2
         * @type {{x1: {SlotModel}, x2: {SlotModel}, y1: {SlotModel}, y2: {SlotModel}}}
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
                    this.lastReference = sibling.belongsTo;
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
        this.lastKilledBy = "";
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
                killedBy = sibling.belongsTo;
                this.lastKilledBy = killedBy
            }
        }
        return killedBy;
    }

    /**
     *
     * @param {Array} slots : An array of {SlotModel]
     * @param {SlotModel} referenceSlot The reference slot. We'll compare the others slots to know if they belong to the same player
     * @returns {boolean|*}
     * @private
     */
    _isEye(slots,referenceSlot) {
        let reference = referenceSlot.belongsTo;
        let i = 0;
        // We want at least 2 slots
        slots.forEach(function(slot) {
            if(slot && slot.isFilled) {
                i++;
            }
        });
        let isEye = slots.every((slot)=> {
            let response;
            if(!slot) {
                response = true;
            } else {
                response = !!(slot && slot.isFilled && slot.belongsTo == reference);
            }
            return response;
        });
        return isEye && i>=3;
    }

    /**
     * Returns object composed of EyeModel
     * if the slot given in parameter is a part of an eye in relation to a side of an eye (on the left, right..)
     * the side property (again, left, right...) will be a EyeModel composed of SlotModel objects
     * @param slot
     * @private
     */
    _getEyesAround(slot) {
        let sideEye = (side) => {
            let goban = this.currentGoban;
            let firstSibling,secondSibling,thirdSibling;
            if(side=="left") {
                firstSibling = goban[(slot.x-1)+","+(slot.y-1)];
                secondSibling = goban[(slot.x-1)+","+(slot.y+1)];
                thirdSibling = goban[(slot.x-2)+","+slot.y];
            } else if(side=="right") {
                firstSibling = goban[(slot.x+1)+","+(slot.y-1)];
                secondSibling = goban[(slot.x+1)+","+(slot.y+1)];
                thirdSibling = goban[(slot.x+2)+","+(slot.y)];
            } else if(side=="top") {
                firstSibling = goban[(slot.x+1)+","+(slot.y-1)];
                secondSibling = goban[(slot.x-1)+","+(slot.y-1)];
                thirdSibling = goban[(slot.x)+","+(slot.y-2)];
            } else if(side=="bottom") {
                firstSibling = goban[(slot.x+1)+","+(slot.y+1)];
                secondSibling = goban[(slot.x-1)+","+(slot.y+1)];
                thirdSibling = goban[(slot.x)+","+(slot.y+2)];
            }
            if(this._isEye([firstSibling,secondSibling,thirdSibling],slot)) {
                return new EyeModel([slot,firstSibling,secondSibling,thirdSibling]);
            } else {
                return false;
            }
        };
        const sides = {
            left: false,
            right: false,
            top: false,
            bottom: false
        };
        for(let side in sides) {
            let eye = sideEye(side);
            if(eye) {
                sides[side] = eye;
            }
        }
        return sides;
    }
    _hasKoOpportunity(slot) {
        let eyes = this._getEyesAround(slot);
        let returned;
        for(let key in eyes) {
            let eyeModel = eyes[key];
            if(eyeModel && !this._isCheckedEye(eyeModel)) {
                console.log("New eye");
                for(let i = 0; i < eyeModel.eye.length; i++) {
                    let currentSlot = eyeModel.eye[i];
                    // This is ko. Stone is in atari and is not usable for a ko strike
                    if(this._isAtari(currentSlot) && (currentSlot.isUsableForStrikeKo>=this.turnCount-2 || currentSlot.isUsableForStrikeKo==0)) {
                        // console.log(currentSlot);
                        this.lastKoOpportunity = this.currentGoban[eyeModel.centerCoords.x+","+eyeModel.centerCoords.y];
                        returned = true;
                    }
                }
                this.dataTurn.eyes.push(eyeModel);
                return returned;
            } else if(eyeModel && this._isCheckedEye(eyeModel)) {
                console.log("I already have this eye stored.")
            }
        }
    }

    /**
     * Allows to check if we have a stored EyeModel with the same id of the one given in parameter
     * @param eye {EyeModel}
     * @returns {boolean}
     * @private
     */
    _isCheckedEye(eye) {
        let checked = false;
        this.dataTurn.eyes.forEach((storedEye) => {
            if(storedEye.id==eye.id) {
                checked = true;
            }
        });
        return checked
    }

    _initKoStrike(slot) {
        const adjacentSlots = this._getAdjacentSlots(slot);
        let sibling;
        for (let key in adjacentSlots) {
            sibling = adjacentSlots[key];
            if (sibling && sibling.isFilled && sibling.belongsTo !== slot.belongsTo && this._isAtari(sibling)) {
                sibling.hasKoOpportunity = false;
                slot.isUsableForStrikeKo = this.turnCount+2;
            }
        }
    }
}



export default new RulesManager()