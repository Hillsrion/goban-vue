/**
 * Created by Ismaël on 02/04/2017.
 */
export default class GroupModel {
    /**
     *
     * @param slots {Array} An Array of objects {SlotModel}
     * @param turn {Number} The turn when the group is created.
     */
    constructor(slots,turn) {
        this.slots = slots;
        this.slug = "group";
        this.createdAtTurn = turn;
        this.id = Date.now();
        this.isAtari = false;
        this.isDead = false;
        this.belongsTo = null;
        this._insertRelationShips();
        // console.log("created group. id is"+this.id);
    }

    /**
     * Adds one or many slots to the group.
     * @param slots {Array | Object} The slot(s) to add to the group
     */
    add(slots) {
        if(slots) {
            if(Array.isArray(slots)) {
                this.slots.concat(slots);
                this._insertRelationShips(slots);
            } else if(typeof slots === 'object') {
                this.slots.push(slots);
                this._insertSingleRelationship(slots);
            } else {
                console.warn(`Can't add these slots to the group. Value : ${slots}`);
            }
        } else {
            console.warn(`Can't add a falsy value to the group. Value : ${slots}`);
        }
    }

    /**
     * Verify if the slot in parameter belongs to the group.
     * @param slot {SlotModel}
     */
    has(slot) {
        return this.slots.some(function (internalSlot) {
            return internalSlot.getCoords()==slot.getCoords();
        })
    }
    _insertRelationShips(slots) {
        let pickedSlots;
        if(!slots) {
            pickedSlots = this.slots;
        } else {
            pickedSlots = slots;
        }
        for(let key in pickedSlots) {
            if(pickedSlots[key]) {
                let slot = pickedSlots[key];
                // Defining group owner if still not defined
                if(!this.belongsTo) {
                    this.belongsTo = slot.belongsTo;
                }
                if(slot) {
                    this._insertSingleRelationship(slot);
                }
            }
        }
    }
    _insertSingleRelationship(slot) {
        slot.relationships[this.slug] = {id: this.id, turn: this.createdAtTurn};
    }
}